// ==UserScript==
// @name         Google AI Studio Helper
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  整合了“从此处删除”、“HTML预览(已修复)”和“自动中文输出”三大功能，全面提升 Google AI Studio 使用体验。
// @author       Chris_C
// @match        *://aistudio.google.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549116/Google%20AI%20Studio%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/549116/Google%20AI%20Studio%20Helper.meta.js
// ==/UserScript==


/**
 * 模块一：自动添加“中文输出”指令
 */
(function() {
    'use strict';

    // --- 配置常量 ---
    // 聊天回合元素的选择器
    const CHAT_TURN_SELECTOR = 'ms-chat-turn';
    // 选项按钮的选择器（支持中英文）
    const OPTIONS_BUTTON_SELECTOR = 'button[aria-label="Open options"], button[aria-label="打开选项"]';
    // 聊天会话容器的选择器
    const CHAT_SESSION_SELECTOR = 'ms-chat-session';
    // --- 配置结束 ---

    console.log('AI Studio Delete Script: Initializing (v2.0)');

    /**
     * 快速删除函数
     * @param {Element} turnElement - 要删除的回合元素
     * @returns {Promise<boolean>} 删除是否成功
     */
    async function directDelete(turnElement) {
        if (!turnElement) {
            const turns = document.querySelectorAll(CHAT_TURN_SELECTOR);
            turnElement = turns[turns.length - 1];
        }
        
        if (!turnElement) return false;
        
        const optionsBtn = turnElement.querySelector('button[aria-label="Open options"]');
        if (!optionsBtn) return false;
        
        return new Promise(resolve => {
            // 监听菜单出现
            const observer = new MutationObserver(() => {
                const menu = document.querySelector('.cdk-overlay-pane');
                if (menu) {
                    const deleteBtn = Array.from(menu.querySelectorAll('button'))
                        .find(btn => btn.textContent?.toLowerCase().includes('delete'));
                    
                    if (deleteBtn) {
                        deleteBtn.click();
                        observer.disconnect();
                        // 快速检查删除结果
                        setTimeout(() => resolve(!document.contains(turnElement)), 200);
                    }
                }
            });
            
            observer.observe(document.body, {childList: true, subtree: true});
            optionsBtn.click();
            
            // 超时处理
            setTimeout(() => {observer.disconnect(); resolve(false);}, 1000);
        });
    }

    /**
     * 执行删除操作的异步函数（原始方法作为备用）
     * @param {Element} turnElement - 要删除的对话回合元素
     * @returns {Promise<Object>} 返回删除操作的结果
     */
    async function performDeleteAction(turnElement) {
        return new Promise(resolve => {
            // 查找当前回合的选项按钮
            const optionsButton = turnElement.querySelector(OPTIONS_BUTTON_SELECTOR);
            if (!optionsButton) {
                console.warn('Delete action failed: Options button not found on a turn.', turnElement);
                resolve({ success: false });
                return;
            }

            // 创建观察器来监听菜单的出现
            const menuObserver = new MutationObserver((mutations, observer) => {
                // 查找弹出的菜单面板
                const menuPanel = document.querySelector('.cdk-overlay-pane, [role="menu"]');
                if (menuPanel) {
                    // 等待菜单内容完全加载
                    setTimeout(() => {
                        observer.disconnect(); // 停止观察
                    
                    // 获取菜单中的所有可点击元素
                    const allButtons = Array.from(menuPanel.querySelectorAll('button, [role="menuitem"], .mat-menu-item'));
                    console.log('Found menu items:', allButtons.map(btn => ({
                        text: btn.textContent?.trim(),
                        ariaLabel: btn.getAttribute('aria-label'),
                        className: btn.className
                    })));
                    
                    // 查找删除按钮（支持中英文，更宽泛的匹配）
                    const deleteButton = allButtons.find(btn => {
                        const text = (btn.textContent || '').trim().toLowerCase();
                        const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
                        const title = (btn.getAttribute('title') || '').toLowerCase();
                        
                        // 检查各种可能的删除相关文本
                        const deleteKeywords = ['delete', '删除', 'remove', '移除', 'trash', '垃圾', 'del'];
                        return deleteKeywords.some(keyword => 
                            text.includes(keyword) || 
                            ariaLabel.includes(keyword) || 
                            title.includes(keyword)
                        ) || btn.querySelector('svg, mat-icon, .material-icons')?.textContent?.includes('delete');
                    });
                    
                    if (deleteButton) {
                        console.log('Found delete button, clicking it.');
                        deleteButton.click();
                        // 点击后等待一段时间确保操作完成
                        setTimeout(() => resolve({ success: true }), 800);
                    } else {
                        console.warn('Could not find the "Delete" button in the menu.');
                        console.log('Available menu items:', allButtons.map(btn => btn.textContent?.trim()));
                        
                        // 尝试使用键盘快捷键删除
                        try {
                            // 关闭菜单
                            document.body.click();
                            // 选中当前回合
                            turnElement.click();
                            // 等待一下然后按Delete键
                            setTimeout(() => {
                                const deleteEvent = new KeyboardEvent('keydown', {
                                    key: 'Delete',
                                    code: 'Delete',
                                    keyCode: 46,
                                    which: 46,
                                    bubbles: true
                                });
                                document.dispatchEvent(deleteEvent);
                                setTimeout(() => resolve({ success: true }), 500);
                            }, 200);
                        } catch(e) {
                            console.error('Keyboard shortcut failed:', e);
                            // 检查是否为最后一个回合
                            const currentTurnCount = document.querySelectorAll(CHAT_TURN_SELECTOR).length;
                            resolve({ success: false, isLastTurn: currentTurnCount === 1, reason: 'no_delete_button' });
                        }
                    }
                    }, 300); // 等待300ms让菜单内容完全加载
                }
            });

            // 开始观察 DOM 变化以检测菜单出现
            menuObserver.observe(document.body, { childList: true, subtree: true });
            // 点击选项按钮打开菜单
            optionsButton.click();

            // 设置超时处理，防止无限等待
            setTimeout(() => {
                menuObserver.disconnect();
                console.warn('Menu detection timeout');
                resolve({ success: false, error: 'timeout' }); 
            }, 3000);
        });
    }

    /**
     * 为聊天回合添加"从此处删除"按钮
     * @param {Element} chatTurn - 聊天回合元素
     */
    function addDeleteFromHereButton(chatTurn) {
        const optionsButton = chatTurn.querySelector(OPTIONS_BUTTON_SELECTOR);
        // 如果没有选项按钮或已经添加过删除按钮，则跳过
        if (!optionsButton || chatTurn.querySelector('.delete-from-here-btn')) return;

        const btnContainer = optionsButton.parentElement;
        if (!btnContainer) return;

        // 创建删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-from-here-btn';
        deleteBtn.textContent = '❌'; // 垃圾桶图标
        deleteBtn.title = 'Delete From Here (Delete this and all subsequent turns)';
        // 设置按钮样式（完全匹配其他按钮）
        deleteBtn.className = optionsButton.className.replace('mat-mdc-menu-trigger', 'delete-from-here-btn');
        
        // 复制所有计算样式
        const optionsStyle = getComputedStyle(optionsButton);
        Object.assign(deleteBtn.style, {
            background: 'none',
            border: 'none', 
            cursor: 'pointer',
            opacity: '0.6',
            fontSize: '14px',
            transition: 'opacity 0.2s',
            marginRight: '4px',
            // 完全匹配选项按钮的样式
            padding: optionsStyle.padding,
            height: optionsStyle.height,
            width: optionsStyle.width,
            minWidth: optionsStyle.minWidth,
            minHeight: optionsStyle.minHeight,
            display: optionsStyle.display,
            alignItems: optionsStyle.alignItems,
            justifyContent: optionsStyle.justifyContent,
            lineHeight: optionsStyle.lineHeight,
            boxSizing: optionsStyle.boxSizing,
            verticalAlign: optionsStyle.verticalAlign,
            flexShrink: optionsStyle.flexShrink,
            flexGrow: optionsStyle.flexGrow,
            alignSelf: optionsStyle.alignSelf
        });

        // 添加鼠标悬停效果
        deleteBtn.addEventListener('mouseenter', () => deleteBtn.style.opacity = '1');
        deleteBtn.addEventListener('mouseleave', () => deleteBtn.style.opacity = '0.6');

        // 添加点击事件处理器
        deleteBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 确认删除操作
            if (!confirm('确定要删除此回合及之后的所有对话吗？\nAre you sure you want to delete this and all subsequent turns?')) return;

            // 获取所有聊天回合
            const allTurns = Array.from(document.querySelectorAll(CHAT_TURN_SELECTOR));
            const currentIndex = allTurns.indexOf(chatTurn);

            if (currentIndex > -1) {
                // 计算需要删除的回合数量
                const turnsToDeleteCount = allTurns.length - currentIndex;
                console.log(`Planning to delete ${turnsToDeleteCount} turns.`);

                // 从最后一个回合开始逐个删除
                for (let i = 0; i < turnsToDeleteCount; i++) {
                    // 重新获取当前的回合列表（因为删除操作会改变 DOM）
                    const currentTurns = Array.from(document.querySelectorAll(CHAT_TURN_SELECTOR));
                    const turnToDelete = currentTurns[currentTurns.length - 1]; // 总是删除最后一个

                    if (turnToDelete) {
                        // 高亮显示即将删除的回合
                        turnToDelete.style.backgroundColor = 'rgba(255, 100, 100, 0.2)';
                        // 使用直接删除方法
                        const directSuccess = await directDelete(turnToDelete);
                        const result = directSuccess ? { success: true } : { success: false };
                        
                        // 如果删除失败，检查原因并处理
                        if (!result.success) {
                            console.log(`删除第 ${i + 1} 个回合失败，原因:`, result);
                            
                            // 检查是否是最后一个回合
                            const remainingTurns = Array.from(document.querySelectorAll(CHAT_TURN_SELECTOR));
                            if (remainingTurns.length === 1) {
                                alert(`无法删除最后一个会话：这是 Google AI Studio 自身的限制。\n\n已成功删除 ${i} 个回合。`);
                                turnToDelete.style.backgroundColor = ''; // 清除红色高亮
                                break; // 停止删除过程
                            } else if (result.reason === 'no_delete_button') {
                                // UI变化导致找不到删除按钮
                                alert(`检测到 Google AI Studio 界面变化，无法找到删除按钮。\n请手动删除或等待脚本更新。\n\n已成功删除 ${i} 个回合。`);
                                turnToDelete.style.backgroundColor = ''; // 清除红色高亮
                                break;
                            } else {
                                // 其他原因导致的失败
                                console.warn('删除操作失败，停止批量删除');
                                turnToDelete.style.backgroundColor = ''; // 清除红色高亮
                                break;
                            }
                        } else {
                            console.log(`成功删除第 ${i + 1} 个回合`);
                            // 快速等待DOM更新
                            await new Promise(resolve => setTimeout(resolve, 300));
                        }
                    } else {
                        console.warn("Could not find a turn to delete. Stopping.");
                        break;
                    }
                }
                console.log('Deletion process finished.');
            }
        });

        // 确保父容器有足够宽度横排显示按钮
        Object.assign(btnContainer.style, {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '4px',
            minWidth: 'auto',
            width: 'auto',
            flexShrink: '0'
        });

        // 将删除按钮插入到选项按钮之前
        btnContainer.insertBefore(deleteBtn, optionsButton);
    }

    /**
     * 处理所有聊天回合，为每个回合添加删除按钮
     */
    function processAllTurns() {
        document.querySelectorAll(CHAT_TURN_SELECTOR).forEach(addDeleteFromHereButton);
    }

    // --- 增强的启动逻辑 ---
    let currentObserver = null;
    
    function initializeScript() {
        const chatSession = document.querySelector(CHAT_SESSION_SELECTOR);
        if (chatSession) {
            console.log('AI Studio Delete Script: Chat session found, initializing.');
            
            // 停止之前的观察器
            if (currentObserver) {
                currentObserver.disconnect();
            }
            
            // 处理现有回合
            processAllTurns();

            // 创建新的观察器
            currentObserver = new MutationObserver(() => {
                setTimeout(processAllTurns, 200);
            });

            // 观察聊天会话变化
            currentObserver.observe(chatSession, { childList: true, subtree: true });
            console.log('AI Studio Delete Script: Observer started.');
            return true;
        }
        return false;
    }
    
    // 初始化
    if (!initializeScript()) {
        // 如果初始化失败，定期重试
        const startupInterval = setInterval(() => {
            if (initializeScript()) {
                clearInterval(startupInterval);
            }
        }, 1000);
    }
    
    // 监听页面变化（新会话）
    const pageObserver = new MutationObserver(() => {
        // 检查是否是新会话或页面变化
        if (document.querySelector(CHAT_SESSION_SELECTOR) && !document.querySelector('.delete-from-here-btn')) {
            setTimeout(initializeScript, 500);
        }
    });
    
    pageObserver.observe(document.body, { childList: true, subtree: true });

})();


