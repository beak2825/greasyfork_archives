// ==UserScript==
// @name         GeoPixels++
// @description  QOL features for https://geopixels.net/ with color palette management
// @author       Thinkbot
// @contributor  Observable
// @contributor  Phlegethonia
// @contributor  h65e3j
// @version      0.7.0
// @match        https://*.geopixels.net/*
// @namespace    https://github.com/thin-kbot
// @homepage     https://github.com/thin-kbot/geopixels-plusplus
// @icon         https://raw.githubusercontent.com/thin-kbot/geopixels-plusplus/refs/heads/main/img/icon.png
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @supportURL   https://ko-fi.com/thinkbot
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/562355/GeoPixels%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/562355/GeoPixels%2B%2B.meta.js
// ==/UserScript==

(function () {
	//#region Global variables
	const usw = unsafeWindow;

	const LOG_LEVELS = {
		error: { label: "ERR", color: "red" },
		info: { label: "INF", color: "lime" },
		warn: { label: "WRN", color: "yellow" },
		debug: { label: "DBG", color: "cyan" },
	};

	const STORAGE_KEYS = {
		censor: "geo++_censorRects",
		keybinds: "geo++_keybinds",
		settings: "geo++_settings",
	};

	const SOUNDS = [
		{
			name: "Pixel placement",
			variable: "soundBufferPop",
		},
		{
			name: '"Paint"',
			variable: "soundBufferThump",
		},
		{
			name: "Max charges reached",
			variable: "soundBufferMaxCharges",
		},
	];
	let soundToChangeIdx = 0;

	let censorRects;
	let censorMode = false;
	let isDraggingCensor = false;
	let censorStartPoint = null;
	let tempCensorRect = null;
	let oldCensorRect = null;
	let censorCanvas;

	const KEY_BINDINGS = {
		toggleGhost: {
			text: "Toggle ghost image",
			defaultKey: "y",
			keydown: () => document.getElementById("ghost-canvas").toggleAttribute("hidden"),
		},
		placeGhost: {
			text: "Set ghost image's top left",
			defaultKey: "e",
			keydown: () => {
				const pos = screenPointToGrid(document.getElementById("pixel-canvas"), mouseX, mouseY);
				ghostImageTopLeft = pos;
				localStorage.setItem("ghostImageCoords", JSON.stringify(pos));
				log(LOG_LEVELS.debug, "Ghost image position set.");
				drawGhostImageOnCanvas();
			},
		},
		toggleCensorMode: {
			text: "Toggle Censor Mode",
			defaultKey: "m",
			keydown: () => toggleCensorMode(),
		},
		addCensorRect: {
			text: "Add one Censor Rect at Mouse",
			defaultKey: "l",
			keydown: (e) => {
				if (e.repeat) return;
				if (!censorMode) enableCensorMode();
				startCensorDraw();
			},
			keyup: (e) => {
				if (e.repeat || !isDraggingCensor) return;
				endCensorDraw();
				if (censorMode) disableCensorMode();
			},
		},
	};
	let mouseX, mouseY;

	const THEMES = {
		system: {
			name: "System default",
			style: () =>
				window.matchMedia("(prefers-color-scheme: dark)").matches ? THEMES.simple_black.style : "",
		},
		default: {
			name: "GeoPixels++ Default",
			style: "",
		},
		simple_black: {
			name: "Simple Black",
			style:
				":root{color-scheme:dark;--color-red-900:#ffe2e2;--color-red-800:#ffc9c9;--color-red-700:#ffa2a2;--color-red-600:#ff6467;--color-red-500:#fb2c36;--color-red-400:#e7000b;--color-red-300:#c10007;--color-red-200:#9f0712;--color-red-100:#82181a;--color-red-50:#460809;--color-orange-800:#ffd6a7;--color-orange-700:#ffb869;--color-orange-600:#ff8903;--color-orange-500:#ff6900;--color-orange-400:#f54900;--color-orange-200:#9f2d00;--color-orange-100:#7e2a0c;--color-orange-50:#441306;--color-yellow-900:#fef9c2;--color-yellow-800:#fff085;--color-yellow-700:#ffdf20;--color-yellow-600:#fdc700;--color-yellow-500:#f0b100;--color-yellow-400:#d08700;--color-yellow-300:#a65f00;--color-yellow-200:#894b00;--color-yellow-100:#733e0a;--color-yellow-50:#432004;--color-green-900:#dcfce7;--color-green-700:#7bf1a7;--color-green-600:#06df72;--color-green-500:#00c950;--color-green-200:#026630;--color-green-100:#0d542b;--color-green-50:#032e15;--color-sky-800:#b8e6fe;--color-sky-500:#00a6f4;--color-sky-200:#00598a;--color-sky-50:#052f4a;--color-blue-900:#dbeafe;--color-blue-800:#bedbff;--color-blue-700:#8ec5ff;--color-blue-600:#50a2ff;--color-blue-500:#2b7fff;--color-blue-400:#155dfb;--color-blue-300:#1447e6;--color-blue-200:#193cb8;--color-blue-100:#1c398e;--color-blue-50:#162556;--color-indigo-700:#a3b3ff;--color-indigo-600:#7c86ff;--color-indigo-500:#615fff;--color-purple-600:#c27aff;--color-purple-500:#ad46ff;--color-slate-700:#cad5e2;--color-slate-500:#62748e;--color-gray-900:#f3f4f6;--color-gray-800:#e5e7eb;--color-gray-700:#d1d5db;--color-gray-600:#99a1af;--color-gray-500:#6a7282;--color-gray-400:#4a5565;--color-gray-300:#364153;--color-gray-200:#1e2939;--color-gray-100:#101828;--color-gray-50:#030712;--color-white:#000;color:#fff}select{background:#000}.keybind-input{color:#d1d5db;background-color:#1f2937;border-color:#4b5563}#hoverProfileImg,#hoverBannerImg{background:#fff}#visualIdentitySection svg,#visualIdentitySection span{color:#fff;}",
		},
	};

	const SETTINGS_CATEGORIES = {
		appearance: "Appearance",
		censor: "Censor",
		keybinds: "Keybindings",
	};

	const SETTINGS = {
		theme: {
			name: "UI Theme",
			element: "select",
			category: SETTINGS_CATEGORIES.appearance,
			options: Object.entries(THEMES).map(([id, { name }]) => ({ value: id, text: name })),
			default: "system",
			apply: (val) => {
				let themeStyle = document.getElementById("gpp-theme-style");
				if (!themeStyle) {
					themeStyle = document.createElement("style");
					themeStyle.id = "gpp-theme-style";
					document.head.appendChild(themeStyle);
				}
				themeStyle.innerHTML =
					typeof THEMES[val]?.style === "function" ? THEMES[val].style() : THEMES[val]?.style ?? "";
			},
			attributes: {
				onchange: (e) => {
					SETTINGS.theme.apply(e.target.value);
					saveSetting("theme", e.target.value);
				},
			},
		},
		censorColor: {
			name: "Censor rects color",
			element: "input",
			category: SETTINGS_CATEGORIES.censor,
			default: "#000",
			attributes: {
				type: "color",
				onchange: (e) => {
					saveSetting("censorColor", e.target.value);
					drawCensorRects();
				},
				oninput: (e) => {
					settings.censorColor = e.target.value;
					drawCensorRects();
				},
			},
		},
		censorAlpha: {
			name: "Censor rects alpha",
			element: "input",
			category: SETTINGS_CATEGORIES.censor,
			default: 1,
			attributes: {
				type: "range",
				min: 0,
				max: 1,
				step: 0.01,
				onchange: (e) => {
					saveSetting("censorAlpha", e.target.value);
					drawCensorRects();
				},
				oninput: (e) => {
					settings.censorAlpha = e.target.value;
					drawCensorRects();
				},
			},
		},
		doInteractCensor: {
			name: "Interact with censors out of censor mode",
			element: "input",
			category: SETTINGS_CATEGORIES.censor,
			default: true,
			attributes: {
				type: "checkbox",
				onchange: (e) => saveSetting("doInteractCensor", e.target.checked),
			},
		},
		censorTextarea: {
			name: "Censor config",
			element: "textarea",
			category: SETTINGS_CATEGORIES.censor,
			value: () => JSON.stringify(getCensorRects()),
			init: (elm) =>
				document.addEventListener(
					"censorRectsChanged",
					() => (elm.value = JSON.stringify(getCensorRects()))
				),
			reset: (elm) => {
				elm.value = SETTINGS.censorTextarea.value();
				elm.dispatchEvent(new Event("input"));
			},
			attributes: {
				onchange: (e) => {
					let config;
					try {
						config = JSON.parse(e.target.value);
					} catch (err) {
						return alert(`Invalid json: ${err.message}`);
					}

					if (!isValidCensorConfig(config)) return alert("Invalid censor config");

					saveCensorRects(config);
					validateInput(e.target);
					log(LOG_LEVELS.info, "replaced Censor rects with", config);
				},
				oninput: (e) => {
					if (!isJsonString(e.target.value) || !isValidCensorConfig(JSON.parse(e.target.value)))
						e.target.style.borderColor = "red";
					else e.target.style.borderColor = "";
				},
			},
		},
		openCensorConfig: {
			name: "Open Censors Config",
			element: "button",
			category: SETTINGS_CATEGORIES.censor,
			attributes: { onclick: createCensorsConfigModal },
		},
		...Object.fromEntries(
			Object.entries(KEY_BINDINGS).map(([id, binding]) => [
				`keybind_${id}`,
				{
					name: `${binding.text}`,
					element: "input",
					category: SETTINGS_CATEGORIES.keybinds,
					value: () => keybinds[id] || "",
					...(binding.defaultKey && {
						reset: (elm) => {
							elm.value = binding.defaultKey;
							elm.dispatchEvent(new Event("change"));
						},
					}),
					attributes: {
						type: "keybind",
						onclick: (e) => e.target.select(),
						onchange: (e) => {
							saveKeybind(id, e.target.value.trim().toLowerCase());
							validateInput(e.target);
						},
					},
				},
			])
		),
	};
	//#endregion Global variables

	//#region Utils
	function log(lvl, ...args) {
		console.log(
			`%c[GeoPixels++] %c[${lvl.label}]`,
			"color: mediumvioletred;",
			`color:${lvl.color};`,
			...args
		);
	}

	function isJsonString(str) {
		try {
			JSON.parse(str);
		} catch {
			return false;
		}
		return true;
	}

	function screenPointToGrid(canvas, mX, mY) {
		const rect = canvas.getBoundingClientRect();

		// Convert screen coordinates to map coordinates
		const lngLat = map.unproject([mX - rect.left, mY - rect.top]);
		const merc = turf.toMercator([lngLat.lng, lngLat.lat]);

		return {
			gridX: Math.round(merc[0] / gridSize),
			gridY: Math.round(merc[1] / gridSize),
		};
	}

	function validateInput(elm) {
		elm.style.borderColor = "green";
		const td = parseFloat(getComputedStyle(elm).transitionDuration) * 2;
		setTimeout(() => (elm.style.borderColor = ""), (td ?? 0.5) * 1000);
	}

	function getAllCoordsBetween(a, b, size = 1) {
		const coords = [];
		for (let x = Math.min(a.x, b.x); x <= Math.max(a.x, b.x); x += size)
			for (let y = Math.min(a.y, b.y); y <= Math.max(a.y, b.y); y += size) coords.push({ x, y });
		return coords;
	}

	const snapToTile = (value) => Math.floor(value / SYNC_TILE_SIZE) * SYNC_TILE_SIZE;
	//#endregion Utils

	//#region Color Utils
	const cToHex = (c) => (+c).toString(16).padStart(2, "0");
	const hexToC = (h) => parseInt(h, 16);
	function toFullHex(hex) {
		hex = hex.toLowerCase();
		if (hex.length === 4 || hex.length === 5)
			hex = "#" + [...hex.slice(1)].map((c) => c + c).join("");
		if (hex.length === 7) hex += "ff";
		return hex;
	}
	const toOutputHex = (hex) => toFullHex(hex).slice(0, 7);
	const rgbaToHex = (r, g, b, a = 255) => "#" + cToHex(r) + cToHex(g) + cToHex(b) + cToHex(a);
	const rgbToRgbaString = ({ r, g, b }) => `rgba(${r},${g},${b},1)`;
	function hexToRgba(hex) {
		const h = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
		return { r: hexToC(h[1]), g: hexToC(h[2]), b: hexToC(h[3]), a: h[4] ? hexToC(h[4]) : 255 };
	}
	function parseColor(colorStr) {
		const h = /^#?([a-f\d]{6}(?:[a-f\d]{2})?|[a-f\d]{3,4})/i.exec(colorStr);
		if (h) return toFullHex(`#${h[1]}`);
		log(LOG_LEVELS.error, "Invalid color format:", colorStr);
		return null;
	}
	Array.prototype.toOutputString = function () {
		return this.map((c) => toOutputHex(c)).join("\n");
	};
	function colorsStringToHexArray(colorsString) {
		return colorsString
			.trim()
			.split("\n")
			.filter(Boolean)
			.map((c) => parseColor(c))
			.filter(Boolean);
	}
	//#endregion Color Utils

	//#region User Palette Functions
	const getUserPalette = () => Colors.slice(0, -1).map(toFullHex);

	function isInUserPalette(hex) {
		const is = getUserPalette().includes(hex);
		if (!is) log(LOG_LEVELS.warn, "Color not in user palette:", toOutputHex(hex));
		return is;
	}

	function setEnabledUserPalette(hexArray) {
		const colors = getUserPalette();
		activeColors = hexArray.map((h) => colors.indexOf(h)).filter((i) => i !== -1);
		activeColors.push(Colors.length - 1);

		localStorage.setItem("activeColors", JSON.stringify(activeColors));

		SetColorsProfile();
		SetColors();
		if (activeColors.length > 0 && (!pixelColor || !colors.includes(toFullHex(pixelColor))))
			changeColor(Colors[activeColors[0]]);

		log(LOG_LEVELS.info, "Enabled palette updated with", activeColors.length, "colors");
	}
	//#endregion User Palette Functions

	//#region Ghost Image Palette Functions
	function getGhostImageHexColors() {
		return ghostPaletteColors.map(({ hex }) => toFullHex(hex));
	}

	function getAvailableGhostColors() {
		const colors = getUserPalette();
		return getGhostImageHexColors().filter((c) => colors.includes(c));
	}

	function getEnabledGhostPalette() {
		if (ghostActivePaletteColors && ghostActivePaletteColors.size > 0)
			return Array.from(ghostActivePaletteColors).map((rgba) => rgbaToHex(...rgba.match(/\d+/g)));

		log(LOG_LEVELS.info, "No ghost colors enabled");
		return "";
	}

	function isInGhostPalette(hex) {
		const is = getGhostImageHexColors().includes(hex);
		if (!is) log(LOG_LEVELS.warn, "Color not in ghost palette:", hex);
		return is;
	}

	function setEnabledGhostPalette(hexArray) {
		if (!getGhostImageHexColors() || getGhostImageHexColors().length === 0)
			return log(LOG_LEVELS.warn, "No ghost image loaded");

		ghostActivePaletteColors = new Set(hexArray.map((h) => rgbToRgbaString(hexToRgba(h))));
		populateColorPaletteUI();
		regenerateGhostCanvas();
		drawGhostImageOnCanvas();

		log(LOG_LEVELS.info, "Ghost palette updated with", hexArray.length, "enabled colors");
	}
	//#endregion Ghost Image Palette Functions

	//#region Navigation
	function gotoCoords({ x, y }, zoom = 16) {
		const gSize = usw.gridSize || gridSize || 25;

		if (isNaN(x) || isNaN(y)) {
			log(LOG_LEVELS.error, "Invalid coordinates");
			return;
		}

		const mercX = x * gSize;
		const mercY = y * gSize;
		const lngLat = turf.toWgs84([mercX, mercY]);

		map.setCenter([lngLat[0], lngLat[1]]);
		map.setZoom(zoom);

		log(LOG_LEVELS.debug, `Moved to (${x}, ${y})`);
	}

	function gotoFromInput(input = "") {
		let coordString;

		if (!input.length) {
			const urlParams = new URLSearchParams(window.location.search);
			coordString = urlParams.get("coords") || urlParams.get("key");
			if (!coordString) {
				log(LOG_LEVELS.error, "No coordinates provided and none found in URL");
				return;
			}
			log(LOG_LEVELS.debug, `Using coords from page URL: ${coordString}`);
		} else if (input.includes("http") || input.includes("?coords=") || input.includes("?key=")) {
			try {
				const url = new URL(input.includes("http") ? input : "https://www.geopixels.net/" + input);
				coordString = url.searchParams.get("coords") || url.searchParams.get("key");
				if (!coordString) {
					log(LOG_LEVELS.error, "No coords parameter found in URL");
					return;
				}
				log(LOG_LEVELS.debug, `Extracted coords from URL: ${coordString}`);
			} catch (e) {
				log(LOG_LEVELS.log, "Invalid URL format");
				return;
			}
		} else {
			coordString = input;
		}

		const parts = coordString.trim().split(",");
		if (parts.length !== 2) {
			log(LOG_LEVELS.error, 'Invalid format. Use: "gridX,gridY"');
			return;
		}

		gotoCoords({ x: +parts[0], y: +parts[1] });
	}
	//#endregion Navigation

	//#region Sound
	function bto64(blob) {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.readAsDataURL(blob);
		});
	}

	function setBlobAsSound(s, blob) {
		blob
			.arrayBuffer()
			.then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
			.then((decodedAudio) => {
				eval(`${s.variable} = decodedAudio`);
			})
			.catch((err) => (LOG_LEVELS.error, "Error loading audio:", err));
	}

	function saveBlobSound(s, blob) {
		setBlobAsSound(s, blob);
		bto64(blob).then((b64s) => localStorage.setItem(`geo++_${s.variable}`, b64s));
	}

	function loadBlobSounds() {
		for (const s of SOUNDS) {
			let storageItem = localStorage.getItem(`geo++_${s.variable}`);
			if (storageItem) {
				fetch(storageItem)
					.then((res) => res.blob())
					.then((blob) => setBlobAsSound(s, blob));
			}
		}
	}
	loadBlobSounds();

	function waitForSounds(callback) {
		let tries = 0;
		function check() {
			if (SOUNDS.every((s) => eval(`${s.variable} !== null`))) callback();
			else if (tries++ < 100) setTimeout(check, 100);
		}
		check();
	}

	waitForSounds(loadBlobSounds);
	//#endregion Sound

	//#region Censor
	function isValidCensorConfig(json) {
		return (
			Array.isArray(json) &&
			json.every(
				(obj) =>
					typeof obj === "object" &&
					obj !== null &&
					["gridX", "gridY", "width", "height"].every((key) => Number.isInteger(obj[key]))
			)
		);
	}

	censorCanvas = document.createElement("canvas");
	censorCanvas.id = "censor-canvas";
	censorCanvas.className = "inset-0 absolute pointer-events-none";
	document.body.appendChild(censorCanvas);

	//#region Drawing censor
	function enableCensorMode() {
		censorMode = true;
		censorCanvas.style.pointerEvents = "auto";
		censorCanvas.style.cursor = "crosshair";

		log(LOG_LEVELS.debug, "Censor mode enabled");
	}

	function disableCensorMode() {
		censorMode = false;
		isDraggingCensor = false;
		censorStartPoint = null;
		tempCensorRect = null;
		censorCanvas.style.pointerEvents = "none";
		log(LOG_LEVELS.debug, "Censor mode disabled");
	}

	function toggleCensorMode() {
		if (censorMode) disableCensorMode();
		else enableCensorMode();
	}

	function startCensorDraw() {
		isDraggingCensor = true;
		censorStartPoint = screenPointToGrid(censorCanvas, mouseX, mouseY);
	}

	function endCensorDraw() {
		if (tempCensorRect && tempCensorRect.width > 0 && tempCensorRect.height > 0)
			addCensorRect(tempCensorRect);

		isDraggingCensor = false;
		censorStartPoint = null;
		tempCensorRect = null;

		drawCensorRects();
	}

	censorCanvas.addEventListener("wheel", (e) =>
		map.getCanvas().dispatchEvent(new WheelEvent(e.type, e))
	);

	window.addEventListener("mousedown", (e) => {
		if (
			(!censorMode && !settings.doInteractCensor) ||
			(e.target !== censorCanvas && e.target !== map.getCanvas())
		)
			return;
		if (censorMode) {
			if (e.button === 0) startCensorDraw();
			else if (e.button === 1) map.getCanvas().dispatchEvent(new MouseEvent(e.type, e));
		}
		e.preventDefault();
		e.stopPropagation();
		if (e.button === 2) {
			const point = screenPointToGrid(censorCanvas, e.clientX, e.clientY);
			const rects = getCensorRects();
			const rectIdx = rects.findIndex(
				(rect) =>
					point.gridX >= rect.gridX &&
					point.gridX < rect.gridX + rect.width &&
					point.gridY >= rect.gridY &&
					point.gridY < rect.gridY + rect.height
			);
			if (rectIdx !== -1) {
				if (e.ctrlKey) {
					const rect = rects[rectIdx];
					const isTop = rect.gridY + rect.height / 2 > point.gridY;
					const isLeft = rect.gridX + rect.width / 2 > point.gridX;
					isDraggingCensor = true;
					censorStartPoint = {
						gridX: rect.gridX + (isLeft ? rect.width : 0),
						gridY: rect.gridY + (isTop ? rect.height : 0),
					};
					oldCensorRect = rects.splice(rectIdx, 1)[0];
					saveCensorRects(rects);
					window.dispatchEvent(new MouseEvent("mousemove", e));
				} else if (confirm(`Remove censor rect?`)) {
					rects.splice(rectIdx, 1);
					saveCensorRects(rects);
				}
			}
		}
	});

	window.addEventListener("mousemove", (e) => {
		if (censorMode && e.buttons == 4) map.getCanvas().dispatchEvent(new MouseEvent(e.type, e));
		if ((!censorMode && !settings.doInteractCensor) || !isDraggingCensor || !censorStartPoint)
			return;

		e.preventDefault();
		e.stopPropagation();

		const point = screenPointToGrid(censorCanvas, e.clientX, e.clientY);

		const minX = Math.min(censorStartPoint.gridX, point.gridX);
		const maxX = Math.max(censorStartPoint.gridX, point.gridX);
		const minY = Math.min(censorStartPoint.gridY, point.gridY);
		const maxY = Math.max(censorStartPoint.gridY, point.gridY);

		tempCensorRect = {
			gridX: minX,
			gridY: minY,
			width: maxX - minX + 1,
			height: maxY - minY + 1,
		};

		drawCensorRects();
	});

	window.addEventListener("mouseup", (e) => {
		if (censorMode && e.button === 1) map.getCanvas().dispatchEvent(new MouseEvent(e.type, e));
		if (
			(!censorMode && !settings.doInteractCensor) ||
			!isDraggingCensor ||
			(e.button !== 0 && e.button !== 2)
		)
			return;
		e.preventDefault();
		e.stopPropagation();
		endCensorDraw();
	});

	window.addEventListener("mouseleave", () => {
		if (!censorMode && !settings.doInteractCensor) return;
		if (isDraggingCensor) {
			if (oldCensorRect) addCensorRect(oldCensorRect);
			oldCensorRect = null;
			isDraggingCensor = false;
			censorStartPoint = null;
			tempCensorRect = null;
			drawCensorRects();
		}
	});

	function drawCensorRect(ctx, rect, gSize, color, a = 1) {
		const topLeftMerc = [(rect.gridX - 0.5) * gSize, (rect.gridY - 0.5 + rect.height) * gSize];
		const bottomRightMerc = [(rect.gridX - 0.5 + rect.width) * gSize, (rect.gridY - 0.5) * gSize];

		const topLeftScreen = map.project(turf.toWgs84(topLeftMerc));
		const bottomRightScreen = map.project(turf.toWgs84(bottomRightMerc));

		const screenWidth = Math.abs(bottomRightScreen.x - topLeftScreen.x);
		const screenHeight = Math.abs(bottomRightScreen.y - topLeftScreen.y);

		if (
			topLeftScreen.x + screenWidth < 0 ||
			topLeftScreen.x > ctx.canvas.width ||
			topLeftScreen.y + screenHeight < 0 ||
			topLeftScreen.y > ctx.canvas.height
		)
			return;

		ctx.fillStyle = color;
		ctx.globalAlpha = a;
		ctx.fillRect(topLeftScreen.x, topLeftScreen.y, screenWidth, screenHeight);
	}
	//#endregion Drawing censor

	function getCensorRects() {
		if (!Array.isArray(censorRects)) {
			const c = localStorage.getItem(STORAGE_KEYS.censor);
			censorRects = c && isJsonString(c) ? JSON.parse(c) : [];
		}
		return censorRects;
	}
	function saveCensorRects(r) {
		censorRects = r;
		localStorage.setItem(STORAGE_KEYS.censor, JSON.stringify(r));
		drawCensorRects();
		document.dispatchEvent(new CustomEvent("censorRectsChanged"));
	}
	const addCensorRect = (rect) => saveCensorRects([...getCensorRects(), rect]);

	function drawCensorRects() {
		const pixelCanvas = document.getElementById("pixel-canvas");
		if (!pixelCanvas) return;

		censorCanvas.width = pixelCanvas.width;
		censorCanvas.height = pixelCanvas.height;
		const ctx = censorCanvas.getContext("2d");

		ctx.clearRect(0, 0, censorCanvas.width, censorCanvas.height);

		const gSize = usw.gridSize || gridSize || 25;

		if ((censorMode || settings.doInteractCensor) && isDraggingCensor && tempCensorRect)
			drawCensorRect(ctx, tempCensorRect, gSize, settings.censorColor, settings.censorAlpha / 1.5);

		const rects = getCensorRects();
		if (!rects.length) return;
		rects.forEach((rect) =>
			drawCensorRect(ctx, rect, gSize, settings.censorColor, settings.censorAlpha)
		);
	}

	function waitForMap(callback) {
		let tries = 0;
		function check() {
			if (map && map.on && map.getContainer) callback();
			else if (tries++ < 100) setTimeout(check, 100);
		}
		check();
	}

	waitForMap(() => {
		["move", "rotate", "zoom"].forEach((ev) => map.on(ev, drawCensorRects));
		new ResizeObserver(drawCensorRects).observe(map.getContainer());
		map.once("load", drawCensorRects);
	});
	//#endregion Censor

	//#region keybind
	document.addEventListener("mousemove", (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
	});

	function isValidKeybindsConfig(json, doReturn = false) {
		const isValid =
			json &&
			typeof json === "object" &&
			Object.keys(json).every((key) => KEY_BINDINGS[key] && json[key].length <= 1);
		return doReturn ? (isValid ? json : false) : isValid;
	}

	let keybinds =
		isValidKeybindsConfig(JSON.parse(localStorage.getItem(STORAGE_KEYS.keybinds)), true) ||
		Object.fromEntries(
			Object.entries(KEY_BINDINGS)
				.filter(([_, v]) => v.defaultKey)
				.map(([id, { defaultKey }]) => [id, defaultKey])
		);

	Object.keys(KEY_BINDINGS).forEach((id) => {
		if (KEY_BINDINGS[id].defaultKey && !keybinds.hasOwnProperty(id))
			keybinds[id] = KEY_BINDINGS[id].defaultKey;
	});

	function saveKeybinds(kb) {
		keybinds = kb;
		localStorage.setItem(STORAGE_KEYS.keybinds, JSON.stringify(kb));
	}
	function saveKeybind(id, key) {
		keybinds[id] = key;
		saveKeybinds(keybinds);
	}

	document.getElementById("toggleKeybinds").addEventListener("click", () => {
		for (const key in keybinds) {
			const element = document.getElementById(`gpp_keybind-${key}`);
			if (element) element.value = keybinds[key];
		}
	});

	function handleKeyBindPress(e) {
		// Ignore shortcuts if typing in an input field.
		const aElm = document.activeElement;
		if (aElm && (aElm.tagName === "INPUT" || aElm.tagName === "TEXTAREA" || aElm.isContentEditable))
			return;

		const id = Object.keys(keybinds).find((key) => keybinds[key] === e.key.toLowerCase());
		if (id && KEY_BINDINGS[id][e.type]) {
			KEY_BINDINGS[id][e.type](e);
			e.preventDefault();
		}
	}

	document.addEventListener("keydown", handleKeyBindPress);
	document.addEventListener("keyup", handleKeyBindPress);

	document
		.querySelector("#keybindsPanel>div.flex>button.bg-blue-500")
		.addEventListener("click", () => {
			saveKeybinds(
				Object.fromEntries(
					Object.keys(KEY_BINDINGS).map((id) => [
						id,
						document.querySelector(`[id^='gpp_keybind-${id}']`).value.trim().toLowerCase(),
					])
				)
			);
		});
	//#endregion keybind

	//#region settings
	function isValidSettingsConfig(json, doReturn = false) {
		const isValid =
			json && typeof json === "object" && Object.keys(json).every((key) => SETTINGS[key]);
		return doReturn ? (isValid ? json : false) : isValid;
	}

	let settings =
		isValidSettingsConfig(JSON.parse(localStorage.getItem(STORAGE_KEYS.settings)), true) ||
		Object.fromEntries(
			Object.entries(SETTINGS)
				.filter(([_, v]) => v.default)
				.map(([id, { default: d }]) => [id, d])
		);

	Object.keys(SETTINGS).forEach((id) => {
		if (SETTINGS[id].default !== undefined && !settings.hasOwnProperty(id))
			settings[id] = SETTINGS[id].default;
	});

	function saveSetting(id, val) {
		settings[id] = val;
		localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
	}

	for (const [id, val] of Object.entries(settings))
		if (SETTINGS[id] && SETTINGS[id].apply) SETTINGS[id].apply(val);

	const SETTINGS_CLASSES = {
		select: "rounded-md border-2 border-gray-200 sm:text-sm p-2",
		textarea:
			"w-full h-32 rounded-md border-2 border-gray-200 p-2 font-mono resize-vertical outline-none transition",
		button:
			"px-4 py-2 rounded-lg shadow transition cursor-pointer bg-blue-500 hover:bg-blue-600 text-white",
		input: {
			color: "rounded-md border-2 border-gray-200 p-1 cursor-pointer",
			range: "py-1.5 cursor-pointer",
			keybind: "keybind-input",
			checkbox: "cursor-pointer h-6 w-6",
		},
	};
	function makeSettingUI(key, s) {
		const baseClass =
			typeof SETTINGS_CLASSES[s.element] === "string"
				? SETTINGS_CLASSES[s.element]
				: SETTINGS_CLASSES[s.element]?.[s.attributes.type] ?? "";

		const input = Object.assign(document.createElement(s.element), {
			className: baseClass,
			...s.attributes,
			[s.attributes.type === "checkbox" ? "checked" : "value"]: s.value?.() ?? settings[key],
		});

		if (s.init) s.init(input);

		if (s.element == "button") {
			input.innerText = s.name;
			return input;
		}

		if (s.element == "select") {
			input.append(
				...s.options.map(({ value, text }) =>
					Object.assign(document.createElement("option"), {
						value,
						innerText: text,
					})
				)
			);
		}

		const label = document.createElement("label");
		label.className = "text-sm font-medium text-gray-700 flex";

		const isKeybind = s.attributes.type == "keybind";
		const isRow = isKeybind || s.attributes.type == "checkbox";

		if (isKeybind) {
			input.maxLength = 1;
			label.style.flex = "0 1 calc(50% - var(--spacing))";
		}
		if (isRow) {
			label.className += " flex-row items-center gap-1";
			label.append(input, s.name);
		} else {
			label.className += " flex-col items-start";
			label.append(s.name, input);
		}

		if (s.element == "textarea") label.className += " w-full";

		if (s.reset || s.default !== undefined) {
			const resetButton = makeButton("⟲", () => {
				if (s.reset) s.reset(input);
				else {
					input.value = s.default;
					input.dispatchEvent(new Event("change"));
				}
			});
			resetButton.className = "cursor-pointer absolute top-0 h-5 w-5 text-xl";
			resetButton.style.lineHeight = "var(--text-xl)";
			resetButton.title = "reset";
			label.appendChild(resetButton);
			label.className += " relative";
			if (isKeybind) {
				label.style.paddingLeft = "calc(var(--text-xl))";
				resetButton.className += " left-0";
			} else {
				label.style.paddingRight = "calc(var(--text-xl) + 5px)";
				resetButton.className += " right-0";
			}
		}
		return label;
	}
	//#endregion settings

	//#region Ghost colors progress
	function updateGhostPaletteProgress() {
		if (!ghostImage || !ghostImageOriginalData || !ghostImageTopLeft) return;

		const { gridX, gridY } = ghostImageTopLeft;
		const { width, height } = ghostImage;

		const mapCanvas = Object.assign(document.createElement("canvas"), { width, height });
		const mapCtx = mapCanvas.getContext("2d");

		mapCtx.setTransform(1, 0, 0, -1, -gridX, gridY + 1);

		for (const { x, y } of getAllCoordsBetween(
			{ x: snapToTile(gridX), y: snapToTile(gridY) },
			{ x: snapToTile(gridX + width), y: snapToTile(gridY - height) },
			SYNC_TILE_SIZE
		)) {
			const tileData = tileImageCache.get(`${x},${y}`);
			if (tileData?.colorBitmap) mapCtx.drawImage(tileData.colorBitmap, x, y);
		}

		mapCtx.setTransform(1, 0, 0, 1, 0, 0);

		const mapData = mapCtx.getImageData(0, 0, width, height).data;
		const ghostData = ghostImageOriginalData.data;
		const matchingColorMap = new Map();

		for (let i = 0; i < ghostData.length; i += 4) {
			if (ghostData[i + 3] <= 1) continue;
			const mapHex = rgbaToHex(mapData[i], mapData[i + 1], mapData[i + 2], mapData[i + 3]);
			const hex = rgbaToHex(ghostData[i], ghostData[i + 1], ghostData[i + 2], ghostData[i + 3]);
			if (hex == mapHex) matchingColorMap.set(hex, (matchingColorMap.get(hex) ?? 0) + 1);
		}

		const container = document.getElementById("ghostColorPalette");

		for (const { rgba, hex, totalCount } of ghostPaletteColors) {
			const swatch = container.querySelector(`[data-color-rgba="${rgba}"]`);
			if (!swatch) continue;
			swatch.style.position = "relative";

			const completed = matchingColorMap.get(toFullHex(hex)) ?? 0;
			const progress = completed / totalCount;
			const percent = Math.floor(progress * 1000) / 10;

			swatch.title = `${hex}\n${completed} / ${totalCount} pixels\n${percent}%`;

			let icon = swatch.querySelector("span");
			if (!icon) {
				icon = document.createElement("span");
				icon.className =
					"absolute h-3 w-3 rounded-full border-2 border-white text-white font-bold flex justify-center items-center";
				Object.assign(icon.style, { top: "-3px", right: "-3px", fontSize: "0.6rem" });
				swatch.appendChild(icon);
			}

			icon.textContent = progress === 1 ? "✓" : "";
			icon.style.backgroundColor =
				progress === 0 ? "#000" : `hsl(${360 - progress * 240}, 100%, 50%)`;
		}
	}

	const populateColorPaletteUI_old = usw.populateColorPaletteUI;
	usw.populateColorPaletteUI = function () {
		populateColorPaletteUI_old();
		updateGhostPaletteProgress();
	};
	const calculateGhostProgress_old = usw.calculateGhostProgress;
	usw.calculateGhostProgress = function () {
		calculateGhostProgress_old();
		updateGhostPaletteProgress();
	};
	//#endregion Ghost colors progress

	//#region UI Helpers
	function copyToClipboard(text) {
		log(LOG_LEVELS.info, "Copied text to clipboard:\n", text);
		navigator.clipboard
			.writeText(text)
			.then(() => {
				alert("Copied to clipboard!");
			})
			.catch((err) => {
				log(LOG_LEVELS.error, "Failed to copy:", err);
				alert("Failed to copy to clipboard");
			});
	}

	function createModal(title, inner, footer) {
		const modalCloseTimeout = 0.15;

		const modalContainer = document.createElement("div");
		modalContainer.className = "fixed inset-0 z-50 bg-black/50 flex items-center justify-center";

		const modal = document.createElement("div");
		modal.className =
			"relative bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-6 max-h-[90vh]";
		modal.style.transition = `transform ${modalCloseTimeout}s ease-out`;
		modal.style.minWidth = "min(500px,90vw)";
		modal.style.maxWidth = "90vw";

		modal.close = () => {
			document.removeEventListener("keydown", escHandler);
			modal.style.transform = "scale(0)";
			setTimeout(() => {
				document.body.removeChild(modalContainer);
			}, modalCloseTimeout * 1000);
		};

		const modalCrossBtn = document.createElement("button");
		modalCrossBtn.className =
			"absolute top-4 right-4 w-10 h-10 bg-white shadow rounded-full hover:bg-gray-100 cursor-pointer";
		modalCrossBtn.innerText = "✕";
		modalCrossBtn.onclick = () => modal.close();

		const modalTitle = document.createElement("h2");
		modalTitle.className = "text-2xl font-semibold text-gray-800";
		modalTitle.innerText = title;

		inner = Array.isArray(inner) ? inner : [inner];
		modal.append(modalCrossBtn, modalTitle, ...inner);

		if (footer) {
			const footerWrapper = document.createElement("div");
			footerWrapper.className = "flex justify-end gap-3";
			footer = Array.isArray(footer) ? footer : [footer];
			footerWrapper.append(...footer);
			modal.appendChild(footerWrapper);
		}
		modalContainer.appendChild(modal);

		modal.onclick = (e) => e.stopPropagation();
		modalContainer.onclick = () => modal.close();
		const escHandler = (e) => e.key === "Escape" && modal.close();
		document.addEventListener("keydown", escHandler);

		document.body.appendChild(modalContainer);
		return modal;
	}

	function promptForColors(onSubmit, title = "Enter colors") {
		const textarea = document.createElement("textarea");
		textarea.placeholder =
			"Enter colors (one per line)\nFormat: '#?RRGGBB(.+)?'\nExample:\nFAECCE\n#FAECCE55\n#faecce\nFAECCE55 randomTEXTatgfdljj";
		textarea.className =
			"w-full p-3 border-2 border-gray-200 rounded-lg font-mono text-sm resize-vertical box-border";
		textarea.style.height = "200px";

		const modal = createModal(
			title,
			textarea,
			makeBasicButton("Submit", COLOR_CLASS.blue, () => {
				const value = textarea.value.trim();
				log(LOG_LEVELS.debug, "Submitted colors:\n", value);
				if (value) onSubmit(colorsStringToHexArray(value));
				modal.close();
			})
		);

		textarea.focus();
	}

	function makeButton(innerText, onClick) {
		const button = document.createElement("button");
		button.innerText = innerText;
		button.onclick = onClick;
		return button;
	}
	const COLOR_CLASS = {
		red: "bg-red-500 hover:bg-red-600 text-white",
		green: "bg-green-500 hover:bg-green-600 text-white",
		blue: "bg-blue-500 hover:bg-blue-600 text-white",
		gray: "bg-gray-200 hover:bg-gray-300 text-gray-700",
	};
	function makeBasicButton(innerText, classes = COLOR_CLASS.blue, onClick) {
		if (typeof classes === "function") {
			onClick = classes;
			classes = COLOR_CLASS.blue;
		}
		const button = makeButton(innerText, onClick);
		button.className = `px-4 py-2 rounded-lg shadow transition cursor-pointer ${classes}`;
		return button;
	}
	function makeSelectButton(innerText, onClick) {
		const button = makeButton(innerText, onClick);
		button.className =
			"px-2 py-1 bg-white rounded-lg shadow hover:bg-gray-300 border border-gray-300 transition cursor-pointer";
		return button;
	}
	function makeMenuButton(innerText, title, onClick) {
		const button = makeButton(innerText, onClick);
		button.className =
			"w-10 h-10 bg-white shadow rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-all";
		button.title = title;
		return button;
	}
	function makeSelectMenuButton(innerText, title, options, optionsTitle = "") {
		const wrapper = document.createElement("div");
		const select = document.createElement("div");
		const menuButton = makeMenuButton(innerText, title, () => select.toggle());

		wrapper.className = "relative";
		wrapper.onclick = (e) => e.stopPropagation();

		if (optionsTitle.length) select.innerHTML = `<h2>${optionsTitle}</h2>`;
		select.append(...options.map((opt) => makeSelectButton(opt.innerText, opt.onClick)));
		select.classList =
			"bg-white shadow rounded-xl p-2 border border-gray-300 transition-all absolute w-auto top-0 overflow-hidden flex flex-col gap-1";
		select.style.height = "auto";
		select.style.whiteSpace = "nowrap";
		select.close = () => {
			select.dataset.isOpened = "false";
			select.style.maxWidth = "40px";
			select.style.maxHeight = "40px";
			select.style.zIndex = "-1";
			select.style.left = "0px";
			menuButton.classList.remove("rounded-full");
			menuButton.classList.add("rounded-xl");
		};
		select.open = () => {
			select.dataset.isOpened = "true";
			select.style.maxWidth = "500px";
			select.style.maxHeight = (optionsTitle.length ? 25 : 0) + 16 + options.length * 40 + "px";
			select.style.zIndex = "1";
			select.style.left = "50px";
			menuButton.classList.add("rounded-full");
			menuButton.classList.remove("rounded-xl");
		};
		select.toggle = () => {
			if (select.dataset.isOpened == "true") select.close();
			else select.open();
		};
		select.close();
		window.addEventListener("click", (e) => e.target !== menuButton && select.close(), true);

		wrapper.append(menuButton, select);
		return wrapper;
	}
	function makeMenuGroupButton(innerText, title, id, parent) {
		const div = document.createElement("div");
		div.className = "relative";
		const button = makeMenuButton(innerText, title, (e) => {
			e.stopPropagation();
			closeAllDropdowns();
			toggleDropdown(document.getElementById(`${id}Dropdown`));
		});
		button.id = `${id}Btn`;
		const dropdown = document.createElement("div");
		dropdown.className =
			"dropdown-menu absolute left-0 mt-2 flex flex-col gap-2 transition-all duration-150 ease-out hidden";
		dropdown.id = `${id}Dropdown`;
		div.append(button, dropdown);
		parent.appendChild(div);
		return dropdown;
	}

	function addGPPButtonToggle(parent, ...elms) {
		const button = makeButton("✚₊", () => button.toggle());
		button.open = () => {
			button.dataset.expanded = "true";
			button.style.transform = "rotateZ(-180deg)";
			elms.forEach((b) => {
				b.style.display = "";
			});
		};
		button.close = () => {
			button.dataset.expanded = "false";
			button.style.transform = "rotateZ(0)";
			elms.forEach((b) => {
				b.style.display = "none";
			});
		};
		button.toggle = () => {
			if (button.dataset.expanded === "true") button.close();
			else button.open();
		};
		button.close();
		button.className =
			"text-white shadow transition cursor-pointer bg-yellow-500 hover:bg-yellow-600 rounded-full h-10 w-10";

		parent.append(button, ...elms);
	}
	//#endregion UI Helpers

	//#region UI
	function createCensorsConfigModal() {
		const censorList = document.createElement("div");
		censorList.className = "flex flex-col overflow-y-auto gap-1";

		createModal("Censor Configurations", censorList, [
			makeBasicButton("Add Censor Rect", COLOR_CLASS.green, () => {
				addCensorRect({ gridX: 0, gridY: 0, width: 1, height: 1 });
				refreshCensorList();
			}),
			makeBasicButton("Clear All", COLOR_CLASS.red, () => {
				if (confirm("Are you sure you want to clear all censor rectangles?")) {
					saveCensorRects();
					refreshCensorList();
				}
			}),
		]);

		function refreshCensorList() {
			const rects = getCensorRects();
			if (rects.length === 0) {
				censorList.innerHTML = "No censor rectangles defined.";
				return;
			}
			const rectDatas = ["gridX", "gridY", "width", "height"];
			censorList.innerHTML = "";
			censorList.append(
				...rects.map((r, idx) => {
					const row = document.createElement("div");
					row.className =
						"flex justify-between items-center flex-wrap p-2 border border-gray-300 rounded-lg gap-3";
					row.append(
						...rectDatas.map((prop) => {
							const label = document.createElement("label");
							label.innerText = `${prop}:`;
							const input = document.createElement("input");
							input.type = "number";
							input.value = r[prop];
							input.className = "w-28 border border-gray-300 rounded-md px-1 outline-none";
							input.onchange = (e) => {
								const rects = getCensorRects();
								if (rects[idx] && parseInt(e.target.value)) {
									rects[idx][prop] = parseInt(e.target.value);
									saveCensorRects(rects);
								}
							};
							label.append(input);
							return label;
						}),
						Object.assign(
							makeButton("🗑️", () => {
								const rects = getCensorRects();
								if (rects[idx]) {
									rects.splice(idx, 1);
									saveCensorRects(rects);
									refreshCensorList();
								}
							}),
							{ className: `p-1 rounded-lg transition cursor-pointer ${COLOR_CLASS.red}` }
						)
					);
					return row;
				})
			);
		}
		refreshCensorList();
	}

	function createSettingsModal() {
		const groupedSettings = {};
		for (const [key, setting] of Object.entries(SETTINGS)) {
			if (!groupedSettings[setting.category]) groupedSettings[setting.category] = [];
			groupedSettings[setting.category].push({ key, setting });
		}

		const div = document.createElement("div");
		div.className = "flex flex-wrap gap-2 items-end max-w-2xl overflow-y-auto";
		Object.entries(groupedSettings).forEach(([category, sets]) => {
			const categoryTitle = document.createElement("h3");
			categoryTitle.className =
				"w-full text-xl font-semibold text-gray-700 mt-4 mb-2 border-b border-gray-300";
			categoryTitle.innerText = category;
			div.append(categoryTitle, ...sets.map(({ key, setting }) => makeSettingUI(key, setting)));
		});

		createModal("Settings", div);
	}

	// Add buttons to ghost UI
	addGPPButtonToggle(
		document.querySelector("#ghostColorPaletteContainer>div"),
		makeBasicButton("Enable Only Owned Ghost Colors", () =>
			setEnabledGhostPalette(getAvailableGhostColors())
		),
		makeBasicButton("Get Ghost Colors", () =>
			copyToClipboard(
				getGhostImageHexColors()
					.map((hex) => toOutputHex(hex))
					.join("\n")
			)
		),
		makeBasicButton("Get Enabled Ghost Colors", () =>
			copyToClipboard(getEnabledGhostPalette().toOutputString())
		),
		makeBasicButton("Set Enabled Ghost Colors", () =>
			promptForColors(
				(t) => setEnabledGhostPalette(t.filter(isInGhostPalette)),
				"Set Enabled Ghost Colors"
			)
		)
	);

	// Add buttons to profile
	const shopButtonsContainer = document.querySelector("#userColorsContainer + div");
	if (shopButtonsContainer) {
		shopButtonsContainer.style.display = "flex";
		shopButtonsContainer.style.flexWrap = "wrap";
		shopButtonsContainer.style.gap = "8px";

		addGPPButtonToggle(
			shopButtonsContainer,
			makeBasicButton("Get User Colors", () => copyToClipboard(getUserPalette().toOutputString())),
			makeBasicButton("Get Enabled Colors", () =>
				copyToClipboard(
					getUserPalette()
						.filter((c, idx) => activeColors.includes(idx))
						.toOutputString()
				)
			),
			makeBasicButton("Set Enabled Colors", () =>
				promptForColors(
					(t) => setEnabledUserPalette(t.filter(isInUserPalette)),
					"Set Enabled User Colors"
				)
			)
		);
	}

	//create hidden file input
	const inputSoundFile = document.createElement("input");
	inputSoundFile.type = "file";
	inputSoundFile.style.display = "none";
	inputSoundFile.accept = "audio/*";
	inputSoundFile.onchange = () => {
		let blob = new Blob([inputSoundFile.files[0]]);
		saveBlobSound(SOUNDS[soundToChangeIdx], blob);
	};
	document.body.appendChild(inputSoundFile);

	// Add GeoPixels++ menu group to main UI
	makeMenuGroupButton(
		"✚₊",
		"GeoPixels++",
		"geopixels-plusplus",
		document.getElementById("controls-left")
	).append(
		makeMenuButton("🎯", "Go to Coordinates", () => {
			const input = prompt("Enter coordinates (gridX,gridY) or GeoPixels URL:");
			if (input) gotoFromInput(input);
		}),
		makeMenuButton("🧪", "Set Both Palettes", () =>
			promptForColors((s) => {
				setEnabledUserPalette(s.filter(isInUserPalette));
				setEnabledGhostPalette(s.filter(isInGhostPalette));
			})
		),
		makeSelectMenuButton(
			"🎵",
			"Change Sound",
			SOUNDS.map((s, i) => {
				return {
					innerText: s.name,
					onClick: () => {
						soundToChangeIdx = i;
						inputSoundFile.click();
					},
				};
			}),
			"Choose a sound to change"
		),
		makeSelectMenuButton("🚫", "Censor", [
			{
				innerText: "Toggle censor mode",
				onClick: toggleCensorMode,
			},
			{
				innerText: "Open censors config",
				onClick: createCensorsConfigModal,
			},
		]),
		makeMenuButton("⚙️", "Settings", createSettingsModal)
	);

	//Add to the keybind Panel
	const gpp_keybind_div = document.createElement("div");
	gpp_keybind_div.innerHTML = `
			<h3 class="text-lg font-semibold text-gray-700 mb-2">GeoPixels++</h3>
			<div class="space-y-2">
				${Object.keys(KEY_BINDINGS)
					.map(
						(id) => `
							<div class="flex items-center justify-between p-2">
								<label for="gpp_keybind-${id}" class="text-gray-600">${KEY_BINDINGS[id].text}</label>
								<input id="gpp_keybind-${id}" type="text" maxlength="1" class="keybind-input">
							</div>
						`
					)
					.join("")}
			</div>
	`;
	document.querySelector("#keybindsPanel>div.grid>div:nth-child(2)").appendChild(gpp_keybind_div);

	//fix some styles
	const style = document.createElement("style");
	style.innerHTML = `input[type="number"]{appearance:auto;}`;
	document.head.appendChild(style);

	//#endregion UI

	log(LOG_LEVELS.info, "GeoPixels++ loaded");
})();
