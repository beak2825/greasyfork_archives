// ==UserScript==
// @name          CSS: Burichan (el original de Yotsuba B)
// @namespace     MonstroChan.org
// @description    Cambiar la CSS porque no sirve la chingadera

// @include        *monstrochan.org/l*
// @version 0.0.1.20150116062304
// @downloadURL https://update.greasyfork.org/scripts/7518/CSS%3A%20Burichan%20%28el%20original%20de%20Yotsuba%20B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/7518/CSS%3A%20Burichan%20%28el%20original%20de%20Yotsuba%20B%29.meta.js
// ==/UserScript==




var cssUrl = "http://monstrochan.org/l/css/burichan.css";

var head = document.getElementsByTagName("head")[0];

var link = document.createElement("link");

link.rel = "stylesheet";
link.type = "text/css";
link.href = cssUrl;

document.head.appendChild(link);