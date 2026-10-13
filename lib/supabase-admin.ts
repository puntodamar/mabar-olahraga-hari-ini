import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let adminClient: SupabaseClient | null = null

export function getSupabaseAdmin() {
    if (!adminClient) {
        const secretKey =
            process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!secretKey) {
            throw new Error("SUPABASE_SECRET_KEY is not set; cannot perform admin writes.")
        }

        adminClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            secretKey,
            { auth: { persistSession: false, autoRefreshToken: false } }
        )
    }

    return adminClient
}