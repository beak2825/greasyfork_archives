// ==UserScript==
/**
  The MIT License (MIT)

  Copyright (c) 2017 Michael Charles Aubrey
  
  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/
// ==UserScript==
// @id           RedditRetractableSidebar
// @name         Reddit Retractable Sidebar
// @namespace    http://michaelcharl.es
// @version      0.4.5
// @description  Make Reddit's Sidebar Retractable
// @icon         https://mca62511.github.io/reddit-retractable-sidebar/favicon.png
// @icon64       https://mca62511.github.io/reddit-retractable-sidebar/favicon.png
// @author       Michael Aubrey, NiteCyper
// @domain       reddit.com
// @domain       www.reddit.com
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @match        http://www.reddit.com/*
// @match        http://reddit.com/*
// @match        *://www.reddit.com/*
// @match        *://reddit.com/u/*
// @match        *://old.reddit.com/*
// @grant        none
// @license         MIT

// @downloadURL https://update.greasyfork.org/scripts/549611/Reddit%20Retractable%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/549611/Reddit%20Retractable%20Sidebar.meta.js
// ==/UserScript==
/* global $ */

(function() {
    'use strict';
    var leftIcon = '<i class="material-icons">chevron_left</i>';
    var rightIcon = '<i class="material-icons">chevron_right</i>';
    $("head").append("<link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet' type='text/css'>");
    var $content = $("div.content");
    var $toggleButton = $("<div></div>");
    $toggleButton.css({
        background: "#CEE3F8",
        color: "#212121",
        display: "flex",
        'justify-content': "center",
        'align-items': "center",
        height: "42px",
        width: "22px",
        "font-size": "32px",
        "border-radius": "100px",
        "box-shadow": "0px 3px 5px 0px rgba(33,33,33,0.3)",
        position: "fixed",
        top: "50%",
        right: "-7px",
        cursor: "pointer",
        "z-index": "9983"
    });
    var $sidebar = $("div.side");
    /**************************
    Add vote information below link so that when
    the sidebar is hidden you can still see what vote
    percentage and total votes you have.
    ***************************/
    var $score = $("<span></span>");
    var votePercentage = $(".score").text().match(/\((.*?)\)/);
    var voteTotal = $(".linkinfo span.totalvotes").text();
    if (votePercentage) {
        $score.html(voteTotal.length > 0 ? votePercentage[1] + " out of " + voteTotal + " total, " : votePercentage[1] + ", ");
        $score.prependTo($("#siteTable .tagline"));
    }
    /**************************
    Some style changes to fix the way certain templates
    render with this script.
    ***************************/
    $("body").append("<style>@media (max-width: 850px) {div#siteTable {max-width: 100vw;}}</style>")
        /*****************************
        Functions for hiding and showing the sidebar
        ****************************/
    function hideSidebar() {
        $sidebar.hide();
        $content.css({
            "margin-right": "15px"
        });
        $toggleButton.html(leftIcon);
        setCookie("isRetracted", "true", 30);
    }

    function showSidebar() {
        $sidebar.show();
        $content.css({
            "margin-right": "335px"
        });
        $toggleButton.html(rightIcon);
        setCookie("isRetracted", "false", 30);
    }


    // These setCookie and getCookie functions were copied
    // from w3schools.
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + ";domain=.reddit.com;path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    /************************************************
    Unless it is a submit page, load up the fab and
    hide or show the sidebar according to the last
    state that it was in.
    *************************************************/
    if (window.location.href.indexOf("/submit") > -1 && window.location.href.indexOf("/submitted") === -1 ) {
            // do nothing
    } else {
        if (getCookie("isRetracted") == "true") {
            hideSidebar();
        }
        else {
            showSidebar();
        }
        $("body").append($toggleButton);
        $toggleButton.click(function() {
            var currentIcon = $toggleButton.html().trim();
            if (currentIcon === rightIcon) {
                hideSidebar();
            }
            else {
                showSidebar();
            }
        });
    }
    /*******************************
    Causes the sidebar to retract when you press "q"
    ********************************/
    $("body").on("keypress", function(e) {
        var tagName = e.target.tagName.toLowerCase();
        console.log(e.keyCode);
        if (tagName === "input" || tagName === "textarea") {
            return /*do nothing */;
        }
        else {
            if (e.keyCode === 113) {
                $toggleButton.click();
            }
        }
    });
})();
