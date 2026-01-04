// ==UserScript==
// @name         Scribd
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  View Scribd Document as embed URLs for FREE
// @author       youcantrust
// @match        *://*.scribd.com/*
// @match        *://scribd.com/*
// @run-at       document-start
// @grant        none
// @connect      none
// @description  Without entering other sites, directly view all paid documents on Scribd for free. 
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555135/Scribd.user.js
// @updateURL https://update.greasyfork.org/scripts/555135/Scribd.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Multiple access keys untuk fallback (tetap gunakan array agar logika asli tidak berubah)
    const accessKeys = [
        'key-ixxYfpwtHw5XUehk3QyF'
    ];

    // Fungsi untuk mendapatkan access key secara acak
    function getRandomAccessKey() {
        return accessKeys[Math.floor(Math.random() * accessKeys.length)];
    }

    // Fungsi untuk mengekstrak ID dari berbagai format URL Scribd
    function extractDocumentId(url) {
        if (url.includes('/embeds/')) {
            const embedMatch = url.match(/\/embeds\/([^\/\?&]+)/);
            if (embedMatch && embedMatch[1]) {
                return embedMatch[1];
            }
        }

        const patterns = [
            /\/(?:document|doc)\/([^\/\?&]+)/,
            /\/(?:presentation)\/([^\/\?&]+)/,
            /\/(?:read|pub)\/([^\/\?&]+)/,
            /\/(\d{8,})/,
            /\/(\d+)-[^\/\?&]+/,
            /\/(\d+)(?:\?|$|\/)/,
            /\/([a-zA-Z0-9_-]{8,})(?:\?|$|\/)/,
            /(?:\?|&)id=([^&]+)/,
            /(?:\?|&)document_id=([^&]+)/,
            /(?:\?|&)doc_id=([^&]+)/
        ];

        for (let pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                const potentialId = match[1];
                if (/^\d+$/.test(potentialId) && potentialId.length >= 6) {
                    return potentialId;
                }
                if (/^[a-zA-Z0-9_-]+$/.test(potentialId) && potentialId.length >= 6) {
                    return potentialId;
                }
            }
        }
        return null;
    }

    // Fungsi untuk memeriksa apakah URL saat ini menggunakan salah satu access key yang valid
    function isValidEmbedUrl(url) {
        return accessKeys.some(key => url.includes(key));
    }

    // Main logic: redirect hanya jika bukan embed URL yang valid
    const currentUrl = window.location.href;

    // Jika sudah di embed URL dengan access key yang valid, berhenti dan jangan redirect
    if (currentUrl.includes('/embeds/') && isValidEmbedUrl(currentUrl)) {
        const documentId = extractDocumentId(currentUrl);
        if (documentId) {
            console.log('Document ID ditemukan (embed):', documentId);
        }
        return;
    }

    // Jika bukan di embed URL yang valid, lakukan redirect dengan access key acak (tetap menjaga perilaku awal)
    const documentId = extractDocumentId(currentUrl);
    if (documentId && !currentUrl.includes('/embeds/')) {
        const randomAccessKey = getRandomAccessKey();
        const embedUrl = `https://scribd.com/embeds/${documentId}/content?start_page=1&view_mode=scroll&access_key=${randomAccessKey}`;

        console.log(`Redirecting from: ${currentUrl}`);
        console.log(`Document ID found: ${documentId}`);
        console.log(`Using access key: ${randomAccessKey}`);
        console.log(`Redirecting to: ${embedUrl}`);

        // Gunakan replace agar tidak menambah history
        window.location.replace(embedUrl);
    }
})();
