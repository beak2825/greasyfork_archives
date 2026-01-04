// ==UserScript==
// @name         南+跳转
// @namespace    http://tampermonkey.net/
// @version      2025-12-25
// @description  南+的域名太多了，网友分享的域名不同，要么登录一下，要么手动改到已登录过的域名，太麻烦了，所以写了这个脚本，点击按钮后，会自动跳转到已登录过的南+域名。
// @author       Cloud
// @icon         https://www.google.com/s2/favicons?sz=64&domain=south-plus.org
// @match        *://*.south-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://*.white-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://*.level-plus.net/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560161/%E5%8D%97%2B%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/560161/%E5%8D%97%2B%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_DOMAIN = 'south-plus.net';

    function addButton() {
        const newStyle = document.createElement('style');
        newStyle.id = 'overlay';
        newStyle.innerHTML = `.popup-overlay { position: fixed; inset: 0; width: 100%;
            height: 100%; background: linear-gradient( 180deg, rgba(0, 0, 0, 0.55), rgba(20, 0, 0, 0.85) );
            backdrop-filter: blur(3px) saturate(120%); display: none; justify-content: center; align-items: center;
            z-index: 9999; animation: cb-fade-in 0.25s ease-out; } @keyframes cb-fade-in { from { opacity: 0; } to { opacity: 1; } }
            #popup-trigger-btn { position: fixed; bottom: 22px; right: 22px; padding: 12px 20px;
            background: linear-gradient( 135deg, #cb0202, #ff3b3b ); color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 10px; cursor: pointer;
            z-index: 9998; font-size: 14px; font-weight: 600; letter-spacing: 0.4px;
            box-shadow: 0 10px 30px rgba(203, 2, 2, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease; }
            #popup-trigger-btn:hover { transform: translateY(-2px); background: linear-gradient( 135deg, #e30606, #ff5a5a );
            box-shadow: 0 14px 36px rgba(203, 2, 2, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.25); }
            #popup-trigger-btn:active { transform: translateY(0); background: linear-gradient( 135deg, #a90101, #d90404 );
            box-shadow: 0 6px 14px rgba(203, 2, 2, 0.5), inset 0 3px 8px rgba(0, 0, 0, 0.35); }`;
        document.head.appendChild(newStyle);
        const popupOverlay = document.createElement('div');
        popupOverlay.className = 'popup-overlay';
        document.body.appendChild(popupOverlay);

        const triggerButton = document.createElement('button');
        triggerButton.id = 'popup-trigger-btn';
        triggerButton.textContent = '南+跳转';
        document.body.appendChild(triggerButton);
        triggerButton.addEventListener('click', redirectToSouthPlus);
    }

    function redirectToSouthPlus() {
        const url = new URL(location.href)
        url.hostname = DEFAULT_DOMAIN
        location.href = url.toString();
    }

    if (!location.hostname.includes(DEFAULT_DOMAIN)) {
        addButton()
    }
})();