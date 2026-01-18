// ==UserScript==
// @name         Pink Blue Map
// @version      1.2
// @description  Toggle OBN / Nameless TT in torn map
// @author       Luke [1993031]
// @match        https://www.torn.com/city.php*
// @run-at       document-end
// @namespace https://greasyfork.org/users/684752
// @downloadURL https://update.greasyfork.org/scripts/561563/Pink%20Blue%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/561563/Pink%20Blue%20Map.meta.js
// ==/UserScript==

(function () {
	"use strict";

	/* =========================
	   PATH GROUPS
	   ========================= */

	const bluePaths = [
		"VVB","WVB","XVB","XUB","YUB","TQF","AVB","SQF","YVB","ZVB","ODG","EUB","HUB","IUB","LUB",
		"PVB","MUB","QVB","NVB","JUB","KTB",
		"JTB","LTB","PUB","QUB","BAA","RUB","TCG","SCG","OCG","QCG","PCG","RCG",
		"KBG","MBG","NCG","LBG",
		"PQF","QQF","BVB","DVB","CVB","EVB","OQF","NQF","RQF","KVB","LVB","MVB","FVB","JVB","HVB","GVB","IVB"
	];

	const pinkPaths = [
		"FUB","WUB","GUB","ZUB","BUB","AUB","CUB","UUB","DUB","ITB",
		"VUB","TUB","BTB","ZTB","ATB","YTB",
		"IAA","JAA","EAA","DAA",
		"UVB","RVB","SVB","OVB","MTB","NUB","CAA","OUB","TVB",
		"NDG","KCG","DTB","HAA","ETB"
	];

	const purplePaths = [
		"CTB","KUB","GAA","FAA","KAA","LAA","GTB","XTB",
		"MCG","MAA","NBA","LCG",
		"JCG","FTB","OBA","PBA","JTB"
	];

	/* =========================
	   TOGGLE BUTTON
	   ========================= */

	function addToggleButton() {
		const container = document.querySelector(".leaflet-control-custom-wp");
		if (!container) return;

		const btn = document.createElement("button");
		btn.textContent = "OFF";
		btn.dataset.toggled = "false";

		Object.assign(btn.style, {
			width: "60px",
			height: "30px",
			position: "absolute",
			left: "50%",
			transform: "translateX(-50%)",
			bottom: "-50px",
			border: "none",
			borderRadius: "14px",
			color: "#fff",
			fontWeight: "bold",
			cursor: "pointer",
			backgroundImage:
				"linear-gradient(to right, #3498db 33%, #9b59b6 33% 66%, #e91e63 66%)"
		});

		btn.addEventListener("click", () => {
			const on = btn.dataset.toggled === "true";
			btn.dataset.toggled = on ? "false" : "true";
			btn.textContent = on ? "OFF" : "ON";
			togglePaths(!on);
		});

		container.appendChild(btn);
	}

	/* =========================
	   PATH COLORING + LABELS
	   ========================= */

	function togglePaths(turnOn) {
		document.querySelectorAll(".path-label").forEach(el => el.remove());

		const apply = (ids, color) => {
			ids.forEach(id => {
				const path = document.querySelector(`path[aria-label="${id}"]`);
				if (!path) return;

				if (turnOn) {
					path.style.fill = color;
					path.style.fillOpacity = "0.45";

					const bbox = path.getBBox();
					const label = document.createElementNS(
						"http://www.w3.org/2000/svg",
						"text"
					);

					label.setAttribute("x", bbox.x + bbox.width / 2);
					label.setAttribute("y", bbox.y + bbox.height / 2 + 4);
					label.setAttribute("text-anchor", "middle");
					label.setAttribute("class", "path-label");
					label.setAttribute("pointer-events", "none");
					label.setAttribute("fill", "#fff");
					label.style.fontSize = "10px";
					label.textContent = id;

					path.parentNode.appendChild(label);
				} else {
					path.style.fill = "";
					path.style.fillOpacity = "";
				}
			});
		};

		apply(bluePaths, "#3498db");
		apply(pinkPaths, "#e93e83");
		apply(purplePaths, "#7b3996");
	}

	/* =========================
	   WAIT FOR MAP CONTROLS
	   ========================= */

	const observer = new MutationObserver(() => {
		if (document.querySelector(".leaflet-control-custom-wp")) {
			addToggleButton();
			observer.disconnect();
		}
	});

	observer.observe(document.body, { childList: true, subtree: true });
})();
