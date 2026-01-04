// ==UserScript==
// @name           SV/SB/QQ: Go To Latest Chapter
// @namespace      https://github.com/w4tchdoge
// @version        1.0.0-20251229_131822
// @description    Adds the ability to go to the latest threadmark or a specific threadmark of a thread by adding `/latest` / `/ltst` (`/ltst/` is required for QQ) or `/nav/{NUMBER}` respectively to the end of a URL to a SV/SB/QQ thread with threadmarks. The `/latest` or `/nav/{NUMBER}` must be added before the anchor (the # symbol). e.g. https://forums.sufficientvelocity.com/threads/{THREAD_ID}/latest, https://forums.spacebattles.com/threads/{THREAD_ID}/page-268/nav/2, https://forum.questionablequesting.com/threads/{THREAD_ID}/page-268/ltst#post-118049474
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://forums.spacebattles.com/threads/*
// @match          *://forums.spacebattles.com/threads/*/latest
// @match          *://forums.spacebattles.com/threads/*/ltst
// @match          *://forums.spacebattles.com/threads/*/nav
// @match          *://forums.spacebattles.com/threads/*/nav/*
// @match          *://forums.sufficientvelocity.com/threads/*
// @match          *://forums.sufficientvelocity.com/threads/*/latest
// @match          *://forums.sufficientvelocity.com/threads/*/ltst
// @match          *://forums.sufficientvelocity.com/threads/*/nav
// @match          *://forums.sufficientvelocity.com/threads/*/nav/*
// @match          *://forum.questionablequesting.com/threads/*
// @match          *://forum.questionablequesting.com/threads/*/ltst
// @match          *://forum.questionablequesting.com/threads/*/nav
// @match          *://forum.questionablequesting.com/threads/*/nav/*
// @license        AGPL-3.0-or-later
// @run-at         document-start
// @history        1.0.0 — Fix `/latest` not working and add more details about latest threadmark functionality to description, add updateURL and downloadURL, and make userscript ready to be published onto GreasyFork
// @history        0.0.1 — Initial commit
// @downloadURL https://update.greasyfork.org/scripts/560600/SVSBQQ%3A%20Go%20To%20Latest%20Chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/560600/SVSBQQ%3A%20Go%20To%20Latest%20Chapter.meta.js
// ==/UserScript==

