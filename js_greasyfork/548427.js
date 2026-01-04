// ==UserScript==
// @name         MoviePilot 爱影搜索助手
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  仅适用于爱影SVIP订阅用户，在MoviePilot多个页面添加"搜索爱影"按钮，脚本安装后请把第7-9行的地址和端口改成你自己实际的MP地址和端口
// @author       ccdfccgfddx@AY
// @match        http://*:3000/*
// @match        https://*:3000/*
// @match        http://192.168.5.13:3000/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/548427/MoviePilot%20%E7%88%B1%E5%BD%B1%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/548427/MoviePilot%20%E7%88%B1%E5%BD%B1%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置区域
    const config = {
        searchUrl: 'https://subs.ayclub.vip/index.php?query=',
        hoverDelay: 300,
        animationDelay: 200,
        checkInterval: 1000,
        maxRetry: 15,
        windowWidth: 1200,
        windowHeight: 800,
        retryCount: 0
    };

    // 添加样式
    GM_addStyle(`
        /* 海报墙卡片按钮样式 */
        .ay-search-helper-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            background: linear-gradient(135deg, #5d78ff 0%, #3b5bdb 100%);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            z-index: 100;
            opacity: 0;
            transform: translateY(-10px);
            pointer-events: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .ay-search-helper-btn:hover {
            background: linear-gradient(135deg, #4c6ef5 0%, #364fc7 100%);
            box-shadow: 0 4px 12px rgba(93, 120, 255, 0.5);
        }

        .media-card:hover .ay-search-helper-btn {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }

        /* 搜索结果页面芯片样式 */
        .ay-search-helper-chip {
            background: linear-gradient(135deg, #5d78ff 0%, #3b5bdb 100%) !important;
            border: none !important;
            color: white !important;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-right: 8px !important;
        }

        .ay-search-helper-chip:hover {
            background: linear-gradient(135deg, #4c6ef5 0%, #364fc7 100%) !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(93, 120, 255, 0.3);
        }

        .ay-search-helper-chip:active {
            transform: translateY(0);
        }

        .ay-search-helper-chip .v-chip__content::before {
            content: "🔍 ";
            margin-right: 4px;
        }

        /* 导航栏按钮样式 */
        .ay-search-btn {
            background: linear-gradient(135deg, #5d78ff 0%, #3b5bdb 100%);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 14px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 6px rgba(93, 120, 255, 0.3);
            display: flex;
            align-items: center;
            gap: 6px;
            margin-left: 10px;
            white-space: nowrap;
        }

        .ay-search-btn:hover {
            background: linear-gradient(135deg, #4c6ef5 0%, #364fc7 100%);
            box-shadow: 0 4px 8px rgba(93, 120, 255, 0.4);
            transform: translateY(-1px);
        }

        .ay-search-btn:active {
            transform: translateY(0);
            box-shadow: 0 1px 3px rgba(93, 120, 255, 0.3);
        }

        .ay-search-btn::before {
            content: "🔍";
            font-size: 16px;
        }

        /* 动画效果 */
        @keyframes ay-search-helper-fadein {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes ayButtonFadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .ay-search-helper-btn-added,
        .ay-search-helper-chip-added,
        .ay-search-btn-added {
            animation: ay-search-helper-fadein 0.3s ease-out;
        }
    `);

    // 主初始化函数
    function init() {
        // 初始化海报墙卡片功能
        initMediaCards();

        // 初始化搜索结果页面功能
        initSearchHeader();

        // 初始化详情页面导航栏功能
        initDetailPage();
    }

    // 海报墙卡片功能
    function initMediaCards() {
        const observer = new MutationObserver(() => {
            processCards();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => processCards(), 1000);
    }

    // 处理所有海报卡片
    function processCards() {
        const cards = document.querySelectorAll('.media-card');

        cards.forEach(card => {
            if (card.hasAttribute('data-ay-search-helper-processed')) return;

            card.setAttribute('data-ay-search-helper-processed', 'true');
            card.style.position = 'relative';

            addSearchButtonToCard(card);
        });
    }

    // 添加搜索按钮到海报卡片
    function addSearchButtonToCard(card) {
        const existingBtn = card.querySelector('.ay-search-helper-btn');
        if (existingBtn) existingBtn.remove();

        const title = getCardTitle(card);
        if (!title) return;

        const searchBtn = createSearchButton('搜索爱影', () => {
            searchAy(title);
        });

        card.appendChild(searchBtn);
    }

    // 获取海报卡片标题
    function getCardTitle(card) {
        const titleElement = card.querySelector('.media-card-title');
        if (titleElement?.textContent?.trim()) {
            return titleElement.textContent.trim();
        }

        const imgElement = card.querySelector('img');
        if (imgElement?.alt) {
            return imgElement.alt;
        }

        return null;
    }

    // 创建海报卡片搜索按钮
    function createSearchButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = 'ay-search-helper-btn';
        btn.onclick = (e) => {
            e.stopPropagation();
            onClick();
        };

        setTimeout(() => btn.classList.add('ay-search-helper-btn-added'), config.animationDelay);
        return btn;
    }

    // 搜索结果页面功能
    function initSearchHeader() {
        const checkForElement = setInterval(() => {
            if (config.retryCount >= config.maxRetry) {
                clearInterval(checkForElement);
                return;
            }

            config.retryCount++;

            const searchHeader = document.querySelector('.search-header.v-card');
            if (searchHeader && !searchHeader.querySelector('.ay-search-helper-chip')) {
                clearInterval(checkForElement);
                addSearchButtonToHeader(searchHeader);
            }
        }, config.checkInterval);
    }

    // 在搜索头部卡片添加搜索按钮
    function addSearchButtonToHeader(searchHeader) {
        const searchTagsContainer = searchHeader.querySelector('.search-tags');
        if (!searchTagsContainer) return;

        const searchChip = createSearchChip('搜索爱影', () => {
            const searchTitle = extractSearchTitleFromHeader(searchHeader);
            if (searchTitle) {
                searchAy(searchTitle);
            } else {
                alert('无法获取搜索标题');
            }
        });

        if (searchChip) {
            searchTagsContainer.appendChild(searchChip);
        }
    }

    // 从头部卡片提取搜索标题
    function extractSearchTitleFromHeader(searchHeader) {
        const chipContents = searchHeader.querySelectorAll('.v-chip__content');

        for (const content of chipContents) {
            if (content.textContent.includes('标题:')) {
                return content.textContent.replace('标题:', '').trim();
            }
        }

        return null;
    }

    // 创建搜索芯片按钮
    function createSearchChip(text, onClick) {
        const existingChip = document.querySelector('.search-tag');
        if (!existingChip) return null;

        const chip = existingChip.cloneNode(true);
        chip.classList.add('ay-search-helper-chip');

        const content = chip.querySelector('.v-chip__content');
        if (content) {
            content.textContent = text;
        }

        chip.onclick = (e) => {
            e.stopPropagation();
            onClick();
        };

        setTimeout(() => chip.classList.add('ay-search-helper-chip-added'), 10);
        return chip;
    }

    // 详情页面导航栏功能
    function initDetailPage() {
        if (isDetailPage()) {
            addSearchButtonToNavbar();
        }

        const observer = new MutationObserver(() => {
            if (isDetailPage() && !document.querySelector('.ay-search-btn')) {
                addSearchButtonToNavbar();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 检查是否是详情页面
    function isDetailPage() {
        return window.location.hash.includes('#/media?mediaid=');
    }

    // 添加搜索按钮到导航栏
    function addSearchButtonToNavbar() {
        const existingBtn = document.querySelector('.ay-search-btn');
        if (existingBtn) {
            existingBtn.remove();
        }

        const navbarContainer = document.querySelector('.navbar-content-container');
        if (!navbarContainer) return;

        const buttonContainer = navbarContainer.querySelector('.d-flex.h-14.align-center.mx-1');
        if (!buttonContainer) return;

        const originalSearchBtn = buttonContainer.querySelector('.d-flex.align-center.cursor-pointer.ms-lg-n2');
        if (!originalSearchBtn) return;

        const searchBtn = document.createElement('button');
        searchBtn.textContent = '搜索爱影';
        searchBtn.className = 'ay-search-btn';

        searchBtn.addEventListener('click', function() {
            const title = getTitleFromUrl() || getTitleFromPage();
            if (title) {
                searchAy(title);
            } else {
                alert('无法提取标题信息');
            }
        });

        originalSearchBtn.parentNode.insertBefore(searchBtn, originalSearchBtn.nextSibling);

        setTimeout(() => {
            searchBtn.classList.add('ay-search-btn-added');
        }, 10);
    }

    // 从URL中提取标题参数
    function getTitleFromUrl() {
        const hashParams = window.location.hash.split('?')[1];
        if (!hashParams) return null;

        const urlParams = new URLSearchParams(hashParams);
        const title = urlParams.get('title');

        if (title) {
            let decodedTitle = decodeURIComponent(title);
            if (decodedTitle.includes('&')) {
                decodedTitle = decodedTitle.split('&')[0];
            }
            return decodedTitle;
        }

        return null;
    }

    // 从页面内容提取标题
    function getTitleFromPage() {
        const titleElement = document.querySelector('.v-card-title');
        if (titleElement?.textContent?.trim()) {
            return titleElement.textContent.trim();
        }

        const headingElement = document.querySelector('h1, h2, h3');
        if (headingElement?.textContent?.trim()) {
            return headingElement.textContent.trim();
        }

        return null;
    }

    // 提取适合搜索的标题
    function extractCleanTitle(title) {
        if (!title) return '';

        let cleanedTitle = title.replace(/\s*\(\d{4}\)\s*$/, '');

        const seasonPatterns = [
            /第[一二三四五六七八九十百零0-9]+季/g,
            /第[一二三四五六七八九十百零0-9]+部/g,
            /Season\s*\d+/gi,
            /S\d+/gi
        ];

        seasonPatterns.forEach(pattern => {
            cleanedTitle = cleanedTitle.replace(pattern, '');
        });

        return cleanedTitle.trim();
    }

    // 搜索爱影
    function searchAy(title) {
        if (!title) {
            alert('无法获取标题信息');
            return;
        }

        const cleanTitle = extractCleanTitle(title);
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const left = (screenWidth - config.windowWidth) / 2;
        const top = (screenHeight - config.windowHeight) / 2;

        const windowFeatures = [
            `width=${config.windowWidth}`,
            `height=${config.windowHeight}`,
            `left=${left}`,
            `top=${top}`,
            'scrollbars=yes',
            'resizable=yes',
            'toolbar=no',
            'menubar=no',
            'location=no',
            'status=no'
        ].join(',');

        const searchUrl = `${config.searchUrl}${encodeURIComponent(cleanTitle)}`;
        const newWindow = window.open(searchUrl, '_blank', windowFeatures);

        if (newWindow) {
            newWindow.focus();
        }
    }

    // 监听页面变化
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    processCards();

                    const searchHeader = document.querySelector('.search-header.v-card');
                    if (searchHeader && !searchHeader.querySelector('.ay-search-helper-chip')) {
                        addSearchButtonToHeader(searchHeader);
                    }

                    if (isDetailPage() && !document.querySelector('.ay-search-btn')) {
                        addSearchButtonToNavbar();
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            setupMutationObserver();
        });
    } else {
        init();
        setupMutationObserver();
    }
})();