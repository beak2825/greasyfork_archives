// ==UserScript==
// @name         Emby Toolkit 搜索爱影助手
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  只适用于爱影SVIP用户，在Emby Toolkit页面添加悬停搜索按钮，快速搜索影视资源，请把第7行更改为你自己的Emby Toolkit地址
// @author       ccdfccgfddx
// @match        http://192.168.5.13:5257/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548702/Emby%20Toolkit%20%E6%90%9C%E7%B4%A2%E7%88%B1%E5%BD%B1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/548702/Emby%20Toolkit%20%E6%90%9C%E7%B4%A2%E7%88%B1%E5%BD%B1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置区域 ====================
    const config = {
        searchUrl: 'https://subs.ayclub.vip/index.php?query=',
        windowWidth: 1200,
        windowHeight: 800,
        hoverDelay: 300,
        animationDelay: 10,
        checkInterval: 1000
    };

    // ==================== CSS样式区域 ====================
    GM_addStyle(`
        /* 搜索按钮样式 */
        .ay-search-helper-btn {
            background: linear-gradient(135deg, #5d78ff 0%, #3b5bdb 100%);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 0;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            position: absolute;
            bottom: 4px;
            left: 4px;
            right: 4px;
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
            transform: translateY(5px);
            white-space: nowrap;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            height: 20px;
            line-height: 1;
        }

        .ay-search-helper-btn:hover {
            background: linear-gradient(135deg, #4c6ef5 0%, #364fc7 100%);
            box-shadow: 0 3px 8px rgba(93, 120, 255, 0.5);
            transform: translateY(-1px) !important;
        }

        .ay-search-helper-btn:active {
            transform: translateY(0) !important;
        }

        /* 跑马灯文本容器 */
        .ay-marquee-container {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: center;
            position: relative;
        }

        /* 放大镜图标 */
        .ay-search-icon {
            margin-right: 6px;
            font-size: 11px;
            flex-shrink: 0;
        }

        /* 跑马灯文本 */
        .ay-marquee-text {
            display: inline-block;
            white-space: nowrap;
            animation: ay-marquee 5s linear infinite;
            padding-left: 100%;
        }

        /* 跑马灯动画 */
        @keyframes ay-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
        }

        /* 暂停动画当按钮悬停时 */
        .ay-search-helper-btn:hover .ay-marquee-text {
            animation-play-state: paused;
        }

        /* 电影信息元素悬停效果 */
        .movie-info:hover .ay-search-helper-btn {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0);
        }

        /* 确保电影信息元素有相对定位 */
        .movie-info {
            position: relative !important;
        }

        /* 缺失详情页面按钮样式 */
        .ay-missing-detail-btn {
            background: linear-gradient(135deg, #5d78ff 0%, #3b5bdb 100%);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin-left: 15px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .ay-missing-detail-btn:hover {
            background: linear-gradient(135deg, #4c6ef5 0%, #364fc7 100%);
            box-shadow: 0 3px 8px rgba(93, 120, 255, 0.5);
            transform: translateY(-1px);
        }

        .ay-missing-detail-btn:active {
            transform: translateY(0);
        }
    `);

    // ==================== 功能实现区域 ====================

    // 主初始化函数
    function init() {
        console.log('Emby Toolkit 搜索爱影助手初始化...');
        processMovieInfoElements();
        processMissingDetailElements();

        // 设置定时检查新元素
        setInterval(() => {
            processMovieInfoElements();
            processMissingDetailElements();
        }, config.checkInterval);
    }

    // 处理电影信息元素
    function processMovieInfoElements() {
        const movieInfos = document.querySelectorAll('.movie-info:not([data-ay-processed="true"])');

        movieInfos.forEach(movieInfo => {
            movieInfo.setAttribute('data-ay-processed', 'true');

            // 确保元素有相对定位
            if (getComputedStyle(movieInfo).position === 'static') {
                movieInfo.style.position = 'relative';
            }

            // 添加搜索按钮
            addSearchButtonToMovieInfo(movieInfo);
        });
    }

    // 处理缺失详情元素
    function processMissingDetailElements() {
        const missingDetailHeaders = document.querySelectorAll('.n-card-header__main:not([data-ay-processed="true"])');

        missingDetailHeaders.forEach(header => {
            const headerText = header.textContent.trim();

            // 检查是否是缺失详情标题
            if (headerText.startsWith('缺失详情 - ')) {
                header.setAttribute('data-ay-processed', 'true');

                // 添加搜索按钮到缺失详情标题
                addSearchButtonToMissingDetail(header);
            }
        });
    }

    // 添加到电影信息元素
    function addSearchButtonToMovieInfo(movieInfo) {
        const titleElement = movieInfo.querySelector('.movie-title');
        if (!titleElement) return;

        // 移除已存在的按钮
        const existingBtn = movieInfo.querySelector('.ay-search-helper-btn');
        if (existingBtn) existingBtn.remove();

        // 提取标题
        const titleText = titleElement.textContent.trim();
        const title = extractTitle(titleText);

        if (!title) return;

        // 创建搜索按钮
        const searchBtn = document.createElement('button');
        searchBtn.className = 'ay-search-helper-btn';
        searchBtn.title = `搜索: ${title}`;

        // 创建跑马灯容器
        const marqueeContainer = document.createElement('div');
        marqueeContainer.className = 'ay-marquee-container';

        // 创建放大镜图标
        const searchIcon = document.createElement('span');
        searchIcon.className = 'ay-search-icon';
        searchIcon.textContent = '🔍'; // 保留放大镜符号

        // 创建跑马灯文本
        const marqueeText = document.createElement('span');
        marqueeText.className = 'ay-marquee-text';
        marqueeText.textContent = '搜索爱影';

        // 组装按钮
        marqueeContainer.appendChild(searchIcon);
        marqueeContainer.appendChild(marqueeText);
        searchBtn.appendChild(marqueeContainer);

        searchBtn.onclick = (e) => {
            e.stopPropagation();
            searchAy(title);
        };

        movieInfo.appendChild(searchBtn);
    }

    // 添加到缺失详情标题
    function addSearchButtonToMissingDetail(header) {
        const headerText = header.textContent.trim();

        // 提取标题（去除"缺失详情 - "前缀）
        const title = headerText.replace('缺失详情 - ', '').trim();

        if (!title) return;

        // 移除已存在的按钮
        const existingBtn = header.querySelector('.ay-missing-detail-btn');
        if (existingBtn) existingBtn.remove();

        // 创建搜索按钮
        const searchBtn = document.createElement('button');
        searchBtn.className = 'ay-missing-detail-btn';
        searchBtn.title = `搜索: ${title}`;
        searchBtn.innerHTML = '🔍 搜索爱影';

        searchBtn.onclick = (e) => {
            e.stopPropagation();
            searchAy(title);
        };

        // 将按钮添加到标题后面
        header.appendChild(searchBtn);
    }

    // 提取标题（去除年份和其他信息）
    function extractTitle(fullTitle) {
        if (!fullTitle) return '';

        // 如果标题包含换行符，取第一行
        let title = fullTitle;
        if (title.includes('\n')) {
            title = title.split('\n')[0].trim();
        }

        // 使用新的标题提取函数
        return extractChineseTitle(title);
    }

    // 提取适合搜索的标题
    function extractChineseTitle(title) {
        if (!title) return '';

        // 首先处理标题中的季数信息（但保留主要标题）
        let processedTitle = removeSeasonInfo(title);

        // 常见无关词过滤（保留数字和主要信息）
        const commonFilters = [
            /完整版$/i, /未删减版$/i, /高清版$/i, /蓝光版$/i, /国语版$/i, /粤语版$/i,
            /中文字幕$/i, /英文字幕$/i, /双语字幕$/i, /全网独播$/i, /独家播出$/i,
            /免费观看$/i, /在线观看$/i, /抢先版$/i, /TC版$/i, /TS版$/i, /HD版$/i,
            /BD版$/i, /DVD版$/i, /杜比音效$/i, /超清版$/i, /4K版$/i, /1080P$/i, /720P$/i
        ];

        commonFilters.forEach(pattern => {
            processedTitle = processedTitle.replace(pattern, '');
        });

        // 处理特殊符号和分割符
        processedTitle = processedTitle
            .replace(/[【】\[\]{}()《》「」『』"“”'‘’]/g, ' ') // 中文括号转为空格
            .replace(/\s+/g, ' ') // 多个空格合并为一个
            .trim();

        // 提取主要标题部分（优先保留中文和数字组合）
        const titlePatterns = [
            // 中英混合: 中文 - 英文 或 英文 - 中文
            /^([\u4e00-\u9fa5]+[\d]*.*?)[\s\-—~–]+([a-zA-Z].*)$/,
            /^([a-zA-Z]+[\d]*.*?)[\s\-—~–]+([\u4e00-\u9fa5].*)$/,

            // 包含数字和中文字符的组合
            /^([\u4e00-\u9fa5]+[\d]+[\u4e00-\u9fa5]*)/,
            /^([\u4e00-\u9fa5]*[\d]+[\u4e00-\u9fa5]+)/,

            // 普通中英文匹配
            /^([\u4e00-\u9fa5a-zA-Z0-9\s]+?)[\/\\\|\-_—~∶:﹕︰,，.。;；!！?？]/,
            /^([\u4e00-\u9fa5a-zA-Z0-9\s]+$)/
        ];

        for (const pattern of titlePatterns) {
            const match = processedTitle.match(pattern);
            if (match && match[1]) {
                let result = match[1].trim();
                // 确保结果不是单个无关字符
                if (result.length > 1 && !/^[的之了是之]$/.test(result)) {
                    return result;
                }
            }
        }

        // 如果以上模式都不匹配，尝试提取标点符号前的中文部分
        const beforePunctuation = extractBeforePunctuation(processedTitle);
        if (beforePunctuation && beforePunctuation.length > 1) {
            return beforePunctuation;
        }

        // 最后返回原始处理后的标题（前20个字符）
        return processedTitle.substring(0, 20).trim();
    }

    // 提取标点符号前的中文部分（优化版）
    function extractBeforePunctuation(text) {
        // 保留数字和字母的特殊标点处理
        const punctuationPattern = /[，。；：！？、（）《》【】「」『』""''——…∶:﹕︰,，.。;；!！?？]/;
        const punctuationIndex = text.search(punctuationPattern);

        if (punctuationIndex > 0) {
            let result = text.substring(0, punctuationIndex).trim();
            // 确保不会只返回一个字符（除非是数字）
            if (result.length <= 1 && !/\d/.test(result)) {
                return text; // 返回原文本避免过度截断
            }
            return result;
        }
        return text;
    }

    // 去除季数信息（但保留主要数字信息）
    function removeSeasonInfo(title) {
        const seasonPatterns = [
            /第[一二三四五六七八九十百零0-9]+季/g,
            /第[一二三四五六七八九十百零0-9]+部/g,
            /Season\s*\d+/gi,
            /S\d+/gi,
            /第\s*\d+\s*季/gi,
            /Part\s*\d+/gi,
            /第\s*\d+\s*部分/gi,
            /第\s*[一二三四五六七八九十]+\s*季/gi,
            /第\s*[一二三四五六七八九十]+\s*部/gi
        ];

        let processedTitle = title;
        seasonPatterns.forEach(pattern => {
            processedTitle = processedTitle.replace(pattern, '');
        });

        return processedTitle
            .replace(/\s+/g, ' ')
            .replace(/\s+$/, '')
            .replace(/^\s+/, '')
            .replace(/\s*-\s*$/, '')
            .replace(/^\.+|\.+$/g, '')
            .trim();
    }

    // 搜索爱影
    function searchAy(title) {
        if (!title) {
            console.warn('无法获取标题信息');
            return;
        }

        console.log('搜索爱影:', title);

        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const left = Math.max(0, (screenWidth - config.windowWidth) / 2);
        const top = Math.max(0, (screenHeight - config.windowHeight) / 2);

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

        const searchUrl = `${config.searchUrl}${encodeURIComponent(title)}`;
        const newWindow = window.open(searchUrl, '_blank', windowFeatures);

        if (newWindow) {
            newWindow.focus();
        } else {
            // 如果弹窗被阻止，直接在当前页面打开
            window.location.href = searchUrl;
        }
    }

    // ==================== 初始化区域 ====================

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // 如果页面已经加载完成，直接初始化
        setTimeout(init, 1000);
    }

    // 监听页面变化（用于单页应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // 页面URL变化时重新初始化
            setTimeout(init, 500);
        }
    }).observe(document, { subtree: true, childList: true });

})();