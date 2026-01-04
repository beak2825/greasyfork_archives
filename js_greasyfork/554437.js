// ==UserScript==
// @name        AntiAFK
// @namespace   Violentmonkey Scripts
// @match       *://evades.io/*
// @grant       none
// @version     1.0
// @author      Drik
// @description anti afk for evades.io, works better than keypress simulation, minimal
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/554437/AntiAFK.user.js
// @updateURL https://update.greasyfork.org/scripts/554437/AntiAFK.meta.js
// ==/UserScript==
(() => {
  const O = WebSocket
  window.WebSocket = function(...a) {
    const w = new O(...a)
    w.addEventListener('open', () => {
      setInterval(() => {
        if (w.readyState === O.OPEN) w.send(new ArrayBuffer(0))
      }, 30000)
    })
    return w
  }
  window.WebSocket.prototype = O.prototype
})()