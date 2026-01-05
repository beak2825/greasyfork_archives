// ==UserScript==
// @name        InstaSynchP ModSpy
// @namespace   InstaSynchP
// @description Log mod actions into the chat (kick, ban, remove videos, ...)

// @version     1.0.9
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-Modspy
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js?version=37716
// @downloadURL https://update.greasyfork.org/scripts/5962/InstaSynchP%20ModSpy.user.js
// @updateURL https://update.greasyfork.org/scripts/5962/InstaSynchP%20ModSpy.meta.js
// ==/UserScript==

function ModSpy(version) {
  "use strict";
  this.version = version;
  this.name = 'InstaSynchP ModSpy';
  this.filterList = [
    /^Resynch request(?:ed)? ?(?:sent)?\.?\.$/,
    /cleaned the playlist/,
    /^play(?:ing)?$/,
    /Using HTML5 player is not recomended\./,
    /^load start$/,
    /^paused$/,
    /^stalled$/,
    /^activate$/,
    /^Attempt: \d+$/,
    /^XHR TIMEOUT$/
  ];
}

ModSpy.prototype.executeOnce = function () {
  "use strict";
  var th = this,
    oldLog = window.console.log,
    lastRemovedVideo,
    lastMovedVideo,
    lastSkipPercentage,
    actiontaker,
    lastAction,
    bumpCheck;

  window.console.log = function (message) {
    var i,
      filter,
      match;
    //only check for strings
    if (typeof message !== 'string') {
      oldLog.apply(window.console, arguments);
      return;
    }

    //add as error message and then return
    if (message.startsWith("Error:")) {
      addErrorMessage(message);
      oldLog.apply(window.console, arguments);
      return;
    }

    filter = false;
    for (i = 0; i < th.filterList.length; i += 1) {
      if (message.match(th.filterList[i])) {
        filter = true;
        break;
      }
    }
    //return if setting is off or message is filtered
    if (filter) {
      oldLog.apply(window.console, arguments);
      return;
    }
    //prepare the message for each log
    if ((match = message.match(/([^\s]+) moved a video\./))) {
      message = '{0} {1} a <a href="{2}" target="_blank">video</a> via {3}'.format(
        match[1],
        bumpCheck ? 'bumped' : 'moved',
        urlParser.create({
          videoInfo: lastMovedVideo.info
        }),
        lastMovedVideo.addedby
      );
      bumpCheck = false;
    } else if ((match = message.match(/([^\s]+) has banned a user\./))) {
      lastAction = 'banned';
      actiontaker = match[1];
    } else if ((match = message.match(/([^\s]+) has kicked a user\./))) {
      lastAction = 'kicked';
      actiontaker = match[1];
    } else if ((match = message.match(/([^\s]+) removed a video\./))) {
      message = '{0} removed a <a href="{1}" target="_blank">video</a> via {2}.'.format(
        match[1],
        urlParser.create({
          videoInfo: lastRemovedVideo.info
        }),
        lastRemovedVideo.addedby
      );
    } else if ((match = message.match(/([^\s]+) modified the skip ratio\./))) {
      message = '{0} set skip ratio to {1}%'.format(match[1], lastSkipPercentage);
    }

    //add the message to the chat if we don't have to wait for the event to happen
    //user removed events gets fired after the log
    if (!lastAction) {
      addSystemMessage(message);
    }

    oldLog.apply(window.console, arguments);
  };

  events.on(th, 'RemoveUser', function (user) {
    //print the kick/ban log
    if (lastAction && (lastAction === 'banned' || lastAction === 'kicked')) {
      addSystemMessage('{0} has {1} {2}({3})'.format(actiontaker, lastAction, user.username, user.ip));
      lastAction = undefined;
      actiontaker = undefined;
    }
  });

  events.on(th, 'MoveVideo', function (video, position, oldPosition) {
    //save the vidinfo for the log
    lastMovedVideo = video;
    //check if the video got bumped
    if (Math.abs(activeVideoIndex() - position) <= 10 && Math.abs(oldPosition - position) > 10) { // "It's a bump ! " - Amiral Ackbar
      bumpCheck = true;
    }
  });

  events.on(th, 'RemoveVideo', function (video) {
    //save the video for the log
    lastRemovedVideo = video;
  });

  events.on(th, 'Skips', function (ignore1, ignore2, percent) {
    //save the percentage for the log
    lastSkipPercentage = Math.round(percent * 100) / 100;
  });

  events.on(th, 'AddMessage', function (user, message) {
    if (user.username === '' &&
      message.match(/^User (?:kicked|(?:un)?banned)\.?$/)) {
      $('#chat_messages >:last-child').hide()
        .find('.message').toggleClass('text-info');
    }
  });
};

window.plugins = window.plugins || {};
window.plugins.modSpy = new ModSpy('1.0.9');
