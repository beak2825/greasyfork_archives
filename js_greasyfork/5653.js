// ==UserScript==
// @name         InstaSynchP Core
// @namespace    InstaSynchP
// @description  The core for a modular plugin system for InstaSync
// @version      1.4.9
// @author       Zod-
// @source       https://github.com/Zod-/InstaSynchP-Core
// @license      MIT
// @require      https://greasyfork.org/scripts/2859-video-url-parser/code/code.js?version=30624
// @require      https://greasyfork.org/scripts/2857-jquery-bind-first/code/code.js?version=26080
// @require      https://greasyfork.org/scripts/8159-log4javascript/code/code.js?version=37575
// @require      https://greasyfork.org/scripts/5647-instasynchp-library/code/code.js?version=51269
// @require      https://greasyfork.org/scripts/8177-instasynchp-logger/code/code.js?version=51298
// @require      https://greasyfork.org/scripts/5718-instasynchp-cssloader/code/code.js?version=43457
// @require      https://greasyfork.org/scripts/5719-instasynchp-settings/code/code.js?version=51309
// @require      https://greasyfork.org/scripts/6332-instasynchp-commands/code/code.js?version=49212
// @require      https://greasyfork.org/scripts/5651-instasynchp-event-hooks/code/code.js?version=52057
// @include      *://instasync.com/r/*
// @include      *://*.instasync.com/r/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/5653/InstaSynchP%20Core.user.js
// @updateURL https://update.greasyfork.org/scripts/5653/InstaSynchP%20Core.meta.js
// ==/UserScript==

function Events() {
  'use strict';
  this.listeners = {};
}

Events.prototype.createListener = function (name) {
  'use strict';
  this.listeners[name] = {
    'preOld': [],
    'postOld': []
  };
};

Events.prototype.createListenerIfNotExists = function (name) {
  'use strict';
  var _this = this;
  if (isUdef(_this.listeners[name])) {
    _this.createListener(name);
  }
};

Events.prototype.log = function (opts) {
  'use strict';
  var args = [];
  opts.type = opts.type || 'debug';
  args.push('Events');
  args.push(opts.event);
  if (opts.eventName || opts.eventNames) {
    args.push(opts.eventName || opts.eventNames);
  }
  if (opts.callback) {
    args.push(opts.callback.name);
  }
  if (!isUdef(opts.preOld)) {
    args.push('preOld');
    args.push(opts.preOld);
  }
  if (opts.ref) {
    args.push(opts.ref.name);
  }
  if (opts.parameters) {
    try {
      args.push(JSON.stringify(opts.parameters));
    } catch (ignore) {
      args.push(opts.parameters);
    }
  }
  if (opts.err) {
    args.push(opts.err.message);
    args.push(opts.err.stack);
    args.push(opts.err);
  }
  logger()[opts.type].apply(logger(), args);
};

Events.prototype.pushListener = function (ref, eventName, callback, preOld) {
  'use strict';
  var _this = this;
  var prepost = preOld ? 'preOld' : 'postOld';
  _this.createListenerIfNotExists(eventName);
  _this.listeners[eventName][prepost].push({
    ref: ref,
    callback: callback
  });
};


Events.prototype.on = function (ref, eventNames, callback, preOld) {
  'use strict';
  if (isUdef(callback)) {
    return;
  }
  var _this = this;
  preOld = preOld || false;
  _this.log({
    event: 'on',
    callback: callback,
    ref: ref,
    eventNames: eventNames,
    preOld: preOld
  });

  eventNames.split(/\s*,\s*/).forEach(function (eventName) {
    eventName = eventName.trim();
    _this.pushListener(ref, eventName, callback, preOld);
  });
};

Events.prototype.once = function (ref, eventNames, callback, preOld) {
  'use strict';
  this.unbind(eventNames, callback);
  this.on(ref, eventNames, callback, preOld);
};

Events.prototype.removeListener = function (eventName, callback, prepost) {
  'use strict';
  var _this = this;
  if (isUdef(_this.listeners[eventName])) {
    return;
  }
  var listeners = _this.listeners[eventName][prepost];
  for (var i = 0; i < listeners.length; i++) {
    if (listeners[i].callback === callback) {
      listeners.splice(i, 1);
      i -= 1;
    }
  }
};

Events.prototype.removePreOldListener = function (eventName, callback) {
  'use strict';
  this.removeListener(eventName, callback, 'preOld');
};

Events.prototype.removePostOldListener = function (eventName, callback) {
  'use strict';
  this.removeListener(eventName, callback, 'postOld');
};

Events.prototype.unbind = function (eventNames, callback) {
  'use strict';
  var _this = this;
  if (isUdef(callback)) {
    return;
  }

  _this.log({
    event: 'unbind',
    callback: callback,
    eventNames: eventNames
  });

  eventNames.split(/\s*,\s*/).forEach(function (eventName) {
    _this.removePreOldListener(eventName, callback);
    _this.removePostOldListener(eventName, callback);
  });
};

Events.prototype.copyPreOldListeners = function (eventName) {
  'use strict';
  return [].concat(this.listeners[eventName].preOld);
};

Events.prototype.copyPostOldListeners = function (eventName) {
  'use strict';
  return [].concat(this.listeners[eventName].postOld);
};

Events.prototype.copyListeners = function (eventName, preOldFlag) {
  'use strict';
  if (preOldFlag) {
    return this.copyPreOldListeners(eventName);
  } else {
    return this.copyPostOldListeners(eventName);
  }
};

