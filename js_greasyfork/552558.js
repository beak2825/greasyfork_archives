// ==UserScript==
// @name         Global Anti-Debugger
// @namespace    https://github.com/FabioSmuu
// @version      1.0
// @description  Removes and neutralizes any `debugger;` commands before the site runs them
// @author       Fabio Smuu
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552558/Global%20Anti-Debugger.user.js
// @updateURL https://update.greasyfork.org/scripts/552558/Global%20Anti-Debugger.meta.js
// ==/UserScript==

(function() {
  'use strict'

  const originalConstructor = Function.prototype.constructor
  Function.prototype.constructor = function(...args) {
    const code = args.join('')
    const sanitized = code.replace(/\bdebugger\s*;?/gi, '')
    return originalConstructor.call(this, sanitized)
  }

  const originalEval = window.eval
  window.eval = function(code) {
    if (typeof code === 'string') code = code.replace(/\bdebugger\s*;?/gi, '')
    return originalEval(code)
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.tagName === 'SCRIPT' && node.textContent.includes('debugger')) {
          node.textContent = node.textContent.replace(/\bdebugger\s*;?/gi, '')
        }
      })
    })
  })

  observer.observe(document.documentElement, { childList: true, subtree: true })
})()
