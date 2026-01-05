// ==UserScript==
// @name            Sort Bounties By Reward
// @description     Sort bounties by reward
// @include         http://g.e-hentai.org/bounty.php?u=*
// @include         http://g.e-hentai.org/bounty.php?*&u=*
// @version 0.0.1.20150701182040
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/8346/Sort%20Bounties%20By%20Reward.user.js
// @updateURL https://update.greasyfork.org/scripts/8346/Sort%20Bounties%20By%20Reward.meta.js
// ==/UserScript==

/*** Settings ***/

var hath_to_credits = 6000
var sort_from_small_to_big = true

/*** End of Settings ***/

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $  = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelector(css) }
var $$ = function(e, css) { if(!css) { css=e; e=doc }; return e.querySelectorAll(css) }

var t = $$('.itg')
for(var i=0, len_i=t.length; i<len_i; i++) {
    var b = $$('[class^="gtr"]')
    var b_arr = Array.prototype.slice.call(b, 0)
    b_arr.sort(function(a, b) {
        var a_reward = a.querySelectorAll('.itd')[4].textContent
        var m_credits = a_reward.match(/([0-9, ]+)Credits/i)
        var m_hath = a_reward.match(/([0-9, ]+)Hath/i)
        a_reward = 0
        if(m_credits) {
            m_credits = parseInt(m_credits[1].replace(/[, ]/g, ''))
            a_reward += m_credits
        }
        if(m_hath) {
            m_hath = parseInt(m_hath[1].replace(/[, ]/g, ''))
            a_reward += (m_hath * hath_to_credits)
        }

        var b_reward = b.querySelectorAll('.itd')[4].textContent
        var m_credits = b_reward.match(/([0-9, ]+)Credits/i)
        var m_hath = b_reward.match(/([0-9, ]+)Hath/i)
        b_reward = 0
        if(m_credits) {
            m_credits = parseInt(m_credits[1].replace(/[, ]/g, ''))
            b_reward += m_credits
        }
        if(m_hath) {
            m_hath = parseInt(m_hath[1].replace(/[, ]/g, ''))
            b_reward += (m_hath * hath_to_credits)
        }

        if(sort_from_small_to_big) {
            if(a_reward < b_reward) { return -1 }
            if(a_reward > b_reward) { return 1 }
            return 0
        }
        else {
            if(a_reward > b_reward) { return -1 }
            if(a_reward < b_reward) { return 1 }
            return 0
        }
    })

    var b_cln = []
    for(var j=0, len_j=b_arr.length; j<len_j; j++) {
        //console.log(b_arr[j].querySelectorAll('.itd')[4].textContent)
        b_cln.push(b_arr[j].cloneNode(true))
    }
    for(var j=0, len_j=b.length; j<len_j; j++) {
        b[j].parentNode.replaceChild(b_cln[j], b[j])
    }
}
