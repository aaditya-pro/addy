let supabaseClient;
let allFiles = [];
let currentCategory = "all";

document.addEventListener("DOMContentLoaded", () => {

    /* Check Supabase */

    if (!window.supabase) {
        console.error("Supabase library was not loaded.");
        showError("Supabase library could not be loaded.");
        return;
    }

    if (
        typeof SUPABASE_URL === "undefined" ||
        typeof SUPABASE_KEY === "undefined"
    ) {
        console.error("config.js was not loaded.");
        showError("Supabase configuration is missing.");
        return;
    }

    /* Create Supabase client */

    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    console.log("✅ Supabase connected");

    loadFiles();

    if (searchInput) {
        searchInput.addEventListener("input", filterFiles);
    }

    document.querySelectorAll(".category").forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".category")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            currentCategory =
                button.dataset.category;

            filterFiles();
        });

    });

});
