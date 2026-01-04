// ==UserScript==
// @name         第二课堂活动阅读状态标记
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为第二课堂活动卡片和详情页添加复选框，标记已读活动并持久化存储。
// @author       z17code
// @match        *://hd.chaoxing.com/*
// @match        *://*.chaoxing.com/entry/page/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551408/%E7%AC%AC%E4%BA%8C%E8%AF%BE%E5%A0%82%E6%B4%BB%E5%8A%A8%E9%98%85%E8%AF%BB%E7%8A%B6%E6%80%81%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/551408/%E7%AC%AC%E4%BA%8C%E8%AF%BE%E5%A0%82%E6%B4%BB%E5%8A%A8%E9%98%85%E8%AF%BB%E7%8A%B6%E6%80%81%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储键名，用于在Tampermonkey存储中标识数据
    const readActivitiesKey = 'read_activities_final_fix';
    // 用于跟踪已处理的卡片，避免重复处理
    let processedCards = new Set();

    // 添加全局样式 - 使用更简单的自定义复选框
    function addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 复选框容器样式，定位在卡片右上角 */
            .activity-read-checkbox-container {
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 1000;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 4px;
                padding: 4px;
                border: 1px solid #ddd;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                cursor: pointer;
            }

            /* 详情页复选框容器样式 */
            .detail-page-checkbox-container {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10000;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 6px;
                padding: 8px;
                border: 1px solid #ddd;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                cursor: pointer;
            }

            /* 使用纯CSS自定义复选框 */
            .activity-read-checkbox {
                width: 18px;
                height: 18px;
                cursor: pointer;
                margin: 0;
                position: relative;
                border: 2px solid #ccc;
                border-radius: 3px;
                background: white;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .detail-page-checkbox {
                width: 22px;
                height: 22px;
            }

            /* 复选框选中状态 */
            .activity-read-checkbox.checked {
                background-color: #1890ff;
                border-color: #1890ff;
            }

            /* 选中后的对勾图标 */
            .activity-read-checkbox.checked::after {
                content: "✓";
                color: white;
                font-size: 14px;
                font-weight: bold;
                position: absolute;
            }

            .detail-page-checkbox.checked::after {
                font-size: 16px;
            }

            /* 已读活动的视觉样式 - 降低不透明度和添加灰度滤镜 */
            .activity-read-marked {
                opacity: 0.6 !important;
                filter: grayscale(80%) !important;
                background-color: #f8f9fa !important;
            }

            /* 按钮容器样式 - 固定在页面顶部 */
            .activity-mark-buttons {
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10000;
                display: flex;
                gap: 10px;
                background: rgba(255, 255, 255, 0.9);
                padding: 8px 12px;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                border: 1px solid #e0e0e0;
            }

            /* 详情页按钮容器样式 - 隐藏清除按钮和标记所有按钮 */
            .detail-page-buttons {
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10000;
                display: flex;
                gap: 10px;
                background: rgba(255, 255, 255, 0.9);
                padding: 8px 12px;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                border: 1px solid #e0e0e0;
            }

            .detail-page-buttons .activity-mark-button.clear,
            .detail-page-buttons .activity-mark-button.mark-all {
                display: none !important;
            }

            .activity-mark-button {
                background: #1890ff;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: background 0.2s;
            }
            .activity-mark-button:hover {
                background: #40a9ff;
            }
            .activity-mark-button.clear {
                background: #ff4d4f;
            }
            .activity-mark-button.clear:hover {
                background: #ff7875;
            }
            .activity-mark-button.mark-all {
                background: #52c41a;
            }
            .activity-mark-button.mark-all:hover {
                background: #73d13d;
            }
        `;
        document.head.appendChild(style);
        console.log('全局样式已注入');
    }

    // 检查当前页面是否为活动详情页
    function isDetailPage() {
        return window.location.href.includes('mh.chaoxing.com/entry/page/');
    }

    // 从存储中获取已读活动列表
    function getReadActivities() {
        return GM_getValue(readActivitiesKey, []);
    }

    // 将活动标记为已读并存储
    function markAsRead(activityId) {
        const readActivities = getReadActivities();
        if (!readActivities.includes(activityId)) {
            readActivities.push(activityId);
            GM_setValue(readActivitiesKey, readActivities);
            console.log(`已标记活动为已读: ${activityId}`);
            return true;
        }
        return false;
    }

    // 取消活动的已读标记
    function markAsUnread(activityId) {
        const readActivities = getReadActivities();
        const index = readActivities.indexOf(activityId);
        if (index > -1) {
            readActivities.splice(index, 1);
            GM_setValue(readActivitiesKey, readActivities);
            console.log(`已取消活动标记: ${activityId}`);
            return true;
        }
        return false;
    }

    // 清理活动标题，移除多余字符
    function cleanActivityTitle(title) {
        if (!title) return '';

        // 移除常见的后缀和前缀
        let cleaned = title
        .replace(/\s*-\s*超星学习通$/, '')
        .replace(/\s*-\s*第二课堂$/, '')
        .replace(/\s*-\s*活动详情$/, '')
        .replace(/\s*-\s*活动$/, '')
        .replace(/^置顶/, '') // 移除开头的"置顶"字样
        .trim();

        return cleaned;
    }

    // 从详情页获取活动标题
    function getDetailPageTitle() {
        // 直接使用页面标题
        return cleanActivityTitle(document.title);
    }

    // 从列表页卡片获取活动标题
    function getCardTitle(card) {
        // 从标题元素中获取文本，并移除"置顶"字样
        const titleElement = card.querySelector('.card-info .title');
        if (titleElement) {
            // 获取纯文本内容，移除所有HTML标签
            let title = titleElement.textContent || titleElement.innerText;
            return cleanActivityTitle(title);
        }

        return null;
    }

    // 生成活动唯一标识符（统一使用清理后的标题）
    function getActivityIdentifier(card = null) {
        if (isDetailPage()) {
            // 详情页：使用页面标题
            const title = getDetailPageTitle();
            return title || 'unknown_activity';
        } else if (card) {
            // 列表页：使用卡片标题
            const title = getCardTitle(card);
            return title || `card_${Array.from(card.parentNode.children).indexOf(card)}`;
        }

        return 'unknown_activity';
    }

    // 应用已读样式到卡片
    function applyReadStyle(card) {
        card.classList.add('activity-read-marked');
    }

    // 移除卡片的已读样式
    function removeReadStyle(card) {
        card.classList.remove('activity-read-marked');
    }

    // 检查活动是否已被标记为已读
    function isActivityRead(identifier) {
        const readActivities = getReadActivities();
        return readActivities.includes(identifier);
    }

    // 创建自定义复选框元素
    function createCheckbox(card, identifier, isDetailPage = false) {
        const container = document.createElement('div');
        container.className = isDetailPage ? 'detail-page-checkbox-container' : 'activity-read-checkbox-container';

        // 创建自定义复选框（使用div而非input）
        const checkbox = document.createElement('div');
        checkbox.className = isDetailPage ? 'activity-read-checkbox detail-page-checkbox' : 'activity-read-checkbox';
        checkbox.title = isDetailPage ? '标记此活动详情为已读' : '标记为已读';
        checkbox.dataset.activityId = identifier;

        // 根据存储状态初始化复选框状态
        const isRead = isActivityRead(identifier);
        if (isRead) {
            checkbox.classList.add('checked');
            if (!isDetailPage && card) {
                applyReadStyle(card);
            }
            console.log(`初始化: 活动 "${identifier}" 已标记为已读`);
        } else {
            checkbox.classList.remove('checked');
            if (!isDetailPage && card) {
                removeReadStyle(card);
            }
            console.log(`初始化: 活动 "${identifier}" 未标记`);
        }

        // 点击事件处理 - 切换标记状态
        container.addEventListener('click', function(event) {
            event.stopPropagation(); // 阻止事件冒泡，避免触发卡片本身的点击事件
            event.preventDefault();

            const currentlyRead = checkbox.classList.contains('checked');

            if (!currentlyRead) {
                // 标记为已读
                checkbox.classList.add('checked');
                if (!isDetailPage && card) {
                    applyReadStyle(card);
                }
                markAsRead(identifier);
                console.log(`点击后: 活动 "${identifier}" 已标记为已读`);

                // 如果是详情页，显示提示
                if (isDetailPage) {
                    showToast('已标记为已读');
                }
            } else {
                // 取消标记
                checkbox.classList.remove('checked');
                if (!isDetailPage && card) {
                    removeReadStyle(card);
                }
                markAsUnread(identifier);
                console.log(`点击后: 活动 "${identifier}" 已取消标记`);

                // 如果是详情页，显示提示
                if (isDetailPage) {
                    showToast('已取消已读标记');
                }
            }
        });

        container.appendChild(checkbox);
        return container;
    }

    // 显示提示消息（用于详情页）
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: #1890ff;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            z-index: 10001;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 2000);
    }

    // 处理单个活动卡片
    function processCard(card) {
        const identifier = getActivityIdentifier(card);

        // 如果已经处理过，跳过
        if (processedCards.has(identifier)) {
            return;
        }

        // 标记为已处理
        processedCards.add(identifier);

        // 移除可能存在的旧复选框
        const oldCheckbox = card.querySelector('.activity-read-checkbox-container');
        if (oldCheckbox) {
            oldCheckbox.remove();
        }

        // 添加新复选框
        const checkboxContainer = createCheckbox(card, identifier);

        // 确保卡片有相对定位，以便复选框能正确定位
        if (getComputedStyle(card).position === 'static') {
            card.style.position = 'relative';
        }

        card.appendChild(checkboxContainer);
        console.log(`已为活动添加复选框: ${identifier}`);
    }

    // 处理活动详情页
    function processDetailPage() {
        const identifier = getActivityIdentifier();

        if (!identifier || identifier === 'unknown_activity') {
            console.log('无法获取详情页活动标识');
            return;
        }

        // 检查是否已经添加过复选框
        if (document.querySelector('.detail-page-checkbox-container')) {
            return;
        }

        console.log(`处理详情页: ${identifier}`);

        // 创建详情页复选框
        const checkboxContainer = createCheckbox(null, identifier, true);
        document.body.appendChild(checkboxContainer);

        // 标记为已处理
        processedCards.add(identifier);
    }

    // 处理页面中的所有活动卡片
    function processAllCards() {
        const cards = document.querySelectorAll('.card-list ul li');
        console.log(`发现 ${cards.length} 个活动卡片`);

        let newCards = 0;
        cards.forEach(card => {
            const identifier = getActivityIdentifier(card);
            if (identifier && identifier !== 'unknown_activity' && !processedCards.has(identifier)) {
                processCard(card);
                newCards++;
            }
        });

        if (newCards > 0) {
            console.log(`处理了 ${newCards} 个新卡片`);
        }
    }

    // 标记所有当前页面活动为已读
    function markAllAsRead() {
        const cards = document.querySelectorAll('.card-list ul li');
        let markedCount = 0;

        cards.forEach(card => {
            const identifier = getActivityIdentifier(card);
            if (identifier && identifier !== 'unknown_activity') {
                // 如果尚未标记为已读，则标记
                if (!isActivityRead(identifier)) {
                    markAsRead(identifier);
                    markedCount++;

                    // 更新复选框状态
                    const checkbox = card.querySelector('.activity-read-checkbox');
                    if (checkbox) {
                        checkbox.classList.add('checked');
                    }

                    // 应用已读样式
                    applyReadStyle(card);
                }

                // 确保卡片已处理
                if (!processedCards.has(identifier)) {
                    processedCards.add(identifier);
                }
            }
        });

        console.log(`已标记 ${markedCount} 个活动为已读`);
        showToast(`已标记 ${markedCount} 个活动为已读`);
    }

    // 清除所有已读标记
    function clearAllMarks() {
        GM_setValue(readActivitiesKey, []); // 清空存储
        processedCards.clear(); // 清空已处理记录

        // 重新处理所有卡片，重置样式和复选框状态
        const cards = document.querySelectorAll('.card-list ul li');
        cards.forEach(card => {
            const checkbox = card.querySelector('.activity-read-checkbox');
            if (checkbox) {
                checkbox.classList.remove('checked');
            }
            removeReadStyle(card);
        });

        // 如果是详情页，也重置详情页复选框
        if (isDetailPage()) {
            const detailCheckbox = document.querySelector('.detail-page-checkbox');
            if (detailCheckbox) {
                detailCheckbox.classList.remove('checked');
            }
        }

        console.log('已清除所有标记');
        if (isDetailPage()) {
            showToast('已清除所有标记');
        }
    }

    // 创建控制按钮容器
    function createButtonContainer() {
        const buttonContainer = document.createElement('div');

        // 根据页面类型设置不同的CSS类
        if (isDetailPage()) {
            buttonContainer.className = 'detail-page-buttons';
        } else {
            buttonContainer.className = 'activity-mark-buttons';
        }

        // 刷新按钮 - 重新扫描和处理卡片
        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = '刷新活动标记';
        refreshBtn.className = 'activity-mark-button';
        refreshBtn.addEventListener('click', () => {
            processedCards.clear();
            if (isDetailPage()) {
                processDetailPage();
            } else {
                processAllCards();
            }
        });

        // 标记所有按钮 - 将当前页面所有活动标记为已读（仅在列表页显示）
        const markAllBtn = document.createElement('button');
        markAllBtn.textContent = '标记所有为已读';
        markAllBtn.className = 'activity-mark-button mark-all';
        markAllBtn.addEventListener('click', markAllAsRead);

        // 清除按钮 - 清除所有标记（详情页隐藏此按钮）
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清除所有标记';
        clearBtn.className = 'activity-mark-button clear';
        clearBtn.addEventListener('click', clearAllMarks);

        buttonContainer.appendChild(refreshBtn);

        // 只有在列表页才添加标记所有和清除按钮
        if (!isDetailPage()) {
            buttonContainer.appendChild(markAllBtn);
            buttonContainer.appendChild(clearBtn);
        }

        return buttonContainer;
    }

    // 初始化MutationObserver来监听DOM变化
    function initObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // 元素节点
                            // 检查是否添加了卡片相关的内容
                            if (node.classList && (
                                node.classList.contains('card-list') ||
                                node.classList.contains('activity-list') ||
                                node.querySelector('.card-list') ||
                                node.nodeName === 'LI'
                            )) {
                                shouldProcess = true;
                            }
                        }
                    });
                }
            });

            if (shouldProcess) {
                console.log('检测到DOM变化，处理新卡片...');
                setTimeout(processAllCards, 100); // 延迟处理确保DOM完全加载
            }
        });

        // 监听整个文档体的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    // 等待详情页内容加载
    function waitForDetailPageContent() {
        return new Promise((resolve) => {
            const checkContent = () => {
                // 检查页面是否已经加载了实际内容
                const title = document.title;
                if (title && title !== 'document' && !title.includes('Loading')) {
                    resolve();
                } else {
                    setTimeout(checkContent, 500);
                }
            };
            checkContent();
        });
    }

    // 主初始化函数
    async function init() {
        console.log('第二课堂活动标记脚本启动');

        // 注入样式
        addGlobalStyles();

        // 添加按钮容器
        const buttonContainer = createButtonContainer();
        document.body.appendChild(buttonContainer);

        // 根据页面类型进行初始化处理
        if (isDetailPage()) {
            console.log('检测到活动详情页');

            // 等待详情页内容加载完成
            await waitForDetailPageContent();

            // 详情页初始化
            setTimeout(() => {
                processDetailPage();
            }, 1000);
        } else {
            console.log('检测到活动列表页');
            // 列表页初始化
            setTimeout(() => {
                processAllCards();
            }, 1000);

            // 启动观察器监听动态内容
            initObserver();

            // 添加滚动监听，确保动态加载的内容也能被处理
            window.addEventListener('scroll', () => {
                setTimeout(processAllCards, 300);
            });
        }
    }

    // 启动脚本 - 根据页面加载状态决定初始化时机
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();