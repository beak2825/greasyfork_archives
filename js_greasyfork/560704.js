// ==UserScript==
// @name         魂+论坛屏蔽已结或低悬赏的帖子
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  删除不满足悬赏金额条件或没有s1 span的tr3 t_one元素，仅针对含有特定s8标签的行，使用MutationObserver高效监控DOM变化
// @author       Grok
// @match        *://www.summer-plus.net/*
// @match        *://www.blue-plus.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560704/%E9%AD%82%2B%E8%AE%BA%E5%9D%9B%E5%B1%8F%E8%94%BD%E5%B7%B2%E7%BB%93%E6%88%96%E4%BD%8E%E6%82%AC%E8%B5%8F%E7%9A%84%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/560704/%E9%AD%82%2B%E8%AE%BA%E5%9D%9B%E5%B1%8F%E8%94%BD%E5%B7%B2%E7%BB%93%E6%88%96%E4%BD%8E%E6%82%AC%E8%B5%8F%E7%9A%84%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义目标标签
    const targetTags = ["[二次元R18相关]", "[三次元R18相关]", "[全年龄正常向]"];
    const amount_num = 500;

    // 定义检查的函数
    function checkAndRemove() {
        // 查找所有符合class="tr3 t_one"的元素
        const rows = document.querySelectorAll('.tr3.t_one');

        rows.forEach(row => {
            // 先检查是否有匹配的s8元素
            const s8 = row.querySelector('.s8');
            if (!s8 || !targetTags.includes(s8.textContent.trim())) {
                return; // 如果没有匹配的s8，跳过不执行操作
            }

            // 查找每一行下的span元素，并获取其中的数字
            const span = row.querySelector('.s1');
            if (!span) {
                // 如果没有.s1的span元素，直接删除该行
                row.remove();
                return; // 跳出当前循环，避免继续执行后续逻辑
            }

            // 使用正则提取数字
            const match = span.textContent.match(/悬赏金额：(\d+)/);
            if (match && match[1]) {
                const amount = parseInt(match[1], 10);
                // 如果悬赏金额小于或等于amount_num的值，删除该行
                if (amount <= amount_num) {
                    row.remove();
                }
            }
        });
    }

    // 初始调用检查
    checkAndRemove();

    // 设置MutationObserver监控DOM变化
    const observer = new MutationObserver(function(mutations) {
        // 检查是否有相关变化（如子元素添加）
        for (const mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                checkAndRemove();
                break; // 一旦处理，无需继续检查其他mutation
            }
        }
    });

    // 观察body或更具体的父容器变化
    const targetNode = document.body; // 如果知道表格的父容器，可替换为document.querySelector('.table-parent')
    const config = { childList: true, subtree: true }; // 监控子树中的添加/移除
    observer.observe(targetNode, config);
})();