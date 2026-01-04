// ==UserScript==
// @name         HappyMH 漫画键盘翻页助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为 m.happymh.com 增加方向键支持：→下一话，←上一话 空格向下翻页
// @author       pixel
// @match        https://m.happymh.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556863/HappyMH%20%E6%BC%AB%E7%94%BB%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/556863/HappyMH%20%E6%BC%AB%E7%94%BB%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项：定义触发按键和对应的按钮文本
    const CONFIG = {
        nextKey: 'ArrowRight', // 右箭头
        prevKey: 'ArrowLeft',  // 左箭头
        nextText: '下一话',
        prevText: '上一话'
    };

    /**
     * 使用 XPath 查找包含特定文本的按钮元素
     * @param {string} text - 按钮上显示的文字
     * @returns {HTMLElement|null} - 找到的DOM元素或null
     */
    function findButtonByText(text) {
        // XPath 解释: //button 查找所有button标签，[contains(., "text")] 筛选文本内容包含指定文字的元素
        const xpath = `//button[contains(., "${text}")]`;
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
    }

    // 主事件监听器
    document.addEventListener('keydown', function(e) {
        // 1. 防抖/过滤：如果用户正在输入框(input/textarea)中打字，不要触发翻页
        const activeTag = document.activeElement.tagName.toUpperCase();
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') {
            return;
        }

        let targetBtn = null;

        // 2. 按键匹配
        if (e.key === CONFIG.nextKey) {
            targetBtn = findButtonByText(CONFIG.nextText);
        } else if (e.key === CONFIG.prevKey) {
            targetBtn = findButtonByText(CONFIG.prevText);
        }

        // 3. 执行点击
        if (targetBtn) {
            // 阻止默认行为（例如横向滚动），让体验更像原生App
            // 如果你希望保留方向键滚动功能，可以注释掉下面这行
            e.preventDefault();

            targetBtn.click();
            console.log(`[HappyMH Script] 已触发点击: ${targetBtn.textContent}`);
        }
    });

    console.log('[HappyMH Script] 键盘监听已加载');
})();