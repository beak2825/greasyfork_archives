// ==UserScript==
// @name         2nd version - Android Firefox simplified
// @version      6.11
// @description  Minimal: find items, detect video source matching pattern, show floating button that creates a tappable anchor for download (Android Firefox)
// @match        *://*/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/552015/2nd%20version%20-%20Android%20Firefox%20simplified.user.js
// @updateURL https://update.greasyfork.org/scripts/552015/2nd%20version%20-%20Android%20Firefox%20simplified.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // Platform detection: do not exit — only adapt behavior for Android
    const IS_ANDROID = /Android/i.test(navigator.userAgent);
    console.log('[TM] Platform detection — Android:', IS_ANDROID, ' UA:', navigator.userAgent);

    const TARGET_CLASS = 'col-md-6 col-lg-4 col-xl-3 item';
    const SELECTOR = '.' + TARGET_CLASS.split(/\s+/).join('.');
    const VIDEO_SRC_REGEX = /^https:\/\/video\.pornfhd\.com\/p\/f\/\w+\/([\w-]+)\/preview\.png$/;

    let currentHoveredItem = null;
    let btn = null;

    // create single floating button (reused)
    function ensureButton() {
        if (btn) return btn;
        console.log('[TM] create floating button');
        btn = document.createElement('button');
        btn.id = 'tm-download-btn';
        btn.textContent = '⬇ Download';
        Object.assign(btn.style, {
            position: 'fixed',
            display: 'none',
            zIndex: '999999',
            padding: '6px 10px',
            background: '#17a2b8',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '13px',
            cursor: 'pointer',
            touchAction: 'manipulation',
            pointerEvents: 'auto', // Ensure the button is clickable
        });
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const url = btn.getAttribute('data-video-src');
            const filename = btn.getAttribute('data-filename') || 'video.mp4';
            if (!url) {
                console.log('[TM] button clicked but no video-src set');
                return;
            }
            console.log('[TM] button clicked — replacing with anchor helper for', url, filename);

            // Get the current position of the button
            const { top, left } = btn.style;

            // Remove the floating button
            btn.style.display = 'none';

            // Create the anchor helper for downloading at the same position
            createAnchorDownload(url, filename, top, left);
        });
        document.body.appendChild(btn);
        console.log('[TM] Floating button created:', btn);
        return btn;
    }

    // anchor helper: create visible tappable link for Android users
    function createAnchorDownload(url, filename, top, left) {
        console.log('[TM] createAnchorDownload', { url, filename });
        try {
            // Remove previous anchor helper if it exists
            const prev = document.getElementById('tm-anchor-download-helper');
            if (prev) prev.remove();

            // Truncate the filename to the first 8 characters for the button text
            const truncatedFilename = filename.substring(0, 8);

            const link = document.createElement('a');
            link.id = 'tm-anchor-download-helper';
            link.href = url;
            link.download = filename;
            link.target = '_blank';
            link.textContent = `Download ${truncatedFilename}`;
            Object.assign(link.style, {
                position: 'fixed',
                top: top, // Use the same top position as the button
                left: left, // Use the same left position as the button
                padding: '10px 16px',
                background: '#28a745',
                color: '#fff',
                borderRadius: '8px',
                zIndex: '1000000',
                textDecoration: 'none',
                display: 'inline-block',
            });
            document.body.appendChild(link);
            console.log('[TM] anchor helper appended at button position; user should tap it to download');
        } catch (e) {
            console.error('[TM] createAnchorDownload failed', e);
        }
    }

    // find matching video source in item
    function getVideoSourceFromItem(item) {
        if (!item) return null;
        const video = item.querySelector('video');
        if (!video) return null;
        const src = video.querySelector('source')?.src;
        if (!src) return null;
        console.warn(src);

        // const match = src.match(VIDEO_SRC_REGEX);
        // if (!match) return null;
        return { src, baseName: src };
    }

    // show button near item (fixed positioning using item bounding rect)
    function showButtonForItem(item, videoInfo) {
        if (!item || !videoInfo) {
            console.log('[TM] showButtonForItem: missing item or videoInfo');
            hideButton();
            return;
        }

        // Ensure the button exists
        ensureButton();

        // Prevent unnecessary repositioning if the button is already shown for the same item
        if (currentHoveredItem === item) {
            console.log('[TM] Button already shown for this item; skipping repositioning');
            return;
        }

        // Update the current hovered item
        currentHoveredItem = item;

        // Get the bounding rectangle of the hovered item
        const rect = item.getBoundingClientRect();

        // Compute a fixed position near the item's top-right (clipped to viewport)
        const top = Math.max(8, Math.min(window.innerHeight - 48, rect.top + 8));
        const left = Math.max(8, Math.min(window.innerWidth - 120, rect.right - 100));

        // Set the calculated position for the button
        btn.style.top = `${top}px`;
        btn.style.left = `${left}px`;
        btn.style.display = 'block';
        btn.setAttribute('data-video-src', videoInfo.src);

        // Filename based on baseName or image alt (sanitized)
        let filenameBase = videoInfo.baseName || 'video';
        const img = item.querySelector('img');
        if (img && img.alt && img.alt.trim()) {
            filenameBase = img.alt.trim().replace(/[\\/:*?"<>|]+/g, '_').replace(/\s+/g, '_').substring(0, 100);
        }
        const ext = videoInfo.src.split('.').pop().split(/\?|#/)[0] || 'mp4';
        btn.setAttribute('data-filename', `${filenameBase}.${ext}`);

        console.log('[TM] Floating button shown for item, url:', videoInfo.src);
    }

    // hide button (only if the mouse leaves the item and not the button itself)
    function hideButton() {
        if (!btn) return;

        // Check if the mouse is still over the button
        const isMouseOverButton = btn.matches(':hover');
        if (isMouseOverButton) {
            console.log('[TM] Mouse is still over the button; not hiding it');
            return;
        }

        btn.style.display = 'none';
        btn.removeAttribute('data-video-src');
        btn.removeAttribute('data-filename');

        // Remove any existing anchor helper
        const anchor = document.getElementById('tm-anchor-download-helper');
        if (anchor) anchor.remove();

        // Clear the current hovered item
        currentHoveredItem = null;
    }

    // activation on pointerover / touchstart: always update the button for the hovered item
    function handleActivateItem(item) {
        if (!item || !item.matches(SELECTOR)) {
            console.log('[TM] handleActivateItem: Ignoring non-TARGET_CLASS element');
            return;
        }

        console.log('[TM] handleActivateItem for', item);

        // Always update the button, even if the same item is hovered again
        const videoInfo = getVideoSourceFromItem(item);
        if (!videoInfo) {
            console.log('[TM] No matching video in item; hiding button');
            hideButton();
            return;
        }
        showButtonForItem(item, videoInfo);
    }

    // helper: try to resolve a matching item from an arbitrary event target
    function findClosestItem(target) {
        if (!target) return null;
        // 1) direct closest match for configured selector
        let item = target.closest(SELECTOR);
        if (item) return item;
        // 2) if target is inside a <video>, use video.closest(SELECTOR)
        const videoAncestor = target.closest('video');
        if (videoAncestor) {
            item = videoAncestor.closest(SELECTOR);
            if (item) return item;
            // fallback: use video parent element as candidate (some sites wrap video inside non-item nodes)
            if (videoAncestor.parentElement) {
                let p = videoAncestor.parentElement;
                for (let i = 0; i < 6 && p; i++, p = p.parentElement) { // climb a few levels
                    if (p.matches && p.matches(SELECTOR)) return p;
                }
                return videoAncestor.parentElement;
            }
        }
        // 3) fallback: climb up from target and return first element containing a <video>
        let p = target;
        for (let i = 0; i < 8 && p; i++, p = p.parentElement) {
            if (p.querySelector && p.querySelector('video')) return p;
        }
        // no reasonable item found
        return null;
    }

    // Delegated listeners (improved): multiple event types and fallbacks
    function setupListeners() {
        console.log('[TM] setupListeners installing enhanced handlers');

        // Helper activator used by all events
        function tryActivateFromEvent(e) {
            const target = e.target;
            const item = findClosestItem(target);
            if (!item || !item.matches(SELECTOR)) {
                // Ignore hover events on non-TARGET_CLASS elements
                console.log('[TM] tryActivateFromEvent: Ignoring non-TARGET_CLASS element');
                return;
            }
            handleActivateItem(item);
        }

        // pointerenter/pointerover for mouse & pen
        document.addEventListener('pointerenter', e => {
            tryActivateFromEvent(e);
        }, true);

        document.addEventListener('pointerover', e => {
            tryActivateFromEvent(e);
        }, true);

        // pointerleave/mouseout to hide the button
        // document.addEventListener('pointerleave', e => {
        //     const target = e.target;
        //     const item = findClosestItem(target);
        //     if (item && currentHoveredItem === item) {
        //         console.log('[TM] pointerleave detected; hiding button');
        //         hideButton();
        //     }
        // }, true);

        // pointermove fallback (touch devices sometimes only emit move)
        let lastMove = 0;
        document.addEventListener('pointermove', e => {
            const now = Date.now();
            if (now - lastMove < 300) return; // throttle
            lastMove = now;
            tryActivateFromEvent(e);
        }, { passive: true, capture: true });

        // click/tap fallback: user taps item to activate on touch-first pages
        document.addEventListener('click', e => {
            tryActivateFromEvent(e);
        }, true);

        // touchend explicit fallback (some Android browsers)
        document.addEventListener('touchend', e => {
            tryActivateFromEvent(e);
        }, { passive: true, capture: true });

        console.log('[TM] enhanced listeners attached (pointerenter, pointerover, pointerleave, pointermove, click, touchend)');
    }

    // observe dynamically added videos to collect info (optional diagnostic)
    function observeVideos() {
        const mo = new MutationObserver(muts => {
            for (const m of muts) {
                for (const n of m.addedNodes) {
                    if (n.nodeType !== 1) continue;
                    if (n.tagName?.toLowerCase() === 'video') {
                        console.log('[TM] observed new <video>', n);
                    }
                    n.querySelectorAll?.('video').forEach(v => console.log('[TM] observed nested <video>', v));
                }
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });
        console.log('[TM] MutationObserver for videos started');
    }

    // init (add more diagnostics)
    function run() {
        console.log('[TM] init run() starting');
        ensureButton();
        console.log('[TM] ensureButton done — btn present:', !!btn);
        setupListeners();
        observeVideos();

        // diagnostics: how many elements match SELECTOR and how many <video> present
        let matched = 0;
        try {
            matched = document.querySelectorAll(SELECTOR).length;
        } catch (e) {
            console.warn('[TM] SELECTOR query failed', e);
        }
        const videos = document.querySelectorAll('video').length;
        console.log('[TM] Diagnostic: elements matching SELECTOR:', SELECTOR, matched, '; total <video> elements:', videos);

        // If no configured items matched, log a note and list first few video parents to help debugging
        if (matched === 0 && videos > 0) {
            const vids = Array.from(document.querySelectorAll('video')).slice(0, 5);
            console.log('[TM] No SELECTOR matches; sample videos and their nearest ancestors (for debugging):');
            vids.forEach((v, i) => {
                let p = v.parentElement;
                let nearest = null;
                for (let j = 0; j < 6 && p; j++, p = p.parentElement) {
                    if (p.matches && p.matches(SELECTOR)) { nearest = p; break; }
                }
                console.log(`[TM] video[${i}] src=${v.querySelector('source')?.src || 'n/a'}, nearestItem=${!!nearest}, parentTag=${v.parentElement?.tagName}`);
            });
        }

        // initial scan log for developer
        document.querySelectorAll(SELECTOR).forEach(item => {
            const vi = getVideoSourceFromItem(item);
            if (vi) console.log('[TM] initial scan found video in item', vi, item);
        });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') run();
    else document.addEventListener('DOMContentLoaded', run, { once: true });

})();