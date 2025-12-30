/* =========================
   FIX MOBILE VIEWPORT HEIGHT
========================= */

// Set CSS variable for actual viewport height
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

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
/* Sidepanel */
const sidepanel = document.getElementById("sidepanel");
const sidepanelTitle = document.getElementById("sidepanelTitle");
const sidepanelText = document.getElementById("sidepanelText");
const sidepanelToggle = document.getElementById("sidepanelToggle");

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

    // Update sidepanel content
    if (scene.sidepanelContent) {
      sidepanelTitle.textContent = scene.sidepanelContent.title;
      
      // Show loading message while fetching
      sidepanelText.innerHTML = "<p>Chargement...</p>";
      
      // Calculate the total number of hotspot entries (including splits)
      const hotspotCount = scene.hotspots.reduce((total, hotspot) => {
      return total + hotspot.entries.length;
      }, 0);
      
      // Fetch the external HTML file
      fetch(scene.sidepanelContent.textFile)
        .then(res => {
          if (!res.ok) throw new Error("Cannot load sidepanel text file");
          return res.text();
        })
        .then(html => {
  const processedHtml = html.replace(/{{hotspotCount}}/g, hotspotCount);
  sidepanelText.innerHTML = processedHtml;
  
// Check sidepanel scroll indicator
const sidepanelContent = document.querySelector(".sidepanel-content");
const sidepanelScrollIndicator = document.querySelector(".scroll-indicator-sidepanel");
setTimeout(() => {
  checkScrollIndicator(sidepanelContent, sidepanelScrollIndicator);
}, 100);
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
      // Update hotspot layer width to match image
      layer.style.width = imgEl.offsetWidth + 'px';
      
      scene.hotspots.forEach(h => createHotspotGroup(h));
      centerImage();
    };

    // Fade in
    sceneEl.classList.remove("hidden");
  }, 400);

  document.querySelectorAll(".scene-nav button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.scene === key);
  });
}

/* =========================
   CENTER IMAGE
========================= */

function centerImage() {
  const viewportWidth = viewport.offsetWidth;
  const imageWidth = imgEl.offsetWidth;

  // Always center the image on load
  currentX = (viewportWidth - imageWidth) / 2;
  panContainer.style.transform = `translate(${currentX}px, 0px)`;
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
  const modalBody = document.querySelector("#modal .modal-body");
  const scrollIndicator = document.querySelector("#modal .scroll-indicator");
  
  textContainer.textContent = "Chargement…";

  // Hide indicator while loading
  scrollIndicator.classList.remove("visible");

  fetch(entry.text)
    .then(res => {
      if (!res.ok) throw new Error("Cannot load text file");
      return res.text();
    })
    .then(html => {
      textContainer.innerHTML = html;
      
      // Check if content is scrollable after a brief delay
      setTimeout(() => {
        checkScrollIndicator(modalBody, scrollIndicator);
      }, 100);
    })
    .catch(() => {
      textContainer.textContent = "Erreur de chargement du texte.";
    });
}

// Function to check if scroll indicator should be visible
function checkScrollIndicator(container, indicator) {
  if (container.scrollHeight > container.clientHeight) {
    // Content is scrollable
    indicator.classList.add("visible");
    
    // Hide indicator when scrolled to bottom
    container.addEventListener("scroll", function checkScroll() {
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
      if (isAtBottom) {
        indicator.classList.remove("visible");
      } else {
        indicator.classList.add("visible");
      }
    });
  } else {
    // Content fits, no need for indicator
    indicator.classList.remove("visible");
  }
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
  const scrollIndicator = document.querySelector("#infoModal .scroll-indicator");
  
  container.textContent = "Chargement…";
  scrollIndicator.classList.remove("visible");

  fetch("texts/infos.html")
    .then(r => r.text())
    .then(html => {
      container.innerHTML = html;
      
      setTimeout(() => {
        checkScrollIndicator(container, scrollIndicator);
      }, 100);
    })
    .catch(() => {
      container.textContent = "Erreur de chargement.";
    });
});

/* =========================
   SCENE NAVIGATION
========================= */

document.querySelectorAll(".scene-nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    // Skip if it's the dropdown trigger (has no data-scene)
    if (!btn.dataset.scene) return;
    
    loadScene(btn.dataset.scene);
  });
});

/* =========================
   WINDOW RESIZE
========================= */

window.addEventListener("resize", () => {
  if (imgEl.complete) {
    layer.style.width = imgEl.offsetWidth + 'px';
    centerImage();
  }
});

/* =========================
   FLOOR NAVIGATION SYSTEM
========================= */

