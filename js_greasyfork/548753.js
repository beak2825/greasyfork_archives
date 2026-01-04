// ==UserScript==
// @name         WME Full Image Viewer
// @namespace    https://github.com/Firecul/WME-Full-Image-Viewer/
// @version      1.5
// @description  View and download full-size Place Update Request and Place photos in Waze Map Editor (bypassing thumbnail limits)
// @author       Firecul
// @supportURL   https://github.com/Firecul/WME-Full-Image-Viewer/issues/
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        GM_xmlhttpRequest
// @connect      venue-image.waze.com
// @downloadURL https://update.greasyfork.org/scripts/548753/WME%20Full%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/548753/WME%20Full%20Image%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showPopup(fullUrl, idPart) {
        // Remove existing popup if already open
        let existing = document.querySelector('#wme-fullimage-popup');
        if (existing) existing.remove();

        // === Overlay ===
        const overlay = document.createElement('div');
        overlay.id = "wme-fullimage-popup";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = "rgba(0,0,0,0.7)";
        overlay.style.zIndex = "99999";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";

        // Close overlay on background click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        // Esc key closes popup
        const escHandler = (e) => {
            if (e.key === "Escape") {
                overlay.remove();
                document.removeEventListener("keydown", escHandler);
            }
        };
        document.addEventListener("keydown", escHandler);

        // === Modal box ===
        const modal = document.createElement('div');
        modal.style.display = "flex";
        modal.style.flexDirection = "column";
        modal.style.background = "white";
        modal.style.borderRadius = "8px";
        modal.style.boxShadow = "0 0 30px rgba(0,0,0,0.8)";
        modal.style.maxWidth = "98vw";
        modal.style.maxHeight = "98vh";
        modal.style.overflow = "hidden"; // prevent content spill
        modal.addEventListener('click', (e) => e.stopPropagation());

        // === Header ===
        const header = document.createElement('div');
        header.style.display = "flex";
        header.style.justifyContent = "flex-end";
        header.style.padding = "6px 10px";
        header.style.background = "#f5f5f5";
        header.style.borderBottom = "1px solid #ddd";

        const xBtn = document.createElement('button');
        xBtn.textContent = "✕";
        xBtn.style.fontSize = "18px";
        xBtn.style.cursor = "pointer";
        xBtn.style.background = "none";
        xBtn.style.border = "none";
        xBtn.style.color = "#333";
        xBtn.addEventListener('click', () => {
            overlay.remove();
            document.removeEventListener("keydown", escHandler);
        });

        header.appendChild(xBtn);
        modal.appendChild(header);

        // === Image container ===
        const imgContainer = document.createElement('div');
        imgContainer.style.flex = "1";
        imgContainer.style.display = "flex";
        imgContainer.style.justifyContent = "center";
        imgContainer.style.alignItems = "center";
        imgContainer.style.padding = "10px"; // small padding around image
        imgContainer.style.background = "white"; // clean background

        const img = document.createElement('img');
        img.src = fullUrl;
        img.dataset.id = idPart;
        img.style.maxWidth = "95vw"; // never overflow screen width
        img.style.maxHeight = "88vh"; // leave room for header + footer
        img.style.width = "auto";
        img.style.height = "auto";
        img.style.objectFit = "contain"; // maintain aspect ratio
        img.style.display = "block";

        imgContainer.appendChild(img);
        modal.appendChild(imgContainer);

        // === Footer ===
        const footer = document.createElement('div');
        footer.style.display = "flex";
        footer.style.justifyContent = "center";
        footer.style.gap = "10px";
        footer.style.padding = "10px";
        footer.style.borderTop = "1px solid #ddd";
        footer.style.background = "#f5f5f5";

        // Download button
        const dlBtn = document.createElement('button');
        dlBtn.textContent = "Download JPG";
        dlBtn.style.padding = "6px 12px";
        dlBtn.style.cursor = "pointer";
        dlBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // don’t trigger background close
            GM_xmlhttpRequest({
                method: "GET",
                url: img.src,
                responseType: "blob",
                onload: function(response) {
                    const blob = response.response;
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = img.dataset.id + ".jpg";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(blobUrl);
                }
            });
        });

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = "Close";
        closeBtn.style.padding = "6px 12px";
        closeBtn.style.cursor = "pointer";
        closeBtn.addEventListener('click', () => {
            overlay.remove();
            document.removeEventListener("keydown", escHandler);
        });

        footer.appendChild(dlBtn);
        footer.appendChild(closeBtn);
        modal.appendChild(footer);

        // === Put modal inside overlay ===
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    function createButton(imgEl) {
        if (imgEl.parentNode.querySelector('.wme-fullsize-btn')) return; // avoid duplicates

        const btn = document.createElement('button');
        btn.textContent = "View Full Image";
        btn.className = 'wme-fullsize-btn';
        btn.style.marginLeft = "6px";
        btn.style.padding = "2px 6px";
        btn.style.fontSize = "12px";
        btn.style.cursor = "pointer";

        btn.addEventListener('click', () => {
            const thumbUrl = imgEl.src;
            const idMatch = thumbUrl.match(/thumb700_([^.?]+)/);
            if (!idMatch) return;
            const idPart = idMatch[1];
            const fullUrl = thumbUrl
                .replace('/thumbs/thumb700_', '/')
                .replace(/\.jpg$/i, '');
            showPopup(fullUrl, idPart);
        });

        imgEl.parentNode.appendChild(btn);
    }

    function processImages() {
        const images = document.querySelectorAll('img[src*="venue-image.waze.com/thumbs/thumb700_"]');
        images.forEach(img => {
            const thumbUrl = img.src;
            const idMatch = thumbUrl.match(/thumb700_([^.?]+)/);
            if (!idMatch) return;
            const idPart = idMatch[1];
            const fullUrl = thumbUrl
                .replace('/thumbs/thumb700_', '/')
                .replace(/\.jpg$/i, '');
            createButton(img, fullUrl, idPart);
        });
    }

    const observer = new MutationObserver(() => {
        processImages();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    processImages();
})();