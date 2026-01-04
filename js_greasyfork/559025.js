// ==UserScript==
// @name         Universal Image Host Interceptor
// @namespace    https://greasyfork.org/users/108513
// @version      1.2.0
// @description  Clean and fast image viewing for Fastpic, Imgbox, ImgDrive, Pixhost, ImageBam, and many more. Features: Stealth Mode (no ads/flash), Auto-Redirect (gateway bypass), and Anti-Loop.
// @description:fr Visionneuse d'image rapide et propre pour Fastpic, Imgbox, ImgDrive, Pixhost, ImageBam et bien d'autres. Fonctionnalités : Mode Furtif (pas de pubs/flash), Redirection Auto (contournement des pages d'attente) et Anti-Boucle.
// @author       seb-du17
// @match        *://imgbox.com/*
// @match        *://*.imgbox.com/*
// @match        *://fastpic.org/view/*
// @match        *://imgxxt.in/*
// @match        *://imgdrive.net/*
// @match        *://imagebam.com/view/*
// @match        *://www.imagebam.com/image/*
// @match        *://turboimagehost.com/*
// @match        *://imagetwist.com/*
// @match        *://vipr.im/*
// @match        *://pixhost.to/*
// @match        *://*.pixhost.to/*
// @match        *://pimpandhost.com/*
// @match        *://*.imagevenue.com/*
// @match        *://imx.to/*
// @match        *://*.imx.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fastpic.org
// @grant        none
// @run-at       document-start
// @compatible   firefox
// @compatible   chrome
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559025/Universal%20Image%20Host%20Interceptor.user.js
// @updateURL https://update.greasyfork.org/scripts/559025/Universal%20Image%20Host%20Interceptor.meta.js
// ==/UserScript==

/* jshint esversion:11 */

