// ==UserScript==
// @name         VideoPlayer Firefox fix for Chrome embeds
// @author       Sh4rkill3r
// @namespace    videoplayer-firefox-embeds
// @version      1.1
// @description  Replaces chrome-extension://opmeopcambhfimffbomjgemehjkbbmji/ prefix in iframes with your chosen base
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sharkiller.dev
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @require      https://unpkg.com/videoplayer-extension@latest/index.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562683/VideoPlayer%20Firefox%20fix%20for%20Chrome%20embeds.user.js
// @updateURL https://update.greasyfork.org/scripts/562683/VideoPlayer%20Firefox%20fix%20for%20Chrome%20embeds.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const CHROME_PREFIX = "chrome-extension://opmeopcambhfimffbomjgemehjkbbmji/";

    async function fixIframes() {
        const iframes = document.querySelectorAll('iframe[src^="chrome-extension://opmeopcambhfimffbomjgemehjkbbmji/"]');

        if (iframes.length === 0) {
            return;
        }

        let vp;
        let extensionBase = null;

        try {
            vp = await VideoPlayer.init();

            if (vp.isInstalled()) {
                extensionBase = vp.getDirectPlayer().replace('pages/player.html', '');
            } else {
                console.log("[FixExtensionIframe] No Firefox extension found.");
                return;
            }
        } catch (err) {
            return;
        }

        if(!extensionBase){
            console.log("[FixExtensionIframe] No Firefox extension found.");
            return;
        }

        iframes.forEach(iframe => {
            let src = iframe.getAttribute("src") || "";
            if (src.startsWith(CHROME_PREFIX)) {
                let newSrc = extensionBase + src.slice(CHROME_PREFIX.length);
                console.log("[FixExtensionIframe] Replacing →", newSrc);
                iframe.setAttribute("src", newSrc);
            }
        });

        console.log(`[FixExtensionIframe] Processed ${iframes.length} iframe(s)`);
    }

    if (document.readyState === 'complete') {
        fixIframes();
    } else {
        window.addEventListener('load', fixIframes, { once: true });
    }

})();