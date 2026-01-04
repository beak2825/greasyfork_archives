// ==UserScript==
// @name         Scribd Material Downloader (Safe PDF)
// @namespace    Violentmonkey Scripts
// @version      1.2
// @description  Injects Scribd Material Downloader buttons into Scribd pages to view, download TXT, or download PDF safely.
// @author       Angesom12
// @license      MIT
// @match        *://www.scribd.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550292/Scribd%20Material%20Downloader%20%28Safe%20PDF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550292/Scribd%20Material%20Downloader%20%28Safe%20PDF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load jsPDF dynamically from GitHub
    const jsPDFScript = document.createElement('script');
    jsPDFScript.src = 'https://raw.githubusercontent.com/Angesom12/scribd-downloader-assets/main/js/jspdf.umd.min.js';
    jsPDFScript.onload = () => initDownloader();
    document.head.appendChild(jsPDFScript);

    function initDownloader() {
        const { jsPDF } = window.jspdf;

        // --- Create Button Container ---
        const container = document.createElement('div');
        container.className = 'button-container';
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.right = '40px';
        container.style.transform = 'translateY(-50%)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '18px';
        container.style.zIndex = '100000';

        // --- Button Styles ---
        const style = document.createElement('style');
        style.textContent = `
            .dl-btn {
                padding: 14px 24px;
                font-size: 16px;
                font-weight: bold;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                color: #fff;
                box-shadow: 0 3px 6px rgba(0,0,0,0.25);
                transition: transform 0.2s, opacity 0.2s;
            }
            .dl-btn:hover {
                transform: scale(1.1);
                opacity: 0.9;
            }
            .btn-view   { background-color: #27ae60; }
            .btn-txt    { background-color: #f39c12; }
            .btn-pdf    { background-color: #8e44ad; }
        `;
        document.head.appendChild(style);

        // --- Create Buttons ---
        const btnView = document.createElement('button');
        btnView.className = 'dl-btn btn-view';
        btnView.textContent = 'View Full';

        const btnTXT = document.createElement('button');
        btnTXT.className = 'dl-btn btn-txt';
        btnTXT.textContent = 'Download (TXT)';

        const btnPDF = document.createElement('button');
        btnPDF.className = 'dl-btn btn-pdf';
        btnPDF.textContent = 'Download (PDF)';

        container.appendChild(btnView);
        container.appendChild(btnTXT);
        container.appendChild(btnPDF);
        document.body.appendChild(container);

        // --- Button Functions ---
        function redirectToEmbed() {
            const currentUrl = window.location.href;
            const regex = /https:\/\/www\.scribd\.com\/[^/]+\/([^/]+)\/[^/]+/;
            const match = currentUrl.match(regex);

            if (match) {
                const newUrl = `https://www.scribd.com/embeds/${match[1]}/content`;
                window.location.href = newUrl;
            } else {
                alert("Unable to open embed view. Please refresh the page.");
            }
        }

        function downloadTXT() {
            const contentElements = document.querySelectorAll('.text_layer .a');
            let content = '';
            contentElements.forEach(el => content += el.textContent + '\n');

            if (!content.trim()) {
                alert("No content found. Try opening the Scribd embed view first.");
                return;
            }

            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'scribd_material.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function downloadPDF() {
            const contentElements = document.querySelectorAll('.text_layer .a');
            let content = '';
            contentElements.forEach(el => content += el.textContent + '\n');

            if (!content.trim()) {
                alert("No content found. Try opening the Scribd embed view first.");
                return;
            }

            const doc = new jsPDF();
            const lines = content.split('\n');
            let y = 10;

            lines.forEach(line => {
                if (y > 280) { // page limit
                    doc.addPage();
                    y = 10;
                }
                doc.text(line, 10, y);
                y += 7; // line height
            });

            doc.save('scribd_material.pdf');
        }

        // --- Bind Buttons ---
        btnView.addEventListener('click', redirectToEmbed);
        btnTXT.addEventListener('click', downloadTXT);
        btnPDF.addEventListener('click', downloadPDF);
    }

})();
