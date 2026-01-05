// ==UserScript==
// @name        InstaSynchP SysMessage Hide
// @namespace   InstaSynchP
// @description Hides system messages after a short time to reduce spam in the chat

// @version     1.0.2
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-SysMessage-Hide
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js?version=37716
// @downloadURL https://update.greasyfork.org/scripts/7297/InstaSynchP%20SysMessage%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/7297/InstaSynchP%20SysMessage%20Hide.meta.js
// ==/UserScript==

function SysMessageHide(version) {
  "use strict";
  this.version = version;
  this.name = 'InstaSynchP SysMessage Hide';
  this.settings = [{
    label: 'Hide system messages after a delay',
    title: 'Disabling this will show the system messages again',
    id: 'sysmessage-hide',
    type: 'checkbox',
    'default': true,
    section: ['System Messages']
  }, {
    label: 'Delay to hide the messages in ms',
    id: 'sysmessage-hide-timeout',
    type: 'int',
    'default': 15000,
    size: 6,
    section: ['System Messages']
  }];
  this.hideTimeoutIds = [];
}

SysMessageHide.prototype.executeOnce = function () {
  "use strict";
  var th = this;

  events.on(th, 'SettingChange[sysmessage-hide]', function (oldVal, newVal) {
    $('#chat_messages .text-info').parent()[newVal ? 'hide' : 'show']();
    //stop all the outstanding timeouts
    for (var i = 0, len = th.hideTimeoutIds.length; i < len; i += 1) {
      clearTimeout(th.hideTimeoutIds[i]);
    }
    th.hideTimeoutIds = [];
    //scroll to the bottom
    $('#chat_messages').scrollTop($('#chat_messages')[0].scrollHeight);
  });

  events.on(th, 'AddMessage', function (ignore1, ignore2, extraStyles) {
    if (extraStyles !== 'text-info' || !gmc.get('sysmessage-hide')) {
      return;
    }
    var lastMessage, timeoutId;

    lastMessage = $('#chat_messages > :last-child');

    timeoutId = setTimeout(function () {
      lastMessage.hide();
      th.hideTimeoutIds.shift();
    }, gmc.get('sysmessage-hide-timeout'));

    th.hideTimeoutIds.push(timeoutId);
  });
};

window.plugins = window.plugins || {};
window.plugins.sysMessageHide = new SysMessageHide('1.0.2');
