// ==UserScript==
// @name         theseed-thread-user-block
// @namespace    http://tampermonkey.net/
// @version      2025-10-15
// @description  does what its name suggests.
// @author       Abiria
// @match        *://theseed.io/*
// @match        *://namu.wiki/*
// @license      MIT
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/552596/theseed-thread-user-block.user.js
// @updateURL https://update.greasyfork.org/scripts/552596/theseed-thread-user-block.meta.js
// ==/UserScript==

const blockedUsers = [`Aidenk`]

const hideBlockedComment = () => {
	// check current url
	if (!window.location.href.includes('/thread/')) return

	const comments = document.querySelectorAll(
		`#app > div.Liberty > div.content-wrapper > div.container-fluid.liberty-content > div.liberty-content-main.wiki-article > div:nth-child(2) > div`,
	)

	Array.from(comments).filter(comment => {
		if (!(comment instanceof HTMLElement)) return

		const authorEl = comment.querySelector(
			`div > div.v-popper.v-popper--theme-contextmenu > a`,
		)

		if (blockedUsers.includes(authorEl?.textContent))
			comment.style.display = 'none'
	})
}

const observer = new MutationObserver((mutationsList, observer) => {
	const mutation = mutationsList.find(
		mutation =>
			mutation.type === 'childList' || mutation.type === 'subtree',
	)

	if (!mutation) return

	console.log('DOM has been mutated. Re-applying script.')
	hideBlockedComment()
})

observer.observe(document.body, {
	childList: true,
	subtree: true,
})