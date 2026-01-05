// ==UserScript==
// @name OhYE!
// @namespace   imdfl1
// @description Hide users in Tapuz
// @include http://www.tapuz.co.il/forums2008/*forumid*
// @version 1.14
// @grant GM_getValue
// @grant GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/7283/OhYE%21.user.js
// @updateURL https://update.greasyfork.org/scripts/7283/OhYE%21.meta.js
// ==/UserScript==
 
(function() {
	"use strict";

	var oldUsers = [
			{id:  1615810, name: "ye44"},
			{id: 2340317, name: unescape("%u05D5%20%u05D5%20%u05D9%20%u05E0%20%u05E1%20%u05D8%20%u05D5%20%u05DF")},		
		], hiding = true,
		users = JSON.parse(GM_getValue("ignored_users1") || "[]") || [];
		
//		console.log("saved users: ", users);
		
	function isIgnored(id) {
		var rec = users.filter(function(u) {
			return u.id === id;
		})[0];
		return Boolean(rec);
	}
	
	function ignoreUser(id, name, bIgnore) {
		var user = {id: id, name: name};
		if (isIgnored(id)) {
			if (bIgnore) {
				return;
			}
			var rec;
			for (var i = users.length - 1; i >= 0; --i) {
				if (users[i].id == id) {
					users.splice(i);
				}
			}
		}
		else if (bIgnore) {
			users.push(user);
		}
		if (hiding) {
			toggleUser(user, bIgnore);
		}
		GM_setValue("ignored_users1", JSON.stringify(users));
	}

		
	function getParent(e, selector) {
		var p = e && e.parentNode,
			classes;
		while (p) {
			if (p.tagName.toLowerCase() === selector)
				return p;
			classes = (p.className || "").split(' ');
			if (classes.indexOf(selector) > -1) {
				return p;
			}
			p = p.parentNode;		
		}
		return null;
	}
	
	function toggleOne(div, parentSelector, hide, mode) {
		var parent = getParent(div, parentSelector), toggled;
		if (parent) {
			if (hide) {
				if (mode === "height") {
					parent.style.height = "1px";
				}
				else {
					parent.style.display = "none";
				}
			}
			else {
				if (mode === "height") {
					parent.style.height = "";  
				}
				else {
					parent.style.display = "block";
				}
			}
		}
		else {
//			console.log("cannot find parent with selector", parentSelector);
		}
	}
	
	function toggleUser(user, isHidden) {
//		console.log("toggling user", user.id);
		var divs = document.querySelectorAll("div#user_" + user.id),
			len,
			i;

		for (i = 0, len = divs.length; i < len; ++i) {
			toggleOne(divs[i], "msg-title", isHidden && hiding, "height");
		}
	}
	
	function toggleIt() {
		users.forEach(function(user) {
			toggleUser(user, hiding);
		});
	}
	
	function onIgnoreChange(id, name, event) {
		var target = event.currentTarget || event.target,
			ignore = target.checked;
//		console.log("ignore changed to ", ignore);
		ignoreUser(id, name, ignore);
	}
	
	function addIgnoreUI(node) {
		if (node.querySelector("input.imdfl-checkbox")) {
			return console.log("new new already contains ignore ui");
		}
		var anchors = node.querySelectorAll("a"),
			send, userId, userName;
		anchors = [].slice.call(anchors);
		anchors.forEach(function(a) {
			var href = (a.href || a.getAttribute("href") || "").toLowerCase(),
				ind;
			if (href.indexOf("newmsg") >= 0) {
				send = a;
			}
			else if ((ind = href.indexOf("userid=")) >= 0) {
				userId = href.substring(ind + 7).replace(/[^\d]/g, '');
			}
		});
		
		var bees = node.querySelectorAll("b");
		bees = [].slice.call(bees);
		bees.forEach(function(b) {
			if (b.innerHTML.indexOf("שם") >= 0) {
				userName = (b.nextSibling.textContent || "").replace(/^\s+/g, '').replace(/\s+$/g, '');
			}
		});
		
		if (send) {
			var div = document.createElement("div"),
				id="chk_" + Date.now(),
				checked = isIgnored(id) ? "" : "";
			div.style.display = "inline-block";
			div.innerHTML = '<input type="checkbox" class="imdfl-checkbox" id="' + id + '" name="' + id + '"' + checked + ' /><label for="' + id + '">התעלם</label>';
			send.parentNode.appendChild(div);
			var chk = div.querySelector("input");
			chk.checked = isIgnored(userId);
			chk.addEventListener("change", onIgnoreChange.bind(this, userId, userName));
		}
	}
	
	function onDomMutation(mutations) {
			var i, len = mutations.length, m,
				nodeIndex, nodeCount, lst,
				node, attr,
				addNodes = [],
				delNodes = [];
			for (i = 0; i < len; ++i) {
				m = mutations[i];
				switch (m.type) {
					case "childList":
						lst  = m.addedNodes;
						for (nodeIndex = 0, nodeCount = lst.length; nodeIndex < nodeCount; nodeIndex++) {
							node = (lst[nodeIndex]);
							if (node.className === "user-details-card") {
								addIgnoreUI(node);
							}
						}
				}
			}
	}

	function toggleNotifications(nDiv) {
		var anchors = nDiv.querySelectorAll("a");
//		window.console.log("found", anchors.length, "anchors");

		for (var i = 0, len = users.length; i < len; ++i) {
			var user = users[i],
				wrote = unescape(user.name + "%20%u05DB%u05EA%u05D1"),
				a;
			for (var j = 0, alen = anchors.length; j < alen; ++j) {
				a = anchors[j];
				if (a.innerHTML.indexOf(wrote) >= 0) {
					toggleOne(a, "li", hiding, "display");
				}
			}
		}
	}

	function testNotifications() {
		//console.log("testNotifications");
		var nInterval = window.setInterval(function() {
			var nDiv = document.querySelector("div.notificationsHistoryContainer");
//			console.log("checking notifications container, display", nDiv && nDiv.style.display);
			if (! nDiv || nDiv.style.display === "none") {
				return;
			}
			clearInterval(nInterval);
			var cb = toggleNotifications.bind(this, nDiv);
			setTimeout(cb, 300);
			setTimeout(cb, 600);
			setTimeout(cb, 1500);
		}, 200);
//		console.log("set interval to", nInterval);
	}
	
	var button,
		interval = setInterval(function() {
			button = document.querySelector("div.notificationsHistoryButton");
			if (button) {
				clearInterval(interval);
				button.addEventListener("click", testNotifications, true);
			}
		}, 1000);
		
	var domObserver = new window.MutationObserver(onDomMutation),
		domObserverConfig = {
			attributes: true,
			childList: true,
			characterData: false,
			subtree: true,
			attributeFilter: ["style", "class"]
		};
	domObserver.observe(document.body, domObserverConfig);		

	document.body.addEventListener("keydown", function(event) {
		if (event.keyCode === 89 && event.altKey && event.ctrlKey) {
			hiding = ! hiding;
			toggleIt();
		}
	});

	
	toggleIt();

}());