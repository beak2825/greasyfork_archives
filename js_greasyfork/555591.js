// ==UserScript==
// @name         WebSocket 監控與匯出工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  監控網頁 WebSocket 連接，顯示通信內容並支持匯出 (JSON/CSV/TXT)
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555591/WebSocket%20%E7%9B%A3%E6%8E%A7%E8%88%87%E5%8C%AF%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/555591/WebSocket%20%E7%9B%A3%E6%8E%A7%E8%88%87%E5%8C%AF%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存儲 WebSocket 消息
    let wsMessages = [];
    let originalWebSocket = window.WebSocket;
    let isMonitoring = true;

    // 攔截 WebSocket
    window.WebSocket = function(...args) {
        const ws = new originalWebSocket(...args);
        const wsId = generateId();

        // 監聽消息
        ws.addEventListener('message', function(event) {
            if (!isMonitoring) return;

            const message = {
                id: generateId(),
                wsId: wsId,
                type: 'received',
                data: event.data,
                timestamp: new Date().toISOString(),
                url: args[0]
            };

            wsMessages.push(message);
            updateUI(message);
        });

        // 攔截發送消息
        const originalSend = ws.send;
        ws.send = function(data) {
            if (isMonitoring) {
                const message = {
                    id: generateId(),
                    wsId: wsId,
                    type: 'sent',
                    data: data,
                    timestamp: new Date().toISOString(),
                    url: args[0]
                };

                wsMessages.push(message);
                updateUI(message);
            }

            return originalSend.call(this, data);
        };

        return ws;
    };

    // 恢復原始 WebSocket
    window.WebSocket.prototype = originalWebSocket.prototype;

    // 生成唯一ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // 創建UI界面
    function createUI() {
        const container = document.createElement('div');
        container.id = 'ws-monitor-container';
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 400px;
            max-height: 500px;
            background: #f5f5f5;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 12px;
            display: flex;
            flex-direction: column;
            color: #000000;
        `;

        // 標題欄
        const header = document.createElement('div');
        header.style.cssText = `
            background: #333;
            color: #ffffff;
            padding: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            border-radius: 5px 5px 0 0;
        `;
        header.innerHTML = `
            <span>WebSocket 監控器</span>
            <div>
                <button id="ws-toggle-monitor" style="margin-right: 5px;">暫停</button>
                <button id="ws-clear">清除</button>
                <button id="ws-export">匯出</button>
                <button id="ws-close">×</button>
            </div>
        `;

        // 控制面板
        const controls = document.createElement('div');
        controls.style.cssText = `
            padding: 8px;
            background: #eaeaea;
            border-bottom: 1px solid #ccc;
            color: #000000;
        `;
        controls.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 5px;">
                <div>
                    <label style="color: #000000;">過濾類型: </label>
                    <select id="ws-filter-type" style="color: #000000;">
                        <option value="all">全部</option>
                        <option value="sent">發送</option>
                        <option value="received">接收</option>
                    </select>
                </div>
                <div>
                    <input type="text" id="ws-search" placeholder="搜索消息內容..." style="width: 100%; color: #000000;">
                </div>
            </div>
        `;

        // 消息列表
        const messageList = document.createElement('div');
        messageList.id = 'ws-message-list';
        messageList.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 5px;
            max-height: 300px;
            color: #000000;
        `;

        // 狀態欄
        const statusBar = document.createElement('div');
        statusBar.id = 'ws-status';
        statusBar.style.cssText = `
            padding: 5px;
            background: #ddd;
            border-top: 1px solid #ccc;
            font-size: 11px;
            border-radius: 0 0 5px 5px;
            color: #000000;
        `;
        statusBar.textContent = '監控中 - 消息數: 0';

        container.appendChild(header);
        container.appendChild(controls);
        container.appendChild(messageList);
        container.appendChild(statusBar);

        document.body.appendChild(container);

        // 添加事件監聽器
        document.getElementById('ws-toggle-monitor').addEventListener('click', toggleMonitoring);
        document.getElementById('ws-clear').addEventListener('click', clearMessages);
        document.getElementById('ws-export').addEventListener('click', exportMessages);
        document.getElementById('ws-close').addEventListener('click', () => container.style.display = 'none');
        document.getElementById('ws-filter-type').addEventListener('change', filterMessages);
        document.getElementById('ws-search').addEventListener('input', filterMessages);

        // 實現拖拽功能
        makeDraggable(container, header);

        return container;
    }

    // 使元素可拖拽
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 更新UI顯示
    function updateUI(message) {
        const messageList = document.getElementById('ws-message-list');
        const statusBar = document.getElementById('ws-status');

        if (!messageList) return;

        // 應用過濾器
        const filterType = document.getElementById('ws-filter-type').value;
        const searchText = document.getElementById('ws-search').value.toLowerCase();

        if (filterType !== 'all' && message.type !== filterType) return;
        if (searchText && !message.data.toLowerCase().includes(searchText)) return;

        const messageElement = document.createElement('div');
        messageElement.style.cssText = `
            margin-bottom: 5px;
            padding: 5px;
            border-radius: 3px;
            background: ${message.type === 'sent' ? '#e6f7ff' : '#f6ffed'};
            border-left: 3px solid ${message.type === 'sent' ? '#1890ff' : '#52c41a'};
            word-break: break-all;
            font-size: 11px;
            color: #000000;
        `;

        messageElement.innerHTML = `
            <div style="display: flex; justify-content: space-between;">
                <strong style="color: #000000;">${message.type === 'sent' ? '發送' : '接收'}</strong>
                <span style="color: #000000; font-size: 10px;">${new Date(message.timestamp).toLocaleTimeString()}</span>
            </div>
            <div style="margin-top: 3px; color: #000000;">${formatMessageData(message.data)}</div>
        `;

        messageList.appendChild(messageElement);
        messageList.scrollTop = messageList.scrollHeight;

        // 更新狀態欄
        if (statusBar) {
            statusBar.textContent = `${isMonitoring ? '監控中' : '已暫停'} - 消息數: ${wsMessages.length}`;
        }
    }

    // 格式化消息數據
    function formatMessageData(data) {
        try {
            // 嘗試解析為JSON
            const parsed = JSON.parse(data);
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            // 如果不是JSON，直接返回
            return data.toString();
        }
    }

    // 切換監控狀態
    function toggleMonitoring() {
        isMonitoring = !isMonitoring;
        const button = document.getElementById('ws-toggle-monitor');
        button.textContent = isMonitoring ? '暫停' : '繼續';

        const statusBar = document.getElementById('ws-status');
        if (statusBar) {
            statusBar.textContent = `${isMonitoring ? '監控中' : '已暫停'} - 消息數: ${wsMessages.length}`;
        }
    }

    // 清除消息
    function clearMessages() {
        wsMessages = [];
        const messageList = document.getElementById('ws-message-list');
        if (messageList) {
            messageList.innerHTML = '';
        }

        const statusBar = document.getElementById('ws-status');
        if (statusBar) {
            statusBar.textContent = `${isMonitoring ? '監控中' : '已暫停'} - 消息數: 0`;
        }
    }

    // 過濾消息
    function filterMessages() {
        const messageList = document.getElementById('ws-message-list');
        if (!messageList) return;

        messageList.innerHTML = '';

        const filterType = document.getElementById('ws-filter-type').value;
        const searchText = document.getElementById('ws-search').value.toLowerCase();

        wsMessages.forEach(message => {
            if (filterType !== 'all' && message.type !== filterType) return;
            if (searchText && !message.data.toLowerCase().includes(searchText)) return;

            updateUI(message);
        });
    }

    // 匯出消息
    function exportMessages() {
        if (wsMessages.length === 0) {
            alert('沒有消息可匯出');
            return;
        }

        // 創建格式選擇對話框
        const formatDialog = document.createElement('div');
        formatDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border: 2px solid #333;
            border-radius: 5px;
            z-index: 10001;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        formatDialog.innerHTML = `
            <h3 style="margin-top: 0; color: #000000;">選擇匯出格式</h3>
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <button class="format-btn" data-format="json">JSON</button>
                <button class="format-btn" data-format="csv">CSV</button>
                <button class="format-btn" data-format="txt">TXT</button>
            </div>
            <div style="text-align: right;">
                <button id="cancel-export" style="padding: 5px 10px;">取消</button>
            </div>
        `;

        document.body.appendChild(formatDialog);

        // 添加按鈕樣式
        const buttons = formatDialog.querySelectorAll('.format-btn');
        buttons.forEach(btn => {
            btn.style.cssText = `
                padding: 8px 15px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                flex: 1;
            `;
            btn.addEventListener('mouseover', () => {
                btn.style.background = '#45a049';
            });
            btn.addEventListener('mouseout', () => {
                btn.style.background = '#4CAF50';
            });
        });

        // 事件處理
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.target.getAttribute('data-format');
                document.body.removeChild(formatDialog);
                executeExport(format);
            });
        });

        document.getElementById('cancel-export').addEventListener('click', () => {
            document.body.removeChild(formatDialog);
        });

        // 點擊外部關閉
        formatDialog.addEventListener('click', (e) => {
            if (e.target === formatDialog) {
                document.body.removeChild(formatDialog);
            }
        });
    }

    // 執行匯出
    function executeExport(format) {
        let data, mimeType, extension;

        switch(format) {
                case 'json':
                    data = JSON.stringify(wsMessages, null, 2);
                    mimeType = 'application/json';
                    extension = 'json';
                    break;

                case 'csv':
                    // 轉換為CSV格式
                    const headers = ['時間戳', '類型', 'WebSocket ID', 'URL', '數據'];
                    const csvRows = [headers.join(',')];

                    wsMessages.forEach(message => {
                        const row = [
                            `"${message.timestamp}"`,
                            `"${message.type}"`,
                            `"${message.wsId}"`,
                            `"${message.url}"`,
                            `"${message.data.replace(/"/g, '""')}"`
                        ];
                        csvRows.push(row.join(','));
                    });

                    data = csvRows.join('\n');
                    mimeType = 'text/csv';
                    extension = 'csv';
                    break;

                case 'txt':
                    // 轉換為TXT格式 - 更易讀的純文本格式
                    let txtContent = `WebSocket 消息匯出\n`;
                    txtContent += `匯出時間: ${new Date().toLocaleString()}\n`;
                    txtContent += `總消息數: ${wsMessages.length}\n`;
                    txtContent += '='.repeat(50) + '\n\n';

                    wsMessages.forEach((message, index) => {
                        txtContent += `消息 #${index + 1}\n`;
                        txtContent += `時間: ${new Date(message.timestamp).toLocaleString()}\n`;
                        txtContent += `類型: ${message.type === 'sent' ? '發送' : '接收'}\n`;
                        txtContent += `連接: ${message.url}\n`;
                        txtContent += `內容:\n${formatMessageData(message.data)}\n`;
                        txtContent += '-'.repeat(30) + '\n\n';
                    });

                    data = txtContent;
                    mimeType = 'text/plain';
                    extension = 'txt';
                    break;

                default:
                    alert('不支援的格式');
                    return;
            }

        // 創建下載鏈接
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `websocket_messages_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // 顯示匯出成功消息
        showExportSuccess(format, wsMessages.length);
    }

    // 顯示匯出成功消息
    function showExportSuccess(format, count) {
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 3px;
            z-index: 10001;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        successMsg.textContent = `成功匯出 ${count} 條消息為 ${format.toUpperCase()} 格式`;

        document.body.appendChild(successMsg);

        // 3秒後自動消失
        setTimeout(() => {
            if (document.body.contains(successMsg)) {
                document.body.removeChild(successMsg);
            }
        }, 3000);
    }

    // 初始化UI
    function init() {
        // 檢查是否已經存在監控器
        if (document.getElementById('ws-monitor-container')) {
            return;
        }

        createUI();

        // 添加顯示/隱藏按鈕
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'WS監控';
        toggleBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 5px 10px;
            background: #333;
            color: #ffffff;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;

        toggleBtn.addEventListener('click', function() {
            const container = document.getElementById('ws-monitor-container');
            if (container) {
                container.style.display = container.style.display === 'none' ? 'flex' : 'none';
            }
        });

        document.body.appendChild(toggleBtn);
    }

    // 頁面加載完成後初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();