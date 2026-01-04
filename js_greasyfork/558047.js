// ==UserScript==
// @name         Modify Layout Widths on t.bilibili.com
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Modify widths of main and aside elements on t.bilibili.com
// @match        https://t.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558047/Modify%20Layout%20Widths%20on%20tbilibilicom.user.js
// @updateURL https://update.greasyfork.org/scripts/558047/Modify%20Layout%20Widths%20on%20tbilibilicom.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 需要修改的元素列表
    const targets = [
        { xpath: '/html/body/div[2]/div[3]/main', width: '1080px' },
        { xpath: '/html/body/div[2]/div[3]/aside[1]', width: '300px' },
        { xpath: '/html/body/div[2]/div[3]/aside[2]', width: '350px' }
    ];

    // 工具函数：通过 XPath 获取元素
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // 等待元素加载
    function waitForElement(xpath, callback) {
        const observer = new MutationObserver(() => {
            const el = getElementByXpath(xpath);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // 依次处理所有目标元素
    targets.forEach(({ xpath, width }) => {
        waitForElement(xpath, (el) => {
            console.log(`Element found for ${xpath}:`, el);
            el.style.width = width;
        });
    });
})();
