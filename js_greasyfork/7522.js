// ==UserScript==
// @name          CSS: Tuitderp
// @namespace     MonstroChan.org
// @description    Cambiar la CSS porque no sirve la chingadera
// @include        *monstrochan.org/l*
// @version 0.0.1.20150116054999
// @downloadURL https://update.greasyfork.org/scripts/7522/CSS%3A%20Tuitderp.user.js
// @updateURL https://update.greasyfork.org/scripts/7522/CSS%3A%20Tuitderp.meta.js
// ==/UserScript==




var cssUrl = "http://monstrochan.org/l/css/twitah.css";

var head = document.getElementsByTagName("head")[0];

var link = document.createElement("link");

link.rel = "stylesheet";
link.type = "text/css";
link.href = cssUrl;

document.head.appendChild(link);