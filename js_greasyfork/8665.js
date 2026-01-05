// ==UserScript==
// @name        Twitter Minimal - by Pushka.tv
// @namespace   english
// @description removes suggestion boxes, info about cricket etc.  - http://pushka.com/coding-donation
// @include     http*://*twitter.com*
// @version     2.4
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/8665/Twitter%20Minimal%20-%20by%20Pushkatv.user.js
// @updateURL https://update.greasyfork.org/scripts/8665/Twitter%20Minimal%20-%20by%20Pushkatv.meta.js
// ==/UserScript==


  

var style = document.createElement('style');
style.type = 'text/css';


style.innerHTML = '         .dashboard-right{display: none;}/*\n*/#page-container{width: 88%  !important ;}.content-main {/*\n*/    /*\n*/    width: 60%;/*\n*/}.dashboard-left{    width: 35%  !important ;}       ';


document.getElementsByTagName('head')[0].appendChild(style);

 