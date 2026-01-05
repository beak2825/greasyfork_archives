// ==UserScript==
// @name        InstaSynchP TrimWall Command
// @namespace   InstaSynchP
// @description Trim a users wall down to the specified time

// @version     1
// @author      Zod-
// @source      https://github.com/Zod-/InstaSynchP-TrimWall-Command
// @license     MIT

// @include     *://instasync.com/r/*
// @include     *://*.instasync.com/r/*
// @grant       none
// @run-at      document-start

// @require     https://greasyfork.org/scripts/5647-instasynchp-library/code/InstaSynchP%20Library.js?version=37716
// @downloadURL https://update.greasyfork.org/scripts/8180/InstaSynchP%20TrimWall%20Command.user.js
// @updateURL https://update.greasyfork.org/scripts/8180/InstaSynchP%20TrimWall%20Command.meta.js
// ==/UserScript==

function TrimWall(version) {
  "use strict";
  this.version = version;
  this.name = 'InstaSynchP TrimWall Command';
  this.settings = [{
    'label': 'Default trim length (minutes)',
    'id': 'trimwall-length',
    'type': 'int',
    'min': 0,
    'default': 60,
    'size': 8,
    'section': ['Playlist', 'Trimwall']
  }];
  this.commands = {
    "'trimwall": {
      'hasArguments': true,
      'reference': this,
      'description': 'Trim the wall of all or the specified users to a time limit.',
      'callback': this.execute
    }
  };
}

TrimWall.prototype.execute = function (opts) {
  "use strict";
  var th = this,
    map = {},
    maxTimeLimit = opts.numbers[0] || gmc.get('trimwall-length');
    maxTimeLimit *= 60;

    //add all users when no user specified
    if(opts.usernames.length === 0){
      window.room.userlist.users.forEach(function(user){
        opts.usernames.push(user.username);
      });
    }

    //initialize the map
    opts.usernames.forEach(function (user){
      map[user.toLowerCase()] = {
        videos: [],
        time: 0
      };
    });

    //collect videos and durations
    window.room.playlist.videos.forEach(function(video){
      var key = video.addedby.toLowerCase();
      if(!map.hasOwnProperty(key)){
        return;
      }
      map[key].videos.push(video);
      map[key].time += video.duration;
    });

    function cmpVidDur(v1, v2) {
      return v2.duration - v1.duration;
    }

    for(var username in map){
      if(!map.hasOwnProperty(username)){
        continue;
      }
      //sort videos by length
      map[username].videos.sort(cmpVidDur);
      //remove till the video limit is hit
      for(var i = 0; i < map[username].videos.length && map[username].time > maxTimeLimit; i++){
        map[username].time -= map[username].videos[i].duration;
        sendcmd('remove',{
          info: map[username].videos[i].info
        });
      }
    }
};

window.plugins = window.plugins || {};
window.plugins.trimwall = new TrimWall('1');
