// ==UserScript==
// @name        r3 wiki double url redirect v1.0
// @description redirects if r3 wiki bug appears
// @author      ruru4143
// @namespace   ruru4143-r3-wiki-fix
// @version     1.0
// @license     MIT
// @include     https://realraum.at/wiki/doku.php/wiki/doku.php*
// @match       https://realraum.at/wiki/doku.php/wiki/doku.php*
// @icon        https://realraum.at/wiki/lib/tpl/bootstrap3/images/favicon.ico
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/550575/r3%20wiki%20double%20url%20redirect%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/550575/r3%20wiki%20double%20url%20redirect%20v10.meta.js
// ==/UserScript==

window.location = window.location.href.replace( "wiki/doku.php/wiki/doku.php", "wiki/doku.php" );
