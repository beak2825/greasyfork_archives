// ==UserScript==
// @name         TMDB - Disable Video Thumbnails & Hover Preview
// @namespace    https://greasyfork.org/users/yourname
// @version      1.2
// @description  Completely disables TMDB video poster previews (hover autoplay)
// @author       Grok
// @match        https://www.themoviedb.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556187/TMDB%20-%20Disable%20Video%20Thumbnails%20%20Hover%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/556187/TMDB%20-%20Disable%20Video%20Thumbnails%20%20Hover%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Method 1: Replace video posters with their static fallback image
    const observer = new MutationObserver(() => {
        document.querySelectorAll('.video[data-src]').forEach(video => {
            if (video.parentElement && video.parentElement.dataset.poster) {
                const posterUrl = video.parentElement.dataset.poster;
                const img = document.createElement('img');
                img.src = posterUrl;
                img.style.cssText = 'width:100%; height:100%; object-fit:cover;';
                img.className = video.className;
                video.parentElement.replaceChild(img, video);
            }
        });

        // Also kill any remaining <video> elements in posters
        document.querySelectorAll('div.card video').forEach(v => {
            v.pause();
            v.removeAttribute('src');
            v.load();
            v.remove();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Immediate cleanup on page load
    document.querySelectorAll('video').forEach(v => {
        if (v.closest('.card') || v.closest('.image')) {
            v.pause();
            v.src = '';
            v.remove();
        }
    });

    // Optional: inject CSS to be extra sure
    const style = document.createElement('style');
    style.textContent = `
        video { display: none !important; }
        .card img, .image img { display: block !important; }
        .no_image video { display: none !important; }
    `;
    document.head.appendChild(style);
})();