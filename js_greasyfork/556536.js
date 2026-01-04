// ==UserScript==
// @name         RYM descriptor links
// @namespace    https://github.com/zettaexa/userscripts
// @version      2025-11-22
// @description  links RYM descriptors to their respective chart pages
// @author       zetta
// @match        https://rateyourmusic.com/release/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556536/RYM%20descriptor%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/556536/RYM%20descriptor%20links.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const row = document.querySelector("tr.release_descriptors");
    if (!row) return;

    const priSpan = row.querySelector("span.release_pri_descriptors");
    if (priSpan) {
        priSpan.style.display = "none";
    }

    // grab all <meta> elements under that row
    const metas = row.querySelectorAll("meta");

    metas.forEach((meta, i) => {
        const content = meta.getAttribute("content");
        if (!content) return;

        // 1. Remove a leading space if present
        let cleaned = content.replace(/^\s+/, "");

        // 2. Replace *any* remaining spaces with "-"
        cleaned = cleaned.replace(/\s+/g, "-");
        const url = `https://rateyourmusic.com/charts/top/album/all-time/d:${cleaned}`;
        // you can change the "album" part of the url to "album,ep,comp,single,video,unauth,mixtape,musicvideo,djmix,additional" to get all releases

        // create link
        const link = document.createElement("a");
        link.href = url;
        link.textContent = content;
        link.style.fontSize = ".9em";
        link.style.lineHeight = "1.4";
        link.style.textDecoration = "underline var(--mono-b) !important";
        link.style.color = "var(--mono-6)";

        // replace meta with the link
        const wrapper = document.createElement("span");
        wrapper.appendChild(link);
        if (i < metas.length - 1) {
            wrapper.appendChild(document.createTextNode(", "));
            wrapper.style.color = "var(--mono-6)";
        }

        meta.replaceWith(wrapper);
    });
})();