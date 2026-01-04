// ==UserScript==
// @name         Creditsgrenze für Missionen / Save
// @namespace    _fork_
// @version      1.2
// @license      MIT
// @description  Blendet alle Einsätze unterhalb einem bestimmten Credits-Wert aus.
// @author       _fork
// @require      https://update.greasyfork.org/scripts/555340/Skripteinstellungen%20%20Save-Version.user.js
// @match        https://*.leitstellenspiel.de
// @match        https://*.leitstellenspiel.de/settings/index*
// @match        https://*.meldkamerspel.com
// @match        https://*.meldkamerspel.com/settings/index*
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/555527/Creditsgrenze%20f%C3%BCr%20Missionen%20%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/555527/Creditsgrenze%20f%C3%BCr%20Missionen%20%20Save.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  const OWN_MISSION_CREDITS_THRESHOLD_STORAGE_KEY = 'own_mission_credits_threshold';
  const OWN_MISSION_CREDITS_THRESHOLD_DEFAULT = 1100;
  const ALLIANCE_MISSION_CREDITS_THRESHOLD_STORAGE_KEY = 'alliance_mission_credits_threshold';
  const ALLIANCE_MISSION_CREDITS_THRESHOLD_DEFAULT = 0;
  const SHOW_OWN_MISSION_WITH_PRISONERS_STORAGE_KEY = 'show_own_mission_with_prisoners';

  if (location.pathname.startsWith('/settings/index')) {
    await addOptions({
      'identifier': 'credits_limit_for_missions',
      'title': 'Creditsgrenze für Missionen',
      'settings': [
        {
          'type': 'header',
          'text': 'Allgemeine Einstellungen'
        },
        {
          'type': 'number',
          'key': OWN_MISSION_CREDITS_THRESHOLD_STORAGE_KEY,
          'label': 'Creditsgrenze für eigene Missionen (Neuladen nach Änderung erforderlich)',
          'min': 0,
          'default': OWN_MISSION_CREDITS_THRESHOLD_DEFAULT
        },
        {
          'type': 'number',
          'key': ALLIANCE_MISSION_CREDITS_THRESHOLD_STORAGE_KEY,
          'label': 'Creditsgrenze für Allianz-Missionen (Neuladen nach Änderung erforderlich)',
          'min': 0,
          'default': ALLIANCE_MISSION_CREDITS_THRESHOLD_DEFAULT
        },
        {
          'type': 'checkbox',
          'key': SHOW_OWN_MISSION_WITH_PRISONERS_STORAGE_KEY,
          'label': 'Missionen mit Gefangenen immer anzeigen (Neuladen nach Änderung erforderlich)'
        }
      ]
    });
    return;
  }

  const OWN_MISSION_CREDITS_THRESHOLD = await GM.getValue(OWN_MISSION_CREDITS_THRESHOLD_STORAGE_KEY, OWN_MISSION_CREDITS_THRESHOLD_DEFAULT);
  const ALLIANCE_MISSION_CREDITS_THRESHOLD = await GM.getValue(ALLIANCE_MISSION_CREDITS_THRESHOLD_STORAGE_KEY, ALLIANCE_MISSION_CREDITS_THRESHOLD_DEFAULT);
  const SHOW_OWN_MISSION_WITH_PRISONERS = await GM.getValue(SHOW_OWN_MISSION_WITH_PRISONERS_STORAGE_KEY, false);

  const missionMarkerAddOrig = missionMarkerAdd;
  missionMarkerAdd = (mission) => {
    if (!isMissionFiltered(mission)) {
      missionMarkerAddOrig(mission);
    }
  }

  const missionMarkerAddSingleOrig = missionMarkerAddSingle;
  missionMarkerAddSingle = (mission) => {
    if (!isMissionFiltered(mission)) {
      missionMarkerAddSingleOrig(mission);
    }
  }

  const processMissionElementOrig = processMissionElement;
  processMissionElement = (mission, t, i) => {
    if (!isMissionFiltered(mission)) {
      processMissionElementOrig(mission, t, i);
    }
  }

  function isMissionFiltered(mission) {
    if (mission.user_id === user_id && mission.average_credits <= OWN_MISSION_CREDITS_THRESHOLD && (!SHOW_OWN_MISSION_WITH_PRISONERS || mission.prisoners_count === 0)) {
      return true;
    } else if (mission.user_id !== user_id && mission.average_credits <= ALLIANCE_MISSION_CREDITS_THRESHOLD) {
      return true;
    }

    return false;
  }
})();
