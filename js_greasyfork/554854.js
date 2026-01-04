// ==UserScript==
// @name         网页自动刷新（支持秒、分钟、小时 + 倒计时进度条）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  小巧简洁的网页自动刷新工具，支持秒、分钟、小时选择和倒计时进度条显示，窗口可拖动
// @author       鹏
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554854/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%EF%BC%88%E6%94%AF%E6%8C%81%E7%A7%92%E3%80%81%E5%88%86%E9%92%9F%E3%80%81%E5%B0%8F%E6%97%B6%20%2B%20%E5%80%92%E8%AE%A1%E6%97%B6%E8%BF%9B%E5%BA%A6%E6%9D%A1%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554854/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%EF%BC%88%E6%94%AF%E6%8C%81%E7%A7%92%E3%80%81%E5%88%86%E9%92%9F%E3%80%81%E5%B0%8F%E6%97%B6%20%2B%20%E5%80%92%E8%AE%A1%E6%97%B6%E8%BF%9B%E5%BA%A6%E6%9D%A1%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建容器
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.width = '180px';
    container.style.height = '100px';
    container.style.backgroundColor = '#ffffff';
    container.style.border = '2px solid #4CAF50';
    container.style.borderRadius = '25px';
    container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'space-around';
    container.style.cursor = 'move';
    container.style.userSelect = 'none';
    container.style.padding = '5px';

    // 创建输入框
    const input = document.createElement('input');
    input.type = 'number';
    input.placeholder = '时间';
    input.style.width = '50px';
    input.style.height = '25px';
    input.style.textAlign = 'center';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '5px';
    input.style.outline = 'none';

    // 创建单位选择框
    const unitSelect = document.createElement('select');
    unitSelect.style.width = '60px';
    unitSelect.style.height = '25px';
    unitSelect.style.border = '1px solid #ccc';
    unitSelect.style.borderRadius = '5px';
    unitSelect.style.outline = 'none';
    ['秒', '分钟', '小时'].forEach((unit) => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        unitSelect.appendChild(option);
    });

    // 创建复选框
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.width = '20px';
    checkbox.style.height = '20px';

    // 创建进度条容器
    const progressBarContainer = document.createElement('div');
    progressBarContainer.style.width = '100%';
    progressBarContainer.style.height = '10px';
    progressBarContainer.style.backgroundColor = '#f3f3f3';
    progressBarContainer.style.borderRadius = '5px';
    progressBarContainer.style.marginTop = '5px';

    const progressBar = document.createElement('div');
    progressBar.style.height = '100%';
    progressBar.style.width = '100%'; // 初始化为满条
    progressBar.style.backgroundColor = '#4CAF50';
    progressBar.style.borderRadius = '5px';
    progressBarContainer.appendChild(progressBar);

    // 将元素添加到容器
    container.appendChild(input);
    container.appendChild(unitSelect);
    container.appendChild(checkbox);
    container.appendChild(progressBarContainer);

    // 添加到页面
    document.body.appendChild(container);

    // 保存刷新设置
    const savedTime = localStorage.getItem('refreshTime');
    const savedUnit = localStorage.getItem('refreshUnit');
    const savedChecked = localStorage.getItem('checkboxChecked') === 'true';

    if (savedTime) input.value = savedTime;
    if (savedUnit) unitSelect.value = savedUnit;
    checkbox.checked = savedChecked;

    // 刷新逻辑
    let refreshInterval;
    let progressInterval;

    const convertToMilliseconds = (time, unit) => {
        switch (unit) {
            case '秒': return time * 1000;
            case '分钟': return time * 1000 * 60;
            case '小时': return time * 1000 * 60 * 60;
            default: return time * 1000;
        }
    };

    const startRefresh = () => {
        const timeInSeconds = parseInt(input.value, 10);
        const unit = unitSelect.value;
        if (!isNaN(timeInSeconds) && timeInSeconds > 0) {
            const interval = convertToMilliseconds(timeInSeconds, unit);
            refreshInterval = setInterval(() => {
                location.reload();
            }, interval);

            // 倒计时进度条动画
            let remainingTime = interval;
            progressBar.style.width = '100%'; // 初始化为满条
            progressInterval = setInterval(() => {
                remainingTime -= 100; // 每次减少 100ms
                const progress = (remainingTime / interval) * 100;
                progressBar.style.width = `${progress}%`;
                if (remainingTime <= 0) {
                    clearInterval(progressInterval); // 重置进度条动画
                }
            }, 100);
        } else {
            alert('请输入有效的刷新时间！');
            checkbox.checked = false;
        }
    };

    const stopRefresh = () => {
        clearInterval(refreshInterval);
        clearInterval(progressInterval);
        progressBar.style.width = '100%'; // 重置为满条
    };

    // 保存设置
    const saveSettings = () => {
        localStorage.setItem('refreshTime', input.value);
        localStorage.setItem('refreshUnit', unitSelect.value);
        localStorage.setItem('checkboxChecked', checkbox.checked);
    };

    // 复选框监听
    checkbox.addEventListener('change', () => {
        saveSettings();
        checkbox.checked ? startRefresh() : stopRefresh();
    });

    // 输入框和单位选择框监听
    input.addEventListener('input', saveSettings);
    unitSelect.addEventListener('change', saveSettings);

    // 启动时恢复设置
    if (checkbox.checked) startRefresh();

    // 拖动功能
    let isDragging = false;
    let offsetX, offsetY;

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
        container.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            container.style.left = `${e.clientX - offsetX}px`;
            container.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'move';
    });
})();
