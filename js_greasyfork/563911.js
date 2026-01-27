// ==UserScript==
// @name         Steam常用功能快捷跳转
// @icon         https://store.steampowered.com/favicon.ico
// @namespace    https://store.steampowered.com/
// @version      1.0
// @description  给Steam商店/社区添加快捷跳转按钮
// @author       sjx01
// @match        https://store.steampowered.com/*
// @match        https://steamcommunity.com/*
// @grant        GM_openInTab
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563911/Steam%E5%B8%B8%E7%94%A8%E5%8A%9F%E8%83%BD%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/563911/Steam%E5%B8%B8%E7%94%A8%E5%8A%9F%E8%83%BD%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        focus: false,
        getButtons: (appid, steamid) => [
            {
                id: 'badges_btn',
                href: `https://steamcommunity.com/profiles/${steamid}/gamecards/${appid}/`,
                name:'徽章'
            },
            {
                id: 'market_btn',
                href: `https://steamcommunity.com/market/search?appid=753&category_753_Game[]=tag_app_${appid}`,
                name:'市场'
            },
            {
                id: 'help_btn',
                href: `https://help.steampowered.com/zh-cn/wizard/HelpWithGame/?appid=${appid}`,
                name:'客服'
            },
/*             {
                id: 'points_btn',
                href: `https://store.steampowered.com/points/shop/app/${appid}`,
                name:'点数商店'
            } */
        ]
    };

    let cachedSteamID = null;
    let isLocked = false;

    /**
     * 获取 SteamID
     */
    const fetchSteamID = () => {
        if (cachedSteamID) return cachedSteamID;

        // 优先从 application_config 获取
        const configEl = document.getElementById('application_config');
        if (configEl && configEl.dataset.userinfo) {
            try {
                const info = JSON.parse(configEl.dataset.userinfo);
                if (info && info.steamid) return (cachedSteamID = info.steamid);
            } catch (e) {}
        }

        // 备用从个人资料链接提取(通用)
        const profileLink = document.querySelector('a[href*="steamcommunity.com/profiles/"]');
        if (profileLink) {
            const match = profileLink.href.match(/profiles\/(\d+)/);
            if (match) return (cachedSteamID = match[1]);
        }

        return null;
    };

    /**
     * 注入按钮
     */
    const injectUI = () => {
        if (isLocked) return;
        isLocked = true;

        // 全局：Key 激活跳转按钮
        if (!document.getElementById('key_reg_nav')) {
            const nav = document.querySelector('.supernav_container');
            if (nav) {
                const a = document.createElement('a');
                a.id = 'key_reg_nav';
                a.className = 'menuitem';
                a.href = 'https://store.steampowered.com/account/registerkey';
                a.innerText = 'key激活';
                nav.appendChild(a);
            }
        }

        // 商店页：自定义功能按钮
        if (location.pathname.includes('/app/')) {
            const target = document.querySelector('.apphub_OtherSiteInfo');
            if (target && !document.getElementById('steam_quick_jump_box')) {
                const appid = location.pathname.split('/')[2];
                const steamid = fetchSteamID();

                if (appid && !isNaN(appid) && steamid) {
                    const fragment = document.createDocumentFragment();
                    const wrapper = document.createElement('span');
                    wrapper.id = 'steam_quick_jump_box';

                    CONFIG.getButtons(appid, steamid).forEach(btn => {
                        const a = document.createElement('a');
                        a.className = 'btnv6_blue_hoverfade btn_medium';
                        a.style.marginRight = '5px';
                        a.title = `跳转到对应${btn.name}界面`;
                        a.innerHTML = `<span>${btn.name}</span>`;
                        a.addEventListener('click', (e) => {
                            e.preventDefault();
                            GM_openInTab(btn.href, { active: CONFIG.focus });
                        });
                        wrapper.appendChild(a);
                    });

                    fragment.appendChild(wrapper);
                    target.prepend(fragment);
                }
            }
        }

        isLocked = false;
    };

    /**
     * 监听器
     */
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                window.requestAnimationFrame(injectUI);
                break;
            }
        }
    });

    const start = () => {
        injectUI();
        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true
        });
    };

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
