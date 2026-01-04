// ==UserScript==
// @name         ExHentai & E-Hentai Torrent 轉換為 Magnet
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  將ExHentai/E-Hentai的torrent連結自動轉換為magnet連結
// @author       shanlan(grok-4-fast-reasoning)
// @match        https://exhentai.org/gallerytorrents.php*
// @match        https://e-hentai.org/gallerytorrents.php*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555453/ExHentai%20%20E-Hentai%20Torrent%20%E8%BD%89%E6%8F%9B%E7%82%BA%20Magnet.user.js
// @updateURL https://update.greasyfork.org/scripts/555453/ExHentai%20%20E-Hentai%20Torrent%20%E8%BD%89%E6%8F%9B%E7%82%BA%20Magnet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function convertToMagnet() {
        const links = document.querySelectorAll('a[href$=".torrent"]');
        links.forEach(link => {
            const href = link.href;
            const match = href.match(/\/([a-f0-9]{40})\.torrent$/);
            if (match) {
                const hash = match[1];
                const magnet = `magnet:?xt=urn:btih:${hash}`;
                link.href = magnet;
                link.removeAttribute('onclick');
                link.textContent = link.textContent.replace(/\.torrent$/, '') + ' (Magnet)';
            }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', convertToMagnet);
    } else {
        convertToMagnet();
    }
})();