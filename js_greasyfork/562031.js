// ==UserScript==
// @name            Telegram | Fix fullscreen without custom controls
// @namespace       https://greasyfork.org/users/821661
// @version         1.0
// @description     fix fullscreen mode for videos without custom controls
// @author          hdyzen
// @match           https://web.telegram.org/a/*
// @run-at          document-start
// @grant           none
// @license         GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/562031/Telegram%20%7C%20Fix%20fullscreen%20without%20custom%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/562031/Telegram%20%7C%20Fix%20fullscreen%20without%20custom%20controls.meta.js
// ==/UserScript==

const stl = `
    .VideoPlayer:fullscreen video { 
        max-height: unset !important; 
    } 
    .VideoPlayer:fullscreen > :first-child { 
        width: 100% !important; 
        height: 100% !important; 
    }
`;

document.addEventListener("mousedown", async (ev) => {
    const fullscreen = ev.target.closest(".Button.fullscreen");
    if (!fullscreen) return;

    ev.stopImmediatePropagation();

    if (document.fullscreenElement) {
        document.exitFullscreen();
        return;
    }

    const player = document.querySelector(".MediaViewerSlide--active .VideoPlayer");
    if (!player) return;

    await player.requestFullscreen();

    const video = player.querySelector("video");
    setTimeout(() => video.removeAttribute("controls"), 100);
});

document.head.insertAdjacentHTML("beforeend", `<style>${stl}</style>`);
