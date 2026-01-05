// ==UserScript==
// @name        InstaSynchP UserSpy
// @namespace   InstaSynchP
// @description Log user actions into the chat (login/off, video add)

// @version     1.1.3
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-UserSpy
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js?version=37716
// @downloadURL https://update.greasyfork.org/scripts/6598/InstaSynchP%20UserSpy.user.js
// @updateURL https://update.greasyfork.org/scripts/6598/InstaSynchP%20UserSpy.meta.js
// ==/UserScript==
function UserSpy(version) {
  'use strict';
  this.version = version;
  this.name = 'InstaSynchP UserSpy';
  this.settings = [{
    label: 'Show user logs in or off',
    id: 'login-off-log',
    type: 'checkbox',
    'default': true,
    section: ['UserSpy']
  }, {
    label: 'Show when a greyname logs in or off',
    id: 'login-off-greynames-log',
    type: 'checkbox',
    'default': true,
    section: ['UserSpy']
  }, {
    label: 'Show when a greyname renames himself',
    id: 'rename-log',
    type: 'checkbox',
    'default': true,
    section: ['UserSpy']
  }, {
    label: 'Show when someone adds a video',
    title: 'Includes the title',
    id: 'add-video-log',
    type: 'checkbox',
    'default': true,
    section: ['UserSpy']
  }, {
    label: 'Show when a video gets played',
    id: 'play-video-log',
    type: 'checkbox',
    'default': true,
    section: ['UserSpy']
  }];
  this.lastVideo = {};
}

UserSpy.prototype.getAddVideoMessage = function (video) {
  'use strict';
  //user added <a href="url">title</a>
  return ''.concat(
    video.addedby,
    ' added ',
    '<a target="_blank" href="',
    urlParser.create({
      videoInfo: video.info,
      format: 'long'
    }),
    '">',
    video.title.substr(0, 240),
    '</a>'
  );
};

UserSpy.prototype.getRenameMessage = function (user) {
  'use strict';
  //ip renamed to username
  return ''.concat(
    user.ip,
    ' renamed to ',
    user.username
  );
};

UserSpy.prototype.getLogOnMessage = function (user) {
  'use strict';
  //user(ip) logged on
  return ''.concat(
    user.username,
    '(',
    user.ip,
    ') logged on'
  );
};

UserSpy.prototype.getLogOffMessage = function (user) {
  'use strict';
  //user(ip) logged off
  return ''.concat(
    user.username,
    '(',
    user.ip,
    ') logged off'
  );
};

UserSpy.prototype.getPlayVideoMessage = function (video) {
  'use strict';
  //Now playing title via user
  return ''.concat(
    'Now playing ',
    '<a target="_blank" href="',
    urlParser.create({
      videoInfo: video.info,
      format: 'long'
    }),
    '">',
    video.title.substr(0, 240),
    '</a>',
    ' via ',
    video.addedby);
};

UserSpy.prototype.executeOnce = function () {
  'use strict';
  var _this = this;
  events.on(_this, 'RenameUser', function (user) {
    if (gmc.get('rename-log')) {
      addSystemMessage(_this.getRenameMessage(user));
    }
  });
};

UserSpy.prototype.postConnect = function () {
  'use strict';
  var _this = this;
  //add events after we connected so it doesn't spam the chat for every user/video
  events.on(_this, 'AddUser', _this.userLoggedOn);
  events.on(_this, 'RemoveUser', _this.userLoggedOff);
  events.on(_this, 'AddVideo', _this.videoAdded);
  events.on(_this, 'PlayVideo', _this.videoPlayed);
};

UserSpy.prototype.resetVariables = function () {
  'use strict';
  var _this = this;
  //remove events when disconnecting/changing room and readd at postConnect
  events.unbind('AddUser', _this.userLoggedOn);
  events.unbind('RemoveUser', _this.userLoggedOff);
  events.unbind('AddVideo', _this.videoAdded);
  events.unbind('PlayVideo', _this.videoPlayed);
  _this.lastVideo = {};
};

UserSpy.prototype.videoPlayed = function (video) {
  'use strict';
  var _this = this;
  if (gmc.get('play-video-log') &&
    !videoInfoEquals(video.info, _this.lastVideo.info)) {
    _this.lastVideo = video;
    addSystemMessage(_this.getPlayVideoMessage(video));
  }
};

UserSpy.prototype.videoAdded = function (video) {
  'use strict';
  var _this = this;
  if (gmc.get('add-video-log')) {
    addSystemMessage(_this.getAddVideoMessage(video));
  }
};

UserSpy.prototype.isUserLogged = function (user) {
  'use strict';
  return gmc.get('login-off-log') &&
    (user.loggedin || gmc.get('login-off-greynames-log'));
};

UserSpy.prototype.userLoggedOn = function (user) {
  'use strict';
  var _this = this;
  if (_this.isUserLogged(user)) {
    addSystemMessage(_this.getLogOnMessage(user));
  }
};

UserSpy.prototype.wasUserForcedOff = function (user) {
  'use strict';
  var _this = this;
  var reg = new RegExp('^[^\\s]+ has (?:kicked|banned) {0}\\({1}\\)$'
    .format(user.username, user.ip));
  return (!isUdef(window.plugins.modSpy) &&
    $('#chat_messages > :last-child').find('.username').text() === ': ' &&
    $('#chat_messages > :last-child').find('.message').text().match(reg));
};

UserSpy.prototype.userLoggedOff = function (user) {
  'use strict';
  var _this = this;
  if (_this.isUserLogged(user) && !_this.wasUserForcedOff(user)) {
    addSystemMessage(_this.getLogOffMessage(user));
  }
};

window.plugins = window.plugins || {};
window.plugins.userSpy = new UserSpy('1.1.3');
