// ==UserScript==
// @name         Image OCR Helper
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  OCR text from images using Tesseract.js
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559630/Image%20OCR%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/559630/Image%20OCR%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function loadScript(src) {
        return new Promise(resolve => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            document.head.appendChild(s);
        });
    }

    async function init() {
        if (!window.Tesseract) {
            await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
        }

        document.addEventListener('click', async e => {
            if (!(e.target instanceof HTMLImageElement)) return;

            const img = e.target;
            console.log('OCR started...');

            const result = await Tesseract.recognize(
                img.src,
                'eng',
                { logger: m => console.log(m) }
            );

            console.log('OCR RESULT:', result.data.text);
            alert('OCR result:\n\n' + result.data.text);
        }, true);
    }

    init();
})();
