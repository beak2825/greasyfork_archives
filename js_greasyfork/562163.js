// ==UserScript==
// @name         ReYohoho - фильтр по рейтингу
// @namespace    https://reyohoho.github.io/
// @version      1.9.11
// @description  Userscript для ReYohoho: фильтрация карточек по рейтингу (ReYohoho / КП / IMDb) с режимами exact / range / ≥ / ≤ / approx. Использует батч-обработку, MutationObserver и SPA-хуки, включает автоприменение, визуальную подсветку, статистику и динамическую адаптацию под тему интерфейса.
// @author       studentv2
// @match        https://reyohoho.github.io/reyohoho
// @match        https://reyohoho.github.io/reyohoho/
// @match        https://reyohoho.github.io/reyohoho/*
// @match        https://*.reyohoho.github.io/*
// @match        https://reyohoho.serv00.net/*
// @match        https://reyohoho.onrender.com/*
// @match        https://reyohoho.surge.sh/*
// @include      *://*reyohoho*/*
// @icon         https://img.icons8.com/?size=100&id=131&format=png&color=000000
// @grant        none
// @run-at       document-idle
// @license      MIT
// @homepageURL  https://github.com/studentv2/reyohoho-rating-filter
// @supportURL   https://github.com/studentv2/reyohoho-rating-filter/issues
// @downloadURL https://update.greasyfork.org/scripts/562163/ReYohoho%20-%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%BF%D0%BE%20%D1%80%D0%B5%D0%B9%D1%82%D0%B8%D0%BD%D0%B3%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/562163/ReYohoho%20-%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%BF%D0%BE%20%D1%80%D0%B5%D0%B9%D1%82%D0%B8%D0%BD%D0%B3%D1%83.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const VERSION = '1.9.11';
    const TOGGLE_ID = 'ryh-toggle-adaptive-v1_9';
    const PANEL_ID = 'ryh-panel-adaptive-v1_9';
    const STYLE_ID = 'ryh-panel-adaptive-styles-v1_9';
    const THEME_STYLE_ID = 'ryh-panel-adaptive-theme-v1_9';
    const LOCAL_KEY = 'ryh_panel_expanded_adaptive_v1_9';
    const LOCAL_SETTINGS_KEY = 'ryh_panel_settings_adaptive_v1_9';
    const LOCAL_GLOW_KEY = 'ryh_glow_slider';

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

    function createEl(tag, props = {}, children = []) {
        const el = document.createElement(tag);
        for (const k in props) {
            if (k === 'text') el.textContent = props[k];
            else if (k === 'html') el.innerHTML = props[k];
            else if (k === 'on') {
                for (const ev in props.on) el.addEventListener(ev, props.on[ev]);
            } else el.setAttribute(k, props[k]);
        }
        (children || []).forEach(c => el.appendChild(c));
        return el;
    }

    // Target page check (exclude movie/player pages)
    function isTargetPage() {
        try {
            const raw = location.pathname || '';
            const p = raw.replace(/\/+$/, '').toLowerCase();

            if (/^\/(?:reyohoho\/)?movie(?:\/|$)/i.test(p)) return false;
            if (/^\/(?:reyohoho\/)?film(?:\/|$)/i.test(p)) return false;
            if (p.indexOf('/player') !== -1 || p.indexOf('/watch') !== -1) return false;

            if (p.endsWith('/top.html')) return true;
            const re = /^\/(?:reyohoho\/)?(lists(?:\/.*)?|top(?:\/.*)?|lists|top)$/i;
            if (re.test(p)) return true;
            if (p.indexOf('/lists') !== -1 || p.indexOf('/top') !== -1) return true;

            const menu = document.querySelector('.menu');
            if (menu) {
                if (menu.querySelector('button[data-api-url], .button-group, .type-buttons')) return true;
            }
            const controls = document.querySelector('.controls');
            if (controls) {
                if (controls.querySelector('.main-controls') && (p.indexOf('/movie') !== -1 || p.indexOf('/film') !== -1)) return false;
                if (controls.querySelector('.button-group.type-buttons, .filter-btn, .button-group')) return true;
            }
            if (document.querySelector('#movieGrid') || document.querySelector('.grid')) return true;

            return false;
        } catch (e) { return false; }
    }

    // CARD HELPERS
    function getAllCards() {
        try {
            return Array.from(document.querySelectorAll('a.movie-card, .movie-card, .movie')) || [];
        } catch (e) { return []; }
    }
    function extractNumberFromText(text) {
        if (!text) return null;
        const m = text.match(/(\d+(?:[.,]\d+)?)/);
        if (!m) return null;
        return parseFloat(m[1].replace(',', '.'));
    }
    function getCardRating(card, platform) {
        try {
            const cacheKey = `data-ryh-rating-${platform || 'any'}`;
            const cached = card.getAttribute(cacheKey);
            if (cached !== null && cached !== undefined && cached !== '') {
                const v = parseFloat(cached);
                return isNaN(v) ? null : v;
            }

            let r = null;

            if (platform === 'our') {
                const el = card.querySelector('.rating-our');
                if (el) r = extractNumberFromText(el.textContent || el.innerText);
            }
            if (platform === 'kp') {
                const el = card.querySelector('.rating-kp');
                if (el) r = extractNumberFromText(el.textContent || el.innerText);
            }
            if (platform === 'imdb') {
                const el = card.querySelector('.rating-imdb');
                if (el) r = extractNumberFromText(el.textContent || el.innerText);
            }

            if (r === null) {
                const ps = card.querySelectorAll('p, span, div');
                for (const el of ps) {
                    const txt = (el.textContent || '').trim();
                    if (!txt) continue;
                    if ((platform === 'kp' || !platform) && /Кинопоиск/i.test(txt)) {
                        const found = txt.match(/Кинопоиск[:\s]*([0-9]+[.,]?[0-9]*)/i);
                        if (found) { r = parseFloat(found[1].replace(',','.')); break; }
                    }
                    if ((platform === 'imdb' || !platform) && /IMDb/i.test(txt)) {
                        const found = txt.match(/IMDb[:\s]*([0-9]+[.,]?[0-9]*)/i);
                        if (found) { r = parseFloat(found[1].replace(',','.')); break; }
                    }
                    if (!platform) {
                        const found = txt.match(/Рейтинг[:\s]*([0-9]+[.,]?[0-9]*)/i) || txt.match(/Rating[:\s]*([0-9]+[.,]?[0-9]*)/i);
                        if (found) { r = parseFloat(found[1].replace(',','.')); break; }
                    }
                }
            }

            if (r === null) {
                const overlay = card.querySelector('.ratings-overlay, .rating');
                if (overlay) r = extractNumberFromText(overlay.textContent || overlay.innerText);
            }

            if (r !== null && !isNaN(r)) {
                try { card.setAttribute(cacheKey, String(r)); } catch (e) {}
                try { card.setAttribute('data-ryh-rating-any', String(r)); } catch (e) {}
            } else {
                try { card.setAttribute(cacheKey, ''); } catch (e) {}
            }
            return r;
        } catch (e) { return null; }
    }

    function ratingMatchesAdvanced(cardRating, mode, ratingRaw) {
        if (cardRating === null || cardRating === undefined || isNaN(cardRating)) return false;
        const raw = ('' + (ratingRaw || '')).trim();
        if (!raw) return false;
        const normalize = s => s.replace(',', '.').trim();

        switch (mode) {
            case 'exact': {
                const num = parseFloat(normalize(raw));
                if (isNaN(num)) return false;
                if (String(raw).includes('.') || String(raw).includes(',')) return Math.abs(cardRating - num) <= 0.05;
                return Math.round(cardRating) === Math.round(num);
            }
            case 'gte': {
                const num = parseFloat(normalize(raw));
                if (isNaN(num)) return false;
                return cardRating >= num - 1e-9;
            }
            case 'lte': {
                const num = parseFloat(normalize(raw));
                if (isNaN(num)) return false;
                return cardRating <= num + 1e-9;
            }
            case 'approx': {
                const num = parseFloat(normalize(raw));
                if (isNaN(num)) return false;
                return Math.abs(cardRating - num) <= 0.15;
            }
            case 'range': {
                const mm = raw.split(/[-–—,]/).map(s => parseFloat(normalize(s)));
                if (mm.length < 2 || isNaN(mm[0]) || isNaN(mm[1])) return false;
                const min = Math.min(mm[0], mm[1]), max = Math.max(mm[0], mm[1]);
                return cardRating >= min - 1e-9 && cardRating <= max + 1e-9;
            }
            default:
                return false;
        }
    }

    // state
    let cardsObserver = null;
    let currentFilter = { active: false, platform: null, ratingRaw: null, mode: 'exact', effect: 'hide' };
    let cardsContainer = null;
    let controlsObserver = null;
    let retryTimer = null;
    let statsUpdateTimer = null;
    let themeObserver = null;
    let lastThemeKey = null;

    // styles — добавлены правила z-index/position чтобы панель всегда над карточками
    if (!document.getElementById(STYLE_ID)) {
        const s = document.createElement('style'); s.id = STYLE_ID;
        s.textContent = `
            /* layout & base */
            /* ВАЖНО: overflow:visible чтобы выпадающие списки могли выходить за границы панели и не обрезались */
            .ryh-panel-adaptive { box-sizing:border-box; width:100%; overflow:visible; max-height:0; transition: max-height 420ms cubic-bezier(.2,.9,.2,1), padding 220ms ease, opacity 220ms ease; padding:0 12px; opacity:0; border-bottom:1px solid rgba(255,255,255,0.03); transform-origin: top center; position: relative; z-index: 2147483000; pointer-events: auto; }
            .ryh-panel-adaptive.expanded { max-height:600px; padding:18px; opacity:1; }

            /* panel inner must be above cards */
            .ryh-panel-inner { color:var(--ryh-text-color, #e6eef6); font-family:Inter, system-ui, sans-serif; opacity:0; transform: translateY(8px) scale(0.995); transition: opacity 420ms ease, transform 420ms cubic-bezier(.2,.9,.2,1); position: relative; z-index: 2147483001; }
            .ryh-panel-adaptive.expanded .ryh-panel-inner, .ryh-panel-adaptive.ryh-mounted .ryh-panel-inner { opacity:1; transform: translateY(0) scale(1); }

            .ryh-row { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
            .ryh-label { display:flex; flex-direction:column; font-size:13px; color:var(--ryh-label-color, #cfe7ff); min-width:160px; transition: color 260ms ease; }
            .ryh-select, .ryh-input { margin-top:6px; padding:8px; border-radius:8px; border:1px solid rgba(255,255,255,0.06); background:var(--ryh-input-bg, #141617); color:var(--ryh-text-color, #eef6ff); outline:none; font-size:13px; transition: box-shadow 200ms ease, transform 200ms ease; }

            .ryh-select:focus, .ryh-input:focus { box-shadow: 0 8px 20px rgba(0,0,0,0.28), 0 0 18px var(--ryh-accent-glow, rgba(30,150,100,0.18)); transform: translateY(-2px); }

            .ryh-controls { display:flex; gap:10px; align-items:center; }

            /* buttons */
            .ryh-btn { position:relative; overflow: hidden; padding:9px 12px; border-radius:10px; background: var(--ryh-accent-bg, #1f8f6b); color: var(--ryh-accent-text, #fff); border:0; cursor:pointer; font-weight:700; letter-spacing:0.2px; transition: transform 180ms cubic-bezier(.2,.9,.2,1), box-shadow 220ms ease, filter 220ms ease; z-index: 2147483002; }
            .ryh-btn.outline { background: transparent; border:1px solid rgba(255,255,255,0.06); color:var(--ryh-text-color, #dfeaf5); font-weight:600; }
            .ryh-btn:active { transform: translateY(1px) scale(0.995); }
            .ryh-btn:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(0,0,0,0.36), 0 0 32px var(--ryh-accent-glow, rgba(30,150,100,0.28)); }

            /* ripple */
            .ryh-ripple { position:absolute; border-radius:50%; transform: scale(0); animation: ryh-ripple 600ms cubic-bezier(.2,.9,.2,1); pointer-events:none; opacity:0.85; }
            @keyframes ryh-ripple { to { transform: scale(3.6); opacity: 0; } }

            /* toggle */
            #${TOGGLE_ID} { background: linear-gradient(135deg, rgba(255,255,255,0.03), var(--ryh-accent-btn, #0b8f6a)); color: var(--ryh-accent-text, #fff); border-radius:10px; padding:8px 12px; transition: transform 220ms ease, box-shadow 220ms ease, background 420ms ease; box-shadow: 0 6px 18px rgba(0,0,0,0.14); z-index:2147483003; }
            #${TOGGLE_ID}.ryh-pulse { animation: ryh-toggle-pulse 2400ms infinite ease-in-out; }
            @keyframes ryh-toggle-pulse { 0% { box-shadow: 0 6px 18px rgba(0,0,0,0.12); } 50% { box-shadow: 0 18px 48px var(--ryh-accent-glow, rgba(30,150,100,0.16)); } 100% { box-shadow: 0 6px 18px rgba(0,0,0,0.12); } }

            /* hidden / softened (not abrupt removal) */
            .ryh-hidden { opacity: 0.16 !important; pointer-events: none !important; transform: scale(0.985); transition: opacity 320ms ease, transform 320ms ease, filter 320ms ease; filter: saturate(0.6) contrast(0.85); z-index: 1; }
            .ryh-highlight { position: relative; z-index: 1000 !important; transition: transform 420ms cubic-bezier(.2,.9,.2,1), box-shadow 420ms ease, background-color 420ms ease, border-color 420ms ease; transform: translateY(-8px); border-radius: 12px; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); outline: 3px solid var(--ryh-accent-outline, rgba(30,150,100,0.95)); box-shadow: 0 20px 50px rgba(0,0,0,0.40), 0 0 40px var(--ryh-accent-glow, rgba(30,150,100,0.55)); animation: ryh-highlight-pulse 2200ms infinite; }
            @keyframes ryh-highlight-pulse { 0% { transform: translateY(-6px) scale(1); box-shadow: 0 16px 40px rgba(0,0,0,0.36), 0 0 20px var(--ryh-accent-glow, rgba(30,150,100,0.44)); } 50% { transform: translateY(-10px) scale(1.01); box-shadow: 0 28px 60px rgba(0,0,0,0.44), 0 0 48px var(--ryh-accent-glow, rgba(30,150,100,0.56)); } 100% { transform: translateY(-6px) scale(1); box-shadow: 0 16px 40px rgba(0,0,0,0.36), 0 0 20px var(--ryh-accent-glow, rgba(30,150,100,0.44)); } }

            /* stats blocks entry */
            .ryh-stats .ryh-stats-block { transform: translateY(8px) scale(0.995); opacity:0; transition: transform 420ms cubic-bezier(.2,.9,.2,1), opacity 420ms ease; position: relative; z-index: 2147483040; }
            .ryh-panel-adaptive.expanded .ryh-stats .ryh-stats-block { transform: translateY(0) scale(1); opacity:1; }

            /* small shine for buttons */
            .ryh-btn::before { content: ''; position: absolute; top: -40%; left: -30%; width: 60%; height: 180%; background: linear-gradient(120deg, rgba(255,255,255,0.06), rgba(255,255,255,0.0) 50%, rgba(255,255,255,0.06)); transform: translateX(-120%) rotate(-12deg); transition: transform 900ms cubic-bezier(.2,.9,.2,1), opacity 900ms ease; opacity: 0; pointer-events: none; }
            .ryh-btn:hover::before { transform: translateX(160%) rotate(-12deg); opacity: 1; }

            /* hover lift */
            .ryh-btn:hover, .ryh-btn:focus { transform: translateY(-6px); }

            /* dark scrollbar + checkbox base */
            #${PANEL_ID} .ryh-dist { scrollbar-width: thin; scrollbar-color: var(--ryh-scroll-thumb, rgba(255,255,255,0.06)) var(--ryh-scroll-track, rgba(0,0,0,0.45)); z-index:2147483041; }
            #${PANEL_ID} .ryh-dist::-webkit-scrollbar { width:10px; height:10px; }
            #${PANEL_ID} .ryh-dist::-webkit-scrollbar-track { background: var(--ryh-scroll-track, rgba(0,0,0,0.45)); border-radius:10px; }
            #${PANEL_ID} .ryh-dist::-webkit-scrollbar-thumb { background: var(--ryh-scroll-thumb, rgba(255,255,255,0.06)); border-radius:10px; border: 2px solid transparent; background-clip: padding-box; }
            #${PANEL_ID} .ryh-dist:hover::-webkit-scrollbar-thumb { background: var(--ryh-scroll-thumb-hover, rgba(255,255,255,0.12)); }

            #${PANEL_ID} input[type="checkbox"] { z-index:2147483050; }
            #${PANEL_ID} input[type="checkbox"]::after { z-index:2147483051; }
            #${PANEL_ID} input[type="checkbox"]:checked { box-shadow: 0 6px 18px var(--ryh-accent-glow); background: var(--ryh-accent-bg); border-color: var(--ryh-accent-bg); }

            /* custom select styles (list must appear above everything) */
            .ryh-custom-select { position: relative; user-select: none; margin-top:6px; z-index:2147483055; }
            .ryh-custom-select .ryh-cs-button { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px; border-radius:8px; background: var(--ryh-input-bg); color: var(--ryh-text-color); border:1px solid rgba(255,255,255,0.06); cursor:pointer; transition: box-shadow 220ms ease, transform 160ms ease; }
            .ryh-custom-select .ryh-cs-list { position:absolute; left:0; right:0; margin-top:8px; max-height:0; overflow:hidden; border-radius:10px; background: rgba(6,7,8,0.98); border:1px solid rgba(255,255,255,0.04); transform-origin: top center; transition: max-height 360ms cubic-bezier(.2,.9,.2,1), opacity 260ms ease, transform 260ms cubic-bezier(.2,.9,.2,1); opacity:0; transform: translateY(-6px) scale(0.995); z-index:2147483100; }
            .ryh-custom-select.open .ryh-cs-list { max-height:320px; opacity:1; transform: translateY(0) scale(1); }
            .ryh-cs-item { padding:8px 10px; cursor:pointer; font-size:13px; color:var(--ryh-text-color); transition: background 160ms ease; }
            .ryh-cs-item:hover { background: rgba(255,255,255,0.02); }

            @media (max-width:900px){ .ryh-row { flex-direction:column; align-items:flex-start; } .ryh-label { min-width:auto; width:100%; } }
        `;
        document.head.appendChild(s);
    }

    // Toggle insertion
    function createToggleIfReady() {
        if (!isTargetPage()) return false;
        if (document.getElementById(TOGGLE_ID)) return true;

        const candidates = [];
        const c_controls = byQ('div.controls') || byQ('.controls'); if (c_controls) candidates.push(c_controls);
        const c_filter_type = byQ('.filter-card.type-card'); if (c_filter_type) candidates.push(c_filter_type);
        const c_filter_time = byQ('.filter-card.time-card'); if (c_filter_time) candidates.push(c_filter_time);
        const c_button_group = byQ('.button-group.time-buttons'); if (c_button_group) candidates.push(c_button_group.parentElement || c_button_group);
        const c_type_buttons = byQ('.button-group.type-buttons'); if (c_type_buttons) candidates.push(c_type_buttons.parentElement || c_type_buttons);
        const c_menu = byQ('.menu'); if (c_menu) candidates.push(c_menu);
        const c_movieGrid = byQ('#movieGrid'); if (c_movieGrid) candidates.push(c_movieGrid.parentElement || c_movieGrid);

        const fb = byQ('.filter-btn.type-btn, .filter-btn, .filter-btn.time-btn'); if (fb) candidates.push(fb.parentElement || fb.closest('.button-group') || fb);

        for (const root of candidates) {
            if (!root) continue;
            if (root.closest && root.closest('.info-content, .player-container')) continue;
            if (root.classList && root.classList.contains('main-controls')) continue;

            const btnGroup = root.querySelector('.button-group.type-buttons') || root.querySelector('.button-group.time-buttons') || root.querySelector('.button-group') || root;
            if (!btnGroup) continue;

            const hasFilterLike = btnGroup.querySelector('.filter-btn.type-btn, .filter-btn, .type-buttons, button[data-api-url]');
            if (!hasFilterLike) continue;

            const path = (location.pathname || '').toLowerCase();
            if (path.indexOf('/movie/') !== -1 || path.indexOf('/film/') !== -1) continue;

            try {
                const toggle = createEl('button', { id: TOGGLE_ID, type: 'button', class: 'ryh-toggle-adaptive', 'aria-expanded': 'false' }, [
                    createEl('span', { class: 'ryh-toggle-label', text: 'Фильтр' }),
                    createEl('span', { class: 'ryh-toggle-arrow', text: '▼', style: 'margin-left:6px' })
                ]);
                toggle.style.marginLeft = '8px';
                toggle.style.padding = '6px 10px';
                toggle.style.borderRadius = '8px';
                toggle.style.border = '0';
                toggle.style.cursor = 'pointer';
                toggle.style.fontSize = '13px';
                toggle.style.fontWeight = '600';

                toggle.classList.add('ryh-pulse');

                toggle.addEventListener('click', () => {
                    const panel = ensurePanelExists();
                    if (!panel) return;
                    const expanded = panel.classList.toggle('expanded');
                    toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                    const arrow = toggle.querySelector('.ryh-toggle-arrow');
                    if (arrow) arrow.textContent = expanded ? '▲' : '▼';
                    try { localStorage.setItem(LOCAL_KEY, expanded ? '1' : '0'); } catch (e) {}
                    if (expanded) toggle.classList.remove('ryh-pulse'); else toggle.classList.add('ryh-pulse');
                    setTimeout(() => { try { toggle.blur(); } catch (e) {} }, 30);
                });

                btnGroup.appendChild(toggle);
                return true;
            } catch (e) {}
        }
        return false;
    }

    // Create panel and custom selects
    function ensurePanelExists() {
        let panel = document.getElementById(PANEL_ID); if (panel) return panel;
        let insertAfter = byQ('div.controls') || byQ('.controls') || byQ('.menu') || byQ('.filter-card.time-card') || byQ('.filter-card.type-card') || byQ('.filter-card') || byQ('#movieGrid') || byQ('div.grid');
        if (!insertAfter) insertAfter = document.body.firstChild;

        panel = createEl('div', { id: PANEL_ID, class: 'ryh-panel-adaptive' });
        const inner = createEl('div', { class: 'ryh-panel-inner' });
        const row = createEl('div', { class: 'ryh-row' });

        const labelPlatform = createEl('label', { class: 'ryh-label' }, [
            createEl('span', { text: 'Платформа' }),
            createEl('select', { id: 'ryh-platform', class: 'ryh-select' })
        ]);
        const selPlatform = labelPlatform.querySelector('select');
        ['our|ReYohoho', 'kp|КП (Kinopoisk)', 'imdb|IMDb'].forEach(opt => {
            const [val, txt] = opt.split('|');
            selPlatform.appendChild(createEl('option', { value: val, text: txt }));
        });

        const labelMode = createEl('label', { class: 'ryh-label' }, [
            createEl('span', { text: 'Режим сравнения' }),
            createEl('select', { id: 'ryh-mode', class: 'ryh-select' })
        ]);
        const selMode = labelMode.querySelector('select');
        [
            ['exact', 'Точно (8 или 8.0)'],
            ['gte', '>= (больше или равно)'],
            ['lte', '<= (меньше или равно)'],
            ['range', 'Диапазон (пример: 7-8)'],
            ['approx', 'Приблизительно (±0.15)']
        ].forEach(([v,t]) => selMode.appendChild(createEl('option', { value: v, text: t })));

        const labelRating = createEl('label', { class: 'ryh-label' }, [
            createEl('span', { text: 'Рейтинг / значение' }),
            createEl('input', { id: 'ryh-rating-input', class: 'ryh-input', placeholder: 'напр. 8 или 7-8' })
        ]);
        const inputRating = labelRating.querySelector('input');

        const controlsDiv = createEl('div', { class: 'ryh-controls' });
        const btnApply = createEl('button', { id: 'ryh-apply', class: 'ryh-btn', type: 'button', text: 'Применить' });
        const btnReset = createEl('button', { id: 'ryh-reset', class: 'ryh-btn outline', type: 'button', text: 'Сброс' });

        const autoWrap = createEl('label', { class: 'ryh-label', style: 'min-width:auto; align-items:center; justify-content:flex-start; display:flex; gap:8px; align-items:center;' }, [
            createEl('span', { text: 'Авто' }),
            createEl('div', {}, [
                createEl('input', { id: 'ryh-auto', type: 'checkbox' }),
                createEl('span', { text: ' Применять при вводе/изменении' })
            ])
        ]);

        const effectWrap = createEl('label', { class: 'ryh-label', style: 'min-width:auto; align-items:center; justify-content:flex-start;' }, [
            createEl('span', { text: 'Эффект' }),
            createEl('select', { id: 'ryh-effect', class: 'ryh-select' })
        ]);
        const selEffect = effectWrap.querySelector('select');
        [['hide','Скрыть остальные'], ['highlight','Подсветить совпадения']].forEach(([v,t]) => selEffect.appendChild(createEl('option', { value: v, text: t })));

        controlsDiv.appendChild(btnApply);
        controlsDiv.appendChild(btnReset);
        row.appendChild(labelPlatform);
        row.appendChild(labelMode);
        row.appendChild(labelRating);
        row.appendChild(controlsDiv);
        row.appendChild(effectWrap);
        row.appendChild(autoWrap);

        inner.appendChild(row);

        // stats block
        const statsWrap = createEl('div', { class: 'ryh-stats', id: 'ryh-stats-panel' }, []);
        const statsLeft = createEl('div', { class: 'ryh-stats-block' });
        const statsRight = createEl('div', { class: 'ryh-stats-block' });
        const statsControls = createEl('div', { class: 'ryh-stats-block' });
        statsLeft.innerHTML = `<b id="ryh-stats-summary">Статистика</b><div id="ryh-stats-summary-txt">—</div>`;
        statsRight.innerHTML = `<b>Распределение (по округл.)</b><div id="ryh-stats-dist" class="ryh-dist">—</div>`;
        statsControls.innerHTML = `<b>Действия</b><div style="margin-top:6px;"><button id="ryh-stats-refresh" class="ryh-btn" type="button">Обновить статистику</button></div>`;
        statsWrap.appendChild(statsLeft);
        statsWrap.appendChild(statsRight);
        statsWrap.appendChild(statsControls);

        inner.appendChild(statsWrap);

        inner.appendChild(createEl('div', { id: 'ryh-status', class: 'ryh-status' }));
        panel.appendChild(inner);

        try {
            if (insertAfter && insertAfter.parentNode) insertAfter.parentNode.insertBefore(panel, insertAfter.nextElementSibling);
            else document.body.insertBefore(panel, document.body.firstChild);
        } catch (e) {}

        // mounted animation
        setTimeout(() => {
            panel.classList.add('ryh-mounted');
            setTimeout(() => panel.classList.remove('ryh-mounted'), 1200);
        }, 80);

        // restore settings
        try {
            const saved = JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY) || '{}');
            if (saved.mode) selMode.value = saved.mode;
            if (saved.effect) selEffect.value = saved.effect;
            if (saved.auto) document.getElementById('ryh-auto').checked = !!saved.auto;
        } catch (e) {}

        // replace select controls with custom animated selects (platform, mode, effect)
        const toReplace = [
            { sel: selPlatform, id: 'ryh-platform' },
            { sel: selMode, id: 'ryh-mode' },
            { sel: selEffect, id: 'ryh-effect' }
        ];
        toReplace.forEach(item => replaceWithCustomSelect(item.sel, item.id));

        // Add button behaviors (ripple + blur to avoid sticking)
        addGlobalRipple(panel);

        btnApply.addEventListener('click', (ev) => {
            createRipple(ev, btnApply);
            setTimeout(() => { try { btnApply.blur(); } catch (e) {} }, 20);
            const platform = getCustomSelectValue('ryh-platform') || 'our';
            const mode = getCustomSelectValue('ryh-mode') || 'exact';
            const ratingRaw = inputRating.value;
            const effect = getCustomSelectValue('ryh-effect') || 'hide';
            if (!ratingRaw || !ratingRaw.trim()) { const statusEl = document.getElementById('ryh-status'); if (statusEl) statusEl.textContent = 'Введите рейтинг перед применением.'; return; }
            saveSettings({ mode, effect, auto: document.getElementById('ryh-auto').checked });
            applyFilterMass(platform, ratingRaw, mode, effect).then(() => updateStatsUI());
        });

        btnReset.addEventListener('click', (ev) => {
            createRipple(ev, btnReset);
            setTimeout(() => { try { btnReset.blur(); } catch (e) {} }, 20);
            inputRating.value = '';
            resetFilter();
            updateStatsUI();
        });

        inputRating.addEventListener('keydown', (e) => { if (e.key === 'Enter') btnApply.click(); });

        let autoDeb = null;
        const scheduleAutoApply = () => {
            if (autoDeb) clearTimeout(autoDeb);
            autoDeb = setTimeout(() => {
                const auto = document.getElementById('ryh-auto').checked;
                const ratingRaw = inputRating.value;
                if (!auto) return;
                if (!ratingRaw || !ratingRaw.trim()) return;
                btnApply.click();
            }, 450);
        };

        inputRating.addEventListener('input', () => {
            const auto = document.getElementById('ryh-auto').checked;
            saveSettings({ mode: getCustomSelectValue('ryh-mode'), effect: getCustomSelectValue('ryh-effect'), auto });
            if (!auto) return;
            scheduleAutoApply();
        });

        document.addEventListener('ryh:customselectchange', (ev) => {
            saveSettings({ mode: getCustomSelectValue('ryh-mode'), effect: getCustomSelectValue('ryh-effect'), auto: document.getElementById('ryh-auto').checked });
            scheduleAutoApply();
            if (ev.detail && ev.detail.id === 'ryh-platform') updateStatsUI();
        });

        document.getElementById('ryh-auto').addEventListener('change', () => {
            saveSettings({ mode: getCustomSelectValue('ryh-mode'), effect: getCustomSelectValue('ryh-effect'), auto: document.getElementById('ryh-auto').checked });
        });

        const statsRefreshBtn = panel.querySelector('#ryh-stats-refresh');
        if (statsRefreshBtn) statsRefreshBtn.addEventListener('click', (ev) => { createRipple(ev, statsRefreshBtn); setTimeout(() => { try { statsRefreshBtn.blur(); } catch (e) {} }, 20); updateStatsUI(true); });

        try { const was = localStorage.getItem(LOCAL_KEY) === '1'; if (was) panel.classList.add('expanded'); } catch (e) {}

        updateThemeStyles();
        setTimeout(() => updateStatsUI(), 120);

        // Global: clicking outside panel should close open custom selects and remove button focus
        document.addEventListener('pointerdown', (ev) => {
            const p = document.getElementById(PANEL_ID);
            if (!p) return;
            if (!p.contains(ev.target)) {
                closeAllCustomSelects();
                const f = document.activeElement;
                if (f && f.classList && f.classList.contains('ryh-btn')) try { f.blur(); } catch (e) {}
            }
        }, { capture: true });

        return panel;
    }

    function saveSettings(obj = {}) {
        try {
            const prev = JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY) || '{}');
            const merged = Object.assign({}, prev, obj);
            localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(merged));
        } catch (e) {}
    }

    function removeToggleAndPanel() {
        const t = document.getElementById(TOGGLE_ID); if (t && t.parentNode) t.parentNode.removeChild(t);
        const p = document.getElementById(PANEL_ID); if (p && p.parentNode) p.parentNode.removeChild(p);
    }

    // apply / reset
    function applyFilterToCardByClass(card, platform, ratingRaw, mode, effect) {
        try {
            const r = getCardRating(card, platform);
            const match = ratingMatchesAdvanced(r, mode, ratingRaw);
            if (effect === 'hide') {
                if (match) {
                    card.classList.remove('ryh-hidden');
                    card.classList.remove('ryh-highlight');
                } else {
                    card.classList.add('ryh-hidden');
                    card.classList.remove('ryh-highlight');
                }
            } else {
                if (match) {
                    card.classList.remove('ryh-hidden');
                    card.classList.add('ryh-highlight');
                } else {
                    card.classList.remove('ryh-highlight');
                    card.classList.remove('ryh-hidden');
                }
            }
            return match;
        } catch (e) { return false; }
    }

    function processCardsInBatches(cards, platform, ratingRaw, mode, effect, onProgress) {
        return new Promise((resolve) => {
            const batchSize = 50;
            let i = 0;
            let shown = 0;
            const runChunk = (deadline) => {
                const end = Math.min(i + batchSize, cards.length);
                for (; i < end; i++) {
                    if (applyFilterToCardByClass(cards[i], platform, ratingRaw, mode, effect)) shown++;
                }
                if (onProgress) onProgress(i, cards.length, shown);
                if (i < cards.length) {
                    if (window.requestIdleCallback && deadline && !deadline.didTimeout) {
                        requestIdleCallback(runChunk, { timeout: 250 });
                    } else {
                        requestAnimationFrame(() => runChunk());
                    }
                } else {
                    resolve({ shown, total: cards.length });
                }
            };
            if (window.requestIdleCallback) requestIdleCallback(runChunk, { timeout: 250 });
            else requestAnimationFrame(() => runChunk());
        });
    }

    async function applyFilterMass(platform, ratingRaw, mode = 'exact', effect = 'hide') {
        try {
            const statusEl = document.getElementById('ryh-status');
            const cards = getAllCards();
            if (!cards.length) { if (statusEl) statusEl.textContent = 'Карточки не найдены на странице.'; return; }
            stopCardsObserver();
            if (statusEl) statusEl.textContent = 'Фильтрация...';
            currentFilter = { active: true, platform, ratingRaw, mode, effect };
            const res = await processCardsInBatches(cards, platform, ratingRaw, mode, effect, (done, total, shown) => {
                if (statusEl) statusEl.textContent = `Фильтрация: ${done}/${total} — совпадений ${shown}`;
            });
            if (statusEl) statusEl.textContent = `Отсортировалось — показано ${res.shown} из ${res.total}.`;
        } catch (e) { console.error(e); }
        finally { setTimeout(startCardsObserver, 150); }
    }

    function resetFilter() {
        try {
            const cards = getAllCards();
            for (const c of cards) {
                c.classList.remove('ryh-hidden');
                c.classList.remove('ryh-highlight');
            }
            currentFilter = { active: false, platform: null, ratingRaw: null, mode: 'exact', effect: 'hide' };
            const statusEl = document.getElementById('ryh-status'); if (statusEl) statusEl.textContent = 'Сброшено: показаны все карточки.';
        } catch (e) {}
    }

    function startCardsObserver() {
        if (cardsObserver) return;
        const cards = getAllCards();
        if (cards.length && cards[0].parentElement) cardsContainer = cards[0].parentElement;
        else cardsContainer = document.body;
        try {
            cardsObserver = new MutationObserver((mutations) => {
                if (currentFilter.active) {
                    const added = [];
                    for (const mut of mutations) {
                        if (!mut.addedNodes || mut.addedNodes.length === 0) continue;
                        mut.addedNodes.forEach(node => {
                            if (node.nodeType !== 1) return;
                            if (node.matches && node.matches('a.movie-card, .movie-card, .movie')) added.push(node);
                            const nested = node.querySelectorAll ? node.querySelectorAll('a.movie-card, .movie-card, .movie') : [];
                            if (nested && nested.length) nested.forEach(c => added.push(c));
                        });
                    }
                    if (added.length) {
                        const proc = () => {
                            for (const c of added) applyFilterToCardByClass(c, currentFilter.platform, currentFilter.ratingRaw, currentFilter.mode, currentFilter.effect);
                        };
                        if (window.requestIdleCallback) requestIdleCallback(proc, { timeout: 200 });
                        else setTimeout(proc, 50);
                    }
                }
                if (statsUpdateTimer) clearTimeout(statsUpdateTimer);
                statsUpdateTimer = setTimeout(() => updateStatsUI(), 400);
            });
            cardsObserver.observe(cardsContainer, { childList: true });
        } catch (e) {
            try {
                cardsObserver.observe(document.body, { childList: true, subtree: true });
            } catch (e2) {}
        }
    }

    function stopCardsObserver() { if (cardsObserver) { cardsObserver.disconnect(); cardsObserver = null; cardsContainer = null; } }

    /* THEME HELPERS */
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
        const savedGlow = parseInt(localStorage.getItem(LOCAL_GLOW_KEY) || '60', 10);
        const alpha = Math.max(0, Math.min(1, (isNaN(savedGlow) ? 60 : savedGlow) / 100));
        const accentGlow = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
        const accentOutline = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.92)`;

        const scrollTrack = 'rgba(0,0,0,0.45)';
        const scrollThumb = 'rgba(255,255,255,0.06)';
        const scrollThumbHover = 'rgba(255,255,255,0.12)';

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

        const themeKey = `${accentCss}|${bgChoice}|${alpha}`;
        if (lastThemeKey === themeKey) return;
        lastThemeKey = themeKey;

        let st = document.getElementById(THEME_STYLE_ID);
        if (!st) { st = document.createElement('style'); st.id = THEME_STYLE_ID; document.head.appendChild(st); }
        st.textContent = `
            :root {
                --ryh-accent-bg: ${accentBtn};
                --ryh-accent-glow: ${accentGlow};
                --ryh-accent-outline: ${accentOutline};
                --ryh-accent-btn: ${accentBtn};
                --ryh-accent-text: ${accentText};
                --ryh-accent-border: ${panelBorder};
                --ryh-panel-bg: ${panelBg};
                --ryh-input-bg: ${inputBg};
                --ryh-text-color: ${accentText === '#fff' ? '#e6eef6' : '#111'};
                --ryh-label-color: ${labelColor};
                --ryh-status-color: ${statusColor};

                --ryh-scroll-track: ${scrollTrack};
                --ryh-scroll-thumb: ${scrollThumb};
                --ryh-scroll-thumb-hover: ${scrollThumbHover};
            }
            /* Important: do NOT touch page backdrop; limit changes to our panel only */
            #${PANEL_ID} { background: var(--ryh-panel-bg) !important; border-bottom: var(--ryh-accent-border) !important; }
            #${PANEL_ID} .ryh-select, #${PANEL_ID} .ryh-input { background: var(--ryh-input-bg) !important; color: var(--ryh-text-color) !important; }
            #${PANEL_ID} .ryh-btn { background: var(--ryh-accent-bg) !important; color: var(--ryh-accent-text) !important; }
            #${TOGGLE_ID} { background: var(--ryh-accent-btn) !important; color: var(--ryh-accent-text) !important; border: none !important; }
            #${PANEL_ID} .ryh-btn.outline { border-color: rgba(255,255,255,0.06) !important; color: var(--ryh-text-color) !important; }

            #${PANEL_ID} .ryh-dist { scrollbar-color: var(--ryh-scroll-thumb) var(--ryh-scroll-track); }
            #${PANEL_ID} .ryh-dist::-webkit-scrollbar-track { background: var(--ryh-scroll-track) !important; }
            #${PANEL_ID} .ryh-dist::-webkit-scrollbar-thumb { background: var(--ryh-scroll-thumb) !important; }

            #${PANEL_ID} input[type="checkbox"]:checked { box-shadow: 0 6px 18px var(--ryh-accent-glow); background: var(--ryh-accent-bg); border-color: var(--ryh-accent-bg); }
            #${PANEL_ID} input[type="checkbox"]:checked::after { border-color: var(--ryh-accent-text); }
        `;
    }

    function startThemeWatcher() {
        if (themeObserver) return;
        themeObserver = new MutationObserver(() => updateThemeStyles());
        try {
            themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
            themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
        } catch (e) {
            let attempts = 0;
            const t = setInterval(() => { attempts++; updateThemeStyles(); if (attempts > 40) clearInterval(t); }, 400);
        }
    }

    // STATS: depends on selected platform
    function computeRatingsStats(selectedPlatform = null) {
        const cards = getAllCards();
        const map = new Map();
        let total = 0, sum = 0;
        for (const c of cards) {
            const r = getCardRating(c, selectedPlatform);
            if (r !== null && !isNaN(r)) {
                total++;
                sum += r;
                const key = Math.round(r);
                map.set(key, (map.get(key) || 0) + 1);
            }
        }
        const avg = total ? (sum/total) : null;
        return { total, avg, byRounded: map };
    }

    function animateNumber(el, from, to, duration = 700) {
        if (!el) return;
        const start = performance.now();
        const diff = to - from;
        const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = t < 0.5 ? 2*t*t : -1 + (4-2*t)*t;
            const val = from + diff * eased;
            el.textContent = typeof to === 'number' ? (Math.round(val*100)/100).toFixed(2) : String(Math.round(val));
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    function updateStatsUI(forceRefresh = false) {
        try {
            const panel = document.getElementById(PANEL_ID);
            if (!panel) return;
            const summaryTxt = panel.querySelector('#ryh-stats-summary-txt');
            const distEl = panel.querySelector('#ryh-stats-dist');
            if (!summaryTxt || !distEl) return;

            const selectedPlatform = getCustomSelectValue('ryh-platform') || null;
            const stats = computeRatingsStats(selectedPlatform);
            if (!forceRefresh && stats.total === 0) {
                summaryTxt.textContent = 'Нет доступных рейтингов.';
                distEl.textContent = '—';
                return;
            }
            const avgValue = stats.avg !== null ? Math.round(stats.avg*100)/100 : null;
            summaryTxt.innerHTML = `Карточек с рейтингом: <span id="ryh-anim-total">${stats.total}</span><br>Средний рейтинг: <span id="ryh-anim-avg">${avgValue !== null ? avgValue.toFixed(2) : '—'}</span>`;
            const avgEl = panel.querySelector('#ryh-anim-avg');
            if (avgEl && avgValue !== null) animateNumber(avgEl, 0, avgValue, 900);

            const entries = Array.from(stats.byRounded.entries()).sort((a,b) => b[0]-a[0]);
            if (!entries.length) {
                distEl.textContent = 'Нет данных';
            } else {
                const parts = entries.map(([rating, cnt]) => `${rating}: ${cnt}`);
                distEl.innerHTML = parts.join('<br>');
            }

            const blocks = panel.querySelectorAll('.ryh-stats-block');
            blocks.forEach((b,i) => {
                b.style.transitionDelay = `${i*60}ms`;
                b.classList.add('ryh-stats-show');
                setTimeout(() => b.classList.remove('ryh-stats-show'), 800 + i*60);
            });
        } catch (e) {}
    }

    // RIPPLE helpers
    function createRipple(event, el) {
        try {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ryh-ripple';
            const size = Math.max(rect.width, rect.height) * 1.2;
            ripple.style.width = ripple.style.height = size + 'px';
            const x = (event.clientX || rect.left + rect.width/2) - rect.left - size/2;
            const y = (event.clientY || rect.top + rect.height/2) - rect.top - size/2;
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.background = getComputedStyle(el).color || 'rgba(255,255,255,0.12)';
            el.appendChild(ripple);
            setTimeout(() => { try { ripple.remove(); } catch (e) {} }, 700);
        } catch (e) {}
    }
    function addGlobalRipple(root) {
        const buttons = root.querySelectorAll('.ryh-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (ev) => { createRipple(ev, btn); setTimeout(() => { try { btn.blur(); } catch (e) {} }, 50); });
        });
    }

    // CUSTOM SELECT IMPLEMENTATION
    function replaceWithCustomSelect(nativeSelect, id) {
        try {
            if (!nativeSelect) return;
            const wrapper = createEl('div', { class: 'ryh-custom-select', 'data-ryh-id': id });
            const btn = createEl('button', { type: 'button', class: 'ryh-cs-button', 'aria-haspopup': 'listbox' });
            btn.tabIndex = 0;
            const display = createEl('span', { class: 'ryh-cs-selected', text: nativeSelect.options[nativeSelect.selectedIndex].text || nativeSelect.value });
            const arrow = createEl('span', { class: 'ryh-cs-arrow', text: '▾' });
            btn.appendChild(display); btn.appendChild(arrow);

            const list = createEl('div', { class: 'ryh-cs-list', role: 'listbox' });
            Array.from(nativeSelect.options).forEach(opt => {
                const item = createEl('div', { class: 'ryh-cs-item', 'data-value': opt.value, text: opt.text });
                item.addEventListener('click', (ev) => {
                    setCustomSelectValue(id, opt.value, opt.text);
                    closeAllCustomSelects();
                });
                list.appendChild(item);
            });

            wrapper.appendChild(btn);
            wrapper.appendChild(list);

            nativeSelect.style.display = 'none';
            nativeSelect.parentNode.insertBefore(wrapper, nativeSelect.nextSibling);

            wrapper.__ryh_native = nativeSelect;
            wrapper.__ryh_display = display;

            btn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                const open = wrapper.classList.toggle('open');
                if (open) {
                    closeAllCustomSelects(wrapper);
                    btn.focus();
                }
            });

            btn.addEventListener('keydown', (ev) => {
                if (ev.key === 'ArrowDown' || ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    wrapper.classList.add('open');
                    const first = list.querySelector('.ryh-cs-item');
                    if (first) first.focus();
                } else if (ev.key === 'Escape') {
                    wrapper.classList.remove('open');
                    btn.blur();
                }
            });

            nativeSelect.addEventListener('change', () => {
                const sel = nativeSelect.options[nativeSelect.selectedIndex];
                setCustomSelectValue(id, nativeSelect.value, sel ? sel.text : nativeSelect.value, false);
            });

            try {
                const saved = JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY) || '{}');
                if (saved && saved[id]) {
                    const v = saved[id];
                    const opt = Array.from(nativeSelect.options).find(o => o.value === v);
                    if (opt) {
                        nativeSelect.value = v;
                        setCustomSelectValue(id, v, opt.text, false);
                    }
                }
            } catch (e) {}

            return wrapper;
        } catch (e) {}
    }

    function closeAllCustomSelects(except = null) {
        const opens = document.querySelectorAll('.ryh-custom-select.open');
        opens.forEach(o => {
            if (except && o === except) return;
            o.classList.remove('open');
            const btn = o.querySelector('.ryh-cs-button');
            if (btn) try { btn.blur(); } catch (e) {}
        });
    }

    function setCustomSelectValue(id, value, labelText, dispatch = true) {
        const wrapper = document.querySelector(`.ryh-custom-select[data-ryh-id="${id}"]`);
        if (!wrapper) return;
        const native = wrapper.__ryh_native;
        if (!native) return;
        native.value = value;
        const disp = wrapper.__ryh_display;
        if (disp) disp.textContent = labelText;
        if (dispatch) {
            try {
                const ev = new Event('change', { bubbles: true });
                native.dispatchEvent(ev);
                const custom = new CustomEvent('ryh:customselectchange', { detail: { id, value } });
                document.dispatchEvent(custom);
            } catch (e) {}
        } else {
            const custom = new CustomEvent('ryh:customselectchange', { detail: { id, value } });
            document.dispatchEvent(custom);
        }
    }

    function getCustomSelectValue(id) {
        const wrapper = document.querySelector(`.ryh-custom-select[data-ryh-id="${id}"]`);
        if (!wrapper) {
            const native = document.getElementById(id);
            return native ? native.value : null;
        }
        const native = wrapper.__ryh_native;
        return native ? native.value : null;
    }

    // robust insertion retries
    function tryCreateToggleWithRetries() {
        if (document.getElementById(TOGGLE_ID)) return;
        if (retryTimer) return;
        let attempts = 0;
        retryTimer = setInterval(() => {
            attempts++;
            const ok = createToggleIfReady();
            if (ok) {
                clearInterval(retryTimer); retryTimer = null;
                const panel = ensurePanelExists();
                if (panel) addGlobalRipple(panel);
                startCardsObserver();
                updateThemeStyles();
                startThemeWatcher();
                return;
            }
            if (attempts >= 40) { clearInterval(retryTimer); retryTimer = null; }
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

    // expose version
    window.__ryh_version = VERSION;

})();