(function() {
    'use strict';

    // --- CONFIG ---
    const CONFIG = {
        SILENT_CONSOLE: true,
        DEBUG: false,

        // Watchers
        USE_MUTATION_OBSERVER: true,
        OBSERVE_ATTRIBUTES: true, // utile sur certains hosts qui changent src/content sans ajouter de nodes
        OBSERVER_MAX_RUNTIME_MS: 12000,

        // Throttle extract() calls (évite de re-parser 200 fois si Amazon-like pages)
        CHECK_MIN_INTERVAL_MS: 80, // 1 check max toutes les ~80ms

        // Fallback timer (toujours utile car certains DOM changent peu mais images/attrs oui)
        POLL_INTERVAL_MS: 250,
        POLL_MAX_ATTEMPTS: 40
    };

    // --- UTILS ---
    const noop = () => {};
    if (CONFIG.SILENT_CONSOLE) {
        window.console.log = noop;
        window.console.warn = noop;
    }
    const log = CONFIG.DEBUG ? console.log.bind(console) : noop;
    const warn = CONFIG.DEBUG ? console.warn.bind(console) : noop;

    const HOST = window.location.hostname;
    const HREF = window.location.href;

    // --- WATCHERS CONTROL ---
    let pollerId = null;
    let observer = null;
    let observerTimeoutId = null;

    const stopPoller = () => {
        if (pollerId) {
            clearInterval(pollerId);
            pollerId = null;
        }
    };

    const stopObserver = () => {
        if (observer) {
            try { observer.disconnect(); } catch (e) {}
            observer = null;
        }
        if (observerTimeoutId) {
            clearTimeout(observerTimeoutId);
            observerTimeoutId = null;
        }
    };

    const stopAllWatchers = () => {
        stopPoller();
        stopObserver();
    };

    // --- CORE ENGINE ---
    const render = (url) => {
        if (!document.documentElement) {
            requestAnimationFrame(() => render(url));
            return;
        }

        const stealthIds = ['fp-stealth', 'imx-stealth', 'drive-stealth', 'box-stealth', 'bam-stealth'];
        stealthIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.remove(); }
        });

        document.documentElement.style.visibility = 'visible';
        document.documentElement.style.background = 'none';

        if (document.head) {
            while (document.head.firstChild) { document.head.removeChild(document.head.firstChild); }
        }
        if (document.body) {
            while (document.body.firstChild) { document.body.removeChild(document.body.firstChild); }
        }

        requestAnimationFrame(() => {
            if (!document.head) { document.documentElement.appendChild(document.createElement('head')); }
            if (!document.body) { document.documentElement.appendChild(document.createElement('body')); }

            document.head.innerHTML = `
                <title>Image View</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body { margin: 0; background: #0e0e0e; display: flex; justify-content: center; align-items: center; min-height: 100vh; overflow: hidden; }
                    img { display: block; box-shadow: 0 0 30px rgba(0,0,0,0.5); max-width: 100%; height: auto; max-height: 100vh; object-fit: contain; cursor: default; }
                </style>
            `;
            document.body.innerHTML = `<img src="${url}" alt="Full Size">`;

            // “anti-injection” minimaliste (comme ton script)
            new MutationObserver((mutations) => {
                mutations.forEach((m) => {
                    m.addedNodes.forEach((n) => {
                        if (n && (n.tagName === 'SCRIPT' || n.tagName === 'IFRAME')) { n.remove(); }
                    });
                });
            }).observe(document.documentElement, { childList: true, subtree: true });
        });
    };

    const cleanAndShow = (src, refererHost) => {
        try { window.stop(); } catch (e) {}

        src = src.replace(/\\\//g, '/');

        if (src.startsWith('//')) {
            src = window.location.protocol + src;
        }

        if (refererHost === 'fastpic') {
            render(src);
            return;
        }

        if (refererHost === 'pixhost') {
            if (src.includes('/thumbs/')) {
                const newSrc = src.replace('//t', '//img').replace('/thumbs/', '/images/');
                const imgCheck = new Image();
                imgCheck.onload = () => { render(newSrc); };
                imgCheck.onerror = () => { render(src); };
                imgCheck.src = newSrc;
                return;
            }
        } else {
            src = src.replace(/(\.|_)(md|th|tn|thumbnail|preview)(\.|_)/i, '$1$3');
        }

        render(src);
    };

    const finalize = (src, refererHost) => {
        stopAllWatchers();
        if (src) {
            cleanAndShow(src, refererHost);
        }
    };

    // --- MODULES ---
    const Modules = {
        fastpic: {
            check: () => HOST.includes('fastpic'),
            init: () => {
                if (document.documentElement) {
                    const s = document.createElement('style');
                    s.id = 'fp-stealth';
                    s.textContent = 'html, body { visibility: hidden !important; background: #0e0e0e !important; }';
                    document.documentElement.appendChild(s);
                }
            },
            extract: () => {
                const imgs = document.getElementsByTagName('img');
                for (let i = 0; i < imgs.length; i++) {
                    if (imgs[i].src && imgs[i].src.includes('/big/')) {
                        return imgs[i].src;
                    }
                }
                const imgOld = document.querySelector('#image');
                if (imgOld && imgOld.src) { return imgOld.src; }
                return null;
            },
            onFail: () => {
                const s = document.getElementById('fp-stealth');
                if (s) { s.remove(); }
                if (document.documentElement) { document.documentElement.style.visibility = 'visible'; }
            }
        },

        pixhost: {
            check: () => HOST.includes('pixhost'),
            extract: () => {
                const scripts = document.getElementsByTagName('script');
                for (let i = 0; i < scripts.length; i++) {
                    const html = scripts[i].innerHTML;
                    if (html.includes('pswp_items')) {
                        const urls = html.match(/https?:\\?\/\\?\/[^"']+\.(jpg|jpeg|png|webp)/gi);
                        if (urls && urls.length > 0) {
                            const best = urls.find(u => !u.includes('/thumbs/') && !u.includes('/show/')) || urls[0];
                            if (!best.includes('/show/')) { return best; }
                        }
                    }
                }

                const img = document.querySelector('#image, #show_image, img.image-center');
                if (img && img.src && !img.src.includes('/show/')) { return img.src; }

                return null;
            }
        },

        imx: {
            check: () => HOST.includes('imx.to'),
            init: () => {
                if (document.documentElement) {
                    const s = document.createElement('style');
                    s.id = 'imx-stealth';
                    s.textContent = 'html, body { visibility: hidden !important; background: #0e0e0e !important; }';
                    document.documentElement.appendChild(s);
                }
            },
            extract: () => {
                const img = document.querySelector('#iimg') || document.querySelector('img.centred');
                if (img) { return img.src; }

                const urlParts = HREF.split('/');
                const id = urlParts[urlParts.length - 1];
                if (id.length > 3) {
                    const candidate = document.querySelector(`img[src*="${id}"]`);
                    if (candidate && !candidate.src.includes('logo')) { return candidate.src; }
                }

                const continueBtn = document.querySelector('input[name="imgContinue"]');
                if (continueBtn) {
                    const key = 'imx_click_' + HREF;
                    if (!sessionStorage.getItem(key)) {
                        sessionStorage.setItem(key, '1');
                        setTimeout(() => { continueBtn.click(); }, 500);
                    }
                    return null;
                }

                return null;
            },
            onFail: () => {
                const s = document.getElementById('imx-stealth');
                if (s) { s.remove(); }
                if (document.documentElement) { document.documentElement.style.visibility = 'visible'; }
            }
        },

        imagevenue: {
            check: () => HOST.includes('imagevenue.com'),
            extract: () => {
                const continueLink = document.querySelector('a[title="Continue to ImageVenue"]');
                if (continueLink && continueLink.href) {
                    if (continueLink.href !== HREF) { window.location.href = continueLink.href; }
                    return null;
                }
                const img = document.querySelector('img.card-img-top') || document.querySelector('#main-image');
                if (img) { return img.src; }

                const imgs = document.querySelectorAll('img[src*=".jpg"], img[src*=".jpeg"], img[src*=".png"]');
                for (let i = 0; i < imgs.length; i++) {
                    if (imgs[i].naturalWidth > 300 || (imgs[i].style.width && parseInt(imgs[i].style.width) > 300)) {
                        return imgs[i].src;
                    }
                }
                return null;
            }
        },

        imagetwist: {
            check: () => HOST.includes('imagetwist') || HOST.includes('vipr.im'),
            extract: () => {
                let img = document.querySelector('img.pic');
                if (img && img.src) { return img.src; }
                const urlParts = HREF.split('/');
                const filename = urlParts[urlParts.length - 1];
                if (filename.length > 5) {
                    const selector = `img[src*="${filename}"]`;
                    const candidate = document.querySelector(selector);
                    if (candidate && candidate.src !== HREF) { return candidate.src; }
                }
                return null;
            }
        },

        imgxxt: {
            check: () => HOST.includes('imgxxt'),
            extract: () => {
                const link = document.querySelector('link[rel="image_src"]');
                if (link) { return link.href; }
                const meta = document.querySelector('meta[property="og:image"]');
                if (meta) { return meta.content; }
                const v = document.querySelector('.image-viewer-container img');
                if (v) { return v.src; }
                return null;
            }
        },

        imgdrive: {
            check: () => HOST.includes('imgdrive'),
            init: () => {
                if (document.documentElement) {
                    const s = document.createElement('style');
                    s.id = 'drive-stealth';
                    s.textContent = 'html, body { visibility: hidden !important; background: #0e0e0e !important; }';
                    document.documentElement.appendChild(s);
                }
            },
            extract: () => {
                const og = document.querySelector('meta[property="og:image"]');
                if (og && og.content) {
                    const thumb = og.content;
                    if (thumb.includes('/small/')) {
                        const hd = thumb.replace('/small/', '/big/');
                        const imgTest = new Image();
                        imgTest.onload = () => { finalize(hd, null); };
                        imgTest.src = hd;
                    }
                }
                const continueLink = document.querySelector('a[onclick*="closeOverlay"]');
                if (continueLink) {
                    if (typeof unsafeWindow !== 'undefined' && unsafeWindow.closeOverlay) {
                        unsafeWindow.closeOverlay();
                    } else {
                        continueLink.click();
                    }
                    return null;
                }
                const img = document.querySelector('img.centred_resized, img.main-image, img.pic');
                if (img) { return img.src; }
                const imgId = document.querySelector('#myImage, #main_image');
                if (imgId) { return imgId.src; }
                return null;
            },
            onFail: () => {
                const s = document.getElementById('drive-stealth');
                if (s) { s.remove(); }
                if (document.documentElement) { document.documentElement.style.visibility = 'visible'; }
            }
        },

        imgbox: {
            check: () => HOST.includes('imgbox'),
            init: () => {
                if (document.documentElement) {
                    const s = document.createElement('style');
                    s.id = 'box-stealth';
                    s.textContent = 'html, body { visibility: hidden !important; background: #0e0e0e !important; }';
                    document.documentElement.appendChild(s);
                }
            },
            extract: () => {
                if (HREF.match(/\.(jpg|jpeg|png|gif)$/i)) { return HREF; }
                const img = document.querySelector('#img');
                if (img) { return img.src; }
                return null;
            },
            onFail: () => {
                const s = document.getElementById('box-stealth');
                if (s) { s.remove(); }
                if (document.documentElement) { document.documentElement.style.visibility = 'visible'; }
            }
        },

        imagebam: {
            check: () => HOST.includes('imagebam'),
            init: () => {
                if (document.documentElement) {
                    const s = document.createElement('style');
                    s.id = 'bam-stealth';
                    s.textContent = 'html, body { visibility: hidden !important; background: #0e0e0e !important; }';
                    document.documentElement.appendChild(s);
                }
                document.cookie = "nsfw_inter=1; path=/";
            },
            extract: () => {
                const img = document.querySelector('img.main-image');
                if (img) { return img.src; }
                const continueLink = document.querySelector('a[data-shown="inter"]');
                if (continueLink) { continueLink.click(); return null; }
                const allLinks = document.getElementsByTagName('a');
                for (let i = 0; i < allLinks.length; i++) {
                    if (allLinks[i].textContent.includes('Continue to your image')) {
                        allLinks[i].click();
                        return null;
                    }
                }
                const imgs = document.querySelectorAll('img[src*=".jpg"], img[src*=".jpeg"], img[src*=".png"]');
                for (let i = 0; i < imgs.length; i++) {
                    if (imgs[i].naturalWidth > 300 || (imgs[i].style.width && parseInt(imgs[i].style.width) > 300)) {
                        return imgs[i].src;
                    }
                }
                return null;
            },
            onFail: () => {
                const s = document.getElementById('bam-stealth');
                if (s) { s.remove(); }
                if (document.documentElement) { document.documentElement.style.visibility = 'visible'; }
            }
        },

        generic: {
            check: () => true,
            extract: () => {
                if (HOST.includes('pimpandhost')) { return document.querySelector('.main-image-wrapper')?.dataset.src; }
                return null;
            }
        }
    };

    // --- PICK MODULE ---
    let activeModule = Modules.generic;

    if (Modules.fastpic.check()) { activeModule = Modules.fastpic; }
    else if (Modules.imgdrive.check()) { activeModule = Modules.imgdrive; }
    else if (Modules.imgbox.check()) { activeModule = Modules.imgbox; }
    else if (Modules.imagebam.check()) { activeModule = Modules.imagebam; }
    else if (Modules.pixhost.check()) { activeModule = Modules.pixhost; }
    else if (Modules.imagetwist.check()) { activeModule = Modules.imagetwist; }
    else if (Modules.imgxxt.check()) { activeModule = Modules.imgxxt; }
    else if (Modules.imagevenue.check()) { activeModule = Modules.imagevenue; }
    else if (Modules.imx.check()) { activeModule = Modules.imx; }

    if (activeModule.init) { activeModule.init(); }

    const getRefererHost = () => (
        activeModule === Modules.fastpic ? 'fastpic' :
        (activeModule === Modules.pixhost ? 'pixhost' : null)
    );

    // --- Extraction orchestration (MO + fallback poll) ---
    let lastCheckTs = 0;
    let checkScheduled = false;

    const tryExtract = () => {
        const now = Date.now();
        if (now - lastCheckTs < CONFIG.CHECK_MIN_INTERVAL_MS) {
            return;
        }
        lastCheckTs = now;

        let src = null;
        try {
            src = activeModule.extract();
        } catch (e) {
            warn('[UHI] extract error', e);
            src = null;
        }

        if (src) {
            finalize(src, getRefererHost());
        }
    };

    const scheduleCheck = () => {
        if (checkScheduled) { return; }
        checkScheduled = true;
        requestAnimationFrame(() => {
            checkScheduled = false;
            tryExtract();
        });
    };

    const startObserver = () => {
        if (!CONFIG.USE_MUTATION_OBSERVER) { return; }

        const start = () => {
            if (!document.documentElement) {
                requestAnimationFrame(start);
                return;
            }

            observer = new MutationObserver(() => {
                scheduleCheck();
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: !!CONFIG.OBSERVE_ATTRIBUTES,
                attributeFilter: CONFIG.OBSERVE_ATTRIBUTES ? ['src', 'href', 'content', 'class', 'style'] : undefined
            });

            observerTimeoutId = setTimeout(() => {
                stopObserver();
            }, CONFIG.OBSERVER_MAX_RUNTIME_MS);
        };

        start();
    };

    const startPollerFallback = () => {
        let attempts = 0;
        pollerId = setInterval(() => {
            attempts++;
            tryExtract();

            if (attempts > CONFIG.POLL_MAX_ATTEMPTS) {
                stopPoller();
                if (activeModule.onFail) { activeModule.onFail(); }
            }
        }, CONFIG.POLL_INTERVAL_MS);
    };

    // 1) Try immediately
    tryExtract();

    // 2) Start watchers if not already finalized
    startObserver();
    startPollerFallback();

})();