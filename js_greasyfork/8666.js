// ==UserScript==
// @name     WARP Records Yandex Browser Transparency
// @description Adds the Transparency feature for Yandex Browser (currently Yandex Alpha only) on WARP Records.
// @author   FickX
// @version  1.0
// @include  http://warp.net/*
// @include	 http://www.warp.net/*
// @include	 https://warp.net/*
// @include	 https://www.warp.net/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @domain	warp.net
// @domain	www.warp.net
// @namespace https://greasyfork.org/users/9805
// @downloadURL https://update.greasyfork.org/scripts/8666/WARP%20Records%20Yandex%20Browser%20Transparency.user.js
// @updateURL https://update.greasyfork.org/scripts/8666/WARP%20Records%20Yandex%20Browser%20Transparency.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/
$("head").append ( '                \
    <meta name="viewport" content="ya-title=#6E32FF,ya-dock=fade"> !important             \
    </meta>                          \
' );

