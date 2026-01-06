// ==UserScript==
// @name     Nitter Auto Theme Cookie
// @description Automatically set theme cookie and URL param on Nitter
// @version  1.1.0
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
    var themeName = 'theme'
    var themeValue = 'Auto'
    var paramAbsent=false
    var cookieAbsent=false
    var themeChanged=false
    var url

    if ('URL' in window) {
      url = new URL(window.location);
      if(url.searchParams.get(themeName, themeValue) === null) {
        paramAbsent=true
      }
    }
    if (document.cookie.indexOf(themeName) == -1 ) {
      cookieAbsent=true
    }

    if (paramAbsent) {
      url.searchParams.set(themeName, themeValue);
      themeChanged=true
    }

    if(cookieAbsent) {
      document.cookie = `${themeName}=${themeValue}`;
      themeChanged=true
    }

    if(themeChanged) {
      window.location = url;
    }
  }
)();


  // {{{ changelog :

  // [2026-01-05 Mon] Set URL param and cookie

  // [2025-11-11 Tue] Hello

  // }}}

  // {{{ contact :

  // }}}
