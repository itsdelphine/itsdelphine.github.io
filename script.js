const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const closeBtn = document.querySelector(".close");

document.querySelectorAll(".hotspot").forEach(hotspot => {
  hotspot.addEventListener("click", () => {
    modalTitle.textContent = hotspot.dataset.title;
    modalText.textContent = hotspot.dataset.text;
    modal.style.display = "block";
  });
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
