// ==UserScript==
// @name         NodeSeek屏蔽器
// @version      1.1
// @description  在NodeSeek网站通过目录和关键词屏蔽不想看到的帖子
// @author       Laurent
// @match        https://www.nodeseek.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @namespace https://greasyfork.org/users/1546201
// @downloadURL https://update.greasyfork.org/scripts/558400/NodeSeek%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558400/NodeSeek%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 默认配置 =================
    // 如果第一次安装，默认屏蔽列表如下
    const DEFAULT_CATEGORIES = "";
    const DEFAULT_KEYWORDS = "";

    // ================= 读取配置 =================
    function getBlockedCategories() {
        let val = GM_getValue("blocked_categories", DEFAULT_CATEGORIES);
        return splitInput(val);
    }

    function getBlockedKeywords() {
        let val = GM_getValue("blocked_keywords", DEFAULT_KEYWORDS);
        return splitInput(val);
    }

    // 辅助函数：将逗号分隔的字符串转为数组，并去空格
    function splitInput(str) {
        if (!str) return [];
        // 支持中文逗号和英文逗号
        return str.replace(/，/g, ',').split(',').map(s => s.trim()).filter(s => s !== "");
    }

    // ================= 菜单配置功能 =================
    function configureCategories() {
        let currentVal = GM_getValue("blocked_categories", DEFAULT_CATEGORIES);
        let newVal = prompt("请输入要屏蔽的【目录名称】，用逗号隔开：\n(如：推广, 曝光, 交易)", currentVal);
        if (newVal !== null) {
            GM_setValue("blocked_categories", newVal);
            alert("目录屏蔽设置已保存！刷新页面生效。");
            location.reload();
        }
    }

    function configureKeywords() {
        let currentVal = GM_getValue("blocked_keywords", DEFAULT_KEYWORDS);
        let newVal = prompt("请输入要屏蔽的【标题关键词】，用逗号隔开：\n(如：商家, 广告, 便宜)", currentVal);
        if (newVal !== null) {
            GM_setValue("blocked_keywords", newVal);
            alert("关键词屏蔽设置已保存！刷新页面生效。");
            location.reload();
        }
    }

    // 注册菜单
    GM_registerMenuCommand("🚫 设置屏蔽目录", configureCategories);
    GM_registerMenuCommand("🚫 设置屏蔽关键词", configureKeywords);

    // ================= 核心屏蔽逻辑 =================
    /**
     * 检查并处理单个帖子元素
     */
    function checkAndBlock(item) {
        if (!item || item.getAttribute('data-blocked') === 'true') return;

        // 获取当前最新的屏蔽列表
        const blockedCats = getBlockedCategories();
        const blockedKws = getBlockedKeywords();

        // 1. 获取分类名称
        const categoryElem = item.querySelector('.post-category');
        let categoryName = '';
        if (categoryElem) {
            categoryName = categoryElem.innerText.trim();
        }

        // 2. 获取标题文字
        const titleElem = item.querySelector('.post-title a');
        let titleText = '';
        if (titleElem) {
            titleText = titleElem.innerText.trim();
        }

        // --- 判定逻辑 ---

        // A. 检查目录
        if (blockedCats.includes(categoryName)) {
            item.style.display = 'none';
            item.setAttribute('data-blocked', 'true'); // 标记已处理
            console.log(`[Blocker] 已屏蔽目录 [${categoryName}]: ${titleText}`);
            return;
        }

        // B. 检查关键词
        const lowerTitle = titleText.toLowerCase();
        for (const keyword of blockedKws) {
            if (lowerTitle.includes(keyword.toLowerCase())) {
                item.style.display = 'none';
                item.setAttribute('data-blocked', 'true'); // 标记已处理
                console.log(`[Blocker] 已屏蔽关键词 [${keyword}]: ${titleText}`);
                return;
            }
        }
    }

    /**
     * 执行屏蔽
     */
    function runBlocker() {
        const items = document.querySelectorAll('li.post-list-item');
        items.forEach(checkAndBlock);
    }

    // 1. 初始执行
    runBlocker();

    // 2. 监听动态加载 (瀑布流/翻页)
    const observer = new MutationObserver((mutations) => {
        let shouldRun = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && (node.classList.contains('post-list-item') || node.querySelector('.post-list-item'))) {
                        shouldRun = true;
                    }
                });
            }
        });
        if (shouldRun) {
            runBlocker();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();