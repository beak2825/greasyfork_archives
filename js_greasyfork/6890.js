// ==UserScript==
// @name           HV Lottery Prize Reminder 2 (lite version)
// @description    Show the grand prizes of daily lotteries on the left bottom of the screen
// @include        http://hentaiverse.org/*
// @exclude        http://hentaiverse.org/?s=Battle*
// @version 0.0.1.20150415200509
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/6890/HV%20Lottery%20Prize%20Reminder%202%20%28lite%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/6890/HV%20Lottery%20Prize%20Reminder%202%20%28lite%20version%29.meta.js
// ==/UserScript==

if(!document.getElementById('togpane_log') && !document.getElementById('riddlemaster')) {
    var wnd = window
    var doc = wnd.document
    var loc = location
    var href = loc.href

    var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
    var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

    if((href == 'http://hentaiverse.org/') || (href == 'http://hentaiverse.org/?s=Character&ss=ch')) {
        var div = doc.createElement('DIV')
        div.appendChild(doc.createElement('BR'))
        var a1 = doc.createElement('A')
        a1.id = 'a1'
        a1.href = 'http://hentaiverse.org/?s=Bazaar&ss=lt'
        a1.target = '_self'
        a1.textContent = ''
        div.appendChild(a1)
        div.appendChild(doc.createElement('BR'))

        div.appendChild(doc.createElement('BR'))
        var a2 = doc.createElement('A')
        a2.id = 'a2'
        a2.href = 'http://hentaiverse.org/?s=Bazaar&ss=la'
        a2.target = '_self'
        a2.textContent = ''
        div.appendChild(a2)
        div.appendChild(doc.createElement('BR'))

        var left = $('.clb')
        div.style.cssText = $(left, '.cit .fd4 > div').style.cssText + 'margin-right: 8px;'
        left.appendChild(div)

        var frm = doc.createElement('IFRAME')
        frm.src = 'http://hentaiverse.org/?s=Bazaar&ss=lt'
        frm.width = frm.height = frm.frameBorder = 0
        frm.onload = function() {
            $('#a1').textContent = $(frm.contentDocument, '#equipment').previousSibling.textContent
            frm.parentNode.removeChild(frm)
        }
        doc.body.appendChild(frm)

        var frm2 = doc.createElement('IFRAME')
        frm2.src = 'http://hentaiverse.org/?s=Bazaar&ss=la'
        frm2.width = frm2.height = frm2.frameBorder = 0
        frm2.onload = function() {
            $('#a2').textContent = $(frm2.contentDocument, '#equipment').previousSibling.textContent
            frm2.parentNode.removeChild(frm2)
        }
        doc.body.appendChild(frm2)
    }
}
