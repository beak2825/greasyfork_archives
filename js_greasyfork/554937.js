// ==UserScript==
// @name        Xchina disable popup
// @namespace   http://tampermonkey.net/
// @version      1.53
// @description 绕过xChina弹窗检测
// @author      Aloazny && Grok
// @license     MIT
// @run-at      document-start
// @match       *://*.1909.me/*
// @match       *://*.8se.me/*
// @match       *://*.crxs.me/*
// @match       *://*.litu100.xyz/*
// @match       *://*.shise.me/*
// @match       *://*.xbbs.me/*
// @match       *://*.xbookcn.org/*
// @match       *://*.xchina*.*/*
// @match       *://*.xchina-cn.com/*
// @match       *://*.xchina.biz/*
// @match       *://*.xchina.co/*
// @match       *://*.xchina.com/*
// @match       *://*.xchina.fit/*
// @match       *://*.xchina.fun/*
// @match       *://*.xchina.ink/*
// @match       *://*.xchina.pro/*
// @match       *://*.xchina.site/*
// @match       *://*.xchina.store/*
// @match       *://*.xchina.tv/*
// @match       *://*.xchina001.site/*
// @match       *://*.xchina003.site/*
// @match       *://1909.me/*
// @match       *://8se.me/*
// @match       *://crxs.me/*
// @match       *://litu100.xyz/*
// @match       *://shise.me/*
// @match       *://xbbs.me/*
// @match       *://xbookcn.org/*
// @match       *://xchina*.*/*
// @match       *://xchina-cn.com/*
// @match       *://xchina.biz/*
// @match       *://xchina.co/*
// @match       *://xchina.com/*
// @match       *://xchina.fit/*
// @match       *://xchina.fun/*
// @match       *://xchina.ink/*
// @match       *://xchina.pro/*
// @match       *://xchina.site/*
// @match       *://xchina.store/*
// @match       *://xchina.tv/*
// @match       *://xchina001.site/*
// @match       *://xchina003.site/*
// @icon       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsSAAALEgHS3X78AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAIKSURBVFiF1ZexSxtRHMc/d2B0MBoJUpw8hKZTIZA/oNc/oLTg5tK4nJukUCh0aYcOduvYZGhT6JbFEimO10HrYFAREQKm51KXSBouS+JwHV6Cjd673JlLjn6XhB+/e59P3uW9d6fQjZPHAAwgw2hTqdsU5l9SAlC68HwXPrbYbUoz66wpzkdeobAxTngvpxe8V5w8Z8BSFALtKxpqVHCAyQnm1KjgvfxnAsk0PDHBcMRnLOHepz2DFeu6L5mWDqk4eRxf8FhCDBqbva5Vv4CZ7e9LZUH/3F+7+AFl3XVY/zPwINsPB0g9h7jmDQdYeCQddvj/QCrrDQe4PApBwNp0rz/MiXssgwP8zIUgYFtgfbtdj83C8oH8OnMVfpshCABUi4HaMVcHXhNMwNqE1nlo8OACAMcfQoPfTcBjUwkKDy6gF8Xa94pstQwt4AcOYsMKXcAvHMS+EKpAEDjA9KI4jEIRyLyVwztNcRi5JeX/NsgF4hpk3sjhZR12c+L7zWhP+w+pOwl4/YrdHFweQuePfF8YWsC23Os317nbmu80oX44pEC1KB4kemmdw9bj20DbElL/9pV1MTs+MviJKJmGyYTniQaIKY9rg/sCC4w4KlCLCl5v0VCbbQpRCXzdo6Ym1inYbfGmOs5sn1B7UaKiAHMA+68x7t/DmJka7avarzqNTzvU3n2nAvAXteumoVQH+scAAAAASUVORK5CYII=
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/554937/Xchina%20disable%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/554937/Xchina%20disable%20popup.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const d = document;

