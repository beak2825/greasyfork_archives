// ==UserScript==
// @name        MaterialUI.co Color Picker Remove Footer and Sidebar
// @namespace   english
// @description MaterialUI.co Color Picker Remove Footer and Sidebar  - clean up
// @include     http*://*materialui.co/colors*
// @version     1.6
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9882/MaterialUIco%20Color%20Picker%20Remove%20Footer%20and%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/9882/MaterialUIco%20Color%20Picker%20Remove%20Footer%20and%20Sidebar.meta.js
// ==/UserScript==


// Main - CSS hides two classes - video add box, and call to action box under it. - also social media

 
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '     .container {bottom: 0;} footer,.pallete_toggle{display:none;}     ';
document.getElementsByTagName('head')[0].appendChild(style);

 




