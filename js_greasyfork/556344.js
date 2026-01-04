// ==UserScript==
// @name        豆瓣影片快速搜索
// @version     1.0
// @description 在豆瓣影片标题旁添加夸克、音范丝、BT之家搜索按钮
// @author      qiqikuka
// @match       https://movie.douban.com/subject/*
// @license     MIT
// @grant       GM_addStyle
// @namespace https://greasyfork.org/users/1273334
// @downloadURL https://update.greasyfork.org/scripts/556344/%E8%B1%86%E7%93%A3%E5%BD%B1%E7%89%87%E5%BF%AB%E9%80%9F%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/556344/%E8%B1%86%E7%93%A3%E5%BD%B1%E7%89%87%E5%BF%AB%E9%80%9F%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 注入按钮样式（优化垂直对齐+蓝色背景+纯白文字+hover弥散投影）
    GM_addStyle(`
        /* 通用按钮样式 - 强制纯白文字+明确背景色+垂直居中 */
        .custom-search-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-left: 10px;
            margin-top: -5px;
            padding: 4px 12px;
            border-radius: 20px; /* 圆角按钮 */
            background-color: #4B8CC8 !important; /* 正常状态蓝色背景 */
            color: #ffffff !important; /* 强制纯白文字 */
            text-decoration: none !important;
            cursor: pointer;
            opacity: 0.9;
            transition: opacity 0.2s, background-color 0.2s, box-shadow 0.2s; /* 平滑过渡 */
            border: none !important;
            outline: none !important;
            box-shadow: none !important; /* normal状态无投影 */
            font-size: 14px;
            text-shadow: none !important; /* 清除文字阴影 */
            vertical-align: middle !important; /* 关键：与标题文字垂直居中对齐 */
            line-height: 1 !important; /* 清除行高影响 */
        }
        /* 强制文字容器纯白色 */
        .custom-search-btn span {
            color: #ffffff !important;
        }
        /* 非第一个按钮统一调整间距（保持一致性） */
        .custom-search-btn:not(:first-child) {
            margin-left: 8px;
        }
        /* hover状态：加深背景+弥散投影 */
        .custom-search-btn:hover {
            opacity: 1;
            background-color: #2D5478 !important; /* hover深蓝色背景 */
            color: #ffffff !important;
            text-decoration: none !important;
            box-shadow: 0 0 10px rgba(45, 84, 120, 0.3) !important; /* 淡淡弥散投影 */
        }
        /* 图标强制纯白 */
        .custom-search-btn svg {
            width: 14px;
            height: 14px;
            fill: #ffffff !important;
            margin-right: 6px; /* 图标与文字间距 */
        }
        /* 兜底：仅控制文字/图标颜色，不干扰背景 */
        a.custom-search-btn,
        a.custom-search-btn:hover,
        .custom-search-btn * {
            color: #ffffff !important;
            fill: #ffffff !important;
            text-decoration: none !important;
            text-shadow: none !important;
        }
    `);

    // 2. 主函数：创建并添加三个按钮（夸克+音范丝+BT之家）
    function addSearchButtons() {
        try {
            // 获取影视标题（去除多余字符，优化标题提取逻辑）
            const titleElement = document.querySelector('h1 span[property="v:itemreviewed"]') || document.querySelector('title');
            if (!titleElement) return;
            // 优先从页面标题元素提取（更准确），其次从title标签提取
            const movieTitle = titleElement.innerText.trim().replace(' (豆瓣)', '');
            const encodedTitle = encodeURIComponent(movieTitle); // 编码影片名称

            // 获取插入位置（标题旁的h1标签，确保插入到标题文字后面）
            const h1 = document.querySelector('h1');
            if (!h1) return;

            // 搜索图标SVG（保持不变）
            const svgIcon = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L500 454.7c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                </svg>
            `;

            // 按钮配置（新增BT之家，按示例格式拼接链接）
            const buttonsConfig = [
                {
                    name: '夸克',
                    url: `https://pan.funletu.com/s?keyword=${encodedTitle}&page=1`,
                    title: `在夸克资源站搜索 "${movieTitle}"`
                },
                {
                    name: '音范丝',
                    url: `https://www.yinfans.net/?s=${encodedTitle}`,
                    title: `在音范丝搜索 "${movieTitle}"`
                },
                {
                    name: 'BT之家',
                    url: `https://www.1lou.pro/search-${encodedTitle}.htm`, // 按示例格式拼接
                    title: `在BT之家搜索 "${movieTitle}"`
                }
            ];

            // 循环创建按钮并添加到页面（插入到h1的最后，确保在标题文字右侧）
            buttonsConfig.forEach(config => {
                const button = document.createElement('a');
                button.href = config.url;
                button.target = '_blank'; // 新标签打开
                button.title = config.title;
                button.className = 'custom-search-btn';
                button.innerHTML = `${svgIcon}<span>${config.name}</span>`; // 图标+文字
                h1.appendChild(button);
            });

        } catch (error) {
            console.error('豆瓣快速搜索脚本出错:', error);
        }
    }

    // DOM加载完成后执行（确保元素已存在）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addSearchButtons);
    } else {
        addSearchButtons();
    }

})();