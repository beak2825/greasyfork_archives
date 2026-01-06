// ==UserScript==
// @name         Civitai Video Downloader (Collapsible)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Hides sidebar by default, reveals on hover download button on video cards.
// @author       gentlemanan
// @license      MIT
// @match        https://civitai.com/user/*/videos*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561536/Civitai%20Video%20Downloader%20%28Collapsible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561536/Civitai%20Video%20Downloader%20%28Collapsible%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY_PREFIX = 'civitai_dl_';
    const processedUrls = new Set();
    const downloadingUrls = new Set();
    let sidebarList = null;

    const styles = `
        #civ-dl-sidebar {
            position: fixed; top: 0; right: 0; width: 450px; height: 100vh;
            background: #1a1b1e; border-left: 1px solid #373a40; z-index: 10000;
            display: flex; flex-direction: column; box-shadow: -5px 0 15px rgba(0,0,0,0.5);
            transition: transform 0.3s ease;
            font-family: sans-serif;
        }
        #civ-dl-sidebar.collapsed { transform: translateX(450px); }

        /* Sidebar Toggle Tab */
        #civ-dl-toggle {
            position: absolute; left: -40px; top: 20px; width: 40px; height: 40px;
            background: #25262b; border: 1px solid #373a40; border-right: none;
            color: white; cursor: pointer; display: flex; align-items: center;
            justify-content: center; border-radius: 8px 0 0 8px;
        }

        #civ-dl-header { padding: 15px; background: #25262b; border-bottom: 1px solid #373a40; flex-shrink: 0; }

        /* Floating Download All - visible when collapsed */
        #civ-dl-btn-all {
            width: 100%; background: #228be6; color: white; border: none;
            padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold;
        }

        #civ-dl-list { flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; }

        .civ-card {
            background: #25262b; border: 1px solid #373a40; border-radius: 4px;
            display: flex; align-items: center; padding: 8px; gap: 12px; height: 80px;
        }
        .civ-card.downloaded { opacity: 0.5; filter: grayscale(100%); }
        .civ-card-thumb-container {
            width: 100px; height: 64px; background: #000; flex-shrink: 0;
            border-radius: 4px; overflow: hidden; display: flex; justify-content: center; align-items: center;
        }
        .civ-card-thumb { width: 100%; height: 100%; object-fit: contain; }
        .civ-card-filename {
            flex: 1; font-size: 11px; color: #c1c2c5; word-break: break-all;
            overflow: hidden; text-overflow: ellipsis; display: -webkit-box;
            -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }
        .civ-card-btn {
            width: 100px; flex-shrink: 0; background: #40c057; color: white; border: none;
            padding: 8px 4px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold;
        }
        .civ-card-btn:disabled { background: #495057; cursor: default; }

        /* Reveal on Hover Button for Site Video Cards */
        .civ-hover-dl-container {
            position: relative;
        }
        .civ-floating-dl {
            position: absolute; top: 8px; right: 8px; z-index: 50;
            background: rgba(64, 192, 87, 0.9); color: white; border: none;
            padding: 6px 10px; border-radius: 4px; cursor: pointer;
            font-size: 12px; font-weight: bold; opacity: 0; transition: opacity 0.2s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .civ-hover-dl-container:hover .civ-floating-dl { opacity: 1; }
        .civ-floating-dl.done { background: rgba(55, 58, 64, 0.9); }
    `;

    GM_addStyle(styles);

    function getUsername() {
        const match = window.location.pathname.match(/\/user\/([^\/]+)/);
        return match ? match[1] : 'user';
    }

    function getExpectedFilename(url) {
        const parts = url.split('/');
        const filePart = parts.pop().split('?')[0];
        return `${getUsername()}-${filePart}`;
    }

    function isDownloaded(url) {
        return GM_getValue(STORAGE_KEY_PREFIX + url, false);
    }

    function triggerDownload(url) {
        if (isDownloaded(url) || downloadingUrls.has(url)) return;

        downloadingUrls.add(url);
        const fileName = getExpectedFilename(url);

        // Update all UI instances (sidebar and floating buttons)
        const updateUI = (text, disabled, isDone = false) => {
            const sidebarCard = document.querySelector(`.civ-card[data-url="${url}"]`);
            if (sidebarCard) {
                const btn = sidebarCard.querySelector('.civ-card-btn');
                btn.textContent = text;
                btn.disabled = disabled;
                if (isDone) sidebarCard.classList.add('downloaded');
            }
            const floatingBtns = document.querySelectorAll(`.civ-floating-dl[data-url="${url}"]`);
            floatingBtns.forEach(btn => {
                btn.textContent = text;
                btn.disabled = disabled;
                if (isDone) btn.classList.add('done');
            });
        };

        updateUI('Queued...', true);

        GM_download({
            url: url,
            name: fileName,
            saveAs: false,
            onload: () => {
                GM_setValue(STORAGE_KEY_PREFIX + url, true);
                downloadingUrls.delete(url);
                updateUI('Done', true, true);
            },
            onerror: () => {
                downloadingUrls.delete(url);
                updateUI('Error', false);
            }
        });
    }

    function createSidebar() {
        if (document.getElementById('civ-dl-sidebar')) return;
        const sidebar = document.createElement('div');
        sidebar.id = 'civ-dl-sidebar';
        sidebar.className = 'collapsed';
        sidebar.innerHTML = `
            <div id="civ-dl-toggle">☰</div>
            <div id="civ-dl-header">
                <button id="civ-dl-btn-all">Download All New</button>
            </div>
            <div id="civ-dl-list"></div>
        `;
        document.body.appendChild(sidebar);
        sidebarList = document.getElementById('civ-dl-list');

        document.getElementById('civ-dl-toggle').onclick = () => {
            sidebar.classList.toggle('collapsed');
        };

        document.getElementById('civ-dl-btn-all').onclick = function() {
            const cards = document.querySelectorAll('.civ-card');
            let delay = 0;
            cards.forEach(card => {
                const url = card.dataset.url;
                if (!isDownloaded(url) && !downloadingUrls.has(url)) {
                    setTimeout(() => triggerDownload(url), delay);
                    delay += 500;
                }
            });
        };
    }

    function injectFloatingButton(videoEl, mp4Url) {
        // Find the parent container of the video card on Civitai
        const cardContainer = videoEl.closest('a[href*="/images/"]') || videoEl.parentElement;
        if (!cardContainer || cardContainer.querySelector('.civ-floating-dl')) return;

        cardContainer.classList.add('civ-hover-dl-container');

        const floatBtn = document.createElement('button');
        floatBtn.className = 'civ-floating-dl';
        floatBtn.dataset.url = mp4Url;
        const downloaded = isDownloaded(mp4Url);

        floatBtn.textContent = downloaded ? 'Done' : 'Download';
        if (downloaded) floatBtn.classList.add('done');

        floatBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            triggerDownload(mp4Url);
        };

        cardContainer.appendChild(floatBtn);
    }

    function processVideo(videoEl) {
        const sources = videoEl.querySelectorAll('source');
        let mp4Url = null;
        for (let s of sources) {
            if (s.src.includes('.mp4')) { mp4Url = s.src; break; }
        }

        if (!mp4Url) return;

        // 1. Add Floating Button to the UI
        injectFloatingButton(videoEl, mp4Url);

        // 2. Add to Sidebar (if not already there)
        if (processedUrls.has(mp4Url)) return;
        processedUrls.add(mp4Url);

        const fileName = getExpectedFilename(mp4Url);
        const downloaded = isDownloaded(mp4Url);
        const card = document.createElement('div');
        card.className = `civ-card ${downloaded ? 'downloaded' : ''}`;
        card.dataset.url = mp4Url;

        card.innerHTML = `
            <div class="civ-card-thumb-container">
                <img src="${videoEl.poster || ''}" class="civ-card-thumb">
            </div>
            <div class="civ-card-filename" title="${fileName}">${fileName}</div>
            <button class="civ-card-btn" ${downloaded ? 'disabled' : ''}>
                ${downloaded ? 'Downloaded' : 'Download'}
            </button>
        `;

        card.querySelector('.civ-card-btn').onclick = () => triggerDownload(mp4Url);
        sidebarList.appendChild(card);
    }

    const init = () => {
        if (!window.location.href.includes('/videos')) return;
        createSidebar();
        document.querySelectorAll('video').forEach(processVideo);

        const obs = new MutationObserver(m => m.forEach(res => res.addedNodes.forEach(n => {
            if (n.nodeType === 1) {
                if (n.tagName === 'VIDEO') processVideo(n);
                else n.querySelectorAll('video').forEach(processVideo);
            }
        })));
        obs.observe(document.body, { childList: true, subtree: true });
    };

    setInterval(() => {
        if (window.location.href.includes('/videos') && !document.getElementById('civ-dl-sidebar')) {
            init();
        }
    }, 2000);
})();