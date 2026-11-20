/* =========================================================================
   AMBIANCE — fond clair qui change doucement de teinte
   Le texte prend la même teinte en foncé. Le contraste est recalculé en
   continu et ne descend jamais sous les seuils fixés ci-dessous.
   ========================================================================= */
(() => {
  const CONFIG = {
    dureeCycle: 240,      // secondes pour faire le tour complet des teintes
    fondSaturation: 70,   // % — intensité de la couleur du fond
    fondLuminosite: 93,   // % — clarté du fond (plus haut = plus clair)
    contrasteTexte: 12,   // rapport minimal texte / fond (7 = norme AAA)
    contrasteSecondaire: 5.5, // rapport minimal du texte gris (4,5 = norme AA)
    contrasteAccent: 5,   // rapport minimal des titres en couleur
  };

  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Conversions et calcul du contraste (formule WCAG) --- */
  function hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
  }
  function luminance([r, g, b]) {
    const c = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function contrast(a, b) {
    const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  }
  const css = ([r, g, b]) => `rgb(${r} ${g} ${b})`;

  /* Fonce une couleur (même teinte) jusqu'à atteindre le contraste voulu */
  function darkEnough(h, s, l, against, min) {
    let rgb = hslToRgb(h, s, l);
    while (contrast(rgb, against) < min && l > 0) { l -= 1; rgb = hslToRgb(h, s, l); }
    return rgb;
  }

  function paint(h) {
    const bg = hslToRgb(h, CONFIG.fondSaturation, CONFIG.fondLuminosite);
    const placeholder = hslToRgb(h, CONFIG.fondSaturation - 15, CONFIG.fondLuminosite - 6);
    const text = darkEnough(h, 45, 20, bg, CONFIG.contrasteTexte);
    const muted = darkEnough(h, 22, 42, placeholder, CONFIG.contrasteSecondaire); // lisible aussi sur les cases « Image à venir »
    const accent = darkEnough((h + 150) % 360, 75, 42, bg, CONFIG.contrasteAccent); // teinte complémentaire
    root.style.setProperty("--bg", css(bg));
    root.style.setProperty("--text", css(text));
    root.style.setProperty("--muted", css(muted));
    root.style.setProperty("--accent", css(accent));
    root.style.setProperty("--placeholder", css(placeholder));
    root.style.setProperty("--bg-rgb", bg.join(" "));
    if (meta) meta.setAttribute("content", css(bg));
  }

  /* Teinte de départ au hasard, puis rotation lente */
  const start = Math.random() * 360;
  const t0 = performance.now();
  const tick = () => paint((start + ((performance.now() - t0) / 1000 / CONFIG.dureeCycle) * 360) % 360);
  tick();
  if (!reduceMotion) setInterval(tick, 250);
})();
