// ==UserScript==
// @name         Get Your Discord Token
// @namespace    https://staybrowser.com/
// @version      0.1
// @description  Use this to get your discord token. Made by NEVERLOSE (g6qn discord)
// @author       NEVERLOSE
// @match        *://*/*
// @grant        none
// @license     MIT
// @icon         https://cdn.discordapp.com/attachments/1429959568871526631/1430193052084867082/IMG_6367.jpg?ex=68f8e293&is=68f79113&hm=7fb0dca17c44f10e07d90e596a44ed85bbd953cc3d254eda79265af2240a9e22&
// @downloadURL https://update.greasyfork.org/scripts/553296/Get%20Your%20Discord%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/553296/Get%20Your%20Discord%20Token.meta.js
// ==/UserScript==
(async () => {
    let o = localStorage.getItem("token")
        .split('"')
        .join("")
        , t = confirm("Do you want to get your token?");
    if (!0 === t) { let e = confirm("Are you sure?"); if (!0 === e) { let n = confirm("Made by NEVERLOSE. (@g6qn discord if u face any problems)");!0 === n && prompt("Your Discord token", o) } }
})();
