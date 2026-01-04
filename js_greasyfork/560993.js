// ==UserScript==
// @name         E宝的爱标识助手
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  在 Steam 商店详情页、主页、搜索页、愿望单等醒目标识 Epic 已送过的游戏。支持通过油猴菜单开关标题标识。
// @author       biackezio
// @icon         https://keylol.com/favicon.ico
// @match        https://store.steampowered.com/*
// @match        https://keylol.com/t596303-1-1
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560993/E%E5%AE%9D%E7%9A%84%E7%88%B1%E6%A0%87%E8%AF%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560993/E%E5%AE%9D%E7%9A%84%E7%88%B1%E6%A0%87%E8%AF%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEYLOL_URL = 'https://keylol.com/t596303-1-1';
    const STORAGE_KEY = 'epic_freebie_ids';
    const CONFIG_TITLE_SHOW = 'show_title_badge';

    // --- 1. 油猴菜单注册 ---

    // 同步数据菜单
    GM_registerMenuCommand("🔄 更新 Epic 赠送游戏名单", () => {
        GM_openInTab(KEYLOL_URL, { active: true });
    });

    // 标题标识开关逻辑
    let isTitleBadgeEnabled = GM_getValue(CONFIG_TITLE_SHOW, true);
    GM_registerMenuCommand(`${isTitleBadgeEnabled ? '✅' : '❌'} 显示标题旁粉色标识`, () => {
        GM_setValue(CONFIG_TITLE_SHOW, !isTitleBadgeEnabled);
        window.location.reload();
    });

    const currentUrl = window.location.href;

    // --- 2. 其乐页面抓取逻辑 ---
    if (currentUrl.includes('keylol.com')) {
        const steamLinks = document.querySelectorAll('a[href*="store.steampowered.com/app/"]');
        const freebieIds = new Set();
        steamLinks.forEach(link => {
            const match = link.href.match(/\/app\/(\d+)/);
            if (match) freebieIds.add(match[1]);
        });
        if (freebieIds.size > 0) {
            GM_setValue(STORAGE_KEY, Array.from(freebieIds));
            alert(`成功！已识别并存储 ${freebieIds.size} 个 Epic 限免游戏 ID。`);
        }
        return;
    }

    // --- 3. UI 组件创建 ---

    const freebieSet = new Set(GM_getValue(STORAGE_KEY, []));
    if (freebieSet.size === 0) return;

    // 创建左下角浮窗
    function createFloatingNotice() {
        if (document.getElementById('epic-float-notice')) return;
        const notice = document.createElement('div');
        notice.id = 'epic-float-notice';
        notice.innerText = '🎁 Epic 曾限时免费赠送此游戏';
        notice.style = `
            position: fixed; bottom: 20px; left: 20px; z-index: 9999;
            background: #ff69b4; color: white; padding: 12px 20px;
            border-radius: 8px; font-weight: bold; font-size: 14px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            border: 2px solid white; animation: slideIn 0.5s ease-out;
        `;
        const style = document.createElement('style');
        style.innerHTML = `@keyframes slideIn { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
        document.head.appendChild(style);
        document.body.appendChild(notice);
    }

    // 普通行内标签
    const createBadge = (fontSize = '12px', margin = '0 5px') => {
        const badge = document.createElement('span');
        badge.innerText = '❤️ E宝的爱';
        badge.className = 'epic-free-badge';
        badge.style = `
            background: #ff69b4; color: white; padding: 2px 8px;
            font-size: ${fontSize}; border-radius: 4px; margin: ${margin};
            font-weight: bold; display: inline-block; vertical-align: middle;
            box-shadow: 0 0 6px rgba(0,0,0,0.2); pointer-events: none;
        `;
        return badge;
    };

    // 列表页绝对定位标签
    const createAbsoluteBadge = () => {
        const badge = document.createElement('div');
        badge.innerText = '❤️ E宝的爱';
        badge.className = 'epic-free-badge-abs';
        badge.style = `
            position: absolute; left: 0; top: 50%; transform: translateY(-50%);
            background: #ff69b4; color: white; padding: 2px 6px;
            font-size: 10px; border-radius: 0 4px 4px 0; font-weight: bold;
            z-index: 10; pointer-events: none; box-shadow: 2px 0 5px rgba(0,0,0,0.3);
        `;
        return badge;
    };

    // --- 4. 核心处理逻辑 ---
    function processSteamPages() {
        const isAppPage = currentUrl.includes('/app/');
        const appIdMatch = currentUrl.match(/\/app\/(\d+)/);
        const pageAppId = appIdMatch ? appIdMatch[1] : null;

        // A. 商店详情页：检查主游戏 ID
        if (isAppPage && pageAppId && freebieSet.has(pageAppId)) {
            // 浮窗始终开启
            createFloatingNotice();

            // 标题旁标识受菜单开关控制
            if (isTitleBadgeEnabled) {
                const storeTitle = document.querySelector('#appHubAppName:not(.epic-checked)');
                if (storeTitle) {
                    storeTitle.classList.add('epic-checked');
                    storeTitle.appendChild(createBadge('14px', '0 15px'));
                }
            }
        }

        // B. 搜索页、首页盒子列表
        document.querySelectorAll('[data-ds-appid]:not(.epic-checked)').forEach(node => {
            const appId = node.getAttribute('data-ds-appid');
            node.classList.add('epic-checked');

            // 详情页时，跳过对主标题所在节点的重复处理
            if (isAppPage && appId === pageAppId) return;

            if (freebieSet.has(appId)) {
                if (window.getComputedStyle(node).position === 'static') {
                    node.style.position = 'relative';
                }
                node.appendChild(createAbsoluteBadge());
            }
        });

        // C. 愿望单页面适配
        document.querySelectorAll('.wishlist_row:not(.epic-checked)').forEach(item => {
            item.classList.add('epic-checked');
            const link = item.querySelector('a[href*="/app/"]');
            if (link) {
                const appId = link.href.match(/\/app\/(\d+)/)?.[1];
                if (freebieSet.has(appId)) {
                    const titleContainer = item.querySelector('.content .title');
                    if (titleContainer) titleContainer.appendChild(createBadge());
                }
            }
        });
    }

    // --- 5. 启动与监听 ---
    processSteamPages();

    new MutationObserver(() => {
        processSteamPages();
    }).observe(document.body, { childList: true, subtree: true });

})();