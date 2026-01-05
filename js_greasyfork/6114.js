// ==UserScript==
// @name           HV Lottery Prize Reminder
// @description    Show the grand prizes of daily lotteries on the left bottom of the screen
// @include        http://hentaiverse.org/*
// @grant          GM_getValue
// @grant          GM_setValue
// @version 0.0.1.20141127194906
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/6114/HV%20Lottery%20Prize%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/6114/HV%20Lottery%20Prize%20Reminder.meta.js
// ==/UserScript==

if(document.getElementById('togpane_log') || document.getElementById('riddlemaster')) { throw 'exit' }

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var update_p1 = function() { // Update the grand prize of a weapon lottery
    var frm = doc.createElement('IFRAME')
    frm.src = 'http://hentaiverse.org/?s=Bazaar&ss=lt'
    frm.width = frm.height = frm.frameBorder = 0
    frm.onload = function() {
        $('#a1').textContent = GM_getValue('p1')
        frm.parentNode.removeChild(frm)
    }
    doc.body.appendChild(frm)
}

var update_p2 = function() { // Update the grand prize of an armor lottery
    var frm = doc.createElement('IFRAME')
    frm.src = 'http://hentaiverse.org/?s=Bazaar&ss=la'
    frm.width = frm.height = frm.frameBorder = 0
    frm.onload = function() {
        $('#a2').textContent = GM_getValue('p2')
        frm.parentNode.removeChild(frm)
    }
    doc.body.appendChild(frm)
}

var display_prizes = function() { // Create a div to display the grand prizes of daily lotteries
    var div = doc.createElement('DIV')

    div.appendChild(doc.createElement('BR'))
    var a1 = doc.createElement('A')
    a1.id = 'a1'
    a1.href = 'http://hentaiverse.org/?s=Bazaar&ss=lt'
    a1.target = '_self'
    a1.textContent = GM_getValue('p1')
    div.appendChild(a1)
    div.appendChild(doc.createElement('BR'))

    div.appendChild(doc.createElement('BR'))
    var a2 = doc.createElement('A')
    a2.id = 'a2'
    a2.href = 'http://hentaiverse.org/?s=Bazaar&ss=la'
    a2.target = '_self'
    a2.textContent = GM_getValue('p2')
    div.appendChild(a2)
    div.appendChild(doc.createElement('BR'))

    var left = $('.clb')
    div.style.cssText = $(left, '.cit .fd4 > div').style.cssText + 'margin-right: 8px;'
    left.appendChild(div)
}

if(/&ss=lt\b/.test(href)) { // Weapon lottery
    try{ GM_setValue('p1', $('#equipment').previousSibling.textContent) } catch(e) {}
    addEventListener('DOMContentLoaded', function() { update_p2(); display_prizes() }, false)
}
else if(/&ss=la\b/.test(href)) { // Armor lottery
    try{ GM_setValue('p2', $('#equipment').previousSibling.textContent) } catch(e) {}
    addEventListener('DOMContentLoaded', function() { update_p1(); display_prizes() }, false)
}
else {
    if(href == 'http://hentaiverse.org/') { update_p1(); update_p2(); }
    display_prizes()
}
