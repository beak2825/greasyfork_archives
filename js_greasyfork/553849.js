// ==UserScript==
// @name         Youtube Frontpage Filterer
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  Provides a somewhat easy way to filter/remove videos on the recommended page on youtube, using their own events instead of using a mutation observer
// @author       TetteDev
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553849/Youtube%20Frontpage%20Filterer.user.js
// @updateURL https://update.greasyfork.org/scripts/553849/Youtube%20Frontpage%20Filterer.meta.js
// ==/UserScript==


const ParseAbbrevNumber = (input) => {
	if (typeof input !== 'string') input = String(input);
	const str = input.trim().toUpperCase().replace(/,/g, '');
	const m = str.match(/^([0-9]*\.?[0-9]+)\s*([KMB])?$/);
	if (!m) return NaN;
	const n = parseFloat(m[1]); // use parseFloat even though the video viewcount text never contains decimal values, but might in the future?
	const mult = m[2] === 'K' ? 1e3 : m[2] === 'M' ? 1e6 : m[2] === 'B' ? 1e9 : 1;
	return n * mult;
};
const ParseVideoElementData = (element) => {
	const metaDataContainer = element.querySelector('.yt-lockup-view-model__metadata');
	if (!metaDataContainer) {
		return null;
	}

	const urlData = metaDataContainer.querySelector('.yt-lockup-view-model__content-image')?.href ?? metaDataContainer.querySelector('a').href;
	const titleData =
		  metaDataContainer.querySelector('.yt-lockup-metadata-view-model__heading-reset')?.getAttribute('title')
	      ?? (metaDataContainer.querySelector('.yt-lockup-metadata-view-model__title')?.getAttribute('aria-label')
		      ?? 'No Title');
	let uploaderData = 'No Uploader';
	let viewsData = 'No Views';
	let uploadDateData = 'No Upload Date';

	// This element contains the uploader, viewcount and upload date
	const innerMetaDataContainer = metaDataContainer.querySelector('yt-content-metadata-view-model');
	let tmp_0 = null;
	let _check = (tmp_0 = innerMetaDataContainer.querySelectorAll('.yt-content-metadata-view-model__metadata-row')).length == 2;
	if (_check) {
		const [uploaderElement, viewsAndDateElement] = tmp_0;
		uploaderData = uploaderElement?.innerText.trim() ?? 'No Uploader';

		let tmp_1 = null;
		_check = (tmp_1 = viewsAndDateElement.querySelectorAll('.yt-core-attributed-string')).length === 2;
		if (_check) {
			const [viewCountElement, uploadDateElement] = tmp_1;

			// This needs to be converted to a number
			viewsData = viewCountElement?.innerText.trim() ?? 'No Views';
			if (viewsData !== 'No Views') viewsData = ParseAbbrevNumber(viewsData.split(' ')[0]);

			// TODO: Figure out in which format we want the relative date in
			uploadDateData = uploadDateElement?.innerText.trim() ?? 'No Upload Date';
		}
	}

	let isMixData = titleData.startsWith('Mix -');
	let isWatchedData = element.querySelector('.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment')?.style.width === '100%' ?? false;

	// TODO: Better music detection
	const DetermineIsMusic = (titleData, uploaderData) => {
		if (uploaderData.toLowerCase().includes(' - topic')) {
			return true;
		}

		const musicKeywords = ['official video', 'official audio', 'lyric video', 'ft.', 'feat.'];
		if (musicKeywords.some(keyword => titleData.toLowerCase().includes(keyword))) {
			return true;
		}

		return false;
	};
	let isMusicData = DetermineIsMusic(titleData, uploaderData);

	return {
		url: urlData.trim(),
		title: titleData.trim(),
		uploader: uploaderData.trim(),
		views: viewsData,
		uploadDateRelative: uploadDateData,

		isMix: isMixData,
		isWatched: isWatchedData,
		isMusic: isMusicData,
	};
};

// Dont edit these (or do it im not your mom)
const ParsedAttribute = 'data-parsed';
const HideCssClassName = 'hidden-video';

// Edit these to your likings
// Must be valid CSS
const HideCss = 'display: none !important;';
// Hide videos based on the uploader, case sensitive
const HiddenUploaders = [];
// Hide videos containing some words in their title, case insensitive
const HiddenTitleSubstrings = [];
// Hide videos you have watched fully
const HideWatchedVideos = false;
// Videos with less than this amount will be hidden, -1 disables this feature
const HiddenViewCountThreshhold = -1;

const OnPageUpdated = (e) => {
	const action = e.detail.actionName;
	const targetActions = ['ytd-update-grid-state-action','yt-rich-grid-resize-observed','yt-append-continuation-items-action'];
	if (targetActions.includes(action)) {
		['ytd-rich-item-renderer'].forEach(selector => {
			const elements = document.querySelectorAll(selector);
			elements.forEach(element => {
				if (element.hasAttribute(ParsedAttribute)) return;
				if (element.classList.contains(HideCssClassName)) return;

				const data = ParseVideoElementData(element);
				if (data !== null) {
					let shouldFilter = false;
					shouldFilter ||= (HiddenUploaders.length > 0 ? HiddenUploaders.includes(data.uploader) : false);
					shouldFilter ||= (HideWatchedVideos && data.isWatched);
					shouldFilter ||= HiddenTitleSubstrings.length > 0 ? HiddenTitleSubstrings.some(substring => data.title.toLowerCase().includes(substring)) : false;
					shouldFilter ||= (data.views !== 'No Views' && data.views < HiddenViewCountThreshhold);

					// Prevent youtube mixes and music from being hidden
					shouldFilter &&= !data.isMusic;
					shouldFilter &&= !data.isMix;
					if (shouldFilter) {
						element.classList.add(HideCssClassName);
					}
				}

				element.setAttribute(ParsedAttribute, 'true');
			});
		});
	}

};

const FilteringDisabled =
	  HiddenUploaders.length === 0 &&
	  HiddenTitleSubstrings.length === 0 &&
	  !HideWatchedVideos &&
	  HiddenViewCountThreshhold === -1;

if (!FilteringDisabled) {
	GM_addStyle(`
        .${HideCssClassName} { ${HideCss} }
    `);
	window.addEventListener('yt-action', OnPageUpdated, { passive: true });
}