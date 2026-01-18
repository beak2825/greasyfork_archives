// ==UserScript==
// @name         SV HaUI Helper
// @namespace    https://github.com/vuquan2005/svHaUI-Helper
// @version      2.0.0
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
  const log$3 = new Logger({ prefix: "HaUI" });
  function createLogger(name) {
    return log$3.child(name);
  }
  const DEFAULT_SETTINGS = {
logLevel: "warn",
captchaUndoTelex: true
  };
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



getRaw(key, defaultValue) {
      return _GM_getValue(key, defaultValue);
    }
setRaw(key, value) {
      _GM_setValue(key, value);
    }
removeRaw(key) {
      _GM_deleteValue(key);
    }
allKeys() {
      return _GM_listValues();
    }
  }
  const storage = new StorageManager();
  const log$2 = createLogger("BaseSetting");
  class BaseSetting {
key;
displayLabel;
displayDescription;
_value;
defaultValue;
listeners = new Set();
    constructor(config) {
      this.key = config.key;
      this.displayLabel = config.displayLabel;
      this.displayDescription = config.displayDescription;
      this.defaultValue = config.defaultValue;
      this._value = this.load();
    }



getValue() {
      return this._value;
    }
setValue(value) {
      if (!this.validate(value)) {
        log$2.w(`Validation failed for setting "${this.key}":`, value);
        return false;
      }
      const oldValue = this._value;
      if (this.isEqual(oldValue, value)) {
        return true;
      }
      this._value = value;
      this.save();
      this.emit(oldValue, value);
      return true;
    }
reset() {
      this.setValue(this.defaultValue);
    }
isEqual(a, b) {
      return a === b;
    }



serialize() {
      return JSON.stringify(this._value);
    }
deserialize(data) {
      try {
        return JSON.parse(data);
      } catch {
        log$2.w(`Failed to deserialize setting "${this.key}", using default`);
        return this.defaultValue;
      }
    }



get storageKey() {
      return `setting_${this.key}`;
    }
load() {
      try {
        const stored = storage.getRaw(this.storageKey);
        if (stored === void 0) {
          storage.setRaw(this.storageKey, this.defaultValue);
          return this.defaultValue;
        }
        return stored;
      } catch (e) {
        log$2.e(`Failed to load setting "${this.key}":`, e);
        return this.defaultValue;
      }
    }
save() {
      try {
        storage.setRaw(this.storageKey, this._value);
      } catch (e) {
        log$2.e(`Failed to save setting "${this.key}":`, e);
      }
    }



onChange(handler) {
      this.listeners.add(handler);
      return () => this.listeners.delete(handler);
    }
emit(oldValue, newValue) {
      const event = {
        key: this.key,
        oldValue,
        newValue,
        timestamp: Date.now()
      };
      this.listeners.forEach((handler) => {
        try {
          handler(event);
        } catch (e) {
          log$2.e(`Error in change handler for "${this.key}":`, e);
        }
      });
    }



toJSON() {
      return {
        key: this.key,
        displayLabel: this.displayLabel,
        displayDescription: this.displayDescription,
        optionType: this.optionType,
        value: this._value,
        defaultValue: this.defaultValue
      };
    }
toString() {
      return `${this.constructor.name}(${this.key}=${String(this._value)})`;
    }
  }
  class BooleanSetting extends BaseSetting {
    optionType = "boolean";
    constructor(config) {
      super(config);
    }
validate(value) {
      return typeof value === "boolean";
    }
toggle() {
      this.setValue(!this._value);
    }
isEnabled() {
      return this._value === true;
    }
isDisabled() {
      return this._value === false;
    }
  }
  class SelectSetting extends BaseSetting {
    optionType = "select";
options;
    constructor(config) {
      super(config);
      this.options = Object.freeze([...config.options]);
    }
validate(value) {
      return this.options.some((opt) => opt.value === value);
    }
getSelectedOption() {
      return this.options.find((opt) => opt.value === this._value);
    }
getSelectedLabel() {
      return this.getSelectedOption()?.label ?? "";
    }
selectByIndex(index) {
      if (index < 0 || index >= this.options.length) {
        return false;
      }
      return this.setValue(this.options[index].value);
    }
getSelectedIndex() {
      return this.options.findIndex((opt) => opt.value === this._value);
    }
isSelected(value) {
      return this._value === value;
    }
  }
  const log$1 = createLogger("SettingsManager");
  class SettingsManager {
registry = new Map();
globalListeners = new Set();



logLevel;
captchaUndoTelex;
featureSettings = new Map();
    constructor() {
      console.log("🔧 [HaUI:SettingsManager] Initializing settings...");
      this.logLevel = new SelectSetting({
        key: "logLevel",
        displayLabel: "Log Level",
        displayDescription: "Mức độ chi tiết của log output",
        defaultValue: DEFAULT_SETTINGS.logLevel,
        options: [
          { value: "debug", label: "Debug", description: "Hiển thị tất cả logs" },
          { value: "info", label: "Info", description: "Thông tin chung" },
          { value: "warn", label: "Warning", description: "Cảnh báo và lỗi" },
          { value: "error", label: "Error", description: "Chỉ lỗi" },
          { value: "none", label: "None", description: "Tắt hoàn toàn" }
        ]
      });
      setGlobalLogLevel(this.logLevel.getValue());
      this.logLevel.onChange((event) => {
        setGlobalLogLevel(event.newValue);
      });
      this.captchaUndoTelex = new BooleanSetting({
        key: "captchaUndoTelex",
        displayLabel: "Captcha Undo Telex",
        displayDescription: "Tự động hoàn tác gõ Telex khi nhập captcha",
        defaultValue: DEFAULT_SETTINGS.captchaUndoTelex
      });
      this.register(this.logLevel);
      this.register(this.captchaUndoTelex);
      log$1.d("✅ Settings ready!");
    }



register(setting) {
      if (this.registry.has(setting.key)) {
        log$1.w(`Setting "${setting.key}" already registered, overwriting`);
      }
      this.registry.set(setting.key, setting);
      setting.onChange((event) => {
        this.emitGlobal(setting.key, event);
      });
      log$1.d(`  ${setting.key} = ${JSON.stringify(setting.getValue())}`);
    }
get(key) {
      return this.registry.get(key);
    }
has(key) {
      return this.registry.has(key);
    }
getAll() {
      return Array.from(this.registry.values());
    }
toJSON() {
      const result = {};
      this.registry.forEach((setting, key) => {
        result[key] = setting.getValue();
      });
      return result;
    }



isFeatureEnabled(featureId, name, description) {
      let setting = this.featureSettings.get(featureId);
      if (!setting) {
        setting = new BooleanSetting({
          key: `feature_${featureId}`,
          displayLabel: name ?? featureId,
          displayDescription: description ?? `Bật/tắt ${name ?? featureId}`,
          defaultValue: true
        });
        this.featureSettings.set(featureId, setting);
        this.register(setting);
      }
      return setting.getValue();
    }
setFeatureEnabled(featureId, enabled, name, description) {
      let setting = this.featureSettings.get(featureId);
      if (!setting) {
        setting = new BooleanSetting({
          key: `feature_${featureId}`,
          displayLabel: name ?? featureId,
          displayDescription: description ?? `Bật/tắt ${name ?? featureId}`,
          defaultValue: true
        });
        this.featureSettings.set(featureId, setting);
        this.register(setting);
      }
      setting.setValue(enabled);
    }
getFeatureSetting(featureId) {
      return this.featureSettings.get(featureId);
    }



onAnyChange(handler) {
      this.globalListeners.add(handler);
      return () => this.globalListeners.delete(handler);
    }
emitGlobal(key, event) {
      this.globalListeners.forEach((handler) => {
        try {
          handler(key, event);
        } catch (e) {
          log$1.e(`Error in global change handler:`, e);
        }
      });
    }



resetAll() {
      this.registry.forEach((setting) => {
        setting.reset();
      });
      log$1.i("All settings reset to defaults");
    }
  }
  const settings = new SettingsManager();
  function normalizePath(path) {
    if (path === "/") return "/";
    return path.replace(/\/+$/, "");
  }
  const CURRENT_PATH = normalizePath(window.location.pathname);
  const CURRENT_URL = CURRENT_PATH + window.location.search;
  const CURRENT_HREF = window.location.origin + CURRENT_URL;
  class Feature {



static currentPath = CURRENT_PATH;
static currentUrl = CURRENT_URL;
static currentHref = CURRENT_HREF;



get currentPath() {
      return Feature.currentPath;
    }
get currentUrl() {
      return Feature.currentUrl;
    }
get currentHref() {
      return Feature.currentHref;
    }


id;
    name;
    description;
    urlMatch;
log;
matchResult = null;
    constructor(config) {
      this.id = config.id;
      this.name = config.name;
      this.description = config.description;
      this.urlMatch = config.urlMatch;
      this.log = createLogger(config.name);
    }



normalizePatterns(config) {
      if (Array.isArray(config)) {
        return config.map((item) => {
          if (typeof item === "object" && "pattern" in item) {
            return item;
          }
          return { pattern: item };
        });
      }
      if (typeof config === "object" && "pattern" in config) {
        return [config];
      }
      return [{ pattern: config }];
    }
testPattern(pattern) {
      if (typeof pattern === "string") {
        return this.currentPath === pattern;
      }
      return pattern.test(this.currentUrl);
    }
shouldRun() {
      if (!settings.isFeatureEnabled(this.id, this.name, this.description)) {
        return false;
      }
      this.matchResult = { matched: false };
      if (!this.urlMatch) {
        this.matchResult.matched = true;
        return true;
      }
      const patterns = this.normalizePatterns(this.urlMatch);
      for (let i = 0; i < patterns.length; i++) {
        const { name, pattern } = patterns[i];
        if (this.testPattern(pattern)) {
          this.matchResult = {
            matched: true,
            matchIndex: i,
            matchName: name,
            pattern
          };
          return true;
        }
      }
      return false;
    }
destroy() {
    }
  }
  const log = createLogger("FeatureManager");
  class FeatureManager {
    features = new Map();
    initialized = new Set();
register(feature) {
      if (this.features.has(feature.id)) {
        log.w(`Feature "${feature.id}" already registered, skipping.`);
        return;
      }
      this.features.set(feature.id, feature);
      log.d(`Registered: ${feature.name}`);
    }
registerAll(features) {
      features.forEach((f) => this.register(f));
    }
async initAll() {
      log.d("Starting feature initialization...");
      for (const [id, feature] of this.features) {
        log.d(`Checking feature: ${feature.name}`);
        if (this.initialized.has(id)) {
          continue;
        }
        if (!feature.shouldRun()) {
          log.d(`Skipping "${feature.name}" (URL mismatch or disabled)`);
          continue;
        }
        try {
          log.d(`Initializing: ${feature.name}`);
          await feature.init();
          this.initialized.add(id);
        } catch (error) {
          log.e(`Error initializing "${feature.name}":`, error);
        }
        log.d(`✅ Initialized: ${feature.name}`);
      }
      log.i(`✅ Initialized ${this.initialized.size}/${this.features.size} features`);
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
  const TITLE_UPDATE_DEBOUNCE_MS = 100;
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
        if (!header) return null;
        const info = DOM.parseCourseInfo(header);
        return info ? `${info.name} (${info.code})` : null;
      }
    },
{
      pattern: /^\/training\/viewcourseindustry2\//,
      icon: "📖",
      getTitleFn: () => {
        const header = DOM.panelHeader();
        if (!header) return null;
        const info = DOM.parseCourseInfo(header);
        return info ? `${info.name} (${info.code})` : null;
      }
    },
{
      pattern: /^\/student\/result\/viewexamresultclass/,
      icon: "👥",
      getTitleFn: () => {
        const info = DOM.classInfo();
        return info ? `KQ thi - ${info.subjectName} - ${info.classCode}` : null;
      }
    },
{
      pattern: /^\/student\/result\/viewstudyresultclass/,
      icon: "👥",
      getTitleFn: () => {
        const info = DOM.classInfo();
        return info ? `KQ HT - ${info.subjectName} - ${info.classCode}` : null;
      }
    },
{
      pattern: /^\/student\/result\/viewstudyresult\?/,
      icon: "👤",
      getTitleFn: () => {
        const info = DOM.friendInfo();
        return info ? `KQ - ${info.name} - ${info.className}` : null;
      }
    },
{
      pattern: /^\/student\/result\/viewexamresult\?/,
      icon: "👤",
      getTitleFn: () => {
        const info = DOM.friendInfo();
        return info ? `KQ thi - ${info.name} - ${info.className}` : null;
      }
    }
  ];
  class DynamicTitleFeature extends Feature {
    originalTitle = "";
    observer = null;
    debounceTimer = null;
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
      const found = this.updateTitle();
      if (!found) {
        this.observeContentChanges();
      }
      this.log.i("Ready!");
    }
