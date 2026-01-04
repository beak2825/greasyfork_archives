// ==UserScript==
// @name         YouTube to Google Site Search (Complete)
// @name:zh-CN   YouTube 搜索重定向至 Google (完整版)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Redirects ALL YouTube searches (Enter key, search button, suggestions) to a Google search with "site:youtube.com" in a new tab.
// @description:zh-CN [完整版] 将 YouTube 的所有搜索行为（按回车、点击搜索按钮、点击搜索建议）均重定向到新的谷歌标签页，并限定在 youtube.com 范围内搜索。
// @author       Gemini & Your Name
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553397/YouTube%20to%20Google%20Site%20Search%20%28Complete%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553397/YouTube%20to%20Google%20Site%20Search%20%28Complete%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用定时器重复检测，以应对 YouTube 的动态加载机制
    const interval = setInterval(initializeSearchOverride, 500);

    function initializeSearchOverride() {
        // 1. 选取所有需要的元素
        const searchForm = document.querySelector('form.ytSearchboxComponentSearchForm');
        const searchInput = document.querySelector('input.ytSearchboxComponentInput');
        const searchButton = document.querySelector('button.ytSearchboxComponentSearchButton');
        const suggestionsContainer = document.querySelector('div.ytSearchboxComponentSuggestionsContainer');

        // 如果找到了所有元素，并且它们还没有被我们的脚本处理过
        if (searchForm && searchInput && searchButton && suggestionsContainer && !searchForm.dataset.searchOverrideActive) {

            console.log("YouTube 搜索脚本：检测到搜索组件，正在应用最终版修改...");

            // --- 核心功能函数 ---

            function performGoogleSiteSearch(query) {
                if (query && typeof query === 'string' && query.trim()) {
                    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query.trim())}+site:youtube.com`;
                    window.open(googleSearchUrl, '_blank');
                }
            }

            function universalSearchOverride(event) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                return false;
            }

            // --- 事件处理器 ---

            // A. 处理“搜索按钮点击”和“表单提交”(作为备用)
            function handleFormSubmit(event) {
                universalSearchOverride(event);
                const query = searchInput.value;
                performGoogleSiteSearch(query);
                searchInput.blur();
            }

            // B.【新增】处理“在输入框中按回车键”
            function handleInputKeydown(event) {
                // 只在按下 Enter 键时触发
                if (event.key === 'Enter') {
                    universalSearchOverride(event);
                    const query = searchInput.value;
                    performGoogleSiteSearch(query);
                    searchInput.blur();
                }
            }

            // C. 处理“推荐列表点击”
            function handleSuggestionClick(event) {
                const suggestionItem = event.target.closest('div.ytSuggestionComponentSuggestion');
                if (suggestionItem) {
                    universalSearchOverride(event);
                    const queryElement = suggestionItem.querySelector('[aria-label]');
                    if (queryElement) {
                        const query = queryElement.getAttribute('aria-label');
                        performGoogleSiteSearch(query);
                        suggestionsContainer.setAttribute('hidden', '');
                        searchInput.value = query;
                        searchInput.blur();
                    }
                }
            }

            // --- 绑定所有事件 (全部使用捕获模式 `true`) ---

            // 1. 监听输入框的回车键【这是本次的关键修复】
            searchInput.addEventListener('keydown', handleInputKeydown, true);

            // 2. 监听表单提交 (作为备用)
            searchForm.addEventListener('submit', handleFormSubmit, true);

            // 3. 监听搜索按钮点击
            searchButton.addEventListener('click', handleFormSubmit, true);

            // 4. 监听推荐列表点击
            suggestionsContainer.addEventListener('mousedown', handleSuggestionClick, true);
            suggestionsContainer.addEventListener('click', handleSuggestionClick, true);


            // --- 标记为已处理，防止重复绑定 ---
            searchForm.dataset.searchOverrideActive = 'true';
            console.log("YouTube 搜索脚本：所有修改应用成功！现在回车键也能正常工作。");
        }
    }
})();