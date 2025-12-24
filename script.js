/* =========================
   GLOBAL STATE & ELEMENTS
========================= */

let data = null;
let currentSceneKey = null;

const sceneEl = document.getElementById("scene");
const imgEl = document.getElementById("sceneImage");
const layer = document.getElementById("hotspotLayer");

/* Modals */
const modal = document.getElementById("modal");
const infoModal = document.getElementById("infoModal");

/* Tooltip */
let tooltip = null;

/* =========================
   LOAD JSON DATA
========================= */

fetch("hotspots.json")
  .then(res => {
    if (!res.ok) throw new Error("Cannot load hotspots.json");
    return res.json();
  })
  .then(json => {
    data = json;
    loadScene(data.meta.defaultScene);
  })
  .catch(err => {
    console.error(err);
    alert("Erreur de chargement des données.");
  });

/* =========================
   SCENE LOADING
========================= */

function loadScene(key) {
  if (!data || !data.scenes[key]) return;

  currentSceneKey = key;

  // Fade out
  sceneEl.classList.add("hidden");

  setTimeout(() => {
    const scene = data.scenes[key];

    imgEl.src = scene.image;
    layer.innerHTML = "";

    scene.hotspots.forEach(h => createHotspotGroup(h));

    // Fade in
    sceneEl.classList.remove("hidden");
  }, 400);
}

/* =========================
   HOTSPOTS
========================= */

function createHotspotGroup(h) {
  const base = document.createElement("div");
  base.className = "hotspot";
  base.style.left = h.position.x + "%";
  base.style.top = h.position.y + "%";

  let children = [];

  /* Hover on base */
  base.addEventListener("mouseenter", () => {
    showTooltip(base, h.entries[0].label);

    // Split only if multiple entries
    if (h.entries.length > 1 && children.length === 0) {
      h.entries.forEach((entry, index) => {
        const angle = (index / h.entries.length) * Math.PI * 2;
        const radius = 34;

        const child = document.createElement("div");
        child.className = "hotspot";
        child.style.left =
          `calc(${h.position.x}% + ${Math.cos(angle) * radius}px)`;
        child.style.top =
          `calc(${h.position.y}% + ${Math.sin(angle) * radius}px)`;

        child.addEventListener("mouseenter", () =>
          showTooltip(child, entry.label)
        );

        child.addEventListener("mouseleave", hideTooltip);

        child.addEventListener("click", () =>
          openModal(entry)
        );

        layer.appendChild(child);
        children.push(child);
      });
    }
  });

  /* Leave base */
  base.addEventListener("mouseleave", () => {
    hideTooltip();

    children.forEach(c => c.remove());
    children = [];
  });

  /* Click on base if single entry */
  if (h.entries.length === 1) {
    base.addEventListener("click", () =>
      openModal(h.entries[0])
    );
  }

  layer.appendChild(base);
}

/* =========================
   TOOLTIP
========================= */

function showTooltip(el, text) {
  hideTooltip();
  tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.textContent = text;
  el.appendChild(tooltip);
}

function hideTooltip() {
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }
}

/* =========================
   MODAL (MAIN CONTENT)
========================= */

function openModal(entry) {
  modal.style.display = "block";

  document.getElementById("modalTitle").textContent = entry.title;
  document.getElementById("modalAuthor").textContent = entry.author;
  document.getElementById("modalPdf").href = entry.pdf;

  const textContainer = document.getElementById("modalText");
  textContainer.textContent = "Chargement…";

  fetch(entry.text)
    .then(res => {
      if (!res.ok) throw new Error("Cannot load text file");
      return res.text();
    })
    .then(text => {
      textContainer.textContent = text;
    })
    .catch(() => {
      textContainer.textContent =
        "Erreur de chargement du texte.";
    });
}

/* =========================
   MODAL CONTROLS
========================= */

document.querySelectorAll(".close").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest(".modal").style.display = "none";
  });
});

window.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
  if (e.target === infoModal) infoModal.style.display = "none";
});

/* =========================
   INFO BUTTON
========================= */

document.getElementById("infoBtn").addEventListener("click", () => {
  infoModal.style.display = "block";
});

/* =========================
   SCENE NAVIGATION
========================= */

document.querySelectorAll(".scene-nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    loadScene(btn.dataset.scene);
  });
});
