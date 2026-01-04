// ==UserScript==
// @name         Danbooru Tag Copier & Selector
// @name:zh-CN   Danbooru 标签复制与选择工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 Danbooru 的 tag 列表添加勾选框和控制按钮，支持一键复制、全选、反选、取消。
// @description:zh-CN 在 Danbooru 的 post 页面 tag 列表添加勾选框，支持 Shift 批量选择、一键复制标签、全选/反选等功能。
// @author       您的名字 (例如: setycyas)
// @match        https://danbooru.donmai.us/posts/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561025/Danbooru%20Tag%20Copier%20%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/561025/Danbooru%20Tag%20Copier%20%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 添加样式
    GM_addStyle(`
        .dtc-checkbox {
            margin-right: 8px;
            cursor: pointer;
            transform: scale(1.2);
        }
        .dtc-controls {
            display: inline-block;
            margin-left: 15px;
            font-size: 13px;
            font-weight: normal;
        }
        .dtc-btn {
            display: inline-block;
            margin-right: 5px;
            padding: 2px 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f0f0f0;
            color: #333;
            cursor: pointer;
            text-decoration: none !important;
            user-select: none;
        }
        .dtc-btn:hover {
            background-color: #e0e0e0;
            border-color: #999;
        }
        .dtc-btn:active {
            background-color: #ccc;
        }
        /* 提示框样式 */
        #dtc-toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 9999;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }
        #dtc-toast.show {
            opacity: 1;
        }
        /* 调整原有Flex布局，防止挤压 */
        .general-tag-list li.flex {
            align-items: center;
        }
    `);

    // 2. 创建提示框元素
    const toast = document.createElement('div');
    toast.id = 'dtc-toast';
    document.body.appendChild(toast);

    function showToast(message) {
        toast.innerText = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    // 3. 处理 Shift + Click 的变量
    let lastChecked = null;

    // 4. 主逻辑：初始化界面
    function init() {
        // 获取 General 标签列表 (根据提供的结构 ul.general-tag-list)
        // 注意：Danbooru 页面上通常还有 artist-tag-list, copyright-tag-list 等
        // 这里我们针对所有类似结构的列表都生效，或者您可以只针对 general-tag-list
        const tagLists = document.querySelectorAll('ul.general-tag-list, ul.artist-tag-list, ul.copyright-tag-list, ul.character-tag-list, ul.meta-tag-list');

        tagLists.forEach(ul => {
            // 找到对应的标题 H3
            // 网页结构通常是 section > h3 + ul，或者是 h3 > ul (比较少见)
            // 根据您的描述，按钮要放在 h3 旁边。我们需要找到 ul 之前的那个 h3
            const header = ul.previousElementSibling;

            if (header && (header.tagName === 'H3' || header.tagName === 'H4')) {
                addControlsToHeader(header, ul);
            }

            // 给每个 li 添加 checkbox
            const listItems = ul.querySelectorAll('li[data-tag-name]');
            listItems.forEach(li => {
                addCheckboxToLi(li, ul);
            });
        });
    }

    // 给标题添加按钮
    function addControlsToHeader(header, ul) {
        const controlContainer = document.createElement('span');
        controlContainer.className = 'dtc-controls';

        const btnCopy = createBtn('Copy', () => copyTags(ul));
        const btnAll = createBtn('All', () => toggleAll(ul, true));
        const btnReverse = createBtn('Reverse', () => toggleReverse(ul));
        const btnCancel = createBtn('Cancel', () => toggleAll(ul, false));

        controlContainer.append(btnCopy, btnAll, btnReverse, btnCancel);
        header.appendChild(controlContainer);
    }

    // 创建按钮辅助函数
    function createBtn(text, clickHandler) {
        const btn = document.createElement('span');
        btn.innerText = text;
        btn.className = 'dtc-btn';
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            clickHandler();
        };
        return btn;
    }

    // 给 LI 添加复选框
    function addCheckboxToLi(li, ul) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'dtc-checkbox';

        // 绑定点击事件 (含 Shift 多选逻辑)
        checkbox.addEventListener('click', function(e) {
            const allCheckboxes = Array.from(ul.querySelectorAll('.dtc-checkbox'));

            if (e.shiftKey && lastChecked && lastChecked !== this && allCheckboxes.includes(lastChecked)) {
                const start = allCheckboxes.indexOf(this);
                const end = allCheckboxes.indexOf(lastChecked);

                const low = Math.min(start, end);
                const high = Math.max(start, end);

                for (let i = low; i <= high; i++) {
                    allCheckboxes[i].checked = this.checked;
                }
            }
            lastChecked = this;
        });

        // 插入到 li 的最前面
        li.prepend(checkbox);
    }

    // --- 功能函数 ---

    // 复制功能
    function copyTags(ul) {
        const checkedBoxes = ul.querySelectorAll('.dtc-checkbox:checked');
        if (checkedBoxes.length === 0) {
            showToast('未选择任何标签');
            return;
        }

        const tags = [];
        checkedBoxes.forEach(cb => {
            const li = cb.closest('li');
            const tagName = li.getAttribute('data-tag-name');
            if (tagName) {
                tags.push(tagName);
            }
        });

        const tagString = tags.join(','); // 逗号拼接

        // 使用 GM_setClipboard 或 navigator
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(tagString);
        } else {
            navigator.clipboard.writeText(tagString);
        }

        showToast(`成功复制 ${tags.length} 个标签到剪贴板！`);
    }

    // 全选 / 取消
    function toggleAll(ul, status) {
        const checkboxes = ul.querySelectorAll('.dtc-checkbox');
        checkboxes.forEach(cb => cb.checked = status);
        lastChecked = null; // 重置 shift 选区起点
    }

    // 反选
    function toggleReverse(ul) {
        const checkboxes = ul.querySelectorAll('.dtc-checkbox');
        checkboxes.forEach(cb => cb.checked = !cb.checked);
        lastChecked = null;
    }

    // 启动
    // 等待 DOM 加载完成，或者直接运行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();