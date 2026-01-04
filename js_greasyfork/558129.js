// ==UserScript==
// @name         MooMoo.io Remove Ugly Object Vertex
// @description  Sharpens the ugly vertex
// @author       KOOKY WARRIOR
// @match        *://*.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @run-at       document-start
// @license      MIT
// @version      0.0.1
// @namespace    https://greasyfork.org/users/999838
// @downloadURL https://update.greasyfork.org/scripts/558129/MooMooio%20Remove%20Ugly%20Object%20Vertex.user.js
// @updateURL https://update.greasyfork.org/scripts/558129/MooMooio%20Remove%20Ugly%20Object%20Vertex.meta.js
// ==/UserScript==

const originalGetContext = HTMLCanvasElement.prototype.getContext
HTMLCanvasElement.prototype.getContext = function () {
	const ctx = originalGetContext.call(this, ...arguments)

	if (arguments[0] === "2d" && ctx) {
		const originalLineTo = ctx.lineTo

		ctx.lineTo = function (x, y) {
			if (x === 0) {
				ctx.lineJoin = "round"
			}

			return originalLineTo.call(this, x, y)
		}
	}

	return ctx
}
