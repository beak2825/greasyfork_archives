// // ==UserScript==
// @name          Chaturbate Better Full Screen
// @version       1.2
// @include       https://chaturbate.com/*
// @include       https://chaturbate.com/#*
// @exclude       https://*.chaturbate.com/*-cams/
// @exclude       https://chaturbate.com/*-cams/
// @namespace https://greasyfork.org/en/scripts/8725-chaturbate-better-full-screen
// @description:en Adds a better full screen view that has the chat.
// @source https://greasyfork.org/en/scripts/8725-chaturbate-better-full-screen
// @description Adds a better full screen view that has the chat.
// @downloadURL https://update.greasyfork.org/scripts/8725/Chaturbate%20Better%20Full%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/8725/Chaturbate%20Better%20Full%20Screen.meta.js
// ==/UserScript==

if (window.top != window.self)  //-- Don't run on frames or iframes
  return;

var main = function() {
  var betterFullScreenOpen = false,
      prevHeight = 0;

  if (typeof $ !== 'undefined') {
    $(document).ready(
      function() {
        var addActionBtn = function() {
          $('body').append('<div id="betterFullScreenBtn" onclick="toggleBetterFullScreen()"><i class="fa fa-arrows-alt"><i></div>');
        };

        window.toggleBetterFullScreen = function(e) {
          betterFullScreenOpen = !betterFullScreenOpen;
          $('#defchat .section').toggleClass('betterFullScreen');
          $('#betterFullScreenBtn .fa').toggleClass('fa-arrows-alt').toggleClass('fa-compress');
          if (betterFullScreenOpen) {
            prevHeight = $('.video-box #player').css('height');
            var width = $('.video-box #player').width();
            $('.video-box #player').css('height', ((width*(664/842))-10)+'px');
            $('body').append('<div id="betterFullScreenOverlay"></div>');
          } else {
            $('.video-box #player').css('height', prevHeight);
            $('#betterFullScreenOverlay').remove();
          }
        };

        var url = '//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css';
        if (document.createStyleSheet) {
          document.createStyleSheet(url);
        } else if (typeof $ !== 'undefined') {
          $('<link rel="stylesheet" type="text/css" href="' + url + '" />').appendTo('head');
        }

        addActionBtn();
      }
    );
  }
};

var script = document.createElement('script');
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);
var style = document.createElement('style');
style.innerHTML = ''+
'#betterFullScreenBtn {'+
  'width: 25px !important;' +
  'height: 25px !important;' +
  'top: 10px !important;' +
  'right: 10px !important;' +
  'z-index: 2000 !important;' +
  'position: fixed !important;' +
  'cursor: pointer !important;' +
  'background: #e0e0e0 !important;' +
  'border: 1px solid #acacac !important;' +
  'border-radius: 4px !important;' +
  '-webkit-border-radius: 4px !important;' +
  '-moz-border-radius: 4px !important;' +
  'padding: 4px !important;' +
  'font-size: 25px !important;' +
  'text-align: center !important;' +
'}' +
'#betterFullScreenOverlay {' +
  'top: 0;' +
  'left: 0;' +
  'right: 0;' +
  'bottom: 0;' +
  'position: fixed;' +
  'background: #e0e0e0;' +
  'z-index: 1998;' +
'}' +
'.betterFullScreen {' +
  'top: 0 !important;' +
  'left: 0 !important;' +
  'right: 0 !important;' +
  'bottom: 0 !important;' +
  'position: fixed !important;' +
  'z-index: 1999 !important;' +
  'height: 100%!important;' +
'}' +
'.betterFullScreen .video-box {' +
  'position: fixed !important;' +
  'left: 0 !important;' +
  'top: 0 !important;' +
  'width: 60% !important;' +
  'height: 100% !important;' +
'}' +
'.betterFullScreen .video-box #player {' +
  'width: 100% !important;' +
'}' +
'.betterFullScreen .video-box .title {' +
  'width: calc(100% - 15px);' +
  'position: relative;' +
  'overflow: visible;' +
'}' +
'.betterFullScreen .video-box .title #tooltip-subject {' +
  'width: initial !important;' +
  'right: 0;' +
'}' +
'.betterFullScreen .chat-holder {' +
  'position: fixed !important;' +
  'right: 0 !important;' +
  'top: 0 !important;' +
  'width: calc(40% - 10px) !important;' +
  'height: 100% !important;' +
'}' +
'.betterFullScreen .chat-box {' +
  'height: 100% !important;' +
'}' +
'.betterFullScreen .users-list, .betterFullScreen .settings-list, .betterFullScreen .chat-list {' +
  'height: calc(100% - 75px) !important;' +
'}';
document.body.appendChild(style);
