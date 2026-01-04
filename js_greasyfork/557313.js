// ==UserScript==
// @name         Reddit - Auto Show Spoiler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Reddit - Auto Show Spoiler. 红迪 - 自动显示剧透
// @author       Martin______X
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557313/Reddit%20-%20Auto%20Show%20Spoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/557313/Reddit%20-%20Auto%20Show%20Spoiler.meta.js
// ==/UserScript==

const simpleClick = (async (button) => {
    button.click();
});
const spoilerInterval = setInterval(() => {
    try {
        let containers = document.querySelectorAll('shreddit-blurred-container');
        for (let i = 0; i < containers.length; i++) {
            let container = containers[i];
            if(container.shadowRoot){
                let button = container.shadowRoot.querySelector("button");
                if(button){
                    simpleClick(button);
                }
            }
        }
    } catch (error) {
        //console.error(error)
    }
}, 1);