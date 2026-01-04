// ==UserScript==
// @name         SpotiUp (SpotiDown.app unlocker)
// @namespace    Courtesy of your own
// @version      341
// @description  Removes the bulk download paywall and removes the anti-adblocker
// @author       spookyboi6822
// @match        https://spotidown.app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotidown.app
// @grant        none
// @require      https://update.greasyfork.org/scripts/469993/1214452/FunctionHookerjs.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548801/SpotiUp%20%28SpotiDownapp%20unlocker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548801/SpotiUp%20%28SpotiDownapp%20unlocker%29.meta.js
// ==/UserScript==


// bm90aGluZyB0byBzZWUgaGVyZSwgc29ycnkgbXkgZGVhcg==
// bWF5YmUgeW91IHdpbGwgZmluZCBzb21ldGhpbmcuIG9ubHkgdGltZSBjYW4gdGVsbA==

(function() {
    'use strict';

    const SPU_hooker = new FunctionHooker();
    if(window["gtag"]) {
        SPU_hooker.hook("window.gtag", (...args) => { return true })
    }

    console.log(`

⠀⠀⠀⠀⠀⢀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡟⠈⠛⢦⣄⠀⠀⠀⠀⠀⣀⡴⠚⠩⠘⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣧⠀⡀⠄⠈⠛⠛⠛⠛⢛⠁⠌⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣿⠞⠁⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣼⠃⢠⠤⢤⠀⠀⠀⠀⢀⡤⢤⡀⠀⠀⠀⠘⣧⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢀⣤⣤⣧⡄⠀⠀⠀⠀⣤⡀⠀⠀⠀⠀⠁⣤⣤⣤⣤⣼⣦⡄⠀⠀⠀⠀⠀⠀
⠀⢀⣠⡤⣷⠶⠀⠀⠀⠦⠜⠤⠄⠀⠀⠀⠰⠦⣤⣄⣀⣸⠃⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠘⢧⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣽⣋⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠙⢳⡶⠶⠶⠶⠶⠶⠶⠖⠛⠛⠍⠀⠉⠛⣷⣤⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢠⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣦⡀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣾⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⡀⠀
⠀⠀⠀⠀⠀⠀⠀⣏⠀⠀⠀⠀⢠⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀
⠀⠀⠀⠀⠀⠀⠀⢻⡀⠀⠀⠀⣿⠀⠀⠀⠀⢠⡾⠋⠁⠀⠀⠀⠀⠀⠀⢸⡇⠀
⠀⠀⠀⠀⠀⠀⠀⠈⢷⡀⠀⠀⣿⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠃⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⢧⣀⣠⣼⣧⣀⣀⣰⣟⡀⠀⠀⠀⠀⠀⢀⣀⣼⢿⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣟⠁⠀⠉⠉⠉⠉⠙⠛⠛⠛⠻⠿⠛⠛⠉⠁⣼⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢦⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⡴⠞⠁⠀⠀
             Courtesy of your own⠀⠀⠀⠀⠀⠀

`)


    const _SPU_FunctionNames = {
        ["adblock"]: "checkAdsBlocked",
        ["albumdownload"]: "downloadFullAlbum",
        ["ad"]: "showAd"
    }

    SPU_hooker.hook(`window.${_SPU_FunctionNames.ad}`, (...args) => { return } );
    SPU_hooker.hook(`window.${_SPU_FunctionNames.adblock}`, (...args) => args[0](false) );

    let SPU_func_str = window[_SPU_FunctionNames.albumdownload].toString()
    SPU_func_str = SPU_func_str.replaceAll("totalTracks > 3", "false")
    SPU_func_str = SPU_func_str.replaceAll(`${_SPU_FunctionNames.albumdownload}(`, "(")
    SPU_func_str = SPU_func_str.replaceAll("let currentIndex = 0", "let currentIndex = 0; if (totalTracks > 3) { let h = document.getElementById('zip-error-alert'); h.innerHTML = `This should be locked under a paywall, but since you are using a cool ass script, it's not !\n<strong>Make stuff free for once god damn it</strong>`; h.style.display = 'block' }")
    SPU_func_str = "return " + SPU_func_str

    let SPU_new = new Function(SPU_func_str)
    SPU_hooker.hook(`window.${_SPU_FunctionNames.albumdownload}`, (...args) => SPU_new()(...args) );
})();