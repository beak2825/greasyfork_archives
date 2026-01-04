// ==UserScript==
// @name         Bandit.RIP Community Costumes
// @version      2.2
// @author       Dokuro
// @description  Adds new costumes to the game
// @license      Unlicense
// @match        https://bandit.rip/
// @match        https://bandit.rip/?join=*
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1552476
// @downloadURL https://update.greasyfork.org/scripts/560789/BanditRIP%20Community%20Costumes.user.js
// @updateURL https://update.greasyfork.org/scripts/560789/BanditRIP%20Community%20Costumes.meta.js
// ==/UserScript==

const MOD = {
	COSTUMES_LIST_JSON_URL: "https://dokuro-gh.github.io/data.json",
	COSTUMES_IMAGES_BASE_URL: "https://i.ibb.co/",

	// Unicode codepoints of invisible characters
	ENCODING_CHARACTERS: [8203, 8204, 8205, 8288, 10240, 12644],
};

async function start() {
	await waitGameLoad();
	deobfuscateVariables();
	setupUtilPrototypeFunctions();
	main();
}

async function waitGameLoad() {
	while (window._$ic == null) await sleep(100);
}

function deobfuscateVariables() {
	window.PROJECTILE_CLASSES = window._$9l;
	window.BANDIT_NAMES = window._$ky;

	MOD.ICON_GLOWS = window.BANDIT_NAMES.map((bandit) => {
		return classDatas[bandit].pfp;
	});

	let game = window._$ic;
	game.renderer.costumesData = game.renderer._$hb;

	let spawnMenu = game._$7q;

	game.spawnMenu = spawnMenu;
	window.game = game;

	let GameUtil = window._$hV;
	GameUtil.clone = GameUtil._$4P;
	window.GameUtil = GameUtil;

	window.Sprite = window._$9L;
}

function setupUtilPrototypeFunctions() {
	Object.defineProperty(Object.prototype, "iterate", {
		value: function (handler) {
			Object.keys(this).forEach((key, i) => {
				handler(key, this[key], i);
			});
		},
		configurable: true,
		writable: true,
		enumerable: false,
	});

	Object.defineProperty(Element.prototype, "appendChildren", {
		value: function (children) {
			let items = Array.from(children);

			items.forEach((node) => {
				this.appendChild(node);
			});

			return this;
		},
		configurable: true,
		writable: true,
		enumerable: false,
	});

	Object.defineProperty(Object.prototype, "keyOf", {
		value: function (find) {
			let keys = Object.keys(this);
			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];
				if (this[key] == find)
					return key;
			}
		},
		configurable: true,
		writable: true,
		enumerable: false,
	});

	Object.defineProperty(Object.prototype, "injectBefore", {
		value: function (func, handler) {
			let function_name = this.keyOf(func);
			let orig = this[function_name];

			this[function_name] = function (...args) {
				let result = handler.apply(this, args);
				return orig.apply(this, result);
			};
		},
		configurable: true,
		writable: true,
		enumerable: false,
	});

	Object.defineProperty(Object.prototype, "injectAfter", {
		value: function (func, handler) {
			let funcName = this.keyOf(func);
			let orig = this[funcName];

			this[funcName] = function (...args) {
				let result = orig.apply(this, args);
				return handler.apply(this, [...args, result]);
			};
		},
		configurable: true,
		writable: true,
		enumerable: false,
	});
}

async function main() {
	let data = await fetchCostumesData();

	let costumeManager = new CostumeManager(data.costumes);
	costumeManager.load();

	let selectedCostumes = costumeManager.loadSavedCostumes();

	let uiManager = new UIManager(
		costumeManager,
		data.uiCostumes,
		data.previewIcons,
		selectedCostumes,
	);
	uiManager.setup();

	setupCostumesPatches(costumeManager, selectedCostumes);
	setupProjectilesFix();
}

async function fetchCostumesData() {
	let response = await fetch(MOD.COSTUMES_LIST_JSON_URL);
	return response.json();
}

class CostumeManager {
	constructor(costumesData) {
		this.costumesData = costumesData;
		this.costumesLoaded = {};
	}

