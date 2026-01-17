// ==UserScript==
// @name         quizlet time patcher
// @namespace    http://tampermonkey.net/
// @version      2026-01-16
// @description  slows down time in quizlet match
// @author       Max-0
// @match        https://quizlet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quizlet.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562939/quizlet%20time%20patcher.user.js
// @updateURL https://update.greasyfork.org/scripts/562939/quizlet%20time%20patcher.meta.js
// ==/UserScript==

const time_scale = 0.1;

// date override attempt (not helpful)
/*
const realDateNow = Date.now;

Date.now = () => { return realDateNow() * window.time_scale; };

Object.freeze(Date.now)
Object.seal(Date.now)
*/

// debugging attempt
// i put a breakpoint on when the time div changes in Matching game
// go back far on the stack trace all the way to "x", which is soon after (above) the postMessage
// i saw "performance" used for getting current time.
// i wasn't sure exactly what was going on, but i knew it related to the counter via p.expirationTime and unstable_now() and other functions.
// lets try to hijack the "perfomance" object

const real_perf_now = performance.now.bind(performance);

performance.now = () => {
  return Math.floor(real_perf_now() * time_scale);
};

Object.freeze(performance.now);
Object.seal(performance.now);
