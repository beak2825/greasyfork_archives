// ==UserScript==
// @name         [grom] phpBB forum helper
// @namespace    grom
// @description  phpBB: view user's posts and topics; cleans (tab) titles; removes ads and hidden metadata.
// @version      1.0.1.150211
////          ProSilver          \\\\
// @match        *://adblockplus.org/forum/*
// @match        *://custombuttons.sourceforge.net/forum/*
// @match        *://forums.mozillazine.org/*
// @match        *://foldingforum.org/*
// @match        *://forums.debian.net/*
// @match        *://forums.informaction.com/*
// @match        *://forums.lanik.us/*
// @match        *://forums.linuxmint.com/*
// @match        *://forums.sandboxie.com/*
// @match        *://forums.virtualbox.org/*
// @match        *://forums.wesnoth.org/*
// @match        *://forums.xkcd.com/*
// @match        *://forum.enjoysudoku.com/*
// @match        *://forum.freegamedev.net/*
// @match        *://forum.openoffice.org/*
// @match        *://forum.palemoon.org/*
// @match        *://forum.videolan.org/*
// @match        *://ibdof.com/*
// @match        *://newsgroup.xnview.com/*
// @match        *://www.sublimetext.com/forum/*
// @match        *://*.synthesiagame.com/forum/*
////          SubSilver2          \\\\
// @match        *://tmp.garyr.net/forum/*
// @match        *://ahkscript.org/boards/*
// @match        *://www.dostips.com/forum/*
////          SubSilver1          \\\\
// @match        *://*.murga-linux.com/puppy/*
// @match        *://www.ppmsite.com/forum/*
// @grant        none
// @noframes
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/7999/%5Bgrom%5D%20phpBB%20forum%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/7999/%5Bgrom%5D%20phpBB%20forum%20helper.meta.js
// ==/UserScript==

// shorthands
//function $i(a) { return document.getElementById(a); }
//function $(a,b) { return (b||document.body).querySelector(a); }
function $$(a,b) { return (b||document.body).querySelectorAll(a); }
function $c(a,b) { return (b||document.body).getElementsByClassName(a); }
function $t(a,b) { return (b||document.body).getElementsByTagName(a); }
//function $n(a,b) { return (b||document.body).getElementsByName(a); }
//var $body = document.body;

// trim title
var loc = location.hostname;
if (loc.match('adblockplus|custombuttons|foldingforum|debian|informaction|lanik\.us|linuxmint|sandboxie|virtualbox|wesnoth|xkcd\.com|palemoon|ibdof\.com|xnview\.com|sublimetext|synthesiagame'))
    document.title=document.title.replace(/^[a-zA-Z\s\.-]+• (?:View topic - |View forum - )?/, '');
else if (loc.match('freegamedev')) document.title=document.title.replace(/(?:Topic - |Forum - )?(.*) • FreeGameDev Forums - Open Source Game Development/, '$1');
else if (loc.match('mozillazine')) document.title=document.title.replace(' • mozillaZine Forums', '');
else if (loc.match('videolan')) document.title=document.title.replace(' - The VideoLAN Forums', '');
else if (loc.match('ahkscript')) document.title=document.title.replace(/ (- View topic )?• AHKScript/, '');
else if (loc.match('dostips')) document.title=document.title.replace(/DosTips.com - (?:View (?:topic|forum) - )?/, '');
else if (loc.match('murga-linux|ppmsite')) document.title=document.title.replace(/^[a-zA-Z\s\.-]+:: (?:View (?:[Ff]orum|[Tt]opic) - )?/, '');

// if on Custom Buttons forum
if (loc.match('custombuttons.sourceforge.net')) {
  // attach favicon
  var link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAU58Ald3/lQA+PJimAAAAI0lEQVQIW2MIBQIGBwYGRiChtRAHAZYFEl4rgEqwEWBZkFEAf58RlaqHEPcAAAAASUVORK5CYII=';
  $t('head', document)[0].appendChild(link);
}

// remove ads and some metadata
var trash = $$('#gootop, #goobot, .adsbygoogle, meta[name="description"], meta[name="keywords"], meta[name="copyright"], meta[content="IE=EmulateIE7; IE=EmulateIE9"]', document);
for (var i=0,len=trash.length; i<len; i++) trash[i].remove();

// view user's posts; DO NOT 'use strict';
// ProSilver
var list = $c('postprofile'),
    user;
if (list) {
  function mkLink(word, user) { // < breaking 'use strict';
    var a = document.createElement('a');
    a.title = 'View ' + word + 's';
    a.textContent = word;
    a.href = 'search.php?sr=' + word + 's&author_id=' + user;
    a.className = 'icon-search';
    a.style.marginLeft = '.5em';
    a.style.opacity = '.7';
    // some sites have broken ".icon-search" style; redeclare:
    a.style.paddingLeft = '17px';
    a.style.backgroundPosition = '0 50%';
    a.style.backgroundRepeat = 'no-repeat';
    return a;
  }
  for (var i=0,len=list.length; i<len; i++) {
    user = $t('a', list[i])[0];
    if (!user) { continue; } // where registration not required
    user = user.href.match(/\d+/)[0];
    list[i].appendChild(mkLink('post', user));
    list[i].appendChild(mkLink('topic', user));
  }
}
// SubSilver2
var list = $c('postauthor');
if (list) {
  function mkLink(word, user) { // < breaking 'use strict';
    var a = document.createElement('a');
    a.title = 'View ' + word;
    a.textContent = word;
    a.href = 'search.php?sr=' + word + '&author=' + user;
    a.style.margin = '0 .5em';
    a.style.opacity = '.5';
    return a;
  }
  for (var i=0,len=list.length; i<len; i++) {
    user = list[i].textContent;
    list[i].appendChild(document.createElement('br'));
    list[i].appendChild(mkLink('posts', user));
    list[i].appendChild(mkLink('topics', user));
  }
}
// SubSilver1
var list = $c('name');
if (list) for (var i=0,len=list.length; i<len; i++) {
  user = list[i].textContent;
  var a = document.createElement('a');
  a.title = 'View posts';
  a.href = 'search.php?search_author=' + user;
  a.style.marginLeft = '.5em';
  var img = a.appendChild(document.createElement('img'));
  img.src = 'templates/subSilver/images/icon_mini_search.gif';
  img.style.verticalAlign = 'bottom';
  list[i].appendChild(a);
}

// clear memory
var loc='', trash='', a='', list='', user='', i='', len='';