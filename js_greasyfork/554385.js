// ==UserScript==
// @name         知乎专栏文章点赞过滤器-yuyehk
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  动态过滤知乎专栏中点赞数小于100的文章，支持开始/停止切换，优化UI体验
// @author       Assistant
// @match        https://www.zhihu.com/column/*
// @match        https://zhuanlan.zhihu.com/*
// @grant        none
// @run-at       document-end
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/554385/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E6%96%87%E7%AB%A0%E7%82%B9%E8%B5%9E%E8%BF%87%E6%BB%A4%E5%99%A8-yuyehk.user.js
// @updateURL https://update.greasyfork.org/scripts/554385/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E6%96%87%E7%AB%A0%E7%82%B9%E8%B5%9E%E8%BF%87%E6%BB%A4%E5%99%A8-yuyehk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局状态管理
    let isFilterActive = false;
    let observer = null;
    let processedArticles = new Set(); // 记录已处理的文章

    /**
     * 等待页面元素加载完成
     * @param {string} selector - CSS选择器
     * @param {number} timeout - 超时时间（毫秒）
     * @returns {Promise<Element>} 返回找到的元素
     */
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    /**
     * 创建动态过滤切换按钮
     * @returns {HTMLElement} 返回创建的按钮容器
     */
    function createControlButtons() {
        const container = document.createElement('div');
        container.id = 'zhihu-filter-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        // 动态过滤切换按钮
        const toggleButton = document.createElement('button');
        toggleButton.id = 'zhihu-toggle-btn';
        updateButtonState(toggleButton);

        // 添加点击事件
        toggleButton.addEventListener('click', toggleFilter);

        // 创建状态指示器
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'zhihu-filter-status';
        statusIndicator.style.cssText = `
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 6px;
            font-size: 12px;
            color: #666;
            text-align: center;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
        `;
        statusIndicator.textContent = '过滤器已就绪';

        container.appendChild(toggleButton);
        container.appendChild(statusIndicator);

        return container;
    }

    /**
     * 更新按钮状态和样式
     * @param {HTMLElement} button - 按钮元素
     */
    function updateButtonState(button) {
        const statusIndicator = document.getElementById('zhihu-filter-status');

        if (isFilterActive) {
            button.innerHTML = '⏹️ 停止过滤';
            button.style.cssText = `
                padding: 12px 20px;
                background: linear-gradient(135deg, #dc3545, #c82333);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
                transition: all 0.3s ease;
                min-width: 140px;
                text-align: center;
            `;

            if (statusIndicator) {
                statusIndicator.textContent = '🔴 过滤进行中';
                statusIndicator.style.background = 'rgba(220, 53, 69, 0.1)';
                statusIndicator.style.color = '#dc3545';
            }

            // 悬停效果
            button.onmouseenter = () => {
                button.style.background = 'linear-gradient(135deg, #c82333, #a71e2a)';
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 6px 16px rgba(220, 53, 69, 0.4)';
            };
            button.onmouseleave = () => {
                button.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.3)';
            };
        } else {
            button.innerHTML = '▶️ 开始过滤';
            button.style.cssText = `
                padding: 12px 20px;
                background: linear-gradient(135deg, #28a745, #218838);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
                transition: all 0.3s ease;
                min-width: 140px;
                text-align: center;
            `;

            if (statusIndicator) {
                statusIndicator.textContent = '⚪ 过滤器就绪';
                statusIndicator.style.background = 'rgba(255, 255, 255, 0.95)';
                statusIndicator.style.color = '#666';
            }

            // 悬停效果
            button.onmouseenter = () => {
                button.style.background = 'linear-gradient(135deg, #218838, #1e7e34)';
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 6px 16px rgba(40, 167, 69, 0.4)';
            };
            button.onmouseleave = () => {
                button.style.background = 'linear-gradient(135deg, #28a745, #218838)';
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
            };
        }
    }

    /**
     * 切换过滤状态
     */
    function toggleFilter() {
        isFilterActive = !isFilterActive;

        const button = document.getElementById('zhihu-toggle-btn');
        const statusIndicator = document.getElementById('zhihu-filter-status');

        // 添加按钮点击动画
        if (button) {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);

            updateButtonState(button);
        }

        if (isFilterActive) {
            startDynamicFilter();
            showNotification('动态过滤已开启\n将自动隐藏点赞数小于100的文章', 'success');
        } else {
            stopDynamicFilter();
            showNotification('动态过滤已停止\n所有文章已恢复显示', 'info');
        }
    }

    /**
     * 开始动态过滤
     */
    function startDynamicFilter() {
        console.log('[调试] 开始动态过滤');
        // 首先过滤当前页面的文章
        filterCurrentArticles();

        // 开始监控新文章
        startArticleObserver();
    }

    /**
     * 停止动态过滤
     */
    function stopDynamicFilter() {
        console.log('[调试] 停止动态过滤');
        // 停止监控
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        // 恢复所有隐藏的文章
        restoreAllArticles(false); // 不显示恢复通知

        // 清空已处理文章记录
        processedArticles.clear();
    }

    /**
     * 开始监控新文章
     */
    function startArticleObserver() {
        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver((mutations) => {
            if (!isFilterActive) return;

            let hasNewArticles = false;

            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查是否是文章元素或包含文章元素
                        const articles = findArticlesInNode(node);
                        if (articles.length > 0) {
                            hasNewArticles = true;
                            articles.forEach(article => {
                                if (!processedArticles.has(article)) {
                                    processArticle(article);
                                }
                            });
                        }
                    }
                });
            });

            if (hasNewArticles) {
                console.log('[动态过滤] 检测到新文章，已自动处理');
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('[动态过滤] 文章监控已启动');
    }

    /**
     * 在节点中查找文章元素
     * @param {Element} node - 要搜索的节点
     * @returns {Array} 找到的文章元素数组
     */
    function findArticlesInNode(node) {
        const articleSelectors = [
            '.Post-Main',
            '.ContentItem',
            '.List-item',
            '.Column-item',
            'article',
            '.Post',
            '.css-1voxft1',
            '[data-za-detail-view-element_name="PostItem"]'
        ];

        let articles = [];

        // 检查节点本身是否是文章
        for (const selector of articleSelectors) {
            if (node.matches && node.matches(selector)) {
                articles.push(node);
                break;
            }
        }

        // 查找子节点中的文章
        for (const selector of articleSelectors) {
            const foundArticles = node.querySelectorAll ? node.querySelectorAll(selector) : [];
            articles.push(...foundArticles);
        }

        return articles;
    }

    /**
     * 处理单个文章
     * @param {Element} article - 文章元素
     */
    function processArticle(article) {
        try {
            const likeCount = getArticleLikeCount(article);
            processedArticles.add(article);

            console.log(`[动态过滤] 处理文章: 点赞数 = ${likeCount}`);

            if (likeCount < 100) {
                hideArticle(article, likeCount);
                console.log(`[动态过滤] 隐藏文章，点赞数: ${likeCount}`);
            } else {
                // 确保高赞文章显示
                showArticle(article);
                console.log(`[动态过滤] 保持显示文章，点赞数: ${likeCount}`);
            }
        } catch (error) {
            console.error(`[动态过滤] 处理文章时出错:`, error);
            // 出错时保持文章显示
            showArticle(article);
        }
    }

    /**
     * 过滤当前页面的文章
     */
    function filterCurrentArticles() {
        const articleSelectors = [
            '.Post-Main',
            '.ContentItem',
            '.List-item',
            '.Column-item',
            'article',
            '.Post',
            '.css-1voxft1',
            '[data-za-detail-view-element_name="PostItem"]'
        ];

        let articles = [];

        for (const selector of articleSelectors) {
            articles = document.querySelectorAll(selector);
            if (articles.length > 0) {
                console.log(`[动态过滤] 找到 ${articles.length} 篇文章，使用选择器: ${selector}`);
                break;
            }
        }

        if (articles.length === 0) {
            console.log('[动态过滤] 未找到文章元素');
            return;
        }

        let hiddenCount = 0;
        let processedCount = 0;
        let highLikeCount = 0;

        articles.forEach((article, index) => {
            try {
                const likeCount = getArticleLikeCount(article);
                processedArticles.add(article);
                processedCount++;

                if (likeCount < 100) {
                    hideArticle(article, likeCount);
                    hiddenCount++;
                } else {
                    showArticle(article);
                    highLikeCount++;
                }
            } catch (error) {
                console.error(`[动态过滤] 处理文章 ${index + 1} 时出错:`, error);
                showArticle(article);
            }
        });

        console.log(`[动态过滤] 初始过滤完成: 总数${processedCount}, 隐藏${hiddenCount}, 显示${highLikeCount}`);
    }
    /**
     * 提取点赞数数字
     * @param {string} likeText - 点赞文本
     * @returns {number} 返回点赞数数字
     */
    function extractLikeCount(likeText) {
        if (!likeText) return 0;

        // 移除所有非数字字符，提取数字
        const match = likeText.match(/(\d+(?:\.\d+)?)\s*([万千]?)/);
        if (!match) return 0;

        const number = parseFloat(match[1]);
        const unit = match[2];

        // 处理中文数字单位
        if (unit === '万') {
            return number * 10000;
        } else if (unit === '千') {
            return number * 1000;
        }

        return number;
    }

    /**
     * 获取文章的点赞数
     * @param {Element} article - 文章元素
     * @returns {number} 点赞数
     */
    function getArticleLikeCount(article) {
        // 更全面的点赞元素选择器列表，按优先级排序
        const likeSelectors = [
            // 最常见的点赞按钮选择器
            '.VoteButton--up .VoteButton-label',
            '.VoteButton--up',
            '[data-za-detail-view-element_name="VoteButton"]',
            '.Button--plain .Button-label',
            '.ContentItem-actions .Button--plain',
            '.Post-NormalSub .Button--plain',
            '.ContentItem-action button[aria-label*="赞同"]',
            '.ContentItem-action .Button[aria-label*="赞同"]',
            '.Post-SideActions .VoteButton--up',
            '.Post-SideActions .Button[aria-label*="赞同"]',
            '.RichContent-actions .VoteButton--up',
            '.RichContent-actions .Button[aria-label*="赞同"]',
            // 新版知乎可能的样式
            '.css-1tkz4g7',
            '.css-dvyejn',
            '.VoteButton',
            '.UpVote',
            '.like-button',
            '.vote-up',
            'button[title*="赞同"]',
            'button[aria-label*="赞同"]',
            '.Button[title*="赞同"]',
            '.Button[aria-label*="赞同"]',
            // 通用选择器（优先级较低）
            '*[class*="vote"]:not([class*="down"])',
            '*[class*="like"]',
            '*[class*="up"]:not([class*="down"])'
        ];

        let likeCount = 0;
        let likeElement = null;
        let foundText = '';
        let usedSelector = '';
        let allFoundElements = []; // 记录所有找到的元素用于调试

        console.log(`[调试] 开始分析文章的点赞数...`);

        // 尝试所有选择器
        for (const selector of likeSelectors) {
            try {
                const elements = article.querySelectorAll(selector);
                console.log(`[调试] 选择器 "${selector}" 找到 ${elements.length} 个元素`);

                for (const element of elements) {
                    const text = (element.textContent || element.innerText || '').trim();
                    const ariaLabel = element.getAttribute('aria-label') || '';
                    const title = element.getAttribute('title') || '';
                    const className = element.className || '';

                    // 记录所有找到的元素信息
                    allFoundElements.push({
                        selector: selector,
                        text: text,
                        ariaLabel: ariaLabel,
                        title: title,
                        className: className
                    });

                    console.log(`[调试] 检查元素: 文本="${text}", aria-label="${ariaLabel}", title="${title}", class="${className}"`);

                    // 更严格的点赞元素识别逻辑
                    const isLikeElement = (
                        // 包含赞同相关文本
                        text.includes('赞同') || text.includes('点赞') ||
                        ariaLabel.includes('赞同') || ariaLabel.includes('点赞') ||
                        title.includes('赞同') || title.includes('点赞') ||
                        // 纯数字格式（最可能是点赞数）
                        /^\d+$/.test(text) ||
                        // 带单位的数字格式
                        /^\d+(\.\d+)?[万千kK]$/.test(text) ||
                        // 包含数字但要排除一些明显不是点赞数的情况
                        (/\d+/.test(text) &&
                         !text.includes('评论') &&
                         !text.includes('收藏') &&
                         !text.includes('分享') &&
                         !text.includes('关注') &&
                         !text.includes('粉丝') &&
                         !text.includes('阅读') &&
                         !text.includes('浏览'))
                    );

                    if (isLikeElement) {
                        // 如果是纯数字且长度合理（1-6位），优先选择
                        if (/^\d{1,6}$/.test(text)) {
                            likeElement = element;
                            foundText = text;
                            usedSelector = selector;
                            console.log(`[调试] 找到最佳点赞元素（纯数字）: "${text}"`);
                            break;
                        }
                        // 如果还没找到元素，先记录这个
                        else if (!likeElement) {
                            likeElement = element;
                            foundText = text;
                            usedSelector = selector;
                            console.log(`[调试] 找到候选点赞元素: "${text}"`);
                        }
                    }
                }

                // 如果找到了纯数字的元素，就不再继续查找
                if (likeElement && /^\d{1,6}$/.test(foundText)) {
                    break;
                }
            } catch (error) {
                console.warn(`[调试] 选择器 ${selector} 执行失败:`, error);
                continue;
            }
        }

        // 输出所有找到的元素信息用于调试
        console.log(`[调试] 所有找到的元素:`, allFoundElements);

        if (likeElement) {
            console.log(`[调试] 最终选择的点赞元素: 选择器="${usedSelector}", 文本="${foundText}"`);

            // 处理各种点赞数格式
            if (!foundText || foundText === '赞同' || foundText === '点赞' || foundText === '👍') {
                likeCount = 0; // 无数字显示通常表示0赞
                console.log(`[调试] 识别为0赞文章`);
            } else if (/^\d+$/.test(foundText)) {
                // 纯数字 - 这是最常见和最可靠的格式
                likeCount = parseInt(foundText, 10);
                console.log(`[调试] 纯数字格式: ${foundText} = ${likeCount}`);
            } else if (foundText.includes('万')) {
                // 处理"1.2万"、"12万"等格式
                const match = foundText.match(/([\d.]+)万/);
                if (match) {
                    likeCount = Math.floor(parseFloat(match[1]) * 10000);
                    console.log(`[调试] 万字格式: ${match[1]}万 = ${likeCount}`);
                }
            } else if (foundText.includes('千')) {
                // 处理"1.2千"、"12千"等格式
                const match = foundText.match(/([\d.]+)千/);
                if (match) {
                    likeCount = Math.floor(parseFloat(match[1]) * 1000);
                    console.log(`[调试] 千字格式: ${match[1]}千 = ${likeCount}`);
                }
            } else if (foundText.includes('k') || foundText.includes('K')) {
                // 处理"1.2k"格式
                const match = foundText.match(/([\d.]+)[kK]/);
                if (match) {
                    likeCount = Math.floor(parseFloat(match[1]) * 1000);
                    console.log(`[调试] k格式: ${match[1]}k = ${likeCount}`);
                }
            } else {
                // 提取文本中的数字
                const match = foundText.match(/(\d+(?:\.\d+)?)/);
                if (match) {
                    likeCount = Math.floor(parseFloat(match[1]));
                    console.log(`[调试] 提取数字: ${match[1]} = ${likeCount}`);
                } else {
                    likeCount = 0; // 找不到数字默认为0
                    console.log(`[调试] 无法提取数字，默认为0`);
                }
            }
        } else {
            console.log('[调试] 未找到点赞元素，默认为0赞');
            likeCount = 0;
        }

        console.log(`[调试] ========== 最终点赞数: ${likeCount} ==========`);
        return likeCount;
    }

    /**
     * 完全隐藏文章元素
     * @param {Element} articleElement - 要隐藏的文章元素
     * @param {number} likeCount - 点赞数
     */
    function hideArticle(articleElement, likeCount) {
        // 使用display:none完全隐藏文章
        articleElement.style.display = 'none';

        // 添加标记以便后续恢复
        articleElement.setAttribute('data-zhihu-hidden', 'true');
        articleElement.setAttribute('data-zhihu-likes', likeCount.toString());

        console.log(`隐藏文章: 点赞数 ${likeCount}`);
    }

    /**
     * 显示文章元素
     * @param {Element} articleElement - 要显示的文章元素
     */
    function showArticle(articleElement) {
        // 恢复显示
        articleElement.style.display = '';

        // 移除隐藏标记
        articleElement.removeAttribute('data-zhihu-hidden');
        articleElement.removeAttribute('data-zhihu-likes');
    }

    /**
     * 恢复所有隐藏的文章
     * @param {boolean} showNotif - 是否显示通知
     */
    function restoreAllArticles(showNotif = false) {
        const hiddenArticles = document.querySelectorAll('[data-zhihu-hidden="true"]');
        let restoredCount = 0;

        hiddenArticles.forEach(article => {
            showArticle(article);
            restoredCount++;
        });

        console.log(`恢复显示了 ${restoredCount} 篇文章`);

        if (showNotif && restoredCount > 0) {
            showNotification(`已恢复显示 ${restoredCount} 篇文章`);
        }
    }

    /**
     * 显示通知消息
     * @param {string} message - 要显示的消息
     * @param {string} type - 通知类型 ('success', 'info', 'warning', 'error')
     */
    function showNotification(message, type = 'info') {
        // 移除已存在的通知
        const existingNotification = document.getElementById('zhihu-filter-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 创建通知元素
        const notification = document.createElement('div');
        notification.id = 'zhihu-filter-notification';

        // 根据类型设置颜色和图标
        let backgroundColor, borderColor, textColor, icon;
        switch (type) {
            case 'success':
                backgroundColor = 'linear-gradient(135deg, #28a745, #20c997)';
                borderColor = 'rgba(40, 167, 69, 0.3)';
                textColor = 'white';
                icon = '✅';
                break;
            case 'warning':
                backgroundColor = 'linear-gradient(135deg, #ffc107, #fd7e14)';
                borderColor = 'rgba(255, 193, 7, 0.3)';
                textColor = 'white';
                icon = '⚠️';
                break;
            case 'error':
                backgroundColor = 'linear-gradient(135deg, #dc3545, #e83e8c)';
                borderColor = 'rgba(220, 53, 69, 0.3)';
                textColor = 'white';
                icon = '❌';
                break;
            default: // info
                backgroundColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                borderColor = 'rgba(255,255,255,0.2)';
                textColor = 'white';
                icon = 'ℹ️';
        }

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor};
            color: ${textColor};
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 10001;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            max-width: 350px;
            word-wrap: break-word;
            backdrop-filter: blur(10px);
            border: 1px solid ${borderColor};
            animation: slideInRight 0.3s ease-out;
        `;

        // 添加动画样式
        if (!document.getElementById('zhihu-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'zhihu-notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // 格式化消息显示
        const formattedMessage = message.replace(/\n/g, '<br>');
        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 10px;">
                <div style="font-size: 18px;">${icon}</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 4px;">知乎专栏过滤器</div>
                    <div>${formattedMessage}</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()"
                        style="background: none; border: none; color: ${textColor}; cursor: pointer; font-size: 18px; padding: 0; margin-left: 8px; opacity: 0.7; transition: opacity 0.2s;"
                        onmouseover="this.style.opacity='1'"
                        onmouseout="this.style.opacity='0.7'">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // 4秒后自动消失
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (notification && notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 4000);

        // 点击通知也可以关闭
        notification.addEventListener('click', (e) => {
            // 如果点击的不是关闭按钮，也关闭通知
            if (e.target.tagName !== 'BUTTON') {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (notification && notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        });
    }

    /**
     * 初始化脚本
     */
    async function init() {
        try {
            console.log('知乎专栏文章过滤器已启动');

            // 等待页面主要内容加载
            await waitForElement('body', 5000);

            // 等待一段时间确保动态内容加载完成
            setTimeout(() => {
                // 创建并添加控制按钮组
                const buttonContainer = createControlButtons();
                document.body.appendChild(buttonContainer);

                console.log('控制按钮已添加到页面');
            }, 2000);

        } catch (error) {
            console.error('脚本初始化失败:', error);
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();