const SUPABASE_URL = "https://lgisbqmqzxjtibrohrhk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_ZqcGDVfju41XbZp2_ZdlAA_iCRkviNf";

if (window.supabase && typeof window.supabase.createClient === "function") {
    window.sb = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
} else {
    console.error("Supabase library failed to load.");
}
