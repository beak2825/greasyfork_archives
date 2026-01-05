// ==UserScript==
// @name            HV Hide Infinite Items
// @description     Hide items with infinite supply on the "All" tab of the Item Shop
// @include         http://hentaiverse.org/?s=Bazaar&ss=is*
// @version 0.0.1.20160315155031
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/6260/HV%20Hide%20Infinite%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/6260/HV%20Hide%20Infinite%20Items.meta.js
// ==/UserScript==

/*** Settings ***/
if(typeof wlist == 'undefined') {
    var wlist = [ // Infinite items on the list are NOT hidden. Edit it to suit your own needs.
        /Soul Fragment/i,
    ]
}

if(typeof blist == 'undefined') {
    var blist = [ // Finite items on the list are hidden. Edit it to suit your own needs.
        /Last Elixir/i,
        /Infusion/i,
        /Scroll of (Swiftness|Shadows|Absorption|Life|(the Gods))/i,
        /(Low|Mid)-Grade/i,
        /High-Grade (Metals|Leather)/i,
        /Binding.*(Focus|Friendship|Elementalist|Heaven-sent|Demon-fiend|Curse-weaver|Earth-walker|Surtr|Niflheim|Mjolnir|Freyr|Heimdall|Fenrir|Stone-skin|Deflection|Fire-eater|Frost-born|Thunder-child|Wind-waker|Thrice-blessed|Spirit-ward)/i,
        /Voidseeker|Aether|Featherweight/i,
        /Figurine/i,
    ]
}

/*** End of Settings ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

if(/&ss=is&?/.test(href)) {
    if(/&filter=all/.test(href) || (!/&filter=/.test(href))) {
        var shop_pane = $('#shop_pane')
        var items = $$(shop_pane, '.idp')
        //var items = $$(shop_pane, '*[id]')
        var supplies = $$(shop_pane, '.ii')
        for(var i=0, len=items.length; i<len; i++) {
            (function(){
                if(isNaN(parseInt(supplies[i].textContent))) { // Items with infinite stock
                    var hidden = true
                    for(var j=0, len2=wlist.length; j<len2; j++) {
                        if(wlist[j].test(items[i].textContent)) { hidden = false; break }
                    }
                    if(hidden) { items[i].parentNode.parentNode.style.display = 'none' }
                }
                else { // Items with finite stock
                    var hidden = false
                    for(var j=0, len2=blist.length; j<len2; j++) {
                        if(blist[j].test(items[i].textContent)) { hidden = true; break }
                    }
                    if(hidden) { items[i].parentNode.parentNode.style.display = 'none' }
                }
            })()
        }
    }
}
