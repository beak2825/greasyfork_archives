// ==UserScript==
// @name         UnverifiedV2
// @namespace    http://tampermonkey.net/
// @version      2.37
// @description  Look at my license before you modify, I WILL DMCA you.
// @license      Proprietary License
// @author       @Miniblox!
// @match        https://miniblox.io/*
// @match        https://miniblox.org/*
// @match        https://miniblox.com/*
// @match        https://blockcraft.io/*
// @icon         https://miniblox.io/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558063/UnverifiedV2.user.js
// @updateURL https://update.greasyfork.org/scripts/558063/UnverifiedV2.meta.js
// ==/UserScript==



class LurkerChecker {
  static lurkerInstalled() {
	  return document.getElementById('_L7Banner') !== null;
	}
}
class UnverifiedIntro {
	constructor() {

		this.container = document.createElement("div");
		Object.assign(this.container.style, {
			position: "fixed",
			top: 0, left: 0, width: "100vw", height: "100vh",
			display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
			backgroundColor: "black",
			overflow: "hidden", zIndex: 9999,
		});

		this.check = document.createElement("div");
		this.check.textContent = "✓";
		Object.assign(this.check.style, {
			color: "red", fontSize: "5rem", opacity: 0.05,
			transition: "opacity 1s ease, transform 1s ease",
			textShadow: '0 0 5px red, 0 0 10px red, 0 0 20px red',
		});

		this.circle = document.createElement("div");
		Object.assign(this.circle.style, {
			width: "100px",
			height: "100px",
			backgroundColor: "black",
			border: "2px solid red",
			borderRadius: "50%",
			boxShadow: "0 0 10px red, 0 0 20px red, 0 0 30px red",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			opacity: 0,
			transition: "opacity 1s ease, transform 1s ease",
		});
		this.circle.appendChild(this.check);
		this.container.appendChild(this.circle);

		this.unverifiedText = document.createElement("div");
		this.unverifiedText.textContent = "UnverifiedV2";
		Object.assign(this.unverifiedText.style, {
			color: "red", fontSize: "60px", opacity: 0,
			marginTop: "50px",
			transition: "opacity 0.8s ease",
			textShadow: '0 0 5px red, 0 0 10px red, 0 0 20px red',
		});
		this.container.appendChild(this.unverifiedText);

		this.creditsText = document.createElement("div");
		this.creditsText.textContent = "@Miniblox!";
		Object.assign(this.creditsText.style, {
			color: "red", fontSize: "30px", opacity: 0, transition: "opacity 0.8s ease",
			whiteSpace: 'pre-line',
			textAlign: "center",
			textShadow: '0 0 5px red, 0 0 10px red, 0 0 20px red',
		});
		this.container.appendChild(this.creditsText);
	}
  playIntro() {
		document.body.appendChild(this.container);

		this.circle.style.opacity = 1;
		this.check.style.opacity = 1;

		setTimeout(() => {
			this.check.style.transform = "rotate(180deg)";
		}, 500);

		setTimeout(() => {
			if (LurkerChecker.lurkerInstalled()) {
				this.unverifiedText.textContent = 'UnverifiedV2 x Lurker';
				document.title = 'UnverifiedV2 x Lurker';
			}
			this.unverifiedText.style.opacity = 1;
		}, 1000);

		setTimeout(() => {
			this.creditsText.style.opacity = 1;
		}, 1500);

		setTimeout(() => {
			this.container.style.transition = "opacity 1s ease";
			this.container.style.opacity = 0;
		}, 2500);

		setTimeout(() => {
			this.container.remove();
		}, 3000);
	}
	showInitializedNotif() {
    const initializedNotification = document.createElement("div");
    initializedNotification.classList.add('initialized-notification');
    initializedNotification.textContent = "UnverifiedV2 Initialized";
    document.body.appendChild(initializedNotification);
    setTimeout(() => {
        initializedNotification.style.top = "10px";
        initializedNotification.style.opacity = "1";
    }, 10);
    setTimeout(() => {
        initializedNotification.style.top = "-50px";
        initializedNotification.style.opacity = "0";
    }, 2000);
		setTimeout(() => {
				initializedNotification.remove();
		}, 3000);
	}
}


