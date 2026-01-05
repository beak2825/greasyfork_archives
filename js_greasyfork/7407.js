// ==UserScript==
// @name           GayRomeo Optimizer +
// @namespace      http://marvinate.wordpress.com
// @description    This script was deleted from Greasy Fork, and due to its negative effects, it has been automatically removed from your browser.
//
// - For the GR-Search result -
// @_include        /https?://(www\.(gay|planet)romeo.com|83\.98\.143\.20)/.*search/.*/
// @match        *://*.gayromeo.com/*search/*
// @match        *://*.planetromeo.com/*search/*
// @match        *://83.98.143.20/*search/*
//                ^--that's for the search list enhancements
// 'include /.../ ' with RegExp is not supported by Chrome -
//  since Greasemonkey 0.9.8 (Aug 2011) also supports 'match' I don't use 'include'
//
// - For the Myuser -
// @match        *://*.gayromeo.com/*myuser/*
// @match        *://*.planetromeo.com/*myuser/*
// @match        *://83.98.143.20/*myuser/*
//
// - For the Messages -
// @match        *://*.gayromeo.com/*messages/*
// @match        *://*.planetromeo.com/*messages/*
// @match        *://83.98.143.20/*messages/*
//
// - For the Forum -
// @match        *://*.gayromeo.com/*auswertung/setcard/club/forum*
// @match        *://*.planetromeo.com/*auswertung/setcard/club/forum*
// @match        *://83.98.143.20/*auswertung/setcard/club/forum*
//
// @_include        /https?://(www\.(gay|planet)romeo.com|83\.98\.143\.20)/.*auswertung/pix/popup.*/
// @match        *://*.gayromeo.com/*auswertung/pix/popup*
// @match        *://*.planetromeo.com/*auswertung/pix/popup*
// @match        *://83.98.143.20/*auswertung/pix/popup*
//                ^--For close picture by clicking on it.
//
// @grant          GM_xmlhttpRequest
// @version        1.6.0.1
// @downloadURL https://update.greasyfork.org/scripts/7407/GayRomeo%20Optimizer%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/7407/GayRomeo%20Optimizer%20%2B.meta.js
// ==/UserScript==
