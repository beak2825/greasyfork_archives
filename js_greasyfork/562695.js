// ==UserScript==
// @name         Milky Way Idle - 纯白底色 (提取修正版)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  直接提取 HBuilderX 脚本的核心定位逻辑 (.App_app__3vFLV)，只修改背景为白色，绝对不破坏原本的游戏界面、图标颜色和文字颜色。
// @author       User Reference Extracted
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562695/Milky%20Way%20Idle%20-%20%E7%BA%AF%E7%99%BD%E5%BA%95%E8%89%B2%20%28%E6%8F%90%E5%8F%96%E4%BF%AE%E6%AD%A3%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562695/Milky%20Way%20Idle%20-%20%E7%BA%AF%E7%99%BD%E5%BA%95%E8%89%B2%20%28%E6%8F%90%E5%8F%96%E4%BF%AE%E6%AD%A3%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const css = `
        /* 1. 设置最底层的 Body 为白色 */
        body, html {
            background-color: #ffffff !important;
            background-image: none !important;
        }

        /* 2. 【核心定位】直接使用参考脚本里有效的类名 */
        /* 参考脚本里它是 .App_app__3vFLV，我们这里只去背景，不动颜色 */
        .App_app__3vFLV {
            background-image: none !important;      /* 移除星空背景图 */
            background-color: transparent !important; /* 设为透明，透出下面的白底 */
        }

        /* 3. 补充定位 (双保险) */
        /* 如果它是作为子元素存在的，确保 #root 也是透明的 */
        #root {
            background-color: transparent !important;
        }

        /* 4. 【重要】绝对不要加 "*" 通配符 */
        /* 参考脚本里有一句 "* { color: ... }"，那是导致你界面变绿的元凶。*/
        /* 这里我们什么都不写，这样你的红药水、彩色装备、技能图标就全部安全了。 */
    `;

    // 使用参考脚本完全一致的注入方式 (DOM 注入)
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.textContent = css;

    const head = document.head || document.documentElement;
    if (head) {
        head.appendChild(styleElement);
    } else {
        document.documentElement.appendChild(styleElement);
    }

    // 再次尝试注入 (防止网页加载慢)
    // 既然参考脚本能用，说明这种注入方式没问题，加个延时保险一点
    setTimeout(() => {
        const target = document.head || document.body;
        if(target && !document.contains(styleElement)){
             target.appendChild(styleElement);
        }
    }, 1000);

})();