class UnverifiedStyler {
	constructor() {
		this.observer = null;
		this.background = new UnverifiedBackground();
		this.banner = new UnverifiedBanner();
		this.shortcutMenu = new UnverifiedShortcutMenu();

		this.visuallyRemoveSelectors = [
			'.chakra-image.css-1je8qb9', // Miniblox logo
			'.chakra-stack.css-7kkhgi', // Discord button
		];
		this.backgroundSelectors = [
			'img.chakra-image.css-rkihvp',
			'img.chakra-image.css-mohuzh',
			'.css-aznra0',
		];
		this.generalStylingSelectors = new Set([
			'.chakra-button.css-cuh8pi',  // play button
			'.chakra-button.css-32lhf4',  // left menu buttons
			'.chakra-button.css-5ov7ui',  // signin button, box, ingame menu button
			'.chakra-button.css-18wnugv', // customize button
			'.chakra-button.css-he6upe',  // daily button
			'.chakra-button.css-1oxqv3t',  // daily ready button
			'.chakra-button.css-1dkorm4', // free coin button
			'.css-10y588r',               // user info box
			'button.chakra-button.css-livqej', // leave game button
			'button.chakra-button.css-1jg2qv0', // Settings done button
			'div.css-aidfhd',             // Dressing room profile
			'div.css-1kd330l',            // Dressing room buttons
			'button.chakra-button.css-14mkusw', // planet buttons
			'button.chakra-button.css-8q1apo',  // back button
			'.css-1a6laq6',               // sliders outer part
			'button.chakra-button.css-1axaj8o',  // invite+exit quick-launch buttons
			'button.chakra-button.css-xircll',  // left menu back button
			'.css-1xy2x8',   						  // dressing room epic skins
			'.css-i1x0qw',   						  // dressing room rare skins
			'.css-jnnvp4',   						  // dressing room legendary skins
			'.css-hk5viu',   						  // dressing room common skins
			'.css-55x3n6',   						  // dressing room selected common skins
			'.css-n15lby',                // dressing room selected rare skins
			'.css-1xqsddr',   						  // dressing room selected epic skins
			'.css-1ibhl1y',              // dressing room selected legendary skins
			'.chakra-stack.css-1c10cfa',  // friend list block
			'.chakra-form-control.css-1kxonj9',  // friend search bar
			'.chakra-button.css-1dcrejx',  // friend search button
			'.chakra-button.css-1ote1yx',  // profile change buttons
			'.css-qkv95g',  	             // planet load selects
			'.css-1r8eeg2',  	             // planet browse selects
			'.chakra-input.css-18whhxd',    // player search bar
			'.chakra-input.css-ypk59i',    // profile input bar email
			'.chakra-input.css-1oc9k70',    // profile input bar username, password
			'.css-nizmkx',     					// player info box xp bar
			'.css-r7134l',     					// ranking cat box
			'.css-qzh2oi',     					// ranking selected cat box
			'.chakra-button.css-137k3gn', 	// sign done button
			'.chakra-button.css-1n378o7', 	// open loot box button
			'.css-1f34n7d', 	          // daily login reward small
			'.css-tncl4j', 	          // daily login reward large
			'.css-1tyymsb', 	          // daily login today reward
			'.css-ol7umz', 	          // daily login tomorrow? reward
			'.chakra-button.css-12t4nq4', 	          // daily login next reward
		]);
		this.specificStylingSelectors = new Map([
			['button.chakra-button.css-1axaj8o', e => { e.style.fontSize = '24px'; e.style.padding = '1px 1px' }],  // invite+exit quick-launch buttons
			['.chakra-button.css-cuh8pi', e => { e.style.fontSize = '20px' }],                            // play button
			['.css-1xy2x8', e => { e.style.border = '2px solid purple'; e.style.padding = '0 10px' }],     // dressing room epic skins
			['.css-i1x0qw', e => { e.style.border = '2px solid green'; e.style.padding = '0 10px' }],     // dressing room rare skins
			['.css-jnnvp4', e => { e.style.border = '2px solid yellow'; e.style.padding = '0 10px' }],    // dressing room legendary skins
			['.css-hk5viu', e => { e.style.border = '2px solid gray'; e.style.padding = '0 10px' }],      // dressing room common skins
			['.css-qzh2oi', e => { e.style.border = '2px solid white' }],                                            // ranking selected cat box
			['.chakra-button.css-1iuk66d', e => { e.style.border = '1px solid white'; e.style.borderRadius = '12px' }], // join friends button
			['.chakra-button.css-73nw7g', e => { e.style.border = '1px solid white'; e.style.borderRadius = '12px' }], // remove friends button
			['.css-55x3n6', e => { e.style.border = '2px solid white'; e.style.padding = '0 10px' }],                // dressing room selected common skins
			['.css-n15lby', e => { e.style.border = '2px solid lime'; e.style.padding = '0 10px' }],                // dressing room selected rare skins
			['.css-1xqsddr', e => { e.style.border = '2px solid pink'; e.style.padding = '0 10px' }],                // dressing room selected epic skins
			['.css-1ibhl1y', e => { e.style.border = '2px solid orange'; e.style.padding = '0 10px' }],              // dressing room selected legendary skins
			['.chakra-input.css-ypk59i', e => { e.style.border = 'none'; e.style.background = 'none'; }],              // email input form double border fix
			['.chakra-input.css-1oc9k70', e => { e.style.border = 'none'; e.style.background = 'none'; }],              // profile input bar username, password
			['.chakra-input.css-18whhxd', e => { e.style.border = 'none'; e.style.background = 'none'; }],              // player search
			['.css-nizmkx', e => { e.style.padding = '0 0' }],                                                    // player xp bar
			['.chakra-slider', e => { e.style.padding = '0 0'; e.style.borderRadius = '12px' }],  	                    // slider inner part
			['.css-1a6laq6', e => { e.style.padding = '0 0' }],                                              // sliders outer part
			['.chakra-slider__filled-track.css-li9pez', e => { e.style.borderRadius = '12px' }],                        // sliders drag bg part
		]);
		this.blackBackgroundSelectors = [
			'.chakra-stack.css-1cklnv0',  // account data bg
			'.chakra-stack.css-oou8ol',  // profile left menu bg
			'.chakra-stack.css-owjkmg',  // friends list bg
			'.chakra-stack.css-15uwvcw',  // discord connection bg
			'.chakra-stack.css-1hj4r72',  // dressing room bg
			'.chakra-stack.css-10tqh5h',  // subscriptions bg
			'.chakra-stack.css-wv1k6p',  // player stats bg
			'.chakra-stack.css-b1sb84',  // shop bg
			'.chakra-stack.css-b1sb84',  // ranking bg
			'.chakra-modal__content.css-1n1g7m4',  // daily login bg
			'.chakra-modal__content.css-1ah3qhl',  // partner sites bg
			'.chakra-modal__content.css-1yhxaze', // loot box bg
		];
		this.skipMouseInOutListeners = new Set([
			'.chakra-input.css-ypk59i',    // profile input bar email
			'.chakra-input.css-1oc9k70',    // profile input bar username, password
			'.chakra-input.css-18whhxd',     // player search
		]);
	}
	visuallyRemove(e) {

	  if (!e) {
		  return;
		}
		e.style.opacity = 0;
		e.style.zIndex = -1;
	}
	isMainScreen() {
		return this.shortcutMenu.getPlayButton() !== null;
	}
	addStyleObserver() {
		document.title = '@Miniblox';
		this.observer = new MutationObserver(mutations => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node.nodeType !== Node.ELEMENT_NODE) continue;

					for (const selector of this.visuallyRemoveSelectors) {
						if (node.matches(selector)) {
							this.visuallyRemove(node);
						}
						node.querySelectorAll(selector).forEach(e => {
							this.visuallyRemove(node);
						});
					}

					for (const selector of this.backgroundSelectors) {
						if (node.matches(selector)) {
							this.background.setBG(node);
						}
						node.querySelectorAll(selector).forEach(e => {
							this.background.setBG();
						});
					}

					for (const selector of this.generalStylingSelectors) {
						if (node.matches(selector)) {
							this.applyGeneralStyle(node, selector);
						}
						node.querySelectorAll(selector).forEach(e => {
							this.applyGeneralStyle(e, selector);
						});
					}

					for (const selector of this.specificStylingSelectors.keys()) {
						if (node.matches(selector)) {
							this.applySpecificStyle(node, selector);
						}
						node.querySelectorAll(selector).forEach(e => {
							this.applySpecificStyle(e, selector);
						});
					}

					if (this.isMainScreen()) {
						this.shortcutMenu.addShortcutMenu();
						this.banner.addBanner();
					} else {
						this.shortcutMenu.removeShortcutMenu();
						this.banner.removeBanner();
					}

					for (const selector of this.blackBackgroundSelectors) {
						if (node.matches(selector)) {
							this.removeBlackBackground(node);
						}
						node.querySelectorAll(selector).forEach(e => {
							this.removeBlackBackground(e);
						});
					}
				}
			}
		});
		this.observer.observe(document.body, { childList: true, subtree: true });
	}
	initialTriggerStyleObserver() {

	  this.shortcutMenu.getPlayButton().click();
		setTimeout(() => {
			this.shortcutMenu.getExitButton().click();
		}, 70)
	}
	applyGeneralStyle(e, selector) {

		e.style.padding = '10px 20px';
		e.style.backgroundColor = (!e.unverifiedMouseIn) ? 'rgba(211, 211, 211, 0.4)' : 'rgba(185, 185, 185, 0.4)';
		e.style.color = 'white';
		e.style.border = '1px solid #D3D3D3';
		e.style.borderRadius = '12px';
		e.style.fontSize = '16px';
		e.style.cursor = 'pointer';
		e.style.transition = 'transform 0.2s ease';
		e.style.outline = 'none';
		e.style.boxShadow = 'none';
		if (!this.skipMouseInOutListeners.has(selector)) {
			e.addEventListener('mouseover', () => {
				e.unverifiedMouseIn = true;
				e.style.backgroundColor = 'rgba(185, 185, 185, 0.4)';
			});
			e.addEventListener('mouseout', () => {
				e.unverifiedMouseIn = false;
				e.style.backgroundColor = 'rgba(211, 211, 211, 0.4)';
			});
		}
	}
	applySpecificStyle(e, selector) {
		this.specificStylingSelectors.get(selector)(e);
	}
	removeBlackBackground(e) {
		e.style.background = 'transparent';
		e.style.backgroundColor = 'none';
		e.style.boxShadow = 'none';
		if (!e.textContent.startsWith('Browse')) {
			e.style.backdropFilter = 'blur(1px)';
			e.style.webkitBackdropFilter = 'blur(1px)';
		}
	}
}


