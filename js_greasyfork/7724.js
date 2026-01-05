// ==UserScript==
// @name        ShowRSS --> torrentz.eu search
// @namespace   userscript.danielrozenberg.com
// @description Creates a link to search for 
// @include     http://showrss.info/*
// @include     https://showrss.info/*
// @version     1.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7724/ShowRSS%20--%3E%20torrentzeu%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/7724/ShowRSS%20--%3E%20torrentzeu%20search.meta.js
// ==/UserScript==

var ENTRY_TEXT_REGEXP = /^(.+) (\d+)x(\d+).*$/;
    
var newStyle = document.createElement('style');
newStyle.setAttribute('type', 'text/css');
newStyle.textContent = 'div.torrentz { display: inline; margin-left: 2em; color: silver; }' +
    'div.torrentz span::after { content: ":" }' +
    'div.torrentz a { margin-left: 0.5em; color: silver; text-decoration: underline; }' +
    'div.torrentz a:hover { color: gray; }';
document.head.appendChild(newStyle);

var showEntries = document.querySelectorAll('#show_timeline div.showentry');
console.debug(showEntries);
for (var i = 0; i < showEntries.length; i++) {
    var showEntry = showEntries[i];
    var entry = showEntry.querySelector('a:not([class^="checkbox_"])').textContent.match(ENTRY_TEXT_REGEXP);
    if (entry) {
        var filteredClass = showEntry.getElementsByTagName('a')[0].classList.contains('filtered') ? 'filtered' : 'unfiltered';
        var title = entry[1];
        var season = parseInt(entry[2]);
        season = ((season < 10) ? '0' : '') + season;
        var episode = 's' + season + 'e' + entry[3];
        
        var torrentzDiv = document.createElement('div');
        torrentzDiv.classList.add('torrentz');
        torrentzDiv.classList.add(filteredClass);
        
        torrentzDiv.innerHTML = '<span>Search Torrentz</span>' +
            '<a href="https://torrentz.eu/search?q=' + encodeURIComponent(title + ' ' + episode + ' 1080p') + '">1080p</a>' +
            '<a href="https://torrentz.eu/search?q=' + encodeURIComponent(title + ' ' + episode + ' 720p') + '">720p</a>' +
            '<a href="https://torrentz.eu/search?q=' + encodeURIComponent(title + ' ' + episode) + '">SD</a>';
        showEntry.appendChild(torrentzDiv);
    }
    
}
