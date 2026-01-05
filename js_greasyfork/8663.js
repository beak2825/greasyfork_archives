// ==UserScript==
// @name     Greasy Fork Yandex Browser Transparency
// @description Adds the Transparency feature for Yandex Browser (currently Yandex Alpha only) on Greasy Fork.
// @author   FickX
// @version  1.0
// @include  http://greasyfork.org/*
// @include	 http://www.greasyfork.org/*
// @include	 https://greasyfork.org/*
// @include	 https://www.greasyfork.org/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @domain	greasyfork.org
// @domain	www.greasyfork.org
// @namespace https://greasyfork.org/users/9805
// @downloadURL https://update.greasyfork.org/scripts/8663/Greasy%20Fork%20Yandex%20Browser%20Transparency.user.js
// @updateURL https://update.greasyfork.org/scripts/8663/Greasy%20Fork%20Yandex%20Browser%20Transparency.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/
$("head").append ( '                \
    <meta name="viewport" content="ya-title=#670000,ya-dock=fade"> !important             \
    </meta>                          \
' );
