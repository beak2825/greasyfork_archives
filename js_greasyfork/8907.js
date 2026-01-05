// ==UserScript==
// @name        zz Preceda Tweak - size of input box
// @namespace   english
// @description Preceda Tweak - size of input box  - http://pushka.com/coding-donation
// @include     http*://*preceda.com.au*
// @version     1.12
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/8907/zz%20Preceda%20Tweak%20-%20size%20of%20input%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/8907/zz%20Preceda%20Tweak%20-%20size%20of%20input%20box.meta.js
// ==/UserScript==


// Main - CSS hides two classes - video add box, and call to action box under it. - also social media


var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.toolbarinput,body,html{backgroud-color:red !important;}';
document.getElementsByTagName('head')[0].appendChild(style);

