// ==UserScript==
// @name         WP Media Library bulk image downloader (numbered)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Download all images from the WordPress dashboard media library as 1.jpg, 2.png, ...
// @match        *://*/*wp-admin/upload.php*
// @grant        GM_download
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556492/WP%20Media%20Library%20bulk%20image%20downloader%20%28numbered%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556492/WP%20Media%20Library%20bulk%20image%20downloader%20%28numbered%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Only run on the Media Library grid page
    if (!/\/upload\.php(\?|$)/.test(location.href)) return;

    console.log('[TM WP Media DL] script loaded on', location.href);

    const IMG_SELECTOR = '.attachments-wrapper .thumbnail img';
    const BUTTON_ID = 'tm-wp-media-download-btn';

    function waitForMediaLibrary() {
        const interval = setInterval(() => {
            const firstImg = document.querySelector(IMG_SELECTOR);
            if (firstImg) {
                clearInterval(interval);
                console.log('[TM WP Media DL] media elements detected');
                initDownloader();
            }
        }, 700);
    }

    function initDownloader() {
        if (document.getElementById(BUTTON_ID)) return;

        const btn = document.createElement('button');
        btn.id = BUTTON_ID;
        btn.textContent = 'Download media images';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '999999';
        btn.style.padding = '8px 14px';
        btn.style.background = '#2271b1';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        btn.style.fontSize = '13px';

        btn.addEventListener('click', handleDownloadClick);
        document.body.appendChild(btn);
        console.log('[TM WP Media DL] button injected');
    }

    function getExtensionFromUrl(url) {
        const clean = url.split('#')[0].split('?')[0];
        const match = clean.match(/\.([a-zA-Z0-9]+)$/);
        if (match) return match[1].toLowerCase();
        return 'jpg';
    }

    function collectImages() {
        const imgEls = Array.from(document.querySelectorAll(IMG_SELECTOR));
        const seen = new Set();
        const list = [];

        imgEls.forEach(img => {
            const src = img.getAttribute('src');
            if (!src) return;

            if (src.includes('wp-includes') || src.includes('dashicons')) return;

            if (seen.has(src)) return;
            seen.add(src);

            list.push({
                url: src,
                ext: getExtensionFromUrl(src)
            });
        });

        console.log('[TM WP Media DL] collected', list.length, 'images');
        return list;
    }

    function handleDownloadClick() {
        const images = collectImages();
        if (!images.length) {
            alert('No media images were found in the current view.');
            return;
        }

        const ok = confirm(
            `Found ${images.length} image(s).\n\n` +
            'They will be downloaded as 1.ext, 2.ext, ... in the order shown.\n' +
            'Your browser/Tampermonkey settings control where they are saved and whether you see Save dialogs.\n\n' +
            'Start downloading now?'
        );
        if (!ok) return;

        downloadAll(images);
    }

    function downloadAll(images) {
        images.forEach((img, index) => {
            const n = index + 1;
            const filename = `${n}.${img.ext}`;

            GM_download({
                url: img.url,
                name: filename,
                saveAs: index === 0, // first download requests Save As
                onload: () => console.log('[TM WP Media DL] downloaded', filename),
                onerror: err => console.error('[TM WP Media DL] failed', filename, err)
            });
        });
    }

    waitForMediaLibrary();

    const observer = new MutationObserver(() => {
        if (document.querySelector(IMG_SELECTOR)) {
            initDownloader();
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();