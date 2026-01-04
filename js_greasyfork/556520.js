// ==UserScript==
// @name         Blubbled's UI Mod Reborn
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  A useful UI mod for suroi.io
// @author       Generated
// @match        https://1v1.suroi.io/*
// @match        https://suroi.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556520/Blubbled%27s%20UI%20Mod%20Reborn.user.js
// @updateURL https://update.greasyfork.org/scripts/556520/Blubbled%27s%20UI%20Mod%20Reborn.meta.js
// ==/UserScript==



(function() {
	'use strict';


	var LS_KEY_FPS = 'mod_custom_fps_cap';
	var LS_KEY_FPS_ENABLED = 'mod_custom_fps_enabled';
	var LS_KEY_FPS_UNCAPPED = 'mod_fps_uncapped';
	var LS_KEY_SHOW_KILLS = 'mod_show_kill_counter';
	var LS_KEY_TEXT_COLOR = 'mod_text_color';
	var LS_KEY_TEXT_COLOR_ENABLED = 'mod_custom_text_color_enabled';
	var LS_KEY_BG_ENABLED = 'mod_bg_enabled';
	var LS_KEY_BG_URL = 'mod_bg_url';
	var LS_KEY_EXTRA_INFO_ENABLED = 'mod_extra_info_enabled';
	var LS_KEY_EXTRA_INFO_MODE = 'mod_extra_info_mode';
	var LS_KEY_EXTRA_FONT_SIZE = 'mod_extra_font_size';
	var LS_KEY_EXTRA_OFFSET = 'mod_extra_offset';
	var LS_KEY_THEME = 'mod_theme_preference';
	var LS_KEY_PANEL_POS = 'mod_panel_pos';
	var LS_KEY_PANEL_SIZE = 'mod_panel_size';


	var SCRIPT_VERSION = '1.0';


	var THEME_DARK = 'dark';
	var THEME_LIGHT = 'light';
	var themeStyleEl = null;

	function ensureThemeStyle() {
		if (!themeStyleEl) {
			themeStyleEl = document.createElement('style');
			themeStyleEl.id = 'mod-theme-style';
			document.head.appendChild(themeStyleEl);
		}
		themeStyleEl.textContent =
			'#mod-settings-panel { transition: background-color 220ms ease, color 220ms ease; }' +
			'#mod-panel-resize-handle { transition: background 220ms ease, opacity 150ms ease; }' +
			'#mod-settings-panel.theme-dark { background:#0b1220 !important; color:#fff !important; }' +
			'#mod-settings-panel.theme-light { background:#f7f9fc !important; color:#0b1220 !important; }' +
			'#mod-settings-panel.theme-dark *:not(button):not(input):not(select):not(textarea) { color:#fff !important; }' +
			'#mod-settings-panel.theme-light *:not(button):not(input):not(select):not(textarea) { color:#0b1220 !important; }' +
			'#mod-settings-panel.theme-light input, #mod-settings-panel.theme-light textarea, #mod-settings-panel.theme-light select { background:#ffffff; color:#0b1220; }' +
			'#mod-settings-panel.theme-dark input, #mod-settings-panel.theme-dark textarea, #mod-settings-panel.theme-dark select { background:#0d1c3a; color:#fff; }';
	}

	function getStoredTheme() {
		var stored = localStorage.getItem(LS_KEY_THEME);
		if (stored === THEME_LIGHT || stored === THEME_DARK) return stored;
		return THEME_DARK;
	}

	function applyTheme(theme, btn, panelOverride) {
		var selected = (theme === THEME_LIGHT) ? THEME_LIGHT : THEME_DARK;
		ensureThemeStyle();
		var panelEl = panelOverride || document.getElementById('mod-settings-panel');
		if (panelEl) {
			panelEl.classList.remove('theme-light', 'theme-dark');
			panelEl.classList.add('theme-' + selected);
		}
		var resizeHandleEl = document.getElementById('mod-panel-resize-handle');
		if (resizeHandleEl) {
			if (selected === THEME_LIGHT) {
				resizeHandleEl.style.background = 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.4) 50%)';
			} else {
				resizeHandleEl.style.background = 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.35) 50%)';
			}
		}
		if (btn) {
			btn.textContent = (selected === THEME_LIGHT) ? '🌙' : '☀';
			btn.title = (selected === THEME_LIGHT) ? 'Switch to dark mode' : 'Switch to light mode';
		}
		try { localStorage.setItem(LS_KEY_THEME, selected); } catch (e) {}
		return selected;
	}


	var originalRequestAnimationFrame = window.requestAnimationFrame.bind(window);


	function applyFpsCap(value) {

		if (!value || value === 0) {

			window.requestAnimationFrame = originalRequestAnimationFrame;
			return;
		}

		if (value >= 601) {

			window.requestAnimationFrame = function(callback) {
				return setTimeout(function() {
					try { callback(performance.now()); }
					catch (e) { setTimeout(function() { throw e; }, 0); }
				}, 1);
			};
			return;
		}


		try {
			var TARGET_FPS = parseInt(value, 10);
			if (!TARGET_FPS || TARGET_FPS <= 0) {
				window.requestAnimationFrame = originalRequestAnimationFrame;
				return;
			}
			var FRAME_TIME = 1000 / TARGET_FPS;
			var realRAF = originalRequestAnimationFrame;
			var lastFrameTime = 0;

			window.requestAnimationFrame = function(callback) {
				function wrapped(now) {
					if (!lastFrameTime) lastFrameTime = now;
					if (now - lastFrameTime >= FRAME_TIME) {
						lastFrameTime = now;
						try { callback(now); } catch (e) { setTimeout(function(){ throw e; }, 0); }
					} else {

						realRAF(wrapped);
					}
				}
				return realRAF(wrapped);
			};
		} catch (e) {
			console.warn('[Mod] applyFpsCap error', e);
			window.requestAnimationFrame = originalRequestAnimationFrame;
		}
	}


	function forceKillCounterPosition(el) {
		if (!el) return;
		var holder = el.parentElement;
		if (!holder || holder.id !== 'counter-holder') {
			holder = document.getElementById('counter-holder');
			if (holder && el.parentElement !== holder) holder.appendChild(el);
		}
		if (holder) {
			holder.style.position = 'fixed';
			holder.style.top = '10px';
			holder.style.right = '10px';
			holder.style.left = '';
			holder.style.margin = '0';
			holder.style.display = 'flex';
			holder.style.flexDirection = 'column';
			holder.style.alignItems = 'flex-end';
			holder.style.justifyContent = 'flex-start';
			holder.style.gap = '6px';
			holder.style.width = 'auto';
			holder.style.pointerEvents = 'none';
			Array.from(holder.children).forEach(function(child) {
				child.style.pointerEvents = 'auto';
			});
			var playerCounter = holder.querySelector('.counter-text#ui-players-alive');
			if (playerCounter && playerCounter.parentElement && playerCounter.parentElement.classList.contains('counter')) {
				playerCounter.parentElement.style.order = '1';
			}
		}
		el.style.order = '2';
		el.style.position = '';
		el.style.top = '';
		el.style.right = '';
		el.style.left = '';
		el.style.margin = '0';
	}

	function ensureKillCounterShown(enabled) {
		if (!enabled) return removeForcedKillCounter();

		var existing = document.getElementById('kill-counter');
		if (!existing) {

			var container = document.createElement('div');
			container.className = 'counter';
			container.id = 'kill-counter';
			container.style.display = 'flex';
			container.style.alignItems = 'center';
			container.style.position = '';
			container.style.top = '';
			container.style.right = '';
			container.style.zIndex = '9999';
			container.style.left = '';
			container.style.margin = '0';

			var img = document.createElement('img');
			img.src = './img/misc/skull_icon.svg';
			img.style.marginRight = '5px';

			var inner = document.createElement('div');
			inner.className = 'counter-text';
			inner.id = 'ui-kills';
			inner.style.minWidth = '30px';
			inner.textContent = '0';

			container.appendChild(img);
			container.appendChild(inner);

			container.dataset.__mod_created = 'true';
			var holder = document.getElementById('counter-holder') || document.body;
			holder.appendChild(container);
			forceKillCounterPosition(container);
		} else {
			existing.style.display = 'flex';
			existing.style.alignItems = 'center';
			forceKillCounterPosition(existing);

		}
	}

	function removeForcedKillCounter() {
		var existing = document.getElementById('kill-counter');
		if (!existing) return;

		try {
			existing.style.display = 'none';
		} catch (e) {

		}
	}




	var killCounterObserver = null;
	var killCounterInterval = null;

	function startKillCounterEnforcer() {
		if (killCounterInterval) return;
		killCounterInterval = setInterval(function() {
			try {
				var show = localStorage.getItem(LS_KEY_SHOW_KILLS) === 'true';
				if (!show) return;
				var el = document.getElementById('kill-counter');
				if (!el) {

					ensureKillCounterShown(true);
				} else {

					el.style.display = 'flex';
					el.style.alignItems = 'center';
					forceKillCounterPosition(el);
				}
			} catch (e) {

			}
		}, 100);
	}

	function stopKillCounterEnforcer() {
		if (killCounterInterval) {
			clearInterval(killCounterInterval);
			killCounterInterval = null;
		}
	}

	function startKillCounterWatcher() {
		if (killCounterObserver) return;
		killCounterObserver = new MutationObserver(function(muts) {
			muts.forEach(function(m) {
				if (m.addedNodes) {
					m.addedNodes.forEach(function(node) {
						if (node && node.id === 'kill-counter') {
							var show = localStorage.getItem(LS_KEY_SHOW_KILLS) === 'true';
							if (show) {

								node.style.display = 'flex';
								node.style.alignItems = 'center';
								forceKillCounterPosition(node);
							} else {
								node.style.display = 'none';
							}
						}
					});
				}
			});
		});
		killCounterObserver.observe(document.body, { childList: true, subtree: true });
	}


	var TEXT_COLOR_SELECTORS = ['.item-count', '#fps-counter', '#coordinates-hud', '#ping-counter', '.counter-text', '.item-name', '#ui-kills'];
	var textColorObserver = null;
	var textColorStyleEl = null;

	function setTextColorStyle(color) {
		if (!color) return;
		try {
			if (!textColorStyleEl) {
				textColorStyleEl = document.createElement('style');
				textColorStyleEl.id = 'mod-text-color-style';
				document.head.appendChild(textColorStyleEl);
			}
			var selectors = TEXT_COLOR_SELECTORS.join(',');



			textColorStyleEl.textContent = selectors + ' { color: ' + color + ' !important; } ' +
				'#mod-settings-panel * { color: inherit; }';
		} catch (e) { console.warn('[Mod] setTextColorStyle error', e); }
	}

	function removeTextColorStyle() {
		try {
			if (textColorStyleEl && textColorStyleEl.parentNode) {
				textColorStyleEl.parentNode.removeChild(textColorStyleEl);
			}
			textColorStyleEl = null;
		} catch (e) { console.warn('[Mod] removeTextColorStyle error', e); }
	}

	function applyCustomTextColor(color) {

		setTextColorStyle(color);
	}

	function disableCustomTextColor() {
		removeTextColorStyle();
	}


		var bgObserver = null;
		var bgStyleEl = null;

		function setGlobalBgStyle(url) {
			if (!url) return;
			try {
				if (!bgStyleEl) {
					bgStyleEl = document.createElement('style');
					bgStyleEl.id = 'mod-custom-bg-style';
					document.head.appendChild(bgStyleEl);
				}
				var targets = ['html','body','#game','#menu','#menu-bg','#menu-background','#main-menu','#splash-ui'];
				var selector = targets.join(', ');
				bgStyleEl.textContent = selector + ' { background-image: url("' + url + '") !important; background-size: cover !important; background-repeat: no-repeat !important; background-position: center center !important; }';
			} catch (e) { console.warn('[Mod] setGlobalBgStyle error', e); }
		}

		function clearGlobalBgStyle() {
			try {
				if (bgStyleEl && bgStyleEl.parentNode) bgStyleEl.parentNode.removeChild(bgStyleEl);
				bgStyleEl = null;
			} catch (e) { console.warn('[Mod] clearGlobalBgStyle error', e); }
		}

		function applyGameBackground(url) {
			try {
				if (!url) return;

				setGlobalBgStyle(url);
				var gameEl = document.getElementById('game');
				if (!gameEl) return;

				if (!gameEl.dataset.__mod_original_bg) {

					var currentBg = gameEl.style.backgroundImage && gameEl.style.backgroundImage !== '' ? gameEl.style.backgroundImage : window.getComputedStyle(gameEl).backgroundImage || 'none';
					var currentSize = gameEl.style.backgroundSize && gameEl.style.backgroundSize !== '' ? gameEl.style.backgroundSize : window.getComputedStyle(gameEl).backgroundSize || '';
					var currentPos = gameEl.style.backgroundPosition && gameEl.style.backgroundPosition !== '' ? gameEl.style.backgroundPosition : window.getComputedStyle(gameEl).backgroundPosition || '';
					var currentRepeat = gameEl.style.backgroundRepeat && gameEl.style.backgroundRepeat !== '' ? gameEl.style.backgroundRepeat : window.getComputedStyle(gameEl).backgroundRepeat || '';
					gameEl.dataset.__mod_original_bg = currentBg;
					gameEl.dataset.__mod_original_bg_size = currentSize;
					gameEl.dataset.__mod_original_bg_pos = currentPos;
					gameEl.dataset.__mod_original_bg_repeat = currentRepeat;
				}
				var orig = gameEl.dataset.__mod_original_bg || 'none';

				var custom = 'url("' + url + '")';
				var combined = custom + (orig && orig !== 'none' ? (', ' + orig) : '');
				gameEl.style.backgroundImage = combined;

				var origSize = gameEl.dataset.__mod_original_bg_size || '';
				var origPos = gameEl.dataset.__mod_original_bg_pos || '';
				var origRepeat = gameEl.dataset.__mod_original_bg_repeat || '';
				var sizeCombined = 'cover' + (origSize ? (', ' + origSize) : '');
				var posCombined = 'center' + (origPos ? (', ' + origPos) : '');
				var repeatCombined = 'no-repeat' + (origRepeat ? (', ' + origRepeat) : '');
				gameEl.style.backgroundSize = sizeCombined;
				gameEl.style.backgroundPosition = posCombined;
				gameEl.style.backgroundRepeat = repeatCombined;
			} catch (e) { console.warn('[Mod] applyGameBackground error', e); }
		}

		function removeGameBackground() {
			try {
				clearGlobalBgStyle();
				var gameEl = document.getElementById('game');
				if (!gameEl) return;

				if (gameEl.dataset.__mod_original_bg) {
					gameEl.style.backgroundImage = gameEl.dataset.__mod_original_bg || '';
					if (gameEl.dataset.__mod_original_bg_size) gameEl.style.backgroundSize = gameEl.dataset.__mod_original_bg_size;
					if (gameEl.dataset.__mod_original_bg_pos) gameEl.style.backgroundPosition = gameEl.dataset.__mod_original_bg_pos;
					if (gameEl.dataset.__mod_original_bg_repeat) gameEl.style.backgroundRepeat = gameEl.dataset.__mod_original_bg_repeat;
					delete gameEl.dataset.__mod_original_bg;
					delete gameEl.dataset.__mod_original_bg_size;
					delete gameEl.dataset.__mod_original_bg_pos;
					delete gameEl.dataset.__mod_original_bg_repeat;
				} else {
					gameEl.style.backgroundImage = '';
					gameEl.style.backgroundSize = '';
					gameEl.style.backgroundPosition = '';
					gameEl.style.backgroundRepeat = '';
				}
			} catch (e) { console.warn('[Mod] removeGameBackground error', e); }
		}

		function startBgWatcher(url) {
			if (bgObserver) return;
			bgObserver = new MutationObserver(function(muts) {
				muts.forEach(function(m) {
					if (m.addedNodes && m.addedNodes.length) {
						for (var i=0;i<m.addedNodes.length;i++) {
							var n = m.addedNodes[i];
							if (n && n.id === 'game') {
								if (localStorage.getItem(LS_KEY_BG_ENABLED) === 'true') applyGameBackground(localStorage.getItem(LS_KEY_BG_URL) || url);
							}
						}
					}
				});
			});
			bgObserver.observe(document.body, { childList: true, subtree: true });
		}

		function stopBgWatcher() {
			if (bgObserver) {
				try { bgObserver.disconnect(); } catch (e) {}
				bgObserver = null;
			}
		}

	function startTextColorWatcher(color) {

		if (textColorObserver) return;
		textColorObserver = new MutationObserver(function(muts) {
			muts.forEach(function(m) {
				if (m.addedNodes && m.addedNodes.length) {

					if (!textColorStyleEl) setTextColorStyle(color);
				}
			});
		});
		textColorObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });
	}


	var DEFAULT_EXTRA_FONT_SIZE = 14;
	var MIN_EXTRA_FONT_SIZE = 10;
	var MAX_EXTRA_FONT_SIZE = 32;
	var DEFAULT_EXTRA_OFFSET = 28;
	var MIN_EXTRA_OFFSET = 12;
	var MAX_EXTRA_OFFSET = 80;

	function clampExtraFontSize(val) {
		var n = parseInt(val, 10);
		if (isNaN(n)) return DEFAULT_EXTRA_FONT_SIZE;
		return Math.min(Math.max(n, MIN_EXTRA_FONT_SIZE), MAX_EXTRA_FONT_SIZE);
	}

	function getExtraFontSize() {
		var stored = parseInt(localStorage.getItem(LS_KEY_EXTRA_FONT_SIZE) || '', 10);
		if (isNaN(stored)) return DEFAULT_EXTRA_FONT_SIZE;
		return clampExtraFontSize(stored);
	}

	function setExtraFontSize(val) {
		var clamped = clampExtraFontSize(val);
		try { localStorage.setItem(LS_KEY_EXTRA_FONT_SIZE, clamped); } catch (e) {}
		if (extraInfoEl) extraInfoEl.style.fontSize = clamped + 'px';
		return clamped;
	}

	function clampExtraOffset(val) {
		var n = parseInt(val, 10);
		if (isNaN(n)) return DEFAULT_EXTRA_OFFSET;
		return Math.min(Math.max(n, MIN_EXTRA_OFFSET), MAX_EXTRA_OFFSET);
	}

	function getExtraOffset() {
		var stored = parseInt(localStorage.getItem(LS_KEY_EXTRA_OFFSET) || '', 10);
		if (isNaN(stored)) return DEFAULT_EXTRA_OFFSET;
		return clampExtraOffset(stored);
	}

	function setExtraOffset(val) {
		var clamped = clampExtraOffset(val);
		try { localStorage.setItem(LS_KEY_EXTRA_OFFSET, clamped); } catch (e) {}
		return clamped;
	}

	var extraInfoEl = null;
	var extraInfoMouseHandler = null;
	var extraInfoPointerHandler = null;
	var extraInfoInterval = null;
	var extraInfoContentInterval = null;
	var extraInfoHealthMirror = null;
	var extraInfoHealthObserver = null;
	var extraInfoHealthBarObserver = null;
	var extraInfoAdrenalineMirror = null;
	var extraInfoAdrenalineAmountObserver = null;
	var extraInfoAdrenalineBarObserver = null;
	var extraInfoWrap = null;
	var extraInfoDomObserver = null;
	var healthLogInterval = null;
	var adrenalineLogInterval = null;
	var weaponLogInterval = null;
	var lastWeaponName = '';
	var lastWeaponSlotId = '';
	var extraInfoHpNode = null;
	var extraInfoAdrNode = null;
	var extraInfoAmmoNode = null;
	var extraInfoWeaponNode = null;
	var extraInfoAnchor = { x: 0, y: 0 };

	function createExtraInfoOverlay() {
		if (extraInfoEl) return extraInfoEl;
		var wrapper = document.createElement('div');
		wrapper.id = 'mod-extra-info';
		wrapper.style.position = 'fixed';
		wrapper.style.left = '0';
		wrapper.style.top = '0';
		wrapper.style.width = '100%';
		wrapper.style.height = '100%';
		wrapper.style.pointerEvents = 'none';
		wrapper.style.zIndex = '99998';
		wrapper.style.padding = '6px 8px';
		wrapper.style.background = 'transparent';
		wrapper.style.color = '#fff';
		wrapper.style.fontWeight = '700';
		wrapper.style.fontSize = getExtraFontSize() + 'px';
	wrapper.style.borderRadius = '';
	wrapper.style.boxShadow = 'none';
		wrapper.textContent = 'Extra Info';

		var host = document.getElementById('game') || document.body;
		host.appendChild(wrapper);
		extraInfoEl = wrapper;
		return wrapper;
	}

