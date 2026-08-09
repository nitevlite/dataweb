(() => {
  const header = document.querySelector(".contact-header");
  const menuToggle = document.querySelector(".contact-menu-toggle");
  const menu = document.querySelector("#contactNav");
  const closeMenu = () => {
    header?.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  };

  menuToggle?.addEventListener("click", () => {
    const willOpen = !header.classList.contains("menu-open");
    header.classList.toggle("menu-open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
  });
  menu?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (header && !header.contains(event.target)) closeMenu();
  });

  const form = document.querySelector("#contactForm");
  const status = document.querySelector("#contactFormStatus");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const value = (name) => String(data.get(name) || "").trim();
    const subject = `[DataTool] ${value("topic")} – ${value("name")}`;
    const body = [
      "Guten Tag,",
      "",
      value("message"),
      "",
      "Kontaktdaten",
      `Name: ${value("name")}`,
      `Unternehmen: ${value("company") || "–"}`,
      `E-Mail: ${value("email")}`,
      `Telefon: ${value("phone") || "–"}`,
      `Thema: ${value("topic")}`,
    ].join("\n");

    if (status) status.textContent = "Ihr E-Mail-Programm wird geöffnet …";
    window.location.href = `mailto:info.mit.ki@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
