// ==UserScript==
// @name         PistonHeads - Block users.
// @namespace    BS_PH
// @version      1.71
// @description  Hide posts + quotes from annoying users. Right-click the username on a post to block/unblock.
// @author       Budgie Smuggler
// @match        https://www.pistonheads.com/gassing/topic.asp*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/563614/PistonHeads%20-%20Block%20users.user.js
// @updateURL https://update.greasyfork.org/scripts/563614/PistonHeads%20-%20Block%20users.meta.js
// ==/UserScript==

(function () {
	"use strict";

	// storage for our blocked users
	let blockedUsers = GM_getValue("ph_blocked_users", []);

	function normalize(name) {
		return (name || "").trim().toLowerCase();
	}

	function isBlocked(name) {
		return blockedUsers.some((u) => normalize(u) === normalize(name));
	}

	function toggleBlock(username) {
		const norm = normalize(username);
		if (isBlocked(username)) {
            // already blocked, remove them from the block list
			blockedUsers = blockedUsers.filter((u) => normalize(u) !== norm);
		} else {
            // not blocked yet, add them to the naughty list
			blockedUsers.push(username);
		}
		GM_setValue("ph_blocked_users", blockedUsers);
		updateVisibility();
	}

	function createPlaceholder(username, isQuote, originalContent, container) {
		const placeholder = document.createElement("div");
		const styles = isQuote
			? "padding:8px; color:#999; font-style:italic; background:#f5f5f5; border-left:3px solid #ddd; cursor:pointer;"
			: "padding:12px; color:#777; font-style:italic; background:#f9f9f9; border:1px solid #eee; cursor:pointer;";

		placeholder.style.cssText = styles;
		placeholder.innerHTML = `[Hidden ${isQuote ? "quote from" : "- user"} <strong>${username}</strong> ${isQuote ? "" : "blocked"}] <span style="color:#${isQuote ? "bbb" : "999"}; font-size:0.9em;">(click to show)</span>`;

		placeholder.addEventListener("click", function (e) {
			e.stopPropagation();
			container.innerHTML = originalContent;
			delete container.dataset.phHidden;
			if (isQuote) hideBlockedQuotes(container);
		});

		return placeholder;
	}

	function hideBlockedQuotes(container) {
		container.querySelectorAll(".forumQuote").forEach((quote) => {
			const quoter = quote.previousElementSibling;
			if (!quoter?.classList.contains("forumQuoter")) return;

			const match = quoter.textContent.trim().match(/^(.+?)\s+said:$/i);
			if (!match) return;

			const username = match[1].trim();
			const shouldHide = isBlocked(username);
			const isHidden = quote.dataset.phHidden === "true";

			if (shouldHide && !isHidden) {
				const originalContent = quote.innerHTML;
				quote.dataset.phOriginal = originalContent; // Store original
				quote.innerHTML = "";
				quote.appendChild(
					createPlaceholder(username, true, originalContent, quote),
				);
				quote.dataset.phHidden = "true";
			} else if (!shouldHide && isHidden) {
				// User was unblocked - restore content
				quote.innerHTML = quote.dataset.phOriginal || quote.innerHTML; // Restore
				delete quote.dataset.phHidden;
				delete quote.dataset.phOriginal;
				hideBlockedQuotes(quote); // Re-check nested quotes
			} else if (!shouldHide) {
				// Check nested quotes in visible quotes
				hideBlockedQuotes(quote);
			}
		});
	}

	function updateVisibility() {
		document.querySelectorAll(".topic-reply").forEach((post) => {
			const authorLink = post.querySelector(".js-author a");
			const body = post.querySelector(".phml.msg-body");
			if (!authorLink || !body) return;

			const username = authorLink.textContent.trim();
			const shouldHide = isBlocked(username);
			const isHidden = body.dataset.phHidden === "true";

			if (shouldHide && !isHidden) {
				const originalContent = body.innerHTML;
				body.dataset.phOriginal = originalContent; // Store original
				body.innerHTML = "";
				body.appendChild(
					createPlaceholder(username, false, originalContent, body),
				);
				body.dataset.phHidden = "true";
			} else if (!shouldHide && isHidden) {
				// user was unblocked - restore content
				body.innerHTML = body.dataset.phOriginal || body.innerHTML; // Restore
				delete body.dataset.phHidden;
				delete body.dataset.phOriginal;
				hideBlockedQuotes(body); // Re-check for blocked quotes
			} else if (!shouldHide) {
				// attempt to hide quotes in visible posts
				hideBlockedQuotes(body);
			}
		});
	}

	// right click menu...
	let currentMenu = null;

	function removeMenu() {
		if (currentMenu) {
			currentMenu.remove();
			currentMenu = null;
		}
	}

	function createMenu(username, x, y) {
		removeMenu();

		currentMenu = document.createElement("div");
		currentMenu.style.cssText = `
            position: fixed; z-index: 999999;
            left: ${x}px; top: ${y}px;
            background: white; border: 1px solid #ccc;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.4);
            min-width: 180px; padding: 4px 0;
            font-family: Arial, Helvetica, sans-serif; font-size: 13px;
            user-select: none; border-radius: 4px;
        `;

		const action = isBlocked(username) ? "Unblock" : "Block";
		const item = document.createElement("div");
		item.textContent = `${action} ${username}`;
		item.style.cssText =
			"padding: 8px 16px; cursor: pointer; white-space: nowrap;";
		item.addEventListener(
			"mouseover",
			() => (item.style.background = "#e6f0ff"),
		);
		item.addEventListener(
			"mouseout",
			() => (item.style.background = "white"),
		);
		item.addEventListener("click", (e) => {
			e.stopPropagation();
			toggleBlock(username);
			removeMenu();
		});

		currentMenu.appendChild(item);
		document.body.appendChild(currentMenu);
	}

	function outsideClickHandler(e) {
		if (currentMenu && !currentMenu.contains(e.target)) {
			removeMenu();
		}
	}

	// init the page with the users hidden
	updateVisibility();

	if (!window.phMenuCloseListenersAdded) {
		document.addEventListener("click", outsideClickHandler, true);
		document.addEventListener("contextmenu", outsideClickHandler, true);
		window.phMenuCloseListenersAdded = true;
	}

	document.addEventListener(
		"contextmenu",
		function (e) {
			const link = e.target.closest(".js-author a");
			if (link) {
				e.preventDefault();
				const username = link.textContent.trim();
				createMenu(username, e.clientX + 5, e.clientY + 5);
			}
		},
		false,
	);
})();
