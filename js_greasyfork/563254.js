// ==UserScript==
// @name         B站弹出投币自动确认
// @namespace    https://www.xiaohongshu.com/user/profile/5f953ef70000000001007341
// @version      0.2
// @description  弹出“给UP主投上 2 枚硬币”时自动点击“确定”
// @author       You
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563254/B%E7%AB%99%E5%BC%B9%E5%87%BA%E6%8A%95%E5%B8%81%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/563254/B%E7%AB%99%E5%BC%B9%E5%87%BA%E6%8A%95%E5%B8%81%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 判断元素是否可见
    function isVisible(el) {
        if (!el) return false;
        const style = getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }

    function tryClickConfirm() {
        // 选择器定位到弹窗里的确定按钮
        const btn = document.querySelector('.coin-operated-m-exp .bi-btn');
        if (btn && isVisible(btn)) {
            console.log('[自动投币确认] 找到“确定”按钮，准备点击...');
            btn.click();
            return true;
        }
        return false;
    }

    // 初次尝试（防止脚本加载时弹窗已存在）
    if (tryClickConfirm()) return;

    // 监听 DOM 变化，捕捉弹窗出现
    const observer = new MutationObserver(() => {
        if (tryClickConfirm()) {
            // 点击成功后停止监听，避免重复点击
            observer.disconnect();
            console.log('[自动投币确认] 已点击确定，停止监听');
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();