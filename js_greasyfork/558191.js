// ==UserScript==
// @name         可视化元素选择器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  可视化选择网页元素并获取唯一CSS选择器，显示元素文本
// @author       pipi
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/558191/%E5%8F%AF%E8%A7%86%E5%8C%96%E5%85%83%E7%B4%A0%E9%80%89%E6%8B%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558191/%E5%8F%AF%E8%A7%86%E5%8C%96%E5%85%83%E7%B4%A0%E9%80%89%E6%8B%A9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加粉红色渐变主题样式
    GM_addStyle(`
        .element-selector-highlight {
            position: absolute;
            background: transparent;
            border: 2px solid #ff69b4;
            border-radius: 4px;
            box-shadow: 0 0 0 1px white, 0 0 10px rgba(255, 105, 180, 0.7);
            pointer-events: none;
            z-index: 999999;
            display: none;
        }
        
        .element-selector-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 420px;
            max-width: calc(100vw - 40px);
            background: linear-gradient(135deg, #ffb6c1, #ff69b4);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(255, 105, 180, 0.3);
            z-index: 1000000;
            font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
            color: white;
            padding: 20px;
            display: none;
            max-height: 85vh;
            overflow-y: auto;
        }
        
        .element-selector-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .element-selector-title {
            font-size: 18px;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .element-selector-close {
            background: rgba(255, 255, 255, 0.3);
            border: none;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        }
        
        .element-selector-close:hover {
            background: rgba(255, 255, 255, 0.5);
            transform: rotate(90deg);
        }
        
        .element-selector-content {
            margin-bottom: 15px;
        }
        
        .element-selector-field {
            margin-bottom: 15px;
        }
        
        .element-selector-label {
            display: block;
            font-size: 14px;
            margin-bottom: 6px;
            font-weight: 600;
        }
        
        .element-selector-input {
            width: 100%;
            padding: 10px 12px;
            border: none;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            color: #333;
            box-sizing: border-box;
            font-family: monospace;
        }
        
        .element-selector-textarea {
            width: 100%;
            padding: 10px 12px;
            border: none;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            color: #333;
            box-sizing: border-box;
            font-family: inherit;
            resize: vertical;
            min-height: 60px;
            max-height: 150px;
        }
        
        .element-selector-text-counter {
            font-size: 12px;
            text-align: right;
            margin-top: 4px;
            opacity: 0.8;
        }
        
        .element-selector-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 20px;
        }
        
        .element-selector-btn {
            flex: 1;
            min-width: 120px;
            padding: 10px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .element-selector-copy {
            background: white;
            color: #ff69b4;
        }
        
        .element-selector-copy:hover {
            background: #f8f8f8;
            transform: translateY(-2px);
        }
        
        .element-selector-copy-text {
            background: rgba(255, 255, 255, 0.9);
            color: #ff69b4;
        }
        
        .element-selector-copy-text:hover {
            background: rgba(255, 255, 255, 1);
            transform: translateY(-2px);
        }
        
        .element-selector-reselect {
            background: rgba(255, 255, 255, 0.8);
            color: #ff69b4;
        }
        
        .element-selector-reselect:hover {
            background: rgba(255, 255, 255, 0.9);
            transform: translateY(-2px);
        }
        
        .element-selector-close-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
        }
        
        .element-selector-close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        
        .element-selector-tag {
            display: inline-block;
            padding: 3px 8px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            font-size: 12px;
            margin-right: 6px;
            margin-bottom: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .element-selector-tag:hover {
            background: rgba(255, 255, 255, 0.5);
        }
        
        .element-selector-hint {
            font-size: 12px;
            margin-top: 10px;
            opacity: 0.8;
        }
        
        /* 移动端适配 */
        @media (max-width: 768px) {
            .element-selector-panel {
                top: 10px;
                right: 10px;
                left: 10px;
                width: auto;
                padding: 15px;
                max-height: 80vh;
            }
            
            .element-selector-title {
                font-size: 16px;
            }
            
            .element-selector-btn {
                min-width: 100px;
                font-size: 13px;
                padding: 8px;
            }
            
            .element-selector-buttons {
                gap: 8px;
            }
            
            .element-selector-input, .element-selector-textarea {
                font-size: 13px;
                padding: 8px 10px;
            }
            
            .element-selector-textarea {
                min-height: 50px;
                max-height: 120px;
            }
        }
    `);

    // 脚本状态变量
    let isSelecting = false;
    let currentElement = null;
    let highlightDiv = null;
    let panelDiv = null;
    let mouseX = 0;
    let mouseY = 0;

    // 初始化UI
    function initUI() {
        // 创建高亮框（初始隐藏）
        highlightDiv = document.createElement('div');
        highlightDiv.className = 'element-selector-highlight';
        highlightDiv.id = 'element-selector-highlight';
        document.body.appendChild(highlightDiv);
        
        // 创建控制面板（初始隐藏）
        panelDiv = document.createElement('div');
        panelDiv.className = 'element-selector-panel';
        panelDiv.innerHTML = `
            <div class="element-selector-header">
                <div class="element-selector-title">🌸 元素选择器</div>
                <button class="element-selector-close">×</button>
            </div>
            <div class="element-selector-content">
                <div class="element-selector-field">
                    <label class="element-selector-label">元素标签</label>
                    <input type="text" class="element-selector-input" id="selector-tag" readonly>
                </div>
                <div class="element-selector-field">
                    <label class="element-selector-label">CSS选择器</label>
                    <input type="text" class="element-selector-input" id="selector-css" readonly>
                </div>
                <div class="element-selector-field">
                    <label class="element-selector-label">元素文本内容</label>
                    <textarea class="element-selector-textarea" id="selector-text" readonly></textarea>
                    <div class="element-selector-text-counter" id="selector-text-counter">字符数: 0</div>
                </div>
                <div class="element-selector-field">
                    <label class="element-selector-label">其他可能选择器</label>
                    <div id="selector-alternatives"></div>
                </div>
                <div class="element-selector-hint">
                    提示：按 ESC 键退出选择模式
                </div>
            </div>
            <div class="element-selector-buttons">
                <button class="element-selector-btn element-selector-copy">复制选择器</button>
                <button class="element-selector-btn element-selector-copy-text">复制文本</button>
                <button class="element-selector-btn element-selector-reselect">重新选择</button>
                <button class="element-selector-btn element-selector-close-btn">关闭面板</button>
            </div>
        `;
        document.body.appendChild(panelDiv);
        
        // 绑定面板事件
        const closeBtn = panelDiv.querySelector('.element-selector-close');
        const closePanelBtn = panelDiv.querySelector('.element-selector-close-btn');
        const copyBtn = panelDiv.querySelector('.element-selector-copy');
        const copyTextBtn = panelDiv.querySelector('.element-selector-copy-text');
        const reselectBtn = panelDiv.querySelector('.element-selector-reselect');
        
        closeBtn.addEventListener('click', () => {
            panelDiv.style.display = 'none';
            stopSelecting();
        });
        
        closePanelBtn.addEventListener('click', () => {
            panelDiv.style.display = 'none';
            stopSelecting();
        });
        
        copyBtn.addEventListener('click', () => {
            const cssInput = document.getElementById('selector-css');
            cssInput.select();
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(cssInput.value).then(() => {
                    showCopyFeedback(copyBtn, '✓ 选择器已复制');
                });
            } else {
                document.execCommand('copy');
                showCopyFeedback(copyBtn, '✓ 选择器已复制');
            }
        });
        
        copyTextBtn.addEventListener('click', () => {
            const textArea = document.getElementById('selector-text');
            textArea.select();
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textArea.value).then(() => {
                    showCopyFeedback(copyTextBtn, '✓ 文本已复制');
                });
            } else {
                document.execCommand('copy');
                showCopyFeedback(copyTextBtn, '✓ 文本已复制');
            }
        });
        
        reselectBtn.addEventListener('click', () => {
            panelDiv.style.display = 'none';
            startSelecting();
        });
    }

    // 显示复制反馈
    function showCopyFeedback(button, message) {
        const originalText = button.textContent;
        button.textContent = message;
        button.style.background = '#e8f5e9';
        button.style.color = '#2e7d32';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.color = '';
        }, 1500);
    }

    // 开始选择模式
    function startSelecting() {
        if (isSelecting) return;
        
        isSelecting = true;
        console.log('🌸 元素选择模式已启动，移动鼠标选择元素');
        
        // 添加事件监听
        document.addEventListener('mousemove', handleMouseMove, true);
        document.addEventListener('click', handleClick, true);
        document.addEventListener('keydown', handleKeyDown);
    }

    // 停止选择模式
    function stopSelecting() {
        if (!isSelecting) return;
        
        isSelecting = false;
        highlightDiv.style.display = 'none';
        
        // 移除事件监听
        document.removeEventListener('mousemove', handleMouseMove, true);
        document.removeEventListener('click', handleClick, true);
        document.removeEventListener('keydown', handleKeyDown);
        
        console.log('🌸 元素选择模式已停止');
    }

    // 处理鼠标移动
    function handleMouseMove(e) {
        if (!isSelecting) return;
        
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        requestAnimationFrame(() => {
            const element = document.elementFromPoint(mouseX, mouseY);
            
            if (!element || element === highlightDiv || panelDiv.contains(element)) {
                return;
            }
            
            if (element && element !== currentElement) {
                currentElement = element;
                highlightElement(element);
            }
        });
    }

    // 处理点击
    function handleClick(e) {
        if (!isSelecting) return;
        
        if (e.target === highlightDiv || panelDiv.contains(e.target)) {
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        const element = document.elementFromPoint(mouseX, mouseY);
        
        if (!element || element === highlightDiv) {
            return;
        }
        
        currentElement = element;
        
        // 获取CSS选择器并显示面板
        const selector = getUniqueSelector(element);
        showPanel(element, selector);
        
        stopSelecting();
        
        return false;
    }

    // 处理键盘事件
    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            stopSelecting();
        }
    }

    // 高亮显示元素
    function highlightElement(element) {
        if (!element || !element.getBoundingClientRect) return;
        
        const rect = element.getBoundingClientRect();
        
        highlightDiv.style.display = 'block';
        highlightDiv.style.width = `${rect.width}px`;
        highlightDiv.style.height = `${rect.height}px`;
        highlightDiv.style.left = `${rect.left + window.scrollX}px`;
        highlightDiv.style.top = `${rect.top + window.scrollY}px`;
    }

    // 获取元素的唯一选择器
    function getUniqueSelector(element) {
        if (!element || !element.tagName) return '';
        
        if (element === highlightDiv || element.id === 'element-selector-highlight') {
            return '错误：选择了高亮框本身';
        }
        
        if (element.id && element.id !== 'element-selector-highlight') {
            return `#${CSS.escape(element.id)}`;
        }
        
        const path = [];
        let current = element;
        
        while (current && current.nodeType === Node.ELEMENT_NODE) {
            let selector = current.tagName.toLowerCase();
            
            if (current.id && current.id !== 'element-selector-highlight') {
                selector = `#${CSS.escape(current.id)}`;
                path.unshift(selector);
                break;
            }
            
            const parent = current.parentNode;
            if (parent) {
                const siblings = Array.from(parent.children);
                const sameTagSiblings = siblings.filter(s => s.tagName === current.tagName);
                
                if (sameTagSiblings.length > 1) {
                    const index = sameTagSiblings.indexOf(current) + 1;
                    
                    const allSiblingsIndex = siblings.indexOf(current) + 1;
                    const isLast = allSiblingsIndex === siblings.length;
                    const isFirst = allSiblingsIndex === 1;
                    
                    if (isLast) {
                        selector += ':last-child';
                    } else if (isFirst) {
                        selector += ':first-child';
                    } else {
                        selector += `:nth-child(${allSiblingsIndex})`;
                    }
                }
            }
            
            if (current.className && typeof current.className === 'string') {
                const classes = current.className.trim().split(/\s+/).filter(c => c.length > 0);
                if (classes.length > 0) {
                    const shortestClass = classes.reduce((a, b) => a.length < b.length ? a : b);
                    selector += `.${CSS.escape(shortestClass)}`;
                }
            }
            
            path.unshift(selector);
            
            const testSelector = path.join(' > ');
            const matches = document.querySelectorAll(testSelector);
            
            let validMatches = 0;
            matches.forEach(match => {
                if (match !== highlightDiv && match.id !== 'element-selector-highlight') {
                    validMatches++;
                }
            });
            
            if (validMatches === 1) {
                return testSelector;
            }
            
            current = parent;
        }
        
        return path.join(' > ');
    }

    // 获取元素的文本内容
    function getElementText(element) {
        if (!element) return '';
        
        // 如果是input、textarea、select等表单元素
        if (element.tagName === 'INPUT') {
            return element.value || element.placeholder || element.getAttribute('aria-label') || '';
        }
        if (element.tagName === 'TEXTAREA') {
            return element.value || element.placeholder || '';
        }
        if (element.tagName === 'SELECT') {
            return element.options[element.selectedIndex]?.text || '';
        }
        if (element.tagName === 'IMG') {
            return element.alt || element.title || element.getAttribute('aria-label') || '';
        }
        if (element.tagName === 'A') {
            const text = element.textContent.trim();
            return text || element.title || '';
        }
        
        // 对于其他元素，获取文本内容
        let text = element.textContent;
        
        // 清理文本：移除多余空格和换行
        if (text) {
            text = text.replace(/\s+/g, ' ').trim();
            
            // 如果文本太长，截断并添加省略号
            if (text.length > 500) {
                text = text.substring(0, 500) + '...';
            }
        }
        
        // 如果没有文本内容，尝试获取其他属性
        if (!text || text.length === 0) {
            const attrs = ['placeholder', 'title', 'aria-label', 'alt', 'value'];
            for (const attr of attrs) {
                const value = element.getAttribute(attr);
                if (value && value.trim()) {
                    return value.trim();
                }
            }
            
            // 检查是否有关联的label
            if (element.id) {
                const label = document.querySelector(`label[for="${element.id}"]`);
                if (label && label.textContent) {
                    return label.textContent.trim();
                }
            }
            
            // 获取子元素的alt或title
            const childWithAlt = element.querySelector('[alt], [title], [aria-label]');
            if (childWithAlt) {
                const alt = childWithAlt.getAttribute('alt') || 
                           childWithAlt.getAttribute('title') || 
                           childWithAlt.getAttribute('aria-label');
                if (alt && alt.trim()) {
                    return alt.trim();
                }
            }
            
            return '(无文本内容)';
        }
        
        return text;
    }

    // 获取替代选择器
    function getAlternativeSelectors(element) {
        const alternatives = [];
        
        if (element === highlightDiv || element.id === 'element-selector-highlight') {
            return alternatives;
        }
        
        if (element.id && element.id !== 'element-selector-highlight') {
            alternatives.push(`#${CSS.escape(element.id)}`);
        }
        
        if (element.className && typeof element.className === 'string') {
            const classes = element.className.trim().split(/\s+/).filter(c => c.length > 0);
            classes.forEach(className => {
                const selector = `${element.tagName.toLowerCase()}.${CSS.escape(className)}`;
                const matches = document.querySelectorAll(selector);
                
                let validMatches = 0;
                matches.forEach(match => {
                    if (match !== highlightDiv && match.id !== 'element-selector-highlight') {
                        validMatches++;
                    }
                });
                
                if (validMatches === 1) {
                    alternatives.push(selector);
                }
            });
        }
        
        const attrs = ['name', 'type', 'href', 'src', 'alt', 'title', 'value', 'placeholder'];
        attrs.forEach(attr => {
            if (element.hasAttribute(attr)) {
                const value = element.getAttribute(attr);
                if (value && value.trim()) {
                    const selector = `${element.tagName.toLowerCase()}[${attr}="${CSS.escape(value)}"]`;
                    const matches = document.querySelectorAll(selector);
                    
                    let validMatches = 0;
                    matches.forEach(match => {
                        if (match !== highlightDiv && match.id !== 'element-selector-highlight') {
                            validMatches++;
                        }
                    });
                    
                    if (validMatches === 1) {
                        alternatives.push(selector);
                    }
                }
            }
        });
        
        return alternatives.slice(0, 3);
    }

    // 显示结果面板
    function showPanel(element, selector) {
        const tagInput = document.getElementById('selector-tag');
        const cssInput = document.getElementById('selector-css');
        const textArea = document.getElementById('selector-text');
        const textCounter = document.getElementById('selector-text-counter');
        const alternativesDiv = document.getElementById('selector-alternatives');
        
        // 设置值
        tagInput.value = element.tagName.toLowerCase();
        cssInput.value = selector;
        
        // 获取并设置文本内容
        const elementText = getElementText(element);
        textArea.value = elementText;
        
        // 更新字符计数
        const charCount = elementText.length;
        textCounter.textContent = `字符数: ${charCount}`;
        
        // 自动调整文本区域高度
        textArea.style.height = 'auto';
        const newHeight = Math.min(Math.max(textArea.scrollHeight, 60), 150);
        textArea.style.height = `${newHeight}px`;
        
        // 获取并显示替代选择器
        const alternatives = getAlternativeSelectors(element);
        alternativesDiv.innerHTML = '';
        
        if (alternatives.length > 0) {
            alternatives.forEach(alt => {
                const tag = document.createElement('span');
                tag.className = 'element-selector-tag';
                tag.textContent = alt;
                tag.title = '点击复制';
                
                tag.addEventListener('click', () => {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(alt).then(() => {
                            const originalText = tag.textContent;
                            tag.textContent = '✓ 已复制';
                            setTimeout(() => {
                                tag.textContent = originalText;
                            }, 1000);
                        });
                    } else {
                        const tempInput = document.createElement('input');
                        tempInput.value = alt;
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempInput);
                        
                        const originalText = tag.textContent;
                        tag.textContent = '✓ 已复制';
                        setTimeout(() => {
                            tag.textContent = originalText;
                        }, 1000);
                    }
                });
                
                alternativesDiv.appendChild(tag);
            });
        } else {
            alternativesDiv.innerHTML = '<span style="font-size:12px;opacity:0.7;">无其他简短选择器</span>';
        }
        
        // 显示面板
        panelDiv.style.display = 'block';
    }

    // 初始化
    function init() {
        initUI();
        
        // 注册菜单命令
        GM_registerMenuCommand('🌸 开始选择元素', startSelecting);
        
        console.log('🌸 元素选择器已加载（带文本显示）');
        console.log('🌸 使用方式:');
        console.log('  1. 点击油猴图标，选择"开始选择元素"');
        console.log('  2. 移动鼠标选择元素，元素会有粉色边框');
        console.log('  3. 点击元素确认选择');
        console.log('  4. 面板会显示CSS选择器和元素文本内容');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();