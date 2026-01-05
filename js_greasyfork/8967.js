// ==UserScript==
// @name               Google to YouTube Search
// @namespace          https://greasyfork.org/en/users/10118-drhouse
// @version            6.8
// @description        Use your Google Search terms to search YouTube by clicking a new YouTube link added to your Google Search page.
// @include            https://www.google.*/search*
// @include            https://potato.net/*
// @require            http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require            https://greasyfork.org/scripts/439099-monkeyconfig-modern-reloaded/code/MonkeyConfig%20Modern%20Reloaded.js?version=1012538
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_addStyle
// @grant              GM_info
// @grant              GM_registerMenuCommand
// @author             drhouse
// @license            CC-BY-NC-SA-4.0
// @icon               https://www.google.com/s2/favicons?domain=google.com
// @downloadURL https://update.greasyfork.org/scripts/19256/Google%20to%20YouTube%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/19256/Google%20to%20YouTube%20Search.meta.js
// ==/UserScript==
/* global jQuery, MonkeyConfig, $ */
$(document).ready(function () {

    var cfg = new MonkeyConfig({
        title: 'Configure',
        menuCommand: true,
        params: {
            'YouTube': {
                type: 'checkbox',
                default: true
            },
            'Reddit': {
                type: 'checkbox',
                default: true
            },
            'Github': {
                type: 'checkbox',
                default: true
            },
        },
    })

    function createLink(site, url, query) {
        $('<a class=" R1QWuf" id="above" href="' + url + encodeURIComponent(query) + '"><div class="YmvwI mXwfNd mVH5Fc">' + site + '</div></a>')
            // .insertBefore("#uddia_1")
        // #hdtb-sc > div > div > div.crJ18e
        .insertAfter("#hdtb-tls").last();
    }
    
    var gquery = $("textarea").text()
    // const elementLength = $("#cnt > div:nth-child(8)").length;
    const elementLength = $("#cnt > div:nth-child(20)").length;
    const nthChildValue = elementLength === 1 ? 8 : 10;

    if (cfg.get('Github')) {
        createLink('Github', 'https://'+$(location).attr('hostname')+'/search?q=site%3Agithub.com+', gquery + '&type=repositories');
    }

    if (cfg.get('Reddit')) {
        createLink('Reddit', 'https://'+$(location).attr('hostname')+'/search?q=site%3Areddit.com+', gquery);
    }

    if (cfg.get('YouTube')) {
        createLink('YouTube', 'https://www.youtube.com/results?search_query=', gquery);
    }
    
});