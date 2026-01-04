// ==UserScript==
// @name         Search Enhanced Protection (Tampermonkey) 
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Enhance privacy when using search engines: strip tracking params, remove redirect wrappers, set no-referrer, force HTTPS on links, and add noreferrer/noopener. Works on Google, Bing, DuckDuckGo, Yahoo and common search pages. Toggle features from the Tampermonkey menu.
// @author       Skibidi555
// @match        *://*.google.*/*
// @match        *://*.bing.com/*
// @match        *://*.duckduckgo.com/*
// @match        *://search.yahoo.com/*
// @match        *://*.brave.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      You can only change the name 
// @downloadURL https://update.greasyfork.org/scripts/556302/Search%20Enhanced%20Protection%20%28Tampermonkey%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556302/Search%20Enhanced%20Protection%20%28Tampermonkey%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const DEBUG = false;

    // ---- Configuration (persistent via GM_setValue with defaults) ----
    const defaults = {
        stripTrackingParams: true,
        fixRedirectLinks: true,
        setNoReferrerMeta: true,
        forceHTTPS: true,
        addNoreferrerRel: true
    };

    // Load/save helpers (use GM_getValue default arg to avoid undefined)
    function getOpt(key) {
        try {
            return GM_getValue(key, defaults[key]);
        } catch (e) {
            // fallback - Tampermonkey should support GM_getValue with default but be defensive
            return (typeof window['__sep_defaults__'] !== 'undefined' && key in window["__sep_defaults__"])
                ? window['__sep_defaults__'][key] : defaults[key];
        }
    }
    function setOpt(key, val) {
        try {
            GM_setValue(key, !!val);
            if (DEBUG) console.info('SEP: setOpt', key, !!val);
        } catch (e) {
            if (DEBUG) console.warn('SEP: GM_setValue failed', e);
        }
    }

    // Register menu commands to toggle features (re-run without reload)
    function registerMenu() {
        try {
            GM_registerMenuCommand('Toggle stripTrackingParams (' + (getOpt('stripTrackingParams') ? 'ON' : 'OFF') + ')', () => {
                setOpt('stripTrackingParams', !getOpt('stripTrackingParams'));
                runProtection(true);
            });
            GM_registerMenuCommand('Toggle fixRedirectLinks (' + (getOpt('fixRedirectLinks') ? 'ON' : 'OFF') + ')', () => {
                setOpt('fixRedirectLinks', !getOpt('fixRedirectLinks'));
                runProtection(true);
            });
            GM_registerMenuCommand('Toggle setNoReferrerMeta (' + (getOpt('setNoReferrerMeta') ? 'ON' : 'OFF') + ')', () => {
                setOpt('setNoReferrerMeta', !getOpt('setNoReferrerMeta'));
                runProtection(true);
            });
            GM_registerMenuCommand('Toggle forceHTTPS (' + (getOpt('forceHTTPS') ? 'ON' : 'OFF') + ')', () => {
                setOpt('forceHTTPS', !getOpt('forceHTTPS'));
                runProtection(true);
            });
            GM_registerMenuCommand('Toggle addNoreferrerRel (' + (getOpt('addNoreferrerRel') ? 'ON' : 'OFF') + ')', () => {
                setOpt('addNoreferrerRel', !getOpt('addNoreferrerRel'));
                runProtection(true);
            });
        } catch (e) {
            if (DEBUG) console.warn('SEP: registerMenu failed', e);
        }
    }

    registerMenu();

    // ---- Utilities ----
    const TRACKING_PARAMS = [
        /^utm_/i,
        /^gclid$/i,
        /^fbclid$/i,
        /^mc_cid$/i,
        /^mc_eid$/i,
        /^igshid$/i,
        /^ref$/i,
        /^ref_src$/i,
        /^msclkid$/i,
        /^trk_?/i,
        /^icid$/i,
        /^_hsenc$/i,
        /^_hsmi$/i
    ];

    function isTrackingParam(key) {
        return TRACKING_PARAMS.some(rx => rx.test(key));
    }

    function stripTrackingParamsFromSearchParams(sp) {
        const toDelete = [];
        for (const key of sp.keys()) {
            if (isTrackingParam(key)) toDelete.push(key);
        }
        for (const k of toDelete) sp.delete(k);
    }

    function cleanUrlString(urlStr) {
        try {
            // resolve relative URLs
            const u = new URL(urlStr, document.baseURI);

            if (getOpt('stripTrackingParams')) {
                stripTrackingParamsFromSearchParams(u.searchParams);
                if (u.hash && u.hash.includes('=')) {
                    try {
                        const h = new URLSearchParams(u.hash.replace(/^#/, ''));
                        let changed = false;
                        for (const key of Array.from(h.keys())) {
                            if (isTrackingParam(key)) { h.delete(key); changed = true; }
                        }
                        if (changed) u.hash = h.toString() ? '#' + h.toString() : '';
                    } catch (e) { /* ignore malformed hash */ }
                }
            }

            if (getOpt('forceHTTPS') && u.protocol === 'http:') {
                if (/\.(com|org|net|io|gov|edu|co|uk|de|fr|es|nl|ca|au|info|me)$/i.test(u.hostname)) {
                    u.protocol = 'https:';
                }
            }
            return u.toString();
        } catch (e) {
            if (DEBUG) console.warn('SEP: cleanUrlString parse fail for', urlStr, e);
            return urlStr;
        }
    }

    function unwrapGoogleRedirect(href) {
        try {
            const u = new URL(href, document.baseURI);
            // common redirect endpoints
            if ((/\/url$/i).test(u.pathname) && u.searchParams.has('q')) {
                return u.searchParams.get('q');
            }
            for (const p of ['url', 'u', 'q']) {
                if (u.searchParams.has(p)) return u.searchParams.get(p);
            }
        } catch (e) {
            if (DEBUG) console.debug('SEP: unwrap failed', href, e);
        }
        return href;
    }

    function addRel(existing, addition) {
        const set = new Set((existing || '').split(/\s+/).filter(Boolean));
        addition.split(/\s+/).forEach(t => set.add(t));
        return Array.from(set).join(' ');
    }

    function cleanAnchor(a) {
        try {
            if (!(a instanceof HTMLAnchorElement)) return;
            const orig = a.getAttribute('href');
            if (!orig) return;

            if (/^\s*(javascript:|#|mailto:|tel:)/i.test(orig)) {
                if (getOpt('addNoreferrerRel')) a.rel = addRel(a.rel, 'noreferrer noopener');
                return;
            }

            let cleaned = orig;

            if (getOpt('fixRedirectLinks')) {
                cleaned = unwrapGoogleRedirect(cleaned);
            }

            cleaned = cleanUrlString(cleaned);

            if (cleaned !== orig) {
                a.setAttribute('data-sep-cleaned-href', '1');
                a.setAttribute('href', cleaned);
            }

            if (getOpt('addNoreferrerRel')) {
                a.rel = addRel(a.rel, 'noreferrer noopener');
            }
        } catch (e) {
            if (DEBUG) console.warn('SEP: cleanAnchor error', e);
        }
    }

    function processAnchors(root = document) {
        try {
            const anchors = (root && root.querySelectorAll) ? root.querySelectorAll('a[href]') : [];
            for (const a of anchors) {
                if (a.getAttribute('data-sep-cleaned-href') === '1') continue;
                cleanAnchor(a);
            }
        } catch (e) {
            if (DEBUG) console.warn('SEP: processAnchors error', e);
        }
    }

    // prevent handling repeated clicks on same link (e.g., search engine handlers)
    let recentlyIntercepted = new WeakSet();

    function installClickInterceptor() {
        document.addEventListener('click', function (ev) {
            try {
                // ignore if user used modifier keys to open context or special clicks
                if (ev.defaultPrevented) return;
                const target = ev.target;
                if (!target || typeof target.closest !== 'function') return;
                const a = target.closest('a[href]');
                if (!a) return;
                if (recentlyIntercepted.has(a)) return;

                const href = a.getAttribute('href');
                if (!href || /^\s*(javascript:|#)/i.test(href)) return;

                if (getOpt('fixRedirectLinks') || getOpt('stripTrackingParams')) {
                    const cleaned = cleanUrlString(unwrapGoogleRedirect(href));
                    if (cleaned && cleaned !== href) {
                        // middle click / ctrl/meta should open in new tab
                        const openInNew = (ev.button === 1) || ev.ctrlKey || ev.metaKey || a.target === '_blank';
                        ev.preventDefault();
                        ev.stopPropagation();
                        recentlyIntercepted.add(a);
                        if (openInNew) {
                            // open with no opener/referrer where possible
                            try { window.open(cleaned, '_blank', 'noopener,noreferrer'); }
                            catch (e) { window.open(cleaned, '_blank'); }
                        } else {
                            location.href = cleaned;
                        }
                        // remove mark after short time to allow normal subsequent clicks
                        setTimeout(() => { recentlyIntercepted.delete(a); }, 1000);
                    }
                }
            } catch (e) {
                if (DEBUG) console.warn('SEP: click interceptor error', e);
            }
        }, true);
    }

    function setNoReferrerMeta() {
        if (!getOpt('setNoReferrerMeta')) return;
        try {
            let meta = document.querySelector('meta[name="referrer"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'referrer';
                if (document.head) {
                    document.head.prepend(meta);
                } else if (document.documentElement) {
                    // fallback - append to documentElement if head absent (rare)
                    document.documentElement.insertBefore(meta, document.documentElement.firstChild);
                }
            }
            meta.setAttribute('content', 'no-referrer');
        } catch (e) {
            if (DEBUG) console.warn('SEP: setNoReferrerMeta failed', e);
        }
    }

    let observer = null;
    function observeAndClean() {
        try {
            if (observer) observer.disconnect();
            observer = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    if (m.addedNodes && m.addedNodes.length) {
                        for (const n of m.addedNodes) {
                            if (n.nodeType === 1) {
                                if (n.querySelector && n.querySelector('a[href]')) {
                                    processAnchors(n);
                                } else if (n.matches && n.matches('a[href]')) {
                                    cleanAnchor(n);
                                }
                            }
                        }
                    }
                }
            });
            observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
            processAnchors(document);
        } catch (e) {
            if (DEBUG) console.warn('SEP: observeAndClean failed', e);
        }
    }

    function runProtection(forceReprocess = false) {
        try {
            if (getOpt('setNoReferrerMeta')) setNoReferrerMeta();
            if (getOpt('fixRedirectLinks') || getOpt('stripTrackingParams') || getOpt('addNoreferrerRel') || getOpt('forceHTTPS')) {
                if (forceReprocess) processAnchors(document);
                installClickInterceptor();
                observeAndClean();
            }
            if (DEBUG) console.info('Search Enhanced Protection: active (features: ' +
                (getOpt('stripTrackingParams') ? 'stripTrackingParams ' : '') +
                (getOpt('fixRedirectLinks') ? 'fixRedirectLinks ' : '') +
                (getOpt('setNoReferrerMeta') ? 'setNoReferrerMeta ' : '') +
                (getOpt('forceHTTPS') ? 'forceHTTPS ' : '') +
                (getOpt('addNoreferrerRel') ? 'addNoreferrerRel ' : '') + ')');
        } catch (e) {
            if (DEBUG) console.error('SEP: runProtection failed', e);
        }
    }

    runProtection();

    // SPA navigation hooks
    (function hijackHistory() {
        try {
            const push = history.pushState;
            const replace = history.replaceState;
            history.pushState = function () {
                push.apply(this, arguments);
                setTimeout(() => runProtection(true), 200);
            };
            history.replaceState = function () {
                replace.apply(this, arguments);
                setTimeout(() => runProtection(true), 200);
            };
            window.addEventListener('popstate', () => setTimeout(() => runProtection(true), 200));
        } catch (e) {
            if (DEBUG) console.warn('SEP: hijackHistory failed', e);
        }
    })();

})();
