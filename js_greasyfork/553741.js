// ==UserScript==
// @name         Reddit Original + External Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Download original images and external images from Reddit posts; button hides while scrolling and shows when stopped
// @author       ChatGPT
// @license      MIT
// @match        https://www.reddit.com/r/*/comments/*
// @match        https://old.reddit.com/r/*/comments/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/553741/Reddit%20Original%20%2B%20External%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/553741/Reddit%20Original%20%2B%20External%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Create minimalistic download button ---
    const btn = document.createElement('button');
    btn.innerHTML = '⬇️';
    btn.style.position = 'fixed';
    btn.style.top = '80px';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';
    btn.style.border = 'none';
    btn.style.background = 'transparent';
    btn.style.color = '#1d72b8';
    btn.style.fontSize = '28px';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'transform 0.2s, opacity 0.3s';
    btn.style.opacity = '1';
    document.body.appendChild(btn);

    // Hover effect
    btn.addEventListener('mouseenter', function() {
        btn.style.transform = 'scale(1.3)';
    });

    btn.addEventListener('mouseleave', function() {
        btn.style.transform = 'scale(1)';
    });

    // Scroll hide / show
    let scrollTimer;
    window.addEventListener('scroll', function() {
        btn.style.opacity = '0';
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            btn.style.opacity = '1';
        }, 300);
    });

    // --- Collect images in single pass ---
    function collectRedditImagesSinglePass() {
        const allImgs = [];
        const finalImgs = new Set();
        const fullIds = new Set();

        document.querySelectorAll('img').forEach(function(img) {
            const src = img.src;
            if (!src || src.startsWith('data:image') || src.includes('rlcdn.com')) return;

            const url = new URL(src);
            const host = url.host;
            const width = img.naturalWidth || img.width || 0;
            const height = img.naturalHeight || img.height || 0;

            // Skip small avatars/icons
            if (width && height && (width <= 128 && height <= 128)) return;

            const path = url.pathname;
            const name = path.split('/').pop();
            const id = name.split('.')[0];
            const previewId = name.split('-').pop().split('.')[0];

            const isIredd = host.includes('i.redd.it');
            const isPreview = host.includes('preview.redd.it');
            const isRedditHost = host.includes('reddit');

            allImgs.push({ src, isIredd, isPreview, isRedditHost, id, previewId });
            if (isIredd) fullIds.add(id);
        });

        // Filter images and log
        allImgs.forEach(function(i) {
            if (i.isIredd) {
                finalImgs.add(i.src);
                console.log('%c[ADD full] ' + i.src, 'color: green;');
            } else if (i.isPreview) {
                if (!fullIds.has(i.previewId)) {
                    finalImgs.add(i.src);
                    console.log('%c[ADD preview] ' + i.src, 'color: orange;');
                } else {
                    console.log('%c[SKIP preview duplicate] ' + i.src, 'color: gray;');
                }
            } else if (!i.isRedditHost) {
                finalImgs.add(i.src);
                console.log('%c[ADD external] ' + i.src, 'color: violet;');
            } else {
                console.log('%c[SKIP reddit UI / tracking] ' + i.src, 'color: gray;');
            }
        });

        console.log('%c[Final] total images: ' + finalImgs.size, 'color: yellow;', Array.from(finalImgs));
        return Array.from(finalImgs);
    }

    // --- Button click: download images ---
    btn.addEventListener('click', function() {
        const imgList = collectRedditImagesSinglePass();

        if (imgList.length === 0) {
            alert('No images found! Please scroll the page to load all images.');
            return;
        }

        alert('Found ' + imgList.length + ' images. Starting download (browser may prompt multiple times).');

        imgList.forEach(function(url) {
            const name = url.split('/').pop().split('?')[0];
            GM_download({ url: url, name: name, saveAs: false });
        });
    });
})();

