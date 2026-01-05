// ==UserScript==
// @name        InstaSynchP Bibby
// @namespace   InstaSynchP
// @description Bibby specific changes

// @version     1.1.2
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-Bibby
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js?version=37716
// @downloadURL https://update.greasyfork.org/scripts/8178/InstaSynchP%20Bibby.user.js
// @updateURL https://update.greasyfork.org/scripts/8178/InstaSynchP%20Bibby.meta.js
// ==/UserScript==

function Bibby(version) {
  'use strict';
  this.version = version;
  this.name = 'InstaSynchP Bibby';
  this.settings = [{
    label: 'Wallcounter limit notifications',
    id: 'wallcounter-limit-notify',
    type: 'checkbox',
    default: true,
    section: ['Bibby']
  }];
  this.isBibby = false;
}

Bibby.prototype.overwriteWallCreateFormat = function () {
  'use strict';
  var wallcounter = window.plugins.wallcounter;
  if (isUdef(wallcounter)) {
    return;
  }
  var oldCreateFormat = wallcounter.Wall.prototype.createFormat;
  wallcounter.Wall.prototype.createFormat = function () {
    var _this = this;
    if (_this.duration > 60 * 60) {
      return '<span style=\'color:red\'>' +
        oldCreateFormat.apply(_this, arguments) +
        '</span>';
    } else {
      return oldCreateFormat.apply(_this, arguments);
    }
  };
};

Bibby.prototype.checkWall = function (video) {
  'use strict';
  var message;
  var wall;
  var wallcounter = window.plugins.wallcounter;
  var addedby = video.addedby.toLowerCase();

  if (!gmc.get('wallcounter-limit-notify') ||
    gmc.get('add-video-log', false) ||
    isUdef(wallcounter) ||
    thisUser().username.toLowerCase() === addedby) {
    return;
  }
  wall = wallcounter.getWallForUsername(addedby);
  if (wall.duration < 60 * 60) {
    return;
  }
  message = wall.format('Wallcounter {0}', '{1}', '{2}');
  addErrorMessage(message);
};


Bibby.prototype.wallcounterNotification = function () {
  'use strict';
  events.on(this, 'AddVideo', this.checkWall);
};

Bibby.prototype.executeOnce = function () {
  'use strict';
  var _this = this;
  _this.isBibby = (window.room.roomName.toLowerCase() === 'bibby');
  if (!_this.isBibby) {
    return;
  }
  _this.overwriteWallCreateFormat();
};

Bibby.prototype.postConnect = function () {
  'use strict';
  var _this = this;
  if (!_this.isBibby) {
    return;
  }
  _this.wallcounterNotification();
};


Bibby.prototype.resetVariables = function () {
  'use strict';
  events.unbind('AddVideo', this.checkWall);
};

window.plugins = window.plugins || {};
window.plugins.bibby = new Bibby('1.1.2');
