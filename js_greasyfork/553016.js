// ==UserScript==
// @name         Wplace: li'l info bubble
// @namespace    huntracony
// @author       Huntracony
// @version      v2510a
// @description  Adds a li'l bubble to the top left that shows your droplets, amount of pixels to level up, and when your charge cap will be reached.  Might add more later.
// @match        https://wplace.live/
// @match        https://wplace.live/?*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAA9QTFRFAAAAAGZmAIWFALOz/6oAWLNyFAAAAAV0Uk5TAP////8c0CZSAAAAl0lEQVQ4jY3TQRLDMAgDQAv4/5s7pU4AgZvomNUlBtbKgWcdgpQHHirMXKkintwY2CuTSw5aQSgHV080imuJkCvHkArNzSwXhM0d5Eb5vuftjD/fBZnYEIWJVaIw8XYvdNTb/TcKXG8YSwE2nwNyob1wuA+cByTki0ecfG8Mr0nbWxw41hYzl7Ue+M9hdH8+vRfHmzrl0wcaYwZZgrTPwQAAAABJRU5ErkJggg==
// @license      GNU GPLv3
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553016/Wplace%3A%20li%27l%20info%20bubble.user.js
// @updateURL https://update.greasyfork.org/scripts/553016/Wplace%3A%20li%27l%20info%20bubble.meta.js
// ==/UserScript==

(async function() {
	"use strict";
	let dropletsBadge = null;
	let remainingAttempts = 100;
	while (!dropletsBadge) {
		if (remainingAttempts-- <= 0) throw "Droplets badge not found";
		await new Promise( r => setTimeout(r, 150) );
		const badgeCandidates = document.getElementsByClassName("badge");
		for (const element of badgeCandidates) {
			if (element.textContent.includes("Droplets")) dropletsBadge = element;
		}
	}
	//console.log("badge", dropletsBadge);

	let lastObservedDroplets = parseInt(dropletsBadge.textContent.replace(/\D/g, ""));
	new MutationObserver(async () => {
		const newDroplets = parseInt(dropletsBadge.textContent.replace(/\D/g, ""));
		if (newDroplets == lastObservedDroplets) return;
		if (isNaN(newDroplets)) throw "Parsing droplets failed";
		lastObservedDroplets = newDroplets;
		refreshData();
	}).observe(dropletsBadge, { subtree: true, childList: true, characterData: true });
	refreshData();
})();

async function refreshData() {
	"use strict";
	const response = await fetch("https://backend.wplace.live/me", {credentials: "include"});
	if (!response.ok) throw "Fetching data failed";
	const responseTime = Date.parse(response.headers.get("Date")) || Date.now();
	const userData = await response.json();
	const msToCap = (userData.charges.max - userData.charges.count) * 30 * 1000;
	const capTime = new Date(responseTime + msToCap);
	const pixelsToNextLevel = Math.ceil(30 * Math.floor(userData.level)**(1/0.65)) - userData.pixelsPainted; // formula taken from Blue Marble
	const droplets = userData.droplets;
	
	let container = document.getElementById("huntracony");
	if (!container) {
		container = document.createElement("div");
		container.id = "huntracony";
		container.classList.add("shadow-md");
    Object.assign(container.style, {
			position: "fixed",
			top: "0.5rem",
			left: "3rem",
			borderRadius: "1rem",
			padding: "0.5rem 1rem 0.5rem 0.5rem",
			background: "var(--color-base-200)",
			fontSize: "var(--text-sm)",
		});
		document.querySelector(":has(>#map)").append(container);
	}
	container.innerHTML = `
		<p title="Droplets">💧 ${Intl.NumberFormat("en").format(droplets)}</p>
		<p title="Amount of pixels you need to paint to level up">⬆ ${pixelsToNextLevel} px</p>
		<p title="When your charge cap will be reached">⏰ ${capTime.toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" })}</p>
	`;
}
