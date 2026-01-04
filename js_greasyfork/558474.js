// ==UserScript==
// @name         Reddit - Auto Best Video Quality
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Reddit - Auto Best Video Quality. Reddit - 视频自动最佳画质
// @author       Martin______X
// @match        https://www.reddit.com/*
// @match        https://www.redgifs.com/ifr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558474/Reddit%20-%20Auto%20Best%20Video%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/558474/Reddit%20-%20Auto%20Best%20Video%20Quality.meta.js
// ==/UserScript==

const simpleClick = (async (button) => {
    button.click();
    button.setAttribute("tred","");
});
const autoQualityInterval = setInterval(() => {
    try {
        let hlsjss = document.querySelectorAll('shreddit-player-static-hlsjs');
        for(let i=0; i<hlsjss.length;i++){
            //
            let hlsjs = hlsjss[i];
            if(hlsjs.shadowRoot){
                //
                let video = hlsjs.shadowRoot.querySelector('video');
                video.setAttribute("loop","");
                //
                let media_ui = hlsjs.shadowRoot.querySelector('shreddit-media-ui');
                //
                if(media_ui.shadowRoot){
                    let video_settings = media_ui.shadowRoot.querySelector('shreddit-video-settings');
                    //
                    if(video_settings.shadowRoot){
                        let autoplay_toggle = video_settings.shadowRoot.querySelector('button[data-testid="autoplay-toggle"]');
                        //
                        if(autoplay_toggle){
                            let best_quality = autoplay_toggle.parentElement.querySelector('button[data-testid="quality-option"]');
                            //
                            if(best_quality && !best_quality.hasAttribute("tred")){
                                simpleClick(best_quality);
                            }
                        }
                    }
                }
            }
        }
        //
        let qualityButton = document.querySelector('button.gifQualityButton');
        if(qualityButton && !qualityButton.hasAttribute("tred")){
            simpleClick(qualityButton);
        }
    } catch (error) {
        console.error(error)
    }
}, 1);