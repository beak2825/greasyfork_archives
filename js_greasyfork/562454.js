// ==UserScript==
// @name         CRM Calls Tracker
// @namespace    http://tampermonkey.net/
// @version      22
// @description  Дополнение к ЦРМ в виде статистики + мотивационные уведомления + детализация
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
        { name: 'Не дозвон', color: '#39a7bd' },
        { name: 'Срез на 1 минуте', color: '#7f17ff' },
        { name: 'Срез на паспорте', color: '#5100b5' },
        { name: 'Компания', color: '#dc3545' },
        { name: 'Умник', color: '#b32b6f' },
        { name: 'Молодой', color: '#dc3545' },
        { name: 'Третьи лица', color: '#5000b4' },
        { name: 'Фрод', color: '#0c8ca6' },
        { name: 'Связь', color: '#002185' },
        { name: 'Списали', color: '#008f3c' },
        { name: 'Не существует', color: '#918900' },
        { name: 'Удалить', color: '#db3545' },
        { name: 'Взял паспорт', color: '#00ff04' },
        { name: 'Передать', color: '#a6a6a6' },
        { name: 'Перезвон', color: '#a6a6a6' }
    ];

    const STATUS_COLORS = Object.fromEntries(STATUS_CONFIG.map(item => [item.name, item.color]));
    const STATUS_NAMES = STATUS_CONFIG.map(item => item.name);

    let managerKey = 'UNKNOWN_MANAGER';
    let currentStatsKey = 'stats_UNKNOWN_MANAGER';
    let currentDetailsKey = 'details_UNKNOWN_MANAGER';
    let stats = {};
    let statusDetails = {}; // Детальная информация по каждому статусу
    let currentDayKey = '';
    let isCollapsed = GM_getValue('crm_tracker_collapsed', false);
    let animationInProgress = false;

    function updateManagerKey() {
        const labelEl = document.querySelector('.dropdown-toggle .label');
        if (labelEl) {
            const name = labelEl.textContent.trim();
            if (name && name.length > 0 && name !== managerKey) {
                managerKey = name;
                currentStatsKey = 'stats_' + name.replace(/\s+/g, '*');
                currentDetailsKey = 'details_' + name.replace(/\s+/g, '*');
                currentDayKey = 'currentDay*' + name;
                console.log(`Менеджер определён: ${managerKey}`);

                let storedDay = GM_getValue(currentDayKey, '');
                stats = GM_getValue(currentStatsKey, {});
                statusDetails = GM_getValue(currentDetailsKey, {});

                const today = getTodayKey();
                if (storedDay !== today) {
                    stats = {};
                    statusDetails = {};
                    STATUS_NAMES.forEach(n => {
                        stats[n] = 0;
                        statusDetails[n] = [];
                    });
                    GM_setValue(currentStatsKey, stats);
                    GM_setValue(currentDetailsKey, statusDetails);
                    GM_setValue(currentDayKey, today);

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
            statusDetails = {};
            STATUS_NAMES.forEach(name => {
                stats[name] = 0;
                statusDetails[name] = [];
            });

            GM_setValue(currentStatsKey, stats);
            GM_setValue(currentDetailsKey, statusDetails);
            GM_setValue(currentDayKey, today);

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
            statusDetails = {};
            STATUS_NAMES.forEach(name => {
                stats[name] = 0;
                statusDetails[name] = [];
            });
            GM_setValue(currentStatsKey, stats);
            GM_setValue(currentDetailsKey, statusDetails);

            lastPassportCount = 0;
            lastCallCheckMilestone = 0;

            updateWidget();
        }
    }

    // Функция для извлечения номера телефона из DOM
 function getCurrentPhoneNumber() {
    // 1. Самый точный вариант — ищем именно в форме текущего клиента
    const mainInput = document.querySelector('input.form-control[type="text"][id^="phone_number-client-"]');
    if (mainInput && mainInput.value && mainInput.value.trim().startsWith('+')) {
        return mainInput.value.trim();
    }

        // Пробуем найти по паттерну номера телефона
        const bodyText = document.body.innerText;
        const phoneMatch = bodyText.match(/\+?\d{10,15}/);
        return phoneMatch ? phoneMatch[0] : 'Неизвестный номер';
    }

// 1. Добавь эту переменную в начало скрипта, где объявлены остальные let
let lastUpdateTime = 0;
let lastProcessedPhone = '';

// 2. Сама исправленная функция
function updateStats(statusName) {
    const now = Date.now();
    // Защита от слишком быстрых повторных кликов
    if (now - lastUpdateTime < 200) return;

    const currentPhoneNumber = getCurrentPhoneNumber();

    // ПРОВЕРКА: Если номер не изменился (лаг CRM) или не найден — выходим
    if (currentPhoneNumber === 'Неизвестный номер' || currentPhoneNumber === lastProcessedPhone) {
        console.warn(`Статистика заблокирована: номер ${currentPhoneNumber} уже был обработан.`);
        return;
    }

    if (STATUS_NAMES.includes(statusName)) {
        const oldValue = stats[statusName] || 0;
        stats[statusName] = oldValue + 1;

        // ЗАПОМИНАЕМ НОМЕР: Теперь это действие считается завершенным для этого номера
        lastProcessedPhone = currentPhoneNumber;

        // Сохраняем детализацию
        if (!statusDetails[statusName]) {
            statusDetails[statusName] = [];
        }

        const timestamp = new Date().toLocaleString('ru-RU', {
            timeZone: 'Europe/Kiev',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        statusDetails[statusName].push({
            phone: currentPhoneNumber,
            time: timestamp,
            fullDate: new Date().toISOString()
        });

        // Сохранение в память браузера
        GM_setValue(currentStatsKey, stats);
        GM_setValue(currentDetailsKey, statusDetails);

        checkMotivationalNotifications(statusName, oldValue);
        setTimeout(updateWidget, 50);
    }
}

    function checkMotivationalNotifications(statusName, oldValue) {
        const total = getTotal();
        const passportCount = stats['Взял паспорт'] || 0;
        const passportCutCount = stats['Срез на паспорте'] || 0;
        const noAnswerCount = stats['Не дозвон'] || 0;

        if (statusName === 'Взял паспорт' && passportCount > lastPassportCount) {
            setTimeout(() => {
                alert(getRandomMessage(successMessages));
            }, 300);
            lastPassportCount = passportCount;
        }

        if (total >= 100) {
            const passportCutPercent = (passportCutCount / total) * 100;
            const noAnswerPercent = (noAnswerCount / total) * 100;

            if (Math.floor(total / 50) > lastCallCheckMilestone) {
                lastCallCheckMilestone = Math.floor(total / 50);

                if (passportCutPercent > 5 && passportCount <= 3) {
                    setTimeout(() => {
                        alert(getRandomMessage(wakeUpMessages));
                    }, 300);
                }
            }

            const noAnswerCheckKey = 'no_answer_alert_shown_' + getTodayKey();
            if (noAnswerPercent > 55 && !GM_getValue(noAnswerCheckKey, false)) {
                setTimeout(() => {
                    alert("Что-то не так с дозвоном, подойди к айти!");
                    GM_setValue(noAnswerCheckKey, true);
                }, 300);
            }
        }
    }

    // Функция показа детальной информации
    function showStatusDetails(statusName) {
        const details = statusDetails[statusName] || [];

        if (details.length === 0) {
            alert(`По статусу "${statusName}" нет данных`);
            return;
        }

        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.id = 'status-details-modal';

        const detailsList = details
            .slice()
            .reverse() // Показываем последние записи сверху
            .map((item, index) => `
                <div class="detail-item">
                    <span class="detail-number">${index + 1}.</span>
                    <span class="detail-phone">${item.phone}</span>
                    <span class="detail-time">${item.time}</span>
                </div>
            `)
            .join('');

        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${statusName}</h3>
                        <button class="modal-close">✕</button>
                    </div>
                    <div class="modal-body">
                        <div class="details-count">Всего записей: ${details.length}</div>
                        <div class="details-list">
                            ${detailsList}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

// Плавное появление
requestAnimationFrame(() => {
    modal.querySelector('.modal-overlay').classList.add('show');
});

        // Закрытие кнопкой ✕
modal.querySelector('.modal-close').addEventListener('click', () => {
    const overlay = modal.querySelector('.modal-overlay');
    overlay.classList.remove('show');
    overlay.addEventListener('transitionend', () => modal.remove(), { once: true });
});

// Закрытие кликом по фону
modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        const overlay = e.target;
        overlay.classList.remove('show');
        overlay.addEventListener('transitionend', () => modal.remove(), { once: true });
    }
});
    }

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
                background: rgba(20, 20, 38, 0);
                color: #f0f0ff;
                border-radius: 12px;
                box-shadow: 0 6px 24px rgba(0,0,0,0.65);
                font-family: system-ui, sans-serif;
                font-size: 11.5px;
                z-index: 999999;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255,255,255,0.1);
                overflow: hidden;
                transition:
                    max-height 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
                    height 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
                    opacity 0.2s ease;
            }
            #calls-tracker-small.collapsed {
                max-height: 42px !important;
                height: auto;
                opacity: 1;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 14px;
                background: rgba(0,0,0,0.05);
                font-weight: 600;
                font-size: 13px;
                color: #D9D9D9;
            }
            .header-buttons {
                display: flex;
                gap: 6px;
            }
            #toggle-collapse, #reset-btn, #screenshot-reminder {
                width: 24px;
                height: 24px;
                border: none;
                border-radius: 25%;
                background: rgba(255,255,255,0.07);
                color: #D9D9D9;
                font-size: 14px;
                cursor: pointer;
                opacity: 1;
                transition: all 0.18s;
            }
            #toggle-collapse:hover, #reset-btn:hover, #screenshot-reminder:hover {
                opacity: 1;
                background: rgba(255,255,255,0.16);
                color: white;
            }
            #screenshot-reminder {
                font-size: 13px;
                display: none !important;
            }
            #reset-btn {
                display: none !important;
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
                    inset 0 0 40px 5px rgba(255,255,255,0.07),
                    inset 0 0 60px 30px rgba(255,255,255,0.2);
                transition:
                    transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1),
                    background 0.5s ease;
                position: relative;
                opacity: 0.7; /* 0.0 - 1.0 */
                mix-blend-mode: screen;
                filter: saturate(175%);
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
                gap: 0.3px;
                margin-bottom: 0px;
            }
            .legend-item {
                display: flex;
                align-items: center;
                gap: 9px;
                transition: opacity 0.45s ease;
                cursor: pointer;
                font-size: 11.8px;
                font-weight: 605;
                padding: 4px;
                border-radius: 4px;
            }
            .legend-item {
    transition:
        transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
        background 0.25s ease,
        opacity 0.45s ease;
    transform-origin: center center;
}
            .legend-item:hover {
                background: rgba(255,255,255,0.05);
            }
            .legend-item:hover,
