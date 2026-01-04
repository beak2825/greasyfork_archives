// ==UserScript==
// @name         Udio Bulk MP3 Downloader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Scans the library page for all songs, collects the MP3 links, and provides a GUI for bulk downloading.
// @author       ThetaCursed
// @match        https://www.udio.com/*
// @grant        GM_download
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554217/Udio%20Bulk%20MP3%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/554217/Udio%20Bulk%20MP3%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- GUI Styles and HTML ---
    GM_addStyle(`
        #mp3-downloader-panel { position: fixed; top: 50px; right: 20px; width: 320px; background-color: rgba(240, 240, 240, 0.85); backdrop-filter: blur(15px) saturate(180%); -webkit-backdrop-filter: blur(15px) saturate(180%); border: 1px solid rgba(200, 200, 200, 0.5); border-radius: 12px; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2); z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #333; display: flex; flex-direction: column; }
        #mp3-downloader-header { padding: 10px 15px; cursor: move; border-bottom: 1px solid rgba(200, 200, 200, 0.5); display: flex; justify-content: space-between; align-items: center; }
        #mp3-downloader-header h3 { margin: 0; font-size: 16px; font-weight: 600; }
        #mp3-downloader-close-btn { cursor: pointer; font-size: 20px; font-weight: bold; color: #888; border: none; background: none; }
        #mp3-downloader-close-btn:hover { color: #000; }
        #mp3-downloader-content { padding: 15px; flex-grow: 1; }
        .mp3-downloader-button { width: 100%; padding: 10px 15px; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background-color 0.2s, transform 0.1s; margin-top: 10px; }
        .mp3-downloader-button:active { transform: scale(0.98); }
        .mp3-downloader-button:disabled { opacity: 0.5; cursor: not-allowed; }
        .primary-btn { background-color: #007AFF; color: white; }
        .primary-btn:hover:not(:disabled) { background-color: #006EE5; }
        .secondary-btn { background-color: #E5E5EA; color: #007AFF; }
        .secondary-btn:hover:not(:disabled) { background-color: #DCDCE1; }
        #mp3-downloader-status { font-size: 13px; color: #666; text-align: center; min-height: 20px; margin-bottom: 10px; }
        #mp3-progress-bar-container { width: 100%; height: 6px; background-color: #E5E5EA; border-radius: 3px; overflow: hidden; margin-bottom: 15px; display: none; }
        #mp3-progress-bar { width: 0%; height: 100%; background-color: #007AFF; transition: width 0.3s ease; }
        #mp3-track-list { max-height: 200px; overflow-y: auto; border: 1px solid #E5E5EA; border-radius: 8px; padding: 5px; display: none; }
        .mp3-track-item { font-size: 13px; padding: 6px 8px; border-radius: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mp3-track-item:nth-child(even) { background-color: #F0F0F5; }
    `);
    const panelHTML = `
        <div id="mp3-downloader-panel">
            <div id="mp3-downloader-header"><h3>Udio Bulk MP3 Downloader</h3><button id="mp3-downloader-close-btn">&times;</button></div>
            <div id="mp3-downloader-content">
                <div id="mp3-downloader-status">Ready to scan the page.</div>
                <div id="mp3-progress-bar-container"><div id="mp3-progress-bar"></div></div>
                <div id="collection-stage"><button id="start-scan-btn" class="mp3-downloader-button primary-btn">Start Scan</button></div>
                <div id="download-stage" style="display: none;">
                    <div id="mp3-track-list"></div>
                    <button id="download-all-btn" class="mp3-downloader-button primary-btn">Download All</button>
                    <button id="clear-list-btn" class="mp3-downloader-button secondary-btn">Clear List & Rescan</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // --- GUI Element References and State (No changes) ---
    const panel = document.getElementById('mp3-downloader-panel');
    const header = document.getElementById('mp3-downloader-header');
    const statusText = document.getElementById('mp3-downloader-status');
    const progressBarContainer = document.getElementById('mp3-progress-bar-container');
    const progressBar = document.getElementById('mp3-progress-bar');
    const trackListDiv = document.getElementById('mp3-track-list');
    const collectionStage = document.getElementById('collection-stage');
    const downloadStage = document.getElementById('download-stage');
    const startScanBtn = document.getElementById('start-scan-btn');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const clearListBtn = document.getElementById('clear-list-btn');
    const closeBtn = document.getElementById('mp3-downloader-close-btn');
    let collectedTracks = [];

    // --- Helper functions ---
    function updateStatus(text) { statusText.textContent = text; }
    function updateProgress(current, total) { const percentage = total > 0 ? (current / total) * 100 : 0; progressBar.style.width = `${percentage}%`; }
    function switchStage(stage) { if (stage === 'collection') { collectionStage.style.display = 'block'; downloadStage.style.display = 'none'; trackListDiv.style.display = 'none'; progressBarContainer.style.display = 'none'; trackListDiv.innerHTML = ''; } else if (stage === 'download') { collectionStage.style.display = 'none'; downloadStage.style.display = 'block'; trackListDiv.style.display = 'block'; progressBarContainer.style.display = 'none'; } }
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    /**
     * The main function to collect track information.
     * --- THIS IS THE UPDATED FUNCTION ---
     */
    async function collectTrackInfo() {
        console.log('Starting track collection...');
        startScanBtn.disabled = true;
        progressBarContainer.style.display = 'block';
        updateProgress(0, 1);
        collectedTracks = [];
        let hasMuted = false; // The flag to track if we have muted the player.

        updateStatus('Searching for tracks...');
        const xpath = '//button[contains(@aria-label, "Play")]';
        const trackButtons = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const totalTracks = trackButtons.snapshotLength;

        if (totalTracks === 0) {
            updateStatus('No "Play" buttons found. Check XPath.');
            startScanBtn.disabled = false;
            progressBarContainer.style.display = 'none';
            return;
        }

        console.log(`Found ${totalTracks} play buttons.`);

        for (let i = 0; i < totalTracks; i++) {
            const button = trackButtons.snapshotItem(i);
            updateStatus(`Processing track ${i + 1} of ${totalTracks}...`);
            updateProgress(i, totalTracks);

            const ariaLabel = button.getAttribute('aria-label');
            let songTitle = `track_${Date.now()}`;
            if (ariaLabel && ariaLabel.toLowerCase().startsWith('play ')) {
                songTitle = ariaLabel.substring(5).trim();
            }
            console.log(`Title found: "${songTitle}"`);

            button.click();

            // --- NEW LOGIC: Mute after first play ---
            // We only try to mute once, right after the first track is played.
            if (!hasMuted) {
                await sleep(500); // Give the player a moment to appear
                const muteButton = document.querySelector('button[aria-label="Mute"]');
                if (muteButton) {
                    console.log('Player activated. Muting now.');
                    muteButton.click();
                } else {
                    console.log('Player activated, but mute button not found (perhaps already muted).');
                }
                hasMuted = true; // Set the flag so we don't try this again.
            }
            // --- End of new mute logic ---

            await sleep(1500); // The rest of the wait time (total 2s)

            const audioElement = document.querySelector('audio[src]');
            if (audioElement && audioElement.src) {
                const songUrl = audioElement.src;
                console.log(`URL found: ${songUrl}`);
                if (!collectedTracks.some(track => track.url === songUrl && track.title === songTitle)) {
                    collectedTracks.push({ title: songTitle, url: songUrl });
                } else {
                    console.log(`Skipping duplicate: ${songTitle}`);
                }
            } else {
                console.warn(`Could not find audio source for "${songTitle}" after clicking.`);
            }
        }
        updateProgress(totalTracks, totalTracks);
        updateStatus(`Collection complete! Found ${collectedTracks.length} tracks.`);
        displayResults();
    }


    function displayResults() {
        trackListDiv.innerHTML = '';
        if (collectedTracks.length === 0) {
            const item = document.createElement('div'); item.className = 'mp3-track-item';
            item.textContent = 'No tracks were successfully collected.'; trackListDiv.appendChild(item);
        } else {
            collectedTracks.forEach(track => {
                const item = document.createElement('div'); item.className = 'mp3-track-item';
                item.textContent = track.title; item.title = track.title; trackListDiv.appendChild(item);
            });
        }
        downloadAllBtn.textContent = `Download All (${collectedTracks.length})`; switchStage('download');
    }

    async function downloadAllTracks() {
        if (collectedTracks.length === 0) { updateStatus('Nothing to download.'); return; }
        console.log('Starting download process...'); downloadAllBtn.disabled = true; clearListBtn.disabled = true;
        progressBarContainer.style.display = 'block';
        for (let i = 0; i < collectedTracks.length; i++) {
            const track = collectedTracks[i];
            updateStatus(`Downloading ${i + 1} of ${collectedTracks.length}: ${track.title}`);
            updateProgress(i, collectedTracks.length);
            const safeFileName = track.title.replace(/[\\/:*?"<>|]/g, '_') + '.mp3';
            console.log(`Downloading: ${safeFileName} from ${track.url}`);
            GM_download({ url: track.url, name: safeFileName, onerror: (err) => console.error(`Error downloading ${safeFileName}:`, err), onload: () => console.log(`${safeFileName} download started.`) });
            await sleep(500);
        }
        updateProgress(collectedTracks.length, collectedTracks.length);
        updateStatus(`All ${collectedTracks.length} downloads have been queued!`);
        downloadAllBtn.disabled = false; clearListBtn.disabled = false;
    }

    startScanBtn.addEventListener('click', collectTrackInfo);
    downloadAllBtn.addEventListener('click', downloadAllTracks);
    clearListBtn.addEventListener('click', () => { collectedTracks = []; updateStatus('Ready to scan the page.'); switchStage('collection'); startScanBtn.disabled = false; });
    closeBtn.addEventListener('click', () => { panel.style.display = 'none'; });
    let isDragging = false, offsetX, offsetY;
    header.addEventListener('mousedown', (e) => { isDragging = true; offsetX = e.clientX - panel.offsetLeft; offsetY = e.clientY - panel.offsetTop; panel.style.userSelect = 'none'; });
    document.addEventListener('mousemove', (e) => { if (isDragging) { panel.style.left = `${e.clientX - offsetX}px`; panel.style.top = `${e.clientY - offsetY}px`; } });
    document.addEventListener('mouseup', () => { isDragging = false; panel.style.userSelect = 'auto'; });

})();