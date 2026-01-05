// ==UserScript==
// @name Pastebin Keybindings
// @version 1.1.1
// @description Binds keys to the Pastebin website.
// @author celliott1997
// @iconURL		 http://www.pastebin.com/favicon.ico
// @include http*://*pastebin.com/*
// @run-at document-body
// @grant none
// @namespace https://greasyfork.org/users/8398
// @downloadURL https://update.greasyfork.org/scripts/7513/Pastebin%20Keybindings.user.js
// @updateURL https://update.greasyfork.org/scripts/7513/Pastebin%20Keybindings.meta.js
// ==/UserScript==

$(document).ready(function(){
    var TextArea = $("textarea#paste_code");
    var SubmitBtn = $("input.button1.btnbold[type='submit']");
    var PasteInfo = $(".paste_box_info");
    
    function GetID(){return location.href.match("pastebin.com/([0-9a-zA-Z]+)")[1]};
    
     $(document).keydown(function(evt){
         if (evt.ctrlKey && (evt.which == 83)){
             evt.preventDefault();
             
             if (TextArea.length && SubmitBtn.length){
                 SubmitBtn.click();
             }else if (PasteInfo.length){
                 location.href = "/download.php?i="+GetID();
             };
         }else if(evt.ctrlKey && (evt.which == 79)){
             evt.preventDefault();
             
             if (PasteInfo.length){
                 location.href = "/edit.php?i="+GetID();
             };
         };
     });
});