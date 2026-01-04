// ==UserScript==
// @name         Kits4Beats & PasteIndex Auto Download Opener
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2.0.1
// @description  Automatically opens download links on kits4beats.com and pasteindex.com kit pages, bypassing countdowns and CAPTCHAs where possible.
// @author       .gg/kits4leaks / drumkits4.me
// @match        https://kits4beats.com/*
// @match        https://pasteindex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kits4beats.com
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/550703/Kits4Beats%20%20PasteIndex%20Auto%20Download%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/550703/Kits4Beats%20%20PasteIndex%20Auto%20Download%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const openedLinks = new Set();

    const handleDownloadLink = (anchorOrUrl) => {
        try {
            const url = typeof anchorOrUrl === 'string' ? anchorOrUrl : anchorOrUrl.href;
            if (!url || typeof url !== 'string') {
                console.log('[Tampermonkey] Invalid URL provided to handleDownloadLink');
                return;
            }

            try {
                new URL(url);
            } catch (e) {
                console.log('[Tampermonkey] Invalid URL format:', url);
                return;
            }

            if (openedLinks.has(url)) {
                console.log(`[Tampermonkey] Link already opened: ${url}`);
                return;
            }

            console.log(`[Tampermonkey] Opening download link: ${url}`);
            openedLinks.add(url);

            if (typeof anchorOrUrl !== 'string' && anchorOrUrl && anchorOrUrl.click) {
                try {
                    anchorOrUrl.click();
                    console.log('[Tampermonkey] Successfully clicked link element');
                    return;
                } catch (e) {
                    console.log('[Tampermonkey] Click failed, trying other methods:', e);
                }
            }

            try {
                window.open(url, '_blank');
                console.log('[Tampermonkey] Successfully opened with window.open');
                return;
            } catch (e) {
                console.log('[Tampermonkey] window.open failed:', e);
            }

            try {
                console.log('[Tampermonkey] Attempting navigation in current tab');
                window.location.href = url;
            } catch (e) {
                console.log('[Tampermonkey] All opening methods failed:', e);
            }

        } catch (e) {
            console.log('[Tampermonkey] Error in handleDownloadLink:', e);
        }
    };

    const handleKits4Beats = () => {
        const isPostPage = () => {
            const url = window.location.href;
            const pathSegments = url.split('/').filter(segment => segment.length > 0);

            if (pathSegments.length < 2) return false;

            const lastSegment = pathSegments[pathSegments.length - 1];
            if (!lastSegment || lastSegment.includes('.') || lastSegment.length < 3) return false;

            const articleContent = document.querySelector('article, .entry-content, .post-content, [itemprop="articleBody"]');
            if (!articleContent) return false;

            const hasDownloadButton = document.querySelector('a#download, #download');
            if (!hasDownloadButton) return false;

            return true;
        };

        if (!isPostPage()) {
            return;
        }

        const checkForLink = () => {
            const downloadButton = document.querySelector('a#download');
            if (downloadButton && downloadButton.href) {
                handleDownloadLink(downloadButton);
                return true;
            }

            const downloadElement = document.querySelector('#download');
            if (downloadElement && downloadElement.tagName === 'A' && downloadElement.href) {
                handleDownloadLink(downloadElement);
                return true;
            }

            const pasteindexLinks = document.querySelectorAll('a[href*="pasteindex.com/goto.php"]');
            for (const link of pasteindexLinks) {
                const href = link.href.toLowerCase();
                if (!href.includes('pasteindex.com/goto.php?url=') ||
                    href.includes('title=pasteindex') ||
                    href.includes('title=home') ||
                    link.textContent.toLowerCase().includes('pasteindex')) {
                    continue;
                }
                handleDownloadLink(link);
                return true;
            }

            const downloadLinks = document.querySelectorAll('a[href]');
            for (const link of downloadLinks) {
                const href = link.href.toLowerCase();
                const text = link.textContent.toLowerCase();
                if ((href.includes('download') || text.includes('download')) &&
                    !href.includes('#') && !href.includes('javascript:') &&
                    !href.includes('pasteindex.com')) {
                    handleDownloadLink(link.href);
                    return true;
                }
            }

            return false;
        };

        if (checkForLink()) return;

        const observer = new MutationObserver(() => {
            if (checkForLink()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        let attempts = 0;
        const interval = setInterval(() => {
            if (checkForLink() || attempts >= 100) {
                clearInterval(interval);
            }
            attempts++;
        }, 100);
    };

    const handlePasteIndex = () => {
        const rawUrl = new URLSearchParams(window.location.search).get('url');
        if (rawUrl) {
            try {
                const decodedUrl = decodeURIComponent(rawUrl);
                if (decodedUrl) {
                    handleDownloadLink(decodedUrl);
                    return;
                }
            } catch (e) {
                console.log('[Tampermonkey] Error decoding URL parameter:', e);
            }
        }

        const currentUrl = window.location.href;
        const urlParams = new URLSearchParams(window.location.search);
        if (currentUrl.includes('pasteindex.com') && !currentUrl.includes('/goto.php') &&
            (urlParams.has('url') || document.referrer.includes('kits4beats.com'))) {
            console.log('[Tampermonkey] Detected pasteindex redirect page from kits4beats, waiting for download link to appear...');
        }

        const checkForDownloadLink = () => {
            const linkText = document.querySelector('#piLinkText');
            if (linkText && linkText.textContent) {
                const url = linkText.textContent.trim();
                if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                    handleDownloadLink(url);
                    return true;
                }
            }

            const rawUrlDiv = document.querySelector('div.raw-url#rawDisplay');
            if (rawUrlDiv) {
                const linkBox = rawUrlDiv.querySelector('.link-box');
                if (linkBox) {
                    const text = linkBox.textContent.trim();
                    if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
                        handleDownloadLink(text);
                        return true;
                    }
                }

                const anchor = rawUrlDiv.querySelector('a[href]');
                if (anchor && anchor.href) {
                    handleDownloadLink(anchor.href);
                    return true;
                }
            }

            const allElements = document.querySelectorAll('*');
            for (const element of allElements) {
                if (element.children.length === 0) {
                    const text = element.textContent.trim();
                    if (text && (text.startsWith('http://') || text.startsWith('https://')) &&
                        !text.includes('pasteindex.com') && text.length > 10) {
                        handleDownloadLink(text);
                        return true;
                    }
                }
            }

            const allAnchors = document.querySelectorAll('a[href]');
            for (const anchor of allAnchors) {
                const href = anchor.href.toLowerCase();
                if ((href.startsWith('http://') || href.startsWith('https://')) &&
                    !href.includes('pasteindex.com') && !href.includes('#') &&
                    !href.includes('javascript:') && !href.includes('mailto:')) {
                    handleDownloadLink(anchor.href);
                    return true;
                }
            }

            return false;
        };

        if (checkForDownloadLink()) return;

        const observer = new MutationObserver(() => {
            if (checkForDownloadLink()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        let attempts = 0;
        const interval = setInterval(() => {
            if (checkForDownloadLink() || attempts >= 200) {
                clearInterval(interval);
            }
            attempts++;
        }, 100);
    };

    const globalTimeout = setTimeout(() => {
        console.log('[Tampermonkey] Script timed out after 30 seconds');
    }, 30000);

    if (window.location.hostname === 'kits4beats.com') {
        console.log('[Tampermonkey] Running on kits4beats.com - Version 1.3.4');
        handleKits4Beats();
        clearTimeout(globalTimeout);
    } else if (window.location.hostname === 'pasteindex.com') {
        console.log('[Tampermonkey] Running on pasteindex.com - Version 1.3.4');
        handlePasteIndex();
        clearTimeout(globalTimeout);
    } else {
        console.log('[Tampermonkey] Script loaded but not on target domain:', window.location.hostname);
        clearTimeout(globalTimeout);
    }
})();
