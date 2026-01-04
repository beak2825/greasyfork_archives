// ==UserScript==
// @name        网页标签标题智能清理器
// @namespace   Violentmonkey Scripts
// @match       https://*/*
// @grant       none
// @version     2.9
// @author      Raynon
// @license     GNU GPLv3
// @description 自动清理浏览器标签页上网页标题开头的未读消息数字 (3条消息、1 等)，保持标签页标题干净。防止重复安装脚本导致冲突。
// @downloadURL https://update.greasyfork.org/scripts/551523/%E7%BD%91%E9%A1%B5%E6%A0%87%E7%AD%BE%E6%A0%87%E9%A2%98%E6%99%BA%E8%83%BD%E6%B8%85%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551523/%E7%BD%91%E9%A1%B5%E6%A0%87%E7%AD%BE%E6%A0%87%E9%A2%98%E6%99%BA%E8%83%BD%E6%B8%85%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局标识，防止多个副本同时运行
    if (window.__RaynonTitleCleaner__) {
        console.log("网页标题清理器已运行，跳过重复实例");
        return; // 已运行过，直接退出
    }
    window.__RaynonTitleCleaner__ = true;

    // 获取网页的 <title> 标签
    const title = document.getElementsByTagName("title")[0];

    /**
     * 清理标题函数
     * - 去掉开头形式为 "(数字...)" 的未读消息提示
     * - 正则匹配开头圆括号数字，例如 "(3条消息)" 或 "(1)"
     */
    const cleanTitle = () => {
        const regex = /^\(\d+(?:[^\)]*)?\)\s*/;
        title.innerText = title.innerText.replace(regex, '');
    };

    // 初始化一次，处理初始标题
    cleanTitle();

    // 创建 MutationObserver，监听 <title> 的子节点变化
    const observer = new MutationObserver(() => {
        // 断开 observer 避免无限循环
        observer.disconnect();

        // 清理标题
        cleanTitle();

        // 重新开始监听
        observer.observe(title, { childList: true });
    });

    // 开始监听 <title> 的子节点变化
    observer.observe(title, { childList: true });

})();
