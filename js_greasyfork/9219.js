// ==UserScript==
// @name         display the images of tumblr in HD revolution directly　for PC and mobile
// @description  直接显示电脑版和手机版tumblr的图片为高清版
// @version      1.9
// @include      http://*.tumblr.com/*
// @include      https://*.tumblr.com/*
// @author       yechenyin
// @license       MIT
// @namespace    https://greasyfork.org/users/3586-yechenyin
// @require  	   https://code.jquery.com/jquery-1.11.2.min.js
// @downloadURL https://update.greasyfork.org/scripts/9219/display%20the%20images%20of%20tumblr%20in%20HD%20revolution%20directly%E3%80%80for%20PC%20and%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/9219/display%20the%20images%20of%20tumblr%20in%20HD%20revolution%20directly%E3%80%80for%20PC%20and%20mobile.meta.js
// ==/UserScript==
 
jQuery.fn.inserted = function(action) {
  var selector = this.selector;
  if ($(selector).length > 0) {
    console.log($(selector).length + ' ' + selector + " is loaded at begin");
    action.call($(selector));
  }
  var reaction = function(records) {
    records.map(function(record) {
      if (record.target !== document.body && $(record.target).find(selector).length) {
        if (record.target.id)
          console.log('#' + record.target.id + ' which contains ' + selector + ' is loaded');
        else if (record.target.className)
          console.log('#' + record.target.className + ' which contains ' + selector + ' is loaded');
        else
          console.log('#' + record.target.tagName + ' which contains ' + selector + ' is loaded');
        //if (trigger_once)
        //observer.disconnect();
        action.call($(record.target).find(selector));
      }
    });
  };
 
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  if (MutationObserver) {
    var observer = new MutationObserver(reaction);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    //setInterval(reaction, 100);
  }
};
 
if ($('body').hasClass('is_mobile')) {
  $('.mh_post_page').inserted(function() {
    $(this).find(".media img").each(function() {
      this.src = this.src.replace(/_\d+\./, '_1280.');
    });
  });
} else {
  $(".post_wrapper, .post_container").inserted(function() {
    console.log($(this).find(".post_media img").length);
    if ($(this).find(".post_media img").length > 0) {
      $(this).find(".photoset_photo img").each(function() {
        if (this.src != this.parentNode.href)
          this.src = this.parentNode.href;
      });
      $(this).find(".post_media_photo").each(function() {
        if ($(this).parent().attr("data-big-photo") && this.src != $(this).parent().attr("data-big-photo")) {
          this.src = $(this).parent().attr("data-big-photo");
          console.log(this.src);
        }
      });
    }
  });
}