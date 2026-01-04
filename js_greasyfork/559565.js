// ==UserScript==
// @name         Import from Clipboard
// @namespace    https://github.com/Ikerstreamer/synergism-plugins
// @version      0.1.1
// @description  A simple script for the game synergism that allows you to import ambrosia loadouts via clipboard.
// @author       IkerStream
// @match        https://synergism.cc/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=synergism.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559565/Import%20from%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/559565/Import%20from%20Clipboard.meta.js
// ==/UserScript==

(() => {
    const callback = (elem) => () => {
        const allBlueberries = Object.fromEntries(Array(...document.getElementsByClassName("blueberryUpgrade")).map(
            (elem) => [elem.id, elem]
        ));
        const alertBox = document.getElementById("alertWrapper");
        const confirmationBox = document.getElementById("confirmationBox");
        const okButton = document.getElementById("ok_alert");
        function doAlertClose() {
            confirmationBox.style.display = "none";
            alertBox.style.display = "none";
            okButton.removeEventListener("click", doAlertClose);
        }
        const tooltipModal = document.getElementById("modal");

        const newButton = document.createElement("button");

        newButton.textContent = "Load from 📋";
        newButton.classList.add("ambrosiaLoadoutBtn");
        newButton.style.border = "2px solid orange";
        document.getElementById("importBlueberriesButton").insertAdjacentElement("afterend", newButton);

        newButton.addEventListener("click", async () => {
            try {
                /**
                 * @type {Object.<string, number>}
                 */
                const jsonObj = await navigator.clipboard.readText().then((resp) => JSON.parse(resp.trim()));

                document.getElementById("refundBlueberries").click();
                alertBox.querySelector("p.scrollbar").textContent = "Your loadout has been imported from clipboard.";

                for (const [key, amnt] of Object.entries(jsonObj)) {
                    const button = allBlueberries[key];
                    if (button) {
                        for (let i = 0; i < amnt; i++) {
                            button.click();
                        }
                    }
                }
                tooltipModal.style.display = "none";
            } catch (e) {
                if (e instanceof SyntaxError) {
                    confirmationBox.style.display = "block";
                    alertBox.style.display = "block";
                    alertBox.querySelector("p.scrollbar").textContent = "Could not parse a loadout from your clipboard.";

                    okButton.addEventListener("click", doAlertClose);
                }
                return;
            }
        });
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