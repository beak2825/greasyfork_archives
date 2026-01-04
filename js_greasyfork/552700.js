// ==UserScript==
// @name         lookNside
// @namespace    https://sleazyfork.org/
// @version      1.0.1
// @description  Scroll through manga pages with a simple mouse movement
// @author       Snivy
// @license      MIT
// @match        https://nhentai.net/*
// @icon         https://icons.duckduckgo.com/ip3/nhentai.net.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552700/lookNside.user.js
// @updateURL https://update.greasyfork.org/scripts/552700/lookNside.meta.js
// ==/UserScript==

(function() {
	'use strict';

	async function handleGalleryItem(g) {
		const a = g.querySelector('a')
		const page = await loadPage(a.href)
		if (! page) return;

		const thumbs = [].map.call(page.querySelectorAll('.thumb-container img'), thumb => thumb.dataset.src)

		const originalThumb = a.querySelector('img')
		const originalPadding = a.style.paddingBottom
		a.insertAdjacentHTML('afterBegin', `<img style="display:none" class="x-dynamic-thumb">`)
		const dynamicThumb = a.querySelector('.x-dynamic-thumb')

		a.addEventListener('mousemove', ev => {
			if (ev.offsetX <= 0) return;
			if (ev.offsetX > 0) {
				const thumbWidth = Math.round(a.getBoundingClientRect().width)
				const relativePosition = ev.offsetX / thumbWidth
				if (relativePosition >= 1) return;
				const index = Math.floor(relativePosition * thumbs.length)
				a.style.padding = `0px 0px ${Math.max(141.6, +originalPadding.slice(0, -1))}%`
				originalThumb.style.display = 'none'
				dynamicThumb.style.display = 'block'
				dynamicThumb.src = thumbs[index]
			}
		})

		a.addEventListener('mouseleave', ev => {
			dynamicThumb.style.display = 'none'
			originalThumb.style.display = 'block'
			a.style.padding = `0px 0px ${originalPadding}`
		})
	}

	async function loadPage(url) {
		const res = await fetch(url)
		if (! res?.ok) return false
		const html = await res.text()
		if (! html) return false
		return Range.prototype.createContextualFragment.bind(document.createRange())(html)
	}

	document.querySelectorAll('.gallery').forEach(g => handleGalleryItem(g))
})()