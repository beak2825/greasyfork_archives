// ==UserScript==
// @name         LZT_Profile_Viewers_Analytics
// @namespace    MeloniuM/LZT
// @version      2.3
// @description  Аналитика просмотров профиля.
// @author       MeloniuM
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.6/dist/chart.umd.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558843/LZT_Profile_Viewers_Analytics.user.js
// @updateURL https://update.greasyfork.org/scripts/558843/LZT_Profile_Viewers_Analytics.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $('<style id="LZT_Profile_Viewers_Analytics_Style">').text(`
        .ViewsStats-button .icon {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20' stroke='rgb(140,140,140)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cpath d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'%3E%3C/path%3E%3Ccircle cx='12' cy='12' r='3'%3E%3C/circle%3E%3C/svg%3E");
        }
        .ViewsStats-button:hover .icon {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20' stroke='rgba(0, 186, 120, 1)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cpath d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'%3E%3C/path%3E%3Ccircle cx='12' cy='12' r='3'%3E%3C/circle%3E%3C/svg%3E");
        }  
    `).appendTo('head');

    /* =========================
       Utils / XenForo ajax
    ========================= */

    function xfAjax(url, data = {}) {
        return new Promise(resolve => {
            XenForo.ajax(url, data, resolve);
        });
    }

    function getProfileUserId() {
        return window.ThreadNotify?.channel?.split(":")[1] | null;
    }

    function viewersUrl(userId, page) {
        return `/members/${userId}/show-viewers?page=${page}`;
    }

    function isNoAccessResponse(res) {
        return res && Array.isArray(res.error);
    }

    function downloadFile(name, content, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    function exportJSON(records) {
        const data = records.map(r => ({
            userId: r.userId,
            name: r.name,
            timestamp: r.timestamp.toISOString()
        }));
        downloadFile(
            'profile_views.json',
            JSON.stringify(data, null, 2),
            'application/json'
        );
    }

    function exportCSV(records) {
        const header = 'userId,name,timestamp\n';
        const rows = records.map(r =>
            `${r.userId},"${r.name.replace(/"/g, '""')}",${r.timestamp.toISOString()}`
        ).join('\n');

        downloadFile(
            'profile_views.csv',
            header + rows,
            'text/csv;charset=utf-8'
        );
    }


    
    /* =========================
       HTML parsing
    ========================= */

    function extractUserIdFromAvatar(el) {
        if (!el || !el.classList) return null;
        const cls = [...el.classList].find(c => /^Av\d+s$/.test(c));
        return cls ? Number(cls.replace(/\D/g, '')) : null;
    }

    function parseHtml(html) {
        const $root = $(html);
        const out = [];

        $root.find('.viewersItem').each(function () {
            const $it = $(this);
            const avatarA = $it.find('.userAvatar a')[0];
            const name = $it.find('.username > span:not(.uniqUsernameIcon--custom)').first().text().trim();
            const timestamp = $it.find('.userTimeView .DateTime').attr('data-time');
            const date = new Date(parseInt(timestamp, 10) * 1000);
            out.push({
                userId: extractUserIdFromAvatar(avatarA),
                name: name,
                timestamp: date
            });
        });

        return out.filter(x => x.timestamp !== null);
    }


    /* =========================
       Fetch logic
    ========================= */

    async function fetchAllViews(userId, onProgress, overlay) {
        const first = await xfAjax(viewersUrl(userId, 1));

        if (isNoAccessResponse(first)) {
            return { error: first.error[0] };
        }

        const $first = $(first.templateHtml);
        const last = Number($first.find('.PageNav').data('last') || 1);

        let out = parseHtml(first.templateHtml);

        for (let p = 2; p <= last; p++) {
            if (!overlay.isOpened()) {
                return
            }
            // Пауза между запросами (~350ms)
            await new Promise(r => setTimeout(r, 350));

            const res = await xfAjax(viewersUrl(userId, p));
            if (isNoAccessResponse(res)) break;

            out = out.concat(parseHtml(res.templateHtml));

            if (onProgress) onProgress(p, last);
        }

        return { records: out };
    }

    /* =========================
    Analytics
    ========================= */

    function computeHourly(records) {
        const h = Array(24).fill(0);
        records.forEach(r => h[new Date(r.timestamp).getHours()]++);
        return h;
    }

    function computeWeekday(records) {
        const d = Array(7).fill(0);
        records.forEach(r => d[new Date(r.timestamp).getDay()]++);
        return d;
    }

    function heatmapMatrix(records) {
        const m = Array.from({ length: 7 }, () => Array(24).fill(0));
        records.forEach(r => {
            const dt = new Date(r.timestamp);
            m[dt.getDay()][dt.getHours()]++;
        });
        return m;
    }

    function movingAverage(series, w = 3) {
        return series.map((_, i) => {
            const s = series.slice(Math.max(0, i - w + 1), i + 1);
            return s.reduce((a, b) => a + b, 0) / s.length;
        });
    }

    function uniqueUsersPerDay(records) {
        const map = new Map();
        records.forEach(r => {
            const d = new Date(r.timestamp);
            d.setHours(0, 0, 0, 0);
            const k = d.getTime();
            if (!map.has(k)) map.set(k, new Set());
            map.get(k).add(r.userId);
        });
        return [...map.entries()]
            .sort((a, b) => a[0] - b[0])
            .map(([k, s]) => ({ day: k, unique: s.size }));
    }

    function median(arr) {
        const a = arr.filter(Boolean).sort((x, y) => x - y);
        if (!a.length) return 0;
        const m = Math.floor(a.length / 2);
        return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
    }

    function detectSpikes(hourly, factor = 3) {
        const med = median(hourly);
        return hourly
            .map((v, h) => v > med * factor ? { hour: h, value: v } : null)
            .filter(Boolean);
    }


    /* =========================
       UI / Overlay
    ========================= */

    function renderError($root, text) {
        $root.html(`<div class="error">${text}</div>`);
    }

    function renderAnalytics($root, records) {
        $root.empty();

        if (!records.length) {
            $root.text('Нет данных');
            return;
        }

        const hourly = computeHourly(records);
        const weekday = computeWeekday(records);
        const heat = heatmapMatrix(records);
        const ma = movingAverage(hourly, 3);
        const uniqueDay = uniqueUsersPerDay(records);
        const spikes = detectSpikes(hourly);

        /* ===== Summary ===== */
        $root.append(`
            <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:12px">
                <div>Всего: <b>${records.length}</b></div>
                <div>Уникальных: <b>${new Set(records.map(r => r.userId)).size}</b></div>
                <div>Повторных: <b>${records.length - new Set(records.map(r => r.userId)).size}</b></div>
            </div>
        `);

        const exportBox = $(`
            <div style="display:flex;gap:8px;margin-bottom:12px;align-items:center;">
                Экспорт:
                <a class="button button--primary export-json">JSON</a>
                <a class="button export-csv">CSV</a>
            </div>
        `);
        $root.append(exportBox);

        exportBox.find('.export-json').on('click', () => exportJSON(records));
        exportBox.find('.export-csv').on('click', () => exportCSV(records));


        /* ===== Hourly ===== */
        const cHour = canvas();
        $root.append(cHour);
        new Chart(cHour, {
            type: 'bar',
            data: {
                labels: [...Array(24).keys()],
                datasets: [{ label: 'По часам', data: hourly, backgroundColor: '#1C6E49' }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });

        $root.append('<hr style="margin:16px 0; border-color:#ccc">');

        /* ===== Moving Average ===== */
       // Определяем минимальный и максимальный час с ненулевыми значениями
        const nonZeroHours = hourly
            .map((v, i) => v > 0 ? i : -1)
            .filter(i => i >= 0);

        const minHour = Math.min(...nonZeroHours);
        const maxHour = Math.max(...nonZeroHours);

        // Обрезаем данные и метки
        const labels = [...Array(maxHour - minHour + 1).keys()].map(h => h + minHour);
        const dataFact = hourly.slice(minHour, maxHour + 1);
        const dataMA = ma.slice(minHour, maxHour + 1);

        const cMA = canvas();
        $root.append(cMA);
        $root.append('<hr style="margin:16px 0; border-color:#ccc">');
        new Chart(cMA, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    { label: 'Факт', data: dataFact, borderColor: '#228E5D', backgroundColor: 'rgba(76,175,80,0.3)' },
                    { label: 'MA(3)', data: dataMA, borderColor: '#e91e63', backgroundColor: 'rgba(233,30,99,0.2)' }
                ]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'Час' } },
                    y: { title: { display: true, text: 'Просмотры' } }
                }
            }
        });


        /* ===== Weekday ===== */
        const cDay = canvas();
        $root.append(cDay);
        $root.append('<hr style="margin:16px 0; border-color:#ccc">');
        new Chart(cDay, {
            type: 'bar',
            data: {
                labels: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
                datasets: [{ label: 'По дням', data: weekday, backgroundColor: '#1C6E49' }]
            }
        });

        /* ===== Unique per day ===== */
        const cUniq = canvas();
        $root.append(cUniq);
        $root.append('<hr style="margin:16px 0; border-color:#ccc">');
        new Chart(cUniq, {
            type: 'bar',
            data: {
                labels: uniqueDay.map(d => new Date(d.day).toLocaleDateString()),
                datasets: [{ label: 'Уникальные/день', data: uniqueDay.map(d => d.unique), backgroundColor: '#1C6E49' }]
            }
        });

        /* ===== Heatmap (table) ===== */
        const max = Math.max(...heat.flat(), 1);
        const tbl = $(`
            <table class="heatmap" style="
                width:100%;
                border-collapse: collapse;
                font-size:11px;
                margin-top:12px;
                table-layout: fixed;
            "></table>
        `);

        // Заголовок
        tbl.append('<tr><th style="border:1px solid #333; padding:2px">Д/Ч</th>' +
            [...Array(24).keys()].map(h =>
                `<th style="border:1px solid #333; padding:2px">${h}</th>`
            ).join('')
        + '</tr>');

        // Данные
        heat.forEach((row, d) => {
            const tr = $(`<tr><td style="border:1px solid #333; padding:2px"><b>${['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][d]}</b></td></tr>`);
            row.forEach(v => {
                const a = v ? Math.max(v / max, 0.05) : 0; // минимальная прозрачность 0.05
                tr.append(`
                    <td style="
                        border:1px solid #333;
                        text-align:center;
                        background: rgba(28,110,73,${a});
                        padding:2px
                    ">${v||''}</td>
                `);
            });
            tbl.append(tr);
        });

        $root.append(tbl);
        $root.append('<hr style="margin:16px 0; border-color:#ccc">');

        /* ===== Spikes ===== */
        const spikeBox = $('<div style="margin-top:12px"></div>');
        if (spikes.length) {
            spikes.forEach(s => spikeBox.append(`<div>Всплеск: ${s.hour}:00 — ${s.value}</div>`));
        } else {
            spikeBox.text('Аномалий не найдено');
        }
        $root.append('<h3>Аномалии</h3>', spikeBox);
    }


    function canvas(w = 800, h = 240) {
        return $(`<canvas width="${w}" height="${h}"></canvas>`)[0];
    }


    function injectButton($target, userId, username) {
        if (!!$target.find('.ViewsStats-button').length) {
            return
        }
        const $button = $(`
            <a class="button ViewsStats-button">
		        <span class="icon"></span>
                Аналитика просмотров
            </a>
        `);

        $target.append($button);

        $button.on('click', async function (ev) {
            ev.preventDefault();

            if (!$button.data('overlay')) {
                const $modal = $(`
                    <div class="sectionMain">
                        <h2 class="heading h1">Информация о просмотрах профиля ${username}</h2>
                        <div class="overlayContent" style="padding:15px">Загрузка…</div>
                    </div>
                `);

                XenForo.createOverlay(null, $modal, {
                    className: 'ViewsStats-modal',
                    trigger: $button,
                    severalModals: true
                });

                const overlay = $button.data('overlay');

                overlay.refresh = async function () {
                    const $root = this.getOverlay().find('.overlayContent');
                    $root.html(`
                        <div>Загрузка…</div>
                        <div style="border:1px solid #ccc;width:100%;height:12px;margin-top:8px">
                            <div class="progress-bar" style="width:0%;height:100%;background:#1c6e49db"></div>
                        </div>
                    `);
                    const $bar = $root.find('.progress-bar');

                    if (!userId) {
                        renderError($root, 'Не профиль пользователя');
                        return;
                    }

                    const result = await fetchAllViews(userId, (page, last) => {
                        const percent = Math.round((page / last) * 100);
                        $bar.css('width', percent + '%');
                        $root.find('div').first().text(`Загрузка страницы ${page} из ${last} (${percent}%)…`);
                    }, overlay);

                    if (!overlay.isOpened()) {
                        return;
                    }

                    if (result?.error) {
                        renderError($root, result.error);
                        return;
                    }

                    let records = result.records;
                    renderAnalytics($root, records);
                };

            }

            const overlay = $button.data('overlay');
            overlay.load();
            overlay.refresh();
        });
    }

    let profile_id = getProfileUserId();
    if (profile_id) {
        injectButton($('.profilePage .userContentLinks'), profile_id, $("#page_info_wrap .username[itemprop='name'] >").prop("outerHTML"));
    }

    $(document).on('XFOverlay', function(e){
        let $overlay = e.overlay.getOverlay();
        if (!$overlay.is('.memberCard')) return;
        let user_id = parseInt($overlay.find('.memberCardInner').attr('id').match(/\d+$/)[0], 10);
        let username = $overlay.find('.usernameAndStatus .username .username').prop("outerHTML");
        injectButton($overlay.find('.userContentLinks'),  user_id, username);
    });

})();
