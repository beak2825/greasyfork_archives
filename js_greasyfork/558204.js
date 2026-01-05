// ==UserScript==
// @name         萌娘百科外链封面恢复
// @namespace    https://moegirl.org.cn/
// @version      1.0
// @description  自动把被萌娘百科屏蔽的外链封面图恢复成可见图片
// @match        https://*.moegirl.org.cn/*
// @match        https://moegirl.org.cn/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558204/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E5%A4%96%E9%93%BE%E5%B0%81%E9%9D%A2%E6%81%A2%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/558204/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E5%A4%96%E9%93%BE%E5%B0%81%E9%9D%A2%E6%81%A2%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function restoreBlockedImages() {
        // 选择：class="moe-img-blocked" 的 <a>
        const blocked = document.querySelectorAll("a.moe-img-blocked");

        blocked.forEach(a => {
            const url = a.href; // 外链图片的真实地址
            if (!url) return;

            // 创建真正的 <img>
            const img = document.createElement("img");
            img.src = url;
            img.style.maxWidth = "100%";
            img.style.display = "block";

            // 清空原始 "[外部图片]"
            a.innerHTML = "";

            // 插入图片
            a.appendChild(img);

            // 移除阻断 class，避免 CSS 干扰
            a.classList.remove("moe-img-blocked");
        });
    }

    // 初次执行
    restoreBlockedImages();

    // 页面有懒加载、模板刷新时再执行
    const observer = new MutationObserver(restoreBlockedImages);
    observer.observe(document.body, { childList: true, subtree: true });
})();
