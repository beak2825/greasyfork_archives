// ==UserScript==
// @name         KaraKeep + SingleFile: X.com Preview Image Fixer
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Optimizes X.com metadata for SingleFile captures, ensuring KaraKeep displays the correct main image (photos/videos/cards) instead of avatars or reply images.
// @author       You
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558197/KaraKeep%20%2B%20SingleFile%3A%20Xcom%20Preview%20Image%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/558197/KaraKeep%20%2B%20SingleFile%3A%20Xcom%20Preview%20Image%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentBestImage = null;

    // --- 核心工具：从 CSS 背景图中提取 URL ---
    function extractUrlFromStyle(style) {
        if (!style) return null;
        const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (match && match[1]) {
            // 忽略 blob: 或 data: 这种无效/临时地址，只取 http 开头的
            if (match[1].startsWith('http')) {
                return match[1];
            }
        }
        return null;
    }

    // --- 核心工具：锁定“主题帖”区域 ---
    function getMainTweetScope() {
        // 1. 获取当前 URL 中的 Tweet ID (例如 18645...)
        const match = window.location.pathname.match(/status\/(\d+)/);
        if (!match) return document; // 如果不是帖子详情页，就退回全局查找

        const tweetId = match[1];

        // 2. 找到页面上所有的推文容器
        const articles = document.querySelectorAll('article[data-testid="tweet"]');

        // 3. 遍历找到那个链接指向当前 URL 的推文 (这就是主题帖)
        for (let article of articles) {
            // 检查 article 内部所有的链接
            const links = article.querySelectorAll('a');
            for (let link of links) {
                if (link.href.includes(tweetId) && link.href.includes('/status/')) {
                    // 找到了包含当前推文 ID 链接的容器，这就是主帖区域！
                    return article;
                }
            }
        }

        // 如果实在找不到，返回 document 作为一个保底，但通常不会走到这里
        return document;
    }

    // --- 核心功能：查找最佳图片 ---
    function findBestImage() {
        // 关键步骤：先锁定搜索范围！
        const scope = getMainTweetScope();
        if (!scope) return null;

        let imageUrl = null;

        // === 优先级 1: 视频封面 (Video Thumbnail) ===
        // 视频通常在 videoComponent 或 videoPlayer 中
        const videoComponents = scope.querySelectorAll('[data-testid="videoComponent"], [data-testid="videoPlayer"]');
        for (let component of videoComponents) {
            // 1.1 尝试找 <video poster="...">
            const video = component.querySelector('video');
            if (video && video.poster && video.poster.startsWith('http')) {
                imageUrl = video.poster;
                break;
            }
            // 1.2 尝试找背景图 (通常 X 用 div 做封面)
            const bgDivs = component.querySelectorAll('div[style*="background-image"]');
            for (let div of bgDivs) {
                const extracted = extractUrlFromStyle(div.getAttribute('style'));
                if (extracted) {
                    imageUrl = extracted;
                    break;
                }
            }
            if (imageUrl) break;
        }

        // === 优先级 2: 普通配图 (Tweet Photo) ===
        if (!imageUrl) {
            const tweetPhotos = scope.querySelectorAll('div[data-testid="tweetPhoto"] img');
            for (let img of tweetPhotos) {
                if (img.src && img.src.startsWith('http')) {
                    imageUrl = img.src;
                    break;
                }
            }
        }

        // === 优先级 3: 外部链接卡片 (Link Card) ===
        if (!imageUrl) {
            const cardMedia = scope.querySelector('[data-testid="card.layoutLarge.media"]');
            if (cardMedia) {
                // 3.1 卡片背景图
                const bgDivs = cardMedia.querySelectorAll('div[style*="background-image"]');
                for (let div of bgDivs) {
                    const extracted = extractUrlFromStyle(div.getAttribute('style'));
                    if (extracted) {
                        imageUrl = extracted;
                        break;
                    }
                }
                // 3.2 卡片 img 标签
                if (!imageUrl) {
                    const img = cardMedia.querySelector('img');
                    if (img && img.src) imageUrl = img.src;
                }
            }
        }

        // === 后期处理：高清化 ===
        if (imageUrl && imageUrl.includes('name=small')) {
            imageUrl = imageUrl.replace('name=small', 'name=large');
        }

        return imageUrl;
    }

    // --- 暴力替换 Meta 标签 ---
    function forceUpdateMeta() {
        const newImage = findBestImage();

        // 如果没找到符合条件的图（说明主帖可能纯文字），不要去用回复的图，保持 null
        if (!newImage && currentBestImage !== null) return;

        if (newImage && newImage !== currentBestImage) {
            currentBestImage = newImage;
            console.log('🎯 [X-Fix] Locked & Loaded Image:', newImage);

            // 1. 清理 React 的标签
            const existingMetas = document.querySelectorAll('meta[property="og:image"]');
            existingMetas.forEach(meta => {
                if (meta.getAttribute('data-sf-override') !== 'true') {
                    meta.remove();
                }
            });

            // 2. 写入我们的标签
            let myMeta = document.querySelector('meta[data-sf-override="true"]');
            if (!myMeta) {
                myMeta = document.createElement('meta');
                myMeta.setAttribute('property', 'og:image');
                myMeta.setAttribute('data-sf-override', 'true');
                document.head.appendChild(myMeta);
            }
            myMeta.content = newImage;

            // 3. 顺便修补 twitter:image
            const twitterImg = document.querySelector('meta[name="twitter:image"]');
            if (twitterImg) twitterImg.content = newImage;
        }
    }

    // --- 执行循环 ---
    setInterval(forceUpdateMeta, 1000);

    // SingleFile 保存前强制执行一次
    window.addEventListener('single-file-on-before-capture-request', (e) => {
        forceUpdateMeta();
    });

})();