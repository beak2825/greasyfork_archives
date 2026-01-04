// ==UserScript==
// @name         巴哈姆特動畫瘋優化腳本
// @namespace    http://joy880828.net/
// @version      1.0.1
// @description  改善動畫瘋觀看體驗，提供各種自訂功能。
// @author       joy880828
// @license      MIT
// @match        https://ani.gamer.com.tw/
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552061/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%E5%84%AA%E5%8C%96%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/552061/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%E5%84%AA%E5%8C%96%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====================================================
    // 工具物件: GMStorage - 負責處理 GM_API 的讀寫
    // ====================================================
    const GMStorage = {
        // 預設設定：所有功能的開關狀態
        DEFAULT_SETTINGS: {
            enableConsolidation: false,
            enableFiltering: false,
            enableVolumeCustom: false,
            volumeStep: 5,              // 新增: 音量調整幅度預設 5%
            enableSpeedControl: false,
            enablePresetFilter: false,
        },

        DEFAULT_BLOCK_LIST: [],
        DEFAULT_PRESET_STATES: {},

        async getSettings() {
            const stored = await GM_getValue('user_settings', {});
            return Object.assign({}, this.DEFAULT_SETTINGS, stored);
        },

        async saveSetting(key, value) {
            const settings = await this.getSettings();
            settings[key] = value;
            await GM_setValue('user_settings', settings);
        },

        async getBlockList() {
            return await GM_getValue('block_word_list', this.DEFAULT_BLOCK_LIST);
        },

        async saveBlockList(list) {
            await GM_setValue('block_word_list', list);
        },

        async getPresetStates() {
            return await GM_getValue('preset_filter_states', this.DEFAULT_PRESET_STATES);
        },

        async savePresetState(key, value) {
            const states = await GMStorage.getPresetStates();
            states[key] = value;
            await GM_setValue('preset_filter_states', states);
        }
    };


    // ====================================================
    // 模組 A: FilterEditor - 使用者屏蔽詞編輯器類別
    // ====================================================
    class FilterEditor {
        // 程式碼保持不變
        constructor() {
            this.editorModal = null;
            this.editorOverlay = null;
            this.currentBlockList = [];
            this.activeTab = 'text';
        }

        _createDOM() {
            const editorHTML = `
                <div class="ani-script-overlay ani-editor-overlay is-closed" id="ani-editor-overlay"></div>
                <div class="ani-editor-modal is-closed" id="ani-editor-modal">
                    <div class="ani-script-modal-header">
                        <h3>使用者自訂屏蔽詞編輯器</h3>
                        <button class="ani-script-modal-close ani-editor-close">&times;</button>
                    </div>

                    <div class="ani-editor-top-bar">
                        <input type="text" id="ani-filter-input" placeholder="添加屏蔽詞，正則以 '/' 開頭 '/' 結尾">
                        <button id="ani-filter-add-btn">添 加</button>
                    </div>

                    <div class="ani-editor-tabs">
                        <button class="ani-editor-tab-btn is-active" data-tab="text">屏蔽文本</button>
                        <button class="ani-editor-tab-btn" data-tab="regex">屏蔽正則</button>
                    </div>

                    <div class="ani-editor-content" id="ani-editor-content">
                        </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', editorHTML);
            this.editorModal = document.getElementById('ani-editor-modal');
            this.editorOverlay = document.getElementById('ani-editor-overlay');

            this._bindEvents();
        }

        _bindEvents() {
            document.querySelector('.ani-editor-close').addEventListener('click', this.closeEditor.bind(this));
            this.editorOverlay.addEventListener('click', this.closeEditor.bind(this));

            document.querySelectorAll('#ani-editor-modal .ani-editor-tab-btn').forEach(btn => {
                btn.addEventListener('click', this._handleTabChange.bind(this));
            });

            document.getElementById('ani-filter-add-btn').addEventListener('click', this._handleAddWord.bind(this));

            document.getElementById('ani-filter-input').addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this._handleAddWord();
                }
            });

            document.getElementById('ani-editor-content').addEventListener('click', this._handleDeleteWord.bind(this));
        }

        _handleTabChange(event) {
            const newTab = event.target.dataset.tab;
            if (newTab === this.activeTab) return;

            document.querySelector(`#ani-editor-modal .ani-editor-tab-btn.is-active`).classList.remove('is-active');
            event.target.classList.add('is-active');

            this.activeTab = newTab;
            this._renderList();
        }

        async _handleAddWord() {
            const inputElement = document.getElementById('ani-filter-input');
            let rawInput = inputElement.value.trim();
            if (!rawInput) return;

            // 支援逗號或換行分隔批量添加
            const newWords = rawInput.split(/[\n,]/).map(w => w.trim()).filter(w => w.length > 0);
            if (newWords.length === 0) return;

            const uniqueNewWords = newWords.filter(w => !this.currentBlockList.includes(w));

            if (uniqueNewWords.length > 0) {
                this.currentBlockList.push(...uniqueNewWords);
                await GMStorage.saveBlockList(this.currentBlockList);
                this._renderList();
                FilterManager.getInstance().updateFilters();
            }

            inputElement.value = '';
        }

        async _handleDeleteWord(event) {
            if (event.target.closest('.ani-editor-delete-btn')) {
                const deleteButton = event.target.closest('.ani-editor-delete-btn');
                const wordToDelete = deleteButton.dataset.word;

                this.currentBlockList = this.currentBlockList.filter(word => word !== wordToDelete);

                await GMStorage.saveBlockList(this.currentBlockList);
                this._renderList();
                FilterManager.getInstance().updateFilters();
            }
        }

        _renderList() {
            const contentDiv = document.getElementById('ani-editor-content');
            let html = '';

            const isRegex = (word) => word.startsWith('/') && word.endsWith('/') && word.length > 2;

            const filteredList = this.currentBlockList.filter(word => {
                if (this.activeTab === 'regex') {
                    return isRegex(word);
                } else if (this.activeTab === 'text') {
                    return !isRegex(word);
                }
                return false;
            }).sort((a, b) => a.localeCompare(b));

            if (filteredList.length === 0) {
                contentDiv.innerHTML = `<p style="text-align: center; color: #aaa; padding: 20px;">此列表尚無屏蔽詞。</p>`;
                return;
            }

            filteredList.forEach(word => {
                html += `
                    <div class="ani-editor-list-item">
                        <span>${word}</span>
                        <button class="ani-editor-delete-btn" data-word="${word}">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#f44336" style="vertical-align: middle;">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                        </button>
                    </div>
                `;
            });

            contentDiv.innerHTML = html;
        }

        async openEditor() {
            if (!this.editorModal) {
                this._createDOM();
            }

            this.currentBlockList = await GMStorage.getBlockList();
            this._renderList();

            this.editorOverlay.classList.remove('is-closed');
            this.editorModal.classList.remove('is-closed');

            setTimeout(() => {
                this.editorOverlay.classList.add('is-visible');
                this.editorModal.classList.add('is-visible');
                document.getElementById('ani-filter-input').focus();
            }, 10);
        }

        closeEditor() {
            if (this.editorModal && this.editorOverlay) {
                this.editorModal.classList.remove('is-visible');
                this.editorOverlay.classList.remove('is-visible');

                setTimeout(() => {
                    this.editorOverlay.classList.add('is-closed');
                    this.editorModal.classList.add('is-closed');
                }, 300);
            }
        }
    }


    // ====================================================
    // 模組 B: PresetFilterManager - 預設屏蔽詞編輯器類別
    // ====================================================
    class PresetFilterManager {

        PRESET_LIST = [
            // 文本類別 (使用 | 分隔)
            { key: 'greeting_ky', word: '早安 | 午安 | 晚安 | 簽 | 來了 | 報到 | 有人嗎 | 有人在看嗎 | 隔壁 | 代餐 | 大腦 | 倍速', type: 'text', desc: '屏蔽無意義的問候、簽到、報到或無關緊要的彈幕。' },
            { key: 'school_exam', word: '小學 | 中學 | 高中 | 國中 | 大學 | 科大 | 期中考 | 期末考', type: 'text', desc: '屏蔽關於學歷或考試相關的無關彈幕。' },
            { key: 'holiday_event', word: '颱風天 | 放假 | 補假 | 補班 | 中秋 | 端午 | 連假 | 國慶', type: 'text', desc: '屏蔽關於現實生活中的天氣或節日活動的無關彈幕。' },
            { key: 'spoiler_words', word: '高能 | 伏筆 | 劇透 | 記住 | 珍惜 | 後面 | 提示 | 提醒 | 暴雷 | 爆雷 | 盲猜', type: 'text', desc: '屏蔽所有可能涉及劇透、提示或引導的彈幕。' },
            { key: 'mygo_mujica', word: '祥子 | 小祥 | tomori | tomorin | 高松燈 | 愛音 | 爽世 | soyo | 立希 | Rikki | 普通 | 理所當然 | go | 覺悟 | 一輩子 | 一生 | 一休 | 一修 | 還在go | 買狗 | 母雞卡 | mujica | anon | mygo', type: 'text', desc: '屏蔽某兩部熱門動畫中的專屬角色名或關鍵詞。' },

            // 正則表達式類別 (使用 /.../g 包裹)
            { key: 'dates_format', word: '/\\d{4}[-/]\\d{1,2}[-/]\\d{1,2}/g', type: 'regex', desc: '屏蔽所有常見的年月日日期格式，避免日期相關的無意義彈幕。 (例如：2025/10/10)' },
            { key: 'multi_watch', word: '/(?:[一二三四五六七八九十]|I{1,3}V?|I?V|V?I{1,3}|X|\\d{1,2})[刷看巡]/g', type: 'regex', desc: '屏蔽所有表示觀看次數的彈幕（數字或羅馬數字 1-10 刷、看、巡）。' },
            { key: 'chapter_regex', word: '/(第\\s*\\d+\\s*[話集]|N[話集])/g', type: 'regex', desc: '屏蔽所有包含「第N話」或「第N集」等集數相關的彈幕。' },
        ];

        // 程式碼保持不變
        constructor() {
            this.editorModal = null;
            this.editorOverlay = null;
            this.currentStates = {};
        }

        _createDOM() {
            const editorHTML = `
                <div class="ani-script-overlay ani-preset-overlay is-closed" id="ani-preset-overlay"></div>
                <div class="ani-editor-modal ani-preset-modal is-closed" id="ani-preset-modal">
                    <div class="ani-script-modal-header">
                        <h3>預設常見屏蔽詞庫</h3>
                        <button class="ani-script-modal-close ani-preset-close">&times;</button>
                    </div>

                    <div class="ani-editor-content ani-preset-content" id="ani-preset-content">
                        </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', editorHTML);
            this.editorModal = document.getElementById('ani-preset-modal');
            this.editorOverlay = document.getElementById('ani-preset-overlay');

            this._bindEvents();
        }

        _bindEvents() {
            document.querySelector('.ani-preset-close').addEventListener('click', this.closeEditor.bind(this));
            this.editorOverlay.addEventListener('click', this.closeEditor.bind(this));
            document.getElementById('ani-preset-content').addEventListener('change', this._handleSwitchChange.bind(this));
        }

        async _handleSwitchChange(event) {
            if (event.target.type === 'checkbox' && event.target.classList.contains('preset-switch')) {
                const key = event.target.dataset.key;
                const value = event.target.checked;

                await GMStorage.savePresetState(key, value);
                this.currentStates[key] = value;

                FilterManager.getInstance().updateFilters();
            }
        }

        async _renderList() {
            const contentDiv = document.getElementById('ani-preset-content');
            this.currentStates = await GMStorage.getPresetStates();

            let html = '';

            this.PRESET_LIST.forEach(item => {
                const isChecked = (this.currentStates[item.key] === undefined || this.currentStates[item.key] === true) ? 'checked' : '';
                const displayWord = item.type === 'regex' ? `<strong>${item.word}</strong>` : `"${item.word}"`;

                html += `
                    <div class="ani-script-setting-item ani-preset-item">
                        <div style="flex-grow: 1;">
                            <h4 style="margin: 0; font-size: 16px; color: #fff;">
                                ${displayWord}
                            </h4>
                            <p style="margin: 3px 0 0; font-size: 14px; color: #aaa;">${item.desc}</p>
                        </div>
                        <label class="ani-switch">
                            <input type="checkbox" class="preset-switch" data-key="${item.key}" ${isChecked}>
                            <span class="ani-slider"></span>
                        </label>
                    </div>
                `;
            });

            contentDiv.innerHTML = html;
        }

        async getActivePresetWords() {
            const states = await GMStorage.getPresetStates();

            return this.PRESET_LIST
                .filter(item => {
                    return states[item.key] === undefined || states[item.key] === true;
                })
                .map(item => item.word.trim());
        }

        async openEditor() {
            if (!this.editorModal) {
                this._createDOM();
            }

            await this._renderList();

            this.editorOverlay.classList.remove('is-closed');
            this.editorModal.classList.remove('is-closed');

            setTimeout(() => {
                this.editorOverlay.classList.add('is-visible');
                this.editorModal.classList.add('is-visible');
            }, 10);
        }

        closeEditor() {
            if (this.editorModal && this.editorOverlay) {
                this.editorModal.classList.remove('is-visible');
                this.editorOverlay.classList.remove('is-visible');

                setTimeout(() => {
                    this.editorOverlay.classList.add('is-closed');
                    this.editorModal.classList.add('is-closed');
                }, 300);
            }
        }
    }

    // ====================================================
    // 模組 C: PlayerManager - 播放器控制類別 (新增音量控制)
    // ====================================================
    class PlayerManager {
        constructor() {
            this.videoElement = null;
            this.isEnabled = false;
            this.volumeStep = 5;
            this._handleKeyDownBound = this._handleKeyDown.bind(this);
        }

        async init(settings) {
            this.isEnabled = settings.enableVolumeCustom;
            this.volumeStep = settings.volumeStep;

            if (window.location.href.includes('animeVideo.php')) {
                // 等待播放器元素載入
                const findVideo = () => {
                    this.videoElement = document.getElementById('ani_video_html5_api');
                    if (this.videoElement) {
                        console.log('[PlayerManager] 找到播放器元素。');
                        if (this.isEnabled) {
                            this._startKeyListeners();
                        }
                    } else {
                        setTimeout(findVideo, 1000);
                    }
                };
                setTimeout(findVideo, 3000);
            }
        }

        updateStatus(isEnabled, newVolumeStep = null) {
            this.isEnabled = isEnabled;
            if (newVolumeStep !== null) {
                this.volumeStep = newVolumeStep;
            }

            if (!this.videoElement) return;

            if (this.isEnabled) {
                this._startKeyListeners();
            } else {
                this._stopKeyListeners();
            }
        }

        _startKeyListeners() {
            if (!this.videoElement) return;
            document.addEventListener('keydown', this._handleKeyDownBound);
            console.log('[PlayerManager] 鍵盤音量監聽器已啟動。');
        }

        _stopKeyListeners() {
            document.removeEventListener('keydown', this._handleKeyDownBound);
            console.log('[PlayerManager] 鍵盤音量監聽器已停止。');
        }

        _handleKeyDown(event) {
            if (!this.isEnabled || !this.videoElement) return;

            const step = this.volumeStep / 100; // 轉換為 0.01 到 1.0 的浮點數
            let currentVolume = this.videoElement.volume;
            let newVolume = currentVolume;
            let shouldPreventDefault = false;

            if (event.key === 'ArrowUp') {
                newVolume = Math.min(1.0, currentVolume + step); // 音量上限 1.0 (100%)
                shouldPreventDefault = true;
            } else if (event.key === 'ArrowDown') {
                newVolume = Math.max(0.0, currentVolume - step); // 音量下限 0.0 (0%)
                shouldPreventDefault = true;
            }

            if (shouldPreventDefault) {
                event.preventDefault();
                event.stopPropagation();

                if (newVolume !== currentVolume) {
                    this.videoElement.volume = newVolume;
                    // TODO: 可以在此處新增一個 UI 提示，顯示當前音量百分比
                    // console.log(`音量調整至: ${(newVolume * 100).toFixed(0)}%`);
                }
            }
        }
    }


    // ====================================================
    // 模組 D: FilterManager - 彈幕過濾管理類別
    // ====================================================
    class FilterManager {

        static instance = null;

        static getInstance() {
            if (!FilterManager.instance) {
                // 實例化 PresetFilterManager
                FilterManager.instance = new FilterManager(new PresetFilterManager());
            }
            return FilterManager.instance;
        }

        constructor(presetManager) {
            this.isEnabled = false;
            this.userTextFilters = [];
            this.userRegexFilters = [];
            this.presetManager = presetManager;
            this.danmuContainer = null;
            this.observer = null;
        }
        // ... (FilterManager 程式碼與 V0.9.1 相同，故省略) ...
        async init(initialSettings) {
            this.isEnabled = initialSettings.enableFiltering || initialSettings.enablePresetFilter;
            await this._compileFilters(initialSettings);

            if (window.location.href.includes('animeVideo.php')) {
                const findContainer = () => {
                    this.danmuContainer = document.querySelector('[id^="danmu-manager-"]');
                    if (this.danmuContainer) {
                        console.log('[FilterManager] 找到彈幕容器。');
                        if (this.isEnabled) {
                            this._startObserver();
                        }
                    } else {
                        setTimeout(findContainer, 1000);
                    }
                };
                setTimeout(findContainer, 3000);
            }
        }

        async updateStatus(isAnyFilterEnabled) {
            const settings = await GMStorage.getSettings();
            this.isEnabled = settings.enableFiltering || settings.enablePresetFilter;

            if (!this.danmuContainer) return;

            if (this.isEnabled) {
                await this.updateFilters();
                this._startObserver();
            } else {
                this._stopObserver();
            }
        }

        /**
         * 從所有來源讀取列表並編譯過濾器
         */
        async _compileFilters(settings) {
            settings = settings || await GMStorage.getSettings();

            let allRawList = [];

            // 1. 載入使用者自訂屏蔽詞
            if (settings.enableFiltering) {
                const userList = await GMStorage.getBlockList();
                allRawList.push(...userList);
            }

            // 2. 載入已啟用的預設屏蔽詞
            if (settings.enablePresetFilter) {
                const presetList = await this.presetManager.getActivePresetWords();

                presetList.forEach(word => {
                    // 正則表達式
                    if (word.startsWith('/') && word.endsWith('/') && word.length > 2) {
                        allRawList.push(word);
                    } else {
                        // 文本模式以 "|" 拆分，並將每個詞獨立加入列表
                        const textWords = word.split('|').map(w => w.trim()).filter(w => w.length > 0);
                        allRawList.push(...textWords);
                    }
                });
            }

            this.userTextFilters = [];
            this.userRegexFilters = [];

            const isRegex = (word) => word.startsWith('/') && word.endsWith('/') && word.length > 2;

            allRawList.forEach(word => {
                if (isRegex(word)) {
                    const match = word.match(/^\/(.+)\/([gimyus]*)$/);
                    if (match) {
                        try {
                            this.userRegexFilters.push(new RegExp(match[1], match[2] || 'g'));
                        } catch (e) {
                            console.error('無效的正則表達式:', word, e);
                        }
                    }
                } else {
                    // 純文本模式一律轉小寫
                    this.userTextFilters.push(word.toLowerCase());
                }
            });
            console.log(`[FilterManager] 已更新過濾規則：總文本 ${this.userTextFilters.length} 條, 總正則 ${this.userRegexFilters.length} 條。`);
        }

        async updateFilters() {
            if (this.isEnabled) {
                await this._compileFilters();
            }
        }

        _startObserver() {
            if (this.observer) return;

            this.observer = new MutationObserver(this._handleMutations.bind(this));

            const config = { childList: true };
            this.observer.observe(this.danmuContainer, config);

            console.log('[FilterManager] 彈幕監聽器已啟動。');
        }

        _stopObserver() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
                console.log('[FilterManager] 彈幕監聽器已停止。');
            }
        }

        _handleMutations(mutationsList) {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            this._checkDanmu(node);
                        }
                    });
                }
            });
        }

        _checkDanmu(danmuElement) {
            const textContent = danmuElement.textContent;
            if (!textContent) return;

            // 1. 純文本匹配 (不區分大小寫)
            const lowerCaseText = textContent.toLowerCase();
            if (this.userTextFilters.some(filter => lowerCaseText.includes(filter))) {
                danmuElement.remove();
                return;
            }

            // 2. 正則匹配
            if (this.userRegexFilters.some(regex => regex.test(textContent))) {
                danmuElement.remove();
                return;
            }
        }
    }


    // ====================================================
    // 模組 E: UIManager - 介面管理類別 (UI 尺寸/字體/音量輸入修正)
    // ====================================================
    class UIManager {
        constructor() {
            this.modal = null;
            this.overlay = null;
            this.settings = GMStorage.DEFAULT_SETTINGS;
            this.filterEditor = new FilterEditor();
            this.presetFilterManager = new PresetFilterManager();
            this.playerManager = null; // 稍後設定
        }

        async init(playerManager) {
            this.playerManager = playerManager;
            this.settings = await GMStorage.getSettings();
            this._addStyles();
            this._createButton();
            this._createOverlay();
            this._createModal();
            this._bindVolumeInputEvents(); // 新增: 綁定音量輸入事件
        }

        _addStyles() {
            const styles = `
                /* --- 基本元素 --- */
                .ani-script-settings-wrapper {
                    position: fixed;
                    top: 60px;
                    left: 20px;
                    z-index: 9999;
                }
                .ani-script-settings-btn {
                    background-color: #f7a072;
                    color: #1a1a1a;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    width: 35px;
                    height: 27px;
                    line-height: 27px;
                    text-align: center;
                    font-weight: bold;
                    font-size: 14px;
                    transition: background-color 0.2s;
                    padding: 0;
                    outline: none;
                }
                .ani-script-settings-btn:hover {
                    background-color: #d88960;
                }

                /* --- 遮罩與動畫 --- */
                .ani-script-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.6);
                    z-index: 9999;
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                    display: none;
                }
                .ani-script-overlay.is-visible {
                    opacity: 1;
                    display: block;
                }
                .ani-script-overlay.is-closed {
                    display: none;
                }

                .ani-editor-overlay, .ani-preset-overlay {
                    z-index: 10000;
                }

                /* --- 主視窗 (響應式尺寸與字體優化 - 修正 max-width) --- */
                .ani-script-modal {
                    position: fixed;
                    z-index: 10000;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%) scale(0.95);
                    /* 修正：移除 max-width 限制，使用 70% 寬度 */
                    width: 70%;
                    max-height: 80vh;
                    background-color: #2c2c2c;
                    color: #e0e0e0;
                    border: 1px solid #444;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                    padding: 25px;
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
                    pointer-events: none;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .ani-script-modal.is-visible {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                    pointer-events: auto;
                }
                .ani-script-modal.is-closed {
                    display: none;
                }
                .ani-script-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid #f7a072;
                    padding-bottom: 12px;
                    margin-bottom: 15px;
                }
                .ani-script-modal-header h3 {
                    margin: 0;
                    color: #fff;
                    font-size: 20px;
                }
                .ani-script-modal-close {
                    background: none;
                    border: none;
                    font-size: 28px;
                    font-weight: bold;
                    color: #aaa;
                    cursor: pointer;
                }
                .ani-script-modal-close:hover {
                    color: #fff;
                }
                .ani-script-modal-body {
                    overflow-y: auto;
                    padding-right: 15px;
                    flex-grow: 1;
                }

                /* --- 功能列表與開關樣式 (黑暗模式) --- */
                .ani-script-setting-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px dashed #444;
                }
                .ani-script-setting-item h4 {
                    font-size: 16px !important;
                }
                .ani-script-setting-item p {
                    color: #aaa;
                    font-size: 14px;
                }
                .ani-script-edit-btn {
                    background-color: #5865f2;
                    color: white;
                    border: none;
                    padding: 8px 14px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.2s;
                    margin-left: 15px;
                    margin-right: 20px;
                    height: 34px;
                    line-height: 18px;
                    box-sizing: border-box;
                }
                .ani-script-edit-btn:hover {
                    background-color: #4a59d0;
                }

                /* 音量輸入框樣式 */
                .ani-volume-input {
                    width: 60px;
                    height: 34px;
                    padding: 0 5px;
                    margin-right: 15px;
                    text-align: center;
                    background-color: #333;
                    color: #fff;
                    border: 1px solid #555;
                    border-radius: 4px;
                    font-size: 15px;
                }

                /* Switch 樣式 */
                .ani-switch {
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 24px;
                    flex-shrink: 0;
                }
                .ani-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .ani-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #555;
                    transition: 0.3s;
                    border-radius: 20px;
                }
                .ani-slider:before {
                    position: absolute;
                    content: "";
                    height: 20px;
                    width: 20px;
                    left: 2px;
                    bottom: 2px;
                    background-color: white;
                    transition: 0.3s;
                    border-radius: 50%;
                }
                input:checked + .ani-slider {
                    background-color: #f7a072;
                }
                input:checked + .ani-slider:before {
                    transform: translateX(20px);
                }


                /* --- Filter Editor 專屬樣式 (修正 max-width) --- */
                .ani-editor-modal {
                    position: fixed;
                    z-index: 10001;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%) scale(0.95);
                    /* 修正：移除 max-width 限制 */
                    width: 70%;
                    max-height: 80vh;
                    background-color: #1e1e1e;
                    color: #e0e0e0;
                    border: 1px solid #333;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
                    padding: 25px;
                    display: flex;
                    flex-direction: column;

                    opacity: 0;
                    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
                    pointer-events: none;
                }
                .ani-editor-modal.is-visible {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                    pointer-events: auto;
                }
                .ani-editor-top-bar {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .ani-editor-top-bar input {
                    flex-grow: 1;
                    padding: 10px;
                    background-color: #333;
                    color: #fff;
                    border: 1px solid #555;
                    border-radius: 4px;
                    font-size: 15px;
                }
                .ani-editor-top-bar button {
                    background-color: #38b430;
                    color: white;
                    border: none;
                    padding: 10px 18px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 15px;
                    transition: background-color 0.2s;
                }
                .ani-editor-content {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding-right: 15px;
                }
                .ani-editor-list-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #333;
                }
                .ani-editor-list-item span {
                    word-break: break-all;
                    font-size: 15px;
                }
                .ani-editor-delete-btn {
                    margin-left: 20px;
                }

                /* Preset Modal 專屬樣式 (修正 max-width) */
                .ani-preset-modal {
                    width: 70%;
                    max-height: 80vh;
                }
                .ani-preset-content {
                    padding-right: 15px;
                }
                .ani-preset-item {
                    padding: 15px 0;
                    align-items: flex-start;
                    display: flex;
                    gap: 20px;
                }
                .ani-preset-item h4 strong {
                    font-weight: bold;
                }
            `;
            GM_addStyle(styles);
        }

        _createButton() {
            const wrapper = document.createElement('div');
            wrapper.className = 'ani-script-settings-wrapper';

            const button = document.createElement('button');
            button.className = 'ani-script-settings-btn';
            button.id = 'ani-script-settings-btn';
            button.textContent = '⚙';
            button.title = '動畫瘋腳本設定';

            wrapper.appendChild(button);
            document.body.appendChild(wrapper);

            button.addEventListener('click', this.openModal.bind(this));
        }

        _createOverlay() {
            const overlay = document.createElement('div');
            overlay.className = 'ani-script-overlay is-closed';
            overlay.id = 'ani-script-overlay';
            document.body.appendChild(overlay);
            this.overlay = overlay;

            overlay.addEventListener('click', this.closeModal.bind(this));
        }

        _createModal() {
            const modalHTML = `
                <div class="ani-script-modal is-closed" id="ani-script-modal">
                    <div class="ani-script-modal-header">
                        <h3>巴哈姆特動畫瘋優化腳本 設定</h3>
                        <button class="ani-script-modal-close">&times;</button>
                    </div>
                    <div class="ani-script-modal-body" id="ani-script-modal-body">
                        ${this._renderSettingsList()}
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            this.modal = document.getElementById('ani-script-modal');

            document.querySelector('.ani-script-modal-close')
                    .addEventListener('click', this.closeModal.bind(this));

            this._bindSwitchEvents();
        }

        _renderSettingsList() {
            const features = [
                { id: 'enableConsolidation', name: '1. 重複文字集中放大顯示', description: '將短時間內重複的彈幕集中並放大顯示。' },
                { id: 'enableFiltering', name: '2. 屏蔽詞/正則表達式屏蔽 (自訂)', description: '解除 50 詞限制，並支援正則表達式過濾彈幕。' },
                { id: 'enablePresetFilter', name: '3. 預設常見屏蔽詞庫 (推薦)', description: '啟用預設的無意義內容屏蔽詞庫（如：簽到、多刷次數、日期、劇透詞）。' },
                { id: 'enableVolumeCustom', name: '4. 方向鍵音量幅度自訂', description: '自訂鍵盤調整音量的幅度。' },
                { id: 'enableSpeedControl', name: '5. 長按右鍵三倍速播放', description: '長按滑鼠右鍵時加速播放，放開即復原。' },
            ];

            let html = '';
            features.forEach(feat => {
                const isChecked = this.settings[feat.id] ? 'checked' : '';
                const isFilterFeature = feat.id === 'enableFiltering';
                const isPresetFeature = feat.id === 'enablePresetFilter';
                const isVolumeFeature = feat.id === 'enableVolumeCustom';

                let extraControls = '';

                if (isFilterFeature) {
                    extraControls = `<button class="ani-script-edit-btn" id="edit-user-filter-btn" style="display: ${isChecked ? 'block' : 'none'};">編輯屏蔽詞</button>`;
                } else if (isPresetFeature) {
                    extraControls = `<button class="ani-script-edit-btn" id="edit-preset-filter-btn" style="display: ${isChecked ? 'block' : 'none'};">編輯預設庫</button>`;
                } else if (isVolumeFeature) {
                    // 新增音量自訂輸入框
                    extraControls = `
                        <input type="number"
                               id="input-volumeStep"
                               class="ani-volume-input"
                               data-setting-key="volumeStep"
                               value="${this.settings.volumeStep}"
                               min="1" max="100"
                               style="display: ${isChecked ? 'block' : 'none'};">
                    `;
                }

                html += `
                    <div class="ani-script-setting-item">
                        <div style="flex-grow: 1;">
                            <h4 style="margin: 0; color: #fff;">${feat.name}</h4>
                            <p style="margin: 3px 0 0; color: #aaa;">${feat.description}</p>
                        </div>
                        <div style="display: flex; align-items: center;">

                            ${extraControls}

                            <label class="ani-switch">
                                <input type="checkbox" id="switch-${feat.id}" data-setting-key="${feat.id}" ${isChecked}>
                                <span class="ani-slider"></span>
                            </label>
                        </div>
                    </div>
                `;
            });
            return html;
        }

        _bindSwitchEvents() {
            const switches = document.querySelectorAll('.ani-script-modal input[type="checkbox"]');

            switches.forEach(input => {
                input.addEventListener('change', this._handleSwitchChange.bind(this));
            });

            document.getElementById('edit-user-filter-btn')?.addEventListener('click', this._openUserFilterEditor.bind(this));
            document.getElementById('edit-preset-filter-btn')?.addEventListener('click', this._openPresetFilterEditor.bind(this));
        }

        // 新增: 處理音量幅度輸入框的事件
        _bindVolumeInputEvents() {
            const inputElement = document.getElementById('input-volumeStep');
            if (inputElement) {
                inputElement.addEventListener('change', this._handleVolumeStepChange.bind(this));
                inputElement.addEventListener('keyup', this._handleVolumeStepChange.bind(this));
            }
        }

        async _handleVolumeStepChange(event) {
            let value = parseInt(event.target.value, 10);

            // 確保值在 1 到 100 之間
            if (isNaN(value) || value < 1) {
                value = 1;
            } else if (value > 100) {
                value = 100;
            }

            event.target.value = value; // 更新輸入框顯示的值

            await GMStorage.saveSetting('volumeStep', value);
            this.settings.volumeStep = value;

            // 通知 PlayerManager 更新幅度
            this.playerManager.updateStatus(this.settings.enableVolumeCustom, value);
        }

        async _handleSwitchChange(event) {
            const key = event.target.dataset.settingKey;
            const value = event.target.checked;

            await GMStorage.saveSetting(key, value);
            this.settings[key] = value;

            const editBtnId = key === 'enableFiltering' ? 'edit-user-filter-btn' :
                              key === 'enablePresetFilter' ? 'edit-preset-filter-btn' : null;

            if (editBtnId) {
                const editBtn = document.getElementById(editBtnId);
                if (editBtn) {
                    editBtn.style.display = value ? 'block' : 'none';
                }
            } else if (key === 'enableVolumeCustom') {
                // 處理音量輸入框的顯示
                const volumeInput = document.getElementById('input-volumeStep');
                if (volumeInput) {
                    volumeInput.style.display = value ? 'block' : 'none';
                }
                // 通知 PlayerManager 狀態改變
                this.playerManager.updateStatus(value, this.settings.volumeStep);
            }

            // 通知 FilterManager 狀態改變
            if (key === 'enableFiltering' || key === 'enablePresetFilter') {
                FilterManager.getInstance().updateStatus(
                    this.settings.enableFiltering || this.settings.enablePresetFilter
                );
            }
        }

        _openUserFilterEditor() {
            this.filterEditor.openEditor();
        }

        _openPresetFilterEditor() {
            this.presetFilterManager.openEditor();
        }

        openModal() {
            if (this.modal && this.overlay) {
                this.modal.classList.remove('is-closed');
                this.overlay.classList.remove('is-closed');

                setTimeout(() => {
                    this.overlay.classList.add('is-visible');
                    this.modal.classList.add('is-visible');
                }, 10);
            }
        }

        closeModal() {
            if (this.modal && this.overlay) {
                this.modal.classList.remove('is-visible');
                this.overlay.classList.remove('is-visible');

                setTimeout(() => {
                    this.overlay.classList.add('is-closed');
                    this.modal.classList.add('is-closed');
                }, 300);
            }
        }
    }


    // ====================================================
    // V. 腳本主執行區塊 (Main Entry)
    // ====================================================
    async function main() {
        const filterManager = FilterManager.getInstance();
        const playerManager = new PlayerManager(); // 實例化 PlayerManager
        const uiManager = new UIManager();

        // 1. 初始化 PlayerManager (需先於 UIManager 綁定事件)
        const initialSettings = await GMStorage.getSettings();
        await playerManager.init(initialSettings);

        // 2. 初始化 UIManager (需傳入 PlayerManager 實例)
        await uiManager.init(playerManager);

        // 3. 初始化 FilterManager
        await filterManager.init(initialSettings);

        console.log('巴哈姆特優化腳本：v1.0.0 載入完成。');
    }
    main();

})();