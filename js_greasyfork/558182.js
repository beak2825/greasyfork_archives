// ==UserScript==
// @name         工单自动更新
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2025-12-10-12
// @description  运盟工单的自动化操作，协助工作人员简单化操作
// @author       FNG666
// @match        https://gongdan.yonmen.com:17040/index.html*
// @match        https://dolphin.yonmen.com/web/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yonmen.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/558182/%E5%B7%A5%E5%8D%95%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/558182/%E5%B7%A5%E5%8D%95%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const minTime = 3000;
    const maxTime = 5000;
    let refreshTime = generateTime(minTime, maxTime);
    let timer;
    let activeToast = null;

    function getAutoRefreshState() {
        const saved = localStorage.getItem('autoRefreshActive');
        return saved === 'true';
    }

    function setAutoRefreshState(state) {
        localStorage.setItem('autoRefreshActive', state.toString());
        console.log('状态已保存:', state);
    }

    let autoRefreshActive = getAutoRefreshState();

    function clickSearchButton() {
        var elementsWithDataV = document.querySelectorAll('[data-v-3b531349]');
        elementsWithDataV.forEach(function(element) {
            var buttons = element.querySelectorAll('button');
            buttons.forEach(function(button) {
                if (button.classList.contains('search-button')) {
                    button.click();
                }
            });
        });
    }

    function generateTime(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function showToast(message, duration = 4000) {
        if (activeToast) {
            activeToast.remove();
            activeToast = null;
        }

        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.padding = '10px 20px';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toast.style.color = 'white';
        toast.style.borderRadius = '5px';
        toast.style.fontSize = '24px';
        toast.style.zIndex = '9999';
        document.body.appendChild(toast);
        
        activeToast = toast;

        if (duration > 0) {
            setTimeout(() => {
                if (activeToast === toast) {
                    toast.remove();
                    activeToast = null;
                }
            }, duration);
        }
    }

    function resumeTimer() {
        if (timer) return;
        timer = setInterval(clickSearchButton, refreshTime);
        console.log('自动刷新已恢复');
    }

    function pauseTimer() {
        if (timer) {
            clearInterval(timer);
            timer = null;
            console.log('自动刷新已暂停');
        }
    }

    function startAutoRefresh() {
        if (timer) return;
        resumeTimer();
        autoRefreshActive = true;
        setAutoRefreshState(true);
        showToast(`已开启自动更新工单，ctrl+alt+e开启/关闭`);
    }

    function stopAutoRefresh() {
        pauseTimer();
        autoRefreshActive = false;
        setAutoRefreshState(false);
        showToast('已关闭自动更新工单，ctrl+alt+e开启/关闭', 0);
    }


    function initWorkBill() {
        console.log("匹配成功：当前页面是 /app/workBill");
        console.log("当前自动刷新状态:", autoRefreshActive);

        if (autoRefreshActive) {
            resumeTimer();
        } else {
            showToast('未开启自动更新工单！ctrl+alt+e开启/关闭', 0);
            console.log('未开启自动更新工单！ctrl+alt+e开启/关闭');
        }

        const keydownHandler = function (event) {
            if (event.ctrlKey && event.altKey && event.key === 'e') {
                if (!autoRefreshActive) {
                    refreshTime = generateTime(minTime, maxTime);
                    startAutoRefresh();
                } else {
                    stopAutoRefresh();
                }
            }
        };
        document.addEventListener('keydown', keydownHandler);

        const visibilityHandler = function() {
            if (document.visibilityState === 'visible') {
                console.log('页面重新可见，当前状态:', autoRefreshActive);
                if (autoRefreshActive && !timer) {
                    console.log('检测到状态异常，重新启动自动刷新');
                    resumeTimer();
                }
            }
        };
        document.addEventListener('visibilitychange', visibilityHandler);

        return function cleanup() {
            console.log("离开 /app/workBill 页面，执行清理");
            document.removeEventListener('keydown', keydownHandler);
            document.removeEventListener('visibilitychange', visibilityHandler);
            pauseTimer();
            if (activeToast) {
                activeToast.remove();
                activeToast = null;
            }
        };
    }

    function initWorkBillDetail() {
        console.log("匹配成功：当前页面是 /app/workBillDetail");

        function getLicensePlate() {
            const plateElement = Array.from(document.querySelectorAll('.k-form-item-label'))
            .find(label => label.textContent.includes('车头号牌：'))
            ?.closest('.k-form-item')
            ?.querySelector('.form-item-text');
            return plateElement?.textContent?.trim() || null;
        }

        const btn = document.createElement('button');
        btn.id = 'custom-dolphin-btn';
        btn.textContent = '跳转到监控查询';
        document.body.appendChild(btn);

        const clickHandler = function() {
            const licensePlate = getLicensePlate();
            if (licensePlate) {
                console.log('获取到车牌号:', licensePlate);
                GM_setValue('licensePlate', licensePlate);
                GM_setValue('shouldAutoQuery', true);
                window.open('https://dolphin.yonmen.com/web/#/entiremonitor');
            } else {
                alert('未能获取车牌号，请检查页面结构');
                console.error('车牌号元素未找到');
            }
        };
        btn.addEventListener('click', clickHandler);

        return function cleanup() {
            console.log("离开 /app/workBillDetail 页面，执行清理");
            if (btn && btn.parentNode) {
                btn.parentNode.removeChild(btn);
            }
        };
    }

    function initMonitor() {
        console.log("匹配成功：当前页面是 /web/#/entiremonitor");
        
        function handleAutoQuery() {
            try {
                const licensePlate = GM_getValue('licensePlate');
                if (!licensePlate) {
                    throw new Error('未获取到车牌号');
                }

                console.log('开始自动查询流程，车牌号:', licensePlate);

                const searchKeySelect = document.querySelector('.select-wrap .search-key.k-select');
                if (!searchKeySelect) {
                    throw new Error('未找到车牌输入框容器');
                }

                const plateInput = searchKeySelect.querySelector('input.k-select-label[placeholder="请输入车牌号"]');
                if (!plateInput) {
                    throw new Error('未找到车牌输入框');
                }

                console.log('设置车牌号:', licensePlate);
                plateInput.value = licensePlate;

                triggerAllEvents(plateInput);

                waitForDropdownAndClick(licensePlate);

            } catch (e) {
                console.error('自动查询出错:', e);
                retryHandler();
            }
        }

        function waitForDropdownAndClick(licensePlate) {
            let attempts = 0;
            const maxAttempts = 50; // 5秒
            
            const interval = setInterval(() => {
                attempts++;
                
                const items = document.querySelectorAll('.k-select-dropdown:not([style*="display: none"]) .k-select-item');
                let targetItem = null;
                
                for (const item of items) {
                    if (item.textContent.includes(licensePlate) || item.getAttribute('title') === licensePlate || item.querySelector(`[title="${licensePlate}"]`)) {
                        targetItem = item;
                        break;
                    }
                }
                
                if (targetItem) {
                    console.log('找到下拉选项，点击选中:', targetItem.textContent);
                    targetItem.click();
                    clearInterval(interval);
                    
                    setTimeout(clickQueryButton, 500);
                } else {
                    if (attempts >= maxAttempts) {
                        console.log('未找到下拉选项或超时，尝试直接点击查询');
                        clearInterval(interval);
                        clickQueryButton();
                    }
                }
            }, 100);
        }

        function triggerAllEvents(element) {
            const events = ['input', 'change', 'keydown', 'keyup', 'focus', 'blur'];
            events.forEach(eventType => {
                const event = new Event(eventType, { bubbles: true });
                element.dispatchEvent(event);
            });
            console.log('已触发所有必要事件');
        }


        function clickQueryButton() {
            const queryButtons = document.querySelectorAll('.k-button-default span');
            let queryBtn = null;

            queryButtons.forEach(btn => {
                if (btn.textContent.trim() === '查询') {
                    queryBtn = btn.closest('button');
                }
            });

            if (queryBtn) {
                queryBtn.click();
                console.log('已点击查询按钮');
                GM_setValue('shouldAutoQuery', false);
            } else {
                console.error('未找到查询按钮');
                retryHandler();
            }
        }

        function retryHandler() {
            const retryDelay = 3000;
            console.log(`${retryDelay/1000}秒后重试...`);
            setTimeout(handleAutoQuery, retryDelay);
        }

        console.log('页面已加载，等待5秒后开始操作...');
        if (GM_getValue('shouldAutoQuery')) {
            setTimeout(handleAutoQuery, 500);
        } else {
            console.log('未设置自动查询标记，保持初始状态');
        }
    }


    
    let workBillCleanup = null;
    let workBillDetailCleanup = null;

    function router() {
        const hash = window.location.hash;
        const href = window.location.href;

        if (hash === '#/app/workBill' || hash === '#/welcome/index') {
            if (!workBillCleanup) {
                if (workBillDetailCleanup) {
                    workBillDetailCleanup();
                    workBillDetailCleanup = null;
                }
                workBillCleanup = initWorkBill();
            }
        } 
        else if (href.includes('#/app/workBillDetail')) {
            if (!workBillDetailCleanup) {
                if (workBillCleanup) {
                    workBillCleanup();
                    workBillCleanup = null;
                }
                workBillDetailCleanup = initWorkBillDetail();
            }
        } 
        else {
            if (workBillCleanup) {
                workBillCleanup();
                workBillCleanup = null;
            }
            if (workBillDetailCleanup) {
                workBillDetailCleanup();
                workBillDetailCleanup = null;
            }
        }
    }


    window.addEventListener('beforeunload', function () {
        setAutoRefreshState(autoRefreshActive);
        console.log('页面卸载，已保存状态:', autoRefreshActive);
    });

    GM_addStyle(`
        #custom-dolphin-btn {
            position: fixed;
            top: 38.2%;
            left: 1.5%;
            transform: translateY(-50%);
            z-index: 9999;
            padding: 10px 15px;
            background-color: #ec6133;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }
        #custom-dolphin-btn:hover {
            background-color: #ff8355;
        }
    `);

    if (window.location.host.includes('dolphin.yonmen.com')) {
        if (window.location.href.includes('#/entiremonitor')) {
            initMonitor();
        }
    } else {
        setInterval(router, 1000);
        router();
    }

})();
