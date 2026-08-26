```javascript
/* =========================================================
   ADDY — ULTRA FAST LIBRARY
========================================================= */


/* =========================
   SUPABASE
========================= */

const SUPABASE_URL =
    "https://apfqxlriilkwzynozsvv.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_AcwBiZcSMHrkfjV31JJK6A_r45OvAe4";

const SUPABASE_BUCKET =
    "addy-files";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        }
    );


/* =========================
   STATE
========================= */

let allFiles = [];

let currentCategory = "all";

let loadingFiles = false;

let firstLoadFinished = false;


/* =========================
   ELEMENTS
========================= */

const fileGrid =
    document.getElementById("fileGrid");

const fileCount =
    document.getElementById("fileCount");

const loading =
    document.getElementById("loading");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");


/* =========================
   START IMMEDIATELY
========================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startApp,
        {
            once: true
        }
    );

} else {

    startApp();

}


/* =========================
   START
========================= */

function startApp() {

    setupEvents();

    /*
       Start loading immediately.
       No unnecessary delay.
    */

    loadFiles();

}


/* =========================
   EVENTS
========================= */

function setupEvents() {


    /* SEARCH */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterFiles
        );

    }


    /* CLEAR SEARCH */

    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            () => {

                searchInput.value = "";

                updateClearButton();

                filterFiles();

                searchInput.focus();

            }
        );

    }


    /* CATEGORIES */

    document
        .querySelectorAll(".category")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".category")
                        .forEach(btn => {

                            btn.classList.remove(
                                "active"
                            );

                        });


                    button.classList.add(
                        "active"
                    );


                    currentCategory =
                        button.dataset.category;


                    filterFiles();

                }
            );

        });


    /* COMMAND + K */

    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.metaKey ||
                 event.ctrlKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                if (searchInput) {

                    searchInput.focus();

                }

            }

        }
    );


    /* MOBILE MENU */

    const mobileMenu =
        document.querySelector(
            ".mobile-menu"
        );

    const navLinks =
        document.querySelector(
            ".nav-links"
        );


    if (
        mobileMenu &&
        navLinks
    ) {

        mobileMenu.addEventListener(
            "click",
            () => {

                navLinks.classList.toggle(
                    "open"
                );

            }
        );

    }

}


/* =========================================================
   LOAD FILES
========================================================= */

async function loadFiles() {

    if (loadingFiles) return;

    loadingFiles = true;


    /*
       Show loading immediately.
    */

    if (loading) {

        loading.classList.remove(
            "hidden"
        );

    }


    try {

        const result =
            await Promise.race([

                supabaseClient
                    .from("files")
                    .select(
                        "id,title,description,category,file_name,file_path,file_type,file_size,created_at"
                    )
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    )
                    .limit(50),

                new Promise(resolve => {

                    setTimeout(
                        () => {

                            resolve({
                                timeout: true
                            });

                        },
                        8000
                    );

                })

            ]);


        /*
           Timeout
        */

        if (
            result &&
            result.timeout
        ) {

            throw new Error(
                "Supabase is taking too long to respond."
            );

        }


        const {
            data,
            error
        } = result;


        if (error) {

            throw error;

        }


        /*
           Store files
        */

        allFiles =
            Array.isArray(data)
                ? data
                : [];


        firstLoadFinished =
            true;


        /*
           Render instantly
        */

        renderFiles(
            allFiles
        );


    } catch (error) {

        console.error(
            "ADDY library:",
            error
        );


        showError(
            error.message ||
            "Unable to load the library."
        );


    } finally {

        loadingFiles =
            false;


        if (loading) {

            loading.classList.add(
                "hidden"
            );

        }

    }

}


/* =========================================================
   RENDER
========================================================= */

function renderFiles(files) {

    if (!fileGrid) return;


    /*
       Clear old UI
    */

    fileGrid.innerHTML = "";


    /*
       Count
    */

    if (fileCount) {

        fileCount.textContent =
            `${files.length} ${
                files.length === 1
                    ? "file"
                    : "files"
            }`;

    }


    /*
       Hide loading
    */

    if (loading) {

        loading.classList.add(
            "hidden"
        );

    }


    /*
       Empty
    */

    if (!files.length) {

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


    /*
       DocumentFragment
       = faster DOM rendering
    */

    const fragment =
        document.createDocumentFragment();


    for (
        let i = 0;
        i < files.length;
        i++
    ) {

        const file =
            files[i];


        const card =
            document.createElement(
                "article"
            );


        card.className =
            "file-card";


        const type =
            getFileType(file);


        const icon =
            getFileIcon(type);


        const title =
            file.title ||
            file.file_name ||
            "Untitled file";


        const description =
            file.description ||
            "Study material from ADDY.";


        const size =
            formatSize(
                file.file_size
            );


        const url =
            getFileUrl(file);


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
                ${escapeHTML(type.toUpperCase())}
                ${
                    size
                        ? ` • ${escapeHTML(size)}`
                        : ""
                }
            </div>

            ${
                url

                ?

                `
                <a
                    class="download-button"
                    href="${escapeHTML(url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                >
                    ↓ DOWNLOAD
                </a>
                `

                :

                `
                <button
                    class="download-button"
                    disabled
                >
                    FILE UNAVAILABLE
                </button>
                `
            }

        `;


        fragment.appendChild(
            card
        );

    }


    /*
       ONE DOM operation
    */

    fileGrid.appendChild(
        fragment
    );

}


