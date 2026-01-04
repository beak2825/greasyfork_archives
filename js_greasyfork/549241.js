// ==UserScript==
// @name         SubTitleCat结果筛选
// @namespace    https://subtitlecat.com/
// @version      0.1.1
// @description  精准筛选结果,隐藏需要翻译的字幕和不含搜索关键字的结果
// @author       Sexjpg
// @match        https://*subtitlecat.com/subs/*
// @match        https://*subtitlecat.com/index.php?search=*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549241/SubTitleCat%E7%BB%93%E6%9E%9C%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549241/SubTitleCat%E7%BB%93%E6%9E%9C%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==


function resultfilter() {
    const keyword_e = document.querySelector("#search");
    if (!keyword_e) return
    const keyword = keyword_e.value.trim();
    if (!keyword) return
    const items = document.querySelectorAll(".table.sub-table tr")
    items.forEach(item => {
        if (item.textContent.includes(keyword)) {
            console.log(item, item.textContent)
            item.style.backgroundColor = "yellow"
            item.style.display = "table-row"
        } else {
            item.style.display = "none"
        }
    })
}

function srtfilter() {
    const items = document.querySelectorAll("div.all-sub .col-md-6.col-lg-4")
    items.forEach(item => {
        const link = item.querySelector("a")
        if (!link) {
            item.style.display = "none"
        }
    })
}

function initScript(){
    resultfilter()
    srtfilter()
}

(function() {
    'use strict';

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }})();




