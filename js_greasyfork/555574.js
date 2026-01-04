// ==UserScript==
// @name     Nitter Auto Theme Cookie
// @description Automatically set theme cookie on Nitter
// @version  1.0.0
// @include *nitter*
// @include *xcancel*
// @grant none
// @namespace https://github.com/rorycaputo
// @license GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepageURL https://github.com/rorycaputo
// @icon https://nitter.poast.org/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/555574/Nitter%20Auto%20Theme%20Cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/555574/Nitter%20Auto%20Theme%20Cookie.meta.js
// ==/UserScript==

(
  function() {
    'use strict';

    if (document.cookie.indexOf('theme') == -1 ) {
      document.cookie = "theme=Auto";
      location.reload();
    }
  }
)();


  // {{{ changelog :

  // [2025-11-11 Tue] Hello

  // }}}

  // {{{ contact :

  // }}}
