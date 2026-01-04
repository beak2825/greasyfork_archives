// ==UserScript==
// @name         妙手自动填表、替换和筛选工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动填表、添加、导出、导入功能的悬浮工具
// @author       Kyo
// @match        https://erp.91miaoshou.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license           LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/558909/%E5%A6%99%E6%89%8B%E8%87%AA%E5%8A%A8%E5%A1%AB%E8%A1%A8%E3%80%81%E6%9B%BF%E6%8D%A2%E5%92%8C%E7%AD%9B%E9%80%89%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/558909/%E5%A6%99%E6%89%8B%E8%87%AA%E5%8A%A8%E5%A1%AB%E8%A1%A8%E3%80%81%E6%9B%BF%E6%8D%A2%E5%92%8C%E7%AD%9B%E9%80%89%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const defaultAutoFilling = [
        { "formName": "表单1", "value": "选择1" },
        { "formName": "表单2", "value": "选择2" }
    ];

    // 创建悬浮窗口
    const createFloatingWindow = () => {
        const container = document.createElement('div');
        container.id = 'floating-window';
        container.innerHTML = `
            <div id="window-header">自动填表工具</div>
            <div id="window-content">
                <button id="auto-fill-btn">自动填表</button>
                <button id="add-btn">添加按钮</button>
                <button id="export-btn">导出</button>
                <button id="import-btn">导入</button>
                <button id="replace-filter-btn">添加替换和筛选功能</button>
                <div id="add-form" style="display: none;">
                    <input type="text" id="form-name-input" placeholder="formName">
                    <input type="text" id="value-input" placeholder="value">
                    <button id="confirm-add">确认</button>
                    <button id="cancel-add">取消</button>
                </div>
                <div id="import-form" style="display: none;">
                    <textarea id="csv-input" placeholder="请粘贴CSV内容"></textarea>
                    <button id="confirm-import">确认</button>
                    <button id="cancel-import">取消</button>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #floating-window {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 250px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 9999;
                font-family: Arial, sans-serif;
            }
            
            #window-header {
                padding: 8px;
                background: #f0f0f0;
                border-bottom: 1px solid #ccc;
                cursor: move;
                font-weight: bold;
                text-align: center;
            }
            
            #window-content {
                padding: 10px;
            }
            
            button {
                display: block;
                width: 100%;
                margin-bottom: 8px;
                padding: 6px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            }
            
            button:hover {
                background: #45a049;
            }
            
            #add-form, #import-form {
                margin-top: 10px;
            }
            
            input, textarea {
                display: block;
                width: 100%;
                margin-bottom: 8px;
                padding: 6px;
                border: 1px solid #ccc;
                border-radius: 3px;
            }
            
            textarea {
                height: 100px;
                resize: vertical;
            }
            
            #floating-window #replace-filter-btn {
                background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
            }
            
            #floating-window #replace-filter-btn:hover {
                background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
                box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
                transform: translateY(-1px);
            }
        `;

        document.head.appendChild(style);
    };

    createFloatingWindow();

    // 获取元素
    const floatingWindow = document.getElementById('floating-window');
    const windowHeader = document.getElementById('window-header');
    const autoFillBtn = document.getElementById('auto-fill-btn');
    const addBtn = document.getElementById('add-btn');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const replaceFilterBtn = document.getElementById('replace-filter-btn');
    const addForm = document.getElementById('add-form');
    const formNameInput = document.getElementById('form-name-input');
    const valueInput = document.getElementById('value-input');
    const confirmAdd = document.getElementById('confirm-add');
    const cancelAdd = document.getElementById('cancel-add');
    const importForm = document.getElementById('import-form');
    const csvInput = document.getElementById('csv-input');
    const confirmImport = document.getElementById('confirm-import');
    const cancelImport = document.getElementById('cancel-import');

    // 初始化localStorage
    const initLocalStorage = () => {
        if (!localStorage.getItem('autoFillingLS')) {

            localStorage.setItem('autoFillingLS', JSON.stringify(defaultAutoFilling));
        }
    };

    initLocalStorage();

    // 自动填表功能
    const autoFill = () => {
        const autoFilling = JSON.parse(localStorage.getItem('autoFillingLS'));

        autoFilling.forEach(item => {
            const selects = document.querySelectorAll('select');
            selects.forEach(select => {
                const options = select.querySelectorAll('option');
                options.forEach(option => {
                    if (option.textContent === item.formName) {
                        select.value = item.value;
                    }
                });
            });
        });
    };

    // 添加功能
    const showAddForm = () => {
        addForm.style.display = 'block';
    };

    const hideAddForm = () => {
        addForm.style.display = 'none';
        formNameInput.value = '';
        valueInput.value = '';
    };

    const addItem = () => {
        const formName = formNameInput.value.trim();
        const value = valueInput.value.trim();

        if (formName && value) {
            const autoFilling = JSON.parse(localStorage.getItem('autoFillingLS'));
            autoFilling.push({ formName, value });
            localStorage.setItem('autoFillingLS', JSON.stringify(autoFilling));
            hideAddForm();
        }
    };

    // 导出CSV功能
    const exportCSV = () => {
        const autoFilling = JSON.parse(localStorage.getItem('autoFillingLS'));
        let csvContent = 'formName\tvalue\n';

        autoFilling.forEach(item => {
            csvContent += `${item.formName}\t${item.value}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'autoFilling.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 导入CSV功能
    const showImportForm = () => {
        importForm.style.display = 'block';
    };

    const hideImportForm = () => {
        importForm.style.display = 'none';
        csvInput.value = '';
    };

    const importCSV = () => {
        const csvContent = csvInput.value.trim();
        if (!csvContent) return;

        const lines = csvContent.split('\n');
        const autoFilling = [];

        // 跳过表头
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // 解析CSV行
            const values = [];
            let currentValue = '';
            let inQuotes = false;

            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                debugger

                if (char === '"' && line[j + 1] === '"') {
                    currentValue += '"';
                    j++;
                } else if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === '\t' && !inQuotes) {
                    values.push(currentValue.trim());
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }

            values.push(currentValue.trim());

            if (values.length >= 2) {
                autoFilling.push({
                    formName: values[0],
                    value: values[1]
                });
            }
        }

        localStorage.setItem('autoFillingLS', JSON.stringify(autoFilling));
        hideImportForm();
    };

    // 事件监听
    autoFillBtn.addEventListener('click', autoFill);
    addBtn.addEventListener('click', showAddForm);
    confirmAdd.addEventListener('click', addItem);
    cancelAdd.addEventListener('click', hideAddForm);
    exportBtn.addEventListener('click', exportCSV);
    importBtn.addEventListener('click', showImportForm);
    confirmImport.addEventListener('click', importCSV);
    cancelImport.addEventListener('click', hideImportForm);
    replaceFilterBtn.addEventListener('click', addReplaceAndFilter);

    // 拖动功能
    let isDragging = false;
    let startX, startY, offsetX, offsetY;

    windowHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        offsetX = floatingWindow.offsetLeft;
        offsetY = floatingWindow.offsetTop;

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    });

    const drag = (e) => {
        if (isDragging) {
            const newX = offsetX + e.clientX - startX;
            const newY = offsetY + e.clientY - startY;

            floatingWindow.style.left = newX + 'px';
            floatingWindow.style.top = newY + 'px';
        }
    };

    const stopDrag = () => {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    };

})();
