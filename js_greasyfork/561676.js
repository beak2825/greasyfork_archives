// ==UserScript==
// @name         如遇繁花/叔叔不约脚本
// @namespace    http://tampermonkey.net/
// @version      11.0
// @description  ny小雨 微信：gyyh67
// @author       雨心
// @run-at       document-body
// @match        *://*.shushubuyue.*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @license      MIT
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/561676/%E5%A6%82%E9%81%87%E7%B9%81%E8%8A%B1%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/561676/%E5%A6%82%E9%81%87%E7%B9%81%E8%8A%B1%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        CHECK_INTERVAL: 2000,
        POPUP_DISPLAY_TIME: 1500,
        FORCE_CONFIRM_KEYWORDS: ['确认', '确定', '离开', '退出', '确认离开', '确认退出', '确定离开', '确定退出'],
        FORCE_CONFIRM_DELAY: 300,
        FORCE_CONFIRM_REPEAT: 4,
        SCRIPT_MARK: 'ssby-ultimate-script',
        MALE_KEYWORDS: ['男', '男生'],
        FEMALE_KEYWORDS: ['女', '女生'],
        BUTTON_SELECTORS: {
            REMATCH: ['.rematch-btn', '.re-match', 'button:contains("重新匹配")', 'button:contains("再试一次")', '[data-action="rematch"]', '.match-again'],
            LEAVE: ['.leave-btn', '.exit-btn', 'button:contains("离开")', 'button:contains("退出")', '[data-action="leave"]', '.quit-btn']
        }
    };

    let isRunning = false;
    let leaveClickCount = 0; 
    let totalRunCount = 0;
    let checkTimer = null;
    let customMaleKeywords = [];
    let isControlsHidden = false;

    GM_addStyle(`
        /* 强制提示框 */
        #${CONFIG.SCRIPT_MARK}-toast {
            position: fixed !important;
            top: 20px !important;
            left: 20px !important;
            background: #165DFF !important;
            color: white !important;
            padding: 12px 20px !important;
            border-radius: 6px !important;
            font-size: 14px !important;
            font-weight: bold !important;
            z-index: 2147483647 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            border: 2px solid white !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }
        #${CONFIG.SCRIPT_MARK}-toast-close {
            position: absolute !important;
            top: -8px !important;
            right: -8px !important;
            width: 20px !important;
            height: 20px !important;
            border-radius: 50% !important;
            background: red !important;
            color: white !important;
            border: none !important;
            font-size: 12px !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /* 独立悬浮功能按钮 */
        .${CONFIG.SCRIPT_MARK}-button {
            position: fixed !important;
            right: 20px !important;
            width: 48px !important;
            height: 48px !important;
            border-radius: 50% !important;
            border: none !important;
            color: white !important;
            font-size: 14px !important;
            font-weight: bold !important;
            cursor: pointer !important;
            z-index: 2147483646 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            pointer-events: auto !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        #${CONFIG.SCRIPT_MARK}-start {
            top: 20px !important;
            background: #36D399 !important;
        }
        #${CONFIG.SCRIPT_MARK}-stop {
            top: 80px !important;
            background: #F87272 !important;
        }
        #${CONFIG.SCRIPT_MARK}-reset {
            top: 140px !important;
            background: #FF9F43 !important;
        }
        #${CONFIG.SCRIPT_MARK}-toggle-controls {
            top: 200px !important;
            background: #9F6BFF !important;
        }

        /* 关键词输入框 + 统计信息 */
        #${CONFIG.SCRIPT_MARK}-keyword-input,
        #${CONFIG.SCRIPT_MARK}-keyword-add,
        #${CONFIG.SCRIPT_MARK}-stats {
            position: fixed !important;
            z-index: 2147483645 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        #${CONFIG.SCRIPT_MARK}-keyword-input {
            top: 80px !important;
            left: 20px !important;
            width: 200px !important;
            padding: 8px 12px !important;
            border: 2px solid #165DFF !important;
            border-radius: 6px !important;
        }
        #${CONFIG.SCRIPT_MARK}-keyword-add {
            top: 80px !important;
            left: 230px !important;
            padding: 8px 12px !important;
            background: #165DFF !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            font-size: 14px !important;
            cursor: pointer !important;
        }
        #${CONFIG.SCRIPT_MARK}-stats {
            top: 120px !important;
            left: 20px !important;
            background: white !important;
            padding: 8px 12px !important;
            border: 2px solid #165DFF !important;
            border-radius: 6px !important;
            font-size: 12px !important;
        }

        /* 控件隐藏状态 */
        .${CONFIG.SCRIPT_MARK}-controls-hidden #${CONFIG.SCRIPT_MARK}-keyword-input,
        .${CONFIG.SCRIPT_MARK}-controls-hidden #${CONFIG.SCRIPT_MARK}-keyword-add,
        .${CONFIG.SCRIPT_MARK}-controls-hidden #${CONFIG.SCRIPT_MARK}-stats,
        .${CONFIG.SCRIPT_MARK}-controls-hidden #${CONFIG.SCRIPT_MARK}-start,
        .${CONFIG.SCRIPT_MARK}-controls-hidden #${CONFIG.SCRIPT_MARK}-stop,
        .${CONFIG.SCRIPT_MARK}-controls-hidden #${CONFIG.SCRIPT_MARK}-reset {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
        .${CONFIG.SCRIPT_MARK}-controls-hidden #${CONFIG.SCRIPT_MARK}-toggle-controls,
        .${CONFIG.SCRIPT_MARK}-controls-hidden #${CONFIG.SCRIPT_MARK}-toast {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
    `);

    function isScriptElement(el) {
        return el.id && el.id.startsWith(CONFIG.SCRIPT_MARK) || el.className && el.className.includes(CONFIG.SCRIPT_MARK);
    }

    function isScriptElementOrParent(el) {
        let current = el;
        while (current && current !== document.body) {
            if (isScriptElement(current)) return true;
            current = current.parentElement;
        }
        return false;
    }

    function isElementVisible(el) {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && el.offsetWidth > 0 && el.offsetHeight > 0;
    }

    function findButton(selectors) {
        for (const selector of selectors) {
            try {
                const elements = document.querySelectorAll(selector);
                for (const el of elements) {
                    if (isElementVisible(el) && !isScriptElementOrParent(el)) return el;
                }
            } catch (e) {}
        }
        return null;
    }

    function clickButton(el) {
        if (!el || !isElementVisible(el) || isScriptElementOrParent(el)) return false;
        try {
            el.scrollIntoView({ behavior: 'instant', block: 'nearest' });
            el.removeAttribute('disabled');
            el.style.pointerEvents = 'auto';
            el.click();
            const rect = el.getBoundingClientRect();
            el.dispatchEvent(new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            }));
            return true; 
        } catch (e) {
            return false;
        }
    }

    function forceClickAllConfirm() {
        const click = () => {
            let count = 0;
            document.querySelectorAll('*').forEach(el => {
                if (isScriptElementOrParent(el) || !isElementVisible(el)) return;
                const text = el.textContent.trim().toLowerCase();
                if (text === '') return;
                if (CONFIG.FORCE_CONFIRM_KEYWORDS.some(k => text.includes(k.toLowerCase()))) {
                    try {
                        el.style.pointerEvents = 'auto';
                        el.click();
                        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                        count++;
                    } catch (e) {}
                }
            });
            showToast(`哞：点击了 ${count} 个牛牛`);
        };
        click();
        for (let i = 1; i < CONFIG.FORCE_CONFIRM_REPEAT; i++) {
            setTimeout(click, CONFIG.FORCE_CONFIRM_DELAY * i);
        }
    }

    function createToast() {
        let toast = document.getElementById(`${CONFIG.SCRIPT_MARK}-toast`);
        if (toast) return toast;

        toast = document.createElement('div');
        toast.id = `${CONFIG.SCRIPT_MARK}-toast`;
        toast.textContent = '牛牛已加载';

        const closeBtn = document.createElement('button');
        closeBtn.id = `${CONFIG.SCRIPT_MARK}-toast-close`;
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => {
            toast.style.display = 'none';
        });
        toast.appendChild(closeBtn);

        document.body.appendChild(toast);
        return toast;
    }

    function showToast(message) {
        const toast = createToast();
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            if (toast.textContent === message) {
                toast.style.display = 'none';
            }
        }, CONFIG.POPUP_DISPLAY_TIME);
    }

    function toggleControls() {
        isControlsHidden = !isControlsHidden;
        const body = document.body;
        if (isControlsHidden) {
            body.classList.add(`${CONFIG.SCRIPT_MARK}-controls-hidden`);
            showToast('已隐藏所有控件');
        } else {
            body.classList.remove(`${CONFIG.SCRIPT_MARK}-controls-hidden`);
            showToast('已显示所有控件');
        }
        const toggleBtn = document.getElementById(`${CONFIG.SCRIPT_MARK}-toggle-controls`);
        if (toggleBtn) {
            toggleBtn.textContent = isControlsHidden ? '显' : '隐';
        }
    }

    function addMaleKeyword(keyword) {
        if (!keyword || keyword.trim() === '') return;
        keyword = keyword.trim();
        if (customMaleKeywords.includes(keyword)) return;
        customMaleKeywords.push(keyword);
        showToast(`添加关键词：${keyword}`);
        updateStats();
    }

    function isMaleDetected() {
        const allKeywords = [...CONFIG.MALE_KEYWORDS, ...customMaleKeywords];
        if (allKeywords.length === 0) return false;
        return Array.from(document.querySelectorAll('*')).some(el => {
            if (isScriptElementOrParent(el) || !isElementVisible(el)) return false;
            const text = el.textContent.trim().toLowerCase();
            return allKeywords.some(k => text.includes(k.toLowerCase()));
        });
    }

    function isFemaleDetected() {
        return Array.from(document.querySelectorAll('*')).some(el => {
            if (isScriptElementOrParent(el) || !isElementVisible(el)) return false;
            const text = el.textContent.trim().toLowerCase();
            return CONFIG.FEMALE_KEYWORDS.some(k => text.includes(k.toLowerCase()));
        });
    }

    function coreLogic() {
        totalRunCount++;
        updateStats();

        const rematchBtn = findButton(CONFIG.BUTTON_SELECTORS.REMATCH);
        if (rematchBtn) clickButton(rematchBtn);

        setTimeout(() => {
            if (isFemaleDetected()) {
                stopScript();
                showToast('检测到女生，脚本停止');
                return;
            }

            if (isMaleDetected()) {
                showToast('检测到男生，准备点击离开'); 

                const leaveBtn = findButton(CONFIG.BUTTON_SELECTORS.LEAVE);
                if (leaveBtn) {
                    
                    const clickSuccess = clickButton(leaveBtn);
                    if (clickSuccess) {
                        leaveClickCount++; 
                        updateStats();
                        showToast(`点击离开成功 累计：${leaveClickCount} 次`); 
let leaveChatBtn = findButton(['button:contains("离开聊天")']);
if (leaveChatBtn) {
    const chatClickSuccess = clickButton(leaveChatBtn);
    if (chatClickSuccess) {
        showToast('点击离开聊天成功');
    }
}                        setTimeout(forceClickAllConfirm, CONFIG.FORCE_CONFIRM_DELAY);
                    } else {
                        showToast('检测到男生，但点击离开按钮失败');
                    }
                } else {
                    showToast('检测到男生，但未找到离开按钮');
                }
            }
        }, 1000);
    }

    function startScript() {
        if (isRunning) return;
        isRunning = true;
        checkTimer = setInterval(coreLogic, CONFIG.CHECK_INTERVAL);
        coreLogic();
        showToast('脚本启动成功');
        updateButtonStates();
    }

    function stopScript() {
        if (!isRunning) return;
        isRunning = false;
        clearInterval(checkTimer);
        checkTimer = null;
        showToast('脚本停止成功');
        updateButtonStates();
    }

    function resetStats() {
        leaveClickCount = 0; 
        totalRunCount = 0;
        updateStats();
        showToast('统计已重置');
    }

    function updateButtonStates() {
        const startBtn = document.getElementById(`${CONFIG.SCRIPT_MARK}-start`);
        const stopBtn = document.getElementById(`${CONFIG.SCRIPT_MARK}-stop`);
        if (startBtn) startBtn.disabled = isRunning;
        if (stopBtn) stopBtn.disabled = !isRunning;
    }

    function updateStats() {
        const stats = document.getElementById(`${CONFIG.SCRIPT_MARK}-stats`);
        if (stats) {
            
            stats.textContent = `运行次数：${totalRunCount} | 匹配到男生：${leaveClickCount} | 离开关键词：${[...CONFIG.MALE_KEYWORDS, ...customMaleKeywords].join(', ')}`;
        }
    }

    function createAllElements() {
        // 1. 提示框
        createToast();

        // 2. 功能按钮
        const buttons = [
            { id: 'start', text: '启动', click: startScript },
            { id: 'stop', text: '停止', click: stopScript },
            { id: 'reset', text: '重置', click: resetStats },
            { id: 'toggle-controls', text: '隐', click: toggleControls }
        ];
        buttons.forEach(btn => {
            let element = document.getElementById(`${CONFIG.SCRIPT_MARK}-${btn.id}`);
            if (!element) {
                element = document.createElement('button');
                element.id = `${CONFIG.SCRIPT_MARK}-${btn.id}`;
                element.className = `${CONFIG.SCRIPT_MARK}-button`;
                element.textContent = btn.text;
                element.addEventListener('click', btn.click);
                document.body.appendChild(element);
            }
        });

        // 3. 关键词输入框
        let keywordInput = document.getElementById(`${CONFIG.SCRIPT_MARK}-keyword-input`);
        if (!keywordInput) {
            keywordInput = document.createElement('input');
            keywordInput.id = `${CONFIG.SCRIPT_MARK}-keyword-input`;
            keywordInput.placeholder = '输入屏蔽关键词，回车添加';
            keywordInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    addMaleKeyword(keywordInput.value);
                    keywordInput.value = '';
                }
            });
            document.body.appendChild(keywordInput);
        }

        // 4. 关键词添加按钮
        let keywordAdd = document.getElementById(`${CONFIG.SCRIPT_MARK}-keyword-add`);
        if (!keywordAdd) {
            keywordAdd = document.createElement('button');
            keywordAdd.id = `${CONFIG.SCRIPT_MARK}-keyword-add`;
            keywordAdd.textContent = '添加关键词';
            keywordAdd.addEventListener('click', () => {
                addMaleKeyword(keywordInput.value);
                keywordInput.value = '';
            });
            document.body.appendChild(keywordAdd);
        }

        // 5. 统计信息
        let stats = document.getElementById(`${CONFIG.SCRIPT_MARK}-stats`);
        if (!stats) {
            stats = document.createElement('div');
            stats.id = `${CONFIG.SCRIPT_MARK}-stats`;
            document.body.appendChild(stats);
        }

        updateStats();
        updateButtonStates();
    }

    function init() {
        createAllElements();
        showToast('ny于雨心 交流q群：915815587');

        totalRunCount = GM_getValue(`${CONFIG.SCRIPT_MARK}-total`, 0);
        leaveClickCount = GM_getValue(`${CONFIG.SCRIPT_MARK}-leave-count`, 0); 
        customMaleKeywords = GM_getValue(`${CONFIG.SCRIPT_MARK}-keywords`, []);
        updateStats();


        window.addEventListener('beforeunload', () => {
            GM_setValue(`${CONFIG.SCRIPT_MARK}-total`, totalRunCount);
            GM_setValue(`${CONFIG.SCRIPT_MARK}-leave-count`, leaveClickCount); 
            GM_setValue(`${CONFIG.SCRIPT_MARK}-keywords`, customMaleKeywords);
        });
    }

    
    init();

})();