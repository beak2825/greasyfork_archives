// ==UserScript==
// @name        Restores scroll position
// @description Firefox is a dumbfuck - when I use "servor" with "--reload" and update files, 
//              FF does not restore scroll position (while Chrome restores). 
//              See this issue https://github.com/lukejacksonn/servor/issues/71
//              This script is meant to fix that.
//              12/21/2021, 8:25:46 PM
// @namespace   Violentmonkey Scripts
// @match       http://localhost:*/*
// @grant       none
// @version     3.1
// @author      -
// @grant       GM.getValue
// @grant       GM.setValue
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/548357/Restores%20scroll%20position.user.js
// @updateURL https://update.greasyfork.org/scripts/548357/Restores%20scroll%20position.meta.js
// ==/UserScript==

let isSaving = false;
let ignoreScrollEvent = false;
const disableIsSaving = () => isSaving = false;
const getScrollStorageKey = () => {
  const { host, pathname, search } = window.location
  return `scroll__${host+pathname+search}`
}

function saveScroll() {
  const { scrollX, scrollY } = window
  // console.log('scroll saved', { scrollX, scrollY })
  GM.setValue(getScrollStorageKey(), { scrollX, scrollY }).then(disableIsSaving)
}


function restoreScroll() {
  return GM.getValue(getScrollStorageKey(), null).then(
    data => {
      if (data !== null) {
        window.scrollTo({ left: data.scrollX, top: data.scrollY, behavior: 'instant'})
        // console.log('scroll restored', data.scrollX, data.scrollY)
        // wait a little before resetting `ingore scroll` flag
        setTimeout(_ => ignoreScrollEvent = false, 33)
      }
    }
  )
}

document.addEventListener('scroll', e => {
  // console.log('scroll', window.scrollY)
  if (ignoreScrollEvent)
    return
  if (!isSaving) {
    isSaving = true
    window.requestAnimationFrame(saveScroll)
  }
})

function restoreScrollWrap() {
  // since requestAnimationFrame() runs PRIOR next repain
  // lets try to delay it for a "next next" repaint
  // to be sure all css updates are finished
  setTimeout(restoreScroll, 100)
}

// catching css refresh request from `live-server`
const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
const address = protocol + window.location.host + window.location.pathname + '/ws';
const socket = new WebSocket(address);
socket.onmessage = msg => {
  if (msg.data !== 'refreshcss')
    return

  // console.log('refreshing CSS')
  ignoreScrollEvent = true

  window.requestAnimationFrame(restoreScrollWrap)
}

// delay the first restoration of scroll position
// to let the browser render the page
if (document.readyState === 'complete')
  window.requestAnimationFrame(restoreScrollWrap)
else
  window.onload = () => window.requestAnimationFrame(restoreScrollWrap)







