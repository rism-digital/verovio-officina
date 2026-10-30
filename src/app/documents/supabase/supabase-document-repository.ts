import type { User } from "@supabase/supabase-js";
import type {
    CloudDocumentRepository,
    CloudUser,
    ScoreDocument,
} from "../document-repository";
import {
    getSupabaseClient,
    isSupabaseConfigured,
} from "./client";

const DEFAULT_BUCKET = "scores";
const DEFAULT_USER_QUOTA_MB = 20;
const LIST_PAGE_SIZE = 1000;
const PASSWORD_RECOVERY_QUERY = "cloud-password-recovery";

type StorageObject = {
    name: string;
    metadata?: Record<string, unknown> | null;
    updated_at?: string | null;
    created_at?: string | null;
};

function configuredQuotaBytes(): number {
    const configured = import.meta.env.VITE_SUPABASE_USER_QUOTA_MB?.trim();
    const quotaMb = configured ? Number(configured) : DEFAULT_USER_QUOTA_MB;
    if (!Number.isFinite(quotaMb) || quotaMb <= 0) {
        console.warn(
            "Invalid VITE_SUPABASE_USER_QUOTA_MB; using the 20 MB default.",
        );
        return DEFAULT_USER_QUOTA_MB * 1024 * 1024;
    }
    return Math.floor(quotaMb * 1024 * 1024);
}

function objectSize(object: StorageObject): number {
    const size = Number(object.metadata?.size ?? 0);
    return Number.isFinite(size) && size > 0 ? size : 0;
}

function formatMegabytes(bytes: number): string {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function passwordRecoveryUrl(): string {
    const url = new URL(window.location.href);
    url.hash = "";
    url.searchParams.set(PASSWORD_RECOVERY_QUERY, "1");
    return url.toString();
}

function isPasswordRecoveryUrl(): boolean {
    return new URL(window.location.href).searchParams.get(
        PASSWORD_RECOVERY_QUERY,
    ) === "1";
}

function clearPasswordRecoveryUrl(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete(PASSWORD_RECOVERY_QUERY);
    window.history.replaceState(null, "", url);
}

function cloudUser(user: User | null): CloudUser | null {
    return user
        ? { id: user.id, email: user.email ?? null }
        : null;
}

function safeObjectName(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) throw new Error("Enter a document name.");
    const withoutExtension = trimmed.replace(/\.mei$/i, "");
    const safeName = withoutExtension
        .replace(/[\\/]/g, "-")
        .replace(/[\u0000-\u001f\u007f]/g, "")
        .trim();
    if (!safeName) throw new Error("Enter a valid document name.");
    return `${safeName}.mei`;
}

function assertObjectId(id: string): string {
    if (!id || id.includes("/") || id.includes("\\")) {
        throw new Error("Invalid cloud document id.");
    }
    return id;
}

export function createSupabaseDocumentRepository():
    CloudDocumentRepository | null {
    if (!isSupabaseConfigured()) return null;

    const client = getSupabaseClient();
    const bucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET?.trim()
        || DEFAULT_BUCKET;
    const quotaBytes = configuredQuotaBytes();

    async function requireUser(): Promise<User> {
        const { data, error } = await client.auth.getUser();
        if (error) throw error;
        if (!data.user) throw new Error("Sign in to use cloud storage.");
        return data.user;
    }

    function objectPath(userId: string, id: string): string {
        return `${userId}/${assertObjectId(id)}`;
    }

    async function listUserObjects(userId: string): Promise<StorageObject[]> {
        const objects: StorageObject[] = [];
        let offset = 0;

        while (true) {
            const { data, error } = await client.storage
                .from(bucket)
                .list(userId, {
                    limit: LIST_PAGE_SIZE,
                    offset,
                    sortBy: { column: "updated_at", order: "desc" },
                });
            if (error) throw error;
            objects.push(...data);
            if (data.length < LIST_PAGE_SIZE) break;
            offset += LIST_PAGE_SIZE;
        }

        return objects;
    }

    return {
        quotaBytes,

        async currentUser() {
            const { data, error } = await client.auth.getUser();
            if (error) throw error;
            return cloudUser(data.user);
        },

        onUserChange(listener) {
            const { data } = client.auth.onAuthStateChange((_event, session) => {
                // Run outside Supabase's auth callback lock. The listener may
                // immediately issue authenticated Storage requests.
                window.setTimeout(() => {
                    listener(cloudUser(session?.user ?? null));
                }, 0);
            });
            return () => data.subscription.unsubscribe();
        },

        async requestMagicLink(email) {
            const { error } = await client.auth.signInWithOtp({
                email: email.trim(),
                options: { emailRedirectTo: window.location.href.split("#")[0] },
            });
            if (error) throw error;
        },

        async requestPasswordReset(email) {
            const { error } = await client.auth.resetPasswordForEmail(
                email.trim(),
                { redirectTo: passwordRecoveryUrl() },
            );
            if (error) throw error;
        },

        async signInWithPassword(email, password) {
            const { error } = await client.auth.signInWithPassword({
                email: email.trim(),
                password,
            });
            if (error) throw error;
        },

        async setPassword(password) {
            await requireUser();
            const { error } = await client.auth.updateUser({ password });
            if (error) throw error;
        },

        isPasswordRecovery() {
            return isPasswordRecoveryUrl();
        },

        completePasswordRecovery() {
            clearPasswordRecoveryUrl();
        },

        async signOut() {
            const { error } = await client.auth.signOut();
            if (error) throw error;
        },

        async list() {
            const user = await requireUser();
            const objects = await listUserObjects(user.id);
            return objects
                .filter((entry) => entry.name.toLowerCase().endsWith(".mei"))
                .map((entry) => ({
                    id: entry.name,
                    name: entry.name,
                    updatedAt: entry.updated_at ?? entry.created_at ?? null,
                    sizeBytes: objectSize(entry),
                }));
        },

        async load(id) {
            const user = await requireUser();
            const { data, error } = await client.storage
                .from(bucket)
                .download(objectPath(user.id, id));
            if (error) throw error;
            return data.text();
        },

        async save(id, name, mei) {
            const user = await requireUser();
            const objectName = id ? assertObjectId(id) : safeObjectName(name);
            const blob = new Blob([mei], { type: "application/mei+xml" });
            const objects = await listUserObjects(user.id);
            const existingSize = objectSize(
                objects.find((object) => object.name === objectName)
                    ?? { name: objectName },
            );
            const usedBytes = objects.reduce(
                (total, object) => total + objectSize(object),
                0,
            );
            const projectedBytes = usedBytes - existingSize + blob.size;

            if (projectedBytes > quotaBytes) {
                throw new Error(
                    `Storage quota exceeded: this save would use ${formatMegabytes(projectedBytes)} of ${formatMegabytes(quotaBytes)}.`,
                );
            }

            const { error } = await client.storage
                .from(bucket)
                .upload(
                    objectPath(user.id, objectName),
                    blob,
                    { contentType: "application/mei+xml", upsert: true },
                );
            if (error) throw error;
            return {
                id: objectName,
                name: objectName,
                updatedAt: new Date().toISOString(),
                sizeBytes: blob.size,
            };
        },

        async delete(id) {
            const user = await requireUser();
            const { error } = await client.storage
                .from(bucket)
                .remove([objectPath(user.id, id)]);
            if (error) throw error;
        },
    };
}
