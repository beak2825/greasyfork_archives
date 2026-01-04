// ==UserScript==
// @name         VRChat Extended Favorites
// @namespace    http://tampermonkey.net/
// @version      2025.09.22.2
// @description  A simple userscript to give you the ability to favorite more avatars.
// @author       https://github.com/xskutsu
// @license      AGPL-3.0
// @match        *://vrchat.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vrchat.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/550323/VRChat%20Extended%20Favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/550323/VRChat%20Extended%20Favorites.meta.js
// ==/UserScript==

(function () {
	"use strict";

	function getAvatarID(avatarURL) {
		return avatarURL.split("avtr_")[1];
	}

	class Storage {
		static gmKey = "extended_favorites.favorites_storage";
		static data = new Map();

		static stringify() {
			return JSON.stringify([...this.data.entries()]);
		}

		static save() {
			GM_setValue(this.gmKey, this.stringify());
		}

		static parse(data) {
			return new Map(JSON.parse(data));
		}

		static load(data = GM_getValue(this.gmKey, "[]")) {
			try {
				this.data = this.parse(data);
			} catch (error) {
				console.error("Failed to load favorite avatars! Something has gone wrong. Falling back to blank.");
				this.data = new Map();
				console.error(error);
				alert("Failed to load favorite avatars, falling back to blank. Check the console for more information.");
			}
		}

		static addFavorite(cardData) {
			this.data.set(cardData.id, cardData);
			this.save();
		}

		static removeFavorite(cardData) {
			const result = this.data.delete(cardData.id);
			if (result) {
				this.save();
			}
			return result;
		}

		static isFavorited(cardData) {
			return this.data.has(cardData.id);
		}

		static getFavorites() {
			return [...this.data.values()];
		}

		static wipe() {
			this.data.clear();
			this.save();
		}
	}

	Storage.load();

	function switchToAvatar(cardData) {
		return fetch("https://vrchat.com/api/1/avatars/avtr_" + cardData.id + "/select", {
			method: "PUT",
			credentials: "include"
		});
	}

	function updateButtonState(cardData, button, isFavorited = Storage.isFavorited(cardData)) {
		if (isFavorited) {
			button.textContent = "Remove from Extended ⭐";
			button.style.backgroundColor = "#B60000";
		} else {
			button.textContent = "Add to Extended ⭐";
			button.style.backgroundColor = "";
		}
	}

	function extractAvatarDataFromCard(container) {
		const imageContainer = container.querySelectorAll('[aria-label="Avatar Image"]')[0];
		const imageElement = imageContainer.querySelector("img");
		const avatarURL = imageContainer.href;
		return {
			avatarName: imageElement.alt,
			avatarURL: avatarURL,
			imageURL: imageElement.src,
			id: getAvatarID(avatarURL)
		}
	}

	function isNotFavoritable(container) {
		return container.querySelector('div[role="note"][title="Avatar Release Status"]') !== null;
	}

	function addButtonToCard(container) {
		const informationContainer = container.querySelector(".flex-grow-1");
		const button = document.createElement("button");
		button.textContent = "...";
		button.style.marginTop = "auto";
		button.setAttribute("data-extended-fav", "true");
		informationContainer.appendChild(button);
		if (isNotFavoritable(container)) {
			button.textContent = "Can't Add (Private)";
			button.style.backgroundColor = "#000000";
			return;
		}
		const cardData = extractAvatarDataFromCard(container);
		updateButtonState(cardData, button);
		button.addEventListener("click", function () {
			const isFavorited = Storage.isFavorited(cardData);
			if (isFavorited) {
				Storage.removeFavorite(cardData);
			} else {
				Storage.addFavorite(cardData);
			}
			updateButtonState(cardData, button, !isFavorited);
		});
	}

	const avatarCardSelector = '[data-scrollkey^="avtr"][aria-label="Avatar Card"]';
	document.body.querySelectorAll(avatarCardSelector).forEach(addButtonToCard);



	function refreshCardButtons() {
		document.querySelectorAll(avatarCardSelector).forEach(container => {
			const button = container.querySelector("button[data-extended-fav]");
			if (!button) {
				return;
			}
			const cardData = extractAvatarDataFromCard(container);
			updateButtonState(cardData, button);
		});
	}

	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			if (mutation.type !== 'childList') {
				return;
			}
			mutation.addedNodes.forEach(node => {
				if (node.nodeType !== Node.ELEMENT_NODE) {
					return;
				}

				if (node.matches(avatarCardSelector)) {
					addButtonToCard(node);
				}
				node.querySelectorAll(avatarCardSelector).forEach(addButtonToCard);
			});
		});
	});
	observer.observe(document.body, {
		childList: true,
		subtree: true
	});

	class MenuFactory {
		static makeBackground() {
			const container = document.createElement("div");
			container.style.cssText = `
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				z-index: 99999;
				background-color: #00000099;
				width: 100vw;
				height: 100vh;`;
			return container;
		}

		static makeContainer() {
			const container = document.createElement("div");
			container.style.cssText = `
				background-color: #202020;
				border: 3px solid #9090BB;`;
			return container;
		}

		static makeButton(textContent, clickCallback = null, isDire = false) {
			const button = document.createElement("button");
			button.textContent = textContent;
			if (isDire) {
				button.style.cssText = `
					background-color: #B60000;`;
			}
			if (clickCallback) {
				button.addEventListener("click", function () {
					clickCallback();
				});
			}
			return button;
		}

		static makeAvatarCard(cardData) {
			const container = document.createElement("div");
			container.style.cssText = `
				border: 3px solid #9090BB;
				padding: 6px;`;

			const iconImg = document.createElement("img");
			iconImg.style.cssText = `
				aspect-ratio: 4 / 3;
				height: 210px;
				width: 280px;`;
			iconImg.src = cardData.imageURL;
			container.appendChild(iconImg);

			const titleText = document.createElement("p");
			titleText.textContent = cardData.avatarName;
			container.appendChild(titleText);

			const buttonContainer = document.createElement("div");
			buttonContainer.style.cssText = `
				display: flex;
				justify-content: center;
				align-items: center;`;
			container.appendChild(buttonContainer);

			const removeButton = this.makeButton("Remove", null, true);
			removeButton.addEventListener("click", function () {
				if (removeButton.textContent === "Sure?") {
					Storage.removeFavorite(cardData);
					refreshCardButtons();
					Menu.closeMenu();
					Menu.openMenu();
				}
				removeButton.textContent = "Sure?";
			});
			buttonContainer.appendChild(removeButton);

			buttonContainer.appendChild(this.makeButton("Use Avatar", async function () {
				const response = await switchToAvatar(cardData);
				if (response.ok) {
					alert("Switched to avatar!");
					return;
				}
				switch (response.status) {
					case 403:
						alert("HTTP Error 403: Is the avatar private?");
						break;
					default:
						alert("HTTP Error " + response.status.toString());
				}
			}));

			buttonContainer.appendChild(this.makeButton("Open URL", function () {
				open(cardData.avatarURL);
			}));

			return container;
		}

		static makeAvatarList() {
			const container = document.createElement("div");
			container.style.cssText = `
				display: grid;
    				grid-template-columns: repeat(4, 1fr);
        			gap: 5px;
        			overflow-y: auto;
				overflow-x: hidden;
        			max-height: 92.1465vh;
        			padding: 6px;`;
			for (const cardData of Storage.getFavorites()) {
				container.appendChild(this.makeAvatarCard(cardData));
			}
			return container;
		}

		static makeTopBar() {
			const container = document.createElement("div");
			container.style.cssText = `
				border-bottom: 3px solid #9090BB;
				padding-bottom: 5px;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 6px;`;

			const titleText = document.createElement("a");
			titleText.textContent = "Extended Favorites | Made with ♡ for you by xskutsu";
			titleText.href = "https://github.com/xskutsu";
			titleText.style.cssText = `
				margin-right: auto;
				font-weight: bold;`;
			container.appendChild(titleText);

			container.appendChild(this.makeButton("Import", function () {
				let data = prompt("Paste your exported favorites JSON here:");
				if (data) {
					try {
						if (data.startsWith('"') && data.endsWith('"')) {
							data = data.slice(1, -1).replace(/\\"/g, '"');
						}
						const imported = Storage.parse(data);
						let addedCount = 0;
						for (const cardData of imported.values()) {
							if (!Storage.isFavorited(cardData)) {
								Storage.addFavorite(cardData);
								addedCount++;
							}
						}
						alert(`Added ${addedCount} avatars from a list of ${imported.size}.`);
						refreshCardButtons();
						Menu.closeMenu();
						Menu.openMenu();
					} catch (error) {
						alert("Failed to import favorites. Check the console for more information.");
						console.error(error);
					}
				}

			}));
			container.appendChild(this.makeButton("Export", function () {
				const data = Storage.stringify();
				GM_setClipboard(data);
				alert("Favorites JSON copied to clipboard!");
			}));
			container.appendChild(this.makeButton("Wipe", function () {
				const key = "Yes, I am sure!";
				if (prompt('Are you sure you want to wipe ALL extended favorite avatars? If so, type "' + key + '" exactly if you are sure.') === key) {
					Storage.wipe();
					refreshCardButtons();
					Menu.closeMenu();
					Menu.openMenu();
				}

			}, true));
			container.appendChild(this.makeButton("Add Visible", function () {
				let entriesCount = 0;
				let unfavoritableCount = 0;
				for (const container of document.body.querySelectorAll(avatarCardSelector)) {
					if (isNotFavoritable(container)) {
						unfavoritableCount++;
						continue;
					}
					const cardData = extractAvatarDataFromCard(container);
					if (Storage.isFavorited(cardData)) {
						continue;
					}
					entriesCount++;
					Storage.addFavorite(cardData);
				}
				if (unfavoritableCount == 0) {
					alert(`Added ${entriesCount} avatars to Extended Favorites. (Does not include duplicates.)`);
				} else {
					alert(`Added ${entriesCount} avatars to Extended Favorites, ${unfavoritableCount} were unable due to being private. (Does not include duplicates.)`);
				}
				refreshCardButtons();
				Menu.closeMenu();
				Menu.openMenu();
			}));
			container.appendChild(this.makeButton("Exit", function () {
				Menu.closeMenu();
			}, true));
			return container;
		}

		static make() {
			const container = this.makeContainer();
			container.appendChild(this.makeTopBar());
			container.appendChild(this.makeAvatarList());

			const background = this.makeBackground();
			background.appendChild(container);
			return background;
		}
	}

	class Menu {
		static isOpen = false;
		static container = null;

		static openMenu() {
			if (this.container !== null) {
				this.closeMenu();
			}
			this.isOpen = true;
			this.container = MenuFactory.make();
			document.body.appendChild(this.container);
		}

		static closeMenu() {
			this.isOpen = false;
			if (this.container !== null) {
				this.container.remove();
			}
		}

		static toggleMenu() {
			if (this.isOpen) {
				this.closeMenu();
			} else {
				this.openMenu();
			}
		}
	}

	GM_registerMenuCommand("Toggle Menu", function () {
		Menu.toggleMenu();
	});
})();