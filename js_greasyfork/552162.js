// ==UserScript==
// @name         文本提取助手
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  一个轻量级的用户脚本，可帮助您快速提取网页上的文本内容。通过简单的点击操作，即可查看、复制或深入提取嵌套文本内容。
// @license      MIT
// @author       niweizhuan
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/552162/%E6%96%87%E6%9C%AC%E6%8F%90%E5%8F%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552162/%E6%96%87%E6%9C%AC%E6%8F%90%E5%8F%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否被禁用
    if (GM_getValue('scriptDisabled', false)) {
        return;
    }

    // 添加自定义样式
    GM_addStyle(`
        #text-copier-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: flex-end;
        }
        
        #text-copier-main-btn {
            padding: 8px 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        #text-copier-delete-btn {
            padding: 4px 8px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            width: 24px;
            height: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
        }
        
        #text-copier-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 80%;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            min-width: 300px;
            /* 新增响应式控制 */
            max-width: 90vw;
            max-height: 80vh;
            width: auto;
            min-width: 300px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        
        #text-copier-modal-content {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 4px;
            white-space: pre-wrap;
            word-break: break-word;
            flex: 1;
            max-height: 60vh;
        /* 添加漂亮的滚动条 */
            scrollbar-width: thin;
            scrollbar-color: #4CAF50 #f1f1f1;
        }
        
        #text-copier-modal-footer {
            display: flex;
            justify-content: space-between;
            gap: 10px;
        }
        
        .text-copier-modal-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            flex: 1;
        }
        
        #text-copier-copy-btn {
            background-color: #4CAF50;
            color: white;
        }
        
        #text-copier-next-btn {
            background-color: #2196F3;
            color: white;
        }
        
        #text-copier-close-btn {
            background-color: #f44336;
            color: white;
        }
        
        .text-copier-highlight {
            outline: 2px dashed #FF9800;
            outline-offset: 2px;
            background-color: rgba(255, 152, 0, 0.1);
        }
        
        #text-copier-modal-content::-webkit-scrollbar {
        width: 8px;
    }
    
        #text-copier-modal-content::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }
    
        #text-copier-modal-content::-webkit-scrollbar-thumb {
        background-color: #4CAF50;
        border-radius: 4px;
    }
    `);

    // 注册菜单命令
    GM_registerMenuCommand("切换文本获取工具状态", function() {
        const currentState = GM_getValue('scriptDisabled', false);
        GM_setValue('scriptDisabled', !currentState);
        
        if (!currentState) {
            showNotification('文本获取工具已禁用 - 将在下次页面加载时生效');
            // 立即隐藏界面
            const container = document.getElementById('text-copier-container');
            if (container) container.style.display = 'none';
        } else {
            showNotification('文本获取工具已启用 - 将在下次页面加载时生效');
            // 立即显示界面
            const container = document.getElementById('text-copier-container');
            if (container) container.style.display = 'flex';
        }
    });

    // 创建主按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'text-copier-container';

    // 创建主按钮
    const mainButton = document.createElement('button');
    mainButton.id = 'text-copier-main-btn';
    mainButton.textContent = '获取文本';

    // 创建删除按钮
    const deleteButton = document.createElement('button');
    deleteButton.id = 'text-copier-delete-btn';
    deleteButton.textContent = '×';
    deleteButton.title = '隐藏按钮（直到下次打开浏览器）';

    // 将元素添加到容器和页面
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(mainButton);
    document.body.appendChild(buttonContainer);

    // 创建模态框
    const modal = document.createElement('div');
    modal.id = 'text-copier-modal';
    modal.style.display = 'none';
    
    const modalContent = document.createElement('div');
    modalContent.id = 'text-copier-modal-content';
    
    const modalFooter = document.createElement('div');
    modalFooter.id = 'text-copier-modal-footer';
    
    const copyButton = document.createElement('button');
    copyButton.id = 'text-copier-copy-btn';
    copyButton.textContent = '复制';
    
    const nextButton = document.createElement('button');
    nextButton.id = 'text-copier-next-btn';
    nextButton.textContent = '下一层';
    
    const closeButton = document.createElement('button');
    closeButton.id = 'text-copier-close-btn';
    closeButton.textContent = '关闭';
    
    modalFooter.appendChild(copyButton);
    modalFooter.appendChild(nextButton);
    modalFooter.appendChild(closeButton);
    modal.appendChild(modalContent);
    modal.appendChild(modalFooter);
    document.body.appendChild(modal);

    let isSelecting = false;
    let currentElement = null;
    let clickHistory = [];

    // 主按钮点击事件
    mainButton.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (!isSelecting) {
            // 进入选择模式
            isSelecting = true;
            mainButton.textContent = '取消选择';
            mainButton.style.backgroundColor = '#f44336';
            
            // 添加高亮样式
            document.body.style.cursor = 'pointer';
            document.querySelectorAll('*').forEach(el => {
                el.style.cursor = 'pointer';
            });
        } else {
            // 取消选择模式
            exitSelectionMode();
        }
    });

    // 删除按钮点击事件
    deleteButton.addEventListener('click', function(e) {
        e.stopPropagation();
        buttonContainer.style.display = 'none';
        GM_setValue('buttonHidden', true);
        showNotification('获取文本按钮已隐藏');
        if (currentElement) {
            currentElement.classList.remove('text-copier-highlight');
        }
    });

    // 复制按钮点击事件
    copyButton.addEventListener('click', function() {
        const text = modalContent.textContent;
        if (text && text !== '未找到文本内容') {
            try {
                if (typeof GM_setClipboard !== 'undefined') {
                    GM_setClipboard(text);
                    showNotification('复制成功', 'success');
                } else {
                    navigator.clipboard.writeText(text).then(() => {
                        showNotification('复制成功', 'success');
                    }).catch(err => {
                        console.error('复制失败:', err);
                        showNotification('复制失败: ' + err.message, 'error');
                    });
                }
                
                // 复制成功后1秒移除高亮
                if (currentElement) {
                    setTimeout(() => {
                        currentElement.classList.remove('text-copier-highlight');
                    }, 1000);
                }
            } catch (err) {
                console.error('复制失败:', err);
                showNotification('复制失败: ' + err.message, 'error');
            }
        } else {
            showNotification('没有可复制的文本内容', 'warning');
        }
    });

    // 下一层按钮点击事件
    nextButton.addEventListener('click', function() {
        if (!currentElement) return;
        
        // 先移除旧元素的高亮
        currentElement.classList.remove('text-copier-highlight');
        
        // 查找下一个元素
        const children = Array.from(currentElement.children);
        let nextElement = null;
        
        for (const child of children) {
            if (hasVisibleText(child)) {
                nextElement = child;
                break;
            }
        }
        
        if (nextElement) {
            currentElement = nextElement;
            showElementText(currentElement);
        } else {
            showNotification('已到达最底层');
            // 如果没有下层了，1秒后移除当前高亮
            setTimeout(() => {
                if (currentElement) {
                    currentElement.classList.remove('text-copier-highlight');
                }
            }, 1000);
        }
    });

    // 关闭按钮点击事件
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
        if (currentElement) {
            currentElement.classList.remove('text-copier-highlight');
            currentElement = null;
        }
        clickHistory = [];
    });

    // 显示通知
    function showNotification(message, type = 'info') {
        // 移除之前的通知
        const oldNotification = document.getElementById('text-copier-custom-notification');
        if (oldNotification) oldNotification.remove();

        // 创建新通知
        const notification = document.createElement('div');
        notification.id = 'text-copier-custom-notification';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '10000';
        notification.style.transition = 'opacity 0.3s';
        notification.style.maxWidth = '80%';
        notification.style.textAlign = 'center';
        
        // 根据类型设置样式
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#4CAF50';
                notification.style.color = 'white';
                break;
            case 'error':
                notification.style.backgroundColor = '#f44336';
                notification.style.color = 'white';
                break;
            case 'warning':
                notification.style.backgroundColor = '#FF9800';
                notification.style.color = 'white';
                break;
            default:
                notification.style.backgroundColor = '#2196F3';
                notification.style.color = 'white';
        }
        
        document.body.appendChild(notification);
        
        // 自动消失
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 300);
    }

    // 检查元素是否有可见文本
    function hasVisibleText(element) {
        if (!element) return false;
        
        // 检查元素是否可见
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
            return false;
        }
        
        // 检查是否有直接文本内容
        if (element.textContent.trim()) {
            return true;
        }
        
        // 检查是否有子元素包含文本
        for (const child of element.children) {
            if (hasVisibleText(child)) {
                return true;
            }
        }
        
        return false;
    }

    // 显示元素的文本内容
    function showElementText(element) {
        if (!element) return;
        
        // 移除之前的高亮
        if (currentElement) {
            currentElement.classList.remove('text-copier-highlight');
        }
        
        currentElement = element;
        currentElement.classList.add('text-copier-highlight');
        
        // 获取文本内容（限制最大长度）
        let text = element.textContent.trim();
        
        // 如果文本为空，尝试获取其他属性
        if (!text) {
            text = element.value || element.getAttribute('placeholder') || 
                   element.getAttribute('aria-label') || element.getAttribute('title') || '';
            text = text.trim();
        }
        
        // 显示在模态框中
        modalContent.textContent = text || '未找到文本内容';
        modal.style.display = 'block';
        
        // 记录点击历史
        clickHistory.push({
            element: element,
            position: getElementPosition(element),
            text: text
        });
    }
    
    // 获取元素在页面中的位置
    function getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
            width: rect.width,
            height: rect.height
        };
    }

    // 退出选择模式
    function exitSelectionMode() {
        isSelecting = false;
        mainButton.textContent = '获取文本';
        mainButton.style.backgroundColor = '#4CAF50';
        
        // 恢复光标样式
        document.body.style.cursor = '';
        document.querySelectorAll('*').forEach(el => {
            el.style.cursor = '';
        });
    }

    // 页面点击事件处理
    document.addEventListener('click', function(e) {
        if (!isSelecting) return;
        
        // 如果点击的是我们的按钮或模态框，则不处理
        if (e.target.closest('#text-copier-container') || e.target.closest('#text-copier-modal')) {
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        // 获取点击元素
        const target = e.target;
        showElementText(target);
        
        // 退出选择模式
        exitSelectionMode();
    }, true);
})();