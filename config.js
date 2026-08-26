const SUPABASE_URL = "https://apfqxlriilkwzynozsvv.supabase.co";
const SUPABASE_KEY = "sb_publishable_AcwBiZcSMHrkfjV31JJK6A_r45OvAe4";

const SUPABASE_BUCKET = "addy-files";

if (!window.supabase) {
    console.error("Supabase library not loaded.");
} else {
    window.supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    console.log("Supabase connected successfully.");
}
