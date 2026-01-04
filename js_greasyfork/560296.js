// ==UserScript==
// @name         DeepWiki Mermaid Copy Tool (Anti-Conflict)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a copy button to Mermaid diagrams and prevents conflict with image zoom features.
// @author       Gemini
// @match        *://*.deepwiki.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560296/DeepWiki%20Mermaid%20Copy%20Tool%20%28Anti-Conflict%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560296/DeepWiki%20Mermaid%20Copy%20Tool%20%28Anti-Conflict%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        .mermaid-copy-container {
            position: relative !important;
            display: block;
        }
        .svg-copy-btn {
            position: absolute !important;
            top: 15px !important;
            right: 15px !important;
            padding: 5px 10px !important;
            background: #4f46e5 !important; /* Indigo Blue */
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 12px !important;
            font-weight: bold !important;
            z-index: 999999 !important; /* Ensure it stays on top */
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
            pointer-events: auto !important; /* Ensure clickability */
        }
        .svg-copy-btn:hover { background: #4338ca !important; }
    `;
    document.head.appendChild(style);

    async function copySvgAsPng(svgElement, btn) {
        const originalText = btn.innerText;
        try {
            btn.innerText = 'Processing...';

            // 1. Serialize SVG source and handle Unicode/Chinese characters
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBase64 = btoa(unescape(encodeURIComponent(svgData)));
            const dataUrl = 'data:image/svg+xml;base64,' + svgBase64;

            // 2. High-resolution scale factor (3x) for clarity
            const HIGH_RES_SCALE = 3;
            const rect = svgElement.getBoundingClientRect();

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set physical canvas dimensions
            canvas.width = rect.width * HIGH_RES_SCALE;
            canvas.height = rect.height * HIGH_RES_SCALE;

            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                // Fill white background
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Optimization: Scale during drawing
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                try {
                    canvas.toBlob(async (blob) => {
                        if (!blob) throw new Error('Conversion failed');
                        const data = [new ClipboardItem({ [blob.type]: blob })];
                        await navigator.clipboard.write(data);
                        btn.innerText = '✅ Copied (HD)';
                        setTimeout(() => btn.innerText = originalText, 2000);
                    }, 'image/png');
                } catch (canvasError) {
                    console.error('Canvas export failed:', canvasError);
                    btn.innerText = '❌ Security Block';
                    setTimeout(() => btn.innerText = originalText, 2000);
                }
            };

            img.onerror = () => { throw new Error('Image load failed'); };
            img.src = dataUrl;

        } catch (err) {
            console.error('Copy error:', err);
            btn.innerText = '❌ Failed';
            setTimeout(() => btn.innerText = originalText, 2000);
        }
    }

    function initButtons() {
        // Match SVGs with IDs starting with "mermaid-"
        const svgs = document.querySelectorAll('svg[id^="mermaid-"]:not(.processed-svg)');

        svgs.forEach(svg => {
            svg.classList.add('processed-svg');

            // Find the closest container, usually the div with the zoom-click event
            const container = svg.parentElement;
            container.style.position = 'relative';

            const btn = document.createElement('button');
            btn.innerText = 'Copy Diagram';
            btn.className = 'svg-copy-btn';

            // [Crucial] Stop event propagation to prevent triggering parent "zoom" events
            const handleClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                copySvgAsPng(svg, btn);
            };

            btn.addEventListener('click', handleClick, true); // Use capture mode for stability
            btn.addEventListener('mousedown', (e) => e.stopPropagation()); // Prevent effects on mouse down

            container.appendChild(btn);
        });
    }

    const observer = new MutationObserver(() => initButtons());
    observer.observe(document.body, { childList: true, subtree: true });
    initButtons();
})();