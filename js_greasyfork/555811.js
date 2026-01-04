// ==UserScript==
// @name         One-Ear Audio
// @namespace    0x539.BiStereo
// @version      0.1.1
// @description  Force audio to play in one ear
// @author       The0x539
// @match        *://*.twitch.tv/*
// @match        *://*.youtube.com/*
// @grant        GM.registerMenuCommand
// @grant        GM.unregisterMenuCommand
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/555811/One-Ear%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/555811/One-Ear%20Audio.meta.js
// ==/UserScript==

'use strict';

class Reroute {
	constructor(element) {
		this.element = element;
		this.ctx = new AudioContext();

		this.source = this.ctx.createMediaElementSource(this.element);
		this.split = this.ctx.createChannelSplitter(2);
		this.merge = this.ctx.createChannelMerger(2);

		this.source.connect(this.split);
		this.setSide(null);
		this.merge.connect(this.ctx.destination);
	}

	setSide(side) {
		this.split.disconnect();
		this.split.connect(this.merge, 0, side ?? 0);
		this.split.connect(this.merge, 1, side ?? 1);
	}
}

const reroutes = new Map();
const getReroute = (element) => {
	if (!reroutes.has(element)) {
		reroutes.set(element, new Reroute(element));
	}
	return reroutes.get(element);
}

let setupDone = false;
let currentSide = null;

function applyToPage(side) {
	currentSide = side;

	if (setupDone) {
		for (const reroute of reroutes.values()) {
			reroute.setSide(currentSide);
		}
		return;
	} else {
		setupDone = true;
	}

	const rerouteAll = () => {
		for (const element of document.querySelectorAll('video')) {
			getReroute(element).setSide(currentSide);
		}
	};

	rerouteAll();

	// TODO: a way to deactivate the full page override, disconnecting this observer
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
				rerouteAll();
			}
		});
	});

	observer.observe(document.body, { childList: true, subtree: true });
}

GM.registerMenuCommand('Page -> Left', () => applyToPage(0));
GM.registerMenuCommand('Page -> Stereo', () => applyToPage(null));
GM.registerMenuCommand('Page -> Right', () => applyToPage(1));
