/* =========================================================================
   DESSIN — le curseur devient un crayon
   Cliquer-glisser trace un trait sur la page (souris ou stylet).
   Palette en bas à droite, corbeille pour effacer, flèche pour télécharger.
   ========================================================================= */
(() => {
  const CONFIG = {
    epaisseur: 3,          // épaisseur du trait en pixels
    seuil: 5,              // distance (px) avant qu'un clic devienne un trait
    couleurs: [            // "ink" = couleur du texte (suit la teinte du fond)
      { id: "ink", fr: "Encre", en: "Ink" },
      // Quatre teintes de même douceur, réparties autour du cercle chromatique
      { id: "#a68ad9", fr: "Lilas", en: "Lilac" },
      { id: "#3cbfa4", fr: "Menthe", en: "Mint" },
      { id: "#1f5948", fr: "Sapin", en: "Fir green" },
      { id: "#ec8240", fr: "Orange", en: "Orange" },
    ],
  };

  // Le dessin est réservé aux appareils avec souris ou stylet
  if (!window.matchMedia("(any-pointer: fine)").matches) return;

  const root = document.documentElement;
  const canvas = document.getElementById("draw-layer");
  const ctx = canvas.getContext("2d");
  const tools = document.getElementById("draw-tools");
  const swatchesEl = tools.querySelector(".swatches");
  const hint = tools.querySelector(".draw-hint");
  const S = window.SITE;

  root.classList.add("can-draw");

  let strokes = [];        // traits enregistrés en coordonnées de page (ils défilent avec le contenu)
  let color = "ink";
  let pending = null;      // appui en cours, pas encore un trait
  let current = null;      // trait en cours
  let suppressClick = false;
  let dpr = 1;

  const inkColor = () => getComputedStyle(root).getPropertyValue("--text").trim() || "#222";
  const resolve = (c) => (c === "ink" ? inkColor() : c);

  /* ---------- Curseur crayon de la couleur choisie ------------------- */
  function updateCursor() {
    const fill = resolve(color);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'>
      <path d='M3 25l1.8-6.2L19.5 4.1l4.4 4.4L9.2 23.2z' fill='${fill}' stroke='white' stroke-width='3' stroke-linejoin='round'/>
      <path d='M3 25l1.8-6.2L19.5 4.1l4.4 4.4L9.2 23.2z' fill='${fill}' stroke='#111' stroke-width='1.3' stroke-linejoin='round'/>
      <path d='M16.6 7l4.4 4.4' stroke='#111' stroke-width='1.3'/>
      <path d='M3 25l1.8-6.2 4.4 4.4z' fill='#111'/></svg>`;
    root.style.setProperty("--pen-cursor", `url("data:image/svg+xml,${encodeURIComponent(svg)}") 3 25, crosshair`);
  }
  setInterval(() => { if (color === "ink") updateCursor(); }, 2000); // suit la teinte qui change

  /* ---------- Palette ------------------------------------------------- */
  function buildSwatches() {
    swatchesEl.innerHTML = "";
    CONFIG.couleurs.forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "swatch";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", String(c.id === color));
      b.setAttribute("aria-label", c[S.lang()] || c.fr);
      b.title = c[S.lang()] || c.fr;
      b.style.setProperty("--c", c.id === "ink" ? "var(--text)" : c.id);
      b.addEventListener("click", () => { color = c.id; buildSwatches(); updateCursor(); });
      swatchesEl.appendChild(b);
    });
  }
  document.querySelectorAll(".lang-switch button").forEach((b) => b.addEventListener("click", () => setTimeout(buildSwatches)));

  /* ---------- Toile --------------------------------------------------- */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    redraw();
  }
  function strokePath(c, s, offsetX, offsetY) {
    const pts = s.points;
    c.strokeStyle = resolve(s.color);
    c.lineWidth = s.width;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(pts[0][0] - offsetX, pts[0][1] - offsetY);
    if (pts.length === 1) c.lineTo(pts[0][0] - offsetX + 0.01, pts[0][1] - offsetY);
    for (let i = 1; i < pts.length - 1; i++) { // courbes lissées entre les points
      const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
      c.quadraticCurveTo(pts[i][0] - offsetX, pts[i][1] - offsetY, mx - offsetX, my - offsetY);
    }
    if (pts.length > 1) { const l = pts[pts.length - 1]; c.lineTo(l[0] - offsetX, l[1] - offsetY); }
    c.stroke();
  }
  function redraw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const y0 = scrollY, y1 = scrollY + innerHeight;
    strokes.forEach((s) => { if (s.maxY >= y0 - 20 && s.minY <= y1 + 20) strokePath(ctx, s, 0, scrollY); });
  }
  let raf = 0;
  const scheduleRedraw = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; redraw(); }); };
  addEventListener("scroll", scheduleRedraw, { passive: true });
  addEventListener("resize", resize);
  setInterval(() => { if (strokes.some((s) => s.color === "ink")) scheduleRedraw(); }, 1000);

  /* ---------- Tracé --------------------------------------------------- */
  const blocked = () => document.body.classList.contains("no-scroll") || !document.getElementById("lightbox").hidden;

  addEventListener("pointerdown", (e) => {
    suppressClick = false; // un nouvel appui n'est jamais la fin d'un trait
    if (e.button !== 0 || e.pointerType === "touch" || blocked()) return;
    if (e.target.closest(".draw-tools, input, textarea, select")) return;
    pending = { x: e.clientX, y: e.clientY, id: e.pointerId };
  });

  addEventListener("pointermove", (e) => {
    if (pending && e.pointerId === pending.id && !current) {
      if (Math.hypot(e.clientX - pending.x, e.clientY - pending.y) < CONFIG.seuil) return;
      current = { color, width: CONFIG.epaisseur, points: [[pending.x, pending.y + scrollY]], minY: Infinity, maxY: -Infinity };
      strokes.push(current);
      document.body.classList.add("is-drawing");
      getSelection()?.removeAllRanges();
      tools.classList.add("has-drawn");
    }
    if (!current) return;
    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of events) {
      const y = ev.clientY + scrollY;
      current.points.push([ev.clientX, y]);
      current.minY = Math.min(current.minY, y, current.points[0][1]);
      current.maxY = Math.max(current.maxY, y, current.points[0][1]);
    }
    scheduleRedraw();
  });

  function end() {
    if (current) {
      suppressClick = true; // le relâchement ne doit pas ouvrir un projet
      setTimeout(() => { suppressClick = false; }, 60);
    }
    pending = null;
    current = null;
    document.body.classList.remove("is-drawing");
  }
  addEventListener("pointerup", end);
  addEventListener("pointercancel", end);
  addEventListener("click", (e) => { if (suppressClick) { e.preventDefault(); e.stopPropagation(); } }, true);
  addEventListener("dragstart", (e) => e.preventDefault()); // évite le glisser-déposer natif des liens et images

  /* ---------- Effacer ------------------------------------------------- */
  tools.querySelector(".draw-clear").addEventListener("click", () => {
    strokes = [];
    redraw();
  });

  /* ---------- Export en image ---------------------------------------- */
  function exportDrawing() {
    if (!strokes.length) return Promise.resolve(null);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    strokes.forEach((s) => s.points.forEach(([x, y]) => {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }));
    const pad = 40;
    const w = maxX - minX + pad * 2, h = maxY - minY + pad * 2;
    const scale = Math.min(2, 2400 / Math.max(w, h));
    const c = document.createElement("canvas");
    c.width = Math.round(w * scale);
    c.height = Math.round(h * scale);
    const x = c.getContext("2d");
    x.fillStyle = getComputedStyle(root).getPropertyValue("--bg").trim() || "#fff";
    x.fillRect(0, 0, c.width, c.height);
    x.scale(scale, scale);
    strokes.forEach((s) => strokePath(x, s, minX - pad, minY - pad));
    return new Promise((res) => c.toBlob(res, "image/png"));
  }

  /* ---------- Téléchargement --------------------------------------- */
  const fileName = () => `dessin-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-")}.png`;
  let hintTimer = 0;
  function flash(key) { // message bref au-dessus de la palette
    hint.textContent = S.t(key);
    tools.classList.add("show-hint");
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => {
      tools.classList.remove("show-hint");
      setTimeout(() => { hint.textContent = S.t("draw_hint"); }, 400);
    }, 1800);
  }
  tools.querySelector(".draw-download").addEventListener("click", async () => {
    const blob = await exportDrawing();
    if (!blob) return flash("draw_empty");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flash("draw_saved");
  });

  /* ---------- Démarrage ---------------------------------------------- */
  buildSwatches();
  updateCursor();
  resize();
})();
