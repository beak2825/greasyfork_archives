// ==UserScript==
// @name       Young版 清除禁止复制禁止拖曳
// @description  自己用的清除禁止复制禁止拖曳
// @include     http://mo.nightlife141.com/*
// @version     1.0
// @author      Youngcc
// @grant       none


// @namespace https://greasyfork.org/users/8717
// @downloadURL https://update.greasyfork.org/scripts/7796/Young%E7%89%88%20%E6%B8%85%E9%99%A4%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E7%A6%81%E6%AD%A2%E6%8B%96%E6%9B%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/7796/Young%E7%89%88%20%E6%B8%85%E9%99%A4%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E7%A6%81%E6%AD%A2%E6%8B%96%E6%9B%B3.meta.js
// ==/UserScript==
    function restore(){
    with (document.wrappedJSObject || document) {
    onmouseup = null;
    onmousedown = null;
    oncontextmenu = null;
    }
    var arAllElements = document.getElementsByTagName('*');
    for (var i = arAllElements.length - 1; i >= 0; i--) {
    var elmOne = arAllElements[i];
    with (elmOne.wrappedJSObject || elmOne) {
    onmouseup = null;
    onmousedown = null;
    }
    }
    }

    window.addEventListener('load',restore,true);

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle("html, * {-moz-user-select:text!important;}");