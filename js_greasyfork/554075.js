// ==UserScript==
// @name         小黑盒帖子关键词过滤器 (优化版)
// @namespace    https://heybox.com/
// @version      1.1
// @description  自动隐藏包含特定关键词的帖子（标题或正文匹配），数据持久化存储。
// @match        https://www.xiaoheihe.cn/app/bbs/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554075/%E5%B0%8F%E9%BB%91%E7%9B%92%E5%B8%96%E5%AD%90%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4%E5%99%A8%20%28%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554075/%E5%B0%8F%E9%BB%91%E7%9B%92%E5%B8%96%E5%AD%90%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4%E5%99%A8%20%28%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "hb_block_keywords";
    const HIDDEN_ATTR = "data-hidden-by-script";
    let debounceTimer;

    // --- 工具函数 ---

    /**
     * 异步从油猴脚本存储中加载关键词列表
     * @returns {Promise<string[]>} 关键词数组
     */
    async function loadKeywords() {
        // GM_getValue 会自动处理反序列化，默认返回一个空数组
        return await GM_getValue(STORAGE_KEY, []);
    }

    /**
     * 异步将关键词列表存入油猴脚本存储
     * @param {string[]} list 关键词数组
     */
    async function saveKeywords(list) {
        // GM_setValue 会自动处理序列化
        await GM_setValue(STORAGE_KEY, list);
    }

    /**
     * 创建管理按钮UI
     */
    function createButtonUI() {
        const btn = document.createElement("div");
        btn.textContent = "关键词管理";
        btn.style.position = "fixed";
        btn.style.top = "20px";
        btn.style.right = "20px";
        btn.style.zIndex = "9999";
        btn.style.padding = "8px 12px";
        btn.style.background = "#3c9ce9";
        btn.style.color = "#fff";
        btn.style.borderRadius = "8px";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "14px";
        btn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
        btn.style.userSelect = "none";

        btn.onclick = showKeywordManager; // showKeywordManager 现在是异步的
        document.body.appendChild(btn);
    }

    /**
     * 显示关键词管理弹窗（异步）
     */
    async function showKeywordManager() {
        const keywords = await loadKeywords();
        const newWord = prompt(`当前关键词：${keywords.join(", ") || "(无)"}\n请输入要添加的关键词（或输入 -词语 删除）：`);
        if (!newWord) return;

        let updated = [...keywords];
        const trimmedWord = newWord.trim(); // 提前处理

        if (trimmedWord.startsWith('-')) {
            // 删除关键词
            const wordToRemove = trimmedWord.slice(1).trim();
            if (!wordToRemove) {
                alert("要删除的关键词不能为空。");
                return;
            }
            updated = updated.filter(k => k !== wordToRemove);
            alert(`已删除关键词：${wordToRemove}`);
        } else {
            // 添加关键词
            if (!trimmedWord) {
                alert("关键词不能为空。");
                return;
            }
            if (!updated.includes(trimmedWord)) {
                updated.push(trimmedWord);
                alert(`已添加关键词：${trimmedWord}`);
            } else {
                alert("该关键词已存在。");
            }
        }
        await saveKeywords(updated);
        await filterPosts(); // 立即执行一次过滤
    }

    // --- 主逻辑 ---

    /**
     * 过滤帖子（异步）
     */
    async function filterPosts() {
        const keywords = await loadKeywords();
        const keywordsLower = keywords.map(k => k.toLowerCase()); // 预先转为小写

        document.querySelectorAll('a.hb-cpt__bbs-content').forEach(post => {
            const title = post.querySelector('.bbs-content__title')?.innerText || '';
            const content = post.querySelector('.bbs-content__content')?.innerText || '';
            const text = (title + content).toLowerCase();

            let shouldHide = false;
            if (keywordsLower.length > 0) {
                shouldHide = keywordsLower.some(k => text.includes(k));
            }

            if (shouldHide) {
                // 隐藏
                post.style.display = 'none';
                post.setAttribute(HIDDEN_ATTR, 'true');
            } else if (post.getAttribute(HIDDEN_ATTR)) {
                // 如果之前被隐藏了，但现在不需要隐藏，则恢复显示
                post.style.display = ''; // 恢复默认显示
                post.removeAttribute(HIDDEN_ATTR);
            }
        });
    }

    /**
     * 防抖函数，用于优化 MutationObserver
     */
    function debounceFilter() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            filterPosts();
        }, 500); // 500ms 延迟
    }

    /**
     * 监听动态加载内容
     */
    function observeDynamicContent() {
        const observer = new MutationObserver(() => {
            // 不直接调用 filterPosts()，而是调用防抖函数
            debounceFilter();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- 启动 ---
    window.addEventListener('load', () => {
        createButtonUI();
        filterPosts(); // 页面加载后立即执行一次
        observeDynamicContent();
    });
})();