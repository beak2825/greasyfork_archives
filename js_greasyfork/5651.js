// ==UserScript==
// @name         InstaSynchP Event Hooks
// @namespace    InstaSynchP
// @description  Attaches itself to the functions on InstaSync to fire events
// @version      1.1.9
// @author       Zod-
// @source       https://github.com/Zod-/InstaSynchP-Event-Hooks
// @license      MIT
// @require      https://greasyfork.org/scripts/5647-instasynchp-library/code/code.js?version=41059
// @require      https://greasyfork.org/scripts/2857-jquery-bind-first/code/code.js?version=26080
// @include      *://instasync.com/r/*
// @include      *://*.instasync.com/r/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/5651/InstaSynchP%20Event%20Hooks.user.js
// @updateURL https://update.greasyfork.org/scripts/5651/InstaSynchP%20Event%20Hooks.meta.js
// ==/UserScript==

function EventHooks() {
  'use strict';
  this.version = '1.1.9';
  this.name = 'InstaSynchP Event Hooks';
  this.resetVariables();
  this.isPlaylistLoaded = false;
  this.isShuffle = false;
  this.hooks = {};
  this.hookBinds = {
    events: {
      connected: 'Connected',
      joining: 'Joining',
      joined: 'Joined',
      reconnecting: 'Reconnecting',
      reconnect: 'Reconnect',
      disconnect: 'Disconnect'
    },
    playlist: {
      addVideo: 'AddVideo',
      removeVideo: 'RemoveVideo',
      moveVideo: 'MoveVideo',
      load: 'LoadPlaylist',
      purge: 'Purge',
    },
    userlist: {
      addUser: 'AddUser',
      removeUser: 'RemoveUser',
      load: 'LoadUserlist',
      renameUser: 'RenameUser',
    },
    poll: {
      create: 'CreatePoll',
      addVote: 'AddPollVote',
      removeVote: 'RemovePollVote',
      end: 'EndPoll',
    },
    room: {
      addMessage: 'AddMessage',
      makeLead: 'MakeLeader',
      playVideo: 'PlayVideo',
      resume: 'Resume',
      pause: 'Pause',
      seekTo: 'SeekTo',
      setSkips: 'Skips',
      sendcmd: 'SendCMD',
    }
  };
}

EventHooks.prototype.bindLinkifySuppress = function () {
  'use strict';
  var oldLinkify = window.linkify;

  window.linkify = function (str, buildHashtagUrl, includeW3, target) {
    var tags = [];
    var index = -1;
    //remove image urls so they wont get linkified
    str = str.replace(/(src|href)=\"([^\"]*)\"/gi, function ($0, $1, $2) {
      tags.push({
        'tagName': $1,
        'url': $2
      });
      return '{0}=\"\"'.format($1);
    });
    str = oldLinkify(str, buildHashtagUrl, includeW3, target);
    //put them back in
    str = str.replace(/(src|href)=\"\"/gi, function () {
      index += 1;
      return '{0}="{1}"'.format(tags[index].tagName, tags[index].url);
    });
    return str;
  };
};

EventHooks.prototype.countUser = function (user, addRemove) {
  'use strict';
  var _this = this;
  var inc = (typeof addRemove === 'boolean' && addRemove) ? 1 : -1;
  if (user.permissions > 0) {
    _this.mods += inc;
  }
  if (user.loggedin) {
    _this.blacknames += inc;
  } else {
    _this.greynames += inc;
  }
};

EventHooks.prototype.addUser = function (user) {
  'use strict';
  this.countUser(user, true);
};

EventHooks.prototype.removeUser = function (user) {
  'use strict';
  this.countUser(user, false);
};

EventHooks.prototype.bindUserCount = function () {
  'use strict';
  var _this = this;

  events.on(_this, 'RemoveUser', function (user) {
    _this.removeUser(user);
  }, true);

  events.on(_this, 'AddUser', function (user) {
    _this.addUser(user);
  }, true);
};

EventHooks.prototype.createHook = function (ev) {
  'use strict';
  var _this = this;

  function defaultFunction() {
    var instasyncArgs = arguments[0];
    var frameworkArgs = arguments[1] || instasyncArgs;
    events.fire(ev.name, frameworkArgs, true);
    ev.oldFn.apply(undefined, instasyncArgs);
    events.fire(ev.name, frameworkArgs, false);
  }

  function arrayFunction() {
    var instasyncArgs = arguments[0];
    var frameworkArgs = arguments[1] || instasyncArgs;
    frameworkArgs = frameworkArgs[0];
    frameworkArgs.forEach(function () {
      var args = [].slice.call(arguments);
      args = args.slice(0, args.length - 2);
      events.fire(ev.name, args, true);
    });
    ev.oldFn.apply(undefined, instasyncArgs);
    frameworkArgs.forEach(function () {
      var args = [].slice.call(arguments);
      args = args.slice(0, args.length - 2);
      events.fire(ev.name, args, false);
    });
  }

  if (ev.location === 'events') {
    window.room.e.on(ev.hook, function () {
      events.fire(ev.name, arguments, false);
    });
    return;
  }
  //custom hooks
  switch (ev.name) {
  case 'LoadPlaylist':
    return function () {
      if (!_this.isPlaylistLoaded) {
        defaultFunction.apply(undefined, [arguments]);
        _this.isPlaylistLoaded = true;
      } else {
        events.fire('Shuffle', arguments, true);
        ev.oldFn.apply(undefined, arguments);
        events.fire('Shuffle', arguments, false);
      }
    };
  case 'AddUser':
    return function () {
      if (Array.isArray(arguments[0])) {
        arrayFunction.apply(undefined, [arguments]);
      } else {
        defaultFunction.apply(undefined, [arguments]);
      }
    };
  case 'AddVideo':
    return function () {
      if (_this.isShuffle) {
        ev.oldFn.apply(undefined, arguments);
        return;
      }
      if (Array.isArray(arguments[0])) {
        arrayFunction.apply(undefined, [arguments]);
      } else {
        defaultFunction.apply(undefined, [arguments]);
      }
    };
  case 'RemoveUser':
  case 'MakeLeader':
  case 'RenameUser':
    return function () {
      var user = findUserId(arguments[0]);
      if (ev.name === 'RenameUser') {
        user.username = arguments[1];
      }
      defaultFunction.apply(undefined, [
        arguments, [user]
      ]);
    };
  case 'PlayVideo':
  case 'RemoveVideo':
  case 'MoveVideo':
    return function () {
      var indexOfVid = window.room.playlist.indexOf(arguments[0]);
      var video = window.room.playlist.videos[indexOfVid];
      var args = [].slice.call(arguments);
      args[0] = video;
      if (ev.name === 'MoveVideo') {
        args.push(indexOfVid);
      }
      defaultFunction.apply(undefined, [arguments, args]);
    };
  case 'Skips':
    return function () {
      var args = [].slice.call(arguments);
      args.push((args[1] / _this.blacknames) * 100); //skip percentage
      defaultFunction.apply(undefined, [arguments, args]);
    };
  }
  return function () {
    defaultFunction.apply(undefined, [arguments]);
  };
};

