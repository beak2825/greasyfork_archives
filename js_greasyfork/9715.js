// ==UserScript==
// @name        Inactivity Reminder for E-Hentai Forum
// @include     http://forums.e-hentai.org/*
// @version 0.0.1.20151024050011
// @namespace https://greasyfork.org/users/2233
// @description Change the color of your ID to red if the last post you made was more than 24 hours ago
// @downloadURL https://update.greasyfork.org/scripts/9715/Inactivity%20Reminder%20for%20E-Hentai%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/9715/Inactivity%20Reminder%20for%20E-Hentai%20Forum.meta.js
// ==/UserScript==

/*** Setting ***/
var time_difference = 604800 // when the difference btwn current time and the time last post was made is greater than this, ID becomes red. in seconds.

/*** End of Setting ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var get_cookie = function(k) {
    var nameEQ = k + '='
    var ca = doc.cookie.split(';')
    for(var i=0, len=ca.length; i<len; i++) {
        var c = ca[i]
        while(c.charAt(0)==' ') { c = c.substring(1, c.length) }
        if(c.indexOf(nameEQ) == 0) { return c.substring(nameEQ.length, c.length) }
    }
    return null
}
var set_cookie = function(k, v) { doc.cookie = k + '=' + escape(v) + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/' }
var del_cookie = function(k) { doc.cookie = k + '=; expires=Fri, 31 Dec 1999 23:59:59 GMT; path=/' }

var btn_add_reply = $('input[value="Add Reply"]')
if(btn_add_reply) {
    btn_add_reply.addEventListener('click', function() {
        var now = Math.floor(new Date().getTime()/1000)
        set_cookie('last_topic', now)
    }, false)
}

var update_timer = function() {
    var is_active = false
    var last_topic = unescape(get_cookie('last_topic'))
    if(last_topic) {
        var now = Math.floor(new Date().getTime()/1000)
        if(now - last_topic <= time_difference) { is_active = true } else { del_cookie('last_topic') }
    }
    if(!is_active) { $('#userlinks a[href^="http://forums.e-hentai.org/index.php?showuser="]').style.color = 'red' }
    setTimeout(update_timer, 60000)
}
update_timer()