	load() {
		this.typeIdLimits = {};
		this.types = {};

		this.costumesData.iterate((bandit, costumeTypes) => {
			let index = 0;

			this.typeIdLimits[bandit] = [];
			this.types[bandit] = [];

			costumeTypes.iterate((type, costumes, typeId) => {
				this.updateGameSpritesData(bandit, type + "preview", 0);

				costumes.forEach((path, costumeId) => {
					this.updateGameSpritesData(bandit, type, costumeId);

					index++;
				});

				this.types[bandit][typeId] = type;
				this.typeIdLimits[bandit][typeId] = index;
			});
		});
	}

	updateGameSpritesData(bandit, type, costumeId) {
		let name = this.getCostumeResourceName(bandit, type, costumeId);

		window.game.renderer.costumesData[name] = {
			k: name,
			ok: bandit,
		};

		window.spritesDatas[name] = GameUtil.clone(spritesDatas[bandit]);
		window.spritesDatas[name].base = name;
	}

	loadSavedCostumes() {
		let arr = {};

		window.BANDIT_NAMES.forEach((bandit) => {
			let val = JSON.parse(localStorage.getItem(bandit));
			if (val == null)
				return;

			if (!Object.keys(this.costumesData[bandit]).includes(val.type))
				return;

			if (val.costumeId >= this.costumesData[bandit][val.type].length)
				return;

			arr[bandit] = val;
		});

		return arr;
	}

	// Game generates 'solid' background based on resource name
	getCostumeResourceName(bandit, type, costumeId) {
		return (
			"/assets/sprites/" +
			bandit +
			"/" +
			bandit +
			"_" +
			type +
			"_" +
			costumeId +
			"_CC"
		);
	}

	decodeCostumeResourceName(resourceName) {
		let arr = resourceName.split("/").pop().split("_");
		return {
			bandit: arr[0],
			type: arr[1],
			costumeId: arr[2],
		};
	}

	loadCostume(resourceName) {
		let data = this.decodeCostumeResourceName(resourceName);
		this.downloadCostume(
			data.bandit,
			data.type,
			data.costumeId,
			resourceName,
		);
	}

	encodeBanditCostumeId(bandit, type, costumeId) {
		let typeId = this.types[bandit].keyOf(type);
		if (typeId == null)
			return null;

		return typeId == 0
			? costumeId
			: costumeId + this.typeIdLimits[bandit][typeId - 1];
	}

	decodeBanditCostumeId(bandit, banditCostumeId) {
		let typeId = this.typeIdLimits[bandit].findIndex((limit) => {
			return banditCostumeId < limit;
		});
		if (typeId == -1)
			return null;

		let type = this.types[bandit][typeId];
		let costumeId =
			typeId == 0
				? banditCostumeId
				: banditCostumeId - this.typeIdLimits[bandit][typeId - 1];

		return {
			type: type,
			costumeId: costumeId,
		};
	}

	downloadCostume(bandit, type, costumeId, resourceName) {
		let image = this.getCostumeImage(bandit, type, costumeId);
		let json = this.getBanditJson(bandit, type);

		// loaderReady
		if (!window.game.renderer._$9C)
			return;

		this.downloadCostumeGeneric(image, json, resourceName);
	}

	getBanditJson(bandit, type) {
		let json;
		if (type == bandit) {
			json = "/assets/sprites/" + bandit + "/" + bandit + ".json";
		} else if (type == "punk") {
			json = "/assets/sprites/pboi/costumes/pboi1.json";
		}

		return json;
	}

	getCostumeImage(bandit, type, costumeId) {
		let image;
		if (type == bandit) {
			image =
				MOD.COSTUMES_IMAGES_BASE_URL +
				this.costumesData[bandit][type][costumeId];
		} else if (type == "punk") {
			image =
				MOD.COSTUMES_IMAGES_BASE_URL +
				this.costumesData.pboi.punk[costumeId];
		}

		return image;
	}

	// Pixi loader loads image (_image resource) for sprite from .json
	// spritesheet by default. I don't want to change the .json, so I just
	// load _image resource myself.
	downloadCostumeGeneric(image, json, resourceName) {
		window.game.renderer._$9C = false;

		window.game.renderer.loader.add(resourceName, json);
		window.game.renderer.loader.add(resourceName + "_image", image);

		window.game.renderer.loader.load((loader, loaded) => {
			let json = loaded[resourceName];
			let image = loaded[resourceName + "_image"];

			let spritesheet = new PIXI.Spritesheet(
				image.texture.baseTexture,
				json.data,
				json.url,
			);

			spritesheet.parse(() => {
				json.spritesheet = spritesheet;
				json.textures = spritesheet.textures;
			});

			window.game.renderer._$qr[resourceName] = 1;
			window.game.renderer._$9C = true;
		});
	}

