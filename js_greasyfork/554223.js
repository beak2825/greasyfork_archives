// ==UserScript==
// @name         优化raindrop新窗口打开
// @namespace    self
// @version      1
// @description  点击超链接新窗口打开
// @author       zifux
// @match        https://raindrop.acgfun.fun:888/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554223/%E4%BC%98%E5%8C%96raindrop%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/554223/%E4%BC%98%E5%8C%96raindrop%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setInterval(()=>{
        var elements = document.getElementsByTagName('a');
        for (var i=0;i<elements.length;i++){
            elements[i].target='_blank';
        }
    },1);
})();