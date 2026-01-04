// ==UserScript==
// @name         Survev.io X-Ray + ping/fps/health display
// @namespace    https://github.com/ashcool/survevio-xray
// @version      5.0
// @description  Always enable visual X-Ray mode (see through houses, no ads)
// @author       ashcool (Credits to Zetraious)
// @license      MIT
// @match        *://survev.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555166/Survevio%20X-Ray%20%2B%20pingfpshealth%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/555166/Survevio%20X-Ray%20%2B%20pingfpshealth%20display.meta.js
// ==/UserScript==

let xrayEnabled = true;

// ---- X-Ray effect ----
Object.defineProperty(Object.prototype, 'textureCacheIds', {
	set(value) {
		this._textureCacheIds = value;
		if (Array.isArray(value)) {
			const scope = this;
			value.push = new Proxy(value.push, {
				apply(target, thisArgs, args) {
					if (args[0].indexOf('ceiling') > -1) {
						Object.defineProperty(scope, 'valid', {
							set(v) { this._valid = v; },
							get() { return false; }
						});
					}
					return Reflect.apply(target, thisArgs, args);
				}
			});
		}
	},
	get() {
		return this._textureCacheIds;
	}
});

// ---- Prevent WebGL detection ----
const params = { get() { return null; } };
Object.defineProperty(window, 'WebGLRenderingContext', params);
Object.defineProperty(window, 'WebGL2RenderingContext', params);

// ---- Notice ----
window.addEventListener('DOMContentLoaded', () => {
	const el = document.createElement('div');
	el.innerHTML = `
	<style>
	.my-dialog {
		position: absolute;left: 50%;top: 50%;
		padding: 20px;background: rgba(0, 0, 0, 0.9);
		box-shadow: 0 0 0 1000vw rgba(0, 0, 0, 0.5);
		border-radius: 5px;color: #fff;
		transform: translate(-50%, -50%);
		text-align: center;z-index: 999999;
	}
	.my-close {
		position: absolute;right: 5px;top: 5px;width: 20px;height: 20px;
		opacity: 0.5;cursor: pointer;
	}
	.my-close:before,.my-close:after{
		content:'';position:absolute;left:50%;top:50%;
		width:100%;height:20%;
		transform:translate(-50%,-50%) rotate(-45deg);
		background:#fff;
	}
	.my-close:after{transform:translate(-50%,-50%) rotate(45deg);}
	.my-close:hover{opacity:1;}
	</style>
	<div class="my-dialog">
		<div class="my-close" onclick="this.parentNode.style.display='none';"></div>
		<big style="font-size: 2em;">Survev.io X-Ray HUD</big>
		<br><br>X-Ray mode is <b>Always ON</b>.
		<br>Includes FPS, Ping, Color Health, and No Ads.
	</div>`;
	while (el.children.length > 0) document.body.appendChild(el.children[0]);
});

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
