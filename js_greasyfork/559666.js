// ==UserScript==
// @name         b站护眼主题
// @namespace    https://github.com/fuyu2022
// @version      1.1.0
// @description  悬浮球切换护眼配色，支持本地记忆（刷新不丢）
// @author       fuyu
// @license      MIT
// @match        https://www.bilibili.com/
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559666/b%E7%AB%99%E6%8A%A4%E7%9C%BC%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/559666/b%E7%AB%99%E6%8A%A4%E7%9C%BC%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ===================== 配置区 ===================== */

    const STORAGE_KEY = 'bili_eye_theme';

    const theme_color_dict = {
        "杏仁黄": "rgb(250, 249, 222)",
        "秋叶褐": "rgb(255, 242, 226)",
        "绿豆沙": "rgb(199, 237, 204)",
        "胭脂红": "rgb(253, 230, 224)",
        "海天蓝": "rgb(220, 226, 241)",
        "葛巾紫": "rgb(233, 235, 254)",
        "极光灰": "rgb(234, 234, 239)",
        "青草绿": "rgb(227, 237, 205)",
        "电脑管家": "rgb(204, 232, 207)",
        "wps": "rgb(110, 123, 108)",
        "白色": "rgb(255, 255, 255)"
    };

    const colors = Object.entries(theme_color_dict).map(([name, color]) => ({
        name,
        color
    }));

    /* ===================== 样式注入 ===================== */

    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);

    function applyTheme(color) {
        styleEl.textContent = `
            .bili-feed4,
            .bili-header.large-header,
            .bili-header .bili-header__bar,
            .header-channel .header-channel-fixed,
            .bili-header.large-header .bili-header__channel,
            .bili-feed4 main.bili-feed4-layout,
            .bili-video-card .bili-video-card__info,
            div#mirror-vdcon,
            div.bpx-player-sending-bar,
            form#nav-searchform,
            div.nav-search-content,
            div.search-panel,
            div.bui-collapse-header,
            div.video-pod.video-pod{
                background-color: ${color} !important;
                box-shadow: 0 0 20px -10px rgb(39 33 31 / 80%) !important;
                color: black !important;
            }

            div#slide_ad,
            div.inside-wrp,
            div.floor-single-card{
                display: none !important;
            }

            div.bili-header__bar > ul.left-entry > li > a > span{
                color: black !important;
            }
        `;
    }

    /* ===================== 初始化主题 ===================== */

    const savedColor = localStorage.getItem(STORAGE_KEY);
    applyTheme(savedColor || theme_color_dict["胭脂红"]);

    /* ===================== 悬浮球 ===================== */

    const floatingBall = document.createElement('div');
    floatingBall.textContent = '🎨';
    Object.assign(floatingBall.style, {
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px rgba(0,0,0,.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 10000,
        fontSize: '22px'
    });
    document.body.appendChild(floatingBall);

    /* ===================== 颜色面板 ===================== */

    const optionsContainer = document.createElement('div');
    Object.assign(optionsContainer.style, {
        position: 'fixed',
        right: '20px',
        bottom: '80px',
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,.1)',
        display: 'none',
        zIndex: 10000,
        minWidth: '120px'
    });
    document.body.appendChild(optionsContainer);

    colors.forEach(({ name, color }) => {
        const option = document.createElement('div');
        option.textContent = name;
        Object.assign(option.style, {
            margin: '6px 0',
            padding: '6px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: color,
            textAlign: 'center',
            userSelect: 'none'
        });

        option.addEventListener('click', () => {
            localStorage.setItem(STORAGE_KEY, color);
            applyTheme(color);
            optionsContainer.style.display = 'none';
        });

        optionsContainer.appendChild(option);
    });

    floatingBall.addEventListener('click', () => {
        optionsContainer.style.display =
            optionsContainer.style.display === 'none' ? 'block' : 'none';
    });

})();
