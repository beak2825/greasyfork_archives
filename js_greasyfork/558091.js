// ==UserScript==
// @name         Spotify Mobile + AdBlocker + Mute
// @namespace    any
// @version      2025-11-17.1
// @description  Mobile-style Spotify layout + blocks all ads + mutes Spotify ads automatically.
// @author       Anonymous
// @match        https://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558091/Spotify%20Mobile%20%2B%20AdBlocker%20%2B%20Mute.user.js
// @updateURL https://update.greasyfork.org/scripts/558091/Spotify%20Mobile%20%2B%20AdBlocker%20%2B%20Mute.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------------------- MOBILE LAYOUT ----------------------
    function isMobile() {
        const regex = /Mobi|Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return regex.test(navigator.userAgent);
    }

    if (!isMobile()) {
        const style = document.createElement('style');
        style.textContent = `
        #global-nav-bar { margin-bottom: 0.5rem; margin-top: 0.5rem; }
        #global-nav-bar > div:nth-of-type(1) > a,
        [data-testid="upgrade-button"],
        [href="/download"],
        [data-testid="friend-activity-button"] { display: none!important; }
        #context-menu > ul > :last-child { display: none!important; }
        [data-testid="user-widget-menu"] > ul > li:nth-child(8),
        [data-testid="user-widget-menu"] > ul > li:nth-child(9),
        [data-testid="user-widget-menu"] > ul > li:nth-child(10) { display: none!important; }
        body { min-width: unset!important; }
        #main > div { --panel-gap: 0px!important; }
        #Desktop_LeftSidebar_Id { display: none!important; }
        #main > div > div:nth-of-type(2) > div:nth-of-type(7) { display: none!important; }
        [data-testid="now-playing-bar"] { min-width: unset!important; }
        [data-testid="now-playing-bar"] > div > div:nth-of-type(1),
        [data-testid="now-playing-bar"] > div > div:nth-of-type(3) { display: none!important; }
        [data-testid="now-playing-bar"] > div > div:nth-of-type(2) { max-width: unset!important; width: 90%!important; }
        [data-testid="now-playing-bar"] > div { justify-content: space-around!important; }
        [data-testid="footer-div"] { display: none!important; }
        [data-testid="tracklist-row"] > div:nth-child(2) > :not(:last-child) { display: none!important; }
        [data-testid="tracklist-row"] > div:last-child > :first-child { display: none!important; }
        .os-scrollbar-track { display: none!important; }
        `;
        document.head.appendChild(style);

        const observer = new MutationObserver((mutations, obs) => {
            const form = document.querySelector('[data-encore-id="formInputIcon"]');
            if (form) {
                form.click();
                if (document.activeElement) document.activeElement.blur();
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ---------------------- ADBLOCKER ----------------------
    const queryAsync = (query, interval = 250) => new Promise(resolve => {
        const checkInterval = setInterval(() => {
            const element = document.querySelector(query);
            if (element) {
                clearInterval(checkInterval);
                resolve(element);
            }
        }, interval);
    });

    const removeElements = selector => document.querySelectorAll(selector).forEach(el => el.remove());

    const handleAudioAds = () => {
        const audioAd = document.querySelector('audio[src*="spotify.com/ad"]');
        if (audioAd) {
            audioAd.src = "";
            audioAd.pause();
        }
    };

    const inject = ({ ctx, fn, transform }) => {
        const original = ctx[fn];
        ctx[fn] = function () {
            const result = original.apply(this, arguments);
            return transform ? transform.call(this, result, ...arguments) : result;
        };
    };

    const adObserver = new MutationObserver(() => {
        removeElements('[data-testid="ad-slot-container"], [class*="ad-"]');
        handleAudioAds();
        removeElements('.ButtonInner-sc-14ud5tc-0.fcsOIN');
    });
    adObserver.observe(document.body, { childList: true, subtree: true });

    const adRemovalInterval = setInterval(() => {
        removeElements('[data-testid="ad-slot-container"], [class*="ad-"]');
        handleAudioAds();
        removeElements('.ButtonInner-sc-14ud5tc-0.fcsOIN');
    }, 1000);

    (async () => {
        const nowPlayingBar = await queryAsync(".now-playing-bar");
        const playButton = await queryAsync("button[title=Play], button[title=Pause]");
        let audio;

        inject({
            ctx: document,
            fn: "createElement",
            transform(result, type) {
                if (type === "audio") audio = result;
                return result;
            },
        });

        new MutationObserver(() => {
            if (audio && playButton && document.querySelector(".now-playing > a")) {
                audio.src = "";
                playButton.click();
            }
        }).observe(nowPlayingBar, { childList: true, subtree: true });
    })();

    window.addEventListener('beforeunload', () => {
        adObserver.disconnect();
        clearInterval(adRemovalInterval);
    });

    // ---------------------- MUTE ADS ----------------------
    const targetNode = document.body;
    const config = { attributes: true, childList: true, subtree: true };

    const muteObserver = new MutationObserver(mutationList => {
        const muteButton = document.querySelector('[data-testid="volume-bar-toggle-mute-button"]');
        const title = document.querySelector("title").textContent;
        if (title.includes("Spotify – Advertisement") && !muteButton?.hasAttribute("isMuted")) {
            muteButton.click();
            muteButton.setAttribute("isMuted", true);
        }
        if (!title.includes("Spotify – Advertisement") && muteButton?.hasAttribute("isMuted")) {
            muteButton.click();
            muteButton.removeAttribute("isMuted");
        }
    });

    muteObserver.observe(targetNode, config);

    console.log("Spotify Mobile + AdBlocker + Mute script is active");
})();