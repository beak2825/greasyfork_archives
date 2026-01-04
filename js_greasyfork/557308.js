// ==UserScript==
// @name         虎码字根练习
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  为虎码字根表添加表格优化功能和字根练习游戏
// @author 小明
// @license MIT
// @match        https://www.tiger-code.com/docs/comparisonTable
// @icon         https://www.tiger-code.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/557308/%E8%99%8E%E7%A0%81%E5%AD%97%E6%A0%B9%E7%BB%83%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/557308/%E8%99%8E%E7%A0%81%E5%AD%97%E6%A0%B9%E7%BB%83%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    const style = document.createElement('style');
    style.textContent = `
        .scheme-slider {
            display: flex;
            background: #f5f7fa;
            border-radius: 8px;
            padding: 4px;
            position: relative;
            transition: background-color 0.3s;
        }

        .scheme-slider:hover {
            background: #ebedf0;
        }

        .slider-track {
            position: absolute;
            top: 4px;
            height: calc(100% - 8px);
            background: #409eff;
            border-radius: 6px;
            transition: all 0.3s ease;
        }

        .scheme-slider button {
            flex: 1;
            padding: 8px 12px;
            border: none;
            background: transparent;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            z-index: 2;
            transition: all 0.3s;
            font-family: inherit;
            min-width: 60px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .scheme-slider button:hover {
            color: #409eff;
        }

        .switch-container {
            display: flex;
            align-items: center;
            font-size: 14px;
        }

        .mode-switch {
            display: none;
        }

        .slider {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
            background: #ccc;
            border-radius: 24px;
            margin: 0 10px;
            transition: background-color 0.3s;
        }

        .slider-button {
            position: absolute;
            height: 20px;
            width: 20px;
            left: 2px;
            bottom: 2px;
            background: white;
            border-radius: 50%;
            transition: 0.3s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .mode-switch:checked + .slider {
            background: #409eff;
        }

        .mode-switch:checked + .slider .slider-button {
            transform: translateX(26px);
        }

        .game-panel {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9998;
            min-width: 280px;
            font-family: system-ui, -apple-system, sans-serif;
        }

        .scheme-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            min-width: 220px;
            font-family: system-ui, -apple-system, sans-serif;
        }

        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 8px;
            border: none;
            background: #409eff;
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 10000;
            opacity: 0.8;
            transition: opacity 0.3s;
        }

        .back-to-top:hover {
            opacity: 1;
        }

        .start-btn {
            padding: 8px 16px;
            background: #409eff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .start-btn:hover {
            background: #337ecc;
        }

        .start-btn.stop {
            background: #ff6b6b;
        }

        .start-btn.stop:hover {
            background: #ff5252;
        }

        .input-field {
            margin-left: 10px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 100px;
            font-family: monospace;
        }

        .input-field:focus {
            outline: none;
            border-color: #409eff;
            box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
        }

        .root-chars {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .root-pronunciation {
            color: #666;
            margin-bottom: 5px;
        }

        .example-chars {
            color: #888;
            margin-bottom: 10px;
        }

        .code-display {
            font-size: 20px;
            font-family: monospace;
            margin: 10px 0;
            color: #333;
        }

        .emoji {
            font-size: 24px;
            display: inline-block;
            width: 30px;
            text-align: center;
        }

        .game-controls {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 15px;
        }

        .scheme-spacer {
            background-color: #f0f0f0 !important;
        }

        .scheme-spacer td {
            height: 10px;
            padding: 0;
            border: none;
        }

        .highlighted-row {
            background-color: #b9e4fb !important;
            transition: background-color 0.5s ease;
            box-shadow: 0 0 8px rgba(255, 235, 59, 0.3);
        }

        .highlighted-row td {
            background-color: transparent !important;
        }

        @keyframes correctShake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-1px); }
            50% { transform: translateX(1px); }
            75% { transform: translateX(-1px); }
            100% { transform: translateX(0); }
        }

        .correct-feedback {
            animation: correctShake 0.2s ease;
        }

        @keyframes wrongShake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-15px); }
            50% { transform: translateX(15px); }
            75% { transform: translateX(-15px); }
            100% { transform: translateX(0); }
        }

        .wrong-feedback {
            animation: wrongShake 0.4s ease;
        }
    `;
    document.head.appendChild(style);

    // 全局变量
    let globalSliderTrack = null;
    let globalSchemeButtons = [];
    let currentHighlightedRow = null;

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    function init() {
        // 等待5秒后加载方案选择器
        setTimeout(() => {
            createSchemeSelector();
            // 再等2秒加载游戏面板
            setTimeout(createGamePanel, 2000);
        }, 5000);

        createBackToTopButton();
    }

    // 功能1: 返回顶部按钮
    function createBackToTopButton() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'back-to-top';

        button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        document.body.appendChild(button);
    }

    // 功能2: 方案选择器
    function createSchemeSelector() {
        const panel = document.createElement('div');
        panel.className = 'scheme-panel';
        panel.id = 'scheme-selector';

        const title = document.createElement('h3');
        title.textContent = '表格优化方案';
        title.style.marginBottom = '15px';
        title.style.marginTop = '0';

        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'scheme-slider';

        // 创建滑块背景
        const sliderTrack = document.createElement('div');
        sliderTrack.className = 'slider-track';
        globalSliderTrack = sliderTrack;

        const schemes = [
            { id: 'one', name: 'one' },
            { id: 'two', name: 'two' },
            { id: 'three', name: 'three' }
        ];
        const savedScheme = GM_getValue('selectedScheme', 'one');

        // 计算每个按钮的宽度百分比
        const buttonCount = schemes.length;
        const buttonWidthPercent = 100 / buttonCount;

        // 设置滑块宽度与按钮相同
        sliderTrack.style.width = `${buttonWidthPercent}%`;

        schemes.forEach((scheme, index) => {
            const button = document.createElement('button');
            button.textContent = scheme.name;
            button.dataset.scheme = scheme.id;
            button.dataset.index = index;
            globalSchemeButtons.push(button);

            button.addEventListener('click', () => {
                switchToScheme(scheme.id);
                GM_setValue('selectedScheme', scheme.id);
            });

            if (scheme.id === savedScheme) {
                updateSliderPosition(index);
            }

            sliderContainer.appendChild(button);
        });

        sliderContainer.appendChild(sliderTrack);
        panel.appendChild(title);
        panel.appendChild(sliderContainer);
        document.body.appendChild(panel);

        // 加载保存的方案
        switchToScheme(savedScheme);
    }

    // 切换到指定方案
    function switchToScheme(schemeId) {
        // 更新滑块位置
        const targetButton = globalSchemeButtons.find(btn => btn.dataset.scheme === schemeId);
        if (targetButton && globalSliderTrack) {
            const index = parseInt(targetButton.dataset.index);
            updateSliderPosition(index);
        }

        // 切换表格方案
        switchScheme(schemeId);

        // 保存设置
        GM_setValue('selectedScheme', schemeId);
    }

    function updateSliderPosition(index) {
        if (!globalSliderTrack) return;
        const buttonCount = globalSchemeButtons.length;
        const buttonWidthPercent = 100 / buttonCount;

        // 修正滑块位置，确保能滑到底
        const translateX = index * 100;
        globalSliderTrack.style.transform = `translateX(${translateX}%)`;
    }

    function switchScheme(scheme) {
        const table = document.querySelector('.text-2xl table');
        if (!table) return;

        // 移除之前添加的间隔行
        const existingSpacers = table.querySelectorAll('.scheme-spacer');
        existingSpacers.forEach(spacer => spacer.remove());

        // 移除高亮
        if (currentHighlightedRow) {
            currentHighlightedRow.classList.remove('highlighted-row');
            currentHighlightedRow = null;
        }

        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        // 方案1: 原始表格不变
        if (scheme === 'one') {
            // 恢复原始顺序
            rows.sort((a, b) => {
                const indexA = parseInt(a.dataset.originalIndex || 0);
                const indexB = parseInt(b.dataset.originalIndex || 0);
                return indexA - indexB;
            });

            rows.forEach(row => tbody.appendChild(row));
            scrollToTop();
            return;
        }

        // 保存原始索引
        rows.forEach((row, index) => {
            row.dataset.originalIndex = index;
        });

        // 按编码首字母分组
        const groups = {};
        rows.forEach(row => {
            const codeCell = row.querySelector('td:nth-child(2)');
            if (codeCell) {
                const codeText = codeCell.textContent.trim();
                const firstChar = codeText.charAt(0).toLowerCase();
                if (!groups[firstChar]) groups[firstChar] = [];
                groups[firstChar].push(row);
            }
        });

        // 清空tbody
        tbody.innerHTML = '';

        // 方案2: 按字母表顺序
        if (scheme === 'two') {
            const sortedGroups = Object.keys(groups).sort();

            sortedGroups.forEach((char, index) => {
                if (groups[char]) {
                    groups[char].forEach(row => tbody.appendChild(row));
                    // 在组间添加间隔行（除了最后一个组）
                    if (index < sortedGroups.length - 1) {
                        const spacer = createSpacerRow();
                        tbody.appendChild(spacer);
                    }
                }
            });
        }

        // 方案3: 按键盘顺序
        if (scheme === 'three') {
            const keyboardOrder = 'qwertyuiopasdfghjklzxcvbnm'.split('');
            const sortedGroups = Object.keys(groups).sort((a, b) => {
                return keyboardOrder.indexOf(a) - keyboardOrder.indexOf(b);
            });

            sortedGroups.forEach((char, index) => {
                if (groups[char]) {
                    groups[char].forEach(row => tbody.appendChild(row));
                    // 在组间添加间隔行
                    if (index < sortedGroups.length - 1) {
                        const spacer = createSpacerRow();
                        tbody.appendChild(spacer);
                    }
                }
            });
        }

        scrollToTop();
    }

    function createSpacerRow() {
        const spacer = document.createElement('tr');
        spacer.className = 'scheme-spacer';
        const spacerCell = document.createElement('td');
        spacerCell.colSpan = 4;
        spacer.appendChild(spacerCell);
        return spacer;
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 高亮表格中的特定编码行
    function highlightCodeRow(code) {
        // 移除之前的高亮
        if (currentHighlightedRow) {
            currentHighlightedRow.classList.remove('highlighted-row');
        }

        const table = document.querySelector('.text-2xl table');
        if (!table) return;

        // 查找包含指定编码的行
        const rows = table.querySelectorAll('tbody tr');
        for (let row of rows) {
            const codeCell = row.querySelector('td:nth-child(2)');
            if (codeCell && codeCell.textContent.trim().toLowerCase() === code.toLowerCase()) {
                // 高亮该行
                row.classList.add('highlighted-row');
                currentHighlightedRow = row;

                // 滚动到该行
                row.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                break;
            }
        }
    }

    // 添加正确反馈效果
    function addCorrectFeedback() {
        if (!currentHighlightedRow) return;

        // 添加抖动效果
        currentHighlightedRow.classList.add('correct-feedback');

        // 动画结束后移除类
        setTimeout(() => {
            if (currentHighlightedRow) {
                currentHighlightedRow.classList.remove('correct-feedback');
            }
        }, 200);
    }

    // 添加错误反馈效果
    function addWrongFeedback() {
        if (!currentHighlightedRow) return;

        // 添加错误抖动效果
        currentHighlightedRow.classList.add('wrong-feedback');

        // 动画结束后移除类
        setTimeout(() => {
            if (currentHighlightedRow) {
                currentHighlightedRow.classList.remove('wrong-feedback');
            }
        }, 400);
    }

    // 功能3: 基础字根练习游戏
    function createGamePanel() {
        const panel = document.createElement('div');
        panel.className = 'game-panel';
        panel.id = 'word-root-game';

        // 收集表格数据
        const tableData = collectTableData();
        if (!tableData) {
            console.log('未找到表格数据');
            return;
        }

        panel.innerHTML = `
            <h3 style="margin-bottom: 15px; text-align: center; margin-top: 0;">基础字根练习</h3>
            <div class="game-display">
                <div class="root-info">
                    <div class="root-chars"></div>
                    <div class="root-pronunciation"></div>
                    <div class="example-chars"></div>
                </div>
                <div class="code-display"></div>
                <div class="game-input">
                    <span class="emoji">😊</span>
                    <input type="text" class="input-field" placeholder="输入编码">
                </div>
                <div class="game-controls">
                    <label class="switch-container">
                        <input type="checkbox" class="mode-switch">
                        <span class="slider">
                            <span class="slider-button"></span>
                        </span>
                        <span>大码</span>
                    </label>
                    <button class="start-btn">Start</button>
					<span class="counter">0</span>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 游戏状态
        let gameActive = false;
        let currentGameData = [];
        let currentIndex = 0;
        let isSingleCharMode = false;

        const rootCharsEl = panel.querySelector('.root-chars');
        const rootPronEl = panel.querySelector('.root-pronunciation');
        const exampleEl = panel.querySelector('.example-chars');
        const codeDisplayEl = panel.querySelector('.code-display');
        const emojiEl = panel.querySelector('.emoji');
        const inputField = panel.querySelector('.input-field');
        const modeSwitch = panel.querySelector('.mode-switch');
        const startBtn = panel.querySelector('.start-btn');
		const counterEl = panel.querySelector('.counter');

        // 模式切换
        modeSwitch.addEventListener('change', function() {
            isSingleCharMode = this.checked;
            inputField.placeholder = isSingleCharMode ? '输入首字母' : '输入完整编码';

            if (gameActive) {
                inputField.value = '';
                inputField.focus();
            }
        });

        // 开始游戏
        startBtn.addEventListener('click', function() {
            if (gameActive) {
                stopGame();
            } else {
                startGame(tableData);
            }
        });

        // 输入处理
        inputField.addEventListener('input', function() {
            if (!gameActive) return;

            const input = this.value.trim().toLowerCase();
            const currentItem = currentGameData[currentIndex];
            if (!currentItem) return;

            const currentCode = currentItem.code.toLowerCase();

            if (isSingleCharMode) {
                if (input === currentCode.charAt(0)) {
                    // 正确输入
                    emojiEl.textContent = '😊';
                    addCorrectFeedback();
                    handleCorrectInput();
                } else if (input.length > 0 && input !== currentCode.charAt(0)) {
                    // 错误输入
                    emojiEl.textContent = '😢';
                    addWrongFeedback();
                    handleWrongInput();
                }
            } else {
                if (input === currentCode) {
                    // 正确输入
                    emojiEl.textContent = '😊';
                    addCorrectFeedback();
                    handleCorrectInput();
                } else if (input.length >= 2 && input !== currentCode) {
                    // 错误输入
                    emojiEl.textContent = '😢';
                    addWrongFeedback();
                    handleWrongInput();
                }
            }
        });

        // 回车键支持
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !gameActive) {
                startGame(tableData);
            }
        });

        function startGame(data) {
            gameActive = true;
            currentGameData = generateGameData(data);
            currentIndex = 0;
            startBtn.textContent = 'Stop';
            startBtn.classList.add('stop');

			// 初始化计数器
            counterEl.textContent = currentGameData.length;

            // 切换到方案3
            switchToScheme('three');

            // 等待表格切换完成后再显示第一个项目
            setTimeout(() => {
                displayCurrentItem();
                inputField.focus();
            }, 300);
        }

        function stopGame() {
            gameActive = false;
            startBtn.textContent = 'Start';
            startBtn.classList.remove('stop');
            emojiEl.textContent = '😊';
            inputField.value = '';
            codeDisplayEl.textContent = '';
            rootCharsEl.textContent = '';
            rootPronEl.textContent = '';
            exampleEl.textContent = '';
			counterEl.textContent = '0';

            // 移除高亮
            if (currentHighlightedRow) {
                currentHighlightedRow.classList.remove('highlighted-row');
                currentHighlightedRow = null;
            }
        }

		function generateGameData(tableData) {
			const baseKeyboardOrder = 'qwertyuiopasdfghjklzxcvbnm'.split('');
			const gameData = [];

			// 生成扩展键盘序列：键盘顺序 + 键盘逆序 + 键盘顺序，重复20次
			let extendedSequence = [];
			for (let i = 0; i < 20; i++) {
				if (i % 2 === 0) {
					// 键盘顺序
					extendedSequence = extendedSequence.concat(baseKeyboardOrder);
				} else {
					// 键盘逆序
					extendedSequence = extendedSequence.concat([...baseKeyboardOrder].reverse());
				}
			}

			// 每26个字符为一组，每组随机删除6个字符
			const availableChars = [];
			const totalGroups = extendedSequence.length / 26; // 1560 / 26 = 60组

			for (let group = 0; group < totalGroups; group++) {
				const startIndex = group * 26;
				const endIndex = startIndex + 26;
				const groupChars = extendedSequence.slice(startIndex, endIndex);

				// 在当前组中随机删除6个字符
				const groupAfterDeletion = [...groupChars]; // 创建当前组的副本
				for (let i = 0; i < 6; i++) {
					const randomIndex = Math.floor(Math.random() * groupAfterDeletion.length);
					groupAfterDeletion.splice(randomIndex, 1);
				}

				// 将处理后的组添加到最终字符列表
				availableChars.push(...groupAfterDeletion);
			}

			// 验证总数：60组 × 20字符 = 1200字符
			console.log(`生成了 ${availableChars.length} 个练习字符`);

			// 为每个字符选择一个随机的编码
			availableChars.forEach(char => {
				if (tableData.groups[char] && tableData.groups[char].length > 0) {
					const randomIndex = Math.floor(Math.random() * tableData.groups[char].length);
					const selectedCode = tableData.groups[char][randomIndex];
					gameData.push({
						code: selectedCode,
						root: tableData.codeToRoot[selectedCode] || '',
						pronunciation: tableData.codeToPronunciation[selectedCode] || '',
						example: tableData.codeToExample[selectedCode] || ''
					});
				} else {
					console.warn(`字符 '${char}' 在表格数据中没有对应的编码`);
				}
			});

			return gameData;
		}

        function displayCurrentItem() {
            if (currentIndex >= currentGameData.length) {
                // 游戏结束
                emojiEl.textContent = '🎉';
                setTimeout(() => {
                    stopGame();
                }, 2000);
                return;
            }

            const current = currentGameData[currentIndex];
            rootCharsEl.textContent = current.root || '—';
            rootPronEl.textContent = current.pronunciation || '—';
            exampleEl.textContent = current.example || '—';
            codeDisplayEl.textContent = current.code.charAt(0).toUpperCase() + current.code.slice(1);
            inputField.value = '';
            emojiEl.textContent = '😊';

            // 高亮对应的表格行
            highlightCodeRow(current.code);
        }

        function handleCorrectInput() {
            currentIndex++;
			// 更新计数器，剩余数量 = 总数量 - 已完成数量
            counterEl.textContent = currentGameData.length - currentIndex;

            setTimeout(() => {
                displayCurrentItem();
                inputField.focus();
            }, 500);
        }

        function handleWrongInput() {
            inputField.value = '';
            setTimeout(() => {
                emojiEl.textContent = '😊';
                inputField.focus();
            }, 1000);
        }
    }

    function collectTableData() {
        const table = document.querySelector('.text-2xl table');
        if (!table) {
            console.log('未找到表格元素');
            return null;
        }

        const data = {
            codes: [],
            codeToRoot: {},
            codeToPronunciation: {},
            codeToExample: {},
            groups: {}
        };

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
                const code = cells[1].textContent.trim().toLowerCase();
                if (code.length === 2) { // 确保编码是两个字母
                    const root = cells[0].textContent.trim();
                    const pronunciation = cells[2].textContent.trim();
                    const example = cells[3].textContent.trim();

                    data.codes.push(code);
                    data.codeToRoot[code] = root;
                    data.codeToPronunciation[code] = pronunciation;
                    data.codeToExample[code] = example;

                    const firstChar = code.charAt(0);
                    if (!data.groups[firstChar]) {
                        data.groups[firstChar] = [];
                    }
                    data.groups[firstChar].push(code);
                }
            }
        });

        console.log('收集到的数据:', data);
        return data;
    }
})();// ==UserScript==
// @name         虎码字根练习游戏
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  为虎码字根表添加表格优化功能和字根练习游戏
// @author 小明
// @license MIT
// @match        https://www.tiger-code.com/docs/comparisonTable
// @icon         https://www.tiger-code.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    const style = document.createElement('style');
    style.textContent = `
        .scheme-slider {
            display: flex;
            background: #f5f7fa;
            border-radius: 8px;
            padding: 4px;
            position: relative;
            transition: background-color 0.3s;
        }

        .scheme-slider:hover {
            background: #ebedf0;
        }

        .slider-track {
            position: absolute;
            top: 4px;
            height: calc(100% - 8px);
            background: #409eff;
            border-radius: 6px;
            transition: all 0.3s ease;
        }

        .scheme-slider button {
            flex: 1;
            padding: 8px 12px;
            border: none;
            background: transparent;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            z-index: 2;
            transition: all 0.3s;
            font-family: inherit;
            min-width: 60px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .scheme-slider button:hover {
            color: #409eff;
        }

        .switch-container {
            display: flex;
            align-items: center;
            font-size: 14px;
        }

        .mode-switch {
            display: none;
        }

        .slider {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
            background: #ccc;
            border-radius: 24px;
            margin: 0 10px;
            transition: background-color 0.3s;
        }

        .slider-button {
            position: absolute;
            height: 20px;
            width: 20px;
            left: 2px;
            bottom: 2px;
            background: white;
            border-radius: 50%;
            transition: 0.3s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .mode-switch:checked + .slider {
            background: #409eff;
        }

        .mode-switch:checked + .slider .slider-button {
            transform: translateX(26px);
        }

        .game-panel {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9998;
            min-width: 280px;
            font-family: system-ui, -apple-system, sans-serif;
        }

        .scheme-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            min-width: 220px;
            font-family: system-ui, -apple-system, sans-serif;
        }

        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 8px;
            border: none;
            background: #409eff;
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 10000;
            opacity: 0.8;
            transition: opacity 0.3s;
        }

        .back-to-top:hover {
            opacity: 1;
        }

        .start-btn {
            padding: 8px 16px;
            background: #409eff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .start-btn:hover {
            background: #337ecc;
        }

        .start-btn.stop {
            background: #ff6b6b;
        }

        .start-btn.stop:hover {
            background: #ff5252;
        }

        .input-field {
            margin-left: 10px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 100px;
            font-family: monospace;
        }

        .input-field:focus {
            outline: none;
            border-color: #409eff;
            box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
        }

        .root-chars {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .root-pronunciation {
            color: #666;
            margin-bottom: 5px;
        }

        .example-chars {
            color: #888;
            margin-bottom: 10px;
        }

        .code-display {
            font-size: 20px;
            font-family: monospace;
            margin: 10px 0;
            color: #333;
        }

        .emoji {
            font-size: 24px;
            display: inline-block;
            width: 30px;
            text-align: center;
        }

        .game-controls {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 15px;
        }

        .scheme-spacer {
            background-color: #f0f0f0 !important;
        }

        .scheme-spacer td {
            height: 10px;
            padding: 0;
            border: none;
        }

        .highlighted-row {
            background-color: #b9e4fb !important;
            transition: background-color 0.5s ease;
            box-shadow: 0 0 8px rgba(255, 235, 59, 0.3);
        }

        .highlighted-row td {
            background-color: transparent !important;
        }

        @keyframes correctShake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-1px); }
            50% { transform: translateX(1px); }
            75% { transform: translateX(-1px); }
            100% { transform: translateX(0); }
        }

        .correct-feedback {
            animation: correctShake 0.2s ease;
        }

        @keyframes wrongShake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-15px); }
            50% { transform: translateX(15px); }
            75% { transform: translateX(-15px); }
            100% { transform: translateX(0); }
        }

        .wrong-feedback {
            animation: wrongShake 0.4s ease;
        }
    `;
    document.head.appendChild(style);

    // 全局变量
    let globalSliderTrack = null;
    let globalSchemeButtons = [];
    let currentHighlightedRow = null;

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    function init() {
        // 等待5秒后加载方案选择器
        setTimeout(() => {
            createSchemeSelector();
            // 再等2秒加载游戏面板
            setTimeout(createGamePanel, 2000);
        }, 5000);

        createBackToTopButton();
    }

    // 功能1: 返回顶部按钮
    function createBackToTopButton() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.className = 'back-to-top';

        button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        document.body.appendChild(button);
    }

    // 功能2: 方案选择器
    function createSchemeSelector() {
        const panel = document.createElement('div');
        panel.className = 'scheme-panel';
        panel.id = 'scheme-selector';

        const title = document.createElement('h3');
        title.textContent = '表格优化方案';
        title.style.marginBottom = '15px';
        title.style.marginTop = '0';

        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'scheme-slider';

        // 创建滑块背景
        const sliderTrack = document.createElement('div');
        sliderTrack.className = 'slider-track';
        globalSliderTrack = sliderTrack;

        const schemes = [
            { id: 'one', name: 'one' },
            { id: 'two', name: 'two' },
            { id: 'three', name: 'three' }
        ];
        const savedScheme = GM_getValue('selectedScheme', 'one');

        // 计算每个按钮的宽度百分比
        const buttonCount = schemes.length;
        const buttonWidthPercent = 100 / buttonCount;

        // 设置滑块宽度与按钮相同
        sliderTrack.style.width = `${buttonWidthPercent}%`;

        schemes.forEach((scheme, index) => {
            const button = document.createElement('button');
            button.textContent = scheme.name;
            button.dataset.scheme = scheme.id;
            button.dataset.index = index;
            globalSchemeButtons.push(button);

            button.addEventListener('click', () => {
                switchToScheme(scheme.id);
                GM_setValue('selectedScheme', scheme.id);
            });

            if (scheme.id === savedScheme) {
                updateSliderPosition(index);
            }

            sliderContainer.appendChild(button);
        });

        sliderContainer.appendChild(sliderTrack);
        panel.appendChild(title);
        panel.appendChild(sliderContainer);
        document.body.appendChild(panel);

        // 加载保存的方案
        switchToScheme(savedScheme);
    }

    // 切换到指定方案
    function switchToScheme(schemeId) {
        // 更新滑块位置
        const targetButton = globalSchemeButtons.find(btn => btn.dataset.scheme === schemeId);
        if (targetButton && globalSliderTrack) {
            const index = parseInt(targetButton.dataset.index);
            updateSliderPosition(index);
        }

        // 切换表格方案
        switchScheme(schemeId);

        // 保存设置
        GM_setValue('selectedScheme', schemeId);
    }

    function updateSliderPosition(index) {
        if (!globalSliderTrack) return;
        const buttonCount = globalSchemeButtons.length;
        const buttonWidthPercent = 100 / buttonCount;

        // 修正滑块位置，确保能滑到底
        const translateX = index * 100;
        globalSliderTrack.style.transform = `translateX(${translateX}%)`;
    }

    function switchScheme(scheme) {
        const table = document.querySelector('.text-2xl table');
        if (!table) return;

        // 移除之前添加的间隔行
        const existingSpacers = table.querySelectorAll('.scheme-spacer');
        existingSpacers.forEach(spacer => spacer.remove());

        // 移除高亮
        if (currentHighlightedRow) {
            currentHighlightedRow.classList.remove('highlighted-row');
            currentHighlightedRow = null;
        }

        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        // 方案1: 原始表格不变
        if (scheme === 'one') {
            // 恢复原始顺序
            rows.sort((a, b) => {
                const indexA = parseInt(a.dataset.originalIndex || 0);
                const indexB = parseInt(b.dataset.originalIndex || 0);
                return indexA - indexB;
            });

            rows.forEach(row => tbody.appendChild(row));
            scrollToTop();
            return;
        }

        // 保存原始索引
        rows.forEach((row, index) => {
            row.dataset.originalIndex = index;
        });

        // 按编码首字母分组
        const groups = {};
        rows.forEach(row => {
            const codeCell = row.querySelector('td:nth-child(2)');
            if (codeCell) {
                const codeText = codeCell.textContent.trim();
                const firstChar = codeText.charAt(0).toLowerCase();
                if (!groups[firstChar]) groups[firstChar] = [];
                groups[firstChar].push(row);
            }
        });

        // 清空tbody
        tbody.innerHTML = '';

        // 方案2: 按字母表顺序
        if (scheme === 'two') {
            const sortedGroups = Object.keys(groups).sort();

            sortedGroups.forEach((char, index) => {
                if (groups[char]) {
                    groups[char].forEach(row => tbody.appendChild(row));
                    // 在组间添加间隔行（除了最后一个组）
                    if (index < sortedGroups.length - 1) {
                        const spacer = createSpacerRow();
                        tbody.appendChild(spacer);
                    }
                }
            });
        }

        // 方案3: 按键盘顺序
        if (scheme === 'three') {
            const keyboardOrder = 'qwertyuiopasdfghjklzxcvbnm'.split('');
            const sortedGroups = Object.keys(groups).sort((a, b) => {
                return keyboardOrder.indexOf(a) - keyboardOrder.indexOf(b);
            });

            sortedGroups.forEach((char, index) => {
                if (groups[char]) {
                    groups[char].forEach(row => tbody.appendChild(row));
                    // 在组间添加间隔行
                    if (index < sortedGroups.length - 1) {
                        const spacer = createSpacerRow();
                        tbody.appendChild(spacer);
                    }
                }
            });
        }

        scrollToTop();
    }

    function createSpacerRow() {
        const spacer = document.createElement('tr');
        spacer.className = 'scheme-spacer';
        const spacerCell = document.createElement('td');
        spacerCell.colSpan = 4;
        spacer.appendChild(spacerCell);
        return spacer;
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 高亮表格中的特定编码行
    function highlightCodeRow(code) {
        // 移除之前的高亮
        if (currentHighlightedRow) {
            currentHighlightedRow.classList.remove('highlighted-row');
        }

        const table = document.querySelector('.text-2xl table');
        if (!table) return;

        // 查找包含指定编码的行
        const rows = table.querySelectorAll('tbody tr');
        for (let row of rows) {
            const codeCell = row.querySelector('td:nth-child(2)');
            if (codeCell && codeCell.textContent.trim().toLowerCase() === code.toLowerCase()) {
                // 高亮该行
                row.classList.add('highlighted-row');
                currentHighlightedRow = row;

                // 滚动到该行
                row.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                break;
            }
        }
    }

    // 添加正确反馈效果
    function addCorrectFeedback() {
        if (!currentHighlightedRow) return;

        // 添加抖动效果
        currentHighlightedRow.classList.add('correct-feedback');

        // 动画结束后移除类
        setTimeout(() => {
            if (currentHighlightedRow) {
                currentHighlightedRow.classList.remove('correct-feedback');
            }
        }, 200);
    }

    // 添加错误反馈效果
    function addWrongFeedback() {
        if (!currentHighlightedRow) return;

        // 添加错误抖动效果
        currentHighlightedRow.classList.add('wrong-feedback');

        // 动画结束后移除类
        setTimeout(() => {
            if (currentHighlightedRow) {
                currentHighlightedRow.classList.remove('wrong-feedback');
            }
        }, 400);
    }

    // 功能3: 基础字根练习游戏
    function createGamePanel() {
        const panel = document.createElement('div');
        panel.className = 'game-panel';
        panel.id = 'word-root-game';

        // 收集表格数据
        const tableData = collectTableData();
        if (!tableData) {
            console.log('未找到表格数据');
            return;
        }

        panel.innerHTML = `
            <h3 style="margin-bottom: 15px; text-align: center; margin-top: 0;">基础字根练习</h3>
            <div class="game-display">
                <div class="root-info">
                    <div class="root-chars"></div>
                    <div class="root-pronunciation"></div>
                    <div class="example-chars"></div>
                </div>
                <div class="code-display"></div>
                <div class="game-input">
                    <span class="emoji">😊</span>
                    <input type="text" class="input-field" placeholder="输入编码">
                </div>
                <div class="game-controls">
                    <label class="switch-container">
                        <input type="checkbox" class="mode-switch">
                        <span class="slider">
                            <span class="slider-button"></span>
                        </span>
                        <span>大码</span>
                    </label>
                    <button class="start-btn">Start</button>
					<span class="counter">0</span>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 游戏状态
        let gameActive = false;
        let currentGameData = [];
        let currentIndex = 0;
        let isSingleCharMode = false;

        const rootCharsEl = panel.querySelector('.root-chars');
        const rootPronEl = panel.querySelector('.root-pronunciation');
        const exampleEl = panel.querySelector('.example-chars');
        const codeDisplayEl = panel.querySelector('.code-display');
        const emojiEl = panel.querySelector('.emoji');
        const inputField = panel.querySelector('.input-field');
        const modeSwitch = panel.querySelector('.mode-switch');
        const startBtn = panel.querySelector('.start-btn');
		const counterEl = panel.querySelector('.counter');

        // 模式切换
        modeSwitch.addEventListener('change', function() {
            isSingleCharMode = this.checked;
            inputField.placeholder = isSingleCharMode ? '输入首字母' : '输入完整编码';

            if (gameActive) {
                inputField.value = '';
                inputField.focus();
            }
        });

        // 开始游戏
        startBtn.addEventListener('click', function() {
            if (gameActive) {
                stopGame();
            } else {
                startGame(tableData);
            }
        });

        // 输入处理
        inputField.addEventListener('input', function() {
            if (!gameActive) return;

            const input = this.value.trim().toLowerCase();
            const currentItem = currentGameData[currentIndex];
            if (!currentItem) return;

            const currentCode = currentItem.code.toLowerCase();

            if (isSingleCharMode) {
                if (input === currentCode.charAt(0)) {
                    // 正确输入
                    emojiEl.textContent = '😊';
                    addCorrectFeedback();
                    handleCorrectInput();
                } else if (input.length > 0 && input !== currentCode.charAt(0)) {
                    // 错误输入
                    emojiEl.textContent = '😢';
                    addWrongFeedback();
                    handleWrongInput();
                }
            } else {
                if (input === currentCode) {
                    // 正确输入
                    emojiEl.textContent = '😊';
                    addCorrectFeedback();
                    handleCorrectInput();
                } else if (input.length >= 2 && input !== currentCode) {
                    // 错误输入
                    emojiEl.textContent = '😢';
                    addWrongFeedback();
                    handleWrongInput();
                }
            }
        });

        // 回车键支持
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !gameActive) {
                startGame(tableData);
            }
        });

        function startGame(data) {
            gameActive = true;
            currentGameData = generateGameData(data);
            currentIndex = 0;
            startBtn.textContent = 'Stop';
            startBtn.classList.add('stop');

			// 初始化计数器
            counterEl.textContent = currentGameData.length;

            // 切换到方案3
            switchToScheme('three');

            // 等待表格切换完成后再显示第一个项目
            setTimeout(() => {
                displayCurrentItem();
                inputField.focus();
            }, 300);
        }

        function stopGame() {
            gameActive = false;
            startBtn.textContent = 'Start';
            startBtn.classList.remove('stop');
            emojiEl.textContent = '😊';
            inputField.value = '';
            codeDisplayEl.textContent = '';
            rootCharsEl.textContent = '';
            rootPronEl.textContent = '';
            exampleEl.textContent = '';
			counterEl.textContent = '0';

            // 移除高亮
            if (currentHighlightedRow) {
                currentHighlightedRow.classList.remove('highlighted-row');
                currentHighlightedRow = null;
            }
        }

		function generateGameData(tableData) {
			const baseKeyboardOrder = 'qwertyuiopasdfghjklzxcvbnm'.split('');
			const gameData = [];

			// 生成扩展键盘序列：键盘顺序 + 键盘逆序 + 键盘顺序，重复20次
			let extendedSequence = [];
			for (let i = 0; i < 20; i++) {
				if (i % 2 === 0) {
					// 键盘顺序
					extendedSequence = extendedSequence.concat(baseKeyboardOrder);
				} else {
					// 键盘逆序
					extendedSequence = extendedSequence.concat([...baseKeyboardOrder].reverse());
				}
			}

			// 每26个字符为一组，每组随机删除6个字符
			const availableChars = [];
			const totalGroups = extendedSequence.length / 26; // 1560 / 26 = 60组

			for (let group = 0; group < totalGroups; group++) {
				const startIndex = group * 26;
				const endIndex = startIndex + 26;
				const groupChars = extendedSequence.slice(startIndex, endIndex);

				// 在当前组中随机删除6个字符
				const groupAfterDeletion = [...groupChars]; // 创建当前组的副本
				for (let i = 0; i < 6; i++) {
					const randomIndex = Math.floor(Math.random() * groupAfterDeletion.length);
					groupAfterDeletion.splice(randomIndex, 1);
				}

				// 将处理后的组添加到最终字符列表
				availableChars.push(...groupAfterDeletion);
			}

			// 验证总数：60组 × 20字符 = 1200字符
			console.log(`生成了 ${availableChars.length} 个练习字符`);

			// 为每个字符选择一个随机的编码
			availableChars.forEach(char => {
				if (tableData.groups[char] && tableData.groups[char].length > 0) {
					const randomIndex = Math.floor(Math.random() * tableData.groups[char].length);
					const selectedCode = tableData.groups[char][randomIndex];
					gameData.push({
						code: selectedCode,
						root: tableData.codeToRoot[selectedCode] || '',
						pronunciation: tableData.codeToPronunciation[selectedCode] || '',
						example: tableData.codeToExample[selectedCode] || ''
					});
				} else {
					console.warn(`字符 '${char}' 在表格数据中没有对应的编码`);
				}
			});

			return gameData;
		}

        function displayCurrentItem() {
            if (currentIndex >= currentGameData.length) {
                // 游戏结束
                emojiEl.textContent = '🎉';
                setTimeout(() => {
                    stopGame();
                }, 2000);
                return;
            }

            const current = currentGameData[currentIndex];
            rootCharsEl.textContent = current.root || '—';
            rootPronEl.textContent = current.pronunciation || '—';
            exampleEl.textContent = current.example || '—';
            codeDisplayEl.textContent = current.code.charAt(0).toUpperCase() + current.code.slice(1);
            inputField.value = '';
            emojiEl.textContent = '😊';

            // 高亮对应的表格行
            highlightCodeRow(current.code);
        }

        function handleCorrectInput() {
            currentIndex++;
			// 更新计数器，剩余数量 = 总数量 - 已完成数量
            counterEl.textContent = currentGameData.length - currentIndex;

            setTimeout(() => {
                displayCurrentItem();
                inputField.focus();
            }, 500);
        }

        function handleWrongInput() {
            inputField.value = '';
            setTimeout(() => {
                emojiEl.textContent = '😊';
                inputField.focus();
            }, 1000);
        }
    }

    function collectTableData() {
        const table = document.querySelector('.text-2xl table');
        if (!table) {
            console.log('未找到表格元素');
            return null;
        }

        const data = {
            codes: [],
            codeToRoot: {},
            codeToPronunciation: {},
            codeToExample: {},
            groups: {}
        };

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
                const code = cells[1].textContent.trim().toLowerCase();
                if (code.length === 2) { // 确保编码是两个字母
                    const root = cells[0].textContent.trim();
                    const pronunciation = cells[2].textContent.trim();
                    const example = cells[3].textContent.trim();

                    data.codes.push(code);
                    data.codeToRoot[code] = root;
                    data.codeToPronunciation[code] = pronunciation;
                    data.codeToExample[code] = example;

                    const firstChar = code.charAt(0);
                    if (!data.groups[firstChar]) {
                        data.groups[firstChar] = [];
                    }
                    data.groups[firstChar].push(code);
                }
            }
        });

        console.log('收集到的数据:', data);
        return data;
    }
})();