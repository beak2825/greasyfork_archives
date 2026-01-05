// ==UserScript==
// @name       Processing.js title changer
// @namespace  http://userscripts.org/users/322169
// @version    0.2
// @description  Adds the text of the main heading of the page to the title of the document on processingjs.org.
// @include    http://processingjs.org/*
// @copyright  2011, James Wood
// @downloadURL https://update.greasyfork.org/scripts/639/Processingjs%20title%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/639/Processingjs%20title%20changer.meta.js
// ==/UserScript==

if (document.title == 'Processing.js')
    document.title += ' - ' + (document.getElementsByTagName('h2')[0] || document.getElementsByTagName('h3')[0]).innerText;