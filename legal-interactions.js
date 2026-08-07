(() => {
  const pageParams = new URLSearchParams(window.location.search);
  if (pageParams.get("from") !== "v3") return;

  document.querySelectorAll('a[href="./index.html"], a[href="index.html"]').forEach((link) => {
    link.href = "./preview-v3/";
  });

  document.querySelectorAll('a[href$="impressum.html"], a[href$="datenschutz.html"], a[href$="agb.html"]').forEach((link) => {
    const url = new URL(link.href);
    url.searchParams.set("from", "v3");
    link.href = `${url.pathname}${url.search}${url.hash}`;
  });
})();
