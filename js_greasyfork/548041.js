// ==UserScript==
// @name         TMDB ID显示与复制（仅电影）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在TheMovieDB网站上仅对电影显示TMDB ID并支持点击复制
// @author       ClearRain
// @match        https://www.themoviedb.org/*
// @icon         https://www.themoviedb.org/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_notification
// @license ClearRain
// @downloadURL https://update.greasyfork.org/scripts/548041/TMDB%20ID%E6%98%BE%E7%A4%BA%E4%B8%8E%E5%A4%8D%E5%88%B6%EF%BC%88%E4%BB%85%E7%94%B5%E5%BD%B1%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548041/TMDB%20ID%E6%98%BE%E7%A4%BA%E4%B8%8E%E5%A4%8D%E5%88%B6%EF%BC%88%E4%BB%85%E7%94%B5%E5%BD%B1%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const config = {
        checkInterval: 1000, // 检查新内容的间隔(ms)
        idLabel: 'TMDB ID', // ID标签文本
        copiedText: '已复制!', // 复制成功提示
        copyButtonText: '复制', // 复制按钮文本
        style: `
            .tmdb-id-container {
                display: flex;
                align-items: center;
                margin: 8px 0;
                font-size: 14px;
            }
            .tmdb-id-label {
                font-weight: bold;
                margin-right: 6px;
                color: #01b4e4;
            }
            .tmdb-id-value {
                font-family: monospace;
                background: rgba(1, 180, 228, 0.1);
                padding: 4px 8px;
                border-radius: 4px;
                margin-right: 8px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .tmdb-id-value:hover {
                background: rgba(1, 180, 228, 0.2);
            }
            .tmdb-id-copy-btn {
                background: #90cea1;
                color: #0d253f;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.2s;
            }
            .tmdb-id-copy-btn:hover {
                background: #7bb992;
            }
            .tmdb-id-copied {
                background: #90cea1;
                color: #0d253f;
            }
        `
    };

    // 添加样式
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = config.style;
        document.head.appendChild(style);
    }

    // 检查是否为电影卡片
    function isMovieCard(element) {
        // 检查是否包含合集关键词
        const text = element.textContent.toLowerCase();
        if (text.includes('collection') || text.includes('合集')) {
            return false;
        }

        // 检查是否包含作者关键词
        if (text.includes('by') || text.includes('author') || text.includes('directed by')) {
            return false;
        }

        // 检查链接是否指向电影
        const movieLink = element.querySelector('a[href*="/movie/"]');
        if (movieLink) {
            return true;
        }

        // 检查链接是否指向电视节目（排除）
        const tvLink = element.querySelector('a[href*="/tv/"]');
        if (tvLink) {
            return false;
        }

        // 检查是否有电影相关的类名或属性
        if (element.classList.contains('movie') || element.dataset.mediaType === 'movie') {
            return true;
        }

        return false;
    }

    // 获取TMDB ID
    function getTmdbId(element) {
        // 尝试从电影链接获取ID
        const movieLink = element.querySelector('a[href*="/movie/"]');
        if (movieLink) {
            const match = movieLink.href.match(/\/movie\/(\d+)/);
            if (match && match[1]) {
                return match[1];
            }
        }

        // 尝试从数据属性获取ID
        if (element.dataset.id) {
            return element.dataset.id;
        }

        // 尝试从子元素获取ID
        const idElement = element.querySelector('[data-id]');
        if (idElement && idElement.dataset.id) {
            return idElement.dataset.id;
        }

        return null;
    }

    // 创建ID显示元素
    function createIdElement(tmdbId) {
        const container = document.createElement('div');
        container.className = 'tmdb-id-container';

        const label = document.createElement('span');
        label.className = 'tmdb-id-label';
        label.textContent = config.idLabel + ':';

        const value = document.createElement('span');
        value.className = 'tmdb-id-value';
        value.textContent = tmdbId;
        value.title = '点击复制';

        const button = document.createElement('button');
        button.className = 'tmdb-id-copy-btn';
        button.textContent = config.copyButtonText;

        // 添加点击事件
        const copyHandler = function() {
            GM_setClipboard(tmdbId);
            value.textContent = config.copiedText;
            value.classList.add('tmdb-id-copied');

            // 显示通知
            GM_notification({
                text: `已复制TMDB ID: ${tmdbId}`,
                title: '复制成功',
                timeout: 2000
            });

            // 恢复原始文本
            setTimeout(() => {
                value.textContent = tmdbId;
                value.classList.remove('tmdb-id-copied');
            }, 1500);
        };

        value.addEventListener('click', copyHandler);
        button.addEventListener('click', copyHandler);

        container.appendChild(label);
        container.appendChild(value);
        container.appendChild(button);

        return container;
    }

    // 处理搜索结果卡片
    function processCards() {
        // 选择所有可能的卡片元素
        const selectors = [
            '.card',
            '.search_results .card',
            '.results .card',
            '[data-media-type]',
            '.media'
        ];

        let cards = [];
        selectors.forEach(selector => {
            cards = cards.concat(Array.from(document.querySelectorAll(selector)));
        });

        // 去重
        cards = [...new Set(cards)];

        cards.forEach(card => {
            // 跳过已处理的卡片
            if (card.querySelector('.tmdb-id-container')) {
                return;
            }

            // 只处理电影卡片
            if (!isMovieCard(card)) {
                return;
            }

            const tmdbId = getTmdbId(card);
            if (!tmdbId) {
                return;
            }

            // 查找合适的位置插入ID信息
            const detailsElement = card.querySelector('.details, .content, .info, .footer') || card;
            const idElement = createIdElement(tmdbId);

            // 插入到合适位置
            if (detailsElement) {
                detailsElement.prepend(idElement);
            } else {
                card.appendChild(idElement);
            }
        });
    }

    // 初始化函数
    function init() {
        addStyles();
        // 初始处理
        processCards();
        // 设置定期检查新内容
        setInterval(processCards, config.checkInterval);
        // 监听页面变化 (适用于SPA)
        const observer = new MutationObserver(processCards);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 等待DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();