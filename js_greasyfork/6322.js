// ==UserScript==
// @name            Trophy Value Calculator
// @description     Calculate the total value of trophies based on jenga201's buying prices
// @include         http://hentaiverse.org/?s=Character&ss=in
// @include         http://hentaiverse.org/?s=Bazaar&ss=is
// @include         http://hentaiverse.org/?s=Bazaar&ss=is&*
// @version 0.0.1.20160110102520
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/6322/Trophy%20Value%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/6322/Trophy%20Value%20Calculator.meta.js
// ==/UserScript==

/*** Settings ***/
var d = {
    'ManBearPig Tail': 600,
    'Holy Hand Grenade of Antioch': 600,
    'Mithra\'s Flower': 600,
    'Dalek Voicebox': 600,
    'Lock of Blue Hair': 850,
    'Bunny-Girl Costume': 1250,
    'Hinamatsuri Doll': 1250,
    'Broken Glasses': 1250,
    'Black T-Shirt': 3400,
    'Sapling': 3400,
    'Unicorn Horn': 6000,
    'Noodly Appendage': 26000,
    'Bronze Coupon': 600,
    'Silver Coupon': 1100,
    'Golden Coupon': 30000,
    'Platinum Coupon': 100000,
}
/*** End of Settings ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

if(!$('#togpane_log') && !$('#riddlemaster')) {
    var display_total_value = function(sum) {
        var out = 'Total value of trophies: ' + sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' credits'
        console.log(out)

        var div = doc.createElement('DIV')
        div.appendChild(doc.createElement('BR'))
        div.appendChild(doc.createTextNode(out))

        var left = $('.clb')
        div.style.cssText = $(left, '.cit .fd4 > div').style.cssText + 'margin-right: 8px;'
        left.appendChild(div)
    }

    // Character -> Inventory
    var inv_item = $('#inv_item')
    if(inv_item) {
        var items = $$(inv_item, '.id')
        for(var i=items.length-1, sum=0; i>=0; i--) {
            var k = items[i].textContent
            var v = parseInt(d[k])
            var supply = parseInt($(items[i].parentNode.parentNode, '.ii').textContent)
            if( (!isNaN(v)) && (!isNaN(supply)) ) {
                sum += (v*supply)
            }
        }
        display_total_value(sum)
    }

    // Bazaar -> Item Shop -> All/Special
    var item_pane = $('#item_pane')
    if(item_pane) {
        var items = $$(item_pane, '.idp')
        var supplies = $$(item_pane, '.ii')
        for(var i=items.length-1, sum=0; i>=0; i--) {
            var k = items[i].textContent
            var v = parseInt(d[k])
            var supply = parseInt(supplies[i].textContent)
            if( (!isNaN(v)) && (!isNaN(supply)) ) {
                sum += (v*supply)
            }
        }
        display_total_value(sum)
    }
}
