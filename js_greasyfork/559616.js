// ==UserScript==
// @name         TFD先觉者卡片筛选器
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  悬浮控制面板，支持卡片市场的智能筛选和自动滚动加载
// @author       筛选助手
// @license      MIT
// @match        *://tfd.nexon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nexon.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559616/TFD%E5%85%88%E8%A7%89%E8%80%85%E5%8D%A1%E7%89%87%E7%AD%9B%E9%80%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/559616/TFD%E5%85%88%E8%A7%89%E8%80%85%E5%8D%A1%E7%89%87%E7%AD%9B%E9%80%89%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('卡片筛选器启动...');

    const DEFAULT_CONFIG = {
        maxPrice: 5000,
        minPrice: 0,
        sellerFilterEnabled: false,
        sellerNames: ['HiChen一#1961'],
        moduleFilterEnabled: false,
        selectedModuleNames: [],
        keywordFilterEnabled: false,
        selectedKeywords: [],
        requireAllKeywords: false,
        valueFilterEnabled: false,
        valueFilters: [],
        requireAllValueFilters: false,
        panelVisible: false,
        autoScrollEnabled: false,
        autoScrollInterval: 800,
        autoScrollMaxPages: 99999,
        highlightEnabled: true
    };

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

    function saveConfig() {
        if (CONFIG.sellerNames && CONFIG.sellerNames.length > 0) {
            const uniqueSellers = [];
            const seen = new Set();

            for (const seller of CONFIG.sellerNames) {
                const normalized = seller.toLowerCase().trim();
                if (normalized && !seen.has(normalized)) {
                    seen.add(normalized);
                    uniqueSellers.push(seller);
                }
            }

            CONFIG.sellerNames = uniqueSellers;
        }

        GM_setValue('tfd_filter_config', CONFIG);
    }

    let autoScrollIntervalId = null;
    let autoScrollPageCount = 0;
    let mutationObserver = null;

    GM_addStyle(`
        .tfd-hidden-item {
            display: none !important;
        }

        .loading-wrapper, .scroll-more {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            height: auto !important;
            min-height: 50px !important;
        }

        .option-match {
            font-weight: bold !important;
        }

        .option-match .option-name,
        .option-match .option-value {
            font-weight: bold !important;
            color: inherit !important;
        }

        #tfd-floating-panel {
            position: fixed;
            top: 100px;
            right: 20px;
            width: 380px;
            background: rgba(30, 30, 40, 0.95);
            border-radius: 8px;
            border: 1px solid #444;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            z-index: 99999;
            font-family: 'Segoe UI', 'Microsoft YaHei', Tahoma, Arial, sans-serif;
            overflow: hidden;
            user-select: none;
            max-height: 85vh;
            min-height: 400px;
        }

        #tfd-floating-panel.hidden {
            display: none !important;
        }

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

        .panel-content {
            padding: 15px;
            overflow-y: auto;
            overflow-x: hidden;
            max-height: calc(85vh - 50px);
        }

        .filter-group {
            margin-bottom: 12px;
        }

        .filter-label {
            display: block;
            margin-bottom: 6px;
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
            padding: 6px;
            border-radius: 4px;
            font-size: 12px;
            margin-bottom: 6px;
            box-sizing: border-box;
        }

        .filter-input-small {
            width: 75px;
            display: inline-block;
            margin: 0 3px;
        }

        .filter-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: 4px;
            max-height: 60px;
            overflow-y: auto;
        }

        .filter-tag {
            background: #333;
            color: #ccc;
            padding: 3px 6px;
            padding-right: 20px;
            border-radius: 3px;
            font-size: 11px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            max-width: 100%;
            word-break: break-all;
            position: relative;
        }

        .filter-tag.selected {
            background: #2a7fff;
            color: white;
        }

        .filter-tag:hover {
            outline: 1px solid #fff;
        }

        .filter-tag .tag-delete-btn {
            position: absolute;
            right: 2px;
            top: 50%;
            transform: translateY(-50%);
            width: 14px;
            height: 14px;
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 10px;
            line-height: 1;
            cursor: pointer;
            display: none;
            text-align: center;
            padding: 0;
        }

        .filter-tag:hover .tag-delete-btn {
            display: block;
        }

        .filter-tag .tag-delete-btn:hover {
            background: #ff0000;
        }

        .seller-note {
            font-size: 9px;
            color: #888;
            font-style: italic;
            margin-top: 2px;
            padding-left: 5px;
        }

        .button-group {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }

        .action-btn {
            flex: 1;
            padding: 6px;
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

        .action-btn.success {
            background: #4CAF50;
        }

        .action-btn.success:hover {
            background: #45a049;
        }

        .action-btn.warning {
            background: #ff9800;
        }

        .action-btn.warning:hover {
            background: #f57c00;
        }

        .action-btn:disabled {
            background: #444;
            color: #888;
            cursor: not-allowed;
        }

        .stats-info {
            margin-top: 10px;
            padding: 8px;
            background: rgba(0, 0, 0, 0.4);
            border-radius: 6px;
            font-size: 12px;
            text-align: center;
            color: #fff;
            border: 1px solid #2a7fff;
        }

        .stats-info strong {
            color: #4CAF50;
            font-size: 14px;
        }

        .tfd-notice {
            font-size: 12px;
            color: #FFA726 !important;
            margin-bottom: 10px;
            padding: 8px;
            background: rgba(255, 167, 38, 0.1);
            border-radius: 4px;
            text-align: center;
            font-weight: bold;
            border-left: 3px solid #FFA726;
        }

        .price-inputs {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .price-inputs .filter-input {
            flex: 1;
        }

        .price-inputs span {
            color: #888;
            font-size: 12px;
        }

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

        #tfd-floating-ball.auto-scrolling {
            background: #ff9800;
        }

        .tag-input-container {
            display: flex;
            gap: 4px;
            margin-bottom: 4px;
        }

        .tag-input-container input {
            flex: 1;
        }

        .tag-input-container button {
            background: #444;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 10px;
            cursor: pointer;
            white-space: nowrap;
            font-size: 12px;
        }

        .tag-input-container button:hover {
            background: #555;
        }

        .drag-handle {
            cursor: move;
            touch-action: none;
        }

        .match-mode {
            display: flex;
            gap: 8px;
            margin-top: 4px;
            font-size: 11px;
            color: #ccc;
        }

        .match-mode label {
            cursor: pointer;
            display: flex;
            align-items: center;
        }

        .match-mode input {
            margin-right: 3px;
        }

        .value-inputs {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-top: 4px;
        }

        .value-inputs .filter-input {
            margin-bottom: 0;
        }

        .value-inputs span {
            color: #888;
            font-size: 11px;
        }

        .auto-scroll-group {
            margin-top: 10px;
            padding: 8px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            border-left: 3px solid #ff9800;
        }

        .auto-scroll-controls {
            display: flex;
            gap: 8px;
            margin-top: 6px;
        }

        .auto-scroll-status {
            font-size: 11px;
            color: #ff9800;
            margin-top: 4px;
            text-align: center;
        }

        .seller-preset-note {
            font-size: 11px;
            color: #FFA726;
            font-style: italic;
            margin-top: 4px;
            padding: 4px 8px;
            background: rgba(255, 167, 38, 0.1);
            border-radius: 4px;
            border-left: 2px solid #FFA726;
            display: inline-block;
            letter-spacing: 0.3px;
            font-weight: 500;
        }

        .highlight-switch {
            margin-top: 4px;
            font-size: 11px;
            color: #ccc;
        }

        .highlight-switch label {
            cursor: pointer;
            display: flex;
            align-items: center;
        }

        .highlight-switch input {
            margin-right: 4px;
        }
    `);

    let floatingPanel = null;
    let floatingBall = null;
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let panelStartX = 0, panelStartY = 0;

    function getModuleName(itemElement) {
        const nameElement = itemElement.querySelector('.module-name');
        return nameElement ? nameElement.textContent.trim() : '';
    }

    function getSellerName(itemElement) {
        const sellerElement = itemElement.querySelector('.nickname');
        return sellerElement ? sellerElement.textContent.trim() : '';
    }

    function getPrice(itemElement) {
        const priceElement = itemElement.querySelector('.price');
        if (!priceElement) return 0;
        const priceText = priceElement.textContent.trim().replace(/,/g, '').replace('卡利弗', '');
        return parseInt(priceText, 10) || 0;
    }

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

    function hasKeywordMatch(itemElement, keywords, requireAll) {
        if (!keywords || keywords.length === 0) return { match: true, matchedKeywords: [] };

        const optionElements = itemElement.querySelectorAll('.option');
        const foundKeywords = new Set();
        const matchedKeywords = [];

        for (let option of optionElements) {
            const optionName = getOptionName(option);
            if (!optionName) continue;

            for (let keyword of keywords) {
                if (optionName.includes(keyword)) {
                    if (!requireAll) {
                        if (!matchedKeywords.includes(keyword)) {
                            matchedKeywords.push(keyword);
                        }
                    }
                    foundKeywords.add(keyword);
                    if (!matchedKeywords.includes(keyword)) {
                        matchedKeywords.push(keyword);
                    }
                }
            }
        }

        if (requireAll) {
            const match = foundKeywords.size === keywords.length;
            return { match, matchedKeywords: Array.from(foundKeywords) };
        } else {
            const match = matchedKeywords.length > 0;
            return { match, matchedKeywords };
        }
    }

    function checkValueFilters(itemElement, valueFilters, requireAll) {
        if (!valueFilters || valueFilters.length === 0) return { match: true, matchedFilters: [] };

        const optionElements = itemElement.querySelectorAll('.option');
        const satisfiedFilters = [];
        const matchedFilters = [];

        for (let filter of valueFilters) {
            let found = false;

            for (let option of optionElements) {
                const optionName = getOptionName(option);
                if (!optionName.includes(filter.keyword)) continue;

                const optionValue = getOptionValue(option);
                if (optionValue === null) continue;

                if (filter.min !== undefined && optionValue < filter.min) continue;
                if (filter.max !== undefined && optionValue > filter.max) continue;

                found = true;
                satisfiedFilters.push(filter);
                matchedFilters.push({
                    keyword: filter.keyword,
                    value: optionValue,
                    element: option
                });
                break;
            }
        }

        if (requireAll) {
            const match = satisfiedFilters.length === valueFilters.length;
            return { match, matchedFilters };
        } else {
            const match = satisfiedFilters.length > 0;
            return { match, matchedFilters };
        }
    }

    function highlightMatchedOptions(itemElement, matchedKeywords = [], matchedFilters = []) {
        if (!CONFIG.highlightEnabled) return;

        const optionElements = itemElement.querySelectorAll('.option');

        optionElements.forEach(option => {
            option.classList.remove('option-match');
            const nameElement = option.querySelector('.option-name');
            const valueElement = option.querySelector('.option-value');
            if (nameElement) nameElement.style.fontWeight = '';
            if (valueElement) valueElement.style.fontWeight = '';
        });

        matchedKeywords.forEach(keyword => {
            optionElements.forEach(option => {
                const optionName = getOptionName(option);
                if (optionName.includes(keyword)) {
                    option.classList.add('option-match');
                    const nameElement = option.querySelector('.option-name');
                    const valueElement = option.querySelector('.option-value');
                    if (nameElement) nameElement.style.fontWeight = 'bold';
                    if (valueElement) valueElement.style.fontWeight = 'bold';
                }
            });
        });

        matchedFilters.forEach(filter => {
            if (filter.element) {
                filter.element.classList.add('option-match');
                const nameElement = filter.element.querySelector('.option-name');
                const valueElement = filter.element.querySelector('.option-value');
                if (nameElement) nameElement.style.fontWeight = 'bold';
                if (valueElement) valueElement.style.fontWeight = 'bold';
            }
        });
    }

    function checkItemConditions(itemElement) {
        const price = getPrice(itemElement);
        const sellerName = getSellerName(itemElement);
        const moduleName = getModuleName(itemElement);

        const isLoader = itemElement.closest('.loading-wrapper') ||
                        itemElement.closest('.scroll-more') ||
                        itemElement.classList.contains('loading-wrapper') ||
                        itemElement.classList.contains('scroll-more');

        if (isLoader) return true;

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

        let keywordMatch = { match: true, matchedKeywords: [] };
        if (CONFIG.keywordFilterEnabled && CONFIG.selectedKeywords.length > 0) {
            keywordMatch = hasKeywordMatch(itemElement, CONFIG.selectedKeywords, CONFIG.requireAllKeywords);
            if (!keywordMatch.match) return false;
        }

        let valueFilterMatch = { match: true, matchedFilters: [] };
        if (CONFIG.valueFilterEnabled && CONFIG.valueFilters.length > 0) {
            const selectedValueFilters = CONFIG.valueFilters.filter((filter, index) => {
                const tag = document.querySelector(`#tfd-value-tags .filter-tag[data-keyword="${filter.keyword}"][data-min="${filter.min || ''}"][data-max="${filter.max || ''}"]`);
                return tag && tag.classList.contains('selected');
            });

            if (selectedValueFilters.length > 0) {
                valueFilterMatch = checkValueFilters(itemElement, selectedValueFilters, CONFIG.requireAllValueFilters);
                if (!valueFilterMatch.match) return false;
            }
        }

        if (CONFIG.highlightEnabled) {
            highlightMatchedOptions(itemElement, keywordMatch.matchedKeywords, valueFilterMatch.matchedFilters);
        }

        return true;
    }

    function applyFilters() {
        try {
            const items = document.querySelectorAll('.item');
            const loaders = document.querySelectorAll('.loading-wrapper, .scroll-more');
            let visibleCount = 0;

            loaders.forEach(loader => {
                loader.classList.remove('tfd-hidden-item');
                loader.style.display = 'flex';
                loader.style.visibility = 'visible';
                loader.style.opacity = '1';
            });

            if (items.length === 0) {
                showMessage('未找到卡片元素', 'info');
                return 0;
            }

            items.forEach(item => {
                const isLoaderItem = item.closest('.loading-wrapper') ||
                                   item.closest('.scroll-more');

                if (isLoaderItem) {
                    item.classList.remove('tfd-hidden-item');
                    return;
                }

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
        } catch (error) {
            console.error('应用筛选时出错:', error);
            showMessage('筛选出错，请刷新页面重试', 'warning');
            return 0;
        }
    }

    function updateStats(visible, total) {
        const statsElement = document.getElementById('tfd-stats');
        if (statsElement) {
            statsElement.innerHTML = `显示: <strong>${visible}/${total}</strong> 个卡片`;
        }
    }

    function scrollToLoadMore() {
        const loadingElement = document.querySelector('.loading-wrapper, .scroll-more');

        if (loadingElement && loadingElement.offsetParent !== null) {
            loadingElement.style.display = 'flex';
            loadingElement.style.visibility = 'visible';
            loadingElement.style.opacity = '1';
            loadingElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return true;
        }

        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });

        return true;
    }

    function startAutoScroll() {
        if (autoScrollIntervalId) {
            showMessage('自动滚动已在运行中', 'info');
            return;
        }

        autoScrollPageCount = 0;

        if (floatingBall) {
            floatingBall.classList.add('auto-scrolling');
            floatingBall.title = '自动滚动中 - 双击停止';
        }

        const startBtn = floatingPanel.querySelector('#tfd-start-auto-scroll');
        const stopBtn = floatingPanel.querySelector('#tfd-stop-auto-scroll');
        if (startBtn) startBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = false;

        const statusElement = floatingPanel.querySelector('#tfd-auto-scroll-status');
        if (statusElement) {
            statusElement.textContent = '自动滚动中...';
        }

        showMessage('开始自动滚动加载...', 'info');

        scrollToLoadMore();
        setTimeout(() => applyFilters(), 300);

        autoScrollIntervalId = setInterval(() => {
            if (statusElement) {
                statusElement.textContent = '自动滚动中...';
            }

            scrollToLoadMore();
            setTimeout(() => applyFilters(), 500);

        }, CONFIG.autoScrollInterval);
    }

    function stopAutoScroll() {
        if (autoScrollIntervalId) {
            clearInterval(autoScrollIntervalId);
            autoScrollIntervalId = null;

            if (floatingBall) {
                floatingBall.classList.remove('auto-scrolling');
                floatingBall.title = '打开筛选面板';
            }

            const startBtn = floatingPanel.querySelector('#tfd-start-auto-scroll');
            const stopBtn = floatingPanel.querySelector('#tfd-stop-auto-scroll');
            if (startBtn) startBtn.disabled = false;
            if (stopBtn) stopBtn.disabled = true;

            const statusElement = floatingPanel.querySelector('#tfd-auto-scroll-status');
            if (statusElement) {
                statusElement.textContent = '自动滚动已停止';
            }

            showMessage('自动滚动已停止', 'info');
        }
    }

    function initMutationObserver() {
        if (mutationObserver) {
            mutationObserver.disconnect();
        }

        mutationObserver = new MutationObserver((mutations) => {
            let shouldApplyFilter = false;
            let hasNewLoaders = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.classList && (node.classList.contains('item') || node.querySelector('.item'))) {
                                shouldApplyFilter = true;
                            }

                            if (node.classList && (node.classList.contains('loading-wrapper') ||
                                                   node.classList.contains('scroll-more') ||
                                                   node.querySelector('.loading-wrapper') ||
                                                   node.querySelector('.scroll-more'))) {
                                hasNewLoaders = true;
                            }
                        }
                    }
                }

                if (shouldApplyFilter || hasNewLoaders) break;
            }

            if (shouldApplyFilter || hasNewLoaders) {
                setTimeout(() => {
                    applyFilters();

                    if (hasNewLoaders) {
                        const loaders = document.querySelectorAll('.loading-wrapper, .scroll-more');
                        loaders.forEach(loader => {
                            loader.style.display = 'flex';
                            loader.style.visibility = 'visible';
                            loader.style.opacity = '1';
                            loader.classList.remove('tfd-hidden-item');
                        });
                    }
                }, 300);
            }
        });

        const observerConfig = {
            childList: true,
            subtree: true
        };

        mutationObserver.observe(document.body, observerConfig);
    }

    function showMessage(text, type = 'info') {
        const stats = document.getElementById('tfd-stats');
        if (stats) {
            const originalHTML = stats.innerHTML;
            stats.innerHTML = text;
            setTimeout(() => {
                if (stats) {
                    const items = document.querySelectorAll('.item');
                    const visible = document.querySelectorAll('.item:not(.tfd-hidden-item)').length;
                    stats.innerHTML = `显示: <strong>${visible}/${items.length}</strong> 个卡片`;
                }
            }, 3000);
        }
    }

    function createFloatingPanel() {
        if (floatingPanel) floatingPanel.remove();

        floatingPanel = document.createElement('div');
        floatingPanel.id = 'tfd-floating-panel';

        if (!CONFIG.panelVisible) floatingPanel.classList.add('hidden');

        floatingPanel.innerHTML = `
            <div class="panel-header drag-handle">
                <div class="panel-title">卡片筛选器 v1.2.3</div>
                <div class="panel-controls">
                    <button class="panel-btn" id="tfd-close-btn" title="关闭">×</button>
                </div>
            </div>
            <div class="panel-content">
                <div class="tfd-notice">
                    提示：页面滚动时会自动应用筛选，符合筛选条件的词条会加粗显示
                </div>

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
                    <div class="seller-preset-note">偷偷看看顶级倒钩卖什么</div>
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
                    <div class="match-mode">
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
                    <div class="match-mode">
                        <label>
                            <input type="radio" name="value-mode" value="any"
                                   ${!CONFIG.requireAllValueFilters ? 'checked' : ''}>
                            任意匹配
                        </label>
                        <label>
                            <input type="radio" name="value-mode" value="all"
                                   ${CONFIG.requireAllValueFilters ? 'checked' : ''}>
                            同时满足
                        </label>
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

                <div class="filter-group">
                    <label class="filter-label">显示设置</label>
                    <div class="highlight-switch">
                        <label>
                            <input type="checkbox" id="tfd-highlight-enabled" ${CONFIG.highlightEnabled ? 'checked' : ''}>
                            加粗显示匹配的词条
                        </label>
                    </div>
                </div>

                <div class="auto-scroll-group">
                    <label class="filter-label">
                        <input type="checkbox" class="filter-checkbox" id="tfd-auto-scroll"
                               ${CONFIG.autoScrollEnabled ? 'checked' : ''}>
                        自动滚动加载
                    </label>
                    <div class="auto-scroll-controls">
                        <button class="action-btn success" id="tfd-start-auto-scroll"
                                ${autoScrollIntervalId ? 'disabled' : ''}>
                            ${autoScrollIntervalId ? '滚动中' : '开始滚动'}
                        </button>
                        <button class="action-btn secondary" id="tfd-stop-auto-scroll"
                                ${!autoScrollIntervalId ? 'disabled' : ''}>
                            停止滚动
                        </button>
                    </div>
                    <div class="auto-scroll-status" id="tfd-auto-scroll-status">
                        ${autoScrollIntervalId ? '自动滚动中...' : '准备好开始自动滚动'}
                    </div>
                </div>

                <div class="button-group">
                    <button class="action-btn" id="tfd-apply-filter">
                        立即筛选
                    </button>
                    <button class="action-btn secondary" id="tfd-reset-filter">重置</button>
                    <button class="action-btn secondary" id="tfd-save-config">保存</button>
                </div>

                <div class="stats-info" id="tfd-stats">
                    就绪 - 页面滚动时会自动筛选
                </div>
            </div>
        `;

        document.body.appendChild(floatingPanel);
        bindPanelEvents();

        setTimeout(() => {
            bindTagEvents();
        }, 100);

        return floatingPanel;
    }

    function addDeleteButtonToTag(tag, type, value) {
        if (!tag.querySelector('.tag-delete-btn')) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'tag-delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.title = '删除';

            deleteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (type === 'seller') {
                    CONFIG.sellerNames = CONFIG.sellerNames.filter(s => s !== value);
                } else if (type === 'module') {
                    CONFIG.selectedModuleNames = CONFIG.selectedModuleNames.filter(m => m !== value);
                } else if (type === 'keyword') {
                    CONFIG.selectedKeywords = CONFIG.selectedKeywords.filter(k => k !== value);
                } else if (type === 'value-filter') {
                    const keyword = tag.dataset.keyword;
                    const min = tag.dataset.min;
                    const max = tag.dataset.max;

                    CONFIG.valueFilters = CONFIG.valueFilters.filter(f =>
                        !(f.keyword === keyword &&
                          (f.min || '') === min &&
                          (f.max || '') === max)
                    );
                }

                tag.remove();
                saveConfig();
                applyFilters();
            });

            tag.appendChild(deleteBtn);
        }

        tag.addEventListener('click', function(e) {
            if (e.target.classList.contains('tag-delete-btn')) {
                return;
            }

            if (e.target === this) {
                this.classList.toggle('selected');
                saveConfig();
                applyFilters();
            }
        });
    }

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

        floatingBall.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            if (autoScrollIntervalId) {
                stopAutoScroll();
            }
        });

        document.body.appendChild(floatingBall);

        if (CONFIG.panelVisible && floatingPanel) {
            floatingBall.classList.add('hidden');
        }

        if (autoScrollIntervalId) {
            floatingBall.classList.add('auto-scrolling');
        }
    }

    function bindTagEvents() {
        document.querySelectorAll('#tfd-seller-tags .filter-tag').forEach(tag => {
            const seller = tag.dataset.seller;
            addDeleteButtonToTag(tag, 'seller', seller);
        });

        document.querySelectorAll('#tfd-module-tags .filter-tag').forEach(tag => {
            const module = tag.dataset.module;
            addDeleteButtonToTag(tag, 'module', module);
        });

        document.querySelectorAll('#tfd-keyword-tags .filter-tag').forEach(tag => {
            const keyword = tag.dataset.keyword;
            addDeleteButtonToTag(tag, 'keyword', keyword);
        });

        document.querySelectorAll('#tfd-value-tags .filter-tag').forEach(tag => {
            const keyword = tag.dataset.keyword;
            addDeleteButtonToTag(tag, 'value-filter', keyword);
        });
    }

    function bindPanelEvents() {
        if (!floatingPanel) return;

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

        const closeBtn = floatingPanel.querySelector('#tfd-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                CONFIG.panelVisible = false;
                floatingPanel.classList.add('hidden');

                if (floatingBall) {
                    floatingBall.classList.remove('hidden');
                    floatingBall.style.display = 'flex';
                }

                saveConfig();
            });
        }

        const applyBtn = floatingPanel.querySelector('#tfd-apply-filter');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                updateConfigFromControls();
                const visibleCount = applyFilters();
                showMessage(`已筛选，显示 ${visibleCount} 个卡片`, 'success');
            });
        }

        const saveBtn = floatingPanel.querySelector('#tfd-save-config');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                updateConfigFromControls();
                saveConfig();
                showMessage('配置已保存', 'success');
            });
        }

        const resetBtn = floatingPanel.querySelector('#tfd-reset-filter');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const panelVisible = CONFIG.panelVisible;
                CONFIG = { ...DEFAULT_CONFIG, panelVisible };
                CONFIG.sellerNames = ['HiChen一#1961'];
                saveConfig();
                loadConfigToControls();
                applyFilters();
                showMessage('筛选已重置，预设卖家已恢复', 'success');
            });
        }

        const highlightCheckbox = floatingPanel.querySelector('#tfd-highlight-enabled');
        if (highlightCheckbox) {
            highlightCheckbox.addEventListener('change', function() {
                CONFIG.highlightEnabled = this.checked;
                if (this.checked) {
                    applyFilters();
                } else {
                    document.querySelectorAll('.option-match').forEach(option => {
                        option.classList.remove('option-match');
                    });
                }
            });
        }

        const startScrollBtn = floatingPanel.querySelector('#tfd-start-auto-scroll');
        if (startScrollBtn) {
            startScrollBtn.addEventListener('click', () => {
                updateConfigFromControls();
                startAutoScroll();
            });
        }

        const stopScrollBtn = floatingPanel.querySelector('#tfd-stop-auto-scroll');
        if (stopScrollBtn) {
            stopScrollBtn.addEventListener('click', () => {
                stopAutoScroll();
            });
        }

        const autoScrollCheckbox = floatingPanel.querySelector('#tfd-auto-scroll');
        if (autoScrollCheckbox) {
            autoScrollCheckbox.addEventListener('change', function() {
                CONFIG.autoScrollEnabled = this.checked;
            });
        }

        const keywordModeInputs = floatingPanel.querySelectorAll('input[name="keyword-mode"]');
        keywordModeInputs.forEach(input => {
            input.addEventListener('change', function() {
                CONFIG.requireAllKeywords = (this.value === 'all');
            });
        });

        const valueModeInputs = floatingPanel.querySelectorAll('input[name="value-mode"]');
        valueModeInputs.forEach(input => {
            input.addEventListener('change', function() {
                CONFIG.requireAllValueFilters = (this.value === 'all');
            });
        });

        const addSellerBtn = floatingPanel.querySelector('#tfd-add-seller');
        const newSellerInput = floatingPanel.querySelector('#tfd-new-seller');
        if (addSellerBtn && newSellerInput) {
            addSellerBtn.addEventListener('click', () => addTag('seller'));
            newSellerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addTag('seller');
            });
        }

        const addModuleBtn = floatingPanel.querySelector('#tfd-add-module');
        const newModuleInput = floatingPanel.querySelector('#tfd-new-module');
        if (addModuleBtn && newModuleInput) {
            addModuleBtn.addEventListener('click', () => addTag('module'));
            newModuleInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addTag('module');
            });
        }

        const addKeywordBtn = floatingPanel.querySelector('#tfd-add-keyword');
        const newKeywordInput = floatingPanel.querySelector('#tfd-new-keyword');
        if (addKeywordBtn && newKeywordInput) {
            addKeywordBtn.addEventListener('click', () => addTag('keyword'));
            newKeywordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addTag('keyword');
            });
        }

        const addValueBtn = floatingPanel.querySelector('#tfd-add-value-filter');
        const valueKeywordInput = floatingPanel.querySelector('#tfd-value-keyword');
        if (addValueBtn) {
            addValueBtn.addEventListener('click', () => addValueFilter());
            if (valueKeywordInput) {
                valueKeywordInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') addValueFilter();
                });
            }
        }
    }

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

        if (!value) {
            showMessage('请输入内容', 'info');
            return;
        }

        const tagsContainer = floatingPanel.querySelector(tagsMap[type]);
        const existingTags = Array.from(tagsContainer.querySelectorAll('.filter-tag'));

        const valueLower = value.toLowerCase();
        const exists = existingTags.some(tag => {
            const tagValue = tag.dataset[type] || tag.textContent;
            return tagValue && tagValue.toLowerCase() === valueLower;
        });

        if (exists) {
            showMessage('已存在', 'info');
            input.value = '';
            return;
        }

        const tag = document.createElement('span');
        tag.className = 'filter-tag selected';
        tag.dataset[type] = value;
        tag.textContent = value;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'tag-delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.title = '删除';

        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (type === 'seller') {
                CONFIG.sellerNames = CONFIG.sellerNames.filter(s => s !== value);
            } else if (type === 'module') {
                CONFIG.selectedModuleNames = CONFIG.selectedModuleNames.filter(m => m !== value);
            } else if (type === 'keyword') {
                CONFIG.selectedKeywords = CONFIG.selectedKeywords.filter(k => k !== value);
            }

            tag.remove();
            saveConfig();
            applyFilters();
        });

        tag.appendChild(deleteBtn);

        tag.addEventListener('click', function(e) {
            if (e.target.classList.contains('tag-delete-btn')) {
                return;
            }

            if (e.target === this) {
                this.classList.toggle('selected');
                saveConfig();
                applyFilters();
            }
        });

        tagsContainer.appendChild(tag);
        input.value = '';

        if (type === 'seller') {
            if (!CONFIG.sellerNames.includes(value)) {
                CONFIG.sellerNames.push(value);
            }
        } else if (type === 'module') {
            if (!CONFIG.selectedModuleNames.includes(value)) {
                CONFIG.selectedModuleNames.push(value);
            }
        } else if (type === 'keyword') {
            if (!CONFIG.selectedKeywords.includes(value)) {
                CONFIG.selectedKeywords.push(value);
            }
        }

        saveConfig();
        applyFilters();
    }

    function addValueFilter() {
        const keywordInput = floatingPanel.querySelector('#tfd-value-keyword');
        const minInput = floatingPanel.querySelector('#tfd-value-min');
        const maxInput = floatingPanel.querySelector('#tfd-value-max');

        const keyword = keywordInput.value.trim();
        const min = minInput.value ? parseFloat(minInput.value) : undefined;
        const max = maxInput.value ? parseFloat(maxInput.value) : undefined;

        if (!keyword) {
            showMessage('请输入词条名称', 'info');
            return;
        }

        if (min !== undefined && max !== undefined && min > max) {
            showMessage('最小值不能大于最大值', 'info');
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

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'tag-delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.title = '删除';

        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            CONFIG.valueFilters = CONFIG.valueFilters.filter(f =>
                !(f.keyword === keyword &&
                  (f.min || '') === (min || '') &&
                  (f.max || '') === (max || ''))
            );

            tag.remove();
            saveConfig();
            applyFilters();
        });

        tag.appendChild(deleteBtn);

        tag.addEventListener('click', function(e) {
            if (e.target.classList.contains('tag-delete-btn')) {
                return;
            }

            if (e.target === this) {
                this.classList.toggle('selected');
                saveConfig();
                applyFilters();
            }
        });

        tagsContainer.appendChild(tag);

        keywordInput.value = '';
        minInput.value = '';
        maxInput.value = '';

        saveConfig();
        applyFilters();
    }

    function updateConfigFromControls() {
        if (!floatingPanel) return;

        const minPriceInput = floatingPanel.querySelector('#tfd-min-price');
        const maxPriceInput = floatingPanel.querySelector('#tfd-max-price');
        const sellerFilterCheckbox = floatingPanel.querySelector('#tfd-seller-filter');
        const moduleFilterCheckbox = floatingPanel.querySelector('#tfd-module-filter');
        const keywordFilterCheckbox = floatingPanel.querySelector('#tfd-keyword-filter');
        const valueFilterCheckbox = floatingPanel.querySelector('#tfd-value-filter');
        const autoScrollCheckbox = floatingPanel.querySelector('#tfd-auto-scroll');
        const highlightCheckbox = floatingPanel.querySelector('#tfd-highlight-enabled');
        const keywordModeAll = floatingPanel.querySelector('input[name="keyword-mode"][value="all"]');
        const valueModeAll = floatingPanel.querySelector('input[name="value-mode"][value="all"]');

        if (minPriceInput) CONFIG.minPrice = parseInt(minPriceInput.value) || 0;
        if (maxPriceInput) CONFIG.maxPrice = parseInt(maxPriceInput.value) || 5000;
        if (sellerFilterCheckbox) CONFIG.sellerFilterEnabled = sellerFilterCheckbox.checked;
        if (moduleFilterCheckbox) CONFIG.moduleFilterEnabled = moduleFilterCheckbox.checked;
        if (keywordFilterCheckbox) CONFIG.keywordFilterEnabled = keywordFilterCheckbox.checked;
        if (valueFilterCheckbox) CONFIG.valueFilterEnabled = valueFilterCheckbox.checked;
        if (autoScrollCheckbox) CONFIG.autoScrollEnabled = autoScrollCheckbox.checked;
        if (highlightCheckbox) CONFIG.highlightEnabled = highlightCheckbox.checked;
        if (keywordModeAll) CONFIG.requireAllKeywords = keywordModeAll.checked;
        if (valueModeAll) CONFIG.requireAllValueFilters = valueModeAll.checked;

        CONFIG.sellerNames = [];
        const sellerTags = floatingPanel.querySelectorAll('#tfd-seller-tags .filter-tag.selected');
        sellerTags.forEach(tag => {
            const seller = tag.dataset.seller;
            if (seller && !CONFIG.sellerNames.includes(seller)) {
                CONFIG.sellerNames.push(seller);
            }
        });

        CONFIG.selectedModuleNames = [];
        const moduleTags = floatingPanel.querySelectorAll('#tfd-module-tags .filter-tag.selected');
        moduleTags.forEach(tag => {
            const module = tag.dataset.module;
            if (module && !CONFIG.selectedModuleNames.includes(module)) {
                CONFIG.selectedModuleNames.push(module);
            }
        });

        CONFIG.selectedKeywords = [];
        const keywordTags = floatingPanel.querySelectorAll('#tfd-keyword-tags .filter-tag.selected');
        keywordTags.forEach(tag => {
            const keyword = tag.dataset.keyword;
            if (keyword && !CONFIG.selectedKeywords.includes(keyword)) {
                CONFIG.selectedKeywords.push(keyword);
            }
        });
    }

    function loadConfigToControls() {
        if (!floatingPanel) return;

        const minPriceInput = floatingPanel.querySelector('#tfd-min-price');
        const maxPriceInput = floatingPanel.querySelector('#tfd-max-price');
        const sellerFilterCheckbox = floatingPanel.querySelector('#tfd-seller-filter');
        const moduleFilterCheckbox = floatingPanel.querySelector('#tfd-module-filter');
        const keywordFilterCheckbox = floatingPanel.querySelector('#tfd-keyword-filter');
        const valueFilterCheckbox = floatingPanel.querySelector('#tfd-value-filter');
        const autoScrollCheckbox = floatingPanel.querySelector('#tfd-auto-scroll');
        const highlightCheckbox = floatingPanel.querySelector('#tfd-highlight-enabled');
        const keywordModeAny = floatingPanel.querySelector('input[name="keyword-mode"][value="any"]');
        const keywordModeAll = floatingPanel.querySelector('input[name="keyword-mode"][value="all"]');
        const valueModeAny = floatingPanel.querySelector('input[name="value-mode"][value="any"]');
        const valueModeAll = floatingPanel.querySelector('input[name="value-mode"][value="all"]');

        if (minPriceInput) minPriceInput.value = CONFIG.minPrice;
        if (maxPriceInput) maxPriceInput.value = CONFIG.maxPrice;
        if (sellerFilterCheckbox) sellerFilterCheckbox.checked = CONFIG.sellerFilterEnabled;
        if (moduleFilterCheckbox) moduleFilterCheckbox.checked = CONFIG.moduleFilterEnabled;
        if (keywordFilterCheckbox) keywordFilterCheckbox.checked = CONFIG.keywordFilterEnabled;
        if (valueFilterCheckbox) valueFilterCheckbox.checked = CONFIG.valueFilterEnabled;
        if (autoScrollCheckbox) autoScrollCheckbox.checked = CONFIG.autoScrollEnabled;
        if (highlightCheckbox) highlightCheckbox.checked = CONFIG.highlightEnabled;
        if (keywordModeAny) keywordModeAny.checked = !CONFIG.requireAllKeywords;
        if (keywordModeAll) keywordModeAll.checked = CONFIG.requireAllKeywords;
        if (valueModeAny) valueModeAny.checked = !CONFIG.requireAllValueFilters;
        if (valueModeAll) valueModeAll.checked = CONFIG.requireAllValueFilters;
    }

    GM_registerMenuCommand('打开筛选面板', () => {
        if (!floatingPanel) createFloatingPanel();
        floatingPanel.classList.remove('hidden');
        CONFIG.panelVisible = true;
        if (floatingBall) {
            floatingBall.classList.add('hidden');
            floatingBall.style.display = 'none';
        }
        saveConfig();
    });

    GM_registerMenuCommand('开始自动滚动加载', () => {
        if (floatingPanel) {
            updateConfigFromControls();
            startAutoScroll();
        } else {
            alert('请先打开筛选面板');
        }
    });

    GM_registerMenuCommand('停止自动滚动', () => {
        stopAutoScroll();
    });

    GM_registerMenuCommand('应用筛选', () => {
        if (floatingPanel) {
            updateConfigFromControls();
            const visibleCount = applyFilters();
            showMessage(`筛选完成，显示 ${visibleCount} 个卡片`, 'success');
        } else {
            alert('请先打开筛选面板');
        }
    });

    GM_registerMenuCommand('重置所有设置', () => {
        if (confirm('确定要重置所有设置吗？预设卖家将恢复。')) {
            CONFIG = DEFAULT_CONFIG;
            CONFIG.sellerNames = ['HiChen一#1961'];
            saveConfig();
            if (autoScrollIntervalId) stopAutoScroll();
            if (mutationObserver) mutationObserver.disconnect();
            if (floatingPanel) floatingPanel.remove();
            if (floatingBall) floatingBall.remove();
            floatingPanel = null;
            floatingBall = null;
            init();
            alert('设置已重置，预设卖家已恢复');
        }
    });

    function init() {
        console.log('初始化卡片筛选器...');

        createFloatingBall();

        if (CONFIG.panelVisible) {
            createFloatingPanel();
            floatingBall.classList.add('hidden');
        }

        initMutationObserver();

        setTimeout(() => {
            const loaders = document.querySelectorAll('.loading-wrapper, .scroll-more');
            loaders.forEach(loader => {
                loader.style.display = 'flex';
                loader.style.visibility = 'visible';
                loader.style.opacity = '1';
                loader.classList.remove('tfd-hidden-item');
            });

            applyFilters();

            if (CONFIG.autoScrollEnabled && !autoScrollIntervalId) {
                startAutoScroll();
            }
        }, 1000);
    }

    window.addEventListener('beforeunload', () => {
        if (autoScrollIntervalId) {
            stopAutoScroll();
        }
        if (mutationObserver) {
            mutationObserver.disconnect();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();