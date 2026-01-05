// ==UserScript==
// @name     Asatro News Zoom Fix
// @description  Fixes the problem with the page layout when zooming in.
// @include  http://www.englishnews.org/*
// @include  http://englishnews.org/*
// @grant    GM_addStyle
// @version 0.0.1.20150525193717
// @namespace https://greasyfork.org/users/8350
// @downloadURL https://update.greasyfork.org/scripts/9235/Asatro%20News%20Zoom%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/9235/Asatro%20News%20Zoom%20Fix.meta.js
// ==/UserScript==

GM_addStyle ( ".responsive .responsive-layout-row-3 .responsive-tablet-layout-cell, .responsive.responsive-tablet .footer .content-layout .responsive-layout-row-3 .layout-cell {width: 100% !important;}");
