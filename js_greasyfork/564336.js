// ==UserScript==
// @name         智能自动填表助手
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  鼠标悬停获取表单，自动保存并填充表单内容，现代化UI设计
// @author       yagizaMJ
// @license      yagizaMJ
// @match        *://*/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZmagnet:?xt=urn:btih:pZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjY3ZWVhO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNmagnet:?xt=urn:btih:vbG9yOiM3NjRiYTI7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cGF0aCBkPSJNOSAzVjRNMTIgM1Y0TTE1IDNWNE02IDdIMThDMTkuMTA0NiA3IDIwIDcuODk1NDMgMjAgOVYxOUMyMCAyMC4xMDQ2IDE5LjEwNDYgMjEgMTggMjFINkM0Ljg5NTQzIDIxIDQgMjAuMTA0NiA0IDE5VjlDNCA3Ljg5NTQzIDQuODk1NDMgNyA2IDdaIiBzdHJva2U9InVybCgjZ3JhZCkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJmagnet:?xt=urn:btih:vdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CiAgPHBhdGggZD0iTTggMTFIMTZNOCAxNUgxMyIgc3Ryb2tlPSJ1cmwoI2dyYWQpIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Rmagnet:?xt=urn:btih:yb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/564336/%E6%99%BA%E8%83%BD%E8%87%AA%E5%8A%A8%E5%A1%AB%E8%A1%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/564336/%E6%99%BA%E8%83%BD%E8%87%AA%E5%8A%A8%E5%A1%AB%E8%A1%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        /* 主面板样式 */
        #autoFillPanel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 420px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            z-index: 9999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            transition: all 0.3s ease;
            transform: translateX(440px);
            opacity: 0;
        }

        #autoFillPanel.show {
            transform: translateX(0);
            opacity: 1;
        }

        .panel-header {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 20px 20px 0 0;
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .panel-title {
            color: white;
            font-size: 20px;
            font-weight: 600;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .close-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .close-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: rotate(90deg);
        }

        .panel-content {
            background: white;
            padding: 20px;
            padding-bottom: 10px;
            border-radius: 0 0 20px 20px;
            max-height: 500px;
            overflow-y: auto;
            position: relative;
        }

        /* 悬浮按钮 */
        #floatingBtn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            cursor: pointer;
            z-index: 9999998;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            transition: all 0.3s ease;
            animation: fadeIn 0.5s ease;
        }

        #floatingBtn:hover {
            transform: scale(1.1);
            box-shadow: 0 15px 40px rgba(0,0,0,0.4);
        }

        #floatingBtn.hidden {
            display: none;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.5);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        /* 表单项样式 */
        .form-item {
            background: #f7f7fc;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 12px;
            border: 2px solid transparent;
            transition: all 0.3s ease;
            position: relative;
        }

        .form-item:hover {
            border-color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102,126,234,0.1);
        }

        .form-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .form-item-title {
            font-weight: 600;
            color: #2d3748;
            font-size: 14px;
        }

        .form-item-type {
            font-size: 12px;
            color: #667eea;
            background: rgba(102,126,234,0.1);
            padding: 2px 8px;
            border-radius: 12px;
        }

        .form-item input, .form-item textarea {
            width: 100%;
            padding: 10px 15px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }

        .form-item input:focus, .form-item textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }

        .delete-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #fc8181;
            color: white;
            border: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            opacity: 0;
            transition: all 0.3s ease;
        }

        .form-item:hover .delete-btn {
            opacity: 1;
        }

        .delete-btn:hover {
            background: #f56565;
            transform: scale(1.1);
        }

        /* 按钮样式 */
        .action-buttons {
            display: flex;
            gap: 8px;
            margin-top: 20px;
            position: sticky;
            bottom: 0;
            background: white;
            padding: 15px 0 5px 0;
            margin-left: -20px;
            margin-right: -20px;
            padding-left: 20px;
            padding-right: 20px;
            border-top: 1px solid #e2e8f0;
        }

        .btn {
            padding: 12px 16px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            flex: 1;
            white-space: nowrap;
            min-width: 0;
            text-align: center;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102,126,234,0.3);
        }

        .btn-secondary {
            background: #f7f7fc;
            color: #2d3748;
        }

        .btn-secondary:hover {
            background: #e2e8f0;
        }

        .btn-danger {
            background: #fc8181;
            color: white;
        }

        .btn-danger:hover {
            background: #f56565;
        }

        /* 提示样式 */
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #a0aec0;
        }

        .empty-state-icon {
            font-size: 48px;
            margin-bottom: 16px;
        }

        /* 高亮样式 */
        .highlight-element {
            outline: 3px solid #667eea !important;
            outline-offset: 2px !important;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { outline-color: #667eea; }
            50% { outline-color: #764ba2; }
            100% { outline-color: #667eea; }
        }

        /* 提示框样式 */
        .tooltip {
            position: absolute;
            background: #2d3748;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            pointer-events: none;
            z-index: 9999999;
            white-space: nowrap;
        }

        .tooltip::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 4px solid #2d3748;
        }

        /* 通知样式 */
        .notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #48bb78;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000000;
            animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
            from {
                transform: translateX(-50%) translateY(-100%);
            }
            to {
                transform: translateX(-50%) translateY(0);
            }
        }
    `);

    // 数据存储
    let captureMode = false;
    let formData = GM_getValue('formData', {});
    let floatingBtn = null;
    let panel = null;

    // 检查当前网站是否有数据
    function hasDataForCurrentSite() {
        const currentHost = window.location.hostname;
        return formData[currentHost] && Object.keys(formData[currentHost]).length > 0;
    }

    // 初始化UI
    function initUI() {
        // 创建主面板
        panel = document.createElement('div');
        panel.id = 'autoFillPanel';
        panel.innerHTML = `
            <div class="panel-header">
                <h2 class="panel-title">
                    <span>📝 智能填表助手</span>
                    <button class="close-btn">✕</button>
                </h2>
            </div>
            <div class="panel-content">
                <div id="formsList"></div>
                <div class="action-buttons">
                    <button class="btn btn-primary" id="startCapture">开始捕获</button>
                    <button class="btn btn-secondary" id="autoFill">自动填充</button>
                    <button class="btn btn-danger" id="clearAll">清空数据</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // 创建悬浮按钮
        floatingBtn = document.createElement('div');
        floatingBtn.id = 'floatingBtn';
        floatingBtn.innerHTML = '📋';
        floatingBtn.className = hasDataForCurrentSite() ? '' : 'hidden';
        document.body.appendChild(floatingBtn);

        // 绑定事件
        bindEvents();
    }

    // 绑定事件
    function bindEvents() {
        // 悬浮按钮点击
        floatingBtn.addEventListener('click', () => {
            panel.classList.toggle('show');
            updateFormsList();
        });

        // 关闭按钮
        panel.querySelector('.close-btn').addEventListener('click', () => {
            panel.classList.remove('show');
        });

        // 开始捕获
        document.getElementById('startCapture').addEventListener('click', () => {
            captureMode = !captureMode;
            document.getElementById('startCapture').textContent = captureMode ? '停止捕获' : '开始捕获';

            if (captureMode) {
                panel.classList.remove('show');
                startCapture();
            } else {
                stopCapture();
            }
        });

        // 自动填充
        document.getElementById('autoFill').addEventListener('click', autoFill);

        // 清空数据
        document.getElementById('clearAll').addEventListener('click', clearAllData);
    }

    // 更新表单列表
    function updateFormsList() {
        const formsList = document.getElementById('formsList');
        const currentHost = window.location.hostname;
        const currentData = formData[currentHost] || {};

        if (Object.keys(currentData).length === 0) {
            formsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    当前页面暂无保存的表单数据
                    <p style="font-size: 12px;">点击"开始捕获"来添加表单</p>
                </div>
            `;
        } else {
            formsList.innerHTML = Object.entries(currentData).map(([selector, data]) => `
                <div class="form-item" data-selector="${selector}">
                    <button class="delete-btn" title="删除此项">×</button>
                    <div class="form-item-header">
                        <span class="form-item-title">${data.label || selector}</span>
                        <span class="form-item-type">${data.type || 'text'}</span>
                    </div>
                    ${data.type === 'textarea' ?
                        `<textarea placeholder="输入内容...">${data.value || ''}</textarea>` :
                        `<input type="${data.type || 'text'}" placeholder="输入内容..." value="${data.value || ''}">`
                    }
                </div>
            `).join('');

            // 添加输入事件监听
            formsList.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('input', (e) => {
                    const selector = e.target.closest('.form-item').dataset.selector;
                    if (!formData[currentHost]) formData[currentHost] = {};
                    formData[currentHost][selector].value = e.target.value;
                    GM_setValue('formData', formData);
                });
            });

            // 添加删除按钮事件
            formsList.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const selector = e.target.closest('.form-item').dataset.selector;
                    delete formData[currentHost][selector];

                    // 如果没有数据了，隐藏悬浮球
                    if (Object.keys(formData[currentHost]).length === 0) {
                        delete formData[currentHost];
                        floatingBtn.classList.add('hidden');
                    }

                    GM_setValue('formData', formData);
                    updateFormsList();
                });
            });
        }
    }

    // 创建提示框
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    // 显示通知
    function showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, duration);
    }

    // 开始捕获
    function startCapture() {
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('click', handleClick, true);
        showNotification('捕获模式已开启，点击表单元素进行保存');
    }

    // 停止捕获
    function stopCapture() {
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('click', handleClick, true);
        document.querySelectorAll('.highlight-element').forEach(el => {
            el.classList.remove('highlight-element');
        });
        tooltip.style.display = 'none';
    }

    // 鼠标悬停处理
    function handleMouseOver(e) {
        if (!captureMode) return;

        const target = e.target;
        if (target.matches('input, textarea, select') && !target.closest('#autoFillPanel')) {
            // 移除之前的高亮
            document.querySelectorAll('.highlight-element').forEach(el => {
                el.classList.remove('highlight-element');
            });

            // 添加高亮
            target.classList.add('highlight-element');

            // 显示提示
            const rect = target.getBoundingClientRect();
            tooltip.textContent = '点击保存此表单';
            tooltip.style.display = 'block';
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        }
    }

    // 点击处理
    function handleClick(e) {
        if (!captureMode) return;

        const target = e.target;
        if (target.matches('input, textarea, select') && !target.closest('#autoFillPanel')) {
            e.preventDefault();
            e.stopPropagation();

            const selector = getUniqueSelector(target);
            const currentHost = window.location.hostname;

            if (!formData[currentHost]) formData[currentHost] = {};

            formData[currentHost][selector] = {
                type: target.type || 'text',
                label: target.placeholder || target.name || selector,
                value: target.value || ''
            };

            GM_setValue('formData', formData);

            // 显示悬浮球
            floatingBtn.classList.remove('hidden');

            // 停止捕获
            captureMode = false;
            stopCapture();
            document.getElementById('startCapture').textContent = '开始捕获';

            // 显示通知
            showNotification('✅ 表单已成功保存！');

            // 显示面板
            panel.classList.add('show');
            updateFormsList();
        }
    }

    // 获取唯一选择器
    function getUniqueSelector(element) {
        if (element.id) return `#${element.id}`;
        if (element.name) return `[name="${element.name}"]`;

        let selector = element.tagName.toLowerCase();
        if (element.className) {
            selector += `.${element.className.split(' ').filter(c => c).join('.')}`;
        }

        // 如果还不够唯一，添加索引
        const parent = element.parentElement;
        if (parent) {
            const siblings = parent.querySelectorAll(selector);
            if (siblings.length > 1) {
                const index = Array.from(siblings).indexOf(element);
                selector += `:nth-of-type(${index + 1})`;
            }
        }

        return selector;
    }

    // 自动填充
    function autoFill() {
        const currentHost = window.location.hostname;
        const currentData = formData[currentHost] || {};
        let filledCount = 0;

        Object.entries(currentData).forEach(([selector, data]) => {
            try {
                const element = document.querySelector(selector);
                if (element && data.value) {
                    element.value = data.value;
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));

                    // 高亮填充的元素
                    element.classList.add('highlight-element');
                    setTimeout(() => {
                        element.classList.remove('highlight-element');
                    }, 2000);

                    filledCount++;
                }
            } catch (e) {
                console.error('填充失败:', selector, e);
            }
        });

        panel.classList.remove('show');
        showNotification(`✅ 成功填充 ${filledCount} 个表单项`);
    }

    // 清空数据
    function clearAllData() {
        if (confirm('确定要清空当前网站的所有表单数据吗？')) {
            const currentHost = window.location.hostname;
            delete formData[currentHost];
            GM_setValue('formData', formData);
            updateFormsList();
            floatingBtn.classList.add('hidden');
            showNotification('已清空当前网站的表单数据');
        }
    }

    // 注册菜单命令
    GM_registerMenuCommand('📝 打开智能填表助手', () => {
        panel.classList.add('show');
        updateFormsList();
    });

    GM_registerMenuCommand('➕ 开始捕获表单', () => {
        if (!captureMode) {
            captureMode = true;
            document.getElementById('startCapture').textContent = '停止捕获';
            panel.classList.remove('show');
            startCapture();
        }
    });

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }
})();