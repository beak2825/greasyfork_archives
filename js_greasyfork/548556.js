// ==UserScript==
// @name         Invidious Clean View with List View of Thumbnails, and Threshold Control
// @namespace    http://tampermonkey.net/
// @version      2.3
// @license      MIT
// @description  Clean Invidious: remove short/hashtag videos, shorts links, login/subscribe prompts, with adjustable short video threshold and persistent settings.
// @match        https://yewtu.be/search?*
// @match        https://inv.nadeko.net/search?*
// @match        https://invidious.nerdvpn.de/search?*
// @match        https://inv.perditum.com/search?*
// @match        https://invidious.f5.si/search?*
// @match        https://*/watch*
// @match        https://*/channel/*
// @match        https://*/feed/popular*
// @match        https://*/feed/trending*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548556/Invidious%20Clean%20View%20with%20List%20View%20of%20Thumbnails%2C%20and%20Threshold%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/548556/Invidious%20Clean%20View%20with%20List%20View%20of%20Thumbnails%2C%20and%20Threshold%20Control.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === EARLY HIDE (only UI clutter, not videos!) ===
    function injectEarlyHideCSS() {
        if (!isSupportedPage()) return; // only run on watch/channel/feed pages

        const style = document.createElement('style');
        style.id = 'early-hide-style';
        style.textContent = `
        a[href*="/shorts"],
        .user-field,
        .flex-right > .video-data,
        .pure-u-lg-1-5.pure-u-1:nth-of-type(3),
        .h-box:nth-of-type(3),
        .h-box:nth-of-type(5),
        .feed-menu,
        .comments,
        views,
        footer,
        a[href*="/login?"] {
            display: none !important;
        }
        .h-box:nth-of-type(3),
        .h-box > [href^="/channel/"] {
            display: none !important;
        }
    `;
        document.documentElement.appendChild(style);
    }

    // Load short video threshold from localStorage
    let SHORT_VIDEO_THRESHOLD_SECONDS = parseInt(localStorage.getItem('shortVideoThreshold'), 10) || 63;

    function removeEarlyHideCSS() {
        const style = document.getElementById('early-hide-style');
        if (style) style.remove();
    }

    function injectListViewCSS() {
        if (document.getElementById('list-view-style')) return;
        const style = document.createElement('style');
        style.id = 'list-view-style';
        style.textContent = `
        /* Only apply list view styles to feeds/search/channel pages */
        body:not(.watch-page) .thumbnail img {
            display: none !important;
        }

        body:not(.watch-page) .pure-u-1.pure-u-md-1-4 {
            width: 100% !important;
            display: block !important;
            margin-bottom: 10px;
            border-bottom: 1px solid #444;
            padding-bottom: 10px;
        }

        body:not(.watch-page) .video-card-row.flexible {
            flex-wrap: wrap;
            gap: 10px;
        }

        body:not(.watch-page) .video-card-row a {
            font-weight: bold;
            display: block;
        }

        body:not(.watch-page) .channel-name {
            color: #888;
            font-size: 0.9em;
        }
    `;
        document.documentElement.appendChild(style);
    }

    // Mark body on watch pages
    function markPageType() {
        if (location.pathname.startsWith("/watch")) {
            document.body.classList.add("watch-page");
        } else {
            document.body.classList.remove("watch-page");
        }
    }

    function removeListViewCSS() {
        const style = document.getElementById('list-view-style');
        if (style) style.remove();
    }

    // Toggle UI creation
    function createToggleUI() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '15px';
        container.style.right = '15px';
        container.style.backgroundColor = 'rgba(0,0,0,0.7)';
        container.style.color = 'white';
        container.style.padding = '8px 12px';
        container.style.borderRadius = '8px';
        container.style.zIndex = '9999';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.fontSize = '14px';
        container.style.userSelect = 'none';
        container.style.cursor = 'default';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '8px';

        const label = document.createElement('label');
        label.textContent = 'List View';
        label.style.cursor = 'pointer';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        const enabled = localStorage.getItem('invidiousListViewEnabled');
        checkbox.checked = (enabled === null || enabled === 'true');
        checkbox.style.cursor = 'pointer';

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                injectListViewCSS();
                localStorage.setItem('invidiousListViewEnabled', 'true');
            } else {
                removeListViewCSS();
                localStorage.setItem('invidiousListViewEnabled', 'false');
            }
        });

        label.prepend(checkbox);
        container.appendChild(label);
        document.body.appendChild(container);
    }

    function createWidget() {
        const widgetContainer = document.createElement('div');
        widgetContainer.style.position = 'fixed';
        widgetContainer.style.top = '10px';   // Move down so it doesn’t overlap the search bar
        widgetContainer.style.right = '10px';
        widgetContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        widgetContainer.style.padding = '10px';
        widgetContainer.style.color = 'white';
        widgetContainer.style.borderRadius = '8px';
        widgetContainer.style.zIndex = '9999';
        widgetContainer.style.display = 'flex';         // vertical stack
        widgetContainer.style.flexDirection = 'column';
        widgetContainer.style.gap = '6px';              // spacing between elements

        const label = document.createElement('label');
        label.innerHTML = 'Short Video<br>Threshold<br>(seconds):';
        widgetContainer.appendChild(label);

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '30';
        input.max = '600';
        input.value = SHORT_VIDEO_THRESHOLD_SECONDS;
        input.style.width = '100%';   // full width in vertical layout
        input.addEventListener('input', () => {
            SHORT_VIDEO_THRESHOLD_SECONDS = parseInt(input.value);
            valueDisplay.textContent = input.value + 's';
            localStorage.setItem('shortVideoThreshold', input.value);
        });
        widgetContainer.appendChild(input);

        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = `${SHORT_VIDEO_THRESHOLD_SECONDS}s`;
        widgetContainer.appendChild(valueDisplay);

        document.body.appendChild(widgetContainer);
    }


    function removeShortVideos() {
        document.querySelectorAll('.pure-u-1.pure-u-md-1-4').forEach(col => {
            const timeEl = col.querySelector('.length');

            // Do not run if on playlist page of channel
            if (location.pathname.match(/^\/channel\/[^\/]+\/playlists$/)) {
                return; // Exit early if on a playlists page
            }

            // If no length element, treat it as a short and remove it
            if (!timeEl) {
                col.remove();
                return;
            }

            const parts = timeEl.textContent.trim().split(":").map(p => parseInt(p, 10));

            let totalSeconds = 0;
            if (parts.length === 3) {
                // H:MM:SS
                totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
            } else if (parts.length === 2) {
                // MM:SS
                totalSeconds = parts[0] * 60 + parts[1];
            } else {
                // Anything unexpected – remove
                col.remove();
                return;
            }

            if (totalSeconds < SHORT_VIDEO_THRESHOLD_SECONDS) {
                col.remove();
            }
        });
    }

    function removeHashtagVideos() {
        document.querySelectorAll('.pure-u-1.pure-u-md-1-4').forEach(col => {
            const titleAnchor = col.querySelector('.video-card-row a[href^="/watch"]');
            if (titleAnchor && titleAnchor.textContent.includes('#')) {
                col.remove();
            }
        });
    }

    function removeShortsLinks() {
        document.querySelectorAll('a[href*="/shorts"]').forEach(link => {
            const container = link.closest('.pure-u-1') || link.parentElement;
            container ? container.remove() : link.remove();
        });
    }

    function removeVideoData() {
        document.querySelectorAll('.flex-right > .video-data').forEach(el => el.remove());
    }

    function removeplaylist() {
        document.querySelectorAll('.pure-u-lg-1-5.pure-u-1:nth-of-type(3)').forEach(el => el.remove());
    }

    function removeSubscribe() {
        document.querySelectorAll('.user-field').forEach(el => {
            if (el.textContent.toLowerCase().includes('subscribe')) el.remove();
        });

        const subBtn = document.querySelector('#subscribe.pure-button-primary.pure-button');
        if (subBtn) subBtn.remove();

        document.querySelectorAll('.pure-button-primary.pure-button').forEach(el => {
            if (el.textContent.trim().toLowerCase() === 'subscribe') el.remove();
        });
    }

    function removeLoginLinks() {
        document.querySelectorAll('a[href*="/login?"]').forEach(link => {
            const container = link.closest('.pure-u-1') || link.parentElement;
            container ? container.remove() : link.remove();
        });
    }

    function removeYTLinks() {
        const links = document.querySelectorAll('a[href*="youtube.com"]');
        links.forEach(link => link.remove()); // removes each YouTube link from the DOM
    }

    function removeExtras() {
        const feedMenu = document.querySelector('.feed-menu');
        if (feedMenu) feedMenu.remove();

        const comments = document.querySelector('.comments');
        if (comments) comments.remove();

        const views = document.querySelector('#views');
        if (views) views.remove();

        const footer = document.querySelector('footer');
        if (footer) footer.remove();
    }

    function removeMaxResThumbnails() {
        // Remove img tags with maxres
        document.querySelectorAll('img[src*="maxres.jpg"]').forEach(img => img.remove());

        // Remove poster attributes from videos
        document.querySelectorAll('video[poster*="maxres.jpg"]').forEach(video => video.removeAttribute('poster'));

        // Remove meta tags with maxres
        document.querySelectorAll('meta[content*="maxres.jpg"]').forEach(meta => meta.remove());
    }

    function cleanAll() {
        removeShortVideos();
        removeHashtagVideos();
        removeShortsLinks();
        removeVideoData();
        removeSubscribe();
        removeLoginLinks();
        removeYTLinks();
        removeExtras();
        removeplaylist();
        removeMaxResThumbnails();
    }

    const observer = new MutationObserver(() => removeMaxResThumbnails());
    observer.observe(document, { childList: true, subtree: true });

    // Fallback: periodic cleanup for stubborn dynamic content
    setInterval(removeMaxResThumbnails, 500);

    function observeDOMChanges() {
        const observer = new MutationObserver(cleanAll);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function watchUrlChanges() {
        let lastPath = location.pathname + location.search;
        setInterval(() => {
            const currentPath = location.pathname + location.search;
            if (currentPath !== lastPath) {
                lastPath = currentPath;
                cleanAll();
            }
        }, 500);
    }

    // Utility: check if we're on a supported page
    function isSupportedPage() {
        return (
            location.pathname.startsWith("/search") ||
            location.pathname.startsWith("/channel/") ||
            location.pathname.startsWith("/feed/popular") ||
            location.pathname.startsWith("/feed/trending")
        );
    }

    // Run createWidget only on supported pages
    function setupWidgets() {
        if (!isSupportedPage()) return; // skip if not supported

        // Always add the widget
        createWidget();

        // Restore toggle state (default = true)
        const enabled = localStorage.getItem('invidiousListViewEnabled');
        if (enabled === null || enabled === 'true') {
            injectEarlyHideCSS();
            injectListViewCSS();
        }

        // Always add toggle UI
        createToggleUI();
    }

    window.addEventListener('DOMContentLoaded', () => {
        cleanAll();
        observeDOMChanges();
        watchUrlChanges();
        markPageType();
        setupWidgets(); // this now controls where the widgets and styles run
    });
})();
