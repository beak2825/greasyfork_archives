// ==UserScript==
// @name         Blood Bag Reminder
// @namespace    bloodbag.reminder
// @version      4.0.1
// @description  Show a blood-bag icon when Life is full, and if there's enough medical cooldown to fill 3 bags.
// @author       ButtChew [3840391], Mr_Bob[479620]
// @license      MIT
// @match        https://*.torn.com/*
// @icon         https://i.postimg.cc/mkZ1T68H/blood-bag-2.png
// @grant GM_registerMenuCommand
// @grant GM_getValue
// @grant GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/562425/Blood%20Bag%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/562425/Blood%20Bag%20Reminder.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const CONFIG = {
		// Life bar + sidebar
		lifeBarSelector: 'a[class*="life"][class*="bar"]',
		lifeValueSelector: '[class^="bar-value"]',
		lifeDescrSelector:  '[class^="bar-descr"]',
		progressWrapSelector: 'div[class*="progress"]',
		statusIconsSelector: 'ul[class*="status-icons"]',

		// Our icon
		fullLifeIconId: 'tm-full-life-bloodbag',
		bloodBagPng: 'https://i.postimg.cc/mkZ1T68H/blood-bag-2.png',
		// Destination URLs
		destinations: {
			factionArmoury: 'https://www.torn.com/factions.php?step=your&type=1#/tab=armoury&start=0&sub=medical',
			personalInventory: 'https://www.torn.com/item.php',
		},

		pollMs: 2000,
	};

	// ===== GM_* COMPATIBILITY (TornPDA support) =====
	const safeGM = {
		getValue: (key, defaultVal) => {
			try {
				return typeof GM_getValue === 'function' ? GM_getValue(key, defaultVal) : defaultVal;
			} catch { return defaultVal; }
		},
		setValue: (key, val) => {
			try {
				if (typeof GM_setValue === 'function') GM_setValue(key, val);
			} catch { /* ignore */ }
		},
		registerMenuCommand: (name, fn) => {
			try {
				if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand(name, fn);
			} catch { /* ignore */ }
		}
	};

	// ===== SETTINGS =====
	function getDestinationURL() {
		const destination = safeGM.getValue('bloodBagDestination', 'factionArmoury');
		return CONFIG.destinations[destination] || CONFIG.destinations.factionArmoury;
	}

	function openSettingsModal() {
		const currentDestination = safeGM.getValue('bloodBagDestination', 'factionArmoury');

		const settingsModal = document.createElement('div');
		settingsModal.id = 'bloodbag-settings-modal';
		settingsModal.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.8);
			z-index: 100000;
			display: flex;
			align-items: center;
			justify-content: center;
		`;

		settingsModal.innerHTML = `
			<div style="
				background: #2e2e2e;
				border-radius: 10px;
				width: 450px;
				max-width: 90%;
				box-shadow: 0 4px 20px rgba(0,0,0,0.5);
			">
				<div style="
					background: linear-gradient(to bottom, #1a1a1a, #2a2a2a);
					padding: 15px 20px;
					border-radius: 10px 10px 0 0;
					display: flex;
					justify-content: space-between;
					align-items: center;
				">
					<h2 style="margin: 0; color: #fff; font-size: 18px;">🩸 Blood Bag Settings</h2>
					<button id="close-bloodbag-settings" style="
						background: none;
						border: none;
						color: #aaa;
						font-size: 24px;
						cursor: pointer;
						padding: 0;
						width: 30px;
						height: 30px;
					">×</button>
				</div>
				<div style="padding: 20px; color: #ccc;">
					<div style="margin-bottom: 20px;">
						<label style="display: block; margin-bottom: 5px; color: #aaa; font-size: 14px;">
							Destination Page:
						</label>
						<select id="bloodbag-destination" style="
							width: 100%;
							padding: 10px;
							background: #1a1a1a;
							border: 1px solid #444;
							border-radius: 5px;
							color: #fff;
							font-size: 14px;
							box-sizing: border-box;
						">
							<option value="factionArmoury" ${currentDestination === 'factionArmoury' ? 'selected' : ''}>Faction Armoury (Medical)</option>
							<option value="personalInventory" ${currentDestination === 'personalInventory' ? 'selected' : ''}>Personal Inventory (Medical)</option>
						</select>
						<p style="font-size: 12px; color: #888; margin-top: 5px;">
							Choose where clicking the blood bag icon takes you (opens in new tab).<br>
							<em>Tip: Long-press the icon to open this settings panel.</em>
						</p>
					</div>

					<div style="text-align: right;">
						<button id="cancel-bloodbag-settings" style="
							background: linear-gradient(to bottom, #555, #777);
							border: none;
							color: white;
							padding: 10px 20px;
							border-radius: 5px;
							cursor: pointer;
							margin-right: 10px;
							font-size: 14px;
							display: inline-flex;
							align-items: center;
							justify-content: center;
						">Cancel</button>
						<button id="save-bloodbag-settings" style="
							background: linear-gradient(to bottom, #799427, #a3c248);
							border: none;
							color: white;
							padding: 10px 20px;
							border-radius: 5px;
							cursor: pointer;
							font-size: 14px;
							display: inline-flex;
							align-items: center;
							justify-content: center;
						">Save</button>
					</div>
				</div>
			</div>
		`;

		document.body.appendChild(settingsModal);

		// Event listeners
		document.getElementById('close-bloodbag-settings').addEventListener('click', () => {
			settingsModal.remove();
		});

		document.getElementById('cancel-bloodbag-settings').addEventListener('click', () => {
			settingsModal.remove();
		});

		document.getElementById('save-bloodbag-settings').addEventListener('click', () => {
			const destination = document.getElementById('bloodbag-destination').value;
			safeGM.setValue('bloodBagDestination', destination);
			settingsModal.remove();
			// Refresh the icon with new settings
			updateFullLifeIcon();
		});

		// Close on background click
		settingsModal.addEventListener('click', (e) => {
			if (e.target === settingsModal) {
				settingsModal.remove();
			}
		});
	}

	// Register settings menu command (if supported)
	safeGM.registerMenuCommand('Blood Bag Settings', openSettingsModal);

	// Declare before anything can call scheduleLifeCheck (fixes TDZ crash)
	let lifeCheckScheduled = false;

	// One-time CSS: reset sprite bleed + allow UL to grow
	ensureResetStyles();
	ensureUlWrapFix();

	// Observe DOM changes (SPA) and poll
	const mo = new MutationObserver(() => {
		scheduleLifeCheck();
	});
	mo.observe(document.documentElement, { childList: true, subtree: true });
	setInterval(scheduleLifeCheck, CONFIG.pollMs);

	// Initial draw
	scheduleLifeCheck();

	// ===== Core =====
	function scheduleLifeCheck() {
		if (lifeCheckScheduled) return;
		lifeCheckScheduled = true;
		requestAnimationFrame(() => {
			lifeCheckScheduled = false;
			updateFullLifeIcon();
		});
	}

	function getLife() {
		const lifeBar = document.querySelector(CONFIG.lifeBarSelector);
		if (!lifeBar) return null;

		const valNode =
			lifeBar.querySelector(CONFIG.lifeValueSelector) ||
			Array.from(lifeBar.querySelectorAll('p, span, div'))
				.find((n) => /\d[\d,]*\s*\/\s*\d[\d,]*/.test(n.textContent || ''));

		let current = null, max = null;
		const text = (valNode?.textContent || '').trim();
		const m = text.match(/(\d[\d,]*)\s*\/\s*(\d[\d,]*)/);
		if (m) {
			current = parseInt(m[1].replace(/,/g, ''), 10);
			max     = parseInt(m[2].replace(/,/g, ''), 10);
		}

		const descrText    = (lifeBar.querySelector(CONFIG.lifeDescrSelector)?.textContent || '').trim().toUpperCase();
		const progressWrap = lifeBar.querySelector(CONFIG.progressWrapSelector);
		const hasFullClass = progressWrap && /\bfull___/.test(progressWrap.className);

		if (current != null && max != null && max > 0) {
			const pct = Math.round((current / max) * 100);
			const forcedPct = (descrText === 'FULL' || hasFullClass) ? 100 : pct;
			return { current, max, pct: forcedPct };
		}

		if (descrText === 'FULL' || hasFullClass) {
			const maxGuess = m ? parseInt(m[2].replace(/,/g, ''), 10) : null;
			return { current: maxGuess ?? 0, max: maxGuess ?? 0, pct: 100 };
		}
		return null;
	}

	function hmsToMs(hms) {
			if (!hms) return 0;
			const [h, m, s] = hms.split(':').map(Number);
			return ((h * 60 + m) * 60 + s) * 1000;
	}
	function getMedicalCooldownInfo() {
			const key = Object.keys(sessionStorage).find(k => /sidebarData\d+/.test(k));
			if (!key) return null;

			const data = JSON.parse(sessionStorage.getItem(key));
			const med = data?.statusIcons?.icons?.medical_cooldown;
			if (!med) return null;

			const nowSec = Date.now() / 1000;

			const remainingMs = Math.max(
					0,
					(med.timerExpiresAt - nowSec) * 1000
			);

			const maxMs = hmsToMs(med.factionUpgrade);

			return {
					remainingMs,
					maxMs,
					freeMs: Math.max(0, maxMs - remainingMs)
			};
	}

	function updateFullLifeIcon() {
		const statusUl = document.querySelector(CONFIG.statusIconsSelector);
		if (!statusUl) return;

		const existing = document.getElementById(CONFIG.fullLifeIconId);
		const life = getLife();

		const med = getMedicalCooldownInfo();
		const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
		const hasEnoughMedSpace = !med || med.freeMs >= THREE_HOURS_MS;


		const shouldShow = !!life && life.pct === 100 &&  hasEnoughMedSpace;

		if (shouldShow) {
			let label = `Full Life: ${formatNum(life.current)} / ${formatNum(life.max)}`;
			if (med) {
				const freeHrs = Math.floor(med.freeMs / 3600000);
				const freeMin = Math.floor((med.freeMs % 3600000) / 60000);
				label += ` - Cooldown space: ${freeHrs}h ${freeMin}m`;
			} else {
				label += ` - No medical cooldown`;
			}

			if (existing) {
				updateIconTooltip(existing, label);
				return;
			}
			const li = buildBloodBagIcon(label);
			statusUl.appendChild(li);
		} else if (existing) {
			existing.remove();
		}
	}

	function buildBloodBagIcon(tooltipText) {
		const li = document.createElement('li');
		li.id = CONFIG.fullLifeIconId;
		li.style.background = 'none';
		li.style.animation = 'tmPulse 900ms ease-out 1';

		const a = document.createElement('a');
		a.href = getDestinationURL();
		a.target = '_blank';
		a.rel = 'noopener noreferrer';
		a.setAttribute('aria-label', tooltipText);
		a.tabIndex = 0;
		a.setAttribute('data-is-tooltip-opened', 'false');

		const img = document.createElement('img');
		img.src = CONFIG.bloodBagPng;
		img.alt = 'Blood Bag';
		img.width = 17;
		img.height = 17;
		img.style.display = 'block';

		a.appendChild(img);
		li.appendChild(a);

		// Long-press to open settings (works on mobile/TornPDA)
		setupLongPress(a, 500, openSettingsModal);

		// Native-style tooltip
		enableNativeLikeTooltip(a);

		if (!document.getElementById('tm-pulse-style')) {
			const style = document.createElement('style');
			style.id = 'tm-pulse-style';
			style.textContent = `
				@keyframes tmPulse {
					0%   { transform: scale(0.9); }
					60%  { transform: scale(1.1); }
					100% { transform: scale(1.0); }
				}
			`;
			document.head.appendChild(style);
		}
		return li;
	}

	function setupLongPress(element, duration, callback) {
		let timer = null;
		let didLongPress = false;

		function startPress(e) {
			didLongPress = false;
			timer = setTimeout(() => {
				didLongPress = true;
				callback();
			}, duration);
		}

		function cancelPress() {
			clearTimeout(timer);
			timer = null;
		}

		function endPress(e) {
			clearTimeout(timer);
			if (didLongPress) {
				// Prevent navigation after long-press triggered settings
				e.preventDefault();
				e.stopPropagation();
				didLongPress = false;
			}
		}

		// Touch events (mobile)
		element.addEventListener('touchstart', startPress, { passive: true });
		element.addEventListener('touchend', endPress);
		element.addEventListener('touchmove', cancelPress, { passive: true });
		element.addEventListener('touchcancel', cancelPress);

		// Mouse events (desktop)
		element.addEventListener('mousedown', startPress);
		element.addEventListener('mouseup', endPress);
		element.addEventListener('mouseleave', cancelPress);

		// Prevent click if long-press occurred
		element.addEventListener('click', (e) => {
			if (didLongPress) {
				e.preventDefault();
				e.stopPropagation();
				didLongPress = false;
			}
		});
	}

	function updateIconTooltip(li, text) {
		const a = li.querySelector('a');
		if (!a) return;
		a.href = getDestinationURL();
		a.setAttribute('aria-label', text);
		if (typeof a.__tmUpdateTipText === 'function') a.__tmUpdateTipText(text);
	}

	// ===== Tooltip (native-style mimic) =====
	function enableNativeLikeTooltip(anchor) {
		let tipEl = null;
		let hideTimer = null;

		const CLS = {
			tip: 'tooltip___aWICR tooltipCustomClass___gbI4V',
			arrowWrap: 'arrow___yUDKb top___klE_Y',
			arrowIcon: 'arrowIcon___KHyjw',
		};

		function buildTooltip(text) {
			const el = document.createElement('div');
			el.className = CLS.tip;
			el.setAttribute('role', 'tooltip');
			el.setAttribute('tabindex', '-1');
			el.style.position = 'absolute';
			el.style.transitionProperty = 'opacity';
			el.style.transitionDuration = '200ms';
			el.style.opacity = '0';

			// Title (bold) + second line (like native)
			const [title, subtitle] = parseTwoLines(text);
			const b = document.createElement('b');
			b.textContent = title;
			el.appendChild(b);

			if (subtitle) {
				const div = document.createElement('div');
				div.textContent = subtitle;
				el.appendChild(div);
			}

			const arrowWrap = document.createElement('div');
			arrowWrap.className = CLS.arrowWrap;
			const arrowIcon = document.createElement('div');
			arrowIcon.className = CLS.arrowIcon;
			arrowWrap.appendChild(arrowIcon);
			el.appendChild(arrowWrap);

			return el;
		}

		function setText(text) {
			if (!tipEl) return;
			const [title, subtitle] = parseTwoLines(text);
			const b = tipEl.querySelector('b');
			if (b) b.textContent = title;
			let sub = b?.nextElementSibling;
			if (subtitle) {
				if (!sub || sub.tagName !== 'DIV') {
					sub = document.createElement('div');
					b.after(sub);
				}
				sub.textContent = subtitle;
			} else if (sub) {
				sub.remove();
			}
		}

		function parseTwoLines(text) {
			// Split on " - " to get title and subtitle
			// e.g. "Full Life: 1,230 / 1,230 - consider donating blood"
			const parts = text.split(' - ');
			if (parts.length >= 2) {
				return [parts[0].trim(), parts[1].trim()];
			}
			return [text.trim(), ''];
		}

		function positionTooltip() {
			if (!tipEl) return;

			const r = anchor.getBoundingClientRect();
			const ew = tipEl.offsetWidth;
			const eh = tipEl.offsetHeight;

			let left = Math.round(r.left + (r.width - ew) / 2);
			let top  = Math.round(r.top - eh - 14); // 10px gap + 4px nudge

			left = Math.max(8, Math.min(left, window.innerWidth - ew - 8));
			if (top < 8) {
				top = Math.round(r.bottom + 10);
			}

			tipEl.style.left = `${left}px`;
			tipEl.style.top  = `${top}px`;

			// Center arrow on icon
			const arrow = tipEl.querySelector(`.${CLS.arrowWrap.split(' ')[0]}`);
			if (arrow) {
				const iconCenter = r.left + r.width / 2;
				const arrowLeft = Math.round(iconCenter - left - 6 + 14); // 6 = arrowW/2, 14 = nudge for icon
				arrow.style.left = `${arrowLeft}px`;
			}
		}

		function showTip() {
			clearTimeout(hideTimer);
			const text = anchor.getAttribute('aria-label');
			if (!text) return;

			if (!tipEl) {
				tipEl = buildTooltip(text);
				document.body.appendChild(tipEl);
				anchor.__tmTipEl = tipEl;
			} else {
				setText(text);
			}

			anchor.setAttribute('data-is-tooltip-opened', 'true');

			// First layout offscreen, then position + fade in
			tipEl.style.opacity = '0';
			tipEl.style.left = '-9999px';
			tipEl.style.top = '-9999px';
			requestAnimationFrame(() => {
				positionTooltip();
				requestAnimationFrame(() => {
					if (tipEl) tipEl.style.opacity = '1';
				});
			});
		}

		function hideTip(immediate = false) {
			if (!tipEl) return;
			anchor.setAttribute('data-is-tooltip-opened', 'false');

			if (immediate) {
				tipEl.remove();
				anchor.__tmTipEl = null;
				tipEl = null;
				return;
			}
			tipEl.style.opacity = '0';
			hideTimer = setTimeout(() => {
				tipEl?.remove();
				anchor.__tmTipEl = null;
				tipEl = null;
			}, 210);
		}

		// Expose updater so we can refresh text on life changes
		anchor.__tmUpdateTipText = (text) => setText(text);

		anchor.addEventListener('mouseenter', showTip);
		anchor.addEventListener('mouseleave', () => hideTip(false));
		anchor.addEventListener('focus', showTip);
		anchor.addEventListener('blur', () => hideTip(true));
		window.addEventListener('scroll', () => hideTip(true), { passive: true });
	}

	// ===== CSS guards =====
	function ensureResetStyles() {
		if (document.getElementById('tm-full-life-icon-reset')) return;
		const s = document.createElement('style');
		s.id = 'tm-full-life-icon-reset';
		s.textContent = `
			#tm-full-life-bloodbag,
			#tm-full-life-bloodbag a,
			#tm-full-life-bloodbag img {
				background: none !important;
				background-image: none !important;
				-webkit-mask: none !important;
				mask: none !important;
				box-shadow: none !important;
				border: none !important;
			}
			#tm-full-life-bloodbag::before,
			#tm-full-life-bloodbag::after,
			#tm-full-life-bloodbag a::before,
			#tm-full-life-bloodbag a::after { content: none !important; }
		`;
		document.head.appendChild(s);
	}

	function ensureUlWrapFix() {
		if (document.getElementById('tm-status-ul-fix')) return;
		const s = document.createElement('style');
		s.id = 'tm-status-ul-fix';
		s.textContent = `
			ul[class*="status-icons"] {
				height: auto !important;
				overflow: visible !important;
			}
		`;
		document.head.appendChild(s);
	}

	// ===== utils =====
	function formatNum(n) { try { return n.toLocaleString(); } catch { return String(n); } }
})();
