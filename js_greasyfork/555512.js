// ==UserScript==
// @name        Copy Button For Gemini Generated Text in Box
// @namespace   https://www.ufukyayla.com.tr/gemini_copy
// @match       https://gemini.google.com/*
// @grant       none
// @version     1.2
// @description Google Gemini
// @author      Ufuk Yayla
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/555512/Copy%20Button%20For%20Gemini%20Generated%20Text%20in%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/555512/Copy%20Button%20For%20Gemini%20Generated%20Text%20in%20Box.meta.js
// ==/UserScript==

(function() {
	function show_toast(txt) {
		var n = document.createElement("div");

		n.textContent = txt;
		n.style.position = "fixed";
		n.style.bottom = "20px";
		n.style.right = "20px";
		n.style.padding = "10px";
		n.style.color = "#ffffff";
		n.style.backgroundColor = "#55bb55";
		n.style.borderRadius = "6px";
		n.style.zIndex = "1000";

		document.body.appendChild(n);

		setTimeout(function() {
			document.body.removeChild(n);
		}, 3000);
	}

	function copy_text(txt) {
		var n = document.createElement("textarea");
		n.visibility = "hidden";
		n.value = txt;
		document.body.appendChild(n);
		
		n.select();

		try {
			var ok = document.execCommand("copy");
			var msg = ok ? "Copied" : "Copy to clipboard is not supported";
			show_toast(msg);
		} catch (err) {
			show_toast("Copy attempt failed");
		}

		document.body.removeChild(n);
	}

	function add_copy_button(elem) {
		var n = document.createElement("button");

		n.textContent = "Copy";
		n.style.padding = "8px";
		n.style.color = "#ffffff";	
		n.style.backgroundColor = "#55bb55";
		n.style.border = "none";
		n.style.borderRadius = "6px";
		n.style.cursor = "pointer";

		n.onmouseover = function() {
			n.style.backgroundColor = "#448844";
		}
		
		n.onmouseout = function() {
			n.style.backgroundColor = "#55bb55";
		}

		n.onclick = function() {
			var text_elem = elem.querySelector(".code-container");
			if (text_elem) {
				var txt = text_elem.textContent;
				copy_text(txt);
			}
		}

		elem.appendChild(n);
	}
	
	//----------observer
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			mutation.addedNodes.forEach(function(node) {
				if (node.nodeType === 1) {
					var code_blocks = node.querySelectorAll("code-block");
					code_blocks.forEach(function(block) {
						add_copy_button(block);
					});
				}
			});
		});
	});
	observer.observe(document.body, { childList: true, subtree: true });
	
	//----------init
	function add_buttons_init() {
		var code_blocks = document.querySelectorAll("code-block");
		code_blocks.forEach(function(block) {
			if (!block.querySelector("button")) {
				add_copy_button(block);
			}
		});
	}
	add_buttons_init();
})();