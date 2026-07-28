(() => {
  const handoffStory = document.querySelector("#workflowStory");
  const handoffVisual = document.querySelector("#handoffVisual");
  const handoffSteps = [...document.querySelectorAll("[data-handoff-step]")];
  const datatoolStory = document.querySelector("#datatoolGuide");
  const datatoolSteps = [...document.querySelectorAll("[data-datatool-step]")];
  const datatoolScreens = [...document.querySelectorAll("[data-datatool-screen]")];
  const datatoolTitle = document.querySelector("#datatoolWindowTitle");
  const progressItems = [...document.querySelectorAll(".journey-progress li")];
  const previewTarget = new URLSearchParams(window.location.search).get("preview");

  if (!handoffStory || !handoffVisual || !handoffSteps.length) return;

  let activeHandoff = 0;
  let activeDatatool = 0;
  let scrollQueued = false;

  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

  const updateProgress = (chapter) => {
    const chapterIndex = chapter === "pdf" ? 0 : chapter === "corner" ? 1 : 2;
    progressItems.forEach((item, index) => {
      item.classList.toggle("active", index <= chapterIndex);
    });
  };

  const activateHandoff = (index) => {
    if (!Number.isInteger(index) || index < 0 || index >= handoffSteps.length) return;
    activeHandoff = index;
    const chapter = handoffSteps[index].dataset.chapter || "pdf";
    handoffVisual.dataset.chapter = chapter;
    handoffSteps.forEach((step, stepIndex) => {
      step.classList.toggle("active", stepIndex === index);
    });
    updateProgress(chapter);
  };

  const activateDatatool = (index) => {
    if (!Number.isInteger(index) || index < 0 || index >= datatoolSteps.length) return;
    activeDatatool = index;
    datatoolSteps.forEach((step, stepIndex) => {
      step.classList.toggle("active", stepIndex === index);
    });
    datatoolScreens.forEach((screen, screenIndex) => {
      screen.classList.toggle("is-active", screenIndex === index);
      screen.classList.toggle("is-past", screenIndex < index);
    });
    if (datatoolTitle) {
      datatoolTitle.textContent =
        datatoolSteps[index].dataset.title || "DataTool";
    }
    updateProgress("datatool");
  };

  const stepObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      if (visible.target.hasAttribute("data-handoff-step")) {
        activateHandoff(
          Number.parseInt(visible.target.dataset.handoffStep, 10),
        );
      } else {
        activateDatatool(
          Number.parseInt(visible.target.dataset.datatoolStep, 10),
        );
      }
    },
    {
      rootMargin: "-28% 0px -28% 0px",
      threshold: [0.2, 0.45, 0.7],
    },
  );

  handoffSteps.forEach((step) => stepObserver.observe(step));
  datatoolSteps.forEach((step) => stepObserver.observe(step));

  const updateDrop = () => {
    scrollQueued = false;
    const rect = handoffStory.getBoundingClientRect();
    const viewport = window.innerHeight || 1;
    const progress = clamp((viewport * 0.96 - rect.top) / (viewport * 0.76));
    const dropY = -(viewport * 0.46) * (1 - progress);
    const dropX =
      window.innerWidth <= 900 ? -(window.innerWidth * 0.26) * (1 - progress) : 0;
    const scale = 0.72 + progress * 0.28;
    const opacity = clamp((progress - 0.08) / 0.2);
    handoffVisual.style.setProperty("--drop-y", `${dropY.toFixed(1)}px`);
    handoffVisual.style.setProperty("--drop-x", `${dropX.toFixed(1)}px`);
    handoffVisual.style.setProperty("--drop-scale", scale.toFixed(3));
    handoffVisual.style.setProperty("--drop-opacity", opacity.toFixed(3));

    const handoffRect = handoffStory.getBoundingClientRect();
    const dataRect = datatoolStory?.getBoundingClientRect();
    const handoffVisible =
      handoffRect.top < viewport * 0.88 && handoffRect.bottom > viewport * 0.12;
    const dataVisible =
      dataRect && dataRect.top < viewport * 0.88 && dataRect.bottom > viewport * 0.12;
    document.body.classList.toggle(
      "journey-active",
      Boolean(handoffVisible || dataVisible),
    );
  };

  const queueDropUpdate = () => {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(updateDrop);
  };

  window.addEventListener("scroll", queueDropUpdate, { passive: true });
  window.addEventListener("resize", queueDropUpdate);

  activateHandoff(activeHandoff);
  activateDatatool(activeDatatool);

  const previewMatch = previewTarget?.match(/^(handoff|datatool)-([0-5])$/);
  if (previewMatch) {
    document.body.classList.add(
      "workflow-preview",
      `workflow-preview--${previewMatch[1]}`,
    );
    if (previewMatch[1] === "handoff") {
      activateHandoff(Number.parseInt(previewMatch[2], 10));
      handoffVisual.style.setProperty("--drop-y", "0px");
      handoffVisual.style.setProperty("--drop-x", "0px");
      handoffVisual.style.setProperty("--drop-scale", "1");
      handoffVisual.style.setProperty("--drop-opacity", "1");
    } else {
      activateDatatool(Number.parseInt(previewMatch[2], 10));
    }
    return;
  }

  updateDrop();
})();
