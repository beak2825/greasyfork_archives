// ==UserScript==
// @name         蓝白-2048论坛搜索框清空按钮
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在2048论坛搜索框旁边添加清空按钮（阻止页面刷新）
// @author       蓝白社野怪
// @match        https://hjd2048.com/2048/search.php*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/551219/%E8%93%9D%E7%99%BD-2048%E8%AE%BA%E5%9D%9B%E6%90%9C%E7%B4%A2%E6%A1%86%E6%B8%85%E7%A9%BA%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/551219/%E8%93%9D%E7%99%BD-2048%E8%AE%BA%E5%9D%9B%E6%90%9C%E7%B4%A2%E6%A1%86%E6%B8%85%E7%A9%BA%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[蓝白脚本] 脚本已加载，开始查找搜索框...');

    function addClearButton() {
        const mainWrap = document.querySelector('.main-wrap');
        if (!mainWrap) {
            console.log('[蓝白脚本] 未找到.main-wrap容器，将在1秒后重试');
            setTimeout(addClearButton, 1000);
            return;
        }

        const keywordInput = mainWrap.querySelector('#keyword');
        if (keywordInput) {
            if (document.getElementById('bluewhite-clear-btn')) {
                console.log('[蓝白脚本] 清空按钮已存在');
                return;
            }

            const clearButton = document.createElement('button');
            clearButton.id = 'bluewhite-clear-btn';
            clearButton.title = '清空搜索内容';
            clearButton.textContent = '×';
            clearButton.type = 'button'; // 关键修改：防止表单提交
            clearButton.style.cssText = `
                margin-left: 5px;
                background: #f0f0f0;
                border: 1px solid #ccc;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                line-height: 18px;
                text-align: center;
                cursor: pointer;
                color: #999;
                font-size: 14px;
                padding: 0;
            `;

            clearButton.addEventListener('mouseover', function() {
                this.style.background = '#e0e0e0';
                this.style.color = '#666';
            });

            clearButton.addEventListener('mouseout', function() {
                this.style.background = '#f0f0f0';
                this.style.color = '#999';
            });

            clearButton.addEventListener('click', function(e) {
                e.preventDefault(); // 阻止默认行为
                e.stopPropagation(); // 阻止事件冒泡
                keywordInput.value = '';
                keywordInput.focus();
                console.log('[蓝白脚本] 已清空搜索框（无页面刷新）');
            });

            keywordInput.parentNode.insertBefore(clearButton, keywordInput.nextSibling);
            console.log('[蓝白脚本] 清空按钮添加成功，ID:', clearButton.id);
        } else {
            console.log('[蓝白脚本] 在.main-wrap内未找到#keyword，将在1秒后重试');
            setTimeout(addClearButton, 1000);
        }
    }

    addClearButton();

    // 监听动态加载
    const observer = new MutationObserver(function() {
        const existingBtn = document.getElementById('bluewhite-clear-btn');
        if (!existingBtn) addClearButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();