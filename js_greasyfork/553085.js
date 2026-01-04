// ==UserScript==
// @name         GeoGuessr Globetrotter Turbo Mode Level Locations Export
// @namespace    https://greasyfork.org/users/1340965-zecageo
// @version      1.0
// @description  Export the locations from the current turbo mode level as a json file
// @author       ZecaGeo <zecageo@protonmail.com>
// @run-at       document-end
// @match        https://www.geoguessr.com/api/v4/globetrotter/trip/current
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @license      MIT
// @copyright    2025, ZecaGeo <zecageo@protonmail.com>
// @downloadURL https://update.greasyfork.org/scripts/553085/GeoGuessr%20Globetrotter%20Turbo%20Mode%20Level%20Locations%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/553085/GeoGuessr%20Globetrotter%20Turbo%20Mode%20Level%20Locations%20Export.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const inputJson = document.querySelector("body > pre").innerText;
  const data = JSON.parse(inputJson);
  const locations = data.currentVisit.currentTurboModeLevel.locations;
  const outputJson = JSON.stringify(locations, null, 4);
  const blob = new Blob([outputJson], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "geoguessr_turbo_mode_locations.json";
  a.click();
  URL.revokeObjectURL(url);
})();
