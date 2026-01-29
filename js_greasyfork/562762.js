// ==UserScript==
// @name         SV HaUI Helper
// @namespace    https://github.com/vuquan2005/svHaUI-Helper
// @version      2.3.0
// @author       VuQuan
// @description  Nâng cao trải nghiệm cho sinh viên HaUI
// @license      GPL-3.0-only
// @icon         https://cdn-001.haui.edu.vn//img/logo-45x45.png
// @homepageURL  https://github.com/vuquan2005/svHaUI-Helper
// @supportURL   https://github.com/vuquan2005/svHaUI-Helper/issues
// @match        https://sv.haui.edu.vn/*
// @grant        GM.addValueChangeListener
// @grant        GM.deleteValue
// @grant        GM.deleteValues
// @grant        GM.getValue
// @grant        GM.getValues
// @grant        GM.listValues
// @grant        GM.removeValueChangeListener
// @grant        GM.setValue
// @grant        GM.setValues
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562762/SV%20HaUI%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/562762/SV%20HaUI%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const e = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  e(" .sv-grade-nav{float:right;display:inline-flex;gap:8px;align-items:center;margin-top:-2px;position:relative}.sv-grade-nav-link{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:4px;text-decoration:none;font-size:13px;font-weight:500;color:#5a6fd6;background:#667eea26;border:1px solid rgba(102,126,234,.25);transition:all .2s ease}@media(max-width:520px){.sv-grade-nav-link-label{display:none}}.sv-grade-nav-link:hover{background:#667eea;color:#fff;border-color:#667eea;text-decoration:none}.sv-grade-nav-link.active{background:#667eea;color:#fff;border-color:#667eea;pointer-events:none;cursor:default}.sv-survey-autofill>td{cursor:pointer;transition:background-color .2s ease;position:relative}.sv-survey-autofill>td:hover{background-color:#0000000d} ");

  console.log(
    `%c 🎓 SV HaUI Helper %c 🚀 v${"2.3.0"} %c 🕒 ${"260128195407"} %c 👨‍💻 VuQuan %c
%c✨ Cảm thấy hữu ích? Hãy ủng hộ mình nhé! 👇
%c🏦 TPBank: 07602987000 (VU VIET QUAN)
%c👉 QR Scan: https://img.vietqr.io/image/TPB-07602987000-qr_only.png`,
    "background: #42639e; color: #fff; padding: 5px 10px; border-radius: 6px 0 0 6px; font-weight: bold; font-size: 14px; margin-top: 5px;",
    "background: #3182ce; color: #fff; padding: 5px 10px; font-weight: bold; font-size: 14px; margin-top: 5px;",
    "background: #dd6b20; color: #fff; padding: 5px 10px; font-weight: bold; font-size: 14px; margin-top: 5px;",
    "background: #9279c9; color: #fff; padding: 5px 10px; border-radius: 0 6px 6px 0; font-weight: bold; font-size: 14px; margin-top: 5px;",
    "",
    "color: #c56798; font-size: 13px; font-weight: bold; margin-top: 12px; margin-bottom: 3px;",
    "color: #3aac77; font-size: 14px; font-weight: bold; margin-bottom: 3px;",
    "color: #5092d7; font-size: 13px; font-weight: bold; margin-bottom: 5px;"
  );
  const LOG_LEVEL_PRIORITY = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    none: 4
  };
  const LEVEL_STYLES = {
    debug: "color: #7a6a96ff",
    info: "color: #418aff",
    warn: "color: #f5a317; font-weight: 500",
    error: "color: #EF4444; font-weight: bold"
  };
  const LEVEL_ICONS = {
    debug: "👾",
    info: "ℹ️",
    warn: "",
    error: ""
  };
  let globalMinLevel = "debug";
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
  const log$1 = new Logger({ prefix: "HaUI" });
  function createLogger(name) {
    return log$1.child(name);
  }
  class WindowLocationWrapper {
    constructor(location = window.location) {
      this.location = location;
    }
get href() {
      return this.location.href;
    }
get origin() {
      return this.location.origin;
    }
get rawPath() {
      return this.location.pathname;
    }
get path() {
      const p = this.location.pathname;
      return p === "/" ? "/" : p.replace(/\/+$/, "");
    }
get search() {
      return this.location.search;
    }
get pathAndQuery() {
      return this.path + this.search;
    }
  }
  const browserLocation = new WindowLocationWrapper();
  var _GM = (() => typeof GM != "undefined" ? GM : void 0)();
  var _GM_addValueChangeListener = (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_deleteValue = (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_listValues = (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
  var _GM_removeValueChangeListener = (() => typeof GM_removeValueChangeListener != "undefined" ? GM_removeValueChangeListener : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const StorageAPI = {
async getValue(key, defaultValue) {
      if (_GM?.getValue) {
        return _GM.getValue(key, defaultValue);
      }
      if (typeof _GM_getValue === "function") {
        return _GM_getValue(key, defaultValue);
      }
      throw new Error("GM.getValue/GM_getValue is not available!");
    },
async setValue(key, value) {
      if (_GM?.setValue) {
        return _GM.setValue(key, value);
      }
      if (typeof _GM_setValue === "function") {
        _GM_setValue(key, value);
        return;
      }
      throw new Error("GM.setValue/GM_setValue is not available!");
    },
async deleteValue(key) {
      if (_GM?.deleteValue) {
        return _GM.deleteValue(key);
      }
      if (typeof _GM_deleteValue === "function") {
        _GM_deleteValue(key);
        return;
      }
      throw new Error("GM.deleteValue/GM_deleteValue is not available!");
    },
async listValues() {
      if (_GM?.listValues) {
        return _GM.listValues();
      }
      if (typeof _GM_listValues === "function") {
        return _GM_listValues();
      }
      throw new Error("GM.listValues/GM_listValues is not available!");
    },

async getValues(keysOrDefaults) {
      if (_GM?.getValues) {
        return _GM.getValues(keysOrDefaults);
      }
      if (Array.isArray(keysOrDefaults)) {
        const results = await Promise.all(
          keysOrDefaults.map(async (key) => ({
            key,
            value: await StorageAPI.getValue(key)
          }))
        );
        return results.reduce(
          (acc, { key, value }) => {
            acc[key] = value;
            return acc;
          },
          {}
        );
      } else {
        const entries = Object.entries(keysOrDefaults);
        const results = await Promise.all(
          entries.map(async ([key, defaultValue]) => ({
            key,
            value: await StorageAPI.getValue(key, defaultValue)
          }))
        );
        return results.reduce(
          (acc, { key, value }) => {
            acc[key] = value;
            return acc;
          },
          {}
        );
      }
    },
async setValues(values) {
      if (_GM?.setValues) {
        return _GM.setValues(values);
      }
      await Promise.all(
        Object.entries(values).map(([key, value]) => StorageAPI.setValue(key, value))
      );
    },
async deleteValues(keys) {
      if (_GM?.deleteValues) {
        return _GM.deleteValues(keys);
      }
      await Promise.all(keys.map((key) => StorageAPI.deleteValue(key)));
    },
async addValueChangeListener(key, callback) {
      if (_GM?.addValueChangeListener) {
        return _GM.addValueChangeListener(key, callback);
      }
      if (typeof _GM_addValueChangeListener === "function") {
        return _GM_addValueChangeListener(key, callback);
      }
      throw new Error("GM.addValueChangeListener/GM_addValueChangeListener is not available!");
    },
async removeValueChangeListener(listenerId) {
      if (_GM?.removeValueChangeListener) {
        _GM.removeValueChangeListener(listenerId);
        return;
      }
      if (typeof _GM_removeValueChangeListener === "function") {
        _GM_removeValueChangeListener(listenerId);
        return;
      }
      throw new Error(
        "GM.removeValueChangeListener/GM_removeValueChangeListener is not available!"
      );
    }
  };
  class ScopedStorage {
    prefix;
static SEPARATOR = ".";
constructor(scopeName) {
      this.prefix = scopeName ? `${scopeName}${ScopedStorage.SEPARATOR}` : "";
    }
getFullKey(key) {
      return `${this.prefix}${key}`;
    }
getLocalKey(fullKey) {
      return fullKey.substring(this.prefix.length);
    }
async get(key, defaultValue) {
      return StorageAPI.getValue(this.getFullKey(key), defaultValue);
    }
async getMultiple(input) {
      let payload;
      if (Array.isArray(input)) {
        payload = input.map((k) => this.getFullKey(k));
      } else {
        payload = {};
        for (const [key, value] of Object.entries(input)) {
          payload[this.getFullKey(key)] = value;
        }
      }
      const rawResult = await StorageAPI.getValues(payload);
      const result = {};
      for (const [fullKey, value] of Object.entries(rawResult)) {
        if (fullKey.startsWith(this.prefix)) {
          const localKey = this.getLocalKey(fullKey);
          result[localKey] = value;
        }
      }
      return result;
    }
async set(key, value) {
      await StorageAPI.setValue(this.getFullKey(key), value);
    }
async setMultiple(values) {
      const prefixedValues = {};
      for (const [key, value] of Object.entries(values)) {
        prefixedValues[this.getFullKey(key)] = value;
      }
      await StorageAPI.setValues(prefixedValues);
    }
async delete(key) {
      await StorageAPI.deleteValue(this.getFullKey(key));
    }
async deleteMultiple(keys) {
      await StorageAPI.deleteValues(keys.map((k) => this.getFullKey(k)));
    }
async keys() {
      const allGlobalKeys = await StorageAPI.listValues();
      return allGlobalKeys.filter((key) => key.startsWith(this.prefix)).map((key) => this.getLocalKey(key));
    }
async has(key) {
      const sentinel = "aHR0cHM6Ly9pbWcudmlldHFyLmlvL2ltYWdlL1RQQi0wNzYwMjk4NzAwMC1xcl9vbmx5LnBuZz9hZGRJbmZvPUVhc3RlciUyMEVnZw==";
      const value = await StorageAPI.getValue(this.getFullKey(key), sentinel);
      return value !== sentinel;
    }
async entries() {
      const keys = await this.keys();
      if (keys.length === 0) {
        return {};
      }
      return this.getMultiple(keys);
    }
async clear() {
      const keys = await this.keys();
      if (keys.length > 0) {
        await this.deleteMultiple(keys);
      }
    }
async onValueChange(key, callback) {
      const requestedKey = key;
      return StorageAPI.addValueChangeListener(
        this.getFullKey(key),
        (_key, oldValue, newValue, remote) => {
          callback(requestedKey, oldValue, newValue, remote);
        }
      );
    }
async removeValueChangeListener(listenerId) {
      await StorageAPI.removeValueChangeListener(listenerId);
    }
  }
  class Feature {


location = browserLocation;


id;
    name;
    description;
    priority;
    urlMatch;
    _log;
    _storage;
get log() {
      return this._log ??= createLogger(this.name);
    }
    get storage() {
      return this._storage ??= new ScopedStorage("feat:" + this.id);
    }
matchResult = null;
    constructor(config) {
      this.id = config.id;
      this.name = config.name;
      this.description = config.description;
      this.priority = config.priority ?? 0;
      this.urlMatch = config.urlMatch;
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
        return this.location.path === pattern;
      }
      return pattern.test(this.location.pathAndQuery);
    }
shouldRun() {
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
cleanup() {
    }
  }
  const log = createLogger("FeatureManager");
  class FeatureManager {
    features = new Map();
    running = new Set();
    isApplying = false;
    pendingApply = false;
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
async _executeStart(feature) {
      try {
        log.d(`Starting: ${feature.name}`);
        await feature.run();
        this.running.add(feature.id);
        log.i(`✅ Started: ${feature.name}`);
        return true;
      } catch (error) {
        log.e(`Error starting "${feature.name}":`, error);
        return false;
      }
    }
_executeStop(feature) {
      try {
        feature.cleanup();
        this.running.delete(feature.id);
        log.i(`🛑 Stopped: ${feature.name}`);
        return true;
      } catch (error) {
        log.e(`Error stopping "${feature.name}":`, error);
        return false;
      }
    }
async applyFeatures() {
      if (this.isApplying) {
        log.d("applyFeatures already in progress, queuing...");
        this.pendingApply = true;
        return;
      }
      this.isApplying = true;
      log.d("Applying features...");
      try {
        const sortedFeatures = [...this.features.entries()].sort(
          ([, a], [, b]) => b.priority - a.priority
        );
        for (const [id, feature] of sortedFeatures) {
          if (!this.running.has(id)) continue;
          const shouldRun = feature.shouldRun();
          if (
!shouldRun
          ) {
            const reason = !shouldRun ? "URL mismatch" : "Disabled";
            log.d(`Stopping ${feature.name} (Reason: ${reason})`);
            this._executeStop(feature);
          }
        }
        for (const [id, feature] of sortedFeatures) {
          if (this.running.has(id)) continue;
          if (!feature.shouldRun()) {
            continue;
          }
          await this._executeStart(feature);
        }
        log.i(`✅ Running ${this.running.size}/${this.features.size} features`);
      } finally {
        this.isApplying = false;
        if (this.pendingApply) {
          this.pendingApply = false;
          log.d("Running pending applyFeatures...");
          await this.applyFeatures();
        }
      }
    }
get(id) {
      return this.features.get(id);
    }
getAll() {
      return Array.from(this.features.values());
    }
isRunning(id) {
      return this.running.has(id);
    }
    getAllIds() {
      return Array.from(this.features.keys());
    }
    getAllRunningIds() {
      return Array.from(this.running.values());
    }
    getAllNotRunningIds() {
      return Array.from(this.features.keys()).filter((id) => !this.running.has(id));
    }
async startFeature(id) {
      if (this.isApplying) {
        log.w("Cannot manually start feature while features are being applied");
        return false;
      }
      const feature = this.features.get(id);
      if (!feature) {
        log.w(`Feature "${id}" not found`);
        return false;
      }
      if (this.running.has(id)) {
        log.d(`Feature "${feature.name}" is already running`);
        return false;
      }
      return this._executeStart(feature);
    }
stopFeature(id) {
      if (this.isApplying) {
        log.w("Cannot manually stop feature while features are being applied");
        return false;
      }
      const feature = this.features.get(id);
      if (!feature) {
        log.w(`Feature "${id}" not found`);
        return false;
      }
      if (!this.running.has(id)) {
        log.d(`Feature "${feature.name}" is not running`);
        return false;
      }
      return this._executeStop(feature);
    }
  }
  const featureManager = new FeatureManager();
  function observeDomUntil(target, checkCallback, options = {}) {
    return new Promise((resolve) => {
      const element = document.querySelector(target);
      if (!element) {
        resolve({ success: false, code: "NOT_FOUND" });
        return;
      }
      const {
        debounceMs = 50,
        timeoutMs = 1e4,
        config = { childList: true, subtree: true },
        signal
      } = options;
      if (signal?.aborted) {
        resolve({ success: false, code: "ABORT" });
        return;
      }
      let debounceTimer = null;
      let timeoutTimer = null;
      let observer = null;
      let done = false;
      const finish = (result) => {
        if (done) return;
        done = true;
        if (debounceTimer) clearTimeout(debounceTimer);
        if (timeoutTimer) clearTimeout(timeoutTimer);
        observer?.disconnect();
        observer = null;
        signal?.removeEventListener("abort", onAbort);
        resolve(result);
      };
      const onAbort = () => finish({ success: false, code: "ABORT" });
      signal?.addEventListener("abort", onAbort, { once: true });
      Promise.resolve(checkCallback()).then((ok) => {
        if (ok) finish({ success: true, code: "OK" });
      }).catch((err) => {
        console.warn("observeDomUntil initial check error:", err);
        finish({ success: false, code: "ERROR" });
      });
      if (timeoutMs > 0) {
        timeoutTimer = setTimeout(() => {
          finish({ success: false, code: "TIMEOUT" });
        }, timeoutMs);
      }
      observer = new MutationObserver(() => {
        if (done) return;
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          if (done || signal?.aborted) return;
          try {
            const shouldStop = await checkCallback();
            if (shouldStop) {
              finish({ success: true, code: "OK" });
            }
          } catch (error) {
            console.warn("observeDomUntil callback error:", error);
            finish({ success: false, code: "ERROR" });
          }
        }, debounceMs);
      });
      observer.observe(element, config);
    });
  }
  const URL_TITLE_MAP = {
"/": "🏠 Trang chủ",
"/student/recharge/cashinqr": "💳 Nạp tiền QR",
    "/student/recharge/cashin": "💳 Nạp tiền TK",
    "/student/recharge/inpatientpayment": "💰 Thanh toán môn",
    "/student/recharge/transactionhistory": "📜 Lịch sử GD",
    "/student/recharge/listeinvoice": "🧾 Hóa đơn ĐT",
"/student/userdetail/userdetail": "👤 Thông tin SV",
    "/student/userdetail/updateuserprofile": "📝 Cập nhật hồ sơ",
    "/student/userdetail/usercerupdate": "🎓 TT in bằng",
    "/member/changepass": "🔐 Đổi mật khẩu",
    "/student/userdetail/militaryclothes": "🎖️ ĐK Quân tư trang",
    "/student/userdetail/userrevenueslist": "📂 Giấy tờ/Hồ sơ",
"/register/dangkyhocphan": "📝 ĐK HP dự kiến",
    "/register/": "📝 Đăng ký học phần",
    "/register/dangkyDAKLTN": "📝 ĐK ĐA/KLTN",
    "/training/removeclasslist": "❌ Rút HP",
    "/training/statisticregister": "📊 TThông tin đăng ký học phần",
    "/training/viewprogram": "📚 ĐK 2 chương trình",
    "/training/listprogramtwo": "📋 DS đơn CT2",
    "/training/viewmodules2": "📊 Tiến độ CT2",
"/training/viewcourseindustry": "📚 Khung CT",
    "/training/programmodulessemester": "📅 Khung theo kỳ",
"/training/viewprogramsdh": "🎓 ĐK học trước ThS",
    "/training/listprogramsdh": "📋 DS đơn ThS",
    "/training/viewmodulessdh": "📊 Tiến độ ThS",
    "/registersdh/onlineregister": "📝 ĐK HP ThS",
"/timestable/calendarct": "📆 Kế hoạch đầu khóa",
    "/timestable/calendarcl": "🗓️ Thời khóa biểu",
    "/timestable/timestableview": "🗓️ Lịch môn học",
"/student/schedulefees/examplant": "📆 Kế hoạch thi",
    "/student/schedulefees/transactionmodules": "📆 Lịch thi",
    "/student/schedulefees/testonline": "💻 Thi Online",
    "/student/schedulefees/testonlineqpan": "🛡️ Thi QP&AN Online",
    "/student/schedulefees/dakltnonline": "🛡️ BV ĐA/KLTN Online",
"/student/result/studyresults": "📊 KQ học tập",
    "/student/result/examresult": "📋 KQ thi",
    "/student/result/viewscorebysemester": "📈 ĐTB học kỳ",
    "/student/result/viewmodules": "📈 ĐTB tích lũy",
    "/student/result/sendreceiveapplications": "📨 Phúc khảo",
    "/student/result/sendexamreview": "👁️ Xem lại bài",
"/tttn/htdn/list": "🎓 Thực tập TN",
    "/student/result/graduatecal": "🎓 Xét tốt nghiệp",
    "/student/result/degreeview": "🎓 Xác nhận thông tin in bằng",
    "/student/result/degreeprint": "🖨️ Bản in bằng",
"/student/application/advertiselist": "💼 Việc làm & HT",
"/student/application/notifilist": "📢 Thông báo trường",
    "/student/application/messengeruserlist": "📬 Thông báo cá nhân",
    "/student/recharge/serviceonegate": "🚪 Dịch vụ một cửa",
    "/messages": "💬 Chia sẻ lớp",
    "/messages/group": "💬 Chia sẻ trường",
    "/messages/listclass": "💬 Trao đổi lớp HP",
    "/study": "📖 Học trực tuyến",
    "/sso/qpan": "🛡️ GD QP&AN",
    "/sso/dlearning": "🌐 Đào tạo từ xa",
    "/survey": "📝 Khảo sát",
    "/student/evaluation/listsemester": "⭐ ĐG rèn luyện",
    "/sso/btl": "📄 KT luận văn",
    "/STSV2023/index.html": "📘 Sổ tay SV",
    "/student/application/sotayantoan": "📘 Sổ tay an toàn",
    "/student/application/hddanhgiaketquahoctap": "📘 HD đánh giá KQ"
  };
  const TITLE_UPDATE_DEBOUNCE_MS = 100;
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
    abortController = null;
    constructor() {
      super({
        id: "dynamic-title",
        name: "Dynamic Title",
        description: "Thay đổi tiêu đề tab dựa trên trang đang xem"
      });
    }
run() {
      this.originalTitle = document.title;
      this.abortController = new AbortController();
      observeDomUntil(".be-content", () => this.updateTitle(), {
        debounceMs: TITLE_UPDATE_DEBOUNCE_MS,
        signal: this.abortController.signal
      }).then((result) => {
        if (result.success) {
          this.log.d("Title found, stopping observer");
        } else if (result.code !== "ABORT") {
          this.log.d(`Observer stopped with code: ${result.code}`);
        }
      });
    }
updateTitle() {
      const pathAndQuery = this.location.pathAndQuery;
      const pathname = this.location.path;
      const staticTitle = URL_TITLE_MAP[pathname];
      if (staticTitle) {
        this.setTitle(staticTitle);
        return true;
      }
      for (const config of DYNAMIC_URL_PATTERNS) {
        if (config.pattern.test(pathAndQuery)) {
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
        this.setTitle(`📄 ${panelHeader}`);
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
cleanup() {
      document.title = this.originalTitle;
      if (this.abortController) {
        this.abortController.abort();
        this.abortController = null;
      }
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
  const URL_PATTERNS$1 = [
    { name: "sso-login", pattern: "/sso" },
    { name: "register", pattern: "/register" }
  ];
  const HANDLERS = {
    "sso-login": {
      inputSelector: '[id^="ctl"][id$="_txtimgcode"]',
      submitSelector: '[id^="ctl"][id$="_butLogin"]',
      imageSelector: '[id^="ctl"][id$="_Image1"]'
    },
    register: {
      inputSelector: '[id^="ctl"][id$="_txtimgcode"]',
      submitSelector: '[id^="ctl"][id$="_btnSubmit"]',
      imageSelector: '[id^="ctl"][id$="_Image1"]'
    }
  };
  class CaptchaHelperFeature extends Feature {
    inputEl = null;
    submitEl = null;
    currentHandler = null;
    isUndoTelex;
    undoTelexListenerId = null;
normalizeTimer = null;
handleInput = this.onInput.bind(this);
    handleKeyDown = this.onKeyDown.bind(this);
    handleBlur = this.onBlur.bind(this);
    constructor() {
      super({
        id: "captcha-helper",
        name: "Captcha Helper",
        description: "Hỗ trợ nhập captcha: tự động chuyển chữ thường, loại bỏ dấu, submit khi Enter/blur",
        urlMatch: URL_PATTERNS$1
      });
    }
async run() {
      this.isUndoTelex = await this.storage.get("undoTelex", false);
      this.undoTelexListenerId = await this.storage.onValueChange(
        "undoTelex",
        (_key, _old, newVal) => {
          this.isUndoTelex = !!newVal;
          this.log.d("Settings updated:", { isUndoTelex: this.isUndoTelex });
        }
      );
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
      this.log.d(`Matched pattern: "${matchName}" at ${this.location.path}`);
      this.inputEl = document.querySelector(this.currentHandler.inputSelector);
      this.submitEl = document.querySelector(this.currentHandler.submitSelector);
      if (!this.inputEl) {
        this.log.w("Captcha input not found:", this.currentHandler.inputSelector);
        return;
      } else this.log.d("Captcha input found:", this.inputEl.getAttribute("id"));
      if (!this.submitEl) {
        this.log.w("Submit button not found:", this.currentHandler.submitSelector);
        return;
      } else this.log.d("Submit button found:", this.submitEl.getAttribute("id"));
      this.inputEl.addEventListener("input", this.handleInput);
      this.inputEl.addEventListener("keydown", this.handleKeyDown);
      this.inputEl.addEventListener("blur", this.handleBlur);
      this.inputEl.focus();
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
      const normalized = this.isUndoTelex ? normalizeCaptchaInputUndo(original) : normalizeCaptchaInput(original);
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
cleanup() {
      if (this.undoTelexListenerId !== null) {
        this.storage.removeValueChangeListener(this.undoTelexListenerId);
        this.undoTelexListenerId = null;
      }
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
  const cssPrefix$1 = "sv-grade-nav";
  const styles$1 = {
    cssPrefix: cssPrefix$1
  };
  const CSS_PREFIX = styles$1.cssPrefix;
  const URL_PATTERNS = [
{ name: "personal-study", pattern: /^\/student\/result\/studyresults$/ },
    { name: "personal-exam", pattern: /^\/student\/result\/examresult$/ },
{ name: "friend-study", pattern: /^\/student\/result\/viewstudyresult/ },
    { name: "friend-exam", pattern: /^\/student\/result\/viewexamresult/ },
{ name: "class-study", pattern: /^\/student\/result\/viewstudyresultclass/ },
    { name: "class-exam", pattern: /^\/student\/result\/viewexamresultclass/ }
  ];
  class GradeNavigationFeature extends Feature {
    navElement = null;
    constructor() {
      super({
        id: "grade-navigation",
        name: "Grade Navigation",
        description: "Điều hướng nhanh giữa trang Điểm TX và Điểm thi",
        urlMatch: URL_PATTERNS
      });
    }
    run() {
      const navLinks = this.generateNavLinks();
      if (navLinks.length === 0) {
        this.log.w("No nav links generated for current URL");
        return;
      }
      const panelHeading = document.querySelector(".panel-heading.panel-heading-divider");
      if (!panelHeading) {
        this.log.w("Panel heading not found");
        return;
      }
      this.navElement = this.createNavElement(navLinks);
      panelHeading.insertBefore(this.navElement, panelHeading.firstChild);
    }
generateNavLinks() {
      const pathname = this.location.path;
      const search = this.location.search;
      const mappings = [
{
          type: "class",
          study: "viewstudyresultclass",
          exam: "viewexamresultclass",
          useParams: true
        },
{ type: "friend", study: "viewstudyresult", exam: "viewexamresult", useParams: true },
{ type: "personal", study: "studyresults", exam: "examresult", useParams: false }
      ];
      const config = mappings.find(
        (m) => pathname.includes(m.study) || pathname.includes(m.exam)
      );
      if (!config) return [];
      const isStudy = pathname.includes(config.study);
      const isExam = !isStudy;
      const targetPath = isStudy ? pathname.replace(config.study, config.exam) : pathname.replace(config.exam, config.study);
      const query = config.useParams ? search : "";
      return [
        {
          label: "Điểm TX",
          icon: "📊",
          url: (isStudy ? pathname : targetPath) + query,
          isActive: isStudy,
          description: "Xem kết quả học tập"
        },
        {
          label: "Điểm thi",
          icon: "📋",
          url: (isExam ? pathname : targetPath) + query,
          isActive: isExam,
          description: "Xem kết quả thi"
        }
      ];
    }
createNavElement(links) {
      const container = document.createElement("span");
      container.className = CSS_PREFIX;
      for (const link of links) {
        const a = document.createElement("a");
        a.href = link.url;
        a.title = link.description;
        a.className = `${CSS_PREFIX}-link${link.isActive ? " active" : ""}`;
        const icon = document.createElement("span");
        icon.className = `${CSS_PREFIX}-link-icon`;
        icon.textContent = link.icon;
        const label = document.createElement("span");
        label.className = `${CSS_PREFIX}-link-label`;
        label.textContent = link.label;
        a.appendChild(icon);
        a.appendChild(label);
        container.appendChild(a);
      }
      return container;
    }
cleanup() {
      this.navElement?.remove();
      this.navElement = null;
    }
  }
  const cssPrefix = "sv-survey-autofill";
  const styles = {
    cssPrefix
  };
  class SurveyAutofillFeature extends Feature {
    constructor() {
      super({
        id: "survey-autofill",
        name: "Survey Autofill",
        description: "Đánh giá nhanh bằng cách click vào tiêu đề cột điểm",
        urlMatch: /^\/survey\/view/
      });
    }
    run() {
      this.waitForTable();
    }
waitForTable() {
      const check = () => {
        const table = document.querySelector("div#kbox.modal-content table.table-striped");
        if (table) {
          this.log.d("Attached click listeners to survey headers: ", table);
          this.attachListeners(table);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    }
    attachListeners(table) {
      const headerRow = table.querySelector("thead > tr:nth-child(2)");
      if (!headerRow) {
        this.log.w("Header row not found");
        return;
      }
      const cells = headerRow.querySelectorAll("td");
      if (cells.length < 5) {
        this.log.w("Not enough header cells found");
        return;
      }
      headerRow.classList.add(styles.cssPrefix);
      cells.forEach((cell, index) => {
        const score = index + 1;
        cell.title = `Click để chọn tất cả mục ${score} điểm`;
        cell.addEventListener("click", () => {
          this.fillColumn(table, score);
        });
      });
      this.log.d("Attached click listeners to survey headers");
    }
    fillColumn(table, score) {
      const selector = `input[type="radio"][id$="_${score}"]`;
      const radios = table.querySelectorAll(selector);
      let count = 0;
      radios.forEach((radio) => {
        if (radio instanceof HTMLInputElement) {
          radio.click();
          radio.checked = true;
          count++;
        } else this.log.w("Radio not found");
      });
      this.log.d(`Selected score ${score} for ${count} questions`);
    }
  }
  const allFeatures = [
    new DynamicTitleFeature(),
    new CaptchaHelperFeature(),
    new GradeNavigationFeature(),
    new SurveyAutofillFeature()
  ];
  async function main() {
    log$1.i("Initializing...");
    featureManager.registerAll(allFeatures);
    await featureManager.applyFeatures();
    log$1.i("✅ Ready!");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }

})();