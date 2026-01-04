// ==UserScript==
// @name         URL Slide Navigator (Exact Match + Import Fixed)
// @namespace    custom-nav
// @version      0.6
// @description  Navigate through a deck of URLs with TSV import, exact URL matching
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556473/URL%20Slide%20Navigator%20%28Exact%20Match%20%2B%20Import%20Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556473/URL%20Slide%20Navigator%20%28Exact%20Match%20%2B%20Import%20Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load deck from storage or start empty
    let deck = JSON.parse(localStorage.getItem("urlDeck")) || [];

    // Get current index (exact match, trimmed)
    function getIndex() {
        const currentUrl = window.location.href.trim();
        return deck.findIndex(item => item.url.trim() === currentUrl);
    }

    // Navigate
    function goTo(idx) {
        if (idx >= 0 && idx < deck.length) {
            window.location.href = deck[idx].url;
        }
    }

    // Floating Action Button
    const fab = document.createElement("div");
    fab.textContent = "☰";
    fab.style.position = "fixed";
    fab.style.bottom = "20px";
    fab.style.right = "20px";
    fab.style.width = "50px";
    fab.style.height = "50px";
    fab.style.borderRadius = "50%";
    fab.style.background = "#333";
    fab.style.color = "#fff";
    fab.style.display = "flex";
    fab.style.alignItems = "center";
    fab.style.justifyContent = "center";
    fab.style.fontSize = "24px";
    fab.style.zIndex = "9999";
    fab.style.cursor = "pointer";
    document.body.appendChild(fab);

    // Menu container
    const menu = document.createElement("div");
    menu.style.position = "fixed";
    menu.style.bottom = "80px";
    menu.style.right = "20px";
    menu.style.background = "rgba(0,0,0,0.85)";
    menu.style.color = "#fff";
    menu.style.padding = "10px";
    menu.style.borderRadius = "8px";
    menu.style.display = "none";
    menu.style.zIndex = "9999";
    document.body.appendChild(menu);

    fab.onclick = () => {
        menu.style.display = (menu.style.display === "none") ? "block" : "none";
    };

    // Prev button
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "◀ Prev";
    prevBtn.onclick = () => {
        const idx = getIndex();
        if (idx > 0) goTo(idx - 1);
    };
    menu.appendChild(prevBtn);

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next ▶";
    nextBtn.onclick = () => {
        const idx = getIndex();
        if (idx >= 0 && idx < deck.length - 1) goTo(idx + 1);
    };
    menu.appendChild(nextBtn);

    // Import button
    const importBtn = document.createElement("button");
    importBtn.textContent = "📥 Paste Deck";
    importBtn.onclick = () => {
        const textarea = document.createElement("textarea");
        textarea.style.width = "200px";
        textarea.style.height = "100px";
        textarea.placeholder = "Paste spreadsheet cells here (URL, Title, Note)...";
        menu.appendChild(textarea);

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save Deck";
        saveBtn.onclick = () => {
            deck = parseTSV(textarea.value);
            localStorage.setItem("urlDeck", JSON.stringify(deck));
            alert("Deck updated with " + deck.length + " slides.");
        };
        menu.appendChild(saveBtn);
    };
    menu.appendChild(importBtn);

    // TSV parser
    function parseTSV(text) {
        const rows = text.trim().split("\n");
        return rows.map(row => {
            const cells = row.split("\t");
            return {
                url: cells[0] ? cells[0].trim() : "",
                title: cells[1] ? cells[1].trim() : "",
                note: cells[2] ? cells[2].trim() : ""
            };
        }).filter(item => item.url);
    }
})();