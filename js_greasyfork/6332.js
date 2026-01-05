// ==UserScript==
// @name        InstaSynchP Commands
// @namespace   InstaSynchP
// @description Plugin for custom commands

// @version     1.0.3
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-Commands
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js?version=49210
// @downloadURL https://update.greasyfork.org/scripts/6332/InstaSynchP%20Commands.user.js
// @updateURL https://update.greasyfork.org/scripts/6332/InstaSynchP%20Commands.meta.js
// ==/UserScript==

function Commands(version) {
  "use strict";
  this.version = version;
  this.name = "InstaSynchP Commands";
  this.commandMap = {};
  this.sendcmdReady = true;
  this.commandQueue = [];
}

Commands.prototype.executeOnceCore = function () {
  "use strict";
  var th = this;
  window.commands = {
    //add a command
    bind: function (commands) {
      if (typeof commands === 'undefined') {
        return;
      }

      for (var command in commands) {
        if (commands.hasOwnProperty(command)) {
          commands[command].name = command;
          th.commandMap[command.toLowerCase()] = commands[command];
        }
      }
    },
    //get the commands
    get: function (key) {
      return th.commandMap[key.toLowerCase()];
    },
    //get all commands
    getAll: function () {
      return th.commandMap;
    },
    //execute a command
    execute: function () {
      if (th.commandMap.hasOwnProperty(arguments[0].toLowerCase())) {
        //send the event to the site
        window.postMessage(JSON.stringify({
          action: 'ExecuteCommand',
          data: {
            //turn arguments to array
            'arguments': [].slice.call(arguments)
          }
        }), "*");
      }
    }
  };

  /*{
      "'command": {
          'hasArguments':true,
          'type':'mod',
          'reference': this
          'description':'description',
          'callback': function(){
          }
      }
  }*/

  var defaultCommands = {
    "'resynch": {},
    "'toggleFilter": {},
    "'toggleAutosynch": {},
    "'togglePlaylistLock": {
      'type': 'mod'
    },
    "'kick": {
      'hasArguments': true,
      'type': 'mod'
    },
    "'ban": {
      'hasArguments': true,
      'type': 'mod'
    },
    "'unban": {
      'hasArguments': true,
      'type': 'mod'
    },
    "'clean": {
      'type': 'mod'
    },
    "'remove": {
      'hasArguments': true,
      'type': 'mod'
    },
    "'purge": {
      'hasArguments': true,
      'type': 'mod'
    },
    "'move": {
      'hasArguments': true,
      'type': 'mod'
    },
    "'play": {
      'hasArguments': true,
      'type': 'mod'
    },
    "'shuffle": {
      'hasArguments': true,
      'type': 'mod',
      'callback': function (){
        sendcmd('shuffle');
      }
    },
    "'pause": {
      'type': 'mod'
    },
    "'resume": {
      'type': 'mod'
    },
    "'seekto": {
      'hasArguments': true,
      'type': 'mod'
    },
    "'seekfrom": {
      'hasArguments': true,
      'type': 'mod'
    },
    "'setskip": {
      'hasArguments': true,
      'type': 'mod'
    },
    "'banlist": {
      'type': 'mod'
    },
    "'modlist": {
      'type': 'mod'
    },
    "'leaverban": {
      'hasArguments': true,
      'type': 'mod'
    },
    //commented those so you can't accidently use them
    //"'clearbans",
    //"'motd ",
    //"'mod ",
    //"'demod ",
    //"'description ",
    "'next": {
      'type': 'mod'
    }
  };

  function empty() {
      return undefined;
    }
    //prepare default commands
  for (var command in defaultCommands) {
    if (defaultCommands.hasOwnProperty(command)) {
      defaultCommands[command].description = 'http://instasynch.com/help.php#commands';
      defaultCommands[command].callback = defaultCommands[command].callback || empty;

      if (!defaultCommands[command].type) {
        defaultCommands[command].type = 'regular';
      }
    }
  }
  //bind them
  commands.bind(defaultCommands);

  //commands gets executed by posting a message to the site and catching it
  //in the script scope
  events.on(th, 'ExecuteCommand', function (data) {
    var command = th.commandMap[data.arguments[0].toLowerCase()],
      opts = {
        usernames: [],
        videos: [],
        numbers: []
      },
      i,
      videoInfo;
    for (i = 1; i < data.arguments.length; i += 1) {
      videoInfo = urlParser.parse(data.arguments[i]);
      if (videoInfo) {
        opts.videos.push(videoInfo);
      }
      if (isBlackname(data.arguments[i])) {
        opts.usernames.push(data.arguments[i]);
      }
      if (data.arguments[i] !== '' && !isNaN(data.arguments[i])) {
        opts.numbers.push(Number(data.arguments[i]));
      }
    }
    data.arguments.splice(0, 1, opts);
    logger().debug(th.name, "Calling command", JSON.stringify(data.arguments));
    command.callback.apply(command.reference, data.arguments);
  });
  events.on(th, 'SendChat', function (message) {
    commands.execute.apply(commands, message.split(/\s/));
  });

  //flood protect
  var oldsendcmd = window.room.sendcmd;
  window.room.sendcmd = function (command, data) {
    var i;
    if (command) {
      //add the command to the cache
      th.commandQueue.push({
        command: command,
        data: data
      });
    }

    //early return if we can't send anything
    if (!th.sendcmdReady || th.commandQueue.length === 0) {
      return;
    }

    //set not ready
    th.sendcmdReady = false;
    oldsendcmd(th.commandQueue[0].command, th.commandQueue[0].data);
    th.commandQueue.splice(0, 1);
    //after a second send the next ones
    setTimeout(function () {
      th.sendcmdReady = true;
      window.room.sendcmd();
    }, 275);
  };
};

window.plugins = window.plugins || {};
window.plugins.commands = new Commands('1.0.3');
