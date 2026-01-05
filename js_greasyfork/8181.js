// ==UserScript==
// @name         InstaSynchP Wallcounter
// @namespace    InstaSynchP
// @description  Summarizes the lengths of each users (or a list of users) walls
// @version      1.0.6
// @author       Zod-
// @source       https://github.com/Zod-/InstaSynchP-Wallcounter
// @license      MIT
// @require      https://greasyfork.org/scripts/5647-instasynchp-library/code/code.js?version=37716
// @include      *://instasync.com/r/*
// @include      *://*.instasync.com/r/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/8181/InstaSynchP%20Wallcounter.user.js
// @updateURL https://update.greasyfork.org/scripts/8181/InstaSynchP%20Wallcounter.meta.js
// ==/UserScript==

function Wall(username) {
  'use strict';
  this.duration = 0;
  this.videoCount = 0;
  this.username = username;
}

Wall.prototype.add = function (video) {
  'use strict';
  this.videoCount++;
  this.duration += video.duration;
};

Wall.prototype.remove = function (video) {
  'use strict';
  this.videoCount--;
  this.duration -= video.duration;
};

Wall.prototype.createFormat = function (name, duration, videoCount) {
  'use strict';
  return name + '[' + duration + ' - ' + videoCount + ']';
};

Wall.prototype.format = function (name, duration, videoCount) {
  'use strict';
  var _this = this;
  var format = _this.createFormat(name, duration, videoCount);

  return format.format(
    _this.username,
    window.utils.secondsToTime(_this.duration),
    _this.videoCount
  );
};

function Wallcounter() {
  'use strict';
  this.version = '1.0.6';
  this.name = 'InstaSynchP Wallcounter';
  this.walls = {};
  this.userWall = undefined;
  this.commands = {
    '\'wallcounter': {
      hasArguments: true,
      reference: this,
      description: 'Summarizes the lengths of each users video walls or\
      specific users ',
      callback: this.execute
    }
  };
  this.styles = [{
    name: 'wallcounter',
    url: 'https://cdn.rawgit.com/Zod-/InstaSynchP-Wallcounter/9bc2c3c08d1560ce1253d8bb858ebe29ff645ec8/dist/wallcounter.css',
    autoload: true
  }];
  this.Wall = Wall;
}

Wallcounter.prototype.resetVariables = function () {
  'use strict';
  this.userWall = undefined;
  this.walls = {};
};

Wallcounter.prototype.updateOwnDisplay = function () {
  'use strict';
  var _this = this;
  $('#playlist_wallcounter').empty().append(
    _this.userWall.format('Wallcounter', '{1}', '{2}')
  );
};

Wallcounter.prototype.key = function (key) {
  'use strict';
  return key.toLowerCase();
};

Wallcounter.prototype.increase = function (username, video) {
  'use strict';
  this.walls[this.key(username)].add(video);
};

Wallcounter.prototype.decrease = function (username, video) {
  'use strict';
  this.walls[this.key(username)].remove(video);
};

Wallcounter.prototype.create = function (username) {
  'use strict';
  this.walls[this.key(username)] = new this.Wall(username);
};

Wallcounter.prototype.createIfNotExists = function (username) {
  'use strict';
  var _this = this;
  if (_this.walls.hasOwnProperty(_this.key(username))) {
    return;
  }
  _this.create(username);
};

Wallcounter.prototype.bindUpdates = function () {
  'use strict';
  var _this = this;

  function onAddVideo(video) {
    _this.increase(video.addedby, video);
    _this.updateOwnDisplay();
  }

  function onAddUser(user) {
    _this.createIfNotExists(user.username);
  }

  function onLoadPlaylist(videos) {
    videos.forEach(function (video) {
      onAddUser({
        username: video.addedby
      });
      onAddVideo(video);
    });
    events.on(_this, 'AddVideo', onAddVideo, true);
  }

  //LoadPlaylist happens before LoadUserlist so the walls would not have been
  //created yet when recieving the AddVideo events
  events.on(_this, 'LoadPlaylist', function () {
    events.unbind('AddVideo', onAddVideo);
  }, true);
  events.on(_this, 'LoadPlaylist', onLoadPlaylist);

  events.on(_this, 'AddUser', onAddUser);

  events.on(_this, 'RemoveVideo', function (video) {
    _this.decrease(video.addedby, video);
    _this.updateOwnDisplay();
  }, true);
};