	async downloadCostumePreview(image, json, resourceName) {
		while (!window.game.renderer._$9C) await sleep(100);

		delete game.renderer.loader.resources[resourceName];
		delete game.renderer.loader.resources[resourceName + "_image"];
		this.downloadCostumeGeneric(image, json, resourceName);
	}
}

class UIManager {
	constructor(costumeManager, uiCostumes, previewIcons, selectedCostumes) {
		this.costumeManager = costumeManager;
		this.uiCostumes = uiCostumes;
		this.previewIcons = previewIcons;
		this.selectedCostumes = selectedCostumes;
		this.selectedBandit = game.spawnMenu._$hq;
	}

	setup() {
		this.setupStyles();
		this.updateGameButtons();
		this.setupPanels();
		this.setupFileButton();
	}

	setupStyles() {
		let spawnScreenContentEl = document.querySelector(
			".fgm-m-c > div:nth-child(1) > div:nth-child(1)",
		);
		spawnScreenContentEl.style.cssText = `
			display: grid;
			grid-template-columns: 1fr auto 1fr;
			align-items: center;
			overflow: hidden;
			width: 100%;
		`;

		let spawnScreenFgmEl = spawnScreenContentEl.children[0];
		spawnScreenFgmEl.style.cssText = `
			grid-column: 2;
		`;

		let invisiblePanelBlockingPointerEvents = document.querySelector(
			".frontpage-game-menu-l",
		);
		invisiblePanelBlockingPointerEvents.style.cssText = `
			pointer-events: none
		`;

		// TODO last row should start from the left
		let style = document.createElement("style");
		style.textContent = `
			.costumes-panel {
				grid-column: 1;
				justify-self: end;
				max-height: 70vh;
				overflow-y: auto;
				overflow-x: hidden;
				padding-right: 20px;
				text-align: right;
				margin-bottom: 250px;
				margin-top: 100px;
				display: none;
			}
			.costumes-panel.shown {
				display: inline-block;
			}
			.costume-button {
				width: 15vh;
				height: 15vh;
				display: inline-block;
				position: relative;
				margin: 5px;
				user-select: none;
				min-width: 85px;
				min-height: 85px;
				cursor: pointer;
				background: rgba(255, 255, 255, 0.08);
				container-type: size;
			}
			.costume-button.selected,
			.costume-button:hover {
				background: rgba(255, 255, 255, 0.25);
			}
			.costume-name {
				color: rgb(200, 200, 200);
				display: inline-block;
				position: absolute;
				left: 50%;
				top: 82%;
				height: 18%;
				width: 95%;
				font-size: 18cqh;
				line-height: 18cqh;
				transform: translate(-50%, 0);
				max-height: 16%;
				text-align: center;
			}
			.costume-icon {
				z-index: 1;
				max-width: 100%;
				margin: 0;
				padding: 0;
				max-height: 76%;
				display: block;
				transform: translate(-50%, 0);
				left: 50%;
				margin-top: 4%;
				width: auto;
				bottom: auto;
			}
		`;

		document.head.appendChild(style);
	}

	setupPanels() {
		this.panels = {};

		let spawnScreenContentEl = document.querySelector(
			".fgm-m-c > div:nth-child(1) > div:nth-child(1)",
		);

		window.BANDIT_NAMES.forEach((bandit) => {
			let panel = this.createPanel();
			panel.buttons = [];

			this.uiCostumes[bandit].iterate((type, value, i) => {
				panel.buttons[type] = [];
				panel.buttons[type + "preview"] = [];

				let button = this.generatePreviewButton(bandit, type);
				button.addEventListener("click", () => {
					this.tryEquipPreview(bandit, type);
				});

				panel.buttons[type + "preview"].push(button);
				panel.appendChild(button);
			});

			this.uiCostumes[bandit].iterate((type, value, i) => {
				let buttons = this.generateButtons(bandit, type);
				buttons.forEach((button, costumeId) => {
					button.addEventListener("click", () => {
						this.tryEquipGeneric(bandit, type, costumeId);
					});
				});

				panel.buttons[type].push(...buttons);
				panel.appendChildren(buttons);
			});

			let data = this.selectedCostumes[bandit];
			if (data != null) {
				this.selectButton(panel, data.type, data.costumeId);
				this.setBanditIconGeneric(bandit, data.type, data.costumeId);
				this.equipCostume(bandit, data.type, data.costumeId);
			}

			spawnScreenContentEl.prepend(panel);

			this.panels[bandit] = panel;
		});

		// selectedBandit
		this.showPanel(window.game.spawnMenu._$hq);
	}

