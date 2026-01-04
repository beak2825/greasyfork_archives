// ==UserScript==
// @name            Freigaben anfahren / Save-Version
// @version         1.4.1
// @license         All Rights Reserved
// @author          NoOneq
// @namespace       NoOne
// @description     Automatisches Alarmieren von Verbandseinsätzen mit konfigurierbaren Fahrzeugtypen und Leitstellen-Ausschlüssen
// @require         https://update.greasyfork.org/scripts/555336/API-Speicher%20%20Save-Version.user.js
// @require         https://update.greasyfork.org/scripts/555340/Skripteinstellungen%20%20Save-Version.user.js
// @match           https://*.leitstellenspiel.de
// @match           https://*.leitstellenspiel.de/settings/index*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @icon            https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/555343/Freigaben%20anfahren%20%20Save-Version.user.js
// @updateURL https://update.greasyfork.org/scripts/555343/Freigaben%20anfahren%20%20Save-Version.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  const EXCLUDED_DISPATCH_CENTERS_STORAGE_KEY = 'excluded_dispatch_centers';
  const EXCLUDED_DISPATCH_CENTERS_ALTERNATIVE_STORAGE_KEY = 'excluded_dispatch_centers_alternative';
  const ALLOWED_VEHICLE_TYPE_IDS_STORAGE_KEY = 'included_vehicle_type_ids';
  const ALLOWED_VEHICLE_TYPE_IDS_GUARD_MISSIONS_STORAGE_KEY = 'included_vehicle_type_ids_guard_missions';
  const ALLOWED_VEHICLE_TYPE_IDS_AWARD_MISSIONS_STORAGE_KEY = 'included_vehicle_type_ids_award_missions';
  const ALARM_DELAY_STORAGE_KEY = 'alarm_delay';
  const ALARM_DELAY_DEFAULT = 3500;

  if (location.pathname.startsWith('/settings/index')) {
    await addOptions({
      'identifier': 'check_freigaben_anfahren',
      'title': 'Check Freigaben anfahren',
      'settings': [
        {
          'type': 'header',
          'text': 'Allgemeine Einstellungen'
        },
        {
          'type': 'select',
          'selectType': 'vehicle_types',
          'key': ALLOWED_VEHICLE_TYPE_IDS_STORAGE_KEY,
          'label': 'Erlaubte Fahrzeugtypen',
          'title': 'Fahrzeuge',
          'multiple': true
        },
        {
          'type': 'number',
          'key': ALARM_DELAY_STORAGE_KEY,
          'label': 'Verzögerung mit der die Einsätze geladen werden (Angabe in ms)',
          'min': 0,
          'default': ALARM_DELAY_DEFAULT
        },
        {
          'type': 'select',
          'selectType': 'dispatch_centers',
          'key': EXCLUDED_DISPATCH_CENTERS_STORAGE_KEY,
          'label': 'Leitstellen von denen keine Fahrzeuge geschickt werden dürfen',
          'title': 'Leitstellen',
          'multiple': true
        },
        {
          'type': 'text',
          'selectType': 'dispatch_centers',
          'key': EXCLUDED_DISPATCH_CENTERS_ALTERNATIVE_STORAGE_KEY,
          'label': 'Leitstellen von denen keine Fahrzeuge geschickt werden dürfen (Alternative für Spieler mit vielen Gebäuden, falls die Leitstellen im Dropdown nicht mehr laden)',
          'placeholder': 'Leitstellen-IDs',
          'info': 'Leitstelle-IDs kommagetrennt, z.B.: 1234567890, 9876543210'
        },
        {
          'type': 'header',
          'text': 'Geplante Einsätze (optional)'
        },
        {
          'type': 'select',
          'selectType': 'vehicle_types',
          'key': ALLOWED_VEHICLE_TYPE_IDS_GUARD_MISSIONS_STORAGE_KEY,
          'label': 'Erlaubte Fahrzeugtypen für geplante Einsätze. Es werden die Fahrzeuge der allgemeinen Einstellungen verwendet, wenn nichts ausgewählt wurde.',
          'title': 'Fahrzeuge',
          'multiple': true
        },
        {
          'type': 'header',
          'text': 'Einsätze für Auszeichnungen (optional)'
        },
        {
          'type': 'select',
          'selectType': 'vehicle_types',
          'key': ALLOWED_VEHICLE_TYPE_IDS_AWARD_MISSIONS_STORAGE_KEY,
          'label': 'Erlaubte Fahrzeugtypen für Einsätze mit Auszeichnungen (Winter, Frühling, Weihnachten usw.). Es werden die Fahrzeuge der allgemeinen Einstellungen verwendet, wenn nichts ausgewählt wurde.',
          'title': 'Fahrzeuge',
          'multiple': true
        }
      ]
    });
    return;
  }

  const csrfToken = document.querySelector('meta[name=csrf-token]').content;
  let allowedVehicleTypeIds = [];
  let allowedGuardMissionVehicleTypeIds = [];
  let allowedAwardMissionVehicleTypeIds = [];
  let excludedDispatchCenters = [];
  let missionTimeouts = [];
  let hasExcludedDispatchCenters = false;
  let running = false;
  let aborted = false;
  let handledMissionCount = 0;
  let missionCount = 0;
  let tableBody = null;
  let goButton;
  let missionCountLabel;
  let alreadyFoundCars;
  let missions;
  let missionTable;

  createElements();

  function createElements() {
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group';

    const button = document.createElement('a');
    button.className = 'btn btn-xs btn-default';
    button.id = 'showMissionRequests';
    button.dataset.toggle = 'modal';
    button.dataset.target = '#bsShowMissions';
    button.innerText = '🚒';
    button.title = 'Verbandseinsätze anfahren';
    button.style.marginLeft = '5px';
    button.addEventListener('click', bsDoWork);
    buttonGroup.appendChild(button);

    const anchorSettings = document.createElement('a');
    anchorSettings.className = 'btn btn-default btn-xs';
    anchorSettings.href = '/settings/index#check_freigaben_anfahren';
    anchorSettings.target = '_blank';

    const spanSettings = document.createElement('span');
    spanSettings.className = 'glyphicon glyphicon-cog';
    spanSettings.title = 'Einstellungen';
    anchorSettings.appendChild(spanSettings);
    buttonGroup.appendChild(anchorSettings);

    document.getElementById('missions-panel-main').querySelector(':scope > div:last-of-type').insertAdjacentElement('beforebegin', buttonGroup);

    const modal = document.createElement('div');
    modal.id = 'bsShowMissions';
    modal.className = 'modal fade';
    modal.role = 'dialog';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'bsModalLabel');
    modal.innerHTML = `
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="bsModalLabel">Einsätze anfahren</h5>
          <a class="btn btn-default btn-xs" id="bs_alarm_go">Go</a>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" id="bsBody"></div>
        <div class="modal-footer">
          <button type="button" id="abort-check-missions" class="btn btn-default" data-dismiss="modal">Abbrechen</button>
          <button type="button" class="btn btn-default" data-dismiss="modal">Schließen</button>
        </div>
      </div>
    </div>`;
    document.body.appendChild(modal);
    missionTable = createMissionTable();
    goButton = document.getElementById('bs_alarm_go');
    missionCountLabel = document.getElementById('bsModalLabel');
    document.getElementById('showMissionRequests').addEventListener('click', bsDoWork);
    goButton.addEventListener('click', letsStart);
    document.getElementById('abort-check-missions').addEventListener('click', abortAlarming);
  }

  function abortAlarming() {
    if (aborted) {
      return;
    }

    aborted = true;

    for (let i = 0, n = missionTimeouts.length; i < n; i++) {
      clearTimeout(missionTimeouts[i]);
    }

    handledMissionCount = missionCount;
    checkAlarmingStatus();
    tableBody?.remove();
  }

  function checkAlarmingStatus() {
    missionCountLabel.innerText = `${Math.max(missionCount - handledMissionCount, 0)} Einsätze anfahren`;

    if (missionCount !== handledMissionCount) {
      return;
    }

    alreadyFoundCars = [];
    missions = [];
    running = false;
    missionCount = 0;
    handledMissionCount = 0;
    goButton.disabled = false;
    goButton.classList.remove('disabled');
  }

  async function letsStart(event) {
    event.preventDefault();
    const currentTarget = event.currentTarget;
    currentTarget.disabled = true;
    currentTarget.classList.add('disabled');
    running = true;
    aborted = false;
    alreadyFoundCars = [];
    let key = 0;

    const alarmDelay = await GM.getValue(ALARM_DELAY_STORAGE_KEY, ALARM_DELAY_DEFAULT);
    allowedVehicleTypeIds = JSON.parse(await GM.getValue(ALLOWED_VEHICLE_TYPE_IDS_STORAGE_KEY, '[]'));
    allowedGuardMissionVehicleTypeIds = JSON.parse(await GM.getValue(ALLOWED_VEHICLE_TYPE_IDS_GUARD_MISSIONS_STORAGE_KEY, '[]'));
    allowedAwardMissionVehicleTypeIds = JSON.parse(await GM.getValue(ALLOWED_VEHICLE_TYPE_IDS_AWARD_MISSIONS_STORAGE_KEY, '[]'));
    excludedDispatchCenters = JSON.parse(await GM.getValue(EXCLUDED_DISPATCH_CENTERS_STORAGE_KEY, '[]'));
    const excludedDispatchCentersAlternative = await GM.getValue(EXCLUDED_DISPATCH_CENTERS_ALTERNATIVE_STORAGE_KEY, '');

    if (allowedGuardMissionVehicleTypeIds.length === 0) {
      allowedGuardMissionVehicleTypeIds = allowedVehicleTypeIds;
    }

    if (allowedAwardMissionVehicleTypeIds.length === 0) {
      allowedAwardMissionVehicleTypeIds = allowedVehicleTypeIds;
    }

    if (excludedDispatchCentersAlternative !== '') {
      const dispatchCenterIdsAlternative = [];
      const regex = /(\d+)(?:,|)/g;
      const matches = excludedDispatchCentersAlternative.matchAll(regex);

      for (const match of matches) {
        dispatchCenterIdsAlternative.push(parseInt(match[1], 10));
      }

      if (dispatchCenterIdsAlternative.length > 0) {
        excludedDispatchCenters = dispatchCenterIdsAlternative;
      }
    }

    hasExcludedDispatchCenters = excludedDispatchCenters.length > 0;
    missionCount = missions.length;
    handledMissionCount = 0;
    missionTimeouts = [];

    for (let i = 0; i < missionCount; i++) {
      const missionId = missions[i].id;

      missionTimeouts.push(setTimeout(async () => {
        const bsAlarmButton = document.getElementById(`bs_alarm_button_${missionId}`);
        bsAlarmButton.innerText = '⏳';
        bsAlarmButton.title = 'Lade...';

        const response = await fetch(`/missions/${missionId}`);

        if (!running) {
          abortAlarming();
          return;
        }

        if (response.status >= 400) {
          bsAlarmButton.innerText = '🛑';
          bsAlarmButton.title = 'Fehler beim Laden des Einsatzes!';
          handledMissionCount++;
          checkAlarmingStatus();
          return;
        }

        const responseText = await response.text();

        if (responseText.includes('Der Einsatz wurde erfolgreich abgeschlossen.')) {
          bsAlarmButton.parentElement.parentElement.remove();
          handledMissionCount++;
          checkAlarmingStatus();
          return;
        }

        const parser = new DOMParser()
        const doc = parser.parseFromString(responseText, 'text/html');

        if (doc.getElementById('mission_vehicle_at_mission')?.querySelector(`td > a[href="/profile/${user_id}"]`) || doc.getElementById('mission_vehicle_driving')?.querySelector(`tr:has(td > a[href="/profile/${user_id}"]):not(:has(.building_list_fms_4))`)) {
          bsAlarmButton.parentElement.parentElement.remove();
          handledMissionCount++;
          checkAlarmingStatus();
          return;
        }

        await selectVehicle(doc, missionId, bsAlarmButton, missions[i].guardMission);
        handledMissionCount++;
        checkAlarmingStatus();
      }, key * alarmDelay));
      key++;
    }
  }

  async function selectVehicle(doc, missionId, bsAlarmButton, guardMission, additional = 0) {
    const vehicleCheckboxes = doc.querySelectorAll('.vehicle_checkbox');
    let missionAllowedVehicleTypeIds = allowedVehicleTypeIds;

    if (guardMission === 1) {
      missionAllowedVehicleTypeIds = allowedGuardMissionVehicleTypeIds;
    } else if (doc.querySelector('.missionAward') !== null) {
      missionAllowedVehicleTypeIds = allowedAwardMissionVehicleTypeIds;
    }

    for (let i = 0, n = vehicleCheckboxes.length; i < n; i++) {
      const vehicleTypeId = parseInt(vehicleCheckboxes[i].getAttribute('vehicle_type_id'), 10);
      const vehicleId = vehicleCheckboxes[i].getAttribute('value');
      const buildingId = vehicleCheckboxes[i].getAttribute('building_id');
      let dispatchCenterId = null;

      if (buildingId.includes('_')) {
        dispatchCenterId = parseInt(buildingId.replace(/\d+_(\d+)$/, '$1'), 10);
      }

      if (missionAllowedVehicleTypeIds.includes(vehicleTypeId) && !alreadyFoundCars.includes(vehicleId) && (!hasExcludedDispatchCenters || !excludedDispatchCenters.includes(dispatchCenterId))) {
        bsAlarmButton.innerText = '🔔';
        bsAlarmButton.title = 'Alarmiere...';
        alreadyFoundCars.push(vehicleId);
        const form = new FormData();
        form.set('utf8', '✓');
        form.set('authenticity_token', csrfToken);
        form.set('next_mission', '0');
        form.set('next_mission_id', '0');
        form.set('alliance_mission_publish', '0');
        form.set('vehicle_ids[]', vehicleId);

        if (!running) {
          abortAlarming();
          return;
        }

        const response = await fetch(`/missions/${missionId}/alarm`, {
          method: 'POST',
          body: new URLSearchParams(form),
          redirect: 'manual',
        });

        if (response.status >= 400) {
          bsAlarmButton.innerText = '🛑';
          bsAlarmButton.title = 'Fehler beim Alarmieren!';
          return;
        } else {
          bsAlarmButton.parentElement.parentElement.remove();
          return;
        }
      }
    }

    if (additional < 1) {
      const response = await fetch(`/missions/${missionId}/missing_vehicles`);

      if (response.status >= 400) {
        bsAlarmButton.innerText = '🛑';
        bsAlarmButton.title = 'Fahrzeuge konnten nicht nachgeladen werden!';
        return;
      }

      const responseText = await response.text();
      const parser = new DOMParser()
      const additionalDoc = parser.parseFromString(responseText, 'text/html');
      additional++;

      return await selectVehicle(additionalDoc, missionId, bsAlarmButton, guardMission, additional)
    } else {
      bsAlarmButton.innerText = '⚠️';
      bsAlarmButton.title = 'Kein passendes Fahrzeug gefunden';
    }
  }

  function createMissionTable() {
    const headers = [
      'Bezeichnung',
      'Adresse',
      ''
    ];

    const table = document.createElement('table');
    table.id = 'bsTable';
    table.className = 'table table-striped';

    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    thead.append(trHead);

    for (let i = 0, n = headers.length; i < n; i++) {
      const th = document.createElement('th');
      th.innerText = headers[i];
      trHead.append(th);
    }

    table.append(thead);
    document.getElementById('bsBody').append(table);

    return table;
  }

  function populateMissionTable() {
    tableBody?.remove();
    tableBody = document.createElement('tbody');
    tableBody.id = 'bsTableBody';

    for (let i = 0, n = missions.length; i < n; i++) {
      const tr = document.createElement('tr');
      tr.id = `bsMission_${missions[i].id}`;

      const tdMissionName = document.createElement('td');
      const icon = document.createElement('img');
      icon.src = missions[i].icon;
      icon.className = 'mission-icon';
      icon.alt = 'mission icon';

      const link = document.createElement('a');
      link.href =`/missions/${missions[i].id}`;
      link.target = '_blank';
      link.innerText = ` ${missions[i].title}`;
      tdMissionName.append(icon, link);

      const tdMissionAddress = document.createElement('td');
      tdMissionAddress.innerText = missions[i].address;

      const tdMissionStatus = document.createElement('td');
      const divMissionStatus = document.createElement('div');
      divMissionStatus.className = 'bs-alarm-button';
      divMissionStatus.id = `bs_alarm_button_${missions[i].id}`;
      tdMissionStatus.append(divMissionStatus);

      tr.append(tdMissionName, tdMissionAddress, tdMissionStatus);
      tableBody.append(tr);
    }

    missionTable.append(tableBody);
  }

  function bsDoWork(event){
    event.preventDefault();

    if (running) {
      return;
    }

    missions = [];
    const missionIds = [];
    const allianceMissions = document.getElementById('mission_list_alliance').querySelectorAll(':scope > .missionSideBarEntry:not(.mission_deleted):has(.glyphicon-user.hidden)');
    const eventMissions = document.getElementById('mission_list_alliance_event').querySelectorAll(':scope > .missionSideBarEntry:not(.mission_deleted):has(.glyphicon-user.hidden)');
    const guardMissions = document.getElementById('mission_list_sicherheitswache_alliance').querySelectorAll(':scope > .missionSideBarEntry:not(.mission_deleted):has(.glyphicon-user.hidden)');
    const missionElements = Array.prototype.slice.call(allianceMissions).concat(Array.prototype.slice.call(eventMissions), Array.prototype.slice.call(guardMissions));

    if (missionElements.length === 0) {
      return;
    }

    for (let i = 0, n = missionElements.length; i < n; i++) {
      const missionId = missionElements[i].getAttribute('mission_id');

      if (missionId === '' || missionId === null || missionIds.includes(missionId)) {
        continue;
      }

      const missionData = JSON.parse(missionElements[i].getAttribute('data-sortable-by'));
      const missionIcon = document.getElementById(`mission_vehicle_state_${missionId}`).getAttribute('src');
      const missionName = missionData.caption.replace('[Verband] ', '').replace('[Event] ', '');
      let missionAddress = document.getElementById(`mission_address_${missionId}`)?.innerText ?? '';
      missionAddress = missionAddress === '' ? 'unbekannt' : missionAddress;
      const guardMission = missionElements[i].getAttribute('data-mission-type-filter') === 'sicherheitswache' ? 1 : 0;

      missions.push({'id': missionId, 'title': missionName, 'address': missionAddress, 'icon': missionIcon, 'credits': missionData.average_credits, 'created': missionData.created_at, 'guardMission': guardMission});
      missionIds.push(missionId);
    }

    missions.sort((a, b) => b.guardMission - a.guardMission || b.credits - a.credits || a.created - b.created);

    missionCountLabel.innerText = `${missions.length} Einsätze anfahren`;
    populateMissionTable();
  }

  GM_addStyle(`
    #bsTable td {
      vertical-align: middle;
    }

    .bs-alarm-button {
      min-width: 20px;
    }

    .mission-icon {
      max-height: 30px;
    }

    .modal {
      display: none;
      position: fixed; /* Stay in place front is invalid - may break your css so removed */
      padding-top: 100px;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      overflow: auto;
      background-color: rgb(0,0,0);
      background-color: rgba(0,0,0,0.4);
      z-index: 9999;
    }

    .modal-body {
      height: 650px;
      overflow-y: auto;
    }`);
})();
