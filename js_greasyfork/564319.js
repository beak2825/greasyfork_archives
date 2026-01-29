// ==UserScript==
// @name         chess.com metal pipe falling sound
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Replaces castling, capturing and moving sounds with the metal pipe falling sound effect on chess.com
// @author       KakkaBartFjart6
// @match        https://www.chess.com/*
// @icon         https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.0GdqKY0kO9hVIdQN4YRWrgHaHa%3Fpid%3DApi&f=1&ipt=43124b73f3899c94dd5972a8901e8b01aac5b6475e503c078512d6afba588c1b&ipo=images
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564319/chesscom%20metal%20pipe%20falling%20sound.user.js
// @updateURL https://update.greasyfork.org/scripts/564319/chesscom%20metal%20pipe%20falling%20sound.meta.js
// ==/UserScript==

const styleElement = document.createElement("style");
const CSS = `
:root {
  --theme-sound-set-mp3-castle: url('https://www.myinstants.com/media/sounds/metal-pipe-falling-sound-effect.mp3');
  --theme-sound-set-ogg-castle: url('');
  --theme-sound-set-webm-castle: url('');
  --theme-sound-set-wav-castle: url('');

  --theme-sound-set-mp3-capture: url('https://www.myinstants.com/media/sounds/metal-pipe-falling-sound-effect.mp3');
  --theme-sound-set-ogg-capture: url('');
  --theme-sound-set-webm-capture: url('');
  --theme-sound-set-wav-capture: url('');

  --theme-sound-set-mp3-move-self: url('https://www.myinstants.com/media/sounds/metal-pipe-falling-sound-effect.mp3');
  --theme-sound-set-ogg-move-self: url('');
  --theme-sound-set-webm-move-self: url('');
  --theme-sound-set-wav-move-self: url('');
}
`

styleElement.appendChild(document.createTextNode(CSS));
document.head.appendChild(styleElement);