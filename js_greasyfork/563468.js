// ==UserScript==
// @name         强制新标签页打开链接 (Force New Tab)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  强制所有链接在断标签页打开，防止覆盖当前页面。
// @author       Kiro User
// @match        *://*/*
// @grant        GM_openInTab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563468/%E5%BC%BA%E5%88%B6%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%20%28Force%20New%20Tab%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563468/%E5%BC%BA%E5%88%B6%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%20%28Force%20New%20Tab%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 判断链接是否应该被忽略
     * @param {string} href
     * @returns {boolean}
     */
    function shouldIgnore(href) {
        if (!href) return true;
        if (href.startsWith('javascript:')) return true;
        if (href.startsWith('tel:')) return true;
        if (href.startsWith('mailto:')) return true;
        // 如果是页面内锚点，通常不想在新标签页打开（除非用户想保留滚动位置的副本）
        // 这里假设包含 '#' 且不包含完整的 http 协议或者只是单纯的 hash 跳转则忽略
        // 简单的逻辑：如果只是hash变化，放行
        if (href.includes('#') && href.split('#')[0] === location.href.split('#')[0]) return true;
        return false;
    }

    /**
     * 处理点击事件
     * @param {MouseEvent} e
     */
    function handleClick(e) {
        // 查找最近的 A 标签
        var target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentNode;
            if (target === document) {
                target = null;
                break;
            }
        }

        // 如果找到了 A 标签且有 href
        if (target && target.tagName === 'A' && target.href) {
            // 检查是否需要忽略
            if (shouldIgnore(target.href)) return;

            // 检查是否已经是 _blank (虽然用户说都要打开，但如果本身就是 blank 其实没必要干预，但为了统一致行)
            // 部分网站虽然写了 _blank 但会被 js 拦截，所以我们最好强行接管。

            // 阻止默认行为（防止在当前页跳转）
            e.preventDefault();
            e.stopPropagation(); // 阻止冒泡，防止页面级脚本干预

            // 使用 GM_openInTab 可以更灵活控制（例如后台打开），或者用 window.open
            // open_in_background: false 表示立即切换到新标签，符合用户"点击打开"的直觉
            if (typeof GM_openInTab !== 'undefined') {
                GM_openInTab(target.href, { active: true, insert: true, setParent: true });
            } else {
                window.open(target.href, '_blank');
            }
        }
    }

    // 使用捕获阶段 (true) 来确保我们最先处理事件
    document.addEventListener('click', handleClick, true);

})();
