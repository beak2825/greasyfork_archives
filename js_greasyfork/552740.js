// ==UserScript==
// @name         GameObserver + Start Capture + Viewer
// @namespace    http://tampermonkey.net/
// @version      2.0.4
// @description  GameObserver с включаемым автобоем (F1) и просмотром состояния (F2)
// @author       asd
// @match        https://pokelegenda.ru/game*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552740/GameObserver%20%2B%20Start%20Capture%20%2B%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/552740/GameObserver%20%2B%20Start%20Capture%20%2B%20Viewer.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // === ОПРЕДЕЛЕНИЕ НАСТРОЕК ===
    const SETTINGS_DEFINITION = {
        GAME_LOOP_INTERVAL: { default: 100, type: 'number', min: 50, label: 'Интервал цикла (мс)' },
        HP_FOR_HEAL: { default: 25, type: 'number', min: 0, label: 'Порог HP для лечения' },
        PP_FOR_HEAL: { default: 135, type: 'number', min: 0, label: 'Порог PP для лечения' },
        ATTACK_DELAY: { default: 1500, type: 'number', min: 100, label: 'Задержка атаки (мс)' },
        MOVE_DELAY: { default: 1500, type: 'number', min: 100, label: 'Задержка перехода (мс)' },
        FORBIDDEN_MOVES: { default: [''], type: 'textarea', label: 'Запрещённые атаки (через запятую)', helper: 'Пример: Hidden Power Dark, psybeam' },
        HEAL_ROUTE: { default: ['Путь победителя', 'Дорога 23', 'Дорога 22', 'Виридиан'], type: 'textarea', label: 'Маршрут лечения (через запятую)', helper: 'Точные названия локаций через запятую' }
    };

    // === ОПРЕДЕЛЕНИЕ ДАННЫХ ДЛЯ ОТСЛЕЖИВАНИЯ (F2) ===
    const DATA_DEFINITIONS = {
        currentLocation: () => document.querySelector(".__location_name_txt")?.textContent?.trim() || "",
        locationMoves: () => {
            const locationMovesContainer = document.querySelector("div.move.border4px.__location_moves_list");
            if (!locationMovesContainer) return [];
            const movesList = [];
            locationMovesContainer.querySelectorAll("div.target").forEach((moveEl) => {
                const moveName = moveEl.textContent?.trim();
                if (moveName) {
                    movesList.push({ name: moveName, el: moveEl });
                }
            });
            return movesList;
        },
        isInBattle: () => !!document.querySelector(".battle-content"),
        userHpBar: () => parseFloat(document.querySelector('.rstatbar .hptext')?.innerText),
        battleData: () => {
            const moves = document.querySelectorAll(".move");
            const allMoves = [];
            const allowedMoves = [];
            let totalAllPP = 0;
            let totalAllowedPP = 0;

            moves.forEach((moveEl) => {
                const moveId = moveEl.dataset.moveId;
                const ppEl = moveEl.querySelector(".move-pp");
                const typeEl = moveEl.querySelector(".move-type");
                const categoryClass = moveEl.className;

                if (!moveId || !ppEl) return;

                const ppText = ppEl.textContent.trim();
                const [current, max] = ppText.split("/").map(Number);
                const currentPP = current || 0;
                const maxPP = max || 0;

                let category = "status";
                if (categoryClass.includes("special")) {
                    category = "special";
                } else if (categoryClass.includes("physical")) {
                    category = "physical";
                }

                const type = typeEl ? typeEl.textContent.trim() : "Unknown";

                const moveInfo = {
                    name: moveId,
                    currentPP,
                    maxPP,
                    type,
                    category,
                    el: moveEl,
                };

                allMoves.push(moveInfo);
                totalAllPP += currentPP;

                // Фильтрация разрешенных атак
                if (!SETTINGS.FORBIDDEN_MOVES.includes(moveId.toLowerCase()) && moveInfo.category !== 'status') {
                    allowedMoves.push(moveInfo);
                    totalAllowedPP += currentPP;
                }
            });

            return {
                allMoves,
                allowedMoves,
                totalAllPP,
                totalAllowedPP,
            };
        },
        wildPokemon: () => {
            const btn = document.querySelector(".user-assault");
            return {
                status: btn ? btn.classList.contains("act") : false,
                el: btn
            };
        }
    };

    // === ЗАГРУЗКА НАСТРОЕК ИЗ ХРАНИЛИЩА ===
    const SETTINGS = {};
    for (const [key, def] of Object.entries(SETTINGS_DEFINITION)) {
        SETTINGS[key] = GM_getValue(key, def.default);
    }

    // === СОХРАНЕНИЕ НАСТРОЕК ===
    function saveSetting(key, value) {
        GM_setValue(key, value);
        SETTINGS[key] = value; // Обновляем локальный объект
    }

    // === ПЕРЕМЕННЫЕ СОСТОЯНИЯ ===
    let isGameLoop = false;
    let timeForHeal = false;
    let autobattle = false;
    let gameLoopIntervalId = null; // Хранит ID текущего интервала

    // === ЦЕНТРАЛИЗОВАННЫЙ ОБЪЕКТ ДАННЫХ (Data) ===
    const Data = new Proxy({}, {
        get(target, prop) {
            if (DATA_DEFINITIONS[prop]) {
                try {
                    return DATA_DEFINITIONS[prop]();
                } catch (e) {
                    console.warn(`Ошибка при получении данных ${prop}:`, e);
                    return undefined;
                }
            }
            return undefined;
        }
    });

    // === ОБЪЕКТ ИГРЫ (Game) ===
    const Game = {};
    for (const prop of Object.keys(DATA_DEFINITIONS)) {
        Object.defineProperty(Game, prop, {
            get: () => Data[prop],
            enumerable: true
        });
    }

    // === ЦИКЛ ИГРЫ ===
    async function GameLoop() {
        if (isGameLoop) return;
        isGameLoop = true;

        try {
            if (timeForHeal && !Game.isInBattle) {
                await Heal();
                return;
            }
            if (Game.isInBattle && Game.battleData.allMoves.length > 0 && autobattle) {
                if (Game.battleData.totalAllowedPP <= SETTINGS.PP_FOR_HEAL || Game.userHpBar <= SETTINGS.HP_FOR_HEAL) {
                    if (Game.wildPokemon.status) Game.wildPokemon.el.click();
                    if (!timeForHeal) timeForHeal = true;
                }
                for (const attack of Game.battleData.allowedMoves) {
                    if (attack.currentPP > 0 && !document.querySelector('.nav-disable[style*="display: block"]')) {
                        await sleep(SETTINGS.ATTACK_DELAY)
                        attack.el.click()
                        return
                    }
                }
            }
        } catch (err) {
            // silent
        } finally {
            isGameLoop = false;
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function Heal() {
        let route = SETTINGS.HEAL_ROUTE.slice();
        route.push('покецентр');
        let back_route = SETTINGS.HEAL_ROUTE.slice();
        back_route.reverse();
        back_route.push(Game.currentLocation);
        back_route.shift();

        for (const step of route) {
            for (const location of Game.locationMoves) {
                if (location.name.toLowerCase() === step.toLowerCase()) {
                    location.el.click();
                    await sleep(SETTINGS.MOVE_DELAY);
                }
            }
        }
        document.querySelector('.__npc_id_5').click();
        await sleep(SETTINGS.MOVE_DELAY);
        document.querySelector('.medical.__steep_1').click();
        await sleep(SETTINGS.MOVE_DELAY);
        if (document.querySelector('.exit.__steep_0')) {
            document.querySelector('.exit.__steep_0').click();
            await sleep(SETTINGS.MOVE_DELAY);
        }
        Game.locationMoves[0].el.click();
        await sleep(SETTINGS.MOVE_DELAY);
        for (const step of back_route) {
            for (const location of Game.locationMoves) {
                if (location.name.toLowerCase() === step.toLowerCase()) {
                    location.el.click();
                    await sleep(SETTINGS.MOVE_DELAY);
                }
            }
        }
        Game.wildPokemon.el.click();
        timeForHeal = false;
    }

    // === VIEWER (F2) ===
    let viewerVisible = false;
    let viewerEl = null;
    let viewerUpdater = null;

    function toggleViewer() {
        viewerVisible = !viewerVisible;

        if (viewerVisible) {
            if (!viewerEl) {
                viewerEl = document.createElement('pre');
                viewerEl.id = 'game-viewer';
                Object.assign(viewerEl.style, {
                    position: 'fixed',
                    top: '50px',
                    right: '4%',
                    width: '40%',
                    maxWidth: '40%',
                    background: 'rgba(10, 10, 10, 0.9)',
                    color: '#9f9',
                    fontSize: '12px',
                    padding: '10px 14px',
                    border: '1px solid #0f0',
                    borderRadius: '8px',
                    boxShadow: '0 0 10px rgba(0,255,0,0.3)',
                    zIndex: '999999',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Consolas, monospace',
                    pointerEvents: 'none',
                    opacity: '0',
                    transition: 'opacity 0.3s ease'
                });
                document.body.appendChild(viewerEl);
                requestAnimationFrame(() => viewerEl.style.opacity = '1');
            } else {
                viewerEl.style.display = 'block';
                requestAnimationFrame(() => viewerEl.style.opacity = '1');
            }

            const viewerCache = {};
            const lastValidBattleData = {
                totalPP: 'N/A',
                totalPPAllowed: 'N/A',
                movesList: 'N/A',
                allowedMovesList: 'N/A'
            };

            viewerUpdater = setInterval(() => {
                const snapshot = {};
                for (const prop of Object.keys(DATA_DEFINITIONS)) {
                    try {
                        snapshot[prop] = Data[prop];
                    } catch (e) {
                        snapshot[prop] = `Ошибка: ${e.message}`;
                    }
                }

                if (snapshot.battleData && snapshot.battleData.allMoves.length > 0) {
                    lastValidBattleData.totalPP = snapshot.battleData.totalAllPP;
                    lastValidBattleData.totalPPAllowed = snapshot.battleData.totalAllowedPP;
                    lastValidBattleData.movesList = snapshot.battleData.allMoves.map(m => `${m.name}(${m.currentPP})`).join(', ');
                    lastValidBattleData.allowedMovesList = snapshot.battleData.allowedMoves.map(m => `${m.name}(${m.currentPP})`).join(', ');
                }

                const lines = [];
                lines.push('====== НАСТРОЙКИ =======');
                for (const [key, def] of Object.entries(SETTINGS_DEFINITION)) {
                    let value = SETTINGS[key];
                    if (Array.isArray(value)) value = `[${value.join(', ')}]`;
                    lines.push(`${def.label}: ${value}`);
                }
                lines.push(`Автобой: ${autobattle ? 'ON' : 'OFF'}`);
                lines.push(''); // Пустая строка

                lines.push('======= ПЕРЕМЕННЫЕ ======');
                lines.push(`Дикие покемоны: ${snapshot.wildPokemon?.status}`);
                lines.push(`Текущая локация: "${snapshot.currentLocation}"`);
                lines.push(`Переходы: [${(snapshot.locationMoves || []).map(m => m.name).join(', ')}]`);
                lines.push(''); // Пустая строка

                lines.push('======== ДЕБАГ =========');
                lines.push(`В бою: ${snapshot.isInBattle ? 'Да' : 'Нет'}`);
                lines.push(`Хп бар: ${snapshot.userHpBar !== undefined ? snapshot.userHpBar : 'N/A'}`);
                lines.push(`Лечение нужно: ${timeForHeal ? 'Да' : 'Нет'}`);
                lines.push(`Общий PP (все): ${lastValidBattleData.totalPP}`);
                lines.push(`Атаки (все): ${lastValidBattleData.movesList}`);
                lines.push(`Общий PP (разр.): ${lastValidBattleData.totalPPAllowed}`);
                lines.push(`Атаки (разр.): ${lastValidBattleData.allowedMovesList}`);

                viewerEl.textContent = lines.join('\n');
            }, 200);
        } else {
            if (viewerEl) {
                viewerEl.style.opacity = '0';
                setTimeout(() => {
                    viewerEl.style.display = 'none';
                }, 300);
            }
            if (viewerUpdater) clearInterval(viewerUpdater);
        }
    }

    // === НАСТРОЙКИ (F3) ===
    let settingsUI = null;
    let originalValues = null;

    function openSettingsUI() {
        if (settingsUI) {
            // Закрытие → сохранение
            saveSettingsFromUI();
            document.body.removeChild(settingsUI);
            settingsUI = null;
            originalValues = null;
            return;
        }

        originalValues = {};
        for (const [key, def] of Object.entries(SETTINGS_DEFINITION)) {
            originalValues[key] = Array.isArray(def.default) ? [...SETTINGS[key]] : SETTINGS[key];
        }

        settingsUI = document.createElement('div');
        Object.assign(settingsUI.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.75)',
            zIndex: '9999999',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#eee',
            fontFamily: 'Consolas, monospace',
            fontSize: '14px'
        });

        const panel = document.createElement('div');
        Object.assign(panel.style, {
            background: '#111',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #0a0',
            width: '500px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 0 15px rgba(0,255,0,0.3)'
        });

        let formHTML = `<h3 style="margin-top:0; color:#0f0; text-align:center;">⚙️ Настройки Покелегенда Бота</h3>`;
        formHTML += `<p style="font-size:12px; color:#999; margin-bottom:15px;">Изменения сохранятся при закрытии (F3 или Esc).</p>`;

        for (const [key, def] of Object.entries(SETTINGS_DEFINITION)) {
            const currentValue = SETTINGS[key];
            let inputHTML = '';

            if (def.type === 'number') {
                inputHTML = `<input type="number" id="inp_${key}" value="${currentValue}" min="${def.min}" style="width:100%; margin:6px 0; background:#222; color:#fff; border:1px solid #0a0; padding:4px;">`;
            } else if (def.type === 'textarea') {
                const displayValue = Array.isArray(currentValue) ? currentValue.join(', ') : currentValue;
                inputHTML = `<textarea id="inp_${key}" rows="${def.rows || 2}" style="width:100%; margin:6px 0; background:#222; color:#fff; border:1px solid #0a0; padding:4px;">${displayValue}</textarea>`;
            }

            formHTML += `<label>${def.label}:<br>${inputHTML}`;
            if (def.helper) {
                formHTML += `<small style="color:#777;">${def.helper}</small>`;
            }
            formHTML += `</label><br><br>`;
        }

        panel.innerHTML = formHTML;
        settingsUI.appendChild(panel);
        document.body.appendChild(settingsUI);
    }

    // Функция для обновления интервала GameLoop
    function updateGameLoopInterval(newInterval) {
        if (gameLoopIntervalId !== null) {
            clearInterval(gameLoopIntervalId);
        }
        gameLoopIntervalId = setInterval(GameLoop, newInterval);
        console.log(`Интервал GameLoop обновлён до ${newInterval} мс`);
    }

    function saveSettingsFromUI() {
        if (!settingsUI || !originalValues) return;

        let gameLoopIntervalChanged = false;

        for (const [key, def] of Object.entries(SETTINGS_DEFINITION)) {
            let newValue;
            const element = document.getElementById(`inp_${key}`);
            if (element) {
                if (def.type === 'number') {
                    newValue = parseInt(element.value) || def.default;
                    // Проверяем, изменилось ли значение интервала
                    if (key === 'GAME_LOOP_INTERVAL' && newValue !== originalValues[key]) {
                        gameLoopIntervalChanged = true;
                    }
                } else if (def.type === 'textarea') {
                    newValue = element.value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
                    if (newValue.length === 1 && newValue[0] === '') newValue = [];
                }

                const originalValue = originalValues[key];
                if (JSON.stringify(newValue) !== JSON.stringify(originalValue)) {
                    saveSetting(key, newValue);
                }
            }
        }

        // Если интервал изменился, обновляем его
        if (gameLoopIntervalChanged) {
            updateGameLoopInterval(SETTINGS.GAME_LOOP_INTERVAL);
        }
    }

    // === КЛАВИШИ ===
    unsafeWindow.addEventListener('keydown', (e) => {
        if (e.code === 'F1') {
            e.preventDefault();
            autobattle = !autobattle;
        }
        if (e.code === 'F2') {
            e.preventDefault();
            toggleViewer();
        }
        if (e.code === 'F3') {
            e.preventDefault();
            openSettingsUI();
        }
    });

    // Экспорт объектов для доступа из консоли
    unsafeWindow.Game = Game;
    unsafeWindow.GameData = Data;
    unsafeWindow.SETTINGS = SETTINGS;

    // Запуск основного цикла и сохранение его ID
    updateGameLoopInterval(SETTINGS.GAME_LOOP_INTERVAL); // Используем новую функцию
})();