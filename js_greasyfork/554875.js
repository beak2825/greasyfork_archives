// ==UserScript==
// @name         FMP short show in bar
// @version      0.1
// @description  Show short in bar
// @match        https://footballmanagerproject.com/Team/Player?id=*
// @match        https://www.footballmanagerproject.com/Team/Player?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=footballmanagerproject.com
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1304483
// @downloadURL https://update.greasyfork.org/scripts/554875/FMP%20short%20show%20in%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/554875/FMP%20short%20show%20in%20bar.meta.js
// ==/UserScript==

const observer = new MutationObserver(() => {
    try{
        if (document.getElementById("shortlistBtn")) {
            const div=document.getElementById("ntFlagTd");
            const short=document.getElementById("shortlistBtn");
            if(short.children[0].children[0].className==='fmp-btn btn-brown'){
                const button=document.createElement("div");
                button.textContent="已关注";
                div.appendChild(button);
            }
            observer.disconnect();
        }
    }catch(error){
        console.log(error);
        observer.disconnect();
    }
});

observer.observe(document, { childList: true, subtree: true });
