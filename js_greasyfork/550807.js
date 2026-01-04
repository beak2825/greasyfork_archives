// ==UserScript==
// @name         EasyZHIHU (X浏览器优化版)
// @description  极致简洁的知乎体验：跳转至 aria 页面 + 样式净化，避免X浏览器出现知乎的关怀模式不停刷新
// @version      11.1
// @author       xcanwin (修改版 by GPT-5)
// @namespace    https://github.com/xcanwin/EasyZHIHU/
// @supportURL   https://github.com/xcanwin/EasyZHIHU/
// @license      GPL-2.0-only
// @match        https://www.zhihu.com/question/*
// @match        https://www.zhihu.com/aria/question/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550807/EasyZHIHU%20%28X%E6%B5%8F%E8%A7%88%E5%99%A8%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550807/EasyZHIHU%20%28X%E6%B5%8F%E8%A7%88%E5%99%A8%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const purify_style_pc = `
/*整体缩放*/
body {
    zoom: 70%;
    overflow-y: scroll !important;
}

/*净化页面*/
.Sticky, /*隐藏顶部菜单栏*/
.CornerButtons /*隐藏右下角返回顶部按钮*/
{
    display: none !important;
}

/*调整标题*/
.aria-centered-wrapper h1 {
    display: flex;
    justify-content: center;
    font-size: 28px;
}
.aria-question-header .aria-question-text .RichText p {
    margin: unset;
}

/*调整提问框*/
.aria-question-text {
    background: #f6f6f6;
    padding: 16px 32px;
    margin-top: 32px;
}

/*展示全屏*/
.aria-centered-wrapper {
    width: 98% !important;
}
.aria-answer-wrapper {
    padding: unset !important;
}

/*正文背景*/
.aria-primary-color-style.aria-secondary-background {
    background: unset !important;
}

/*正文图片居中*/
.css-1ygg4xu img.content_image, .css-1ygg4xu img.origin_image {
    width: unset !important;
    display: block;
    margin: 0 auto;
}

/*回答数量栏*/
.aria-answer-count {
    border-bottom: 4px solid #bdbdbd !important;
    margin: unset !important;
}

/*回答分割线*/
.List-item + .List-item::after {
    left: -20px !important;
    right: -20px !important;
    height: 3px;
    background: #bdbdbd;
    border-bottom: unset;
}

/*底部净化*/
.aria-page-wrapper {
    padding-bottom: unset !important;
}
`;

    const current_url = location.href;

    // 如果在普通页面，自动跳转到 aria 版本
    if (/https:\/\/www\.zhihu\.com\/question\//.test(current_url)) {
        location.replace(current_url.replace("www.zhihu.com", "www.zhihu.com/aria"));
    } 
    // 如果已经在 aria 页面，则注入净化样式
    else if (/https:\/\/www\.zhihu\.com\/aria\/question\//.test(current_url)) {
        GM_addStyle(purify_style_pc);
    }

})();
