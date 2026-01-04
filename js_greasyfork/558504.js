// ==UserScript==
// @name         MonkeyType AutoTyper Bot (2025new）
// @namespace    https://greasyfork.org/users/1546585
// @version      3.1
// @description  A Bot that automatically types for you in MonkeyType (Fixed Version)
// @author       Liksss
// @match        *://monkeytype.com/*
// @icon         https://th.bing.com/th/id/R.c8397fb766c4397fea8a8b499c15a453?rik=aROX42RoH7HhXw&pid=ImgRaw&r=0
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558504/MonkeyType%20AutoTyper%20Bot%20%282025new%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558504/MonkeyType%20AutoTyper%20Bot%20%282025new%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    "use strict";

    class AutoTyper {
        constructor() {
            this.isTyping = false;
            this.timeoutId = null;
            this.config = {
                minDelay: 100,
                maxDelay: 333,
                accuracy: 0.95,
                wpm: 50,
                pauseDelay: 100,
                mode: 'basic' // 'basic' or 'advanced'
            };

            this.TOGGLE_KEY = "ArrowRight";
            this.init();
        }

        init() {
            this.setupEventListeners();
            this.createGUI();
            this.loadConfig();

            console.log("MonkeyType AutoTyper Bot (Fixed) loaded. Press ArrowRight to toggle.");
        }

        setupEventListeners() {
            // 切换打字状态
            window.addEventListener("keydown", (event) => {
                if (event.code === this.TOGGLE_KEY && !event.repeat) {
                    event.preventDefault();
                    this.toggleTyping();
                }
            });

            // 监听页面卸载，清理定时器
            window.addEventListener("beforeunload", () => {
                this.stopTyping();
            });
        }

        toggleTyping() {
            this.isTyping = !this.isTyping;

            if (this.isTyping) {
                console.log("STARTED TYPING TEST");
                this.startTyping();
            } else {
                console.log("STOPPED TYPING TEST");
                this.stopTyping();
            }
        }

        canType() {
            const typingTest = document.getElementById("typingTest");
            if (!typingTest) return false;

            const isHidden = typingTest.classList.contains("hidden");
            if (isHidden) {
                this.isTyping = false;
                return false;
            }

            return this.isTyping;
        }

        getNextCharacter() {
            const currentWord = document.querySelector(".word.active");
            if (!currentWord) return " ";

            for (const letter of currentWord.children) {
                if (letter.className === "") {
                    return letter.textContent;
                }
            }

            return " ";
        }

        // 完整的键盘布局映射（包括数字、符号、大写）
        getAdjacentKey(key) {
            const keyboardLayout = {
                // 数字行
                '`': ['1', '~'],
                '1': ['`', '2', 'q', '!'],
                '2': ['1', '3', 'q', 'w', '@'],
                '3': ['2', '4', 'w', 'e', '#'],
                '4': ['3', '5', 'e', 'r', '$'],
                '5': ['4', '6', 'r', 't', '%'],
                '6': ['5', '7', 't', 'y', '^'],
                '7': ['6', '8', 'y', 'u', '&'],
                '8': ['7', '9', 'u', 'i', '*'],
                '9': ['8', '0', 'i', 'o', '('],
                '0': ['9', '-', 'o', 'p', ')'],
                '-': ['0', '=', 'p', '[', '_'],
                '=': ['-', ']', '[', '\\', '+'],

                // 第一行（字母）
                'q': ['1', '2', 'w', 'a'],
                'w': ['q', 'e', 'a', 's', '2', '3'],
                'e': ['w', 'r', 's', 'd', '3', '4'],
                'r': ['e', 't', 'd', 'f', '4', '5'],
                't': ['r', 'y', 'f', 'g', '5', '6'],
                'y': ['t', 'u', 'g', 'h', '6', '7'],
                'u': ['y', 'i', 'h', 'j', '7', '8'],
                'i': ['u', 'o', 'j', 'k', '8', '9'],
                'o': ['i', 'p', 'k', 'l', '9', '0'],
                'p': ['o', '[', 'l', ';', '0', '-'],

                // 第二行
                'a': ['q', 'w', 's', 'z'],
                's': ['w', 'e', 'a', 'd', 'z', 'x'],
                'd': ['e', 'r', 's', 'f', 'x', 'c'],
                'f': ['r', 't', 'd', 'g', 'c', 'v'],
                'g': ['t', 'y', 'f', 'h', 'v', 'b'],
                'h': ['y', 'u', 'g', 'j', 'b', 'n'],
                'j': ['u', 'i', 'h', 'k', 'n', 'm'],
                'k': ['i', 'o', 'j', 'l', 'm', ','],
                'l': ['o', 'p', 'k', ';', ',', '.'],

                // 第三行
                'z': ['a', 's', 'x'],
                'x': ['s', 'd', 'z', 'c'],
                'c': ['d', 'f', 'x', 'v'],
                'v': ['f', 'g', 'c', 'b'],
                'b': ['g', 'h', 'v', 'n'],
                'n': ['h', 'j', 'b', 'm'],
                'm': ['j', 'k', 'n', ','],

                // 符号
                '[': ['p', ']', ';', "'"],
                ']': ['[', '\\', "'", 'Enter'],
                '\\': [']', 'Enter'],
                ';': ['l', "'", 'p', '[', '.', '/'],
                "'": [';', 'Enter', '[', ']'],
                ',': ['m', '.', 'k', 'l'],
                '.': [',', '/', 'l', ';'],
                '/': ['.', ';'],

                // 大写字母映射到小写
                'Q': ['1', '2', 'w', 'a'],
                'W': ['q', 'e', 'a', 's', '2', '3'],
                'E': ['w', 'r', 's', 'd', '3', '4'],
                'R': ['e', 't', 'd', 'f', '4', '5'],
                'T': ['r', 'y', 'f', 'g', '5', '6'],
                'Y': ['t', 'u', 'g', 'h', '6', '7'],
                'U': ['y', 'i', 'h', 'j', '7', '8'],
                'I': ['u', 'o', 'j', 'k', '8', '9'],
                'O': ['i', 'p', 'k', 'l', '9', '0'],
                'P': ['o', '[', 'l', ';', '0', '-'],
                'A': ['q', 'w', 's', 'z'],
                'S': ['w', 'e', 'a', 'd', 'z', 'x'],
                'D': ['e', 'r', 's', 'f', 'x', 'c'],
                'F': ['r', 't', 'd', 'g', 'c', 'v'],
                'G': ['t', 'y', 'f', 'h', 'v', 'b'],
                'H': ['y', 'u', 'g', 'j', 'b', 'n'],
                'J': ['u', 'i', 'h', 'k', 'n', 'm'],
                'K': ['i', 'o', 'j', 'l', 'm', ','],
                'L': ['o', 'p', 'k', ';', ',', '.'],
                'Z': ['a', 's', 'x'],
                'X': ['s', 'd', 'z', 'c'],
                'C': ['d', 'f', 'x', 'v'],
                'V': ['f', 'g', 'c', 'b'],
                'B': ['g', 'h', 'v', 'n'],
                'N': ['h', 'j', 'b', 'm'],
                'M': ['j', 'k', 'n', ','],

                // 空格特殊处理
                ' ': [' ']
            };

            const lowerKey = key.toLowerCase();
            const mappingKey = keyboardLayout.hasOwnProperty(key) ? key :
                              keyboardLayout.hasOwnProperty(lowerKey) ? lowerKey : null;

            if (mappingKey && keyboardLayout[mappingKey]) {
                const adjacentKeys = keyboardLayout[mappingKey];
                const randomIndex = Math.floor(Math.random() * adjacentKeys.length);
                return adjacentKeys[randomIndex];
            }

            // 对于未定义的键，返回原字符
            return key;
        }

        pressKey(key) {
            const wordsInput = document.getElementById("wordsInput");
            if (!wordsInput) return;

            // 创建并触发 keydown 事件
            const keydownEvent = new KeyboardEvent('keydown', {
                key: key,
                code: key === ' ' ? 'Space' : `Key${key.toUpperCase()}`,
                keyCode: key.charCodeAt(0),
                which: key.charCodeAt(0),
                bubbles: true,
                cancelable: true,
                composed: true
            });
            wordsInput.dispatchEvent(keydownEvent);

            // 更新输入框的值
            wordsInput.value += key;

            // 创建并触发 input 事件
            const inputEvent = new InputEvent('input', {
                inputType: 'insertText',
                data: key,
                bubbles: true,
                cancelable: false,
                composed: true
            });
            wordsInput.dispatchEvent(inputEvent);

            // 创建并触发 keyup 事件
            const keyupEvent = new KeyboardEvent('keyup', {
                key: key,
                code: key === ' ' ? 'Space' : `Key${key.toUpperCase()}`,
                keyCode: key.charCodeAt(0),
                which: key.charCodeAt(0),
                bubbles: true,
                cancelable: true,
                composed: true
            });
            wordsInput.dispatchEvent(keyupEvent);

            // 触发 change 事件
            const changeEvent = new Event('change', { bubbles: true });
            wordsInput.dispatchEvent(changeEvent);
        }

        typeCharacter() {
            if (!this.canType()) {
                this.stopTyping();
                return;
            }

            const nextChar = this.getNextCharacter();
            const randomValue = Math.random();
            const accuracy = parseFloat(this.config.accuracy);

            // 修复的错误模拟逻辑 - 使用单一随机数
            if (randomValue > accuracy) {
                // 发生错误
                const errorType = Math.random();

                if (errorType < 0.33) {
                    // 跳过字符
                    console.log(`[ERROR] Skipped character: "${nextChar}"`);
                } else if (errorType < 0.66) {
                    // 重复字符
                    console.log(`[ERROR] Repeated character: "${nextChar}"`);
                    this.pressKey(nextChar);
                    this.pressKey(nextChar);
                } else {
                    // 输入相邻错误字符
                    const wrongChar = this.getAdjacentKey(nextChar);
                    console.log(`[ERROR] Typed "${wrongChar}" instead of "${nextChar}"`);
                    this.pressKey(wrongChar);

                    // 模拟退格修正错误（可选）
                    // 注意：MonkeyType可能不需要退格，因为它会标记错误
                }
            } else {
                // 正确输入
                this.pressKey(nextChar);
            }

            // 计算下一个字符的延迟
            let delay;
            if (this.config.mode === 'basic') {
                // 基础模式：根据WPM计算延迟
                // WPM = (字符数/5) / (分钟)
                // 每个字符的延迟 = 60000 / (WPM * 5)
                delay = 60000 / (this.config.wpm * 5);
            } else {
                // 高级模式：随机延迟
                delay = this.random(this.config.minDelay, this.config.maxDelay);
            }

            // 单词间的额外暂停
            if (nextChar === " ") {
                delay += this.config.pauseDelay;
            }

            // 安排下一个字符
            this.timeoutId = setTimeout(() => {
                this.typeCharacter();
            }, delay);
        }

        random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        startTyping() {
            if (!this.canType()) return;
            this.typeCharacter();
        }

        stopTyping() {
            this.isTyping = false;
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
        }

        createGUI() {
            // 移除已存在的GUI
            const existingGUI = document.getElementById('monkeytype-autotyper-gui');
            if (existingGUI) {
                existingGUI.remove();
            }

            const gui = document.createElement('div');
            gui.id = 'monkeytype-autotyper-gui';
            gui.style.cssText = `
                position: fixed;
                bottom: 30%;
                right: 0;
                transform: translateY(50%);
                padding: 10px;
                background: rgba(0, 0, 0, 0.85);
                color: white;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 12px;
                z-index: 10000;
                border-radius: 8px 0 0 8px;
                border: 1px solid #444;
                box-shadow: -2px 2px 10px rgba(0,0,0,0.5);
                min-width: 200px;
                backdrop-filter: blur(5px);
            `;

            gui.innerHTML = `
                <div style="margin-bottom: 8px; font-weight: bold; border-bottom: 1px solid #555; padding-bottom: 5px;">
                    🐵 AutoTyper Bot 
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; gap: 5px; margin-bottom: 5px;">
                        <button id="basicBtn" class="mode-btn active">Basic</button>
                        <button id="advancedBtn" class="mode-btn">Advanced</button>
                    </div>

                    <div id="basicSection" class="section">
                        <div class="slider-group">
                            <label>WPM: <span id="wpmValue">50</span></label>
                            <input type="range" id="wpmSlider" min="10" max="150" step="5" value="50" class="slider">
                        </div>
                    </div>

                    <div id="advancedSection" class="section" style="display: none;">
                        <div class="slider-group">
                            <label>Min Delay: <span id="minDelayValue">100ms</span></label>
                            <input type="range" id="minDelaySlider" min="0" max="500" step="10" value="100" class="slider">
                        </div>
                        <div class="slider-group">
                            <label>Max Delay: <span id="maxDelayValue">333ms</span></label>
                            <input type="range" id="maxDelaySlider" min="0" max="1000" step="10" value="333" class="slider">
                        </div>
                        <div class="slider-group">
                            <label>Pause Delay: <span id="pauseDelayValue">100ms</span></label>
                            <input type="range" id="pauseDelaySlider" min="0" max="500" step="10" value="100" class="slider">
                        </div>
                    </div>

                    <div class="slider-group">
                        <label>Accuracy: <span id="accuracyValue">95%</span></label>
                        <input type="range" id="accuracySlider" min="0.5" max="1" step="0.01" value="0.95" class="slider">
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                        <button id="resetBtn" class="btn">Reset</button>
                        <div style="color: #aaa; font-size: 10px;">
                            Toggle: ArrowRight
                        </div>
                    </div>

                    <div id="status" style="margin-top: 5px; font-size: 10px; color: #4CAF50;">
                        Ready
                    </div>
                </div>

                <style>
                    .slider {
                        width: 100%;
                        height: 6px;
                        background: #333;
                        outline: none;
                        -webkit-appearance: none;
                        border-radius: 3px;
                    }

                    .slider::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        width: 16px;
                        height: 16px;
                        background: #4CAF50;
                        border-radius: 50%;
                        cursor: pointer;
                    }

                    .btn, .mode-btn {
                        background: #4CAF50;
                        color: white;
                        border: none;
                        padding: 5px 10px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 11px;
                        transition: background 0.2s;
                    }

                    .btn:hover, .mode-btn:hover {
                        background: #45a049;
                    }

                    .mode-btn.active {
                        background: #2196F3;
                    }

                    .slider-group {
                        margin-bottom: 8px;
                    }

                    .slider-group label {
                        display: block;
                        margin-bottom: 3px;
                        font-size: 11px;
                    }

                    .section {
                        transition: all 0.3s ease;
                    }
                </style>
            `;

            document.body.appendChild(gui);
            this.setupGUIListeners();
        }

        setupGUIListeners() {
            const debounce = (func, wait) => {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            };

            // 模式切换
            document.getElementById('basicBtn').addEventListener('click', () => {
                this.config.mode = 'basic';
                document.getElementById('basicBtn').classList.add('active');
                document.getElementById('advancedBtn').classList.remove('active');
                document.getElementById('basicSection').style.display = 'block';
                document.getElementById('advancedSection').style.display = 'none';
                this.saveConfig();
            });

            document.getElementById('advancedBtn').addEventListener('click', () => {
                this.config.mode = 'advanced';
                document.getElementById('advancedBtn').classList.add('active');
                document.getElementById('basicBtn').classList.remove('active');
                document.getElementById('basicSection').style.display = 'none';
                document.getElementById('advancedSection').style.display = 'block';
                this.saveConfig();
            });

            // 滑块事件监听器（使用防抖）
            const updateStatus = () => {
                const status = document.getElementById('status');
                status.textContent = 'Settings saved';
                status.style.color = '#4CAF50';
                setTimeout(() => {
                    status.textContent = this.isTyping ? 'Typing...' : 'Ready';
                }, 2000);
            };

            const saveConfigDebounced = debounce(() => {
                this.saveConfig();
                updateStatus();
            }, 500);

            // WPM 滑块
            const wpmSlider = document.getElementById('wpmSlider');
            const wpmValue = document.getElementById('wpmValue');
            wpmSlider.addEventListener('input', () => {
                this.config.wpm = parseInt(wpmSlider.value);
                wpmValue.textContent = wpmSlider.value;
                saveConfigDebounced();
            });

            // 最小延迟滑块
            const minDelaySlider = document.getElementById('minDelaySlider');
            const minDelayValue = document.getElementById('minDelayValue');
            minDelaySlider.addEventListener('input', () => {
                this.config.minDelay = parseInt(minDelaySlider.value);
                minDelayValue.textContent = `${this.config.minDelay}ms`;
                saveConfigDebounced();
            });

            // 最大延迟滑块
            const maxDelaySlider = document.getElementById('maxDelaySlider');
            const maxDelayValue = document.getElementById('maxDelayValue');
            maxDelaySlider.addEventListener('input', () => {
                this.config.maxDelay = parseInt(maxDelaySlider.value);
                maxDelayValue.textContent = `${this.config.maxDelay}ms`;
                saveConfigDebounced();
            });

            // 暂停延迟滑块
            const pauseDelaySlider = document.getElementById('pauseDelaySlider');
            const pauseDelayValue = document.getElementById('pauseDelayValue');
            pauseDelaySlider.addEventListener('input', () => {
                this.config.pauseDelay = parseInt(pauseDelaySlider.value);
                pauseDelayValue.textContent = `${this.config.pauseDelay}ms`;
                saveConfigDebounced();
            });

            // 准确率滑块
            const accuracySlider = document.getElementById('accuracySlider');
            const accuracyValue = document.getElementById('accuracyValue');
            accuracySlider.addEventListener('input', () => {
                this.config.accuracy = parseFloat(accuracySlider.value);
                accuracyValue.textContent = `${Math.round(this.config.accuracy * 100)}%`;
                saveConfigDebounced();
            });

            // 重置按钮
            document.getElementById('resetBtn').addEventListener('click', () => {
                this.resetConfig();
            });
        }

        resetConfig() {
            this.config = {
                minDelay: 100,
                maxDelay: 333,
                accuracy: 0.95,
                wpm: 50,
                pauseDelay: 100,
                mode: 'basic'
            };

            // 更新滑块
            document.getElementById('wpmSlider').value = this.config.wpm;
            document.getElementById('wpmValue').textContent = this.config.wpm;

            document.getElementById('minDelaySlider').value = this.config.minDelay;
            document.getElementById('minDelayValue').textContent = `${this.config.minDelay}ms`;

            document.getElementById('maxDelaySlider').value = this.config.maxDelay;
            document.getElementById('maxDelayValue').textContent = `${this.config.maxDelay}ms`;

            document.getElementById('pauseDelaySlider').value = this.config.pauseDelay;
            document.getElementById('pauseDelayValue').textContent = `${this.config.pauseDelay}ms`;

            document.getElementById('accuracySlider').value = this.config.accuracy;
            document.getElementById('accuracyValue').textContent = `${Math.round(this.config.accuracy * 100)}%`;

            // 切换回基础模式
            this.config.mode = 'basic';
            document.getElementById('basicBtn').click();

            this.saveConfig();

            const status = document.getElementById('status');
            status.textContent = 'Settings reset to default';
            status.style.color = '#FF9800';
            setTimeout(() => {
                status.textContent = 'Ready';
                status.style.color = '#4CAF50';
            }, 2000);
        }

        saveConfig() {
            localStorage.setItem('monkeytype-autotyper-config', JSON.stringify(this.config));
        }

        loadConfig() {
            try {
                const savedConfig = localStorage.getItem('monkeytype-autotyper-config');
                if (savedConfig) {
                    const config = JSON.parse(savedConfig);
                    this.config = { ...this.config, ...config };

                    // 更新GUI
                    if (document.getElementById('wpmSlider')) {
                        document.getElementById('wpmSlider').value = this.config.wpm;
                        document.getElementById('wpmValue').textContent = this.config.wpm;

                        document.getElementById('minDelaySlider').value = this.config.minDelay;
                        document.getElementById('minDelayValue').textContent = `${this.config.minDelay}ms`;

                        document.getElementById('maxDelaySlider').value = this.config.maxDelay;
                        document.getElementById('maxDelayValue').textContent = `${this.config.maxDelay}ms`;

                        document.getElementById('pauseDelaySlider').value = this.config.pauseDelay;
                        document.getElementById('pauseDelayValue').textContent = `${this.config.pauseDelay}ms`;

                        document.getElementById('accuracySlider').value = this.config.accuracy;
                        document.getElementById('accuracyValue').textContent = `${Math.round(this.config.accuracy * 100)}%`;

                        // 设置模式
                        if (this.config.mode === 'advanced') {
                            document.getElementById('advancedBtn').click();
                        } else {
                            document.getElementById('basicBtn').click();
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to load config:', error);
            }
        }
    }

    // 等待页面加载完成后初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new AutoTyper();
            });
        } else {
            new AutoTyper();
        }
    }

    // 防止重复加载
    if (!window.monkeyTypeAutoTyperInstance) {
        window.monkeyTypeAutoTyperInstance = true;
        init();
    }
})();