(() => {
  const providerLink = (base, prompt, parameter = "q") =>
    `${base}${base.includes("?") ? "&" : "?"}${parameter}=${encodeURIComponent(prompt)}`;

  const buildAiSection = () => {
    const publicProductUrl = new URL("./", window.location.href).href;
    const prompt = [
      `Fasse DataTool von The Repetitive Company anhand der öffentlichen Produktseite ${publicProductUrl} zusammen.`,
      "Erkläre den lokalen Ablauf von der Vorbereitung der Fragebögen über Erkennung und gezielte Kontrolle bis zum Export.",
      "Ordne außerdem PDF Toolkit und Eckensetzer als vorbereitende Anwendungen ein.",
      "Bewerte die Vorteile lokaler Verarbeitung und weise darauf hin, dass keine Fragebögen oder Auswertungsdaten an externe KI-Dienste übertragen werden.",
    ].join(" ");

    const section = document.createElement("section");
    section.className = "ai-short-version";
    section.setAttribute("aria-labelledby", "ai-short-title");
    section.innerHTML = `
      <div class="ai-short-copy">
        <p class="eyebrow">Öffentliche Produktinformationen</p>
        <h2 id="ai-short-title">Lieber die Kurzversion?</h2>
        <p>
          Lassen Sie sich DataTool und den lokalen Auswertungsablauf von Ihrer
          bevorzugten KI zusammenfassen. Es werden ausschließlich öffentlich
          verfügbare Informationen verwendet – keine Fragebögen oder Auswertungsdaten.
        </p>
      </div>
      <div class="ai-provider-list" aria-label="KI-Anbieter für eine Zusammenfassung">
        <a href="${providerLink("https://chatgpt.com/", prompt)}" target="_blank" rel="noopener noreferrer" aria-label="DataTool mit ChatGPT zusammenfassen">
          <span class="ai-mark" aria-hidden="true"><img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/ChatGPT-Logo.svg" alt="" loading="lazy" referrerpolicy="no-referrer" /></span><strong>ChatGPT</strong>
        </a>
        <a href="${providerLink("https://www.google.com/search?udm=50&aep=11", prompt)}" target="_blank" rel="noopener noreferrer" aria-label="DataTool mit Google AI Mode und Gemini zusammenfassen">
          <span class="ai-mark" aria-hidden="true"><img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Google_Gemini_icon_2025.svg" alt="" loading="lazy" referrerpolicy="no-referrer" /></span><strong>Gemini</strong>
        </a>
        <a href="${providerLink("https://claude.ai/new", prompt)}" target="_blank" rel="noopener noreferrer" aria-label="DataTool mit Claude zusammenfassen">
          <span class="ai-mark" aria-hidden="true"><img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Claude_AI_logo.svg" alt="" loading="lazy" referrerpolicy="no-referrer" /></span><strong>Claude</strong>
        </a>
        <a href="${providerLink("https://copilot.microsoft.com/", prompt)}" target="_blank" rel="noopener noreferrer" aria-label="DataTool mit Microsoft Copilot zusammenfassen">
          <span class="ai-mark ai-mark--wide" aria-hidden="true"><img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Microsoft_Copilot_wordmark.svg" alt="" loading="lazy" referrerpolicy="no-referrer" /></span><strong>Copilot</strong>
        </a>
      </div>
    `;
    return section;
  };

  const transformPage = () => {
    const header = document.querySelector(".site-header");
    const intro = document.querySelector(".intro");
    const story = document.querySelector("#scrollStory");
    const suite = document.querySelector("#solutions");
    const privacy = document.querySelector("#datenschutz");
    const pricing = document.querySelector("#preis");
    const outro = document.querySelector(".outro");
    const footer = document.querySelector(".site-footer");

    header.innerHTML = `
      <a class="brand" href="./" aria-label="The Repetitive Company – Startseite">
        <img src="company-logo.png" alt="The Repetitive Company" width="1075" height="334" />
      </a>
      <nav class="header-nav" id="headerNav" aria-label="Seitennavigation">
        <a href="#ablauf">DataTool</a>
        <a href="#solutions">Anwendungen</a>
        <a href="#datenschutz">Datenschutz</a>
        <a href="#preis">Preis</a>
        <a href="#faq">FAQ</a>
        <a class="solutions-link" href="demo/?step=1">Demo ausprobieren</a>
      </nav>
      <button class="menu-toggle" id="menuToggle" type="button" aria-expanded="false" aria-controls="headerNav">
        <span class="menu-toggle-icon" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>Menü</span>
      </button>
    `;

    intro.innerHTML = `
      <p class="eyebrow">Automatische Fragebogenauswertung</p>
      <h1 id="intro-title">Aus Fragebögen werden verlässliche Daten.</h1>
      <p>
        Vom ausgefüllten Fragebogen bis zum geprüften Datensatz – ohne
        mühsames Abtippen und mit voller Kontrolle über jedes Ergebnis.
      </p>
      <div class="hero-actions">
        <a class="cta-button hero-demo" href="demo/?step=1">Demo ausprobieren</a>
        <a class="hero-secondary" href="#solutions">Paket ansehen <span aria-hidden="true">↓</span></a>
      </div>
    `;

    const trust = document.createElement("aside");
    trust.className = "trust-bar";
    trust.setAttribute("aria-label", "Produkteigenschaften");
    trust.innerHTML = `
      <span><i aria-hidden="true">✓</i> Lokal verarbeitet</span>
      <span><i aria-hidden="true">✓</i> Keine Cloud-Übertragung</span>
      <span><i aria-hidden="true">✓</i> Strukturierter Export</span>
    `;
    const workflowIntro = document.createElement("section");
    workflowIntro.className = "workflow-intro";
    workflowIntro.id = "ablauf";
    workflowIntro.innerHTML = `
      <p class="eyebrow">Ein klarer Ablauf</p>
      <h2 class="scroll-reveal" data-scroll-reveal>Vom ausgefüllten Fragebogen zum geprüften Datensatz.</h2>
      <p class="workflow-explainer">
        DataTool erkennt Antworten automatisch und zeigt sie direkt am Original.
        Unklare Ergebnisse prüfen und korrigieren Sie gezielt vor dem Export.
      </p>
    `;
    intro.after(workflowIntro);
    workflowIntro.after(trust);

    document.querySelectorAll(".story-try-link").forEach((link) => {
      link.href = "demo/?step=1";
      link.innerHTML = 'Demo ausprobieren <span aria-hidden="true">→</span>';
    });
    document.querySelector("#exportCopy h2").textContent = "Geprüfte Daten exportieren.";
    document.querySelector("#exportCopy > p:not(.step-label)").textContent =
      "Übergeben Sie die strukturierten Ergebnisse an Tabellen, Statistikprogramme, Dokumentationen oder weitere lokale Arbeitsschritte.";

    privacy.before(buildAiSection());

    privacy.innerHTML = `
      <div class="privacy-intro">
        <p class="eyebrow">Datenschutz von Anfang an</p>
        <h2 class="privacy-marker-heading" id="privacy-title" data-marker-heading>Ihre Daten bleiben dort, wo sie hingehören.</h2>
      </div>
      <div class="privacy-grid">
        <article class="privacy-card">
          <div class="privacy-motion privacy-motion--loop" aria-hidden="true">
            <span class="mini-loop"></span><span class="mini-loop-dot"><i></i></span>
          </div>
          <h3>Vollständig lokal</h3><p>Die Anwendungen verarbeiten Ihre Dokumente und Ergebnisse direkt auf Ihrem Gerät.</p>
        </article>
        <article class="privacy-card">
          <div class="privacy-motion privacy-motion--blocked" aria-hidden="true">
            <span class="mini-track"></span><span class="mini-travel-dot"></span><span class="mini-x"><i></i><i></i></span>
          </div>
          <h3>Keine externen Dienste</h3><p>Ihre Inhalte werden weder automatisch hochgeladen noch für fremde Dienste oder Modelle verwendet.</p>
        </article>
        <article class="privacy-card">
          <div class="privacy-motion privacy-motion--checked" aria-hidden="true">
            <svg class="mini-check" viewBox="0 0 44 44" focusable="false">
              <circle cx="22" cy="22" r="17"></circle>
              <path d="M14 22.5 19.5 28 31 16.5"></path>
            </svg>
          </div>
          <h3>Unter Ihrer Kontrolle</h3><p>Die lokale Verarbeitung unterstützt einen datensparsamen und nachvollziehbaren Arbeitsablauf.</p>
        </article>
      </div>
      <p class="privacy-note">Weitere Einzelheiten finden Sie in unserer <a href="datenschutz.html">Datenschutzinformation für die Anwendungen</a>.</p>
    `;

    const markerHeading = privacy.querySelector("[data-marker-heading]");
    const markerText = markerHeading.textContent.trim();
    markerHeading.setAttribute("aria-label", markerText);

    const buildMarkerLines = () => {
      const words = markerText.split(/\s+/);
      const measurementFragment = document.createDocumentFragment();

      words.forEach((word, index) => {
        const wordElement = document.createElement("span");
        wordElement.className = "privacy-marker-measure-word";
        wordElement.setAttribute("aria-hidden", "true");
        wordElement.textContent = word;
        measurementFragment.append(wordElement);
        if (index < words.length - 1) measurementFragment.append(" ");
      });
      markerHeading.replaceChildren(measurementFragment);

      const lines = [];
      let currentLineTop = null;
      markerHeading.querySelectorAll(".privacy-marker-measure-word").forEach((wordElement) => {
        const wordTop = wordElement.offsetTop;
        if (currentLineTop === null || Math.abs(wordTop - currentLineTop) > 2) {
          currentLineTop = wordTop;
          lines.push([]);
        }
        lines.at(-1).push(wordElement.textContent);
      });

      const lineFragment = document.createDocumentFragment();
      lines.forEach((lineWords) => {
        const line = document.createElement("span");
        line.className = "privacy-marker-line";
        line.setAttribute("aria-hidden", "true");
        line.textContent = lineWords.join(" ");
        lineFragment.append(line);
      });
      markerHeading.replaceChildren(lineFragment);
    };
    buildMarkerLines();

    const reducedMarkerMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let markerScrollFrame = 0;
    const updateMarker = () => {
      markerScrollFrame = 0;
      const markerLines = [...markerHeading.querySelectorAll(".privacy-marker-line")];
      const rect = markerHeading.getBoundingClientRect();
      const startLine = window.innerHeight * 0.82;
      const endLine = window.innerHeight * 0.4;
      const progress = reducedMarkerMotion.matches
        ? 1
        : Math.max(0, Math.min(1, (startLine - rect.top) / (startLine - endLine)));
      const totalCharacters = markerLines.reduce((total, line) => total + line.textContent.length, 0);
      const revealedCharacters = Math.floor(progress * totalCharacters);
      let precedingCharacters = 0;

      markerLines.forEach((line) => {
        const lineCharacters = line.textContent.length;
        const visibleCharacters = Math.max(
          0,
          Math.min(lineCharacters, revealedCharacters - precedingCharacters),
        );
        let lineProgress = visibleCharacters === lineCharacters ? 1 : 0;

        if (visibleCharacters > 0 && visibleCharacters < lineCharacters && line.firstChild) {
          const visibleRange = document.createRange();
          visibleRange.setStart(line.firstChild, 0);
          visibleRange.setEnd(line.firstChild, visibleCharacters);
          lineProgress = visibleRange.getBoundingClientRect().width / line.getBoundingClientRect().width;
        }

        line.style.setProperty("--marker-progress", lineProgress.toFixed(3));
        precedingCharacters += lineCharacters;
      });
    };
    const requestMarkerUpdate = () => {
      if (markerScrollFrame) return;
      markerScrollFrame = requestAnimationFrame(updateMarker);
    };

    let markerResizeFrame = 0;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(markerResizeFrame);
      markerResizeFrame = requestAnimationFrame(() => {
        buildMarkerLines();
        updateMarker();
      });
    });
    window.addEventListener("scroll", requestMarkerUpdate, { passive: true });
    reducedMarkerMotion.addEventListener?.("change", requestMarkerUpdate);
    updateMarker();

    const privacyMotionObserver = new IntersectionObserver(
      ([entry]) => privacy.classList.toggle("motion-visible", entry.isIntersecting),
      { threshold: 0.2 },
    );
    privacyMotionObserver.observe(privacy);

    pricing.innerHTML = `
      <div class="pricing-copy">
        <p class="eyebrow">DataTool Komplettpaket</p>
        <h2 id="pricing-title">Ein Preis für den vollständigen Ablauf.</h2>
        <p>
          Sie erhalten DataTool, PDF Toolkit und Eckensetzer als einsatzbereites
          Komplettpaket – ohne laufende Gebühren pro Fragebogen oder verarbeiteter Seite.
        </p>
        <div class="support-highlight">
          <span class="support-highlight-icon" aria-hidden="true">✓</span>
          <p><small>Inklusive</small><strong>12 Monate Updates &amp; persönlicher Support</strong></p>
        </div>
      </div>
      <article class="pricing-card">
        <p class="pricing-label">Komplettpaket ab</p>
        <p class="pricing-value"><strong>3.600&nbsp;€</strong><span>netto</span></p>
        <p class="pricing-subline">Der konkrete Preis richtet sich nach Einsatzumfang und Anzahl der Arbeitsplätze.</p>
        <h3>Im Paket enthalten</h3>
        <ul class="included-list">
          <li>DataTool zur automatischen Fragebogenauswertung</li>
          <li>PDF Toolkit zum Aufteilen, Entfernen und Zusammenführen</li>
          <li>Eckensetzer zur Vorbereitung Ihrer Dokumente</li>
          <li>Gemeinsame Startoberfläche</li>
          <li>Persönliche Einrichtung und Einführung</li>
          <li>Unterstützung beim ersten Fragebogen</li>
          <li>12 Monate Updates und persönlicher Support</li>
          <li>Lokale Verarbeitung ohne Seiten- oder Übertragungsgebühren</li>
        </ul>
        <p class="pricing-tax">Zuzüglich gesetzlicher Umsatzsteuer.</p>
      </article>
    `;

    outro.innerHTML = `
      <p class="eyebrow">Direkt kennenlernen</p>
      <h2>DataTool passend für Ihren Einsatz kennenlernen.</h2>
      <p>Lernen Sie den Ablauf in der interaktiven Demo kennen – von der erkannten Antwort bis zur gezielten Kontrolle.</p>
      <div class="outro-actions">
        <a class="cta-button" href="demo/?step=1">Demo ausprobieren</a>
        <a class="outro-secondary" href="#solutions">Paket ansehen</a>
      </div>
    `;

    footer.innerHTML = `
      <span>© 2026 The Repetitive Company</span>
      <nav aria-label="Rechtliche Informationen">
        <a href="impressum.html">Impressum</a><a href="datenschutz.html">Datenschutz</a><a href="agb.html">AGB</a>
      </nav>
    `;

    const reveal = document.querySelector("[data-scroll-reveal]");
    const revealText = reveal.textContent.trim();
    reveal.setAttribute("aria-label", revealText);
    reveal.innerHTML = revealText
      .split(/\s+/)
      .map((word) => `<span class="reveal-word" aria-hidden="true">${Array.from(word)
        .map((character) => `<span class="reveal-character">${character}</span>`)
        .join("")}</span>`)
      .join(" ");
    const characters = [...reveal.querySelectorAll(".reveal-character")];

    const updateReveal = () => {
      const rect = reveal.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.82 - rect.top) / (window.innerHeight * 0.34)));
      const activeCount = Math.round(progress * characters.length);
      characters.forEach((character, index) => character.classList.toggle("active", index < activeCount));
    };
    window.addEventListener("scroll", updateReveal, { passive: true });
    window.addEventListener("resize", updateReveal);
    updateReveal();

    const workflowList = document.querySelector(".workflow-summary-list");
    const workflowSteps = workflowList ? [...workflowList.querySelectorAll("li")] : [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (workflowList && workflowSteps.length) {
      const previousButton = document.querySelector(".workflow-arrow--prev");
      const nextButton = document.querySelector(".workflow-arrow--next");
      const positionLabel = document.querySelector(".workflow-position");
      let workflowFrame = 0;
      let currentStep = 0;

      const updateWorkflow = () => {
        workflowFrame = 0;
        const listLeft = workflowList.getBoundingClientRect().left;
        currentStep = workflowSteps.reduce((closestIndex, step, index) => {
          const currentDistance = Math.abs(step.getBoundingClientRect().left - listLeft);
          const closestDistance = Math.abs(workflowSteps[closestIndex].getBoundingClientRect().left - listLeft);
          return currentDistance < closestDistance ? index : closestIndex;
        }, 0);

        workflowSteps.forEach((step, index) => {
          const isCurrent = index === currentStep;
          step.classList.toggle("is-current", isCurrent);
          step.toggleAttribute("aria-current", isCurrent);
        });
        if (positionLabel) positionLabel.textContent = `${String(currentStep + 1).padStart(2, "0")} / ${String(workflowSteps.length).padStart(2, "0")}`;
        if (previousButton) previousButton.disabled = currentStep === 0;
        if (nextButton) nextButton.disabled = currentStep === workflowSteps.length - 1;
      };

      const requestWorkflowUpdate = () => {
        if (!workflowFrame) workflowFrame = requestAnimationFrame(updateWorkflow);
      };

      const scrollToStep = (index) => {
        const target = workflowSteps[Math.max(0, Math.min(workflowSteps.length - 1, index))];
        workflowList.scrollTo({
          left: target.offsetLeft - workflowList.offsetLeft,
          behavior: "auto",
        });
      };

      previousButton?.addEventListener("click", () => scrollToStep(currentStep - 1));
      nextButton?.addEventListener("click", () => scrollToStep(currentStep + 1));
      workflowList.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        if (event.key === "Home") scrollToStep(0);
        else if (event.key === "End") scrollToStep(workflowSteps.length - 1);
        else scrollToStep(currentStep + (event.key === "ArrowRight" ? 1 : -1));
      });
      workflowList.addEventListener("scroll", requestWorkflowUpdate, { passive: true });
      window.addEventListener("resize", requestWorkflowUpdate);
      updateWorkflow();
    }

    const animationScript = document.createElement("script");
    animationScript.src = "site-animation.js?v=20260807";
    animationScript.addEventListener("load", () => {
      if (!window.location.hash) return;
      const targetId = decodeURIComponent(window.location.hash.slice(1));
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const target = document.getElementById(targetId);
        if (!target) return;
        document.documentElement.style.scrollBehavior = "auto";
        target.scrollIntoView({ block: "start" });
        requestAnimationFrame(() => document.documentElement.style.removeProperty("scroll-behavior"));
      }));
    });
    document.body.append(animationScript);
  };

  transformPage();
})();
