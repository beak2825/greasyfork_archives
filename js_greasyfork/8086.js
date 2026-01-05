// ==UserScript==
// @name          TagPro Sniper Bot
// @description   G to snipe
// @version      
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:*
// @include       http://*.newcompte.fr:*
// @license       ****
// @author        *******
// @namespace     ***********************************
// @downloadURL https://update.greasyfork.org/scripts/8086/TagPro%20Sniper%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/8086/TagPro%20Sniper%20Bot.meta.js
// ==/UserScript==
tagpro.ready(function tagBot() {
  if (!tagpro.playerId) return setTimeout(tagBot, 250);
  var snipe = false,
  attack = false,
  sentDir = {
    r: false,
    l: false,
    d: false,
    u: false
  },
  keyDir = {
    r: false,
    l: false,
    d: false,
    u: false
  },
  keyCount = 1,
  tse = tagpro.socket.emit;
  tagpro.socket.emit = function (t, n) {
    if (t === 'keydown') {
      if (n.k === 'right') sentDir.r = true;
      if (n.k === 'left') sentDir.l = true;
      if (n.k === 'down') sentDir.d = true;
      if (n.k === 'up') sentDir.u = true;
    }
    if (t === 'keyup') {
      if (n.k === 'right') sentDir.r = false;
      if (n.k === 'left') sentDir.l = false;
      if (n.k === 'down') sentDir.d = false;
      if (n.k === 'up') sentDir.u = false;
    }
    if (n.t) n.t = keyCount++;
    tse(t, n);
  };
  document.onkeydown = function (d) {
    d = d || window.event;
    switch (d.keyCode) {
      case 18:
        if (!attack) {
          attack = true;
        }
        break;
      case 88:
        if (!snipe) {
          snipe = true;
        }
        break;
      case tagpro.keys.right[0]:
      case tagpro.keys.right[1]:
      case tagpro.keys.right[2]:
        if (!keyDir.r) {
          if (!tagpro.disableControls && !sentDir.r) tagpro.socket.emit('keydown', {
            k: 'right',
            t: keyCount
          });
          keyDir.r = true;
        }
        break;
      case tagpro.keys.left[0]:
      case tagpro.keys.left[1]:
      case tagpro.keys.left[2]:
        if (!keyDir.l) {
          if (!tagpro.disableControls && !sentDir.l) tagpro.socket.emit('keydown', {
            k: 'left',
            t: keyCount
          });
          keyDir.l = true;
        }
        break;
      case tagpro.keys.down[0]:
      case tagpro.keys.down[1]:
      case tagpro.keys.down[2]:
        if (!keyDir.d) {
          if (!tagpro.disableControls && !sentDir.d) tagpro.socket.emit('keydown', {
            k: 'down',
            t: keyCount
          });
          keyDir.d = true;
        }
        break;
      case tagpro.keys.up[0]:
      case tagpro.keys.up[1]:
      case tagpro.keys.up[2]:
        if (!keyDir.u) {
          if (!tagpro.disableControls && !sentDir.u) tagpro.socket.emit('keydown', {
            k: 'up',
            t: keyCount
          });
          keyDir.u = true;
        }
        break;
    }
  };
  document.onkeyup = function (u) {
    u = u || window.event;
    switch (u.keyCode) {
      case 70:
        attack = false;
        if (!keyDir.r && sentDir.r) tagpro.socket.emit('keyup', {
          k: 'right',
          t: keyCount
        });
        if (!keyDir.l && sentDir.l) tagpro.socket.emit('keyup', {
          k: 'left',
          t: keyCount
        });
        if (!keyDir.d && sentDir.d) tagpro.socket.emit('keyup', {
          k: 'down',
          t: keyCount
        });
        if (!keyDir.u && sentDir.u) tagpro.socket.emit('keyup', {
          k: 'up',
          t: keyCount
        });
        if (keyDir.r && !sentDir.r) tagpro.socket.emit('keydown', {
          k: 'right',
          t: keyCount
        });
        if (keyDir.l && !sentDir.l) tagpro.socket.emit('keydown', {
          k: 'left',
          t: keyCount
        });
        if (keyDir.d && !sentDir.d) tagpro.socket.emit('keydown', {
          k: 'down',
          t: keyCount
        });
        if (keyDir.u && !sentDir.u) tagpro.socket.emit('keydown', {
          k: 'up',
          t: keyCount
        });
        break;
      case 71:
        snipe = false;
        attack = false;
        if (!keyDir.r && sentDir.r) tagpro.socket.emit('keyup', {
          k: 'right',
          t: keyCount
        });
        if (!keyDir.l && sentDir.l) tagpro.socket.emit('keyup', {
          k: 'left',
          t: keyCount
        });
        if (!keyDir.d && sentDir.d) tagpro.socket.emit('keyup', {
          k: 'down',
          t: keyCount
        });
        if (!keyDir.u && sentDir.u) tagpro.socket.emit('keyup', {
          k: 'up',
          t: keyCount
        });
        if (keyDir.r && !sentDir.r) tagpro.socket.emit('keydown', {
          k: 'right',
          t: keyCount
        });
        if (keyDir.l && !sentDir.l) tagpro.socket.emit('keydown', {
          k: 'left',
          t: keyCount
        });
        if (keyDir.d && !sentDir.d) tagpro.socket.emit('keydown', {
          k: 'down',
          t: keyCount
        });
        if (keyDir.u && !sentDir.u) tagpro.socket.emit('keydown', {
          k: 'up',
          t: keyCount
        });
        break;
      case tagpro.keys.right[0]:
      case tagpro.keys.right[1]:
      case tagpro.keys.right[2]:
        if (!tagpro.disableControls && sentDir.r) tagpro.socket.emit('keyup', {
          k: 'right',
          t: keyCount
        });
        keyDir.r = false;
        break;
      case tagpro.keys.left[0]:
      case tagpro.keys.left[1]:
      case tagpro.keys.left[2]:
        if (!tagpro.disableControls && sentDir.l) tagpro.socket.emit('keyup', {
          k: 'left',
          t: keyCount
        });
        keyDir.l = false;
        break;
      case tagpro.keys.down[0]:
      case tagpro.keys.down[1]:
      case tagpro.keys.down[2]:
        if (!tagpro.disableControls && sentDir.d) tagpro.socket.emit('keyup', {
          k: 'down',
          t: keyCount
        });
        keyDir.d = false;
        break;
      case tagpro.keys.up[0]:
      case tagpro.keys.up[1]:
      case tagpro.keys.up[2]:
        if (!tagpro.disableControls && sentDir.u) tagpro.socket.emit('keyup', {
          k: 'up',
          t: keyCount
        });
        keyDir.u = false;
        break;
    }
  };
  Object.observe(tagpro.players, function (changes) {
    changes.forEach(function (change) {
      if (change.type === 'add') watchPlayers();
    });
  });
  function watchPlayers() {
    for (var id in tagpro.players) {
      if (!tagpro.players.hasOwnProperty(id)) break;
      var player = tagpro.players[id];
      if (player.watched === undefined) {
        player.sx = 0;
        player.sy = 0;
        player.pr = 0;
        player.pl = 0;
        player.pd = 0;
        player.pu = 0;
        Object.observe(player, function (changes) {
          changes.forEach(function (change) {
            if (change.name === 'x') getSpeed(changes[0].object, change.oldValue);
            if (change.name === 'y') getSpeed(changes[0].object, undefined, change.oldValue);
            if (changes[0].object.id !== tagpro.playerId) {
              switch (change.name) {
                case 'right':
                case 'left':
                case 'down':
                case 'up':
                  getKeys(changes[0].object);
                  break;
              }
            }
          });
        });
        player.watched = true;
      }
    }
  }
  watchPlayers();
  function getSpeed(player, x, y) {
    if (x) {
      player.sx = player.lx > 0 ? Math.abs(player.x - x) * 34 : - Math.abs(player.x - x) * 34;
      if (!player.lx) player.sx = 0;
    }
    if (y) {
      player.sy = player.ly > 0 ? Math.abs(player.y - y) * 34 : - Math.abs(player.y - y) * 34;
      if (!player.ly) player.sy = 0;
    }
  }
  function getKeys(player) {
    if (player.right && !player.left) player.pr = 1;
     else player.pr = 0;
    if (player.left && !player.right) player.pl = - 1;
     else player.pl = 0;
    if (player.down && !player.up) player.pd = 1;
     else player.pd = 0;
    if (player.up && !player.down) player.pu = - 1;
     else player.pu = 0;
  }
  function attackEnemy() {
    var distance,
    target
    closest = 9999,
    seek = {
      x: 0,
      y: 0
    },
    self = tagpro.players[tagpro.playerId];
    for (var id in tagpro.players) {
      if (tagpro.players.hasOwnProperty(id)) {
        var player = tagpro.players[id];
        if (player.team !== self.team && player.draw && !player.dead) {
          distance = Math.sqrt(Math.pow(player.x + player.lx * 30 - self.x + self.lx * 30, 2) + Math.pow(player.y + player.ly * 30 - self.y + self.ly * 30, 2));
          if (attack) {
            if (player.flag && distance < 400) {
              target = player;
              break;
            } else {
              if (distance < closest) {
                closest = distance;
                target = player;
              }
            }
          }
          if (snipe) {
            if (player.flag) {
              target = player;
              break;
            } else {
              if (distance < closest) {
                closest = distance;
                target = player;
              }
            }
          }
        }
      }
    }
    if (target) {
      var difX = Math.abs((self.x + self.sx) - (target.x + target.sx)),
      difY = Math.abs((self.y + self.sy) - (target.y + target.sy)),
      speedDifX = self.sx - target.sx,
      speedDifY = self.sy - target.sy,
      pressR = target.pr ? Math.min((target.pr * 20 - speedDifX * 0.07) * difY / 40, 160)  : 0,
      pressL = target.pl ? Math.max((target.pl * 20 - speedDifX * 0.07) * difY / 40, - 160)  : 0,
      pressD = target.pd ? Math.min((target.pd * 20 - speedDifY * 0.07) * difX / 40, 160)  : 0,
      pressU = target.pu ? Math.max((target.pu * 20 - speedDifY * 0.07) * difX / 40, - 160)  : 0,
      pR = target.pr ? target.pr * (1 + difY / 25)  : 0,
      pL = target.pl ? target.pl * (1 + difY / 25)  : 0,
      pD = target.pd ? target.pd * (1 + difX / 25)  : 0,
      pU = target.pu ? target.pu * (1 + difX / 25)  : 0;
      if (attack) {
        seek.x = (target.x + target.sx * ((difX / 40 + 5) / 6) + pressR + pressL - speedDifX * difY / 400) - (self.x + self.sx * ((difX / 40 + 5) / 6));
        seek.y = (target.y + target.sy * ((difY / 40 + 5) / 6) + pressD + pressU - speedDifY * difX / 400) - (self.y + self.sy * ((difY / 40 + 5) / 6));
        if (seek.x > 6 && !sentDir.r) tagpro.socket.emit('keydown', {
          k: 'right',
          t: keyCount
        });
         else {
          if (seek.x < 3 && sentDir.r) tagpro.socket.emit('keyup', {
            k: 'right',
            t: keyCount
          });
        }
        if (seek.x < - 6 && !sentDir.l) tagpro.socket.emit('keydown', {
          k: 'left',
          t: keyCount
        });
         else {
          if (seek.x > - 3 && sentDir.l) tagpro.socket.emit('keyup', {
            k: 'left',
            t: keyCount
          });
        }
        if (seek.y > 6 && !sentDir.d) tagpro.socket.emit('keydown', {
          k: 'down',
          t: keyCount
        });
         else {
          if (seek.y < 3 && sentDir.d) tagpro.socket.emit('keyup', {
            k: 'down',
            t: keyCount
          });
        }
        if (seek.y < - 6 && !sentDir.u) tagpro.socket.emit('keydown', {
          k: 'up',
          t: keyCount
        });
         else {
          if (seek.y > - 3 && sentDir.u) tagpro.socket.emit('keyup', {
            k: 'up',
            t: keyCount
          });
        }
      }
      if (snipe && !attack) {
        if (Math.abs(self.sx) < 142 || Math.abs(self.sy) < 142) {
          seek.x = (target.x + target.sx * (0.5 + difY / 380) + pR + pL) - (self.x + self.sx * (1 + difY / 40));
          seek.y = (target.y + target.sy * (0.5 + difX / 380) + pD + pU) - (self.y + self.sy * (1 + difX / 40));
          var timerLength = 140,
          timer = Date.now() % timerLength,
          timeX = Math.abs(seek.x / seek.y) * timerLength,
          timeY = Math.abs(seek.y / seek.x) * timerLength;
          if (seek.x > Math.abs(seek.y)) {
            if (sentDir.l) tagpro.socket.emit('keyup', {
              k: 'left',
              t: keyCount
            });
            if (!sentDir.r) tagpro.socket.emit('keydown', {
              k: 'right',
              t: keyCount
            });
            if (timer < timeY && seek.y > 0) {
              if (!sentDir.d) tagpro.socket.emit('keydown', {
                k: 'down',
                t: keyCount
              });
            } 
            else {
              if (sentDir.d) tagpro.socket.emit('keyup', {
                k: 'down',
                t: keyCount
              });
            }
            if (timer < timeY && seek.y < 0) {
              if (!sentDir.u) tagpro.socket.emit('keydown', {
                k: 'up',
                t: keyCount
              });
            } 
            else {
              if (sentDir.u) tagpro.socket.emit('keyup', {
                k: 'up',
                t: keyCount
              });
            }
          }
          if (seek.x < - Math.abs(seek.y)) {
            if (sentDir.r) tagpro.socket.emit('keyup', {
              k: 'right',
              t: keyCount
            });
            if (!sentDir.l) tagpro.socket.emit('keydown', {
              k: 'left',
              t: keyCount
            });
            if (timer < timeY && seek.y > 0) {
              if (!sentDir.d) tagpro.socket.emit('keydown', {
                k: 'down',
                t: keyCount
              });
            } 
            else {
              if (sentDir.d) tagpro.socket.emit('keyup', {
                k: 'down',
                t: keyCount
              });
            }
            if (timer < timeY && seek.y < 0) {
              if (!sentDir.u) tagpro.socket.emit('keydown', {
                k: 'up',
                t: keyCount
              });
            } 
            else {
              if (sentDir.u) tagpro.socket.emit('keyup', {
                k: 'up',
                t: keyCount
              });
            }
          }
          if (seek.y > Math.abs(seek.x)) {
            if (sentDir.u) tagpro.socket.emit('keyup', {
              k: 'up',
              t: keyCount
            });
            if (!sentDir.d) tagpro.socket.emit('keydown', {
              k: 'down',
              t: keyCount
            });
            if (timer < timeX && seek.x > 0) {
              if (!sentDir.r) tagpro.socket.emit('keydown', {
                k: 'right',
                t: keyCount
              });
            } 
            else {
              if (sentDir.r) tagpro.socket.emit('keyup', {
                k: 'right',
                t: keyCount
              });
            }
            if (timer < timeX && seek.x < 0) {
              if (!sentDir.l) tagpro.socket.emit('keydown', {
                k: 'left',
                t: keyCount
              });
            } 
            else {
              if (sentDir.l) tagpro.socket.emit('keyup', {
                k: 'left',
                t: keyCount
              });
            }
          }
          if (seek.y < - Math.abs(seek.x)) {
            if (sentDir.d) tagpro.socket.emit('keyup', {
              k: 'down',
              t: keyCount
            });
            if (!sentDir.u) tagpro.socket.emit('keydown', {
              k: 'up',
              t: keyCount
            });
            if (timer < timeX && seek.x > 0) {
              if (!sentDir.r) tagpro.socket.emit('keydown', {
                k: 'right',
                t: keyCount
              });
            } 
            else {
              if (sentDir.r) tagpro.socket.emit('keyup', {
                k: 'right',
                t: keyCount
              });
            }
            if (timer < timeX && seek.x < 0) {
              if (!sentDir.l) tagpro.socket.emit('keydown', {
                k: 'left',
                t: keyCount
              });
            } 
            else {
              if (sentDir.l) tagpro.socket.emit('keyup', {
                k: 'left',
                t: keyCount
              });
            }
          }
        } else {
          if (!keyDir.r && sentDir.r) tagpro.socket.emit('keyup', {
            k: 'right',
            t: keyCount
          });
          if (!keyDir.l && sentDir.l) tagpro.socket.emit('keyup', {
            k: 'left',
            t: keyCount
          });
          if (!keyDir.d && sentDir.d) tagpro.socket.emit('keyup', {
            k: 'down',
            t: keyCount
          });
          if (!keyDir.u && sentDir.u) tagpro.socket.emit('keyup', {
            k: 'up',
            t: keyCount
          });
          if (keyDir.r && !sentDir.r) tagpro.socket.emit('keydown', {
            k: 'right',
            t: keyCount
          });
          if (keyDir.l && !sentDir.l) tagpro.socket.emit('keydown', {
            k: 'left',
            t: keyCount
          });
          if (keyDir.d && !sentDir.d) tagpro.socket.emit('keydown', {
            k: 'down',
            t: keyCount
          });
          if (keyDir.u && !sentDir.u) tagpro.socket.emit('keydown', {
            k: 'up',
            t: keyCount
          });
          attack = true;
        }
      }
    }
    setTimeout(attackEnemy, 11);
  }
  attackEnemy();
});
