// ==UserScript==
// @name         Mikan Project 修复多选复制磁连
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  修复 Mikan Project 详情页“复制选中磁连”按钮无法点击复制，自动解锁按钮，并精准提取磁力链接
// @author       mbs25
// @license      MIT
// @match        https://mikanani.me/Home/Bangumi/*
// @icon         https://mikanani.me/images/favicon.ico
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560825/Mikan%20Project%20%E4%BF%AE%E5%A4%8D%E5%A4%9A%E9%80%89%E5%A4%8D%E5%88%B6%E7%A3%81%E8%BF%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/560825/Mikan%20Project%20%E4%BF%AE%E5%A4%8D%E5%A4%9A%E9%80%89%E5%A4%8D%E5%88%B6%E7%A3%81%E8%BF%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[MikanFix] 修复脚本已启动');

    // 1. 核心修复逻辑
    function fixButton(btn) {
        if (btn.dataset.mikanFixed === 'true') return;
        btn.dataset.mikanFixed = 'true';

        // --- 关键修复 A: 强制移除 disabled 属性 ---
        btn.removeAttribute('disabled');

        // --- 关键修复 B: 视觉标记 (绿色边框) ---
        btn.style.border = '2px solid #28a745';
        btn.style.cursor = 'pointer'; // 恢复鼠标手势

        // --- 关键修复 C: 移除旧事件，绑定新事件 ---
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        // 找到对应的表格 (根据源码，表格在按钮父级 div 的后面)
        // 结构: div.copy-info-row -> (nextSibling) -> table
        const container = newBtn.closest('.copy-info-row');
        const table = container ? container.nextElementSibling : null;

        if (!table || table.tagName !== 'TABLE') {
            console.error('[MikanFix] 找不到对应的表格');
            return;
        }

        // 绑定点击事件
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // 直接找表格里被勾选的复选框
            const checkedBoxes = table.querySelectorAll('input.js-episode-select:checked');

            if (checkedBoxes.length === 0) {
                showFeedback(newBtn, '⚠️ 未选择', true);
                return;
            }

            // --- 关键修复 D: 直接读取 data-magnet ---
            let magnetLinks = [];
            checkedBoxes.forEach(cb => {
                const magnet = cb.getAttribute('data-magnet');
                if (magnet) {
                    magnetLinks.push(magnet);
                }
            });

            if (magnetLinks.length > 0) {
                GM_setClipboard(magnetLinks.join('\n'));
                showFeedback(newBtn, `✅ 已复制 ${magnetLinks.length} 条`);
            } else {
                showFeedback(newBtn, '❌ 无磁链数据', true);
            }
        });

        // --- 关键修复 E: 修复计数器和全选 ---
        setupCounter(table, container, newBtn);
    }

    function setupCounter(table, container, btn) {
        const countSpan = container.querySelector('.js-selected-count');
        const selectAll = table.querySelector('.js-select-all');
        const checkBoxes = table.querySelectorAll('input.js-episode-select');

        // 更新计数显示的函数
        const updateCount = () => {
            const count = table.querySelectorAll('input.js-episode-select:checked').length;
            if (countSpan) {
                countSpan.innerText = `已选 ${count} 项`;
                countSpan.style.color = count > 0 ? '#28a745' : '';
                countSpan.style.fontWeight = count > 0 ? 'bold' : '';
            }
        };

        // 监听所有单选框
        checkBoxes.forEach(cb => {
            cb.addEventListener('change', updateCount);
        });

        // 监听全选框
        if (selectAll) {
            // 移除原有的全选事件（如果坏了的话），自己实现一个
            const newSelectAll = selectAll.cloneNode(true);
            selectAll.parentNode.replaceChild(newSelectAll, selectAll);

            newSelectAll.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                const currentBoxes = table.querySelectorAll('input.js-episode-select'); // 重新获取，防止动态变化
                currentBoxes.forEach(cb => {
                    cb.checked = isChecked;
                });
                updateCount();
            });
        }
    }

    function showFeedback(btn, text, isError = false) {
        const originalText = "复制选中磁连";
        if (!btn.style.minWidth) btn.style.minWidth = getComputedStyle(btn).width;

        btn.innerText = text;
        btn.className = `btn btn-xs ${isError ? 'btn-danger' : 'btn-success'}`;

        setTimeout(() => {
            btn.innerText = originalText;
            btn.className = 'btn btn-default btn-xs js-copy-selected'; // 恢复原样
            btn.style.border = '2px solid #28a745'; // 保持绿色边框
        }, 2000);
    }

    // 2. 监听器：处理动态加载
    const observer = new MutationObserver((mutations) => {
        // 查找所有符合特征的按钮：class="js-copy-selected"
        const buttons = document.querySelectorAll('button.js-copy-selected');
        buttons.forEach(btn => fixButton(btn));
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 3. 初始运行
    setTimeout(() => {
        const buttons = document.querySelectorAll('button.js-copy-selected');
        buttons.forEach(btn => fixButton(btn));
    }, 500);

})();
