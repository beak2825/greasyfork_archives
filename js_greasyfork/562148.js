// ==UserScript==
// @name         KG - Letterboxd links (details + browse/search)
// @namespace    http://userscripts.org/users/luckyluciano
// @description  Adds Letterboxd links using IMDb IDs on KG details.php and browse.php (keeps different icon sizes).
// @include      *://karagarga.in/*
// @include      *://www.karagarga.in/*
// @match        *://karagarga.in/details.php*
// @match        *://www.karagarga.in/details.php*
// @match        *://karagarga.in/browse.php*
// @match        *://www.karagarga.in/browse.php*
// @version      3.1
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562148/KG%20-%20Letterboxd%20links%20%28details%20%2B%20browsesearch%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562148/KG%20-%20Letterboxd%20links%20%28details%20%2B%20browsesearch%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const LBlogo = "https://iup.crowing.me/ipfs/QmYGrgjDQWZi3zjCGKY1i8bRxi32KRjN3S36nZXNUvxp11/letterboxd-decal-dots-pos-rgb.webp";
  const dereferer = "https://href.li/?"; // optional

  function extractImdbId(href) {
    if (!href) return null;
    const m = href.match(/imdb\.com\/title\/(tt\d+)/i);
    return m ? m[1] : null;
  }

  function makeLetterboxdUrl(imdbId) {
    return `https://letterboxd.com/imdb/${imdbId}`;
  }

  // ---- DETAILS PAGE (big icon) ----
  function xpath(query) {
    return document.evaluate(query, document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  }

  function addDetailsPageLink() {
    const st = xpath("//td[@class='heading']");
    let i = 0;
    while (i < st.snapshotLength && st.snapshotItem(i).innerHTML !== "Internet Link") i++;

    if (i >= st.snapshotLength) return;

    const node = st.snapshotItem(i).nextSibling;
    const imdbA = node && node.firstChild && node.firstChild.href ? node.firstChild : null;
    if (!imdbA) return;

    const imdbId = extractImdbId(imdbA.href);
    if (!imdbId) return;

    // Prevent duplicates
    if (node.querySelector && node.querySelector("a.kg-lb-details")) return;

    const link = document.createElement("a");
    link.href = dereferer + makeLetterboxdUrl(imdbId);
    link.alt = "Film page on letterboxd.com";
    link.title = "Open on Letterboxd";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "kg-lb-details";

    const img = document.createElement("img");
    img.src = LBlogo;
    img.alt = "Letterboxd";
    img.style.marginLeft = "20px";
    img.style.height = "30px"; // BIG icon (kept)
    img.style.width = "auto";
    img.style.verticalAlign = "middle";

    link.appendChild(img);
    node.appendChild(link);
  }

  // ---- BROWSE/SEARCH PAGE (small icon) ----
  function createLbIconLinkSmall(imdbId) {
    const a = document.createElement("a");
    a.href = dereferer + makeLetterboxdUrl(imdbId);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "kg-lb-link";
    a.title = "Open on Letterboxd";

    a.style.display = "inline-flex";
    a.style.alignItems = "center";
    a.style.justifyContent = "center";
    a.style.lineHeight = "0";
    a.style.verticalAlign = "middle";
    a.style.marginLeft = "0px";

    const img = document.createElement("img");
    img.src = LBlogo;
    img.alt = "Letterboxd";
    img.style.display = "block";
    img.style.height = "14px"; // SMALL icon (kept)
    img.style.width = "auto";
    img.style.transform = "translateY(-4px)";

    a.appendChild(img);
    return a;
  }

  function alreadyHasLbLink(nextToEl) {
    const parent = nextToEl.parentElement;
    if (!parent) return false;
    return !!parent.querySelector(":scope > a.kg-lb-link");
  }

  function addNextToAllImdbLinksBrowse() {
    const imdbLinks = Array.from(document.querySelectorAll('a[href*="imdb.com/title/tt"]'));

    imdbLinks.forEach((imdbA) => {
      const imdbId = extractImdbId(imdbA.href);
      if (!imdbId) return;

      // Don’t interfere with the details-page placement logic if any IMDb links exist there
      if (alreadyHasLbLink(imdbA)) return;

      const lb = createLbIconLinkSmall(imdbId);
      imdbA.insertAdjacentElement("afterend", lb);
    });
  }

  // ---- ROUTING ----
  const href = window.location.href;

  if (href.includes("karagarga.in/details.php")) {
    addDetailsPageLink();
  }

  if (href.includes("karagarga.in/browse.php")) {
    addNextToAllImdbLinksBrowse();
    // a light re-run to catch late-loaded bits
    setTimeout(addNextToAllImdbLinksBrowse, 800);
  }
})();
