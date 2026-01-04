// ==UserScript==
// @name         SoundCloud - Auto Redirect to now playing song!
// @version      2.0
// @description  Auto-jump to the now playing track on SoundCloud.
// @match        https://soundcloud.com/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1543984
// @downloadURL https://update.greasyfork.org/scripts/557696/SoundCloud%20-%20Auto%20Redirect%20to%20now%20playing%20song%21.user.js
// @updateURL https://update.greasyfork.org/scripts/557696/SoundCloud%20-%20Auto%20Redirect%20to%20now%20playing%20song%21.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const getControls = () =>
        document.querySelector(".playControls__elements");

    const getCheckboxLabel = () =>
        document.querySelector(".sc-auto-redirect-label");

    const isPlaying = () =>
        Boolean(document.querySelector(".playControls__play.playing"));

    const getTitleLink = () =>
        document.querySelector(".playbackSoundBadge__titleLink");

    const getCurrentLink = () =>
        (getTitleLink() || {})
        .href || "";

    let active = false;
    let last = getCurrentLink();

    const injectStyles = () => {
        if (document.getElementById("sc-auto-redirect-styles")) return;

        const style = document.createElement("style");
        style.id = "sc-auto-redirect-styles";

        style.textContent = `
.sc-auto-redirect-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    margin-right: 10px;
}

.sc-auto-redirect-label {
    display: inline-flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    user-select: none;
}

.sc-auto-redirect-input {
    position: absolute;
    opacity: 0;
    width: 18px;
    height: 18px;
    margin: 0;
    padding: 0;
    border: 0;
}

.sc-custom-box {
    width: 18px;
    height: 18px;
    background: #222;
    border: 2px solid #FF7800;
    border-radius: 3px;
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    transition: background .15s, box-shadow .15s;
}

.sc-custom-box::after {
    content: "✓";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -52%);
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
    color: black;
    opacity: 0;
    transition: opacity .15s;
}

.sc-auto-redirect-input:checked + .sc-custom-box {
    background: #FF7800;
}

.sc-auto-redirect-input:checked + .sc-custom-box::after {
    opacity: 1;
}

.sc-auto-redirect-label:hover .sc-custom-box {
    box-shadow: 0 0 4px #FF7800;
}
        `;

        document.head.appendChild(style);
    };

    const createCheckbox = () => {
        const controls = getControls();
        if (!controls || getCheckboxLabel()) return;

        injectStyles();

        const wrap = document.createElement("div");
        wrap.className = "sc-auto-redirect-wrapper";

        const label = document.createElement("label");
        label.className = "sc-auto-redirect-label";
        label.title = "Auto redirect to now playing";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.className = "sc-auto-redirect-input";
        input.checked = active;

        input.addEventListener("change", () => {
            active = input.checked;
        });

        const box = document.createElement("span");
        box.className = "sc-custom-box";

        label.appendChild(input);
        label.appendChild(box);
        wrap.appendChild(label);

        controls.insertBefore(wrap, controls.firstChild);
    };

    setInterval(() => {
        if (!getControls()) return;
        createCheckbox();

        const current = getCurrentLink();
        if (isPlaying() && active && current !== last) {
            getTitleLink()
                ?.click();
            last = current;
        }
    }, 1000);
})();
