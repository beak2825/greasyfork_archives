// ==UserScript==
// @name           Arjlover transliterator
// @namespace      surrealmoviez.info
// @description    Make arjlover.net easier to browse for people that can't read Cyrillic
// @require        http://code.jquery.com/jquery-1.11.1.min.js
// @include        http://film.arjlover.net/film/
// @include        http://multiki.arjlover.net/multiki/
// @include        http://filmiki.arjlover.net/filmiki/
// @include        http://film.arjlover.net/film/indext.html
// @grant          none
// @version        0.0.1
// @downloadURL https://update.greasyfork.org/scripts/6729/Arjlover%20transliterator.user.js
// @updateURL https://update.greasyfork.org/scripts/6729/Arjlover%20transliterator.meta.js
// ==/UserScript==

$('.o, .e').each(function () {
    var fileName = $('td > a:contains(http)', $(this)).attr('href');
    fileName = fileName.substring(fileName.lastIndexOf('/') + 1, fileName.lastIndexOf('.')).split('.').join(' ');
    $('td:eq(1)', $(this)).append('<br><span style="color: grey; font-size: 11;">' + fileName + '</span>');
});
