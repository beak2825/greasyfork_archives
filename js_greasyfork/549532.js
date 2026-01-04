// ==UserScript==
// @name            Check Freigaben anfahren 2
// @version         2.0.12
// @license         All Rights Reserved
// @author          NoOne
// @namespace       NoOne
// @description     Zeigt Sprechwuensche aller Einsaetze an
// @require         https://update.greasyfork.org/scripts/516844/API-Speicher.user.js?v=1
// @require         https://update.greasyfork.org/scripts/528065/Skripteinstellungen.user.js
// @require         https://cdn.jsdelivr.net/npm/croner@9/dist/croner.umd.js
// @match           https://*.leitstellenspiel.de
// @match           https://*.leitstellenspiel.de/settings/index*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @icon            https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/549532/Check%20Freigaben%20anfahren%202.user.js
// @updateURL https://update.greasyfork.org/scripts/549532/Check%20Freigaben%20anfahren%202.meta.js
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
  const AUTOMATIC_GUARD_MISSION_DISPATCHING_STORAGE_KEY = 'automatic_guard_mission_dispatching';
  const MINIMUM_GUARD_MISSION_CREDITS_STORAGE_KEY = 'minimum_guard_mission_credits';
  const MINIMUM_GUARD_MISSION_CREDITS_DEFAULT = 25000;
  const IGNORE_CREDITS_THRESHOLD_IF_OUTSIDE_TIMEFRAME_STORAGE_KEY = 'ignore_credits_threshold_if_outside_timeframe';
  const MINIMUM_GUARD_MISSION_NOTICE_STORAGE_KEY = 'minimum_guard_mission_notice';
  const MINIMUM_GUARD_MISSION_NOTICE_DEFAULT = 600;
  const START_GUARD_MISSION_DISPATCHING_STORAGE_KEY = 'start_guard_mission_dispatching';
  const START_GUARD_MISSION_DISPATCHING_DEFAULT = '07:00';
  const END_GUARD_MISSION_DISPATCHING_STORAGE_KEY = 'end_guard_mission_dispatching';
  const END_GUARD_MISSION_DISPATCHING_DEFAULT = '00:00';
  const HORSE_TRANSPORTER_STORAGE_KEY = 'small_horse_transporter';
  const NEA_TRACTIVE_VEHICLE_IS_HLF_STORAGE_KEY = 'nea_tractive_vehicle_is_hlf';
  const HOTKEY_OPEN_ALLIANCE_DISPATCHER_STORAGE_KEY = 'hotkey_open_alliance_dispatcher';
  const HOTKEY_OPEN_ALLIANCE_DISPATCHER_DEFAULT = JSON.stringify({
    'key': 'H',
    'code': 'KeyH',
    'ctrlKey': false,
    'altKey': false,
    'shiftKey': false,
    'metaKey': false
  });
  const HOTKEY_START_ALLIANCE_DISPATCHER_STORAGE_KEY = 'hotkey_start_alliance_dispatcher';
  const HOTKEY_START_ALLIANCE_DISPATCHER_DEFAULT = JSON.stringify({
    'key': 'G',
    'code': 'KeyG',
    'ctrlKey': false,
    'altKey': false,
    'shiftKey': false,
    'metaKey': false
  });

  if (location.pathname.startsWith('/settings/index')) {
    await addOptions({
      'identifier': 'check_freigaben_anfahren',
      'title': 'Check Freigaben anfahren',
      'settings': [
        {
          'type': 'header',
          'text': 'Anfahrer Verbandseinsätze'
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
          'type': 'hotkey',
          'key': HOTKEY_OPEN_ALLIANCE_DISPATCHER_STORAGE_KEY,
          'default': JSON.parse(HOTKEY_OPEN_ALLIANCE_DISPATCHER_DEFAULT),
          'label': 'Hotkey zum Öffnen der Anfahrliste'
        },
        {
          'type': 'hotkey',
          'key': HOTKEY_START_ALLIANCE_DISPATCHER_STORAGE_KEY,
          'default': JSON.parse(HOTKEY_START_ALLIANCE_DISPATCHER_DEFAULT),
          'label': 'Hotkey zum Starten des Anfahrens'
        },
        {
          'type': 'header',
          'header': 'h3',
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
          'header': 'h3',
          'text': 'Einsätze für Auszeichnungen (optional)'
        },
        {
          'type': 'select',
          'selectType': 'vehicle_types',
          'key': ALLOWED_VEHICLE_TYPE_IDS_AWARD_MISSIONS_STORAGE_KEY,
          'label': 'Erlaubte Fahrzeugtypen für Einsätze mit Auszeichnungen (Winter, Frühling, Weihnachten usw.). Es werden die Fahrzeuge der allgemeinen Einstellungen verwendet, wenn nichts ausgewählt wurde.',
          'title': 'Fahrzeuge',
          'multiple': true
        },
        {
          'type': 'header',
          'text': 'Eigene geplante Einsätze'
        },
        {
          'type': 'number',
          'key': MINIMUM_GUARD_MISSION_CREDITS_STORAGE_KEY,
          'label': 'Min. Credits für geplante Einsätze',
          'min': 0,
          'default': MINIMUM_GUARD_MISSION_CREDITS_DEFAULT
        },
        {
          'type': 'checkbox',
          'key': IGNORE_CREDITS_THRESHOLD_IF_OUTSIDE_TIMEFRAME_STORAGE_KEY,
          'label': 'Creditgrenze ignorieren, wenn Beginn außerhalb des eingestellten Zeitraums liegt',
        },
        {
          'type': 'number',
          'key': MINIMUM_GUARD_MISSION_NOTICE_STORAGE_KEY,
          'label': 'Min. Zeit bis zum Start des Einsatzes, um diesen noch anzufahren (Angabe in s)',
          'min': 0,
          'default': MINIMUM_GUARD_MISSION_NOTICE_DEFAULT
        },
        {
          'type': 'time',
          'key': START_GUARD_MISSION_DISPATCHING_STORAGE_KEY,
          'label': 'Startzeit für das automatische Fahren von eigenen geplanten Einsätzen',
          'default': START_GUARD_MISSION_DISPATCHING_DEFAULT
        },
        {
          'type': 'time',
          'key': END_GUARD_MISSION_DISPATCHING_STORAGE_KEY,
          'label': 'Endzeit für das automatische Fahren von eigenen geplanten Einsätzen',
          'default': END_GUARD_MISSION_DISPATCHING_DEFAULT
        },
        {
          'type': 'checkbox',
          'key': HORSE_TRANSPORTER_STORAGE_KEY,
          'label': 'Kleine anstatt große Pferdetransporter verwenden',
        },
        {
          'type': 'checkbox',
          'key': NEA_TRACTIVE_VEHICLE_IS_HLF_STORAGE_KEY,
          'label': 'NEA50 wird von HLF gezogen'
        }
      ]
    });
    return;
  }

  const VEHICLE_ID_MAPPING = {
    "firetrucks": [0, 1, 6, 7, 8, 9, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 87, 88, 89, 107, 163],
    "battalion_chief_vehicles": [3, 34, 128],
    "heavy_rescue_vehicles": [4, 30, 47, 90],
    "gwmess": [12],
    "hazmat_vehicles": [27, 77],
    "police_cars": [32],
    "police_service_group_leader": [103],
    "civil_patrolcar": [98],
    "police_motorcycle": [95],
    "oneof_police_patrol_or_motorcycle": [32, 95],
    "oneof_police_patrol_or_civil_patrol": [32, 98],
    "oneof_police_patrol_or_civil_patrol_or_motorcycle": [32, 95, 98],
    "grukw": [50],
    "lebefkw": [35],
    "gefkw": [52],
    "k9": [94],
    "fukw": [51],
    "wasserwerfer": [72],
    "police_helicopters": [61],
    "police_speaker": [165],
    "sek": [79, 80],
    "mek": [81, 82],
    "hazmat_dekon": [53, 54],
    "gwoil": [10, 49],
    "mobile_air_vehicles": [5, 48],
    "platform_trucks": [2, 85],
    "fwk": [57],
    "height_rescue_units": [33],
    "water_tankers": [11, 13, 14, 15, 16, 143],
    "mobile_command_vehicles": [34, 78, 129],
    "ventilation": [114, 115, 116],
    "ambulances": [28],
    "rtw_or_ktw_or_ktw_b": [28, 38, 58],
    "rtw_or_ktw_b": [28, 58],
    "rtw_or_ktw": [28, 38],
    "gw_san": [60],
    "pump": [101, 102],
    "thw_gkw": [39],
    "thw_mtwtz": [40],
    "thw_brmg_r": [43],
    "thw_lkw": [42],
    "thw_dle": [44],
    "thw_mzkw": [41],
    "rescue_dog_units": [91, 92],
    "heavy_rescue": [109],
    "energy_supply": [110, 111],
    "energy_supply_2": [112, 113],
    "drone": [125, 126, 127, 128],
    "drone_mobile_command_vehicles": [129],
    "police_horse": [134, 135],
    "police_horse_big": [135],
    "police_horse_small": [134],
    "police_horse_education": [137],
    "thw_command": [144],
    "thw_command_2": [145],
    "thw_command_3": [147],
    "thw_command_4": [148],
    "thw_command_trailer": [146],
    "boats": [62, 66, 67, 68, 70, 71],
    "diver_units": [63, 69],
    "gw_werkfeuerwehr": [83],
    "ulf": [84],
    "teleskopmast": [85],
    "turboloescher": [86],
    "rettungstreppe": [76],
    "arff": [75],
    "helicopter_bucket": [96],
    "railway_fire": [162, 163, 164],
    "disaster_response_technology_equipment": [171],
    "disaster_response_technology_crew": [173],
    "disaster_response_technology_trailer": [174]
  }

  const csrfToken = document.querySelector('meta[name=csrf-token]')?.content;

  if (!csrfToken) {
    return;
  }

  let allowedVehicleTypeIds = [];
  let allowedGuardMissionVehicleTypeIds = [];
  let allowedAwardMissionVehicleTypeIds = [];
  let excludedDispatchCenters = [];
  let missionTimeouts = [];
  let skippedGuardMissionIds = [];
  let guardMissionIdsToDispatch = [];
  let guardMissionsToDispatch = [];
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
  const db = await openDb();
  let automaticGuardMissionsJob;
  let buttonAutomaticGuardMissions;
  let automaticGuardMissions = await GM.getValue(AUTOMATIC_GUARD_MISSION_DISPATCHING_STORAGE_KEY, false);
  let minCreditsGuardMissions = await GM.getValue(MINIMUM_GUARD_MISSION_CREDITS_STORAGE_KEY, MINIMUM_GUARD_MISSION_CREDITS_DEFAULT);
  let ignoreCreditsThreshold = await GM.getValue(IGNORE_CREDITS_THRESHOLD_IF_OUTSIDE_TIMEFRAME_STORAGE_KEY, false);
  let averageMinCreditsGuardMissions = Math.floor(minCreditsGuardMissions / 1.5);
  let minNoticeGuardMissions = await GM.getValue(MINIMUM_GUARD_MISSION_NOTICE_STORAGE_KEY, MINIMUM_GUARD_MISSION_NOTICE_DEFAULT);
  let smallHorseTransporter = await GM.getValue(HORSE_TRANSPORTER_STORAGE_KEY, false);
  let replaceHlfs = await GM.getValue(NEA_TRACTIVE_VEHICLE_IS_HLF_STORAGE_KEY, false);
  const hotKeyOpenAllianceDispatcher = JSON.parse(await GM.getValue(HOTKEY_OPEN_ALLIANCE_DISPATCHER_STORAGE_KEY, HOTKEY_OPEN_ALLIANCE_DISPATCHER_DEFAULT));
  const hotKeyStartAllianceDispatcher = JSON.parse(await GM.getValue(HOTKEY_START_ALLIANCE_DISPATCHER_STORAGE_KEY, HOTKEY_START_ALLIANCE_DISPATCHER_DEFAULT));
  const guardMissionCreditsRegex = /Verdienst:(?:\s|&nbsp;)([0-9.]+?)(?:\s|&nbsp;)Credits/m;

  const missionMarkerAddOrig = missionMarkerAdd;
  missionMarkerAdd = (mission) => {
    missionMarkerAddOrig(mission);

    if (guardMissionIdsToDispatch.includes(mission.id) || !mission.sw || mission.user_id !== user_id || mission.vehicle_state !== 0) {
      return;
    }

    guardMissionIdsToDispatch.push(mission.id);
    guardMissionsToDispatch.push(mission);
  }

  automaticGuardMissionsJob = new Cron('? * * * * *', {paused: true, protect:true}, async () => {
    minCreditsGuardMissions = await GM.getValue(MINIMUM_GUARD_MISSION_CREDITS_STORAGE_KEY, MINIMUM_GUARD_MISSION_CREDITS_DEFAULT);
    ignoreCreditsThreshold = await GM.getValue(IGNORE_CREDITS_THRESHOLD_IF_OUTSIDE_TIMEFRAME_STORAGE_KEY, false);
    averageMinCreditsGuardMissions = Math.floor(minCreditsGuardMissions / 1.6);
    minNoticeGuardMissions = await GM.getValue(MINIMUM_GUARD_MISSION_NOTICE_STORAGE_KEY, MINIMUM_GUARD_MISSION_NOTICE_DEFAULT);
    smallHorseTransporter = await GM.getValue(HORSE_TRANSPORTER_STORAGE_KEY, false);
    replaceHlfs = await GM.getValue(NEA_TRACTIVE_VEHICLE_IS_HLF_STORAGE_KEY, false);
    const guardMissions = guardMissionsToDispatch.slice(0);

    for (let i = 0, n = guardMissions.length; i < n; i++) {
      if ((await isValidGuardMission(guardMissions[i]))) {
        await dispatchMission(guardMissions[i]);
      }

      await new Promise(r => setTimeout(r, 1500));
    }
  })

  createElements();
  await checkGuardMissionSchedule();

  new Cron('* * * * *', {protect:true}, async () => {
    await checkGuardMissionSchedule();
  });

  new Cron('? */12 * * *', {protect:true}, async () => {
    await updateMissions(db, 300);
  });

  await updateMissions(db, 86_400);

  async function isValidGuardMission(guardMission) {
    const missionStartTime = (guardMission.date_now + guardMission.sw_start_in) * 1000;

    if (missionStartTime < Date.now()) {
      guardMissionsToDispatch = guardMissionsToDispatch.filter((mission) => mission.id !== guardMission.id);
      guardMissionIdsToDispatch = guardMissionIdsToDispatch.filter((id) => id !== guardMission.id);

      return false;
    }

    return !(guardMission.vehicle_state !== 0 || (guardMission.average_credits < averageMinCreditsGuardMissions && (!ignoreCreditsThreshold || (await isGuardMissionDispatchingInTimeFrame(missionStartTime)))) || missionStartTime - Date.now() < minNoticeGuardMissions || skippedGuardMissionIds.includes(guardMission.id));
  }

  function createElements() {
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group';

    const button = document.createElement('a');
    button.className = 'btn btn-xs btn-danger';
    button.id = 'showMissionRequests';
    button.dataset.toggle = 'modal';
    button.dataset.target = '#bsShowMissions';
    button.innerText = '🚒';
    button.title = 'Verbandseinsätze anfahren';
    button.style.marginLeft = '5px';
    button.addEventListener('click', bsDoWork);
    buttonGroup.appendChild(button);

    buttonAutomaticGuardMissions = document.createElement('a');
    buttonAutomaticGuardMissions.id = 'automatic_guard_missions';
    buttonAutomaticGuardMissions.className = 'btn btn-xs btn-danger';
    buttonAutomaticGuardMissions.innerText = '🕓';
    buttonAutomaticGuardMissions.title = 'Geplante Einsätze automatisch fahren';
    buttonAutomaticGuardMissions.addEventListener('click', toggleAutomaticGuardMissions);
    buttonGroup.appendChild(buttonAutomaticGuardMissions);

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

    document.addEventListener('keydown', async (e) => {
      if (e.code === hotKeyOpenAllianceDispatcher.code && e.ctrlKey === hotKeyOpenAllianceDispatcher.ctrlKey && e.altKey === hotKeyOpenAllianceDispatcher.altKey && e.shiftKey === hotKeyOpenAllianceDispatcher.shiftKey && e.metaKey === hotKeyOpenAllianceDispatcher.metaKey) {
        button.click();
      } else if (e.code === hotKeyStartAllianceDispatcher.code && e.ctrlKey === hotKeyStartAllianceDispatcher.ctrlKey && e.altKey === hotKeyStartAllianceDispatcher.altKey && e.shiftKey === hotKeyStartAllianceDispatcher.shiftKey && e.metaKey === hotKeyStartAllianceDispatcher.metaKey) {
        goButton.click();
      }
    });
  }

  async function toggleAutomaticGuardMissions(event) {
    event.preventDefault();
    automaticGuardMissions = !automaticGuardMissions;
    await GM.setValue(AUTOMATIC_GUARD_MISSION_DISPATCHING_STORAGE_KEY, automaticGuardMissions);
    await checkGuardMissionSchedule();
  }

  async function updateGuardMissionButtonStatus() {
    if (!automaticGuardMissions) {
      buttonAutomaticGuardMissions.classList.add('btn-danger');
      buttonAutomaticGuardMissions.classList.remove('btn-success');
      buttonAutomaticGuardMissions.classList.remove('btn-warning');
    } else if (await isGuardMissionDispatchingInTimeFrame()) {
      buttonAutomaticGuardMissions.classList.add('btn-success');
      buttonAutomaticGuardMissions.classList.remove('btn-danger');
      buttonAutomaticGuardMissions.classList.remove('btn-warning');
    } else {
      buttonAutomaticGuardMissions.classList.add('btn-warning');
      buttonAutomaticGuardMissions.classList.remove('btn-danger');
      buttonAutomaticGuardMissions.classList.remove('btn-success');
    }
  }

  async function isGuardMissionDispatchingInTimeFrame(timeToCheck = null) {
    const startTime = await GM.getValue(START_GUARD_MISSION_DISPATCHING_STORAGE_KEY, START_GUARD_MISSION_DISPATCHING_DEFAULT);
    const endTime = await GM.getValue(END_GUARD_MISSION_DISPATCHING_STORAGE_KEY, END_GUARD_MISSION_DISPATCHING_DEFAULT);
    const date = new Date();

    if (timeToCheck === null) {
      timeToCheck = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    } else if (timeToCheck === parseInt(timeToCheck, 10)) {
      const dateToCheck = new Date(timeToCheck);
      timeToCheck = dateToCheck.getHours().toString().padStart(2, '0') + ':' + dateToCheck.getMinutes().toString().padStart(2, '0');
    }

    return (timeToCheck >= startTime && timeToCheck <= endTime) || (startTime >= endTime && (timeToCheck >= startTime || timeToCheck <= endTime));
  }

  async function checkGuardMissionSchedule() {
    const isInTimeFrame = await isGuardMissionDispatchingInTimeFrame();
    const jobIsRunning = automaticGuardMissionsJob.isRunning();
    await updateGuardMissionButtonStatus();

    if (!jobIsRunning && isInTimeFrame && automaticGuardMissions) {
      automaticGuardMissionsJob.resume();
    } else if (jobIsRunning && (!isInTimeFrame || !automaticGuardMissions)) {
      automaticGuardMissionsJob.pause();
    }
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
    const missionListButton = document.getElementById('showMissionRequests');
    missionListButton.classList.toggle('btn-success');
    missionListButton.classList.toggle('btn-danger');
  }

  async function letsStart(event) {
    event.preventDefault();
    const currentTarget = event.currentTarget;
    currentTarget.disabled = true;
    currentTarget.classList.add('disabled');
    const missionListButton = document.getElementById('showMissionRequests');
    missionListButton.classList.toggle('btn-success');
    missionListButton.classList.toggle('btn-danger');
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
      const fms = vehicleCheckboxes[i].getAttribute('fms');
      let dispatchCenterId = null;

      if (buildingId.includes('_')) {
        dispatchCenterId = parseInt(buildingId.replace(/\d+_(\d+)$/, '$1'), 10);
      }

      if (fms === '2' && missionAllowedVehicleTypeIds.includes(vehicleTypeId) && !alreadyFoundCars.includes(vehicleId) && (!hasExcludedDispatchCenters || !excludedDispatchCenters.includes(dispatchCenterId))) {
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

    missions = getAllianceMissions();
    missionCountLabel.innerText = `${missions.length} Einsätze anfahren`;
    populateMissionTable();
  }

  function getAllianceMissions() {
    const allianceMissions = document.getElementById('mission_list_alliance').querySelectorAll(':scope > .missionSideBarEntry:not(.mission_deleted):has(.glyphicon-user.hidden)');
    const eventMissions = document.getElementById('mission_list_alliance_event').querySelectorAll(':scope > .missionSideBarEntry:not(.mission_deleted):has(.glyphicon-user.hidden)');
    const guardMissions = document.getElementById('mission_list_sicherheitswache_alliance').querySelectorAll(':scope > .missionSideBarEntry:not(.mission_deleted):has(.glyphicon-user.hidden)');
    const missionElements = Array.prototype.slice.call(allianceMissions).concat(Array.prototype.slice.call(eventMissions), Array.prototype.slice.call(guardMissions));

    return prepareMissions(missionElements);
  }

  function prepareMissions(missionElements) {
    const preparedMissions = [];

    if (missionElements.length === 0) {
      return preparedMissions;
    }

    const missionIds = [];

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
      const missionAdditiveOverlays = missionElements[i].getAttribute('data-additive-overlays');
      let missionTypeId = missionElements[i].getAttribute('mission_type_id');

      if (missionAdditiveOverlays !== '') {
        missionTypeId += '/' + missionAdditiveOverlays;
      }

      preparedMissions.push({'id': missionId, 'title': missionName, 'address': missionAddress, 'icon': missionIcon, 'credits': missionData.average_credits, 'created': missionData.created_at, 'guardMission': guardMission, 'missionTypeId': missionTypeId});
      missionIds.push(missionId);
    }

    preparedMissions.sort((a, b) => b.guardMission - a.guardMission || b.credits - a.credits || a.created - b.created);

    return preparedMissions;
  }

  async function dispatchMission(mission) {
    const response = await fetch(`/missions/${mission.id}`);

    if (response.status >= 400) {
      throw new Error('Fehler beim Laden des Einsatzes!');
    }

    const responseText = await response.text();

    if (responseText.includes('Der Einsatz wurde erfolgreich abgeschlossen.')) {
      return 1;
    } else if (responseText.includes('Serverfehler')) {
      return 2;
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(responseText, 'text/html');
    const missingTextElement = doc.querySelector('[data-requirement-type="vehicles"]');

    if (doc.getElementById('mission_vehicle_driving')?.querySelector(`tr:has(td > a[href="/profile/${user_id}"]):not(:has(.building_list_fms_4))`) || (mission.sw && !missingTextElement) || (document.getElementById('mission_vehicle_at_mission')?.querySelector(':scope td > a[href^="/profile/"]') && !missingTextElement)) {
      return 3;
    }

    if (mission.sw) {
      const credits = getGuardMissionCredits(responseText);
      const missionStartTime = (mission.date_now + mission.sw_start_in) * 1000;

      if (credits === null || (credits < minCreditsGuardMissions && (!ignoreCreditsThreshold || await isGuardMissionDispatchingInTimeFrame(missionStartTime)))) {
        skippedGuardMissionIds.push(mission.id);
        return 4;
      }
    }

    let missingVehicles;

    // if (!mission.sw && missingTextElement) {
    //   missingVehicles = getMissingVehiclesByText()
    // } else {
    let missionTypeId = mission.mtid.toString();

    if (mission.additive_overlays !== '') {
      missionTypeId += '/' + mission.additive_overlays;
    }

    missingVehicles = await getMissingVehiclesByMission(missionTypeId);
    // }

    if (missingVehicles === null) {
      return 4;
    }

    let vehicleIds = selectVehicles(doc, missingVehicles);

    let retries = 0;
    let page = 0;
    let pageParameter = '';

    while (Object.keys(missingVehicles.requirements).length > 0) {
      if (retries > 2) {
        return 5;
      }

      if (page > 0) {
        pageParameter = `?offset_page=${page}`;
      }

      await new Promise(r => setTimeout(r, 150));
      const response = await fetch(`/missions/${mission.id}/missing_vehicles${pageParameter}`);

      if (response.status >= 400) {
        retries++;
        continue;
      } else {
        page++;
        retries = 0;
      }

      const responseTextAdditional = await response.text();

      if (!responseTextAdditional.includes('input type="checkbox"')) {
        break;
      }

      const additionalDoc = parser.parseFromString('<table>' + responseTextAdditional + '</table>', 'text/html');
      vehicleIds = selectVehicles(additionalDoc, missingVehicles, vehicleIds);
    }

    if (Object.keys(missingVehicles.requirements).length > 0) {
      return 6;
    }

    const form = new FormData();
    form.set('utf8', '✓');
    form.set('authenticity_token', csrfToken);
    form.set('next_mission', '0');
    form.set('next_mission_id', '0');
    form.set('alliance_mission_publish', '1');

    for (let i = 0, n = vehicleIds.length; i < n; i++) {
      form.append('vehicle_ids[]', vehicleIds[i]);
    }

    await new Promise(r => setTimeout(r, 150));
    const dispatchResponse = await fetch(`/missions/${mission.id}/alarm`, {
      method: 'POST',
      body: new URLSearchParams(form),
      redirect: 'manual',
    });

    if (dispatchResponse.status >= 400) {
      return 7;
    } else {
      guardMissionsToDispatch = guardMissionsToDispatch.filter((mission) => mission.id !== mission.id);
      guardMissionIdsToDispatch = guardMissionIdsToDispatch.filter((id) => id !== mission.id);
    }
  }

  function selectVehicles(doc, missingVehicles, vehicleIds = []) {
    const vehicleCheckboxes = doc.querySelectorAll('.vehicle_checkbox');

    for (let i = 0, n = vehicleCheckboxes.length; i < n; i++) {
      const vehicleTypeId = parseInt(vehicleCheckboxes[i].getAttribute('vehicle_type_id'), 10);
      const vehicleId = vehicleCheckboxes[i].getAttribute('value');
      const fms = vehicleCheckboxes[i].getAttribute('fms');

      if (!missingVehicles.vehicleTypes.includes(vehicleTypeId) || vehicleId === null || vehicleIds.includes(vehicleId) || fms === null || fms !== '2') {
        continue;
      }

      const vehicleSortValue = doc.getElementById(`vehicle_sort_${vehicleId}`)?.getAttribute('sortValue');

      if (vehicleSortValue === null || parseInt(vehicleSortValue.replace('999999999999', ''), 10) > 2500) {
        continue;
      }

      for (const missingVehicle in missingVehicles.requirements) {
        if (!VEHICLE_ID_MAPPING[missingVehicle].includes(vehicleTypeId) || missingVehicles.requirements[missingVehicle] <= 0 || vehicleIds.includes(vehicleId)) {
          continue;
        }

        vehicleIds.push(vehicleId);
        missingVehicles.requirements[missingVehicle]--;

        if (missingVehicles.requirements[missingVehicle] <= 0) {
          delete missingVehicles.requirements[missingVehicle];
        }

        break;
      }

      if (Object.keys(missingVehicles.requirements).length === 0) {
        break;
      }
    }

    return vehicleIds;
  }

  function getGuardMissionCredits(string) {
    const matches = string.match(guardMissionCreditsRegex);
    return matches ? parseInt(matches[1].replace('.', ''), 10) : null;
  }

  async function getMissingVehiclesByMission(missionTypeId) {
    const missionData = await getData(db, 'missions', missionTypeId);
    const missingVehicles = {'requirements': {}, 'vehicleTypes': []};

    if (missionData === null || missionData.hasOwnProperty('requirements') === false) {
      return null;
    }

    for (const requirement in missionData.requirements) {
      if (VEHICLE_ID_MAPPING.hasOwnProperty(requirement)) {
        missingVehicles.requirements[requirement] = missionData.requirements[requirement];
      }
    }

    vehicleReplacements(missingVehicles);

    for (const missingVehicle in missingVehicles.requirements) {
      missingVehicles.vehicleTypes = missingVehicles.vehicleTypes.concat(VEHICLE_ID_MAPPING[missingVehicle]);
    }

    return missingVehicles;
  }

  function vehicleReplacements(missingVehicles) {
    if (replaceHlfs && missingVehicles.requirements.hasOwnProperty('energy_supply') && missingVehicles.requirements.hasOwnProperty('firetrucks')) {
      const firetrucks = missingVehicles.requirements.firetrucks - missingVehicles.requirements.energy_supply;

      if (firetrucks > 0) {
        missingVehicles.requirements.firetrucks = firetrucks;
      } else {
        delete missingVehicles.requirements.firetrucks;
      }
    }

    let usedPoliceServiceGroupLeaders = 0;

    if (missingVehicles.requirements.hasOwnProperty('police_service_group_leader') && missingVehicles.requirements.hasOwnProperty('police_cars')) {
      const initialPoliceCars = missingVehicles.requirements.police_cars;
      const policeCars = missingVehicles.requirements.police_cars - missingVehicles.requirements.police_service_group_leader;

      if (policeCars > 0) {
        missingVehicles.requirements.police_cars = policeCars;
        usedPoliceServiceGroupLeaders += initialPoliceCars - policeCars;
      } else {
        usedPoliceServiceGroupLeaders += initialPoliceCars;
        delete missingVehicles.requirements.police_cars;
      }
    }

    if (missingVehicles.requirements.hasOwnProperty('police_service_group_leader') && missingVehicles.requirements.hasOwnProperty('oneof_police_patrol_or_motorcycle')) {
      const initialPoliceCars = missingVehicles.requirements.oneof_police_patrol_or_motorcycle;
      const policeCars = missingVehicles.requirements.oneof_police_patrol_or_motorcycle - (missingVehicles.requirements.police_service_group_leader - usedPoliceServiceGroupLeaders);

      if (policeCars > 0) {
        missingVehicles.requirements.oneof_police_patrol_or_motorcycle = policeCars;
        usedPoliceServiceGroupLeaders += initialPoliceCars - policeCars;
      } else {
        usedPoliceServiceGroupLeaders += initialPoliceCars;
        delete missingVehicles.requirements.oneof_police_patrol_or_motorcycle;
      }
    }

    if (missingVehicles.requirements.hasOwnProperty('police_service_group_leader') && missingVehicles.requirements.hasOwnProperty('oneof_police_patrol_or_civil_patrol')) {
      const initialPoliceCars = missingVehicles.requirements.oneof_police_patrol_or_civil_patrol;
      const policeCars = missingVehicles.requirements.oneof_police_patrol_or_civil_patrol - (missingVehicles.requirements.oneof_police_patrol_or_civil_patrol - usedPoliceServiceGroupLeaders);

      if (policeCars > 0) {
        missingVehicles.requirements.oneof_police_patrol_or_civil_patrol = policeCars;
        usedPoliceServiceGroupLeaders += initialPoliceCars - policeCars;
      } else {
        usedPoliceServiceGroupLeaders += initialPoliceCars;
        delete missingVehicles.requirements.oneof_police_patrol_or_civil_patrol;
      }
    }

    if (missingVehicles.requirements.hasOwnProperty('police_service_group_leader') && missingVehicles.requirements.hasOwnProperty('oneof_police_patrol_or_civil_patrol_or_motorcycle')) {
      const policeCars = missingVehicles.requirements.oneof_police_patrol_or_civil_patrol_or_motorcycle - (missingVehicles.requirements.police_service_group_leader - usedPoliceServiceGroupLeaders);

      if (policeCars > 0) {
        missingVehicles.requirements.oneof_police_patrol_or_civil_patrol_or_motorcycle = policeCars;
      } else {
        delete missingVehicles.requirements.oneof_police_patrol_or_civil_patrol_or_motorcycle;
      }
    }

    if (missingVehicles.requirements.hasOwnProperty('police_horse')) {
      if (smallHorseTransporter) {
        missingVehicles.requirements.police_horse_small = Math.ceil(missingVehicles.requirements.police_horse / 2);
        delete missingVehicles.requirements.police_horse;
      } else {
        missingVehicles.requirements.police_horse_big = Math.ceil(missingVehicles.requirements.police_horse / 4);
        missingVehicles.requirements.police_horse_education = missingVehicles.requirements.police_horse_big;
        delete missingVehicles.requirements.police_horse;
      }
    }
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
