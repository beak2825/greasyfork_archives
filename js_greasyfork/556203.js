// ==UserScript==
// @name         电影卡片徽章始终可见
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  将"badge cloud-badge"和"badge magnet-badge"直接显示在电影卡片上，而不是鼠标悬停后才显示
// @author       MiniMax Agent
// @match        https://nullbr.eu.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nullbr.eu.org
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556203/%E7%94%B5%E5%BD%B1%E5%8D%A1%E7%89%87%E5%BE%BD%E7%AB%A0%E5%A7%8B%E7%BB%88%E5%8F%AF%E8%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/556203/%E7%94%B5%E5%BD%B1%E5%8D%A1%E7%89%87%E5%BE%BD%E7%AB%A0%E5%A7%8B%E7%BB%88%E5%8F%AF%E8%A7%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式，确保徽章始终可见
    const style = document.createElement('style');
    style.textContent = `
        /* 确保所有电影卡片中的徽章始终可见 */
        .movie-card .badge {
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
            position: absolute !important;
            z-index: 10 !important;
        }

        /* 网盘徽章样式 */
        .movie-card .badge.cloud-badge {
            top: 8px !important;
            left: 8px !important;
            background: rgba(52, 152, 219, 0.9) !important;
            color: white !important;
            padding: 2px 6px !important;
            border-radius: 3px !important;
            font-size: 11px !important;
            font-weight: bold !important;
        }

        /* 磁力徽章样式 */
        .movie-card .badge.magnet-badge {
            top: 8px !important;
            right: 8px !important;
            background: rgba(46, 204, 113, 0.9) !important;
            color: white !important;
            padding: 2px 6px !important;
            border-radius: 3px !important;
            font-size: 11px !important;
            font-weight: bold !important;
        }

        /* 确保image-container有相对定位，以便徽章可以绝对定位 */
        .movie-card .image-container {
            position: relative !important;
        }

        /* 处理空的徽章（没有内容的） */
        .movie-card .badge:empty {
            display: none !important;
        }

        /* 只显示有内容的网盘和磁力徽章 */
        .movie-card .badge.cloud-badge:not(:empty),
        .movie-card .badge.magnet-badge:not(:empty) {
            display: block !important;
        }
    `;

    document.head.appendChild(style);

    // 监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // 检查新添加的节点是否包含徽章
                    const badges = node.querySelectorAll ? node.querySelectorAll('.badge.cloud-badge, .badge.magnet-badge') : [];
                    badges.forEach(badge => {
                        if (badge.textContent.trim() && !badge.classList.contains('processed')) {
                            badge.classList.add('processed');
                            badge.style.opacity = '1';
                            badge.style.visibility = 'visible';
                            badge.style.display = 'block';
                        }
                    });
                }
            });
        });
    });

    // 开始观察文档变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 立即处理当前页面上所有徽章
    function processBadges() {
        const cloudBadges = document.querySelectorAll('.movie-card .badge.cloud-badge');
        const magnetBadges = document.querySelectorAll('.movie-card .badge.magnet-badge');

        [...cloudBadges, ...magnetBadges].forEach(badge => {
            if (badge.textContent.trim()) {
                badge.style.opacity = '1';
                badge.style.visibility = 'visible';
                badge.style.display = 'block';
                badge.classList.add('processed');
            }
        });
    }

    // 页面加载完成后处理徽章
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processBadges);
    } else {
        processBadges();
    }

    // 延迟执行，确保所有内容都已加载
    setTimeout(processBadges, 1000);
    setTimeout(processBadges, 3000);

    console.log('电影卡片徽章始终可见脚本已启动');
})();