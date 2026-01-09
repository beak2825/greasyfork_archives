// ==UserScript==
// @name         LiveLib — Review Sorter (v2.6)
// @namespace    https://example.local/
// @version      2.6
// @description  Сортировка карточек обзоров LiveLib: локальная сортировка видимых карточек и опция «Слить все страницы» (скрипт загружает дополнительные страницы same-origin через fetch). UI — фиксированное окно; не содержит рекламы или трекеров.
// @match        https://www.livelib.ru/book/*/reviews*
// @match        https://www.livelib.ru/book/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/yourname/livelib-review-sorter
// @supportURL   https://github.com/yourname/livelib-review-sorter/issues
// @downloadURL https://update.greasyfork.org/scripts/561912/LiveLib%20%E2%80%94%20Review%20Sorter%20%28v26%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561912/LiveLib%20%E2%80%94%20Review%20Sorter%20%28v26%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SETTINGS_KEY = 'll_review_sorter_settings_v2.6';
    const DEFAULT = { primary: 'likes', secondary: 'comments', order: 'desc', debug: false, maxPagesCap: 300 };
    let settings = Object.assign({}, DEFAULT);
    try { settings = Object.assign(settings, JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')); } catch (e) {}

    function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }

    // ***** ВАЖНО: разделение селекторов *****
    // 1) TOP_LEVEL_CARD_SELECTORS — строгие селекторы для самих карточек (используются при перестановке/удалении)
    const TOP_LEVEL_CARD_SELECTORS = [
        '.lenta__item',
        'article.lenta__item',
        '.review-card',
        '.quote-card',
        '.selection-card',
        '.histories-card',
        '.story-card',
        '.lifehack-card',
        '.exchange-card',
        'article.selection-card',
        'article.histories-card',
        'article.exchange-card'
    ];

    // 2) REVIEW_CARD_SELECTORS — расширенный набор для парсинга/поиска карточек в документе (может быть шире),
    //    но он **не** используется при удалении дочерних элементов контейнера, чтобы не трогать внутренние элементы.
    const REVIEW_CARD_SELECTORS = [
        '.review-card',
        '.review-card.lenta__item',
        '.lenta__item',
        '.lenta-card-wrapper',
        '.quote-card',
        '.selection-card',
        '.histories-card',
        '.story-card',
        '.lifehack-card',
        '.exchange-card',
        'article.lenta__item'
        // deliberately omitted: '.lenta-card' (чтобы не захватывать внутренние div'ы)
    ];

    /* ---------------- Parsing utils ---------------- */
    function parseNumberFromText(text) {
        if (!text) return 0;
        text = ('' + text).replace(/\u00A0/g, ' ').trim();
        const m = text.match(/(\d{1,3}(?:[ \u00A0]\d{3})*|\d+)/);
        if (m) return parseInt(m[1].replace(/[\s\u00A0]/g, ''), 10) || 0;
        return 0;
    }
    function parseAbbreviatedNumber(text) {
        if (!text) return 0;
        text = ('' + text).replace(/\u00A0/g, ' ').trim();
        const m = text.match(/([\d\.,]+)\s*([kKmMкКмМ])?/);
        if (!m) return parseNumberFromText(text);
        let num = m[1].replace(',', '.');
        let value = parseFloat(num);
        if (isNaN(value)) return parseNumberFromText(text);
        const suf = (m[2] || '').toLowerCase();
        if (suf === 'k' || suf === 'к') value = Math.round(value * 1000);
        if (suf === 'm' || suf === 'м') value = Math.round(value * 1000000);
        return Math.round(value);
    }
    const RU_MONTHS = { 'января':1,'февраля':2,'марта':3,'апреля':4,'мая':5,'июня':6,'июля':7,'августа':8,'сентября':9,'октября':10,'ноября':11,'декабря':12 };
    function parseRussianDateText(text) {
        if (!text) return 0;
        text = ('' + text).replace(/\u00A0/g, ' ').trim();
        const m = text.match(/(\d{1,2})\s+([а-яё]+)\s+(\d{4})/i);
        if (m) return new Date(parseInt(m[3],10), (RU_MONTHS[m[2].toLowerCase()]||1)-1, parseInt(m[1],10)).getTime();
        const m2 = text.match(/(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
        if (m2) return new Date(parseInt(m2[1],10), parseInt(m2[2],10)-1, parseInt(m2[3],10)).getTime();
        return 0;
    }

    /* ---------------- Detection ---------------- */
    function isOnCardListPage() {
        try {
            const path = window.location.pathname || '';
            if (/\/book\/.+\/reviews(\/|$|-)/i.test(path)) return true;
            if (document.querySelector('.bc-detailing-reviews.bc-header__link--active')) return true;
            if (document.querySelector(REVIEW_CARD_SELECTORS.join(','))) return true;
            return false;
        } catch (e) { return false; }
    }

    /* ---------------- Extract metrics ---------------- */
    function extractMetricsFromCard(el) {
        if (!el) return { likes:0, comments:0, shares:0, views:0, bookmarks:0, rating:0, date:0 };

        const likeEl = el.querySelector('.vote-link .sub__link-count, a.vote-link .sub__link-count, .vote-link .sub__link-count');
        const likes = likeEl ? parseNumberFromText(likeEl.textContent || likeEl.innerText) : 0;

        const commEl = el.querySelector('.icon-comment span, a.icon-comment span, .sab__link.icon-comment span, .footer-card__soc-active .icon-comment span');
        const comments = commEl ? parseNumberFromText(commEl.textContent || commEl.innerText) : 0;

        const shareEl = el.querySelector('.share-link .sub__link-count, a.share-link .sub__link-count, .share-link span');
        const shares = shareEl ? parseNumberFromText(shareEl.textContent || shareEl.innerText) : 0;

        const viewsEl = el.querySelector('.lenta-card__aliases span, .lenta-card__aliases, .lenta-card__count-book span');
        const views = viewsEl ? parseAbbreviatedNumber((viewsEl.textContent||viewsEl.innerText||'').trim()) : 0;

        const favEl = el.querySelector('.fav-link .sub__link-count, a.fav-link .sub__link-count, .fav-link span');
        const bookmarks = favEl ? parseNumberFromText(favEl.textContent || favEl.innerText) : 0;

        const ratingEl = el.querySelector('.lenta-card__mymark, .lenta-card__mymark .value, .lenta-card__rating, .lenta-card__rating span');
        let rating = 0;
        if (ratingEl) { const m = (ratingEl.textContent||'').match(/(\d+(?:[.,]\d+)?)/); if (m) rating = parseFloat(m[1].replace(',', '.')) || 0; }

        const dateEl = el.querySelector('p.lenta-card__date, .lenta-card__date, time[datetime], .header-card-user__status, .lenta-card__details p.lenta-card__date');
        let dateTs = 0;
        if (dateEl) {
            if (dateEl.tagName && dateEl.tagName.toLowerCase() === 'time') {
                const dt = dateEl.getAttribute('datetime'); const p = Date.parse(dt); if (!isNaN(p)) dateTs = p;
            } else dateTs = parseRussianDateText((dateEl.textContent||dateEl.innerText||'').replace(/\u00A0/g,' ')) || 0;
        }

        return { likes, comments, shares, views, bookmarks, rating, date: dateTs || 0 };
    }

    /* ---------------- Sorting ---------------- */
    function sortArray(items, primary, secondary, order) {
        const dir = order === 'asc' ? 1 : -1;
        items.sort((a,b) => {
            const pa = (a.metrics && a.metrics[primary]) || 0;
            const pb = (b.metrics && b.metrics[primary]) || 0;
            if (pa !== pb) return (pa < pb ? -1 : 1) * dir;
            if (secondary && secondary !== primary) {
                const sa = (a.metrics && a.metrics[secondary]) || 0;
                const sb = (b.metrics && b.metrics[secondary]) || 0;
                if (sa !== sb) return (sa < sb ? -1 : 1) * dir;
            }
            return a.index - b.index;
        });
    }

    /* ---------------- Overlay UI (fixed, non-intrusive) ---------------- */
    const OVERLAY_ID = 'll-sorter-overlay-v2-6';
    function createOverlay() {
        if (document.getElementById(OVERLAY_ID)) return;

        const overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;
        overlay.setAttribute('role','dialog');
        overlay.style.cssText = [
            'position:fixed',
            'right:18px',
            'top:84px',
            'width:320px',
            'max-width:calc(100% - 40px)',
            'background:#fbfbfb',
            'border:1px solid rgba(0,0,0,0.08)',
            'box-shadow:0 6px 20px rgba(0,0,0,0.08)',
            'padding:8px',
            'border-radius:8px',
            'z-index:2147483000',
            'font-size:13px',
            'color:#111',
            'display:flex',
            'flex-direction:column',
            'gap:8px',
            'transition:opacity .18s ease',
            'opacity:1'
        ].join(';');

        const header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;';

        const title = document.createElement('div');
        title.innerText = 'LL Sorter';
        title.style.fontWeight = '600';

        const controls = document.createElement('div');
        controls.style.display = 'flex'; controls.style.gap = '6px'; controls.style.alignItems='center';

        const minBtn = document.createElement('button');
        minBtn.type = 'button';
        minBtn.title = 'Свернуть';
        minBtn.innerText = '—';
        minBtn.style.cssText = 'width:28px;height:24px;border-radius:4px;border:1px solid #ddd;background:#fff;cursor:pointer';
        minBtn.onclick = () => {
            const body = overlay.querySelector('.ll-body'); if (body) body.style.display = body.style.display === 'none' ? 'flex' : 'none';
        };

        const dragBtn = document.createElement('button');
        dragBtn.type='button';
        dragBtn.title='Переместить';
        dragBtn.innerText='⇅';
        dragBtn.style.cssText = 'width:28px;height:24px;border-radius:4px;border:1px solid #ddd;background:#fff;cursor:move';
        makeDraggable(overlay, dragBtn);

        controls.appendChild(minBtn); controls.appendChild(dragBtn);

        header.appendChild(title); header.appendChild(controls);
        overlay.appendChild(header);

        const body = document.createElement('div');
        body.className = 'll-body';
        body.style.cssText = 'display:flex;flex-direction:column;gap:6px;';

        const row1 = document.createElement('div');
        row1.style.cssText='display:flex;gap:6px;align-items:center;flex-wrap:wrap;';

        const selPri = document.createElement('select');
        selPri.id = 'll-sel-primary';
        selPri.style.minWidth='120px';
        selPri.innerHTML = [
            '<option value="likes">Лайки</option>',
            '<option value="comments">Комментарии</option>',
            '<option value="shares">Репосты</option>',
            '<option value="views">Просмотры</option>',
            '<option value="bookmarks">Закладки</option>',
            '<option value="rating">Оценка</option>',
            '<option value="date">Дата</option>'
        ].join('');
        selPri.value = settings.primary || 'likes';
        selPri.onchange = () => { settings.primary = selPri.value; saveSettings(); };

        const selSec = document.createElement('select');
        selSec.id = 'll-sel-secondary';
        selSec.style.minWidth='120px';
        selSec.innerHTML = '<option value="">— вторичная —</option>' +
            '<option value="likes">Лайки</option><option value="comments">Комментарии</option><option value="shares">Репосты</option>' +
            '<option value="views">Просмотры</option><option value="bookmarks">Закладки</option><option value="rating">Оценка</option><option value="date">Дата</option>';
        selSec.value = settings.secondary || '';
        selSec.onchange = () => { settings.secondary = selSec.value || ''; saveSettings(); };

        row1.appendChild(selPri); row1.appendChild(selSec);

        const row2 = document.createElement('div'); row2.style.cssText='display:flex;gap:6px;align-items:center;';
        const orderBtn = document.createElement('button'); orderBtn.type='button';
        orderBtn.id = 'll-order-btn';
        orderBtn.innerText = settings.order === 'desc' ? 'По убыванию' : 'По возрастанию';
        orderBtn.onclick = () => { settings.order = settings.order === 'desc' ? 'asc' : 'desc'; orderBtn.innerText = settings.order === 'desc' ? 'По убыванию' : 'По возрастанию'; saveSettings(); };

        const sortBtn = document.createElement('button'); sortBtn.type='button'; sortBtn.id='ll-sort-button'; sortBtn.innerText='Отсортировать';
        sortBtn.onclick = () => runLocalSort();

        const mergeBtn = document.createElement('button'); mergeBtn.type='button'; mergeBtn.id='ll-merge-button'; mergeBtn.innerText='Слить все страницы';
        mergeBtn.onclick = () => mergeAllPagesToContinuousList();

        row2.appendChild(orderBtn); row2.appendChild(sortBtn); row2.appendChild(mergeBtn);

        const row3 = document.createElement('div'); row3.style.cssText='display:flex;gap:6px;align-items:center;flex-wrap:wrap;';
        const dbgChk = document.createElement('input'); dbgChk.type='checkbox'; dbgChk.id='ll-debug'; dbgChk.checked = !!settings.debug;
        dbgChk.onchange = () => { settings.debug = dbgChk.checked; saveSettings(); };
        const dbgLabel = document.createElement('label'); dbgLabel.htmlFor='ll-debug'; dbgLabel.innerText='Debug';
        const logBtn = document.createElement('button'); logBtn.type='button'; logBtn.innerText='Показать лог'; logBtn.onclick = dumpLog;
        row3.appendChild(dbgChk); row3.appendChild(dbgLabel); row3.appendChild(logBtn);

        const prog = document.createElement('div'); prog.style.cssText='display:flex;flex-direction:column;gap:4px;';
        const progText = document.createElement('div'); progText.id='ll-prog-text'; progText.style.fontSize='12px'; progText.innerText='';
        const progBarBg = document.createElement('div'); progBarBg.style.cssText='width:100%;height:8px;background:#eee;border-radius:4px;overflow:hidden;';
        const progBar = document.createElement('div'); progBar.id='ll-prog-bar'; progBar.style.cssText='width:0%;height:100%;background:#4caf50;transition:width .2s';
        progBarBg.appendChild(progBar);
        prog.appendChild(progText); prog.appendChild(progBarBg);

        body.appendChild(row1); body.appendChild(row2); body.appendChild(row3); body.appendChild(prog);

        overlay.appendChild(body);

        document.body.appendChild(overlay);
        if (!isOnCardListPage()) overlay.style.display = 'none';
    }

    function makeDraggable(el, handle) {
        let offsetX=0, offsetY=0, dragging=false;
        handle.style.cursor='move';
        handle.addEventListener('mousedown', e => {
            e.preventDefault();
            dragging = true;
            const rect = el.getBoundingClientRect();
            offsetX = e.clientX - rect.left; offsetY = e.clientY - rect.top;
            document.body.style.userSelect = 'none';
        });
        window.addEventListener('mousemove', e => {
            if (!dragging) return;
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            el.style.left = Math.max(8, Math.min(window.innerWidth - el.offsetWidth - 8, x)) + 'px';
            el.style.top = Math.max(8, Math.min(window.innerHeight - el.offsetHeight - 8, y)) + 'px';
            el.style.right = 'auto';
            el.style.position = 'fixed';
        });
        window.addEventListener('mouseup', () => {
            if (dragging) { dragging = false; document.body.style.userSelect = ''; }
        });
    }

    function showOverlayIfNeeded() {
        const overlay = document.getElementById(OVERLAY_ID);
        if (!overlay) createOverlay();
        const ov = document.getElementById(OVERLAY_ID);
        if (!ov) return;
        if (isOnCardListPage()) ov.style.display = 'flex';
        else ov.style.display = 'none';
    }

    /* ---------------- Local sort (current DOM) ---------------- */
    function isTopLevelCard(el) {
        if (!el || !(el instanceof Element)) return false;
        return TOP_LEVEL_CARD_SELECTORS.some(sel => el.matches && el.matches(sel));
    }

    function collectReviewElementsFromDOM() {
        // Используем строгие top-level селекторы при локальном сборе
        const sel = TOP_LEVEL_CARD_SELECTORS.join(',');
        const nodeList = document.querySelectorAll(sel);
        const arr = [];
        nodeList.forEach(el => {
            if (!(el instanceof Element)) return;
            const text = (el.textContent || '').trim();
            if (text.length < 20) return;
            arr.push(el);
        });
        return Array.from(new Set(arr));
    }

    function findContainerForCards(cards) {
        if (!cards || !cards.length) return null;
        const explicit = [
            document.querySelector('#book-reviews'),
            document.querySelector('article#reviews'),
            document.querySelector('#reviews'),
            document.querySelector('.lenta'),
            document.querySelector('.content'),
            document.querySelector('#content'),
            document.querySelector('.feed'),
            document.querySelector('.page__content')
        ].filter(Boolean);
        if (explicit.length) {
            for (const c of explicit) {
                if (cards.some(card => c.contains(card))) return c;
            }
        }
        const first = cards[0];
        let node = first.parentElement;
        const threshold = Math.max(1, Math.floor(cards.length * 0.5));
        while (node && node !== document.body) {
            let count = 0;
            for (const c of cards) if (node.contains(c)) count++;
            if (count >= threshold) return node;
            node = node.parentElement;
        }
        return first.parentElement || document.body;
    }

    function runLocalSort() {
        const itemsEls = collectReviewElementsFromDOM();
        if (!itemsEls.length) { console.warn('LLSorter: карточки не найдены'); return; }
        const container = findContainerForCards(itemsEls);
        if (!container) { console.warn('LLSorter: контейнер не найден'); return; }
        const list = itemsEls.map((el,i)=>({ el, metrics: extractMetricsFromCard(el), index: i }));
        sortArray(list, settings.primary, settings.secondary, settings.order);
        const frag = document.createDocumentFragment();
        list.forEach(it => frag.appendChild(it.el));
        try {
            // сохраним все не-карточные узлы (на уровне container.children) и удалим только верхнеуровневые карточки
            const keep = [];
            Array.from(container.children).forEach(ch=>{
                const isCard = isTopLevelCard(ch);
                if (!isCard) keep.push(ch);
            });
            Array.from(container.children).forEach(ch=>{
                const isCard = isTopLevelCard(ch);
                if (isCard) container.removeChild(ch);
            });
            // вставляем отсортированные карточки
            container.insertBefore(frag, container.firstChild);
            // восстановим не-карточные элементы
            keep.forEach(n=>container.appendChild(n));
        } catch (e) { console.error('LLSorter: вставка не удалась', e); }
    }

    /* ---------------- Pagination read / fetch / merge ---------------- */
    function readPaginationLinks() {
        const paginationSelectors = ['#book-reviews-pagination', '.pagination', 'nav.pagination', '.pager', 'ul.pagination', '.page__pagination'];
        const links = new Set();
        for (const sel of paginationSelectors) {
            const root = document.querySelector(sel);
            if (!root) continue;
            Array.from(root.querySelectorAll('a[href]')).forEach(a => {
                const href = a.href;
                if (href) links.add(href.split('#')[0]);
            });
        }
        if (!links.size) {
            Array.from(document.querySelectorAll('a[href]')).forEach(a=>{
                if (a.classList && /page|pagination|pager|~\d+/.test(a.href)) links.add(a.href.split('#')[0]);
            });
        }
        const arr = Array.from(links);
        const current = window.location.href.split('#')[0];
        if (!arr.includes(current)) arr.unshift(current);
        return arr;
    }
    function detectLastPageNumber() {
        const selectors = ['#book-reviews-pagination', '.pagination', 'nav.pagination', '.pager', 'ul.pagination', '.page__pagination'];
        let max = 0;
        for (const sel of selectors) {
            const root = document.querySelector(sel);
            if (!root) continue;
            Array.from(root.querySelectorAll('a[href]')).forEach(a=>{
                const m = a.href.match(/~(\d+)(?:$|[\/?#])/);
                if (m) { const n = parseInt(m[1],10); if (n>max) max=n; }
                const idm = (a.id||'').match(/-(\d+)$/); if (idm) { const n = parseInt(idm[1],10); if (n>max) max=n; }
                const txt = (a.textContent||'').trim();
                const num = parseInt(txt.replace(/\D/g,''),10);
                if (!isNaN(num) && num>max) max = num;
            });
        }
        return max || null;
    }
    function getBasePageUrl() {
        let url = window.location.href.split('#')[0]; url = url.replace(/\/~\d+(?:$|[\/?#]).*$/,''); url = url.replace(/\/+$/,''); return url;
    }

    async function fetchAndParseReviews(url) {
        try {
            const res = await fetch(url, { credentials: 'same-origin' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const text = await res.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            const cards = [];
            const sel = REVIEW_CARD_SELECTORS.join(',');
            doc.querySelectorAll(sel).forEach(el => {
                if (!(el instanceof Element)) return;
                const txt = (el.textContent||'').trim();
                if (txt.length < 20) return;
                cards.push(el);
            });
            if (!cards.length) {
                const root = doc.querySelector('#book-reviews') || doc;
                Array.from(root.children).forEach(ch => {
                    if (!(ch instanceof Element)) return;
                    if ((ch.textContent||'').trim().length > 60) cards.push(ch);
                });
            }
            return cards.map((el, idx) => ({ html: el.outerHTML, metrics: extractMetricsFromCard(el), sourceUrl: url, index: idx }));
        } catch (e) {
            if (settings.debug) console.warn('LLSorter fetch error', e);
            return [];
        }
    }

    function setProgressText(current, total, cardsProcessed, cardsTotal) {
        const t = document.getElementById('ll-prog-text');
        const bar = document.getElementById('ll-prog-bar');
        if (t) t.innerText = `Страниц: ${current}/${total} • Карточек: ${cardsProcessed}/${cardsTotal||'?'}`;
        if (bar) { const pct = total>0 ? Math.round(current/total*100) : 0; bar.style.width = `${pct}%`; }
    }

    async function mergeAllPagesToContinuousList() {
        const overlay = document.getElementById(OVERLAY_ID);
        if (!overlay) return;
        const mergeBtn = document.getElementById('ll-merge-button');
        const sortBtn = document.getElementById('ll-sort-button');
        if (mergeBtn) mergeBtn.disabled = true; if (sortBtn) sortBtn.disabled = true;

        const itemsEls = collectReviewElementsFromDOM();
        if (!itemsEls.length) { console.warn('LLSorter: карточки не найдены'); if (mergeBtn) mergeBtn.disabled=false; if (sortBtn) sortBtn.disabled=false; return; }
        const container = findContainerForCards(itemsEls);
        if (!container) { console.warn('LLSorter: контейнер не найден'); if (mergeBtn) mergeBtn.disabled=false; if (sortBtn) sortBtn.disabled=false; return; }

        let links = readPaginationLinks();
        const lastDetected = detectLastPageNumber();
        if (lastDetected && lastDetected > links.length) {
            const base = getBasePageUrl(); links = [];
            for (let p=1;p<=lastDetected;p++) links.push(p===1?base:base+'/~'+p);
        }
        links = links.filter((v,i,a)=>a.indexOf(v)===i);
        if (links.length > (settings.maxPagesCap||300)) links = links.slice(0, settings.maxPagesCap);

        let aggregated = [];
        let pagesProcessed = 0;
        let cardsProcessed = 0;
        setProgressText(0, links.length, 0, 0);

        for (const url of links) {
            pagesProcessed++;
            const parsed = await fetchAndParseReviews(url);
            parsed.forEach(p=>aggregated.push(p));
            cardsProcessed += parsed.length;
            setProgressText(pagesProcessed, links.length, cardsProcessed, '?');
            await new Promise(r=>setTimeout(r, 250));
        }
        if (!aggregated.length) {
            if (mergeBtn) mergeBtn.disabled=false; if (sortBtn) sortBtn.disabled=false; return;
        }

        const totalCards = aggregated.length;
        setProgressText(0, links.length, 0, totalCards);
        const items = aggregated.map((it,idx)=>({ html: it.html, metrics: it.metrics, index: idx }));
        sortArray(items, settings.primary, settings.secondary, settings.order);

        const frag = document.createDocumentFragment();
        items.forEach((it,idx)=>{
            const w = document.createElement('div');
            w.innerHTML = it.html;
            const node = w.firstElementChild;
            if (node) {
                frag.appendChild(node);
                setProgressText(links.length, links.length, idx+1, totalCards);
            }
        });

        try {
            const root = container;
            const keep = [];
            Array.from(root.children).forEach(ch=>{
                const isCard = isTopLevelCard(ch);
                if (!isCard) keep.push(ch);
            });
            while (root.firstChild) root.removeChild(root.firstChild);
            root.appendChild(frag);
            keep.forEach(n=>root.appendChild(n));
            const pag = document.querySelector('#book-reviews-pagination') || document.querySelector('.pagination') || document.querySelector('.page__pagination');
            if (pag) pag.style.display='none';
        } catch (e) { console.error('LLSorter merge insert error', e); }

        if (mergeBtn) mergeBtn.disabled=false; if (sortBtn) sortBtn.disabled=false;
        setProgressText(links.length, links.length, totalCards, totalCards);
        setTimeout(()=>{ const t=document.getElementById('ll-prog-text'); if(t) t.innerText=''; const b=document.getElementById('ll-prog-bar'); if(b) b.style.width='0%'; }, 1200);
    }

    /* ---------------- Logging ---------------- */
    function dumpLog() {
        console.log('LLSorter settings', settings);
        console.log('URL path', window.location.pathname);
        console.log('isOnCardListPage', isOnCardListPage());
        const cards = collectReviewElementsFromDOM();
        console.log('local cards count', cards.length);
        cards.slice(0,20).forEach((c,i)=>console.log('#'+i, { snippet:(c.textContent||'').slice(0,160), metrics: extractMetricsFromCard(c) }));
    }

    /* ---------------- Monitoring navigation and DOM changes ---------------- */
    let menuObserver = null;
    function tryAttachMenuObserver() {
        const menu = document.getElementById('menu');
        if (!menu || menuObserver) return;
        menuObserver = new MutationObserver(()=> showOverlayIfNeeded());
        menuObserver.observe(menu, { childList:true, subtree:true, attributes:true, characterData:true });
    }

    window.addEventListener('popstate', ()=> setTimeout(showOverlayIfNeeded, 120));
    window.addEventListener('hashchange', ()=> setTimeout(showOverlayIfNeeded, 120));
    document.addEventListener('click', e => {
        try {
            const a = e.target.closest && e.target.closest('a');
            if (!a) return;
            if (a.closest && a.closest('#menu')) setTimeout(showOverlayIfNeeded, 150);
        } catch (e) {}
    });

    let bodyObserverTimer = null;
    const bodyObserver = new MutationObserver(() => {
        tryAttachMenuObserver();
        if (bodyObserverTimer) clearTimeout(bodyObserverTimer);
        bodyObserverTimer = setTimeout(()=> {
            showOverlayIfNeeded();
            bodyObserverTimer = null;
        }, 80);
    });
    bodyObserver.observe(document.body, { childList:true, subtree:true });

    createOverlay();
    tryAttachMenuObserver();
    showOverlayIfNeeded();

    if (!window.llReviewSorter) {
        window.llReviewSorter = {
            dump: dumpLog,
            run: runLocalSort,
            mergeAll: mergeAllPagesToContinuousList,
            settings: settings,
            save: saveSettings
        };
    }

})();