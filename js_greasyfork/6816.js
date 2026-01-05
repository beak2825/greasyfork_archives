// ==UserScript==
// @name:de        Steam: Geschenke an Freunde senden, die das Spiel bereits besitzen
// @name           Steam: Send gifts to friends who already own them
// @namespace      http://store.steampowered.com/
// @description:de Erlaubt es dir, Steam-Geschenke an Freunde zu senden, die das Spiel bereits besitzen.
// @description    Allows you to send Steam gifts to friends even if they already own it.
// @match          https://checkout.steampowered.com/checkout/sendgift/*
// @match          https://checkout.steampowered.com/checkout/
// @match          https://checkout.steampowered.com/checkout
// @version        1.2
// @grant          none
// @inject-into    content
// @run-at         document-end
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/6816/Steam%3A%20Send%20gifts%20to%20friends%20who%20already%20own%20them.user.js
// @updateURL https://update.greasyfork.org/scripts/6816/Steam%3A%20Send%20gifts%20to%20friends%20who%20already%20own%20them.meta.js
// ==/UserScript==

(function () {
	"use strict";

	for (const button of document.getElementsByName("friend_radio")) {
		button.disabled = false;
	}
})();
