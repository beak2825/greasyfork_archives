// ==UserScript==
// @name         网页元素屏蔽工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一个简单的网页元素屏蔽工具
// @author       deepseek
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557374/%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/557374/%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


(function() {
    'use strict';
    
    // 防止重复执行
    if (window.elementBlockerLoaded) {
        return;
    }
    window.elementBlockerLoaded = true;
    

    // 配置
    const CONFIG = {
        toolbarPosition: 'bottom',
        blockedElements: GM_getValue('blockedElements', {}),
        highlightColor: 'rgba(255, 0, 0, 0.3)',
        borderColor: 'red',
        retryCount: 3,
        retryDelay: 1000,
        activatorPosition: GM_getValue('activatorPosition', { top: '50%', right: '20px' })
    };

    // 添加样式
    GM_addStyle(`
        #element-blocker-toolbar {
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.85);
            border-radius: 8px;
            padding: 10px;
            display: flex;
            gap: 10px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            pointer-events: auto;
        }
        
        #element-blocker-toolbar.bottom {
            bottom: 20px;
        }
        
        #element-blocker-toolbar.top {
            top: 20px;
        }
        
        .element-blocker-btn {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 6px;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            color: white;
            pointer-events: auto;
        }
        
        .element-blocker-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }
        
        .element-blocker-btn svg {
            width: 20px;
            height: 20px;
        }
        
        .element-blocker-highlight {
            outline: 2px dashed ${CONFIG.borderColor} !important;
            background-color: ${CONFIG.highlightColor} !important;
            cursor: crosshair !important;
            position: relative;
            z-index: 9999;
        }
        
        .element-blocker-highlight::after {
            content: attr(data-element-info);
            position: absolute;
            top: -25px;
            left: 0;
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 2px 6px;
            font-size: 12px;
            border-radius: 3px;
            white-space: nowrap;
            z-index: 10001;
        }
        
        .element-blocker-blocked {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            left: -9999px !important;
        }
        
        #element-blocker-activator {
            position: fixed;
            width: 25px;
            height: 25px;
            background: rgba(0, 0, 0, 0.85);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: move;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
            pointer-events: auto;
            user-select: none;
            touch-action: none;
        }
        
        #element-blocker-activator:hover {
            transform: scale(1.1);
            background: rgba(255, 0, 0, 0.7);
            cursor: move;
        }
        
        #element-blocker-activator.dragging {
            opacity: 0.8;
            transform: scale(1.2);
            cursor: grabbing !important;
        }
        
        #element-blocker-activator svg {
            width: 24px;
            height: 24px;
            color: white;
            pointer-events: none;
        }
        
        #element-blocker-status {
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-family: Arial, sans-serif;
            font-size: 12px;
            z-index: 10000;
            display: none;
            pointer-events: none;
        }
        
        .element-blocker-selection-mode * {
            cursor: crosshair !important;
        }
        
        .element-blocker-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.15); 
    backdrop-filter: blur(10px); 
    -webkit-backdrop-filter: blur(10px); 
    border: 1px solid rgba(255, 255, 255, 0.2); 
    color: #007bff; 
    padding: 12px 20px;
    border-radius: 8px; 
    font-family: Arial, sans-serif;
    font-size: 14px;
    z-index: 10005;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5); 
}

        /* 规则管理器样式 */
        #element-blocker-rules-manager {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 95%;
            max-width: 900px;
            height: 85vh;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            z-index: 10004;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        #rules-manager-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10003;
            backdrop-filter: blur(8px);
        }
        
        .rules-manager-header {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            color: white;
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .rules-manager-header h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .rules-manager-content {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            background: #f8f9fa;
        }
        
        .rules-manager-footer {
            background: #ecf0f1;
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
            border-top: 1px solid #bdc3c7;
        }
        
        .view-toggle {
            display: flex;
            background: #e0e6ed;
            border-radius: 8px;
            padding: 3px;
            margin: 0;
            flex-shrink: 0;
        }
        
        .view-toggle-btn {
            padding: 6px 12px;
            border: none;
            background: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            flex: 1;
            min-width: 80px;
        }
        
        .view-toggle-btn.active {
            background: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            color: #2c3e50;
            font-weight: 600;
        }
        
        .rules-editor-toolbar {
            display: flex;
            gap: 6px;
            margin: 12px 20px 8px 20px;
            flex-wrap: wrap;
            align-items: center;
            flex-shrink: 0;
        }
        
        .editor-toolbar-btn {
            background: white;
            border: 1px solid #d1d9e6;
            padding: 6px 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            white-space: nowrap;
        }
        
        .editor-toolbar-btn:hover {
            background: #f8f9fa;
            border-color: #3498db;
            transform: translateY(-1px);
        }
        
        .editor-toolbar-btn.primary {
            background: #3498db;
            color: white;
            border-color: #2980b9;
        }
        
        .editor-toolbar-btn.primary:hover {
            background: #2980b9;
            border-color: #2471a3;
        }
        
        .rules-editor-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
            margin: 0 20px 20px 20px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e1e8ed;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .rules-editor {
            flex: 1;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 13px;
            line-height: 1.5;
            border: none;
            padding: 16px;
            background: white;
            resize: none;
            outline: none;
            white-space: pre;
            overflow-wrap: normal;
            overflow-x: auto;
            min-height: 400px;
        }
        
        .rules-stats {
            padding: 8px 16px;
            font-size: 12px;
            color: #7f8c8d;
            background: #f8f9fa;
            border-top: 1px solid #e1e8ed;
            flex-shrink: 0;
        }
        
        .footer-buttons {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        
        .footer-btn {
            background: #95a5a6;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            white-space: nowrap;
        }
        
        .footer-btn:hover {
            background: #7f8c8d;
            transform: translateY(-1px);
        }
        
        .footer-btn.primary {
            background: #27ae60;
        }
        
        .footer-btn.primary:hover {
            background: #219a52;
        }
        
        .domain-badge {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
        }
        
        .rules-manager-toolbar {
            display: flex;
            gap: 6px;
            align-items: center;
            flex-wrap: nowrap;
        }
        
        .rules-manager-toolbar-btn {
            background: rgba(255, 255, 255, 0.15);
            border: none;
            padding: 6px 8px;
            border-radius: 6px;
            cursor: pointer;
            color: white;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 32px;
            height: 32px;
        }
        
        .rules-manager-toolbar-btn:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateY(-1px);
        }
        
        .rules-manager-toolbar-btn svg {
            width: 16px;
            height: 16px;
        }
        
        .rules-manager-toolbar-btn.primary {
            background: rgba(52, 152, 219, 0.8);
        }
        
        .rules-manager-toolbar-btn.primary:hover {
            background: rgba(41, 128, 185, 0.9);
        }
        
        .rules-manager-toolbar-btn.close-btn {
            background: rgba(231, 76, 60, 0.8);
        }
        
        .rules-manager-toolbar-btn.close-btn:hover {
            background: rgba(192, 57, 43, 0.9);
        }
    `);

    // 全局变量
    let isSelectionMode = false;
    let currentElement = null;
    let toolbar = null;
    let activator = null;
    let statusIndicator = null;
    let expandMode = 'parent';
    let originalElement = null;
    let isRulesManagerOpen = false;
    let dynamicContentObserver = null;
    let isApplyingRules = false;
    let lastHighlightedElement = null;
    let retryAttempts = 0;
    let appliedSelectors = new Set();
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let activatorStartX = 0;
    let activatorStartY = 0;

    // 工具函数
    function getCurrentDomain() {
        return window.location.hostname;
    }

    function generateDomainRuleKey(selector) {
        return `${getCurrentDomain()}##${selector}`;
    }

    function extractSelectorFromRuleKey(ruleKey) {
        const parts = ruleKey.split('##');
        return parts.length > 1 ? parts[1] : parts[0];
    }

    function extractDomainFromRuleKey(ruleKey) {
        const parts = ruleKey.split('##');
        return parts.length > 1 ? parts[0] : 'global';
    }

    // 应用屏蔽规则函数
    function applyBlockedElementsWithRetry() {
        if (isApplyingRules) return;
        isApplyingRules = true;
        
        const currentDomain = getCurrentDomain();
        let totalApplied = 0;
        let newSelectorsApplied = false;
        
        Object.keys(CONFIG.blockedElements).forEach(ruleKey => {
            let ruleData = CONFIG.blockedElements[ruleKey];
            let selector, domain;
            
            if (typeof ruleData === 'object' && ruleData.selector) {
                selector = ruleData.selector;
                domain = ruleData.domain;
            } else {
                domain = extractDomainFromRuleKey(ruleKey);
                selector = extractSelectorFromRuleKey(ruleKey);
            }
            
            if (appliedSelectors.has(selector)) {
                return;
            }
            
            if (domain === currentDomain || domain === 'global') {
                try {
                    const elements = document.querySelectorAll(selector);
                    
                    if (elements.length > 0) {
                        elements.forEach(element => {
                            element.style.setProperty('display', 'none', 'important');
                            element.style.setProperty('visibility', 'hidden', 'important');
                            element.style.setProperty('opacity', '0', 'important');
                            element.style.setProperty('pointer-events', 'none', 'important');
                            element.style.setProperty('position', 'absolute', 'important');
                            element.style.setProperty('left', '-9999px', 'important');
                            element.classList.add('element-blocker-blocked');
                            
                            if (element.__elementBlockerProcessed) {
                                return;
                            }
                            
                            element.__elementBlockerProcessed = true;
                            element.__elementBlockerSelector = selector;
                        });
                        
                        totalApplied += elements.length;
                        appliedSelectors.add(selector);
                        newSelectorsApplied = true;
                    }
                    
                } catch (e) {
                    console.warn('无法屏蔽元素:', selector, e);
                }
            }
        });
        
        if (newSelectorsApplied) {
            retryAttempts = 0;
        } else if (retryAttempts < CONFIG.retryCount) {
            retryAttempts++;
            setTimeout(() => {
                isApplyingRules = false;
                applyBlockedElementsWithRetry();
            }, CONFIG.retryDelay);
        } else {
            retryAttempts = 0;
            isApplyingRules = false;
        }
        
        if (!newSelectorsApplied && retryAttempts === 0) {
            isApplyingRules = false;
        }
    }

    // 动态内容观察器
    function observeDynamicContent() {
        if (dynamicContentObserver) {
            dynamicContentObserver.disconnect();
        }
        
        dynamicContentObserver = new MutationObserver(function(mutations) {
            let shouldApply = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = $(node);
                            
                            Object.keys(CONFIG.blockedElements).forEach(ruleKey => {
                                let ruleData = CONFIG.blockedElements[ruleKey];
                                let selector, domain;
                                
                                if (typeof ruleData === 'object' && ruleData.selector) {
                                    selector = ruleData.selector;
                                    domain = ruleData.domain;
                                } else {
                                    domain = extractDomainFromRuleKey(ruleKey);
                                    selector = extractSelectorFromRuleKey(ruleKey);
                                }
                                
                                const currentDomain = getCurrentDomain();
                                if ((domain === currentDomain || domain === 'global') && !appliedSelectors.has(selector)) {
                                    try {
                                        const matchingElements = element.find(selector).addBack(selector);
                                        if (matchingElements.length > 0) {
                                            shouldApply = true;
                                        }
                                    } catch (e) {
                                        // 忽略选择器错误
                                    }
                                }
                            });
                        }
                    });
                }
            });
            
            if (shouldApply) {
                setTimeout(() => {
                    applyBlockedElementsWithRetry();
                }, 100);
            }
        });
        
        dynamicContentObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
        
        const styleObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const element = $(mutation.target);
                    if (element.hasClass('element-blocker-blocked') || element[0].__elementBlockerProcessed) {
                        element.style.setProperty('display', 'none', 'important');
                        element.style.setProperty('visibility', 'hidden', 'important');
                        element.style.setProperty('opacity', '0', 'important');
                    }
                }
            });
        });
        
        styleObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ['style'],
            subtree: true
        });
    }

    // 初始化函数
    function init() {
        createActivator();
        createToolbar();
        createStatusIndicator();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initializeBlocking();
            });
        } else {
            initializeBlocking();
        }
        
        addEventListeners();
        registerMenuCommands();
        
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                setTimeout(() => {
                    appliedSelectors.clear();
                    applyBlockedElementsWithRetry();
                }, 500);
            }
        });
        
        let scrollTimer;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function() {
                if (!isApplyingRules) {
                    applyBlockedElementsWithRetry();
                }
            }, 300);
        });
        
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(() => {
                    appliedSelectors.clear();
                    observeDynamicContent();
                    applyBlockedElementsWithRetry();
                }, 1000);
            }
        }).observe(document, { subtree: true, childList: true });
    }

    function initializeBlocking() {
        setTimeout(() => {
            applyBlockedElementsWithRetry();
        }, 100);
        
        [500, 1000, 2000, 5000].forEach(delay => {
            setTimeout(() => {
                applyBlockedElementsWithRetry();
            }, delay);
        });
        
        observeDynamicContent();
    }

    function registerMenuCommands() {
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('打开规则管理器', showRulesManager);
            GM_registerMenuCommand('导出所有规则', exportAllRules);
        }
    }

    function createActivator() {
        activator = $(`
            <div id="element-blocker-activator" title="启动元素屏蔽工具 (可拖拽)">
                <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><path d="m11.354 9.318l1.414-1.414a2 2 0 1 1 2.828 2.828l-1.414 1.414m-2.828-2.828l-3.387 3.386a4 4 0 0 0-1.094 2.044l-.175.877a1 1 0 0 0 1.177 1.177l.877-.175a4 4 0 0 0 2.044-1.094l3.386-3.387m-2.828-2.828l2.828 2.828"/><path stroke-linecap="round" d="M15 17h4"/></g></svg>
            </div>
        `);
        
        // 应用保存的位置
        if (CONFIG.activatorPosition) {
            activator.css({
                top: CONFIG.activatorPosition.top,
                right: CONFIG.activatorPosition.right,
                left: 'auto',
                bottom: 'auto'
            });
        }
        
        $('body').append(activator);
        
        // 添加拖拽功能
        setupActivatorDrag();
    }

    function setupActivatorDrag() {
    let dragMoved = false;
    
    activator.on('mousedown', function(e) {
        if (e.button !== 0) return; // 只响应左键
        
        dragMoved = false;
        activator.addClass('dragging');
        
        // 记录初始位置
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        
        const activatorRect = activator[0].getBoundingClientRect();
        activatorStartX = activatorRect.left;
        activatorStartY = activatorRect.top;
        
        // 防止文本选择
        e.preventDefault();
        
        $(document).on('mousemove.elementBlockerDrag', onDragMove);
        $(document).on('mouseup.elementBlockerDrag', function(e) {
            $(document).off('mousemove.elementBlockerDrag');
            $(document).off('mouseup.elementBlockerDrag');
            activator.removeClass('dragging');
            
            // 如果移动距离很小，认为是点击而不是拖拽
            if (!dragMoved) {
                // 触发点击事件
                setTimeout(() => {
                    activator.trigger('click');
                }, 10);
            }
        });
    });
    
    // 触摸设备支持
    activator.on('touchstart', function(e) {
        if (e.touches.length !== 1) return;
        
        dragMoved = false;
        activator.addClass('dragging');
        
        const touch = e.touches[0];
        dragStartX = touch.clientX;
        dragStartY = touch.clientY;
        
        const activatorRect = activator[0].getBoundingClientRect();
        activatorStartX = activatorRect.left;
        activatorStartY = activatorRect.top;
        
        e.preventDefault();
        
        $(document).on('touchmove.elementBlockerDrag', onDragMove);
        $(document).on('touchend.elementBlockerDrag', function(e) {
            $(document).off('touchmove.elementBlockerDrag');
            $(document).off('touchend.elementBlockerDrag');
            activator.removeClass('dragging');
            
            if (!dragMoved) {
                setTimeout(() => {
                    activator.trigger('click');
                }, 10);
            }
        });
    });

    function onDragMove(e) {
        let clientX, clientY;
        
        if (e.type === 'mousemove') {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e.type === 'touchmove') {
            if (e.touches.length !== 1) return;
            const touch = e.touches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        }
        
        const deltaX = clientX - dragStartX;
        const deltaY = clientY - dragStartY;
        
        // 如果移动距离超过阈值，认为是拖拽
        if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
            dragMoved = true;
        }
        
        const newX = activatorStartX + deltaX;
        const newY = activatorStartY + deltaY;
        
        // 更新位置
        activator.css({
            left: newX + 'px',
            top: newY + 'px',
            right: 'auto',
            bottom: 'auto'
        });
    }
}

