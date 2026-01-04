// ==UserScript==
// @name         次レースショートカット
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ctrl + alt + n
// @author       You
// @match        https://play.typeracer.com*
// @match        https://play.typeracer.com/?universe=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typeracer.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553960/%E6%AC%A1%E3%83%AC%E3%83%BC%E3%82%B9%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/553960/%E6%AC%A1%E3%83%AC%E3%83%BC%E3%82%B9%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88.meta.js
// ==/UserScript==

document.addEventListener('keydown',(e)=>{
    if(document.querySelector('.txtInput').getAttribute('disabled') !== "") return;
    // 以下のif文でもプロパティ名が間違っています
    if(e.code === 'KeyN' && e.ctrlKey && e.altKey){ // ここ！
        console.log("atteiru")
        let raceAgain = document.querySelector('.raceAgainLink-green');
        if(raceAgain.style.display !== 'none') raceAgain.click();
    }
})