function removeExtraInfoOverlay() {
	if (!extraInfoEl) return;
	try { if (extraInfoEl.parentNode) extraInfoEl.parentNode.removeChild(extraInfoEl); } catch (e) {}
	extraInfoEl = null;
}

	function stopExtraInfoDomWatcher() {
		if (extraInfoDomObserver) {
			try { extraInfoDomObserver.disconnect(); } catch (e) {}
			extraInfoDomObserver = null;
		}
	}

	function startExtraInfoDomWatcher() {
		stopExtraInfoDomWatcher();
		var target = document.body || document.documentElement;
		if (!target) return;
		extraInfoDomObserver = new MutationObserver(function(muts) {
			var found = false;
			for (var i = 0; i < muts.length; i++) {
				var m = muts[i];
				if (m.addedNodes && m.addedNodes.length) {
					for (var j = 0; j < m.addedNodes.length; j++) {
						var n = m.addedNodes[j];
						if (n && n.id && (n.id === 'health-bar-amount' || n.id === 'health-bar' || n.id === 'adrenaline-bar-amount' || n.id === 'adrenaline-bar-min-wrapper')) {
							found = true;
							break;
						}
					}
				}
				if (found) break;
			}
			if (found) {

				ensureHealthMirrorContainer();
				ensureAdrenalineMirrorContainer();
				startHealthMirrorObservers();
				startAdrenalineMirrorObservers();
				updateExtraInfoContent();
			}
		});
		extraInfoDomObserver.observe(target, { childList: true, subtree: true });
	}

	function ensureExtraInfoWrap() {
		return extraInfoEl;
	}

	function getHealthInfoFromHud() {
		var amountEl = document.getElementById('health-bar-amount');
		var barEl = document.getElementById('health-bar');
		var amountText = amountEl && amountEl.textContent ? amountEl.textContent.trim() : null;
		var barColor = '';
		if (barEl) {
			barColor = barEl.style.backgroundColor || '';
			if (!barColor) {
				try { barColor = window.getComputedStyle(barEl).backgroundColor; } catch (e) { barColor = ''; }
			}
		}
		return {
			amount: amountText,
			color: barColor
		};
	}

	function ensureHealthMirrorContainer() {
		if (!extraInfoEl) return null;
		var wrap = ensureExtraInfoWrap();
		if (!wrap) return null;
		if (!extraInfoHealthMirror) {
			extraInfoHealthMirror = document.createElement('div');
		extraInfoHealthMirror.className = 'mod-extra-health';
		extraInfoHealthMirror.style.display = 'inline-flex';
		extraInfoHealthMirror.style.alignItems = 'center';
		extraInfoHealthMirror.style.gap = '6px';
		extraInfoHealthMirror.style.whiteSpace = 'nowrap';
		extraInfoHealthMirror.style.padding = '0 6px';
		wrap.appendChild(extraInfoHealthMirror);
	}
	return extraInfoHealthMirror;
}

	function syncHealthMirror() {
		if (!extraInfoEl) return;
		var mirror = ensureHealthMirrorContainer();
		if (!mirror) return;

		var sourceAmount = document.getElementById('health-bar-amount');
		var sourceBar = document.getElementById('health-bar');
		mirror.innerHTML = '';
		var value = document.createElement('span');
		value.textContent = sourceAmount ? (sourceAmount.textContent || '') : '?';
		if (value.textContent.indexOf('%') === -1) value.textContent += '%';
		value.style.fontWeight = '700';
		mirror.appendChild(value);

		var color = '';
		if (sourceBar) {
			color = sourceBar.style.backgroundColor || '';
			if (!color) {
				try { color = window.getComputedStyle(sourceBar).backgroundColor; } catch (e) { color = ''; }
			}
		}
		if (!color && sourceAmount) {
			color = sourceAmount.style.color || '';
			if (!color) {
				try { color = window.getComputedStyle(sourceAmount).color; } catch (e2) { color = ''; }
			}
		}
		var healthColor = color || '#ff0000';
		mirror.style.color = healthColor;
		value.style.color = healthColor;
	}

	function getAdrenalineInfoFromHud() {
		var amountEl = document.getElementById('adrenaline-bar-amount') ||
			document.getElementById('adrenaline-amount') ||
			document.querySelector('#adrenaline-bar span');
		var minWrap = document.getElementById('adrenaline-bar-min-wrapper') ||
			document.getElementById('adrenaline-bar') ||
			(amountEl && amountEl.parentElement);
		var amountText = amountEl && amountEl.textContent ? amountEl.textContent.trim() : null;
		var barColor = '';
		if (minWrap) {
			barColor = minWrap.style.backgroundColor || '';
			if (!barColor) {
				try { barColor = window.getComputedStyle(minWrap).backgroundColor; } catch (e) { barColor = ''; }
			}
		}
		return {
			amount: amountText,
			color: barColor
		};
	}

	function getAmmoInfoFromHud() {
		var clipEl = document.getElementById('weapon-clip-ammo-count');
		var invEl = document.getElementById('weapon-inventory-ammo');
		var slotAmmoEl = document.querySelector('#weapons-container .inventory-slot.active .item-ammo') ||
			document.querySelector('.inventory-slot.has-item.active .item-ammo') ||
			document.querySelector('.inventory-slot.active .item-ammo');
		var clipText = (clipEl && clipEl.textContent ? clipEl.textContent.trim() : null) ||
			(slotAmmoEl && slotAmmoEl.textContent ? slotAmmoEl.textContent.trim() : null);
		var invText = invEl && invEl.textContent ? invEl.textContent.trim() : null;
		return { clip: clipText, inv: invText };
	}

	function getWeaponInfoFromHud() {

		var activeSlot = document.querySelector('#weapons-container .inventory-slot.active') ||
			document.querySelector('.inventory-slot.has-item.active') ||
			document.querySelector('.inventory-slot.active');
		if (!activeSlot) return { name: '?' };
		var slotId = activeSlot.id || '';
		var nameEl = activeSlot.querySelector('.item-name');
		var nameText = nameEl && typeof nameEl.textContent === 'string' ? nameEl.textContent.trim() : '';


		if (!nameText) {
			var imgEl = activeSlot.querySelector('.item-image');
			if (imgEl && imgEl.style && imgEl.style.backgroundImage) {
				var bg = imgEl.style.backgroundImage;
				var match = /\/([a-z0-9_-]+)\.(?:svg|png|jpg|jpeg)/i.exec(bg);
				if (match && match[1]) {
					nameText = match[1].replace(/[_-]+/g, ' ');
					nameText = nameText.charAt(0).toUpperCase() + nameText.slice(1);
				}
			}
		}


		var looksInvalid = (!nameText || nameText.length === 0 || /ammo/i.test(nameText) || /^\d+$/.test(nameText));
		if (!looksInvalid) {
			lastWeaponName = nameText;
			lastWeaponSlotId = slotId;
		} else if (slotId && slotId === lastWeaponSlotId && lastWeaponName) {
			nameText = lastWeaponName;
		}

		return { name: nameText || lastWeaponName || '?' };
	}

