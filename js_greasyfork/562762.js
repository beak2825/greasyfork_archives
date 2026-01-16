// ==UserScript==
// @name         SV HaUI Helper
// @namespace    https://github.com/vuquan2005/svHaUI-Helper
// @version      1.2.1
// @author       VuQuan
// @description  Nâng cao trải nghiệm cho sinh viên HaUI
// @license      GPL-3.0-only
// @icon         https://cdn-001.haui.edu.vn//img/logo-45x45.png
// @homepageURL  https://github.com/vuquan2005/svHaUI-Helper
// @supportURL   https://github.com/vuquan2005/svHaUI-Helper/issues
// @match        https://sv.haui.edu.vn/*
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562762/SV%20HaUI%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/562762/SV%20HaUI%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_deleteValue = (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_listValues = (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  class StorageManager {
    get(key, defaultValue) {
      return _GM_getValue(key, defaultValue);
    }
    set(key, value) {
      _GM_setValue(key, value);
    }
    remove(key) {
      _GM_deleteValue(key);
    }
    keys() {
      return _GM_listValues();
    }
  }
  const storage = new StorageManager();
  const LOG_LEVEL_PRIORITY = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    none: 4
  };
  const LEVEL_STYLES = {
    debug: "color: #9CA3AF",
    info: "color: #3B82F6",
    warn: "color: #F59E0B",
    error: "color: #EF4444; font-weight: bold"
  };
  const LEVEL_ICONS = {
    debug: "🔍",
    info: "ℹ️",
    warn: "⚠️",
    error: "❌"
  };
  let globalMinLevel = "debug";
  function setGlobalLogLevel(level) {
    globalMinLevel = level;
  }
  const noop = () => {
  };
  class Logger {
    prefix;
    minLevel;
    constructor(options = {}) {
      this.prefix = options.prefix || "App";
      this.minLevel = options.minLevel || null;
    }
    getEffectiveLevel() {
      return this.minLevel || globalMinLevel;
    }
    shouldLog(level) {
      const effectiveLevel = this.getEffectiveLevel();
      return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[effectiveLevel];
    }
get d() {
      if (!this.shouldLog("debug")) return noop;
      const icon = LEVEL_ICONS.debug;
      const style = LEVEL_STYLES.debug;
      return console.log.bind(console, `%c${icon} [${this.prefix}]`, style);
    }
get i() {
      if (!this.shouldLog("info")) return noop;
      const icon = LEVEL_ICONS.info;
      const style = LEVEL_STYLES.info;
      return console.info.bind(console, `%c${icon} [${this.prefix}]`, style);
    }
get w() {
      if (!this.shouldLog("warn")) return noop;
      const icon = LEVEL_ICONS.warn;
      const style = LEVEL_STYLES.warn;
      return console.warn.bind(console, `%c${icon} [${this.prefix}]`, style);
    }
get e() {
      if (!this.shouldLog("error")) return noop;
      const icon = LEVEL_ICONS.error;
      const style = LEVEL_STYLES.error;
      return console.error.bind(console, `%c${icon} [${this.prefix}]`, style);
    }
child(name) {
      const options = {
        prefix: `${this.prefix}:${name}`
      };
      if (this.minLevel) {
        options.minLevel = this.minLevel;
      }
      return new Logger(options);
    }
setLevel(level) {
      this.minLevel = level;
    }
  }
  const log$2 = new Logger({ prefix: "HaUI" });
  function createLogger(name) {
    return log$2.child(name);
  }
  const log$1 = createLogger("Settings");
  const DEFAULT_SETTINGS = {
    logLevel: "info",
    features: {}
  };
  class SettingsManager {
    settings;
    constructor() {
      this.settings = this.load();
      setGlobalLogLevel(this.settings.logLevel);
    }
    load() {
      try {
        const saved = storage.get("app_settings", DEFAULT_SETTINGS);
        return { ...DEFAULT_SETTINGS, ...saved };
      } catch (e) {
        log$1.e("Failed to load settings:", e);
        return { ...DEFAULT_SETTINGS };
      }
    }
    save() {
      try {
        storage.set("app_settings", this.settings);
      } catch (e) {
        log$1.e("Failed to save settings:", e);
      }
    }
    isFeatureEnabled(featureId) {
      return this.settings.features[featureId] ?? true;
    }
    setFeatureEnabled(featureId, enabled) {
      this.settings.features[featureId] = enabled;
      this.save();
    }
    setLogLevel(level) {
      this.settings.logLevel = level;
      setGlobalLogLevel(level);
      this.save();
    }
    getLogLevel() {
      return this.settings.logLevel;
    }
  }
  const settings = new SettingsManager();
  class Feature {
    id;
    name;
    description;
    urlMatch;
log;
    constructor(config) {
      this.id = config.id;
      this.name = config.name;
      this.description = config.description;
      this.urlMatch = config.urlMatch;
      this.log = createLogger(config.name);
    }
shouldRun() {
      if (!settings.isFeatureEnabled(this.id)) {
        return false;
      }
      if (!this.urlMatch) {
        return true;
      }
      const currentUrl = window.location.href;
      if (typeof this.urlMatch === "string") {
        return currentUrl.includes(this.urlMatch);
      }
      return this.urlMatch.test(currentUrl);
    }
destroy() {
    }
  }
  function removeDiacritics(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
  }
  function keepAlphanumeric(text) {
    return text.replace(/[^a-zA-Z0-9]/g, "");
  }
  function normalizeCaptchaInput(text) {
    return keepAlphanumeric(removeDiacritics(text.toLowerCase()));
  }
  const log = createLogger("FeatureManager");
  class FeatureManager {
    features = new Map();
    initialized = new Set();
register(feature) {
      if (this.features.has(feature.id)) {
        log.w(`Feature "${feature.id}" đã được đăng ký, bỏ qua.`);
        return;
      }
      this.features.set(feature.id, feature);
      log.d(`Đã đăng ký: ${feature.name}`);
    }
registerAll(features) {
      features.forEach((f) => this.register(f));
    }
async initAll() {
      log.d("Bắt đầu khởi tạo features...");
      for (const [id, feature] of this.features) {
        if (this.initialized.has(id)) {
          continue;
        }
        if (!feature.shouldRun()) {
          log.d(`Bỏ qua "${feature.name}" (không match URL hoặc bị tắt)`);
          continue;
        }
        try {
          log.d(`Khởi tạo: ${feature.name}`);
          await feature.init();
          this.initialized.add(id);
        } catch (error) {
          log.e(`Lỗi khi khởi tạo "${feature.name}":`, error);
        }
      }
      log.i(`Đã khởi tạo ${this.initialized.size}/${this.features.size} features`);
    }
get(id) {
      return this.features.get(id);
    }
getAll() {
      return Array.from(this.features.values());
    }
isInitialized(id) {
      return this.initialized.has(id);
    }
  }
  const featureManager = new FeatureManager();
  const URL_TITLE_MAP = {
"/": "🏠 Trang chủ",
"/student/recharge/cashinqr": "💳 Nạp tiền QR",
    "/student/recharge/cashin": "💳 Nạp tiền TK",
    "/student/recharge/inpatientpayment": "💰 Thanh toán công nợ",
    "/student/recharge/transactionhistory": "📜 Lịch sử GD",
    "/student/recharge/listeinvoice": "🧾 Hóa đơn ĐT",
"/student/userdetail/userdetail": "👤 Thông tin SV",
    "/student/userdetail/updateuserprofile": "📝 Cập nhật hồ sơ",
    "/student/userdetail/usercerupdate": "🎓 TT in bằng",
    "/member/changepass": "🔐 Đổi mật khẩu",
    "/student/userdetail/militaryclothes": "🎖️ Quân tư trang",
"/register/dangkyhocphan": "📝 ĐK HP dự kiến",
    "/register/": "📝 Đăng ký HP",
    "/training/removeclasslist": "❌ Rút HP",
    "/training/statisticregister": "📊 Thống kê ĐKHP",
    "/training/viewprogram": "📚 ĐK 2 chương trình",
"/training/viewcourseindustry": "📚 Khung CT",
    "/training/programmodulessemester": "📅 Khung theo kỳ",
"/timestable/calendarct": "📆 KH đầu khóa",
    "/timestable/calendarcl": "🗓️ Thời khóa biểu",
    "/timestable/timestableview": "🗓️ Lịch giảng dạy",
"/student/schedulefees/examplant": "📆 Kế hoạch thi",
    "/student/schedulefees/transactionmodules": "📆 Lịch thi",
    "/student/schedulefees/testonline": "💻 Thi Online",
"/student/result/studyresults": "📊 KQ học tập",
    "/student/result/examresult": "📋 KQ thi",
    "/student/result/viewscorebysemester": "📈 ĐTB học kỳ",
    "/student/result/viewmodules": "📈 ĐTB tích lũy",
    "/student/result/sendreceiveapplications": "📨 Phúc tra",
"/tttn/htdn/list": "🎓 Thực tập TN",
    "/student/result/graduatecal": "🎓 Xét tốt nghiệp",
    "/student/result/degreeview": "🎓 TT in bằng",
"/student/application/notifilist": "📢 Thông báo trường",
    "/student/application/messengeruserlist": "📬 Thông báo cá nhân",
    "/student/recharge/serviceonegate": "🚪 Dịch vụ một cửa",
    "/messages": "💬 Chia sẻ lớp",
    "/messages/group": "💬 Chia sẻ trường",
    "/study": "📖 Học trực tuyến",
    "/survey": "� Khảo sát"
  };
  const DOM = {
panelHeader: () => {
      const el = document.querySelector("span.k-panel-header-text:first-child");
      return el?.textContent?.trim() || null;
    },
parseCourseInfo: (header) => {
      const match = header.match(/CHI TIẾT HỌC PHẦN[^:]*:\s*(.+?)\s*\(\s*([A-Z]{2}\d+)\s*\)/);
      if (!match) return null;
      return { name: match[1].trim(), code: match[2] };
    },
classInfo: () => {
      const table = document.querySelector("table:first-child");
      if (!table) return null;
      const subjectName = table.querySelector("tbody > tr:first-child > td:nth-child(2)")?.textContent?.trim();
      const classCode = table.querySelector("tbody > tr:nth-child(3) > td:nth-child(2)")?.textContent?.trim();
      if (!subjectName || !classCode) return null;
      return { subjectName, classCode };
    },
friendInfo: () => {
      const table = document.querySelector("table:first-child");
      if (!table) return null;
      const name = table.querySelector("tbody > tr:first-child > td:nth-child(2)")?.textContent?.trim();
      const className = table.querySelector("tbody > tr:nth-child(3) > td:nth-child(2)")?.textContent?.trim();
      if (!name || !className) return null;
      return { name, className };
    }
  };
  const DYNAMIC_URL_PATTERNS = [
{
      pattern: /^\/training\/viewmodulescdiosv\//,
      icon: "📖",
      getTitleFn: () => {
        const header = DOM.panelHeader();
        if (!header) return "Chi tiết HP";
        const info = DOM.parseCourseInfo(header);
        return info ? `${info.name} (${info.code})` : "Chi tiết HP";
      }
    },
{
      pattern: /^\/training\/viewcourseindustry2\//,
      icon: "📖",
      getTitleFn: () => {
        const header = DOM.panelHeader();
        if (!header) return "Chi tiết HP";
        const info = DOM.parseCourseInfo(header);
        return info ? `${info.name} (${info.code})` : "Chi tiết HP";
      }
    },
{
      pattern: /^\/student\/result\/viewexamresultclass/,
      icon: "👥",
      getTitleFn: () => {
        const info = DOM.classInfo();
        return info ? `KQ thi - ${info.subjectName} - ${info.classCode}` : "KQ thi lớp";
      }
    },
{
      pattern: /^\/student\/result\/viewstudyresultclass/,
      icon: "👥",
      getTitleFn: () => {
        const info = DOM.classInfo();
        return info ? `KQ HT - ${info.subjectName} - ${info.classCode}` : "KQ HT lớp";
      }
    },
{
      pattern: /^\/student\/result\/viewstudyresult\?/,
      icon: "👤",
      getTitleFn: () => {
        const info = DOM.friendInfo();
        return info ? `KQ - ${info.name} - ${info.className}` : "KQ bạn";
      }
    },
{
      pattern: /^\/student\/result\/viewexamresult\?/,
      icon: "👤",
      getTitleFn: () => {
        const info = DOM.friendInfo();
        return info ? `KQ thi - ${info.name} - ${info.className}` : "KQ thi bạn";
      }
    }
  ];
  class DynamicTitleFeature extends Feature {
    originalTitle = "";
    observer = null;
    constructor() {
      super({
        id: "dynamic-title",
        name: "Dynamic Title",
        description: "Thay đổi tiêu đề tab dựa trên trang đang xem"
      });
    }
    init() {
      this.log.i("Initializing...");
      this.originalTitle = document.title;
      this.updateTitle();
      this.observeContentChanges();
      this.log.i("Ready!");
    }
    updateTitle() {
      const url = window.location.pathname + window.location.search;
      const pathname = window.location.pathname;
      const staticTitle = URL_TITLE_MAP[pathname];
      if (staticTitle) {
        this.setTitle(staticTitle);
        return;
      }
      for (const config of DYNAMIC_URL_PATTERNS) {
        if (config.pattern.test(url)) {
          const title = config.getTitleFn();
          this.setTitle(`${config.icon} ${title}`);
          return;
        }
      }
      const panelHeader = DOM.panelHeader();
      if (panelHeader) {
        this.setTitle(`📄 ${this.truncate(panelHeader, 30)}`);
        return;
      }
      this.log.d("No matching pattern, keeping original title");
    }
    setTitle(title) {
      const newTitle = `${title} | HaUI`;
      if (document.title !== newTitle) {
        document.title = newTitle;
        this.log.d(`Title set: ${newTitle}`);
      }
    }
    truncate(str, maxLength) {
      if (str.length <= maxLength) return str;
      return str.substring(0, maxLength - 1) + "…";
    }
    observeContentChanges() {
      const content = document.querySelector(".be-content");
      if (!content) return;
      this.observer = new MutationObserver(() => {
        setTimeout(() => this.updateTitle(), 100);
      });
      this.observer.observe(content, {
        childList: true,
        subtree: true
      });
    }
    destroy() {
      document.title = this.originalTitle;
      this.observer?.disconnect();
      this.observer = null;
    }
  }
  const CAPTCHA_HANDLERS = [
{
      urlPattern: /\/sso\?token=/,
      inputSelector: "#ctl00_txtimgcode",
      submitSelector: "#ctl00_butLogin",
      imageSelector: "#ctl00_Image1"
    },
{
      urlPattern: /\/register\//,
      inputSelector: "#ctl02_txtimgcode",
      submitSelector: "#ctl02_btnSubmit",
      imageSelector: "#ctl02_Image1"
    }
  ];
  class CaptchaHelperFeature extends Feature {
    inputEl = null;
    submitEl = null;
    currentHandler = null;
normalizeTimer = null;
    DEBOUNCE_DELAY = 150;

handleInput = this.onInput.bind(this);
    handleKeyDown = this.onKeyDown.bind(this);
    handleBlur = this.onBlur.bind(this);
    constructor() {
      super({
        id: "captcha-helper",
        name: "Captcha Helper",
        description: "Hỗ trợ nhập captcha: tự động chuyển chữ thường, loại bỏ dấu, submit khi Enter/blur"
      });
    }
shouldRun() {
      if (!super.shouldRun()) return false;
      const url = window.location.pathname + window.location.search;
      return CAPTCHA_HANDLERS.some((h) => h.urlPattern.test(url));
    }
    init() {
      this.log.i("Initializing...");
      const url = window.location.pathname + window.location.search;
      this.currentHandler = CAPTCHA_HANDLERS.find((h) => h.urlPattern.test(url)) || null;
      if (!this.currentHandler) {
        this.log.w("No matching captcha handler found");
        return;
      }
      this.inputEl = document.querySelector(this.currentHandler.inputSelector);
      this.submitEl = document.querySelector(this.currentHandler.submitSelector);
      if (!this.inputEl) {
        this.log.w("Captcha input not found:", this.currentHandler.inputSelector);
        return;
      }
      if (!this.submitEl) {
        this.log.w("Submit button not found:", this.currentHandler.submitSelector);
      }
      this.inputEl.addEventListener("input", this.handleInput);
      this.inputEl.addEventListener("keydown", this.handleKeyDown);
      this.inputEl.addEventListener("blur", this.handleBlur);
      this.inputEl.focus();
      this.log.i("Ready! Input:", this.currentHandler.inputSelector);
    }
onInput() {
      if (this.normalizeTimer) {
        clearTimeout(this.normalizeTimer);
      }
      this.normalizeTimer = setTimeout(() => {
        this.normalizeInput();
      }, this.DEBOUNCE_DELAY);
    }
normalizeInput() {
      if (!this.inputEl) return;
      if (this.normalizeTimer) {
        clearTimeout(this.normalizeTimer);
        this.normalizeTimer = null;
      }
      const original = this.inputEl.value;
      const normalized = normalizeCaptchaInput(original);
      if (original !== normalized) {
        this.inputEl.value = normalized;
        this.inputEl.setSelectionRange(normalized.length, normalized.length);
        this.log.d(`Normalized: "${original}" → "${normalized}"`);
      }
    }
onKeyDown(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        this.normalizeInput();
        this.submit();
      }
    }
onBlur() {
      this.normalizeInput();
      if (this.inputEl?.value.trim()) {
        this.submit();
      }
    }
submit() {
      const value = this.inputEl?.value.trim() || "";
      const CAPTCHA_LENGTH = 5;
      if (value.length < CAPTCHA_LENGTH) {
        this.log.d(`Need ${CAPTCHA_LENGTH} chars, got ${value.length}`);
        return;
      }
      if (this.submitEl) {
        this.log.i("Submitting...");
        this.submitEl.click();
      }
    }
    destroy() {
      if (this.normalizeTimer) {
        clearTimeout(this.normalizeTimer);
        this.normalizeTimer = null;
      }
      if (this.inputEl) {
        this.inputEl.removeEventListener("input", this.handleInput);
        this.inputEl.removeEventListener("keydown", this.handleKeyDown);
        this.inputEl.removeEventListener("blur", this.handleBlur);
      }
      this.inputEl = null;
      this.submitEl = null;
      this.currentHandler = null;
    }
  }
  const allFeatures = [
    new DynamicTitleFeature(),
    new CaptchaHelperFeature()



];
  console.log(
    `%c🎓 SV HaUI Helper %cv${"1.2.1"}`,
    "color: #667eea; font-size: 20px; font-weight: bold;",
    "color: #764ba2; font-size: 14px;"
  );
  async function main() {
    log$2.i("Đang khởi tạo...");
    featureManager.registerAll(allFeatures);
    await featureManager.initAll();
    log$2.i("✅ Đã sẵn sàng!");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }

})();