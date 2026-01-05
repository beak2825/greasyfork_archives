// ==UserScript==
// @name            Open Links in New Tabs
// @description     Change the target attribute of specific anchor object to '_blank'
// @include         http://exhentai.org/*
// @include         https://exhentai.org/*
// @include         http://e-hentai.org/*
// @include         https://e-hentai.org/*
// @include         http://g.e-hentai.org/*
// @include         https://g.e-hentai.org/*
// @version 0.0.1.20170121224917
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/9103/Open%20Links%20in%20New%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/9103/Open%20Links%20in%20New%20Tabs.meta.js
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

if(/^https?:\/\/((ex)|(e-)|(g\.))/.test(href)) {
    var lnks = $$('.itg a')
    if(lnks) { for(var i=lnks.length-1; i>=0; i--) { lnks[i].target = '_blank' } }
    var lnks = $$('#gdt a')
    if(lnks) { for(var i=lnks.length-1; i>=0; i--) { lnks[i].target = '_blank' } }
}
