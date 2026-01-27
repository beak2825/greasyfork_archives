// ==UserScript==
// @name         OW Flytt (scanning)
// @namespace    https://greasyfork.org/en/users/1513603-hobbypryl
// @version      1.1
// @description  Fixar till flytt funktionen i skanning
// @author       HobbyPryl
// @match        https://nctrading.ongoingsystems.se/NCTrading/Scanning/*
// @icon         https://docs.ongoingwarehouse.com/Content/Images/ongoing-og-image.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564136/OW%20Flytt%20%28scanning%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564136/OW%20Flytt%20%28scanning%29.meta.js
// ==/UserScript==

(function() {
    const backBtn = document.getElementById("ButBackProcess");
    if (!backBtn) return;

    const val = (backBtn.value || "").toLowerCase();

    if (val.includes("move") || val.includes("flytta") || val.includes("flytt")) {

        // --- 1. Navigation & Layout ---
        const navRow = document.querySelector('#TrNewNavigation');
        if (navRow) {
            const logoTd = navRow.querySelector('#OngoingLogotype')?.closest('td');
            if (logoTd) logoTd.remove();

            const buttons = navRow.querySelectorAll('input[type="submit"]');
            if (buttons.length) {
                navRow.innerHTML = "";
                buttons.forEach(btn => {
                    const td = document.createElement("td");
                    td.style.width = "33%";
                    td.style.textAlign = "center";
                    td.appendChild(btn);
                    btn.style.height = "32px";
                    btn.style.width = "95%";
                    navRow.appendChild(td);
                });
                navRow.style.height = "36px";
            }
        }

        const trSettings = document.querySelector('#TRSettings')?.closest('tr');
        if (trSettings) trSettings.style.display = 'none';

        // --- 2. Tabell-flipp ---
        (function flipTables() {
            const artCheckbox = document.getElementById("CC_CheckShowArticlesInLocation");
            const artTable = document.getElementById("CC_DGArticlesInLocation");
            const stockCheckbox = document.getElementById("CC_CheckShowGoodsInStock");
            const stockTable = document.getElementById("CC_DGGoodsInStock");

            if (artCheckbox && artTable && stockCheckbox && stockTable) {
                const artBlock = artCheckbox.closest("span.scanningCheckbox");
                const stockBlock = stockCheckbox.closest("span.scanningCheckbox");
                const parent = artBlock.parentNode;
                const stockNext = stockTable.nextSibling;

                if (parent) {
                    parent.insertBefore(stockBlock, artBlock);
                    parent.insertBefore(stockTable, artBlock);
                    if (stockNext) {
                        parent.insertBefore(artBlock, stockNext);
                        parent.insertBefore(artTable, stockNext);
                    }
                }
            }
        })();

        // --- 3. Checkbox-automatik ---
        const ids = ["CC_CheckShowSelectedArticles", "CC_CheckShowArticlesInLocation", "CC_CheckShowGoodsInStock", "CC_CheckEnterNumberOfItems"];
        function ensureChecked() {
            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el && !el.checked) {
                    el.checked = true;
                    if (el.onclick) el.onclick();
                    else el.dispatchEvent(new Event("change", { bubbles: true }));
                }
            });
        }
        ensureChecked();
        setInterval(ensureChecked, 1000);

        // --- 4. Tabell-design & Text-kapning ---
        function fixTableLayouts() {
            const tables = ["CC_DGSelectedArticles", "CC_DGArticlesInLocation", "CC_DGGoodsInStock"];
            tables.forEach(id => {
                const table = document.getElementById(id);
                if (table) {
                    table.style.borderCollapse = "collapse";
                    table.style.tableLayout = "fixed";
                    table.style.width = "100%";
                    table.querySelectorAll("td, th").forEach(cell => {
                        cell.style.border = "1px solid #000";
                    });

                    const headerCells = table.querySelectorAll("tr.GridHead td");
                    headerCells.forEach((cell, index) => {
                        const txt = cell.textContent.trim();
                        if (txt === "Artikel" || txt === "Article") {
                            table.querySelectorAll("tr.GridItem").forEach(row => {
                                const cols = row.querySelectorAll("td");
                                if (cols[index]) {
                                    cols[index].style.maxWidth = "120px";
                                    cols[index].style.overflow = "hidden";
                                    cols[index].style.textOverflow = "ellipsis";
                                    cols[index].style.whiteSpace = "nowrap";
                                }
                            });
                        }
                    });
                }
            });
        }

        // --- 5. Styles ---
        (function injectStyles(){
            const old = document.getElementById("pm-active-row-style");
            if (old) old.remove();
            const style = document.createElement("style");
            style.id = "pm-active-row-style";
            style.textContent = `
                .successMessage { font-size: 1.2em !important; line-height: 1.1 !important; display: block !important; }
                .errorMessage { font-size: 2.3em !important; display: block !important; }
                .infoMessage { font-size: 1.2em !important; line-height: 1.2 !important; padding: 4px 6px !important; display: inline-block !important; }
                #CC_TScanning:focus { background-color: #ccffcc !important; }
                .article-display-name { font-size: 0.75em; color: #444; font-style: italic; margin-top: 2px; display: block; }
                .selected-article-row { background-color: #ffff00 !important; }
                .scanningCheckbox input[type="checkbox"] { display: none !important; }
                .scanningCheckbox { display: block !important; margin: 0 !important; padding: 0 !important; }
                .scanningCheckbox label {
                    display: block !important;
                    margin: 12px 0 0 0 !important;
                    padding: 0 8px !important;
                    height: 20px !important;
                    line-height: 20px !important;
                    font-weight: bold !important;
                    font-style: italic !important;
                    font-size: 1.1em !important;
                    background-color: #e0e0e0 !important;
                    border: 1px solid #000 !important;
                    border-bottom: none !important;
                    box-sizing: border-box !important;
                    width: 100% !important;
                    pointer-events: none !important;
                    cursor: default !important;
                }
                .MainDiv br { display: none !important; }
                .successMessage br, .infoMessage br, .errorMessage br { display: inline !important; }
                .MainDiv table {
                    margin-top: 0 !important;
                    position: relative !important;
                    border-top: 1px solid #000 !important;
                }
                #CC_DGSelectedArticles, #CC_DGArticlesInLocation { top: -6px !important; }
                #CC_DGGoodsInStock { top: -5px !important; }
                .scanningCheckbox:has(#CC_CheckEnterNumberOfItems) { display: none !important; }
                input#CC_TScanning::-webkit-outer-spin-button,
                input#CC_TScanning::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                input#CC_TScanning { -moz-appearance: textfield; }
            `;
            document.head.appendChild(style);
        })();

        // --- 6. Placeholder-logik & Enhanced Scanner Block ---
        function updatePlaceholderAndValidate() {
            const input = document.getElementById("CC_TScanning");
            const label = document.getElementById("CC_LInfo");
            if (!input) return;

            const success = document.querySelector(".successMessage");
            const error = document.querySelector(".errorMessage");
            const info = document.querySelector(".infoMessage");
            const labelText = label ? label.textContent.toLowerCase() : "";
            const errorText = error ? error.textContent.toLowerCase() : "";

            let placeholder = "Skanna lagerplats";

            if (errorText.includes("not possible to move") ||
                errorText.includes("ej möjligt att flytta") ||
                errorText.includes("incorrect article") ||
                errorText.includes("felaktig artikel")) {
                placeholder = "Skanna artikel";
            }
            else if (info && info.textContent.toLowerCase().includes("plockplatsen")) {
                placeholder = "Skanna nya lagerplatsen";
            }
            else if (labelText.includes("antal") || labelText.includes("quantity")) {
                placeholder = "Ange antal";
            }
            else if (success) {
                const txt = success.textContent.toLowerCase();
                if (txt.includes("location:") || txt.includes("plats:")) {
                    placeholder = "Skanna artikel";
                }
                else if (txt.includes("article:") || txt.includes("artikel:")) {
                    placeholder = "Ange antal";
                }
            }

            input.setAttribute("placeholder", placeholder);
            if (label) label.style.display = "none";

            // --- Key Guard ---
            if (!input.dataset.hasGuard) {
                let lastKeyTime = 0;

                input.addEventListener('paste', function(e) {
                    if (this.getAttribute("placeholder") === "Ange antal") {
                        e.preventDefault();
                    }
                });

                input.addEventListener('keydown', function(e) {
                    const currentPlaceholder = this.getAttribute("placeholder");
                    const val = this.value.trim();
                    const now = Date.now();
                    const diff = now - lastKeyTime;
                    lastKeyTime = now;

                    if (e.key === "Enter" && val === "") {
                        e.preventDefault(); e.stopPropagation(); return false;
                    }

                    if (currentPlaceholder === "Ange antal") {
                        // Om det går för snabbt (skanner-fart), rensa fältet helt och blockera
                        if (diff < 50 && e.key !== "Enter") {
                           this.value = "";
                           e.preventDefault();
                           return false;
                        }

                        if (e.key === "Enter") {
                            if (!/^\d+$/.test(val) || val.length > 5) {
                                e.preventDefault(); e.stopPropagation(); return false;
                            }
                        }

                        const allowedKeys = ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight"];
                        if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
                            e.preventDefault();
                        }
                    }
                });

                input.dataset.hasGuard = "true";
            }
        }

        // --- 7. Hjälpfunktioner ---
        function formatInfoMessage() {
            const info = document.querySelector(".infoMessage");
            if (!info || info.getAttribute("data-formatted") === "true") return;
            let originalText = info.textContent.trim();
            let suggestion = "";
            if (originalText.includes("Lagerplatsförslag:")) suggestion = originalText.split("Lagerplatsförslag:")[1].trim();
            else if (originalText.includes("Location suggestion:")) suggestion = originalText.split("Location suggestion:")[1].trim();
            else {
                let m = originalText.match(/([A-Za-z0-9\-]{2,})\s*$/);
                if (m) suggestion = m[1];
            }
            if (suggestion) {
                if (suggestion.startsWith("Kunde") || suggestion.startsWith("Couldn")) suggestion = "<strong>Har ej en plockplats</strong>";
                info.innerHTML = "Platsförslag (Plockplatsen):<br>" + suggestion;
                info.setAttribute("data-formatted", "true");
            }
        }

        function renameHeaders() {
            const tables = ["CC_DGSelectedArticles", "CC_DGArticlesInLocation", "CC_DGGoodsInStock"];
            tables.forEach(id => {
                const table = document.getElementById(id);
                if (!table) return;
                const headRow = table.querySelector("tr.GridHead");
                if (!headRow || headRow.getAttribute("data-headers-fixed") === "true") return;
                const cells = headRow.querySelectorAll("td");
                cells.forEach(cell => {
                    const txt = cell.textContent.trim().toLowerCase();
                    if (txt === "article number" || txt === "artikelnummer") cell.textContent = "Art. nr";
                    else if (txt === "article" || txt === "artikel") cell.textContent = "Artikel";
                    else if (txt === "location" || txt === "lagerplats") cell.textContent = "Plats";
                    else if (txt === "count" || txt === "antal") cell.textContent = "Antal";
                });
                headRow.setAttribute("data-headers-fixed", "true");
            });
        }

        function appendArticleName() {
            const success = document.querySelector(".successMessage");
            if (!success || success.querySelector(".article-display-name")) return;
            const match = success.textContent.match(/(?:Article|Artikel):\s*(\d+)/i);
            if (!match) return;
            const artNr = match[1];
            const stockTable = document.getElementById("CC_DGGoodsInStock");
            if (!stockTable) return;
            const rows = stockTable.querySelectorAll("tr.GridItem");
            let artName = "";
            for (let row of rows) {
                const cells = row.querySelectorAll("td");
                if (cells.length >= 2 && cells[0].textContent.trim() === artNr) {
                    artName = cells[1].textContent.trim();
                    break;
                }
            }
            if (artName) {
                const br = document.createElement("br");
                const span = document.createElement("span");
                span.className = "article-display-name";
                span.textContent = `"${artName}"`;
                success.appendChild(br);
                success.appendChild(span);
            }
        }

        function highlightSelectedArticles() {
            const info = document.querySelector(".infoMessage");
            const selectedTable = document.getElementById("CC_DGSelectedArticles");
            if (!selectedTable) return;
            const rows = selectedTable.querySelectorAll("tr.GridItem");
            if (info && info.textContent.toLowerCase().includes("plockplatsen")) rows.forEach(row => row.classList.add("selected-article-row"));
            else rows.forEach(row => row.classList.remove("selected-article-row"));
        }

        function applyAll() {
            renameHeaders();
            formatInfoMessage();
            updatePlaceholderAndValidate();
            fixTableLayouts();
            appendArticleName();
            highlightSelectedArticles();
        }

        applyAll();
        const obs = new MutationObserver(() => applyAll());
        obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
})();