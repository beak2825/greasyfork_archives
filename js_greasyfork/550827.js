// ==UserScript==
// @name         自定义移除广告-拓宽网页(牛牛电影)-2025/09/27
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动移除指定 class 的广告节点，覆盖CSS(网页媒体查询的宽度)，只对单页面有效，随缘更新，不是什么好网站，随便玩玩
// @match        https://156.244.45.193:51635/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550827/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A-%E6%8B%93%E5%AE%BD%E7%BD%91%E9%A1%B5%28%E7%89%9B%E7%89%9B%E7%94%B5%E5%BD%B1%29-20250927.user.js
// @updateURL https://update.greasyfork.org/scripts/550827/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A-%E6%8B%93%E5%AE%BD%E7%BD%91%E9%A1%B5%28%E7%89%9B%E7%89%9B%E7%94%B5%E5%BD%B1%29-20250927.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 功能0) 需要移除的漂浮广告 class 列表
    const adClasses = ['newdingdipiao', 'newdingdipiao1', 'newdingdipiao2', 'icon'];

    function removeAds() {
        adClasses.forEach(cls => {
            document.querySelectorAll('.' + cls).forEach(el => el.remove());
        });
    }
    function removeAds2() {
        // 功能1) 网页固定有4个广告位，通通杀掉
        const ul = document.querySelector('ul.stui-vodlist.clearfix');
        if (ul){
            const listItems = ul.querySelectorAll('li');
            for (let i = 0; i < 4 && i < listItems.length; i++) {
                listItems[i].remove();
            }
        }

        // 功能2) 删除 div.div_text 下 href以 https:// 开头的 a 标签，屏蔽广告链接
        const divs = document.querySelectorAll('div.div_text');
        divs.forEach(div => {
            const links = div.querySelectorAll('a[href^="https://"]');
            links.forEach(link => link.remove());
        });
    }


    // removeAds();
    // 非动态广告-只执行一次即可
    removeAds2();

    // 功能3) 页面通过 CSS 强制写了媒体查询，直接注入一段新 CSS 覆盖掉
    function fixContainerWidth() {
        const style = document.createElement('style');
        style.innerHTML = `
            .container {
                width: 98% !important;
            }
        `;
        document.head.appendChild(style);
    }

    const videoTopTime = 24;
    // 功能4) ： 跳过片头广告
    function skipVideoTop() {
        console.log('尝试跳过广告');
        const video = document.querySelector('video');
        if (!video || video.length === 0) return;
        // 避免重复绑定
        if (!video.hasAttribute('data-skip20-bound')) {
            video.addEventListener('play', () => {
                if (video.currentTime < videoTopTime) {
                    video.currentTime = videoTopTime;
                    console.log('已跳过前 ' + videoTopTime +' 秒');
                }
            });
            video.setAttribute('data-skip20-bound', 'true');
        }
    }

    // 页面加载完成后执行一次
    function init() {
        removeAds();
        fixContainerWidth();
    }
    // 页面加载后执行一次
    window.addEventListener('load', init);

    // 监听动态加载内容，防止飘浮广告重新生成
    const observer = new MutationObserver(removeAds);
    // childList: true → 监听子节点增加/删除
    // subtree: true → 包括所有子层级，不只监听一层
    observer.observe(document.body, { childList: true, subtree: true });

    // ------------------- 动态检测视频 -------------------
    const videoObserver = new MutationObserver(skipVideoTop);
    videoObserver.observe(document.body, { childList: true, subtree: true });
    skipVideoTop();
})();