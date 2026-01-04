// ==UserScript==
// @name         GitHub Wide Markdown
// @namespace    https://greasyfork.org/users/1002054-igorskyflyer
// @version      v1.0.1
// @description  A lightweight UserScript that removes narrow layout; expands GitHub Markdown (*.md) files to full‑width for easier reading and better use of screen space.
// @author       igorskyflyer
// @date         2025-09-22
// @match        https://github.com/*.md
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @run-at       document-end
// @grant        none
// @license      GPL-3.0-or-later
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @compatible   edge
// @homepageURL  https://github.com/igorskyflyer/userscript-github-wide-markdown
// @supportURL   https://greasyfork.org/scripts/550390/feedback
// @downloadURL https://update.greasyfork.org/scripts/550390/GitHub%20Wide%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/550390/GitHub%20Wide%20Markdown.meta.js
// ==/UserScript==

// @ts-nocheck

;(() => {
  const widen = () => {
    const el = document.querySelector('article.markdown-body')

    if (!el) {
      return
    }

    el.style.setProperty('max-width', '100%', 'important')
    el.style.setProperty('margin-left', '0', 'important')
    el.style.setProperty('margin-right', '0', 'important')
  }

  widen()

  new MutationObserver(widen).observe(document.body, {
    childList: true,
    subtree: true
  })
})()