	tryEquipGeneric(bandit, type, costumeId) {
		this.tryEquipCostume(bandit, type, costumeId, () => {
			this.setBanditIconGeneric(bandit, type, costumeId);
			return true;
			// TODO probably move selectedCostume[] = ... here so don't have to
			// check preview on spawn because it can be now stored separately
		});
	}

	// TODO fix invisible costume when cncel
	tryEquipPreview(bandit, type) {
		this.tryEquipCostume(bandit, type + "preview", 0, async () => {
			if (this.previewLoading)
				return false;

			let fileChange = this.waitFileChange();
			let fileCancel = this.waitFileCancel();

			this.openFile.click();

			let input = await Promise.any([fileChange, fileCancel]);
			if (input == null)
				return false;

			this.previewLoading = true;

			let result = await this.waitReaderOnLoad(input.target.files[0]);

			var image = "data:image/png;base64," + btoa(result.target.result);
			var json = this.costumeManager.getBanditJson(bandit, type);
			var resourceName = this.costumeManager.getCostumeResourceName(
				bandit,
				type + "preview",
				0,
			);

			this.costumeManager.downloadCostumePreview(
				image,
				json,
				resourceName,
			);

			this.previewLoading = false;
			this.setBanditIconPreview(bandit, type);

			return true;
		});
	}

	setBanditIconGeneric(bandit, type, costumeId) {
		this.setBanditIcon(
			bandit, // TODO CSSURL.from()
			"url(" +
				MOD.COSTUMES_IMAGES_BASE_URL +
				this.uiCostumes[bandit][type][costumeId].icon +
				")",
		);
	}

	setBanditIconPreview(bandit, type) {
		// TODO generate preview loaded bandit icon from spritesheet
		this.setBanditIcon(
			bandit,
			"url(" +
				MOD.COSTUMES_IMAGES_BASE_URL +
				this.previewIcons[bandit][type] +
				")",
		);
	}

	createPanel() {
		let panel = document.createElement("div");
		panel.className = "costumes-panel";

		return panel;
	}

	generatePreviewButton(bandit, type) {
		return this.createCostumeButton(
			"Preview (" + type + ")",
			MOD.COSTUMES_IMAGES_BASE_URL + this.previewIcons[bandit][type],
		);
	}

	generateButtons(bandit, type) {
		return this.uiCostumes[bandit][type].map((uiCostume) => {
			return this.createCostumeButton(
				uiCostume.name,
				MOD.COSTUMES_IMAGES_BASE_URL + uiCostume.icon,
			);
		});
	}

	createCostumeButton(name, icon) {
		let button = document.createElement("a");
		button.className = "costume-button";

		let iconGlowEl = document.createElement("img");
		iconGlowEl.className = "fgm-class-img fgm-class-img-glow costume-icon";
		iconGlowEl.src = icon;
		iconGlowEl.style.cssText = `
			transform:
				translate(-50%, 0) translateZ(-1px) scaleX(1.11) scaleY(1.06);
		`;
		button.appendChild(iconGlowEl);

		let iconEl = document.createElement("img");
		iconEl.className = "fgm-class-img costume-icon";
		iconEl.src = icon;
		button.appendChild(iconEl);

		let nameEl = document.createElement("span");
		nameEl.className = "costume-name";
		nameEl.textContent = name;
		if (name.length > 14) {
			// Good enough
			let size = 18 - Math.sqrt(name.length - 14) * 1.5;
			nameEl.style["font-size"] = size + "cqh";
		}
		button.appendChild(nameEl);

		return button;
	}

