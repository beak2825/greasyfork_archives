// ==UserScript==
// @name         Mastodon Bird UI
// @description  A UserScript that applies the Mastodon Bird UI style to mastodon.social
// @author       dayanamayan (https://ieji.de/@eg/110174544387143309) Modified by Ap
// @version      7.1
// @match        https://mastodon.social/*
// @namespace    ieji.de/@eg/110174544387143309
// @icon         https://joinmastodon.org/logos/logo-purple.svg
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @homepage     https://gist.github.com/egecelikci/bcd4d543564cba8ebe6536f23886fcd9
// @resource     layout-single-column https://cdn.jsdelivr.net/gh/ronilaukkarinen/mastodon-bird-ui@main/layout-single-column.css
// @resource     layout-multiple-columns https://cdn.jsdelivr.net/gh/ronilaukkarinen/mastodon-bird-ui@main/layout-multiple-columns.css
// @downloadURL https://update.greasyfork.org/scripts/549242/Mastodon%20Bird%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/549242/Mastodon%20Bird%20UI.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText('layout-single-column'));
GM_addStyle(GM_getResourceText('layout-multiple-columns'));
