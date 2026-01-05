// ==UserScript==
// @name         Bangumi 目录排序增强
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为 Bangumi 目录页面添加排序功能，支持按时间、标题等正向或反向排序
// @author       YRiv
// @match        https://bangumi.tv/index/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559348/Bangumi%20%E7%9B%AE%E5%BD%95%E6%8E%92%E5%BA%8F%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/559348/Bangumi%20%E7%9B%AE%E5%BD%95%E6%8E%92%E5%BA%8F%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // 检查是否有条目列表
        const itemList = document.getElementById('browserItemList');
        if (!itemList) return;

        // 创建排序控制面板
        createSortControls();
    }

    function createSortControls() {
        // 创建排序控制容器
        const sortContainer = document.createElement('div');
        sortContainer.id = 'custom-sort-controls';
        sortContainer.style.cssText = `
            margin: 15px 0;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        `;

        // 创建标签
        const label = document.createElement('span');
        label.textContent = '排序：';
        label.style.fontWeight = 'bold';
        sortContainer.appendChild(label);

        // 排序选项
        const sortOptions = [
            { value: 'date-asc', text: '日期 ↑ (旧→新)' },
            { value: 'date-desc', text: '日期 ↓ (新→旧)' },
            { value: 'title-asc', text: '标题 ↑ (A→Z)' },
            { value: 'title-desc', text: '标题 ↓ (Z→A)' },
            { value: 'default', text: '默认顺序' }
        ];

        // 创建排序按钮
        sortOptions.forEach(option => {
            const btn = document.createElement('button');
            btn.textContent = option.text;
            btn.className = 'sort-btn';
            btn.dataset.sortType = option.value;
            btn.style.cssText = `
                padding: 6px 12px;
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 3px;
                cursor: pointer;
                transition: all 0.2s;
            `;

            // 鼠标悬停效果
            btn.onmouseenter = function() {
                this.style.background = '#f0e1ff';
                this.style.borderColor = '#c084fc';
            };
            btn.onmouseleave = function() {
                if (this.dataset.active !== 'true') {
                    this.style.background = '#fff';
                    this.style.borderColor = '#ddd';
                }
            };

            // 点击事件
            btn.onclick = function() {
                // 重置所有按钮样式
                document.querySelectorAll('.sort-btn').forEach(b => {
                    b.style.background = '#fff';
                    b.style.borderColor = '#ddd';
                    b.dataset.active = 'false';
                });

                // 激活当前按钮
                this.style.background = '#f0e1ff';
                this.style.borderColor = '#c084fc';
                this.dataset.active = 'true';

                // 执行排序
                sortItems(option.value);
            };

            sortContainer.appendChild(btn);
        });

        // 插入到页面中
        const browserTools = document.getElementById('browserTools');
        if (browserTools) {
            browserTools.parentNode.insertBefore(sortContainer, browserTools.nextSibling);
        }
    }

    function sortItems(sortType) {
        const itemList = document.getElementById('browserItemList');
        if (!itemList) return;

        // 获取所有条目
        const items = Array.from(itemList.querySelectorAll('li.item'));

        // 保存原始顺序（如果还没保存）
        if (!window.originalOrder) {
            window.originalOrder = items.slice();
        }

        let sortedItems;

        if (sortType === 'default') {
            // 恢复原始顺序
            sortedItems = window.originalOrder.slice();
        } else {
            // 提取排序数据
            const itemsData = items.map(item => {
                const titleElem = item.querySelector('h3 a.l');
                const title = titleElem ? titleElem.textContent.trim() : '';

                const infoElem = item.querySelector('p.info.tip');
                let date = '';
                if (infoElem) {
                    const infoText = infoElem.textContent.trim();
                    // 提取日期，格式类似 "2004-04-02 / 小畑健 / 集英社"
                    const dateMatch = infoText.match(/(\d{4})-(\d{2})-(\d{2})/);
                    if (dateMatch) {
                        date = dateMatch[0];
                    }
                }

                return {
                    element: item,
                    title: title,
                    date: date
                };
            });

            // 根据排序类型排序
            if (sortType === 'date-asc') {
                itemsData.sort((a, b) => {
                    if (!a.date) return 1;
                    if (!b.date) return -1;
                    return a.date.localeCompare(b.date);
                });
            } else if (sortType === 'date-desc') {
                itemsData.sort((a, b) => {
                    if (!a.date) return 1;
                    if (!b.date) return -1;
                    return b.date.localeCompare(a.date);
                });
            } else if (sortType === 'title-asc') {
                itemsData.sort((a, b) => a.title.localeCompare(b.title));
            } else if (sortType === 'title-desc') {
                itemsData.sort((a, b) => b.title.localeCompare(a.title));
            }

            sortedItems = itemsData.map(data => data.element);
        }

        // 更新odd/even类名
        sortedItems.forEach((item, index) => {
            item.classList.remove('odd', 'even');
            item.classList.add(index % 2 === 0 ? 'odd' : 'even');
        });

        // 清空列表并重新添加排序后的条目
        itemList.innerHTML = '';
        sortedItems.forEach(item => itemList.appendChild(item));

        console.log(`已按 ${sortType} 排序完成`);
    }
})();
