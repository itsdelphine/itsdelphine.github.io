// Mobile horizontal pan for the image + hotspots.
// Works with the existing markup in index.html:
// - #panViewport
// - #panContainer (this element is translated by JS)
// - #sceneImage (the <img> inside #panContainer)
// - #hotspotLayer (hotspots are children and will move with #panContainer)
(function () {
  // Only enable on small screens to avoid changing desktop behavior
  if (!(window.matchMedia && window.matchMedia('(max-width: 900px)').matches)) return;

  const viewport = document.getElementById('panViewport');
  const container = document.getElementById('panContainer');
  const img = document.getElementById('sceneImage');
  const hotspotLayer = document.getElementById('hotspotLayer');

  if (!viewport || !container || !img || !hotspotLayer) return;

  // ensure touch-action is none so we can prevent scroll on move
  viewport.style.touchAction = 'none';

  let dragging = false;
  let startX = 0;
  let baseTranslate = 0;
  let currentTranslate = 0;
  let minTranslate = 0;
  let maxTranslate = 0;

  function setTranslate(x) {
    container.style.transform = `translate3d(${x}px, 0, 0)`;
  }

  function updateBounds() {
    const vpRect = viewport.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    const imgWidth = Math.round(imgRect.width);

    // Keep the panContainer and hotspotLayer width matched to the displayed image width
    if (imgWidth > 0) {
      container.style.width = imgWidth + 'px';
      hotspotLayer.style.width = imgWidth + 'px';
    }

    if (imgWidth <= vpRect.width) {
      // Center image and disable panning
      minTranslate = maxTranslate = Math.round((vpRect.width - imgWidth) / 2);
    } else {
      maxTranslate = 0;
      minTranslate = vpRect.width - imgWidth; // negative
    }

    currentTranslate = Math.max(minTranslate, Math.min(maxTranslate, currentTranslate));
    setTranslate(currentTranslate);
  }

  function onStart(clientX) {
    dragging = true;
    startX = clientX;
    baseTranslate = currentTranslate;
  }

  function onMove(clientX) {
    if (!dragging) return;
    const dx = clientX - startX;
    currentTranslate = Math.max(minTranslate, Math.min(maxTranslate, baseTranslate + dx));
    setTranslate(currentTranslate);
  }

  function onEnd() {
    dragging = false;
  }

  function touchStartHandler(e) {
    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : (e.clientX || 0);
    onStart(clientX);
  }

  function touchMoveHandler(e) {
    if (dragging) e.preventDefault(); // prevent the page from scrolling
    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : (e.clientX || 0);
    onMove(clientX);
  }

  function touchEndHandler() {
    onEnd();
  }

  // Add listeners (touch and mouse)
  viewport.addEventListener('touchstart', touchStartHandler, { passive: true });
  viewport.addEventListener('touchmove', touchMoveHandler, { passive: false });
  viewport.addEventListener('touchend', touchEndHandler, { passive: true });

  viewport.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    onStart(e.clientX);
  }, { passive: true });

  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    onMove(e.clientX);
  }, { passive: true });

  window.addEventListener('mouseup', function () {
    if (!dragging) return;
    onEnd();
  }, { passive: true });

  // Update on resize and when the image loads
  window.addEventListener('resize', updateBounds);
  if (img.complete) updateBounds();
  else img.addEventListener('load', updateBounds);

  // Expose debug helpers
  window.__mobilePan = {
    updateBounds,
    setTranslate: function (x) { currentTranslate = x; setTranslate(x); }
  };
})();
