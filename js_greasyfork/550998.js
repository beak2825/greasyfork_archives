// ==UserScript==
// @name         ipguys: replace api.ministra.me -> line.rs4ott.com (iOS Safari)
// @description  On ipguys.me/m3u_list replace api.ministra.me links with line.rs4ott.com. Safe for iOS Userscripts: no innerHTML rewrite, click-capture + DOM patching.
// @match        https://ipguys.me/m3u_list*
// @run-at       document-end
// @version 0.0.1.20250928202847
// @namespace https://greasyfork.org/users/1516350
// @downloadURL https://update.greasyfork.org/scripts/550998/ipguys%3A%20replace%20apiministrame%20-%3E%20liners4ottcom%20%28iOS%20Safari%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550998/ipguys%3A%20replace%20apiministrame%20-%3E%20liners4ottcom%20%28iOS%20Safari%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // CONFIG (edit these if you want a different replacement)
    var OLD_FULL = 'http://api.ministra.me/';
    var OLD_SIMPLE = 'api.ministra.me';
    var NEW_FULL = 'http://line.rs4ott.com/';
    var NEW_SIMPLE = 'line.rs4ott.com';

    // utility: replace known substrings in a string
    function replaceInString(s) {
        if (!s || typeof s !== 'string') return s;
        if (s.indexOf(OLD_FULL) !== -1) s = s.split(OLD_FULL).join(NEW_FULL);
        if (s.indexOf(OLD_SIMPLE) !== -1) s = s.split(OLD_SIMPLE).join(NEW_SIMPLE);
        return s;
    }

    // patch attributes for elements that may contain URLs
    function replaceAttributes(el) {
        if (!el || el.nodeType !== 1) return;
        try {
            // skip script/style/textarea/contentEditable
            var tag = el.tagName;
            if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || el.isContentEditable) return;
            var attrs = el.attributes;
            for (var i = 0; i < attrs.length; i++) {
                var a = attrs[i];
                if (a && a.value && a.value.indexOf(OLD_SIMPLE) !== -1) {
                    try { el.setAttribute(a.name, replaceInString(a.value)); } catch (e) {}
                }
            }
        } catch (e) { /* ignore */ }
    }

    // patch text nodes inside element (walk text nodes only)
    function replaceTextNodes(root) {
        if (!root) return;
        try {
            var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
            var n;
            while ((n = walker.nextNode())) {
                if (n.nodeValue && n.nodeValue.indexOf(OLD_SIMPLE) !== -1) {
                    n.nodeValue = replaceInString(n.nodeValue);
                }
            }
        } catch (e) {}
    }

    // process a node: replace attributes and text nodes safely
    function replaceInNode(root) {
        if (!root) return;
        try {
            if (root.nodeType === Node.TEXT_NODE) {
                if (root.nodeValue && root.nodeValue.indexOf(OLD_SIMPLE) !== -1) root.nodeValue = replaceInString(root.nodeValue);
                return;
            }
            if (root.nodeType === Node.ELEMENT_NODE) {
                var t = root.tagName;
                if (t === 'SCRIPT' || t === 'STYLE' || t === 'TEXTAREA' || root.isContentEditable) return;
                // attributes that might contain URLs
                var ATTRS = ['href','src','data-src','data-href','data-url','value','placeholder','title','alt'];
                for (var i = 0; i < ATTRS.length; i++) {
                    var a = ATTRS[i];
                    try {
                        // use querySelectorAll to find elements quickly
                        var list = root.querySelectorAll('[' + a + '*="' + OLD_SIMPLE + '"]');
                        for (var j = 0; j < list.length; j++) {
                            try {
                                var el = list[j];
                                var v = el.getAttribute(a);
                                if (v && v.indexOf(OLD_SIMPLE) !== -1) el.setAttribute(a, replaceInString(v));
                            } catch (ee) {}
                        }
                    } catch (ee) {}
                }
                // now patch text nodes inside
                if (root.textContent && root.textContent.indexOf(OLD_SIMPLE) !== -1) {
                    replaceTextNodes(root);
                }
            }
        } catch (e) {}
    }

    // run an initial safe pass over the document
    function initialPass() {
        try {
            // 1) patch attributes via selectors for efficiency
            var selectors = [
                '[href*="' + OLD_SIMPLE + '"]',
                '[src*="' + OLD_SIMPLE + '"]',
                '[data-src*="' + OLD_SIMPLE + '"]',
                '[data-href*="' + OLD_SIMPLE + '"]',
                '[data-url*="' + OLD_SIMPLE + '"]',
                '[value*="' + OLD_SIMPLE + '"]',
                '[placeholder*="' + OLD_SIMPLE + '"]',
                '[title*="' + OLD_SIMPLE + '"]',
                '[alt*="' + OLD_SIMPLE + '"]'
            ].join(',');
            var els = [];
            try { els = Array.prototype.slice.call(document.querySelectorAll(selectors)); } catch (e) { els = []; }
            for (var i = 0; i < els.length; i++) replaceAttributes(els[i]);

            // 2) patch text nodes across body (TreeWalker)
            try {
                var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
                var node;
                while ((node = walker.nextNode())) {
                    if (node.nodeValue && node.nodeValue.indexOf(OLD_SIMPLE) !== -1) node.nodeValue = replaceInString(node.nodeValue);
                }
            } catch (e) {}
        } catch (e) {}
    }

    // click capture handler - runs in capture phase to patch link before page handlers
    var postClickTimer = null;
    function setupClickCapture() {
        document.addEventListener('click', function (ev) {
            try {
                var el = ev.target;
                while (el && el !== document) {
                    if (el.tagName === 'A' || el.tagName === 'BUTTON') break;
                    el = el.parentElement;
                }
                if (!el || el === document) return;
                // If anchor - fix href immediately
                if (el.tagName === 'A') {
                    try {
                        var h = el.getAttribute('href');
                        if (h && h.indexOf(OLD_SIMPLE) !== -1) el.setAttribute('href', replaceInString(h));
                    } catch (e) {}
                }
                // schedule repeated replacements for a short period (covers AJAX content)
                if (postClickTimer) clearInterval(postClickTimer);
                var attempts = 0;
                postClickTimer = setInterval(function () {
                    attempts++;
                    try { replaceInNode(document.body); } catch (e) {}
                    if (attempts >= 12) { clearInterval(postClickTimer); postClickTimer = null; }
                }, 250);
            } catch (e) {}
        }, true); // capture phase = true
    }

    // MutationObserver: watch for new nodes and attribute changes
    var mo = null;
    var busy = false;
    function startObserver() {
        if (!document.body) {
            setTimeout(startObserver, 200);
            return;
        }
        try {
            mo = new MutationObserver(function (mutations) {
                if (busy) return;
                busy = true;
                try { mo.disconnect(); } catch (e) {}
                for (var i = 0; i < mutations.length; i++) {
                    var m = mutations[i];
                    if (m.addedNodes && m.addedNodes.length) {
                        for (var j = 0; j < m.addedNodes.length; j++) replaceInNode(m.addedNodes[j]);
                    }
                    if (m.type === 'attributes' && m.target) replaceInNode(m.target);
                    if (m.type === 'characterData' && m.target) replaceInNode(m.target);
                }
                setTimeout(function () {
                    try { mo.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true, attributeFilter: ['href','src','data-src','data-href','data-url','value','placeholder','title','alt'] }); } catch (e) {}
                    busy = false;
                }, 120);
            });
            mo.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true, attributeFilter: ['href','src','data-src','data-href','data-url','value','placeholder','title','alt'] });
        } catch (e) {
            setTimeout(startObserver, 300);
        }
    }

    // bootstrap
    try {
        initialPass();
        setupClickCapture();
        startObserver();
        // small console message
        try { console.info('ipguys replacer active: ' + OLD_FULL + ' -> ' + NEW_FULL); } catch (e) {}
    } catch (e) {
        try { console.error('ipguys replacer error', e); } catch (e2) {}
    }

})();
