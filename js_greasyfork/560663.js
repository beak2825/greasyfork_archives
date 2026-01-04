// ==UserScript==
// @name         Spotify Big Download Button
// @namespace    spotify-big-button-classic
// @version      1.2
// @author       Probably ChatGPT
// @description  Big button to copy link and go to spotidown.app for download
// @match        https://open.spotify.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560663/Spotify%20Big%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/560663/Spotify%20Big%20Download%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- STYLE (same trick as old downloader) ---------- */
    const style = document.createElement('style');
    style.textContent = `
    [role='grid'] {
        margin-left: 50px !important;
    }

    [data-testid='tracklist-row'] {
        position: relative !important;
    }

    .spotidown-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 0;
        background-color: #1fdf64;
        cursor: pointer;
        position: absolute;
        left: -50px;
        top: 50%;
        transform: translateY(-50%);
        background-image: url("data:image/svg+xml;utf8,\
        <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'>\
        <path d='M17 12v5H3v-5H1v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z'/>\
        <path d='M10 15l5-6h-4V1H9v8H5l5 6z'/>\
        </svg>");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 20px;
    }

    .spotidown-btn:hover {
        transform: translateY(-50%) scale(1.1);
    }
    `;
    document.head.appendChild(style);

    /* ---------- BUTTON LOGIC ---------- */
    function addButton(track) {
        if (track.hasSpotidownBtn) return;

        const link = track.querySelector('a[href*="/track/"]');
        if (!link) return;

        const btn = document.createElement('button');
        btn.className = 'spotidown-btn';
        btn.title = 'Copy link & open Spotidown';

        btn.onclick = async (e) => {
            e.stopPropagation();
            e.preventDefault();
            await navigator.clipboard.writeText(link.href);
            window.open('https://spotidown.app/en1', '_blank');
        };

        track.appendChild(btn);
        track.hasSpotidownBtn = true;
    }

    /* ---------- OBSERVE ---------- */
    setInterval(() => {
        document.querySelectorAll('[data-testid="tracklist-row"]').forEach(addButton);
    }, 1000);

})();
