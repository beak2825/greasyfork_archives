// ==UserScript==
// @name         El Pais Bypass and Readability Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove paywall and improve readability on El País articles
// @author       MiguelDLM
// @match        https://elpais.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563793/El%20Pais%20Bypass%20and%20Readability%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/563793/El%20Pais%20Bypass%20and%20Readability%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Selectors to target the freemium/paywall element(s)
    const PAYWALL_SELECTORS = [
        '#ctn_freemium_article',
        'div.a_s._cf',
        '.a_s._cf',
        '[id*="freemium"]',
        '.paywall',
        '.paywall-overlay',
    ];

    // Add strong CSS rules to hide possible overlays and restore scroll
    function injectCSS() {
        const css = `
        /* Force-hide paywall elements */
        #ctn_freemium_article, .a_s._cf, .paywall, .paywall-overlay { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }
        /* Ensure body is scrollable */
        body { overflow: auto !important; }
        `;

        const style = document.createElement('style');
        style.setAttribute('data-name', 'elpais-bypass-style');
        style.textContent = css;
        document.head && document.head.appendChild(style);
    }

    // Try to remove an element or hide it forcefully
    function forceRemove(el) {
        if (!el) return false;
        try {
            // Prefer remove()
            el.remove();
            return true;
        } catch (e) {
            try {
                el.style.setProperty('display', 'none', 'important');
                el.style.setProperty('visibility', 'hidden', 'important');
                el.hidden = true;
                return true;
            } catch (err) {
                return false;
            }
        }
    }

    // Main removal routine: try many selectors and heuristics
    function removePaywall() {
        let removedAny = false;

        // Try explicit selectors first
        PAYWALL_SELECTORS.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (forceRemove(el)) removedAny = true;
            });
        });

        // Additional heuristics: look for elements that contain the exact text
        const nodes = Array.from(document.querySelectorAll('div, section, aside'));
        for (const node of nodes) {
            if (!node || !node.textContent) continue;
            const text = node.textContent.trim();
            if (text.startsWith('Suscríbete para seguir leyendo') || text.includes('Seguir leyendo')) {
                if (forceRemove(node)) removedAny = true;
            }
        }

        // Remove modal backdrops / overlays that block interaction (common pattern)
        document.querySelectorAll('[style*="position: fixed"], [style*="z-index:"]')
            .forEach(el => {
                const z = window.getComputedStyle(el).zIndex || 0;
                if (parseInt(z, 10) >= 1000 || /overlay|modal|backdrop|freemium|paywall/i.test(el.className || '')) {
                    if (forceRemove(el)) removedAny = true;
                }
            });

        // Remove any inline 'filter: blur(...)' on article nodes
        const article = document.querySelector('article, .article-body, .content');
        if (article) {
            article.style.removeProperty('filter');
            article.style.removeProperty('-webkit-filter');
            article.style.opacity = '1';
            removedAny = true;
        }

        // Ensure body overflow is restored
        document.body.style.setProperty('overflow', 'auto', 'important');

        if (removedAny) console.log('ElPais bypass: paywall elements removed/hidden');
        return removedAny;
    }

    // Improve general readability (non-invasive)
    function improveReadability() {
        // Slightly bigger text and comfortable line height
        document.documentElement.style.fontSize = '18px';
        document.documentElement.style.lineHeight = '1.6';
        // Light background for reading
        document.body.style.backgroundColor = '#f9f9f9';
        document.body.style.color = '#222';

        // Make the primary article container use natural/full width but keep padding
        const articleContent = document.querySelector('article, .article-body, main, .content');
        if (articleContent) {
            // Avoid forcing a small max-width that contracts layout on some pages
            articleContent.style.maxWidth = 'none';
            articleContent.style.width = 'auto';
            articleContent.style.margin = '0 auto';
            articleContent.style.padding = '20px 24px';
            // Remove any inline restrictions that may be applied by the site
            articleContent.style.removeProperty('max-width');
            articleContent.style.removeProperty('min-width');
        }
    }

    // Run several times and observe mutations
    injectCSS();
    removePaywall();
    improveReadability();

    // Re-run after short delays in case site injects paywall later
    setTimeout(removePaywall, 500);
    setTimeout(removePaywall, 1500);
    setTimeout(() => { removePaywall(); improveReadability(); }, 3000);

    // Observe DOM changes and try to remove paywall when nodes are added
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.addedNodes && m.addedNodes.length) {
                removePaywall();
            }
        }
    });

    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

})();

