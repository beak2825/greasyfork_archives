// ==UserScript==
// @name         TFD先觉者卡片筛选器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  悬浮控制面板，支持卡片市场的智能筛选
// @author       筛选助手
// @license      MIT
// @match        *://tfd.nexon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nexon.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558292/TFD%E5%85%88%E8%A7%89%E8%80%85%E5%8D%A1%E7%89%87%E7%AD%9B%E9%80%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558292/TFD%E5%85%88%E8%A7%89%E8%80%85%E5%8D%A1%E7%89%87%E7%AD%9B%E9%80%89%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('卡片筛选器启动...');

    // 默认配置
    const DEFAULT_CONFIG = {
        maxPrice: 5000,
        minPrice: 0,

        sellerFilterEnabled: false,
        sellerNames: [],

        moduleFilterEnabled: false,
        selectedModuleNames: [],

        keywordFilterEnabled: false,
        selectedKeywords: [],
        requireAllKeywords: false,
        
        valueFilterEnabled: false,
        valueFilters: [],

        panelVisible: false
    };

    // 加载配置
    let CONFIG = DEFAULT_CONFIG;
    try {
        const saved = GM_getValue('tfd_filter_config');
        if (saved) {
            CONFIG = { ...DEFAULT_CONFIG, ...saved };
            if (saved.panelCollapsed !== undefined) {
                CONFIG.panelVisible = !saved.panelCollapsed;
            }
        }
    } catch (e) {
        CONFIG = DEFAULT_CONFIG;
    }

    // 保存配置
    function saveConfig() {
        GM_setValue('tfd_filter_config', CONFIG);
    }

    // 添加样式
    GM_addStyle(`
        .tfd-hidden-item {
            display: none !important;
        }

        /* 悬浮控制面板 */
        #tfd-floating-panel {
            position: fixed;
            top: 100px;
            right: 20px;
            width: 320px;
            background: rgba(30, 30, 40, 0.95);
            border-radius: 8px;
            border: 1px solid #444;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            z-index: 99999;
            font-family: Arial, sans-serif;
            overflow: hidden;
            user-select: none;
        }

        #tfd-floating-panel.hidden {
            display: none !important;
        }

        /* 面板标题栏 */
        .panel-header {
            background: #2a7fff;
            color: white;
            padding: 10px;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            touch-action: none;
        }

        .panel-title {
            font-size: 14px;
            font-weight: bold;
        }

        .panel-controls {
            display: flex;
            gap: 8px;
        }

        .panel-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 16px;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
        }

        .panel-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        /* 面板内容 */
        .panel-content {
            padding: 15px;
            max-height: 70vh;
            overflow-y: auto;
            overflow-x: hidden;
        }

        /* 筛选组样式 */
        .filter-group {
            margin-bottom: 15px;
        }

        .filter-label {
            display: block;
            margin-bottom: 8px;
            font-size: 12px;
            color: #aad;
            font-weight: bold;
        }

        .filter-checkbox {
            margin-right: 5px;
        }

        .filter-input {
            width: 100%;
            background: #222;
            color: white;
            border: 1px solid #555;
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
            margin-bottom: 8px;
            box-sizing: border-box;
        }

        .filter-input-small {
            width: 80px;
            display: inline-block;
            margin: 0 5px;
        }

        .filter-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 5px;
        }

        .filter-tag {
            background: #333;
            color: #ccc;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            max-width: 100%;
            word-break: break-all;
        }

        .filter-tag.selected {
            background: #2a7fff;
            color: white;
        }

        /* 按钮组 */
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }

        .action-btn {
            flex: 1;
            padding: 8px;
            background: #2a7fff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
        }

        .action-btn:hover {
            background: #1a6fe0;
        }

        .action-btn.secondary {
            background: #666;
        }

        .action-btn.secondary:hover {
            background: #777;
        }

        /* 统计信息 */
        .stats-info {
            margin-top: 10px;
            padding: 8px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 4px;
            font-size: 11px;
            text-align: center;
            color: #8af;
        }

        .stats-info strong {
            color: #0f0;
        }

        /* 价格输入组 */
        .price-inputs {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .price-inputs .filter-input {
            flex: 1;
        }

        .price-inputs span {
            color: #888;
        }

        /* 悬浮球样式 */
        #tfd-floating-ball {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #2a7fff;
            border-radius: 50%;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 99998;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            font-size: 14px;
            font-weight: bold;
            user-select: none;
            text-align: center;
            padding: 0;
            line-height: 1;
            transition: transform 0.2s ease, background 0.2s ease;
        }

        #tfd-floating-ball:hover {
            background: #1a6fe0;
            transform: scale(1.1);
        }

        /* 标签输入容器 */
        .tag-input-container {
            display: flex;
            gap: 5px;
        }

        .tag-input-container input {
            flex: 1;
        }

        .tag-input-container button {
            background: #444;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            cursor: pointer;
            white-space: nowrap;
        }

        .tag-input-container button:hover {
            background: #555;
        }

        /* 拖拽手柄样式 */
        .drag-handle {
            cursor: move;
            touch-action: none;
        }

        /* 滚动条样式 */
        .panel-content::-webkit-scrollbar {
            width: 6px;
        }

        .panel-content::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
        }

        .panel-content::-webkit-scrollbar-thumb {
            background: #2a7fff;
            border-radius: 3px;
        }

        /* 关键词匹配模式选项 */
        .keyword-mode {
            display: flex;
            gap: 10px;
            margin-top: 5px;
            font-size: 11px;
            color: #ccc;
        }

        .keyword-mode label {
            cursor: pointer;
            display: flex;
            align-items: center;
        }

        .keyword-mode input {
            margin-right: 4px;
        }

        /* 数值筛选输入组 */
        .value-inputs {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-top: 5px;
        }

        .value-inputs .filter-input {
            margin-bottom: 0;
        }

        .value-inputs span {
            color: #888;
            font-size: 11px;
        }
    `);

    // 状态管理
    let floatingPanel = null;
    let floatingBall = null;
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let panelStartX = 0, panelStartY = 0;

    // 获取决意类型
    function getModuleName(itemElement) {
        const nameElement = itemElement.querySelector('.module-name');
        return nameElement ? nameElement.textContent.trim() : '';
    }

    // 获取卖家名称
    function getSellerName(itemElement) {
        const sellerElement = itemElement.querySelector('.nickname');
        return sellerElement ? sellerElement.textContent.trim() : '';
    }

    // 获取价格
    function getPrice(itemElement) {
        const priceElement = itemElement.querySelector('.price');
        if (!priceElement) return 0;
        const priceText = priceElement.textContent.trim().replace(/,/g, '').replace('卡利弗', '');
        return parseInt(priceText, 10) || 0;
    }

    // 获取词条数值
    function getOptionValue(optionElement) {
        const valueElement = optionElement.querySelector('.option-value');
        if (!valueElement) return null;
        
        const valueText = valueElement.textContent.trim();
        
        if (valueText.includes('%')) {
            return parseFloat(valueText.replace('%', '')) || 0;
        } else if (valueText.includes('x')) {
            return parseFloat(valueText.replace('x', '')) || 0;
        } else {
            return parseFloat(valueText) || 0;
        }
    }

    // 获取词条名称
    function getOptionName(optionElement) {
        const nameElement = optionElement.querySelector('.option-name');
        if (!nameElement) return '';
        
        const nameText = nameElement.textContent.trim();
        const cleanName = nameText
            .replace(/^\(\+\)/, '')
            .replace(/\(-\)-/, '')
            .replace(/\[.*?\]/g, '')
            .trim();
        
        return cleanName;
    }

    // 检查是否有关键词匹配
    function hasKeywordMatch(itemElement, keywords, requireAll) {
        if (!keywords || keywords.length === 0) return true;

        const optionElements = itemElement.querySelectorAll('.option');
        const foundKeywords = new Set();
        
        for (let option of optionElements) {
            const optionName = getOptionName(option);
            if (!optionName) continue;

            for (let keyword of keywords) {
                if (optionName.includes(keyword)) {
                    if (!requireAll) return true;
                    foundKeywords.add(keyword);
                }
            }
        }
        
        if (requireAll) return foundKeywords.size === keywords.length;
        return false;
    }

    // 检查词条数值是否符合条件
    function checkValueFilters(itemElement, valueFilters) {
        if (!valueFilters || valueFilters.length === 0) return true;
        
        const optionElements = itemElement.querySelectorAll('.option');
        
        for (let filter of valueFilters) {
            let found = false;
            
            for (let option of optionElements) {
                const optionName = getOptionName(option);
                if (!optionName.includes(filter.keyword)) continue;
                
                const optionValue = getOptionValue(option);
                if (optionValue === null) continue;
                
                if (filter.min !== undefined && optionValue < filter.min) return false;
                if (filter.max !== undefined && optionValue > filter.max) return false;
                
                found = true;
                break;
            }
            
            if (!found) return false;
        }
        
        return true;
    }

    // 检查卡片是否符合筛选条件
    function checkItemConditions(itemElement) {
        const price = getPrice(itemElement);
        const sellerName = getSellerName(itemElement);
        const moduleName = getModuleName(itemElement);

        if (price < CONFIG.minPrice || price > CONFIG.maxPrice) return false;

        if (CONFIG.sellerFilterEnabled && CONFIG.sellerNames.length > 0) {
            let sellerMatch = false;
            for (let seller of CONFIG.sellerNames) {
                if (sellerName.includes(seller)) {
                    sellerMatch = true;
                    break;
                }
            }
            if (!sellerMatch) return false;
        }

        if (CONFIG.moduleFilterEnabled && CONFIG.selectedModuleNames.length > 0) {
            if (!CONFIG.selectedModuleNames.includes(moduleName)) return false;
        }

        if (CONFIG.keywordFilterEnabled && CONFIG.selectedKeywords.length > 0) {
            if (!hasKeywordMatch(itemElement, CONFIG.selectedKeywords, CONFIG.requireAllKeywords)) return false;
        }

        if (CONFIG.valueFilterEnabled && CONFIG.valueFilters.length > 0) {
            if (!checkValueFilters(itemElement, CONFIG.valueFilters)) return false;
        }

        return true;
    }

    // 应用筛选
    function applyFilters() {
        const items = document.querySelectorAll('.item');
        let visibleCount = 0;
        
        if (items.length === 0) return 0;

        items.forEach(item => {
            const passes = checkItemConditions(item);

            if (passes) {
                item.classList.remove('tfd-hidden-item');
                visibleCount++;
            } else {
                item.classList.add('tfd-hidden-item');
            }
        });

        updateStats(visibleCount, items.length);
        return visibleCount;
    }

    // 更新统计信息
    function updateStats(visible, total) {
        const statsElement = document.getElementById('tfd-stats');
        if (statsElement) {
            statsElement.innerHTML = `显示: <strong>${visible}/${total}</strong> 个卡片`;
        }
    }

    // 创建悬浮控制面板
    function createFloatingPanel() {
        if (floatingPanel) floatingPanel.remove();

        floatingPanel = document.createElement('div');
        floatingPanel.id = 'tfd-floating-panel';

        if (!CONFIG.panelVisible) floatingPanel.classList.add('hidden');

        floatingPanel.innerHTML = `
            <div class="panel-header drag-handle">
                <div class="panel-title">卡片筛选器</div>
                <div class="panel-controls">
                    <button class="panel-btn" id="tfd-close-btn" title="关闭">×</button>
                </div>
            </div>
            <div class="panel-content">
                <div class="filter-group">
                    <label class="filter-label">价格范围</label>
                    <div class="price-inputs">
                        <input type="number" class="filter-input" id="tfd-min-price"
                               placeholder="最低价" value="${CONFIG.minPrice}" min="0">
                        <span>至</span>
                        <input type="number" class="filter-input" id="tfd-max-price"
                               placeholder="最高价" value="${CONFIG.maxPrice}" min="0">
                    </div>
                </div>

                <div class="filter-group">
                    <label class="filter-label">
                        <input type="checkbox" class="filter-checkbox" id="tfd-seller-filter"
                               ${CONFIG.sellerFilterEnabled ? 'checked' : ''}>
                        卖家筛选
                    </label>
                    <div class="tag-input-container">
                        <input type="text" class="filter-input" id="tfd-new-seller"
                               placeholder="输入卖家名称">
                        <button id="tfd-add-seller">添加</button>
                    </div>
                    <div class="filter-tags" id="tfd-seller-tags">
                        ${CONFIG.sellerNames.map(seller => `
                            <span class="filter-tag selected" data-seller="${seller}">${seller}</span>
                        `).join('')}
                    </div>
                </div>

                <div class="filter-group">
                    <label class="filter-label">
                        <input type="checkbox" class="filter-checkbox" id="tfd-module-filter"
                               ${CONFIG.moduleFilterEnabled ? 'checked' : ''}>
                        决意类型筛选
                    </label>
                    <div class="tag-input-container">
                        <input type="text" class="filter-input" id="tfd-new-module"
                               placeholder="输入决意类型">
                        <button id="tfd-add-module">添加</button>
                    </div>
                    <div class="filter-tags" id="tfd-module-tags">
                        ${CONFIG.selectedModuleNames.map(module => `
                            <span class="filter-tag selected" data-module="${module}">${module}</span>
                        `).join('')}
                    </div>
                </div>

                <div class="filter-group">
                    <label class="filter-label">
                        <input type="checkbox" class="filter-checkbox" id="tfd-keyword-filter"
                               ${CONFIG.keywordFilterEnabled ? 'checked' : ''}>
                        词条关键词筛选
                    </label>
                    <div class="tag-input-container">
                        <input type="text" class="filter-input" id="tfd-new-keyword"
                               placeholder="输入关键词">
                        <button id="tfd-add-keyword">添加</button>
                    </div>
                    <div class="keyword-mode">
                        <label>
                            <input type="radio" name="keyword-mode" value="any" 
                                   ${!CONFIG.requireAllKeywords ? 'checked' : ''}>
                            任意匹配
                        </label>
                        <label>
                            <input type="radio" name="keyword-mode" value="all"
                                   ${CONFIG.requireAllKeywords ? 'checked' : ''}>
                            同时满足
                        </label>
                    </div>
                    <div class="filter-tags" id="tfd-keyword-tags">
                        ${CONFIG.selectedKeywords.map(keyword => `
                            <span class="filter-tag selected" data-keyword="${keyword}">${keyword}</span>
                        `).join('')}
                    </div>
                </div>

                <div class="filter-group">
                    <label class="filter-label">
                        <input type="checkbox" class="filter-checkbox" id="tfd-value-filter"
                               ${CONFIG.valueFilterEnabled ? 'checked' : ''}>
                        词条数值筛选
                    </label>
                    <div class="tag-input-container">
                        <input type="text" class="filter-input" id="tfd-value-keyword" 
                               placeholder="词条名称（如：暴击率）">
                        <button id="tfd-add-value-filter">添加</button>
                    </div>
                    <div class="value-inputs">
                        <input type="number" class="filter-input filter-input-small" id="tfd-value-min" 
                               placeholder="最小值" step="0.01">
                        <span>至</span>
                        <input type="number" class="filter-input filter-input-small" id="tfd-value-max" 
                               placeholder="最大值" step="0.01">
                    </div>
                    <div class="filter-tags" id="tfd-value-tags">
                        ${CONFIG.valueFilters.map(filter => `
                            <span class="filter-tag selected" 
                                  data-keyword="${filter.keyword}" 
                                  data-min="${filter.min || ''}" 
                                  data-max="${filter.max || ''}">
                                ${filter.keyword}: ${filter.min || '任何'}~${filter.max || '任何'}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <div class="button-group">
                    <button class="action-btn" id="tfd-apply-filter">应用筛选</button>
                    <button class="action-btn secondary" id="tfd-reset-filter">重置</button>
                    <button class="action-btn secondary" id="tfd-save-config">保存</button>
                </div>

                <div class="stats-info" id="tfd-stats">
                    就绪 - 点击"应用筛选"开始
                </div>
            </div>
        `;

        document.body.appendChild(floatingPanel);
        bindPanelEvents();
        return floatingPanel;
    }

    // 创建悬浮球
    function createFloatingBall() {
        floatingBall = document.createElement('div');
        floatingBall.id = 'tfd-floating-ball';
        floatingBall.innerHTML = 'TFD';
        floatingBall.title = '打开筛选面板';

        floatingBall.addEventListener('click', () => {
            if (!floatingPanel) createFloatingPanel();
            floatingPanel.classList.remove('hidden');
            floatingBall.classList.add('hidden');
            CONFIG.panelVisible = true;
            saveConfig();
            floatingPanel.style.top = '100px';
            floatingPanel.style.right = '20px';
        });

        document.body.appendChild(floatingBall);
        
        if (CONFIG.panelVisible && floatingPanel) {
            floatingBall.classList.add('hidden');
        }
    }

    // 绑定面板事件
    function bindPanelEvents() {
        if (!floatingPanel) return;

        // 拖拽功能
        const header = floatingPanel.querySelector('.panel-header');
        
        header.addEventListener('mousedown', startDrag);
        header.addEventListener('touchstart', startDragTouch, { passive: false });

        function startDrag(e) {
            e.preventDefault();
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            
            const rect = floatingPanel.getBoundingClientRect();
            panelStartX = rect.left;
            panelStartY = rect.top;
            
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', stopDrag);
        }

        function startDragTouch(e) {
            if (e.touches.length === 1) {
                e.preventDefault();
                isDragging = true;
                dragStartX = e.touches[0].clientX;
                dragStartY = e.touches[0].clientY;
                const rect = floatingPanel.getBoundingClientRect();
                panelStartX = rect.left;
                panelStartY = rect.top;
                
                document.addEventListener('touchmove', doDragTouch, { passive: false });
                document.addEventListener('touchend', stopDragTouch);
            }
        }

        function doDrag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            const deltaX = e.clientX - dragStartX;
            const deltaY = e.clientY - dragStartY;
            
            let newX = panelStartX + deltaX;
            let newY = panelStartY + deltaY;
            
            const maxX = window.innerWidth - floatingPanel.offsetWidth;
            const maxY = window.innerHeight - floatingPanel.offsetHeight;
            
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
            
            floatingPanel.style.right = 'auto';
            floatingPanel.style.left = `${newX}px`;
            floatingPanel.style.top = `${newY}px`;
        }

        function doDragTouch(e) {
            if (!isDragging || e.touches.length !== 1) return;
            e.preventDefault();
            
            const deltaX = e.touches[0].clientX - dragStartX;
            const deltaY = e.touches[0].clientY - dragStartY;
            
            let newX = panelStartX + deltaX;
            let newY = panelStartY + deltaY;
            
            const maxX = window.innerWidth - floatingPanel.offsetWidth;
            const maxY = window.innerHeight - floatingPanel.offsetHeight;
            
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
            
            floatingPanel.style.right = 'auto';
            floatingPanel.style.left = `${newX}px`;
            floatingPanel.style.top = `${newY}px`;
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
        }

        function stopDragTouch() {
            isDragging = false;
            document.removeEventListener('touchmove', doDragTouch);
            document.removeEventListener('touchend', stopDragTouch);
        }

        // 关闭按钮
        const closeBtn = floatingPanel.querySelector('#tfd-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                CONFIG.panelVisible = false;
                floatingPanel.classList.add('hidden');
                floatingBall.classList.remove('hidden');
                saveConfig();
            });
        }

        // 应用筛选按钮
        const applyBtn = floatingPanel.querySelector('#tfd-apply-filter');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                updateConfigFromControls();
                const visibleCount = applyFilters();
                showMessage(`已筛选，显示 ${visibleCount} 个卡片`);
            });
        }

        // 保存配置按钮
        const saveBtn = floatingPanel.querySelector('#tfd-save-config');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                updateConfigFromControls();
                saveConfig();
                showMessage('配置已保存');
            });
        }

        // 重置筛选按钮
        const resetBtn = floatingPanel.querySelector('#tfd-reset-filter');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const panelVisible = CONFIG.panelVisible;
                CONFIG = { ...DEFAULT_CONFIG, panelVisible };
                saveConfig();
                loadConfigToControls();
                applyFilters();
                showMessage('筛选已重置');
            });
        }

        // 添加卖家按钮
        const addSellerBtn = floatingPanel.querySelector('#tfd-add-seller');
        const newSellerInput = floatingPanel.querySelector('#tfd-new-seller');
        if (addSellerBtn && newSellerInput) {
            addSellerBtn.addEventListener('click', () => addTag('seller'));
            newSellerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addTag('seller');
            });
        }

        // 添加决意类型按钮
        const addModuleBtn = floatingPanel.querySelector('#tfd-add-module');
        const newModuleInput = floatingPanel.querySelector('#tfd-new-module');
        if (addModuleBtn && newModuleInput) {
            addModuleBtn.addEventListener('click', () => addTag('module'));
            newModuleInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addTag('module');
            });
        }

        // 添加关键词按钮
        const addKeywordBtn = floatingPanel.querySelector('#tfd-add-keyword');
        const newKeywordInput = floatingPanel.querySelector('#tfd-new-keyword');
        if (addKeywordBtn && newKeywordInput) {
            addKeywordBtn.addEventListener('click', () => addTag('keyword'));
            newKeywordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addTag('keyword');
            });
        }

        // 添加数值筛选按钮
        const addValueBtn = floatingPanel.querySelector('#tfd-add-value-filter');
        const valueKeywordInput = floatingPanel.querySelector('#tfd-value-keyword');
        if (addValueBtn) {
            addValueBtn.addEventListener('click', () => addValueFilter());
            // 为词条名称输入框也添加回车键支持
            if (valueKeywordInput) {
                valueKeywordInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') addValueFilter();
                });
            }
        }

        // 关键词匹配模式选择
        const keywordModeInputs = floatingPanel.querySelectorAll('input[name="keyword-mode"]');
        keywordModeInputs.forEach(input => {
            input.addEventListener('change', function() {
                CONFIG.requireAllKeywords = (this.value === 'all');
            });
        });

        // 标签点击事件
        bindTagEvents();
    }

    // 绑定标签事件
    function bindTagEvents() {
        ['#tfd-seller-tags', '#tfd-module-tags', '#tfd-keyword-tags'].forEach(selector => {
            document.querySelectorAll(`${selector} .filter-tag`).forEach(tag => {
                tag.addEventListener('click', function(e) {
                    if (e.target === this) this.classList.toggle('selected');
                });
            });
        });

        // 数值筛选标签
        document.querySelectorAll('#tfd-value-tags .filter-tag').forEach(tag => {
            tag.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.remove();
                    const keyword = this.dataset.keyword;
                    CONFIG.valueFilters = CONFIG.valueFilters.filter(f => f.keyword !== keyword);
                }
            });
        });
    }

    // 添加标签
    function addTag(type) {
        const inputMap = {
            'seller': '#tfd-new-seller',
            'module': '#tfd-new-module',
            'keyword': '#tfd-new-keyword'
        };
        
        const tagsMap = {
            'seller': '#tfd-seller-tags',
            'module': '#tfd-module-tags',
            'keyword': '#tfd-keyword-tags'
        };
        
        const input = floatingPanel.querySelector(inputMap[type]);
        const value = input.value.trim();

        if (!value) return;

        const tagsContainer = floatingPanel.querySelector(tagsMap[type]);
        const existingTags = Array.from(tagsContainer.querySelectorAll('.filter-tag'));
        
        if (existingTags.some(tag => tag.dataset[type] === value)) {
            showMessage('已存在');
            input.value = '';
            return;
        }

        const tag = document.createElement('span');
        tag.className = 'filter-tag selected';
        tag.dataset[type] = value;
        tag.textContent = value;
        tag.addEventListener('click', function(e) {
            if (e.target === this) this.classList.toggle('selected');
        });

        tagsContainer.appendChild(tag);
        input.value = '';
        showMessage('已添加');
    }

    // 添加数值筛选
    function addValueFilter() {
        const keywordInput = floatingPanel.querySelector('#tfd-value-keyword');
        const minInput = floatingPanel.querySelector('#tfd-value-min');
        const maxInput = floatingPanel.querySelector('#tfd-value-max');
        
        const keyword = keywordInput.value.trim();
        const min = minInput.value ? parseFloat(minInput.value) : undefined;
        const max = maxInput.value ? parseFloat(maxInput.value) : undefined;

        if (!keyword) {
            showMessage('请输入词条名称');
            return;
        }

        if (CONFIG.valueFilters.some(f => f.keyword === keyword)) {
            showMessage('该词条已存在');
            return;
        }

        const filter = { keyword, min, max };
        CONFIG.valueFilters.push(filter);

        const tagsContainer = floatingPanel.querySelector('#tfd-value-tags');
        const tag = document.createElement('span');
        tag.className = 'filter-tag selected';
        tag.dataset.keyword = keyword;
        tag.dataset.min = min || '';
        tag.dataset.max = max || '';
        tag.textContent = `${keyword}: ${min || '任何'}~${max || '任何'}`;
        tag.addEventListener('click', function(e) {
            if (e.target === this) {
                this.remove();
                CONFIG.valueFilters = CONFIG.valueFilters.filter(f => f.keyword !== keyword);
            }
        });

        tagsContainer.appendChild(tag);
        
        keywordInput.value = '';
        minInput.value = '';
        maxInput.value = '';
        
        showMessage('数值筛选已添加');
    }

    // 从控件更新配置
    function updateConfigFromControls() {
        if (!floatingPanel) return;

        const minPriceInput = floatingPanel.querySelector('#tfd-min-price');
        const maxPriceInput = floatingPanel.querySelector('#tfd-max-price');
        const sellerFilterCheckbox = floatingPanel.querySelector('#tfd-seller-filter');
        const moduleFilterCheckbox = floatingPanel.querySelector('#tfd-module-filter');
        const keywordFilterCheckbox = floatingPanel.querySelector('#tfd-keyword-filter');
        const valueFilterCheckbox = floatingPanel.querySelector('#tfd-value-filter');
        const keywordModeAll = floatingPanel.querySelector('input[name="keyword-mode"][value="all"]');

        if (minPriceInput) CONFIG.minPrice = parseInt(minPriceInput.value) || 0;
        if (maxPriceInput) CONFIG.maxPrice = parseInt(maxPriceInput.value) || 5000;
        if (sellerFilterCheckbox) CONFIG.sellerFilterEnabled = sellerFilterCheckbox.checked;
        if (moduleFilterCheckbox) CONFIG.moduleFilterEnabled = moduleFilterCheckbox.checked;
        if (keywordFilterCheckbox) CONFIG.keywordFilterEnabled = keywordFilterCheckbox.checked;
        if (valueFilterCheckbox) CONFIG.valueFilterEnabled = valueFilterCheckbox.checked;
        if (keywordModeAll) CONFIG.requireAllKeywords = keywordModeAll.checked;

        // 更新卖家列表
        CONFIG.sellerNames = [];
        const sellerTags = floatingPanel.querySelectorAll('#tfd-seller-tags .filter-tag.selected');
        sellerTags.forEach(tag => CONFIG.sellerNames.push(tag.dataset.seller));

        // 更新决意类型列表
        CONFIG.selectedModuleNames = [];
        const moduleTags = floatingPanel.querySelectorAll('#tfd-module-tags .filter-tag.selected');
        moduleTags.forEach(tag => CONFIG.selectedModuleNames.push(tag.dataset.module));

        // 更新关键词列表
        CONFIG.selectedKeywords = [];
        const keywordTags = floatingPanel.querySelectorAll('#tfd-keyword-tags .filter-tag.selected');
        keywordTags.forEach(tag => CONFIG.selectedKeywords.push(tag.dataset.keyword));
    }

    // 加载配置到控件
    function loadConfigToControls() {
        if (!floatingPanel) return;

        const minPriceInput = floatingPanel.querySelector('#tfd-min-price');
        const maxPriceInput = floatingPanel.querySelector('#tfd-max-price');
        const sellerFilterCheckbox = floatingPanel.querySelector('#tfd-seller-filter');
        const moduleFilterCheckbox = floatingPanel.querySelector('#tfd-module-filter');
        const keywordFilterCheckbox = floatingPanel.querySelector('#tfd-keyword-filter');
        const valueFilterCheckbox = floatingPanel.querySelector('#tfd-value-filter');
        const keywordModeAny = floatingPanel.querySelector('input[name="keyword-mode"][value="any"]');
        const keywordModeAll = floatingPanel.querySelector('input[name="keyword-mode"][value="all"]');

        if (minPriceInput) minPriceInput.value = CONFIG.minPrice;
        if (maxPriceInput) maxPriceInput.value = CONFIG.maxPrice;
        if (sellerFilterCheckbox) sellerFilterCheckbox.checked = CONFIG.sellerFilterEnabled;
        if (moduleFilterCheckbox) moduleFilterCheckbox.checked = CONFIG.moduleFilterEnabled;
        if (keywordFilterCheckbox) keywordFilterCheckbox.checked = CONFIG.keywordFilterEnabled;
        if (valueFilterCheckbox) valueFilterCheckbox.checked = CONFIG.valueFilterEnabled;
        if (keywordModeAny) keywordModeAny.checked = !CONFIG.requireAllKeywords;
        if (keywordModeAll) keywordModeAll.checked = CONFIG.requireAllKeywords;

        ['seller', 'module', 'keyword'].forEach(type => {
            const tags = floatingPanel.querySelectorAll(`#tfd-${type}-tags .filter-tag`);
            const configArray = CONFIG[type === 'seller' ? 'sellerNames' : type === 'module' ? 'selectedModuleNames' : 'selectedKeywords'];
            
            tags.forEach(tag => {
                tag.classList.toggle('selected', configArray.includes(tag.dataset[type]));
            });
        });
    }

    // 显示消息
    function showMessage(text) {
        const stats = floatingPanel.querySelector('#tfd-stats');
        if (stats) {
            stats.innerHTML = `<span style="color: #0f0;">${text}</span>`;
            setTimeout(() => {
                if (floatingPanel) {
                    const items = document.querySelectorAll('.item');
                    const visible = document.querySelectorAll('.item:not(.tfd-hidden-item)').length;
                    stats.innerHTML = `显示: <strong>${visible}/${items.length}</strong> 个卡片`;
                }
            }, 2000);
        }
    }

    // 监控滚动加载
    function setupScrollObserver() {
        let lastItemCount = 0;
        
        const observer = new MutationObserver((mutations) => {
            let shouldRefilter = false;
            const currentItemCount = document.querySelectorAll('.item').length;
            
            if (currentItemCount !== lastItemCount) {
                lastItemCount = currentItemCount;
                shouldRefilter = true;
            }
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.classList && node.classList.contains('item')) {
                                shouldRefilter = true;
                                break;
                            }
                            if (node.querySelector && node.querySelector('.item')) {
                                shouldRefilter = true;
                                break;
                            }
                        }
                    }
                }
            });
            
            if (shouldRefilter && floatingPanel && CONFIG.panelVisible) {
                setTimeout(() => applyFilters(), 300);
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                if (floatingPanel && CONFIG.panelVisible) {
                    applyFilters();
                }
            }, 500);
        });
        
        lastItemCount = document.querySelectorAll('.item').length;
    }

    // 注册菜单命令
    GM_registerMenuCommand('打开筛选面板', () => {
        if (!floatingPanel) createFloatingPanel();
        floatingPanel.classList.remove('hidden');
        CONFIG.panelVisible = true;
        if (floatingBall) floatingBall.classList.add('hidden');
        saveConfig();
    });

    GM_registerMenuCommand('重新筛选所有卡片', () => {
        if (floatingPanel) {
            const visibleCount = applyFilters();
            showMessage(`重新筛选完成，显示 ${visibleCount} 个卡片`);
        } else {
            alert('请先打开筛选面板');
        }
    });

    GM_registerMenuCommand('重置所有设置', () => {
        if (confirm('确定要重置所有设置吗？')) {
            CONFIG = DEFAULT_CONFIG;
            saveConfig();
            if (floatingPanel) floatingPanel.remove();
            if (floatingBall) floatingBall.remove();
            floatingPanel = null;
            floatingBall = null;
            init();
            alert('设置已重置');
        }
    });

    // 初始化
    function init() {
        console.log('初始化卡片筛选器...');

        createFloatingBall();

        if (CONFIG.panelVisible) {
            createFloatingPanel();
            floatingBall.classList.add('hidden');
        }

        setupScrollObserver();

        setTimeout(() => {
            if (document.querySelector('.item')) {
                if (floatingPanel && CONFIG.panelVisible) {
                    applyFilters();
                }
            } else {
                const checkInterval = setInterval(() => {
                    if (document.querySelector('.item')) {
                        clearInterval(checkInterval);
                        if (floatingPanel && CONFIG.panelVisible) {
                            applyFilters();
                        }
                    }
                }, 1000);
                
                setTimeout(() => clearInterval(checkInterval), 10000);
            }
        }, 3000);
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();