// ==UserScript==
// @name         Wikipedia Citation Scraper for Zotero
// @namespace    https://greasyfork.org/users/iamnobodybaba
// @version      1.0
// @description  Extract all citations from Wikipedia articles and copy them as BibTeX format for Zotero import.
// @author       Iamnobodybaba
// @match        https://en.wikipedia.org/wiki/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549363/Wikipedia%20Citation%20Scraper%20for%20Zotero.user.js
// @updateURL https://update.greasyfork.org/scripts/549363/Wikipedia%20Citation%20Scraper%20for%20Zotero.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function scrapeCitations() {
        let citations = document.querySelectorAll("ol.references > li");
        let bibtexEntries = [];

        citations.forEach((cite, i) => {
            let text = cite.innerText.replace(/\n/g, " ").trim();
            let urlElem = cite.querySelector("a.external.text");
            let url = urlElem ? urlElem.href : "";

            let bibtex = `@misc{wiki${i+1},
  title = {${text.slice(0, 80)}...},
  note = {Extracted from Wikipedia},
  howpublished = {\\url{${url}}},
  year = {${new Date().getFullYear()}}
}`;
            bibtexEntries.push(bibtex);
        });

        let output = bibtexEntries.join("\n\n");
        GM_setClipboard(output);
        alert("✅ Citations copied to clipboard in BibTeX format. Paste into Zotero!");
    }

    // Add button to page
    function addButton() {
        let btn = document.createElement("button");
        btn.innerText = "📚 Copy Citations for Zotero";
        btn.style.position = "fixed";
        btn.style.bottom = "20px";
        btn.style.right = "20px";
        btn.style.padding = "10px";
        btn.style.background = "#3366cc";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "6px";
        btn.style.cursor = "pointer";
        btn.style.zIndex = 9999;
        btn.onclick = scrapeCitations;
        document.body.appendChild(btn);
    }

    addButton();
})();
