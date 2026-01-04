// ==UserScript==
// @name         草榴社区 搜索框（限于AI破解原创区）
// @namespace    https://greasyfork.org/zh-CN/users/1271574-capricorn666
// @version      0.4
// @description  在草榴社区AI破解原创区添加搜索框，使用谷歌搜索限定范围（优化查询以修复结果不准确的BUG，并支持www.t66y.com域名）
// @author       你（修改 by 资深软件工程师）
// @match        https://t66y.com/*
// @match        https://www.t66y.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/555789/%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%20%E6%90%9C%E7%B4%A2%E6%A1%86%EF%BC%88%E9%99%90%E4%BA%8EAI%E7%A0%B4%E8%A7%A3%E5%8E%9F%E5%88%9B%E5%8C%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555789/%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%20%E6%90%9C%E7%B4%A2%E6%A1%86%EF%BC%88%E9%99%90%E4%BA%8EAI%E7%A0%B4%E8%A7%A3%E5%8E%9F%E5%88%9B%E5%8C%BA%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建搜索框容器
    var searchBoxContainer = document.createElement('div');
    searchBoxContainer.style.position = 'fixed';
    searchBoxContainer.style.top = '20px';
    searchBoxContainer.style.right = '20px';
    searchBoxContainer.style.zIndex = '9999';
    searchBoxContainer.style.backgroundColor = '#fff';
    searchBoxContainer.style.padding = '10px';
    searchBoxContainer.style.border = '1px solid #ccc';
    searchBoxContainer.style.borderRadius = '8px';
    searchBoxContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';

    // 创建搜索框输入框
    var searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '搜索AI破解原创区...';
    searchInput.style.padding = '8px';
    searchInput.style.border = '1px solid #ddd';
    searchInput.style.borderRadius = '4px';
    searchInput.style.width = '220px';
    searchInput.style.marginRight = '5px';

    // 创建搜索按钮
    var searchButton = document.createElement('button');
    searchButton.textContent = '搜索';
    searchButton.style.padding = '8px 12px';
    searchButton.style.border = 'none';
    searchButton.style.borderRadius = '4px';
    searchButton.style.backgroundColor = '#4285f4';
    searchButton.style.color = '#fff';
    searchButton.style.cursor = 'pointer';

    // 搜索函数（提取为函数，便于复用）
    function performSearch() {
        var query = searchInput.value.trim();
        if (query) {
            // 修改后的URL：限定到htm_data路径（帖子页面），支持www.t66y.com和t66y.com，使用"AI破解" "原创区"作为精确关键字 + 用户query
            var googleSearchURL = 'https://www.google.com/search?q=site%3Awww.t66y.com+OR+site%3At66y.com%20inurl%3Ahtm_data%20' +
                encodeURIComponent('"AI破解" "原创区" ') +
                encodeURIComponent(query);
            window.open(googleSearchURL, '_blank');
        }
    }

    // 点击按钮触发搜索
    searchButton.addEventListener('click', performSearch);

    // 按Enter键触发搜索（改进用户体验）
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // 将输入框和按钮添加到搜索框容器
    searchBoxContainer.appendChild(searchInput);
    searchBoxContainer.appendChild(searchButton);

    // 将搜索框容器添加到页面中
    document.body.appendChild(searchBoxContainer);

    // 给搜索框添加样式
    GM_addStyle(`
        input[type="text"] {
            font-size: 14px;
        }
        button {
            font-size: 14px;
            transition: background-color 0.2s;
        }
        button:hover {
            background-color: #357ae8;
        }
    `);
})();
