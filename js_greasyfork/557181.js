// ==UserScript==
// @name         Prevent Google AI Overview From Showing Up At All
// @namespace    http://tampermonkey.net/
// @version      2025-11-28
// @description  Smart enough to automatically adapt as Google changes its traits.
// @author       You
// @match        https://www.google.com/search?q=*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557181/Prevent%20Google%20AI%20Overview%20From%20Showing%20Up%20At%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/557181/Prevent%20Google%20AI%20Overview%20From%20Showing%20Up%20At%20All.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  function isEvilDiv(div) {
    const hasSvg = div.querySelector('svg') !== null
    const hasAiDiv = Array.from(div.querySelectorAll('div')).some((d) =>
      d.textContent.toLowerCase().includes('ai overview')
    )
    const hasExplicitFlexGrow = div.style.flexGrow !== ''
    return hasSvg && hasAiDiv && hasExplicitFlexGrow
  }

  function isEvilDivContainer(div) {
    const style = div.style
    const hasMax = style.maxHeight !== ''
    const hasMin = style.minHeight !== ''
    return hasMax && hasMin
  }

  const CLEANING_ATTR = 'ai-cleaning'
  let cleaningFinished = false
  let cleaningTimeoutId = null
  let styleEl = null
  let observer = null

  function startCleaningOverlay() {
    document.documentElement.setAttribute(CLEANING_ATTR, 'on')
    styleEl = document.createElement('style')
    styleEl.textContent = `
        html[${CLEANING_ATTR}="on"] body {
          visibility: hidden !important;
        }
      `
    document.documentElement.appendChild(styleEl)
    cleaningTimeoutId = setTimeout(() => {
      finishCleaning()
    }, 1500)
  }

  function finishCleaning() {
    if (cleaningFinished) return
    cleaningFinished = true

    document.documentElement.removeAttribute(CLEANING_ATTR)
    if (styleEl && styleEl.parentNode) {
      styleEl.parentNode.removeChild(styleEl)
    }
    if (observer) {
      observer.disconnect()
    }
    if (cleaningTimeoutId) {
      clearTimeout(cleaningTimeoutId)
      cleaningTimeoutId = null
    }
  }

  function tryKillFrom(root) {
    if (!root || root.nodeType !== Node.ELEMENT_NODE) return false

    const toCheck = []

    if (root.tagName === 'DIV') {
      toCheck.push(root)
    }
    toCheck.push(...root.querySelectorAll('div'))

    for (const node of toCheck) {
      if (!isEvilDiv(node)) continue

      let evilContainer = node.parentElement
      while (evilContainer) {
        if (isEvilDivContainer(evilContainer)) {
          break
        }
        evilContainer = evilContainer.parentElement
      }

      if (!evilContainer) {
        continue
      }

      const rect = evilContainer.getBoundingClientRect()
      const fitsWindow = rect.width < window.innerWidth && rect.height < window.innerHeight

      if (!fitsWindow) {
        continue
      }
      evilContainer.remove()
      return true
    }

    return false
  }

  startCleaningOverlay()

  observer = new MutationObserver((mutations) => {
    if (cleaningFinished) return

    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (tryKillFrom(node)) {
          finishCleaning()
          return
        }
      }
    }
  })

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })

  function runInitialScan() {
    if (cleaningFinished) return
    const root = document.body || document.documentElement
    if (!root) return

    if (tryKillFrom(root)) {
      finishCleaning()
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInitialScan, { once: true })
  } else {
    runInitialScan()
  }
})()
