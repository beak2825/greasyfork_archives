// ==UserScript==
// @name         SFH - Student Fair Hours + Skip Counter (Light/Dark)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Массовое выставление и удаление прогулов + статистика + счетчик прогулов сверху. Поддержка светлой и тёмной тем.
// @author       AbrikosV + Angelina Maseevskaya (доработка)
// @match        https://system.fgoupsk.ru/student/?mode=ucheba&act=group&act2=prog*
// @grant        GM_xmlhttpRequest
// @connect      system.fgoupsk.ru
// @downloadURL https://update.greasyfork.org/scripts/559929/SFH%20-%20Student%20Fair%20Hours%20%2B%20Skip%20Counter%20%28LightDark%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559929/SFH%20-%20Student%20Fair%20Hours%20%2B%20Skip%20Counter%20%28LightDark%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REASONS = {
        '': 'нет',
        '1': 'мед.справка',
        '2': 'общественная деятельность',
        '3': 'дежурство',
        '4': 'объяснительная'
    };

    // === ОПРЕДЕЛЕНИЕ ТЕМЫ ===
    function detectTheme() {
        const html = document.documentElement;
        const body = document.body;

        const darkClasses = ['dark', 'theme-dark', 'night', 'dark-mode', 'theme_night'];
        const lightClasses = ['light', 'theme-light', 'day', 'light-mode'];

        const hasDark = darkClasses.some(cls =>
            html.classList.contains(cls) || body.classList.contains(cls)
        );
        const hasLight = lightClasses.some(cls =>
            html.classList.contains(cls) || body.classList.contains(cls)
        );

        if (hasDark) return 'dark';
        if (hasLight) return 'light';

        // Fallback: системная тема
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // === ПАЛИТРЫ ===
    function getThemeStyles(theme) {
        return theme === 'dark' ? {
            bgPanel: '#2d2d2d',
            borderPanel: '#555',
            text: '#e0e0e0',
            inputBg: '#3a3a3a',
            inputBorder: '#555',
            inputText: '#f0f0f0',
            placeholder: '#aaa',
            btnMarkBg: '#2e7d32',
            btnMarkHover: '#1b5e20',
            btnRemoveBg: '#c62828',
            btnRemoveHover: '#b71c1c',
            statusInfoBg: '#212121',
            statusSuccessBg: '#1b5e20',
            statusErrorBg: '#b71c1c',
            resultBg: '#1e3a5f',
            resultText: '#bbdefb',
            counterBg: '#1e1e1e',
            counterBorder: '#444',
            counterText: '#e0e0e0'
        } : {
            bgPanel: '#ffffff',
            borderPanel: '#4CAF50',
            text: '#333',
            inputBg: '#fff',
            inputBorder: '#ddd',
            inputText: '#333',
            placeholder: '#999',
            btnMarkBg: '#4CAF50',
            btnMarkHover: '#388E3C',
            btnRemoveBg: '#D32F2F',
            btnRemoveHover: '#C62828',
            statusInfoBg: '#e3f2fd',
            statusSuccessBg: '#e8f5e9',
            statusErrorBg: '#ffebee',
            resultBg: '#e3f2fd',
            resultText: '#1565c0',
            counterBg: '#fff',
            counterBorder: '#036',
            counterText: '#000'
        };
    }

    // === СОЗДАНИЕ ИНТЕРФЕЙСА ===
    function createUI() {
        const theme = detectTheme();
        const s = getThemeStyles(theme);

        const panel = document.createElement('div');
        panel.id = 'sfh-panel';
        panel.style.cssText = `
            position: fixed;
            right: 20px;
            top: 80px;
            width: 340px;
            background: ${s.bgPanel};
            border: 2px solid ${s.borderPanel};
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: Arial, sans-serif;
            color: ${s.text};
        `;

        panel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: ${theme === 'dark' ? '#81c784' : '#4CAF50'}; font-size: 18px;">📋 SFH - Прогулы</h3>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; font-size: 13px;">Студенты:</label>
                <input type="text" id="sfh-students" placeholder="1,3,5 или 1-10 или all"
                    style="width: 100%; padding: 8px; border: 1px solid ${s.inputBorder}; border-radius: 5px; font-size: 13px; background: ${s.inputBg}; color: ${s.inputText};">
                <small style="color: ${s.placeholder}; font-size: 11px;">Примеры: all, 1-5, 1,3,7</small>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; font-size: 13px;">Пары/часы:</label>
                <input type="text" id="sfh-pairs" placeholder="1 или 1.1 или 1-4"
                    style="width: 100%; padding: 8px; border: 1px solid ${s.inputBorder}; border-radius: 5px; font-size: 13px; background: ${s.inputBg}; color: ${s.inputText};">
                <small style="color: ${s.placeholder}; font-size: 11px;">1.1 = 1 пара 1 час, 1-4 = все пары 1-4</small>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; font-size: 13px;">Причина:</label>
                <select id="sfh-reason"
                    style="width: 100%; padding: 8px; border: 1px solid ${s.inputBorder}; border-radius: 5px; font-size: 13px; background: ${s.inputBg}; color: ${s.inputText};">
                    <option value="">нет</option>
                    <option value="1">мед.справка</option>
                    <option value="2">общественная деятельность</option>
                    <option value="3">дежурство</option>
                    <option value="4">объяснительная</option>
                </select>
            </div>
            <button id="sfh-mark-btn" style="width:100%; margin-bottom:7px; padding: 12px; background: ${s.btnMarkBg}; color: white; border: none; border-radius: 5px; font-size: 14px; font-weight: bold; cursor: pointer;">
                ✅ Выставить прогулы
            </button>
            <button id="sfh-remove-btn" style="width:100%; padding: 12px; background: ${s.btnRemoveBg}; color: white; border: none; border-radius: 5px; font-size: 14px; font-weight: bold; cursor: pointer;">
                ❌ Удалить часы
            </button>
            <div id="sfh-status" style="margin-top: 15px; padding: 10px; border-radius: 5px; font-size: 12px; display: none;"></div>
            <div id="sfh-result" style="margin-top: 9px; padding: 8px; border-radius: 4px; font-size: 13px; font-weight: bold; display: none;"></div>
        `;

        document.body.appendChild(panel);

        // Динамические стили (hover, состояния)
        let style = document.createElement('style');
        style.id = 'sfh-theme-style';
        style.textContent = `
            #sfh-mark-btn:hover { background: ${s.btnMarkHover} !important; }
            #sfh-remove-btn:hover { background: ${s.btnRemoveHover} !important; }
            #sfh-status.info { background: ${s.statusInfoBg}; color: ${theme === 'dark' ? '#90caf9' : '#1565c0'}; }
            #sfh-status.success { background: ${s.statusSuccessBg}; color: ${theme === 'dark' ? '#a5d6a7' : '#2e7d32'}; }
            #sfh-status.error { background: ${s.statusErrorBg}; color: ${theme === 'dark' ? '#ef9a9a' : '#c62828'}; }
            #sfh-result { background: ${s.resultBg}; color: ${s.resultText}; }
        `;
        document.head.appendChild(style);

        // === Обработчики ===
        document.getElementById('sfh-mark-btn').onclick = handleMarkAbsences;
        document.getElementById('sfh-remove-btn').onclick = handleRemoveAbsences;

        // Запуск счётчика
        setTimeout(showSkipCounter, 1500);
        observeTableMutations();
    }

    // === СЧЁТЧИК ПРОГУЛОВ ===
    function countSkippers() {
        const rows = document.querySelectorAll('table.table-prog tbody tr');
        let skipCount = 0;
        rows.forEach(row => {
            if (row.querySelector('td.danger, td.success')) skipCount++;
        });
        return skipCount;
    }

    function showSkipCounter() {
        const theme = detectTheme();
        const s = getThemeStyles(theme);
        let skipDiv = document.getElementById('skip-counter-widget');
        if (!skipDiv) {
            skipDiv = document.createElement('div');
            skipDiv.id = 'skip-counter-widget';
            skipDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 20px;
                z-index: 10001;
                padding: 10px 18px;
                background: ${s.counterBg};
                border: 2px solid ${s.counterBorder};
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.13);
                font-size: 16px;
                font-weight: bold;
                color: ${s.counterText};
            `;
            document.body.appendChild(skipDiv);
        }
        skipDiv.textContent = `Студентов с прогулом: ${countSkippers()}`;
    }

    function observeTableMutations() {
        const table = document.querySelector('table.table-prog tbody');
        if (!table) return;
        const obs = new MutationObserver(showSkipCounter);
        obs.observe(table, { childList: true, subtree: true });
    }

    // === ЛОГИКА ПАРСИНГА И ОТПРАВКИ ===
    function parseSelection(input, maxItems) {
        const sel = new Set();
        if (!input.trim()) return sel;
        const parts = input.replace(/[,;]/g, ' ').split(/\s+/).filter(x => x);
        for (const p of parts) {
            if (p === 'all' || p === 'все' || p === '0') {
                for (let i = 1; i <= maxItems; i++) sel.add(i);
            } else if (p.includes('-')) {
                const [a, b] = p.split('-').map(Number);
                if (!isNaN(a) && !isNaN(b)) for (let i = a; i <= b; i++) sel.add(i);
            } else if (p.includes('.')) {
                const [pair, hour] = p.split('.').map(Number);
                if (!isNaN(pair) && !isNaN(hour)) sel.add({ pair, hour });
            } else {
                const n = parseInt(p);
                if (!isNaN(n) && n >= 1 && n <= maxItems) sel.add(n);
            }
        }
        return sel;
    }

    function parseStudents() {
        const students = [];
        const rows = document.querySelectorAll('table.table-prog tbody tr');
        rows.forEach((row, idx) => {
            const cols = row.querySelectorAll('td');
            if (cols.length < 3) return;
            const fio = cols[1].textContent.trim();
            const hours = [];
            for (let i = 2; i < cols.length; i++) {
                const cell = cols[i];
                const nb = cell.getAttribute('data-nb');
                if (nb) {
                    try {
                        const h = JSON.parse(nb);
                        h.alreadyNb = cell.hasAttribute('data-params');
                        hours.push(h);
                    } catch (e) { }
                }
            }
            students.push({ idx: idx + 1, fio, hours });
        });
        return students;
    }

    function groupHoursByPair(hours) {
        const pairs = [];
        let cur = null;
        for (const h of hours) {
            if (!cur || cur[0].zid !== h.zid) {
                cur = [];
                pairs.push(cur);
            }
            cur.push(h);
        }
        return pairs;
    }

    function getSelectedHours(pairs, sel) {
        const res = [];
        for (const item of sel) {
            if (typeof item === 'number') {
                const i = item - 1;
                if (i >= 0 && i < pairs.length) res.push(...pairs[i]);
            } else if (item.pair && item.hour) {
                const i = item.pair - 1;
                if (i >= 0 && i < pairs.length) {
                    const pair = pairs[i];
                    const h = item.hour - 1;
                    if (h >= 0 && h < pair.length) res.push(pair[h]);
                }
            }
        }
        return res;
    }

    function sendMark(url, h, reason, action) {
        return new Promise(resolve => {
            const fd = new FormData();
            fd.append('userid', h.userid);
            fd.append('zid', h.zid);
            fd.append('hour', h.hour);
            if (action === 'remove') {
                fd.append('type', '0');
                fd.append('reason', '');
            } else {
                fd.append('nb', 'on');
                fd.append('type', reason);
                fd.append('reason', '');
            }
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                data: fd,
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                onload: r => resolve(r.status === 200),
                onerror: () => resolve(false)
            });
        });
    }

    async function handleMarkAbsences() { await markOrRemoveAbsences('mark'); }
    async function handleRemoveAbsences() { await markOrRemoveAbsences('remove'); }

    async function markOrRemoveAbsences(action) {
        const studentsInput = document.getElementById('sfh-students').value;
        const pairsInput = document.getElementById('sfh-pairs').value;
        const reason = document.getElementById('sfh-reason').value;

        const allStuds = parseStudents();
        if (!allStuds.length) return showStatus('❌ Студенты не найдены', 'error');

        const studSel = parseSelection(studentsInput, allStuds.length);
        if (!studSel.size) return showStatus('❌ Не выбраны студенты', 'error');

        const selected = allStuds.filter(s => Array.from(studSel).some(x => typeof x === 'number' && x === s.idx));
        if (!selected.length) return showStatus('❌ Не выбраны студенты', 'error');

        const tasks = [];
        const url = location.href;

        for (const s of selected) {
            const pairs = groupHoursByPair(s.hours);
            const pairSel = parseSelection(pairsInput, pairs.length);
            const hours = getSelectedHours(pairs, pairSel);
            for (const h of hours) tasks.push({ student: s.fio, hour: h, idx: s.idx });
        }

        if (!tasks.length) return showStatus('❌ Нет заданий для выполнения', 'error');

        const btn1 = document.getElementById('sfh-mark-btn');
        const btn2 = document.getElementById('sfh-remove-btn');
        btn1.disabled = true;
        btn2.disabled = true;

        showStatus(`⏳ Операция... (0/${tasks.length})`, 'info');
        document.getElementById('sfh-result').style.display = 'none';

        let done = 0, ok = 0;
        const affected = new Set();

        for (const t of tasks) {
            const res = await sendMark(url, t.hour, reason, action);
            done++;
            if (res) { ok++; affected.add(t.idx); }
            showStatus(`⏳ Операция... (${done}/${tasks.length})`, 'info');
            await new Promise(r => setTimeout(r, 100));
        }

        btn1.disabled = false;
        btn2.disabled = false;
        showStatus(`✅ Готово! Успешно: ${ok}/${tasks.length}`, 'success');

        if (affected.size) {
            const el = document.getElementById('sfh-result');
            el.textContent = `Студентов с отметками: ${affected.size}`;
            el.style.display = 'block';
        }

        setTimeout(showSkipCounter, 1600);
        setTimeout(() => location.reload(), 2100);
    }

    function showStatus(msg, type) {
        const el = document.getElementById('sfh-status');
        el.textContent = msg;
        el.className = type;
        el.style.display = 'block';
    }

    // === ЗАПУСК ===
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

    // === (опционально) автообновление при смене темы ===
    const themeObserver = new MutationObserver(() => {
        const newTheme = detectTheme();
        const cur = document.body.dataset.sfhTheme;
        if (cur !== newTheme) {
            document.body.dataset.sfhTheme = newTheme;
            // Пересоздаём UI
            ['#sfh-panel', '#skip-counter-widget', '#sfh-theme-style']
                .forEach(id => { const el = document.querySelector(id); if (el) el.remove(); });
            createUI();
        }
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();