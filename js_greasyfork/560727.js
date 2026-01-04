// ==UserScript==
// @name         嵌入式网页运行器
// @description  在当前页面域下运行嵌入式网页，避免跨域问题
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @version      1.1
// @author       zcchu
// @namespace https://greasyfork.org/users/1554128
// @downloadURL https://update.greasyfork.org/scripts/560727/%E5%B5%8C%E5%85%A5%E5%BC%8F%E7%BD%91%E9%A1%B5%E8%BF%90%E8%A1%8C%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560727/%E5%B5%8C%E5%85%A5%E5%BC%8F%E7%BD%91%E9%A1%B5%E8%BF%90%E8%A1%8C%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式定义
    GM_addStyle(`
        /* 吸附块样式 */
        .embed-web-runner {
            position: fixed;
            right: -380px; /* 默认只显示title */
            top: 50%;
            transform: translateY(-50%);
            background: rgb(43 140 188 / 60%);
            color: white;
            border-radius: 4em 0 0 4em;
            padding-bottom: 0.5em;
            cursor: pointer;
            z-index: 9999;
            transition: right 0.3s ease;
            display: flex;
            align-items: center;
        }

        /* 展开状态 */
        .embed-web-runner.expanded {
            right: 0; /* 完整显示所有元素 */
            background: rgb(43 140 188 / 90%);
        }

        /* 标题列样式 */
        .embed-web-runner-title {
            padding: 10px 5px;
            writing-mode: vertical-rl;
            text-orientation: upright;
            font-size: 14px;
            line-height: 20px;
            /* 移除背景色，沿用父元素背景色 */
            height: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 8px 0 0 8px;
            outline: none; /* 移除聚焦轮廓 */
        }

        /* 配置列表样式 - 放在吸附块内部 */
        .embed-web-configs {
            width: 380px;
            max-height: 80vh;
            overflow-y: auto;
            overflow-x: hidden;
            /* 移除背景色，沿用父元素背景色 */
            border-radius: 0;
            box-shadow: none;
            margin-left: 0;
            flex-shrink: 0;
            /* 设置最小高度等于头部高度，确保头部完整显示 */
            min-height: 230px;
        }

        .embed-web-config-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .embed-web-config-title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .embed-web-config-actions {
            display: flex;
            gap: 5px;
            min-width: 150px;
        }

        .embed-web-configs-header {
            padding: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            // background: rgba(0, 0, 0, 0.8);
            border-radius: 8px 0 0 0;
        }

        .embed-web-configs-title {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: white;
        }

        .embed-web-config-item {
            padding: 12px 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .embed-web-config-item:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .embed-web-config-title {
            margin: 0;
            font-size: 13px;
            font-weight: 500;
            color: white;
        }

        .embed-web-add-btn {
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 12px;
            cursor: pointer;
        }

        .embed-web-add-btn:hover {
            background: #0056b3;
        }

        .embed-web-config-item {
            padding: 12px 15px;
            border-bottom: 1px solid #f0f0f0;
        }

        .embed-web-config-item:last-child {
            border-bottom: none;
        }

        .embed-web-config-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .embed-web-config-title {
            margin: 0;
            font-size: 13px;
            font-weight: 500;
        }

        .embed-web-config-actions {
            display: flex;
            gap: 5px;
        }

        .embed-web-run-btn, .embed-web-edit-btn, .embed-web-delete-btn {
            padding: 3px 8px;
            border: none;
            border-radius: 3px;
            font-size: 11px;
            cursor: pointer;
        }

        .embed-web-run-btn {
            background: #28a745;
            color: white;
        }

        .embed-web-edit-btn {
            background: #ffc107;
            color: #212529;
        }

        .embed-web-delete-btn {
            background: #dc3545;
            color: white;
        }

        /* 模态框样式 */
        .embed-web-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .embed-web-modal.visible {
            opacity: 1;
            visibility: visible;
        }

        .embed-web-modal-content {
            background: white;
            border-radius: 8px;
            width: 95%;
            height: 95vh;
            display: flex;
            flex-direction: column;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }

        .embed-web-modal.visible .embed-web-modal-content {
            transform: scale(1);
        }

        .embed-web-modal-header {
            padding: 15px 20px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgb(43 140 188 / 90%);
            border-radius: 8px 8px 0 0;
            flex-shrink: 0;
        }

        .embed-web-modal-title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: white;
        }

        .embed-web-modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: white;
        }

        .embed-web-modal-body {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
            text-align: left;
        }

        .embed-web-form-group {
            margin-bottom: 20px;
        }

        .embed-web-form-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
        }

        .embed-web-form-input, .embed-web-form-textarea, .embed-web-form-select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        }

        .embed-web-form-textarea {
            resize: vertical;
            min-height: 200px;
            max-height: 400px;
        }

        /* 图标按钮样式 */
        .embed-web-run-btn, .embed-web-edit-btn, .embed-web-delete-btn, .embed-web-export-btn {
            padding: 4px 8px;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            margin-left: 5px;
        }

        .embed-web-run-btn {
            background: #28a745;
            color: white;
        }

        .embed-web-run-btn:hover {
            background: #218838;
        }

        .embed-web-edit-btn {
            background: #ffc107;
            color: #212529;
        }

        .embed-web-edit-btn:hover {
            background: #e0a800;
        }

        .embed-web-delete-btn {
            background: #dc3545;
            color: white;
        }

        .embed-web-delete-btn:hover {
            background: #c82333;
        }

        .embed-web-export-btn {
            background: #007bff;
            color: white;
        }

        .embed-web-export-btn:hover {
            background: #0056b3;
        }

        .embed-web-headers-list {
            margin-top: 10px;
        }

        .embed-web-header-item {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            align-items: flex-start;
        }

        .embed-web-header-item input {
            flex: 1;
        }

        .embed-web-remove-header {
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 3px 8px;
            font-size: 11px;
            cursor: pointer;
            align-self: center;
        }

        .embed-web-add-header {
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 12px;
            cursor: pointer;
            margin-top: 5px;
        }

        .embed-web-modal-footer {
            padding: 15px;
            border-top: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            background: rgb(43 140 188 / 90%);
            border-radius: 0 0 8px 8px;
        }

        .embed-web-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
        }

        .embed-web-btn-primary {
            background: #007bff;
            color: white;
        }

        .embed-web-btn-secondary {
            background: #6c757d;
            color: white;
        }

        /* iframe样式 */
        .embed-web-iframe-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            display: flex;
            justify-content: flex-end;
            align-items: stretch;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .embed-web-iframe-container.visible {
            opacity: 1;
            visibility: visible;
        }

        .embed-web-iframe-wrapper {
            width: 0;
            background: white;
            transition: width 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .embed-web-iframe-container.visible .embed-web-iframe-wrapper {
            width: 98%;
        }

        .embed-web-iframe-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 10002;
        }

        .embed-web-iframe {
            width: 100%;
            height: 100%;
            border: none;
        }

        /* localStorage选择器样式 */
        .embed-web-localstorage-selector {
            position: relative;
            margin-top: 10px;
        }

        .embed-web-localstorage-tree {
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            max-height: 350px;
            overflow-y: auto;
            z-index: 10003;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            font-size: 13px;
        }

        .embed-web-tree-node {
            padding: 10px 15px;
            cursor: pointer;
            border-bottom: 1px solid #f8f9fa;
            transition: all 0.2s ease;
        }

        .embed-web-tree-node:last-child {
            border-bottom: none;
        }

        .embed-web-tree-node:hover {
            background: #f8f9fa;
        }

        .embed-web-tree-node.expanded {
            background: #e3f2fd;
            border-left: 3px solid #007bff;
        }

        .embed-web-tree-node.leaf {
            font-weight: 500;
        }

        .embed-web-tree-node-label {
            display: flex;
            align-items: center;
        }

        .embed-web-tree-node-children {
            margin-left: 20px;
            display: none;
        }

        .embed-web-tree-node.expanded > .embed-web-tree-node-children {
            display: block;
        }

        .embed-web-tree-node-toggle {
            font-size: 12px;
            color: #6c757d;
            transition: transform 0.2s ease;
        }

        .embed-web-tree-node.expanded .embed-web-tree-node-toggle {
            transform: rotate(90deg);
        }

        /* 树节点深度缩进样式 */
        .embed-web-tree-node-children .embed-web-tree-node {
            border-left: 1px dashed #dee2e6;
            margin-left: 10px;
        }

        .embed-web-tree-node-children .embed-web-tree-node-children .embed-web-tree-node {
            margin-left: 20px;
        }

        /* 选择器头部样式 */
        .embed-web-localstorage-selector .embed-web-selector-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            border-radius: 6px 6px 0 0;
            font-weight: 500;
            font-size: 14px;
        }

        .embed-web-close-selector {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #6c757d;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
            transition: all 0.2s ease;
        }

        .embed-web-close-selector:hover {
            background: #e9ecef;
            color: #495057;
        }
    `);

    // 数据存储管理
    const CONFIG_KEY = 'embed_web_runner_configs';

    function getConfigs() {
        return GM_getValue(CONFIG_KEY, []);
    }

    function saveConfigs(configs) {
        GM_setValue(CONFIG_KEY, configs);
    }

    function addConfig(config) {
        const configs = getConfigs();
        config.id = Date.now().toString();
        configs.push(config);
        saveConfigs(configs);
        return config;
    }

    function updateConfig(id, updatedConfig) {
        const configs = getConfigs();
        const index = configs.findIndex(c => c.id === id);
        if (index !== -1) {
            configs[index] = { ...configs[index], ...updatedConfig };
            saveConfigs(configs);
            return configs[index];
        }
        return null;
    }

    function deleteConfig(id) {
        const configs = getConfigs();
        const filtered = configs.filter(c => c.id !== id);
        saveConfigs(filtered);
    }

    // 辅助函数：获取localStorage的所有item，按照key字符编码排序
    function getLocalStorageItems() {
        const items = [];

        // 获取所有localStorage的key并进行字符编码排序
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            keys.push(localStorage.key(i));
        }
        // 使用localeCompare进行字符编码排序
        keys.sort((a, b) => a.localeCompare(b));

        // 按排序后的key获取对应的值
        for (const key of keys) {
            const originalValue = localStorage.getItem(key);
            let parsedValue = originalValue;
            let isParsedObject = false;
            let parseError = null;

            try {
                const parsed = JSON.parse(originalValue);
                // 只有解析结果是对象且不是数组时，才标记为可展开节点
                if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                    parsedValue = parsed;
                    isParsedObject = true;
                }
            } catch (e) {
                parseError = e.message;
            }

            items.push({
                key,
                originalValue,
                parsedValue,
                isParsedObject,
                parseError
            });
        }
        return items;
    }

    // 辅助函数：HTML转义，防止XSS和属性赋值问题
    function escapeHtml(str) {
        if (typeof str !== 'string') {
            return str;
        }
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // 辅助函数：生成树节点HTML，支持动态加载
    function generateTreeNodeHtml(key, value, path = [], isFirstLevel = true) {
        const currentPath = [...path, key];

        // 检查value的类型和结构，确定是否为叶子节点
        // 只有解析结果是对象且不是数组时，才作为非叶子节点
        const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
        const isLeaf = !isObject;

        console.log(`🌳 生成树节点 - Key: ${key}, Path: [${currentPath.join(', ')}], IsLeaf: ${isLeaf}`);

        // 创建DOM元素，避免直接字符串拼接导致的转义问题
        const nodeDiv = document.createElement('div');
        nodeDiv.className = `embed-web-tree-node${isObject ? '' : ' leaf'}`;

        // 使用setAttribute设置属性，自动处理特殊字符
        const pathStr = JSON.stringify(currentPath);
        console.log(`🔧 设置节点属性 - data-path: ${pathStr}`);
        nodeDiv.setAttribute('data-path', pathStr);
        nodeDiv.setAttribute('data-expanded', 'false');

        const labelDiv = document.createElement('div');
        labelDiv.className = 'embed-web-tree-node-label';

        if (isLeaf) {
            // 叶子节点：key <span style="color: #6c757d; font-size: 11px;">(value)</span> 格式显示
            const keyTextNode = document.createTextNode(`${key} (`);
            labelDiv.appendChild(keyTextNode);

            // 格式化显示值，截断过长的字符串
            let displayValue = JSON.stringify(value);
            if (displayValue.length > 30) {
                displayValue = displayValue.substring(0, 30) + '...';
            }

            const valueSpan = document.createElement('span');
            valueSpan.textContent = displayValue;
            valueSpan.style.cssText = 'color: #6c757d; font-size: 11px;';
            labelDiv.appendChild(valueSpan);

            const closingBracket = document.createTextNode(')');
            labelDiv.appendChild(closingBracket);
        } else {
            // 非叶子节点：展开/折叠标识 + key
            const toggleSpan = document.createElement('span');
            toggleSpan.className = 'embed-web-tree-node-toggle';
            toggleSpan.textContent = '▶';
            toggleSpan.style.marginRight = '8px'; // 添加间距
            labelDiv.appendChild(toggleSpan);

            const keySpan = document.createElement('span');
            keySpan.textContent = key; // 使用textContent避免HTML注入
            labelDiv.appendChild(keySpan);
        }

        nodeDiv.appendChild(labelDiv);

        if (isObject) {
            const childrenDiv = document.createElement('div');
            childrenDiv.className = 'embed-web-tree-node-children';

            if (isFirstLevel) {
                childrenDiv.style.display = 'none';
            } else {
                // 递归生成所有子节点，按key字符编码排序
                const items = Object.entries(value);
                // 对键进行字符编码排序
                items.sort(([a], [b]) => a.localeCompare(b));
                for (const [childKey, childValue] of items) {
                    const childNode = generateTreeNodeHtml(childKey, childValue, currentPath, false);
                    childrenDiv.appendChild(childNode);
                }
            }

            nodeDiv.appendChild(childrenDiv);
        }

        // 返回DOM元素本身，而非HTML字符串
        return nodeDiv;
    }

    // 创建localStorage选择器
    function createLocalStorageSelector(onSelect) {
        const container = document.createElement('div');
        container.className = 'embed-web-localstorage-selector';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'embed-web-form-input';
        input.placeholder = '选择localStorage值或直接输入';

        const treeContainer = document.createElement('div');
        treeContainer.className = 'embed-web-localstorage-tree';
        treeContainer.style.display = 'none';

        // 直接生成所有localStorage item的DOM元素，作为根节点
        const localStorageItems = getLocalStorageItems();
        localStorageItems.forEach(item => {
            // 使用parsedValue生成节点，只有当isParsedObject为true时才会生成非叶子节点
            const node = generateTreeNodeHtml(item.key, item.parsedValue, [], true);
            treeContainer.appendChild(node);
        });

        container.appendChild(input);
        container.appendChild(treeContainer);

        // 点击输入框显示/隐藏树
        input.addEventListener('focus', () => {
            treeContainer.style.display = 'block';
        });

        // 点击树节点
        treeContainer.addEventListener('click', (e) => {
            const node = e.target.closest('.embed-web-tree-node');
            if (!node) return;

            if (node.classList.contains('leaf')) {
                // 选择叶子节点
                const path = JSON.parse(node.dataset.path);
                const value = `{${path.join('.')}}`;
                input.value = value;
                console.log(`🔍 选择叶子节点 - 路径: [${path.join(', ')}], 回显值: ${value}`);
                treeContainer.style.display = 'none';
                if (onSelect) onSelect(input.value);
            } else {
                // 非叶子节点：总是触发展开/折叠，无论点击位置
                const childrenContainer = node.querySelector('.embed-web-tree-node-children');
                const isExpanded = node.classList.contains('expanded');
                const toggle = node.querySelector('.embed-web-tree-node-toggle');

                if (isExpanded) {
                    // 折叠节点
                    node.classList.remove('expanded');
                    childrenContainer.style.display = 'none';
                    toggle.textContent = '▶';
                } else {
                    // 展开节点
                    node.classList.add('expanded');
                    childrenContainer.style.display = 'block';
                    toggle.textContent = '▼';
                }
            }
        });

        // 双击事件：与单击事件处理相同
        treeContainer.addEventListener('dblclick', (e) => {
            const node = e.target.closest('.embed-web-tree-node');
            if (!node || !node.classList.contains('leaf')) return;

            // 选择叶子节点
            const path = JSON.parse(node.dataset.path);
            const value = `{${path.join('.')}}`;
            input.value = value;
            console.log(`🔍 双击选择叶子节点 - 路径: [${path.join(', ')}], 回显值: ${value}`);
            treeContainer.style.display = 'none';
            if (onSelect) onSelect(input.value);
        });

        // 点击外部关闭树
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                treeContainer.style.display = 'none';
            }
        });

        return container;
    }

    // 通配符匹配函数
