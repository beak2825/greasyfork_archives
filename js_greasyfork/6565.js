// ==UserScript==
// @name            E-Hentai Gallery Overview - How Rich Am I?
// @description     Shows how many Credits/Hath/GP you have, and displays exchange rate of Hath under the Overview tab
// @include         http://g.e-hentai.org/home.php
// @version 0.0.1.20141122040438
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/6565/E-Hentai%20Gallery%20Overview%20-%20How%20Rich%20Am%20I.user.js
// @updateURL https://update.greasyfork.org/scripts/6565/E-Hentai%20Gallery%20Overview%20-%20How%20Rich%20Am%20I.meta.js
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var tbl = doc.createElement('TABLE')
tbl.align = 'center'
var row1 = tbl.insertRow(0)
var row2 = tbl.insertRow(1)
var cell1 = row1.insertCell(0)
var cell2 = row1.insertCell(1)
var cell3 = row2.insertCell(0)
var cell4 = row2.insertCell(1)

var homebox = $('.homebox')
var h2 = doc.createElement('H2')
h2.textContent = 'Currencies'
homebox.parentNode.insertBefore(h2, homebox.nextSibling)
var newbox = homebox.cloneNode(true)
newbox.textContent = ''
newbox.appendChild(tbl)
homebox.parentNode.insertBefore(newbox, homebox.nextSibling.nextSibling)

var get_info_1 = function() {
    var frm = doc.createElement('IFRAME')
    frm.src = 'http://g.e-hentai.org/exchange.php?t=hath'
    frm.width = frm.height = frm.frameBorder = 0
    frm.addEventListener('load', function(){
        var doc = this.contentDocument
        var credits = doc.body.innerHTML.match(/Available:\s*([,0-9]*)\s*Credits/i)[1]
        var hath = doc.body.innerHTML.match(/Available:\s*([,0-9]*)\s*Hath/i)[1]
        var exchange_rate = $(doc, 'BODY>DIV>DIV>DIV').textContent.match(/Avg:\s*([,0-9]*)\s*Credits/i)[1]
        console.log('Credits: ' + credits)
        console.log('Hath: ' + hath)
        console.log('Rate: ' + exchange_rate)
        if(credits != '0') { cell1.textContent = 'Credits: ' + credits }
        if(hath != '0') { cell2.textContent = 'Hath: ' + hath }
        if(exchange_rate != '0') { cell4.textContent = 'Rate: ' + exchange_rate }
        this.parentElement.removeChild(this)
    }, false)
    doc.body.appendChild(frm)
}
get_info_1()

var get_info_2 = function() {
    var frm = doc.createElement('IFRAME')
    frm.src = 'http://g.e-hentai.org/exchange.php?t=gp'
    frm.width = frm.height = frm.frameBorder = 0
    frm.addEventListener('load', function(){
        var doc = this.contentDocument
        gp = doc.body.innerHTML.match(/Available:\s*([,0-9]*)\s*kGP/i)[1]
        gp = parseInt(gp.replace(/,/g, '')) * 1000
        gp = gp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        console.log('GP: ' + gp)
        if(gp != '0') { cell3.textContent = 'GP: ' + gp }
        this.parentElement.removeChild(this)
    }, false)
    doc.body.appendChild(frm)
}
get_info_2()
