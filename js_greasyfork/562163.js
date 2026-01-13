// ==UserScript==
// @name         ReYohoho - фильтр по рейтингу
// @namespace    https://reyohoho.github.io/
// @version      1.9.7
// @description  Адаптивная панель фильтра рейтинга: работает на оригинале и зеркалах (учитывает .controls, .menu, .grid, .movie и т.д.). Батчи, автоприменение, подсветка, статистика. Тонкая адаптация темы. (scrollbar + checkbox styling)
// @author       ReYohoho (updated)
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

    const TOGGLE_ID = 'ryh-toggle-adaptive-v1_9';
    const PANEL_ID = 'ryh-panel-adaptive-v1_9';
    const STYLE_ID = 'ryh-panel-adaptive-styles-v1_9';
    const THEME_STYLE_ID = 'ryh-panel-adaptive-theme-v1_9';
    const LOCAL_KEY = 'ryh_panel_expanded_adaptive_v1_9';
    const LOCAL_SETTINGS_KEY = 'ryh_panel_settings_adaptive_v1_9';

    // SPA route hooks (preserve single-page changes)
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

    // расширённая проверка целевых страниц: пути и наличие характерных контейнеров (.controls/.menu/.grid)
    function isTargetPage() {
        try {
            const raw = location.pathname || '';
            const p = raw.replace(/\/+$/, '');
            // учитываем /top.html (surge) и варианты /top, /lists, с/без префикса reyohoho
            if (p.toLowerCase().endsWith('/top.html')) return true;
            const re = /^\/(?:reyohoho\/)?(lists(?:\/.*)?|top(?:\/.*)?|lists|top)$/i;
            if (re.test(p)) return true;
            if (p.indexOf('/lists') !== -1 || p.indexOf('/top') !== -1) return true;
            // fallback: если на странице есть подходящие UI-элементы
            if (byQ('.controls') || byQ('.menu') || byQ('#movieGrid') || byQ('.grid')) return true;
            return false;
        } catch (e) {
            return false;
        }
    }

    // Универсальные селекторы карточек: поддерживаем .movie-card, .movie и т.д.
    function getAllCards() {
        try {
            // Prefer anchors with movie-card, else .movie-card, else .movie inside grid
            const s = Array.from(document.querySelectorAll('a.movie-card, .movie-card, .movie'));
            return s || [];
        } catch (e) { return []; }
    }

    // извлекает число из текста (как раньше)
    function extractNumberFromText(text) {
        if (!text) return null;
        const m = text.match(/(\d+(?:[.,]\d+)?)/);
        if (!m) return null;
        return parseFloat(m[1].replace(',', '.'));
    }

    // универсальное извлечение рейтинга для разных разметок
    function getCardRating(card, platform) {
        try {
            // кешируем per-platform
            const cacheKey = `data-ryh-rating-${platform || 'any'}`;
            const cached = card.getAttribute(cacheKey);
            if (cached !== null && cached !== undefined && cached !== '') {
                const v = parseFloat(cached);
                return isNaN(v) ? null : v;
            }

            let r = null;

            // старая логика (если есть специфичные классы)
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
            // универсальный поиск: параграфы вида "Рейтинг Кинопоиск: 8.3" или "Рейтинг IMDb: 8.6" или просто "Рейтинг: 8.3"
            if (r === null) {
                const ps = card.querySelectorAll('p, span, div');
                for (const el of ps) {
                    const txt = (el.textContent || '').trim();
                    if (!txt) continue;
                    // Кинопоиск
                    if ((platform === 'kp' || !platform) && /Кинопоиск/i.test(txt)) {
                        const found = txt.match(/Кинопоиск[:\s]*([0-9]+[.,]?[0-9]*)/i);
                        if (found) { r = parseFloat(found[1].replace(',','.')); break; }
                    }
                    // IMDb
                    if ((platform === 'imdb' || !platform) && /IMDb/i.test(txt)) {
                        const found = txt.match(/IMDb[:\s]*([0-9]+[.,]?[0-9]*)/i);
                        if (found) { r = parseFloat(found[1].replace(',','.')); break; }
                    }
                    // Общий рейтинг (например "Рейтинг: 8.3" или "Rating: 8.3")
                    if (!platform) {
                        const found = txt.match(/Рейтинг[:\s]*([0-9]+[.,]?[0-9]*)/i) || txt.match(/Rating[:\s]*([0-9]+[.,]?[0-9]*)/i);
                        if (found) { r = parseFloat(found[1].replace(',','.')); break; }
                    }
                }
            }

            // ещё один шанс — элемент overlay или data-атрибуты
            if (r === null) {
                const overlay = card.querySelector('.ratings-overlay, .rating');
                if (overlay) r = extractNumberFromText(overlay.textContent || overlay.innerText);
            }

            // сохранение кеша
            if (r !== null && !isNaN(r)) {
                try { card.setAttribute(cacheKey, String(r)); } catch (e) {}
                try { if (platform) card.setAttribute('data-ryh-rating-any', String(r)); } catch (e) {}
            } else {
                try { card.setAttribute(cacheKey, ''); } catch (e) {}
            }
            return r;
        } catch (e) { return null; }
    }

    // режимы сравнения (как прежде)
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

    // state, observers
    let cardsObserver = null;
    let currentFilter = { active: false, platform: null, ratingRaw: null, mode: 'exact', effect: 'hide' };
    let cardsContainer = null;
    let controlsObserver = null;
    let retryTimer = null;
    let statsUpdateTimer = null;

    // styles (reuse previous enhanced styles) + scrollbar + checkbox styles
    if (!document.getElementById(STYLE_ID)) {
        const s = document.createElement('style'); s.id = STYLE_ID;
        s.textContent = `
            .ryh-panel-adaptive { box-sizing:border-box; width:100%; overflow:hidden; max-height:0; transition: max-height 360ms cubic-bezier(.2,.9,.2,1), padding 200ms ease, opacity 200ms ease; padding:0 12px; opacity:0; border-bottom:1px solid rgba(255,255,255,0.03); }
            .ryh-panel-adaptive.expanded { max-height:420px; padding:12px; opacity:1; }
            .ryh-panel-inner { color:var(--ryh-text-color, #e6eef6); font-family:Inter, system-ui, sans-serif; }
            .ryh-row { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
            .ryh-label { display:flex; flex-direction:column; font-size:13px; color:var(--ryh-label-color, #cfe7ff); min-width:160px; }
            .ryh-select, .ryh-input { margin-top:6px; padding:8px; border-radius:6px; border:1px solid rgba(255,255,255,0.06); background:var(--ryh-input-bg, #141617); color:var(--ryh-text-color, #eef6ff); outline:none; font-size:13px; }
            .ryh-controls { display:flex; gap:8px; align-items:center; }
            .ryh-btn { padding:8px 10px; border-radius:8px; background: var(--ryh-accent-bg, #1f8f6b); color: var(--ryh-accent-text, #fff); border:0; cursor:pointer; font-weight:600; transition: transform 160ms ease, box-shadow 160ms ease; }
            .ryh-btn.outline { background: transparent; border:1px solid rgba(255,255,255,0.06); color:var(--ryh-text-color, #dfeaf5); font-weight:500; }
            .ryh-status { margin-top:10px; font-size:13px; color:var(--ryh-status-color, #9fb6c9); min-height:18px; }
            #${TOGGLE_ID} { background: var(--ryh-accent-btn, #0b8f6a); color: var(--ryh-accent-text, #fff); border-radius:8px; transition: transform 160ms ease, box-shadow 160ms ease; }

            .ryh-hidden { opacity: 0.08 !important; pointer-events: none !important; transform: scale(0.995); transition: opacity 200ms ease, transform 200ms ease; }

            .ryh-highlight {
                position: relative;
                z-index: 6 !important;
                transition: transform 180ms cubic-bezier(.2,.9,.2,1), box-shadow 220ms ease, background-color 220ms ease, border-color 220ms ease;
                transform: translateY(-6px);
                border-radius: 10px;
                background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
                outline: 3px solid var(--ryh-accent-outline, rgba(30,150,100,0.95));
                box-shadow:
                    0 10px 30px rgba(0,0,0,0.35),
                    0 0 26px rgba(0,0,0,0.12),
                    0 0 18px rgba(0,0,0,0.06);
            }
            .ryh-highlight::after {
                content: '';
                position: absolute;
                inset: -9px;
                border-radius: 14px;
                pointer-events: none;
                z-index: -1;
                background: radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, transparent 40%);
                box-shadow: 0 0 60px var(--ryh-accent-glow, rgba(30,150,100,0.6));
                opacity: 0.98;
            }

            .ryh-btn:hover, .ryh-btn:focus, #${TOGGLE_ID}:hover, #${TOGGLE_ID}:focus {
                transform: translateY(-3px);
                box-shadow: 0 8px 24px rgba(0,0,0,0.28), 0 0 18px var(--ryh-accent-glow, rgba(30,150,100,0.36));
            }
            .ryh-btn.outline:hover, .ryh-btn.outline:focus {
                transform: translateY(-2px);
                box-shadow: 0 6px 18px rgba(0,0,0,0.18), 0 0 12px var(--ryh-accent-glow, rgba(30,150,100,0.28));
            }

            .ryh-stats {
                margin-top:10px;
                font-size:13px;
                color:var(--ryh-status-color, #9fb6c9);
                display:flex;
                gap:12px;
                align-items:flex-start;
                flex-wrap:wrap;
            }
            .ryh-stats .ryh-stats-block {
                background: rgba(0,0,0,0.18);
                padding:8px 10px;
                border-radius:8px;
                min-width:120px;
            }
            .ryh-stats .ryh-stats-block b { display:block; font-size:14px; color: var(--ryh-text-color); margin-bottom:6px; }
            .ryh-stats .ryh-dist { max-height:120px; overflow:auto; font-size:12px; color:var(--ryh-text-color); padding-right:6px; }

            /* ---------- Dark scrollbar for distribution block ---------- */
            #${PANEL_ID} .ryh-dist {
                scrollbar-width: thin;
                scrollbar-color: var(--ryh-scroll-thumb, rgba(255,255,255,0.06)) var(--ryh-scroll-track, rgba(0,0,0,0.45));
            }
            #${PANEL_ID} .ryh-dist::-webkit-scrollbar { width:10px; height:10px; }
            #${PANEL_ID} .ryh-dist::-webkit-scrollbar-track { background: var(--ryh-scroll-track, rgba(0,0,0,0.45)); border-radius:10px; }
            #${PANEL_ID} .ryh-dist::-webkit-scrollbar-thumb {
                background: var(--ryh-scroll-thumb, rgba(255,255,255,0.06));
                border-radius:10px;
                border: 2px solid transparent;
                background-clip: padding-box;
            }
            #${PANEL_ID} .ryh-dist:hover::-webkit-scrollbar-thumb { background: var(--ryh-scroll-thumb-hover, rgba(255,255,255,0.12)); }

            /* ---------- Dark styled checkbox (auto apply) ---------- */
            #${PANEL_ID} input[type="checkbox"] {
                width:18px;
                height:18px;
                -webkit-appearance:none;
                appearance:none;
                display:inline-block;
                vertical-align:middle;
                margin-right:6px;
                margin-top:6px;
                border-radius:4px;
                border:1px solid rgba(255,255,255,0.06);
                background: rgba(255,255,255,0.02);
                position:relative;
                transition: background 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
            }
            #${PANEL_ID} input[type="checkbox"]::after {
                content: '';
                position:absolute;
                left:4px;
                top:1px;
                width:6px;
                height:10px;
                border: solid var(--ryh-accent-text, #fff);
                border-width: 0 2px 2px 0;
                transform: rotate(45deg) scale(0.9);
                opacity:0;
                transition: opacity 140ms ease, transform 140ms ease;
            }
            #${PANEL_ID} input[type="checkbox"]:checked {
                background: var(--ryh-accent-bg, rgb(31,143,107));
                border-color: var(--ryh-accent-bg, rgb(31,143,107));
                box-shadow: 0 6px 18px var(--ryh-accent-glow, rgba(31,143,107,0.28));
            }
            #${PANEL_ID} input[type="checkbox"]:checked::after {
                opacity:1;
                transform: rotate(45deg) scale(1);
            }

            @media (max-width:900px){ .ryh-row { flex-direction:column; align-items:flex-start; } .ryh-label { min-width:auto; width:100%; } }
        `;
        document.head.appendChild(s);
    }

    // create toggle (searches multiple possible button containers, includes .menu)
    function createToggleIfReady() {
        if (document.getElementById(TOGGLE_ID)) return true;

        const candidates = [];
        const c_controls = byQ('div.controls') || byQ('.controls'); if (c_controls) candidates.push(c_controls);
        const c_filter_type = byQ('.filter-card.type-card'); if (c_filter_type) candidates.push(c_filter_type);
        const c_filter_time = byQ('.filter-card.time-card'); if (c_filter_time) candidates.push(c_filter_time);
        const c_button_group = byQ('.button-group.time-buttons'); if (c_button_group) candidates.push(c_button_group.parentElement || c_button_group);
        const c_type_buttons = byQ('.button-group.type-buttons'); if (c_type_buttons) candidates.push(c_type_buttons.parentElement || c_type_buttons);
        const c_menu = byQ('.menu'); if (c_menu) candidates.push(c_menu); // for surge mirror (.menu)
        const c_movieGrid = byQ('#movieGrid'); if (c_movieGrid) candidates.push(c_movieGrid.parentElement || c_movieGrid);

        const fb = byQ('.filter-btn.type-btn, .filter-btn, .filter-btn.time-btn'); if (fb) candidates.push(fb.parentElement || fb.closest('.button-group') || fb);

        for (const root of candidates) {
            if (!root) continue;
            // find suitable insertion point: prefer a button-group, else root itself
            const btnGroup = root.querySelector('.button-group.type-buttons') || root.querySelector('.button-group.time-buttons') || root.querySelector('.button-group') || root;
            if (!btnGroup) continue;
            // check whether btnGroup already has filter buttons (heuristic)
            const listButtons = btnGroup.querySelectorAll('.filter-btn.type-btn, .filter-btn, .filter-btn.time-btn, button');
            if (!listButtons || listButtons.length === 0) continue;

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

                toggle.addEventListener('click', () => {
                    const panel = ensurePanelExists();
                    if (!panel) return;
                    const expanded = panel.classList.toggle('expanded');
                    toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
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

    // ensure panel exists; insert after .controls or .menu or grid
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

        const autoWrap = createEl('label', { class: 'ryh-label', style: 'min-width:auto; align-items:center; justify-content:flex-start;' }, [
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

        try {
            const saved = JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY) || '{}');
            if (saved.mode) selMode.value = saved.mode;
            if (saved.effect) selEffect.value = saved.effect;
            if (saved.auto) document.getElementById('ryh-auto').checked = !!saved.auto;
        } catch (e) {}

        btnApply.addEventListener('click', () => {
            const platform = selPlatform.value;
            const mode = selMode.value;
            const ratingRaw = inputRating.value;
            const effect = selEffect.value;
            if (!ratingRaw || !ratingRaw.trim()) { const statusEl = document.getElementById('ryh-status'); if (statusEl) statusEl.textContent = 'Введите рейтинг перед применением.'; return; }
            saveSettings({ mode, effect, auto: document.getElementById('ryh-auto').checked });
            applyFilterMass(platform, ratingRaw, mode, effect).then(() => updateStatsUI());
        });

        btnReset.addEventListener('click', () => {
            inputRating.value = '';
            resetFilter();
            updateStatsUI();
        });

        inputRating.addEventListener('keydown', (e) => { if (e.key === 'Enter') btnApply.click(); });

        // debounce auto-apply and listen to platform/mode/effect changes
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
            saveSettings({ mode: selMode.value, effect: selEffect.value, auto });
            if (!auto) return;
            scheduleAutoApply();
        });

        selPlatform.addEventListener('change', () => {
            saveSettings({ mode: selMode.value, effect: selEffect.value, auto: document.getElementById('ryh-auto').checked });
            scheduleAutoApply();
        });
        selMode.addEventListener('change', () => {
            saveSettings({ mode: selMode.value, effect: selEffect.value, auto: document.getElementById('ryh-auto').checked });
            scheduleAutoApply();
        });
        selEffect.addEventListener('change', () => {
            saveSettings({ mode: selMode.value, effect: selEffect.value, auto: document.getElementById('ryh-auto').checked });
            scheduleAutoApply();
        });
        document.getElementById('ryh-auto').addEventListener('change', () => {
            saveSettings({ mode: selMode.value, effect: selEffect.value, auto: document.getElementById('ryh-auto').checked });
        });

        const statsRefreshBtn = panel.querySelector('#ryh-stats-refresh');
        if (statsRefreshBtn) statsRefreshBtn.addEventListener('click', () => updateStatsUI(true));

        try { const was = localStorage.getItem(LOCAL_KEY) === '1'; if (was) panel.classList.add('expanded'); } catch (e) {}

        updateThemeStyles();
        setTimeout(() => updateStatsUI(), 120);

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

    // Theme helper functions (same as before) + scroll/checkbox variables
    let lastThemeKey = null;
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
        const accentGlow = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.60)`;
        const accentOutline = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.92)`;

        // Dark scroll variables (always lean dark for distribution block)
        const scrollTrack = 'rgba(0,0,0,0.45)';
        // if accent is very dark, give thumb a light low-contrast; otherwise use subtle white
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

        const themeKey = `${accentCss}|${bgChoice}`;
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

                /* scrollbar / checkbox variables */
                --ryh-scroll-track: ${scrollTrack};
                --ryh-scroll-thumb: ${scrollThumb};
                --ryh-scroll-thumb-hover: ${scrollThumbHover};
            }
            #${PANEL_ID} { background: var(--ryh-panel-bg) !important; border-bottom: var(--ryh-accent-border) !important; ${bgChoice === 'disabled' ? '' : 'backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);'} }
            #${PANEL_ID} .ryh-select, #${PANEL_ID} .ryh-input { background: var(--ryh-input-bg) !important; color: var(--ryh-text-color) !important; }
            #${PANEL_ID} .ryh-btn { background: var(--ryh-accent-bg) !important; color: var(--ryh-accent-text) !important; }
            #${TOGGLE_ID} { background: var(--ryh-accent-btn) !important; color: var(--ryh-accent-text) !important; border: none !important; }
            #${PANEL_ID} .ryh-btn.outline { border-color: rgba(255,255,255,0.06) !important; color: var(--ryh-text-color) !important; }

            /* ensure the distribution block scrollbar uses our variables (for non-webkit as well) */
            #${PANEL_ID} .ryh-dist {
                scrollbar-color: var(--ryh-scroll-thumb) var(--ryh-scroll-track);
            }
            #${PANEL_ID} .ryh-dist::-webkit-scrollbar-track { background: var(--ryh-scroll-track) !important; }
            #${PANEL_ID} .ryh-dist::-webkit-scrollbar-thumb { background: var(--ryh-scroll-thumb) !important; }
        `;
    }

    let themeObserver = null;
    function startThemeWatcher() {
        if (themeObserver) return;
        themeObserver = new MutationObserver((mutations) => updateThemeStyles());
        try {
            themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
            themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
        } catch (e) {
            let attempts = 0;
            const t = setInterval(() => { attempts++; updateThemeStyles(); if (attempts > 40) clearInterval(t); }, 400);
        }
    }

    // stats compute & UI update
    function computeRatingsStats() {
        const cards = getAllCards();
        const map = new Map();
        let total = 0, sum = 0;
        for (const c of cards) {
            const r = getCardRating(c, null);
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

    function updateStatsUI(forceRefresh = false) {
        try {
            const panel = document.getElementById(PANEL_ID);
            if (!panel) return;
            const summaryTxt = panel.querySelector('#ryh-stats-summary-txt');
            const distEl = panel.querySelector('#ryh-stats-dist');
            if (!summaryTxt || !distEl) return;
            const stats = computeRatingsStats();
            if (!forceRefresh && stats.total === 0) {
                summaryTxt.textContent = 'Нет доступных рейтингов.';
                distEl.textContent = '—';
                return;
            }
            const avgText = stats.avg !== null ? (Math.round(stats.avg*100)/100).toFixed(2) : '—';
            summaryTxt.textContent = `Карточек с рейтингом: ${stats.total}\nСредний рейтинг: ${avgText}`;
            const entries = Array.from(stats.byRounded.entries()).sort((a,b) => b[0]-a[0]);
            if (!entries.length) {
                distEl.textContent = 'Нет данных';
            } else {
                const parts = entries.map(([rating, cnt]) => `${rating}: ${cnt}`);
                distEl.innerHTML = parts.join('<br>');
            }
        } catch (e) {}
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
                ensurePanelExists();
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

    // route handling
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