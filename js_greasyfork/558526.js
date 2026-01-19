// ==UserScript==
// @name         TEMU打印商品打包标签
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  从右侧抽屉提取 SKU货号、次销售属性、发货数，直接调用浏览器打印，不显示生成页面。
// @match        *://*.kuajingmaihuo.com/*
// @match        *://*.temu.com/**
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558526/TEMU%E6%89%93%E5%8D%B0%E5%95%86%E5%93%81%E6%89%93%E5%8C%85%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/558526/TEMU%E6%89%93%E5%8D%B0%E5%95%86%E5%93%81%E6%89%93%E5%8C%85%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ========== 持续监听DOM变化，检测任何抽屉 ========== */
    function observeDrawers() {
        const observer = new MutationObserver(() => {
            // 查找所有可能的抽屉容器
            const drawers = document.querySelectorAll('div[class*="drawer-body"]');
            drawers.forEach(drawer => {
                if (!drawer.hasAttribute('data-print-observer')) {
                    drawer.setAttribute('data-print-observer', 'true');
                    observeDrawerChanges(drawer);
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /* ========== 检查原生打印按钮是否存在 ========== */
    function checkPrintButtonExists(drawerEl) {
        // 查找所有按钮
        const buttons = drawerEl.querySelectorAll('button');
        for (let btn of buttons) {
            const span = btn.querySelector('span');
            if (span && span.innerText.trim() === '打印') {
                return true;
            }
        }
        return false;
    }

    /* ========== 右下角创建/更新按钮 ========== */
    function updateButton(drawerEl) {
        const existingBtn = drawerEl.querySelector("#tm-print-label-btn");
        const hasPrintButton = checkPrintButtonExists(drawerEl);

        if (hasPrintButton) {
            // 有打印按钮，显示自定义按钮
            if (!existingBtn) {
                const btn = document.createElement("button");
                btn.id = "tm-print-label-btn";
                btn.innerText = "打印商品打包标签";

                // 按页面注入对应 class
                if (window.location.hostname === 'agentseller.temu.com') {
                    btn.className = "BTN_outerWrapper_5-120-1 BTN_medium_5-120-1 BTN_outerWrapperBtn_5-120-1";
                } else {
                    btn.className = "BTN_outerWrapper_5-117-0 BTN_medium_5-117-0 BTN_outerWrapperBtn_5-117-0";
                }

                btn.style.cssText = `
                    position: absolute;
                    right: 16px;
                    bottom: 16px;
                    background: #407cff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    z-index: 9999;
                    padding: 6px 12px;
                `;

                btn.onclick = () => extractData(drawerEl);

                drawerEl.style.position = 'relative';
                drawerEl.appendChild(btn);

                console.log("自定义打印按钮已显示");
            }
        } else {
            // 没有打印按钮，隐藏自定义按钮
            if (existingBtn) {
                existingBtn.remove();
                console.log("自定义打印按钮已隐藏");
            }
        }
    }

    /* ========== 监听抽屉内容变化，动态显示/隐藏按钮 ========== */
    function observeDrawerChanges(drawerEl) {
        const observer = new MutationObserver(() => {
            updateButton(drawerEl);
        });

        observer.observe(drawerEl, {
            childList: true,
            subtree: true
        });

        // 首次检查
        updateButton(drawerEl);
    }

    /* ========== 根据表头获取列索引 ========== */
    function getColumnIndexes(drawerEl) {
        const headers = Array.from(drawerEl.querySelectorAll("thead tr th span"));
        const colIndex = { sku: -1, attr2: -1, qty: -1 };

        headers.forEach((h, i) => {
            const text = h.innerText.trim();
            if (text === "SKU货号") colIndex.sku = i;
            else if (text === "次销售属性") colIndex.attr2 = i;
            else if (text === "发货数") colIndex.qty = i;
        });

        return colIndex;
    }

    /* ========== 提取抽屉表格中的数据 ========== */
    function extractData(drawerEl) {
        if (!drawerEl) {
            alert("未找到抽屉容器！");
            return;
        }

        const { sku, attr2, qty } = getColumnIndexes(drawerEl);
        if (sku < 0 || attr2 < 0 || qty < 0) {
            alert("无法识别表格列，请检查页面是否更新。");
            return;
        }

        const rows = drawerEl.querySelectorAll("tbody tr");
        const items = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            if (!cells.length) return;

            const skuValue = cells[sku]?.innerText.trim() || "";
            const attr2Value = cells[attr2]?.innerText.trim() || "";
            const qtyValue = cells[qty]?.innerText.trim() || "";

            if (skuValue) {
                items.push({ sku: skuValue, attr2: attr2Value, qty: qtyValue });
            }
        });

        if (!items.length) {
            alert("抽屉内未找到商品数据！");
            return;
        }

        createPrintPage(items);
    }

    /* ========== 隐藏 iframe 打印，不显示页面 ========== */
    function createPrintPage(items) {

        // 需要打印的完整 HTML
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    @page { size: 70mm 20mm; margin: 0; }
                    body { font-family: Arial, sans-serif; }
                    .label {
                        width: 70mm;
                        height: 20mm;
                        padding: 2mm;
                        border: 1px solid #ccc;
                        page-break-after: always;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        font-size: 14px;
                        line-height: 1.4;
                    }
                    .label div { margin: 1px 0; }
                    .value { font-weight: bold; }
                    @media print { .label { border: none; } }
                </style>
            </head>
            <body>
                ${items.map(item => `
                    <div class="label">
                        <div>SKU货号：<span class="value">${item.sku}</span></div>
                        <div>次销售属性：<span class="value">${item.attr2}</span></div>
                        <div>发货数：<span class="value">${item.qty}</span></div>
                    </div>
                `).join('')}
            </body>
            </html>
        `;

        // 创建隐藏 iframe
        const iframe = document.createElement('iframe');
        iframe.style.cssText = `
            position: fixed;
            right: 0;
            bottom: 0;
            width: 0;
            height: 0;
            border: 0;
        `;
        document.body.appendChild(iframe);

        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();

        iframe.contentWindow.focus();
        iframe.contentWindow.print();

        iframe.contentWindow.onafterprint = () => {
            document.body.removeChild(iframe);
        };
    }

    /* ========== 启动监听 ========== */
    observeDrawers();

})();