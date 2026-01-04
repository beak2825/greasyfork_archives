// ==UserScript==
// @name         Instant Torrent ID Opener
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Instantly open TorrentBD torrents by numeric ID (plain number, TorrentID=*****) when pressing Enter.
// @author       Sumbul⚡
// @match        https://www.torrentbd.net/*
// @match        https://www.torrentbd.org/*
// @match        https://www.torrentbd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553025/Instant%20Torrent%20ID%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/553025/Instant%20Torrent%20ID%20Opener.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.addEventListener('load', () => {
        const searchBox = document.querySelector('input[name="kuddus_searchkey"]');

        if (!searchBox) {
            console.warn('TorrentBD ID Opener: Search box not found.');
            return;
        }
        function extractId(value) {
            if (/^\d+$/.test(value)) return value;
            const match = value.match(/(?:id|torrentid)=(\d+)/i);
            if (match) return match[1];

            return null;
        }
        function openTorrentById(id) {
            const url = `${location.origin}/torrents-details.php?id=${encodeURIComponent(id)}`;
            window.location.href = url;
        }
        searchBox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const value = searchBox.value.trim();
                const id = extractId(value);

                if (id) {
                    e.preventDefault();
                    openTorrentById(id);
                }
            }
        });
        searchBox.setAttribute('placeholder', 'Search Torrents or Enter ID / TorrentID');
    });
})();