// ==UserScript==
// @name        8chan NSFW Remover
// @version	2.2
// @namespace   https://greasyfork.org/en/scripts/9331-8chan-nsfw-remover
// @description Removes NSFW boards from the board list on 8chan.
// @include     /^https?://8ch\.net/boards.html$/
// @license     GPLv3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9331/8chan%20NSFW%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/9331/8chan%20NSFW%20Remover.meta.js
// ==/UserScript==

window.addEventListener ("load", Greasemonkey_main, false);

function Greasemonkey_main(){
  document.getElementById('search-sfw-input').checked = true;
  if(document.getElementById('search-sfw-input').checked = true){
    document.getElementById('search-submit').click();
  }
}