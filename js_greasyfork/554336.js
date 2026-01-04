// ==UserScript==
// @name         豆瓣用户备注
// @namespace    http://tampermonkey.net/
// @version      2025-10-31
// @description  在用户名后面添加备注
// @author       Betty
// @match        https://www.douban.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554336/%E8%B1%86%E7%93%A3%E7%94%A8%E6%88%B7%E5%A4%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554336/%E8%B1%86%E7%93%A3%E7%94%A8%E6%88%B7%E5%A4%87%E6%B3%A8.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const siteConfig = [
		{
			// 豆瓣小组帖子
			pattern: /douban\.com\/group\/topic/,
			selector: '.topic-doc .from a, .bg-img-green h4 a',
			idRegex: /\/people\/([A-Za-z0-9_-]+)/
		},
		{
			// 豆瓣个人主页
			pattern: /douban\.com\/people\//,
			selector: '#db-usr-profile',
			idRegex: /\/people\/([A-Za-z0-9_-]+)/
		},
	];

	const currentConfig = siteConfig.find(c => c.pattern.test(location.href));

	const NOTES_KEY = "userNotesByID";
	const notes = JSON.parse(localStorage.getItem(NOTES_KEY) || "{}");

	function saveNotes() {
		localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
	}

	// Extract the user ID
	function getUserId(userEl) {
		// Try from the link first
		const hrefMatch = userEl.href?.match(currentConfig.idRegex);
		if (hrefMatch) return hrefMatch[1];

		// Fallback: try to get from the current page URL
		const urlMatch = location.href.match(currentConfig.idRegex);
		if (urlMatch) return urlMatch[1];

		return null;
	}

	function addNotesToUsers() {
		document.querySelectorAll(currentConfig.selector).forEach(userEl => {
			// Avoid adding notes multiple times
			if (userEl.dataset.noteAttached) return;

			const userId = getUserId(userEl);
			if (!userId) return;

			const noteText = notes[userId] || "";

			// Create or show the note span
			const noteSpan = document.createElement('span');
			noteSpan.textContent = noteText ? `${noteText}` : "+";
			noteSpan.style.color = '#333';
			noteSpan.style.background = '#ddd';
			noteSpan.style.cursor = 'pointer';
			noteSpan.style.margin = '0 5px';
			noteSpan.style.padding = '2px 5px';

			// Click to edit
			noteSpan.onclick = () => {
				const newNote = prompt(`Note for user ${userId}:`, notes[userId] || "");
				if (newNote !== null) {
					notes[userId] = newNote.trim();
					saveNotes();
					noteSpan.textContent = newNote ? ` ${newNote} ` : "";
				}
			};

			userEl.after(noteSpan);

			// Add a data-note-attached attribute to avoid adding notes multiple times
			userEl.dataset.noteAttached = true;
		});
	}

	addNotesToUsers();
	const observer = new MutationObserver(addNotesToUsers);
	observer.observe(document.body, { childList: true, subtree: true });
})();
