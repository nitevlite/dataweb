(() => {
  const contextPages = [
    "datatool.html",
    "pdf-toolkit.html",
    "eckensetzer.html",
    "impressum.html",
    "datenschutz.html",
    "agb.html",
  ];

  const appendV3Context = (href) => {
    const url = new URL(href, document.baseURI);
    if (!contextPages.some((page) => url.pathname.endsWith(`/${page}`))) return href;
    url.searchParams.set("from", "v3");
    return `${url.pathname}${url.search}${url.hash}`;
  };

  const providerLink = (base, prompt, parameter = "q") =>
    `${base}${base.includes("?") ? "&" : "?"}${parameter}=${encodeURIComponent(prompt)}`;

  const buildAiSection = () => {
    const prompt = [
      "Fasse DataTool anhand der öffentlichen Produktseite https://nitevlite.github.io/dataweb/preview-v3/ zusammen.",
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
      <a class="brand" href="preview-v3/" aria-label="The Repetitive Company – V3 Startseite">
        <img src="company-logo.png" alt="The Repetitive Company" width="1075" height="334" />
      </a>
      <nav class="header-nav" id="headerNav" aria-label="Seitennavigation">
        <a href="preview-v3/#ablauf">DataTool</a>
        <a href="preview-v3/#solutions">Anwendungen</a>
        <a href="preview-v3/#datenschutz">Datenschutz</a>
        <a href="preview-v3/#preis">Preis</a>
        <a class="solutions-link" href="datatool.html?demo=1&from=v3">Demo ausprobieren</a>
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
        <a class="cta-button hero-demo" href="datatool.html?demo=1&from=v3">Demo ausprobieren</a>
        <a class="hero-secondary" href="preview-v3/#solutions">Paket ansehen <span aria-hidden="true">↓</span></a>
      </div>
    `;

    const trust = document.createElement("aside");
    trust.className = "v3-trust-bar";
    trust.setAttribute("aria-label", "Produkteigenschaften");
    trust.innerHTML = `
      <span><i aria-hidden="true">✓</i> Lokal verarbeitet</span>
      <span><i aria-hidden="true">✓</i> Keine Cloud-Übertragung</span>
      <span><i aria-hidden="true">✓</i> Strukturierter Export</span>
    `;
    const workflowIntro = document.createElement("section");
    workflowIntro.className = "v3-workflow-intro";
    workflowIntro.id = "ablauf";
    workflowIntro.innerHTML = `
      <p class="eyebrow">Ein klarer Ablauf</p>
      <h2 class="scroll-reveal" data-scroll-reveal>Vom ausgefüllten Fragebogen zum geprüften Datensatz.</h2>
      <p class="workflow-explainer">
        DataTool übernimmt erkannte Antworten in eine übersichtliche Arbeitsansicht. Sie können jederzeit alle Ergebnisse kontrollieren, anpassen oder bestätigen und entscheiden selbst, wo eine genauere Prüfung nötig ist. Jede Antwort bleibt im Kontext des Fragebogens nachvollziehbar – ohne sie erneut manuell übertragen zu müssen.
      </p>
    `;
    intro.after(workflowIntro);
    workflowIntro.after(trust);

    document.querySelectorAll(".story-try-link").forEach((link) => {
      link.href = "datatool.html?demo=1&from=v3";
      link.innerHTML = 'Demo ausprobieren <span aria-hidden="true">→</span>';
    });
    document.querySelector("#exportCopy h2").textContent = "Geprüfte Daten exportieren.";
    document.querySelector("#exportCopy > p:not(.step-label)").textContent =
      "Übergeben Sie die strukturierten Ergebnisse an Tabellen, Statistikprogramme, Dokumentationen oder weitere lokale Arbeitsschritte.";

    suite.before(buildAiSection());

    privacy.innerHTML = `
      <div class="privacy-intro">
        <p class="eyebrow">Datenschutz von Anfang an</p>
        <h2 id="privacy-title">Ihre Daten bleiben dort, wo sie hingehören.</h2>
        <p>
          Erkennung, Kontrolle und Export erfolgen innerhalb Ihrer eigenen
          Arbeitsumgebung. Dokumente, Antworten und Auswertungsdaten werden <u>nicht</u>
          automatisch an uns, externe Cloud-Dienste oder KI-Anbieter übertragen.
        </p>
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
        <a class="cta-button" href="datatool.html?demo=1&from=v3">Demo ausprobieren</a>
        <a class="outro-secondary" href="preview-v3/#solutions">Paket ansehen</a>
      </div>
    `;

    footer.innerHTML = `
      <span>© 2026 The Repetitive Company GesbR</span>
      <nav aria-label="Rechtliche Informationen">
        <a href="impressum.html">Impressum</a><a href="datenschutz.html">Datenschutz</a><a href="agb.html">AGB</a>
      </nav>
    `;

    document.querySelectorAll("a[href]").forEach((link) => {
      link.href = appendV3Context(link.getAttribute("href"));
    });

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

    document.body.classList.remove("v3-loading");
    document.body.classList.add("v3-ready");

    const animationScript = document.createElement("script");
    animationScript.src = "preview-v3/animation.js";
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

  fetch("index.html")
    .then((response) => {
      if (!response.ok) throw new Error(`V1 konnte nicht geladen werden (${response.status})`);
      return response.text();
    })
    .then((html) => {
      const source = new DOMParser().parseFromString(html, "text/html");
      source.querySelectorAll("script").forEach((script) => script.remove());
      document.body.innerHTML = source.body.innerHTML;
      transformPage();
    })
    .catch((error) => {
      document.querySelector(".v3-loader p").textContent = "V3 konnte nicht geladen werden.";
      console.error(error);
    });
})();
