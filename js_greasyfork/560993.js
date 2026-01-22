// ==UserScript==
// @name         E宝的爱标识助手
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  在 Steam 商店详情页显示原生风格横条标识与浮动提醒，标识 Epic 已送过的游戏。优化宽度及视觉样式。
// @author       biackezio+gemini
// @icon         https://keylol.com/favicon.ico
// @match        https://store.steampowered.com/*
// @match        https://keylol.com/t596303-1-1
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560993/E%E5%AE%9D%E7%9A%84%E7%88%B1%E6%A0%87%E8%AF%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560993/E%E5%AE%9D%E7%9A%84%E7%88%B1%E6%A0%87%E8%AF%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEYLOL_URL = 'https://keylol.com/t596303-1-1';
    const STORAGE_KEY = 'epic_freebie_ids';

    // ==========================================
    // 【手动补充数据】包含您提供的 12 个 ID
    // ==========================================
    const MANUAL_FREEBIE_IDS = ['690640','1564220','822094','750920','391220','203160','362960','346940','234650','300550','49520','261640'];

    // --- 1. 样式精修 ---
    GM_addStyle(`
        /* 原生风格横条标识 */
        .game_area_epic_love_ctn {
            background: linear-gradient(to right, #ff69b4, #ff85c2) !important;
            color: #ffffff !important;
            margin: 10px auto !important;
            max-width: 1200px !important;
            display: flex;
            align-items: center;
            padding: 12px 16px;
            border-radius: 4px;
            border-left: 5px solid #d81b60;
            font-family: "Motiva Sans", Arial, Helvetica, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            box-sizing: border-box;
            clear: both;
        }
        .epic_love_flag {
            background-color: rgba(0, 0, 0, 0.2);
            padding: 3px 10px;
            border-radius: 3px;
            margin-right: 15px;
            font-weight: 800;
            font-size: 10px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .epic_love_text {
            font-size: 15px;
            font-weight: 500;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            flex-grow: 1;
        }

        /* 左下角浮动提醒  */
        #epic-float-notice {
            position: fixed; bottom: 20px; left: 20px; z-index: 9999;
            background: #ff69b4; color: white; padding: 12px 20px;
            border-radius: 8px; font-weight: bold; font-size: 14px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            border: 2px solid white; animation: slideIn 0.5s ease-out;
        }
        @keyframes slideIn { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        /* 列表页小标签 */
        .epic-free-badge-abs {
            position: absolute; left: 0; top: 50%; transform: translateY(-50%);
            background: #ff69b4; color: white; padding: 2px 6px;
            font-size: 10px; border-radius: 0 4px 4px 0; font-weight: bold;
            z-index: 10; pointer-events: none; box-shadow: 2px 0 5px rgba(0,0,0,0.3);
        }
    `);

    // --- 2. 油猴菜单 ---
    GM_registerMenuCommand("🔄 更新 Epic 赠送游戏名单", () => {
        GM_openInTab(KEYLOL_URL, { active: true });
    });

    const currentUrl = window.location.href;

    // --- 3. 数据抓取（其乐论坛） ---
    if (currentUrl.includes('keylol.com')) {
        const steamLinks = document.querySelectorAll('a[href*="store.steampowered.com/app/"]');
        const freebieIds = new Set();
        steamLinks.forEach(link => {
            const match = link.href.match(/\/app\/(\d+)/);
            if (match) freebieIds.add(match[1]);
        });
        if (freebieIds.size > 0) {
            GM_setValue(STORAGE_KEY, Array.from(freebieIds));
            alert(`成功！已识别并存储 ${freebieIds.size} 个游戏 ID。`);
        }
        return;
    }

    const scrapedIds = GM_getValue(STORAGE_KEY, []);
    const freebieSet = new Set([...scrapedIds, ...MANUAL_FREEBIE_IDS]);
    if (freebieSet.size === 0) return;

    // --- 4. 渲染组件 ---

    // 原生风格横条
    function createEpicBanner() {
        if (document.getElementById('epic-love-banner')) return;
        const target = document.querySelector('.queue_overflow_ctn');
        if (!target) return;

        const banner = document.createElement('div');
        banner.id = 'epic-love-banner';
        banner.className = 'game_area_epic_love_ctn';
        banner.innerHTML = `
            <div class="epic_love_flag">EPIC FREEBIE</div>
            <div class="epic_love_text">❤️ E宝的爱：此游戏曾出现在 Epic 限时免费赠送名单中，请检查您的 Epic 库。</div>
        `;
        target.parentNode.insertBefore(banner, target.nextSibling);
    }

    // 左下角浮动提醒
    function createFloatingNotice() {
        if (document.getElementById('epic-float-notice')) return;
        const notice = document.createElement('div');
        notice.id = 'epic-float-notice';
        notice.innerText = '🎁 Epic 曾限时免费赠送此游戏';
        document.body.appendChild(notice);
    }

    // 列表页绝对定位标签
    const createAbsoluteBadge = () => {
        const badge = document.createElement('div');
        badge.innerText = '❤️ E宝的爱';
        badge.className = 'epic-free-badge-abs';
        return badge;
    };

    // --- 5. 核心逻辑 ---
    function processSteamPages() {
        const isAppPage = currentUrl.includes('/app/');
        const appIdMatch = currentUrl.match(/\/app\/(\d+)/);
        const pageAppId = appIdMatch ? appIdMatch[1] : null;

        // 详情页处理：显示横条与浮动标识
        if (isAppPage && pageAppId && freebieSet.has(pageAppId)) {
            createEpicBanner();
            createFloatingNotice();
        }

        // 首页、搜索页等列表处理
        document.querySelectorAll('[data-ds-appid]:not(.epic-checked)').forEach(node => {
            const appId = node.getAttribute('data-ds-appid');
            node.classList.add('epic-checked');
            if (isAppPage && appId === pageAppId) return;
            if (freebieSet.has(appId)) {
                if (window.getComputedStyle(node).position === 'static') node.style.position = 'relative';
                node.appendChild(createAbsoluteBadge());
            }
        });

        // 愿望单处理
        document.querySelectorAll('.wishlist_row:not(.epic-checked)').forEach(item => {
            item.classList.add('epic-checked');
            const link = item.querySelector('a[href*="/app/"]');
            if (link) {
                const appId = link.href.match(/\/app\/(\d+)/)?.[1];
                if (freebieSet.has(appId)) {
                    const titleContainer = item.querySelector('.content .title');
                    if (titleContainer) {
                        const badge = document.createElement('span');
                        badge.innerText = '❤️ E宝的爱';
                        badge.style = `background: #ff69b4; color: white; padding: 2px 8px; font-size: 12px; border-radius: 4px; margin-left: 5px; font-weight: bold;`;
                        titleContainer.appendChild(badge);
                    }
                }
            }
        });
    }

    processSteamPages();
    new MutationObserver(processSteamPages).observe(document.body, { childList: true, subtree: true });

})();
