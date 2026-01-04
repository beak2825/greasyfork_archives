// ==UserScript==
// @name         I'm gonna reeeeead
// @namespace    ext.columbo.reeeead
// @version      0.2
// @author       columbo
// @license      MIT
// @description  a gentle reminder to read
// @match        *://*/*
// @grant        none
// @icon         https://files.catbox.moe/nyhu6n.png
// @downloadURL https://update.greasyfork.org/scripts/561316/I%27m%20gonna%20reeeeead.user.js
// @updateURL https://update.greasyfork.org/scripts/561316/I%27m%20gonna%20reeeeead.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const IMAGE_URL = 'https://files.catbox.moe/mlxnvy.jpg';
    let overlayVisible = false;

    function showOverlay() {
        if (overlayVisible) return;
        overlayVisible = true;

        const overlay = document.createElement('div');
        overlay.id = 'pdf-download-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            inset: '0',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '2147483647'
        });

        const img = document.createElement('img');
        img.src = IMAGE_URL;
        Object.assign(img.style, {
            maxWidth: '50vw',
            maxHeight: '50vh',
            cursor: 'pointer'
        });

        img.onclick = () => {
            overlay.remove();
            overlayVisible = false;
        };

        overlay.appendChild(img);
        document.documentElement.appendChild(overlay);
    }

    function isPdfUrl(url) {
        return typeof url === 'string' && /\.pdf(\?|#|$)/i.test(url);
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;

        const url = link.href;
        if (!isPdfUrl(url)) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        showOverlay();

        const a = document.createElement('a');
        a.href = url;
        a.download = '';
        a.rel = 'noopener';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }, true);
})();
