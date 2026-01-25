// ==UserScript==
// @name         Bilibili 界面优化
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  支持滑块控制加载个数，整合隐藏项，自动修正收藏/历史预览窗向右偏移超出屏幕的问题
// @author       Jun Loye
// @match        *://www.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563987/Bilibili%20%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/563987/Bilibili%20%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getConfig = (key, dflt) => GM_getValue(key, dflt);
    const setConfig = (key, val) => GM_setValue(key, val);

    // 1. 配置项定义
    const configItems = [
        {
            label: "首页顶部 Banner",
            selector: ".bili-header__banner, #app > div.bili-feed4 > div.bili-header.large-header > div.bili-header__banner",
            key: "hide_header_banner"
        },
        {
            label: "首页频道分区",
            selector: "#app > div.bili-feed4 > div.header-channel, .bili-header__channel, .header-channel-fixed",
            key: "hide_header_channel"
        },
        {
            label: "顶部导航项",
            key: "group_top_nav",
            isGroup: true,
            subItems: [
                { label: "游戏中心", selector: "#app > div.bili-feed4 > div.bili-header.large-header > div.bili-header__bar > ul.left-entry > li:nth-child(4), .left-entry > li:has(a[href*='game.bilibili.com'])", key: "nav_game_center" },
                { label: "漫画", selector: "#app > div.bili-feed4 > div.bili-header.large-header > div.bili-header__bar > ul.left-entry > li:nth-child(6), .left-entry > li:has(a[href*='manga.bilibili.com'])", key: "nav_manga" },
                { label: "推广", selector: ".left-entry > li.v-popover-wrap.left-loc-entry", key: "nav_dock_promo" },
                { label: "大会员", selector: ".right-entry > div, .right-entry-item:has(a[href*='vip.bilibili.com'])", key: "nav_vip" },
                { label: "消息", selector: ".right-entry > li.right-entry--message, .right-entry-item:has(a[href*='message.bilibili.com'])", key: "nav_msg" },
                { label: "创作中心", selector: ".right-entry > li:nth-child(7), .right-entry-item:has(a[href*='member.bilibili.com'])", key: "nav_member" },
                { label: "历史", selector: ".right-entry > li:nth-child(6), .right-entry-item:has(a[href*='history'])", key: "nav_history" },
                { label: "收藏", selector: ".right-entry > li:nth-child(5), .right-entry-item:has(a[href*='favlist'])", key: "nav_fav" },
                { label: "动态", selector: ".right-entry-item:has(a[href*='t.bilibili.com'])", key: "nav_dynamic" },
                { label: "直播", selector: "li:has(a[href*='live.bilibili.com'])", key: "nav_live_link" },
                { label: "会员购", selector: "li:has(a[href*='show.bilibili.com'])", key: "nav_show_mall" },
                { label: "下载客户端", selector: "li:has(a[href*='app.bilibili.com'])", key: "nav_download_app" },
                { label: "投稿按钮", selector: ".right-entry-item--upload", key: "nav_upload" }
            ]
        },
        { label: "首页轮播广告", selector: ".recommended-swipe, .ad-report", key: "hide_home_ads" },
        { label: "隐藏直播推荐", selector: ".bili-video-card:has(.bili-live-badge), .live-card, .video-card-live", key: "hide_live_recom" },
        { label: "限制加载个数", key: "limit_loading" },
        { label: "侧边栏存储箱", selector: ".storage-box", key: "hide_storage_box" }
    ];

    // 2. 核心样式管理
    const dynamicStyle = document.createElement('style');
    dynamicStyle.id = "gemini-permanent-style";
    document.documentElement.appendChild(dynamicStyle);

    const refreshStyles = () => {
        let css = "";
        const process = (item) => {
            if (item.selector && getConfig(item.key, false)) {
                const selectors = item.selector.split(',').map(s => s.trim());
                selectors.forEach(s => {
                    css += `${s} { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }\n`;
                });
            }
            if (item.subItems) item.subItems.forEach(process);
        };
        configItems.forEach(process);

        if (getConfig("limit_loading", false)) {
            const count = parseInt(getConfig("custom_video_count", 10));
            const limit = count + 1;
            css += `
                .feed2 .container > div:nth-child(n+${limit}),
                .bili-feed4 .feed-roll-wrap > div:nth-child(n+${limit}),
                .feed-card:nth-child(n+${limit}) { display: none !important; }
                .loading-state, .load-more, .feed-roll-loading { display: none !important; }
            `;
        }

        // 关键样式补丁：强制右侧弹窗向左对齐，防止超出
        css += `
            .v-popover-content, .right-entry__popover {
                z-index: 5000 !important;
                right: 0 !important;
                left: auto !important; /* 强制以右侧为基准对齐 */
                transform: none !important; /* 禁用 B 站不稳定的偏移计算 */
            }
            .bili-header__bar, .v-popover-wrap { overflow: visible !important; }
        `;

        dynamicStyle.innerHTML = css;
    };

    // 3. UI 布局样式
    const uiStyle = document.createElement('style');
    uiStyle.innerHTML = `
        #gm-panel { position: fixed; left: 0; top: 50%; transform: translate(-100%, -50%); z-index: 6000;
                    background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(12px); border-radius: 0 16px 16px 0;
                    box-shadow: 10px 0 30px rgba(0,0,0,0.15); padding: 20px; width: 260px; max-height: 85vh;
                    overflow-y: auto; transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
                    border: 1px solid rgba(255,255,255,0.5); font-family: sans-serif; }
        #gm-panel.active { transform: translate(0, -50%); }
        #gm-handle { position: fixed; left: 0; top: 50%; transform: translateY(-50%); z-index: 6000;
                     width: 38px; height: 64px; background: #00aeec; color: #fff; border-radius: 0 12px 12px 0;
                     display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 22px;
                     box-shadow: 4px 0 12px rgba(0,0,0,0.15); transition: left 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
        #gm-panel.active + #gm-handle { left: 300px; background: #fb7299; }
        .gm-title { font-weight: 900; margin-bottom: 15px; font-size: 18px; color: #18191c; border-bottom: 2px solid #f1f2f3; padding-bottom: 10px; text-align: center; }
        .gm-item { display: flex; flex-direction: column; padding: 10px 0; border-bottom: 1px solid #f6f7f8; }
        .gm-row { display: flex; align-items: center; justify-content: space-between; width: 100%; }
        .gm-label { font-size: 14px; color: #61666d; }
        .gm-group { cursor: pointer; color: #18191c; font-weight: bold; }
        .gm-sub-list { padding-left: 12px; border-left: 3px solid #00aeec; display: none; background: rgba(0,0,0,0.02); margin-top: 5px; }
        .gm-sub-list.show { display: block; }
        .gm-sw { position: relative; width: 38px; height: 20px; cursor: pointer; }
        .gm-sw input { opacity: 0; width: 0; height: 0; }
        .gm-sld { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #ccd0d7; border-radius: 20px; transition: 0.3s; }
        .gm-sld:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: 0.3s; }
        input:checked + .gm-sld { background: #00aeec; }
        input:checked + .gm-sld:before { transform: translateX(18px); }
        .gm-slider-container { width: 100%; margin-top: 10px; display: flex; align-items: center; gap: 10px; }
        .gm-slider { -webkit-appearance: none; width: 100%; height: 6px; background: #e3e5e7; border-radius: 5px; outline: none; }
        .gm-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #00aeec; border-radius: 50%; cursor: pointer; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
        .gm-count-badge { font-size: 12px; background: #00aeec; color: #fff; padding: 2px 6px; border-radius: 10px; min-width: 24px; text-align: center; }
    `;

    function buildUI() {
        if (document.getElementById('gm-panel')) return;
        document.head.appendChild(uiStyle);
        const panel = document.createElement('div');
        panel.id = 'gm-panel';
        panel.innerHTML = `<div class="gm-title">B站界面净化 4.1</div>`;
        configItems.forEach(item => {
            if (item.isGroup) {
                const groupWrapper = document.createElement('div');
                groupWrapper.className = 'gm-item';
                const head = document.createElement('div');
                head.className = 'gm-row gm-group';
                head.innerHTML = `<span>${item.label}</span><span>▾</span>`;
                const sub = document.createElement('div');
                sub.className = 'gm-sub-list';
                item.subItems.forEach(s => sub.appendChild(createRow(s)));
                head.onclick = () => sub.classList.toggle('show');
                groupWrapper.append(head, sub);
                panel.appendChild(groupWrapper);
            } else {
                panel.appendChild(createRow(item));
            }
        });
        const handle = document.createElement('div');
        handle.id = 'gm-handle';
        handle.innerText = "⚙";
        handle.onclick = () => panel.classList.toggle('active');
        document.body.append(panel, handle);
    }

    function createRow(item) {
        const row = document.createElement('div');
        row.className = 'gm-item';
        const topRow = document.createElement('div');
        topRow.className = 'gm-row';
        topRow.innerHTML = `<span class="gm-label">${item.label}</span>`;
        const lab = document.createElement('label');
        lab.className = 'gm-sw';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = getConfig(item.key, false);
        cb.onchange = (e) => { setConfig(item.key, e.target.checked); refreshStyles(); };
        const sld = document.createElement('span');
        sld.className = 'gm-sld';
        lab.append(cb, sld);
        topRow.appendChild(lab);
        row.appendChild(topRow);
        if (item.key === "limit_loading") {
            const sliderCont = document.createElement('div');
            sliderCont.className = 'gm-slider-container';
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.className = 'gm-slider';
            slider.min = "1";
            slider.max = "100";
            slider.value = getConfig("custom_video_count", 10);
            const badge = document.createElement('span');
            badge.className = 'gm-count-badge';
            badge.innerText = slider.value;
            slider.oninput = (e) => {
                const val = e.target.value;
                badge.innerText = val;
                setConfig("custom_video_count", val);
                refreshStyles();
            };
            sliderCont.append(slider, badge);
            row.appendChild(sliderCont);
        }
        return row;
    }

    // 初始化
    refreshStyles();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildUI);
    } else {
        buildUI();
    }

    // 弹窗溢出边界自动检测与修正补丁 (JS 层强化)
    const fixPopoverLogic = () => {
        const popovers = document.querySelectorAll('.v-popover-content, .right-entry__popover');
        popovers.forEach(pop => {
            const rect = pop.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                pop.style.setProperty('left', 'auto', 'important');
                pop.style.setProperty('right', '0px', 'important');
                pop.style.setProperty('transform', 'translateX(0px)', 'important');
            }
        });
    };

    // 使用观察者或周期性检查，确保动态生成的弹窗也被修正
    setInterval(fixPopoverLogic, 500);

    window.addEventListener('scroll', (e) => {
        if (getConfig("limit_loading", false)) {
            const count = parseInt(getConfig("custom_video_count", 10));
            const estimatedRows = Math.ceil(count / 5);
            if (window.scrollY > (estimatedRows * 420 + 600)) {
                e.stopImmediatePropagation();
            }
        }
    }, true);

})();
