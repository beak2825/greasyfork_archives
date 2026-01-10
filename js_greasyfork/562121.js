// ==UserScript==
// @name         YT-DVR
// @namespace    n2gf
// @description  Unlocks rewind for YouTube live streams with disabled DVR
// @author       n2gf copyMister
// @version      1.0
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562121/YT-DVR.user.js
// @updateURL https://update.greasyfork.org/scripts/562121/YT-DVR.meta.js
// ==/UserScript==

"use strict";

unsafeWindow.eval('const isObject = (value) => value != null && typeof value === "object";\
Object.defineProperty(Object.prototype, "playerResponse", {\
    set(value) {\
        if (isObject(value)) {\
            const { streamingData, videoDetails, playerConfig } = value;\
            if (isObject(videoDetails) && videoDetails.isLive && !videoDetails.isLiveDvrEnabled) {\
                videoDetails.isLiveDvrEnabled = true;\
\
                if (isObject(playerConfig) && playerConfig.mediaCommonConfig) {\
                    playerConfig.mediaCommonConfig.useServerDrivenAbr = false;\
                }\
\
                if (isObject(streamingData) && (streamingData.hlsManifestUrl || streamingData.dashManifestUrl) && streamingData.serverAbrStreamingUrl) {\
                    delete streamingData.serverAbrStreamingUrl;\
                }\
            }\
        }\
        this[Symbol.for("YT-DVR")] = value;\
    },\
    get() {\
        return this[Symbol.for("YT-DVR")];\
    },\
    configurable: true,\
});');