// 修改Cookie值
const COOKIE_MODIFY = `clicked_cpc_131=1
clicked_cpt_258=1
clicked_cpt_437=1
clicked_cpt_453=1
clicked_cpt_473=1
clicked_cpt_475=1
clicked_cpt_477=1
clicked_cpt_479=1
clicked_cpt_482=1
clicked_cpt_483=1
clicked_modal=1
showed_adscarat_shuffle_box=1`.trim().split('\n').map(l=>l.trim());

    const domain = '.' + location.hostname.split('.').slice(-2).join('.');
    const secure = location.protocol==='https:'?';secure':'';
    const expires = new Date(Date.now()+31536e6).toUTCString();

    const fixMap = Object.fromEntries(COOKIE_MODIFY.map(l=>l.split('=')));

    function setModCookie(n,v){
        const encodedName = encodeURIComponent(n);
        const encodedValue = encodeURIComponent(v);
        d.cookie = `${encodedName}=${encodedValue};expires=${expires};path=/;domain=${domain}${secure}`;
        if(typeof GM_cookie==='function')try{GM_cookie.set({name:encodedName,value:encodedValue,domain:location.hostname,path:'/',expirationDate:Math.floor(Date.now()/1000)+31536000})}catch(e){}
    }

    function createCookieRegex(key) {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp('(^|; )' + escapedKey + '=[^;]*', 'g');
    }

    COOKIE_MODIFY.forEach(l=>{const [n,v]=l.split('=');setModCookie(n,v)});

    const cookieDesc = Object.getOwnPropertyDescriptor(Document.prototype,'cookie')||Object.getOwnPropertyDescriptor(HTMLDocument.prototype,'cookie');
    if (cookieDesc && cookieDesc.configurable) {
       Object.defineProperty(d, 'cookie', {
        get: function() {
            let s = cookieDesc.get.call(this);
            for (const k in fixMap) {
                const reg = createCookieRegex(k);
                s = s.replace(reg, '$1' + k + '=' + fixMap[k]);
            }
            return s;
        },
        set: function(v) {
            for (const k in fixMap) {
                const reg = createCookieRegex(k);
                v = v.replace(reg, '$1' + k + '=' + fixMap[k]);
            }
             cookieDesc.set.call(this, v);
          },
          configurable: true
       });
   }

    function injectCSS(css) {
        if (typeof GM_addStyle === 'function') {
            GM_addStyle(css);
        } else {
            const style = Object.assign(d.createElement('style'), { textContent: css });
            (d.head || d.documentElement).appendChild(style);
        }
    }

// Css样式注入
const baseCSS =`
.modal-alert,
.block-overlay,
.adblock-overlay
{display:none!important}
`.trim();

const hideCSS = `
.a-media.ex-728-90,
.ad,
.exoclick_300x250,
.exoclick_300x500,
.google-adsbygoogle,
.media,
.outer-banner,
.photos > div.item > div > a[target="_blank"],
.photos > div.item > div[class^="exoclick_"],
.push-bottom,
.push-bottom-container[clickmode="cpt"],
.push-bottom-container[key] > .push-bottom,
.push-slider[key^="clicked_cpt"],
.push-top,
.push-top-container > .push-top[key],
.slider-ad,
[adid],
[class*="exoclick_"],
[class*="fa-ban"],
[class^="photoMask"],
[class^="playerMask"],
[href="#"]:not([data-page]),
[src^="https://xchina.click/"],
a[clickmode="ad"],
a[clickmode="cpt"],
a[clickmode="cpt"][target="_blank"][rel="nofollow noopener"] > img[src*="xchina"],
a[href*="//go.mnaspm.com"],
a[href*="/xchina.fun/redirect/ad"],
a[href*="xchina.click/prepare."],
a[href^="https://xchina.app"],
a[href^="https://xchina.click/"],
div > div:only-child > .media img[src*="/ad/"],
div.ex-300-250,
div.item > div.a-media,
div.media > a > img[src*="xchina"],
div.recommendation_widget,
div[class*="jquery-modal"],
div[class*="modalAd"],
div[class^="item photo zone"],
div[linkurl^="https://xchina.click/"],
div[style*="width: 300px;"][style*="height: 455px;"],
div[url^="https://xchina.click/"],
iframe[src*=".magsrv.com/"],
iframe[width="728"][height="90"],
ins.adsbygoogle[data-ad-slot],
script[src$="/ad-provider.js"] + ins
{display:none!important}
`.trim();

