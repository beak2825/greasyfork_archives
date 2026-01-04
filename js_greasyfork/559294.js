// ==UserScript==
// @name         MP4 Sniffer - Video Overlay & Sidebar
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Adds a download button directly onto video players and a sidebar list.
// @author       an-swe
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559294/MP4%20Sniffer%20-%20Video%20Overlay%20%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/559294/MP4%20Sniffer%20-%20Video%20Overlay%20%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const videoSources = new Map();
    const sessionDownloaded = new Set();

    // --- UI Setup: Sidebar ---
    const container = document.createElement('div');
    container.style = `position: fixed; top: 15px; right: 15px; z-index: 2147483647; background: #1a1a1a; color: #efefef; padding: 12px; border-radius: 10px; font-family: sans-serif; box-shadow: 0 8px 24px rgba(0,0,0,0.6); width: 340px; display: none; border: 1px solid #444;`;
    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <strong style="font-size:13px;">Video Sniffer <span id="mp4-count" style="color:#00ff88">0</span></strong>
            <button id="clear-list" style="background:transparent; border:1px solid #666; color:#ccc; cursor:pointer; font-size:10px; padding:2px 5px; border-radius:3px;">Hide</button>
        </div>
        <div id="mp4-list-container" style="max-height: 350px; overflow-y: auto; font-size: 11px; margin-bottom:10px; border-top: 1px solid #333; padding-top:5px;"></div>
        <button id="download-all-btn" style="width: 100%; cursor: pointer; background: #28a745; color: white; border: none; padding: 10px; border-radius: 5px; font-weight: bold; font-size:12px;">Download All New</button>
        <div id="download-status" style="font-size: 10px; color: #aaa; margin-top: 8px; text-align: center;">Ready</div>
    `;
    document.body.appendChild(container);

    // --- Helper: Get Formatted Filename ---
    function getFileDetails(src) {
        const urlObj = new URL(src);
        const domain = urlObj.hostname.replace('www.', '');
        const filename = src.split('/').pop().split('?')[0] || 'video.mp4';
        return { domain, filename, path: `${domain}/${filename}` };
    }

    // --- Core Download Function ---
    function triggerDownload(src) {
        const details = getFileDetails(src);
        const a = document.createElement('a');
        a.href = src;
        a.setAttribute('download', details.path);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        sessionDownloaded.add(src);
        updateUI();
    }

    // --- Fetch Size Logic ---
    async function fetchSize(url) {
        if (videoSources.has(url)) return;
        videoSources.set(url, { size: '...' });
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const bytes = response.headers.get('content-length');
            if (bytes) {
                let s = parseInt(bytes), i = 0, units = ['B','KB','MB','GB'];
                while (s >= 1024 && i < 3) { s /= 1024; i++; }
                videoSources.get(url).size = `${s.toFixed(1)} ${units[i]}`;
            } else { videoSources.get(url).size = "N/A"; }
        } catch (e) { videoSources.get(url).size = "CORS"; }
        updateUI();
    }

    // --- Overlay Logic: Add button to <video> tags ---
    function addOverlayToVideo(video) {
        if (video.dataset.hasSniffer) return;
        video.dataset.hasSniffer = "true";

        const btn = document.createElement('button');
        btn.innerText = '⬇️ Download MP4';
        btn.style = `
            position: absolute; top: 10px; right: 10px; z-index: 2147483647;
            background: rgba(40, 167, 69, 0.9); color: white; border: none;
            padding: 8px 12px; border-radius: 5px; cursor: pointer; font-weight: bold;
            font-size: 12px; opacity: 0; transition: opacity 0.3s; pointer-events: auto;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        `;

        // Make button visible on hover of video or container
        const parent = video.parentElement || document.body;
        parent.style.position = parent.style.position || 'relative';

        parent.addEventListener('mouseenter', () => btn.style.opacity = "1");
        parent.addEventListener('mouseleave', () => btn.style.opacity = "0");

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const src = video.currentSrc || video.src;
            if (src && !src.startsWith('blob:')) triggerDownload(src);
            else alert("This video uses a stream format (Blob/HLS) and cannot be downloaded as a single MP4.");
        };

        parent.appendChild(btn);
    }

    // --- Scanning & UI ---
    function scan() {
        const videos = document.querySelectorAll('video');
        videos.forEach(v => {
            const src = v.currentSrc || v.src;
            if (src && src.toLowerCase().includes('.mp4') && !src.startsWith('blob:')) {
                fetchSize(src);
                addOverlayToVideo(v);
            }
        });

        // Also scan for source tags and links
        document.querySelectorAll('source, a[href*=".mp4"]').forEach(el => {
            const url = el.src || el.href;
            if (url && url.toLowerCase().includes('.mp4') && !url.startsWith('blob:')) fetchSize(url);
        });
    }

    function updateUI() {
        const listDiv = document.getElementById('mp4-list-container');
        if (videoSources.size > 0) container.style.display = 'block';
        document.getElementById('mp4-count').innerText = videoSources.size;
        listDiv.innerHTML = '';

        videoSources.forEach((data, url) => {
            const isDone = sessionDownloaded.has(url);
            const { domain, filename } = getFileDetails(url);

            const item = document.createElement('div');
            item.style = `padding: 8px 0; border-bottom: 1px solid #222; opacity: ${isDone ? '0.4' : '1'}; display: flex; align-items: center; justify-content: space-between; gap: 10px;`;
            item.innerHTML = `
                <div style="overflow: hidden; flex-grow: 1;">
                    <div style="display:flex; gap:10px; font-size: 9px; margin-bottom:2px;">
                        <span style="color:#00ff88; font-weight:bold;">${domain}</span>
                        <span style="color:#aaa;">${data.size}</span>
                    </div>
                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #fff;">${filename}</div>
                </div>
                <button class="individual-dl" style="background: #333; border: 1px solid #555; color:white; cursor: pointer; border-radius: 4px; padding: 4px 8px; font-size: 14px;">⬇️</button>
            `;
            item.querySelector('.individual-dl').onclick = () => triggerDownload(url);
            listDiv.appendChild(item);
        });
    }

    // --- Batch Download ---
    async function startBatch() {
        const toDownload = Array.from(videoSources.keys()).filter(src => !sessionDownloaded.has(src));
        const btn = document.getElementById('download-all-btn');
        btn.disabled = true;
        for (let i = 0; i < toDownload.length; i++) {
            document.getElementById('download-status').innerText = `Batch: ${i + 1}/${toDownload.length}`;
            triggerDownload(toDownload[i]);
            await new Promise(r => setTimeout(r, 600));
        }
        document.getElementById('download-status').innerText = "Batch finished.";
        btn.disabled = false;
    }

    document.getElementById('download-all-btn').onclick = startBatch;
    document.getElementById('clear-list').onclick = () => { videoSources.clear(); sessionDownloaded.clear(); container.style.display = 'none'; };

    setInterval(scan, 3000);
})();