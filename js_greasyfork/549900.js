// ==UserScript==
// @name         超星粘贴助手
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  绕过粘贴检测，支持代码题(CodeMirror)和作业题(UEditor)
// @author       muqy1818
// @match        *://*.chaoxing.com/*
// @match        *://*.cx.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @homepage     https://github.com/muqy1818/ChaoXing_Code
// @supportURL   https://github.com/muqy1818/ChaoXing_Code/issues
// @downloadURL https://update.greasyfork.org/scripts/549900/%E8%B6%85%E6%98%9F%E7%B2%98%E8%B4%B4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/549900/%E8%B6%85%E6%98%9F%E7%B2%98%E8%B4%B4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let pasteHelper = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let isInitialized = false; // 初始化状态标记

    // 等待页面加载完成，返回是否检测到编辑器
    function waitForEditors() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 20; // 最多等待10秒

            const checkForEditors = () => {
                attempts++;

                // 减少日志输出频率，避免卡顿
                if (attempts % 5 === 0) {
                    console.log(`[粘贴助手] 第${attempts}次检测编辑器...`);
                }

                let hasEditor = false;

                // 检查 CodeMirror 编辑器
                if (typeof window.codeEditors !== 'undefined' && window.codeEditors) {
                    const editorKeys = Object.keys(window.codeEditors);
                    if (editorKeys.length > 0) {
                        console.log('[粘贴助手] 检测到CodeMirror编辑器:', editorKeys.length, '个');
                        hasEditor = true;
                    }
                }

                // 检查 UEditor 编辑器
                if (typeof window.UE !== 'undefined' && window.UE.instants) {
                    const ueKeys = Object.keys(window.UE.instants);
                    let validCount = 0;
                    ueKeys.forEach(key => {
                        const editor = window.UE.instants[key];
                        if (editor && editor.ready) {
                            // 检查编辑器是否可见
                            // 必须有容器，且容器有尺寸
                            if (!editor.container || (editor.container.offsetWidth === 0 && editor.container.offsetHeight === 0)) {
                                return;
                            }
                            validCount++;
                        }
                    });
                    if (validCount > 0) {
                        console.log('[粘贴助手] 检测到UEditor编辑器:', validCount, '个');
                        hasEditor = true;
                    }
                }

                // 注意: 不检测textarea，因为超星的答题框都是UEditor接管的
                // textarea只是占位元素，会被UEditor初始化为富文本编辑器

                if (hasEditor) {
                    resolve(true);
                    return;
                }

                if (attempts >= maxAttempts) {
                    console.log('[粘贴助手] 检测超时，未找到编辑器');
                    resolve(false);
                    return;
                }

                setTimeout(checkForEditors, 500);
            };

            // 延迟启动，避免阻塞页面加载
            setTimeout(checkForEditors, 1000);
        });
    }

    // 创建样式
    function createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .paste-helper-container {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                background: #ffffff;
                border: 2px solid #4CAF50;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 14px;
            }
            .paste-helper-header {
                background: #4CAF50;
                color: white;
                padding: 10px 15px;
                cursor: move;
                user-select: none;
                border-radius: 6px 6px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .paste-helper-title {
                font-weight: bold;
            }
            .paste-helper-minimize {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .paste-helper-minimize:hover {
                background: rgba(255,255,255,0.2);
                border-radius: 3px;
            }
            .paste-helper-content {
                padding: 15px;
                display: block;
            }
            .paste-helper-content.collapsed {
                display: none;
            }
            .paste-helper-textarea {
                width: 100%;
                height: 150px;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                resize: vertical;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 12px;
                box-sizing: border-box;
            }
            .paste-helper-controls {
                margin-top: 10px;
                display: flex;
                gap: 10px;
                align-items: center;
            }
            .paste-helper-select {
                padding: 5px 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: white;
            }
            .paste-helper-button {
                padding: 8px 15px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
            }
            .paste-helper-button.primary {
                background: #4CAF50;
                color: white;
            }
            .paste-helper-button.secondary {
                background: #f44336;
                color: white;
            }
            .paste-helper-button:hover {
                opacity: 0.9;
            }
            .paste-helper-status {
                margin-top: 8px;
                padding: 5px;
                font-size: 11px;
                color: #666;
                background: #f5f5f5;
                border-radius: 3px;
            }
            .paste-helper-info {
                margin-bottom: 10px;
                font-size: 12px;
                color: #666;
            }
        `;
        document.head.appendChild(style);
    }

    // 创建主界面
    function createPasteHelper() {
        const container = document.createElement('div');
        container.className = 'paste-helper-container';

        // 从localStorage恢复位置
        const savedPosition = localStorage.getItem('paste-helper-position');
        if (savedPosition) {
            const pos = JSON.parse(savedPosition);
            container.style.top = pos.top + 'px';
            container.style.right = pos.right + 'px';
        }

        container.innerHTML = `
            <div class="paste-helper-header">
                <span class="paste-helper-title">超星粘贴助手</span>
                <button class="paste-helper-minimize" title="最小化">−</button>
            </div>
            <div class="paste-helper-content">
                <div class="paste-helper-info">
                    检测到编辑器: <span id="editor-count">0</span> 个
                </div>
                <textarea class="paste-helper-textarea" placeholder="在此输入要粘贴的内容(代码/作业答案等)..."></textarea>
                <div class="paste-helper-controls">
                    <label>选择编辑器:</label>
                    <select class="paste-helper-select">
                        <option value="">请选择编辑器</option>
                    </select>
                    <button class="paste-helper-button primary">粘贴</button>
                    <button class="paste-helper-button secondary">清空</button>
                </div>
                <div class="paste-helper-status">就绪</div>
            </div>
        `;

        document.body.appendChild(container);
        return container;
    }

    // 更新编辑器列表
    function updateEditorList() {
        let allEditors = [];

        // 检测 CodeMirror 编辑器
        if (typeof window.codeEditors !== 'undefined' && window.codeEditors) {
            const cmKeys = Object.keys(window.codeEditors);
            cmKeys.forEach(key => {
                allEditors.push({
                    type: 'codemirror',
                    id: key,
                    name: `代码编辑器 (${key})`
                });
            });
            console.log('[粘贴助手] 检测到CodeMirror编辑器:', cmKeys.length, '个');
        }

        // 检测 UEditor 编辑器
        if (typeof window.UE !== 'undefined' && window.UE.instants) {
            const ueKeys = Object.keys(window.UE.instants);
            ueKeys.forEach(key => {
                const editor = window.UE.instants[key];
                // 只添加有效的编辑器实例
                if (editor && editor.ready) {
                    // 检查编辑器是否可见
                    // 必须有容器，且容器有尺寸
                    if (!editor.container || (editor.container.offsetWidth === 0 && editor.container.offsetHeight === 0)) {
                        return;
                    }

                    // 检查是否为只读编辑器
                    if (editor.options && editor.options.readonly) {
                        return;
                    }
                    if (editor.body && editor.body.getAttribute('contenteditable') === 'false') {
                        return;
                    }

                    allEditors.push({
                        type: 'ueditor',
                        id: key,
                        name: `作业编辑器 (${key})`
                    });
                }
            });
            console.log('[粘贴助手] 检测到UEditor编辑器:', ueKeys.length, '个');
        }

        // 注意: 超星的所有答题框都是UEditor，不存在纯textarea
        // textarea元素只是占位符，会被UEditor接管并隐藏

        // 处理编辑器数量变化
        if (allEditors.length === 0) {
            if (pasteHelper) {
                hideHelper();
            }
            return;
        } else {
            if (!pasteHelper) {
                createHelperIfNeeded();
            } else {
                showHelper();
            }
        }

        // 更新UI
        const select = pasteHelper.querySelector('.paste-helper-select');
        const countSpan = pasteHelper.querySelector('#editor-count');

        if (!select || !countSpan) return;

        // 清空现有选项
        select.innerHTML = '<option value="">请选择编辑器</option>';

        // 添加编辑器选项
        allEditors.forEach((editor, index) => {
            const option = document.createElement('option');
            option.value = JSON.stringify({ type: editor.type, id: editor.id });
            option.textContent = editor.name;
            select.appendChild(option);
        });

        countSpan.textContent = allEditors.length;

        // 如果只有一个编辑器，自动选择
        if (allEditors.length === 1) {
            select.value = JSON.stringify({ type: allEditors[0].type, id: allEditors[0].id });
        }
    }

    // 粘贴内容到编辑器
    function pasteCode() {
        const textarea = pasteHelper.querySelector('.paste-helper-textarea');
        const select = pasteHelper.querySelector('.paste-helper-select');
        const status = pasteHelper.querySelector('.paste-helper-status');

        const content = textarea.value;
        const selectedEditorStr = select.value;

        if (!content) {
            status.textContent = '请输入要粘贴的内容';
            status.style.color = '#f44336';
            return;
        }

        if (!selectedEditorStr) {
            status.textContent = '请选择目标编辑器';
            status.style.color = '#f44336';
            return;
        }

        try {
            const editorInfo = JSON.parse(selectedEditorStr);
            const { type, id } = editorInfo;

            console.log('[粘贴助手] 开始粘贴到:', type, id);
            console.log('[粘贴助手] 内容长度:', content.length);

            let success = false;

            // 根据编辑器类型选择粘贴方法
            if (type === 'codemirror') {
                // CodeMirror 编辑器
                if (typeof window.codeEditors === 'undefined' || !window.codeEditors[id]) {
                    throw new Error('CodeMirror编辑器不存在');
                }
                const editor = window.codeEditors[id];
                if (!editor || typeof editor.setValue !== 'function') {
                    throw new Error('编辑器对象无效或缺少setValue方法');
                }
                editor.setValue(content);
                success = true;

            } else if (type === 'ueditor') {
                // UEditor 编辑器
                if (typeof window.UE === 'undefined' || !window.UE.instants || !window.UE.instants[id]) {
                    throw new Error('UEditor编辑器不存在');
                }
                const editor = window.UE.instants[id];
                if (!editor || typeof editor.setContent !== 'function') {
                    throw new Error('UEditor对象无效或缺少setContent方法');
                }

                // 使用setContent绕过粘贴检测
                const htmlContent = content
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br>');
                editor.setContent(htmlContent);

                // 触发内容变化事件
                try {
                    if (typeof editor.fireEvent === 'function') {
                        editor.fireEvent('contentChange');
                    }
                } catch (e) {
                    console.warn('[粘贴助手] fireEvent失败:', e);
                }

                // 调用页面的状态更新函数
                try {
                    if (typeof window.answerContentChange === 'function') {
                        window.answerContentChange();
                    }

                    // 注意: 不调用loadEditorAnswerd，因为它内部会调用UE.getEditor()
                    // 这会导致创建新的编辑器实例！
                    // 用户保存时，页面会自动调用相关函数更新答题状态
                } catch (e) {
                    console.warn('[粘贴助手] 状态更新失败（不影响粘贴）:', e);
                }

                success = true;
            }

            if (success) {
                status.textContent = `内容已成功粘贴到 ${type === 'codemirror' ? '代码编辑器' : type === 'ueditor' ? '作业编辑器' : '答题框'}`;
                status.style.color = '#4CAF50';
                console.log('[粘贴助手] 粘贴成功');

                // 保存内容到localStorage
                localStorage.setItem('paste-helper-last-code', content);
            }

        } catch (error) {
            console.error('[粘贴助手] 粘贴失败:', error);
            status.textContent = '粘贴失败: ' + error.message;
            status.style.color = '#f44336';
        }
    }

    // 清空文本框
    function clearCode() {
        const textarea = pasteHelper.querySelector('.paste-helper-textarea');
        const status = pasteHelper.querySelector('.paste-helper-status');

        textarea.value = '';
        status.textContent = '已清空';
        status.style.color = '#666';
    }

    // 设置拖拽功能
    function setupDragging() {
        const header = pasteHelper.querySelector('.paste-helper-header');

        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('paste-helper-minimize')) return;

            isDragging = true;
            const rect = pasteHelper.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', handleDragEnd);

            e.preventDefault();
        });
    }

    function handleDrag(e) {
        if (!isDragging) return;

        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;

        pasteHelper.style.left = Math.max(0, Math.min(window.innerWidth - pasteHelper.offsetWidth, x)) + 'px';
        pasteHelper.style.top = Math.max(0, Math.min(window.innerHeight - pasteHelper.offsetHeight, y)) + 'px';
        pasteHelper.style.right = 'auto';
    }

    function handleDragEnd() {
        if (isDragging) {
            isDragging = false;
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleDragEnd);

            // 保存位置
            const rect = pasteHelper.getBoundingClientRect();
            const position = {
                top: rect.top,
                right: window.innerWidth - rect.right
            };
            localStorage.setItem('paste-helper-position', JSON.stringify(position));
        }
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 粘贴按钮
        const pasteBtn = pasteHelper.querySelector('.paste-helper-button.primary');
        pasteBtn.addEventListener('click', pasteCode);

        // 清空按钮
        const clearBtn = pasteHelper.querySelector('.paste-helper-button.secondary');
        clearBtn.addEventListener('click', clearCode);

        // 最小化按钮
        const minimizeBtn = pasteHelper.querySelector('.paste-helper-minimize');
        const content = pasteHelper.querySelector('.paste-helper-content');
        let isMinimized = false;

        minimizeBtn.addEventListener('click', () => {
            isMinimized = !isMinimized;
            content.classList.toggle('collapsed', isMinimized);
            minimizeBtn.textContent = isMinimized ? '+' : '−';
            minimizeBtn.title = isMinimized ? '展开' : '最小化';
        });

        // 快捷键支持
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                const textarea = pasteHelper.querySelector('.paste-helper-textarea');
                if (document.activeElement === textarea) {
                    pasteCode();
                    e.preventDefault();
                }
            }
        });

        // 编辑器选择变化时重置状态
        const select = pasteHelper.querySelector('.paste-helper-select');
        select.addEventListener('change', () => {
            const status = pasteHelper.querySelector('.paste-helper-status');
            status.textContent = '就绪';
            status.style.color = '#666';
        });
    }

    // 恢复上次的代码
    function restoreLastCode() {
        const lastCode = localStorage.getItem('paste-helper-last-code');
        if (lastCode) {
            const textarea = pasteHelper.querySelector('.paste-helper-textarea');
            textarea.value = lastCode;
        }
    }

    // 窗口管理函数
    function showHelper() {
        if (pasteHelper) {
            pasteHelper.style.display = 'block';
            console.log('[粘贴助手] 显示助手窗口');
        }
    }

    function hideHelper() {
        if (pasteHelper) {
            pasteHelper.style.display = 'none';
            console.log('[粘贴助手] 隐藏助手窗口');
        }
    }

    function removeHelper() {
        if (pasteHelper) {
            pasteHelper.remove();
            pasteHelper = null;
            console.log('[粘贴助手] 移除助手窗口');
        }
    }

    function createHelperIfNeeded() {
        if (!pasteHelper) {
            createStyles();
            pasteHelper = createPasteHelper();
            setupDragging();
            setupEventListeners();
            restoreLastCode();
            console.log('[粘贴助手] 创建助手窗口');
        }
        showHelper();
    }

    // 监听页面变化，更新编辑器列表（防抖处理）
    function setupMutationObserver() {
        let updateTimeout;

        const observer = new MutationObserver(() => {
            // 防抖处理，避免频繁更新
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }
            updateTimeout = setTimeout(() => {
                updateEditorList();
            }, 1000); // 1秒后更新
        });

        observer.observe(document.body, {
            childList: true,
            subtree: false // 只监听直接子元素变化
        });

        return observer;
    }

    // 初始化
    async function init() {
        try {
            // 避免重复初始化
            if (isInitialized) {
                console.log('[粘贴助手] 已经初始化过，跳过重复初始化');
                return;
            }

            // 检查窗口大小，如果太小（如在小的iframe中），则不初始化
            if (window.innerWidth < 300 || window.innerHeight < 300) {
                console.log('[粘贴助手] 窗口尺寸过小，跳过初始化');
                return;
            }

            // 检查URL，排除UEditor的弹窗页面（更宽松的匹配）
            const currentUrl = window.location.href;
            if (currentUrl.includes('/dialogs/') ||
                currentUrl.includes('image.html') ||
                currentUrl.includes('attachment.html') ||
                currentUrl.includes('video.html') ||
                currentUrl.includes('file.html')) {
                console.log('[粘贴助手] 检测到UEditor弹窗页面(URL)，跳过初始化');
                return;
            }

            // 检查是否加载了 UEditor 的 dialogs 内部脚本 (internal.js)
            // 这是最准确的判断方式，因为所有UEditor标准弹窗都会加载这个文件
            const scripts = document.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
                if (scripts[i].src && scripts[i].src.includes('internal.js')) {
                    console.log('[粘贴助手] 检测到 internal.js，判定为UEditor弹窗，跳过初始化');
                    return;
                }
            }

            // 检查 iframe ID (如果有权限访问)
            try {
                if (window.frameElement && window.frameElement.id && window.frameElement.id.startsWith('edui_iframe_')) {
                    console.log('[粘贴助手] 检测到UEditor iframe ID，跳过初始化');
                    return;
                }
            } catch (e) {
                // 忽略跨域错误
            }

            console.log('[粘贴助手] 开始初始化...');

            // 等待编辑器加载
            const hasEditors = await waitForEditors();

            if (hasEditors) {
                // 只在检测到编辑器时才创建界面
                createHelperIfNeeded();
                updateEditorList();
                setupMutationObserver();

                console.log('[粘贴助手] 超星粘贴助手已成功加载');

                // 定期更新编辑器列表（降低频率）
                setInterval(() => {
                    updateEditorList();
                }, 5000);
            } else {
                console.log('[粘贴助手] 当前页面无编辑器，等待后续检测');
                // 启动监听器，等待编辑器出现
                setupMutationObserver();
            }

            isInitialized = true;

        } catch (error) {
            console.error('[粘贴助手] 初始化失败:', error);
        }
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
