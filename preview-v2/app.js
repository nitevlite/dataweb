(() => {
  const story = document.querySelector("#scrollStory");
  const fallingPage = document.querySelector("#fallingPage");
  const overlayItems = [...document.querySelectorAll(".overlay-item")];
  const resultCards = [...document.querySelectorAll("#results article")];
  const results = document.querySelector("#results");
  const exportPanel = document.querySelector("#exportPanel");
  const timelineItems = [...document.querySelectorAll(".timeline li")];
  const phaseTitle = document.querySelector("#phaseTitle");
  const phaseText = document.querySelector("#phaseText");
  const stepLabel = document.querySelector("#stepLabel");
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#siteNav");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const phases = [
    {
      title: "Dokumente vorbereiten und importieren.",
      text: "Übernehmen Sie die ausgefüllten Fragebögen in den vorgesehenen Ablauf.",
    },
    {
      title: "Antworten automatisch erkennen.",
      text: "DataTool liest Markierungen, Mehrfachauswahlen und Kommentare anhand des eingerichteten Templates aus.",
    },
    {
      title: "Auffällige Angaben gezielt prüfen.",
      text: "Uneindeutige Ergebnisse werden am Original hervorgehoben und direkt in der Dokumentansicht kontrolliert.",
    },
    {
      title: "Geprüfte Daten exportieren.",
      text: "Übergeben Sie die strukturierten Ergebnisse an Tabellen, Statistikprogramme oder weitere lokale Arbeitsschritte.",
    },
  ];

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smoothstep = (start, end, value) => {
    const progress = clamp((value - start) / (end - start));
    return progress * progress * (3 - 2 * progress);
  };

  const getProgress = () => {
    const rect = story.getBoundingClientRect();
    const scrollable = Math.max(story.offsetHeight - window.innerHeight, 1);
    return clamp(-rect.top / scrollable);
  };

  let currentPhase = -1;
  let ticking = false;

  const updateCopy = (progress) => {
    const phaseIndex = progress < 0.24 ? 0 : progress < 0.52 ? 1 : progress < 0.79 ? 2 : 3;
    if (phaseIndex === currentPhase) return;
    currentPhase = phaseIndex;
    stepLabel.textContent = `Schritt ${phaseIndex + 1} von 4`;
    phaseTitle.textContent = phases[phaseIndex].title;
    phaseText.textContent = phases[phaseIndex].text;
    timelineItems.forEach((item, index) => item.classList.toggle("active", index <= phaseIndex));
  };

  const render = () => {
    const progress = getProgress();
    const reduced = reduceMotion.matches;
    const pageFall = smoothstep(0.04, reduced ? 0.08 : 0.22, progress);
    const fallingVisible = 1 - smoothstep(0.2, 0.28, progress);

    fallingPage.style.opacity = reduced ? (progress < 0.08 ? "1" : "0") : fallingVisible.toFixed(3);
    fallingPage.style.transform = reduced
      ? "translate(-50%, -50%)"
      : `translate(-50%, -50%) translate3d(${pageFall * 6}%, ${pageFall * 124}%, ${pageFall * 30}px)
         rotateX(${pageFall * 13}deg) rotateZ(${pageFall * 7}deg) scale(${1 - pageFall * 0.055})`;

    overlayItems.forEach((item, index) => {
      const start = 0.25 + index * 0.015;
      const local = smoothstep(start, start + 0.08, progress);
      const distance = 80 * (1 - local);
      const x = item.dataset.enter === "left" ? -distance : item.dataset.enter === "right" ? distance : 0;
      const y = item.dataset.enter === "top" ? -distance : item.dataset.enter === "bottom" ? distance : 0;
      item.style.opacity = local.toFixed(3);
      item.style.transform = `translate(${x}px, ${y}px) scale(${0.9 + local * 0.1})`;
    });

    resultCards.forEach((card, index) => {
      const local = smoothstep(0.53 + index * 0.045, 0.66 + index * 0.045, progress);
      card.style.opacity = local.toFixed(3);
      card.style.transform = `translate3d(${(1 - local) * 56}px, 0, 0) scale(${0.94 + local * 0.06})`;
    });

    const exportIn = smoothstep(0.8, reduced ? 0.83 : 0.94, progress);
    const resultsOut = 1 - smoothstep(0.77, 0.85, progress);
    results.style.opacity = resultsOut.toFixed(3);
    exportPanel.style.opacity = exportIn.toFixed(3);
    exportPanel.style.transform = `translateX(${(1 - exportIn) * 110}%)`;
    updateCopy(progress);
  };

  const requestRender = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      render();
      ticking = false;
    });
  };

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender);
  reduceMotion.addEventListener?.("change", requestRender);

  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    header.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      header.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  render();
})();
