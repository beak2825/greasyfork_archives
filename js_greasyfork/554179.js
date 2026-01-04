// ==UserScript==
// @name         Suno/Udio Media Extractor (Enhanced UI + Downloads)
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Extracts title, audio, and video links from Suno.com/song and Udio.com/songs with a Material UI, state saving, OG/Twitter meta listing, and MP3/MP4 download buttons using a Windows-safe title filename.
// @author       Graph1ks + GPT
// @match        https://suno.com/song/*
// @match        https://www.udio.com/songs/*
// @match        https://www.riffusion.com/song/*
// @grant        GM_addStyle
// @grant        GM_download
// @homepageURL  https://github.com/YourUsername/SunoUdioMediaExtractor
// @supportURL   https://github.com/YourUsername/SunoUdioMediaExtractor/issues
// @downloadURL https://update.greasyfork.org/scripts/554179/SunoUdio%20Media%20Extractor%20%28Enhanced%20UI%20%2B%20Downloads%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554179/SunoUdio%20Media%20Extractor%20%28Enhanced%20UI%20%2B%20Downloads%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // SVG icons
    const ICON_INFO_OUTLINE = '<svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>';
    const ICON_CLOSE = '<svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

    GM_addStyle(`
        #media-extractor-ui { position: fixed; top: 100px; right: 20px; z-index: 99999; background-color: #212121; color: #e0e0e0; padding: 15px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,.4); font-family: 'Roboto','Segoe UI',sans-serif; width: 1200px; transition: transform .3s ease-out, opacity .3s ease-out; transform: translateX(100%); opacity: 0; }
        #media-extractor-ui.open { transform: translateX(0); opacity: 1; }
        #media-extractor-toggle { position: fixed; top: 100px; right: 20px; z-index: 100000; background-color: #6200ee; color: white; border: none; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,.26); transition: background-color .3s, box-shadow .3s; }
        #media-extractor-toggle:hover { background-color: #7b1fa2; box-shadow: 0 4px 10px rgba(0,0,0,.3); }
        #media-extractor-ui h3 { margin: 0 0 10px; color: #bb86fc; font-size: 1.2em; }
        #media-extractor-ui .info-item { display: flex; align-items: flex-start; margin-bottom: 10px; gap: 10px; }
        #media-extractor-ui .info-item label { font-weight: bold; min-width: 60px; margin-right: 10px; flex-shrink: 0; padding-top: 4px; }
        #media-extractor-ui .info-item .content { flex-grow: 1; word-break: break-all; background-color: #333; padding: 4px 8px; border-radius: 4px; font-size: .9em; line-height: 1.4; user-select: text; min-height: 24px; display: flex; align-items: center; }
        #media-extractor-ui .info-item button.copy-btn { background-color: #03dac6; color: #212121; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: .8em; text-transform: uppercase; font-weight: bold; flex-shrink: 0; }
        #media-extractor-ui button.copy-btn:disabled { background-color: #555; cursor: not-allowed; opacity: .7; }
        #media-extractor-ui button.copy-btn:hover:not(:disabled) { background-color: #00bfa5; box-shadow: 0 1px 3px rgba(0,0,0,.3); }

        /* New download buttons */
        #media-extractor-ui .info-item button.download-btn { background-color: #ffb300; color: #212121; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: .8em; text-transform: uppercase; font-weight: bold; flex-shrink: 0; }
        #media-extractor-ui .info-item button.download-btn:hover { background-color: #ffa000; box-shadow: 0 1px 3px rgba(0,0,0,.3); }

        #media-extractor-ui .status { margin-top: 15px; font-size: .9em; font-style: italic; color: #a0a0a0; }
        #media-extractor-ui .meta-tags-section { margin-top: 15px; border-top: 1px solid #444; padding-top: 10px; display: flex; gap: 20px; }
        #media-extractor-ui .meta-column { flex: 1; min-width: 0; }
        #media-extractor-ui .meta-tags-section h4 { margin: 0 0 8px; color: #bb86fc; font-size: 1em; }
        #media-extractor-ui .meta-tag { display: flex; align-items: flex-start; margin-bottom: 5px; background-color: #333; padding: 4px 8px; border-radius: 4px; color: #ccc; line-height: 1.4; gap: 8px; }
        #media-extractor-ui .meta-tag strong { color: #03dac6; margin-right: 5px; flex-shrink: 0; font-size: .9em; padding-top: 2px; }
        #media-extractor-ui .meta-tag .meta-value { flex-grow: 1; word-break: break-all; user-select: text; font-size: .9em; padding-top: 2px; }
        #media-extractor-ui .meta-tag button.copy-btn { background-color: #03dac6; color: #212121; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: .7em; text-transform: uppercase; font-weight: bold; flex-shrink: 0; min-width: unset; }
    `);

    const UI_CONTAINER_ID = 'media-extractor-ui';
    const UI_TOGGLE_BUTTON_ID = 'media-extractor-toggle';
    const LOCAL_STORAGE_KEY = 'mediaExtractorUIOpen';

    let lastExtractedData = null; // keep latest extracted for download naming

    const uiContainer = document.createElement('div');
    uiContainer.id = UI_CONTAINER_ID;
    document.body.appendChild(uiContainer);

    const toggleButton = document.createElement('button');
    toggleButton.id = UI_TOGGLE_BUTTON_ID;
    document.body.appendChild(toggleButton);

    let isOpen = localStorage.getItem(LOCAL_STORAGE_KEY) === 'true';
    if (isOpen) {
        uiContainer.classList.add('open');
        toggleButton.innerHTML = ICON_CLOSE;
        toggleButton.title = 'Hide Song Info';
    } else {
        uiContainer.classList.remove('open');
        toggleButton.innerHTML = ICON_INFO_OUTLINE;
        toggleButton.title = 'Show Song Info';
    }

    toggleButton.addEventListener('click', () => {
        isOpen = !isOpen;
        uiContainer.classList.toggle('open', isOpen);
        toggleButton.innerHTML = isOpen ? ICON_CLOSE : ICON_INFO_OUTLINE;
        toggleButton.title = isOpen ? 'Hide Song Info' : 'Show Song Info';
        localStorage.setItem(LOCAL_STORAGE_KEY, isOpen.toString());
        if (isOpen) {
            updateUI('Searching...', {});
            setTimeout(findMediaLinks, 100);
        }
    });

    // Windows filename sanitizer: strips illegal/reserved characters, emoji, controls, trims, avoids reserved device names
    function sanitizeForWindows(name, replacement = ' ') {
        try {
            if (!name) return 'download';
            let s = name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
            // Remove emoji/pictographs (SMP), dingbats, misc symbols, variation selectors
            s = s.replace(/[\u{1F000}-\u{1FFFF}\u2600-\u26FF\u2700-\u27BF\uFE0E\uFE0F]/gu, '');
            // Remove Windows-forbidden chars and control chars 0-31
            s = s.replace(/[<>:"/\\|?*\x00-\x1F]/g, replacement);
            // Collapse whitespace
            s = s.replace(/\s+/g, ' ').trim();
            // Remove trailing spaces/dots
            s = s.replace(/[ .]+$/g, '');
            if (!s) s = 'download';
            // Length guard
            s = s.slice(0, 180);
            // Avoid reserved device names
            const reserved = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
            if (reserved.test(s)) s = '_' + s;
            return s;
        } catch {
            return 'download';
        }
    }

    function defaultFilename(ext) {
        const title = (lastExtractedData && lastExtractedData.title) || document.title || 'download';
        return `${sanitizeForWindows(title)}.${ext}`;
    }

    function startDownload(fileUrl, ext) {
        const name = defaultFilename(ext);
        if (typeof GM_download === 'function') {
            try {
                GM_download({
                    url: fileUrl,
                    name,
                    saveAs: true,
                    onerror: (e) => alert('Download failed: ' + (e && (e.error || e.details) || 'unknown')),
                });
            } catch (e) {
                anchorFallback(fileUrl, name);
            }
        } else {
            anchorFallback(fileUrl, name);
        }
    }

    function anchorFallback(fileUrl, suggestedName) {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = suggestedName;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    function updateUI(statusText, data = {}) {
        lastExtractedData = data || null;
        uiContainer.innerHTML = '';

        let contentHtml = '<h3>Media Links</h3>';

        const items = [
            { key: 'title', label: 'Title', value: data.title },
            { key: 'audio', label: 'Audio', value: data.audioLink },
            { key: 'video', label: 'Video', value: data.videoLink },
        ];

        items.forEach(item => {
            const hasValue = item.value && String(item.value).trim() !== '';
            const titleAttr = hasValue ? String(item.value) : 'N/A';
            const copyData = hasValue ? String(item.value) : '';
            const isAudio = item.key === 'audio';
            const isVideo = item.key === 'video';
            const downloadBtn = (isAudio || isVideo) && hasValue
                ? `<button class="download-btn" data-link="${copyData}" data-ext="${isAudio ? 'mp3' : 'mp4'}">Download ${isAudio ? 'MP3' : 'MP4'}</button>`
                : '';
            contentHtml += `
                <div class="info-item">
                    <label>${item.label}:</label>
                    <span class="content" title="${titleAttr}">${hasValue ? titleAttr : 'N/A'}</span>
                    <button class="copy-btn" data-copy="${copyData}" ${hasValue ? '' : 'disabled'}>Copy</button>
                    ${downloadBtn}
                </div>
            `;
        });

        const ogMetaTags = {};
        const twitterMetaTags = {};
        if (data.metaTags) {
            for (const [key, value] of Object.entries(data.metaTags)) {
                if (key.startsWith('og:')) ogMetaTags[key] = value;
                else if (key.startsWith('twitter:')) twitterMetaTags[key] = value;
            }
        }

        if (Object.keys(ogMetaTags).length > 0 || Object.keys(twitterMetaTags).length > 0) {
            contentHtml += `<div class="meta-tags-section">`;
            contentHtml += `<div class="meta-column"><h4>Open Graph Tags:</h4>`;
            const sortedOgKeys = Object.keys(ogMetaTags).sort();
            if (sortedOgKeys.length > 0) {
                sortedOgKeys.forEach(key => {
                    const value = ogMetaTags[key];
                    const hasValue = value && String(value).trim() !== '';
                    const val = hasValue ? String(value) : '';
                    contentHtml += `
                        <div class="meta-tag">
                            <strong>${key}:</strong>
                            <span class="meta-value" title="${hasValue ? val : 'N/A'}">${hasValue ? val : 'N/A'}</span>
                            <button class="copy-btn" data-copy="${hasValue ? val : ''}" ${hasValue ? '' : 'disabled'}>Copy</button>
                        </div>
                    `;
                });
            } else {
                contentHtml += `<div class="meta-tag"><span class="meta-value">No Open Graph tags found.</span></div>`;
            }
            contentHtml += `</div>`;
            contentHtml += `<div class="meta-column"><h4>Twitter Tags:</h4>`;
            const sortedTwitterKeys = Object.keys(twitterMetaTags).sort();
            if (sortedTwitterKeys.length > 0) {
                sortedTwitterKeys.forEach(key => {
                    const value = twitterMetaTags[key];
                    const hasValue = value && String(value).trim() !== '';
                    const val = hasValue ? String(value) : '';
                    contentHtml += `
                        <div class="meta-tag">
                            <strong>${key}:</strong>
                            <span class="meta-value" title="${hasValue ? val : 'N/A'}">${hasValue ? val : 'N/A'}</span>
                            <button class="copy-btn" data-copy="${hasValue ? val : ''}" ${hasValue ? '' : 'disabled'}>Copy</button>
                        </div>
                    `;
                });
            } else {
                contentHtml += `<div class="meta-tag"><span class="meta-value">No Twitter tags found.</span></div>`;
            }
            contentHtml += `</div>`;
            contentHtml += `</div>`;
        } else {
            contentHtml += `<div class="meta-tags-section"><p class="status">No Open Graph or Twitter meta tags found.</p></div>`;
        }

        contentHtml += `<p class="status">${statusText}</p>`;
        uiContainer.innerHTML = contentHtml;

        // Copy buttons
        uiContainer.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const textToCopy = event.currentTarget.dataset.copy || '';
                if (textToCopy) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        const originalText = button.textContent;
                        button.textContent = 'Copied!';
                        setTimeout(() => { button.textContent = originalText; }, 1500);
                    }).catch(err => {
                        console.error('Failed to copy:', err);
                        alert('Failed to copy text. Please try again or copy manually.');
                    });
                }
            });
        });

        // Download buttons
        uiContainer.querySelectorAll('.download-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const btn = event.currentTarget;
                const url = btn.getAttribute('data-link');
                const ext = btn.getAttribute('data-ext') || 'bin';
                if (url) {
                    startDownload(url, ext);
                }
            });
        });
    }

    function findMediaLinks() {
        const url = window.location.href;
        const extractedData = {
            title: null,
            audioLink: null,
            videoLink: null,
            metaTags: {}
        };

        document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(meta => {
            const property = meta.getAttribute('property') || meta.getAttribute('name');
            const content = meta.getAttribute('content');
            if (property && content) {
                extractedData.metaTags[property] = content;
            }
        });

        extractedData.title = extractedData.metaTags['og:title'] ||
                              extractedData.metaTags['twitter:title'] ||
                              document.title;

        if (url.includes('udio.com')) {
            extractedData.audioLink = extractedData.metaTags['og:audio'] || extractedData.metaTags['twitter:player:stream'];
            extractedData.videoLink = extractedData.metaTags['og:video'];
        } else if (url.includes('suno.com')) {
            extractedData.audioLink = extractedData.metaTags['og:audio'] || extractedData.metaTags['twitter:player:stream'];
            extractedData.videoLink = extractedData.metaTags['og:video:secure_url'] || extractedData.metaTags['og:video'];
        } else if (url.includes('riffusion.com')) {
            extractedData.audioLink = extractedData.metaTags['og:audio'] || extractedData.metaTags['twitter:player:stream'];
            extractedData.videoLink = extractedData.metaTags['og:video:secure_url'] || extractedData.metaTags['og:video'];
        }

        const foundItems = [];
        const missingItems = [];
        extractedData.title ? foundItems.push('Title') : missingItems.push('Title');
        extractedData.audioLink ? foundItems.push('Audio') : missingItems.push('Audio');
        extractedData.videoLink ? foundItems.push('Video') : missingItems.push('Video');

        let statusMessage = '';
        if (foundItems.length === 3) statusMessage = 'All primary media links found!';
        else if (foundItems.length > 0) statusMessage = `Found ${foundItems.join(', ')}. Missing: ${missingItems.join(', ')}.`;
        else statusMessage = 'No primary media links found.';

        if (isOpen) updateUI(statusMessage, extractedData);
        else lastExtractedData = extractedData;
    }

    const observer = new MutationObserver((mutations, obs) => {
        const metaTitle = document.querySelector('meta[property="og:title"], meta[name="twitter:title"]');
        const metaAudio = document.querySelector('meta[property="og:audio"], meta[name="twitter:player:stream"]');
        const metaVideo = document.querySelector('meta[property="og:video"], meta[property="og:video:secure_url"]');
        if (metaTitle && (metaAudio || metaVideo)) {
            obs.disconnect();
            findMediaLinks();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    if (isOpen) {
        findMediaLinks();
    }

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
        originalPushState.apply(this, arguments);
        setTimeout(handleUrlChange, 500);
    };
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        setTimeout(handleUrlChange, 500);
    };
    window.addEventListener('popstate', handleUrlChange);

    let lastKnownUrl = window.location.href;
    function handleUrlChange() {
        if (window.location.href !== lastKnownUrl) {
            lastKnownUrl = window.location.href;
            if (
                window.location.href.startsWith('https://suno.com/song/') ||
                window.location.href.startsWith('https://www.udio.com/songs/') ||
                window.location.href.startsWith('https://www.riffusion.com/song/')
            ) {
                if (isOpen) {
                    updateUI('Page changed, searching...', {});
                    setTimeout(findMediaLinks, 500);
                } else {
                    setTimeout(findMediaLinks, 500);
                }
                observer.disconnect();
                observer.observe(document.body, { childList: true, subtree: true, attributes: true });
            }
        }
    }
})();
