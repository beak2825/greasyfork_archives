// ==UserScript==
// @name         Auto close "Log in to TikTok" popup
// @namespace    ctamer
// @version      2025-09-17
// @description  Makes login popups close so fast you no longer see them. having accounts sucks
// @author       calculatortamer
// @match        https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549886/Auto%20close%20%22Log%20in%20to%20TikTok%22%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/549886/Auto%20close%20%22Log%20in%20to%20TikTok%22%20popup.meta.js
// ==/UserScript==

function closeLoginPopup(){
    try{
        const loginPopup = document.querySelector("#login-modal");
        const closeLoginPopupButton = loginPopup.querySelector('div[data-e2e="modal-close-inner-button"]');
        closeLoginPopupButton.click();
        console.debug("closed login popup!")
    } catch {}
}

const observer = new MutationObserver(closeLoginPopup);
observer.observe(document.body, {childList: true});