// ==UserScript==
// @name         Reachat Fix Instance Lock
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Fix instance variable lock
// @match        https://reachat.org/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553761/Reachat%20Fix%20Instance%20Lock.user.js
// @updateURL https://update.greasyfork.org/scripts/553761/Reachat%20Fix%20Instance%20Lock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('=== Reachat Instance Fix ===');

    // instanse変数を強制的にfalseにリセット
    if (typeof instanse !== 'undefined') {
        window.instanse = false;
        console.log('instanse reset to false');
    }

    // 定期的にチェックしてリセット（エラーで固まった場合の対策）
    setInterval(function() {
        if (typeof instanse !== 'undefined' && instanse === true) {
            console.warn('instanse was stuck at true, resetting...');
            window.instanse = false;
        }
    }, 1000);

    // エラーハンドリングも追加
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        console.log('Error suppressed:', msg);
        // エラーが起きたらinstanseをリセット
        if (typeof instanse !== 'undefined') {
            window.instanse = false;
        }
        return true;
    };

    // AJAX エラー時に instanse をリセット
    if (typeof $ !== 'undefined') {
        $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
            window.instanse = false;
        });

        $(document).ajaxComplete(function(event, jqxhr, settings) {
        });
    }

    console.log('=== Instance Fix Loaded ===');
})();