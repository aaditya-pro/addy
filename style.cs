:root {
    --bg: #05070c;
    --bg-soft: #080c14;
    --card: #0b101a;
    --card-2: #0e1522;

    --blue: #4da3ff;
    --blue-bright: #70b7ff;
    --blue-soft: rgba(77, 163, 255, 0.15);
    --blue-glow: rgba(45, 140, 255, 0.35);

    --white: #f5f8ff;
    --muted: #8995a8;

    --border: rgba(255,255,255,0.08);

    --radius: 22px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    background:
        radial-gradient(circle at 50% 0%, #0c192d 0%, transparent 35%),
        var(--bg);

    color: var(--white);

    font-family: "Inter", sans-serif;

    min-height: 100vh;

    overflow-x: hidden;
}

/* -------------------------
   BACKGROUND
------------------------- */

.page-glow {
    position: fixed;
    width: 500px;
    height: 500px;

    border-radius: 50%;

    background: var(--blue-glow);

    filter: blur(130px);

    pointer-events: none;

    opacity: .25;

    z-index: -3;

    animation: glowMove 12s ease-in-out infinite alternate;
}

.glow-one {
    top: -250px;
    left: -150px;
}

.glow-two {
    right: -250px;
    top: 45%;

    animation-delay: -5s;
}

@keyframes glowMove {
    from {
        transform: translate3d(0,0,0);
    }

    to {
        transform: translate3d(80px,50px,0);
    }
}

.particles span {
    position: fixed;

    width: 3px;
    height: 3px;

    border-radius: 50%;

    background: var(--blue);

    opacity: .25;

    animation: floatParticle 12s linear infinite;

    pointer-events: none;

    z-index: -1;
}

.particles span:nth-child(1) {
    left: 10%;
    bottom: -20px;
}

.particles span:nth-child(2) {
    left: 25%;
    bottom: -40px;
    animation-delay: 2s;
}

.particles span:nth-child(3) {
    left: 50%;
    bottom: -20px;
    animation-delay: 5s;
}

.particles span:nth-child(4) {
    left: 70%;
    bottom: -30px;
    animation-delay: 3s;
}

.particles span:nth-child(5) {
    left: 85%;
    bottom: -50px;
    animation-delay: 7s;
}

.particles span:nth-child(6) {
    left: 40%;
    bottom: -20px;
    animation-delay: 9s;
}

@keyframes floatParticle {
    0% {
        transform: translateY(0);
        opacity: 0;
    }

    20% {
        opacity: .3;
    }

    80% {
        opacity: .15;
    }

    100% {
        transform: translateY(-110vh);
        opacity: 0;
    }
}


/* -------------------------
   NAVBAR
------------------------- */

.navbar {
    position: sticky;
    top: 0;

    z-index: 100;

    height: 76px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 6vw;

    background: rgba(5,7,12,.72);

    backdrop-filter: blur(18px);

    border-bottom: 1px solid rgba(255,255,255,.05);
}

.brand {
    display: flex;
    align-items: center;
    gap: 11px;

    color: white;

    text-decoration: none;

    font-weight: 800;
    letter-spacing: 2px;
}

.brand-mark {
    width: 35px;
    height: 35px;

    display: grid;
    place-items: center;

    border-radius: 10px;

    background: linear-gradient(
        135deg,
        #1b73c9,
        #67b4ff
    );

    color: #001020;

    box-shadow:
        0 0 25px rgba(77,163,255,.35);

    font-family: "Caveat", cursive;

    font-size: 23px;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 35px;
}

.nav-links a {
    color: #8e9aae;

    text-decoration: none;

    font-size: 14px;

    transition: .3s ease;
}

.nav-links a:hover {
    color: var(--blue-bright);

    transform: translateY(-2px);
}

.admin-link {
    border: 1px solid rgba(77,163,255,.3);

    padding: 10px 17px;

    border-radius: 100px;

    color: var(--blue-bright) !important;

    background: rgba(77,163,255,.06);
}

.mobile-menu {
    display: none;

    background: none;
    border: 0;

    cursor: pointer;
}

.mobile-menu span {
    display: block;

    width: 25px;
    height: 2px;

    background: white;

    margin: 5px;
}


/* -------------------------
   HERO
------------------------- */

.hero {
    width: min(1200px, 90%);

    min-height: 720px;

    margin: auto;

    display: grid;

    grid-template-columns: 1fr 1fr;

    align-items: center;

    gap: 50px;

    padding: 90px 0;
}

.hero-copy {
    animation: heroIn .9s ease both;
}

@keyframes heroIn {
    from {
        opacity: 0;
        transform: translateY(35px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.eyebrow {
    display: inline-flex;

    align-items: center;

    gap: 9px;

    color: var(--blue-bright);

    font-size: 11px;

    font-weight: 700;

    letter-spacing: 2.5px;

    margin-bottom: 25px;
}

.eyebrow-dot {
    width: 7px;
    height: 7px;

    border-radius: 50%;

    background: var(--blue);

    box-shadow: 0 0 14px var(--blue);

    animation: pulse 2s infinite;
}

@keyframes pulse {
    50% {
        opacity: .35;
        transform: scale(.7);
    }
}

.hero h1 {
    font-size: clamp(52px, 7vw, 90px);

    line-height: .94;

    letter-spacing: -5px;

    margin-bottom: 28px;
}

.hero h1 span {
    display: block;

    color: var(--blue-bright);

    font-family: "Caveat", cursive;

    font-weight: 600;

    letter-spacing: -2px;

    text-shadow:
        0 0 35px rgba(77,163,255,.3);
}

.hero-description {
    max-width: 560px;

    color: var(--muted);

    font-size: 16px;

    line-height: 1.8;

    margin-bottom: 35px;
}

.hero-actions {
    display: flex;

    gap: 13px;

    flex-wrap: wrap;
}

.primary-button,
.secondary-button {
    border-radius: 14px;

    padding: 14px 20px;

    font-family: inherit;

    font-size: 14px;

    font-weight: 700;

    text-decoration: none;

    cursor: pointer;

    transition:
        transform .3s ease,
        box-shadow .3s ease,
        background .3s ease;
}

.primary-button {
    border: 1px solid rgba(112,183,255,.5);

    color: #02101e;

    background: linear-gradient(
        135deg,
        #58aaff,
        #8ac9ff
    );

    box-shadow:
        0 10px 35px rgba(77,163,255,.22);
}

.primary-button:hover {
    transform: translateY(-4px);

    box-shadow:
        0 15px 45px rgba(77,163,255,.4);
}

.primary-button span {
    margin-left: 10px;
}

.secondary-button {
    color: #aab5c7;

    border: 1px solid var(--border);

    background: rgba(255,255,255,.025);
}

.secondary-button:hover {
    color: white;

    border-color: rgba(77,163,255,.4);

    background: rgba(77,163,255,.08);

    transform: translateY(-3px);
}

.hero-meta {
    display: flex;

    gap: 12px;

    color: #596679;

    font-size: 11px;

    margin-top: 28px;
}


/* -------------------------
   NOTEBOOK
------------------------- */

.notebook-wrap {
    display: flex;

    justify-content: center;

    perspective: 1400px;

    animation: notebookIn 1.2s .2s ease both;
}

@keyframes notebookIn {
    from {
        opacity: 0;

        transform:
            translateY(60px)
            rotateY(15deg);
    }

    to {
        opacity: 1;

        transform:
            translateY(0)
            rotateY(0);
    }
}

.notebook {
    position: relative;

    width: 420px;
    height: 530px;

    transform-style: preserve-3d;

    transform:
        rotateY(-12deg)
        rotateX(5deg)
        rotateZ(2deg);

    transition: transform .7s cubic-bezier(.2,.8,.2,1);

    filter:
        drop-shadow(0 35px 45px rgba(0,0,0,.65));
}

.notebook:hover {
    transform:
        rotateY(-4deg)
        rotateX(2deg)
        rotateZ(0deg)
        translateY(-10px);
}

.notebook-cover {
    position: absolute;

    inset: 0;

    overflow: hidden;

    border-radius: 8px 20px 20px 8px;

    background:
        linear-gradient(
            135deg,
            #07192d,
            #0a2848 50%,
            #061120
        );

    border: 1px solid rgba(100,180,255,.35);

    box-shadow:
        inset 0 0 50px rgba(77,163,255,.08),
        0 0 60px rgba(77,163,255,.13);
}

.cover-grid {
    position: absolute;

    inset: 0;

    background-image:
        linear-gradient(
            rgba(77,163,255,.05) 1px,
            transparent 1px
        ),
        linear-gradient(
            90deg,
            rgba(77,163,255,.05) 1px,
            transparent 1px
        );

    background-size: 25px 25px;
}

.cover-top,
.cover-bottom {
    position: absolute;

    left: 32px;
    right: 32px;

    display: flex;
    justify-content: space-between;

    color: #80c1ff;

    font-size: 10px;

    letter-spacing: 2px;
}

.cover-top {
    top: 30px;
}

.cover-bottom {
    bottom: 25px;
}

.cover-title {
    position: absolute;

    top: 155px;

    left: 45px;
}

.cover-title small {
    color: #7198ba;

    font-size: 10px;

    letter-spacing: 4px;
}

.cover-title strong {
    display: block;

    font-size: 62px;

    line-height: .85;

    margin-top: 15px;

    letter-spacing: -4px;
}

.cover-title em {
    display: block;

    color: #65b5ff;

    font-family: "Caveat", cursive;

    font-size: 72px;

    font-weight: 600;

    letter-spacing: -2px;
}

.hand-line {
    width: 180px;
    height: 2px;

    margin-top: 22px;

    background: #62b5ff;

    transform: rotate(-2deg);

    box-shadow: 0 0 15px rgba(77,163,255,.5);
}

.cover-title p {
    margin-top: 12px;

    color: #68819a;

    font-family: "Caveat", cursive;

    font-size: 18px;
}


/* PAGE */

.notebook-page {
    position: absolute;

    top: 13px;
    right: -20px;

    width: 390px;
    height: 504px;

    background:
        repeating-linear-gradient(
            to bottom,
            #edf4fa 0,
            #edf4fa 28px,
            #d3e5f3 29px
        );

    border-radius: 4px 17px 17px 4px;

    transform:
        translateZ(-20px)
        rotateY(5deg);

    box-shadow:
        8px 10px 30px rgba(0,0,0,.45);

    overflow: hidden;
}

.paper-hole {
    position: absolute;

    left: 17px;

    width: 10px;
    height: 10px;

    border-radius: 50%;

    background: #06101b;

    box-shadow:
        inset 0 1px 3px rgba(0,0,0,.4);
}

.hole-one {
    top: 120px;
}

.hole-two {
    top: 245px;
}

.hole-three {
    top: 370px;
}

.paper-content {
    padding: 65px 45px 40px 55px;

    color: #14263b;
}

.paper-content span {
    color: #477ca8;

    font-family: "Caveat", cursive;

    font-size: 18px;
}

.paper-content h3 {
    font-family: "Caveat", cursive;

    font-size: 34px;

    line-height: 1;

    margin-top: 18px;

    color: #12385b;
}

.paper-lines {
    height: 130px;

    margin-top: 30px;

    background:
        repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent 29px,
            rgba(57,113,157,.28) 30px
        );
}

.paper-signature {
    font-family: "Caveat", cursive;

    color: #24699f;

    font-size: 24px;

    margin-top: 15px;
}


/* -------------------------
   LIBRARY
------------------------- */

.library-section {
    width: min(1200px, 90%);

    margin: auto;

    padding: 90px 0 130px;
}

.section-heading {
    display: flex;

    justify-content: space-between;

    align-items: end;

    margin-bottom: 30px;
}

.section-label {
    color: var(--blue);

    font-size: 10px;

    letter-spacing: 3px;

    font-weight: 800;
}

.section-heading h2 {
    font-size: clamp(34px, 5vw, 54px);

    letter-spacing: -2px;

    margin-top: 8px;
}

.file-count {
    color: #718095;

    font-size: 13px;

    padding-bottom: 5px;
}


/* SEARCH */

.search-box {
    height: 62px;

    display: flex;

    align-items: center;

    gap: 14px;

    padding: 0 17px;

    border: 1px solid var(--border);

    border-radius: 18px;

    background:
        linear-gradient(
            135deg,
            rgba(255,255,255,.045),
            rgba(255,255,255,.015)
        );

    backdrop-filter: blur(15px);

    transition: .35s ease;
}

.search-box:focus-within {
    border-color: rgba(77,163,255,.5);

    box-shadow:
        0 0 0 4px rgba(77,163,255,.07),
        0 0 35px rgba(77,163,255,.08);
}

.search-icon {
    font-size: 28px;

    color: var(--blue);

    transform: rotate(-15deg);
}

.search-box input {
    flex: 1;

    min-width: 0;

    background: none;

    border: 0;

    outline: none;

    color: white;

    font: inherit;

    font-size: 14px;
}

.search-box input::placeholder {
    color: #647184;
}

.search-box kbd {
    color: #758297;

    border: 1px solid var(--border);

    border-radius: 7px;

    padding: 5px 8px;

    font-size: 11px;

    white-space: nowrap;
}

.search-box kbd span {
    margin-right: 3px;
}

.clear-search {
    display: none;

    background: none;

    border: 0;

    color: #718095;

    font-size: 22px;

    cursor: pointer;
}


/* CATEGORIES */

.categories {
    display: flex;

    gap: 10px;

    overflow-x: auto;

    padding: 25px 0 30px;

    scrollbar-width: none;
}

.categories::-webkit-scrollbar {
    display: none;
}

.category {
    flex-shrink: 0;

    display: flex;

    align-items: center;

    gap: 8px;

    border: 1px solid var(--border);

    background: rgba(255,255,255,.025);

    color: #8794a7;

    padding: 10px 15px;

    border-radius: 100px;

    cursor: pointer;

    font-family: inherit;

    font-size: 12px;

    font-weight: 600;

    transition: .3s ease;
}

.category:hover {
    transform: translateY(-3px);

    border-color: rgba(77,163,255,.35);

    color: white;
}

.category.active {
    color: #03101c;

    background: var(--blue-bright);

    border-color: var(--blue-bright);

    box-shadow:
        0 5px 25px rgba(77,163,255,.22);
}

.category-icon {
    font-size: 14px;
}


/* -------------------------
   LOADING
------------------------- */

.loading {
    min-height: 250px;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    color: #69768a;

    gap: 18px;
}

.loading-book {
    position: relative;

    width: 45px;
    height: 38px;
}

.loading-book span {
    position: absolute;

    width: 22px;
    height: 32px;

    border: 2px solid var(--blue);

    background: rgba(77,163,255,.05);

    animation: book 1.2s ease-in-out infinite;
}

.loading-book span:first-child {
    left: 1px;

    border-radius: 5px 2px 2px 5px;

    transform-origin: right center;
}

.loading-book span:last-child {
    right: 1px;

    border-radius: 2px 5px 5px 2px;

    transform-origin: left center;

    animation-delay: .15s;
}

@keyframes book {
    50% {
        transform: rotateY(25deg);
    }
}


/* -------------------------
   FILE CARDS
------------------------- */

.file-grid {
    display: grid;

    grid-template-columns:
        repeat(3, minmax(0,1fr));

    gap: 18px;
}

.file-card {
    position: relative;

    overflow: hidden;

    min-height: 260px;

    display: flex;

    flex-direction: column;

    padding: 22px;

    border: 1px solid var(--border);

    border-radius: var(--radius);

    background:
        linear-gradient(
            145deg,
            rgba(17,24,37,.95),
            rgba(7,11,18,.95)
        );

    box-shadow:
        0 15px 40px rgba(0,0,0,.18);

    transition:
        transform .45s cubic-bezier(.2,.8,.2,1),
        border-color .3s ease,
        box-shadow .3s ease;

    animation: cardIn .65s ease both;
}

.file-card::before {
    content: "";

    position: absolute;

    width: 150px;
    height: 150px;

    top: -80px;
    right: -60px;

    background: var(--blue);

    border-radius: 50%;

    filter: blur(70px);

    opacity: .08;

    transition: .4s;
}

.file-card:hover {
    transform: translateY(-9px);

    border-color: rgba(77,163,255,.32);

    box-shadow:
        0 25px 55px rgba(0,0,0,.4),
        0 0 35px rgba(77,163,255,.07);
}

.file-card:hover::before {
    opacity: .2;
}

@keyframes cardIn {
    from {
        opacity: 0;

        transform:
            translateY(25px)
            scale(.97);
    }

    to {
        opacity: 1;

        transform:
            translateY(0)
            scale(1);
    }
}

.file-type {
    width: 48px;
    height: 48px;

    display: grid;
    place-items: center;

    border-radius: 14px;

    background: rgba(77,163,255,.1);

    border: 1px solid rgba(77,163,255,.18);

    font-size: 22px;

    margin-bottom: 22px;
}

.file-card h3 {
    font-size: 17px;

    line-height: 1.35;

    margin-bottom: 8px;

    word-break: break-word;
}

.file-description {
    color: #758196;

    font-size: 12px;

    line-height: 1.6;

    display: -webkit-box;

    -webkit-line-clamp: 2;

    -webkit-box-orient: vertical;

    overflow: hidden;
}

.file-info {
    display: flex;

    gap: 8px;

    align-items: center;

    color: #59677b;

    font-size: 10px;

    margin-top: auto;

    padding-top: 20px;

    margin-bottom: 15px;
}

.download-button {
    width: 100%;

    display: flex;

    justify-content: center;

    align-items: center;

    gap: 9px;

    padding: 12px;

    border-radius: 12px;

    background:
        rgba(77,163,255,.1);

    border: 1px solid rgba(77,163,255,.22);

    color: var(--blue-bright);

    font-family: inherit;

    font-size: 12px;

    font-weight: 700;

    text-decoration: none;

    transition: .3s ease;
}

.download-button:hover {
    color: #03101c;

    background: var(--blue-bright);

    box-shadow:
        0 8px 25px rgba(77,163,255,.25);

    transform: translateY(-2px);
}


/* -------------------------
   EMPTY / ERROR
------------------------- */

.hidden {
    display: none !important;
}

.empty-state,
.error-state {
    text-align: center;

    padding: 100px 20px;

    color: #728095;
}

.empty-icon {
    width: 65px;
    height: 65px;

    display: grid;
    place-items: center;

    margin: auto auto 20px;

    border-radius: 20px;

    color: var(--blue);

    background: rgba(77,163,255,.08);

    border: 1px solid rgba(77,163,255,.15);

    font-size: 25px;
}

.empty-state h3,
.error-state h3 {
    color: white;

    font-size: 22px;

    margin-bottom: 8px;
}

.empty-state p,
.error-state p {
    font-size: 13px;

    margin-bottom: 22px;
}

.error-state > div:first-child {
    font-size: 30px;

    color: #ffb55e;

    margin-bottom: 15px;
}


/* -------------------------
   FOOTER
------------------------- */

footer {
    border-top: 1px solid var(--border);

    padding: 65px 0;
}

.footer-inner {
    width: min(1200px,90%);

    margin: auto;
}

.footer-brand {
    font-size: 28px;

    font-weight: 800;

    letter-spacing: 3px;
}

.footer-brand span {
    color: var(--blue);
}

.footer-inner > p {
    color: #69768a;

    margin-top: 10px;

    font-size: 13px;
}

.footer-divider {
    height: 1px;

    background: var(--border);

    margin: 35px 0 20px;
}

.footer-bottom {
    display: flex;

    justify-content: space-between;

    color: #4d596b;

    font-size: 11px;
}

.footer-bottom a {
    color: #708198;

    text-decoration: none;
}

.footer-bottom a:hover {
    color: var(--blue);
}


/* -------------------------
   SCROLL REVEAL
------------------------- */

.reveal {
    opacity: 0;

    transform: translateY(35px);

    transition:
        opacity .8s ease,
        transform .8s cubic-bezier(.2,.8,.2,1);
}

.reveal.visible {
    opacity: 1;

    transform: translateY(0);
}


/* -------------------------
   MOBILE
------------------------- */

@media (max-width: 900px) {

    .hero {
        grid-template-columns: 1fr;

        padding-top: 65px;

        text-align: center;
    }

    .hero-description {
        margin-left: auto;
        margin-right: auto;
    }

    .hero-actions {
        justify-content: center;
    }

    .hero-meta {
        justify-content: center;
    }

    .notebook-wrap {
        margin-top: 30px;
    }

    .file-grid {
        grid-template-columns:
            repeat(2, minmax(0,1fr));
    }
}


@media (max-width: 600px) {

    .navbar {
        height: 65px;

        padding: 0 5%;
    }

    .nav-links {
        display: none;

        position: absolute;

        top: 65px;

        left: 5%;
        right: 5%;

        flex-direction: column;

        gap: 10px;

        padding: 15px;

        border: 1px solid var(--border);

        border-radius: 16px;

        background: rgba(8,12,20,.96);

        backdrop-filter: blur(20px);
    }

    .nav-links.open {
        display: flex;
    }

    .nav-links a {
        width: 100%;

        text-align: center;

        padding: 12px;
    }

    .mobile-menu {
        display: block;
    }

    .hero {
        width: 90%;

        min-height: auto;

        padding: 65px 0 80px;
    }

    .hero h1 {
        font-size: 53px;

        letter-spacing: -3px;
    }

    .hero-description {
        font-size: 14px;
    }

    .notebook {
        transform:
            rotateY(-8deg)
            rotateX(3deg)
            scale(.72);

        margin: -70px 0;
    }

    .notebook:hover {
        transform:
            rotateY(-4deg)
            rotateX(2deg)
            scale(.72)
            translateY(-5px);
    }

    .library-section {
        padding-top: 60px;
    }

    .section-heading {
        align-items: start;

        flex-direction: column;

        gap: 10px;
    }

    .search-box {
        height: 56px;
    }

    .search-box kbd {
        display: none;
    }

    .file-grid {
        grid-template-columns: 1fr;

        gap: 14px;
    }

    .file-card {
        min-height: 235px;
    }

    .footer-bottom {
        flex-direction: column;

        gap: 15px;
    }
}


/* REDUCE MOTION */

@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        scroll-behavior: auto !important;

        animation-duration: .01ms !important;

        animation-iteration-count: 1 !important;

        transition-duration: .01ms !important;
    }
}
