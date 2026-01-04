// ==UserScript==
// @name         Submit Text on CSES
// @namespace    plantt
// @version      2025-11-27
// @description  Submit on CSES with pasting
// @author       You
// @match        https://cses.fi/problemset/submit/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/557074/Submit%20Text%20on%20CSES.user.js
// @updateURL https://update.greasyfork.org/scripts/557074/Submit%20Text%20on%20CSES.meta.js
// ==/UserScript==

let fileInput = document.querySelector("input[name=file]");
let lang = document.getElementById("lang");
let textarea = document.createElement("textarea");
fileInput.parentElement.parentElement.insertBefore(textarea, fileInput.parentElement.nextElementSibling);
if (localStorage.getItem("cses-lang")) {
    lang.value = localStorage.getItem("cses-lang");
    lang.dispatchEvent(new Event("change"));
}
lang.onchange = () => localStorage.setItem("cses-lang", lang.value);
textarea.oninput = () => {
    let datat = new DataTransfer;
    datat.items.add(new File([textarea.value], "source.txt"));
    fileInput.files = datat.files;
};