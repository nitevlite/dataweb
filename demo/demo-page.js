(() => {
  const steps = [
    { source: "datatool.html", name: "DataTool" },
    { source: "pdf-toolkit.html", name: "PDF Toolkit" },
    { source: "eckensetzer.html", name: "Eckensetzer" },
  ];
  const requestedStep = Number.parseInt(
    new URLSearchParams(window.location.search).get("step") ?? "1",
    10,
  );
  const step = Number.isInteger(requestedStep)
    ? Math.min(steps.length, Math.max(1, requestedStep))
    : 1;
  const current = steps[step - 1];
  const content = document.querySelector("#demo-content");

  if (requestedStep !== step) {
    window.history.replaceState(null, "", `?step=${step}`);
  }

  document.title = `${current.name} ausprobieren – DataTool Demo`;
  document.querySelector("[data-demo-step-label]").textContent =
    `Schritt ${step} von ${steps.length}`;
  document.querySelector("[data-demo-position]").textContent =
    `${step} / ${steps.length}`;
  document.querySelectorAll("[data-step-link]").forEach((link) => {
    const active = Number(link.dataset.stepLink) === step;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "step");
  });

  const back = document.querySelector("[data-demo-back]");
  const next = document.querySelector("[data-demo-next]");
  if (step === 1) {
    back.classList.add("is-hidden");
    back.setAttribute("aria-hidden", "true");
  } else {
    back.href = `./demo/?step=${step - 1}`;
    back.textContent = `← ${steps[step - 2].name}`;
  }
  if (step === steps.length) {
    next.href = "./#preis";
    next.textContent = "Paket ansehen →";
  } else {
    next.href = `./demo/?step=${step + 1}`;
    next.textContent = `${steps[step].name} →`;
  }

  fetch(`./${current.source}`)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((html) => {
      const source = new DOMParser().parseFromString(html, "text/html");
      const hero = source.querySelector(".product-hero");
      if (!hero) throw new Error("Demo-Inhalt fehlt");
      hero.querySelector(".product-carousel")?.remove();
      content.replaceChildren(hero);

      const script = document.createElement("script");
      script.src = "./product-interactions.js?v=20260807-5";
      document.body.append(script);
    })
    .catch(() => {
      content.innerHTML = `
        <section class="demo-error">
          <p>Die Demo konnte gerade nicht geladen werden.</p>
          <a href="./${current.source}">${current.name} direkt öffnen →</a>
        </section>
      `;
    });
})();
