// ==UserScript==
// @name         51obe 数字键快捷打分 + 空格提交
// @namespace    https://www.51obe.com/
// @version      1.1
// @author       丸子自用
// @description  数字键打分，空格键提交分数
// @match        https://www.51obe.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562407/51obe%20%E6%95%B0%E5%AD%97%E9%94%AE%E5%BF%AB%E6%8D%B7%E6%89%93%E5%88%86%20%2B%20%E7%A9%BA%E6%A0%BC%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/562407/51obe%20%E6%95%B0%E5%AD%97%E9%94%AE%E5%BF%AB%E6%8D%B7%E6%89%93%E5%88%86%20%2B%20%E7%A9%BA%E6%A0%BC%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 判断是否正在输入
    function isTypingInInput() {
        const el = document.activeElement;
        if (!el) return false;
        const tag = el.tagName.toLowerCase();
        return tag === 'input' || tag === 'textarea' || el.isContentEditable;
    }

    document.addEventListener('keydown', function (e) {

        // 输入状态下不处理
        if (isTypingInInput()) return;

        /* ========= 空格键：提交分数 ========= */
        if (e.code === 'Space') {
            e.preventDefault(); // 防止页面滚动

            const buttons = document.querySelectorAll(
                'button.el-button.el-button--primary.el-button--mini'
            );

            for (const btn of buttons) {
                const text = btn.textContent.trim();
                if (text.includes('提交分数')) {
                    btn.click();

                    // 可选：视觉反馈
                    btn.style.outline = '2px solid green';
                    setTimeout(() => {
                        btn.style.outline = '';
                    }, 200);

                    break;
                }
            }
            return;
        }

        /* ========= 数字键：选择分数 ========= */
        let key = e.key;

        if (!/^[0-9]$/.test(key)) return;

        const scoreButtons = document.querySelectorAll(
            'span.el-radio-button__inner'
        );

        for (const btn of scoreButtons) {
            const text = btn.textContent.trim();
            if (text === key) {
                btn.click();

                btn.style.outline = '2px solid red';
                setTimeout(() => {
                    btn.style.outline = '';
                }, 200);

                break;
            }
        }
    });

})();
