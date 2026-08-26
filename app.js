document.addEventListener("DOMContentLoaded", () => {

  /* MOBILE MENU */

  const menu = document.querySelector(".mobile-menu");
  const nav = document.querySelector(".nav-links");

  if (menu && nav) {
    menu.addEventListener("click", () => {
      nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
      });
    });
  }


  /* SCROLL REVEAL */

  const revealElements =
    document.querySelectorAll(".reveal");

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


  revealElements.forEach(element => {
    observer.observe(element);
  });


  /* SEARCH SHORTCUT */

  const search =
    document.getElementById("searchInput");

  const clear =
    document.getElementById("clearSearch");


  document.addEventListener("keydown", event => {

    if (
      (event.metaKey || event.ctrlKey) &&
      event.key.toLowerCase() === "k"
    ) {
      event.preventDefault();

      if (search) {
        search.focus();
      }
    }

  });


  /* CLEAR SEARCH */

  if (search && clear) {

    search.addEventListener("input", () => {

      clear.style.display =
        search.value ? "block" : "none";

    });


    clear.addEventListener("click", () => {

      search.value = "";

      clear.style.display = "none";

      search.dispatchEvent(
        new Event("input", {
          bubbles: true
        })
      );

      search.focus();

    });

  }

});
