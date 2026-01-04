// ==UserScript==
// @name         Torn Lingerie Store Tax Tracker
// @namespace    http://tampermonkey.net/
// @version      7.14
// @description  Track weekly company tax from employees in Torn with Torn-styled table, draggable/resizable panel, reminders, overpayment tracking, totals row, and Test Mode.
// @author       Hooded_Prince
// @match        https://www.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552053/Torn%20Lingerie%20Store%20Tax%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/552053/Torn%20Lingerie%20Store%20Tax%20Tracker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY_SETTINGS = "torn_tax_settings_v4";
  const STORAGE_KEY_ITEM_CATALOG = "torn_tax_item_catalog_v1";
  const ITEM_CATALOG_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

  const DEFAULT_SETTINGS = {
    startYear: new Date().getUTCFullYear(),
    startWeek: 40,
    maxWeeks: 12,
    manualMode: false,
    manualMembers: {},
    apiKey: "",
    testMode: false,
    // Per-member overrides
    memberRequirements: {},
    memberRequirementResets: {},
    memberWeekExclusions: {},
    memberWeekCarrybacks: {},
    defaultRequirementReset: null,
    defaultMoneyTax: 10000000,
    defaultItemTax: 7,
    defaultRequirementType: "money",
    allowPrepaymentRollover: true,
    taxItemName: "Xanax",
    reminderMessage: "Hi {name}, you currently owe {amount}. Please pay as soon as possible. Thanks!",
    excludedPayments: {},
    enableEmployeeMenu: false,
    // Legacy field kept for backwards compatibility with older saves
    requiredTax: 10000000
  };

  function loadSettings() {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return saved ? Object.assign({}, DEFAULT_SETTINGS, JSON.parse(saved)) : DEFAULT_SETTINGS;
  }
  function saveSettings(s) {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(s));
  }

  function normalizeItemName(name) {
    return typeof name === 'string' ? name.trim().toLowerCase() : '';
  }

  function normalizeItemId(id) {
    if (id === undefined || id === null) {
      return undefined;
    }
    const numeric = Number(id);
    return Number.isFinite(numeric) ? numeric : undefined;
  }

  function normalizeEmployeeRecord(record) {
    if (!record) {
      return { name: "", joinDays: null, joinDate: null };
    }
    if (typeof record === "string") {
      return { name: record, joinDays: null, joinDate: null };
    }
    if (typeof record === "object") {
      const name = typeof record.name === "string" ? record.name : "";
      const joinDaysValue = Number(record.joinDays);
      const joinDateValue = Number(record.joinDate);
      return {
        name,
        joinDays: Number.isFinite(joinDaysValue) ? joinDaysValue : null,
        joinDate: Number.isFinite(joinDateValue) && joinDateValue > 0 ? joinDateValue : null
      };
    }
    return { name: "", joinDays: null, joinDate: null };
  }

  function normalizeEmployeeMap(map) {
    const normalized = {};
    Object.keys(map || {}).forEach(id => {
      normalized[id] = normalizeEmployeeRecord(map[id]);
    });
    return normalized;
  }

  function parseWeekKey(key) {
    if (typeof key !== "string") {
      return null;
    }
    const match = key.match(/^(\d+)-W(\d+)$/);
    if (!match) {
      return null;
    }
    return [parseInt(match[1], 10), parseInt(match[2], 10)];
  }

  function compareWeekKeys(a, b) {
    const pa = parseWeekKey(a);
    const pb = parseWeekKey(b);
    if (!pa && !pb) {
      return 0;
    }
    if (!pa) {
      return -1;
    }
    if (!pb) {
      return 1;
    }
    if (pa[0] !== pb[0]) {
      return pa[0] - pb[0];
    }
    return pa[1] - pb[1];
  }

  function formatWeekKey(year, week) {
    return `${year}-W${week}`;
  }

  function isWeekOnOrAfter(candidate, baseline) {
    const cand = parseWeekKey(candidate);
    const base = parseWeekKey(baseline);
    if (!cand || !base) {
      return false;
    }
    if (cand[0] > base[0]) {
      return true;
    }
    if (cand[0] < base[0]) {
      return false;
    }
    return cand[1] >= base[1];
  }

  function getCurrentWeekKey() {
    const now = new Date();
    const [year, week] = getWeekNumber(now);
    return `${year}-W${week}`;
  }

  function getEmployeeName(record) {
    if (!record) {
      return "";
    }
    if (typeof record === "string") {
      return record;
    }
    if (typeof record === "object" && record !== null) {
      return typeof record.name === "string" ? record.name : "";
    }
    return "";
  }

  function getEmployeeJoinTimestamp(record) {
    if (!record || typeof record !== "object") {
      return null;
    }
    const ts = Number(record.joinDate);
    return Number.isFinite(ts) && ts > 0 ? ts : null;
  }

  function loadItemCatalog() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEM_CATALOG);
      if (!saved) {
        return { timestamp: 0, byName: {}, byId: {} };
      }
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== 'object') {
        return { timestamp: 0, byName: {}, byId: {} };
      }
      const timestamp = Number(parsed.timestamp) || 0;
      const byName = parsed.byName && typeof parsed.byName === 'object' ? parsed.byName : {};
      const byId = parsed.byId && typeof parsed.byId === 'object' ? parsed.byId : {};
      return { timestamp, byName, byId };
    } catch (err) {
      console.warn('Failed to load item catalog', err);
      return { timestamp: 0, byName: {}, byId: {} };
    }
  }

  function saveItemCatalog(catalog) {
    try {
      localStorage.setItem(STORAGE_KEY_ITEM_CATALOG, JSON.stringify(catalog));
    } catch (err) {
      console.warn('Failed to save item catalog', err);
    }
  }

  function ensureCatalogShape(catalog) {
    if (!catalog || typeof catalog !== 'object') {
      return { timestamp: 0, byName: {}, byId: {} };
    }
    if (!catalog.byName || typeof catalog.byName !== 'object') {
      catalog.byName = {};
    }
    if (!catalog.byId || typeof catalog.byId !== 'object') {
      catalog.byId = {};
    }
    if (!Number.isFinite(Number(catalog.timestamp))) {
      catalog.timestamp = 0;
    }
    return catalog;
  }

  let ITEM_CATALOG = ensureCatalogShape(loadItemCatalog());

  function recordItemMapping(byName, key, info) {
    if (!key || byName[key]) {
      return;
    }
    byName[key] = info;
  }

  async function ensureItemCatalog() {
    const now = Date.now();
    if (ITEM_CATALOG && ITEM_CATALOG.timestamp && (now - ITEM_CATALOG.timestamp) < ITEM_CATALOG_MAX_AGE && Object.keys(ITEM_CATALOG.byName).length > 0) {
      return ITEM_CATALOG;
    }
    if (!SETTINGS.apiKey) {
      return ITEM_CATALOG;
    }
    try {
      const res = await fetch(`https://api.torn.com/torn/?selections=items&key=${encodeURIComponent(SETTINGS.apiKey)}`);
      const data = await res.json();
      if (!data || data.error || !data.items || typeof data.items !== 'object') {
        if (!ITEM_CATALOG.timestamp || (now - ITEM_CATALOG.timestamp) >= ITEM_CATALOG_MAX_AGE) {
          ITEM_CATALOG.timestamp = now;
          saveItemCatalog(ITEM_CATALOG);
        }
        return ITEM_CATALOG;
      }
      const byName = {};
      const byId = {};
      Object.keys(data.items).forEach(id => {
        const item = data.items[id];
        const numericId = normalizeItemId(id);
        if (!item || numericId === undefined) {
          return;
        }
        const baseNames = [item.name, item.item, item.itemname, item.itemName, item.title, item.plural];
        const primaryName = baseNames.find(name => typeof name === 'string' && name.trim());
        const candidateNames = baseNames.filter(name => typeof name === 'string');
        if (Array.isArray(item.aliases)) {
          item.aliases.forEach(alias => {
            if (typeof alias === 'string') {
              candidateNames.push(alias);
            }
          });
        }
        candidateNames.forEach(candidate => {
          const key = normalizeItemName(candidate);
          if (!key) {
            return;
          }
          recordItemMapping(byName, key, { id: numericId, name: primaryName || candidate });
        });
        byId[numericId] = { name: primaryName || '' };
      });
      ITEM_CATALOG = ensureCatalogShape({ timestamp: now, byName, byId });
      saveItemCatalog(ITEM_CATALOG);
    } catch (err) {
      console.warn('Failed to fetch item catalog', err);
    }
    return ITEM_CATALOG;
  }

  function getItemIdForName(name) {
    if (!ITEM_CATALOG || !ITEM_CATALOG.byName) {
      return undefined;
    }
    const key = normalizeItemName(name);
    if (!key) {
      return undefined;
    }
    const entry = ITEM_CATALOG.byName[key];
    if (!entry || entry.id === undefined) {
      return undefined;
    }
    const numeric = normalizeItemId(entry.id);
    return numeric;
  }

  let SETTINGS = loadSettings();

  // Migrate legacy saves that only had a single required tax amount
  if (SETTINGS.requiredTax && !SETTINGS.defaultMoneyTax) {
    SETTINGS.defaultMoneyTax = SETTINGS.requiredTax;
  }
  if (!SETTINGS.memberRequirements) {
    SETTINGS.memberRequirements = {};
  }
  if (!SETTINGS.reminderMessage) {
    SETTINGS.reminderMessage = DEFAULT_SETTINGS.reminderMessage;
  }
  if (typeof SETTINGS.enableEmployeeMenu !== "boolean") {
    SETTINGS.enableEmployeeMenu = DEFAULT_SETTINGS.enableEmployeeMenu;
  }
  if (!SETTINGS.taxItemName) {
    SETTINGS.taxItemName = DEFAULT_SETTINGS.taxItemName;
  }
  if (!SETTINGS.defaultItemTax) {
    SETTINGS.defaultItemTax = DEFAULT_SETTINGS.defaultItemTax;
  }
  if (SETTINGS.defaultRequirementType !== "item" && SETTINGS.defaultRequirementType !== "money") {
    SETTINGS.defaultRequirementType = DEFAULT_SETTINGS.defaultRequirementType;
  }
  if (!SETTINGS.memberRequirementResets || typeof SETTINGS.memberRequirementResets !== "object") {
    SETTINGS.memberRequirementResets = {};
  }
  if (!SETTINGS.memberWeekExclusions || typeof SETTINGS.memberWeekExclusions !== "object") {
    SETTINGS.memberWeekExclusions = {};
  }
  if (!SETTINGS.memberWeekCarrybacks || typeof SETTINGS.memberWeekCarrybacks !== "object") {
    SETTINGS.memberWeekCarrybacks = {};
  }
  if (!SETTINGS.excludedPayments || typeof SETTINGS.excludedPayments !== "object") {
    SETTINGS.excludedPayments = {};
  }
  if (typeof SETTINGS.defaultRequirementReset !== "string") {
    SETTINGS.defaultRequirementReset = `${SETTINGS.startYear}-W${SETTINGS.startWeek}`;
  }

  let lastEmployeesCache = {};
  let lastWeeklyDataCache = {};
  let lastPaymentHistoryCache = {};

  function getDefaultRequirement() {
    const type = SETTINGS.defaultRequirementType === 'item' ? 'item' : 'money';
    const amount = type === 'item' ? SETTINGS.defaultItemTax : SETTINGS.defaultMoneyTax;
    return { type, amount, isDefault: true };
  }

  function getMemberRequirement(id) {
    if (!SETTINGS.enableEmployeeMenu) {
      return getDefaultRequirement();
    }
    const req = SETTINGS.memberRequirements[id];
    if (!req || req.useDefault) {
      return getDefaultRequirement();
    }
    const type = req.type === 'item' ? 'item' : 'money';
    const fallback = type === 'item' ? SETTINGS.defaultItemTax : SETTINGS.defaultMoneyTax;
    const amount = Number.isFinite(req.amount) ? req.amount : fallback;
    return { type, amount, isDefault: false };
  }

  function getRequirementStartWeek(id, requirement) {
    if (SETTINGS.memberRequirementResets && typeof SETTINGS.memberRequirementResets[id] === "string") {
      return SETTINGS.memberRequirementResets[id];
    }
    if (requirement && requirement.isDefault && typeof SETTINGS.defaultRequirementReset === "string") {
      return SETTINGS.defaultRequirementReset;
    }
    return `${SETTINGS.startYear}-W${SETTINGS.startWeek}`;
  }

  function ensureExcludedPaymentsContainer() {
    if (!SETTINGS.excludedPayments || typeof SETTINGS.excludedPayments !== "object") {
      SETTINGS.excludedPayments = {};
    }
    return SETTINGS.excludedPayments;
  }

  function isPaymentExcluded(employeeId, paymentId) {
    if (!employeeId || !paymentId) {
      return false;
    }
    const container = ensureExcludedPaymentsContainer();
    if (!container[employeeId] || typeof container[employeeId] !== "object") {
      return false;
    }
    return !!container[employeeId][paymentId];
  }

  function setPaymentExcluded(employeeId, paymentId, excluded) {
    if (!employeeId || !paymentId) {
      return;
    }
    const container = ensureExcludedPaymentsContainer();
    if (!container[employeeId] || typeof container[employeeId] !== "object") {
      container[employeeId] = {};
    }
    if (excluded) {
      container[employeeId][paymentId] = true;
    } else {
      delete container[employeeId][paymentId];
      if (Object.keys(container[employeeId]).length === 0) {
        delete container[employeeId];
      }
    }
  }

  function applyPaymentExclusion(employeeId, paymentId, excluded) {
    if (!employeeId || !paymentId) {
      return;
    }
    if (!lastPaymentHistoryCache || !lastWeeklyDataCache) {
      return;
    }
    const entries = lastPaymentHistoryCache[employeeId];
    if (!Array.isArray(entries)) {
      return;
    }
    const targetId = String(paymentId);
    const entry = entries.find(item => {
      if (!item || typeof item !== "object") {
        return false;
      }
      const entryId = item.id || item.logId;
      if (entryId !== undefined && entryId !== null) {
        return String(entryId) === targetId;
      }
      return false;
    });
    if (!entry) {
      return;
    }
    const alreadyExcluded = !!entry.excluded;
    if (alreadyExcluded === excluded) {
      return;
    }
    entry.excluded = excluded;
    const weekKey = entry.weekKey;
    if (!weekKey) {
      refreshViewsAfterPaymentChange();
      return;
    }
    if (!lastWeeklyDataCache[weekKey]) {
      lastWeeklyDataCache[weekKey] = {};
    }
    if (!lastWeeklyDataCache[weekKey][employeeId]) {
      lastWeeklyDataCache[weekKey][employeeId] = { money: 0, items: 0 };
    }
    const bucket = lastWeeklyDataCache[weekKey][employeeId];
    const amount = Number(entry.amount) || 0;
    if (amount > 0) {
      if (entry.type === 'money') {
        const nextValue = (Number(bucket.money) || 0) + (excluded ? -amount : amount);
        bucket.money = Math.max(0, nextValue);
      } else if (entry.type === 'item') {
        const nextValue = (Number(bucket.items) || 0) + (excluded ? -amount : amount);
        bucket.items = Math.max(0, nextValue);
      }
    }
    refreshViewsAfterPaymentChange();
  }

  function refreshViewsAfterPaymentChange() {
    const employees = lastEmployeesCache || {};
    renderOverview(lastWeeklyDataCache, employees);
    if (SETTINGS.enableEmployeeMenu) {
      renderEmployeeMenu(employees);
    }
    renderPaymentHistory(lastPaymentHistoryCache, employees);
  }

  function syncExcludedPaymentsWithWeeklyData(paymentHistory, weeklyData) {
    if (!paymentHistory || typeof paymentHistory !== 'object' || !weeklyData || typeof weeklyData !== 'object') {
      return;
    }
    Object.keys(paymentHistory).forEach(employeeId => {
      const entries = paymentHistory[employeeId];
      if (!Array.isArray(entries)) {
        return;
      }
      entries.forEach(entry => {
        if (!entry || !entry.excluded) {
          return;
        }
        const weekKey = entry.weekKey;
        if (!weekKey) {
          return;
        }
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {};
        }
        if (!weeklyData[weekKey][employeeId]) {
          weeklyData[weekKey][employeeId] = { money: 0, items: 0 };
        }
        const bucket = weeklyData[weekKey][employeeId];
        const amount = Number(entry.amount) || 0;
        if (entry.type === 'money') {
          bucket.money = Math.max(0, (Number(bucket.money) || 0) - amount);
        } else if (entry.type === 'item') {
          bucket.items = Math.max(0, (Number(bucket.items) || 0) - amount);
        }
      });
    });
  }

  function getExcludedWeeksForMember(id) {
    if (!SETTINGS.memberWeekExclusions) {
      return [];
    }
    const exclusions = SETTINGS.memberWeekExclusions[id];
    if (!Array.isArray(exclusions)) {
      return [];
    }
    return exclusions.filter(week => typeof week === "string");
  }

  function setExcludedWeeksForMember(id, weeks) {
    if (!SETTINGS.memberWeekExclusions) {
      SETTINGS.memberWeekExclusions = {};
    }
    if (!weeks || weeks.length === 0) {
      delete SETTINGS.memberWeekExclusions[id];
      return;
    }
    const unique = Array.from(new Set(weeks.filter(week => typeof week === "string")));
    unique.sort(compareWeekKeys);
    SETTINGS.memberWeekExclusions[id] = unique;
  }

  function toggleWeekExclusionForMember(id, weekKey) {
    if (!id || !weekKey || !parseWeekKey(weekKey)) {
      return;
    }
    const existing = new Set(getExcludedWeeksForMember(id));
    if (existing.has(weekKey)) {
      existing.delete(weekKey);
    } else {
      existing.add(weekKey);
    }
    setExcludedWeeksForMember(id, Array.from(existing));
    saveSettings(SETTINGS);
  }

  function getWeekCarrybacksForMember(id) {
    if (!SETTINGS.memberWeekCarrybacks) {
      SETTINGS.memberWeekCarrybacks = {};
    }
    const raw = SETTINGS.memberWeekCarrybacks[id];
    if (!raw || typeof raw !== "object") {
      return {};
    }
    const valid = {};
    Object.keys(raw).forEach(weekKey => {
      const target = raw[weekKey];
      if (typeof weekKey === "string" && typeof target === "string" && parseWeekKey(weekKey) && parseWeekKey(target)) {
        valid[weekKey] = target;
      }
    });
    return valid;
  }

  function setWeekCarrybacksForMember(id, mapping) {
    if (!SETTINGS.memberWeekCarrybacks) {
      SETTINGS.memberWeekCarrybacks = {};
    }
    if (!mapping || Object.keys(mapping).length === 0) {
      delete SETTINGS.memberWeekCarrybacks[id];
      return;
    }
    const sanitized = {};
    Object.keys(mapping).forEach(weekKey => {
      const target = mapping[weekKey];
      if (typeof weekKey === "string" && typeof target === "string" && parseWeekKey(weekKey) && parseWeekKey(target)) {
        sanitized[weekKey] = target;
      }
    });
    if (Object.keys(sanitized).length === 0) {
      delete SETTINGS.memberWeekCarrybacks[id];
      return;
    }
    SETTINGS.memberWeekCarrybacks[id] = sanitized;
  }

  function updateWeekCarrybackForMember(id, weekKey, targetWeek) {
    if (!id || !weekKey || !parseWeekKey(weekKey)) {
      return;
    }
    const existing = getWeekCarrybacksForMember(id);
    if (!targetWeek || !parseWeekKey(targetWeek)) {
      delete existing[weekKey];
    } else {
      existing[weekKey] = targetWeek;
    }
    setWeekCarrybacksForMember(id, existing);
    saveSettings(SETTINGS);
  }

  // Floating open button
  const button = document.createElement("button");
  Object.assign(button.style, {
    position: "fixed", top: "30%", right: "0%", zIndex: "9999",
    backgroundColor: "#2e8b57", color: "#fff", border: "none",
    padding: "6px 10px", borderRadius: "6px 0 0 6px", cursor: "pointer"
  });
  button.textContent = "Tax";
  document.body.appendChild(button);

  // Panel shell
  const panel = document.createElement("div");
  panel.id = "tax-panel";
  Object.assign(panel.style, {
    display: "none", position: "fixed", top: "10%", left: "10%",
    width: "80%", height: "75%", background: "#1b1b1b", color: "#ccc",
    padding: "0", zIndex: "10000", borderRadius: "6px", overflow: "hidden",
    boxShadow: "0px 0px 15px rgba(0,0,0,0.7)", border: "1px solid #333",
    fontFamily: "'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'Apple Color Emoji', Verdana, sans-serif"
  });

  panel.innerHTML = `
    <div id="drag-bar" style="cursor:move;background:#2a2a2a;color:#fff;padding:6px 10px;border-bottom:1px solid #444;display:flex;align-items:center;gap:8px;">
      <span style="font-weight:bold;flex:1;">Weekly Tax Tracker</span>
      <div style="display:flex;align-items:center;gap:6px;">
        <button id="openOverview" style="background:#2e8b57;color:white;border:none;padding:4px 8px;cursor:pointer;border-radius:4px;">Overview</button>
        <button id="openPayments" style="background:#444;color:white;border:none;padding:4px 8px;cursor:pointer;border-radius:4px;">Payments</button>
        <button id="openEmployeeMenu" style="display:${SETTINGS.enableEmployeeMenu ? "inline-block" : "none"};background:#444;color:white;border:none;padding:4px 8px;cursor:pointer;border-radius:4px;">Employees</button>
        <button id="editSettings" style="background:#444;color:white;border:none;padding:4px 8px;cursor:pointer;border-radius:4px;">Settings</button>
        <button id="editEmployees" style="display:${SETTINGS.manualMode ? "inline-block" : "none"};background:#555;color:white;border:none;padding:4px 8px;cursor:pointer;border-radius:4px;">Edit Employees</button>
        <button id="close-tax" style="background:#b30000;color:white;border:none;padding:4px 8px;cursor:pointer;border-radius:4px;">X</button>
      </div>
    </div>
    <div id="viewContainer" style="height:calc(100% - 44px);">
      <div id="overviewView" style="height:100%;overflow:auto;padding:10px;"></div>
      <div id="paymentsView" style="display:none;height:100%;overflow:auto;padding:10px;"></div>
      <div id="employeeView" style="display:none;height:100%;overflow:auto;padding:10px;"></div>
    </div>
  `;
  document.body.appendChild(panel);

  const overviewView = panel.querySelector("#overviewView");
  const paymentsView = panel.querySelector("#paymentsView");
  const employeeView = panel.querySelector("#employeeView");
  const overviewButton = panel.querySelector("#openOverview");
  const paymentsButton = panel.querySelector("#openPayments");
  const employeeButton = panel.querySelector("#openEmployeeMenu");
  let currentView = "overview";

  function switchView(view) {
    if (view === "employees" && !SETTINGS.enableEmployeeMenu) {
      view = "overview";
    }
    currentView = view;

    if (overviewView) {
      overviewView.style.display = view === "overview" ? "block" : "none";
    }
    if (paymentsView) {
      paymentsView.style.display = view === "payments" ? "block" : "none";
      if (view !== "payments") {
        paymentsView.scrollTop = 0;
      }
    }
    if (employeeView) {
      employeeView.style.display = view === "employees" ? "block" : "none";
      if (view !== "employees") {
        employeeView.scrollTop = 0;
      }
    }

    if (overviewButton) {
      overviewButton.style.background = view === "overview" ? "#2e8b57" : "#444";
      overviewButton.style.color = "white";
    }
    if (paymentsButton) {
      paymentsButton.style.background = view === "payments" ? "#2e8b57" : "#444";
      paymentsButton.style.color = "white";
    }
    if (employeeButton) {
      employeeButton.style.background = view === "employees" ? "#2e8b57" : "#444";
      employeeButton.style.color = "white";
    }
  }

  makeDraggable(panel, panel.querySelector("#drag-bar"));
  makeResizable(panel);

  button.addEventListener("click", () => {
    if (!SETTINGS.apiKey && !SETTINGS.testMode) {
      showApiPrompt();
      return;
    }
    panel.style.display = "block";
    fetchData();
  });
  panel.querySelector("#close-tax").addEventListener("click", () => panel.style.display = "none");
  panel.querySelector("#editEmployees").addEventListener("click", () => showEmployeeEditor());
  panel.querySelector("#editSettings").addEventListener("click", () => showSettingsEditor());
  overviewButton.addEventListener("click", () => {
    switchView("overview");
    if (Object.keys(lastWeeklyDataCache).length === 0) {
      fetchData();
    }
  });
  if (paymentsButton) {
    paymentsButton.addEventListener("click", () => {
      switchView("payments");
      if (Object.keys(lastWeeklyDataCache).length === 0 && Object.keys(lastPaymentHistoryCache).length === 0) {
        fetchData();
      } else {
        renderPaymentHistory(lastPaymentHistoryCache, lastEmployeesCache);
      }
    });
  }
  if (employeeButton) {
    employeeButton.addEventListener("click", () => {
      switchView("employees");
      if (!SETTINGS.enableEmployeeMenu) return;
      if (Object.keys(lastEmployeesCache).length === 0) {
        fetchData();
      } else {
        renderEmployeeMenu(lastEmployeesCache);
      }
    });
  }

  switchView("overview");

  function showApiPrompt() {
    const editor = document.createElement("div");
    Object.assign(editor.style, {
      position: "fixed", top: "30%", left: "35%", width: "30%",
      background: "#222", color: "#fff", padding: "15px", zIndex: "11000",
      borderRadius: "6px", boxShadow: "0px 0px 10px rgba(0,0,0,0.7)"
    });
    editor.innerHTML = `
      <h3 style="margin:0 0 10px 0;">Enter Torn API Key</h3>
      <input id="apiInput" type="text" value="${SETTINGS.apiKey}" style="width:100%;padding:6px;background:#111;color:#0f0;border:1px solid #555;">
      <div style="text-align:right;margin-top:10px;">
        <button id="saveApi" style="background:#2e8b57;color:white;padding:5px 10px;border:none;border-radius:4px;cursor:pointer;">Save</button>
      </div>
    `;
    document.body.appendChild(editor);
    editor.querySelector("#saveApi").addEventListener("click", () => {
      SETTINGS.apiKey = editor.querySelector("#apiInput").value.trim();
      saveSettings(SETTINGS);
      editor.remove();
      panel.style.display = "block";
      fetchData();
    });
  }

  function showSettingsEditor() {
    const editor = document.createElement("div");
    Object.assign(editor.style, {
      position: "fixed", top: "18%", left: "34%", width: "32%",
      background: "#222", color: "#fff", padding: "15px", zIndex: "11000",
      borderRadius: "8px", boxShadow: "0px 0px 10px rgba(0,0,0,0.7)"
    });

    editor.innerHTML = `
      <h3 style="margin:0 0 10px 0;">Settings</h3>
      <label style="display:block;">API Key:
        <input id="setApiKey" type="text" value="${SETTINGS.apiKey}" style="width:100%;box-sizing:border-box;background:#111;color:#0f0;border:1px solid #555;margin-top:6px;">
      </label><br>
      <label>Start Year:
        <input id="setYear" type="number" value="${SETTINGS.startYear}" style="width:90px;background:#111;color:#0f0;border:1px solid #555;margin-left:8px;">
      </label><br><br>
      <label>Start Week:
        <input id="setWeek" type="number" value="${SETTINGS.startWeek}" style="width:90px;background:#111;color:#0f0;border:1px solid #555;margin-left:8px;">
      </label><br><br>
      <div style="margin:10px 0;padding:10px;border:1px solid #333;border-radius:6px;background:#191919;">
        <div style="margin-bottom:6px;font-weight:bold;color:#0f0;">Recollect recent data</div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span>Show last</span>
          <input id="recollectWeeks" type="number" value="${Math.min(SETTINGS.maxWeeks || 6, 6)}" style="width:70px;background:#111;color:#0f0;border:1px solid #555;padding:4px;">
          <span>weeks</span>
          <button id="applyRecollect" style="background:#2e8b57;color:white;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;">Recollect</button>
        </div>
        <small style="color:#ccc;display:block;margin-top:6px;">Updates the start week to the most recent weeks and refreshes the tracker immediately.</small>
      </div>
      <label>Max Weeks to Display:
        <input id="setMaxWeeks" type="number" value="${SETTINGS.maxWeeks}" style="width:90px;background:#111;color:#0f0;border:1px solid #555;margin-left:8px;">
      </label><br><br>
      <label><input id="manualMode" type="checkbox" ${SETTINGS.manualMode ? "checked" : ""}> Manual Employees Mode</label><br><br>
      <label><input id="testMode" type="checkbox" ${SETTINGS.testMode ? "checked" : ""}> Enable Test Mode (fake data)</label><br><br>
      <label><input id="enableEmployeeMenu" type="checkbox" ${SETTINGS.enableEmployeeMenu ? "checked" : ""}> Enable Employees Menu</label><br><br>
      <label><input id="allowRollover" type="checkbox" ${SETTINGS.allowPrepaymentRollover !== false ? "checked" : ""}> Allow prepayments to auto-cover future weeks</label>

      <fieldset style="border:1px solid #444;border-radius:6px;padding:10px;margin-top:12px;">
        <legend style="padding:0 6px;color:#0f0;">Defaults for New Employees</legend>
        <label>Default Requirement Type:
          <select id="setDefaultRequirementType" style="width:160px;background:#111;color:#0f0;border:1px solid #555;margin-left:8px;">
            <option value="money" ${SETTINGS.defaultRequirementType === "item" ? "" : "selected"}>Money</option>
            <option value="item" ${SETTINGS.defaultRequirementType === "item" ? "selected" : ""}>${SETTINGS.taxItemName}</option>
          </select>
        </label><br><br>
        <label>Default Money Tax:
          <input id="setDefaultMoney" type="number" value="${SETTINGS.defaultMoneyTax}" style="width:140px;background:#111;color:#0f0;border:1px solid #555;margin-left:8px;">
        </label><br><br>
        <label>Item Name:
          <input id="setItemName" type="text" value="${SETTINGS.taxItemName}" style="width:140px;background:#111;color:#0f0;border:1px solid #555;margin-left:8px;">
        </label><br><br>
        <label>Default Item Tax:
          <input id="setDefaultItem" type="number" value="${SETTINGS.defaultItemTax}" style="width:140px;background:#111;color:#0f0;border:1px solid #555;margin-left:8px;">
        </label>
      </fieldset>

      <label style="display:block;margin-top:12px;">Reminder Message:
        <textarea id="setReminder" style="width:100%;height:80px;background:#111;color:#0f0;border:1px solid #555;margin-top:6px;">${SETTINGS.reminderMessage}</textarea>
        <small style="color:#ccc;">Use placeholders: {name}, {id}, {amount}</small>
      </label>

      <div style="text-align:right;margin-top:12px;">
        <button id="saveSet" style="background:#2e8b57;color:white;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;">Save</button>
        <button id="cancelSet" style="background:#555;color:white;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;">Cancel</button>
      </div>
    `;
    document.body.appendChild(editor);
    const defaultTypeSelect = editor.querySelector("#setDefaultRequirementType");
    const itemNameInput = editor.querySelector("#setItemName");
    if (defaultTypeSelect && itemNameInput) {
      const updateItemLabel = () => {
        const option = defaultTypeSelect.querySelector('option[value="item"]');
        if (option) {
          const name = itemNameInput.value.trim() || DEFAULT_SETTINGS.taxItemName;
          option.textContent = name;
        }
      };
      updateItemLabel();
      itemNameInput.addEventListener("input", updateItemLabel);
    }
    const recollectInput = editor.querySelector("#recollectWeeks");
    const recollectButton = editor.querySelector("#applyRecollect");
    if (recollectButton && recollectInput) {
      recollectButton.addEventListener("click", () => {
        let weeks = parseInt(recollectInput.value, 10);
        if (!Number.isFinite(weeks) || weeks < 1) {
          weeks = 4;
        } else if (weeks > 52) {
          weeks = 52;
        }
        const offset = -(weeks - 1);
        const { year, week } = getRelativeWeekFromCurrent(offset);
        SETTINGS.startYear = year;
        SETTINGS.startWeek = week;
        saveSettings(SETTINGS);
        const yearInput = editor.querySelector("#setYear");
        const weekInput = editor.querySelector("#setWeek");
        if (yearInput) {
          yearInput.value = SETTINGS.startYear;
        }
        if (weekInput) {
          weekInput.value = SETTINGS.startWeek;
        }
        fetchData();
      });
    }
    editor.querySelector("#cancelSet").addEventListener("click", () => editor.remove());
    editor.querySelector("#saveSet").addEventListener("click", () => {
      const previousDefaults = getDefaultRequirement();
      SETTINGS.startYear = parseInt(editor.querySelector("#setYear").value, 10);
      SETTINGS.startWeek = parseInt(editor.querySelector("#setWeek").value, 10);
      SETTINGS.maxWeeks = parseInt(editor.querySelector("#setMaxWeeks").value, 10);
      SETTINGS.manualMode = editor.querySelector("#manualMode").checked;
      SETTINGS.testMode = editor.querySelector("#testMode").checked;
      SETTINGS.enableEmployeeMenu = editor.querySelector("#enableEmployeeMenu").checked;
      SETTINGS.allowPrepaymentRollover = editor.querySelector("#allowRollover").checked;
      const apiInput = editor.querySelector("#setApiKey");
      SETTINGS.apiKey = apiInput ? apiInput.value.trim() : SETTINGS.apiKey;
      const typeSelect = editor.querySelector("#setDefaultRequirementType");
      SETTINGS.defaultRequirementType = typeSelect && typeSelect.value === "item" ? "item" : "money";
      SETTINGS.defaultMoneyTax = parseInt(editor.querySelector("#setDefaultMoney").value, 10) || DEFAULT_SETTINGS.defaultMoneyTax;
      SETTINGS.taxItemName = (editor.querySelector("#setItemName").value || DEFAULT_SETTINGS.taxItemName).trim();
      SETTINGS.defaultItemTax = parseInt(editor.querySelector("#setDefaultItem").value, 10) || DEFAULT_SETTINGS.defaultItemTax;
      SETTINGS.reminderMessage = editor.querySelector("#setReminder").value.trim() || DEFAULT_SETTINGS.reminderMessage;
      SETTINGS.requiredTax = SETTINGS.defaultMoneyTax;
      const defaults = getDefaultRequirement();
      if (previousDefaults.type !== defaults.type || previousDefaults.amount !== defaults.amount) {
        SETTINGS.defaultRequirementReset = getCurrentWeekKey();
      }
      Object.keys(SETTINGS.memberRequirements).forEach(id => {
        const req = SETTINGS.memberRequirements[id];
        if (req && req.useDefault) {
          req.type = defaults.type;
          req.amount = defaults.amount;
        }
      });
      saveSettings(SETTINGS);
      editor.remove();
      panel.querySelector("#editEmployees").style.display = SETTINGS.manualMode ? "inline-block" : "none";
      if (employeeButton) {
        employeeButton.style.display = SETTINGS.enableEmployeeMenu ? "inline-block" : "none";
      }
      if (!SETTINGS.enableEmployeeMenu && currentView === "employees") {
        switchView("overview");
      }
      fetchData();
    });
  }

  function showEmployeeEditor() {
    const editor = document.createElement("div");
    Object.assign(editor.style, {
      position: "fixed", top: "20%", left: "30%", width: "40%",
      background: "#222", color: "#fff", padding: "15px", zIndex: "11000",
      borderRadius: "8px", boxShadow: "0px 0px 10px rgba(0,0,0,0.7)"
    });

    let text = "";
    Object.keys(SETTINGS.manualMembers).forEach(id => {
      const req = getMemberRequirement(id);
      const name = getEmployeeName(SETTINGS.manualMembers[id]);
      text += `${id}:${name}:${req.type}:${req.amount}\n`;
    });

    editor.innerHTML = `
      <h3 style="margin:0 0 10px 0;">Manual Employees (id:name:type:amount)</h3>
      <textarea id="empInput" style="width:100%;height:220px;background:#111;color:#0f0;border:1px solid #555;">${text.trim()}</textarea>
      <small style="display:block;margin-top:6px;color:#ccc;">Type may be "money" or "item". Amount should match the requirement.</small>
      <div style="text-align:right;margin-top:10px;">
        <button id="saveEmp" style="background:#2e8b57;color:white;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;">Save</button>
        <button id="cancelEmp" style="background:#555;color:white;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;">Cancel</button>
      </div>
    `;
    document.body.appendChild(editor);

    editor.querySelector("#cancelEmp").addEventListener("click", () => editor.remove());
    editor.querySelector("#saveEmp").addEventListener("click", () => {
      const lines = editor.querySelector("#empInput").value.split("\n");
      const newList = {};
      const newReqs = {};
      const previousRequirements = {};
      Object.keys(SETTINGS.manualMembers || {}).forEach(id => {
        previousRequirements[id] = getMemberRequirement(id);
      });
      lines.forEach(line => {
        if (!line.trim()) return;
        const parts = line.split(":").map(x => x.trim());
        const [id, name, type, amount] = parts;
        if (id && name) {
          const existing = normalizeEmployeeRecord(SETTINGS.manualMembers[id]);
          newList[id] = normalizeEmployeeRecord({
            name,
            joinDays: existing.joinDays,
            joinDate: existing.joinDate
          });
          const normalizedType = (type === "item" ? "item" : "money");
          const parsedAmount = parseInt(amount || (normalizedType === "money" ? SETTINGS.defaultMoneyTax : SETTINGS.defaultItemTax), 10);
          newReqs[id] = { type: normalizedType, amount: isNaN(parsedAmount) ? (normalizedType === "money" ? SETTINGS.defaultMoneyTax : SETTINGS.defaultItemTax) : parsedAmount, useDefault: false };
        }
      });
      SETTINGS.manualMembers = newList;
      // Remove requirements for employees no longer present
      Object.keys(SETTINGS.memberRequirements).forEach(id => {
        if (!newList[id]) {
          delete SETTINGS.memberRequirements[id];
        }
      });
      if (SETTINGS.memberRequirementResets) {
        Object.keys(SETTINGS.memberRequirementResets).forEach(id => {
          if (!newList[id]) {
            delete SETTINGS.memberRequirementResets[id];
          }
        });
      }
      if (SETTINGS.memberWeekExclusions) {
        Object.keys(SETTINGS.memberWeekExclusions).forEach(id => {
          if (!newList[id]) {
            delete SETTINGS.memberWeekExclusions[id];
          }
        });
      }
      if (SETTINGS.memberWeekCarrybacks) {
        Object.keys(SETTINGS.memberWeekCarrybacks).forEach(id => {
          if (!newList[id]) {
            delete SETTINGS.memberWeekCarrybacks[id];
          }
        });
      }
      SETTINGS.memberRequirements = Object.assign({}, SETTINGS.memberRequirements, newReqs);
      Object.keys(newList).forEach(id => {
        const prev = previousRequirements[id];
        const current = getMemberRequirement(id);
        if (!prev || prev.type !== current.type || prev.amount !== current.amount || (!!prev.isDefault) !== (!!current.isDefault)) {
          SETTINGS.memberRequirementResets[id] = getCurrentWeekKey();
        }
      });
      saveSettings(SETTINGS);
      editor.remove();
      fetchData();
    });
  }

  async function fetchData() {
    let employees = {};
    let weeklyData = {};
    let paymentHistory = {};

    if (SETTINGS.testMode) {
      const fake = makeFakeData();
      employees = fake.employees;
      weeklyData = fake.weeklyData;
      paymentHistory = fake.paymentHistory || buildPaymentHistoryFromAggregates(fake.weeklyData);
    } else {
      if (SETTINGS.manualMode) {
        employees = normalizeEmployeeMap(SETTINGS.manualMembers);
        SETTINGS.manualMembers = employees;
      } else {
        const res = await fetch(`https://api.torn.com/company/?selections=employees&key=${encodeURIComponent(SETTINGS.apiKey)}`);
        const data = await res.json();
        employees = {};
        Object.keys(data.company_employees || {}).forEach(id => {
          const info = data.company_employees[id];
          if (!info) {
            return;
          }
          const joinDaysValue = Number(info.days_in_company);
          const joinDateValue = Number(info.join_date);
          employees[id] = {
            name: typeof info.name === "string" ? info.name : "",
            joinDays: Number.isFinite(joinDaysValue) ? joinDaysValue : null,
            joinDate: Number.isFinite(joinDateValue) && joinDateValue > 0 ? joinDateValue : null
          };
        });
      }

      Object.keys(SETTINGS.memberRequirements).forEach(id => {
        if (!employees[id]) {
          delete SETTINGS.memberRequirements[id];
        }
      });
      if (SETTINGS.memberRequirementResets) {
        Object.keys(SETTINGS.memberRequirementResets).forEach(id => {
          if (!employees[id]) {
            delete SETTINGS.memberRequirementResets[id];
          }
        });
      }
      if (SETTINGS.memberWeekExclusions) {
        Object.keys(SETTINGS.memberWeekExclusions).forEach(id => {
          if (!employees[id]) {
            delete SETTINGS.memberWeekExclusions[id];
          }
        });
      }
      if (SETTINGS.memberWeekCarrybacks) {
        Object.keys(SETTINGS.memberWeekCarrybacks).forEach(id => {
          if (!employees[id]) {
            delete SETTINGS.memberWeekCarrybacks[id];
          }
        });
      }
      if (SETTINGS.excludedPayments) {
        Object.keys(SETTINGS.excludedPayments).forEach(id => {
          if (!employees[id]) {
            delete SETTINGS.excludedPayments[id];
          }
        });
      }

      const defaults = getDefaultRequirement();
      Object.keys(employees).forEach(id => {
        if (!SETTINGS.memberRequirements[id]) {
          SETTINGS.memberRequirements[id] = { type: defaults.type, amount: defaults.amount, useDefault: true };
          return;
        }
        if (SETTINGS.memberRequirements[id].useDefault) {
          SETTINGS.memberRequirements[id].type = defaults.type;
          SETTINGS.memberRequirements[id].amount = defaults.amount;
        }
      });

      const usesItemTracking = SETTINGS.defaultRequirementType === 'item' || Object.values(SETTINGS.memberRequirements).some(req => req && req.type === 'item');

      const moneyRes = await fetch(`https://api.torn.com/user/?selections=log&log=4800,4810&key=${encodeURIComponent(SETTINGS.apiKey)}`);
      const moneyData = await moneyRes.json();

      const itemRes = await fetch(`https://api.torn.com/user/?selections=log&log=85,4102,4103&key=${encodeURIComponent(SETTINGS.apiKey)}`);
      const itemData = await itemRes.json();

      const logs = { ...(moneyData && moneyData.log ? moneyData.log : {}), ...(itemData && itemData.log ? itemData.log : {}) };
      const employeeNameIndex = buildEmployeeNameIndex(employees);

      const weekMap = generateWeekMapFrom(SETTINGS.startYear, SETTINGS.startWeek);
      Object.keys(weekMap).forEach(key => {
        weeklyData[key] = {};
      });

      for (const id in logs) {
        const log = logs[id];
        const ts = new Date(log.timestamp * 1000);
        const [year, week] = getWeekNumber(ts);
        if (year < SETTINGS.startYear || (year === SETTINGS.startYear && week < SETTINGS.startWeek)) continue;
        const weekKey = `${year}-W${week}`;

        const logType = Number(log.log);
        const logCategory = Number(log.category);

        const logId = String(id);

        let senderId = findEmployeeIdFromLog(log, employees, employeeNameIndex);
        if (!senderId && usesItemTracking && (logType === 4102 || logType === 4103)) {
          const directId = String(log?.data?.sender || log?.data?.receiver || "");
          if (directId && employees[directId]) {
            senderId = directId;
          }
        }
        if (!senderId) continue;

        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {};
        }
        if (!weeklyData[weekKey][senderId]) {
          weeklyData[weekKey][senderId] = { money: 0, items: 0 };
        }
        if (!paymentHistory[senderId]) {
          paymentHistory[senderId] = [];
        }

        if (logType === 4800 || logType === 4810) {
          const amount = Number(log?.data?.money ?? log?.data?.amount ?? 0);
          if (Number.isFinite(amount)) {
            const excluded = isPaymentExcluded(senderId, logId);
            if (!excluded && amount > 0) {
              weeklyData[weekKey][senderId].money += amount;
            }
            if (amount > 0) {
              paymentHistory[senderId].push({
                id: logId,
                timestamp: Number(log.timestamp) * 1000,
                weekKey,
                type: 'money',
                amount,
                medium: describeLogMedium(log),
                excluded
              });
            }
          }
        } else if (usesItemTracking && logCategory === 85) {
          const targetId = 206; // Xanax
          const targetName = SETTINGS.taxItemName || "Xanax";
          const qty = getItemQuantityFromLog(log, targetName, targetId);
          if (qty > 0) {
            const excluded = isPaymentExcluded(senderId, logId);
            if (!excluded) {
              weeklyData[weekKey][senderId].items += qty;
            }
            paymentHistory[senderId].push({
              id: logId,
              timestamp: Number(log.timestamp) * 1000,
              weekKey,
              type: 'item',
              amount: qty,
              medium: describeLogMedium(log),
              excluded
            });
          }
        } else if (usesItemTracking && (logType === 4102 || logType === 4103)) {
          const directId = String(log?.data?.sender || log?.data?.receiver || "");
          if (directId && directId === senderId) {
            const items = Array.isArray(log?.data?.items) ? log.data.items : [];
            let totalAdded = 0;
            items.forEach(it => {
              if (it && Number(it.id) === 206 && Number.isFinite(Number(it.qty))) {
                const qty = Number(it.qty);
                const excluded = isPaymentExcluded(senderId, logId);
                if (!excluded) {
                  weeklyData[weekKey][senderId].items += qty;
                }
                totalAdded += qty;
              }
            });
            if (totalAdded > 0) {
              const excluded = isPaymentExcluded(senderId, logId);
              paymentHistory[senderId].push({
                id: logId,
                timestamp: Number(log.timestamp) * 1000,
                weekKey,
                type: 'item',
                amount: totalAdded,
                medium: describeLogMedium(log),
                excluded
              });
            }
          }
        }
      }
    }

    syncExcludedPaymentsWithWeeklyData(paymentHistory, weeklyData);

    lastEmployeesCache = employees;
    lastWeeklyDataCache = weeklyData;
    Object.keys(employees).forEach(id => {
      if (!paymentHistory[id]) {
        paymentHistory[id] = [];
      }
    });
    Object.keys(paymentHistory).forEach(id => {
      paymentHistory[id].sort((a, b) => {
        const timeA = Number(a && a.timestamp);
        const timeB = Number(b && b.timestamp);
        return timeA - timeB;
      });
    });
    lastPaymentHistoryCache = paymentHistory;
    saveSettings(SETTINGS);

    renderOverview(weeklyData, employees);
    if (SETTINGS.enableEmployeeMenu) {
      renderEmployeeMenu(employees);
    }
    renderPaymentHistory(paymentHistory, employees);
    if (!SETTINGS.enableEmployeeMenu && currentView === "employees") {
      switchView("overview");
    }
    if (currentView === "payments") {
      renderPaymentHistory(paymentHistory, employees);
    }
  }

  

  function getWeekNumber(d) {
    const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const dayNumber = target.getUTCDay() || 7; // ISO week starts on Monday (1) and ends on Sunday (7)
    target.setUTCDate(target.getUTCDate() + 4 - dayNumber); // Shift to Thursday of this week to determine ISO year
    const isoYear = target.getUTCFullYear();
    const yearStart = new Date(Date.UTC(isoYear, 0, 1));
    const weekNo = Math.ceil((((target - yearStart) / 86400000) + 1) / 7);
    return [isoYear, weekNo];
  }

  function getRelativeWeekFromCurrent(offsetWeeks) {
    const normalizedOffset = Number.isFinite(offsetWeeks) ? offsetWeeks : 0;
    const reference = new Date();
    reference.setUTCDate(reference.getUTCDate() + (normalizedOffset * 7));
    const [year, week] = getWeekNumber(reference);
    return { year, week };
  }

  function formatTimestamp(ms) {
    const numeric = Number(ms);
    if (!Number.isFinite(numeric)) {
      return '';
    }
    const date = new Date(numeric);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  function getDateFromWeekKey(weekKey) {
    const parsed = parseWeekKey(weekKey);
    if (!parsed) {
      return null;
    }
    const [year, week] = parsed;
    const simple = new Date(Date.UTC(year, 0, 4));
    const dayOfWeek = simple.getUTCDay() || 7;
    simple.setUTCDate(simple.getUTCDate() - dayOfWeek + 1);
    simple.setUTCDate(simple.getUTCDate() + (week - 1) * 7);
    return simple;
  }

  function getEmployeeJoinWeek(record) {
    const ts = getEmployeeJoinTimestamp(record);
    if (!ts) {
      return null;
    }
    const joinDate = new Date(ts * 1000);
    if (Number.isNaN(joinDate.getTime())) {
      return null;
    }
    return getWeekNumber(joinDate);
  }

  function getEmployeeJoinWeekFromDays(record) {
    if (!record || record.joinDays == null) return null;
    const hireDate = new Date();
    hireDate.setUTCDate(hireDate.getUTCDate() - record.joinDays);
    return getWeekNumber(hireDate); // returns [year, week]
  }

  function makeDraggable(el, handle) {
    let offsetX = 0, offsetY = 0, isDown = false;
    handle.addEventListener('mousedown', e => { isDown = true; offsetX = el.offsetLeft - e.clientX; offsetY = el.offsetTop - e.clientY; document.body.style.userSelect = "none"; });
    document.addEventListener('mouseup', () => { isDown = false; document.body.style.userSelect = ""; });
    document.addEventListener('mousemove', e => { if (isDown) { el.style.left = (e.clientX + offsetX) + 'px'; el.style.top = (e.clientY + offsetY) + 'px'; } });
  }

  function makeResizable(el) {
    const resizeHandle = document.createElement("div");
    Object.assign(resizeHandle.style, { width: "15px", height: "15px", background: "#444",
      position: "absolute", right: "0", bottom: "0", cursor: "se-resize", borderTopLeftRadius: "4px" });
    el.appendChild(resizeHandle);
    resizeHandle.addEventListener("mousedown", e => { e.preventDefault(); document.addEventListener("mousemove", resizePanel); document.addEventListener("mouseup", stopResize); });
    function resizePanel(e) { el.style.width = (e.clientX - el.offsetLeft) + "px"; el.style.height = (e.clientY - el.offsetTop) + "px"; }
    function stopResize() { document.removeEventListener("mousemove", resizePanel); document.removeEventListener("mouseup", stopResize); }
  }

  function makeFakeData() {
    const now = Math.floor(Date.now() / 1000);
    const employees = normalizeEmployeeMap({
      101: { name: 'Alice', joinDays: 140, joinDate: now - (140 * 86400) },
      102: { name: 'Bob', joinDays: 90, joinDate: now - (90 * 86400) },
      103: { name: 'Charlie', joinDays: 30, joinDate: now - (30 * 86400) },
      104: { name: 'Diana', joinDays: 10, joinDate: now - (10 * 86400) }
    });
    const weeklyData = {};
    const weekKeys = generateWeekKeys(SETTINGS.startYear, SETTINGS.startWeek);
    weekKeys.forEach(weekKey => {
      weeklyData[weekKey] = {};
      Object.keys(employees).forEach(id => {
        if (!SETTINGS.memberRequirements[id]) {
          const type = Math.random() < 0.5 ? 'money' : 'item';
          SETTINGS.memberRequirements[id] = {
            type,
            amount: type === 'money' ? SETTINGS.defaultMoneyTax : SETTINGS.defaultItemTax,
            useDefault: false
          };
        }
        const req = getMemberRequirement(id);
        const miss = Math.random() < 0.25;
        const over = Math.random() > 0.85;
        const paidAmount = miss ? 0 : over ? req.amount * 2 : req.amount;
        weeklyData[weekKey][id] = { money: 0, items: 0 };
        if (req.type === 'item') {
          weeklyData[weekKey][id].items = paidAmount;
        } else {
          weeklyData[weekKey][id].money = paidAmount;
        }
      });
    });
    saveSettings(SETTINGS);
    return { employees, weeklyData };
  }
  function renderOverview(weeklyData, COMPANY_MEMBERS) {
    if (!overviewView) return;
    const weekKeys = generateWeekKeys(SETTINGS.startYear, SETTINGS.startWeek);
    const displayWeeks = weekKeys.slice(-SETTINGS.maxWeeks);
    const allWeeks = weekKeys;

    if (displayWeeks.length === 0) {
      overviewView.innerHTML = '<p style="color:#ccc;">No weeks available for the selected start week.</p>';
      return;
    }

    const employeeIds = Object.keys(COMPANY_MEMBERS);
    if (employeeIds.length === 0) {
      overviewView.innerHTML = '<p style="color:#ccc;">No employees loaded yet. Fetch data to view tax progress.</p>';
      return;
    }

    let grandMoneyPaid = 0;
    let grandMoneyExpected = 0;
    let grandMoneyBalance = 0;
    let grandItemPaid = 0;
    let grandItemExpected = 0;
    let grandItemBalance = 0;
    const owingList = [];

    let html = '<div style="overflow:auto;"><table style="width:100%; border-collapse: collapse; text-align:center; font-size:12px; background:#1b1b1b; color:#ccc;">';
    html += '<thead><tr style="background:#2a2a2a; color:#fff; font-weight:bold;">';
    html += '<th style="padding:8px;border:1px solid #444;text-align:left;position:sticky;left:0;background:#2a2a2a;z-index:2;">Employee</th>';
    displayWeeks.forEach(week => {
      html += `<th style="padding:8px;border:1px solid #444;">${week}</th>`;
    });
    html += '<th style="padding:8px;border:1px solid #444;position:sticky;right:140px;background:#2a2a2a;z-index:2;">Total Paid</th>';
    html += '<th style="padding:8px;border:1px solid #444;position:sticky;right:0;background:#2a2a2a;z-index:2;">Balance</th></tr></thead><tbody>';

    employeeIds.forEach((id, idx) => {
      const req = getMemberRequirement(id);
      const type = req.type === 'item' ? 'item' : 'money';
      const employeeRecord = COMPANY_MEMBERS[id];
      const employeeName = getEmployeeName(employeeRecord) || 'Unknown';
      const rowBg = (idx % 2 === 0) ? '#202020' : '#262626';
      const joinWeek = getEmployeeJoinWeekFromDays(employeeRecord) || getEmployeeJoinWeek(employeeRecord);
      const joinWeekKey = joinWeek ? formatWeekKey(joinWeek[0], joinWeek[1]) : null;
      const requirementStart = getRequirementStartWeek(id, req);
      const startKey = `${SETTINGS.startYear}-W${SETTINGS.startWeek}`;
      const weekRequirementReasons = {};
      const effectiveWeeks = [];

      allWeeks.forEach(weekKey => {
        const reasons = [];
        if (joinWeekKey && compareWeekKeys(weekKey, joinWeekKey) < 0) {
          reasons.push(`Employee joined ${joinWeekKey}`);
        }
        if (!isWeekOnOrAfter(weekKey, startKey)) {
          reasons.push(`Before start week ${startKey}`);
        }
        if (requirementStart && !isWeekOnOrAfter(weekKey, requirementStart)) {
          reasons.push(`Requirement begins ${requirementStart}`);
        }
        weekRequirementReasons[weekKey] = reasons;
        if (reasons.length === 0) {
          effectiveWeeks.push(weekKey);
        }
      });

      const effectiveWeekSet = new Set(effectiveWeeks);
      const exclusions = new Set(
        getExcludedWeeksForMember(id).filter(weekKey => effectiveWeekSet.has(weekKey))
      );

      const countedWeeks = effectiveWeeks.filter(weekKey => !exclusions.has(weekKey));
      const countedWeeksSet = new Set(countedWeeks);
      const countedWeeksSorted = countedWeeks.slice().sort(compareWeekKeys);
      const previousCountedWeek = {};
      countedWeeksSorted.forEach((weekKey, index) => {
        previousCountedWeek[weekKey] = index > 0 ? countedWeeksSorted[index - 1] : null;
      });

      const rawPaidByWeek = {};
      countedWeeksSorted.forEach(weekKey => {
        const data = (weeklyData[weekKey] && weeklyData[weekKey][id]) || { money: 0, items: 0 };
        rawPaidByWeek[weekKey] = type === 'money' ? data.money : data.items;
      });

      const carrybacksRaw = getWeekCarrybacksForMember(id);
      const validCarrybacks = {};
      let carrybacksChanged = false;
      Object.keys(carrybacksRaw).forEach(weekKey => {
        const targetWeek = carrybacksRaw[weekKey];
        if (countedWeeksSet.has(weekKey) && countedWeeksSet.has(targetWeek) && compareWeekKeys(targetWeek, weekKey) < 0) {
          validCarrybacks[weekKey] = targetWeek;
        } else {
          carrybacksChanged = true;
        }
      });
      if (carrybacksChanged) {
        setWeekCarrybacksForMember(id, validCarrybacks);
        saveSettings(SETTINGS);
      }

      const paidByWeek = Object.assign({}, rawPaidByWeek);
      const carrybackSources = {};
      Object.keys(validCarrybacks).forEach(sourceWeek => {
        const targetWeek = validCarrybacks[sourceWeek];
        if (!targetWeek) {
          return;
        }
        const amount = paidByWeek[sourceWeek] || 0;
        if (amount > 0) {
          if (!carrybackSources[targetWeek]) {
            carrybackSources[targetWeek] = [];
          }
          carrybackSources[targetWeek].push({ source: sourceWeek, amount });
        }
        paidByWeek[targetWeek] = (paidByWeek[targetWeek] || 0) + (paidByWeek[sourceWeek] || 0);
        paidByWeek[sourceWeek] = 0;
      });

      const countedWeekEntries = countedWeeksSorted.map(weekKey => ({
        weekKey,
        paid: paidByWeek[weekKey] || 0
      }));

      const allowRollover = SETTINGS.allowPrepaymentRollover !== false;
      const totalPaid = countedWeekEntries.reduce((sum, entry) => sum + entry.paid, 0);
      const shortfallTotal = allowRollover ? 0 : countedWeekEntries.reduce((sum, entry) => {
        return sum + Math.max(req.amount - entry.paid, 0);
      }, 0);
      const weekCoverageStatus = {};
      if (req.amount <= 0) {
        countedWeekEntries.forEach(entry => {
          weekCoverageStatus[entry.weekKey] = true;
        });
      } else if (countedWeekEntries.length > 0) {
        if (allowRollover) {
          const prefixTotals = [];
          let runningTotal = 0;
          countedWeekEntries.forEach((entry, index) => {
            runningTotal += entry.paid;
            prefixTotals[index] = runningTotal;
          });
          const coverageCounts = prefixTotals.map(total => Math.floor(total / req.amount));
          const maxCoverageFromIndex = new Array(coverageCounts.length);
          let runningMax = 0;
          for (let i = coverageCounts.length - 1; i >= 0; i--) {
            runningMax = Math.max(runningMax, coverageCounts[i]);
            maxCoverageFromIndex[i] = runningMax;
          }
          countedWeekEntries.forEach((entry, index) => {
            weekCoverageStatus[entry.weekKey] = maxCoverageFromIndex[index] >= (index + 1);
          });
        } else {
          countedWeekEntries.forEach(entry => {
            weekCoverageStatus[entry.weekKey] = entry.paid >= req.amount;
          });
        }
      }

      html += `<tr style="background:${rowBg};">`;
      html += `<td style="padding:6px;border:1px solid #444;text-align:left;color:#fff;position:sticky;left:0;background:${rowBg};">${employeeName} [${id}]</td>`;

      displayWeeks.forEach(week => {
        const data = (weeklyData[week] && weeklyData[week][id]) || { money: 0, items: 0 };
        const rawPaid = type === 'money' ? data.money : data.items;
        const countedPaid = paidByWeek[week] || 0;
        const carrybackTarget = validCarrybacks[week] || null;
        const carrybackSourcesHere = carrybackSources[week] || [];
        const isEffective = effectiveWeekSet.has(week);
        const isExcluded = exclusions.has(week);
        const isCounted = countedWeeksSet.has(week);
        let cellColor = '#222222';
        let cellText = '#888888';
        let symbol = '—';
        const paidLabel = type === 'money' ? `$${countedPaid.toLocaleString()}` : `${countedPaid} ${SETTINGS.taxItemName}`;
        const rawPaidLabel = type === 'money' ? `$${rawPaid.toLocaleString()}` : `${rawPaid} ${SETTINGS.taxItemName}`;
        const reqLabel = type === 'money' ? `$${req.amount.toLocaleString()}` : `${req.amount} ${SETTINGS.taxItemName}`;
        const rawMoney = Number(data.money) || 0;
        const rawItems = Number(data.items) || 0;
        const paymentMode = rawMoney > 0 && rawItems > 0 ? 'mixed' : rawMoney > 0 ? 'money' : rawItems > 0 ? 'item' : 'none';
        const mediumParts = [];
        if (rawMoney > 0) {
          mediumParts.push(`Money: $${rawMoney.toLocaleString()}`);
        }
        if (rawItems > 0) {
          mediumParts.push(`${SETTINGS.taxItemName}: ${rawItems}`);
        }
        const mediumSuffix = mediumParts.length ? ` Received this week — ${mediumParts.join('; ')}.` : '';
        let mediumDetailsAdded = false;
        let title = `Paid ${paidLabel} / Required ${reqLabel}`;
        if (!isEffective) {
          if (mediumParts.length > 0) {
            cellColor = '#113311';
            cellText = '#66ff66';
            symbol = '✅';
            const reasons = weekRequirementReasons[week] || [];
            const reasonText = reasons.length ? ` (${reasons.join('; ')})` : '';
            const paymentSummary = mediumParts.join('; ');
            title = `No requirement for this week${reasonText}. Received ${paymentSummary}.`;
            mediumDetailsAdded = true;
          } else {
            const reasons = weekRequirementReasons[week] || [];
            const reasonText = reasons.length ? ` (${reasons.join('; ')})` : '';
            title = `No requirement for this week${reasonText}.`;
          }
        } else if (isExcluded) {
          cellColor = '#333333';
          cellText = '#cccccc';
          symbol = '⏸';
          title = `Week excluded from requirement. Paid ${rawPaidLabel}. Click to include.`;
        } else {
          let met;
          if (req.amount <= 0) {
            met = true;
          } else if (isCounted && Object.prototype.hasOwnProperty.call(weekCoverageStatus, week)) {
            met = weekCoverageStatus[week];
          } else {
            met = countedPaid >= req.amount;
          }
          if (met) {
            symbol = '✅';
            if (paymentMode === 'item') {
              cellColor = '#002244';
              cellText = '#66ccff';
            } else if (paymentMode === 'mixed') {
              cellColor = '#2b1f44';
              cellText = '#d1b3ff';
            } else if (paymentMode === 'money') {
              cellColor = '#003300';
              cellText = '#66ff66';
            } else {
              cellColor = '#2f2f00';
              cellText = '#ffef66';
            }
            if (allowRollover && countedPaid < req.amount) {
              title = `Paid ${paidLabel} / Required ${reqLabel}. Requirement covered by cumulative payments. Click to exclude.`;
            } else if (!allowRollover && countedPaid > req.amount) {
              title = `Paid ${paidLabel} / Required ${reqLabel}. Extra paid will not auto-cover future weeks. Click to exclude.`;
            } else {
              title = `Paid ${paidLabel} / Required ${reqLabel}. Click to exclude.`;
            }
          } else {
            symbol = '❌';
            if (paymentMode === 'item' && type === 'money') {
              cellColor = '#331133';
              cellText = '#ff99ff';
              title = `Paid ${paidLabel} / Required ${reqLabel}. Money is required for this week. Click to exclude.`;
            } else if (paymentMode === 'money' && type === 'item') {
              cellColor = '#003344';
              cellText = '#66ccff';
              title = `Paid ${paidLabel} / Required ${reqLabel}. ${SETTINGS.taxItemName} is required for this week. Click to exclude.`;
            } else if (paymentMode === 'mixed') {
              cellColor = '#33220d';
              cellText = '#ffcc88';
              title = `Paid ${paidLabel} / Required ${reqLabel}. Partial payment received. Click to exclude.`;
            } else {
              cellColor = '#3a0000';
              cellText = '#ff6666';
              title = `Paid ${paidLabel} / Required ${reqLabel}. Click to exclude.`;
            }
          }
        }
        if (!mediumDetailsAdded && mediumSuffix) {
          title += mediumSuffix;
          mediumDetailsAdded = true;
        }
        if (carrybackTarget) {
          symbol = '↩️';
          cellColor = '#2d1f00';
          cellText = '#ffcc66';
          const baseMessage = countedPaid > 0 ? `Counted ${paidLabel}` : 'No counted payment';
          title = `${baseMessage}. Carried ${rawPaidLabel} back to ${carrybackTarget}. Alt+click to restore this week.`;
          mediumDetailsAdded = false;
        } else if (carrybackSourcesHere.length > 0) {
          const parts = carrybackSourcesHere
            .sort((a, b) => compareWeekKeys(a.source, b.source))
            .map(entry => `${entry.source} (${type === 'money' ? `$${entry.amount.toLocaleString()}` : `${entry.amount} ${SETTINGS.taxItemName}`})`);
          title += `. Includes carryback from ${parts.join(', ')}.`;
        }
        if (!mediumDetailsAdded && mediumSuffix) {
          title += mediumSuffix;
          mediumDetailsAdded = true;
        }
        const cursor = isEffective ? 'pointer' : 'default';
        const carryTargetAttr = carrybackTarget || (isCounted ? (previousCountedWeek[week] || '') : '');
        const carryActiveAttr = carrybackTarget ? 'true' : 'false';
        html += `<td class="tax-week-cell" data-employee="${id}" data-week="${week}" data-effective="${isEffective}" data-counted="${isCounted}" data-carry-target="${carryTargetAttr || ''}" data-carry-active="${carryActiveAttr}" style="background:${cellColor};color:${cellText};border:1px solid #444;cursor:${cursor};" title="${title}">${symbol}</td>`;
      });

      const expected = countedWeeks.length * req.amount;
      const baseBalance = totalPaid - expected;
      const balance = allowRollover ? baseBalance : (shortfallTotal > 0 ? -shortfallTotal : baseBalance);
      const totalLabel = type === 'money' ? `$${totalPaid.toLocaleString()}` : `${totalPaid} ${SETTINGS.taxItemName}`;
      html += `<td style="color:#66ff66;padding:6px;border:1px solid #444;position:sticky;right:140px;background:${rowBg};">${totalLabel}</td>`;

      if (type === 'money') {
        grandMoneyPaid += totalPaid;
        grandMoneyExpected += expected;
        grandMoneyBalance += balance;
      } else {
        grandItemPaid += totalPaid;
        grandItemExpected += expected;
        grandItemBalance += balance;
      }

      if (balance < 0) {
        const owe = type === 'money' ? `$${Math.abs(balance).toLocaleString()}` : `${Math.abs(balance)} ${SETTINGS.taxItemName}`;
        html += `<td style="color:#ff6666;padding:6px;border:1px solid #444;position:sticky;right:0;background:${rowBg};">Owes ${owe}</td>`;
        owingList.push({ id, name: employeeName, amount: owe });
      } else if (balance > 0) {
        const over = type === 'money' ? `$${balance.toLocaleString()}` : `${balance} ${SETTINGS.taxItemName}`;
        html += `<td style="color:#66ccff;padding:6px;border:1px solid #444;position:sticky;right:0;background:${rowBg};">Overpaid ${over}</td>`;
      } else {
        html += `<td style="color:#66ff66;padding:6px;border:1px solid #444;position:sticky;right:0;background:${rowBg};">On Track</td>`;
      }

      html += '</tr>';
    });

    html += '</tbody></table></div>';

    const tipHtml = '<div style="margin-top:8px;color:#ccc;font-size:11px;">Click a week cell to exclude/include it for that employee. Alt+click to carry a payment back to the previous counted week. Excluded weeks show the ⏸ icon.<br>Money ticks stay green, item ticks use blue, mixed weeks use purple, and rollover coverage without a direct payment is gold. Wrong-medium payments highlight in teal or pink so you can spot them quickly.</div>';

    let summaryHtml = '<div style="margin-top:12px;padding:10px;background:#222;border:1px solid #444;border-radius:6px;">';
    summaryHtml += '<strong style="color:#fff;">Summary</strong><br>';
    if (grandMoneyExpected > 0) {
      const balance = grandMoneyBalance;
      const balanceLabel = balance > 0 ? `Overpaid $${balance.toLocaleString()}` : balance < 0 ? `Owes $${Math.abs(balance).toLocaleString()}` : 'On Track';
      summaryHtml += `<span style="color:#ccc;">Money: Paid $${grandMoneyPaid.toLocaleString()} / Expected $${grandMoneyExpected.toLocaleString()} (${balanceLabel})</span><br>`;
    }
    if (grandItemExpected > 0) {
      const balance = grandItemBalance;
      const balanceLabel = balance > 0 ? `Overpaid ${balance} ${SETTINGS.taxItemName}` : balance < 0 ? `Owes ${Math.abs(balance)} ${SETTINGS.taxItemName}` : 'On Track';
      summaryHtml += `<span style="color:#ccc;">Items: Paid ${grandItemPaid} ${SETTINGS.taxItemName} / Expected ${grandItemExpected} ${SETTINGS.taxItemName} (${balanceLabel})</span><br>`;
    }
    summaryHtml += '</div>';

    let reminderHtml = '<div style="margin-top:12px;padding:10px;background:#222;border:1px solid #444;border-radius:6px;">';
    reminderHtml += '<h4 style="color:#fff;margin:0 0 10px 0;">Employees Owing Tax</h4>';
    if (owingList.length === 0) {
      reminderHtml += '<p style="color:lightgreen;">All employees are fully paid up ✅</p>';
    } else {
      reminderHtml += '<ul style="list-style:none;padding:0;margin:0;">';
      owingList.forEach(emp => {
        const reminderText = SETTINGS.reminderMessage
          .replace(/\{name\}/g, emp.name)
          .replace(/\{id\}/g, emp.id)
          .replace(/\{amount\}/g, emp.amount);
        reminderHtml += `<li style="margin:6px 0;color:#ff6666;">${emp.name} [${emp.id}] owes ${emp.amount}
          <a href="#" data-id="${emp.id}" data-msg="${encodeURIComponent(reminderText)}" class="tax-reminder-link" style="color:#66ccff;margin-left:10px;">Copy Reminder</a></li>`;
      });
      reminderHtml += '</ul>';
    }
    reminderHtml += '</div>';

    overviewView.innerHTML = tipHtml + html + summaryHtml + reminderHtml;

    overviewView.querySelectorAll('.tax-week-cell').forEach(cell => {
      cell.addEventListener('click', event => {
        if (cell.getAttribute('data-effective') !== 'true') {
          return;
        }
        const week = cell.getAttribute('data-week');
        const empId = cell.getAttribute('data-employee');
        const isCounted = cell.getAttribute('data-counted') === 'true';
        if (event.altKey) {
          event.preventDefault();
          const isActive = cell.getAttribute('data-carry-active') === 'true';
          if (isActive) {
            updateWeekCarrybackForMember(empId, week, null);
          } else {
            if (!isCounted) {
              alert('Only counted weeks can carry payments back.');
              return;
            }
            const targetWeek = cell.getAttribute('data-carry-target');
            if (!targetWeek) {
              alert('No previous counted week is available for this employee.');
              return;
            }
            updateWeekCarrybackForMember(empId, week, targetWeek);
          }
        } else {
          toggleWeekExclusionForMember(empId, week);
        }
        renderOverview(lastWeeklyDataCache, lastEmployeesCache);
        if (SETTINGS.enableEmployeeMenu) {
          renderEmployeeMenu(lastEmployeesCache);
        }
      });
    });

    overviewView.querySelectorAll('.tax-reminder-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const msg = decodeURIComponent(link.getAttribute('data-msg'));
        const empId = link.getAttribute('data-id');
        navigator.clipboard.writeText(msg).then(() => {
          alert('Reminder message copied to clipboard! Paste it in the compose box (Ctrl+V).');
          window.open(`https://www.torn.com/messages.php#/p=compose&XID=${empId}`, '_blank');
        });
      });
    });
  }

  function renderPaymentHistory(paymentHistory, COMPANY_MEMBERS) {
    if (!paymentsView) {
      return;
    }

    const employeeIds = Object.keys(COMPANY_MEMBERS || {});
    if (employeeIds.length === 0) {
      paymentsView.innerHTML = '<p style="color:#ccc;">No employees loaded yet. Fetch data to view payment history.</p>';
      return;
    }

    const sortedIds = employeeIds.sort((a, b) => {
      const nameA = getEmployeeName(COMPANY_MEMBERS[a] || {}).toLowerCase();
      const nameB = getEmployeeName(COMPANY_MEMBERS[b] || {}).toLowerCase();
      if (nameA === nameB) {
        return a.localeCompare(b);
      }
      return nameA.localeCompare(nameB);
    });

    let html = '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:10px;">';
    html += '<div style="color:#ccc;font-size:11px;flex:1 1 260px;">Entries use your local timezone. Payments are shown from the configured start week or the employee\'s join week, whichever is later. Carryback adjustments may display earlier weeks.</div>';
    html += '<button id="refreshPayments" style="background:#2e8b57;color:white;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;">Refresh payments</button>';
    html += '</div>';
    html += '<div style="display:flex;flex-direction:column;gap:12px;">';

    sortedIds.forEach(id => {
      const employeeRecord = COMPANY_MEMBERS[id] || {};
      const employeeName = getEmployeeName(employeeRecord) || 'Unknown';
      const joinWeekFromDays = getEmployeeJoinWeekFromDays(employeeRecord);
      const joinWeek = joinWeekFromDays || getEmployeeJoinWeek(employeeRecord);
      const joinWeekKey = Array.isArray(joinWeek) ? formatWeekKey(joinWeek[0], joinWeek[1]) : null;
      const startKey = `${SETTINGS.startYear}-W${SETTINGS.startWeek}`;

      let baselineKey = startKey;
      if (typeof joinWeekKey === 'string' && parseWeekKey(joinWeekKey) && compareWeekKeys(joinWeekKey, baselineKey) > 0) {
        baselineKey = joinWeekKey;
      }

      const carrybacks = getWeekCarrybacksForMember(id);
      Object.values(carrybacks).forEach(targetWeek => {
        if (typeof targetWeek === 'string' && parseWeekKey(targetWeek) && compareWeekKeys(targetWeek, baselineKey) < 0) {
          baselineKey = targetWeek;
        }
      });

      const entries = (paymentHistory && paymentHistory[id] ? paymentHistory[id] : []).filter(entry => {
        if (!entry || typeof entry.weekKey !== 'string') {
          return false;
        }
        if (!baselineKey) {
          return true;
        }
        return compareWeekKeys(entry.weekKey, baselineKey) >= 0;
      });

      let moneyTotal = 0;
      let itemTotal = 0;
      entries.forEach(entry => {
        if (!entry) {
          return;
        }
        if (entry.type === 'money' && Number.isFinite(entry.amount)) {
          moneyTotal += entry.amount;
        } else if (entry.type === 'item' && Number.isFinite(entry.amount)) {
          itemTotal += entry.amount;
        }
      });

      html += '<div style="padding:12px;border:1px solid #333;border-radius:6px;background:#1f1f1f;">';
      html += `<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;">`;
      html += `<strong style="color:#fff;font-size:13px;">${escapeHtml(employeeName)} [${escapeHtml(id)}]</strong>`;
      html += `<span style="color:#888;font-size:11px;">Showing payments since ${escapeHtml(baselineKey)}</span>`;
      html += '</div>';

      if (entries.length === 0) {
        html += '<div style="color:#888;margin-top:8px;">No payments recorded during this period.</div>';
      } else {
        html += '<table style="width:100%;border-collapse:collapse;margin-top:8px;font-size:12px;">';
        html += '<thead><tr style="background:#2a2a2a;color:#fff;font-weight:bold;">';
        html += '<th style="padding:6px;border:1px solid #333;text-align:left;">Date</th>';
        html += '<th style="padding:6px;border:1px solid #333;text-align:left;">Week</th>';
        html += '<th style="padding:6px;border:1px solid #333;text-align:left;">Type</th>';
        html += '<th style="padding:6px;border:1px solid #333;text-align:left;">Amount</th>';
        html += '<th style="padding:6px;border:1px solid #333;text-align:left;">Details</th>';
        html += '<th style="padding:6px;border:1px solid #333;text-align:left;">Counted?</th>';
        html += '<th style="padding:6px;border:1px solid #333;text-align:left;">Action</th>';
        html += '</tr></thead><tbody>';

        entries.forEach((entry, index) => {
          const baseBg = index % 2 === 0 ? '#1b1b1b' : '#242424';
          const excluded = !!entry.excluded;
          const rowBg = excluded ? '#2a1919' : baseBg;
          const dateLabel = formatTimestamp(entry.timestamp) || 'Unknown';
          const weekLabel = entry.weekKey || '—';
          const typeLabel = entry.type === 'item' ? `${SETTINGS.taxItemName}` : 'Money';
          const amountLabel = entry.type === 'item'
            ? `${(Number.isFinite(entry.amount) ? entry.amount : 0).toLocaleString()} ${SETTINGS.taxItemName}`
            : `$${Number.isFinite(entry.amount) ? entry.amount.toLocaleString() : '0'}`;
          const detailsLabel = entry.medium ? escapeHtml(entry.medium) : '';
          const textColor = excluded ? '#ffaaaa' : '#ccc';
          const paymentId = entry && (entry.id || entry.logId)
            ? String(entry.id || entry.logId)
            : `${entry.weekKey || 'unknown'}-${entry.type || 'unknown'}-${entry.timestamp || index}`;
          if (entry && !entry.id) {
            entry.id = paymentId;
          }
          const countedLabel = excluded ? '<span style="color:#ff6666;">No</span>' : '<span style="color:#66ff66;">Yes</span>';
          const actionLabel = excluded ? 'Include' : 'Exclude';
          const actionBg = excluded ? '#2e8b57' : '#b34747';
          const actionTitle = excluded ? 'Include this payment in tax totals' : 'Exclude this payment from tax totals';
          const buttonStyle = `background:${actionBg};color:white;border:none;padding:4px 8px;border-radius:4px;cursor:${paymentId ? 'pointer' : 'not-allowed'};`;
          html += `<tr style="background:${rowBg};color:${textColor};">`;
          html += `<td style="padding:6px;border:1px solid #333;color:${textColor};">${escapeHtml(dateLabel)}</td>`;
          html += `<td style="padding:6px;border:1px solid #333;color:${textColor};">${escapeHtml(weekLabel)}</td>`;
          html += `<td style="padding:6px;border:1px solid #333;color:${textColor};">${escapeHtml(typeLabel)}</td>`;
          html += `<td style="padding:6px;border:1px solid #333;color:${textColor};">${escapeHtml(amountLabel)}</td>`;
          html += `<td style="padding:6px;border:1px solid #333;color:${textColor};">${detailsLabel || '<span style="color:#888;">&mdash;</span>'}</td>`;
          html += `<td style="padding:6px;border:1px solid #333;color:${textColor};">${countedLabel}</td>`;
          if (paymentId) {
            html += `<td style="padding:6px;border:1px solid #333;">
              <button class="toggle-payment-exclusion" data-employee="${escapeHtml(String(id))}" data-payment="${escapeHtml(paymentId)}" data-excluded="${excluded}" title="${escapeHtml(actionTitle)}" style="${buttonStyle}">${escapeHtml(actionLabel)}</button>
            </td>`;
          } else {
            html += '<td style="padding:6px;border:1px solid #333;color:#888;">Unavailable</td>';
          }
          html += '</tr>';
        });

        html += '</tbody></table>';
        if (moneyTotal > 0 || itemTotal > 0) {
          const totals = [];
          if (moneyTotal > 0) {
            totals.push(`Money: $${moneyTotal.toLocaleString()}`);
          }
          if (itemTotal > 0) {
            totals.push(`${SETTINGS.taxItemName}: ${itemTotal.toLocaleString()}`);
          }
          html += `<div style="margin-top:8px;color:#ccc;font-size:12px;">Totals since ${escapeHtml(baselineKey)} — ${escapeHtml(totals.join('; '))}</div>`;
        }
      }

      html += '</div>';
    });

    html += '</div>';
    paymentsView.innerHTML = html;

    paymentsView.querySelectorAll('.toggle-payment-exclusion').forEach(button => {
      button.addEventListener('click', () => {
        const employeeId = button.getAttribute('data-employee');
        const paymentId = button.getAttribute('data-payment');
        const currentlyExcluded = button.getAttribute('data-excluded') === 'true';
        const nextExcluded = !currentlyExcluded;
        setPaymentExcluded(employeeId, paymentId, nextExcluded);
        saveSettings(SETTINGS);
        applyPaymentExclusion(employeeId, paymentId, nextExcluded);
      });
    });
    const refreshButton = paymentsView.querySelector('#refreshPayments');
    if (refreshButton) {
      refreshButton.addEventListener('click', async () => {
        refreshButton.disabled = true;
        const originalText = refreshButton.textContent;
        refreshButton.textContent = 'Refreshing...';
        try {
          await fetchData();
        } finally {
          refreshButton.disabled = false;
          refreshButton.textContent = originalText;
        }
      });
    }
  }

  function renderEmployeeMenu(employees) {
    if (!employeeView) return;
    if (!SETTINGS.enableEmployeeMenu) {
      employeeView.innerHTML = '<p style="color:#ccc;">Enable the employees menu in Settings to manage individual tax.</p>';
      return;
    }

    const ids = Object.keys(employees);
    if (ids.length === 0) {
      employeeView.innerHTML = '<p style="color:#ccc;">No employees available. Load data first.</p>';
      return;
    }

    const rows = ids.sort((a, b) => getEmployeeName(employees[a]).localeCompare(getEmployeeName(employees[b]))).map(id => {
      const stored = SETTINGS.memberRequirements[id];
      const req = getMemberRequirement(id);
      const isCustom = stored ? !stored.useDefault : false;
      const selectedMoney = req.type === 'item' ? '' : 'selected';
      const selectedItem = req.type === 'item' ? 'selected' : '';
      const disabledAttr = isCustom ? '' : 'disabled';
      return `
        <tr>
          <td style="padding:6px;border:1px solid #444;text-align:left;color:#fff;">${getEmployeeName(employees[id])} [${id}]</td>
          <td style="padding:6px;border:1px solid #444;">
            <label style="display:flex;align-items:center;gap:6px;justify-content:center;color:#ccc;">
              <input type="checkbox" data-id="${id}" class="emp-use-custom" ${isCustom ? 'checked' : ''}>
              Custom requirement
            </label>
          </td>
          <td style="padding:6px;border:1px solid #444;">
            <select data-id="${id}" class="emp-req-type" style="width:120px;background:#111;color:#0f0;border:1px solid #555;border-radius:4px;padding:4px;" ${disabledAttr}>
              <option value="money" ${selectedMoney}>Money</option>
              <option value="item" ${selectedItem}>${SETTINGS.taxItemName}</option>
            </select>
          </td>
          <td style="padding:6px;border:1px solid #444;">
            <input type="number" data-id="${id}" class="emp-req-amount" value="${req.amount}" style="width:120px;background:#111;color:#0f0;border:1px solid #555;border-radius:4px;padding:4px;" ${disabledAttr}>
          </td>
        </tr>`;
    }).join('');

    employeeView.innerHTML = `
      <div style="overflow:auto;height:calc(100% - 50px);">
        <table style="width:100%;border-collapse:collapse;background:#1b1b1b;color:#ccc;font-size:12px;">
          <thead>
            <tr style="background:#2a2a2a;color:#fff;font-weight:bold;">
              <th style="padding:8px;border:1px solid #444;text-align:left;">Employee</th>
              <th style="padding:8px;border:1px solid #444;">Custom Requirement</th>
              <th style="padding:8px;border:1px solid #444;">Type</th>
              <th style="padding:8px;border:1px solid #444;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
      <div style="margin-top:10px;text-align:right;">
        <button id="saveEmployeeRequirements" style="background:#2e8b57;color:white;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;">Save Changes</button>
      </div>
    `;

    employeeView.querySelectorAll('.emp-use-custom').forEach(box => {
      box.addEventListener('change', () => {
        const id = box.getAttribute('data-id');
        const typeSelect = employeeView.querySelector(`.emp-req-type[data-id="${id}"]`);
        const amountInput = employeeView.querySelector(`.emp-req-amount[data-id="${id}"]`);
        if (box.checked) {
          if (typeSelect) {
            typeSelect.disabled = false;
            if (typeSelect.dataset.lastValue) {
              typeSelect.value = typeSelect.dataset.lastValue;
            }
          }
          if (amountInput) {
            amountInput.disabled = false;
            if (amountInput.dataset.lastValue) {
              amountInput.value = amountInput.dataset.lastValue;
            }
          }
        } else {
          const defaults = getDefaultRequirement();
          if (typeSelect) {
            typeSelect.dataset.lastValue = typeSelect.value;
            typeSelect.value = defaults.type;
            typeSelect.disabled = true;
          }
          if (amountInput) {
            amountInput.dataset.lastValue = amountInput.value;
            amountInput.value = defaults.amount;
            amountInput.disabled = true;
          }
        }
      });
    });

    const saveButton = employeeView.querySelector('#saveEmployeeRequirements');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        const types = employeeView.querySelectorAll('.emp-req-type');
        const amounts = employeeView.querySelectorAll('.emp-req-amount');
        const toggles = Array.from(employeeView.querySelectorAll('.emp-use-custom'));
        const previousRequirements = {};
        toggles.forEach(box => {
          const id = box.getAttribute('data-id');
          previousRequirements[id] = getMemberRequirement(id);
        });

        toggles.forEach(box => {
          const id = box.getAttribute('data-id');
          const prev = previousRequirements[id] || getDefaultRequirement();
          let nextRequirement;
          if (!box.checked) {
            const defaults = getDefaultRequirement();
            SETTINGS.memberRequirements[id] = { type: defaults.type, amount: defaults.amount, useDefault: true };
            nextRequirement = defaults;
            delete SETTINGS.memberRequirementResets[id];
          } else {
            const select = types ? Array.from(types).find(sel => sel.getAttribute('data-id') === id) : null;
            const amountInput = amounts ? Array.from(amounts).find(input => input.getAttribute('data-id') === id) : null;
            const type = select && select.value === 'item' ? 'item' : 'money';
            const amountValue = amountInput ? parseInt(amountInput.value, 10) : NaN;
            const fallback = type === 'money' ? SETTINGS.defaultMoneyTax : SETTINGS.defaultItemTax;
            const normalizedAmount = isNaN(amountValue) ? fallback : amountValue;
            SETTINGS.memberRequirements[id] = {
              type,
              amount: normalizedAmount,
              useDefault: false
            };
            nextRequirement = { type, amount: normalizedAmount, isDefault: false };
          }
          if (!nextRequirement) {
            nextRequirement = getMemberRequirement(id);
          }
          if (!prev || prev.type !== nextRequirement.type || prev.amount !== nextRequirement.amount || (!!prev.isDefault) !== (!!nextRequirement.isDefault)) {
            SETTINGS.memberRequirementResets[id] = getCurrentWeekKey();
          }
        });
        saveSettings(SETTINGS);
        renderOverview(lastWeeklyDataCache, lastEmployeesCache);
        renderEmployeeMenu(employees);
        renderPaymentHistory(lastPaymentHistoryCache, lastEmployeesCache);
        alert('Employee requirements saved.');
      });
    }
  }

  function safe(obj, path) {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  }

  function describeLogMedium(log) {
    if (!log || typeof log !== 'object') {
      return 'Log Entry';
    }
    const type = Number(log.log);
    const category = Number(log.category);
    if (type === 4800) {
      return 'Money transfer to company';
    }
    if (type === 4810) {
      return 'Company trade payment';
    }
    if (type === 4102) {
      return 'Trade sent items';
    }
    if (type === 4103) {
      return 'Trade received items';
    }
    if (category === 85) {
      return 'Item delivery to company';
    }
    const details = [];
    const title = typeof log.title === 'string' ? log.title.trim() : '';
    if (title) {
      details.push(title);
    }
    const description = typeof log.description === 'string' ? log.description.trim() : '';
    if (description) {
      details.push(description);
    }
    const dataFields = ['note', 'message', 'reason', 'description', 'summary', 'detail'];
    dataFields.forEach(field => {
      const value = log?.data ? log.data[field] : undefined;
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed) {
          details.push(trimmed);
        }
      }
    });
    if (details.length === 0 && Number.isFinite(type)) {
      details.push(`Log ${type}`);
    }
    const unique = Array.from(new Set(details.filter(Boolean)));
    return unique.length > 0 ? unique.join(' — ') : 'Log Entry';
  }

  function normalizeIdCandidate(candidate) {
    if (candidate === null || candidate === undefined) {
      return undefined;
    }
    if (typeof candidate === 'number') {
      const num = Number(candidate);
      if (!Number.isFinite(num) || num === 0) {
        return undefined;
      }
      return String(num);
    }
    if (typeof candidate === 'string') {
      const trimmed = candidate.trim();
      if (!trimmed) {
        return undefined;
      }
      const bracketMatch = trimmed.match(/\[(\d+)\]/);
      if (bracketMatch && bracketMatch[1] !== '0') {
        return bracketMatch[1];
      }
      if (/^\d+$/.test(trimmed) && trimmed !== '0') {
        return trimmed;
      }
      return undefined;
    }
    if (typeof candidate === 'object') {
      const fields = ['player_id', 'playerId', 'id', 'ID', 'user_id', 'userid', 'uid'];
      for (const field of fields) {
        if (candidate[field] !== undefined) {
          const normalized = normalizeIdCandidate(candidate[field]);
          if (normalized) {
            return normalized;
          }
        }
      }
    }
    return undefined;
  }

  function buildEmployeeNameIndex(employees) {
    const index = {};
    Object.entries(employees || {}).forEach(([id, record]) => {
      const name = getEmployeeName(record);
      if (typeof name !== 'string') {
        return;
      }
      const normalized = name.trim().toLowerCase();
      if (!normalized) {
        return;
      }
      if (!index[normalized]) {
        index[normalized] = [];
      }
      index[normalized].push(id);
    });
    return index;
  }

  function resolveEmployeeIdByNameCandidate(candidate, employees, nameIndex) {
    if (candidate === null || candidate === undefined) {
      return undefined;
    }
    if (typeof candidate === 'string') {
      const trimmed = candidate.trim();
      if (!trimmed) {
        return undefined;
      }
      const bracketMatch = trimmed.match(/\[(\d+)\]/);
      if (bracketMatch && employees[bracketMatch[1]]) {
        return bracketMatch[1];
      }
      const normalized = trimmed.toLowerCase();
      const matches = nameIndex[normalized];
      if (matches && matches.length > 0) {
        return matches[0];
      }
      return undefined;
    }
    if (typeof candidate === 'object') {
      const directId = normalizeIdCandidate(candidate);
      if (directId && employees[directId]) {
        return directId;
      }
      const nameFields = [
        'name', 'player_name', 'playerName', 'username',
        'user_name', 'owner_name', 'target_name', 'member_name',
        'giver_name', 'from_name', 'employee_name', 'recipient_name',
        'sender_name', 'initiator_name'
      ];
      for (const field of nameFields) {
        if (candidate[field]) {
          const match = resolveEmployeeIdByNameCandidate(candidate[field], employees, nameIndex);
          if (match) {
            return match;
          }
        }
      }
    }
    return undefined;
  }

  function findEmployeeIdFromLog(log, employees, nameIndex) {
    const possibleFields = [
      'data.sender_id', 'data.sender', 'data.sender.player_id', 'data.sender.user_id', 'data.sender.id',
      'data.initiator_id', 'data.initiator', 'data.initiator.player_id', 'data.initiator.user_id', 'data.initiator.id',
      'data.user_id', 'data.user', 'data.user.player_id', 'data.user.user_id', 'data.user.id',
      'data.owner_id', 'data.owner', 'data.owner.player_id',
      'data.from_id', 'data.from', 'data.from.player_id',
      'data.giver_id', 'data.giver', 'data.giver.player_id',
      'data.member_id', 'data.member', 'data.member.player_id',
      'data.target_id', 'data.target', 'data.target.player_id'
    ];

    for (const path of possibleFields) {
      const candidate = normalizeIdCandidate(safe(log, path));
      if (candidate && employees[candidate]) {
        return candidate;
      }
    }

    if (!nameIndex) {
      nameIndex = buildEmployeeNameIndex(employees);
    }

    const possibleNameFields = [
      'data.sender_name', 'data.sender.name', 'data.senderName', 'data.sender',
      'data.initiator_name', 'data.initiator.name', 'data.initiator',
      'data.user_name', 'data.user.name', 'data.userName', 'data.user',
      'data.owner_name', 'data.owner.name', 'data.owner',
      'data.from_name', 'data.from.name', 'data.from',
      'data.giver_name', 'data.giver.name', 'data.giver',
      'data.member_name', 'data.member.name', 'data.member',
      'data.target_name', 'data.target.name', 'data.target',
      'data.employee_name', 'data.employee.name', 'data.employee',
      'data.recipient_name', 'data.recipient.name', 'data.recipient',
      'data.name'
    ];

    for (const path of possibleNameFields) {
      const candidate = resolveEmployeeIdByNameCandidate(safe(log, path), employees, nameIndex);
      if (candidate && employees[candidate]) {
        return candidate;
      }
    }
    return undefined;
  }

  function isMoneyLog(logType) {
    return Number.isFinite(logType) && (logType === 4800 || logType === 4810);
  }

  function isItemLog(logCategory) {
    return Number.isFinite(logCategory) && logCategory === 85;
  }

  function getMoneyAmountFromLog(log) {
    const fields = ['data.money', 'data.amount', 'data.total'];
    for (const path of fields) {
      const value = safe(log, path);
      if (value !== undefined) {
        const num = Number(value);
        if (Number.isFinite(num)) {
          return num;
        }
      }
    }
    return 0;
  }

  function extractQuantity(value) {
    if (value === undefined || value === null) {
      return undefined;
    }
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : undefined;
    }
    if (typeof value === 'string') {
      const match = value.match(/-?\d+(?:\.\d+)?/);
      if (match) {
        const num = Number(match[0]);
        return Number.isFinite(num) ? num : undefined;
      }
      return undefined;
    }
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
  }

  function escapeRegex(str) {
    return String(str).replace(/[[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  function parseQuantityFromText(text, targetName) {
    if (typeof text !== 'string' || !targetName) {
      return undefined;
    }
    const escaped = escapeRegex(targetName);
    const regexes = [
      new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(?:x\\s*)?${escaped}`, 'i'),
      new RegExp(`${escaped}\\s*(?:x\\s*)?(\\d+(?:\\.\\d+)?)`, 'i')
    ];
    for (const regex of regexes) {
      const match = text.match(regex);
      if (match) {
        const quantity = Number(match[1]);
        if (Number.isFinite(quantity)) {
          return quantity;
        }
      }
    }
    return undefined;
  }

  function searchDataForItem(data, targetName, targetId) {
    if (!data || !targetName) {
      return 0;
    }
    const lowerTarget = targetName.toLowerCase();
    const normalizedTargetId = normalizeItemId(targetId);
    const visited = new Set();
    let subtotal = 0;

    function traverse(value) {
      if (!value) {
        return;
      }
      if (Array.isArray(value)) {
        value.forEach(traverse);
        return;
      }
      if (typeof value === 'object') {
        if (visited.has(value)) {
          return;
        }
        visited.add(value);

        const names = [
          value.name, value.item, value.itemname, value.itemName, value.title,
          value.text, value.description, value.details,
          value.sent, value.received, value.note, value.message, value.summary
        ].filter(v => typeof v === 'string');

        const exactMatch = names.find(n => n.trim().toLowerCase() === lowerTarget);
        const looseMatch = exactMatch ? exactMatch : names.find(n => n.toLowerCase().includes(lowerTarget));
        const idCandidates = [value.id, value.ID, value.item_id, value.itemId, value.itemID];
        const idMatch = normalizedTargetId !== undefined && idCandidates.some(candidate => {
          const numeric = normalizeItemId(candidate);
          return numeric !== undefined && numeric === normalizedTargetId;
        });

        let matched = false;
        if (exactMatch || looseMatch || idMatch) {
          const quantityFields = [
            'quantity', 'qty', 'amount', 'q', 'count', 'number', 'total', 'item_quantity',
            'quantity_sent', 'quantity_received', 'qty_sent', 'qty_received',
            'stack', 'stack_size', 'size'
          ];
          let quantity;
          for (const field of quantityFields) {
            if (value[field] !== undefined) {
              const extracted = extractQuantity(value[field]);
              if (extracted !== undefined) {
                quantity = extracted;
                break;
              }
            }
          }
          if (quantity === undefined && (exactMatch || looseMatch)) {
            const textCandidates = names.slice();
            const textFields = [value.note, value.message, value.extra, value.summary];
            textFields.forEach(field => {
              if (typeof field === 'string') {
                textCandidates.push(field);
              }
            });
            for (const text of textCandidates) {
              const parsed = parseQuantityFromText(text, targetName);
              if (parsed !== undefined) {
                quantity = parsed;
                break;
              }
            }
          }
          if (quantity === undefined) {
            quantity = 1;
          }
          if (quantity > 0) {
            subtotal += quantity;
            matched = true;
          }
        }

        Object.values(value).forEach(child => {
          if (child && (typeof child === 'object' || Array.isArray(child))) {
            traverse(child);
          } else if (!matched && typeof child === 'string' && child.toLowerCase().includes(lowerTarget)) {
            const parsed = parseQuantityFromText(child, targetName);
            if (parsed !== undefined && parsed > 0) {
              subtotal += parsed;
            }
          }
        });
        return;
      }
      if (typeof value === 'string' && value.toLowerCase().includes(lowerTarget)) {
        const parsed = parseQuantityFromText(value, targetName);
        if (parsed !== undefined && parsed > 0) {
          subtotal += parsed;
        }
      }
    }

    traverse(data);
    return subtotal;
  }

  function getItemQuantityFromLog(log, itemName, itemId) {
    if (!itemName) {
      return 0;
    }
    const targetName = String(itemName).trim().toLowerCase();
    if (!targetName) {
      return 0;
    }

    const normalizedTargetId = normalizeItemId(itemId);

    let total = 0;

    const considerEntry = entry => {
      if (!entry || typeof entry !== 'object') {
        return;
      }
      const names = [entry.name, entry.item, entry.itemname, entry.itemName, entry.title];
      const quantities = [entry.quantity, entry.qty, entry.amount, entry.q, entry.count];
      const matchedName = names.find(n => typeof n === 'string' && n.trim().toLowerCase() === targetName);
      const idCandidates = [entry.id, entry.ID, entry.item_id, entry.itemId, entry.itemID];
      const entryId = idCandidates.map(normalizeItemId).find(id => id !== undefined);
      const matchesId = normalizedTargetId !== undefined && entryId !== undefined && entryId === normalizedTargetId;
      if (!matchedName && !matchesId) {
        return;
      }
      const quantity = quantities.map(extractQuantity).find(q => q !== undefined);
      const value = quantity !== undefined ? quantity : 1;
      if (value > 0) {
        total += value;
      }
    };

    const considerNameAndQuantity = (name, quantity) => {
      if (typeof name !== 'string') {
        return;
      }
      if (name.trim().toLowerCase() !== targetName) {
        return;
      }
      const qty = extractQuantity(quantity);
      const value = qty !== undefined ? qty : 1;
      if (value > 0) {
        total += value;
      }
    };

    const singleCandidates = [
      safe(log, 'data.item'),
      safe(log, 'data.sent_item'),
      safe(log, 'data.target_item'),
      safe(log, 'data.received_item'),
      safe(log, 'data.sent'),
      safe(log, 'data.received'),
      safe(log, 'data.gift')
    ];
    singleCandidates.forEach(considerEntry);

    const arrayCandidates = [
      safe(log, 'data.items'),
      safe(log, 'data.sent_items'),
      safe(log, 'data.item_list'),
      safe(log, 'data.gifts'),
      safe(log, 'data.received_items'),
      safe(log, 'data.sentItems'),
      safe(log, 'data.receivedItems'),
      safe(log, 'data.itemlist'),
      safe(log, 'data.inventory')
    ];
    arrayCandidates.forEach(collection => {
      if (Array.isArray(collection)) {
        collection.forEach(considerEntry);
      } else if (collection && typeof collection === 'object') {
        Object.values(collection).forEach(considerEntry);
      }
    });

    const fallbackPairs = [
      { name: safe(log, 'data.name'), quantity: safe(log, 'data.quantity') ?? safe(log, 'data.qty') },
      { name: safe(log, 'data.itemname'), quantity: safe(log, 'data.amount') },
      { name: safe(log, 'data.item_name'), quantity: safe(log, 'data.item_quantity') },
      { name: safe(log, 'data.itemName'), quantity: safe(log, 'data.itemQuantity') },
      { name: safe(log, 'data.sent_item_name'), quantity: safe(log, 'data.sent_item_quantity') ?? safe(log, 'data.sent_item_qty') },
      { name: safe(log, 'data.received_item_name'), quantity: safe(log, 'data.received_item_quantity') ?? safe(log, 'data.received_item_qty') }
    ];
    fallbackPairs.forEach(pair => considerNameAndQuantity(pair.name, pair.quantity));

    const textCandidates = [
      safe(log, 'data.description'),
      safe(log, 'data.details'),
      safe(log, 'data.message'),
      safe(log, 'data.note')
    ].filter(Boolean);

    if (textCandidates.length > 0) {
      let textTotal = 0;
      textCandidates.forEach(text => {
        if (typeof text !== 'string') {
          return;
        }
        const regex = new RegExp(`(\\d+)\\s*x?\\s*${escapeRegex(itemName)}`, 'gi');
        let match;
        while ((match = regex.exec(text)) !== null) {
          const value = Number(match[1]);
          if (Number.isFinite(value)) {
            textTotal += value;
          }
        }
      });

      if (textTotal > 0) {
        if (total === 0) {
          total = textTotal;
        } else if (textTotal > total) {
          total = textTotal;
        }
      }
    }

    if (total > 0) {
      return total;
    }

    const additional = searchDataForItem(safe(log, 'data'), targetName, normalizedTargetId);
    return additional > 0 ? additional : 0;
  }

  function buildPaymentHistoryFromAggregates(weeklyData) {
    const history = {};
    if (!weeklyData || typeof weeklyData !== 'object') {
      return history;
    }
    Object.keys(weeklyData).forEach(weekKey => {
      const perEmployee = weeklyData[weekKey];
      if (!perEmployee || typeof perEmployee !== 'object') {
        return;
      }
      const baseDate = getDateFromWeekKey(weekKey);
      const baseTime = baseDate ? baseDate.getTime() : Date.now();
      Object.keys(perEmployee).forEach(employeeId => {
        const totals = perEmployee[employeeId] || {};
        if (!history[employeeId]) {
          history[employeeId] = [];
        }
        if (Number.isFinite(totals.money) && totals.money > 0) {
          const paymentId = `test-${employeeId}-${weekKey}-money`;
          const excluded = isPaymentExcluded(employeeId, paymentId);
          history[employeeId].push({
            id: paymentId,
            timestamp: baseTime,
            weekKey,
            type: 'money',
            amount: totals.money,
            medium: 'Simulated payment (Test Mode)',
            excluded
          });
        }
        if (Number.isFinite(totals.items) && totals.items > 0) {
          const paymentId = `test-${employeeId}-${weekKey}-item`;
          const excluded = isPaymentExcluded(employeeId, paymentId);
          history[employeeId].push({
            id: paymentId,
            timestamp: baseTime + 60000,
            weekKey,
            type: 'item',
            amount: totals.items,
            medium: 'Simulated item delivery (Test Mode)',
            excluded
          });
        }
      });
    });
    Object.keys(history).forEach(id => {
      history[id].sort((a, b) => Number(a.timestamp || 0) - Number(b.timestamp || 0));
    });
    return history;
  }

  function generateWeekMapFrom(startYear, startWeek) {
    const map = {};
    const now = new Date();
    const [currentYear, currentWeek] = getWeekNumber(now);
    for (let year = startYear; year <= currentYear; year++) {
      const maxWeek = year === currentYear ? currentWeek : 53;
      const start = year === startYear ? startWeek : 1;
      for (let week = start; week <= maxWeek; week++) {
        map[`${year}-W${week}`] = true;
      }
    }
    return map;
  }

  function generateWeekKeys(startYear, startWeek) {
    return Object.keys(generateWeekMapFrom(startYear, startWeek));
  }

  function escapeHtml(value) {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value).replace(/[&<>'"]/g, ch => {
      switch (ch) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case "'":
          return '&#39;';
        default:
          return ch;
      }
    });
  }

})();
