// ==UserScript==
// @name         QR Print fixer (E-METR & TRIS)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       NX
// @icon         https://xodim.e-metrologiya.uz/back/app-assets/images/ico/favicon.ico
// @description  TRIS & E-METR QR-PRINT FIXER
// @match        https://metrologiya.tris.uz/*
// @match        https://xodim.e-metrologiya.uz/comparator/device/*/print
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557064/QR%20Print%20fixer%20%28E-METR%20%20TRIS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557064/QR%20Print%20fixer%20%28E-METR%20%20TRIS%29.meta.js
// ==/UserScript==


/* ============================================================
   1) QR PRINT SCRIPT — strukturasi o‘zgarmagan
   (FAQAT metrologiya.tris.uz domenida ishlaydi)
============================================================ */
if (location.href.includes("metrologiya.tris.uz")) {

(function() {
    'use strict';

    console.log("Tampermonkey QR Print script started...");

    // --- WATCH FOR BUTTON ---
    const observer = new MutationObserver(() => {
        const printBtn = [...document.querySelectorAll("button")]
            .find(btn => btn.textContent.trim() === "Print all QRCodes");

        if (printBtn && !printBtn.dataset.tmHandled) {
            printBtn.dataset.tmHandled = "1";
            console.log("Print all QRCodes tugmasi topildi!");
            printBtn.addEventListener("click", onPrintClick);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // --- PRINT FUNCTION ---
    function onPrintClick() {
        const qrArea = document.querySelector("#qr-print-area");
        if (!qrArea) return alert("QR area topilmadi!");

        const items = [...qrArea.querySelectorAll("svg")];

        // Yangi oyna ochish
        const win = window.open("", "_blank", "width=600,height=800");

        // --- PRINT CSS ---
        const css = `
        <style>
        @media print {
          @page {
            size: 20mm 20mm;
            margin: 0;
          }
        }

        body {
          margin: 0 !important;
          padding: 0 !important;
          font-family: Arial, sans-serif;
        }

        .qr-print-item {
          width: 20mm;
          height: 20mm;
          display: flex;
          margin-left: 0.5mm;
          flex-direction: column;
          align-items: center;
          justify-content: start;
          page-break-after: always;
        }

        .qr-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          margin-top: 0.5mm;
          margin-bottom: 0.5mm;
        }

        .qr-row svg {
          width: 15mm !important;
          height: 15mm !important;
        }

        .qr-vertical-id {
          writing-mode: vertical-rl;
          font-size: 2.0mm !important;
          font-weight: bold !important;
          margin-left: 0.5mm;
          text-align: center;
          line-height: 1;
          max-height: 20mm !important;
          overflow: hidden;
        }

        .qr-print-text {
          font-size: 1.8mm !important;
          font-weight: bold !important;
          text-align: center;
          line-height: 1;
          margin-bottom: 0.1mm;
        }
        </style>
        `;

        // --- HTML YIG‘ISH ---
        let html = css + "<div>";

        items.forEach(svg => {
            const vertical = svg.parentElement.parentElement
                .querySelector('div[style*="writing-mode"]');

            const label1 = svg.parentElement.querySelector('div:nth-of-type(1)');
            const label2 = svg.parentElement.querySelector('div:nth-of-type(2)');

            html += `
            <div class="qr-print-item">
                <div class="qr-row">
                    ${svg.outerHTML}
                    <div class="qr-vertical-id">${vertical?.innerText || ""}</div>
                </div>
                <div class="qr-print-text">${label1?.innerText || ""}</div>
                <div class="qr-print-text">${label2?.innerText || ""}</div>
            </div>
            `;
        });

        html += "</div>";

        win.document.write(html);
        win.document.close();

        win.onafterprint = () => win.close();
        setTimeout(() => win.print(), 200);
    }

})();
}



/* ============================================================
   2) CALENDAR SCRIPT — strukturasi o‘zgarmagan
   (FAQAT xodim.e-metrologiya.uz print sahifasida ishlaydi)
============================================================ */
if (location.href.includes("xodim.e-metrologiya.uz/comparator/device") &&
    location.href.includes("/print")) {

(async function () {
    // 1. Print sahifadan ID olish
    const id = location.pathname.split("/").find(x => /^\d+$/.test(x));
    if (!id) return console.error("ID topilmadi");

    // 2. Asosiy sahifa HTML ni olish
    const url = `https://xodim.e-metrologiya.uz/c/${id}`;
    const html = await fetch(url, { credentials: "include" }).then(r => r.text());

    // 3. HTML ichidan sana qidirish
    const dateRegex = /(\d{2}\.\d{2}\.\d{4})|(\d{4}-\d{2}-\d{2})/;
    const raw = html.match(dateRegex);

    if (!raw) {
        console.warn("Asosiy sahifadan sana topilmadi");
        return;
    }

    let date = raw[0];

    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [y, m, d] = date.split("-");
        date = `${d}.${m}.${y}`;
    }

    console.log("Sana:", date);

    const cont = document.getElementById("monthContainer");
    if (!cont) return console.error("#monthContainer topilmadi");

    const svg = cont.querySelector("svg");
    if (!svg) return console.error("#monthContainer ichida SVG topilmadi");

    cont.style.display = "flex";
    cont.style.flexDirection = "column";
    cont.style.alignItems = "center";
    cont.style.justifyContent = "flex-end";
    cont.style.overflow = "hidden";
    cont.style.boxSizing = "border-box";
    cont.style.padding = "0";
    cont.style.margin = "0";

    svg.style.transformOrigin = "top center";
    svg.style.transform = "scale(0.95)";
    svg.style.display = "block";
    svg.style.margin = "0";
    svg.style.padding = "0";

    let dateDiv = document.getElementById("calendarDate");
    if (dateDiv) dateDiv.remove();

    dateDiv = document.createElement("div");
    dateDiv.id = "calendarDate";
    dateDiv.textContent = date;
    dateDiv.style.fontSize = "3mm";
    dateDiv.style.fontFamily = "Arial";
    dateDiv.style.margin = "0";
    dateDiv.style.padding = "0";
    dateDiv.style.lineHeight = "0";
    dateDiv.style.textAlign = "center";

    cont.appendChild(dateDiv);

})();

}