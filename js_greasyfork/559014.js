// ==UserScript==
// @name            YouTube toolkit
// @namespace       http://tampermonkey.net/
// @version         1.5
// @description     Adds download and transcript buttons below video info on YouTube
// @author          Bui Quoc Dung
// @match           *://*.youtube.com/*
// @match           *://y2meta-us.com/*
// @run-at          document-idle
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559014/YouTube%20toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/559014/YouTube%20toolkit.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ============================================
    // YOUTUBE.COM - Add Download & Transcript buttons
    // ============================================
    if (window.location.hostname.includes("youtube.com")) {
        const STYLES = `
            #download-container {
                margin-top: 6px;
                padding: 6px 0;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .download-btn, .transcript-btn {
                font-size: 14px;
                font-weight: 500;
                background-color: transparent;
                color: currentColor;
                padding: 10px 15px;
                border-radius: 18px;
                border: none;
                cursor: pointer;
                font-family: "Roboto", "Arial", sans-serif;
                transition: background-color 0.2s;
            }
            .download-btn:hover, .transcript-btn:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
        `;
        GM_addStyle(STYLES);

        function createDownloadButton() {
            if (document.querySelector(".download-btn")) return null;
            
            const btn = document.createElement("button");
            btn.className = "download-btn";
            btn.textContent = "Download";
            btn.addEventListener("click", function () {
                const youtubeUrl = window.location.href.split('#')[0].split('&')[0];
                const y2metaUrl = "https://y2meta-us.com/?url=" + encodeURIComponent(youtubeUrl);
                window.open(y2metaUrl, "_blank");
            });
            return btn;
        }

        function createTranscriptButton() {
            if (document.querySelector(".transcript-btn")) return null;
            
            const btn = document.createElement("button");
            btn.className = "transcript-btn";
            btn.textContent = "Transcript";
            btn.addEventListener("click", function () {
                const youtubeUrl = window.location.href.split('#')[0];
                const urlParams = new URLSearchParams(new URL(youtubeUrl).search);
                const videoId = urlParams.get('v');
                
                if (videoId) {
                    const transcriptUrl = `https://youtubetotranscript.com/transcript?v=${videoId}`;
                    window.open(transcriptUrl, "_blank");
                } else {
                    alert("Video ID not found!");
                }
            });
            return btn;
        }

        function addButtonBelowTopRow() {
            const topRow = document.querySelector("#top-row.ytd-watch-metadata");
            if (!topRow || document.querySelector("#download-container")) return;

            const container = document.createElement("div");
            container.id = "download-container";

            const downloadBtn = createDownloadButton();
            const transcriptBtn = createTranscriptButton();

            if (downloadBtn) container.appendChild(downloadBtn);
            if (transcriptBtn) container.appendChild(transcriptBtn);

            if (downloadBtn || transcriptBtn) {
                topRow.parentNode.insertBefore(container, topRow.nextSibling);
            }
        }

        function init() {
            if (window.location.pathname.includes("/watch")) {
                addButtonBelowTopRow();
            }
        }

        // Observe DOM changes for YouTube's dynamic content loading
        const observer = new MutationObserver(function(mutations) {
            for (let mutation of mutations) {
                if (mutation.target.id === 'top-row' ||
                    mutation.target.closest('#top-row') ||
                    mutation.target.querySelector('#top-row')) {
                    init();
                    break;
                }
            }
        });

        // Initialize observer
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                const targetNode = document.querySelector('ytd-watch-flexy') || document.body;
                observer.observe(targetNode, { childList: true, subtree: true });
                init();
            });
        } else {
            const targetNode = document.querySelector('ytd-watch-flexy') || document.body;
            observer.observe(targetNode, { childList: true, subtree: true });
            init();
        }

        // Handle YouTube's SPA navigation
        window.addEventListener("yt-navigate-finish", init);
    }

    // ============================================
    // Y2META-US.COM - Auto-fill YouTube URL
    // ============================================
    if (window.location.hostname.includes("y2meta-us.com")) {
        function autoFillAndSubmit() {
            // Get URL from query parameter
            const urlParams = new URLSearchParams(window.location.search);
            const youtubeUrl = urlParams.get('url');
            
            // Validate YouTube URL
            if (!youtubeUrl || !youtubeUrl.includes("youtube.com/watch")) {
                return;
            }
            
            // Find input and button elements
            const input = document.querySelector("#txt-url");
            const button = document.querySelector("#btn-submit");
            
            if (input && button) {
                // Fill the input field
                input.value = youtubeUrl;
                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.dispatchEvent(new Event("change", { bubbles: true }));
                
                // Click submit button after short delay
                setTimeout(() => {
                    button.click();
                    // Clean up URL (remove query parameter)
                    history.replaceState(null, '', window.location.pathname);
                }, 500);
            } else {
                // Retry if elements not found yet
                setTimeout(autoFillAndSubmit, 300);
            }
        }
        
        // Start auto-fill process when page loads
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', autoFillAndSubmit);
        } else {
            autoFillAndSubmit();
        }
    }
})();