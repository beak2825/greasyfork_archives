// ==UserScript==
// @name         Disney+ Auto Fullscreen
// @version      1.13
// @description  Automatically enter fullscreen on Disney+ videos when clicking the Play/Continue button and it stays on! So you can binge watch all you want. Created using the following website: https://workik.com/ai-powered-javascript-code-debugger with refining done by zzzcode.ai's Code Generator and ChatGPT.
// @author       Raizuto
// @match        *://www.disneyplus.com/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/Raizuto/Tampermonkey-Scripts/
// @supportURL   https://github.com/Raizuto/Tampermonkey-Scripts/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=disneyplus.com
// @run-at       document-idle
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/553167/Disney%2B%20Auto%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/553167/Disney%2B%20Auto%20Fullscreen.meta.js
// ==/UserScript==

// Ensure the script only runs on Disney+
if (!window.location.hostname.includes('disneyplus.com')) {
    console.log('Disney+ Auto Fullscreen: not on Disney+, exiting.');
    return;
}

(function () {
    'use strict';

    const RECENT_GESTURE_MS = 3000;
    const OVERLAY_TEXT = 'Click to enter fullscreen';
    const STYLE_ID = 'dp-auto-fs-style';

    let lastUserGesture = 0;
    var manualExit = (typeof manualExit !== 'undefined') ? manualExit : false; // tracks if user manually exited fullscreen
    let suppressUntil = 0; // don't overlay or auto-FS until this time
    let rapidPlayCount = 0; // counter for programmatic play bursts
    const OVERLAY_CLASS = 'dp-auto-fs-overlay'; // unique overlay class name

    function now() { return Date.now(); }

    function markUserGesture() {
        lastUserGesture = now();
        try { document.querySelectorAll('video').forEach(v => { if (v) v._pausedByUser = false; }); } catch (e) {}
    }
    document.addEventListener('click', markUserGesture, true);
    document.addEventListener('keydown', markUserGesture, true);

    function isFullscreen() {
        return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
    }

    function findVideos(root = document) {
        const vids = [];
        function walk(node) {
            if (!node) return;
            if (node.nodeType !== 1) return;
            if (node.tagName && node.tagName.toLowerCase() === 'video') vids.push(node);
            if (node.shadowRoot) walk(node.shadowRoot);
            for (const child of node.children) walk(child);
        }
        walk(root.documentElement || root);
        return vids;
    }

    function hasControls(el) {
        if (!el) return false;
        const controlSelectors = [
            '[data-testid="player-controls"]',
            '.controls',
            '.player-controls',
            '.control-bar',
            '.controlStrip',
            '.PlayerControls',
            'button[aria-label="Play"]',
            'button[aria-label="Pause"]',
            'button[aria-label="Exit Fullscreen"]'
        ];
        try { for (const s of controlSelectors) if (el.querySelector && el.querySelector(s)) return true; } catch (e) {}
        return false;
    }

    function findPlayerContainerForVideo(v) {
        let cur = v;
        while (cur && cur !== document) {
            try {
                if (hasControls(cur)) return cur;
                if (cur.tagName) {
                    const t = cur.tagName.toLowerCase();
                    if (t === 'core-player' || (cur.matches && (cur.matches('[data-testid="player"]') || cur.matches('.Player') || cur.matches('.player')))) return cur;
                }
            } catch (e) {}
            cur = cur.parentNode || cur.host || null;
        }
        return null;
    }

    function findNearestFullscreenable(el) {
        let cur = el;
        while (cur && cur !== document) {
            if (cur.requestFullscreen || cur.webkitRequestFullscreen || cur.mozRequestFullScreen || cur.msRequestFullscreen) return cur;
            cur = cur.parentNode || cur.host || null;
        }
        return null;
    }

    // apply/remove small fullscreen CSS so video fills when document root is fullscreen
    function applyFsStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const s = document.createElement('style');
        s.id = STYLE_ID;
        s.textContent = `
            :fullscreen #hivePlayer, :-webkit-full-screen #hivePlayer, :-moz-full-screen #hivePlayer,
            :fullscreen video, :-webkit-full-screen video, :-moz-full-screen video {
                width: 100% !important;
                height: 100% !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                object-fit: contain !important;
                z-index: 2147483646 !important;
            }
        `;
        document.documentElement.appendChild(s);
    }
    function removeFsStyles() {
        const s = document.getElementById(STYLE_ID);
        if (s) s.remove();
    }

    // overlay
    let lastOverlay = null;
    function makeOverlay(parent) {
        const overlay = document.createElement('div');
        overlay.className = OVERLAY_CLASS;
        Object.assign(overlay.style, {
            position: 'absolute',
            inset: '0',
            background: 'rgba(0,0,0,0.35)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            cursor: 'pointer',
            fontSize: '18px',
            textAlign: 'center',
            pointerEvents: 'auto'
        });
        overlay.textContent = OVERLAY_TEXT;
        overlay.addEventListener('click', (e) => {
            markUserGesture();
            const hive = document.getElementById('hivePlayer');
            const fsTarget = selectPersistentFsTarget(hive);
            try {
                const req = fsTarget && (fsTarget.requestFullscreen || fsTarget.webkitRequestFullscreen || fsTarget.mozRequestFullScreen || fsTarget.msRequestFullscreen);
                if (req) req.call(fsTarget).catch(err => console.warn('FS failed:', err));
            } catch (err) { console.warn('FS invocation error:', err); }
            removeOverlay();
        }, { once: true });
        return overlay;
    }

    function selectPersistentFsTarget(hiveEl) {
        if (hiveEl) {
            const pc = findPlayerContainerForVideo(hiveEl);
            if (pc) return pc;
            const nearest = findNearestFullscreenable(hiveEl);
            if (nearest && nearest !== document.body) return nearest;
        }
        return document.documentElement;
    }

    function onFullscreenChange() {
        const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        if (fsEl === document.documentElement) {
            applyFsStyles();
            manualExit = false; // reset flag when fullscreen entered
        } else {
            removeFsStyles();
            manualExit = true; // mark user-exited fullscreen
        }
        if (isFullscreen()) removeOverlay();
        setTimeout(() => { try { findVideos().forEach(v => attachToVideoNode(v)); } catch (e) {} }, 150);
    }
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);

    const mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes || []) {
                try { suppressUntil = Date.now() + 2000; } catch (e) {}
                if (node.nodeType !== 1) continue;
                try {
                    if (node.tagName && node.tagName.toLowerCase() === 'video') attachToVideoNode(node);
                    node.querySelectorAll && node.querySelectorAll('video').forEach(v => attachToVideoNode(v));
                    if (node.shadowRoot) {
                        const vids = findVideos(node.shadowRoot);
                        vids.forEach(v => attachToVideoNode(v));
                    }
                } catch (e) {}
            }
        }
    });
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

    try { findVideos().forEach(v => attachToVideoNode(v)); } catch (e) {}

    // Synchronous fullscreen target selection (persistent)
    function fsOnHivePlayerSync() {
        try {
            const hive = document.getElementById('hivePlayer');
            const target = selectPersistentFsTarget(hive);
            if (!target || isFullscreen()) return false;
            const req = target.requestFullscreen || target.webkitRequestFullscreen || target.mozRequestFullScreen || target.msRequestFullscreen;
            if (req) { req.call(target).catch(err => console.warn('FS failed:', err)); return true; }
        } catch (e) { console.warn(e); }
        return false;
    }

    // Tight playback starter detection for Disney+ "CONTINUE" element
    function isPlaybackStarter(el) {
        if (!el) return false;
        const playAnchor = el.closest('a[data-testid="playback-action-button"], a[aria-label]');
        if (playAnchor) {
            const dt = playAnchor.getAttribute('data-testid') || '';
            const aria = (playAnchor.getAttribute('aria-label') || '').trim().toLowerCase();
            const href = playAnchor.getAttribute('href') || '';
            const text = (playAnchor.textContent || '').trim().toLowerCase();
            if (dt === 'playback-action-button') return true;
            if (aria && aria.indexOf('continue') !== -1) return true;
            if (text && text.indexOf('continue') !== -1) return true;
            if (href && href.indexOf('/play/') !== -1) return true;
        }
        const btn = el.closest('button, a');
        if (btn) {
            const aria2 = (btn.getAttribute('aria-label') || '').trim().toLowerCase();
            const dt2 = btn.getAttribute('data-testid') || '';
            const txt2 = (btn.textContent || '').trim().toLowerCase();
            if (dt2 && dt2.toLowerCase().includes('play')) return true;
            if (aria2 && aria2.includes('play')) return true;
            if (txt2 && txt2.includes('play')) return true;
        }
        return false;
    }

    // Document click handler: try to fullscreen synchronously on playback-starter clicks
    document.addEventListener('click', (ev) => {
        try {
            if (!ev.isTrusted) return;
            if (isFullscreen()) return;
            const tgt = ev.target;
            if (isPlaybackStarter(tgt)) {
                const ok = fsOnHivePlayerSync();
                if (ok) removeOverlay();
            } else {
                const vids = findVideos();
                const v = vids[0];
                if (v) {
                    const fsTarget = selectPersistentFsTarget(v);
                    if (now() - lastUserGesture < RECENT_GESTURE_MS) {
                        const req = fsTarget && (fsTarget.requestFullscreen || fsTarget.webkitRequestFullscreen || fsTarget.mozRequestFullScreen || fsTarget.msRequestFullscreen);
                        if (req) { req.call(fsTarget).catch(err => console.warn('FS failed:', err)); removeOverlay(); }
                    } else {
                        if (!v.paused && !v.ended && !isFullscreen()) showOverlayIn(fsTarget || v.parentNode || document.body);
                    }
                }
            }
        } catch (e) {
            console.error('Error in click handler:', e);
        }
    }, true);

    // F-key fullscreen shortcut (synchronous, real keypress)
    document.addEventListener('keydown', (ev) => {
        try {
            const tgt = ev.target;
            if (tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.isContentEditable)) return;
            if (!ev.key || ev.key.toLowerCase() !== 'f') return;
            ev.preventDefault();
            markUserGesture();
            const hive = document.getElementById('hivePlayer');
            const fsTarget = selectPersistentFsTarget(hive) || (function () {
                const vids = findVideos();
                const v = vids[0] || document.querySelector('video');
                return v ? selectPersistentFsTarget(v) : null;
            })();
            if (!fsTarget || isFullscreen()) return;
            const req = fsTarget.requestFullscreen || fsTarget.webkitRequestFullscreen || fsTarget.mozRequestFullScreen || fsTarget.msRequestFullscreen;
            if (req) { req.call(fsTarget).catch(err => console.warn('FS failed:', err)); removeOverlay(); }
        } catch (e) {
            console.error('Error in keydown handler:', e);
        }
    }, true);

    // Monitor hivePlayer replacement so we can attach handlers
    const hiveObserver = new MutationObserver(() => {
        try {
            const hive = document.getElementById('hivePlayer');
            if (hive) attachToVideoNode(hive);
        } catch (e) {
            console.error('Error in hiveObserver:', e);
        }
    });
    hiveObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });

    // SPA hooks
    (function hookHistory() {
        const origPush = history.pushState;
        const origReplace = history.replaceState;
        history.pushState = function () { const res = origPush.apply(this, arguments); window.dispatchEvent(new Event('locationchange')); return res; };
        history.replaceState = function () { const res = origReplace.apply(this, arguments); window.dispatchEvent(new Event('locationchange')); return res; };
        window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
    })();
    window.addEventListener('locationchange', () => {
        removeOverlay();
        setTimeout(() => { try { findVideos().forEach(v => attachToVideoNode(v)); } catch (e) {} }, 200);
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) setTimeout(() => { try { findVideos().forEach(v => attachToVideoNode(v)); } catch (e) {} }, 250);
    });

    window.addEventListener('beforeunload', () => { mo.disconnect(); hiveObserver.disconnect(); removeFsStyles(); });

    console.log('Disney+ Auto Fullscreen Enhanced (v1.13) initialized');

    // attachToVideoNode definition placed last to keep code organization
    function attachToVideoNode(v) {
        if (!v || v._autoFsAttached) return;
        v._autoFsAttached = true;
        v._pausedByUser = false;

        v.addEventListener('pause', (ev) => {
            try {
                if ((ev && ev.isTrusted) || (now() - lastUserGesture < RECENT_GESTURE_MS)) {
                    v._pausedByUser = true;
                    if (!isFullscreen()) {
                        if (manualExit) return; // skip overlay if user exited fullscreen
                        const container = findPlayerContainerForVideo(v) || v.parentNode || document.body;
                        showOverlayIn(container);
                    }
                }
            } catch (e) {
                console.error('Error in pause event handler:', e);
            }
        }, true);

        v.addEventListener('play', (ev) => {
            try {
                const playIsUserGesture_tmp = !!((ev && ev.isTrusted) || (now() - lastUserGesture < RECENT_GESTURE_MS));
                if (!playIsUserGesture_tmp) {
                    rapidPlayCount++;
                } else { rapidPlayCount = 0; }
                if (rapidPlayCount > 3) { suppressUntil = Date.now() + 3000; return; }

                const playIsUserGesture = !!((ev && ev.isTrusted) || (now() - lastUserGesture < RECENT_GESTURE_MS));
                if (v._pausedByUser && !playIsUserGesture) return;
                if (playIsUserGesture) v._pausedByUser = false;
                if (!v.paused && !v.ended && !isFullscreen()) {
                    const container = findPlayerContainerForVideo(v) || v.parentNode || document.body;
                    showOverlayIn(container);
                }
            } catch (e) {
                console.error('Error in play event handler:', e);
            }
        }, true);
    }

})();
