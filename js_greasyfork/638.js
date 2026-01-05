// ==UserScript==
// @name       Metrolyrics - We know they're lyrics!
// @namespace  http://userscripts.org/users/322169
// @version    0.2.1
// @description  Removes superfluous use of the word "lyrics" on Metrolyrics.
// @include    http://www.metrolyrics.com/*
// @copyright  2012, James Wood
// @downloadURL https://update.greasyfork.org/scripts/638/Metrolyrics%20-%20We%20know%20they%27re%20lyrics%21.user.js
// @updateURL https://update.greasyfork.org/scripts/638/Metrolyrics%20-%20We%20know%20they%27re%20lyrics%21.meta.js
// ==/UserScript==

(function() {
    var els = document.querySelectorAll('h1, h2, a');
    for (var i = 0; i < els.length; i++)
        els[i].innerHTML = els[i].innerHTML.replace(/ lyrics\s*$/i, '');
    // Bug fix:
    els = document.querySelectorAll('strong');
    for (var i = 0; i < els.length; i++)
        els[i].innerHTML = els[i].innerHTML.replace(/ lyrics\s*$/i, '');
    document.title = document.title.replace(/ LYRICS$/i, '');
})();