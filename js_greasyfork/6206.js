// ==UserScript==
// @name        MTurk Confirm Return HIT (with queue support)
// @author      Chet Manley and Kerek
// @namespace   Kerek
// @version     0.2
// @description A prompt to confirm returning a HIT to prevent accidental returns.
// @include     https://www.mturk.com/mturk/accept*
// @include     https://www.mturk.com/mturk/continue*
// @include     https://www.mturk.com/mturk/preview*
// @include     https://www.mturk.com/mturk/return*
// @include     https://www.mturk.com/mturk/myhits*
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/6206/MTurk%20Confirm%20Return%20HIT%20%28with%20queue%20support%29.user.js
// @updateURL https://update.greasyfork.org/scripts/6206/MTurk%20Confirm%20Return%20HIT%20%28with%20queue%20support%29.meta.js
// ==/UserScript==

// v0.2, 2014-07-03 Added support for returns from HITs assigned to you/queue page
// v0.1, 2013-08-15 Confirm returning a HIT. Prevent accidental returns.
// ---------------------------------------------------------------------------

$('a[href^="/mturk/return?"]').click(function() {
    return confirm('Are you sure you want to return this HIT?\r\nPress OK to return the HIT or press Cancel to continue working on the HIT.');
});