// ==UserScript==
// @name         Ozon SKU重量获取工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  批量获取Ozon平台商品SKU对应的重量信息
// @author       Shawn
// @match        https://www.ozon.ru/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549780/Ozon%20SKU%E9%87%8D%E9%87%8F%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/549780/Ozon%20SKU%E9%87%8D%E9%87%8F%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建缓存对象，用于存储已获取的SKU重量数据
    const weightCache = {};

    // 创建面板元素
    const createPanel = () => {
        const panel = document.createElement('div');
        panel.id = 'sku-weight-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>SKU重量获取工具</h3>
                <button id="close-panel">×</button>
            </div>
            <div class="panel-body">
                <textarea id="sku-input" placeholder="请输入SKU，一行一个"></textarea>
                <button id="start-button">开始获取</button>
                <div id="result-container">
                    <h4>结果列表</h4>
                    <table id="result-table">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>重量(g)</th>
                            </tr>
                        </thead>
                        <tbody id="result-body"></tbody>
                    </table>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // 添加关闭面板事件
        document.getElementById('close-panel').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        // 添加开始获取事件
        document.getElementById('start-button').addEventListener('click', startFetching);
    };

    // 开始获取重量信息
    const startFetching = async () => {
        const skuInput = document.getElementById('sku-input').value;
        const skuList = skuInput.trim().split('\n').filter(sku => sku.trim() !== '');
        const resultBody = document.getElementById('result-body');
        
        // 清空之前的结果
        resultBody.innerHTML = '';

        // 逐个处理SKU
        for (const sku of skuList) {
            // 检查缓存中是否已有该SKU的重量数据
            if (weightCache[sku] && weightCache[sku] !== '未找到匹配的SKU' && 
                weightCache[sku] !== '未找到获取按钮' && weightCache[sku] !== '未找到重量信息' &&
                !weightCache[sku].startsWith('获取失败：')) {
                addResult(sku, weightCache[sku], true); // 使用缓存数据，不更新缓存
                continue;
            }

            try {
                // 查找匹配的SKU元素
                const skuSpan = document.querySelector(`.product-sku>span:contains("${sku}")`);
                if (!skuSpan) {
                    addResult(sku, '未找到匹配的SKU');
                    continue;
                }

                // 查找对应的按钮并点击
                const cardBody = skuSpan.closest('.ozon-bdcat-card-body');
                const button = cardBody.querySelector('.ozon-bdcat-show-attribute-btn');
                if (!button) {
                    addResult(sku, '未找到获取按钮');
                    continue;
                }

                // 模拟点击按钮
                button.click();

                // 等待属性显示出来
                await new Promise(resolve => setTimeout(resolve, 300));

                // 查找重量信息
                const weightDiv = cardBody.querySelector('div:contains("重量, g：")');
                if (!weightDiv) {
                    addResult(sku, '未找到重量信息');
                    continue;
                }

                const weightSpan = weightDiv.querySelector('.ozon-bdcat-strong');
                const weight = weightSpan ? weightSpan.textContent.trim() : '未找到重量数值';

                // 添加结果到表格
                addResult(sku, weight);
            } catch (error) {
                addResult(sku, `获取失败：${error.message}`);
            }
        }
    };

    // 添加结果到表格
    const addResult = (sku, weight, fromCache = false) => {
        const resultBody = document.getElementById('result-body');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sku}</td>
            <td>${weight}</td>
        `;
        resultBody.appendChild(row);

        // 只有非缓存数据才更新缓存
        if (!fromCache) {
            weightCache[sku] = weight;
        }
    };

    // 扩展querySelector支持contains选择器
    const extendQuerySelector = () => {
        // 为元素添加contains方法
        HTMLElement.prototype.containsText = function(text) {
            return this.textContent.includes(text);
        };

        // 重写document.querySelector以支持contains选择器
        const nativeDocumentQuerySelector = document.querySelector;
        document.querySelector = function(selector) {
            if (selector.includes(':contains(')) {
                const text = selector.match(/:contains\("([^"]+)"\)/)[1];
                const baseSelector = selector.split(':contains')[0];
                const elements = document.querySelectorAll(baseSelector);
                for (let i = 0; i < elements.length; i++) {
                    if (elements[i].textContent.includes(text)) {
                        return elements[i];
                    }
                }
                return null;
            }
            return nativeDocumentQuerySelector.call(this, selector);
        };

        // 重写document.querySelectorAll以支持contains选择器
        const nativeDocumentQuerySelectorAll = document.querySelectorAll;
        document.querySelectorAll = function(selector) {
            if (selector.includes(':contains(')) {
                const text = selector.match(/:contains\("([^"]+)"\)/)[1];
                const baseSelector = selector.split(':contains')[0];
                const elements = nativeDocumentQuerySelectorAll.call(this, baseSelector);
                const result = [];
                for (let i = 0; i < elements.length; i++) {
                    if (elements[i].textContent.includes(text)) {
                        result.push(elements[i]);
                    }
                }
                return result;
            }
            return nativeDocumentQuerySelectorAll.call(this, selector);
        };

        // 重写Element.prototype.querySelector以支持contains选择器
        const nativeElementQuerySelector = Element.prototype.querySelector;
        Element.prototype.querySelector = function(selector) {
            if (selector.includes(':contains(')) {
                const text = selector.match(/:contains\("([^"]+)"\)/)[1];
                const baseSelector = selector.split(':contains')[0];
                const elements = this.querySelectorAll(baseSelector);
                for (let i = 0; i < elements.length; i++) {
                    if (elements[i].textContent.includes(text)) {
                        return elements[i];
                    }
                }
                return null;
            }
            return nativeElementQuerySelector.call(this, selector);
        };

        // 重写Element.prototype.querySelectorAll以支持contains选择器
        const nativeElementQuerySelectorAll = Element.prototype.querySelectorAll;
        Element.prototype.querySelectorAll = function(selector) {
            if (selector.includes(':contains(')) {
                const text = selector.match(/:contains\("([^"]+)"\)/)[1];
                const baseSelector = selector.split(':contains')[0];
                const elements = nativeElementQuerySelectorAll.call(this, baseSelector);
                const result = [];
                for (let i = 0; i < elements.length; i++) {
                    if (elements[i].textContent.includes(text)) {
                        result.push(elements[i]);
                    }
                }
                return result;
            }
            return nativeElementQuerySelectorAll.call(this, selector);
        };
    };

    // 添加样式
    const addStyles = () => {
        GM_addStyle(`
            #sku-weight-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                max-height: 80vh;
                background: white;
                border: 1px solid #ccc;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 9999;
                font-family: Arial, sans-serif;
            }
            .panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #eee;
                background: #f5f5f5;
                border-radius: 8px 8px 0 0;
            }
            .panel-header h3 {
                margin: 0;
                font-size: 16px;
                color: #333;
            }
            #close-panel {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                padding: 5px;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                position: relative;
            }
            #close-panel:hover {
                color: #333;
                background-color: #e0e0e0;
                border-radius: 4px;
            }
            #close-panel:active {
                transform: scale(0.95);
            }
            .panel-body {
                padding: 20px;
            }
            #sku-input {
                width: 100%;
                height: 120px;
                margin-bottom: 15px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                resize: vertical;
            }
            #start-button {
                display: block;
                width: 100%;
                padding: 10px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                margin-bottom: 20px;
            }
            #start-button:hover {
                background: #45a049;
            }
            #result-container {
                max-height: 300px;
                overflow-y: auto;
            }
            #result-container h4 {
                margin-top: 0;
                margin-bottom: 10px;
                font-size: 14px;
                color: #333;
            }
            #result-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }
            #result-table th,
            #result-table td {
                padding: 8px;
                text-align: left;
                border-bottom: 1px solid #eee;
            }
            #result-table th {
                background: #f9f9f9;
                font-weight: bold;
                color: #666;
            }
        `);
    };

    // 注册油猴菜单命令以打开面板
    GM_registerMenuCommand('打开SKU重量获取工具', () => {
        const panel = document.getElementById('sku-weight-panel');
        if (panel) {
            panel.style.display = 'block';
        } else {
            createPanel();
        }
    });

    // 初始化
    extendQuerySelector();
    addStyles();
    // 延迟创建面板，避免影响页面加载
    setTimeout(() => {
        createPanel();
        // 默认隐藏面板
        document.getElementById('sku-weight-panel').style.display = 'none';
    }, 1000);
})();