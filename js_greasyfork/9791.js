// ==UserScript==
// @name        Remove Twitter Homepage Images - by Pushka.tv
// @namespace   english
// @description Remove Twitter Homepage Images - http://pushka.com/coding-donation
// @include     http*://*twitter.com
// @include     http*://*twitter.com/
// @version     1.8
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9791/Remove%20Twitter%20Homepage%20Images%20-%20by%20Pushkatv.user.js
// @updateURL https://update.greasyfork.org/scripts/9791/Remove%20Twitter%20Homepage%20Images%20-%20by%20Pushkatv.meta.js
// ==/UserScript==


// Main - CSS hides some block elements and expands other main divs to 100% 
 

var style = document.createElement('style');
style.type = 'text/css';


style.innerHTML = '   .front-bg{  display: none;}/*\n*//*body {  color: #ECECEC;}*//*\n*/.front-page {  background-color: #292929;}/*\n*/.front-page-photo-set .front-welcome-text h1 {color: #676767;}.front-page-photo-set .front-welcome-text p {color: #676767;}/*\n*/.front-page-photo-set .front-welcome-text p {color: #676767;}/*\n*/.front-page-photo-set .companion-tweet a {color: #676767;}/*\n*/.front-page-photo-set .front-container .footer a, .front-page-photo-set .front-container .footer .copyright {color: #676767;}  /*\n*/.front-page {  background-color: #EDEDED;}   ';


document.getElementsByTagName('head')[0].appendChild(style);

 
