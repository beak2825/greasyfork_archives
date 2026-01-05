// ==UserScript==
// @name           filmpreservation.org link extractor
// @namespace      surrealmoviez.info
// @description    Prints the video direct download link
// @include        http://www.filmpreservation.org/preserved-films/screening-room/*
// @grant          none
// @version        0.0.1
// @downloadURL https://update.greasyfork.org/scripts/6737/filmpreservationorg%20link%20extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/6737/filmpreservationorg%20link%20extractor.meta.js
// ==/UserScript==

$('<h2 style="font-size: 11px; color: grey; margin-bottom: 7px;">Download link: <span id="direct-link">Not found</span></div></h2>').insertAfter('h3.video');

var visibleLink = $('#film > p > a:contains(HERE)');
if (visibleLink.length === 1) {
    $('#direct-link').text(visibleLink.attr('href'));
} else {
    $('#direct-link').text('http://s3.amazonaws.com/nfpf-videos/' + $('#film .film-player').attr('data-download-file'));
}