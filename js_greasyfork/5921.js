// ==UserScript==
// @name           Filmtipset Custom Search Links
// @namespace      none
// @description    Adds custom search links on each movie page. Edit the code to add and remove links.
// @version        0.1.1
// @include        http://www.filmtipset.se/film/*
// @downloadURL https://update.greasyfork.org/scripts/5921/Filmtipset%20Custom%20Search%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/5921/Filmtipset%20Custom%20Search%20Links.meta.js
// ==/UserScript==


//Some setup
var menuTitle = "Mina anpassade";

var urlList = [
    {title: 'Yahoo Movies', url: 'http://movies.yahoo.com/mv/search?&p=%s'},       //%s is replace by the movie title
    {title: 'Youtube',      url: 'http://www.youtube.com/results?search_query=%s'},
    {title: 'Google',       url: 'https://www.google.com/search?q=%s'}                  //Last row no comma
];

//End Setup

var xpath = '//b[contains(.,"Originaltitel")]/../../td[2]';
var title = document.evaluate(xpath, document, null, XPathResult.STRING_TYPE, null);
var t     = encodeURIComponent(title.stringValue.trim());
var elMenuItem   = document.querySelector("td > div.rightlinkheader");
var elMenu       = elMenuItem.parentNode;
var elHeading    = document.createElement("div");
elHeading.innerHTML = menuTitle;
elHeading.className = "rightlinkheader";
elMenu.insertBefore(elHeading, elMenuItem);
for(var i in urlList) {
    var a       = document.createElement('a');
    a.href      = urlList[i].url.replace('%s',t);
    a.innerHTML = ' - ' + urlList[i].title;
    var d       = document.createElement('div');
    d.className = 'rightlink';
    d.appendChild(a);
    elMenu.insertBefore(d, elMenuItem);
}