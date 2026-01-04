// ==UserScript==
// @name         chat.z.ai 添加上下箭头导航
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在指定元素下添加上下箭头，用于导航到同class的兄弟节点
// @author       You
// @match        *://chat.z.ai/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553984/chatzai%20%E6%B7%BB%E5%8A%A0%E4%B8%8A%E4%B8%8B%E7%AE%AD%E5%A4%B4%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/553984/chatzai%20%E6%B7%BB%E5%8A%A0%E4%B8%8A%E4%B8%8B%E7%AE%AD%E5%A4%B4%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('箭头导航脚本已加载');
    GM_addStyle(`
        .nav-arrow-container {
            position: relative;
            margin-bottom: 5px;
        }

        .nav-arrows {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 5px;
            z-index: 1000;
        }

        .nav-arrow {
            width: 30px;
            height: 30px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }

        .nav-arrow:hover {
            background-color: rgba(0, 0, 0, 0.9);
        }

        .nav-arrow.disabled {
            background-color: rgba(0, 0, 0, 0.3);
            cursor: not-allowed;
        }

        /* 强制显示滚动条样式 */
        *::-webkit-scrollbar {
            width: 12px !important;
            height: 12px !important;
            display: block !important;
        }

        *::-webkit-scrollbar-track {
            background: #f1f1f1 !important;
            border-radius: 6px !important;
        }

        *::-webkit-scrollbar-thumb {
            background: #c1c1c1 !important;
            border-radius: 6px !important;
        }

        *::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8 !important;
        }

        * {
            scrollbar-width: auto !important;
        }

        .scrollbar-hidden,
        .scrollbar-none {
            scrollbar-width: auto !important;
        }

        .scrollbar-hidden::-webkit-scrollbar,
        .scrollbar-none::-webkit-scrollbar {
            display: block !important;
            width: 12px !important;
            height: 12px !important;
        }

        html, body {
            overflow: auto !important;
            scrollbar-width: auto !important;
        }

        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
            display: block !important;
            width: 12px !important;
        }
    `);

    // 目标元素选择器 - 请根据实际情况修改
    const selector = '#messages-container > div > div > div > div.w-full > div';
    let isInitializing = false; // 防止重复初始化
    let lastInitTime = 0;
    const MIN_INIT_INTERVAL = 1000; // 最小初始化间隔(ms)

    // 清除现有的箭头
    function clearExistingArrows() {
        const arrows = document.querySelectorAll('.nav-arrow-container');
        arrows.forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
    }

    // 等待页面加载完成
    function waitForElements() {
        // 防止短时间内多次执行
        const now = Date.now();
        if (now - lastInitTime < MIN_INIT_INTERVAL) {
            return;
        }
        lastInitTime = now;

        if (isInitializing) return;
        isInitializing = true;

        // 清除现有箭头
        clearExistingArrows();

        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            isInitializing = false;
            setTimeout(waitForElements, 500);
            return;
        }

        // 为每个元素添加导航箭头
        elements.forEach((element, index) => {
            // 这里保留了原有的偶数索引过滤逻辑，如有需要可修改
            if ((index % 2) !== 0) {
                return;
            }

            if (!element || !element.parentNode) {
                return;
            }

            // 创建箭头容器
            const arrowContainer = document.createElement('div');
            arrowContainer.className = 'nav-arrow-container';

            // 创建箭头包装器
            const arrowsWrapper = document.createElement('div');
            arrowsWrapper.className = 'nav-arrows';

            // 创建上箭头
            const upArrow = document.createElement('div');
            upArrow.className = 'nav-arrow';
            upArrow.innerHTML = '↑';
            upArrow.title = '上一个';

            // 创建下箭头
            const downArrow = document.createElement('div');
            downArrow.className = 'nav-arrow';
            downArrow.innerHTML = '↓';
            downArrow.title = '下一个';

            // 添加点击事件
            upArrow.addEventListener('click', function() {
                const prevIndex = findPreviousValidIndex(index, elements);
                if (prevIndex !== -1) {
                    elements[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });

            downArrow.addEventListener('click', function() {
                const nextIndex = findNextValidIndex(index, elements);
                if (nextIndex !== -1) {
                    elements[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'end' });
                }
            });

            // 添加箭头到包装器
            arrowsWrapper.appendChild(upArrow);
            arrowsWrapper.appendChild(downArrow);

            // 添加包装器到容器
            arrowContainer.appendChild(arrowsWrapper);

            // 将容器插入到元素后面
            try {
                element.parentNode.insertBefore(arrowContainer, element.nextSibling);
            } catch (e) {
                console.error('插入箭头容器错误:', e);
            }

            // 更新箭头状态
            updateArrowStates(index, elements, upArrow, downArrow);
        });

        isInitializing = false;
    }

    // 查找上一个有效的索引（考虑过滤逻辑）
    function findPreviousValidIndex(currentIndex, elements) {
        for (let i = currentIndex - 1; i >= 0; i--) {
            if (i % 2 === 0) { // 只考虑偶数索引
                return i;
            }
        }
        return -1;
    }

    // 查找下一个有效的索引（考虑过滤逻辑）
    function findNextValidIndex(currentIndex, elements) {
        for (let i = currentIndex + 1; i < elements.length; i++) {
            if (i % 2 === 0) { // 只考虑偶数索引
                return i;
            }
        }
        return -1;
    }

    // 更新单个箭头状态
    function updateArrowStates(index, elements, upArrow, downArrow) {
        if (!upArrow || !downArrow) return;

        const prevIndex = findPreviousValidIndex(index, elements);
        const nextIndex = findNextValidIndex(index, elements);

        if (prevIndex === -1) {
            upArrow.classList.add('disabled');
        } else {
            upArrow.classList.remove('disabled');
        }

        if (nextIndex === -1) {
            downArrow.classList.add('disabled');
        } else {
            downArrow.classList.remove('disabled');
        }
    }

    // 初始化函数
    function init() {
        if (!isInitializing) {
            waitForElements();
        }
    }

    // 监听URL变化
    let currentUrl = window.location.href;
    const urlChangeHandler = () => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            console.log('URL已变化，重新初始化:', currentUrl);
            init();
        }
    };

    // 监听History API变化
    window.addEventListener('popstate', urlChangeHandler);

    // 重写pushState和replaceState方法以捕获SPA路由变化
    (function(history) {
        const pushState = history.pushState;
        history.pushState = function() {
            const result = pushState.apply(history, arguments);
            urlChangeHandler();
            return result;
        };

        const replaceState = history.replaceState;
        history.replaceState = function() {
            const result = replaceState.apply(history, arguments);
            urlChangeHandler();
            return result;
        };
    })(window.history);

    // 监听hashchange事件
    window.addEventListener('hashchange', urlChangeHandler);

    // 防抖处理函数
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // 优化的DOM变化监听
    const debouncedInit = debounce(() => {
        console.log('DOM变化，准备重新初始化');
        init();
    }, 500); // 500ms防抖延迟

    // 尝试获取目标元素的父容器，缩小监听范围
    let targetContainer = document.querySelector('#messages-container') || document.body;

    // 监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        let shouldUpdate = false;

        // 检查是否有相关元素被添加或移除
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                // 检查是否有匹配选择器的元素被添加
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && node.matches(selector) ||
                            node.querySelector && node.querySelector(selector)) {
                            shouldUpdate = true;
                            break;
                        }
                    }
                }

                // 检查是否有匹配选择器的元素被移除
                if (!shouldUpdate) {
                    for (const node of mutation.removedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches && node.matches(selector) ||
                                node.querySelector && node.querySelector(selector)) {
                                shouldUpdate = true;
                                break;
                            }
                        }
                    }
                }
            }
        });

        if (shouldUpdate) {
            debouncedInit();
        }
    });

    // 开始观察（限制范围和观察选项）
    observer.observe(targetContainer, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 初始化
    init();
})();