// ==UserScript==
// @name         HotKeyTopBottomScroll
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  use alt+up/down to scroll to top/bottom
// @author       Kiddo
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554076/HotKeyTopBottomScroll.user.js
// @updateURL https://update.greasyfork.org/scripts/554076/HotKeyTopBottomScroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('keydown', function(event) {
        // 1. 检查是否满足“只有 Alt”的条件：
        if (!event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) {
            return;
        }

        let scrolled = false; // 标记是否执行了滚动操作

        // 2. 检查具体的按键
        switch (event.key) {
            case 'ArrowUp':
                // 触发：(仅) Alt + 上方向键
                window.scrollTo({
                    top: 0,
                    behavior: 'auto'
                });
                scrolled = true;
                break;

            case 'ArrowDown':
                // 触发：(仅) Alt + 下方向键
                window.scrollTo({
                    top: Number.MAX_SAFE_INTEGER,
                    behavior: 'auto'
                });
                scrolled = true;
                break;
            default:
                // 如果按下的不是方向键 (例如只按了 Alt)，则什么也不做
                return;
        }

        // 3. 阻止默认行为
        if (scrolled) {
            event.preventDefault();
        }

    }, true);

})();