class UnverifiedBackground {
  constructor() {
		this.bgObserver = null;
		this.bg1 = "https://images.wallpaperscraft.com/image/single/anime_forest_purple_scenery_117524_1920x1080.jpg";
		this.currentBG = this.bg1;
	}
	setBG(e) {
	  e.src = this.currentBG;
	}
}


class UnverifiedBanner {
  constructor() {
		this.e = document.createElement('div');
		this.e.textContent = 'UnverifiedV2\n\nBy @Miniblox!'
		this.e.id = 'unverified-banner';
		this.e.style.whiteSpace = 'pre-line';
		this.e.style.textAlign = 'center';
		this.e.style.zIndex = 999;
		this.e.style.position = "absolute";
		this.e.style.top = "8.5%";
		this.e.style.left = "50%";
		this.e.style.transform = "translate(-50%, -50%)";
		this.e.style.padding = '10px 20px';
		this.e.style.backgroundColor = 'rgba(211, 211, 211, 0.4)';
		this.e.style.color = 'white';
		this.e.style.border = '1px solid #D3D3D3';
		this.e.style.borderRadius = '12px';
		this.e.style.fontSize = '24px';
		this.e.style.cursor = 'pointer';
		this.e.style.transition = 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease';
		this.e.style.outline = 'none';
		this.e.style.boxShadow = 'none';
		this.e.addEventListener('mouseover', () => {
			this.e.style.backgroundColor = 'rgba(185, 185, 185, 0.4)';
			this.e.style.transform = 'translate(-50%, -50%), scale(1.01)';
			this.e.style.top = "8.5%";
			this.e.style.left = "50%";
		});
		this.e.addEventListener('mouseout', () => {
			this.e.style.backgroundColor = 'rgba(211, 211, 211, 0.4)';
			this.e.style.transform = 'translate(-50%, -50%), scale(1)';
			this.e.style.top = "8.5%";
			this.e.style.left = "50%";
		});
		this.shown = false;
	}
	addBanner() {
		if (!this.shown) {
			document.body.appendChild(this.e);
		  this.shown = true;
		}
	}
	removeBanner() {
		if (this.shown) {
			this.shown = false;
			this.e.remove();
		}
	}
}


