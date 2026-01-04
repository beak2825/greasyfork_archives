// ==UserScript==
// @name            Lumpensammler
// @version         1.0.2
// @license         All Rights Reserved
// @author          NoOne
// @namespace       NoOne
// @description     Lumpensammler :)
// @require         https://update.greasyfork.org/scripts/516844/API-Speicher.user.js
// @require         https://update.greasyfork.org/scripts/528065/Skripteinstellungen.user.js
// @require         https://cdn.jsdelivr.net/npm/croner@9/dist/croner.umd.js
// @match           https://*.leitstellenspiel.de
// @match           https://*.leitstellenspiel.de/settings/index*
// @grant           GM_setValue
// @grant           GM_getValue
// @icon            https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/549280/Lumpensammler.user.js
// @updateURL https://update.greasyfork.org/scripts/549280/Lumpensammler.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  const TIME_TO_BUILD_BEFORE_MISSION_ENDS_STORAGE_KEY = 'time_to_build_before_mission_ends';
  const TIME_TO_BUILD_BEFORE_MISSION_ENDS_DEFAULT = 17;
  const EXCLUDED_MISSION_TYPE_IDS_STORAGE_KEY = 'excluded_mission_type_ids';
  const MAX_BUILDING_COUNT_STORAGE_KEY = 'max_building_count';
  const MAX_BUILDING_COUNT_DEFAULT = 10;
  const BUILT_BUILDINGS_STORAGE_KEY = 'built_buildings';
  const MIN_CREDITS_PER_MISSION_STORAGE_KEY = 'min_credits_per_mission';
  const MIN_CREDITS_PER_MISSION_DEFAULT = 15000;
  const BUILDING_PREFIX_STORAGE_KEY = 'building_prefix';
  const BUILDING_PREFIX_DEFAULT = 'RD-';

  if (location.pathname.startsWith('/settings/index')) {
    await addOptions({
      'identifier': 'lumpensammler',
      'title': 'Lumpensammler',
      'settings': [
        {
          'type': 'header',
          'text': 'Allgemeine Einstellungen'
        },
        {
          'type': 'number',
          'key': TIME_TO_BUILD_BEFORE_MISSION_ENDS_STORAGE_KEY,
          'label': 'Zeit vor Einsatzende zu dem gebaut wird (Angabe in s)',
          'min': 10,
          'default': TIME_TO_BUILD_BEFORE_MISSION_ENDS_DEFAULT
        },
        {
          'type': 'number',
          'key': MAX_BUILDING_COUNT_STORAGE_KEY,
          'label': 'Maximal gebaute Gebäude',
          'min': 0,
          'default': MAX_BUILDING_COUNT_DEFAULT
        },
        {
          'type': 'number',
          'key': MIN_CREDITS_PER_MISSION_STORAGE_KEY,
          'label': 'Min. Credits pro Einsatz',
          'min': 1,
          'default': MIN_CREDITS_PER_MISSION_DEFAULT
        },
        {
          'type': 'select',
          'selectType': 'missions',
          'key': EXCLUDED_MISSION_TYPE_IDS_STORAGE_KEY,
          'label': 'Ausgeschlossene Einsätze (keine Auswahl erlaubt alle Einsatztypen)',
          'title': 'Einsätze',
          'multiple': true
        },
        {
          'type': 'text',
          'key': BUILDING_PREFIX_STORAGE_KEY,
          'label': 'Gebäude-Präfix',
          'default': BUILDING_PREFIX_DEFAULT,
          'info': 'An dieses Präfix wird eine zufällig generierte Zahl angehängt. Beispiel: RD-12345'
        }
      ]
    });
    return;
  }

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

  if (!csrfToken) {
    return;
  }

  let timeDiff = (await GM.getValue(TIME_TO_BUILD_BEFORE_MISSION_ENDS_STORAGE_KEY, TIME_TO_BUILD_BEFORE_MISSION_ENDS_DEFAULT)) * 1000;
  let excludedMissionTypeIds = JSON.parse(await GM.getValue(EXCLUDED_MISSION_TYPE_IDS_STORAGE_KEY, '[]'));
  let minCredits = await GM.getValue(MIN_CREDITS_PER_MISSION_STORAGE_KEY, MIN_CREDITS_PER_MISSION_DEFAULT);
  let builtBuildings = JSON.parse(await GM.getValue(BUILT_BUILDINGS_STORAGE_KEY, '[]'));
  const buildingPrefix = await GM.getValue(BUILDING_PREFIX_STORAGE_KEY, BUILDING_PREFIX_DEFAULT);
  const maxBuildingCount = await GM.getValue(MAX_BUILDING_COUNT_STORAGE_KEY, MAX_BUILDING_COUNT_DEFAULT);
  const scheduledMissions = {};
  let buildingsToDestroy = [];
  let buildingIdentifiers = {};
  const db = await openDb();
  let missionsWithPatientsAtEnd = await getMissionsWithPatientsAtEnd();

  const missionMarkerAddOrig = missionMarkerAdd;
  missionMarkerAdd = (mission) => {
    handleMission(mission);
    missionMarkerAddOrig(mission);
  }

  const missionMarkerAddSingleOrig = missionMarkerAddSingle;
  missionMarkerAddSingle = (mission) => {
    handleMission(mission);
    missionMarkerAddSingleOrig(mission);
  }

  const vehicleMarkerAddOrig = vehicleMarkerAdd;
  vehicleMarkerAdd = async (vehicle) => {
    vehicleMarkerAddOrig(vehicle);

    if (builtBuildings.includes(vehicle.b) && vehicle.fms === 2) {
      const buildingIdentifier = Object.keys(buildingIdentifiers).find(identifier => buildingIdentifiers[identifier] === vehicle.id);
      await destroyBuilding(vehicle.b, buildingIdentifier);
    }
  }

  await updateMissions(db, 86_400);

  new Cron('* * * * *', {protect:true}, async () => {
    timeDiff = (await GM.getValue(TIME_TO_BUILD_BEFORE_MISSION_ENDS_STORAGE_KEY, TIME_TO_BUILD_BEFORE_MISSION_ENDS_DEFAULT)) * 1000;
    excludedMissionTypeIds = JSON.parse(await GM.getValue(EXCLUDED_MISSION_TYPE_IDS_STORAGE_KEY, '[]'));
    minCredits = await GM.getValue(MIN_CREDITS_PER_MISSION_STORAGE_KEY, MIN_CREDITS_PER_MISSION_DEFAULT);
  });

  new Cron('? */1 * * *', {protect:true}, async () => {
    await buildingCleanup();
  });

  new Cron('? */12 * * *', {protect:true}, async () => {
    await updateMissions(db, 300);
    missionsWithPatientsAtEnd = await getMissionsWithPatientsAtEnd();
  });

  function handleMission(mission) {
    const isValid = isValidMission(mission);

    if (scheduledMissions.hasOwnProperty(mission.id)) {
      if (!isValid && scheduledMissions[mission.id].hasOwnProperty('job')) {
        scheduledMissions[mission.id].job.stop();
        delete scheduledMissions[mission.id];
      } else if (scheduledMissions[mission.id].hasOwnProperty('end') && scheduledMissions[mission.id].end !== mission.date_end) {
        scheduledMissions[mission.id].job.stop();
        scheduleDispatching(mission);
      }
    } else if (isValid) {
      scheduledMissions[mission.id] = {};
      scheduleDispatching(mission);
    }
  }

  function isValidMission(mission) {
    return !(mission.user_id === user_id || mission.vehicle_state !== 2 || mission.date_end <= 0 || mission.average_credits < minCredits || (mission.date_end * 1000) - Date.now() <= timeDiff || excludedMissionTypeIds.includes(mission.mtid) || !missionsWithPatientsAtEnd.includes(mission.mtid));
  }

  function scheduleDispatching(mission) {
    const missionEnd = mission.date_end * 1000;

    if (missionEnd - Date.now() <= timeDiff) {
      delete scheduledMissions[mission.id];
      return;
    }

    scheduledMissions[mission.id].end = mission.date_end;
    scheduledMissions[mission.id].job = new Cron(new Date(missionEnd - timeDiff), async () => {
      delete scheduledMissions[mission.id];
      if (!document.getElementById('mission_' + mission.id).querySelector(':not(.mission_deleted):has(.glyphicon-user.hidden)')) {
        return
      }

      await buildAndDispatch(mission);
    });
  }

  async function buildAndDispatch(mission, retries = 0) {
    if (retries > 3 || builtBuildings.length >= maxBuildingCount) {
      return;
    }

    const buildingIdentifier = getRandomBuildingIdentifier();

    const formData = new FormData();
    formData.append('utf8', '✓');
    formData.append('authenticity_token', csrfToken);
    formData.append('building[building_type]', '20');
    formData.append('building[name]', `${buildingIdentifier}`);
    formData.append('building[latitude]', mission.latitude.toString());
    formData.append('building[longitude]', mission.longitude.toString());
    formData.append('build_with_coins', '');
    formData.append('build_as_alliance', '');
    formData.append('building[address]', encodeURI(mission.address).replaceAll('%20', '+'));
    formData.append('building[leitstelle_building_id]', '');
    formData.append('building[start_vehicle_feuerwache]', '');
    formData.append('building[start_vehicle_feuerwache_kleinwache]', '');

    const response = await fetch('/buildings', {
      headers: {
        'X-CSRF-Token': csrfToken,
        'X-Requested-With': 'XMLHttpRequest'
      },
      method: 'POST',
      body: new URLSearchParams(formData)
    });

    await new Promise(r => setTimeout(r, 500));

    if (response.status >= 409) {
      retries++;
      await buildAndDispatch(mission, retries);
      return;
    }

    const responseTextBuilding = await response.text();
    const newBuildingId = getNewBuildingId(responseTextBuilding, buildingIdentifier);

    if (newBuildingId === null) {
      return;
    }

    builtBuildings.push(newBuildingId);
    await GM.setValue(BUILT_BUILDINGS_STORAGE_KEY, JSON.stringify(builtBuildings));

    const missionResponse = await fetch(`/missions/${mission.id}`);
    const responseText = await missionResponse.text();

    if (responseText.includes('Der Einsatz wurde erfolgreich abgeschlossen.') || responseText.includes('Serverfehler')) {
      await destroyBuilding(newBuildingId, buildingIdentifier);
      return;
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(responseText, 'text/html');

    if (doc.getElementById('mission_vehicle_at_mission')?.querySelector(`td > a[href="/profile/${user_id}"]`) || doc.getElementById('mission_vehicle_driving')?.querySelector(`tr:has(td > a[href="/profile/${user_id}"]):not(:has(.building_list_fms_4))`) || doc.getElementById('patient_full_view')) {
      await destroyBuilding(newBuildingId, buildingIdentifier);
      return;
    }

    if (!await selectVehicle(doc, mission.id, buildingIdentifier)) {
      await destroyBuilding(newBuildingId, buildingIdentifier);
    }
  }

  async function selectVehicle(doc, missionId, buildingIdentifier) {
    const vehicleCheckboxes = doc.querySelectorAll('.vehicle_checkbox');

    for (let i = 0, n = vehicleCheckboxes.length; i < n; i++) {
      const vehicleTypeId = parseInt(vehicleCheckboxes[i].getAttribute('vehicle_type_id'), 10);
      const vehicleId = vehicleCheckboxes[i].getAttribute('value');

      if (vehicleTypeId === 28) {
        const form = new FormData();
        form.set('utf8', '✓');
        form.set('authenticity_token', csrfToken);
        form.set('next_mission', '0');
        form.set('next_mission_id', '0');
        form.set('alliance_mission_publish', '0');
        form.set('vehicle_ids[]', vehicleId);

        const response = await fetch(`/missions/${missionId}/alarm`, {
          method: 'POST',
          body: new URLSearchParams(form),
          redirect: 'manual'
        });

        if (response.status < 400) {
          buildingIdentifiers[buildingIdentifier] = vehicleId;
          return true;
        }

        break;
      }
    }

    return false;
  }

  async function destroyBuilding(buildingId, buildingIdentifier, timeout = 5000, retries = 0) {
    if (buildingsToDestroy.includes(buildingId) && retries === 0) {
      return;
    }

    if (retries === 0) {
      buildingsToDestroy.push(buildingId);
    }

    if (retries > 3) {
      buildingsToDestroy = buildingsToDestroy.filter((id) => id !== buildingId);
      return;
    }

    await new Promise(r => setTimeout(r, timeout));
    const form = new FormData();
    form.set('_method', 'delete');
    form.set('authenticity_token', csrfToken);

    const response = await fetch(`/buildings/${buildingId}?refund=1`, {
      method: 'POST',
      body: new URLSearchParams(form),
      redirect: 'manual',
    });

    if (response.status >= 409) {
      retries++;
      await destroyBuilding(buildingId, buildingIdentifier, timeout, retries);
      return;
    }

    builtBuildings = builtBuildings.filter((building) => building !== buildingId);
    await GM.setValue(BUILT_BUILDINGS_STORAGE_KEY, JSON.stringify(builtBuildings));
    buildingVehicleCache.set(buildingId, []);
    document.getElementById('building_list').querySelector(`:scope > li:has(ul[data-building_id="${buildingId}"])`)?.remove();
    buildingsToDestroy = buildingsToDestroy.filter((id) => id !== buildingId);
    delete buildingIdentifiers[buildingIdentifier];
  }

  async function buildingCleanup() {
    const buildingsResponse = await fetch('/building/building_markers.js.erb', {
      headers: {
        'X-CSRF-Token': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
      }
    });

    if (!buildingsResponse.ok) {
      return;
    }

    const buildingText = await buildingsResponse.text();

    const form = new FormData();
    let buildingFound = false;
    const buildingsFound = {};
    const buildingRegex = new RegExp(`{"id":([0-9]+?),"user_id":${user_id},[^}]+}`, 'g');
    let buildingMatch;

    while ((buildingMatch = buildingRegex.exec(buildingText)) !== null) {
      if (buildingMatch.index === buildingRegex.lastIndex) {
        buildingRegex.lastIndex++;
      }

      const building = JSON.parse(buildingMatch[0]);

      if (!building.hasOwnProperty('building_type') || building.building_type !== 2 || !building.hasOwnProperty('personal_count') || building.personal_count !== 3 || !building.hasOwnProperty('level') || building.level !== null) {
        continue;
      }

      form.append('building_ids[]', building.id.toString());
      buildingsFound[building.id] = building.name;
      buildingFound = true;
    }

    if (!buildingFound) {
      return;
    }

    const vehiclesResponse = await fetch('/buildings/vehiclesMap', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: new URLSearchParams(form)
    });

    if (!vehiclesResponse.ok) {
      return;
    }

    const vehicleText = await vehiclesResponse.text();

    const vehicleRegex = new RegExp(`{[^}]+}`, 'g');
    let vehicleMatch;

    while ((vehicleMatch = vehicleRegex.exec(vehicleText)) !== null) {
      if (vehicleMatch.index === vehicleRegex.lastIndex) {
        vehicleRegex.lastIndex++;
      }

      const vehicle = JSON.parse(vehicleMatch[0]);

      if (!vehicle.hasOwnProperty('fms') || vehicle.fms !== 2 || !vehicle.hasOwnProperty('c') || vehicle.c !== 'RTW' || !vehicle.hasOwnProperty('b') || !buildingsFound.hasOwnProperty(vehicle.b)) {
        continue;
      }

      await destroyBuilding(vehicle.b, buildingsFound[vehicle.b], 250);
    }
  }

  async function getMissionsWithPatientsAtEnd() {
    const missions = await getAllData(db, 'missions');

    return [...new Set(missions.filter(mission => !mission.hasOwnProperty('additional') || !mission.additional.hasOwnProperty('patient_at_end_of_mission') || mission.additional.patient_at_end_of_mission !== true).map(mission => mission.base_mission_id))];
  }

  function getRandomBuildingIdentifier() {
    const identifier = Math.round(Math.random() * 100000);
    const buildingName = buildingPrefix + identifier.toString();

    if (buildingIdentifiers.hasOwnProperty(buildingName)) {
      return getRandomBuildingIdentifier();
    }

    buildingIdentifiers[buildingName] = null;

    return buildingName;
  }

  function getNewBuildingId(text, identifier) {
    const regex = new RegExp(`{"id":([0-9]+?),"user_id":${user_id},"name":"${RegExp.escape(identifier)}",[^}]+}`, 'g');
    let match;
    let id = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      if (match[1]) {
        const newId = parseInt(match[1], 10);

        if (newId > id) {
          id = newId;
        }
      }
    }

    return id ? id : null;
  }
})();
