// ==UserScript==
// @name           Flickr RSS Feed
// @name:fr        Flux RSS Flickr
// @namespace      https://greasyfork.org/fr/users/11510-antoine-code
// @author         Antoine Turmel
// @version        1.0.1
// @description    Adds back RSS feeds to Flickr galleries
// @description:fr Réajoute le flux RSS des galeries Flickr
// @icon           https://cloud.githubusercontent.com/assets/119288/7681140/9284a93e-fd6d-11e4-8854-89ab643b600a.png
// @icon64         https://cloud.githubusercontent.com/assets/119288/7681134/811317e4-fd6d-11e4-8350-2dac0d5f0d66.png
// @include        *://*flickr.*/photos*
// @grant          none
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @run-at         document-end
// @updateVersion  1.0.1
// @downloadURL https://update.greasyfork.org/scripts/9945/Flickr%20RSS%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/9945/Flickr%20RSS%20Feed.meta.js
// ==/UserScript==

// Get the Flickr NSID from the cover image url
var nsid = $('div.coverphoto:first').css("background-image").split("#")[1].split('"')[0];
var rssfeed = "https://api.flickr.com/services/feeds/photos_public.gne?id=";

$('head').append('<link rel="alternate" type="application/rss+xml" title="RSS" href="' + rssfeed + nsid + '" />');