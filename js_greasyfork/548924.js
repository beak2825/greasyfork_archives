// ==UserScript==
// @name         Hacker News Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  add rainbow indent guides, favicons, profile icons and more to hacker news
// @author       Lynnesbian
// @homepage     https://git.bune.city/lynnesbian/hn-enhanced
// @match        https://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @require      https://cdn.jsdelivr.net/npm/jdenticon@3.3.0/dist/jdenticon.js#sha256=faa3d839565eed77d74b677f86d218977685f6f9515e2c3c86943802ca8c4a27
// @grant        GM_addStyle
// @grant        GM_addElement
// @sandbox      DOM
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/548924/Hacker%20News%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/548924/Hacker%20News%20Enhanced.meta.js
// ==/UserScript==

(async function() {
	'use strict';
	// h/t https://stackoverflow.com/a/54935305
	const COLOURS = new Array(3).fill(["grey", "red", "orange", "#fc0", "green", "blue", "purple"]).flat();
	const WIDTH_FACTOR = 6;
	const FAVICON_SIZE = "14";
	const GITHUB_PATTERN = /^github.com\/([^/]+)$/;

	let stylesheet = `
	table.comment-tree, table.comment-tree table {
		border-collapse: collapse;
	}

	table.comment-tree {
		margin-top: -10px;
	}

	table.comment-tree td {
		padding: 0;
	}

	table.comment-tree td:not(.ind) {
		padding: 0 2px;
	}

	td.ind > img {
		display: none;
	}

	.comment {
		margin-bottom: 4px;
	}

	/* gap between comments */
	.comtr table:has(td.ind[indent="0"]) {
		margin-top: 10px;
	}

	a:link.hnuser, a:visited.hnuser {
		color: #333;
	}

	.jdenticon-holder {
		display: inline-block;
		vertical-align: middle;
		margin-left: -3px;
		margin-top: -1px;
		background: #f6f6ef;
	}

	.jdenticon-holder.comments {
		margin-right: 1px;
	}

	.pagetop .jdenticon-holder {
		margin-right: 3px;
		margin-bottom: -1px;
	}

	.title-favicon {
		vertical-align: bottom;
		margin-right: 4px;
		margin-bottom: 1px;
	}

	@media only screen and (min-width: 300px) and (max-width: 750px) {
		.title-favicon {
			vertical-align: top;
			margin-top: 2px;
		}
	}
	`;

	let tree = document.getElementsByClassName("comment-tree");
	const in_comments = tree.length !== 0; // are we on the comments page? (/item?id=xyz)
	const icon_size = in_comments ? 20 : 16;

	if (in_comments) {
		// remove top margin from first comment
		tree[0].getElementsByTagName("table")[0].style.marginTop = "0px";

		// generate rainbow indent guides
		for (let indent = 0; indent < COLOURS.length; indent++) {
			// for each level of indent
			stylesheet += `td.ind[indent="${indent}"] { width: ${(indent + 1) * WIDTH_FACTOR}px; `;

			let gradient = "linear-gradient(to right, "
			for (let colour_depth = 0; colour_depth <= indent; colour_depth++) {
				// for each colour, up to and including the current indent level
				let colour = COLOURS[colour_depth];
				let start = colour_depth * WIDTH_FACTOR;
				let end = start + 2;
				gradient += `transparent ${start}px, ${colour} ${start}px, ${colour} ${end}px, transparent ${end}px, `
			}
			gradient += "transparent 100%);"

			stylesheet += `background-image: ${gradient}}\n`;
		}
	} else {
		// front page logic

		// make scores bold
		for (let score of document.getElementsByClassName("score")) {
			score.innerHTML = `<strong>${score.innerText.split(" ")[0]}</strong> points`;
		}
	}

	// add favicons
	for (let title of document.getElementsByClassName("titleline")) {
		let domain = title.getElementsByClassName("sitestr");
		if (domain.length === 0) {
			domain = "news.ycombinator.com";
		} else {
			domain = domain[0].innerText.split('/')[0];
		}
		let icon = GM_addElement("img", {
			src: `https://icons.duckduckgo.com/ip3/${domain}.ico`,
			height: FAVICON_SIZE,
			width: FAVICON_SIZE,
		});
		icon.className = "title-favicon";
		title.prepend(icon);
	}

	// add additional links to news items
	let subtexts = document.getElementsByClassName("subtext");
	for (let subtext of subtexts) {
		// warning: :(

		try { // because this fails for the "XYZ is hiring" ads
			const story_url = subtext
				.parentElement
				.previousElementSibling
				.getElementsByClassName("titleline")[0]
				.getElementsByTagName("a")[0]
				.href;

			let subline = subtext.children[0];

			let links = document.createElement("span");
			links.append(" | ");

			let archive = document.createElement("a");
			archive.href = `https://web.archive.org/web/2/${story_url}`;
			archive.innerText = "archive";
			links.append(archive);
			links.append(" | ");

			let reddit = document.createElement("a");
			reddit.href = `https://www.reddit.com/search/?q=url:%22${story_url}%22`;
			reddit.innerText = "reddit";
			links.append(reddit);

			if (in_comments) {
				subline.getElementsByClassName("hnpast")[0].after(links);
			} else {
				subline.getElementsByClassName("hider")[0].after(links);
			}
		} catch (error) {
			// :3
		}
	}

	GM_addStyle(stylesheet);

	// set up jdenticon icons
	let user_elements = Array.from(document.getElementsByClassName("hnuser"));
	let usernames = new Set(user_elements.map((user) => user.innerText));
	for (let username of usernames) {
		let elements = user_elements.filter((user) => user.innerText == username);

		for (let element of elements) {
			// add to <a>
			let icon = document.createElement("span");
			icon.className = in_comments ? "jdenticon-holder comments" : "jdenticon-holder";
			element.innerHTML = "";
			icon.innerHTML = jdenticon.toSvg(username, icon_size);
			element.appendChild(icon);
			element.innerHTML += username;
		}
	}

	// add your icon!
	let pagetop = document.getElementsByClassName("pagetop")[1];
	let me = document.getElementById("me");
	if (me !== null) {
		const username = me.innerText;
		let icon = document.createElement("span");
		icon.className = "jdenticon-holder";
		icon.innerHTML = jdenticon.toSvg(username, 16);
		pagetop.prepend(icon);
	}

	// add link to footer
	let yclinks = document.getElementsByClassName("yclinks")[0];
	yclinks.append(" | ");
	let enhanced = document.createElement("a");
	enhanced.href = "https://git.bune.city/lynnesbian/hn-enhanced";
	enhanced.innerText = "HN Enhanced";
	yclinks.append(enhanced);

	// go back and try to get site-specific favicons (just github for now)
	for (let title of document.getElementsByClassName("titleline")) {
		let site = title.getElementsByClassName("sitestr");
		if (site.length === 0) {
			site = "";
		} else {
			site = site[0].innerText
		}

		const gh_matches = GITHUB_PATTERN.exec(site);
		if (gh_matches !== null) {
			const user = gh_matches[1];
			const headers = new Headers();
			headers.set("Accept", "application/vnd.github+json");
			headers.set("X-GitHub-Api-Version", "2022-11-28");

			// https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-a-user
			const response = await window
			.fetch(`https://api.github.com/users/${user}`, headers)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
			}).then((response) => {
				if (response != undefined) {
					const old_icon = title.getElementsByClassName("title-favicon")[0];
					title.removeChild(old_icon);

					let icon = GM_addElement("img", {
						src: response.avatar_url,
						height: FAVICON_SIZE,
						width: FAVICON_SIZE,
					});
					icon.className = "title-favicon";
					title.prepend(icon);
				}
			});
		}
	}
})();

jdenticon();
