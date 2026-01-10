// ==UserScript==
// @name         Add Analytics Nav Item for X
// @namespace    https://github.com/Johnson1602/tampermonkey-scripts
// @version      0.0.2
// @description  Adds an Analytics nav item below Premium in the X.com sidebar
// @author       Weiyi Xu
// @license      MIT
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562128/Add%20Analytics%20Nav%20Item%20for%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/562128/Add%20Analytics%20Nav%20Item%20for%20X.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const ANALYTICS_URL = '/i/account_analytics'
  const ANALYTICS_LABEL = 'Analytics'

  // Analytics chart icon SVG path
  const ANALYTICS_ICON_PATH =
    'M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z'

  let analyticsTextContainer = null

  function createAnalyticsNavItem(referenceItem) {
    const analyticsItem = document.createElement('a')
    analyticsItem.href = ANALYTICS_URL
    analyticsItem.setAttribute('aria-label', ANALYTICS_LABEL)
    analyticsItem.setAttribute('role', 'link')
    analyticsItem.className = referenceItem.className
    analyticsItem.setAttribute('data-testid', 'AppTabBar_Analytics_Link')

    // Clone the inner structure from reference item
    const innerDiv = referenceItem.querySelector('div')
    if (innerDiv) {
      const clonedDiv = innerDiv.cloneNode(true)

      // Update the SVG icon
      const svg = clonedDiv.querySelector('svg')
      if (svg) {
        svg.innerHTML = `<g><path d="${ANALYTICS_ICON_PATH}"></path></g>`
      }

      // Update the text and store reference to text container
      const textSpans = clonedDiv.querySelectorAll('span')
      if (textSpans.length > 0) {
        textSpans[0].textContent = ANALYTICS_LABEL
        // The text container is the parent div of the spans
        analyticsTextContainer = textSpans[0].parentElement
      }

      // Add hover state handlers using inline styles
      analyticsItem.addEventListener('mouseenter', () => {
        const isDarkMode = document.documentElement.dataset.theme === 'dark'
        clonedDiv.style.backgroundColor = isDarkMode
          ? 'rgba(231, 233, 234, 0.1)'
          : 'rgba(15, 20, 25, 0.1)'
      })
      analyticsItem.addEventListener('mouseleave', () => {
        clonedDiv.style.backgroundColor = ''
      })

      analyticsItem.appendChild(clonedDiv)
    }

    return analyticsItem
  }

  function syncTextVisibility(referenceItem) {
    if (!analyticsTextContainer) return

    // Check if the reference item has visible text (has span elements)
    const refTextSpan = referenceItem.querySelector('span')
    const hasText = refTextSpan !== null

    if (hasText) {
      analyticsTextContainer.style.display = ''
    } else {
      analyticsTextContainer.style.display = 'none'
    }
  }

  function addAnalyticsNavItem() {
    // Find the Premium nav item, fallback to Home
    const premiumItem = document.querySelector(
      '[data-testid="premium-hub-tab"]'
    )
    const homeItem = document.querySelector(
      '[data-testid="AppTabBar_Home_Link"]'
    )
    const referenceItem = premiumItem || homeItem

    if (!referenceItem) {
      return
    }

    // Check if already added
    const existingItem = document.querySelector(
      '[data-testid="AppTabBar_Analytics_Link"]'
    )
    if (existingItem) {
      const refHasText = referenceItem.querySelector('span') !== null

      // If reference now has text but we don't have a text container, recreate the item
      if (refHasText && !analyticsTextContainer) {
        existingItem.remove()
        analyticsTextContainer = null
      } else {
        // Sync text visibility with reference item
        syncTextVisibility(referenceItem)
        return
      }
    }

    // Create and insert the Analytics nav item
    const analyticsItem = createAnalyticsNavItem(referenceItem)
    referenceItem.insertAdjacentElement('afterend', analyticsItem)
  }

  // Use MutationObserver to handle SPA navigation and responsive changes
  const observer = new MutationObserver(() => {
    addAnalyticsNavItem()
  })

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  // Initial attempt
  addAnalyticsNavItem()
})()
