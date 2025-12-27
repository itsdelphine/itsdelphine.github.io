/* =========================
   GLOBAL STATE & ELEMENTS
========================= */

let data = null;
let currentSceneKey = null;

const sceneEl = document.getElementById("scene");
const imgEl = document.getElementById("sceneImage");
const sidepanel = document.getElementById("sidepanel");
const sidepanelTitle = document.getElementById("sidepanelTitle");
const sidepanelText = document.getElementById("sidepanelText");
const sidepanelToggle = document.getElementById("sidepanelToggle");
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

    // Update sidepanel content
    if (scene.sidepanelContent) {
      sidepanelTitle.textContent = scene.sidepanelContent.title;
      
      // Show loading message while fetching
      sidepanelText.innerHTML = "<p>Chargement...</p>";
      
      // Fetch the external HTML file
      fetch(scene.sidepanelContent.textFile)
        .then(res => {
          if (!res.ok) throw new Error("Cannot load sidepanel text file");
          return res.text();
        })
        .then(html => {
          sidepanelText.innerHTML = html;
        })
        .catch(err => {
          console.error(err);
          sidepanelText.innerHTML = "<p>Erreur de chargement du contenu.</p>";
        });
    } else {
      sidepanelTitle.textContent = "Information";
      sidepanelText.innerHTML = "<p>Aucune information disponible pour cette scène.</p>";
    }

    // Wait for image to load before creating hotspots
    imgEl.onload = () => {
      scene.hotspots.forEach(h => createHotspotGroup(h));
    };

    // Fade in
    sceneEl.classList.remove("hidden");
  }, 400);

  document.querySelectorAll(".scene-nav button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.scene === key);
  });
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
  let closeTimer = null;

  function openSplit() {
    if (children.length > 0 || h.entries.length <= 1) return;

    base.classList.add("hotspot--collapsed");

    h.entries.forEach((entry, index) => {
      const angle = (index / h.entries.length) * Math.PI * 2;
      const radius = 34;

      const child = document.createElement("div");
      child.className = "hotspot";
      child.style.left =
        `calc(${h.position.x}% + ${Math.cos(angle) * radius}px)`;
      child.style.top =
        `calc(${h.position.y}% + ${Math.sin(angle) * radius}px)`;

      child.addEventListener("mouseenter", () => {
        if (closeTimer) clearTimeout(closeTimer);
        showTooltip(child, entry.label);
      });

      child.addEventListener("mouseleave", () => {
        hideTooltip();
        scheduleClose();
      });

      child.addEventListener("click", () => openModal(entry));

      layer.appendChild(child);
      children.push(child);
    });
  }

  function scheduleClose() {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      children.forEach(c => c.remove());
      children = [];
      base.classList.remove("hotspot--collapsed");
    }, 500);
  }

  /* Base hover */
  base.addEventListener("mouseenter", () => {
    if (closeTimer) clearTimeout(closeTimer);
    if (h.entries.length === 1) {
      showTooltip(base, h.entries[0].label);
    }
    openSplit();
  });

  base.addEventListener("mouseleave", () => {
    hideTooltip();
    scheduleClose();
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

  // Attach to hotspotLayer, NOT to the hotspot
  layer.appendChild(tooltip);

  // Position tooltip at the hotspot coordinates
  tooltip.style.left = el.style.left;
  tooltip.style.top = el.style.top;
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

function setModalState(isOpen) {
  document.body.classList.toggle("modal-open", isOpen);
}

function openModal(entry) {
  setModalState(true);
  modal.classList.add("is-open");

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
    btn.closest(".modal").classList.remove("is-open");
    setModalState(false);
  });
});

window.addEventListener("click", e => {
  if (e.target === modal) {
    modal.classList.remove("is-open");
    setModalState(false);
  }
  if (e.target === infoModal) {
    infoModal.classList.remove("is-open");
    setModalState(false);
  }
});

/* =========================
   INFO BUTTON
========================= */

document.getElementById("infoBtn").addEventListener("click", () => {
  setModalState(true);
  infoModal.classList.add("is-open");

  const container = document.getElementById("infoText");
  container.textContent = "Chargement…";

  fetch("texts/infos.html")
    .then(r => r.text())
    .then(html => container.innerHTML = html)
});

/* =========================
   SCENE NAVIGATION
========================= */

document.querySelectorAll(".scene-nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    loadScene(btn.dataset.scene);
  });
});

/* =========================
   SIDEPANEL TOGGLE
========================= */

sidepanelToggle.addEventListener("click", () => {
  sidepanel.classList.toggle("sidepanel--open");
});
