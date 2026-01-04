// ==UserScript==
// @name         屏蔽指定作者文章
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  屏蔽幻想次元网站上指定作者的文章（基于作者主页链接），设置按钮放在留言板下方
// @author       You
// @match        https://hxcy.top/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558757/%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E4%BD%9C%E8%80%85%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/558757/%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E4%BD%9C%E8%80%85%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认要屏蔽的作者列表 (对象数组: { nickname: 昵称, url: URL })
    let blockedAuthors = [];
    // 默认喜欢的作者列表 (对象数组: { nickname: 昵称, url: URL })
    let likedAuthors = [];
    // 默认关键词屏蔽列表 (字符串数组)
    let blockedKeywords = [];

    // 页面加载时尽早执行一次屏蔽操作，减少闪烁
    function earlyHideBlockedArticles() {
        // 从localStorage加载已屏蔽的作者
        function loadBlockedAuthors() {
            const stored = localStorage.getItem('blockedAuthors');
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    // 兼容旧数据格式（纯URL数组）
                    if (Array.isArray(data) && data.length > 0) {
                        if (typeof data[0] === 'string') {
                            // 旧格式转换为新格式
                            blockedAuthors = data.map(url => ({
                                nickname: url.split('/').pop(),
                                url: url
                            }));
                        } else {
                            blockedAuthors = data;
                        }
                    }
                } catch (e) {
                    console.error('解析屏蔽作者列表失败:', e);
                }
            }
        }

        // 从localStorage加载已屏蔽的关键词
        function loadBlockedKeywords() {
            const stored = localStorage.getItem('blockedKeywords');
            if (stored) {
                try {
                    blockedKeywords = JSON.parse(stored);
                } catch (e) {
                    console.error('解析关键词列表失败:', e);
                    blockedKeywords = [];
                }
            }
        }

        // 加载屏蔽列表
        loadBlockedAuthors();
        loadBlockedKeywords();

        // 尝试隐藏已屏蔽的文章
        try {
            const articles = document.querySelectorAll('article');
            articles.forEach(article => {
                // 检查作者是否被屏蔽
                const authorElement = article.querySelector('.post_author a');
                if (authorElement) {
                    const authorUrl = authorElement.href;
                    if (blockedAuthors.some(author => author.url === authorUrl)) {
                        article.style.display = 'none';
                        return;
                    }
                }

                // 检查标题是否包含屏蔽关键词
                const titleLink = article.querySelector('a[rel="bookmark"], h2 a, h3 a');
                if (titleLink) {
                    // 优先从title属性获取标题
                    let title = titleLink.title || titleLink.textContent || '';
                    if (title && blockedKeywords.length > 0) {
                        const lowerTitle = title.toLowerCase();
                        for (const keyword of blockedKeywords) {
                            if (lowerTitle.includes(keyword.toLowerCase())) {
                                article.style.display = 'none';
                                return;
                            }
                        }
                    }
                }
            });
        } catch (e) {
            // 忽略早期执行可能出现的错误
        }
    }

    // 尽早执行一次简单的屏蔽操作
    if (document.readyState === 'loading') {
        // DOM还在加载中，尽早执行
        earlyHideBlockedArticles();
    } else {
        // DOM已经加载完成，立即执行
        earlyHideBlockedArticles();
    }

    // 从localStorage加载已屏蔽的作者
    function loadBlockedAuthors() {
        const stored = localStorage.getItem('blockedAuthors');
        if (stored) {
            const data = JSON.parse(stored);
            // 兼容旧数据格式（纯URL数组）
            if (Array.isArray(data) && data.length > 0) {
                if (typeof data[0] === 'string') {
                    // 旧格式转换为新格式
                    blockedAuthors = data.map(url => ({
                        nickname: url.split('/').pop(),
                        url: url
                    }));
                    saveBlockedAuthors(); // 保存新格式
                } else {
                    blockedAuthors = data;
                }
            }
        }
    }

    // 从localStorage加载喜欢的作者
    function loadLikedAuthors() {
        const stored = localStorage.getItem('likedAuthors');
        if (stored) {
            const data = JSON.parse(stored);
            // 兼容旧数据格式（纯URL数组）
            if (Array.isArray(data) && data.length > 0) {
                if (typeof data[0] === 'string') {
                    // 旧格式转换为新格式
                    likedAuthors = data.map(url => ({
                        nickname: url.split('/').pop(),
                        url: url
                    }));
                    saveLikedAuthors(); // 保存新格式
                } else {
                    likedAuthors = data;
                }
            }
        }
    }

    // 保存屏蔽的作者到localStorage
    function saveBlockedAuthors() {
        localStorage.setItem('blockedAuthors', JSON.stringify(blockedAuthors));
    }

    // 保存喜欢的作者到localStorage
    function saveLikedAuthors() {
        localStorage.setItem('likedAuthors', JSON.stringify(likedAuthors));
    }

    // 从localStorage加载已屏蔽的关键词
    function loadBlockedKeywords() {
        const stored = localStorage.getItem('blockedKeywords');
        if (stored) {
            try {
                blockedKeywords = JSON.parse(stored);
            } catch (e) {
                console.error('解析关键词列表失败:', e);
                blockedKeywords = [];
            }
        }
    }

    // 保存屏蔽的关键词到localStorage
    function saveBlockedKeywords() {
        localStorage.setItem('blockedKeywords', JSON.stringify(blockedKeywords));
    }

    // 从文章中获取作者昵称
    function getAuthorNicknameFromArticle(article) {
        const authorLink = article.querySelector('.post_author a');
        if (authorLink) {
            // 优先从title属性获取昵称
            if (authorLink.title && authorLink.title.trim()) {
                return authorLink.title.trim();
            }
            // 如果title属性为空，再从文本内容获取
            return authorLink.textContent.trim();
        }
        return null;
    }

    // 获取当前页面作者的昵称（用于添加屏蔽/喜欢）
    function getCurrentAuthorNickname() {
        // 如果在作者页面
        const authorNameElement = document.querySelector('.author-name, .author-title, h1.page-title');
        if (authorNameElement) {
            return authorNameElement.textContent.trim();
        }

        // 如果在文章页面
        const firstArticle = document.querySelector('article');
        if (firstArticle) {
            return getAuthorNicknameFromArticle(firstArticle);
        }

        return null;
    }

    // 添加要屏蔽的作者
    function addBlockedAuthor(authorUrl, manualNickname = null) {
        // 检查是否已存在
        if (!blockedAuthors.some(author => author.url === authorUrl)) {
            // 获取作者昵称
            let nickname = manualNickname;

            // 如果没有手动输入昵称，则尝试自动获取
            if (!nickname) {
                // 查找当前页面是否有该作者的文章
                const articles = document.querySelectorAll('article');
                let targetArticle = null;
                for (const article of articles) {
                    const articleAuthorUrl = getAuthorUrlFromArticle(article);
                    if (articleAuthorUrl === authorUrl) {
                        targetArticle = article;
                        break;
                    }
                }

                // 从文章或当前页面获取昵称
                if (targetArticle) {
                    nickname = getAuthorNicknameFromArticle(targetArticle);
                } else {
                    nickname = getCurrentAuthorNickname();
                }

                // 如果没有获取到昵称，从URL提取
                if (!nickname) {
                    nickname = authorUrl.split('/').pop();
                }
            }

            blockedAuthors.push({ nickname, url: authorUrl });
            saveBlockedAuthors();
            // 更新页面上的屏蔽按钮状态
            updateBlockButtons();
            window.needRefresh = true; // 标记需要刷新

            // 立即隐藏已屏蔽作者的文章
            hideBlockedArticles();
        }
    }

    // 移除屏蔽的作者
    function removeBlockedAuthor(authorUrl) {
        const index = blockedAuthors.findIndex(author => author.url === authorUrl);
        if (index > -1) {
            blockedAuthors.splice(index, 1);
            saveBlockedAuthors();
            // 更新页面上的屏蔽按钮状态
            updateBlockButtons();
        }
    }

    // 添加喜欢的作者
    function addLikedAuthor(authorUrl, manualNickname = null) {
        // 检查是否已存在
        if (!likedAuthors.some(author => author.url === authorUrl)) {
            // 获取作者昵称
            let nickname = manualNickname;

            // 如果没有手动输入昵称，则尝试自动获取
            if (!nickname) {
                // 查找当前页面是否有该作者的文章
                const articles = document.querySelectorAll('article');
                let targetArticle = null;
                for (const article of articles) {
                    const articleAuthorUrl = getAuthorUrlFromArticle(article);
                    if (articleAuthorUrl === authorUrl) {
                        targetArticle = article;
                        break;
                    }
                }

                // 从文章或当前页面获取昵称
                if (targetArticle) {
                    nickname = getAuthorNicknameFromArticle(targetArticle);
                } else {
                    nickname = getCurrentAuthorNickname();
                }

                // 如果没有获取到昵称，从URL提取
                if (!nickname) {
                    nickname = authorUrl.split('/').pop();
                }
            }

            likedAuthors.push({ nickname, url: authorUrl });
            saveLikedAuthors();
            // 更新页面上的喜欢按钮状态
            updateBlockButtons();
            // 更新喜欢作者的帖子样式
            updateLikedArticlesStyle();
        }
    }

    // 移除喜欢的作者
    function removeLikedAuthor(authorUrl) {
        const index = likedAuthors.findIndex(author => author.url === authorUrl);
        if (index > -1) {
            likedAuthors.splice(index, 1);
            saveLikedAuthors();
            // 更新页面上的喜欢按钮状态
            updateBlockButtons();
            // 更新喜欢作者的帖子样式
            updateLikedArticlesStyle();
        }
    }

    // 检查作者是否被喜欢
    function isAuthorLiked(authorUrl) {
        return likedAuthors.some(author => author.url === authorUrl);
    }

    // 更新喜欢作者的帖子样式
    function updateLikedArticlesStyle() {
        const articles = document.querySelectorAll('article');
        articles.forEach(article => {
            const authorElement = article.querySelector('.post_author a');
            if (authorElement) {
                const authorUrl = authorElement.href;
                if (isAuthorLiked(authorUrl)) {
                    article.style.backgroundColor = 'rgba(255, 182, 193, 0.35)'; // 调整为更深一点的粉色背景
                } else {
                    article.style.backgroundColor = ''; // 恢复默认背景
                }
            }
        });
    }

    // 从文章中获取标题
    function getArticleTitle(articleElement) {
        // 查找标题链接元素 - 尝试多种选择器
        let titleLink;

        // 1. 尝试查找带有rel="bookmark"的链接（这通常是文章标题链接的特征）
        titleLink = articleElement.querySelector('a[rel="bookmark"]');

        // 2. 如果找不到，尝试查找h2标签内的链接
        if (!titleLink) {
            titleLink = articleElement.querySelector('h2 a');
        }

        // 3. 如果找不到，尝试查找h3标签内的链接
        if (!titleLink) {
            titleLink = articleElement.querySelector('h3 a');
        }

        // 4. 如果找不到，尝试查找带有post-title或entry-title类的链接
        if (!titleLink) {
            titleLink = articleElement.querySelector('.post-title a, .entry-title a');
        }

        if (titleLink) {
            // 优先从title属性获取标题
            if (titleLink.title) {
                return titleLink.title;
            }
            // 如果没有title属性，从链接文本获取
            if (titleLink.textContent) {
                return titleLink.textContent;
            }
        }
        return '';
    }

    // 检查文章是否应该被屏蔽
    function shouldBlockArticle(articleElement) {
        // 检查作者是否被屏蔽
        const authorElement = articleElement.querySelector('.post_author a');
        if (authorElement) {
            const authorUrl = authorElement.href;
            if (blockedAuthors.some(author => author.url === authorUrl)) {
                return true;
            }
        }

        // 检查标题是否包含屏蔽关键词
        const title = getArticleTitle(articleElement);
        if (title && blockedKeywords.length > 0) {
            const lowerTitle = title.toLowerCase();
            for (const keyword of blockedKeywords) {
                if (lowerTitle.includes(keyword.toLowerCase())) {
                    return true;
                }
            }
        }

        return false;
    }

    // 隐藏被屏蔽作者的文章
    function hideBlockedArticles() {
        const articles = document.querySelectorAll('article');

        articles.forEach(article => {
            if (shouldBlockArticle(article)) {
                article.style.display = 'none';
            }
        });
    }

    // 获取当前页面的作者主页链接（用于添加屏蔽）
    function getCurrentAuthorUrl() {
        // 如果在作者页面
        const authorPageMatch = window.location.pathname.match(/^\/author\/([^\/]+)/);
        if (authorPageMatch) {
            return window.location.origin + window.location.pathname;
        }

        // 如果在文章页面，尝试获取作者链接
        const authorElement = document.querySelector('.post_author a');
        if (authorElement) {
            return authorElement.href;
        }

        return null;
    }

    // 为文章添加喜欢和屏蔽按钮
    function addBlockButtonsToArticles() {
        const articles = document.querySelectorAll('article');
        articles.forEach(article => {
            // 检查是否已经有屏蔽按钮
            if (article.querySelector('.block-author-btn')) {
                return;
            }

            const authorElement = article.querySelector('.post_author a');
            if (authorElement) {
            const authorUrl = authorElement.href;

            // 检查作者是否已被喜欢或屏蔽
            const isLiked = likedAuthors.some(author => author.url === authorUrl);
            const isBlocked = blockedAuthors.some(author => author.url === authorUrl);

            // 创建喜欢按钮
            const likeButton = document.createElement('button');
            likeButton.className = 'like-author-btn';
            likeButton.textContent = isLiked ? '已喜欢' : '喜欢作者';
            likeButton.style.cssText = `
                margin-left: 10px;
                padding: 2px 5px;
                background-color: ${isLiked ? '#FF4081' : '#E91E63'};
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
            `;

            // 喜欢按钮点击事件
            likeButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (likedAuthors.some(author => author.url === authorUrl)) {
                    removeLikedAuthor(authorUrl);
                    likeButton.textContent = '喜欢作者';
                    likeButton.style.backgroundColor = '#E91E63';
                } else {
                    // 获取作者昵称（优先从title属性）
                    const nickname = authorElement.title ? authorElement.title.trim() : authorElement.textContent.trim();
                    addLikedAuthor(authorUrl, nickname);
                    likeButton.textContent = '已喜欢';
                    likeButton.style.backgroundColor = '#FF4081';
                }
            });

            // 创建屏蔽按钮
            const blockButton = document.createElement('button');
            blockButton.className = 'block-author-btn';
            blockButton.textContent = isBlocked ? '已屏蔽' : '屏蔽作者';
            blockButton.style.cssText = `
                margin-left: 5px;
                padding: 2px 5px;
                background-color: ${isBlocked ? '#FF9800' : '#f44336'};
                color: white;
                border: none;
                border-radius: 3px;
                cursor: ${isBlocked ? 'default' : 'pointer'};
                font-size: 12px;
                ${isBlocked ? 'opacity: 0.7;' : ''}
            `;
            if (isBlocked) {
                blockButton.disabled = true;
            }

                // 屏蔽按钮点击事件
                blockButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (!blockedAuthors.some(author => author.url === authorUrl)) {
                        // 获取作者昵称（优先从title属性）
                        const nickname = authorElement.title ? authorElement.title.trim() : authorElement.textContent.trim();
                        addBlockedAuthor(authorUrl, nickname);
                        blockButton.textContent = '已屏蔽';
                        blockButton.style.backgroundColor = '#FF9800';
                        blockButton.disabled = true; // 禁用按钮防止重复点击
                        // 屏蔽后立即刷新页面
                        setTimeout(() => {
                            location.reload();
                        }, 100);
                    }
                });

                // 插入按钮到作者信息旁边
                authorElement.parentNode.appendChild(likeButton);
                authorElement.parentNode.appendChild(blockButton);
            }
        });
    }

    // 更新所有喜欢和屏蔽按钮的状态
    function updateBlockButtons() {
        // 更新喜欢按钮
        const likeButtons = document.querySelectorAll('.like-author-btn');
        likeButtons.forEach(button => {
            const article = button.closest('article');
            if (article) {
                const authorElement = article.querySelector('.post_author a');
                if (authorElement) {
                    const authorUrl = authorElement.href;
                    if (likedAuthors.some(author => author.url === authorUrl)) {
                        button.textContent = '已喜欢';
                        button.style.backgroundColor = '#FF4081';
                    } else {
                        button.textContent = '喜欢作者';
                        button.style.backgroundColor = '#E91E63';
                    }
                }
            }
        });

        // 更新屏蔽按钮
        const blockButtons = document.querySelectorAll('.block-author-btn');
        blockButtons.forEach(button => {
            const article = button.closest('article');
            if (article) {
                const authorElement = article.querySelector('.post_author a');
                if (authorElement) {
                    const authorUrl = authorElement.href;
                    if (blockedAuthors.some(author => author.url === authorUrl)) {
                        button.textContent = '已屏蔽';
                        button.style.backgroundColor = '#FF9800';
                        button.style.cursor = 'default';
                        button.style.opacity = '0.7';
                        button.disabled = true;
                    } else {
                        button.textContent = '屏蔽作者';
                        button.style.backgroundColor = '#f44336';
                        button.style.cursor = 'pointer';
                        button.style.opacity = '1';
                        button.disabled = false;
                    }
                }
            }
        });
    }

    // 更新已屏蔽列表显示
    function updateBlockedList() {
        const blockedList = document.getElementById('blocked-list');

        if (blockedAuthors.length === 0) {
            blockedList.innerHTML = '<p style="color: #999; text-align: center;">暂无屏蔽作者</p>';
            return;
        }

        blockedList.innerHTML = blockedAuthors.map(author => {
            // 生成唯一的ID用于后续绑定事件
            const buttonId = 'remove-btn-' + btoa(author.url).replace(/[^a-zA-Z0-9]/g, '');
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #eee;">
                    <div style="flex: 1; margin-right: 10px;">
                        <div style="font-weight: bold; font-size: 14px; color: #333;">${author.nickname}</div>
                        <div style="font-size: 11px; color: #666; word-break: break-all;">${author.url}</div>
                    </div>
                    <button id="${buttonId}" data-author-url="${author.url}" style="background: #ff6b6b; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 12px; transition: background-color 0.2s ease;">移除</button>
                </div>
            `;
        }).join('');

        // 为所有移除按钮绑定点击事件
        setTimeout(() => {
            const removeButtons = blockedList.querySelectorAll('button[data-author-url]');
            removeButtons.forEach(button => {
                button.onclick = function() {
                    const authorUrl = this.getAttribute('data-author-url');
                    removeBlockedAuthorAndUpdate(authorUrl);
                };
                // 添加悬停效果
                button.onmouseover = function() {
                    this.style.backgroundColor = '#ff5252';
                };
                button.onmouseout = function() {
                    this.style.backgroundColor = '#ff6b6b';
                };
                button.onmousedown = function() {
                    // 简化交互，移除缩放效果
                };
                button.onmouseup = function() {
                    // 简化交互，移除缩放效果
                };
            });
        }, 0);
    }

    // 移除屏蔽作者并更新列表
    function removeBlockedAuthorAndUpdate(authorUrl) {
        removeBlockedAuthor(authorUrl);
        // 调用updateBlockedList来更新列表显示
        updateBlockedList();

        // 重新显示被移除作者的文章
        showUnblockedArticles(authorUrl);
        // 标记需要刷新
        window.needRefresh = true;
    }

    // 更新已喜欢列表显示
    function updateLikedList() {
        const likedList = document.getElementById('liked-list');

        if (likedAuthors.length === 0) {
            likedList.innerHTML = '<p style="color: #999; text-align: center;">暂无喜欢作者</p>';
            return;
        }

        likedList.innerHTML = likedAuthors.map(author => {
            // 生成唯一的ID用于后续绑定事件
            const buttonId = 'remove-like-btn-' + btoa(author.url).replace(/[^a-zA-Z0-9]/g, '');
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #eee;">
                    <div style="flex: 1; margin-right: 10px;">
                        <div style="font-weight: bold; font-size: 14px; color: #e91e63;">${author.nickname}</div>
                        <div style="font-size: 11px; color: #666; word-break: break-all;">${author.url}</div>
                    </div>
                    <button id="${buttonId}" data-author-url="${author.url}" style="background: #ff6b9d; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 12px; transition: background-color 0.2s ease;">取消喜欢</button>
                </div>
            `;
        }).join('');

        // 为所有取消喜欢按钮绑定点击事件
        setTimeout(() => {
            const removeButtons = likedList.querySelectorAll('button[data-author-url]');
            removeButtons.forEach(button => {
                button.onclick = function() {
                    const authorUrl = this.getAttribute('data-author-url');
                    removeLikedAuthorAndUpdate(authorUrl);
                };
                // 添加悬停效果
                button.onmouseover = function() {
                    this.style.backgroundColor = '#ff528b';
                };
                button.onmouseout = function() {
                    this.style.backgroundColor = '#ff6b9d';
                };
                button.onmousedown = function() {
                    // 简化交互，移除缩放效果
                };
                button.onmouseup = function() {
                    // 简化交互，移除缩放效果
                };
            });
        }, 0);
    }

    // 移除喜欢作者并更新列表
    function removeLikedAuthorAndUpdate(authorUrl) {
        removeLikedAuthor(authorUrl);
        // 调用updateLikedList来更新列表显示
        updateLikedList();

        // 更新所有文章的背景色
        updateLikedArticlesStyle();
        // 标记需要刷新
        window.needRefresh = true;
    }

    // 更新已屏蔽的关键词列表
    function updateKeywordList() {
        const keywordList = document.getElementById('keyword-list');

        if (blockedKeywords.length === 0) {
            keywordList.innerHTML = '<p style="color: #999; text-align: center;">暂无屏蔽关键词</p>';
            return;
        }

        keywordList.innerHTML = blockedKeywords.map(keyword => {
            // 生成唯一的ID用于后续绑定事件
            const buttonId = 'remove-keyword-btn-' + keyword.replace(/[^a-zA-Z0-9]/g, '');
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #f3e5ab;">
                    <div style="flex: 1; margin-right: 10px; font-size: 14px; color: #333; word-break: break-all;">${keyword}</div>
                    <button id="${buttonId}" data-keyword="${keyword}" style="background: #ff9800; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 12px; transition: background-color 0.2s ease;">移除</button>
                </div>
            `;
        }).join('');

        // 为所有移除按钮绑定点击事件
        setTimeout(() => {
            const removeButtons = keywordList.querySelectorAll('button[data-keyword]');
            removeButtons.forEach(button => {
                button.onclick = function() {
                    const keyword = this.getAttribute('data-keyword');
                    removeBlockedKeywordAndUpdate(keyword);
                };
                // 添加悬停效果
                button.onmouseover = function() {
                    this.style.backgroundColor = '#f57c00';
                };
                button.onmouseout = function() {
                    this.style.backgroundColor = '#ff9800';
                };
            });
        }, 0);
    }

    // 移除屏蔽关键词并更新列表
    function removeBlockedKeywordAndUpdate(keyword) {
        const index = blockedKeywords.indexOf(keyword);
        if (index > -1) {
            blockedKeywords.splice(index, 1);
            saveBlockedKeywords();
            // 更新关键词列表显示
            updateKeywordList();
            // 重新显示包含该关键词的文章
            showUnblockedKeywordArticles(keyword);
            // 标记需要刷新
            window.needRefresh = true;
        }
    }

    // 显示之前因关键词屏蔽的文章
    function showUnblockedKeywordArticles(keyword) {
        const articles = document.querySelectorAll('article');
        articles.forEach(article => {
            // 检查是否是因为作者被屏蔽而隐藏的文章
            const authorElement = article.querySelector('.post_author a');
            const isAuthorBlocked = authorElement && blockedAuthors.some(author => author.url === authorElement.href);

            if (!isAuthorBlocked && article.style.display === 'none') {
                // 检查文章标题是否包含移除的关键词
                const title = getArticleTitle(article).toLowerCase();
                if (title.includes(keyword.toLowerCase())) {
                    article.style.display = ''; // 显示文章
                }
            }
        });
    }

    // 显示之前被屏蔽的文章
    function showUnblockedArticles(authorUrl) {
        const articles = document.querySelectorAll('article');
        articles.forEach(article => {
            const articleAuthorUrl = getAuthorUrlFromArticle(article);
            if (articleAuthorUrl === authorUrl) {
                article.style.display = ''; // 显示文章
            }
        });
    }

    // 从文章中获取作者URL
    function getAuthorUrlFromArticle(article) {
        const authorLink = article.querySelector('.post_author a');
        return authorLink ? authorLink.href : null;
    }

    // 创建设置面板
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'block-settings-panel';
        panel.style.display = 'none'; // 初始状态为隐藏
        panel.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; z-index: 10000; width: 90%; max-width: 500px; max-height: 70vh; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px;">
                    <h3 style="margin: 0; color: #333; font-size: 16px; font-weight: 600;">🚫 屏蔽与喜欢设置</h3>
                    <button id="close-settings" style="background: #f5f5f5; color: #666; border: 1px solid #ddd; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.2s ease;">关闭</button>
                </div>

                <!-- 关键词屏蔽设置 -->
                <div style="margin-bottom: 20px; border-bottom: 1px solid #f0f0f0; padding-bottom: 15px;">
                    <h4 style="color: #333; margin-bottom: 12px; font-size: 14px; font-weight: 600;">� 关键词屏蔽</h4>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 8px; color: #666; font-size: 13px;">添加关键词到屏蔽列表：</label>
                        <input type="text" id="manual-keyword" placeholder="输入关键词 (如: SLG, 官中)" style="width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px; font-size: 12px; box-sizing: border-box; transition: border-color 0.2s ease;">
                        <button id="add-manual-keyword" style="background: #FF9800; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: background-color 0.2s ease;">🔤 手动添加</button>
                    </div>
                    <h5 style="color: #333; margin-bottom: 10px; font-size: 13px; font-weight: 600;">📋 已屏蔽的关键词：</h5>
                    <div id="keyword-list" style="border: 1px solid #f0f0f0; border-radius: 4px; padding: 10px; max-height: 150px; overflow-y: auto; background: #fff9e6;"></div>
                </div>

                <!-- 屏蔽作者设置 -->
                <div style="margin-bottom: 20px; border-bottom: 1px solid #f0f0f0; padding-bottom: 15px;">
                    <h4 style="color: #333; margin-bottom: 12px; font-size: 14px; font-weight: 600;">🚫 屏蔽作者</h4>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 8px; color: #666; font-size: 13px;">添加作者到屏蔽列表：</label>
                        <input type="text" id="manual-author-nickname" placeholder="输入作者昵称 (可选，给自己看的)" style="width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px; font-size: 12px; box-sizing: border-box; transition: border-color 0.2s ease;">
                        <input type="text" id="manual-author-url" placeholder="输入作者主页网址 (如: https://hxcy.top/author/xxxxxx)" style="width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px; font-size: 12px; box-sizing: border-box; transition: border-color 0.2s ease;">
                        <button id="add-manual-author" style="background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: background-color 0.2s ease;">➕ 手动添加</button>
                    </div>
                    <h5 style="color: #333; margin-bottom: 10px; font-size: 13px; font-weight: 600;">📋 已屏蔽的作者：</h5>
                    <div id="blocked-list" style="border: 1px solid #f0f0f0; border-radius: 4px; padding: 10px; max-height: 150px; overflow-y: auto; background: #fafafa;"></div>
                </div>

                <!-- 喜欢作者设置 -->
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #333; margin-bottom: 12px; font-size: 14px; font-weight: 600;">❤️ 喜欢作者</h4>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 8px; color: #666; font-size: 13px;">添加作者到喜欢列表：</label>
                        <input type="text" id="manual-like-nickname" placeholder="输入作者昵称 (可选，给自己看的)" style="width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px; font-size: 12px; box-sizing: border-box; transition: border-color 0.2s ease;">
                        <input type="text" id="manual-like-url" placeholder="输入作者主页网址 (如: https://hxcy.top/author/xxxxxx)" style="width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px; font-size: 12px; box-sizing: border-box; transition: border-color 0.2s ease;">
                        <button id="add-manual-like" style="background: #FF4081; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: background-color 0.2s ease;">❤️ 手动添加</button>
                    </div>
                    <h5 style="color: #333; margin-bottom: 10px; font-size: 13px; font-weight: 600;">📋 已喜欢的作者：</h5>
                    <div id="liked-list" style="border: 1px solid #f0f0f0; border-radius: 4px; padding: 10px; max-height: 150px; overflow-y: auto; background: #fff5f5;"></div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        document.getElementById('close-settings').onclick = function() {
            panel.style.display = 'none';
            // 如果需要刷新，则刷新页面
            if (window.needRefresh) {
                window.needRefresh = false;
                location.reload();
            }
        };

        // 为关闭按钮添加悬停效果
        document.getElementById('close-settings').onmouseover = function() {
            this.style.backgroundColor = '#e0e0e0';
        };
        document.getElementById('close-settings').onmouseout = function() {
            this.style.backgroundColor = '#f5f5f5';
        };

        // 屏蔽作者相关事件
        document.getElementById('add-manual-author').onclick = function() {
            const manualUrl = document.getElementById('manual-author-url').value.trim();
            const manualNickname = document.getElementById('manual-author-nickname').value.trim();
            if (manualUrl && manualUrl.includes('/author/')) {
                addBlockedAuthor(manualUrl, manualNickname);
                document.getElementById('manual-author-url').value = '';
                document.getElementById('manual-author-nickname').value = '';
                // 调用updateBlockedList来更新列表显示
                updateBlockedList();
                window.needRefresh = true; // 标记需要刷新
            } else {
                alert('请输入有效的作者主页URL');
            }
        };

        // 为屏蔽作者添加按钮添加悬停效果
        document.getElementById('add-manual-author').onmouseover = function() {
            this.style.backgroundColor = '#43a047';
        };
        document.getElementById('add-manual-author').onmouseout = function() {
            this.style.backgroundColor = '#4CAF50';
        };

        // 为屏蔽作者输入框添加焦点效果
        document.getElementById('manual-author-url').onfocus = function() {
            this.style.borderColor = '#667eea';
        };
        document.getElementById('manual-author-url').onblur = function() {
            this.style.borderColor = '#ddd';
        };

        // 为屏蔽作者昵称输入框添加焦点效果
        document.getElementById('manual-author-nickname').onfocus = function() {
            this.style.borderColor = '#667eea';
        };
        document.getElementById('manual-author-nickname').onblur = function() {
            this.style.borderColor = '#ddd';
        };

        // 喜欢作者相关事件
        document.getElementById('add-manual-like').onclick = function() {
            const manualUrl = document.getElementById('manual-like-url').value.trim();
            const manualNickname = document.getElementById('manual-like-nickname').value.trim();
            if (manualUrl && manualUrl.includes('/author/')) {
                addLikedAuthor(manualUrl, manualNickname);
                document.getElementById('manual-like-url').value = '';
                document.getElementById('manual-like-nickname').value = '';
                // 调用updateLikedList来更新列表显示
                updateLikedList();
                window.needRefresh = true; // 标记需要刷新
            } else {
                alert('请输入有效的作者主页URL');
            }
        };

        // 为喜欢作者添加按钮添加悬停效果
        document.getElementById('add-manual-like').onmouseover = function() {
            this.style.backgroundColor = '#F50057';
        };
        document.getElementById('add-manual-like').onmouseout = function() {
            this.style.backgroundColor = '#FF4081';
        };

        // 为喜欢作者输入框添加焦点效果
        document.getElementById('manual-like-url').onfocus = function() {
            this.style.borderColor = '#FF4081';
        };
        document.getElementById('manual-like-url').onblur = function() {
            this.style.borderColor = '#ddd';
        };

        // 为喜欢作者昵称输入框添加焦点效果
        document.getElementById('manual-like-nickname').onfocus = function() {
            this.style.borderColor = '#FF4081';
        };
        document.getElementById('manual-like-nickname').onblur = function() {
            this.style.borderColor = '#ddd';
        };

        // 关键词屏蔽相关事件
        document.getElementById('add-manual-keyword').onclick = function() {
            const keyword = document.getElementById('manual-keyword').value.trim();
            if (keyword) {
                if (!blockedKeywords.includes(keyword)) {
                    blockedKeywords.push(keyword);
                    saveBlockedKeywords();
                    document.getElementById('manual-keyword').value = '';
                    updateKeywordList();
                    hideBlockedArticles(); // 立即隐藏包含新关键词的文章
                    window.needRefresh = true; // 标记需要刷新
                }
            } else {
                alert('请输入关键词');
            }
        };

        // 为关键词添加按钮添加悬停效果
        document.getElementById('add-manual-keyword').onmouseover = function() {
            this.style.backgroundColor = '#f57c00';
        };
        document.getElementById('add-manual-keyword').onmouseout = function() {
            this.style.backgroundColor = '#FF9800';
        };

        // 为关键词输入框添加焦点效果
        document.getElementById('manual-keyword').onfocus = function() {
            this.style.borderColor = '#FF9800';
        };
        document.getElementById('manual-keyword').onblur = function() {
            this.style.borderColor = '#ddd';
        };

        updateBlockedList();
        updateLikedList();
        updateKeywordList();
    }

    // 创建设置按钮，放在留言板下方
    function createSettingsButton() {
        const checkForMessagesLink = setInterval(() => {
            const messagesLink = document.querySelector('a[href*="/messages"]');
            if (messagesLink) {
                clearInterval(checkForMessagesLink);

                // 创建共同的父容器
                const parentContainer = document.createElement('div');
                parentContainer.id = 'block-settings-container';
                parentContainer.style.cssText = `
                    margin-left: 10px;
                    margin-right: 10px;
                    margin-top: 8px;
                    width: calc(100% - 20px);
                    max-width: 100%;
                    box-sizing: border-box;
                `;

                const button = document.createElement('button');
                button.id = 'block-settings-btn';
                button.innerHTML = `<div style="font-size: 14px; margin-bottom: 2px;">🚫</div><div style="font-size: 12px;">屏蔽设置</div>`;
                button.style.cssText = `
                    background: #ff6b6b;
                    color: white;
                    border: none;
                    padding: 8px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    margin-bottom: 8px;
                    vertical-align: middle;
                    transition: background-color 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    box-sizing: border-box;
                `;
                button.onmouseover = function() {
                    this.style.backgroundColor = '#ff5252';
                };
                button.onmouseout = function() {
                    this.style.backgroundColor = '#ff6b6b';
                };
                button.onclick = function(e) {
                    e.preventDefault();
                    const panel = document.getElementById('block-settings-panel');
                    panel.style.display = (panel.style.display === 'none' || !panel.style.display) ? 'block' : 'none';
                };

                // 将按钮添加到父容器
                parentContainer.appendChild(button);

                // 将父容器添加到页面
                messagesLink.parentNode.insertBefore(parentContainer, messagesLink.nextSibling);

                // 在屏蔽设置按钮下方添加分页按钮
                createPaginationButtons();
            }
        }, 1000);
    }

    // 创建上一页和下一页按钮
    function createPaginationButtons() {
        const paginationContainer = document.createElement('div');
        paginationContainer.id = 'block-pagination-buttons';
        paginationContainer.style.cssText = `
            display: flex;
            gap: 8px;
            margin-top: 8px;
            align-items: center;
            justify-content: center;
        `;

        // 获取当前页码
        const currentPage = getCurrentPageNumber();
        const hasPrevPage = currentPage > 1;
        const hasNextPage = checkHasNextPage();

        // 上一页按钮
        const prevButton = document.createElement('button');
        prevButton.id = 'block-prev-page-btn';
        prevButton.innerHTML = `<div style="font-size: 14px; margin-bottom: 2px;">⬅️</div><div style="font-size: 12px;">上一页</div>`;
        prevButton.style.cssText = `
            background: #667eea;
            color: white;
            border: none;
            padding: 8px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s ease;
            opacity: ${hasPrevPage ? '1' : '0.5'};
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `;
        prevButton.onmouseover = function() {
            if (hasPrevPage) {
                this.style.backgroundColor = '#764ba2';
            }
        };
        prevButton.onmouseout = function() {
            if (hasPrevPage) {
                this.style.backgroundColor = '#667eea';
            }
        };
        prevButton.onclick = function() {
            if (hasPrevPage) {
                goToPage(currentPage - 1);
            }
        };

        // 下一页按钮
        const nextButton = document.createElement('button');
        nextButton.id = 'block-next-page-btn';
        nextButton.innerHTML = `<div style="font-size: 14px; margin-bottom: 2px;">➡️</div><div style="font-size: 12px;">下一页</div>`;
        nextButton.style.cssText = `
            background: #667eea;
            color: white;
            border: none;
            padding: 8px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s ease;
            opacity: ${hasNextPage ? '1' : '0.5'};
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `;
        nextButton.onmouseover = function() {
            if (hasNextPage) {
                this.style.backgroundColor = '#764ba2';
            }
        };
        nextButton.onmouseout = function() {
            if (hasNextPage) {
                this.style.backgroundColor = '#667eea';
            }
        };
        nextButton.onclick = function() {
            if (hasNextPage) {
                goToPage(currentPage + 1);
            }
        };

        // 页码输入框
        const pageInfo = document.createElement('input');
        pageInfo.id = 'block-page-info';
        pageInfo.type = 'number';
        pageInfo.value = currentPage;
        pageInfo.min = '1';
        pageInfo.style.cssText = `
            font-size: 12px;
            color: #333;
            width: 32px;
            padding: 6px 2px;
            text-align: center;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            -webkit-appearance: none;
            -moz-appearance: textfield;
        `;
        // 额外添加CSS来隐藏输入框的自旋按钮
        const style = document.createElement('style');
        style.textContent = `
            #block-page-info::-webkit-inner-spin-button,
            #block-page-info::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
        `;
        document.head.appendChild(style);

        // 添加回车键跳转功能
        pageInfo.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const targetPage = parseInt(pageInfo.value);
                if (targetPage && targetPage >= 1) {
                    goToPage(targetPage);
                }
            }
        });

        // 添加失焦跳转功能
        pageInfo.addEventListener('blur', function() {
            const targetPage = parseInt(pageInfo.value);
            if (targetPage && targetPage >= 1 && targetPage !== currentPage) {
                goToPage(targetPage);
            } else {
                // 如果输入无效，恢复原值
                pageInfo.value = currentPage;
            }
        });

        paginationContainer.appendChild(prevButton);
        paginationContainer.appendChild(pageInfo);
        paginationContainer.appendChild(nextButton);

        // 插入到屏蔽设置按钮下方（共同父容器内）
        const settingsContainer = document.getElementById('block-settings-container');
        settingsContainer.appendChild(paginationContainer);
    }

    // 更新页码输入框的值
    function updatePageInputValue(pageNumber) {
        const pageInput = document.getElementById('block-page-info');
        if (pageInput) {
            pageInput.value = pageNumber;
        }
    }

    // 获取当前页码
    function getCurrentPageNumber() {
        const pathname = window.location.pathname;
        // 匹配 /page/数字 格式，数字可以在路径末尾
        const pageMatch = pathname.match(/\/page\/(\d+)(?:\/)?$/);
        if (pageMatch) {
            return parseInt(pageMatch[1]);
        }
        return 1; // 第一页没有page参数
    }

    // 检查是否有下一页
    function checkHasNextPage() {
        // 检查是否存在下一页链接
        const nextPageSelectors = [
            'a.next',
            '.pagination a[rel="next"]',
            '.page-numbers.next',
            'a[aria-label="Next"]'
        ];

        for (const selector of nextPageSelectors) {
            const nextLink = document.querySelector(selector);
            if (nextLink && nextLink.href) {
                return true;
            }
        }

        // 如果找不到明确的下一页链接，尝试构造URL检查
        const currentPage = getCurrentPageNumber();
        const nextPageUrl = constructPageUrl(currentPage + 1);

        // 这里可以添加更复杂的检查逻辑，比如预加载检查
        // 暂时返回true，让用户尝试
        return true;
    }

    // 构造指定页码的URL
    function constructPageUrl(pageNumber) {
        const pathname = window.location.pathname;
        const baseUrl = window.location.origin;

        if (pageNumber === 1) {
            // 第一页没有page参数
            if (pathname.match(/\/page\/\d+(?:\/)?$/)) {
                // 移除/page/x部分，但要保留前面的路径
                // 例如：/category/hanhua/acg/game/page/2 → /category/hanhua/acg/game/
                return baseUrl + pathname.replace(/\/page\/\d+(?:\/)?$/, '');
            } else {
                return baseUrl + pathname;
            }
        } else {
            // 其他页码添加page参数
            if (pathname.match(/\/page\/\d+(?:\/)?$/)) {
                // 直接替换数字部分，避免重复/page/
                // 例如：/category/hanhua/acg/game/page/2 → /category/hanhua/acg/game/page/3
                return baseUrl + pathname.replace(/\/page\/(\d+)(?:\/)?$/, `/page/${pageNumber}`);
            } else {
                // 其他情况，在路径末尾添加page参数
                // 确保路径以斜杠结尾
                const normalizedPath = pathname.endsWith('/') ? pathname : pathname + '/';
                return baseUrl + normalizedPath + `page/${pageNumber}`;
            }
        }
    }

    // 跳转到指定页码
    function goToPage(pageNumber) {
        const targetUrl = constructPageUrl(pageNumber);
        console.log('跳转到页面:', pageNumber, 'URL:', targetUrl);
        window.location.href = targetUrl;
    }

    // 初始化
    function init() {
        // 重新加载屏蔽列表（因为earlyHideBlockedArticles中已经加载过一次）
        loadBlockedAuthors();
        loadLikedAuthors(); // 加载喜欢的作者
        loadBlockedKeywords(); // 加载屏蔽的关键词

        // 初始化刷新标记
        window.needRefresh = false;

        // 创建设置面板（必须在创建设置按钮之前）
        createSettingsPanel();

        // 隐藏已屏蔽的文章（再次执行以确保准确性）
        hideBlockedArticles();

        // 为喜欢作者的帖子设置浅粉色背景
        updateLikedArticlesStyle();

        // 添加屏蔽和喜欢按钮到文章
        addBlockButtonsToArticles();

        // 创建设置按钮
        createSettingsButton();

        // 监听DOM变化，动态隐藏新加载的文章并添加按钮
        const observer = new MutationObserver((mutations) => {
            let shouldAddButtons = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element节点
                            if (node.tagName === 'ARTICLE') {
                                if (shouldBlockArticle(node)) {
                                    node.style.display = 'none';
                                } else {
                                    // 为喜欢作者的新文章设置背景色
                                    const authorUrl = getAuthorUrlFromArticle(node);
                                    if (authorUrl && likedAuthors.includes(authorUrl)) {
                                        node.style.backgroundColor = 'rgba(255, 182, 193, 0.35)'; // 调整为更深一点的粉色背景
                                    }
                                }
                                shouldAddButtons = true;
                            } else {
                                const articles = node.querySelectorAll && node.querySelectorAll('article');
                                if (articles) {
                                    articles.forEach(article => {
                                        if (shouldBlockArticle(article)) {
                                            article.style.display = 'none';
                                        } else {
                                            // 为喜欢作者的新文章设置背景色
                                            const authorUrl = getAuthorUrlFromArticle(article);
                                            if (authorUrl && likedAuthors.includes(authorUrl)) {
                                                article.style.backgroundColor = 'rgba(255, 182, 193, 0.35)'; // 调整为更深一点的粉色背景
                                            }
                                        }
                                    });
                                    if (articles.length > 0) {
                                        shouldAddButtons = true;
                                    }
                                }
                            }
                        }
                    });
                }
            });

            // 如果有新增的文章元素，则添加按钮
            if (shouldAddButtons) {
                setTimeout(addBlockButtonsToArticles, 0);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
