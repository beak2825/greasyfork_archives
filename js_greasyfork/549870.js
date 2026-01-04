// ==UserScript==
// @name         bqpanel - replace line.l-ion.xyz -> line.kanale-shqip.com (iOS Safari compatible)
// @namespace    https://example.com/
// @version      1.2
// @description  Replace generated links so http://line.l-ion.xyz/... becomes http://line.kanale-shqip.com/... (optimized for Userscripts iOS Safari extension).
// @author       You
// @match        https://bqpanel.com/lines*
// @match        https://bqpanel.com/lines?*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549870/bqpanel%20-%20replace%20linel-ionxyz%20-%3E%20linekanale-shqipcom%20%28iOS%20Safari%20compatible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549870/bqpanel%20-%20replace%20linel-ionxyz%20-%3E%20linekanale-shqipcom%20%28iOS%20Safari%20compatible%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FROM_RE = /https?:\/\/line\.l-ion\.xyz\//gi;
    const TO = 'http://line.kanale-shqip.com/';

    function replaceInString(s) {
        if (!s || typeof s !== 'string') return s;
        // reset lastIndex to be safe with global regex reuse
        FROM_RE.lastIndex = 0;
        return s.replace(FROM_RE, TO);
    }

    // Replace on element attributes we care about
    function replaceAttributes(el) {
        if (!el || el.nodeType !== 1) return;
        try {
            ['href','src','value','placeholder'].forEach(name => {
                if (el.hasAttribute && el.hasAttribute(name)) {
                    const old = el.getAttribute(name);
                    const nw = replaceInString(old);
                    if (nw !== old) el.setAttribute(name, nw);
                }
            });
            // generic pass for data-* attributes
            Array.from(el.attributes).forEach(attr => {
                if (attr && /^data-/.test(attr.name)) {
                    const nw = replaceInString(attr.value);
                    if (nw !== attr.value) el.setAttribute(attr.name, nw);
                }
            });
        } catch (e) { /* ignore errors on some elements */ }
    }

    // Replace text nodes quickly
    function replaceTextNode(node) {
        if (!node || node.nodeType !== Node.TEXT_NODE) return;
        if (node.nodeValue && node.nodeValue.includes('line.l-ion.xyz')) {
            node.nodeValue = replaceInString(node.nodeValue);
        }
    }

    // Walk subtree but avoid expensive full scans unless necessary
    function walkAndReplace(root) {
        if (!root) return;
        if (root.nodeType === Node.TEXT_NODE) return replaceTextNode(root);
        if (root.nodeType === Node.ELEMENT_NODE) replaceAttributes(root);

        // quick skip if subtree has no target substring
        const text = root.textContent || '';
        if (!text.includes('line.l-ion.xyz') && !hasRelevantAttributes(root)) return;

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeType === Node.TEXT_NODE) replaceTextNode(node);
            else if (node.nodeType === Node.ELEMENT_NODE) {
                replaceAttributes(node);
                // handle input/textarea current value
                if ((node.matches && (node.matches('input') || node.matches('textarea'))) && typeof node.value === 'string' && node.value.includes('line.l-ion.xyz')) {
                    node.value = replaceInString(node.value);
                    // also update attribute if present
                    if (node.getAttribute('value')) node.setAttribute('value', node.value);
                }
            }
        }
    }

    function hasRelevantAttributes(el) {
        if (!el || el.nodeType !== 1) return false;
        try {
            const attrs = ['href','src','value','placeholder'];
            for (let a of attrs) if (el.getAttribute && el.getAttribute(a) && el.getAttribute(a).includes('line.l-ion.xyz')) return true;
            for (let i=0;i<el.attributes.length;i++) {
                const at = el.attributes[i];
                if (at && at.value && at.value.includes('line.l-ion.xyz')) return true;
            }
        } catch (e) {}
        return false;
    }

    // Observe mutations so newly generated links are auto-fixed
    const observer = new MutationObserver((mutations) => {
        for (const mut of mutations) {
            if (mut.addedNodes && mut.addedNodes.length) {
                mut.addedNodes.forEach(n => {
                    try {
                        if (n.nodeType === Node.TEXT_NODE) {
                            if (n.nodeValue && n.nodeValue.includes('line.l-ion.xyz')) replaceTextNode(n);
                        } else if (n.nodeType === Node.ELEMENT_NODE) {
                            const quick = (n.textContent || '') + (n.getAttribute && (n.getAttribute('href') || '') + (n.getAttribute('value') || ''));
                            if (quick.includes('line.l-ion.xyz')) walkAndReplace(n);
                        }
                    } catch (e) {}
                });
            }
            if (mut.type === 'attributes' && mut.target) {
                try {
                    const t = mut.target;
                    const an = mut.attributeName;
                    const val = t.getAttribute(an);
                    if (val && val.includes('line.l-ion.xyz')) replaceAttributes(t);
                } catch (e) {}
            }
            if (mut.type === 'characterData' && mut.target) {
                if (mut.target.nodeValue && mut.target.nodeValue.includes('line.l-ion.xyz')) replaceTextNode(mut.target);
            }
        }
    });

    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href','src','value','placeholder'],
        characterData: true
    });

    // initial scan
    try { walkAndReplace(document.body); } catch (e) {}

    // small safety: after user clicks Generate, re-scan shortly after
    document.addEventListener('click', () => setTimeout(() => { try { walkAndReplace(document.body); } catch (e) {} }, 250), true);

    // Paste handler: when user pastes into any input/textarea, correct the link in-place
    document.addEventListener('paste', function (ev) {
        try {
            const target = ev.target;
            if (!target) return;
            const isInput = target.matches && (target.matches('input') || target.matches('textarea'));
            if (!isInput) return;
            // read clipboard text if available via event
            let pasted = '';
            if (ev.clipboardData && ev.clipboardData.getData) {
                pasted = ev.clipboardData.getData('text/plain') || '';
            }
            // if we found text containing the domain, replace it and insert manually
            if (pasted && pasted.includes('line.l-ion.xyz')) {
                ev.preventDefault();
                const replaced = replaceInString(pasted);
                // insert at cursor / selection
                const start = target.selectionStart || 0;
                const end = target.selectionEnd || start;
                const val = target.value || '';
                const newVal = val.slice(0, start) + replaced + val.slice(end);
                target.value = newVal;
                // move caret after inserted text
                const pos = start + replaced.length;
                try { target.setSelectionRange(pos, pos); } catch (e) {}
                // update attribute if present
                if (target.getAttribute && target.getAttribute('value')) target.setAttribute('value', target.value);
            }
        } catch (e) {}
    }, true);

    // convenience: callable from console if needed
    window.replaceKanale = () => walkAndReplace(document.body);

    console.info('Userscript active: line.l-ion.xyz -> line.kanale-shqip.com');
})();