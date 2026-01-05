// ==UserScript==
// @name        Remove header logo and giant image on Survey Monkey Website
// @namespace   english
// @description Remove header logo and giant image on Survey Monkey Website - http://pushka.com/coding-donation
// @include     http*://*surveymonkey.com*
// @version     1.6
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9819/Remove%20header%20logo%20and%20giant%20image%20on%20Survey%20Monkey%20Website.user.js
// @updateURL https://update.greasyfork.org/scripts/9819/Remove%20header%20logo%20and%20giant%20image%20on%20Survey%20Monkey%20Website.meta.js
// ==/UserScript==


// Main - CSS hides some block elements and expands other main divs to 100% 
 

var style = document.createElement('style');
style.type = 'text/css';


style.innerHTML = '      .responsive-logo,.main-cta-image,#header-logo{display:none;}      ';


document.getElementsByTagName('head')[0].appendChild(style);

 