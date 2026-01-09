// ==UserScript==
// @name          【网页标题】消息通知过滤
// @namespace     https://github.com/realSilasYang
// @version       2025-12-29
// @description   移除标题开头的 (xxx) 格式的通知。默认关闭，需在要启用的网站上打开脚本管理器，手动该网站添加到应用范围。
// @icon           data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+PGcgdHJhbnNmb3JtPSJtYXRyaXgoNC41IDAgMCA0LjUgNiA2KSI+PHBhdGggZD0iTTEyIDIyYzEuMSAwIDItLjkgMi0yaC00YzAgMS4xLjkgMiAyIDJ6IiBmaWxsPSIjNzk1NTQ4Ii8+PHBhdGggZD0iTTE4IDE2di01YzAtMy4wNy0xLjYzLTUuNjQtNC41LTYuMzJWNGMwLS44My0uNjctMS41LTEuNS0xLjVzLTEuNS42Ny0xLjUgMS41di42OEM3LjY0IDUuMzYgNiA3LjkyIDYgMTF2NWwtMiAydjFoMTZ2LTFsLTItMnoiIGZpbGw9IiNGRkMxMDciLz48L2c+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRDMyRjJGIiBzdHJva2Utd2lkdGg9IjEyIiBzdHJva2UtbGluZWNhcD0icm91bmQiPjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjUyIi8+PGxpbmUgeDE9IjI1IiB5MT0iMjUiIHgyPSI5NSIgeTI9Ijk1Ii8+PC9nPjwvc3ZnPg==
// @author        阳熙来
// @license       GNU GPLv3
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @run-at        document-start
// @match         *://*/*
// @downloadURL https://update.greasyfork.org/scripts/551067/%E3%80%90%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E3%80%91%E6%B6%88%E6%81%AF%E9%80%9A%E7%9F%A5%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/551067/%E3%80%90%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E3%80%91%E6%B6%88%E6%81%AF%E9%80%9A%E7%9F%A5%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 配置管理逻辑 ---

    // 获取当前域名
    const currentHost = window.location.hostname;
    // 从存储中获取已启用的域名列表
    const allowedHosts = GM_getValue("allowed_hosts", []);
    // 判断当前域名是否在白名单中
    const isEnabled = allowedHosts.includes(currentHost);

    /**
     * 切换当前网站的启用状态
     */
    function toggleCurrentSite() {
        const index = allowedHosts.indexOf(currentHost);
        if (index > -1) {
            allowedHosts.splice(index, 1);
        } else {
            allowedHosts.push(currentHost);
        }
        GM_setValue("allowed_hosts", allowedHosts);
        location.reload();
    }

    // --- 2. 注册脚本菜单 ---

    const menuName = isEnabled
        ? `🚫 停止在当前网站过滤 (${currentHost})`
        : `✅ 开启当前网站标题过滤 (${currentHost})`;

    GM_registerMenuCommand(menuName, toggleCurrentSite);


    // --- 3. 核心业务逻辑 (仅当 isEnabled 为 true 时执行) ---

    if (!isEnabled) {
        return;
    }

    /**
     * 配置区域 - 修复部分
     * 说明：将 \d+ 改为 [^\)\）]+ 以匹配包含文字、符号的复杂通知
     */
    // 匹配规则：开头空白 -> ( -> 任意非右括号内容 -> ) -> 空白
    const regex = /^[\s\u200b]*[\(\（][^\)\）]+[\)\）]\s*/;

    let titleObserver = null;

    /**
     * 核心逻辑：执行标题清理
     */
    function cleanTitle() {
        if (regex.test(document.title)) {
            // console.log("检测到脏标题，执行清理:", document.title); // 调试用
            document.title = document.title.replace(regex, "");
        }
    }

    /**
     * 监听具体的 <title> 文本节点变化
     */
    function observeTitleElement(titleElement) {
        if (titleObserver) {
            titleObserver.disconnect();
        }
        titleObserver = new MutationObserver(cleanTitle);
        titleObserver.observe(titleElement, { childList: true, characterData: true, subtree: true });
        // 立即执行一次
        cleanTitle();
    }

    /**
     * 初始化函数
     */
    function init() {
        const titleElement = document.querySelector('title');
        if (titleElement) {
            observeTitleElement(titleElement);
        }

        const headObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'TITLE') {
                        observeTitleElement(node);
                    }
                });
            });
        });

        headObserver.observe(document.querySelector('head'), { childList: true });
    }

    if (document.head) {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init);
    }

})();