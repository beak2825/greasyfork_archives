// ==UserScript==
// @name         移除联盟跟踪链接参数
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动清理网页中链接的联盟跟踪参数（affa、aff、ref等）
// @author       You
// @match        https://www.getcheapai.com/*
// @match        *://*/*
// @grant        none
// @license      mit
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559790/%E7%A7%BB%E9%99%A4%E8%81%94%E7%9B%9F%E8%B7%9F%E8%B8%AA%E9%93%BE%E6%8E%A5%E5%8F%82%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/559790/%E7%A7%BB%E9%99%A4%E8%81%94%E7%9B%9F%E8%B7%9F%E8%B8%AA%E9%93%BE%E6%8E%A5%E5%8F%82%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义需要清理的跟踪参数列表
    const trackingParams = [
        'affa',           // 联盟标识
        'aff',            // 联盟
        'affiliate',      // 联盟营销
        'ref',            // 推荐人
        'referrer',       // 推荐来源
        'source',         // 来源
        'utm_source',     // Google Analytics 来源
        'utm_medium',     // Google Analytics 媒介
        'utm_campaign',   // Google Analytics 活动
        'utm_term',       // Google Analytics 关键词
        'utm_content',    // Google Analytics 内容
        'fbclid',         // Facebook 点击 ID
        'gclid',          // Google 点击 ID
        'msclkid',        // Microsoft 点击 ID
        'mc_cid',         // Mailchimp 活动 ID
        'mc_eid',         // Mailchimp 邮件 ID
    ];

    /**
     * 清理 URL 中的跟踪参数
     * @param {string} url - 原始 URL
     * @returns {string} - 清理后的 URL
     */
    function cleanUrl(url) {
        try {
            const urlObj = new URL(url);
            const params = urlObj.searchParams;
            let hasChanges = false;

            // 遍历所有跟踪参数并删除
            trackingParams.forEach(param => {
                if (params.has(param)) {
                    params.delete(param);
                    hasChanges = true;
                }
            });

            // 如果有修改，返回清理后的 URL
            if (hasChanges) {
                return urlObj.toString();
            }
        } catch (e) {
            // 如果不是有效的 URL，返回原始值
            console.warn('无法解析 URL:', url, e);
        }
        return url;
    }

    /**
     * 处理页面中的所有链接
     */
    function processLinks() {
        const links = document.querySelectorAll('a[href]');
        let cleanedCount = 0;

        links.forEach(link => {
            const originalHref = link.href;
            const cleanedHref = cleanUrl(originalHref);

            if (originalHref !== cleanedHref) {
                link.href = cleanedHref;
                cleanedCount++;

                // 添加视觉提示（可选）
                link.style.borderBottom = '2px solid #4CAF50';
                link.title = `已清理跟踪参数\n原始: ${originalHref}\n清理后: ${cleanedHref}`;

                console.log('已清理链接:', {
                    原始: originalHref,
                    清理后: cleanedHref
                });
            }
        });

        if (cleanedCount > 0) {
            console.log(`✅ 共清理 ${cleanedCount} 个包含跟踪参数的链接`);

            // 显示通知（可选）
            showNotification(`已清理 ${cleanedCount} 个跟踪链接`);
        }
    }

    /**
     * 显示页面通知
     * @param {string} message - 通知消息
     */
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(notification);

        // 淡入效果
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // 3秒后自动消失
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * 监听动态添加的链接
     */
    function observeNewLinks() {
        const observer = new MutationObserver((mutations) => {
            let hasNewLinks = false;

            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // 元素节点
                            if (node.tagName === 'A' || node.querySelectorAll('a[href]').length > 0) {
                                hasNewLinks = true;
                            }
                        }
                    });
                }
            });

            if (hasNewLinks) {
                processLinks();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * 拦截点击事件，实时清理链接
     */
    function interceptClicks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link) {
                const originalHref = link.href;
                const cleanedHref = cleanUrl(originalHref);

                if (originalHref !== cleanedHref) {
                    e.preventDefault();
                    link.href = cleanedHref;
                    console.log('点击前清理链接:', {
                        原始: originalHref,
                        清理后: cleanedHref
                    });
                    // 触发清理后的链接
                    window.location.href = cleanedHref;
                }
            }
        }, true);
    }

    // 初始化脚本
    function init() {
        console.log('🚀 联盟链接清理脚本已启动');

        // 处理现有链接
        processLinks();

        // 监听新添加的链接
        observeNewLinks();

        // 拦截点击事件
        interceptClicks();

        console.log('✅ 联盟链接清理脚本初始化完成');
    }

    // 等待 DOM 加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 添加右键菜单功能：手动清理当前页面
    document.addEventListener('contextmenu', (e) => {
        if (e.ctrlKey) { // Ctrl + 右键手动触发清理
            e.preventDefault();
            processLinks();
        }
    });

})();
