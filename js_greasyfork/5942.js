// ==UserScript==
// @name          Mousehunt Redirector
// @description   Redirect to camp
// @run-at        document-start
// @include       http://www.mousehuntgame.com/login.php*
// @include       https://www.mousehuntgame.com/login.php
// @match	      https://www.mousehuntgame.com/login.php
// @version       1.0
// @namespace https://greasyfork.org/users/4406
// @downloadURL https://update.greasyfork.org/scripts/5942/Mousehunt%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/5942/Mousehunt%20Redirector.meta.js
// ==/UserScript==


window.location.assign("https://www.mousehuntgame.com/index.php");