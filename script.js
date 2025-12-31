const textContainer = document.getElementById("text-container");
const langButtons = document.querySelectorAll(".lang-switch img");

// Load text content
fetch("texts/main.html")
  .then(res => res.text())
  .then(html => {
    textContainer.innerHTML = html;
  });

// Language switch
langButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang;
    const blocks = textContainer.querySelectorAll("[data-lang]");

    blocks.forEach(block => {
      block.style.display =
        block.dataset.lang === lang ? "block" : "none";
    });
  });
});
