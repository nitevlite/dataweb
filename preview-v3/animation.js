(() => {
  const story = document.querySelector("#scrollStory");
  const storyCopy = document.querySelector("#storyCopy");
  const sceneContent = document.querySelector("#sceneContent");
  const exportCopy = document.querySelector("#exportCopy");
  const exportPanel = document.querySelector("#exportPanel");
  const fallingPage = document.querySelector("#fallingPage");
  const overlayItems = [...document.querySelectorAll(".overlay-item")];
  const resultCards = [...document.querySelectorAll(".result-card")];
  const timelineItems = [...document.querySelectorAll(".timeline li")];
  const phaseTitle = document.querySelector("#phaseTitle");
  const phaseText = document.querySelector("#phaseText");
  const stepLabel = document.querySelector("#stepLabel");
  const siteHeader = document.querySelector(".site-header");
  const menuToggle = document.querySelector("#menuToggle");
  const headerNav = document.querySelector("#headerNav");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const phases = [
    { title: "Dokumente vorbereiten und importieren.", text: "Teilen, sortieren oder bereinigen Sie Ihre PDFs und übernehmen Sie die ausgefüllten Fragebögen in den vorgesehenen Ablauf." },
    { title: "Antworten automatisch erkennen.", text: "DataTool liest markierte Antworten, Mehrfachauswahlen und Kommentare anhand des eingerichteten Templates aus." },
    { title: "Auffällige Angaben gezielt prüfen.", text: "Widersprüchliche oder uneindeutige Ergebnisse werden am Original hervorgehoben. Korrekturen erfolgen direkt in der Dokumentansicht." },
  ];

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smoothstep = (start, end, value) => {
    const progress = clamp((value - start) / (end - start));
    return progress * progress * (3 - 2 * progress);
  };
  const getProgress = () => {
    const rect = story.getBoundingClientRect();
    return clamp(-rect.top / Math.max(story.offsetHeight - window.innerHeight, 1));
  };
  const getPhaseIndex = (progress) => progress < 0.26 ? 0 : progress < 0.55 ? 1 : progress < 0.81 ? 2 : 3;

  let currentPhase = -1;
  let ticking = false;
  const updateCopy = (phaseIndex) => {
    if (currentPhase === phaseIndex) return;
    currentPhase = phaseIndex;
    if (phaseIndex < 3) {
      stepLabel.textContent = `Schritt ${phaseIndex + 1} von 4`;
      phaseTitle.textContent = phases[phaseIndex].title;
      phaseText.textContent = phases[phaseIndex].text;
    }
    timelineItems.forEach((item, index) => item.classList.toggle("active", index <= phaseIndex));
  };

  const render = () => {
    const progress = getProgress();
    const reduced = reduceMotion.matches;
    const pageFall = smoothstep(0.06, reduced ? 0.1 : 0.25, progress);
    const fallingVisible = 1 - smoothstep(0.23, 0.31, progress);
    const exportIn = smoothstep(reduced ? 0.81 : 0.82, reduced ? 0.84 : 0.96, progress);

    fallingPage.style.opacity = reduced ? (progress < 0.1 ? "1" : "0") : fallingVisible.toFixed(3);
    fallingPage.style.transform = reduced ? "none" : `translate3d(${pageFall * 6}%, ${pageFall * 132}%, ${pageFall * 30}px) rotateX(${pageFall * 13}deg) rotateZ(${pageFall * 7}deg) scale(${1 - pageFall * 0.055})`;

    overlayItems.forEach((item, index) => {
      const local = smoothstep(0.28 + index * 0.012, 0.36 + index * 0.012, progress);
      const distance = 88 * (1 - local);
      const x = item.dataset.enter === "left" ? -distance : item.dataset.enter === "right" ? distance : 0;
      const y = item.dataset.enter === "top" ? -distance : item.dataset.enter === "bottom" ? distance : 0;
      item.style.opacity = local.toFixed(3);
      item.style.transform = `translate(${x}px, ${y}px) scale(${0.9 + local * 0.1})`;
    });

    resultCards.forEach((card, index) => {
      const local = smoothstep(0.58 + index * 0.04, 0.69 + index * 0.04, progress);
      card.style.opacity = local.toFixed(3);
      card.style.transform = `translate3d(${(1 - local) * 58}px, 0, 0) scale(${0.92 + local * 0.08})`;
    });

    storyCopy.style.opacity = (1 - exportIn).toFixed(3);
    storyCopy.style.transform = "none";
    sceneContent.style.opacity = (1 - exportIn).toFixed(3);
    sceneContent.style.transform = `scale(${1 - exportIn * 0.025})`;
    exportCopy.style.opacity = exportIn.toFixed(3);
    exportCopy.style.transform = `translate3d(${(1 - exportIn) * 3}rem, 0, 0)`;
    exportPanel.style.opacity = exportIn.toFixed(3);
    exportPanel.style.transform = `translate3d(${(1 - exportIn) * 110}%, 0, 0)`;
    updateCopy(getPhaseIndex(progress));
  };

  const requestRender = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { render(); ticking = false; });
  };
  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender);
  reduceMotion.addEventListener?.("change", requestRender);

  const closeMenu = () => {
    siteHeader.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };
  menuToggle.addEventListener("click", () => {
    const open = siteHeader.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  headerNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  render();
})();
