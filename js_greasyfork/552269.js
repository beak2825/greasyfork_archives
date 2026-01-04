// ==UserScript==
// @name         Enazo Kiwammi・登入冷却消退
// @namespace    Asahi rei wo taose
// @version      2025-10-11
// @description  Set the cooldown time to 0 when user reload the page every times
// @author       Noa
// @match        https://enazo.cn/r/*
// @icon         https://enazo.cn/favicon.ico
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/552269/Enazo%20Kiwammi%E3%83%BB%E7%99%BB%E5%85%A5%E5%86%B7%E5%8D%B4%E6%B6%88%E9%80%80.user.js
// @updateURL https://update.greasyfork.org/scripts/552269/Enazo%20Kiwammi%E3%83%BB%E7%99%BB%E5%85%A5%E5%86%B7%E5%8D%B4%E6%B6%88%E9%80%80.meta.js
// ==/UserScript==

!function(){const a=localStorage,k=String.fromCharCode(108,97,115,116);for(let b in a)try{[...k].every((c,d)=>b[d]===c)&&a.removeItem(b)}catch(e){}}();