class UnverifiedShortcutMenu {
	constructor() {
		this.onclicks = [
			() => {  // Kit
				this.getPlayButton().click();
				setTimeout(() => this.getKitPVPButton().click(), 70);
				document.body.removeChild(this.container);
			},
			() => {  // Sky
				this.getPlayButton().click();
				setTimeout(() => this.getSkywarsButton().click(), 70);
				document.body.removeChild(this.container);
			},
			() => {  // Doubles
				this.getPlayButton().click();
				setTimeout(() => this.getDoublesButton().click(), 70);
				document.body.removeChild(this.container);
			},
			() => {  // Quads
				this.getPlayButton().click();
				setTimeout(() => this.getQuadsButton().click(), 70);
				document.body.removeChild(this.container);
			},
			() => {  // Classic
				this.getPlayButton().click();
				setTimeout(() => this.getClassicPVPButton().click(), 70);
				document.body.removeChild(this.container);
			},
		];
		this.container = document.createElement("div");
		Object.assign(this.container.style, {
			position: "absolute",
			top: "82%",
			left: "50%",
			transform: "translate(-50%, -50%)",
			padding: "20px",
			borderRadius: "12px",
			display: "flex",
			flexDirection: "row",
			gap: "10px",
			alignItems: "center",
			zIndex: "99"
		});
        let i = 0; [].forEach(label => {
			const button = document.createElement("button");
			button.textContent = label;
			button.style.padding = '8px 16px';
			button.style.backgroundColor = 'rgba(211, 211, 211, 0.4)';
			button.style.color = 'white';
			button.style.border = '1px solid #D3D3D3';
			button.style.borderRadius = '6px';
			button.style.fontSize = '16px';
			button.style.cursor = 'pointer';
			button.style.transition = 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease';
			button.style.outline = 'none';
			button.style.boxShadow = 'none';
			button.addEventListener('focus', () => {
				button.style.outline = '2px solid #B0B0B0';
				button.style.boxShadow = '0 0 5px rgba(176, 176, 176, 0.6)';
			});
			button.addEventListener('blur', () => {
				button.style.outline = 'none';
				button.style.boxShadow = 'none';
			});
			button.addEventListener('mouseover', () => {
				button.style.backgroundColor = 'rgba(185, 185, 185, 0.4)';
				button.style.transform = 'scale(1.01)';
			});
			button.addEventListener('mouseout', () => {
				button.style.backgroundColor = 'rgba(211, 211, 211, 0.4)';
				button.style.transform = 'scale(1)';
			});
			button.addEventListener('mousedown', () => {
				button.style.outline = '2px solid #B0B0B0';
				button.style.boxShadow = '0 0 5px rgba(176, 176, 176, 0.6)';
			});
			button.addEventListener('mouseup', () => {
				button.style.outline = '2px solid #B0B0B0';
				button.style.boxShadow = '0 0 5px rgba(176, 176, 176, 0.6)';
			});
			button.addEventListener('click', this.onclicks[i++]);
			this.container.appendChild(button);
		});
		this.shown = false;
	}
	getPlayButton() {
		return document.querySelector('.chakra-button.css-cuh8pi');
	}
	getExitButton() {

		return document.querySelectorAll('.chakra-button.css-1axaj8o')[1];
	}
	getKitPVPButton() {
		return document.querySelector('.css-1idq8wm');
	}
	getSkywarsButton() {
		return document.querySelector('.css-rsqc3q');
	}
	getDoublesButton() {
		return document.querySelector('.css-6umr0e');
	}
	getQuadsButton() {
		return document.querySelector('.css-sbvzy');
	}
	getClassicPVPButton() {
		return document.querySelector('.css-1w536sc');
	}
	addShortcutMenu() {
		if (!this.shown) {
			this.shown = true;
			document.body.appendChild(this.container);
		}
	}
	removeShortcutMenu() {
		if (this.shown) {
			this.shown = false;
			document.body.removeChild(this.container);
		}
	}
}


