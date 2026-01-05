// ==UserScript==
// @name         MetroWordle Helper
// @namespace    http://tampermonkey.net/
// @version      8.23
// @description  为 MetroWordle 游戏提供概率猜测辅助
// @author       bilibili@lvshu
// @match        https://metrowordle.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558921/MetroWordle%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/558921/MetroWordle%20Helper.meta.js
// ==/UserScript==
(function()
 {
    'use strict';
    // --- 动态加载依赖 ---
    const pinyinScript = document.createElement('script');
    pinyinScript.src = 'https://unpkg.com/pinyin-pro';
    document.head.appendChild(pinyinScript);
    const faScript = document.createElement('script');
    faScript.src = 'https://kit.fontawesome.com/3c5e781be5.js';
    faScript.crossOrigin = 'anonymous';
    document.head.appendChild(faScript);
    const checkDependencies = setInterval(() =>
                                          {
        if (window.pinyinPro && window.FontAwesomeKitConfig)
        {
            clearInterval(checkDependencies);
            console.log("pinyin-pro and Font Awesome loaded.");
            initializeApp();
        }
        else if (window.pinyinPro && document.querySelector('link[href*="font-awesome"]'))
        {
            clearInterval(checkDependencies);
            console.log("pinyin-pro and existing Font Awesome loaded.");
            initializeApp();
        }
    }, 100);
    // --- 性能优化常量 ---
    let MAX_GUESS_POOL_SIZE = 300;
    const MAX_CANDIDATES = 500; // 限制候选集大小
    // --- MODIFICATION: Add helper functions for localStorage handling ---
    const STORAGE_KEY = 'metrowordle_data';
    const getGameIdFromUrl = () =>
    {
        const url = window.location.href;
        let match = url.match(/\/game\/play\/(\d+)/);
        if (match)
        {
            return {
                id: parseInt(match[1]),
                mode: 'single'
            };
        }
        match = url.match(/\/ring\/play\?game_id=(\d+)/);
        if (match)
        {
            return {
                id: parseInt(match[1]),
                mode: 'duel'
            };
        }
        // 每日挑战：无 ID，但仍是单人模式
        if (url.includes('/challenge') || url === 'https://metrowordle.fun/' || url.includes('/?') || url.includes('#'))
        {
            return {
                id: null,
                mode: 'single'
            };
        }
        return {
            id: null,
            mode: null
        };
    };
    const loadStoredData = (gameId) =>
    {
        if (!gameId) return {
            words: null,
            answers:
            {},
            firstWords:
            {}
        };
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const gameData = stored.find(item => item.id === gameId);
        if (gameData)
        {
            const answers = {};
            const firstWords = {};
            gameData.wordsAndAnswers?.forEach((
                {
                    word,
                    num
                }) =>
                                              {
                answers[word] = num;
            });
            gameData.firstWords?.forEach((
                {
                    length,
                    firstWord
                }) =>
                                         {
                firstWords[length] = firstWord;
            });
            return {
                words: gameData.words,
                answers,
                firstWords
            };
        }
        return {
            words: null,
            answers:
            {},
            firstWords:
            {}
        };
    };
    const saveStoredData = (gameId, mode, words, answers, firstWords) =>
    {
        if (!gameId || !words) return;
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const gameDataIndex = stored.findIndex(item => item.id === gameId);
        const wordsAndAnswers = Object.entries(answers).map(([word, num]) => (
            {
                word,
                num
            }));
        const firstWordsList = Object.entries(firstWords).map(([length, firstWord]) => (
            {
                length: parseInt(length),
                firstWord
            }));
        const newGameData = {
            id: gameId,
            mode: mode,
            words: words,
            wordsAndAnswers: wordsAndAnswers,
            firstWords: firstWordsList
        };

        if (gameDataIndex !== -1)
        {
            stored[gameDataIndex] = newGameData;
        }
        else
        {
            stored.push(newGameData);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        console.log(`Saved data for game ID: ${gameId}`);
    };
    // --- END MODIFICATION ---
    function initializeApp()
    {
        // --- 可视化反馈初始化函数（提升到 initializeApp 作用域）---
        const initVisualFeedback = (length = 5) =>
        {
            const selfContainer = document.getElementById('visual-feedback-self');
            const duelContainer = document.getElementById('visual-feedback-duel');
            if (!selfContainer || !duelContainer)
            {
                console.warn('可视化反馈容器未找到，跳过初始化');
                return;
            }
            selfContainer.innerHTML = '';
            duelContainer.innerHTML = '';
            const createFeedbackBox = (container, isDuel = false) =>
            {
                const box = document.createElement('div');
                box.style.width = '36px';
                box.style.height = '36px';
                box.style.border = '1px solid #ccc';
                box.style.borderRadius = '4px';
                box.style.display = 'flex';
                box.style.alignItems = 'center';
                box.style.justifyContent = 'center';
                box.style.cursor = 'pointer';
                box.style.backgroundColor = '#787c7eaa'; // 灰色
                box.dataset.value = '0';
                box.addEventListener('click', () =>
                                     {
                    let val = parseInt(box.dataset.value);
                    val = (val + 1) % 4;
                    box.dataset.value = val;
                    box.style.backgroundColor =
                        val === 1 ? '#6aaa64aa' : // green
                    val === 2 ? '#c9b458aa' : // yellow
                    val === 3 ? '#4a90e2aa' : // blue
                    '#787c7eaa'; // gray
                });
                container.appendChild(box);
            };
            for (let i = 0; i < length; i++)
            {
                createFeedbackBox(selfContainer, false);
                createFeedbackBox(duelContainer, true);
            }
        };
        console.log("Initializing MetroWordle Helper...");
        const pinyinPro = window.pinyinPro;
        const pinyinCache = new Map();
        const getPinyin = (char) => {
            if (!pinyinCache.has(char)) {
                pinyinCache.set(char, pinyinPro.pinyin(char, {
                    toneType: 'num',
                    v: true,
                    nonZh: 'consecutive'
                }));
            }
            return pinyinCache.get(char);
        };
        // --- 模态管理 ---
        const MODAL_STATES = {
            MINIMAL: 'minimal',
            COMPACT: 'compact',
            FULL: 'full'
        };
        let currentModalState = MODAL_STATES.MINIMAL;
        let isManualInputVisible = false; // 追踪模态三中手动输入区是否可见
        // --- ✅ 新增：将 updateUI 提升到顶层作用域 ---
        let updateUI; // 声明变量，稍后在 createUI 中赋值函数

        // --- ✅ 在这里添加 getFeedbackFromVisual 函数 ---
        const getFeedbackFromVisual = (containerId) =>
        {
            const boxes = document.querySelectorAll(`#${containerId} > div`);
            return Array.from(boxes).map(box => parseInt(box.dataset.value));
        };
        const initVisualFeedbackSimulate = (length = 5) => {
            const selfContainer = document.getElementById('visual-feedback-simulate-self');
            const duelContainer = document.getElementById('visual-feedback-simulate-duel');
            if (!selfContainer || !duelContainer) return;
            selfContainer.innerHTML = '';
            duelContainer.innerHTML = '';
            const createBox = (container) => {
                const box = document.createElement('div');
                box.style.width = '32px';
                box.style.height = '32px';
                box.style.border = '1px solid #ccc';
                box.style.borderRadius = '4px';
                box.style.display = 'flex';
                box.style.alignItems = 'center';
                box.style.justifyContent = 'center';
                box.style.cursor = 'pointer';
                box.style.backgroundColor = '#787c7eaa';
                box.dataset.value = '0';
                box.addEventListener('click', () => {
                    let val = (parseInt(box.dataset.value) + 1) % 4;
                    box.dataset.value = val;
                    box.style.backgroundColor =
                        val === 1 ? '#6aaa64aa' :
                    val === 2 ? '#c9b458aa' :
                    val === 3 ? '#4a90e2aa' : '#787c7eaa';
                });
                container.appendChild(box);
            };
            for (let i = 0; i < length; i++) {
                createBox(selfContainer);
                createBox(duelContainer);
            }
            // 根据是否对战模式显示对手区
            const isDuel = isDuelMode;
            duelContainer.parentElement.style.display = isDuel ? 'block' : 'none';
        };
        const handleSimulateSubmit = () => {
            if (!isInitialized || !candidates.length) {
                alert('请先初始化模型（确保词库和字数已加载）');
                return;
            }

            const guessInput = document.getElementById('simulate-guess-word')?.value.trim();
            const selfFB = getFeedbackFromVisual('visual-feedback-simulate-self');
            let duelFB = null;
            if (isDuelMode) {
                duelFB = getFeedbackFromVisual('visual-feedback-simulate-duel');
            }

            if (!guessInput) {
                log('⚠️ 模拟：请输入猜测词');
                return;
            }
            if (selfFB.length !== targetLength) {
                log(`⚠️ 模拟：我的反馈长度应为 ${targetLength}`);
                return;
            }
            if (duelFB && duelFB.length !== targetLength) {
                log(`⚠️ 模拟：对手反馈长度应为 ${targetLength}`);
                return;
            }

            // 检查 guess 是否在当前词库中（dbByLen[targetLength]）
            const validWords = dbByLen[targetLength] || [];
            if (!validWords.includes(guessInput)) {
                log(`⚠️ 模拟："${guessInput}" 不在当前 ${targetLength} 字词库中`);
                return;
            }

            // 🧪 创建**临时候选集副本**（不污染全局 candidates）
            let tempCandidates = candidates.map(([w, p]) => [w, p]);

            // Step 1: 用 selfFeedback 过滤
            const filteredBySelf = tempCandidates.filter(([cand]) => {
                const fb = getFeedback(guessInput, cand);
                return fb.length === selfFB.length && fb.every((v, i) => v === selfFB[i]);
            });

            if (filteredBySelf.length === 0) {
                document.getElementById('simulate-result').style.display = 'block';
                document.getElementById('simulate-result').innerHTML = `❌ 模拟失败：无候选词匹配你的反馈。`;
                return;
            }

            // Step 2: （可选）应用 duelFeedback 过滤
            let finalTemp = filteredBySelf;
            if (duelFB && enableDuelFeedback && !isTrivialDuelFeedback(duelFB)) {
                const compatSet = getDuelCompatibleAnswers(duelFB, targetLength);
                const filteredByDuel = filteredBySelf.filter(([w]) => compatSet.has(w));
                if (filteredByDuel.length >= 1 && filteredByDuel.length / filteredBySelf.length >= 0.02) {
                    finalTemp = filteredByDuel;
                }
            }

            // 归一化（临时）
            const total = finalTemp.reduce((s, [_, p]) => s + p, 0);
            const normalized = finalTemp.map(([w, p]) => [w, p / total]);

            // 💾 保存临时候选集到全局作用域（仅用于同步）
            window._lastSimulationCandidates = normalized;

            // Step 3: 在临时候选集上找推荐词
            const nextGuess = findBestGuess(normalized, targetLength);

            // Step 4: 显示结果
            const resultDiv = document.getElementById('simulate-result');
            resultDiv.style.display = 'block';

            let html = `✅ 模拟成功！<br>
    - 猜测词: <strong>${guessInput}</strong><br>
    - 剩余候选: ${normalized.length} 个<br>`;

            if (normalized.length === 1) {
                html += `🎯 答案很可能是: <strong>${normalized[0][0]}</strong>`;
            } else if (nextGuess) {
                html += `➡️ 下一推荐: <strong>${nextGuess}</strong>`;
            } else {
                html += `ℹ️ 无法生成新推荐词`;
            }

            resultDiv.innerHTML = html;
            log(`🔍 模拟完成: "${guessInput}" → 剩余 ${normalized.length} 个候选`);
            // 显示同步按钮（仅当有有效候选集时）
            const syncBtnContainer = document.getElementById('simulate-sync-btn-container');
            if (normalized.length > 0) {
                syncBtnContainer.style.display = 'block';
            } else {
                syncBtnContainer.style.display = 'none';
            }
        };
        const resetSimulation = () => {
            document.getElementById('simulate-guess-word').value = '';
            initVisualFeedbackSimulate(targetLength || 5);
            document.getElementById('simulate-result').style.display = 'none';
            log('🔄 模拟状态已重置');
        };
        // --- 悬浮窗 UI 相关 ---
        const createUI = () =>
        {
            const container = document.createElement('div');
            container.id = 'metrowordle-helper-container';
            container.innerHTML = `
                <div id="metrowordle-helper-header" style="display: flex; justify-content: center; align-items: center; background: #6aaa6400; color: white; border-radius: 50px; cursor: move; position: relative; width: 50px; height: 50px;">
                    <button id="toggle-modal-btn-1" class="helper-btn" style="display: block;" title="展开">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                </div>
                <div id="metrowordle-helper-content" style="display: none; padding: 10px;">
                    <div id="compact-buttons" class="compact-btns-container" style="display: none; flex-direction: column; gap: 8px; align-items: center;">
                        <button id="toggle-modal-btn-2" class="helper-btn" title="展开到模态三">
                            <i class="fa-solid fa-angle-left"></i>
                        </button>
                        <button id="fill-input-btn" class="helper-btn" title="自动填入推荐词">
                            <i class="fa-solid fa-keyboard"></i>
                        </button>
                        <button id="manual-input-btn" class="helper-btn" title="手动输入数据">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </div>
                    <div id="full-content" style="display: none;">
                        <!-- 将收起按钮放在状态栏旁边 -->
                        <div id="helper-status-header" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <div id="helper-status" style="color: #333; padding: 8px; border-radius: 8px; font-weight: bold; font-size: 0.9em; flex-grow: 1;">状态: 未初始化</div>
                            <button id="toggle-modal-btn-2-full" class="helper-btn" title="收起至模态二" style="margin-left: 8px;">
                                <i class="fa-solid fa-angle-down"></i>
                            </button>
                        </div>
                        <div id="helper-log" style="max-height: 150px; min-height: 60px; overflow-y: auto; margin-top: 5px; font-size: 0.85em; font-family: monospace; white-space: pre-line; padding: 8px; border-radius: 8px; display: block;"></div>
                        <div id="recommended-word" style="margin-top: 5px; margin-bottom: 5px; font-weight: bold; color: #53b31c; text-align: center; font-size: 1.1em; padding: 5px 0;"></div>
                        <div id="manual-imputs-full" style="margin-top: 0px;">
                            <div style="display: flex; gap: 8px; align-items: center;">
                                <button id="refresh-data-btn-full"  class="liquid-glass-btn" style="flex-grow: 1; padding: 8px; background-color: #f59e0bcf; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                                    <i class="fa-solid fa-refresh"></i> 刷新数据
                                </button>
                                <button id="reset-model-btn"  class="liquid-glass-btn" style="flex-grow: 1; padding: 8px; background-color: #f59e0bcf; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                                    <i class="fa-solid fa-warning"></i> 重置模型
                                </button>
                            </div>
                        </div>
                        <div id="manual-inputs-full" style="margin-top: 10px;">
                            <!-- 新增：导入 localStorage 数据 -->
                            <div style="margin-bottom: 15px; padding-top: 10px; border-top: 1px solid #ccc;">
                                <div style="display: flex; gap: 8px; align-items: center;">
                                    <button id="import-localstorage-btn"  class="liquid-glass-btn" style="flex-grow: 1; padding: 8px; background-color: #4a90e2cf; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                                        <i class="fa-solid fa-upload"></i> 导入数据
                                    </button>
                                    <button id="export-localstorage-btn"  class="liquid-glass-btn" style="flex-grow: 1; padding: 8px; background-color: #6aaa64cf; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                                        <i class="fa-solid fa-download"></i> 导出数据
                                    </button>
                                </div>
                            </div>
                            <!-- === 可折叠题库设置区 === -->
                            <div style="margin-top: 10px; margin-bottom: 10px;">
                                <button id="toggle-tiku-settings-btn" class="liquid-glass-btn" style="width: 100%; padding: 6px; background-color: #a0a0a0cf; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85em;">
                                    <i class="fa-solid fa-gear"></i> 题库设置
                                </button>
                                <div id="tiku-settings-section" style="display: none; margin-top: 3px; padding: 10px; background: #f9f9f940; border-radius: 8px;">
                                    <div style="margin-bottom: 3px;">
                                        <label style="display: block; margin-bottom: 1.5px; font-size: 0.9em;">题库 ID (Game ID):</label>
                                        <input type="number" id="manual-game-id-full" min="0" value="" placeholder="留空则使用 daily-YYYYMMDD" style="width: 100%; padding: 6px; box-sizing: border-box; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ccc;" />
                                    </div>
                                    <div style="margin-bottom: 3px;">
                                        <label style="display: block; margin-bottom: 1.5px; font-size: 0.9em;">字数 (Length):</label>
                                        <input type="number" id="manual-length-full" min="1" max="10" value="" style="width: 100%; padding: 6px; box-sizing: border-box; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ccc;" />
                                    </div>
                                    <div style="margin-bottom: 3px;">
                                        <label style="display: block; margin-bottom: 1.5px; font-size: 0.9em;">模式 (Mode): </label>
                                        <select id="manual-mode-full" style="width: 100%; padding: 6px; box-sizing: border-box; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ccc;">
                                            <option value="1">单人模式</option>
                                            <option value="2" selected>对战模式</option>
                                        </select>
                                    </div>
                                    <div style="margin-bottom: 0px;">
                                        <label style="display: block; margin-bottom: 1.5px; font-size: 0.9em;">词库 (一行一个，用于备选):</label>
                                        <textarea id="manual-words-full" rows="4" cols="30" placeholder="请输入词库，每行一个..." style="width: 100%; min-height: 70px; box-sizing: border-box; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ccc; padding: 5px;"></textarea>
                                    </div>
                                </div>
                            </div>
                            <!-- === 模拟猜词区 === -->
                            <div style="margin-top: 10px; margin-bottom: 10px;">
                              <button id="toggle-simulate-settings-btn" class="liquid-glass-btn" style="width: 100%; padding: 6px; background-color: #a0a0a0cf; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85em;">
                                <i class="fa-solid fa-vial"></i> 模拟猜词
                              </button>
                              <div id="simulate-settings-section" style="display: none; margin-top: 3px; padding: 10px; background: #f9f9f940; border-radius: 8px;">
                                <div style="margin-bottom: 8px;">
                                  <label style="display: block; margin-bottom: 3px; font-size: 0.9em;">输入猜测词（必须在词库中）:</label>
                                  <input type="text" id="simulate-guess-word" placeholder="例如：广东广州" style="width: 100%; padding: 6px; box-sizing: border-box; border-radius: 5px; border: 1px solid #ccc;" />
                                </div>
                                <div style="margin-bottom: 8px;">
                                  <label style="display: block; margin-bottom: 3px; font-size: 0.9em;">我的反馈（点击方块切换）:</label>
                                  <div id="visual-feedback-simulate-self" style="display: flex; gap: 4px; justify-content: center;"></div>
                                </div>
                                <div id="duel-feedback-section-simulate" style="margin-bottom: 8px; display: none;">
                                  <label style="display: block; margin-bottom: 3px; font-size: 0.9em;">对手反馈（点击方块切换）:</label>
                                  <div id="visual-feedback-simulate-duel" style="display: flex; gap: 4px; justify-content: center;"></div>
                                </div>
                                <div style="display: flex; gap: 8px; margin-top: 10px;">
                                  <button id="submit-simulate-btn" class="liquid-glass-btn" style="flex-grow: 1; padding: 8px; background-color: #4a90e2af; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                                    <i class="fa-solid fa-play"></i> 执行模拟
                                  </button>
                                  <button id="reset-simulate-btn" class="liquid-glass-btn" style="padding: 8px; background-color: #f59e0baf; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                                    <i class="fa-solid fa-undo"></i> 重置
                                  </button>
                                </div>
                                <div id="simulate-result" style="margin-top: 10px; font-size: 0.85em; color: #333; padding: 6px; background: #e0f0ff60; border-radius: 6px; display: none;"></div>
                                <div id="simulate-sync-btn-container" style="margin-top: 8px; display: none;">
                                    <button id="sync-to-main-btn" class="liquid-glass-btn" style="width: 100%; padding: 6px; background-color: #f59e0bcf; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85em;">
                                      <i class="fa-solid fa-sync"></i> 同步到主程序（覆盖当前候选集）
                                    </button>
                                  </div>
                              </div>
                            </div>
                            <!-- === 可折叠高级设置区 === -->
                            <div style="margin-top: 10px; margin-bottom: 10px;">
                                <button id="toggle-duizhan-settings-btn" class="liquid-glass-btn" style="width: 100%; padding: 6px; background-color: #a0a0a0cf; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85em;">
                                    <i class="fa-solid fa-gear"></i> 高级计算设置
                                </button>
                                <div id="duizhan-settings-section" style="display: none; margin-top: 3px; padding: 10px; background: #f9f9f940; border-radius: 8px;">
                                    <div style="margin-bottom: 3px;">
                                        <label style="display: block; margin-bottom: 1.5px; font-size: 0.9em;">
                                            <input type="checkbox" id="enable-duel-feedback-toggle" checked />
                                            启用对手反馈（对战模式下使用）
                                        </label>
                                    </div>
                                    <div style="margin-bottom: 3px;">
                                        <label style="display: block; margin-bottom: 1.5px; font-size: 0.9em;">最大计算步数 (Guess Pool):</label>
                                       <div style="display: flex; align-items: center; gap: 8px; margin-top: 5px;">
                                            <input type="range" id="manual-guess-slider" min="0" max="999" value="596"
                                                   style="flex-grow: 1; height: 20px; cursor: pointer; pointer-events: auto;"
                                                   onmousedown="event.stopPropagation();"
                                                   ontouchstart="event.stopPropagation();" />
                                            <input type="number" id="manual-guess-number" min="10" max="3000" value="300"
                                                   style="width: 70px; padding: 4px; text-align: center; border: 1px solid #ccc; border-radius: 4px;" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 替换原来的“我的反馈”文本输入 -->
                            <div style="margin-bottom: 3px;">
                                <label style="display: block; margin-bottom: 1.5px; font-size: 0.9em;">我的反馈（点击方块切换颜色）:</label>
                                <div id="visual-feedback-self" style="display: flex; gap: 4px; justify-content: center;"></div>
                                <!-- 隐藏的文本输入用于兼容或调试 -->
                                <input type="text" id="manual-feedback-full" placeholder="0,1,2,3" style="width: 100%; padding: 6px; box-sizing: border-box; margin-top: 5px; border-radius: 5px; border: 1px solid #ccc; display: none;" />
                            </div>
                            <div id="duel-feedback-section-full" style="margin-bottom: 8px; display: none;">
                                <label style="display: block; margin-bottom: 3px; font-size: 0.9em;">对手反馈（点击方块切换颜色）:</label>
                                <div id="visual-feedback-duel" style="display: flex; gap: 4px; justify-content: center;"></div>
                                <input type="text" id="manual-duel-feedback-full" placeholder="0,1,2,3" style="width: 100%; padding: 6px; box-sizing: border-box; margin-top: 5px; margin-bottom: 5px; border-radius: 5px; border: 1px solid #ccc; display: none;" />
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center; margin-top: 8px;"> <!-- 新增按钮容器 -->
                            <button id="toggle-modal-btn-2-full-bottom" class="helper-btn" title="收起至模态二" style="padding: 6px 8px;" class="liquid-glass-btn"> <!-- 底部收起按钮 -->
                                <i class="fa-solid fa-angle-right"></i>
                            </button>
                            <button id="submit-manual-btn-full"  class="liquid-glass-btn" style="flex-grow: 1; padding: 8px; background-color: #6aaa64df; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;"><i class="fa-solid fa-check"></i> 提交</button>
                            <button id="fill-input-btn-full2"  class="liquid-glass-btn" style="padding: 8px; padding-left: 15px; padding-right: 15px; background-color: #6aaa64df; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;"><i class="fa-solid fa-keyboard"></i> 自动填入</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(container);
            // 样式
            const style = document.createElement('style');
            style.textContent = `
                :root {
                    --text-color: #333;
                    --bg-color: #ffffff80;
                    --input-bg: #ffffff90;
                    --panel-bg: #f9f9f980;
                    --log-bg: #ffffff80;
                    --border-color: #ccc;
                }
                @media (prefers-color-scheme: dark) {
                    :root {
                        --text-color: #f0f0f0;
                        --bg-color: #2c2c2c80;
                        --input-bg: #3a3a3a90;
                        --panel-bg: #25252580;
                        --log-bg: #25252580;
                        --border-color: #555;
                    }
                }

                #metrowordle-helper-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10000;
                    border-radius: 15px;
                    width: 50px;
                    max-width: 320px;
                    transition: width 0.3s ease, height 0.4s ease, max-width 0.4s ease;
                }
                #metrowordle-helper-content {
                    z-index: 10000;
                    border-radius: 15px;
                    transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                                height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
                                max-width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    overflow: hidden;
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                    box-shadow:
                        0 2px 12px rgba(247, 101, 255, 0.4),
                        inset 0 0 8px rgba(255, 220, 245, 0.4);
                }
                /* === 主光斑层和粒子层（保持原样，适配深浅色）=== */
                #metrowordle-helper-content::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background:
                        radial-gradient(circle at 20% 30%, rgba(255, 130, 190, 0.4) 0%, transparent 60%),
                        radial-gradient(circle at 80% 70%, rgba(160, 130, 230, 0.35) 0%, transparent 65%),
                        radial-gradient(circle at 50% 90%, rgba(210, 170, 255, 0.3) 0%, transparent 70%);
                    background-size: 300% 300%;
                    animation: dreamyFloat 18s ease-in-out infinite;
                    pointer-events: none;
                    z-index: -1;
                }

                #metrowordle-helper-content::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background:
                        radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 1px),
                        radial-gradient(circle, rgba(255, 230, 245, 0.75) 1.2px, transparent 1.2px),
                        radial-gradient(circle, rgba(230, 200, 255, 0.7) 1px, transparent 1px),
                        radial-gradient(circle, rgba(255, 255, 255, 0.65) 1.1px, transparent 1.1px),
                        radial-gradient(circle, rgba(255, 220, 240, 0.6) 1px, transparent 1px),
                        radial-gradient(circle, rgba(220, 190, 255, 0.65) 1.3px, transparent 1.3px),
                        radial-gradient(circle, rgba(255, 255, 255, 0.6) 1px, transparent 1px);
                    background-size:
                        80px 80px,
                        95px 95px,
                        110px 110px,
                        125px 125px,
                        140px 140px,
                        155px 155px,
                        170px 170px;
                    background-position:
                        0 0,
                        40px 25px,
                        20px 90px,
                        70px 10px,
                        30px 100px,
                        120px 40px,
                        50px 150px;
                    animation:
                        floatLayer1 15s linear infinite,
                        floatLayer2 18s linear infinite,
                        floatLayer3 21s linear infinite,
                        floatLayer4 24s linear infinite,
                        floatLayer5 27s linear infinite,
                        floatLayer6 30s linear infinite,
                        floatLayer7 33s linear infinite;
                    pointer-events: none;
                    z-index: -1;
                    opacity: 0.92;
                }

                #helper-log {
                    font-family: monospace;
                    white-space: pre-line;
                    background: var(--log-bg);
                    color: var(--text-color);
                    padding: 8px;
                    border-radius: 8px;
                    font-size: 0.8em;
                    max-height: 100px;
                    overflow-y: auto;
                }
                #recommended-word {
                    font-weight: bold;
                    color: var(--text-color); /* 允许在深色下为白色 */
                    text-align: center;
                    font-size: 1.1em;
                    padding: 5px 0;
                }
                #helper-status {
                    background-color: var(--panel-bg);
                    color: var(--text-color);
                    padding: 8px;
                    border-radius: 8px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    font-size: 0.9em;
                }
                input, textarea, select {
                    background: #ffffff4f;
                    color: #00000078;
                    border: 1px solid var(--border-color);
                    border-radius: 5px;
                    padding: 6px;
                    box-sizing: border-box;
                }
                input::placeholder,  textarea::placeholder{
                    color: #00000078;
                }
                label {
                    font-size: 0.9em;
                    margin-bottom: 1.5px;
                    display: block;
                }

                /* 表单面板背景 */
                #tiku-settings-section,
                #duizhan-settings-section,
                #simulate-settings-section {
                    background: var(--panel-bg);
                    border-radius: 8px;
                    padding: 10px;
                    margin-top: 3px;
                }

                /* 按钮文字颜色（普通按钮）*/
                .helper-btn-full {
                    color: var(--text-color);
                    background-color: var(--input-bg);
                    border: 1px solid var(--border-color);
                }

                /* 液态玻璃按钮文字保持白色（因为背景是彩色半透）*/
                .liquid-glass-btn {
                    color: white !important;
                }
                .helper-btn-full:hover {
                    background-color: #55555580;
                }

                /* === 原有动画和按钮样式（不变）=== */
                @keyframes floatLayer1 { 0% { background-position: 0 0, 40px 25px, 20px 60px, 70px 10px, 30px 80px, 90px 40px, 50px 100px; } 100% { background-position: 60px -40px, 100px 65px, -20px 120px, 130px -30px, -10px 160px, 150px 0px, 110px 60px; } }
                @keyframes floatLayer2 { 0% { background-position: 0 0, 40px 25px, 20px 60px, 70px 10px, 30px 80px, 90px 40px, 50px 100px; } 100% { background-position: -50px 70px, 10px -20px, 90px 20px, 20px 90px, 110px 30px, 40px 120px, -10px 50px; } }
                @keyframes floatLayer3 { 0% { background-position: 0 0, 40px 25px, 20px 60px, 70px 10px, 30px 80px, 90px 40px, 50px 100px; } 100% { background-position: 80px 30px, 120px -10px, 40px 100px, 140px 50px, 60px -20px, 160px 80px, 100px 150px; } }
                @keyframes floatLayer4 { 0% { background-position: 0 0, 40px 25px, 20px 60px, 70px 10px, 30px 80px, 90px 40px, 50px 100px; } 100% { background-position: -30px -50px, 50px 100px, -10px 30px, 90px 120px, 130px -10px, 70px 60px, 20px 90px; } }
                @keyframes floatLayer5 { 0% { background-position: 0 0, 40px 25px, 20px 60px, 70px 10px, 30px 80px, 90px 40px, 50px 100px; } 100% { background-position: 100px 80px, -20px 50px, 110px -30px, 60px 70px, 20px 130px, -30px 20px, 140px 40px; } }
                @keyframes floatLayer6 { 0% { background-position: 0 0, 40px 25px, 20px 60px, 70px 10px, 30px 80px, 90px 40px, 50px 100px; } 100% { background-position: 40px 120px, 130px 30px, 70px -40px, -10px 90px, 100px 0px, 160px 110px, 80px 70px; } }
                @keyframes floatLayer7 { 0% { background-position: 0 0, 40px 25px, 20px 60px, 70px 10px, 30px 80px, 90px 40px, 50px 100px; } 100% { background-position: -60px 40px, 20px 110px, 100px 20px, 80px -20px, 150px 90px, 50px -30px, 0px 140px; } }
                @keyframes dreamyFloat {
                    0%, 100% {
                        background-position: 15% 25%, 85% 70%, 50% 90%, 70% 15%;
                    }
                    25% {
                        background-position: 35% 45%, 75% 50%, 60% 70%, 40% 25%;
                    }
                    50% {
                        background-position: 55% 35%, 65% 80%, 35% 60%, 85% 35%;
                    }
                    75% {
                        background-position: 45% 65%, 90% 45%, 75% 30%, 60% 75%;
                    }
                }

                @media (max-width: 480px), (max-height: 600px) {
                    #helper-log {
                        display: none !important;
                    }
                }

                /* 液态玻璃按钮基础样式 */
                .liquid-glass-btn {
                    position: relative;
                    overflow: hidden;
                    background: rgba(255, 255, 255, 0.28); /* 更贴近 Apple 的白底半透 */
                    backdrop-filter: blur(16px) saturate(180%); /* 增加饱和度，更鲜活 */
                    -webkit-backdrop-filter: blur(16px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.4); /* 更亮边框 */
                    box-shadow:
                        0 8px 32px rgba(0, 0, 0, 0.12),
                        inset 0 1px 0 rgba(255, 255, 255, 0.6), /* 内部高光 */
                        inset 0 -1px 0 rgba(0, 0, 0, 0.05); /* 底部微暗增强层次 */
                    color: white;
                    font-weight: bold;
                    border-radius: 16px;
                    transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
                    z-index: 1;
                }

                .liquid-glass-btn::before {
                    content: '';
                    position: absolute;
                    top: -40%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(
                        circle at center,
                        rgba(255, 255, 255, 0.6) 0%,
                        transparent 60%
                    );
                    opacity: 0;
                    transition: opacity 0.4s ease, transform 0.6s ease;
                    transform: translate(-50%, -50%) scale(0.9);
                    pointer-events: none;
                    z-index: -1;
                }

                /* 鼠标悬停时的高光反射 + 深度增强 */
                .liquid-glass-btn:hover {
                    background: rgba(255, 255, 255, 0.35);
                    backdrop-filter: blur(20px) saturate(200%);
                    -webkit-backdrop-filter: blur(20px) saturate(200%);
                    box-shadow:
                        0 12px 48px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.7),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.08);
                    transform: translateY(-2px);
                }

                .liquid-glass-btn:hover::before {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.3);
                }

                /* 响应式：小屏简化效果 */
                @media (max-width: 480px), (max-height: 600px) {
                    .liquid-glass-btn {
                        backdrop-filter: blur(12px) saturate(160%);
                        -webkit-backdrop-filter: blur(12px) saturate(160%);
                        box-shadow:
                            0 6px 24px rgba(0, 0, 0, 0.1),
                            inset 0 1px 0 rgba(255, 255, 255, 0.5),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.04);
                    }
                }

                .helper-btn {
                    position: relative;
                    overflow: hidden;
                    background: rgba(106, 170, 100, 0.85); /* 使用MetroWordle主色调 */
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 1em;
                    padding: 10px;
                    align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%; /* 圆形按钮 */
                    transition: background-color 0.2s ease; /* 悬停过渡 */
                    backdrop-filter: blur(16px) saturate(180%); /* 增加饱和度，更鲜活 */
                    -webkit-backdrop-filter: blur(16px) saturate(180%);
                    /*border: 1px solid rgba(106, 170, 100, 0.4);  更亮边框 */
                    box-shadow:
                        0 8px 32px rgba(0, 0, 0, 0.12),
                        inset 0 1px 0 rgba(106, 170, 100, 0.6), /* 内部高光 */
                        inset 0 -1px 0 rgba(0, 0, 0, 0.05); /* 底部微暗增强层次 */
                    transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
                    z-index: 1;
                }
                .helper-btn::before {
                    content: '';
                    position: absolute;
                    top: -20%;
                    left: -30%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(
                        circle at center,
                        rgba(255, 255, 255, 0.3) 0%,
                        transparent 60%
                    );
                    opacity: 0;
                    transition: opacity 0.4s ease, transform 0.6s ease;
                    transform: translate(-50%, -50%) scale(0.9);
                    pointer-events: none;
                    z-index: -1;
                }
                .helper-btn:hover {
                    background-color: rgba(106, 170, 100, 0.9);
                    backdrop-filter: blur(20px) saturate(200%);
                    -webkit-backdrop-filter: blur(20px) saturate(200%);
                    box-shadow:
                        0 12px 48px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(106, 170, 100, 0.7),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.08);
                }
                .helper-btn:hover::before {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.3);
                }
                .helper-btn-full {
                    padding: 6px 10px;
                    margin-right: 5px;
                    margin-bottom: 5px;
                    background-color: #f0f0f0;
                    border: 1px solid #ccc;
                    border-radius: 8px; /* 按钮圆角 */
                    cursor: pointer;
                    font-size: 0.85em;
                    transition: background-color 0.2s ease; /* 悬停过渡 */
                }
                .helper-btn-full:hover {
                    background-color: #e0e0e0;
                }
                .compact-btns-container {
                    padding: 10px 0;
                }
                #recommended-word {
                    font-weight: bold;
                    color: #53b31c;
                    text-align: center;
                    font-size: 1.1em;
                    padding: 5px 0;
                }
                #helper-status {
                    background-color: #e0e0e080;
                    color: #333;
                    padding: 8px;
                    border-radius: 8px; /* 状态栏圆角 */
                    font-weight: bold;
                    margin-bottom: 10px;
                    font-size: 0.9em;
                }
                
                /* 响应式调整：移动端隐藏日志 */
                @media (max-width: 480px), (max-height: 600px) {
                    #helper-log {
                        display: none !important; /* 强制隐藏日志 */
                    }
                }
            `;
            document.head.appendChild(style);
            // 拖拽功能 (仅模态三)
            let isDragging = true;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;
            const header = document.getElementById('metrowordle-helper-header');
            const draggable = container;
            header.addEventListener("mousedown", dragStart);
            document.addEventListener("mouseup", dragEnd);
            document.addEventListener("mousemove", drag);

            function dragStart(e)
            {
                if (currentModalState === MODAL_STATES.FULL)
                {
                    initialX = e.clientX - xOffset;
                    initialY = e.clientY - yOffset;
                    if (e.target === header)
                    {
                        isDragging = true;
                    }
                }
            }

            function dragEnd()
            {
                initialX = currentX;
                initialY = currentY;
                isDragging = true;
            }

            function drag(e)
            {
                if (isDragging)
                {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    xOffset = currentX;
                    yOffset = currentY;
                    setTranslate(currentX, currentY, draggable);
                }
            }

            function setTranslate(xPos, yPos, el)
            {
                el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
            }

            // --- 模态切换逻辑 ---
            updateUI = () =>
            {
                const btn1 = document.getElementById('toggle-modal-btn-1');
                const btn2 = document.getElementById('toggle-modal-btn-2');
                const btn2Full = document.getElementById('toggle-modal-btn-2-full');
                const btn2FullBottom = document.getElementById('toggle-modal-btn-2-full-bottom');
                const content = document.getElementById('metrowordle-helper-content');
                const compactButtons = document.getElementById('compact-buttons');
                const fullContent = document.getElementById('full-content');
                const manualInputs = document.getElementById('manual-inputs-full');
                // 始终显示内容容器，因为它包含了所有模态的元素
                content.style.display = 'block';
                switch (currentModalState)
                {
                    case MODAL_STATES.MINIMAL:
                        container.style.width = '50px';
                        container.style.height = 'auto';
                        container.style.maxWidth = '50px';
                        container.style.transform = 'none';
                        btn1.style.display = 'block';
                        btn1.innerHTML = '<i class="fas fa-chevron-up"></i>';
                        btn1.title = '展开';
                        btn2.style.display = 'none'; // 在模态一隐藏收起按钮
                        btn2Full.style.display = 'none'; // 在模态一隐藏收起按钮
                        btn2FullBottom.style.display = 'none'; // 在模态一隐藏收起按钮
                        compactButtons.style.display = 'none';
                        fullContent.style.display = 'none';
                        manualInputs.style.display = 'none'; // 隐藏手动输入区
                        isManualInputVisible = false; // 更新状态
                        break;
                    case MODAL_STATES.COMPACT:
                        container.style.width = '50px';
                        container.style.height = 'auto';
                        container.style.maxWidth = '50px';
                        container.style.transform = 'none';
                        btn1.style.display = 'none';
                        btn2.style.display = 'block'; // 在模态二显示展开按钮
                        btn2.innerHTML = '<i class="fas fa-chevron-left"></i>'; // 展开图标
                        btn2.title = '展开到模态三';
                        btn2Full.style.display = 'none'; // 在模态二隐藏收起按钮
                        btn2FullBottom.style.display = 'none'; // 在模态二隐藏收起按钮
                        compactButtons.style.display = 'flex';
                        fullContent.style.display = 'none';
                        manualInputs.style.display = 'none'; // 隐藏手动输入区
                        isManualInputVisible = false; // 更新状态
                        break;
                    case MODAL_STATES.FULL:
                        container.style.width = '320px';
                        container.style.height = 'auto';
                        container.style.maxWidth = '320px';
                        btn1.style.display = 'none';
                        btn2.style.display = 'none'; // 在模态三隐藏原按钮
                        btn2Full.style.display = 'block'; // 在模态三显示顶部收起按钮
                        compactButtons.style.display = 'none';
                        fullContent.style.display = 'block';
                        // 手动输入区的显示/隐藏独立控制
                        if (isManualInputVisible)
                        {
                            manualInputs.style.display = 'block';
                            btn2FullBottom.style.display = 'flex'; // 在手动输入区显示底部收起按钮
                        }
                        else
                        {
                            manualInputs.style.display = 'none';
                            btn2FullBottom.style.display = 'flex'; // 不在手动输入区时隐藏底部收起按钮
                        }
                        // 其他内容始终显示
                        document.getElementById('helper-status').style.display = 'block';
                        document.getElementById('helper-log').style.display = 'block';
                        document.getElementById('recommended-word').style.display = 'block';
                        document.getElementById('manual-controls-full').style.display = 'block';
                        break;
                }
            };
            const bindEvents = () =>
            {
                document.getElementById('toggle-modal-btn-1')?.addEventListener('click', function()
                                                                                {
                    if (currentModalState === MODAL_STATES.MINIMAL)
                    {
                        currentModalState = MODAL_STATES.COMPACT;
                    }
                    else if (currentModalState === MODAL_STATES.COMPACT)
                    {
                        currentModalState = MODAL_STATES.MINIMAL;
                    }
                    updateUI();
                });
                document.getElementById('toggle-modal-btn-2')?.addEventListener('click', function()
                                                                                {
                    // 这个按钮只在 模态二 和 模态三 之间切换
                    if (currentModalState === MODAL_STATES.COMPACT)
                    {
                        currentModalState = MODAL_STATES.FULL;
                        isManualInputVisible = false; // 展开到模态三时，显示常规内容
                    }
                    else if (currentModalState === MODAL_STATES.FULL)
                    {
                        currentModalState = MODAL_STATES.COMPACT;
                        isManualInputVisible = false; // 收起时，重置状态
                    }
                    updateUI();
                });
                // 新增：顶部收起按钮事件
                document.getElementById('toggle-modal-btn-2-full')?.addEventListener('click', function()
                                                                                     {
                    if (currentModalState === MODAL_STATES.FULL)
                    {
                        currentModalState = MODAL_STATES.COMPACT;
                        isManualInputVisible = false; // 收起时，重置状态
                    }
                    updateUI();
                });
                // 新增：底部收起按钮事件
                document.getElementById('toggle-modal-btn-2-full-bottom')?.addEventListener('click', function()
                                                                                            {
                    if (currentModalState === MODAL_STATES.FULL)
                    {
                        currentModalState = MODAL_STATES.COMPACT;
                        isManualInputVisible = false; // 收起时，重置状态
                    }
                    updateUI();
                });
                document.getElementById('toggle-log-btn')?.addEventListener('click', function()
                                                                            {
                    const logDiv = document.getElementById('helper-log');
                    if (logDiv)
                    {
                        logDiv.style.display = logDiv.style.display === 'none' ? 'block' : 'none';
                    }
                });
                document.getElementById('manual-input-btn')?.addEventListener('click', function()
                                                                              {
                    // 点击模态二的按钮，切换到模态三并显示手动输入区
                    currentModalState = MODAL_STATES.FULL;
                    isManualInputVisible = true; // 设置状态为显示手动输入区
                    updateUI();
                });
                document.getElementById('refresh-data-btn-full')?.addEventListener('click', refreshData);
                document.getElementById('reset-model-btn')?.addEventListener('click', resetModel);
                document.getElementById('fill-input-btn-full')?.addEventListener('click', fillInputBox); // 绑定填入按钮事件
                document.getElementById('fill-input-btn-full2')?.addEventListener('click', fillInputBox); // 绑定填入按钮事件
                document.getElementById('submit-manual-btn-full')?.addEventListener('click', submitManualFeedback);
                document.getElementById('refresh-data-btn')?.addEventListener('click', refreshData);
                document.getElementById('fill-input-btn')?.addEventListener('click', fillInputBox);
                // --- 新增：计算候选词按钮事件 ---
                document.getElementById('calculate-candidates-btn-full')?.addEventListener('click', calculateCandidatesNow);
                // --- END 新增 ---
                // --- 新增：词库管理事件 ---
                document.getElementById('import-words-btn')?.addEventListener('click', () =>
                                                                              {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.txt';
                    input.onchange = e =>
                    {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = () =>
                        {
                            // --- MODIFICATION: Fix word splitting for imported files ---
                            const words = reader.result.split(/[\r\n]+/).map(w => w.trim()).filter(w => w);
                            // --- END MODIFICATION ---
                            document.getElementById('manual-words-full').value = words.join('\n');
                            log(`导入 ${words.length} 个词到手动输入区。`);
                        };
                        reader.readAsText(file);
                    };
                    input.click();
                });
                document.getElementById('export-words-btn')?.addEventListener('click', () =>
                                                                              {
                    if (db.length === 0)
                    {
                        log('当前词库为空，无法导出。');
                        return;
                    }
                    const blob = new Blob([db.join('\n')],
                                          {
                        type: 'text/plain'
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `MetroWordle_lvshu_${targetLength || 'unknown'}.txt`;
                    a.click();
                    log('词库已导出。');
                });
                // --- END 新增：词库管理事件 ---
                document.getElementById('import-localstorage-btn')?.addEventListener('click', importLocalStorageData);
                document.getElementById('export-localstorage-btn')?.addEventListener('click', () =>
                                                                                     {
                    const data = localStorage.getItem(STORAGE_KEY) || '[]';
                    const blob = new Blob([data],
                                          {
                        type: 'application/json'
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `MetroWordle_Helper_Data_${new Date().toISOString().slice(0,10)}.json`;
                    a.click();
                    log('✅ localStorage 数据已导出');
                });

                document.getElementById('enable-duel-feedback-toggle')?.addEventListener('change', function() {
                    enableDuelFeedback = this.checked;
                    log(`ℹ️ 对手反馈功能 ${enableDuelFeedback ? '已启用' : '已禁用'}`);
                    // 可选：清除缓存（避免旧数据干扰）
                    cachedDuelCompatibleSet = null;
                    cachedDuelFeedback = null;
                });

                document.getElementById('toggle-tiku-settings-btn')?.addEventListener('click', function() {
                    const section = document.getElementById('tiku-settings-section');
                    const isExpanded = section.style.display === 'block';
                    section.style.display = isExpanded ? 'none' : 'block';
                    this.innerHTML = isExpanded
                        ? '<i class="fa-solid fa-gear"></i> 题库设置'
                    : '<i class="fa-solid fa-xmark"></i> 收起 题库设置';
                });
                document.getElementById('toggle-duizhan-settings-btn')?.addEventListener('click', function() {
                    const section = document.getElementById('duizhan-settings-section');
                    const isExpanded = section.style.display === 'block';
                    section.style.display = isExpanded ? 'none' : 'block';
                    this.innerHTML = isExpanded
                        ? '<i class="fa-solid fa-gear"></i> 高级计算设置'
                    : '<i class="fa-solid fa-xmark"></i> 收起 高级计算设置';
                });

                // 模拟猜词区开关
                document.getElementById('toggle-simulate-settings-btn')?.addEventListener('click', function() {
                    const section = document.getElementById('simulate-settings-section');
                    const isExpanded = section.style.display === 'block';
                    section.style.display = isExpanded ? 'none' : 'block';
                    this.innerHTML = isExpanded
                        ? '<i class="fa-solid fa-vial"></i> 模拟猜词（调试/练习）'
                    : '<i class="fa-solid fa-xmark"></i> 收起 模拟猜词';
                    if (!isExpanded) {
                        // 初始化反馈方块（动态长度）
                        initVisualFeedbackSimulate(targetLength || 5);
                    }
                });

                // 执行模拟
                document.getElementById('submit-simulate-btn')?.addEventListener('click', handleSimulateSubmit);

                // 重置模拟
                document.getElementById('reset-simulate-btn')?.addEventListener('click', resetSimulation);

                document.getElementById('sync-to-main-btn')?.addEventListener('click', () => {
                    if (!window._lastSimulationCandidates || window._lastSimulationCandidates.length === 0) {
                        log('⚠️ 无法同步：无有效的模拟结果');
                        return;
                    }

                    // ✅ 安全检查：确保主程序已初始化且字数匹配
                    if (!isInitialized || candidates.length === 0) {
                        log('⚠️ 无法同步：主程序未初始化');
                        return;
                    }

                    const simulatedLength = window._lastSimulationCandidates[0][0].length;
                    if (simulatedLength !== targetLength) {
                        log(`⚠️ 无法同步：模拟字数 (${simulatedLength}) 与当前字数 (${targetLength}) 不符`);
                        return;
                    }

                    // ✅ 执行同步：覆盖全局 candidates
                    candidates = [...window._lastSimulationCandidates];
                    isInitialized = true;

                    log(`✅ 已同步模拟结果：${candidates.length} 个候选词`);

                    // ✅ 立即更新推荐词
                    updateRecommendation();

                    // ✅ 自动收起模拟区（可选）
                    document.getElementById('simulate-settings-section').style.display = 'none';
                    document.getElementById('toggle-simulate-settings-btn').innerHTML = '<i class="fa-solid fa-vial"></i> 模拟猜词（调试/练习)';
                });

                // === 非线性滑动条映射逻辑 ===
                const MIN_VAL = 10;
                const MAX_VAL = 3000;
                const SLIDER_STEPS = 1000; // 0 ~ 999

                // 从滑块位置 → 真实值（非线性：log scale）
                function sliderToValue(sliderPos) {
                    const t = sliderPos / (SLIDER_STEPS - 1); // 0.0 ~ 1.0
                    // 使用对数映射：log(MIN) ~ log(MAX)
                    const logMin = Math.log(MIN_VAL);
                    const logMax = Math.log(MAX_VAL);
                    const logVal = logMin + t * (logMax - logMin);
                    return Math.round(Math.exp(logVal));
                }

                // 从真实值 → 滑块位置（反向）
                function valueToSlider(value) {
                    const clamped = Math.max(MIN_VAL, Math.min(MAX_VAL, value));
                    const logMin = Math.log(MIN_VAL);
                    const logMax = Math.log(MAX_VAL);
                    const logVal = Math.log(clamped);
                    const t = (logVal - logMin) / (logMax - logMin);
                    return Math.round(t * (SLIDER_STEPS - 1));
                }

                // 同步函数
                function syncSliderAndNumber() {
                    const slider = document.getElementById('manual-guess-slider');
                    const numberInput = document.getElementById('manual-guess-number');

                    // --- 关键：阻止 MetroWordle 干扰滑块拖拽 ---
                    const protectSlider = (e) => {
                        e.stopPropagation();
                        // 注意：不要 preventDefault，否则无法拖动
                    };

                    // 监听所有可能被 MetroWordle 拦截的事件
                    ['mousedown', 'touchstart', 'pointerdown'].forEach(eventType => {
                        slider.addEventListener(eventType, protectSlider, true); // 使用捕获阶段（true）
                    });

                    const updateFromSlider = () => {
                        const val = sliderToValue(parseInt(slider.value));
                        numberInput.value = val;
                    };

                    const updateFromNumber = () => {
                        let val = parseInt(numberInput.value);
                        if (isNaN(val)) val = 300;
                        val = Math.max(MIN_VAL, Math.min(MAX_VAL, val));
                        numberInput.value = val;
                        slider.value = valueToSlider(val);
                    };

                    slider.addEventListener('input', updateFromSlider);
                    numberInput.addEventListener('change', updateFromNumber);
                    numberInput.addEventListener('input', () => {
                        // 可选：实时校验（只允许数字）
                        numberInput.value = numberInput.value.replace(/[^0-9]/g, '');
                    });

                    // 初始化同步
                    updateFromSlider();
                }
                syncSliderAndNumber();
            };
            bindEvents();
            // 在 createUI 函数的最后（bindEvents() 之后）
            initVisualFeedback(); // 👈 添加这一行：确保 UI 渲染时就有默认方块
            updateUI();
        };
        // --- 模型核心逻辑 ---
        // --- MODIFICATION: Add global variables for game ID and mode ---
        let currentGameId = null;
        let currentGameMode = null;
        // --- END MODIFICATION ---
        let db = [];
        let dbByLen = {};
        let targetLength = null;
        let isDuelMode = false;
        let enableDuelFeedback = true; // 默认启用
        let candidates = []; // 现在存储的是 [word, probability] 对
        let roundNum = 1;
        let isInitialized = false;
        let lastProcessedGuess = null;
        let lastRecommendedWord = null; // 追踪上一次推荐的词

        // --- 性能优化：按需计算对手反馈兼容性 ---
        let cachedDuelCompatibleSet = null; // 缓存当前对手反馈下的兼容答案集合
        let cachedDuelFeedback = null; // 缓存当前对手反馈
        const log = (msg) =>
        {
            const logDiv = document.getElementById('helper-log');
            // 移动端或小屏幕时，日志被隐藏，不追加内容
            if (logDiv && logDiv.style.display !== 'none')
            {
                logDiv.textContent += msg + '\n';
                logDiv.scrollTop = logDiv.scrollHeight;
            }
        };
        const updateStatus = (msg) =>
        {
            const statusDiv = document.getElementById('helper-status');
            if (statusDiv) statusDiv.textContent = `状态: ${msg}`;
        };
        // 带缓存的优化版本
        const getFeedback = (() =>
                             {
            const cache = new Map();
            return (guess, answer) =>
            {
                const cacheKey = `${guess}||${answer}`;
                if (cache.has(cacheKey))
                {
                    return cache.get(cacheKey);
                }
                // 使用上面的修复逻辑
                const result = calculateFeedback(guess, answer);
                cache.set(cacheKey, result);
                // 限制缓存大小
                if (cache.size > 2000)
                {
                    const firstKey = cache.keys().next().value;
                    cache.delete(firstKey);
                }
                return result;
            };
        })();
        // *** MODIFIED: Calculate feedback with a more lenient blue rule ***
        // Step 1: Mark all correct positions (Green) and count occurrences in answer

        // Create a copy of the answer character count to track remaining available characters for yellow
        // Mark greens first and update remaining counts


        // Check if the character exists in the answer and we haven't exceeded the available count for yellows
        // This count considers the green matches already taken into account by remainingAnswerCharCount



        // Step 2: Mark blues (same pinyin, only if not already green or yellow)
        // We need to track which answer characters have been "used up" by green/yellow for blue logic.
        // A simple way is to use remainingAnswerCharCount again, but this time it represents "available for blue".
        // However, green/yellow already consumed specific *counts* of characters.
        // We need a more detailed tracking: which specific answer positions are "taken".
        // Now, for each position that is still 0 (grey), check for blue
        // Look for an answer character that is not taken and has the same pinyin
        //oneType: 'num',
        //: true,
        //onZh: 'consecutive'

        //f (guessPinyin === answerPinyin) {
        //eedback[i] = 3;
        //nswerPositionsTaken[j] = true; // Mark this answer position as taken for blue
        // Move to next guess position



        // If no available answer char matched the pinyin, it remains grey (0)


        // *** END MODIFIED ***
        //eturn feedback;

        //};
        const isChineseChar = (char) =>
        {
            return /^[\u4e00-\u9fa5]$/.test(char);
        };

        const calculateFeedback = (guess, answer) => {
            if (guess.length !== answer.length) {
                console.error(`Length mismatch: ${guess} vs ${answer}`);
                return [];
            }
            const N = guess.length;
            const feedback = new Array(N).fill(0);
            const answerCharCount = {};
            // Step 1: Count answer chars
            for (let i = 0; i < N; i++) {
                answerCharCount[answer[i]] = (answerCharCount[answer[i]] || 0) + 1;
            }
            // Step 2: Green
            for (let i = 0; i < N; i++) {
                if (guess[i] === answer[i]) {
                    feedback[i] = 1;
                    answerCharCount[guess[i]]--;
                }
            }
            // Step 3: Yellow (non-green, char exists and count > 0)
            for (let i = 0; i < N; i++) {
                if (feedback[i] !== 1) {
                    const char = guess[i];
                    if (answerCharCount[char] > 0) {
                        feedback[i] = 2;
                        answerCharCount[char]--;
                    }
                }
            }
            // Step 4: Blue (same pinyin, only for gray positions)
            const answerUsed = feedback.map(f => f !== 0); // true = taken by G/Y
            console.log(`测试 [${answerUsed}]`);
            for (let i = 0; i < N; i++) {
                if (feedback[i] === 0 && isChineseChar(guess[i])) {
                    const guessPy = getPinyin(guess[i]);
                    for (let j = 0; j < N; j++) {
                        if (!answerUsed[j] && isChineseChar(answer[j])) {
                            const ansPy = getPinyin(answer[j]);
                            if (guessPy === ansPy) {
                                feedback[i] = 3;
                                answerUsed[j] = true; // consume this answer position
                                break;
                            }
                        }
                    }
                }
            }
            return feedback;
        };
        // 添加测试函数来验证反馈计算
        const testFeedbackCalculation = () =>
        {
            const testCases = [
                {
                    guess: "广东广州",
                    answer: "广东潮州",
                    expected: [1, 1, 0, 1]
                },
                {
                    guess: "北京南京",
                    answer: "北京天津",
                    expected: [1, 1, 0, 0]
                },
                {
                    guess: "测试测试",
                    answer: "测试一下",
                    expected: [1, 1, 0, 0]
                }, // Test repeated chars
                {
                    guess: "一下测试",
                    answer: "测试一下",
                    expected: [2, 2, 2, 2]
                }, // Test all yellow with repeated chars
                {
                    guess: "广西南宁",
                    answer: "重庆巫溪",
                    expected: [0, 3, 0, 0]
                }, // Test case from user
                {
                    guess: "西",
                    answer: "溪",
                    expected: [3]
                }, // ✅ 同音同调
                {
                    guess: "西",
                    answer: "洗",
                    expected: [0]
                }, // ❌ 同音异调 → 灰色
                {
                    guess: "广东省湛江市廉江市",
                    answer: "浙江省金华市义乌市",
                    expected: [0,0,1,0,2,1,0,0,1]
                }
            ];
            console.log("=== 反馈计算测试 ===");
            testCases.forEach((test, index) =>
                              {
                const result = getFeedback(test.guess, test.answer);
                const isCorrect = JSON.stringify(result) === JSON.stringify(test.expected);
                console.log(`测试 ${index + 1}: ${isCorrect ? '✅' : '❌'}`);
                console.log(`  猜测: "${test.guess}", 答案: "${test.answer}"`);
                console.log(`  预期: [${test.expected.join(',')}]`);
                console.log(`  实际: [${result.join(',')}]`);
            });
        };
        // *** MODIFIED: calculateInfoGain to work with weighted probabilities and optimized duel feedback adjustment ***
        const calculateInfoGain = (candidates, guess, duelFeedback = null, targetLength = null) =>
        {
            // --- 性能优化：按需计算并缓存对手兼容集合 ---
            if (duelFeedback && enableDuelFeedback && enableDuelFeedback && (!cachedDuelCompatibleSet || !cachedDuelFeedback || JSON.stringify(cachedDuelFeedback) !== JSON.stringify(duelFeedback)))
            {
                cachedDuelFeedback = duelFeedback;
                // Recalculate compatible set based on current candidates and duelFeedback
                // This is O(N_db * N_cand) but only done once per duelFeedback change
                cachedDuelCompatibleSet = new Set();
                const wordsOfSameLen = dbByLen[targetLength] || [];
                for (const cand of candidates)
                {
                    const candWord = cand[0];
                    for (const w of wordsOfSameLen)
                    {
                        const wFb = getFeedback(w, candWord);
                        if (wFb.length === duelFeedback.length && wFb.every((v, i) => v === duelFeedback[i]))
                        {
                            cachedDuelCompatibleSet.add(candWord);
                            break; // Found one compatible guess, move to next candidate
                        }
                    }
                }
                log(`✅ 重新计算对手反馈兼容集合，共 ${cachedDuelCompatibleSet.size} 个候选词兼容。`);
            }
            // Calculate how many candidates are compatible with the duel feedback
            let compatibleWithDuel = 0;
            if (duelFeedback && enableDuelFeedback)
            {
                for (const [cand, prob] of candidates)
                {
                    if (prob <= 0) continue; // Skip candidates with zero probability
                    if (cachedDuelCompatibleSet.has(cand))
                    {
                        compatibleWithDuel++;
                    }
                }
            }
            const totalEffectiveCandidates = candidates.length;
            const totalCompatible = compatibleWithDuel;
            const totalIncompatible = totalEffectiveCandidates - totalCompatible;
            // If there's no duel feedback, revert to single-player logic
            if (!duelFeedback)
            {
                const feedbackCount = {};
                for (const [cand, prob] of candidates)
                {
                    if (prob <= 0) continue; // Skip candidates with zero probability
                    const fbSelf = getFeedback(guess, cand);
                    if (fbSelf.length === 0) continue;
                    const fbKey = fbSelf.join(',');
                    feedbackCount[fbKey] = (feedbackCount[fbKey] || 0) + prob; // Use probability as weight
                }
                const totalWeight = candidates.reduce((sum, [c, p]) => sum + p, 0);
                let entropy = 0;
                for (const weight of Object.values(feedbackCount))
                {
                    if (weight > 0)
                    {
                        const p = weight / totalWeight;
                        entropy -= p * Math.log2(p);
                    }
                }
                return entropy;
            }
            // Dual-player logic with probability adjustment
            const feedbackCount = {};
            for (const [cand, prob] of candidates)
            {
                if (prob <= 0) continue; // Skip candidates with zero probability
                const fbSelf = getFeedback(guess, cand);
                if (fbSelf.length === 0) continue;
                const duelValid = cachedDuelCompatibleSet.has(cand);
                // Adjust probability based on duel feedback compatibility
                let adjustedProb = prob;
                if (!duelValid && totalCompatible > 0 && totalIncompatible > 0)
                {
                    // Penalize incompatible candidates based on specificity of duel feedback
                    const totalWords = dbByLen[targetLength] || [];
                    const compatibilityScore = totalCompatible / totalWords.length;
                    const penaltyFactor = 0.1 * (1 - compatibilityScore); // Less penalty for vague feedback
                    adjustedProb = prob * penaltyFactor;
                }
                else if (duelValid && totalCompatible > 0 && totalIncompatible > 0)
                {
                    // Boost compatible candidates based on specificity of duel feedback
                    const totalWords = dbByLen[targetLength] || [];
                    const compatibilityScore = totalCompatible / totalWords.length;
                    const boostFactor = 1 + (1 - compatibilityScore); // More boost for specific feedback
                    adjustedProb = prob * boostFactor;
                }
                const fbKey = fbSelf.join(',');
                feedbackCount[fbKey] = (feedbackCount[fbKey] || 0) + adjustedProb; // Use adjusted probability as weight
            }
            const totalAdjustedWeight = candidates.reduce((sum, [c, p]) =>
                                                          {
                const duelValid = cachedDuelCompatibleSet.has(c);
                let adjustedP = p;
                if (!duelValid && totalCompatible > 0 && totalIncompatible > 0)
                {
                    const totalWords = dbByLen[targetLength] || [];
                    const compatibilityScore = totalCompatible / totalWords.length;
                    const penaltyFactor = 0.1 * (1 - compatibilityScore);
                    adjustedP = p * penaltyFactor;
                }
                else if (duelValid && totalCompatible > 0 && totalIncompatible > 0)
                {
                    const totalWords = dbByLen[targetLength] || [];
                    const compatibilityScore = totalCompatible / totalWords.length;
                    const boostFactor = 1 + (1 - compatibilityScore);
                    adjustedP = p * boostFactor;
                }
                return sum + adjustedP;
            }, 0);
            let entropy = 0;
            for (const weight of Object.values(feedbackCount))
            {
                if (weight > 0)
                {
                    const p = weight / totalAdjustedWeight;
                    entropy -= p * Math.log2(p);
                }
            }
            return entropy;
        };
        // *** END MODIFIED ***

        // Fisher-Yates 洗牌（安全、O(n)、真随机）
        function shuffleArray(array) {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        // === 新增：高效计算对手反馈兼容的答案集合（带采样+缓存）===
        const duelAnswerCache = new Map(); // Map<string, Set<string>>，key = "feedback|length"

        function getDuelCompatibleAnswers(duelFeedback, targetLength) {
            const key = duelFeedback.join(',') + '|' + targetLength;
            if (duelAnswerCache.has(key)) {
                return duelAnswerCache.get(key);
            }

            const allWords = dbByLen[targetLength] || [];
            if (allWords.length === 0) {
                const emptySet = new Set();
                duelAnswerCache.set(key, emptySet);
                return emptySet;
            }

            const compatible = new Set();
            const proven = new Set(); // 已证明兼容的 A

            // === 采样 G 池：避免 O(N²) ===
            let G_POOL = allWords;
            if (allWords.length > 2000) {
                // 若词库太大，只采样 2000 个 G
                G_POOL = shuffleArray(allWords).slice(0, 2000);
            }

            const totalAnswers = allWords.length;
            for (const G of G_POOL) {
                if (proven.size >= totalAnswers) break; // 全部已证明，提前退出

                for (const A of allWords) {
                    if (proven.has(A)) continue;

                    const fb = getFeedback(G, A);
                    if (fb.length !== duelFeedback.length) continue;

                    let match = true;
                    for (let i = 0; i < fb.length; i++) {
                        if (fb[i] !== duelFeedback[i]) {
                            match = false;
                            break;
                        }
                    }
                    if (match) {
                        compatible.add(A);
                        proven.add(A);
                    }
                }
            }

            const result = new Set(compatible);
            duelAnswerCache.set(key, result);
            return result;
        }
        // === END 新增函数 ===

        // === 优化版：基于最小期望剩余候选数（ERC）的评分函数 ===
        const calculateERC = (candidates, guess, duelFeedback = null, targetLength = null) => {
            if (candidates.length === 0) return -Infinity;

            // --- 按需计算并缓存对手兼容集合（使用高效采样+缓存）---
            if (duelFeedback && enableDuelFeedback && (!cachedDuelCompatibleSet || !cachedDuelFeedback || JSON.stringify(cachedDuelFeedback) !== JSON.stringify(duelFeedback))) {
                cachedDuelFeedback = duelFeedback;
                cachedDuelCompatibleSet = getDuelCompatibleAnswers(duelFeedback, targetLength);
                log(`ℹ️ calculateERC: 对手反馈 [${duelFeedback.join(',')}] 兼容 ${cachedDuelCompatibleSet.size} 个答案`);
            }
            if (duelFeedback && enableDuelFeedback && !duelFeedback.every(v => v === 0) && (!cachedDuelCompatibleSet || !cachedDuelFeedback || JSON.stringify(cachedDuelFeedback) !== JSON.stringify(duelFeedback))) {
                cachedDuelCompatibleSet = getDuelCompatibleAnswers(duelFeedback, targetLength);
                log(`ℹ️ calculateERC: 对手反馈 [${duelFeedback.join(',')}] 兼容 ${cachedDuelCompatibleSet.size} 个答案`);
            }

            // 构建反馈桶（加权）
            const feedbackGroups = {};
            const totalProb = candidates.reduce((sum, [_, p]) => sum + p, 0);
            for (const [cand, prob] of candidates) {
                if (prob <= 1e-10) continue;
                const fb = getFeedback(guess, cand).join(',');
                // 应用对战反馈加权（复用原逻辑）
                let adjustedProb = prob;
                if (duelFeedback && enableDuelFeedback) {
                    const totalWords = dbByLen[targetLength] || [];
                    const totalCompatible = cachedDuelCompatibleSet.size;
                    const totalIncompatible = candidates.length - totalCompatible;
                    const duelValid = cachedDuelCompatibleSet.has(cand);
                    if (totalCompatible > 0 && totalIncompatible > 0) {
                        if (duelValid) {
                            const compatibilityScore = totalCompatible / totalWords.length;
                            const boostFactor = 1 + (1 - compatibilityScore);
                            adjustedProb *= boostFactor;
                        } else {
                            const compatibilityScore = totalCompatible / totalWords.length;
                            const penaltyFactor = 0.1 * (1 - compatibilityScore);
                            adjustedProb *= penaltyFactor;
                        }
                    }
                }
                feedbackGroups[fb] = (feedbackGroups[fb] || 0) + adjustedProb;
            }

            // 计算 ERC: Σ (P(fb)^2) → 越小越好 → 返回 -Σ(P^2)
            let erc = 0;
            for (const p of Object.values(feedbackGroups)) {
                const normP = p / totalProb;
                erc += normP * normP;
            }
            return -erc; // 越大越好
        };
        // --- 核心算法优化：处理信息熵相同时的 tie-breaker (包含历史频率) ---
        const calculateCharFrequency = (candidatesList) =>
        {
            // 计算候选词列表中每个字符的频率，考虑概率权重
            const freq = {};
            for (const [word, prob] of candidatesList)
            {
                for (const char of word)
                {
                    freq[char] = (freq[char] || 0) + prob; // Use probability as weight
                }
            }
            return freq;
        };
        // === 优化版：推荐词选择主函数（含两步 lookahead）===
        const findBestGuess = (candidates, targetLength) => {
            if (candidates.length === 0) return null;
            const effectiveCandidates = candidates.filter(([c, p]) => p > 1e-10);
            if (effectiveCandidates.length === 0) return null;
            if (effectiveCandidates.length === 1) return effectiveCandidates[0][0];

            const allWords = dbByLen[targetLength] || [];
            if (allWords.length === 0) return null;

            const manualGuessInput = document.getElementById('manual-guess-number'); // 注意：现在是 number input，可直接取 .valueAsNumber
            const manualGuessValue = manualGuessInput?.valueAsNumber || 300;
            if (!isNaN(manualGuessValue)) {
                MAX_GUESS_POOL_SIZE = Math.min(parseInt(manualGuessValue), 3000);
                log(`ℹ️ 使用手动输入的最大步数: ${MAX_GUESS_POOL_SIZE}`);
            }

            // === 策略开关 ===
            const enableNonConservative = effectiveCandidates.length <= MAX_GUESS_POOL_SIZE * 2;
            const enableLookahead = effectiveCandidates.length <= MAX_GUESS_POOL_SIZE && allWords.length <= 5000; // 限制词库大小防卡

            let guessPool;

            if (enableNonConservative) {
                // 允许 non-conservative：从全词库选
                if (allWords.length <= MAX_GUESS_POOL_SIZE) {
                    guessPool = allWords;
                    log(`📌 非保守策略：使用完整词库 (${allWords.length} 词)`);
                } else {
                    // 混合采样：候选词优先 + 非候选词补足
                    const candidateSet = new Set(effectiveCandidates.map(([w]) => w));
                    const nonCandidates = allWords.filter(w => !candidateSet.has(w));
                    const candSample = shuffleArray(effectiveCandidates.map(([w]) => w)).slice(0, Math.min(Math.min(300, effectiveCandidates.length), MAX_GUESS_POOL_SIZE));
                    const nonCandSample = shuffleArray(nonCandidates).slice(0, Math.min(nonCandidates.length, MAX_GUESS_POOL_SIZE * 0.5));
                    guessPool = [...new Set([...candSample, ...nonCandSample])];
                    log(`📌 非保守策略：采样 ${guessPool.length} 词`);
                }
            } else {
                // 保守策略：只从候选中选
                guessPool = shuffleArray(effectiveCandidates.map(([w]) => w)).slice(0, Math.min(effectiveCandidates.length, MAX_GUESS_POOL_SIZE));
                log(`📌 保守策略：采样 ${guessPool.length} 个候选词`);
            }

            if (guessPool.length === 0) return null;

            // === 核心评分 ===
            let bestGuess = null;
            let bestScore = -Infinity;
            const topCandidates = [];

            for (const guess of guessPool) {
                // ⚠️ 关键：Lookahead 阶段禁用 duelFeedback（只用于 self-feedback）
                const score1 = calculateERC(effectiveCandidates, guess, null, targetLength);
                let totalScore = score1;

                if (enableLookahead && guessPool.length <= 1000) {
                    const feedbackGroups = {};
                    for (const [cand, prob] of effectiveCandidates) {
                        const fb = getFeedback(guess, cand).join(',');
                        feedbackGroups[fb] = (feedbackGroups[fb] || 0) + prob;
                    }
                    const topFb = Object.entries(feedbackGroups)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 2);
                    let expectedFuture = 0;
                    const totalProb = effectiveCandidates.reduce((s, [_, p]) => s + p, 0);
                    for (const [fbKey, prob] of topFb) {
                        const fb = fbKey.split(',').map(Number);
                        const nextCands = effectiveCandidates.filter(([cand]) =>
                                                                     getFeedback(guess, cand).every((v, i) => v === fb[i])
                                                                    );
                        if (nextCands.length < 2) continue;

                        // 🔒 Lookahead 的 subGuessPool 必须是保守的（只含候选词），避免二次爆炸
                        const subGuessPool = nextCands.length <= MAX_GUESS_POOL_SIZE/2 ? nextCands.map(([w]) => w) : shuffleArray(nextCands.map(([w]) => w)).slice(0, MAX_GUESS_POOL_SIZE/2);
                        let bestFuture = -Infinity;
                        for (const nextGuess of subGuessPool) {
                            // ⚠️ 这里也传 null 作为 duelFeedback！
                            const s = calculateERC(nextCands, nextGuess, null, targetLength);
                            if (s > bestFuture) bestFuture = s;
                        }
                        expectedFuture += (prob / totalProb) * bestFuture;
                    }
                    totalScore += 0.3 * expectedFuture;
                }

                if (totalScore > bestScore + 1e-10) {
                    bestScore = totalScore;
                    bestGuess = guess;
                    topCandidates.length = 0;
                    topCandidates.push(guess);
                } else if (Math.abs(totalScore - bestScore) < 1e-10) {
                    topCandidates.push(guess);
                }
            }

            // === Tie-breaker（不变）===
            if (topCandidates.length > 1) {
                log(`ℹ️ Tie-Breaker: ${topCandidates.length} 个词得分相同`);
                const charFreq = calculateCharFrequency(effectiveCandidates);
                const { answers: history } = loadStoredData(currentGameId);
                const candidatesWithScores = topCandidates.map(guess => {
                    const freqScore = [...guess].reduce((sum, char) => sum + (charFreq[char] || 0), 0);
                    const historyFreq = history?.[guess] || 0;
                    return { guess, freqScore, historyFreq, rand: Math.random() };
                });
                candidatesWithScores.sort((a, b) => {
                    if (Math.abs(a.freqScore - b.freqScore) > 1e-6) return b.freqScore - a.freqScore;
                    if (a.historyFreq !== b.historyFreq) return b.historyFreq - a.historyFreq;
                    return b.rand - a.rand;
                });
                bestGuess = candidatesWithScores[0].guess;
                log(`ℹ️ Tie-Breaker 选择: ${bestGuess}`);
            }

            return bestGuess; // ✅ 允许返回非候选词
        };
        // --- END 核心算法优化 ---
        // --- 新增：提取推荐词计算和更新逻辑 ---
        const updateRecommendation = () =>
        {

            if (isInitialized && candidates.length > 0)
            {
                const nextBestGuess = findBestGuess(candidates, targetLength);
                if (nextBestGuess)
                {
                    log(`💡 计算得出推荐词: ${nextBestGuess}`);
                    updateStatus(`推荐: ${nextBestGuess}`);
                    document.getElementById('recommended-word').textContent = `推荐词: ${nextBestGuess}`;
                    lastRecommendedWord = nextBestGuess; // 更新最后推荐词
                }
                else
                {
                    log('❌ 错误: 无法找到新的推荐词 (候选词列表为空或计算失败)');
                    updateStatus('计算失败');
                    document.getElementById('recommended-word').textContent = '推荐词: 无';
                    lastRecommendedWord = null;
                }
            }
            else
            {
                log('⚠️ 警告: 未初始化或候选词列表为空，无法计算推荐词');
                updateStatus('未初始化或无候选词');
                document.getElementById('recommended-word').textContent = '推荐词: 无';
                lastRecommendedWord = null;
            }
        };
        // --- END 新增 ---
        const initializeModel = () =>
        {
            log('👏 欢迎使用 MetroWordle Helper 8');
            testFeedbackCalculation(); // Run test first
            log('ℹ️ 尝试从页面获取数据...');
            // --- MODIFICATION: Detect game ID and mode from URL ---
            // --- 获取题库 ID：优先手动输入，其次 URL，最后用每日日期 ---
            let effectiveGameId = null;
            let effectiveGameMode = null;

            const manualGuessInput = document.getElementById('manual-guess-number'); // 注意：现在是 number input，可直接取 .valueAsNumber
            const manualGuessValue = manualGuessInput?.valueAsNumber || 300;
            if(!isNaN(manualGuessValue))
            {
                MAX_GUESS_POOL_SIZE = manualGuessValue;
                log(`ℹ️ 使用手动输入的最大步数: ${MAX_GUESS_POOL_SIZE}`);
            }

            // 1. 先尝试从 URL 获取
            const
            {
                id: urlId,
                mode: urlMode
            } = getGameIdFromUrl();
            effectiveGameMode = urlMode;

            // 2. 如果 URL 无 ID，尝试从手动输入框读取
            if (urlId === null)
            {
                const manualIdInput = document.getElementById('manual-game-id-full');
                const manualIdValue = manualIdInput?.value.trim();
                if (manualIdValue && !isNaN(manualIdValue))
                {
                    effectiveGameId = parseInt(manualIdValue);
                    log(`ℹ️ 使用手动输入的题库 ID: ${effectiveGameId}`);
                }
                else
                {
                    // 3. 如果手动也未输入，使用87作为 ID
                    effectiveGameId = `87`;
                    log(`⚠️ 未指定题库 ID，使用 ID: ${effectiveGameId}`);
                    // 自动填入输入框（可选）
                    if (manualIdInput) manualIdInput.value = effectiveGameId;
                }
            }
            else
            {
                effectiveGameId = urlId;
                log(`ℹ️ 从 URL 获取题库 ID: ${effectiveGameId}`);
            }

            currentGameId = effectiveGameId;
            currentGameMode = effectiveGameMode;
            // --- END ID 处理 --
            log(`ℹ️ 检测到题库ID: ${currentGameId}, 模式: ${currentGameMode}`);
            // --- END MODIFICATION ---
            // 替换原来的 if (window.location.href.includes('ring')) { ... }
            let gameBoardSelector = null;

            // MetroWordle 新版无 ID，统一使用 class 选择器
            isDuelMode = window.location.href.includes('ring');
            log(`ℹ️ 检测到模式: ${isDuelMode ? '对战' : '单人'}，使用通用棋盘选择器`);
            let words = [];
            // --- 将 scripts 的获取移到这里 ---
            const scripts = document.querySelectorAll('script');
            // --- END 修改 ---
            // --- MODIFICATION: Load words from localStorage first ---
            const
            {
                words: storedWords,
                answers: storedAnswers,
                firstWords: storedFirstWords
            } = loadStoredData(currentGameId);
            if (storedWords)
            {
                words = storedWords;
                log(`ℹ️ 从 localStorage 加载题库 ID ${currentGameId} 的词库，共 ${words.length} 个词`);
            }
            else
            {
                log(`⚠️ localStorage 中未找到题库 ID ${currentGameId} 的词库`);
            }
            // --- END MODIFICATION ---
            // --- MODIFICATION: Load words from page or manual input if not in localStorage ---
            if (words.length === 0)
            {
                for (const script of scripts)
                {
                    if (script.textContent.includes('let words'))
                    {
                        const match = script.textContent.match(/let words\s*=\s*(\[.*?\]);/s);
                        if (match)
                        {
                            // --- 性能优化：安全提取词库 ---
                            let jsonStr = match[1]
                            .replace(/'/g, '"') // 单引号 → 双引号
                            .replace(/,\s*\]/g, ']') // 移除尾部逗号
                            .replace(/\b(\w+)\b(?=:)/g, '"$1'); // key 加引号（如有对象）
                            try
                            {
                                words = JSON.parse(jsonStr);
                                log(`ℹ️ 从页面脚本中成功提取到词库，共 ${words.length} 个词`);
                                // --- Save to localStorage after loading from page ---
                                saveStoredData(currentGameId, currentGameMode, words, storedAnswers, storedFirstWords);
                                log(`ℹ️ 词库已更新并保存到 localStorage for ID ${currentGameId}`);
                                // --- END Save ---
                            }
                            catch (e)
                            {
                                log('⚠️ JSON.parse 失败，回退到 eval（不推荐）');
                                try
                                {
                                    words = eval(match[1]);
                                    log(`ℹ️ 使用 eval 成功提取词库`);
                                    // --- Save to localStorage after loading from page ---
                                    saveStoredData(currentGameId, currentGameMode, words, storedAnswers, storedFirstWords);
                                    log(`ℹ️ 词库已更新并保存到 localStorage for ID ${currentGameId}`);
                                    // --- END Save ---
                                }
                                catch (e2)
                                {
                                    log(`⚠️ eval 也失败: ${e2.message}`);
                                }
                            }
                            break;
                        }
                    }
                }
            }
            if (words.length === 0)
            {
                const manualWordsText = document.getElementById('manual-words-full')?.value.trim();
                if (manualWordsText)
                {
                    // --- MODIFICATION: Fix word splitting for manual input ---
                    words = manualWordsText.split(/[\r\n]+/).map(w => w.trim()).filter(w => w.length > 0);
                    // --- END MODIFICATION ---
                    log(`ℹ️ 从手动输入加载词库，共 ${words.length} 个词`);
                    // --- Save to localStorage after loading from manual input ---
                    saveStoredData(currentGameId, currentGameMode, words, storedAnswers, storedFirstWords);
                    log(`ℹ️ 手动词库已保存并更新到 localStorage for ID ${currentGameId}`);
                    // --- END Save ---
                }
            }
            if (words.length === 0)
            {
                log('⚠️ 警告: 未找到词库，无法继续。请在下方手动输入词库后点击刷新。');
                // 切换到模态三并显示手动输入区
                currentModalState = MODAL_STATES.FULL;
                isManualInputVisible = true;
                updateUI(); // 更新UI以显示手动输入区
                updateStatus('词库为空，请手动输入');
                return; // Exit if no words are found
            }
            // --- END MODIFICATION ---
            // --- 修改：尝试获取 targetLength，优先级：页面 -> 手动输入 -> 自动推断 -> 失败提示 ---
            let lengthFromScript = null;
            for (const script of scripts)
            { // 使用此处定义的 scripts
                if (script.textContent.includes('WORD_LENGTH'))
                {
                    const match = script.textContent.match(/WORD_LENGTH\s*=\s*(\d+);/);
                    if (match)
                    {
                        lengthFromScript = parseInt(match[1]);
                        log(`ℹ️ 从页面脚本变量 WORD_LENGTH 获取字数: ${lengthFromScript}`);
                        break;
                    }
                }
            }
            if (lengthFromScript !== null)
            {
                targetLength = lengthFromScript;
            }
            else
            {
                let lengthMatch = document.querySelector('label[for="word-input"]')?.textContent?.match(/(\d+)个字/);
                if (lengthMatch)
                {
                    targetLength = parseInt(lengthMatch[1]);
                    log(`ℹ️ 从页面文本获取字数: ${targetLength}`);
                }
                else
                {
                    // --- 新增：尝试从手动输入区获取字数 ---
                    const manualLengthInput = document.getElementById('manual-length-full');
                    const manualLengthValue = manualLengthInput?.value.trim();
                    if (manualLengthValue && !isNaN(manualLengthValue))
                    {
                        targetLength = parseInt(manualLengthValue);
                        log(`ℹ️ 从手动输入区获取字数: ${targetLength}`);
                    }
                    else
                    {
                        log('⚠️ 警告: 无法从页面或手动输入区获取字数。请在手动输入区填写字数或词库后点击刷新。');
                        // 切换到模态三并显示手动输入区
                        currentModalState = MODAL_STATES.FULL;
                        isManualInputVisible = true;
                        updateUI(); // 更新UI以显示手动输入区
                        updateStatus('未获取字数，请手动输入或填入词库');
                        return; // <--- 如果连手动输入区也没填，就返回
                        // --- END 新增 ---
                    }
                    // --- END 新增 ---
                }
            }
            // --- END 修改 ---
            db = words;
            dbByLen = {};
            for (const name of db)
            {
                const n = name.length;
                if (!dbByLen[n]) dbByLen[n] = [];
                dbByLen[n].push(name);
            }
            // --- 性能优化：初始化时清空缓存 ---
            //cachedDuelCompatibleSet = null;
            //cachedDuelFeedback = null;
            // --- END 性能优化 ---
            // *** MODIFIED: Move initialization logic outside the if (!isInitialized) check ***
            // This ensures that if db and targetLength are valid, we always try to initialize candidates.
            if (targetLength && dbByLen[targetLength])
            {
                // 重新初始化可视化反馈区，确保方块数量正确
                setTimeout(() =>
                           {
                    initVisualFeedback(targetLength);
                    log(`ℹ️ 可视化反馈区已根据字数 ${targetLength} 初始化。`);
                }, 0); // Use 0ms timeout to defer execution to the next event loop tick
                // Initialize candidates with uniform probability [word, probability]
                // --- MODIFICATION: Use per-ID answer history ---
                // const history = JSON.parse(localStorage.getItem('metrowordle_answer_history') || '{}');
                const history = storedAnswers; // Use loaded answers
                // --- END MODIFICATION ---
                const baseProb = 1.0 / dbByLen[targetLength].length;
                candidates = dbByLen[targetLength].map(word =>
                                                       {
                    // --- MODIFICATION: Use per-ID answer history ---
                    const freq = history[word] || 0;
                    const boost = Math.min(1.0 + freq * 0.1, 1.5); // 最多 +50%，可根据需要调整 boost 幅度
                    // --- END MODIFICATION ---
                    return [word, baseProb * boost];
                });
                // 重新归一化
                const total = candidates.reduce((sum, [w, p]) => sum + p, 0);
                candidates = candidates.map(([w, p]) => [w, p / total]);
                log(`ℹ️ 已加载 ${candidates.length} 个 ${targetLength} 字候选词`);
                isInitialized = true; // Set isInitialized to true here
                updateStatus('已初始化');
                lastProcessedGuess = null;
                roundNum = 1;
                // --- ✅ 优化：若已保存首选推荐词，直接使用 ---
                let shouldCalculateRecommendation = true;
                if (storedFirstWords[targetLength])
                {
                    const savedFirstWord = storedFirstWords[targetLength];
                    // 验证该词仍在当前词库中（防止词库更新后失效）
                    if (dbByLen[targetLength].includes(savedFirstWord))
                    {
                        lastRecommendedWord = savedFirstWord;
                        log(`💡 使用已保存的首选推荐词: ${savedFirstWord} (题库 ${currentGameId}, ${targetLength} 字)`);
                        updateStatus(`推荐: ${savedFirstWord}`);
                        document.getElementById('recommended-word').textContent = `推荐词: ${savedFirstWord}`;
                        shouldCalculateRecommendation = false; // 跳过计算
                    }
                    else
                    {
                        log(`⚠️ 已保存的首选推荐词 "${savedFirstWord}" 不在当前词库中，将重新计算`);
                    }
                }

                if (shouldCalculateRecommendation)
                {
                    updateRecommendation(); // 正常计算
                }

                // --- 保存首次推荐词（仅当是新计算出来的）---
                if (shouldCalculateRecommendation && lastRecommendedWord)
                {
                    const currentFirstWords = storedFirstWords;
                    if (!currentFirstWords[targetLength] || currentFirstWords[targetLength] !== lastRecommendedWord)
                    {
                        currentFirstWords[targetLength] = lastRecommendedWord;
                        saveStoredData(currentGameId, currentGameMode, words, history, currentFirstWords);
                        log(`ℹ️ 首次推荐词已保存到 localStorage for ID ${currentGameId}, length ${targetLength}: ${lastRecommendedWord}`);
                    }
                }
                // --- END 优化 ---
            }
            else
            {
                log(`❌ 错误: 没有 ${targetLength} 字的词或词库为空`);
                updateStatus('初始化失败');
                isInitialized = false; // Ensure it's not initialized if conditions aren't met
                // Ensure recommendation UI is cleared
                document.getElementById('recommended-word').textContent = '推荐词: 无';
                lastRecommendedWord = null;
            }
            // *** END MODIFIED ***
        };
        const isTrivialDuelFeedback = (fb) => {
            if (!fb || fb.length === 0) return true;
            return fb.every(v => v === 0) || fb.every(v => v === 1);
        };
        // *** MODIFIED: updateModel to work with weighted probabilities and optimized duel feedback adjustment ***
        const updateModel = (selfFeedback, duelFeedback = null) =>
        {
            log(`=== 模型更新开始 ===`);
            log(`ℹ️ 使用推荐词: "${lastRecommendedWord}"`);
            log(`ℹ️ 接收反馈: [${selfFeedback.join(',')}]`);

            if (duelFeedback && enableDuelFeedback)
            {
                log(`ℹ️ 接收对手反馈: [${duelFeedback.join(',')}]`);
            }
            // 在 updateModel 函数开头
            if (duelFeedback && enableDuelFeedback && isTrivialDuelFeedback(duelFeedback)) {
                log('ℹ️ 对手反馈为全灰或全绿，忽略此反馈');
                duelFeedback = null;
            }
            if (!isInitialized || candidates.length === 0)
            {
                log(`❌ updateModel early exit: initialized=${isInitialized}, candidates.length=${candidates.length}`);
                return;
            }
            const bestGuess = lastRecommendedWord;
            if (!bestGuess)
            {
                log('❌ 错误: 无法获取上一次的推荐词用于更新模型');
                return;
            }
            log(`--- 开始更新模型 ---`);
            log(`ℹ️ 输入的反馈 (selfFeedback): [${selfFeedback.join(',')}]`);
            log(`ℹ️ 更新前候选词列表: ${JSON.stringify(candidates.slice(0, 1))}`);
            // --- 新增：检查是否得出最终答案 ---
            if (candidates.length === 1 && candidates[0][1] > 0.99)
            {
                const answer = candidates[0][0];
                saveAnswerToHistory(answer); // ← 保存答案到历史记录
                log(`✅ 答案是: ${answer} (概率: ${candidates[0][1].toFixed(4)})`);
                updateStatus(`答案: ${answer}`);
                document.getElementById('recommended-word').textContent = `推荐词: ${answer}`;
                lastRecommendedWord = answer; // 更新最后推荐词
                return; // 确认答案后，提前返回，不再进行后续更新
            }
            // --- Step 1: 仅基于 selfFeedback 过滤 ---
            const filteredBySelf = candidates.filter(([cand, prob]) => {
                if (prob <= 1e-10) return false;
                const fbSelf = getFeedback(bestGuess, cand);
                return fbSelf.length === selfFeedback.length && fbSelf.every((v, i) => v === selfFeedback[i]);
            });

            if (filteredBySelf.length === 0) {
                log('❌ 仅基于自我反馈已无解！');
                updateStatus('无解，请检查反馈');
                return;
            }

            // --- Step 2: 尝试用 duelFeedback 进一步过滤（如果有效）---
            let finalCandidates = filteredBySelf;
            let usedDuelFeedback = false;

            if (duelFeedback && enableDuelFeedback && !isTrivialDuelFeedback(duelFeedback)) {
                // 获取兼容集合
                cachedDuelFeedback = duelFeedback;
                cachedDuelCompatibleSet = getDuelCompatibleAnswers(duelFeedback, targetLength);
                log(`ℹ️ 对手反馈 [${duelFeedback.join(',')}] 兼容 ${cachedDuelCompatibleSet.size} 个答案`);

                // 应用过滤
                const filteredByDuel = filteredBySelf.filter(([word]) => cachedDuelCompatibleSet.has(word));

                // ✅ 回退判断：如果过滤后数量过少（例如 < 1），或相对于原集合比例过低（如 < 5%），则放弃过滤
                const ratio = filteredByDuel.length / filteredBySelf.length;
                if (filteredByDuel.length >= 1 && ratio >= 0.02) { // 至少保留1个，且不低于2%
                    finalCandidates = filteredByDuel;
                    usedDuelFeedback = true;
                    log(`ℹ️ 应用对手反馈，剩余 ${finalCandidates.length} 个候选（原 ${filteredBySelf.length}）`);
                } else {
                    log(`⚠️ 对手反馈过滤后候选过少（${filteredByDuel.length}/${filteredBySelf.length}），回退为仅用自我反馈`);
                    // 不使用 duel 过滤，但保留兼容集用于后续加权（可选）
                }
            } else {
                log('ℹ️ 未使用对手反馈（无效或被忽略）');
            }

            // --- Step 3: 归一化概率 ---
            if (finalCandidates.length === 0) {
                // 理论上不会发生（因为 filteredBySelf 非空），但保险起见
                log('❌ 回退后仍无候选词！');
                updateStatus('无解');
                return;
            }

            // 可选：对 finalCandidates 应用 duel 兼容性加权（即使未过滤）
            let weightedCandidates = finalCandidates;
            if (duelFeedback && enableDuelFeedback && cachedDuelCompatibleSet && usedDuelFeedback === false) {
                // 即使没过滤，也可以轻微加权以保留信息
                const totalWords = dbByLen[targetLength]?.length || 1;
                const totalCompatible = cachedDuelCompatibleSet.size;
                const totalIncompatible = finalCandidates.length - totalCompatible;
                if (totalCompatible > 0 && totalIncompatible > 0) {
                    weightedCandidates = finalCandidates.map(([word, prob]) => {
                        let newProb = prob;
                        const duelValid = cachedDuelCompatibleSet.has(word);
                        if (duelValid) {
                            const boost = 1 + (totalCompatible / totalWords); // 温和 boost
                            newProb *= boost;
                        } else {
                            const penalty = 0.5 * (1 - totalCompatible / totalWords); // 温和 penalty
                            newProb *= penalty;
                        }
                        return [word, newProb];
                    });
                }
            }

            // 归一化
            const totalProb = weightedCandidates.reduce((sum, [_, p]) => sum + p, 0);
            if (totalProb <= 0) {
                log('❌ 概率归一化失败');
                updateStatus('无解');
                return;
            }
            candidates = weightedCandidates.map(([w, p]) => [w, p / totalProb]);

            // --- 结束更新 ---
            log(`--- 模型更新完成 ---`);
            log(`ℹ️ 更新后剩余有效候选词数量: ${candidates.length}`);
            log(`ℹ️ 更新后剩余候选词列表 (前10个): ${JSON.stringify(candidates.slice(0, 10))}`);
            roundNum++;
            // 检查是否得出最终答案 (在更新后)
            if (candidates.length === 1 && candidates[0][1] > 0.99)
            {
                const answer = candidates[0][0];
                saveAnswerToHistory(answer); // ← 保存答案到历史记录
                log(`✅ 答案是: ${answer} (概率: ${candidates[0][1].toFixed(4)})`);
                updateStatus(`答案: ${answer}`);
                document.getElementById('recommended-word').textContent = `推荐词: ${answer}`;
                lastRecommendedWord = answer; // 更新最后推荐词
            }
            else if (candidates.length === 0)
            {
                log('❌ 无解！');
                log(`ℹ️ 详细信息:`);
                log(`　  - 上次推荐词: "${bestGuess}"`);
                log(`　  - 使用的反馈: [${selfFeedback.join(',')}]`);
                if (duelFeedback && enableDuelFeedback) log(`　  - 使用的对手反馈: [${duelFeedback.join(',')}]`);
                log(`　  - 更新前候选词数: ${processedCount}`);
                updateStatus('无解，请检查反馈');
            }
            else
            {
                // --- 计算并显示下一个推荐词 ---
                // Call the new function to calculate and update recommendation
                updateRecommendation(); // <--- 调用新函数
                // --- END 计算并显示下一个推荐词 ---
            }
            log(`=== 模型更新完成 ===`);
        };
        // *** END MODIFIED ***
        const identifyFeedback = () =>
        {
            if (!isInitialized)
            {
                log('ℹ️ 信息: 模型未初始化，无法识别反馈');
                return null;
            }

            // 使用新版通用选择器（无 ID）
            const board = document.querySelector('.grid.gap-3.max-w-2xl.mx-auto');
            if (!board)
            {
                log('❌ 错误: 找不到棋盘（.grid.gap-3.max-w-2xl.mx-auto）');
                return null;
            }

            const rows = board.querySelectorAll('.flex.gap-2.justify-center');
            if (rows.length === 0)
            {
                log('ℹ️ 信息: 棋盘上暂无猜词行');
                return null;
            }

            // 🔁 新版 MetroWordle：最新提交的行在顶部（index 0）
            // 所以从上往下找第一个“完整且已上色”的行
            for (let i = 0; i < rows.length; i++)
            {
                const boxes = rows[i].querySelectorAll('div');
                if (boxes.length !== targetLength) continue;

                let guessWord = '';
                let isComplete = true;
                for (let j = 0; j < targetLength; j++)
                {
                    const text = boxes[j].textContent.trim();
                    if (!text || text === '?')
                    {
                        isComplete = false;
                        break;
                    }
                    guessWord += text;
                }

                if (!isComplete) continue;

                // 检查是否已上色（至少一个方块有 bg- 类）
                const hasColor = Array.from(boxes).some(box =>
                                                        box.classList.contains('bg-success') ||
                                                        box.classList.contains('bg-warning') ||
                                                        box.classList.contains('bg-blue') ||
                                                        box.classList.contains('bg-neutral')
                                                       );

                if (!hasColor) continue;

                // ✅ 找到最新已提交行
                log(`ℹ️ 信息: 识别到第 ${i} 行为最新提交行，猜测词: "${guessWord}"`);

                const feedback = [];
                for (let j = 0; j < targetLength; j++)
                {
                    const cls = boxes[j].classList;
                    if (cls.contains('bg-success')) feedback.push(1);
                    else if (cls.contains('bg-warning')) feedback.push(2);
                    else if (cls.contains('bg-blue')) feedback.push(3);
                    else if (cls.contains('bg-neutral')) feedback.push(0);
                    else
                    {
                        log(`⚠️ 警告: 方块 ${j} 无有效颜色类，跳过`);
                        return null;
                    }
                }

                log(`ℹ️ 信息: 自动识别反馈: [${feedback.join(',')}], 猜测词: "${guessWord}"`);
                return {
                    feedback,
                    guessWord
                };
            }

            log('ℹ️ 信息: 未找到已提交的完整猜词行');
            return null;
        };

        const identifyOpponentFeedback = () => {
            if (!isInitialized || !isDuelMode) {
                return null;
            }
            const opponentPanel = document.getElementById('opponent-panel');
            if (!opponentPanel) {
                return null;
            }
            const opponentBoard = opponentPanel.querySelector('.grid.gap-3.max-w-md.mx-auto');
            if (!opponentBoard) {
                log('ℹ️ 未在 #opponent-panel 中找到对手棋盘');
                return null;
            }

            const rows = opponentBoard.querySelectorAll('.flex.gap-2.justify-center');
            if (rows.length === 0) {
                return null;
            }

            // 从最新行（顶部）开始遍历
            for (let i = 0; i < rows.length; i++) {
                const boxes = rows[i].querySelectorAll('div');
                if (boxes.length !== targetLength) continue;

                // ✅ 关键修复：不再检查 textContent，只检查是否已上色（即有反馈）
                const hasColor = Array.from(boxes).some(box =>
                                                        box.classList.contains('bg-success') ||
                                                        box.classList.contains('bg-warning') ||
                                                        box.classList.contains('bg-blue') ||
                                                        box.classList.contains('bg-neutral')
                                                       );

                if (!hasColor) continue; // 这行还没提交反馈

                // ✅ 只要有颜色，就认为是有效反馈行（即使显示的是 ?）
                const feedback = [];
                for (let j = 0; j < targetLength; j++) {
                    const cls = boxes[j].classList;
                    if (cls.contains('bg-success')) feedback.push(1);
                    else if (cls.contains('bg-warning')) feedback.push(2);
                    else if (cls.contains('bg-blue')) feedback.push(3);
                    else if (cls.contains('bg-neutral')) feedback.push(0);
                    else {
                        // 理论上不该发生，但安全起见跳过
                        log(`⚠️ 对手第 ${j} 个方块无有效颜色类`);
                        return null;
                    }
                }

                log(`ℹ️ 识别对手反馈: [${feedback.join(',')}], 行 ${i}`);
                return feedback;
            }
            return null;
        };

        const observeGameBoard = () => {
            isDuelMode = window.location.href.includes('/ring/');
            const playerBoard = document.querySelector('.grid.gap-3.max-w-2xl.mx-auto');
            const opponentPanel = document.getElementById('opponent-panel');
            const opponentBoard = opponentPanel?.querySelector('.grid.gap-3.max-w-md.mx-auto');

            if (!playerBoard) {
                log('❌ 找不到玩家棋盘');
                return;
            }

            // 📌 用于防重复处理本轮反馈
            let lastProcessedRoundKey = null;

            // 📌 提取最新一行反馈（只看第 0 行，即顶部）
            const extractLatestFeedback = (boardElement, isOpponent = false) => {
                if (!boardElement) return null;
                const rows = boardElement.querySelectorAll('.flex.gap-2.justify-center');
                if (rows.length === 0) return null;

                const firstRow = rows[0]; // 最新提交在顶部
                const boxes = firstRow.querySelectorAll('div');
                if (boxes.length !== targetLength) return null;

                // 对手反馈不依赖文本内容（只看颜色），玩家反馈需有有效文字
                let guessWord = '';
                if (!isOpponent) {
                    for (let j = 0; j < targetLength; j++) {
                        const text = boxes[j].textContent.trim();
                        if (!text || text === '?') return null; // 未提交完整
                        guessWord += text;
                    }
                }

                // 检查是否已上色（即反馈已生效）
                const hasColor = Array.from(boxes).some(box =>
                                                        box.classList.contains('bg-success') ||
                                                        box.classList.contains('bg-warning') ||
                                                        box.classList.contains('bg-blue') ||
                                                        box.classList.contains('bg-neutral')
                                                       );
                if (!hasColor) return null;

                const feedback = Array.from(boxes).map(box => {
                    if (box.classList.contains('bg-success')) return 1;
                    if (box.classList.contains('bg-warning')) return 2;
                    if (box.classList.contains('bg-blue')) return 3;
                    return 0; // bg-neutral
                });

                return isOpponent ? { feedback } : { feedback, guessWord };
            };

            // 📌 主处理逻辑：仅当双方反馈就绪才更新模型
            const processLatestRound = () => {
                if (!isInitialized || !targetLength) return;

                const selfResult = extractLatestFeedback(playerBoard, false);
                const duelResult = isDuelMode ? extractLatestFeedback(opponentBoard, true) : null;

                // 必须有玩家反馈且长度匹配
                if (!selfResult || selfResult.feedback.length !== targetLength) return;

                // 对战模式下，必须也有对手反馈且长度匹配
                if (isDuelMode && (!duelResult || duelResult.feedback.length !== targetLength)) return;

                // 构造唯一键，防止重复处理同一轮
                const roundKey = `${selfResult.guessWord}-${selfResult.feedback.join('')}` +
                      (duelResult ? `-${duelResult.feedback.join('')}` : '');

                if (roundKey === lastProcessedRoundKey) return;

                // ✅ 检查是否使用了推荐词
                if (selfResult.guessWord !== lastRecommendedWord) {
                    log(`⚠️ 玩家输入 "${selfResult.guessWord}" ≠ 推荐词 "${lastRecommendedWord}"，跳过自动更新`);
                    if (currentModalState === MODAL_STATES.MINIMAL) {
                        currentModalState = MODAL_STATES.FULL;
                        isManualInputVisible = true;
                        updateUI();
                    }
                    return;
                }

                // ✅ 双方反馈就绪，执行模型更新
                log(`🔍 本轮完整反馈就绪（玩家 + ${isDuelMode ? '对手' : '单人'}）`);
                updateModel(selfResult.feedback, duelResult?.feedback || null);
                lastProcessedRoundKey = roundKey;
            };

            // 📌 创建 MutationObserver 并监听双方棋盘
            const observer = new MutationObserver(() => {
                // 防抖：避免频繁触发（DOM 可能多次微更新）
                clearTimeout(observer.debounceTimer);
                observer.debounceTimer = setTimeout(processLatestRound, 150);
            });

            // 监听玩家棋盘
            observer.observe(playerBoard, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });

            // 监听对手棋盘（如果存在）
            if (opponentBoard) {
                observer.observe(opponentBoard, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class']
                });
                log('👀 已监听对手棋盘（倒序模式）');
            }

            log('👓 已监听玩家棋盘（倒序模式）');
        };

        // --- UI 事件处理 ---
        const refreshData = () =>
        {
            log('手动刷新数据...');
            isInitialized = false; // Reset initialization flag
            initializeModel(); // Call initializeModel to reload and calculate
            setTimeout(observeGameBoard, 500);
        };
        // --- 新增：手动计算候选词按钮事件 ---
        const calculateCandidatesNow = () =>
        {
            log('手动触发计算候选词...');
            log('尝试从手动输入区重新加载数据...');
            let words = [];
            let length = targetLength;
            // 1. 尝试从手动输入区加载词库
            const manualWordsText = document.getElementById('manual-words-full')?.value.trim();
            if (manualWordsText)
            {
                // --- MODIFICATION: Fix word splitting for manual input ---
                words = manualWordsText.split(/[\r\n]+/).map(w => w.trim()).filter(w => w.length > 0);
                // --- END MODIFICATION ---
                log(`从手动输入区加载词库，共 ${words.length} 个词`);
                // --- MODIFICATION: Update localStorage with manual words ---
                if (currentGameId)
                {
                    const
                    {
                        answers,
                        firstWords
                    } = loadStoredData(currentGameId);
                    saveStoredData(currentGameId, currentGameMode, words, answers, firstWords);
                    log(`手动词库已更新到 localStorage for ID ${currentGameId}`);
                }
                // --- END MODIFICATION ---
            }
            // 2. 尝试从手动输入区加载字数
            const manualLengthInput = document.getElementById('manual-length-full');
            const manualLengthValue = manualLengthInput?.value.trim();
            if (length != 0 && manualLengthValue && !isNaN(manualLengthValue))
            {
                length = parseInt(manualLengthValue);
                log(`从手动输入区获取字数: ${length}`);
            }
            else
            {
                // --- 新增：如果手动输入区没有字数，尝试自动推断 ---
                //if (words.length > 0) {
                //    const inferredLength = words[0].length;
                //    log(`从手动输入词库推断字数: ${inferredLength} (基于第一个词: "${words[0]}")`);
                //     length = inferredLength;
                //} else {
                log('警告: 手动输入区未提供有效字数，且词库为空，无法推断。');
                updateStatus('计算失败：未提供字数或词库');
                document.getElementById('recommended-word').textContent = '推荐词: 无';
                lastRecommendedWord = null;
                return; // 如果没有字数，无法进行后续计算，直接返回
                //}
                // --- END 新增 ---
            }
            // 3. 如果手动输入区没有词库，尝试从页面或 localStorage 加载
            if (words.length === 0)
            {
                // 从 localStorage 加载 (如果已知ID)
                if (currentGameId)
                {
                    const
                    {
                        words: storedWords
                    } = loadStoredData(currentGameId);
                    if (storedWords)
                    {
                        words = storedWords;
                        log(`从 localStorage 加载题库 ID ${currentGameId} 的词库，共 ${words.length} 个词`);
                    }
                }
                if (words.length === 0)
                {
                    // 从页面加载：需要获取当前页面的 scripts
                    // --- 将 scripts 的获取移到这里 ---
                    const scripts = document.querySelectorAll('script');
                    // --- END 修改 ---
                    for (const script of scripts)
                    { // 使用此处定义的 scripts
                        if (script.textContent.includes('let words'))
                        {
                            const match = script.textContent.match(/let words\s*=\s*(\[.*?\]);/s);
                            if (match)
                            {
                                try
                                {
                                    words = eval(match[1]);
                                    log(`从页面脚本中成功提取到词库，共 ${words.length} 个词`);
                                    // --- MODIFICATION: Update localStorage with page words ---
                                    if (currentGameId)
                                    {
                                        const
                                        {
                                            answers,
                                            firstWords
                                        } = loadStoredData(currentGameId);
                                        saveStoredData(currentGameId, currentGameMode, words, answers, firstWords);
                                        log(`页面词库已更新到 localStorage for ID ${currentGameId}`);
                                    }
                                    // --- END MODIFICATION ---
                                    break;
                                }
                                catch (e)
                                {
                                    log(`解析页面词库 (let words) 失败: ${e.message}`);
                                }
                            }
                        }
                        //}
                    }
                }
            }
            if (words.length === 0)
            {
                log('❌ 错误: 无法从手动输入区、页面或localStorage获取词库。');
                updateStatus('计算失败：未找到词库');
                document.getElementById('recommended-word').textContent = '推荐词: 无';
                lastRecommendedWord = null;
                return;
            }
            // 4. 根据加载到的词库和字数，重新构建 dbByLen 和 candidates
            db = words;
            dbByLen = {};
            for (const name of db)
            {
                const n = name.length;
                if (!dbByLen[n]) dbByLen[n] = [];
                dbByLen[n].push(name);
            }
            if (!dbByLen[length])
            {
                log(`❌ 错误: 词库中没有 ${length} 字的词。`);
                updateStatus('计算失败：词库中无指定字数的词');
                document.getElementById('recommended-word').textContent = '推荐词: 无';
                lastRecommendedWord = null;
                return;
            }
            targetLength = length; // 更新全局 targetLength
            //isDuelMode = document.getElementById('manual-mode-full')?.value === '2'; // 更新模式
            // --- MODIFICATION: Use per-ID answer history ---
            // const history = JSON.parse(localStorage.getItem('metrowordle_answer_history') || '{}');
            const history = currentGameId ? loadStoredData(currentGameId).answers :
            {};
            // --- END MODIFICATION ---
            // Initialize candidates with probability based on history [word, probability]
            const baseProb = 1.0 / dbByLen[targetLength].length;
            candidates = dbByLen[targetLength].map(word =>
                                                   {
                // --- MODIFICATION: Use per-ID answer history ---
                const freq = history[word] || 0;
                const boost = Math.min(1.0 + freq * 0.1, 1.5); // 最多 +50%
                // --- END MODIFICATION ---
                return [word, baseProb * boost];
            });
            // 重新归一化
            const total = candidates.reduce((sum, [w, p]) => sum + p, 0);
            candidates = candidates.map(([w, p]) => [w, p / total]);
            log(`已根据新数据加载 ${candidates.length} 个 ${targetLength} 字候选词，初始概率已根据历史记录调整`);
            isInitialized = true; // 设置为已初始化
            updateStatus('已根据新数据初始化');
            lastProcessedGuess = null; // 重置，因为模型状态已更新
            roundNum = 1; // 重置轮次，因为模型状态已更新
            // 5. 调用 updateRecommendation 计算并显示推荐词
            updateRecommendation(); // 调用统一的更新函数
            // --- MODIFICATION: Save the first recommended word for this length after manual calculation ---
            if (lastRecommendedWord)
            {
                if (currentGameId)
                {
                    const
                    {
                        words: currentWords,
                        answers: currentAnswers,
                        firstWords: currentFirstWords
                    } = loadStoredData(currentGameId);
                    if (!currentFirstWords[targetLength] || currentFirstWords[targetLength] !== lastRecommendedWord)
                    {
                        currentFirstWords[targetLength] = lastRecommendedWord;
                        saveStoredData(currentGameId, currentGameMode, currentWords, currentAnswers, currentFirstWords);
                        log(`手动计算后，首次推荐词已更新并保存到 localStorage for ID ${currentGameId}, length ${targetLength}: ${lastRecommendedWord}`);
                    }
                }
            }
            // --- END MODIFICATION ---
        };
        // --- END 新增 ---
        const resetModel = () =>
        {
            log('⚠️ 重置模型 ⚠️');
            candidates = [];
            roundNum = 1;
            lastProcessedGuess = null;
            lastRecommendedWord = null; // Also reset lastRecommendedWord
            const wordDiv = document.getElementById('recommended-word');
            const logDiv = document.getElementById('helper-log');
            if (wordDiv) wordDiv.textContent = '';
            if (logDiv) logDiv.textContent = '';
            updateStatus('已重置');
            isInitialized = false;
            // --- 性能优化：重置缓存 ---
            cachedDuelCompatibleSet = null;
            cachedDuelFeedback = null;
            // --- END 性能优化 ---
            // Ensure recommendation UI is cleared after reset
            document.getElementById('recommended-word').textContent = '推荐词: 无';
        };
        const fillInputBox = () =>
        {
            const word = document.getElementById('recommended-word')?.textContent.replace('推荐词: ', '');
            if (word && word !== '推荐词:')
            {
                const input = document.getElementById('word-input');
                if (input)
                {
                    input.value = word;
                    input.dispatchEvent(new Event('input'));
                    log(`ℹ️ 已填入输入框: ${word}`);
                }
                else
                {
                    log('❌ 错误: 找不到输入框');
                }
            }
            else
            {
                log('ℹ️ 当前无推荐词可填入');
            }
        };
        const submitManualFeedback = () =>
        {
            log('--- 开始处理手动提交反馈 ---'); // 添加日志
            // --- ✅ 先定义 getFeedbackFromVisual ---
            const getFeedbackFromVisual = (containerId) =>
            {
                const boxes = document.querySelectorAll(`#${containerId} > div`);
                return Array.from(boxes).map(box => parseInt(box.dataset.value));
            };
            const lengthInput = document.getElementById('manual-length-full');
            const modeSelect = document.getElementById('manual-mode-full');
            // const feedbackInput = document.getElementById('manual-feedback-full'); // 这个文本框现在是隐藏的，用于兼容或调试
            // const duelFeedbackInput = document.getElementById('manual-duel-feedback-full'); // 这个文本框现在是隐藏的，用于兼容或调试
            const length = lengthInput?.value ? parseInt(lengthInput.value) : targetLength;
            const mode = modeSelect?.value === '2';
            // 从可视化反馈区获取反馈
            const selfFeedback = getFeedbackFromVisual('visual-feedback-self');
            let duelFeedback = null;
            if (mode)
            {
                duelFeedback = getFeedbackFromVisual('visual-feedback-duel');
            }
            // 获取当前显示的推荐词，作为本次反馈对应的猜测词
            const currentDisplayedWord = document.getElementById('recommended-word')?.textContent.replace('推荐词: ', '');
            log(`ℹ️ 当前显示推荐词: "${currentDisplayedWord}"`); // 添加日志
            // 检查获取到的反馈和猜测词是否有效
            if (!selfFeedback || selfFeedback.length === 0)
            {
                log('❌ 错误: 无法从可视化反馈区获取到有效的“我的反馈”数据');
                return;
            }
            if (mode && (!duelFeedback || duelFeedback.length === 0))
            {
                log('❌ 错误: 在对战模式下，无法从可视化反馈区获取到有效的“对手反馈”数据');
                return;
            }
            if (!currentDisplayedWord || currentDisplayedWord === '')
            {
                log('❌ 错误: 无法获取到当前显示的推荐词，无法提交反馈。');
                return;
            }
            if (selfFeedback.length !== length)
            {
                log(`❌ 错误: “我的反馈”长度 (${selfFeedback.length}) 与目标字数 (${length}) 不符`);
                return;
            }
            if (duelFeedback && enableDuelFeedback && duelFeedback.length !== length)
            {
                log(`❌ 错误: “对手反馈”长度 (${duelFeedback.length}) 与目标字数 (${length}) 不符`);
                return;
            }
            log(`ℹ️ 获取到“我的反馈” (长度 ${selfFeedback.length}): [${selfFeedback.join(',')}]`); // 添加日志
            if (duelFeedback && enableDuelFeedback)
            {
                log(`ℹ️ 获取到“对手反馈” (长度 ${duelFeedback.length}): [${duelFeedback.join(',')}]`); // 添加日志
            }
            // 如果手动输入的字数与当前目标字数不同，需要重新初始化候选词列表
            if (length !== targetLength)
            {
                log(`ℹ️ 字数从 ${targetLength} 变更为 ${length}，尝试重新初始化候选词...`); // 添加日志
                if (!dbByLen[length])
                {
                    log(`❌ 错误: 词库中没有 ${length} 字的词，无法切换。`);
                    updateStatus(`错误: 词库中没有 ${length} 字的词`);
                    return;
                }
                targetLength = length; // 更新全局 targetLength
                // Initialize with uniform probability for the new length
                candidates = dbByLen[targetLength].map(word => [word, 1.0 / dbByLen[targetLength].length]);
                log(`ℹ️ 已根据新字数 ${length} 重新加载 ${candidates.length} 个候选词，初始概率均匀分布`); // 添加日志
            }
            isDuelMode = mode; // 更新全局模式
            // *** CRITICAL FIX: Set lastRecommendedWord to the word being submitted feedback for ***
            lastRecommendedWord = currentDisplayedWord;
            log(`ℹ️ 将 lastRecommendedWord 设置为: "${lastRecommendedWord}"`); // 添加日志，确认设置
            // ***
            // --- 调试日志：确认传递给 updateModel 的参数 ---
            log(`ℹ️ 准备调用 updateModel:`); // 添加日志
            log(`　  - lastRecommendedWord: "${lastRecommendedWord}"`); // 添加日志
            log(`　  - selfFeedback: [${selfFeedback.join(',')}]`); // 添加日志
            log(`　  - duelFeedback: ${duelFeedback ? `[${duelFeedback.join(',')}]` : 'null'}`); // 添加日志
            // --- END 调试日志 ---
            // 调用模型更新函数
            updateModel(selfFeedback, duelFeedback);
            // 提交后，隐藏手动输入区，但保持在模态三
            isManualInputVisible = false;
            updateUI(); // 更新UI以隐藏手动输入区
            // *** MODIFIED: Update lastProcessedGuess after manual submission ***
            lastProcessedGuess = {
                word: lastRecommendedWord,
                feedback: selfFeedback
            };
            log(`ℹ️ 手动提交后，更新 lastProcessedGuess 为: { word: "${lastRecommendedWord}", feedback: [${selfFeedback.join(',')}] }`); // 添加日志
            // ***
            log('--- 手动提交反馈处理结束 ---'); // 添加日志
        };

        const importLocalStorageData = () =>
        {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,.txt';
            input.onchange = async (e) =>
            {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () =>
                {
                    try
                    {
                        let importedData;
                        const text = reader.result.trim();

                        // 自动判断是 JSON 还是纯文本（但要求 .txt 也必须是 JSON 格式）
                        if (file.name.endsWith('.txt'))
                        {
                            // 尝试解析为 JSON
                            importedData = JSON.parse(text);
                        }
                        else if (file.name.endsWith('.json'))
                        {
                            importedData = JSON.parse(text);
                        }
                        else
                        {
                            throw new Error('仅支持 .json 或 .txt 文件');
                        }

                        if (!Array.isArray(importedData))
                        {
                            throw new Error('文件内容必须是数组格式');
                        }

                        // 获取当前 localStorage 中已有的数据
                        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

                        // 构建现有数据的 ID 映射（用于合并）
                        const existingMap = new Map();
                        for (const item of existing)
                        {
                            if (item.id !== undefined)
                            {
                                existingMap.set(item.id, item);
                            }
                        }

                        // 合并：用导入的数据覆盖或新增
                        for (const newItem of importedData)
                        {
                            if (newItem.id === undefined)
                            {
                                console.warn('跳过无 id 的数据项:', newItem);
                                continue;
                            }
                            existingMap.set(newItem.id, newItem);
                        }

                        // 转回数组
                        const merged = Array.from(existingMap.values());

                        // 保存回 localStorage
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

                        log(`ℹ️ 成功导入并合并 ${importedData.length} 条数据，当前共 ${merged.length} 个题库`);

                        // 可选：自动刷新当前游戏（如果正在玩）
                        setTimeout(refreshData, 300);

                    }
                    catch (err)
                    {
                        const msg = `❌ 导入失败: ${err.message || '文件格式无效'}`;
                        log(msg);
                        alert(msg);
                    }
                };
                reader.readAsText(file, 'utf-8');
            };
            input.click();
        };

        // --- MODIFICATION: Update saveAnswerToHistory to use per-ID storage ---
        const saveAnswerToHistory = (word) =>
        {
            if (!currentGameId)
            {
                log('❌ 错误: 无法保存答案，未找到当前游戏ID');
                return;
            }
            const
            {
                words: currentWords,
                answers: currentAnswers,
                firstWords: currentFirstWords
            } = loadStoredData(currentGameId);
            currentAnswers[word] = (currentAnswers[word] || 0) + 1;
            saveStoredData(currentGameId, currentGameMode, currentWords, currentAnswers, currentFirstWords);
            log(`✅ 答案 "${word}" 已加入题库 ${currentGameId} 的历史记录 (当前频率: ${currentAnswers[word]})`);
        };
        // --- END MODIFICATION ---
        // --- 初始化 ---
        createUI();
        updateStatus('加载中...');
        // 检测 localStorage 是否为空，若是则提示导入
        const existingData = localStorage.getItem(STORAGE_KEY);
        if (!existingData || existingData === '[]')
        {
            log('ℹ️ 检测到 localStorage 为空，建议导入历史数据');
            // 自动展开 UI 并聚焦到导入区域
            setTimeout(() =>
                       {
                currentModalState = MODAL_STATES.FULL;
                isManualInputVisible = true;
                updateUI();
                const importArea = document.getElementById('import-localstorage-data');
                if (importArea) importArea.focus();
            }, 2000);
        }
        // 如果是每日挑战（无 URL ID），自动展开 UI 提示输入 ID
        const
        {
            id: urlId
        } = getGameIdFromUrl();
        if (urlId === null)
        {
            setTimeout(() =>
                       {
                // currentModalState = MODAL_STATES.FULL;
                isManualInputVisible = true;
                updateUI();
                const idInput = document.getElementById('manual-game-id-full');
                if (idInput)
                {
                    idInput.focus();
                    idInput.placeholder = '例如：留空自动用 daily-20251029';
                }
                log('ℹ️ 检测到每日挑战页面，请输入题库 ID 或留空使用今日日期');
            }, 1500);
        }
        setTimeout(initializeModel, 1000);
        setTimeout(observeGameBoard, 1500);
    }
})();