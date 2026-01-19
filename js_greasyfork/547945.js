// ==UserScript==
// @name         [Torn] Racing Presets
// @namespace    azraelkun
// @version      1.2
// @description  XP Docks and 1 Lap Races
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @author       azraelkun
// @match        https://www.torn.com/page.php?sid=racing*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547945/%5BTorn%5D%20Racing%20Presets.user.js
// @updateURL https://update.greasyfork.org/scripts/547945/%5BTorn%5D%20Racing%20Presets.meta.js
// ==/UserScript==

// Originally based on Shlefter's Speedway userscript

const tracks = {
    "Uptown": "6",
    "Withdrawal": "7",
    "Underdog": "8",
    "Parkland": "9",
    "Docks": "10",
    "Commerce": "11",
    "Two Islands": "12",
    "Industrial": "15",
    "Vector": "16",
    "Mudpit": "17",
    "Hammerhead": "18",
    "Sewage": "19",
    "Meltdown": "20",
    "Speedway": "21",
    "Stone Park": "23",
    "Convict": "24"
}

const cars = {
    "Uptown": "880705",
    "Withdrawal": "880705",
    "Underdog": "895427",
    "Parkland": "852402",
    "Docks": "913522",
    "Commerce": "895427",
    "Two Islands": "987929",
    "Industrial": "827753",
    "Vector": "827753",
    "Mudpit": "966318",
    "Hammerhead": "949106",
    "Sewage": "895427",
    "Meltdown": "827753",
    "Speedway": "880705",
    /*"Stone Park": "852402",*/
    "Stone Park": "1182511",
    "Convict": "935086"
}

/*
1182511 - DS3: Stone Park (RNG)
987929 - DL3: Two Islands
935086 - TL3: Convict
913522 - TL3: Docks
880705 - TL3: Speedway / Uptown / Withdrawal
852402 - DS3: Parkland / Stone Park
827753 - TS3: Industrial / Meltdown / Vector
949106 - DS2: Hammerhead
895427 - TS2: Commerce / Sewer / Underdog
966318 - DL3: Mudpit
*/

const race_preset_div = "racing-presets";

function addXPDocks() {
    const carID = '913522'; // Volt GT
    const trackID = tracks["Docks"];
    const maxDrivers = 2;
    const raceTitle = 'XP Docks'.replaceAll(" ", "+");
    const buttonTitle = "Docks XP";
    const buttonID = buttonTitle.replaceAll(" ", "");
    const numLaps = 100;

    const button = `<button id="${buttonID}" class="torn-btn btn-small" style="margin-left: 5px">${buttonTitle}</button>`;
    $(`#${race_preset_div}`).append(button);

    // Attach click event listener directly to the button
    $(`#${buttonID}`).on('click', (event) => {
        // Construct the URL to redirect to
        const url = `https://torn.com/loader.php?sid=racing&tab=customrace&action=getInRace&step=getInRace&id=&carID=${carID}&createRace=true&title=${raceTitle}&minDrivers=2&maxDrivers=${maxDrivers}&trackID=${trackID}&laps=${numLaps}&minClass=5&carsTypeAllowed=1&carsAllowed=5&betAmount=0&waitTime=${Math.floor(Date.now()/1000)}&rfcv=${getRFC()}`;

        // Redirect to the constructed URL
        window.location = url;
    });
}

function addQuickSelector() {
    const numLaps = 1;
    const maxDrivers = 2;

    const trackoptions = Object.keys(tracks).map(t => `<option>${t}</option>`).join("");
    const html = `<span style="display: inline-flex;border: solid 2px gray;padding: 3px;border-radius: 5px;margin-left: 5px;"><select id="quick-selector-track">${trackoptions}</select><button id="quick-selector-btn" class="torn-btn btn-small">Quick</button></span>`;
    $(`#${race_preset_div}`).append(html);

    // Attach click event listener directly to the button
    $(`#quick-selector-btn`).on('click', (event) => {
        var track = document.querySelector("#quick-selector-track").value;
        var carID = cars[track];
        var trackID = tracks[track];
        var raceTitle = `Quick ${track}`.replaceAll(" ", "+");

        // Construct the URL to redirect to
        const url = `https://torn.com/loader.php?sid=racing&tab=customrace&action=getInRace&step=getInRace&id=&carID=${carID}&createRace=true&title=${raceTitle}&minDrivers=2&maxDrivers=${maxDrivers}&trackID=${trackID}&laps=${numLaps}&minClass=5&carsTypeAllowed=1&carsAllowed=5&betAmount=0&waitTime=${Math.floor(Date.now()/1000)}&rfcv=${getRFC()}`;

        // Redirect to the constructed URL
        window.location = url;
    });
}

