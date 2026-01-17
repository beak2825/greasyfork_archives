// ==UserScript==
// @name         Tidal Unlocked
// @namespace    https://tidal.com/
// @version      1.0.0
// @description  Unlock Max audio quality on Tidal with instant quality switching
// @author       Super
// @match        https://tidal.com/*
// @match        https://listen.tidal.com/*
// @match        https://desktop.tidal.com/*
// @icon         https://tidal.com/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562837/Tidal%20Unlocked.user.js
// @updateURL https://update.greasyfork.org/scripts/562837/Tidal%20Unlocked.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        subscription: {
            type: "PREMIUM_PLUS",
            offlineGracePeriod: 999,
            highestSoundQuality: "HI_RES_LOSSLESS",
            premiumAccess: true,
            status: "ACTIVE",
            validUntil: "2066-12-31T23:59:59.999+0000"
        },
        proxy: "https://tidal.kinoplus.online/track/",
        patterns: {
            playback: /(?:tidal\.com|listen\.tidal\.com|desktop\.tidal\.com)\/v1\/tracks\/(.+?)\/playbackinfo\?audioquality=(.+?)(?:&|$)/i,
            subscription: /(?:tidal\.com|listen\.tidal\.com|desktop\.tidal\.com)\/v1\/users\/.+?\/subscription/i
        },
        timing: {
            storeRetry: 500,
            storeDelay: 500
        },
        debug: false
    };

    const state = {
        store: null,
        lastQuality: null,
        ready: false,
        reloading: false
    };

    // Bypasses Tidal's hooks on console functions to silence them
    const _log = console.log.bind(console);
    const _warn = console.warn.bind(console);
    const _error = console.error.bind(console);
    const log = (...a) => CONFIG.debug && _log('[TIDAL-UNLOCKED]', ...a);
    const warn = (...a) => _warn('[TIDAL-UNLOCKED]', ...a);
    const error = (...a) => _error('[TIDAL-UNLOCKED]', ...a);

    const originalFetch = window._originalFetch = window._originalFetch || window.fetch;

    window.fetch = async function(...args) {
        const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
        if (!url) return originalFetch.apply(this, args);

        const playbackMatch = url.match(CONFIG.patterns.playback);
        if (playbackMatch && CONFIG.proxy) {
            const [, trackId, requestedQuality] = playbackMatch;
            log(`Playback request: track ${trackId}, quality ${requestedQuality}`);
            try {
                const [tidalRes, proxyRes] = await Promise.all([
                    originalFetch.apply(this, args),
                    originalFetch(`${CONFIG.proxy}?id=${trackId}&quality=${requestedQuality}`)
                ]);
                if (proxyRes.ok) {
                    const [tidal, proxy] = await Promise.all([tidalRes.clone().json(), proxyRes.json()]);
                    const merged = { ...tidal, ...proxy.data };
                    const actualQuality = merged.audioQuality || 'unknown';
                    if (actualQuality !== requestedQuality) {
                        warn(`Quality mismatch: requested ${requestedQuality}, got ${actualQuality}`);
                    } else {
                        log(`Playback ready: ${actualQuality} (${merged.bitDepth || '?'}bit/${merged.sampleRate || '?'}Hz)`);
                    }
                    return new Response(JSON.stringify(merged), {
                        status: tidalRes.status, statusText: tidalRes.statusText, headers: tidalRes.headers
                    });
                }
                warn('Proxy failed, using Tidal response');
                return tidalRes;
            } catch (e) {
                error('Playback intercept failed:', e);
                return originalFetch.apply(this, args);
            }
        }

        if (CONFIG.patterns.subscription.test(url)) {
            log('Subscription request intercepted, faking premium status');
            const res = await originalFetch.apply(this, args);
            try {
                const data = await res.clone().json();
                const sub = CONFIG.subscription;
                return new Response(JSON.stringify({
                    ...data,
                    startDate: data.startDate || new Date().toISOString(),
                    validUntil: sub.validUntil,
                    status: sub.status,
                    subscription: { type: sub.type, offlineGracePeriod: sub.offlineGracePeriod },
                    highestSoundQuality: sub.highestSoundQuality,
                    premiumAccess: sub.premiumAccess,
                    canGetTrial: false
                }), { status: res.status, statusText: res.statusText, headers: res.headers });
            } catch (e) {
                error('Subscription intercept failed:', e);
                return res;
            }
        }

        return originalFetch.apply(this, args);
    };

    function findStore() {
        const wimp = document.getElementById('wimp');
        if (!wimp) return null;

        const key = Object.keys(wimp).find(k => k.startsWith('__reactContainer$'));
        if (!key) return null;

        function search(fiber, depth = 0) {
            if (!fiber || depth > 200) return null;

            for (let hook = fiber.memoizedState; hook; hook = hook.next) {
                if (hook.memoizedState?.store?.getState) return hook.memoizedState.store;
            }
            for (let ctx = fiber.dependencies?.firstContext; ctx; ctx = ctx.next) {
                if (ctx.memoizedValue?.store?.getState) return ctx.memoizedValue.store;
            }
            return search(fiber.child, depth + 1) || search(fiber.sibling, depth + 1);
        }

        return search(wimp[key].current || wimp[key]);
    }

    function setupStore() {
        if (state.ready) return;

        const store = findStore();
        if (!store) {
            setTimeout(setupStore, CONFIG.timing.storeRetry);
            return;
        }

        state.store = store;
        state.ready = true;
        window.__TIDAL_STORE__ = store;
        log('Store found');

        // Suppress quality change notifications (quality change taking effect only on next track)
        // We implement our own quality change handler
        const orig = store.dispatch;
        store.dispatch = (action) => {
            if (action?.type === 'settings/SET_STREAMING_QUALITY') {
                action.payload = { ...action.payload, hideNotification: true };
            }
            return orig.call(store, action);
        };

        state.lastQuality = store.getState().settings?.quality?.streaming;
        store.subscribe(() => {
            if (window.__QUALITY_HANDLER_DISABLED__ || state.reloading) return;
            const s = store.getState();
            const q = s.settings?.quality?.streaming;
            if (state.lastQuality && q && q !== state.lastQuality && s.playbackControls?.playbackState === 'PLAYING') {
                // Capture position before any state changes
                const video = document.getElementById('video-one') || document.querySelector('video');
                const pos = video?.currentTime || 0;
                log('Quality changed:', state.lastQuality, '->', q, 'at position:', pos);
                reloadTrack(pos);
            }
            state.lastQuality = q;
        });

        log('Ready');
    }

    function reloadTrack(savedPos) {
        const { store } = state;
        if (!store || state.reloading) return;
        state.reloading = true;

        const s = store.getState();
        if (!s.playbackControls?.mediaProduct || s.playbackControls.playbackState !== 'PLAYING') {
            state.reloading = false;
            return;
        }

        const items = (s.playQueue?.elements || []).map(e => ({ isExplicit: false, itemId: e.mediaItemId }));

        try {
            store.dispatch({
                type: 'homepage/PLAY_SINGLE_TRACK',
                payload: { fromIndex: s.playQueue.currentIndex, items, title: 'Quality Reload', url: location.pathname }
            });

            if (savedPos > 2) {
                // Small delay to let new stream start, then poll for ready
                setTimeout(() => {
                    const pollSeek = () => {
                        const v = document.getElementById('video-one') || document.querySelector('video');
                        if (v?.readyState >= 3) {
                            v.currentTime = savedPos;
                            log('Resumed to:', savedPos);
                        } else {
                            requestAnimationFrame(pollSeek);
                        }
                    };
                    pollSeek();
                }, 100);
            }
        } catch (e) {
            warn('Reload failed:', e);
        } finally {
            state.reloading = false;
        }
    }

    log('Fetch interceptor installed');
    const start = () => setTimeout(setupStore, CONFIG.timing.storeDelay);
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
    log('Loaded');
})();
