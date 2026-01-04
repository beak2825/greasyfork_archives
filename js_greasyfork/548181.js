// ==UserScript==
// @name         TC Log Filter
// @namespace    namespace
// @version      0.1
// @description  description
// @license      MIT
// @author       tos
// @match       *.torn.com/page.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548181/TC%20Log%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/548181/TC%20Log%20Filter.meta.js
// ==/UserScript==

const customFilterHTML = `
<div class="customFilters">
  <label for="customFilters">Search</label>
  <input id="customTextFilter" type="text">
 </div>
`

function waitForSelector(selector) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector))
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector))
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  })
}


waitForSelector('[class^=filtersPanel]').then(filtersPanel => {
  filtersPanel.insertAdjacentHTML('beforeend', customFilterHTML)
  document.querySelector('#customTextFilter').addEventListener('change', customTextFilter)
})


function customTextFilter(e) {
  const search_value = e.target.value.toLowerCase()
  document.querySelectorAll('SPAN[id^=text]').forEach(logEntry => {
    if (logEntry.innerText.toLowerCase().includes(search_value)) {
      logEntry.closest('TR').classList.remove('hide')
    }
    else logEntry.closest('TR').classList.add('hide')
  })
}