function addVroom() {
    const password = "vroom";
    const track = "Speedway";
    const numLaps = 1;

    const carID = cars[track];
    const trackID = tracks[track];
    const maxDrivers = 2;
    const raceTitle = `azraelkun's race`.replaceAll(" ", "+");

    const buttonTitle = "vroom";
    const buttonID = buttonTitle.replaceAll(" ", "");
    const button = `<button id="${buttonID}" class="torn-btn btn-small" style="margin-left: 5px">${buttonTitle}</button>`;
    $(`#${race_preset_div}`).append(button);

    // Attach click event listener directly to the button
    $(`#${buttonID}`).on('click', (event) => {
        // Construct the URL to redirect to
        const url = `https://torn.com/loader.php?sid=racing&tab=customrace&action=getInRace&step=getInRace&id=&carID=${carID}&password=${password}&createRace=true&title=${raceTitle}&minDrivers=2&maxDrivers=${maxDrivers}&trackID=${trackID}&laps=${numLaps}&minClass=5&carsTypeAllowed=1&carsAllowed=5&betAmount=0&waitTime=${Math.floor(Date.now()/1000)}&rfcv=${getRFC()}`;

        // Redirect to the constructed URL
        window.location = url;
    });
}


/*
function quickConvict() {
  const carID = '935086';
  const trackID = tracks["Convict"];
  const maxDrivers = 2;
  const raceTitle = 'Quick Convict'.replaceAll(" ", "+");;
  const buttonTitle = "QuickConvict";
  const numLaps = 1;

  if ($('div.content-title > h4').length > 0 && $(`#${buttonTitle}`).length < 1) {
    const button = `<button id="${buttonTitle}" style="margin-right: 5">${buttonTitle}</button>`;
    $(`#${race_preset_div}`).append(button);

    // Attach click event listener directly to the button
    $(`#${buttonTitle}`).on('click', (event) => {
      // Construct the URL to redirect to
      const url = `https://torn.com/loader.php?sid=racing&tab=customrace&action=getInRace&step=getInRace&id=&carID=${carID}&createRace=true&title=${raceTitle}&minDrivers=2&maxDrivers=${maxDrivers}&trackID=${trackID}&laps=${numLaps}&minClass=5&carsTypeAllowed=1&carsAllowed=5&betAmount=0&waitTime=${Math.floor(Date.now()/1000)}&rfcv=${getRFC()}`;

      // Redirect to the constructed URL
      window.location = url;
    });
  }
}

function quickHammerhead() {
  const carID = '949106';
  const trackID = tracks["Hammerhead"];
  const maxDrivers = 2;
  const raceTitle = 'Quick Hammerhead'.replaceAll(" ", "+");;
  const buttonTitle = "QuickHammerhead";
  const numLaps = 1;

  if ($('div.content-title > h4').length > 0 && $(`#${buttonTitle}`).length < 1) {
    const button = `<button id="${buttonTitle}" style="margin-right: 5">${buttonTitle}</button>`;
    $(`#${race_preset_div}`).append(button);

    // Attach click event listener directly to the button
    $(`#${buttonTitle}`).on('click', (event) => {
      // Construct the URL to redirect to
      const url = `https://torn.com/loader.php?sid=racing&tab=customrace&action=getInRace&step=getInRace&id=&carID=${carID}&createRace=true&title=${raceTitle}&minDrivers=2&maxDrivers=${maxDrivers}&trackID=${trackID}&laps=${numLaps}&minClass=5&carsTypeAllowed=1&carsAllowed=5&betAmount=0&waitTime=${Math.floor(Date.now()/1000)}&rfcv=${getRFC()}`;

      // Redirect to the constructed URL
      window.location = url;
    });
  }
}

function quickTwoIslands() {
  const carID = '987929'; // Edomondo NSX
  const trackID = tracks["Two Islands"];
  const maxDrivers = 2;
  const raceTitle = 'Quick Two Islands'.replaceAll(" ", "+");;
  const buttonTitle = "QuickTwoIslands";
  const numLaps = 1;

  if ($('div.content-title > h4').length > 0 && $(`#${buttonTitle}`).length < 1) {
    const button = `<button id="${buttonTitle}" style="margin-right: 5">${buttonTitle}</button>`;
    $(`#${race_preset_div}`).append(button);

    // Attach click event listener directly to the button
    $(`#${buttonTitle}`).on('click', (event) => {
      // Construct the URL to redirect to
      const url = `https://torn.com/loader.php?sid=racing&tab=customrace&action=getInRace&step=getInRace&id=&carID=${carID}&createRace=true&title=${raceTitle}&minDrivers=2&maxDrivers=${maxDrivers}&trackID=${trackID}&laps=${numLaps}&minClass=5&carsTypeAllowed=1&carsAllowed=5&betAmount=0&waitTime=${Math.floor(Date.now()/1000)}&rfcv=${getRFC()}`;

      // Redirect to the constructed URL
      window.location = url;
    });
  }
}
*/

(function() {
    'use strict';

    if (document.querySelector('div[id=racingMainContainer]') && document.querySelector(`#${race_preset_div}`) == null) {
        document.querySelector('div[id=racingMainContainer]').insertAdjacentHTML("beforebegin", `<div id="${race_preset_div}" style="margin-left: -5px;"></div>`);
        addXPDocks();
        addQuickSelector();
        addVroom();
        //quickConvict();
        //quickHammerhead();
        //quickTwoIslands();
    }
})();
