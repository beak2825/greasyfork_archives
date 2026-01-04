// ==UserScript==
// @name         Auto Swap Ambrosia Layout
// @namespace    https://github.com/Ikerstreamer/synergism-plugins
// @version      0.1.9
// @description  A simple script for the game Synergism that  auto swaps between 2 ambrosia loadouts while on the ambrosia tab.
// @author       IkerStream
// @match        https://synergism.cc/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=synergism.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559564/Auto%20Swap%20Ambrosia%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/559564/Auto%20Swap%20Ambrosia%20Layout.meta.js
// ==/UserScript==

(() => {
    const callback = (elem) => () => {
        const singTabButton = document.getElementById("singularitytab");
        const ambrosiaTab = document.getElementById("toggleSingularitySubTab5");
        const ambrosiaBar = document.getElementById("ambrosiaProgressBar");
        const ambrosiaProgress = document.getElementById("ambrosiaProgress");
        const redAmbrosiaBar = document.getElementById("pixelProgressBar");
        const redAmbrosiaProgress = document.getElementById("pixelProgress");
        const okButton = document.getElementById("ok_alert");
        const tooltipModal = document.getElementById("modal");
        const tooltipText = document.getElementById("modalContent");
        const toggleButton = document.getElementById("blueberryToggleMode");

        const loadoutSlots = Array.from(document.getElementsByClassName("blueberryLoadoutSlot"))
            .filter((elem) => elem.id.match(/^blueberryLoadout[1-8]$/))
            .toSorted((elem1, elem2) => elem1.id[-1] - elem2.id[-1]);

        function ambrosiaTabActive() {
            return singTabButton.style.backgroundColor != undefined && ambrosiaTab.classList.contains("active-subtab");
        }

        const loadoutStandard = document.createElement("select");
        loadoutStandard.classList.add("blueberryLoadoutSlot");
        loadoutStandard.style.backgroundColor = "var(--button-color)";
        loadoutStandard.style.color = "white";
        loadoutStandard.style.appearance = "none";
        loadoutStandard.style.cursor = "pointer";
        loadoutStandard.style.textAlign = "center";

        for (let i = 1; i <= 8; i++) {
            const opt = document.createElement("option");
            opt.value = i;
            opt.text = i;
            loadoutStandard.options.add(opt);
        }
        /**
         * @type {HTMLSelectElement}
         */
        const loadoutLuck = loadoutStandard.cloneNode(true);
        loadoutStandard.name = "autoSwapLoadout--standard";
        loadoutLuck.name = "autoSwapLoadout--luck";
        const infoText = document.createElement("span");
        infoText.textContent = "Auto swapping between loadouts.";
        infoText.style.color = "lightblue";

        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.justifyContent = "space-between";
        container.style.width = ambrosiaBar.computedStyleMap ? ambrosiaBar.computedStyleMap().get("width") : "25%";
        container.insertAdjacentElement("beforeend", loadoutStandard);
        container.insertAdjacentElement("beforeend", infoText);
        container.insertAdjacentElement("beforeend", loadoutLuck);

        ambrosiaBar.insertAdjacentElement("beforebegin", container);

        const settings = localStorage.getItem("autoSwapAmbrosiaSettings");
        if (settings != null) {
            try {
                const settingsObj = JSON.parse(settings);
                loadoutStandard.selectedIndex = settingsObj.loadoutStandard ?? loadoutStandard.selectedIndex;
                loadoutLuck.selectedIndex = settingsObj.loadoutLuck ?? loadoutLuck.selectedIndex;
            } catch { };
        }
        function updateSettings() {
            localStorage.setItem("autoSwapAmbrosiaSettings",
                JSON.stringify({
                    loadoutLuck: loadoutLuck.selectedIndex,
                    loadoutStandard: loadoutStandard.selectedIndex
                })
            );
        }
        /**
         *
         * @param {string} msg
         */
        function showModal(msg) {
            tooltipModal.style.display = "block";
            tooltipModal.style.borderColor = "blue";
            tooltipText.innerHTML = msg;
        }

        function hideModal() {
            tooltipModal.style.display = "none";
            tooltipText.innerHTML = "";
        }
        /**
         *
         * @param {MouseEvent} ev
         */
        function moveModal(ev) {
            tooltipModal.style.left = `${ev.clientX + 20}px`;
            tooltipModal.style.top = `${ev.clientY + 20}px`;
        }

        loadoutStandard.addEventListener("change", updateSettings);
        loadoutLuck.addEventListener("change", updateSettings);
        loadoutStandard.addEventListener("mouseenter", () => showModal("Select the loadout u want to swap back to after the bar has filled. <br> (Ex. your loadout to farm octs)"));
        loadoutLuck.addEventListener("mouseenter", () => showModal("Select the loadout u want to swap to when the bar fills. <br> (Your loadout with the best Ambrosia Luck)"));
        loadoutStandard.addEventListener("mousemove", moveModal);
        loadoutLuck.addEventListener("mousemove", moveModal);
        loadoutStandard.addEventListener("mouseleave", hideModal);
        loadoutLuck.addEventListener("mouseleave", hideModal);

        toggleButton.addEventListener("click", () => {
            infoText.textContent = "Auto swapping between loadouts.";
            startLoop();
        });

        let ambrosiaLoadoutSelected = false;
        let currentlyLooping = false;

        const lastReading = {
            time: Date.now(),
            blue: {
                width: parseFloat(ambrosiaProgress.style.width),
                rate: 3,
            },
            red: {
                width: parseFloat(redAmbrosiaProgress.style.width),
                rate: 0.5,
            }
        };
        function loop() {
            currentlyLooping = true;
            if (!ambrosiaTabActive()) {
                currentlyLooping = false;
                return;
            }

            if (toggleButton.textContent != "MODE: LOAD LOADOUT") {
                currentlyLooping = false;
                infoText.textContent = "Auto swap disabled, set MODE to LOAD LOADOUT";
                return;
            }
            const [widthBlue, widthRed] = [parseFloat(ambrosiaProgress.style.width), parseFloat(redAmbrosiaProgress.style.width)];


            const diffInSeconds = (Date.now() - lastReading.time) / 1000;

            if (diffInSeconds > 0) {
                const [rateBlue, rateRed] = [(widthBlue - lastReading.blue.width) / diffInSeconds, (widthRed - lastReading.red.width) / diffInSeconds];
                lastReading.blue.rate = lastReading.blue.rate * 0.9 + rateBlue * 0.1;
                lastReading.red.rate = lastReading.red.rate * 0.9 + rateRed * 0.1;
            }

            lastReading.blue.width = widthBlue;
            lastReading.red.width = widthRed;

            lastReading.time = Date.now();

            const barFillWithinOneSec = [widthBlue + lastReading.blue.rate, widthRed + lastReading.red.rate]
                .some(val => val >= 100);
            if (!ambrosiaLoadoutSelected && barFillWithinOneSec) {
                loadoutSlots.at(loadoutLuck.selectedIndex).click();
                okButton.click();
                ambrosiaLoadoutSelected = true;
            }
            if (ambrosiaLoadoutSelected && !barFillWithinOneSec) {
                loadoutSlots.at(loadoutStandard.selectedIndex).click();
                okButton.click();
                ambrosiaLoadoutSelected = false;
            }
            setTimeout(loop, 100);
        }

        function startLoop() {
            if (currentlyLooping)
                return;
            lastReading.time = Date.now();
            lastReading.blue.width = parseFloat(ambrosiaProgress.style.width);
            lastReading.red.width = parseFloat(redAmbrosiaProgress.style.width);

            loop();
        }

        ambrosiaTab.addEventListener("click", startLoop);
        singTabButton.addEventListener("click", startLoop);

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
