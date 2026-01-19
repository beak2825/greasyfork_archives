// ==UserScript==
// @name         Linux Do Authorize Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为 Linux Do 授权页面添加黑暗模式开关
// @author       blackzero358
// @match        https://connect.linux.do/oauth2/authorize*
// @grant        GM_addStyle
// @run-at       document-end
// @license      AGPLv3
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌙</text></svg>
// @downloadURL https://update.greasyfork.org/scripts/563190/Linux%20Do%20Authorize%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/563190/Linux%20Do%20Authorize%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 定义黑暗模式的 CSS 样式
    // 我们使用 !important 来强制覆盖原有的 Tailwind CSS 样式
    const darkModeCSS = `
        /* 开启黑暗模式时的 body 背景 */
        body.tm-dark-mode {
            background-color: #111827 !important; /* 深灰背景 */
            color: #e5e7eb !important; /* 浅灰文字 */
        }

        /* 覆盖白色卡片的背景 */
        body.tm-dark-mode .bg-white {
            background-color: #1f2937 !important; /* 稍浅一点的深灰 */
            color: #e5e7eb !important;
            border: 1px solid #374151; /*以此增加对比度*/
        }

        /* 调整标题颜色 */
        body.tm-dark-mode h1,
        body.tm-dark-mode h2,
        body.tm-dark-mode strong {
            color: #f3f4f6 !important; /* 亮白色 */
        }

        /* 调整链接颜色，使其在黑底上更清晰 */
        body.tm-dark-mode a.text-blue-500 {
            color: #60a5fa !important; /* 亮蓝色 */
        }

        /* 调整底部灰色背景 */
        body.tm-dark-mode .bg-gray-200 {
            background-color: #111827 !important;
        }

        /* 切换按钮的样式 */
        #tm-dark-mode-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background-color: #ffffff;
            border-radius: 50%;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            border: 1px solid #e5e7eb;
            transition: all 0.3s ease;
        }

        /* 黑暗模式下按钮的样式 */
        body.tm-dark-mode #tm-dark-mode-toggle {
            background-color: #374151;
            color: #ffffff;
            border-color: #4b5563;
        }
    `;

    // 将 CSS 注入到页面中
    GM_addStyle(darkModeCSS);

    // 2. 创建切换按钮
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'tm-dark-mode-toggle';
    toggleBtn.innerHTML = '🌓'; // 使用 emoji 作为图标
    toggleBtn.title = '切换黑暗模式';
    document.body.appendChild(toggleBtn);

    // 3. 读取本地存储，检查用户之前是否开启过
    const isDarkMode = localStorage.getItem('linuxdo_dark_mode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('tm-dark-mode');
    }

    // 4. 绑定点击事件
    toggleBtn.addEventListener('click', function() {
        // 切换 body 上的类名
        document.body.classList.toggle('tm-dark-mode');

        // 保存当前状态到 localStorage
        const currentStatus = document.body.classList.contains('tm-dark-mode');
        localStorage.setItem('linuxdo_dark_mode', currentStatus);
    });

})();