const imgCSS = `
div.media > a > img[src^="https://upload.xchina.biz/ad/"] {display:none!important}
div.media > a > img[src^="https://upload.xchina.biz/ad/"] ~ * {display:none!important}
`.trim();

    const cssContents = [baseCSS, hideCSS, imgCSS];
    const styleIds = ['xchina-base', 'xchina-hide', 'xchina-img'];
    let injectedStyles = new Set();

    function ensureCSSInjection() {
        cssContents.forEach((css, index) => {
            const styleId = styleIds[index];
            if (!injectedStyles.has(styleId)) {
                const existing = d.getElementById(styleId);
                if (!existing) {
                    const style = Object.assign(d.createElement('style'), { 
                        textContent: css,
                        id: styleId
                    });
                    (d.head || d.documentElement).appendChild(style);
                    injectedStyles.add(styleId);
                }
            }
        });
    }

    w.googleAdsInstance = {
        initGoogleTag: () => { w.googletag = { cmd: [] }; },
        initAdSense: () => { w.adsbygoogle = []; }
    };
    w.googleAdsInstance.initGoogleTag();
    w.googleAdsInstance.initAdSense();

    const realFetch = w.fetch;
    w.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : input.url || '';
        if (/recordDetect|adblock|detect/i.test(url)) {
            return Promise.resolve(new Response('{"success":true}', {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }));
        }
        if (url.includes && url.includes('6888.site/v2.php')) {
            return Promise.resolve(new Response('', {
                status: 200,
                statusText: 'OK'
            }));
        }
        return realFetch.apply(this, arguments);
    };

    Object.defineProperty(w, 'googleAdsInstance', { value: w.googleAdsInstance, writable: false });

    w.adConfigInstance = { active: true };
    w.adsSystemLoaded = w.AD_SCRIPT_LOADED = true;
    w.google_ad_client = 'ca-pub-2085856493428967';

    const noop = { fire: () => {}, show: () => {}, hide: () => {}, close: () => {}, showModal: () => {}, setContent: () => noop };
    ['Swal', 'sweetAlert', 'layer', 'artDialog', 'dialog', 'modal', 'Modal', 'ModalAlert'].forEach(name =>
        Object.defineProperty(w, name, { value: noop, writable: false, configurable: false })
    );

    const blockRegex = /Swal|modal_alert|请关闭广告拦截|isBlocked/i;
    w.setTimeout = new Proxy(w.setTimeout, {
        apply: (t, _, a) => blockRegex.test(a[0] + '') ? 0 : t(...a)
    });
    w.setInterval = new Proxy(w.setInterval, {
        apply: (t, _, a) => blockRegex.test(a[0] + '') ? 0 : t(...a)
    });

    d.addEventListener('beforescriptexecute', e => {
        if (blockRegex.test(e.target.textContent)) {
            e.preventDefault();
            e.stopPropagation();
            e.target.remove();
        }
    }, true);
    
    ensureCSSInjection();
    
    // 兼容Webview105以下
    d.addEventListener('DOMContentLoaded', () => {
        d.querySelectorAll('[class$="article"]').forEach(el => {
            if (el.querySelector('.media > a > img[src^="https://upload.xchina.biz/ad/"]')) el.style.display = 'none';
        });
        d.querySelectorAll('div.item').forEach(el => {
            if (el.querySelector('div.a-media')) el.style.display = 'none';
        });
        d.querySelectorAll('div.media').forEach(el => {
            if (el.querySelector('a > img[src*="xchina"]')) el.style.display = 'none';
        });
        d.querySelectorAll('.photos > div.item').forEach(el => {
            if (el.querySelector('div > a[target="_blank"]') || el.querySelector('div[class^="exoclick_"]')) {
                el.style.display = 'none';
            }
        });
        d.querySelectorAll('div').forEach(el => {
            const child = el.firstElementChild;
            if (child && child === el.lastElementChild && child.querySelector && child.querySelector('.media img[src*="/ad/"]')) {
                el.style.display = 'none';
            }
        });
    }, false);

    const f = { detected: false, details: { first: false, second: false }, timestamp: Date.now() };
    const h = (t, p) => { try { Object.defineProperty(t, p, { value: f, writable: true, configurable: true }); } catch(e) {} };
    const c = Document.prototype.createElement;
    Document.prototype.createElement = function(t) {
        const e = c.call(this, t);
        if (t === 'script') {
            const desc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src') || {};
            Object.defineProperty(e, 'src', {
                set(v) {
                    if (v && /ads?\.js|ad[\/.]|advertisement/.test(v)) {
                        setTimeout(() => e.dispatchEvent(new Event('load')), 10);
                        return;
                    }
                    desc.set ? desc.set.call(this, v) : this.setAttribute('src', v);
                },
                get: () => e.getAttribute('src')
            });
        }
        return e;
    };

    const x = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(m, u) {
        if (u && /recordDetect|adblock|detect/i.test(u)) return;
        return x.apply(this, arguments);
    };

    const o = w.registerSiteProbeCallback;
    w.registerSiteProbeCallback = function(cb) {
        if (o) o(cb);
        try { cb(f); } catch(e) {}
    };
    const g = w.getSiteProbeKey;
    w.getSiteProbeKey = function() {
        let k = g ? g() : '__' + Math.random().toString(36).slice(2,8);
        h(w, k);
        return k;
    };

    setTimeout(() => {
        const k = w.getSiteProbeKey();
        h(w, k);
        w.dispatchEvent(new CustomEvent('site:probe:complete', { detail: { key: k, result: f } }));
    }, 100);

    const cssObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.removedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.tagName === 'STYLE' && styleIds.includes(node.id)) {
                    setTimeout(ensureCSSInjection, 10);
                }
            });
        });
        ensureCSSInjection();
    });

    const elementObserver = new MutationObserver(() => {
        d.querySelectorAll('.block-overlay,[class*="block"][class*="overlay"],[class*="adb"][class*="overlay"]').forEach(e => e.remove());
    });

    cssObserver.observe(d.documentElement, { childList: true, subtree: true, attributes: false });
    elementObserver.observe(d.documentElement, { childList: true, subtree: true });
})();