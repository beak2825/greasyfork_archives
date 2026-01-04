// ==UserScript==
// @name Github "Updated Last"
// @description Sort Github Issues "Updated Last" by default
// @version  1
// @grant    none
// @license EPL-2.0
// @namespace basilevs
// @match https://github.com/*
// @downloadURL https://update.greasyfork.org/scripts/551958/Github%20%22Updated%20Last%22.user.js
// @updateURL https://update.greasyfork.org/scripts/551958/Github%20%22Updated%20Last%22.meta.js
// ==/UserScript==

const list = document.querySelectorAll('a[href^="/"]')
  console.debug('Found: ',list)


for (const a of list) {
	let url = new URL(a.href)
  console.debug(url)
  if (!url.pathname.endsWith("/issues") && !url.pathname.endsWith("/pulls")) {
    continue
  }
		if (url.searchParams.get('q')) {
      continue
    }
  url.searchParams.set('q', 'state:open sort:updated-desc')
  a.href = url.toString();
}

