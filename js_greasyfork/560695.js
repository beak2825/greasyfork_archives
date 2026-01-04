// ==UserScript==
// @name         SpotubeDL - Awesome Spotify Downloader
// @description  Download Spotify Tracks, Albums, Playlists as MP3/OGG/OPUS with High Quality.
// @namespace    https://spotubedl.com/
// @supportURL   https://spotubedl.com/
// @homepageURL  https://spotubedl.com/
// @version      1.1
// @author       afkarxyz
// @match        *://open.spotify.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGJjN2QiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBzdHJva2U9Im5vbmUiIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMyAxN2EzIDMgMCAxIDAgNiAwYTMgMyAwIDAgMCAtNiAwIiAvPjxwYXRoIGQ9Ik05IDE3di0xM2gxMHY4IiAvPjxwYXRoIGQ9Ik05IDhoMTAiIC8+PHBhdGggZD0iTTE5IDE2djYiIC8+PHBhdGggZD0iTTIyIDE5bC0zIDNsLTMgLTMiIC8+PC9zdmc+
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560695/SpotubeDL%20-%20Awesome%20Spotify%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/560695/SpotubeDL%20-%20Awesome%20Spotify%20Downloader.meta.js
// ==/UserScript==

const BASE_URL = 'https://spotubedl.com';

const style = document.createElement('style');

style.innerText = `

[role='grid'] {
	margin-left: 50px;
}

[data-testid='tracklist-row'] {
	position: relative;
}

[role="presentation"] > * {
	contain: unset;
}

.spotubedl-btn {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	border: 0;
	background-color: #00bc7d !important;
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M9 17v-13h10v8" /><path d="M9 8h10" /><path d="M19 16v6" /><path d="M22 19l-3 3l-3 -3" /></svg>') !important;
	background-position: center !important;
	background-repeat: no-repeat !important;
	background-size: 20px 20px !important;
	cursor: pointer;
	box-shadow: 0 4px 12px rgba(0, 188, 125, 0.3);
	transition: transform 0.2s ease;
	position: relative;
}

.spotubedl-btn:hover {
	transform: scale(1.05);
	background-color: #009a6a !important;
}

.spotubedl-btn:active {
	transform: scale(0.95);
}

[data-testid='tracklist-row'] .spotubedl-btn {
	position: absolute;
	top: 50%;
	right: 100%;
	margin-top: -20px;
	margin-right: 10px;
}

.spotubedl-tooltip {
	position: absolute;
	background: #1f2937;
	color: white;
	padding: 8px 12px;
	border-radius: 8px;
	font-size: 13px;
	font-weight: 500;
	white-space: nowrap;
	pointer-events: none;
	opacity: 0;
	transition: opacity 0.2s ease, transform 0.2s ease;
	z-index: 9999;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
	border: 1px solid rgba(0, 188, 125, 0.3);
}

.spotubedl-btn:hover .spotubedl-tooltip {
	opacity: 1;
}

[data-testid='tracklist-row'] .spotubedl-tooltip {
	left: calc(100% + 12px);
	top: 50%;
	transform: translateY(-50%) translateX(-10px);
}

[data-testid='tracklist-row'] .spotubedl-tooltip::before {
	content: '';
	position: absolute;
	left: -4px;
	top: 50%;
	transform: translateY(-50%) rotate(45deg);
	width: 8px;
	height: 8px;
	background: #1f2937;
	border-left: 1px solid rgba(0, 188, 125, 0.3);
	border-bottom: 1px solid rgba(0, 188, 125, 0.3);
}

[data-testid='tracklist-row'] .spotubedl-btn:hover .spotubedl-tooltip {
	transform: translateY(-50%) translateX(0);
}

[data-testid='action-bar-row'] .spotubedl-tooltip {
	right: calc(100% + 12px);
	top: 50%;
	transform: translateY(-50%) translateX(10px);
}

[data-testid='action-bar-row'] .spotubedl-tooltip::before {
	content: '';
	position: absolute;
	right: -4px;
	top: 50%;
	transform: translateY(-50%) rotate(45deg);
	width: 8px;
	height: 8px;
	background: #1f2937;
	border-right: 1px solid rgba(0, 188, 125, 0.3);
	border-top: 1px solid rgba(0, 188, 125, 0.3);
}

[data-testid='action-bar-row'] .spotubedl-btn:hover .spotubedl-tooltip {
	transform: translateY(-50%) translateX(0);
}

[data-testid='action-bar-row'] .spotubedl-btn.track-page .spotubedl-tooltip {
	left: calc(100% + 12px);
	right: auto;
	transform: translateY(-50%) translateX(-10px);
}

[data-testid='action-bar-row'] .spotubedl-btn.track-page .spotubedl-tooltip::before {
	left: -4px;
	right: auto;
	border-left: 1px solid rgba(0, 188, 125, 0.3);
	border-bottom: 1px solid rgba(0, 188, 125, 0.3);
	border-right: none;
	border-top: none;
}

[data-testid='action-bar-row'] .spotubedl-btn.track-page:hover .spotubedl-tooltip {
	transform: translateY(-50%) translateX(0);
}

`;

