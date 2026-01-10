// ==UserScript==
// @name         KG - Add Letterboxd links (browse page only)
// @namespace    https://example.com/
// @description  Adds a small Letterboxd icon next to IMDb links on KG browse/search pages.
// @match        *://karagarga.in/browse.php*
// @match        *://www.karagarga.in/browse.php*
// @version      1.2
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562119/KG%20-%20Add%20Letterboxd%20links%20%28browse%20page%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562119/KG%20-%20Add%20Letterboxd%20links%20%28browse%20page%20only%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const LBlogo = "https://a.ltrbxd.com/logos/letterboxd-decal-dots-pos-rgb.svg";
  const dereferer = "https://href.li/?"; // optional

  function extractImdbId(href) {
    if (!href) return null;
    const m = href.match(/imdb\.com\/title\/(tt\d+)/i);
    return m ? m[1] : null;
  }

  function makeLetterboxdUrl(imdbId) {
    return `https://letterboxd.com/imdb/${imdbId}`;
  }

  function createLbIconLink(imdbId) {
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
    img.style.height = "14px";
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

  function addNextToAllImdbLinks() {
    const imdbLinks = Array.from(document.querySelectorAll('a[href*="imdb.com/title/tt"]'));

    imdbLinks.forEach((imdbA) => {
      const imdbId = extractImdbId(imdbA.href);
      if (!imdbId) return;

      if (alreadyHasLbLink(imdbA)) return;

      const lb = createLbIconLink(imdbId);
      imdbA.insertAdjacentElement("afterend", lb);
    });
  }

  addNextToAllImdbLinks();
  setTimeout(addNextToAllImdbLinks, 800);
})();
