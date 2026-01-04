// ==UserScript==
// @name        JIRA ❤️ flippidippi
// @description Improvements for JIRA
// @version     1.0
// @author      flippidippi
// @namespace   https://flippidippi.com
// @grant       none
// @license     UNLICENSE
// @match       https://*.atlassian.net/jira/*
// @downloadURL https://update.greasyfork.org/scripts/553395/JIRA%20%E2%9D%A4%EF%B8%8F%20flippidippi.user.js
// @updateURL https://update.greasyfork.org/scripts/553395/JIRA%20%E2%9D%A4%EF%B8%8F%20flippidippi.meta.js
// ==/UserScript==

/**
 * Adds the sprint tile on the sprint board
 */
function addSprintTitle () {
  const titleEl = document.querySelector('title')

  const observer = new MutationObserver(() => {
    const title = document.title
    const sprintTitle = title.split(' - ')[0]
    const h1 = document.getElementsByTagName('h1')[0]
    const hasSprintTitle = h1.innerHTML.includes(sprintTitle)

    if (!title.includes(' - Scrum Board - ')) {
      if (hasSprintTitle) {
        h1.innerHTML = h1.innerHTML.split(' - ')[0]
      }
      return
    } else if (hasSprintTitle) {
      return
    }

    h1.innerHTML += ` - ${sprintTitle}`
  })

  observer.observe(titleEl, { childList: true })
}

addSprintTitle()
