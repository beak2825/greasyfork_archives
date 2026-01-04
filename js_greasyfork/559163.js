// ==UserScript==
// @name         SetXHomeIsFollowing
// @description  强制 X.com 默认显示 Following 标签页
// @match        https://x.com/*
// @noframes
// @inject-into  content
// @version      0.0.21
// @grant        none
// @namespace https://greasyfork.org/users/1548986
// @downloadURL https://update.greasyfork.org/scripts/559163/SetXHomeIsFollowing.user.js
// @updateURL https://update.greasyfork.org/scripts/559163/SetXHomeIsFollowing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hasSwitched = false;

    const trySwitchToFollowing = () => {
        // 如果已经成功切换过，或者当前不是在首页路径，就跳过
        if (hasSwitched || !window.location.href.includes('/home')) return;

        // 寻找包含 "Following" 或 "正在关注" 的 Tab
        // 考虑到多语言环境，我们通过属性和文字深度筛选
        const tabs = document.querySelectorAll('div[role="tab"]');

        tabs.forEach(tab => {
            const text = tab.innerText || "";
            // 匹配英文 "Following" 或中文 "正在关注"
            if (text.includes('Following') || text.includes('正在关注')) {
                const isSelected = tab.getAttribute('aria-selected') === 'true';

                if (isSelected) {
                    // 如果已经是 Following 状态，标记完成并停止
                    hasSwitched = true;
                    return;
                }

                // 执行点击
                tab.click();
                hasSwitched = true;
                console.log('Successfully switched to Following tab.');
            }
        });
    };

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => {
        if (!hasSwitched) {
            trySwitchToFollowing();
        }
    });

    // 开始监听
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 针对 SPA 路由跳转的补丁：当 URL 变化时重置状态
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if (lastUrl.includes('/home')) {
                hasSwitched = false; // 重新回到首页时，允许再次触发切换
            }
        }
    }, 1000);

    // 10秒后自动停止观察以节省性能
    setTimeout(() => observer.disconnect(), 10000);
})();