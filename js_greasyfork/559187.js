// ==UserScript==
// @name         BuddhaSpace Super Tools (搜繁体 + 读简体)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  1.输入简体自动转繁体搜索 2.一键切换整个网页的简繁体
// @author       You
// @match        *://buddhaspace.org/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559187/BuddhaSpace%20Super%20Tools%20%28%E6%90%9C%E7%B9%81%E4%BD%93%20%2B%20%E8%AF%BB%E7%AE%80%E4%BD%93%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559187/BuddhaSpace%20Super%20Tools%20%28%E6%90%9C%E7%B9%81%E4%BD%93%20%2B%20%E8%AF%BB%E7%AE%80%E4%BD%93%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置部分 ===
    // 按钮样式
    const BTN_STYLE = `
        margin-left: 6px;
        padding: 2px 8px;
        cursor: pointer;
        font-size: 14px;
        border: 1px solid #aaa;
        background-color: #f0f0f0;
        border-radius: 3px;
    `;

    // === 核心逻辑 ===

    // 1. 检查库是否加载
    if (typeof OpenCC === 'undefined') {
        console.error('OpenCC 库加载失败，请检查网络 (cdn.jsdelivr.net)');
        return;
    }

    // 定义转换器
    // s2t: 简体 -> 繁体 (用于搜索)
    const converterS2T = OpenCC.Converter({ from: 'cn', to: 't' });
    // t2s: 繁体 -> 简体 (用于阅读网页)
    const converterT2S = OpenCC.Converter({ from: 't', to: 'cn' });

    // 页面状态标记：默认为繁体(false)，点击后变为简体(true)
    let isPageSimplified = false;

    // 2. 智能等待元素出现 (解决页面加载慢的问题)
    let checkTimer = setInterval(function() {
        const searchInput = document.getElementById('keyword');
        if (searchInput) {
            clearInterval(checkTimer);
            initButtons(searchInput);
        }
    }, 200);

    // 3. 初始化按钮
    function initButtons(searchInput) {
        // 防止重复添加
        if (document.getElementById('btn-smart-search')) return;

        // 寻找插入位置：如果有原生的查询按钮，插在它后面；否则插在输入框后面
        const searchForm = document.getElementById('input'); // 网站原本的form id
        const originalBtn = searchForm ? searchForm.querySelector('input[type="submit"]') : null;
        const targetParent = originalBtn ? originalBtn.parentNode : searchInput.parentNode;
        const targetRef = originalBtn ? originalBtn.nextSibling : searchInput.nextSibling;

        // --- 按钮 A：智能搜索 (简->繁) ---
        const btnSearch = document.createElement('span'); // 用 span 模拟按钮防止触发表单默认提交
        btnSearch.id = 'btn-smart-search';
        btnSearch.innerText = '🔍 搜(转繁体)';
        btnSearch.style.cssText = BTN_STYLE + "background-color: #e6f7ff; color: #0050b3; border-color: #91d5ff;";

        btnSearch.onclick = async function() {
            let text = searchInput.value;
            if (!text.trim()) return;

            btnSearch.innerText = '转换中...';
            try {
                const convert = await converterS2T;
                searchInput.value = convert(text);

                // 触发搜索
                if (originalBtn) originalBtn.click();
                else if (searchForm) searchForm.submit();
            } catch (e) {
                alert('转换失败：' + e);
                btnSearch.innerText = '🔍 搜(转繁体)';
            }
        };

        // --- 按钮 B：全页切换 (繁<->简) ---
        const btnToggle = document.createElement('span');
        btnToggle.id = 'btn-page-toggle';
        btnToggle.innerText = '🔁 转成简体阅读'; // 默认提示
        btnToggle.style.cssText = BTN_STYLE + "background-color: #f6ffed; color: #389e0d; border-color: #b7eb8f;";

        btnToggle.onclick = async function() {
            btnToggle.innerText = '处理中...';

            try {
                // 根据当前状态选择转换方向
                // 如果当前是繁体(false)，我们要转简体(t2s)
                // 如果当前是简体(true)，我们要转回繁体(s2t)
                const converter = isPageSimplified ? await converterS2T : await converterT2S;
                const convertFunc = converter;

                // 遍历页面所有文本节点进行转换 (排除 script 和 style)
                walkAndConvert(document.body, convertFunc);

                // 切换状态标记
                isPageSimplified = !isPageSimplified;

                // 更新按钮文字
                btnToggle.innerText = isPageSimplified ? '🔁 恢复繁体原貌' : '🔁 转成简体阅读';

            } catch (e) {
                console.error(e);
                btnToggle.innerText = '切换失败';
            }
        };

        // 插入到页面
        // 稍微加点间距
        const spacer = document.createTextNode(" ");
        targetParent.insertBefore(spacer, targetRef);
        targetParent.insertBefore(btnSearch, targetRef);

        const spacer2 = document.createTextNode(" ");
        targetParent.insertBefore(spacer2, targetRef);
        targetParent.insertBefore(btnToggle, targetRef);
    }

    // 辅助函数：遍历 DOM 转换文字
    function walkAndConvert(node, convertFunc) {
        if (node.nodeType === 3) { // 文本节点
            // 只有非空文本才转换
            if (node.nodeValue.trim() !== '') {
                node.nodeValue = convertFunc(node.nodeValue);
            }
        } else if (node.nodeType === 1) { // 元素节点
            // 跳过输入框、脚本、样式表，防止破坏功能
            if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(node.tagName)) return;

            // 递归遍历子节点
            for (let i = 0; i < node.childNodes.length; i++) {
                walkAndConvert(node.childNodes[i], convertFunc);
            }
        }
    }

})();