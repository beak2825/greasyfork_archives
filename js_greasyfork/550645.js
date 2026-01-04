// ==UserScript==
// @name         GeoGuessr Random Pan and Zoom
// @description  Starts the game with a random pan and zoom
// @version      1.0
// @author       Rawblocky
// @match        *://*.geoguessr.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1435525
// @downloadURL https://update.greasyfork.org/scripts/550645/GeoGuessr%20Random%20Pan%20and%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/550645/GeoGuessr%20Random%20Pan%20and%20Zoom.meta.js
// ==/UserScript==

const SETTINGS = {
	heading: {
    // 0 to 360
		minValue: 0,
		maxValue: 360,
		enabled: true,
	},
	pitch: {
    // -90 to 90
		minValue: -45,
		maxValue: 45,
		enabled: true,
	},
	zoom: {
    // 1 to 4
		minValue: 1,
		maxValue: 4,
		enabled: true,
	},

	activateOnRoundStart: true,
	keybindEnabled: true, // binded to 'p'
};

let MWGTM_SV;

function getRandom(minValue, maxValue) {
	return Math.random() * (maxValue - minValue) + minValue;
}

function randomizePov() {
	if (!MWGTM_SV) return;
	const pov = MWGTM_SV.getPov();
	if (SETTINGS.heading.enabled) {
		pov.heading =
			getRandom(SETTINGS.heading.minValue, SETTINGS.heading.maxValue) % 360;
	}
	if (SETTINGS.pitch.enabled) {
		pov.pitch = getRandom(SETTINGS.pitch.minValue, SETTINGS.pitch.maxValue);
	}
	if (SETTINGS.zoom.enabled) {
		pov.zoom = getRandom(SETTINGS.zoom.minValue, SETTINGS.zoom.maxValue);
	}
	MWGTM_SV.setPov(pov);
}

function overrideOnLoad(googleScript, observer, overrider) {
	const oldOnload = googleScript.onload;
	googleScript.onload = (event) => {
		const google = window.google;
		if (google) {
			observer.disconnect();
			overrider(google);
		}
		if (oldOnload) {
			oldOnload.call(googleScript, event);
		}
	};
}

function grabGoogleScript(mutations) {
	for (const mutation of mutations) {
		for (const newNode of mutation.addedNodes) {
			const asScript = newNode;
			if (
				asScript &&
				asScript.src &&
				asScript.src.startsWith("https://maps.googleapis.com/")
			) {
				return asScript;
			}
		}
	}
	return null;
}

function injecter(overrider) {
	if (document.documentElement) {
		injecterCallback(overrider);
	}
}

function injecterCallback(overrider) {
	new MutationObserver((mutations, observer) => {
		const googleScript = grabGoogleScript(mutations);
		if (googleScript) {
			overrideOnLoad(googleScript, observer, overrider);
		}
	}).observe(document.documentElement, { childList: true, subtree: true });
}

function isLoading() {
	return (
		document.querySelector("[class*=fullscreen-spinner_root__]") ||
		document.querySelector("[class*=round-score-2_isMounted__]") ||
		document.querySelector("[class*=new-game-2_isAnimated__]") ||
		!document.querySelector(".widget-scene-canvas")
	);
}

let wasBackdropThereOrLoading = false;
function isBackdropThereOrLoading() {
	return (
		isLoading() || // loading
		document.querySelector("[class*=result-layout_root__]") || // classic
		document.querySelector("[class*=overlay_backdrop__]") || // duels / team duels
		document.querySelector("[class*=round-starting_wrapper____]") || // live challenges
		document.querySelector("[class*=popup_backdrop__]") || // BR
		document.querySelector("[class*=game-starting_container__]") ||
		document.querySelector("[class*=round-score_container__]") || // bullseye
		document.querySelector("[class*=overlay-modal_backlight__]")
	); // city streaks
}

document.addEventListener("DOMContentLoaded", (event) => {
	injecter(() => {
		const google = window["google"] || unsafeWindow["google"];
		if (!google) return;

		google.maps.StreetViewPanorama = class extends (
			google.maps.StreetViewPanorama
		) {
			constructor(...args) {
				super(...args);
				MWGTM_SV = this;
				randomizePov();
			}
		};
	});
});

if (SETTINGS.keybindEnabled) {
	document.addEventListener("keyup", (event) => {
		if (event.key === "p") {
			randomizePov();
		}
	});
}

let wasDuels = false;
let isFirstRound = false;

if (SETTINGS.activateOnRoundStart) {
	let observer = new MutationObserver((mutations) => {
		if (!MWGTM_SV) return;

		const isDuels =
			location.pathname.includes("duels/") ||
			location.pathname.includes("/multiplayer")
		if (isDuels != wasDuels) {
			wasDuels = isDuels;
			if (isDuels) {
				isFirstRound = true;
			}
		}

		if (isBackdropThereOrLoading()) {
			wasBackdropThereOrLoading = true;
			randomizePov();
			if (!isLoading());
		} else if (wasBackdropThereOrLoading) {
			wasBackdropThereOrLoading = false;
			if (isDuels && isFirstRound) {
        // First round of duels game doesn't get affected; delay
				isFirstRound = false;
				setTimeout(() => {
					randomizePov(true);
				}, 500);
			}
		}
	});

	observer.observe(document.body, {
		characterDataOldValue: false,
		subtree: true,
		childList: true,
		characterData: false,
	});
}