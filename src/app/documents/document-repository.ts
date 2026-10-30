export type CloudUser = {
    id: string;
    email: string | null;
};

export type ScoreDocument = {
    id: string;
    name: string;
    updatedAt: string | null;
    sizeBytes: number;
};

export interface CloudDocumentRepository {
    readonly quotaBytes: number | null;
    currentUser(): Promise<CloudUser | null>;
    onUserChange(listener: (user: CloudUser | null) => void): () => void;
    requestMagicLink(email: string): Promise<void>;
    requestPasswordReset(email: string): Promise<void>;
    signInWithPassword(email: string, password: string): Promise<void>;
    setPassword(password: string): Promise<void>;
    isPasswordRecovery(): boolean;
    completePasswordRecovery(): void;
    signOut(): Promise<void>;
    list(): Promise<ScoreDocument[]>;
    load(id: string): Promise<string>;
    save(
        id: string | null,
        name: string,
        mei: string,
    ): Promise<ScoreDocument>;
    delete(id: string): Promise<void>;
}
