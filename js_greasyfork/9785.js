// ==UserScript==
// @name         Plug.DJ Chat Notifications
// @icon         http://i.imgur.com/0LwVHyl.png
// @namespace    x4_plugdjcn
// @version      0.2.1
// @description  Shows desktop notification for new chat messages
// @author       x4fab
// @license      CC0
// @match        https://plug.dj/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9785/PlugDJ%20Chat%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/9785/PlugDJ%20Chat%20Notifications.meta.js
// ==/UserScript==

!function (){
    var windowOpen = window.open,
        opened;
    
    window.open = function (){
        opened = windowOpen.apply(window, arguments);
        return opened;
    };

    if (Notification.permission == 'default'){
        document.body.onclick = function (){
            Notification.requestPermission();
            document.body.onclick = null;
        };
    }

    var lastId;
    setInterval(function (){
        if (opened && opened.closed){
            opened = null;
        }
        
        var node = (opened ? opened.document : document).querySelector('#chat-messages .cm.message:not(.from-you):last-child .msg');
        if (!node){
            return;
        }

        var currentId = node.querySelector('.text').className;
        if (lastId != currentId){
            var focused = opened && opened.document.hasFocus() || document.hasFocus();
            
            if (!focused){
                var notification = new Notification(node.querySelector('.un').textContent, { 
                    body: node.querySelector('.text').innerHTML.replace(/^[\s\S]*<br>/, '').replace(/<.+?>/g, ''), 
                    icon: 'http://i.imgur.com/0LwVHyl.png' 
                });
                
                setTimeout(notification.close.bind(notification), 3e3);
            }
            
            lastId = currentId;
        } 
    }, 50);
}();
