// ==UserScript==
// @name         Saavn Downloader (Clean Filenames)
// @namespace    http://tampermonkey.net/
// @version      17.0
// @description  Downloads the active song. Naming format: "Song - Artist.mp4" (Sanitized).
// @author       StrangeAJ
// @match        https://*.jiosaavn.com/*
// @match        https://*.saavn.com/*
// @grant        GM_download
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561072/Saavn%20Downloader%20%28Clean%20Filenames%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561072/Saavn%20Downloader%20%28Clean%20Filenames%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. METADATA SCRAPER & SANITIZER ---
    function getTrackFilename() {
        try {
            // Target the text inside the Player Bar (Bottom Left)
            const songEl = document.querySelector('.c-player__current h2');
            const artistEl = document.querySelector('.c-player__current p');

            let songName = "Unknown Song";
            let artistName = "Unknown Artist";

            if (songEl) songName = songEl.innerText.trim();
            if (artistEl) artistName = artistEl.innerText.trim();

            // Create format: "Song - Artist"
            let fullName = `${songName} - ${artistName}`;

            // SANITIZATION:
            // Replace invalid filesystem characters with an empty string or underscore.
            // Invalid chars: / \ : * ? " < > |
            // We also remove null bytes or control characters just in case.
            fullName = fullName.replace(/[\\/:*?"<>|]/g, "_");

            return fullName + ".mp4";

        } catch (e) {
            console.error("Error naming file:", e);
            return `saavn_track_${Date.now()}.mp4`; // Fallback
        }
    }

    // --- 2. FINDER LOGIC ---
    function getActiveAudioUrl() {
        const audios = document.getElementsByTagName('audio');
        for (let i = 0; i < audios.length; i++) {
            const audio = audios[i];

            // Check parent <audio> src
            if (audio.src && audio.src.length > 5) return audio.src;

            // Check child <source> src (Most common on Saavn)
            const sources = audio.getElementsByTagName('source');
            for (let j = 0; j < sources.length; j++) {
                if (sources[j].src && sources[j].src.length > 5) return sources[j].src;
            }
        }
        return null;
    }

    // --- 3. DOWNLOADER ---
    function triggerDownload() {
        const url = getActiveAudioUrl();
        const icon = document.getElementById('saavn-dl-icon');

        if (!url) {
            alert("No audio link found. Please ensure the song is playing.");
            if(icon) icon.style.stroke = 'red';
            setTimeout(() => { if(icon) icon.style.stroke = '#2bc5b4'; }, 1000);
            return;
        }

        const fileName = getTrackFilename();
        console.log(`[Saavn DL] Saving as: ${fileName}`);

        if(icon) icon.style.stroke = 'orange'; // Visual feedback

        GM_download({
            url: url,
            name: fileName, // Using the sanitized name
            saveAs: false,
            headers: {
                "Referer": "https://www.jiosaavn.com/",
                "Origin": "https://www.jiosaavn.com",
            },
            onload: () => {
                console.log("Download Complete");
                if(icon) icon.style.stroke = '#00FF00'; // Success Green
                setTimeout(() => { if(icon) icon.style.stroke = '#2bc5b4'; }, 3000);
            },
            onerror: (err) => {
                alert("Error: " + err.error);
                if(icon) icon.style.stroke = 'red';
            }
        });
    }

    // --- 4. INJECTION ---
    function ensureButtonExists() {
        if (document.getElementById('saavn-dl-btn')) return;

        const actionList = document.querySelector('.c-player__actions');

        if (actionList) {
            const li = document.createElement('li');
            li.id = "saavn-dl-btn";
            li.className = "c-player__btn";
            li.style.display = "inline-block";
            li.style.verticalAlign = "middle";
            li.style.marginRight = "10px";

            const span = document.createElement('span');
            span.className = "o-icon--xlarge u-pop-in";
            span.style.cursor = 'pointer';
            span.style.display = 'flex';
            span.style.alignItems = 'center';
            span.title = "Download Song";

            span.innerHTML = `
                <svg id="saavn-dl-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2bc5b4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
            `;

            span.onclick = (e) => {
                e.stopPropagation();
                triggerDownload();
            };

            li.appendChild(span);
            actionList.insertBefore(li, actionList.firstChild);
        }
    }

    setInterval(ensureButtonExists, 1000);

})();