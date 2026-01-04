// ==UserScript==
// @name         华医C网数据管理工具
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  支持查看、修改、清理数据
// @author       您的名字
// @match        *://cme28.91huayi.com/*
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // 全局状态变量
    let isCollapsed = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let currentEditingItem = null;

    // 数据项定义（courseList改为local类型）
    const dataItems = [
        { id: 'courseList', type: 'local', name: '课程列表', desc: '存储的课程信息列表（JSON数组）', isJsonArray: true },
        { id: 'dept_id2', type: 'GM', name: '部门ID', desc: '部门标识ID' },
        { id: 'title_id', type: 'GM', name: '标题ID', desc: '标题标识ID' },
        { id: 'savedQuestions', type: 'GM', name: '保存的问题', desc: '已保存的问答数据' },
        { id: 'currentCourseIndex', type: 'local', name: '当前课程索引', desc: '当前学习的课程索引' },
        { id: 'allCourseLinks', type: 'local', name: '所有课程链接', desc: '课程链接集合' },
        { id: 'videolinks', type: 'local', name: '视频链接', desc: '视频资源链接' },
        { id: 'examIndex', type: 'local', name: '考试索引', desc: '当前考试进度索引' },
        { id: 'savedLoginName', type: 'local', name: '保存的登录名', desc: '存储的登录用户名' }
    ];

    // 创建数据管理界面
    function createDataManagerUI() {
        if (document.getElementById('cme-data-manager')) return;

        // 主容器
        const container = document.createElement('div');
        container.id = 'cme-data-manager';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(255,255,255,0.9);
            backdrop-filter: blur(3px);
            padding: 0;
            border-radius: 8px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.15);
            width: 400px;
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
            cursor: move;
        `;

        // 标题栏
        const header = document.createElement('div');
        header.id = 'data-manager-header';
        header.style.cssText = `
            padding: 10px 15px;
            background: #4096ff;
            color: white;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.textContent = '华医CME数据管理';

        // 折叠按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'manager-toggle';
        toggleBtn.innerHTML = '−';
        toggleBtn.style.cssText = `
            background: transparent;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0 5px;
            line-height: 1;
        `;
        header.appendChild(toggleBtn);
        container.appendChild(header);

        // 内容区
        const content = document.createElement('div');
        content.id = 'data-manager-content';
        content.style.cssText = `
            padding: 15px;
            display: block;
            transition: all 0.3s ease;
        `;

        // 批量操作区
        const batchOps = document.createElement('div');
        batchOps.style.cssText = 'margin-bottom: 15px; display: flex; gap: 10px;';

        // 批量清理按钮
        const clearAllBtn = document.createElement('button');
        clearAllBtn.textContent = '清理所有数据';
        clearAllBtn.style.cssText = `
            flex: 1;
            padding: 8px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.2s;
        `;
        clearAllBtn.addEventListener('click', clearAllData);

        // 批量查看按钮
        const viewAllBtn = document.createElement('button');
        viewAllBtn.textContent = '查看所有数据';
        viewAllBtn.style.cssText = `
            flex: 1;
            padding: 8px;
            background: #2196f3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.2s;
        `;
        viewAllBtn.addEventListener('click', viewAllData);

        batchOps.appendChild(clearAllBtn);
        batchOps.appendChild(viewAllBtn);
        content.appendChild(batchOps);

        // 数据项列表标题
        const itemsTitle = document.createElement('p');
        itemsTitle.textContent = '数据项管理：';
        itemsTitle.style.cssText = 'margin: 10px 0 10px; color: #666; font-size: 14px; font-weight: bold;';
        content.appendChild(itemsTitle);

        // 数据项列表容器
        const itemsContainer = document.createElement('div');
        itemsContainer.id = 'data-items-container';
        itemsContainer.style.cssText = 'max-height: 300px; overflow-y: auto; padding-right: 5px;';
        content.appendChild(itemsContainer);

        // 渲染数据项
        renderDataItems(itemsContainer);

        // 数据编辑区域
        const editArea = document.createElement('div');
        editArea.id = 'data-edit-area';
        editArea.style.cssText = `
            margin-top: 15px;
            padding: 10px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            display: none;
        `;

        const editTitle = document.createElement('h4');
        editTitle.style.cssText = 'margin: 0 0 10px; font-size: 14px; color: #333;';
        editTitle.textContent = '编辑数据';

        const editDesc = document.createElement('div');
        editDesc.id = 'edit-description';
        editDesc.style.cssText = 'font-size: 12px; color: #666; margin-bottom: 8px; padding: 5px; background: #f5f5f5; border-radius: 3px;';

        const editTextarea = document.createElement('textarea');
        editTextarea.id = 'data-editor';
        editTextarea.style.cssText = `
            width: 100%;
            height: 120px;
            margin-bottom: 10px;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            resize: vertical;
        `;

        const editButtons = document.createElement('div');
        editButtons.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

        const cancelEditBtn = document.createElement('button');
        cancelEditBtn.textContent = '取消';
        cancelEditBtn.style.cssText = `
            padding: 4px 10px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        `;
        cancelEditBtn.addEventListener('click', () => {
            editArea.style.display = 'none';
            currentEditingItem = null;
        });

        const saveEditBtn = document.createElement('button');
        saveEditBtn.textContent = '保存修改';
        saveEditBtn.style.cssText = `
            padding: 4px 10px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        `;
        saveEditBtn.addEventListener('click', saveEditedData);

        editButtons.appendChild(cancelEditBtn);
        editButtons.appendChild(saveEditBtn);

        editArea.appendChild(editTitle);
        editArea.appendChild(editDesc);
        editArea.appendChild(editTextarea);
        editArea.appendChild(editButtons);
        content.appendChild(editArea);

        // 状态提示区
        const statusDiv = document.createElement('div');
        statusDiv.id = 'data-manager-status';
        statusDiv.style.cssText = `
            margin-top: 10px;
            padding: 5px;
            border-radius: 4px;
            font-size: 12px;
            display: none;
        `;
        content.appendChild(statusDiv);

        // 透明度调节
        const opacityControl = document.createElement('div');
        opacityControl.style.cssText = `
            padding: 0 15px 10px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: #666;
        `;
        opacityControl.innerHTML = `
            <span>透明度：</span>
            <input type="range" min="50" max="100" value="90" id="opacity-slider">
            <span id="opacity-value">90%</span>
        `;
        container.appendChild(content);
        container.appendChild(opacityControl);

        document.body.appendChild(container);
        bindInteractions(container, header, toggleBtn);
    }

    // 渲染数据项列表
    function renderDataItems(container) {
        container.innerHTML = '';

        dataItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.style.cssText = `
                margin-bottom: 8px;
                padding: 8px;
                background: #f9f9f9;
                border-radius: 4px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;

            // 数据项信息
            const itemInfo = document.createElement('div');
            itemInfo.style.cssText = 'flex-1;';

            const itemName = document.createElement('div');
            itemName.style.cssText = 'font-size: 13px; font-weight: 500;';
            itemName.textContent = item.name;

            const itemMeta = document.createElement('div');
            itemMeta.style.cssText = 'font-size: 11px; color: #666; margin-top: 2px;';
            itemMeta.textContent = `${item.type === 'GM' ? 'GM存储' : '本地存储'} · ID: ${item.id}${item.isJsonArray ? ' · JSON数组' : ''}`;

            itemInfo.appendChild(itemName);
            itemInfo.appendChild(itemMeta);

            // 操作按钮组
            const itemActions = document.createElement('div');
            itemActions.style.cssText = 'display: flex; gap: 5px;';

            // 查看按钮
            const viewBtn = document.createElement('button');
            viewBtn.innerHTML = '查看';
            viewBtn.style.cssText = `
                padding: 2px 6px;
                background: #2196f3;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
            `;
            viewBtn.addEventListener('click', () => viewDataItem(item));

            // 修改按钮
            const editBtn = document.createElement('button');
            editBtn.innerHTML = '修改';
            editBtn.style.cssText = `
                padding: 2px 6px;
                background: #ffc107;
                color: #333;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
            `;
            editBtn.addEventListener('click', () => editDataItem(item));

            // 清理按钮
            const clearBtn = document.createElement('button');
            clearBtn.innerHTML = '清理';
            clearBtn.style.cssText = `
                padding: 2px 6px;
                background: #dc3545;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
            `;
            clearBtn.addEventListener('click', () => clearSingleItem(item.id, item.type, item.name));

            itemActions.appendChild(viewBtn);
            itemActions.appendChild(editBtn);
            itemActions.appendChild(clearBtn);

            itemDiv.appendChild(itemInfo);
            itemDiv.appendChild(itemActions);
            container.appendChild(itemDiv);
        });
    }

    // 绑定交互事件
    function bindInteractions(container, header, toggleBtn) {
        const opacitySlider = document.getElementById('opacity-slider');
        const opacityValue = document.getElementById('opacity-value');

        // 拖拽功能
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStartX = e.clientX - container.offsetLeft;
            dragStartY = e.clientY - container.offsetTop;
            container.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const newLeft = e.clientX - dragStartX;
            const newTop = e.clientY - dragStartY;
            const maxLeft = window.innerWidth - container.offsetWidth;
            const maxTop = window.innerHeight - container.offsetHeight;
            container.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`;
            container.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`;
            container.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                container.style.cursor = 'move';
            }
        });

        // 折叠/展开功能
        toggleBtn.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            const content = document.getElementById('data-manager-content');
            const opacitySlider = document.getElementById('opacity-slider');
            const opacityValue = document.getElementById('opacity-value');

            if (isCollapsed) {
                content.style.display = 'none';
                opacitySlider.style.display = 'none';
                opacityValue.style.display = 'none';
                toggleBtn.innerHTML = '+';
                container.style.width = '180px';
            } else {
                content.style.display = 'block';
                opacitySlider.style.display = 'inline-block';
                opacityValue.style.display = 'inline-block';
                toggleBtn.innerHTML = '−';
                container.style.width = '400px';
            }
        });

        // 透明度调节
        opacitySlider.addEventListener('input', (e) => {
            const value = e.target.value;
            opacityValue.textContent = `${value}%`;
            container.style.background = `rgba(255,255,255,${value / 100})`;
        });

        // 内容区光标控制
        const content = document.getElementById('data-manager-content');
        content.addEventListener('mouseenter', () => {
            if (!isDragging) container.style.cursor = 'default';
        });
        content.addEventListener('mouseleave', () => {
            if (!isDragging) container.style.cursor = 'move';
        });
    }

    // 显示状态提示
    function showStatus(message, isError = false) {
        const statusDiv = document.getElementById('data-manager-status');
        if (!statusDiv) return;

        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        statusDiv.style.backgroundColor = isError ? 'rgba(248,215,218,0.9)' : 'rgba(212,237,218,0.9)';
        statusDiv.style.color = isError ? '#721c24' : '#155724';
        setTimeout(() => statusDiv.style.display = 'none', 3000);
    }

    // 专用函数：获取courseList数据（localStorage方式）
    function getCourseListData() {
        try {
            // 从localStorage获取，默认空数组
            const rawData = localStorage.getItem('courseList') || '[]';
            return JSON.parse(rawData);
        } catch (e) {
            showStatus(`courseList解析失败，返回空数组: ${e.message}`, true);
            return []; // 解析失败时返回空数组
        }
    }

    // 查看单个数据项（针对courseList优化）
    function viewDataItem(item) {
        try {
            let data;

            // 对courseList使用localStorage特殊处理
            if (item.id === 'courseList' && item.type === 'local') {
                data = getCourseListData();
            }
            // 其他GM存储项
            else if (item.type === 'GM') {
                data = GM_getValue(item.id);
            }
            // 其他本地存储项
            else {
                const rawData = localStorage.getItem(item.id);
                data = rawData ? JSON.parse(rawData) : null;
            }

            const dataStr = data !== null ? JSON.stringify(data, null, 2) : '无数据';
            alert(`${item.name} (${item.id})\n\n${dataStr}`);
        } catch (e) {
            showStatus(`查看失败：${e.message}`, true);
        }
    }

    // 编辑数据项（针对courseList优化）
    function editDataItem(item) {
        try {
            let data;

            // 对courseList使用localStorage特殊处理
            if (item.id === 'courseList' && item.type === 'local') {
                data = getCourseListData();
            }
            // 其他GM存储项
            else if (item.type === 'GM') {
                data = GM_getValue(item.id);
            }
            // 其他本地存储项
            else {
                const rawData = localStorage.getItem(item.id);
                data = rawData ? JSON.parse(rawData) : null;
            }

            currentEditingItem = item;
            const editArea = document.getElementById('data-edit-area');
            const editTitle = document.querySelector('#data-edit-area h4');
            const editDesc = document.getElementById('edit-description');
            const editTextarea = document.getElementById('data-editor');

            // 填充编辑区域
            editTitle.textContent = `编辑：${item.name} (${item.id})`;
            editDesc.textContent = `类型：${item.type === 'GM' ? 'GM存储' : '本地存储'} · 描述：${item.desc}${item.isJsonArray ? '（请输入有效的JSON数组）' : ''}`;
            editTextarea.value = data !== null ? JSON.stringify(data, null, 2) : (item.isJsonArray ? '[]' : '');

            // 显示编辑区域并滚动到视图
            editArea.style.display = 'block';
            editArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (e) {
            showStatus(`加载数据失败：${e.message}`, true);
        }
    }

    // 保存编辑的数据（针对courseList优化）
    function saveEditedData() {
        if (!currentEditingItem) return;

        try {
            const editTextarea = document.getElementById('data-editor');
            const rawValue = editTextarea.value.trim();
            let value = null;

            // 解析JSON（对JSON数组项做特殊校验）
            if (rawValue) {
                value = JSON.parse(rawValue);

                // 如果是标记为JSON数组的项，校验是否为数组
                if (currentEditingItem.isJsonArray && !Array.isArray(value)) {
                    throw new Error('该数据项必须是JSON数组格式');
                }
            }
            // 空值处理（数组项默认设为空数组）
            else if (currentEditingItem.isJsonArray) {
                value = [];
            }

            // 保存数据
            if (currentEditingItem.type === 'GM') {
                if (value === null) {
                    GM_deleteValue(currentEditingItem.id);
                } else {
                    GM_setValue(currentEditingItem.id, value);
                }
            } else {
                // 本地存储统一以JSON字符串格式保存
                localStorage.setItem(currentEditingItem.id, JSON.stringify(value));
            }

            showStatus(`已保存：${currentEditingItem.name}`);
            // 隐藏编辑区域
            document.getElementById('data-edit-area').style.display = 'none';
            currentEditingItem = null;
        } catch (e) {
            showStatus(`保存失败：${e.message}`, true);
        }
    }

    // 查看所有数据（优化courseList的提取）
    function viewAllData() {
        try {
            let allData = {};

            // 收集所有数据
            dataItems.forEach(item => {
                try {
                    let data;
                    if (item.id === 'courseList' && item.type === 'local') {
                        data = getCourseListData(); // 使用localStorage专用解析方式
                    } else if (item.type === 'GM') {
                        data = GM_getValue(item.id);
                    } else {
                        const rawData = localStorage.getItem(item.id);
                        data = rawData ? JSON.parse(rawData) : null;
                    }
                    allData[item.id] = {
                        name: item.name,
                        type: item.type,
                        value: data
                    };
                } catch (e) {
                    allData[item.id] = {
                        name: item.name,
                        type: item.type,
                        error: `获取失败: ${e.message}`
                    };
                }
            });

            // 新窗口展示所有数据
            const newWindow = window.open('', '_blank');
            newWindow.document.write(`
                <html>
                    <head>
                        <title>所有华医CME数据</title>
                        <style>
                            body { font-family: monospace; white-space: pre; padding: 20px; }
                            .item { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
                            .title { font-weight: bold; color: #2196f3; }
                        </style>
                    </head>
                    <body>
                        <h2>华医CME所有存储数据</h2>
                        ${Object.entries(allData).map(([id, info]) => `
                            <div class="item">
                                <div class="title">${info.name} (${id}) [${info.type}]</div>
                                <div>${info.error ? `错误: ${info.error}` : JSON.stringify(info.value, null, 2)}</div>
                            </div>
                        `).join('')}
                    </body>
                </html>
            `);
            newWindow.document.close();
        } catch (e) {
            showStatus(`查看所有数据失败：${e.message}`, true);
        }
    }

    // 清理单个数据项
    function clearSingleItem(id, type, name) {
        try {
            if (type === 'GM') {
                typeof GM_deleteValue === 'function'
                    ? (GM_deleteValue(id), showStatus(`已清理：${name}`))
                    : showStatus('GM_deleteValue函数不可用', true);
            } else {
                localStorage.removeItem(id);
                showStatus(`已清理：${name}`);
            }
        } catch (e) {
            showStatus(`清理失败：${e.message}`, true);
        }
    }

    // 清理所有数据
    function clearAllData() {
        if (!confirm('确定要清理所有数据吗？此操作不可恢复！')) return;
        try {
            // 清理GM存储
            dataItems.filter(item => item.type === 'GM').forEach(item => {
                typeof GM_deleteValue === 'function' && GM_deleteValue(item.id);
            });
            // 清理localStorage
            dataItems.filter(item => item.type === 'local').forEach(item => {
                localStorage.removeItem(item.id);
            });
            showStatus('所有数据已清理完成');
        } catch (e) {
            showStatus(`清理失败：${e.message}`, true);
        }
    }

    // 页面加载完成后初始化
    window.addEventListener('load', createDataManagerUI);
})();