updateTitle() {
      const url = window.location.pathname + window.location.search;
      const pathname = window.location.pathname;
      const staticTitle = URL_TITLE_MAP[pathname];
      if (staticTitle) {
        this.setTitle(staticTitle);
        return true;
      }
      for (const config of DYNAMIC_URL_PATTERNS) {
        if (config.pattern.test(url)) {
          const title = config.getTitleFn();
          if (title === null) {
            return false;
          }
          this.setTitle(`${config.icon} ${title}`);
          return true;
        }
      }
      const panelHeader = DOM.panelHeader();
      if (panelHeader) {
        this.setTitle(`📄 ${this.truncate(panelHeader, 30)}`);
        return true;
      }
      this.log.d("No matching pattern, keeping original title");
      return false;
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
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
          this.debounceTimer = null;
          const found = this.updateTitle();
          if (found) {
            this.log.d("Title found, stopping observer");
            this.observer?.disconnect();
            this.observer = null;
          }
        }, TITLE_UPDATE_DEBOUNCE_MS);
      });
      this.observer.observe(content, {
        childList: true,
        subtree: true
      });
      this.log.d("Started observing for dynamic content");
    }
destroy() {
      document.title = this.originalTitle;
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }
      this.observer?.disconnect();
      this.observer = null;
    }
  }
  const COMBINING_TO_TELEX = {
    "́": "s",
"̀": "f",
"̉": "r",
"̃": "x",
"̣": "j",
"̆": "w",
"̛": "w"
};
  function getTelexChar(text) {
    if (text.includes("đ") || text.includes("Đ")) return "d";
    const chars = text.normalize("NFD").split("");
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      if (COMBINING_TO_TELEX[char]) {
        return COMBINING_TO_TELEX[char];
      }
      if (char === "̂") {
        return chars[i - 1]?.toLowerCase() || "";
      }
    }
    return "";
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
  function normalizeCaptchaInputUndo(text) {
    return keepAlphanumeric(removeDiacritics(text).toLowerCase() + getTelexChar(text));
  }
  const DEBOUNCE_DELAY_MS = 30;
  const CAPTCHA_LENGTH = 5;
  const URL_PATTERNS = [
    { name: "sso-login", pattern: "/sso" },
    { name: "register", pattern: "/register" }
  ];
  const HANDLERS = {
    "sso-login": {
      inputSelector: "#ctl00_txtimgcode",
      submitSelector: "#ctl00_butLogin",
      imageSelector: "#ctl00_Image1"
    },
    register: {
      inputSelector: "#ctl02_txtimgcode",
      submitSelector: "#ctl02_btnSubmit",
      imageSelector: "#ctl02_Image1"
    }
  };
  class CaptchaHelperFeature extends Feature {
    inputEl = null;
    submitEl = null;
    currentHandler = null;
normalizeTimer = null;
handleInput = this.onInput.bind(this);
    handleKeyDown = this.onKeyDown.bind(this);
    handleBlur = this.onBlur.bind(this);
    constructor() {
      super({
        id: "captcha-helper",
        name: "Captcha Helper",
        description: "Hỗ trợ nhập captcha: tự động chuyển chữ thường, loại bỏ dấu, submit khi Enter/blur",
        urlMatch: URL_PATTERNS
      });
    }
init() {
      this.log.i("Initializing...");
      const matchName = this.matchResult?.matchName;
      if (!matchName) {
        this.log.w("No match result available");
        return;
      }
      this.currentHandler = HANDLERS[matchName];
      if (!this.currentHandler) {
        this.log.w("No handler found for:", matchName);
        return;
      }
      this.log.d(`Matched pattern: "${matchName}" at ${this.currentPath}`);
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
      }, DEBOUNCE_DELAY_MS);
    }
normalizeInput() {
      if (!this.inputEl) return;
      if (this.normalizeTimer) {
        clearTimeout(this.normalizeTimer);
        this.normalizeTimer = null;
      }
      const original = this.inputEl.value;
      const undoTelex = settings.captchaUndoTelex.getValue();
      const normalized = undoTelex ? normalizeCaptchaInputUndo(original) : normalizeCaptchaInput(original);
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
  const allFeatures = [new DynamicTitleFeature(), new CaptchaHelperFeature()];
  console.log(
    `%c🎓 SV HaUI Helper %cv${"2.0.0"}`,
    "color: #667eea; font-size: 20px; font-weight: bold;",
    "color: #764ba2; font-size: 14px;"
  );
  async function main() {
    log$3.i("Initializing...");
    featureManager.registerAll(allFeatures);
    await featureManager.initAll();
    log$3.i("✅ Ready!");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }

})();