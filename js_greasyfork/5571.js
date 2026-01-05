// ==UserScript==
// @name         Pinboard Notes Filter
// @description  Add a filter for viewing your Pinboard notes
// @author       wenLiangcan
// @version      0.3
// @namespace    https://github.com/wenLiangcan
// @homepage     https://github.com/wenLiangcan/Userscripts
// @license      GPL version 3 (http://www.gnu.org/licenses/gpl.txt)
// @copyright    Copyright © 2014 wenLiangcan
// @updateURL
// @downloadURL
// @include      http://pinboard.in/*
// @include      https://pinboard.in/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/5571/Pinboard%20Notes%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/5571/Pinboard%20Notes%20Filter.meta.js
// ==/UserScript==

(function() {
    var user = document.getElementsByClassName('banner_username')[0].getAttribute('href');
    var filters = document.getElementsByClassName('filter');
    if (filters.length !== 0) {
        var lastFilter = filters[filters.length - 1];
        lastFilter.insertAdjacentHTML('afterend', ' ‧  <a href="' + user + '/from:notes " class="filter ">notes</a>');
    }
})();
