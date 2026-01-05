// ==UserScript==
// @name         Pop Facebook Hash Tags
// @namespace    http://www.emsquared-inc.com/
// @version      2.1
// @description  Makes hashtag links open in a new window or tab
// @author       Eric Mintz
// @oujs:author  emsquared-inc
// @license      GNU GPL v3.0; https://github.com/emsquared-inc/PopFacebookHashTags/blob/gh-pages/LICENSE
// @homepageURL  http://www.emsquared-inc.com
// @supportURL   https://github.com/emsquared-inc/PopFacebookHashTags
// @match        https://www.facebook.com/*
// @match        https://www.facebook.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6599/Pop%20Facebook%20Hash%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/6599/Pop%20Facebook%20Hash%20Tags.meta.js
// ==/UserScript==

(function() {
    var observer = new MutationObserver(function(mutations) {
        document.querySelectorAll('div[id*="topnews"] a[href*="/hashtag/"]').forEach(function(link){
            link.setAttribute('target','_blank');
        });
    });

    window.addEventListener('load',function(){
        var main_stream = document.querySelector('div[id*="topnews_main_stream"]');
        if (main_stream) {
            observer.observe(main_stream, { childList: true, subtree: true });
        }
    });
})();