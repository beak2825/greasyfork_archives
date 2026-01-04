// ==UserScript==
// @name         fast private servers
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  shendujfr09ikm
// @match        https://www.roblox.com/games/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561081/fast%20private%20servers.user.js
// @updateURL https://update.greasyfork.org/scripts/561081/fast%20private%20servers.meta.js
// ==/UserScript==



// Created by yours truly poconoob
//with the help of chatgpt









(function () {
    const url = new URL(window.location.href);
    const linkCode = url.searchParams.get("privateServerLinkCode");
    if (!linkCode) return;
    const match = url.pathname.match(/^\/games\/(\d+)/);
    if (!match) return;
    const placeId = match[1];
    const deeplink = `roblox://placeId=${placeId}&linkCode=${linkCode}`;
    window.location.replace(deeplink);
})();
