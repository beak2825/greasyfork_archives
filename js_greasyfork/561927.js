// ==UserScript==
// @name         HidenCloud 自动下单监控
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  检测到 Custom Options 有内容时，自动选第一个节点，勾选条款并点击 Checkout
// @match        https://dash.hidencloud.com/store/view/349*
// @grant        GM_xmlhttpRequest
// @connect      dash.hidencloud.com
// @downloadURL https://update.greasyfork.org/scripts/561927/HidenCloud%20%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/561927/HidenCloud%20%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 可视化面板 (增加了自动下单状态提示)
    const panel = document.createElement('div');
    panel.style = "position: fixed; top: 20px; right: 20px; z-index: 10000; width: 300px; background: #11111b; color: #cdd6f4; border: 2px solid #db0824; border-radius: 12px; padding: 12px; font-family: sans-serif; box-shadow: 0 8px 32px rgba(0,0,0,0.5);";
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #313244; padding-bottom: 5px; margin-bottom: 8px;">
            <span style="font-size: 13px; font-weight: bold; color: #f38ba8;">自动下单监控中</span>
            <span id="scan-dot" style="font-size: 10px; color: #fab387;">● 扫描中</span>
        </div>
        <div id="options-list" style="font-size: 13px; color: #94e2d5; line-height: 1.5;">
            正在监控库存，发现即下单...
        </div>
    `;
    document.body.appendChild(panel);

    const listContainer = document.getElementById('options-list');
    const scanDot = document.getElementById('scan-dot');

    // 处理自动点击逻辑
    async function performCheckout(nodeId) {
        console.log('%c[动作] 发现库存，开始执行下单程序...', 'color: #ff0000; font-weight: bold;');

        // 1. 在当前页面找到下拉框并选择该节点
        const selectEl = document.querySelector('select[name="node_id"]');
        if (selectEl) {
            selectEl.value = nodeId;
            // 触发 change 事件确保页面逻辑识别到选择
            selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // 2. 勾选 "I accept the Terms and Conditions"
        // 根据常见 HTML 结构，通常是一个 type="checkbox"
        const termsCheckbox = document.querySelector('input[type="checkbox"][name="terms"]') ||
                             document.querySelector('input#terms') ||
                             document.querySelector('input[name*="condition"]');

        if (termsCheckbox) {
            termsCheckbox.checked = true;
            console.log('已勾选服务条款');
        }

        // 3. 点击 Checkout 按钮
        // 通常是一个带有 "Checkout" 文字的按钮或 submit 类型的按钮
        const checkoutBtn = Array.from(document.querySelectorAll('button, input[type="submit"]'))
                                .find(btn => btn.textContent.includes('Checkout') || btn.value.includes('Checkout'));

        if (checkoutBtn) {
            listContainer.innerHTML = '<b style="color:#ff0000">正在提交订单...</b>';
            setTimeout(() => {
                checkoutBtn.click();
                console.log('已点击 Checkout 按钮！');
            }, 500); // 稍微延迟 0.5s 确保选择生效
        }
    }

    function checkStock() {
        scanDot.style.opacity = '1';

        GM_xmlhttpRequest({
            method: "GET",
            url: window.location.href, // 在当前配置页监控
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": window.location.href
            },
            onload: function(response) {
                scanDot.style.opacity = '0.5';
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const customSelect = doc.querySelector('select[name="node_id"]');

                if (customSelect) {
                    const options = Array.from(customSelect.options)
                        .filter(opt => opt.value && opt.value !== "" && !opt.disabled);

                    if (options.length > 0) {
                        const firstNodeId = options[0].value;
                        const firstNodeName = options[0].textContent.trim();

                        listContainer.innerHTML = `<div style="color:#a6e3a1">检测到: ${firstNodeName}<br>触发自动购买!</div>`;

                        // 执行下单动作
                        performCheckout(firstNodeId);
                    }
                }
            }
        });
    }

    // 每2秒检查一次
    const monitorInterval = setInterval(checkStock, 2000);
    checkStock();
})();