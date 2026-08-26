document.addEventListener("DOMContentLoaded", async () => {

    const SUPABASE_URL =
        "https://apfqxlriilkwzynozsvv.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_AcwBiZcSMHrkfjV31JJK6A_r45OvAe4";

    const BUCKET =
        "addy-files";


    /* =========================
       ELEMENTS
    ========================= */

    const fileGrid =
        document.getElementById("fileGrid");

    const loading =
        document.getElementById("loading");

    const emptyState =
        document.getElementById("emptyState");

    const fileCount =
        document.getElementById("fileCount");

    const searchInput =
        document.getElementById("searchInput");

    const categoryButtons =
        document.querySelectorAll(
            ".category"
        );


    let files = [];

    let activeCategory = "all";


    /* =========================
       SUPABASE CLIENT
    ========================= */

    if (!window.supabase) {

        showError(
            "Supabase library failed to load."
        );

        return;
    }


    const supabase =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    /* =========================
       LOAD FILES
    ========================= */

    async function loadFiles() {

        try {

            loading.classList.remove(
                "hidden"
            );


            const {
                data,
                error
            } = await supabase
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
                    "SUPABASE ERROR:",
                    error
                );

                showError(
                    error.message ||
                    "Unable to load files."
                );

                return;
            }


            files = (data || [])
                .filter(file =>
                    file &&
                    file.name
                );


            render();


        } catch (error) {

            console.error(
                "ADDY ERROR:",
                error
            );

            showError(
                "Something went wrong."
            );

        } finally {

            loading.classList.add(
                "hidden"
            );

        }

    }


    /* =========================
       RENDER
    ========================= */

    function render() {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();


        const filtered =
            files.filter(file => {

                const name =
                    file.name.toLowerCase();


                const category =
                    getCategory(
                        file.name
                    );


                return (

                    (!search ||
                        name.includes(search))

                    &&

                    (
                        activeCategory === "all" ||
                        category === activeCategory
                    )

                );

            });


        fileGrid.innerHTML = "";


        fileCount.textContent =
            `${filtered.length} ${
                filtered.length === 1
                    ? "file"
                    : "files"
            }`;


        if (!filtered.length) {

            emptyState.classList.remove(
                "hidden"
            );

            return;
        }


        emptyState.classList.add(
            "hidden"
        );


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
       CARD
    ========================= */

    function createCard(
        file,
        index
    ) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "file-card";


        card.style.animationDelay =
            `${index * .06}s`;


        const name =
            cleanName(
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
            supabase
                .storage
                .from(BUCKET)
                .getPublicUrl(
                    file.name
                )
                .data
                .publicUrl;


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
                ${size ? ` • ${size}` : ""}
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
       CATEGORY
    ========================= */

    function getCategory(name) {

        const extension =
            name
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

        const icons = {

            pdf: "📕",

            docx: "📘",

            xlsx: "📊",

            pptx: "📽️",

            other: "📎"

        };


        return icons[category] ||
            icons.other;

    }


    /* =========================
       NAME
    ========================= */

    function cleanName(name) {

        return name
            .replace(
                /\.[^/.]+$/,
                ""
            )
            .replace(
                /[-_]+/g,
                " "
            )
            .replace(
                /\b\w/g,
                letter =>
                    letter.toUpperCase()
            );

    }


    /* =========================
       SIZE
    ========================= */

    function formatSize(bytes) {

        if (!bytes)
            return "";


        let size =
            Number(bytes);


        const units = [
            "B",
            "KB",
            "MB",
            "GB"
        ];


        let unit = 0;


        while (
            size >= 1024 &&
            unit <
                units.length - 1
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

    searchInput.addEventListener(
        "input",
        render
    );


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
                        button.dataset.category;


                    render();

                }
            );

        }
    );


    /* =========================
       COMMAND K
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

                searchInput.focus();

            }


            if (
                event.key === "Escape"
            ) {

                searchInput.value = "";

                render();

            }

        }
    );


    /* =========================
       ERROR
    ========================= */

    function showError(message) {

        loading.classList.add(
            "hidden"
        );


        fileGrid.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    ⚠
                </div>

                <h3>
                    Something went wrong
                </h3>

                <p>
                    ${escapeHTML(message)}
                </p>

            </div>

        `;

    }


    /* =========================
       SECURITY
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
