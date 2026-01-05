// ==UserScript==
// @name        Automatic Steam Linkfilter Reroute
// @namespace   no-steam-linkfilter
// @author      Veeno
// @description Automatically redirects from the Steam link filter page.
// @include     *steamcommunity.com/linkfilter*
// @version     1.0
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/7818/Automatic%20Steam%20Linkfilter%20Reroute.user.js
// @updateURL https://update.greasyfork.org/scripts/7818/Automatic%20Steam%20Linkfilter%20Reroute.meta.js
// ==/UserScript==

window.location.replace(location.search.replace('?url=', ''));