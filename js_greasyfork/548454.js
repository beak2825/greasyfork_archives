// ==UserScript==
// @name         Saffron by 銀芽
// @version      1.0.7
// @description  The ultimate xingkong Plug-in
// @author       Yinya銀芽
// @match        https://agario.xingkong.tw/*
// @match        https://agario.xingkong.tw/Saffron*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agario.xingkong.tw
// @connect      rph-xk.web.app
// @license      MIT
// @namespace https://greasyfork.org/users/912109
// @downloadURL https://update.greasyfork.org/scripts/548454/Saffron%20by%20%E9%8A%80%E8%8A%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/548454/Saffron%20by%20%E9%8A%80%E8%8A%BD.meta.js
// ==/UserScript==


(function() {
    'use strict';
    if(window.location.href != "https://agario.xingkong.tw/Saffron"){
        window.location.href = "https://agario.xingkong.tw/Saffron";
    }
    document.documentElement.innerHTML = null, GM_xmlhttpRequest({
        method : "GET",
        url : 'https://rph-xk.web.app/saffron-release107.html',
        onload : function(e) {
            var doc = e.responseText
            document.open();
            document.write(doc);
            document.close();
        }
    });
})();