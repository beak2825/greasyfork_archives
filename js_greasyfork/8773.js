// ==UserScript==
// @name        MIAMI TV
// @icon        http://net2ftp.ru/node0/pub/icon.png
// @namespace   MIAMI TV (Int)
// @description MIAMI TV (International)
// @include     http://www.miamitvchannel.com/miami-tv.php 
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8773/MIAMI%20TV.user.js
// @updateURL https://update.greasyfork.org/scripts/8773/MIAMI%20TV.meta.js
// ==/UserScript==
//

var parentElem = document.body.children[0];
 
  var newDiv = document.createElement('div');
  newDiv.id = "idd";
  newDiv.innerHTML = '<a href="http://miamitvchannel.com/lounge/">Login</a>'+
  '<style>'+
  
    '#idd a{display:block;margin-left:75%;font-weight:bold;color:#fff;background-color:#000;opacity:0.4;width:120px;height:21px;text-align:center;padding:4px; text-decoration:none;text-shadow: 1px 1px 2px #000;border-radius: 7px;font-size: 18px;}'+
    ' #idd a:hover{background-color:#000;opacity:0.4;text-shadow: 1px 1px 1px #fff;color:#fff;}</style>';
 
  parentElem.appendChild(newDiv);