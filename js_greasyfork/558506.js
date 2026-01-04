// ==UserScript==
// @name         Reddit Anti Translate
// @author       Minjae Kim
// @version      1.7
// @description  Redirects Reddit pages auto translated by removing the tl="selected language" parameter from Reddit URLs
// @match        https://www.reddit.com/r/*/comments/*
// @icon         https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png
// @run-at       document-start
// @license      MIT
// @namespace    https://greasyfork.org/en/users/1529082-minjae-kim
// @downloadURL https://update.greasyfork.org/scripts/558506/Reddit%20Anti%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/558506/Reddit%20Anti%20Translate.meta.js
// ==/UserScript==

(function() {
    const url = new URL(window.location.href);
    
    // Define the list of language codes you want to catch 
    // ex) const targetLangs = ["es"] for spanish 
    const targetLangs = ["ko", "en"];
    
    const currentTl = url.searchParams.get("tl");
    if (currentTl && targetLangs.includes(currentTl)) {
        url.searchParams.delete("tl");
        window.location.replace(url.toString());
    }
    
})();
