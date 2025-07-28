// 1) Alle Sektionen und Timeline-Items selektieren
const sections = document.querySelectorAll('section, .timeline-item');

// 2) Für jedes Element die letzte Y-Position merken
const lastYMap = new Map();
sections.forEach(el => {
  lastYMap.set(el, el.getBoundingClientRect().top);
});

// 3) Observer-Optionen
const options = {
  threshold: 0.1,
  rootMargin: "0px 0px -150px 0px"
};

// 4) IntersectionObserver mit Unterscheidung vertikal ↔ horizontal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el         = entry.target;
    const prevY      = lastYMap.get(el);
    const currY      = entry.boundingClientRect.top;
    const isScrollDown = currY < prevY;
    lastYMap.set(el, currY);

    // Prüfen, ob es ein Timeline-Item ist
    const isTimeline = el.classList.contains('timeline-item');
    // Achse und Offsets definieren
    const axis         = isTimeline ? 'X' : 'Y';
    const enterOffset  = isTimeline ? 0   : 10;   // Ziel-Offset beim Fade-In
    const exitOffset   = isTimeline ? -60 : 60;   // Ziel-Offset beim Fade-Out

    if (entry.isIntersecting) {
      // → Element betritt den Viewport
      if (isScrollDown) {
        // ↓ Runterscrollen: Fade-In
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        el.style.opacity    = "1";
        el.style.transform  = `translate${axis}(${enterOffset}px)`;
      } else {
        // ↑ Hochscrollen: sofort sichtbar (kein Fade-In)
        el.style.transition = "none";
        el.style.opacity    = "1";
        el.style.transform  = `translate${axis}(0)`;
      }
    } else {
      // → Element verlässt den Viewport
      if (!isScrollDown) {
        // ↑ Hochscrollen: Fade-Out
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        el.style.opacity    = "0";
        el.style.transform  = `translate${axis}(${exitOffset}px)`;
      } else {
        // ↓ Runterscrollen: bleibt sichtbar (kein Fade-Out)
        el.style.transition = "none";
        el.style.opacity    = "1";
        el.style.transform  = `translate${axis}(0)`;
      }
    }
  });
}, options);

// 5) Anfangszustand setzen und Observer starten
sections.forEach(el => {
  const isTimeline = el.classList.contains('timeline-item');
  const axis         = isTimeline ? 'X' : 'Y';
  const startOffset  = isTimeline ? 30 : 30;  // Start-Offset außerhalb des Viewports

  el.style.opacity   = "0";
  el.style.transform = `translate${axis}(${startOffset}px)`;
  observer.observe(el);
});
