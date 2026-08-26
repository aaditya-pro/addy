document.addEventListener("DOMContentLoaded", async () => {

    const fileGrid = document.getElementById("fileGrid");
    const loading = document.getElementById("loading");
    const emptyState = document.getElementById("emptyState");
    const fileCount = document.getElementById("fileCount");
    const searchInput = document.getElementById("searchInput");

    let files = [];
    let currentCategory = "all";

    /* =========================
       SUPABASE
    ========================= */

    if (!window.supabase) {
        showError("Supabase library failed to load.");
        return;
    }

    if (
        typeof SUPABASE_URL === "undefined" ||
        typeof SUPABASE_ANON_KEY === "undefined"
    ) {
        showError("Supabase configuration not found.");
        return;
    }

    const supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

    /* =========================
       LOAD FILES
    ========================= */

    async function loadFiles() {

        loading.classList.remove("hidden");
        emptyState.classList.add("hidden");
        fileGrid.innerHTML = "";

        try {

            const { data, error } = await supabaseClient
                .from("files")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                throw error;
            }

            files = data || [];

            loading.classList.add("hidden");

            updateCount(files.length);

            renderFiles();

        } catch (error) {

            console.error("File loading error:", error);

            loading.classList.add("hidden");

            showError(
                "Unable to load your library. Please try again."
            );
        }
    }

    /* =========================
       RENDER
    ========================= */

    function renderFiles() {

        const searchTerm =
            searchInput?.value.trim().toLowerCase() || "";

        const filtered = files.filter(file => {

            const name = String(
                file.name ||
                file.title ||
                file.file_name ||
                ""
            ).toLowerCase();

            const description = String(
                file.description || ""
            ).toLowerCase();

            const category =
                getCategory(file);

            const categoryMatch =
                currentCategory === "all" ||
                category === currentCategory;

            const searchMatch =
                !searchTerm ||
                name.includes(searchTerm) ||
                description.includes(searchTerm);

            return categoryMatch && searchMatch;
        });

        fileGrid.innerHTML = "";

        if (!filtered.length) {

            emptyState.classList.remove("hidden");

            return;
        }

        emptyState.classList.add("hidden");

        filtered.forEach((file, index) => {

            const card =
                createFileCard(file, index);

            fileGrid.appendChild(card);
        });
    }

    /* =========================
       FILE CARD
    ========================= */

    function createFileCard(file, index) {

        const card =
            document.createElement("article");

        card.className = "file-card";

        card.style.animationDelay =
            `${index * 70}ms`;

        const name =
            file.name ||
            file.title ||
            file.file_name ||
            "Untitled file";

        const description =
            file.description ||
            "Study material from ADDY.";

        const category =
            getCategory(file);

        const extension =
            getExtension(file);

        const icon =
            getIcon(extension);

        const size =
            formatSize(
                file.size ||
                file.file_size ||
                0
            );

        const downloadURL =
            getDownloadURL(file);

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
                <span>${extension.toUpperCase()}</span>
                <span>•</span>
                <span>${size}</span>
            </div>

            <a
                class="download-button"
                href="${downloadURL}"
                target="_blank"
                rel="noopener noreferrer"
                download
            >
                ↓ DOWNLOAD
            </a>
        `;

        return card;
    }

    /* =========================
       DOWNLOAD URL
    ========================= */

    function getDownloadURL(file) {

        if (file.url) {
            return file.url;
        }

        if (file.download_url) {
            return file.download_url;
        }

        if (file.file_url) {
            return file.file_url;
        }

        const path =
            file.path ||
            file.file_path ||
            file.storage_path;

        if (!path) {
            return "#";
        }

        const {
            data
        } = supabaseClient.storage
            .from("addy-files")
            .getPublicUrl(path);

        return data?.publicUrl || "#";
    }

    /* =========================
       CATEGORY
    ========================= */

    function getCategory(file) {

        if (file.category) {
            return String(
                file.category
            ).toLowerCase();
        }

        const extension =
            getExtension(file);

        if (
            extension === "pdf" ||
            extension === "docx" ||
            extension === "xlsx" ||
            extension === "pptx"
        ) {
            return extension;
        }

        return "other";
    }

    /* =========================
       EXTENSION
    ========================= */

    function getExtension(file) {

        const filename =
            file.name ||
            file.title ||
            file.file_name ||
            file.path ||
            "";

        const parts =
            String(filename).split(".");

        if (parts.length < 2) {
            return "other";
        }

        return parts.pop().toLowerCase();
    }

    /* =========================
       ICON
    ========================= */

    function getIcon(extension) {

        const icons = {
            pdf: "📕",
            docx: "📘",
            xlsx: "📊",
            pptx: "📽️",
            doc: "📘",
            xls: "📊",
            ppt: "📽️"
        };

        return icons[extension] || "📎";
    }

    /* =========================
       FILE SIZE
    ========================= */

    function formatSize(bytes) {

        if (!bytes || bytes <= 0) {
            return "File";
        }

        const units = [
            "B",
            "KB",
            "MB",
            "GB"
        ];

        let size = Number(bytes);
        let unit = 0;

        while (
            size >= 1024 &&
            unit < units.length - 1
        ) {
            size /= 1024;
            unit++;
        }

        return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
    }

    /* =========================
       COUNT
    ========================= */

    function updateCount(count) {

        if (!fileCount) return;

        fileCount.textContent =
            `${count} ${count === 1 ? "file" : "files"}`;
    }

    /* =========================
       SEARCH
    ========================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderFiles
        );

        document.addEventListener(
            "keydown",
            event => {

                if (
                    (event.metaKey || event.ctrlKey) &&
                    event.key.toLowerCase() === "k"
                ) {

                    event.preventDefault();

                    searchInput.focus();
                }

                if (
                    event.key === "Escape" &&
                    document.activeElement === searchInput
                ) {

                    searchInput.value = "";

                    renderFiles();

                    searchInput.blur();
                }
            }
        );
    }

    /* =========================
       CATEGORIES
    ========================= */

    document
        .querySelectorAll(".category")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".category")
                        .forEach(btn =>
                            btn.classList.remove("active")
                        );

                    button.classList.add("active");

                    currentCategory =
                        button.dataset.category ||
                        "all";

                    renderFiles();
                }
            );
        });

    /* =========================
       SCROLL ANIMATION
    ========================= */

    const revealElements =
        document.querySelectorAll(
            ".hero, .library-section, .file-card, footer"
        );

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }
                    });

                },
                {
                    threshold: 0.08
                }
            );

        revealElements.forEach(
            element =>
                observer.observe(element)
        );
    }

    /* =========================
       SAFE HTML
    ========================= */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* =========================
       ERROR
    ========================= */

    function showError(message) {

        fileGrid.innerHTML = `
            <div class="error-state">
                <div>⚠</div>

                <h3>
                    Something went wrong
                </h3>

                <p>
                    ${escapeHTML(message)}
                </p>
            </div>
        `;

        emptyState.classList.add("hidden");
    }

    /* =========================
       START
    ========================= */

    await loadFiles();

});
