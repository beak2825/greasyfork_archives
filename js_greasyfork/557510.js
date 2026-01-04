// ==UserScript==
// @name          OW Statistik
// @namespace     http://tampermonkey.net/
// @version       2.7
// @description   Script för ow tidsperiod statistik
// @author        Du
// @match         https://nctrading.ongoingsystems.se/NCTrading/index.aspx?templ=*
// @icon          https://docs.ongoingwarehouse.com/Content/Images/ongoing-og-image.png
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/557510/OW%20Statistik.user.js
// @updateURL https://update.greasyfork.org/scripts/557510/OW%20Statistik.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //--------------------------------------------------------------------
    // VALIDATION (OÄNDRAD)
    //--------------------------------------------------------------------
    function isStatisticsPage() {
        return Array.from(document.querySelectorAll(".arrow.last")).some(a =>
            a.textContent.includes("Article statistics / time period") ||
            a.textContent.includes("Artikelstatistik / tidsperiod")
        );
    }
    if (!isStatisticsPage()) return;

    console.log("[TM] OW Statistik v4.6 active. (Hover for Link Fix)");

    //--------------------------------------------------------------------
    // STICKY SCROLL CONTAINER (OÄNDRAD)
    //--------------------------------------------------------------------
    function applySticky() {
        const table = document.querySelector("#CC_StatTable");
        if (!table) return;

        const wrapper = table.parentElement;
        if (!wrapper) return;

        wrapper.style.position = "relative";
        wrapper.style.overflowY = "auto";
        wrapper.style.maxHeight = "calc(100vh - 180px)";

        document.querySelectorAll(".statHeader th").forEach(th => {
            th.style.position = "sticky";
            th.style.top = "0px";
            th.style.zIndex = "9999";
            th.style.background = "white";
            th.style.height = "60px";
        });
    }

    new MutationObserver(() => applySticky())
        .observe(document.body, { childList: true, subtree: true });
    setTimeout(applySticky, 500);

    //--------------------------------------------------------------------
    // GLOBAL POPUP IMG (OÄNDRAD)
    //--------------------------------------------------------------------
    const popupImg = document.createElement("img");
    Object.assign(popupImg.style, {
        position: "absolute",
        maxWidth: "400px",
        maxHeight: "400px",
        border: "1px solid #ccc",
        background: "#fff",
        padding: "4px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        zIndex: 10000,
        visibility: "hidden",
        pointerEvents: "none"
    });
    document.body.appendChild(popupImg);

    function showGlobalPopup(src, posFn) {
        popupImg.src = src;
        popupImg.style.visibility = "hidden";
        popupImg.onload = () => {
            posFn(popupImg);
            popupImg.style.visibility = "visible";
        };
    }
    function hideGlobalPopup() { popupImg.style.visibility = "hidden"; }

    //--------------------------------------------------------------------
    // CSS (UPPDATERAD FÖR HOVRING)
    //--------------------------------------------------------------------
    const css = `
        .tm-stat-row {
            position: relative;
            /* Säkerställer att raden inte expanderar på grund av outline */
            transition: box-shadow 0.15s ease-out;
            border: none !important; /* Tar bort alla eventuella dolda borders */
        }

        /* Använder outline för att skapa en visuell ram utan att påverka layouten */
        .tm-stat-row:hover {
            box-shadow: 0 0 12px #7ec8ff !important;
            z-index: 10;
            outline: 3px solid black; /* Detta ritas utanför elementet och orsakar ej hopp */
            outline-offset: -1px; /* Drar in outline en pixel för att se snyggare ut */
        }

        /* Rensar upp eventuella gamla border-regler */
        .tm-stat-row td {
            border-left: none !important;
            border-right: none !important;
            border-top: none !important;
            border-bottom: none !important;
        }

        /* Tar bort alla pseudo-element från tidigare försök */
        .tm-stat-row::after,
        .tm-stat-row:hover::after {
            content: none !important;
        }

        /* Hover färgjusteringar (OÄNDRAD) */
        .tm-stat-row.tm-normal:hover td { background-color: #dcdcdc !important; }
        .tm-stat-row.tm-sod-yellow:hover td { background-color: #ffe87c !important; }
        .tm-stat-row.tm-sod-red:hover td { background-color: #ff8c8c !important; }
        .tm-sellable-zero:hover td {
            background-color: #1a1a1a !important;
            color: white !important;
        }

        .tm-thumb {
            width: 50px !important;
            height: 50px !important;
            object-fit: contain !important;
            cursor: default !important;
        }

        /* ---------------------------------------------------- */
        /* NY HOVER LOGIK FÖR EAN-CELLEN */
        /* ---------------------------------------------------- */

        /* Standardinnehåll (Original EAN-text) */
        .tm-default-content {
            display: block;
        }

        /* Innehåll som visas vid hovring (Länk + Verktyg) */
        .tm-hover-content {
            display: none; /* Dölj som standard */
        }

        /* Dölj standardinnehållet när man hovrar över raden */
        .tm-stat-row:hover .tm-default-content {
            display: none !important;
        }

        /* Visa hovringsinnehållet när man hovrar över raden */
        .tm-stat-row:hover .tm-hover-content {
            display: block !important;
        }

        /* EAN LINK - styling för den klickbara texten */
        .tm-ean-link {
            cursor: pointer !important;
            text-decoration: underline !important;
            color: #0645AD !important;
            font-weight: bold !important;
            display: inline;
        }
        .tm-stat-row:hover .tm-ean-link {
            /* Lätt skillnad vid hover för feedback */
            color: darkblue !important;
        }


        /* EAN TOOLS - visas nu alltid när tm-hover-content visas */
        .tm-bc-tools {
            display: flex;
            gap: 6px;
            margin-top: 4px !important;
        }

        /* TOAST (OÄNDRAD) */
        .copy-toast {
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            bottom: 30px;
            background: rgba(0,0,0,0.85);
            color: #fff;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: bold;
            z-index: 999999;
            opacity: 0;
            transition: opacity .25s ease-in-out, bottom .25s ease-in-out;
            pointer-events: none;
            text-align: center;
            max-width: 90%;
            word-break: break-word;
            white-space: pre-wrap;
        }
        .copy-toast.show { opacity: 1; }
        .copy-toast small {
            display: inline-block;
            background: #ffeb3b;
            color: #000;
            font-weight: bold;
            padding: 2px 5px;
            border-radius: 3px;
            margin-top: 6px;
            font-size: 12px;
            line-height: 1.4;
        }

        /* GRÅ HEADER FÖR DYNAMISKA KOLUMNER (OÄNDRAD) */
        .tm-dyn-header {
            background-color: #e6e6e6 !important;
        }
    `;
    document.head.appendChild(Object.assign(document.createElement("style"), { textContent: css }));

    //--------------------------------------------------------------------
    // COLUMN INDEXES (OÄNDRAD)
    //--------------------------------------------------------------------
    const ARTNR_COL = 0;
    const IMG_COL = 1;
    const SELLABLE_COLUMN_INDEX = 3;
    const BARCODE_COLUMN_INDEX = 4;
    const SOD_COLUMN_INDEX = 5;
    const SUPPLIER_COLUMN_INDEX = 6;

    const INKPRIS_COL = 9;
    const VIKT_COL = 10;
    const DECIMAL_COLUMNS = [INKPRIS_COL, VIKT_COL];

    const BARCODE_REGEX = /^[0-9]{8,20}$/;

    //--------------------------------------------------------------------
    // CSV (OÄNDRAD)
    //--------------------------------------------------------------------
    const CSV_URL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTHoGlyVWZMucbuUeJ6Bl461tIV_8aaEx6NyyvMuF4MxCT-LD3xJI_o6Nj31QbqI7cu8JBkTx8DHYEs/pub?gid=0&single=true&output=csv";

    const bildTabell = new Map();
    let csvLoaded = false;

    async function loadCSV() {
        if (csvLoaded) return;
        try {
            const res = await fetch(CSV_URL);
            const csv = await res.text();
            csv.split("\n").forEach(row => {
                const p = row.split(",");
                if (p.length < 2) return;
                const art = p[0].replace(/[^\d]/g, "").trim();
                const link = p[1].trim();
                if (/^\d{8,9}$/.test(art)) bildTabell.set(art, link);
            });
            csvLoaded = true;
            // När CSV laddats, trigga en ny scan för att uppdatera alla bilder
            requestAnimationFrame(scan);
        } catch (e) {
            console.error("[TM] Failed to load CSV:", e);
        }
    }
    loadCSV();

    //--------------------------------------------------------------------
    // EAN LINKS (OÄNDRAD)
    //--------------------------------------------------------------------
    function getEANurl(code, sup) {
        sup = sup.toUpperCase();
        if (sup.includes("ISO"))   return "https://maxy.eu/search.php?text=" + code;
        if (sup.includes("VERK"))  return "https://verk.store/search.php?text=" + code;
        if (sup.includes("OOTB"))  return "https://shop.ootb.de/index.php?main_page=advanced_search_result&search_in_description=1&keyword=" + code;
        if (sup.includes("IKONKA"))return "https://www.ikonka.eu/products/search/language:eng?q=" + code;
        return null;
    }

    //--------------------------------------------------------------------
    // TOAST (OÄNDRAD)
    //--------------------------------------------------------------------
    const toast = document.createElement("div");
    toast.className = "copy-toast";
    toast.innerHTML = `Kopierat till urklipp<br><small></small>`;
    document.body.appendChild(toast);

    const toastText = toast.querySelector("small");
    let toastTimer;
    let lastKeyboardHeight = 0;

    const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;

    function updateToastPosition() {
        if (!isTouch || !window.visualViewport) return;
        const vv = window.visualViewport;
        const keyboardHeight = Math.max(0, window.innerHeight - vv.height);
        const keyboardOpen = keyboardHeight > 50;

        if (Math.abs(keyboardHeight - lastKeyboardHeight) > 1) {
            lastKeyboardHeight = keyboardHeight;
            toast.style.bottom = keyboardOpen
                ? `${keyboardHeight + 30}px`
                : "30px";
        }
        if (keyboardOpen) {
            requestAnimationFrame(updateToastPosition);
        }
    }

    function showToast(text) {
        const display =
            text.length > 2000 ? text.slice(0, 2000) + "…" : text;
        toastText.textContent = display;
        toast.classList.add("show");
        updateToastPosition();
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
    }

    //--------------------------------------------------------------------
    // STYLE ROW (MED HOVER LOGIK FÖR EAN)
    //--------------------------------------------------------------------
    function styleRow(row) {

        const c = row.querySelectorAll("td");
        if (c.length < SOD_COLUMN_INDEX) return;

        row.classList.add("tm-stat-row");
        row.addEventListener("mouseleave", () => {
             row.style.zIndex = "";
        });

        // DECIMALS (OÄNDRAD)
        DECIMAL_COLUMNS.forEach(i => {
            const td = c[i];
            if (!td.dataset.decimalFixed) {
                const t = td.textContent.trim();
                if (t.includes(",")) {
                    const n = parseFloat(t.replace(",", "."));
                    if (!isNaN(n)) {
                        td.textContent = n.toString().replace(".", ",");
                        td.dataset.decimalFixed = "1";
                    }
                }
            }
        });

        // SELLABLE ZERO (OÄNDRAD)
        const sellable =
            parseInt(c[SELLABLE_COLUMN_INDEX].textContent.trim(), 10);
        if (!isNaN(sellable) && sellable <= 0) {
            c.forEach(td => {
                td.style.backgroundColor = "#a3a3a3";
                td.style.color = "white";
            });
            row.classList.add("tm-sellable-zero");
        }

        // SOD COLORING (OÄNDRAD)
        let rowClass = "tm-normal";
        const sodTxt = c[SOD_COLUMN_INDEX].textContent.trim();

        if (sodTxt) {
            const sod = new Date(sodTxt);
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const diff = Math.floor((sod - now) / 86400000);

            if (diff >= 0 && diff < 7) {
                c.forEach(td => {
                    td.style.backgroundColor = "#ffb3b3";
                    td.style.color = "black";
                });
                rowClass = "tm-sod-red";
            } else if (diff >= 7 && diff <= 30) {
                c.forEach(td => {
                    td.style.backgroundColor = "#fff6b0";
                    td.style.color = "black";
                });
                rowClass = "tm-sod-yellow";
            }
        }
        row.classList.add(rowClass);

        //----------------------------------------------------------------
        // PRODUCT IMAGE (OÄNDRAD FRÅN V4.5)
        //----------------------------------------------------------------
        const artnr = c[ARTNR_COL].textContent.trim();
        const imgTd = c[IMG_COL];

        // Hitta befintlig bild eller skapa ny
        let img = imgTd.querySelector(".tm-thumb");

        if (!img) {
            imgTd.innerHTML = ""; // Säkerställ att cellen är ren innan vi lägger till elementet

            img = document.createElement("img");
            img.className = "tm-thumb";
            imgTd.appendChild(img);

            // Lägg till händelselyssnare ENDAST första gången elementet skapas
            img.addEventListener("mouseenter", () => {
                showGlobalPopup(img.src, popup => {
                    const r = img.getBoundingClientRect();
                    const vw = window.innerWidth;
                    const pw = popup.offsetWidth;

                    let left = window.scrollX + r.right + 10;
                    if (left + pw > vw)
                        left = window.scrollX + r.left - pw - 10;
                    popup.style.left = left + "px";

                    const center = r.top + r.height / 2 + window.scrollY;
                    const ph = popup.offsetHeight;
                    popup.style.top = center - ph / 2 + "px";
                });
            });
            img.addEventListener("mouseleave", hideGlobalPopup);
        }

        // Uppdatera ALLTID bildkällan, ifall CSV laddades senare.
        const link = bildTabell.get(artnr);
        img.src = link
            ? link
            : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA50lEQVRoge3YwQ2CMBAF0KcoA+YYGr2BN7BJpOkA7iZC5wwkyRjO6uCQ5l/Vmk/2GqOR/mdrIW6DCQE4BMAzRngkQCpo2BEmi0ytiY96DBrsCGi0yviZ96zArYCGC0ypgcnnuSUXwxuEcgGq/7MH0CLEcjZoDHgTkNCAeBikPPAjGXyD1Genz+Xk2N+cI82/s7H43gO+yG9x2/w5gGv8oAAAAASUVORK5CYII=";


        //----------------------------------------------------------------
        // CLICKABLE EAN (NY LOGIK FÖR ATT HANTERA HOVRING)
        //----------------------------------------------------------------
        const eanCell = c[BARCODE_COLUMN_INDEX];

        // 1. Idempotens-kontroll: Om vi redan har behandlat cellen, avbryt.
        if (eanCell.dataset.tmProcessed) {
             return;
        }

        const bcValue = eanCell.textContent.trim();
        const ean = bcValue;
        const sup = c[SUPPLIER_COLUMN_INDEX].textContent
            .trim()
            .toUpperCase();
        const url =
            BARCODE_REGEX.test(ean) ? getEANurl(ean, sup) : null;

        if (BARCODE_REGEX.test(bcValue)) {

            const originalHtml = eanCell.innerHTML;
            eanCell.innerHTML = ""; // Rensa cellen för att bygga om strukturen

            // 1. STANDARD INNEHÅLL (visas när man inte hovrar)
            const defaultSpan = document.createElement("span");
            defaultSpan.className = "tm-default-content";
            defaultSpan.innerHTML = originalHtml;
            eanCell.appendChild(defaultSpan);

            // 2. HOVRINGS-INNEHÅLL (visas när man hovrar)
            const hoverWrapper = document.createElement("div");
            hoverWrapper.className = "tm-hover-content";

            // a. Länken
            const eanLink = document.createElement("span");
            eanLink.textContent = ean;
            eanLink.classList.add("tm-ean-link");

            // b. Verktygsfält (Kopiera/Sello-knappar)
            const tools = createBarcodeTools(bcValue, eanCell);

            if (url) {
                 // Om vi har en URL, gör eanLink klickbar
                eanLink.addEventListener("click", e => {
                    e.stopPropagation(); // VIKTIGT: Förhindrar att Ongoing blockerar
                    window.open(url, "_blank");
                });
                hoverWrapper.appendChild(eanLink);
            } else {
                 // Om ingen URL finns, visa EAN-numret som vanlig text i hovringsrutan
                 const staticEan = document.createElement("span");
                 staticEan.textContent = ean;
                 hoverWrapper.appendChild(staticEan);
            }

            hoverWrapper.appendChild(tools);
            eanCell.appendChild(hoverWrapper);
        }


        // 3. Markera cellen som behandlad.
        if (BARCODE_REGEX.test(bcValue)) {
            eanCell.dataset.tmProcessed = '1';
        }
    }

    //--------------------------------------------------------------------
    // BARCODE TOOLBAR CREATION (OÄNDRAD)
    //--------------------------------------------------------------------
    function createBarcodeTools(bcValue, bcCell) {
        const tools = document.createElement("div");
        tools.className = "tm-bc-tools";

        const copyBtn = document.createElement("img");
        copyBtn.src =
            "https://cdn-icons-png.flaticon.com/128/54/54702.png";
        copyBtn.style.width = "18px";
        copyBtn.style.height = "18px";
        copyBtn.style.cursor = "pointer";
        copyBtn.style.marginTop = "2px";
        copyBtn.title = "Kopiera EAN";

        copyBtn.addEventListener("click", e => {
            e.stopPropagation();
            navigator.clipboard.writeText(bcValue);
            showToast(bcValue);
        });

        const selloBtn = document.createElement("img");
        selloBtn.src =
            "https://cdn.prod.website-files.com/66bf2bad53fd993680441b49/674db916b026e8d5b30a340b_Namnlo%CC%88s%20design%20(12).png";
        selloBtn.style.width = "22px";
        selloBtn.style.height = "22px";
        selloBtn.style.cursor = "pointer";
        selloBtn.title = "Sök i Sello";

        selloBtn.addEventListener("click", e => {
            e.stopPropagation();
            window.open(
                "https://ui.sello.io/inventory/list?sort=id&sort_direction=asc&search_prefix=EAN&search=" +
                    bcValue,
                "_blank"
            );
        });

        tools.appendChild(copyBtn);
        tools.appendChild(selloBtn);

        return tools;
    }

    //--------------------------------------------------------------------
    // MAX ROWS (OÄNDRAD FRÅN V4.4: PROCESSAR ALLA RADER FÖRST)
    //--------------------------------------------------------------------
    function applyMaxRows() {
        const sel = document.getElementById("tmMaxRows");
        if (!sel) return;

        const allRows = Array.from(document.querySelectorAll("tr.statRow"));

        // NYCKELSTEG: Se till att styleRow körs på ALLA rader först
        allRows.forEach(row => {
            styleRow(row);
        });

        // Steg 2: Applicera filter baserat på dropdown-val
        const max = sel.value === "ALL" ? allRows.length : parseInt(sel.value);

        allRows.forEach((row, i) => {
            const show = i < max;
            row.style.display = show ? "" : "none";
        });
    }

    function insertDropdown() {
        if (document.getElementById("tmMaxRows")) return;
        const c = document.getElementById("CC_LCount");
        if (!c) return;

        const sel = document.createElement("select");
        sel.id = "tmMaxRows";
        sel.style.marginLeft = "10px";
        sel.style.width = "70px";
        sel.innerHTML = `
            <option value="50">50</option>
            <option value="100" selected>100</option>
            <option value="200">200</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
            <option value="ALL">Alla</option>
        `;
        sel.addEventListener("change", applyMaxRows);
        c.insertAdjacentElement("afterend", sel);
    }

    //--------------------------------------------------------------------
    // DYNAMISK KOLUMNFLYTT (OÄNDRAD)
    //--------------------------------------------------------------------
    function moveDynamicColumns() {
        const table = document.querySelector("#CC_StatTable");
        if (!table) return;

        const header = table.querySelector("tr.statHeader");
        const rows = table.querySelectorAll("tr.statRow");
        if (!header || !rows.length) return;

        const ths = Array.from(header.children);
        const total = ths.length;

        const SOD_INDEX = 5;
        const FIRST_DYN = 13;

        if (total <= FIRST_DYN) return;

        const dynHeaders = [];
        for (let i = FIRST_DYN; i < total; i++) {
            dynHeaders.push(header.children[i]);
        }

        dynHeaders.forEach(th => {
            th.classList.add("tm-dyn-header");
        });

        for (let i = dynHeaders.length - 1; i >= 0; i--) {
            header.insertBefore(dynHeaders[i], header.children[SOD_INDEX + 1]);
        }

        rows.forEach(row => {
            const cells = row.children;
            const dynCells = [];
            for (let i = FIRST_DYN; i < cells.length; i++) {
                dynCells.push(cells[i]);
            }

            for (let i = dynCells.length - 1; i >= 0; i--) {
                row.insertBefore(dynCells[i], row.children[SOD_INDEX + 1]);
            }
        });
    }

    setTimeout(moveDynamicColumns, 1200);

    //--------------------------------------------------------------------
    // OBSERVER (OÄNDRAD)
    //--------------------------------------------------------------------
    function scan() {
        insertDropdown();
        applyMaxRows();
    }

    let timer = null;
    new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(scan, 200);
    }).observe(document.body, { childList: true, subtree: true });

    setTimeout(scan, 300);

})();