/**
 * 模块二：自动中文输出功能
 */
(function() {
    'use strict';
    
    let processedTextareas = new WeakSet();
    let isProcessing = false;
    let lastCheck = 0;
    
    function addText() {
        const now = Date.now();
        if (isProcessing || now - lastCheck < 1000) return;
        
        lastCheck = now;
        isProcessing = true;
        
        try {
            let textarea = document.querySelector('textarea[aria-label="System instructions"]');
            
            if (!textarea) {
                const button = document.querySelector('button[aria-label="System instructions"]');
                if (button && !processedTextareas.has(button)) {
                    button.click();
                    processedTextareas.add(button);
                    setTimeout(() => {
                        textarea = document.querySelector('textarea[aria-label="System instructions"]');
                        if (textarea && !textarea.value.includes('中文')) {
                            processTextarea(textarea);
                        }
                        setTimeout(() => {
                            const closeBtn = document.querySelector('button[aria-label="Close system instructions"]');
                            if (closeBtn) closeBtn.click();
                        }, 200);
                        isProcessing = false;
                    }, 100);
                    return;
                }
            } else if (!textarea.value.includes('中文')) {
                processTextarea(textarea);
            }
        } catch (e) {
            console.error('[脚本错误]:', e);
        }
        
        isProcessing = false;
    }
    
    function processTextarea(textarea) {
        if (textarea && !processedTextareas.has(textarea) && !textarea.value.includes('中文')) {
            const text = '你始终用中文输出';
            
            // 模拟真实用户输入
            textarea.focus();
            textarea.click();
            
            // 使用 document.execCommand 或直接设置
            if (document.execCommand) {
                textarea.value += (textarea.value ? '\n' : '') + text;
                document.execCommand('insertText', false, '');
            } else {
                textarea.value += (textarea.value ? '\n' : '') + text;
            }
            
            // 触发多种事件
            ['focus', 'input', 'change', 'blur', 'keyup'].forEach(eventType => {
                textarea.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
            });
            
            // 模拟键盘输入
            textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            textarea.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
            
            processedTextareas.add(textarea);
            console.log('[脚本] 已添加中文输出指令:', textarea.value);
        }
    }
    
    const observer = new MutationObserver(() => {
        if (!isProcessing) addText();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    addText();
    setInterval(() => {
        if (!isProcessing) addText();
    }, 3000);
})();


/**
 * 模块三：HTML 预览功能
 */
(function () {
    'use strict';
    // 定义一个全局唯一的策略对象
    if (window.myHtmlPreviewPolicy === undefined) {
        window.myHtmlPreviewPolicy = null;
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            try {
                window.myHtmlPreviewPolicy = trustedTypes.createPolicy('html-preview-policy#userscript', {
                    createHTML: input => input,
                });
            } catch (e) {
                // 如果策略已存在 (例如脚本被注入两次)，这会报错，但我们可以忽略
                console.warn("Trusted Types 策略 'html-preview-policy#userscript' 可能已存在。");
            }
        }
    }

    /**
     * 【关键修复】使用 document.createElement 安全地创建模态窗口
     */
    function createModal() {
        if (document.getElementById('html-preview-modal')) return;

        const modalContainer = document.createElement('div');
        modalContainer.id = 'html-preview-modal';

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); z-index: 10000; display: none; align-items: center; justify-content: center;`;

        const content = document.createElement('div');
        content.className = 'modal-content';
        content.style.cssText = `background: white; border-radius: 8px; width: 90%; height: 90%; max-width: 1200px; display: flex; flex-direction: column; box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);`;

        const header = document.createElement('div');
        header.className = 'modal-header';
        header.style.cssText = `padding: 16px; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; color: #333;`;

        const title = document.createElement('h3');
        title.textContent = 'HTML 预览';
        title.style.cssText = 'margin: 0; font-family: sans-serif;';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.textContent = '×';
        closeBtn.title = '关闭 (Esc)';
        closeBtn.style.cssText = `background: none; border: none; font-size: 28px; cursor: pointer; color: #666; padding: 0 8px; line-height: 1;`;

        const iframe = document.createElement('iframe');
        iframe.className = 'preview-frame';
        iframe.style.cssText = 'width: 100%; flex-grow: 1; border: none;';

        header.appendChild(title);
        header.appendChild(closeBtn);
        content.appendChild(header);
        content.appendChild(iframe);
        overlay.appendChild(content);
        modalContainer.appendChild(overlay);
        document.body.appendChild(modalContainer);

        function closeModal() {
            overlay.style.display = 'none';
            iframe.srcdoc = '';
        }
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.style.display === 'flex') closeModal(); });
    }

    function showPreview(htmlContent) {
        const modal = document.getElementById('html-preview-modal');
        if (!modal) return;
        const overlay = modal.querySelector('.modal-overlay');
        const iframe = modal.querySelector('.preview-frame');
        const policy = window.myHtmlPreviewPolicy;
        if (policy) {
            iframe.srcdoc = policy.createHTML(htmlContent);
        } else {
            iframe.srcdoc = htmlContent;
        }
        overlay.style.display = 'flex';
    }

    function isHtmlCodeBlock(codeBlock) {
        const titleElement = codeBlock.querySelector('mat-panel-title');
        return titleElement && (titleElement.textContent.toLowerCase().includes('html') || titleElement.textContent.toLowerCase().includes('htm'));
    }

    function addPreviewButton(codeBlock) {
        if (!isHtmlCodeBlock(codeBlock) || codeBlock.querySelector('.html-preview-btn')) return;
        const actionsContainer = codeBlock.querySelector('.actions-container');
        if (!actionsContainer) return;
        const previewBtn = document.createElement('button');
        previewBtn.className = 'html-preview-btn';
        previewBtn.title = '预览 HTML';
        previewBtn.style.cssText = `background: none; border: none; cursor: pointer; padding: 8px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: var(--mat-icon-button-icon-color, currentColor); transition: background-color 0.2s;`;
        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-symbols-outlined notranslate';
        iconSpan.style.fontSize = '20px';
        iconSpan.textContent = 'visibility';
        previewBtn.appendChild(iconSpan);
        previewBtn.addEventListener('mouseenter', () => { previewBtn.style.backgroundColor = 'rgba(0,0,0,0.08)'; });
        previewBtn.addEventListener('mouseleave', () => { previewBtn.style.backgroundColor = 'transparent'; });
        previewBtn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            const codeElement = codeBlock.querySelector('code');
            if (codeElement) showPreview(codeElement.textContent || '');
        });
        actionsContainer.appendChild(previewBtn);
    }

    function processCodeBlocks() {
        document.querySelectorAll('ms-code-block').forEach(addPreviewButton);
    }

    function initializeHtmlPreview() {
        console.log('AI Studio HTML 预览脚本: 初始化...');
        createModal();
        processCodeBlocks();
        const observer = new MutationObserver(processCodeBlocks);
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('AI Studio HTML 预览脚本: 初始化成功。');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHtmlPreview);
    } else {
        initializeHtmlPreview();
    }
})();