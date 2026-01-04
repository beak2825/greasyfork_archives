// ==UserScript==
// @name         Bilibili Opus Magazine Edition | B站专栏杂志版
// @namespace    https://space.bilibili.com/11768481
// @version      1.4
// @description  对b站的专栏ui界面重新排列，使pc端浏览更舒服(大概)
// @author       伊墨墨
// @match        https://www.bilibili.com/opus/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/users/1449730-%E4%BC%8A%E5%A2%A8
// @downloadURL https://update.greasyfork.org/scripts/559498/Bilibili%20Opus%20Magazine%20Edition%20%7C%20B%E7%AB%99%E4%B8%93%E6%A0%8F%E6%9D%82%E5%BF%97%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/559498/Bilibili%20Opus%20Magazine%20Edition%20%7C%20B%E7%AB%99%E4%B8%93%E6%A0%8F%E6%9D%82%E5%BF%97%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 字体引入 (霞鹜文楷-屏幕版，国内CDN) ---
    const fontImport = document.createElement('link');
    fontImport.rel = 'stylesheet';
    fontImport.href = 'https://npm.elemecdn.com/lxgw-wenkai-screen-webfont/style.css';
    document.head.appendChild(fontImport);

    const css = `
        /* === 全局净化与字体 === */
        *{
            font-family: 'LXGW WenKai Screen', 'LXGW WenKai', 'Microsoft YaHei', sans-serif !important;
            color: #2c2c2c !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5)!important;
        }
        body {
            background-color: #f6f7f9 !important;
        }

        /* 隐藏干扰项 */
        #bili-header-container, .bili-header, .right-side-bar,
        .fixed-author-header, .bg, .bgc, .nav-search-bar,
        .opus-module-bottom__share, .opus-module-bottom__feedback,
        .bili-dyn-pic__mask, .bili-dyn-pic__loading,
        .side-toolbar
        { display: none !important; }

        /* === 主容器 (80% 宽度) === */
        #app {
            padding-top: 30px;
            display: flex;
            justify-content: center;
            width: 100%;
        }
        .opus-detail {
            width: 80% !important;
            min-width: 1000px !important;
            max-width: 90% !important;
            background: #fff;
            padding: 60px 4% !important;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.02);
            box-sizing: border-box;
        }

        /* 标题 & 作者 */
        .opus-module-title { text-align: center; margin-bottom: 40px !important; }
        .opus-module-title__text {
            font-family: 'LXGW WenKai Screen', sans-serif !important;
            font-size: 36px !important;
            font-weight: 700 !important;
            color: #111;
        }
        .opus-module-author { justify-content: center !important; margin-bottom: 50px !important; border-bottom: 1px solid #eee; padding-bottom: 20px; }

        /* === 核心内容区 === */
        .opus-module-content {
            display: flex;
            flex-direction: column;
            gap: 40px;
            font-size: 19px !important;
            line-height: 1.8 !important;
        }

        /* 强力消除B站原样式干扰 */
        .opus-module-content p,
        .opus-module-content div,
        .opus-module-content figure {
            margin: 0 !important;
            padding: 0 !important;
        }

        /* =========================================
           FIX: 头图专项修复
           ========================================= */
        .opus-module-top {
            width: 100% !important;
            margin-bottom: 30px !important;
            display: block !important;
            background: transparent !important;
        }
        .opus-module-top .opus-module-top__display,
        .opus-module-top .opus-module-top__album,
        .opus-module-top .opus-module-top__album__cover,
        .opus-module-top .b-img,
        .opus-module-top picture,
        .opus-module-top img {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
            border-radius: 8px !important;
            object-fit: cover !important;
        }

        /* =========================================
           FIX: 视频链接卡片修复 (新增部分)
           ========================================= */
        .opus-para-link-card {
            display: block !important;
            width: 100% !important;
            max-width: 700px !important;
            margin: 30px auto !important;
        }

        /* 恢复卡片内部容器的样式 */
        .bili-dyn-card-ugc {
            display: flex !important;
            flex-direction: row !important;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            text-decoration: none !important;
            transition: all 0.2s;
            cursor: pointer;
        }
        .bili-dyn-card-ugc:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-color: #fb7299;
        }

        /* 封面区域 */
        .bili-dyn-card-ugc__cover {
            width: 190px !important;
            height: 118px !important;
            flex-shrink: 0 !important;
            position: relative;
        }
        .bili-dyn-card-ugc__cover .bili-dyn-pic,
        .bili-dyn-card-ugc__cover img {
            width: 100% !important;
            height: 100% !important;
            border-radius: 0 !important;
        }

        /* 文字详情区域 */
        .bili-dyn-card-ugc__detail {
            flex-grow: 1;
            padding: 12px 16px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
        }
        .bili-dyn-card-ugc__detail__title {
            font-size: 16px !important;
            font-weight: bold !important;
            line-height: 1.5 !important;
            color: #333 !important;
            max-height: 48px;
            overflow: hidden;
            margin-bottom: 8px !important;
        }
        .bili-dyn-card-ugc__detail__stat {
            display: flex;
            gap: 15px;
            font-size: 13px !important;
            color: #999 !important;
        }
        .bili-dyn-card-ugc__duration {
            position: absolute;
            bottom: 6px;
            right: 6px;
            background: rgba(0,0,0,0.6);
            color: #fff !important;
            padding: 0 4px !important;
            border-radius: 4px;
            font-size: 12px !important;
            margin: 0 !important;
        }

        /* =========================================
           TYPE 1: 错落文字组 (Staggered Text)
           ========================================= */
        .group-text-staggered {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: flex-start;
            gap: 2%;
            row-gap: 20px;
        }
        .group-text-staggered p {
            width: 48%;
            background: #fafafa;
            padding: 20px 24px !important;
            border-radius: 8px;
            box-sizing: border-box;
            border: 1px solid #f0f0f0;
        }
        .group-text-staggered p:nth-child(even) {
            transform: translateY(30px);
        }

        /* 表情包修复 */
        .opus-text-rich-emoji img {
            width: 24px !important;
            height: 24px !important;
            vertical-align: middle !important;
            display: inline-block !important;
            margin: 0 2px !important;
            box-shadow: none !important;
            text-shadow: none !important;
            border-radius: 0 !important;
        }

        /* =========================================
           TYPE 2: 左文右图 (P + Pic)
           ========================================= */
        .group-split-row {
            display: flex;
            align-items: flex-start;
            gap: 30px;
            width: 100%;
            background: #fff;
            padding: 10px 0 !important;
        }
        .split-text {
            flex: 1;
            text-align: justify;
            font-size: 19px;
            line-height: 1.8;
        }
        .split-img {
            flex: 0 0 35%;
            height: 220px !important;
            border-radius: 8px;
            overflow: hidden;
            background: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: zoom-in;
            position: relative;
        }
        .split-img .opus-para-pic,
        .split-img .bili-dyn-pic,
        .split-img .b-img,
        .split-img img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            display: block !important;
            margin: 0 !important;
        }

        /* =========================================
           TYPE 3: 九宫格画廊 (Continuous Pics)
           FIX: 单图模式下宽度改为100%，解决缩放不统一问题
           ========================================= */
        .group-gallery {
            display: grid;
            gap: 8px;
            width: 100%;
            margin: 10px 0 !important;
        }
        /* 单张大图：铺满整行 */
        .gallery-cols-1 {
            grid-template-columns: 1fr;
            max-width: 48% !important;

        }
        .gallery-cols-1 .opus-para-pic {
             height: auto !important; /* 单图高度自适应，不做限制 */
             max-height: 800px;
        }
        .gallery-cols-2 { grid-template-columns: repeat(2, 1fr); max-width: 100%; }
        .gallery-cols-3 { grid-template-columns: repeat(3, 1fr); max-width: 100%; }

        .group-gallery .opus-para-pic {
            width: 100% !important;
            min-height: 240px; /* 最小高度 */
            margin: 0 !important;
            overflow: hidden;
            border-radius: 6px;
            cursor: zoom-in;
        }
        .group-gallery .bili-dyn-pic,
        .group-gallery .b-img,
        .group-gallery img {
            width: 100% !important;
            max-height: 300px !important;
            object-fit: cover !important;
            display: block !important;
        }

        /* =========================================
           SIDEBAR: 右上角悬浮劫持
           FIX: 修复按钮内部样式冲突
           ========================================= */
        #custom-sidebar-grid {
            position: fixed;
            top: 40px;
            right: 40px;
            width: 140px;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #eee;
            padding: 10px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
            z-index: 999999;
            backdrop-filter: blur(5px);
        }
        /* 使用 > 选择器，避免影响按钮内部的 div */
        #custom-sidebar-grid > div,
        #custom-sidebar-grid > button,
        #custom-sidebar-grid > .side-toolbar__action {
            display: flex !important;
            justify-content: center;
            align-items: center;
            width: 100% !important;
            height: 40px !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            border-radius: 6px;
            cursor: pointer;
            color: #555;
            overflow: hidden; /* 防止内部溢出 */
            min-width: 0; /* 修复Flex子项溢出 */
        }
        #custom-sidebar-grid > div:hover,
        #custom-sidebar-grid > button:hover {
            background: #f0f0f0 !important;
            color: #fb7299;
        }
        /* 强制图标大小 */
        #custom-sidebar-grid .iconfont,
        #custom-sidebar-grid svg {
            font-size: 20px !important;
            margin: 0 !important;
            width: 20px;
            height: 20px;
            fill: #555;
            pointer-events: none; /* 防止点击图标本身不触发按钮 */
        }
        #custom-sidebar-grid span { display: none !important; }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // --- 2. 核心功能：拦截自动播放 ---
    function stopAutoPlay() {
        const topVideoContainer = document.querySelector('.opus-module-top__video');
        if (!topVideoContainer) return;

        const iframe = topVideoContainer.querySelector('iframe');
        if (iframe) {
            if (iframe.dataset.autoplayStopped === 'true') return;
            let src = iframe.src;
            let newSrc = src;
            if (src.includes('autoplay=1')) {
                newSrc = src.replace('autoplay=1', 'autoplay=0');
            } else if (!src.includes('autoplay=')) {
                const separator = src.includes('?') ? '&' : '?';
                newSrc = src + separator + 'autoplay=0';
            }
            if (newSrc !== src) {
                iframe.src = newSrc;
                console.log('[B站专栏杂志版] 已拦截顶部视频自动播放');
            }
            iframe.dataset.autoplayStopped = 'true';
        }
    }

    // --- 3. 核心逻辑：DOM 归类与重组 ---
    function restructureContent() {
        const contentArea = document.querySelector('.opus-module-content');
        if (!contentArea) return;

        if (contentArea.dataset.isRestructured === 'true') return;

        // 判定是否为“排版用图片”
        const isImg = (n) => {
            if (!n) return false;
            if (n.classList.contains('opus-module-top')) return false;

            // FIX: 排除视频链接卡片
            if (n.classList.contains('opus-para-link-card')) return false;

            if (n.classList.contains('opus-para-pic') || n.tagName === 'FIGURE') return true;
            const img = n.querySelector('img');
            if (img) {
                // 表情包不算图片
                if (img.closest('.opus-text-rich-emoji')) return false;
                return true;
            }
            return false;
        };

        const isText = (n) => {
            return n && n.tagName === 'P' && !isImg(n);
        };

        const rawChildren = Array.from(contentArea.children);
        const validNodes = rawChildren.filter(node => {
            if (node.tagName === 'P') {
                const hasText = node.innerText.replace(/\s/g, '').length > 0;
                const hasImg = node.querySelector('img');
                return hasText || hasImg;
            }
            if (node.classList.contains('opus-para-line')) return false;
            return true;
        });

        const newFragment = document.createDocumentFragment();
        let i = 0;

        while (i < validNodes.length) {
            const node = validNodes[i];

            // === 模式 A: 左文右图 ===
            if (isText(node) && isImg(validNodes[i+1]) && !isImg(validNodes[i+2])) {
                const wrapper = document.createElement('div');
                wrapper.className = 'group-split-row';

                const textDiv = document.createElement('div');
                textDiv.className = 'split-text';
                textDiv.appendChild(node);

                const imgDiv = document.createElement('div');
                imgDiv.className = 'split-img';
                const imgNode = validNodes[i+1];

                if(imgNode.querySelector('.bili-dyn-pic')) imgNode.querySelector('.bili-dyn-pic').removeAttribute('style');
                imgNode.removeAttribute('style');

                imgDiv.appendChild(imgNode);
                wrapper.appendChild(textDiv);
                wrapper.appendChild(imgDiv);
                newFragment.appendChild(wrapper);
                i += 2;
            }
            // === 模式 B: 图片画廊 ===
            else if (isImg(node)) {
                const imgBuffer = [node];
                let j = i + 1;
                while (j < validNodes.length && isImg(validNodes[j])) {
                    imgBuffer.push(validNodes[j]);
                    j++;
                }

                const gallery = document.createElement('div');
                gallery.className = 'group-gallery';
                const count = imgBuffer.length;
                if (count === 1) gallery.classList.add('gallery-cols-1');
                else if (count === 2 || count === 4) gallery.classList.add('gallery-cols-2');
                else gallery.classList.add('gallery-cols-3');

                imgBuffer.forEach(img => {
                    if(img.querySelector('.bili-dyn-pic')) img.querySelector('.bili-dyn-pic').removeAttribute('style');
                    img.removeAttribute('style');
                    gallery.appendChild(img);
                });
                newFragment.appendChild(gallery);
                i = j;
            }
            // === 模式 C: 连续文字 ===
            else if (isText(node)) {
                const textBuffer = [node];
                let k = i + 1;
                while (k < validNodes.length && isText(validNodes[k])) {
                    textBuffer.push(validNodes[k]);
                    k++;
                }

                if (textBuffer.length === 1) {
                    newFragment.appendChild(node);
                } else {
                    const staggeredGroup = document.createElement('div');
                    staggeredGroup.className = 'group-text-staggered';
                    textBuffer.forEach(p => staggeredGroup.appendChild(p));
                    newFragment.appendChild(staggeredGroup);
                }
                i = k;
            }
            else {
                newFragment.appendChild(node);
                i++;
            }
        }

        contentArea.innerHTML = '';
        contentArea.appendChild(newFragment);
        contentArea.dataset.isRestructured = 'true';
    }

    // --- 4. 侧栏劫持逻辑 ---
    function hijackSidebar() {
        const findBar = setInterval(() => {
            const targets = [
                document.querySelector('.right-sidebar-wrap'),
                document.querySelector('.side-toolbar'),
                document.querySelector('.opus-module-stat')
            ];
            const target = targets.find(t => t && t.style.display !== 'none');

            if (target) {
                if(document.getElementById('custom-sidebar-grid')) {
                    target.style.display = 'none';
                    clearInterval(findBar);
                    return;
                }

                const newContainer = document.createElement('div');
                newContainer.id = 'custom-sidebar-grid';
                // 增加选择器广度
                const buttons = target.querySelectorAll('.side-toolbar__action, .share-btn, .opus-module-stat div, button, .tool-item');

                if (buttons.length > 0) {
                    buttons.forEach(btn => newContainer.appendChild(btn));
                } else {
                    Array.from(target.children).forEach(child => newContainer.appendChild(child));
                }

                document.body.appendChild(newContainer);
                target.style.display = 'none';
            }
        }, 800);
        setTimeout(() => clearInterval(findBar), 10000);
    }

    // --- 5. 启动观察 ---
    let hasRestructured = false;
    const observer = new MutationObserver((mutations) => {
        stopAutoPlay();
        if (document.querySelector('.opus-module-content') && !hasRestructured) {
            hasRestructured = true;
            setTimeout(() => {
                restructureContent();
                hijackSidebar();
            }, 500);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();