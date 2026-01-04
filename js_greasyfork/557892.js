// ==UserScript==
// @name        SFSMPP
// @namespace   Simple window
// @license     MIT
// @match       *://multiplayerpiano.net/*
// @match       *://multiplayerpiano.org/*
// @match       *://dev.multiplayerpiano.net/*
// @match       *://mpp.8448.space/*
// @match       *://mpp.autoplayer.xyz/*
// @match       *://multiplayerpiano.com/*
// @grant       none
// @version     1.0
// @author      french & cheezburger0
// @description A userscript for Multiplayer Piano that shows statistics like NPS, FPS, note quota, and more...
// @downloadURL https://update.greasyfork.org/scripts/557892/SFSMPP.user.js
// @updateURL https://update.greasyfork.org/scripts/557892/SFSMPP.meta.js
// ==/UserScript==

/*
 * cheez: ok i will try
 * what do you want it to look like
 *
 * french: The background is gray, the edges are black, and the text style is cool.
 *
 */

const windowPosition = localStorage.getItem('windowPos')

const start = performance.now();

let debugwindow = {
  FPS: 0,
  NPS: 0,
  NoteQuota: 0,
  color: null,
  color2: null,
  interval: 1000,
  fpsFrameCount: 0,
  lastTime: start,
  lastFpsUpdate: start,
  npsCount: 0
};

function fps() {
  const now = performance.now();
  debugwindow.fpsFrameCount++;

  if (now - debugwindow.lastFpsUpdate >= 1000) {
    debugwindow.FPS = Math.round(
      (debugwindow.fpsFrameCount * 1000) / (now - debugwindow.lastFpsUpdate)
    );
    debugwindow.fpsFrameCount = 0;
    debugwindow.lastFpsUpdate = now;
  }

  requestAnimationFrame(fps);
}

function nq() {
  debugwindow.noteQuota = MPP.noteQuota.points;

  requestAnimationFrame(nq)
}

requestAnimationFrame(nq)
requestAnimationFrame(fps);

function moveElement(element, x, y) {
  element.style.left = x + "px";
  element.style.top = y + "px";
}

function setupDrag(element, draggedElement) {
  let isClicking = false;
  let offsetX = windowPosition.x;
  let offsetY = windowPosition.y;

  element.addEventListener("mousedown", (evt) => {
    console.log("[DEBUG] mouse down on element");
    isClicking = true;

    const rect = draggedElement.getBoundingClientRect();

    offsetX = rect.left - evt.clientX;
    offsetY = rect.top - evt.clientY;
  });

  document.body.addEventListener("mouseup", (evt) => {
    console.log("[DEBUG] mouse up");
    isClicking = false;
  });

  document.body.addEventListener("mousemove", (evt) => {
    if (!isClicking) return; // Так проще (just translate)

    draggedElement.style.left = evt.clientX + offsetX + "px";
    draggedElement.style.top = evt.clientY + offsetY + "px";
    localStorage.setItem('windowPos', {
      x: evt.clientX + offsetX,
      y: evt.clientY + offsetY
    });
  });
}

// ---------- WINDOW ---------- //
const topBarSize = 30;
const borderSize = 3;

const window = document.createElement("div");
window.style.border = borderSize + "px #000 solid";
window.style.backgroundColor = "#444";
window.style.textShadow = "0 0 4px #fff";
window.style.fontSize = "13px";
window.style.position = "absolute";
window.style.width = "300px";
window.style.height = "120px";
window.style.zIndex = 2147483647;

const topBar = document.createElement("div");
topBar.style.position = "absolute";
topBar.style.borderBottom = borderSize + "px #000 solid";
topBar.style.backgroundColor = "#333";
topBar.style.width = "100%";
topBar.style.height = "30px";

const topBarText = document.createElement("span");
topBarText.style.position = "absolute";
topBarText.style.top = "50%";
topBarText.style.left = "8px";
topBarText.style.transform = "translate(0%, -50%)";
topBarText.style.fontSize = "16px";
topBarText.textContent = "SFSMPP ( cheezburger0 & french )";

const content = document.createElement("div");
content.style.position = "absolute";
content.style.width = "100%";
content.style.height = `calc(100% - ${topBarSize}px - ${borderSize}px)`;
content.style.left = 0;
content.style.top = `calc(${topBarSize}px + ${borderSize}px)`
content.style.padding = "8px";
content.style.overflow = "auto";

topBar.appendChild(topBarText);
window.appendChild(topBar);
window.appendChild(content);
document.body.appendChild(window);

const originalVisualize = MPP.piano.renderer.__proto__.visualize;

MPP.piano.renderer.__proto__.visualize = function (noteObj, color, channel) {
  debugwindow.npsCount += 1;
  originalVisualize.call(this, noteObj, color, channel);
};

setupDrag(topBar, window);

const fpsElement = document.createElement("p");
const npsElement = document.createElement("p");
const nqElement = document.createElement("p");
content.append(fpsElement);
content.append(npsElement);
content.append(nqElement);

setInterval(() => {
  fpsElement.textContent = `FPS: ${debugwindow.FPS}`;
  npsElement.textContent = `NPS: ${debugwindow.NPS = debugwindow.npsCount}`;
  debugwindow.npsCount = 0;
  nqElement.textContent = `NoteQuota: ${debugwindow.noteQuota}`;
}, debugwindow.interval);