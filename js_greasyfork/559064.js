// ==UserScript==
// @name         隐藏 EPIC首页除“免费游戏”外的其他内容
// @namespace    t.me/TAhhhc
// @version      1.0
// @description  让EPIC Games 仅保留免费游戏这个内容
// @author       TAhhhc
// @match        https://store.epicgames.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559064/%E9%9A%90%E8%97%8F%20EPIC%E9%A6%96%E9%A1%B5%E9%99%A4%E2%80%9C%E5%85%8D%E8%B4%B9%E6%B8%B8%E6%88%8F%E2%80%9D%E5%A4%96%E7%9A%84%E5%85%B6%E4%BB%96%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/559064/%E9%9A%90%E8%97%8F%20EPIC%E9%A6%96%E9%A1%B5%E9%99%A4%E2%80%9C%E5%85%8D%E8%B4%B9%E6%B8%B8%E6%88%8F%E2%80%9D%E5%A4%96%E7%9A%84%E5%85%B6%E4%BB%96%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==


GM_addStyle(`
.css-1wwyop4, 
div[data-component="Hero"], 
section[data-testid="carousel-section"], 
.css-2scrzp>div {  
    display: none !important; 
}
`);
