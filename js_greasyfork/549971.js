// ==UserScript==
// @name         手机网页版IT之家去广告和干扰（防重复版）
// @namespace    https://greasyfork.org/zh-CN/users/442617-punkjet
// @version      2025.09.18
// @description  去广告，隐藏推广内容，避免文章列表重复加载问题。
// @author       
// @run-at       document-end
// @match        *://m.ithome.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549971/%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%89%88IT%E4%B9%8B%E5%AE%B6%E5%8E%BB%E5%B9%BF%E5%91%8A%E5%92%8C%E5%B9%B2%E6%89%B0%EF%BC%88%E9%98%B2%E9%87%8D%E5%A4%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549971/%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%89%88IT%E4%B9%8B%E5%AE%B6%E5%8E%BB%E5%B9%BF%E5%91%8A%E5%92%8C%E5%B9%B2%E6%89%B0%EF%BC%88%E9%98%B2%E9%87%8D%E5%A4%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 顶部和浮层广告
    $(".open-app-banner, .open-app, .brand-column-lapin, .news-class, .modal.has-title.loaded").remove();

    // 删除正文里的商城推广链接，而不是整篇文章
    $(".main-site a[href*='mall.ithome.com']").remove();

    cleanPage();

    // 滚动时动态清理
    window.addEventListener("scroll", cleanPage);
})();

function cleanPage() {
    removeIthomeArticleAds();
    removeIthomeAds();
}

function removeIthomeArticleAds() {
    $(".down-app-box, .relevant-news, .hot-app, .ggp-promotion, .grade, #bd-share-box, .lapin").remove();
}

function removeIthomeAds() {
    // 广告提示标签
    $("span.tip-suggest, span.tip.tip-gray, span.tip.tip-green")
        .closest("div.placeholder")
        .remove();

    // 针对标题的推广软文 → 不删除节点，只隐藏，避免触发重复加载
    $("p.plc-title").each(function() {
        if ($(this).data("filtered")) return; // 已处理过

        const deleteStr = [
            "购","红包","预售","优惠","领券","福包","元",
            "大促","开售","预约","限免","精选","限时","节",
            "抢","折","补贴","省钱","618","11","超级88"
        ];

        if (deleteStr.some(str => $(this).text().includes(str))) {
            $(this).closest("div.placeholder").css("display", "none");
            $(this).data("filtered", true); // 打标记避免反复处理
        }
    });
}
