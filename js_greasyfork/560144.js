// ==UserScript==
// @name         豆包深色模式
// @namespace    http://tampermonkey.net/
// @version      2025-12-25-fix1
// @description  开启豆包网页版隐藏的深色模式，并跟随系统，简单修复小代码块看不清的问题，修改大代码块颜色 (Adapted from alikia2x)
// @author       tanyanliang
// @match        https://*.doubao.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560144/%E8%B1%86%E5%8C%85%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/560144/%E8%B1%86%E5%8C%85%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `

        html[data-theme='dark'] div:has(> pre) {
            background-color: #f0f0f0 !important;

            color: #000 !important;

            filter: invert(1) hue-rotate(180deg) !important;

            border-color: #ccc !important;
            border-radius: 6px !important;
        }

        html[data-theme='dark'] div:has(> pre) pre {
            filter: none !important;
            background-color: transparent !important; 
            color: inherit !important;
            border: none !important;
        }

        html[data-theme='dark'] div:has(> pre) img {
            filter: invert(1) hue-rotate(180deg) !important;
        }


        html[data-theme='dark'] :not(pre) > code {
            filter: none !important;
            background-color: #2d2d2d !important; 
            color: #ff9e64 !important;
            border: 1px solid #444 !important;
            border-radius: 4px !important;
            padding: 2px 5px !important;
            margin: 0 2px !important;
        }

        html[data-theme='dark'] :not(pre) > code * {
            color: inherit !important;
            background-color: transparent !important;
            filter: none !important;
        }
    `;
    document.head.appendChild(style);

    function detectColorScheme() {
        return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }

    function setDataTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    setDataTheme(detectColorScheme());
    setInterval(() => setDataTheme(detectColorScheme()), 500);
})();