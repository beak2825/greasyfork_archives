// ==UserScript==
// @name         Unhide User ID
// @namespace    UnhideUserID
// @version      0.1.2
// @description  Unhide username in Reddit
// @author       kusotool
// @match        http://*.reddit.com/*
// @match        https://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9287/Unhide%20User%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/9287/Unhide%20User%20ID.meta.js
// ==/UserScript==

function addStyleRule(selector, declaration) {
    var sheet;
    
    if(document.styleSheets.length){  // 最後のスタイルシートを取得
        sheet = document.styleSheets[document.styleSheets.length - 1];
    }
    else{  // StyleSheetがない場合、StyleSheetを作成
        // for FireFox, Opera, Safari, Crome
        var head = document.getElementsByTagName('head')[0];
        if(head === null){ return; }
        var style = document.createElement('style');
        head.appendChild(style);
        sheet = style.sheet;
    }

    // for FireFox, Opera, Safari, Crome
    sheet.insertRule(selector + '{' + declaration + '}', sheet.cssRules.length);
}

function addStyleRuleAuthor(author, declaration) {
    var classname = ".tagline " + author;
    addStyleRule(classname, declaration);
    classname = ".comment " + classname;
    addStyleRule(classname, declaration);
    classname = ".res-nightmode " + classname;
    addStyleRule(classname, declaration);
}

function start() {
    addStyleRuleAuthor(".author"        , "font-size: inherit;");
    addStyleRuleAuthor(".author::before", "content: \"\";");
    addStyleRuleAuthor(".author::after" , "content: \"\";");
}

start();
