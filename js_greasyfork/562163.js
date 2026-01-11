// ==UserScript==
// @name         ReYohoho — фильтр по рейтингу
// @namespace    https://reyohoho.github.io/
// @version      1.8
// @description  Вставляет адаптивную панель фильтра рейтинга в интерфейс ReYohoho (интеграция в .controls/.filter-card, включая time-card). SPA-устойчивость, автоматическая адаптация к теме сайта. Работает на страницах /lists, /lists/<id> и /top. Не использует внешние библиотеки или трекеры.
// @author       ReYohoho
// @match        https://reyohoho.github.io/reyohoho
// @match        https://reyohoho.github.io/reyohoho/
// @match        https://reyohoho.github.io/reyohoho/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @homepageURL  https://github.com/studentv2/reyohoho-rating-filter
// @supportURL   https://github.com/studentv2/reyohoho-rating-filter/issues
// @downloadURL https://update.greasyfork.org/scripts/562163/ReYohoho%20%E2%80%94%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%BF%D0%BE%20%D1%80%D0%B5%D0%B9%D1%82%D0%B8%D0%BD%D0%B3%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/562163/ReYohoho%20%E2%80%94%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%BF%D0%BE%20%D1%80%D0%B5%D0%B9%D1%82%D0%B8%D0%BD%D0%B3%D1%83.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TOGGLE_ID = 'ryh-toggle-adaptive-v1_7';
    const PANEL_ID = 'ryh-panel-adaptive-v1_7';
    const STYLE_ID = 'ryh-panel-adaptive-styles-v1_7';
    const THEME_STYLE_ID = 'ryh-panel-adaptive-theme-v1_7';
    const LOCAL_KEY = 'ryh_panel_expanded_adaptive_v1_7';

    // SPA route hooks
    (function() {
        const _wr = function(type){
            const orig = history[type];
            return function(){
                const rv = orig.apply(this, arguments);
                window.dispatchEvent(new Event('locationchange'));
                return rv;
            };
        };
        history.pushState = _wr('pushState');
        history.replaceState = _wr('replaceState');
        window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
    })();

    const byQ = sel => { try { return document.querySelector(sel); } catch { return null; } };
    const byAll = sel => { try { return Array.from(document.querySelectorAll(sel)); } catch { return []; } };

    // Целевые страницы: lists (+ /lists/<id>) и top
    function isTargetPage() {
        try {
            const p = location.pathname || '';
            if (p.startsWith('/reyohoho/lists')) return true;
            if (p === '/reyohoho/top' || p.startsWith('/reyohoho/top')) return true;
            return false;
        } catch (e) { return false; }
    }

    // Рейтинг и карточки (как ранее)
    function extractNumberFromText(text) {
        if (!text) return null;
        const m = text.match(/(\d+(?:[.,]\d+)?)/);
        if (!m) return null;
        return parseFloat(m[1].replace(',', '.'));
    }
    function getCardRating(card, platform) {
        try {
            if (platform === 'our') { const el = card.querySelector('.rating-our'); if (el) return extractNumberFromText(el.textContent || el.innerText); }
            if (platform === 'kp')  { const el = card.querySelector('.rating-kp');  if (el) return extractNumberFromText(el.textContent || el.innerText); }
            if (platform === 'imdb'){ const el = card.querySelector('.rating-imdb');if (el) return extractNumberFromText(el.textContent || el.innerText); }
            const overlay = card.querySelector('.ratings-overlay'); if (overlay) return extractNumberFromText(overlay.textContent || overlay.innerText);
        } catch (e) {}
        return null;
    }
    function getAllCards() { try { return Array.from(document.querySelectorAll('a.movie-card, .movie-card')); } catch (e) { return []; } }
    function ratingMatches(cardRating, desiredRaw) {
        if (cardRating === null || cardRating === undefined || isNaN(cardRating)) return false;
        const desired = ('' + desiredRaw).trim(); if (!desired) return false;
        const desiredNum = parseFloat(desired.replace(',', '.')); const isNum = !isNaN(desiredNum);
        if (isNum) {
            if (String(desired).includes('.') || String(desired).includes(',')) return Math.abs(cardRating - desiredNum) <= 0.05;
            return Math.round(cardRating) === Math.round(desiredNum);
        }
        return String(Math.round(cardRating)) === desired;
    }

    // Фильтрация карточек
    let cardsObserver = null;
    let currentFilter = { active: false, platform: null, ratingRaw: null };

    function applyFilterToCard(card, platform, ratingRaw) {
        try {
            const r = getCardRating(card, platform);
            const match = ratingMatches(r, ratingRaw);
            card.style.display = match ? '' : 'none';
            return match;
        } catch (e) { return false; }
    }
    function applyFilterMass(platform, ratingRaw) {
        try {
            const statusEl = document.getElementById('ryh-status');
            const cards = getAllCards();
            if (!cards.length) { if (statusEl) statusEl.textContent = 'Карточки не найдены на странице.'; return; }
            stopCardsObserver();
            let shown = 0;
            for (const c of cards) if (applyFilterToCard(c, platform, ratingRaw)) shown++;
            currentFilter = { active: true, platform, ratingRaw };
            if (statusEl) statusEl.textContent = `Отсортировалось — показано ${shown} из ${cards.length}.`;
        } catch (e) { console.error(e); }
        finally { setTimeout(startCardsObserver, 150); }
    }
    function resetFilter() {
        try {
            const cards = getAllCards();
            for (const c of cards) c.style.display = '';
            currentFilter = { active: false, platform: null, ratingRaw: null };
            const statusEl = document.getElementById('ryh-status'); if (statusEl) statusEl.textContent = 'Сброшено: показаны все карточки.';
        } catch (e) {}
    }

    function startCardsObserver() {
        if (cardsObserver) return;
        const cards = getAllCards();
        const target = (cards.length && cards[0].parentElement) ? cards[0].parentElement : document.body;
        cardsObserver = new MutationObserver((mutations) => {
            if (!currentFilter.active) return;
            for (const mut of mutations) {
                if (!mut.addedNodes || mut.addedNodes.length === 0) continue;
                mut.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    const addedCards = [];
                    if (node.matches && node.matches('a.movie-card, .movie-card')) addedCards.push(node);
                    const nested = node.querySelectorAll ? node.querySelectorAll('a.movie-card, .movie-card') : [];
                    if (nested && nested.length) nested.forEach(c => addedCards.push(c));
                    if (!addedCards.length) return;
                    for (const c of addedCards) applyFilterToCard(c, currentFilter.platform, currentFilter.ratingRaw);
                });
            }
        });
        try { cardsObserver.observe(target, { childList: true, subtree: true }); } catch (e) {}
    }
    function stopCardsObserver() { if (cardsObserver) { cardsObserver.disconnect(); cardsObserver = null; } }

    // UI insertion (с учётом time-card)
    let controlsObserver = null;
    let retryTimer = null;

    function createToggleIfReady() {
        if (document.getElementById(TOGGLE_ID)) return true;

        // кандидаты: controls, filter-card.type-card, filter-card.time-card, button-group.time-buttons
        const candidates = [];
        const c1 = byQ('div.controls') || byQ('.controls'); if (c1) candidates.push(c1);
        const c2 = byQ('.filter-card.type-card'); if (c2) candidates.push(c2);
        const c3 = byQ('.filter-card.time-card'); if (c3) candidates.push(c3);
        const c4 = byQ('.button-group.time-buttons'); if (c4) candidates.push(c4.parentElement || c4);
        const c5 = byQ('.button-group.type-buttons'); if (c5) candidates.push(c5.parentElement || c5);
        const fb = byQ('.filter-btn.type-btn, .filter-btn, .filter-btn.time-btn'); if (fb) candidates.push(fb.parentElement || fb.closest('.button-group') || fb);

        for (const root of candidates) {
            if (!root) continue;
            const btnGroup = root.querySelector('.button-group.type-buttons') || root.querySelector('.button-group.time-buttons') || root.querySelector('.button-group') || root;
            if (!btnGroup) continue;
            const listButtons = btnGroup.querySelectorAll('.filter-btn.type-btn, .filter-btn, .filter-btn.time-btn');
            if (!listButtons || listButtons.length === 0) continue;
            // вставляем toggle
            try {
                const toggle = document.createElement('button');
                toggle.id = TOGGLE_ID;
                toggle.type = 'button';
                toggle.className = 'ryh-toggle-adaptive';
                toggle.innerHTML = `<span class="ryh-toggle-label">Фильтр</span><span class="ryh-toggle-arrow">▼</span>`;
                toggle.style.marginLeft = '8px';
                toggle.style.padding = '6px 10px';
                toggle.style.borderRadius = '8px';
                toggle.style.border = '0';
                toggle.style.cursor = 'pointer';
                toggle.style.fontSize = '13px';
                toggle.style.fontWeight = '600';
                toggle.addEventListener('click', () => {
                    const panel = ensurePanelExists();
                    if (!panel) return;
                    const expanded = panel.classList.toggle('expanded');
                    const arrow = toggle.querySelector('.ryh-toggle-arrow');
                    if (arrow) arrow.textContent = expanded ? '▲' : '▼';
                    try { localStorage.setItem(LOCAL_KEY, expanded ? '1' : '0'); } catch (e) {}
                });
                btnGroup.appendChild(toggle);
                return true;
            } catch (e) { /* ignore */ }
        }
        return false;
    }

    function ensurePanelExists() {
        let panel = document.getElementById(PANEL_ID); if (panel) return panel;
        // куда вставлять: предпочитаем controls, потом filter-card.time-card, потом filter-card.type-card, потом grid
        let insertAfter = byQ('div.controls') || byQ('.controls') || byQ('.filter-card.time-card') || byQ('.filter-card.type-card') || byQ('.filter-card') || byQ('div.grid');
        if (!insertAfter) insertAfter = document.body.firstChild;

        panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.className = 'ryh-panel-adaptive';
        panel.innerHTML = `
            <div class="ryh-panel-inner">
                <div class="ryh-row">
                    <label class="ryh-label">Платформа
                        <select id="ryh-platform" class="ryh-select">
                            <option value="our">ReYohoho</option>
                            <option value="kp">КП (Kinopoisk)</option>
                            <option value="imdb">IMDb</option>
                        </select>
                    </label>
                    <label class="ryh-label">Рейтинг
                        <input id="ryh-rating-input" class="ryh-input" placeholder="напр. 8 или 8.1">
                    </label>
                    <div class="ryh-controls">
                        <button id="ryh-apply" class="ryh-btn">Применить</button>
                        <button id="ryh-reset" class="ryh-btn outline">Сброс</button>
                    </div>
                </div>
                <div id="ryh-status" class="ryh-status"></div>
            </div>
        `;

        if (!document.getElementById(STYLE_ID)) {
            const s = document.createElement('style'); s.id = STYLE_ID;
            s.textContent = `
                .ryh-panel-adaptive { box-sizing:border-box; width:100%; overflow:hidden; max-height:0; transition: max-height 360ms cubic-bezier(.2,.9,.2,1), padding 200ms ease, opacity 200ms ease; padding:0 12px; opacity:0; border-bottom:1px solid rgba(255,255,255,0.03); }
                .ryh-panel-adaptive.expanded { max-height:360px; padding:12px; opacity:1; }
                .ryh-panel-inner { color:var(--ryh-text-color, #e6eef6); font-family:Inter, system-ui, sans-serif; }
                .ryh-row { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
                .ryh-label { display:flex; flex-direction:column; font-size:13px; color:var(--ryh-label-color, #cfe7ff); min-width:160px; }
                .ryh-select, .ryh-input { margin-top:6px; padding:8px; border-radius:6px; border:1px solid rgba(255,255,255,0.06); background:var(--ryh-input-bg, #141617); color:var(--ryh-text-color, #eef6ff); outline:none; font-size:13px; }
                .ryh-controls { display:flex; gap:8px; align-items:center; }
                .ryh-btn { padding:8px 10px; border-radius:8px; background: var(--ryh-accent-bg, #1f8f6b); color: var(--ryh-accent-text, #fff); border:0; cursor:pointer; font-weight:600; }
                .ryh-btn.outline { background: transparent; border:1px solid rgba(255,255,255,0.06); color:var(--ryh-text-color, #dfeaf5); font-weight:500; }
                .ryh-status { margin-top:10px; font-size:13px; color:var(--ryh-status-color, #9fb6c9); min-height:18px; }
                #${TOGGLE_ID} { background: var(--ryh-accent-btn, #0b8f6a); color: var(--ryh-accent-text, #fff); border-radius:8px; }
                @media (max-width:900px){ .ryh-row { flex-direction:column; align-items:flex-start; } .ryh-label { min-width:auto; width:100%; } }
            `;
            document.head.appendChild(s);
        }

        try {
            if (insertAfter && insertAfter.parentNode) insertAfter.parentNode.insertBefore(panel, insertAfter.nextElementSibling);
            else document.body.insertBefore(panel, document.body.firstChild);
        } catch (e) {}

        panel.querySelector('#ryh-apply').addEventListener('click', () => {
            const platform = panel.querySelector('#ryh-platform').value;
            const ratingRaw = panel.querySelector('#ryh-rating-input').value;
            if (!ratingRaw || !ratingRaw.trim()) { const statusEl = document.getElementById('ryh-status'); if (statusEl) statusEl.textContent = 'Введите рейтинг перед применением.'; return; }
            applyFilterMass(platform, ratingRaw);
        });
        panel.querySelector('#ryh-reset').addEventListener('click', () => { panel.querySelector('#ryh-rating-input').value = ''; resetFilter(); });
        panel.querySelector('#ryh-rating-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') panel.querySelector('#ryh-apply').click(); });

        try { const was = localStorage.getItem(LOCAL_KEY) === '1'; if (was) panel.classList.add('expanded'); } catch (e) {}

        updateThemeStyles();

        return panel;
    }

    function removeToggleAndPanel() {
        const t = document.getElementById(TOGGLE_ID); if (t && t.parentNode) t.parentNode.removeChild(t);
        const p = document.getElementById(PANEL_ID); if (p && p.parentNode) p.parentNode.removeChild(p);
    }

    // Theme adaptation (как раньше)
    function parseColorString(s) {
        if (!s) return null;
        s = s.trim();
        if (s[0] === '#') {
            const hex = s.slice(1);
            if (hex.length === 3) return [parseInt(hex[0]+hex[0],16), parseInt(hex[1]+hex[1],16), parseInt(hex[2]+hex[2],16)];
            if (hex.length === 6) return [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)];
        }
        const m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
        if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
        return null;
    }
    function luminance([r,g,b]) {
        const a = [r,g,b].map(v => { v = v/255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); });
        return 0.2126*a[0] + 0.7152*a[1] + 0.0722*a[2];
    }
    function contrastTextColor(rgb) { if (!rgb) return '#fff'; const L = luminance(rgb); return L > 0.5 ? '#111' : '#fff'; }
    function findAccentColorFromUI() {
        const active = byQ('.theme-selector__colors .color-option.active') || byQ('.color-option.active') || byQ('.color-option[aria-pressed="true"]');
        if (active) { const bg = active.style.backgroundColor || getComputedStyle(active).backgroundColor; return bg || null; }
        const root = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
        if (root) return root.trim() || null;
        return null;
    }
    function findBackgroundSettingFromUI() {
        const groups = document.querySelectorAll('.settings-group');
        for (const g of groups) {
            const h = g.querySelector('h2'); if (!h) continue;
            const t = (h.textContent || '').trim(); if (!t) continue;
            if (t.toLowerCase().startsWith('фон') || t === 'Фон') {
                const checked = g.querySelector('input[type="radio"]:checked'); if (checked) return checked.value || null;
            }
        }
        const body = document.body;
        if (body.classList.contains('bg-dynamic') || body.classList.contains('dynamic-bg')) return 'dynamic';
        if (body.classList.contains('bg-stars') || body.classList.contains('stars')) return 'stars';
        if (body.classList.contains('bg-lava') || body.classList.contains('lava-lamp')) return 'lava-lamp';
        return null;
    }

    let lastThemeKey = null;
    function updateThemeStyles() {
        const accentRaw = findAccentColorFromUI();
        const bgChoice = findBackgroundSettingFromUI();
        let accentCss = accentRaw;
        let rgb = parseColorString(accentRaw);
        if (!rgb && accentRaw) {
            const tmp = document.createElement('div'); tmp.style.color = accentRaw; document.body.appendChild(tmp);
            const cs = getComputedStyle(tmp).color; document.body.removeChild(tmp);
            rgb = parseColorString(cs); accentCss = cs;
        }
        if (!accentCss) accentCss = 'rgb(233,30,99)';
        if (!rgb) rgb = parseColorString(accentCss) || [233,30,99];

        const accentText = contrastTextColor(rgb);
        const accentBtn = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        let panelBg, panelBorder, inputBg, labelColor, statusColor;
        if (bgChoice === 'disabled') {
            panelBg = 'rgba(12,13,14,0.95)';
            panelBorder = '1px solid rgba(255,255,255,0.04)';
            inputBg = '#141617';
            labelColor = '#cfe7ff';
            statusColor = '#9fb6c9';
        } else {
            panelBg = 'rgba(10,11,12,0.45)';
            panelBorder = `1px solid rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.14)`;
            inputBg = 'rgba(20,22,23,0.6)';
            labelColor = '#d6eafd';
            statusColor = '#b7d3e6';
        }

        const themeKey = `${accentCss}|${bgChoice}`;
        if (lastThemeKey === themeKey) return;
        lastThemeKey = themeKey;

        let st = document.getElementById(THEME_STYLE_ID);
        if (!st) { st = document.createElement('style'); st.id = THEME_STYLE_ID; document.head.appendChild(st); }
        st.textContent = `
            :root {
                --ryh-accent-bg: ${accentBtn};
                --ryh-accent-btn: ${accentBtn};
                --ryh-accent-text: ${accentText};
                --ryh-accent-border: ${panelBorder};
                --ryh-panel-bg: ${panelBg};
                --ryh-input-bg: ${inputBg};
                --ryh-text-color: ${accentText === '#fff' ? '#e6eef6' : '#111'};
                --ryh-label-color: ${labelColor};
                --ryh-status-color: ${statusColor};
            }
            #${PANEL_ID} { background: var(--ryh-panel-bg) !important; border-bottom: var(--ryh-accent-border) !important; ${bgChoice === 'disabled' ? '' : 'backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);'} }
            #${PANEL_ID} .ryh-select, #${PANEL_ID} .ryh-input { background: var(--ryh-input-bg) !important; color: var(--ryh-text-color) !important; }
            #${PANEL_ID} .ryh-btn { background: var(--ryh-accent-bg) !important; color: var(--ryh-accent-text) !important; }
            #${TOGGLE_ID} { background: var(--ryh-accent-btn) !important; color: var(--ryh-accent-text) !important; border: none !important; }
            #${PANEL_ID} .ryh-btn.outline { border-color: rgba(255,255,255,0.06) !important; color: var(--ryh-text-color) !important; }
        `;
    }

    // Watch theme
    let themePollTimer = null;
    function startThemeWatcher() {
        if (themePollTimer) return;
        let attempts = 0;
        themePollTimer = setInterval(() => { attempts++; updateThemeStyles(); if (attempts > 40) { clearInterval(themePollTimer); themePollTimer = null; } }, 400);
        const settingsObserver = new MutationObserver(() => updateThemeStyles());
        settingsObserver.observe(document.body, { childList: true, subtree: true });
        window.__ryh_settings_observer = settingsObserver;
    }

    // Robust insertion
    function tryCreateToggleWithRetries() {
        if (document.getElementById(TOGGLE_ID)) return;
        if (retryTimer) return;
        let attempts = 0;
        retryTimer = setInterval(() => {
            attempts++;
            const ok = createToggleIfReady();
            if (ok) {
                clearInterval(retryTimer); retryTimer = null;
                ensurePanelExists();
                startCardsObserver();
                updateThemeStyles();
                startThemeWatcher();
                return;
            }
            if (attempts >= 20) { clearInterval(retryTimer); retryTimer = null; }
        }, 250);
    }

    function startControlsObserver() {
        if (controlsObserver) return;
        controlsObserver = new MutationObserver((mutations) => {
            for (const mut of mutations) {
                if (!mut.addedNodes || mut.addedNodes.length === 0) continue;
                tryCreateToggleWithRetries();
            }
        });
        controlsObserver.observe(document.body, { childList: true, subtree: true });
        setTimeout(tryCreateToggleWithRetries, 200);
    }
    function stopControlsObserver() { if (controlsObserver) { controlsObserver.disconnect(); controlsObserver = null; } }

    // Route handling
    function handleRouteChange() {
        if (isTargetPage()) {
            startControlsObserver();
            tryCreateToggleWithRetries();
            startCardsObserver();
            startThemeWatcher();
        } else {
            removeToggleAndPanel();
            stopCardsObserver();
        }
    }

    window.addEventListener('locationchange', handleRouteChange);
    window.addEventListener('DOMContentLoaded', handleRouteChange);
    window.addEventListener('load', handleRouteChange);
    setTimeout(handleRouteChange, 300);

})();
