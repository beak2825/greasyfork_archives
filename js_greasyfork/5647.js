// ==UserScript==
// @name        InstaSynchP Library
// @namespace   InstaSynchP
// @description Basic function that are needed by several scripts use with @require

// @version     1.1.8
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-Library
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start
// ==/UserScript==

//http://joquery.com/2012/string-format-for-javascript
if (typeof String.prototype.format !== 'function') {
  String.prototype.format = function () {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = this,
      i,
      regEx;

    // start with the second argument (i = 1)
    for (i = 0; i < arguments.length; i += 1) {
      // "gm" = RegEx options for Global search (more than one instance)
      // and for Multiline search
      regEx = new RegExp("\\{" + (i) + "\\}", "gm");
      theString = theString.replace(regEx, arguments[i]);
    }
    return theString;
  };
}
//http://stackoverflow.com/a/646643
if (typeof String.prototype.startsWith !== 'function') {
  String.prototype.startsWith = function (str) {
    return this.slice(0, str.length) == str;
  };
}
if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function (str) {
    return this.slice(-str.length) == str;
  };
}

//http://stackoverflow.com/a/1978419
if (typeof String.prototype.contains !== 'function') {
  String.prototype.contains = function (it) {
    return this.indexOf(it) !== -1;
  };
}
if (typeof Array.prototype.contains !== 'function') {
  Array.prototype.contains = function (it) {
    return this.indexOf(it) !== -1;
  };
}

function isUdef(obj) {
  "use strict";
  return typeof obj === 'undefined';
}

function commonPrefix(array) {
  "use strict";
  if (typeof array === 'undefined' || array.length === 0) {
    return;
  }
  var sorted = array.slice(0).sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    }),
    first = sorted[0],
    firstLower = first.toLowerCase(),
    last = sorted[sorted.length - 1].toLowerCase(),
    L = first.length,
    i = 0;
  while (i < L && firstLower.charAt(i) === last.charAt(i)) i++;
  return first.substring(0, i);
}

function isBlackname(username) {
  "use strict";
  if (typeof username !== 'string') {
    return false;
  }
  return username.match(/^(?:[A-Za-z0-9]|(?:[\-_](?![\-_]))){5,16}$/) !== null;
}

function isGreyname(username) {
  "use strict";
  if (typeof username !== 'string') {
    return false;
  }
  return username.match(/^(?:[A-Za-z0-9]|(?:[\-_](?![\-_]))){1,16}$/) !== null;
}

function htmlDecode(value) {
  "use strict";
  return $('<div/>').html(value).text();
}

function activeVideoIndex() {
  "use strict";
  return $('#playlist .active').index();
}

function findUserId(id) {
  "use strict";
  var i, users = window.room.userlist.users;
  for (i = 0; i < users.length; i += 1) {
    if (id === users[i].id) {
      return users[i];
    }
  }
  return undefined;
}

function findUserUsername(name) {
  "use strict";
  name = name.toLowerCase();
  var i, users = window.room.userlist.users;
  for (i = 0; i < users.length; i += 1) {
    if (name === users[i].username.toLowerCase()) {
      return users[i];
    }
  }
  return undefined;
}

function videojs() {
  "use strict";
  return $('.video-js')[0];
}

function sendcmd(cmd, opts) {
  "use strict";
  window.room.sendcmd(cmd, opts);
}

function reloadPlayer() {
  "use strict";
  if (window.room.video) {
    try {
      window.room.video.destroy();
    } catch (ignore) {}
  }
  sendcmd('reload', null);
}

function addSystemMessage(message) {
  "use strict";
  window.room.addMessage({
    username: ""
  }, message, 'text-info');
}

function addErrorMessage(message) {
  "use strict";
  window.room.addMessage({
    username: ""
  }, message, 'text-danger');
}

function videoInfoEquals(a, b) {
  "use strict";
  if (!a || !b) {
    return false;
  }
  return (a.provider && a.provider === b.provider &&
    a.mediaType && a.mediaType === b.mediaType &&
    a.id && a.id === b.id);
}

function scrollDown() {
  "use strict";
  $('#chat_messages').scrollTop($('#chat_messages')[0].scrollHeight);
}

function isMod(username) {
  "use strict";
  if (isUdef(username)) {
    return window.room.user.isMod;
  } else {
    return findUserUsername(username).permissions > 0;
  }
}

function thisUser() {
  "use strict";
  return room.user.userinfo;
}

function logger() {
  "use strict";
  return window.plugins.logger.log;
}

function createNavTab(op) {
  "use strict";
  return $('<li>').append(
    $('<a>', {
      class: 'active_tooltip',
      'data-original-title': op.tooltip,
      href: op.tab,
      'data-toggle': 'tab',
      rel: 'tooltip',
      'data-placement': op.tooltipPlacement || 'bottom'
    }).append(
      $('<i>', {
        class: op.class
      })
    ).tooltip()
  );
}
