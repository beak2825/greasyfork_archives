// ==UserScript==
// @name         虎码字根表增强
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  虎码字根表五种显示方案切换，支持搜索高亮和键盘导航
// @author 小明
// @license MIT
// @match        https://www.tiger-code.com/docs/comparisonTable
// @icon         https://www.tiger-code.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557075/%E8%99%8E%E7%A0%81%E5%AD%97%E6%A0%B9%E8%A1%A8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/557075/%E8%99%8E%E7%A0%81%E5%AD%97%E6%A0%B9%E8%A1%A8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .scheme-selector {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            min-width: 300px;
            border: 1px solid #e0e0e0;
        }

        .slider-container {
            display: flex;
            background: #f5f5f5;
            border-radius: 25px;
            padding: 4px;
            margin-bottom: 15px;
            position: relative;
            transition: all 0.3s ease;
        }

        .slider-container:hover {
            background: #ebebeb;
        }

        .slider-track {
            position: absolute;
            top: 4px;
            bottom: 4px;
            background: #409eff;
            border-radius: 20px;
            transition: all 0.3s ease;
            z-index: 1;
        }

        .scheme-btn {
            flex: 1;
            padding: 8px 12px;
            border: none;
            background: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            z-index: 2;
            position: relative;
            transition: color 0.3s ease;
        }

        .scheme-btn.active {
            color: white;
        }

        .switch-row {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            gap: 10px;
        }

        .search-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            outline: none;
            transition: border-color 0.3s;
        }

        .search-input:focus {
            border-color: #409eff;
        }

        .search-results {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 10px;
            background: #fafafa;
            display: none;
        }

        .search-result-item {
            padding: 8px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            transition: background 0.2s;
        }

        .search-result-item:hover, .search-result-item.highlighted {
            background: #e6f7ff;
        }

        .search-result-item.active {
            background: #409eff;
            color: white;
        }

        .custom-switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 24px;
        }

        .custom-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .switch-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #dcdfe6;
            transition: .4s;
            border-radius: 24px;
        }

        .switch-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .switch-slider {
            background-color: #409eff;
        }

        input:checked + .switch-slider:before {
            transform: translateX(36px);
        }

        .switch-text {
            position: absolute;
            left: 8px;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
            color: white;
            text-align: center;
            pointer-events: none;
        }

        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: #409eff;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }

        .back-to-top:hover {
            background: #337ecc;
            transform: translateY(-2px);
        }

        .serial-number {
            font-weight: bold;
            color: #666;
            min-width: 40px;
            text-align: right;
            padding-right: 10px;
        }

        .empty-row {
            height: 10px;
            background-color: #f8f9fa;
        }

        .search-highlight {
            background-color: #fff3cd !important;
            transition: background-color 0.5s ease;
            box-shadow: 0 0 0 2px #ffc107;
        }

        .search-highlight-active {
            background-color: #409eff !important;
            color: white !important;
            box-shadow: 0 0 0 3px #ffc107;
        }

        .search-info {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
            text-align: center;
        }
    `);

    // 键盘顺序映射
    const keyboardOrder = 'qwertyuiopasdfghjklzxcvbnm';
    const alphabetOrder = 'abcdefghijklmnopqrstuvwxyz';

    let currentScheme = GM_getValue('currentScheme', 1);
    let isSerialEnabled = GM_getValue('isSerialEnabled', currentScheme !== 1);
    let originalTableHTML = null;
    let searchTimeout = null;
    let resultsTimeout = null;
    let currentSearchResults = [];
    let currentSelectedIndex = -1;
    let isSearchActive = false;

    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    createUI();
                    setTimeout(restoreScheme, 2000);
                }, 5000);
            });
        } else {
            setTimeout(() => {
                createUI();
                setTimeout(restoreScheme, 2000);
            }, 5000);
        }
    }

    function createUI() {
        // 创建方案选择器
        const selector = document.createElement('div');
        selector.className = 'scheme-selector';
        selector.innerHTML = `
            <div class="slider-container">
                <div class="slider-track" style="width: 20%; left: 0%;"></div>
                <button class="scheme-btn active" data-scheme="1">one</button>
                <button class="scheme-btn" data-scheme="2">two</button>
                <button class="scheme-btn" data-scheme="3">three</button>
                <button class="scheme-btn" data-scheme="4">four</button>
                <button class="scheme-btn" data-scheme="5">five</button>
            </div>
            <div class="switch-row">
                <label class="custom-switch">
                    <input type="checkbox" ${isSerialEnabled ? 'checked' : ''}>
                    <span class="switch-slider">
                        <span class="switch-text">序号</span>
                    </span>
                </label>
                <input type="text" class="search-input" placeholder="搜索...">
            </div>
            <div class="search-results"></div>
        `;

        document.body.appendChild(selector);

        // 创建返回顶部按钮
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '↑';
        backToTop.title = '返回顶部';
        document.body.appendChild(backToTop);

        // 事件监听
        setupEventListeners(selector, backToTop);
    }

    function setupEventListeners(selector, backToTop) {
        // 方案按钮点击事件
        const buttons = selector.querySelectorAll('.scheme-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scheme = parseInt(e.target.dataset.scheme);
                switchScheme(scheme);
            });
        });

        // 序号开关事件
        const switchInput = selector.querySelector('input[type="checkbox"]');
        switchInput.addEventListener('change', (e) => {
            if (currentScheme === 1 && e.target.checked) {
                switchScheme(2);
            } else if (currentScheme !== 1 && !e.target.checked) {
                switchScheme(1);
            }
        });

        // 搜索输入事件
        const searchInput = selector.querySelector('.search-input');
        const resultsContainer = selector.querySelector('.search-results');

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            clearTimeout(resultsTimeout);

            const query = e.target.value.trim();
            if (query === '') {
                resultsContainer.style.display = 'none';
                clearSearchHighlights();
                isSearchActive = false;
                return;
            }

            searchTimeout = setTimeout(() => {
                performSearch(query, resultsContainer);
                resultsContainer.style.display = 'block';

                resultsTimeout = setTimeout(() => {
                    resultsContainer.style.display = 'none';
                    searchInput.value = '';
                    clearSearchHighlights();
                    isSearchActive = false;
                }, 10000);
            }, 300);
        });

        // 搜索框焦点事件
        searchInput.addEventListener('focus', () => {
            isSearchActive = true;
        });

        searchInput.addEventListener('blur', () => {
            // 延迟设置为非活动状态，以便点击搜索结果时可以处理
            setTimeout(() => {
                isSearchActive = false;
            }, 200);
        });

        // 键盘事件监听
        document.addEventListener('keydown', (e) => {
            if (!isSearchActive || currentSearchResults.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                navigateSearchResults(1); // 向下
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                navigateSearchResults(-1); // 向上
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (currentSelectedIndex >= 0 && currentSelectedIndex < currentSearchResults.length) {
                    scrollToResult(currentSelectedIndex);
                }
            } else if (e.key === 'Escape') {
                clearSearchHighlights();
                resultsContainer.style.display = 'none';
                searchInput.value = '';
                isSearchActive = false;
            }
        });

        // 返回顶部按钮事件
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // 滚动显示返回顶部按钮
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        });
    }

    function navigateSearchResults(direction) {
        if (currentSearchResults.length === 0) return;

        // 移除之前的高亮
        const previousIndex = currentSelectedIndex;
        if (previousIndex >= 0 && previousIndex < currentSearchResults.length) {
            const prevRow = currentSearchResults[previousIndex].row;
            if (prevRow) {
                prevRow.classList.remove('search-highlight-active');
                prevRow.classList.add('search-highlight');
            }
        }

        // 计算新的索引
        let newIndex = currentSelectedIndex + direction;
        if (newIndex < 0) newIndex = currentSearchResults.length - 1;
        if (newIndex >= currentSearchResults.length) newIndex = 0;

        currentSelectedIndex = newIndex;

        // 更新搜索结果列表高亮
        updateSearchResultsHighlight();

        // 滚动到选中的结果
        scrollToResult(currentSelectedIndex);
    }

    function updateSearchResultsHighlight() {
        const resultsContainer = document.querySelector('.search-results');
        const resultItems = resultsContainer.querySelectorAll('.search-result-item');

        resultItems.forEach((item, index) => {
            item.classList.remove('active');
            if (index === currentSelectedIndex) {
                item.classList.add('active');
            }
        });
    }

    function scrollToResult(index) {
        if (index < 0 || index >= currentSearchResults.length) return;

        const result = currentSearchResults[index];
        if (result && result.row) {
            // 添加活动高亮
            result.row.classList.remove('search-highlight');
            result.row.classList.add('search-highlight-active');

            // 平滑滚动到该行
            result.row.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    function clearSearchHighlights() {
        const highlightedRows = document.querySelectorAll('.search-highlight, .search-highlight-active');
        highlightedRows.forEach(row => {
            row.classList.remove('search-highlight', 'search-highlight-active');
        });

        currentSearchResults = [];
        currentSelectedIndex = -1;
    }

    function switchScheme(scheme) {
        currentScheme = scheme;
        isSerialEnabled = scheme !== 1;

        // 更新UI状态
        updateUIState();

        // 保存状态
        GM_setValue('currentScheme', currentScheme);
        GM_setValue('isSerialEnabled', isSerialEnabled);

        // 应用方案
        applyScheme();
    }

    function updateUIState() {
        const selector = document.querySelector('.scheme-selector');
        const buttons = selector.querySelectorAll('.scheme-btn');
        const track = selector.querySelector('.slider-track');
        const switchInput = selector.querySelector('input[type="checkbox"]');

        // 更新按钮状态
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.scheme) === currentScheme) {
                btn.classList.add('active');
            }
        });

        // 更新滑块位置
        const trackWidth = 20; // 每个按钮占20%
        const trackLeft = (currentScheme - 1) * trackWidth;
        track.style.width = `${trackWidth}%`;
        track.style.left = `${trackLeft}%`;

        // 更新开关状态
        switchInput.checked = isSerialEnabled;
    }

    function applyScheme() {
        const table = document.querySelector('.text-2xl table');
        if (!table) return;

        // 保存原始表格HTML
        if (!originalTableHTML) {
            originalTableHTML = table.outerHTML;
        } else {
            table.outerHTML = originalTableHTML;
        }

        const newTable = document.querySelector('.text-2xl table');
        const tbody = newTable.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        switch(currentScheme) {
            case 1:
                // 方案1：原始表格
                removeSerialNumbers(newTable);
                break;
            case 2:
                // 方案2：添加序号
                addSerialNumbers(newTable, rows, false);
                break;
            case 3:
                // 方案3：添加序号和空行
                addSerialNumbers(newTable, rows, true);
                break;
            case 4:
                // 方案4：键盘顺序，使用旧序号
                reorderByKeyboard(newTable, rows, false);
                break;
            case 5:
                // 方案5：键盘顺序，新序号
                reorderByKeyboard(newTable, rows, true);
                break;
        }
    }

    function addSerialNumbers(table, rows, addEmptyRows) {
        const thead = table.querySelector('thead tr');
        const tbody = table.querySelector('tbody');

        // 添加序号列标题
        if (!thead.querySelector('.serial-number')) {
            const serialTh = document.createElement('th');
            serialTh.className = 'serial-number';
            serialTh.style.textAlign = 'left';
            serialTh.textContent = '序号';
            thead.insertBefore(serialTh, thead.firstChild);
        }

        // 清空tbody
        tbody.innerHTML = '';

        let currentLetter = '';
        let serialNumber = 1;

        rows.forEach((row, index) => {
            const codeCell = row.querySelector('td:nth-child(2)');
            const firstLetter = codeCell.textContent.trim().charAt(0).toLowerCase();

            // 添加空行（方案3）
            if (addEmptyRows && currentLetter && currentLetter !== firstLetter) {
                const emptyRow = document.createElement('tr');
                emptyRow.className = 'empty-row';
                const emptyCell = document.createElement('td');
                emptyCell.colSpan = 5;
                emptyRow.appendChild(emptyCell);
                tbody.appendChild(emptyRow);
            }

            currentLetter = firstLetter;

            // 添加序号
            const serialTd = document.createElement('td');
            serialTd.className = 'serial-number';
            serialTd.textContent = serialNumber.toString().padStart(3, '0');

            const newRow = row.cloneNode(true);
            newRow.insertBefore(serialTd, newRow.firstChild);
            tbody.appendChild(newRow);

            serialNumber++;
        });
    }

    function reorderByKeyboard(table, rows, generateNewSerial) {
        const thead = table.querySelector('thead tr');
        const tbody = table.querySelector('tbody');

        // 添加序号列标题
        if (!thead.querySelector('.serial-number')) {
            const serialTh = document.createElement('th');
            serialTh.className = 'serial-number';
            serialTh.style.textAlign = 'left';
            serialTh.textContent = '序号';
            thead.insertBefore(serialTh, thead.firstChild);
        }

        // 清空tbody
        tbody.innerHTML = '';

        // 按首字母分组
        const groups = {};
        rows.forEach(row => {
            const codeCell = row.querySelector('td:nth-child(2)');
            const firstLetter = codeCell.textContent.trim().charAt(0).toLowerCase();
            if (!groups[firstLetter]) {
                groups[firstLetter] = [];
            }
            groups[firstLetter].push(row);
        });

        let serialNumber = 1;

        // 按键盘顺序处理
        for (let key of keyboardOrder) {
            if (groups[key]) {
                // 添加该字母组的所有行
                groups[key].forEach(row => {
                    const serialTd = document.createElement('td');
                    serialTd.className = 'serial-number';

                    if (generateNewSerial) {
                        serialTd.textContent = serialNumber.toString().padStart(3, '0');
                    } else {
                        // 使用原始序号（需要从原始行中获取）
                        const originalIndex = rows.indexOf(row) + 1;
                        serialTd.textContent = originalIndex.toString().padStart(3, '0');
                    }

                    const newRow = row.cloneNode(true);
                    newRow.insertBefore(serialTd, newRow.firstChild);
                    tbody.appendChild(newRow);

                    serialNumber++;
                });

                // 添加空行（在字母组之间）
                const nextKey = keyboardOrder[keyboardOrder.indexOf(key) + 1];
                if (nextKey && groups[nextKey]) {
                    const emptyRow = document.createElement('tr');
                    emptyRow.className = 'empty-row';
                    const emptyCell = document.createElement('td');
                    emptyCell.colSpan = 5;
                    emptyRow.appendChild(emptyCell);
                    tbody.appendChild(emptyRow);
                }
            }
        }
    }

    function removeSerialNumbers(table) {
        const thead = table.querySelector('thead tr');
        const tbody = table.querySelector('tbody');

        // 移除序号列标题
        const serialTh = thead.querySelector('.serial-number');
        if (serialTh) {
            serialTh.remove();
        }

        // 移除所有行的序号列
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const serialTd = row.querySelector('.serial-number');
            if (serialTd) {
                serialTd.remove();
            }
        });
    }

    function performSearch(query, resultsContainer) {
        const table = document.querySelector('.text-2xl table');
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');
        const results = [];

        // 先清除之前的高亮
        clearSearchHighlights();

        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            let rowText = '';
            let hasMatch = false;

            cells.forEach((cell, cellIndex) => {
                // 跳过主根发音列（根据内容特征判断）
                const cellContent = cell.textContent;
                if (!cellContent.includes('ììng') && !cellContent.includes('ēēng')) {
                    rowText += cellContent + ' ';

                    // 检查是否匹配
                    if (cellContent.toLowerCase().includes(query.toLowerCase())) {
                        hasMatch = true;
                    }
                }
            });

            if (hasMatch || rowText.toLowerCase().includes(query.toLowerCase())) {
                // 添加高亮样式
                row.classList.add('search-highlight');

                results.push({
                    index: index + 1,
                    row: row,
                    text: rowText.trim()
                });
            }
        });

        currentSearchResults = results;
        currentSelectedIndex = results.length > 0 ? 0 : -1;

        displaySearchResults(results, resultsContainer, query);

        // 如果有结果，滚动到第一个结果
        if (results.length > 0) {
            scrollToResult(0);
            updateSearchResultsHighlight();
        }
    }

    function displaySearchResults(results, container, query) {
        container.innerHTML = '';

        if (results.length === 0) {
            container.innerHTML = '<div class="search-result-item">未找到匹配结果</div>';
            return;
        }

        // 添加结果数量信息
        const info = document.createElement('div');
        info.className = 'search-info';
        info.textContent = `找到 ${results.length} 个结果，使用 ↑↓ 键导航，Enter 确认，ESC 退出`;
        container.appendChild(info);

        results.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            if (index === currentSelectedIndex) {
                resultItem.classList.add('active');
            }

            // 高亮匹配文本
            let displayText = result.text;
            const regex = new RegExp(query, 'gi');
            displayText = displayText.replace(regex, match =>
                `<mark style="background: #ffeb3b;">${match}</mark>`
            );

            resultItem.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 4px;">
                    ${currentScheme !== 1 ? `序号: ${result.index.toString().padStart(3, '0')} | ` : ''}
                    ${displayText}
                </div>
            `;

            resultItem.addEventListener('click', () => {
                currentSelectedIndex = index;
                scrollToResult(index);
                updateSearchResultsHighlight();
            });

            container.appendChild(resultItem);
        });
    }

    function restoreScheme() {
        updateUIState();
        applyScheme();
    }

    // 初始化
    init();
})();