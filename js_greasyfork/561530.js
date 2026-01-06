// ==UserScript==
// @name         Instagram Downloader Pro Max
// @namespace    igDownloaderProMax
// @version      1.3.59
// @description  instagram downloader with checkbox selection as bulk of just download with download button next to save button for posts, pause button for stories
// @author       Runterya
// @match        https://www.instagram.com/*
// @homepage     https://github.com/Runteryaa
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/561530/Instagram%20Downloader%20Pro%20Max.user.js
// @updateURL https://update.greasyfork.org/scripts/561530/Instagram%20Downloader%20Pro%20Max.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIG ---
    const CHECK_INTERVAL = 500;
    const API_URL = "https://backend1.tioo.eu.org/api/downloader/igdl";

    // --- MEMORY ---
    const selectedUrls = new Set();
    let isDownloading = false;

    // --- ICON ---
    const DOWNLOAD_ICON = `
    <svg aria-label="Download" class="x1lliihq x1n2onr6" color="currentColor" fill="none" height="16" role="img" viewBox="0 0 24 24" width="16" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>`;

    // --- STYLES ---
    const styles = `
        .ig-extractor-checkbox {
            position: absolute !important;
            top: 8px !important;
            left: 8px !important;
            z-index: 1000 !important;
            width: 20px !important;
            height: 20px !important;
            cursor: pointer !important;
            accent-color: #0095f6;
            outline: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .ig-dl-popup {
            position: fixed !important;
            z-index: 2147483647 !important;
            background: rgba(38, 38, 38, 0.95);
            border-radius: 12px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            min-width: 180px;
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(5px);
            font-family: -apple-system, system-ui, sans-serif;
        }
        .ig-dl-popup button {
            background: transparent;
            border: none;
            color: white;
            padding: 8px 12px;
            text-align: left;
            font-size: 13px;
            cursor: pointer;
            border-radius: 6px;
            transition: background 0.2s;
            white-space: nowrap;
        }
        .ig-dl-popup button:hover { background: rgba(255,255,255,0.1); }
        .ig-dl-popup .ig-divider { height: 1px; background: rgba(255,255,255,0.1); margin: 2px 0; }

        .ig-dl-warning {
            color: #ffcc00;
            font-size: 11px;
            padding: 4px 8px;
            background: rgba(255, 204, 0, 0.1);
            border-radius: 4px;
            margin-bottom: 4px;
            text-align: center;
        }

        .ig-top-left-container {
            z-index: 9999;
            display: none;
            gap: 4px;
            align-items: center;
            transition: top 0.2s ease;
        }

        .ig-sticky-mode {
            position: fixed !important;
            top: 0px !important;
            border-radius: 12px;
            backdrop-filter: blur(5px);
        }

        .ig-bottom-right-container {
            position: fixed;
            z-index: 2147483647;
            display: none;
            gap: 8px;
            align-items: center;
            bottom: 10px;
            right: 10px;
        }

        .ig-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px 10px;
            border-radius: 14px;
            font-weight: 400;
            font-size: 12px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            font-family: -apple-system, system-ui, sans-serif;
            transition: all 0.2s ease;
            border: none;
            color: #fff;
        }

        .ig-btn:hover { transform: scale(1.05); }

        .ig-btn-dl {
            background-color: #0095f6;
            border: 1px solid #0095f6;
        }
        .ig-btn-add { background-color: #26a269; }
        .ig-btn-clear { background-color: #e01b24; color: white; }

        .ig-single-dl-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 8px;
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            margin-left: 8px;
            transition: transform 0.2s;
            color: inherit;
            z-index: 10001;
            position: relative;
        }
        .ig-single-dl-btn:hover { opacity: 0.7; transform: scale(1.1); }

        .ig-story-count-text {
            font-size: 13px;
            font-weight: 700;
            margin-left: 3px;
            opacity: 1;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    function getCleanUrl(anchorElement) {
        if (!anchorElement || !anchorElement.href) return null;
        return anchorElement.href.split('?')[0];
    }

    function log(msg, type = "info") {
        console.log(`[IG-DL] ${type === 'error' ? '❌' : 'ℹ️'} ${msg}`);
    }

    function init() {
        initBulkDownloader();
        initSingleButtonInjector();
        initStoryButtonInjector();
        updatePanelVisibility();
        alignButtonWithVolume();

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', () => {
            handleScroll();
            alignButtonWithVolume();
        });

        setInterval(alignButtonWithVolume, 1000);
    }

    function alignButtonWithVolume() {
        const container = document.getElementById('ig-bottom-right-panel');
        if (!container || container.style.display === 'none') return;

        let volBtn = document.getElementById('igDefaultVolume') ||
                     document.querySelector('.igDefaultVolume');

        if (!volBtn) {
             const allDivs = document.querySelectorAll('div, button, span');
             for (let el of allDivs) {
                 if (el.innerText === "100%" && (el.querySelector('svg') || el.closest('button'))) {
                     volBtn = el.closest('button') || el;
                     break;
                 }
             }
        }

        if (volBtn) {
            const rect = volBtn.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                const containerRect = container.getBoundingClientRect();
                container.style.left = (rect.left - containerRect.width - 8) + 'px';
                container.style.top = rect.top + 'px';
                container.style.bottom = 'auto';
                container.style.right = 'auto';
                return;
            }
        }

        container.style.position = 'fixed';
        container.style.right = '10px';
        container.style.bottom = '10px';
        container.style.top = 'auto';
        container.style.left = 'auto';
    }

    function handleScroll() {
        const topLeftPanel = document.getElementById('ig-top-left-panel');
        if (!topLeftPanel || topLeftPanel.style.display === 'none') return;

        const tabList = document.querySelector('div[role="tablist"]');
        if (tabList) {
            const rect = tabList.getBoundingClientRect();
            if (rect.top < 60) {
                if (!topLeftPanel.classList.contains('ig-sticky-mode')) {
                    topLeftPanel.classList.add('ig-sticky-mode');
                }
                topLeftPanel.style.left = rect.left + 'px';
                topLeftPanel.style.transform = 'none';
            } else {
                if (topLeftPanel.classList.contains('ig-sticky-mode')) {
                    topLeftPanel.classList.remove('ig-sticky-mode');
                    topLeftPanel.style.left = '0px';
                    topLeftPanel.style.top = '12px';
                }
            }
        }
        alignButtonWithVolume();
    }

    function filterUniqueUrls(urlArray) {
        const uniqueSet = new Set();
        return urlArray.filter(link => {
            if (uniqueSet.has(link)) return false;
            uniqueSet.add(link);
            return true;
        });
    }

    function getCurrentSlideIndex(article) {
        const ul = article.querySelector('ul');
        if (!ul) return 0;
        const lis = ul.querySelectorAll('li');
        if (lis.length === 0) return 0;
        const containerRect = ul.parentElement.getBoundingClientRect();
        const containerCenter = containerRect.left + (containerRect.width / 2);
        let closestIndex = 0;
        let minDistance = Infinity;
        lis.forEach((li, index) => {
            const liRect = li.getBoundingClientRect();
            const liCenter = liRect.left + (liRect.width / 2);
            const distance = Math.abs(containerCenter - liCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });
        return closestIndex;
    }

    // --- DOM STORY COUNTER ---
    function getStoryElements() {
        let bars = Array.from(document.querySelectorAll('div._ac3n > div'));
        if (bars.length === 0) {
            const specificBars = document.getElementsByClassName('x1lix1fw');
            if (specificBars.length > 1 && specificBars[0].parentElement) {
                bars = Array.from(specificBars[0].parentElement.children);
            }
        }
        if (bars.length === 0) {
            const headers = document.querySelectorAll('header');
            for (let header of headers) {
                const progressContainer = header.querySelector('div > div > div');
                if (progressContainer && progressContainer.childElementCount > 1) {
                    const firstChild = progressContainer.firstElementChild;
                    if (firstChild && firstChild.offsetHeight < 10) {
                        bars = Array.from(progressContainer.children);
                        break;
                    }
                }
            }
        }
        return bars;
    }

    function getStoryCountFromDOM() {
        return getStoryElements().length;
    }

    function markMissingStories(apiCount) {
        const bars = getStoryElements();
        const domCount = bars.length;
        if (domCount > 0 && apiCount < domCount) {
            bars.forEach((bar, index) => {
                if (index >= apiCount) {
                    bar.setAttribute('style', 'background-color: red !important;');
                } else {
                    bar.setAttribute('style', '');
                }
            });
        } else {
             bars.forEach(bar => bar.setAttribute('style', ''));
        }
    }

    function showChoicePopup(btnElement, videoUrls, onDownloadAll, onDownloadCurrent) {
        const existing = document.querySelector('.ig-dl-popup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.className = 'ig-dl-popup';

        const apiCount = videoUrls.length;
        let isStory = window.location.href.includes('/stories/');
        let domCount = isStory ? getStoryCountFromDOM() : 0;

        if (isStory) markMissingStories(apiCount);

        if (isStory && domCount > 0 && apiCount < domCount) {
            const warning = document.createElement('div');
            warning.className = 'ig-dl-warning';
            warning.innerText = `⚠️ Missing: ${domCount - apiCount} stories (Marked Red)`;
            popup.appendChild(warning);
        }

        const rect = btnElement.getBoundingClientRect();
        popup.style.top = (rect.bottom + 8) + 'px';
        popup.style.left = rect.left + 'px';

        let currentIsAvailable = true;
        if (apiCount === 0) currentIsAvailable = false;

        const btnCurrent = document.createElement('button');
        if (currentIsAvailable) {
            btnCurrent.innerText = `👁️ Download seen`;
            btnCurrent.onclick = (e) => {
                e.stopPropagation(); popup.remove(); onDownloadCurrent();
            };
            popup.appendChild(btnCurrent);
        } else {
            btnCurrent.innerText = `👁️ Unavailable`;
            btnCurrent.disabled = true;
            btnCurrent.style.color = '#ff6b6b';
            popup.appendChild(btnCurrent);
        }

        const btnAll = document.createElement('button');
        btnAll.innerText = `📥 Download All (${apiCount})`;
        btnAll.onclick = (e) => {
            e.stopPropagation(); popup.remove(); onDownloadAll();
        };

        const div = document.createElement('div'); div.className = 'ig-divider';
        popup.appendChild(div);
        popup.appendChild(btnAll);

        const closeListener = (e) => {
            if (!popup.contains(e.target) && e.target !== btnElement) {
                popup.remove();
                document.removeEventListener('click', closeListener);
            }
        };
        setTimeout(() => document.addEventListener('click', closeListener), 10);
        document.body.appendChild(popup);
    }

    function initStoryButtonInjector() {
        if (!window.location.href.includes('/stories/')) return;
        const controlIcons = document.querySelectorAll('svg[aria-label="Pause"], svg[aria-label="Play"], svg[aria-label="Duraklat"], svg[aria-label="Oynat"]');

        controlIcons.forEach(icon => {
            const parentButton = icon.closest('div[role="button"], button');
            if (parentButton) {
                const container = parentButton.parentElement;

                let storyCount = getStoryCountFromDOM();
                let dlBtn = container.querySelector('.ig-story-dl-btn');

                if (!dlBtn) {
                    if (window.getComputedStyle(container).display !== 'flex') {
                        container.style.display = 'flex';
                        container.style.alignItems = 'center';
                    }
                    dlBtn = document.createElement('div');
                    dlBtn.className = 'ig-single-dl-btn ig-story-dl-btn';
                    dlBtn.title = "Pause and Download";
                    dlBtn.style.color = "white";
                    dlBtn.style.marginRight = "8px";

                    dlBtn.onclick = async (e) => {
                        e.stopPropagation(); e.preventDefault();
                        const pauseBtn = document.querySelector('svg[aria-label="Pause"], svg[aria-label="Duraklat"]');
                        if (pauseBtn) {
                            const actualPauseClick = pauseBtn.closest('div[role="button"], button');
                            if (actualPauseClick) actualPauseClick.click();
                        }
                        setTimeout(() => handleDownloadClick(dlBtn, true), 300);
                    };
                    container.insertBefore(dlBtn, parentButton);
                }

                const currentCount = dlBtn.getAttribute('data-count');
                if (currentCount != storyCount) {
                    const countText = storyCount > 0 ? `(${storyCount})` : '';
                    dlBtn.innerHTML = DOWNLOAD_ICON + `<span class="ig-story-count-text">${countText}</span>`;
                    dlBtn.setAttribute('data-count', storyCount);
                }
            }
        });
    }

    function initSingleButtonInjector() {
        const saveIcons = document.querySelectorAll('svg[aria-label="Kaydet"], svg[aria-label="Save"], svg[aria-label="Remove"]');
        saveIcons.forEach(icon => {
            const parentButton = icon.closest('div[role="button"], button, a');
            if (parentButton) {
                const container = parentButton.parentElement;
                if (container.querySelector('.ig-single-dl-btn')) return;
                if (window.getComputedStyle(container).display !== 'flex') {
                    container.style.display = 'flex';
                    container.style.alignItems = 'center';
                }
                const dlBtn = document.createElement('div');
                dlBtn.className = 'ig-single-dl-btn';
                dlBtn.innerHTML = DOWNLOAD_ICON;
                dlBtn.title = "Download";
                dlBtn.style.color = getComputedStyle(icon).color;
                dlBtn.onclick = async (e) => {
                    e.stopPropagation(); e.preventDefault();
                    await handleDownloadClick(dlBtn, false);
                };
                container.insertBefore(dlBtn, parentButton.nextSibling);
            }
        });
    }

    async function handleDownloadClick(btn, isStory) {
        btn.style.color = "yellow";

        try {
            let url = window.location.href;
            let article = null;

            if (isStory) {
                // No strict check
            } else {
                article = btn.closest('article');
                if (!url.includes('/p/') && !url.includes('/stories/') && !url.includes('/reel/')) {
                    if (article) {
                        const linkElement = article.querySelector('a[href*="/p/"], a[href*="/reel/"]');
                        if (linkElement) url = linkElement.href;
                    }
                }
            }

            if (url.includes('/reel/')) url = url.replace('/reel/', '/p/');
            url = url.split('?')[0];

            let videoUrls = await fetchFromTiooApi(url);

            if (!videoUrls || videoUrls.length === 0) throw new Error("Link not found!");

            videoUrls = filterUniqueUrls(videoUrls);

            // Mismatch logic
            const domCount = isStory ? getStoryCountFromDOM() : 0;
            const hasMismatch = isStory && domCount > 0 && videoUrls.length < domCount;

            if (videoUrls.length === 1 && !hasMismatch) {
                await downloadList(videoUrls, isStory ? "ig_story" : "ig_post");
                flashSuccess(btn);
            } else {
                btn.style.color = '';
                showChoicePopup(
                    btn,
                    videoUrls,
                    async () => {
                        await downloadList(videoUrls, isStory ? "ig_story" : "ig_post");
                        flashSuccess(btn);
                    },
                    async () => {
                        let index = 0;
                        if (!isStory && article) {
                            index = getCurrentSlideIndex(article);
                        }
                        if (index >= videoUrls.length) index = 0;
                        await downloadList([videoUrls[index]], (isStory ? "ig_story" : "ig_post") + "_selected");
                        flashSuccess(btn);
                    }
                );
            }
        } catch (err) {
            alert("Error: " + err);
            btn.style.color = "red";
        } finally {
            if (!document.querySelector('.ig-dl-popup')) flashSuccess(btn);
        }
    }

    function flashSuccess(btn) {
        const originalColor = btn.style.color;
        btn.style.color = "#26a269";
        setTimeout(() => btn.style.color = originalColor || "inherit", 2000);
        btn.style.opacity = "1";
    }

    async function downloadList(urls, prefix) {
        for (let i = 0; i < urls.length; i++) {
            const link = urls[i];
            let ext = "mp4";
            if (link.includes(".jpg") || link.includes(".jpeg")) ext = "jpg";
            const blob = await fetchFileBlob(link);
            saveAs(blob, `${prefix}_${Date.now()}_part${i+1}.${ext}`);
            if (urls.length > 1) await new Promise(r => setTimeout(r, 500));
        }
    }

    // --- CHECK FOR SELECTABLE PAGES ---
    function isSelectablePage() {
        const path = window.location.pathname;
        if (path === '/' || path.startsWith('/direct/') || path.startsWith('/settings/')) return false;
        if (path.startsWith('/explore/')) return true;
        if (path.startsWith('/stories/') || path.startsWith('/p/')) return false;
        if (path.startsWith('/reels/') && !path.includes('/reels/audio/')) return false;
        if (document.querySelector('div[role="tablist"]')) return true;
        return false;
    }

    function updatePanelVisibility() {
        const topLeftPanel = document.getElementById('ig-top-left-panel');
        const bottomRightPanel = document.getElementById('ig-bottom-right-panel');
        if (!topLeftPanel || !bottomRightPanel) return;

        // 1. Top Left Panel (Select Visible) - Only on Profile or Explore
        if (isSelectablePage()) {
            topLeftPanel.style.display = 'flex';

            const tabList = document.querySelector('div[role="tablist"]');
            if (tabList) {
                if (!topLeftPanel.classList.contains('ig-sticky-mode')) {
                    if (topLeftPanel.parentElement !== tabList.parentElement) {
                        tabList.parentElement.style.position = 'relative';
                        tabList.parentElement.appendChild(topLeftPanel);
                        topLeftPanel.style.position = 'absolute';
                        topLeftPanel.style.top = '12px';
                        topLeftPanel.style.left = '0px';
                        topLeftPanel.style.transform = 'none';
                    }
                }
            } else {
                if (!topLeftPanel.classList.contains('ig-sticky-mode')) {
                    if (topLeftPanel.parentElement !== document.body) {
                        document.body.appendChild(topLeftPanel);
                    }
                    topLeftPanel.classList.add('ig-sticky-mode');
                    topLeftPanel.style.position = 'fixed';
                    topLeftPanel.style.top = '70px';
                    topLeftPanel.style.left = '20px';
                }
            }
        } else {
            topLeftPanel.style.display = 'none';
        }

        // 2. Bottom Right Panel (Download Button) - ALWAYS if selected
        if (selectedUrls.size > 0) {
            bottomRightPanel.style.display = 'flex';
        } else {
            bottomRightPanel.style.display = 'none';
        }
    }

    function initBulkDownloader() {
        if (!document.getElementById('ig-top-left-panel')) {
            const topLeftContainer = document.createElement('div');
            topLeftContainer.id = 'ig-top-left-panel';
            topLeftContainer.className = 'ig-top-left-container';
            const addBtn = document.createElement('button');
            addBtn.innerText = 'Select Visible';
            addBtn.className = 'ig-btn ig-btn-add';
            addBtn.onclick = selectAllVisible;
            const clearBtn = document.createElement('button');
            clearBtn.innerText = 'X';
            clearBtn.className = 'ig-btn ig-btn-clear';
            clearBtn.onclick = clearAll;
            topLeftContainer.appendChild(addBtn);
            topLeftContainer.appendChild(clearBtn);
            document.body.appendChild(topLeftContainer);
        }
        if (!document.getElementById('ig-bottom-right-panel')) {
            const bottomRightContainer = document.createElement('div');
            bottomRightContainer.id = 'ig-bottom-right-panel';
            bottomRightContainer.className = 'ig-bottom-right-container';
            const dlBtn = document.createElement('button');
            dlBtn.id = 'ig-dl-btn';
            dlBtn.className = 'ig-btn ig-btn-dl';
            dlBtn.innerHTML = DOWNLOAD_ICON + '<span>Download Selected</span>';
            dlBtn.onclick = startDirectDownload;
            bottomRightContainer.appendChild(dlBtn);
            document.body.appendChild(bottomRightContainer);
        }
        const targets = document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]');
        targets.forEach(el => {
            const hasMedia = el.querySelector('img') || el.querySelector('video') || el.querySelector('div[class*="_aagw"]') || el.querySelector('div[style*="background-image"]');

            if (!hasMedia) return;

            if (el.getAttribute('data-ig-checked') === 'true') return;
            el.setAttribute('data-ig-checked', 'true');
            if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'ig-extractor-checkbox';
            const url = getCleanUrl(el);
            if (selectedUrls.has(url)) cb.checked = true;
            cb.addEventListener('change', (e) => {
                if (e.target.checked) selectedUrls.add(url);
                else selectedUrls.delete(url);
                updateCounter();
            });
            cb.addEventListener('click', (e) => { e.stopImmediatePropagation(); e.stopPropagation(); });
            el.prepend(cb);
        });
        updateCounter();
    }

    function updateCounter() {
        const btn = document.getElementById('ig-dl-btn');
        // FIX: Prevent overwrite if downloading
        if (btn && !isDownloading) {
            btn.innerHTML = DOWNLOAD_ICON + `<span>Download (${selectedUrls.size})</span>`;
        }
        updatePanelVisibility();
        alignButtonWithVolume();
    }

    async function startDirectDownload() {
        if (selectedUrls.size === 0) return alert("You must make a choice!");
        if (isDownloading) return;
        isDownloading = true;
        const btn = document.getElementById('ig-dl-btn');
        const originalHtml = btn.innerHTML;
        const urls = Array.from(selectedUrls);
        let success = 0, fail = 0;
        for (let i = 0; i < urls.length; i++) {
            // STATUS: FETCHING
            btn.innerHTML = DOWNLOAD_ICON + `<span style="margin-left: 4px;">Fetching ${i + 1}/${urls.length}...</span>`;

            let pageUrl = urls[i];
            try {
                if (pageUrl.includes('/reel/')) pageUrl = pageUrl.replace('/reel/', '/p/');
                let videoUrls = await fetchFromTiooApi(pageUrl);
                if (videoUrls && videoUrls.length > 0) {
                    // STATUS: DOWNLOADING
                    btn.innerHTML = DOWNLOAD_ICON + `<span style="margin-left: 4px;">Downloading ${i + 1}/${urls.length}...</span>`;

                    videoUrls = filterUniqueUrls(videoUrls);
                    await downloadList(videoUrls, `post_${i+1}`);
                    success++;
                } else fail++;
            } catch (e) { fail++; console.error(e); }
            await new Promise(r => setTimeout(r, 800));
        }

        isDownloading = false;
        // Restore original text immediately
        btn.innerHTML = DOWNLOAD_ICON + `<span>Download (${selectedUrls.size})</span>`;
        alert(`Done!\nSuccess: ${success}\nError: ${fail}`);
    }

    function fetchFromTiooApi(igUrl) {
        return new Promise((resolve, reject) => {
            const fullApiUrl = `${API_URL}?url=${encodeURIComponent(igUrl)}`;
            GM_xmlhttpRequest({
                method: "GET", url: fullApiUrl, headers: { "Accept": "application/json" },
                onload: function(response) {
                    if (response.status !== 200) return resolve(null);
                    try {
                        const json = JSON.parse(response.responseText);
                        let results = [];
                        if (json.result && Array.isArray(json.result)) results = json.result.map(item => item.url).filter(u => u);
                        else if (Array.isArray(json)) results = json.map(item => item.url).filter(u => u);
                        else if (json.url) results.push(json.url);
                        resolve(results.length > 0 ? results : null);
                    } catch (e) { resolve(null); }
                }, onerror: () => reject("Network"), ontimeout: () => reject("Time")
            });
        });
    }

    function fetchFileBlob(fileUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: fileUrl, responseType: "blob",
                onload: (res) => res.status === 200 ? resolve(res.response) : reject(res.status), onerror: reject
            });
        });
    }

    function selectAllVisible() {
        document.querySelectorAll('.ig-extractor-checkbox').forEach(cb => {
            if (cb.offsetParent !== null && !cb.checked) {
                cb.checked = true;
                const anchor = cb.closest('a');
                if (anchor) selectedUrls.add(getCleanUrl(anchor));
            }
        });
        updateCounter();
    }
    function clearAll() {
        document.querySelectorAll('.ig-extractor-checkbox').forEach(cb => cb.checked = false);
        selectedUrls.clear();
        updateCounter();
    }

    setInterval(init, CHECK_INTERVAL);

})();