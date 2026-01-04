// ==UserScript==
// @name         Advanced Media Analyzer
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Finds all images/videos on a page (including CSS backgrounds and embedded media) and displays them in a feature-rich, draggable panel with advanced filtering, sorting, and settings.
// @author       Gemini
// @match        *://*/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @downloadURL https://update.greasyfork.org/scripts/550986/Advanced%20Media%20Analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/550986/Advanced%20Media%20Analyzer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let allMediaData = []; // Holds all found media to allow re-sorting/filtering
    let originalElements = new Map(); // Maps a media src to its original DOM element for highlighting
    const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.ogv', '.m4v', '.mpeg'];

    // --- Settings Configuration ---
    let settings = {
        showToolbar: true,
        showBulkActions: true,
        enableHoverHighlight: true,
        scanCssBackgrounds: true
    };

    const SETTINGS_KEY = 'mediaAnalyzerSettings';

    function saveSettings() {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    function loadSettings() {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
            settings = { ...settings, ...JSON.parse(saved) };
        }
    }
    // --- End of Settings ---


    /**
     * Initializes and injects the floating "Analyze Media" button onto the page.
     */
    function initFloatingButton() {
        const button = document.createElement('button');
        button.id = 'media-sorter-trigger-button';
        button.innerHTML = `
            <svg style="width:18px;height:18px;margin-right:8px;" viewBox="0 0 24 24">
                <path fill="currentColor" d="M10 12L12 14L14 12L10 12M10 8L12 10L14 8L10 8M10 16L12 18L14 16L10 16M21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3M21 19H3V5H21V19Z" />
            </svg>
            Analyze Media
        `;
        button.addEventListener('click', createSortedMediaPanel);
        document.body.appendChild(button);
    }

    /**
     * Formats bytes into a human-readable string.
     */
    function formatBytes(bytes, decimals = 2) {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     * Parses a file size string (e.g., "1.5 MB") into bytes.
     */
    function parseSizeString(sizeStr) {
        if (!sizeStr) return null;
        const cleanedStr = sizeStr.trim().toUpperCase();
        const parts = cleanedStr.match(/^([\d.]+)\s*([KMGT]?B)$/);
        if (!parts) return null;
        const value = parseFloat(parts[1]);
        const unit = parts[2];
        let multiplier = 1;
        switch (unit) {
            case 'KB': multiplier = 1024; break;
            case 'MB': multiplier = 1024 ** 2; break;
            case 'GB': multiplier = 1024 ** 3; break;
            case 'TB': multiplier = 1024 ** 4; break;
        }
        return Math.round(value * multiplier);
    }

    /**
     * Determines if a media item is an image or video based on its URL.
     * This is more robust as it ignores the element type (e.g. an <img> for a video thumbnail).
     */
    function getMediaType(src) {
        try {
            // Use URL object to ignore query strings/fragments when checking extension
            const lowerPath = new URL(src, document.baseURI).pathname.toLowerCase();
            for (const ext of VIDEO_EXTENSIONS) {
                if (lowerPath.endsWith(ext)) return 'video';
            }
        } catch (e) {
            // Fallback for data URIs or invalid URLs
            const lowerSrc = src.toLowerCase();
            for (const ext of VIDEO_EXTENSIONS) {
                 if (lowerSrc.includes(ext)) return 'video';
            }
        }
        return 'image';
    }


    /**
     * Builds the main UI panel and initiates the media scan.
     */
    function createSortedMediaPanel() {
        if (document.getElementById('media-sorter-panel')) {
            document.getElementById('media-sorter-panel').remove();
        }

        const panel = document.createElement('div');
        panel.id = 'media-sorter-panel';
        panel.innerHTML = `
            <div class="media-sorter-header">
                 <h2 id="media-sorter-title">Analyzing Media...</h2>
                <div>
                    <button id="media-sorter-settings-btn" class="header-icon-btn" title="Settings">
                        <svg viewBox="0 0 24 24" style="width:20px;height:20px;"><path fill="currentColor" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.25C8.66,5.49,8.13,5.81,7.63,6.19L5.24,5.23C5.02,5.16,4.77,5.23,4.65,5.45L2.73,8.77 c-0.11,0.2-0.06,0.47,0.12,0.61l2.03,1.58C4.82,11.36,4.8,11.68,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.44 c0.04,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.44c0.59-0.24,1.12-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0.01,0.59-0.22l1.92-3.32c0.11-0.2,0.06-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>
                    </button>
                    <button id="media-sorter-close" class="header-icon-btn" title="Close panel">&times;</button>
                </div>
            </div>
            <div class="media-sorter-toolbar" ${settings.showToolbar ? '' : 'style="display:none;"'}>
                <select id="media-filter-type">
                    <option value="all">All Media</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                </select>
                <select id="media-sort-by">
                    <option value="size_desc">Sort by Size (Largest)</option>
                    <option value="size_asc">Sort by Size (Smallest)</option>
                    <option value="url_asc">Sort by URL (A-Z)</option>
                </select>
            </div>
            <div id="media-sorter-list"><div class="media-sorter-loader"></div></div>
             <div class="media-sorter-footer" ${settings.showBulkActions ? '' : 'style="display:none;"'}>
                <button id="copy-all-urls">Copy All URLs</button>
                <button id="download-all-urls">Download URLs as .txt</button>
            </div>
        `;
        document.body.appendChild(panel);
        makeDraggable(panel);

        panel.querySelector('#media-sorter-close').addEventListener('click', () => panel.remove());
        panel.querySelector('#media-sorter-settings-btn').addEventListener('click', createSettingsPanel);
        panel.querySelector('#media-filter-type').addEventListener('change', renderMediaList);
        panel.querySelector('#media-sort-by').addEventListener('change', renderMediaList);
        panel.querySelector('#copy-all-urls').addEventListener('click', copyAllUrls);
        panel.querySelector('#download-all-urls').addEventListener('click', downloadAllUrls);

        setTimeout(scanAndPopulateMedia, 100);
    }

     /**
     * Builds and displays the settings panel.
     */
    function createSettingsPanel() {
        if (document.getElementById('media-sorter-settings-panel')) return;

        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'media-sorter-settings-panel';
        settingsPanel.innerHTML = `
            <div class="media-settings-content">
                <h3>Settings</h3>
                <label><input type="checkbox" data-setting="showToolbar" ${settings.showToolbar ? 'checked' : ''}> Show Filter/Sort Toolbar</label>
                <label><input type="checkbox" data-setting="showBulkActions" ${settings.showBulkActions ? 'checked' : ''}> Show Bulk Actions Footer</label>
                <label><input type="checkbox" data-setting="enableHoverHighlight" ${settings.enableHoverHighlight ? 'checked' : ''}> Enable Hover to Highlight</label>
                <label><input type="checkbox" data-setting="scanCssBackgrounds" ${settings.scanCssBackgrounds ? 'checked' : ''}> Scan for CSS Background Images</label>
                <button id="settings-close-btn">Close</button>
            </div>
        `;
        document.getElementById('media-sorter-panel').appendChild(settingsPanel);

        settingsPanel.querySelector('#settings-close-btn').addEventListener('click', () => settingsPanel.remove());
        settingsPanel.addEventListener('change', e => {
            if (e.target.type === 'checkbox') {
                const key = e.target.dataset.setting;
                const value = e.target.checked;
                settings[key] = value;
                saveSettings();
                // Dynamically update UI based on new setting
                const mainPanel = document.getElementById('media-sorter-panel');
                if (key === 'showToolbar') mainPanel.querySelector('.media-sorter-toolbar').style.display = value ? 'flex' : 'none';
                if (key === 'showBulkActions') mainPanel.querySelector('.media-sorter-footer').style.display = value ? 'flex' : 'none';
                if (key === 'scanCssBackgrounds') { // Offer to rescan
                    e.target.closest('label').innerHTML += ' <small>(<a href="#" id="rescan-link">Rescan page</a>)</small>';
                    document.getElementById('rescan-link').onclick = (evt) => {
                        evt.preventDefault();
                        mainPanel.querySelector('#media-sorter-list').innerHTML = '<div class="media-sorter-loader"></div>';
                        setTimeout(scanAndPopulateMedia, 100);
                        settingsPanel.remove();
                    };
                }
                renderMediaList();
            }
        });
    }

    /**
     * Scans the page for all types of media and then triggers the initial render.
     */
    function scanAndPopulateMedia() {
        allMediaData = [];
        originalElements.clear();
        const processedSources = new Set();
        const resourceMap = new Map(performance.getEntriesByType('resource').map(res => [res.name, res.encodedBodySize]));

        scanAttachmentLists(processedSources);
        scanHtmlTags(processedSources, resourceMap);
        if (settings.scanCssBackgrounds) {
            scanCssBackgrounds(processedSources, resourceMap);
        }

        renderMediaList();
    }

    /**
     * Renders the list of media items based on current filter and sort settings.
     */
    function renderMediaList() {
        const panel = document.getElementById('media-sorter-panel');
        if (!panel) return;

        const listContainer = panel.querySelector('#media-sorter-list');
        const titleElement = panel.querySelector('#media-sorter-title');
        const filterValue = panel.querySelector('#media-filter-type').value;
        const sortValue = panel.querySelector('#media-sort-by').value;

        let filteredData = allMediaData;
        if (filterValue !== 'all') {
            filteredData = allMediaData.filter(item => item.type === filterValue);
        }

        switch (sortValue) {
            case 'size_desc': filteredData.sort((a, b) => b.size - a.size); break;
            case 'size_asc': filteredData.sort((a, b) => a.size - b.size); break;
            case 'url_asc': filteredData.sort((a, b) => a.src.localeCompare(b.src)); break;
        }

        titleElement.textContent = `Media Analyzer (${filteredData.length} items)`;
        listContainer.innerHTML = '';

        if (filteredData.length > 0) {
            filteredData.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'media-sorter-item';
                itemDiv.dataset.src = item.src;

                const preview = item.previewElement.cloneNode(true);
                preview.style.width = '100px';
                preview.style.height = '100px';
                preview.style.objectFit = 'contain';
                if (preview.tagName === 'VIDEO') {
                   preview.muted = true;
                }


                const infoDiv = document.createElement('div');
                infoDiv.className = 'media-sorter-info';
                infoDiv.innerHTML = `
                    <p><strong>Size:</strong> ${formatBytes(item.size)}</p>
                    <div class="media-source-container">
                        <p><strong>Source:</strong> <a href="${item.src}" target="_blank" rel="noopener noreferrer" title="${item.src}">${item.src}</a></p>
                        ${item.src !== 'Embedded Data URI' ? '<button class="copy-src-button" title="Copy URL">Copy</button>' : ''}
                    </div>
                `;
                itemDiv.appendChild(preview);
                itemDiv.appendChild(infoDiv);
                listContainer.appendChild(itemDiv);

                if (settings.enableHoverHighlight && originalElements.has(item.src)) {
                    itemDiv.addEventListener('mouseenter', () => addHighlight(item.src));
                    itemDiv.addEventListener('mouseleave', () => removeHighlight(item.src));
                }
            });
        } else {
            listContainer.innerHTML = '<p class="media-sorter-empty">No media matching the current filter was found.</p>';
        }

        panel.querySelectorAll('.copy-src-button').forEach(button => {
            button.addEventListener('click', e => {
                const url = e.target.closest('.media-source-container').querySelector('a').href;
                navigator.clipboard.writeText(url).then(() => {
                    e.target.textContent = 'Copied!';
                    setTimeout(() => { e.target.textContent = 'Copy'; }, 2000);
                });
            });
        });
    }

    /**
     * Scans for media within custom attachment list structures.
     */
    function scanAttachmentLists(processedSources) {
        document.querySelectorAll('.attachmentList > li, .attachmentList-item').forEach(item => {
            const metaEl = item.querySelector('.file-meta');
            const previewLink = item.querySelector('a.file-preview[href]');

            // This is the essential check. We need a link and file metadata.
            if (previewLink && metaEl) {
                const src = new URL(previewLink.getAttribute('href'), document.baseURI).href;
                if (src && !processedSources.has(src)) {
                    const size = parseSizeString(metaEl.innerText);
                    if (size !== null) {
                        let previewElement;
                        const thumbnailEl = item.querySelector('img');
                        const mediaType = getMediaType(src);
                        const elementToHighlight = previewLink; // The link is always the best element to highlight

                        if (thumbnailEl) {
                            // If there's a thumbnail, use it for the preview.
                            previewElement = thumbnailEl;
                        } else if (mediaType === 'video') {
                            // If no thumbnail but it's a video, create a video element for the preview.
                            const videoPreview = document.createElement('video');
                            videoPreview.src = src;
                            previewElement = videoPreview;
                        } else {
                            // Fallback for non-video items without a thumbnail (e.g., zip files).
                            // We can skip these as this tool focuses on visual media.
                            return;
                        }

                        allMediaData.push({
                            previewElement: previewElement,
                            src: src,
                            size: size,
                            type: mediaType
                        });
                        originalElements.set(src, elementToHighlight);
                        processedSources.add(src);
                    }
                }
            }
        });
    }

    /**
     * Scans for standard <img> and embedded <video> tags on the page.
     */
    function scanHtmlTags(processedSources, resourceMap) {
        // Find all images not already processed in attachment lists
        document.querySelectorAll('img').forEach(el => {
            const src = el.currentSrc || el.src;
            if (src && !processedSources.has(src)) {
                let size = 0;
                let finalSrc = src;
                if (src.startsWith('data:')) {
                    const base64Data = src.split(',')[1];
                    if (base64Data) size = base64Data.length * 0.75;
                    finalSrc = 'Embedded Data URI';
                } else if (resourceMap.has(src)) {
                    size = resourceMap.get(src);
                }

                if (size > 0) {
                    allMediaData.push({ previewElement: el, src: finalSrc, size, type: getMediaType(finalSrc) });
                    if (finalSrc !== 'Embedded Data URI') {
                        originalElements.set(finalSrc, el);
                    }
                }
                processedSources.add(src);
            }
        });

        // Find all videos, which might be embedded differently
        document.querySelectorAll('video').forEach(el => {
            const sourceEl = el.querySelector('source');
            const src = el.src || (sourceEl ? sourceEl.src : null);
            const fullSrc = src ? new URL(src, document.baseURI).href : null;

            if (fullSrc && !processedSources.has(fullSrc)) {
                const size = resourceMap.get(fullSrc) || 0;
                // We list videos even if size isn't in resourceMap, as they are important
                 allMediaData.push({ previewElement: el, src: fullSrc, size, type: 'video' });
                 originalElements.set(fullSrc, el); // Highlight the video player itself
                 processedSources.add(fullSrc);
            }
        });
    }

    /**
     * Scans CSS rules for background-image properties.
     */
    function scanCssBackgrounds(processedSources, resourceMap) {
        const urlRegex = /url\(['"]?(.*?)['"]?\)/;
        for (const sheet of document.styleSheets) {
            try {
                if (sheet.cssRules) {
                    for (const rule of sheet.cssRules) {
                        if (rule.style && rule.style.backgroundImage && rule.style.backgroundImage.includes('url')) {
                             const matches = rule.style.backgroundImage.matchAll(new RegExp(urlRegex.source, 'g'));
                             for (const match of matches) {
                                if (match && match[1]) {
                                    const url = new URL(match[1], document.baseURI).href;
                                    if (url && !processedSources.has(url) && resourceMap.has(url)) {
                                        const size = resourceMap.get(url);
                                        if (size > 0) {
                                            const img = new Image();
                                            img.src = url;
                                            allMediaData.push({ previewElement: img, src: url, size, type: getMediaType(url) });
                                            processedSources.add(url);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                // Ignore cross-origin stylesheet errors
            }
        }
    }


    /**
     * Highlights the corresponding element on the page.
     */
    function addHighlight(src) {
        const el = originalElements.get(src);
        if (el && typeof el.getBoundingClientRect === 'function') {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('media-sorter-highlight');
        }
    }

    /**
     * Removes the highlight from the element on the page.
     */
    function removeHighlight(src) {
        const el = originalElements.get(src);
        if (el && typeof el.getBoundingClientRect === 'function') {
            el.classList.remove('media-sorter-highlight');
        }
    }

    /**
     * Copies all currently filtered URLs to the clipboard.
     */
    function copyAllUrls() {
        const panel = document.getElementById('media-sorter-panel');
        const button = document.getElementById('copy-all-urls');
        if (!panel || !button) return;

        const urls = Array.from(panel.querySelectorAll('.media-sorter-item a'))
            .map(a => a.href)
            .join('\n');

        if (urls) {
            navigator.clipboard.writeText(urls).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => { button.textContent = 'Copy All URLs'; }, 2000);
            });
        }
    }

    /**
     * Downloads all currently filtered URLs as a text file.
     */
    function downloadAllUrls() {
        const panel = document.getElementById('media-sorter-panel');
        if (!panel) return;

        const urls = Array.from(panel.querySelectorAll('.media-sorter-item a'))
            .map(a => a.href)
            .join('\n');

        if (urls) {
            const blob = new Blob([urls], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `media_urls_${document.domain}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    /**
     * Makes the panel draggable.
     */
    function makeDraggable(panel) {
        const header = panel.querySelector('.media-sorter-header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = (e) => {
            // prevent dragging when clicking on a button
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };
        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            panel.style.top = (panel.offsetTop - pos2) + "px";
            panel.style.left = (panel.offsetLeft - pos1) + "px";
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    /**
     * Injects all CSS styles.
     */
    function addPanelStyles() {
        GM_addStyle(`
            #media-sorter-trigger-button {
                position: fixed; bottom: 20px; right: 20px; z-index: 999998;
                background-color: #007bff; color: white; border: none;
                border-radius: 8px; padding: 10px 15px; font-size: 14px; font-weight: 500;
                cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.2s ease-in-out; display: flex; align-items: center;
            }
            #media-sorter-trigger-button:hover {
                transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.2); background-color: #0069d9;
            }
            #media-sorter-panel {
                position: fixed; top: 40px; right: 40px; width: 600px; max-width: 90vw; height: 85vh;
                background-color: rgba(250, 250, 250, 0.95); border: 1px solid #ccc;
                border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.2);
                z-index: 999999; display: flex; flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                color: #333; backdrop-filter: blur(10px); resize: both; overflow: hidden;
            }
            .media-sorter-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 12px 20px; border-bottom: 1px solid #ddd;
                cursor: move; user-select: none; background-color: rgba(255,255,255,0.7);
            }
            #media-sorter-title { margin: 0; font-size: 18px; font-weight: 600; flex-grow: 1; }
            .header-icon-btn { background: none; border: none; font-size: 28px; cursor: pointer; color: #888; padding: 0 5px; }
            .header-icon-btn:hover { color: #000; }
            #media-sorter-settings-btn svg { vertical-align: middle; }
            .media-sorter-toolbar {
                padding: 10px; display: flex; gap: 10px; border-bottom: 1px solid #ddd; background: #f8f9fa;
            }
            .media-sorter-toolbar select { padding: 8px; border: 1px solid #ccc; border-radius: 5px; flex-grow: 1; }
            #media-sorter-list { overflow-y: auto; padding: 10px; flex-grow: 1; }
            .media-sorter-item {
                display: flex; align-items: flex-start; border-bottom: 1px solid #eee; padding: 15px 10px; transition: background-color 0.2s;
            }
            .media-sorter-item:hover { background-color: rgba(0, 123, 255, 0.05); }
            .media-sorter-info { margin-left: 15px; flex-grow: 1; min-width: 0; }
            .media-sorter-info p { margin: 0 0 8px 0; font-size: 13px; word-break: break-all; }
            .media-sorter-info strong { color: #000; }
            .media-source-container { display: flex; align-items: center; justify-content: space-between; }
            .media-source-container a { color: #007bff; text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .media-source-container a:hover { text-decoration: underline; }
            .copy-src-button {
                margin-left: 10px; padding: 3px 8px; font-size: 12px;
                border: 1px solid #ccc; background-color: #f0f0f0; border-radius: 5px; cursor: pointer;
            }
            .copy-src-button:hover { background-color: #e0e0e0; }
            .media-sorter-footer { padding: 10px; display: flex; gap: 10px; border-top: 1px solid #ddd; background: #f8f9fa; }
            .media-sorter-footer button {
                padding: 8px 12px; border: 1px solid #007bff; background-color: transparent; color: #007bff;
                border-radius: 5px; cursor: pointer; transition: all 0.2s; flex-grow: 1;
            }
            .media-sorter-footer button:hover { background-color: #007bff; color: white; }
            .media-sorter-empty, .media-sorter-loader { text-align: center; color: #777; margin-top: 40px; }
            .media-sorter-loader {
                border: 5px solid #f3f3f3; border-top: 5px solid #3498db;
                border-radius: 50%; width: 40px; height: 40px;
                animation: spin 1s linear infinite; margin: 40px auto;
            }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .media-sorter-highlight {
                outline: 3px solid #007bff !important;
                box-shadow: 0 0 20px rgba(0, 123, 255, 0.8) !important;
                transition: outline 0.2s ease, box-shadow 0.2s ease;
            }
            #media-sorter-settings-panel {
                position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                background-color: rgba(250, 250, 250, 0.98);
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .media-settings-content {
                background-color: white; padding: 25px; border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                display: flex; flex-direction: column; gap: 15px;
            }
            .media-settings-content h3 { margin: 0 0 10px; }
            .media-settings-content label { display: block; font-size: 14px; cursor: pointer; }
            .media-settings-content input { margin-right: 8px; }
            #settings-close-btn {
                margin-top: 10px; padding: 10px; background-color: #007bff; color: white;
                border: none; border-radius: 5px; cursor: pointer;
            }
        `);
    }

    // --- Script Initialization ---
    loadSettings();
    initFloatingButton();
    addPanelStyles();
})();


