/* =========================================================
   ADDY — FAST LIBRARY
========================================================= */

let allFiles = [];
let currentCategory = "all";
let isLoaded = false;
let isLoading = false;

const fileGrid = document.getElementById("fileGrid");
const fileCount = document.getElementById("fileCount");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");


/* =========================================================
   START
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    setupSearch();
    setupCategories();
    setupMobileMenu();
    loadFiles();
});


/* =========================================================
   LOAD FILES
========================================================= */

async function loadFiles() {
    if (isLoading) return;
    isLoading = true;

    showLoading();

    const timeout = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("Supabase request timed out. Check your database/RLS policies."));
        }, 10000);
    });

    const request = supabaseClient
        .from("files")
        .select(`
            id,
            title,
            description,
            category,
            file_name,
            file_path,
            file_type,
            file_size,
            created_at
        `)
        .order("created_at", { ascending: false });

    try {
        const { data, error } = await Promise.race([request, timeout]);

        if (error) {
            console.error("ADDY Supabase ERROR:", error);
            showError(error.message || "Could not load files.");
            return;
        }

        allFiles = Array.isArray(data) ? data : [];
        isLoaded = true;

        hideLoading();
        renderFiles(allFiles);

    } catch (error) {
        console.error("ADDY LOAD ERROR:", error);
        showError(error.message || "Unable to connect to Supabase.");
    } finally {
        isLoading = false;
    }
}


/* =========================================================
   LOADING
========================================================= */

function showLoading() {
    if (loading) loading.classList.remove("hidden");
}

function hideLoading() {
    if (loading) loading.classList.add("hidden");
}


/* =========================================================
   RENDER
========================================================= */

function renderFiles(files) {
    if (!fileGrid) return;

    fileGrid.innerHTML = "";

    if (fileCount) {
        fileCount.textContent = `${files.length} ${files.length === 1 ? "file" : "files"}`;
    }

    if (!files.length) {
        if (emptyState) emptyState.classList.remove("hidden");
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    const fragment = document.createDocumentFragment();

    files.forEach((file, index) => {
        const card = document.createElement("article");
        card.className = "file-card";
        card.style.animationDelay = `${Math.min(index * 30, 300)}ms`;

        const type = getFileType(file);
        const icon = getFileIcon(type);
        const name = file.title || file.file_name || "Untitled file";
        const description = file.description || "Study material from ADDY.";
        const size = formatSize(file.file_size);
        const url = getFileUrl(file);

        card.innerHTML = `
            <div class="file-icon">
                ${icon}
            </div>

            <h3>${escapeHTML(name)}</h3>

            <p class="file-description">
                ${escapeHTML(description)}
            </p>

            <div class="file-meta">
                ${escapeHTML(type.toUpperCase())}
                ${size ? ` • ${escapeHTML(size)}` : ""}
            </div>

            ${
                url
                ? `<a class="download-button" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">DOWNLOAD</a>`
                : `<button class="download-button" disabled>FILE UNAVAILABLE</button>`
            }
        `;

        fragment.appendChild(card);
    });

    fileGrid.appendChild(fragment);
}


/* =========================================================
   FILE TYPE
========================================================= */

function getFileType(file) {
    const filename = file.file_name || file.title || "";
    const parts = filename.split(".");

    if (parts.length > 1) {
        return parts.pop().toLowerCase();
    }

    if (file.file_type) {
        const mime = file.file_type.toLowerCase();
        if (mime.includes("pdf")) return "pdf";
        if (mime.includes("word")) return "docx";
        if (mime.includes("sheet")) return "xlsx";
        if (mime.includes("presentation")) return "pptx";
        if (mime.includes("text")) return "txt";
    }

    return "other";
}


/* =========================================================
   ICONS
========================================================= */

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
        zip: "📦"
    };
    return icons[type] || "📎";
}


/* =========================================================
   FILE SIZE
========================================================= */

function formatSize(bytes) {
    if (bytes === null || bytes === undefined || bytes === 0) return "";

    const units = ["B", "KB", "MB", "GB"];
    let size = Number(bytes);
    let index = 0;

    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index++;
    }

    return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}


/* =========================================================
   STORAGE URL
========================================================= */

function getFileUrl(file) {
    const path = file.file_path || file.path;
    if (!path) return null;

    const { data } = supabaseClient
        .storage
        .from(SUPABASE_BUCKET)
        .getPublicUrl(path);

    return data?.publicUrl || null;
}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {
    if (!searchInput) return;

    searchInput.addEventListener("input", filterFiles);

    if (clearSearch) {
        clearSearch.addEventListener("click", () => {
            searchInput.value = "";
            filterFiles();
            searchInput.focus();
        });
    }
}

function filterFiles() {
    const query = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    if (clearSearch) {
        clearSearch.style.display = query ? "flex" : "none";
    }

    const filtered = allFiles.filter(file => {
        const name = String(file.title || file.file_name || "").toLowerCase();
        const description = String(file.description || "").toLowerCase();
        const type = getFileType(file);
        const category = String(file.category || "").toLowerCase();

        const searchMatch =
            !query ||
            name.includes(query) ||
            description.includes(query) ||
            type.includes(query) ||
            category.includes(query);

        const categoryMatch =
            currentCategory === "all" ||
            type === currentCategory ||
            category === currentCategory;

        return searchMatch && categoryMatch;
    });

    renderFiles(filtered);
}


/* =========================================================
   CATEGORIES
========================================================= */

function setupCategories() {
    document.querySelectorAll(".category").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".category").forEach(btn => {
                btn.classList.remove("active");
            });
            button.classList.add("active");
            currentCategory = button.dataset.category;
            filterFiles();
        });
    });
}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {
    const menu = document.querySelector(".mobile-menu");
    const nav = document.querySelector(".nav-links");
    if (!menu || !nav) return;

    menu.addEventListener("click", () => {
        nav.classList.toggle("open");
    });
}


/* =========================================================
   ERROR
========================================================= */

function showError(message) {
    hideLoading();
    if (!fileGrid) return;

    fileGrid.innerHTML = `
        <div class="empty-state">
            <div class="empty-notebook">⚠</div>
            <h3>Library connection failed</h3>
            <p>${escapeHTML(message)}</p>
            <button class="download-button" id="retryButton" style="margin-top:20px;max-width:200px;">
                TRY AGAIN
            </button>
        </div>
    `;

    if (fileCount) fileCount.textContent = "0 files";

    const retry = document.getElementById("retryButton");
    if (retry) {
        retry.addEventListener("click", () => {
            isLoading = false;
            loadFiles();
        });
    }
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