	async tryEquipCostume(bandit, type, costumeId, onEquip) {
		let panel = this.panels[bandit];
		let oldData = this.selectedCostumes[bandit];

		if (oldData == null) {
			if (!(await onEquip(bandit, type, costumeId)))
				return;

			this.selectButton(panel, type, costumeId);
			this.equipCostume(bandit, type, costumeId);

			return;
		}

		let oldType = oldData.type;
		let oldCostumeId = oldData.costumeId;

		if (oldType == type && oldCostumeId == costumeId) {
			this.deselectButton(panel, type, costumeId);
			this.unequipCostume(bandit);
			this.setBanditIcon(bandit, this.defaultIcons[bandit]);
		} else {
			if (!(await onEquip(bandit, type, costumeId)))
				return;

			this.deselectButton(panel, oldType, oldCostumeId);
			this.selectButton(panel, type, costumeId);
			this.equipCostume(bandit, type, costumeId);
		}
	}

	equipCostume(bandit, type, costumeId) {
		let data = {
			type: type,
			costumeId: costumeId,
		};
		this.selectedCostumes[bandit] = data;
		window.localStorage.setItem(bandit, JSON.stringify(data));
	}

	unequipCostume(bandit) {
		this.selectedCostumes[bandit] = null;
		window.localStorage.setItem(bandit, null);
	}

	selectButton(panel, type, costumeId) {
		panel.buttons[type][costumeId].classList.add("selected");
	}

	deselectButton(panel, type, costumeId) {
		panel.buttons[type][costumeId].classList.remove("selected");
	}

	showPanel(bandit) {
		this.panels[bandit].classList.add("shown");
	}

	hidePanel(bandit) {
		this.panels[bandit].classList.remove("shown");
	}

	setupFileButton() {
		this.openFile = document.createElement("input");
		this.openFile.type = "file";
		this.openFile.accept = "image/png";
		this.openFile.style.display = "none";
	}

	waitFileChange() {
		return new Promise((resolve) => {
			let handle = (input) => {
				resolve(input);
				this.openFile.removeEventListener("change", handle);
			};
			this.openFile.addEventListener("change", handle);
		});
	}

	waitFileCancel() {
		return new Promise((resolve) => {
			let handle = () => {
				resolve();
				this.openFile.removeEventListener("cancel", handle);
			};
			this.openFile.addEventListener("cancel", handle);
		});
	}

	waitReaderOnLoad(file) {
		var reader = new FileReader();
		reader.readAsBinaryString(file);

		return new Promise((resolve) => {
			reader.onload = (result) => {
				resolve(result);
			};
		});
	}

	updateGameButtons() {
		this.defaultIcons = {};

		let spawnScreenBanditsContainer =
			document.querySelector(".fgm-classes-c");

		window.BANDIT_NAMES.forEach((bandit) => {
			let banditButton = spawnScreenBanditsContainer.querySelector(
				".fgm-class-" + bandit,
			);

			banditButton.addEventListener("click", () => {
				if (this.selectedBandit != bandit) {
					this.showPanel(bandit);
					this.hidePanel(this.selectedBandit);
					this.selectedBandit = bandit;
				}
			});

			// TODO maybe move this elsewhere logically
			// had to place updateGameButtons above setupPanels
			let banditImg = banditButton.querySelector(".fgm-class-img");
			this.defaultIcons[bandit] = banditImg.style["background-image"];
		});
	}

	setBanditIcon(bandit, icon) {
		let cont = document.querySelector(".fgm-class-" + bandit);
		let imgs = cont.querySelectorAll(".fgm-class-img");
		imgs.forEach((el) => (el.style["background-image"] = icon));
	}
}

class Util {
	static baseTwoNums(n, base) {
		let high = Math.floor(n / base);
		let low = n % base;
		return [high, low];
	}

	// TODO sometimes one character is enough
	static encodeHiddenSymbols(n) {
		let a = this.baseTwoNums(n, MOD.ENCODING_CHARACTERS.length);
		let res =
			String.fromCodePoint(parseInt(MOD.ENCODING_CHARACTERS[a[0]])) +
			String.fromCodePoint(parseInt(MOD.ENCODING_CHARACTERS[a[1]]));

		return res;
	}

