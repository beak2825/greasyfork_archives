// ==UserScript==
// @name        THCloser
// @description Does some stuff.
// @version     1.1
// @author      DCI
// @namespace   http://www.redpandanetwork.org
// @include     https://www.mturk.com*knowidea*
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/8521/THCloser.user.js
// @updateURL https://update.greasyfork.org/scripts/8521/THCloser.meta.js
// ==/UserScript==

window.addEventListener(message, receiveMessage, false);
function receiveMessage(q){
var msg = q.data;
if (msg == closeplzbb){window.close()}}