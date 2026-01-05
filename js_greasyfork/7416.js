// ==UserScript==
// @name      Scroll and prop
// @version   0.0.1
// @description Scrolls fitocracy feed and gives props to everyone
// @match     https://www.fitocracy.com/home/*
// @match     https://www.fitocracy.com/profile/*
// @namespace https://github.com/artm
// @require   https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/1.4.14/jquery.scrollTo.min.js
// @grant     none
// @downloadURL https://update.greasyfork.org/scripts/7416/Scroll%20and%20prop.user.js
// @updateURL https://update.greasyfork.org/scripts/7416/Scroll%20and%20prop.meta.js
// ==/UserScript==

createPropButton();

function createPropButton() {
  var button = $('<label for="autoprop">prop</label>')
  .appendTo('body')
  .css({position: "fixed"});
  
  $('<input id="autoprop" type="checkbox">')
  .appendTo('body')
  .button()
  .change(function(e) {
    if (this.checked) {
      scrollToUnpropped();
    } else {
      $(window)._scrollable().clearQueue().scrollTo("0%", 500);
    }
  });
  
  $(window)
  .resize(button, function(e) { keepCornered(e.data); })
  .resize();
}

function scrollToUnpropped(unpropped) {
  if (!unpropped || !unpropped.length) {
    unpropped = $(".stream_item .give_prop").get();
  }
  var topUnpropped = unpropped.shift();
  if (topUnpropped) {
    propAndContinue(topUnpropped, unpropped);
  } else {
    scrollForMore();
  }
}

function propAndContinue(topUnpropped, unpropped) {
  $(window)
  ._scrollable()
  .scrollTo(topUnpropped, 1000, {
    offset: -60
  })
  .delay(250)
  .queue(function() {
    $(this).dequeue();
    $(topUnpropped).click();
  })
  .delay(250)
  .queue(function() {
    $(this).dequeue();
    scrollToUnpropped(unpropped);
  });
}

function scrollForMore() {
  $(window)
  ._scrollable()
  .scrollTo("100%", 500)
  .delay(1000)
  .queue(function() {
    $(this).dequeue();
    scrollToUnpropped();
  });
}

function keepCornered(widget) {
  widget.position({ 
    my: "right bottom", 
    at: "right-10 bottom-10", 
    of: window, 
    collision: "none" 
  });
}