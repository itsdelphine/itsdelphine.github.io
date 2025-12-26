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

/* Pan state - Google Maps style */
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let isDragging = false;
let velocityX = 0;
let lastX = 0;
let lastTime = 0;

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
    currentY = 0;
    velocityX = 0;
    panContainer.style.transform = 'translate(0px, 0px)';

    // Wait for image to load before creating hotspots
    imgEl.onload = () => {
      // Update hotspot layer width to match image
      layer.style.width = imgEl.offsetWidth + 'px';
      
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
   PAN FUNCTIONALITY - GOOGLE MAPS STYLE
========================= */

viewport.addEventListener("touchstart", (e) => {
  // Don't pan if touching a hotspot
  if (e.target.classList.contains('hotspot')) {
    return;
  }

  isDragging = true;
  velocityX = 0;
  
  const touch = e.touches[0];
  startX = touch.clientX - currentX;
  lastX = touch.clientX;
  lastTime = Date.now();
}, { passive: true });

viewport.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  
  e.preventDefault();

  const touch = e.touches[0];
  const now = Date.now();
  const dt = now - lastTime;
  
  if (dt > 0) {
    velocityX = (touch.clientX - lastX) / dt;
  }
  
  lastX = touch.clientX;
  lastTime = now;

  let newX = touch.clientX - startX;

  // Get dimensions
  const viewportWidth = viewport.offsetWidth;
  const imageWidth = imgEl.offsetWidth;

  // Add elastic resistance at edges
  const minX = viewportWidth - imageWidth;
  const maxX = 0;

  if (imageWidth > viewportWidth) {
    // Apply elastic effect when dragging beyond bounds
    if (newX > maxX) {
      const overDrag = newX - maxX;
      newX = maxX + overDrag * 0.3;
    } else if (newX < minX) {
      const overDrag = minX - newX;
      newX = minX - overDrag * 0.3;
    }
  } else {
    // Center if image is smaller
    newX = (viewportWidth - imageWidth) / 2;
  }

  currentX = newX;
  panContainer.style.transform = `translate(${currentX}px, 0px)`;
}, { passive: false });

viewport.addEventListener("touchend", (e) => {
  if (!isDragging) return;
  
  isDragging = false;

  const viewportWidth = viewport.offsetWidth;
  const imageWidth = imgEl.offsetWidth;
  const minX = viewportWidth - imageWidth;
  const maxX = 0;

  // Apply momentum/inertia
  if (Math.abs(velocityX) > 0.1 && imageWidth > viewportWidth) {
    applyMomentum(minX, maxX);
  } else {
    // Snap back if beyond bounds
    snapToBounds(minX, maxX);
  }
});

viewport.addEventListener("touchcancel", () => {
  isDragging = false;
});

/* =========================
   MOMENTUM AND SNAP BACK
========================= */

function applyMomentum(minX, maxX) {
  const deceleration = 0.95;
  let momentum = velocityX * 16; // Convert to pixels

  function momentumStep() {
    momentum *= deceleration;
    currentX += momentum;

    // Check bounds
    if (currentX > maxX || currentX < minX) {
      snapToBounds(minX, maxX);
      return;
    }

    panContainer.style.transform = `translate(${currentX}px, 0px)`;

    if (Math.abs(momentum) > 0.5) {
      requestAnimationFrame(momentumStep);
    }
  }

  requestAnimationFrame(momentumStep);
}

function snapToBounds(minX, maxX) {
  if (currentX > maxX) {
    animateToPosition(maxX);
  } else if (currentX < minX) {
    animateToPosition(minX);
  }
}

function animateToPosition(targetX) {
  const startPos = currentX;
  const distance = targetX - startPos;
  const duration = 300;
  const startTime = Date.now();

  function animate() {
    const now = Date.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    
    currentX = startPos + distance * easeProgress;
    panContainer.style.transform = `translate(${currentX}px, 0px)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
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
      const radius = 45;

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
  if (imgEl.complete) {
    layer.style.width = imgEl.offsetWidth + 'px';
    centerImageIfNeeded();
  }
});
