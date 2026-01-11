// ==UserScript==
// @name         Torn Custom Race Presets custom
// @namespace    custom.underko
// @version      0.0.4
// @description  Make it easier and faster to make custom races - Extended from Xiphias's - TornPDA Compatible
// @author       Cryosis7 [926640]
// @match        *.torn.com/*racing*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/562197/Torn%20Custom%20Race%20Presets%20custom.user.js
// @updateURL https://update.greasyfork.org/scripts/562197/Torn%20Custom%20Race%20Presets%20custom.meta.js
// ==/UserScript==
 
/**
 * Modify the presets as you see fit, you can add and remove presets,
 * or remove individual fields within the preset to only use the fields you care about.
 *
 * TEMPLATE
 * {
        name: "Appears as the button name and the public name of the race",
        maxDrivers: 6,
        trackName: "Industrial",
        numberOfLaps: 1,
        upgradesAllowed: true,
        betAmount: 0,
        startTime: 1,
        password: "",
    },
 */
var presets = [
    {
        name: "URTP35",
        maxDrivers: 100,
        trackName: "Parkland",
        numberOfLaps: 10,
        startTime: "Today 12:00 TCT",
    },
    {
        name: "URTD35",
        maxDrivers: 100,
        trackName: "Docks",
        numberOfLaps: 10,
        startTime: "Today 12:00 TCT",
    },
    {
        name: "URTV35",
        maxDrivers: 100,
        trackName: "Vector",
        numberOfLaps: 10,
        startTime: "Today 12:00 TCT",
    },
    {
        name: "1 Lap Speedway",
        maxDrivers: 100,
        trackName: "Speedway",
        numberOfLaps: 1
    },
    {
        name: "80 LAP, MORE PPL/MORE XP",
        maxDrivers: 100,
        trackName: "Speedway",
        numberOfLaps: 80
    },
    {
        name: "XP Docks",
        maxDrivers: 100,
        trackName: "Docks",
        numberOfLaps: 100
    },
    {
        name: "XP Withdrawal",
        maxDrivers: 100,
        trackName: "Withdrawal",
        numberOfLaps: 100
    },
];
 
(function() {
    'use strict';
    
    console.log(`[TCRP] init`);
 
    scrubPresets();
 
    // Desktop site support - AJAX detection
    $('body').ajaxComplete(function(e, xhr, settings) {
        var createCustomRaceSection = "section=createCustomRace";
        var url = settings.url;
        if (url.indexOf(createCustomRaceSection) >= 0) {
            scrubPresets();
            drawPresetBar();
        }
    });
    
    // Mobile/TornPDA support - MutationObserver
    const observer = new MutationObserver((mutations) => {
        // Check if we're on the create custom race section AND the form exists
        if (window.location.href.includes('section=createCustomRace') && 
            document.querySelector('.race-wrap') && 
            !document.querySelector('.filter-container')) {
            scrubPresets();
            drawPresetBar();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
 
})();
 
function fillPreset(index) {
    console.log(`[TCRP] fillPreset`);
    let race = presets[index];
 
    if ("name" in race) $('.race-wrap div.input-wrap input').attr('value', race.name);
    if ("maxDrivers" in race) $('.drivers-max-wrap div.input-wrap input').attr('value', race.maxDrivers);
    if ("numberOfLaps" in race) $('.laps-wrap > .input-wrap > input').attr('value', race.numberOfLaps);
    if ("betAmount" in race) $('.bet-wrap > .input-wrap > input').attr('value', race.betAmount);
    if ("password" in race) $('.password-wrap > .input-wrap > input').attr('value', race.password);
 
    if ("trackName" in race) {
        $('#select-racing-track').selectmenu();
        $('#select-racing-track-menu > li:contains(' + race.trackName + ')').mouseup();
    }
    if ("upgradesAllowed" in race) {
        $('#select-allow-upgrades').selectmenu();
        $('#select-allow-upgrades-menu > li:contains(' + race.upgradesAllowedString + ')').mouseup();
    }
    if ("startTime" in race) {
        $('#wait-time').selectmenu();
        $('#wait-time-menu li a:contains("' + race.startTime + '")').mouseup();
    }
}
 
function scrubPresets() {
    presets.forEach(x => {
        console.log(`[TCRP] scrub ${x.name}`);
        
        if ("name" in x && x.name.length > 25) x.name = x.name.substring(0, 26);
        if ("maxDrivers" in x) x.maxDrivers = (x.maxDrivers > 100) ? 100 : (x.maxDrivers < 2) ? 2 : x.maxDrivers;
        if ("trackName" in x) x.trackName.toLowerCase().split(' ').map(x => x.charAt(0).toUpperCase() + x.substring(1)).join(' ');
        if ("numberOfLaps" in x) x.numberOfLaps = (x.numberOfLaps > 100) ? 100 : (x.numberOfLaps < 1) ? 1 : x.numberOfLaps;
        if ("upgradesAllowed" in x) x.upgradesAllowedString = x.upgradesAllowed ? "Allow upgrades" : "Stock cars only";
        if ("betAmount" in x) x.betAmount = (x.betAmount > 10000000) ? 10000000 : (x.betAmount < 0) ? 0 : x.betAmount;
        if ("password" in x && x.password.length > 25) x.password = x.password.substring(0, 26);
    })
}
 
function drawPresetBar() {
    console.log(`[TCRP] drawPresetBar`);
    let filterBar = $(`
  <div class="filter-container m-top10">
    <div class="title-gray top-round">Race Presets</div>
 
    <div class="cont-gray p10 bottom-round">
        ${presets.map((element, index) => `<button class="torn-btn preset-btn" style="margin:0 10px 10px 0">${("name" in element) ? element.name : "Preset " + (+index + 1)}</button>`)}
    </div>
  </div>`);
 
    $('#racingAdditionalContainer > .form-custom-wrap').before(filterBar);
    $('.preset-btn').each((index, element) => element.onclick = function() {fillPreset(index)});
}