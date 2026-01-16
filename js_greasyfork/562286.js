// ==UserScript==
// @name         B站Wiki文件列表编码修复
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  修复B站Wiki中特殊:文件列表页面的编码问题，避免双重编码
// @match        https://wiki.biligame.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562286/B%E7%AB%99Wiki%E6%96%87%E4%BB%B6%E5%88%97%E8%A1%A8%E7%BC%96%E7%A0%81%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/562286/B%E7%AB%99Wiki%E6%96%87%E4%BB%B6%E5%88%97%E8%A1%A8%E7%BC%96%E7%A0%81%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前URL
    const currentUrl = window.location.href;
    const urlObj = new URL(currentUrl);
    const pathname = urlObj.pathname;
    const search = urlObj.search;

    // 检查是否是特殊:文件列表页面
    const checkAndRedirect = () => {
        // 判断是否需要重定向的标志
        let needRedirect = false;
        let targetTitle = '';

        // 情况1: 查询参数中包含title参数
        if (search.includes('title=')) {
            const params = new URLSearchParams(search);
            const titleParam = params.get('title');

            if (titleParam === '特殊:文件列表' ||
                titleParam === '%E7%89%B9%E6%AE%8A:%E6%96%87%E4%BB%B6%E5%88%97%E8%A1%A8') {
                needRedirect = true;
                targetTitle = '特殊%3A文件列表';
            }
        }
        // 情况2: 路径中包含特殊:文件列表或其编码
        else if (pathname.includes('特殊:文件列表') ||
                 pathname.includes('%E7%89%B9%E6%AE%8A:%E6%96%87%E4%BB%B6%E5%88%97%E8%A1%A8') ||
                 pathname.endsWith('/文件列表') ||
                 pathname.includes('/特殊:文件列表')) {
            needRedirect = true;
            targetTitle = '特殊%3A文件列表';
        }

        // 如果不需要重定向，直接返回
        if (!needRedirect) return;

        // 避免双重编码检查
        if (currentUrl.includes('特殊%3A文件列表') ||
            currentUrl.includes('%E7%89%B9%E6%AE%8A%3A%E6%96%87%E4%BB%B6%E5%88%97%E8%A1%A8')) {
            console.log('URL already correctly encoded, skipping redirect.');
            return;
        }

        // 构建新的URL
        let newUrl;

        if (search.includes('title=')) {
            // 处理带有title参数的情况
            const params = new URLSearchParams(search);

            // 应该使用未编码的字符串，让 URLSearchParams 自己编码
            // 而不是传入已经编码的字符串
            const decodedTargetTitle = decodeURIComponent('特殊%3A文件列表'); // 这会得到 "特殊:文件列表"
            params.set('title', decodedTargetTitle); // URLSearchParams 会正确编码为 "特殊%3A文件列表"

            newUrl = urlObj.origin + urlObj.pathname + '?' + params.toString();
        } else {
            // 处理路径形式的情况
            // 提取wiki路径的基础部分
            const pathParts = pathname.split('/');
            const wikiName = pathParts[1]; // 例如 "umamusume"

            // 构建基础URL
            let baseUrl = urlObj.origin + '/' + wikiName + '/index.php?title=' + targetTitle;

            // 保留其他查询参数
            if (search) {
                const otherParams = new URLSearchParams(search);
                otherParams.forEach((value, key) => {
                    if (key !== 'title') {
                        baseUrl += '&' + key + '=' + encodeURIComponent(value);
                    }
                });
            }

            newUrl = baseUrl;
        }

        // 避免重定向到自身
        if (newUrl !== currentUrl) {
            console.log('Redirecting from:', currentUrl);
            console.log('Redirecting to:', newUrl);
            window.location.replace(newUrl);
        }
    };

    // 立即执行检查
    checkAndRedirect();
})();