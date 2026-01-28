// ==UserScript==
// @name         BrickLink Kombi-Suchscript
// @namespace    https://bricklink.com/
// @version      1.0
// @description  Buttons oben rechts + Icons + Pick-a-Brick mit allen Alternativnummern
// @match        https://www.bricklink.com/v2/catalog/catalogitem.page*
// @match        http://www.bricklink.com/v2/catalog/catalogitem.page*
// @match        https://www.bluebrixx.com/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @author       Glattnoppe
// @downloadURL https://update.greasyfork.org/scripts/564276/BrickLink%20Kombi-Suchscript.user.js
// @updateURL https://update.greasyfork.org/scripts/564276/BrickLink%20Kombi-Suchscript.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const host = location.hostname;
 
    // ------------------------------------------------------------
    // TEIL A: BRICKLINK
    // ------------------------------------------------------------
    if (host.includes("bricklink.com")) {
 
        const params = new URLSearchParams(window.location.search);
        const partNumber = params.get("P");
        if (!partNumber) return;
 
        // ------------------------------------------------------------
        // ALTERNATIVNUMMERN AUSLESEN
        // ------------------------------------------------------------
        let altNumbers = [];
 
        const altElem = [...document.querySelectorAll("td, div, span, p")]
            .find(el => el.textContent.includes("Alternate Item No:"));
 
        if (altElem) {
            const match = altElem.textContent.match(/Alternate Item No:\s*([0-9,\s]+)/i);
            if (match) {
                altNumbers = match[1]
                    .split(",")
                    .map(n => n.trim())
                    .filter(n => n.length > 0);
            }
        }
 
        // Gesamtliste für Pick-a-Brick
        const allIDs = [partNumber, ...altNumbers].join("+");
 
        // ------------------------------------------------------------
        // URL-Generatoren
        // ------------------------------------------------------------
        const wobrickUrl = `https://wobrick.com/?s=${partNumber}&post_type=product`;
        const pickabrickUrl = `https://www.lego.com/de-de/pick-and-build/pick-a-brick?query=${allIDs}`;
        const bluebrixxUrl = `https://www.bluebrixx.com/de/#/dummy?startSearch=${partNumber}`;
        const aliexpressUrl = `https://de.aliexpress.com/w/wholesale-${partNumber}-moc.html`;
        const rebrickableUrl = `https://rebrickable.com/parts/?get_drill_downs=&tag=&q=${partNumber}&part_cat=`;
 
        // ------------------------------------------------------------
        // BUTTONS WIE VERSION 4.5H
        // ------------------------------------------------------------
        const topRightCell = document.querySelector("table[width='100%'] td[align='right']");
        if (!topRightCell) return;
 
        function makeButton(icon, text, url, tooltip) {
            const btn = document.createElement("a");
            btn.href = url;
            btn.target = "_blank";
            btn.innerHTML = `${icon} ${text}`;
 
            btn.className = "blButton blButtonInput blButtonBlue bold";
            btn.style.marginLeft = "6px";
            btn.style.padding = "5px 8px";
            btn.style.textDecoration = "none";
            btn.style.color = "#eee";
            btn.style.fontSize = "12px";
            btn.style.whiteSpace = "nowrap";
 
            if (tooltip) btn.title = tooltip;
            return btn;
        }
 
        topRightCell.appendChild(makeButton("", "Wobrick", wobrickUrl));
        topRightCell.appendChild(makeButton("", "Pick-a-Brick", pickabrickUrl));
        topRightCell.appendChild(makeButton("", "BlueBrixx", bluebrixxUrl, "Hinweis: Auf BlueBrixx einmal ins Suchfeld klicken."));
        topRightCell.appendChild(makeButton("", "AliExpress", aliexpressUrl));
        topRightCell.appendChild(makeButton("", "Rebrickable", rebrickableUrl));
 
        return;
    }
 
    // ------------------------------------------------------------
    // TEIL B: BLUEBRIXX (unverändert)
    // ------------------------------------------------------------
    if (host.includes("bluebrixx.com")) {
 
        const hash = location.hash;
        if (!hash.includes("startSearch=")) return;
 
        const params = new URLSearchParams(hash.split("?")[1]);
        const part = params.get("startSearch");
        if (!part) return;
 
        const idInterval = setInterval(() => {
            const currentHash = location.hash;
 
            const match = currentHash.match(/^#([a-f0-9]{4})\//i);
            if (match) {
                clearInterval(idInterval);
 
                const id = match[1];
                const newHash = `#${id}/brand-categories/m=and&q=${part}`;
                location.hash = newHash;
 
                const searchInterval = setInterval(() => {
                    const input = document.querySelector("input[type='search'], input[placeholder*='Suche'], input[placeholder*='Search']");
                    if (input) {
                        clearInterval(searchInterval);
 
                        input.focus();
                        input.dispatchEvent(new Event("focus", { bubbles: true }));
 
                        input.value = part;
 
                        input.dispatchEvent(new Event("input", { bubbles: true }));
                        input.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", bubbles: true }));
 
                        setTimeout(() => {
                            const suggestion = [...document.querySelectorAll("button, div")]
                                .find(el => el.textContent.trim() === part);
                            if (suggestion) suggestion.click();
                        }, 500);
                    }
                }, 200);
            }
        }, 100);
 
        return;
    }
 
})();