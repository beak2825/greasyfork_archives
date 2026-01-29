// ==UserScript==
// @name         BrickLink Kombi-Suchscript
// @namespace    https://bricklink.com/
// @version      1.0.2
// @description  Buttons oben rechts + farbige SVG-Icons + Pick-a-Brick mit allen Alternativnummern
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
    // SVG ICONS (farbig, hoher Kontrast)
    // ------------------------------------------------------------
    const ICON_WOBRICK =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI0IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iOCIgcng9IjIiIGZpbGw9IiM3NzdDODAiIHN0cm9rZT0iIzQ0NCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHJlY3QgeD0iNiIgeT0iNiIgd2lkdGg9IjQiIGhlaWdodD0iMyIgZmlsbD0iI0NDQ0NDQyIgc3Ryb2tlPSIjNDQ0IiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSIxNCIgeT0iNiIgd2lkdGg9IjQiIGhlaWdodD0iMyIgZmlsbD0iI0NDQ0NDQyIgc3Ryb2tlPSIjNDQ0IiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=";

    const ICON_PAB =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjRkZEMzAwIiBzdHJva2U9IiNBODcwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==";

    const ICON_BLUEBRIXX =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjMDA3OEVCIiBzdHJva2U9IiMwMDU2QzgiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==";

    const ICON_ALI =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCA0aDIuNWwyIDloMTRsMi41LTdIM3YtMnoiIGZpbGw9IiNFMzAwMDAiIHN0cm9rZT0iI0IwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iOSIgY3k9IjE4IiByPSIxIiBmaWxsPSIjRkZGIi8+PGNpcmNsZSBjeD0iMTUiIGN5PSIxOCIgcj0iMSIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg==";

    const ICON_REBRICKABLE =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSI2IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0iI2ZmZiIvPjxsaW5lIHgxPSIxNCIgeTE9IjE0IiB4Mj0iMjAiIHkyPSIyMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=";

    function iconImg(src) {
        return `<img src="${src}" style="width:14px;height:14px;vertical-align:middle;margin-right:4px;">`;
    }

    // ------------------------------------------------------------
    // TEIL A: BRICKLINK
    // ------------------------------------------------------------
    if (host.includes("bricklink.com")) {

        const params = new URLSearchParams(window.location.search);
        const partNumber = params.get("P");
        if (!partNumber) return;

        // ------------------------------------------------------------
        // ALTERNATIVNUMMERN AUSLESEN (robust, nur echte IDs)
        // ------------------------------------------------------------
        let altNumbers = [];

        const altElem = [...document.querySelectorAll("td, div, span, p")]
        .find(el => el.textContent.includes("Alternate Item No:"));

        if (altElem) {

            // Rohtext holen
            let text = altElem.textContent;

            // Nur den Teil nach "Alternate Item No:" nehmen
            const idx = text.indexOf("Alternate Item No:");
            if (idx !== -1) {
                text = text.substring(idx + "Alternate Item No:".length).trim();
            }

            // Alles abschneiden, was NICHT zu IDs gehört
            // (Farbnamen, "View Price Guide", sonstige BrickLink-Texte)
            text = text.split("View Price Guide")[0];
            text = text.split("Color")[0];
            text = text.split("\n")[0];

            // Jetzt NUR noch IDs extrahieren:
            // erlaubt: Ziffern, Buchstaben, Bindestrich
            const ids = text.match(/[0-9A-Za-z-]+/g);

            if (ids) {
                // Duplikate entfernen, Kleinschreibung vereinheitlichen
                altNumbers = [...new Set(ids.map(n => n.toLowerCase()))];
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
        // BUTTONS (BrickLink-Stil)
        // ------------------------------------------------------------
        const topRightCell = document.querySelector("table[width='100%'] td[align='right']");
        if (!topRightCell) return;

        function makeButton(icon, text, url, tooltip) {
            const btn = document.createElement("a");
            btn.href = url;
            btn.target = "_blank";
            btn.innerHTML = `${iconImg(icon)}${text}`;

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

        topRightCell.appendChild(makeButton(ICON_WOBRICK, "Wobrick", wobrickUrl));
        topRightCell.appendChild(makeButton(ICON_PAB, "Pick-a-Brick", pickabrickUrl));
        topRightCell.appendChild(makeButton(ICON_BLUEBRIXX, "BlueBrixx", bluebrixxUrl, "Hinweis: Auf BlueBrixx einmal ins Suchfeld klicken."));
        topRightCell.appendChild(makeButton(ICON_ALI, "AliExpress", aliexpressUrl));
        topRightCell.appendChild(makeButton(ICON_REBRICKABLE, "Rebrickable", rebrickableUrl));

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