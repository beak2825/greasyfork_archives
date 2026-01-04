// ==UserScript==
// @name        * Personalzuweiser / 2/2 Save
// @namespace   bos-ernie.leitstellenspiel.de
// @version     2.6.8
// @license     BSD-3-Clause
// @author      BOS-Ernie, _fork_
// @description Weist maximal mögliche Anzahl an Personal einem Fahrzeug zu. Originalskript von BOS-Ernie, angepasst und erweitert, zur Unterstützung der neusten Lehrgänge, durch leeSalami.
// @match       https://*.leitstellenspiel.de/vehicles/*/zuweisung
// @match       https://*.leitstellenspiel.de/buildings/*
// @match       https://*.meldkamerspel.com/vehicles/*/zuweisung
// @match       https://*.meldkamerspel.com/buildings/*
// @exclude     /new$/
// @exclude     /personals$/
// @exclude     /edit$/
// @exclude     /move$/
// @require     https://update.greasyfork.org/scripts/555336/API-Speicher%20%20Save-Version.user.js
// @icon        https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @run-at      document-idle
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/555348/%2A%20Personalzuweiser%20%2022%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/555348/%2A%20Personalzuweiser%20%2022%20Save.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  // You can customize the hotkeys according to your needs. Helpful tool to find the codes: https://www.toptal.com/developers/keycode
  const ASSIGN_PERSONNEL_HOTKEY = 'KeyK';
  const RESET_PERSONNEL_HOTKEY = 'KeyL';
  const PREVIOUS_HOTKEY = 'ArrowLeft';
  const NEXT_HOTKEY = 'ArrowRight';

  const CUSTOM_VEHICLE_TRAINING = {
    150: { 'no_training': true },
  };

  let running = false;

  if (document.getElementById('personal_table')) {
    document.addEventListener('keydown', (e) => {
      if (e.code === ASSIGN_PERSONNEL_HOTKEY) {
        assign();
      } else if (e.code === RESET_PERSONNEL_HOTKEY) {
        reset();
      }
    });

    if (document.querySelector('.btn-group.pull-right:has(a[href^="/vehicles/"][href$="/zuweisung"])') !== null) {
      document.addEventListener('keydown', (e) => {
        if (e.code === PREVIOUS_HOTKEY) {
          const previousVehicleButton = getVehicleNavigationButton(1);

          if (previousVehicleButton !== null) {
            previousVehicleButton.click();
          }
        } else if (e.code === NEXT_HOTKEY) {
          const nextVehicleButton = getVehicleNavigationButton(2);

          if (nextVehicleButton !== null) {
            nextVehicleButton.click();
          }
        }
      });
    }
  } else if (document.getElementById('building-navigation-container') !== null) {
    document.addEventListener('keydown', (e) => {
      if (e.code === PREVIOUS_HOTKEY) {
        const previousBuildingButton = getBuildingNavigationButton(1);

        if (previousBuildingButton !== null) {
          previousBuildingButton.click();
        }
      } else if (e.code === NEXT_HOTKEY) {
        const nextBuildingButton = getBuildingNavigationButton(3);

        if (nextBuildingButton !== null) {
          nextBuildingButton.click();
        }
      }
    });

    return;
  } else {
    return;
  }

  updatePersonalCount();
  const csrfToken = document.querySelector('meta[name=csrf-token]')?.content;

  if (!csrfToken) {
    return;
  }

  let db;
  const loadingText = I18n.t('common.loading');
  addButtonGroup();

  async function assign() {
    if (running) {
      return;
    }

    running = true;
    const assignedPersonsElement = getAssignedPersonsElement();
    const numberOfAssignedPersonnel = parseInt(assignedPersonsElement.innerText, 10);
    const vehicleCapacity = parseInt(assignedPersonsElement.parentElement.firstElementChild.innerText, 10);

    let numberOfPersonnelToAssign = vehicleCapacity - numberOfAssignedPersonnel;
    const vehicleTypeId = await getVehicleTypeId();

    if (numberOfPersonnelToAssign > 0 && vehicleTypeId !== null) {
      db = await openDb();
      await updateVehicleTypes(db);
      const vehicleTraining = await getIdentifierByVehicleTypeId(vehicleTypeId);

      if (vehicleTraining === null) {
        await personnelAssigned();
        return;
      }

      const trainingCount = Object.keys(vehicleTraining).length;

      if (trainingCount === 0) {
        await personnelAssigned();
        return;
      }

      if (trainingCount !== 1 || !('no_training' in vehicleTraining)) {
        const rowsWithTraining = document.querySelectorAll('tbody tr:not([data-filterable-by="[]"]):has(a.btn-success):not(:has(span[data-education-key]))');
        const sortedRowsWithTraining = sortRows(rowsWithTraining);

        for (let i = 0, n = sortedRowsWithTraining.length; i < n; i++) {
          let hasIdentifier = true;
          let currentIdentifier = null;

          for (const educationIdentifier in vehicleTraining) {
            if (educationIdentifier === 'no_training') {
              continue;
            }

            const rowHasTraining = sortedRowsWithTraining[i].dataset.filterableBy.includes('"' + educationIdentifier + '"');

            if (vehicleTraining[educationIdentifier] === true && !rowHasTraining) {
              hasIdentifier = false;
            } else if (typeof vehicleTraining[educationIdentifier] === 'number') {
              if (!rowHasTraining || vehicleTraining[educationIdentifier] <= 0) {
                hasIdentifier = false;
              } else {
                hasIdentifier = true;
                currentIdentifier = educationIdentifier;
                break;
              }
            }
          }

          if (!hasIdentifier) {
            continue;
          }

          if (await changeAssignment(sortedRowsWithTraining[i].querySelector('a.btn-success'))) {
            numberOfPersonnelToAssign--;

            if (currentIdentifier) {
              vehicleTraining[currentIdentifier]--;
            }

            if (numberOfPersonnelToAssign === 0) {
              break;
            }

            await new Promise(r => setTimeout(r, 5));
          }
        }
      }
      if (numberOfPersonnelToAssign === 0) {
        await personnelAssigned();
        return;
      }

      if ('no_training' in vehicleTraining) {
        if (typeof vehicleTraining['no_training'] === 'number') {
          numberOfPersonnelToAssign = Math.min(numberOfPersonnelToAssign, vehicleTraining['no_training']);
        }

        await assignPersonsWithoutTraining(numberOfPersonnelToAssign);
      }
    }

    await personnelAssigned();
  }

  async function personnelAssigned() {
    const counterElement = document.getElementById('count_personal');
    const vehicleCapacity = parseInt(counterElement.parentElement.firstElementChild.innerText, 10);

    if (parseInt(counterElement.innerText, 10) !== vehicleCapacity) {
      if (unsafeWindow.resetIncompleteVehicles) {
        await reset();
      }
      document.dispatchEvent(new CustomEvent('personnel-assignment-incomplete'));
    } else {
      document.dispatchEvent(new CustomEvent('personnel-assignment-complete'));
    }

    document.dispatchEvent(new CustomEvent('personnel-assigned'));
    running = false;
  }

  function personnelReset() {
    document.dispatchEvent(new CustomEvent('personnel-reset'));
    running = false;
  }

  async function assignPersonsWithoutTraining(amount) {
    const rowsWithoutTraining = document.querySelectorAll('tbody tr[data-filterable-by="[]"]:has(a.btn-success):not(:has(span[data-education-key]))');
    const sortedRowsWithoutTraining = sortRows(rowsWithoutTraining);

    for (let i = 0, n = sortedRowsWithoutTraining.length; i < n; i++) {
      if (await changeAssignment(sortedRowsWithoutTraining[i].querySelector('a.btn-success'))) {
        amount--;

        if (amount === 0) {
          break;
        }

        await new Promise(r => setTimeout(r, 5));
      }
    }
  }

  async function changeAssignment(button) {
    if (button) {
      const personalId = button.getAttribute('personal_id');
      const personalElement = document.getElementById(`personal_${personalId}`);
      personalElement.innerHTML = `<td colspan="4">${loadingText}</td>`;

      try {
        const response = await fetch(button.href, {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'x-csrf-token': csrfToken,
            'x-requested-with': 'XMLHttpRequest',
          },
        });

        if (!response.ok) {
          return false;
        }

        personalElement.innerHTML = await response.text();
        updatePersonalCount();

        return true;
      } catch (e) {
        return false;
      }
    }

    return false
  }

  function updatePersonalCount() {
    const counterElement = document.getElementById('count_personal');

    if (!counterElement) {
      return;
    }

    const counter = document.querySelectorAll('.btn-assigned').length;
    const vehicleCapacity = parseInt(counterElement.parentElement.firstElementChild.innerText, 10);
    counterElement.innerText = String(counter);

    if (counter !== vehicleCapacity) {
      counterElement.classList.remove('label-success');
      counterElement.classList.add('label-warning');
    } else {
      counterElement.classList.remove('label-warning');
      counterElement.classList.add('label-success');
    }
  }

  function sortRows(rows) {
    const vehicleId = getVehicleId();

    return Array.from(rows)
      .sort((a, b) => {
        const aEducationLength = a.dataset.filterableBy.split(',').length - 1;
        const bEducationLength = b.dataset.filterableBy.split(',').length - 1;
        const aInVehicle = a.querySelector('td:nth-child(3) a')?.href?.endsWith('/' + vehicleId);
        const bInVehicle = b.querySelector('td:nth-child(3) a')?.href?.endsWith('/' + vehicleId);

        if (aEducationLength < bEducationLength) {
          return -1;
        } else if (aEducationLength > bEducationLength) {
          return 1;
        } else if ((aInVehicle === true && !bInVehicle) || (aInVehicle === undefined && bInVehicle === false)) {
          return -1;
        } else if (aInVehicle === bInVehicle) {
          return 0;
        } else {
          return 1;
        }
    });
  }

  async function reset() {
    if (running) {
      return;
    }

    running = true;
    const selectButtons = document.getElementsByClassName('btn btn-default btn-assigned');

    // Since the click event removes the button from the DOM, only every second item would be clicked.
    // To prevent this, the loop is executed backwards.
    for (let i = selectButtons.length - 1; i >= 0; i--) {
      await changeAssignment(selectButtons[i]);
      await new Promise(r => setTimeout(r, 5));
    }

    personnelReset();
  }

  function assignClickEvent(event) {
    assign();
    event.preventDefault();
  }

  function resetClickEvent(event) {
    reset();
    event.preventDefault();
  }

  function getAssignedPersonsElement() {
    return document.getElementById("count_personal");
  }

  function addButtonGroup() {
    const okIcon = document.createElement("span");
    okIcon.className = "glyphicon glyphicon-ok";

    const assignButton = document.createElement("button");
    assignButton.type = "button";
    assignButton.className = "btn btn-default";
    assignButton.id = "assign_personnel";
    assignButton.appendChild(okIcon);
    assignButton.addEventListener("click", assignClickEvent);

    const resetIcon = document.createElement("span");
    resetIcon.className = "glyphicon glyphicon-trash";

    const resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.className = "btn btn-default";
    resetButton.id = "reset_assigned_personnel";
    resetButton.appendChild(resetIcon);
    resetButton.addEventListener("click", resetClickEvent);

    const buttonGroup = document.createElement("div");
    buttonGroup.id = "vehicle-assigner-button-group";
    buttonGroup.className = "btn-group";
    buttonGroup.style.marginLeft = "5px";
    buttonGroup.appendChild(assignButton);
    buttonGroup.appendChild(resetButton);

    // Append button group to element with class "vehicles-education-filter-box"
    document.getElementsByClassName("vehicles-education-filter-box")[0].appendChild(buttonGroup);
  }

  function getVehicleId() {
    return window.location.pathname.split("/")[2];
  }

  /**
   * @return {number|null}
   */
  async function getVehicleTypeId() {
    const vehicleTypeId = document.getElementById('back_to_vehicle')?.getAttribute('vehicle_type_id');

    if (vehicleTypeId) {
      return parseInt(vehicleTypeId, 10);
    }

    const vehicleId = getVehicleId();
    try {
      const response = await fetch(`/api/v2/vehicles/${vehicleId}`);

      if (response.ok) {
        return (await response.json()).result.vehicle_type;
      }
    } catch (e) {
      return null;
    }

    return null;
  }

  function getVehicleNavigationButton(number) {
    return document.querySelector('.btn-group.pull-right:has(a[href^="/vehicles/"][href$="/zuweisung"]) > a[href^="/vehicles/"][href$="/zuweisung"]:nth-child(' + number + ')')
  }

  function getBuildingNavigationButton(number) {
    return document.querySelector('#building-navigation-container:has(a[href^="/buildings/"]) > a[href^="/buildings/"]:nth-child(' + number + ')')
  }

  /**
   * @return {{}|null}
   */
  async function getIdentifierByVehicleTypeId(vehicleTypeId, allowTrailer = false, maxPersonnel = null) {
    if (vehicleTypeId in CUSTOM_VEHICLE_TRAINING) {
      return CUSTOM_VEHICLE_TRAINING[vehicleTypeId];
    }

    const vehicle = await getData(db, 'vehicleTypes', vehicleTypeId);

    if (!vehicle || (allowTrailer === false && vehicle['isTrailer'] === true)) {
      return null;
    }

    if (maxPersonnel === null) {
      maxPersonnel = vehicle['maxPersonnel'];
    }

    if (!('training' in vehicle['staff'])) {
      const vehicles = await getAllData(db, 'vehicleTypes');
      for (const vehicleId in vehicles) {
        if ('tractiveVehicles' in vehicles[vehicleId] && vehicles[vehicleId]['tractiveVehicles'].includes(vehicleTypeId) && 'training' in vehicles[vehicleId]['staff'] && vehicles[vehicleId]['tractiveVehicles'].length <= 5) {
          return getIdentifierByVehicleTypeId(parseInt(vehicleId, 10), true, maxPersonnel);
        }
      }

      return { 'no_training': true };
    }

    const trainings = vehicle['staff']['training'][Object.keys(vehicle['staff']['training'])[0]];
    const trainingKeys = Object.keys(trainings);
    const trainingsCount = trainingKeys.length;
    let training = {};
    let personnelToTrain = 0;
    let trainingAtScene = 0;
    let isHelicopter = trainingKeys.some(key => key.includes('helicopter'));

    if ('trainingAtScene' in vehicle['staff']) {
      trainingAtScene = vehicle['staff']['trainingAtScene'];
    }

    for (let i = 0; i < trainingsCount; i++) {
      let trainingCount = trainingAtScene;

      if (trainingCount >= maxPersonnel || isHelicopter) {
        trainingCount = true;
      } else if (trainingCount === 0) {
        trainingCount = trainings[trainingKeys[i]][Object.keys(trainings[trainingKeys[i]])[0]];
      }

      if (trainingCount !== true && trainingsCount === 1 && trainingCount < maxPersonnel && trainingKeys[i] !== 'notarzt') {
        trainingCount = true;
      }

      if (trainingCount === true) {
        personnelToTrain = maxPersonnel;
      } else {
        personnelToTrain += trainingCount;
      }

      training[trainingKeys[i]] = trainingCount;
    }

    if (personnelToTrain !== maxPersonnel) {
      training['no_training'] = maxPersonnel - personnelToTrain;
    }

    return training;
  }

  document.dispatchEvent(new CustomEvent('personnel-init'));
  unsafeWindow.personnelInit = true;
})();
