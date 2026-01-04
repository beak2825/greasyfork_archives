// ==UserScript==
// @name         Booru Image DL (w/ Zoom + Hotkey)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Downloader with bulk, hover zoom, search suggestions, folder selection, and "D" hotkey.
// @author       JohnPork
// @match        *://*.booru.org/*
// @connect      img.booru.org
// @connect      raw.githubusercontent.com
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557037/Booru%20Image%20DL%20%28w%20Zoom%20%2B%20Hotkey%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557037/Booru%20Image%20DL%20%28w%20Zoom%20%2B%20Hotkey%29.meta.js
// ==/UserScript==

/* globals jQuery */
(function () {
    "use strict";

    // --- Configuration ---
    const STORAGE_KEY_DOWNLOADED = "booruDownloader_downloaded_v1";
    const STORAGE_KEY_FOLDER = "booruDownloader_folder_path";
    const MAX_CONCURRENT = 2;
    const MAX_PREVIEW_HEIGHT = 600; // Max height of hover preview

    // --- Icons ---
    const ICON_DOWNLOAD = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>`;
    const ICON_LOADING = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor" class="booru-dl-spinner"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>`;
    const ICON_CHECK = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
    const ICON_SETTINGS = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`;

    let downloadedSet = loadDownloadedSet();
    let downloadFolder = GM_getValue(STORAGE_KEY_FOLDER, null);

    let queue = [];
    let active = 0;

    // Globals for Hover/Hotkey logic
    let zoomContainer = null;
    let zoomImage = null;
    let currentHoveredBtn = null; // Tracks which image is currently hovered

    // --- Persistence ---

    function loadDownloadedSet() {
        try {
            const raw = GM_getValue(STORAGE_KEY_DOWNLOADED, "[]");
            return new Set(JSON.parse(raw));
        } catch (e) {
            console.error("Booru downloader load error:", e);
        }
        return new Set();
    }

    function saveDownloadedSet() {
        const arr = Array.from(downloadedSet);
        try {
            GM_setValue(STORAGE_KEY_DOWNLOADED, JSON.stringify(arr));
        } catch (e) {
            console.error("Booru downloader save error:", e);
        }
    }

    // --- Folder Management ---

    function configureFolder() {
        const current = downloadFolder || "";
        const msg = "Enter a subfolder name to save images.\n\n" +
                    "NOTE: Due to browser security, this must be inside your default Downloads folder.\n" +
                    "Example: 'MyBooru' will save to 'Downloads/MyBooru/'\n\n" +
                    "Leave empty to save directly in Downloads.";

        let input = prompt(msg, current);
        if (input !== null) {
            input = input.replace(/^[/\\]+|[/\\]+$/g, '').trim();
            downloadFolder = input;
            GM_setValue(STORAGE_KEY_FOLDER, downloadFolder);
            alert(`Download folder set to: ${downloadFolder ? downloadFolder : "(Default Downloads)"}`);
        }
    }

    // --- URL Logic ---

    function getFullImageUrl(thumbUrl) {
        if (!thumbUrl) return null;
        try {
            const u = new URL(thumbUrl);
            u.hostname = "img.booru.org";
            let p = u.pathname;
            p = p.replace("/thumbnails//", "//images/");
            p = p.replace("/thumbnail_", "/");
            u.pathname = p;
            return u.toString();
        } catch (e) {
            console.error("Booru downloader could not convert URL:", thumbUrl, e);
            return null;
        }
    }

    function getImageKey(fullUrl) {
        try {
            const u = new URL(fullUrl);
            const file = (u.pathname.split("/").pop() || "").trim();
            if (!file) return fullUrl;
            return file.split(".")[0] || fullUrl;
        } catch (e) {
            return fullUrl;
        }
    }

    // --- Download Queue ---

    function isDownloaded(key) {
        return downloadedSet.has(key);
    }

    function markAsDownloaded(key) {
        downloadedSet.add(key);
        saveDownloadedSet();
    }

    function enqueueDownload(url, filename) {
        return new Promise((resolve, reject) => {
            queue.push({ url, filename, resolve, reject });
            processQueue();
        });
    }

    function processQueue() {
        if (active >= MAX_CONCURRENT) return;
        const job = queue.shift();
        if (!job) return;

        active++;
        startDownload(job.url, job.filename)
            .then(() => job.resolve())
            .catch(err => job.reject(err))
            .finally(() => {
                active--;
                processQueue();
            });
    }

    function startDownload(url, filename) {
        return new Promise((resolve, reject) => {
            let finalPath = filename;
            if (downloadFolder && downloadFolder.length > 0) {
                finalPath = `${downloadFolder}/${filename}`;
            }

            if (typeof GM_download === "function") {
                GM_download({
                    url,
                    name: finalPath,
                    saveAs: false,
                    onload: () => resolve(),
                    onerror: err => reject(err)
                });
            } else {
                try {
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    // --- Styles ---

    function injectStyles() {
        const css = `
        @keyframes booru-dl-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        span.thumb {
            position: relative;
            display: inline-block;
        }
        .booru-dl-topbar {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 1rem;
            padding: 8px 0;
            gap: 1rem;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .booru-dl-pill {
            font-family: inherit;
            font-size: 13px;
            padding: 8px 16px;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            background: linear-gradient(135deg, #111827, #020617);
            color: #e5e7eb;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 4px 14px rgba(15, 23, 42, 0.4);
            transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease, opacity 0.15s ease;
        }
        .booru-dl-pill:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.7);
            background: linear-gradient(135deg, #111827, #0f172a);
        }
        .booru-dl-pill:active {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(15, 23, 42, 0.7);
        }
        .booru-dl-pill[disabled] {
            cursor: default;
            opacity: 0.6;
            box-shadow: none;
            transform: none;
        }
        .booru-dl-bulk-count {
            font-size: 12px;
            opacity: 0.8;
            font-weight: 500;
        }
        .booru-dl-icon-btn {
            padding: 8px;
            border-radius: 50%;
        }
        .thumb .booru-dl-wrapper {
            position: absolute;
            top: 4px;
            right: 4px;
            z-index: 10;
        }
        .booru-dl-btn {
            width: 28px;
            height: 28px;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(15, 23, 42, 0.85);
            color: #e5e7eb;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(15, 23, 42, 0.6);
            transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
            padding: 0;
        }
        .booru-dl-btn:hover {
            box-shadow: 0 6px 16px rgba(15, 23, 42, 0.9);
            background: rgba(30, 41, 59, 0.95);
            transform: scale(1.1);
        }
        .booru-dl-btn:active {
            transform: scale(0.95);
            box-shadow: 0 1px 4px rgba(15, 23, 42, 0.8);
        }
        .booru-dl-btn[disabled] {
            cursor: default;
            opacity: 0.75;
            transform: none;
            box-shadow: 0 2px 8px rgba(15, 23, 42, 0.6);
        }
        .booru-dl-btn svg, .booru-dl-pill svg {
            width: 16px;
            height: 16px;
        }
        .booru-dl-btn .booru-dl-spinner {
            animation: booru-dl-spin 1s linear infinite;
        }
        .booru-dl-btn-downloading {
            background: rgba(55, 65, 81, 0.9);
        }
        .booru-dl-btn-downloaded {
            background: #16a34a;
            border-color: #16a34a;
            color: #ecfdf5;
        }
        .booru-zoom-container {
            position: fixed;
            max-width: 95vw;
            max-height: 95vh;
            padding: 6px;
            background: rgba(15, 23, 42, 0.96);
            border-radius: 8px;
            box-shadow: 0 18px 45px rgba(15, 23, 42, 0.95);
            display: none;
            z-index: 9999;
            pointer-events: none;
        }
        .booru-zoom-container img {
            display: block;
            max-width: 100%;
            max-height: ${MAX_PREVIEW_HEIGHT}px;
            width: auto;
            object-fit: contain;
        }
        `;
        GM_addStyle(css);
    }

    // --- Hover Zoom & Hotkey Tracking ---

    function ensureZoomElements() {
        if (zoomContainer && zoomImage) return;
        zoomContainer = document.createElement("div");
        zoomContainer.className = "booru-zoom-container";
        zoomImage = document.createElement("img");
        zoomContainer.appendChild(zoomImage);
        document.body.appendChild(zoomContainer);
    }

    function showZoom(fullUrl) {
        ensureZoomElements();
        zoomImage.src = fullUrl;
        zoomContainer.style.display = "block";
    }

    function updateZoomPosition(e) {
        if (!zoomContainer || zoomContainer.style.display === 'none') return;
        const x = e.clientX;
        const y = e.clientY;
        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        const offset = 15;

        zoomContainer.style.left = 'auto';
        zoomContainer.style.right = 'auto';
        zoomContainer.style.top = 'auto';
        zoomContainer.style.bottom = 'auto';
        zoomContainer.style.transform = 'none';

        if (x > vw / 2) zoomContainer.style.right = `${vw - x + offset}px`;
        else zoomContainer.style.left = `${x + offset}px`;

        if (y > vh / 2) zoomContainer.style.bottom = `${vh - y + offset}px`;
        else zoomContainer.style.top = `${y + offset}px`;
    }

    function hideZoom() {
        if (zoomContainer) {
            zoomContainer.style.display = "none";
            zoomImage.src = '';
        }
    }

    // --- Button Logic ---

    function setButtonDownloading(btn) {
        btn.disabled = true;
        btn.classList.remove("booru-dl-btn-download", "booru-dl-btn-downloaded");
        btn.classList.add("booru-dl-btn-downloading");
        btn.innerHTML = ICON_LOADING;
        btn.title = "Downloading";
    }

    function setButtonDownloaded(btn) {
        btn.disabled = true;
        btn.classList.remove("booru-dl-btn-download", "booru-dl-btn-downloading");
        btn.classList.add("booru-dl-btn-downloaded");
        btn.innerHTML = ICON_CHECK;
        btn.title = "Downloaded";
    }

    function setButtonReady(btn) {
        btn.disabled = false;
        btn.classList.remove("booru-dl-btn-downloading", "booru-dl-btn-downloaded");
        btn.classList.add("booru-dl-btn-download");
        btn.innerHTML = ICON_DOWNLOAD;
        btn.title = "Download image";
    }

    function triggerButtonDownload(btn) {
        if (!btn) return Promise.resolve();
        const fullUrl = btn.dataset.fullUrl;
        const key = btn.dataset.key;
        if (!fullUrl || !key) return Promise.resolve();

        if (isDownloaded(key)) {
            setButtonDownloaded(btn);
            return Promise.resolve();
        }

        const filename = fullUrl.split("/").pop() || (key + ".jpg");
        setButtonDownloading(btn);

        return enqueueDownload(fullUrl, filename)
            .then(() => {
                markAsDownloaded(key);
                setButtonDownloaded(btn);
            })
            .catch(err => {
                console.error("Download error:", err);
                setButtonReady(btn);
                btn.title = "Retry download";
            });
    }

    function setupThumb(img) {
        if (!img || img.dataset.booruDlAttached === "1") return;

        const fullUrl = getFullImageUrl(img.src);
        if (!fullUrl) return;
        const key = getImageKey(fullUrl);

        const spanThumb = img.closest("span.thumb");
        if (!spanThumb) return;

        let wrapper = spanThumb.querySelector(".booru-dl-wrapper");
        if (!wrapper) {
            wrapper = document.createElement("div");
            wrapper.className = "booru-dl-wrapper";
            spanThumb.appendChild(wrapper);
        }

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "booru-dl-btn booru-dl-btn-download";
        btn.dataset.fullUrl = fullUrl;
        btn.dataset.key = key;

        if (isDownloaded(key)) setButtonDownloaded(btn);
        else setButtonReady(btn);

        btn.addEventListener("click", function (e) {
            e.stopPropagation(); // Prevent navigating to image page
            if (btn.classList.contains("booru-dl-btn-downloaded")) return;
            triggerButtonDownload(btn);
        });

        wrapper.appendChild(btn);

        // --- Mouse Events (Zoom + Hotkey Tracking) ---
        img.addEventListener("mouseenter", function () {
            showZoom(fullUrl);
            currentHoveredBtn = btn; // Set current hover target for hotkey
        });
        img.addEventListener("mousemove", updateZoomPosition);
        img.addEventListener("mouseleave", function () {
            hideZoom();
            if (currentHoveredBtn === btn) {
                currentHoveredBtn = null; // Clear target
            }
        });

        img.dataset.booruDlAttached = "1";
    }

    // --- Toolbar ---

    function addToolbar(content) {
        if (!content || content.querySelector(".booru-dl-topbar")) return;

        const topbar = document.createElement("div");
        topbar.className = "booru-dl-topbar";

        const bulkBtn = document.createElement("button");
        bulkBtn.type = "button";
        bulkBtn.className = "booru-dl-pill";
        bulkBtn.textContent = "Download all on page";

        const countSpan = document.createElement("span");
        countSpan.className = "booru-dl-bulk-count";

        const settingsBtn = document.createElement("button");
        settingsBtn.type = "button";
        settingsBtn.className = "booru-dl-pill booru-dl-icon-btn";
        settingsBtn.innerHTML = ICON_SETTINGS;
        settingsBtn.title = "Set Download Folder";

        bulkBtn.addEventListener("click", function () { bulkDownloadVisible(bulkBtn, countSpan); });
        settingsBtn.addEventListener("click", function() { configureFolder(); });

        topbar.appendChild(bulkBtn);
        topbar.appendChild(settingsBtn);
        topbar.appendChild(countSpan);

        content.insertBefore(topbar, content.firstChild);
    }

    function bulkDownloadVisible(bulkBtn, countSpan) {
        const buttons = Array.from(document.querySelectorAll(".thumb .booru-dl-btn[data-key]"));
        const targets = buttons.filter(btn => !btn.classList.contains("booru-dl-btn-downloaded"));

        if (!targets.length) {
            countSpan.textContent = "All images already downloaded";
            return;
        }
        countSpan.textContent = "Queued " + targets.length + " images";
        bulkBtn.disabled = true;
        let remaining = targets.length;

        function updateText() {
            if (remaining <= 0) {
                bulkBtn.disabled = false;
                countSpan.textContent = "Bulk download finished";
            } else {
                countSpan.textContent = remaining + " remaining";
            }
        }

        targets.forEach(btn => {
            if (btn.dataset.booruDlBulkQueued === "1") return;
            btn.dataset.booruDlBulkQueued = "1";
            triggerButtonDownload(btn).finally(() => {
                remaining -= 1;
                updateText();
            });
        });
        updateText();
    }

    function observeThumbs(content) {
        if (!window.MutationObserver) return;
        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                for (let i = 0; i < m.addedNodes.length; i++) {
                    const node = m.addedNodes[i];
                    if (node.matches && node.matches("span.thumb img")) {
                        setupThumb(node);
                    } else if (node.querySelectorAll) {
                        const imgs = node.querySelectorAll("span.thumb img");
                        for (let j = 0; j < imgs.length; j++) {
                            setupThumb(imgs[j]);
                        }
                    }
                }
            });
        });
        observer.observe(content, { childList: true, subtree: true });
    }

    // --- Search Suggestions ---

    function initSearchSuggestions() {
        if (!window.location.hostname.includes('blacked.booru.org')) return;
        if (window.location.search.includes("page=post") && window.location.search.includes("s=add")) return;

        const tagInput = document.getElementById('stags') || document.getElementById('tags');
        if (!tagInput) return;

        const suggestionsDatalist = document.createElement('datalist');
        suggestionsDatalist.id = "datalist";
        const historyDatalist = document.createElement('datalist');
        historyDatalist.id = "history";

        const ul = document.querySelector('.space');
        if (ul) ul.append(suggestionsDatalist, historyDatalist);
        else document.body.append(suggestionsDatalist, historyDatalist);

        let allTags = [];
        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://raw.githubusercontent.com/Ankhanon/animated-octo-waffle/master/alltagsmarkedit.txt',
            onload: function(response) {
                if (response.status !== 200) return;
                allTags = response.responseText.match(/(?<=").*(?=")/g) || [];
            }
        });

        tagInput.setAttribute('list', "datalist");

        function appendOptions(arg, container) {
            const node = document.createElement("option");
            node.value = arg;
            container.appendChild(node);
        }

        tagInput.addEventListener("keyup", function(event) {
             const val = tagInput.value;
             if (val.length < 2) return;

             if (event.which == 32 && val.endsWith(', ')) {
                  appendOptions(val, historyDatalist);
                  let opts = [];
                  for(let i=0; i<historyDatalist.options.length; i++) opts.push(historyDatalist.options[i].value);
                  tagInput.placeholder = opts.join(" ");
                  tagInput.value = "";
                  return;
             }
             const match = val.match(/(?:.(?<!,|, ))+$/);
             if (!match) return;
             const currentWord = match[0].toLowerCase();

             suggestionsDatalist.innerHTML = "";
             let found = 0;
             for (let i = 0; i < allTags.length; i++) {
                 if (found >= 10) break;
                 if (allTags[i].toLowerCase().startsWith(currentWord)) {
                     appendOptions(allTags[i], suggestionsDatalist);
                     found++;
                 }
             }
        });
    }

    // --- Main Init ---

    function init() {
        const content = document.querySelector("div.content");
        if (!content) return;

        injectStyles();
        addToolbar(content);
        const thumbs = content.querySelectorAll("span.thumb img");
        thumbs.forEach(setupThumb);
        observeThumbs(content);
        initSearchSuggestions();

        if (downloadFolder === null) {
            setTimeout(configureFolder, 500);
        }

        // --- Hotkey Listener ---
        document.addEventListener("keydown", function(e) {
            // Check if key is "d" or "D"
            if (e.key === "d" || e.key === "D") {
                // Do not trigger if user is typing in an input field
                const activeTag = document.activeElement ? document.activeElement.tagName : "";
                if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;

                // Check if we are hovering a valid image
                if (currentHoveredBtn) {
                    // console.log("Hotkey download triggered for:", currentHoveredBtn.dataset.key);
                    triggerButtonDownload(currentHoveredBtn);
                }
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();