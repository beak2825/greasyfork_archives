// ==UserScript==
// @name         Wallhaven - Tag ID on subscription page
// @namespace    https://greasyfork.org/users/5097-aemony
// @version      1.0
// @description  Display an input element on subscription page with the tag ID to make it easily copy/pastable
// @author       Aemony
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @match        *://wallhaven.cc/subscription/tag/*
// @match        *://wallhaven.cc/subscription
// @icon         https://wallhaven.cc/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557436/Wallhaven%20-%20Tag%20ID%20on%20subscription%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/557436/Wallhaven%20-%20Tag%20ID%20on%20subscription%20page.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    // Display an input element with the tag ID to make it easily copy/pastable
    if (window.location.href.indexOf("tag") > -1)
    {
        var tagID = $( "a.tagname" ).attr('href');
        tagID = tagID.replace(/.*:\/\/wallhaven.cc\/tag\//, '');

        $("div.stats").css("line-height", "28px");

        $("div.stats").append('<div id="dwj-tamper-tagid" style="display: inline-block; position: absolute; left: 35em">Tag: <input type="text" value="id:' + tagID + '" style="height: 2em; line-height: 2em; padding: 0 .5em; background: #212427;"></div>');
    }

})();