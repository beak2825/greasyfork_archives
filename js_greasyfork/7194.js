// ==UserScript==
// @name            Image Remover for the E-Hentai Forums
// @description     Removes specified images in the E-Hentai forums
// @include         http://forums.e-hentai.org/*
// @version 0.0.1.20150718213008
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/7194/Image%20Remover%20for%20the%20E-Hentai%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/7194/Image%20Remover%20for%20the%20E-Hentai%20Forums.meta.js
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var imgs = $$('IMG')
if(imgs) {
    var p = [
        /\bstyle_emoticons\//,
        /\/folder_post_icons\//,
        /\/ehgt\/cm\//,
    ]
    for(var i=imgs.length-1; i>=0; i--) {
        for(var a=0, len=p.length; a<len; a++) {
            if(p[a].test(imgs[i].src)) {
                imgs[i].style.display = 'none'
                break
            }
        }
    }
}
