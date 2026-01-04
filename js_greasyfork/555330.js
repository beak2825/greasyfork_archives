// ==UserScript==
// @name         NEO-BANCHECK • CYBER SIDEBAR
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Компактная проверка блокировок в сайдбаре NEO-LOGS
// @author       WashingtonNuked LOGI 61
// @license      Mit
// @match        https://logs.blackrussia.online/gslogs/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js
// @downloadURL https://update.greasyfork.org/scripts/555330/NEO-BANCHECK%20%E2%80%A2%20CYBER%20SIDEBAR.user.js
// @updateURL https://update.greasyfork.org/scripts/555330/NEO-BANCHECK%20%E2%80%A2%20CYBER%20SIDEBAR.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PERIOD_DAYS = 179;
    const REQUEST_DELAY_MS = 1200;
    let lastRequestTime = 0;

    // 🔥 КИБЕРПАНК СТИЛИ ДЛЯ BANCHECK
    const styles = `
        .cyber-bancheck {
            background: rgba(30, 30, 58, 0.9);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 42, 109, 0.4);
            border-radius: 16px;
            padding: 20px;
            box-shadow:
                0 8px 32px rgba(0, 0, 0, 0.3),
                0 0 20px rgba(255, 42, 109, 0.3);
            position: relative;
            overflow: hidden;
            margin-bottom: 20px;
        }

        .cyber-bancheck::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 42, 109, 0.1), transparent);
            transition: left 0.6s ease;
        }

        .cyber-bancheck:hover::before {
            left: 100%;
        }

        .bancheck-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            padding-bottom: 12px;
            border-bottom: 2px solid rgba(255, 42, 109, 0.4);
        }

        .bancheck-header i {
            font-size: 1.4rem;
            color: var(--accent-tertiary);
            text-shadow: 0 0 10px rgba(255, 42, 109, 0.5);
        }

        .bancheck-header h3 {
            font-family: 'Orbitron', monospace;
            font-size: 1.1rem;
            background: linear-gradient(45deg, var(--accent-tertiary), #ff6b9d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .bancheck-input-group {
            position: relative;
            margin-bottom: 12px;
        }

        .bancheck-input {
            width: 100%;
            padding: 12px 45px 12px 15px;
            background: rgba(10, 10, 22, 0.8);
            border: 1px solid rgba(139, 92, 235, 0.3);
            border-radius: 10px;
            color: var(--text-primary);
            font-family: 'Exo 2', sans-serif;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .bancheck-input:focus {
            outline: none;
            border-color: var(--accent-tertiary);
            box-shadow: 0 0 15px rgba(255, 42, 109, 0.3);
        }

        .bancheck-input::placeholder {
            color: var(--text-secondary);
        }

        .bancheck-btn {
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, var(--accent-tertiary), #ff6b9d);
            border: none;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
        }

        .bancheck-btn:hover {
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 0 15px rgba(255, 42, 109, 0.6);
        }

        .bancheck-btn:disabled {
            background: linear-gradient(135deg, #6c757d, #8d99a7);
            cursor: not-allowed;
            transform: translateY(-50%);
        }

        .bancheck-result {
            min-height: 60px;
            padding: 12px;
            border-radius: 10px;
            background: rgba(10, 10, 22, 0.6);
            border: 1px solid rgba(139, 92, 235, 0.2);
            font-family: 'Exo 2', sans-serif;
            font-size: 0.8rem;
            line-height: 1.3;
            transition: all 0.3s ease;
        }

        .bancheck-result.loading {
            border-color: rgba(0, 212, 255, 0.4);
            background: rgba(0, 212, 255, 0.1);
        }

        .bancheck-result.error {
            border-color: rgba(255, 56, 96, 0.4);
            background: rgba(255, 56, 96, 0.1);
        }

        .bancheck-result.success {
            border-color: rgba(34, 197, 94, 0.4);
            background: rgba(34, 197, 94, 0.1);
        }

        .ban-status {
            font-weight: 700;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 0.85rem;
        }

        .ban-status.banned {
            color: var(--accent-tertiary);
        }

        .ban-status.unbanned {
            color: #23d160;
        }

        .ban-status.clean {
            color: var(--accent-secondary);
        }

        .ban-details {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .ban-detail {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .ban-label {
            color: var(--text-secondary);
            font-weight: 600;
            font-size: 0.75rem;
            text-transform: uppercase;
            min-width: 50px;
        }

        .ban-value {
            color: var(--text-primary);
            text-align: right;
            flex: 1;
            margin-left: 8px;
            font-size: 0.75rem;
        }

        /* 🔥 КОМПАКТНЫЙ СПИННЕР */
        .compact-spinner {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 8px 0;
        }

        .compact-spinner-core {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(0, 212, 255, 0.3);
            border-radius: 50%;
            border-top-color: var(--accent-secondary);
            animation: cyber-spin 1s linear infinite;
        }

        .compact-spinner-text {
            font-family: 'Orbitron', sans-serif;
            font-weight: 700;
            color: var(--accent-secondary);
            font-size: 0.75rem;
            letter-spacing: 0.5px;
        }

        @keyframes cyber-spin {
            to { transform: rotate(360deg); }
        }

        /* 🎯 ПУЛЬСАЦИЯ ПРИ НАВЕДЕНИИ */
        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 5px rgba(255, 42, 109, 0.3); }
            50% { box-shadow: 0 0 15px rgba(255, 42, 109, 0.6); }
        }

        .cyber-bancheck:hover {
            animation: pulse-glow 2s ease-in-out infinite;
        }
    `;

    function addStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        (document.head || document.getElementsByTagName('head')[0]).appendChild(style);
    }

    function showResult(message, type = 'info', resultBox) {
        if (!resultBox) return;

        resultBox.innerHTML = message;
        resultBox.className = 'bancheck-result';

        if (type === 'loading') resultBox.classList.add('loading');
        else if (type === 'error') resultBox.classList.add('error');
        else if (type === 'success') resultBox.classList.add('success');

        if (window.gsap) {
            gsap.fromTo(resultBox,
                { scale: 0.95, opacity: 0.8 },
                { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.2)" }
            );
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const pad = (num) => String(num).padStart(2, '0');
        return `${pad(date.getDate())}.${pad(date.getMonth() + 1)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function parseBanInfo(transactionDesc) {
        let duration = "Неизвестно";
        let reason = "Не указана";

        const foreverMatch = /Навсегда/i.test(transactionDesc);
        const timeMatch = transactionDesc.match(/на\s+(\d+)\s+(день|дня|дней|час|часа|часов|минуту|минуты|минут|неделю|недели|недель|месяц|месяца|месяцев)/i);

        if (foreverMatch) duration = "НАВСЕГДА";
        else if (timeMatch) duration = `${timeMatch[1]} ${timeMatch[2].toUpperCase()}`;

        const reasonMatch = transactionDesc.match(/Причина\s*([^|]+?)(?:\s*\||$)/i);
        if (reasonMatch) reason = reasonMatch[1].trim();

        return { duration, reason };
    }

    function daysAgo(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date;
    }

    function iso(date) {
        return date.toISOString().slice(0, -5) + 'Z';
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function throttle() {
        const since = Date.now() - lastRequestTime;
        if (since < REQUEST_DELAY_MS) await wait(REQUEST_DELAY_MS - since);
    }

    async function getPlayerLogs(playerName) {
        await throttle();
        lastRequestTime = Date.now();

        const endDate = new Date();
        const startDate = daysAgo(PERIOD_DAYS);
        const descFilterRaw = `%блокировал% %${playerName}%`;

        const params = new URLSearchParams({
            category_id__exact: '',
            player_name__exact: '',
            player_id__exact: '',
            player_ip__exact: '',
            transaction_amount__exact: '',
            balance_after__exact: '',
            transaction_desc__ilike: descFilterRaw,
            time__gte: iso(startDate),
            time__lte: iso(endDate),
            order_by: 'time',
            offset: '0',
            limit: '200',
            auto: 'false'
        });

        let paramsString = params.toString()
            .replace(/time__gte=[^&]*?%3A/g, match => match.replace(/%3A/g, ':'))
            .replace(/time__lte=[^&]*?%3A/g, match => match.replace(/%3A/g, ':'));

        const pathParts = location.pathname.split('/').filter(p => p);
        const gslogsIndex = pathParts.indexOf('gslogs');
        const serverId = (gslogsIndex !== -1 && pathParts[gslogsIndex + 1] && !isNaN(pathParts[gslogsIndex + 1])) ? pathParts[gslogsIndex + 1] : null;

        if (!serverId) throw new Error('Не удалось определить ID сервера');

        const API_BASE_URL = `${location.origin}/gslogs/${serverId}/api/list-game-logs/`;
        const url = `${API_BASE_URL}?${paramsString}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
            });

            if (!response.ok) {
                if (response.status === 429) throw new Error('TOO_MANY_REQUESTS');
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            return Array.isArray(data) ? data : (data?.results || []);

        } catch (error) {
            if (error.message === 'TOO_MANY_REQUESTS') {
                await wait(5000);
                return getPlayerLogs(playerName);
            }
            throw error;
        }
    }

    async function handleBanCheck() {
        const input = document.getElementById('bancheck-input');
        const button = document.getElementById('bancheck-btn');
        const resultBox = document.getElementById('bancheck-result');

        const playerName = input.value.trim();
        if (!playerName) {
            showResult('Введите никнейм игрока', 'error', resultBox);
            return;
        }

        // 🔥 Анимация кнопки
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        showResult(`
            <div class="compact-spinner">
                <div class="compact-spinner-core"></div>
                <div class="compact-spinner-text">SCANNING...</div>
            </div>
        `, 'loading', resultBox);

        try {
            const logs = await getPlayerLogs(playerName);

            if (logs.length > 0) {
                const sortedLogs = logs.sort((a, b) => new Date(b.time) - new Date(a.time));
                const lastLog = sortedLogs[0];

                if (lastLog?.transaction_desc) {
                    const adminNick = lastLog.player_name || "НЕИЗВЕСТЕН";
                    const formattedTime = formatDate(lastLog.time);
                    const isUnbanned = lastLog.transaction_desc.toLowerCase().includes('разблокировал');

                    if (isUnbanned) {
                        const reasonMatch = lastLog.transaction_desc.match(/Причина:\s*(.*)/i);
                        const reason = reasonMatch ? reasonMatch[1].trim().replace(/by\s.*$/, '').trim() : "Не указана";

                        showResult(`
                            <div class="ban-status unbanned">✅ НЕ В БАНЕ</div>
                            <div class="ban-details">
                                <div class="ban-detail">
                                    <span class="ban-label">ИГРОК:</span>
                                    <span class="ban-value">${playerName}</span>
                                </div>
                                <div class="ban-detail">
                                    <span class="ban-label">СТАТУС:</span>
                                    <span class="ban-value">Разблокирован</span>
                                </div>
                                <div class="ban-detail">
                                    <span class="ban-label">АДМИН:</span>
                                    <span class="ban-value">${adminNick}</span>
                                </div>
                                <div class="ban-detail">
                                    <span class="ban-label">ВРЕМЯ:</span>
                                    <span class="ban-value">${formattedTime}</span>
                                </div>
                            </div>
                        `, 'success', resultBox);
                    } else {
                        const blockInfo = parseBanInfo(lastLog.transaction_desc);

                        showResult(`
                            <div class="ban-status banned">🛑 В БАНЕ</div>
                            <div class="ban-details">
                                <div class="ban-detail">
                                    <span class="ban-label">ИГРОК:</span>
                                    <span class="ban-value">${playerName}</span>
                                </div>
                                <div class="ban-detail">
                                    <span class="ban-label">СРОК:</span>
                                    <span class="ban-value">${blockInfo.duration}</span>
                                </div>
                                <div class="ban-detail">
                                    <span class="ban-label">ПРИЧИНА:</span>
                                    <span class="ban-value">${blockInfo.reason}</span>
                                </div>
                                <div class="ban-detail">
                                    <span class="ban-label">АДМИН:</span>
                                    <span class="ban-value">${adminNick}</span>
                                </div>
                                <div class="ban-detail">
                                    <span class="ban-label">ВРЕМЯ:</span>
                                    <span class="ban-value">${formattedTime}</span>
                                </div>
                            </div>
                        `, 'success', resultBox);
                    }
                }
            } else {
                showResult(`
                    <div class="ban-status clean">🔍 НЕТ БЛОКИРОВОК</div>
                    <div class="ban-details">
                        <div class="ban-detail">
                            <span class="ban-label">ИГРОК:</span>
                            <span class="ban-value">${playerName}</span>
                        </div>
                        <div class="ban-detail">
                            <span class="ban-label">СТАТУС:</span>
                            <span class="ban-value">Чист</span>
                        </div>
                        <div class="ban-detail">
                            <span class="ban-label">ПЕРИОД:</span>
                            <span class="ban-value">${PERIOD_DAYS} дней</span>
                        </div>
                    </div>
                `, 'success', resultBox);
            }
        } catch (error) {
            showResult(`Ошибка: ${error.message}`, 'error', resultBox);
        } finally {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-search"></i>';
        }
    }

    function createBanCheckPanel() {
        if (document.getElementById('cyber-bancheck')) return;

        // Добавляем стили
        if (!document.getElementById('cyber-bancheck-styles')) {
            addStyle(styles);
            const styleMarker = document.createElement('style');
            styleMarker.id = 'cyber-bancheck-styles';
            document.head.appendChild(styleMarker);
        }

        const panel = document.createElement('div');
        panel.id = 'cyber-bancheck';
        panel.className = 'cyber-bancheck';

        panel.innerHTML = `
            <div class="bancheck-header">
                <i class="fas fa-user-shield"></i>
                <h3>ПРОВЕРКА БАНА</h3>
            </div>
            <div class="bancheck-input-group">
                <input type="text"
                       id="bancheck-input"
                       class="bancheck-input"
                       placeholder="Введите никнейм..."
                       maxlength="25">
                <button id="bancheck-btn" class="bancheck-btn" title="Проверить">
                    <i class="fas fa-search"></i>
                </button>
            </div>
            <div id="bancheck-result" class="bancheck-result">
                Введите никнейм для проверки
            </div>
        `;

        // Вставляем в сайдбар после калькулятора
        const sidebar = document.querySelector('.cyber-sidebar');
        const calculator = document.querySelector('.cyber-calculator');

        if (sidebar && calculator) {
            sidebar.insertBefore(panel, calculator.nextSibling);
        } else if (sidebar) {
            sidebar.prepend(panel);
        }

        // Добавляем обработчики
        const button = document.getElementById('bancheck-btn');
        const input = document.getElementById('bancheck-input');

        button.addEventListener('click', handleBanCheck);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleBanCheck();
        });

        // 🔥 Анимация появления
        if (window.gsap) {
            gsap.fromTo(panel,
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.2)" }
            );
        }

        console.log('🚀 NEO-BANCHECK • CYBER SIDEBAR АКТИВИРОВАН');
    }

    function init() {
        // Ждем загрузки сайдбара
        const checkInterval = setInterval(() => {
            const sidebar = document.querySelector('.cyber-sidebar');
            if (sidebar && !document.getElementById('cyber-bancheck')) {
                clearInterval(checkInterval);
                createBanCheckPanel();
            }
        }, 1000);

        setTimeout(() => clearInterval(checkInterval), 10000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();