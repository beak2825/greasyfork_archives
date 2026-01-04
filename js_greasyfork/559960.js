// ==UserScript==
// @name         FC2CM 封面图片显示
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  在FC2CM网站显示封面图片
// @author       You
// @match        https://fc2cm.com/
// @match        https://fc2cm.com/?c=*
// @match        https://fc2cm.com/?p=*
// @match        https://fc2cm.com/*?p=*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559960/FC2CM%20%E5%B0%81%E9%9D%A2%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/559960/FC2CM%20%E5%B0%81%E9%9D%A2%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 缓存对象，用于存储已获取的OG:image图片
    let imageCache = GM_getValue('fc2cm_image_cache', {});
    // 存储当前正在处理的请求，避免重复请求
    const pendingRequests = new Map();
    // 最大并发请求数
    const MAX_CONCURRENT_REQUESTS = 1;
    // 当前正在进行的请求数
    let currentRequests = 0;
    // 请求队列
    const requestQueue = [];

    // 获取文章ID
    function getArticleId(url) {
        const match = url.match(/[?&]p=(\d+)/);
        return match ? match[1] : null;
    }

    // 从缓存获取图片
    function getCachedImage(articleId) {
        const cached = imageCache[articleId];
        // 检查缓存是否过期（24小时）
        if (cached && cached.timestamp && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
            return cached.url;
        }
        return null;
    }

    // 保存图片到缓存
    function cacheImage(articleId, imageUrl) {
        imageCache[articleId] = {
            url: imageUrl,
            timestamp: Date.now()
        };
        GM_setValue('fc2cm_image_cache', imageCache);
    }

    // 清理过期的缓存
    function cleanupCache() {
        const now = Date.now();
        let hasChanges = false;

        for (const articleId in imageCache) {
            const cached = imageCache[articleId];
            if (cached.timestamp && now - cached.timestamp > 7 * 24 * 60 * 60 * 1000) { // 7天过期
                delete imageCache[articleId];
                hasChanges = true;
            }
        }

        if (hasChanges) {
            GM_setValue('fc2cm_image_cache', imageCache);
        }
    }

    // 获取文章的OG:image
    async function fetchOgImage(articleId) {
        // 检查是否已经在请求中
        if (pendingRequests.has(articleId)) {
            return pendingRequests.get(articleId);
        }

        // 创建新的请求Promise
        const requestPromise = new Promise(async (resolve, reject) => {
            try {
                // 使用fetch获取页面内容，设置超时
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

                const response = await fetch(`https://fc2cm.com/?p=${articleId}`, {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'text/html',
                        'Cache-Control': 'max-age=0'
                    }
                });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const ogImageMeta = doc.querySelector('meta[property="og:image"]');

                if (ogImageMeta) {
                    const imageUrl = ogImageMeta.getAttribute('content');
                    if (imageUrl && imageUrl.startsWith('http')) {
                        cacheImage(articleId, imageUrl);
                        resolve(imageUrl);
                    } else {
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            } catch (error) {
                console.warn(`获取文章 ${articleId} 的OG:image失败:`, error.message);
                resolve(null);
            }
        });

        // 将请求添加到pending列表
        pendingRequests.set(articleId, requestPromise);

        // 请求完成后清理
        requestPromise.finally(() => {
            pendingRequests.delete(articleId);
        });

        return requestPromise;
    }

    // 处理单个图片的替换
    async function processImage(img, articleId) {
        // 检查是否是默认图片
        if (!img.src.includes('noimg_') && !img.src.includes('image/noimg')) {
            return;
        }

        // 先从缓存获取
        let imageUrl = getCachedImage(articleId);

        if (imageUrl) {
            // 有缓存，直接替换
            replaceImage(img, imageUrl);
        } else {
            // 没有缓存，加入队列
            requestQueue.push({ img, articleId });
            processQueue();
        }
    }

    // 处理队列中的请求
    async function processQueue() {
        if (currentRequests >= MAX_CONCURRENT_REQUESTS || requestQueue.length === 0) {
            return;
        }

        const { img, articleId } = requestQueue.shift();
        currentRequests++;

        // 显示加载状态
        img.style.opacity = '0.7';

        try {
            const imageUrl = await fetchOgImage(articleId);
            if (imageUrl) {
                replaceImage(img, imageUrl);
            } else {
                // 恢复原图
                img.style.opacity = '1';
            }
        } catch (error) {
            console.warn(`处理图片 ${articleId} 失败:`, error);
            img.style.opacity = '1';
        } finally {
            currentRequests--;
            // 处理下一个
            setTimeout(processQueue, 1000); // 延迟1000ms处理下一个
        }
    }

    // 替换图片
    function replaceImage(img, imageUrl) {
        // 创建新图片预加载
        const newImg = new Image();
        newImg.src = imageUrl;

        newImg.onload = () => {
            img.src = imageUrl;
            img.style.opacity = '1';
            img.style.cursor = 'pointer';

            // 点击图片查看大图
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(imageUrl, '_blank');
            });
        };

        newImg.onerror = () => {
            img.style.opacity = '1';
            // 如果图片加载失败，从缓存中删除
            const articleId = getArticleId(img.closest('a').href);
            if (articleId && imageCache[articleId]) {
                delete imageCache[articleId];
                GM_setValue('fc2cm_image_cache', imageCache);
            }
        };
    }

    // 替换列表页面的图片
    function replaceListImages() {
        // 清理过期的缓存
        cleanupCache();

        // 查找所有包含文章链接的图片
        const articleLinks = document.querySelectorAll('a[href*="?p="]');

        articleLinks.forEach((link) => {
            const articleId = getArticleId(link.href);
            if (!articleId) return;

            const img = link.querySelector('img');
            if (!img) return;

            processImage(img, articleId);
        });

        console.log(`找到 ${articleLinks.length} 个文章链接，开始替换图片...`);
    }

    // 在文章页面显示OG:image
    function showArticleOgImage() {
        // 查找OG:image meta标签
        const ogImageMeta = document.querySelector('meta[property="og:image"]');

        if (ogImageMeta) {
            const imageUrl = ogImageMeta.getAttribute('content');

            if (imageUrl && imageUrl.startsWith('http')) {
                // 创建图片元素
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = '';
                img.style.cssText = `
                    max-width: 100%;
                    height: auto;
                    display: block;
                    cursor: pointer;
                `;

                // 点击图片查看原图
                img.addEventListener('click', function() {
                    window.open(imageUrl, '_blank');
                });

                // 添加图片加载错误处理
                img.onerror = function() {
                    img.style.display = 'none';
                };

                // 尝试找到合适的位置插入图片
                let insertionPoint = document.querySelector('main, article, .content, #content, .post-content, .entry-content, .article-content');

                if (!insertionPoint) {
                    insertionPoint = document.body;
                }

                // 插入图片元素
                if (insertionPoint === document.body) {
                    document.body.insertBefore(img, document.body.firstChild);
                } else if (insertionPoint) {
                    insertionPoint.insertBefore(img, insertionPoint.firstChild);
                } else {
                    document.body.insertBefore(img, document.body.firstChild);
                }

                // 缓存当前文章的图片
                const articleId = getArticleId(window.location.href);
                if (articleId) {
                    cacheImage(articleId, imageUrl);
                }

                console.log('在文章页面显示OG:image:', imageUrl);
            }
        }
    }

    // 主函数
    function main() {
        const url = window.location.href;

        // 检查是列表页面还是文章页面
        if (url.includes('?p=')) {
            // 文章页面
            window.addEventListener('load', () => {
                setTimeout(showArticleOgImage, 1000); // 延迟1000ms执行，确保页面完全加载
            });
        } else {
            // 列表页面（首页或分类页面）
            window.addEventListener('load', () => {
                // 初始替换
                replaceListImages();

                // 监听DOM变化（对于动态加载的内容）
                const observer = new MutationObserver((mutations) => {
                    let shouldUpdate = false;
                    for (const mutation of mutations) {
                        if (mutation.addedNodes.length > 0) {
                            shouldUpdate = true;
                            break;
                        }
                    }

                    if (shouldUpdate) {
                        setTimeout(replaceListImages, 1000); // 延迟1秒执行，确保新内容完全加载
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                // 滚动时检查是否需要更新图片
                let scrollTimer;
                window.addEventListener('scroll', () => {
                    clearTimeout(scrollTimer);
                    scrollTimer = setTimeout(() => {
                        replaceListImages();
                    }, 1000);
                });
            });
        }
    }

    // 运行主函数
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();