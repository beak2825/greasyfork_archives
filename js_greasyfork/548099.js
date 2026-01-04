// ==UserScript==
// @name         iFlow.work 印花过滤器 (优化版)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  过滤掉 iFlow.work 网站中含有指定关键词的数据行，支持多关键词和状态保持
// @author       zjl
// @match        https://www.iflow.work/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548099/iFlowwork%20%E5%8D%B0%E8%8A%B1%E8%BF%87%E6%BB%A4%E5%99%A8%20%28%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548099/iFlowwork%20%E5%8D%B0%E8%8A%B1%E8%BF%87%E6%BB%A4%E5%99%A8%20%28%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认过滤词
    const DEFAULT_FILTER_WORDS = ['印花', '胶囊', '箱'];

    // 初始化存储
    function initializeStorage() {
        if (typeof GM_getValue === 'undefined') {
            // 使用 localStorage 作为后备方案
            if (!localStorage.getItem('iflowFilterWords')) {
                localStorage.setItem('iflowFilterWords', JSON.stringify(DEFAULT_FILTER_WORDS));
            }
            if (!localStorage.getItem('iflowFilterEnabled')) {
                localStorage.setItem('iflowFilterEnabled', 'false');
            }
        } else {
            // 使用 Tampermonkey 的存储 API
            if (GM_getValue('iflowFilterWords') === undefined) {
                GM_setValue('iflowFilterWords', DEFAULT_FILTER_WORDS);
            }
            if (GM_getValue('iflowFilterEnabled') === undefined) {
                GM_setValue('iflowFilterEnabled', false);
            }
        }
    }

    // 获取过滤词
    function getFilterWords() {
        if (typeof GM_getValue === 'undefined') {
            return JSON.parse(localStorage.getItem('iflowFilterWords') || '[]');
        } else {
            return GM_getValue('iflowFilterWords', []);
        }
    }

    // 保存过滤词
    function saveFilterWords(words) {
        if (typeof GM_setValue === 'undefined') {
            localStorage.setItem('iflowFilterWords', JSON.stringify(words));
        } else {
            GM_setValue('iflowFilterWords', words);
        }
    }

    // 获取过滤状态
    function isFilterEnabled() {
        if (typeof GM_getValue === 'undefined') {
            return localStorage.getItem('iflowFilterEnabled') === 'true';
        } else {
            return GM_getValue('iflowFilterEnabled', false);
        }
    }

    // 设置过滤状态
    function setFilterEnabled(enabled) {
        if (typeof GM_setValue === 'undefined') {
            localStorage.setItem('iflowFilterEnabled', enabled.toString());
        } else {
            GM_setValue('iflowFilterEnabled', enabled);
        }
    }

    // 过滤函数
    function filterRows() {
        const filterWords = getFilterWords();
        if (filterWords.length === 0) return;

        // 查找所有表格行
        const tableRows = document.querySelectorAll('table tbody tr');
        let filteredCount = 0;

        tableRows.forEach(row => {
            // 获取饰品名称列（通常是第二列）
            const nameCell = row.querySelector('td:nth-child(2)');
            if (nameCell) {
                const itemName = nameCell.innerText || nameCell.textContent;

                // 检查是否包含任何过滤关键词
                const shouldFilter = filterWords.some(word =>
                    itemName.includes(word)
                );

                if (shouldFilter) {
                    // 隐藏包含关键词的行
                    row.style.display = 'none';
                    row.setAttribute('data-filtered', 'true');
                    filteredCount++;
                }
            }
        });

        updateStatusIndicator(filteredCount);
        console.log(`过滤完成，隐藏了 ${filteredCount} 行`);
    }

    // 显示所有行的函数
    function showAllRows() {
        const filteredRows = document.querySelectorAll('tr[data-filtered="true"]');
        filteredRows.forEach(row => {
            row.style.display = '';
            row.removeAttribute('data-filtered');
        });

        updateStatusIndicator(0);
        console.log('已显示所有行');
    }

    // 更新状态指示器
    function updateStatusIndicator(filteredCount) {
        let statusElem = document.getElementById('filter-status');
        if (!statusElem) {
            statusElem = document.createElement('div');
            statusElem.id = 'filter-status';
            statusElem.style.cssText = `
                margin-top: 8px;
                padding: 6px;
                border-radius: 4px;
                background: #f8f9fa;
                font-size: 12px;
                text-align: center;
            `;
            const controlPanel = document.getElementById('sticker-filter-controls');
            if (controlPanel) {
                controlPanel.appendChild(statusElem);
            }
        }

        if (filteredCount > 0) {
            statusElem.innerHTML = `<strong>已过滤 ${filteredCount} 行</strong>`;
            statusElem.style.background = '#7ec050';
            statusElem.style.borderLeft = '3px solid #2ecc71';
        } else {
            statusElem.innerHTML = '<strong>未应用过滤</strong>';
            statusElem.style.background = '#f8f9fa';
            statusElem.style.borderLeft = '3px solid #3498db';
        }
    }

    // 创建控制按钮
    function createControlButtons() {
        // 检查是否已经存在控制面板
        if (document.getElementById('sticker-filter-controls')) {
            return;
        }

        const controlPanel = document.createElement('div');
        controlPanel.id = 'sticker-filter-controls';
        controlPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            background: #fff;
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
            min-width: 180px;
        `;

        const title = document.createElement('div');
        title.textContent = '关键词过滤器';
        title.style.cssText = `
            font-weight: bold;
            margin-bottom: 8px;
            color: #333;
            text-align: center;
        `;

        // 关键词显示区域
        const keywordsContainer = document.createElement('div');
        keywordsContainer.id = 'keywords-container';
        keywordsContainer.style.cssText = `
            margin-bottom: 10px;
            max-height: 120px;
            overflow-y: auto;
        `;

        // 添加关键词输入框
        const inputGroup = document.createElement('div');
        inputGroup.style.cssText = `
            display: flex;
            margin-bottom: 8px;
        `;

        const keywordInput = document.createElement('input');
        keywordInput.type = 'text';
        keywordInput.placeholder = '输入关键词...';
        keywordInput.style.cssText = `
            flex-grow: 1;
            padding: 4px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
        `;

        const addButton = document.createElement('button');
        addButton.textContent = '+';
        addButton.style.cssText = `
            background: #007bff;
            color: white;
            border: none;
            padding: 4px 8px;
            margin-left: 4px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;
        addButton.onclick = () => {
            const keyword = keywordInput.value.trim();
            if (keyword) {
                addFilterKeyword(keyword);
                keywordInput.value = '';
            }
        };

        inputGroup.appendChild(keywordInput);
        inputGroup.appendChild(addButton);

        // 按钮组
        const buttonGroup = document.createElement('div');
        buttonGroup.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        `;

        const filterBtn = document.createElement('button');
        filterBtn.textContent = '应用过滤';
        filterBtn.style.cssText = `
            background: #28a745;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            flex: 1;
            margin-right: 4px;
        `;
        filterBtn.onclick = () => {
            setFilterEnabled(true);
            filterRows();
        };

        const showBtn = document.createElement('button');
        showBtn.textContent = '显示全部';
        showBtn.style.cssText = `
            background: #6c757d;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            flex: 1;
            margin-left: 4px;
        `;
        showBtn.onclick = () => {
            setFilterEnabled(false);
            showAllRows();
        };

        buttonGroup.appendChild(filterBtn);
        buttonGroup.appendChild(showBtn);

        // 保存按钮
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存设置';
        saveBtn.style.cssText = `
            background: #007bff;
            color: white;
            border: none;
            padding: 6px 12px;
            width: 100%;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            margin-bottom: 8px;
        `;
        saveBtn.onclick = () => {
            if (typeof GM_notification !== 'undefined') {
                GM_notification({
                    text: '过滤设置已保存',
                    title: 'iFlow.work 过滤器',
                    timeout: 2000
                });
            } else {
                alert('过滤设置已保存');
            }
        };

        controlPanel.appendChild(title);
        controlPanel.appendChild(keywordsContainer);
        controlPanel.appendChild(inputGroup);
        controlPanel.appendChild(buttonGroup);
        controlPanel.appendChild(saveBtn);

        document.body.appendChild(controlPanel);

        // 加载并显示关键词
        refreshKeywordsDisplay();

        // 初始状态指示
        updateStatusIndicator(0);
    }

    // 添加过滤关键词
    function addFilterKeyword(keyword) {
        const filterWords = getFilterWords();
        if (!filterWords.includes(keyword)) {
            filterWords.push(keyword);
            saveFilterWords(filterWords);
            refreshKeywordsDisplay();
        }
    }

    // 删除过滤关键词
    function removeFilterKeyword(keyword) {
        const filterWords = getFilterWords();
        const index = filterWords.indexOf(keyword);
        if (index > -1) {
            filterWords.splice(index, 1);
            saveFilterWords(filterWords);
            refreshKeywordsDisplay();
        }
    }

    // 刷新关键词显示
    function refreshKeywordsDisplay() {
        const keywordsContainer = document.getElementById('keywords-container');
        if (!keywordsContainer) return;

        keywordsContainer.innerHTML = '';
        const filterWords = getFilterWords();

        filterWords.forEach(keyword => {
            const keywordElem = document.createElement('div');
            keywordElem.style.cssText = `
                display: inline-block;
                background: #e74c3c;
                color: white;
                padding: 2px 8px;
                border-radius: 12px;
                margin: 2px;
                font-size: 11px;
                cursor: default;
            `;

            const keywordText = document.createElement('span');
            keywordText.textContent = keyword;

            const deleteBtn = document.createElement('span');
            deleteBtn.textContent = ' ×';
            deleteBtn.style.cssText = `
                cursor: pointer;
                font-weight: bold;
            `;
            deleteBtn.onclick = () => removeFilterKeyword(keyword);

            keywordElem.appendChild(keywordText);
            keywordElem.appendChild(deleteBtn);
            keywordsContainer.appendChild(keywordElem);
        });

        if (filterWords.length === 0) {
            const noKeywords = document.createElement('div');
            noKeywords.textContent = '无关键词';
            noKeywords.style.cssText = `
                color: #6c757d;
                font-style: italic;
                text-align: center;
                font-size: 11px;
            `;
            keywordsContainer.appendChild(noKeywords);
        }
    }

    // 监听页面变化（适用于动态加载的内容）
    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // 检查是否有新的表格行添加
                    const addedNodes = Array.from(mutation.addedNodes);
                    const hasNewTableRows = addedNodes.some(node =>
                        node.nodeType === 1 &&
                        (node.tagName === 'TR' || node.querySelector('tr'))
                    );

                    if (hasNewTableRows) {
                        // 延迟执行过滤，确保内容完全加载
                        setTimeout(() => {
                            // 检查是否当前处于过滤状态
                            if (isFilterEnabled()) {
                                filterRows();
                            }
                        }, 100);
                    }
                }
            });
        });

        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 注册Tampermonkey菜单命令（如果可用）
    function registerMenuCommands() {
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('添加过滤关键词', () => {
                const keyword = prompt('请输入要添加的过滤关键词:');
                if (keyword) {
                    addFilterKeyword(keyword.trim());
                }
            });

            GM_registerMenuCommand('管理过滤关键词', () => {
                const filterWords = getFilterWords();
                alert(`当前过滤关键词:\n${filterWords.join('\n') || '无'}`);
            });

            GM_registerMenuCommand('应用过滤', () => {
                setFilterEnabled(true);
                filterRows();
            });

            GM_registerMenuCommand('显示全部', () => {
                setFilterEnabled(false);
                showAllRows();
            });
        }
    }

    // 页面加载完成后执行
    function init() {
        // 等待页面完全加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 初始化存储
        initializeStorage();

        // 创建控制按钮
        createControlButtons();

        // 注册菜单命令
        registerMenuCommands();

        // 开始监听页面变化
        observePageChanges();

        // 初始过滤（如果之前启用了过滤）
        if (isFilterEnabled()) {
            setTimeout(filterRows, 500);
        }

        console.log('iFlow.work 印花过滤器已加载');
    }

    // 启动脚本
    init();
})();