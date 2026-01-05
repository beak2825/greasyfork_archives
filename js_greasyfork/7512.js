// ==UserScript==
// @name         Fix SA Breadcrumbs Hover For Chrome
// @namespace    http://mpeveler.com
// @version      0.1
// @description  Fixes the hover box on the Forum breadcrumb such that it doesn't disappear when you go to click on it or if you're not fast enough
// @author       Matthew "Master_Odin" Peveler
// @match        http://forums.somethingawful.com/*
// @match		 https://forums.somethingawful.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/7512/Fix%20SA%20Breadcrumbs%20Hover%20For%20Chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/7512/Fix%20SA%20Breadcrumbs%20Hover%20For%20Chrome.meta.js
// ==/UserScript==

GM_addStyle("div.breadcrumbs a.up span { bottom: 14px; }");