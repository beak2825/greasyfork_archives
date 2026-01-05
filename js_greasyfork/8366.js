// ==UserScript==
// @name           NeoGAF - Broken avatars quick fix
// @version        0.1   
// @description    Fixes broken avatars while the issue gets sorted out.
// @include        http://*neogaf.com*
// @namespace https://greasyfork.org/users/9485
// @downloadURL https://update.greasyfork.org/scripts/8366/NeoGAF%20-%20Broken%20avatars%20quick%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/8366/NeoGAF%20-%20Broken%20avatars%20quick%20fix.meta.js
// ==/UserScript==

var images = document.getElementsByTagName ("img");
for (i = 0; i < images.length; i++) {
    if(images[i].src.contains('http://asset3.neogaf.com/')) {
        newurl = images[i].getAttribute('src').replace(/http\:\/\/asset3\.neogaf\.com/g, 'http://64.91.255.7');
        images[i].src = newurl;
    }
}