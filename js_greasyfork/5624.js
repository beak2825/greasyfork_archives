// ==UserScript==
// @name         Mark Read Creepypasta.com
// @namespace    http://herbalcell.com
// @version      0.4
// @description  Mark stories as read on Creepypasta.com
// @match        http://www.creepypasta.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @downloadURL https://update.greasyfork.org/scripts/5624/Mark%20Read%20Creepypastacom.user.js
// @updateURL https://update.greasyfork.org/scripts/5624/Mark%20Read%20Creepypastacom.meta.js
// ==/UserScript==


var storedHiddenTitles = JSON.parse(localStorage.storedHiddenTitles || '{}');
$('head').append(
    "<link href='http://fonts.googleapis.com/css?family=Special+Elite|Droid+Serif' rel='stylesheet' type='text/css'>" +
    '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css">' +
    '<style>' +
        '.hidden-and-read, .hidden-and-read a {font-style:italic; text-decoration:line-through; color:#888}' +
        '.post-content table tbody tr:hover {background: #333;}' +
        'a {color: #999; text-shadow: 0 0 6px #f00;}' +
        'a:hover {color: #a00; text-shadow: 0 0 6px #000;}' +
    '</style>'
);

waitForKeyElements ('.post-content table', doAllTheHidin);

function doAllTheHidin() {

    var hideColumnHeader = $('.post-content table thead tr td.rating').last();
    hideColumnHeader.html('<a style="cursor:pointer;cursor:hand;">Show</a>');
    hideColumnHeader.click(function(e) {
        $('.post-content table tbody tr:hidden').show();
    });
    $('.post-content table tbody tr').each(function() {
        var currentRow = $(this);
        var currentTitle = currentRow.find('td.title').text();
        var hideColumn = currentRow.find('td.rating').last();
        hideColumn.html('<a style="cursor:pointer;cursor:hand;"><i class="fa fa-close"></i></a>');
        hideColumn.attr('class','hide-link');
        hideColumn.click(function(e) {
            storedHiddenTitles[currentTitle] = true;
            localStorage.storedHiddenTitles = JSON.stringify(storedHiddenTitles);
            currentRow.hide();
            currentRow.addClass('hidden-and-read');
        });
        if (storedHiddenTitles[currentTitle] !== undefined) {
            currentRow.hide();
            currentRow.addClass('hidden-and-read');
        }
    });
}