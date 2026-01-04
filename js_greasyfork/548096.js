// ==UserScript==
// @name         博客园主题样式替换
// @namespace    https://gist.doracoin.cc/doracoin/e99a814e880d47f3aba05b72de582489
// @version      2025.09.02
// @description  不喜欢博客园的Banlieue13主题？替换它！
// @author       Doracoin
// @match        https://www.cnblogs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnblogs.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548096/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E4%B8%BB%E9%A2%98%E6%A0%B7%E5%BC%8F%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/548096/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E4%B8%BB%E9%A2%98%E6%A0%B7%E5%BC%8F%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检测是否使用Banlieue13主题
    function isBanlieue13Theme() {
        // 查找id为"MainCss"的样式表
        const mainCss = document.getElementById('MainCss');

        if (mainCss && mainCss.href) {
            // 检查href是否包含目标路径
            return mainCss.href.includes('/skins/banlieue13/bundle-banlieue13.min.css');
        }

        return false;
    }

    // 替换主题样式
    function replaceTheme() {
        // 查找id为"MainCss"的样式表
        const mainCss = document.getElementById('MainCss');

        if (mainCss) {
            // 替换为ThinkInside主题
            mainCss.href = '/skins/thinkinside/bundle-thinkinside.min.css';
            console.log('主题已从Banlieue13替换为ThinkInside');

            // 修改body的class
            document.body.className = 'skin-thinkinside has-navbar';
            console.log('Body的class已更新为"skin-thinkinside has-navbar"');
        }
    }

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 检测主题
        if (isBanlieue13Theme()) {
            console.log('检测到Banlieue13主题，正在替换为ThinkInside主题...');
            replaceTheme();
        } else {
            console.log('未检测到Banlieue13主题，无需替换');
        }
    });
})();