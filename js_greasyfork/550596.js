// ==UserScript==
// @name         YT固定畫質與劇院模式
// @name:zh-TW   YT固定畫質與劇院模式
// @author       RKO
// @description          自動記住並套用 YouTube 影片畫質設定，並自動切換到劇院模式。
// @description:zh-TW    自動記住並套用 YouTube 影片畫質設定，並自動切換到劇院模式。
// @version      1.0
// @match        https://www.youtube.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @license MIT
// @namespace https://greasyfork.org/users/1519020
// @downloadURL https://update.greasyfork.org/scripts/550596/YT%E5%9B%BA%E5%AE%9A%E7%95%AB%E8%B3%AA%E8%88%87%E5%8A%87%E9%99%A2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/550596/YT%E5%9B%BA%E5%AE%9A%E7%95%AB%E8%B3%AA%E8%88%87%E5%8A%87%E9%99%A2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(async function () {
	'use strict';

	const QUALITY_KEY = 'videoQuality';
	const DEFAULT_QUALITY = 1;
	let vidQuality = await GM.getValue(QUALITY_KEY, DEFAULT_QUALITY);
	let player = null;

	document.addEventListener('yt-player-updated', () => {
		if (/^\/(watch|live)/.test(location.pathname)) {
			initQualitySetting();
			enterTheaterMode();
		}
	});

	async function initQualitySetting() {
		const settingsBtn = document.querySelector('.ytp-settings-button');
		if (!settingsBtn) return;

		// 等待設定按鈕可點擊
		await waitFor(() => settingsBtn.offsetParent !== null, 1000);
		settingsBtn.click();

		// 等待畫質選項出現
		await waitFor(() => document.querySelector('.ytp-menuitem-label'), 1000);
		const qualityBtn = Array.from(document.querySelectorAll('.ytp-menuitem-label'))
			.find(el => el.textContent.includes('畫質') || el.textContent.includes('Quality'));
		if (!qualityBtn) {
			detectVideoStart();
			return;
		}

		qualityBtn.click();

		await waitFor(() => document.querySelector('.ytp-quality-menu'), 1000);
		const qualityOptions = Array.from(document.querySelectorAll('.ytp-quality-menu .ytp-menuitem'))
			.filter(opt => !opt.querySelector('.ytp-premium-label'));

		if (qualityOptions.length === 0) return;

		const targetIndex = Math.max(0, qualityOptions.length - vidQuality);
		qualityOptions[targetIndex].click();

		qualityOptions.forEach((opt, i) => {
			opt.addEventListener('click', () => {
				GM.setValue(QUALITY_KEY, qualityOptions.length - i);
			});
		});

		// 關閉設定選單
		settingsBtn.click();
	}

	function enterTheaterMode() {
		const theaterBtn = document.querySelector('button[title="Theater mode"]') ||
		                  document.querySelector('button[aria-label*="劇院模式"]') ||
		                  document.querySelector('button[aria-label*="Theater mode"]');
		if (theaterBtn && !document.body.classList.contains('ytp-big-mode')) {
			theaterBtn.click();
		}
	}

	function detectVideoStart() {
		if (player) return;

		player = document.getElementById('movie_player');
		if (!player) return;

		const observer = new MutationObserver(mutations => {
			for (const mutation of mutations) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					if (!player.classList.contains('unstarted-mode')) {
						observer.disconnect();
						initQualitySetting();
						enterTheaterMode();
					}
				}
			}
		});

		observer.observe(player, { attributes: true });
	}

	function waitFor(conditionFn, timeout = 2000) {
		return new Promise((resolve, reject) => {
			const interval = 100;
			let elapsed = 0;
			const timer = setInterval(() => {
				if (conditionFn()) {
					clearInterval(timer);
					resolve();
				} else if ((elapsed += interval) >= timeout) {
					clearInterval(timer);
					reject();
				}
			}, interval);
		});
	}
})();