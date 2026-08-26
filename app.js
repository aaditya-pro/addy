document.addEventListener("DOMContentLoaded", async () => {

    const fileGrid = document.getElementById("fileGrid");
    const loading = document.getElementById("loading");
    const emptyState = document.getElementById("emptyState");
    const fileCount = document.getElementById("fileCount");
    const searchInput = document.getElementById("searchInput");
    const categoryButtons = document.querySelectorAll(".category");

    let allFiles = [];
    let activeCategory = "all";

    /* =========================
       SUPABASE
    ========================= */

    if (!window.supabase) {
        showError("Supabase library not loaded.");
        return;
    }

    const supabase = window.supabase.createClient(
        "https://apfqxlriilkwzynozsvv.supabase.co",
        "sb_publishable_AcwBiZcSMHrkfjV31JJK6A_r45OvAe4"
    );

    const BUCKET = "addy-files";


    /* =========================
       LOAD STORAGE FILES
    ========================= */

    async function loadFiles() {

        try {

            if (loading) {
                loading.classList.remove("hidden");
            }

            const { data, error } =
                await supabase
                    .storage
                    .from(BUCKET)
                    .list("", {
                        limit: 100,
                        offset: 0,
                        sortBy: {
                            column: "created_at",
                            order: "desc"
                        }
                    });


            if (error) {

                console.error(
                    "SUPABASE STORAGE ERROR:",
                    error
                );

                showError(
                    "Unable to load your files."
                );

                return;
            }


            console.log(
                "ADDY FILES:",
                data
            );


            allFiles = (data || [])
                .filter(file => file.name)
                .filter(file =>
                    !file.name.endsWith("/")
                );


            renderFiles();


        } catch (error) {

            console.error(
                "ADDY ERROR:",
                error
            );

            showError(
                "Something went wrong."
            );

        } finally {

            if (loading) {
                loading.classList.add("hidden");
            }

        }

    }


    /* =========================
       RENDER FILES
    ========================= */

    function renderFiles() {

        if (!fileGrid)
            return;


        const search =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const filtered =
            allFiles.filter(file => {

                const name =
                    file.name
                        .toLowerCase();


                const category =
                    getCategory(
                        file.name
                    );


                const searchMatch =
                    !search ||
                    name.includes(search);


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

            if (emptyState) {
                emptyState.classList.remove(
                    "hidden"
                );
            }

            return;
        }


        if (emptyState) {
            emptyState.classList.add(
                "hidden"
            );
        }


        filtered.forEach(
            (file, index) => {

                fileGrid.appendChild(
                    createCard(
                        file,
                        index
                    )
                );

            }
        );

    }


    /* =========================
       CREATE CARD
    ========================= */

    function createCard(file, index) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "file-card";


        card.style.animationDelay =
            `${index * 0.06}s`;


        const name =
            cleanFileName(
                file.name
            );


        const category =
            getCategory(
                file.name
            );


        const icon =
            getIcon(
                category
            );


        const url =
            getPublicURL(
                file.name
            );


        const size =
            formatSize(
                file.metadata?.size
            );


        card.innerHTML = `

            <div class="file-type">
                ${icon}
            </div>

            <h3>
                ${escapeHTML(name)}
            </h3>

            <p class="file-description">
                Study material from ADDY.
            </p>

            <div class="file-info">

                ${category.toUpperCase()}

                ${
                    size
                        ? ` • ${size}`
                        : ""
                }

            </div>

            <a
                class="download-button"
                href="${escapeHTML(url)}"
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
       PUBLIC FILE URL
    ========================= */

    function getPublicURL(fileName) {

        const result =
            supabase
                .storage
                .from(BUCKET)
                .getPublicUrl(
                    fileName
                );


        return result.data.publicUrl;

    }


    /* =========================
       CATEGORY
    ========================= */

    function getCategory(fileName) {

        const extension =
            fileName
                .split(".")
                .pop()
                .toLowerCase();


        if (extension === "pdf")
            return "pdf";


        if (
            extension === "doc" ||
            extension === "docx"
        )
            return "docx";


        if (
            extension === "xls" ||
            extension === "xlsx"
        )
            return "xlsx";


        if (
            extension === "ppt" ||
            extension === "pptx"
        )
            return "pptx";


        return "other";

    }


    /* =========================
       ICON
    ========================= */

    function getIcon(category) {

        if (category === "pdf")
            return "📕";

        if (category === "docx")
            return "📘";

        if (category === "xlsx")
            return "📊";

        if (category === "pptx")
            return "📽️";

        return "📎";

    }


    /* =========================
       CLEAN NAME
    ========================= */

    function cleanFileName(name) {

        return name
            .replace(/\.[^/.]+$/, "")
            .replace(/[-_]+/g, " ")
            .replace(/\b\w/g, letter =>
                letter.toUpperCase()
            );

    }


    /* =========================
       FILE SIZE
    ========================= */

    function formatSize(bytes) {

        if (!bytes)
            return "";


        const units = [
            "B",
            "KB",
            "MB",
            "GB"
        ];


        let size =
            Number(bytes);


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

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderFiles
        );

    }


    /* =========================
       CATEGORIES
    ========================= */

    categoryButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    categoryButtons.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    activeCategory =
                        button.dataset.category ||
                        "all";


                    renderFiles();

                }
            );

        }
    );


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

        if (loading) {
            loading.classList.add(
                "hidden"
            );
        }


        if (!fileGrid)
            return;


        fileGrid.innerHTML = `

            <div class="error-state">

                <div>⚠</div>

                <h3>
                    ${escapeHTML(message)}
                </h3>

                <p>
                    Check your Supabase
                    Storage configuration.
                </p>

            </div>

        `;

    }


    /* =========================
       ESCAPE HTML
    ========================= */

    function escapeHTML(value) {

        return String(value)
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );

    }


    /* =========================
       START
    ========================= */

    await loadFiles();

});
