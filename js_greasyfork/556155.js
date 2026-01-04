// ==UserScript==
// @name         XXL-Job_Select_Search
// @namespace    https://github.com/HardBrick21
// @version      1.2
// @description  为XXL-Job的原生Select下拉框添加搜索功能（基于Choices.js）
// @author       HLX
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556155/XXL-Job_Select_Search.user.js
// @updateURL https://update.greasyfork.org/scripts/556155/XXL-Job_Select_Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 注入Choices.js的CSS样式
    const choicesCSS = document.createElement('link');
    choicesCSS.rel = 'stylesheet';
    choicesCSS.href = 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css';
    document.head.appendChild(choicesCSS);

    // 2. 注入Choices.js的核心JS
    const choicesJS = document.createElement('script');
    choicesJS.src = 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js';
    choicesJS.onload = initChoices; // JS加载完成后初始化
    document.head.appendChild(choicesJS);

    // 3. 初始化所有原生Select
    function initChoices() {
        // 选择所有需要增强的Select（排除已初始化的）
        const selects = document.querySelectorAll('select#jobGroup');

        selects.forEach(select => {
            // 初始化Choices.js，配置搜索功能
            new Choices(select, {
                searchEnabled: true,          // 启用搜索
                searchPlaceholderValue: '输入关键词搜索...', // 搜索框占位符
                placeholder: true,            // 显示默认占位符
                placeholderValue: '请选择...', // 默认占位符文本
                shouldSort: false,            // 保持选项原顺序（不自动排序）
                itemSelectText: ''            // 隐藏选中项的额外文本（如"已选"）
            });

            // 标记为已初始化，避免重复处理
            select.classList.add('choices-initialized');
        });
    }

})();

