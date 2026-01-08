// ==UserScript==
// @name            YouTube toolkit
// @namespace       http://tampermonkey.net/
// @version         1.4
// @description     Adds download and transcript buttons below video info on YouTube
// @author          Bui Quoc Dung
// @match           *://*.youtube.com/*
// @match           *://*y2meta-us.com/*
// @run-at          document-idle
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559014/YouTube%20toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/559014/YouTube%20toolkit.meta.js
// ==/UserScript==
(function () {
    "use strict";
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
            }
        `;
        GM_addStyle(STYLES);

        function createDownloadButton() {
            if (document.querySelector(".download-btn")) return null;
            const btn = document.createElement("button");
            btn.className = "download-btn";
            btn.textContent = "Download";
            btn.addEventListener("click", function () {
                const youtubeUrl = window.location.href.split('#')[0];
                const y2metaUrl = "https://y2meta-us.com/#" + encodeURIComponent(youtubeUrl);
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

            if (downloadBtn) {
                container.appendChild(downloadBtn);
            }
            if (transcriptBtn) {
                container.appendChild(transcriptBtn);
            }

            if (downloadBtn || transcriptBtn) {
                topRow.parentNode.insertBefore(container, topRow.nextSibling);
            }
        }

        function init() {
            if (window.location.pathname.includes("/watch")) {
                addButtonBelowTopRow();
            }
        }

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

        window.addEventListener("yt-navigate-finish", init);
    }

    if (window.location.hostname.includes("y2meta-us.com")) {
        function autoFillAndSubmit() {
            const hash = window.location.hash;
            if (!hash || hash.length <= 1) return;
            const youtubeUrl = decodeURIComponent(hash.substring(1));
            if (!youtubeUrl.includes("youtube.com/watch")) return;
            const input = document.querySelector("#txt-url");
            const button = document.querySelector("#btn-submit");
            if (input && button) {
                input.value = youtubeUrl;
                input.dispatchEvent(new Event("input", { bubbles: true }));
                setTimeout(() => {
                    button.click();
                    history.replaceState(null, '', window.location.pathname + window.location.search);
                }, 300);
            } else {
                setTimeout(autoFillAndSubmit, 200);
            }
        }
        window.addEventListener("load", autoFillAndSubmit);
    }
})();