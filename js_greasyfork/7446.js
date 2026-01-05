// ==UserScript==
// @name         adam4++
// @namespace    http://goo.gl/GW3dZS
// @version      0.1.0
// @description  adam4adam.com page cleanup and ad remover for Chromium, Opera, Silk, and Google Chrome.
// @author       Dan Reidy <dubkat@gmail.com>
// @copyright    Copyright (C) 2015 Dan Reidy
// @license      GPLv3
// @match        http://www.adam4adam.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// $Id$
// @downloadURL https://update.greasyfork.org/scripts/7446/adam4%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/7446/adam4%2B%2B.meta.js
// ==/UserScript==


// // remove cam link sidebar
var adSidebar = document.getElementById('slide-out-div');
if (adSidebar) {
    adSidebar.parentNode.removeChild(adSidebar);
}

// // remove stupid bandwidth sucking iframes
$("iframe").remove();


