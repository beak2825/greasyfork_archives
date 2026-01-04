// ==UserScript==
// @name        CubeRealm FPS Unlocker
// @match       https://cuberealm.io/*
// @run-at      document-start
// @grant       none
// @version     1.0
// @description يحاول تعطيل V-Sync لرفع معدل الإطارات في اللعبة
// @namespace https://greasyfork.org/users/1555476
// @downloadURL https://update.greasyfork.org/scripts/561222/CubeRealm%20FPS%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/561222/CubeRealm%20FPS%20Unlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // استبدال requestAnimationFrame لتجاوز قيد 60 FPS
    window.requestAnimationFrame = function(callback) {
        return setTimeout(function() {
            callback(performance.now());
        }, 0); // أسرع تحديث ممكن
    };

    console.log("[FPS Unlocker] تم تعطيل V-Sync ومحاولة رفع معدل الإطارات.");
})();