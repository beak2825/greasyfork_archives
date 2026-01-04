// ==UserScript==
// @license      MIT
// @name         Overheaven Line+FPS
// @namespace    https://gota.io/
// @version      2.7.0
// @description  Mass feed + line macros with FPS uncap and full keyboard support
// @author       Overheaven | @kazura667 (Discord)
// @match        https://gota.io/web*
// @grant        none
// @run-at       document-end
// @note If you have any trouble with the script feel free to dm me, if you can't line right use the "Freeze mouse" option. A tutorial have been posted on @Overheaven Gota channel.

// @downloadURL https://update.greasyfork.org/scripts/549189/Overheaven%20Line%2BFPS.user.js
// @updateURL https://update.greasyfork.org/scripts/549189/Overheaven%20Line%2BFPS.meta.js
// ==/UserScript==

(function() {
	'use strict';

	if (window.top !== window.self) return;

	// ---------- Config ----------
	const defaultConfig = {
		enabled: true,
		removeFpsLimit: true,
		fastFeedKey: 'F',
		lineUpKey: 'W',
		lineDownKey: 'S',
		lineLeftKey: 'A',
		lineRightKey: 'D',
		diagonalUpLeftKey: 'Q',
		diagonalUpRightKey: 'E',
		diagonalDownLeftKey: 'Z',
		diagonalDownRightKey: 'C',
		fastFeedSpeed: 50,
		lineSpeed: 30
	};
	let config = loadConfig();

	function loadConfig() {
		try {
			const raw = localStorage.getItem('gota-macros-config');
			if (!raw) return { ...defaultConfig };
			return { ...defaultConfig, ...JSON.parse(raw) };
		} catch {
			return { ...defaultConfig };
		}
	}
	function saveConfig() {
		localStorage.setItem('gota-macros-config', JSON.stringify(config));
	}

	// ---------- State ----------
	let isFastFeeding = false;
	let isDrawingLine = false;
	let fastFeedInterval = null;
	let lineInterval = null;
	let lastMouse = { x: 0, y: 0 };
	let panel = null;
	let currentLineDirection = null;
	let lineModeIndicator = null;

	document.addEventListener('mousemove', function(e) {
		lastMouse.x = e.clientX;
		lastMouse.y = e.clientY;
	}, { passive: true });

	// ---------- FPS Uncap ----------
	if (config.removeFpsLimit) {
		const originalRAF = window.requestAnimationFrame;
		let lastTime = 0;
		window.requestAnimationFrame = function(callback) {
			const now = performance.now();
			const deltaTime = now - lastTime;
			lastTime = now;
			return setTimeout(() => {
				callback(now);
			}, Math.max(0, 8 - deltaTime));
		};

		const canvas = document.querySelector('canvas');
		if (canvas) {
			canvas.style.imageRendering = 'pixelated';
			canvas.style.animationDuration = '0s';
		}

		const originalSetTimeout = window.setTimeout;
		window.setTimeout = function(callback, delay) {
			if (delay < 16) delay = 1;
			return originalSetTimeout(callback, delay);
		};
	}

	// ---------- Create Panel First ----------
	function createPanel() {
		panel = document.createElement('div');
		panel.id = 'gota-macros-panel';
		panel.style.cssText = `
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 450px;
			max-height: 85vh;
			background: rgba(0,0,0,0.95);
			color: white;
			padding: 25px;
			border-radius: 15px;
			font-family: Arial, sans-serif;
			font-size: 14px;
			z-index: 100000;
			display: none;
			backdrop-filter: blur(10px);
			border: 3px solid #f44336;
			box-shadow: 0 10px 40px rgba(0,0,0,0.6);
			overflow-y: auto;
		`;

		panel.innerHTML = `
			<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
				<h2 style="margin:0;color:#f44336;font-size:22px;text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Overheaven Line+FPS</h2>
				<button id="gm-close" style="background:#f44336;border:none;color:#fff;padding:8px 15px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:16px;">✕</button>
			</div>

			<div style="margin-bottom:20px;">
				<label style="display:flex;align-items:center;gap:10px;font-size:16px;">
					<input type="checkbox" id="gm-enabled" ${config.enabled ? 'checked' : ''} style="transform:scale(1.3);">
					<span style="font-weight:bold;">Enable Macros</span>
				</label>
			</div>
			<div style="margin-bottom:25px;">
				<label style="display:flex;align-items:center;gap:10px;font-size:16px;">
					<input type="checkbox" id="gm-fps" ${config.removeFpsLimit ? 'checked' : ''} style="transform:scale(1.3);">
					<span style="font-weight:bold;">Remove FPS limit (120+ FPS)</span>
				</label>
			</div>

			<div style="border-top:3px solid #f44336;margin:20px 0;padding-top:20px;">
				<h3 style="margin:0 0 15px 0;color:#f44336;font-size:18px;text-shadow: 0 1px 2px rgba(0,0,0,0.5);">Mass Feed</h3>
				<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px;">
					<div>
						<label style="display:block;margin-bottom:8px;font-size:13px;color:#ccc;font-weight:bold;">Key</label>
						<input type="text" id="gm-k-fast" value="${config.fastFeedKey}" maxlength="1" style="width:100%;height:36px;text-align:center;border-radius:8px;border:2px solid #f44336;background:#222;color:#fff;font-size:16px;font-weight:bold;">
					</div>
					<div>
						<label style="display:block;margin-bottom:8px;font-size:13px;color:#ccc;font-weight:bold;">Speed (ms)</label>
						<input type="number" id="gm-fast-speed" value="${config.fastFeedSpeed}" min="10" max="200" style="width:100%;height:36px;text-align:center;border-radius:8px;border:2px solid #f44336;background:#222;color:#fff;font-size:16px;font-weight:bold;">
					</div>
				</div>
			</div>

			<div style="border-top:3px solid #f44336;margin:20px 0;padding-top:20px;">
				<h3 style="margin:0 0 15px 0;color:#f44336;font-size:18px;text-shadow: 0 1px 2px rgba(0,0,0,0.5);">Lines</h3>
				<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;">
					<div>
						<label style="display:block;margin-bottom:5px;font-size:12px;color:#ccc;font-weight:bold;">Up</label>
						<input type="text" id="gm-k-up" value="${config.lineUpKey}" maxlength="1" style="width:100%;height:32px;text-align:center;border-radius:6px;border:2px solid #f44336;background:#222;color:#fff;font-size:14px;font-weight:bold;">
					</div>
					<div>
						<label style="display:block;margin-bottom:5px;font-size:12px;color:#ccc;font-weight:bold;">Down</label>
						<input type="text" id="gm-k-down" value="${config.lineDownKey}" maxlength="1" style="width:100%;height:32px;text-align:center;border-radius:6px;border:2px solid #f44336;background:#222;color:#fff;font-size:14px;font-weight:bold;">
					</div>
					<div>
						<label style="display:block;margin-bottom:5px;font-size:12px;color:#ccc;font-weight:bold;">Left</label>
						<input type="text" id="gm-k-left" value="${config.lineLeftKey}" maxlength="1" style="width:100%;height:32px;text-align:center;border-radius:6px;border:2px solid #f44336;background:#222;color:#fff;font-size:14px;font-weight:bold;">
					</div>
					<div>
						<label style="display:block;margin-bottom:5px;font-size:12px;color:#ccc;font-weight:bold;">Right</label>
						<input type="text" id="gm-k-right" value="${config.lineRightKey}" maxlength="1" style="width:100%;height:32px;text-align:center;border-radius:6px;border:2px solid #f44336;background:#222;color:#fff;font-size:14px;font-weight:bold;">
					</div>
					<div>
						<label style="display:block;margin-bottom:5px;font-size:12px;color:#ccc;font-weight:bold;">Up-Left</label>
						<input type="text" id="gm-k-upleft" value="${config.diagonalUpLeftKey}" maxlength="1" style="width:100%;height:32px;text-align:center;border-radius:6px;border:2px solid #f44336;background:#222;color:#fff;font-size:14px;font-weight:bold;">
					</div>
					<div>
						<label style="display:block;margin-bottom:5px;font-size:12px;color:#ccc;font-weight:bold;">Up-Right</label>
						<input type="text" id="gm-k-upright" value="${config.diagonalUpRightKey}" maxlength="1" style="width:100%;height:32px;text-align:center;border-radius:6px;border:2px solid #f44336;background:#222;color:#fff;font-size:14px;font-weight:bold;">
					</div>
					<div>
						<label style="display:block;margin-bottom:5px;font-size:12px;color:#ccc;font-weight:bold;">Down-Left</label>
						<input type="text" id="gm-k-downleft" value="${config.diagonalDownLeftKey}" maxlength="1" style="width:100%;height:32px;text-align:center;border-radius:6px;border:2px solid #f44336;background:#222;color:#fff;font-size:14px;font-weight:bold;">
					</div>
					<div>
						<label style="display:block;margin-bottom:5px;font-size:12px;color:#ccc;font-weight:bold;">Down-Right</label>
						<input type="text" id="gm-k-downright" value="${config.diagonalDownRightKey}" maxlength="1" style="width:100%;height:32px;text-align:center;border-radius:6px;border:2px solid #f44336;background:#222;color:#fff;font-size:14px;font-weight:bold;">
					</div>
				</div>
				<div style="margin-top:15px;">
					<label style="display:block;margin-bottom:8px;font-size:13px;color:#ccc;font-weight:bold;">Line Speed (ms)</label>
					<input type="number" id="gm-line-speed" value="${config.lineSpeed}" min="10" max="100" style="width:140px;height:36px;text-align:center;border-radius:8px;border:2px solid #f44336;background:#222;color:#fff;font-size:16px;font-weight:bold;">
				</div>
			</div>

			<div style="display:flex;justify-content:space-between;gap:15px;margin-top:25px;">
				<button id="gm-reset" style="background:#666;border:none;color:#fff;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:14px;">Reset</button>
				<button id="gm-save" style="background:#f44336;border:none;color:#fff;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:14px;">Save & Close</button>
			</div>

			<div style="margin-top:25px;font-size:13px;color:#aaa;text-align:center;border-top:2px solid #f44336;padding-top:15px;line-height:1.6;">
				<div style="font-size:16px;color:#f44336;font-weight:bold;margin-bottom:8px;">
					 OVERHEAVEN LINE+FPS 🔥
				</div>
				<div style="font-size:14px;color:#fff;margin-bottom:5px;">
					<strong>Created by:</strong> <span style="color:#f44336;font-weight:bold;">Overheaven</span>
				</div>
				<div style="font-size:14px;color:#fff;margin-bottom:5px;">
					<strong>Discord:</strong> <span style="color:#f44336;font-weight:bold;">@kazura667</span>
				</div>
				<div style="font-size:12px;color:#888;margin-top:10px;">
					Press <strong style="color:#f44336;">Ctrl+M</strong> to toggle menu<br>
					Supports ALL keyboard keys including numbers!
				</div>
			</div>
		`;

		document.body.appendChild(panel);

		// Panel event handlers
		panel.querySelector('#gm-close').addEventListener('click', () => {
			panel.style.display = 'none';
		});

		// Key input handlers - Support ALL keys including numbers
		const keyIds = ['gm-k-fast','gm-k-up','gm-k-down','gm-k-left','gm-k-right','gm-k-upleft','gm-k-upright','gm-k-downleft','gm-k-downright'];
		keyIds.forEach(id => {
			const input = panel.querySelector('#' + id);
			input.addEventListener('keydown', (e) => {
				e.preventDefault();
				let key = e.key;

				// Handle special keys
				if (e.key === ' ') key = 'SPACE';
				if (e.key === 'Enter') key = 'ENTER';
				if (e.key === 'Tab') key = 'TAB';
				if (e.key === 'Escape') key = 'ESC';
				if (e.key === 'ArrowUp') key = 'UP';
				if (e.key === 'ArrowDown') key = 'DOWN';
				if (e.key === 'ArrowLeft') key = 'LEFT';
				if (e.key === 'ArrowRight') key = 'RIGHT';
				if (e.key === 'Shift') key = 'SHIFT';
				if (e.key === 'Control') key = 'CTRL';
				if (e.key === 'Alt') key = 'ALT';

				// Handle function keys
				if (e.key.startsWith('F') && e.key.length === 2) key = e.key;

				// Handle numbers
				if (e.key >= '0' && e.key <= '9') key = e.key;

				// Handle letters
				if (e.key.length === 1) key = e.key.toUpperCase();

				input.value = key;
			});
			input.addEventListener('input', () => {
				input.value = (input.value || '').slice(0,1).toUpperCase();
			});
		});

		panel.querySelector('#gm-save').addEventListener('click', () => {
			config.enabled = panel.querySelector('#gm-enabled').checked;
			config.removeFpsLimit = panel.querySelector('#gm-fps').checked;
			config.fastFeedKey = panel.querySelector('#gm-k-fast').value || defaultConfig.fastFeedKey;
			config.fastFeedSpeed = Math.max(10, Math.min(200, parseInt(panel.querySelector('#gm-fast-speed').value) || defaultConfig.fastFeedSpeed));
			config.lineUpKey = panel.querySelector('#gm-k-up').value || defaultConfig.lineUpKey;
			config.lineDownKey = panel.querySelector('#gm-k-down').value || defaultConfig.lineDownKey;
			config.lineLeftKey = panel.querySelector('#gm-k-left').value || defaultConfig.lineLeftKey;
			config.lineRightKey = panel.querySelector('#gm-k-right').value || defaultConfig.lineRightKey;
			config.diagonalUpLeftKey = panel.querySelector('#gm-k-upleft').value || defaultConfig.diagonalUpLeftKey;
			config.diagonalUpRightKey = panel.querySelector('#gm-k-upright').value || defaultConfig.diagonalUpRightKey;
			config.diagonalDownLeftKey = panel.querySelector('#gm-k-downleft').value || defaultConfig.diagonalDownLeftKey;
			config.diagonalDownRightKey = panel.querySelector('#gm-k-downright').value || defaultConfig.diagonalDownRightKey;
			config.lineSpeed = Math.max(10, Math.min(100, parseInt(panel.querySelector('#gm-line-speed').value) || defaultConfig.lineSpeed));

			saveConfig();
			panel.style.display = 'none';
		});

		panel.querySelector('#gm-reset').addEventListener('click', () => {
			if (confirm('Reset all settings to defaults?')) {
				config = { ...defaultConfig };
				saveConfig();
				location.reload();
			}
		});

		panel.addEventListener('click', (e) => e.stopPropagation());
	}

	// ---------- In-Game Button (Black & Red) ----------
	function createInGameUI() {
		const checkForGameUI = setInterval(() => {
			const mainBottom = document.querySelector('.main-bottom-left, .main-bottom-right');
			if (!mainBottom) return;

			clearInterval(checkForGameUI);

			const btn = document.createElement('button');
			btn.id = 'gota-macros-btn';
			btn.className = 'gota-btn bottom-btn';
			btn.style.cssText = `
				position: relative;
				margin: 5px 3px;
				float: none;
				border-radius: 3px 10px 10px 3px;
				white-space: nowrap;
				overflow: hidden;
				background: linear-gradient(135deg, #000, #333);
				border: 2px solid #f44336;
				color: #f44336;
				font-weight: bold;
				text-shadow: 0 1px 2px rgba(0,0,0,0.5);
				box-shadow: 0 2px 4px rgba(0,0,0,0.3);
				cursor: pointer;
			`;
			btn.innerHTML = 'Overheaven';
			btn.title = 'Click to configure macros (Ctrl+M)';

			btn.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				console.log('Overheaven button clicked!');
				if (panel) {
					panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
				}
			});

			mainBottom.appendChild(btn);
			console.log('Overheaven button added to game UI');
		}, 100);
	}

	// ---------- Macros ----------
	function startFastFeed() {
		if (!config.enabled || isFastFeeding) return;
		isFastFeeding = true;
		console.log('Starting mass feed');
		fastFeedInterval = setInterval(() => {
			if (!config.enabled) return;
			// Use 'w' key for mass ejection (not space for splitting)
			const evt = new KeyboardEvent('keydown', { key: 'w', code: 'KeyW', keyCode: 87, which: 87, bubbles: true });
			document.dispatchEvent(evt);
		}, config.fastFeedSpeed);
	}
	function stopFastFeed() {
		isFastFeeding = false;
		if (fastFeedInterval) { clearInterval(fastFeedInterval); fastFeedInterval = null; }
		console.log('Stopped mass feed');
	}

	// ---------- Line Mode Indicator ----------
	function showLineModeIndicator(direction) {
		hideLineModeIndicator();

		lineModeIndicator = document.createElement('div');
		lineModeIndicator.id = 'lineModeIndicator';
		lineModeIndicator.style.cssText = `
			position: fixed;
			top: 20px;
			left: 50%;
			transform: translateX(-50%);
			background: rgba(0, 0, 0, 0.9);
			color: #f44336;
			padding: 10px 20px;
			border-radius: 5px;
			font-family: Arial, sans-serif;
			font-size: 16px;
			font-weight: bold;
			z-index: 10000;
			pointer-events: none;
			border: 2px solid #f44336;
		`;
		lineModeIndicator.textContent = `LINE MODE: ${direction.toUpperCase()}`;
		document.body.appendChild(lineModeIndicator);
	}

	function hideLineModeIndicator() {
		if (lineModeIndicator) {
			lineModeIndicator.remove();
			lineModeIndicator = null;
		}
	}

	// ---------- Line Splitting (FIXED - Based on Agario Train Line Controller approach) ----------
	function moveMouse(X, Y) {
		const canvas = document.querySelector('canvas');
		if (!canvas) return;

		// Use the same approach as the working script
		const mouseMoveEvent = new MouseEvent('mousemove', {
			clientX: X,
			clientY: Y,
			bubbles: true,
			cancelable: true,
			view: window
		});
		canvas.dispatchEvent(mouseMoveEvent);
	}

	function startLine(direction) {
		if (!config.enabled || isDrawingLine) return;

		isDrawingLine = true;
		currentLineDirection = direction;
		console.log('Starting line in direction:', direction);

		// Show line mode indicator
		showLineModeIndicator(direction);

		// Calculate screen dimensions
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;
		const centerX = screenWidth / 2;
		const centerY = screenHeight / 2;
		const squareSize = Math.min(screenWidth, screenHeight);
		const halfSquareSize = squareSize / 2;

		// Calculate target position based on direction (like the working script)
		let targetX, targetY;
		switch (direction) {
			case 'up':
				targetX = centerX;
				targetY = centerY - halfSquareSize;
				break;
			case 'down':
				targetX = centerX;
				targetY = centerY + halfSquareSize;
				break;
			case 'left':
				targetX = centerX - halfSquareSize;
				targetY = centerY;
				break;
			case 'right':
				targetX = centerX + halfSquareSize;
				targetY = centerY;
				break;
			case 'upLeft':
				targetX = centerX - halfSquareSize;
				targetY = centerY - halfSquareSize;
				break;
			case 'upRight':
				targetX = centerX + halfSquareSize;
				targetY = centerY - halfSquareSize;
				break;
			case 'downLeft':
				targetX = centerX - halfSquareSize;
				targetY = centerY + halfSquareSize;
				break;
			case 'downRight':
				targetX = centerX + halfSquareSize;
				targetY = centerY + halfSquareSize;
				break;
			default:
				return;
		}

		// Move mouse to calculated position
		moveMouse(targetX, targetY);
	}

	function stopLine() {
		if (!isDrawingLine) return;

		isDrawingLine = false;
		currentLineDirection = null;

		// Hide line mode indicator
		hideLineModeIndicator();
		console.log('Stopped line drawing');
	}

	// ---------- Input handling with chat protection (FIXED) ----------
	function isKey(cfgKey, e) {
		if (!cfgKey) return false;

		// Don't trigger macros when typing in chat
		const chatInput = document.querySelector('#chat-input, input[type="text"], textarea');
		if (chatInput && chatInput === document.activeElement) {
			return false;
		}

		let key = e.key;

		// Handle special keys
		if (e.key === ' ') key = 'SPACE';
		if (e.key === 'Enter') key = 'ENTER';
		if (e.key === 'Tab') key = 'TAB';
		if (e.key === 'Escape') key = 'ESC';
		if (e.key === 'ArrowUp') key = 'UP';
		if (e.key === 'ArrowDown') key = 'DOWN';
		if (e.key === 'ArrowLeft') key = 'LEFT';
		if (e.key === 'ArrowRight') key = 'RIGHT';
		if (e.key === 'Shift') key = 'SHIFT';
		if (e.key === 'Control') key = 'CTRL';
		if (e.key === 'Alt') key = 'ALT';

		// Handle function keys
		if (e.key.startsWith('F') && e.key.length === 2) key = e.key;

		// Handle numbers and letters
		if (e.key.length === 1) key = e.key.toUpperCase();

		return key === cfgKey.toUpperCase();
	}

	document.addEventListener('keydown', function(e) {
		if (e.ctrlKey && e.key.toLowerCase() === 'm') {
			e.preventDefault();
			if (panel) {
				panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
			}
			return;
		}
		if (!config.enabled) return;

		// Check if we should start a new line direction
		const lineKeys = {
			[config.lineUpKey]: 'up',
			[config.lineDownKey]: 'down',
			[config.lineLeftKey]: 'left',
			[config.lineRightKey]: 'right',
			[config.diagonalUpLeftKey]: 'upLeft',
			[config.diagonalUpRightKey]: 'upRight',
			[config.diagonalDownLeftKey]: 'downLeft',
			[config.diagonalDownRightKey]: 'downRight'
		};

		// Handle fast feed
		if (isKey(config.fastFeedKey, e)) {
			e.preventDefault();
			isFastFeeding ? stopFastFeed() : startFastFeed();
			return;
		}

		// Handle line keys
		for (const [key, direction] of Object.entries(lineKeys)) {
			if (isKey(key, e)) {
				e.preventDefault();
				// Hold mode: start line
				stopLine(); // Stop any current line first
				startLine(direction);
				return;
			}
		}
	});

	document.addEventListener('keyup', function(e) {
		if (!config.enabled) return;

		// Only stop if the key matches current direction
		const lineKeys = {
			[config.lineUpKey]: 'up',
			[config.lineDownKey]: 'down',
			[config.lineLeftKey]: 'left',
			[config.lineRightKey]: 'right',
			[config.diagonalUpLeftKey]: 'upLeft',
			[config.diagonalUpRightKey]: 'upRight',
			[config.diagonalDownLeftKey]: 'downLeft',
			[config.diagonalDownRightKey]: 'downRight'
		};

		for (const [key, direction] of Object.entries(lineKeys)) {
			if (isKey(key, e) && currentLineDirection === direction) {
				stopLine();
				return;
			}
		}
	});

	document.addEventListener('click', function(e) {
		if (panel && panel.style.display === 'block' && !panel.contains(e.target)) {
			panel.style.display = 'none';
		}
	});

	// ---------- Boot ----------
	createPanel();
	createInGameUI();
	console.log(' OVERHEAVEN LINE+FPS loaded! By Overheaven | @kazura667 (Discord) ��');
})();