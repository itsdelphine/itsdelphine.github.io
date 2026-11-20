/* =========================================================================
   PORTFOLIO — comportement du site
   Le contenu vient de contenu.js (variable PORTFOLIO).
   ========================================================================= */
(() => {
  const projects = PORTFOLIO;


  /* ---------- Textes de l'interface dans les deux langues ------------- */
  const UI = {
    fr: {
      nav_projects: "Projets", nav_about: "À propos", nav_contact: "Contact",
      download: "Télécharger le CV",
      download_full: "Télécharger le CV (PDF)",
      intro: document.querySelector('[data-i18n="intro"]').innerHTML.trim(),
      about_text: document.querySelector('[data-i18n="about_text"]').innerHTML.trim(),
      all: "Tous", close: "Fermer ✕", prev: "Projet précédent", next: "Projet suivant",
      back_top: "Haut de page ↑", image_missing: "Image à venir",
      draw_hint: "Cliquez-glissez pour dessiner", draw_colors: "Couleur du crayon",
      draw_clear: "Effacer le dessin", draw_download: "Télécharger le dessin",
      draw_empty: "Dessinez d'abord quelque chose", draw_saved: "Dessin téléchargé",
    },
    en: {
      nav_projects: "Work", nav_about: "About", nav_contact: "Contact",
      download: "Download resume",
      download_full: "Download resume (PDF)",
      intro: "As a designer I specialize in editorial design, exhibition graphics, cartography and visual strategy.",
      about_text: "I work with images, graphics, maps, text and data to highlight information and make it accessible to users and audiences.<br>I am involved in every project from concept to production. My work spans all kinds of media, print and digital, across a wide variety of formats.<br>I advocate for an ethical design practice and believe it should serve the public good.",
      all: "All", close: "Close ✕", prev: "Previous project", next: "Next project",
      back_top: "Back to top ↑", image_missing: "Image coming soon",
      draw_hint: "Click and drag to draw", draw_colors: "Pen colour",
      draw_clear: "Clear drawing", draw_download: "Download drawing",
      draw_empty: "Draw something first", draw_saved: "Drawing downloaded",
    },
  };

  /* ---------- Langue (mémorisée si le navigateur le permet) ---------- */
  let lang = "fr";
  try { lang = localStorage.getItem("lang") || (navigator.language || "fr").slice(0, 2); } catch (e) {}
  if (!UI[lang]) lang = "fr";
  let filter = null; // catégorie active (null = tous)

  const t = (key) => UI[lang][key];
  const field = (p, base) => p[`${base}_${lang}`];

  /* ---------- Éléments ----------------------------------------------- */
  const grid = document.querySelector(".grid");
  const filtersEl = document.querySelector(".filters");
  const modal = document.getElementById("modal");
  const lightbox = document.getElementById("lightbox");
  let currentIndex = -1;
  let lastFocus = null;

  /* ---------- Image avec repli si le fichier n'existe pas encore ----- */
  // src peut être une liste : on essaie chaque fichier dans l'ordre
  function makeImage(src, alt, container) {
    const sources = [].concat(src).filter(Boolean);
    const img = new Image();
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";
    img.onerror = () => {
      sources.shift();
      if (sources.length) { img.src = sources[0]; return; }
      img.remove();
      container.classList.add("is-empty");
      container.textContent = t("image_missing");
    };
    img.src = sources[0];
    container.appendChild(img);
    return img;
  }

  /* ---------- Grille ------------------------------------------------- */
  function buildGrid() {
    grid.innerHTML = "";
    projects.forEach((p, i) => {
      const li = document.createElement("li");
      li.className = "reveal";
      li.dataset.index = i;

      const card = document.createElement("a");
      card.className = "card";
      card.href = `#${p.id}`;
      card.addEventListener("click", (e) => { e.preventDefault(); openProject(i, true); });

      const thumb = document.createElement("div");
      thumb.className = "thumb";
      makeImage([p.vignette, p.images[0] && p.images[0].fichier], field(p, "titre"), thumb);

      const cap = document.createElement("div");
      cap.className = "caption";
      cap.innerHTML = `<p class="caption-title"></p><p class="caption-cats"></p>`;
      cap.querySelector(".caption-title").textContent = field(p, "titre");
      const catsEl = cap.querySelector(".caption-cats");
      field(p, "categories").forEach((c) => {
        const span = document.createElement("span");
        span.textContent = capitalize(c);
        catsEl.appendChild(span);
      });

      card.append(thumb, cap);
      li.appendChild(card);
      grid.appendChild(li);
    });
    applyFilter();
    observeReveal();
  }

  function capitalize(c) {
    return c.charAt(0) + c.slice(1).toLowerCase();
  }

  /* ---------- Filtres ------------------------------------------------ */
  function buildFilters() {
    const counts = new Map();
    projects.forEach((p) => field(p, "categories").forEach((c) => counts.set(c, (counts.get(c) || 0) + 1)));
    const cats = [...counts.keys()].sort((a, b) => a.localeCompare(b, lang));
    filtersEl.innerHTML = "";
    const mk = (label, value) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.setAttribute("aria-pressed", String(filter === value));
      b.addEventListener("click", () => { filter = value; buildFilters(); applyFilter(); });
      filtersEl.appendChild(b);
    };
    mk(t("all"), null);
    cats.forEach((c) => mk(c, c));
  }

  function visibleIndexes() {
    return projects.map((p, i) => i).filter((i) => !filter || field(projects[i], "categories").includes(filter));
  }

  function applyFilter() {
    const keep = new Set(visibleIndexes());
    grid.querySelectorAll("li").forEach((li) => { li.hidden = !keep.has(Number(li.dataset.index)); });
    staggerColumns();
  }

  /* ---------- Apparition au défilement ------------------------------- */
  let observer;
  function staggerColumns() {
    const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
    [...grid.querySelectorAll("li:not([hidden])")].forEach((li, k) => {
      li.style.transitionDelay = `${(k % cols) * 90}ms`;
    });
  }
  function observeReveal() {
    if (observer) observer.disconnect();
    if (!("IntersectionObserver" in window)) {
      grid.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); observer.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    grid.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }
  window.addEventListener("resize", staggerColumns);

  /* ---------- Fenêtre projet ----------------------------------------- */
  function fillModal(i) {
    const p = projects[i];
    modal.querySelector(".modal-index").textContent =
      `${String(i + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
    modal.querySelector("#modal-title").textContent = field(p, "titre");

    const cats = modal.querySelector(".modal-cats");
    cats.innerHTML = "";
    field(p, "categories").forEach((c) => {
      const li = document.createElement("li");
      li.textContent = c;
      cats.appendChild(li);
    });

    const desc = modal.querySelector(".modal-desc");
    desc.innerHTML = "";
    field(p, "texte").forEach((para) => {
      const el = document.createElement("p");
      el.textContent = para;
      desc.appendChild(el);
    });

    const link = modal.querySelector(".modal-link");
    link.innerHTML = "";
    if (p.lien) {
      const a = document.createElement("a");
      a.href = p.lien.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = `${p.lien[`libelle_${lang}`]} ↗`;
      link.appendChild(a);
    }

    const imgs = modal.querySelector(".modal-images");
    imgs.innerHTML = "";
    p.images.forEach((im, k) => {
      const fig = document.createElement("figure");
      const img = makeImage(im.fichier, `${field(p, "titre")} — ${k + 1}`, fig);
      img.addEventListener("load", () => fitSmall(img));
      fig.addEventListener("click", () => { if (img.isConnected) openLightbox(img.src, img.alt); });
      imgs.appendChild(fig);
    });
  }

  /* Une image de moins de 1200 px de large est affichée à 2/3 de sa taille
     réelle, au lieu d'être étirée sur toute la colonne (elle serait floue). */
  const SMALL_LIMIT = 1200, SMALL_SCALE = 1 / 1.5;
  function fitSmall(img) {
    if (img.naturalWidth && img.naturalWidth < SMALL_LIMIT) {
      img.classList.add("is-small");
      img.style.maxWidth = `${Math.round(img.naturalWidth * SMALL_SCALE)}px`;
    }
  }

  function openProject(i, push) {
    if (currentIndex === -1) lastFocus = document.activeElement;
    currentIndex = i;
    fillModal(i);
    modal.hidden = false;
    modal.scrollTop = 0;
    document.body.classList.add("no-scroll");
    const hash = `#${projects[i].id}`;
    if (push && location.hash !== hash) history.pushState({ project: i }, "", hash);
    document.title = `${field(projects[i], "titre")} — Delphine Taverne`;
    modal.querySelector(".modal-close").focus({ preventScroll: true });
  }

  function closeProject(push) {
    if (currentIndex === -1) return;
    currentIndex = -1;
    modal.hidden = true;
    document.body.classList.remove("no-scroll");
    document.title = "Delphine Taverne — Portfolio";
    if (push) history.pushState({}, "", location.pathname + location.search);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  function step(dir) {
    const list = visibleIndexes();
    const pos = list.indexOf(currentIndex);
    const next = list[(pos + dir + list.length) % list.length];
    openProject(next, false);
    history.replaceState({ project: next }, "", `#${projects[next].id}`);
  }

  modal.querySelector(".modal-close").addEventListener("click", () => closeProject(true));
  modal.querySelector(".prev").addEventListener("click", () => step(-1));
  modal.querySelector(".next").addEventListener("click", () => step(1));
  document.querySelectorAll("[data-close-modal]").forEach((el) => el.addEventListener("click", () => closeProject(true)));

  /* Bouton « retour » du navigateur + lien direct vers un projet */
  function syncWithHash() {
    const id = location.hash.slice(1);
    const i = projects.findIndex((p) => p.id === id);
    if (i >= 0) openProject(i, false);
    else closeProject(false);
  }
  window.addEventListener("popstate", syncWithHash);

  /* ---------- Agrandissement d'image --------------------------------- */
  function openLightbox(src, alt) {
    const img = lightbox.querySelector("img");
    img.src = src; img.alt = alt;
    lightbox.hidden = false;
  }
  lightbox.addEventListener("click", () => { lightbox.hidden = true; });

  /* ---------- Clavier ------------------------------------------------ */
  document.addEventListener("keydown", (e) => {
    if (!lightbox.hidden) { if (e.key === "Escape") lightbox.hidden = true; return; }
    if (currentIndex === -1) return;
    if (e.key === "Escape") closeProject(true);
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "Tab") { // garde le focus dans la fenêtre
      const f = [...modal.querySelectorAll("button, a[href]")].filter((el) => el.offsetParent);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- Changement de langue ----------------------------------- */
  function translateStatic() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-label]").forEach((el) => {
      el.setAttribute("aria-label", t(el.dataset.i18nLabel));
      if (el.hasAttribute("title")) el.title = t(el.dataset.i18nLabel);
    });
  }
  function applyLang() {
    translateStatic();
    modal.querySelector(".modal-close").setAttribute("aria-label", lang === "fr" ? "Fermer" : "Close");
    document.querySelectorAll(".lang-switch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    filter = null;
    buildFilters();
    buildGrid();
    grid.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    if (currentIndex >= 0) fillModal(currentIndex);
  }
  document.querySelectorAll(".lang-switch button").forEach((b) =>
    b.addEventListener("click", () => {
      lang = b.dataset.lang;
      try { localStorage.setItem("lang", lang); } catch (e) {}
      applyLang();
    })
  );

  /* ---------- Démarrage ---------------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();
  translateStatic();
  document.querySelectorAll(".lang-switch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  window.SITE = { t, lang: () => lang }; // utilisé par dessin.js
  buildFilters();
  buildGrid();
  syncWithHash();
})();
