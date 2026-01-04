// ==UserScript==
// @name         Torn Custom Race Presets (Legacy-safe)
// @namespace    https://greasyfork.org/en/scripts/393632-torn-custom-race-presets
// @version      0.2.4
// @description  Faster custom races with presets (ES5 + TM Legacy compatible)
// @author       Cryosis7 [926640] + tweaks
// @match        *://www.torn.com/loader.php?sid=racing*
// @match        *://www.torn.com/page.php?sid=racing*
// @include      *://www.torn.com/*sid=racing*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553563/Torn%20Custom%20Race%20Presets%20%28Legacy-safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553563/Torn%20Custom%20Race%20Presets%20%28Legacy-safe%29.meta.js
// ==/UserScript==

/**
 * Edit presets as you wish. Any field you omit will be left as-is in the form.
 */
var presets = [
  { name: "Docks 100Laps",       maxDrivers: 2, trackName: "Docks",       numberOfLaps: 100, upgradesAllowed: true,  betAmount: 0, waitTime: 0, password: "" },
  { name: "Industrial 100Laps",  maxDrivers: 2, trackName: "Industrial",  numberOfLaps: 100, upgradesAllowed: true,  betAmount: 0, waitTime: 0, password: "" },
  { name: "Uptown 100Laps",      maxDrivers: 2, trackName: "Uptown",      numberOfLaps: 100, upgradesAllowed: true,  betAmount: 0, waitTime: 0, password: "" },
  { name: "Withdrawal 100Laps",  maxDrivers: 2, trackName: "Withdrawal",  numberOfLaps: 100, upgradesAllowed: true,  betAmount: 0, waitTime: 0, password: "" },
  { name: "Underdog 100Laps",    maxDrivers: 2, trackName: "Underdog",    numberOfLaps: 100, upgradesAllowed: true,  betAmount: 0, waitTime: 0, password: "" },
  { name: "Parkland 100Laps",    maxDrivers: 2, trackName: "Parkland",    numberOfLaps: 100, upgradesAllowed: true,  betAmount: 0, waitTime: 0, password: "" },
  { name: "Commerce 100Laps",    maxDrivers: 2, trackName: "Commerce",    numberOfLaps: 100, upgradesAllowed: true,  betAmount: 0, waitTime: 0, password: "" },
  { name: "Two Islands 100Laps", maxDrivers: 2, trackName: "Two Islands", numberOfLaps: 100, upgradesAllowed: true,  betAmount: 0, waitTime: 0, password: "" },
  { name: "Vector 100Laps",      maxDrivers: 2, trackName: "Vector",      numberOfLaps: 100, upgradesAllowed: true,  betAmount: 0, waitTime: 0, password: "" },
  { name: "Mudpit 100Laps",      maxDrivers: 2, trackName: "Mudpit",      numberOfLaps: 100, upgradesAllowed: true,  betAmount: 0, waitTime: 0, password: "" },
  { name: "Hammerhead 100Laps",  maxDrivers: 2, trackName: "Hammerhead",  numberOfLaps: 100, upgradesAllowed: true,  betAmount: 0, waitTime: 0, password: "" },
  { name: "Sewage 100Laps",      maxDrivers: 2, trackName: "Sewage",      numberOfLaps: 100, upgradesAllowed: true,  betAmount: 0, waitTime: 0, password: "" },
  { name: "Meltdown 100Laps",    maxDrivers: 2, trackName: "Meltdown",    numberOfLaps: 100, upgradesAllowed: true,  betAmount: 0, waitTime: 0, password: "" },
  { name: "Speedway 100Laps",    maxDrivers: 2, trackName: "Speedway",    numberOfLaps: 100, upgradesAllowed: true,  betAmount: 0, waitTime: 0, password: "" },
  { name: "Stone Park 100Laps",  maxDrivers: 2, trackName: "Stone Park",  numberOfLaps: 100, upgradesAllowed: true,  betAmount: 0, waitTime: 0, password: "" },
  { name: "Convict 100Laps",     maxDrivers: 2, trackName: "Convict",     numberOfLaps: 100, upgradesAllowed: true,  betAmount: 0, waitTime: 0, password: "" }
];

