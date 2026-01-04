// ==UserScript==
// @name         Lehrgangszuweiser - Erweitert (mit Wachenfilter)
// @namespace    bos-ernie.leitstellenspiel.de
// @version      2.5.0
// @license      BSD-3-Clause
// @author       BOS-Ernie & Masklin & Hendrik & Gemini
// @description  Fügt Buttons hinzu, um Personen einer Wache auf einmal einem Lehrgang zuzuweisen. Erweitert um automatische Zuweisung basierend auf Mindestanzahl, Vorkenntnissen und Wachennamen/-nummer.
// @match        https://www.leitstellenspiel.de/buildings/*
// @match        https://polizei.leitstellenspiel.de/buildings/*
// @match        https://www.leitstellenspiel.de/schoolings/*
// @match        https://polizei.leitstellenspiel.de/schoolings/*
// @match        https://www.meldkamerspel.com/buildings/*
// @match        https://politie.meldkamerspel.com/buildings/*
// @match        https://www.meldkamerspel.com/schoolings/*
// @match        https://politie.meldkamerspel.com/schoolings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550682/Lehrgangszuweiser%20-%20Erweitert%20%28mit%20Wachenfilter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550682/Lehrgangszuweiser%20-%20Erweitert%20%28mit%20Wachenfilter%29.meta.js
// ==/UserScript==

/* global loadedBuildings, schooling_disable, update_schooling_free, update_costs, $ */

