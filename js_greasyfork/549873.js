// ==UserScript==
// @name         Esim.gg 取消充值限制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  取消ESIM.GG充值金额限制
// @author       @fooyao2
// @match        https://esim.gg/*
// @run-at       document-start
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549873/Esimgg%20%E5%8F%96%E6%B6%88%E5%85%85%E5%80%BC%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/549873/Esimgg%20%E5%8F%96%E6%B6%88%E5%85%85%E5%80%BC%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- Config ----------
    const ESTONIA_PATH = '/app/new/number/estonia/page-';
    const BULK_PATH = '/estonia/bulk/page-';

    // ---------- Utils ----------
    function classifyUrl(url) {
        const s = (url || '').toString();
        const isBulk = s.includes(BULK_PATH);
        const isTarget = isBulk || s.includes(ESTONIA_PATH);
        return { isTarget, isBulk };
    }

    function absoluteUrl(url) {
        const s = (url || '').toString();
        if (!s) return '';
        if (s.startsWith('http://') || s.startsWith('https://')) return s;
        if (s.startsWith('/')) return 'https://esim.gg' + s;
        return s;
    }

    function injectScript(code) {
        const s = document.createElement('script');
        s.textContent = code;
        (document.head || document.documentElement).appendChild(s);
    }

    function getScriptSrc(el) {
        // Prefer property, then attribute (covers TrustedScriptURL/URL-ish values)
        return el && (el.src || el.getAttribute('src') || '');
    }

    // ---------- Core replacement ----------
    function replaceContent(text, isBulkPage) {
        let m = text;

        if (isBulkPage) {
            // useState(.25) -> useState(.001)
            m = m.replace(/useState\)\(\.25\)/g, 'useState)(.001)');

            // number input: min .25 -> 0, step .05 -> .001
            m = m.replace(/type:"number",min:\.25,max:10,step:\.05/g, 'type:"number",min:0,max:10,step:.001');
            m = m.replace(/min:\.25/g, 'min:0');
            m = m.replace(/step:\.05/g, 'step:.001');

            // Display text €0.25 -> €0
            m = m.replace(/"€0\.25"/g, '"€0"')
                .replace(/'€0\.25'/g, "'€0'")
                .replace(/>€0\.25</g, '>€0<');
        } else {
            // Array of quick values
            m = m.replace(/\[\.5,1,2,5,10,25,50,100,200\]/g, '[.01,.1,.2,.5,1,2,5,10,25]');

            // Conditions and input attributes
            m = m.replace(/V>=\.5/g, 'V>=.001');
            m = m.replace(/type:"number",step:"0\.01",min:"0\.5"/g, 'type:"number",step:"0.001",min:"0"');

            // Math constraints
            m = m.replace(/Math\.max\(\.5,/g, 'Math.max(.001,')
                .replace(/Math\.max\(0\.5,/g, 'Math.max(0.001,');
            m = m.replace(/parseFloat\(([^)]+)\)\|\|1/g, 'parseFloat($1)||.001');

            // Slider
            m = m.replace(/min:\.5,max:200,step:\.5/g, 'min:.001,max:200,step:.001')
                .replace(/min:\.5(?=,|;|})/g, 'min:.001')
                .replace(/step:\.5(?=,|;|})/g, 'step:.001');

            // Display text €0.50 -> €0
            m = m.replace(/"€0\.50"/g, '"€0"')
                .replace(/'€0\.50'/g, "'€0'")
                .replace(/>€0\.50</g, '>€0<');
        }

        return m;
    }

    function fetchReplaceAndRun(url, isBulk) {
        const full = absoluteUrl(url);
        if (!full) return;
        fetch(full)
            .then(r => r.text())
            .then(code => injectScript(replaceContent(code, isBulk)))
            .catch(() => {});
    }

    // Handle a script node if it targets our Estonia/Bulk pages.
    function handleScriptNode(scriptEl) {
        if (!scriptEl || scriptEl.tagName !== 'SCRIPT') return false;
        const src = getScriptSrc(scriptEl);
        const { isTarget, isBulk } = classifyUrl(src);
        if (!isTarget) return false;

        // Prevent original script from loading/executing
        scriptEl.removeAttribute('src');
        scriptEl.type = 'text/plain';
        if (scriptEl.parentNode) scriptEl.parentNode.removeChild(scriptEl);

        // Load, patch, and inject our modified code
        fetchReplaceAndRun(src, isBulk);
        return true;
    }

    // ---------- Hooks (minimal + robust) ----------
    const originalAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function (child) {
        if (child && child.tagName === 'SCRIPT' && getScriptSrc(child)) {
            if (handleScriptNode(child)) return child;
        }
        return originalAppendChild.call(this, child);
    };

    const originalInsertBefore = Element.prototype.insertBefore;
    Element.prototype.insertBefore = function (newNode, referenceNode) {
        if (newNode && newNode.tagName === 'SCRIPT' && getScriptSrc(newNode)) {
            if (handleScriptNode(newNode)) return newNode;
        }
        return originalInsertBefore.call(this, newNode, referenceNode);
    };

    // Catch scripts created via innerHTML/parsing where append hooks may not run first
    const mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node && node.tagName === 'SCRIPT') {
                    handleScriptNode(node);
                }
            }
        }
    });
    mo.observe(document.documentElement || document, { childList: true, subtree: true });

    // Fallback: scan at DOMContentLoaded in case anything slipped through
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('script[src*="estonia"]').forEach((s) => {
            handleScriptNode(s);
        });
    });
})();
