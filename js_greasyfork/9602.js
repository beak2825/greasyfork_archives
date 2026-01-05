// ==UserScript==
// @name         360doc 禁止复制破解
// @namespace    https://www.topcl.net
// @version      0.1
// @description  去除360doc禁止复制
// @author       vj
// @match        http://www.360doc.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9602/360doc%20%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/9602/360doc%20%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

$(function(){
    setTimeout(function(){
        document.body.oncopy=null;    
    },2000);
});