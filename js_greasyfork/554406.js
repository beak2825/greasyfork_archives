// ==UserScript==
// @name         NodeSeek/DeepFlood 界面优化
// @namespace    https://github.com/0x1KKI
// @version      1.3
// @description  优化：1. 修复导航栏位置 2. 模糊用户隐私信息 3. 优化选项可自由控制(开启/关闭)
// @author       0xIKKI
// @match        *://www.nodeseek.com/*
// @match        *://www.deepflood.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.deepflood.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554406/NodeSeekDeepFlood%20%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/554406/NodeSeekDeepFlood%20%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'useS strict';

    const KEY_NAV_FIX = 'navFixEnabled';
    const KEY_BLUR_USER = 'userStatBlurEnabled';

    let navFixEnabled = GM_getValue(KEY_NAV_FIX, true);
    let blurUserEnabled = GM_getValue(KEY_BLUR_USER, true);

    GM_registerMenuCommand(
        (navFixEnabled ? '✅ 已开启' : '❌ 已关闭') + ' - 修复导航栏位置',
        () => {
            GM_setValue(KEY_NAV_FIX, !navFixEnabled);
            location.reload();
        }
    );

    GM_registerMenuCommand(
        (blurUserEnabled ? '✅ 已开启' : '❌ 已关闭') + ' - 模糊用户隐私信息',
        () => {
            GM_setValue(KEY_BLUR_USER, !blurUserEnabled);
            location.reload();
        }
    );

    const addGlobalStyle = (css) => {
        const head = document.head;
        if (!head) { return; }
        const style = document.createElement('style');
        style.textContent = css;
        head.appendChild(style);
    };

    if (navFixEnabled) {
        const div1 = document.getElementById('nsk-body');
        const div2 = document.getElementById('nsk-left-panel-container');
        if (div1 && div2) {
            div1.parentNode.insertBefore(div2, div1);
        }
    }

    if (blurUserEnabled) {

        const blurStyles = `
            /* 已更新为 .stat-block */
            .stat-block {
                filter: blur(5px);
                transition: filter 0.3s ease;
            }

            /* 已更新为 .stat-block */
            .stat-block:hover {
                filter: blur(0);
            }
        `;
        addGlobalStyle(blurStyles);
    }

})();
