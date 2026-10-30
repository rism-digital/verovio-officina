import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabasePublishableKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
    return Boolean(supabaseUrl && supabasePublishableKey);
}

export function getSupabaseClient(): SupabaseClient {
    if (!supabaseUrl || !supabasePublishableKey) {
        throw new Error(
            "Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to enable cloud storage.",
        );
    }
    client ??= createClient(supabaseUrl, supabasePublishableKey);
    return client;
}
