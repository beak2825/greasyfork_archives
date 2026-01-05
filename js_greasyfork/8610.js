// ==UserScript==
// @name    	Hide sc2tv.ru moderators
// @description Чат без какаедов: скрывает сообщения от пользователей с классом "role-moderator" 
// @version  	1.0.1
// @include 	http://sc2tv.ru/*
// @include  	http://chat.sc2tv.ru/*
// @namespace	http://github.com/LannTheStupid
// @grant 		GM_log
// @downloadURL https://update.greasyfork.org/scripts/8610/Hide%20sc2tvru%20moderators.user.js
// @updateURL https://update.greasyfork.org/scripts/8610/Hide%20sc2tvru%20moderators.meta.js
// ==/UserScript==

var ignored = 'role-moderator';
var ignoredSelector = "span." + ignored;

function GM_wait() {
	var chat_element = document.getElementById("chat");
	if (chat_element === null) {
		setTimeout(GM_wait, 50);
	} else {
		GM_run();
	}
}

GM_wait();

function GM_run() {
	if ('MutationObserver' in window) {
		var chat_node = document.querySelector("#chat");
		var observer = new MutationObserver(function(mutations) {
			for (var i = 0; i < mutations.length; i++) {
				for (var j = 0; j < mutations[i].addedNodes.length; j++) {
					var addedNode = mutations[i].addedNodes[j];
					if (addedNode.nodeType == 1 && 
							addedNode.querySelector(ignoredSelector) !== null) {
						addedNode.style.display = "none";
					}
				}
			}
		});
		var config = {
			childList : true,
			subtree: true
		};
		observer.observe(chat_node, config);
	} else {
		GM_log("The observer is NOT available");
	}
}
