// ==UserScript==
// @name         Ambrosia Loadout Quickbar
// @namespace    https://github.com/Ikerstreamer/synergism-plugins
// @version      0.1.2
// @description  A simple script for the game synergism that allows you to import ambrosia loadouts via clipboard.
// @author       IkerStream
// @match        https://synergism.cc/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=synergism.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560135/Ambrosia%20Loadout%20Quickbar.user.js
// @updateURL https://update.greasyfork.org/scripts/560135/Ambrosia%20Loadout%20Quickbar.meta.js
// ==/UserScript==

(() => {
    const callback = (elem) => () => {
        const okButton = document.getElementById("ok_alert");

        const loadoutSlots = Array.from(document.getElementsByClassName("blueberryLoadoutSlot"))
            .filter((elem) => elem.id.match(/^blueberryLoadout[1-8]$/))
            .toSorted((elem1, elem2) => elem1.id[-1] - elem2.id[-1]);
        const toggleButton = document.getElementById("blueberryToggleMode");
        const cssFile = document.createElement("style");
        cssFile.textContent = `
        @keyframes hue-rotate {
            to {
                --angle: 360deg;
            }
        }

        @property --angle {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
        }

        .ambrosia-quick-bar-active {
            --angle: 0deg;
            border-image: conic-gradient(
                from var(--angle),
                #ff5e00,
                #ff9a00,
                #ffcd00,
                #e5ff00,
                #a5ff00,
                #00ffc8,
                #00c8ff,
                #00a5ff,
                #9500ff,
                #ff00e1,
                #ff0095,
                #ff5e00
                )
                1;
            animation: hue-rotate 6s linear infinite;
        }
        .ambrosia-quick-bar-loadout-container {
            display: flex;
            justify-content: center;
            padding: 0px;
            width: auto;
            gap: 4px;
            margin: 0px 4% 10px 0px;
            align-self: flex-end;
        }
        `;

        document.getElementsByTagName("head").item(0)
            .appendChild(cssFile);

        const container = document.createElement("div");
        container.classList.add("ambrosia-quick-bar-loadout-container");
        /**
         *
         * @param {HTMLElement} elem
         */
        function setActiveBorder(elem) {
            elem.classList.add("ambrosia-quick-bar-active");
        }
        /**
        *
        * @param {HTMLElement} elem
        */
        function removeActiveBorder(elem) {
            elem.classList.remove("ambrosia-quick-bar-active");
        }


        const quickButtons = [];
        for (let i = 0; i < 8; i++) {
            const newButton = document.createElement("button");
            newButton.classList.add("blueberryLoadoutSlot");

            newButton.addEventListener("click", () => {
                const swapBack = false;
                if (toggleButton.textContent != "MODE: LOAD LOADOUT") {
                    toggleButton.click();
                    swapBack = true;
                }

                loadoutSlots.at(i).click();
                okButton.click();

                if (swapBack) {
                    toggleButton.click();
                }
            });
            newButton.style.display = "flex";
            newButton.textContent = i + 1;
            quickButtons.push(newButton);
            container.insertAdjacentElement("beforeend", newButton);
        };

        let selectedLoadout = -1;
        loadoutSlots.forEach((slot, i) => {
            slot.addEventListener("click", () => {
                if (selectedLoadout > -1) {
                    removeActiveBorder(quickButtons.at(selectedLoadout));
                    removeActiveBorder(loadoutSlots.at(selectedLoadout));
                }
                setActiveBorder(slot);
                setActiveBorder(quickButtons.at(i));
                selectedLoadout = i;
            });
        });

        document.querySelector("header div.subHeader").insertAdjacentElement("afterend", container);

        // Ensure the listener gets detached
        elem.removeEventListener("click", callback);
    };

    function setup() {
        const elem = document.getElementById("exitOffline");
        if (!elem) {
            setTimeout(setup, 250);
            return;
        }
        elem.addEventListener("click", callback(elem));
    }
    setup();
})();