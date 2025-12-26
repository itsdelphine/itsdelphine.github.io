/* =========================
   GLOBAL STATE & ELEMENTS
========================= */

let data = null;
let currentSceneKey = null;

const sceneEl = document.getElementById("scene");
const imgEl = document.getElementById("sceneImage");
const layer = document.getElementById("hotspotLayer");
const viewport = document.getElementById("panViewport");
const panContainer = document.getElementById("panContainer");

/* Modals */
const modal = document.getElementById("modal");
const infoModal = document.getElementById("infoModal");

/* Tooltip */
let tooltip = null;

/* Pan state */
let startX = 0;
let currentX = 0;
let isDragging = false;

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

    // Reset pan position
    currentX = 0;
    panContainer.style.transform = 'translate(0px, 0px)';

    // Wait for image to load before creating hotspots
    imgEl.onload = () => {
      scene.hotspots.forEach(h => createHotspotGroup(h));
      centerImageIfNeeded();
    };

    // Fade in
    sceneEl.classList.remove("hidden");
  }, 400);

  document.querySelectorAll(".scene-nav button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.scene === key);
  });
}

/* =========================
   CENTER IMAGE IF SMALLER
========================= */

function centerImageIfNeeded() {
  const viewportWidth = viewport.offsetWidth;
  const imageWidth = imgEl.offsetWidth;

  if (imageWidth <= viewportWidth) {
    currentX = (viewportWidth - imageWidth) / 2;
    panContainer.style.transform = `translate(${currentX}px, 0px)`;
  }
}

/* =========================
   PAN FUNCTIONALITY
========================= */

viewport.addEventListener("touchstart", (e) => {
  isDragging = true;
  const touch = e.touches[0];
  startX = touch.clientX - currentX;
}, { passive: true });

viewport.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  
  e.preventDefault();

  const touch = e.touches[0];
  let newX = touch.clientX - startX;

  // Get dimensions
  const viewportWidth = viewport.offsetWidth;
  const imageWidth = imgEl.offsetWidth;

  // Constrain panning
  const minX = viewportWidth - imageWidth;
  const maxX = 0;

  // Only constrain if image is wider than viewport
  if (imageWidth > viewportWidth) {
    newX = Math.max(minX, Math.min(maxX, newX));
  } else {
    // Center if image is smaller
    newX = (viewportWidth - imageWidth) / 2;
  }

  currentX = newX;
  panContainer.style.transform = `translate(${currentX}px, 0px)`;
}, { passive: false });

viewport.addEventListener("touchend", () => {
  isDragging = false;
});

viewport.addEventListener("touchcancel", () => {
  isDragging = false;
});

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
      const radius = 40;

      const child = document.createElement("div");
      child.className = "hotspot";
      child.style.left = `calc(${h.position.x}% + ${Math.cos(angle) * radius}px)`;
      child.style.top = `calc(${h.position.y}% + ${Math.sin(angle) * radius}px)`;

      child.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal(entry);
        closeChildren();
      });

      layer.appendChild(child);
      children.push(child);
    });
  }

  function closeChildren() {
    children.forEach(c => c.remove());
    children = [];
    base.classList.remove("hotspot--collapsed");
  }

  function scheduleClose() {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      closeChildren();
    }, 3000);
  }

  /* Base click */
  base.addEventListener("click", (e) => {
    e.stopPropagation();
    
    if (h.entries.length === 1) {
      openModal(h.entries[0]);
    } else {
      if (children.length === 0) {
        openSplit();
        scheduleClose();
      } else {
        closeChildren();
      }
    }
  });

  layer.appendChild(base);
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
      textContainer.textContent = "Erreur de chargement du texte.";
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

window.addEventListener("click", (e) => {
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

  fetch("texts/infos.txt")
    .then(r => r.text())
    .then(text => container.textContent = text)
    .catch(() => {
      container.textContent = "Erreur de chargement.";
    });
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
   WINDOW RESIZE
========================= */

window.addEventListener("resize", () => {
  centerImageIfNeeded();
});
