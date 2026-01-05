// ==UserScript==
// @name         Prankota4Pranks
// @namespace    https://greasyfork.org/users/6914
// @version      0.3
// @description  Скрывает из сообщества пранкоты всякую рекламу
// @author       DnAp
// @match        https://vk.com/*
// @downloadURL https://update.greasyfork.org/scripts/7554/Prankota4Pranks.user.js
// @updateURL https://update.greasyfork.org/scripts/7554/Prankota4Pranks.meta.js
// ==/UserScript==

var hidePrknk = function() {
    var feeds = document.getElementsByClassName('feed_row');
    var feed;
    for(var i=0;i<feeds.length;i++) {
        feed = feeds[i];
        var wallName = feed.getElementsByClassName('wall_text_name');
        if(wallName.length > 0) {
            var author = wallName[0].getElementsByClassName('author');
            if(author.length > 0 && author[0].href == 'https://vk.com/prankotadotcom' && feed.getElementsByClassName('audio').length == 0) {
                feed.style.display = 'none';
            }
        }
    }
    setTimeout(hidePrknk, 300);
};
hidePrknk();
setTimeout(hidePrknk, 300);
