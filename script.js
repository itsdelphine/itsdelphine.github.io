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
          // Replace placeholder with actual hotspot count
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
  const modalBody = document.querySelector("#modal .modal-body");
  const scrollIndicator = document.querySelector("#modal .scroll-indicator");
  
  textContainer.innerHTML = "Chargement…";

  // Hide indicator while loading
  scrollIndicator.classList.remove("visible");

  fetch(entry.text)
    .then(res => {
      if (!res.ok) throw new Error("Cannot load text file");
      return res.text();
    })
    .then(html => {
      textContainer.innerHTML = html;
      
      // Check if content is scrollable after a brief delay (to ensure content is rendered)
      setTimeout(() => {
        checkScrollIndicator(modalBody, scrollIndicator);
      }, 100);
    })
    .catch(() => {
      textContainer.innerHTML = "Erreur de chargement du texte.";
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
  const scrollIndicator = document.querySelector("#infoModal .scroll-indicator");
  
  container.textContent = "Chargement…";
  scrollIndicator.classList.remove("visible");

  fetch("texts/infos.html")
    .then(r => r.text())
    .then(html => {
      container.innerHTML = html;
      
      // Check scroll after content loads
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
floorUpBtn.addEventListener("click", () => navigateFloor(1));
floorDownBtn.addEventListener("click", () => navigateFloor(-1));

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

// Mouse wheel navigation for floors
let wheelTimeout;
sceneEl.addEventListener("wheel", (e) => {
  if (!isFloorScene()) return;

  clearTimeout(wheelTimeout);
  wheelTimeout = setTimeout(() => {
    if (e.deltaY < 0) {
      // Scrolling up
      navigateFloor(1);
    } else if (e.deltaY > 0) {
      // Scrolling down
      navigateFloor(-1);
    }
  }, 100);
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

sidepanelToggle.addEventListener("click", () => {
  sidepanel.classList.toggle("sidepanel--open");
});
