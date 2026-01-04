// ==UserScript==
// @name         PDF.js In-Memory PDF Downloader
// @namespace    https://greasyfork.org/users/Daeron
// @version      1.0
// @description  Adds a floating button to download PDFs rendered by PDF.js viewers directly from memory.
// @author       Daeron
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @icon         https://mozilla.github.io/pdf.js/images/logo.svg
// @license      No license
// @downloadURL https://update.greasyfork.org/scripts/549080/PDFjs%20In-Memory%20PDF%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/549080/PDFjs%20In-Memory%20PDF%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a floating download button for a PDF Blob
    function createDownloadButton(blob) {
        const button = document.createElement('button');
        button.textContent = 'Download PDF';
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            padding: '10px 15px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        });

        button.addEventListener('click', () => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `downloaded_${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            button.remove();
        });

        document.body.appendChild(button);
    }

    // Try to attach a PDF download button if PDF.js is loaded
    function tryAttachPDFButton() {
        const app = window.PDFViewerApplication;
        if (app && app.pdfDocument) {
            app.pdfDocument.getData()
                .then(data => {
                    const blob = new Blob([data], { type: 'application/pdf' });
                    createDownloadButton(blob);
                    console.log('PDF.js: PDF detected and download button created.');
                })
                .catch(e => console.warn('PDF.js: Failed to get PDF data:', e));
            return true;
        }
        return false;
    }

    // Poll every second until PDF.js is loaded and PDF is available
    const interval = setInterval(() => {
        if (tryAttachPDFButton()) {
            clearInterval(interval);
        }
    }, 1000);

})();
