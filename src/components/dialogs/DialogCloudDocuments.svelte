<script lang="ts">
    import { onDestroy } from "svelte";
    import type {
        CloudDocumentRepository,
        CloudUser,
        ScoreDocument,
    } from "../../app/documents/document-repository";
    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let repository: CloudDocumentRepository | null = null;
    export let getCurrentMEI: (() => Promise<string>) | null = null;
    export let onOpenDocument:
        | ((mei: string, document: ScoreDocument) => void | Promise<void>)
        | null = null;
    export let onSaved:
        | ((document: ScoreDocument, mei: string) => void | Promise<void>)
        | null = null;
    export let onClose: (() => void) | null = null;

    let user: CloudUser | null = null;
    let documents: ScoreDocument[] = [];
    let selectedId: string | null = null;
    let documentName = "Untitled.mei";
    let email = "";
    let message = "";
    let busy = false;
    let initialized = false;
    let unsubscribeUser: (() => void) | null = null;
    let usedBytes = 0;

    $: usedBytes = documents.reduce(
        (total, document) => total + document.sizeBytes,
        0,
    );

    function errorMessage(error: unknown): string {
        return error instanceof Error ? error.message : String(error);
    }

    async function run(operation: () => Promise<void>) {
        if (busy) return;
        busy = true;
        message = "";
        try {
            await operation();
        } catch (error) {
            console.error("Cloud document operation failed", error);
            message = errorMessage(error);
        } finally {
            busy = false;
        }
    }

    async function refresh() {
        if (!repository || !user) return;
        documents = await repository.list();
        if (selectedId && !documents.some((item) => item.id === selectedId)) {
            startNewDocument();
        }
    }

    async function initialize() {
        if (!repository) {
            message = "Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to enable cloud storage.";
            return;
        }
        user = await repository.currentUser();
        unsubscribeUser = repository.onUserChange((nextUser) => {
            user = nextUser;
            documents = [];
            selectedId = null;
            if (nextUser) void run(refresh);
        });
        if (user) await refresh();
    }

    function reset() {
        unsubscribeUser?.();
        unsubscribeUser = null;
        user = null;
        documents = [];
        selectedId = null;
        documentName = "Untitled.mei";
        email = "";
        message = "";
        busy = false;
    }

    function startNewDocument() {
        selectedId = null;
        documentName = "Untitled.mei";
    }

    function selectDocument(document: ScoreDocument) {
        selectedId = document.id;
        documentName = document.name;
    }

    function formattedDate(value: string | null): string {
        return value ? new Date(value).toLocaleString() : "";
    }

    function formattedBytes(value: number): string {
        if (value < 1024) return `${value} B`;
        if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
        return `${(value / 1024 / 1024).toFixed(1)} MB`;
    }

    function requestMagicLink() {
        if (!repository || !email.trim()) return;
        void run(async () => {
            await repository?.requestMagicLink(email);
            message = "Check your email for the sign-in link.";
        });
    }

    function signOut() {
        if (!repository) return;
        void run(() => repository!.signOut());
    }

    function openSelectedDocument() {
        if (!repository || !selectedId) return;
        const document = documents.find((item) => item.id === selectedId);
        if (!document) return;
        void run(async () => {
            const mei = await repository!.load(document.id);
            await onOpenDocument?.(mei, document);
        });
    }

    function saveCurrentDocument() {
        if (!repository || !getCurrentMEI) return;
        void run(async () => {
            const mei = await getCurrentMEI!();
            const saved = await repository!.save(
                selectedId,
                documentName,
                mei,
            );
            selectedId = saved.id;
            documentName = saved.name;
            await refresh();
            await onSaved?.(saved, mei);
            message = `Saved ${saved.name}.`;
        });
    }

    function deleteSelectedDocument() {
        if (!repository || !selectedId) return;
        const document = documents.find((item) => item.id === selectedId);
        if (!document || !window.confirm(`Delete ${document.name}?`)) return;
        void run(async () => {
            await repository!.delete(document.id);
            startNewDocument();
            await refresh();
        });
    }

    $: if (open && !initialized) {
        initialized = true;
        void run(initialize);
    } else if (!open && initialized) {
        initialized = false;
        reset();
    }

    onDestroy(reset);
</script>

<Dialog
    {open}
    title="Cloud documents"
    icon="info"
    type="custom"
    boxClass="vrv-dialog-cloud-documents"
    onCancel={() => onClose?.()}
>
    {#if !repository}
        <p>{message}</p>
    {:else if !user}
        <div class="vrv-cloud-login">
            <label for="vrv-cloud-email">Email</label>
            <input
                id="vrv-cloud-email"
                class="vrv-form-input"
                type="email"
                bind:value={email}
                disabled={busy}
                on:keydown={(event) => {
                    if (event.key === "Enter") requestMagicLink();
                }}
            />
            <button
                class="vrv-context-action-button"
                type="button"
                disabled={busy || !email.trim()}
                on:click={requestMagicLink}
            >Send magic link</button>
        </div>
    {:else}
        <div class="vrv-cloud-account">
            <span>{user.email ?? user.id}</span>
            <button
                class="vrv-context-action-button"
                type="button"
                disabled={busy}
                on:click={signOut}
            >Sign out</button>
        </div>

        {#if repository.quotaBytes !== null}
            <div class="vrv-cloud-quota" aria-live="polite">
                Storage: {formattedBytes(usedBytes)} of
                {formattedBytes(repository.quotaBytes)}
            </div>
        {/if}

        <div class="vrv-cloud-document-list" aria-label="Cloud documents">
            {#if documents.length === 0}
                <div class="vrv-cloud-empty">No cloud documents yet.</div>
            {:else}
                {#each documents as document (document.id)}
                    <button
                        class="vrv-cloud-document"
                        class:selected={selectedId === document.id}
                        type="button"
                        on:click={() => selectDocument(document)}
                    >
                        <span>{document.name}</span>
                        <small>
                            {formattedDate(document.updatedAt)}
                            · {formattedBytes(document.sizeBytes)}
                        </small>
                    </button>
                {/each}
            {/if}
        </div>

        <div class="vrv-cloud-document-name">
            <label for="vrv-cloud-document-name">Document name</label>
            <input
                id="vrv-cloud-document-name"
                class="vrv-form-input"
                bind:value={documentName}
                disabled={busy || selectedId !== null}
            />
        </div>

        <div class="vrv-cloud-actions">
            <button
                class="vrv-context-action-button"
                type="button"
                disabled={busy || !selectedId}
                on:click={openSelectedDocument}
            >Open</button>
            <button
                class="vrv-context-action-button"
                type="button"
                disabled={busy || !documentName.trim()}
                on:click={saveCurrentDocument}
            >{selectedId ? "Save" : "Save as"}</button>
            <button
                class="vrv-context-action-button"
                type="button"
                disabled={busy || !selectedId}
                on:click={deleteSelectedDocument}
            >Delete</button>
        </div>
    {/if}

    {#if repository && message}
        <div class="vrv-cloud-message" aria-live="polite">{message}</div>
    {/if}

    <div slot="buttons">
        <button
            class="vrv-dialog-btn"
            type="button"
            disabled={busy}
            on:click={() => onClose?.()}
        >Close</button>
    </div>
</Dialog>