EventHooks.prototype.forEachHookBind = function (callback) {
  'use strict';
  var _this = this;
  Object.keys(_this.hookBinds).forEach(function (locationName) {
    var location = _this.hookBinds[locationName];
    Object.keys(location).forEach(function (hookName) {
      var hook = location[hookName];
      callback.apply(_this, [{
        name: locationName,
        value: location
      }, {
        name: hookName,
        value: hook
      }]);
    });
  });
};

EventHooks.prototype.bindHooks = function () {
  'use strict';
  var _this = this;
  _this.forEachHookBind(function (locationPair, hookPair) {
    var ev = {
      hook: hookPair.name,
      name: hookPair.value,
      location: locationPair.name
    };
    if (locationPair.name === 'events') {
      _this.createHook(ev);
    } else if (locationPair.name === 'room') {
      ev.oldFn = window.room[ev.hook];
      window.room[ev.hook] = _this.createHook(ev);
    } else {
      if (locationPair.name === 'room') {
        ev.context = window.room;
      } else {
        ev.context = window.room[ev.location];
      }
      ev.oldFn = ev.context[ev.hook];
      ev.context[ev.hook] = _this.createHook(ev);
    }
  });
};

EventHooks.prototype.bindPageMessages = function () {
  'use strict';
  window.addEventListener('message', function (event) {
    try {
      var parsed = JSON.parse(event.data);
      if (parsed.action) {
        //own events
        events.fire(parsed.action, [parsed.data], false);
      }
      //all
      events.fire('PageMessage', [parsed], false);
    } catch (ignore) {}
  }, false);
};

EventHooks.prototype.bindShuffle = function () {
  'use strict';
  var _this = this;

  events.on(_this, 'Shuffle', function () {
    _this.isShuffle = true;
  }, true);

  events.on(_this, 'Shuffle', function () {
    _this.isShuffle = false;
  }, false);
};

EventHooks.prototype.bindPlayerDestroy = function () {
  'use strict';
  var oldPlayerDestroy = window.room.video.destroy;
  window.room.video.destroy = function () {
    events.fire('PlayerDestroy', arguments, true);
    oldPlayerDestroy.apply(window.room.video, arguments);
    events.fire('PlayerDestroy', arguments, false);
  };
};

EventHooks.prototype.bindKeyInput = function () {
  'use strict';
  var csel = '#cin';
  $(csel).bindFirst('keypress', function (event) {
    events.fire('InputKeypress[{0}]'.format(event.keyCode), [event, $(
      csel).val()], false);
    events.fire('InputKeypress', [event, $(csel).val()], false);
    if (event.keyCode === 13 && $(csel).val() !== '') {
      events.fire('SendChat', [$(csel).val()], false);
    }
  });
  $(csel).bindFirst('keydown', function (event) {
    //prevent loosing focus on tab
    if (event.keyCode === 9) {
      event.preventDefault();
    }
    events.fire('InputKeydown[{0}]'.format(event.keyCode), [event,
      $(csel).val()
    ], false);
    events.fire('InputKeydown', [event, $(csel).val()], false);
  });
  $(csel).bindFirst('keyup', function (event) {
    events.fire('InputKeyup[{0}]'.format(event.keyCode), [event, $(csel).val()],
      false);
    events.fire('InputKeyup', [event, $(csel).val()], false);
  });
};

EventHooks.prototype.executeOnceCore = function () {
  'use strict';
  var _this = this;
  _this.bindLinkifySuppress();
  _this.bindUserCount();
  _this.bindHooks();
  _this.bindPageMessages();
  _this.bindShuffle();
};

EventHooks.prototype.preConnect = function () {
  'use strict';
  var _this = this;
  _this.bindPlayerDestroy();
  _this.bindKeyInput();
};

EventHooks.prototype.resetVariables = function () {
  'use strict';
  this.mods = 0;
  this.blacknames = 0;
  this.greynames = 0;
  this.isPlaylistLoaded = false;
};

window.plugins = window.plugins || {};
window.plugins.eventHooks = new EventHooks();
