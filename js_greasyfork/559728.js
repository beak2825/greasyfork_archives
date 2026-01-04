// ==UserScript==
// @name         网页滚动下移可控制自动助手(v6.1防丢版)
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  基于v6.0修改：自动下滑 + 自动点击 + 记忆 + 窄面板 + 拖拽 + 智能防丢失
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559728/%E7%BD%91%E9%A1%B5%E6%BB%9A%E5%8A%A8%E4%B8%8B%E7%A7%BB%E5%8F%AF%E6%8E%A7%E5%88%B6%E8%87%AA%E5%8A%A8%E5%8A%A9%E6%89%8B%28v61%E9%98%B2%E4%B8%A2%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559728/%E7%BD%91%E9%A1%B5%E6%BB%9A%E5%8A%A8%E4%B8%8B%E7%A7%BB%E5%8F%AF%E6%8E%A7%E5%88%B6%E8%87%AA%E5%8A%A8%E5%8A%A9%E6%89%8B%28v61%E9%98%B2%E4%B8%A2%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 0. 全局配置与状态 ---
    // 为了防止和旧版本冲突，这里改了前缀
    const STORAGE_PREFIX = 'tm_autoscript_v6_fix_';
    let mouseX = 0;
    let mouseY = 0;
    let isRunning = false;
    let scrollInterval = null;
    let clickInterval = null;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 读取记忆设置
    const savedConfig = {
        speed: localStorage.getItem(STORAGE_PREFIX + 'speed') || '2',
        clickEnabled: localStorage.getItem(STORAGE_PREFIX + 'clickEnabled') === 'true',
        clickFreq: localStorage.getItem(STORAGE_PREFIX + 'clickFreq') || '1000',
        isMinimized: localStorage.getItem(STORAGE_PREFIX + 'isMinimized') === 'true',
        posTop: localStorage.getItem(STORAGE_PREFIX + 'posTop'),
        posLeft: localStorage.getItem(STORAGE_PREFIX + 'posLeft')
    };

    // --- 1. 创建 UI 容器 (保持 v6.0 的窄样式) ---
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        z-index: 999999;
        background-color: rgba(255, 255, 255, 0.95);
        border: 1px solid #ccc;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-family: Arial, sans-serif;
        font-size: 12px;
        color: #333;
        width: 85px;
        overflow: hidden;
        user-select: none;
    `;

    // 初始位置设置 (如果有记忆则用记忆，否则默认右下角)
    if (savedConfig.posTop && savedConfig.posLeft) {
        container.style.top = savedConfig.posTop;
        container.style.left = savedConfig.posLeft;
    } else {
        // 为了配合防丢失逻辑，这里先给一个大致位置
        container.style.top = (window.innerHeight - 200) + 'px';
        container.style.left = (window.innerWidth - 100) + 'px';
    }

    // 标题栏
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 5px;
        background-color: #e0e0e0;
        border-bottom: 1px solid #ccc;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        font-weight: bold;
        font-size: 12px;
    `;

    const titleText = document.createElement('span');
    titleText.textContent = '助手';

    const toggleBtn = document.createElement('span');
    toggleBtn.textContent = savedConfig.isMinimized ? '▲' : '▼';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.padding = '0 4px';
    toggleBtn.style.backgroundColor = '#d6d6d6';
    toggleBtn.style.borderRadius = '3px';

    header.appendChild(titleText);
    header.appendChild(toggleBtn);
    container.appendChild(header);

    // 内容区域
    const content = document.createElement('div');
    content.style.padding = '8px';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';
    content.style.gap = '8px';
    if (savedConfig.isMinimized) content.style.display = 'none';

    // --- 2. 控件区域 (v6.0 布局) ---

    // 下滑速度
    const scrollGroup = document.createElement('div');
    scrollGroup.style.display = 'flex';
    scrollGroup.style.flexDirection = 'column';
    scrollGroup.style.gap = '2px';

    const scrollLabel = document.createElement('label');
    scrollLabel.textContent = '下滑速度';
    scrollLabel.style.fontSize = '11px';
    scrollLabel.style.color = '#666';

    const scrollInput = document.createElement('input');
    scrollInput.type = 'number';
    scrollInput.value = savedConfig.speed;
    scrollInput.min = '0';
    scrollInput.style.width = '100%';
    scrollInput.style.boxSizing = 'border-box';
    scrollInput.style.textAlign = 'center';

    scrollGroup.appendChild(scrollLabel);
    scrollGroup.appendChild(scrollInput);

    // 自动点击
    const clickGroup = document.createElement('div');
    clickGroup.style.display = 'flex';
    clickGroup.style.flexDirection = 'column';
    clickGroup.style.gap = '6px';
    clickGroup.style.borderTop = '1px dashed #ccc';
    clickGroup.style.paddingTop = '6px';

    const clickToggleBox = document.createElement('div');
    clickToggleBox.style.display = 'flex';
    clickToggleBox.style.alignItems = 'center';

    const clickCheck = document.createElement('input');
    clickCheck.type = 'checkbox';
    clickCheck.id = 'tm_auto_click_check';
    clickCheck.checked = savedConfig.clickEnabled;
    clickCheck.style.marginRight = '4px';

    const clickCheckLabel = document.createElement('label');
    clickCheckLabel.textContent = '点击';
    clickCheckLabel.htmlFor = 'tm_auto_click_check';
    clickCheckLabel.style.cursor = 'pointer';

    clickToggleBox.appendChild(clickCheck);
    clickToggleBox.appendChild(clickCheckLabel);

    const clickFreqBox = document.createElement('div');
    clickFreqBox.style.display = 'flex';
    clickFreqBox.style.flexDirection = 'column';
    clickFreqBox.style.gap = '2px';

    const freqLabel = document.createElement('span');
    freqLabel.textContent = '间隔(ms)';
    freqLabel.style.fontSize = '11px';
    freqLabel.style.color = '#666';

    const freqInput = document.createElement('input');
    freqInput.type = 'number';
    freqInput.value = savedConfig.clickFreq;
    freqInput.min = '100';
    freqInput.style.width = '100%';
    freqInput.style.boxSizing = 'border-box';
    freqInput.style.textAlign = 'center';

    clickFreqBox.appendChild(freqLabel);
    clickFreqBox.appendChild(freqInput);

    clickGroup.appendChild(clickToggleBox);
    clickGroup.appendChild(clickFreqBox);

    // 按钮
    const actionButton = document.createElement('button');
    actionButton.textContent = '开始';
    actionButton.style.cssText = `
        padding: 5px 0;
        cursor: pointer;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: bold;
        width: 100%;
        font-size: 12px;
    `;

    content.appendChild(scrollGroup);
    content.appendChild(clickGroup);
    content.appendChild(actionButton);
    container.appendChild(content);
    document.body.appendChild(container);

    // --- 3. [核心新增] 防丢失逻辑 ---
    function fixPosition() {
        const rect = container.getBoundingClientRect();
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        let newLeft = rect.left;
        let newTop = rect.top;
        let needsUpdate = false;

        // 检查右边界
        if (rect.right > winWidth) {
            newLeft = winWidth - rect.width - 10;
            needsUpdate = true;
        }
        // 检查下边界
        if (rect.bottom > winHeight) {
            newTop = winHeight - rect.height - 10;
            needsUpdate = true;
        }
        // 检查左边界
        if (rect.left < 0) {
            newLeft = 10;
            needsUpdate = true;
        }
        // 检查上边界
        if (rect.top < 0) {
            newTop = 10;
            needsUpdate = true;
        }

        // 如果位置不合法，强制修正
        if (needsUpdate) {
            container.style.left = newLeft + 'px';
            container.style.top = newTop + 'px';
            // 顺便保存修正后的位置
            localStorage.setItem(STORAGE_PREFIX + 'posTop', newTop + 'px');
            localStorage.setItem(STORAGE_PREFIX + 'posLeft', newLeft + 'px');
        }
    }

    // 1. 窗口大小改变时自动修正
    window.addEventListener('resize', fixPosition);
    // 2. 脚本刚加载时延时修正 (防止还没渲染好)
    setTimeout(fixPosition, 100);

    // --- 4. 拖拽逻辑 (整合防丢失) ---
    header.onmousedown = function(e) {
        if (e.target === toggleBtn) return;
        e.preventDefault();

        let startX = e.clientX;
        let startY = e.clientY;
        const rect = container.getBoundingClientRect();

        // 拖拽前必须先把定位模式转为 top/left
        container.style.bottom = 'auto';
        container.style.right = 'auto';
        container.style.left = rect.left + 'px';
        container.style.top = rect.top + 'px';

        let initialLeft = rect.left;
        let initialTop = rect.top;

        document.onmousemove = function(e) {
            let dx = e.clientX - startX;
            let dy = e.clientY - startY;
            container.style.top = (initialTop + dy) + "px";
            container.style.left = (initialLeft + dx) + "px";
        };

        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
            // 拖拽结束：保存位置并执行一次防丢失检查
            localStorage.setItem(STORAGE_PREFIX + 'posTop', container.style.top);
            localStorage.setItem(STORAGE_PREFIX + 'posLeft', container.style.left);
            fixPosition();
        };
    };

    // --- 5. 其他逻辑 (保存设置、最小化、运行) ---
    function saveSettings() {
        localStorage.setItem(STORAGE_PREFIX + 'speed', scrollInput.value);
        localStorage.setItem(STORAGE_PREFIX + 'clickEnabled', clickCheck.checked);
        localStorage.setItem(STORAGE_PREFIX + 'clickFreq', freqInput.value);
    }
    scrollInput.addEventListener('change', saveSettings);
    clickCheck.addEventListener('change', saveSettings);
    freqInput.addEventListener('change', saveSettings);

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = content.style.display === 'none';
        if (isHidden) {
            content.style.display = 'flex';
            toggleBtn.textContent = '▼';
            localStorage.setItem(STORAGE_PREFIX + 'isMinimized', 'false');
        } else {
            content.style.display = 'none';
            toggleBtn.textContent = '▲';
            localStorage.setItem(STORAGE_PREFIX + 'isMinimized', 'true');
        }
        // 最小化/展开后，高度变了，也检查一下位置
        setTimeout(fixPosition, 50);
    });

    function toggleScript() {
        if (isRunning) {
            clearInterval(scrollInterval);
            clearInterval(clickInterval);
            isRunning = false;
            actionButton.textContent = '开始';
            actionButton.style.backgroundColor = '#28a745';
            scrollInput.disabled = false;
            clickCheck.disabled = false;
            freqInput.disabled = false;
        } else {
            isRunning = true;
            saveSettings();
            actionButton.textContent = '停止';
            actionButton.style.backgroundColor = '#dc3545';
            scrollInput.disabled = true;
            clickCheck.disabled = true;
            freqInput.disabled = true;

            const speed = parseInt(scrollInput.value) || 0;
            if (speed > 0) {
                scrollInterval = setInterval(() => {
                    window.scrollBy(0, speed);
                }, 25);
            }

            if (clickCheck.checked) {
                const freq = parseInt(freqInput.value) || 1000;
                clickInterval = setInterval(() => {
                    const target = document.elementFromPoint(mouseX, mouseY);
                    if (target && !container.contains(target)) {
                        target.click();
                    }
                }, freq);
            }
        }
    }

    actionButton.addEventListener('click', toggleScript);
    [scrollInput, freqInput].forEach(input => {
        input.addEventListener('keydown', e => e.stopPropagation());
    });

})();