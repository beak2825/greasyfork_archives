// ==UserScript==
// @name AbortSignal.timeout Polyfill
// @match :///*
// @description adds a function
// @version 0.0.1.20251017062141
// @namespace https://greasyfork.org/users/1527667
// @downloadURL https://update.greasyfork.org/scripts/552876/AbortSignaltimeout%20Polyfill.user.js
// @updateURL https://update.greasyfork.org/scripts/552876/AbortSignaltimeout%20Polyfill.meta.js
// ==/UserScript==
if (!AbortSignal.timeout) {
  AbortSignal.timeout = function (ms) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  };
}