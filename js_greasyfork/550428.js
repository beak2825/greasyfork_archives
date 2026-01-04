// ==UserScript==
// @name         gemini字体
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Applies Times New Roman font to the main body text of AI responses on both Gemini and ChatGPT, while preserving all other formatting.
// @author       toufu
// @match        https://gemini.google.com/*
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550428/gemini%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/550428/gemini%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        /* --- Gemini --- */
        /* Targets the main response container on Gemini */
        .markdown {
            font-family: "Times New Roman", serif !important;
        }

        /* --- ChatGPT --- */
        /* Directly targets text-containing elements within the assistant's message block */
        div[data-message-author-role="assistant"] p,
        div[data-message-author-role="assistant"] li,
        div[data-message-author-role="assistant"] ol,
        div[data-message-author-role="assistant"] ul,
        div[data-message-author-role="assistant"] blockquote {
            font-family: "Times New Roman", serif !important;
        }

        /* --- Universal Code Block Styling --- */
        /* Restores monospace font for code blocks on both platforms */
        .markdown pre,
        .markdown code,
        div[data-message-author-role="assistant"] pre,
        div[data-message-author-role="assistant"] code {
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace !important;
        }
    `;

    GM_addStyle(css);
})();