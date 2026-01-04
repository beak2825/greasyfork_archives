// ==UserScript==
// @name         TrophyManager — Star Rating (estimate)
// @namespace    https://example.com/tm-star-rating
// @version      0.9
// @description  Adds an estimated 1-5★ "star" rating for players based on visible stats (ASI, age, position fit, market value). Works as a configurable, best-effort userscript — you may need to change selectors to match your TM version.
// @author       ChatGPT
// @match        *://*.trophymanager.com/*
// @match        *://trophymanager.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558417/TrophyManager%20%E2%80%94%20Star%20Rating%20%28estimate%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558417/TrophyManager%20%E2%80%94%20Star%20Rating%20%28estimate%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*************************************************************************
     * Config
     * - Edit selectors below to match the Trophy Manager HTML in your version.
     * - The script tries to read (when available): ASI / overall, age, position-fit
     *   (SK1/SK2 or REC), market value (bank price / max price). If a field is
     *   missing it will be ignored and the rating will be based on what is found.
     *************************************************************************/

    const CONFIG = {
        // CSS selector that targets a player card / row on squad/scout pages.
        // The script will loop through all matches and try to compute stars for each.
        playerSelector: '.player, .playerRow, .playerCard',

        // Within each player element, selectors to extract numeric values.
        // Update these to match the page. Use console to inspect elements.
        asiSelector: '.asi, .overall, .player-overall, .rating', // overall rating
        ageSelector: '.age, .player-age',
        // positionFitSelector should return a percent (like 92) or a small string like "SK1: 92%"
        positionFitSelector: '.rec, .sk1, .position-fit',
        // valueSelector: bank price or market value (number with separators)
        valueSelector: '.bank-price, .value, .market-value',

        // Optional: selectors for the player name to show overlay
        nameSelector: '.player-name, .name, .playerTitle',

        // Tunable weights (how much each field affects final score)
        weightASI: 0.45,
        weightAge: 0.15,
        weightPosFit: 0.25,
        weightValue: 0.15,

        // Age ideal range for "prime" (years). Score is highest inside this window.
        idealPrimeMinAge: 24,
        idealPrimeMaxAge: 29,

        // Mapping from 0-100 combined score -> stars
        starThresholds: [20, 40, 60, 80] // <=20 -> 1★, >20 ->2★, >40->3★, >60->4★, >80->5★
    };

    /*************************************************************************
     * Helpers: small utilities to parse numbers and clean text
     *************************************************************************/
    function parseNumberFromText(str) {
        if (!str) return null;
        // Remove non digits except dot and minus
        const cleaned = (''+str).replace(/[^0-9.,\-]/g, '').trim();
        if (cleaned === '') return null;
        // Replace commas if they are thousand separators
        const normalized = cleaned.replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(/,/g, '.');
        const n = parseFloat(normalized);
        return Number.isFinite(n) ? n : null;
    }

    function parseIntSafe(str) {
        const n = parseInt((str||'').replace(/[^0-9\-]/g, ''), 10);
        return Number.isFinite(n) ? n : null;
    }

    function moneyToNumber(str) {
        if (!str) return null;
        // strip currency symbols and spaces
        const s = (''+str).replace(/[^0-9.,\-]/g, '');
        // if both . and , exist assume . is thousand sep and , is decimal (European)
        if (s.indexOf('.') !== -1 && s.indexOf(',') !== -1) {
            return parseFloat(s.replace(/\./g, '').replace(/,/g, '.'));
        }
        // if only commas exist and there are 3 digits after comma, assume thousand sep
        if (s.indexOf(',') !== -1 && /,\d{3}$/.test(s)) {
            return parseFloat(s.replace(/,/g, ''));
        }
        // otherwise remove commas and parse
        return parseFloat(s.replace(/,/g, '')) || null;
    }

    /*************************************************************************
     * Scoring functions
     *************************************************************************/

    // Normalize ASI (assumed 0-100 scale) -> 0-100
    function scoreASI(asi) {
        if (asi == null) return null;
        const n = Number(asi);
        if (!Number.isFinite(n)) return null;
        // clamp 0..100
        return Math.max(0, Math.min(100, n));
    }

    // Age score: best inside idealPrimeMinAge..idealPrimeMaxAge -> 100
    // reduces toward edges (>35 or <18 get penalized)
    function scoreAge(age) {
        if (age == null) return null;
        const a = Number(age);
        if (!Number.isFinite(a)) return null;
        const { idealPrimeMinAge: minA, idealPrimeMaxAge: maxA } = CONFIG;
        if (a >= minA && a <= maxA) return 100;
        // linear falloff outside prime window: by age difference up to 20 years
        const diff = Math.max(minA - a, a - maxA);
        const fall = Math.min(100, (diff / 15) * 100); // 15 years to hit 0
        return Math.max(0, 100 - fall);
    }

    // Position fit: if a percentage like 92 -> use directly; otherwise try parse small ints
    function scorePosFit(text) {
        if (!text) return null;
        const m = (''+text).match(/(\d{1,3})\s*%/);
        if (m) return Math.max(0, Math.min(100, Number(m[1])));
        const n = parseIntSafe(text);
        if (n != null) return Math.max(0, Math.min(100, n));
        return null;
    }

    // Value score: map market value (absolute) to 0..100 relative scale.
    // We compute valuePercent = clamp( log(value)/log(reference) ) where reference ~ 1M.
    function scoreValue(value) {
        if (value == null) return null;
        const v = Number(value);
        if (!Number.isFinite(v) || v <= 0) return 0;
        const REF = 1000000; // 1M as reference for 100
        // use log scale to compress large ranges
        const val = Math.log10(v + 1) / Math.log10(REF + 1) * 100;
        return Math.max(0, Math.min(100, val));
    }

    // Combine field scores with weights. Missing fields reduce denominator.
    function combineScores(scores) {
        let total = 0;
        let weightSum = 0;
        if (scores.asi != null) { total += scores.asi * CONFIG.weightASI; weightSum += CONFIG.weightASI; }
        if (scores.age != null) { total += scores.age * CONFIG.weightAge; weightSum += CONFIG.weightAge; }
        if (scores.posfit != null) { total += scores.posfit * CONFIG.weightPosFit; weightSum += CONFIG.weightPosFit; }
        if (scores.value != null) { total += scores.value * CONFIG.weightValue; weightSum += CONFIG.weightValue; }
        if (weightSum === 0) return null;
        return Math.round(total / weightSum);
    }

    function scoreToStars(score) {
        if (score == null) return '—';
        const t = CONFIG.starThresholds;
        if (score <= t[0]) return '★☆☆☆☆';
        if (score <= t[1]) return '★★☆☆☆';
        if (score <= t[2]) return '★★★☆☆';
        if (score <= t[3]) return '★★★★☆';
        return '★★★★★';
    }

    /*************************************************************************
     * UI helpers: create small badge and inject into player element
     *************************************************************************/
    function createBadge(starText, numericScore) {
        const badge = document.createElement('div');
        badge.className = 'tm-star-badge';
        badge.style.cssText = 'display:inline-block;padding:2px 6px;border-radius:6px;background:rgba(0,0,0,0.65);color:#fff;font-weight:700;margin-left:6px;font-size:12px;';
        badge.title = `Estimated score: ${numericScore}/100`;
        badge.textContent = `${starText}`;
        return badge;
    }

    function injectStyle() {
        if (document.getElementById('tm-star-style')) return;
        const s = document.createElement('style');
        s.id = 'tm-star-style';
        s.innerHTML = `
            .tm-star-badge { transition: transform .15s ease; }
            .tm-star-badge:hover { transform: translateY(-2px); }
        `;
        document.head.appendChild(s);
    }

    /*************************************************************************
     * Main: find players and compute/inject stars
     *************************************************************************/
    function computeForPlayer(el) {
        // find fields using selectors
        const asiEl = CONFIG.asiSelector ? el.querySelector(CONFIG.asiSelector) : null;
        const ageEl = CONFIG.ageSelector ? el.querySelector(CONFIG.ageSelector) : null;
        const posEl = CONFIG.positionFitSelector ? el.querySelector(CONFIG.positionFitSelector) : null;
        const valEl = CONFIG.valueSelector ? el.querySelector(CONFIG.valueSelector) : null;

        const asi = asiEl ? parseNumberFromText(asiEl.textContent || asiEl.innerText) : null;
        const age = ageEl ? parseIntSafe(ageEl.textContent || ageEl.innerText) : null;
        const posfit = posEl ? scorePosFit(posEl.textContent || posEl.innerText) : null;
        const value = valEl ? moneyToNumber(valEl.textContent || valEl.innerText) : null;

        const scores = { asi: scoreASI(asi), age: scoreAge(age), posfit: posfit, value: scoreValue(value) };
        const combined = combineScores(scores);
        return { combined, scores };
    }

    function insertBadgeInto(el, badge) {
        // try to append by name area, else append at end
        const nameArea = CONFIG.nameSelector ? el.querySelector(CONFIG.nameSelector) : null;
        if (nameArea) {
            // avoid duplicate
            if (!nameArea.querySelector('.tm-star-badge')) nameArea.appendChild(badge);
            return;
        }
        // fallback: append to element
        if (!el.querySelector('.tm-star-badge')) el.appendChild(badge);
    }

    function processAllPlayers() {
        injectStyle();
        const nodes = Array.from(document.querySelectorAll(CONFIG.playerSelector));
        if (!nodes || nodes.length === 0) return;
        nodes.forEach(node => {
            try {
                const existing = node.querySelector('.tm-star-badge');
                if (existing) return; // don't double-insert
                const res = computeForPlayer(node);
                const starText = scoreToStars(res.combined);
                const badge = createBadge(starText, res.combined != null ? res.combined : 'N/A');
                insertBadgeInto(node, badge);
            } catch (e) {
                // ignore per-player errors
                console.error('TM Star: error processing player', e);
            }
        });
    }

    /*************************************************************************
     * Observe DOM changes (pages often load players dynamically)
     *************************************************************************/
    const observer = new MutationObserver((mutations) => {
        // small debounce: run after a short timeout
        if (window._tmStarTimeout) clearTimeout(window._tmStarTimeout);
        window._tmStarTimeout = setTimeout(() => {
            processAllPlayers();
        }, 250);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // run once on load
    window.addEventListener('load', () => setTimeout(processAllPlayers, 700));

    // also run now in case content already present
    setTimeout(processAllPlayers, 500);

    /*************************************************************************
     * Final notes printed to console to help debugging selectors
     *************************************************************************/
    console.log('TM Star Rating userscript loaded — edit CONFIG selectors if no badges appear.');

})();
