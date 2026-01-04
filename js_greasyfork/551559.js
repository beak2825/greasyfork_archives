// ==UserScript==
// @name         dlaa.me shiki highlight
// @namespace    http://unlucky.ninja/
// @version      2025-10-04
// @description  highlight old posts, needs manually overriding csp to preview
// @author       UnluckyNinja
// @match        https://dlaa.me/blog/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dlaa.me
// @license      Unlicense
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551559/dlaame%20shiki%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/551559/dlaame%20shiki%20highlight.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // ignore newer posts
    if (!document.querySelector('pre:not(:has(code[class]))')) {
        return
    }

    const { codeToHtml } = await import('https://esm.sh/shiki@3.13.0')

    document.querySelectorAll('pre:not(:has(code[class]))').forEach(async ele=>{
        const html = await codeToHtml(ele.textContent, {
            lang: 'csharp',
            theme: 'catppuccin-macchiato'
        })
        ele.innerHTML = html
        ele.firstChild.firstChild.style.backgroundColor = 'inherit' // avoid original style interfering
        ele.replaceWith(ele.firstChild)
    })

})();