// ==UserScript==
// @name         Image OCR + Auto Translate (Proof of Concept)
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  OCR images on page and auto-translate text to English
// @author       GP
// @match        *://*/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@4.1.3/dist/tesseract.min.js
// @downloadURL https://update.greasyfork.org/scripts/548140/Image%20OCR%20%2B%20Auto%20Translate%20%28Proof%20of%20Concept%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548140/Image%20OCR%20%2B%20Auto%20Translate%20%28Proof%20of%20Concept%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const targetLang = 'en'; // Change target language if needed

    // Helper: translate text via Google Translate API
    async function translateText(text) {
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            const res = await fetch(url);
            const data = await res.json();
            return data[0].map(item => item[0]).join('');
        } catch (e) {
            console.error('Translation error:', e);
            return text;
        }
    }

    // Process one image
    async function processImage(img) {
        try {
            const result = await Tesseract.recognize(img.src, 'eng'); // OCR the image
            const detectedText = result.data.text.trim();
            if (detectedText.length > 0) {
                const translated = await translateText(detectedText);

                // Create overlay
                const overlay = document.createElement('div');
                overlay.innerText = translated;
                overlay.style.position = 'absolute';
                overlay.style.left = img.offsetLeft + 'px';
                overlay.style.top = img.offsetTop + 'px';
                overlay.style.width = img.width + 'px';
                overlay.style.height = img.height + 'px';
                overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
                overlay.style.color = 'white';
                overlay.style.fontSize = '16px';
                overlay.style.padding = '2px';
                overlay.style.pointerEvents = 'none';
                overlay.style.whiteSpace = 'pre-wrap';
                overlay.style.textAlign = 'center';
                overlay.style.zIndex = 9999;

                document.body.appendChild(overlay);
            }
        } catch (e) {
            console.error('OCR error:', e);
        }
    }

    // Process all images on page
    const images = document.querySelectorAll('img');
    for (let img of images) {
        if (img.complete) await processImage(img);
        else img.onload = () => processImage(img);
    }

})();