Wallcounter.prototype.initUserWall = function () {
  'use strict';
  var _this = this;
  _this.userWall = new Wall(thisUser().username);
  _this.walls[_this.key(_this.userWall.username)] = _this.userWall;
};

Wallcounter.prototype.isAddVideoMessage = function (user, message) {
  'use strict';
  return (user.username === '' && message === 'Video added successfully.');
};

Wallcounter.prototype.getAddVideoMessage = function () {
  'use strict';
  var _this = this;
  return 'Video added successfully {0}'.format(
    _this.userWall.format('', '{1}', '{2}')
  );
};

Wallcounter.prototype.writeAddVideoMessage = function () {
  'use strict';
  if (!gmc.get('add-video-log', false)) {
    addSystemMessage(this.getAddVideoMessage());
  }
};

Wallcounter.prototype.hideLastMessage = function () {
  'use strict';
  $('#chat_messages >:last-child').hide();
};

Wallcounter.prototype.bindAddMessage = function () {
  'use strict';
  var _this = this;
  events.on(_this, 'AddMessage', function (user, message) {
    if (_this.isAddVideoMessage(user, message)) {
      _this.hideLastMessage();
      _this.writeAddVideoMessage();
    }
  });
};

Wallcounter.prototype.extendUserSpy = function () {
  'use strict';
  var _this = this;
  var userSpy = window.plugins.userSpy;
  if (isUdef(userSpy)) {
    return;
  }

  var oldGetAddVideoMessage = userSpy.getAddVideoMessage;

  userSpy.getAddVideoMessage = function getAddVideoMessage(video) {
    return oldGetAddVideoMessage.apply(userSpy, arguments) + ' ' +
      _this.getWallForUsername(video.addedby).format('', '{1}', '{2}');
  };
};

Wallcounter.prototype.executeOnce = function () {
  'use strict';
  var _this = this;
  _this.bindUpdates();

  events.on(_this, 'Joined', _this.initUserWall);

  _this.bindAddMessage();

  _this.extendUserSpy();
};

Wallcounter.prototype.preConnect = function () {
  'use strict';
  //own wallcounter display below the playlist
  $('.playlist-stats').append(
    $('<div>', {
      id: 'playlist_wallcounter'
    }).text('Wallcounter[00:00 - 0]')
  );
};

Wallcounter.prototype.postfixForIndex = function (index, max) {
  'use strict';
  if (index === max - 1) {
    return '';
  } else if (index % 2 === 1) {
    return '<br>';
  } else {
    return ' - ';
  }
};

Wallcounter.prototype.formatOutput = function (walls) {
  'use strict';
  var _this = this;
  var output = 'Wallcounter<br>';

  walls.forEach(function (wall, index) {
    output += wall.format('{0}', '<b>{1}</b>', '{2}');
    output += _this.postfixForIndex(index, walls.length);
  });

  return output;
};

Wallcounter.prototype.getWallForUsername = function (username) {
  'use strict';
  var _this = this;
  if (_this.walls.hasOwnProperty(_this.key(username))) {
    return _this.walls[_this.key(username)];
  }
  return undefined;
};

Wallcounter.prototype.getWallsForUsernames = function (usernames) {
  'use strict';
  var _this = this;
  var walls = [];

  usernames.forEach(function (username) {
    var wall = _this.getWallForUsername(username);
    if (!isUdef(wall)) {
      walls.push(wall);
    }
  });

  return walls;
};

Wallcounter.prototype.getNonEmptyWalls = function (usernames) {
  'use strict';
  var _this = this;
  var walls = [];

  _this.getWallsForUsernames(usernames).forEach(function (wall) {
    if (wall.videoCount !== 0) {
      walls.push(wall);
    }
  });

  return walls;
};

Wallcounter.prototype.execute = function (opts) {
  'use strict';
  var _this = this;
  var walls = [];

  if (opts.usernames.length !== 0) {
    walls = _this.getNonEmptyWalls(opts.usernames);
  } else {
    walls = _this.getNonEmptyWalls(Object.keys(_this.walls));
  }

  walls.sort(function (c1, c2) {
    return c2.duration - c1.duration;
  });

  addSystemMessage(_this.formatOutput(walls));
};

window.plugins = window.plugins || {};
window.plugins.wallcounter = new Wallcounter();
