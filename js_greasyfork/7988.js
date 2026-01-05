// ==UserScript==
// @name        Gfycat-Redirect gif to HTML5
// @namespace   https://greasyfork.org/en/users/9009
// @description Redirects giant or fat.gfycat.com hyperlinks to their HTML 5 video counterpart
// @version     1.13
// @include     http://*.gfycat.com/*
// @include     https://*.gfycat.com/*
// @grant       none
//
// @downloadURL https://update.greasyfork.org/scripts/7988/Gfycat-Redirect%20gif%20to%20HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/7988/Gfycat-Redirect%20gif%20to%20HTML5.meta.js
// ==/UserScript==    

if (window.location.href.match(/^https?:\/\/(giant|fat)\.gfycat\.com\/[A-Za-z0-9]+.gif$/)) {
        var new_path = window.location.href.replace(/(giant|fat)\.(.*)\.gif/i, "$2");
        window.location.href = new_path;
}