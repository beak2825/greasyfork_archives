// ==UserScript==
// @name     Uguu.se Yandex Browser Transparency
// @description Adds the Transparency feature for Yandex Browser (currently Yandex Alpha only) on Uguu.se.
// @author   FickX
// @version  1.0
// @include  http://uguu.se/*
// @include	 http://www.uguu.se/*
// @include	 https://uguu.se/*
// @include	 https://www.uguu.se/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @domain	uguu.se
// @domain	www.uguu.se
// @namespace https://greasyfork.org/users/9805
// @downloadURL https://update.greasyfork.org/scripts/8662/Uguuse%20Yandex%20Browser%20Transparency.user.js
// @updateURL https://update.greasyfork.org/scripts/8662/Uguuse%20Yandex%20Browser%20Transparency.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/
$("head").append ( '                \
    <meta name="viewport" content="ya-title=#546e7a,ya-dock=fade"> !important             \
    </meta>                          \
' );
