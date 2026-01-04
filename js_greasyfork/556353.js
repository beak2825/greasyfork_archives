// ==UserScript==
// @name         PW PDF Direct Opener
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add button to open embedded PW PDF in Chrome PDF viewer
// @match        https://www.pw.live/study-v2/notes*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556353/PW%20PDF%20Direct%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/556353/PW%20PDF%20Direct%20Opener.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Extract PDF link from ?pdf= URL parameter
    function getPdfUrl() {
        const params = new URLSearchParams(window.location.search);
        const pdfUrl = params.get("pdf");
        return pdfUrl;
    }

    const pdfUrl = getPdfUrl();
    if (!pdfUrl) return;

    // Create floating button
    const btn = document.createElement("button");
    btn.textContent = "Open in Chrome PDF Viewer";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.zIndex = "999999";
    btn.style.padding = "10px 14px";
    btn.style.fontSize = "14px";
    btn.style.borderRadius = "6px";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    btn.style.background = "#1976d2";
    btn.style.color = "#fff";
    btn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";

    btn.onclick = () => {
        window.open(pdfUrl, "_blank");
    };

    document.body.appendChild(btn);
})();
