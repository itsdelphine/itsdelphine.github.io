const textContainer = document.getElementById("text-container");
const langFlags = document.querySelectorAll(".lang-flag");
let currentLang = "en"; // Default language

// Load text content
fetch("texts/main.html")
  .then(res => res.text())
  .then(html => {
    textContainer.innerHTML = html;
    // Show default language after content loads
    switchLanguage(currentLang);
  })
  .catch(err => {
    console.error("Error loading text content:", err);
  });

// Language switch function
function switchLanguage(lang) {
  // Don't do anything if clicking the same language
  if (lang === currentLang) return;
  
  currentLang = lang;
  
  // Update text blocks
  const textBlocks = document.querySelectorAll("#text-container [data-lang]");
  textBlocks.forEach(block => {
    block.style.display = block.dataset.lang === lang ? "block" : "none";
  });
  
  // Update download buttons
  const buttons = document.querySelectorAll(".download-buttons .btn[data-lang]");
  buttons.forEach(btn => {
    btn.style.display = btn.dataset.lang === lang ? "inline-block" : "none";
  });
  
  // Update flag button styles
  langFlags.forEach(flag => {
    if (flag.dataset.lang === lang) {
      flag.classList.add("active");
    } else {
      flag.classList.remove("active");
    }
  });
}

// Add click listeners to language flags
langFlags.forEach(flag => {
  flag.addEventListener("click", () => {
    switchLanguage(flag.dataset.lang);
  });
});
