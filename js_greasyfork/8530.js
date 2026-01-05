// ==UserScript==
// @name         No zamolxis
// @namespace    http://your.homepage/
// @version      0.7
// @description  removes image proxy host from image url and showing image
// @author       drakulaboy
// @include      *topicmd.*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/8530/No%20zamolxis.user.js
// @updateURL https://update.greasyfork.org/scripts/8530/No%20zamolxis.meta.js
// ==/UserScript==

//this.$ = this.jQuery = jQuery.noConflict(true);
var j = jQuery.noConflict();
j('img').attr('src', function(i, src) {
  return src.replace('https://zamolxismd.org/m/','https://')
            .replace('https://supernova.zamolxismd.org/m/','https://');
}); 
