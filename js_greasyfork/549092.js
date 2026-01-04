// ==UserScript==
// @name         Google Ads Transparency Scraper
// @namespace    微信：eva-mirror
// @version      1.8
// @description  获取Google广告透明度中心的搜索推荐数据和搜索结果数据
// @author       sheire
// @match        https://adstransparency.google.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      adstransparency.google.com
// @downloadURL https://update.greasyfork.org/scripts/549092/Google%20Ads%20Transparency%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/549092/Google%20Ads%20Transparency%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储当前页面的数据
    let currentPageData = [];
    let searchResultsData = [];
    let isPanelOpen = false;
    let currentTab = 'recommendations'; // 'recommendations' 或 'results'
    let isFetching = false; // 是否正在获取数据

    // 添加自定义样式
    GM_addStyle(`
        #fetch-recommendations-btn {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            height: 40px;
            background-color: #4285f4;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #fetch-recommendations-btn:hover {
            background-color: #3367d6;
        }

        #fetch-recommendations-btn .loading-icon {
            margin-right: 8px;
            animation: blink 200ms infinite;
        }

        @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
        }

        #data-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-height: 80%;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10001;
            display: none;
            flex-direction: column;
            overflow: hidden;
        }

        #data-panel-header {
            padding: 16px;
            background: #f5f5f5;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ddd;
        }

        #data-panel-content {
            padding: 16px;
            overflow-y: auto;
            flex-grow: 1;
        }

        #close-panel {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #757575;
        }

        #copy-data, #copy-selected-data, #copy-data-results, #copy-selected-data-results {
            background: #4285f4;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 16px;
            margin-right: 10px;
        }

        #copy-data:hover, #copy-selected-data:hover, #copy-data-results:hover, #copy-selected-data-results:hover {
            background: #3367d6;
        }

        #data-table, #data-table-results {
            width: 100%;
            border-collapse: collapse;
        }

        #data-table th, #data-table td, #data-table-results th, #data-table-results td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        #data-table th, #data-table-results th {
            background-color: #f2f2f2;
            position: sticky;
            top: 0;
        }

        #data-table th:first-child, #data-table td:first-child, 
        #data-table-results th:first-child, #data-table-results td:first-child {
            width: 40px;
            text-align: center;
        }

        #data-table a, #data-table-results a {
            color: #4285f4;
            text-decoration: none;
        }

        #data-table a:hover, #data-table-results a:hover {
            text-decoration: underline;
        }

        #overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: none;
        }

        .tab-container {
            margin-bottom: 16px;
            border-bottom: 1px solid #ddd;
        }

        .tab-button {
            background-color: #f1f1f1;
            border: none;
            outline: none;
            cursor: pointer;
            padding: 10px 20px;
            transition: 0.3s;
            font-size: 16px;
            border-radius: 4px 4px 0 0;
        }

        .tab-button:hover {
            background-color: #ddd;
        }

        .tab-button.active {
            background-color: #4285f4;
            color: white;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }
    `);

    // 创建按钮
    const button = document.createElement('button');
    button.id = 'fetch-recommendations-btn';
    button.innerHTML = '获取广告主结果';
    document.body.appendChild(button);

    // 创建弹窗和遮罩
    const overlay = document.createElement('div');
    overlay.id = 'overlay';

    const panel = document.createElement('div');
    panel.id = 'data-panel';

    panel.innerHTML = `
        <div id="data-panel-header">
            <h3>广告数据</h3>
            <button id="close-panel">&times;</button>
        </div>
        <div id="data-panel-content">
            <div class="tab-container">
                <button class="tab-button active" data-tab="recommendations">搜索推荐</button>
                <button class="tab-button" data-tab="results">搜索结果</button>
            </div>
            
            <div id="recommendations-tab" class="tab-content active">
                <button id="copy-data">一键复制全部内容</button>
                <button id="copy-selected-data">复制勾选的资料库 id</button>
                <table id="data-table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" id="select-all-header"></th>
                            <th>广告主名</th>
                            <th>资料库 Id or 域名</th>
                            <th>地区</th>
                            <th>广告数</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            
            <div id="results-tab" class="tab-content">
                <button id="copy-data-results">一键复制全部内容</button>
                <button id="copy-selected-data-results">复制勾选的资料库 id</button>
                <table id="data-table-results">
                    <thead>
                        <tr>
                            <th><input type="checkbox" id="select-all-header-results"></th>
                            <th>资料库 Id</th>
                            <th>广告主名</th>
                            <th>来源</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    // 监听按钮点击事件
    button.addEventListener('click', () => {
        showPanel();
    });

    // 关闭弹窗事件
    document.getElementById('close-panel').addEventListener('click', () => {
        hidePanel();
    });

    // 点击遮罩关闭弹窗
    overlay.addEventListener('click', () => {
        hidePanel();
    });

    // Tab切换事件
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // 搜索推荐相关事件
    document.getElementById('copy-data').addEventListener('click', () => {
        copyAllDataToClipboard();
    });

    document.getElementById('copy-selected-data').addEventListener('click', () => {
        copySelectedDataToClipboard();
    });

    document.getElementById('select-all-header').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('#data-table .row-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // 搜索结果相关事件
    document.getElementById('copy-data-results').addEventListener('click', () => {
        copyAllResultsDataToClipboard();
    });

    document.getElementById('copy-selected-data-results').addEventListener('click', () => {
        copySelectedResultsDataToClipboard();
    });

    document.getElementById('select-all-header-results').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('#data-table-results .row-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // 显示弹窗
    function showPanel() {
        overlay.style.display = 'block';
        panel.style.display = 'flex';
        isPanelOpen = true;
        renderTable();
        renderResultsTable();
    }

    // 隐藏弹窗
    function hidePanel() {
        overlay.style.display = 'none';
        panel.style.display = 'none';
        isPanelOpen = false;
    }

    // Tab切换
    function switchTab(tabName) {
        currentTab = tabName;
        
        // 更新tab按钮状态
        document.querySelectorAll('.tab-button').forEach(button => {
            if (button.getAttribute('data-tab') === tabName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // 显示对应的内容
        document.querySelectorAll('.tab-content').forEach(content => {
            if (content.id === tabName + '-tab') {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }

    // 渲染搜索推荐表格数据
    function renderTable() {
        const tbody = document.querySelector('#data-table tbody');
        tbody.innerHTML = '';

        currentPageData.forEach((item, index) => {
            // 检查是否为资料库ID（以AR开头）或域名
            let idCellContent = item['2'] || '';
            if (item['2']) {
                if (item['2'].startsWith('AR')) {
                    // 资料库ID类型
                    idCellContent = `<a href="https://adstransparency.google.com/advertiser/${item['2']}?region=anywhere" target="_blank">${item['2']}</a>`;
                } else if (item['2'].includes('.')) {
                    // 域名类型
                    idCellContent = `<a href="https://adstransparency.google.com/?region=anywhere&domain=${item['2']}" target="_blank">${item['2']}</a>`;
                }
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="row-checkbox" data-index="${index}"></td>
                <td>${item['1'] || ''}</td>
                <td>${idCellContent}</td>
                <td>${item['3'] || ''}</td>
                <td>${item['4'] || ''}</td>
            `;
            tbody.appendChild(row);
        });

        // 为新添加的复选框添加事件监听器
        document.querySelectorAll('#data-table .row-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // 检查是否所有行都被选中，以更新全选复选框状态
                const allCheckboxes = document.querySelectorAll('#data-table .row-checkbox');
                const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
                document.getElementById('select-all-header').checked = allChecked;
            });
        });
    }

    // 渲染搜索结果表格数据
    function renderResultsTable() {
        const tbody = document.querySelector('#data-table-results tbody');
        tbody.innerHTML = '';

        searchResultsData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="row-checkbox" data-index="${index}" checked></td>
                <td><a href="https://adstransparency.google.com/advertiser/${item['1']}?region=anywhere" target="_blank">${item['1'] || ''}</a></td>
                <td>${item['12'] || ''}</td>
                <td>${item['14'] || ''}</td>
            `;
            tbody.appendChild(row);
        });

        // 设置表头全选按钮为选中状态
        document.getElementById('select-all-header-results').checked = true;

        // 为新添加的复选框添加事件监听器
        document.querySelectorAll('#data-table-results .row-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // 检查是否所有行都被选中，以更新全选复选框状态
                const allCheckboxes = document.querySelectorAll('#data-table-results .row-checkbox');
                const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
                document.getElementById('select-all-header-results').checked = allChecked;
            });
        });
    }

    // 复制搜索推荐全部数据到剪贴板
    function copyAllDataToClipboard() {
        let csvContent = "广告主名,资料库 Id or 域名,地区,广告数\n";
        currentPageData.forEach(item => {
            csvContent += `"${item['1'] || ''}","${item['2'] || ''}","${item['3'] || ''}","${item['4'] || ''}"\n`;
        });

        navigator.clipboard.writeText(csvContent).then(() => {
            alert('数据已复制到剪贴板');
        }).catch(err => {
            console.error('复制失败:', err);
            alert('复制失败');
        });
    }

    // 复制搜索推荐选中数据到剪贴板
    function copySelectedDataToClipboard() {
        const selectedCheckboxes = document.querySelectorAll('#data-table .row-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            alert('请至少选择一项');
            return;
        }

        const selectedIds = Array.from(selectedCheckboxes).map(checkbox => {
            const index = parseInt(checkbox.getAttribute('data-index'));
            return currentPageData[index]['2'] || '';
        }).filter(id => id !== '');

        const clipboardText = selectedIds.join(',');

        navigator.clipboard.writeText(clipboardText).then(() => {
            alert(`已复制 ${selectedIds.length} 个资料库 Id or 域名到剪贴板`);
        }).catch(err => {
            console.error('复制失败:', err);
            alert('复制失败');
        });
    }

    // 复制搜索结果全部数据到剪贴板
    function copyAllResultsDataToClipboard() {
        let csvContent = "资料库 Id,广告主名,来源\n";
        searchResultsData.forEach(item => {
            csvContent += `"${item['1'] || ''}","${item['12'] || ''}","${item['14'] || ''}"\n`;
        });

        navigator.clipboard.writeText(csvContent).then(() => {
            alert('数据已复制到剪贴板');
        }).catch(err => {
            console.error('复制失败:', err);
            alert('复制失败');
        });
    }

    // 复制搜索结果选中数据到剪贴板
    function copySelectedResultsDataToClipboard() {
        const selectedCheckboxes = document.querySelectorAll('#data-table-results .row-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            alert('请至少选择一项');
            return;
        }

        const selectedIds = Array.from(selectedCheckboxes).map(checkbox => {
            const index = parseInt(checkbox.getAttribute('data-index'));
            return searchResultsData[index]['1'] || '';
        }).filter(id => id !== '');

        const clipboardText = selectedIds.join(',');

        navigator.clipboard.writeText(clipboardText).then(() => {
            alert(`已复制 ${selectedIds.length} 个资料库 Id到剪贴板`);
        }).catch(err => {
            console.error('复制失败:', err);
            alert('复制失败');
        });
    }

    // 更新按钮文本
    function updateButtonText() {
        if (isFetching) {
            button.innerHTML = '<span class="loading-icon">🚗</span> 获取中...';
        } else {
            button.innerHTML = '👌 获取广告主结果';
        }
    }

    // 解析不同类型的数据格式
    function parseDataItem(item) {
        // 类型1: {"1": {"1": "广告主名", "2": "资料库Id", "3": "地区", "4": {"2": {"1": "广告数"}}}}
        if (item['1']) {
            const adCount = item['1']['4'] && item['1']['4']['2'] && item['1']['4']['2']['1'] 
                ? item['1']['4']['2']['1'] : '';
            
            return {
                '1': item['1']['1'] || '',
                '2': item['1']['2'] || '',
                '3': item['1']['3'] || '',
                '4': adCount
            };
        }

        // 类型2: {"2": {"1": "域名"}}
        if (item['2']) {
            return {
                '1': '', // 广告主名未知
                '2': item['2']['1'] || '', // 域名
                '3': '', // 地区未知
                '4': ''  // 广告数未知
            };
        }

        return null;
    }

    // 处理搜索推荐响应数据
    function processResponseData(data) {
        try {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }

            let parsedItems = [];

            // 处理主要数据结构
            if (data && data['1'] && Array.isArray(data['1'])) {
                data['1'].forEach(item => {
                    const parsed = parseDataItem(item);
                    if (parsed) {
                        parsedItems.push(parsed);
                    }
                });
            }

            // 更新当前页面数据（只保留最后一次请求的数据）
            currentPageData = parsedItems;
            isFetching = false;
            updateButtonText();

            // 如果面板打开中，更新表格
            if (isPanelOpen && currentTab === 'recommendations') {
                renderTable();
            }
        } catch (err) {
            console.error('处理数据出错:', err);
        }
    }

    // 处理搜索结果响应数据
    function processSearchResultsData(data) {
        try {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }

            let parsedItems = [];

            // 处理主要数据结构
            if (data && data['1'] && Array.isArray(data['1'])) {
                data['1'].forEach(item => {
                    // 提取需要的字段并去重
                    const newItem = {
                        '1': item['1'] || '',   // 资料库 id
                        '12': item['12'] || '', // 广告主名
                        '14': item['14'] || ''  // 来源
                    };
                    
                    // 检查是否已存在相同的资料库 id
                    const exists = parsedItems.some(existingItem => existingItem['1'] === newItem['1']);
                    if (!exists && newItem['1']) {
                        parsedItems.push(newItem);
                    }
                });
            }

            // 更新搜索结果数据
            searchResultsData = parsedItems;
            isFetching = false;
            updateButtonText();

            // 如果面板打开中，更新表格
            if (isPanelOpen && currentTab === 'results') {
                renderResultsTable();
            }
        } catch (err) {
            console.error('处理搜索结果数据出错:', err);
            isFetching = false;
            updateButtonText();
        }
    }

    // 拦截 XMLHttpRequest 请求
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    let lastRecommendationsRequest = null;
    let lastResultsRequest = null;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
        if (this._url && this._url.includes('/SearchService/SearchSuggestions')) {
            lastRecommendationsRequest = this;
            isFetching = true;
            updateButtonText();
            this.addEventListener('load', function() {
                try {
                    // 只处理最后一个请求
                    if (this === lastRecommendationsRequest) {
                        processResponseData(this.responseText);
                    }
                } catch (err) {
                    console.error('处理XMLHttpRequest响应失败:', err);
                    isFetching = false;
                    updateButtonText();
                }
            });
        } else if (this._url && this._url.includes('/SearchService/SearchCreatives')) {
            lastResultsRequest = this;
            isFetching = true;
            updateButtonText();
            this.addEventListener('load', function() {
                try {
                    // 只处理最后一个请求
                    if (this === lastResultsRequest) {
                        processSearchResultsData(this.responseText);
                    }
                } catch (err) {
                    console.error('处理搜索结果响应失败:', err);
                    isFetching = false;
                    updateButtonText();
                }
            });
        }
        return originalSend.apply(this, arguments);
    };

})();