/* =========================================================
   FILE TYPE
========================================================= */

function getFileType(file) {

    if (file.file_type) {

        let type =
            String(
                file.file_type
            )
            .toLowerCase();


        if (
            type.includes("/")
        ) {

            type =
                type.split("/")
                    .pop();

        }


        return type
            .replace(".", "");

    }


    if (file.file_name) {

        const parts =
            file.file_name
                .split(".");


        if (
            parts.length > 1
        ) {

            return parts
                .pop()
                .toLowerCase();

        }

    }


    return "other";

}


/* =========================================================
   ICON
========================================================= */

function getFileIcon(type) {

    switch (type) {

        case "pdf":
            return "📕";

        case "doc":
        case "docx":
            return "📘";

        case "xls":
        case "xlsx":
            return "📊";

        case "ppt":
        case "pptx":
            return "📽️";

        case "txt":
            return "📎";

        case "zip":
            return "📦";

        default:
            return "📎";

    }

}


/* =========================================================
   STORAGE URL
========================================================= */

function getFileUrl(file) {

    if (file.file_url) {

        return file.file_url;

    }


    if (file.url) {

        return file.url;

    }


    if (!file.file_path) {

        return null;

    }


    const result =
        supabaseClient
            .storage
            .from(
                SUPABASE_BUCKET
            )
            .getPublicUrl(
                file.file_path
            );


    return result &&
        result.data
        ? result.data.publicUrl
        : null;

}


/* =========================================================
   FILE SIZE
========================================================= */

function formatSize(bytes) {

    const value =
        Number(bytes);


    if (
        !Number.isFinite(value) ||
        value <= 0
    ) {

        return "";

    }


    if (
        value <
        1024
    ) {

        return `${value} B`;

    }


    if (
        value <
        1024 * 1024
    ) {

        return `${(
            value / 1024
        ).toFixed(1)} KB`;

    }


    if (
        value <
        1024 * 1024 * 1024
    ) {

        return `${(
            value /
            (1024 * 1024)
        ).toFixed(1)} MB`;

    }


    return `${(
        value /
        (1024 * 1024 * 1024)
    ).toFixed(1)} GB`;

}


/* =========================================================
   SEARCH
========================================================= */

function filterFiles() {

    const query =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    updateClearButton();


    /*
       No search + all category
       = render original list
    */

    if (
        !query &&
        currentCategory === "all"
    ) {

        renderFiles(
            allFiles
        );

        return;

    }


    const results =
        [];


    for (
        let i = 0;
        i < allFiles.length;
        i++
    ) {

        const file =
            allFiles[i];


        const title =
            String(
                file.title ||
                file.file_name ||
                ""
            )
            .toLowerCase();


        const description =
            String(
                file.description ||
                ""
            )
            .toLowerCase();


        const category =
            String(
                file.category ||
                ""
            )
            .toLowerCase();


        const type =
            getFileType(file);


        const searchMatch =
            !query ||

            title.includes(query) ||

            description.includes(query) ||

            category.includes(query) ||

            type.includes(query);


        const categoryMatch =
            currentCategory === "all" ||

            type === currentCategory ||

            category === currentCategory;


        if (
            searchMatch &&
            categoryMatch
        ) {

            results.push(
                file
            );

        }

    }


    renderFiles(
        results
    );

}


/* =========================================================
   CLEAR SEARCH
========================================================= */

function updateClearButton() {

    if (!clearSearch) return;


    if (
        searchInput &&
        searchInput.value
    ) {

        clearSearch.style.display =
            "flex";

    } else {

        clearSearch.style.display =
            "none";

    }

}


/* =========================================================
   ERROR
========================================================= */

function showError(message) {

    if (loading) {

        loading.classList.add(
            "hidden"
        );

    }


    if (!fileGrid) return;


    fileGrid.innerHTML = `

        <div class="error-state">

            <div class="error-icon">
                ⚠
            </div>

            <h3>
                Library unavailable
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

            <button
                class="download-button"
                id="retryLibrary"
            >
                TRY AGAIN
            </button>

        </div>

    `;


    const retry =
        document.getElementById(
            "retryLibrary"
        );


    if (retry) {

        retry.addEventListener(
            "click",
            () => {

                loadFiles();

            }
        );

    }


    if (fileCount) {

        fileCount.textContent =
            "0 files";

    }

}


/* =========================================================
   ESCAPE
========================================================= */

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
```
