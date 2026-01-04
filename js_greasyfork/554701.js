// ==UserScript==
// @name         Survev.io X-Ray (NO ads)
// @namespace    https://github.com/ashcool/survevio-xray
// @version      4.1.1
// @description  Always enable visual X-Ray mode (see through houses, no ads)
// @author       ashcool (Credits to Zetraious)
// @license      MIT
// @match        *://survev.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554701/Survevio%20X-Ray%20%28NO%20ads%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554701/Survevio%20X-Ray%20%28NO%20ads%29.meta.js
// ==/UserScript==

let xrayEnabled = true; // permanently ON

// X-Ray effect (visual transparency only)
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
							get() { return false; } // always invalid = always transparent
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

// Prevent game WebGL tamper detection
const params = {
	get() {
		return null;
	}
};
Object.defineProperty(window, 'WebGLRenderingContext', params);
Object.defineProperty(window, 'WebGL2RenderingContext', params);

// Simple UI notice
window.addEventListener('DOMContentLoaded', function () {
	const el = document.createElement('div');
	el.innerHTML = `<style>
	.my-dialog {
		position: absolute;
		left: 50%;
		top: 50%;
		padding: 20px;
		background: rgba(0, 0, 0, 0.9);
		box-shadow: 0 0 0 1000vw rgba(0, 0, 0, 0.5);
		border-radius: 5px;
		color: #fff;
		transform: translate(-50%, -50%);
		text-align: center;
		z-index: 999999;
	}
	.my-close {
		position: absolute;
		right: 5px;
		top: 5px;
		width: 20px;
		height: 20px;
		opacity: 0.5;
		cursor: pointer;
	}
	.my-close:before, .my-close:after {
		content: ' ';
		position: absolute;
		left: 50%;
		top: 50%;
		width: 100%;
		height: 20%;
		transform: translate(-50%, -50%) rotate(-45deg);
		background: #fff;
	}
	.my-close:after { transform: translate(-50%, -50%) rotate(45deg); }
	.my-close:hover { opacity: 1; }
	</style>

	<div class="my-dialog">
		<div class="my-close" onclick="this.parentNode.style.display='none';"></div>
		<big style="font-size: 2em;">Survev.io Visual X-Ray</big>
		<br><br>
		X-Ray mode is <b>Always ON</b> (visual only).
		<br><br>
		Thankyou for using the script
	</div>`;

	while (el.children.length > 0) {
		document.body.appendChild(el.children[0]);
	}
});