.legend-item.active {
    transform: scale(1.06);
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
                color: #D9D9D9;
            }
            .total {
                text-align: center;
                font-size: 13px;
                font-weight: 500;
                margin-top: 6px;
            }

            /* Модальное окно */
            #status-details-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 9999999;
            }
            .modal-overlay {
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0); /* прозрачный */
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(0px);  /* старт без блюра */
                transition: backdrop-filter 0.2s ease, background 0.2s ease, opacity 0.2s ease;
                opacity: 0;  /* полностью прозрачный */
            }
            .modal-overlay.show {
                backdrop-filter: blur(40px);
                background: rgba(0, 0, 0, 0.2);
                opacity: 1;
             }
            .modal-content {
                background: rgba(20, 20, 38, 0.10);
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                border: 1px solid rgba(255,255,255,0.1);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            .modal-header h3 {
                margin: 0;
                color: #f0f0ff;
                font-size: 18px;
                font-weight: 800;
            }
            .modal-close {
                width: 35px;
    height: 35px;
    font-size: 20px;
    font-weight: 700;
    line-height: 32px;          /* равно высоте кнопки */
    text-align: center;         /* горизонталь */
    background: rgba(255,255,255,0.1);
    border-radius: 25%;
    border: none;
    color: #fff;
    padding: 0;
    transition: all 0.2s;

            }
            .modal-close:hover {
                background: rgba(255,255,255,0.2);
                transform: rotate(90deg);
            }
            .modal-body {
                padding: 20px;
                overflow-y: auto;
                color: #f0f0ff;
            }
            .details-count {
                font-size: 14px;
                margin-bottom: 16px;
                color: rgba(255, 255, 255, 0.9);
                font-weight: 500;
            }
            .details-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .detail-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 12px;
                background: rgba(255,255,255,0.05);
                border-radius: 6px;
                font-size: 13px;
            }
            .detail-number {
                color: rgba(255, 255, 255, 0.6);
                font-weight: 600;
                min-width: 24px;
            }
            .detail-phone {
                flex: 1;
                color: rgba(255, 255, 255, 0.9);
                font-weight: 700;
            }
            .detail-time {
                color: rgba(255, 255, 255, 0.6);
                font-size: 12px;
            }
            /* 1. Скрываем стандартные стрелки для Chrome, Edge, Safari */
