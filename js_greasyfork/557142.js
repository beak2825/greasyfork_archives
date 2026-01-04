// ==UserScript==
// @name        Restore Roblox website play functionality on Firefox-based browsers
// @namespace   Roblox scripts
// @match       https://www.roblox.com/games/*
// @grant       none
// @version     1.0
// @author      paidlowered
// @description Really hacky but better than nothing. DM me on Telegram if you have a better solution - @paidlowered
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/557142/Restore%20Roblox%20website%20play%20functionality%20on%20Firefox-based%20browsers.user.js
// @updateURL https://update.greasyfork.org/scripts/557142/Restore%20Roblox%20website%20play%20functionality%20on%20Firefox-based%20browsers.meta.js
// ==/UserScript==

// splits url and gets place id
let id = window.location.href.split("/")[4]
//prompts if they want to play
  if (window.confirm("Play?")) {
    // opens about:blank with prompt to launch roblox
    window.open("roblox://placeId=" + id, "\_blank");
  } else {

  }
