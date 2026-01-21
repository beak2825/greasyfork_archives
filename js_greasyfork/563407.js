// ==UserScript==
// @name         On Stage
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Make images load at light-speed
// @license      MIT
// @match        https://msoe.instructure.com/*
// @icon         https://msoe.instructure.com/favicon.ico
// @grant        unsafeWindow
// @run-at       document-start
// @inject-into  page
// @downloadURL https://update.greasyfork.org/scripts/563407/On%20Stage.user.js
// @updateURL https://update.greasyfork.org/scripts/563407/On%20Stage.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* -----------------------------
       Indexed DB
    ------------------------------ */
    const dbp = new Promise(res => {
        const r = indexedDB.open('tm-img-cache', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('i');
        r.onsuccess = () => res(r.result);
    });

    const get = async k => {
        const db = await dbp;
        return new Promise(r => {
            const q = db.transaction('i').objectStore('i').get(k);
            q.onsuccess = () => r(q.result || null);
        });
    };

    const set = async (k, v) => {
        const db = await dbp;
        db.transaction('i', 'readwrite').objectStore('i').put(v, k);
    };

    /* -----------------------------
       URL Normalization
    ------------------------------ */
    const norm = url => {
        try {
            const u = new URL(url, location.href);
            u.search = '';
            u.hash = '';
            return u.href;
        } catch {
            return url;
        }
    };

    /* -----------------------------
       Blob Loader
    ------------------------------ */
    async function blobURL(url) {
        const key = norm(url);
        const cached = await get(key);
        if (cached) return URL.createObjectURL(cached);

        const r = await fetch(url, { cache: 'force-cache' });
        const b = await r.blob();
        set(key, b);
        return URL.createObjectURL(b);
    }

    /* -----------------------------
      Src / SrcSet / SetAttribute
    ------------------------------ */
    const imgProto = HTMLImageElement.prototype;

    const realSrc = Object.getOwnPropertyDescriptor(imgProto, 'src');
    const realSetAttr = Element.prototype.setAttribute;

    Object.defineProperty(imgProto, 'src', {
        configurable: true,
        set(v) {
            if (!v || v.startsWith('blob:')) {
                realSrc.set.call(this, v);
                return;
            }
            blobURL(v).then(b => realSrc.set.call(this, b));
        },
        get() {
            return realSrc.get.call(this);
        }
    });

    Object.defineProperty(imgProto, 'srcset', {
        configurable: true,
        set(v) {
            if (!v) return;
            const first = v.split(',')[0].trim().split(' ')[0];
            this.src = first;
        }
    });

    Element.prototype.setAttribute = function (k, v) {
        if (this instanceof HTMLImageElement && k === 'src') {
            this.src = v;
            return;
        }
        return realSetAttr.call(this, k, v);
    };

    /* -----------------------------
       Background Images
    ------------------------------ */
    async function lockBG(el) {
        const bg = getComputedStyle(el).backgroundImage;
        if (!bg || !bg.includes('url(')) return;

        const url = bg.match(/url\(["']?(.*?)["']?\)/)?.[1];
        if (!url || url.startsWith('blob:')) return;

        const b = await blobURL(url);
        el.style.backgroundImage = `url("${b}")`;
    }

    const scan = root => {
        root.querySelectorAll('img').forEach(img => {
            if (img.getAttribute('src'))
                img.src = img.getAttribute('src');
        });
        root.querySelectorAll('*').forEach(lockBG);
    };

    new MutationObserver(m => {
        for (const x of m) {
            x.addedNodes.forEach(n => n.nodeType === 1 && scan(n));
            if (x.target?.nodeType === 1) lockBG(x.target);
        }
    }).observe(document, { childList: true, subtree: true, attributes: true });

    scan(document);

})();
