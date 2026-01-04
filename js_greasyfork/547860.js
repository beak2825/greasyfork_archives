// ==UserScript==
// @name        Discord - Keyword Notification
// @namespace   Discord
// @match       *://discord.com/channels/*
// @grant       GM_notification
// @version     0.0.1
// @author      Matthew
// @description Displays desktop notifications on being triggered by target messages.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/547860/Discord%20-%20Keyword%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/547860/Discord%20-%20Keyword%20Notification.meta.js
// ==/UserScript==


(function() {
	'use strict';

	function waitForTimeout(timeout) {
		const promise = new Promise(function(resolve, reject) {
			const check = setTimeout(function() {
				resolve();
			}, timeout);
		});
		return promise;
	}

	function waitForPredicate(p, timeout) {
		// Waits until given predicate returns true, then resolves, or timeouts in timeout ms, then rejects.
		const promise = new Promise(function(resolve, reject) {
			const start = performance.now();
			const check = setInterval(function() {
				if (p()) {
					resolve();
				} else if (performance.now() - start > timeout) {
					clearInterval(check);
					reject();
				}
			}, 100);
		});
		return promise;
	}


	function keyword_hit(s) {
		// Returns true if target message should raise a notification.
		const lowercased = s.toLowerCase();
		const mine = ["dev", "set", "serene", "polaris", "blessed exalted", "sardine", "🐟", "wingripper", "hexed", "chrysalis", "bass", "test",
					  "hammerhead", "wrath", "meg", "axe", "ax of", "rhoads", "boots", "scylla", "floppy", "oni", "cosmic"];
		const theirs = ["flying", "dutch", "cuddly", "claw", "demon", "wake", "jetski", "ship", "cruiser", "pride", "pegasus", "waverider",
						"guardian", "orca", "gondola", "crasher", "speedboat", "dead", "express", "mawrider", "toro", "racer", "irish",
						"lucky", "dreamer", "redemption", "curse", "tuskhorn", "fury", "throne", "desolate", "dragon",
						"dumbo", "nessie", "nomad", "claw", "puffer", "whaleski", "silent", "speeder", "blue", "cat", "vintage", "hatchboat",
						"brick", "rider", "bowl", "orange", "unicycle", "hoverslime", "elysian", "jolt", "inky", "banana", "meow", "kraken",
						"sushi", "black", "comet", "noct", "ducky", "evan", "moss"
   					];
		const boat_test_1 = new RegExp("lf.+boat");
		const boat_test_2 = new RegExp("looking for.+boat");
		const looking_for_boat = boat_test_1.test(lowercased) || boat_test_2.test(lowercased);
		const skin_test_1 = new RegExp("lf.+skin");
		const skin_test_2 = new RegExp("looking for.+skin");
		const looking_for_skin = skin_test_1.test(lowercased) || skin_test_2.test(lowercased);
		const no_fish_test_1 = new RegExp("nlf.+fish");
		const no_fish_test_2 = new RegExp("not.+fish");
		const no_fish = no_fish_test_1.test(lowercased) || no_fish_test_2.test(lowercased);
		const looking_for_mine_test_1 = mine.map((e) => new RegExp(`lf.+${e}`));
		const looking_for_mine_test_2 = mine.map((e) => new RegExp(`looking.+${e}`));
		const looking_for_mine = (looking_for_mine_test_1.concat(looking_for_mine_test_2)).some((re) => re.test(lowercased));
		const double_trigger_hit = mine.some((e) => lowercased.includes(e)) && theirs.some((e) => lowercased.includes(e));
		const their_triggers_hit = theirs.filter((e) => lowercased.includes(e))
		const my_triggers_hit = mine.filter((e) => lowercased.includes(e));
		if (double_trigger_hit) {
			console.debug(`THEIR/TRIGGERED: ${their_triggers_hit}`);
		}
		if (looking_for_mine) {
			console.debug(`MY/TRIGGERED: ${my_triggers_hit}`);
		} else if (looking_for_boat) {
			console.debug(`BLOCKED/BOAT`);
		} else if (looking_for_skin) {
			console.debug(`BLOCKED/SKIN`);
		} else if (no_fish) {
			console.debug(`BLOCKED/NO_FISH`);
		}
		return double_trigger_hit && (looking_for_mine || (!looking_for_boat && !looking_for_skin && !no_fish));
	}

	function main() {
		waitForPredicate(() => document.querySelectorAll("main.chatContent_f75fb0").length === 1, 30000)
		.then(function() {
			// Identify chat elements.
			const chat_content = document.querySelector("main.chatContent_f75fb0");
			const chat_scroller = chat_content.querySelector("ol.scrollerInner__36d07");
			const recent_notifications = new Map();
			const callback = function(mutationList, observer) {
				for (const record of mutationList) {
					const elements = record.addedNodes;
					for (const e of elements) {
						if (e.tagName === "LI") {
							const timestamp = parseInt(e.id.split("-").at(-1));
							const message_content = e.querySelector("div.contents_c19a55");
							const username = message_content.querySelector("h3 > span.headerText_c19a55 > span.username_c19a55").dataset.text;
							const friendly_timestamp = message_content.querySelector("h3 > span.timestamp_c19a55 > time").getAttribute("datetime");
							const is_new = message_content.querySelector('h3 > span.headerText_c19a55 > span[role="button"] > div.newMemberBadge_f80704') !== null;
							const message_elements = message_content.querySelector("div.messageContent_c19a55");
							// Extract text part of each element. Not accurate, some messages raise errors.
							const components = [];
							for (const el of message_elements.children) {
								let component = "";
								if (el.tagName === "H1") {
									component = el.querySelector("span > span").innerHTML;
								} else {
									component = el.innerHTML;
								}
								components.push(component);
							}
							const message = components.length > 1 ? components.join(" ") : components[0];
							const string_to_test = message ?? "";
							const re_tags = new RegExp("<.*?>", "g");
							const re_newlines = new RegExp("[\r\n]+", "g");
							const re_emoji_tag = new RegExp("<.*?🐟.*?>", "g");
							console.debug(username, friendly_timestamp, is_new, string_to_test);
							// const username_blacklist = ["Nickk", "domzui", "Rei", "Zantrille", "MhmmdYhsf"];
							const username_blacklist = [];
							const username_in_blacklist = username_blacklist.some((e) => username === e);
							if (keyword_hit(string_to_test) && !username_in_blacklist) {
								// NOTE: recent_notifications is not shared between scripts, of course. So it may appear multiple
								// times if the person is posting it in multiple channels.
								if (recent_notifications.has(username)) {
									const user_obj = recent_notifications.get(username);
									const last_time = user_obj.last_time;
									const repeats = user_obj.repeats;
									const target_time = Math.min(1000*60*12*(repeats + 1), 1000*60*60);
									if (performance.now() - last_time > target_time) {
										user_obj.repeats = repeats + 1;
										user_obj.last_time = performance.now();
										const message_no_tags_no_newlines = message.replaceAll(re_tags, "").replaceAll(re_newlines, " ");
										const message_emoji = message_no_tags_no_newlines.replaceAll(re_emoji_tag, "🐟");
										GM_notification({"title": `${username}`, "text": message_emoji});
									}
								} else {
									recent_notifications.set(username, {"last_time": performance.now(), "repeats": 0});
									const message_no_tags_no_newlines = message.replaceAll(re_tags, "").replaceAll(re_newlines, " ");
									const message_emoji = message_no_tags_no_newlines.replaceAll(re_emoji_tag, "🐟");
									GM_notification({"title": `${username}`, "text": message_emoji});
								}
							}
						}
					}
				}
			}
			const observer = new MutationObserver(callback);
			observer.observe(chat_scroller, {childList: true});
		});
	};
	main();
})();
