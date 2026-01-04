// ==UserScript==
// @name         MooMoo.io Reload Faulty Image
// @description  Reloads faulty images if they are not loaded correctly
// @author       KOOKY WARRIOR
// @match        *://*.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @license      MIT
// @version      0.0.1
// @namespace    https://greasyfork.org/users/999838
// @downloadURL https://update.greasyfork.org/scripts/561370/MooMooio%20Reload%20Faulty%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/561370/MooMooio%20Reload%20Faulty%20Image.meta.js
// ==/UserScript==

const imageReferences = []

const desc = Object.getOwnPropertyDescriptor(Image.prototype, "src")
Object.defineProperty(Image.prototype, "src", {
	set(link) {
		if (this._src == null) {
			this._src = link
			imageReferences.push(this)
		}

		return desc.set.call(this, link)
	}
})

GM_registerMenuCommand("🔄️ Reload images", () => {
	for (const image of imageReferences) {
		if (image._src != null) {
			image.src = image._src + "?retry=" + Date.now()
		}
	}
})
