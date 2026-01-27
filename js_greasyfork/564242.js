// ==UserScript==
// @name         Send to X4 (Calibre Native Server)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       julienpierre
// @match        http://localhost:8080/*
// @match        http://[::1]:8080/*
// @license MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @description Sent to X4 for Native Calibre Server
// @downloadURL https://update.greasyfork.org/scripts/564242/Send%20to%20X4%20%28Calibre%20Native%20Server%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564242/Send%20to%20X4%20%28Calibre%20Native%20Server%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "x4_device_address_v2";
    const EPUB_SELECTOR = 'a[href*="/get/EPUB/"]';

    setInterval(syncX4Button, 400);

    function syncX4Button() {
        const dlLink = document.querySelector(EPUB_SELECTOR);
        if (dlLink && !dlLink.parentElement.querySelector('.x4-native-btn')) {
            inject(dlLink);
        }
    }

    function inject(anchor) {
        const btn = document.createElement('a');
        btn.className = 'calibre-push-button x4-native-btn';
        btn.href = "javascript:void(0)";
        btn.role = "button";
        btn.style.cssText = `
            margin-left: 10px !important;
            background-color: #28a745 !important;
            color: white !important;
            border: none !important;
        `;

        btn.innerHTML = `
            <svg style="fill: currentColor; height: 2ex; width: 2ex; vertical-align: text-top">
                <use xlink:href="#icon-cloud-download"></use>
            </svg>
            <span class="x4-text">&nbsp;Send to X4</span>
        `;

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSend(btn, anchor);
        };

        anchor.parentNode.insertBefore(btn, anchor.nextSibling);
    }

    function getKoreaderName(dlLink) {
        try {
            // 1. Get Title from the top bar (per your HTML snippet)
            let title = document.querySelector('.top-bar-title')?.innerText.trim();

            // 2. Get Author from the metadata table
            let author = "";
            const rows = document.querySelectorAll('table.metadata tr');
            for (const row of rows) {
                if (row.cells[0]?.innerText.includes('Author')) {
                    // Collect text from all links in that row (handles multiple authors)
                    const authorLinks = row.cells[1].querySelectorAll('a.blue-link');
                    if (authorLinks.length > 0) {
                        author = Array.from(authorLinks)
                            .map(a => a.innerText.trim())
                            .filter(txt => txt.length > 0)
                            .join(', ');
                    } else {
                        author = row.cells[1].innerText.trim();
                    }
                    break;
                }
            }

            // 3. Fallback: Check the cover image alt/title tags
            if (!title || !author) {
                const coverImg = document.querySelector('img[data-authors]');
                if (coverImg) {
                    title = title || coverImg.getAttribute('data-title');
                    author = author || coverImg.getAttribute('data-authors');
                }
            }

            if (title && author) {
                return `${author} - ${title}.epub`.replace(/[<>:"/\\|?*]/g, '');
            }
        } catch (e) {
            console.error("Scraping failed", e);
        }

        // Final Fallback: use the server's default name
        return dlLink.getAttribute('download') || "book.epub";
    }

    async function handleSend(btnEl, dlLink) {
        let addr = GM_getValue(STORAGE_KEY);
        if (!addr) {
            addr = prompt("Enter X4 IP:");
            if (!addr) return;
            addr = addr.replace(/^https?:\/\//, '').replace(/\/$/, '');
            GM_setValue(STORAGE_KEY, addr);
        }

        const label = btnEl.querySelector('.x4-text');
        const originalHTML = label.innerHTML;
        const filename = getKoreaderName(dlLink);

        label.innerHTML = "&nbsp;Sending...";
        btnEl.style.opacity = "0.6";

        try {
            const resp = await fetch(dlLink.href);
            const blob = await resp.blob();
            const fd = new FormData();
            fd.append("file", blob, filename);

            GM_xmlhttpRequest({
                method: "POST",
                url: `http://${addr}/upload?path=/`,
                data: fd,
                onload: (res) => {
                    label.innerHTML = (res.status < 300) ? "&nbsp;Sent!" : "&nbsp;Error";
                    setTimeout(() => {
                        label.innerHTML = originalHTML;
                        btnEl.style.opacity = "1";
                    }, 2500);
                },
                onerror: () => {
                    alert("X4 unreachable.");
                    label.innerHTML = originalHTML;
                    btnEl.style.opacity = "1";
                }
            });
        } catch (e) {
            alert("Error: " + e.message);
            label.innerHTML = originalHTML;
            btnEl.style.opacity = "1";
        }
    }
})();