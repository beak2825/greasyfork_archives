// ==UserScript==
// @name        MTurk Max Job Window Height
// @author      locke2002
// @namespace   
// @description Limit height of job window iFrame on MTurk.com
// @include     *.mturk.com/*
// @version     1.02
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6137/MTurk%20Max%20Job%20Window%20Height.user.js
// @updateURL https://update.greasyfork.org/scripts/6137/MTurk%20Max%20Job%20Window%20Height.meta.js
// ==/UserScript==

var hitIframe = document.getElementsByName('ExternalQuestionIFrame')[0];
if ( hitIframe ) { hitIframe.style.height='90%'; }

var hitIframe2 = document.getElementsByName('HTMLQuestionIFrame')[0];
if ( hitIframe2 ) { hitIframe2.style.height='90%'; }