(function() {
    'use strict';

		const intro = new UnverifiedIntro();
		intro.playIntro();
		intro.showInitializedNotif();


		const styler = new UnverifiedStyler();
		styler.addStyleObserver();
		try {
			styler.initialTriggerStyleObserver();
		} catch (e) {

		}
		// ===== =====


    const style = document.createElement('style');
    style.innerHTML = `
        @font-face {
            font-family: 'MinibloxFont';
            src: url('https://cdn.glitch.global/adb12490-d563-43cb-9711-2a69a8bb1c06/Faithful.ttf?v=1735593093308') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        .bind-popup {
            position: absolute;
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
            z-index: 10001;
            font-family: 'MinibloxFont', sans-serif;
            display: none;
            text-align: center;
        }
        .bind-popup input {
            background-color: #34495e;
            color: white;
            border: 2px solid #e74c3c;
            border-radius: 5px;
            padding: 10px;
            font-size: 18px;
            width: 200px;
        }
        .bind-popup button {
            background-color: #e74c3c;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            margin-top: 10px;
            cursor: pointer;
        }
        .bind-popup button:hover {
            background-color: #c0392b;
        }
        .module-tooltip {
            visibility: hidden;
            position: absolute;
            background-color: #2c3e50;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .module-container:hover .module-tooltip {
            visibility: visible;
            opacity: 1;
        }
        .initialized-notification {
            font-family: 'MinibloxFont', sans-serif;
            font-size: 20px;
            color: #e74c3c;
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            background-color: black;
						border: 1px solid white;
            border-radius: 10px;
            z-index: 10000;
            opacity: 0;
            transition: top 1s ease, opacity 1s ease;
        }
        .other-notification {
            font-family: 'MinibloxFont', sans-serif;
            font-size: 16px;
            color: #e74c3c;
            background-color: black;
            padding: 10px 20px;
						border: 1px solid white;
            border-radius: 10px;
            margin-bottom: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            transition: opacity 0.5s ease, transform 0.5s ease;
            opacity: 0;
            transform: translateX(100%);
        }
    `;
    document.head.appendChild(style);

    const ui = document.createElement("div");
    ui.style.position = "absolute";
    ui.style.top = "50%";
    ui.style.left = "50%";
    ui.style.transform = "translate(-50%, -50%)";
    ui.style.backgroundColor = "#1a1a1a";
    ui.style.color = "white";
    ui.style.padding = "30px";
    ui.style.borderRadius = "15px";
    ui.style.display = "none";
    ui.style.zIndex = "9999";
    ui.style.textAlign = "center";
    ui.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.7)";
    ui.style.fontFamily = 'MinibloxFont, sans-serif';
    document.body.appendChild(ui);

    const title = document.createElement("h2");
    title.textContent = "UnverifiedV2";
    title.style.fontSize = "36px";
    title.style.color = "#e74c3c";
    title.style.fontFamily = 'MinibloxFont, sans-serif';
    ui.appendChild(title);

    const gridContainer = document.createElement("div");
    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
    gridContainer.style.gridGap = "20px";
    gridContainer.style.marginTop = "20px";
    ui.appendChild(gridContainer);

    const notificationContainer = document.createElement("div");
    notificationContainer.style.position = "fixed";
    notificationContainer.style.bottom = "1in";
    notificationContainer.style.right = "20px";
    notificationContainer.style.zIndex = "10000";
    notificationContainer.style.display = "flex";
    notificationContainer.style.flexDirection = "column-reverse";
    notificationContainer.style.alignItems = "flex-end";
    document.body.appendChild(notificationContainer);

    let moduleBindings = {};
    let isBinding = false;
    let lastKeyPressTime = {};

    function createModule(name, description) {
        const moduleContainer = document.createElement("div");
        moduleContainer.style.padding = "20px";
        moduleContainer.style.borderRadius = "10px";
        moduleContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
        moduleContainer.style.cursor = "pointer";
        moduleContainer.style.transition = "border-color 0.3s ease";
        moduleContainer.style.border = "5px solid transparent";
        moduleContainer.classList.add('module-container');

        const moduleTitle = document.createElement("h3");
        moduleTitle.textContent = name;
        moduleTitle.style.color = "#e74c3c";
        moduleTitle.style.fontSize = "24px";
        moduleContainer.appendChild(moduleTitle);

        const moduleDescription = document.createElement("p");
        moduleDescription.textContent = description;
        moduleDescription.style.color = "#bdc3c7";
        moduleDescription.style.fontSize = "14px";
        moduleContainer.appendChild(moduleDescription);

        gridContainer.appendChild(moduleContainer);

        const tooltip = document.createElement("div");
        tooltip.classList.add("module-tooltip");
        tooltip.textContent = `right-click to bind`;
        moduleContainer.appendChild(tooltip);

        let isActive = false;

        let tooltipTimeout;

        moduleContainer.addEventListener("mouseenter", () => {
            tooltipTimeout = setTimeout(() => {
                tooltip.style.visibility = "visible";
                tooltip.style.opacity = 1;
            }, 1500);
        });

        moduleContainer.addEventListener("mouseleave", () => {
            clearTimeout(tooltipTimeout);
            tooltip.style.visibility = "hidden";
            tooltip.style.opacity = 0;
        });

        moduleContainer.addEventListener("click", () => {
            if (!isBinding) {
                isActive = !isActive;

                if (isActive) {
                    moduleContainer.style.border = "5px solid #2ecc71";
                    showNotification(`${name} was turned on`, true);
                } else {
                    moduleContainer.style.border = "5px solid transparent";
                    showNotification(`${name} was turned off`, false);
                }
            }
        });

        moduleContainer.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            showBindPopup(moduleContainer, name);
        });

        return moduleContainer;
    }

    function showNotification(message, isOn) {
        const notification = document.createElement("div");
        notification.textContent = message;
        notification.classList.add('other-notification');
        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = "translateX(0)";
            notification.style.opacity = "1";
        }, 10);

        setTimeout(() => {
            notification.style.transform = "translateX(100%)";
            notification.style.opacity = "0";

            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 500);
        }, 3000);
    }

    function showBindPopup(moduleElement, moduleName) {
        const existingPopup = document.querySelector('.bind-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const popup = document.createElement("div");
        popup.classList.add("bind-popup");
        document.body.appendChild(popup);

        const popupTitle = document.createElement("h3");
        popupTitle.textContent = `Bind Key for ${moduleName}`;
        popup.appendChild(popupTitle);

        const inputBox = document.createElement("input");
        inputBox.placeholder = "Press a key...";
        if (moduleBindings[moduleName]) {
            inputBox.value = moduleBindings[moduleName];
        }
        popup.appendChild(inputBox);

        const bindButton = document.createElement("button");
        bindButton.textContent = "Bind";
        const resetButton = document.createElement("button");
        resetButton.textContent = "Unbind";
        const closeButton = document.createElement("button");
        closeButton.textContent = "Close";

        popup.appendChild(bindButton);
        popup.appendChild(resetButton);
        popup.appendChild(closeButton);

        closeButton.addEventListener("click", () => {
            popup.style.display = "none";
            isBinding = false;
        });

        let keyBinding = null;
        inputBox.addEventListener("keydown", (e) => {
            e.preventDefault();
            keyBinding = e.key;
            inputBox.value = e.key;
        });

        bindButton.addEventListener("click", () => {
            if (keyBinding) {
                moduleBindings[moduleName] = keyBinding;
                showNotification(`Bound ${moduleName} to ${keyBinding}`, true);
            }
            popup.style.display = "none";
            isBinding = false;
        });

        resetButton.addEventListener("click", () => {
            delete moduleBindings[moduleName];
            showNotification(`${moduleName} unbound`, false);
            popup.style.display = "none";
            isBinding = false;
        });

        const rect = moduleElement.getBoundingClientRect();
        popup.style.top = `${rect.top + window.scrollY + rect.height + 10}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;

        popup.style.display = "block";
        isBinding = true;
    }

    const autoFullscreenModule = createModule("Auto Fullscreen", "Automatically toggles Fullscreen");

    let isAutoFullscreenActive = false;

    autoFullscreenModule.addEventListener("click", () => {
        isAutoFullscreenActive = !isAutoFullscreenActive;

        if (isAutoFullscreenActive) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    });

    const keystrokesModule = createModule("Keystrokes", "Displays the keys you press in real-time.");

    let isKeystrokesActive = false;

    keystrokesModule.addEventListener("click", () => {
        isKeystrokesActive = !isKeystrokesActive;

        if (isKeystrokesActive) {
            (function () {
                'use strict';

                const getValue = (key, fallback) => {
                    const value = localStorage.getItem(key);
                    return value !== null ? parseInt(value, 10) : fallback;
                };

                const setValue = (key, value) => {
                    localStorage.setItem(key, value);
                };

								if (document.getElementById('keystrokes-container')) {
									console.log('hi');
									document.getElementById('keystrokes-container').remove();
								}
                const keystrokescontainer = document.createElement('div');
								keystrokescontainer.id = 'keystrokes-container';
                keystrokescontainer.style.zIndex = '10000';
                keystrokescontainer.style.width = '300px';
                keystrokescontainer.style.height = '230px';
                keystrokescontainer.style.position = 'fixed';
                keystrokescontainer.style.left = getValue('left', window.innerWidth / 2) + 'px';
                keystrokescontainer.style.top = getValue('top', window.innerHeight / 2) + 'px';
                keystrokescontainer.style.opacity = '100%';
                keystrokescontainer.style.boxShadow = 'none';
                keystrokescontainer.style.backgroundColor = 'transparent';


                keystrokescontainer.style.position = 'fixed';
                keystrokescontainer.style.transform = 'translate(-50%, -50%)';
                keystrokescontainer.style.display = 'flex';
                keystrokescontainer.style.flexDirection = 'column';
                keystrokescontainer.style.alignItems = 'center';

                keystrokescontainer.style.userSelect = 'none';

                document.body.appendChild(keystrokescontainer);

                let isDragging = false;

                keystrokescontainer.addEventListener('mousedown', (event) => {
                    if (event.target.nodeName !== 'INPUT') {
                        isDragging = true;
                    }
                });

                document.addEventListener('mousemove', (event) => {
                    if (isDragging) {
                        const left = event.clientX;
                        const top = event.clientY;

                        keystrokescontainer.style.left = left + 'px';
                        keystrokescontainer.style.top = top + 'px';

                        setValue('left', left);
                        setValue('top', top);
                    }
                });

                document.addEventListener('mouseup', () => {
                    isDragging = false;
                });

                const createKey = (text, style = {}) => {
                    const key = document.createElement('div');
                    key.textContent = text;
                    Object.assign(key.style, {
                        position: 'absolute',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        borderRadius: '0',
                        backgroundColor: 'rgba(128, 128, 128, 0.7)',
                        border: '3px solid #333333',
                        fontSize: '18px',
                        height: '50px',
                        width: '50px',
                        textAlign: 'center',
                        lineHeight: '50px',
                        fontFamily: 'Roboto Mono, monospace',
                        zIndex: '10000',
                        ...style
                    });
                    return key;
                };


                const wkey = createKey('W', { top: '0px', left: '125px' });
                const akey = createKey('A', { top: '55px', left: '70px' });
                const skey = createKey('S', { top: '55px', left: '125px' });
                const dkey = createKey('D', { top: '55px', left: '180px' });

                const lmb = createKey('LMB', {
                    top: '110px', left: '70px', width: '79px'
                });
                const rmb = createKey('RMB', {
                    top: '110px', left: '150px', width: '79px'
                });
                const space = createKey('_____', {
                    top: '170px', left: '70px', width: '160px'
                });

                keystrokescontainer.append(wkey, akey, skey, dkey, lmb, rmb, space);

                const downColor = '#8B0000';
                const upColor = 'rgba(128, 128, 128, 0.7)';

                document.addEventListener('keydown', (event) => {
                    switch (event.code) {
                        case 'KeyW': wkey.style.backgroundColor = downColor; break;
                        case 'KeyS': skey.style.backgroundColor = downColor; break;
                        case 'KeyA': akey.style.backgroundColor = downColor; break;
                        case 'KeyD': dkey.style.backgroundColor = downColor; break;
                        case 'Space': space.style.backgroundColor = downColor; break;
                    }
                });

                document.addEventListener('keyup', (event) => {
                    switch (event.code) {
                        case 'KeyW': wkey.style.backgroundColor = upColor; break;
                        case 'KeyS': skey.style.backgroundColor = upColor; break;
                        case 'KeyA': akey.style.backgroundColor = upColor; break;
                        case 'KeyD': dkey.style.backgroundColor = upColor; break;
                        case 'Space': space.style.backgroundColor = upColor; break;
                    }
                });

                document.addEventListener('mousedown', (event) => {
                    if (event.button === 0) {
                        lmb.style.backgroundColor = downColor;
                    } else if (event.button === 2) {
                        rmb.style.backgroundColor = downColor;
                    }
                });

                document.addEventListener('mouseup', (event) => {
                    if (event.button === 0) {
                        lmb.style.backgroundColor = upColor;
                    } else if (event.button === 2) {
                        rmb.style.backgroundColor = upColor;
                    }
                });
            })();


        } else {
						document.getElementById('keystrokes-container').remove();
            console.log("Keystrokes module disabled");
        }
    });

    createModule("FPS Counter", "Shows the frames per second (FPS) of the game.");
    const fpsModule = [...gridContainer.children].find(child =>
  child.querySelector("h3")?.textContent === "FPS Counter"
);

let isFPSVisible = false;
let fpsElement = null;
let lastFrameTime = performance.now();
let frameCount = 0;
let fps = 0;

if (fpsModule) {
  fpsModule.addEventListener("click", () => {
    isFPSVisible = !isFPSVisible;

    if (isFPSVisible) {
      fpsElement = document.createElement("div");
      fpsElement.textContent = "FPS: 0";
      fpsElement.style.position = "fixed";
      fpsElement.style.top = "120px";
      fpsElement.style.left = "20px";
      fpsElement.style.background = "rgba(0, 0, 0, 0.8)";
      fpsElement.style.color = "#ffffff";
      fpsElement.style.fontSize = "14px";
      fpsElement.style.fontFamily = "monospace";
      fpsElement.style.padding = "8px 12px";
      fpsElement.style.borderRadius = "6px";
      fpsElement.style.zIndex = "99999";
      fpsElement.style.cursor = "move";
      fpsElement.style.userSelect = "none";

      document.body.appendChild(fpsElement);


      let offsetX = 0,
        offsetY = 0,
        isDragging = false;

      fpsElement.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - fpsElement.getBoundingClientRect().left;
        offsetY = e.clientY - fpsElement.getBoundingClientRect().top;
        e.preventDefault();
      });

      document.addEventListener("mousemove", (e) => {
        if (isDragging) {
          fpsElement.style.left = `${e.clientX - offsetX}px`;
          fpsElement.style.top = `${e.clientY - offsetY}px`;
        }
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
      });


      const updateFPS = () => {
        const now = performance.now();
        frameCount++;

        if (now - lastFrameTime >= 1000) {
          fps = frameCount;
          fpsElement.textContent = `FPS: ${fps}`;
          frameCount = 0;
          lastFrameTime = now;
        }

        if (isFPSVisible) {
          requestAnimationFrame(updateFPS);
        }
      };

      requestAnimationFrame(updateFPS);
    } else if (fpsElement) {
      fpsElement.remove();
      fpsElement = null;
    }
  });
}

const cpsModule = createModule("CPS Counter", "Counts how many times you click per second.");

let isCpsActive = false;
let clickTimes = [];
let cpsElement = null;


let cpsDecayTime = 1050;

cpsModule.addEventListener("click", () => {
    isCpsActive = !isCpsActive;

    if (isCpsActive) {

        if (!cpsElement) {
            cpsElement = document.createElement("div");
            cpsElement.id = "cps-counter";
            cpsElement.style.position = "fixed";
            cpsElement.style.top = "20px";
            cpsElement.style.left = "20px";
            cpsElement.style.color = "white";
            cpsElement.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
            cpsElement.style.padding = "10px 15px";
            cpsElement.style.borderRadius = "8px";
            cpsElement.style.fontSize = "18px";
            cpsElement.style.fontFamily = "monospace";
            cpsElement.style.zIndex = "99999";
            cpsElement.style.userSelect = "none";
            cpsElement.style.cursor = "move";

            document.body.appendChild(cpsElement);


            let isDragging = false;
            let offsetX = 0;
            let offsetY = 0;

            cpsElement.addEventListener("mousedown", (e) => {
                isDragging = true;
                offsetX = e.clientX - cpsElement.getBoundingClientRect().left;
                offsetY = e.clientY - cpsElement.getBoundingClientRect().top;
                e.preventDefault();
            });

            document.addEventListener("mousemove", (e) => {
                if (isDragging) {
                    cpsElement.style.left = (e.clientX - offsetX) + "px";
                    cpsElement.style.top = (e.clientY - offsetY) + "px";
                }
            });

            document.addEventListener("mouseup", () => {
                isDragging = false;
            });
        }


        clickTimes = [];


        const clickHandler = () => {
            clickTimes.push(Date.now());
        };
        document.addEventListener("mousedown", clickHandler);


        function updateCps() {
            const now = Date.now();

            clickTimes = clickTimes.filter(time => now - time <= cpsDecayTime);

            cpsElement.textContent = `CPS: ${clickTimes.length}`;

            if (isCpsActive) {
                requestAnimationFrame(updateCps);
            }
        }

        updateCps();


        cpsModule._clickHandler = clickHandler;

    } else {

        if (cpsElement) {
            cpsElement.remove();
            cpsElement = null;
        }
        if (cpsModule._clickHandler) {
            document.removeEventListener("mousedown", cpsModule._clickHandler);
            cpsModule._clickHandler = null;
        }
    }
});

 const pingModule = createModule("Ping Counter", "Shows the latency between your client and the server.");

let isPingActive = false;
let pingElement = null;
let pingInterval = null;

pingModule.addEventListener("click", () => {
    isPingActive = !isPingActive;

    if (isPingActive) {

        pingElement = document.createElement("div");
        pingElement.id = "ping-counter";
        pingElement.style.position = "fixed";
        pingElement.style.top = "20px";
        pingElement.style.left = "20px";
        pingElement.style.padding = "8px 12px";
        pingElement.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
        pingElement.style.color = "white";
        pingElement.style.fontWeight = "bold";
        pingElement.style.fontFamily = "monospace";
        pingElement.style.borderRadius = "8px";
        pingElement.style.zIndex = "10000";
        pingElement.style.cursor = "move";
        pingElement.style.userSelect = "none";

        document.body.appendChild(pingElement);


        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        pingElement.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - pingElement.getBoundingClientRect().left;
            offsetY = e.clientY - pingElement.getBoundingClientRect().top;
            e.preventDefault();
        });

        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                pingElement.style.left = `${e.clientX - offsetX}px`;
                pingElement.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });


        const updatePing = () => {
            const start = Date.now();
            fetch(window.location.href, { method: 'HEAD', cache: "no-cache" }).then(() => {
                const end = Date.now();
                const ping = end - start;
                pingElement.textContent = `Ping: ${ping}`;  // No "ms" here
            }).catch(() => {
                pingElement.textContent = `Ping: N/A`;
            });
        };

        updatePing();
        pingInterval = setInterval(updatePing, 1000);
    } else {
        if (pingElement) {
            pingElement.remove();
            pingElement = null;
        }
        clearInterval(pingInterval);
    }
});

    createModule("FPS Booster", "Changes settings to improve FPS (refresh page)");
    createModule("Anti-Afk", "Presses WASD on its own to avoid being kicked for being AFK");
    const antiAfkModule = [...gridContainer.children].find(child =>
    child.querySelector("h3")?.textContent === "Anti-Afk"
);

let isAntiAfkActive = false;
let antiAfkInterval = null;
let antiAfkBox = null;

if (antiAfkModule) {
    antiAfkModule.addEventListener("click", () => {
        isAntiAfkActive = !isAntiAfkActive;

        if (isAntiAfkActive) {
            antiAfkBox = document.createElement("div");
            antiAfkBox.style.position = "fixed";
            antiAfkBox.style.top = "20px";
            antiAfkBox.style.right = "20px";
            antiAfkBox.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            antiAfkBox.style.color = "white";
            antiAfkBox.style.fontFamily = "monospace";
            antiAfkBox.style.padding = "10px 15px";
            antiAfkBox.style.borderRadius = "8px";
            antiAfkBox.style.zIndex = "9999";
            antiAfkBox.style.cursor = "move";
            antiAfkBox.style.userSelect = "none";
            antiAfkBox.textContent = "Anti-AFK: ON";

            document.body.appendChild(antiAfkBox);

            let offsetX = 0;
            let offsetY = 0;
            let isDragging = false;

            antiAfkBox.addEventListener("mousedown", (e) => {
                isDragging = true;
                offsetX = e.clientX - antiAfkBox.getBoundingClientRect().left;
                offsetY = e.clientY - antiAfkBox.getBoundingClientRect().top;
                e.preventDefault();
            });

            document.addEventListener("mousemove", (e) => {
                if (isDragging) {
                    antiAfkBox.style.left = `${e.clientX - offsetX}px`;
                    antiAfkBox.style.top = `${e.clientY - offsetY}px`;
                    antiAfkBox.style.right = "auto";
                }
            });

            document.addEventListener("mouseup", () => {
                isDragging = false;
            });

            const keys = [
                ['w', 'KeyW', 87],
                ['a', 'KeyA', 65],
                ['s', 'KeyS', 83],
                ['d', 'KeyD', 68],
                [' ', 'Space', 32]
            ];

            let index = 0;
            antiAfkInterval = setInterval(() => {
                const [key, code, keyCode] = keys[index];
                simulateKeyPress(key, code, keyCode);
                index = (index + 1) % keys.length;
            }, 500);
        } else {
            if (antiAfkInterval) clearInterval(antiAfkInterval);
            if (antiAfkBox) antiAfkBox.remove();
        }
    });
}

function simulateKeyPress(key, code, keyCode) {
    const eventTarget = document.activeElement || document.body;

    const downEvent = new KeyboardEvent('keydown', {
        key: key,
        code: code,
        keyCode: keyCode,
        which: keyCode,
        bubbles: true,
        cancelable: true
    });

    const upEvent = new KeyboardEvent('keyup', {
        key: key,
        code: code,
        keyCode: keyCode,
        which: keyCode,
        bubbles: true,
        cancelable: true
    });

    eventTarget.dispatchEvent(downEvent);
    setTimeout(() => eventTarget.dispatchEvent(upEvent), 50);
}


    createModule("Time Display", "Shows you the time so you dont have to exit full screen.");
    const timeModule = [...gridContainer.children].find(child =>
    child.querySelector("h3")?.textContent === "Time Display"
);

let isTimeVisible = false;
let timeElement = null;

if (timeModule) {
    timeModule.addEventListener("click", () => {
        isTimeVisible = !isTimeVisible;

        if (isTimeVisible) {
            timeElement = document.createElement("div");
            timeElement.id = "fullscreen-clock";
            timeElement.style.position = "fixed";
            timeElement.style.bottom = "20px";
            timeElement.style.right = "20px";
            timeElement.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            timeElement.style.color = "white";
            timeElement.style.padding = "10px 15px";
            timeElement.style.borderRadius = "8px";
            timeElement.style.fontSize = "18px";
            timeElement.style.fontFamily = "monospace";
            timeElement.style.zIndex = "99999";
            timeElement.style.pointerEvents = "auto"; // Allow draggings :D -wyt
            timeElement.style.cursor = "move";
            timeElement.style.top = "unset";
            timeElement.style.left = "unset";
            let isDragging = false;
let offsetX = 0, offsetY = 0;

timeElement.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - timeElement.getBoundingClientRect().left;
    offsetY = e.clientY - timeElement.getBoundingClientRect().top;
    e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        timeElement.style.left = `${e.clientX - offsetX}px`;
        timeElement.style.top = `${e.clientY - offsetY}px`;
        timeElement.style.bottom = "auto";
        timeElement.style.right = "auto";
        timeElement.style.position = "fixed";
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});


            document.body.appendChild(timeElement);

            const updateClock = () => {
                const now = new Date();
                timeElement.textContent = now.toLocaleTimeString();
            };

            updateClock();
            timeElement._interval = setInterval(updateClock, 1000);
        } else if (timeElement) {
            clearInterval(timeElement._interval);
            timeElement.remove();
            timeElement = null;
        }
    });
}

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close UI";
    closeButton.style.backgroundColor = "#e74c3c";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.padding = "10px 20px";
    closeButton.style.fontSize = "18px";
    closeButton.style.marginTop = "20px";
    closeButton.style.cursor = "pointer";
    ui.appendChild(closeButton);

    const ThemesDropdown = document.createElement("select");

    ThemesDropdown.style.backgroundColor = "#e74c3c";
    ThemesDropdown.style.color = "white";
    ThemesDropdown.style.border = "none";
    ThemesDropdown.style.borderRadius = "5px";
    ThemesDropdown.style.padding = "10px 20px";
    ThemesDropdown.style.fontSize = "18px";
    ThemesDropdown.style.marginTop = "20px";
    ThemesDropdown.style.cursor = "pointer";


    const themes = [
        { name: "Default", image: "#1a1a1a" },
        { name: "Minors??!!", image: "https://media1.tenor.com/m/mn2d2liDsmUAAAAC/ichigo-bleach.gif" },
        { name: "Beach", image: "https://wallpaperaccess.com/full/174768.jpg" },
        { name: "Fall", image: "https://wallpaperaccess.com/full/185084.jpg" },
        { name: "Ocean", image: "https://wallpaperaccess.com/full/317501.jpg" }
    ];


    themes.forEach(theme => {
        const option = document.createElement("option");
        option.value = theme.image;
        option.textContent = theme.name;
        ThemesDropdown.appendChild(option);
    });


    ThemesDropdown.addEventListener("change", (e) => {
        const image = e.target.value;
        if (image === "none") {
            ui.style.background = ""; // Reset
        } else {
            ui.style.backgroundImage = `url(${image})`;
            ui.style.backgroundSize = "cover";
            ui.style.backgroundPosition = "center";
        }
    });

    ui.appendChild(ThemesDropdown);


    let uiVisible = false;
    function toggleUI() {
				if (uiVisible) {
					ui.style.display = "none";
				} else {
					ui.style.display = "block";
				}
        uiVisible = !uiVisible;
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Shift" && event.location === 2) {
            toggleUI();
        }

        for (let moduleName in moduleBindings) {
            if (moduleBindings[moduleName] === event.key) {
                const now = Date.now();
                if (!lastKeyPressTime[moduleName] || now - lastKeyPressTime[moduleName] > 200) {
                    const moduleContainer = [...gridContainer.children].find(child => child.querySelector("h3").textContent === moduleName);
                    if (moduleContainer) {
                        moduleContainer.click();
                    }
                    lastKeyPressTime[moduleName] = now;
                }
            }
        }
    });

    closeButton.addEventListener("click", () => {
        ui.style.display = "none";
        uiVisible = false;
    });


		// ===== =====
})();





// ===== FPS Boosting =====
(function() {
    'use strict';
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
        return setTimeout(function() {
            callback(performance.now());
        }, 0);
    };
    console.log('Client Status: Great');
})();
// ===== =====