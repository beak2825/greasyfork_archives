// ==UserScript==
// @name         Survev.io UI test
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  skibidi ? ping isnt ping just input lantency to the server LOL
// @author       Thợ săn trẻ con & Bánh Chiên giòn
// @match        *://survev.io/
// @match http://66.179.254.36/
// @license GNU General Public License v3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555926/Survevio%20UI%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/555926/Survevio%20UI%20test.meta.js
// ==/UserScript==
// ---- HUD ----
window.addEventListener('load', function () {
	(function() {
		const c = "position:absolute;left:10px;transform:translateY(-50%);color:white;font-size:14px;font-family:'roboto condensed',sans-serif;font-weight:bold;background-color:rgba(0,0,0,0.3);padding:3px 5px;border-radius:5px;z-index:10000;";
 
		// --- FPS ---
		const fpsDisplay = document.createElement('div');
		fpsDisplay.style.cssText = c + "top:60%;";
		fpsDisplay.innerHTML = `0 FPS`;
		document.body.appendChild(fpsDisplay);
 
		let frames = [];
		const updateFPS = () => {
			requestAnimationFrame(() => {
				const now = performance.now();
				while (frames.length > 0 && frames[0] <= now - 1000) frames.shift();
				frames.push(now);
				const fps = frames.length;
				fpsDisplay.innerHTML = `${fps} FPS`;
				fpsDisplay.style.color = fps < 50 ? "red" : fps < 80 ? "yellow" : "white";
				updateFPS();
			});
		};
		updateFPS();
 
		// --- Ping ---
		const pingDisplay = document.createElement('div');
		pingDisplay.style.cssText = c + "top:calc(60% + 25px);";
		pingDisplay.innerHTML = `Waiting...`;
		document.body.appendChild(pingDisplay);
 
		let ws, sendTime, region = "na";
		function wsUrl() {
			const map = { na: 'usr', eu: 'eur', asia: 'asr', sa: 'sa', ru: 'russia' };
			return `wss://${map[region] || 'usr'}.mathsiscoolfun.com:8001/ptc`;
		}
 
		function startPing() {
			if (ws && ws.readyState === 1) ws.close();
			try {
				ws = new WebSocket(wsUrl());
				ws.onopen = () => {
					sendTime = Date.now();
					ws.send(new ArrayBuffer(1));
				};
				ws.onmessage = () => {
					const ping = Date.now() - sendTime;
					pingDisplay.innerHTML = `${ping} ms`;
					pingDisplay.style.color =
						ping > 120 ? "red" :
						ping > 90 ? "orange" :
						ping > 60 ? "yellow" : "white";
					setTimeout(() => {
						if (ws.readyState === 1) {
							sendTime = Date.now();
							ws.send(new ArrayBuffer(1));
						}
					}, 1000);
				};
				ws.onerror = () => {
					pingDisplay.innerHTML = `Ping error`;
					pingDisplay.style.color = "gray";
				};
				ws.onclose = () => {
					setTimeout(startPing, 2000); // auto reconnect
				};
			} catch (err) {
				pingDisplay.innerHTML = "No WS";
				pingDisplay.style.color = "gray";
			}
		}
 
		// Wait until the in-game HUD loads, then start ping
		const waitForGame = setInterval(() => {
			if (document.getElementById("ui-health-container")) {
				clearInterval(waitForGame);
				startPing();
			}
		}, 2000);
 
		// --- Health / Boost HUD ---
		let lastHealth = 0;
		const healthText = document.createElement("span");
		healthText.style = "display:block;position:fixed;z-index:2;right:15px;margin:6px 0 0 0;mix-blend-mode:difference;font-weight:bold;font-size:large;";
		const boostText = document.createElement("span");
		boostText.style = "display:block;position:fixed;z-index:2;left:15px;margin:6px 0 0 0;mix-blend-mode:difference;font-weight:bold;font-size:large;";
		document.querySelector("#ui-health-container")?.appendChild(healthText);
		document.querySelector("#ui-health-container")?.appendChild(boostText);
 
		function getHealthColor(pct) {
			if (pct > 75) return "#00FF66";
			if (pct > 50) return "#CCFF33";
			if (pct > 25) return "#FF9933";
			return "#FF3333";
		}
 
		setInterval(() => {
			const hpBar = document.getElementById("ui-health-actual");
			if (!hpBar) return;
			const hp = parseFloat(hpBar.style.width) || 0;
			if (hp !== lastHealth) {
				lastHealth = hp;
				healthText.innerHTML = hp.toFixed(1) + "%";
				healthText.style.color = getHealthColor(hp);
			}
 
			const boosts = [0,1,2,3].map(i =>
				parseFloat(document.querySelector(`#ui-boost-counter-${i} .ui-bar-inner`)?.style.width || 0) / 100
			);
			const total = Math.round(25*boosts[0] + 25*boosts[1] + 37.5*boosts[2] + 12.5*boosts[3]);
			boostText.innerHTML = total + "%";
			boostText.style.color = total > 50 ? "#33CCFF" : "#66FFFF";
		}, 200);
 
		// --- Remove Ads ---
		function delAds(id) {
			const el = document.getElementById(id);
			if (el) el.remove();
		}
		setInterval(() => {
			delAds("leaderboard-front");
			delAds("adunit");
			delAds("ui-stats-ad-container-desktop");
			document.getElementsByClassName("ad-block-leaderboard-bottom")[0]?.remove();
		}, 1000);
	})();
});
//gun color
(function() {
    'use strict';
    var colorweaponsbox = document.getElementsByClassName('ui-weapon-name')
    console.log(colorweaponsbox);
    for (var ii = 0; ii < colorweaponsbox.length; ii++) {
        colorweaponsbox[ii].addEventListener('DOMSubtreeModified', function() {
            var weaponInfo = this.textContent;
            var border = 'solid';
            switch (weaponInfo) {
                default:
                    border = '#FFFFFF';
                    border = 'solid';
                    break;
                case "Fists":
                    border += '#FFFFFF';
                    break;
                case "Karambit":
                    border +='#FFFFFF';
                    break;
                case "Karambit Rugged":
                    border +='#FFFFFF';
                    break;
                case "Karmabit Prismatic":
                    border +='#FFFFFF';
                    break;
                case "Karmabit Drowned":
                    border +='#FFFFFF';
                    break;
                case "Bayonet":
                    border +='#FFFFFF';
                    break;
                case "Bayonet Rugged":
                    border +='#FFFFFF';
                    break;
                case "Bayonet Woodland":
                    border +='#FFFFFF';
                    break;
                case "Huntsman":
                    border +='#FFFFFF';
                    break;
                case "Huntsman Rugged":
                    border +='#FFFFFF';
                    break;
                case "Huntsman Burnished":
                    border +='#FFFFFF';
                    break;
                case "Bowie":
                    border +='#FFFFFF';
                    break;
                case "Bowie Vintage":
                    border +='#FFFFFF';
                    break;
                case "Bowie Frontier":
                    border +='#FFFFFF';
                    break;
                case "Wood Axe":
                    border +='#FFFFFF';
                    break;
                case "Blood Axe":
                    border +='#FFFFFF';
                    break;
                case "Fire Axe":
                    border +='#FFFFFF';
                    break;
                case "Katana":
                    border +='#FFFFFF';
                    break;
                case "Katana Rusted":
                    border +='#FFFFFF';
                    break;
                case "Katana Orchid":
                    border +='#FFFFFF';
                    break;
                case 'Naginata':
                    border += '#FFFFFF';
                    break;
                case "Machete":
                    border +='#FFFFFF';
                    break;
                case "Kukri":
                    border +='#FFFFFF';
                    break;
                case "Stone Hammer":
                    border +='#FFFFFF';
                    break;
                case "Sledgehammer":
                    border +='#FFFFFF';
                    break;
                case "Hook":
                    border +='#FFFFFF';
                    break;
                case "Pan":
                    border +='#FFFFFF';
                    break;
                case "Knuckles":
                    border +='#FFFFFF';
                    break;
                case "Knuckles Rusted":
                    border +='#FFFFFF';
                    break;
                case "Knuckles Heroic":
                    border +='#FFFFFF';
                    break;
                case "Bonesaw":
                    border += '#FFFFFF';
                    break;
                case "Spade":
                    border +='#FFFFFF';
                    break;
                case "Crowbar":
                    border +='#FFFFFF';
                    break;
                case "Kukri":
                    border +='#FFFFFF';
                    break;
                case "Bonesaw":
                    border +='#FFFFFF';
                    break;
                case "Katana":
                    border +='#FFFFFF';
                    break;
                case "War Hammer":
                    border +='#FFFFFF';
                    break;
                case 'CZ-3A1':
                case 'G18C':
                case 'M9':
                case 'M93R':
                case 'MAC-10':
                case 'MP5':
                case 'P30L':
                case 'Dual P30L':
                case 'UMP9':
                case 'Vector':
                case 'VSS':
                    border += '#FFAE00';
                    break;
                case 'M1100':
                case 'M870':
                case 'MP220':
                case 'Saiga-12':
                case 'SPAS-12':
                case 'Super 90':
                case 'USAS-12':
                case 'Hawk 12G':
                    border += '#FF0000';
                    break;
                case 'AK-47':
                case 'M134':
                case 'AN-94':
                case 'BAR M1918':
                case 'BLR 81':
                case 'DP-28':
                case 'Groza':
                case 'Groza-S':
                case 'M1 Garand':
                case 'M39 EMR':
                case 'Mosin-Nagant':
                case 'OT-38':
                case 'OTs-38':
                case 'PKP Pecheneg':
                case 'SCAR-H':
                case 'SV-98':
                case 'SVD-63':
                    border += '#0066FF';
                    break;
                case 'FAMAS':
                case 'L86A2':
                case 'M249':
                case 'M416':
                case 'M4A1-S':
                case 'Mk 12 SPR':
                case 'QBB-97':
                case 'Scout Elite':
                    border += '#039E00';
                    break;
                case 'M1911':
                case 'M1A1':
                case 'Mk45G':
                case 'Model 94':
                case 'Peacemaker':
                case 'Vector 45':
                    border += '#7900FF';
                    break;
                case 'M79':
                    border += '#0CDDAB';
                    break;
                case 'Flare Gun':
                    border += '#D44600';
                    break;
                case 'DEagle 50':
                    border += '#292929';
                    break;
                case 'AWM-S':
                case 'Mk 20 SSR':
                    border += '#465000';
                    break;
                case 'Potato Cannon':
                case 'Spud Gun':
                    border += '#935924';
                    break;
                case 'M9 Cursed':
                    border += '#323232';
                    break;
                case 'Bugle':
                    border += '#F2BC21';
                    break;
                case 'Frag':
                    border += '#FFFFFF';
                    break;
                case 'Mine':
                    border += '#FFFFFF';
                    break;
                case 'MIRV':
                    border += '#FFFFFF';
                    break;
                case 'Potato':
                    border += '#FFFFFF';
                    break;
                case 'Smoke':
                    border += '#FFFFFF';
                    break;
                case 'Snowball':
                    border += '#FFFFFF';
                    break;
                case 'Strobe':
                    border += '#FFFFFF';
                    break;
                case 'Iron Bomb':
                    border += '#FFFFFF';
                    break;
            }
            console.log(border);
            this.parentNode.style.border = border;
        }, false);
    }
})();
(function() {
    'use strict';
    var colorweaponsbox = document.getElementsByClassName('ui-armor-level');
    console.log(colorweaponsbox);
    for (var ii = 0; ii < colorweaponsbox.length; ii++) {
        colorweaponsbox[ii].addEventListener('DOMSubtreeModified', function() {
            var armorlv = this.textContent;
            var border = 'solid';
            switch (armorlv) {
                default: border = '#000000';
                    border = 'solid';
                    break;
                case 'Lvl. 0':
                    border += '#FFFFFF';
                    break;
                case 'Lvl. 1':
                    border += '#FFFFFF';
                    break;
                case 'Lvl. 2':
                    border += '#808080';
                    break;
                case 'Lvl. 3':
                    border += '#0C0C0C';
                    break;
                case 'Lvl. 4':
                    border += '#FFF00F';
                    break;
            }
            console.log(border);
            this.parentNode.style.border = border;
        }, false);
    }
})();