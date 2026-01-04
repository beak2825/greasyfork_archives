// ==UserScript==
// @name         lookmovie2.to — Premium overlay - auto CLOSE
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Closes that everpresent "Premium overlay" and starts the video
// @match        https://www.lookmovie2.to/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556551/lookmovie2to%20%E2%80%94%20Premium%20overlay%20-%20auto%20CLOSE.user.js
// @updateURL https://update.greasyfork.org/scripts/556551/lookmovie2to%20%E2%80%94%20Premium%20overlay%20-%20auto%20CLOSE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // watcher
    const interval = setInterval(() => {
        if (typeof unsafeWindow.initPrePlaybackCounter === "function") {
            clearInterval(interval);

            console.log("[TM] Overwritting initPrePlaybackCounter");

            unsafeWindow.initPrePlaybackCounter = function() {
                return {
                    cancel: function(){},
                    then: function(cb){ try { cb(); } catch (e){} return this; },
                    catch: function(){ return this; },
                    finally: function(cb){ try { cb(); } catch (e){} return this; }
                };
            };

            // unlock scrolling if it's locked
            Object.defineProperty(document.body.style, "overflow", { value: "auto", writable: true });
        }
    }, 50);

})();
