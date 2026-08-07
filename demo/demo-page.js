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
  const page = document.querySelector("#demo-page");

  if (requestedStep !== step) {
    window.history.replaceState(null, "", `?step=${step}`);
  }

  document.title = `${current.name} ausprobieren – DataTool Demo`;

  fetch(`./${current.source}`)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((html) => {
      const source = new DOMParser().parseFromString(html, "text/html");
      const header = source.querySelector(".product-header");
      const main = source.querySelector("main");
      const footer = source.querySelector(".product-footer");
      if (!header || !main || !footer) throw new Error("Demo-Inhalt fehlt");

      const demoRoutes = new Map([
        ["datatool.html", 1],
        ["pdf-toolkit.html", 2],
        ["eckensetzer.html", 3],
      ]);
      source.querySelectorAll("a[href]").forEach((link) => {
        const href = link.getAttribute("href");
        const file = href?.split(/[?#]/)[0].replace(/^\.\//, "");
        const targetStep = demoRoutes.get(file);
        if (targetStep) link.setAttribute("href", `./demo/?step=${targetStep}`);
      });

      page.replaceWith(
        document.importNode(header, true),
        document.importNode(main, true),
        document.importNode(footer, true),
      );

      const script = document.createElement("script");
      script.src = "./product-interactions.js?v=20260807-7";
      document.body.append(script);
    })
    .catch(() => {
      page.innerHTML = `
        <section class="demo-error">
          <p>Die Demo konnte gerade nicht geladen werden.</p>
          <a href="./">Zur Startseite →</a>
        </section>
      `;
    });
})();
