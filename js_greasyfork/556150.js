// ==UserScript==
// @name         Shikimori Franchises
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Count anime franchises on Shikimori
// @author       Graf_NEET
// @license      MIT
// @match        https://shikimori.one/*/list/anime*
// @match        https://shikimori.me/*/list/anime*
// @match        https://shikimori.org/*/list/anime*
// @match        https://shikimori.rip/*/list/anime*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      raw.githubusercontent.com
// @connect      shikimori.one
// @downloadURL https://update.greasyfork.org/scripts/556150/Shikimori%20Franchises.user.js
// @updateURL https://update.greasyfork.org/scripts/556150/Shikimori%20Franchises.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/GRaf-NEET/franchises_counter/main/anime_franchises.json';
    const DEFAULT_DELAY_MS = 500;
    const MAX_FETCH_UNKNOWN = 0;

    function log(...args) { console.log('[franchises]', ...args); }
    function makeEl(tag, attrs = {}, html = '') {
        const el = document.createElement(tag);
        for (const k in attrs) {
            if (k === 'style') Object.assign(el.style, attrs[k]);
            else if (k.startsWith('on') && typeof attrs[k] === 'function') el.addEventListener(k.substring(2), attrs[k]);
            else el.setAttribute(k, attrs[k]);
        }
        el.innerHTML = html;
        return el;
    }
    function delay(ms) { return new Promise(res => setTimeout(res, ms)); }
    function gmFetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest(Object.assign({
                method: 'GET',
                url: url,
                responseType: options.responseType === 'text' ? 'text' : 'json',
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300) resolve(res);
                    else reject(new Error('HTTP ' + res.status));
                },
                onerror: (e) => reject(e),
                ontimeout: () => reject(new Error('timeout'))
            }, options));
        });
    }
    function downloadJSON(name, obj) {
        const s = JSON.stringify(obj, null, 2);
        const blob = new Blob([s], {type: 'application/json;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        GM_download({url, name, saveAs: true});
        setTimeout(()=>URL.revokeObjectURL(url), 10000);
    }

    async function getUserIdFromUsername(username) {
        try {
            const res = await gmFetch(`https://shikimori.one/api/users/${username}`, {responseType: 'json'});
            return (res.response && res.response.id) ? res.response.id : null;
        } catch(e) {
            console.error('Ошибка получения ID пользователя', e);
            return null;
        }
    }

    async function fetchUserRatesViaAPI(userId) {
        const watchedOnPageEl = document.querySelector('.b-link.always-active[data-id="completed"] span');
        const watchedOnPage = watchedOnPageEl ? parseInt(watchedOnPageEl.textContent.trim()) : 0;
        log('Всего просмотрено по странице:', watchedOnPage);

        const ratesUrl = "https://shikimori.one/api/v2/user_rates";
        const rates = [];
        const seen = new Set();
        let page = 1;
        let emptyStreak = 0;

        while (true) {
            const params = new URLSearchParams({
                user_id: userId,
                target_type: 'Anime',
                status: 'completed',
                page: page,
                limit: 100,
                order: 'updated'
            });

            insertFranchiseTablePlaceholder(`Получение user_rates... Страница ${page}, всего получено ${rates.length}`);
            try {
                const res = await gmFetch(`${ratesUrl}?${params.toString()}`, { responseType: 'json' });
                const ratesData = res.response || res.responseText || [];
                let newCount = 0;
                for (const r of ratesData) {
                    const aid = r.target_id;
                    if (aid && !seen.has(aid)) {
                        rates.push(r);
                        seen.add(aid);
                        newCount++;
                    }
                }

                if (newCount === 0) emptyStreak++;
                else emptyStreak = 0;

                log(`Страница ${page}: новых rates ${newCount}, всего уникальных ${rates.length}`);

                if ((watchedOnPage && rates.length >= watchedOnPage) || emptyStreak >= 3) break;

                page++;
                await delay(DEFAULT_DELAY_MS);
            } catch (e) {
                console.error('Ошибка API на странице', page, e);
                break;
            }
        }

        if (watchedOnPage && rates.length > watchedOnPage) rates.length = watchedOnPage;

        log('API user_rates фетч завершён, всего rates:', rates.length);
        return rates.sort((a,b)=> (a.target_id||0) - (b.target_id||0));
    }

    function extractAnimeIdsFromPage() {
        const ids = new Set();
        document.querySelectorAll('a[href*="/anime/"], a[href*="/animes/"]').forEach(a => {
            const m = a.href.match(/\/anime[s]?\/(\d+)/);
            if (m) ids.add(Number(m[1]));
        });
        document.querySelectorAll('[data-id]').forEach(el => { const v = el.getAttribute('data-id'); if (v && /^\d+$/.test(v)) ids.add(Number(v)); });
        return Array.from(ids).sort((a,b)=>a-b);
    }

    async function onFranchisesClick() {
        try {
            insertFranchiseTablePlaceholder('Загрузка franchises JSON с GitHub...');
            const res = await gmFetch(GITHUB_RAW_URL, { responseType: 'text' });
            const text = (res.responseText) ? res.responseText : JSON.stringify(res.response || {});
            const franchisesArray = JSON.parse(text);
            const idToFranchise = new Map();
            const idToRussian = new Map();
            franchisesArray.forEach(entry => {
                if (entry && entry.id) {
                    idToFranchise.set(Number(entry.id), entry.franchise ?? null);
                    if (entry.russian) idToRussian.set(Number(entry.id), entry.russian);
                }
            });

            const username = getUserFromPath();
            const userId = await getUserIdFromUsername(username);
            if (!userId) { insertFranchiseTablePlaceholder('Не удалось получить ID пользователя'); return; }

            const userRates = await fetchUserRatesViaAPI(userId);
            const apiIds = userRates.map(r=>r.target_id);

            let animeIds = apiIds;
            const watchedOnPageEl = document.querySelector('.b-link.always-active[data-id="completed"] span');
            const watchedOnPage = watchedOnPageEl ? parseInt(watchedOnPageEl.textContent.trim()) : 0;
            if (watchedOnPage && apiIds.length < watchedOnPage) {
                const pageIds = extractAnimeIdsFromPage();
                animeIds = Array.from(new Set([...pageIds, ...apiIds])).sort((a,b)=>a-b);
            }

            const aidToRate = new Map();
            userRates.forEach(r => { if (r && r.target_id) aidToRate.set(Number(r.target_id), r); });

            const unknownIds = animeIds.filter(aid => !idToFranchise.has(aid));
            const newEntries = [];
            if (unknownIds.length) {
                const doFetch = confirm(`Найдены ${unknownIds.length} неизвестных ID. Фетчить из API Shikimori?`);
                if (doFetch) {
                    const maxToFetch = MAX_FETCH_UNKNOWN > 0 ? Math.min(MAX_FETCH_UNKNOWN, unknownIds.length) : unknownIds.length;
                    for (let i=0;i<maxToFetch;i++) {
                        const aid = unknownIds[i];
                        try {
                            const ar = await gmFetch(`https://shikimori.one/api/animes/${aid}`, { responseType: 'json' });
                            const detail = ar.response;
                            const franchise_key = detail.franchise ?? null;
                            const russian_name = detail.russian || detail.name || `Unknown ${aid}`;
                            idToFranchise.set(aid, franchise_key);
                            idToRussian.set(aid, russian_name);
                            newEntries.push({id: aid, russian: russian_name, franchise: franchise_key});
                        } catch(e){ console.warn('Fetch failed', aid, e); }
                        await delay(DEFAULT_DELAY_MS);
                    }
                }
            }

            // grouping
            const franchiseToIds = new Map();
            const nullAnime = [];
            animeIds.forEach(aid => {
                const fk = idToFranchise.get(aid);
                const rn = idToRussian.get(aid) || `Unknown ${aid}`;
                if (fk === null || fk === undefined) nullAnime.push({id: aid, russian: rn});
                else {
                    const arr = franchiseToIds.get(fk) || [];
                    arr.push(aid);
                    franchiseToIds.set(fk, arr);
                }
            });

            // prepare display info: displayName -> { ids, count, avgScore, episodesSum, fk }
            const displayInfo = new Map();
            franchiseToIds.forEach((ids,fk)=>{
                if (ids.length) {
                    const minId = Math.min(...ids);
                    const displayName = idToRussian.get(minId) || `Unknown Franchise ${fk}`;

                    const scores = [];
                    let episodesSum = 0;
                    let episodesKnown = false;
                    ids.forEach(aid=>{
                        const rate = aidToRate.get(aid);
                        if (rate) {
                            if (typeof rate.score === 'number' && rate.score > 0) scores.push(rate.score);
                            if (typeof rate.episodes === 'number') { episodesSum += rate.episodes; episodesKnown = true; }
                        }
                    });
                    const avgScore = scores.length ? (scores.reduce((a,b)=>a+b,0)/scores.length) : null;

                    displayInfo.set(displayName, { ids, count: ids.length, avgScore, episodesSum: episodesKnown ? episodesSum : null, fk });
                }
            });

            const totalSeasons = animeIds.length;
            const totalFranchises = franchiseToIds.size + nullAnime.length;

            const stats = {
                displayInfo,
                animeIds,
                newEntries,
                nullAnime,
                totalSeasons,
                totalFranchises,
                aidToRate
            };

            insertFranchiseTable(stats, idToFranchise, idToRussian);
        } catch (err) {
            console.error(err);
            insertFranchiseTablePlaceholder('Ошибка: ' + (err.message||err));
        }
    }

    // UI
    function insertFranchiseTablePlaceholder(text) {
        let container = document.getElementById('franchise-table-tm');
        if (!container) {
            container = makeEl('div', {id:'franchise-table-tm', style:{margin:'16px 0'}});
            const parent = document.querySelector('.b-options-floated.mylist.mobile-desktop');
            if (parent) parent.insertAdjacentElement('afterend', container);
            else document.body.appendChild(container);
        }
        container.innerHTML = `<div class="subheadline m5">Франшизы</div><div style="padding:6px">${text}</div>`;
    }

    function insertFranchiseTable(stats, idToFranchise, idToRussian) {
        const container = document.getElementById('franchise-table-tm');
        container.innerHTML = '';

        // Subheadline
        container.appendChild(makeEl('div', {class:'subheadline m5'}, 'Франшизы'));

        // Table header: # | Название | Оценка | Эпизоды | Кол-во
        const table = makeEl('table', {class:'b-table list-lines', style:{width:'100%', marginTop:'8px'}});
        table.innerHTML = `
            <thead>
                <tr>
                    <th class="index">#</th>
                    <th class="name order-control" data-order="name" title="Упорядочить по названию">Название</th>
                    <th class="num order-control" data-order="rate_score" title="Упорядочить по оценке">Оценка</th>
                    <th class="num order-control" data-order="episodes" title="Упорядочить по эпизодам">Эпизоды</th>
                    <th class="num order-control" data-order="count" title="Кол-во просмотренных в франшизе">Кол-во</th>
                </tr>
                <tr class="border"><th colspan="5"></th></tr>
            </thead>
        `;
        const tbody = makeEl('tbody', {class:'entries'});

        // С франшизой
        if (stats.displayInfo && stats.displayInfo.size) {
            const trHeader = makeEl('tr', {class:'group-header'}, `<td colspan="5"><b>С франшизой</b></td>`);
            tbody.appendChild(trHeader);

            // convert to array and sort by count desc (like before)
            const arr = Array.from(stats.displayInfo.entries()).sort((a,b)=> b[1].count - a[1].count);
            arr.forEach(([displayName, info], idx) => {
                const firstAnimeId = info.ids.length ? info.ids[0] : 0;
                const avgScore = info.avgScore !== null ? (Math.round(info.avgScore * 100) / 100).toFixed(2) : '—';
                const episodesText = info.episodesSum !== null ? info.episodesSum : '—';
                const countText = info.count;

                const tr = makeEl('tr', {class:'user_rate'}, '');
                tr.innerHTML = `<td class="index"><span>${idx+1}</span></td>` +
                               `<td class="name"><a class="tooltipped" data-predelay="500" href="https://shikimori.one/animes/${firstAnimeId}" target="_blank"><span class="name-ru">${escapeHtml(displayName)}</span></a></td>` +
                               `<td class="num hoverable"><span class="current-value">${avgScore}</span></td>` +
                               `<td class="num hoverable"><span class="current-value">${episodesText}</span></td>` +
                               `<td class="num"><span>${countText}</span></td>`;
                tbody.appendChild(tr);
            });
        }

        // Без франшизы (отдельные аниме)
        if (stats.nullAnime && stats.nullAnime.length) {
            const trHeader = makeEl('tr', {class:'group-header'}, `<td colspan="5"><b>Без франшизы</b></td>`);
            tbody.appendChild(trHeader);

            stats.nullAnime.forEach((item, idx) => {
                const rate = stats.aidToRate.get(item.id) || {};
                const score = (typeof rate.score === 'number' && rate.score > 0) ? rate.score.toFixed ? Number(rate.score).toFixed(2) : rate.score : '—';
                const episodes = (typeof rate.episodes === 'number') ? rate.episodes : '—';
                const countText = 1;

                const tr = makeEl('tr', {class:'user_rate selectable editable'}, '');
                tr.innerHTML = `<td class="index"><span>${idx+1}</span></td>` +
                               `<td class="name"><a class="tooltipped" data-predelay="500" href="https://shikimori.one/animes/${item.id}" target="_blank"><span class="name-ru">${escapeHtml(item.russian)}</span></a></td>` +
                               `<td class="num hoverable"><span class="current-value">${score}</span></td>` +
                               `<td class="num hoverable"><span class="current-value">${episodes}</span></td>` +
                               `<td class="num"><span>${countText}</span></td>`;
                tbody.appendChild(tr);
            });
        }

        table.appendChild(tbody);
        container.appendChild(table);

        // Summary
        const summaryDiv = makeEl('div', {class: 'summary list lines', style:{marginTop:'8px'}},
            `Сезоны: <span class="stat-value">${stats.totalSeasons}</span> ` +
            `Франшизы: <span class="stat-value">${stats.totalFranchises}</span>`
        );
        container.appendChild(summaryDiv);

        // Buttons
        const btns = makeEl('div', {style:{marginTop:'12px'}});
        const dlStats = makeEl('button', {}, 'Скачать статистику (JSON)');
        dlStats.addEventListener('click', ()=>downloadJSON(`${getUserFromPath()||'user'}_franchises.json`, {stats}));
        const dlIds = makeEl('button', {style:{marginLeft:'8px'}}, 'Скачать ID (txt)');
        dlIds.addEventListener('click', ()=>{
            const txt = stats.animeIds.join('\n');
            const url = URL.createObjectURL(new Blob([txt], {type:'text/plain;charset=utf-8'}));
            GM_download({url, name:`${getUserFromPath()||'user'}.txt`, saveAs:true});
            setTimeout(()=>URL.revokeObjectURL(url),10000);
        });
        const dlNew = makeEl('button', {style:{marginLeft:'8px'}}, 'Скачать new_franchises (JSON)');
        dlNew.addEventListener('click', ()=>{
            if (!stats.newEntries.length) { alert('Нет новых записей.'); return; }
            downloadJSON(`new_franchises_${getUserFromPath()||'user'}.json`, stats.newEntries);
        });
        btns.appendChild(dlStats); btns.appendChild(dlIds); btns.appendChild(dlNew);
        container.appendChild(btns);
    }

    function getUserFromPath() {
        const m = location.pathname.match(/^\/([^\/]+)\/list\/anime/);
        return m ? m[1] : null;
    }

    function insertButton() {
        const container = document.querySelector('.b-options-floated.mylist.mobile-desktop');
        if (!container) return;
        if (container.querySelector('#franchise-btn-tm')) return;

        const btn = makeEl('a', { id: 'franchise-btn-tm', href: '#', 'class': 'b-link always-active', style: { marginLeft: '6px', cursor: 'pointer' } }, 'Франшизы (TM)');
        btn.addEventListener('click', e => { e.preventDefault(); onFranchisesClick(); });
        container.appendChild(btn);
        log('Кнопка вставлена.');
    }

    function tryInsertButtonPeriodically() {
        insertButton();
        const observer = new MutationObserver(()=>insertButton());
        observer.observe(document.body, {childList:true, subtree:true});
    }

    tryInsertButtonPeriodically();

    // Utility
    function escapeHtml(s) {
        if (s === null || s === undefined) return '';
        return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
    }

})();