document.body.appendChild(style);

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function addButtonsToTracks() {
	const tracks = document.querySelectorAll('[data-testid="tracklist-row"]');

	for (let i = 0; i < tracks.length; i++) {
		const track = tracks[i];

		if (!track.hasButton) {
			addButton(track, 'Download Track').onclick = async function () {
				const btn = track.querySelector('[data-testid="more-button"]');
				btn.click();

				await sleep(100);

				const highlight = document.querySelector('#context-menu a[href*="highlight"]')?.href.match(/highlight=(.+)/)?.[1];

				document.dispatchEvent(new MouseEvent('mousedown'));

				if (highlight) {
					const url = 'https://open.' + highlight.replace(':', '.com/').replace(':', '/');
					download(url);
				}
			}
		}
	}
}

function addButtonToActionBar() {
	const actionBarRow = document.querySelector('[data-testid="action-bar-row"]:last-of-type');

	if (actionBarRow && !actionBarRow.hasButton) {
		const isPlaylist = window.location.href.includes('/playlist/');
		const isAlbum = window.location.href.includes('/album/');
		const isTrack = window.location.href.includes('/track/');
		
		const tooltipText = isPlaylist ? 'Download Playlist' : isAlbum ? 'Download Album' : isTrack ? 'Download Track' : 'Download Track';

		const button = addButton(actionBarRow, tooltipText);
		
		if (isTrack) {
			button.classList.add('track-page');
		}
		
		button.onclick = function () {
			download(window.location.href);
		}
	}
}

function download(link) {
	const trackMatch = link.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
	const albumMatch = link.match(/spotify\.com\/album\/([a-zA-Z0-9]+)/);
	const playlistMatch = link.match(/spotify\.com\/playlist\/([a-zA-Z0-9]+)/);

	let targetUrl = BASE_URL;

	if (trackMatch) {
		targetUrl = `${BASE_URL}/userscript/track/${trackMatch[1]}`;
	} else if (albumMatch) {
		targetUrl = `${BASE_URL}/userscript/album/${albumMatch[1]}`;
	} else if (playlistMatch) {
		targetUrl = `${BASE_URL}/userscript/playlist/${playlistMatch[1]}`;
	} else {
		targetUrl = `${BASE_URL}/?link=${encodeURIComponent(link)}`;
	}

	window.open(targetUrl, '_blank');
}

function addButton(el, tooltipText) {
	const button = document.createElement('button');

	button.className = 'spotubedl-btn';

	const tooltip = document.createElement('span');
	tooltip.className = 'spotubedl-tooltip';
	tooltip.textContent = tooltipText;
	button.appendChild(tooltip);

	el.appendChild(button);

	el.hasButton = true;

	return button;
}

addButtonsToTracks();
addButtonToActionBar();

const observer = new MutationObserver(() => {
	addButtonsToTracks();
	addButtonToActionBar();
});

observer.observe(document.body, {
	childList: true,
	subtree: true
});

let lastUrl = location.href;
new MutationObserver(() => {
	const url = location.href;
	if (url !== lastUrl) {
		lastUrl = url;
		setTimeout(() => {
			addButtonsToTracks();
			addButtonToActionBar();
		}, 500);
	}
}).observe(document.querySelector('body'), { subtree: true, childList: true });