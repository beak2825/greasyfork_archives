// ==UserScript==
// @name         Twitch - Remove Video Overlay
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Twitch - Remove Video Overlay (Bits, Extension etc)
// @author       Martin______X
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554994/Twitch%20-%20Remove%20Video%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/554994/Twitch%20-%20Remove%20Video%20Overlay.meta.js
// ==/UserScript==

//
const comboBitsCheckInterval = setInterval(() => {
    try{
        let oneTapStoreId = document.querySelector('#one-tap-store-id');
        if(oneTapStoreId)oneTapStoreId.remove();
        
        //Layout-sc-1xcs6mc-0 dquNzJ top-bar
        let topBar = document.querySelector('.top-bar');
        if(topBar)topBar.remove();
        //Layout-sc-1xcs6mc-0 gtHDFr disclosure-tool dt-attach-top-right
        let disclosureTool = document.querySelector('.disclosure-tool');
        if(disclosureTool)disclosureTool.remove();
    }catch(error){
        //console.error(error);
    }
}, 1);