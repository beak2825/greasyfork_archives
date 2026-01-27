// ==UserScript==
// @name         WideView: ChatGPT
// @author       Kamiya Minoru
// @namespace    N/A
// @version      1.0
// @description  Expands ChatGPT web interface to full width for better readability and input space
// @match        https://chatgpt.com/*
// @icon         https://chatgpt.com/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564117/WideView%3A%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/564117/WideView%3A%20ChatGPT.meta.js
// ==/UserScript==

GM_addStyle(`
:root {--thread-content-max-width: 90vw !important;}

div[class*="thread-content-max-width"],
div[class*="max-w-"] {  max-width: 90vw !important;}

.user-message-bubble-color {max-width: 90vw !important;}

.markdown.prose,
.markdown-new-styling {max-width: 90vw !important;}

form[data-type="unified-composer"],
form[data-type="unified-composer"] > div,
form[data-type="unified-composer"] [data-composer-surface="true"] {max-width: 90vw !important;}

#prompt-textarea,
.ProseMirror {max-width: 90vw !important;}`);