Events.prototype.fire = function (eventName, parameters, preOld) {
  'use strict';
  var _this = this;
  preOld = preOld || false;

  //Don't record every single keystroke
  //and PageMessages from youtube and others
  if (eventName !== 'PageMessage' && !eventName.startsWith('Input')) {
    _this.log({
      event: 'fire',
      eventName: eventName,
      preOld: preOld,
      parameters: parameters
    });
  }

  if (isUdef(_this.listeners[eventName])) {
    return;
  }

  //make a copy of the listeners since some handlers
  //could remove listeners, changing the array while iterating over it
  _this.copyListeners(eventName, preOld).forEach(function (listener) {
    try {
      listener.callback.apply(listener.ref, parameters);
    } catch (err) {
      _this.log({
        callback: listener.callback,
        ref: listener.ref,
        eventName: eventName,
        type: 'error',
        event: 'fire',
        err: err
      });
    }
  });
};

function Core() {
  'use strict';
  this.version = '1.4.9';
  this.name = 'InstaSynchP Core';
  this.connected = false;
  this.Events = Events;
  this.styles = [{
    name: 'core',
    url: 'https://cdn.rawgit.com/Zod-/InstaSynchP-Core/1eabab1beefc635d7a59e5bad3176de063da3331/dist/core.css',
    autoload: true
  }];
  this.isMainLoaded = false;
}

Core.prototype.executeOnceCore = function () {
  'use strict';
  window.events = new this.Events();
};

Core.prototype.resetVariables = function () {
  'use strict';
  this.connected = false;
  window.room.user.userinfo = undefined;
};

Core.prototype.prepareFramework = function () {
  'use strict';
  var _this = this;
  _this.executeOnceCore();
  plugins.logger.executeOnceCore();
  _this.log({
    event: 'Prepare Framework'
  });
  plugins.commands.executeOnceCore();
  plugins.settings.executeOnceCore();
};

Core.prototype.finishUpFramework = function () {
  'use strict';
  var _this = this;
  _this.log({
    event: 'Finish up Framework'
  });
  events.on(plugins.eventHooks, 'ExecuteOnce',
    plugins.eventHooks.executeOnceCore);
  events.on(_this, 'LoadUserlist', _this.onConnect);
};

Core.prototype.log = function (opts) {
  'use strict';
  var args = [];
  opts.type = opts.type || 'debug';
  args.push(this.name);
  args.push(opts.event);
  if (opts.plugin) {
    args.push(opts.plugin.name);
    args.push(opts.plugin.version);
  }
  logger()[opts.type].apply(logger(), args);
};

Core.prototype.preparePlugin = function (plugin) {
  'use strict';
  var _this = this;
  if (!plugin.enabled) {
    _this.log({
      event: 'Skipping disabled plugin',
      type: 'info',
      plugin: plugin
    });
    return;
  }

  _this.log({
    event: 'Found plugin',
    type: 'info',
    plugin: plugin
  });

  events.on(plugin, 'PreConnect', plugin.preConnect);
  events.on(plugin, 'PostConnect', plugin.postConnect);
  events.on(plugin, 'ExecuteOnce', plugin.executeOnce);
  events.on(plugin, 'ResetVariables', plugin.resetVariables);

  commands.bind(plugin.commands);
};

Core.prototype.preparePlugins = function () {
  'use strict';
  var _this = this;
  _this.log({
    event: 'Prepare plugins'
  });
  for (var pluginName in plugins) {
    if (plugins.hasOwnProperty(pluginName)) {
      _this.preparePlugin(plugins[pluginName]);
    }
  }
};

Core.prototype.slowLoadingCompensate = function () {
  'use strict';
  this.connected = true;
  events.fire('Connected');
  events.fire('Joining');
  events.fire('Joined');
  window.room.playlist.load(window.room.playlist.videos);
  window.room.userlist.load(window.room.userlist.users);
  reloadPlayer();
};

Core.prototype.fireConnect = function () {
  'use strict';
  var _this = this;
  events.fire('PreConnect');
  if (thisUser()) {
    _this.log({
      event: 'Script was loading slowly'
    });
    _this.slowLoadingCompensate();
  }
};

Core.prototype.fireExecuteOnce = function () {
  'use strict';
  this.isMainLoaded = true;
  events.fire('ExecuteOnce');
};

Core.prototype.onConnect = function () {
  'use strict';
  this.connected = true;
  events.fire('PostConnect');
};

Core.prototype.executeOnce = function () {
  'use strict';
  logger().info(this.name, navigator.userAgent);
};

Core.prototype.start = function () {
  'use strict';
  var _this = this;
  _this.log({
    event: 'Start'
  });
  _this.fireExecuteOnce();
  _this.fireConnect();
  events.on(_this, 'PreConnect, Disconnect', function fireResetVariables() {
    events.fire('ResetVariables');
  });
};

Core.prototype.main = function () {
  'use strict';
  var _this = this;

  _this.prepareFramework();
  _this.preparePlugins();
  _this.finishUpFramework();

  _this.start();
};

window.plugins = window.plugins || {};
window.plugins.core = new Core();
if (window.document.readyState === 'complete') {
  window.plugins.core.main();
  window.plugins.core.log({
    event: 'Page was already loaded'
  });
} else {
  window.addEventListener('load', function () {
    'use strict';
    if (!window.plugins.core.isMainLoaded) {
      window.plugins.core.main();
    }
    window.plugins.core.log({
      event: 'Page load'
    });
  }, false);
}
