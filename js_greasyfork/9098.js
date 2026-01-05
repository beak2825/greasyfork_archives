// ==UserScript==
// @name        ING Direct Website remove slider banner  - Global - by Pushka.tv
// @namespace   english
// @description Hide Divs which contain adds - all websites  - http://pushka.com/coding-donation
// @include     http*://*ingdirect.com.au*
// @version     1.9
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9098/ING%20Direct%20Website%20remove%20slider%20banner%20%20-%20Global%20-%20by%20Pushkatv.user.js
// @updateURL https://update.greasyfork.org/scripts/9098/ING%20Direct%20Website%20remove%20slider%20banner%20%20-%20Global%20-%20by%20Pushkatv.meta.js
// ==/UserScript==

 

// Main - CSS hides some block elements and expands other main divs to 100% 
 

var style = document.createElement('style');
style.type = 'text/css';


style.innerHTML = '.ING-home-slider,#ING-home-slider{display:none !important;}';



document.getElementsByTagName('head')[0].appendChild(style);

 