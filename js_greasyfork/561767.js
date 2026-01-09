// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @license      MIT 
// @version      2025-12-23
// @description  Manga Blacklist
// @author       Gera
// @match        https://mangakatana.com/*
// @match        https://manhuatop.org/*
// @match        https://manhuaus.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangakatana.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue

// @downloadURL https://update.greasyfork.org/scripts/561767/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/561767/New%20Userscript.meta.js
// ==/UserScript==

console.log('runSscript');
const currentUrl = window.location.href;
let mArray = [
    "Reincarnation Cycle",
    "Reincarnation Cycle"
]
if(!GM_getValue('mangaList', null)){
    GM_setValue('mangaList', mArray)
}

const mangaArray = GM_getValue('mangaList', null);

(function() {
    let titleArray;
    if(currentUrl.includes('manhuatop')){
        titleArray = document.querySelectorAll('.widget-title');
        console.log('widget-title');
        if(titleArray.length === 0) {
            console.log('comic_post__title');
            titleArray = document.querySelectorAll('.comic_post__title');
        }

    } else if(currentUrl.includes('manhuaus')){
        titleArray = document.querySelectorAll('.post-title');
        //        if(!titleArray) {
        //          titleArray = document.querySelectorAll('.comic_post__title');
        //    }

    } else {
        titleArray = document.querySelectorAll('.title');
    }

    // let titleArray = currentUrl.includes('manhuatop') ? document.querySelectorAll('.title') : document.querySelectorAll('.widget-title');
    for(let title of titleArray) {
        for(let manga of mangaArray){
            if (title.textContent.toLowerCase().includes(manga.toLowerCase())){
                console.log(title.textContent)
                title.parentNode.parentNode.style.display = 'none';
            }
        }
    }
})();