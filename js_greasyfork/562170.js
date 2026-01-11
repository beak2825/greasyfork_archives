// ==UserScript==
// @name         Copy YouTube Transcript to Clipboard
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds button that copies transcript to clipboard.
// @author       432enjoyer
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562170/Copy%20YouTube%20Transcript%20to%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/562170/Copy%20YouTube%20Transcript%20to%20Clipboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = location.href;

    // Fix for Playlist/SPA navigation logic
    // 'yt-navigate-finish' fires when YouTube finishes soft-navigating to a new video
    // Fix for Playlist/SPA navigation logic
    const handleNav = () => {
        const btn = document.getElementById('yt-copy-transcript-btn');
        if (btn) btn.remove(); // Force removal of old button
        setTimeout(init, 100);
        setTimeout(init, 1000); // Backup check
    };
    window.addEventListener('yt-navigate-finish', handleNav);
    window.addEventListener('yt-page-data-updated', handleNav);

    // Navigation Observer
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(init, 2000);
        }
    }).observe(document, { subtree: true, childList: true });

    setInterval(init, 1000);

    function init() {
        // Check for Shorts
        if (location.pathname.startsWith('/shorts/')) {
            addShortsButton();
            return;
        }

        if (!location.pathname.startsWith('/watch')) return;

        // 1. Check if button exists
        const existingBtn = document.getElementById('yt-copy-transcript-btn');
        if (existingBtn) {
            // If button exists but is hidden (stale/zombie from previous navigation), remove it.
            if (existingBtn.offsetParent === null) {
                existingBtn.remove();
            } else {
                return; // Button is visible, we are good.
            }
        }

        const selectors = [
            'ytd-watch-metadata #actions',
            'ytd-watch-metadata #top-level-buttons-computed',
            'ytd-watch-metadata ytd-menu-renderer', 
            '#top-level-buttons-computed',
            '#actions-inner',
            '#actions',
            '#flexible-item-buttons'
        ];

        // 2. Find a VISIBLE container
        for (const sel of selectors) {
            const elements = document.querySelectorAll(sel);
            for (const el of elements) {
                if (el.offsetParent !== null) {
                    addCopyButton(el);
                    return;
                }
            }
        }
    }

    // --- TRANSCRIPT BUTTON (Regular Videos) ---
    function addCopyButton(container) {
        if (document.getElementById('yt-copy-transcript-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'yt-copy-transcript-btn';
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("height", "24");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "24");
        svg.style.cssText = "fill: currentColor; pointer-events: none; display: block;";

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z");
        svg.appendChild(path);

        const span = document.createElement('span');
        span.style.cssText = "margin-left: 6px; font-weight: 500;";
        span.innerText = "Transcript";

        btn.appendChild(svg);
        btn.appendChild(span);

        const isDark = document.documentElement.getAttribute('dark') === 'true';
        btn.style.cssText = `
            display: inline-flex !important;
            justify-content: center !important;
            align-items: center !important;
            vertical-align: middle !important;
            
            width: auto !important;
            max-width: fit-content !important;
            min-width: 0 !important;
            
            flex: 0 0 auto !important;
            flex-grow: 0 !important;
            flex-shrink: 0 !important;
            
            box-sizing: border-box !important;
            
            background-color: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
            color: var(--yt-spec-text-primary);
            border: none;
            border-radius: 18px;
            padding: 0 16px;
            height: 36px;
            font-size: 14px;
            font-family: Roboto, Arial, sans-serif;
            cursor: pointer;
            margin-left: 8px;
            text-decoration: none;
            transition: all 0.2s;
            white-space: nowrap;
        `;

        btn.onmouseover = () => { btn.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'; };
        btn.onmouseout = () => { btn.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'; };

        btn.onclick = async () => {
            const span = btn.querySelector('span');
            btn.style.opacity = '0.7';
            span.innerText = 'Working...';

            try {
                const player = unsafeWindow.movie_player || document.getElementById('movie_player');
                const data = player.getPlayerResponse();

                try {
                    const text = await fetchTranscriptAPI(data);
                    GM_setClipboard(text);
                    span.innerText = 'Copied!';
                } catch (apiErr) {
                    console.log("API failed, switching to UI...", apiErr);
                    span.innerText = 'Searching...';
                    await openPanelAndCopy();
                    span.innerText = 'Copied!';
                }
            } catch (e) {
                console.error(e);
                let msg = "Error";
                const err = e.message.toLowerCase();
                if (err.includes("live stream")) msg = "Live Stream";
                else if (err.includes("no captions") || err.includes("no transcript")) msg = "No Transcript";
                else if (err.includes("could not find")) msg = "No Transcript";
                else if (err.includes("timeout")) msg = "Timeout";
                else if (err.includes("empty")) msg = "Empty Data";
                else if (err.includes("network")) msg = "Network Err";
                span.innerText = msg;
                btn.style.color = '#ff4e45';
            } finally {
                btn.style.opacity = '1';
                setTimeout(() => {
                    span.innerText = 'Transcript';
                    btn.style.color = 'var(--yt-spec-text-primary)';
                }, 4000);
            }
        };

        container.appendChild(btn);
    }

    // --- SHORTS BUTTON (Shorts Redirect) ---
    function addShortsButton() {
        const containers = document.querySelectorAll('ytd-reel-player-overlay-renderer #actions');

        for (const container of containers) {
            // Check for wrapper to avoid duplicates
            if (container.querySelector('.yt-shorts-to-watch-container')) continue;

            // 1. Create Wrapper (holds button + label)
            const wrapper = document.createElement('div');
            wrapper.className = 'yt-shorts-to-watch-container';
            // Flex column to align icon and text vertically
            wrapper.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-top: 0px; margin-bottom: 16px;
                cursor: pointer;
            `;

            // 2. Create Button Circle
            const btn = document.createElement('div');
            btn.className = 'yt-shorts-to-watch-btn';
            btn.title = "Open as Regular Video";
            
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("height", "24");
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.setAttribute("width", "24");
            svg.style.cssText = "fill: currentColor; pointer-events: none; display: block;";
            
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"); 
            svg.appendChild(path);
            btn.appendChild(svg);

            // Adaptive Styling
            const isDark = document.documentElement.getAttribute('dark') === 'true';
            
            btn.style.cssText = `
                display: flex;
                justify-content: center;
                align-items: center;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background-color: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
                color: var(--yt-spec-text-primary);
                transition: background-color 0.2s;
            `;

            // 3. Create Text Label ("Watch")
            const label = document.createElement('span');
            label.innerText = "Watch";
            label.style.cssText = `
                margin-top: 6px;
                font-size: 14px;
                font-weight: 400;
                color: var(--yt-spec-text-primary);
                font-family: Roboto, Arial, sans-serif;
            `;

            // 4. Events
            wrapper.onmouseover = () => { btn.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'; };
            wrapper.onmouseout = () => { btn.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'; };

            wrapper.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation(); 
                const currentUrl = location.href;
                if (currentUrl.includes('/shorts/')) {
                    const parts = currentUrl.split('/shorts/');
                    if (parts.length > 1) {
                        const videoId = parts[1].split('?')[0].split('&')[0];
                        window.location.href = 'https://www.youtube.com/watch?v=' + videoId;
                    }
                }
            };

            // Assemble
            wrapper.appendChild(btn);
            wrapper.appendChild(label);

            // Insert before the last element (Profile Pic)
            if (container.lastElementChild) {
                container.insertBefore(wrapper, container.lastElementChild);
            } else {
                container.appendChild(wrapper);
            }
        }
    }// --- TRANSCRIPT HELPERS ---
    function fetchTranscriptAPI(data) {
        return new Promise((resolve, reject) => {
            const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
            if (!tracks || tracks.length === 0) return reject(new Error("No captions found"));

            tracks.sort((a, b) => a.languageCode.startsWith('en') ? -1 : 1);

            GM_xmlhttpRequest({
                method: "GET",
                url: tracks[0].baseUrl,
                onload: function(response) {
                    if (response.status !== 200 || !response.responseText) return reject(new Error("Empty API response"));
                    try {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                        const texts = xmlDoc.getElementsByTagName("text");
                        if (texts.length === 0) return reject(new Error("XML empty"));

                        let fullText = "";
                        for (let i = 0; i < texts.length; i++) {
                            fullText += texts[i].textContent.replace(/\\n/g, ' ') + " ";
                        }
                        const decoded = fullText.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
                        resolve(decoded.replace(/\\s+/g, ' ').trim());
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: () => reject(new Error("Network Error"))
            });
        });
    }

    async function openPanelAndCopy() {
        if (document.querySelector('ytd-transcript-segment-renderer')) {
            return scrapeText();
        }
        const expander = document.querySelector('ytd-text-inline-expander') || document.querySelector('#description-inline-expander');
        const moreBtn = expander?.querySelector('#expand') || expander?.querySelector('#more');

        if (expander && !expander.hasAttribute('is-expanded') && moreBtn) {
            moreBtn.click();
            await wait(500);
        }
        let showBtn = document.querySelector('ytd-video-description-transcript-section-renderer button');
        if (!showBtn) {
            const buttons = Array.from(document.querySelectorAll('button, ytd-button-renderer'));
            showBtn = buttons.find(b => {
                const txt = (b.innerText || b.getAttribute('aria-label') || "").toLowerCase();
                return txt.includes('show transcript') || txt.includes('transcript');
            });
        }
        if (!showBtn) throw new Error("Could not find 'Show transcript' button");

        showBtn.click();
        await waitForSegments();
        const text = scrapeText();
        const closeBtn = document.querySelector('[target-id="engagement-panel-searchable-transcript"] button[aria-label^="Close"]');
        if (closeBtn) closeBtn.click();
        GM_setClipboard(text);
    }

    function scrapeText() {
        const segments = document.querySelectorAll('ytd-transcript-segment-renderer .segment-text, ytd-transcript-search-segment-renderer .segment-text');
        if (!segments || segments.length === 0) throw new Error("Panel opened but empty");
        let fullText = "";
        segments.forEach(s => fullText += s.innerText + " ");
        return fullText.replace(/\\s+/g, ' ').trim();
    }

    function waitForSegments() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const timer = setInterval(() => {
                if (document.querySelector('ytd-transcript-segment-renderer, ytd-transcript-search-segment-renderer')) {
                    clearInterval(timer);
                    resolve();
                } else if (attempts > 60) {
                    clearInterval(timer);
                    reject(new Error("Timeout waiting for panel"));
                }
                attempts++;
            }, 100);
        });
    }

    function wait(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

})();