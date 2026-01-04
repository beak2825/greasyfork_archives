// ==UserScript==
// @name            YouTube Download Arrow on Video - y2meta
// @namespace       http://tampermonkey.net/
// @version         1.0
// @description     Adds a square arrow download button on YouTube videos. Appears on hover. Automatically sends the URL to y2meta.
// @author          Bui Quoc Dung
// @match           *://*.youtube.com/*
// @match           *://*y2meta-us.com/*
// @run-at          document-start
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/559014/YouTube%20Download%20Arrow%20on%20Video%20-%20y2meta.user.js
// @updateURL https://update.greasyfork.org/scripts/559014/YouTube%20Download%20Arrow%20on%20Video%20-%20y2meta.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /* =============================================================
       🔹 PART 1 — ADD DOWNLOAD BUTTON ON YOUTUBE VIDEO
       ============================================================= */

    if (window.location.hostname.includes("youtube.com")) {

        const STYLES = `
            #y2mate-download-container {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 3000;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }

            /* Show the button when hovering the video player */
            .html5-video-player:hover #y2mate-download-container {
                opacity: 0.6 !important;
            }

            .y2mate-download-btn {
                pointer-events: auto;
                position: absolute;
                top: 12px;
                left: 12px;
                font-size: 22px;
                background: rgba(0,0,0,0.65);
                color: white;
                padding: 6px 12px;
                border-radius: 4px;  /* Square corners */
                border: none;
                cursor: pointer;
                backdrop-filter: blur(2px);

            }

            .y2mate-download-btn:hover {
                background: rgba(255,255,255,0.9);
                color: black;

            }
        `;

        GM_addStyle(STYLES);

        function createDownloadButton() {
            if (document.querySelector(".y2mate-download-btn")) return null;

            const btn = document.createElement("button");
            btn.className = "y2mate-download-btn";
            btn.textContent = "↓";   


            btn.addEventListener("click", function () {
                const url = window.location.href;
                GM_setValue("ultimaUrlYoutube", url);

                const newUrl = url.replace("www.youtube.com/", "y2meta-us.com/");
                window.open(newUrl, "_blank");
            });

            return btn;
        }

        function addButtonToPlayer() {
            const player = document.querySelector(".html5-video-player");
            if (!player) return;

            if (!document.querySelector("#y2mate-download-container")) {
                const container = document.createElement("div");
                container.id = "y2mate-download-container";

                const btn = createDownloadButton();
                if (btn) container.appendChild(btn);

                player.appendChild(container);
            }
        }

        function init() {
            if (window.location.pathname.includes("/watch")) {
                addButtonToPlayer();
            }
        }


        const observer = new MutationObserver(init);
        observer.observe(document.documentElement, { childList: true, subtree: true });
        window.addEventListener("yt-navigate-finish", init);

        init();
    }

    /* =============================================================
       🔹 PART 2 — AUTO-FILL URL AND AUTO-SUBMIT ON Y2META
       ============================================================= */

    if (window.location.hostname.includes("y2meta-us.com")) {

        function autoFillAndSubmit() {
            const url = GM_getValue("ultimaUrlYoutube", null);
            if (!url) return;

            const input = document.querySelector("#txt-url");
            const button = document.querySelector("#btn-submit");

            if (input && button) {
                input.value = url;

                input.dispatchEvent(new Event("input", { bubbles: true }));

                setTimeout(() => button.click(), 300);
                GM_setValue("ultimaUrlYoutube", "");
            } else {
                setTimeout(autoFillAndSubmit, 200);
            }
        }

        window.addEventListener("load", autoFillAndSubmit);
    }

})();
