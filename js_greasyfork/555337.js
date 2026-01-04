// ==UserScript==
// @name         CW Plugins
// @namespace    http://tampermonkey.net/
// @version      2025-06-18
// @description  CW Plugins by Brent
// @license      MIT
// @author       You
// @include      https://cw.daraco.com.au/v4_6_release/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=daraco.com.au
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555337/CW%20Plugins.user.js
// @updateURL https://update.greasyfork.org/scripts/555337/CW%20Plugins.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function convertEmlToHtml(emlContent) {
        // Basic parsing to find the HTML part (highly simplified)
        const htmlPartRegex = /Content-Type: text\/html;[^]*?(\r\n\r\n|\n\n)([\s\S]*?)(\r\n--|\n--|$)/i;
        const match = emlContent.match(htmlPartRegex);

        if (match && match[2]) {
            let htmlBody = match[2].trim();
            // Further processing might be needed for character encodings, inline images, etc.
            return `<html><body>${htmlBody}</body></html>`;
        } else {
            // Fallback for plain text or other content types
            const textPartRegex = /Content-Type: text\/plain;[^]*?(\r\n\r\n|\n\n)([\s\S]*?)(\r\n--|\n--|$)/i;
            const textMatch = emlContent.match(textPartRegex);
            if (textMatch && textMatch[2]) {
                return `<html><body><pre>${textMatch[2].trim()}</pre></body></html>`;
            }
        }
        return "<html><body><p>Could not extract HTML or plain text content.</p></body></html>";
    }

    function getFilenameFromHeaders(headers, fallback = "download.bin") {
        const cd = headers.get("Content-Disposition") || "";
        // Try filename*=
        let m = /filename\*\s*=\s*([^;]+)/i.exec(cd);
        if (m && m[1]) {
            return cleanFilename(m[1]);
        }
        // Try filename=
        m = /filename\s*=\s*([^;]+)/i.exec(cd);
        if (m && m[1]) {
            return cleanFilename(m[1]);
        }
        return fallback;
    }

    function cleanFilename(val) {
        let v = val.trim();

        // Strip surrounding quotes
        if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);

        // Strip RFC 5987 charset/lang prefix: UTF-8''name
        v = v.replace(/^[A-Za-z0-9._-]+\s*''/,''); // e.g., UTF-8''

        // If percent-encoded, decode it
        try {
            if (/%[0-9A-Fa-f]{2}/.test(v)) v = decodeURIComponent(v);
        } catch (_) { /* ignore decode errors */ }

        // Some servers (incorrectly) send x-www-form-urlencoded style with '+'
        // Treat '+' as space only when there are no normal spaces already.
        if (/\+/.test(v) && !/\s/.test(v)) v = v.replace(/\+/g, ' ');

        // Trim any stray quotes again
        v = v.replace(/^"(.*)"$/, '$1');

        // Optional: strip characters invalid on Windows filesystems
        // v = v.replace(/[\\\/:*?"<>|]/g, '_');

        return v || "download.bin";
    }

    function getExt(name) {
        const i = name.lastIndexOf(".");
        return i !== -1 ? name.substring(i).toLowerCase() : "";
    }

    function isBrowserPreviewable(contentType, ext) {
        // Add/adjust to your needs
        const previewableTypes = [
            "text/plain", "text/html", "application/pdf",
            "image/", "audio/", "video/"
        ];
        if (previewableTypes.some(t => t.endsWith("/") ? contentType.startsWith(t) : contentType === t)) {
            return true;
        }
        // Common Office/other types the browser can't natively render:
        const nonPreviewableExts = [".doc", ".docx", ".xlsx", ".xls", ".ppt", ".pptx", ".msg", ".eml"];
        return !nonPreviewableExts.includes(ext);
    }

    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        if (url.includes("FileDownload")) {
            (async () => {
                const response = await fetch(url, { method: 'POST', credentials: 'include' });
                const contentType = response.headers.get("Content-Type") || "application/octet-stream";
                const filename = getFilenameFromHeaders(response.headers, "download.bin");
                const ext = getExt(filename);

                const blob = await response.blob();

                if (isBrowserPreviewable(contentType, ext)) {
                    const objUrl = URL.createObjectURL(blob);
                    window.open(objUrl, '_blank');
                } else {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = filename;
                    a.rel = "noopener";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    // Give the browser a moment to start the download, then revoke
                    setTimeout(() => URL.revokeObjectURL(url), 10);
                }
            })();
        } else {
            return origOpen.call(this, method, url, ...rest);
        }
    };

    document.body.addEventListener('click', function(e) {
        const attachBtn = e.target.closest('[data-cwid="btn_attachment"]');
        if (attachBtn) {
            e.preventDefault();
            e.stopImmediatePropagation(); // optional: block original handlers
            const attachmentName = attachBtn.textContent;
            const targetCell = Array.from(document.querySelectorAll('[cellindex="2"]')).find(e => e.textContent.trim() === attachmentName);
            const relatedCell = targetCell?.closest('tr')?.querySelector('[cellindex="0"]');
            const mmButton = relatedCell?.querySelector('.mm_button');
            mmButton?.click();
        }

        const shareBtn = [...document.querySelectorAll("div")].filter(
            el => el.textContent.trim() === "Share"
        )[0];
        if (shareBtn) {
            shareBtn.addEventListener("mouseup", (event) => {
                if (event.button === 1) {
                    const match = [...document.querySelectorAll("body *")]
                    .map(el => el.textContent)
                    .find(text => /Service Ticket\s+#\d+/.test(text));

                    const ticketNumber = match?.match(/#(\d+)/)?.[1];
                    console.log(ticketNumber)
                    const ticketUrl = `https://cw.daraco.com.au/v4_6_release/services/system_io/Service/fv_sr100_request.rails?service_recid=${ticketNumber}&companyName=Daraco`
                    window.open(ticketUrl, "_blank");
                    event.preventDefault();
                }
            })
        }
    });
})();