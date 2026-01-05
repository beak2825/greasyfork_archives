// ==UserScript==
// @name     Kickass Torrents Yandex Browser Transparency
// @description Adds the Transparency feature for Yandex Browser (currently Yandex Alpha only) on Kickass Torrents.
// @author   FickX
// @version  1.0
// @include  http://kickass.to/*
// @include	 http://www.kickass.to/*
// @include	 https://kickass.to/*
// @include	 https://www.kickass.to/*
// @include  http://kickass.so/*
// @include	 http://www.kickass.so/*
// @include	 https://kickass.so/*
// @include	 https://www.kickass.to/*
// @include  http://kickass.so/*
// @include	 http://www.kat.ph/*
// @include	 https://kat.ph/*
// @include	 https://www.kat.ph/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @domain	kickass.to
// @domain	www.kickass.to
// @domain	kickass.so
// @domain	www.kickass.so
// @domain	kat.ph
// @domain	www.kat.ph
// @namespace https://greasyfork.org/users/9805
// @downloadURL https://update.greasyfork.org/scripts/8661/Kickass%20Torrents%20Yandex%20Browser%20Transparency.user.js
// @updateURL https://update.greasyfork.org/scripts/8661/Kickass%20Torrents%20Yandex%20Browser%20Transparency.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/
$("head").append ( '                \
    <meta name="viewport" content="ya-title=#594c2d,ya-dock=fade">             \
    </meta>                          \
' );
