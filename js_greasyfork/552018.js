// ==UserScript==
// @name         专利审核表格增强版
// @namespace    http://tampermonkey.net/
// @version      4.7
// @description  支持列筛选、导出设置，包含交付时间提取的专利表格增强工具，动态获取列定义并恢复初始筛选状态
// @match        https://crm.tuyizl.com/*
// @grant        蝋
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552018/%E4%B8%93%E5%88%A9%E5%AE%A1%E6%A0%B8%E8%A1%A8%E6%A0%BC%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/552018/%E4%B8%93%E5%88%A9%E5%AE%A1%E6%A0%B8%E8%A1%A8%E6%A0%BC%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 存储初始筛选状态
    let initialFilterState = new Map(); // 使用Map存储每个字段的初始选中状态

    // 从筛选器（ul.dropdown-menu）提取列定义，补充自定义列
    function getColumnsFromFilter() {
        // 1. 从页面筛选器获取原生列
        const filterItems = document.querySelectorAll('ul.dropdown-menu li label');
        const nativeColumns = Array.from(filterItems).map(item => {
            const input = item.querySelector('input[type="checkbox"]');
            return {
                field: input.getAttribute('data-field'), // 字段名（如 contract.contract_number）
                label: item.textContent.trim() // 列标签（如 合同编号）
            };
        });

        // 2. 补充自定义列（交付时间、专利师姓名）
        const customColumns = [
            { field: "custom_name", label: "专利师姓名" },
            { field: "delivery_time", label: "交付时间" }
        ];

        // 3. 合并原生列 + 自定义列，返回最终列定义
        return [...nativeColumns, ...customColumns];
    }

    // 保存初始筛选状态
    function saveInitialFilterState() {
        const checkboxes = document.querySelectorAll('ul.dropdown-menu input[type="checkbox"]');
        checkboxes.forEach(cb => {
            const field = cb.getAttribute("data-field");
            initialFilterState.set(field, cb.checked); // 存储每个字段的初始选中状态
        });
    }

    // 时间字段判定（包含时间相关关键词的字段）
    function isTimeField(field) {
        const timeKeywords = ['time', 'date', 'end', 'create', 'delivery'];
        return timeKeywords.some(keyword => field.toLowerCase().includes(keyword));
    }

    // 默认设置 - 包含交付时间导出配置
    const defaultSettings = {
        filterColumns: ["name", "patent_type", "deliverytime", "createtime", "admin.nickname"],
        exportColumns: ["name", "patent_type", "deliverytime", "createtime", "admin.nickname", "delivery_time"],
        exportOrder: ["name", "patent_type", "deliverytime", "createtime", "admin.nickname", "delivery_time"],
        patentAgentName: ""
    };

    // 从本地存储加载设置
    let raw = JSON.parse(localStorage.getItem('patentTableSettings') || '{}');
    let settings = Object.assign({}, defaultSettings, raw);
    // 确保数组字段有效性
    if (!Array.isArray(settings.filterColumns)) settings.filterColumns = [...defaultSettings.filterColumns];
    if (!Array.isArray(settings.exportColumns)) settings.exportColumns = [...defaultSettings.exportColumns];
    if (!Array.isArray(settings.exportOrder)) settings.exportOrder = [...defaultSettings.exportOrder];
    if (typeof settings.patentAgentName !== "string") settings.patentAgentName = "";

    let contextMenu, settingsPanel;
    let isFiltered = false;
    let exportMenuItem, settingsMenuItem;

    // 保存设置到本地存储
    function saveSettings() {
        localStorage.setItem('patentTableSettings', JSON.stringify(settings));
    }

    // 添加样式
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #table tbody tr {
                cursor: pointer;
            }
            /* 右键菜单样式 */
            .patent-context-menu {
                position: fixed;
                z-index: 2147483647;
                width: 150px;
                background: #fff;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                padding: 5px 0;
                display: none;
            }
            .patent-context-menu-item {
                padding: 8px 15px;
                cursor: pointer;
                font-size: 14px;
                color: #333;
            }
            .patent-context-menu-item:hover {
                background: #f0f0f0;
            }
            /* 设置面板样式 */
            .settings-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 2147483648;
                width: 600px;
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                padding: 20px;
                display: none;
            }
            .settings-panel.active {
                display: block;
            }
            .settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
                padding-bottom: 5px;
                border-bottom: 1px solid #eee;
            }
            .settings-title {
                font-size: 18px;
                font-weight: bold;
                color: #333;
            }
            .settings-close {
                cursor: pointer;
                font-size: 20px;
                color: #999;
            }
            .settings-section {
                margin-bottom: 20px;
            }
            .settings-section-title {
                font-size: 16px;
                margin-bottom: 10px;
                color: #666;
            }
            .column-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 0px;
                margin-bottom: 10px;
            }
            .column-item {
                font-size: 14px;
            }
            .column-item input {
                margin-right: 7px;
            }
            .settings-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 20px;
                padding-top: 10px;
                border-top: 1px solid #eee;
            }
            .settings-btn {
                padding: 6px 12px;
                border-radius: 4px;
                border: 1px solid #ddd;
                cursor: pointer;
                font-size: 14px;
            }
            .settings-btn.save {
                background: #409eff;
                color: white;
                border-color: #409eff;
            }
            .settings-btn.cancel {
                background: white;
                color: #666;
            }
            .export-order-container {
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 10px;
                height: 160px;
                overflow-y: auto;
                margin-bottom: 10px;
            }
            .export-order-item {
                padding: 5px 10px;
                background: #f5f5f5;
                border-radius: 4px;
                margin-bottom: 5px;
                cursor: default;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .order-controls {
                display: flex;
                gap: 5px;
            }
            .order-btn {
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 2px;
                border: 1px solid #ddd;
                background: white;
                cursor: pointer;
                font-size: 12px;
            }
            .name-settings {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            }
            .name-input {
                flex: 1;
                padding: 6px 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            .overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 2147483647;
                display: none;
            }
            .overlay.active {
                display: block;
            }
            /* 加载提示样式 */
            .loading-toast {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 2147483649;
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
    }

    /** 创建右键菜单 */
    function createContextMenu() {
        if (contextMenu) contextMenu.remove();

        contextMenu = document.createElement('div');
        contextMenu.className = 'patent-context-menu';
        contextMenu.id = 'patent-context-menu';

        // 1. 筛选列选项
        const filterItem = document.createElement('div');
        filterItem.className = 'patent-context-menu-item';
        filterItem.id = 'filter-menu-item';
        filterItem.textContent = isFiltered ? '取消筛选' : '快速筛选';
        filterItem.addEventListener('click', () => {
            toggleFilter();
            hideContextMenu();
        });

        // 2. 导出选中行选项
        exportMenuItem = document.createElement('div');
        exportMenuItem.className = 'patent-context-menu-item';
        exportMenuItem.id = 'export-menu-item';
        exportMenuItem.textContent = '导出选中';
        exportMenuItem.addEventListener('click', () => {
            exportCheckedRows();
            hideContextMenu();
        });

        // 3. 设置选项
        settingsMenuItem = document.createElement('div');
        settingsMenuItem.className = 'patent-context-menu-item';
        settingsMenuItem.id = 'settings-menu-item';
        settingsMenuItem.textContent = '设置';
        settingsMenuItem.addEventListener('click', () => {
            showSettingsPanel();
            hideContextMenu();
        });

        contextMenu.appendChild(filterItem);
        contextMenu.appendChild(exportMenuItem);
        contextMenu.appendChild(settingsMenuItem);

        document.body.appendChild(contextMenu);

        // 点击其他地方关闭菜单
        document.addEventListener('click', (e) => {
            if (!contextMenu.contains(e.target)) {
                hideContextMenu();
            }
        });

        updateMenuVisibility();
    }

    /** 创建设置面板 - 包含交付时间选项 */
    function createSettingsPanel() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.addEventListener('click', hideSettingsPanel);
        document.body.appendChild(overlay);

        // 创建面板
        settingsPanel = document.createElement('div');
        settingsPanel.className = 'settings-panel';

        // 面板头部
        const header = document.createElement('div');
        header.className = 'settings-header';

        const title = document.createElement('div');
        title.className = 'settings-title';
        title.textContent = '表格设置';

        const closeBtn = document.createElement('div');
        closeBtn.className = 'settings-close';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', hideSettingsPanel);

        header.appendChild(title);
        header.appendChild(closeBtn);
        settingsPanel.appendChild(header);

        // 1. 筛选列设置
        const filterSection = document.createElement('div');
        filterSection.className = 'settings-section';

        const filterTitle = document.createElement('div');
        filterTitle.className = 'settings-section-title';
        filterTitle.textContent = '筛选列设置';

        const filterGrid = document.createElement('div');
        filterGrid.className = 'column-grid';

        // 从筛选器获取列定义并渲染
        const columns = getColumnsFromFilter();
        columns.forEach(col => {
            // 排除自定义列
            if (col.field === "custom_name" || col.field === "delivery_time") return;

            const item = document.createElement('div');
            item.className = 'column-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `filter-${col.field}`;
            checkbox.checked = settings.filterColumns.includes(col.field);
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    settings.filterColumns.push(col.field);
                } else {
                    settings.filterColumns = settings.filterColumns.filter(f => f !== col.field);
                }
            });

            const label = document.createElement('label');
            label.htmlFor = `filter-${col.field}`;
            label.textContent = col.label;

            item.appendChild(checkbox);
            item.appendChild(label);
            filterGrid.appendChild(item);
        });

        filterSection.appendChild(filterTitle);
        filterSection.appendChild(filterGrid);
        settingsPanel.appendChild(filterSection);

        // 2. 导出列设置 - 包含交付时间选项
        const exportSection = document.createElement('div');
        exportSection.className = 'settings-section';

        const exportTitle = document.createElement('div');
        exportTitle.className = 'settings-section-title';
        exportTitle.textContent = '导出列设置';

        const exportGrid = document.createElement('div');
        exportGrid.className = 'column-grid';

        // 从筛选器获取列定义并渲染
        columns.forEach(col => {
            const item = document.createElement('div');
            item.className = 'column-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `export-${col.field}`;
            checkbox.checked = settings.exportColumns.includes(col.field);
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    if (!settings.exportColumns.includes(col.field)) {
                        settings.exportColumns.push(col.field);
                        if (!settings.exportOrder.includes(col.field)) {
                            settings.exportOrder.push(col.field);
                        }
                        updateExportOrderList();
                    }
                } else {
                    settings.exportColumns = settings.exportColumns.filter(f => f !== col.field);
                    settings.exportOrder = settings.exportOrder.filter(f => f !== col.field);
                    updateExportOrderList();
                }
            });

            const label = document.createElement('label');
            label.htmlFor = `export-${col.field}`;
            label.textContent = col.label;

            item.appendChild(checkbox);
            item.appendChild(label);
            exportGrid.appendChild(item);
        });

        // 导出顺序设置
        const orderTitle = document.createElement('div');
        orderTitle.textContent = '导出顺序：';
        orderTitle.style.margin = '10px 0';

        const orderContainer = document.createElement('div');
        orderContainer.className = 'export-order-container';
        orderContainer.id = 'export-order-container';

        exportSection.appendChild(exportTitle);
        exportSection.appendChild(exportGrid);
        exportSection.appendChild(orderTitle);
        exportSection.appendChild(orderContainer);
        settingsPanel.appendChild(exportSection);

        // 3. 专利师名称设置
        const nameSection = document.createElement('div');
        nameSection.className = 'settings-section';

        const nameTitle = document.createElement('div');
        nameTitle.className = 'settings-section-title';
        nameTitle.textContent = '专利师姓名设置';

        const nameInputContainer = document.createElement('div');
        nameInputContainer.className = 'name-settings';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'name-input';
        nameInput.id = 'patent-agent-name-input';
        nameInput.value = settings.patentAgentName;
        nameInput.placeholder = '输入专利师姓名（仅用于导出）';
        nameInput.addEventListener('input', (e) => {
            settings.patentAgentName = e.target.value;
        });

        nameInputContainer.appendChild(nameInput);
        nameSection.appendChild(nameTitle);
        nameSection.appendChild(nameInputContainer);
        settingsPanel.appendChild(nameSection);

        // 操作按钮
        const actions = document.createElement('div');
        actions.className = 'settings-actions';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'settings-btn cancel';
        cancelBtn.textContent = '取消';
        cancelBtn.addEventListener('click', hideSettingsPanel);

        const saveBtn = document.createElement('button');
        saveBtn.className = 'settings-btn save';
        saveBtn.textContent = '保存设置';
        saveBtn.addEventListener('click', () => {
            saveSettings();
            hideSettingsPanel();
            alert('设置已保存！');
        });

        actions.appendChild(cancelBtn);
        actions.appendChild(saveBtn);
        settingsPanel.appendChild(actions);

        document.body.appendChild(settingsPanel);

        // 初始化导出顺序列表
        updateExportOrderList();
    }

    /** 更新导出顺序列表 */
    function updateExportOrderList() {
        const container = document.getElementById('export-order-container');
        if (!container) return;

        container.innerHTML = '';

        const columns = getColumnsFromFilter();
        settings.exportOrder.forEach((field, index) => {
            const col = columns.find(c => c.field === field);
            if (!col) return;

            const item = document.createElement('div');
            item.className = 'export-order-item';
            item.dataset.field = field;

            const label = document.createElement('span');
            label.textContent = col.label;

            const controls = document.createElement('div');
            controls.className = 'order-controls';

            // 上移按钮
            const upBtn = document.createElement('div');
            upBtn.className = 'order-btn';
            upBtn.textContent = '↑';
            upBtn.disabled = index === 0;
            upBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (index > 0) {
                    [settings.exportOrder[index], settings.exportOrder[index - 1]] =
                    [settings.exportOrder[index - 1], settings.exportOrder[index]];
                    updateExportOrderList();
                }
            });

            // 下移按钮
            const downBtn = document.createElement('div');
            downBtn.className = 'order-btn';
            downBtn.textContent = '↓';
            downBtn.disabled = index === settings.exportOrder.length - 1;
            downBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (index < settings.exportOrder.length - 1) {
                    [settings.exportOrder[index], settings.exportOrder[index + 1]] =
                    [settings.exportOrder[index + 1], settings.exportOrder[index]];
                    updateExportOrderList();
                }
            });

            controls.appendChild(upBtn);
            controls.appendChild(downBtn);
            item.appendChild(label);
            item.appendChild(controls);
            container.appendChild(item);
        });
    }

    /** 显示右键菜单 */
    function showContextMenu(e) {
        e.preventDefault();
        if (!contextMenu) createContextMenu();
        else {
            document.getElementById('filter-menu-item').textContent = isFiltered ? '取消筛选' : '快速筛选';
            updateMenuVisibility();
        }

        // 定位菜单
        const x = e.clientX;
        const y = e.clientY;
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.style.display = 'block';
    }

    /** 隐藏右键菜单 */
    function hideContextMenu() {
        if (contextMenu) {
            contextMenu.style.display = 'none';
        }
    }

    /** 显示设置面板 */
    function showSettingsPanel() {
        if (!settingsPanel) createSettingsPanel();
        document.querySelector('.overlay').classList.add('active');
        settingsPanel.classList.add('active');
    }

    /** 隐藏设置面板 */
    function hideSettingsPanel() {
        document.querySelector('.overlay').classList.remove('active');
        if (settingsPanel) {
            settingsPanel.classList.remove('active');
        }
    }

    /** 切换筛选状态 */
    function toggleFilter() {
        const checkboxes = Array.from(document.querySelectorAll('ul.dropdown-menu input[type="checkbox"]'));
        if (!checkboxes.length) return;

        let delay = 0;
        checkboxes.forEach(cb => {
            const field = cb.getAttribute("data-field");
            // 切换时：如果是筛选状态，则恢复初始状态；否则应用设置的筛选列
            let shouldCheck = isFiltered ? initialFilterState.get(field) : settings.filterColumns.includes(field);
            if (cb.checked !== shouldCheck) {
                setTimeout(() => cb.click(), delay);
                delay += 100;
            }
        });

        isFiltered = !isFiltered;
        if (contextMenu) {
            document.getElementById('filter-menu-item').textContent = isFiltered ? '取消筛选' : '快速筛选';
            updateMenuVisibility();
        }
    }

    /** 从详情页提取交付时间 */
    async function getDeliveryTime(detailUrl) {
        try {
            // 发送请求获取详情页HTML
            const response = await fetch(detailUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 使用XPath查找交付时间元素
            const xpath = '//*[@id="edit-form"]/table[2]/tbody/tr[1]/td[2]';
            const result = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const deliveryTimeElement = result.singleNodeValue;

            if (deliveryTimeElement) {
                // 提取文本并清除空格
                let deliveryTime = deliveryTimeElement.textContent.trim();
                // 提取日期部分（如"2025-08-28 11:59" → "2025-08-28"）
                const dateMatch = deliveryTime.match(/^\d{4}-\d{2}-\d{2}/);
                return dateMatch ? dateMatch[0] : deliveryTime;
            }
            return '未找到交付时间';
        } catch (error) {
            console.error('获取交付时间失败:', error);
            return '获取失败';
        }
    }

    /** 基于页面原生复选框导出数据 - 包含交付时间 */
    async function exportCheckedRows() {
        // 1. 提取所有选中复选框 + 关联专利ID
        const checkboxWithId = [];
        document.querySelectorAll('#table tbody tr[data-index] input[name="btSelectItem"]:checked').forEach(cb => {
            const tr = cb.closest('tr');
            if (!tr) return;
            // 找到“详情”按钮的链接
            const detailLink = tr.querySelector('a.btn-dialog[title="详情"]');
            if (!detailLink) return;
            const href = detailLink.getAttribute('href');
            // 从链接中提取专利ID（示例格式：.../ids/12345...）
            const idMatch = href.match(/\/ids\/(\d+)/);
            if (!idMatch || !idMatch[1]) return;
            const patentId = idMatch[1];
            checkboxWithId.push({ cb, patentId });
        });

        // 2. 按专利ID去重（相同ID只保留第一个）
        const uniqueCheckboxes = [];
        const usedIds = new Set();
        checkboxWithId.forEach(item => {
            if (!usedIds.has(item.patentId)) {
                usedIds.add(item.patentId);
                uniqueCheckboxes.push(item.cb);
            }
        });

        // 3. 后续使用去重后的复选框列表
        const checkedCheckboxes = uniqueCheckboxes;
        if (!checkedCheckboxes.length) return alert("未选择任何行！");

        const table = document.querySelector("#table");
        if (!table) return;

        // 显示加载提示
        const loadingToast = document.createElement('div');
        loadingToast.className = 'loading-toast';
        loadingToast.textContent = '正在提取数据，请稍候...';
        document.body.appendChild(loadingToast);

        try {
            const data = [];
            let headers = [];
            const columns = getColumnsFromFilter();

            // 2. 构建导出列表头
            settings.exportOrder.forEach(field => {
                if (field === "custom_name") {
                    headers.push("专利师姓名");
                    return;
                }
                if (field === "delivery_time") {
                    headers.push("交付时间");
                    return;
                }

                const th = table.querySelector(`th[data-field="${field}"]`);
                if (th) {
                    const headerText = th.querySelector('.th-inner').innerText.trim();
                    headers.push(headerText);
                }
            });
            data.push(headers);

            // 3. 提取选中行数据（包含交付时间）
            for (const checkbox of checkedCheckboxes) {
                const tr = checkbox.closest('tr');
                if (!tr) continue;

                // 获取详情页链接
                const detailLink = tr.querySelector('a.btn-dialog[title="详情"]');
                const detailUrl = detailLink ? detailLink.href : '';

                // 预获取交付时间（如果需要导出）
                let deliveryTime = '';
                if (settings.exportColumns.includes('delivery_time') && detailUrl) {
                    deliveryTime = await getDeliveryTime(detailUrl);
                }

                const rowData = [];
                for (const field of settings.exportOrder) {
                    if (field === "custom_name") {
                        rowData.push(settings.patentAgentName || '');
                        continue;
                    }
                    if (field === "delivery_time") {
                        if (deliveryTime == "撰写完成"){
                            deliveryTime = "未交付"
                        }
                        rowData.push(deliveryTime);
                        continue;
                    }

                    const th = table.querySelector(`th[data-field="${field}"]`);
                    if (th) {
                        const thList = Array.from(table.querySelectorAll('th[data-field]'));
                        const cellIndex = thList.indexOf(th);
                        const cell = tr.cells[cellIndex];

                        if (cell) {
                            let cellValue = cell.innerText.trim();
                            // 时间字段处理
                            if (isTimeField(field)) {
                                const dateMatch = cellValue.match(/^\d{4}-\d{2}-\d{2}/);
                                if (dateMatch) cellValue = dateMatch[0];
                            }
                            rowData.push(cellValue);
                        } else {
                            rowData.push('');
                        }
                    }
                }
                data.push(rowData);
            }

            // 4. 导出Excel
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "专利数据");
            XLSX.writeFile(wb, "专利数据.xlsx");
        } catch (error) {
            console.error('导出失败:', error);
            alert('导出过程中发生错误，请重试');
        } finally {
            // 移除加载提示
            document.body.removeChild(loadingToast);
        }
    }

    /** 更新菜单可见性 */
    function updateMenuVisibility() {
        if (!exportMenuItem || !settingsMenuItem) return;

        const displayStyle = isFiltered ? 'none' : 'block';
        exportMenuItem.style.display = displayStyle;
        settingsMenuItem.style.display = displayStyle;
    }

    // 初始化
    function init() {
        addStyles();

        // 表格加载后添加功能
        const observer = new MutationObserver((mutations, obs) => {
            const table = document.querySelector('#table');
            const filterCheckboxes = document.querySelector('ul.dropdown-menu input[type="checkbox"]');

            if (table && filterCheckboxes) {
                // 保存初始筛选状态
                saveInitialFilterState();
                table.addEventListener('contextmenu', showContextMenu);
                obs.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();

})();
