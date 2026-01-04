// ==UserScript==
// @name         YT notoemoji to system emoji
// @namespace    http://tampermonkey.net/
// @version      2025-10-05
// @description  Replaces notoemoji in youtube with your system's default emoji.
// @author       Illina
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @require      https://greasyfork.org/scripts/12036-mutation-summary/code/Mutation%20Summary.js
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/551672/YT%20notoemoji%20to%20system%20emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/551672/YT%20notoemoji%20to%20system%20emoji.meta.js
// ==/UserScript==

console.log("Script is running!!!")

function replaceEmoji(summaries) {
    console.log("Function Called!!!")
    var summary = summaries[0]

    summary.added.forEach(function(newEl) {
        newEl.replaceWith(newEl.alt)
    })
}

var yt = new MutationSummary({
    callback: replaceEmoji,
    queries: [{element: ".yt-core-attributed-string__image-element"}]
})