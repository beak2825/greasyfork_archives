// ==UserScript==
// @name         RunningHub 工作台-'我的工作流'分类展示
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  按前缀对工作流进行分类展示，支持页面切换后自动重建. ps: 如果不生效可以刷新页面
// @description:如果需要分类的名称和分类对应的前缀可以在"分类前缀映射"对应map容器进行修改(大概在103行那边). 如果有对颜色和样式不喜欢的,自行修改css,各类定义已经加上.
// @description:version1.1修复了下切换路由时的问题.
// @author       撸兄
// @match        https://www.runninghub.cn/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548366/RunningHub%20%E5%B7%A5%E4%BD%9C%E5%8F%B0-%27%E6%88%91%E7%9A%84%E5%B7%A5%E4%BD%9C%E6%B5%81%27%E5%88%86%E7%B1%BB%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/548366/RunningHub%20%E5%B7%A5%E4%BD%9C%E5%8F%B0-%27%E6%88%91%E7%9A%84%E5%B7%A5%E4%BD%9C%E6%B5%81%27%E5%88%86%E7%B1%BB%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 防止重复执行
    if (window.RunningHubScriptLoaded) return;
    window.RunningHubScriptLoaded = true;

    console.log('[Tampermonkey] 脚本已注入，支持路由切换');

    // 添加自定义CSS
    GM_addStyle(`
	    /* ----------------------------------------
	       区域：分类容器内所有元素的默认样式
	       作用：统一设置分类项中的文字颜色和背景色
	    ------------------------------------------- */
	    .custom-category-item,
	    .custom-category-item * {
	        color: #333 !important;           /* 文字颜色：深灰色 */
	        background-color: #090b0c !important;  /* 背景颜色：深灰 */
	    }

	    /* ----------------------------------------
	       区域：单个工作流项目（每条工作流）
	       作用：控制每个工作流在列表中的外观
	    ------------------------------------------- */
	    .workflow-item {
	        margin-bottom: 8px !important;    /* 下边距：与其他项目保持间距 */
	        padding: 4px 0 !important;        /* 内边距：上下留白，避免文字贴边 */

	        /* 可选样式：可取消注释以启用 */
	        background-color: #efefef !important;   /* 背景颜色：浅灰色 */
	        border-radius: 4px !important;          /* 圆角 */
	        border-left: 4px solid #090b0c !important; /* 左侧色条：宽度4px，颜色为深黑 */
	    }

	    /* ----------------------------------------
	       区域：工作流内的文字元素
	       作用：确保标题、标签等文字颜色正确显示
	    ------------------------------------------- */
	    .workflow-item .workflow-title,
	    .workflow-item span,
	    .workflow-item div {
	        color: #333 !important;           /* 文字颜色：深灰色 */
	        background-color: transparent !important; /* 背景透明 */
	    }

	    /* ----------------------------------------
	       区域：工作流内所有子元素
	       作用：防止透明度或阴影影响显示效果
	    ------------------------------------------- */
	    .workflow-item * {
	        opacity: 1 !important;            /* 不透明：防止被设置为半透明 */
	        text-shadow: none !important;     /* 无文字阴影：避免模糊或发光效果 */
	    }

	    /* ----------------------------------------
	       区域：分类标题栏（如“文生图”）
	       作用：设置分类头的背景、文字、交互样式
	    ------------------------------------------- */
	    .custom-category-header {
	        background-color: #252a2f !important;  /* 背景颜色：深灰蓝，质感高级 */
	        color: white !important;               /* 文字颜色：白色，与深背景形成对比 */
	        padding: 12px 16px;                    /* 内边距：标题内容与边框留白 */
	        font-weight: bold;                     /* 加粗字体：突出标题 */
	        cursor: pointer;                       /* 鼠标指针：显示可点击 */
	        display: flex;                         /* 弹性布局：方便对齐内容 */
	        justify-content: space-between;        /* 横向分布：内容两端对齐 */
	        align-items: center;                   /* 垂直居中：图标与文字对齐 */
	        font-size: 15px;                       /* 字体大小：略大于默认 */
	        border-bottom: 1px solid #ddd;         /* 下边框：浅灰色分隔线 */
	    }

	    /* 鼠标悬停时的标题背景色 */
	    .custom-category-header:hover {
	        background-color: #1d3131 !important;  /* 悬停背景：深绿色调，提示可交互 */
	    }

	    /* ----------------------------------------
	       区域：分类展开内容区域
	       作用：设置折叠面板的背景和边框
	    ------------------------------------------- */
	    .custom-category-content {
	        display: none;                         /* 默认隐藏：点击标题后才显示 */
	        padding: 12px;                         /* 内边距：内容与边框留白 */
	        background-color: #090b0c !important;  /* 背景颜色：与分类项一致的深黑背景 */
	        border-top: 1px dashed #ddd;           /* 上边框：虚线，视觉上区分标题与内容 */
	    }
	`);

    // 分类前缀映射
    const categoryMap = {
        'A_': '文生图',
        'B_': '图生图',
        'C_': '图生视频',
        'D_': '文生视频',
        'E_': '综合功能',
        'F_': 'NSFW',
        'G_': '待测试'
    };

    // 重建工作流分类列表
    function rebuildWorkflowList() {
        const container = document.querySelector('.workflow-list') ||
                         document.querySelector('.list-container') ||
                         document.querySelector('.workspace-content');

        if (!container) {
            console.warn('⚠️ 工作流容器未找到，可能页面未加载完成');
            return;
        }

        const items = container.querySelectorAll('.workflow-item');
        if (items.length === 0) {
            console.log('⚠️ 无工作流项目，跳过分类');
            return;
        }

        // 清空原有分类结构（防止重复添加）
        if (container.querySelector('.custom-category-header')) {
            return; // 已分类，避免重复
        }

        console.log('✅ 开始重建分类列表...');

        // 按前缀分组
        const groups = {};
        items.forEach(item => {
            const titleEl = item.querySelector('.workflow-title');
            const name = titleEl ? titleEl.textContent.trim() : '';
            let prefix = 'other';

            for (const key in categoryMap) {
                if (name.startsWith(key)) {
                    prefix = key;
                    break;
                }
            }
            const catKey = prefix === 'other' ? 'other' : prefix;
            if (!groups[catKey]) groups[catKey] = [];
            groups[catKey].push(item);
        });

        // 构建新结构
        const newContainer = document.createElement('div');
        newContainer.style.marginTop = '20px';

        for (const key in groups) {
            const categoryName = categoryMap[key] || '暂未分类';
            const count = groups[key].length;

            const groupDiv = document.createElement('div');
            groupDiv.style.marginBottom = '20px';
            groupDiv.style.borderRadius = '8px';
            groupDiv.style.overflow = 'hidden';

            const header = document.createElement('div');
            header.className = 'custom-category-header';
            header.textContent = `${categoryName} (${count})`;

            const content = document.createElement('div');
            content.className = 'custom-category-content';
            content.style.display = 'none'; // 🔴 默认收起

            // 批量插入
            const fragment = document.createDocumentFragment();
            groups[key].forEach(item => {
                item.classList.add('custom-category-item');
                fragment.appendChild(item);
            });
            content.appendChild(fragment);

            // 点击切换展开/收起
            header.addEventListener('click', () => {
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? 'block' : 'none';
                header.classList.toggle('expanded', !isHidden);
            });

            groupDiv.appendChild(header);
            groupDiv.appendChild(content);
            newContainer.appendChild(groupDiv);
        }

        // 替换原内容
        container.innerHTML = '';
        container.appendChild(newContainer);

        console.log('✅ 分类列表重建完成（默认收起）');
    }

    // 监听 DOM 变化
    function observeWorkflowList() {
        const observer = new MutationObserver(() => {
            setTimeout(rebuildWorkflowList, 100);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 监听路由变化（支持 SPA）
    function watchRouteChanges() {
        // 监听 history.pushState 和 replaceState
        ['pushState', 'replaceState'].forEach(method => {
            const original = history[method];
            history[method] = function (...args) {
                const result = original.apply(this, args);
                setTimeout(checkAndRebuild, 100);
                return result;
            };
        });

        // 监听 popstate（浏览器前进后退）
        window.addEventListener('popstate', checkAndRebuild);

        // 初次加载检查
        setTimeout(checkAndRebuild, 500);
    }

    function checkAndRebuild() {
        // 只在 workspace 页面执行
        if (window.location.pathname === '/workspace') {
            setTimeout(rebuildWorkflowList, 500);
        }
    }

    // 启动逻辑
    (function init() {
        // 如果当前是 workspace 页面，立即尝试
        if (window.location.pathname === '/workspace') {
            setTimeout(rebuildWorkflowList, 1000);
            observeWorkflowList();
        }

        // 开启路由监听
        watchRouteChanges();
    })();
})();