(async function () {
	`use strict`;

	async function getThreadmarksCount(thread_id = ``, base_url = ``) {
		if (thread_id == ``) { throw new Error("thread_id must be passed to getThreadmarksCount as a non-empty string"); }
		if (base_url == ``) { throw new Error("base_url must be passed to getThreadmarksCount as a non-empty string"); }
		const html_parser = new DOMParser();

		const thrdmrk_count_fetch_url = `${base_url}/threads/${thread_id}/threadmarks`;
		const thrdmrk_count_fetch_resp = await fetch(thrdmrk_count_fetch_url, { headers: { 'Content-Type': 'text/html; charset=utf-8', } });
		const thrdmrk_count_resp_text = await thrdmrk_count_fetch_resp.text();
		const thrdmrk_count_html = html_parser.parseFromString(thrdmrk_count_resp_text, `text/html`);
		const thrdmrk_count = parseInt(thrdmrk_count_html.querySelector(`.block-formSectionHeader > span[data-xf-init^="threadmarks"] > span`)
			.textContent.trim()
			.split(/[\s\(,\)]/)
			.filter(e => Boolean(e) == true)
			.at(1));

		return thrdmrk_count;
	}

	async function getThreadmarkURLsArr(thread_id = ``, base_url = ``, nav = -1, is_latest = false) {
		// 		console.log(`
		// thread_id : [${thread_id}]
		// base_url : [${base_url}]
		// nav : [${nav}]
		// is_latest : [${is_latest}]
		// `);
		if (thread_id == ``) { throw new Error("thread_id must be passed to getThreadmarkURLsArr as a non-empty string"); }
		if (base_url == ``) { throw new Error("base_url must be passed to getThreadmarkURLsArr as a non-empty string"); }

		const thrdmrk_count = await getThreadmarksCount(thread_id, base_url);
		const latest_pg = Math.ceil(thrdmrk_count / 25);

		const html_parser = new DOMParser();
		let html;
		if (is_latest) {
			const latest_fetch_url = `${base_url}/threads/${thread_id}/threadmarks?page=${latest_pg}`;
			const latest_fetch_resp = await fetch(latest_fetch_url, { headers: { 'Content-Type': 'text/html; charset=utf-8', } });
			const latest_resp_text = await latest_fetch_resp.text();
			html = html_parser.parseFromString(latest_resp_text, `text/html`);
		}
		if (!is_latest && nav < 1) { throw new Error("nav must be passed to getThreadmarkURLsArr as a non-zero positive integer"); }
		if (!is_latest && nav > thrdmrk_count) { throw new Error("nav cannot be greater than the maximum number of threadmarks (thrdmrk_count)"); }
		if (!is_latest && nav >= 1) {
			const page = Math.ceil(nav / 25);
			const nav_fetch_url = `${base_url}/threads/${thread_id}/threadmarks?page=${page}`;
			const nav_fetch_resp = await fetch(nav_fetch_url, { headers: { 'Content-Type': 'text/html; charset=utf-8', } });
			const nav_resp_text = await nav_fetch_resp.text();
			html = html_parser.parseFromString(nav_resp_text, `text/html`);
		}

		// Search the parsed HTML of the navigate page for all links that go to a chapter, and create an "ordered" array containing all of the aforementioned links as URL objects
		const chapter_urls_arr = Array.from(html.querySelectorAll(`div[class*="threadmarkBody"] > div.structItemContainer > div[class*="structItem--threadmark"] div.structItem-title a[href*="/threads"]`))
			.map(e => new URL(`${e.getAttribute(`href`)}`, base_url));

		return chapter_urls_arr;
	}


	// Get current page url as a URL object
	const curr_url = new URL(window.location);
	const curr_url_domain = curr_url.hostname;

	// Get thread ID
	const thread_id = (() => {

		// Split path of current URL on all forward slashes
		const pathname_segments = curr_url.pathname.split(`/`);
		// Get the index of the last element which is a string equal to 'threads'
		// Add 1 to it to get the index of the thread ID
		const tid_index = (pathname_segments.findLastIndex(elm => elm === `threads`)) + 1;
		// Get thread ID using the above index
		const tid = pathname_segments.at(tid_index).replace(/(?:[^\.]+\.)?(\d+)/g, `$1`);

		return tid;

	})();

	const url_latest = (curr_url_domain == `forum.questionablequesting.com`) ? (curr_url.pathname.split(`/`).at(-1).toString().toLowerCase() == `ltst`) : (curr_url.pathname.split(`/`).at(-1).toString().toLowerCase() == `latest` || curr_url.pathname.split(`/`).at(-1).toString().toLowerCase() == `ltst`);
	const url_nav_end = curr_url.pathname.split(`/`).at(-1).toString().toLowerCase() == `nav`;
	const url_nav = (() => {
		const segments = curr_url.pathname.split(`/`);
		const nav_seg = segments.at(-2).toString().toLowerCase() == `nav`;
		const nav_num = Number.isInteger(parseInt(segments.at(-1)));
		if (nav_seg && nav_num) { return true; } else { return false; }
	})();


	// Check if URL ends in latest
	if (url_latest) { // If URL ends in latest

		// Stop further loading of webpage
		window.stop();

		// Get URL for the latest chapter
		const latest_url = (await getThreadmarkURLsArr(thread_id, `https://${curr_url_domain}`, -1, true)).at(-1);

		// console.log(`latest`, curr_url, work_id, latest_url);

		// Redirect to latest chapter
		window.location.replace(latest_url);

	}
	if (url_nav_end) {

		window.stop();
		window.location.replace(`https://${curr_url_domain}/threads/${thread_id}/threadmarks`);

	}
	if (url_nav) {

		window.stop();

		const thrdmrk_count = await getThreadmarksCount(thread_id, `https://${curr_url_domain}`);
		const [nav, nav_idx] = (() => {
			const usr_nav_num = parseInt(curr_url.pathname.split(`/`).at(-1));
			if (usr_nav_num < 1) {
				throw new Error("Please pass a value greater than 0 for the chapter you are attempting to navigate to");
			}
			if (usr_nav_num > thrdmrk_count) {
				throw new Error("Please pass a value less than or equal to the number of published chapters for the chapter you are attempting to navigate to");
			}
			const idx = (usr_nav_num % 25) - 1;
			return [usr_nav_num, idx];
		})();

		const work_chapter_urls = await getThreadmarkURLsArr(thread_id, `https://${curr_url_domain}`, nav, false);
		const nav_url = work_chapter_urls.at(nav_idx);

		window.location.replace(nav_url);

	}

})();