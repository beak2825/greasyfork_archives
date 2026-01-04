// ==UserScript==
// @name         店小秘助手
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  添加筛选、全选、取消全选、反选和自动滚动按钮
// @author       Rayu
// @match        https://www.dianxiaomi.com/web/shopeeSite/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551212/%E5%BA%97%E5%B0%8F%E7%A7%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/551212/%E5%BA%97%E5%B0%8F%E7%A7%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForContainer(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const intervalTime = 100;
            let totalTime = 0;

            const interval = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(interval);
                    resolve(el);
                }
                totalTime += intervalTime;
                if (totalTime >= timeout) {
                    clearInterval(interval);
                    reject(new Error('未找到目标容器：' + selector));
                }
            }, intervalTime);
        });
    }

    // ========== 自动滚动功能 ==========
    let autoScrollInterval = null;

    function startAutoScroll() {
        // 停止之前的滚动
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
        }

        // ⚡ 滚动速度调整 - 每次滚动的像素数（越大滚动越快）
        const scrollSpeed = 20;

        // ⚡ 滚动速度调整 - 滚动间隔时间（毫秒）（越小滚动越频繁）
        const scrollInterval = 1;

        autoScrollInterval = setInterval(() => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const clientHeight = window.innerHeight;

            // 检查是否到达底部，到达后自动停止
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
                console.log('已滚动到底部，自动停止');
                alert('已滚动到底部！');
                return;
            }

            // 平滑滚动
            window.scrollBy({
                top: scrollSpeed,
                behavior: 'auto'
            });
        }, scrollInterval);
    }
    // ========== 自动滚动功能结束 ==========

    waitForContainer('.d-grid-pager--header-left.min-w-0')
        .then(container => {
            if (container.querySelector('#custom-filter-box')) return;

            const filterDiv = document.createElement('div');
            filterDiv.id = 'custom-filter-box';
            filterDiv.style.padding = '6px 12px';
            filterDiv.style.backgroundColor = '#f9f9f9';
            filterDiv.style.border = '1px solid #ccc';
            filterDiv.style.borderRadius = '4px';
            filterDiv.style.display = 'flex';
            filterDiv.style.alignItems = 'center';
            filterDiv.style.gap = '8px';
            filterDiv.style.minWidth = '450px';
            filterDiv.style.flexWrap = 'wrap'; // 允许换行

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = '输入筛选关键词(如: another in your shop)';
            input.style.flex = '1';
            input.style.height = '28px';
            input.style.padding = '0 8px';
            input.style.border = '1px solid #ccc';
            input.style.borderRadius = '4px';

            const button = document.createElement('button');
            button.textContent = '筛选';
            button.style.height = '28px';
            button.style.padding = '0 12px';
            button.style.cursor = 'pointer';
            button.style.border = '1px solid #1890ff';
            button.style.backgroundColor = '#1890ff';
            button.style.color = '#fff';
            button.style.borderRadius = '4px';
            button.style.fontSize = '14px';

            const selectAllBtn = document.createElement('button');
            selectAllBtn.textContent = '全选';
            selectAllBtn.style.height = '28px';
            selectAllBtn.style.padding = '0 12px';
            selectAllBtn.style.cursor = 'pointer';
            selectAllBtn.style.border = '1px solid #52c41a';
            selectAllBtn.style.backgroundColor = '#52c41a';
            selectAllBtn.style.color = '#fff';
            selectAllBtn.style.borderRadius = '4px';
            selectAllBtn.style.fontSize = '14px';

            const unselectAllBtn = document.createElement('button');
            unselectAllBtn.textContent = '取消全选';
            unselectAllBtn.style.height = '28px';
            unselectAllBtn.style.padding = '0 12px';
            unselectAllBtn.style.cursor = 'pointer';
            unselectAllBtn.style.border = '1px solid #f5222d';
            unselectAllBtn.style.backgroundColor = '#f5222d';
            unselectAllBtn.style.color = '#fff';
            unselectAllBtn.style.borderRadius = '4px';
            unselectAllBtn.style.fontSize = '14px';

            const invertSelectBtn = document.createElement('button');
            invertSelectBtn.textContent = '反选';
            invertSelectBtn.style.height = '28px';
            invertSelectBtn.style.padding = '0 12px';
            invertSelectBtn.style.cursor = 'pointer';
            invertSelectBtn.style.border = '1px solid #faad14';
            invertSelectBtn.style.backgroundColor = '#faad14';
            invertSelectBtn.style.color = '#fff';
            invertSelectBtn.style.borderRadius = '4px';
            invertSelectBtn.style.fontSize = '14px';

            // 开始自动滚动按钮
            const startScrollBtn = document.createElement('button');
            startScrollBtn.textContent = '自动滚动';
            startScrollBtn.style.height = '28px';
            startScrollBtn.style.padding = '0 12px';
            startScrollBtn.style.cursor = 'pointer';
            startScrollBtn.style.border = '1px solid #722ed1';
            startScrollBtn.style.backgroundColor = '#722ed1';
            startScrollBtn.style.color = '#fff';
            startScrollBtn.style.borderRadius = '4px';
            startScrollBtn.style.fontSize = '14px';

            filterDiv.appendChild(input);
            filterDiv.appendChild(button);
            filterDiv.appendChild(selectAllBtn);
            filterDiv.appendChild(unselectAllBtn);
            filterDiv.appendChild(invertSelectBtn);
            filterDiv.appendChild(startScrollBtn);

            container.appendChild(filterDiv);

            // 筛选按钮逻辑
            button.addEventListener('click', () => {
                const keyword = input.value.trim();
                if (!keyword) {
                    document.querySelectorAll('tr.vxe-body--row').forEach(row => {
                        row.style.display = '';
                    });
                    return;
                }
                document.querySelectorAll('tr.vxe-body--row').forEach(row => {
                    const errorMsgElem = row.querySelector('.product-list-error-msg span');
                    if (errorMsgElem && errorMsgElem.textContent.includes(keyword)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });

            // 全选
            selectAllBtn.addEventListener('click', () => {
                document.querySelectorAll('tr.vxe-body--row').forEach(row => {
                    if (row.style.display !== 'none') {
                        const checkbox = row.querySelector('input.ant-checkbox-input[type="checkbox"]');
                        if (checkbox && !checkbox.checked) {
                            checkbox.click();
                        }
                    }
                });
            });

            // 取消全选
            unselectAllBtn.addEventListener('click', () => {
                document.querySelectorAll('tr.vxe-body--row').forEach(row => {
                    const checkbox = row.querySelector('input.ant-checkbox-input[type="checkbox"]');
                    if (checkbox && checkbox.checked) {
                        checkbox.click();
                    }
                });
            });

            // 反选
            invertSelectBtn.addEventListener('click', () => {
                document.querySelectorAll('tr.vxe-body--row').forEach(row => {
                    const checkbox = row.querySelector('input.ant-checkbox-input[type="checkbox"]');
                    if (checkbox && row.style.display !== 'none') {
                        checkbox.click();
                    }
                });
            });

            // 自动滚动按钮 - 点击后自动滚动，到底部自动停止
            startScrollBtn.addEventListener('click', () => {
                startAutoScroll();
            });

        })
        .catch(err => {
            console.error(err);
        });
})();
