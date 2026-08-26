document.addEventListener("DOMContentLoaded", () => {

  const fileGrid = document.getElementById("fileGrid");
  const loading = document.getElementById("loading");
  const emptyState = document.getElementById("emptyState");
  const fileCount = document.getElementById("fileCount");

  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");

  const categories = document.querySelectorAll(".category");

  const mobileMenu = document.getElementById("mobileMenu");
  const navLinks = document.getElementById("navLinks");


  /* --------------------------------
     MOBILE MENU
  -------------------------------- */

  if (mobileMenu && navLinks) {

    mobileMenu.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
      });
    });

  }


  /* --------------------------------
     FILE DATA
  -------------------------------- */

  let files = [];

  let activeCategory = "all";


  /* --------------------------------
     SUPABASE
  -------------------------------- */

  async function loadFiles() {

    loading.classList.remove("hidden");
    fileGrid.innerHTML = "";
    emptyState.classList.add("hidden");

    try {

      if (
        typeof supabase === "undefined" ||
        typeof SUPABASE_URL === "undefined" ||
        typeof SUPABASE_ANON_KEY === "undefined"
      ) {

        /*
          If Supabase is not configured,
          the page remains usable instead of crashing.
        */

        files = [];

        showEmpty();

        return;
      }


      const client = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
      );


      const { data, error } = await client
        .from("files")
        .select("*")
        .order("created_at", {
          ascending: false
        });


      if (error) {
        throw error;
      }


      files = Array.isArray(data)
        ? data
        : [];


      renderFiles();

    }

    catch (error) {

      console.error(
        "ADDY library error:",
        error
      );

      files = [];

      showEmpty();

    }

    finally {

      loading.classList.add("hidden");

    }

  }


  /* --------------------------------
     FILTER FILES
  -------------------------------- */

  function getFilteredFiles() {

    const search =
      searchInput.value
        .trim()
        .toLowerCase();


    return files.filter(file => {

      const name =
        String(
          file.name ||
          file.title ||
          ""
        ).toLowerCase();


      const description =
        String(
          file.description ||
          ""
        ).toLowerCase();


      const category =
        getFileType(file);


      const matchesSearch =
        !search ||
        name.includes(search) ||
        description.includes(search);


      const matchesCategory =
        activeCategory === "all" ||
        category === activeCategory;


      return (
        matchesSearch &&
        matchesCategory
      );

    });

  }


  /* --------------------------------
     GET FILE TYPE
  -------------------------------- */

  function getFileType(file) {

    const type =
      String(
        file.type ||
        file.file_type ||
        file.category ||
        ""
      ).toLowerCase();


    const name =
      String(
        file.name ||
        file.title ||
        ""
      ).toLowerCase();


    if (
      type.includes("pdf") ||
      name.endsWith(".pdf")
    ) {
      return "pdf";
    }


    if (
      type.includes("doc") ||
      name.endsWith(".doc") ||
      name.endsWith(".docx")
    ) {
      return "docx";
    }


    if (
      type.includes("xls") ||
      name.endsWith(".xls") ||
      name.endsWith(".xlsx")
    ) {
      return "xlsx";
    }


    if (
      type.includes("ppt") ||
      name.endsWith(".ppt") ||
      name.endsWith(".pptx")
    ) {
      return "pptx";
    }


    return "other";

  }


  /* --------------------------------
     FILE ICON
  -------------------------------- */

  function getFileIcon(type) {

    const icons = {
      pdf: "📕",
      docx: "📘",
      xlsx: "📊",
      pptx: "📽️",
      other: "📎"
    };

    return icons[type] || "📎";

  }


  /* --------------------------------
     RENDER FILES
  -------------------------------- */

  function renderFiles() {

    const filtered =
      getFilteredFiles();


    fileGrid.innerHTML = "";


    fileCount.textContent =
      `${filtered.length} ${
        filtered.length === 1
          ? "file"
          : "files"
      }`;


    if (!filtered.length) {

      emptyState.classList.remove("hidden");

      return;

    }


    emptyState.classList.add("hidden");


    filtered.forEach(
      (file, index) => {

        const card =
          createFileCard(
            file,
            index
          );

        fileGrid.appendChild(card);

      }
    );

  }


  /* --------------------------------
     CREATE FILE CARD
  -------------------------------- */

  function createFileCard(
    file,
    index
  ) {

    const card =
      document.createElement("article");


    card.className =
      "file-card";


    card.style.animationDelay =
      `${index * 70}ms`;


    const type =
      getFileType(file);


    const icon =
      getFileIcon(type);


    const title =
      file.title ||
      file.name ||
      "Untitled note";


    const description =
      file.description ||
      "Study material from ADDY.";


    const url =
      file.url ||
      file.file_url ||
      file.download_url ||
      file.path ||
      "#";


    const size =
      file.size
        ? formatSize(file.size)
        : "";


    const date =
      file.created_at
        ? formatDate(file.created_at)
        : "";


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

        ${
          type.toUpperCase()
        }

        ${size ? `• ${size}` : ""}

        ${date ? `• ${date}` : ""}

      </div>

      <a
        class="download-button"
        href="${escapeAttribute(url)}"
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        ↓
        Download
      </a>

    `;


    return card;

  }


  /* --------------------------------
     SEARCH
  -------------------------------- */

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      () => {

        clearSearch.style.display =
          searchInput.value
            ? "block"
            : "none";

        renderFiles();

      }
    );

  }


  if (clearSearch) {

    clearSearch.addEventListener(
      "click",
      () => {

        searchInput.value = "";

        clearSearch.style.display =
          "none";

        searchInput.focus();

        renderFiles();

      }
    );

  }


  /* --------------------------------
     COMMAND + K
  -------------------------------- */

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
        event.key === "Escape" &&
        document.activeElement === searchInput
      ) {

        searchInput.blur();

      }

    }
  );


  /* --------------------------------
     CATEGORIES
  -------------------------------- */

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


        button.classList.add(
          "active"
        );


        activeCategory =
          button.dataset.category ||
          "all";


        renderFiles();

      }
    );

  });


  /* --------------------------------
     SCROLL REVEAL
  -------------------------------- */

  const revealElements =
    document.querySelectorAll(
      ".reveal"
    );


  if (
    "IntersectionObserver"
    in window
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (
              entry.isIntersecting
            ) {

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
          threshold: .12
        }
      );


    revealElements.forEach(
      element =>
        observer.observe(element)
    );

  }

  else {

    revealElements.forEach(
      element =>
        element.classList.add(
          "visible"
        )
    );

  }


  /* --------------------------------
     SMOOTH INTERNAL LINKS
  -------------------------------- */

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {

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

        }
      );

    });


  /* --------------------------------
     HELPERS
  -------------------------------- */

  function escapeHTML(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }


  function escapeAttribute(value) {

    return escapeHTML(value);

  }


  function formatSize(bytes) {

    const number =
      Number(bytes);


    if (!number || number <= 0) {
      return "";
    }


    const units = [
      "B",
      "KB",
      "MB",
      "GB"
    ];


    const index =
      Math.floor(
        Math.log(number) /
        Math.log(1024)
      );


    return (
      Math.round(
        number /
        Math.pow(
          1024,
          Math.min(
            index,
            units.length - 1
          )
        ) * 10
      ) / 10
    )
    + " "
    + units[
      Math.min(
        index,
        units.length - 1
      )
    ];

  }


  function formatDate(date) {

    try {

      return new Date(date)
        .toLocaleDateString(
          undefined,
          {
            year: "numeric",
            month: "short",
            day: "numeric"
          }
        );

    }

    catch {

      return "";

    }

  }


  function showEmpty() {

    loading.classList.add(
      "hidden"
    );

    fileGrid.innerHTML = "";

    fileCount.textContent =
      "0 files";

    emptyState.classList.remove(
      "hidden"
    );

  }


  /* --------------------------------
     START
  -------------------------------- */

  loadFiles();

});
