// ==UserScript==
// @name         bilibili 历史记录批量清理工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在哔哩哔哩-历史记录页面批量搜索并清除指定N个关键词的记录，支持关键词管理、关键词批量粘贴、循环删除等功能。
// @author       byflyyy
// @license      MIT
// @match        https://www.bilibili.com/history
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560570/bilibili%20%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E6%89%B9%E9%87%8F%E6%B8%85%E7%90%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/560570/bilibili%20%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E6%89%B9%E9%87%8F%E6%B8%85%E7%90%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'bilibili_history_cleaner_keywords';
    
    let KEYWORDS = [];
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            KEYWORDS = JSON.parse(saved);
        } else {
            KEYWORDS = [];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(KEYWORDS));
        }
    } catch (e) {
        console.error('加载关键词失败:', e);
        KEYWORDS = [];
    }
    
    const saveKeywords = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(KEYWORDS));
        } catch (e) {
            console.error('保存关键词失败:', e);
        }
    };

    const DELAYS = {
        afterSearch: 500,
        afterBatchMode: 200,
        afterSelect: 100,
        afterDelete: 200,
        afterConfirm: 800,
        afterExit: 200,
        betweenKeywords: 300,
        recheckResults: 500
    };

    const SELECTORS = {
        searchInput: '#app > main > div.main-breadcrumbs > div > div.breadcrumbs__top > div.right > label > div.input-wrap > input',
        searchBtn: '#app > main > div.main-breadcrumbs > div > div.breadcrumbs__top > div.right > label > div.search-btn',
        batchManageBtn: '#app > main > div.main-breadcrumbs > div > div.breadcrumbs__top > div.right > button.vui_button.action-btn.batch-manage-btn',
        selectAllCheckbox: '#app > main > div.main-breadcrumbs > div > div.breadcrumbs__top > div.left > label',
        deleteBtn: '#app > main > div.main-breadcrumbs > div > div.breadcrumbs__top > div.left > button',
        confirmBtn: '.vui_dialog--footer > button.vui_button.vui_button--blue.vui_dialog--btn.vui_dialog--btn-confirm',
        exitBatchBtn: '#app > main > div.main-breadcrumbs > div > div.breadcrumbs__top > div.right > button'
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const waitForElement = (selector, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            const startTime = Date.now();
            const checkElement = () => {
                const el = document.querySelector(selector);
                if (el) {
                    resolve(el);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`元素未找到: ${selector}`));
                } else {
                    setTimeout(checkElement, 50);
                }
            };
            checkElement();
        });
    };
    
    const waitForElementGone = (selector, timeout = 3000) => {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const checkGone = () => {
                const element = document.querySelector(selector);
                if (!element) {
                    resolve(true);
                } else if (Date.now() - startTime > timeout) {
                    resolve(false);
                } else {
                    setTimeout(checkGone, 50);
                }
            };
            checkGone();
        });
    };

    const clickElement = async (selector, description) => {
        try {
            const element = await waitForElement(selector);
            element.click();
            return true;
        } catch (error) {
            console.error(`✗ ${description} 失败`);
            return false;
        }
    };

    const inputText = async (selector, text, description) => {
        try {
            const element = await waitForElement(selector);
            element.value = text;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        } catch (error) {
            console.error(`✗ ${description} 失败`);
            return false;
        }
    };

    const checkIfInBatchMode = () => {
        const exitBtn = document.querySelector(SELECTORS.exitBatchBtn);
        return exitBtn && exitBtn.textContent.includes('退出');
    };

    const processKeyword = async (keyword, index, total) => {
        const inputSuccess = await inputText(SELECTORS.searchInput, keyword, '输入关键词');
        if (!inputSuccess) return false;
        await sleep(300);

        const searchSuccess = await clickElement(SELECTORS.searchBtn, '点击搜索');
        if (!searchSuccess) return false;
        await sleep(DELAYS.afterSearch);

        let batchCount = 0;
        let hasResults = true;
        
        while (hasResults) {
            batchCount++;
            const resultItems = document.querySelectorAll('.history-card');
            if (resultItems.length === 0) {
                hasResults = false;
                break;
            }

            const batchSuccess = await clickElement(SELECTORS.batchManageBtn, '进入批量管理模式');
            if (!batchSuccess) return false;
            await sleep(DELAYS.afterBatchMode);

            const selectSuccess = await clickElement(SELECTORS.selectAllCheckbox, '全选记录');
            if (!selectSuccess) return false;
            await sleep(DELAYS.afterSelect);

            const deleteSuccess = await clickElement(SELECTORS.deleteBtn, '点击删除');
            if (!deleteSuccess) return false;
            await sleep(DELAYS.afterDelete);

            const confirmSuccess = await clickElement(SELECTORS.confirmBtn, '确认删除');
            if (!confirmSuccess) return false;

            await waitForElementGone(SELECTORS.confirmBtn);
            await sleep(300);

            if (checkIfInBatchMode()) {
                await clickElement(SELECTORS.exitBatchBtn, '退出批量管理模式');
                await sleep(DELAYS.afterExit);
            }
            
            await sleep(DELAYS.recheckResults);
        }

        return true;
    };

    const startCleaning = async () => {
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < KEYWORDS.length; i++) {
            const success = await processKeyword(KEYWORDS[i], i, KEYWORDS.length);
            if (success) {
                successCount++;
            } else {
                failCount++;
            }

            if (i < KEYWORDS.length - 1) {
                await sleep(DELAYS.betweenKeywords);
            }
        }

        await showNativeDialog(
            '完成',
            `成功 ${successCount} 个，失败 ${failCount} 个`,
            [{ text: '确定', primary: true }]
        );
        
        location.reload();
    };

    const showNativeDialog = (title, message, buttons) => {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'keyword-manager-modal';
            modal.style.zIndex = '10001';
            
            const dialog = document.createElement('div');
            dialog.className = 'keyword-manager-dialog';
            dialog.style.width = '400px';
            
            dialog.innerHTML = `
                <div class="keyword-manager-header">
                    <div class="keyword-manager-title">${title}</div>
                </div>
                <div class="keyword-manager-body" style="padding: 16px 24px;">
                    <div style="line-height: 1.5; color: #18191c; font-size: 14px;">${message}</div>
                </div>
                <div class="keyword-manager-footer" style="justify-content: flex-end; gap: 8px;">
                    ${buttons.map((btn, i) => `<button class="keyword-action-btn ${btn.primary ? 'keyword-start-btn' : ''}" data-index="${i}" style="${btn.primary ? '' : 'background: #e5e9ef; color: #18191c;'}">${btn.text}</button>`).join('')}
                </div>
            `;
            
            modal.appendChild(dialog);
            document.body.appendChild(modal);
            
            const allButtons = dialog.querySelectorAll('.keyword-action-btn');
            allButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    document.body.removeChild(modal);
                    resolve(index);
                });
            });
            
            const primaryBtn = dialog.querySelector('.keyword-start-btn');
            if (primaryBtn) {
                primaryBtn.focus();
            }
            
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    const primaryIndex = Array.from(allButtons).findIndex(btn => btn.classList.contains('keyword-start-btn'));
                    document.body.removeChild(modal);
                    resolve(primaryIndex >= 0 ? primaryIndex : 0);
                }
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                    resolve(-1);
                }
            });
        });
    };

    const openKeywordManager = (triggerButton) => {
        const modal = document.createElement('div');
        modal.className = 'keyword-manager-modal';
        
        const dialog = document.createElement('div');
        dialog.className = 'keyword-manager-dialog';
        
        const renderDialog = () => {
            dialog.innerHTML = `
                <div class="keyword-manager-header">
                    <div class="keyword-manager-title">批量清除 - 关键词管理</div>
                    <div class="keyword-manager-close">✕</div>
                </div>
                <div class="keyword-manager-body">
                    <div class="keyword-input-area">
                        <input type="text" class="keyword-input" placeholder="输入关键词后按回车或点击添加">
                        <button class="keyword-add-btn">添加</button>
                    </div>
                    <div class="keyword-list">
                        ${KEYWORDS.length === 0 ? 
                            '<div class="keyword-empty">暂无关键词，请添加后开始清理</div>' :
                            KEYWORDS.map((kw, i) => `
                                <div class="keyword-item" data-index="${i}">
                                    <span class="keyword-text">${kw}</span>
                                    <button class="keyword-delete-btn">删除</button>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
                <div class="keyword-manager-footer">
                    <div class="keyword-count">共 ${KEYWORDS.length} 个关键词</div>
                    <button class="keyword-action-btn keyword-start-btn" ${KEYWORDS.length === 0 ? 'disabled' : ''}>
                        开始清理
                    </button>
                </div>
            `;
            
            const closeBtn = dialog.querySelector('.keyword-manager-close');
            const input = dialog.querySelector('.keyword-input');
            const addBtn = dialog.querySelector('.keyword-add-btn');
            const startBtn = dialog.querySelector('.keyword-start-btn');
            const deleteButtons = dialog.querySelectorAll('.keyword-delete-btn');
            
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            const addKeyword = async () => {
                const text = input.value.trim();
                if (!text) return;
                
                const keywords = text.split(/[\n\r]+/).map(kw => kw.trim()).filter(kw => kw);
                
                let addedCount = 0;
                let duplicateCount = 0;
                
                keywords.forEach(keyword => {
                    if (KEYWORDS.includes(keyword)) {
                        duplicateCount++;
                    } else {
                        KEYWORDS.push(keyword);
                        addedCount++;
                    }
                });
                
                if (addedCount > 0) {
                    saveKeywords();
                    input.value = '';
                    renderDialog();
                }
                
                if (duplicateCount > 0) {
                    await showNativeDialog('提示', `已添加 ${addedCount} 个，${duplicateCount} 个重复已忽略`, [{ text: '确定', primary: true }]);
                }
                
                setTimeout(() => {
                    const newInput = document.querySelector('.keyword-input');
                    if (newInput) newInput.focus();
                }, 0);
            };
            
            input.addEventListener('paste', async (e) => {
                const pastedText = e.clipboardData.getData('text');
                
                if (pastedText.includes('\n') || pastedText.includes('\r')) {
                    e.preventDefault();
                    
                    const keywords = pastedText.split(/[\n\r]+/).map(kw => kw.trim()).filter(kw => kw);
                    
                    let addedCount = 0;
                    let duplicateCount = 0;
                    
                    keywords.forEach(keyword => {
                        if (KEYWORDS.includes(keyword)) {
                            duplicateCount++;
                        } else {
                            KEYWORDS.push(keyword);
                            addedCount++;
                        }
                    });
                    
                    if (addedCount > 0) {
                        saveKeywords();
                        renderDialog();
                    }
                    
                    if (duplicateCount > 0) {
                        await showNativeDialog('提示', `已添加 ${addedCount} 个，${duplicateCount} 个重复已忽略`, [{ text: '确定', primary: true }]);
                    }
                    
                    setTimeout(() => {
                        const newInput = document.querySelector('.keyword-input');
                        if (newInput) newInput.focus();
                    }, 0);
                }
            });
            
            addBtn.addEventListener('click', addKeyword);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyword();
                }
            });
            
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const item = e.target.closest('.keyword-item');
                    const index = parseInt(item.dataset.index);
                    KEYWORDS.splice(index, 1);
                    saveKeywords();
                    renderDialog();
                });
            });
            
            startBtn.addEventListener('click', async () => {
                if (KEYWORDS.length === 0) return;
                
                const result = await showNativeDialog(
                    '确认操作',
                    `将删除 ${KEYWORDS.length} 个关键词的历史记录，此操作不可恢复`,
                    [
                        { text: '取消', primary: false },
                        { text: '确定', primary: true }
                    ]
                );
                
                if (result === 1) {
                    document.body.removeChild(modal);
                    triggerButton.classList.add('cleaning');
                    
                    await startCleaning();
                    
                    triggerButton.classList.remove('cleaning');
                }
            });
        };
        
        renderDialog();
        modal.appendChild(dialog);
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    };

    const createIntegratedButton = () => {
        const style = document.createElement('style');
        style.textContent = `
            .batch-cleaner-icon-btn {
                position: absolute;
                right: -42px;
                top: 50%;
                transform: translateY(-50%);
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
            .batch-cleaner-icon-btn:hover {
                color: #00a1d6;
            }
            .batch-cleaner-icon-btn.cleaning {
                opacity: 0.5;
                cursor: wait;
                animation: pulse 1.5s ease-in-out infinite;
            }
            .lists-view-mode {
                position: relative;
            }
            @keyframes pulse {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 0.8; }
            }
            .keyword-manager-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .keyword-manager-dialog {
                background: #fff;
                border-radius: 12px;
                width: 500px;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }
            .keyword-manager-header {
                padding: 20px 24px;
                border-bottom: 1px solid #e5e9ef;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .keyword-manager-title {
                font-size: 16px;
                font-weight: 500;
                color: #18191c;
            }
            .keyword-manager-close {
                cursor: pointer;
                font-size: 20px;
                color: #9499a0;
                transition: color 0.2s;
            }
            .keyword-manager-close:hover {
                color: #18191c;
            }
            .keyword-manager-body {
                padding: 20px 24px;
                overflow-y: auto;
                flex: 1;
            }
            .keyword-input-area {
                display: flex;
                gap: 8px;
                margin-bottom: 16px;
            }
            .keyword-input {
                flex: 1;
                height: 36px;
                padding: 0 12px;
                border: 1px solid #e5e9ef;
                border-radius: 6px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
            }
            .keyword-input:focus {
                border-color: #00a1d6;
            }
            .keyword-add-btn {
                height: 36px;
                padding: 0 16px;
                background: #00a1d6;
                color: #fff;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .keyword-add-btn:hover {
                background: #0086b3;
            }
            .keyword-list {
                max-height: 300px;
                overflow-y: auto;
            }
            .keyword-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 12px;
                background: #f6f7f8;
                border-radius: 6px;
                margin-bottom: 8px;
                transition: background 0.2s;
            }
            .keyword-item:hover {
                background: #e5e9ef;
            }
            .keyword-text {
                font-size: 14px;
                color: #18191c;
                flex: 1;
            }
            .keyword-delete-btn {
                padding: 4px 12px;
                background: transparent;
                color: #fb7299;
                border: 1px solid #fb7299;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .keyword-delete-btn:hover {
                background: #fb7299;
                color: #fff;
            }
            .keyword-manager-footer {
                padding: 16px 24px;
                border-top: 1px solid #e5e9ef;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .keyword-count {
                font-size: 14px;
                color: #61666d;
            }
            .keyword-action-btn {
                height: 36px;
                padding: 0 20px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .keyword-start-btn {
                background: #00a1d6;
                color: #fff;
            }
            .keyword-start-btn:hover {
                background: #0086b3;
            }
            .keyword-start-btn:disabled {
                background: #e5e9ef;
                color: #9499a0;
                cursor: not-allowed;
            }
            .keyword-empty {
                text-align: center;
                padding: 40px 0;
                color: #9499a0;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);

        const button = document.createElement('div');
        button.className = 'lists-view-mode__action batch-cleaner-icon-btn';
        button.setAttribute('data-v-c38e272c', '');
        button.setAttribute('data-v-d4b3d839', '');
        button.innerHTML = `
            <i data-v-c38e272c="" class="vui_icon sic-BDC-brush_clear_line" style="font-size: 27px;"></i>
        `;

        button.addEventListener('click', () => {
            if (button.classList.contains('cleaning')) return;
            openKeywordManager(button);
        });

        return button;
    };

    const insertButton = () => {
        const viewModeContainer = document.querySelector('.lists-view-mode');
        if (viewModeContainer) {
            if (!document.querySelector('.batch-cleaner-icon-btn')) {
                const cleanerBtn = createIntegratedButton();
                viewModeContainer.appendChild(cleanerBtn);
            }
        } else {
            setTimeout(insertButton, 2000);
        }
    };

    const init = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(insertButton, 1500);
            });
        } else {
            setTimeout(insertButton, 1500);
        }
    };

    init();

})();
