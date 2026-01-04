// ==UserScript==
// @name         NodeSeek 高级搜索 (自动主题)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为 NodeSeek 搜索结果页面添加高级功能，自动适配网站的亮色和暗色主题。
// @author       Gemini
// @match        https://www.nodeseek.com/search*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556152/NodeSeek%20%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%20%28%E8%87%AA%E5%8A%A8%E4%B8%BB%E9%A2%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556152/NodeSeek%20%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%20%28%E8%87%AA%E5%8A%A8%E4%B8%BB%E9%A2%98%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 样式定义 ---
    // 使用网站自身的CSS变量，实现主题自适应
    GM_addStyle(`
        #advanced-search-controls {
            background: var(--c-panel-bg);
            border: 1px solid var(--c-border-color);
            color: var(--c-text-color);
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        #advanced-search-controls h3 {
            margin-top: 0;
            margin-bottom: 10px;
            border-bottom: 1px solid var(--c-border-color);
            padding-bottom: 5px;
        }
        .control-group {
            margin-bottom: 10px;
        }
        .control-group label {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
        }
        .control-group input[type="text"],
        .control-group select {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
            background-color: var(--c-input-bg);
            border: 1px solid var(--c-input-border);
            border-radius: 3px;
            color: var(--c-text-color);
        }
        /* 适配下拉菜单选项的颜色 */
        .control-group select option {
            background-color: var(--c-panel-bg);
            color: var(--c-text-color);
        }
        #category-filters label {
            display: inline-block;
            margin-right: 15px;
            font-weight: normal;
        }
        #category-filters input {
            margin-right: 5px;
            vertical-align: middle;
        }
    `);

    // --- 创建高级搜索UI ---
    const controlPanel = document.createElement('div');
    controlPanel.id = 'advanced-search-controls';

    controlPanel.innerHTML = `
        <h3>高级搜索选项</h3>
        <div class="control-group">
            <label for="regex-filter">正则表达式标题过滤:</label>
            <input type="text" id="regex-filter" placeholder="例如: (OVH|KS-LE)">
        </div>
        <div class="control-group">
            <label for="user-filter">过滤用户 (用,分隔):</label>
            <input type="text" id="user-filter" placeholder="例如: user1,user2">
        </div>
        <div class="control-group">
            <label for="custom-sort">自定义排序:</label>
            <select id="custom-sort">
                <option value="default">默认排序</option>
                <option value="comments-desc">评论数 (降序)</option>
                <option value="comments-asc">评论数 (升序)</option>
            </select>
        </div>
        <div class="control-group">
            <label>板块过滤:</label>
            <div id="category-filters"></div>
        </div>
    `;

    // --- 插入UI到页面 ---
    const postListControler = document.querySelector('.post-list-controler');
    if (postListControler) {
        postListControler.parentNode.insertBefore(controlPanel, postListControler.nextSibling);
    } else {
        // 如果找不到控制器，就插入到帖子列表前
        const postList = document.querySelector('.post-list');
        if(postList) {
            postList.parentNode.insertBefore(controlPanel, postList);
        }
    }

    // --- 提取并创建板块过滤器 ---
    const categories = new Set();
    document.querySelectorAll('.post-list-item .post-category').forEach(el => {
        const categoryText = el.innerText.trim();
        if (categoryText) {
            categories.add(categoryText);
        }
    });

    const categoryFiltersContainer = document.getElementById('category-filters');
    if(categoryFiltersContainer) {
        categories.forEach(category => {
            const checkboxLabel = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkbox.value = category;
            checkbox.className = 'category-filter-cb';
            checkboxLabel.appendChild(checkbox);
            checkboxLabel.appendChild(document.createTextNode(` ${category}`));
            categoryFiltersContainer.appendChild(checkboxLabel);
        });
    }


    // --- 获取所有帖子元素 ---
    const postList = document.querySelector('.post-list');
    if (!postList) return; // 如果没有帖子列表，则退出脚本

    const posts = Array.from(postList.querySelectorAll('.post-list-item'));
    if (posts.length === 0) return; // 如果没有帖子，也退出

    // 将原始顺序存储起来，用于恢复默认排序
    const originalPostsOrder = [...posts];


    // --- 核心过滤和排序函数 ---
    function applyFiltersAndSort() {
        const regexFilter = document.getElementById('regex-filter').value;
        const userFilter = document.getElementById('user-filter').value.split(',').map(u => u.trim().toLowerCase()).filter(u => u);
        const sortValue = document.getElementById('custom-sort').value;

        const checkedCategories = Array.from(document.querySelectorAll('.category-filter-cb:checked')).map(cb => cb.value);

        // 1. 应用过滤器
        posts.forEach(post => {
            const titleEl = post.querySelector('.post-title a');
            const userEl = post.querySelector('.info-author a');
            const categoryEl = post.querySelector('.post-category');

            // 健壮性检查，确保元素存在
            if (!titleEl || !userEl || !categoryEl) {
                post.style.display = ''; // 如果帖子结构不完整，则不隐藏
                return;
            }

            const title = titleEl.innerText;
            const user = userEl.innerText.trim().toLowerCase();
            const category = categoryEl.innerText.trim();

            let show = true;

            // 正则表达式过滤
            if (regexFilter) {
                try {
                    const regex = new RegExp(regexFilter, 'i');
                    if (!regex.test(title)) {
                        show = false;
                    }
                } catch (e) {
                    // 无效的正则表达式时，不在控制台报错，可以在输入框给提示
                }
            }

            // 用户过滤
            if (userFilter.length > 0 && userFilter.includes(user)) {
                show = false;
            }

            // 板块过滤
            if (!checkedCategories.includes(category)) {
                show = false;
            }

            post.style.display = show ? '' : 'none';
        });

        // 2. 应用排序
        let postsToSort = [...posts]; // 从原始帖子数组创建副本进行排序

        if (sortValue !== 'default') {
            postsToSort.sort((a, b) => {
                const commentsElA = a.querySelector('.info-comments-count span');
                const commentsElB = b.querySelector('.info-comments-count span');
                const commentsA = commentsElA ? (parseInt(commentsElA.title.split(' ')[0]) || 0) : 0;
                const commentsB = commentsElB ? (parseInt(commentsElB.title.split(' ')[0]) || 0) : 0;

                return sortValue === 'comments-desc' ? commentsB - commentsA : commentsA - commentsB;
            });
            // 重新排列DOM
            postsToSort.forEach(post => postList.appendChild(post));
        } else {
            // 恢复默认排序
             originalPostsOrder.forEach(post => postList.appendChild(post));
        }
    }

    // --- 添加事件监听器 ---
    const regexInput = document.getElementById('regex-filter');
    if (regexInput) regexInput.addEventListener('input', applyFiltersAndSort);

    const userInput = document.getElementById('user-filter');
    if (userInput) userInput.addEventListener('input', applyFiltersAndSort);

    const sortSelect = document.getElementById('custom-sort');
    if (sortSelect) sortSelect.addEventListener('change', applyFiltersAndSort);

    document.querySelectorAll('.category-filter-cb').forEach(cb => {
        cb.addEventListener('change', applyFiltersAndSort);
    });

})();