const SUPABASE_URL = "https://apfqxlriilkwzynozsvv.supabase.co";
const SUPABASE_KEY = "sb_publishable_AcwBiZcSMHrkfjV31JJK6A_r45OvAe4";
const SUPABASE_BUCKET = "addy-files";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let allFiles = [];
let currentCategory = "all";

const fileGrid = document.getElementById("fileGrid");
const fileCount = document.getElementById("fileCount");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");

document.addEventListener("DOMContentLoaded", () => {
    loadFiles();

    if (searchInput) {
        searchInput.addEventListener("input", filterFiles);
    }

    document.querySelectorAll(".category").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".category")
                .forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            currentCategory = button.dataset.category;

            filterFiles();
        });
    });
});


async function loadFiles() {

    loading.classList.remove("hidden");
    fileGrid.innerHTML = "";
    emptyState.classList.add("hidden");

    try {

        const { data, error } = await supabaseClient
            .from("files")
            .select("*")
            .order("created_at", {
                ascending: false
            });

        if (error) {
            console.error("Supabase database error:", error);
            showError("Could not load your files.");
            return;
        }

        allFiles = data || [];

        renderFiles(allFiles);

    } catch (error) {

        console.error("Loading error:", error);

        showError("Something went wrong while loading files.");

    } finally {

        loading.classList.add("hidden");

    }
}


function renderFiles(files) {

    fileGrid.innerHTML = "";

    if (fileCount) {
        fileCount.textContent =
            `${files.length} ${files.length === 1 ? "file" : "files"}`;
    }

    if (!files.length) {
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");

    files.forEach((file, index) => {

        const card = document.createElement("article");

        card.className = "file-card";

        card.style.animationDelay = `${index * 70}ms`;

        const type = getFileType(file);

        const icon = getFileIcon(type);

        const name =
            file.name ||
            file.file_name ||
            file.title ||
            "Untitled file";

        const description =
            file.description ||
            "Study material from ADDY.";

        const size =
            file.size ||
            file.file_size ||
            "";

        const url = getFileUrl(file);

        card.innerHTML = `
            <div class="file-type">
                ${icon}
            </div>

            <h3>
                ${escapeHTML(name)}
            </h3>

            <p class="file-description">
                ${escapeHTML(description)}
            </p>

            <div class="file-info">
                ${type.toUpperCase()}
                ${size ? `• ${escapeHTML(String(size))}` : ""}
            </div>

            ${
                url
                ? `
                <a
                    class="download-button"
                    href="${url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                >
                    ↓ DOWNLOAD
                </a>
                `
                : `
                <button
                    class="download-button"
                    disabled
                >
                    FILE UNAVAILABLE
                </button>
                `
            }
        `;

        fileGrid.appendChild(card);
    });

    observeCards();
}


function getFileType(file) {

    if (file.type) {
        return file.type.toLowerCase().replace(".", "");
    }

    if (file.file_type) {
        return file.file_type.toLowerCase().replace(".", "");
    }

    if (file.name) {
        const parts = file.name.split(".");

        if (parts.length > 1) {
            return parts.pop().toLowerCase();
        }
    }

    if (file.file_name) {
        const parts = file.file_name.split(".");

        if (parts.length > 1) {
            return parts.pop().toLowerCase();
        }
    }

    return "other";
}


function getFileIcon(type) {

    const icons = {
        pdf: "📕",
        doc: "📘",
        docx: "📘",
        xls: "📊",
        xlsx: "📊",
        ppt: "📽️",
        pptx: "📽️",
        txt: "📎",
        zip: "📎"
    };

    return icons[type] || "📎";
}


function getFileUrl(file) {

    if (file.url) {
        return file.url;
    }

    if (file.file_url) {
        return file.file_url;
    }

    if (file.path) {

        const {
            data
        } = supabaseClient
            .storage
            .from(SUPABASE_BUCKET)
            .getPublicUrl(file.path);

        return data.publicUrl;
    }

    if (file.file_path) {

        const {
            data
        } = supabaseClient
            .storage
            .from(SUPABASE_BUCKET)
            .getPublicUrl(file.file_path);

        return data.publicUrl;
    }

    return null;
}


function filterFiles() {

    const query =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

    const filtered = allFiles.filter(file => {

        const name =
            String(
                file.name ||
                file.file_name ||
                file.title ||
                ""
            ).toLowerCase();

        const description =
            String(
                file.description ||
                ""
            ).toLowerCase();

        const type = getFileType(file);

        const matchesSearch =
            !query ||
            name.includes(query) ||
            description.includes(query) ||
            type.includes(query);

        const matchesCategory =
            currentCategory === "all" ||
            type === currentCategory;

        return matchesSearch && matchesCategory;
    });

    renderFiles(filtered);
}


function showError(message) {

    loading.classList.add("hidden");

    fileGrid.innerHTML = `
        <div class="error-state">
            <div>⚠</div>

            <h3>
                Something went wrong
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

            <button
                class="download-button"
                onclick="loadFiles()"
            >
                TRY AGAIN
            </button>
        </div>
    `;

    if (fileCount) {
        fileCount.textContent = "0 files";
    }
}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* -----------------------------
   SMOOTH SCROLL
----------------------------- */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const target =
            document.querySelector(
                link.getAttribute("href")
            );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* -----------------------------
   SCROLL REVEAL
----------------------------- */

function observeCards() {

    const cards =
        document.querySelectorAll(".file-card");

    if (!("IntersectionObserver" in window)) {

        cards.forEach(card => {
            card.classList.add("visible");
        });

        return;
    }

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12
            }
        );

    cards.forEach(card => {
        observer.observe(card);
    });
}


/* -----------------------------
   COMMAND + K SEARCH
----------------------------- */

document.addEventListener("keydown", event => {

    if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
    ) {

        event.preventDefault();

        if (searchInput) {
            searchInput.focus();
        }

    }

});
