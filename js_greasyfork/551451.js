// ==UserScript==
// @name        MP4 Video Playback Speed Input
// @namespace   Violentmonkey Scripts
// @license MIT
// @match       *://*/*.mp4
// @grant       none
// @version     1.0
// @author      Alexander Dobra
// @description Adds an input to change the playback speed of an opened MP4 Video. The URL has to end with '.mp4'.
// @downloadURL https://update.greasyfork.org/scripts/551451/MP4%20Video%20Playback%20Speed%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/551451/MP4%20Video%20Playback%20Speed%20Input.meta.js
// ==/UserScript==

let video = document.querySelector('video');
let input = document.createElement('input');
input.type = 'number';
input.step = '0.25';
input.value = video.playbackRate;
input.style.position = 'fixed';
input.style.top = '10px';
input.style.right = '10px';
input.style.zIndex = 1000;
input.oninput = () => video.playbackRate = parseFloat(input.value);
document.body.appendChild(input);