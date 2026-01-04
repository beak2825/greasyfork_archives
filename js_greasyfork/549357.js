// ==UserScript==
// @name         Shellshock.IO Aimbot & ESP
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Locks aim to the nearest player in shellshock.io. Press B for aimbot, V for ESP.
// @author       Zertalious
// @match        *://shellshock.io/*
// @grant        none
// @licence      testphase
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549357/ShellshockIO%20Aimbot%20%20ESP.user.js
// @updateURL https://update.greasyfork.org/scripts/549357/ShellshockIO%20Aimbot%20%20ESP.meta.js
// ==/UserScript==

const settings = {
  aimbotEnabled: false
};

window.addEventListener('keydown', function(e){
  if(e.code == "KeyB"){
    settings.aimbotEnabled = !settings.aimbotEnabled;
    alert("Aimbot is now " + (settings.aimbotEnabled ? "ON" : "OFF"));
  }
});

function aimAtEnemy(players, myPlayer) {
  if (!settings.aimbotEnabled || !myPlayer) return;
  let nearest = null;
  let minDist = Infinity;
  for (let i = 0; i < players.length; ++i) {
    let p = players[i];
    if (!p || p === myPlayer || !p.playing) continue;
    let dist = Math.hypot(
      p.x - myPlayer.x,
      p.y - myPlayer.y,
      p.z - myPlayer.z
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = p;
    }
  }
  if (nearest) {
    myPlayer.yaw = Math.atan2(nearest.x - myPlayer.x, nearest.z - myPlayer.z);
    myPlayer.pitch = -Math.atan2(nearest.y - myPlayer.y, Math.hypot(nearest.x - myPlayer.x, nearest.z - myPlayer.z));
  }
}

// Hook into the game's render/update loop (this requires deep integration)
// Example only: actual game may obfuscate variables, so results can vary!

setInterval(function(){
  try {
    const allPlayers = window.players;
    const myPlayer = window.myPlayer;
    aimAtEnemy(allPlayers, myPlayer);
  } catch (e) {}
}, 30);

// You could try to simulate reloading by triggering 'R' key:
function autoReload() {
  // This will only reload if you are out of ammo and "settings.aimbotEnabled" is true.
  if (window.myPlayer && window.myPlayer.ammo === 0 && settings.aimbotEnabled) {
    document.dispatchEvent(new KeyboardEvent('keydown', {'code': 'KeyR'}));
  }
}
setInterval(autoReload, 100);

