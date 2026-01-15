// ==UserScript==
// @name         4khd 广告屏蔽
// @namespace    https://viayoo.com
// @version      1.7
// @description  移除4khd广告，兼容原生和GM环境。
// @author       Via
// @license      MIT
// @match        *://*.4khd.com/*
// @match        *://*.xxtt.ink/*
// @match        *://*.uuss.uk/*
// @match        *://*.ssuu.uk/*
// @icon         data:image/png;base64,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
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554174/4khd%20%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/554174/4khd%20%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hasGM = typeof GM_addStyle === 'function' && typeof unsafeWindow !== 'undefined';
    const win = hasGM ? unsafeWindow : window;
    const doc = document;

    const AD_SELECTORS = '.exo_wrapper,.popup,.centbtd,.exo-native-widget,.exo-native-widget-outer-container,ins[data-processed="true"],.popup-iframe,ins.adsbynetwork,.wb-contai,iframe[src*="pemsrv"],iframe[src*="magsrv"],iframe[src*="exoclick"]';
    const BLOCK_REGEX = /magsrv|interstitial|pemsrv|ad-provider\.js|disabley|ad-provider|exoclick|ads?[0-9]*\.|popunder|venor|popup|fxuuid|jduuid|linkSens|uuid|splash\.php/i;
    const PROTECT_REGEX = /popMagic|pemsrv|splash\.php|exoJsPop|BetterJsPop|disable-devtool|DisableDevtool|exoclick|magsrv/i;

    const currentHostname = location.hostname;
    const fuzzyDomain = currentHostname.replace(/\d+/g, '').replace(/\.+$/, '');

    function initStorageLock() {
        const PROTECT_KEYS = new Set(['inData', 'inData2', 'requestClosed', 'BetterJsPop_lastOpenedAt']);
        const COOKIE_BLOCK_RE = /fxuuid|jduuid|adsie/i;
        const WIN_PROPS = ['DisableDevtool', 'AdProvider', 'adConfig', 'popMagic', 'exoJsPop101', 'exoclick', 'exoJsPop'];
        const hostname = location.hostname;
        const expired = "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        ['fxuuid', 'jduuid', 'adsie'].forEach(name => {
            doc.cookie = name + expired;
            doc.cookie = name + expired + "; domain=" + hostname;
            doc.cookie = name + expired + "; domain=." + hostname;
        });
        const orgGet = Storage.prototype.getItem;
        const orgSet = Storage.prototype.setItem;
        Storage.prototype.getItem = function(key) {
            if (key === 'inData') return 'true';
            if (key === 'inData2') return '0';
            if (key === 'BetterJsPop_lastOpenedAt') return '9999999999';
            return orgGet.apply(this, arguments);
        };
        Storage.prototype.setItem = function(key, value) {
            if (PROTECT_KEYS.has(key)) return;
            return orgSet.apply(this, arguments);
        };
        const cookieDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') || Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
        if (cookieDesc?.configurable) {
            Object.defineProperty(doc, 'cookie', {
                get: () => cookieDesc.get.call(doc),
                set: (val) => {
                    if (COOKIE_BLOCK_RE.test(val)) return;
                    cookieDesc.set.call(doc, val);
                },
                configurable: true
            });
        }
        WIN_PROPS.forEach(p => {
            Object.defineProperty(win, p, {
                value: null,
                writable: false,
                configurable: false
            });
        });
    }

    function initAdBlocker() {
        const css = `${AD_SELECTORS}{display:none!important;visibility:hidden!important;width:0!important;height:0!important;opacity:0!important;pointer-events:none!important;}`;
        if (hasGM) GM_addStyle(css);

        const randomClass = 'via-clean-' + Math.random().toString(36).substring(2, 10);
        const enhancedCss = `${AD_SELECTORS}{display:none!important;visibility:hidden!important;width:0!important;height:0!important;opacity:0!important;pointer-events:none!important;} .${randomClass}{display:none!important;}`;

        function injectStyle(useRandom = false) {
            const selector = useRandom ? `.${randomClass}` : 'style[data-via-adclean]';
            if (document.querySelector(selector)) return;
            const style = document.createElement('style');
            if (useRandom) style.className = randomClass;
            else style.dataset.viaAdclean = 'true';
            style.textContent = useRandom ? enhancedCss : css;
            (document.head || document.documentElement || document.body || document).appendChild(style);
        }

        function earlyInject() {
            injectStyle(false);
            injectStyle(true);
        }

        if (document.documentElement) {
            earlyInject();
        } else {
            document.addEventListener('readystatechange', () => {
                if (document.readyState !== 'loading') earlyInject();
            }, {
                once: true
            });
            document.addEventListener('DOMContentLoaded', earlyInject, {
                once: true
            });
        }

        setInterval(() => {
            if (!document.querySelector('style[data-via-adclean]') && !document.querySelector(`.${randomClass}`)) {
                earlyInject();
            }
        }, 800 + Math.random() * 400);

        function aggressiveClean() {
            const ads = document.querySelectorAll(AD_SELECTORS);
            if (ads.length === 0) return;
            ads.forEach(el => {
                el.remove();
            });
        }
        setTimeout(aggressiveClean, 80);
        setInterval(aggressiveClean, 800);
    }

    function checkExternal(href) {
        try {
            const url = new URL(href, location.href);
            if (url.pathname.includes('splash.php') || url.search.includes('link.php')) return true;
            return !url.hostname.includes('4khd') && !url.hostname.includes(fuzzyDomain);
        } catch (e) {
            return false;
        }
    }

    function initEventListeners() {
        const blockExternalLinks = (e) => {
            const a = e.target.closest('a, area');
            if (a?.href && checkExternal(a.href)) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        };
        doc.addEventListener('click', blockExternalLinks, true);
        doc.addEventListener('mouseover', blockExternalLinks, true);
        doc.addEventListener('touchstart', blockExternalLinks, true);
    }

    function initNetworkInterceptors() {
        win.open = new Proxy(win.open, {
            apply: (t, th, args) => (args[0] && (BLOCK_REGEX.test(args[0]) || checkExternal(args[0]))) ? null : Reflect.apply(t, th, args)
        });
        win.fetch = new Proxy(win.fetch, {
            apply: (t, th, args) => {
                const url = args[0]?.url || args[0];
                if (typeof url === 'string' && BLOCK_REGEX.test(url)) {
                    return Promise.resolve(new Response('', {
                        status: 200,
                        statusText: 'OK'
                    }));
                }
                return Reflect.apply(t, th, args);
            }
        });
        const orgOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(_, url) {
            if (typeof url === 'string' && BLOCK_REGEX.test(url)) {
                this._blocked = true;
                return;
            }
            return orgOpen.apply(this, arguments);
        };
        const orgSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            if (this._blocked) {
                this.dispatchEvent(new Event('load'));
                this.dispatchEvent(new Event('readystatechange'));
                return;
            }
            return orgSend.apply(this, arguments);
        };
    }

    function initMutationObserver() {
        const observer = new MutationObserver(muts => {
            muts.forEach(mut => {
                mut.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    if (node.tagName === 'SCRIPT' && PROTECT_REGEX.test(node.textContent + node.src)) {
                        node.remove();
                        return;
                    }
                    if (node.matches?.(AD_SELECTORS)) {
                        node.remove();
                    } else {
                        node.querySelectorAll?.(AD_SELECTORS).forEach(el => el.remove());
                    }
                });
            });
        });
        observer.observe(doc.documentElement, {
            childList: true,
            subtree: true
        });
    }

    function addImageButtons() {
        const style = doc.createElement('style');
        style.textContent = `
            .img-button-container{position:absolute;bottom:15px;right:10px;display:flex;gap:8px;z-index:100}
            .img-btn{padding:8px 16px;border:1px solid rgba(255,255,255,0.25);border-radius:16px;cursor:pointer;font-size:13px;font-weight:600;backdrop-filter:blur(16px);background:rgba(255,255,255,0.3);color:#1C2526;transition:all 0.2s;font-family:sans-serif}
            @media (prefers-color-scheme:dark){.img-btn{background:rgba(40,40,40,0.3);color:#f0f0f0}}
            .img-btn:hover{background:rgba(255,255,255,0.4);transform:translateY(-1px)}
            .image-wrapper{position:relative;display:inline-block}
        `;
        doc.head.appendChild(style);

        const processImages = () => {
            doc.querySelectorAll('#basicExample > a.imageLink').forEach(link => {
                if (link.querySelector('.img-button-container')) return;
                const wrapper = doc.createElement('div');
                wrapper.className = 'image-wrapper';
                link.parentNode.insertBefore(wrapper, link);
                wrapper.appendChild(link);
                const container = doc.createElement('div');
                container.className = 'img-button-container';
                const btn = doc.createElement('button');
                btn.className = 'img-btn';
                btn.textContent = '打开';
                const img = link.querySelector('img');
                const url = img?.src || img?.dataset?.src || link.href;
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const a = doc.createElement('a');
                    a.href = url;
                    a.download = url.split('/').pop();
                    a.click();
                };
                container.appendChild(btn);
                wrapper.appendChild(container);
            });
        };
        const imageObserver = new MutationObserver(processImages);
        imageObserver.observe(doc.body || doc.documentElement, {
            childList: true,
            subtree: true
        });
        processImages();
    }

    win.popMagic = {
        init: function() {
            console.log('popMagic blocked');
        }
    };

    function initAll() {
        initAdBlocker();
        initStorageLock();
        initEventListeners();
        initNetworkInterceptors();
        initMutationObserver();
        addImageButtons();
    }

    if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();