// ==UserScript==
// @name         Full Chaos Translate: Text + Image OCR
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Auto-translate all text nodes + overlay translated image text (manga style) on mobile
// @author       GP
// @match        *://*/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@4.1.3/dist/tesseract.min.js
// @downloadURL https://update.greasyfork.org/scripts/548141/Full%20Chaos%20Translate%3A%20Text%20%2B%20Image%20OCR.user.js
// @updateURL https://update.greasyfork.org/scripts/548141/Full%20Chaos%20Translate%3A%20Text%20%2B%20Image%20OCR.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const targetLang = 'en'; // target translation

    // ---- DOM TEXT TRANSLATION ----
    function walk(node) {
        let textNodes = [];
        if(node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "") {
            textNodes.push(node);
        } else {
            for(let child of node.childNodes) textNodes = textNodes.concat(walk(child));
        }
        return textNodes;
    }

    async function translateText(text) {
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            const res = await fetch(url);
            const data = await res.json();
            return data[0].map(item => item[0]).join('');
        } catch(e) { return text; }
    }

    const nodes = walk(document.body);
    for(let node of nodes) {
        const orig = node.nodeValue;
        translateText(orig).then(translated => node.nodeValue = translated);
    }

    // ---- IMAGE OCR + OVERLAY ----
    const images = document.querySelectorAll('img');

    async function processImage(img) {
        try {
            const result = await Tesseract.recognize(img.src, 'eng', { logger: m => {} });
            const words = result.data.words;

            // create overlay container
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = img.offsetLeft + 'px';
            container.style.top = img.offsetTop + 'px';
            container.style.width = img.width + 'px';
            container.style.height = img.height + 'px';
            container.style.pointerEvents = 'none';
            container.style.zIndex = 9999;
            document.body.appendChild(container);

            for(let w of words) {
                if(w.text.trim().length === 0) continue;
                const translated = await translateText(w.text);

                const overlay = document.createElement('div');
                overlay.innerText = translated;
                overlay.style.position = 'absolute';
                overlay.style.left = `${w.bbox.x0 * img.width / result.data.width}px`;
                overlay.style.top = `${w.bbox.y0 * img.height / result.data.height}px`;
                overlay.style.width = `${(w.bbox.x1 - w.bbox.x0) * img.width / result.data.width}px`;
                overlay.style.height = `${(w.bbox.y1 - w.bbox.y0) * img.height / result.data.height}px`;

                // Styling: manga-ish font, border matches background
                overlay.style.backgroundColor = 'rgba(255,255,255,0.6)'; // semi-transparent white
                overlay.style.border = '1px solid rgba(0,0,0,0.3)';
                overlay.style.fontFamily = '"Nanum Gothic", "Noto Sans KR", sans-serif';
                overlay.style.fontSize = '14px';
                overlay.style.textAlign = 'center';
                overlay.style.lineHeight = '1.2';
                overlay.style.overflow = 'hidden';
                overlay.style.pointerEvents = 'none';
                overlay.style.padding = '1px';
                overlay.style.whiteSpace = 'pre-wrap';

                container.appendChild(overlay);
            }

        } catch(e) { console.error('OCR/Image translation error:', e); }
    }

    for(let img of images) {
        if(img.complete) processImage(img);
        else img.onload = () => processImage(img);
    }

})();