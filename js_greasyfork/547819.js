// ==UserScript==
// @name         YouTube Min Views Filter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  10.000 izlenmenin altındaki videoları gizler
// @author       Sefa AVAN
// @license      MIT
// @match        http://*.youtube.com/*
// @match        http://youtube.com/*
// @match        https://*.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547819/YouTube%20Min%20Views%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/547819/YouTube%20Min%20Views%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MIN_VIEWS = 10000; // Bu değeri değiştirebilirsiniz

    function parseViews(text) {
        text = text.replace(/\s/g,'');
        if (text.includes('B')) return parseFloat(text.replace('B','').replace(',','.')) * 1000;
        if (text.includes('Mn')) return parseFloat(text.replace('Mn','').replace(',','.')) * 1000000;
        return parseInt(text.replace(/[^0-9]/g,'')) || 0;
    }

    function filterVideos() {
        const videos = Array.from(document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer'));
        videos.forEach(v => {
            const viewSpan = Array.from(v.querySelectorAll('span')).find(span => span.innerText.includes('görüntüleme'));
            if (!viewSpan) return;
            const views = parseViews(viewSpan.innerText);
            v.style.display = (views >= MIN_VIEWS) ? '' : 'none';
        });
    }

    // İlk filtreleme
    filterVideos();

    // Yeni videolar yüklendikçe filtre uygula
    const observer = new MutationObserver(() => {
        filterVideos();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
