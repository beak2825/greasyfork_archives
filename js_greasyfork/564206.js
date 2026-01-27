// ==UserScript==
// @name         网页元素隐藏器 - 智能规则保存
// @namespace    http://tampermonkey.net/
// @version      2026-01-27
// @description  允许选择并隐藏/删除网页元素，自动保存规则并在下次访问时应用
// @author       tony
// @license      MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/564206/%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%E9%9A%90%E8%97%8F%E5%99%A8%20-%20%E6%99%BA%E8%83%BD%E8%A7%84%E5%88%99%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/564206/%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%E9%9A%90%E8%97%8F%E5%99%A8%20-%20%E6%99%BA%E8%83%BD%E8%A7%84%E5%88%99%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        storageKey: 'element_hider_rules',
        highlightColor: '#ff0000',
        highlightBorder: '2px dashed #ff0000',
        modeIndicatorColor: '#4CAF50'
    };

    // 全局变量
    let isSelectionMode = false;
    let isMenuOpen = false;
    let isMenuHovered = false;
    let currentRules = [];
    let currentDomain = '';
    let overlay = null;
    let overlayInfo = null;

    // 初始化
    function init() {
        currentDomain = getRootDomain(window.location.hostname);
        loadRules();
        applyRules();
        createUI();
        createOverlay();
    }

    // 获取根域名
    function getRootDomain(hostname) {
        const parts = hostname.split('.');
        if (parts.length <= 2) return hostname;
        return parts.slice(-2).join('.');
    }

    // 格式化HTML
    function formatHTML(html) {
        let tab = '    ';
        let result = '';
        let indent = '';
        html.split(/>\s*</).forEach(function(element) {
            if (element.match(/^\/\w/)) {
                indent = indent.substring(tab.length);
            }
            result += indent + '<' + element + '>\r\n';
            if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith('input') && !element.startsWith('img') && !element.startsWith('br') && !element.startsWith('hr')) {
                indent += tab;
            }
        });
        return result.substring(1, result.length - 3);
    }

    // 创建HTML编辑器
    function openHTMLEditor(element) {
        const modal = document.createElement('div');
        modal.id = 'element-hider-editor-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 80%;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 2147483647;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-family: Arial, sans-serif;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 15px 20px;
            background: #f5f5f5;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        `;
        header.innerHTML = '<h3 style="margin:0;font-size:16px;">编辑元素 HTML</h3>';

        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = 'cursor:pointer;font-size:24px;color:#999;';
        closeBtn.onclick = () => modal.remove();
        header.appendChild(closeBtn);

        const body = document.createElement('div');
        body.style.cssText = 'flex: 1; padding: 20px; display: flex; flex-direction: column;';

        const textarea = document.createElement('textarea');
        textarea.style.cssText = `
            flex: 1;
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: monospace;
            font-size: 13px;
            line-height: 1.5;
            resize: none;
            outline: none;
            tab-size: 4;
        `;
        textarea.value = formatHTML(element.outerHTML);
        body.appendChild(textarea);

        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 15px 20px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        `;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '✅ 应用更改';
        saveBtn.style.cssText = `
            padding: 8px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        saveBtn.onclick = () => {
            try {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = textarea.value.trim();
                const newElement = tempDiv.firstElementChild;
                if (newElement) {
                    element.outerHTML = textarea.value.trim();
                    showNotification('HTML 已更新');
                    modal.remove();
                } else {
                    alert('无效的 HTML 代码');
                }
            } catch (e) {
                alert('应用更改失败: ' + e.message);
            }
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = `
            padding: 8px 20px;
            background: #eee;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        cancelBtn.onclick = () => modal.remove();

        footer.appendChild(cancelBtn);
        footer.appendChild(saveBtn);

        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);
        document.body.appendChild(modal);

        // 使编辑器可拖动
        makeDraggable(modal, header);
    }

    // 创建原位 HTML 编辑器
    function openInlineHTMLEditor(element) {
        // 移除旧的内联编辑器
        const oldEditor = document.getElementById('element-hider-inline-editor');
        if (oldEditor) oldEditor.remove();

        const rect = element.getBoundingClientRect();
        const editorContainer = document.createElement('div');
        editorContainer.id = 'element-hider-inline-editor';
        editorContainer.style.cssText = `
            position: absolute;
            top: ${rect.top + window.scrollY}px;
            left: ${rect.left + window.scrollX}px;
            width: ${Math.max(rect.width, 300)}px;
            height: ${Math.max(rect.height, 200)}px;
            background: white;
            border: 2px solid #2196F3;
            border-radius: 4px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 2147483647;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-family: Arial, sans-serif;
        `;

        const textarea = document.createElement('textarea');
        textarea.style.cssText = `
            flex: 1;
            width: 100%;
            padding: 8px;
            border: none;
            font-family: monospace;
            font-size: 13px;
            resize: none;
            outline: none;
            tab-size: 4;
        `;
        textarea.value = formatHTML(element.outerHTML);
        editorContainer.appendChild(textarea);

        const actions = document.createElement('div');
        actions.style.cssText = `
            padding: 5px 10px;
            background: #f0f0f0;
            border-top: 1px solid #ddd;
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        `;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '✅ 保存';
        saveBtn.style.cssText = 'padding: 4px 12px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';
        saveBtn.onclick = () => {
            try {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = textarea.value.trim();
                if (tempDiv.firstElementChild) {
                    element.outerHTML = textarea.value.trim();
                    showNotification('HTML 已更新');
                    editorContainer.remove();
                } else {
                    alert('无效的 HTML 代码');
                }
            } catch (e) {
                alert('应用更改失败: ' + e.message);
            }
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = 'padding: 4px 12px; background: #ccc; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';
        cancelBtn.onclick = () => editorContainer.remove();

        actions.appendChild(cancelBtn);
        actions.appendChild(saveBtn);
        editorContainer.appendChild(actions);
        document.body.appendChild(editorContainer);

        // 自动聚焦并滚动到编辑区
        textarea.focus();
        editorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 生成元素选择器
    function generateSelector(element) {
        if (element.id) {
            return `#${CSS.escape(element.id)}`;
        }

        let path = [];
        while (element && element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.nodeName.toLowerCase();

            if (element.className && typeof element.className === 'string') {
                const classes = element.className.split(/\s+/).filter(c => c.length);
                if (classes.length) {
                    selector += '.' + classes.map(c => CSS.escape(c)).join('.');
                }
            }

            // 添加位置索引
            let sibling = element;
            let siblingIndex = 1;
            while (sibling.previousElementSibling) {
                sibling = sibling.previousElementSibling;
                siblingIndex++;
            }
            selector += `:nth-child(${siblingIndex})`;

            path.unshift(selector);
            element = element.parentElement;
        }

        return path.join(' > ');
    }

    // 应用元素规则
    function applyElementRule(rule) {
        try {
            const elements = document.querySelectorAll(rule.selector);
            elements.forEach(element => {
                if (rule.action === 'hide') {
                    element.style.display = 'none';
                    element.setAttribute('data-element-hider-hidden', 'true');
                } else if (rule.action === 'remove') {
                    element.remove();
                }
            });
            return elements.length;
        } catch (error) {
            console.error('应用规则失败:', rule, error);
            return 0;
        }
    }

    // 加载规则
    function loadRules() {
        const allRules = GM_getValue(CONFIG.storageKey, {});
        currentRules = allRules[currentDomain] || [];
    }

    // 保存规则
    function saveRules() {
        const allRules = GM_getValue(CONFIG.storageKey, {});
        allRules[currentDomain] = currentRules;
        GM_setValue(CONFIG.storageKey, allRules);
    }

    // 应用所有规则
    function applyRules() {
        let totalHidden = 0;
        currentRules.forEach(rule => {
            totalHidden += applyElementRule(rule);
        });

        if (totalHidden > 0) {
            showNotification(`已隐藏/删除 ${totalHidden} 个元素`);
        }
    }

    // 添加新规则
    function addRule(selector, action) {
        // 检查是否已存在相同规则
        const exists = currentRules.some(rule =>
            rule.selector === selector && rule.action === action
        );

        if (!exists) {
            currentRules.push({
                selector,
                action,
                date: new Date().toISOString()
            });
            saveRules();
            applyElementRule({ selector, action });

            // 立即更新面板中的规则列表
            const rulesList = document.getElementById('rules-list');
            if (rulesList) updateRulesList(rulesList);

            return true;
        }
        return false;
    }

    // 删除规则
    function deleteRule(domain, index) {
        const allRules = GM_getValue(CONFIG.storageKey, {});
        if (allRules[domain]) {
            allRules[domain].splice(index, 1);
            // 如果该域名没有规则了，删除域名键
            if (allRules[domain].length === 0) {
                delete allRules[domain];
            }
            GM_setValue(CONFIG.storageKey, allRules);

            // 更新当前内存中的规则（如果是当前域名）
            if (domain === currentDomain) {
                currentRules = allRules[domain] || [];
                // 如果是当前域名，需要刷新页面来恢复元素显示
                if (confirm('规则已删除。是否立即刷新页面以恢复元素显示？')) {
                    location.reload();
                } else {
                    // 如果不刷新，只更新UI
                    const rulesList = document.getElementById('rules-list');
                    if (rulesList) updateRulesList(rulesList);
                }
            } else {
                // 非当前域名，只更新UI
                const rulesList = document.getElementById('rules-list');
                if (rulesList) updateRulesList(rulesList);
            }
        }
    }

    // 清除当前域名的所有规则
    function clearRules() {
        currentRules = [];
        saveRules();
        location.reload();
    }

    // 显示通知
    function showNotification(message, duration = 2000) {
        const notification = document.createElement('div');
        notification.className = 'element-hider-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, duration);
    }

    // 使元素可拖动
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;
        handle.style.cursor = 'move';

        function dragMouseDown(e) {
            e = e || window.event;
            // 只有左键点击才触发拖拽
            if (e.button !== 0) return;

            e.preventDefault();

            // 核心修复：在点击的一瞬间，获取元素当前的绝对像素位置
            // 这样可以解决 top: 50% 和 transform 导致的初始拖拽跳动问题
            const rect = element.getBoundingClientRect();
            element.style.top = rect.top + "px";
            element.style.left = rect.left + "px";
            element.style.transform = 'none'; // 移除 transform
            element.style.right = 'auto';     // 移除 right: 20px 等定位
            element.style.bottom = 'auto';    // 移除 bottom 定位
            element.style.margin = '0';       // 移除 margin 干扰

            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算位移
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置新位置
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 创建UI
    function createUI() {
        // 创建控制面板
        const panel = document.createElement('div');
        panel.id = 'element-hider-panel';
        panel.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 2147483647;
            min-width: 300px;
            max-width: 400px;
            font-family: Arial, sans-serif;
            display: none;
            overflow: hidden;
        `;

        // 内部容器
        const content = document.createElement('div');
        content.style.padding = '20px';

        // 面板标题 (拖动句柄)
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            padding: 10px 20px;
            background: #f5f5f5;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        `;

        const title = document.createElement('h3');
        title.textContent = '元素隐藏器';
        title.style.cssText = 'margin: 0; color: #333; font-size: 16px;';

        // 最小化/关闭按钮区
        const controls = document.createElement('div');

        const closeIcon = document.createElement('span');
        closeIcon.innerHTML = '&times;';
        closeIcon.style.cssText = `
            font-size: 20px;
            cursor: pointer;
            color: #666;
            margin-left: 10px;
        `;
        closeIcon.onclick = () => panel.style.display = 'none';

        controls.appendChild(closeIcon);
        titleBar.appendChild(title);
        titleBar.appendChild(controls);
        panel.appendChild(titleBar);
        panel.appendChild(content);

        // 应用拖动功能
        makeDraggable(panel, titleBar);

        // 模式切换按钮
        const modeBtn = document.createElement('button');
        modeBtn.textContent = '🔍 进入选择模式';
        modeBtn.style.cssText = `
            background: ${CONFIG.modeIndicatorColor};
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-bottom: 15px;
            width: 100%;
        `;
        modeBtn.addEventListener('click', toggleSelectionMode);
        content.appendChild(modeBtn);

        // 当前规则列表
        const rulesTitle = document.createElement('h4');
        rulesTitle.textContent = '已保存的规则';
        rulesTitle.style.marginBottom = '10px';
        rulesTitle.style.marginTop = '0';
        content.appendChild(rulesTitle);

        const rulesList = document.createElement('div');
        rulesList.id = 'rules-list';
        rulesList.style.cssText = `
            max-height: 300px;
            overflow-y: auto;
            margin-bottom: 15px;
            border: 1px solid #eee;
            padding: 10px;
            border-radius: 4px;
        `;
        updateRulesList(rulesList);
        content.appendChild(rulesList);

        // 清除按钮
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '🗑️ 清除所有规则';
        clearBtn.style.cssText = `
            background: #f44336;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            width: 100%;
        `;
        clearBtn.addEventListener('click', () => {
            if (confirm('确定要清除所有网站的规则吗？')) {
                // 清除所有规则
                GM_setValue(CONFIG.storageKey, {});
                location.reload();
            }
        });
        content.appendChild(clearBtn);

        document.body.appendChild(panel);

        // 创建悬浮按钮
        const floatBtn = document.createElement('button');
        floatBtn.id = 'element-hider-float-btn';
        floatBtn.textContent = '🎯';
        floatBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: ${CONFIG.modeIndicatorColor};
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            z-index: 2147483647;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        floatBtn.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });
        document.body.appendChild(floatBtn);
    }

    // 创建覆盖层
    function createOverlay() {
        overlay = document.createElement('div');
        overlay.id = 'element-hider-overlay';
        overlay.style.cssText = `
            position: fixed;
            pointer-events: none;
            background: rgba(76, 175, 80, 0.3);
            border: 1px solid #4CAF50;
            z-index: 999998;
            display: none;
            transition: all 0.1s ease;
            box-sizing: border-box;
        `;

        overlayInfo = document.createElement('div');
        overlayInfo.style.cssText = `
            position: absolute;
            top: -24px;
            left: 0;
            background: #333;
            color: white;
            padding: 2px 6px;
            font-size: 12px;
            border-radius: 3px;
            white-space: nowrap;
            pointer-events: none;
            font-family: monospace;
            z-index: 999999;
        `;

        overlay.appendChild(overlayInfo);
        document.body.appendChild(overlay);
    }

    // 更新覆盖层位置
    function updateOverlay(element) {
        if (!element || !overlay) return;

        const rect = element.getBoundingClientRect();

        overlay.style.display = 'block';
        overlay.style.top = rect.top + 'px';
        overlay.style.left = rect.left + 'px';
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';

        // 移除标签路径显示，只保留高亮框
        overlayInfo.textContent = '';
        overlayInfo.style.display = 'none';
    }

    // 更新规则列表显示
    function updateRulesList(container) {
        container.innerHTML = '';

        const allRules = GM_getValue(CONFIG.storageKey, {});
        const domains = Object.keys(allRules).sort();

        if (domains.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.textContent = '暂无规则';
            emptyMsg.style.color = '#999';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.padding = '20px';
            container.appendChild(emptyMsg);
            return;
        }

        domains.forEach(domain => {
            const domainRules = allRules[domain];
            if (!domainRules || domainRules.length === 0) return;

            const domainGroup = document.createElement('div');
            domainGroup.style.marginBottom = '8px';
            domainGroup.style.border = '1px solid #eee';
            domainGroup.style.borderRadius = '6px';
            domainGroup.style.overflow = 'hidden';

            // 域名标题栏 (折叠开关)
            const domainHeader = document.createElement('div');
            const isCurrent = domain === currentDomain;
            domainHeader.style.cssText = `
                padding: 10px 12px;
                background: ${isCurrent ? '#f0f7ff' : '#fcfcfc'};
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
                transition: background 0.2s;
                border-bottom: 1px solid ${isCurrent ? '#e0eeff' : '#eee'};
            `;

            const titleLeft = document.createElement('div');
            titleLeft.style.display = 'flex';
            titleLeft.style.alignComponents = 'center';
            titleLeft.style.gap = '8px';

            // 状态箭头
            const arrow = document.createElement('span');
            arrow.innerHTML = '▶';
            arrow.style.cssText = `
                display: inline-block;
                transition: transform 0.3s;
                font-size: 10px;
                color: ${isCurrent ? '#2196F3' : '#999'};
            `;

            const domainName = document.createElement('span');
            domainName.textContent = domain;
            domainName.style.fontWeight = 'bold';
            domainName.style.fontSize = '13px';
            domainName.style.color = isCurrent ? '#2196F3' : '#444';

            if (isCurrent) {
                const badge = document.createElement('span');
                badge.textContent = '当前';
                badge.style.cssText = 'font-size: 10px; background: #2196F3; color: white; padding: 1px 4px; border-radius: 3px; margin-left: 5px;';
                domainName.appendChild(badge);
            }

            titleLeft.appendChild(arrow);
            titleLeft.appendChild(domainName);

            const count = document.createElement('span');
            count.textContent = `${domainRules.length} 条`;
            count.style.cssText = 'font-size: 11px; color: #999;';

            domainHeader.appendChild(titleLeft);
            domainHeader.appendChild(count);

            // 规则内容区域
            const rulesContainer = document.createElement('div');
            rulesContainer.style.cssText = `
                display: none;
                padding: 5px;
                background: white;
            `;

            // 折叠逻辑实现
            let isOpen = false;
            const toggle = (forceOpen = false) => {
                isOpen = forceOpen || !isOpen;
                rulesContainer.style.display = isOpen ? 'block' : 'none';
                arrow.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
                domainHeader.style.background = isOpen ? (isCurrent ? '#e6f2ff' : '#f5f5f5') : (isCurrent ? '#f0f7ff' : '#fcfcfc');
            };

            domainHeader.onclick = () => toggle();
            domainHeader.onmouseenter = () => { if(!isOpen) domainHeader.style.background = isCurrent ? '#e6f2ff' : '#f5f5f5'; };
            domainHeader.onmouseleave = () => { if(!isOpen) domainHeader.style.background = isCurrent ? '#f0f7ff' : '#fcfcfc'; };

            // 规则项
            domainRules.forEach((rule, index) => {
                const ruleItem = document.createElement('div');
                ruleItem.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 10px;
                    margin: 4px;
                    background: #f8f9fa;
                    border-radius: 4px;
                    font-size: 12px;
                    border: 1px solid transparent;
                    transition: all 0.2s;
                `;
                ruleItem.onmouseenter = () => { ruleItem.style.borderColor = '#ddd'; ruleItem.style.background = '#fff'; };
                ruleItem.onmouseleave = () => { ruleItem.style.borderColor = 'transparent'; ruleItem.style.background = '#f8f9fa'; };

                const ruleText = document.createElement('div');
                ruleText.style.cssText = 'overflow: hidden; white-space: nowrap; text-overflow: ellipsis; flex: 1; margin-right: 10px; color: #666;';
                ruleText.title = rule.selector;
                ruleText.innerHTML = `<span style="color: ${rule.action === 'hide' ? '#4CAF50' : '#f44336'}; font-weight: bold;">[${rule.action === 'hide' ? '隐藏' : '删除'}]</span> ${rule.selector}`;

                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '&times;';
                deleteBtn.title = '删除规则';
                deleteBtn.style.cssText = `
                    background: none;
                    border: none;
                    color: #ccc;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0 5px;
                    line-height: 1;
                    transition: color 0.2s;
                `;
                deleteBtn.onmouseenter = () => deleteBtn.style.color = '#f44336';
                deleteBtn.onmouseleave = () => deleteBtn.style.color = '#ccc';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (confirm('确定要删除这条规则吗？')) {
                        deleteRule(domain, index);
                    }
                };

                ruleItem.appendChild(ruleText);
                ruleItem.appendChild(deleteBtn);
                rulesContainer.appendChild(ruleItem);
            });

            // 默认展开当前网站
            if (isCurrent) {
                toggle(true);
            }

            domainGroup.appendChild(domainHeader);
            domainGroup.appendChild(rulesContainer);
            container.appendChild(domainGroup);
        });
    }

    // 切换选择模式
    function toggleSelectionMode() {
        isSelectionMode = !isSelectionMode;
        const modeBtn = document.querySelector('#element-hider-panel button');
        const floatBtn = document.getElementById('element-hider-float-btn');

        if (isSelectionMode) {
            modeBtn.textContent = '🚫 退出选择模式';
            modeBtn.style.background = '#f44336';
            floatBtn.style.background = '#f44336';
            floatBtn.textContent = '🎯';

            document.addEventListener('mouseover', handleMouseOver);
            document.addEventListener('click', handleClick, true);
            document.addEventListener('contextmenu', handleContextMenu, true);
            document.body.style.cursor = 'crosshair';

            showNotification('选择模式已开启 - 左键显示菜单，右键直接删除');
        } else {
            isMenuOpen = false;
            isMenuHovered = false;
            const oldMenu = document.querySelector('.element-hider-menu');
            if (oldMenu) oldMenu.remove();

            modeBtn.textContent = '🔍 进入选择模式';
            modeBtn.style.background = CONFIG.modeIndicatorColor;
            floatBtn.style.background = CONFIG.modeIndicatorColor;
            floatBtn.textContent = '🎯';

            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('click', handleClick, true);
            document.removeEventListener('contextmenu', handleContextMenu, true);
            document.body.style.cursor = '';

            if (overlay) overlay.style.display = 'none';

            showNotification('选择模式已关闭');
        }
    }

    // 处理右键点击
    function handleContextMenu(e) {
        if (!isSelectionMode) return;

        // 忽略UI元素
        if (e.target.closest('#element-hider-panel') ||
            e.target.closest('#element-hider-float-btn') ||
            e.target.closest('.element-hider-menu') ||
            e.target.closest('.element-hider-notification') ||
            e.target.closest('#element-hider-editor-modal') ||
            e.target.closest('#element-hider-inline-editor')) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const selector = generateSelector(e.target);
        if (addRule(selector, 'remove')) {
            showNotification('元素已通过右键删除');
        }
    }

    // 处理鼠标悬停
    function handleMouseOver(e) {
        // 如果鼠标在菜单上，不更新
        if (isMenuHovered) return;

        // 忽略UI元素
        if (e.target.closest('#element-hider-panel') ||
            e.target.closest('#element-hider-float-btn') ||
            e.target.closest('.element-hider-menu') ||
            e.target.closest('.element-hider-notification') ||
            e.target.closest('#element-hider-editor-modal') ||
            e.target.closest('#element-hider-inline-editor') ||
            e.target.id === 'element-hider-overlay') {
            return;
        }

        updateOverlay(e.target);

        // 如果菜单已经打开，让它跟随鼠标更新
        if (isMenuOpen) {
            showMenu(e.target, e.clientX, e.clientY);
        }

        e.stopPropagation();
    }

    // 显示操作菜单
    function showMenu(targetElement, x, y) {
        isMenuOpen = true;
        const selector = generateSelector(targetElement);

        let menu = document.querySelector('.element-hider-menu');
        if (!menu) {
            menu = document.createElement('div');
            menu.className = 'element-hider-menu';
            document.body.appendChild(menu);
        }

        menu.style.cssText = `
            position: fixed;
            left: ${x - 20}px;
            top: ${y - 20}px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 2147483647;
            width: 200px;
            max-width: 250px;
            font-family: Arial, sans-serif;
            font-size: 13px;
            overflow: hidden;
            pointer-events: auto;
        `;

        // 清空旧内容
        menu.innerHTML = '';

        // 鼠标悬停逻辑
        menu.onmouseenter = () => { isMenuHovered = true; };
        menu.onmouseleave = () => { isMenuHovered = false; };

        // 辅助函数：创建菜单项
        const createMenuItem = (text, onClick, color = '#333') => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.cssText = `
                display: block;
                width: 100%;
                padding: 8px 12px;
                border: none;
                background: none;
                text-align: left;
                cursor: pointer;
                color: ${color};
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            `;
            btn.addEventListener('mouseover', () => btn.style.background = '#f5f5f5');
            btn.addEventListener('mouseout', () => btn.style.background = 'none');
            btn.addEventListener('click', (event) => {
                event.stopPropagation();
                onClick();
            });
            return btn;
        };

        const closeMenu = () => {
            isMenuOpen = false;
            isMenuHovered = false;
            menu.remove();
        };

        // 标题（显示选择器）
        const title = document.createElement('div');
        title.style.cssText = `
            padding: 8px 12px;
            background: #f9f9f9;
            border-bottom: 1px solid #eee;
            font-weight: bold;
            color: #666;
            font-size: 11px;
            word-break: break-all;
        `;
        title.textContent = selector;
        menu.appendChild(title);

        // 隐藏按钮
        menu.appendChild(createMenuItem('👁️ 隐藏元素', () => {
            if (addRule(selector, 'hide')) {
                showNotification('元素已隐藏');
            }
            closeMenu();
        }));

        // 删除按钮
        menu.appendChild(createMenuItem('🗑️ 删除元素', () => {
            if (addRule(selector, 'remove')) {
                showNotification('元素已删除');
            }
            closeMenu();
        }, '#f44336'));

        // 编辑 HTML 按钮 (原位编辑)
        menu.appendChild(createMenuItem('🎯 原位编辑 HTML', () => {
            closeMenu();
            openInlineHTMLEditor(targetElement);
        }, '#2196F3'));

        // 编辑 HTML 按钮 (弹窗编辑)
        menu.appendChild(createMenuItem('📝 弹窗编辑 HTML', () => {
            closeMenu();
            openHTMLEditor(targetElement);
        }, '#FF9800'));

        // 选择父级按钮
        if (targetElement.parentElement && targetElement.parentElement !== document.body) {
            menu.appendChild(createMenuItem('⬆️ 选择父级元素', () => {
                // 更新Overlay
                updateOverlay(targetElement.parentElement);
                // 递归更新菜单，但锁定位置在当前
                showMenu(targetElement.parentElement, x, y);
            }, '#2196F3'));
        }

        // 取消按钮
        const cancelBtn = createMenuItem('❌ 取消', () => {
            closeMenu();
        });
        cancelBtn.style.borderTop = '1px solid #eee';
        menu.appendChild(cancelBtn);

        // 确保菜单不超出屏幕
        const menuRect = menu.getBoundingClientRect();
        if (x + menuRect.width - 20 > window.innerWidth) {
            menu.style.left = (window.innerWidth - menuRect.width - 10) + 'px';
        }
        if (y + menuRect.height - 20 > window.innerHeight) {
            menu.style.top = (window.innerHeight - menuRect.height - 10) + 'px';
        }
        if (parseInt(menu.style.left) < 0) menu.style.left = '10px';
        if (parseInt(menu.style.top) < 0) menu.style.top = '10px';
    }

    // 处理点击
    function handleClick(e) {
        // 移除旧菜单并重置状态
        const oldMenu = document.querySelector('.element-hider-menu');
        if (oldMenu) {
            // 如果点击的是菜单内部，由菜单内部的点击事件处理
            if (e.target.closest('.element-hider-menu')) {
                return;
            }
            oldMenu.remove();
            isMenuOpen = false;
            isMenuHovered = false;
        }

        // 忽略UI元素
        if (e.target.closest('#element-hider-panel') ||
            e.target.closest('#element-hider-float-btn') ||
            e.target.closest('.element-hider-notification') ||
            e.target.closest('#element-hider-editor-modal') ||
            e.target.closest('#element-hider-inline-editor')) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        showMenu(e.target, e.clientX, e.clientY);
    }

    // 启动
    setTimeout(init, 1000); // 等待页面完全加载

})();