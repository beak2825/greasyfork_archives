// ==UserScript==
// @name HaaretzPaywall Gcache
// @namespace haaretz
// @description bypass haaretz paywall
// @include http://*.haaretz.com/*
// @include http://*.haaretz.co.il/*
// @include /^http:\/\/webcache\.googleusercontent\.com\/search\?q=cache:http:\/\/www\.haaretz\.(com|co\.il)\/.*premium-/

// @grant none
// @version 1.3
// @downloadURL https://update.greasyfork.org/scripts/7540/HaaretzPaywall%20Gcache.user.js
// @updateURL https://update.greasyfork.org/scripts/7540/HaaretzPaywall%20Gcache.meta.js
// ==/UserScript==

var inHaaretzPremium = document.location.href.match(/^http:\/\/www\.haaretz\.(com|co\.il)\/.*premium-/);
var inGcache = document.location.href.match(/^http:\/\/webcache\.googleusercontent\.com\/search\?q=cache:http:\/\/www\.haaretz\.(com|co\.il)\/.*premium-/);
var googleCache = "http://webcache.googleusercontent.com/search?q=cache:";

if (inHaaretzPremium){
  if (!this.location.href.contains("#noGcache")){
    document.location.replace(googleCache+document.location.href);}
}
if (inGcache){
  if (document.title.contains('Error 404')){
        newLoc = document.location.href.substr(document.location.href.indexOf("q=cache:")+8);
        newLoc = newLoc + "#noGcache";
        document.getElementsByTagName("a").item(0).href = newLoc;
        document.getElementsByTagName("a").item(0).click();
  }
}

function addNewStyle(newStyle) {
    styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    //head = document.getElementsByTagName('head')[0];
    //head.insertBefore(styleElement, head.firstChild);
    document.getElementsByTagName('head')[0].appendChild(styleElement);
    styleElement.appendChild(document.createTextNode(newStyle));
    return styleElement;
}

style1 = addNewStyle('.modal-wrapper {display:none};');
addNewStyle('.footer-ruler {display:none !important;}');
// uncomment next line to get rid of the fixed header (when scrolling down an article, the header will be hidden)
// addNewStyle('.h-posf {position:relative !important;}');


window.addEventListener('load', function() {
    $('.modal-wrapper, .modal--subscription-weekly').addClass('h-hidden');
    $('a').each(function(){
      if (this.href.match(/premium-/)){
        if (inGcache/* && $(this).parent().html().contains("This is Google's cache")*/){
          this.href = this.href+"#noGcache";
        }else{
          if (!this.href.contains("#noGcache")){
            if (inGcache){prefix=document.location.href.match(/cache:(https?:\/\/.*?\/)/)[1]}
            else {prefix=document.location.origin+'/';}
            if (this.href.match(/^https?:\/\//)){prefix='';}
            this.href = googleCache + prefix + this.href;
          }}}});
     document.getElementsByTagName('head')[0].removeChild(style1);
}, false);
