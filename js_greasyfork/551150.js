// ==UserScript==
// @name         Flight ETA Display
// @namespace    ShittyTornETADisplayer
// @version      1.1
// @description  Display Baby Champers member's estimated flight return time on their profile
// @author       Jeyno
// @match        https://www.torn.com/profiles.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551150/Flight%20ETA%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/551150/Flight%20ETA%20Display.meta.js
// ==/UserScript==

const flying_times = {
  Mexico:  				  {standard:  26, airstrip:  18, private:  13, business:  8},
  Cayman: 				  {standard:  35, airstrip:  25, private:  18, business: 11},
  Canada: 				  {standard:  41, airstrip:  29, private:  20, business: 12},
  Hawaii: 				  {standard: 134, airstrip:  94, private:  67, business: 40},
  "United Kingdom": 	  {standard: 159, airstrip: 171, private:  80, business: 48},
  Argentina: 			  {standard: 167, airstrip: 117, private:  83, business: 50},
  Switzerland: 			  {standard: 175, airstrip: 123, private:  88, business: 53},
  Japan: 				  {standard: 225, airstrip: 158, private: 113, business: 68},
  China: 				  {standard: 242, airstrip: 169, private: 121, business: 72},
  "United Arab Emirates": {standard: 271, airstrip: 190, private: 135, business: 81},
  "South Africa":         {standard: 297, airstrip: 208, private: 149, business: 89}
};

function TCT(unixEpoch) {
  const date = new Date(unixEpoch * 1000);
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
}

function getJSON() {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://raw.githubusercontent.com/Jeyn-o/OC_Stalker/refs/heads/main/BC_cron.JSON',
      onload: function(response) {
        if (response.status === 200) {
          try {
            const data = JSON.parse(response.responseText);
            resolve(data);
          } catch (err) {
            reject(`JSON parse error: ${err}`);
          }
        } else {
          reject(`Failed to load JSON, status: ${response.status}`);
        }
      },
      onerror: function(err) {
        reject(err);
      }
    });
  });
}

function formatFlightRange(base_unix, flightTimeSecs) {
  const minETA = base_unix - Math.round(flightTimeSecs * 0.04);
  const maxETA = base_unix + Math.round(flightTimeSecs * 0.04);
  return `Between ${TCT(minETA)} and ${TCT(maxETA)}`;
}

(async function() {
  'use strict';
  await new Promise(resolve => setTimeout(resolve, 200));
  const factionLink = document.querySelector('ul.info-table li a.t-blue');
  const isInFaction = factionLink && factionLink.textContent.trim() === "Baby Champers";
  //console.log("Player is member of Baby Champers:", isInFaction);
  if (!isInFaction) return;
  const idNameSpan = Array.from(document.querySelectorAll('ul.info-table li span.bold'))
    .find(span => span.textContent.includes('[') && span.textContent.includes(']'));
  if (!idNameSpan) return;
  const match = idNameSpan.textContent.match(/\[(\d+)\]/);
  const userID = match ? match[1] : null;
  //console.log("Player ID is:", userID);
  if (!userID) return;
  const mainDesc = document.querySelector('.profile-status .main-desc');
  const subDesc = document.querySelector('.profile-status .sub-desc');
  if (!mainDesc || !subDesc) return;

  const mainText = mainDesc.textContent.trim();
  //console.log("Status message is:", mainText);

  const isReturning = mainText.includes("Returning");
  const isGoing = mainText.includes("Traveling to");
  const isIdleAbroad = mainText.startsWith("In ");
  if (!isReturning && !isGoing && !isIdleAbroad) return;
  let country = null;
  if (isReturning) {
    const match = mainText.match(/from (.+)$/);
    if (match) country = match[1].trim();
  } else if (isGoing) {
    const match = mainText.match(/to (.+)$/);
    if (match) country = match[1].trim();
  } else if (isIdleAbroad) {
    const match = mainText.match(/^In (.+)$/);
    if (match) country = match[1].trim();
  }
  if (!country || !flying_times[country]) return;

  try {
    const fulllist = await getJSON();
    const userData = fulllist[userID];
    if (!userData || !userData.activities || !userData.activities.length) return;

    const latestActivity = userData.activities[userData.activities.length - 1];
    //console.log("Player activity entry:", latestActivity);

    if (isIdleAbroad) {
      let travelType = latestActivity?.travel_type || null;
      if (!travelType && userData.activities.length >= 2) {
        const previousActivity = userData.activities[userData.activities.length - 2];
        travelType = previousActivity?.travel_type || null;
      }
      if (!travelType) return;
      const flightTimeMins = flying_times[country][travelType] || flying_times[country]["standard"];
      const flightTimeSecs = flightTimeMins * 60;
      const now = Math.floor(Date.now() / 1000);
      const eta_unix = now + flightTimeSecs;
      const rangeText = formatFlightRange(eta_unix, flightTimeSecs);
      subDesc.innerHTML = `Soonest ETA: <span title="${rangeText}">${TCT(eta_unix)} TCT</span>`;
      return;
    }
    if (!latestActivity || !latestActivity.travel_type || latestActivity.end !== null) return;
    const travelType = latestActivity.travel_type;
    const start = latestActivity.start;
    const flightTimeMins = flying_times[country][travelType];
    const flightTimeSecs = flightTimeMins * 60;
    let eta_unix;
    let return_eta_unix;
    if (isReturning) {
      eta_unix = start + flightTimeSecs;
      const rangeText = formatFlightRange(eta_unix, flightTimeSecs);
      subDesc.innerHTML = `ETA: <span title="${rangeText}">${TCT(eta_unix)} TCT</span>`;
    } else if (isGoing) {
      eta_unix = start + flightTimeSecs;
      return_eta_unix = eta_unix + flightTimeSecs;
      const rangeTextOutbound = formatFlightRange(eta_unix, flightTimeSecs);
      const rangeTextReturn = formatFlightRange(return_eta_unix, flightTimeSecs);
      subDesc.innerHTML = `ETA: <span title="${rangeTextOutbound}">${TCT(eta_unix)} TCT</span> - soonest return <span title="${rangeTextReturn}">${TCT(return_eta_unix)} TCT</span>`;
    }
  } catch (error) {
    console.error("ETA Script Error:", error);
  }
})();
