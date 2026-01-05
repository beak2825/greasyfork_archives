// ==UserScript==
// @name         GigaFile Ad Shield Blocker (DOM Manipulation)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Attempts to block Geniee Ad Shield script on GigaFile.nu to bypass ad blocker detection by DOM manipulation.
// @author       liguanglai
// @match        https://104.gigafile.nu/*
// @grant        none
// @run-at       document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/559172/GigaFile%20Ad%20Shield%20Blocker%20%28DOM%20Manipulation%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559172/GigaFile%20Ad%20Shield%20Blocker%20%28DOM%20Manipulation%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tampermonkey: GigaFile Ad Shield Blocker script started. Attempting to block loader.min.js via DOM manipulation.');

    // 尝试在脚本元素创建时拦截其 src 属性
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        // 如果创建的是 script 标签
        if (tagName.toLowerCase() === 'script') {
            const script = originalCreateElement.apply(this, arguments);
            Object.defineProperty(script, 'src', {
                get: function() {
                    return this._src_original; // 返回原始的 src，如果它不是我们拦截的
                },
                set: function(value) {
                    if (value && value.includes('html-load.com/loader.min.js')) {
                        console.log('Tampermonkey: Intercepted and blocked Geniee Ad Shield script creation:', value);
                        // 将 src 设置为一个无效值，或者直接不设置，阻止其加载
                        this.dataset.blockedByTampermonkey = 'true'; // 标记为已拦截
                        // 可以选择不设置 _src_original，这样 get 方法会返回 undefined
                        // 或者设置为一个空字符串，阻止浏览器请求
                        this._src_original = '';
                    } else {
                        this._src_original = value; // 存储原始 src 以供正常脚本使用
                    }
                }
            });
            return script;
        }
        return originalCreateElement.apply(this, arguments);
    };

    // 额外防护：在 DOM 完全加载后检查并移除可能漏掉的脚本
    window.addEventListener('DOMContentLoaded', () => {
        console.log('Tampermonkey: DOMContentLoaded - Checking for any remaining loader.min.js scripts.');
        const scripts = document.querySelectorAll('script[src*="html-load.com/loader.min.js"]');
        scripts.forEach(script => {
            if (!script.dataset.blockedByTampermonkey) { // 如果没有被前面的 createElement 拦截
                script.remove();
                console.log('Tampermonkey: Removed Geniee Ad Shield script after DOMContentLoaded:', script.src);
            }
        });
    });

    // 在这里添加你检测其他网站内容的代码，这部分可以在 DOMContentLoaded 之后执行
    window.addEventListener('DOMContentLoaded', () => {
        // 示例：检测页面是否加载成功或特定元素
        const title = document.title;
        console.log('Page Title:', title);

        // 如果要检测是否有 ad blocker 警告，可以寻找特定的文本或元素
        // 假设存在一个警告弹窗，你可以尝试移除它
        // let adBlockWarning = document.querySelector('.ad-blocker-warning-class'); // 替换为实际的选择器
        // if (adBlockWarning) {
        //     adBlockWarning.remove();
        //     console.log('Tampermonkey: Removed ad blocker warning element.');
        // }
    });

})();
