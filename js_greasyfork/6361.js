// ==UserScript==
// @name         Gitorious Large Display - LAME
// @namespace    LynxEyes
// @version      0.2
// @description  Just a lame re-style of Gitorious to make it more confortable on large displays
// @author       LynxEyes
// @match        https://code.lmit.pt/*
// @require      http://code.jquery.com/jquery-1.10.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/6361/Gitorious%20Large%20Display%20-%20LAME.user.js
// @updateURL https://update.greasyfork.org/scripts/6361/Gitorious%20Large%20Display%20-%20LAME.meta.js
// ==/UserScript==
jQuery(document).ready(function(){
    var $ = jQuery;

    $("#wrapper, #header, #container").css("width","1300px");
    $("#content").css("width","980px");
    $("#top-bar").css("width","1295px");
    $("#footer").css("width","1260px");
    $("#container.sidebar-enabled").css("background","white");
});

