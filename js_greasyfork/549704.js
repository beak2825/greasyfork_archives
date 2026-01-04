// ==UserScript==
// @name         微博高级清理器
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  隐藏微博右侧边栏、移除垃圾内容，并支持选择性屏蔽图片视频
// @author       Enhanced
// @license      MIT
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @match        https://*.weibo.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549704/%E5%BE%AE%E5%8D%9A%E9%AB%98%E7%BA%A7%E6%B8%85%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/549704/%E5%BE%AE%E5%8D%9A%E9%AB%98%E7%BA%A7%E6%B8%85%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 状态管理 - 默认开启屏蔽 =====
    let blockImages = true;
    let blockVideos = true;

    // ===== 第一部分：优化的CSS样式隐藏右侧边栏 =====
    const style = document.createElement('style');
    style.textContent = `
        /* Hide the right sidebar - 更精确的选择器避免误伤图片 */
        .Main_side_i7Vti:not(.Main_main_i7Vti),
        [class*='rightSide']:not([class*='content']):not([class*='feed']),
        [class*='Side_sideBox']:not([class*='media']),
        .Right_person_1UjYy,
        .woo-picture-slot:empty {
            display: none !important;
        }

        /* 控制面板样式 */
        .weibo-control-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            font-size: 11px;
            backdrop-filter: blur(5px);
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .weibo-control-row {
            display: flex;
            align-items: center;
            gap: 6px;
            margin: 3px 0;
        }

        .weibo-control-label {
            color: #666;
            font-size: 11px;
            white-space: nowrap;
        }

        .weibo-toggle-btn {
            width: 36px;
            height: 18px;
            border-radius: 9px;
            border: none;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
            font-size: 9px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .weibo-toggle-btn.active {
            background: #4CAF50;
            color: white;
        }

        .weibo-toggle-btn.inactive {
            background: #ddd;
            color: #999;
        }

        .weibo-toggle-btn:hover {
            opacity: 0.8;
        }

        .weibo-footer-link {
            text-align: center;
            margin-top: 5px;
            font-size: 10px;
        }

        .weibo-footer-link a {
            color: #999;
            text-decoration: none;
        }

        .weibo-footer-link a:hover {
            color: #666;
            text-decoration: underline;
        }

        /* 图片视频屏蔽样式 - 排除头像，完全隐藏不占空间 */
        .weibo-blocked-images img:not([class*="avatar"]):not([class*="Avatar"]):not([src*="avatar"]) {
            display: none !important;
            height: 0 !important;
            width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .weibo-blocked-images [class*="pic"]:not([class*="avatar"]),
        .weibo-blocked-images [class*="image"]:not([class*="avatar"]),
        .weibo-blocked-images [class*="Photo"]:not([class*="avatar"]) {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .weibo-blocked-videos video,
        .weibo-blocked-videos [class*="video"]:not([class*="avatar"]),
        .weibo-blocked-videos [class*="Video"]:not([class*="avatar"]),
        .weibo-blocked-videos [class*="media"]:not([class*="avatar"]) {
            display: none !important;
            height: 0 !important;
            width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* 确保媒体容器也不占空间 */
        .weibo-blocked-images [class*="media"]:has(img:not([class*="avatar"])):not(:has([class*="avatar"])),
        .weibo-blocked-videos [class*="media"]:has(video) {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }
    `;
    document.head.appendChild(style);

    // ===== 创建控制面板 =====
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.className = 'weibo-control-panel';
        panel.innerHTML = `
            <div class="weibo-control-row">
                <span class="weibo-control-label">纯文字微博</span>
                <button id="toggleImages" class="weibo-toggle-btn active" title="图片开关">🖼️</button>
                <button id="toggleVideos" class="weibo-toggle-btn active" title="视频开关">🎥</button>
            </div>
            <div class="weibo-footer-link">
                <a href="https://baidou.work" target="_blank">baidou.work</a>
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        document.getElementById('toggleImages').onclick = toggleImages;
        document.getElementById('toggleVideos').onclick = toggleVideos;

        // 初始状态设置为屏蔽
        document.body.classList.add('weibo-blocked-images');
        document.body.classList.add('weibo-blocked-videos');
    }

    // ===== 图片视频控制功能 =====
    function toggleImages() {
        blockImages = !blockImages;
        const btn = document.getElementById('toggleImages');

        if (blockImages) {
            document.body.classList.add('weibo-blocked-images');
            btn.className = 'weibo-toggle-btn active';
        } else {
            document.body.classList.remove('weibo-blocked-images');
            btn.className = 'weibo-toggle-btn inactive';
        }

        console.log(`[weibo-control] 图片屏蔽: ${blockImages ? '开启' : '关闭'}`);
    }

    function toggleVideos() {
        blockVideos = !blockVideos;
        const btn = document.getElementById('toggleVideos');

        if (blockVideos) {
            document.body.classList.add('weibo-blocked-videos');
            btn.className = 'weibo-toggle-btn active';
        } else {
            document.body.classList.remove('weibo-blocked-videos');
            btn.className = 'weibo-toggle-btn inactive';
        }

        console.log(`[weibo-control] 视频屏蔽: ${blockVideos ? '开启' : '关闭'}`);
    }

    // ===== 第二部分：动态移除垃圾内容 =====

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this,
                  args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    // Filter out spam items
    function filterSpamItems() {
        try {
            const items = document.querySelectorAll(".vue-recycle-scroller__item-view");
            if (!items.length) return;

            let stats = { votes: 0, recommends: 0, bloggers: 0, voteLinks: 0 };

            items.forEach((item) => {
                const voteElement = item.querySelector('[class^="card-vote"]');
                const wbproTags = item.querySelectorAll(".wbpro-tag");
                const recommendTag = wbproTags
                    ? Array.from(wbproTags).find(
                        (tag) =>
                            tag.textContent &&
                            (tag.textContent.includes("推荐") || tag.textContent.includes("荐读"))
                      )
                    : null;

                const bloggerTitle = item.querySelector('[class^="title_title_"]');
                const isBloggerRecommend =
                      bloggerTitle && bloggerTitle.textContent.includes("你常看的优质博主");

                const voteLinks = item.querySelectorAll('a[href*="vote.weibo.com"]');
                const hasVoteLink = voteLinks.length > 0;

                if (voteElement || recommendTag || isBloggerRecommend || hasVoteLink) {
                    if (voteElement) stats.votes++;
                    if (recommendTag) stats.recommends++;
                    if (isBloggerRecommend) stats.bloggers++;
                    if (hasVoteLink) stats.voteLinks++;
                    item.remove();
                }
            });

            if (stats.votes || stats.recommends || stats.bloggers || stats.voteLinks) {
                console.log(
                    `[weibo-cleaner] 已移除: ${stats.votes}个投票, ${stats.recommends}个推荐/引荐, ${stats.bloggers}个你常看的优质博主, ${stats.voteLinks}个投票链接`
                );
            }
        } catch (error) {
            console.error("[weibo-cleaner] 清理过程中出错:", error);
        }
    }

    // Debounced filter function
    const debouncedClean = debounce(filterSpamItems, 300);

    // 观察DOM变化
    function observeDOM() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    debouncedClean();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Initial filtering
        debouncedClean();
    }

    // ===== 初始化 =====
    function init() {
        createControlPanel();
        observeDOM();
    }

    // 页面加载完成后开始
    if (document.readyState === "complete" || document.readyState === "interactive") {
        init();
    } else {
        window.addEventListener("DOMContentLoaded", init);
    }
})();