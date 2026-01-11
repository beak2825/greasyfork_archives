// ==UserScript==
// @name         Getaway Shootout Fullscreener
// @match        https://www.crazygames.com/game/*
// @match        https://www.poki.com/en/g/*
// @description  A script that makes Getaway Shootout's gameframe take up your whole screen for the best experience! No "Inspect Element" needed! Join the GS Discord server @ https://discord.com/invite/DMENXxVZgV
// @grant        none
// @version 0.0.1.20260111111856
// @namespace https://greasyfork.org/users/1440681
// @downloadURL https://update.greasyfork.org/scripts/562212/Getaway%20Shootout%20Fullscreener.user.js
// @updateURL https://update.greasyfork.org/scripts/562212/Getaway%20Shootout%20Fullscreener.meta.js
// ==/UserScript==

(function() {
    const css = `
#game-iframe {
    position: fixed !important;
    top: 0px;
    left: 0px;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 9999999 !important;
    }

#game, #game canvas, .ZvQjR9fV3GRraesBQUjX {
    position: fixed !important;
    top: 0px !important;
    left: 0px !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 2147483647 !important;
    }
`;

    const inject = () => {
        if (!document.getElementById('custom-injected-css')) {
            const style = document.createElement('style');
            style.id = 'custom-injected-css';
            style.innerHTML = css;
            document.head.appendChild(style);
        }
    };

    inject();
    new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
})();