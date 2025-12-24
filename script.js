let data;
let currentScene;
const sceneEl = document.getElementById("scene");
const imgEl = document.getElementById("sceneImage");
const layer = document.getElementById("hotspotLayer");

fetch("hotspots.json")
  .then(r => r.json())
  .then(json => {
    data = json;
    loadScene(data.meta.defaultScene);
  });

function loadScene(key) {
  sceneEl.classList.add("hidden");

  setTimeout(() => {
    currentScene = data.scenes[key];
    imgEl.src = currentScene.image;
    layer.innerHTML = "";

    currentScene.hotspots.forEach(h => createHotspotGroup(h));
    sceneEl.classList.remove("hidden");
  }, 400);
}

function createHotspotGroup(h) {
  const base = document.createElement("div");
  base.className = "hotspot";
  base.style.left = h.position.x + "%";
  base.style.top = h.position.y + "%";

  let expanded = false;
  let children = [];

  base.onmouseenter = () => {
    if (expanded) return;
    expanded = true;

    h.entries.forEach((e, i) => {
      const angle = (i / h.entries.length) * Math.PI * 2;
      const r = 30;

      const child = document.createElement("div");
      child.className = "hotspot";
      child.style.left = `calc(${h.position.x}% + ${Math.cos(angle) * r}px)`;
      child.style.top = `calc(${h.position.y}% + ${Math.sin(angle) * r}px)`;

      child.onmouseenter = () => showTooltip(child, e.label);
      child.onmouseleave = hideTooltip;
      child.onclick = () => openModal(e);

      layer.appendChild(child);
      children.push(child);
    });
  };

  base.onmouseleave = () => {
    expanded = false;
    children.forEach(c => c.remove());
    children = [];
  };

  base.onmouseenter = () => showTooltip(base, h.entries[0].label);
  base.onmouseleave = hideTooltip;

  layer.appendChild(base);
}

/* Tooltip */
let tooltip;
function showTooltip(el, text) {
  tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.textContent = text;
  el.appendChild(tooltip);
}
function hideTooltip() {
  if (tooltip) tooltip.remove();
}

/* Modal */
function openModal(entry) {
  const modal = document.getElementById("modal");
  modal.style.display = "block";

  document.getElementById("modalTitle").textContent = entry.title;
  document.getElementById("modalAuthor").textContent = entry.author;
  document.getElementById("modalPdf").href = entry.pdf;

  fetch(entry.text)
    .then(r => r.text())
    .then(t => document.getElementById("modalText").innerText = t);
}

/* Close modals */
document.querySelectorAll(".close").forEach(c =>
  c.onclick = () => c.closest(".modal").style.display = "none"
);

document.querySelectorAll(".scene-nav button").forEach(b =>
  b.onclick = () => loadScene(b.dataset.scene)
);

document.getElementById("infoBtn").onclick = () =>
  document.getElementById("infoModal").style.display = "block";
