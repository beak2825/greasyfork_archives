// ==UserScript==
// @name         🗳️ Vote Monitor - Maxyao vs Saiyokoo
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Мониторинг голосования в реальном времени с анализом групп
// @author       Maxyao
// @match        *://lolz.live/threads/9493537/*
// @match        *://lolz.guru/threads/9493537/*
// @match        *://zelenka.guru/threads/9493537/*
// @match        *://lolz.live/threads/9493537*
// @match        *://lolz.guru/threads/9493537*
// @match        *://zelenka.guru/threads/9493537*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559601/%F0%9F%97%B3%EF%B8%8F%20Vote%20Monitor%20-%20Maxyao%20vs%20Saiyokoo.user.js
// @updateURL https://update.greasyfork.org/scripts/559601/%F0%9F%97%B3%EF%B8%8F%20Vote%20Monitor%20-%20Maxyao%20vs%20Saiyokoo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🗳️ Vote Monitor: Скрипт загружен!');

    const CONFIG = {
        THREAD_ID: '9493537',
        MAXYAO_OPTIONS: [5, 10, 15],
        SAIYOKOO_OPTIONS: [24],
        UPDATE_INTERVAL: 45000,
        THRESHOLDS: {
            LOCAL: 20,
            REGULAR: 200,
            EXPERT: 1000
        }
    };

    let pollIds = {};
    let isRunning = true;
    let isMinimized = false;
    let updateTimer = null;
    let userLikesCache = {};
    let lastVotersData = { maxyao: null, saiyokoo: null };
    let isAnalyzing = false;

    try {
        isMinimized = GM_getValue('isMinimized', false);
        userLikesCache = GM_getValue('userLikesCache', {});
    } catch(e) {
        isMinimized = localStorage.getItem('vm_isMinimized') === 'true';
        userLikesCache = JSON.parse(localStorage.getItem('vm_userLikesCache') || '{}');
    }

    function saveData(key, value) {
        try {
            GM_setValue(key, value);
        } catch(e) {
            localStorage.setItem('vm_' + key, JSON.stringify(value));
        }
    }

    function addStyles() {
        const css = `
            #vote-monitor {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 380px;
                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 13px;
                z-index: 999999;
                user-select: none;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
            }

            #vote-monitor.minimized {
                width: 220px;
                max-height: none;
            }

            #vote-monitor * {
                box-sizing: border-box;
            }

            .vm-container {
                background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
                border: 1px solid #0f3460;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                max-height: 90vh;
            }

            .vm-header {
                background: linear-gradient(135deg, #e94560 0%, #0f3460 100%);
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                flex-shrink: 0;
            }

            .vm-header h3 {
                margin: 0;
                font-size: 14px;
                font-weight: 600;
                color: #fff;
            }

            .vm-header-buttons {
                display: flex;
                gap: 8px;
            }

            .vm-header button {
                background: rgba(255,255,255,0.15);
                border: none;
                color: #fff;
                width: 26px;
                height: 26px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s;
            }

            .vm-header button:hover {
                background: rgba(255,255,255,0.3);
            }

            .vm-content {
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                overflow-y: auto;
                flex: 1;
            }

            .vm-content.hidden {
                display: none;
            }

            .vm-candidate {
                background: rgba(255,255,255,0.03);
                border-radius: 12px;
                padding: 14px;
                border-left: 4px solid;
            }

            .vm-candidate.maxyao { border-left-color: #00ff88; }
            .vm-candidate.saiyokoo { border-left-color: #ff6b6b; }

            .vm-candidate-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }

            .vm-candidate-name {
                font-weight: 600;
                font-size: 13px;
                color: #fff;
            }

            .vm-candidate-votes {
                font-size: 28px;
                font-weight: 700;
            }

            .vm-candidate.maxyao .vm-candidate-votes { color: #00ff88; }
            .vm-candidate.saiyokoo .vm-candidate-votes { color: #ff6b6b; }

            .vm-candidate-details {
                font-size: 11px;
                color: #888;
                margin-top: 6px;
            }

            .vm-candidate-bar {
                height: 6px;
                background: rgba(255,255,255,0.1);
                border-radius: 3px;
                margin-top: 10px;
                overflow: hidden;
            }

            .vm-candidate-bar-fill {
                height: 100%;
                border-radius: 3px;
                transition: width 0.5s ease;
            }

            .vm-candidate.maxyao .vm-candidate-bar-fill {
                background: linear-gradient(90deg, #00ff88, #00cc6a);
            }

            .vm-candidate.saiyokoo .vm-candidate-bar-fill {
                background: linear-gradient(90deg, #ff6b6b, #ee5a5a);
            }

            .vm-comparison {
                background: rgba(255,255,255,0.03);
                border-radius: 12px;
                padding: 14px;
            }

            .vm-comparison-bar {
                display: flex;
                height: 12px;
                border-radius: 6px;
                overflow: hidden;
                background: #222;
            }

            .vm-comparison-bar-m {
                background: linear-gradient(90deg, #00ff88, #00cc6a);
                transition: width 0.5s;
            }

            .vm-comparison-bar-s {
                background: linear-gradient(90deg, #ee5a5a, #ff6b6b);
                transition: width 0.5s;
            }

            .vm-comparison-labels {
                display: flex;
                justify-content: space-between;
                margin-top: 8px;
                font-size: 12px;
                color: #888;
            }

            .vm-leader {
                text-align: center;
                padding: 14px;
                border-radius: 12px;
                font-weight: 600;
                font-size: 14px;
                color: #fff;
            }

            .vm-leader.maxyao-lead {
                background: rgba(0,255,136,0.15);
                color: #00ff88;
                border: 1px solid rgba(0,255,136,0.3);
            }

            .vm-leader.saiyokoo-lead {
                background: rgba(255,107,107,0.15);
                color: #ff6b6b;
                border: 1px solid rgba(255,107,107,0.3);
            }

            .vm-leader.tie {
                background: rgba(255,215,0,0.15);
                color: #ffd700;
                border: 1px solid rgba(255,215,0,0.3);
            }

            .vm-leader-diff {
                font-size: 11px;
                opacity: 0.8;
                margin-top: 4px;
            }

            /* Панель анализа */
            .vm-analyze-panel {
                background: rgba(255,255,255,0.03);
                border-radius: 10px;
                padding: 12px;
            }

            .vm-analyze-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }

            .vm-analyze-title {
                color: #888;
                font-size: 12px;
            }

            .vm-analyze-btn {
                background: linear-gradient(135deg, #0f3460, #16213e);
                border: 1px solid #0f3460;
                color: #fff;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s;
            }

            .vm-analyze-btn:hover {
                background: linear-gradient(135deg, #16213e, #1a1a2e);
                border-color: #e94560;
            }

            .vm-analyze-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .vm-analyze-btn.loading {
                background: linear-gradient(135deg, #3d3d00, #2d2d00);
                border-color: #ffd700;
            }

            .vm-analyze-status {
                font-size: 11px;
                color: #666;
                text-align: center;
                padding: 8px;
                background: rgba(0,0,0,0.2);
                border-radius: 6px;
                margin-bottom: 10px;
            }

            .vm-analyze-status.loading { color: #ffd700; }
            .vm-analyze-status.ready { color: #00ff88; }
            .vm-analyze-status.error { color: #ff6b6b; }

            /* Сводная таблица */
            .vm-summary-table {
                width: 100%;
                font-size: 11px;
                margin-bottom: 12px;
                border-collapse: collapse;
            }

            .vm-summary-table th {
                color: #666;
                font-weight: normal;
                padding: 6px 4px;
                text-align: center;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .vm-summary-table td {
                padding: 8px 4px;
                text-align: center;
            }

            .vm-summary-table .label-col {
                text-align: left;
                color: #888;
            }

            .vm-summary-table .m-col { color: #00ff88; font-weight: 600; }
            .vm-summary-table .s-col { color: #ff6b6b; font-weight: 600; }
            .vm-summary-table .diff-col { font-weight: 600; }
            .vm-summary-table .diff-col.positive { color: #00ff88; }
            .vm-summary-table .diff-col.negative { color: #ff6b6b; }
            .vm-summary-table .diff-col.zero { color: #ffd700; }

            /* Таблицы голосующих */
            .vm-voters-section {
                margin-top: 12px;
            }

            .vm-voters-toggle {
                background: rgba(255,255,255,0.05);
                border: none;
                color: #888;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 11px;
                width: 100%;
                text-align: left;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.2s;
            }

            .vm-voters-toggle:hover {
                background: rgba(255,255,255,0.1);
                color: #fff;
            }

            .vm-voters-toggle.maxyao:hover { color: #00ff88; }
            .vm-voters-toggle.saiyokoo:hover { color: #ff6b6b; }

            .vm-voters-toggle .arrow {
                transition: transform 0.2s;
            }

            .vm-voters-toggle.open .arrow {
                transform: rotate(180deg);
            }

            .vm-voters-list {
                display: none;
                max-height: 200px;
                overflow-y: auto;
                margin-top: 8px;
                background: rgba(0,0,0,0.2);
                border-radius: 6px;
            }

            .vm-voters-list.open {
                display: block;
            }

            .vm-voters-table {
                width: 100%;
                font-size: 11px;
                border-collapse: collapse;
            }

            .vm-voters-table th {
                color: #666;
                font-weight: normal;
                padding: 6px 8px;
                text-align: left;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                position: sticky;
                top: 0;
                background: #16213e;
            }

            .vm-voters-table th:last-child {
                text-align: right;
            }

            .vm-voters-table td {
                padding: 5px 8px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
            }

            .vm-voters-table td:last-child {
                text-align: right;
                font-weight: 600;
            }

            .vm-voters-table tr:hover {
                background: rgba(255,255,255,0.03);
            }

            .vm-voters-table .likes-high { color: #00ff88; }
            .vm-voters-table .likes-medium { color: #ffd700; }
            .vm-voters-table .likes-low { color: #888; }

            .vm-voters-table .username-link {
                color: #aaa;
                text-decoration: none;
            }

            .vm-voters-table .username-link:hover {
                color: #fff;
                text-decoration: underline;
            }

            .vm-cache-info {
                font-size: 10px;
                color: #555;
                text-align: center;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid rgba(255,255,255,0.05);
            }

            .vm-clear-cache {
                background: none;
                border: none;
                color: #e94560;
                cursor: pointer;
                font-size: 10px;
                text-decoration: underline;
                margin-left: 8px;
            }

            .vm-footer {
                padding: 12px 16px;
                background: rgba(0,0,0,0.2);
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
                color: #666;
                flex-shrink: 0;
            }

            .vm-status {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .vm-status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #00ff88;
            }

            .vm-status-dot.loading { background: #ffd700; }
            .vm-status-dot.error { background: #ff6b6b; }

            .vm-refresh-btn {
                background: rgba(255,255,255,0.1);
                border: none;
                color: #fff;
                padding: 4px 10px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 11px;
            }

            .vm-refresh-btn:hover {
                background: rgba(255,255,255,0.2);
            }

            .vm-refresh-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .vm-mini-content {
                padding: 12px 16px;
                display: none;
                align-items: center;
                justify-content: space-around;
                color: #fff;
            }

            .vm-mini-content.visible {
                display: flex;
            }

            .vm-mini-score { text-align: center; }
            .vm-mini-score.m { color: #00ff88; }
            .vm-mini-score.s { color: #ff6b6b; }
            .vm-mini-score .num { font-size: 24px; font-weight: 700; }
            .vm-mini-score .label { font-size: 10px; opacity: 0.7; }
            .vm-mini-vs { font-size: 14px; color: #666; }
            .vm-mini-diff { font-size: 16px; font-weight: 600; }
            .vm-mini-diff.positive { color: #00ff88; }
            .vm-mini-diff.negative { color: #ff6b6b; }
            .vm-mini-diff.zero { color: #ffd700; }

            /* Scrollbar */
            .vm-content::-webkit-scrollbar,
            .vm-voters-list::-webkit-scrollbar {
                width: 6px;
            }

            .vm-content::-webkit-scrollbar-track,
            .vm-voters-list::-webkit-scrollbar-track {
                background: rgba(0,0,0,0.2);
                border-radius: 3px;
            }

            .vm-content::-webkit-scrollbar-thumb,
            .vm-voters-list::-webkit-scrollbar-thumb {
                background: #0f3460;
                border-radius: 3px;
            }

            .vm-content::-webkit-scrollbar-thumb:hover,
            .vm-voters-list::-webkit-scrollbar-thumb:hover {
                background: #e94560;
            }
        `;

        try {
            GM_addStyle(css);
        } catch(e) {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    function createUI() {
        const old = document.getElementById('vote-monitor');
        if (old) old.remove();

        const panel = document.createElement('div');
        panel.id = 'vote-monitor';
        if (isMinimized) panel.classList.add('minimized');

        panel.innerHTML = `
            <div class="vm-container">
                <div class="vm-header">
                    <h3>🗳️ Vote Monitor</h3>
                    <div class="vm-header-buttons">
                        <button id="vm-minimize" title="Свернуть/Развернуть">−</button>
                        <button id="vm-close" title="Закрыть">✕</button>
                    </div>
                </div>

                <div class="vm-content ${isMinimized ? 'hidden' : ''}" id="vm-full-content">
                    <div class="vm-candidate maxyao">
                        <div class="vm-candidate-header">
                            <span class="vm-candidate-name">👤 MAXYAO</span>
                            <span class="vm-candidate-votes" id="vm-m-votes">—</span>
                        </div>
                        <div class="vm-candidate-details" id="vm-m-details">Варианты: ${CONFIG.MAXYAO_OPTIONS.join(', ')}</div>
                        <div class="vm-candidate-bar">
                            <div class="vm-candidate-bar-fill" id="vm-m-bar" style="width: 0%"></div>
                        </div>
                    </div>

                    <div class="vm-candidate saiyokoo">
                        <div class="vm-candidate-header">
                            <span class="vm-candidate-name">👤 SAIYOKOO</span>
                            <span class="vm-candidate-votes" id="vm-s-votes">—</span>
                        </div>
                        <div class="vm-candidate-details">Вариант: ${CONFIG.SAIYOKOO_OPTIONS[0]}</div>
                        <div class="vm-candidate-bar">
                            <div class="vm-candidate-bar-fill" id="vm-s-bar" style="width: 0%"></div>
                        </div>
                    </div>

                    <div class="vm-comparison">
                        <div class="vm-comparison-bar">
                            <div class="vm-comparison-bar-m" id="vm-comp-m" style="width: 50%"></div>
                            <div class="vm-comparison-bar-s" id="vm-comp-s" style="width: 50%"></div>
                        </div>
                        <div class="vm-comparison-labels">
                            <span id="vm-pct-m">50%</span>
                            <span id="vm-pct-s">50%</span>
                        </div>
                    </div>

                    <div class="vm-leader" id="vm-leader">
                        Загрузка...
                    </div>

                    <!-- Панель анализа -->
                    <div class="vm-analyze-panel">
                        <div class="vm-analyze-header">
                            <span class="vm-analyze-title">📊 Анализ по группам</span>
                            <button class="vm-analyze-btn" id="vm-analyze-btn">🔍 Анализировать</button>
                        </div>

                        <div id="vm-analyze-content" style="display: none;">
                            <div class="vm-analyze-status" id="vm-analyze-status">
                                Готов к анализу
                            </div>

                            <table class="vm-summary-table" id="vm-summary-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Maxyao</th>
                                        <th>Saiyokoo</th>
                                        <th>Разница</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="label-col">Все голоса</td>
                                        <td class="m-col" id="vm-all-m">—</td>
                                        <td class="s-col" id="vm-all-s">—</td>
                                        <td class="diff-col" id="vm-all-diff">—</td>
                                    </tr>
                                    <tr>
                                        <td class="label-col">Местный+ (≥20)</td>
                                        <td class="m-col" id="vm-local-m">—</td>
                                        <td class="s-col" id="vm-local-s">—</td>
                                        <td class="diff-col" id="vm-local-diff">—</td>
                                    </tr>
                                    <tr>
                                        <td class="label-col">Постоялец+ (≥200)</td>
                                        <td class="m-col" id="vm-regular-m">—</td>
                                        <td class="s-col" id="vm-regular-s">—</td>
                                        <td class="diff-col" id="vm-regular-diff">—</td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- Список голосующих Maxyao -->
                            <div class="vm-voters-section">
                                <button class="vm-voters-toggle maxyao" id="vm-toggle-maxyao">
                                    <span>👤 Голоса за Maxyao (<span id="vm-maxyao-count">0</span>)</span>
                                    <span class="arrow">▼</span>
                                </button>
                                <div class="vm-voters-list" id="vm-voters-maxyao">
                                    <table class="vm-voters-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Пользователь</th>
                                                <th>Симпатии</th>
                                            </tr>
                                        </thead>
                                        <tbody id="vm-voters-maxyao-body">
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Список голосующих Saiyokoo -->
                            <div class="vm-voters-section">
                                <button class="vm-voters-toggle saiyokoo" id="vm-toggle-saiyokoo">
                                    <span>👤 Голоса за Saiyokoo (<span id="vm-saiyokoo-count">0</span>)</span>
                                    <span class="arrow">▼</span>
                                </button>
                                <div class="vm-voters-list" id="vm-voters-saiyokoo">
                                    <table class="vm-voters-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Пользователь</th>
                                                <th>Симпатии</th>
                                            </tr>
                                        </thead>
                                        <tbody id="vm-voters-saiyokoo-body">
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="vm-cache-info" id="vm-cache-info">
                                Кеш: 0 пользователей
                                <button class="vm-clear-cache" id="vm-clear-cache">Очистить</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="vm-mini-content ${isMinimized ? 'visible' : ''}" id="vm-mini-content">
                    <div class="vm-mini-score m">
                        <div class="num" id="vm-mini-m">—</div>
                        <div class="label">Maxyao</div>
                    </div>
                    <div class="vm-mini-vs">VS</div>
                    <div class="vm-mini-score s">
                        <div class="num" id="vm-mini-s">—</div>
                        <div class="label">Saiyokoo</div>
                    </div>
                    <div class="vm-mini-diff" id="vm-mini-diff">—</div>
                </div>

                <div class="vm-footer">
                    <div class="vm-status">
                        <div class="vm-status-dot" id="vm-status-dot"></div>
                        <span id="vm-status-text">Запуск...</span>
                    </div>
                    <button class="vm-refresh-btn" id="vm-refresh">🔄 Обновить</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Обработчики
        document.getElementById('vm-close').onclick = function() {
            isRunning = false;
            if (updateTimer) clearInterval(updateTimer);
            panel.remove();
        };

        document.getElementById('vm-minimize').onclick = toggleMinimize;

        document.getElementById('vm-refresh').onclick = function() {
            if (!this.disabled) {
                updateStats();
            }
        };

        document.getElementById('vm-analyze-btn').onclick = function() {
            if (!isAnalyzing) {
                runAnalysis();
            }
        };

        document.getElementById('vm-toggle-maxyao').onclick = function() {
            this.classList.toggle('open');
            document.getElementById('vm-voters-maxyao').classList.toggle('open');
        };

        document.getElementById('vm-toggle-saiyokoo').onclick = function() {
            this.classList.toggle('open');
            document.getElementById('vm-voters-saiyokoo').classList.toggle('open');
        };

        document.getElementById('vm-clear-cache').onclick = function() {
            userLikesCache = {};
            saveData('userLikesCache', {});
            updateCacheInfo();
        };

        makeDraggable(panel);
        updateCacheInfo();
    }

    function updateCacheInfo() {
        const count = Object.keys(userLikesCache).length;
        const el = document.getElementById('vm-cache-info');
        if (el) {
            el.innerHTML = `Кеш: ${count} пользователей <button class="vm-clear-cache" id="vm-clear-cache">Очистить</button>`;
            document.getElementById('vm-clear-cache').onclick = function() {
                userLikesCache = {};
                saveData('userLikesCache', {});
                updateCacheInfo();
            };
        }
    }

    function toggleMinimize() {
        isMinimized = !isMinimized;
        saveData('isMinimized', isMinimized);

        const panel = document.getElementById('vote-monitor');
        const fullContent = document.getElementById('vm-full-content');
        const miniContent = document.getElementById('vm-mini-content');
        const btn = document.getElementById('vm-minimize');

        if (isMinimized) {
            panel.classList.add('minimized');
            fullContent.classList.add('hidden');
            miniContent.classList.add('visible');
            btn.textContent = '+';
        } else {
            panel.classList.remove('minimized');
            fullContent.classList.remove('hidden');
            miniContent.classList.remove('visible');
            btn.textContent = '−';
        }
    }

    function makeDraggable(el) {
        const header = el.querySelector('.vm-header');
        let offsetX, offsetY, isDragging = false;

        header.onmousedown = function(e) {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            offsetX = e.clientX - el.getBoundingClientRect().left;
            offsetY = e.clientY - el.getBoundingClientRect().top;
        };

        document.onmousemove = function(e) {
            if (!isDragging) return;
            el.style.left = (e.clientX - offsetX) + 'px';
            el.style.top = (e.clientY - offsetY) + 'px';
            el.style.right = 'auto';
        };

        document.onmouseup = function() {
            isDragging = false;
        };
    }

    async function fetchPollIds() {
        const selectors = ['.pollBlock ol li', '.pollOptions li', '.pollOption', 'form ol.pollOptions li'];

        for (const selector of selectors) {
            document.querySelectorAll(selector).forEach((option, index) => {
                const link = option.querySelector('a[href*="poll_response_id"]');
                if (link) {
                    const match = (link.getAttribute('href') || '').match(/poll_response_id=(\d+)/);
                    if (match) {
                        pollIds[index + 1] = parseInt(match[1]);
                    }
                }
            });
            if (Object.keys(pollIds).length > 0) break;
        }

        return Object.keys(pollIds).length > 0;
    }

    function parseNumber(str) {
        if (!str) return 0;
        return parseInt(str.replace(/\s/g, '').replace(/,/g, '')) || 0;
    }

    async function getUserLikes(userHref) {
        if (userLikesCache[userHref] !== undefined) {
            return userLikesCache[userHref];
        }

        try {
            const userUrl = userHref.startsWith('http') ? userHref : `https://lolz.live/${userHref}`;
            const response = await fetch(userUrl);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            let likes = 0;

            // Ищем симпатии разными способами
            const likesSelectors = [
                'a[href*="/likes"] .count',
                'a[href$="likes"] .count',
                '.likeCounterIcon + .count',
                '.counterIcon.likeCounterIcon + .count',
                'dl.pairsJustified dd a[href*="likes"]'
            ];

            for (const sel of likesSelectors) {
                const el = doc.querySelector(sel);
                if (el) {
                    likes = parseNumber(el.textContent);
                    if (likes > 0) break;
                }
            }

            // Альтернативный поиск
            if (likes === 0) {
                const allCounters = doc.querySelectorAll('.count');
                for (const counter of allCounters) {
                    const parent = counter.closest('a');
                    if (parent && parent.href && parent.href.includes('likes')) {
                        likes = parseNumber(counter.textContent);
                        if (likes > 0) break;
                    }
                }
            }

            userLikesCache[userHref] = likes;
            saveData('userLikesCache', userLikesCache);

            return likes;

        } catch (e) {
            console.error(`🗳️ Ошибка для ${userHref}:`, e);
            userLikesCache[userHref] = 0;
            return 0;
        }
    }

    async function getVoters(pollResponseId) {
        try {
            const url = `https://lolz.live/threads/${CONFIG.THREAD_ID}/poll/results?poll_response_id=${pollResponseId}`;
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const voters = new Map(); // href -> username
            const containers = doc.querySelectorAll('ul.voteScroller, ul.overlayScroll');

            containers.forEach(container => {
                container.querySelectorAll('li a.username').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href) {
                        const cleanHref = href.replace(/^\/|\/$/g, '');
                        const username = link.textContent.trim();
                        voters.set(cleanHref, username);
                    }
                });
            });

            return voters;

        } catch (error) {
            console.error('🗳️ Ошибка получения голосов', error);
            return new Map();
        }
    }

    async function getUniqueVoters(optionIndices) {
        const allVoters = new Map();
        const details = {};

        for (const idx of optionIndices) {
            if (pollIds[idx]) {
                await new Promise(r => setTimeout(r, 300));
                const voters = await getVoters(pollIds[idx]);
                details[idx] = voters.size;
                voters.forEach((username, href) => {
                    if (!allVoters.has(href)) {
                        allVoters.set(href, username);
                    }
                });
            } else {
                details[idx] = 0;
            }
        }

        return { voters: allVoters, details };
    }

    async function runAnalysis() {
        if (isAnalyzing) return;
        if (!lastVotersData.maxyao || !lastVotersData.saiyokoo) {
            alert('Сначала дождитесь загрузки данных голосования');
            return;
        }

        isAnalyzing = true;

        const btn = document.getElementById('vm-analyze-btn');
        const statusEl = document.getElementById('vm-analyze-status');
        const contentEl = document.getElementById('vm-analyze-content');

        btn.disabled = true;
        btn.classList.add('loading');
        btn.textContent = '⏳ Анализ...';
        contentEl.style.display = 'block';
        statusEl.className = 'vm-analyze-status loading';

        try {
            const mVoters = lastVotersData.maxyao;
            const sVoters = lastVotersData.saiyokoo;
            const totalToAnalyze = mVoters.size + sVoters.size;
            let processed = 0;

            // Анализ Maxyao
            const mResults = [];
            for (const [href, username] of mVoters) {
                statusEl.textContent = `Анализ: ${++processed}/${totalToAnalyze}...`;
                const likes = await getUserLikes(href);
                mResults.push({ href, username, likes });
                await new Promise(r => setTimeout(r, 50));
            }

            // Анализ Saiyokoo
            const sResults = [];
            for (const [href, username] of sVoters) {
                statusEl.textContent = `Анализ: ${++processed}/${totalToAnalyze}...`;
                const likes = await getUserLikes(href);
                sResults.push({ href, username, likes });
                await new Promise(r => setTimeout(r, 50));
            }

            // Сортировка по убыванию симпатий
            mResults.sort((a, b) => b.likes - a.likes);
            sResults.sort((a, b) => b.likes - a.likes);

            // Подсчёт по группам
            const mGroups = {
                all: mResults.length,
                local: mResults.filter(v => v.likes >= CONFIG.THRESHOLDS.LOCAL).length,
                regular: mResults.filter(v => v.likes >= CONFIG.THRESHOLDS.REGULAR).length
            };

            const sGroups = {
                all: sResults.length,
                local: sResults.filter(v => v.likes >= CONFIG.THRESHOLDS.LOCAL).length,
                regular: sResults.filter(v => v.likes >= CONFIG.THRESHOLDS.REGULAR).length
            };

            // Обновляем сводную таблицу
            updateDiffCell('vm-all', mGroups.all, sGroups.all);
            updateDiffCell('vm-local', mGroups.local, sGroups.local);
            updateDiffCell('vm-regular', mGroups.regular, sGroups.regular);

            // Обновляем таблицы голосующих
            updateVotersTable('vm-voters-maxyao-body', mResults);
            updateVotersTable('vm-voters-saiyokoo-body', sResults);

            document.getElementById('vm-maxyao-count').textContent = mResults.length;
            document.getElementById('vm-saiyokoo-count').textContent = sResults.length;

            statusEl.className = 'vm-analyze-status ready';
            statusEl.textContent = `✓ Проанализировано: ${totalToAnalyze} пользователей`;

            updateCacheInfo();

        } catch (error) {
            console.error('🗳️ Ошибка анализа:', error);
            statusEl.className = 'vm-analyze-status error';
            statusEl.textContent = `❌ Ошибка: ${error.message}`;
        }

        btn.disabled = false;
        btn.classList.remove('loading');
        btn.textContent = '🔍 Анализировать';
        isAnalyzing = false;
    }

    function updateVotersTable(bodyId, results) {
        const tbody = document.getElementById(bodyId);
        if (!tbody) return;

        tbody.innerHTML = results.map((voter, idx) => {
            let likesClass = 'likes-low';
            if (voter.likes >= CONFIG.THRESHOLDS.REGULAR) {
                likesClass = 'likes-high';
            } else if (voter.likes >= CONFIG.THRESHOLDS.LOCAL) {
                likesClass = 'likes-medium';
            }

            return `
                <tr>
                    <td>${idx + 1}</td>
                    <td><a href="https://lolz.live/${voter.href}" target="_blank" class="username-link">${escapeHtml(voter.username)}</a></td>
                    <td class="${likesClass}">${voter.likes.toLocaleString()}</td>
                </tr>
            `;
        }).join('');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function updateDiffCell(prefix, mVal, sVal) {
        const diff = mVal - sVal;
        document.getElementById(`${prefix}-m`).textContent = mVal;
        document.getElementById(`${prefix}-s`).textContent = sVal;

        const diffEl = document.getElementById(`${prefix}-diff`);
        diffEl.textContent = diff > 0 ? `+${diff}` : diff === 0 ? '0' : String(diff);
        diffEl.className = 'diff-col ' + (diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'zero');
    }

    function updateUI(mCount, sCount, mDetails, common) {
        const diff = mCount - sCount;
        const total = mCount + sCount || 1;
        const mPct = (mCount / total * 100);
        const sPct = 100 - mPct;
        const maxCount = Math.max(mCount, sCount, 1);

        document.getElementById('vm-m-votes').textContent = mCount;
        document.getElementById('vm-s-votes').textContent = sCount;
        document.getElementById('vm-mini-m').textContent = mCount;
        document.getElementById('vm-mini-s').textContent = sCount;

        const miniDiff = document.getElementById('vm-mini-diff');
        miniDiff.textContent = diff > 0 ? `+${diff}` : diff === 0 ? '=' : String(diff);
        miniDiff.className = 'vm-mini-diff ' + (diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'zero');

        const detailsStr = CONFIG.MAXYAO_OPTIONS.map(i => `#${i}: ${mDetails[i] || 0}`).join(' + ');
        document.getElementById('vm-m-details').textContent = `${detailsStr} = ${mCount} уник.`;

        document.getElementById('vm-m-bar').style.width = (mCount / maxCount * 100) + '%';
        document.getElementById('vm-s-bar').style.width = (sCount / maxCount * 100) + '%';
        document.getElementById('vm-comp-m').style.width = mPct + '%';
        document.getElementById('vm-comp-s').style.width = sPct + '%';
        document.getElementById('vm-pct-m').textContent = mPct.toFixed(1) + '%';
        document.getElementById('vm-pct-s').textContent = sPct.toFixed(1) + '%';

        const leaderEl = document.getElementById('vm-leader');
        if (diff > 0) {
            leaderEl.className = 'vm-leader maxyao-lead';
            leaderEl.innerHTML = `🏆 Лидирует <b>MAXYAO</b><div class="vm-leader-diff">+${diff} голосов${common > 0 ? ` • Общих: ${common}` : ''}</div>`;
        } else if (diff < 0) {
            leaderEl.className = 'vm-leader saiyokoo-lead';
            leaderEl.innerHTML = `🏆 Лидирует <b>SAIYOKOO</b><div class="vm-leader-diff">+${Math.abs(diff)} голосов${common > 0 ? ` • Общих: ${common}` : ''}</div>`;
        } else {
            leaderEl.className = 'vm-leader tie';
            leaderEl.innerHTML = `⚖️ <b>НИЧЬЯ!</b><div class="vm-leader-diff">${mCount} : ${sCount}</div>`;
        }
    }

    function setStatus(text, state) {
        const dot = document.getElementById('vm-status-dot');
        const textEl = document.getElementById('vm-status-text');
        if (dot) dot.className = 'vm-status-dot' + (state === 'loading' ? ' loading' : state === 'error' ? ' error' : '');
        if (textEl) textEl.textContent = text;
    }

    async function updateStats() {
        if (!isRunning) return;

        const refreshBtn = document.getElementById('vm-refresh');
        if (refreshBtn) refreshBtn.disabled = true;
        setStatus('Обновление...', 'loading');

        try {
            const maxyaoData = await getUniqueVoters(CONFIG.MAXYAO_OPTIONS);
            const saiyokooData = await getUniqueVoters(CONFIG.SAIYOKOO_OPTIONS);

            // Сохраняем для анализа
            lastVotersData.maxyao = maxyaoData.voters;
            lastVotersData.saiyokoo = saiyokooData.voters;

            const mCount = maxyaoData.voters.size;
            const sCount = saiyokooData.voters.size;

            // Подсчёт общих
            let common = 0;
            for (const href of maxyaoData.voters.keys()) {
                if (saiyokooData.voters.has(href)) common++;
            }

            updateUI(mCount, sCount, maxyaoData.details, common);

            const timeStr = new Date().toLocaleTimeString('ru-RU');
            setStatus(`✓ ${timeStr}`, 'ok');
            console.log(`🗳️ Maxyao=${mCount}, Saiyokoo=${sCount}, Δ=${mCount-sCount}`);

        } catch (error) {
            console.error('🗳️ Ошибка:', error);
            setStatus('Ошибка!', 'error');
        }

        if (refreshBtn) refreshBtn.disabled = false;
    }

    async function init() {
        console.log('🗳️ Vote Monitor: Инициализация...');

        addStyles();
        createUI();

        setStatus('Поиск опроса...', 'loading');

        const found = await fetchPollIds();

        if (!found) {
            setStatus('Опрос не найден!', 'error');
            return;
        }

        await updateStats();

        updateTimer = setInterval(updateStats, CONFIG.UPDATE_INTERVAL);
        console.log(`🗳️ Vote Monitor: Запущен!`);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1000);
    } else {
        window.addEventListener('load', function() {
            setTimeout(init, 1000);
        });
    }

})();