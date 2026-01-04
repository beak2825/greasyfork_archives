// ==UserScript==
// @name         MediaFire Resim Convkey Link Oluşturucu
// @namespace    https://github.com/yourname/mediafire-convkey
// @version      1.5
// @description  Detect MediaFire convkey image paths (even if image loads late) and show direct downloadable link with orange "Resim Linkini Kopyala" panel.
// @author       YouCizgiciCocuk
// @license      MIT
// @match        https://www.mediafire.com/*
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555618/MediaFire%20Resim%20Convkey%20Link%20Olu%C5%9Fturucu.user.js
// @updateURL https://update.greasyfork.org/scripts/555618/MediaFire%20Resim%20Convkey%20Link%20Olu%C5%9Fturucu.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const RE = /convkey\/[A-Za-z0-9]+\/[A-Za-z0-9_\-]+\.(?:jpg|jpeg|png|gif)/i;
    let checkInterval = null;

    function findConvkeyInDocument(doc) {
        if (!doc) return null;
        const els = Array.from(doc.querySelectorAll('[src], [href], [srcset]'));
        for (const el of els) {
            const attrs = [el.src, el.getAttribute('src'), el.getAttribute('href'), el.getAttribute('srcset')];
            for (const val of attrs) {
                if (!val) continue;
                const m = val.match(RE);
                if (m) return m[0];
            }
        }

        for (const s of doc.scripts) {
            if (!s.textContent) continue;
            const m = s.textContent.match(RE);
            if (m) return m[0];
        }

        return null;
    }

    function searchAllFrames() {
        let path = findConvkeyInDocument(document);
        if (path) return path;

        for (const frame of document.querySelectorAll('iframe')) {
            try {
                const doc = frame.contentDocument;
                path = findConvkeyInDocument(doc);
                if (path) return path;
            } catch (e) {}
        }
        return null;
    }

    function buildFullUrl(path) {
        if (!path) return null;
        return `https://www.mediafire.com/${path.replace(/^\/+/, '')}`;
    }

    function injectPanel(url) {
        if (!url) return;
        const existing = document.getElementById('mf-convkey-panel');
        if (existing) return;

        const panel = document.createElement('div');
        panel.id = 'mf-convkey-panel';
        Object.assign(panel.style, {
            position: 'fixed',
            bottom: '12px',
            right: '12px',
            zIndex: '999999',
            background: 'rgba(255, 140, 0, 0.95)',
            color: '#fff',
            padding: '10px 14px',
            borderRadius: '10px',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '13px',
            lineHeight: '1.3',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            maxWidth: '360px'
        });

        const title = document.createElement('div');
        title.textContent = 'Doğrudan Resim Linki';
        title.style.fontWeight = '600';
        title.style.marginBottom = '6px';
        panel.appendChild(title);

        const link = document.createElement('a');
        link.href = url;
        link.textContent = url;
        link.target = '_blank';
        link.style.color = '#fff';
        link.style.wordBreak = 'break-all';
        panel.appendChild(link);

        const btns = document.createElement('div');
        btns.style.marginTop = '8px';
        btns.style.display = 'flex';
        btns.style.gap = '8px';

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Resim Linkini Kopyala';
        Object.assign(copyBtn.style, {
            background: '#ff9800',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 10px',
            cursor: 'pointer',
            fontWeight: '600'
        });
        copyBtn.addEventListener('click', () => {
            try {
                if (typeof GM_setClipboard === 'function') {
                    GM_setClipboard(url);
                } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(url);
                }
                copyBtn.textContent = 'Kopyalandı!';
                setTimeout(() => (copyBtn.textContent = 'Resim Linkini Kopyala'), 1500);
            } catch (e) {
                console.error('Copy failed', e);
            }
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        Object.assign(closeBtn.style, {
            background: 'transparent',
            color: '#fff',
            border: 'none',
            fontSize: '18px',
            marginLeft: 'auto',
            cursor: 'pointer',
            lineHeight: '1'
        });
        closeBtn.addEventListener('click', () => panel.remove());

        btns.appendChild(copyBtn);
        btns.appendChild(closeBtn);
        panel.appendChild(btns);
        document.body.appendChild(panel);
    }

    function tryDetect() {
        const path = searchAllFrames();
        if (path) {
            const url = buildFullUrl(path);
            injectPanel(url);
            if (checkInterval) clearInterval(checkInterval); // Stop after found
            return true;
        }
        return false;
    }

    // Check every 5 seconds until found
    function startPeriodicCheck() {
        tryDetect();
        checkInterval = setInterval(() => {
            tryDetect();
        }, 5000);
    }

    // Start after small delay (wait for MediaFire scripts to initialize)
    setTimeout(startPeriodicCheck, 1000);
})();
