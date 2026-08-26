document.addEventListener("DOMContentLoaded", async () => {

    const fileGrid = document.getElementById("fileGrid");
    const loading = document.getElementById("loading");
    const emptyState = document.getElementById("emptyState");
    const fileCount = document.getElementById("fileCount");
    const searchInput = document.getElementById("searchInput");
    const categories = document.querySelectorAll(".category");

    let files = [];
    let activeCategory = "all";

    /* =========================
       SUPABASE CHECK
    ========================= */

    if (!window.supabaseClient) {
        showError("Supabase configuration not found");
        return;
    }

    /* =========================
       LOAD FILES
    ========================= */

    async function loadFiles() {

        try {

            loading?.classList.remove("hidden");

            const { data, error } =
                await window.supabaseClient
                    .from("files")
                    .select("*")
                    .order("created_at", {
                        ascending: false
                    });

            if (error) {

                console.error(
                    "Supabase database error:",
                    error
                );

                showError("Unable to load your notes");
                return;
            }

            files = data || [];

            renderFiles();

        } catch (error) {

            console.error(error);

            showError("Something went wrong");

        } finally {

            loading?.classList.add("hidden");
        }
    }

    /* =========================
       RENDER
    ========================= */

    function renderFiles() {

        const search =
            searchInput?.value
                .trim()
                .toLowerCase() || "";

        const filtered =
            files.filter(file => {

                const title =
                    String(
                        file.title ||
                        file.name ||
                        file.file_name ||
                        ""
                    ).toLowerCase();

                const description =
                    String(
                        file.description || ""
                    ).toLowerCase();

                const category =
                    getCategory(file);

                const searchMatch =
                    !search ||
                    title.includes(search) ||
                    description.includes(search);

                const categoryMatch =
                    activeCategory === "all" ||
                    category === activeCategory;

                return (
                    searchMatch &&
                    categoryMatch
                );
            });


        fileGrid.innerHTML = "";

        if (fileCount) {

            fileCount.textContent =
                `${filtered.length} ${
                    filtered.length === 1
                        ? "file"
                        : "files"
                }`;
        }


        if (!filtered.length) {

            emptyState?.classList.remove("hidden");

            return;
        }

        emptyState?.classList.add("hidden");


        filtered.forEach((file, index) => {

            const card =
                createCard(file, index);

            fileGrid.appendChild(card);
        });
    }

    /* =========================
       FILE CARD
    ========================= */

    function createCard(file, index) {

        const card =
            document.createElement("article");

        card.className = "file-card";

        card.style.animationDelay =
            `${index * 0.06}s`;


        const title =
            file.title ||
            file.name ||
            file.file_name ||
            "Untitled";


        const description =
            file.description ||
            "Study material from ADDY.";


        const category =
            getCategory(file);


        const icon =
            getIcon(category);


        const url =
            getFileURL(file);


        const size =
            formatSize(
                file.size ||
                file.file_size
            );


        card.innerHTML = `

            <div class="file-type">
                ${icon}
            </div>

            <h3>
                ${escapeHTML(title)}
            </h3>

            <p class="file-description">
                ${escapeHTML(description)}
            </p>

            <div class="file-info">

                ${category.toUpperCase()}

                ${
                    size
                        ? ` • ${size}`
                        : ""
                }

            </div>

            ${
                url
                    ? `
                    <a
                        href="${escapeHTML(url)}"
                        class="download-button"
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

        return card;
    }

    /* =========================
       CATEGORY
    ========================= */

    function getCategory(file) {

        const value =
            String(
                file.category ||
                file.type ||
                file.file_type ||
                file.mime_type ||
                file.title ||
                file.name ||
                ""
            ).toLowerCase();


        if (value.includes("pdf"))
            return "pdf";

        if (
            value.includes("doc") ||
            value.includes("word")
        )
            return "docx";

        if (
            value.includes("xls") ||
            value.includes("sheet")
        )
            return "xlsx";

        if (
            value.includes("ppt") ||
            value.includes("presentation")
        )
            return "pptx";

        return "other";
    }


    function getIcon(category) {

        const icons = {

            pdf: "📕",

            docx: "📘",

            xlsx: "📊",

            pptx: "📽️",

            other: "📎"
        };

        return icons[category] || "📎";
    }

    /* =========================
       FILE URL
    ========================= */

    function getFileURL(file) {

        /* If database already stores URL */

        if (file.url)
            return file.url;

        if (file.file_url)
            return file.file_url;

        if (file.download_url)
            return file.download_url;

        if (file.public_url)
            return file.public_url;


        /* Storage path */

        const path =
            file.path ||
            file.file_path ||
            file.storage_path ||
            file.filename;


        if (!path)
            return "";


        const { data } =
            window.supabaseClient
                .storage
                .from(SUPABASE_BUCKET)
                .getPublicUrl(path);


        return data?.publicUrl || "";
    }

    /* =========================
       SIZE
    ========================= */

    function formatSize(bytes) {

        if (!bytes)
            return "";

        let size = Number(bytes);

        const units =
            ["B", "KB", "MB", "GB"];

        let unit = 0;

        while (
            size >= 1024 &&
            unit < units.length - 1
        ) {

            size /= 1024;

            unit++;
        }

        return `${size.toFixed(
            size >= 10 ? 1 : 2
        )} ${units[unit]}`;
    }

    /* =========================
       SEARCH
    ========================= */

    searchInput?.addEventListener(
        "input",
        renderFiles
    );


    /* =========================
       CATEGORIES
    ========================= */

    categories.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                categories.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );

                button.classList.add("active");

                activeCategory =
                    button.dataset.category ||
                    "all";

                renderFiles();
            }
        );
    });


    /* =========================
       COMMAND + K
    ========================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.metaKey ||
                    event.ctrlKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                searchInput?.focus();
            }


            if (
                event.key === "Escape" &&
                document.activeElement ===
                    searchInput
            ) {

                searchInput.value = "";

                renderFiles();

                searchInput.blur();
            }
        }
    );


    /* =========================
       ERROR
    ========================= */

    function showError(message) {

        loading?.classList.add("hidden");

        if (!fileGrid)
            return;

        fileGrid.innerHTML = `

            <div class="error-state">

                <div>⚠</div>

                <h3>
                    ${escapeHTML(message)}
                </h3>

                <p>
                    Please try refreshing the page.
                </p>

            </div>

        `;
    }


    /* =========================
       SECURITY
    ========================= */

    function escapeHTML(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    /* =========================
       START
    ========================= */

    await loadFiles();

});
