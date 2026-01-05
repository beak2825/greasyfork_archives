// ==UserScript==
// @name         TNTVillage autodownload torrent file
// @namespace    http://forum.tntvillage.scambioetico.org/
// @version      0.2
// @description  enter something useful
// @author       Agostino Zanutto
// @match        http://forum.tntvillage.scambioetico.org/index.php?showtopic=*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/8808/TNTVillage%20autodownload%20torrent%20file.user.js
// @updateURL https://update.greasyfork.org/scripts/8808/TNTVillage%20autodownload%20torrent%20file.meta.js
// ==/UserScript==

var jQuery = unsafeWindow.jQuery;
console.log('INIT TntVillage autodownload');
all_a = unsafeWindow.document.getElementsByTagName("a");
for (var i = 0; i < all_a.length; i++) {
    var a = all_a[i];
    var href = a.href;

    if (a.innerText !== '' && href.search(/act=Attach&/i) > 0) {
        console.log ('LINK FOUND: ' + a.innerText + ' => ' + href);
        console.log ('DOWNLOAD IT');
        unsafeWindow.open(href);
        body=unsafeWindow.document.getElementsByTagName('body');
        if (body.len == 1) {
            body[0].innerHTML='<h1>DOWNLOADED <a href="'+href+'">'+a.innerText+'<br/><a href="#" onclick="window.close();">CLOSE WINDOW</a>';
        }
        unsafeWindow.setTimeout('window.close();',100);
    }
}
