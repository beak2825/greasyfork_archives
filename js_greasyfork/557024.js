// ==UserScript==
// @name         YouTube - Hover + Q = Add to Queue
// @namespace    http://tampermonkey.net/
// @version      6.5
// @description  Hover → Q → instantly add to queue (works even when video preview is playing)
// @author       Grok × me
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557024/YouTube%20-%20Hover%20%2B%20Q%20%3D%20Add%20to%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/557024/YouTube%20-%20Hover%20%2B%20Q%20%3D%20Add%20to%20Queue.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let hovered = null;
    let isProcessing = false;

    // HOVER DETECTION – tahan preview video
    document.addEventListener('mouseover', e => {
        let target = e.target;

        if (target.id === 'movie_player' || target.closest('#movie_player, #ytd-player, .html5-video-container')) {
            const thumbnail = target.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-playlist-video-renderer, ytd-reel-item-renderer')
                           || document.elementFromPoint(e.clientX, e.clientY)?.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-playlist-video-renderer, ytd-reel-item-renderer');
            if (thumbnail) hovered = thumbnail;
            return;
        }

        const normal = target.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-playlist-video-renderer, ytd-reel-item-renderer');
        if (normal) hovered = normal;
    }, true);

    // ENGLISH TOAST ONLY
    const toast = (msg, ok = true) => {
        const old = document.getElementById('grokq');
        if (old) old.remove();
        const el = document.createElement('div');
        el.id = 'grokq';
        el.textContent = msg;
        el.style.cssText = `position:fixed;bottom:28px;left:28px;padding:9px 20px;border-radius:50px;background:${ok?'#00d26a':'#ff3b30'};color:#fff;font:700 13px 'Roboto';z-index:999999;box-shadow:0 6px 20px rgba(0,0,0,0.4);pointer-events:none;opacity:0;transform:translateY(10px);transition:all .3s ease;`;
        document.body.appendChild(el);
        requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
        setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(10px)'; }, 1200);
        setTimeout(() => el.remove(), 1600);
    };

    // MAIN LOGIC (tidak diubah sama sekali)
    document.addEventListener('keydown', e => {
        if (e.key.toLowerCase() !== 'q' || e.ctrlKey || e.altKey || e.metaKey || isProcessing) return;
        if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        if (!hovered) return toast('Hover a video first', false);

        isProcessing = true;

        const menuBtn = hovered.querySelector('button.yt-spec-button-shape-next--icon-button, button[aria-label*="aksi"], button[aria-label*="action"], button-view-model button');
        if (!menuBtn) { isProcessing = false; return toast('Menu button not found', false); }

        menuBtn.click();

        let attempts = 0;
        const turbo = setInterval(() => {
            attempts++;
            const item = Array.from(document.querySelectorAll('yt-list-item-view-model, ytd-menu-service-item-renderer'))
                .find(el => el.offsetParent && /antrean|queue|play next/i.test(el.textContent));

            if (item) {
                item.click();
                clearInterval(turbo);
                toast('Added to queue');
                setTimeout(() => document.body.click(), 50);
                setTimeout(() => isProcessing = false, 150);
            } else if (attempts > 40) {
                clearInterval(turbo);
                document.body.click();
                toast('Timeout', false);
                isProcessing = false;
            }
        }, 10);
    }, true);

    console.log('%cYouTube Hover + Q → GOD MODE v6.1 (English Toast) ACTIVE!','color:#00ffff;font-size:18px;font-weight:900;');
})();