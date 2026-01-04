// ==UserScript==
// @name         Content Control
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Block or filter content on Zhihu, Xiaohongshu, Bilibili, and Weibo based on keywords.
// @author       Your Name
// @match        https://www.zhihu.com/*
// @match        https://www.xiaohongshu.com/*
// @match        https://www.bilibili.com/*
// @match        https://www.bilibili.com/?*
// @match        https://www.bilibili.com/v/*
// @match        https://search.bilibili.com/*
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @match        https://s.weibo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552431/Content%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/552431/Content%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Constants and Storage ---
    const BLOCK_STORAGE_KEY = 'keyword_blocker_words';
    const SHOW_STORAGE_KEY = 'showlist_keywords';
    const MODE_STORAGE_KEY = 'content_control_mode'; // 'block' or 'show'
    const DISABLED_SITES_KEY = 'content_control_disabled_sites';

    const DEFAULT_BLOCK_KEYWORDS = ['男','女'];
    const DEFAULT_SHOW_KEYWORDS = ['AI'];

    // --- Utility Functions ---
    function loadFromStorage(key, defaultValue) {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch (e) {
            console.error(`Failed to load from ${key}:`, e);
            return defaultValue;
        }
    }

    function saveToStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // --- State Management ---
    let blockKeywords = loadFromStorage(BLOCK_STORAGE_KEY, [...DEFAULT_BLOCK_KEYWORDS]);
    let showKeywords = loadFromStorage(SHOW_STORAGE_KEY, [...DEFAULT_SHOW_KEYWORDS]);
    let currentMode = loadFromStorage(MODE_STORAGE_KEY, 'block');
    let disabledSites = loadFromStorage(DISABLED_SITES_KEY, []);

    // --- Site Configuration ---
    function getCurrentSite() {
        const hostname = window.location.hostname;
        if (hostname.includes('zhihu.com')) return 'zhihu';
        if (hostname.includes('xiaohongshu.com')) return 'xiaohongshu';
        if (hostname.includes('bilibili.com')) return 'bilibili';
        if (hostname.includes('weibo.com')) return 'weibo';
        return 'unknown';
    }

    const siteConfigs = {
        zhihu: {
            containerSelector: '.ContentItem',
            cardSelector: '.Card',
            titleSelector: '.ContentItem-title a',
        },
        xiaohongshu: {
            containerSelector: 'section.note-item',
            cardSelector: 'section.note-item',
            titleSelector: 'a.title, .title',
        },
        bilibili: {
            containerSelector: '.bili-feed-card, .bili-video-card',
            cardSelector: '.bili-feed-card, .bili-video-card',
            titleSelector: '.bili-video-card__info--tit, .bili-video-card__info--tit a, .bili-video-card__wrap .bili-video-card__info--tit',
        },
        weibo: {
            containerSelector: '.wbpro-scroller-item',
            cardSelector: '.wbpro-scroller-item',
            titleSelector: '.wbpro-feed-content .detail_wbtext_4CRf9',
        }
    };

    // --- UI ---
    function createManagementUI() {
        const style = document.createElement('style');
        style.textContent = `
            #content-control-toggle {
                position: fixed; left: 20px; top: 50%; transform: translateY(-50%); z-index: 10000;
                background: #1890ff; color: white; border: none; border-radius: 6px; padding: 12px 8px;
                cursor: pointer; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                writing-mode: vertical-lr; text-orientation: mixed; transition: all 0.3s ease;
            }
            #content-control-toggle:hover {
                background: #40a9ff;
                transform: translateY(-50%) scale(1.05);
            }
            #content-control-panel {
                position: fixed; left: -350px; top: 50%; transform: translateY(-50%); z-index: 9999;
                width: 320px; max-height: 70vh; background: white; border: 1px solid #d9d9d9;
                border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); transition: left 0.3s ease;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            #content-control-panel.show {
                left: 20px;
            }
            .cc-header {
                padding: 16px; border-bottom: 1px solid #f0f0f0; background: #fafafa;
                border-radius: 8px 8px 0 0;
            }
            .cc-header h3 {
                margin: 0; font-size: 16px; font-weight: 500; color: #262626;
            }
            .cc-mode-switch {
                margin-top: 10px;
            }
            .cc-mode-switch label {
                margin-right: 15px; font-size: 14px; color: #595959;
            }
            .cc-input-group {
                padding: 16px; display: flex; gap: 8px;
            }
            #cc-keyword-input {
                flex: 1; padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 4px;
                font-size: 14px; outline: none;
            }
            #cc-keyword-input:focus {
                border-color: #1890ff; box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
            }
            #cc-add-keyword {
                padding: 8px 16px; background: #1890ff; color: white; border: none;
                border-radius: 4px; cursor: pointer; font-size: 14px; transition: background 0.3s ease;
            }
            #cc-add-keyword:hover {
                background: #40a9ff;
            }
            #cc-keyword-list {
                list-style: none; margin: 0; padding: 0; max-height: calc(70vh - 200px);
                overflow-y: auto;
            }
            #cc-keyword-list li {
                display: flex; justify-content: space-between; align-items: center;
                padding: 12px 16px; border-bottom: 1px solid #f0f0f0;
            }
            #cc-keyword-list li:hover {
                background: #f5f5f5;
            }
            .cc-delete-keyword {
                padding: 4px 8px; background: #ff4d4f; color: white; border: none;
                border-radius: 3px; cursor: pointer; font-size: 12px;
            }
            .cc-delete-keyword:hover {
                background: #ff7875;
            }
            .cc-footer {
                padding: 12px 16px; background: #f9f9f9; border-top: 1px solid #f0f0f0;
                font-size: 12px; color: #666; border-radius: 0 0 8px 8px;
            }
        `;
        document.head.appendChild(style);

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'content-control-toggle';
        toggleBtn.textContent = '内容控制';
        document.body.appendChild(toggleBtn);

        const panel = document.createElement('div');
        panel.id = 'content-control-panel';
        panel.innerHTML = `
            <div class="cc-header">
                <h3>内容控制</h3>
                <div class="cc-mode-switch">
                    <label><input type="radio" name="mode" value="filter"> 筛选</label>
                    <label><input type="radio" name="mode" value="block"> 屏蔽</label>
                </div>
            </div>
            <div class="cc-input-group">
                <input type="text" id="cc-keyword-input" placeholder="输入关键词...">
                <button id="cc-add-keyword">添加</button>
            </div>
            <ul id="cc-keyword-list"></ul>
            <div class="cc-footer">
                <label><input type="checkbox" id="cc-site-disable"> 在当前网站禁用</label>
            </div>
        `;
        document.body.appendChild(panel);

        updatePanelUI();
        addPanelEventListeners();

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('show');
            toggleBtn.style.display = panel.classList.contains('show') ? 'none' : 'block';
        });
        
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !toggleBtn.contains(e.target)) {
                panel.classList.remove('show');
                toggleBtn.style.display = 'block';
            }
        });
    }

    function updatePanelUI() {
        const isBlockMode = currentMode === 'block';
        const keywords = isBlockMode ? blockKeywords : showKeywords;
        const listElement = document.querySelector('#cc-keyword-list');
        if (listElement) {
            listElement.innerHTML = keywords.map((kw, i) =>
                `<li data-index="${i}">${kw} <button class="cc-delete-keyword">删除</button></li>`).join('');
        }
        const blockRadio = document.querySelector('input[name="mode"][value="block"]');
        const filterRadio = document.querySelector('input[name="mode"][value="filter"]');
        if (blockRadio) blockRadio.checked = isBlockMode;
        if (filterRadio) filterRadio.checked = !isBlockMode;
        
        const inputElement = document.querySelector('#cc-keyword-input');
        if (inputElement) {
            inputElement.placeholder = isBlockMode ? '输入屏蔽词...' : '输入筛选词...';
        }
        
        const disableCheckbox = document.querySelector('#cc-site-disable');
        if (disableCheckbox) {
            disableCheckbox.checked = disabledSites.includes(getCurrentSite());
        }
    }

    function addPanelEventListeners() {
        const modeRadios = document.querySelectorAll('input[name="mode"]');
        modeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                currentMode = e.target.value;
                saveToStorage(MODE_STORAGE_KEY, currentMode);
                updatePanelUI();
                processAllItems();
            });
        });

        const addKeywordBtn = document.getElementById('cc-add-keyword');
        if (addKeywordBtn) {
            addKeywordBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const input = document.getElementById('cc-keyword-input');
                if (input && input.value.trim()) {
                    const newKeywords = input.value.split(/[,，/]/).map(k => k.trim()).filter(Boolean);
                    if (newKeywords.length > 0) {
                        const keywords = currentMode === 'block' ? blockKeywords : showKeywords;
                        const storageKey = currentMode === 'block' ? BLOCK_STORAGE_KEY : SHOW_STORAGE_KEY;
                        keywords.unshift(...newKeywords);
                        saveToStorage(storageKey, keywords);
                        input.value = '';
                        updatePanelUI();
                        processAllItems();
                    }
                }
            });
        }

        const keywordList = document.getElementById('cc-keyword-list');
        if (keywordList) {
            keywordList.addEventListener('click', (e) => {
                e.stopPropagation();
                if (e.target.classList.contains('cc-delete-keyword')) {
                    const index = parseInt(e.target.parentElement.dataset.index, 10);
                    const keywords = currentMode === 'block' ? blockKeywords : showKeywords;
                    const storageKey = currentMode === 'block' ? BLOCK_STORAGE_KEY : SHOW_STORAGE_KEY;
                    keywords.splice(index, 1);
                    saveToStorage(storageKey, keywords);
                    updatePanelUI();
                    processAllItems();
                }
            });
        }

        const siteDisableCheckbox = document.getElementById('cc-site-disable');
        if (siteDisableCheckbox) {
            siteDisableCheckbox.addEventListener('change', (e) => {
                const site = getCurrentSite();
                if (e.target.checked) {
                    if (!disabledSites.includes(site)) disabledSites.push(site);
                } else {
                    disabledSites = disabledSites.filter(s => s !== site);
                }
                saveToStorage(DISABLED_SITES_KEY, disabledSites);
                processAllItems();
            });
        }
        
        // 添加回车键支持
        const keywordInput = document.getElementById('cc-keyword-input');
        if (keywordInput) {
            keywordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.stopPropagation();
                    document.getElementById('cc-add-keyword').click();
                }
            });
        }
    }

    // --- Content Processing ---
    function processItem(item, config) {
        const titleElement = item.querySelector(config.titleSelector);
        const content = titleElement ? titleElement.innerText : item.innerText;
        const card = item.closest(config.cardSelector);
        if (!card) return;

        if (currentMode === 'block') {
            const shouldBlock = blockKeywords.some(keyword => content.toLowerCase().includes(keyword.toLowerCase()));
            card.style.display = shouldBlock ? 'none' : '';
        } else {
            const shouldShow = showKeywords.some(keyword => content.toLowerCase().includes(keyword.toLowerCase()));
            card.style.display = shouldShow ? '' : 'none';
        }
    }

    function processAllItems() {
        const site = getCurrentSite();
        if (site === 'unknown' || disabledSites.includes(site)) return;
        const config = siteConfigs[site];
        document.querySelectorAll(config.containerSelector).forEach(item => processItem(item, config));
    }

    // --- Initialization ---
    function init() {
        const site = getCurrentSite();
        if (site === 'unknown') return;

        // 确保DOM加载完成后再初始化UI
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                createManagementUI();
                processAllItems();
            });
        } else {
            createManagementUI();
            processAllItems();
        }

        const observer = new MutationObserver(mutations => {
            if (disabledSites.includes(site)) return;
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        const config = siteConfigs[site];
                        if (node.matches && node.matches(config.containerSelector)) {
                            processItem(node, config);
                        }
                        if (node.querySelectorAll) {
                            node.querySelectorAll(config.containerSelector).forEach(item => processItem(item, config));
                        }
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();

})();