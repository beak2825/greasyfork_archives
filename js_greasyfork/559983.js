// ==UserScript==
// @name         1337x open in Steam
// @namespace    B1773rm4n
// @version      2025-12-24
// @description  Opens the game page in Steam based on the torrent title
// @copyright    WTFPL
// @license      WTFPL
// @source       https://github.com/B1773rm4n/Tampermonkey_Userscripts/blob/main/1337x_OpenInSteam.js
// @author       B1773rm4n
// @match        https://1337x.to/torrent/*
// @match        https://x1337x.cc/torrent/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1337x.to
// @grant        none
// @run-at   document-end
// @downloadURL https://update.greasyfork.org/scripts/559983/1337x%20open%20in%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/559983/1337x%20open%20in%20Steam.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const gameNameRaw = document.getElementsByTagName("h1")[0].innerText
    console.log(gameNameRaw)

    let gameName
    // remove brackets
    gameName = gameNameRaw.split('[')[0]
    gameName = gameName.split('(')[0]
    gameName = gameName.split('<')[0]

    // remove certain keywords
    gameName = gameName.split('Update')[0]
    gameName = gameName.split('Hotfix')[0]
    gameName = gameName.split('Deluxe')[0]
    gameName = gameName.split('Edition')[0]
    gameName = gameName.split('Directors')[0]


    // remove ripper names
    gameName = gameName.split('The Codex')[0]
    gameName = gameName.split('TENOKE')[0]
    gameName = gameName.split('SKIDROW')[0]
    gameName = gameName.split('Unleashed')[0]
    gameName = gameName.split('Rune')[0]
    gameName = gameName.split('RUNE')[0]
    gameName = gameName.split('TiNYiSO')[0]
    gameName = gameName.split('Razor1911')[0]

    // remove special cases
    gameName = gameName.replace(/v.?\d.*/gi, ''); // version number like v1.2345
    gameName = gameName.replace(/[^a-zA-Z0-9 ]/g, ''); // remove special characters

    gameName = gameName.trim()

    console.log(gameName)

    document.getElementsByTagName("h1")[0].innerHTML = "<a href=\"https://store.steampowered.com/search/?term=" + gameName + "\">" + gameNameRaw + "<\a>"

})();