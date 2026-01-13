// ==UserScript==
// @name         CRM Calls Tracker
// @namespace    http://tampermonkey.net/
// @version      8
// @description  Дополнение к ЦРМ в виде статистики + мотивационные уведомления
// @author       voodoo_lT
// @match        https://hgh03.mamoth.club/app/*
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/562454/CRM%20Calls%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/562454/CRM%20Calls%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STATUS_CONFIG = [
        { name: 'Не дозвон',        color: '#39a7bd' },
        { name: 'Срез на 1 минуте',  color: '#7f17ff' },
        { name: 'Срез на паспорте',  color: '#5100b5' },
        { name: 'Компания',          color: '#dc3545' },
        { name: 'Умник',             color: '#b32b6f' },
        { name: 'Молодой',           color: '#dc3545' },
        { name: 'Третьи лица',       color: '#5000b4' },
        { name: 'Фрод',              color: '#0c8ca6' },
        { name: 'Связь',             color: '#002185' },
        { name: 'Списали',           color: '#008f3c' },
        { name: 'Не существует',     color: '#918900' },
        { name: 'Удалить',           color: '#db3545' },
        { name: 'Взял паспорт',      color: '#00ff04' },
        { name: 'Передать',          color: '#a6a6a6' },
        { name: 'Перезвон',          color: '#a6a6a6' }
    ];

    const STATUS_COLORS = Object.fromEntries(STATUS_CONFIG.map(item => [item.name, item.color]));
    const STATUS_NAMES  = STATUS_CONFIG.map(item => item.name);

    let managerKey      = 'UNKNOWN_MANAGER';
    let currentStatsKey = 'stats_UNKNOWN_MANAGER';
    let stats           = {};
    let currentDayKey   = '';
    let isCollapsed     = GM_getValue('crm_tracker_collapsed', false);
    let animationInProgress = false;

    function updateManagerKey() {
        const labelEl = document.querySelector('.dropdown-toggle .label');
        if (labelEl) {
            const name = labelEl.textContent.trim();
            if (name && name.length > 0 && name !== managerKey) {
                managerKey = name;
                currentStatsKey = 'stats_' + name.replace(/\s+/g, '*');
                currentDayKey = 'currentDay*' + name;
                console.log(`Менеджер определён: ${managerKey}`);

                let storedDay = GM_getValue(currentDayKey, '');
                stats = GM_getValue(currentStatsKey, {});

                const today = getTodayKey();
                if (storedDay !== today) {
                    stats = {};
                    STATUS_NAMES.forEach(n => stats[n] = 0);
                    GM_setValue(currentStatsKey, stats);
                    GM_setValue(currentDayKey, today);

                    // Сбрасываем счётчики уведомлений при смене дня
                    lastPassportCount = 0;
                    lastCallCheckMilestone = 0;
                }

                updateWidget();
                return true;
            }
        }
        return false;
    }

    function getTodayKey() {
        const d = new Date(Date.now() + 3 * 60 * 60 * 1000);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }

    function checkDayChange() {
    if (!managerKey || managerKey === 'UNKNOWN_MANAGER') return;

    const today = getTodayKey();
    const storedDay = GM_getValue(currentDayKey, '');

    if (storedDay !== today) {
        console.log('📅 Наступили новые сутки — сбрасываем статистику');

        stats = {};
        STATUS_NAMES.forEach(name => stats[name] = 0);

        GM_setValue(currentStatsKey, stats);
        GM_setValue(currentDayKey, today);

        // Сброс счётчиков уведомлений
        lastPassportCount = 0;
        lastCallCheckMilestone = 0;
        shownReminders = [];
        GM_setValue('shown_reminders_today', []);
        GM_setValue('last_reminder_day', today);

        updateWidget();
    }

    }
    function getTotal() {
        return Object.values(stats).reduce((a, b) => a + b, 0);
    }

    function resetTodayStats() {
        if (confirm(`Сбросить статистику за сегодня для ${managerKey}?`)) {
            stats = {};
            STATUS_NAMES.forEach(name => stats[name] = 0);
            GM_setValue(currentStatsKey, stats);

            // Сбрасываем счётчики уведомлений
            lastPassportCount = 0;
            lastCallCheckMilestone = 0;

            updateWidget();
        }
    }

    let lastUpdateTime = 0;
    function updateStats(statusName) {
        const now = Date.now();
        if (now - lastUpdateTime < 200) return;
        lastUpdateTime = now;

        if (STATUS_NAMES.includes(statusName)) {
            const oldValue = stats[statusName] || 0;
            stats[statusName] = oldValue + 1;
            GM_setValue(currentStatsKey, stats);

            // Проверяем мотивационные уведомления
            checkMotivationalNotifications(statusName, oldValue);

            setTimeout(updateWidget, 50);
        }
    }

    // Проверка и показ мотивационных уведомлений
    function checkMotivationalNotifications(statusName, oldValue) {
        const total = getTotal();
        const passportCount = stats['Взял паспорт'] || 0;
        const passportCutCount = stats['Срез на паспорте'] || 0;
        const noAnswerCount = stats['Не дозвон'] || 0;

        // 1. Уведомление при увеличении "Взял паспорт"
        if (statusName === 'Взял паспорт' && passportCount > lastPassportCount) {
            setTimeout(() => {
                alert(getRandomMessage(successMessages));
            }, 300);
            lastPassportCount = passportCount;
        }

        // 2. Проверки после 100 звонков
        if (total >= 100) {
            const passportCutPercent = (passportCutCount / total) * 100;
            const noAnswerPercent = (noAnswerCount / total) * 100;

            // 2a. Проверка на низкую конверсию (каждые 50 звонков)
            if (Math.floor(total / 50) > lastCallCheckMilestone) {
                lastCallCheckMilestone = Math.floor(total / 50);

                if (passportCutPercent > 5 && passportCount <= 3) {
                    setTimeout(() => {
                        alert(getRandomMessage(wakeUpMessages));
                    }, 300);
                }
            }

            // 2b. Проверка на высокий процент недозвонов (один раз при достижении)
            const noAnswerCheckKey = 'no_answer_alert_shown_' + getTodayKey();
            if (noAnswerPercent > 55 && !GM_getValue(noAnswerCheckKey, false)) {
                setTimeout(() => {
                    alert("Что-то не так с дозвоном, подойди к айти!");
                    GM_setValue(noAnswerCheckKey, true);
                }, 300);
            }
        }
    }

    // ── Создание виджета ────────────────────────────────────────────────
    function createWidget() {
        if (document.getElementById('calls-tracker-small')) return;

        const widget = document.createElement('div');
        widget.id = 'calls-tracker-small';
        if (isCollapsed) widget.classList.add('collapsed');

        widget.innerHTML = `
            <div class="header">
                <span>Статистика <span id="manager-name">${managerKey}</span></span>
                <div class="header-buttons">
                    <button id="screenshot-reminder" title="Напоминание о скриншоте">📸</button>
                    <button id="toggle-collapse" title="Свернуть / развернуть">${isCollapsed ? '⬆' : '⬇'}</button>
                    <button id="reset-btn" title="Сбросить статистику за сегодня">🗑</button>
                </div>
            </div>
            <div class="body-content">
                <div class="pie-container">
                    <div class="pie" id="pie-chart"></div>
                </div>
                <div class="legend" id="legend"></div>
                <div class="total">Всего: <b id="total-count">0</b></div>
            </div>
        `;

        document.body.appendChild(widget);

        const style = document.createElement('style');
        style.textContent = `
            #calls-tracker-small {
                position: fixed;
                bottom: 16px;
                right: 16px;
                width: 260px;
                background: rgba(20, 20, 38, 0.96);
                color: #f0f0ff;
                border-radius: 12px;
                box-shadow: 0 6px 24px rgba(0,0,0,0.65);
                font-family: system-ui, sans-serif;
                font-size: 11.5px;
                z-index: 999999;
                backdrop-filter: blur(8px);
                border: 1px solid rgba(110,130,240,0.2);
                overflow: hidden;
                transition:
                    max-height 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
                    height 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
                    opacity 0.4s ease;
            }
            #calls-tracker-small.collapsed {
                max-height: 42px !important;
                height: 42px !important;
                opacity: 1;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 14px;
                background: rgba(0,0,0,0.18);
                font-weight: 600;
                font-size: 13px;
                color: #d0d0ff;
            }
            .header-buttons {
                display: flex;
                gap: 8px;
            }
            #toggle-collapse, #reset-btn, #screenshot-reminder {
                width: 24px;
                height: 24px;
                border: none;
                border-radius: 50%;
                background: rgba(255,255,255,0.07);
                color: #aaaaff;
                font-size: 15px;
                cursor: pointer;
                opacity: 0.8;
                transition: all 0.18s;
            }
            #toggle-collapse:hover, #reset-btn:hover, #screenshot-reminder:hover {
                opacity: 1;
                background: rgba(255,255,255,0.16);
                color: white;
            }
            #screenshot-reminder {
                font-size: 13px;
            }
            #reset-btn {
                display: none;
            }
            .body-content {
                padding: 12px 14px;
                opacity: 1;
                transform: translateY(0);
                transition:
                    opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) 0.05s,
                    transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) 0.05s;
            }
            #calls-tracker-small.collapsed .body-content {
                opacity: 0;
                transform: translateY(-16px);
                transition:
                    opacity 0.32s ease,
                    transform 0.32s ease;
            }
            .pie-container {
                width: 200px;
                height: 200px;
                margin: 8px auto 16px;
            }
            .pie {
                width: 100%;
                height: 100%;
                border-radius: 100%;
                box-shadow:
                    inset 0 0 40px 5px rgba(0,0,0,0.5),
                    inset 0 0 60px 30px rgba(0,0,0,0.35);
                transition:
                    transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1),
                    background 0.5s ease;
                position: relative;
            }
            .pie::before {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: 100%;
                background: inherit;
                transition:
                    opacity 0.55s ease,
                    background 0.5s ease;
                opacity: 0;
            }
            .pie.highlighting {
                transform: scale(1.08);
            }
            .pie.highlighting::before {
                opacity: 1;
                filter: brightness(1.15);
            }
            .legend {
                display: flex;
                flex-direction: column;
                gap: 6px;
                margin-bottom: 10px;
            }
            .legend-item {
                display: flex;
                align-items: center;
                gap: 9px;
                transition: opacity 0.45s ease;
                cursor: pointer;
                font-size: 11.8px;
            }
            .legend-item.dimmed {
                opacity: 0.25;
            }
            .legend-item.active {
                opacity: 1;
            }
            .legend-color {
                width: 14px;
                height: 14px;
                border-radius: 4px;
                flex-shrink: 0;
                transition:
                    transform 0.35s ease,
                    box-shadow 0.35s ease;
            }
            .legend-item.active .legend-color {
                transform: scale(1.15);
                box-shadow: 0 0 8px currentColor;
            }
            .legend-text {
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .legend-count {
                font-weight: 600;
                min-width: 65px;
                text-align: right;
                color: #e8e8ff;
            }
            .total {
                text-align: center;
                font-size: 13px;
                font-weight: 500;
                margin-top: 6px;
            }
            /* Скрываем кнопку ручного скриншота */
            #screenshot-reminder {
                display: none !important;
            }

            /* Скрываем кнопку очистки статистики */
            #reset-btn {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        document.getElementById('toggle-collapse').addEventListener('click', toggleCollapse);
        document.getElementById('reset-btn').addEventListener('click', resetTodayStats);
        document.getElementById('screenshot-reminder').addEventListener('click', showScreenshotReminder);

        setTimeout(adjustHeight, 50);

        // Запускаем систему напоминаний
        initScreenshotReminders();
    }

    function toggleCollapse() {
        const panel = document.getElementById('calls-tracker-small');
        if (!panel) return;

        isCollapsed = !isCollapsed;
        GM_setValue('crm_tracker_collapsed', isCollapsed);

        animationInProgress = true;

        panel.classList.toggle('collapsed', isCollapsed);
        document.getElementById('toggle-collapse').textContent = isCollapsed ? '⬆' : '⬇';

        adjustHeight();

        setTimeout(() => {
            animationInProgress = false;
            resetHighlight();
        }, 410);
    }

    function adjustHeight() {
        const panel = document.getElementById('calls-tracker-small');
        if (!panel) return;

        if (isCollapsed) {
            panel.style.maxHeight = '42px';
            panel.style.height = '42px';
            return;
        }

        panel.style.height = 'auto';
        panel.style.maxHeight = '85vh';
        const fullHeight = panel.scrollHeight;
        panel.style.height = fullHeight + 'px';
        panel.style.maxHeight = fullHeight + 20 + 'px';
    }

    function updateWidget() {
        const pie = document.getElementById('pie-chart');
        const legend = document.getElementById('legend');
        const totalEl = document.getElementById('total-count');
        const resetBtn = document.getElementById('reset-btn');
        const managerNameEl = document.getElementById('manager-name');

        if (!pie || !legend) return;

        if (managerNameEl) managerNameEl.textContent = managerKey;

        const total = getTotal();
        if (totalEl) totalEl.textContent = total;
        if (resetBtn) resetBtn.style.display = total > 0 ? 'inline-block' : 'none';

        const sorted = STATUS_NAMES
            .map(name => ({ name, count: stats[name] || 0 }))
            .filter(item => item.count > 0)
            .sort((a, b) => b.count - a.count);

        let gradientParts = [];
        let cumulative = 0;

        if (total === 0) {
            pie.style.background = '#2a2a3a';
            pie.dataset.originalGradient = '#2a2a3a';
        } else {
            sorted.forEach(item => {
                const percent = (item.count / total) * 100;
                const color = STATUS_COLORS[item.name] || '#777';
                gradientParts.push(`${color} ${cumulative}% ${cumulative + percent}%`);
                cumulative += percent;
            });
            const grad = `conic-gradient(${gradientParts.join(', ')})`;
            pie.style.background = grad;
            pie.dataset.originalGradient = grad;
        }

        legend.innerHTML = '';
        if (sorted.length === 0) {
            legend.innerHTML = '<div style="text-align:center; opacity:0.6; padding:8px;">Нет данных</div>';
        } else {
            sorted.forEach(item => {
                const percent = total > 0 ? Math.round(item.count / total * 100) : 0;
                const color = STATUS_COLORS[item.name] || '#777';

                const div = document.createElement('div');
                div.className = 'legend-item';
                div.dataset.status = item.name;
                div.innerHTML = `
                    <div class="legend-color" style="background:${color}; color:${color}"></div>
                    <div class="legend-text">${item.name}</div>
                    <div class="legend-count">${item.count} (${percent}%)</div>
                `;
                legend.appendChild(div);
            });
        }

        setupHoverEffects();
        setTimeout(adjustHeight, 80);
    }

    function setupHoverEffects() {
        document.querySelectorAll('.legend-item').forEach(item => {
            const status = item.dataset.status;

            item.addEventListener('mouseenter', () => {
                if (!animationInProgress) {
                    highlightStatus(status);
                }
            });

            item.addEventListener('mouseleave', () => {
                if (!animationInProgress) {
                    resetHighlight();
                }
            });
        });
    }

    let highlightTimeout = null;
    let reminderCheckInterval = null;
    let shownReminders = GM_getValue('shown_reminders_today', []);
    let lastPassportCount = 0;
    let lastCallCheckMilestone = 0;

    // Мотивационные сообщения
    const successMessages = [
        "Отлично, продолжай в том же духе!",
        "Так держать, молодцом!",
        "Акула, продолжай так же!",
        "Рви! Не останавливайся!"
    ];

    const wakeUpMessages = [
        "Давай, соберись!",
        "Раздуплись!",
        "Раздупляйся!"
    ];

    // Функция получения случайного сообщения
    function getRandomMessage(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    }

    // Функция показа напоминания о скриншоте
    function showScreenshotReminder() {
        if (confirm('📸 Сделай скриншот и поделись статистикой')) {
            console.log('Пользователь подтвердил напоминание о скриншоте');
        }
    }

    // Инициализация системы напоминаний
    function initScreenshotReminders() {
        // Проверяем, не новый ли день
        const today = getTodayKey();
        const lastReminderDay = GM_getValue('last_reminder_day', '');

        if (lastReminderDay !== today) {
            shownReminders = [];
            GM_setValue('shown_reminders_today', []);
            GM_setValue('last_reminder_day', today);
        }

        // Проверяем время каждую минуту
        checkReminderTime();
        reminderCheckInterval = setInterval(checkReminderTime, 60000); // каждую минуту
    }

    // Проверка времени для напоминаний
    function checkReminderTime() {
        const now = new Date();

        // Получаем киевское время (UTC+2 зимой, UTC+3 летом)
        const kyivTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Kiev' }));
        const hours = kyivTime.getHours();
        const minutes = kyivTime.getMinutes();

        // Времена напоминаний: 9:59, 11:59, 15:59
        const reminderTimes = [
            { hour: 9, minute: 59 },
            { hour: 11, minute: 59 },
            { hour: 15, minute: 59 }
        ];

        reminderTimes.forEach(time => {
            const timeKey = `${time.hour}:${time.minute}`;

            if (hours === time.hour && minutes === time.minute) {
                // Проверяем, не показывали ли уже это напоминание сегодня
                if (!shownReminders.includes(timeKey)) {
                    showScreenshotReminder();
                    shownReminders.push(timeKey);
                    GM_setValue('shown_reminders_today', shownReminders);
                }
            }
        });
    }

    function highlightStatus(activeName) {
        if (animationInProgress) return;

        // Отменяем предыдущий таймаут если быстро переключаемся
        if (highlightTimeout) {
            clearTimeout(highlightTimeout);
        }

        const pie = document.getElementById('pie-chart');

        // Небольшая задержка для плавности при быстром переключении
        highlightTimeout = setTimeout(() => {
            // Добавляем класс для анимации увеличения
            pie.classList.add('highlighting');

            // Затемняем все элементы легенды кроме активного
            document.querySelectorAll('.legend-item').forEach(it => {
                if (it.dataset.status === activeName) {
                    it.classList.add('active');
                    it.classList.remove('dimmed');
                } else {
                    it.classList.add('dimmed');
                    it.classList.remove('active');
                }
            });

            const sorted = STATUS_NAMES.map(n => ({name:n, count:stats[n]||0}))
                .filter(o => o.count > 0)
                .sort((a,b)=>b.count - a.count);

            let parts = [];
            let sum = 0;
            const total = getTotal();
            if (total === 0) return;

            // Строим градиент: активный цвет остается ярким, остальные затемняем
            sorted.forEach(o => {
                const pct = o.count / total * 100;
                let c = STATUS_COLORS[o.name] || '#777';

                // Если это НЕ активный статус - затемняем его цвет
                if (o.name !== activeName) {
                    c = darkenColor(c, 0.2); // затемняем до 20% от исходной яркости
                }

                parts.push(`${c} ${sum}% ${sum + pct}%`);
                sum += pct;
            });

            pie.style.background = `conic-gradient(${parts.join(', ')})`;
        }, 50); // Маленькая задержка для сглаживания
    }

    function darkenColor(color, factor) {
        // factor: 0.2 = оставляем 20% яркости (затемняем на 80%)
        let R = parseInt(color.substring(1,3),16);
        let G = parseInt(color.substring(3,5),16);
        let B = parseInt(color.substring(5,7),16);

        R = Math.floor(R * factor);
        G = Math.floor(G * factor);
        B = Math.floor(B * factor);

        let RR = R.toString(16).padStart(2, '0');
        let GG = G.toString(16).padStart(2, '0');
        let BB = B.toString(16).padStart(2, '0');

        return "#"+RR+GG+BB;
    }

    function resetHighlight() {
        // Отменяем отложенное выделение если покидаем область
        if (highlightTimeout) {
            clearTimeout(highlightTimeout);
            highlightTimeout = null;
        }

        // Убираем все классы выделения
        document.querySelectorAll('.legend-item').forEach(it => {
            it.classList.remove('dimmed', 'active');
        });

        const pie = document.getElementById('pie-chart');

        // Убираем класс увеличения
        pie.classList.remove('highlighting');

        if (pie && pie.dataset.originalGradient) {
            pie.style.background = pie.dataset.originalGradient;
        }
    }

    document.addEventListener('click', e => {
        if (document.getElementById('calls-tracker-small')?.contains(e.target)) return;

        let text = (e.target.innerText || '').trim();
        if (text === 'Передать контакт') return updateStats('Передать');
        if (text === 'Установить перезвон') return updateStats('Перезвон');

        if (STATUS_NAMES.includes(text) && text !== 'Передать' && text !== 'Перезвон') {
            updateStats(text);
        }
    }, true);

    function startManagerObserver() {
        if (updateManagerKey()) return;

        const obs = new MutationObserver(() => {
            if (updateManagerKey()) obs.disconnect();
        });
        obs.observe(document.body, { childList: true, subtree: true, characterData: true });

        const iv = setInterval(() => {
            if (updateManagerKey()) {
                clearInterval(iv);
                obs.disconnect();
            }
        }, 600);

        setTimeout(() => {
            clearInterval(iv);
            obs.disconnect();
        }, 32000);
    }

    // Запуск
    createWidget();
    startManagerObserver();
    updateWidget();
    setInterval(checkDayChange, 60000);

    console.log('CRM Tracker v8 · мотивационные уведомления + контроль эффективности');
})();