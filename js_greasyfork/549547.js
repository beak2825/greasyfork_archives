// ==UserScript==
// @name         Hide Torn P&L Forums
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Hide TORNS Politics and Law cesspit 
// @author       DarthRevan
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-end
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/549547/Hide%20Torn%20PL%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/549547/Hide%20Torn%20PL%20Forums.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const hidePrefixes = [
        'https://www.torn.com/forums.php#/p=forums&f=38',
        'ttps://www.torn.com/forums.php#/p=forums&f=38'
    ];
    const pagePrefix = 'https://www.torn.com/forums.php#/p=forums&f=38';

    let hiddenPageEls = [];
    let overlayEl = null;

    function startsWithAny(str) {
        return hidePrefixes.some(p => str && str.startsWith(p));
    }

    function showOverlay() {
        if (overlayEl) return;
        overlayEl = document.createElement('div');
        overlayEl.textContent = 'Save yourself the pain, you deserve better than P&L';
        Object.assign(overlayEl.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '26px',
            fontWeight: 'bold',
            color: '#fff',
            background: 'rgba(17, 17, 17, 0.95)',
            padding: '24px 36px',
            borderRadius: '14px',
            boxShadow: '0 0 20px rgba(0,0,0,0.6)',
            textAlign: 'center',
            zIndex: 2147483647, 
            pointerEvents: 'none'
        });
        document.documentElement.appendChild(overlayEl);
    }

    function removeOverlay() {
        if (overlayEl) {
            overlayEl.remove();
            overlayEl = null;
        }
    }

    function hideForumPageIfMatching() {
        const loc = location.href || '';
        const isBlocked = loc.startsWith(pagePrefix);

        const candidates = [
            document.querySelector('main'),
            document.getElementById('content'),
            document.querySelector('.content')
        ];

        if (isBlocked) {
            hiddenPageEls = [];
            for (const el of candidates) {
                if (el && el.style.opacity !== '0') {
                    hiddenPageEls.push(el);
                    el.style.transition = 'opacity 200ms ease';
                    el.style.opacity = '0';
                }
            }
            showOverlay();
        } else {
            for (const el of hiddenPageEls) {
                el.style.opacity = '1';
            }
            hiddenPageEls = [];
            removeOverlay();
        }
    }

    function findPostAncestor(node, maxLevels = 7) {
        let cur = node;
        for (let i = 0; i < maxLevels && cur; i++) {
            if (cur === document.documentElement) break;
            const id = (cur.id || '').toLowerCase();
            const cls = (cur.className || '').toLowerCase();
            if (/(post|thread|topic|message|comment|row|entry)/.test(id + ' ' + cls)) return cur;
            cur = cur.parentElement;
        }
        return node;
    }

    function hideElement(el) {
        if (!el || el.dataset.hiddenByScript === '1') return;
        el.dataset.hiddenByScript = '1';
        el.style.transition = 'opacity 200ms ease, height 200ms ease';
        el.style.opacity = '0';
        el.style.height = '0';
        el.style.overflow = 'hidden';
    }

    function scanAndHide() {
        // anchors
        for (const a of document.querySelectorAll('a[href]')) {
            const href = a.getAttribute('href') || '';
            if (startsWithAny(href.trim())) {
                hideElement(findPostAncestor(a));
            }
        }
        // text nodes
        for (const el of document.querySelectorAll('div, p, span, li, article')) {
            if (el.dataset.checkedText === '1') continue;
            el.dataset.checkedText = '1';
            const text = (el.textContent || '').trim().slice(0, 200);
            if (startsWithAny(text)) {
                hideElement(findPostAncestor(el));
            }
        }
    }

    let scanTimeout;
    function scheduleScan() {
        clearTimeout(scanTimeout);
        scanTimeout = setTimeout(scanAndHide, 200);
    }

    const observer = new MutationObserver(scheduleScan);

    function init() {
        hideForumPageIfMatching();
        scheduleScan();
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('hashchange', hideForumPageIfMatching);
    window.addEventListener('popstate', hideForumPageIfMatching);
})();
