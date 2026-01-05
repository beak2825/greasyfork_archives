// ==UserScript==
// @name Spammers be gone!
// @namespace Deadman
// @description : This script will add javascript to block unwanted threads 
//                  on Warlight forums.
//
//
// @include https://www.warlight.net/Forum/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
//
// @version 1.1
// @downloadURL https://update.greasyfork.org/scripts/8999/Spammers%20be%20gone%21.user.js
// @updateURL https://update.greasyfork.org/scripts/8999/Spammers%20be%20gone%21.meta.js
// ==/UserScript==

var e = document.createElement("script");

e.src = 'https://greasyfork.org/scripts/8981-spammers-be-gone/code/Spammers%20be%20gone!.user.js';
e.type="text/javascript";
document.getElementsByTagName("head")[0].appendChild(e);