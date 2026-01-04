// ==UserScript==
// @name         wall-battlestats
// @namespace    seintz.torn.wall-battlestats
// @version      6.9.3
// @author       seintz [2460991], finally [2060206], Shade [3129695], Kindly [1956699], Mr_Bob [479620], nao [2669774]
// @description  show tornstats spies on faction wall page
// @license      GNU GPLv3
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/war.php?step=rankreport&rankID=*
// @connect      api.torn.com
// @connect      tornstats.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557631/wall-battlestats.user.js
// @updateURL https://update.greasyfork.org/scripts/557631/wall-battlestats.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.nstWallBsSettings = window.nstWallBsSettings || {
    /*!
     * Grab your Torn Stats API from https://tornstats.com/settings/general
     * set it below like "TS_MYKEY" inside the quotation marks below
     */
    tsApiKey: "TS_MYKEY",
    /*!
     * Any PUBLIC key will do
     * Grab your Torn API from https://www.torn.com/preferences.php#tab=api
     * or create a new one with the link below
     * https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=wall-bs&faction=basic
     *
     * set it below like "TORN_KEY" inside the quotation marks below
     */
    tornApiKey: "TORN_KEY",
    /*! true or false */
    colorMode: false
  };
  /*!
   * -------------------------------------------------------------------------
   * |    DO NOT MODIFY BELOW     |
   * -------------------------------------------------------------------------
   */
  const settings = window.nstWallBsSettings;
  const { tsApiKey, tornApiKey, colorMode } = settings;
  const OKAY = "OKAY";
  const ABROAD = "ABROAD";
  const HOSPITAL = "HOSPITAL";
  const TRAVELING = "TRAVELING";
  /*! total, str, def, spd, dex */
  const colors = ["black", "#ad7c5c", "#6ea9a9", "#807b54", "#ae67bb"];
  const whore_threshold = 0.35;
  const ff_threshold = 2;
  const borderColor = "lightgreen";
  const borderThickness = 1;
  const hospNodes = [];
  const storeFiltFrom = localStorage.getItem("finally.torn.factionFilterFrom");
  const storeFiltTo = localStorage.getItem("finally.torn.factionFilterTo");
  const storeSort = localStorage.getItem("finally.torn.factionSort");
  let bsCache = JSONparse(localStorage["finally.torn.bs"]) || {};
  let filterFrom = parseInt(storeFiltFrom) || void 0;
  let filterTo = parseInt(storeFiltTo) || void 0;
  let myBSScore = localStorage.getItem("myBSScore") || 0;
  let previousSort = parseInt(storeSort) || 1;
  let hospLoopCounter = 0;
  let hospTime = {};
  let loadTSFactionBacklog = [];
  let loadTSFactionDone = [];
  let loadTSFactionLock = false;
  let factionData = {};
  let factions = [];
  const statusOrder = {
    [OKAY]: 1,
    [HOSPITAL]: 2,
    [TRAVELING]: 3,
    [ABROAD]: 4
  };
  const countries = {
    "United Kingdom": "UK",
    "South Africa": "SA",
    Switzerland: "SW",
    Japan: "JP",
    "Cayman Islands": "CI",
    Mexico: "MX",
    Canada: "CN",
    Argentina: "AR",
    China: "CH"
  };
  function JSONparse(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  function isPDA() {
    return window.flutter_inappwebview !== void 0;
  }
  function onSpiesLoad(r) {
    const j = JSONparse(r.responseText);
    if (!j || !j.status || !j.faction) {
      loadTSFactionsDone();
      return;
    }
    Object.keys(j.faction.members).forEach((k) => addSpy(k, j.faction.members[k].spy));
    localStorage["finally.torn.bs"] = JSON.stringify(bsCache);
    loadTSFactionsDone();
  }
  function webReq(URL, callback) {
    if (isPDA()) {
      PDA_httpGet(URL).then((r) => callback(r)).catch(console.log);
    } else {
      GM_xmlhttpRequest({
        method: "GET",
        url: URL,
        onload: (r) => callback(r),
        onabort: () => loadTSFactionsDone(),
        onerror: () => loadTSFactionsDone(),
        ontimeout: () => loadTSFactionsDone()
      });
    }
  }
  function loadTSFactionsDone() {
    loadTSFactionLock = false;
    loadTSFactions();
  }
  function loadTSFactions(id) {
    if (loadTSFactionLock) {
      if (id && loadTSFactionDone.indexOf(id) === -1 && loadTSFactionBacklog.indexOf(id) === -1)
        loadTSFactionBacklog.push(id);
      return;
    }
    if (!id && loadTSFactionBacklog.length == 0) {
      showStatsAll();
      return;
    }
    loadTSFactionLock = true;
    id = id || loadTSFactionBacklog.shift();
    loadTSFactionDone.push(id);
    const URL = `https://www.tornstats.com/api/v2/${tsApiKey}/spy/faction/${id}`;
    webReq(URL, onSpiesLoad);
  }
  const getTravelState = (state) => {
    if (state === "Traveling") return "Traveling";
    if (state === "Abroad") return "Abroad";
    return "Torn";
  };
  const splitTravelDesc = (desc, pattern) => {
    const part = desc.split(pattern)[1];
    return countries[part] || part;
  };
  const travelSwitch = {
    Traveling: (memId, desc = "") => {
      const country = desc.includes("Returning") ? `<- ${splitTravelDesc(desc, "from ")}` : `-> ${splitTravelDesc(desc, "to ")}`;
      factionData[memId] = country;
    },
    Abroad: (memId, desc = "") => {
      const country = splitTravelDesc(desc, "In ");
      factionData[memId] = country;
    },
    Torn: (memId) => {
      delete factionData[memId];
    }
  };
  function runFactionData(r) {
    const resp = JSONparse(r.responseText);
    if (!resp || !resp.members) return;
    const { members } = resp;
    for (const [memId, { status }] of Object.entries(members)) {
      const { state, description: desc } = status;
      const myState = getTravelState(state);
      travelSwitch[myState](memId, desc);
    }
    updateStateTravellers();
  }
  async function getFactionData() {
    if (tornApiKey.length !== 16) return;
    factions.forEach((factionId) => {
      const url = `https://api.torn.com/faction/${factionId}?selections=basic&key=${tornApiKey}&comment=wallbs`;
      webReq(url, runFactionData);
    });
  }
  function updateStateTravellers() {
    const update = (selector) => {
      document.querySelectorAll(`.${selector}`).forEach((el) => {
        const parent = el.parentElement;
        const link = parent.querySelector("a[href*='XID=']");
        const userId = link == null ? void 0 : link.href.split("XID=")[1];
        if (userId && factionData[userId]) {
          el.textContent = factionData[userId];
        }
      });
    };
    update("traveling");
    update("abroad");
  }
  function onLoadCacheMyBS(r) {
    const j = JSONparse(r.responseText);
    if (!j || !j.status || !j.data) return;
    const currentStats = j.data[j.data.length - 1];
    const myScore = Math.sqrt(currentStats.strength) + Math.sqrt(currentStats.defense) + Math.sqrt(currentStats.speed) + Math.sqrt(currentStats.dexterity);
    localStorage.setItem("myBSScore", myScore);
  }
  function cacheMyBattleStats() {
    var _a;
    const myLink = (_a = document == null ? void 0 : document.querySelector(".settings-menu li:first-child a")) == null ? void 0 : _a.getAttribute("href");
    if (!myLink) return;
    const myUserID = myLink.replace(/^\D+/g, "");
    const currentTimestamp = Math.floor(Date.now() / 1e3);
    const lastUpdate = localStorage.getItem("lastMyBSUpdateTime");
    const cachedUntil = +lastUpdate + 21600;
    if (myBSScore && lastUpdate && cachedUntil > currentTimestamp) return;
    localStorage.setItem("lastMyBSUpdateTime", currentTimestamp);
    const URL = `https://www.tornstats.com/api/v2/${tsApiKey}/spy/user/${myUserID}`;
    webReq(URL, onLoadCacheMyBS);
  }
  function loadFactions() {
    let factionIds = Array.from(document.querySelectorAll("[href^='/factions.php?step=profile&ID=']")).map((a) => a.href.replace(/.*?ID=(\d+)$/, "$1")).filter((v, i, a) => a.indexOf(v) === i);
    factions = factionIds;
    factionIds.forEach((id) => loadTSFactions(id));
  }
  function getStatus(node) {
    var c = node.className;
    if (c.includes("okay")) {
      return OKAY;
    } else if (c.includes("hospital")) {
      return HOSPITAL;
    } else if (c.includes("traveling")) {
      return TRAVELING;
    } else if (c.includes("abroad")) {
      return ABROAD;
    } else {
      return ABROAD;
    }
  }
  function sortStatus(node, sort) {
    var _a, _b;
    if (!node) node = document.querySelector(".f-war-list .members-list");
    if (!node) return;
    let sortIcon = node.parentNode.querySelector(".status > [class*='sortIcon']");
    if (sort) node.finallySort = sort;
    else if (node.finallySort == void 0) node.finallySort = 2;
    else if (++node.finallySort > 2) node.finallySort = sortIcon ? 1 : 0;
    if (sortIcon) {
      if (node.finallySort > 0) {
        let active = node.parentNode.querySelector("[class*='activeIcon']:not([class*='finally-status-activeIcon'])");
        if (active) {
          let activeClass = (_b = (_a = active == null ? void 0 : active.className) == null ? void 0 : _a.match(/(?:\s|^)(activeIcon(?:[^\s|$]+))(?:\s|$)/)) == null ? void 0 : _b[1];
          if (activeClass) active.classList.remove(activeClass);
        }
        sortIcon.classList.add("finally-status-activeIcon");
        if (node.finallySort == 1) {
          sortIcon.classList.remove("finally-status-desc");
          sortIcon.classList.add("finally-status-asc");
        } else {
          sortIcon.classList.remove("finally-status-asc");
          sortIcon.classList.add("finally-status-desc");
        }
      } else {
        sortIcon.classList.remove("finally-status-activeIcon");
      }
    }
    let nodes = Array.from(node.querySelectorAll(".your:not(.row-animation-new), .enemy:not(.row-animation-new)"));
    for (let i = 0; i < nodes.length; i++) if (nodes[i].finallyPos == void 0) nodes[i].finallyPos = i;
    nodes = nodes.sort((a, b) => {
      let idA = a.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, "$1");
      let statusA = getStatus(a.querySelector(".status"));
      let posA = a.finallyPos;
      let idB = b.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, "$1");
      let statusB = getStatus(b.querySelector(".status"));
      let posB = b.finallyPos;
      node.finallySort;
      switch (node.finallySort) {
        case 1:
          if (statusA !== HOSPITAL || statusB !== HOSPITAL) return statusOrder[statusA] - statusOrder[statusB];
          return hospTime[idA] - (/* @__PURE__ */ new Date()).getTime() / 1e3 - (hospTime[idB] - (/* @__PURE__ */ new Date()).getTime() / 1e3);
        case 2:
          if (statusA !== HOSPITAL || statusB !== HOSPITAL) return statusOrder[statusB] - statusOrder[statusA];
          return hospTime[idB] - (/* @__PURE__ */ new Date()).getTime() / 1e3 - (hospTime[idA] - (/* @__PURE__ */ new Date()).getTime() / 1e3);
        default:
          return posA > posB ? 1 : -1;
      }
    });
    for (let i = 0; i < nodes.length; i++) nodes[i].parentNode.appendChild(nodes[i]);
    if (!sort) {
      document.querySelectorAll(".members-list").forEach((e) => {
        if (node != e) sortStatus(e, node.finallySort);
      });
    }
  }
  function sortStats(node, sort) {
    if (!node) node = document.querySelector(".f-war-list .members-list");
    if (!node) return;
    let sortIcon = node.parentNode.querySelector(".bs > [class*='sortIcon']");
    if (sort) node.finallySort = sort;
    else if (node.finallySort == void 0) node.finallySort = 2;
    else if (++node.finallySort > 2) node.finallySort = sortIcon ? 1 : 0;
    if (sortIcon) {
      if (node.finallySort > 0) {
        let active = node.parentNode.querySelector("[class*='activeIcon']:not([class*='finally-bs-activeIcon'])");
        if (active) {
          let activeClass = active.className.match(/(?:\s|^)(activeIcon(?:[^\s|$]+))(?:\s|$)/)[1];
          active.classList.remove(activeClass);
        }
        sortIcon.classList.add("finally-bs-activeIcon");
        if (node.finallySort == 1) {
          sortIcon.classList.remove("finally-bs-desc");
          sortIcon.classList.add("finally-bs-asc");
        } else {
          sortIcon.classList.remove("finally-bs-asc");
          sortIcon.classList.add("finally-bs-desc");
        }
      } else {
        sortIcon.classList.remove("finally-bs-activeIcon");
      }
    }
    let nodes = Array.from(
      node.querySelectorAll(".table-body > .table-row, .your:not(.row-animation-new), .enemy:not(.row-animation-new)")
    );
    for (let i = 0; i < nodes.length; i++) if (nodes[i].finallyPos == void 0) nodes[i].finallyPos = i;
    nodes = nodes.sort((a, b) => {
      let posA = a.finallyPos;
      let idA = a.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, "$1");
      let totalA = bsCache[idA] && typeof bsCache[idA].total == "number" && bsCache[idA].total || posA;
      let posB = b.finallyPos;
      let idB = b.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, "$1");
      let totalB = bsCache[idB] && typeof bsCache[idB].total == "number" && bsCache[idB].total || posB;
      node.finallySort;
      switch (node.finallySort) {
        case 1:
          if (totalA <= 100 && totalB <= 100) return totalB > totalA ? 1 : -1;
          return totalA > totalB ? 1 : -1;
        case 2:
          return totalB > totalA ? 1 : -1;
        default:
          return posA > posB ? 1 : -1;
      }
    });
    for (let i = 0; i < nodes.length; i++) nodes[i].parentNode.appendChild(nodes[i]);
    if (!sort) {
      document.querySelectorAll(".members-list").forEach((e) => {
        if (node != e) sortStats(e, node.finallySort);
      });
    }
  }
  function addSpy(id, spy) {
    if (!spy) return;
    bsCache[id] = spy;
  }
  function updateStats(id, node, parentNode) {
    if (!node) return;
    let stats = Array(5).fill("N/A");
    let time = "";
    let ff2 = "-";
    let changeColor = false;
    let highestIndex = 1;
    const data = bsCache[id];
    if (data) {
      const { total, strength, defense, speed, dexterity, timestamp } = data;
      const lowFilter = filterFrom && total <= filterFrom;
      const highFilter = filterTo && total >= filterTo;
      const shouldHide = lowFilter || highFilter;
      if (shouldHide) parentNode.style.display = "none";
      else parentNode.style.display = "";
      stats = [total, strength, defense, speed, dexterity];
      highestIndex = stats.slice(1).reduce((maxIdx, val, idx, arr) => +val > +arr[maxIdx] ? idx : maxIdx, 0) + 1;
      const totalNum = +stats[0];
      const highestStat = +stats[highestIndex];
      changeColor = highestStat >= whore_threshold * totalNum;
      const enemyScore = [1, 2, 3, 4].map((i) => Math.sqrt(+stats[i] || 0)).reduce((sum, val) => sum + val, 0);
      const myScore = +localStorage.getItem("myBSScore");
      if (myScore > 0 && enemyScore > 0) {
        ff2 = Math.min(3, Math.round((1 + 8 / 3 * (enemyScore / myScore)) * 100) / 100);
      }
      const secondsAgo = Date.now() / 1e3 - timestamp;
      if (secondsAgo < 0) {
        delete bsCache[id];
        localStorage["finally.torn.bs"] = JSON.stringify(bsCache);
        return;
      }
      const timeLabels = [
        [365 * 24 * 60 * 60, "years ago"],
        [30 * 24 * 60 * 60, "months ago"],
        [24 * 60 * 60, "days ago"],
        [60 * 60, "hours ago"],
        [60, "minutes ago"]
      ];
      for (const [sec, label] of timeLabels) {
        if (secondsAgo > sec) {
          time = `${Math.floor(secondsAgo / sec)} ${label}`;
          break;
        }
      }
      if (!time) time = `${Math.floor(secondsAgo)} seconds ago`;
    }
    const units = ["K", "M", "B", "T", "Q"];
    stats = stats.map((val, i) => {
      let num = +val;
      if (isNaN(num) || num === 0) return "N/A";
      for (const unit of units) {
        num /= 1e3;
        if (num < 1e3) {
          const fixed = i === 0 ? num >= 100 ? 0 : 1 : 2;
          return `${num.toFixed(fixed)}${unit}`;
        }
      }
      return val;
    });
    const statsWithColors = stats.map((val, i) => {
      if (!colorMode) return `<span>${val}</span>`;
      if (changeColor && i === 0) return `<span style="color: ${colors[highestIndex]};">${val}</span>`;
      if (changeColor && i === highestIndex) return `<span style="color: ${colors[i]};font-weight:bold">${val}</span>`;
      return `<span>${val}</span>`;
    });
    node.style.border = ff2 >= ff_threshold ? `${borderThickness}px solid ${borderColor}` : "";
    node.innerHTML = statsWithColors[0];
    node.title = `
      <div class="finally-bs-stat">
        <b>FF</b> <span class="finally-bs-stat">${ff2}</span><br/>
        <b>STR</b> ${statsWithColors[1]}<br/>
        <b>DEF</b> ${statsWithColors[2]}<br/>
        <b>SPD</b> ${statsWithColors[3]}<br/>
        <b>DEX</b> ${statsWithColors[4]}<br/>
        ${time}
      </div>`;
  }
  function updateHospTimers() {
    for (let i = 0, n = hospNodes.length; i < n; i++) {
      const hospNode = hospNodes[i];
      const id = hospNode[0];
      const node = hospNode[1];
      if (!node) continue;
      if (!hospTime[id]) continue;
      let totalSeconds = hospTime[id] - (/* @__PURE__ */ new Date()).getTime() / 1e3;
      if (!totalSeconds || totalSeconds <= 0) continue;
      else if (totalSeconds >= 10 * 60 && hospLoopCounter % 10 != 0) continue;
      else if (totalSeconds < 10 * 60 && totalSeconds >= 5 * 60 && hospLoopCounter % 5 != 0) continue;
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = Math.floor(totalSeconds % 60);
      node.textContent = `${hours.toString().padLeft(2, "0")}:${minutes.toString().padLeft(2, "0")}:${seconds.toString().padLeft(2, "0")}`;
    }
    if (hospNodes.length > 0) hospLoopCounter++;
    setTimeout(updateHospTimers, 1e3);
  }
  function updateStatus(id, node) {
    if (!node) return;
    if (hospNodes.find((h) => h[0] == id)) return;
    hospNodes.push([id, node]);
  }
  function onClickCopyStatus(event) {
    var _a;
    const name = (_a = event.target.parentNode.querySelector('.honor-text:not([class*=" "])')) == null ? void 0 : _a.textContent;
    const status = event.target.textContent;
    const bs = event.target.parentNode.querySelector(".bs").textContent;
    const id = event.target.parentNode.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, "$1");
    const text = `${name} ${bs} ${status} https://torn.com/loader.php?sid=attack&user2ID=${id}`;
    navigator.clipboard.writeText(text);
  }
  function showStats(node) {
    if (!node) return;
    let id = node.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, "$1");
    let bsNode = node.querySelector(".bs") || document.createElement("div");
    let statusNode = node.querySelector(".status");
    statusNode.addEventListener("click", (event) => {
      onClickCopyStatus(event);
    });
    updateStats(id, bsNode, node);
    updateStatus(id, statusNode);
    if (bsNode.classList.contains("bs")) {
      return;
    }
    bsNode.className = "table-cell bs level lvl left iconShow finally-bs-col";
    let iconsNode = node.querySelector(".user-icons, .member-icons, .points");
    iconsNode.parentNode.insertBefore(bsNode, iconsNode);
    let isMobile = false;
    bsNode.addEventListener("touchstart", () => isMobile = true);
    bsNode.addEventListener("click", () => {
      if (isMobile) return;
      window.open(`loader.php?sid=attack&user2ID=${id}`, "_newtab");
    });
    bsNode.addEventListener("dblclick", () => {
      window.open(`loader.php?sid=attack&user2ID=${id}`, "_newtab");
    });
  }
  function showStatsAll(node) {
    if (!node) node = Array.from(document.querySelectorAll(".f-war-list .members-list, .members-list"));
    if (!node) return;
    if (!(node instanceof Array)) {
      node = [node];
    }
    node.forEach(
      (n) => n.querySelectorAll(".your:not(.row-animation-new), .enemy:not(.row-animation-new), .table-body > .table-row").forEach((e) => showStats(e))
    );
  }
  function watchWall(observeNode) {
    if (!observeNode) return;
    loadFactions();
    let parentNode = observeNode.parentNode.parentNode.parentNode;
    let factionNames = parentNode.querySelector(".faction-names");
    if (factionNames && !factionNames.querySelector(".finally-bs-swap")) {
      let filterFromTo2 = function() {
        function formatInput(input) {
          let value = input.value.toLowerCase();
          let valueNum = value.replace(/[^\d]/g, "");
          let multiplier = 1;
          if (value.indexOf("k") !== -1) multiplier = 1e3;
          else if (value.indexOf("m") !== -1) multiplier = 1e6;
          else if (value.indexOf("b") !== -1) multiplier = 1e9;
          else if (value.indexOf("t") !== -1) multiplier = 1e12;
          valueNum *= multiplier;
          input.value = valueNum > 0 ? valueNum.toLocaleString("en-US") : "";
          return valueNum;
        }
        filterFrom = formatInput(filterFromInput);
        filterTo = formatInput(filterToInput);
        localStorage.setItem("finally.torn.factionFilterFrom", filterFrom || "");
        localStorage.setItem("finally.torn.factionFilterTo", filterTo || "");
        showStatsAll();
      };
      let swapNode = document.createElement("div");
      swapNode.className = "finally-bs-swap";
      swapNode.innerHTML = "&lt;&gt;";
      factionNames.appendChild(swapNode);
      swapNode.addEventListener("click", () => {
        parentNode.querySelectorAll(".name.left, .name.right, .tab-menu-cont.right, .tab-menu-cont.left").forEach((e) => {
          if (e.classList.contains("left")) {
            e.classList.remove("left");
            e.classList.add("right");
          } else {
            e.classList.remove("right");
            e.classList.add("left");
          }
        });
      });
      let filterNode = document.createElement("div");
      filterNode.className = "finally-bs-filter input-money-group no-max-value";
      let filterFromInput = document.createElement("input");
      filterFromInput.className = "input-money";
      filterFromInput.placeholder = "Filter BS from";
      filterFromInput.value = localStorage.getItem("finally.torn.factionFilterFrom") || "";
      let filterToInput = document.createElement("input");
      filterToInput.className = "input-money";
      filterToInput.placeholder = "Filter BS to";
      filterToInput.value = localStorage.getItem("finally.torn.factionFilterTo") || "";
      filterNode.appendChild(filterFromInput);
      filterNode.appendChild(filterToInput);
      factionNames.appendChild(filterNode);
      filterFromTo2();
      filterFromInput.addEventListener("keyup", filterFromTo2);
      filterToInput.addEventListener("keyup", filterFromTo2);
    }
    let titleNode = observeNode.parentNode.querySelector(".title, .c-pointer");
    let lvNode = titleNode.querySelector(".level");
    lvNode.childNodes[0].nodeValue = "Lv";
    let oldStatusNode = titleNode.querySelector(".status");
    if (oldStatusNode) {
      let statusNode = oldStatusNode.cloneNode(true);
      let orderClass = statusNode.childNodes[1].className.match(/(?:\s|^)((?:asc|desc)(?:[^\s|$]+))(?:\s|$)/)[1];
      statusNode.childNodes[1].classList.remove(orderClass);
      oldStatusNode.replaceWith(statusNode);
      statusNode.addEventListener("click", () => {
        sortStatus(observeNode);
      });
    }
    if (!titleNode.querySelector(".bs")) {
      let bsNode = lvNode.cloneNode(true);
      bsNode.classList.add("bs");
      bsNode.childNodes[0].nodeValue = "BS";
      titleNode.insertBefore(bsNode, titleNode.querySelector(".user-icons, .points"));
      if (bsNode.childNodes.length > 1) {
        let orderClass = bsNode.childNodes[1].className.match(/(?:\s|^)((?:asc|desc)(?:[^\s|$]+))(?:\s|$)/)[1];
        bsNode.childNodes[1].classList.remove(orderClass);
        for (let i = 0; i < titleNode.children.length; i++) {
          titleNode.children[i].addEventListener("click", (e) => {
            setTimeout(() => {
              let sort = i + 1;
              let sortIcon2 = e.target.querySelector("[class*='sortIcon']");
              let desc2 = sortIcon2 ? sortIcon2.className.indexOf("desc") === -1 : false;
              sort = desc2 ? sort : -sort;
              localStorage.setItem("finally.torn.factionSort", sort);
              if (!e.target.classList.contains("status"))
                document.querySelectorAll("[class*='finally-status-activeIcon']").forEach((e2) => e2.classList.remove("finally-status-activeIcon"));
              if (!e.target.classList.contains("bs"))
                document.querySelectorAll("[class*='finally-bs-activeIcon']").forEach((e2) => e2.classList.remove("finally-bs-activeIcon"));
            }, 100);
          });
        }
        bsNode.addEventListener("click", () => {
          sortStats(observeNode);
        });
        let title = titleNode.children[Math.abs(previousSort) - 1];
        let sortIcon = title.querySelector("[class*='sortIcon']");
        let desc = sortIcon ? sortIcon.className.indexOf("desc") !== -1 : false;
        let active = sortIcon ? sortIcon.className.indexOf("activeIcon") !== -1 : false;
        let x = 0;
        if (title.classList.contains("bs") && observeNode.querySelector(".enemy"))
          x = 0;
        else if (!active && previousSort < 0) x = 1;
        else if (!active) x = 2;
        else if (previousSort < 0 && !desc) x = 1;
        else if (previousSort > 0 && desc) x = 1;
        for (; x > 0; x--) {
          title.click();
        }
      }
    }
    showStatsAll(observeNode);
    let prevSortCheck = "";
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        for (const node of mutation.addedNodes) {
          if (node.classList && (node.classList.contains("your") || node.classList.contains("enemy"))) {
            showStats(node);
          }
        }
      });
      let sort = Array.from(observeNode.querySelectorAll('a[href*="XID"]')).map((a) => a.href).join(",");
      if (prevSortCheck != sort && observeNode.parentNode.querySelector(".finally-bs-activeIcon")) {
        mo.disconnect();
        sortStats(observeNode, observeNode.finallySort);
        prevSortCheck = Array.from(observeNode.querySelectorAll('a[href*="XID"]')).map((a) => a.href).join(",");
        mo.takeRecords();
        mo.observe(observeNode, { childList: true, subtree: true });
      }
    });
    mo.observe(observeNode, { childList: true, subtree: true });
  }
  function watchWalls(observeNode) {
    if (!observeNode) return;
    observeNode.querySelectorAll(".members-list").forEach((e) => watchWall(e));
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        for (const node of mutation.addedNodes) {
          node.querySelector && node.querySelectorAll(".members-list").forEach((w) => watchWall(w));
        }
      });
    }).observe(observeNode, { childList: true, subtree: true });
  }
  function memberList(observeNode) {
    if (!observeNode) return;
    loadFactions();
    let titleNode = observeNode.querySelector(".table-header");
    if (!titleNode || titleNode.querySelector(".bs")) return;
    let bsNode = document.createElement("li");
    bsNode.className = "table-cell bs torn-divider divider-vertical";
    bsNode.innerHTML = "BS";
    titleNode.insertBefore(bsNode, titleNode.querySelector(".member-icons"));
    for (let i = 0; i < titleNode.children.length; i++) {
      titleNode.children[i].addEventListener("click", (e) => {
        let sort = i + 1;
        sort = e.target.querySelector("[class*='asc']") ? -sort : sort;
        localStorage.setItem("finally.torn.factionSort", sort);
      });
    }
    bsNode.addEventListener("click", () => {
      sortStats(observeNode);
    });
    if (previousSort >= 0) {
      titleNode.children[previousSort - 1].click();
      titleNode.children[previousSort - 1].click();
    } else if (previousSort < 0) titleNode.children[-previousSort - 1].click();
    observeNode.querySelectorAll(".table-body > .table-row").forEach((e) => showStats(e));
  }
  cacheMyBattleStats();
  updateHospTimers();
  memberList(document.querySelector(".members-list"));
  watchWalls(document.querySelector(".f-war-list"));
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      for (const node of mutation.addedNodes) {
        memberList(node.querySelector && node.querySelector(".members-list"));
        watchWalls(node.querySelector && node.querySelector(".f-war-list"));
      }
    });
  }).observe(document.body, { childList: true, subtree: true });
  const targetWindow = isPDA() ? window : unsafeWindow;
  const oldFetch = targetWindow.fetch;
  targetWindow.fetch = async (...args) => {
    var _a;
    const url = ((_a = args[0]) == null ? void 0 : _a.url) || args[0];
    const notWarPage = !url.includes("step=getwarusers") && !url.includes("step=getProcessBarRefreshData");
    if (notWarPage) return oldFetch(...args);
    const response = await oldFetch(...args);
    const clone = response.clone();
    clone.json().then((json) => {
      let members = null;
      if (json.warDesc) members = json.warDesc.members;
      else if (json.userStatuses) members = json.userStatuses;
      else return;
      Object.keys(members).forEach((id) => {
        const status = members[id].status || members[id];
        id = members[id].userID || id;
        if (status.text === "Hospital") hospTime[id] = status.updateAt;
        else delete hospTime[id];
      });
      showStatsAll();
    });
    return response;
  };
  const targetWindowSoc = isPDA() ? window : unsafeWindow;
  const oldWebSocket = targetWindowSoc.WebSocket;
  targetWindowSoc.WebSocket = function(...args) {
    const socket = new oldWebSocket(...args);
    socket.addEventListener("message", (event) => {
      var _a, _b, _c, _d, _e, _f;
      const json = JSONparse(event.data);
      const respUser = (_e = (_d = (_c = (_b = (_a = json == null ? void 0 : json.push) == null ? void 0 : _a.pub) == null ? void 0 : _b.data) == null ? void 0 : _c.message) == null ? void 0 : _d.namespaces) == null ? void 0 : _e.users;
      const statusUpdate = (_f = respUser == null ? void 0 : respUser.actions) == null ? void 0 : _f.updateStatus;
      if (!(statusUpdate == null ? void 0 : statusUpdate.status)) return;
      const id = statusUpdate.userId;
      const status = statusUpdate.status;
      if (status.text === "Hospital") hospTime[id] = status.updateAt;
      else delete hospTime[id];
      showStatsAll();
    });
    return socket;
  };
  setTimeout(getFactionData, 2e3);
  const addStyle = (style) => {
    if (isPDA()) {
      const elem = document.createElement("style");
      elem.innerText = style;
      document.head.appendChild(elem);
      return;
    }
    GM_addStyle(style);
  };
  addStyle(`
    @media screen and (max-width: 1000px) {
        .members-cont .bs {
            display: none;
        }
    }

    .members-cont .level {
        width: 27px !important;
    }

    .members-cont .id {
        padding-left: 5px !important;
        width: 28px !important;
    }

    .members-cont .points {
        width: 42px !important;
    }

    .finally-bs-stat {
        font-family: monospace;
    }

    .finally-bs-stat > span {
        display: inline-block;
        width: 55px;
        text-align: right;
    }

    .faction-names {
        position: relative;
    }

    .finally-status-filter {
        position: absolute !important;
        top: 25px !important;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 120px;
        cursor: pointer;
    }
    .finally-status-filter > input {
        display: block !important;
        width: 100px;
    }

    .finally-status-swap {
        position: absolute;
        top: 0px;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 100px;
        cursor: pointer;
    }

    .finally-status-activeIcon {
        display: block !important;
    }

    .finally-status-asc {
        border-bottom: 6px solid var(--sort-arrow-color);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 0 solid transparent;
        height: 0;
        top: -8px;
        width: 0;
    }

    .finally-status-desc {
        border-bottom: 0 solid transparent;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid var(--sort-arrow-border-color);
        height: 0;
        top: -1px;
        width: 0;
    }

    .finally-status-col {
        text-overflow: clip !important;
    }


    .finally-bs-filter {
        position: absolute !important;
        top: 25px !important;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 120px;
        cursor: pointer;
    }
    .finally-bs-filter > input {
        display: block !important;
        width: 100px;
    }

    .finally-bs-swap {
        position: absolute;
        top: 0px;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 100px;
        cursor: pointer;
    }

    .finally-bs-activeIcon {
        display: block !important;
    }

    .finally-bs-asc {
        border-bottom: 6px solid var(--sort-arrow-color);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 0 solid transparent;
        height: 0;
        top: -8px;
        width: 0;
    }

    .finally-bs-desc {
        border-bottom: 0 solid transparent;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid var(--sort-arrow-border-color);
        height: 0;
        top: -1px;
        width: 0;
    }

    .finally-bs-col {
        text-overflow: clip !important;
    }

    .raid-members-list .level:not(.bs) {
        width: 16px !important;
    }

    .raid-members-list .level:not(.status) {
        width: 16px !important;
    }

    div.desc-wrap:not([class*='warDesc']) .finally-bs-swap {
    display: none;
    }

    div.desc-wrap:not([class*='warDesc']) .finally-status-swap {
    display: none;
    }

    div.desc-wrap:not([class*='warDesc']) .faction-names {
    padding-top: 100px !important;
    }

    .re_spy_title, .re_spy_col {
    display: none !important;
    }
`);

})();
