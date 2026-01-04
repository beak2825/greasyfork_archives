// ==UserScript==
// @name         Racistator
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  DOM INJ
// @author       Golshi Best Waifu
// @match        https://x.com/*
// @match        https://www.x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551179/Racistator.user.js
// @updateURL https://update.greasyfork.org/scripts/551179/Racistator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REPLACEMENT_TEXT = 'Esto pruebaa que soy Racista?';
    const MOD_FLAG = 'data-sm-text-replaced';

    function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
    function findPrimaryTextElement(tweetNode) {
        if (!tweetNode) return null;
        const langDiv = tweetNode.querySelector('div[lang]');
        if (langDiv) return langDiv;
        const candidates = Array.from(tweetNode.querySelectorAll('span,div')).filter(el => {
            const txt = (el.textContent || '').trim();
            if (txt.length < 3) return false;
            if (el.closest('div[role="button"], a[role="button"], [data-testid="caret"]')) return false;
            if (el.matches('[data-testid="like"], [data-testid="retweet"], [data-testid="reply"]')) return false;
            return true;
        });

        return candidates.length ? candidates[0] : null;
    }
    function isPromoted(tweetNode) {
        if (!tweetNode) return false;
        const txt = (tweetNode.textContent || '');
        return /Promoted|Sponsored|Anuncio|Patrocinado/i.test(txt);
    }

    function replaceTweetTextOnly(tweetNode) {
        if (!tweetNode) return;
        if (tweetNode.getAttribute(MOD_FLAG) === 'true') return; // MODIFICA
        if (isPromoted(tweetNode)) return;

        const textEl = findPrimaryTextElement(tweetNode);
        if (!textEl) {
            // marca
            tweetNode.setAttribute(MOD_FLAG, 'true');
            return;
        }

        try {
            textEl.textContent = REPLACEMENT_TEXT;

            tweetNode.setAttribute(MOD_FLAG, 'true');
        } catch (e) {
            // fallback soft
            try {
                const txtNode = document.createTextNode(REPLACEMENT_TEXT);
                while (textEl.firstChild) textEl.removeChild(textEl.firstChild);
                textEl.appendChild(txtNode);
                tweetNode.setAttribute(MOD_FLAG, 'true');
            } catch (err) {
                tweetNode.setAttribute(MOD_FLAG, 'true');
            }
        }
    }


    function collectTweetNodes() {
        const set = new Set();

        const selectors = [
            'article[role="article"]',
            'div[data-testid="tweet"]',
            'div[data-testid="cellInnerDiv"]',
            'div[role="article"]'
        ];
        selectors.forEach(sel => {
            try {
                document.querySelectorAll(sel).forEach(n => set.add(n));
            } catch (e) { /* ignore */ }
        });

        document.querySelectorAll('a[href*="/status/"]').forEach(a => {
            const anc = a.closest('article') || a.closest('div[role="article"]') || a.closest('div');
            if (anc) set.add(anc);
        });

        return Array.from(set);
    }

    function scanAndReplaceText() {
        const nodes = collectTweetNodes();
        nodes.forEach(node => replaceTweetTextOnly(node));
    }

    function startObservers() {
        const bodyObs = new MutationObserver(muts => {
            let added = false;
            for (const m of muts) {
                if (m.addedNodes && m.addedNodes.length) { added = true; break; }
            }
            if (added) setTimeout(scanAndReplaceText, 120);
        });
        bodyObs.observe(document.body, { childList: true, subtree: true });

        const timelineSelectors = ['[aria-label^="Timeline"]', 'main', 'div[role="main"]'];
        for (const sel of timelineSelectors) {
            const el = document.querySelector(sel);
            if (el) {
                const obs = new MutationObserver(() => setTimeout(scanAndReplaceText, 150));
                obs.observe(el, { childList: true, subtree: true });
            }
        }

        window.addEventListener('popstate', () => setTimeout(scanAndReplaceText, 250));
        window.addEventListener('hashchange', () => setTimeout(scanAndReplaceText, 250));

    }

    (async function init() {
        await sleep(300);
        scanAndReplaceText();
        setTimeout(scanAndReplaceText, 800);
        startObservers();

        // FRECUENCY6k
        setInterval(scanAndReplaceText, 60000);
    })();

})();
