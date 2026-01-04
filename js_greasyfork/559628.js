// ==UserScript==
// @name         米游社百科词条复制优化
// @namespace    99180884-64cb-4d91-8b3e-96cca041be5d
// @version      1.1.1
// @description  防止复制到页面中的 [详情] 标签
// @author       chcs1013
// @match        https://baike.mihoyo.com/*
// @grant        none
// @require      https://unpkg.com/add-css-constructed@1.1.1/dist/umd.js
// @license      Unlicense
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559628/%E7%B1%B3%E6%B8%B8%E7%A4%BE%E7%99%BE%E7%A7%91%E8%AF%8D%E6%9D%A1%E5%A4%8D%E5%88%B6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/559628/%E7%B1%B3%E6%B8%B8%E7%A4%BE%E7%99%BE%E7%A7%91%E8%AF%8D%E6%9D%A1%E5%A4%8D%E5%88%B6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    addCSS(`
    .wiki-note-text[data-type="详情"],.wiki-note-text>.wiki-sup {
    user-select: none !important;
    }
    `);

    function removeDraggable() {
        const query = document.querySelectorAll("div.obc-tmpl[draggable=\"true\"]");
        if (query.length === 0) setTimeout(removeDraggable, 1000); // try later
        for (const i of query) i.draggable = false; // example page: https://baike.mihoyo.com/bh3/wiki/content/4077/detail?bbs_presentation_style=no_header
    }
    if (document.readyState === "complete") queueMicrotask(removeDraggable); else globalThis.addEventListener("load", removeDraggable, { once: true });
})();