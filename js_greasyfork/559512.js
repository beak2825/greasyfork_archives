// ==UserScript==
// @name         Avoid eBay Tracking
// @version      1.0
// @description  Remove common eBay tracking ids/params and strip trackable keys
// @author       spacegravy
// @license      GPL-3.0-only
// @match        https://*.ebay.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1549977
// @downloadURL https://update.greasyfork.org/scripts/559512/Avoid%20eBay%20Tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/559512/Avoid%20eBay%20Tracking.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Config: keys / params to strip
    const ATTR_TO_REMOVE = [
        'trackableid', 'trackableId',
        'trackablemoduleid', 'trackableModuleId',
        'trackablemoduleId', 'trackableModuleid',
        'moduleid', 'moduleId',
        '_sp', 'operationId', 'moduledtl', 'sid'
    ];

    const INPUT_NAMES_REMOVE = [
        '_trksid', '_trkparms', 'rt', 'itmmeta', 'tu', 'clientSideExperiments', 'itmprp', 'algv', 'alg', 'mehot', '_from'
    ];

    const QUERY_PARAMS_REMOVE = [
        '_trksid', '_trkparms', 'rt', 'itmmeta', 'tu', 'clientSideExperiments', 'itmprp', 'algv', 'alg', 'mehot', '_from'
    ];

    const DATA_MARK = 'tm-sanitized';

    // Utility: safe URL parsing
    function parseURL(href) {
        try {
            return new URL(href, location.origin);
        } catch (e) {
            return null;
        }
    }

    // Remove listed query params but keep all others intact
    function stripTrackingParamsFromHref(href) {
        const url = parseURL(href);
        if (!url) return href;
        let removed = false;
        for (const p of QUERY_PARAMS_REMOVE) {
            if (url.searchParams.has(p)) {
                url.searchParams.delete(p);
                removed = true;
            }
        }
        return removed ? url.toString() : href;
    }

    // Recursively remove keys from objects/arrays (case-sensitive and case-insensitive)
    function removeKeysFromObject(obj, keysToRemove) {
        if (!obj || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) {
            return obj.map(item => removeKeysFromObject(item, keysToRemove));
        }
        for (const k of Object.keys(obj)) {
            // check case-insensitively as well
            const lower = k.toLowerCase();
            if (keysToRemove.some(key => key.toLowerCase() === lower || key === k)) {
                delete obj[k];
                continue;
            }
            if (typeof obj[k] === 'object' && obj[k] !== null) {
                obj[k] = removeKeysFromObject(obj[k], keysToRemove);
            }
        }
        return obj;
    }

    // Safely try to parse JSON-like strings that may contain &quot; escapes
    function tryParseJSONAttr(value) {
        if (!value || typeof value !== 'string') return null;
        // common encodings: &quot; or html entities
        let v = value.trim();
        // if it looks already like JSON
        if ((v.startsWith('{') && v.endsWith('}')) || (v.startsWith('[') && v.endsWith(']'))) {
            try { return JSON.parse(v); } catch (e) {}
        }
        // decode &quot; and numeric entities, simple replace
        try {
            v = v.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
            if ((v.startsWith('{') && v.endsWith('}')) || (v.startsWith('[') && v.endsWith(']'))) {
                return JSON.parse(v);
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    // Serialize back to compact JSON
    function safeStringifyForAttr(obj) {
        try {
            return JSON.stringify(obj);
        } catch (e) {
            return null;
        }
    }

    // Parse data-viewport JSON safely and remove tracking keys
    function sanitizeDataViewport(el) {
        const attr = el.getAttribute('data-viewport');
        if (!attr) return false;
        let parsed = tryParseJSONAttr(attr);
        if (!parsed) return false;
        const keysToNuke = ['trackableId', 'trackableid', 'trackableModuleId', 'trackablemoduleid', 'trackablemoduleId', 'trackableModuleid', 'moduleId', 'moduleid', 'tu', 'interaction', 'operationId', 'moduledtl', 'sid'];
        const before = JSON.stringify(parsed);
        parsed = removeKeysFromObject(parsed, keysToNuke);
        const after = JSON.stringify(parsed);
        if (before !== after) {
            const s = safeStringifyForAttr(parsed);
            if (s !== null) {
                el.setAttribute('data-viewport', s);
                return true;
            }
        }
        return false;
    }

    // Sanitize data-interactions specifically (remove "interaction" key from objects inside array)
    function sanitizeDataInteractions(el) {
        const attr = el.getAttribute('data-interactions');
        if (!attr) return false;
        let parsed = tryParseJSONAttr(attr);
        if (!parsed) return false;
        // parsed could be array or object
        const keysToNuke = ['interaction', 'trackableId', 'trackableid', 'trackableModuleId', 'trackablemoduleid',  'operationId', 'moduledtl', 'sid'];
        const before = JSON.stringify(parsed);
        parsed = removeKeysFromObject(parsed, keysToNuke);
        const after = JSON.stringify(parsed);
        if (before !== after) {
            const s = safeStringifyForAttr(parsed);
            if (s !== null) {
                el.setAttribute('data-interactions', s);
                return true;
            } else {
                // if stringify fails, remove attribute
                el.removeAttribute('data-interactions');
                return true;
            }
        }
        return false;
    }

    // Sanitize any data-s-* attributes which often contain JSON-like strings with trackable ids
    function sanitizeDataSAttributes(el) {
        let changed = false;
        for (const a of Array.from(el.attributes || [])) {
            if (!a || !a.name) continue;
            if (!a.name.startsWith('data-s-')) continue;
            const val = a.value;
            if (!val) continue;
            const parsed = tryParseJSONAttr(val);
            if (!parsed) {
                // If value doesn't parse as JSON, still try to strip simple occurrences of trackable id tokens
                // e.g. remove occurrences of "trackableId":"..." within the string
                const cleaned = val.replace(/"?(trackableId|trackableid|trackableModuleId|trackablemoduleid|moduleId|moduleid)"?\s*:\s*"[^"]*"/gi, '');
                if (cleaned !== val) {
                    el.setAttribute(a.name, cleaned);
                    changed = true;
                }
                continue;
            }
            const keysToNuke = ['trackableId', 'trackableid', 'trackableModuleId', 'trackablemoduleid', 'moduleId', 'moduleid', 'interaction', 'tu', 'operationId', 'moduledtl', 'sid'];
            const before = JSON.stringify(parsed);
            const afterObj = removeKeysFromObject(parsed, keysToNuke);
            const after = JSON.stringify(afterObj);
            if (before !== after) {
                const s = safeStringifyForAttr(afterObj);
                if (s !== null) {
                    el.setAttribute(a.name, s);
                } else {
                    el.removeAttribute(a.name);
                }
                changed = true;
            }
        }
        return changed;
    }

    // Sanitize attributes on an element
    function sanitizeAttributes(el) {
        if (!el || el.dataset[DATA_MARK]) return false;
        let changed = false;

        // Remove exact attributes in list (case-insensitive check)
        for (const attrName of ATTR_TO_REMOVE) {
            if (el.hasAttribute(attrName)) {
                el.removeAttribute(attrName);
                changed = true;
            }
            const alt = attrName.toLowerCase();
            if (alt !== attrName && el.hasAttribute(alt)) {
                el.removeAttribute(alt);
                changed = true;
            }
        }

        // Remove attributes that start with "trackable" or exactly "_sp"
        for (const a of Array.from(el.attributes || [])) {
            if (!a || !a.name) continue;
            const n = a.name.toLowerCase();
            if (n.startsWith('trackable') || n === '_sp') {
                if (!ATTR_TO_REMOVE.includes(a.name)) {
                    el.removeAttribute(a.name);
                    changed = true;
                }
            }
        }

        // Special sanitize: data-viewport
        if (el.hasAttribute('data-viewport')) {
            if (sanitizeDataViewport(el)) changed = true;
        }

        // Special sanitize: data-interactions
        if (el.hasAttribute('data-interactions')) {
            if (sanitizeDataInteractions(el)) changed = true;
        }

        // Special sanitize: data-s-* attributes
        if ([...el.attributes || []].some(a => a && a.name && a.name.startsWith && a.name.startsWith('data-s-'))) {
            if (sanitizeDataSAttributes(el)) changed = true;
        }

        // If anchor, sanitize href and _sp attribute
        if (el.tagName && el.tagName.toLowerCase() === 'a') {
            const href = el.getAttribute('href');
            if (href) {
                const newHref = stripTrackingParamsFromHref(href);
                if (newHref !== href) {
                    el.setAttribute('href', newHref);
                    changed = true;
                }
            }
            if (el.hasAttribute('_sp')) {
                el.removeAttribute('_sp');
                changed = true;
            }
        }

        // Inputs: remove name/value for tracking hidden inputs
        if (el.tagName && el.tagName.toLowerCase() === 'input') {
            const name = el.getAttribute('name');
            if (name && INPUT_NAMES_REMOVE.includes(name)) {
                el.removeAttribute('name');
                try { el.value = ''; } catch (e) {}
                changed = true;
            }
        }

        // mark processed to avoid repeated work
        try { el.dataset[DATA_MARK] = '1'; } catch (e) {}
        return changed;
    }

    // Walk subtree and sanitize elements
    function sanitizeSubtree(root) {
        if (!root) return;
        if (root.nodeType === 1) sanitizeAttributes(root);

        // Candidate selector covers anchors, data-viewport, data-interactions, inputs and some trackable attrs
        const selector = [
            'a[href*="_trk"]',
            'a[href*="itmmeta"]',
            'a[href*="tu="]',
            'a[href*="_from="]',
            '[data-viewport]',
            '[data-interactions]',
            '[trackableid]',
            '[trackablemoduleid]',
            '[trackableId]',
            '[trackableModuleId]',
            'input[name="_trksid"]',
            'input[name="_trkparms"]',
            'input[name="rt"]',
            'input[name="itmmeta"]',
            'input[name="tu"]',
            'input[name="_from"]',
            '[_sp]'
        ].join(',');
        const nodes = root.querySelectorAll ? root.querySelectorAll(selector) : [];
        for (const n of nodes) {
            sanitizeAttributes(n);
        }

        // Additionally, find elements that have any data-s-* attribute (can't query with wildcard reliably),
        // so scan subtree for attributes containing "data-s-" in attributeName via a simple traversal
        try {
            const all = root.querySelectorAll ? root.querySelectorAll('*') : [];
            for (const el of all) {
                if (el.dataset && el.dataset[DATA_MARK]) continue;
                // quick check: does element have any attr starting with data-s-?
                let hasDS = false;
                for (const a of Array.from(el.attributes || [])) {
                    if (a && a.name && a.name.startsWith && a.name.startsWith('data-s-')) { hasDS = true; break; }
                }
                if (hasDS) sanitizeAttributes(el);
            }
        } catch (e) {
            // ignore traversal errors
        }

        // Also sanitize anchors that might not match the quick selectors but contain parameters
        const extraAnchors = root.querySelectorAll ? root.querySelectorAll('a[href]') : [];
        for (const a of extraAnchors) {
            if (a.dataset[DATA_MARK]) continue;
            const h = a.getAttribute('href') || '';
            if (h.includes('_trksid') || h.includes('_trkparms') || h.includes('itmmeta') || h.includes('rt=') || h.includes('tu=') || h.includes('_from=')) {
                sanitizeAttributes(a);
            } else {
                if (a.hasAttribute('_sp')) sanitizeAttributes(a);
                else try { a.dataset[DATA_MARK] = '1'; } catch (e) {}
            }
        }
    }

    // Initial sanitize once DOM is ready-ish
    function initialRun() {
        try {
            sanitizeSubtree(document);
        } catch (e) {
            // ignore
        }
    }

    // Observe DOM changes to sanitize injected content
    const observer = new MutationObserver(muts => {
        for (const m of muts) {
            if (m.type === 'childList') {
                for (const n of m.addedNodes) {
                    if (n.nodeType !== 1) continue;
                    sanitizeSubtree(n);
                }
            }
            if (m.type === 'attributes') {
                const target = m.target;
                if (target && target.nodeType === 1) {
                    const attr = m.attributeName || '';
                    const interested = (
                        attr === 'data-viewport' ||
                        attr === 'data-interactions' ||
                        attr.toLowerCase().startsWith('trackable') ||
                        attr === '_sp' ||
                        attr === 'href' ||
                        attr === 'name' ||
                        attr === 'value' ||
                        attr.startsWith('data-s-')
                    );
                    if (interested || !attr) sanitizeAttributes(target);
                }
            }
        }
    });

    // Start observing documentElement once available (no restrictive attributeFilter so data-s-* and others are caught)
    function startObserver() {
        try {
            observer.observe(document.documentElement || document, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeOldValue: false
            });
        } catch (e) {
            try { observer.observe(document.body || document, { childList: true, subtree: true, attributes: true }); } catch (e2) {}
        }
    }

    // Run at appropriate time
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initialRun();
        startObserver();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            initialRun();
            startObserver();
        }, { once: true });
        setTimeout(() => { initialRun(); startObserver(); }, 5000);
    }

    // Expose a simple manual API for testing in console:
    // window.ebaySanitizer && window.ebaySanitizer.sanitizeSubtree(document)
    window.ebaySanitizer = {
        sanitizeSubtree,
        sanitizeAttributes,
        stripTrackingParamsFromHref,
        // helper to test data-s-* parsing
        tryParseJSONAttr
    };
})();
