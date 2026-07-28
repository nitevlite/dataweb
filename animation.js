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
  const previewProgress = Number.parseFloat(
    new URLSearchParams(window.location.search).get("preview"),
  );
  const previewActive = Number.isFinite(previewProgress);

  if (previewActive) {
    document.body.classList.add("preview-mode");
  }

  const phases = [
    {
      title: "Fragebögen automatisch auswerten.",
      text: "Ob einzeln oder in großer Zahl: DataTool verarbeitet Ihre ausgefüllten Dokumente in einem einheitlichen Ablauf.",
    },
    {
      title: "Antworten zuverlässig erkennen.",
      text: "Markierungen, Mehrfachauswahlen und Freitext werden direkt auf dem Original sichtbar – nachvollziehbar und kontrollierbar.",
    },
    {
      title: "Jederzeit die volle Kontrolle.",
      text: "Klare Ergebnisse können direkt übernommen werden. Unsichere oder widersprüchliche Angaben können Sie gezielt zur Kontrolle markieren.",
    },
  ];

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smoothstep = (start, end, value) => {
    const progress = clamp((value - start) / (end - start));
    return progress * progress * (3 - 2 * progress);
  };

  const getProgress = () => {
    if (previewActive) return clamp(previewProgress);
    const rect = story.getBoundingClientRect();
    const scrollable = Math.max(story.offsetHeight - window.innerHeight, 1);
    return clamp(-rect.top / scrollable);
  };

  const getPhaseIndex = (progress) => {
    if (progress < 0.25) return 0;
    if (progress < 0.58) return 1;
    if (progress < 0.84) return 2;
    return 3;
  };

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

    timelineItems.forEach((item, index) => {
      item.classList.toggle("active", index <= phaseIndex);
    });
  };

  const updateFrames = (progress) => {
    overlayItems.forEach((item, index) => {
      const start = 0.27 + index * 0.012;
      const local = smoothstep(start, start + 0.075, progress);
      const distance = 95 * (1 - local);
      let x = 0;
      let y = 0;

      if (item.dataset.enter === "left") x = -distance;
      if (item.dataset.enter === "right") x = distance;
      if (item.dataset.enter === "top") y = -distance;
      if (item.dataset.enter === "bottom") y = distance;

      item.style.opacity = local.toFixed(3);
      item.style.transform = `translate(${x}px, ${y}px) scale(${0.9 + local * 0.1})`;
    });
  };

  const updateResults = (progress) => {
    resultCards.forEach((card, index) => {
      const start = 0.59 + index * 0.04;
      const local = smoothstep(start, start + 0.1, progress);
      card.style.opacity = local.toFixed(3);
      card.style.transform = `translate3d(${(1 - local) * 64}px, 0, 0) scale(${
        0.92 + local * 0.08
      })`;
    });
  };

  const render = () => {
    const progress = getProgress();
    const reduced = reduceMotion.matches;
    const pageFall = smoothstep(0.09, reduced ? 0.14 : 0.29, progress);
    const outgoing = smoothstep(0.82, reduced ? 0.85 : 0.9, progress);
    const incoming = smoothstep(reduced ? 0.85 : 0.88, reduced ? 0.88 : 0.97, progress);
    const fallingVisible = 1 - smoothstep(0.25, 0.33, progress);

    fallingPage.style.opacity = reduced
      ? progress < 0.1
        ? "1"
        : "0"
      : fallingVisible.toFixed(3);
    fallingPage.style.transform = reduced
      ? "none"
      : `translate3d(${pageFall * 6}%, ${pageFall * 132}%, ${pageFall * 30}px)
         rotateX(${pageFall * 13}deg)
         rotateZ(${pageFall * 7}deg)
         scale(${1 - pageFall * 0.055})`;

    updateFrames(progress);
    updateResults(progress);

    const outgoingX = -outgoing * 118;
    const incomingX = (1 - incoming) * 118;
    const outgoingOpacity = 1 - smoothstep(0.58, 1, outgoing);
    const incomingOpacity = smoothstep(0, 0.45, incoming);

    storyCopy.style.opacity = outgoingOpacity.toFixed(3);
    storyCopy.style.transform = `translate3d(${outgoingX}%, 0, 0)`;
    sceneContent.style.opacity = outgoingOpacity.toFixed(3);
    sceneContent.style.transform = `translate3d(${outgoingX}%, 0, 0)`;
    exportCopy.style.opacity = incomingOpacity.toFixed(3);
    exportCopy.style.transform = `translate3d(${incomingX}%, 0, 0)`;
    exportPanel.style.opacity = incomingOpacity.toFixed(3);
    exportPanel.style.transform = `translate3d(${incomingX}%, 0, 0)`;
    updateCopy(getPhaseIndex(progress));
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
  document.querySelectorAll("[data-story-progress]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const progress = clamp(Number.parseFloat(link.dataset.storyProgress));
      const storyTop = story.getBoundingClientRect().top + window.scrollY;
      const scrollable = Math.max(story.offsetHeight - window.innerHeight, 1);
      window.scrollTo({
        top: storyTop + scrollable * progress,
        behavior: reduceMotion.matches ? "auto" : "smooth",
      });
    });
  });
  const closeMenu = () => {
    siteHeader.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const open = siteHeader.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  headerNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });
  render();
})();
