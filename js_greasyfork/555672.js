// ==UserScript==
// @name            OA表格增强工具（序号列+自定义每页数量）
// @namespace       http://tampermonkey.net/
// @version         0.8
// @description     OA表格添加序号列+自定义每页数量，集成控制面板
// @include         https://oa.zetacn.com:8666/eoffice/client/web/*
// @author          bean0283
// @match           https://oa.zetacn.com:8666/eoffice/client/web/*
// @match           http://oa.zetacn.com:8666/eoffice/client/web/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=zetacn.com
// @grant           none
// @run-at          document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555672/OA%E8%A1%A8%E6%A0%BC%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%EF%BC%88%E5%BA%8F%E5%8F%B7%E5%88%97%2B%E8%87%AA%E5%AE%9A%E4%B9%89%E6%AF%8F%E9%A1%B5%E6%95%B0%E9%87%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555672/OA%E8%A1%A8%E6%A0%BC%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%EF%BC%88%E5%BA%8F%E5%8F%B7%E5%88%97%2B%E8%87%AA%E5%AE%9A%E4%B9%89%E6%AF%8F%E9%A1%B5%E6%95%B0%E9%87%8F%EF%BC%89.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 配置参数
    let customLimit = 10; // 自定义limit值
    let isEnabled = false; // 是否启用请求拦截（默认开启）
    let showSerial = false; // 序号列显示状态

    // ==================== 序号列功能 ====================
    // 更新序号数字
    function updateSerialNumbers(tableBody) {
        if (!tableBody || !showSerial) return;

        const rows = tableBody.querySelectorAll('tr.data-row');
        rows.forEach((row, index) => {
            let serialTd = row.querySelector('.serial-column-body');

            // 如果没有序号单元格，则创建一个
            if (!serialTd) {
                const flowTitleTd = row.querySelector('td[title][style*="left: 0px"]');
                if (flowTitleTd) {
                    serialTd = document.createElement('td');
                    serialTd.className = 'serial-column-body';
                    serialTd.style = 'width: 30px; min-width: 30px; max-width: 30px; padding: 0 5px; text-align: center;';
                    row.insertBefore(serialTd, flowTitleTd);
                }
            }

            if (serialTd) {
                serialTd.innerText = index + 1;
                serialTd.style.display = showSerial ? '' : 'none';
            }
        });
    }

    // 等待表格加载并添加序号列
    function waitForTable() {
        if (!showSerial) return;

        const tableHead = document.querySelector('.eui-grid-header tr');
        const tableBody = document.querySelector('.table-body-wrapper tbody');

        if (tableHead && tableBody) {
            addSerialColumn(tableHead, tableBody);
            updateSerialNumbers(tableBody);
        } else {
            setTimeout(waitForTable, 200);
        }
    }

    // 添加序号列
    function addSerialColumn(headRow, bodyTable) {
        // 移除旧序号列（如果需要重新创建）
        const existingSerialHead = document.querySelector('.serial-column-head');
        if (existingSerialHead) {
            existingSerialHead.style.display = showSerial ? '' : 'none';
        } else if (showSerial) {
            // 表头：序号列
            const flowTitleTh = headRow.querySelector('[data-column-key="__run_name"]');
            if (flowTitleTh) {
                const serialTh = document.createElement('td');
                serialTh.className = 'native-head sort-column-wrap serial-column-head';
                serialTh.style = 'left: 0px; width: 30px; min-width: 30px; max-width: 30px;';
                serialTh.innerHTML = '<div class="native-head-wrapper"><div class="eui-d-flex"><div class="eui-flex-grow-1 eui-text-truncate hedge-flex-shrink" title="序号"><span>序号</span></div></div></div>';
                headRow.insertBefore(serialTh, flowTitleTh);
            }
        }

        // 更新序号数字
        updateSerialNumbers(bodyTable);
    }

    // 切换序号列显示状态
    function toggleSerialColumn(checked) {
        showSerial = checked;

        const serialHeads = document.querySelectorAll('.serial-column-head');
        const serialBodys = document.querySelectorAll('.serial-column-body');

        if (checked) {
            // 显示序号列
            serialHeads.forEach(el => el.style.display = '');
            serialBodys.forEach(el => el.style.display = '');

            // 重新检查表格并添加序号列
            const tableHead = document.querySelector('.eui-grid-header tr');
            const tableBody = document.querySelector('.table-body-wrapper tbody');
            if (tableHead && tableBody) {
                addSerialColumn(tableHead, tableBody);
            } else {
                waitForTable();
            }
        } else {
            // 隐藏序号列
            serialHeads.forEach(el => el.style.display = 'none');
            serialBodys.forEach(el => el.style.display = 'none');
        }
    }

    // 监听表格变化的观察者
    function observeTableChanges() {
        const tableBody = document.querySelector('.table-body-wrapper tbody');
        if (!tableBody) return;

        const observer = new MutationObserver((mutations) => {
            if (showSerial && mutations.some(m => m.addedNodes.length > 0)) {
                setTimeout(() => {
                    updateSerialNumbers(tableBody);
                }, 100);
            }
        });

        observer.observe(tableBody, {
            childList: true,
            subtree: true
        });
    }

    // ==================== 自定义每页数量功能 ====================
    // 添加悬浮控件
    function addControlPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            width: 220px;
            background: white;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.15);
            cursor: move;
            box-sizing: border-box;
        `;
        panel.title = "可拖动";

        // 标题
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #333;
        `;
        title.textContent = "OA表格增强工具";
        panel.appendChild(title);

        // 分隔线
        const divider1 = document.createElement('hr');
        divider1.style.cssText = `
            margin: 8px 0;
            border: none;
            border-top: 1px solid #eee;
        `;
        panel.appendChild(divider1);

        // 每页数量开关行
        const switchRow = document.createElement('div');
        switchRow.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            gap: 8px;
        `;
        const switchLabel = document.createElement('span');
        switchLabel.style.fontSize = "13px";
        switchLabel.textContent = "启用条数修改：";
        switchRow.appendChild(switchLabel);
        const switchBtn = document.createElement('input');
        switchBtn.type = "checkbox";
        switchBtn.checked = isEnabled;
        switchBtn.onmousedown = (e) => e.stopPropagation();
        switchBtn.addEventListener('change', (e) => {
            isEnabled = e.target.checked;
            alert(isEnabled ? "条数修改已启用" : "条数修改已关闭");
        });
        switchRow.appendChild(switchBtn);
        panel.appendChild(switchRow);

        // 输入框行
        const inputRow = document.createElement('div');
        inputRow.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            gap: 8px;
        `;
        const inputLabel = document.createElement('span');
        inputLabel.style.fontSize = "13px";
        inputLabel.textContent = "自定义每页条数：";
        inputRow.appendChild(inputLabel);
        const input = document.createElement('input');
        input.type = "number";
        input.value = customLimit;
        input.min = 1;
        input.style.width = "60px";
        input.onmousedown = (e) => e.stopPropagation();
        input.addEventListener('change', (e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val >= 1) {
                customLimit = val;
                alert(`已设置每页条数为：${customLimit}`);
                document.querySelector('.page-size .eui-dropdown-toggle').innerText= customLimit;
                let item = document.querySelector('.page-size-menu').children[0];
                item.innerText = `${customLimit} 条/页`; // 改成你想要的任何数字，格式不变
                item.click();
                //document.querySelector('.page-size-menu').children[0].click();
            } else {
                e.target.value = customLimit;
                alert("请输入有效的正整数");
            }
        });
        inputRow.appendChild(input);
        panel.appendChild(inputRow);

        // 分隔线
        const divider2 = document.createElement('hr');
        divider2.style.cssText = `
            margin: 8px 0;
            border: none;
            border-top: 1px solid #eee;
        `;
        panel.appendChild(divider2);

        // 序号列开关行
        const serialSwitchRow = document.createElement('div');
        serialSwitchRow.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        const serialSwitchLabel = document.createElement('span');
        serialSwitchLabel.style.fontSize = "13px";
        serialSwitchLabel.textContent = "显示序号列：";
        serialSwitchRow.appendChild(serialSwitchLabel);
        const serialSwitchBtn = document.createElement('input');
        serialSwitchBtn.type = "checkbox";
        serialSwitchBtn.checked = showSerial;
        serialSwitchBtn.onmousedown = (e) => e.stopPropagation();
        serialSwitchBtn.addEventListener('change', (e) => {
            toggleSerialColumn(e.target.checked);
        });
        serialSwitchRow.appendChild(serialSwitchBtn);
        panel.appendChild(serialSwitchRow);

        // 添加到页面
        document.body.appendChild(panel);

        // 启用拖动
        makeDraggable(panel);
    }

    // 拖动功能
    function makeDraggable(element) {
        let isDragging = false;
        let offsetX, offsetY;

        element.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            const rect = element.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
            element.style.bottom = 'auto';
            element.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // URL修改逻辑（增加开关判断）
    function modifyUrl(url) {
        // 若未启用拦截，直接返回原URL
        if (!isEnabled) return url;
        // 启用时才替换参数
        if (!url) return url;
        return url.replace(/([?&])limit=\d+/g, `$1limit=${customLimit}`);
    }

    // 拦截XMLHttpRequest
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        if (method.toUpperCase() === 'GET') {
            url = modifyUrl(url); // 这里会自动判断是否启用
        }
        return originalXhrOpen.call(this, method, url, ...args);
    };

    // 拦截fetch
    const originalFetch = window.fetch;
    window.fetch = async function(input, init = {}) {
        let url = input;
        if (input instanceof Request) {
            url = input.url;
            init.method = input.method;
        }
        if ((init.method || 'GET').toUpperCase() === 'GET') {
            url = modifyUrl(url); // 这里会自动判断是否启用
        }
        return originalFetch.call(this, input, init);
    };

    // ==================== 初始化 ====================
    // 页面加载后初始化
    window.addEventListener('load', () => {
        addControlPanel(); // 初始化控制面板
        waitForTable();    // 初始化序号列
        observeTableChanges(); // 监听表格变化

        // 监听分页变化，重新生成序号
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('page-no') || e.target.textContent === '前往' ||
                e.target.closest('.page-no') || e.target.closest('.pagination-btn')) {
                setTimeout(function() {
                    if (showSerial) {
                        const tableBody = document.querySelector('.table-body-wrapper tbody');
                        if (tableBody) {
                            updateSerialNumbers(tableBody);
                        } else {
                            waitForTable();
                        }
                    }
                }, 300);
            }
        });

        // 监听表格内容变化
        const tableObserver = new MutationObserver(() => {
            if (showSerial) {
                setTimeout(() => {
                    const tableBody = document.querySelector('.table-body-wrapper tbody');
                    if (tableBody) updateSerialNumbers(tableBody);
                }, 100);
            }
        });

        tableObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();