// ==UserScript==
// @name        InstaSynchP Logger
// @namespace   InstaSynchP
// @description Log information with different levels

// @version     1.0.3
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-Logger
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/8159-log4javascript/code/log4javascript.js?version=37575
// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js?version=37716
// @downloadURL https://update.greasyfork.org/scripts/8177/InstaSynchP%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/8177/InstaSynchP%20Logger.meta.js
// ==/UserScript==

function Logger(version) {
  "use strict";
  this.version = version;
  this.name = 'InstaSynchP Logger';
  this.log = undefined;
  this.inPageAppender = undefined;
}

Logger.prototype.executeOnceCore = function () {
  "use strict";
  var th = this, oldError;
  log4javascript.setDocumentReady();
  th.log = log4javascript.getDefaultLogger();
  th.log.removeAllAppenders();
  th.inPageAppender = new log4javascript.InPageAppender(undefined, false, true, true, "100%", "300px");
  th.inPageAppender.setShowCommandLine(false);
  th.inPageAppender.setShowHideButton(true);
  th.inPageAppender.setScrollToLatestMessage(false);
  th.log.addAppender(th.inPageAppender);

  oldError = th.log.error;
  //add a message to chat on an error
  th.log.error = function () {
    oldError.apply(th.log, arguments);
    var message = '<b>An error has occured in the script. ' +
      'Please open the <a href="#" onclick="$(\'#log_btn\').trigger(\'click\')">log</a> ' +
      'and make a <a href="http://pastebin.com/" target="_blank">pastebin</a> ' +
      'of everything in there and send it to ' +
      '<a href="https://greasyfork.org/en/scripts/5653-instasynchp-core/feedback" target="_blank">me</a>.</b>';
    addErrorMessage(message);
  };

  //add button
  $('#tabs_chat_settings_content').append(
    $('<button>', {
      'class': 'btn btn-xs btn-primary',
      'id': 'log_btn'
    }).text('Log').click(function () {
      if (th.inPageAppender.isVisible()) {
        th.inPageAppender.hide();
      } else {
        th.inPageAppender.show();
      }
    })
  );
};

window.plugins = window.plugins || {};
window.plugins.logger = new Logger('1.0.3');