// === JSON-LD article restore: if the article body is present in structured data, insert it into the page ===
(function restoreArticleFromJSONLD() {
    'use strict';

    function findAndInsert() {
        try {
            const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
            for (const s of scripts) {
                let json = null;
                try { json = JSON.parse(s.textContent); } catch (e) { continue; }
                if (!json) continue;

                // JSON-LD may be an array or an object
                const candidates = Array.isArray(json) ? json : [json];
                // choose the largest articleBody among candidates to maximize chance of completeness
                let bestBody = null;
                for (const c of candidates) {
                    const body = c.articleBody || c['articleBody'];
                    if (body && typeof body === 'string') {
                        if (!bestBody || body.length > bestBody.length) bestBody = body;
                    }
                }
                if (bestBody && bestBody.trim().length > 50) {
                    // Find the truncated article container
                    const target = document.querySelector('div.a_c.clearfix[data-dtm-region="articulo_cuerpo"]');
                    if (!target) {
                        // target not yet in DOM; indicate not inserted so observer keeps watching
                        return false;
                    }

                    const body = bestBody;
                    const frag = document.createDocumentFragment();

                    // If body looks like HTML, insert as HTML; otherwise split by double newlines
                    const looksLikeHTML = /<\/?[a-z][\s\S]*>/i.test(body);
                    if (looksLikeHTML) {
                        const temp = document.createElement('div');
                        temp.innerHTML = body;
                        // Move child nodes into fragment
                        Array.from(temp.childNodes).forEach(n => frag.appendChild(n));
                    } else {
                        const paragraphs = body.split(/\n{2,}/).map(p => p.trim()).filter(p => p.length);
                        for (const p of paragraphs) {
                            const el = document.createElement('p');
                            el.textContent = p;
                            frag.appendChild(el);
                        }
                    }

                    // Remove paywall placeholder elements inside target (they may contain remaining content)
                    const walls = target.querySelectorAll('.a_b_wall, .a_b_wall._dn');
                    walls.forEach(w => w.remove());

                    // Replace content only if fragment has nodes
                    if (frag.childNodes && frag.childNodes.length) {
                        target.innerHTML = ''; // clear truncated content
                        target.appendChild(frag);
                        console.log('ElPais bypass: article body restored from JSON-LD (best candidate)');
                        return true;
                    }
                    // else continue searching
                }
            }
        } catch (e) {
            console.error('Error parsing JSON-LD for article body', e);
        }
        return false;
    }

    // Try immediately and also observe for the JSON-LD being added later
    if (!findAndInsert()) {
        const sobs = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.addedNodes && m.addedNodes.length) {
                    if (findAndInsert()) {
                        sobs.disconnect();
                        break;
                    }
                }
            }
        });
        sobs.observe(document.documentElement || document.body, { childList: true, subtree: true });
    }
})();

// Merge hidden paywall-wall parts into main article (in case site splits content into .a_b_wall blocks)
(function mergeHiddenWallParts() {
    'use strict';

    function cleanTrailingEllipsis(html) {
        // remove common ellipsis characters at end of string (3 dots or ellipsis char) preceded by a partial word
        return html.replace(/(\.{3}|…|\.\.\.)\s*$/u, '');
    }

    function mergeOnce() {
        const targets = Array.from(document.querySelectorAll('div.a_c.clearfix[data-dtm-region="articulo_cuerpo"]'));
        let mergedAny = false;
        for (const target of targets) {
            const wallNodes = Array.from(target.querySelectorAll('.a_b_wall'));
            if (!wallNodes.length) continue;

            const frag = document.createDocumentFragment();
            // We'll build by iterating original child nodes in order and intelligently merging walls
            const children = Array.from(target.childNodes);
            for (const node of children) {
                if (node.nodeType === Node.ELEMENT_NODE && node.classList && node.classList.contains('a_b_wall')) {
                    // Get inner HTML of wall
                    const inner = node.innerHTML.trim();
                    if (!inner) continue;
                    // If the last appended element in frag is a paragraph, append inner into it (merge)
                    const last = frag.lastChild;
                    if (last && last.nodeType === Node.ELEMENT_NODE && last.tagName.toLowerCase() === 'p') {
                        // remove trailing ellipsis from last paragraph before appending
                        last.innerHTML = cleanTrailingEllipsis(last.innerHTML) + inner;
                    } else {
                        // otherwise create a paragraph and insert inner HTML
                        const p = document.createElement('p');
                        p.innerHTML = inner;
                        frag.appendChild(p);
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'p') {
                    // clone paragraph nodes but keep HTML
                    frag.appendChild(node.cloneNode(true));
                } else if (node.nodeType === Node.TEXT_NODE) {
                    // text nodes: append to last paragraph if present, else create one
                    const text = node.textContent.trim();
                    if (!text) continue;
                    const last = frag.lastChild;
                    if (last && last.nodeType === Node.ELEMENT_NODE && last.tagName.toLowerCase() === 'p') {
                        last.appendChild(document.createTextNode(' ' + text));
                    } else {
                        const p = document.createElement('p');
                        p.textContent = text;
                        frag.appendChild(p);
                    }
                } else {
                    // other elements: clone to preserve structure
                    frag.appendChild(node.cloneNode(true));
                }
            }

            if (frag.childNodes && frag.childNodes.length) {
                target.innerHTML = '';
                target.appendChild(frag);
                mergedAny = true;
                console.log('ElPais bypass: merged hidden .a_b_wall parts into article (intelligent merge)');
            }
        }
        return mergedAny;
    }

    // Try immediately and observe DOM for changes to merge when walls are inserted
    mergeOnce();
    const mobs = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.addedNodes && m.addedNodes.length) {
                mergeOnce();
            }
        }
    });
    mobs.observe(document.documentElement || document.body, { childList: true, subtree: true });
})();