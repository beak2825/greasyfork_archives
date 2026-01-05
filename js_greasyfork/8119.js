// ==UserScript==
// @name        Facebook News Feed Hider
// @namespace   http://madsnedergaard.dk/fbfeedhider
// @author      Mads Nedergaard
// @description This script simpy hides the news feed on Facebook. Groups, events and other useful features are still available.
// @include     http://www.facebook.com/*
// @include     https://www.facebook.com/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8119/Facebook%20News%20Feed%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/8119/Facebook%20News%20Feed%20Hider.meta.js
// ==/UserScript==
var css = ('.newsFeedComposer div[id^=topnews_main_stream] { display: none}');
var node = document.createElement("style");
node.type = "text/css";
node.appendChild(document.createTextNode(css));

var heads = document.getElementsByTagName("head");
if (heads.length > 0) {
    heads[0].appendChild(node);
} else {
    document.documentElement.appendChild(node);
}
