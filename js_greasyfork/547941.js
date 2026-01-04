// ==UserScript==
// @name         Google 汉化脚本
// @namespace    http://tampermonkey.net/
// @version      2.4
// @license      MIT
// @description  通过查找并替换文本的方式，稳定地将 Google 搜索结果页面的主要界面元素汉化
// @author       Gemini
// @match        https://www.google.com/*
// @match        https://www.google.com.hk/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547941/Google%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/547941/Google%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const translations = {
        // Exact matches (fast and safe)
        'About': '关于',
        'Next': '下一页',
        'Store': '商店',
        'Previous': '以前的',
        'Help': '帮助',
        'Web': '网络',
        'Forums': '论坛',
        'Advanced Search': '高级搜索',
        'Show more images': '显示更多图像',
        'Translate this page': '翻译此页面',
        'Advertising': '广告',
        'Business': '商业',
        'How Search works': '搜索的工作原理',
        'Meet AI Mode': '认识 AI 模式',
        'Ask detailed questions for better responses': '提出详细的问题以获得更好的答复',
        'All': '全部',
        'Images': '图片',
        'Videos': '视频',
        'News': '新闻',
        'Shopping': '购物',
        'Maps': '地图',
        'Books': '图书',
        'Flights': '航班',
        'Finance': '财经',
        'More': '更多',
        'AI Mode': 'AI 搜索',
        'Short videos': '短视频',
        'Tools': '工具',
        'Any time': '所有时间',
        'Past hour': '过去1小时',
        'Past 24 hours': '过去24小时',
        'Past week': '过去一周',
        'Past month': '过去一个月',
        'Past year': '过去一年',
        'All results': '所有结果',
        'Verbatim': '精确匹配',
        'Search tools': '搜索工具',
        'Clear': '清除',
        'Settings': '设置',
        'Search settings': '搜索设置',
        'Advanced search': '高级搜索',
        'Your data in Search': '您在 Google 搜索中的数据',
        'Search history': '搜索历史记录',
        'Search help': '搜索帮助',
        'Send feedback': '发送反馈',
        'Privacy': '隐私权',
        'Terms': '条款',
        'Ask anything': '提出任何问题',

        // Partial matches (requires special handling)
        'Missing:': '缺少:',
        '| Show results with:': '| 显示结果:',
    };

    const transKeys = Object.keys(translations);

    function translatePage() {
        // === 策略 1: 翻译常规元素文本 ===
        const elements = document.querySelectorAll('a, span, div, button');
        elements.forEach(el => {
            const originalText = el.textContent.trim();
            if (transKeys.includes(originalText) && el.children.length === 0) {
                el.textContent = translations[originalText];
            }
        });

        // === 策略 2: 翻译输入框的占位符 (placeholder) ===
        const placeholders = document.querySelectorAll('input[placeholder], textarea[placeholder]');
        placeholders.forEach(el => {
            const originalText = el.getAttribute('placeholder').trim();
            if (transKeys.includes(originalText)) {
                el.setAttribute('placeholder', translations[originalText]);
            }
        });

        // === 策略 3: 翻译不完整的文本节点 (Text Nodes) ===
        const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = treeWalker.nextNode()) {
            const text = node.nodeValue;
            // 检查部分匹配的键
            if (text.includes('| Show results with:')) {
                node.nodeValue = text.replace('| Show results with:', translations['| Show results with:']);
            }
            if (text.includes('Missing:')) {
                node.nodeValue = text.replace('Missing:', translations['Missing:']);
            }
        }
    }

    // 使用 MutationObserver 来监控页面的动态变化
    const observer = new MutationObserver(() => {
        clearTimeout(observer.debounce);
        observer.debounce = setTimeout(translatePage, 300);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始加载时执行一次
    translatePage();

})();