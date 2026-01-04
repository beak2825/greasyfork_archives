// ==UserScript==
// @name         Phantom Isles Time for Wolfery
// @name:de      Phantom Isles Zeit-Popup für Wolfery
// @namespace    https://forum.wolfery.com/u/felinex/
// @version      3.4
// @description  Shows PIT/PIAT center-top on *.wolfery.com; hover popup; time converter (DE/EN, fast drift-based PIT<->real, persistent settings)
// @description:de Zeigt PIT/PIAT zentral-oben auf *.wolfery.com; Popup mit Tooltip; Zeitumrechner (DE/EN, schneller Drift-Ausgleich PIT↔Echtzeit, Einstellungen werden gespeichert)
// @icon         https://static.f-list.net/images/eicon/gloomfort.png
// @license      All Rights Reserved
// @author       Felinex Gloomfort
// @match        *://*.wolfery.com/*
// @downloadURL https://update.greasyfork.org/scripts/556843/Phantom%20Isles%20Time%20for%20Wolfery.user.js
// @updateURL https://update.greasyfork.org/scripts/556843/Phantom%20Isles%20Time%20for%20Wolfery.meta.js
// ==/UserScript==

(function () {
  const isGerman = navigator.language && navigator.language.startsWith('de');
  const T = isGerman ? {
    modePIAT: "PIAT",
    modePIT: "PIT",
    btnPIAT: "Zu PIT wechseln",
    btnPIT: "Zu PIAT wechseln",
    tooltipPIAT: "Phantom Isles Ausgerichtete Zeit",
    tooltipPIT: "Phantom Isles Zeit",
    convertLabel: "Realzeit → PIT/PIAT",
    convertBtn: "Umwandeln",
    convertPlaceholder: "",
    convertPick: "Bitte ein Datum und eine Uhrzeit wählen.",
    convertResultPIAT: "PIAT: ",
    convertResultPIT: "PIT: ",
    reverseLabel: "PIT/PIAT → Realzeit",
    reverseBtn: "Zu Realzeit umwandeln",
    reversePlaceholder: "z.B. 31 Nov 2025 10:39",
    reverseParseFail: "Fehler beim Parsen (Format: TT Monat JJJJ HH:MM)",
    reverseResult: "Real: ",
    reverseResultPITFail: "PIT: Umwandlung fehlgeschlagen",
    settings: "⚙️ Einstellungen",
    close: "Schließen",
    position: "Popup-Position",
    expanded: "Rechner anzeigen",
    collapsed: "Rechner ausblenden",
    autoConvert: "Automatische Zeit-Umwandlung",
    autoConvertOn: "aktiviert",
    autoConvertOff: "deaktiviert"
  } : {
    modePIAT: "PIAT",
    modePIT: "PIT",
    btnPIAT: "Switch to PIT",
    btnPIT: "Switch to PIAT",
    tooltipPIAT: "Phantom Isles Aligned Time",
    tooltipPIT: "Phantom Isles Time",
    convertLabel: "Local time → PIT/PIAT",
    convertBtn: "Convert",
    convertPlaceholder: "",
    convertPick: "Pick a date/time.",
    convertResultPIAT: "PIAT: ",
    convertResultPIT: "PIT: ",
    reverseLabel: "PIT/PIAT → Real Time",
    reverseBtn: "Convert to Real",
    reversePlaceholder: "e.g. 31 Nov 2025 10:39",
    reverseParseFail: "Parse fail (try DD Month YYYY HH:MM)",
    reverseResult: "Real: ",
    reverseResultPITFail: "PIT: Conversion failed",
    settings: "⚙️ Settings",
    close: "Close",
    position: "Popup Position",
    expanded: "Show Calculator",
    collapsed: "Hide Calculator",
    autoConvert: "Auto Time Conversion",
    autoConvertOn: "enabled",
    autoConvertOff: "disabled"
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthNames3 = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const baseFantasyDaysInMonth = [37, 35, 37, 36, 37, 36, 37, 37, 36, 37, 36, 37];

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }
  function leapCountSince(startYear, currentYear) {
    let count = 0;
    for (let y = startYear; y < currentYear; y++) {
      if (isLeapYear(y)) count++;
    }
    return count;
  }
  function isDoubleLeap(year, startYear = 1970) {
    let leaps = leapCountSince(startYear, year + 1);
    return isLeapYear(year) && (leaps % 5 === 0);
  }
  function getLeapDriftMinutesSince1970(year) {
    let drift = 0;
    let leapCount = 0;
    for (let y = 1970; y < year; y++) {
      if (isLeapYear(y)) {
        leapCount++;
        if (leapCount % 5 === 0) {
          drift = 0;
        } else {
          drift += 240;
        }
      }
    }
    return drift;
  }
  function unixToPhantomIslesTimePIT(unixTimestampMs, showShort = false) {
    const epochYear = 1970;
    const msPerMinute = 60000;
    let totalRealMinutes = Math.floor(unixTimestampMs / msPerMinute);
    let leapDriftMinutes = 0, leapYearsPassed = 0;
    let currentYear = epochYear, usedMinutes = 0, totalFantasyDays = 0;
    let yearMinutes, fantasyDaysThisYear;
    while (true) {
      let isLeap = isLeapYear(currentYear);
      let isDLeap = isDoubleLeap(currentYear);
      let months = [
        31, isLeap ? 29 : 28, 31, 30, 31, 30,
        31, 31, 30, 31, 30, 31
      ];
      yearMinutes = months.reduce((a, b) => a + b, 0) * 1440;
      fantasyDaysThisYear = 438 + (isLeap ? 1 : 0) + (isDLeap ? 1 : 0);
      if (usedMinutes + yearMinutes > totalRealMinutes) break;
      usedMinutes += yearMinutes;
      totalFantasyDays += fantasyDaysThisYear;
      if (isLeap) {
        leapYearsPassed++;
        if (isDLeap) {
          leapDriftMinutes = 0;
          leapYearsPassed = 0;
        } else {
          leapDriftMinutes += 1440 - 1200;
        }
      }
      currentYear++;
    }
    let minutesIntoThisYear = totalRealMinutes - usedMinutes;
    let isLeap = isLeapYear(currentYear);
    let isDLeap = isDoubleLeap(currentYear);
    let months = [
      31, isLeap ? 29 : 28, 31, 30, 31, 30,
      31, 31, 30, 31, 30, 31
    ];
    yearMinutes = months.reduce((a, b) => a + b, 0) * 1440;
    fantasyDaysThisYear = 438 + (isLeap ? 1 : 0) + (isDLeap ? 1 : 0);
    let yearFraction = minutesIntoThisYear / yearMinutes;
    let fantasyYearDayFloat = yearFraction * fantasyDaysThisYear;
    let fantasyYearDay = Math.floor(fantasyYearDayFloat);
    let fantasyDaysInMonth = baseFantasyDaysInMonth.slice();
    let extraDays = fantasyDaysThisYear - 438;
    if (extraDays > 0) fantasyDaysInMonth[11] += extraDays;
    let fantasyMonth = 0, dayOfYearSum = 0, fantasyDayOfMonth = 1;
    for (let i = 0; i < 12; i++) {
      if (fantasyYearDay < dayOfYearSum + fantasyDaysInMonth[i]) {
        fantasyMonth = i + 1;
        fantasyDayOfMonth = fantasyYearDay - dayOfYearSum + 1;
        break;
      }
      dayOfYearSum += fantasyDaysInMonth[i];
    }
    let dayFraction = fantasyYearDayFloat - fantasyYearDay;
    let fantasyMinutesInDay = dayFraction * 1200 + leapDriftMinutes;
    if (fantasyMinutesInDay >= 1200) {
      fantasyDayOfMonth += Math.floor(fantasyMinutesInDay / 1200);
      fantasyMinutesInDay = fantasyMinutesInDay % 1200;
    }
    let fantasyHour = Math.floor(fantasyMinutesInDay / 50);
    let fantasyMinute = Math.floor(fantasyMinutesInDay % 50);
    const yearStr = currentYear.toString();
    const monthStr = fantasyMonth < 10 ? "0" + fantasyMonth : "" + fantasyMonth;
    const dayStr = fantasyDayOfMonth < 10 ? "0" + fantasyDayOfMonth : "" + fantasyDayOfMonth;
    const hourStr = fantasyHour < 10 ? "0" + fantasyHour : "" + fantasyHour;
    const minuteStr = fantasyMinute < 10 ? "0" + fantasyMinute : "" + fantasyMinute;
    const nameArr = showShort ? monthNames3 : monthNames;
    return `${dayStr} ${nameArr[fantasyMonth - 1]} ${yearStr} ${hourStr}:${minuteStr}`;
  }
  function unixToPhantomIslesTimePIAT(unixTimestampMs, showShort = false) {
    const fantasyDaysPerYear = baseFantasyDaysInMonth.reduce((a, b) => a + b, 0);
    const date = new Date(unixTimestampMs);
    const year = date.getUTCFullYear();
    const isLeap = isLeapYear(year);
    const realDaysInMonth = [
      31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ];
    const totalMinutesYear = realDaysInMonth.reduce((a, b) => a + b, 0) * 1440;
    const startOfYear = Date.UTC(year, 0, 1, 0, 0, 0, 0);
    const minutesSinceYear = Math.floor((unixTimestampMs - startOfYear) / 60000);
    const yearFraction = minutesSinceYear / totalMinutesYear;
    const fantasyYearDayFloat = yearFraction * fantasyDaysPerYear;
    const fantasyYearDay = Math.floor(fantasyYearDayFloat);
    let fantasyMonth = 0, dayOfYearSum = 0, fantasyDayOfMonth = 1;
    for (let i = 0; i < 12; i++) {
      if (fantasyYearDay < dayOfYearSum + baseFantasyDaysInMonth[i]) {
        fantasyMonth = i + 1;
        fantasyDayOfMonth = fantasyYearDay - dayOfYearSum + 1;
        break;
      }
      dayOfYearSum += baseFantasyDaysInMonth[i];
    }
    let thisFantasyDayMinutes = 1200;
    if (isLeap && fantasyYearDay === fantasyDaysPerYear - 1) {
      thisFantasyDayMinutes = 2640;
    }
    let dayFraction = fantasyYearDayFloat - fantasyYearDay;
    let fantasyMinutesInDay = dayFraction * thisFantasyDayMinutes;
    let fantasyHour = Math.floor(fantasyMinutesInDay / 50);
    let fantasyMinute = Math.floor(fantasyMinutesInDay % 50);
    const yearStr = year.toString();
    const monthStr = fantasyMonth < 10 ? "0" + fantasyMonth : "" + fantasyMonth;
    const dayStr = fantasyDayOfMonth < 10 ? "0" + fantasyDayOfMonth : "" + fantasyDayOfMonth;
    const hourStr = fantasyHour < 10 ? "0" + fantasyHour : "" + fantasyHour;
    const minuteStr = fantasyMinute < 10 ? "0" + fantasyMinute : "" + fantasyMinute;
    const nameArr = showShort ? monthNames3 : monthNames;
    return `${dayStr} ${nameArr[fantasyMonth - 1]} ${yearStr} ${hourStr}:${minuteStr}`;
  }
  function parsePITPIATinput(str) {
    const r = /^(\d{1,2})\.?\s+([A-Za-zäöüÄÖÜ]+)\s+(\d{4})\s+(\d{1,2}):(\d{2})$/;
    const m = str.trim().match(r);
    if (!m) return null;
    let monthIdx = monthNames.findIndex(n => n.toLowerCase().startsWith(m[2].toLowerCase()));
    if (monthIdx === -1) monthIdx = monthNames3.findIndex(n => n.toLowerCase().startsWith(m[2].toLowerCase()));
    if (monthIdx === -1) return null;
    return {
      day: parseInt(m[1], 10),
      monthIdx,
      year: parseInt(m[3], 10),
      hour: parseInt(m[4], 10),
      minute: parseInt(m[5], 10)
    };
  }
  function piatToUnix({day, monthIdx, year, hour, minute}) {
    const fantasyDayOfYear = baseFantasyDaysInMonth.slice(0, monthIdx).reduce((a, b) => a + b, 0) + (day - 1);
    let totalFantasyMinutes = fantasyDayOfYear * 1200 + hour * 50 + minute;
    let isLeap = isLeapYear(year);
    const realDaysInMonth = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let totalRealMinutesYear = realDaysInMonth.reduce((a, b) => a + b, 0) * 1440;
    let baseFantasyDays = baseFantasyDaysInMonth.reduce((a, b) => a + b, 0);
    let minuteFraction = totalFantasyMinutes / (baseFantasyDays * 1200);
    let realMinutesSinceYear = Math.floor(minuteFraction * totalRealMinutesYear);
    let realDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
    return realDate.getTime() + realMinutesSinceYear * 60000;
  }
  function pitToUnixViaPIAT(parsed) {
    const drift = getLeapDriftMinutesSince1970(parsed.year);
    let minsSincePIATYear =
      baseFantasyDaysInMonth.slice(0, parsed.monthIdx).reduce((a, b) => a + b, 0) * 1200 +
      (parsed.day - 1) * 1200 +
      parsed.hour * 50 +
      parsed.minute;
    minsSincePIATYear -= drift;
    let totalDays = baseFantasyDaysInMonth.reduce((a, b) => a + b, 0);
    while (minsSincePIATYear < 0) {
      minsSincePIATYear += totalDays * 1200;
      parsed.year--;
    }
    let piatDay = Math.floor(minsSincePIATYear / 1200) + 1;
    let piatMinuteOfDay = minsSincePIATYear % 1200;
    let piatHour = Math.floor(piatMinuteOfDay / 50);
    let piatMinute = piatMinuteOfDay % 50;
    let acc = 0, piatMonthIdx = 0;
    while (piatMonthIdx < 12 && acc + baseFantasyDaysInMonth[piatMonthIdx] < piatDay) {
      acc += baseFantasyDaysInMonth[piatMonthIdx];
      piatMonthIdx++;
    }
    let piatDayOfMonth = piatDay - acc;
    return piatToUnix({
      day: piatDayOfMonth,
      monthIdx: piatMonthIdx,
      year: parsed.year,
      hour: piatHour,
      minute: piatMinute
    });
  }

  // --- Settings/expansion logic ---
  const POSITIONS = [
    { key: "center-top", txt: isGerman ? "Mitte, oben" : "Center, top" },
    { key: "top-left", txt: isGerman ? "Links oben" : "Top left" },
    { key: "top-right", txt: isGerman ? "Rechts oben" : "Top right" },
    { key: "bottom-left", txt: isGerman ? "Links unten" : "Bottom left" },
    { key: "bottom-right", txt: isGerman ? "Rechts unten" : "Bottom right" }
  ];
  const LS_KEY_POSITION = "phantom_isles_popup_position";
  const LS_KEY_CALC_EXPANDED = "phantom_isles_popup_calc_expanded";
  const LS_KEY_AUTO_CONVERT = "phantom_isles_autoconvert_enabled";
  function getSavedPosKey() { return localStorage.getItem(LS_KEY_POSITION) || "center-top"; }
  function setSavedPosKey(key) { localStorage.setItem(LS_KEY_POSITION, key); }
  function getSavedCalcExpanded() {
    const val = localStorage.getItem(LS_KEY_CALC_EXPANDED);
    return val === null ? false : val === "true";
  }
  function setSavedCalcExpanded(x) {
    localStorage.setItem(LS_KEY_CALC_EXPANDED, x ? "true" : "false");
  }
  function getSavedAutoConvert() {
    const val = localStorage.getItem(LS_KEY_AUTO_CONVERT);
    return val === null ? true : val === "true";
  }
  function setSavedAutoConvert(x) {
    localStorage.setItem(LS_KEY_AUTO_CONVERT, x ? "true" : "false");
  }
  function applyPopupPosition(container, posKey) {
    container.style.top = container.style.left = container.style.bottom = container.style.right = "";
    container.style.transform = "";
    switch (posKey) {
      case "center-top":
        container.style.top = "18px";
        container.style.left = "50%";
        container.style.transform = "translateX(-50%)";
        break;
      case "top-left":
        container.style.top = "18px";
        container.style.left = "18px";
        break;
      case "top-right":
        container.style.top = "18px";
        container.style.right = "18px";
        break;
      case "bottom-left":
        container.style.bottom = "18px";
        container.style.left = "18px";
        break;
      case "bottom-right":
        container.style.bottom = "18px";
        container.style.right = "18px";
        break;
      default:
        container.style.top = "18px";
        container.style.left = "50%";
        container.style.transform = "translateX(-50%)";
    }
  }

  function createPopupAndSwitch() {
    const container = document.createElement('div');
    container.id = 'phantom-isles-container';
    container.style.position = 'fixed';
    container.style.zIndex = '99999';
    container.style.fontFamily = 'monospace, sans-serif';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';

    applyPopupPosition(container, getSavedPosKey());

    const gear = document.createElement('button');
    gear.textContent = "⚙️";
    gear.title = T.settings;
    gear.style.position = "absolute";
    gear.style.right = "2px";
    gear.style.top = "2px";
    gear.style.background = "transparent";
    gear.style.color = "#FFD790";
    gear.style.fontSize = "18px";
    gear.style.border = "none";
    gear.style.cursor = "pointer";
    gear.style.padding = "0 2px";
    gear.style.zIndex = "99999";

    const menu = document.createElement('div');
    menu.style.display = "none";
    menu.style.position = "absolute";
    menu.style.top = "24px";
    menu.style.right = "-4px";
    menu.style.background = "#1C262C";
    menu.style.color = "#FFD790";
    menu.style.border = "1px solid #444";
    menu.style.borderRadius = "8px";
    menu.style.boxShadow = "0 2px 6px rgba(0,0,0,.22)";
    menu.style.padding = "10px";
    menu.style.fontSize = "15px";
    menu.style.zIndex = "100000";
    menu.style.minWidth = "180px";

    const labelPos = document.createElement('div');
    labelPos.textContent = T.position;
    menu.appendChild(labelPos);

    POSITIONS.forEach(pos => {
      const btn = document.createElement('button');
      btn.textContent = pos.txt;
      btn.style.display = "block";
      btn.style.margin = "5px auto";
      btn.style.width = "90%";
      btn.style.fontFamily = 'inherit';
      btn.style.fontSize = "15px";
      btn.style.border = "none";
      btn.style.borderRadius = "6px";
      btn.style.background = "#223c5c";
      btn.style.color = "#FFD790";
      btn.style.padding = "4px";
      btn.style.cursor = "pointer";
      btn.onclick = () => {
        setSavedPosKey(pos.key);
        applyPopupPosition(container, pos.key);
        menu.style.display = "none";
      };
      menu.appendChild(btn);
    });

    // --- Auto convert setting toggle ---
    const autoDiv = document.createElement('div');
    autoDiv.style.marginTop = "8px";
    const autoToggle = document.createElement('input');
    autoToggle.type = "checkbox";
    autoToggle.checked = getSavedAutoConvert();
    autoToggle.id = "pitpiat_auto_toggle";
    autoToggle.style.marginRight = "5px";
    const autoLabel = document.createElement('label');
    autoLabel.textContent = `${T.autoConvert}: ${autoToggle.checked ? T.autoConvertOn : T.autoConvertOff}`;
    autoToggle.onchange = function () {
      setSavedAutoConvert(autoToggle.checked);
      autoLabel.textContent = `${T.autoConvert}: ${autoToggle.checked ? T.autoConvertOn : T.autoConvertOff}`;
      scanAndConvertPitPiatTimes(); // re-run to hide/show as needed
    };
    autoDiv.appendChild(autoToggle);
    autoDiv.appendChild(autoLabel);
    menu.appendChild(autoDiv);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = T.close;
    closeBtn.style.display = "block";
    closeBtn.style.margin = "10px auto 0";
    closeBtn.style.width = "90%";
    closeBtn.style.fontFamily = 'inherit';
    closeBtn.style.fontSize = "15px";
    closeBtn.style.border = "none";
    closeBtn.style.borderRadius = "6px";
    closeBtn.style.background = "#222";
    closeBtn.style.color = "#FFD790";
    closeBtn.style.padding = "4px";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => { menu.style.display = "none"; };
    menu.appendChild(closeBtn);

    gear.onclick = e => {
      menu.style.display = menu.style.display === "none" ? "block" : "none";
      e.stopPropagation();
    };
    document.body.addEventListener("click", () => { menu.style.display = "none"; });

    container.appendChild(gear);
    container.appendChild(menu);

    const popup = document.createElement('div');
    popup.id = 'phantom-isles-popup';
    popup.style.padding = '10px 18px';
    popup.style.background = 'rgba(0,22,40,0.97)';
    popup.style.color = '#FFD790';
    popup.style.fontSize = '16px';
    popup.style.borderRadius = '10px 10px 3px 3px';
    popup.style.boxShadow = '0 2px 12px 0 rgba(0,0,0,0.19)';
    popup.style.userSelect = 'text';
    popup.style.pointerEvents = 'auto';
    popup.style.textAlign = "center";
    popup.style.whiteSpace = "pre-line";
    popup.title = T.tooltipPIT;

    const btn = document.createElement('button');
    btn.textContent = T.btnPIT;
    btn.style.display = "block";
    btn.style.margin = "0 auto";
    btn.style.border = "none";
    btn.style.borderRadius = "0 0 10px 10px";
    btn.style.background = "#223c5c";
    btn.style.color = "#FFD790";
    btn.style.fontWeight = "bold";
    btn.style.fontFamily = 'monospace, sans-serif';
    btn.style.padding = "5px 15px";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 2px 8px 0 rgba(0,0,0,0.15)";
    btn.style.fontSize = "15px";
    btn.style.userSelect = "none";
    btn.style.pointerEvents = "auto";

    container.appendChild(popup);
    container.appendChild(btn);
    document.body.appendChild(container);

    return { container, popup, btn };
  }

  let mode = "pit";
  const { container, popup, btn } = createPopupAndSwitch();

  function updatePopup() {
    const now = Date.now();
    let shortname = "", pit = "";
    if (mode === "piat") {
      pit = unixToPhantomIslesTimePIAT(now, false);
      shortname = T.modePIAT;
      popup.title = T.tooltipPIAT;
      btn.textContent = T.btnPIAT;
    } else {
      pit = unixToPhantomIslesTimePIT(now, false);
      shortname = T.modePIT;
      popup.title = T.tooltipPIT;
      btn.textContent = T.btnPIT;
    }
    popup.textContent = `⏳ ${shortname}\n${pit}`;
  }
  btn.addEventListener('click', function () {
    mode = mode === "piat" ? "pit" : "piat";
    updatePopup();
  });
  setInterval(updatePopup, 1000);
  updatePopup();

  function addCalculatorSection(parent) {
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = T.expanded;
    toggleBtn.style.margin = "8px 0 0";
    toggleBtn.style.background = "#222";
    toggleBtn.style.color = "#FFD790";
    toggleBtn.style.fontWeight = "bold";
    toggleBtn.style.border = "none";
    toggleBtn.style.borderRadius = "7px";
    toggleBtn.style.padding = "4px 15px";
    toggleBtn.style.cursor = "pointer";
    toggleBtn.style.fontSize = "15px";
    toggleBtn.style.boxShadow = "0 1px 4px 0 rgba(0,0,0,0.15)";
    toggleBtn.style.display = "block";

    const containerDiv = document.createElement('div');
    containerDiv.style.display = getSavedCalcExpanded() ? "block" : "none";
    function setExpanded(expand) {
      containerDiv.style.display = expand ? "block" : "none";
      toggleBtn.textContent = expand ? T.collapsed : T.expanded;
      setSavedCalcExpanded(expand);
    }
    setExpanded(getSavedCalcExpanded());
    toggleBtn.onclick = () => setExpanded(containerDiv.style.display === "none");
    parent.appendChild(toggleBtn);
    parent.appendChild(containerDiv);

    addCalculator(containerDiv, popup);
    addReverseCalculator(containerDiv);
  }

  function addCalculator(container, popup) {
    const labelDiv = document.createElement('div');
    labelDiv.textContent = T.convertLabel;
    labelDiv.style.fontSize = "13px";
    labelDiv.style.color = "#FFD790";
    labelDiv.style.marginBottom = "4px";
    const calcDiv = document.createElement('div');
    calcDiv.style.marginTop = "12px";
    calcDiv.style.textAlign = "center";
    const input = document.createElement('input');
    input.type = 'datetime-local';
    input.style.fontFamily = 'monospace, sans-serif';
    input.style.fontSize = '15px';
    input.style.marginRight = '6px';
    input.placeholder = T.convertPlaceholder;
    const btnConvert = document.createElement('button');
    btnConvert.textContent = T.convertBtn;
    btnConvert.style.margin = '2px 0';
    btnConvert.style.background = "#146b81";
    btnConvert.style.color = "#FFD790";
    btnConvert.style.fontWeight = "bold";
    btnConvert.style.border = "none";
    btnConvert.style.borderRadius = "4px";
    btnConvert.style.padding = "4px 12px";
    btnConvert.style.cursor = "pointer";
    btnConvert.style.fontSize = "15px";
    btnConvert.style.boxShadow = "0 1px 3px 0 rgba(0,0,0,0.12)";
    const out = document.createElement('div');
    out.style.marginTop = "5px";
    out.style.fontFamily = 'monospace, sans-serif';
    out.style.fontSize = "15px";
    out.style.color = "#FFD790";
    btnConvert.onclick = function () {
      if (!input.value) {
        out.textContent = T.convertPick;
        return;
      }
      const t = new Date(input.value).getTime();
      let result = "";
      if (mode === "piat") {
        result = unixToPhantomIslesTimePIAT(t, false);
        out.textContent = T.convertResultPIAT + result;
      } else {
        result = unixToPhantomIslesTimePIT(t, false);
        out.textContent = T.convertResultPIT + result;
      }
    };
    calcDiv.appendChild(labelDiv);
    calcDiv.appendChild(input);
    calcDiv.appendChild(btnConvert);
    calcDiv.appendChild(out);
    container.appendChild(calcDiv);
  }

  function addReverseCalculator(container) {
    const reverseDiv = document.createElement('div');
    reverseDiv.style.marginTop = "10px";
    reverseDiv.style.textAlign = "center";
    const label = document.createElement('div');
    label.textContent = T.reverseLabel;
    label.style.fontSize = "13px";
    label.style.color = "#FFD790";
    label.style.marginBottom = "4px";
    reverseDiv.appendChild(label);
    const reverseInput = document.createElement('input');
    reverseInput.type = 'text';
    reverseInput.placeholder = T.reversePlaceholder;
    reverseInput.style.fontFamily = 'monospace, sans-serif';
    reverseInput.style.fontSize = '15px';
    reverseInput.style.marginRight = '6px';
    const reverseBtn = document.createElement('button');
    reverseBtn.textContent = T.reverseBtn;
    reverseBtn.style.background = "#446b30";
    reverseBtn.style.color = "#FFD790";
    reverseBtn.style.fontWeight = "bold";
    reverseBtn.style.border = "none";
    reverseBtn.style.borderRadius = "4px";
    reverseBtn.style.padding = "4px 12px";
    reverseBtn.style.cursor = "pointer";
    reverseBtn.style.fontSize = "15px";
    reverseBtn.style.boxShadow = "0 1px 3px 0 rgba(0,0,0,0.12)";
    const reverseOut = document.createElement('div');
    reverseOut.style.marginTop = "5px";
    reverseOut.style.fontFamily = 'monospace, sans-serif';
    reverseOut.style.fontSize = "15px";
    reverseOut.style.color = "#FFD790";
    reverseBtn.onclick = function () {
      let val = reverseInput.value.trim();
      let parsed = parsePITPIATinput(val);
      if (!parsed) {
        reverseOut.textContent = T.reverseParseFail;
        return;
      }
      if (mode === "piat") {
        let t = piatToUnix(parsed);
        let dt = new Date(t);
        reverseOut.textContent = T.reverseResult + dt.toLocaleString();
      } else {
        let t = pitToUnixViaPIAT(parsed);
        if (t == null) {
          reverseOut.textContent = T.reverseResultPITFail;
        } else {
          let dt = new Date(t);
          reverseOut.textContent = T.reverseResult + dt.toLocaleString();
        }
      }
    };
    reverseDiv.appendChild(reverseInput);
    reverseDiv.appendChild(reverseBtn);
    reverseDiv.appendChild(reverseOut);
    container.appendChild(reverseDiv);
  }

  addCalculatorSection(container);

  // --- Automatic time transformation toggle ---
  const pitOrPiatPattern = /(\d{1,2})\.?\s+([A-Za-zäöüÄÖÜ]+)\s+(\d{4})\s+(\d{1,2}):(\d{2})\s+\[(PIT|PIAT)\]/g;
  function convertPitPiatTextToLocal(matchAll) {
    matchAll.forEach(match => {
      let [full] = match;
      let dd = match[1], mon = match[2], yyyy = match[3], hh = match[4], mm = match[5], kind = match[6];
      let parsed = parsePITPIATinput(`${dd} ${mon} ${yyyy} ${hh.padStart(2,"0")}:${mm}`);
      if (!parsed) return;
      let t = kind === "PIAT" ? piatToUnix(parsed) : pitToUnixViaPIAT(parsed);
      let dt = new Date(t);
      let formatted = dt.toLocaleString() + (isGerman ? " (Echtzeit)" : " (local time)");
      document.querySelectorAll('body, body *').forEach(node => {
        if (node.childNodes && node.childNodes.length) {
          node.childNodes.forEach(child => {
            if (child.nodeType === 3 && child.textContent.includes(full)) {
              let newText = child.textContent.replace(full, formatted);
              let span = document.createElement("span");
              span.textContent = newText;
              span.title = full;
              child.parentNode.replaceChild(span, child);
            }
          });
        }
      });
    });
  }
  function scanAndConvertPitPiatTimes() {
    if (!getSavedAutoConvert()) return; // skip if disabled
    let allMatches = [];
    document.querySelectorAll('body, body *').forEach(node => {
      if (node.childNodes && node.childNodes.length) {
        node.childNodes.forEach(child => {
          if (child.nodeType === 3) {
            let txt = child.textContent;
            let re = RegExp(pitOrPiatPattern);
            let res = txt.matchAll(pitOrPiatPattern);
            Array.from(res).forEach(m => { m.input = txt; allMatches.push(m); });
          }
        });
      }
    });
    if (allMatches.length) {
      convertPitPiatTextToLocal(allMatches);
    }
  }
  scanAndConvertPitPiatTimes();
  const mo = new MutationObserver(() => { scanAndConvertPitPiatTimes(); });
  mo.observe(document.body, { childList: true, subtree: true, characterData: true });

})();
