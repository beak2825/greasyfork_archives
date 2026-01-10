// ==UserScript==
// @name         Hide Voice Suggestions
// @namespace    http://voice.google.com/
// @version      2026-01-10
// @description  Remove the suggested call list from Google Voice
// @author       Steve
// @license      MIT
// @match        https://voice.google.com/u/0/calls
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/562150/Hide%20Voice%20Suggestions.user.js
// @updateURL https://update.greasyfork.org/scripts/562150/Hide%20Voice%20Suggestions.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('section.ng-star-inserted').remove();
})();