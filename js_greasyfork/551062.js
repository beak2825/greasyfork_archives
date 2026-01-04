// ==UserScript==
// @name         Safebooru Auto Downloader
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Adds a styled download button below thumbnails on safebooru.org and downloads in background.
// @match        https://safebooru.org/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      safebooru.org
// @author       Kyura
// @downloadURL https://update.greasyfork.org/scripts/551062/Safebooru%20Auto%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/551062/Safebooru%20Auto%20Downloader.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function addButtons() {
        document.querySelectorAll(".image-list span.thumb").forEach(span => {
            let link = span.querySelector("a");
            if (!link || link.querySelector(".tm-download-btn")) return;

            // Flex layout
            link.style.display = "flex";
            link.style.flexDirection = "column";
            link.style.alignItems = "stretch";
            span.style.marginBottom = "28px";

            let btn = document.createElement("button");
            btn.innerText = "Download";
            btn.className = "tm-download-btn";
            btn.style.width = "100%";
            btn.style.height = "22px";
            btn.style.marginTop = "6px";
            btn.style.background = "#e0e0e0";
            btn.style.border = "1px solid #aaa";
            btn.style.borderRadius = "4px";
            btn.style.cursor = "pointer";
            btn.style.fontSize = "12px";
            btn.style.transition = "background 0.2s";
            btn.style.position = "relative";
            btn.style.zIndex = "10";

            btn.addEventListener("mouseenter", () => btn.style.background = "#d0d0d0");
            btn.addEventListener("mouseleave", () => btn.style.background = "#e0e0e0");

            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Fetch post page in background
                GM_xmlhttpRequest({
                    method: "GET",
                    url: link.href,
                    onload: function (res) {
                        if (res.status === 200) {
                            // Parse HTML
                            let parser = new DOMParser();
                            let doc = parser.parseFromString(res.responseText, "text/html");
                            let img = doc.querySelector("#image");
                            if (img && img.src) {
                                // Clean filename
                                let filename = img.src.split("/").pop().split("?")[0];
                                console.log("[TM] Downloading:", img.src, "→", filename);
                                GM_download(img.src, filename);
                            } else {
                                console.log("[TM] No image found on post page.");
                            }
                        } else {
                            console.error("[TM] Failed to fetch post page:", res.status);
                        }
                    },
                    onerror: function (err) {
                        console.error("[TM] GM_xmlhttpRequest error:", err);
                    }
                });
            });

            link.appendChild(btn);
        });
    }

    // Observe page for thumbnails
    const rootObserver = new MutationObserver(() => {
        if (document.querySelector(".image-list")) {
            addButtons();
            const list = document.querySelector(".image-list");
            if (list) {
                const innerObserver = new MutationObserver(addButtons);
                innerObserver.observe(list, { childList: true, subtree: true });
            }
            rootObserver.disconnect();
        }
    });
    rootObserver.observe(document.documentElement || document, { childList: true, subtree: true });

    // Try adding immediately if DOM is already ready
    if (document.readyState !== "loading") addButtons();
})();
