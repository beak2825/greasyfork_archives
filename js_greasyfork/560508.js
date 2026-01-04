// ==UserScript==
// @name         cppreference balck mode
// @license      The Unlicense
// @namespace    https://github.com/girl-dream/
// @version      1.0.3
// @description  cppreference黑夜模式
// @author       girl-dream
// @match        https://cppreference.cn/*
// @match        https://www.cppreference.com/*
// @icon         https://cppreference.cn/favicon.ico
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560508/cppreference%20balck%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/560508/cppreference%20balck%20mode.meta.js
// ==/UserScript==

(() => {
    'use strict'
    var jq = $.noConflict()
    jq('#content *:not(a, table, th, tr, tbody,.t-mark-rev,td,tt,.kw1,.co1 span)').not(this).css('color', 'white')
    jq('#cpp-content-base, #cpp-footer-base, #bodyContent,body, #cpp-head-first-base,#cpp-head-second-base,.mw-geshi,#cpp-head-second-base span,.t-member').css('background', '#17181A')
    jq('table,td').css('color', 'white')
    jq('a,tt,a:visited,[class^="sy"],#footer-info-lastmod').css('color', '#9198a1')
    jq('th,td,table').css('background', 'rgb(40, 43, 48)')
    jq('[class^="kw"],[class^="nu"]').css('color', '#f5ab35')
    jq('.mw-geshi').css('background', 'none')
    jq('.t-navbar-menu').each(function () {
        jq(this).children().first().css('background', 'rgb(40, 43, 48)')
    })
    jq('[class^="st"],[class^="br"],[class^="co"]').css('color', '#339900')
    jq('.coliru-btn').css({
        'color': 'white',
        'background': 'rgb(40, 43, 48)',
        'box-shadow': 'none',
        'margin-bottom': '6px'
    })

    //搜索框
    jq('form').attr({
        'target': '_blank',
        'action': 'https://www.bing.com/search'
    })
    jq('form').children().first().attr({
        'name': 'q1',
        'value': `site:${window.location.host}`
    })
    jq('input').css({
        'background-color': '#333',
        'color': '#fff',
        'border': '1px solid #555',
        'outline': 'none'
    })
    jq("input[type='text'], input[type='password']").css({
        'background-color': '#2d2d2d',
        'color': '#e0e0e0'
    })
})();