function ensureAdrenalineMirrorContainer() {
	if (!extraInfoEl) return null;
	var wrap = ensureExtraInfoWrap();
	if (!wrap) return null;
	if (!extraInfoAdrenalineMirror) {
		extraInfoAdrenalineMirror = document.createElement('div');
		extraInfoAdrenalineMirror.className = 'mod-extra-adrenaline';
		extraInfoAdrenalineMirror.style.display = 'inline-flex';
		extraInfoAdrenalineMirror.style.alignItems = 'center';
		extraInfoAdrenalineMirror.style.gap = '6px';
		extraInfoAdrenalineMirror.style.whiteSpace = 'nowrap';
		extraInfoAdrenalineMirror.style.padding = '0 6px';
		wrap.appendChild(extraInfoAdrenalineMirror);
	}
	return extraInfoAdrenalineMirror;
}

function syncAdrenalineMirror() {
	if (!extraInfoEl) return;
	var mirror = ensureAdrenalineMirrorContainer();
	if (!mirror) return;
	mirror.style.display = 'inline-flex';

	var info = getAdrenalineInfoFromHud();
		var value = document.createElement('span');
		value.textContent = info.amount || '?';
		value.style.fontWeight = '700';

		mirror.innerHTML = '';
		mirror.appendChild(value);

		var adrenalineColor = '#f68014';
		mirror.style.color = adrenalineColor;
		value.style.color = adrenalineColor;
	}

