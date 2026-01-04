// ==UserScript==
// @name         YouTube Studio Auto Dismiss
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  每5秒自动检测并点击 YouTube Studio 直播页面的 Dismiss 按钮，支持延迟加载
// @author       You
// @match        https://studio.youtube.com/channel/*/livestreaming
// @match        https://studio.youtube.com/video/*/livestreaming
// @match        https://studio.youtube.com/*/livestreaming
// @license MIT

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557378/YouTube%20Studio%20Auto%20Dismiss.user.js
// @updateURL https://update.greasyfork.org/scripts/557378/YouTube%20Studio%20Auto%20Dismiss.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 模拟点击
    function triggerClick(el) {
        if (!el) return;
        const evt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        el.dispatchEvent(evt);
        console.log('Dismiss 按钮已点击:', el, '父元素:', el.parentElement);
    }

    // 查找 Dismiss 按钮
    function findDismiss(root = document) {
        const allElements = root.querySelectorAll('button');
        for (const el of allElements) {
            try {
                // 严格检查按钮文字为 "Dismiss" 且按钮可见
                const text = el.innerText ? el.innerText.trim() : '';
                if (text === 'Dismiss' && isElementVisible(el)) {
                    console.log('找到 Dismiss 按钮:', el);
                    return el;
                }

                // Shadow DOM 递归
                if (el.shadowRoot) {
                    const shadowBtn = findDismiss(el.shadowRoot);
                    if (shadowBtn) return shadowBtn;
                }
            } catch (e) {
                console.log('检查元素时出错:', e);
                continue;
            }
        }
        return null;
    }

    // 检查元素是否可见
    function isElementVisible(el) {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    }

    // 等待页面加载完成
    function waitForPageLoad() {
        if (document.readyState === 'complete') {
            checkAndClick();
        } else {
            window.addEventListener('load', checkAndClick);
        }
    }

    // 检查并点击 Dismiss 按钮
    function checkAndClick() {
        const btn = findDismiss();
        if (btn) {
            triggerClick(btn);
        } else {
            console.log('未找到 Dismiss 按钮或按钮不可见');
        }
    }

    // 初始检查
    waitForPageLoad();

    // 每5秒检查一次
    setInterval(checkAndClick, 5000);
})();