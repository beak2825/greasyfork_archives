// ==UserScript==
// @name         Google AI Studio 清空当前对话 (快捷键+自动聚焦版)
// @name:en      Google AI Studio - Clean Chat (Hotkeys & Auto-focus)
// @version      1.1
// @description  每次刷新重置到右下角，支持拖拽，清空后自动聚焦。快捷键：Alt+Delete 或 Alt+C
// @description:en Clears the conversation history in Google AI Studio with a floating button. Includes draggable button, hotkeys (Alt+Delete or Alt+C), and auto-focusing on the input box after clearing.
// @author       w
// @license      MIT
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @namespace https://greasyfork.org/users/1561341
// @downloadURL https://update.greasyfork.org/scripts/562989/Google%20AI%20Studio%20%E6%B8%85%E7%A9%BA%E5%BD%93%E5%89%8D%E5%AF%B9%E8%AF%9D%20%28%E5%BF%AB%E6%8D%B7%E9%94%AE%2B%E8%87%AA%E5%8A%A8%E8%81%9A%E7%84%A6%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562989/Google%20AI%20Studio%20%E6%B8%85%E7%A9%BA%E5%BD%93%E5%89%8D%E5%AF%B9%E8%AF%9D%20%28%E5%BF%AB%E6%8D%B7%E9%94%AE%2B%E8%87%AA%E5%8A%A8%E8%81%9A%E7%84%A6%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局配置 ---
    const CONFIG = {
        hotkeys: ['Delete', 'Backspace', 'KeyC'], // 快捷键 (需配合 Alt)
        focusDelay: 300,                           // 清空后聚焦延迟
        clearLoopDelay: 500,                       // 循环检测延迟
        clickDelay: 100,                           // 菜单弹出的等待时间
        dragThreshold: 3                           // 拖拽防抖阈值 (像素)
    };

    let isClearing = false;
    let mainBtn, btnIcon, btnText;
    let toastNode = null;
    let deletedCount = 0;

    // 拖拽相关变量
    let isMouseDown = false;
    let isDragging = false;
    let dragStartX, dragStartY;
    let initialBtnLeft, initialBtnTop;

    // --- 样式配置 ---
    const BTN_DEFAULT_STYLE = {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: '99999',
        padding: '12px 20px',
        backgroundColor: '#188038',
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        cursor: 'move',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        fontWeight: 'bold',
        fontFamily: 'Google Sans, Roboto, sans-serif',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        userSelect: 'none',
        transition: 'background-color 0.2s, transform 0.1s'
    };

    const TOAST_STYLE = {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '100000',
        padding: '10px 24px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        borderRadius: '24px',
        fontSize: '14px',
        fontFamily: 'Google Sans, Roboto, sans-serif',
        pointerEvents: 'none',
        opacity: '0',
        transition: 'opacity 0.3s',
        whiteSpace: 'nowrap'
    };

    function init() {
        if(document.getElementById('ai-studio-reset-drag-btn')) return;

        // 1. 创建主按钮
        mainBtn = document.createElement('button');
        mainBtn.id = 'ai-studio-reset-drag-btn';
        mainBtn.title = "快捷键 / Hotkey: Alt + Delete / C";

        btnIcon = document.createElement('span');
        btnIcon.textContent = '⚡';
        btnIcon.style.fontSize = '18px';

        btnText = document.createTextNode(' 清空聊天');

        mainBtn.appendChild(btnIcon);
        mainBtn.appendChild(btnText);

        Object.assign(mainBtn.style, BTN_DEFAULT_STYLE);

        // 绑定事件
        mainBtn.addEventListener('mousedown', onMouseDown);
        mainBtn.addEventListener('click', onClick);
        mainBtn.onmouseover = () => { if(!isClearing && !isDragging) mainBtn.style.backgroundColor = '#1e8e3e'; };
        mainBtn.onmouseout = () => { if(!isClearing) mainBtn.style.backgroundColor = '#188038'; };

        document.body.appendChild(mainBtn);

        // 2. 创建提示气泡
        toastNode = document.createElement('div');
        Object.assign(toastNode.style, TOAST_STYLE);
        document.body.appendChild(toastNode);

        // 3. 绑定快捷键
        document.addEventListener('keydown', onKeydown);
    }

    // --- 快捷键逻辑 ---
    function onKeydown(e) {
        if (e.altKey && CONFIG.hotkeys.includes(e.code)) {
            e.preventDefault();
            toggleClearProcess();
        }
    }

    // --- 修复后的拖拽逻辑 (带防抖) ---
    function onMouseDown(e) {
        if (e.button !== 0) return; // 仅左键

        isMouseDown = true;
        isDragging = false; // 重置拖拽状态

        // 记录鼠标初始位置
        dragStartX = e.clientX;
        dragStartY = e.clientY;

        // 记录按钮当前位置 (处理 fixed 定位)
        const rect = mainBtn.getBoundingClientRect();
        initialBtnLeft = rect.left;
        initialBtnTop = rect.top;

        // 绑定移动事件
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        mainBtn.style.transition = 'none'; // 移除过渡，让拖拽更跟手
    }

    function onMouseMove(e) {
        if (!isMouseDown) return;

        // 计算移动距离
        const moveX = e.clientX - dragStartX;
        const moveY = e.clientY - dragStartY;

        // 核心修复：只有移动超过阈值 (3px) 才视为拖拽
        if (!isDragging && Math.hypot(moveX, moveY) < CONFIG.dragThreshold) {
            return;
        }

        isDragging = true; // 确认为拖拽行为
        e.preventDefault();

        // 计算新位置
        let newLeft = initialBtnLeft + moveX;
        let newTop = initialBtnTop + moveY;

        // 边界限制
        const maxLeft = window.innerWidth - mainBtn.offsetWidth;
        const maxTop = window.innerHeight - mainBtn.offsetHeight;
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        // 应用位置
        mainBtn.style.left = newLeft + 'px';
        mainBtn.style.top = newTop + 'px';
        mainBtn.style.bottom = 'auto';
        mainBtn.style.right = 'auto';
    }

    function onMouseUp(e) {
        if (!isMouseDown) return;
        isMouseDown = false;

        // 恢复过渡效果
        mainBtn.style.transition = 'background-color 0.2s, transform 0.1s';

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        // 注意：isDragging 的状态会保留给 onClick 判断
        // onClick 会在 mouseup 之后触发
        setTimeout(() => { isDragging = false; }, 0);
    }

    function onClick(e) {
        // 如果刚才发生了拖拽，则不触发点击功能
        if (isDragging) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return;
        }
        toggleClearProcess();
    }

    function showToast(text, autoHide = false) {
        toastNode.textContent = text;
        toastNode.style.opacity = '1';
        if (autoHide) {
            setTimeout(() => { toastNode.style.opacity = '0'; }, 3000);
        }
    }

    // --- 核心逻辑 ---
    async function toggleClearProcess() {
        if (isClearing) {
            stopClearing("用户停止");
        } else {
            const targets = getSafeButtons();
            if (targets.length === 0) {
                showToast("当前没有可删除的消息 / No messages to delete", true);
                return;
            }
            isClearing = true;
            deletedCount = 0;
            updateUI(true);
            showToast(`🚀 开始清理... (共 ${targets.length} 条)`);
            await runClearLoop();
        }
    }

    function updateUI(active) {
        if (active) {
            mainBtn.style.backgroundColor = '#5f6368';
            btnText.nodeValue = ' 点击停止';
            mainBtn.style.cursor = 'wait';
        } else {
            mainBtn.style.backgroundColor = '#188038';
            btnText.nodeValue = ' 清空聊天';
            mainBtn.style.cursor = 'move';
        }
    }

    function stopClearing(reason) {
        isClearing = false;
        updateUI(false);
        showToast(`✅ 完成！共删除 ${deletedCount} 条消息`, true);
        if (reason === "全部完成") {
            setTimeout(focusInput, CONFIG.focusDelay);
        }
    }

    function focusInput() {
        let inputArea = document.querySelector('textarea[aria-label="Enter a prompt"]') ||
                        document.querySelector('textarea[placeholder="Start typing a prompt"]') ||
                        document.querySelector('.prompt-box-container textarea');
        if (inputArea) {
            inputArea.focus();
        }
    }

    function getSafeButtons() {
        const containers = document.querySelectorAll('ms-chat-turn-options');
        const safeButtons = [];
        containers.forEach(container => {
            const btn = container.querySelector('button');
            if (btn && btn.innerText.includes('more_vert')) {
                safeButtons.push(btn);
            }
        });
        return safeButtons;
    }

    async function runClearLoop() {
        let retryCount = 0;
        while (isClearing) {
            const safeButtons = getSafeButtons();
            if (safeButtons.length === 0) {
                retryCount++;
                if (retryCount >= 2) {
                    stopClearing("全部完成");
                    return;
                }
                await new Promise(r => setTimeout(r, CONFIG.clearLoopDelay));
                continue;
            }
            retryCount = 0;
            const targetBtn = safeButtons[safeButtons.length - 1];
            const success = await deleteOneMessage(targetBtn);
            if (success) {
                deletedCount++;
                showToast(`清理中... 已删除 ${deletedCount} 条`);
                await new Promise(r => setTimeout(r, 300));
            } else {
                await new Promise(r => setTimeout(r, 500));
            }
        }
    }

    // 辅助函数：模拟完整点击事件 (MouseDown -> MouseUp -> Click)
    function simulateClick(element) {
        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
            const event = new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(event);
        });
    }

    async function deleteOneMessage(menuTriggerBtn) {
        try {
            menuTriggerBtn.scrollIntoView({ block: "center", behavior: "instant" });

            // 使用增强版点击
            simulateClick(menuTriggerBtn);

            await new Promise(r => setTimeout(r, CONFIG.clickDelay));

            const xpath = "//button[@role='menuitem']//span[contains(text(), 'Delete')]";
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const deleteOption = result.singleNodeValue ? result.singleNodeValue.closest('button') : null;

            if (deleteOption) {
                simulateClick(deleteOption);
                // 触发 mouseout 确保菜单消失 (有时候菜单会卡住)
                deleteOption.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
                return true;
            } else {
                document.body.click();
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    // --- 初始化 ---
    window.addEventListener('load', () => setTimeout(init, 1500));
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 1500);
        }
    }).observe(document, {subtree: true, childList: true});

})();