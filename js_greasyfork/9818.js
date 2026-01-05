// ==UserScript==
// @name        YouTube - Bigger Profile Images
// @namespace   http://userscripts.org/users/23652
// @description Click on a user's YouTube thumbnail to enlarge. Clickable thumbnails will glow in a blue outline
// @include     http://*.youtube.com/*
// @include     https://*.youtube.com/*
// @include     http://youtube.com/*
// @include     https://youtube.com/*
// @copyright   JoeSimmons
// @version     1.0.5
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @require     https://greasyfork.org/scripts/1885-joesimmons-library/code/JoeSimmons'%20Library.js?version=7915
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/9818/YouTube%20-%20Bigger%20Profile%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/9818/YouTube%20-%20Bigger%20Profile%20Images.meta.js
// ==/UserScript==

/* CHANGELOG

1.0.5 (5/12/2015)
    - fixed script

1.0.4 (7/11/2014)
    - fixed some thumbnails opening in new tabs when clicked upon

1.0.3 (11/18/2013)
    - fixed bug with some bigger images not hiding when you click

1.0.2 (11/16/2013)
    - fixed after YouTube change to Google+ for comments (what a bitch that was... thanks Google)

1.0.1
    - used JSL
    - removed CSS3 animation. it was causing 40% cpu usage constantly
    - slightly improved alignCenter()

1.0.0
    - created

---------- */

(function () {
    'use strict';

    var rGoogleImg = /(ggpht|googleusercontent)\.com\/.+\/photo\.jpg(\?sz=\d+)?/i,
        rSize = /(\/photo\.jpg\?sz=\d+)/i,
        rs48 = /\/s\d{1,3}/;

    function process(event) {
        var thumb = JSL(event.target),
            th = JSL('#thumb-hover'),
            src = '';

        // do nothing if it's not a left click
        if (event.button !== 0) { return; }

        if ( thumb.exists && thumb.is('a') ) {
            thumb = JSL('.//img[ contains(@src, "googleusercontent.com") or contains(@src, "ggpht.com") ]', thumb[0]);
        }

        if ( thumb.exists && thumb.is('img[src]:not(#thumb-hover):not([alt="Thumbnail"])') ) {
            src = thumb.prop('src');
            if ( src.match(rGoogleImg) ) {
                event.preventDefault();
                th.show().center().prop( 'src', src.replace(rSize, '/photo.jpg?sz=720').replace(rs48, '/s720') );
            }
        } else {
            th.hide().prop('src', '');
        }
    }

    // make sure the page is not in a frame
    if (JSL == null || window.frameElement || window !== window.top) { return; }

    JSL.runAt('end', function () {
        JSL.addStyle('' +
            '.yt-user-photo, ' +
            '.feed-author-bubble, ' +
            '.yt-thumb img:not([src*="ytimg.com"]), ' +
            'img[src*="googleusercontent.com"]:not(.about-channel-link-icon), img[src*="ggpht.com"]:not(.about-channel-link-icon) { ' +
                'border-width: 2px !important; ' +
                'border-style: solid !important; ' +
                'border-radius: 2px !important; ' +
                'border-color: #0093FF !important; ' +
            '}' +
            // --------------------------------------------
            '#thumb-hover { ' +
                'z-index: 999999; ' +
                'border: 2px solid #000000; ' +
                'background-color: #000000; ' +
                'max-height: 800px; ' +
                'max-width: 720px; ' +
            '}' +
        '', 'bigger-profile-images');

        JSL(document.body).append(
            JSL.create('img', {id : 'thumb-hover', style : 'display: none; position: fixed;', onload : function () {
                JSL('#thumb-hover').center();
            }})
        );

        JSL.addEvent(window, 'click', process);

        JSL.setInterval(function () {
            JSL('//a[ contains(@href, "profile_redirector") or contains(@href, "/user/") or contains(@href, "/channel/") ]/img/ancestor::a').each(function (elem) {
                elem.removeAttribute('target');
                elem.removeAttribute('href');
            });
        }, 1000);
    });
}());