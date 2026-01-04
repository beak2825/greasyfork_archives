// ==UserScript==
// @name         法治平台自动阅读
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动切换选项卡，打开未读内容并自动关闭
// @author       Coralfox
// @match        https://lawplatform.chinaunicom.cn/*
// @match        https://aiportal.chinaunicom.cn/page/modules/index/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558598/%E6%B3%95%E6%B2%BB%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/558598/%E6%B3%95%E6%B2%BB%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 直接使用console.log，避免GM_log的异步问题
    const log = console.log.bind(console);

    // 控制变量
    let isRunning = false;
    let mainLoop = null;
    const specificUrlCloseDelay = 15000; // 特定URL关闭延迟时间，15秒

    // 等待完成处理，确保一次只处理一个标签页
    async function waitForTabProcessing() {
        log(`等待 ${specificUrlCloseDelay/1000} 秒后处理下一个标签页`);
        await new Promise(resolve => setTimeout(resolve, specificUrlCloseDelay));
    }

    // 直接通过DOM添加样式，避免GM_addStyle的异步问题
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #auto-read-button-container {
                position: fixed;
                top: 50px;
                right: 50px;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                background: rgba(255, 255, 255, 0.95);
                padding: 10px;
                border-radius: 10px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            }

            #auto-read-toggle-button {
                padding: 15px 30px;
                font-size: 18px;
                font-weight: bold;
                color: white;
                background-color: #1890ff;
                border: 3px solid #40a9ff;
                border-radius: 12px;
                cursor: pointer;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
                min-width: 150px;
                text-align: center;
                display: block;
                visibility: visible;
            }

            #auto-read-toggle-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
            }

            #auto-read-toggle-button.running {
                background-color: #ff4d4f;
                border-color: #ff7875;
            }
        `;
        document.head.appendChild(style);
    }

    // 等待元素加载完成
    function waitForElement(selector, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const interval = 500;
            let elapsed = 0;
            let timeoutId = null;

            const checkElement = () => {
                // 检查是否需要停止
                if (!isRunning) {
                    clearTimeout(timeoutId);
                    reject(new Error('脚本已停止'));
                    return;
                }

                const element = document.querySelector(selector);
                if (element) {
                    clearTimeout(timeoutId);
                    resolve(element);
                } else if (elapsed >= timeout) {
                    clearTimeout(timeoutId);
                    reject(new Error(`Element not found: ${selector}`));
                } else {
                    elapsed += interval;
                    timeoutId = setTimeout(checkElement, interval);
                }
            };

            timeoutId = setTimeout(checkElement, 0);
        });
    }

    // 等待多个元素加载完成
    function waitForElements(selector, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const interval = 500;
            let elapsed = 0;
            let timeoutId = null;

            const checkElements = () => {
                // 检查是否需要停止
                if (!isRunning) {
                    clearTimeout(timeoutId);
                    reject(new Error('脚本已停止'));
                    return;
                }

                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    clearTimeout(timeoutId);
                    resolve(elements);
                } else if (elapsed >= timeout) {
                    clearTimeout(timeoutId);
                    reject(new Error(`Elements not found: ${selector}`));
                } else {
                    elapsed += interval;
                    timeoutId = setTimeout(checkElements, interval);
                }
            };

            timeoutId = setTimeout(checkElements, 0);
        });
    }

    // 切换选项卡
    async function switchTab(tabElement) {
        tabElement.click();
        // 等待选项卡内容加载
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 检查是否为未读
    function isUnread(headerElement) {
        const readDiv = headerElement.querySelector('div');
        return !readDiv || readDiv.textContent !== '已读';
    }

    // 移除了旧的标签页数量等待逻辑，改为直接等待15秒

    // 打开链接并自动关闭
    async function openAndCloseLink(linkElement) {
        // 避免直接输出DOM元素，防止循环引用错误
        log('开始处理链接元素');

        // 确保linkElement是DOM元素
        if (!linkElement || typeof linkElement !== 'object') {
            log('无效的链接元素');
            await waitForTabProcessing();
            return;
        }

        // 尝试多种方式获取链接
        let link = linkElement.href;
        log('直接获取href:', link || '未找到');

        // 如果没有href属性，尝试查找子元素中的链接
        if (!link) {
            const anchorTag = linkElement.querySelector('a[href]');
            if (anchorTag) {
                link = anchorTag.href;
                log('从子元素获取到链接:', link);
            }
        }

        // 直接获取元素的onclick事件
        if (!link) {
            log('未找到href属性，尝试模拟点击');
            // 尝试模拟点击
            try {
                linkElement.click();
                log('已模拟点击元素');
                // 短暂等待，确保点击生效
                await new Promise(resolve => setTimeout(resolve, 1000));
                await waitForTabProcessing();
                return;
            } catch (e) {
                log('模拟点击失败:', e.message || e);
                await waitForTabProcessing();
                return;
            }
        }

        if (!link) {
            log('无法获取链接地址');
            await waitForTabProcessing();
            return;
        }

        log('获取到链接地址:', link);

        if (!isRunning) {
            await waitForTabProcessing();
            return;
        }

        // 尝试打开新标签页（后台打开）
        log('尝试打开标签页...');
        let newTab = null;

        try {
            // 尝试后台打开标签页
            newTab = window.open(link, '_blank', 'noopener,noreferrer');

            // 立即将焦点返回到原页面
            if (newTab && window.focus) {
                window.focus();
                log('已将焦点返回原页面');
            }
        } catch (e) {
            log('打开标签页时出错:', e);
        }

        if (!newTab) {
            log('无法打开新标签页，可能被浏览器阻止');
            log('请检查浏览器弹出窗口设置，允许该网站弹出窗口');

            // 尝试另一种方式打开
            try {
                // 创建一个临时a标签并点击，添加rel属性尝试后台打开
                const tempLink = document.createElement('a');
                tempLink.href = link;
                tempLink.target = '_blank';
                tempLink.rel = 'noopener noreferrer';
                tempLink.style.display = 'none';
                document.body.appendChild(tempLink);

                // 使用dispatchEvent模拟点击，可能支持更多浏览器
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                tempLink.dispatchEvent(clickEvent);

                document.body.removeChild(tempLink);
                log('已尝试通过临时a标签打开');

                // 短暂等待，确保标签页打开
                await new Promise(resolve => setTimeout(resolve, 500));

                // 等待15秒后处理下一个标签页
                await waitForTabProcessing();
                return;
            } catch (e) {
                log('通过临时a标签打开也失败:', e);
                // 即使打开失败，也等待15秒后再处理下一个
                await waitForTabProcessing();
                return;
            }
        }

        // 标签页将由特定URL自动关闭机制处理

        // 短暂等待，确保标签页打开
        await new Promise(resolve => setTimeout(resolve, 500));

        // 等待15秒后处理下一个标签页
        await waitForTabProcessing();
    }

    // 点击下一页
    async function goToNextPage() {
        const nextPageBtn = document.querySelector('.ant-pagination-next');
        if (nextPageBtn && !nextPageBtn.classList.contains('ant-pagination-disabled')) {
            nextPageBtn.click();
            // 等待页面加载
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }
        return false;
    }

    // 主函数
    async function main() {
        try {
            isRunning = true;
            updateButtonState();

            log('脚本开始执行');

            // 等待左侧选项卡加载
            const tabs = await waitForElements('.publicity-more-left-cart-column-list-item ');

            // 遍历所有选项卡
            for (let i = 0; i < tabs.length && isRunning; i++) {
                const tab = tabs[i];
                log(`切换到选项卡 ${i + 1}/${tabs.length}`);
                await switchTab(tab);

                let hasMorePages = true;
                let noUnreadCount = 0; // 连续未找到未读内容的页数
                const maxNoUnreadPages = 3; // 最大连续未找到未读内容的页数

                while (hasMorePages && isRunning && noUnreadCount < maxNoUnreadPages) {
                    // 等待右侧列表项加载
                    let headers = await waitForElements('.publicity-more-right-cart-list-header');
                    let foundUnread = false;

                    // 遍历所有列表头，确保处理每个未读项
                    for (let j = 0; j < headers.length && isRunning; j++) {
                        const header = headers[j];
                        log(`检查列表项 ${j + 1}/${headers.length}`);

                        if (isUnread(header)) {
                            foundUnread = true;
                            log(`找到未读内容 (${j + 1}/${headers.length})，正在打开...`);
                            await openAndCloseLink(header);
                            // 不再立即break，继续处理下一个
                            // 但需要重新获取列表，因为页面可能已更新
                            noUnreadCount = 0; // 重置连续未找到计数

                            // 短暂等待，确保页面更新
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            // 重新获取列表，继续处理
                            headers = await waitForElements('.publicity-more-right-cart-list-header');
                            j = -1; // 重置循环索引，重新开始遍历
                            log('列表已更新，重新开始遍历');
                        }
                    }

                    if (!isRunning) break;

                    if (!foundUnread) {
                        // 没有未读内容，前往下一页
                        noUnreadCount++;
                        log(`当前页没有未读内容，连续未读页数: ${noUnreadCount}/${maxNoUnreadPages}，尝试前往下一页`);
                        hasMorePages = await goToNextPage();

                        // 如果下一页按钮不可用，重置计数
                        if (!hasMorePages) {
                            log('已到达最后一页');
                            break;
                        }
                    } else {
                        // 找到未读内容，继续在当前页查找
                        // 等待页面更新
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }

                if (noUnreadCount >= maxNoUnreadPages) {
                    log(`连续${maxNoUnreadPages}页未找到未读内容，切换到下一选项卡`);
                }
            }

            if (isRunning) {
                log('所有内容处理完成');
            } else {
                log('脚本已停止');
            }
        } catch (error) {
            if (error.message !== '脚本已停止') {
                log('脚本执行出错:', error);
            }
        } finally {
            isRunning = false;
            if (mainLoop) {
                clearTimeout(mainLoop);
                mainLoop = null;
            }
            log('脚本停止');
            updateButtonState();
        }
    }

    // 创建悬浮按钮
    function createFloatingButton() {
        log('尝试创建悬浮按钮');

        // 检查按钮是否已存在
        let buttonContainer = document.getElementById('auto-read-button-container');
        let toggleButton;

        if (buttonContainer) {
            // 按钮已存在，获取现有按钮
            log('按钮容器已存在，更新按钮状态');
            toggleButton = document.getElementById('auto-read-toggle-button');
        } else {
            // 创建新的按钮容器
            buttonContainer = document.createElement('div');
            buttonContainer.id = 'auto-read-button-container';

            // 创建开始/停止按钮
            toggleButton = document.createElement('button');
            toggleButton.id = 'auto-read-toggle-button';
            toggleButton.textContent = '开始阅读';

            // 添加点击事件（使用简单的函数赋值，避免事件监听器问题）
            toggleButton.onclick = handleButtonClick;

            buttonContainer.appendChild(toggleButton);
            document.body.appendChild(buttonContainer);
            log('按钮已创建并添加到页面');
        }

        // 更新按钮状态
        updateButtonState();
        log('按钮创建/更新完成');
    }

    // 按钮点击处理函数
    function handleButtonClick() {
        log('按钮被点击，当前状态:', isRunning);
        if (isRunning) {
            // 停止脚本
            isRunning = false;
            if (mainLoop) {
                clearTimeout(mainLoop);
                mainLoop = null;
            }
            log('脚本已停止');
        } else {
            // 开始脚本
            log('开始执行脚本');
            mainLoop = setTimeout(main, 100);
        }
        updateButtonState();
    }

    // 更新按钮状态
    function updateButtonState() {
        log('更新按钮状态，当前运行状态:', isRunning);

        const toggleButton = document.getElementById('auto-read-toggle-button');

        if (toggleButton) {
            // 更新按钮文本和样式
            toggleButton.textContent = isRunning ? '停止阅读' : '开始阅读';
            if (isRunning) {
                toggleButton.classList.add('running');
            } else {
                toggleButton.classList.remove('running');
            }
            log('按钮状态已更新');
        } else {
            log('按钮不存在，尝试重新创建');
            // 如果按钮不存在，重新创建
            createFloatingButton();
        }
    }

    // 特定URL自动关闭机制
    function setupSpecificUrlAutoClose() {
        // 监听窗口打开事件
        log('设置特定URL自动关闭机制');

        // 重写window.open，监听新打开的窗口
        const originalOpen = window.open;
        window.open = function(url, target, features) {
            const newWindow = originalOpen.apply(this, arguments);

            // 检查是否为我们要处理的URL
            if (newWindow && typeof url === 'string' && url.includes('lawplatform.chinaunicom.cn')) {
                log(`检测到新打开的窗口，URL: ${url}`);

                // 定期检查窗口URL
                const checkInterval = setInterval(() => {
                    try {
                        if (newWindow.closed) {
                            clearInterval(checkInterval);
                            return;
                        }

                        const currentUrl = newWindow.location.href;
                        log(`检查窗口URL: ${currentUrl}`);

                        // 如果URL匹配特定模式，15秒后关闭
                        if (currentUrl.includes('/publicity/operationsManagement/review/index')) {
                            log('匹配到特定URL，15秒后自动关闭');
                            clearInterval(checkInterval);

                            // 15秒后关闭窗口
                            setTimeout(() => {
                                if (!newWindow.closed) {
                                    try {
                                        newWindow.close();
                                        log('特定URL窗口已关闭');
                                    } catch (e) {
                                        log('关闭特定URL窗口时出错:', e);
                                    }
                                }
                                // 不再需要减少计数，因为已改为顺序处理
                            }, specificUrlCloseDelay);
                        }
                    } catch (e) {
                        // 跨域访问会抛出异常，忽略
                    }
                }, 1000);
            }

            return newWindow;
        };

        // 同时检查当前已打开的窗口
        setTimeout(() => {
            try {
                const windows = window.open('', '_self').window.frames;
                // 注意：由于同源策略限制，可能无法访问其他窗口
            } catch (e) {
                log('检查已打开窗口时出错:', e);
            }
        }, 2000);
    }

    // 初始化函数
    function init() {
        log('自动阅读脚本初始化');
        // 添加样式
        addStyles();
        // 设置特定URL自动关闭机制
        setupSpecificUrlAutoClose();
        // 直接创建按钮，不使用事件监听器
        createFloatingButton();
    }

    // 普法学习提示功能
    function initStudyPrompt() {
        // 检查当前URL
        const currentUrl = window.location.href;
        if (!currentUrl.includes('aiportal.chinaunicom.cn/page/modules/index/index.html')) {
            return;
        }

        // 检查今天是否已经提示过
        const today = new Date().toDateString();
        const lastPromptDate = localStorage.getItem('studyPromptLastDate');

        if (lastPromptDate === today) {
            log('今天已经提示过学习普法，不再显示');
            return;
        }

        // 创建菜单容器
        const menuContainer = document.createElement('div');
        menuContainer.id = 'study-prompt-menu';
        menuContainer.style.cssText = `
            position: fixed;
            top: 50px;
            right: 50px;
            z-index: 999999;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            font-family: Arial, sans-serif;
            min-width: 300px;
        `;

        // 创建菜单内容
        const menuContent = `
            <div style="margin-bottom: 15px; font-weight: bold; font-size: 16px;">是否已经学习普法？</div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="study-prompt-close" style="
                    padding: 8px 16px;
                    background: #f0f0f0;
                    border: 1px solid #d9d9d9;
                    border-radius: 4px;
                    cursor: pointer;
                ">关闭</button>
                <button id="study-prompt-confirm" style="
                    padding: 8px 16px;
                    background: #1890ff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">确定</button>
                <button id="study-prompt-learn" style="
                    padding: 8px 16px;
                    background: #52c41a;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">学习</button>
            </div>
        `;

        menuContainer.innerHTML = menuContent;
        document.body.appendChild(menuContainer);

        // 添加事件监听器
        document.getElementById('study-prompt-close').addEventListener('click', () => {
            menuContainer.remove();
            log('已关闭普法学习提示');
        });

        document.getElementById('study-prompt-confirm').addEventListener('click', () => {
            // 保存今天的日期，当天不再提示
            localStorage.setItem('studyPromptLastDate', today);
            menuContainer.remove();
            log('已确认学习普法，当天不再提示');
        });

        document.getElementById('study-prompt-learn').addEventListener('click', () => {
            // 不保存日期，下次仍然提示

            // 打开两个新标签页
            window.open('https://lawplatform.chinaunicom.cn/web/#/work/points', '_blank');
            window.open('https://lawplatform.chinaunicom.cn/web/#/publicityPage/more/index', '_blank');

            menuContainer.remove();
            log('已打开学习页面，下次访问仍会提示');
        });

        log('已显示普法学习提示菜单');
    }

    // 初始化函数
    function init() {
        log('自动阅读脚本初始化');
        // 添加样式
        addStyles();

        // 检查是否为智慧门户页面，添加普法学习提示
        initStudyPrompt();

        // 如果是法治平台页面，创建悬浮按钮
        if (window.location.href.includes('lawplatform.chinaunicom.cn')) {
            createFloatingButton();
        }
    }

    // 页面加载完成后执行初始化
    // 使用setTimeout替代事件监听器，避免异步响应问题
    setTimeout(init, 1000);
})();