const floorNavArrows = document.querySelector(".floor-nav-arrows");
const floorUpBtn = document.getElementById("floorUp");
const floorDownBtn = document.getElementById("floorDown");
const dropdownContainer = document.querySelector(".scene-nav-dropdown");
const dropdownTrigger = dropdownContainer.querySelector(".dropdown-trigger");

// Get all scenes in the floor group
function getFloorScenes() {
  if (!data) return [];
  return Object.keys(data.scenes)
    .filter(key => data.scenes[key].floorGroup === "upper_floors")
    .sort((a, b) => data.scenes[a].floorOrder - data.scenes[b].floorOrder);
}

// Check if current scene is in floor group
function isFloorScene() {
  return data.scenes[currentSceneKey]?.floorGroup === "upper_floors";
}

// Update floor arrow visibility and state
function updateFloorNavigation() {
  if (!isFloorScene()) {
    floorNavArrows.classList.remove("visible");
    return;
  }

  floorNavArrows.classList.add("visible");

  const floors = getFloorScenes();
  const currentIndex = floors.indexOf(currentSceneKey);

  // Update button states
  floorUpBtn.disabled = currentIndex >= floors.length - 1;
  floorDownBtn.disabled = currentIndex <= 0;

  // Update dropdown active state
  updateDropdownActiveState();
}

// Navigate to adjacent floor
function navigateFloor(direction) {
  const floors = getFloorScenes();
  const currentIndex = floors.indexOf(currentSceneKey);
  const newIndex = currentIndex + direction;

  if (newIndex >= 0 && newIndex < floors.length) {
    loadScene(floors[newIndex]);
  }
}

// Update dropdown active state
function updateDropdownActiveState() {
  document.querySelectorAll(".dropdown-menu button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.scene === currentSceneKey);
  });
}

// Floor arrow click handlers
floorUpBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  navigateFloor(1);
});

floorDownBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  navigateFloor(-1);
});

// Dropdown toggle
dropdownTrigger.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdownContainer.classList.toggle("open");
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!dropdownContainer.contains(e.target)) {
    dropdownContainer.classList.remove("open");
  }
});

// Dropdown menu item clicks
document.querySelectorAll(".dropdown-menu button").forEach(btn => {
  btn.addEventListener("click", () => {
    loadScene(btn.dataset.scene);
    dropdownContainer.classList.remove("open");
  });
});

// Swipe gesture navigation for floors
let swipeStartY = 0;
let swipeStartTime = 0;

viewport.addEventListener("touchstart", (e) => {
  if (!isFloorScene()) return;
  if (e.target.classList.contains('hotspot')) return;
  
  swipeStartY = e.touches[0].clientY;
  swipeStartTime = Date.now();
}, { passive: true });

viewport.addEventListener("touchend", (e) => {
  if (!isFloorScene()) return;
  if (isDragging) return; // Don't trigger if user was panning
  
  const swipeEndY = e.changedTouches[0].clientY;
  const swipeEndTime = Date.now();
  const swipeDistance = swipeStartY - swipeEndY;
  const swipeTime = swipeEndTime - swipeStartTime;
  
  // Quick vertical swipe detection (min 50px, max 500ms)
  if (Math.abs(swipeDistance) > 50 && swipeTime < 500) {
    if (swipeDistance > 0) {
      // Swiped up
      navigateFloor(1);
    } else {
      // Swiped down
      navigateFloor(-1);
    }
  }
}, { passive: true });

/* =========================
   UPDATE LOAD SCENE TO HANDLE FLOORS
========================= */

// Store the original loadScene function
const originalLoadScene = loadScene;

// Override loadScene to include floor navigation updates
loadScene = function(key) {
  originalLoadScene(key);
  
  // Update floor navigation after scene loads
  setTimeout(() => {
    updateFloorNavigation();
  }, 100);
};

/* =========================
   SIDEPANEL TOGGLE
========================= */

// Create overlay element
const sidepanelOverlay = document.createElement('div');
sidepanelOverlay.className = 'sidepanel-overlay';
document.body.appendChild(sidepanelOverlay);

// Toggle sidepanel
sidepanelToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  sidepanel.classList.toggle("sidepanel--open");
  sidepanelOverlay.classList.toggle("active");
});

// Close sidepanel when tapping overlay
sidepanelOverlay.addEventListener("click", () => {
  sidepanel.classList.remove("sidepanel--open");
  sidepanelOverlay.classList.remove("active");
});

// Close sidepanel when opening a modal
const originalSetModalState = setModalState;
setModalState = function(isOpen) {
  originalSetModalState(isOpen);
  if (isOpen) {
    sidepanel.classList.remove("sidepanel--open");
    sidepanelOverlay.classList.remove("active");
  }
};
