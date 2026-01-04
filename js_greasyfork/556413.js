// ==UserScript==
// @name         Auto Scroll for YouTube Shorts, plus tracker remover
// @namespace    http://tampermonkey.net/
// @version      5.4
// @description  Auto Scroll, also skips SponsorBlock videos, thumbs down auto scrolls to next video, tracker remover from share link
// @author       Justn
// @match        https://www.youtube.com/shorts/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556413/Auto%20Scroll%20for%20YouTube%20Shorts%2C%20plus%20tracker%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/556413/Auto%20Scroll%20for%20YouTube%20Shorts%2C%20plus%20tracker%20remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isAutoEnabled = localStorage.getItem('autoScrollEnabled') !== 'false';
    let autoScrollOnDownvote = localStorage.getItem('autoScrollOnDownvote') !== 'false';

    function saveSettings() {
        localStorage.setItem('autoScrollEnabled', isAutoEnabled);
        localStorage.setItem('autoScrollOnDownvote', autoScrollOnDownvote);
    }

    const pill = document.createElement('div');
    pill.style.cssText = 'position:fixed;bottom:20px;right:20px;width:70px;height:50px;background:#ff0000;color:black;border-radius:25px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:9999;box-shadow:0 4px 8px rgba(0,0,0,0.3);user-select:none;font:bold 16px Arial;';
    pill.textContent = isAutoEnabled ? 'AUTO' : 'OFF';
    document.body.appendChild(pill);

    function updatePill() {
        pill.textContent = isAutoEnabled ? 'AUTO' : 'OFF';
        pill.style.backgroundColor = isAutoEnabled ? '#ff0000' : '#666666';
    }

    pill.addEventListener('click', function (e) {
        e.stopPropagation();
        isAutoEnabled = !isAutoEnabled;
        saveSettings();
        updatePill();
    });

    pill.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        if (window.customMenu) window.customMenu.remove();
        const menu = document.createElement('div');
        menu.style.cssText = 'position:fixed;background:#1e1e1e;border:1px solid #444;border-radius:8px;padding:8px 0;color:white;font-size:13px;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,0.3);min-width:180px;';
        function createItem(text, checked, callback) {
            const item = document.createElement('div');
            item.style.cssText = 'padding:10px 16px;cursor:pointer;white-space:nowrap;';
            item.textContent = (checked ? '✓ ' : '○ ') + text;
            item.onmouseover = function () { item.style.background = '#333'; };
            item.onmouseout = function () { item.style.background = 'transparent'; };
            item.onclick = function () {
                callback();
                saveSettings();
                menu.remove();
            };
            menu.appendChild(item);
        }
        createItem('Auto scroll on thumbs down', autoScrollOnDownvote, function () { autoScrollOnDownvote = !autoScrollOnDownvote; });
        document.body.appendChild(menu);
        window.customMenu = menu;
        setTimeout(function () {
            const menuRect = menu.getBoundingClientRect();
            let left = e.pageX - 90;
            let top = e.pageY - menuRect.height - 10;
            if (left < 10) left = 10;
            if (left + menuRect.width > window.innerWidth - 10) left = window.innerWidth - menuRect.width - 10;
            if (top < 10) top = e.pageY + 10;
            if (top + menuRect.height > window.innerHeight - 10) top = window.innerHeight - menuRect.height - 10;
            menu.style.left = left + 'px';
            menu.style.top = top + 'px';
        }, 0);
        document.addEventListener('click', function () { menu.remove(); }, { once: true });
    });

    function goToNext() {
        const event = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            code: 'ArrowDown',
            keyCode: 40,
            which: 40,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    const observer = new MutationObserver(function () {
        const downvoteBtns = document.querySelectorAll('button[aria-label*="Dislike this video"], button[aria-label*="dislike"][aria-pressed]');
        downvoteBtns.forEach(function (btn) {
            if (!btn.dataset.hooked) {
                btn.dataset.hooked = 'true';
                btn.addEventListener('click', function () {
                    if (isAutoEnabled && autoScrollOnDownvote) {
                        setTimeout(goToNext, 150);
                    }
                });
            }
        });
        const sponsorOverlay = document.querySelector('.ytp-sponsor-skip-button, .sbSkipButton, [data-sb-segment]');
        if (sponsorOverlay) goToNext();
        const video = document.querySelector('ytd-reel-video-renderer[is-active] video');
        if (video && !video.dataset.hooked) {
            video.dataset.hooked = 'true';
            video.addEventListener('ended', function () {
                if (isAutoEnabled) goToNext();
            });
            video.addEventListener('timeupdate', function () {
                if (isAutoEnabled && video.duration && !isNaN(video.duration) && video.currentTime >= video.duration - 0.2) {
                    goToNext();
                }
            });
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const shareObserver = new MutationObserver(function () {
        const input = document.querySelector('#share-url');
        if (input && input.value && input.value.includes('si=')) {
            input.value = input.value.split('?')[0];
        }
    });
    shareObserver.observe(document.body, { childList: true, subtree: true });

    // Fixed pill hide/show on navigation
    const hidePill = () => pill.style.display = 'none';
    const showPill = () => {
        if (location.pathname.startsWith('/shorts/')) {
            pill.style.display = 'flex';
            updatePill();
        }
    };

    window.addEventListener('yt-navigate-start', hidePill);
    window.addEventListener('yt-navigate-finish', showPill);
    window.addEventListener('popstate', showPill);

    // Initial check
    showPill();

    setInterval(function () {
        if (!isAutoEnabled) return;
        if (document.querySelector('.ytp-sponsor-skip-button, .sbSkipButton, [data-sb-segment]')) {
            goToNext();
            return;
        }
        const video = document.querySelector('ytd-reel-video-renderer[is-active] video');
        if (!video || isNaN(video.duration)) return;
        if (video.currentTime < 0.5) updatePill();
        if (video.currentTime >= video.duration - 0.2) goToNext();
    }, 100);

    updatePill();
})();