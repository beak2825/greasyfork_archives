// ==UserScript==
// @name         Force MathJax 2 CommonHTML
// @namespace    http://tampermonkey.net/
// @version      2025-11-28
// @description  MathJax 2 の mjx.menu を CommonHTML に固定します。(macOS で Chromium 系ブラウザを使用している人向け)
// @author       Not_Leonian
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557108/Force%20MathJax%202%20CommonHTML.user.js
// @updateURL https://update.greasyfork.org/scripts/557108/Force%20MathJax%202%20CommonHTML.meta.js
// ==/UserScript==

(() => {
	"use strict";

	// Your code here...
	var value = "renderer:CommonHTML";
	// biome-ignore lint/suspicious/noDocumentCookie: This is a userscript.
	document.cookie = `mjx.menu=${escape(value)}; path=/`;
})();
