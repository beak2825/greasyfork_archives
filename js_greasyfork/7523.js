// ==UserScript==
// @name          CSS: Facedurrr
// @namespace     MonstroChan.org
// @description    Cambiar la CSS porque no sirve la chingadera
// @include        *monstrochan.org/l*
// @version 0.0.1.20150116054999
// @downloadURL https://update.greasyfork.org/scripts/7523/CSS%3A%20Facedurrr.user.js
// @updateURL https://update.greasyfork.org/scripts/7523/CSS%3A%20Facedurrr.meta.js
// ==/UserScript==




var cssUrl = "http://monstrochan.org/l/css/facedurr.css";

var head = document.getElementsByTagName("head")[0];

var link = document.createElement("link");

link.rel = "stylesheet";
link.type = "text/css";
link.href = cssUrl;

document.head.appendChild(link);