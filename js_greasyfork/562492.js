// ==UserScript==
// @name         RED - YouTube Links → Embed
// @namespace    https://greasyfork.org/en/users/1559680-ewol
// @version      0.1
// @description  Replace YouTube links with an embedded player
// @author       Ewol
// @match        https://redacted.sh/*
// @grant        none
// @license      GPL v3.0
// @downloadURL https://update.greasyfork.org/scripts/562492/RED%20-%20YouTube%20Links%20%E2%86%92%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/562492/RED%20-%20YouTube%20Links%20%E2%86%92%20Embed.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */

(function () {
    'use strict';

    // ------------------------------------------------------------------
    // Config
    // ------------------------------------------------------------------
    const MAX_PLAYER_WIDTH = 560;   // Max width (will shrink to fit post)
    const AUTOPLAY         = false;
    const LOOP             = true;
    const START_MUTED      = true;

    // ------------------------------------------------------------------
    // Extract YouTube ID
    // ------------------------------------------------------------------
    function getYoutubeId(url) {
        try {
            const u = new URL(url);
            if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0];
            if (u.hostname.endsWith('youtube.com')) {
                if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2];
                if (u.pathname.startsWith('/embed/'))  return u.pathname.split('/')[2];
                return u.searchParams.get('v');
            }
        } catch (_) {}
        return null;
    }

    // ------------------------------------------------------------------
    // Build embed URL
    // ------------------------------------------------------------------
    function buildEmbedUrl(vid) {
        const params = new URLSearchParams({
            autoplay: AUTOPLAY ? '1' : '0',
            mute: START_MUTED ? '1' : '0',
            loop: LOOP ? '1' : '0',
            playlist: LOOP ? vid : '',
            rel: '0',
            modestbranding: '1',
            controls: '1',
            fs: '1',
            iv_load_policy: '3',
            cc_load_policy: '0',
        });
        return `https://www.youtube.com/embed/${vid}?${params.toString()}`;
    }

    // ------------------------------------------------------------------
    // Replace link with responsive player (safe inside <td>)
    // ------------------------------------------------------------------
    function replaceLink(a) {
        const href = a.href;
        const vid  = getYoutubeId(href);
        if (!vid) return;

        // Find the post body cell (closest <td> that is NOT .avatar)
        const postCell = a.closest('td') || a.closest('div');
        if (!postCell || postCell.classList.contains('avatar')) return;

        // Create wrapper that respects table cell width
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            display: block;
            width: 100%;
            max-width: ${MAX_PLAYER_WIDTH}px;
            margin: 14px auto;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            background: #000;
            box-sizing: border-box;
            contain: layout style; /* Prevents layout bleed */
            position: relative;
        `;

        const iframe = document.createElement('iframe');
        iframe.style.cssText = `
            width: 100%;
            height: auto;
            aspect-ratio: 16 / 9;
            border: 0;
            display: block;
        `;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
        iframe.allowFullscreen = true;
        iframe.src = buildEmbedUrl(vid);
        iframe.title = 'YouTube video';
        wrapper.appendChild(iframe);

        // Caption
        const caption = document.createElement('div');
        caption.textContent = a.textContent.trim() || href;
        caption.style.cssText = `
            margin-top: 6px;
            font-size: 0.85em;
            color: #aaa;
            text-align: center;
            word-break: break-all;
            padding: 0 8px;
        `;
        wrapper.appendChild(caption);

        // Insert *before* the link and remove link
        a.parentNode.insertBefore(wrapper, a);
        a.remove(); // safer than replaceChild (preserves surrounding text)
    }

    // ------------------------------------------------------------------
    // CSS: Force YouTube controls + prevent table overflow
    // ------------------------------------------------------------------
    const style = document.createElement('style');
    style.textContent = `
        /* Responsive iframe inside table cells */
        td > div > iframe[src*="youtube.com/embed"],
        .post_body > div > iframe[src*="youtube.com/embed"] {
            min-height: 200px !important;
        }
        /* Keep control bar visible */
        .html5-video-player .ytp-chrome-bottom {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .ytp-chrome-bottom .ytp-volume-panel { width: 80px !important; }
        .ytp-volume-slider { width: 60px !important; }

        /* Critical: Stop table cell overflow */
        td {
            overflow: hidden !important;
        }
        /* Contain layout inside post */
        div[data-yt-wrapper] {
            contain: layout style !important;
        }
    `;
    document.head.appendChild(style);

    // ------------------------------------------------------------------
    // Process links
    // ------------------------------------------------------------------
    function processLinks() {
        document.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]').forEach(a => {
            if (!a.dataset.ytProcessed) {
                a.dataset.ytProcessed = 'true';
                replaceLink(a);
            }
        });
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processLinks);
    } else {
        processLinks();
    }

    // Watch for new posts
    new MutationObserver(processLinks).observe(document.body, {
        childList: true,
        subtree: true
    });
})();