::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
}

/* 2. Настраиваем сам скроллбар */
::-webkit-scrollbar {
    width: 8px;  /* ширина вертикального */
    height: 8px; /* высота горизонтального */
}

/* 3. Фон дорожки (делаем прозрачным) */
::-webkit-scrollbar-track {
    background: transparent;
}

/* 4. Ползунок (делаем закругленным и аккуратным) */
::-webkit-scrollbar-thumb {
    background-color: rgba(136, 136, 136, 0.2); /* полупрозрачный серый */
    border-radius: 10px;
    /* Добавляем небольшой отступ, чтобы ползунок не прилипал к краям */
    border: 2px solid transparent;
    background-clip: content-box;
}

/* Эффект при наведении */
::-webkit-scrollbar-thumb:hover {
    background-color: rgba(136, 136, 136, 0.8);
}
/* Скрываем кнопки со стрелками */
::-webkit-scrollbar-button {
    display: none;
}

/* Опционально: если хотите, чтобы полоса занимала все место без отступов */
::-webkit-scrollbar-track-piece {
    background: transparent;
}
        `;
        document.head.appendChild(style);

        document.getElementById('toggle-collapse').addEventListener('click', toggleCollapse);
        document.getElementById('reset-btn').addEventListener('click', resetTodayStats);
        document.getElementById('screenshot-reminder').addEventListener('click', showScreenshotReminder);

        setTimeout(adjustHeight, 50);
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
                const percent = total > 0
    ? (item.count / total * 100).toFixed(1)
    : '0.0';

                const color = STATUS_COLORS[item.name] || '#777';

                const div = document.createElement('div');
                div.className = 'legend-item';
                div.dataset.status = item.name;
                div.innerHTML = `
                    <div class="legend-color" style="background:${color}; color:${color}"></div>
                    <div class="legend-text">${item.name}</div>
                    <div class="legend-count">${item.count} (${percent}%)</div>
                `;

                // Добавляем обработчик клика для показа деталей
                div.addEventListener('click', () => {
                    showStatusDetails(item.name);
                });

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

    function getRandomMessage(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    }

    function showScreenshotReminder() {
        if (confirm('📸 Сделай скриншот и поделись статистикой')) {
            console.log('Пользователь подтвердил напоминание о скриншоте');
        }
    }

    function initScreenshotReminders() {
        const today = getTodayKey();
        const lastReminderDay = GM_getValue('last_reminder_day', '');

        if (lastReminderDay !== today) {
            shownReminders = [];
            GM_setValue('shown_reminders_today', []);
            GM_setValue('last_reminder_day', today);
        }

        checkReminderTime();
        reminderCheckInterval = setInterval(checkReminderTime, 60000);
    }

    function checkReminderTime() {
        const now = new Date();
        const kyivTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Kiev' }));
        const hours = kyivTime.getHours();
        const minutes = kyivTime.getMinutes();

        const reminderTimes = [
            { hour: 9, minute: 59 },
            { hour: 11, minute: 59 },
            { hour: 15, minute: 59 },
            { hour: 17, minute: 59 }
        ];

        reminderTimes.forEach(time => {
            const timeKey = `${time.hour}:${time.minute}`;

            if (hours === time.hour && minutes === time.minute) {
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

        if (highlightTimeout) {
            clearTimeout(highlightTimeout);
        }

        const pie = document.getElementById('pie-chart');

        highlightTimeout = setTimeout(() => {
            pie.classList.add('highlighting');

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

            sorted.forEach(o => {
                const pct = o.count / total * 100;
                let c = STATUS_COLORS[o.name] || '#777';

                if (o.name !== activeName) {
                    c = darkenColor(c, 0.2);
                }

                parts.push(`${c} ${sum}% ${sum + pct}%`);
                sum += pct;
            });

            pie.style.background = `conic-gradient(${parts.join(', ')})`;
        }, 250);
    }

    function darkenColor(color, factor) {
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
        if (highlightTimeout) {
            clearTimeout(highlightTimeout);
            highlightTimeout = null;
        }

        document.querySelectorAll('.legend-item').forEach(it => {
            it.classList.remove('dimmed', 'active');
        });

        const pie = document.getElementById('pie-chart');
        pie.classList.remove('highlighting');

        if (pie && pie.dataset.originalGradient) {
            pie.style.background = pie.dataset.originalGradient;
        }
    }

    document.addEventListener('click', e => {
        const forbiddenParents = [
        '#status-details-modal',
        '#calls-tracker-small',
        // можно добавить другие селекторы виджетов, если появятся
    ];

    if (forbiddenParents.some(sel => e.target.closest(sel))) {
        return;
    }
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

    createWidget();
    startManagerObserver();
    updateWidget();
    setInterval(checkDayChange, 60000);

    console.log('CRM Tracker v10 · детализация по категориям + мотивационные уведомления');
})();