// ==UserScript==
// @name        TMD topic color
// @description coloreaza topicurile care le doresti
// @include     *torrentsmd.*/watcher.php
// @version     1.0
// @author      Drakulaboy
// @icon         http://s017.radikal.ru/i432/1308/7b/34fa18a96812.png
// @require     http://code.jquery.com/jquery-1.10.2.js
// @namespace https://greasyfork.org/users/213
// @downloadURL https://update.greasyfork.org/scripts/7461/TMD%20topic%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/7461/TMD%20topic%20color.meta.js
// ==/UserScript==

$(document).ready(function () {
    var exclude = ['TOP ACHTUNG', 
                   'Dexter',
                  'Suits',
                  'Lightroom',
                  'Breaking Bad',
                  'Supernatural',
                  'Sherlock',];
    
    exclude.forEach(function(i){
        $('tbody tr:contains(' + i + ')').css("background-color", "#15d65c") ;
    });
});