	static decodeHiddenSymbolsStr(str) {
		if (str.length < 2)
			return null;

		let cc1 = MOD.ENCODING_CHARACTERS.indexOf(
			str.charCodeAt(str.length - 1),
		);
		let cc2 = MOD.ENCODING_CHARACTERS.indexOf(
			str.charCodeAt(str.length - 2),
		);

		if (cc1 == -1 || cc2 == -1)
			return null;

		return cc1 + cc2 * MOD.ENCODING_CHARACTERS.length;
	}
}

function setupCostumesPatches(costumeManager, selectedCostumes) {
	game.renderer.loader.defaultQueryString = "";

	// Game.spawn_self
	window._$oJ.prototype._$17 = function (a) {
		if (this._$1G == true) {
			this.chat._$kF("You are currently spectating!");
			return -1;
		}

		// 11 lines added
		let bandit = a.c;
		let data = selectedCostumes[bandit];
		if (data != null) {
			let banditCostumeId = costumeManager.encodeBanditCostumeId(
				bandit,
				data.type,
				data.costumeId,
			);
			if (banditCostumeId != null)
				a.n += Util.encodeHiddenSymbols(banditCostumeId);
		}

		this.server.emit("spawn", a);
		this.chat._$nt();
	};

	function parseCostumeResourceName(bandit, nickname) {
		let banditCostumeId = Util.decodeHiddenSymbolsStr(nickname);
		if (banditCostumeId == null)
			return null;

		let data = costumeManager.decodeBanditCostumeId(
			bandit,
			banditCostumeId,
		);
		if (data == null)
			return null;

		return costumeManager.getCostumeResourceName(
			bandit,
			data.type,
			data.costumeId,
		);
	}

	// World.spawn_player
	window._$6G.prototype.injectBefore(
		window._$6G.prototype._$fM,
		(playerId, c) => {
			let bandit = c.c;
			if (bandit != null && bandit != "dummy") {
				let resourceName = parseCostumeResourceName(bandit, c.nickname);
				if (resourceName != null) c.cos = resourceName;
				else if (playerId == game.selfid) {
					let data = selectedCostumes[bandit];
					if (data != null && data.type.endsWith("preview")) {
						c.cos = costumeManager.getCostumeResourceName(
							bandit,
							data.type,
							0,
						);
					}
				}
			}

			return [playerId, c];
		},
	);

	// TODO just add more logic to sprite constructor. it calls this
	// Renderer.loadResource
	window._$fW.prototype._$f2 = function (a) {
		if (!(a in this.loader.resources)) {
			if (a.endsWith("_CC")) {
				costumeManager.loadCostume(a);
			} else if (a in this._$ha) {
				this._$q3();
			} else if (a in this._$jT) {
			} else {
				this._$ha[a] = a;
				this._$q3();
			}
		}

		return a;
	};
}

function setupProjectilesFix() {
	function createSprite(a, b, baseResource) {
		let sprite = new window.Sprite(a, b);
		if (baseResource != null) {
			sprite.base = baseResource;
			sprite.renderer._$f2(sprite.base);
		}

		return sprite;
	}

	// Renderer.draw
	window._$fW.prototype._$6l = function (a) {
		for (var b in a.entities) {
			var c = a.entities[b];
			if (!(c.type in this.spritesDatas)) {
				continue;
			}
			if (!(b in this.entities)) {
				// 1 line changed
				var d = createSprite(this, c.type, c.baseResource);

				this.entities[b] = d;
			}
			this.entities[b]._$qs(c);
		}
		for (var b in a._$4J) {
			this._$O(b);
		}
		if ("camerax" in a && "cameray" in a) {
			this.camerax = a.camerax;
			this.cameray = a.cameray;
		}
		this.maplimits = a["maplimits"];
	};

	window.PROJECTILE_CLASSES.iterate((key, value, i) => {
		if (!(value instanceof Function))
			return;

		// BaseProjectileEntity.create
		value.prototype.injectAfter(
			value.prototype._$5j,
			function (tick, result) {
				let caster = window.game.renderer.entities[this.pid];
				if (caster != null) {
					let bandit = caster.type;
					if (this._$4F != "bullet2" || bandit == "sniper")
						result.baseResource = caster._$hU.base;
				}

				return result;
			},
		);
	});
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

start();