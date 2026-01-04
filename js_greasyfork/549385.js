// ==UserScript==
// @name         Coupang 评论助手
// @name:zh-CN   Coupang 评论助手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在Coupang商品详情页提供几个美观的浮动按钮，用于定位评论、显示ID列表和查找Top评论
// @description:zh-CN 在Coupang商品详情页提供几个美观的浮动按钮，用于定位评论、显示ID列表和查找Top评论
// @license      MIT
// @author       nobody
// @match        https://www.coupang.com/vp/products/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/549385/Coupang%20%E8%AF%84%E8%AE%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/549385/Coupang%20%E8%AF%84%E8%AE%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Coupang Review Finder] 脚本 v2.0 运行中...');

    // --- 常量定义 ---
    const REVIEW_BLOCK_SELECTOR = 'article';
    const SELECTORS = {
        reviewIdContainer: '.js_reviewArticleHelpfulContainer[data-review-id], .sdp-review__article__list__help[data-review-id]'
    };
    const TOP_REVIEW_BADGE_SELECTORS = [
        '.sdp-review__article__list__info__top-badge',
        '[data-best-review=\"true\"]',
        'img[alt*=\"베스트\"]',
        'img[alt*=\"BEST\"]',
        '[data-automation-id=\"best-review-badge\"]',
        '[data-automation-id=\"bestReviewBadge\"]'
    ];
    const TOP_REVIEW_TEXT_KEYWORDS = ['베스트 리뷰', '베스트리뷰', 'Best Review', 'BEST REVIEW', 'Top Review', 'TOP REVIEW', '베스트 구매평', '베스트 구매자', 'TOP 구매자', 'TOP구매자'];
    const TOP_REVIEW_BADGE_SRC_KEYWORDS = ['pdp/badges/TOP', '/TOP50', '/TOP100', '/TOP1000', 'badge-top'];
    const REVIEW_ID_ATTRIBUTE = 'data-review-id';
    const HIGHLIGHT_CLASS = 'tm-review-highlight';
    const PANEL_ID = {
        idList: 'tm-review-id-list-panel',
        settings: 'tm-settings-panel'
    };

    // --- 默认设置 ---
    const DEFAULTS = {
        highlightColor: '#007bff',
        highlightDuration: 2000, // ms
    };

    // --- 状态与配置管理 ---
    let config = {};
    let state = {
        highlightTimeoutId: null,
        currentHighlightedElement: null,
        topReviewElements: [],
        currentTopReviewIndex: -1,
        idListPanel: null,
        settingsPanel: null
    };

    function loadConfig() {
        config.highlightColor = GM_getValue('highlightColor', DEFAULTS.highlightColor);
        config.highlightDuration = GM_getValue('highlightDuration', DEFAULTS.highlightDuration);
    }

    function saveConfig() {
        GM_setValue('highlightColor', config.highlightColor);
        GM_setValue('highlightDuration', config.highlightDuration);
    }

    function createElement(tag, attributes, parent) {
        const el = document.createElement(tag);
        for (const key in attributes) {
            if (key === 'textContent' || key === 'innerText') {
                el.textContent = attributes[key];
            } else {
                el.setAttribute(key, attributes[key]);
            }
        }
        if (parent) parent.appendChild(el);
        return el;
    }

    function getReviewBlocks() {
        const containers = Array.from(document.querySelectorAll(SELECTORS.reviewIdContainer));
        const blocks = new Set();

        containers.forEach(container => {
            const block = container.closest(REVIEW_BLOCK_SELECTOR);
            if (block) blocks.add(block);
        });

        if (blocks.size === 0) {
            document.querySelectorAll(REVIEW_BLOCK_SELECTOR).forEach(block => {
                if (block.querySelector(SELECTORS.reviewIdContainer)) {
                    blocks.add(block);
                }
            });
        }

        return Array.from(blocks);
    }

    function getReviewIdFromBlock(block) {
        if (!block) return null;
        if (block.hasAttribute(REVIEW_ID_ATTRIBUTE)) {
            return block.getAttribute(REVIEW_ID_ATTRIBUTE);
        }
        const idContainer = block.querySelector(SELECTORS.reviewIdContainer);
        return idContainer?.getAttribute(REVIEW_ID_ATTRIBUTE) || null;
    }

    function findReviewElementById(reviewId) {
        if (!reviewId) return null;
        const container = Array.from(document.querySelectorAll(SELECTORS.reviewIdContainer))
            .find(el => el.getAttribute(REVIEW_ID_ATTRIBUTE) === reviewId);
        return container?.closest(REVIEW_BLOCK_SELECTOR) || null;
    }

    function isTopReview(block) {
        if (!block) return false;
        if (block.matches?.('[data-best-review=\"true\"], [data-best=\"true\"]')) {
            return true;
        }

        const idContainer = block.querySelector(SELECTORS.reviewIdContainer);
        if (idContainer) {
            const dataBest = idContainer.getAttribute('data-best-review') || idContainer.getAttribute('data-best');
            if (dataBest === 'true') return true;
        }

        if (TOP_REVIEW_BADGE_SELECTORS.some(selector => block.querySelector(selector))) {
            return true;
        }
        const badgeImages = block.querySelectorAll('img[src]');
        for (const img of badgeImages) {
            const src = img.getAttribute('src') || '';
            if (TOP_REVIEW_BADGE_SRC_KEYWORDS.some(keyword => src.includes(keyword))) {
                return true;
            }
        }

        const badgeNodes = block.querySelectorAll('span, div, button, strong');
        for (const node of badgeNodes) {
            const text = node.textContent?.trim();
            if (!text) continue;
            if (TOP_REVIEW_TEXT_KEYWORDS.some(keyword => text.includes(keyword))) {
                return true;
            }
        }

        return false;
    }

    function hasReviewBlocks() {
        return document.querySelector(SELECTORS.reviewIdContainer) !== null;
    }

    function clearHighlight() {
        if (state.highlightTimeoutId) clearTimeout(state.highlightTimeoutId);
        if (state.currentHighlightedElement) {
            state.currentHighlightedElement.classList.remove(HIGHLIGHT_CLASS);
        }
        state.highlightTimeoutId = null;
        state.currentHighlightedElement = null;
    }

    function highlightAndScrollToReview(element, reviewId) {
        clearHighlight();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const color = config.highlightColor;
        const shadowColor = color.startsWith('#') ? `${color}80` : 'rgba(0, 123, 255, 0.5)';
        document.documentElement.style.setProperty('--tm-highlight-color', color);
        document.documentElement.style.setProperty('--tm-highlight-color-shadow', shadowColor);

        setTimeout(() => {
            if (document.body.contains(element)) {
                element.classList.add(HIGHLIGHT_CLASS);
                state.currentHighlightedElement = element;
                state.highlightTimeoutId = setTimeout(clearHighlight, config.highlightDuration);
            }
        }, 500);
    }

    // --- UI 创建 ---

    function createButton(text, container) {
        return createElement('button', {
            class: 'tm-helper-button',
            textContent: text,
        }, container);
    }

    function createPanel(id, title, triggerButton) {
        const panel = createElement('div', { id: id, class: 'tm-panel' }, document.body);
        createElement('div', { class: 'tm-panel-header', textContent: title }, panel);
        const content = createElement('div', { class: 'tm-panel-content' }, panel);

        document.addEventListener('click', (event) => {
            if (panel.style.display === 'block' && !panel.contains(event.target) && !triggerButton.contains(event.target)) {
                panel.style.display = 'none';
            }
        });
        return { panel, content };
    }

    function showCustomAlert(message) {
        const existingAlert = document.getElementById('tm-custom-alert');
        if (existingAlert) existingAlert.remove();

        const alertBox = createElement('div', { id: 'tm-custom-alert' }, document.body);
        alertBox.textContent = message;
        setTimeout(() => alertBox.remove(), 3000);
    }

    function showCustomPrompt(callback) {
        const existingPrompt = document.getElementById('tm-prompt-overlay');
        if (existingPrompt) existingPrompt.remove();

        const overlay = createElement('div', { id: 'tm-prompt-overlay' }, document.body);
        const promptBox = createElement('div', { id: 'tm-prompt-box' }, overlay);
        createElement('div', { class: 'tm-prompt-title', textContent: '请输入评论 Review ID' }, promptBox);
        const input = createElement('input', { type: 'text', class: 'tm-prompt-input' }, promptBox);
        const btnContainer = createElement('div', { class: 'tm-prompt-buttons' }, promptBox);
        const okBtn = createElement('button', { textContent: '确定' }, btnContainer);
        const cancelBtn = createElement('button', { textContent: '取消' }, btnContainer);

        const closePrompt = () => overlay.remove();

        okBtn.onclick = () => {
            callback(input.value);
            closePrompt();
        };
        cancelBtn.onclick = closePrompt;
        overlay.onclick = (e) => { if (e.target === overlay) closePrompt(); };
        input.focus();
        input.onkeydown = (e) => {
            if (e.key === 'Enter') okBtn.click();
            if (e.key === 'Escape') cancelBtn.click();
        };
    }

    function createAllUI() {
        if (document.getElementById('tm-button-container')) return;

        const buttonContainer = createElement('div', { id: 'tm-button-container' }, document.body);

        const findByIdBtn = createButton('查找指定ID', buttonContainer);
        findByIdBtn.addEventListener('click', () => {
            showCustomPrompt(reviewId => {
                if (!reviewId) return;
                const target = findReviewElementById(reviewId);
                if (target) highlightAndScrollToReview(target, reviewId);
                else showCustomAlert(`未找到 Review ID: ${reviewId}`);
            });
        });

        const findTopBtn = createButton('查找Top评论', buttonContainer);
        findTopBtn.addEventListener('click', () => {
            const topReviews = getReviewBlocks().filter(isTopReview);

            if (topReviews.length === 0) {
                state.topReviewElements = [];
                state.currentTopReviewIndex = -1;
                findTopBtn.textContent = '查找Top评论';
                showCustomAlert('未找到Top评论');
                return;
            }

            // 如果列表变化了，重置索引
            const cachedIds = state.topReviewElements.map(getReviewIdFromBlock);
            const newIds = topReviews.map(getReviewIdFromBlock);
            const listChanged = cachedIds.length !== newIds.length || cachedIds.some((id, idx) => id !== newIds[idx]);
            if (listChanged) {
                state.currentTopReviewIndex = -1;
            }
            state.topReviewElements = topReviews;

            state.currentTopReviewIndex = (state.currentTopReviewIndex + 1) % state.topReviewElements.length;
            const target = state.topReviewElements[state.currentTopReviewIndex];
            const reviewId = getReviewIdFromBlock(target) || `Top #${state.currentTopReviewIndex + 1}`;
            highlightAndScrollToReview(target, reviewId);
            findTopBtn.textContent = `Top (${state.currentTopReviewIndex + 1}/${state.topReviewElements.length})`;
        });

        const showIdsBtn = createButton('显示所有ID', buttonContainer);
        const idListUI = createPanel(PANEL_ID.idList, '所有评论 ID', showIdsBtn);
        state.idListPanel = idListUI.panel;
        const idListContent = idListUI.content;

        const refreshIdList = () => {
            const reviewIds = getReviewBlocks()
                .map(getReviewIdFromBlock)
                .filter(Boolean);

            idListContent.innerHTML = ''; // 清空旧列表
            if (reviewIds.length > 0) {
                reviewIds.forEach(id => {
                    const item = createElement('a', { class: 'tm-panel-item', textContent: id, href: '#' }, idListContent);
                    item.onclick = (ev) => {
                        ev.preventDefault();
                        const target = findReviewElementById(id);
                        if (target) {
                            highlightAndScrollToReview(target, id);
                            state.idListPanel.style.display = 'none';
                        }
                    };
                });
            } else {
                idListContent.textContent = '未找到评论ID。';
            }
        };

        const header = state.idListPanel.querySelector('.tm-panel-header');
        const refreshBtn = createElement('button', { class: 'tm-refresh-btn', textContent: '🔄' }, header);
        refreshBtn.onclick = (e) => {
            e.stopPropagation();
            refreshIdList();
            showCustomAlert('列表已刷新');
        };

        showIdsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (state.idListPanel.style.display === 'block') {
                state.idListPanel.style.display = 'none';
                return;
            }
            refreshIdList(); // 打开时刷新
            state.idListPanel.style.display = 'block';
        });

        const settingsBtn = createButton('⚙️ 设置', buttonContainer);
        const settingsUI = createPanel(PANEL_ID.settings, '助手设置', settingsBtn);
        state.settingsPanel = settingsUI.panel;
        const settingsContent = settingsUI.content;
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            state.settingsPanel.style.display = state.settingsPanel.style.display === 'block' ? 'none' : 'block';
        });

        settingsContent.innerHTML = `
            <div class="tm-settings-row">
                <label for="tm-color-input">高亮颜色:</label>
                <input type="color" id="tm-color-input" value="${config.highlightColor}">
            </div>
            <div class="tm-settings-row">
                <label for="tm-duration-input">高亮时长(ms):</label>
                <input type="number" id="tm-duration-input" value="${config.highlightDuration}" min="500" step="100">
            </div>`;
        settingsContent.querySelector('#tm-color-input').onchange = (e) => { config.highlightColor = e.target.value; saveConfig(); };
        settingsContent.querySelector('#tm-duration-input').onchange = (e) => { config.highlightDuration = parseInt(e.target.value, 10); saveConfig(); };
    }

    function initialize() {
        loadConfig();
        GM_addStyle(`
            :root { --tm-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
            #tm-button-container {
                position: fixed; top: 15px; left: 15px; z-index: 99999;
                display: flex; flex-direction: column; gap: 10px;
            }
            .tm-helper-button {
                padding: 10px 15px; width: 130px;
                background: linear-gradient(145deg, #007bff, #0056b3); color: white;
                border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1);
                transition: all 0.2s ease-in-out; font-family: var(--tm-font);
                text-shadow: 0 1px 1px rgba(0,0,0,0.2); text-align: center;
            }
            .tm-helper-button:hover {
                background: linear-gradient(145deg, #0069d9, #004ca0);
                box-shadow: 0 6px 16px rgba(0,0,0,0.2), 0 2px 5px rgba(0,0,0,0.15);
                transform: translateY(-2px);
            }
            .tm-helper-button:active { transform: translateY(0px); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
            .tm-panel {
                position: fixed; z-index: 99998; width: 240px; left: 160px; top: 15px;
                background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15); font-family: var(--tm-font);
                display: none; overflow: hidden;
            }
            #${PANEL_ID.settings} { top: 190px; } /* Position settings panel lower */
            #${PANEL_ID.idList} { top: 135px; } /* Position ID list panel */

            /* Custom Alert */
            #tm-custom-alert {
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                background-color: rgba(40, 40, 40, 0.9); color: white; padding: 12px 20px;
                border-radius: 8px; z-index: 100001; font-size: 15px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                animation: tm-fade-in-out 3s forwards;
            }
            @keyframes tm-fade-in-out {
                0% { opacity: 0; transform: translate(-50%, -20px); }
                10% { opacity: 1; transform: translate(-50%, 0); }
                90% { opacity: 1; transform: translate(-50%, 0); }
                100% { opacity: 0; transform: translate(-50%, -20px); }
            }

            /* Custom Prompt */
            #tm-prompt-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0,0,0,0.5); z-index: 100000;
                display: flex; justify-content: center; align-items: center;
            }
            #tm-prompt-box {
                background: white; padding: 25px; border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 320px;
            }
            .tm-prompt-title { font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #333; }
            .tm-prompt-input {
                width: 100%; padding: 10px; border: 1px solid #ccc;
                border-radius: 6px; font-size: 16px; margin-bottom: 20px; box-sizing: border-box;
            }
            .tm-prompt-buttons { display: flex; justify-content: flex-end; gap: 10px; }
            .tm-prompt-buttons button {
                padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;
                font-size: 14px; font-weight: 500; transition: background-color 0.2s;
            }
            .tm-prompt-buttons button:first-child { background-color: #007bff; color: white; }
            .tm-prompt-buttons button:first-child:hover { background-color: #0056b3; }
            .tm-prompt-buttons button:last-child { background-color: #f0f0f0; }
            .tm-prompt-buttons button:last-child:hover { background-color: #e0e0e0; }

            .tm-panel-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 10px 15px; background-color: #f7f7f7; border-bottom: 1px solid #e0e0e0;
                font-size: 15px; font-weight: 600; color: #333;
            }
            .tm-refresh-btn {
                background: none; border: none; font-size: 16px; cursor: pointer;
                padding: 5px; border-radius: 50%; line-height: 1;
                transition: transform 0.3s ease, background-color 0.2s;
            }
            .tm-refresh-btn:hover {
                background-color: #e0e0e0;
                transform: rotate(180deg);
            }
            .tm-panel-content { padding: 10px; max-height: 350px; overflow-y: auto; }
            .tm-panel-item {
                display: block; padding: 8px 12px; margin-bottom: 5px; background-color: #f0f0f0;
                border-radius: 6px; cursor: pointer; word-break: break-all; color: #212529;
                text-decoration: none; transition: background-color 0.2s ease, transform 0.1s ease;
            }
            .tm-panel-item:hover { background-color: #007bff; color: white; transform: translateX(3px); }
            .tm-panel-item:last-child { margin-bottom: 0; }
            .tm-settings-row {
                display: flex; align-items: center; justify-content: space-between;
                padding: 8px 5px; border-bottom: 1px solid #f0f0f0;
            }
            .tm-settings-row:last-child { border-bottom: none; }
            .tm-settings-row label { font-size: 14px; color: #495057; }
            .tm-settings-row input[type="color"] {
                -webkit-appearance: none; border: 1px solid #ddd; width: 32px; height: 32px;
                padding: 0; border-radius: 50%; cursor: pointer; overflow: hidden;
            }
            .tm-settings-row input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
            .tm-settings-row input[type="color"]::-webkit-color-swatch { border: none; border-radius: 50%; }
            .tm-settings-row input[type="number"] {
                width: 75px; padding: 6px 8px; border: 1px solid #ccc;
                border-radius: 4px; text-align: right;
            }
            .${HIGHLIGHT_CLASS} {
                border: 2px solid var(--tm-highlight-color) !important;
                box-shadow: 0 0 12px var(--tm-highlight-color-shadow) !important;
                transition: all 0.2s ease-in-out; border-radius: 5px;
            }
        `);

        // 持续观察，以便在动态加载评论时UI仍然可用
        const observer = new MutationObserver(() => {
            if (hasReviewBlocks() && !document.getElementById('tm-button-container')) {
                console.log('[Coupang Review Finder] 评论区已加载，注入UI。');
                createAllUI();
            }
        });
        // 初始检查 + 启动观察器
        setTimeout(() => {
            if (hasReviewBlocks()) {
                createAllUI();
            }
            observer.observe(document.body, { childList: true, subtree: true });
        }, 1000);
    }

    window.addEventListener('load', initialize);
})();

