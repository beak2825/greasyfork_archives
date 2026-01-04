// ==UserScript==
// @name         查找账号下店铺名称
// @namespace    http://your-namespace.com/
// @version      1.1
// @description  在页面中搜索元素并自动定位到匹配位置
// @author       zosah
// @match        https://admin.xiaoe-tech.com/t/account/muti_index*
// @icon         https://commonresource-1252524126.cdn.xiaoeknow.com/image/lhyaurs50zil.ico
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/549005/%E6%9F%A5%E6%89%BE%E8%B4%A6%E5%8F%B7%E4%B8%8B%E5%BA%97%E9%93%BA%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/549005/%E6%9F%A5%E6%89%BE%E8%B4%A6%E5%8F%B7%E4%B8%8B%E5%BA%97%E9%93%BA%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加搜索框样式
    GM_addStyle(`
        #custom-search-container {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 99999 !important; /* 提高层级 */
            background: white;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        #custom-search-input {
            width: 200px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
        }
        #custom-search-button {
            margin-left: 10px;
            padding: 5px 10px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        #custom-search-button:hover {
            background: #1976D2;
        }
        .custom-highlight {
            background: yellow !important;
            border: 2px solid red !important;
        }
    `);

    // 创建搜索框
    function createSearchBox() {
        const searchContainer = document.createElement('div');
        searchContainer.id = 'custom-search-container';

        const searchInput = document.createElement('input');
        searchInput.id = 'custom-search-input';
        searchInput.type = 'text';
        searchInput.placeholder = '输入搜索条件';

        const searchButton = document.createElement('button');
        searchButton.id = 'custom-search-button';
        searchButton.textContent = '搜索';

        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchButton);
        document.body.appendChild(searchContainer);

        // 搜索功能
searchButton.addEventListener('click', () => {
    const searchText = searchInput.value.trim();
    if (!searchText) {
        alert('请输入搜索条件');
        return;
    }

    // 清除之前的高亮
    const previousHighlights = document.querySelectorAll('.shop-item-content.custom-highlight');
    previousHighlights.forEach(element => {
        element.classList.remove('custom-highlight');
    });

    // 遍历页面元素
    const elements = document.querySelectorAll('.shop-item-content');
    let found = false;

    elements.forEach(element => {
        if (
            element.textContent.includes(searchText) // 匹配文本内容
        ) {
            // 高亮匹配元素
            element.classList.add('custom-highlight');

            // 滚动到元素位置
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            found = true;
        }
    });

    if (!found) {
        alert('未找到匹配的元素');
    }
        });
    }

    // 监听页面变化
    function waitForPageLoad() {
        const observer = new MutationObserver((mutations, obs) => {
            const searchContainer = document.getElementById('custom-search-container');
            if (document.body && !searchContainer) {
                // 页面加载完成，插入搜索框
                createSearchBox();
                obs.disconnect(); // 停止监听
            }
        });

        // 监听整个文档的变化
        observer.observe(document, {
            childList: true,
            subtree: true,
        });
    }

    // 启动监听
    waitForPageLoad();
})();