// ==UserScript==
// @name            Blacklist and Whitelist of Forum Threads for the E-Hentai Forums
// @description     Blacklists and whitelists specified forum threads, plus various tweaks.
// @include         http://forums.e-hentai.org/index.php?*
// @version 0.0.1.20161218195932
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/5940/Blacklist%20and%20Whitelist%20of%20Forum%20Threads%20for%20the%20E-Hentai%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/5940/Blacklist%20and%20Whitelist%20of%20Forum%20Threads%20for%20the%20E-Hentai%20Forums.meta.js
// ==/UserScript==

/*** Settings ***/

var hide_unread_imgs = true
var hide_closed_shops = true
var highlight_auctions = true
var highlight_shop_owners = true
if(typeof do_not_hide == 'undefined') {
    var do_not_hide = [ // user IDs
        2328, // atomicpuppy
        409722, // danixxx
        1988471,
    ]
}
if(typeof wts_shop_owners_to_highlight == 'undefined') {
    var wts_shop_owners_to_highlight = [ // user IDs
        1988471,
    ]
}
if(typeof wtb_shop_owners_to_highlight == 'undefined') {
    var wtb_shop_owners_to_highlight = [ // user IDs
        1988471,
    ]
}
if(typeof wts_thread_blist == 'undefined') {
    var wts_thread_blist = [ // thread IDs
        163637, // The Shared Free Shop
        183055,
    ]
}
if(typeof wtb_thread_blist == 'undefined') {
    var wtb_thread_blist = [ // thread IDs
    ]
}
if(typeof chat_thread_wlist == 'undefined') {
    var chat_thread_wlist = [ // thread IDs
        178483, // The Legendary Equipment Thread
        65126, // Script Thread
    ]
}
if(typeof user_blist == 'undefined') {
    var user_blist = [ // user IDs
    ]
}

/*** End of Settings ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var showforum = href.match(/showforum=(\d+)/)
if(!showforum) { showforum = href.match(/&?\bf=(\d+)/) }
if(showforum) {
    showforum = showforum[1]

    // Hide unread imgs
    if(hide_unread_imgs) {
        var imgs = $$('img[src="style_images/ambience/newpost.gif"]')
        for(var i=0, len=imgs.length; i<len; i++) { imgs[i].style.display = 'none' }
        var imgs = $$('img[src="style_images/fusion/newpost.gif"]')
        for(var i=0, len=imgs.length; i<len; i++) { imgs[i].style.display = 'none' }
    }

    // Hide closed shops
    if(hide_closed_shops) {
        if(showforum == '77' || showforum == '78') {
            var lnks = $$('td.row1 > div > span > a[id^="tid-link-"]')
            //var closed_patterns = /\b(close|closed|complete|(delete|del\b)|done|end|none|nothing|shut|sorry)/i
            var closed_patterns = /\b(close|closed|complete|(delete|del\b)|done|end|none|nothing|shut|sorry|auction|lottery|lotto|event)/i
            for(var i=0, len=lnks.length; i<len; i++) {
                if((!/&st=/.test(href)) || (/&st=0/.test(href))) { // (probably) on the first page
                    if(/\b(auction|lottery|lotto|event)\b/i.test(lnks[i].textContent)) { continue }
                }
                var owner = $(lnks[i].parentNode.parentNode.parentNode.parentNode, 'td.row2 > a[href*="showuser"]')
                if(do_not_hide.indexOf(parseInt(owner.href.match(/showuser=(\d+)/)[1])) != -1){ continue }
                if(closed_patterns.test(lnks[i].textContent)) {
                    lnks[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none'
                    continue
                }
                var desc = $(lnks[i].parentNode.parentNode, 'span#tid-desc-'+lnks[i].id.match(/(\d+)/)[1])
                if(closed_patterns.test(desc.textContent)) {
                    desc.parentNode.parentNode.parentNode.parentNode.style.display = 'none'
                    continue
                }
            }
        }
    }

    // Highlight auctions
    if(highlight_auctions) {
        if(showforum == '77') {
            var lnks = $$('td.row1 > div > span > a[id^="tid-link-"]')
            for(var i=0, len=lnks.length; i<len; i++) {
                if(/\b(auction|lottery|lotto|event)\b/i.test(lnks[i].textContent)) {
                    var owner = $(lnks[i].parentNode.parentNode.parentNode.parentNode, 'td.row2 > a[href*="showuser"]')
                    if(owner.style.color == '') { owner.style.color = 'blue'}
                }
            }
        }
    }

    // Highlight shop owners
    if(highlight_shop_owners) {
        var fav = []
        if(showforum == '77') { fav = wts_shop_owners_to_highlight } // WTS
        else if(showforum == '78') { fav = wtb_shop_owners_to_highlight } // WTB
        var owner = $$('td.row2 > a[href*="showuser"]')
        for(var i=0, len=owner.length; i<len; i++) {
            //if((fav.indexOf(owner[i].textContent) != -1) && (owner[i].style.color == '')) { owner[i].style.color = 'red' }
            for(var j=0, len_j=fav.length; j<len_j; j++) {
                if((new RegExp('showuser='+fav[j]+'\\b').test(owner[i].href)) && (owner[i].style.color == '')) {
                    owner[i].style.color = 'red'
                    break
                }
            }
        }
    }

    // Hide specified forum threads
    var thread_blist = thread_wlist = []
    if(showforum == '76')      { thread_wlist = chat_thread_wlist } // Chat
    else if(showforum == '77') { thread_blist = wts_thread_blist } // WTS
    else if(showforum == '78') { thread_blist = wtb_thread_blist } // WTB
    if(thread_blist.length) {
        for(var i=0, len=thread_blist.length; i<len; i++) {
            try {
                $('#tid-link-'+thread_blist[i]).parentNode.parentNode.parentNode.parentNode.style.display = 'none'
            } catch(e) {}
        }
    }
    else if(thread_wlist.length) {
        var lnks = $$('td.row1 > div > span > a[id^="tid-link-"]')
        for(var i=0, len=lnks.length; i<len; i++) {
            if(!/^tid-link-/.test(lnks[i].id)) { continue }
            var tid = parseInt(lnks[i].id.match(/tid-link-(\d+)/)[1])
            if(thread_wlist.indexOf(tid)==-1) {
                try {
                    lnks[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none'
                } catch(e) {}
            }
        }
    }

    // Hide threads made by specific users
    if(user_blist.length) {
        var users = $$('td.row2 > a[href*="showuser"]')
        for(var i=0, len=users.length; i<len; i++) {
            for(var j=0, len_j=user_blist.length; j<len_j; j++) {
                //if((new RegExp('showuser='+user_blist[j]+'\\b').test(users[i].href)) && (users[i].style.color == '')) {
                if(new RegExp('showuser='+user_blist[j]+'\\b').test(users[i].href)) {
                    if(!/\bauction\b/i.test(users[i].parentNode.parentNode.querySelectorAll('.row1')[2].textContent)) {
                        users[i].parentNode.parentNode.style.display = 'none'
                    }
                    break
                }
            }
        }
    }
}