function onDragEnd() {
    if (!isDragging) return;
    
    isDragging = false;
    activator.removeClass('dragging');
    
    // 保存位置
    const position = {
        top: activator.css('top'),
        right: activator.css('right'),
        left: activator.css('left'),
        bottom: activator.css('bottom')
    };
    
    CONFIG.activatorPosition = position;
    GM_setValue('activatorPosition', position);
    
    $(document).off('mousemove.elementBlockerDrag');
    $(document).off('mouseup.elementBlockerDrag');
    $(document).off('touchmove.elementBlockerDrag');
    $(document).off('touchend.elementBlockerDrag');
}



    function createStatusIndicator() {
        statusIndicator = $(`
            <div id="element-blocker-status">
                选择模式: <span style="color: #ff4444">关闭</span>
            </div>
        `);
        $('body').append(statusIndicator);
    }

    function createToolbar() {
        toolbar = $(`
            <div id="element-blocker-toolbar" class="${CONFIG.toolbarPosition}">
                <button class="element-blocker-btn" id="element-blocker-expand" title="扩大选择 (当前模式: 选择父元素)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7.485 16.515c-.575-.575-.479-3.017-.479-3.017m.48 3.017c.574.575 3.016.479 3.016.479m-3.017-.48L11 13m5.515-5.515c-.575-.575-3.017-.479-3.017-.479m3.017.48c.575.574.479 3.016.479 3.016m-.48-3.017L13 11"/><path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12Z"/></g></svg>
                </button>
                <button class="element-blocker-btn" id="element-blocker-shrink" title="缩小选择">
                    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 13.5h-3m3 0v3m0-3L7 17m6.5-6.5h3m-3 0v-3m0 3L17 7"/></g></svg>
                </button>
                <button class="element-blocker-btn" id="element-blocker-save" title="保存并屏蔽选中元素">
                    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.25 21v-4.765a1.59 1.59 0 0 0-1.594-1.588H9.344a1.59 1.59 0 0 0-1.594 1.588V21m8.5-17.715v2.362a1.59 1.59 0 0 1-1.594-1.588H9.344A1.59 1.59 0 0 1 7.75 5.647V3m8.5.285A3.2 3.2 0 0 0 14.93 3H7.75m8.5.285c.344.156.661.374.934.645l2.382 2.375A3.17 3.17 0 0 1 20.5 8.55v9.272A3.18 3.18 0 0 1 17.313 21H6.688A3.18 3.18 0 0 1 3.5 17.823V6.176A3.18 3.18 0 0 1 6.688 3H7.75"/></svg>
                </button>
                <button class="element-blocker-btn" id="element-blocker-rules" title="规则管理">
                    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="M12 23C6.443 21.765 2 16.522 2 11V5l10-4l10 4v6c0 5.524-4.443 10.765-10 12M4 6v5a10.58 10.58 0 0 0 8 10a10.58 10.58 0 0 0 8-10V6l-8-3Z"/><circle cx="12" cy="8.5" r="2.5" fill="currentColor"/><path fill="currentColor" d="M7 15a5.78 5.78 0 0 0 5 3a5.78 5.78 0 0 0 5-3c-.025-1.896-3.342-3-5-3c-1.667 0-4.975 1.104-5 3"/></svg>
                </button>
                <button class="element-blocker-btn" id="element-blocker-move" title="移动工具栏">
                    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.7 9.3L3 12m0 0l2.7 2.7M3 12h18M9.3 5.7L12 3m0 0l2.7 2.7M12 3v18m2.7-2.7L12 21m0 0l-2.7-2.7m9-9L21 12m0 0l-2.7 2.7"/></svg>
                </button>
                <button class="element-blocker-btn" id="element-blocker-exit" title="退出选择模式">
                    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2a9.99 9.99 0 0 1 8 4h-2.71a8 8 0 1 0 .001 12h2.71A9.99 9.99 0 0 1 12 22m7-6v-3h-8v-2h8V8l5 4z"/></svg>
                </button>
            </div>
        `);
        $('body').append(toolbar);
        toolbar.hide();
    }

    function addEventListeners() {
    $('#element-blocker-activator').on('click', function(e) {
        e.stopPropagation();
        if (isSelectionMode) {
            exitSelectionMode();
        } else {
            startSelectionMode();
        }
    });
    
        $('#element-blocker-expand').on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        expandSelection();
    });
    
    $('#element-blocker-shrink').on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        shrinkSelection();
    });
    
    $('#element-blocker-save').on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        saveAndBlockElement();
    });
    
    $('#element-blocker-rules').on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        showRulesManager();
    });
    
    $('#element-blocker-move').on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        moveToolbar();
    });
    
    $('#element-blocker-exit').on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        exitSelectionMode();
    });

    $(document).on('keydown', function(e) {
        if (!isSelectionMode || isRulesManagerOpen) return;
        
        if ($(e.target).closest('#element-blocker-toolbar').length) return;
        
        switch(e.key) {
            case 'Escape':
                e.preventDefault();
                exitSelectionMode();
                break;
            case 'ArrowUp':
                e.preventDefault();
                expandSelection();
                break;
            case 'ArrowDown':
                e.preventDefault();
                shrinkSelection();
                break;
            case 'Enter':
                e.preventDefault();
                saveAndBlockElement();
                break;
        }
    });
}

    function startSelectionMode() {
        isSelectionMode = true;
        toolbar.show();
        
        // 隐藏激活按钮
        activator.hide();
        
        


        $('body').addClass('element-blocker-selection-mode');
        expandMode = 'parent';
        originalElement = null;
        lastHighlightedElement = null;
        
        $(document).on('mouseover.elementBlocker', '*', function(e) {
            if (!isSelectionMode || isRulesManagerOpen) return;
            e.stopPropagation();
            e.preventDefault();
            
            const element = $(this);
            if (element.closest('#element-blocker-toolbar, #element-blocker-activator, #element-blocker-rules-manager, #rules-manager-overlay').length) return;
            
            if (lastHighlightedElement && lastHighlightedElement[0] !== element[0]) {
                lastHighlightedElement.removeClass('element-blocker-highlight');
            }
            
            highlightElement(element);
            lastHighlightedElement = element;
            currentElement = element;
        });
        
        $(document).on('mouseout.elementBlocker', '*', function(e) {
            if (!isSelectionMode || isRulesManagerOpen) return;
            e.stopPropagation();
        });
        
        $(document).on('click.elementBlocker', '*', function(e) {
            if (!isSelectionMode || isRulesManagerOpen) return;
            
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            const element = $(this);
            if (element.closest('#element-blocker-toolbar, #element-blocker-activator, #element-blocker-rules-manager, #rules-manager-overlay').length) return;
            
            $('.element-blocker-highlight').removeClass('element-blocker-highlight');
            
            highlightElement(element);
            currentElement = element;
            lastHighlightedElement = element;
            
            if (!originalElement) originalElement = element;
            expandMode = 'parent';
            updateExpandButtonTitle();
            showMessage(`已选择: ${getElementInfo(element)}`);
            
            return false;
        });
        
        showMessage('点击页面元素进行选择');
    }

    function highlightElement(element) {
        $('.element-blocker-highlight').removeClass('element-blocker-highlight');
        element.addClass('element-blocker-highlight');
        element.attr('data-element-info', getElementInfo(element));
        
        try {
            const elementRect = element[0].getBoundingClientRect();
            const isInViewport = (
                elementRect.top >= 0 &&
                elementRect.left >= 0 &&
                elementRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                elementRect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
            
            if (!isInViewport) {
                element[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            }
        } catch (e) {
            // 忽略滚动错误
        }
    }

    function getElementInfo(element) {
        const tagName = element.prop('tagName').toLowerCase();
        const id = element.attr('id');
        const className = element.attr('class');
        let info = tagName;
        if (id) info += `#${id}`;
        if (className) info += `.${className.split(' ')[0]}`;
        return info;
    }

    function expandSelection() {
        if (!currentElement) {
            showMessage('请先选择一个元素');
            return;
        }
        if (expandMode === 'parent') {
            const parent = currentElement.parent();
            if (!parent.length || parent[0] === document.body || parent[0] === document.documentElement) {
                showMessage('已到达最顶层元素，切换到选择相似元素模式');
                expandMode = 'siblings';
                updateExpandButtonTitle();
                selectSimilarElements();
                return;
            }
            $('.element-blocker-highlight').removeClass('element-blocker-highlight');
            currentElement = parent;
            highlightElement(currentElement);
            lastHighlightedElement = currentElement;
            showMessage(`已选择父元素: ${getElementInfo(currentElement)}`);
        } else {
            selectSimilarElements();
        }
    }

    function selectSimilarElements() {
        if (!originalElement) {
            showMessage('请先选择一个原始元素');
            return;
        }
        const originalTag = originalElement.prop('tagName').toLowerCase();
        const originalClasses = originalElement.attr('class') || '';
        const parent = currentElement.parent();
        const similarElements = parent.find('*').filter(function() {
            const element = $(this);
            if (element.closest('#element-blocker-toolbar, #element-blocker-activator, #element-blocker-rules-manager, #rules-manager-overlay').length) return false;
            const tag = element.prop('tagName').toLowerCase();
            const classes = element.attr('class') || '';
            let similarity = 0;
            if (tag === originalTag) similarity += 2;
            const originalClassArray = originalClasses.split(' ').filter(c => c);
            const currentClassArray = classes.split(' ').filter(c => c);
            const commonClasses = originalClassArray.filter(c => currentClassArray.includes(c));
            similarity += commonClasses.length;
            return similarity >= 2;
        });
        if (similarElements.length <= 1) {
            showMessage('未找到更多相似元素');
            return;
        }
        $('.element-blocker-highlight').removeClass('element-blocker-highlight');
        similarElements.each(function() { highlightElement($(this)); });
        showMessage(`已选择 ${similarElements.length} 个相似元素`);
    }

    function updateExpandButtonTitle() {
        const title = expandMode === 'parent' ? '扩大选择 (当前模式: 选择父元素)' : '扩大选择 (当前模式: 选择相似元素)';
        $('#element-blocker-expand').attr('title', title);
    }

    function shrinkSelection() {
        if (!currentElement || !currentElement.children().length) {
            showMessage('该元素没有子元素');
            return;
        }
        $('.element-blocker-highlight').removeClass('element-blocker-highlight');
        currentElement = currentElement.children().first();
        highlightElement(currentElement);
        lastHighlightedElement = currentElement;
        expandMode = 'parent';
        updateExpandButtonTitle();
        showMessage(`已选择子元素: ${getElementInfo(currentElement)}`);
    }

    // 选择器生成函数
    function generateSelectors(element) {
        if (!element || !element.tagName) return [];
        const $element = $(element);
        const tagName = element.tagName.toLowerCase();
        const id = element.id;
        const className = element.className;
        
        const selectors = new Set();
        
        // 1. 优先使用ID选择器
        if (id && id.trim() !== '') {
            const idSelector = `#${CSS.escape(id)}`;
            selectors.add(idSelector);
        }
        
        // 2. 类选择器
        if (className && typeof className === 'string') {
            const classes = className.trim().split(/\s+/).filter(c => 
                c.length > 1 && !isTooGenericClassName(c) && !c.includes('element-blocker')
            );
            
            if (classes.length > 0) {
                classes.forEach(className => {
                    if (className.length >= 2) {
                        selectors.add(`.${CSS.escape(className)}`);
                        selectors.add(`${tagName}.${CSS.escape(className)}`);
                    }
                });
                
                if (classes.length <= 3) {
                    const combinedClass = classes.map(c => CSS.escape(c)).join('.');
                    selectors.add(`.${combinedClass}`);
                    selectors.add(`${tagName}.${combinedClass}`);
                }
            }
        }
        
        // 3. 属性选择器
        const attributesToCheck = ['src', 'href', 'alt', 'title', 'name', 'type', 'value', 'role', 'aria-label'];
        attributesToCheck.forEach(attr => {
            if (element.hasAttribute(attr)) {
                const value = element.getAttribute(attr);
                if (value && value.length < 50) {
                    const adValuePatterns = [/ad(s?)/i, /banner/i, /promo/i, /sponsor/i, /ads?/i];
                    if (adValuePatterns.some(pattern => pattern.test(value))) {
                        selectors.add(`${tagName}[${attr}*="${CSS.escape(value.substring(0, 20))}"]`);
                    }
                }
            }
        });
        
        // 4. 路径选择器
        const pathSelector = generateSimplePathSelector(element);
        if (pathSelector && pathSelector.split(' > ').length <= 4) {
            selectors.add(pathSelector);
        }
        
        // 5. 基本标签选择器
        if (selectors.size === 0) {
            selectors.add(tagName);
        }
        
        const finalSelectors = Array.from(selectors).filter(selector => 
            !selector.includes('element-blocker') && 
            !selector.includes('elementBlocker') &&
            !selector.includes('[style') &&
            selector.length > 0
        ).sort((a, b) => {
            const aScore = getSelectorPrecisionScore(a);
            const bScore = getSelectorPrecisionScore(b);
            return bScore - aScore;
        });
        
        return finalSelectors;
    }

    function getSelectorPrecisionScore(selector) {
        let score = 0;
        
        if (selector.startsWith('.')) score += 10;
        if (selector.startsWith('#')) score += 9;
        if (selector.includes('.')) score += 5;
        if (selector.includes('#')) score += 4;
        if (selector.includes('[')) score -= 2;
        if (selector.includes(':') && !selector.includes(':contains')) score -= 3;
        if (selector.includes('[style')) score -= 5;
        
        return score;
    }

    function isTooGenericClassName(className) {
        const genericClasses = [
            'active', 'clear', 'clearfix', 'container', 'content', 'default', 
            'error', 'hidden', 'hide', 'image', 'img', 'item', 'left', 'right',
            'main', 'menu', 'nav', 'navigation', 'primary', 'secondary',
            'show', 'small', 'large', 'text', 'title', 'wrapper', 'box',
            'btn', 'button', 'link', 'icon', 'input', 'form', 'field',
            'row', 'col', 'column', 'grid', 'flex', 'block', 'inline',
            'mx-auto', 'my-auto', 'p-0', 'p-1', 'p-2', 'p-3', 'p-4',
            'm-0', 'm-1', 'm-2', 'm-3', 'm-4', 'mx-0', 'mx-1', 'mx-2', 
            'mx-3', 'mx-4', 'my-0', 'my-1', 'my-2', 'my-3', 'my-4',
            'header', 'footer', 'sidebar', 'main', 'section', 'article',
            'list', 'item', 'link', 'text', 'image', 'icon', 'button',
            'form', 'input', 'label', 'select', 'textarea', 'field',
            'table', 'row', 'cell', 'col', 'grid', 'flex', 'container',
            'wrapper', 'inner', 'outer', 'box', 'card', 'panel', 'modal',
            'dialog', 'overlay', 'popup', 'tooltip', 'badge', 'tag',
            'progress', 'bar', 'loader', 'spinner', 'animation',
            'mx-1', 'mx-2', 'mx-3', 'mx-4', 'mx-5', 'mx-6',
            'my-1', 'my-2', 'my-3', 'my-4', 'my-5', 'my-6',
            'px-1', 'px-2', 'px-3', 'px-4', 'px-5', 'px-6',
            'py-1', 'py-2', 'py-3', 'py-4', 'py-5', 'py-6',
            'mt-1', 'mt-2', 'mt-3', 'mt-4', 'mt-5', 'mt-6',
            'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5', 'mb-6',
            'ml-1', 'ml-2', 'ml-3', 'ml-4', 'ml-5', 'ml-6',
            'mr-1', 'mr-2', 'mr-3', 'mr-4', 'mr-5', 'mr-6'
        ];
        
        return genericClasses.includes(className) || 
               className.length <= 1 ||
               /^\d+$/.test(className) ||
               /^[mp][trblxy]?-\d+$/.test(className) ||
               /^[a-z]-?\d+$/.test(className);
    }

    function generateSimplePathSelector(element) {
        const path = [];
        let current = element;
        let depth = 0;
        const maxDepth = 8;
        
        while (current && current.nodeType === Node.ELEMENT_NODE && depth < maxDepth) {
            let selector = current.tagName.toLowerCase();
            
            if (current.id && current.id.trim() !== '') {
                selector += `#${CSS.escape(current.id)}`;
                path.unshift(selector);
                break;
            }
            
            if (current.className && typeof current.className === 'string') {
                const classes = current.className.trim().split(/\s+/).filter(c => 
                    c.length > 1 && !isTooGenericClassName(c) && !c.includes('element-blocker')
                );
                if (classes.length > 0) {
                    selector += `.${CSS.escape(classes[0])}`;
                }
            }
            
            path.unshift(selector);
            
            if (current.tagName === 'BODY' || current.tagName === 'HTML') break;
            
            current = current.parentNode;
            depth++;
        }
        
        return path.join(' > ');
    }

    function saveAndBlockElement() {
        const highlightedElements = $('.element-blocker-highlight');
        if (highlightedElements.length === 0) {
            showMessage('请先选择一个元素');
            return;
        }
        
        let count = 0;
        let allSelectors = new Set();
        
        highlightedElements.each(function() {
            const element = $(this);
            if (element.closest('#element-blocker-toolbar, #element-blocker-activator, #element-blocker-rules-manager, #rules-manager-overlay').length) return;
            
            const selectors = generateSelectors(this);
            
            if (selectors.length > 0) {
                let bestSelector = selectors[0];
                
                for (const selector of selectors) {
                    if (selector.includes('[style')) {
                        bestSelector = selector;
                        break;
                    }
                    if (selector.startsWith('#')) {
                        bestSelector = selector;
                        break;
                    }
                    if (selector.startsWith('.') && !selector.includes(' ')) {
                        bestSelector = selector;
                    }
                }
                
                if (bestSelector && bestSelector.trim() !== '') {
                    allSelectors.add(bestSelector);
                }
            }
            
            element.hide();
            element.addClass('element-blocker-blocked');
            element[0].__elementBlockerProcessed = true;
            element.css({
                'display': 'none !important',
                'visibility': 'hidden !important',
                'opacity': '0 !important',
                'pointer-events': 'none !important'
            });
            count++;
        });
        
        if (allSelectors.size > 0) {
            const combinedSelector = Array.from(allSelectors).join(', ');
            const ruleKey = generateDomainRuleKey(combinedSelector);
            
            CONFIG.blockedElements[ruleKey] = {
                selector: combinedSelector,
                domain: getCurrentDomain(),
                timestamp: new Date().toISOString()
            };
            
            try {
                GM_setValue('blockedElements', CONFIG.blockedElements);
                
                try {
                    appliedSelectors.add(combinedSelector);
                    const additionalElements = document.querySelectorAll(combinedSelector);
                    additionalElements.forEach(element => {
                        element.style.setProperty('display', 'none', 'important');
                        element.style.setProperty('visibility', 'hidden', 'important');
                        element.style.setProperty('opacity', '0', 'important');
                        element.style.setProperty('pointer-events', 'none', 'important');
                        element.classList.add('element-blocker-blocked');
                        element.__elementBlockerProcessed = true;
                        element.__elementBlockerSelector = combinedSelector;
                    });
                } catch (selectorError) {
                    console.warn('选择器应用失败:', selectorError);
                }
                
                showMessage(`${count} 个元素已屏蔽，创建规则: ${combinedSelector}`);
                
            } catch (e) {
                console.error('保存规则失败:', e);
                showMessage('保存失败: ' + e.message);
            }
        } else {
            showMessage('无法生成有效的选择器');
        }
        
        $('.element-blocker-highlight').removeClass('element-blocker-highlight');
        currentElement = null;
        lastHighlightedElement = null;
        expandMode = 'parent';
        updateExpandButtonTitle();
    }

    function moveToolbar() {
        if (toolbar.hasClass('bottom')) {
            toolbar.removeClass('bottom').addClass('top');
            showMessage('工具栏已移动到顶部');
        } else {
            toolbar.removeClass('top').addClass('bottom');
            showMessage('工具栏已移动到底部');
        }
    }

    function exitSelectionMode() {
        isSelectionMode = false;
        toolbar.hide();
        statusIndicator.hide();
        $('.element-blocker-highlight').removeClass('element-blocker-highlight');
        $('body').removeClass('element-blocker-selection-mode');
        currentElement = null;
        originalElement = null;
        lastHighlightedElement = null;
        expandMode = 'parent';
        updateExpandButtonTitle();
        
        // 重新显示激活按钮
        activator.show();
        
        $(document).off('mouseover.elementBlocker');
        $(document).off('mouseout.elementBlocker');
        $(document).off('click.elementBlocker');
        showMessage('元素选择模式已关闭');
    }

    function showMessage(message) {
        $('.element-blocker-message').remove();
        const messageEl = $(`<div class="element-blocker-message">${message}</div>`);
        $('body').append(messageEl);
        setTimeout(() => { messageEl.fadeOut(300, function() { $(this).remove(); }); }, 3000);
    }

    // 规则管理器功能
    function showRulesManager() {
        isRulesManagerOpen = true;
        
        const overlay = $('<div id="rules-manager-overlay"></div>');
        
        const rulesManager = $(`
            <div id="element-blocker-rules-manager">
                <div class="rules-manager-header">
                    <h2> <span class="domain-badge">${getCurrentDomain()}</span></h2>
                    <div class="rules-manager-toolbar">
                        <button class="rules-manager-toolbar-btn" id="import-rules-btn" title="导入规则">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"/></svg>
                        </button>
                        <button class="rules-manager-toolbar-btn" id="export-rules-btn" title="导出规则">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5l-5-5l1.41-1.41L11 12.67V3h2z"/></svg>
                        </button>
                        <button class="rules-manager-toolbar-btn primary" id="save-rules-btn" title="保存规则">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
                        </button>
                        <button class="rules-manager-toolbar-btn close-btn" title="关闭">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                        </button>
                    </div>
                </div>
                <div class="rules-manager-content">
                    <div class="view-toggle">
                        <button class="view-toggle-btn active" data-view="current">当前网站</button>
                        <button class="view-toggle-btn" data-view="all">全部规则</button>
                    </div>
                    <div class="rules-editor-toolbar">
                        <button class="editor-toolbar-btn" id="clear-rules-btn">清空规则</button>
                        <button class="editor-toolbar-btn" id="format-rules-btn">格式化规则</button>
                        <button class="editor-toolbar-btn" id="add-current-domain-btn">添加当前域名</button>
                        <button class="editor-toolbar-btn primary" id="validate-rules-btn">验证规则</button>
                    </div>
                    <div class="rules-editor-wrapper">
                        <textarea class="rules-editor" id="rules-editor" placeholder="每行一条规则，支持 uBlock Origin 格式&#10;例如：&#10;||example.com^&#10;example.com##.ad-banner&#10;@@||example.com^$script"></textarea>
                        <div class="rules-stats" id="rules-stats">0 条规则</div>
                    </div>
                </div>
                <div class="rules-manager-footer">
                    <div class="footer-buttons">
                        <button class="footer-btn" id="rules-help-btn">规则语法帮助</button>
                    </div>
                    <button class="footer-btn primary" id="apply-rules-btn">应用规则</button>
                </div>
            </div>
        `);

        $('body').append(overlay).append(rulesManager);
        
        loadRulesIntoEditor('current');
        bindRulesManagerEvents(rulesManager, overlay);
    }

    function bindRulesManagerEvents(manager, overlay) {
        manager.find('.close-btn').on('click', function() {
            closeRulesManager(manager, overlay);
        });
        
        overlay.on('click', function(e) {
            if (e.target === this) {
                closeRulesManager(manager, overlay);
            }
        });
        
        manager.find('.view-toggle-btn').on('click', function() {
            const view = $(this).data('view');
            manager.find('.view-toggle-btn').removeClass('active');
            $(this).addClass('active');
            loadRulesIntoEditor(view);
        });
        
        manager.find('#clear-rules-btn').on('click', function() {
            const currentView = manager.find('.view-toggle-btn.active').data('view');
            clearRulesByView(currentView);
        });
        
        manager.find('#format-rules-btn').on('click', function() {
            formatRules();
        });
        
        manager.find('#add-current-domain-btn').on('click', function() {
            addCurrentDomainRule();
        });
        
        manager.find('#validate-rules-btn').on('click', function() {
            validateRules();
        });
        
        manager.find('#apply-rules-btn').on('click', function() {
            saveRulesFromEditor();
        });
        
        manager.find('#rules-help-btn').on('click', function() {
            showRulesHelp();
        });
        
        manager.find('#import-rules-btn').on('click', function() {
            importRules();
        });
        
        manager.find('#export-rules-btn').on('click', function() {
            exportRules();
        });
        
        manager.find('#rules-editor').on('input', function() {
            updateRulesStats();
        });
        
        $(document).on('keydown.rulesManager', function(e) {
            if (e.key === 'Escape') {
                closeRulesManager(manager, overlay);
            }
        });
    }

    function clearRulesByView(viewType) {
    const currentDomain = getCurrentDomain();
    let confirmMessage = '';
    
    if (viewType === 'current') {
        confirmMessage = `确定要清空当前网站 (${currentDomain}) 的所有规则吗？`;
    } else {
        confirmMessage = '确定要清空所有规则吗？此操作不可撤销！';
    }
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    if (viewType === 'current') {
        // 只删除当前网站的规则
        const newRules = {};
        let deletedCount = 0;
        
        Object.keys(CONFIG.blockedElements).forEach(ruleKey => {
            const ruleData = CONFIG.blockedElements[ruleKey];
            let domain;
            
            if (typeof ruleData === 'object' && ruleData.domain) {
                domain = ruleData.domain;
            } else {
                domain = extractDomainFromRuleKey(ruleKey);
            }
            
            // 只保留不是当前网站的规则
            if (domain !== currentDomain) {
                newRules[ruleKey] = ruleData;
            } else {
                deletedCount++;
            }
        });
        
        // 更新配置
        CONFIG.blockedElements = newRules;
        GM_setValue('blockedElements', CONFIG.blockedElements);
        
        // 重新加载编辑器
        loadRulesIntoEditor('current');
        
        // 重新应用规则
        $('.element-blocker-blocked').removeClass('element-blocker-blocked');
        appliedSelectors.clear();
        applyBlockedElementsWithRetry();
        
        showMessage(`已清空 ${deletedCount} 条当前网站规则`);
        
    } else {
        // 清空全部规则
        const totalCount = Object.keys(CONFIG.blockedElements).length;
        CONFIG.blockedElements = {};
        GM_setValue('blockedElements', {});
        
        // 重新加载编辑器
        loadRulesIntoEditor('all');
        
        // 重新应用规则
        $('.element-blocker-blocked').removeClass('element-blocker-blocked');
        appliedSelectors.clear();
        applyBlockedElementsWithRetry();
        
        showMessage(`已清空全部 ${totalCount} 条规则`);
    }
}


    function closeRulesManager(manager, overlay) {
        manager.remove();
        overlay.remove();
        isRulesManagerOpen = false;
        $(document).off('keydown.rulesManager');
    }

    function loadRulesIntoEditor(viewType) {
    const editor = $('#rules-editor');
    const currentDomain = getCurrentDomain();
    const allRules = CONFIG.blockedElements;
    let rulesToShow = [];
    
    if (viewType === 'current') {
        // 显示当前网站规则
        Object.keys(allRules).forEach(ruleKey => {
            const ruleData = allRules[ruleKey];
            let domain, selector;
            
            if (typeof ruleData === 'object' && ruleData.selector) {
                domain = ruleData.domain;
                selector = ruleData.selector;
            } else {
                domain = extractDomainFromRuleKey(ruleKey);
                selector = extractSelectorFromRuleKey(ruleKey);
            }
            
            // 只显示当前网站的规则
            if (domain === currentDomain) {
                // 使用原始规则键，而不是重新生成
                rulesToShow.push(ruleKey);
            }
        });
    } else {
        // 显示全部规则
        Object.keys(allRules).forEach(ruleKey => {
            rulesToShow.push(ruleKey);
        });
    }
    
    const rulesText = rulesToShow.join('\n');
    editor.val(rulesText);
    updateRulesStats();
}


    function updateRulesStats() {
        const editor = $('#rules-editor');
        const text = editor.val().trim();
        const lines = text ? text.split('\n') : [];
        const validRules = lines.filter(line => {
            const trimmed = line.trim();
            return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('#');
        });
        $('#rules-stats').text(`${validRules.length} 条规则`);
    }

    function formatRules() {
        const editor = $('#rules-editor');
        let text = editor.val().trim();
        
        const lines = text.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('//') && !line.startsWith('#'))
            .sort();
        
        editor.val(lines.join('\n'));
        updateRulesStats();
        showMessage('规则已格式化');
    }

    function addCurrentDomainRule() {
        const editor = $('#rules-editor');
        const currentDomain = getCurrentDomain();
        const newRule = `||${currentDomain}^`;
        
        let currentText = editor.val().trim();
        if (currentText && !currentText.endsWith('\n')) {
            currentText += '\n';
        }
        editor.val(currentText + newRule);
        updateRulesStats();
        showMessage(`已添加规则: ${newRule}`);
    }

    function validateRules() {
        const editor = $('#rules-editor');
        const text = editor.val().trim();
        const lines = text ? text.split('\n') : [];
        
        let validCount = 0;
        let invalidCount = 0;
        const invalidRules = [];
        
        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) {
                return;
            }
            
            if (isValidRule(trimmed)) {
                validCount++;
            } else {
                invalidCount++;
                invalidRules.push(`第 ${index + 1} 行: ${trimmed}`);
            }
        });
        
        if (invalidCount === 0) {
            showMessage(`所有规则格式正确 (${validCount} 条)`);
        } else {
            const message = `${validCount} 条规则有效, ${invalidCount} 条规则无效:\n` + invalidRules.join('\n');
            alert(message);
        }
    }

    function isValidRule(rule) {
        if (!rule || rule.startsWith('//') || rule.startsWith('#')) {
            return true;
        }
        
        try {
            if (rule.includes('##')) {
                const parts = rule.split('##');
                if (parts.length !== 2) return false;
                return parts[0].length > 0 && parts[1].length > 0;
            } else if (rule.startsWith('@@')) {
                return rule.length > 2;
            } else if (rule.startsWith('||') && rule.endsWith('^')) {
                return rule.length > 4;
            } else if (rule.includes('$')) {
                return rule.split('$').length === 2;
            }
            
            return rule.length > 0;
        } catch (e) {
            return false;
        }
    }

    function showRulesHelp() {
        const helpText = `uBlock Origin 规则语法帮助:

基本格式:
1. 域名阻塞: ||example.com^
2. 元素隐藏: example.com##.ad-banner
3. 例外规则: @@||example.com^
4. 通配符: ||example.com/*ad*
5. 注释: # 这是一条注释

常见示例:
||ads.example.com^
example.com##div[class*="ad"]
@@||example.com^$script
# 这是一条注释

注意事项:
- 每行一条规则
- 空行会被忽略
- 支持大多数 uBlock Origin 语法
- 规则区分大小写`;

        alert(helpText);
    }

    function saveRulesFromEditor() {
    const editor = $('#rules-editor');
    const text = editor.val().trim();
    const lines = text ? text.split('\n') : [];
    const currentView = $('.view-toggle-btn.active').data('view');
    const currentDomain = getCurrentDomain();
    
    const newRules = {};
    let validCount = 0;
    
    // 如果是当前网站视图，只更新当前网站的规则，保留其他网站的规则
    if (currentView === 'current') {
        // 首先复制所有现有规则
        Object.keys(CONFIG.blockedElements).forEach(ruleKey => {
            const ruleData = CONFIG.blockedElements[ruleKey];
            let domain;
            
            if (typeof ruleData === 'object' && ruleData.domain) {
                domain = ruleData.domain;
            } else {
                domain = extractDomainFromRuleKey(ruleKey);
            }
            
            // 保留非当前网站的规则
            if (domain !== currentDomain) {
                newRules[ruleKey] = ruleData;
            }
        });
        
        // 然后添加当前网站的新规则
        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) {
                return;
            }
            
            if (isValidRule(trimmed)) {
                const domain = extractDomainFromRuleKey(trimmed);
                const selector = extractSelectorFromRuleKey(trimmed);
                
                newRules[trimmed] = {
                    selector: selector,
                    domain: domain,
                    timestamp: new Date().toISOString()
                };
                validCount++;
            }
        });
        
    } else {
        // 如果是全部规则视图，完全替换所有规则
        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) {
                return;
            }
            
            if (isValidRule(trimmed)) {
                const domain = extractDomainFromRuleKey(trimmed);
                const selector = extractSelectorFromRuleKey(trimmed);
                
                newRules[trimmed] = {
                    selector: selector,
                    domain: domain,
                    timestamp: new Date().toISOString()
                };
                validCount++;
            }
        });
    }
    
    CONFIG.blockedElements = newRules;
    GM_setValue('blockedElements', CONFIG.blockedElements);
    $('.element-blocker-blocked').removeClass('element-blocker-blocked');
    appliedSelectors.clear();
    applyBlockedElementsWithRetry();
    
    showMessage(`已保存 ${validCount} 条规则`);
    closeRulesManager($('#element-blocker-rules-manager'), $('#rules-manager-overlay'));
}

    function importRules() {
        const fileInput = $('<input type="file" accept=".txt,.json" style="display: none;">');
        $('body').append(fileInput);
        
        fileInput.on('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const content = e.target.result;
                    const editor = $('#rules-editor');
                    editor.val(content);
                    updateRulesStats();
                    showMessage('规则导入成功');
                } catch (error) {
                    showMessage('导入失败: ' + error.message);
                }
            };
            
            reader.readAsText(file);
            fileInput.remove();
        });
        
        fileInput.click();
    }

    function exportRules() {
        const viewType = $('.view-toggle-btn.active').data('view');
        const editor = $('#rules-editor');
        const rulesText = editor.val();
        
        const blob = new Blob([rulesText], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
        const filename = `element-blocker-rules-${viewType}-${timestamp}.txt`;
        
        if (typeof GM_download !== 'undefined') {
            GM_download({
                url: url,
                name: filename,
                onload: function() {
                    showMessage('规则导出成功');
                    URL.revokeObjectURL(url);
                },
                onerror: function() {
                    showMessage('规则导出失败');
                    URL.revokeObjectURL(url);
                }
            });
        } else {
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 100);
            showMessage('规则导出成功');
        }
    }

    function exportAllRules() {
        const rulesText = Object.keys(CONFIG.blockedElements).join('\n');
        const blob = new Blob([rulesText], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
        const filename = `element-blocker-all-rules-${timestamp}.txt`;
        
        if (typeof GM_download !== 'undefined') {
            GM_download({
                url: url,
                name: filename,
                onload: function() {
                    showMessage('所有规则导出成功');
                    URL.revokeObjectURL(url);
                }
            });
        } else {
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 100);
            showMessage('所有规则导出成功');
        }
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init();
        });
    } else {
        init();
    }
})();