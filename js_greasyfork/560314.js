// ==UserScript==
// @name        Radio Paradise Pro
// @namespace   http://tampermonkey.net/
// @match       https://radioparadise.com/*
// @grant       GM_xmlhttpRequest
// @connect     audio-fb.radioparadise.com
// @version     1.0
// @author      Gemini
// @description Adds a high-quality FLAC downloader, automatically skips low-rated songs and jingles. Vibe coded with Gemini.
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/560314/Radio%20Paradise%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/560314/Radio%20Paradise%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. CONFIGURATION & STATE ---
    let lastTrackTitle = "";
    let skipInProgress = false;
    let currentDlUrl = "";
    let currentFileName = "song.flac";
    const JINGLE_LABEL = "Listener-supported";

    const getSavedRating = () => {
        const saved = localStorage.getItem('rp_min_rating');
        return (saved !== null) ? saved : '6.5';
    };

    // --- 2. DOWNLOAD HELPER ---
    function triggerDownload(url, filename, elementToUpdate = null) {
        GM_xmlhttpRequest({
            method: "GET", url: url, responseType: "blob",
            onprogress: (msg) => {
                if (elementToUpdate && msg.lengthComputable) {
                    const percent = Math.round((msg.loaded / msg.total) * 100);
                    elementToUpdate.innerHTML = ` <span style="font-size: 10px; color: #00ff00;">${percent}%</span>`;
                }
            },
            onload: (r) => {
                const blobUrl = window.URL.createObjectURL(r.response);
                const a = document.createElement('a');
                a.href = blobUrl; a.download = filename.replace(/[\\/:"*?<>|]/g, "") + ".flac";
                a.click();
                window.URL.revokeObjectURL(blobUrl);
                if (elementToUpdate) {
                    elementToUpdate.innerHTML = ' ✅';
                    setTimeout(() => { elementToUpdate.innerHTML = ' 📥'; }, 2000);
                }
            }
        });
    }

    // --- 3. UI CONSTRUCTION ---
    const style = document.createElement('style');
    style.innerHTML = `
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 1 !important; display: block !important; }
        .rp-pro-dl:hover { filter: grayscale(0) !important; transform: scale(1.2); transition: 0.2s; }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    Object.assign(panel.style, {
        position: 'fixed', bottom: '80px', right: '20px', padding: '12px',
        backgroundColor: 'rgba(0, 0, 0, 0.95)', color: '#fff', borderRadius: '10px',
        zIndex: '500', border: '2px solid #ffde00', fontFamily: 'sans-serif',
        textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', width: '165px'
    });

    const viewWarning = document.createElement('div');
    const warningText = document.createElement('div');
    warningText.innerHTML = 'Auto-Skip requires<br>Player List View';
    warningText.style.fontSize = '12px'; warningText.style.marginBottom = '10px'; warningText.style.color = '#ff4444';

    const switchBtn = document.createElement('button');
    Object.assign(switchBtn.style, { width: '100%', padding: '6px 4px', backgroundColor: '#333', color: '#fff', border: '1px solid #ffde00', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' });
    switchBtn.innerHTML = `<span>Switch to Player</span>`;
    switchBtn.onclick = () => {
        const nativeListBtn = document.querySelector('mat-icon[svgicon="player-button-mode-list"]') || document.querySelector('.mode-list');
        if (nativeListBtn) nativeListBtn.click();
        else window.location.hash = '/player/list';
    };
    viewWarning.append(warningText, switchBtn);

    const mainControls = document.createElement('div');
    const ratingDisplay = document.createElement('div');
    ratingDisplay.style.fontSize = '16px'; ratingDisplay.style.marginBottom = '12px';
    ratingDisplay.innerHTML = 'Song rating: --';

    const thresholdInput = document.createElement('input');
    thresholdInput.type = 'number'; thresholdInput.step = '0.1'; thresholdInput.value = getSavedRating();
    Object.assign(thresholdInput.style, { width: '60px', background: '#222', color: '#ffde00', border: '1px solid #555', borderRadius: '4px', padding: '4px 6px', fontWeight: 'bold' });

    const skipRow = document.createElement('div');
    Object.assign(skipRow.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '12px' });
    const skipLabel = document.createElement('div'); skipLabel.innerHTML = 'Skip if <'; skipLabel.style.fontSize = '12px';
    skipRow.append(skipLabel, thresholdInput);

    const mainDlBtn = document.createElement('button');
    Object.assign(mainDlBtn.style, { display: 'block', width: '100%', padding: '8px 2px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#222', color: '#666', border: '1px solid #444' });
    mainDlBtn.innerHTML = 'Waiting...';
    mainDlBtn.onclick = () => { if (currentDlUrl) triggerDownload(currentDlUrl, currentFileName, mainDlBtn); };

    mainControls.append(ratingDisplay, skipRow, mainDlBtn);
    panel.append(viewWarning, mainControls);
    document.body.appendChild(panel);

    // --- 4. LOGIC FUNCTIONS ---
    function injectListButtons() {
        document.querySelectorAll('.song-row').forEach(row => {
            const line1 = row.querySelector('.line1');
            if (!line1 || row.querySelector('.rp-pro-dl')) return;
            const songLink = line1.querySelector('a');
            const songIdMatch = songLink?.href.match(/\/song\/(\d+)\//);
            if (songIdMatch) {
                const dlBtn = document.createElement('span');
                dlBtn.className = 'rp-pro-dl'; dlBtn.innerHTML = ' 📥';
                Object.assign(dlBtn.style, { cursor: 'pointer', fontSize: '14px', marginLeft: '8px', filter: 'grayscale(1)', display: 'inline-block' });
                dlBtn.onclick = (e) => {
                    e.preventDefault(); e.stopPropagation();
                    const artist = row.querySelector('.line2 a')?.innerText.trim() || "Unknown";
                    const title = songLink.innerText.trim();
                    triggerDownload(`https://audio-fb.radioparadise.com/audio/flac/${songIdMatch[1]}.flac`, `${artist} - ${title}`, dlBtn);
                };
                line1.appendChild(dlBtn);
            }
        });
    }

    function executeSkip() {
        const skipBtn = document.querySelector('#skip-button') || document.querySelector('.skip-button');
        if (skipBtn && !skipInProgress) {
            skipInProgress = true;
            skipBtn.click();
            console.log("RP PRO: Skipping jingle/low-rated track.");
            setTimeout(() => { skipInProgress = false; }, 2000);
        }
    }

    function evaluateTrack() {
        const playerTitle = document.querySelector('.player-title')?.innerText.trim() || "";
        const historyRow = document.querySelector('div.song-row.standard.first');

        // Jingle skip is now handled by the heartbeat directly for speed
        if (playerTitle === JINGLE_LABEL) return;
        if (!historyRow) return;

        const songLink = historyRow.querySelector('.line1 a');
        const songIdMatch = songLink?.href.match(/\/song\/(\d+)\//);
        const artist = document.querySelector('.player-artist')?.innerText.trim() || "Unknown";

        if (songIdMatch) {
            currentDlUrl = `https://audio-fb.radioparadise.com/audio/flac/${songIdMatch[1]}.flac`;
            currentFileName = `${artist} - ${playerTitle}`;
            mainDlBtn.innerHTML = 'Download FLAC';
            Object.assign(mainDlBtn.style, { backgroundColor: '#1b4d1b', color: '#00ff00', border: '1px solid #00ff00' });
        }

        const ratingElement = historyRow.querySelector('div.rating[title="average rating"]') || historyRow.querySelector('.rating');
        let threshold = parseFloat(thresholdInput.value) || 0;
        if (ratingElement && ratingElement.innerText.trim() !== "") {
            const currentRating = parseFloat(ratingElement.innerText);
            ratingDisplay.innerHTML = `Song rating: <strong>${currentRating}</strong>`;
            panel.style.borderColor = currentRating < threshold ? '#ff4444' : (currentRating >= 8.5 ? '#00ff00' : '#ffde00');
            if (currentRating < threshold) executeSkip();
            else lastTrackTitle = songLink?.innerText.trim();
        }
    }

    thresholdInput.oninput = () => {
        localStorage.setItem('rp_min_rating', thresholdInput.value);
        evaluateTrack();
    };

    // --- 5. HEARTBEAT LOOP ---
    setInterval(() => {
        const playerTitle = document.querySelector('.player-title')?.innerText.trim() || "";
        const historyRow = document.querySelector('div.song-row.standard.first');
        const isFavorites = !!document.querySelector('app-favorites');

        injectListButtons();

        // 1. INSTANT JINGLE CHECK (Highest Priority)
        if (playerTitle === JINGLE_LABEL) {
            executeSkip();
            return;
        }

        // 2. VIEW STATE CHECK
        if (!historyRow) {
            mainControls.style.display = 'none';
            viewWarning.style.display = 'block';
            panel.style.borderColor = isFavorites ? '#ffde00' : '#ff4444';
        } else {
            mainControls.style.display = 'block';
            viewWarning.style.display = 'none';

            const currentListTitle = historyRow.querySelector('.line1 a')?.innerText.trim() || "";
            if (currentListTitle !== lastTrackTitle && !skipInProgress) {
                lastTrackTitle = currentListTitle;
                // Wait for rating to load for actual songs
                setTimeout(evaluateTrack, 1200);
            }
        }
    }, 1000); // Tightened heartbeat to 1s for faster jingle detection
})();