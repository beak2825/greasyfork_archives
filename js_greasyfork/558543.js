// ==UserScript==
// @name         GeoGuessr Chat Toggle
// @description  Toggle Chat from Navbar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       yuri - @2yuri
// @license      MIT
// @icon         https://www.geoguessr.com/favicon.ico
// @match        https://www.geoguessr.com/*
// @downloadURL https://update.greasyfork.org/scripts/558543/GeoGuessr%20Chat%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/558543/GeoGuessr%20Chat%20Toggle.meta.js
// ==/UserScript==

(function () {
    const LS_KEY = "__GEOGUESSR_EMOTES_ENABLED__";

    function getState() {
        return localStorage.getItem(LS_KEY) === "true";
    }

    function setState(v) {
        localStorage.setItem(LS_KEY, v ? "true" : "false");
    }

    // Inject CSS for pretty toggle
    function injectCSS() {
        const style = document.createElement("style");
        style.textContent = `
            .geotoggle-container {
                display: flex;
                align-items: center;
                margin-left: 12px;
                font-size: 14px;
                cursor: pointer;
                user-select: none;
            }

            .geotoggle-label {
                margin-right: 8px;
                color: white;
            }

            .geotoggle-switch {
                position: relative;
                width: 40px;
                height: 20px;
                background: #777;
                border-radius: 20px;
                transition: background 0.25s;
            }

            .geotoggle-switch.on {
                background: #4ade80 !important; /* green */
            }

            .geotoggle-slider {
                position: absolute;
                top: 2px;
                left: 2px;
                width: 16px;
                height: 16px;
                background: white;
                border-radius: 50%;
                transition: left 0.25s;
            }

            .geotoggle-switch.on .geotoggle-slider {
                left: 22px;
            }
        `;
        document.head.appendChild(style);
    }


    function createToggle() {
        const wrapper = document.createElement("div");
        wrapper.className = "geotoggle-container";

        const label = document.createElement("span");
        label.className = "geotoggle-label";
        label.textContent = "Chat";

        const switchEl = document.createElement("div");
        switchEl.className = "geotoggle-switch";
        if (getState()) switchEl.classList.add("on");

        const slider = document.createElement("div");
        slider.className = "geotoggle-slider";

        switchEl.appendChild(slider);
        wrapper.appendChild(label);
        wrapper.appendChild(switchEl);

        wrapper.addEventListener("click", () => {
            const isOn = switchEl.classList.toggle("on");
            setState(isOn);
            location.reload(true);
        });

        return wrapper;
    }

    function waitForHeader() {
        const selector = ".header-desktop_desktopSectionRight__MKe0U";

        const interval = setInterval(() => {
            const header = document.querySelector(selector);
            if (header && !document.getElementById("geotoggle")) {
                const toggle = createToggle();
                toggle.id = "geotoggle";
                header.appendChild(toggle);
                clearInterval(interval);
            }
        }, 400);
    }

    injectCSS();
    waitForHeader();
})();
