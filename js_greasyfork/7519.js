// ==UserScript==
// @name          CSS: Futaba
// @namespace     MonstroChan.org
// @description    Cambiar la CSS porque no sirve la chingadera
// @include        *monstrochan.org/l*
// @version 0.0.1.20150116054999
// @downloadURL https://update.greasyfork.org/scripts/7519/CSS%3A%20Futaba.user.js
// @updateURL https://update.greasyfork.org/scripts/7519/CSS%3A%20Futaba.meta.js
// ==/UserScript==




var cssUrl = "http://monstrochan.org/l/css/futaba.css";

var head = document.getElementsByTagName("head")[0];

var link = document.createElement("link");

link.rel = "stylesheet";
link.type = "text/css";
link.href = cssUrl;

document.head.appendChild(link);