(function () {
    let isAutoAssignmentRunning = false;

    function injectModernStyles() {
        if (document.getElementById('lehrgangszuweiser-modern-styles')) return;

        const css = `
            /* Modernes Redesign für den Lehrgangszuweiser Darkmode */

            /* Haupt-Container für die automatische Zuweisung */
            body.dark #autoAssignContainer {
                background: linear-gradient(to bottom, #3a4a5a, #2c3a4a) !important;
                border: 1px solid #556677 !important;
                border-radius: 8px !important;
                padding: 15px !important;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.05);
            }
            body.dark #autoAssignContainer label {
                color: #e1e8ed !important;
                font-weight: normal !important;
                text-shadow: 0 1px 1px rgba(0,0,0,0.5);
            }
            body.dark #autoAssignContainer .form-control {
                 background-color: rgba(0, 0, 0, 0.25) !important;
                 border: 1px solid #556677 !important;
                 border-radius: 6px !important;
                 color: #e1e8ed !important;
                 transition: all 0.2s ease !important;
            }
            body.dark #autoAssignContainer .form-control:focus {
                border-color: #00bcd4 !important;
                box-shadow: 0 0 8px rgba(0, 188, 212, 0.5) !important;
            }
            body.dark #autoAssignContainer .form-control option {
                background: #2c3a4a !important;
                color: #e1e8ed !important;
            }
            body.dark #autoAssignContainer select option:checked,
            body.dark #autoAssignContainer select option:hover {
                background: linear-gradient(45deg, #00A8C5, #007A8F) !important;
                color: #ffffff !important;
            }
            body.dark .schooling-personnel-select-button,
            body.dark .schooling-personnel-reset-button {
                background: #40454a !important;
                color: #b0b8c0 !important;
                border: none !important;
                border-radius: 4px !important;
                transition: all 0.2s ease-in-out !important;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                margin: 0 1px !important;
            }
            body.dark .schooling-personnel-select-button:hover,
            body.dark .schooling-personnel-reset-button:hover {
                color: #ffffff !important;
                background: linear-gradient(45deg, #00bcd4, #0096a9) !important;
                transform: translateY(-2px) scale(1.05);
                box-shadow: 0 4px 10px rgba(0, 188, 212, 0.3);
            }
             body.dark #applyMinPersonnel.btn-primary {
                 background: linear-gradient(45deg, #00A8C5, #007A8F) !important;
                 border: none !important;
                 border-radius: 6px !important;
                 transition: all 0.2s ease-in-out !important;
                 box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            }
            body.dark #applyMinPersonnel.btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 10px rgba(0, 168, 197, 0.4);
            }
        `;
        const style = document.createElement('style');
        style.id = 'lehrgangszuweiser-modern-styles';
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function updateFreeCounterDisplay(newValue) {
        const freeCounterElement = $("#schooling_free");
        freeCounterElement.text(newValue);

        if (newValue >= 0) {
            freeCounterElement.removeClass('label-danger').addClass('label-success');
        } else {
            freeCounterElement.removeClass('label-success').addClass('label-danger');
        }
    }

    function getTargetEducationKey() {
        const educationSelect = document.getElementById('education_select');
        if (!educationSelect || !educationSelect.value) {
            const radio = $("input[name=education]:checked");
            return radio.length > 0 ? radio.attr("education_key") : null;
        }
        return educationSelect.value.split(':')[0];
    }

    function renderPersonnelSelectors() {
        let elements = document.getElementsByClassName("panel-heading personal-select-heading");
        for (let i = 0; i < elements.length; i++) {
            let buildingId = elements[i].getAttribute("building_id");
            if (buildingId && !elements[i].querySelector(`#schooling-assigner-${buildingId}`)) {
                elements[i].children[0].appendChild(createPersonnelSelector(buildingId));
            }
        }
        $(".personal-select-heading").off("click", panelHeadingClickEvent).on("click", panelHeadingClickEvent);
    }

    function createPersonnelSelector(buildingId) {
        let buttonGroup = document.createElement("div");
        buttonGroup.id = `schooling-assigner-${buildingId}`;
        buttonGroup.className = "btn-group btn-group-xs";
        buttonGroup.style.marginLeft = "10px";

        let resetButton = document.createElement("button");
        resetButton.type = "button";
        resetButton.className = "btn btn-default btn-sm schooling-personnel-reset-button";
        resetButton.innerHTML = `<span class="glyphicon glyphicon-trash" data-building-id="${buildingId}"></span>`;
        resetButton.addEventListener("click", resetPersonnelClick);
        buttonGroup.appendChild(resetButton);

        [...Array(10).keys()].map(i => i + 1).forEach(capacity => {
            let button = document.createElement("button");
            button.type = "button";
            button.className = "btn btn-default btn-sm schooling-personnel-select-button";
            button.dataset.buildingId = buildingId;
            button.dataset.capacity = capacity;
            button.textContent = capacity;
            button.addEventListener("click", selectPersonnelClick);
            buttonGroup.appendChild(button);
        });
        return buttonGroup;
    }

    async function ensurePanelLoadedAndReady(buildingId) {
        const panelHeading = document.querySelector(`.personal-select-heading[building_id='${buildingId}']`);
        const panelBody = document.querySelector(`.panel-body[building_id='${buildingId}']`);
        if (!panelHeading || !panelBody) return;

        const href = panelHeading.getAttribute('href');
        if (!href) return;

        if (typeof window.loadedBuildings === 'undefined') window.loadedBuildings = [];
        if (!window.loadedBuildings.includes(href) || panelBody.innerHTML.trim() === "") {
            if (!window.loadedBuildings.includes(href)) {
                window.loadedBuildings.push(href);
            }
            await $.get(href, (data) => {
                $(panelBody).html(data);
                const educationKey = getTargetEducationKey();
                if (educationKey) {
                    if (typeof schooling_disable === 'function') schooling_disable(educationKey);
                    if (typeof update_schooling_free === 'function') update_schooling_free();
                }
            });
        }
    }

    async function selectPersonnel(buildingId, capacity, requiredEducationKey = 'none', targetEducationKey = null) {
        await ensurePanelLoadedAndReady(buildingId);
        let free = parseInt($("#schooling_free").text() || '0', 10);
        let assignedInThisRun = 0;

        for (const checkbox of $(`.schooling_checkbox[building_id='${buildingId}']`).get()) {
            // Die Prüfung "|| free <= 0" wurde hier entfernt
            if (assignedInThisRun >= capacity) break;
            const $checkbox = $(checkbox);
            if ($checkbox.is(":checked") || $checkbox.is(":disabled")) continue;

            if (targetEducationKey && $checkbox.attr(targetEducationKey) === 'true') {
                continue;
            }

            let shouldSelect = false;
            if (requiredEducationKey === 'none') {
                const educationCell = $(`#school_personal_education_${$checkbox.val()}`);
                const vehicleCell = educationCell.next();
                if (educationCell.text().trim() === "" && vehicleCell.text().trim() === "") {
                    shouldSelect = true;
                }
            } else {
                if ($checkbox.attr(requiredEducationKey) === 'true') {
                    shouldSelect = true;
                }
            }
            if (shouldSelect) {
                $checkbox.prop("checked", true);
                free--;
                assignedInThisRun++;
            }
        }
        // Ruft die neue Hilfsfunktion für die Zähler-Anzeige auf
        updateFreeCounterDisplay(free);
        if (typeof update_costs === 'function') update_costs();
        updateSelectionCounter(buildingId);
    }

    async function resetPersonnel(buildingId) {
        await ensurePanelLoadedAndReady(buildingId);
        let free = parseInt($("#schooling_free").text() || '0', 10);
        $(`.schooling_checkbox[building_id='${buildingId}']:checked`).each(function () {
            $(this).prop("checked", false);
            free++;
        });
        // Ruft die neue Hilfsfunktion für die Zähler-Anzeige auf
        updateFreeCounterDisplay(free);
        if (typeof update_costs === 'function') update_costs();
        updateSelectionCounter(buildingId);
    }
    async function selectPersonnelClick(event) {
        event.preventDefault();
        event.stopPropagation();
        await selectPersonnel(event.target.dataset.buildingId, event.target.dataset.capacity, 'none');
    }
    async function resetPersonnelClick(event) {
        event.preventDefault();
        event.stopPropagation();
        await resetPersonnel(event.target.dataset.buildingId);
    }
    async function panelHeadingClickEvent(event) {
        if ($(event.target).closest(".schooling-personnel-select-button, .schooling-personnel-reset-button, #autoAssignContainer").length > 0) {
            event.stopPropagation();
            return;
        }
        let buildingId = $(event.target).closest('.panel-heading').attr('building_id');
        if (buildingId && $(event.target).closest('.panel-heading').next('.panel-body').is(':hidden')) {
            await ensurePanelLoadedAndReady(buildingId);
        }
    }

    function addAutoAssignControls() {
        if (document.getElementById('autoAssignContainer')) return;
        const targetHeader = Array.from(document.querySelectorAll('h3')).find(h3 => h3.textContent.trim() === "Personal auswählen");
        if (!targetHeader) return;

        const originalDropdown = document.getElementById('education_select');
        if (!originalDropdown) return;

        let inputContainer = document.createElement('div');
        inputContainer.id = 'autoAssignContainer';
        inputContainer.style.cssText = 'margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; display: flex; flex-wrap: wrap; align-items: center; gap: 10px;';

        let customDropdownHTML = `<select id="requiredEducationSelect" class="form-control" style="width: auto;">
                                    <option value="none">Ohne andere Ausbildung</option>`;
        for (let i = 1; i < originalDropdown.options.length; i++) {
            const option = originalDropdown.options[i];
            const educationKey = option.value.split(':')[0];
            const educationName = option.text.replace(/\s\(\d+\sTage\)/, '');
            if (educationKey) {
                customDropdownHTML += `<option value="${educationKey}">${educationName}</option>`;
            }
        }
        customDropdownHTML += `</select>`;

        // NEU: Hinzufügen der Filterfelder zum HTML des Containers
        inputContainer.innerHTML = `
            <label for="minPersonnelPerBuilding" style="font-weight: bold; margin: 0;">Anzahl Personal:</label>
            <input type="number" id="minPersonnelPerBuilding" min="0" value="0" class="form-control" style="width: 80px;" title="Wie viele Personen sollen pro Wache zugewiesen werden?">
            <label for="requiredEducationSelect" style="font-weight: bold; margin: 0 0 0 10px;">Voraussetzung:</label>
            ${customDropdownHTML}
            <div style="width: 100%; height: 10px;"></div>
            <label for="stationNameFilter" style="font-weight: bold; margin: 0;">Wachenfilter (Text):</label>
            <input type="text" id="stationNameFilter" class="form-control" placeholder="z.B. Feuerwache Hamburg" style="width: 200px;" title="Nur Wachen berücksichtigen, deren Name so beginnt.">
            <label for="stationNumberFilter" style="font-weight: bold; margin: 0 0 0 10px;">Min. Nummer:</label>
            <input type="number" id="stationNumberFilter" class="form-control" min="0" placeholder="z.B. 161" style="width: 100px;" title="Nur Wachen mit dieser oder einer höheren Nummer berücksichtigen.">
            <button id="applyMinPersonnel" class="btn btn-primary btn-sm" style="margin-left: auto;">Automatisch zuweisen</button>
        `;
        targetHeader.parentNode.insertBefore(inputContainer, targetHeader.nextSibling);
        document.getElementById('applyMinPersonnel').addEventListener('click', autoAssignPersonnel);
    }

    async function loadAllBuildingsByScrolling() {
        console.log("Starte iteratives Scrollen, um alle Wachen zu laden...");
        const scrollableElement = document.documentElement;
        let noProgressCounter = 0;
        const maxNoProgressAttempts = 10;
        const scrollAmountPerStep = window.innerHeight * 0.8;

        while (noProgressCounter < maxNoProgressAttempts) {
            const previousBuildingCount = document.getElementsByClassName("panel-heading personal-select-heading").length;
            const lastScrollTop = scrollableElement.scrollTop;
            scrollableElement.scrollTop += scrollAmountPerStep;
            await sleep(800);
            const currentBuildingCount = document.getElementsByClassName("panel-heading personal-select-heading").length;
            if (currentBuildingCount > previousBuildingCount || scrollableElement.scrollTop > lastScrollTop) {
                noProgressCounter = 0;
            } else {
                noProgressCounter++;
            }
            if (scrollableElement.scrollTop + scrollableElement.clientHeight >= scrollableElement.scrollHeight - 10) {
                 if (noProgressCounter > 3) {
                     console.log("Ende der Seite erreicht.");
                     break;
                 }
            }
        }
        console.log("Laden der Wachen abgeschlossen.");
        window.scrollTo(0, 0);
    }

    function countSelectedPersonnel(buildingId) {
        return $(`.schooling_checkbox[building_id='${buildingId}']:checked`).length;
    }

    async function autoAssignPersonnel(event) {
        event.preventDefault();
        if (isAutoAssignmentRunning) return;
        isAutoAssignmentRunning = true;

        const userInputNumber = parseInt($("#minPersonnelPerBuilding").val(), 10);
        const requiredEducationKey = $("#requiredEducationSelect").val();
        const targetEducationKey = getTargetEducationKey();
        const button = $(event.target);

        // NEU: Werte aus den neuen Filterfeldern auslesen
        const stationNameFilter = $("#stationNameFilter").val().trim().toLowerCase();
        const stationNumberFilter = parseInt($("#stationNumberFilter").val(), 10);


        if (!targetEducationKey) {
            alert("Bitte zuerst einen Lehrgang auswählen.");
            isAutoAssignmentRunning = false;
            return;
        }

        if (isNaN(userInputNumber) || userInputNumber < 0) {
            alert("Bitte geben Sie eine gültige positive Zahl für 'Anzahl Personal' ein.");
            isAutoAssignmentRunning = false;
            return;
        }
        if (userInputNumber === 0) {
            alert("Anzahl ist 0. Es wird kein Personal zugewiesen.");
            isAutoAssignmentRunning = false;
            return;
        }

        const originalButtonText = button.text();
        button.text("Lade Wachen...").prop('disabled', true);
        await loadAllBuildingsByScrolling();
        button.text("Weise zu...");

        let totalAssignedInRun = 0;
        const visiblePanelHeadings = $(".panel-heading.personal-select-heading:visible").get();

        for (const panelHeading of visiblePanelHeadings) {
            let schoolingFree = parseInt($("#schooling_free").text() || '0', 10);
            if (schoolingFree <= 0) break;

            const $panelHeading = $(panelHeading);
            const buildingId = $panelHeading.attr("building_id");

            // NEU: Filterlogik für Wachenname und -nummer
            const buildingSearchName = $panelHeading.closest('.building_list').attr('search_attribute') || '';
            const nameMatch = buildingSearchName.match(/(.*?)\s*(\d+)$/);
            const buildingName = (nameMatch ? nameMatch[1].trim() : buildingSearchName).toLowerCase();
            const buildingNumber = nameMatch ? parseInt(nameMatch[2], 10) : 0;

            if (stationNameFilter && !buildingName.startsWith(stationNameFilter)) {
                continue; // Überspringe, wenn der Name nicht passt
            }
            if (!isNaN(stationNumberFilter) && buildingNumber < stationNumberFilter) {
                continue; // Überspringe, wenn die Nummer zu klein ist
            }
            // Ende der Filterlogik

            const alreadySelected = countSelectedPersonnel(buildingId);
            let neededForThisBuilding = 0;

            if (requiredEducationKey === 'none') {
                const getCountFromLabel = (selector) => {
                    const text = $panelHeading.find(selector).text();
                    const match = text.match(/\d+/);
                    return match ? parseInt(match[0], 10) : 0;
                };
                const trainedCount = getCountFromLabel(".label-success");
                const trainingCount = getCountFromLabel(".label-info");
                const effectivePersonnel = trainedCount + trainingCount + alreadySelected;

                if (effectivePersonnel < userInputNumber) {
                    neededForThisBuilding = userInputNumber - effectivePersonnel;
                }
            } else {
                await ensurePanelLoadedAndReady(buildingId);
                const availablePersonnelCheckboxes = $(`.schooling_checkbox[building_id='${buildingId}'][${requiredEducationKey}='true']`)
                                                         .not(`[${targetEducationKey}='true']`)
                                                         .not(':checked').not(':disabled');

                const availableWithPrereq = availablePersonnelCheckboxes.length;
                neededForThisBuilding = Math.min(availableWithPrereq, userInputNumber);
            }

            if (neededForThisBuilding > 0) {
                const assignableCount = Math.min(neededForThisBuilding, schoolingFree);
                await selectPersonnel(buildingId, assignableCount, requiredEducationKey, targetEducationKey);
                totalAssignedInRun += (countSelectedPersonnel(buildingId) - alreadySelected);
            }
        }

        alert(`Automatische Zuweisung abgeschlossen. ${totalAssignedInRun} Personen wurden neu zugewiesen.`);
        button.text(originalButtonText).prop('disabled', false);
        isAutoAssignmentRunning = false;
    }

    function updateSelectionCounter(buildingId) {
        const element_id = `personnel-selection-counter-${buildingId}`;
        let counterSpan = $(`#${element_id}`);
        if (counterSpan.length === 0) {
            counterSpan = $("<span>", { id: element_id, class: "label label-primary", style: "margin-left: 5px;" });
            $(`#schooling-assigner-${buildingId}`).parent().prepend(counterSpan);
        }
        counterSpan.text(`${countSelectedPersonnel(buildingId)} ausgewählt`);
    }

    const initScript = () => {
        injectModernStyles();
        const targetHeader = Array.from(document.querySelectorAll('h3')).find(h3 => h3.textContent.trim() === "Personal auswählen");
        if (!targetHeader) return;

        if (!document.getElementById('autoAssignContainer')) {
            addAutoAssignControls();
        }
        const buildingPanels = document.getElementsByClassName("panel-heading personal-select-heading");
        if (buildingPanels.length > 0 && !buildingPanels[0].querySelector('.schooling-personnel-reset-button')) {
            renderPersonnelSelectors();
        }
    };

    const observer = new MutationObserver(initScript);
    observer.observe(document.body, { childList: true, subtree: true });

    initScript();
})();