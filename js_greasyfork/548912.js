// ==UserScript==
// @name         强化监测
// @namespace    https://www.milkywayidle.com/*
// @version      1.0
// @description  当检测到特定按钮时自动点击（带开关功能）
// @author       no name
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548912/%E5%BC%BA%E5%8C%96%E7%9B%91%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/548912/%E5%BC%BA%E5%8C%96%E7%9B%91%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改原有开关按钮位置（从 right 改为 left，并调整垂直位置）
    const toggleButton = document.createElement('div');
    toggleButton.style = `
        position: fixed;
        bottom: 70px;  // 调整垂直位置
        left: 20px;    // 改为左侧定位
        padding: 10px 15px;
        background: #4CAF50;
        color: white;
        border-radius: 5px;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    `;
    toggleButton.innerHTML = '自动点击：开启';
    document.body.appendChild(toggleButton);

    // 初始化状态（使用GM值存储）
    let isEnabled = true;

    // 切换状态函数
    toggleButton.addEventListener('click', () => {
        isEnabled = !isEnabled;
        toggleButton.innerHTML = `强化监测：${isEnabled ? '开启' : '关闭'}`;
        toggleButton.style.background = isEnabled ? '#4CAF50' : '#f44336';
        GM_setValue('autoClickEnabled', isEnabled);
    });

    // 从存储读取状态
    const savedState = GM_getValue('autoClickEnabled', true);
    isEnabled = savedState;
    toggleButton.innerHTML = `强化监测：${isEnabled ? '开启' : '关闭'}`;
    toggleButton.style.background = isEnabled ? '#4CAF50' : '#f44336';

    // 原有功能逻辑（添加状态判断）
    const observer = new MutationObserver((mutations) => {
        if (!isEnabled) return; // 开关关闭时不执行

        mutations.forEach(mutation => {
            if (!mutation.addedNodes) return;

            mutation.addedNodes.forEach(node => {
                const xpath = '//button[starts-with(text(), "添加到队列")]';
                const result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
                let button = result.iterateNext();

                if (button) {
                    button.click();
                    console.log('检测到目标按钮并已点击');
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 新增收集按钮（左下角）
    const collectButton = document.createElement('div');
    collectButton.style = `
        position: fixed;

        bottom: 20px;  // 原始底部位置
        left: 20px;
        padding: 10px 15px;
        background: #2196F3;
        color: white;
        border-radius: 5px;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    `;
    collectButton.innerHTML = '一键收货';
    document.body.appendChild(collectButton);

    // 新增收集功能
    collectButton.addEventListener('click', () => {
        const validOrders = Array.from(document.querySelectorAll('tr'))
            .filter(tr => {
                const statusTd = tr.querySelector('td:first-child');
                return statusTd?.textContent?.trim() === '有效';
            });

        validOrders.forEach((order, index) => {
            setTimeout(() => {
                const collectBtn = order.querySelector('button.Button_button__1Fe9z.Button_small__3fqC7');
                // 添加按钮文字验证
                if (collectBtn?.textContent?.trim() === '收集') {
                    collectBtn.click();
                    console.log(`已处理第 ${index + 1} 个有效订单`);
                }
            }, index * 500);
        });
    });
})();