(function () {
  'use strict';

  // Use page jQuery; TM Legacy can isolate $ unless @grant none is used
  var $ = window.jQuery || (typeof unsafeWindow !== 'undefined' ? unsafeWindow.jQuery : null);

  // Simple waiter (polling) — robust on Legacy
  function waitFor(testFn, cb, interval, timeout) {
    var iv = interval || 100, to = timeout || 20000, t = 0;
    var id = setInterval(function () {
      if (testFn()) { clearInterval(id); cb(); }
      t += iv;
      if (t >= to) clearInterval(id);
    }, iv);
  }

  function toTitleCase(str) {
    str = String(str || '');
    var parts = str.toLowerCase().split(' ');
    for (var i = 0; i < parts.length; i++) {
      var s = parts[i];
      parts[i] = s ? s.charAt(0).toUpperCase() + s.substring(1) : s;
    }
    return parts.join(' ');
  }

  function scrubPresets() {
    for (var i = 0; i < presets.length; i++) {
      var x = presets[i];
      if (x.name && x.name.length > 25) x.name = x.name.substring(0, 25);
      if (x.maxDrivers != null) x.maxDrivers = x.maxDrivers > 100 ? 100 : (x.maxDrivers < 2 ? 2 : x.maxDrivers);
      if (x.trackName != null) x.trackName = toTitleCase(x.trackName);
      if (x.numberOfLaps != null) x.numberOfLaps = x.numberOfLaps > 100 ? 100 : (x.numberOfLaps < 1 ? 1 : x.numberOfLaps);
      if (x.upgradesAllowed != null) x.upgradesAllowed = !!x.upgradesAllowed;
      if (x.betAmount != null) x.betAmount = x.betAmount > 10000000 ? 10000000 : (x.betAmount < 0 ? 0 : x.betAmount);
      if (x.waitTime != null) x.waitTime = x.waitTime > 2880 ? 2880 : (x.waitTime < 0 ? 0 : x.waitTime); // allow 0
      if (x.password && x.password.length > 25) x.password = x.password.substring(0, 25);
    }
  }

  function setSelectByVisibleText(selectSelector, visibleText) {
    var $sel = $(selectSelector);
    if ($sel.length === 0) return;
    var target = String(visibleText || '').toLowerCase();
    var $opt = $sel.find('option').filter(function () {
      return $(this).text().replace(/^\s+|\s+$/g, '').toLowerCase() === target;
    }).first();
    if ($opt.length) {
      $sel.val($opt.val()).trigger('change');
      try { if ($sel.selectmenu) { $sel.selectmenu('refresh'); } } catch (e) {}
    }
  }

  function fillPreset(index) {
    var race = presets[index];
    if (!race) return;

    if ("name" in race) $('.race-wrap div.input-wrap input').val(race.name).trigger('input').trigger('change');
    if ("maxDrivers" in race) $('.drivers-max-wrap div.input-wrap input').val(race.maxDrivers).trigger('input').trigger('change');
    if ("numberOfLaps" in race) $('.laps-wrap > .input-wrap > input').val(race.numberOfLaps).trigger('input').trigger('change');
    if ("betAmount" in race) $('.bet-wrap > .input-wrap > input').val(race.betAmount).trigger('input').trigger('change');
    if ("waitTime" in race) $('.time-wrap > .input-wrap > input').val(race.waitTime).trigger('input').trigger('change');
    if ("password" in race) $('.password-wrap > .input-wrap > input').val(race.password).trigger('input').trigger('change');

    if ("trackName" in race) setSelectByVisibleText('#select-racing-track', race.trackName);
    if ("upgradesAllowed" in race) setSelectByVisibleText('#select-allow-upgrades', race.upgradesAllowed ? "Allow upgrades" : "Stock cars only");
  }

  function drawPresetBar() {
    var $container = $('#racingAdditionalContainer > .form-custom-wrap');
    if ($container.length === 0) return;

    // Remove an existing bar to avoid duplicates
    $('#race-presets-bar').remove();

    // Build buttons with string concatenation (no template literals)
    var btns = '';
    for (var i = 0; i < presets.length; i++) {
      var el = presets[i];
      var label = (el && el.name) ? el.name : ("Preset " + (i + 1));
      btns += '<button class="torn-btn preset-btn" data-index="' + i + '" style="margin:0 10px 10px 0">' + label + '</button>';
    }

    var html = ''
      + '<div id="race-presets-bar" class="filter-container m-top10">'
      + '  <div class="title-gray top-round">Race Presets</div>'
      + '  <div class="cont-gray p10 bottom-round">' + btns + '</div>'
      + '</div>';

    $container.before(html);

    // Click handlers
    $('#race-presets-bar .preset-btn').each(function () {
      var idx = parseInt(this.getAttribute('data-index'), 10);
      this.onclick = function () { fillPreset(idx); };
    });
  }

  function init() {
    // ensure we really have page jQuery
    if (!window.jQuery) return; // give up if page has no jQuery
    scrubPresets();
    drawPresetBar();

    // Re-add bar when racing form (re)loads via AJAX
    try {
      // Use page's jQuery ajaxComplete — works better than document
      $(document).ajaxComplete(function (e, xhr, settings) {
        try {
          var url = settings && settings.url ? settings.url : '';
          if (url.indexOf('section=createCustomRace') >= 0) {
            scrubPresets();
            drawPresetBar();
          }
        } catch (ignore) {}
      });
    } catch (ignore2) {}

    // Poll as a fallback (Legacy-safe)
    setInterval(function () {
      if ($('#racingAdditionalContainer .form-custom-wrap').length && !$('#race-presets-bar').length) {
        scrubPresets();
        drawPresetBar();
      }
    }, 1500);
  }

  // Wait for jQuery and the racing form to exist
  waitFor(function () {
    return (window.jQuery || (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery)) &&
           document.getElementById('racingAdditionalContainer');
  }, init, 100, 25000);
})();