function startHealthMirrorObservers() {
	var sourceAmount = document.getElementById('health-bar-amount');
	var sourceBar = document.getElementById('health-bar');
	if (!sourceAmount && !sourceBar) return;


	if (sourceAmount) {
		extraInfoHealthObserver = new MutationObserver(updateExtraInfoContent);
		extraInfoHealthObserver.observe(sourceAmount, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
	}


	if (sourceBar) {
		extraInfoHealthBarObserver = new MutationObserver(updateExtraInfoContent);
		extraInfoHealthBarObserver.observe(sourceBar, { attributes: true, attributeFilter: ['style', 'class'] });
	}
}

	function startAdrenalineMirrorObservers() {
		var amount = document.getElementById('adrenaline-bar-amount') ||
			document.getElementById('adrenaline-amount') ||
			document.querySelector('#adrenaline-bar span');
		var bar = document.getElementById('adrenaline-bar-min-wrapper') ||
			document.getElementById('adrenaline-bar') ||
			(amount && amount.parentElement);
		if (!amount && !bar) return;

		if (amount) {
			extraInfoAdrenalineAmountObserver = new MutationObserver(updateExtraInfoContent);
			extraInfoAdrenalineAmountObserver.observe(amount, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
	}
	if (bar) {
		extraInfoAdrenalineBarObserver = new MutationObserver(updateExtraInfoContent);
		extraInfoAdrenalineBarObserver.observe(bar, { attributes: true, attributeFilter: ['style', 'class'] });
	}
}

	function updateExtraInfoContent() {
		if (!extraInfoEl) return;
		var infoHp = getHealthInfoFromHud();
		var infoAdr = getAdrenalineInfoFromHud();
		var infoAmmo = getAmmoInfoFromHud();
		var infoWeapon = getWeaponInfoFromHud();
		var fontSize = getExtraFontSize();
		extraInfoEl.style.fontSize = fontSize + 'px';
		var hpText = (infoHp.amount && infoHp.amount.length) ? infoHp.amount : '?';
		var adrText = (infoAdr.amount && infoAdr.amount.length) ? infoAdr.amount : '?';
		var clipText = (infoAmmo.clip && infoAmmo.clip.length) ? infoAmmo.clip : '?';
		var invText = (infoAmmo.inv && infoAmmo.inv.length) ? infoAmmo.inv : '?';
		var weaponText = (infoWeapon.name && infoWeapon.name.length) ? infoWeapon.name : '?';

		var looksLikeAmmo = /ammo/i.test(weaponText) || /^\d+$/.test(weaponText) || /\/\d+/.test(weaponText);
		if (!weaponText || weaponText === '?' || looksLikeAmmo) {
			if (lastWeaponName) weaponText = lastWeaponName;

			if (!weaponText || weaponText === '?' || looksLikeAmmo) weaponText = lastWeaponName || '?';
		}


		if (!extraInfoHpNode) {
			extraInfoHpNode = document.createElement('span');
			extraInfoHpNode.style.position = 'fixed';
			extraInfoHpNode.style.pointerEvents = 'none';
			extraInfoHpNode.style.whiteSpace = 'nowrap';
			extraInfoHpNode.style.fontWeight = '700';
			extraInfoEl.appendChild(extraInfoHpNode);
		}
		if (!extraInfoAdrNode) {
			extraInfoAdrNode = document.createElement('span');
			extraInfoAdrNode.style.position = 'fixed';
			extraInfoAdrNode.style.pointerEvents = 'none';
			extraInfoAdrNode.style.whiteSpace = 'nowrap';
			extraInfoAdrNode.style.fontWeight = '700';
			extraInfoEl.appendChild(extraInfoAdrNode);
		}
		if (!extraInfoAmmoNode) {
			extraInfoAmmoNode = document.createElement('span');
			extraInfoAmmoNode.style.position = 'fixed';
			extraInfoAmmoNode.style.pointerEvents = 'none';
			extraInfoAmmoNode.style.whiteSpace = 'nowrap';
			extraInfoAmmoNode.style.fontWeight = '700';
			extraInfoEl.appendChild(extraInfoAmmoNode);
		}
		if (!extraInfoWeaponNode) {
			extraInfoWeaponNode = document.createElement('span');
			extraInfoWeaponNode.style.position = 'fixed';
			extraInfoWeaponNode.style.pointerEvents = 'none';
			extraInfoWeaponNode.style.whiteSpace = 'nowrap';
			extraInfoWeaponNode.style.fontWeight = '700';
			extraInfoEl.appendChild(extraInfoWeaponNode);
		}

		var clipNum = parseInt(clipText, 10);
		var invNum = parseInt(invText, 10);
		var clipZero = (!isNaN(clipNum) && clipNum === 0);
		var invZero = (!isNaN(invNum) && invNum === 0);

		var hpDisplay = hpText;
		if (hpDisplay.indexOf('%') === -1) hpDisplay += '%';
		extraInfoHpNode.textContent = hpDisplay;
		extraInfoHpNode.style.color = infoHp.color || '#ff0000';

		extraInfoAdrNode.textContent = adrText;
		extraInfoAdrNode.style.color = '#f68014';


		extraInfoAmmoNode.innerHTML = '';
		var clipPart = document.createElement('span');
		clipPart.textContent = clipText;
		if (clipZero) clipPart.style.color = '#ff4d4d';
		var slash = document.createElement('span');
		slash.textContent = ' / ';
		var invPart = document.createElement('span');
		invPart.textContent = invText;
		if (invZero) invPart.style.color = '#ff4d4d';
		extraInfoAmmoNode.appendChild(clipPart);
		extraInfoAmmoNode.appendChild(slash);
		extraInfoAmmoNode.appendChild(invPart);

		extraInfoWeaponNode.textContent = weaponText;
		extraInfoWeaponNode.style.color = '#fff';


		var baseX = extraInfoAnchor.x;
		var baseY = extraInfoAnchor.y;
		var offset = getExtraOffset();
		var hpWidth = extraInfoHpNode.getBoundingClientRect ? extraInfoHpNode.getBoundingClientRect().width : (extraInfoHpNode.offsetWidth || 0);
		var adrWidth = extraInfoAdrNode.getBoundingClientRect ? extraInfoAdrNode.getBoundingClientRect().width : (extraInfoAdrNode.offsetWidth || 0);
		extraInfoHpNode.style.left = (baseX - offset - hpWidth) + 'px';
		extraInfoHpNode.style.top = (baseY - offset) + 'px';
		extraInfoAdrNode.style.left = (baseX - offset - adrWidth) + 'px';
		extraInfoAdrNode.style.top = (baseY + offset) + 'px';
		extraInfoWeaponNode.style.left = (baseX + offset) + 'px';
		extraInfoWeaponNode.style.top = (baseY - offset) + 'px';
		extraInfoAmmoNode.style.left = (baseX + offset) + 'px';
		extraInfoAmmoNode.style.top = (baseY + offset) + 'px';

		extraInfoEl.style.color = '#fff';
	}

	function startExtraInfo(mode) {
		stopExtraInfo();
		var el = createExtraInfoOverlay();
		if (!el) return;
		mode = mode || localStorage.getItem(LS_KEY_EXTRA_INFO_MODE) || 'player';
		el.textContent = '';
		extraInfoAnchor = { x: 0, y: 0 };
		updateExtraInfoContent();
		extraInfoContentInterval = setInterval(updateExtraInfoContent, 40);
		startHealthMirrorObservers();
		startAdrenalineMirrorObservers();
		startExtraInfoDomWatcher();
		if (mode === 'cursor') {
			var moveFn = function(ev) {
				try {
					var hostRect = (document.getElementById('game') || document.body).getBoundingClientRect();
					var x = ev.clientX - hostRect.left;
					var y = ev.clientY - hostRect.top;
					extraInfoAnchor = { x: x, y: y };
					updateExtraInfoContent();
				} catch (e) {}
			};
			extraInfoMouseHandler = moveFn;
			extraInfoPointerHandler = moveFn;

			document.addEventListener('pointermove', extraInfoPointerHandler, true);
			document.addEventListener('mousemove', extraInfoMouseHandler, true);
		} else {

			extraInfoInterval = setInterval(function() {
				try {
					var canvas = document.getElementById('game-canvas');
					var host = document.getElementById('game') || document.body;
					var rect = canvas ? canvas.getBoundingClientRect() : host.getBoundingClientRect();
					var x = (rect.width / 2) + (rect.left - host.getBoundingClientRect().left);
					var y = (rect.height / 2) + (rect.top - host.getBoundingClientRect().top);
					extraInfoAnchor = { x: x, y: y };
					updateExtraInfoContent();
				} catch (e) {}
			}, 200);
		}
	}

	function stopExtraInfo() {
		if (extraInfoMouseHandler) {
			document.removeEventListener('mousemove', extraInfoMouseHandler, true);
			extraInfoMouseHandler = null;
		}
		if (extraInfoPointerHandler) {
			document.removeEventListener('pointermove', extraInfoPointerHandler, true);
			extraInfoPointerHandler = null;
		}
	if (extraInfoInterval) {
		clearInterval(extraInfoInterval);
		extraInfoInterval = null;
	}
	if (extraInfoContentInterval) {
		clearInterval(extraInfoContentInterval);
		extraInfoContentInterval = null;
	}
		if (extraInfoHealthObserver) {
			try { extraInfoHealthObserver.disconnect(); } catch (e) {}
			extraInfoHealthObserver = null;
		}
		if (extraInfoHealthBarObserver) {
			try { extraInfoHealthBarObserver.disconnect(); } catch (e2) {}
			extraInfoHealthBarObserver = null;
		}
		if (extraInfoAdrenalineAmountObserver) {
			try { extraInfoAdrenalineAmountObserver.disconnect(); } catch (e3) {}
			extraInfoAdrenalineAmountObserver = null;
		}
		if (extraInfoAdrenalineBarObserver) {
			try { extraInfoAdrenalineBarObserver.disconnect(); } catch (e4) {}
			extraInfoAdrenalineBarObserver = null;
		}
		stopExtraInfoDomWatcher();
		extraInfoHealthMirror = null;
		extraInfoAdrenalineMirror = null;
		extraInfoWrap = null;
		extraInfoHpNode = null;
		extraInfoAdrNode = null;
		extraInfoAmmoNode = null;
		extraInfoWeaponNode = null;
		removeExtraInfoOverlay();
	}

	function startHealthLogger() {
		if (healthLogInterval) return;
		healthLogInterval = setInterval(function() {
			try {
				var info = getHealthInfoFromHud();
			} catch (e) {
				console.warn('[Mod] Health log error', e);
			}
		}, 1000);
	}

	function startAdrenalineLogger() {
		if (adrenalineLogInterval) return;
		adrenalineLogInterval = setInterval(function() {
			try {
				var info = getAdrenalineInfoFromHud();
			} catch (e) {
				console.warn('[Mod] Adrenaline log error', e);
			}
		}, 3000);
	}

	function startWeaponLogger() {
		if (weaponLogInterval) return;
		weaponLogInterval = setInterval(function() {
			try {
				var info = getWeaponInfoFromHud();
			} catch (e) {
				console.warn('[Mod] Weapon log error', e);
			}
		}, 4000);
	}


	function preloadImage(url, timeoutMs, callback) {
		if (!url) return callback(false, 'empty');
		var timedOut = false;
		var timeout = timeoutMs || 5000;


		function attemptLoad(useCrossOrigin, cb) {
			var img = new Image();
			if (useCrossOrigin) img.crossOrigin = 'anonymous';
			var t = setTimeout(function() {
				if (timedOut) return;
				timedOut = true;
				try { img.src = ''; } catch (e) {}
				cb(false, 'timeout');
			}, timeout);

			img.onload = function() {
				if (timedOut) return;
				clearTimeout(t);

				try {
					var c = document.createElement('canvas');
					c.width = img.naturalWidth || 1;
					c.height = img.naturalHeight || 1;
					var ctx = c.getContext('2d');
					ctx.drawImage(img, 0, 0);

					ctx.getImageData(0, 0, 1, 1);

					cb(true, 'ok-cors', img);
				} catch (e) {

					cb(true, 'loaded-tainted', img);
				}
			};

			img.onerror = function() {
				if (timedOut) return;
				clearTimeout(t);
				cb(false, 'error');
			};


			try { img.src = url; } catch (e) { clearTimeout(t); cb(false, 'exception'); }
		};


		attemptLoad(true, function(ok, reason, imgEl) {
			if (ok) return callback(true, reason, imgEl);

			attemptLoad(false, function(ok2, reason2, imgEl2) {
				if (ok2) return callback(true, reason2, imgEl2);
				return callback(false, reason2);
			});
		});
	}

	function stopTextColorWatcher() {
		if (textColorObserver) {
			try { textColorObserver.disconnect(); } catch (e) {}
			textColorObserver = null;
		}
	}


	function createSettingsPanel() {
		var MIN_PANEL_WIDTH = 240;
		var MAX_PANEL_WIDTH = 520;
		var MIN_PANEL_HEIGHT = 200;
		var DEFAULT_PANEL_WIDTH = 420;
		var DEFAULT_PANEL_HEIGHT = 0;
		var panelScale = 1;
		var panel = document.createElement('div');
 		panel.id = 'mod-settings-panel';
 		panel.style.position = 'fixed';
 		panel.style.left = '10px';
 		panel.style.top = '50%';
 		panel.style.transform = '';
 		panel.style.background = '#0b1220';
 		panel.style.color = 'white';
 		panel.style.padding = '12px';
 		panel.style.borderRadius = '10px';
 		panel.style.zIndex = '99999';
 		panel.style.fontFamily = 'Inter, Roboto, Arial, sans-serif';
		panel.style.minWidth = MIN_PANEL_WIDTH + 'px';
		panel.style.width = DEFAULT_PANEL_WIDTH + 'px';
		panel.style.boxSizing = 'border-box';
		panel.style.position = 'fixed';
		panel.style.boxShadow = '0 8px 30px rgba(2,6,23,0.6)';

		panel.style.userSelect = 'none';
		panel.style.webkitUserSelect = 'none';
		panel.classList.add('theme-dark');
		ensureThemeStyle();



		var panelContent = document.createElement('div');
		panelContent.id = 'mod-panel-content';
		panelContent.style.transformOrigin = 'top left';
		panelContent.style.width = '100%';


		var header = document.createElement('div');
		header.id = 'mod-panel-header';
		header.style.display = 'flex';
		header.style.alignItems = 'center';
		header.style.justifyContent = 'space-between';
		header.style.gap = '8px';
		header.style.marginBottom = '10px';
		header.style.cursor = 'grab';

 		var title = document.createElement('div');
 		title.textContent = "Blubbled's UI Mod Reborn";
 		title.style.fontWeight = '700';
 		title.style.fontSize = '14px';
 		header.appendChild(title);

		var resetBtn = document.createElement('button');
		resetBtn.id = 'mod-panel-reset-pos';
		resetBtn.textContent = 'Reset GUI';
		resetBtn.style.marginLeft = 'auto';
		resetBtn.style.background = '#0f172a';
		resetBtn.style.color = '#fff';
		resetBtn.style.border = '1px solid rgba(255,255,255,0.08)';
		resetBtn.style.borderRadius = '6px';
		resetBtn.style.padding = '4px 8px';
 		resetBtn.style.cursor = 'pointer';
		resetBtn.style.fontWeight = '700';
		resetBtn.style.fontSize = '12px';
		resetBtn.style.userSelect = 'none';
		header.appendChild(resetBtn);

		var themeToggleBtn = document.createElement('button');
		themeToggleBtn.id = 'mod-theme-toggle';
		themeToggleBtn.textContent = '🌙';
		themeToggleBtn.style.marginLeft = '8px';
		themeToggleBtn.style.background = '#0f172a';
		themeToggleBtn.style.color = '#fff';
		themeToggleBtn.style.border = '1px solid rgba(255,255,255,0.08)';
		themeToggleBtn.style.borderRadius = '6px';
		themeToggleBtn.style.padding = '4px 8px';
		themeToggleBtn.style.cursor = 'pointer';
		themeToggleBtn.style.fontWeight = '700';
		themeToggleBtn.style.fontSize = '12px';
		themeToggleBtn.title = 'Toggle light/dark mode';
		header.appendChild(themeToggleBtn);

		panelContent.appendChild(header);


		var resizeHandle = document.createElement('div');
		resizeHandle.id = 'mod-panel-resize-handle';
		resizeHandle.style.position = 'absolute';
		resizeHandle.style.right = '6px';
		resizeHandle.style.bottom = '6px';
		resizeHandle.style.width = '14px';
		resizeHandle.style.height = '14px';
		resizeHandle.style.cursor = 'nwse-resize';
		resizeHandle.style.background = 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.35) 50%)';
		resizeHandle.style.opacity = '0.7';
		resizeHandle.style.userSelect = 'none';
		resizeHandle.title = 'Drag to resize';

		var joinInline = document.createElement('div');
		joinInline.id = 'mod-join-inline';
		joinInline.style.display = 'flex';
		joinInline.style.alignItems = 'center';
		joinInline.style.gap = '6px';
		joinInline.style.marginBottom = '6px';
		joinInline.style.fontSize = '13px';
		joinInline.style.fontWeight = '700';

		var joinText = document.createElement('span');
		joinText.textContent = 'Join ';
		joinText.style.color = '#fff';
		joinInline.appendChild(joinText);

		var joinLink = document.createElement('a');
		joinLink.textContent = 'ZESK';
		joinLink.href = 'https://discord.gg/G7tvhRyvz3';
		joinLink.target = '_blank';
		joinLink.rel = 'noopener noreferrer';

		joinLink.style.color = '#3b82f6';
		joinLink.style.textDecoration = 'underline';
		joinLink.style.fontWeight = '800';
		joinInline.appendChild(joinLink);

		var joinSuffix = document.createElement('span');
		joinSuffix.textContent = ' clan';
		joinSuffix.style.color = '#fff';
		joinInline.appendChild(joinSuffix);

		panelContent.appendChild(joinInline);

		var verInline = document.createElement('div');
		verInline.id = 'mod-script-version';
		verInline.textContent = 'v' + SCRIPT_VERSION;
		verInline.style.fontSize = '12px';
		verInline.style.opacity = '0.85';
		verInline.style.marginBottom = '8px';
		panelContent.appendChild(verInline);



		var kcRow = document.createElement('div');
		kcRow.style.display = 'flex';
		kcRow.style.alignItems = 'center';
		kcRow.style.justifyContent = 'space-between';
		kcRow.style.marginBottom = '10px';
		kcRow.style.background = '#ef4444';

        kcRow.style.transition = 'background-color 220ms ease, box-shadow 180ms ease';
		kcRow.style.padding = '10px';
		kcRow.style.borderRadius = '8px';
		kcRow.style.cursor = 'pointer';

		var kcLabel = document.createElement('div');
		kcLabel.textContent = 'Show Kill Counter';
		kcLabel.style.color = '#fff';
		kcLabel.style.fontWeight = '600';
		kcRow.appendChild(kcLabel);

		var kcToggle = document.createElement('input');
		kcToggle.type = 'checkbox';
		kcToggle.id = 'mod-show-kill-counter-toggle';

		kcToggle.style.display = 'none';
		kcRow.appendChild(kcToggle);

		var kcStatus = document.createElement('div');
		kcStatus.className = 'mod-status';
		kcStatus.textContent = 'OFF';
		kcStatus.style.fontWeight = '700';
		kcStatus.style.color = '#fff';
		kcRow.appendChild(kcStatus);

		kcRow.addEventListener('click', function(e) {
			if (e.target !== kcToggle) kcToggle.checked = !kcToggle.checked;
			kcToggle.dispatchEvent(new Event('change'));
		});

		panelContent.appendChild(kcRow);



		var fpsUncappedRow = document.createElement('div');
		fpsUncappedRow.style.display = 'flex';
		fpsUncappedRow.style.alignItems = 'center';
		fpsUncappedRow.style.justifyContent = 'space-between';
		fpsUncappedRow.style.margin = '6px 0 10px 0';
		fpsUncappedRow.style.background = '#1e90ff';

        fpsUncappedRow.style.transition = 'background-color 220ms ease, box-shadow 180ms ease';
		fpsUncappedRow.style.padding = '10px';
		fpsUncappedRow.style.borderRadius = '8px';
		fpsUncappedRow.style.cursor = 'pointer';

		var fpsUncappedLabel = document.createElement('div');
		fpsUncappedLabel.textContent = 'Uncap FPS';
		fpsUncappedLabel.style.color = '#fff';
		fpsUncappedLabel.style.fontWeight = '600';
		fpsUncappedRow.appendChild(fpsUncappedLabel);

		var fpsUncappedToggle = document.createElement('input');
		fpsUncappedToggle.type = 'checkbox';
		fpsUncappedToggle.id = 'mod-fps-uncapped-toggle';

		fpsUncappedToggle.style.display = 'none';
		fpsUncappedRow.appendChild(fpsUncappedToggle);

		var fpsStatus = document.createElement('div');
		fpsStatus.className = 'mod-status';
		fpsStatus.textContent = 'OFF';
		fpsStatus.style.fontWeight = '700';
		fpsStatus.style.color = '#fff';
		fpsUncappedRow.appendChild(fpsStatus);

		fpsUncappedRow.addEventListener('click', function(e) {
			if (e.target !== fpsUncappedToggle) fpsUncappedToggle.checked = !fpsUncappedToggle.checked;
			fpsUncappedToggle.dispatchEvent(new Event('change'));
		});

		panelContent.appendChild(fpsUncappedRow);




		var textRow = document.createElement('div');
		textRow.style.display = 'flex';
		textRow.style.alignItems = 'center';
		textRow.style.justifyContent = 'space-between';
		textRow.style.margin = '6px 0 10px 0';
		textRow.style.background = '#ef4444';
		textRow.style.padding = '10px';
		textRow.style.borderRadius = '8px';
		textRow.style.cursor = 'pointer';
		textRow.style.transition = 'background-color 220ms ease, box-shadow 180ms ease';

		var textLabel = document.createElement('div');
		textLabel.textContent = 'Custom Text Color';
		textLabel.style.color = '#fff';
		textLabel.style.fontWeight = '600';
		textRow.appendChild(textLabel);

		var textToggle = document.createElement('input');
		textToggle.type = 'checkbox';
		textToggle.id = 'mod-text-color-toggle';
		textToggle.style.display = 'none';

		textRow.appendChild(textToggle);

		var colorInput = document.createElement('input');
		colorInput.type = 'color';
		colorInput.id = 'mod-text-color-picker';

		colorInput.style.marginLeft = '7px';
		colorInput.style.width = '34px';
		colorInput.style.height = '28px';
		colorInput.style.display = 'block';
		colorInput.style.alignSelf = 'center';
		colorInput.style.marginTop = '0';
		colorInput.style.marginBottom = '0';

		colorInput.style.transform = 'translateY(10px)';
		colorInput.title = 'Pick text color';
		colorInput.style.userSelect = 'auto';
		textRow.appendChild(colorInput);

		var textStatus = document.createElement('div');
		textStatus.className = 'mod-status';
		textStatus.textContent = 'OFF';
		textStatus.style.fontWeight = '700';
		textStatus.style.color = '#fff';

		textStatus.style.marginLeft = 'auto';
		textRow.appendChild(textStatus);


		textRow.addEventListener('click', function(e) {
			if (e.target === colorInput) return;
			if (e.target !== textToggle) textToggle.checked = !textToggle.checked;
			textToggle.dispatchEvent(new Event('change'));
		});

		panelContent.appendChild(textRow);


		var bgRow = document.createElement('div');
		bgRow.style.display = 'flex';
		bgRow.style.alignItems = 'center';
		bgRow.style.justifyContent = 'space-between';
		bgRow.style.margin = '6px 0 10px 0';
		bgRow.style.background = '#ef4444';
		bgRow.style.padding = '10px';
		bgRow.style.borderRadius = '8px';
		bgRow.style.cursor = 'pointer';
		bgRow.style.transition = 'background-color 220ms ease, box-shadow 180ms ease';

		var bgLabel = document.createElement('div');
		bgLabel.textContent = 'Custom Background';
		bgLabel.style.color = '#fff';
		bgLabel.style.fontWeight = '600';
		bgRow.appendChild(bgLabel);

		var bgToggle = document.createElement('input');
		bgToggle.type = 'checkbox';
		bgToggle.id = 'mod-bg-toggle';
		bgToggle.style.display = 'none';
		bgRow.appendChild(bgToggle);

		var bgUrlInput = document.createElement('input');
		bgUrlInput.type = 'url';
		bgUrlInput.id = 'mod-bg-url';
		bgUrlInput.placeholder = 'Background image URL';
		bgUrlInput.style.marginLeft = '7px';
		bgUrlInput.style.flex = '1';
		bgUrlInput.style.maxWidth = '140px';
		bgUrlInput.style.marginRight = '8px';
		bgUrlInput.style.background = '#071024';
		bgUrlInput.style.color = '#fff';
		bgUrlInput.style.border = '1px solid rgba(255,255,255,0.06)';
		bgUrlInput.style.borderRadius = '4px';
		bgUrlInput.style.padding = '4px 6px';
		bgUrlInput.style.userSelect = 'auto';
		bgRow.appendChild(bgUrlInput);

		var bgStatus = document.createElement('div');
		bgStatus.className = 'mod-status';
		bgStatus.textContent = 'OFF';
		bgStatus.style.fontWeight = '700';
		bgStatus.style.color = '#fff';
		bgStatus.style.marginLeft = '6px';
		bgRow.appendChild(bgStatus);

		var bgNotice = document.createElement('div');
		var bgNoticeArrow = document.createElement('div');
		var bgNoticeText = document.createElement('div');
		bgNotice.style.position = 'fixed';
		bgNotice.style.background = '#ef4444';
		bgNotice.style.color = '#fff';
		bgNotice.style.fontSize = '12px';
		bgNotice.style.fontWeight = '700';
		bgNotice.style.padding = '10px 12px';
		bgNotice.style.borderRadius = '10px';
		bgNotice.style.display = 'none';
		bgNotice.style.maxWidth = '260px';
		bgNotice.style.textAlign = 'left';
		bgNotice.style.lineHeight = '1.35';
		bgNotice.style.userSelect = 'text';
		bgNotice.style.boxShadow = '0 10px 24px rgba(0,0,0,0.25)';
		bgNotice.style.zIndex = '10000';
		bgNotice.style.pointerEvents = 'auto';
		bgNoticeArrow.style.position = 'absolute';
		bgNoticeArrow.style.top = '50%';
		bgNoticeArrow.style.left = '-10px';
		bgNoticeArrow.style.transform = 'translateY(-50%)';
		bgNoticeArrow.style.width = '0';
		bgNoticeArrow.style.height = '0';
		bgNoticeArrow.style.borderTop = '8px solid transparent';
		bgNoticeArrow.style.borderBottom = '8px solid transparent';
		bgNoticeArrow.style.borderRight = '10px solid #ef4444';
		bgNotice.appendChild(bgNoticeArrow);
		bgNoticeText.style.position = 'relative';
		bgNoticeText.style.display = 'flex';
		bgNoticeText.style.flexDirection = 'column';
		bgNoticeText.style.gap = '6px';
		bgNotice.appendChild(bgNoticeText);
		document.body.appendChild(bgNotice);

		function positionBgNotice() {
			if (!bgNotice || bgNotice.style.display === 'none') return;
			var rect = bgRow.getBoundingClientRect();
			var top = rect.top + (rect.height / 2) - (bgNotice.offsetHeight / 2);
			bgNotice.style.left = (rect.right + 12) + 'px';
			bgNotice.style.top = Math.max(8, top) + 'px';
		}

		function showBgNotice(msg) {
			if (!bgNotice) return;
			bgNoticeText.innerHTML = '';

			var base = (msg || '').replace(/Example:?\s*https?:\/\/\S+/i, '').trim();

			var helper = 'Use direct image URLs ending in .jpg, .jpeg, or .png. You can get these by right clicking an image and selecting "Copy image address". Some images may still not work.';

			var cleaned = base ? (base + ' ' + helper) : helper;

			var textPart = document.createElement('div');
			textPart.textContent = cleaned;
			var linkPart = document.createElement('a');
			var exampleUrl = 'https://i.imgur.com/ksCzNoj.jpeg';
			linkPart.href = exampleUrl;
			linkPart.textContent = 'Example: ' + exampleUrl;
			linkPart.style.color = '#ffe9a5';
			linkPart.style.fontWeight = '800';
			linkPart.style.textDecoration = 'underline';
			linkPart.style.wordBreak = 'break-all';
			linkPart.target = '_blank';
			linkPart.rel = 'noopener noreferrer';
			bgNoticeText.appendChild(textPart);
			bgNoticeText.appendChild(linkPart);
			bgNotice.style.display = 'block';
			requestAnimationFrame(positionBgNotice);
			if (bgNotice.__fadeTimer) {
				clearTimeout(bgNotice.__fadeTimer);
				bgNotice.__fadeTimer = null;
			}
			bgNotice.style.opacity = '1';
			bgNotice.__fadeTimer = setTimeout(function() {
				bgNotice.style.opacity = '0';
				setTimeout(function() { hideBgNotice(); }, 400);
			}, 9000);
		}

		function hideBgNotice() {
			if (!bgNotice) return;
			bgNoticeText.textContent = '';
			bgNotice.style.display = 'none';
			bgNotice.style.opacity = '0';
			if (bgNotice.__fadeTimer) {
				clearTimeout(bgNotice.__fadeTimer);
				bgNotice.__fadeTimer = null;
			}
		}
		window.addEventListener('resize', positionBgNotice);

		bgRow.addEventListener('click', function(e) {
			if (e.target === bgUrlInput) return;
			if (e.target !== bgToggle) bgToggle.checked = !bgToggle.checked;
			bgToggle.dispatchEvent(new Event('change'));
		});

		panelContent.appendChild(bgRow);


		var extraRow = document.createElement('div');
		extraRow.style.display = 'flex';
		extraRow.style.alignItems = 'center';
		extraRow.style.justifyContent = 'space-between';
		extraRow.style.margin = '6px 0 10px 0';
		extraRow.style.background = '#ef4444';
		extraRow.style.padding = '10px';
		extraRow.style.borderRadius = '8px';
		extraRow.style.cursor = 'pointer';
		extraRow.style.transition = 'background-color 220ms ease, box-shadow 180ms ease';

		var extraLabel = document.createElement('div');
		extraLabel.textContent = 'Extra Info';
		extraLabel.style.color = '#fff';
		extraLabel.style.fontWeight = '600';
		extraRow.appendChild(extraLabel);

		var extraToggle = document.createElement('input');
		extraToggle.type = 'checkbox';
		extraToggle.id = 'mod-extra-toggle';
		extraToggle.style.display = 'none';
		extraRow.appendChild(extraToggle);


		var modeWrap = document.createElement('div');
		modeWrap.style.display = 'flex';
		modeWrap.style.gap = '6px';
		modeWrap.style.marginLeft = '8px';

		var playerBtn = document.createElement('button');
		playerBtn.className = 'mod-extra-mode-btn';
		playerBtn.dataset.mode = 'player';
		playerBtn.textContent = 'Player';
		playerBtn.style.padding = '4px 6px';
		playerBtn.style.borderRadius = '4px';
		playerBtn.style.background = '#071024';
		playerBtn.style.color = '#fff';
		playerBtn.style.border = '1px solid rgba(255,255,255,0.06)';

		var cursorBtn = document.createElement('button');
		cursorBtn.className = 'mod-extra-mode-btn';
		cursorBtn.dataset.mode = 'cursor';
		cursorBtn.textContent = 'Cursor';
		cursorBtn.style.padding = '4px 6px';
		cursorBtn.style.borderRadius = '4px';
		cursorBtn.style.background = '#071024';
		cursorBtn.style.color = '#fff';
		cursorBtn.style.border = '1px solid rgba(255,255,255,0.06)';

		modeWrap.appendChild(playerBtn);
		modeWrap.appendChild(cursorBtn);
		extraRow.appendChild(modeWrap);

		var extraConfigBtn = document.createElement('button');
		extraConfigBtn.textContent = 'v';
		extraConfigBtn.style.marginLeft = '8px';
		extraConfigBtn.style.padding = '4px 6px';
		extraConfigBtn.style.borderRadius = '4px';
		extraConfigBtn.style.background = '#071024';
		extraConfigBtn.style.color = '#fff';
		extraConfigBtn.style.border = '1px solid rgba(255,255,255,0.06)';
		extraConfigBtn.style.cursor = 'pointer';
		extraConfigBtn.title = 'Extra Info settings';
		extraConfigBtn.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			setExtraControlsExpanded(!extraControlsExpanded);
		});
		extraRow.appendChild(extraConfigBtn);

		var extraStatus = document.createElement('div');
		extraStatus.className = 'mod-status';
		extraStatus.textContent = 'OFF';
		extraStatus.style.fontWeight = '700';
		extraStatus.style.color = '#fff';
		extraStatus.style.marginLeft = '6px';
		extraRow.appendChild(extraStatus);

		extraRow.addEventListener('click', function(e) {
			if (e.target === playerBtn || e.target === cursorBtn) return;
			if (e.target !== extraToggle) extraToggle.checked = !extraToggle.checked;
			extraToggle.dispatchEvent(new Event('change'));
		});

		panelContent.appendChild(extraRow);


		var extraControls = document.createElement('div');
		extraControls.style.display = 'flex';
		extraControls.style.flexDirection = 'column';
		extraControls.style.gap = '8px';
		extraControls.style.margin = '-4px 0 8px 0';
		extraControls.style.padding = '0 6px';
		extraControls.style.background = 'rgba(7,16,36,0.8)';
		extraControls.style.borderRadius = '8px';
		extraControls.style.maxHeight = '0px';
		extraControls.style.overflow = 'hidden';
		extraControls.style.opacity = '0';
		extraControls.style.transition = 'max-height 200ms ease, opacity 160ms ease, padding 200ms ease, background-color 200ms ease, border-color 200ms ease';
		extraControls.addEventListener('click', function(e) { e.stopPropagation(); });

		var extraFontSlider = document.createElement('input');
		var extraFontValue = document.createElement('div');
		var extraOffsetSlider = document.createElement('input');
		var extraOffsetValue = document.createElement('div');

		var fontRow = document.createElement('div');
		fontRow.style.display = 'flex';
		fontRow.style.alignItems = 'center';
		fontRow.style.gap = '8px';

		var fontLabel = document.createElement('div');
		fontLabel.textContent = 'Text Size';
		fontLabel.style.color = '#fff';
		fontLabel.style.fontWeight = '600';
		fontLabel.style.minWidth = '78px';
		fontRow.appendChild(fontLabel);

		extraFontSlider.type = 'range';
		extraFontSlider.min = String(MIN_EXTRA_FONT_SIZE);
		extraFontSlider.max = String(MAX_EXTRA_FONT_SIZE);
		extraFontSlider.step = '1';
		extraFontSlider.style.flex = '1';
		extraFontSlider.style.accentColor = '#1e90ff';
		extraFontSlider.addEventListener('click', function(e) { e.stopPropagation(); });
		extraFontSlider.addEventListener('input', function(e) {
			e.stopPropagation();
			var val = setExtraFontSize(this.value);
			extraFontValue.textContent = val + 'px';
			if (extraToggle.checked) updateExtraInfoContent();
		});
		fontRow.appendChild(extraFontSlider);

		extraFontValue.style.color = '#8fb5ff';
		extraFontValue.style.fontWeight = '700';
		extraFontValue.style.minWidth = '46px';
		extraFontValue.style.textAlign = 'right';
		fontRow.appendChild(extraFontValue);

		extraControls.appendChild(fontRow);

		var offsetRow = document.createElement('div');
		offsetRow.style.display = 'flex';
		offsetRow.style.alignItems = 'center';
		offsetRow.style.gap = '8px';

		var offsetLabel = document.createElement('div');
		offsetLabel.textContent = 'Distance';
		offsetLabel.style.color = '#fff';
		offsetLabel.style.fontWeight = '600';
		offsetLabel.style.minWidth = '78px';
		offsetRow.appendChild(offsetLabel);

		extraOffsetSlider.type = 'range';
		extraOffsetSlider.min = String(MIN_EXTRA_OFFSET);
		extraOffsetSlider.max = String(MAX_EXTRA_OFFSET);
		extraOffsetSlider.step = '1';
		extraOffsetSlider.style.flex = '1';
		extraOffsetSlider.style.accentColor = '#1e90ff';
		extraOffsetSlider.addEventListener('click', function(e) { e.stopPropagation(); });
		extraOffsetSlider.addEventListener('input', function(e) {
			e.stopPropagation();
			var val = setExtraOffset(this.value);
			extraOffsetValue.textContent = val + 'px';
			if (extraToggle.checked) updateExtraInfoContent();
		});
		offsetRow.appendChild(extraOffsetSlider);

		extraOffsetValue.style.color = '#8fb5ff';
		extraOffsetValue.style.fontWeight = '700';
		extraOffsetValue.style.minWidth = '46px';
		extraOffsetValue.style.textAlign = 'right';
		offsetRow.appendChild(extraOffsetValue);

		var resetRow = document.createElement('div');
		resetRow.style.display = 'flex';
		resetRow.style.gap = '8px';
		resetRow.style.marginTop = '2px';

		var resetFontBtn = document.createElement('button');
		resetFontBtn.textContent = 'Reset Size';
		resetFontBtn.style.flex = '1';
		resetFontBtn.style.padding = '6px 8px';
		resetFontBtn.style.borderRadius = '6px';
		resetFontBtn.style.border = '1px solid rgba(255,255,255,0.08)';
		resetFontBtn.style.background = '#0d1c3a';
		resetFontBtn.style.color = '#fff';
		resetFontBtn.style.cursor = 'pointer';
		resetFontBtn.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			var val = setExtraFontSize(DEFAULT_EXTRA_FONT_SIZE);
			extraFontSlider.value = val;
			extraFontValue.textContent = val + 'px';
			if (extraToggle.checked) updateExtraInfoContent();
		});

		var resetOffsetBtn = document.createElement('button');
		resetOffsetBtn.textContent = 'Reset Distance';
		resetOffsetBtn.style.flex = '1';
		resetOffsetBtn.style.padding = '6px 8px';
		resetOffsetBtn.style.borderRadius = '6px';
		resetOffsetBtn.style.border = '1px solid rgba(255,255,255,0.08)';
		resetOffsetBtn.style.background = '#0d1c3a';
		resetOffsetBtn.style.color = '#fff';
		resetOffsetBtn.style.cursor = 'pointer';
		resetOffsetBtn.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			var val = setExtraOffset(DEFAULT_EXTRA_OFFSET);
			extraOffsetSlider.value = val;
			extraOffsetValue.textContent = val + 'px';
			if (extraToggle.checked) updateExtraInfoContent();
		});

		resetRow.appendChild(resetFontBtn);
		resetRow.appendChild(resetOffsetBtn);

		extraControls.appendChild(offsetRow);
		extraControls.appendChild(resetRow);
		panelContent.appendChild(extraControls);

		function applyExtraControlsTheme(theme) {
			var isLight = (theme === THEME_LIGHT);
			extraControls.style.background = isLight ? 'rgba(255,255,255,0.9)' : 'rgba(7,16,36,0.8)';
			extraControls.style.border = isLight ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(255,255,255,0.08)';
			fontLabel.style.color = isLight ? '#0b1220' : '#fff';
			offsetLabel.style.color = isLight ? '#0b1220' : '#fff';
			extraFontValue.style.color = isLight ? '#1e3a8a' : '#8fb5ff';
			extraOffsetValue.style.color = isLight ? '#1e3a8a' : '#8fb5ff';
			extraFontSlider.style.background = isLight ? 'rgba(0,0,0,0.06)' : '';
			extraOffsetSlider.style.background = isLight ? 'rgba(0,0,0,0.06)' : '';
			resetFontBtn.style.background = isLight ? '#dce5f3' : '#0d1c3a';
			resetOffsetBtn.style.background = isLight ? '#dce5f3' : '#0d1c3a';
			resetFontBtn.style.color = isLight ? '#0b1220' : '#fff';
			resetOffsetBtn.style.color = isLight ? '#0b1220' : '#fff';
			resetFontBtn.style.border = isLight ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(255,255,255,0.08)';
			resetOffsetBtn.style.border = isLight ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(255,255,255,0.08)';
		}

		var extraControlsExpanded = false;
		function setExtraControlsExpanded(expanded) {
			extraControlsExpanded = !!expanded;
			if (extraControlsExpanded) {
				extraControls.style.padding = '8px 6px';
				var targetHeight = extraControls.scrollHeight + 20;
				extraControls.style.maxHeight = targetHeight + 'px';
				extraControls.style.opacity = '1';
				extraControls.style.overflow = 'visible';
				extraConfigBtn.textContent = '^';
			} else {
				extraControls.style.padding = '0 6px';
				extraControls.style.maxHeight = '0px';
				extraControls.style.opacity = '0';
				extraControls.style.overflow = 'hidden';
				extraConfigBtn.textContent = 'v';
			}
		}
		setExtraControlsExpanded(false);


		panel.appendChild(panelContent);
		panel.appendChild(resizeHandle);
		document.body.appendChild(panel);
		requestAnimationFrame(function() {
			loadPanelSize();
			loadPanelPosition();
		});

		header.addEventListener('mousedown', function(e) {
			if (e.target === resetBtn) return;
			startDragging(e);
		});
		resetBtn.addEventListener('click', function(e) {
			e.preventDefault();
			setPanelSize(DEFAULT_PANEL_WIDTH, null, true, false);
			var def = getDefaultPanelPosition();
			setPanelPosition(def.left, def.top, true);
		});
		themeToggleBtn.addEventListener('click', function(e) {
			e.preventDefault();
			var next = (getStoredTheme() === THEME_LIGHT) ? THEME_DARK : THEME_LIGHT;
			applyTheme(next, themeToggleBtn, panel);
			if (typeof applyExtraControlsTheme === 'function') applyExtraControlsTheme(next);
		});
		resizeHandle.addEventListener('mousedown', startResize);
		window.addEventListener('resize', function() {
			var rect = panel.getBoundingClientRect();
			setPanelPosition(rect.left, rect.top, true);
		});




	var savedFps = parseInt(localStorage.getItem(LS_KEY_FPS) || '0', 10);
	var savedUncapped = localStorage.getItem(LS_KEY_FPS_UNCAPPED) === 'true';
	var savedShowKills = localStorage.getItem(LS_KEY_SHOW_KILLS) === 'true';
	var savedTextEnabled = localStorage.getItem(LS_KEY_TEXT_COLOR_ENABLED) === 'true';
	var savedTextColor = localStorage.getItem(LS_KEY_TEXT_COLOR) || '#ffffff';
		var savedBgEnabled = localStorage.getItem(LS_KEY_BG_ENABLED) === 'true';
		var savedBgUrl = localStorage.getItem(LS_KEY_BG_URL) || '';
			var savedExtraEnabled = localStorage.getItem(LS_KEY_EXTRA_INFO_ENABLED) === 'true';
			var savedExtraMode = localStorage.getItem(LS_KEY_EXTRA_INFO_MODE) || 'player';
			var savedExtraFont = getExtraFontSize();
			var savedExtraOffset = getExtraOffset();
			var savedTheme = getStoredTheme();

	fpsUncappedToggle.checked = !!savedUncapped;
	kcToggle.checked = !!savedShowKills;
	textToggle.checked = !!savedTextEnabled;
	colorInput.value = savedTextColor;
	if (typeof bgUrlInput !== 'undefined') bgUrlInput.value = savedBgUrl;
	if (typeof bgToggle !== 'undefined') bgToggle.checked = !!savedBgEnabled;
	if (typeof extraToggle !== 'undefined') extraToggle.checked = !!savedExtraEnabled;
	if (typeof playerBtn !== 'undefined') playerBtn.style.opacity = (savedExtraMode === 'player') ? '1' : '0.6';
	if (typeof cursorBtn !== 'undefined') cursorBtn.style.opacity = (savedExtraMode === 'cursor') ? '1' : '0.6';
	if (typeof extraFontSlider !== 'undefined') extraFontSlider.value = savedExtraFont;
	if (typeof extraFontValue !== 'undefined') extraFontValue.textContent = savedExtraFont + 'px';
	if (typeof extraOffsetSlider !== 'undefined') extraOffsetSlider.value = savedExtraOffset;
	if (typeof extraOffsetValue !== 'undefined') extraOffsetValue.textContent = savedExtraOffset + 'px';
	if (typeof themeToggleBtn !== 'undefined') {
		applyTheme(savedTheme, themeToggleBtn, panel);
		if (typeof applyExtraControlsTheme === 'function') applyExtraControlsTheme(savedTheme);
	}


		function setRowActive(rowEl, active) {
			if (!rowEl) return;
			if (active) {
				rowEl.style.background = '#1e90ff';
				rowEl.style.boxShadow = '0 6px 18px rgba(30,144,255,0.18)';
			} else {
				rowEl.style.background = '#ef4444';
				rowEl.style.boxShadow = '0 6px 18px rgba(239,68,68,0.12)';
			}
			Array.from(rowEl.querySelectorAll('div')).forEach(function(d){ d.style.color = '#fff'; });
			var status = rowEl.querySelector('.mod-status');
			if (status) status.textContent = active ? 'ON' : 'OFF';
		}


		var dragState = { active: false, offsetX: 0, offsetY: 0 };
		var resizeState = { active: false, startX: 0, startY: 0, startW: 0, startH: 0 };

		function applyPanelScale(scale) {
			panelScale = scale;
			panel.style.transformOrigin = 'top left';
			panel.style.transform = 'scale(' + panelScale + ')';
		}

		function getDefaultHeight() {
			if (!DEFAULT_PANEL_HEIGHT) {
				var rect = panel.getBoundingClientRect();
				DEFAULT_PANEL_HEIGHT = rect.height / panelScale;
				if (!DEFAULT_PANEL_HEIGHT || !isFinite(DEFAULT_PANEL_HEIGHT)) DEFAULT_PANEL_HEIGHT = MIN_PANEL_HEIGHT;
			}
			return DEFAULT_PANEL_HEIGHT;
		}

		function setPanelSize(targetWidth, targetHeight, save, reposition) {
			if (typeof reposition === 'undefined') reposition = true;
			getDefaultHeight();
			var desiredW = parseInt(targetWidth, 10) || DEFAULT_PANEL_WIDTH;
			var resetHeight = (targetHeight === null);
			if (resetHeight) panel.style.height = '';
			var desiredH;
			if (resetHeight) desiredH = getDefaultHeight();
			else if (typeof targetHeight === 'number') desiredH = targetHeight;
			else desiredH = (panel.getBoundingClientRect().height || getDefaultHeight());
			var minScale = MIN_PANEL_WIDTH / DEFAULT_PANEL_WIDTH;
			var maxScale = MAX_PANEL_WIDTH / DEFAULT_PANEL_WIDTH;
			var scaleX = desiredW / DEFAULT_PANEL_WIDTH;
			var scaleY = desiredH / getDefaultHeight();
			var scale = Math.max(scaleX, scaleY);
			scale = Math.min(Math.max(scale, minScale), maxScale);
			panel.style.width = DEFAULT_PANEL_WIDTH + 'px';
			panel.style.minWidth = MIN_PANEL_WIDTH + 'px';
			panel.style.height = '';
			applyPanelScale(scale);
			if (save) {
				try {
					localStorage.setItem(LS_KEY_PANEL_SIZE, JSON.stringify({
						width: DEFAULT_PANEL_WIDTH * scale,
						height: getDefaultHeight() * scale,
						scale: scale
					}));
				} catch (e) {}
			}
			if (reposition) {
				var rect = panel.getBoundingClientRect();
				setPanelPosition(rect.left, rect.top, !!save);
			}
		}

		function loadPanelSize() {
			var applied = false;
			try {
				var saved = localStorage.getItem(LS_KEY_PANEL_SIZE);
				if (saved) {
					var obj = JSON.parse(saved);
					if (obj && (typeof obj.width === 'number' || typeof obj.scale === 'number')) {
						if (typeof obj.scale === 'number') {
							var h = (obj.height && typeof obj.height === 'number') ? obj.height : null;
							setPanelSize(DEFAULT_PANEL_WIDTH * obj.scale, h, false);
						} else {
							setPanelSize(obj.width, (typeof obj.height === 'number') ? obj.height : null, false);
						}
						applied = true;
					}
				}
			} catch (e) {}
			if (!applied) {
				setPanelSize(DEFAULT_PANEL_WIDTH, null, false);
			}
		}

		function clampPanelPosition(left, top) {
			var margin = 8;
			var rect = panel.getBoundingClientRect();
			var width = rect.width;
			var height = rect.height;
			var maxLeft = Math.max(margin, window.innerWidth - width - margin);
			var maxTop = Math.max(margin, window.innerHeight - height - margin);
			return {
				left: Math.min(Math.max(left, margin), maxLeft),
				top: Math.min(Math.max(top, margin), maxTop)
			};
		}

		function setPanelPosition(left, top, save) {
			var clamped = clampPanelPosition(left, top);
			panel.style.left = clamped.left + 'px';
			panel.style.top = clamped.top + 'px';
			panel.style.transformOrigin = 'top left';
			panel.style.transform = 'scale(' + panelScale + ')';
			if (save) {
				try { localStorage.setItem(LS_KEY_PANEL_POS, JSON.stringify(clamped)); } catch (e) {}
			}
		}

		function getDefaultPanelPosition() {
			var margin = 10;
			var rect = panel.getBoundingClientRect();
			var defaultTop = Math.max(margin, (window.innerHeight - rect.height) / 2);
			return { left: margin, top: defaultTop };
		}

		function loadPanelPosition() {
			try {
				var saved = localStorage.getItem(LS_KEY_PANEL_POS);
				if (saved) {
					var pos = JSON.parse(saved);
					if (typeof pos.left === 'number' && typeof pos.top === 'number') {
						setPanelPosition(pos.left, pos.top, false);
						return;
					}
				}
			} catch (e) {}
			var def = getDefaultPanelPosition();
			setPanelPosition(def.left, def.top, false);
		}

		function startDragging(e) {
			dragState.active = true;
			header.style.cursor = 'grabbing';
			var rect = panel.getBoundingClientRect();
			dragState.offsetX = e.clientX - rect.left;
			dragState.offsetY = e.clientY - rect.top;
			document.addEventListener('mousemove', onDragMove);
			document.addEventListener('mouseup', stopDragging);
		}

		function onDragMove(e) {
			if (!dragState.active) return;
			setPanelPosition(e.clientX - dragState.offsetX, e.clientY - dragState.offsetY, false);
		}

		function stopDragging() {
			if (!dragState.active) return;
			dragState.active = false;
			header.style.cursor = 'grab';
			var rect = panel.getBoundingClientRect();
			setPanelPosition(rect.left, rect.top, true);
			document.removeEventListener('mousemove', onDragMove);
			document.removeEventListener('mouseup', stopDragging);
		}

		function startResize(e) {
			e.preventDefault();
			resizeState.active = true;
			resizeState.startX = e.clientX;
			resizeState.startY = e.clientY;
			resizeState.startW = panel.offsetWidth;
			resizeState.startH = panel.offsetHeight;
			var startRect = panel.getBoundingClientRect();
			resizeState.startLeft = startRect.left;
			resizeState.startTop = startRect.top;
			document.addEventListener('mousemove', onResizeMove);
			document.addEventListener('mouseup', stopResize);
		}

		function onResizeMove(e) {
			if (!resizeState.active) return;
			var newW = resizeState.startW + (e.clientX - resizeState.startX);
			var newH = resizeState.startH + (e.clientY - resizeState.startY);
			setPanelSize(newW, newH, false, false);
			setPanelPosition(resizeState.startLeft, resizeState.startTop, false);
		}

		function stopResize() {
			if (!resizeState.active) return;
			resizeState.active = false;
			var rect = panel.getBoundingClientRect();
			setPanelSize(rect.width, rect.height, true, false);
			setPanelPosition(resizeState.startLeft, resizeState.startTop, true);
			document.removeEventListener('mousemove', onResizeMove);
			document.removeEventListener('mouseup', stopResize);
		}


		setRowActive(fpsUncappedRow, !!savedUncapped);
		setRowActive(kcRow, !!savedShowKills);
		setRowActive(textRow, !!savedTextEnabled);
		setRowActive(bgRow, !!savedBgEnabled);
		setRowActive(extraRow, !!savedExtraEnabled);


		fpsUncappedToggle.addEventListener('change', function() {
			var enabled = !!this.checked;
			localStorage.setItem(LS_KEY_FPS_UNCAPPED, enabled ? 'true' : 'false');
			if (enabled) {

				applyFpsCap(601);
			} else {

				applyFpsCap(0);
			}
			setRowActive(fpsUncappedRow, enabled);
		});

		kcToggle.addEventListener('change', function() {
			localStorage.setItem(LS_KEY_SHOW_KILLS, this.checked ? 'true' : 'false');
			if (this.checked) {
				ensureKillCounterShown(true);
				startKillCounterEnforcer();
			} else {

				removeForcedKillCounter();
				stopKillCounterEnforcer();
			}
			setRowActive(kcRow, this.checked);
		});


		textToggle.addEventListener('change', function() {
			var enabled = !!this.checked;
			localStorage.setItem(LS_KEY_TEXT_COLOR_ENABLED, enabled ? 'true' : 'false');
			if (enabled) {
				var c = localStorage.getItem(LS_KEY_TEXT_COLOR) || colorInput.value || '#ffffff';
				applyCustomTextColor(c);
				startTextColorWatcher(c);
				colorInput.disabled = false;
			} else {
				disableCustomTextColor();
				stopTextColorWatcher();
				colorInput.disabled = true;
			}
			setRowActive(textRow, enabled);
		});

		colorInput.addEventListener('input', function() {
			var c = this.value;
			localStorage.setItem(LS_KEY_TEXT_COLOR, c);
			if (textToggle.checked) {
				applyCustomTextColor(c);
			}
		});


		if (typeof bgToggle !== 'undefined') {
			bgToggle.addEventListener('change', function() {
				var enabled = !!this.checked;
				localStorage.setItem(LS_KEY_BG_ENABLED, enabled ? 'true' : 'false');
				var url = (bgUrlInput && bgUrlInput.value) ? bgUrlInput.value.trim() : '';
				if (enabled) {

					if (!url) {
						console.warn('[Mod] Custom Background enable requested but URL is empty');

						localStorage.setItem(LS_KEY_BG_URL, '');
						setRowActive(bgRow, false);
						bgToggle.checked = false;
						localStorage.setItem(LS_KEY_BG_ENABLED, 'false');
						showBgNotice('Link is empty or not compatible. Use direct image URLs ending in .jpg, .jpeg, or .png. Example: https://i.imgur.com/ksCzNoj.jpeg');
						return;
					}
					preloadImage(url, 6000, function(ok, reason) {
						if (ok) {
							localStorage.setItem(LS_KEY_BG_URL, url);
							applyGameBackground(url);
							startBgWatcher(url);
							setRowActive(bgRow, true);
							hideBgNotice();
						} else {
							console.error('[Mod] Custom Background failed to load:', reason || 'error', 'url=' + url);

							bgToggle.checked = false;
							localStorage.setItem(LS_KEY_BG_ENABLED, 'false');
							setRowActive(bgRow, false);

							removeGameBackground();
							stopBgWatcher();
							showBgNotice('This link could not load. Use direct image URLs (e.g., ending in .jpg/.jpeg/.png). Example: https://i.imgur.com/ksCzNoj.jpeg');
						}
					});
				} else {
					removeGameBackground();
					stopBgWatcher();
					setRowActive(bgRow, false);
					hideBgNotice();
				}
			});

			bgUrlInput.addEventListener('input', function() {
				var u = this.value.trim();
				localStorage.setItem(LS_KEY_BG_URL, u);
				if (bgToggle.checked) {

					preloadImage(u, 6000, function(ok, reason) {
						if (ok) {
							applyGameBackground(u);
							hideBgNotice();
						} else {
							console.error('[Mod] Custom Background URL update failed to load:', reason || 'error', 'url=' + u);
							showBgNotice('This link could not load. Use direct image URLs (e.g., ending in .jpg/.jpeg/.png). Example: https://i.imgur.com/ksCzNoj.jpeg');
						}
					});
				} else {
					hideBgNotice();
				}
			});
		}


		if (typeof extraToggle !== 'undefined') {
			extraToggle.addEventListener('change', function() {
				var enabled = !!this.checked;
				localStorage.setItem(LS_KEY_EXTRA_INFO_ENABLED, enabled ? 'true' : 'false');
				var mode = localStorage.getItem(LS_KEY_EXTRA_INFO_MODE) || 'player';
				if (enabled) {
					startExtraInfo(mode);
				} else {
					stopExtraInfo();
				}
				setRowActive(extraRow, enabled);
			});


			playerBtn.addEventListener('click', function(e) {
				e.preventDefault();
				var mode = 'player';
				localStorage.setItem(LS_KEY_EXTRA_INFO_MODE, mode);
				playerBtn.style.opacity = '1';
				cursorBtn.style.opacity = '0.6';
				if (extraToggle.checked) startExtraInfo(mode);
			});

			cursorBtn.addEventListener('click', function(e) {
				e.preventDefault();
				var mode = 'cursor';
				localStorage.setItem(LS_KEY_EXTRA_INFO_MODE, mode);
				cursorBtn.style.opacity = '1';
				playerBtn.style.opacity = '0.6';
				if (extraToggle.checked) startExtraInfo(mode);
			});
		}


	if (savedUncapped) applyFpsCap(601);
	else applyFpsCap(0);

	if (savedShowKills) ensureKillCounterShown(true);
	else removeForcedKillCounter();


	startKillCounterWatcher();
	if (savedShowKills) {
		startKillCounterEnforcer();
	}
	if (savedTextEnabled) {
		applyCustomTextColor(savedTextColor);
		startTextColorWatcher(savedTextColor);
	}


	if (savedBgEnabled && savedBgUrl) {
		applyGameBackground(savedBgUrl);
		startBgWatcher(savedBgUrl);
	} else {

		removeGameBackground();
		stopBgWatcher();
	}


	if (savedExtraEnabled) {
		startExtraInfo(savedExtraMode);
	} else {
		stopExtraInfo();
	}
	startWeaponLogger();
	startAdrenalineLogger();
	startHealthLogger();


	function setPanelEnabled(enabled) {
		var panelEl = document.getElementById('mod-settings-panel');
		if (!panelEl) return;
		if (!enabled) {
			panelEl.style.display = 'none';
			Array.from(panelEl.querySelectorAll('input')).forEach(function(i) { i.disabled = true; });

			var storedUncappedNow = localStorage.getItem(LS_KEY_FPS_UNCAPPED) === 'true';
			if (!storedUncappedNow) applyFpsCap(0);
		} else {
			panelEl.style.display = '';
			Array.from(panelEl.querySelectorAll('input')).forEach(function(i) { i.disabled = false; });


			var storedUncapped = localStorage.getItem(LS_KEY_FPS_UNCAPPED) === 'true';
			var storedShowKills = localStorage.getItem(LS_KEY_SHOW_KILLS) === 'true';
			var storedTextEnabled = localStorage.getItem(LS_KEY_TEXT_COLOR_ENABLED) === 'true';
			var storedTextColor = localStorage.getItem(LS_KEY_TEXT_COLOR) || '#ffffff';
			var storedBgEnabled = localStorage.getItem(LS_KEY_BG_ENABLED) === 'true';
			var storedBgUrl = localStorage.getItem(LS_KEY_BG_URL) || '';
			fpsUncappedToggle.checked = !!storedUncapped;
			kcToggle.checked = !!storedShowKills;
			textToggle.checked = !!storedTextEnabled;
			colorInput.value = storedTextColor;
			if (typeof bgToggle !== 'undefined') bgToggle.checked = !!storedBgEnabled;
			if (typeof bgUrlInput !== 'undefined') bgUrlInput.value = storedBgUrl;
			if (storedUncapped) applyFpsCap(601);
			else applyFpsCap(0);
			if (storedShowKills) ensureKillCounterShown(true);
			else removeForcedKillCounter();
			if (storedShowKills) startKillCounterEnforcer();
			else stopKillCounterEnforcer();
			if (storedTextEnabled) {
				applyCustomTextColor(storedTextColor);
				startTextColorWatcher(storedTextColor);
				colorInput.disabled = false;
			} else {
				disableCustomTextColor();
				stopTextColorWatcher();
				colorInput.disabled = true;
			}

			if (storedBgEnabled && storedBgUrl) {
				applyGameBackground(storedBgUrl);
				startBgWatcher(storedBgUrl);
			} else {
				removeGameBackground();
				stopBgWatcher();
			}
		}
	}

	function checkSplashAndTogglePanel() {
		var splash = document.getElementById('splash-ui');
		if (!splash) {

			setPanelEnabled(true);
			return;
		}
		var style = window.getComputedStyle(splash);
		var disp = style.display;
		var opacity = parseFloat(style.opacity || '1');

		setPanelEnabled(disp !== 'none' && opacity >= 0.99);
	}


	var splashElem = document.getElementById('splash-ui');
	var splashInterval = null;
	function startSplashOpacityWatcher(splash) {

		if (splashInterval) return;
		splashInterval = setInterval(checkSplashAndTogglePanel, 150);
	}

	function stopSplashOpacityWatcher() {
		if (splashInterval) {
			clearInterval(splashInterval);
			splashInterval = null;
		}
	}

	if (splashElem) {
		var splashObserver = new MutationObserver(function() { checkSplashAndTogglePanel(); });
		splashObserver.observe(splashElem, { attributes: true, attributeFilter: ['style', 'class'] });

		checkSplashAndTogglePanel();
		startSplashOpacityWatcher(splashElem);
	} else {

		var bodyObserver = new MutationObserver(function(muts, obs) {
			var found = document.getElementById('splash-ui');
			if (found) {
				checkSplashAndTogglePanel();
				startSplashOpacityWatcher(found);
				obs.disconnect();
			}
		});
		bodyObserver.observe(document.body, { childList: true, subtree: true });
	}
	}


	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', createSettingsPanel);
	} else {
		setTimeout(createSettingsPanel, 200);
	}

})();

