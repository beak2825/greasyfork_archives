// ==UserScript==
// @name        Minimalist PayPal
// @namespace   english
// @description Minimalist PayPal - http://pushka.com/coding-donation
// @include     http*://*paypal.com*
// @version     1.5
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9679/Minimalist%20PayPal.user.js
// @updateURL https://update.greasyfork.org/scripts/9679/Minimalist%20PayPal.meta.js
// ==/UserScript==


// Main - CSS hides two classes - video add box, and call to action box under it. - also social media

 
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '  .moving-background-container .row-fluid{display: none !important;}   ';
document.getElementsByTagName('head')[0].appendChild(style);

 