function matchUrlPattern(url, pattern) {
    // 先进行简单的URL包含测试
    if (url.includes(pattern)) {
        return true;
    }

    // 将通配符转换为正则表达式
    if (!pattern) return true;

    // 包含测试失败后，再使用正则表达式测试
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return regex.test(url);
}

    // 渲染插件列表
    function renderConfigs() {
        const configs = getConfigs();
        const configsList = document.querySelector('.embed-web-configs-list');
        configsList.innerHTML = '';

        // 获取当前URL，用于过滤插件
        const currentUrl = window.location.href;

        // 过滤出当前URL匹配的插件
        const filteredConfigs = configs.filter(config => {
            return matchUrlPattern(currentUrl, config.sites);
        });

        if (filteredConfigs.length > 0) {
            filteredConfigs.forEach(config => {
                const item = document.createElement('div');
                item.className = 'embed-web-config-item';
                item.innerHTML = `
                    <div class="embed-web-config-header">
                        <h4 class="embed-web-config-title">${config.title}</h4>
                        <div class="embed-web-config-actions">
                            <button class="embed-web-run-btn" data-id="${config.id}" title="运行">▶</button>
                            <button class="embed-web-edit-btn" data-id="${config.id}" title="编辑">✏</button>
                            <button class="embed-web-delete-btn" data-id="${config.id}" title="删除">✖</button>
                            <button class="embed-web-export-btn" data-id="${config.id}" title="导出当前插件">↓</button>
                        </div>
                    </div>
                `;
                configsList.appendChild(item);
            });

            // 添加事件监听
            addConfigActionsListeners();
        } else {
            // 显示空状态提示
            const emptyState = document.createElement('div');
            emptyState.className = 'embed-web-configs-empty';
            emptyState.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 14px;
                    text-align: center;
                    padding: 20px;
                ">
                    无适配当前网站插件
                </div>
            `;
            configsList.appendChild(emptyState);
        }
    }

    // 单个插件导出功能
    function exportSingleConfig(id) {
        const configs = getConfigs();
        const config = configs.find(c => c.id === id);
        if (!config) {
            console.error('未找到指定插件配置');
            return;
        }

        // 生成导出数据
        const exportData = [config];

        // 生成文件名
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
        const filename = `${config.title}_export_${timestamp}.json`;

        // 触发下载
        const jsonData = JSON.stringify(exportData, null, 2);
        downloadJsonFile(jsonData, filename);
    }

    // 批量导出功能
    function exportAllConfigs() {
        const configs = getConfigs();
        const currentUrl = window.location.href;

        // 过滤出当前URL匹配的插件
        const filteredConfigs = configs.filter(config => {
            return matchUrlPattern(currentUrl, config.sites);
        });

        if (filteredConfigs.length === 0) {
            alert('没有可导出的插件配置！');
            return;
        }

        // 生成文件名
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
        const filename = `所有插件_export_${timestamp}.json`;

        // 触发下载
        const jsonData = JSON.stringify(filteredConfigs, null, 2);
        downloadJsonFile(jsonData, filename);
    }

    // 添加插件项操作监听器
    function addConfigActionsListeners() {
        // 运行按钮
        document.querySelectorAll('.embed-web-run-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                runConfig(id);
            });
        });

        // 编辑按钮
        document.querySelectorAll('.embed-web-edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                editConfig(id);
            });
        });

        // 删除按钮
        document.querySelectorAll('.embed-web-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                deleteConfig(id);
                renderConfigs();
            });
        });

        // 单个导出按钮
        document.querySelectorAll('.embed-web-export-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                exportSingleConfig(id);
            });
        });
    }

    // 创建配置表单
    function createConfigForm(config = null, onSubmit) {
        const form = document.createElement('form');
        form.className = 'embed-web-config-form';

        // 创建表单基础结构，避免模板字符串插值问题
        form.innerHTML = `
            <div style="display: flex; gap: 10px; align-items: stretch;">
                <div class="embed-web-form-group" style="width: 310px;">
                    <label class="embed-web-form-label" for="config-title">标题</label>
                    <input type="text" id="config-title" class="embed-web-form-input" required placeholder="请输入插件标题" maxlength="20">
                    <div style="font-size: 12px; color: #6c757d; margin-top: 2px;">最多20个字符</div>
                </div>

                <div class="embed-web-form-group" style="flex: 1;">
                    <label class="embed-web-form-label" for="config-sites">适用网站</label>
                    <input type="text" id="config-sites" class="embed-web-form-input" placeholder="例如: *example.com/*">
                </div>

                <div class="embed-web-form-group" style="max-width: 200px;">
                    <label class="embed-web-form-label" for="config-type">类型</label>
                    <select id="config-type" class="embed-web-form-select">
                        <option value="api">API请求</option>
                        <option value="manual">手动录入HTML</option>
                    </select>
                </div>
            </div>

            <div class="embed-web-form-group api-config">
                <label class="embed-web-form-label">API请求配置</label>
                <div style="display: flex; gap: 10px; align-items: stretch;">
                    <select id="config-request-method" class="embed-web-form-select" style="max-width: 120px;">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                        <option value="HEAD">HEAD</option>
                        <option value="OPTIONS">OPTIONS</option>
                    </select>
                    <input type="text" id="config-api-content" class="embed-web-form-input" placeholder="例如: https://example.com/api 或 return 'https://example.com/api?time=' + new Date().getTime()">
                </div>
            </div>

            <div class="embed-web-form-group manual-config">
                <label class="embed-web-form-label" for="config-manual-content">HTML内容</label>
                <textarea id="config-manual-content" class="embed-web-form-textarea" placeholder="请输入HTML内容"></textarea>
            </div>

            <div class="embed-web-form-group api-config">
                <label class="embed-web-form-label">请求头</label>
                <div class="embed-web-headers-list" id="headers-list">
                    <!-- 动态生成请求头 -->
                </div>
                <button type="button" class="embed-web-add-header" id="add-header-btn">添加请求头</button>
            </div>

            <!-- 调试信息区块 -->
            <div class="embed-web-form-group api-config" id="debug-info" style="display: none;">
                <label class="embed-web-form-label">调试信息</label>

                <!-- 标签页切换 -->
                <div style="display: flex; margin-bottom: 10px; border-bottom: 1px solid #dee2e6;">
                    <button type="button" class="embed-web-btn embed-web-btn-secondary debug-tab" data-tab="request" style="border-radius: 4px 4px 0 0; border-bottom: none; margin-right: 5px; background-color: #e9ecef; color: #495057;">请求信息</button>
                    <button type="button" class="embed-web-btn embed-web-btn-secondary debug-tab" data-tab="response" style="border-radius: 4px 4px 0 0; border-bottom: none; background-color: #6c757d; color: white;">响应信息</button>
                </div>

                <!-- 调试内容区域 -->
                <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 15px; max-height: 400px; overflow-y: auto;">
                    <!-- 请求信息标签页 -->
                    <div id="request-info" style="display: none;">
                        <div style="margin-bottom: 15px;">
                            <strong>请求URL：</strong>
                            <div id="debug-request-url" style="word-break: break-all; margin-top: 5px;"></div>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <strong>请求方法：</strong>
                            <div id="debug-request-method" style="margin-top: 5px;"></div>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <strong>请求头：</strong>
                            <div id="debug-request-headers" style="margin-top: 5px; font-family: monospace;"></div>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <strong>请求参数：</strong>
                            <div id="debug-request-params" style="margin-top: 5px;"></div>
                        </div>
                    </div>

                    <!-- 响应信息标签页 -->
                    <div id="response-info" style="display: block;">
                        <div id="debug-response-status" style="margin-bottom: 15px; font-weight: bold;"></div>
                        <div style="margin-bottom: 15px;">
                            <strong>响应体：</strong>
                            <div id="debug-response-body" style="margin-top: 5px; white-space: pre-wrap; font-family: monospace;"></div>
                        </div>
                    </div>


                </div>
            </div>
        `;

        // 手动设置表单值，避免模板字符串插值问题
        const titleInput = form.querySelector('#config-title');
        const sitesInput = form.querySelector('#config-sites');
        const typeSelect = form.querySelector('#config-type');
        const requestMethodSelect = form.querySelector('#config-request-method');
        const apiContentInput = form.querySelector('#config-api-content');
        const manualContentTextarea = form.querySelector('#config-manual-content');

        // 添加实时字符计数显示
        const titleCharCount = titleInput.parentNode.querySelector('.title-char-count');
        if (!titleCharCount) {
            const charCountDiv = document.createElement('div');
            charCountDiv.className = 'title-char-count';
            charCountDiv.style.cssText = 'font-size: 12px; color: #6c757d; margin-top: 2px;';
            titleInput.parentNode.appendChild(charCountDiv);
        }

        // 更新字符计数显示
        const updateCharCount = () => {
            const totalChars = titleInput.value.length;
            const charCountDiv = titleInput.parentNode.querySelector('.title-char-count');
            charCountDiv.textContent = `${totalChars}/20 字符`;

            // 根据计数显示不同颜色
            if (totalChars > 20) {
                charCountDiv.style.color = '#dc3545';
            } else if (totalChars > 18) {
                charCountDiv.style.color = '#ffc107';
            } else {
                charCountDiv.style.color = '#6c757d';
            }
        };

        // 初始更新
        updateCharCount();

        // 添加输入事件监听
        titleInput.addEventListener('input', updateCharCount);
        const apiConfigDivs = form.querySelectorAll('.api-config');
        const manualConfigDivs = form.querySelectorAll('.manual-config');

        // 设置标题
        titleInput.value = config?.title || '';

        // 设置适用网站，默认为当前域名下所有路径
        sitesInput.value = config?.sites || location.origin + '/*';

        // 设置类型和显示状态
        typeSelect.value = config?.type || 'manual';
        if (config?.type === 'api') {
            apiConfigDivs.forEach(div => div.style.display = 'block');
            manualConfigDivs.forEach(div => div.style.display = 'none');
            apiContentInput.required = true;
            manualContentTextarea.required = false;
        } else {
            apiConfigDivs.forEach(div => div.style.display = 'none');
            manualConfigDivs.forEach(div => div.style.display = 'block');
            apiContentInput.required = false;
            manualContentTextarea.required = true;
        }

        // 设置请求方法
        if (requestMethodSelect) {
            requestMethodSelect.value = config?.method || 'GET';
        }

        // 设置内容
        if (config?.content) {
            if (config.type === 'api') {
                apiContentInput.value = config.content;
            } else {
                manualContentTextarea.value = config.content;
            }
        }

        // 切换配置类型
        typeSelect.addEventListener('change', (e) => {
            const type = e.target.value;
            form.querySelectorAll('.api-config').forEach(el => {
                el.style.display = type === 'api' ? 'block' : 'none';
            });
            form.querySelectorAll('.manual-config').forEach(el => {
                el.style.display = type === 'manual' ? 'block' : 'none';
            });
        });

        // 渲染请求头
        const renderHeaders = () => {
            // 每次执行都重新获取headersList元素，避免闭包变量问题
            const headersList = form.querySelector('#headers-list');
            if (!headersList) return; // 如果找不到元素，直接返回
            headersList.innerHTML = '';
            const headers = config?.headers || [];
            headers.forEach((header, index) => {
                const headerItem = document.createElement('div');
                headerItem.className = 'embed-web-header-item';
                headerItem.innerHTML = `
                    <div style="display: flex; gap: 10px; align-items: flex-start;width:100% ">
                        <input type="text" class="embed-web-form-input" placeholder="Header名称" value="${header.name || ''}" data-index="${index}" data-field="name" style="max-width: 240px;">
                        <div style="display: flex; gap: 5px; flex: 1;">
                            <input type="text" class="embed-web-form-input" placeholder="Header值" value="${header.value || ''}" data-index="${index}" data-field="value" style=" flex: 1;">
                            <button type="button" class="embed-web-select-localstorage" data-index="${index}" style="padding: 0 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; white-space: nowrap;">localStorage路径表达式</button>
                        </div>
                        <button type="button" class="embed-web-remove-header" data-index="${index}" style="align-self: center;">删除</button>
                    </div>
                `;
                headersList.appendChild(headerItem);

                // 添加localStorage选择按钮事件
                const selectBtn = headerItem.querySelector('.embed-web-select-localstorage');
                selectBtn.addEventListener('click', (e) => {
                    e.stopPropagation();

                    // 移除之前的选择器
                    const existingSelectors = document.querySelectorAll('.embed-web-localstorage-selector');
                    existingSelectors.forEach(sel => sel.remove());

                    const valueInput = headerItem.querySelector(`[data-index="${index}"][data-field="value"]`);

                    // 创建localStorage选择器，使用预先生成的树状DOM元素
                    const selector = document.createElement('div');
                    selector.className = 'embed-web-localstorage-selector';

                    // 获取valueInput的父容器，设置为相对定位，作为选择器的定位参考
                    const valueInputParent = valueInput.parentElement;
                    valueInputParent.style.position = 'relative';

                    // 设置选择器为绝对定位，使其吸附在valueInput下方
                    selector.style.position = 'absolute';
                    selector.style.top = `${valueInput.offsetHeight}px`;
                    selector.style.left = '0';
                    selector.style.width = `${valueInput.offsetWidth}px`;
                    selector.style.zIndex = '1000';
                    selector.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                    selector.style.margin = '0';

                    // 创建选择器头部
                    const selectorHeader = document.createElement('div');
                    selectorHeader.className = 'embed-web-selector-header';

                    const selectorTitle = document.createElement('span');
                    selectorTitle.textContent = '基于localStorage的Key路径';
                    selectorHeader.appendChild(selectorTitle);

                    const closeBtn = document.createElement('button');
                    closeBtn.type = 'button';
                    closeBtn.className = 'embed-web-close-selector';
                    closeBtn.innerHTML = '&times;';
                    selectorHeader.appendChild(closeBtn);
                    selector.appendChild(selectorHeader);

                    // 创建树容器
                    const treeContainer = document.createElement('div');
                    treeContainer.className = 'embed-web-localstorage-tree';

                    // 添加预先生成的树节点
                    const treeNodes = window._embedWebRunnerLocalStorageTreeNodes || [];
                    treeNodes.forEach(node => {
                        treeContainer.appendChild(node.cloneNode(true));
                    });

                    selector.appendChild(treeContainer);

                    // 将选择器添加到valueInput的父容器中，使其吸附在input下方
                    valueInputParent.appendChild(selector);

                    // 添加关闭按钮事件
                    closeBtn.addEventListener('click', (closeEvent) => {
                        closeEvent.stopPropagation();
                        selector.remove();
                    });

                    // 添加树节点点击事件
                    treeContainer.addEventListener('click', (treeEvent) => {
                        treeEvent.stopPropagation();

                        // 处理节点展开/折叠
                        const node = treeEvent.target.closest('.embed-web-tree-node');
                        if (!node) return;

                            if (node.classList.contains('leaf')) {
                            // 选择叶子节点
                            const path = JSON.parse(node.dataset.path);
                            const expression = `{${path.join('.')}}`;
                            valueInput.value = expression;
                            console.log(`🔍 选择叶子节点 - 路径: [${path.join(', ')}], 表达式: ${expression}`);
                            selector.remove();
                        } else {
                            // 动态加载子节点
                            const childrenContainer = node.querySelector('.embed-web-tree-node-children');
                            const isExpanded = node.classList.contains('expanded');
                            const toggle = node.querySelector('.embed-web-tree-node-toggle');

                            if (isExpanded) {
                                // 折叠节点
                                node.classList.remove('expanded');
                                childrenContainer.style.display = 'none';
                                toggle.textContent = '▶';
                            } else {
                                // 检查子节点是否已加载
                                if (childrenContainer.children.length === 0) {
                                    // 动态加载子节点
                                    let path;
                                    try {
                                        // 安全解析path
                                        const pathStr = node.dataset.path || '[]';
                                        console.log('🔍 展开节点 - 路径字符串:', pathStr);
                                        path = JSON.parse(pathStr);
                                        console.log('✅ 路径解析成功:', path);
                                    } catch (e) {
                                        console.error('❌ 解析path失败:', {
                                            error: e,
                                            pathStr: node.dataset.path,
                                            node: node
                                        });
                                        childrenContainer.innerHTML = '<div style="padding: 10px; color: #dc3545;">节点路径解析失败</div>';
                                        return;
                                    }

                                    // 检查path有效性
                                    if (!Array.isArray(path) || path.length === 0) {
                                        console.error('❌ 无效的节点路径:', path);
                                        // 清空容器并添加提示信息
                                        while (childrenContainer.firstChild) {
                                            childrenContainer.removeChild(childrenContainer.firstChild);
                                        }
                                        const errorMsg = document.createElement('div');
                                        errorMsg.style.cssText = 'padding: 10px; color: #dc3545;';
                                        errorMsg.textContent = '无效的节点路径';
                                        childrenContainer.appendChild(errorMsg);
                                        return;
                                    }

                                    try {
                                        // 现在path[0]直接是localStorage的key
                                        const localStorageKey = path[0];
                                        console.log('📦 从localStorage获取数据 - Key:', localStorageKey);

                                        let originalData = localStorage.getItem(localStorageKey);
                                        console.log('� 获取到原始数据:', originalData ? '存在' : '不存在');

                                        if (originalData) {
                                            // 解析原始数据
                                            let parsedData;
                                            try {
                                                parsedData = JSON.parse(originalData);
                                                console.log('✅ 原始数据JSON解析成功，数据类型:', typeof parsedData);
                                            } catch (parseError) {
                                                console.error('❌ 原始数据JSON解析失败:', parseError.message);
                                                // 如果解析失败，直接显示错误信息
                                                while (childrenContainer.firstChild) {
                                                    childrenContainer.removeChild(childrenContainer.firstChild);
                                                }
                                                const errorMsg = document.createElement('div');
                                                errorMsg.style.cssText = 'padding: 10px; color: #dc3545;';
                                                errorMsg.textContent = '数据解析失败，无法展开';
                                                childrenContainer.appendChild(errorMsg);
                                                return;
                                            }

                                            // 确定用于生成子节点的数据
                                            let dataForChildren = parsedData;

                                            // 只有当路径长度大于1时，才执行递归获取子节点数据
                                            if (path.length > 1) {
                                                console.log('🔍 递归获取子节点数据 - 初始数据:', parsedData);
                                                let currentData = parsedData;
                                                for (let i = 1; i < path.length; i++) {
                                                    const key = path[i];
                                                    console.log(`🔄 进入路径层级 ${i}: ${key}`);

                                                    if (!currentData || typeof currentData !== 'object') {
                                                        throw new Error(`路径不存在: ${path.slice(0, i+1).join('.')}`);
                                                    }

                                                    if (!(key in currentData)) {
                                                        throw new Error(`键不存在: ${key}`);
                                                    }

                                                    currentData = currentData[key];
                                                    console.log(`✅ 当前层级数据:`, currentData);
                                                }
                                                dataForChildren = currentData;
                                            }

                                            // 生成子节点DOM元素
                                            console.log('📋 准备生成子节点 - 最终数据:', dataForChildren);
                                            // 只有当数据是对象且不是数组时，才生成子节点
                                            if (dataForChildren && typeof dataForChildren === 'object' && !Array.isArray(dataForChildren)) {
                                                const items = Object.entries(dataForChildren);
                                                // 对键进行字符编码排序
                                                items.sort(([a], [b]) => a.localeCompare(b));
                                                console.log('📊 子节点数量:', items.length);

                                                // 清空容器
                                                while (childrenContainer.firstChild) {
                                                    childrenContainer.removeChild(childrenContainer.firstChild);
                                                }

                                                for (const [childKey, childValue] of items) {
                                                    const childPath = [...path, childKey];
                                                    console.log(`🆕 生成子节点: ${childKey} - 路径:`, childPath);
                                                    // 传递path而不是childPath，因为generateTreeNodeHtml函数内部会将childKey添加到path中
                                                    const childNode = generateTreeNodeHtml(childKey, childValue, path, false);
                                                    childrenContainer.appendChild(childNode);
                                                }
                                                console.log('✅ 所有子节点生成完成');
                                            } else {
                                                console.log('🍃 叶子节点，无下级数据:', dataForChildren);
                                                // 清空容器并添加提示信息
                                                while (childrenContainer.firstChild) {
                                                    childrenContainer.removeChild(childrenContainer.firstChild);
                                                }
                                                const emptyMsg = document.createElement('div');
                                                emptyMsg.style.cssText = 'padding: 10px; color: #6c757d;';
                                                emptyMsg.textContent = '叶子节点，无下级数据';
                                                childrenContainer.appendChild(emptyMsg);
                                            }
                                        } else {
                                            console.log('❌ localStorage中不存在该Key:', localStorageKey);
                                            // 清空容器并添加错误信息
                                            while (childrenContainer.firstChild) {
                                                childrenContainer.removeChild(childrenContainer.firstChild);
                                            }
                                            const errorMsg = document.createElement('div');
                                            errorMsg.style.cssText = 'padding: 10px; color: #dc3545;';
                                            errorMsg.textContent = '数据不存在';
                                            childrenContainer.appendChild(errorMsg);
                                        }
                                    } catch (e) {
                                        console.error('❌ 加载子节点失败:', {
                                            error: e,
                                            errorMessage: e.message,
                                            path: path,
                                            node: node,
                                            localStorageKey: path[0]
                                        });
                                        // 清空容器并添加错误信息
                                        while (childrenContainer.firstChild) {
                                            childrenContainer.removeChild(childrenContainer.firstChild);
                                        }
                                        const errorMsg = document.createElement('div');
                                        errorMsg.style.cssText = 'padding: 10px; color: #dc3545;';
                                        errorMsg.textContent = `加载失败: ${e.message}`;
                                        childrenContainer.appendChild(errorMsg);
                                    }
                                }

                                // 展开节点
                                node.classList.add('expanded');
                                childrenContainer.style.display = 'block';
                                toggle.textContent = '▼';
                            }
                        }
                    });

                    // 添加双击事件处理
                    treeContainer.addEventListener('dblclick', (treeEvent) => {
                        treeEvent.stopPropagation();

                        const node = treeEvent.target.closest('.embed-web-tree-node');
                        if (!node || !node.classList.contains('leaf')) return;

                        // 选择叶子节点（与单击事件处理相同）
                        const path = JSON.parse(node.dataset.path);
                        const expression = `{${path.join('.')}}`;
                        valueInput.value = expression;
                        console.log(`🔍 双击选择叶子节点 - 路径: [${path.join(', ')}], 表达式: ${expression}`);
                        selector.remove();
                    });

                    // 点击外部关闭选择器
                    document.addEventListener('click', function outsideClickHandler(event) {
                        if (!selector.contains(event.target) && event.target !== selectBtn) {
                            selector.remove();
                            document.removeEventListener('click', outsideClickHandler);
                        }
                    });
                });
            });

            // 添加删除请求头事件
            headersList.querySelectorAll('.embed-web-remove-header').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    config.headers.splice(index, 1);
                    renderHeaders();
                });
            });
        };

        if (config && !config.headers) {
            config.headers = [];
        }
        renderHeaders();

        // 添加请求头按钮
        const addHeaderBtn = form.querySelector('#add-header-btn');
        if (addHeaderBtn) {
            addHeaderBtn.addEventListener('click', () => {
                if (!config) config = { headers: [] };
                config.headers.push({ name: '', value: '' });
                renderHeaders();
            });
        }

        // 调试按钮功能实现
        const debugInfoDiv = form.querySelector('#debug-info');
        const requestInfoDiv = form.querySelector('#request-info');
        const responseInfoDiv = form.querySelector('#response-info');
        const debugRequestUrlDiv = form.querySelector('#debug-request-url');
        const debugRequestMethodDiv = form.querySelector('#debug-request-method');
        const debugRequestHeadersDiv = form.querySelector('#debug-request-headers');
        const debugRequestParamsDiv = form.querySelector('#debug-request-params');
        const debugResponseStatusDiv = form.querySelector('#debug-response-status');
        const debugResponseBodyDiv = form.querySelector('#debug-response-body');
        const debugTabs = form.querySelectorAll('.debug-tab');

        if (debugInfoDiv && requestInfoDiv && responseInfoDiv && debugRequestUrlDiv && debugRequestMethodDiv &&
            debugRequestHeadersDiv && debugRequestParamsDiv && debugResponseStatusDiv && debugResponseBodyDiv &&
            debugTabs.length > 0) {

            // 标签页切换功能
            debugTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // 移除所有标签页的激活状态
                    debugTabs.forEach(t => {
                        t.style.backgroundColor = '#e9ecef';
                        t.style.color = '#495057';
                    });

                    // 激活当前标签页
                    tab.style.backgroundColor = '#6c757d';
                    tab.style.color = 'white';

                    // 隐藏所有标签内容
                    requestInfoDiv.style.display = 'none';
                    responseInfoDiv.style.display = 'none';

                    // 显示当前标签内容
                    const tabType = tab.dataset.tab;
                    if (tabType === 'request') {
                        requestInfoDiv.style.display = 'block';
                    } else if (tabType === 'response') {
                        responseInfoDiv.style.display = 'block';
                    }
                });
            });

            // 调试按钮点击事件（需要在openConfigModal函数中添加）
            // 这里需要将事件处理逻辑暴露给外部，因为调试按钮在modal-footer中
            form.debugClickHandler = async () => {
                try {
                    // 获取当前配置
                    let apiUrl = form.querySelector('#config-api-content').value;
                    if (!apiUrl.trim()) {
                        alert('请先填写API URL');
                        return;
                    }

                    // 获取请求方法
                    const methodSelect = form.querySelector('#config-request-method');
                    const method = methodSelect ? methodSelect.value : 'GET';

                    // 获取请求头
                    const headers = {};
                    const originalHeaders = {};
                    form.querySelectorAll('.embed-web-header-item').forEach(item => {
                        const nameInput = item.querySelector('[data-field="name"]');
                        const valueInput = item.querySelector('[data-field="value"]');
                        if (nameInput.value.trim()) {
                            const name = nameInput.value.trim();
                            const rawValue = valueInput.value.trim();
                            originalHeaders[name] = rawValue;

                            try {
                                // 解析header value
                                const resolvedValue = resolveHeaderValue(rawValue);
                                headers[name] = resolvedValue;
                            } catch (e) {
                                console.error(`解析请求头失败: ${name} = ${rawValue}`, e);
                                headers[name] = rawValue; // 解析失败时使用原始值
                            }
                        }
                    });

                    // 显示调试信息区块
                    debugInfoDiv.style.display = 'block';

                    // 解析URL，获取查询参数
                    let params = {};
                    let paramsHtml = '无';

                    // 检查URL是否为JS表达式
                    const isJsExpression = apiUrl.trim().startsWith('return') ||
                                          (apiUrl.includes('=') && !apiUrl.match(/^https?:\/\//i));

                    // 初始化actualUrl变量，确保在使用前被定义
                    let actualUrl = apiUrl;
                    if (isJsExpression) {
                        // 如果是JS表达式，尝试执行获取实际URL
                        try {
                            actualUrl = safelyExecuteScript(apiUrl);
                        } catch (e) {
                            console.error('❌ 执行URL表达式失败:', e);
                            debugRequestParamsDiv.innerHTML = `<span style="color: #dc3545;">执行URL表达式失败: ${e.message}</span>`;
                            debugResponseStatusDiv.style.color = '#dc3545';
                            debugResponseStatusDiv.textContent = '请求失败';
                            debugResponseBodyDiv.textContent = `错误信息：执行URL表达式失败: ${e.message}`;
                            return;
                        }
                    }

                    // 填充请求信息
                    // URL显示：第一行实际URL，第二行原始URL
                    debugRequestUrlDiv.innerHTML = '';
                    const urlHtml = `<div>${actualUrl}</div><div style="color: #6c757d; font-size: 12px; margin-top: 2px;">原始配置: ${apiUrl}</div>`;
                    debugRequestUrlDiv.innerHTML = urlHtml;

                    debugRequestMethodDiv.textContent = method;

                    // 格式化请求头，显示两行：第一行实际发送的请求头，第二行原始配置的请求头
                    debugRequestHeadersDiv.innerHTML = '';
                    let headersHtml = '';

                    // 构建实际发送的请求头HTML
                    let actualHeadersHtml = '<div><strong>实际发送请求头：</strong></div><div style="margin-left: 10px; font-family: monospace;">';
                    Object.entries(headers).forEach(([name, value]) => {
                        actualHeadersHtml += `${name}: ${value}<br>`;
                    });
                    actualHeadersHtml += Object.keys(headers).length === 0 ? '无' : '';
                    actualHeadersHtml += '</div>';

                    // 构建原始配置的请求头HTML
                    let originalHeadersHtml = '<div style="color: #6c757d; font-size: 12px; margin-top: 5px;"><strong>原始配置请求头：</strong></div><div style="color: #6c757d; font-size: 12px; margin-left: 10px; font-family: monospace;">';
                    Object.entries(originalHeaders).forEach(([name, value]) => {
                        originalHeadersHtml += `${name}: ${value}<br>`;
                    });
                    originalHeadersHtml += Object.keys(originalHeaders).length === 0 ? '无' : '';
                    originalHeadersHtml += '</div>';

                    // 合并HTML
                    headersHtml = actualHeadersHtml + originalHeadersHtml;
                    debugRequestHeadersDiv.innerHTML = headersHtml;

                    // 解析查询参数
                    try {
                        const url = new URL(actualUrl);
                        params = {};
                        url.searchParams.forEach((value, key) => {
                            params[key] = value;
                        });

                        paramsHtml = Object.entries(params)
                            .map(([name, value]) => `${name}: ${value}`)
                            .join('<br>');
                    } catch (e) {
                        console.error('❌ 解析URL失败:', e);
                        paramsHtml = `<span style="color: #dc3545;">解析URL失败: ${e.message}</span>`;
                    }

                    debugRequestParamsDiv.innerHTML = paramsHtml;

                    // 发起API请求
                    try {
                        console.log('📤 发起API请求:', { url: actualUrl, method, headers });
                        const response = await fetch(actualUrl, {
                            method: method,
                            headers: {
                                ...headers,
                                'Content-Type': 'application/json'
                            }
                        });

                        // 解析响应
                        const statusText = `${response.status} ${response.statusText}`;

                        let responseBody;
                        const contentType = response.headers.get('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            responseBody = await response.json();
                        } else {
                            responseBody = await response.text();
                        }

                        // 设置响应状态
                        debugResponseStatusDiv.style.color = response.ok ? '#28a745' : '#dc3545';
                        debugResponseStatusDiv.textContent = `HTTP ${statusText}`;

                        // 设置响应体
                        debugResponseBodyDiv.textContent = '';
                        if (typeof responseBody === 'object') {
                            debugResponseBodyDiv.textContent = JSON.stringify(responseBody, null, 2);
                        } else {
                            debugResponseBodyDiv.textContent = responseBody;
                        }

                        console.log('📥 API请求成功:', { status: statusText, body: responseBody });

                    } catch (error) {
                        // 处理错误
                        debugResponseStatusDiv.style.color = '#dc3545';
                        debugResponseStatusDiv.textContent = '请求失败';
                        debugResponseBodyDiv.textContent = `错误信息：${error.message}`;
                        console.error('❌ API请求失败:', error);
                    }

                } catch (error) {
                    // 处理错误
                    debugInfoDiv.style.display = 'block';
                    debugResponseStatusDiv.style.color = '#dc3545';
                    debugResponseStatusDiv.textContent = '请求失败';
                    debugResponseBodyDiv.textContent = `错误信息：${error.message}`;
                    console.error('❌ API请求失败:', error);
                }
            };
        }

        // 表单提交
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = form.querySelector('#config-title').value;

            // 验证标题总字符数（最多20个字符）
            if (title.length > 20) {
                alert('插件标题最多只能包含20个字符！');
                return;
            }

            const type = form.querySelector('#config-type').value;

            // 根据类型获取对应的内容
            let content;
            let method = 'GET'; // 默认GET方法

            if (type === 'api') {
                content = form.querySelector('#config-api-content').value;
                const methodSelect = form.querySelector('#config-request-method');
                if (methodSelect) {
                    method = methodSelect.value;
                }
            } else {
                content = form.querySelector('#config-manual-content').value;
            }

            const headers = [];
            if (type === 'api') {
                form.querySelectorAll('.embed-web-header-item').forEach(item => {
                    const nameInput = item.querySelector('[data-field="name"]');
                    const valueInput = item.querySelector('[data-field="value"]');
                    if (nameInput.value.trim()) {
                        headers.push({
                            name: nameInput.value.trim(),
                            value: valueInput.value.trim()
                        });
                    }
                });
            }

            const configData = {
                title,
                sites: sitesInput.value,
                type,
                content,
                method,
                headers
            };

            if (onSubmit) onSubmit(configData);
        });

        return form;
    }

    // 打开配置模态框
    function openConfigModal(config = null, onSubmit) {
        // 预先生成localStorage树状数据和DOM元素
        const localStorageItems = getLocalStorageItems();
        let localStorageTreeNodes = [];

        // 直接生成所有localStorage item的DOM元素，作为根节点
        localStorageItems.forEach(item => {
            // 使用parsedValue生成节点，只有当isParsedObject为true时才会生成非叶子节点
            const node = generateTreeNodeHtml(item.key, item.parsedValue, [], true);
            localStorageTreeNodes.push(node);
        });

        // 存储到全局，供后续使用
        window._embedWebRunnerLocalStorageTreeNodes = localStorageTreeNodes;

        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'embed-web-modal visible';

        modal.innerHTML = `
            <div class="embed-web-modal-content">
                <div class="embed-web-modal-header">
                    <h3 class="embed-web-modal-title">${config ? '编辑插件' : '新增插件'}</h3>
                    <button class="embed-web-modal-close">&times;</button>
                </div>
                <div class="embed-web-modal-body" id="modal-body">
                    <!-- 表单将动态生成 -->
                </div>
                <div class="embed-web-modal-footer">
                    <!-- 右侧区域：原有操作按钮 -->
                    <div style="display: flex; gap: 10px; justify-content: flex-end; width: 100%;">
                        <button type="button" class="embed-web-btn embed-web-btn-secondary" id="modal-cancel">取消</button>
                        <button type="button" class="embed-web-btn" id="modal-debug" style="background-color: #4CAF50; color: white;">调试</button>
                        <button type="submit" form="config-form" class="embed-web-btn embed-web-btn-primary">保存</button>
                    </div>
                </div>
            </div>
        `;

        // 添加表单
        const modalBody = modal.querySelector('#modal-body');
        const form = createConfigForm(config, onSubmit);
        form.id = 'config-form';
        modalBody.appendChild(form);

        // 调试按钮点击事件
        const debugBtn = modal.querySelector('#modal-debug');
        if (debugBtn) {
            debugBtn.addEventListener('click', () => {
                // 调用表单的debugClickHandler方法
                if (typeof form.debugClickHandler === 'function') {
                    form.debugClickHandler();
                }
            });
        }

        // 关闭模态框
        const closeModal = () => {
            modal.classList.remove('visible');
            setTimeout(() => {
                modal.remove();
                // 清理全局变量
                delete window._embedWebRunnerLocalStorageTreeNodes;
            }, 300);
        };

        modal.querySelector('.embed-web-modal-close').addEventListener('click', closeModal);
        modal.querySelector('#modal-cancel').addEventListener('click', closeModal);

        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.body.appendChild(modal);
    }

    // 新增插件
    function addConfigHandler() {
        openConfigModal(null, (configData) => {
            addConfig(configData);
            renderConfigs();
            // 关闭模态框
            document.querySelector('.embed-web-modal').querySelector('.embed-web-modal-close').click();
        });
    }

    // 编辑配置
    function editConfig(id) {
        const configs = getConfigs();
        const config = configs.find(c => c.id === id);
        if (!config) return;

        // 添加调试日志，打印完整的config对象
        console.log('🔍 编辑配置 - 完整config对象:', JSON.stringify(config, null, 2));

        openConfigModal(config, (configData) => {
            updateConfig(id, configData);
            renderConfigs();
            // 关闭模态框
            document.querySelector('.embed-web-modal').querySelector('.embed-web-modal-close').click();
        });
    }

    // 安全执行JS表达式的辅助函数
    function safelyExecuteScript(script) {
        try {
            // 使用new Function()安全执行脚本，限制作用域
            const func = new Function(`return ${script}`);
            return func();
        } catch (error) {
            console.error('脚本执行错误:', error);
            throw error;
        }
    }

    // 解析header value，支持localStorage路径表达式和JavaScript表达式混合
    function resolveHeaderValue(value) {
        // 第一步：解析localStorage路径表达式，支持两种格式：${key.path.to.value} 和 {key.path.to.value}
        let resolvedValue = value;

        // 正则表达式匹配两种格式的localStorage路径表达式：${path} 和 {path}
        const pathRegex = /\$?\{([^}]+)\}/g;
        resolvedValue = resolvedValue.replace(pathRegex, (match, path) => {
            try {
                // 解析localStorage路径
                const resolvedPathValue = resolveLocalStoragePath(path);
                return resolvedPathValue !== null ? resolvedPathValue : match;
            } catch (e) {
                console.error(`解析localStorage路径失败: ${path}`, e);
                return match; // 解析失败时返回原表达式
            }
        });

        // 第二步：将处理后的value作为JavaScript表达式执行
        try {
            // 检查是否为JS表达式：
            // 1. 以return开头
            // 2. 包含=符号且不是URL
            // 3. 包含+符号（字符串拼接）且不是URL
            // 4. 不是纯字符串（不包含任何变量引用）
            const isJSExpression = resolvedValue.trim().startsWith('return') ||
                (resolvedValue.includes('=') && !resolvedValue.match(/^https?:\/\//i)) ||
                (resolvedValue.includes('+') && !resolvedValue.match(/^https?:\/\//i));

            if (isJSExpression) {
                // 执行JS表达式
                return safelyExecuteScript(resolvedValue);
            } else {
                // 不是JS表达式，直接返回
                return resolvedValue;
            }
        } catch (e) {
            console.error(`执行header表达式失败: ${resolvedValue}`, e);
            return resolvedValue; // 执行失败时返回处理后的字符串
        }
    }

    // 解析localStorage路径的辅助函数
    function resolveLocalStoragePath(pathStr) {
        console.log(`🔍 解析localStorage路径: ${pathStr}`);

        // 处理路径字符串，确保格式正确
        const cleanPathStr = pathStr.replace(/[{}]/g, ''); // 移除可能的大括号
        const path = cleanPathStr.split('.');
        console.log(`📋 路径分割结果: [${path.join(', ')}]`);

        if (path.length === 0) {
            console.error('❌ 路径为空');
            return null;
        }

        const localStorageKey = path[0];
        console.log(`📦 从localStorage获取数据 - Key: ${localStorageKey}`);

        let localStorageValue = localStorage.getItem(localStorageKey);
        if (!localStorageValue) {
            console.error('❌ localStorage中不存在该Key:', localStorageKey);
            return null;
        }

        console.log(`📥 获取到原始数据:`, localStorageValue);

        try {
            let parsed = localStorageValue;
            // 只有当路径长度大于1时，才尝试解析JSON（需要访问嵌套属性）
            if (path.length > 1) {
                try {
                    parsed = JSON.parse(localStorageValue);
                    console.log('✅ JSON解析成功，数据类型:', typeof parsed);
                } catch (parseError) {
                    console.error('❌ JSON解析失败:', parseError.message);
                    console.warn('⚠️  路径长度大于1，但数据不是JSON对象，无法访问嵌套属性');
                    return localStorageValue;
                }
            }

            // 如果路径只有一级，直接返回值
            if (path.length === 1) {
                console.log('🔑 单级路径，直接返回值:', parsed);
                return parsed;
            }

            // 递归获取嵌套数据
            let current = parsed;
            for (let i = 1; i < path.length; i++) {
                const key = path[i];
                console.log(`🔄 访问路径层级 ${i}: ${key}`);

                if (!current || typeof current !== 'object') {
                    console.error(`❌ 路径不存在: ${path.slice(0, i+1).join('.')}`);
                    console.error(`   当前数据:`, current);
                    return null;
                }

                if (!(key in current)) {
                    console.error(`❌ 键不存在: ${key}`);
                    return null;
                }

                current = current[key];
                console.log(`✅ 当前层级数据:`, current);
            }

            console.log('✅ 路径解析完成，返回结果:', current);
            return current;
        } catch (e) {
            console.error('❌ 路径解析失败:', e.message);
            console.error('   错误详情:', e);
            return localStorageValue;
        }
    }

    // 运行配置
    async function runConfig(id) {
        const configs = getConfigs();
        const config = configs.find(c => c.id === id);
        if (!config) return;

        let htmlContent = '';

        if (config.type === 'api') {
            // 处理API请求
            let apiUrl = config.content;

            // 统一处理URL，支持手动录入和JS表达式
            try {
                // 检查是否为JS表达式
                if (apiUrl.trim().startsWith('return') || (apiUrl.includes('=') && !apiUrl.match(/^https?:\/\//i))) {
                    // 执行JS表达式获取动态URL
                    apiUrl = safelyExecuteScript(apiUrl);
                }
            } catch (error) {
                htmlContent = `<h1>URL脚本执行失败</h1><p>${error.message}</p>`;
                createAndShowIframe(htmlContent);
                return;
            }

            // 处理API请求头
            const headers = {};
            for (const header of config.headers) {
                // 使用全局的resolveHeaderValue函数解析header值
                const resolvedValue = resolveHeaderValue(header.value);
                headers[header.name] = resolvedValue;
            }

            try {
                const response = await fetch(apiUrl, {
                    headers: {
                        ...headers,
                        'Content-Type': 'text/html'
                    }
                });
                htmlContent = await response.text();
            } catch (error) {
                htmlContent = `<h1>请求失败</h1><p>${error.message}</p>`;
            }
        } else {
            // 直接使用手动输入的HTML
            htmlContent = config.content;
        }

        // 创建并显示iframe的辅助函数
        function createAndShowIframe(content) {
            // 创建iframe容器
            const iframeContainer = document.createElement('div');
            iframeContainer.className = 'embed-web-iframe-container';
            iframeContainer.innerHTML = `
                <div class="embed-web-iframe-wrapper">
                    <button class="embed-web-iframe-close">&times;</button>
                    <iframe class="embed-web-iframe" id="embed-web-iframe" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
                </div>
            `;

            document.body.appendChild(iframeContainer);

            // 延迟显示，触发动画
            setTimeout(() => {
                iframeContainer.classList.add('visible');
            }, 10);

            // 设置iframe内容
            const iframe = iframeContainer.querySelector('#embed-web-iframe');
            // 确保iframe加载完成后设置内容
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open(), doc.write(content), doc.close();

            // 关闭按钮
            const closeBtn = iframeContainer.querySelector('.embed-web-iframe-close');
            closeBtn.addEventListener('click', () => {
                iframeContainer.classList.remove('visible');
                setTimeout(() => {
                    iframeContainer.remove();
                }, 300);
            });
        }

        // 显示iframe
        createAndShowIframe(htmlContent);
    }

    // 创建吸附块和配置面板
    function createUI() {
        // 创建吸附块容器
        const runnerContainer = document.createElement('div');
        runnerContainer.className = 'embed-web-runner';

        // 创建标题列
        const runnerTitle = document.createElement('div');
        runnerTitle.className = 'embed-web-runner-title';
        runnerTitle.textContent = '嵌入式网页运行';

        // 创建配置列表
        const configsPanel = document.createElement('div');
        configsPanel.className = 'embed-web-configs';
        configsPanel.innerHTML = `
            <div class="embed-web-configs-header">
                <h3 class="embed-web-configs-title">已安装插件</h3>
                <div style="display: flex; gap: 5px;">
                    <button class="embed-web-add-btn" id="add-config-btn" title="新增插件">+</button>
                    <button class="embed-web-export-btn" id="export-all-btn" title="导出所有插件">↓</button>
                    <button class="embed-web-add-btn" id="settings-btn" title="设置">⚙</button>
                </div>
            </div>
            <div class="embed-web-configs-list" style="min-height: 175px;">
                <!-- 配置项将动态生成 -->
            </div>
        `;

        // 将标题列和配置列表添加到吸附块容器 - 标题在前，配置列表在后
        runnerContainer.appendChild(runnerTitle);
        runnerContainer.appendChild(configsPanel);

        document.body.appendChild(runnerContainer);

        // 显示计时器ID
        let showTimer = null;
        let hideTimer = null;

        // 显示完整内容
        const showFullContent = () => {
            // 清除之前的计时器
            if (hideTimer) {
                clearTimeout(hideTimer);
                hideTimer = null;
            }

            runnerContainer.classList.add('expanded');
        };

        // 隐藏配置列表
        const hideConfigs = () => {
            runnerContainer.classList.remove('expanded');
        };

        // 延迟隐藏配置列表
        const delayHideConfigs = () => {
            hideTimer = setTimeout(() => {
                hideConfigs();
            }, 5000); // 5秒后隐藏
        };

        // 标题列点击事件 - 立即显示完整内容
        runnerTitle.addEventListener('click', () => {
            // 清除之前的计时器
            if (showTimer) {
                clearTimeout(showTimer);
                showTimer = null;
            }

            showFullContent();
        });

        // 标题列聚焦事件 - 立即显示完整内容
        runnerTitle.addEventListener('focus', () => {
            showFullContent();
        });

        // 标题列获得焦点的方式 - 添加tabindex
        runnerTitle.setAttribute('tabindex', '0');

        // 配置列表鼠标进入事件 - 清除隐藏计时器
        configsPanel.addEventListener('mouseenter', () => {
            if (hideTimer) {
                clearTimeout(hideTimer);
                hideTimer = null;
            }
        });

        // 配置列表鼠标离开事件 - 5秒后隐藏
        configsPanel.addEventListener('mouseleave', () => {
            delayHideConfigs();
        });

        // 整个吸附块鼠标离开事件 - 5秒后隐藏
        runnerContainer.addEventListener('mouseleave', () => {
            delayHideConfigs();
        });

        // 新增插件按钮
        const addConfigBtn = configsPanel.querySelector('#add-config-btn');
        addConfigBtn.addEventListener('click', addConfigHandler);

        // 导出所有按钮
        const exportAllBtn = configsPanel.querySelector('#export-all-btn');
        exportAllBtn.addEventListener('click', exportAllConfigs);

        // 设置按钮
        const settingsBtn = configsPanel.querySelector('#settings-btn');
        settingsBtn.addEventListener('click', showSettingsPage);

        // 初始渲染插件列表
        renderConfigs();
    }

    // 导入数据验证函数
    function validateImportData(data) {
        // 检查数据是否为数组
        if (!Array.isArray(data)) {
            console.error('导入数据必须是数组格式');
            return false;
        }

        // 检查数组是否为空
        if (data.length === 0) {
            console.error('导入数据不能为空');
            return false;
        }

        // 验证每个配置项
        for (let i = 0; i < data.length; i++) {
            const config = data[i];

            // 检查必填字段
            if (!config.title || typeof config.title !== 'string') {
                console.error(`第 ${i + 1} 个配置项缺少有效的 title 字段`);
                return false;
            }

            if (!config.type || !['api', 'manual'].includes(config.type)) {
                console.error(`第 ${i + 1} 个配置项 type 字段无效，必须是 'api' 或 'manual'`);
                return false;
            }

            if (config.type === 'api') {
                if (!config.content || typeof config.content !== 'string') {
                    console.error(`第 ${i + 1} 个API配置项缺少有效的 content 字段`);
                    return false;
                }

                if (!config.method || !['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].includes(config.method)) {
                    console.error(`第 ${i + 1} 个API配置项 method 字段无效`);
                    return false;
                }
            }

            if (config.type === 'manual') {
                if (!config.content || typeof config.content !== 'string') {
                    console.error(`第 ${i + 1} 个手动配置项缺少有效的 content 字段`);
                    return false;
                }
            }

            // 检查headers字段
            if (config.headers && !Array.isArray(config.headers)) {
                console.error(`第 ${i + 1} 个配置项 headers 字段必须是数组`);
                return false;
            }
        }

        return true;
    }

    // 安装导入的配置
    function installImportedConfigs(configs) {
        if (!Array.isArray(configs)) {
            console.error('安装配置失败：数据必须是数组');
            return;
        }

        const existingConfigs = getConfigs();

        // 为每个导入的配置生成新的id
        const newConfigs = configs.map(config => {
            return {
                ...config,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9) // 生成唯一id
            };
        });

        // 合并配置
        const updatedConfigs = [...existingConfigs, ...newConfigs];

        // 保存配置
        saveConfigs(updatedConfigs);

        // 更新插件列表
        renderConfigs();
    }

    // JSON文件下载功能
    function downloadJsonFile(data, filename) {
        // 创建Blob对象
        const blob = new Blob([data], { type: 'application/json' });

        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        // 触发下载
        document.body.appendChild(link);
        link.click();

        // 清理资源
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    }

    // 显示全屏设置页面
    function showSettingsPage() {
        // 创建全屏模态框
        const modal = document.createElement('div');
        modal.className = 'embed-web-settings-modal';
        modal.innerHTML = `
            <div class="embed-web-settings-modal-overlay"></div>
            <div class="embed-web-settings-modal-content">
                <div class="embed-web-settings-modal-header">
                    <h2>插件管理</h2>
                    <button class="embed-web-settings-close-btn">&times;</button>
                </div>
                <div class="embed-web-settings-modal-body">
                    <div class="embed-web-settings-table-container">
                        <table class="embed-web-settings-table">
                            <thead>
                                <tr>
                                    <th>标题</th>
                                    <th>适配网站</th>
                                    <th>类型</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody id="settings-table-body">
                                <!-- 表格内容将动态生成 -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            /* 全屏设置页面样式 */
            .embed-web-settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 20000;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .embed-web-settings-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
            }

            .embed-web-settings-modal-content {
                position: relative;
                background: white;
                border-radius: 8px;
                width: 95%;
                height: 95vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            }

            .embed-web-settings-modal-header {
                    padding: 15px 20px;
                    border-bottom: 1px solid #e0e0e0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgb(43 140 188 / 90%);
                    border-radius: 8px 8px 0 0;
                }

                .embed-web-settings-modal-header h2 {
                    color: white;
                }

            .embed-web-settings-modal-header h2 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }

            .embed-web-settings-close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: white;
                }

            .embed-web-settings-modal-body {
                padding: 20px;
                overflow: auto;
                flex: 1;
            }

            .embed-web-settings-table-container {
                overflow-x: auto;
            }

            .embed-web-settings-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
            }

            .embed-web-settings-table th,
            .embed-web-settings-table td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #e0e0e0;
            }

            .embed-web-settings-table th {
                background-color: #f8f9fa;
                font-weight: 600;
                white-space: nowrap;
            }

            .embed-web-settings-table tbody tr:hover {
                background-color: #f8f9fa;
            }

            .embed-web-settings-table-actions {
                display: flex;
                gap: 5px;
            }

            .embed-web-settings-table-btn {
                padding: 4px 8px;
                border: none;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 28px;
            }

            .embed-web-settings-edit-btn {
                background: #ffc107;
                color: #212529;
            }

            .embed-web-settings-delete-btn {
                background: #dc3545;
                color: white;
            }

            .embed-web-settings-export-btn {
                background: #007bff;
                color: white;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(modal);

        // 渲染表格内容
        renderSettingsTable(modal);

        // 关闭按钮事件
        const closeBtn = modal.querySelector('.embed-web-settings-close-btn');
        const overlay = modal.querySelector('.embed-web-settings-modal-overlay');

        const closeModal = () => {
            modal.remove();
            style.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        // ESC键关闭
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscKey);
            }
        };
        document.addEventListener('keydown', handleEscKey);
    }

    // 渲染设置表格内容
    function renderSettingsTable(modal) {
        const tableBody = modal.querySelector('#settings-table-body');
        const configs = getConfigs();

        tableBody.innerHTML = '';

        configs.forEach(config => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${config.title}</td>
                <td>${config.sites || '-'}</td>
                <td>${config.type === 'api' ? 'API请求' : '手动输入HTML'}</td>
                <td>
                    <div class="embed-web-settings-table-actions">
                        <button class="embed-web-settings-table-btn embed-web-settings-edit-btn" data-id="${config.id}" title="编辑">✏</button>
                        <button class="embed-web-settings-table-btn embed-web-settings-delete-btn" data-id="${config.id}" title="删除">✖</button>
                        <button class="embed-web-settings-table-btn embed-web-settings-export-btn" data-id="${config.id}" title="导出">↓</button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // 添加事件监听
        addSettingsTableListeners(modal);
    }

    // 添加设置表格事件监听
    function addSettingsTableListeners(modal) {
        // 编辑按钮
        modal.querySelectorAll('.embed-web-settings-edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                editConfig(id);
                modal.remove();
            });
        });

        // 删除按钮
        modal.querySelectorAll('.embed-web-settings-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                deleteConfig(id);
                renderConfigs();
                renderSettingsTable(modal);
            });
        });

        // 导出按钮
        modal.querySelectorAll('.embed-web-settings-export-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                exportSingleConfig(id);
            });
        });
    }

    // 初始化脚本
    function init() {
        // 检查是否已经初始化
        if (document.querySelector('.embed-web-runner')) {
            return;
        }

        // 创建UI
        createUI();
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();