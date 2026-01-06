// ==UserScript==
// @name         DMM/Fanza Games for Mobile Browser design fix
// @namespace    http://tampermonkey.net/
// @version      2026-01-06
// @description  DMMおよびFanzaのブラウザゲーム画面を開いた際に画面が途中で欠けてしまう問題を修正します。
// @match        https://play.games.dmm.co.jp/*
// @match        https://play.games.dmm.com/*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/560289/DMMFanza%20Games%20for%20Mobile%20Browser%20design%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/560289/DMMFanza%20Games%20for%20Mobile%20Browser%20design%20fix.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_addStyle('.gamesResetStyle > main { width: 1280px !important;');
    GM_addStyle('.gamesResetStyle > main > iframe { width: 100% !important;');
})();