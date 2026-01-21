// ==UserScript==
// @name         RoTorrent Torrent Downloader (NO 429)
// @namespace    https://rotorrent.info
// @version      1.2
// @description  Downloads ONLY official torrent files safely
// @match        https://rotorrent.info/torrents*
// @match        https://rotorrent.info/torrents/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563400/RoTorrent%20Torrent%20Downloader%20%28NO%20429%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563400/RoTorrent%20Torrent%20Downloader%20%28NO%20429%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ============ UI ============ */
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: #111;
        color: #fff;
        padding: 10px;
        border-radius: 8px;
        font-size: 13px;
        z-index: 99999;
    `;
    panel.innerHTML = `
        <button id="ds-start">Start</button><br><br>
        Status: <span id="ds-status">PENDING</span><br>
        Found: <span id="ds-found">0</span>
    `;
    document.body.appendChild(panel);

    const statusEl = document.getElementById('ds-status');
    const foundEl  = document.getElementById('ds-found');

    /* ============ CORE ============ */

    function getTorrentLinks() {
        return Array.from(
            document.querySelectorAll(
                'a.torrent-search--list__file[href^="https://rotorrent.info/torrents/download/"]'
            )
        );
    }

    async function downloadTorrents() {
        statusEl.textContent = 'RUNNING';

        const links = getTorrentLinks();
        foundEl.textContent = links.length;

        for (const link of links) {
            link.click();
            await new Promise(r => setTimeout(r, 2000)); // SAFE delay
        }

        statusEl.textContent = 'DONE';
    }

    document.getElementById('ds-start').onclick = downloadTorrents;
})();
