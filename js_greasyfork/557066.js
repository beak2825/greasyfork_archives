// ==UserScript==
// @name         思齐放生助手
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在“一键放生”区域增加“保留条数”和“一键勾选”功能，自动计算并勾选超出保留数量的鱼。
// @author       Expert Coder
// @match        *://si-qi.xyz/free_fishes.php*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557066/%E6%80%9D%E9%BD%90%E6%94%BE%E7%94%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557066/%E6%80%9D%E9%BD%90%E6%94%BE%E7%94%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 注入自定义控件（输入框和按钮）
     * @param {HTMLElement} target - 控件将被添加到的父元素
     */
    function injectControls(target) {
        // 创建“保留条数”标签
        const label = document.createElement('label');
        label.textContent = '保留条数:';
        label.style.margin = '0 4px 0 12px';
        label.style.fontSize = '13px';
        label.style.color = 'var(--free-muted)';

        // 创建数字输入框
        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'keepCountInput';
        input.value = 2; // 默认保留2条
        input.min = 0;
        input.style.width = '50px';
        input.style.borderRadius = '999px';
        input.style.border = '1px solid rgba(0,0,0,0.2)';
        input.style.padding = '5px 8px';
        input.style.textAlign = 'center';

        // 创建“一键勾选”按钮
        const button = document.createElement('button');
        button.id = 'bulkSelectButton';
        button.textContent = '一键勾选';
        button.className = 'siqi-btn secondary'; // 复用网站已有样式
        button.style.marginLeft = '8px';
        button.style.padding = '8px 14px';

        // 为按钮绑定点击事件
        button.addEventListener('click', performBulkSelect);

        // 将新创建的控件插入到原有的“一键放生”按钮之前
        const originalButton = target.querySelector('button[data-action="bulk-release"]');
        if (originalButton) {
            target.insertBefore(label, originalButton);
            target.insertBefore(input, originalButton);
            target.insertBefore(button, originalButton);
        }
    }

    /**
     * 执行一键勾选的核心逻辑
     */
    function performBulkSelect() {
        const keepCountInput = document.getElementById('keepCountInput');
        const keepCount = parseInt(keepCountInput.value, 10);

        if (isNaN(keepCount) || keepCount < 0) {
            alert('请输入一个有效的保留数量（大于等于0的整数）。');
            return;
        }

        if (typeof FREE_FISH_DATA === 'undefined' || !FREE_FISH_DATA.inventory || !FREE_FISH_DATA.inventory.fish) {
            alert('错误：无法找到鱼的数据，脚本可能需要更新。');
            return;
        }
        const allFishData = FREE_FISH_DATA.inventory.fish;

        allFishData.forEach(fish => {
            if (fish.quantity <= 0) return;

            const code = fish.code;
            const totalQuantity = fish.quantity;

            const quantityInput = document.querySelector(`input[type="number"][data-code="${code}"]`);
            const checkbox = document.querySelector(`input[type="checkbox"][data-bulk-select][data-code="${code}"]`);

            if (!quantityInput || !checkbox) return;

            if (totalQuantity > keepCount) {
                const releaseCount = totalQuantity - keepCount;
                quantityInput.value = releaseCount;
                if (!checkbox.checked) {
                    checkbox.checked = true;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            } else {
                if (checkbox.checked) {
                    checkbox.checked = false;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
            quantityInput.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }

    // 使用 MutationObserver 来监视 DOM 变化，这是处理动态加载内容最可靠的方式
    const observer = new MutationObserver((mutations, obs) => {
        const bulkReleaseBar = document.querySelector('.inventory-toolbar .bulk-release-bar');

        if (bulkReleaseBar && !document.getElementById('keepCountInput')) {
            injectControls(bulkReleaseBar);
            // 任务完成，停止观察
            obs.disconnect();
        }
    });

    // 开始观察整个文档的 body 部分
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();