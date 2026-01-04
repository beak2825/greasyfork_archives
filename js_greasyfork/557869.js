// ==UserScript==
// @name             斗鱼全民星推荐自动领取max
// @namespace        http://tampermonkey.net/
// @version          1.7
// @author           yqqxybm
// @description      斗鱼全民星推荐自动领取pro版的基础上加上了红包筛选（区分全部红包与首个红包）
// @license          MIT
// @match            *://www.douyu.com/*
// @connect          list-www.douyu.com
// @grant            GM_addStyle
// @grant            GM_cookie
// @grant            GM_deleteValue
// @grant            GM_getValue
// @grant            GM_log
// @grant            GM_openInTab
// @grant            GM_setValue
// @grant            GM_xmlhttpRequest
// @grant            window.close
// @run-at           document-idle
// @original-author  ysl-ovo (https://greasyfork.org/zh-CN/users/1453821-ysl-ovo)
// @downloadURL https://update.greasyfork.org/scripts/557869/%E6%96%97%E9%B1%BC%E5%85%A8%E6%B0%91%E6%98%9F%E6%8E%A8%E8%8D%90%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96max.user.js
// @updateURL https://update.greasyfork.org/scripts/557869/%E6%96%97%E9%B1%BC%E5%85%A8%E6%B0%91%E6%98%9F%E6%8E%A8%E8%8D%90%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96max.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  const BUILD_CONFIG = {
    IS_PUBLIC_RELEASE: false, // 发布前改为 true：将隐藏一键挂机按钮
    SHOW_ANTI_SCAM: false      // 显示反诈骗/免费声明
  };

  const CONFIG = {
SCRIPT_PREFIX: "[全民星推荐助手]",
CONTROL_ROOM_ID: "36252",
TEMP_CONTROL_ROOM_RID: "36252",

POPUP_WAIT_TIMEOUT: 2e4,
PANEL_WAIT_TIMEOUT: 1e4,
ELEMENT_WAIT_TIMEOUT: 3e4,
RED_ENVELOPE_LOAD_TIMEOUT: 15e3,
MIN_DELAY: 1e3,
MAX_DELAY: 2500,
CLOSE_TAB_DELAY: 1500,
INITIAL_SCRIPT_DELAY: 3e3,
UNRESPONSIVE_TIMEOUT: 15 * 60 * 1e3,
SWITCHING_CLEANUP_TIMEOUT: 3e4,
HEALTHCHECK_INTERVAL: 1e4,
DISCONNECTED_GRACE_PERIOD: 1e4,

DRAGGABLE_BUTTON_ID: "douyu-qmx-starter-button",
BUTTON_POS_STORAGE_KEY: "douyu_qmx_button_position",
MODAL_DISPLAY_MODE: "floating",

API_URL: "https://www.douyu.com/japi/livebiznc/web/anchorstardiscover/redbag/square/list",
COIN_LIST_URL: "https://www.douyu.com/japi/livebiznc/web/anchorstardiscover/coin/record/list",
API_RETRY_COUNT: 3,
  API_RETRY_DELAY: 5e3,
  MIN_RED_ENVELOPE_NUM: 0,
// 是否筛选“房间内全部红包”(开启后：只要房间里存在满足阈值的红包就会等待；关闭则仅判断当前最先开抢的那个红包)
FILTER_ALL_RED_ENVELOPES: false,

MAX_WORKER_TABS: 24,
DAILY_LIMIT_ACTION: "CONTINUE_DORMANT",
AUTO_PAUSE_ENABLED: true,

// 一键挂机配置
AUTO_FILL_CHECK_INTERVAL: 5000,       // 基础检查间隔 5秒
AUTO_FILL_SEARCH_RETRY_BASE: 30000,   // 找不到房间时基础重试间隔 30秒
AUTO_FILL_SEARCH_RETRY_MAX: 120000,   // 最大重试间隔 2分钟
AUTO_FILL_OPEN_DELAY: 2000,           // 每次打开房间的间隔 2秒
AUTO_FILL_STORAGE_KEY: "douyu_qmx_auto_fill_enabled",
AUTO_PAUSE_DELAY_AFTER_ACTION: 5e3,
CALIBRATION_MODE_ENABLED: false,
SHOW_STATS_IN_PANEL: false,

STATE_STORAGE_KEY: "douyu_qmx_dashboard_state",
DAILY_LIMIT_REACHED_KEY: "douyu_qmx_daily_limit_reached",
STATS_INFO_STORAGE_KEY: "douyu_qmx_stats",

DEFAULT_THEME: "dark",
    INJECT_TARGET_RETRIES: 10,
INJECT_TARGET_INTERVAL: 500,
API_ROOM_FETCH_COUNT: 10,
UI_FEEDBACK_DELAY: 2e3,
DRAG_BUTTON_DEFAULT_PADDING: 20,
CONVERT_LEGACY_POSITION: true,


SELECTORS: {
      redEnvelopeContainer: "#layout-Player-aside div.LiveNewAnchorSupportT-enter",
countdownTimer: "span.LiveNewAnchorSupportT-enter--bottom",
popupModal: "body > div.LiveNewAnchorSupportT-pop",
openButton: "div.LiveNewAnchorSupportT-singleBag--btnOpen",
closeButton: "div.LiveNewAnchorSupportT-pop--close",
criticalElement: "#js-player-video",
pauseButton: "div.pause-c594e8:not(.removed-9d4c42)",
playButton: "div.play-8dbf03:not(.removed-9d4c42)",
rewardSuccessIndicator: ".LiveNewAnchorSupportT-singleBagOpened",
limitReachedPopup: "div.dy-Message-custom-content.dy-Message-info",
rankListContainer: "#layout-Player-aside > div.layout-Player-asideMainTop > div.layout-Player-rank",
anchorName: "div.Title-anchorName > h2.Title-anchorNameH2"
}
  };
  const SettingsManager = {
    STORAGE_KEY: "douyu_qmx_user_settings",
get() {
      const userSettings = GM_getValue(this.STORAGE_KEY, {});
      const themeSetting = GM_getValue(
        "douyu_qmx_theme",
        CONFIG.DEFAULT_THEME
      );
      return Object.assign({}, CONFIG, userSettings, { THEME: themeSetting });
    },
save(settingsToSave) {
      const theme = settingsToSave.THEME;
      delete settingsToSave.THEME;
      GM_setValue("douyu_qmx_theme", theme);
      GM_setValue(this.STORAGE_KEY, settingsToSave);
    },
reset() {
      GM_deleteValue(this.STORAGE_KEY);
      GM_deleteValue("douyu_qmx_theme");
    }
  };
  const SETTINGS = SettingsManager.get();
  SETTINGS.THEME = GM_getValue("douyu_qmx_theme", SETTINGS.DEFAULT_THEME);
  const STATE = {
    isSwitchingRoom: false,
    lastActionTime: 0
  };
  const Utils = {
log(message) {
      const logMsg = `${SETTINGS.SCRIPT_PREFIX} ${message}`;
      try {
        GM_log(logMsg);
      } catch (e) {
        console.log(logMsg);
      }
    },
sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
getRandomDelay(min = SETTINGS.MIN_DELAY, max = SETTINGS.MAX_DELAY) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
getCurrentRoomId() {
      const url = window.location.href;
      let match = url.match(/douyu\.com\/(?:beta\/)?(\d+)/);
      if (match && match[1]) {
        return match[1];
      }
      match = url.match(/rid=(\d+)/);
      if (match && match[1]) {
        return match[1];
      }
      return null;
    },
formatTime(totalSeconds) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const paddedMinutes = String(minutes).padStart(2, "0");
      const paddedSeconds = String(seconds).padStart(2, "0");
      return `${paddedMinutes}:${paddedSeconds}`;
    },
getBeijingTime() {
      const now = new Date();
      const utcMillis = now.getTime();
      const beijingMillis = utcMillis + 8 * 60 * 60 * 1e3;
      return new Date(beijingMillis);
    },
formatDateAsBeijing(date) {
      const beijingDate = new Date(date.getTime() + 8 * 60 * 60 * 1e3);
      const year = beijingDate.getUTCFullYear();
      const month = String(beijingDate.getUTCMonth() + 1).padStart(2, "0");
      const day = String(beijingDate.getUTCDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
lockChecker: function(lockKey, callback, ...args) {
      if (GM_getValue(lockKey, false)) {
        setTimeout(() => callback(...args), 50);
        return false;
      }
      return true;
    },
setLocalValueWithLock: function(lockKey, storageKey, value, nickname) {
      try {
        GM_setValue(lockKey, true);
        GM_setValue(storageKey, value);
      } catch (e) {
        Utils.log(`[${nickname}-写] 严重错误：GM_setValue 写入失败！ 错误信息: ${e.message}`);
      } finally {
        GM_setValue(lockKey, false);
      }
    }
  };
  function initHackTimer(workerScript) {
    try {
      var blob = new Blob([
        "                var fakeIdToId = {};                onmessage = function (event) {                    var data = event.data,                        name = data.name,                        fakeId = data.fakeId,                        time;                    if(data.hasOwnProperty('time')) {                        time = data.time;                    }                    switch (name) {                        case 'setInterval':                            fakeIdToId[fakeId] = setInterval(function () {                                postMessage({fakeId: fakeId});                            }, time);                            break;                        case 'clearInterval':                            if (fakeIdToId.hasOwnProperty (fakeId)) {                                clearInterval(fakeIdToId[fakeId]);                                delete fakeIdToId[fakeId];                            }                            break;                        case 'setTimeout':                            fakeIdToId[fakeId] = setTimeout(function () {                                postMessage({fakeId: fakeId});                                if (fakeIdToId.hasOwnProperty (fakeId)) {                                    delete fakeIdToId[fakeId];                                }                            }, time);                            break;                        case 'clearTimeout':                            if (fakeIdToId.hasOwnProperty (fakeId)) {                                clearTimeout(fakeIdToId[fakeId]);                                delete fakeIdToId[fakeId];                            }                            break;                    }                }                "
      ]);
      workerScript = window.URL.createObjectURL(blob);
    } catch (error) {
    }
    var worker, fakeIdToCallback = {}, lastFakeId = 0, maxFakeId = 2147483647, logPrefix = "HackTimer.js by turuslan: ";
    if (typeof Worker !== "undefined") {
      let getFakeId = function() {
        do {
          if (lastFakeId == maxFakeId) {
            lastFakeId = 0;
          } else {
            lastFakeId++;
          }
        } while (fakeIdToCallback.hasOwnProperty(lastFakeId));
        return lastFakeId;
      };
      try {
        worker = new Worker(workerScript);
        window.setInterval = function(callback, time) {
          var fakeId = getFakeId();
          fakeIdToCallback[fakeId] = {
            callback,
            parameters: Array.prototype.slice.call(arguments, 2)
          };
          worker.postMessage({
            name: "setInterval",
            fakeId,
            time
          });
          return fakeId;
        };
        window.clearInterval = function(fakeId) {
          if (fakeIdToCallback.hasOwnProperty(fakeId)) {
            delete fakeIdToCallback[fakeId];
            worker.postMessage({
              name: "clearInterval",
              fakeId
            });
          }
        };
        window.setTimeout = function(callback, time) {
          var fakeId = getFakeId();
          fakeIdToCallback[fakeId] = {
            callback,
            parameters: Array.prototype.slice.call(arguments, 2),
            isTimeout: true
          };
          worker.postMessage({
            name: "setTimeout",
            fakeId,
            time
          });
          return fakeId;
        };
        window.clearTimeout = function(fakeId) {
          if (fakeIdToCallback.hasOwnProperty(fakeId)) {
            delete fakeIdToCallback[fakeId];
            worker.postMessage({
              name: "clearTimeout",
              fakeId
            });
          }
        };
        worker.onmessage = function(event) {
          var data = event.data, fakeId = data.fakeId, request, parameters, callback;
          if (fakeIdToCallback.hasOwnProperty(fakeId)) {
            request = fakeIdToCallback[fakeId];
            callback = request.callback;
            parameters = request.parameters;
            if (request.hasOwnProperty("isTimeout") && request.isTimeout) {
              delete fakeIdToCallback[fakeId];
            }
          }
          if (typeof callback === "string") {
            try {
              callback = new Function(callback);
            } catch (error) {
              console.log(logPrefix + "Error parsing callback code string: ", error);
            }
          }
          if (typeof callback === "function") {
            callback.apply(window, parameters);
          }
        };
        worker.onerror = function(event) {
          console.log(event);
        };
        console.log(logPrefix + "Initialisation succeeded");
      } catch (error) {
        console.log(logPrefix + "Initialisation failed");
        console.error(error);
      }
    } else {
      console.log(logPrefix + "Initialisation failed - HTML5 Web Worker is not supported");
    }
  }
  const ControlPanelRefactoredCss = ':root{color-scheme:light dark;--motion-easing: cubic-bezier(.4, 0, .2, 1);--status-color-waiting: #4CAF50;--status-color-claiming: #2196F3;--status-color-switching: #FFC107;--status-color-error: #F44336;--status-color-opening: #9C27B0;--status-color-dormant: #757575;--status-color-unresponsive: #FFA000;--status-color-disconnected: #BDBDBD;--status-color-stalled: #9af39dff}body[data-theme=dark]{--md-sys-color-primary: #D0BCFF;--md-sys-color-on-primary: #381E72;--md-sys-color-surface-container: #211F26;--md-sys-color-on-surface: #E6E1E5;--md-sys-color-on-surface-variant: #CAC4D0;--md-sys-color-outline: #938F99;--md-sys-color-surface-bright: #36343B;--md-sys-color-tertiary: #EFB8C8;--md-sys-color-scrim: #000000;--surface-container-highest: #3D3B42;--primary-container: #4F378B;--on-primary-container: #EADDFF}body[data-theme=light]{--md-sys-color-primary: #6750A4;--md-sys-color-on-primary: #FFFFFF;--md-sys-color-surface-container: #F3EDF7;--md-sys-color-surface-bright: #FEF7FF;--md-sys-color-on-surface: #1C1B1F;--md-sys-color-on-surface-variant: #49454F;--md-sys-color-outline: #79747E;--md-sys-color-tertiary: #7D5260;--md-sys-color-scrim: #000000;--surface-container-highest: #E6E0E9;--primary-container: #EADDFF;--on-primary-container: #21005D}.qmx-hidden{display:none!important}.qmx-modal-open-scroll-lock{overflow:hidden!important}.is-dragging{transition:none!important}.qmx-flex-center{display:flex;align-items:center;justify-content:center}.qmx-flex-between{display:flex;align-items:center;justify-content:space-between}.qmx-flex-column{display:flex;flex-direction:column}.qmx-modal-base{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.95);z-index:10001;background-color:var(--md-sys-color-surface-bright);color:var(--md-sys-color-on-surface);border-radius:28px;box-shadow:0 12px 32px #00000080;display:flex;flex-direction:column;opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s,transform .3s}.qmx-modal-base.visible{opacity:1;visibility:visible;transform:translate(-50%,-50%) scale(1)}.qmx-backdrop{position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:var(--md-sys-color-scrim);z-index:9998;opacity:0;visibility:hidden;transition:opacity .3s ease}.qmx-backdrop.visible{opacity:.5;visibility:visible}.qmx-btn{padding:10px 16px;border:1px solid var(--md-sys-color-outline);background-color:transparent;color:var(--md-sys-color-primary);border-radius:20px;font-size:14px;font-weight:500;cursor:pointer;transition:background-color .2s,transform .2s,box-shadow .2s;-webkit-user-select:none;user-select:none}.qmx-btn:hover{background-color:#d0bcff1a;transform:translateY(-2px);box-shadow:0 2px 4px #0000001a}.qmx-btn:active{transform:translateY(0) scale(.98);box-shadow:none}.qmx-btn:disabled{opacity:.5;cursor:not-allowed}.qmx-btn--primary{background-color:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);border:none}.qmx-btn--primary:hover{background-color:#c2b3ff;box-shadow:0 4px 8px #0003}.qmx-btn--danger{border-color:#f44336;color:#f44336}.qmx-btn--danger:hover{background-color:#f443361a}.qmx-btn--icon{width:36px;height:36px;padding:0;border-radius:50%;background-color:#d0bcff26;border:none;color:var(--md-sys-color-primary)}.qmx-btn--icon:hover{background-color:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);transform:scale(1.05) rotate(180deg)}.qmx-styled-list{list-style:none;padding-left:0}.qmx-styled-list li{position:relative;padding-left:20px;margin-bottom:8px}.qmx-styled-list li:before{content:"◆";position:absolute;left:0;top:2px;color:var(--md-sys-color-primary);font-size:12px}.qmx-scrollbar::-webkit-scrollbar{width:10px}.qmx-scrollbar::-webkit-scrollbar-track{background:var(--md-sys-color-surface-bright);border-radius:10px}.qmx-scrollbar::-webkit-scrollbar-thumb{background-color:var(--md-sys-color-primary);border-radius:10px;border:2px solid var(--md-sys-color-surface-bright)}.qmx-scrollbar::-webkit-scrollbar-thumb:hover{background-color:#e0d1ff}.qmx-input{background-color:var(--md-sys-color-surface-container);border:1px solid var(--md-sys-color-outline);color:var(--md-sys-color-on-surface);border-radius:8px;padding:12px;width:100%;box-sizing:border-box;transition:box-shadow .2s,border-color .2s}.qmx-input:hover{border-color:var(--md-sys-color-primary)}.qmx-input:focus{outline:none;border-color:var(--md-sys-color-primary);box-shadow:0 0 0 2px #d0bcff4d}.qmx-input[type=number]::-webkit-inner-spin-button,.qmx-input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.qmx-input[type=number]{-moz-appearance:textfield;appearance:textfield}.qmx-fieldset-unit{position:relative;padding:0;margin:0;border:1px solid var(--md-sys-color-outline);border-radius:8px;background-color:var(--md-sys-color-surface-container);transition:border-color .2s,box-shadow .2s;width:100%;box-sizing:border-box}.qmx-fieldset-unit:hover{border-color:var(--md-sys-color-primary)}.qmx-fieldset-unit:focus-within{border-color:var(--md-sys-color-primary);box-shadow:0 0 0 2px #d0bcff4d}.qmx-fieldset-unit input[type=number]{border:none;background:none;outline:none;box-shadow:none;color:var(--md-sys-color-on-surface);padding:3px 10px 4px;width:100%;box-sizing:border-box}.qmx-fieldset-unit legend{padding:0 6px;font-size:12px;color:var(--md-sys-color-on-surface-variant);margin-left:auto;margin-right:12px;text-align:right;pointer-events:none}.qmx-toggle{position:relative;display:inline-block;width:52px;height:30px}.qmx-toggle input{opacity:0;width:0;height:0}.qmx-toggle .slider{position:absolute;cursor:pointer;inset:0;background-color:var(--md-sys-color-surface-container);border:1px solid var(--md-sys-color-outline);border-radius:30px;transition:background-color .3s,border-color .3s}.qmx-toggle .slider:before{position:absolute;content:"";height:22px;width:22px;left:3px;bottom:3px;background-color:var(--md-sys-color-on-surface-variant);border-radius:50%;box-shadow:0 1px 3px #0003;transition:all .3s cubic-bezier(.175,.885,.32,1.275)}.qmx-toggle input:checked+.slider{background-color:var(--md-sys-color-primary);border-color:var(--md-sys-color-primary)}.qmx-toggle input:checked+.slider:before{background-color:var(--md-sys-color-on-primary);transform:translate(22px)}.qmx-toggle:hover .slider{border-color:var(--md-sys-color-primary)}.qmx-select{position:relative;width:100%}.qmx-select-styled{position:relative;padding:10px 30px 10px 12px;background-color:var(--md-sys-color-surface-container);border:1px solid var(--md-sys-color-outline);border-radius:8px;cursor:pointer;transition:all .2s;-webkit-user-select:none;user-select:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:inset 0 2px 4px #00000014}.qmx-select-styled:after{content:"";position:absolute;top:50%;right:12px;transform:translateY(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid var(--md-sys-color-on-surface-variant);transition:transform .3s ease}.qmx-select:hover .qmx-select-styled{border-color:var(--md-sys-color-primary)}.qmx-select.active .qmx-select-styled{border-color:var(--md-sys-color-primary);box-shadow:inset 0 3px 6px #0000001a,0 0 0 2px #d0bcff4d}.qmx-select.active .qmx-select-styled:after{transform:translateY(-50%) rotate(180deg)}.qmx-select-options{position:absolute;top:105%;left:0;right:0;z-index:10;background-color:var(--md-sys-color-surface-bright);border:1px solid var(--md-sys-color-outline);border-radius:8px;max-height:0;overflow:hidden;opacity:0;transform:translateY(-10px);transition:all .3s ease;padding:4px 0}.qmx-select.active .qmx-select-options{max-height:200px;opacity:1;transform:translateY(0)}.qmx-select-options div{padding:10px 12px;cursor:pointer;transition:background-color .2s}.qmx-select-options div:hover{background-color:#d0bcff1a}.qmx-select-options div.selected{background-color:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);font-weight:500}.qmx-range-slider-wrapper{display:flex;flex-direction:column;gap:8px}.qmx-range-slider-container{position:relative;height:24px;display:flex;align-items:center}.qmx-range-slider-container input[type=range]{position:absolute;width:100%;height:4px;-webkit-appearance:none;appearance:none;background:none;pointer-events:none;margin:0}.qmx-range-slider-container input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;pointer-events:auto;width:20px;height:20px;background-color:var(--md-sys-color-primary);border-radius:50%;cursor:grab;border:none;box-shadow:0 1px 3px #0000004d;transition:transform .2s}.qmx-range-slider-container input[type=range]::-webkit-slider-thumb:active{cursor:grabbing;transform:scale(1.1)}.qmx-range-slider-container input[type=range]::-moz-range-thumb{pointer-events:auto;width:20px;height:20px;background-color:var(--md-sys-color-primary);border-radius:50%;cursor:grab;border:none;box-shadow:0 1px 3px #0000004d;transition:transform .2s}.qmx-range-slider-container input[type=range]::-moz-range-thumb:active{cursor:grabbing;transform:scale(1.1)}.qmx-range-slider-track-container{position:absolute;width:100%;height:4px;background-color:var(--md-sys-color-surface-container);border-radius:2px}.qmx-range-slider-progress{position:absolute;height:100%;background-color:var(--md-sys-color-primary);border-radius:2px}.qmx-range-slider-values{font-size:14px;color:var(--md-sys-color-primary);text-align:center;font-weight:500}.qmx-tooltip-icon{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background-color:var(--md-sys-color-outline);color:var(--md-sys-color-surface-container);font-size:12px;font-weight:700;cursor:help;-webkit-user-select:none;user-select:none}#qmx-global-tooltip{position:fixed;background-color:var(--surface-container-highest);color:var(--md-sys-color-on-surface);padding:8px 12px;border-radius:8px;box-shadow:0 4px 12px #0003;font-size:12px;font-weight:400;line-height:1.5;z-index:10002;max-width:250px;opacity:0;visibility:hidden;transform:translateY(-5px);transition:opacity .2s ease,transform .2s ease,visibility .2s;pointer-events:none}#qmx-global-tooltip.visible{opacity:1;visibility:visible;transform:translateY(0)}.theme-switch{position:relative;display:block;width:60px;height:34px;cursor:pointer;transition:none}.theme-switch input{opacity:0;width:0;height:0}.slider-track{position:absolute;top:0;left:0;width:34px;height:34px;background-color:var(--surface-container-highest);border-radius:17px;box-shadow:inset 2px 2px 4px #0003,inset -2px -2px 4px #ffffff0d;transition:width .3s ease,left .3s ease,border-radius .3s ease,box-shadow .3s ease}.theme-switch:hover .slider-track{width:60px}.theme-switch input:checked+.slider-track{left:26px}.theme-switch:hover input:checked+.slider-track{left:0}.slider-dot{position:absolute;height:26px;width:26px;left:4px;top:4px;background-color:var(--md-sys-color-primary);border-radius:50%;display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 4px 8px #0000004d;transition:transform .3s cubic-bezier(.4,0,.2,1),background-color .3s ease,box-shadow .3s ease}.theme-switch input:checked~.slider-dot{transform:translate(26px);background-color:var(--primary-container)}.slider-dot .icon{position:absolute;width:20px;height:20px;color:var(--md-sys-color-on-primary);transition:opacity .3s ease,transform .3s cubic-bezier(.4,0,.2,1)}.sun{opacity:1;transform:translateY(0) rotate(0)}.moon{opacity:0;transform:translateY(20px) rotate(-45deg)}.theme-switch input:checked~.slider-dot .sun{opacity:0;transform:translateY(-20px) rotate(45deg)}.theme-switch input:checked~.slider-dot .moon{opacity:1;transform:translateY(0) rotate(0);color:var(--md-sys-color-on-surface)}#douyu-qmx-starter-button{position:fixed;top:0;left:0;z-index:10000;background-color:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);border:none;width:56px;height:56px;border-radius:16px;cursor:grab;box-shadow:0 4px 8px #0000004d;display:flex;align-items:center;justify-content:center;transform:translate3d(var(--tx, 0px),var(--ty, 0px),0) scale(1);transition:transform .3s cubic-bezier(.4,0,.2,1),opacity .3s cubic-bezier(.4,0,.2,1);will-change:transform,opacity}#douyu-qmx-starter-button .icon{font-size:28px}#douyu-qmx-starter-button.hidden{opacity:0;transform:translate3d(var(--tx, 0px),var(--ty, 0px),0) scale(.5);pointer-events:none}#qmx-modal-container{background-color:var(--md-sys-color-surface-container);color:var(--md-sys-color-on-surface);display:flex;flex-direction:column}#qmx-modal-container.mode-floating,#qmx-modal-container.mode-centered{position:fixed;z-index:9999;width:335px;max-width:90vw;max-height:80vh;border-radius:28px;box-shadow:0 8px 24px #0006;opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s,transform .2s ease-out;will-change:transform,opacity}#qmx-modal-container.visible{opacity:1;visibility:visible}#qmx-modal-container.mode-floating{top:0;left:0;transform:translate3d(var(--tx, 0px),var(--ty, 0px),0)}#qmx-modal-container.mode-floating .qmx-modal-header{cursor:move}#qmx-modal-container.mode-centered{top:50%;left:50%;transform:translate(-50%,-50%)}#qmx-modal-container.mode-inject-rank-list{position:relative;width:100%;flex:1;min-height:0;box-shadow:none;border-radius:0;transform:none!important}.qmx-modal-header{position:relative;padding:12px 20px 0;font-size:22px;font-weight:400;color:var(--md-sys-color-on-surface);-webkit-user-select:none;user-select:none;display:flex;align-items:center;justify-content:space-between}.qmx-modal-close-icon{width:36px;height:36px;background-color:#d0bcff26;border:none;border-radius:50%;cursor:pointer;transition:background-color .2s,transform .2s;position:relative;flex-shrink:0}.qmx-modal-close-icon:hover{background-color:var(--md-sys-color-primary);transform:scale(1.05) rotate(180deg)}.qmx-modal-close-icon:before,.qmx-modal-close-icon:after{content:"";position:absolute;top:50%;left:50%;width:16px;height:2px;background-color:var(--md-sys-color-primary);transition:background-color .2s ease-in-out}.qmx-modal-close-icon:hover:before,.qmx-modal-close-icon:hover:after{background-color:var(--md-sys-color-on-primary)}.qmx-modal-close-icon:before{transform:translate(-50%,-50%) rotate(45deg)}.qmx-modal-close-icon:after{transform:translate(-50%,-50%) rotate(-45deg)}.qmx-modal-content{padding:0 24px;flex:1;min-height:0;display:flex;flex-direction:column}.qmx-modal-content h3{flex-shrink:0;font-size:16px;font-weight:500;color:var(--md-sys-color-on-surface-variant);margin:0 0 8px}.qmx-stats-header{display:flex;align-items:center;justify-content:space-between;cursor:pointer;padding:4px 0;-webkit-user-select:none;user-select:none;transition:background-color .2s;border-radius:8px}.qmx-stats-header:hover{background-color:#ffffff0d}.qmx-stats-header h3{font-size:16px;font-weight:500;color:var(--md-sys-color-on-surface-variant);margin:8px 0}.qmx-stats-arrow{font-size:12px;color:var(--md-sys-color-on-surface-variant);transition:transform .3s ease}.qmx-stats-header.expanded .qmx-stats-arrow{transform:rotate(180deg)}.qmx-stats-container{position:relative;overflow:hidden;padding:0}.qmx-stats-toggle{position:relative;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-user-select:none;user-select:none;transition:all .3s cubic-bezier(.25,.46,.45,.94);margin:4px 24px;border-radius:10px}.qmx-stats-indicator{font-size:15px;color:var(--md-sys-color-on-surface-variant);transition:all .3s cubic-bezier(.25,.46,.45,.94);position:absolute;z-index:2}.qmx-stats-label{font-size:12px;color:var(--md-sys-color-on-surface-variant);opacity:0;transform:scale(.95);transition:all .3s cubic-bezier(.25,.46,.45,.94);position:absolute;z-index:1;white-space:nowrap}.qmx-stats-refresh{opacity:0;font-size:15px;transition:all .3s cubic-bezier(.25,.46,.45,.94);position:relative}.qmx-stats-refresh.rotating{animation:rotate360 1s linear}@keyframes rotate360{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.qmx-stats-toggle:hover{background-color:#ffffff0d;margin:4px 24px 21px}.qmx-stats-toggle:hover .qmx-stats-indicator{transform:translateY(110%)}.qmx-stats-toggle:hover .qmx-stats-label{opacity:1;transform:scale(1)}.qmx-stats-toggle.expanded{height:28px;padding:0 12px;margin:6px 20px}.qmx-stats-toggle.expanded .qmx-stats-indicator{transform:rotate(180deg) scale(1.05);position:relative;margin:9px}.qmx-stats-toggle.expanded .qmx-stats-label{opacity:1;transform:scale(1.05);font-size:12px;font-weight:500;position:relative;color:var(--md-sys-color-on-surface)}.qmx-stats-toggle.expanded .qmx-stats-refresh{opacity:1;margin:8px}.qmx-stats-content{max-height:0;opacity:0;overflow:hidden;transition:max-height .3s cubic-bezier(.25,.46,.45,.94),opacity .2s cubic-bezier(.25,.46,.45,.94) .1s,padding .3s cubic-bezier(.25,.46,.45,.94);padding:0 24px}.qmx-stats-content.expanded{max-height:120px;opacity:1;padding:8px 24px 16px}.qmx-modal-stats{display:flex;gap:1px}.qmx-modal-stats-child{background-color:var(--md-sys-color-surface-bright);border-radius:12px;padding:12px 16px;margin-bottom:8px;display:flex;align-items:center;gap:8px;transition:background-color .2s,transform .3s ease,opacity .3s ease;width:88px;float:left;margin-left:2%}.qmx-stat-info-avg,.qmx-stat-info-total,.qmx-stat-info-receivedCount{display:flex;flex-direction:column;flex-grow:1;gap:4px;font-size:14px;overflow:hidden}.qmx-stat-header{display:flex;align-items:baseline;justify-content:center}.qmx-stat-nickname{font-weight:500;color:var(--md-sys-color-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.qmx-stat-details{display:flex;align-items:center;font-size:13px;color:var(--md-sys-color-on-surface-variant);justify-content:center}.qmx-stat-stats{font-weight:500}#qmx-tab-list{overflow-y:auto;flex-grow:1;padding-right:4px;margin-right:-4px}.qmx-tab-list-item{background-color:var(--md-sys-color-surface-bright);border-radius:12px;padding:12px 16px;margin-bottom:8px;display:flex;align-items:center;gap:8px;transition:background-color .2s,transform .3s ease,opacity .3s ease}.qmx-tab-list-item:hover{background-color:#ffffff0d}.qmx-item-enter{opacity:0;transform:translate(20px)}.qmx-item-enter-active{opacity:1;transform:translate(0)}.qmx-item-exit-active{position:absolute;opacity:0;transform:scale(.8);transition:all .3s ease;z-index:-1;pointer-events:none}.qmx-tab-status-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}.qmx-tab-info{display:flex;flex-direction:column;flex-grow:1;gap:4px;font-size:14px;overflow:hidden}.qmx-tab-header{display:flex;align-items:baseline;justify-content:space-between}.qmx-tab-nickname{font-weight:500;color:var(--md-sys-color-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.qmx-tab-room-id{font-size:12px;color:var(--md-sys-color-on-surface-variant);opacity:.7}.qmx-tab-details{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-sys-color-on-surface-variant)}.qmx-tab-status-name{font-weight:500}.qmx-tab-close-btn{flex-shrink:0;background:none;border:none;color:var(--md-sys-color-on-surface-variant);font-size:20px;cursor:pointer;padding:0 4px;line-height:1;opacity:.6;transition:opacity .2s,color .2s,transform .2s}.qmx-tab-close-btn:hover{opacity:1;color:#f44336;transform:scale(1.1)}.qmx-modal-footer{padding:16px 24px;display:flex;gap:8px}#qmx-settings-modal{width:500px;max-width:95vw}.qmx-settings-header{padding:12px 24px;border-bottom:1px solid var(--md-sys-color-outline);flex-shrink:0}.qmx-settings-tabs{display:flex;gap:8px}.qmx-settings-tabs .tab-link{padding:8px 16px;border:none;background:none;color:var(--md-sys-color-on-surface-variant);cursor:pointer;border-radius:8px;transition:background-color .2s,color .2s;font-size:14px}.qmx-settings-tabs .tab-link:hover{background-color:#ffffff0d}.qmx-settings-tabs .tab-link.active{background-color:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);font-weight:500}.qmx-settings-content{padding:16px 24px;flex-grow:1;overflow-y:auto;overflow-x:hidden;max-height:60vh;scrollbar-gutter:stable}.qmx-settings-content .tab-content{display:none}.qmx-settings-content .tab-content.active{display:block}.qmx-settings-footer{padding:16px 24px;display:flex;justify-content:flex-end;gap:10px;border-top:1px solid var(--md-sys-color-outline);flex-shrink:0}.qmx-settings-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;align-items:start}.qmx-settings-item{display:flex;flex-direction:column;gap:8px}.qmx-settings-item label{font-size:14px;font-weight:500;display:flex;align-items:center;gap:6px}.qmx-settings-item small{font-size:12px;color:var(--md-sys-color-on-surface-variant);opacity:.8}.qmx-settings-warning{padding:12px;background-color:#f4433633;border:1px solid #F44336;color:#efb8c8;border-radius:8px;grid-column:1 / -1}#tab-about{line-height:1.7;font-size:14px}#tab-about h4{color:var(--md-sys-color-primary);font-size:16px;font-weight:500;margin-top:20px;margin-bottom:10px;padding-bottom:5px;border-bottom:1px solid var(--md-sys-color-outline)}#tab-about h4:first-child{margin-top:0}#tab-about p{margin-bottom:10px;color:var(--md-sys-color-on-surface-variant)}#tab-about .version-tag{display:inline-block;background-color:var(--md-sys-color-tertiary);color:var(--md-sys-color-on-primary);padding:2px 8px;border-radius:12px;font-size:13px;font-weight:500;margin-left:8px}#tab-about a{color:var(--md-sys-color-tertiary);text-decoration:none;font-weight:500;transition:color .2s}#tab-about a:hover{color:#ffd6e1;text-decoration:underline}#qmx-notice-modal{width:450px;max-width:90vw}#qmx-notice-modal .qmx-modal-content{padding:16px 24px}#qmx-notice-modal .qmx-modal-content p{margin-bottom:12px;line-height:1.6;font-size:15px;color:var(--md-sys-color-on-surface-variant)}#qmx-notice-modal .qmx-modal-content ul{margin:12px 0;padding-left:20px}#qmx-notice-modal .qmx-modal-content li{margin-bottom:10px;position:relative;font-size:15px;line-height:1.6}#qmx-notice-modal .qmx-modal-content li:before{content:"◆";position:absolute;left:-18px;color:var(--md-sys-color-primary);font-size:12px}#qmx-notice-modal h3{font-size:20px;font-weight:500;margin:0}#qmx-notice-modal h4{color:var(--md-sys-color-primary);font-size:16px;font-weight:500;margin-top:16px;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid var(--md-sys-color-outline)}#qmx-notice-modal .qmx-warning-text{background-color:#ffc1071a;border-left:4px solid #FFC107;padding:12px 16px;margin:16px 0;border-radius:4px;font-size:15px;line-height:1.6}#qmx-notice-modal .qmx-warning-text strong{color:#ff8f00}#qmx-notice-modal a{color:var(--md-sys-color-tertiary);text-decoration:none;font-weight:500;transition:color .2s}#qmx-notice-modal a:hover{color:#ffd6e1;text-decoration:underline}#qmx-modal-backdrop,#qmx-notice-backdrop{position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:var(--md-sys-color-scrim);z-index:9998;opacity:0;visibility:hidden;transition:opacity .3s ease}#qmx-modal-backdrop.visible,#qmx-notice-backdrop.visible{opacity:.5;visibility:visible}#qmx-settings-modal,#qmx-notice-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.95);z-index:10001;background-color:var(--md-sys-color-surface-bright);color:var(--md-sys-color-on-surface);border-radius:28px;box-shadow:0 12px 32px #00000080;display:flex;flex-direction:column;opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s,transform .3s}#qmx-settings-modal.visible,#qmx-notice-modal.visible{opacity:1;visibility:visible;transform:translate(-50%,-50%) scale(1)}.qmx-modal-btn{flex-grow:1;padding:10px 16px;border:1px solid var(--md-sys-color-outline);background-color:transparent;color:var(--md-sys-color-primary);border-radius:20px;font-size:14px;font-weight:500;cursor:pointer;transition:background-color .2s,transform .2s,box-shadow .2s;-webkit-user-select:none;user-select:none}.qmx-modal-btn:hover{background-color:#d0bcff1a;transform:translateY(-2px);box-shadow:0 2px 4px #0000001a}.qmx-modal-btn:active{transform:translateY(0) scale(.98);box-shadow:none}.qmx-modal-btn:disabled{opacity:.5;cursor:not-allowed}.qmx-modal-btn.primary{background-color:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);border:none}.qmx-modal-btn.primary:hover{background-color:#c2b3ff;box-shadow:0 4px 8px #0003}.qmx-modal-btn.danger{border-color:#f44336;color:#f44336}.qmx-modal-btn.danger:hover{background-color:#f443361a}.qmx-modal-content::-webkit-scrollbar,.qmx-settings-content::-webkit-scrollbar{width:10px}.qmx-modal-content::-webkit-scrollbar-track,.qmx-settings-content::-webkit-scrollbar-track{background:var(--md-sys-color-surface-bright);border-radius:10px}.qmx-modal-content::-webkit-scrollbar-thumb,.qmx-settings-content::-webkit-scrollbar-thumb{background-color:var(--md-sys-color-primary);border-radius:10px;border:2px solid var(--md-sys-color-surface-bright)}.qmx-modal-content::-webkit-scrollbar-thumb:hover,.qmx-settings-content::-webkit-scrollbar-thumb:hover{background-color:#e0d1ff}.qmx-autofill-status{padding:8px 16px;margin:8px 16px 0;background:linear-gradient(135deg,#4CAF50 0%,#45a049 100%);color:white;border-radius:12px;font-size:13px;font-weight:500;display:flex;align-items:center;gap:8px;animation:pulse 2s infinite}.qmx-autofill-status.searching{background:linear-gradient(135deg,#FFC107 0%,#FF9800 100%)}.qmx-autofill-status.paused{background:linear-gradient(135deg,#757575 0%,#616161 100%)}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.8}}.qmx-modal-btn.running{background-color:#f44336;border-color:#f44336;color:white}.qmx-modal-btn.running:hover{background-color:#d32f2f}';
  importCSS(ControlPanelRefactoredCss);
  const mainPanelTemplate = (maxTabs) => `
    <div class="qmx-modal-header">
        <span>控制中心</span>
        <button id="qmx-modal-close-btn" class="qmx-modal-close-icon" title="关闭"></button>
    </div>
    <div class="qmx-stats-container">
        <div class="qmx-stats-toggle" id="qmx-stats-toggle">
            <span class="qmx-stats-indicator">▼</span>
            <span class="qmx-stats-label">统计面板</span>
            <span class="qmx-stats-refresh">⟳</span>
        </div>
        <div class="qmx-stats-content" id="qmx-stats-content">
            <div class="qmx-modal-stats" id="qmx-stats-panel"></div>
        </div>
    </div>
    <div id="qmx-autofill-status" class="qmx-autofill-status" style="display:none;">
        <span id="qmx-autofill-status-text">挂机中...</span>
    </div>
    <div class="qmx-modal-content">
        <h3>监控面板 (<span id="qmx-active-tabs-count">0</span>/${maxTabs})</h3>
        <div id="qmx-tab-list"></div>
    </div>
    <div class="qmx-modal-footer">
        <button id="qmx-modal-manual-add-btn" class="qmx-modal-btn">➕ 添加房间</button>
        <button id="qmx-modal-autofill-btn" class="qmx-modal-btn primary">🚀 一键挂机</button>
        <button id="qmx-modal-settings-btn" class="qmx-modal-btn">设置</button>
        <button id="qmx-modal-close-all-btn" class="qmx-modal-btn danger">关闭所有</button>
    </div>
`;
  const createUnitInput = (id, label, settingsMeta) => {
    const meta = settingsMeta[id];
    return `
                <div class="qmx-settings-item">
                    <label for="${id}">
                        ${label}
                        <span class="qmx-tooltip-icon" data-tooltip-key="${id.replace("setting-", "")}">?</span>
                    </label>
                    <fieldset class="qmx-fieldset-unit">
                        <legend>${meta.unit}</legend>
                        <input type="number" class="qmx-input" id="${id}" value="${meta.value}">
                    </fieldset>
                </div>
            `;
  };
  const settingsPanelTemplate = (SETTINGS2) => {
    const settingsMeta = {
      "setting-initial-script-delay": { value: SETTINGS2.INITIAL_SCRIPT_DELAY / 1e3, unit: "秒" },
      "setting-auto-pause-delay": { value: SETTINGS2.AUTO_PAUSE_DELAY_AFTER_ACTION / 1e3, unit: "秒" },
      "setting-unresponsive-timeout": { value: SETTINGS2.UNRESPONSIVE_TIMEOUT / 6e4, unit: "分钟" },
      "setting-red-envelope-timeout": { value: SETTINGS2.RED_ENVELOPE_LOAD_TIMEOUT / 1e3, unit: "秒" },
      "setting-popup-wait-timeout": { value: SETTINGS2.POPUP_WAIT_TIMEOUT / 1e3, unit: "秒" },
      "setting-worker-loading-timeout": { value: SETTINGS2.ELEMENT_WAIT_TIMEOUT / 1e3, unit: "秒" },
      "setting-close-tab-delay": { value: SETTINGS2.CLOSE_TAB_DELAY / 1e3, unit: "秒" },
      "setting-api-retry-delay": { value: SETTINGS2.API_RETRY_DELAY / 1e3, unit: "秒" },
      "setting-switching-cleanup-timeout": { value: SETTINGS2.SWITCHING_CLEANUP_TIMEOUT / 1e3, unit: "秒" },
      "setting-healthcheck-interval": { value: SETTINGS2.HEALTHCHECK_INTERVAL / 1e3, unit: "秒" },
      "setting-disconnected-grace-period": { value: SETTINGS2.DISCONNECTED_GRACE_PERIOD / 1e3, unit: "秒" }
    };
    return `
        <div class="qmx-settings-header">
            <div class="qmx-settings-tabs">
                <button class="tab-link active" data-tab="basic">基本设置</button>
                <button class="tab-link" data-tab="perf">性能与延迟</button>
                <button class="tab-link" data-tab="advanced">高级设置</button>
                <button class="tab-link" data-tab="about">关于</button>
                <!-- 主题模式切换开关 -->
                <div class="qmx-settings-item">
                    <div class="theme-switch-wrapper">
                        <label class="theme-switch">
                            <input type="checkbox" id="setting-theme-mode" ${SETTINGS2.THEME === "dark" ? "checked" : ""}>

                            <!-- 1. 背景轨道：只负责展开和收缩的动画 -->
                            <span class="slider-track"></span>

                            <!-- 2. 滑块圆点：只负责左右移动和图标切换 -->
                            <span class="slider-dot">
                                <span class="icon sun">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <circle cx="12" cy="12" r="5"></circle>
                                        <line x1="12" y1="1" x2="12" y2="3"></line>
                                        <line x1="12" y1="21" x2="12" y2="23"></line>
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                        <line x1="1" y1="12" x2="3" y2="12"></line>
                                        <line x1="21" y1="12" x2="23" y2="12"></line>
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                    </svg>
                                </span>
                                <span class="icon moon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-3.51 1.713-6.636 4.398-8.552a.75.75 0 01.818.162z" clip-rule="evenodd"></path></svg>
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="qmx-settings-content">
            <!-- ==================== Tab 1: 基本设置 ==================== -->
            <div id="tab-basic" class="tab-content active">
                <div class="qmx-settings-grid">
                    <div class="qmx-settings-item">
                        <label for="setting-control-room-id">控制室房间号 <span class="qmx-tooltip-icon" data-tooltip-key="control-room">?</span></label>
                        <input type="number" class="qmx-input" id="setting-control-room-id" value="${SETTINGS2.CONTROL_ROOM_ID}">
                    </div>
                    <div class="qmx-settings-item">
                        <label>自动暂停后台视频 <span class="qmx-tooltip-icon" data-tooltip-key="auto-pause">?</span></label>
                        <label class="qmx-toggle">
                            <input type="checkbox" id="setting-auto-pause" ${SETTINGS2.AUTO_PAUSE_ENABLED ? "checked" : ""}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="qmx-settings-item">
                        <label>展示数据统计 <span class="qmx-tooltip-icon" data-tooltip-key="stats-info">?</span></label>
                        <label class="qmx-toggle">
                            <input type="checkbox" id="setting-stats-info" ${SETTINGS2.SHOW_STATS_IN_PANEL ? "checked" : ""}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="qmx-settings-item">
                        <label>启用校准模式 <span class="qmx-tooltip-icon" data-tooltip-key="calibration-mode">?</span></label>
                        <label class="qmx-toggle">
                            <input type="checkbox" id="setting-calibration-mode" ${SETTINGS2.CALIBRATION_MODE_ENABLED ? "checked" : ""}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="qmx-settings-item">
                        <label>达到上限后的行为</label>
                        <div class="qmx-select" data-target-id="setting-daily-limit-action">
                            <div class="qmx-select-styled"></div>
                            <div class="qmx-select-options"></div>
                            <select id="setting-daily-limit-action" style="display: none;">
                                <option value="STOP_ALL" ${SETTINGS2.DAILY_LIMIT_ACTION === "STOP_ALL" ? "selected" : ""}>直接关停所有任务</option>
                                <option value="CONTINUE_DORMANT" ${SETTINGS2.DAILY_LIMIT_ACTION === "CONTINUE_DORMANT" ? "selected" : ""}>进入休眠模式，等待刷新</option>
                            </select>
                        </div>
                    </div>
                    <div class="qmx-settings-item">
                        <label>控制中心显示模式</label>
                        <div class="qmx-select" data-target-id="setting-modal-mode">
                            <div class="qmx-select-styled"></div>
                            <div class="qmx-select-options"></div>
                            <select id="setting-modal-mode" style="display: none;">
                                <option value="floating" ${SETTINGS2.MODAL_DISPLAY_MODE === "floating" ? "selected" : ""}>浮动窗口</option>
                                <option value="centered" ${SETTINGS2.MODAL_DISPLAY_MODE === "centered" ? "selected" : ""}>屏幕居中</option>
                                <option value="inject-rank-list" ${SETTINGS2.MODAL_DISPLAY_MODE === "inject-rank-list" ? "selected" : ""}>替换排行榜显示</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ==================== Tab 2: 性能与延迟 ==================== -->
            <div id="tab-perf" class="tab-content">
                <div class="qmx-settings-grid">
                    ${createUnitInput("setting-initial-script-delay", "脚本初始启动延迟", settingsMeta)}
                    ${createUnitInput("setting-auto-pause-delay", "领取后暂停延迟", settingsMeta)}
                    ${createUnitInput("setting-unresponsive-timeout", "工作页失联超时", settingsMeta)}
                    ${createUnitInput("setting-red-envelope-timeout", "红包活动加载超时", settingsMeta)}
                    ${createUnitInput("setting-popup-wait-timeout", "红包弹窗等待超时", settingsMeta)}
                    ${createUnitInput("setting-worker-loading-timeout", "播放器加载超时", settingsMeta)}
                    ${createUnitInput("setting-close-tab-delay", "关闭标签页延迟", settingsMeta)}
                    ${createUnitInput("setting-switching-cleanup-timeout", "切换中状态兜底超时", settingsMeta)}
                    ${createUnitInput("setting-healthcheck-interval", "哨兵健康检查间隔", settingsMeta)}
                    ${createUnitInput("setting-disconnected-grace-period", "断开连接清理延迟", settingsMeta)}
                    ${createUnitInput("setting-api-retry-delay", "API重试延迟", settingsMeta)}

                    <div class="qmx-settings-item" style="grid-column: 1 / -1;">
                        <label>模拟操作延迟范围 (秒) <span class="qmx-tooltip-icon" data-tooltip-key="range-delay">?</span></label>
                        <div class="qmx-range-slider-wrapper">
                            <div class="qmx-range-slider-container">
                                <div class="qmx-range-slider-track-container"><div class="qmx-range-slider-progress"></div></div>
                                <input type="range" id="setting-min-delay" min="0.1" max="5" step="0.1" value="${SETTINGS2.MIN_DELAY / 1e3}">
                                <input type="range" id="setting-max-delay" min="0.1" max="5" step="0.1" value="${SETTINGS2.MAX_DELAY / 1e3}">
                            </div>
                            <div class="qmx-range-slider-values"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ==================== Tab 3: 高级设置 ==================== -->
            <div id="tab-advanced" class="tab-content">
                <div class="qmx-settings-grid">
                    <div class="qmx-settings-item">
                        <label for="setting-max-tabs">最大工作标签页数量 <span class="qmx-tooltip-icon" data-tooltip-key="max-worker-tabs">?</span></label>
                        <input type="number" class="qmx-input" id="setting-max-tabs" value="${SETTINGS2.MAX_WORKER_TABS}">
                    </div>
                    <div class="qmx-settings-item">
                        <label for="setting-api-fetch-count">单次API获取房间数 <span class="qmx-tooltip-icon" data-tooltip-key="api-room-fetch-count">?</span></label>
                        <input type="number" class="qmx-input" id="setting-api-fetch-count" value="${SETTINGS2.API_ROOM_FETCH_COUNT}">
                    </div>
                      <div class="qmx-settings-item">
                          <label for="setting-api-retry-count">API请求重试次数 <span class="qmx-tooltip-icon" data-tooltip-key="api-retry-count">?</span></label>
                          <input type="number" class="qmx-input" id="setting-api-retry-count" value="${SETTINGS2.API_RETRY_COUNT}">
                      </div>
                      <div class="qmx-settings-item">
                          <label for="setting-min-red-envelope-num">红包奖品总数阈值 <span class="qmx-tooltip-icon" data-tooltip-key="min-red-envelope-num">?</span></label>
                          <input type="number" class="qmx-input" id="setting-min-red-envelope-num" value="${SETTINGS2.MIN_RED_ENVELOPE_NUM}">
                      </div>

                      <div class="qmx-settings-item">
                          <label>筛选房间内全部红包 <span class="qmx-tooltip-icon" data-tooltip-key="filter-all-red-envelopes">?</span></label>
                          <label class="qmx-toggle">
                              <input type="checkbox" id="setting-filter-all-red-envelopes" ${SETTINGS2.FILTER_ALL_RED_ENVELOPES ? "checked" : ""}>
                              <span class="slider"></span>
                          </label>
                      </div>



                    <!-- 新增：添加两个空的占位符，使网格平衡为 2x3 -->
                    <div class="qmx-settings-item"></div>
                    <div class="qmx-settings-item"></div>
                </div>
            </div>

            <!-- ==================== Tab 4: 关于 ==================== -->
            <div id="tab-about" class="tab-content">
                <!-- 调试工具 - 仅在开发时启用
                <h4>调试工具 <span style="color: #ff6b6b;">⚠️ 仅供测试使用</span></h4>
                <div class="qmx-settings-grid">
                    <div class="qmx-settings-item">
                        <label>模拟达到每日上限</label>
                        <button id="test-daily-limit-btn" class="qmx-modal-btn" style="background-color: #ff6b6b; color: white;">
                            设置为已达上限
                        </button>
                        <small style="color: #888; display: block; margin-top: 5px;">
                            点击后将模拟达到每日红包上限，触发休眠模式（如果启用）
                        </small>
                    </div>
                    <div class="qmx-settings-item">
                        <label>重置每日上限状态</label>
                        <button id="reset-daily-limit-btn" class="qmx-modal-btn">
                            重置上限状态
                        </button>
                        <small style="color: #888; display: block; margin-top: 5px;">
                            清除上限标记，恢复正常运行模式
                        </small>
                    </div>
                </div>
                -->

                <h4>关于脚本 <span class="version-tag">v2.0.8</span></h4>
                <h4>致谢</h4>
                <ul class="qmx-styled-list">
                    <li>本脚本基于<a href="https://greasyfork.org/zh-CN/users/1453821-ysl-ovo" target="_blank" rel="noopener noreferrer">ysl-ovo</a>的插件<a href="https://greasyfork.org/zh-CN/scripts/532514-%E6%96%97%E9%B1%BC%E5%85%A8%E6%B0%91%E6%98%9F%E6%8E%A8%E8%8D%90%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96" target="_blank" rel="noopener noreferrer">《斗鱼全民星推荐自动领取》</a>
                        与<a href="https://github.com/ienone/douyu-qmx-pro/" target="_blank" rel="noopener noreferrer">douyu-qmx-pro</a>进行改进与整合，感谢原作者的开源分享</li>
                    <li>云端授权系统与私有化部署功能由<a href="https://github.com/yqqxybm" target="_blank" rel="noopener noreferrer">@yqqxybm</a>开发实现</li>
                </ul>
                <h4>一些tips</h4>
                <ul class="qmx-styled-list">
                    <li>每天大概1000左右金币到上限</li>
                    <li>注意这个活动到晚上的时候，100/50/20星光棒的选项可能空了(奖池对应项会变灰)这时候攒金币过了12点再抽，比较有性价比</li>
                    <li>后台标签页有时会在还剩几秒时卡死在红包弹窗界面(标签页倒计时不动了)，然后就死循环了。目前已部分修复此问题</li>
                    <li>脚本还是bug不少，随缘修了＞︿＜</li>
                    <li>DouyuEx 的“阻止P2P上传”功能位置：点击精灵球->从左往右第四个🛠️样貌的选项->右侧菜单顶部 </li>
                    <li>启用统计功能需要把"油猴管理面板->设置->安全->允许脚本访问 Cookie"改为ALL！！',
                </ul>
                <h4>脚本更新日志 (v2.0.8)</h4>
                <ul class="qmx-styled-list">
                    <li>【修复】适配斗鱼星推荐API变动</li>
                    <li>【新增】在控制面板中显示统计信息，记录每日领取的红包数量和金币总额。</li>
                </ul>
                <h4>源码与社区</h4>
                <ul class="qmx-styled-list">
                    <li>可以在 <a href="https://github.com/yqqxybm/douyu-giver" target="_blank" rel="noopener noreferrer">GitHub</a> 查看本脚本源码</li>
                    <li>发现BUG或有功能建议，欢迎提交 <a href="https://github.com/yqqxybm/douyu-giver/issues" target="_blank" rel="noopener noreferrer">Issue</a></li>
                    <li>如果你有能力进行改进，非常欢迎提交 <a href="https://github.com/yqqxybm/douyu-giver/pulls" target="_blank" rel="noopener noreferrer">Pull Request</a>！</li>
                    <li>项目官网：<a href="https://101.200.133.180" target="_blank" rel="noopener noreferrer">https://101.200.133.180</a></li>
                </ul>
            </div>
        </div>
        <div class="qmx-settings-footer">
            <button id="qmx-settings-cancel-btn" class="qmx-modal-btn">取消</button>
            <button id="qmx-settings-reset-btn" class="qmx-modal-btn danger">恢复默认</button>
            <button id="qmx-settings-save-btn" class="qmx-modal-btn primary">保存并刷新</button>
        </div>
        `;
  };
  const ThemeManager = {
applyTheme(theme) {
      document.body.setAttribute("data-theme", theme);
      SETTINGS.THEME = theme;
      GM_setValue("douyu_qmx_theme", theme);
    }
  };
  const GlobalState = {
get() {
      let state = GM_getValue(SETTINGS.STATE_STORAGE_KEY, { tabs: {} });
      if (!state || typeof state !== "object") {
        state = { tabs: {} };
      }
      return state;
    },
set(state) {
      const lockKey = "douyu_qmx_state_lock";
      if (!Utils.lockChecker(lockKey, () => this.set(), state)) {
        return;
      }
      Utils.setLocalValueWithLock(lockKey, SETTINGS.STATE_STORAGE_KEY, state, "更新全局状态");
    },
updateWorker(roomId, status, statusText, options = {}) {
      if (!roomId) return;
      const state = this.get();
      const oldTabData = state.tabs[roomId] || {};
      if (status === "DISCONNECTED" && oldTabData.status === "SWITCHING") {
        Utils.log(`[状态管理] 检测到正在切换的标签页已断开连接，判定为成功关闭，立即清理。`);
        this.removeWorker(roomId);
        return;
      }
      if (Object.keys(state.tabs).length === 0 && status === "SWITCHING") {
        Utils.log(`[状态管理] 检测到全局状态已清空，忽略残留的SWITCHING状态更新 (房间: ${roomId})`);
        return;
      }
      const updates = {
        status,
        statusText,
        lastUpdateTime: Date.now(),
        ...options
      };
      const newTabData = { ...oldTabData, ...updates };
      for (const key in newTabData) {
        if (newTabData[key] === null) {
          delete newTabData[key];
        }
      }
      state.tabs[roomId] = newTabData;
      this.set(state);
    },
removeWorker(roomId) {
      if (!roomId) return;
      const state = this.get();
      delete state.tabs[roomId];
      this.set(state);
    },
setDailyLimit(reached) {
      GM_setValue(SETTINGS.DAILY_LIMIT_REACHED_KEY, { reached, timestamp: Date.now() });
    },
getDailyLimit() {
      return GM_getValue(SETTINGS.DAILY_LIMIT_REACHED_KEY);
    }
  };
  const DouyuAPI = {
  getRooms(count, rid, retries = SETTINGS.API_RETRY_COUNT) {
        return new Promise((resolve, reject) => {
          const attempt = (remainingTries) => {
            Utils.log(`开始调用 API 获取房间列表... (剩余重试次数: ${remainingTries})`);
            GM_xmlhttpRequest({
              method: "GET",
              url: `${SETTINGS.API_URL}?rid=${rid}`,
              headers: {
                Referer: "https://www.douyu.com/",
                "User-Agent": navigator.userAgent
              },
              responseType: "json",
              timeout: 1e4,
              onload: async (response) => {
                if (response.status === 200 && response.response?.error === 0 && Array.isArray(response.response.data?.redBagList)) {
                  let candidateRids = response.response.data.redBagList.map((item) => item.rid).filter(Boolean);

                  // 1. 如果没开启筛选，或者列表为空，直接返回
                  if (SETTINGS.MIN_RED_ENVELOPE_NUM <= 0 || candidateRids.length === 0) {
                      const rooms = candidateRids.slice(0, count * 2).map((rid2) => `https://www.douyu.com/${rid2}`);
                      Utils.log(`API 成功返回 ${rooms.length} 个房间URL (未启用筛选)。`);
                      resolve(rooms);
                      return;
                  }

                  // 2. 开启筛选：多取一些候选房间 (防止筛完不够)，然后并发检查
                  const checkLimit = count * 3; // 比如需要10个，我们取30个来筛
                  candidateRids = candidateRids.slice(0, checkLimit);
                  Utils.log(`API 返回 ${candidateRids.length} 个候选房间，开始筛选 (红包阈值: ${SETTINGS.MIN_RED_ENVELOPE_NUM})...`);

                  const checkPromises = candidateRids.map(async (r) => {
                      const pass = await this.checkRoomRedBag(r, SETTINGS.FILTER_ALL_RED_ENVELOPES);
                      return pass ? r : null;
                  });

                  const results = await Promise.all(checkPromises);
                  const finalRids = results.filter(Boolean);

                  Utils.log(`筛选完成，剩余 ${finalRids.length} 个符合条件的房间。`);
                  const rooms = finalRids.map((rid2) => `https://www.douyu.com/${rid2}`);
                  resolve(rooms);

                } else {
                  const errorMsg = `API 数据格式错误或失败: ${response.response?.msg || "未知错误"}`;
                  Utils.log(errorMsg);
                  if (remainingTries > 0) retry(remainingTries - 1, errorMsg);
                  else reject(new Error(errorMsg));
                }
              },
              onerror: (error) => {
                const errorMsg = `API 请求网络错误: ${error.statusText || "未知"}`;
                Utils.log(errorMsg);
                if (remainingTries > 0) retry(remainingTries - 1, errorMsg);
                else reject(new Error(errorMsg));
              },
              ontimeout: () => {
                const errorMsg = "API 请求超时";
                Utils.log(errorMsg);
                if (remainingTries > 0) retry(remainingTries - 1, errorMsg);
                else reject(new Error(errorMsg));
              }
            });
          };
          const retry = (remainingTries, reason) => {
            Utils.log(`${reason}，将在 ${SETTINGS.API_RETRY_DELAY / 1e3} 秒后重试...`);
            setTimeout(() => attempt(remainingTries), SETTINGS.API_RETRY_DELAY);
          };
          attempt(retries);
        });
      },
  checkRoomRedBag(rid, filterAll = SETTINGS.FILTER_ALL_RED_ENVELOPES) {
      return new Promise((resolve) => {
          if (SETTINGS.MIN_RED_ENVELOPE_NUM <= 0) {
              resolve(true);
              return;
          }
          GM_xmlhttpRequest({
              method: "GET",
              url: `https://www.douyu.com/japi/livebiznc/web/anchorstardiscover/redbag/room/list?rid=${rid}`,
              headers: { "User-Agent": navigator.userAgent },
              responseType: "json",
              timeout: 5000,
              onload: (res) => {
                  try {
                      const list = res.response?.data?.redBagList || [];

                      // 1. 过滤出状态为进行中(0)的红包
                      const activeList = list.filter(item => item.status === 0);
                      if (activeList.length === 0) { resolve(false); return; }

                      const getCoinNum = (redBag) => {
                          const prizeList = redBag?.prizeList || [];
                          const coinPrize = prizeList.find(p => p.ptype === 9);
                          return coinPrize ? (parseInt(coinPrize.num) || 0) : 0;
                      };

                      // 2. 关闭“筛选全部红包”时：只判断 waitSec 最短的那个（当前最先开抢/最先可领）
                      if (!filterAll) {
                          const targetRedBag = activeList.reduce((prev, curr) => {
                              return (prev.waitSec < curr.waitSec) ? prev : curr;
                          });
                          const coinNum = getCoinNum(targetRedBag);
                          resolve(coinNum >= SETTINGS.MIN_RED_ENVELOPE_NUM);
                          return;
                      }

                      // 3. 开启“筛选全部红包”时：房间内任意红包满足阈值即可
                      const hasAnyEligible = activeList.some((rb) => getCoinNum(rb) >= SETTINGS.MIN_RED_ENVELOPE_NUM);
                      resolve(hasAnyEligible);
                  } catch (e) {
                      resolve(false);
                  }
              },
              onerror: () => resolve(false),
              ontimeout: () => resolve(false)
          });
      });
  },
  // 获取“当前最先红包是否满足阈值” + “房间内是否存在任意满足阈值的红包” + “最近一个满足阈值红包的 waitSec”
  getRoomRedBagFilterInfo(rid) {
      return new Promise((resolve) => {
          if (SETTINGS.MIN_RED_ENVELOPE_NUM <= 0) {
              resolve({ hasAnyEligible: true, isFirstEligible: true, nextEligibleWaitSec: 0 });
              return;
          }
          GM_xmlhttpRequest({
              method: "GET",
              url: `https://www.douyu.com/japi/livebiznc/web/anchorstardiscover/redbag/room/list?rid=${rid}`,
              headers: { "User-Agent": navigator.userAgent },
              responseType: "json",
              timeout: 5000,
              onload: (res) => {
                  try {
                      const list = res.response?.data?.redBagList || [];
                      const activeList = list.filter(item => item.status === 0);
                      if (activeList.length === 0) {
                          resolve({ hasAnyEligible: false, isFirstEligible: false, nextEligibleWaitSec: null });
                          return;
                      }
                      const getCoinNum = (redBag) => {
                          const prizeList = redBag?.prizeList || [];
                          const coinPrize = prizeList.find(p => p.ptype === 9);
                          return coinPrize ? (parseInt(coinPrize.num) || 0) : 0;
                      };
                      const firstRedBag = activeList.reduce((prev, curr) => {
                          return (prev.waitSec < curr.waitSec) ? prev : curr;
                      });
                      const isFirstEligible = getCoinNum(firstRedBag) >= SETTINGS.MIN_RED_ENVELOPE_NUM;
                      const eligibleList = activeList
                          .map((rb) => ({ rb, coinNum: getCoinNum(rb) }))
                          .filter(({ coinNum }) => coinNum >= SETTINGS.MIN_RED_ENVELOPE_NUM)
                          .map(({ rb }) => rb);
                      const hasAnyEligible = eligibleList.length > 0;
                      const nextEligibleWaitSec = hasAnyEligible
                          ? eligibleList.reduce((prev, curr) => (prev.waitSec < curr.waitSec ? prev : curr)).waitSec
                          : null;
                      resolve({ hasAnyEligible, isFirstEligible, nextEligibleWaitSec });
                  } catch (e) {
                      resolve({ hasAnyEligible: false, isFirstEligible: false, nextEligibleWaitSec: null });
                  }
              },
              onerror: () => resolve({ hasAnyEligible: false, isFirstEligible: false, nextEligibleWaitSec: null }),
              ontimeout: () => resolve({ hasAnyEligible: false, isFirstEligible: false, nextEligibleWaitSec: null })
          });
      });
  },
getCookie: function(cookieName) {
      return new Promise((resolve, reject) => {
        GM_cookie.list({ name: cookieName }, function(cookies, error) {
          if (error) {
            Utils.log(error);
            reject(error);
          } else if (cookies && cookies.length > 0) {
            resolve(cookies[0]);
          } else {
            resolve(null);
          }
        });
      });
    },
getCoinRecord: function(current, count, rid, retries = SETTINGS.API_RETRY_COUNT) {
      return new Promise(async (resolve, reject) => {
        const acfCookie = await this.getCookie("acf_auth");
        if (!acfCookie) {
          Utils.log("获取cookie错误");
          reject(new Error("获取cookie错误"));
          return;
        }
        const fullUrl = `${SETTINGS.COIN_LIST_URL}?current=${current}&pageSize=${count}&rid=${rid}`;
        const attempt = (remainingTries) => {
          Utils.log(`开始调用 API 获取金币历史列表... (剩余重试次数: ${remainingTries})`);
          GM_xmlhttpRequest({
            method: "GET",
            url: fullUrl,
            headers: {
              Referer: "https://www.douyu.com/",
              "User-Agent": navigator.userAgent
            },
            cookie: acfCookie["value"],
            responseType: "json",
            timeout: 1e4,
            onload: (response) => {
              if (response.status === 200 && response.response?.error === 0 && Array.isArray(response.response.data.list)) {
                const coinListData = response.response.data.list.filter(
                  (item) => item.opDirection === 1 && item.remark.includes("红包")
                );
                Utils.log(`API 成功返回 ${coinListData.length} 个红包记录。`);
                resolve(coinListData);
              } else {
                const errorMsg = `API 数据格式错误或失败: ${response.response?.msg || "未知错误"}`;
                Utils.log(errorMsg);
                if (remainingTries > 0) retry(remainingTries - 1, errorMsg);
                else reject(new Error(errorMsg));
              }
            },
            onerror: (error) => {
              const errorMsg = `API 请求网络错误: ${error.statusText || "未知"}`;
              Utils.log(errorMsg);
              if (remainingTries > 0) retry(remainingTries - 1, errorMsg);
              else reject(new Error(errorMsg));
            },
            ontimeout: () => {
              const errorMsg = "API 请求超时";
              Utils.log(errorMsg);
              if (remainingTries > 0) retry(remainingTries - 1, errorMsg);
              else reject(new Error(errorMsg));
            }
          });
        };
        const retry = (remainingTries, reason) => {
          Utils.log(`${reason}，将在 ${SETTINGS.API_RETRY_DELAY / 1e3} 秒后重试...`);
          setTimeout(() => attempt(remainingTries), SETTINGS.API_RETRY_DELAY);
        };
        attempt(retries);
      });
    }
  };
  let isGlobalClickListenerAdded = false;
  function activateCustomSelects(parentElement) {
    parentElement.querySelectorAll(".qmx-select").forEach((wrapper) => {
      const nativeSelect = wrapper.querySelector("select");
      const styledSelect = wrapper.querySelector(".qmx-select-styled");
      const optionsList = wrapper.querySelector(".qmx-select-options");
      styledSelect.textContent = nativeSelect.options[nativeSelect.selectedIndex].text;
      optionsList.innerHTML = "";
      for (const option of nativeSelect.options) {
        const optionDiv = document.createElement("div");
        optionDiv.textContent = option.text;
        optionDiv.dataset.value = option.value;
        if (option.selected) {
          optionDiv.classList.add("selected");
        }
        optionsList.appendChild(optionDiv);
      }
      styledSelect.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".qmx-select.active").forEach((el) => {
          if (el !== wrapper) {
            el.classList.remove("active");
          }
        });
        wrapper.classList.toggle("active");
      });
      optionsList.querySelectorAll("div").forEach((optionDiv) => {
        optionDiv.addEventListener("click", () => {
          styledSelect.textContent = optionDiv.textContent;
          nativeSelect.value = optionDiv.dataset.value;
          optionsList.querySelector(".selected")?.classList.remove("selected");
          optionDiv.classList.add("selected");
          wrapper.classList.remove("active");
        });
      });
    });
    if (!isGlobalClickListenerAdded) {
      document.addEventListener("click", () => {
        document.querySelectorAll(".qmx-select.active").forEach((el) => {
          el.classList.remove("active");
        });
      });
      isGlobalClickListenerAdded = true;
    }
  }
  function activateRangeSlider(parentElement) {
    const wrapper = parentElement.querySelector(".qmx-range-slider-wrapper");
    if (!wrapper) {
      return;
    }
    const minSlider = wrapper.querySelector("#setting-min-delay");
    const maxSlider = wrapper.querySelector("#setting-max-delay");
    const sliderValues = wrapper.querySelector(".qmx-range-slider-values");
    const progress = wrapper.querySelector(".qmx-range-slider-progress");
    if (!minSlider || !maxSlider || !sliderValues || !progress) {
      console.error("范围滑块组件缺少必要的子元素 (min/max slider, values, progress)。");
      return;
    }
    function updateSliderView() {
      if (parseFloat(minSlider.value) > parseFloat(maxSlider.value)) {
        maxSlider.value = minSlider.value;
      }
      sliderValues.textContent = `${minSlider.value} s - ${maxSlider.value} s`;
      const minPercent = (minSlider.value - minSlider.min) / (minSlider.max - minSlider.min) * 100;
      const maxPercent = (maxSlider.value - maxSlider.min) / (maxSlider.max - minSlider.min) * 100;
      progress.style.left = `${minPercent}%`;
      progress.style.width = `${maxPercent - minPercent}%`;
    }
    minSlider.addEventListener("input", updateSliderView);
    maxSlider.addEventListener("input", updateSliderView);
    updateSliderView();
  }
  let tooltipElement = null;
  function _ensureTooltipElement() {
    if (!tooltipElement) {
      tooltipElement = document.createElement("div");
      tooltipElement.id = "qmx-global-tooltip";
      document.body.appendChild(tooltipElement);
    }
  }
  function activateToolTips(parentElement, tooltipData) {
    if (!parentElement || typeof tooltipData !== "object") {
      console.warn("[Tooltip] 调用失败：必须提供 parentElement 和 tooltipData。");
      return;
    }
    _ensureTooltipElement();
    parentElement.addEventListener("mouseover", (e) => {
      const trigger = e.target.closest(".qmx-tooltip-icon");
      if (!trigger) return;
      const key = trigger.dataset.tooltipKey;
      const text = tooltipData[key];
      if (text) {
        tooltipElement.textContent = text;
        const triggerRect = trigger.getBoundingClientRect();
        const left = triggerRect.left + triggerRect.width / 2;
        const top = triggerRect.top;
        tooltipElement.style.left = `${left}px`;
        tooltipElement.style.top = `${top}px`;
        tooltipElement.style.transform = `translate(-50%, calc(-100% - 8px))`;
        tooltipElement.classList.add("visible");
      }
    });
    parentElement.addEventListener("mouseout", (e) => {
      const trigger = e.target.closest(".qmx-tooltip-icon");
      if (trigger) {
        tooltipElement.classList.remove("visible");
      }
    });
  }
  const SettingsPanel = {
show() {
      const modal = document.getElementById("qmx-settings-modal");
      const allTooltips = {
        "control-room": "只有在此房间号的直播间中才能看到插件面板，看准了再改！",
        "auto-pause": "自动暂停非控制直播间的视频播放，大幅降低资源占用。",
        "initial-script-delay": "页面加载后等待多久再运行脚本，可适当增加以确保页面完全加载。",
        "auto-pause-delay": "领取红包后等待多久再次尝试暂停视频。",
        "unresponsive-timeout": "工作页多久未汇报任何状态后，在面板上标记为“无响应”。",
        "red-envelope-timeout": "进入直播间后，最长等待多久来寻找红包活动，超时后将切换房间。",
        "popup-wait-timeout": "点击红包后，等待领取弹窗出现的最长时间。",
        "worker-loading-timeout": "新开的直播间卡在加载状态多久还没显示播放组件，被判定为加载失败或缓慢。",
        "range-delay": "脚本在每次点击等操作前后随机等待的时间范围，模拟真人行为。",
        "close-tab-delay": "旧页面在打开新页面后，等待多久再关闭自己，确保新页面已接管。",
        "switching-cleanup-timeout": "处于“切换中”状态的标签页，超过此时间后将被强行清理，避免残留。",
        "max-worker-tabs": "同时运行的直播间数量上限。",
        "api-room-fetch-count": "每次从API获取的房间数。增加可提高找到新房间的几率。",
          "api-retry-count": "获取房间列表失败时的重试次数。",
          "api-retry-delay": "API请求失败后，等待多久再重试。",
          "min-red-envelope-num": "筛选房间：只有当红包内的最大奖品数值（例如100金币+1荧光棒，取100）大于等于此值时，才会进入。设为 0 则不筛选。",
          "filter-all-red-envelopes": "关闭：仅判断“当前最先开抢”的那个红包是否满足阈值，不满足则直接切换房间。开启：只要房间里存在任意一个满足阈值的红包，就留在房间等待该高价值红包开抢；不满足阈值的红包不会去抢（等待时间更长，但能筛到更多房间）。",
          "healthcheck-interval": "哨兵检查后台UI的频率。值越小，UI节流越快，但会增加资源占用。",
        "disconnected-grace-period": "刷新或关闭的标签页，在被彻底清理前等待重连的宽限时间。",
        "calibration-mode": "启用校准模式可提高倒计时精准度。注意：启用此项前请先关闭DouyuEx的 阻止P2P上传 功能",
        "stats-info": '此功能需要把"油猴管理面板->设置->安全->允许脚本访问 Cookie"改为ALL！！ 在控制面板中显示统计信息标签页，记录每日领取的红包数量和金币总额。'
      };
      modal.innerHTML = settingsPanelTemplate(SETTINGS);
      activateToolTips(modal, allTooltips);
      activateCustomSelects(modal);
      activateRangeSlider(modal);
      this.bindPanelEvents(modal);
      document.getElementById("qmx-modal-backdrop").classList.add("visible");
      modal.classList.add("visible");
      document.body.classList.add("qmx-modal-open-scroll-lock");
    },
hide() {
      const modal = document.getElementById("qmx-settings-modal");
      modal.classList.remove("visible");
      document.body.classList.remove("qmx-modal-open-scroll-lock");
      if (SETTINGS.MODAL_DISPLAY_MODE !== "centered" || !document.getElementById("qmx-modal-container").classList.contains("visible")) {
        document.getElementById("qmx-modal-backdrop").classList.remove("visible");
      }
    },
save() {
      const newSettings = {
CONTROL_ROOM_ID: document.getElementById("setting-control-room-id").value,
        AUTO_PAUSE_ENABLED: document.getElementById("setting-auto-pause").checked,
        DAILY_LIMIT_ACTION: document.getElementById("setting-daily-limit-action").value,
        MODAL_DISPLAY_MODE: document.getElementById("setting-modal-mode").value,
        THEME: document.getElementById("setting-theme-mode").checked ? "dark" : "light",

INITIAL_SCRIPT_DELAY: parseFloat(document.getElementById("setting-initial-script-delay").value) * 1e3,
        AUTO_PAUSE_DELAY_AFTER_ACTION: parseFloat(document.getElementById("setting-auto-pause-delay").value) * 1e3,
        SWITCHING_CLEANUP_TIMEOUT: parseFloat(document.getElementById("setting-switching-cleanup-timeout").value) * 1e3,
        UNRESPONSIVE_TIMEOUT: parseInt(document.getElementById("setting-unresponsive-timeout").value, 10) * 6e4,
        RED_ENVELOPE_LOAD_TIMEOUT: parseFloat(document.getElementById("setting-red-envelope-timeout").value) * 1e3,
        POPUP_WAIT_TIMEOUT: parseFloat(document.getElementById("setting-popup-wait-timeout").value) * 1e3,
        CALIBRATION_MODE_ENABLED: document.getElementById("setting-calibration-mode").checked,
        SHOW_STATS_IN_PANEL: document.getElementById("setting-stats-info").checked,
        ELEMENT_WAIT_TIMEOUT: parseFloat(document.getElementById("setting-worker-loading-timeout").value) * 1e3,
        MIN_DELAY: parseFloat(document.getElementById("setting-min-delay").value) * 1e3,
        MAX_DELAY: parseFloat(document.getElementById("setting-max-delay").value) * 1e3,
        CLOSE_TAB_DELAY: parseFloat(document.getElementById("setting-close-tab-delay").value) * 1e3,
        HEALTHCHECK_INTERVAL: parseFloat(document.getElementById("setting-healthcheck-interval").value) * 1e3,
        DISCONNECTED_GRACE_PERIOD: parseFloat(document.getElementById("setting-disconnected-grace-period").value) * 1e3,
MAX_WORKER_TABS: parseInt(document.getElementById("setting-max-tabs").value, 10),
          API_ROOM_FETCH_COUNT: parseInt(document.getElementById("setting-api-fetch-count").value, 10),
          API_RETRY_COUNT: parseInt(document.getElementById("setting-api-retry-count").value, 10),
          API_RETRY_DELAY: parseFloat(document.getElementById("setting-api-retry-delay").value) * 1e3,
          MIN_RED_ENVELOPE_NUM: parseInt(document.getElementById("setting-min-red-envelope-num").value, 10),
          FILTER_ALL_RED_ENVELOPES: document.getElementById("setting-filter-all-red-envelopes")?.checked ?? false
        };
      const existingUserSettings = GM_getValue(SettingsManager.STORAGE_KEY, {});
      const finalSettingsToSave = Object.assign(existingUserSettings, newSettings);
      delete finalSettingsToSave.OPEN_TAB_DELAY;
      SettingsManager.save(finalSettingsToSave);
      alert("设置已保存！页面将刷新以应用所有更改。");
      window.location.reload();
    },
bindPanelEvents(modal) {
      modal.querySelector("#qmx-settings-cancel-btn").onclick = () => this.hide();
      modal.querySelector("#qmx-settings-save-btn").onclick = () => this.save();
      modal.querySelector("#qmx-settings-reset-btn").onclick = () => {
        if (confirm("确定要恢复所有默认设置吗？此操作会刷新页面。")) {
          SettingsManager.reset();
          window.location.reload();
        }
      };
      modal.querySelectorAll(".tab-link").forEach((button) => {
        button.onclick = (e) => {
          const tabId = e.target.dataset.tab;
          modal.querySelector(".tab-link.active")?.classList.remove("active");
          modal.querySelector(".tab-content.active")?.classList.remove("active");
          e.target.classList.add("active");
          modal.querySelector(`#tab-${tabId}`).classList.add("active");
        };
      });
      const themeToggle = modal.querySelector("#setting-theme-mode");
      if (themeToggle) {
        themeToggle.addEventListener("change", (e) => {
          const newTheme = e.target.checked ? "dark" : "light";
          ThemeManager.applyTheme(newTheme);
        });
      }
    }

};
  const FirstTimeNotice = {
showCalibrationNotice() {
      const NOTICE_SHOWN_KEY = "douyu_qmx_calibration_notice_shown";
      const hasShownNotice = GM_getValue(NOTICE_SHOWN_KEY, false);
      if (!hasShownNotice) {
        const noticeHTML = `
                <div class="qmx-modal-header">
                    <h3>星推荐助手提示</h3>
                    <button id="qmx-notice-close-btn" class="qmx-modal-close-icon" title="关闭"></button>
                </div>
                <div class="qmx-modal-content">
                    <p>为了获得更精确的倒计时，您可以：</p>
                    <ul class="qmx-styled-list">
                        <li>关闭DouyuEx中的"阻止P2P上传"功能（详见设置→关于→一些tips底部）</li>
                        <li>进入设置 → 性能与延迟 → 开启"校准模式"</li>
                        <li>刷新页面</li>
                    </ul>
                    <p class="qmx-warning-text"><strong> 注意："校准模式"和DouyuEx插件"阻止P2P上传"功能不可并存</strong></p>
                    <h4>项目地址<a href="https://github.com/yqqxybm/douyu-giver" target="_blank" rel="noopener noreferrer">douyu-giver</a>，求个star🌟~~</h4>
                </div>
                <div class="qmx-modal-footer">
                    <button id="qmx-notice-settings-btn" class="qmx-modal-btn">前往设置</button>
                    <button id="qmx-notice-ok-btn" class="qmx-modal-btn primary">我知道了</button>
                </div>
            `;
        const noticeContainer = document.createElement("div");
        noticeContainer.id = "qmx-notice-modal";
        noticeContainer.className = "visible mode-centered";
        noticeContainer.innerHTML = noticeHTML;
        const backdrop = document.createElement("div");
        backdrop.id = "qmx-notice-backdrop";
        backdrop.className = "visible";
        document.body.appendChild(backdrop);
        document.body.appendChild(noticeContainer);
        const closeNotice = () => {
          noticeContainer.classList.remove("visible");
          backdrop.classList.remove("visible");
          setTimeout(() => {
            noticeContainer.remove();
            backdrop.remove();
          }, 300);
          GM_setValue(NOTICE_SHOWN_KEY, true);
        };
        document.getElementById("qmx-notice-close-btn").onclick = closeNotice;
        document.getElementById("qmx-notice-ok-btn").onclick = closeNotice;
        document.getElementById("qmx-notice-settings-btn").onclick = () => {
          closeNotice();
          SettingsPanel.show();
        };
      }
    }
  };
  const StatsInfo = {
    init: async function() {
      const stats = document.getElementById("qmx-stats-panel");
      [
        ["receivedCount", "已领个数"],
        ["total", "总金币"],
        ["avg", "平均每个"]
      ].forEach(([name, nickname]) => {
        stats.appendChild(this.initRender(name, nickname));
      });
      const nowDate = Utils.formatDateAsBeijing( new Date());
      let dataObj = this.createDataObj(nowDate);
      if (!GM_getValue(SETTINGS.STATS_INFO_STORAGE_KEY, null)) {
        GM_setValue(SETTINGS.STATS_INFO_STORAGE_KEY, dataObj);
      }
      this.updateTodayData();
      await this.getCoinListUpdate();
      this.removeExpiredData();
      this.bindEvents();
      setInterval(() => {
        this.updateDataForDailyReset();
      }, 60 * 1e3);
    },
    bindEvents: function() {
      const refreshButton = document.querySelector(".qmx-stats-refresh");
      if (!refreshButton) {
        return;
      }
      refreshButton.addEventListener("click", async (e) => {
        e.stopPropagation();
        void this.offsetWidth;
        refreshButton.classList.add("rotating");
        setTimeout(() => {
          refreshButton.classList.remove("rotating");
        }, 1e3);
        await this.getCoinListUpdate();
      });
    },
initRender: function(name, nickname) {
      const newItem = document.createElement("div");
      newItem.className = "qmx-modal-stats-child";
      const className = "qmx-stat-info-" + name;
      newItem.innerHTML = `
                <div class=${className}>
                    <div class="qmx-stat-header">
                        <span class="qmx-stat-nickname">${nickname}</span>
                    </div>
                    <div class="qmx-stat-details">
                        <span class="qmx-stat-item">0</span>
                    </div>
                </div>
            `;
      return newItem;
    },
createDataObj: function(date) {
      return {
        [date]: {
          receivedCount: 0,
          avg: 0,
          total: 0
        }
      };
    },
updateTodayData: function() {
      let allData = GM_getValue(SETTINGS.STATS_INFO_STORAGE_KEY, null);
      if (!allData) {
        return;
      }
      const today = Utils.formatDateAsBeijing( new Date());
      let todayData = allData?.[today];
      if (!todayData) {
        Object.assign(allData, this.createDataObj(today));
        GM_setValue(SETTINGS.STATS_INFO_STORAGE_KEY, allData);
        this.updateTodayData();
        return;
      }
      todayData["avg"] = todayData["total"] / todayData["receivedCount"] || 0;
      todayData["avg"] = todayData["avg"].toFixed(2);
      this.set("avg", todayData["avg"]);
      this.refreshUI(todayData);
    },
validateAllData: function(data) {
      if (!data) {
        Utils.log("统计数据错误");
        return false;
      }
      const today = Utils.formatDateAsBeijing( new Date());
      let todayData = data?.[today];
      if (!todayData) {
        Utils.log("今日统计数据错误");
        return false;
      }
      return true;
    },
set: function(name, value) {
      const lockKey = "douyu_qmx_stats_lock";
      if (!Utils.lockChecker(lockKey, () => this.set(), name, value)) {
        return;
      }
      let allData = GM_getValue(SETTINGS.STATS_INFO_STORAGE_KEY, null);
      if (!this.validateAllData(allData)) {
        return;
      }
      const today = Utils.formatDateAsBeijing( new Date());
      let todayData = allData?.[today];
      todayData[name] = value;
      Utils.setLocalValueWithLock(
        lockKey,
        SETTINGS.STATS_INFO_STORAGE_KEY,
        allData,
        "更新统计数据"
      );
      this.refreshUI(todayData);
    },
getCoinListUpdate: async function() {
      const currentRoomId = Utils.getCurrentRoomId();
      if (!currentRoomId) {
        Utils.log("[统计] 无法获取当前房间ID，跳过金币记录更新。");
        return;
      }
      const coinList = await DouyuAPI.getCoinRecord(1, 100, currentRoomId, 3);
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const filteredData = coinList.filter((item) => item.createTime > startOfToday / 1e3);
      const totalCoin = filteredData.reduce((sum, item) => sum + item.balanceDiff, 0);
      [
        ["receivedCount", filteredData.length],
        ["total", totalCoin]
      ].forEach(([name, value]) => {
        this.set(name, value);
      });
      this.updateTodayData();
    },
refreshUI: function(todayData) {
      for (let todayDataKey in todayData) {
        let dataName = document.querySelector(`.qmx-stat-info-${todayDataKey}`);
        let item = dataName.querySelector(".qmx-stat-item");
        item.textContent = todayData[todayDataKey];
      }
    },
removeExpiredData: function() {
      const allData = GM_getValue(SETTINGS.STATS_INFO_STORAGE_KEY);
      if (!allData) {
        Utils.log("获取本地历史数据失败");
      }
      let newAllData = Object.keys(allData).filter((dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const date = new Date(dateString);
        const diff = today - date;
        const dayDiff = diff / (1e3 * 60 * 60 * 24);
        return dayDiff <= 1;
      }).reduce((obj, key) => {
        return Object.assign(obj, { [key]: allData[key] });
      }, {});
      GM_setValue(SETTINGS.STATS_INFO_STORAGE_KEY, newAllData);
      Utils.log("[数据统计]：已清理过期数据");
    },
    updateDataForDailyReset: function() {
      const allData = GM_getValue(SETTINGS.STATS_INFO_STORAGE_KEY, null);
      if (!allData) {
        Utils.log("更新每日数据时本地数据错误，跳过");
        return;
      }
      const lastDate = Object.keys(allData).at(-1);
      const nowDate = Utils.formatDateAsBeijing( new Date());
      if (lastDate !== nowDate) {
        this.updateTodayData();
        this.removeExpiredData();
      }
    }
  };
  const ControlPage = {
injectionTarget: null,
isPanelInjected: false,
commandChannel: null,

// 一键挂机状态
autoFillState: {
  enabled: false,
  intervalId: null,
  consecutiveEmptySearches: 0,
  lastSearchTime: 0,
  isSearching: false,
},

init() {
      Utils.log("当前是控制页面，开始设置UI...");
      this.commandChannel = new BroadcastChannel("douyu_qmx_commands");
      ThemeManager.applyTheme(SETTINGS.THEME);
      this.createHTML();
      const qmxModalHeader = document.querySelector(".qmx-modal-header");
      if (SETTINGS.SHOW_STATS_IN_PANEL) {
        if (qmxModalHeader) {
          qmxModalHeader.style.padding = "12px 20px 0px 20px;";
        }
        StatsInfo.init();
      } else {
        const statsContent = document.querySelector(".qmx-stats-container");
        if (statsContent && qmxModalHeader) {
          statsContent.remove();
          qmxModalHeader.style.padding = "16px 24px";
        }
      }
      this.applyModalMode();
      this.bindEvents();
      setInterval(() => {
        this.renderDashboard();
        this.cleanupAndMonitorWorkers();
      }, 1e3);
      FirstTimeNotice.showCalibrationNotice();
      
      // 恢复挂机状态
      this.restoreAutoFillState();
      
      window.addEventListener("beforeunload", () => {
        if (this.commandChannel) {
          this.commandChannel.close();
        }
      });
      window.addEventListener("resize", () => {
        this.correctButtonPosition();
      });
    },
    createHTML() {
      Utils.log("创建UI的HTML结构...");
      const modalBackdrop = document.createElement("div");
      modalBackdrop.id = "qmx-modal-backdrop";
      const modalContainer = document.createElement("div");
      modalContainer.id = "qmx-modal-container";
      modalContainer.innerHTML = mainPanelTemplate(SETTINGS.MAX_WORKER_TABS);
      document.body.appendChild(modalBackdrop);
      document.body.appendChild(modalContainer);
      const mainButton = document.createElement("button");
      mainButton.id = SETTINGS.DRAGGABLE_BUTTON_ID;
      mainButton.innerHTML = `<span class="icon">🎁</span>`;
      document.body.appendChild(mainButton);
      const settingsModal = document.createElement("div");
      settingsModal.id = "qmx-settings-modal";
      document.body.appendChild(settingsModal);
      const globalTooltip = document.createElement("div");
      globalTooltip.id = "qmx-global-tooltip";
      document.body.appendChild(globalTooltip);

      if (BUILD_CONFIG.SHOW_ANTI_SCAM) {
          const warningDiv = document.createElement("div");
          warningDiv.style.cssText = "color: #ff4d4f; font-size: 12px; text-align: center; padding: 4px 0; font-weight: bold; background: rgba(0,0,0,0.5); width: 100%; border-top: 1px solid rgba(255,255,255,0.1);";
          warningDiv.textContent = "本脚本完全免费开源，严禁倒卖！如果你是买来的，请立即退款并举报。";
          const modalFooter = modalContainer.querySelector(".qmx-modal-footer");
          if (modalFooter) {
              modalFooter.parentNode.insertBefore(warningDiv, modalFooter.nextSibling); // 插在footer下面
          }
      }
    },
  cleanupAndMonitorWorkers() {
      const state = GlobalState.get();
      let stateModified = false;
      for (const roomId in state.tabs) {
        const tab = state.tabs[roomId];
        const timeSinceLastUpdate = Date.now() - tab.lastUpdateTime;
        if (tab.status === "DISCONNECTED" && timeSinceLastUpdate > SETTINGS.DISCONNECTED_GRACE_PERIOD) {
          Utils.log(
            `[监控] 任务 ${roomId} (已断开) 超过 ${SETTINGS.DISCONNECTED_GRACE_PERIOD / 1e3} 秒未重连，执行清理。`
          );
          delete state.tabs[roomId];
          stateModified = true;
          continue;
        }
        if (tab.status === "SWITCHING" && timeSinceLastUpdate > SETTINGS.SWITCHING_CLEANUP_TIMEOUT) {
          Utils.log(`[监控] 任务 ${roomId} (切换中) 已超时，判定为已关闭，执行清理。`);
          delete state.tabs[roomId];
          stateModified = true;
          continue;
        }
        if (timeSinceLastUpdate > SETTINGS.UNRESPONSIVE_TIMEOUT && tab.status !== "UNRESPONSIVE") {
          Utils.log(`[监控] 任务 ${roomId} 已失联超过 ${SETTINGS.UNRESPONSIVE_TIMEOUT / 6e4} 分钟，标记为无响应。`);
          tab.status = "UNRESPONSIVE";
          tab.statusText = "心跳失联，请点击激活或关闭此标签页";
          stateModified = true;
        }
      }
      if (stateModified) {
        GlobalState.set(state);
      }
    },
bindEvents() {
      Utils.log("为UI元素绑定事件...");
      const mainButton = document.getElementById(SETTINGS.DRAGGABLE_BUTTON_ID);
      const modalContainer = document.getElementById("qmx-modal-container");
      const modalBackdrop = document.getElementById("qmx-modal-backdrop");
      const statsToggle = document.getElementById("qmx-stats-toggle");
      const statsContent = document.getElementById("qmx-stats-content");
      if (statsToggle && statsContent) {
        statsToggle.addEventListener("click", () => {
          const isExpanded = statsToggle.classList.contains("expanded");
          if (isExpanded) {
            statsToggle.classList.remove("expanded");
            statsContent.classList.remove("expanded");
          } else {
            statsToggle.classList.add("expanded");
            statsContent.classList.add("expanded");
          }
        });
      }
      this.setupDrag(mainButton, SETTINGS.BUTTON_POS_STORAGE_KEY, () => this.showPanel());
      if (SETTINGS.MODAL_DISPLAY_MODE === "floating") {
        const modalHeader = modalContainer.querySelector(".qmx-modal-header");
        this.setupDrag(modalContainer, "douyu_qmx_modal_position", null, modalHeader);
      }
      document.getElementById("qmx-modal-close-btn").onclick = () => this.hidePanel();
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalContainer.classList.contains("visible")) {
          this.hidePanel();
        }
      });
      if (SETTINGS.MODAL_DISPLAY_MODE !== "inject-rank-list") {
        modalBackdrop.onclick = () => this.hidePanel();
      }
      // 一键挂机按钮 (需要登录授权)
      const autoFillBtn = document.getElementById("qmx-modal-autofill-btn");
      if (BUILD_CONFIG.IS_PUBLIC_RELEASE) {
        if (autoFillBtn) autoFillBtn.style.display = "none";
        // 确保状态也是禁用的
        this.autoFillState.enabled = false;
        GM_setValue(SETTINGS.AUTO_FILL_STORAGE_KEY, false);
      } else {
        if (autoFillBtn) {
            autoFillBtn.onclick = () => {
                if (this.autoFillState.enabled) {
                this.stopAutoFill();
                } else {
                this.startAutoFill();
                }
            };
        }
      }
      
      // 手动添加房间按钮 (不需要登录，一次添加一个)
      const manualAddBtn = document.getElementById("qmx-modal-manual-add-btn");
      if (manualAddBtn) {
        manualAddBtn.onclick = async () => {
          const state = GlobalState.get();
          const currentCount = Object.keys(state.tabs).length;
          
          if (currentCount >= SETTINGS.MAX_WORKER_TABS) {
            alert(`已达到最大标签页数量 (${SETTINGS.MAX_WORKER_TABS})，无法再添加更多房间。`);
            return;
          }
          
          Utils.log("[手动] 用户点击手动添加房间按钮");
          manualAddBtn.disabled = true;
          manualAddBtn.textContent = "搜索中...";
          
          const opened = await this.openOneNewTab();
          
          manualAddBtn.disabled = false;
          manualAddBtn.textContent = "➕ 添加房间";
          
          if (opened) {
            Utils.log("[手动] 成功添加一个新房间");
          } else {
            alert("未找到可用的新房间，请稍后再试。");
          }
        };
      }

      document.getElementById("qmx-modal-settings-btn").onclick = () => SettingsPanel.show();
      document.getElementById("qmx-modal-close-all-btn").onclick = async () => {
        if (confirm("确定要关闭所有工作标签页吗？（同时停止挂机）")) {
          // 先停止挂机
          this.stopAutoFill();
          
          Utils.log("用户请求关闭所有标签页。");
          Utils.log("通过 BroadcastChannel 发出 CLOSE_ALL 指令...");
          this.commandChannel.postMessage({ action: "CLOSE_ALL", target: "*" });
          await new Promise((resolve) => setTimeout(resolve, 500));
          Utils.log("强制清空全局状态中的标签页列表...");
          let state = GlobalState.get();
          if (Object.keys(state.tabs).length > 0) {
            Utils.log(`清理前还有 ${Object.keys(state.tabs).length} 个标签页残留`);
            state.tabs = {};
            GlobalState.set(state);
          }
          this.renderDashboard();
          setTimeout(() => {
            state = GlobalState.get();
            if (Object.keys(state.tabs).length > 0) {
              Utils.log("检测到残留标签页，执行二次清理...");
              state.tabs = {};
              GlobalState.set(state);
              this.renderDashboard();
            }
          }, 1e3);
        }
      };
      document.getElementById("qmx-tab-list").addEventListener("click", (e) => {
        const closeButton = e.target.closest(".qmx-tab-close-btn");
        if (!closeButton) return;
        const roomItem = e.target.closest("[data-room-id]");
        const roomId = roomItem?.dataset.roomId;
        if (!roomId) return;
        Utils.log(`[控制中心] 用户请求关闭房间: ${roomId}。`);
        const state = GlobalState.get();
        delete state.tabs[roomId];
        GlobalState.set(state);
        Utils.log(`通过 BroadcastChannel 向 ${roomId} 发出 CLOSE 指令...`);
        this.commandChannel.postMessage({ action: "CLOSE", target: roomId });
        roomItem.style.opacity = "0";
        roomItem.style.transform = "scale(0.8)";
        roomItem.style.transition = "all 0.3s ease";
        setTimeout(() => roomItem.remove(), 300);
      });
    },
renderDashboard() {
      const state = GlobalState.get();
      const tabList = document.getElementById("qmx-tab-list");
      if (!tabList) return;
      const tabIds = Object.keys(state.tabs);
      document.getElementById("qmx-active-tabs-count").textContent = tabIds.length;
      const statusDisplayMap = {
        OPENING: "加载中",
        WAITING: "等待中",
        CLAIMING: "领取中",
        SWITCHING: "切换中",
        DORMANT: "休眠中",
        ERROR: "出错了",
        UNRESPONSIVE: "无响应",
        DISCONNECTED: "已断开",
        STALLED: "UI节流"
      };
      const existingRoomIds = new Set(
        Array.from(tabList.children).map((node) => node.dataset.roomId).filter(Boolean)
      );
      tabIds.forEach((roomId) => {
        const tabData = state.tabs[roomId];
        let existingItem = tabList.querySelector(`[data-room-id="${roomId}"]`);
        let currentStatusText = tabData.statusText;
        if (tabData.status === "WAITING" && tabData.countdown?.endTime) {
          const remainingSeconds = (tabData.countdown.endTime - Date.now()) / 1e3;
          
          // 特殊处理"等待高价值"的状态，保持前缀并动态更新时间
          if (currentStatusText && currentStatusText.startsWith("等待高价值")) {
             if (remainingSeconds > 0) {
               currentStatusText = `等待高价值 ${Utils.formatTime(remainingSeconds)}`;
             } else {
               currentStatusText = "等待高价值 (即将开抢)";
             }
          } 
          // 普通倒计时状态
          else if (!currentStatusText || currentStatusText.startsWith("倒计时") || currentStatusText === "寻找任务中...") {
            if (remainingSeconds > 0) {
              currentStatusText = `倒计时 ${Utils.formatTime(remainingSeconds)}`;
            } else {
              currentStatusText = "等待开抢...";
            }
          }
        }
        if (SETTINGS.SHOW_STATS_IN_PANEL) {
          if (currentStatusText.includes("领取到")) {
            StatsInfo.getCoinListUpdate();
          }
        }
        if (existingItem) {
          const nicknameEl = existingItem.querySelector(".qmx-tab-nickname");
          const statusNameEl = existingItem.querySelector(".qmx-tab-status-name");
          const statusTextEl = existingItem.querySelector(".qmx-tab-status-text");
          const dotEl = existingItem.querySelector(".qmx-tab-status-dot");
          if (tabData.nickname && nicknameEl.textContent !== tabData.nickname) {
            nicknameEl.textContent = tabData.nickname;
          }
          const newStatusName = `[${statusDisplayMap[tabData.status] || tabData.status}]`;
          if (statusNameEl.textContent !== newStatusName) {
            statusNameEl.textContent = newStatusName;
            dotEl.style.backgroundColor = `var(--status-color-${tabData.status.toLowerCase()}, #9E9E9E)`;
          }
          if (statusTextEl.textContent !== currentStatusText) {
            statusTextEl.textContent = currentStatusText;
          }
        } else {
          const newItem = this.createTaskItem(roomId, tabData, statusDisplayMap, currentStatusText);
          tabList.appendChild(newItem);
          requestAnimationFrame(() => {
            newItem.classList.add("qmx-item-enter-active");
            setTimeout(() => newItem.classList.remove("qmx-item-enter"), 300);
          });
        }
      });
      existingRoomIds.forEach((roomId) => {
        if (!state.tabs[roomId]) {
          const itemToRemove = tabList.querySelector(`[data-room-id="${roomId}"]`);
          if (itemToRemove && !itemToRemove.classList.contains("qmx-item-exit-active")) {
            Utils.log(`[Render] 房间 ${roomId}: 在最新状态中已消失，执行移除。`);
            itemToRemove.classList.add("qmx-item-exit-active");
            setTimeout(() => itemToRemove.remove(), 300);
          }
        }
      });
      const emptyMsg = tabList.querySelector(".qmx-empty-list-msg");
      if (tabIds.length === 0) {
        if (!emptyMsg) {
          tabList.innerHTML = '<div class="qmx-tab-list-item qmx-empty-list-msg">没有正在运行的任务</div>';
        }
      } else if (emptyMsg) {
        emptyMsg.remove();
      }
      this.renderLimitStatus();
    },
renderLimitStatus() {
      let limitState = GlobalState.getDailyLimit();
      let limitMessageEl = document.getElementById("qmx-limit-message");
      const autoFillBtn = document.getElementById("qmx-modal-autofill-btn");
      
      if (limitState?.reached && Utils.formatDateAsBeijing(new Date(limitState.timestamp)) !== Utils.formatDateAsBeijing( new Date())) {
        Utils.log("[控制中心] 新的一天，重置每日上限旗标。");
        GlobalState.setDailyLimit(false);
        limitState = null;
      }
      
      if (limitState?.reached) {
        if (!limitMessageEl) {
          limitMessageEl = document.createElement("div");
          limitMessageEl.id = "qmx-limit-message";
          limitMessageEl.style.cssText = "padding: 10px 24px; background-color: var(--status-color-error); color: white; font-weight: 500; text-align: center;";
          const header = document.querySelector(".qmx-modal-header");
          header.parentNode.insertBefore(limitMessageEl, header.nextSibling);
        }
        if (SETTINGS.DAILY_LIMIT_ACTION === "CONTINUE_DORMANT") {
          limitMessageEl.textContent = "今日已达上限。任务休眠中，等待0点刷新。";
        } else {
          limitMessageEl.textContent = "今日已达上限。任务已全部停止。";
          if (autoFillBtn && this.autoFillState.enabled) {
            this.stopAutoFill();
          }
        }
      } else {
        if (limitMessageEl) limitMessageEl.remove();
      }
    },
async openOneNewTab(silent = false) {
      const state = GlobalState.get();
      const openedCount = Object.keys(state.tabs).length;
      if (openedCount >= SETTINGS.MAX_WORKER_TABS) {
        Utils.log(`已达到最大标签页数量 (${SETTINGS.MAX_WORKER_TABS})。`);
        return false;
      }
      try {
        const openedRoomIds = new Set(Object.keys(state.tabs));
        const apiRoomUrls = await DouyuAPI.getRooms(SETTINGS.API_ROOM_FETCH_COUNT, SETTINGS.CONTROL_ROOM_ID);
        const newUrl = apiRoomUrls.find((url) => {
          const rid = url.match(/\/(\d+)/)?.[1];
          return rid && !openedRoomIds.has(rid);
        });
        if (newUrl) {
          const newRoomId = newUrl.match(/\/(\d+)/)[1];
          const pendingWorkers = GM_getValue("qmx_pending_workers", []);
          pendingWorkers.push(newRoomId);
          GM_setValue("qmx_pending_workers", pendingWorkers);
          Utils.log(`已将房间 ${newRoomId} 加入待处理列表。`);
          GlobalState.updateWorker(newRoomId, "OPENING", "正在打开...");
          if (window.location.href.includes("/beta") || localStorage.getItem("newWebLive") !== "A") {
            localStorage.setItem("newWebLive", "A");
          }
          GM_openInTab(newUrl, { active: false, setParent: true });
          Utils.log(`打开指令已发送: ${newUrl}`);
          return true;
        } else {
          Utils.log("未能找到新的、未打开的房间。");
          return false;
        }
      } catch (error) {
        Utils.log(`查找或打开房间时出错: ${error.message}`);
        return false;
      }
    },

// ========== 一键挂机功能 (云端授权版) ==========

    // [新增] 远程控制相关
    remoteManager: null,
    userToken: GM_getValue("qmx_user_token", null),
    serverUrl: "https://101.200.133.180", // 项目官网与认证服务器

    async startAutoFill() {
      // 1. 如果已经加载了远程模块，直接启动
      if (this.remoteManager) {
        await this.remoteManager.start(this.getContext());
        return;
      }

      // 2. 检查本地是否有 Token
      if (!this.userToken) {
        this.showLoginModal();
        return;
      }

      // 3. 尝试加载远程核心
      Utils.log("[云端] 正在请求挂机授权...");
      this.updateAutoFillStatus("正在连接服务器...", "searching");

      try {
        const coreData = await this.fetchRemoteCore();
        if (coreData) {
          this.initRemoteCore(coreData);
          await this.remoteManager.start(this.getContext());
        }
      } catch (e) {
        Utils.log(`[错误] ${e.message}`);
        this.updateAutoFillStatus("服务器连接失败", "paused");
        // Token 可能失效，清除
        if (e.message.includes("401") || e.message.includes("403")) {
          this.userToken = null;
          GM_deleteValue("qmx_user_token");
          alert(`授权失效: ${e.message}`);
          this.showLoginModal();
        }
      }
    },

    stopAutoFill() {
      if (this.remoteManager) {
        this.remoteManager.stop(this.getContext());
      } else {
        // 本地状态复位
        this.autoFillState.enabled = false;
        this.updateAutoFillUI();
      }
    },

    // [移除] 批量填充功能（这本质上就是自动挂机，应该需要授权）
    // 只保留云端授权的智能挂机功能

    // 检查并填充房间（挂机模式专用，需要remoteManager）
    async checkAndFillRooms() {
      if (this.autoFillState.isSearching) return;
      
      const state = GlobalState.get();
      const currentCount = Object.keys(state.tabs).length;
      const limitState = GlobalState.getDailyLimit();
      
      // 已达每日上限
      if (limitState?.reached) {
        this.updateAutoFillStatus("已达每日上限，休眠中", "paused");
        return;
      }
      
      // 房间已满
      if (currentCount >= SETTINGS.MAX_WORKER_TABS) {
        this.autoFillState.consecutiveEmptySearches = 0;
        this.updateAutoFillStatus(`挂机中 (${currentCount}/${SETTINGS.MAX_WORKER_TABS})`, "");
        return;
      }
      
      // 计算搜索冷却时间
      const cooldown = Math.min(
        SETTINGS.AUTO_FILL_SEARCH_RETRY_BASE * Math.pow(1.5, this.autoFillState.consecutiveEmptySearches),
        SETTINGS.AUTO_FILL_SEARCH_RETRY_MAX
      );
      
      const timeSinceLastSearch = Date.now() - this.autoFillState.lastSearchTime;
      
      // 冷却中
      if (timeSinceLastSearch < cooldown && this.autoFillState.consecutiveEmptySearches > 0) {
        const remaining = Math.ceil((cooldown - timeSinceLastSearch) / 1000);
        this.updateAutoFillStatus(`搜索冷却中 (${remaining}秒后重试)`, "searching");
        return;
      }
      
      // 执行搜索
      this.autoFillState.isSearching = true;
      this.autoFillState.lastSearchTime = Date.now();
      
      Utils.log(`[挂机] 房间不足 (${currentCount}/${SETTINGS.MAX_WORKER_TABS})，搜索中...`);
      this.updateAutoFillStatus(`搜索新房间中...`, "searching");
      
      const opened = await this.openOneNewTab(true);
      
      this.autoFillState.isSearching = false;
      
      if (opened) {
        this.autoFillState.consecutiveEmptySearches = 0;
        const newState = GlobalState.get();
        const newCount = Object.keys(newState.tabs).length;
        this.updateAutoFillStatus(`挂机中 (${newCount}/${SETTINGS.MAX_WORKER_TABS})`, "");
      } else {
        this.autoFillState.consecutiveEmptySearches++;
        const nextRetry = Math.ceil(cooldown / 1000);
        Utils.log(`[挂机] 未找到满足条件的房间 (连续${this.autoFillState.consecutiveEmptySearches}次)，${nextRetry}秒后重试`);
        this.updateAutoFillStatus(`无房间，${nextRetry}秒后重试`, "searching");
      }
    },

    // [新增] 获取上下文，传给远程代码
    getContext() {
      return {
        Utils,
        GlobalState,
        ControlPage: this,
        SETTINGS,
        DouyuAPI
      };
    },

    // [新增] 网络请求
    fetchRemoteCore() {
      // 获取当前 cookie uid
      const uidCookie = document.cookie.split('; ').find(row => row.startsWith('acf_uid='));
      const uid = uidCookie ? uidCookie.split('=')[1] : null;

      if (!uid) {
         return Promise.reject(new Error("请先登录斗鱼账号！"));
      }

      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "POST",
          url: `${this.serverUrl}/api/core`,
          headers: {
            "Authorization": `Bearer ${this.userToken}`, // 增加 Bearer 前缀符合标准
            "Content-Type": "application/json"
          },
          onload: (res) => {
            try {
              const json = JSON.parse(res.responseText);
              if (json.code === 200) {
                // 如果服务端下发了配置，可以应用 (暂未实现配置应用逻辑，仅打印)
                if (json.config) Utils.log(`[云控] 配置更新: ${JSON.stringify(json.config)}`);
                resolve(json.payload);
              } else {
                reject(new Error(json.msg || "未知错误"));
              }
            } catch (e) {
              reject(new Error("服务器响应格式错误"));
            }
          },
          onerror: () => reject(new Error("网络连接失败"))
        });
      });
    },

    // [新增] 初始化远程代码
    initRemoteCore(payload) {
      try {
        const codeStr = atob(payload); // Base64 解码
        const factory = new Function(codeStr);
        this.remoteManager = factory(); // 获取 { start, stop } 对象
        Utils.log("[云端] 挂机核心加载成功");
      } catch (e) {
        Utils.log("[安全] 代码解析失败，可能已被篡改");
        console.error(e);
      }
    },

    // [新增] 登录 UI
    showLoginModal() {
      let modal = document.getElementById('qmx-login-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'qmx-login-modal';
        modal.className = 'qmx-modal-base visible';
        // 简单的内联样式确保居中
        modal.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:20000;background:var(--md-sys-color-surface-bright);padding:0;border-radius:28px;box-shadow:0 10px 30px rgba(0,0,0,0.5);width:300px;";
        
        modal.innerHTML = `
                <div class="qmx-modal-header" style="padding: 20px 24px;">
                    <span style="font-size:18px;">内部授权</span>
                    <button class="qmx-modal-close-icon" id="qmx-login-close"></button>
                </div>
                <div class="qmx-modal-content" style="padding: 0 24px 20px; display:flex; flex-direction:column; gap: 15px;">
                    <div class="qmx-settings-item">
                        <label style="margin-bottom:5px;display:block;">账号</label>
                        <input type="text" class="qmx-input" id="qmx-login-user">
                    </div>
                    <div class="qmx-settings-item">
                        <label style="margin-bottom:5px;display:block;">密码</label>
                        <input type="password" class="qmx-input" id="qmx-login-pass">
                    </div>
                    <div style="font-size: 12px; color: var(--md-sys-color-on-surface-variant); opacity: 0.8; line-height: 1.5;">
                        ⚠️ 本工具仅限内部交流学习，严禁外传。<br>
                        首次登录将自动绑定当前斗鱼账号。
                    </div>
                </div>
                <div class="qmx-modal-footer" style="padding:16px 24px;border-top:1px solid var(--md-sys-color-outline);display:flex;justify-content:flex-end;">
                    <button class="qmx-modal-btn primary" id="qmx-login-submit">登录并授权</button>
                </div>
            `;
        document.body.appendChild(modal);

        document.getElementById('qmx-login-close').onclick = () => modal.remove();

        document.getElementById('qmx-login-submit').onclick = () => {
          const user = document.getElementById('qmx-login-user').value;
          const pass = document.getElementById('qmx-login-pass').value;
          
          // 获取 UID
          const uidCookie = document.cookie.split('; ').find(row => row.startsWith('acf_uid='));
          const uid = uidCookie ? uidCookie.split('=')[1] : null;

          if (!uid) { alert("请先登录斗鱼账号！"); return; }

          Utils.log("正在登录...");
          GM_xmlhttpRequest({
            method: "POST",
            url: `${this.serverUrl}/api/login`,
            data: JSON.stringify({ username: user, password: pass, uid: uid }),
            headers: { "Content-Type": "application/json" },
            onload: (res) => {
              try {
                  const json = JSON.parse(res.responseText);
                  if (json.code === 200) {
                    this.userToken = json.token;
                    GM_setValue("qmx_user_token", json.token);
                    alert("登录成功！");
                    modal.remove();
                    this.startAutoFill(); // 自动开始
                  } else {
                    alert(`登录失败: ${json.msg}`);
                  }
              } catch(e) {
                  alert("服务器响应错误");
              }
            },
            onerror: () => alert("无法连接到认证服务器")
          });
        };
      }
    },

    updateAutoFillUI() {
      const btn = document.getElementById("qmx-modal-autofill-btn");
      const statusDiv = document.getElementById("qmx-autofill-status");
      
      if (!btn) return;
      
      if (this.autoFillState.enabled) {
        btn.textContent = "⏹ 停止挂机";
        btn.classList.add("running");
        btn.classList.remove("primary");
        if (statusDiv) statusDiv.style.display = "flex";
      } else {
        btn.textContent = "🚀 一键挂机";
        btn.classList.remove("running");
        btn.classList.add("primary");
        if (statusDiv) statusDiv.style.display = "none";
      }
    },

updateAutoFillStatus(text, className) {
      const statusDiv = document.getElementById("qmx-autofill-status");
      const statusText = document.getElementById("qmx-autofill-status-text");
      
      if (statusDiv && statusText) {
        statusText.textContent = text;
        statusDiv.className = "qmx-autofill-status";
        if (className) statusDiv.classList.add(className);
      }
    },

// 恢复挂机状态（页面刷新后）
restoreAutoFillState() {
      const savedEnabled = GM_getValue(SETTINGS.AUTO_FILL_STORAGE_KEY, false);
      if (savedEnabled) {
        Utils.log("[挂机] 恢复挂机状态...");
        this.startAutoFill();
      }
    },
// ========== 一键挂机功能结束 ==========

setupDrag(element, storageKey, onClick, handle = element) {
      let isMouseDown = false;
      let hasDragged = false;
      let startX, startY, initialX, initialY;
      const clickThreshold = 5;
      const setPosition = (x, y) => {
        element.style.setProperty("--tx", `${x}px`);
        element.style.setProperty("--ty", `${y}px`);
      };
      const savedPos = GM_getValue(storageKey);
      let currentRatio = null;
      if (savedPos) {
        if (typeof savedPos.ratioX === "number" && typeof savedPos.ratioY === "number") {
          currentRatio = savedPos;
        } else if (SETTINGS.CONVERT_LEGACY_POSITION && typeof savedPos.x === "number" && typeof savedPos.y === "number") {
          Utils.log(`[位置迁移] 发现旧的像素位置，正在转换为比例位置...`);
          const movableWidth = window.innerWidth - element.offsetWidth;
          const movableHeight = window.innerHeight - element.offsetHeight;
          currentRatio = {
            ratioX: Math.max(0, Math.min(1, savedPos.x / movableWidth)),
            ratioY: Math.max(0, Math.min(1, savedPos.y / movableHeight))
          };
          GM_setValue(storageKey, currentRatio);
        }
      }
      if (currentRatio) {
        const newX = currentRatio.ratioX * (window.innerWidth - element.offsetWidth);
        const newY = currentRatio.ratioY * (window.innerHeight - element.offsetHeight);
        setPosition(newX, newY);
      } else {
        if (element.id === SETTINGS.DRAGGABLE_BUTTON_ID) {
          const padding = SETTINGS.DRAG_BUTTON_DEFAULT_PADDING;
          const defaultX = window.innerWidth - element.offsetWidth - padding;
          const defaultY = padding;
          setPosition(defaultX, defaultY);
        } else {
          const defaultX = (window.innerWidth - element.offsetWidth) / 2;
          const defaultY = (window.innerHeight - element.offsetHeight) / 2;
          setPosition(defaultX, defaultY);
        }
      }
      const onMouseDown = (e) => {
        if (e.button !== 0) return;
        isMouseDown = true;
        hasDragged = false;
        const rect = element.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        initialX = rect.left;
        initialY = rect.top;
        element.classList.add("is-dragging");
        handle.style.cursor = "grabbing";
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp, { once: true });
      };
      const onMouseMove = (e) => {
        if (!isMouseDown) return;
        e.preventDefault();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (!hasDragged && Math.sqrt(dx * dx + dy * dy) > clickThreshold) {
          hasDragged = true;
        }
        let newX = initialX + dx;
        let newY = initialY + dy;
        const maxX = window.innerWidth - element.offsetWidth;
        const maxY = window.innerHeight - element.offsetHeight;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        setPosition(newX, newY);
      };
      const onMouseUp = () => {
        isMouseDown = false;
        document.removeEventListener("mousemove", onMouseMove);
        element.classList.remove("is-dragging");
        handle.style.cursor = "grab";
        if (hasDragged) {
          const finalRect = element.getBoundingClientRect();
          const movableWidth = window.innerWidth - element.offsetWidth;
          const movableHeight = window.innerHeight - element.offsetHeight;
          const ratioX = movableWidth > 0 ? Math.max(0, Math.min(1, finalRect.left / movableWidth)) : 0;
          const ratioY = movableHeight > 0 ? Math.max(0, Math.min(1, finalRect.top / movableHeight)) : 0;
          GM_setValue(storageKey, { ratioX, ratioY });
        } else if (onClick && typeof onClick === "function") {
          onClick();
        }
      };
      handle.addEventListener("mousedown", onMouseDown);
    },
showPanel() {
      const mainButton = document.getElementById(SETTINGS.DRAGGABLE_BUTTON_ID);
      const modalContainer = document.getElementById("qmx-modal-container");
      mainButton.classList.add("hidden");
      if (this.isPanelInjected) {
        this.injectionTarget.classList.add("qmx-hidden");
        modalContainer.classList.remove("qmx-hidden");
      } else {
        modalContainer.classList.add("visible");
        if (SETTINGS.MODAL_DISPLAY_MODE === "centered") {
          document.getElementById("qmx-modal-backdrop").classList.add("visible");
        }
      }
      Utils.log("控制面板已显示。");
    },
hidePanel() {
      const mainButton = document.getElementById(SETTINGS.DRAGGABLE_BUTTON_ID);
      const modalContainer = document.getElementById("qmx-modal-container");
      mainButton.classList.remove("hidden");
      if (this.isPanelInjected) {
        modalContainer.classList.add("qmx-hidden");
        if (this.injectionTarget) {
          this.injectionTarget.classList.remove("qmx-hidden");
        }
      } else {
        modalContainer.classList.remove("visible");
        if (SETTINGS.MODAL_DISPLAY_MODE === "centered") {
          document.getElementById("qmx-modal-backdrop").classList.remove("visible");
        }
      }
      Utils.log("控制面板已隐藏。");
    },
createTaskItem(roomId, tabData, statusMap, statusText) {
      const newItem = document.createElement("div");
      newItem.className = "qmx-tab-list-item qmx-item-enter";
      newItem.dataset.roomId = roomId;
      const statusColor = `var(--status-color-${tabData.status.toLowerCase()}, #9E9E9E)`;
      const nickname = tabData.nickname || "加载中...";
      const statusName = statusMap[tabData.status] || tabData.status;
      newItem.innerHTML = `
                <div class="qmx-tab-status-dot" style="background-color: ${statusColor};"></div>
                <div class="qmx-tab-info">
                    <div class="qmx-tab-header">
                        <span class="qmx-tab-nickname">${nickname}</span>
                        <span class="qmx-tab-room-id">${roomId}</span>
                    </div>
                    <div class="qmx-tab-details">
                        <span class="qmx-tab-status-name">[${statusName}]</span>
                        <span class="qmx-tab-status-text">${statusText}</span>
                    </div>
                </div>
                <button class="qmx-tab-close-btn" title="关闭该标签页">×</button>
            `;
      return newItem;
    },
applyModalMode() {
      const modalContainer = document.getElementById("qmx-modal-container");
      if (!modalContainer) return;
      const mode = SETTINGS.MODAL_DISPLAY_MODE;
      Utils.log(`尝试应用模态框模式: ${mode}`);
      if (mode === "inject-rank-list") {
        const waitForTarget = (retries = SETTINGS.INJECT_TARGET_RETRIES, interval = SETTINGS.INJECT_TARGET_INTERVAL) => {
          const target = document.querySelector(SETTINGS.SELECTORS.rankListContainer);
          if (target) {
            Utils.log("注入目标已找到，开始注入...");
            this.injectionTarget = target;
            this.isPanelInjected = true;
            target.parentNode.insertBefore(modalContainer, target.nextSibling);
            modalContainer.classList.add("mode-inject-rank-list", "qmx-hidden");
          } else if (retries > 0) {
            setTimeout(() => waitForTarget(retries - 1, interval), interval);
          } else {
            Utils.log(`[注入失败] 未找到目标元素 "${SETTINGS.SELECTORS.rankListContainer}"。`);
            Utils.log("[降级] 自动切换到 'floating' 备用模式。");
            SETTINGS.MODAL_DISPLAY_MODE = "floating";
            this.applyModalMode();
            SETTINGS.MODAL_DISPLAY_MODE = "inject-rank-list";
          }
        };
        waitForTarget();
        return;
      }
      this.isPanelInjected = false;
      modalContainer.classList.remove("mode-inject-rank-list", "qmx-hidden");
      modalContainer.classList.add(`mode-${mode}`);
    },
correctButtonPosition() {
      const mainButton = document.getElementById(SETTINGS.DRAGGABLE_BUTTON_ID);
      const storageKey = SETTINGS.BUTTON_POS_STORAGE_KEY;
      if (!mainButton) return;
      const savedPos = GM_getValue(storageKey);
      if (savedPos && typeof savedPos.ratioX === "number" && typeof savedPos.ratioY === "number") {
        const newX = savedPos.ratioX * (window.innerWidth - mainButton.offsetWidth);
        const newY = savedPos.ratioY * (window.innerHeight - mainButton.offsetHeight);
        mainButton.style.setProperty("--tx", `${newX}px`);
        mainButton.style.setProperty("--ty", `${newY}px`);
      }
    }
  };
  const DOM = {
async findElement(selector, timeout = SETTINGS.PANEL_WAIT_TIMEOUT, parent = document) {
      const startTime = Date.now();
      while (Date.now() - startTime < timeout) {
        const element = parent.querySelector(selector);
        if (element && window.getComputedStyle(element).display !== "none") {
          return element;
        }
        await Utils.sleep(300);
      }
      Utils.log(`查找元素超时: ${selector}`);
      return null;
    },
async safeClick(element, description) {
      if (!element) {
        return false;
      }
      try {
        if (window.getComputedStyle(element).display === "none") {
          return false;
        }
        await Utils.sleep(Utils.getRandomDelay(SETTINGS.MIN_DELAY / 2, SETTINGS.MAX_DELAY / 2));
        element.click();
        await Utils.sleep(Utils.getRandomDelay());
        return true;
      } catch (error) {
        Utils.log(`[点击异常] ${description} 时发生错误: ${error.message}`);
        return false;
      }
    },
async checkForLimitPopup() {
      const limitPopup = await this.findElement(SETTINGS.SELECTORS.limitReachedPopup, 3e3);
      if (limitPopup && limitPopup.textContent.includes("已达上限")) {
        Utils.log("捕获到“已达上限”弹窗！");
        return true;
      }
      return false;
    }
  };
  const WorkerPage = {
healthCheckTimeoutId: null,
    currentTaskEndTime: null,
    lastHealthCheckTime: null,
    lastPageCountdown: null,
    stallLevel: 0,
remainingTimeMap: new Map(),
consecutiveStallCount: 0,
    previousDeviation: 0,

async init() {
      Utils.log("混合模式工作单元初始化...");
      const roomId = Utils.getCurrentRoomId();
      if (!roomId) {
        Utils.log("无法识别当前房间ID，脚本停止。");
        return;
      }
      GlobalState.updateWorker(roomId, "OPENING", "页面加载中...", { countdown: null, nickname: null });
      await Utils.sleep(1e3);
      this.startCommandListener(roomId);
      window.addEventListener("beforeunload", () => {
        GlobalState.updateWorker(Utils.getCurrentRoomId(), "DISCONNECTED", "连接已断开...");
        if (this.pauseSentinelInterval) {
          clearInterval(this.pauseSentinelInterval);
        }
      });
      Utils.log("正在等待页面关键元素 (#js-player-video) 加载...");
      const criticalElement = await DOM.findElement(SETTINGS.SELECTORS.criticalElement, SETTINGS.ELEMENT_WAIT_TIMEOUT);
      if (!criticalElement) {
        Utils.log("页面关键元素加载超时，此标签页可能无法正常工作，即将关闭。");
        await this.selfClose(roomId);
        return;
      }
      Utils.log("页面关键元素已加载。");
      Utils.log("开始检测 UI 版本 和红包活动...");
      if (window.location.href.includes("/beta")) {
        GlobalState.updateWorker(roomId, "OPENING", "切换旧版UI...");
        localStorage.setItem("newWebLive", "A");
        window.location.href = window.location.href.replace("/beta", "");
      }
      Utils.log("确认进入稳定工作状态，执行身份核销。");
      const pendingWorkers = GM_getValue("qmx_pending_workers", []);
      const myIndex = pendingWorkers.indexOf(roomId);
      if (myIndex > -1) {
        pendingWorkers.splice(myIndex, 1);
        GM_setValue("qmx_pending_workers", pendingWorkers);
        Utils.log(`房间 ${roomId} 已从待处理列表中移除。`);
      }
      const anchorNameElement = document.querySelector(SETTINGS.SELECTORS.anchorName);
      const nickname = anchorNameElement ? anchorNameElement.textContent.trim() : `房间${roomId}`;
      GlobalState.updateWorker(roomId, "WAITING", "寻找任务中...", { nickname, countdown: null });
      const limitState = GlobalState.getDailyLimit();
      if (limitState?.reached) {
        Utils.log("初始化检查：检测到全局上限旗标。");
        if (SETTINGS.DAILY_LIMIT_ACTION === "CONTINUE_DORMANT") {
          await this.enterDormantMode();
        } else {
          await this.selfClose(roomId);
        }
        return;
      }
      this.findAndExecuteNextTask(roomId);
      if (SETTINGS.AUTO_PAUSE_ENABLED) {
        this.pauseSentinelInterval = setInterval(() => this.autoPauseVideo(), 8e3);
      }
    },
    async findAndExecuteNextTask(roomId) {
      if (this.healthCheckTimeoutId) {
        clearTimeout(this.healthCheckTimeoutId);
        this.healthCheckTimeoutId = null;
      }
      this.stallLevel = 0;
      const limitState = GlobalState.getDailyLimit();
      if (limitState?.reached) {
        Utils.log(`[上限检查] 房间 ${roomId} 检测到已达每日上限。`);
        if (SETTINGS.DAILY_LIMIT_ACTION === "CONTINUE_DORMANT") {
          await this.enterDormantMode();
        } else {
          await this.selfClose(roomId);
        }
        return;
      }
      if (SETTINGS.AUTO_PAUSE_ENABLED) this.autoPauseVideo();
      const redEnvelopeDiv = await DOM.findElement(SETTINGS.SELECTORS.redEnvelopeContainer, SETTINGS.RED_ENVELOPE_LOAD_TIMEOUT);
      if (!redEnvelopeDiv) {
        GlobalState.updateWorker(roomId, "SWITCHING", "无活动, 切换中", { countdown: null });
        await this.switchRoom();
        return;
      }

      // [新增] 二次确认：检查红包价值是否满足阈值 (进房间后复查)
      // 注意：这里只做"是否切换房间"的判断，不提前 return 跳过正常倒计时流程
      // 具体的"跳过低价值红包"逻辑在 claimAndRecheck 前处理
      if (SETTINGS.MIN_RED_ENVELOPE_NUM > 0) {
          await Utils.sleep(300);
          const filterInfo = await DouyuAPI.getRoomRedBagFilterInfo(roomId);
          const filterAll = SETTINGS.FILTER_ALL_RED_ENVELOPES;

          // 关闭筛选全部：只看"当前最先红包"是否合格；不合格就切换
          if (!filterAll && !filterInfo.isFirstEligible) {
              Utils.log(`[价值检查] (首个模式) 当前最先红包不足阈值 (${SETTINGS.MIN_RED_ENVELOPE_NUM})，切换...`);
              GlobalState.updateWorker(roomId, "SWITCHING", "红包太小, 切换中", { countdown: null });
              await this.switchRoom();
              return;
          }

          // 开启筛选全部：只要房间里存在任意合格红包，就留房等待；否则切换
          if (filterAll && !filterInfo.hasAnyEligible) {
              Utils.log(`[价值检查] (全量模式) 房间内暂无满足阈值 (${SETTINGS.MIN_RED_ENVELOPE_NUM}) 的红包，切换...`);
              GlobalState.updateWorker(roomId, "SWITCHING", "无高价值红包, 切换中", { countdown: null });
              await this.switchRoom();
              return;
          }

          // 开启筛选全部 且 当前最先红包不合格：
          // 我们不关注当前DOM显示的低价值红包倒计时，而是直接针对下一个高价值红包设置任务
          if (filterAll && !filterInfo.isFirstEligible) {
              const waitSec = filterInfo.nextEligibleWaitSec;
              if (waitSec !== null && waitSec !== undefined) {
                  Utils.log(`[价值检查] (全量模式) 当前红包不足阈值，锁定下一个高价值红包 (waitSec: ${waitSec})`);
                  
                  // 直接设置高价值红包的倒计时
                  this.currentTaskEndTime = Date.now() + waitSec * 1e3;
                  const formattedTime = Utils.formatTime(waitSec);
                  
                  GlobalState.updateWorker(roomId, "WAITING", `等待高价值: ${formattedTime}`, {
                      countdown: { endTime: this.currentTaskEndTime }
                  });
                  
                  // 设置唤醒定时器 (提前1.5秒唤醒)
                  const wakeUpDelay = Math.max(0, waitSec * 1e3 - 1500);
                  Utils.log(`将在 ${Math.round(wakeUpDelay / 1e3)} 秒后唤醒抢高价值红包。`);
                  setTimeout(() => this.claimAndRecheck(roomId), wakeUpDelay);
                  
                  return;
              } else {
                  // [修复] 严重Bug修复：如果找不到高价值红包的等待时间，说明实际上没有满足条件的红包
                  // 之前这里会穿透下去抢低价值红包，现在强制切换
                  Utils.log(`[价值检查] (全量模式) 虽然有高价值红包标记，但无法获取等待时间，视为无效，切换房间。`);
                  GlobalState.updateWorker(roomId, "SWITCHING", "数据异常, 切换中", { countdown: null });
                  await this.switchRoom();
                  return;
              }
          } else {
              Utils.log(`[价值检查] 红包价值符合要求。`);
          }
      }

      const statusSpan = redEnvelopeDiv.querySelector(SETTINGS.SELECTORS.countdownTimer);
      const statusText = statusSpan ? statusSpan.textContent.trim() : "";
      
      // [修复] 增加对“已结束”或类似状态的识别，防止死循环
      if (statusText.includes("结束") || statusText.includes("空") || statusText.includes("晚")) {
          Utils.log(`[状态检查] 检测到红包活动已结束 (${statusText})，切换房间。`);
          GlobalState.updateWorker(roomId, "SWITCHING", "活动结束, 切换中", { countdown: null });
          await this.switchRoom();
          return;
      }

      if (statusText.includes(":")) {
        const [minutes, seconds] = statusText.split(":").map(Number);
        const remainingSeconds = minutes * 60 + seconds;
        const currentCount = this.remainingTimeMap.get(remainingSeconds) || 0;
        this.remainingTimeMap.set(remainingSeconds, currentCount + 1);
        if (Array.from(this.remainingTimeMap.values()).some((value) => value > 3)) {
          GlobalState.updateWorker(roomId, "SWITCHING", "倒计时卡死, 切换中", { countdown: null });
          await this.switchRoom();
          return;
        }
        this.currentTaskEndTime = Date.now() + remainingSeconds * 1e3;
        this.lastHealthCheckTime = Date.now();
        this.lastPageCountdown = remainingSeconds;
        Utils.log(`发现新任务：倒计时 ${statusText}。`);
        GlobalState.updateWorker(roomId, "WAITING", `倒计时 ${statusText}`, {
          countdown: { endTime: this.currentTaskEndTime }
        });
        const wakeUpDelay = Math.max(0, remainingSeconds * 1e3 - 1500);
        Utils.log(`本单元将在约 ${Math.round(wakeUpDelay / 1e3)} 秒后唤醒执行任务。`);
        setTimeout(() => this.claimAndRecheck(roomId), wakeUpDelay);
        this.startHealthChecks(roomId, redEnvelopeDiv);
      } else if (statusText.includes("抢") || statusText.includes("领")) {
        // 全量筛选模式下：开抢前再校验一次，避免抢到不满足阈值的红包
        if (SETTINGS.MIN_RED_ENVELOPE_NUM > 0 && SETTINGS.FILTER_ALL_RED_ENVELOPES) {
          const filterInfo = await DouyuAPI.getRoomRedBagFilterInfo(roomId);
          if (!filterInfo.isFirstEligible) {
            const waitSec = typeof filterInfo.nextEligibleWaitSec === "number" ? filterInfo.nextEligibleWaitSec : null;
            const waitText = waitSec !== null ? `等待高价值红包 ${Utils.formatTime(waitSec)}` : "等待高价值红包...";
            Utils.log(`[价值检查] (全量模式) 当前开抢红包不足阈值，跳过抢红包并等待...`);
            GlobalState.updateWorker(roomId, "WAITING", waitText, { countdown: null });
            const recheckDelay = waitSec !== null ? Math.max(2e3, Math.min(30e3, waitSec * 1e3)) : 10e3;
            setTimeout(() => this.findAndExecuteNextTask(roomId), recheckDelay);
            return;
          }
        }
        GlobalState.updateWorker(roomId, "CLAIMING", "立即领取中...");
        await this.claimAndRecheck(roomId);
      } else {
        GlobalState.updateWorker(roomId, "WAITING", `状态未知, 稍后重试`, { countdown: null });
        setTimeout(() => this.findAndExecuteNextTask(roomId), 3e4);
      }
    },
startHealthChecks(roomId, redEnvelopeDiv) {
      const CHECK_INTERVAL = SETTINGS.HEALTHCHECK_INTERVAL;
      const STALL_THRESHOLD = 4;
      const check = () => {
        const currentPageStatus = redEnvelopeDiv.querySelector(SETTINGS.SELECTORS.countdownTimer)?.textContent.trim();
        if (!currentPageStatus || !currentPageStatus.includes(":")) {
          return;
        }
        const scriptRemainingSeconds = (this.currentTaskEndTime - Date.now()) / 1e3;
        const [pMin, pSec] = currentPageStatus.split(":").map(Number);
        const pageRemainingSeconds = pMin * 60 + pSec;
        const deviation = Math.abs(scriptRemainingSeconds - pageRemainingSeconds);
        const currentFormattedTime = Utils.formatTime(scriptRemainingSeconds);
        const pageFormattedTime = Utils.formatTime(pageRemainingSeconds);
        Utils.log(
          `[哨兵] 脚本倒计时: ${currentFormattedTime} | UI显示: ${pageFormattedTime} | 差值: ${deviation.toFixed(2)}秒`
        );
        Utils.log(`校准模式开启状态为 ${SETTINGS.CALIBRATION_MODE_ENABLED ? "开启" : "关闭"}`);
        if (SETTINGS.CALIBRATION_MODE_ENABLED) {
          if (deviation <= STALL_THRESHOLD) {
            const difference = scriptRemainingSeconds - pageRemainingSeconds;
            this.currentTaskEndTime = Date.now() + pageRemainingSeconds * 1e3;
            if (deviation > 0.1) {
              const direction = difference > 0 ? "慢" : "快";
              const calibrationMessage = `${direction}${deviation.toFixed(1)}秒, 已校准`;
              Utils.log(`[校准] ${calibrationMessage}。新倒计时: ${pageFormattedTime}`);
              GlobalState.updateWorker(roomId, "WAITING", calibrationMessage, {
                countdown: { endTime: this.currentTaskEndTime }
              });
              setTimeout(() => {
                if (this.currentTaskEndTime > Date.now()) {
                  GlobalState.updateWorker(roomId, "WAITING", `倒计时...`, {
                    countdown: { endTime: this.currentTaskEndTime }
                  });
                }
              }, 2500);
            } else {
              GlobalState.updateWorker(roomId, "WAITING", `倒计时...`, {
                countdown: { endTime: this.currentTaskEndTime }
              });
            }
            this.consecutiveStallCount = 0;
            this.previousDeviation = 0;
            this.stallLevel = 0;
          } else {
            const deviationIncreasing = deviation > this.previousDeviation;
            this.previousDeviation = deviation;
            if (deviationIncreasing) {
              this.consecutiveStallCount++;
              Utils.log(`[警告] 检测到UI卡顿第 ${this.consecutiveStallCount} 次，差值: ${deviation.toFixed(2)}秒`);
            } else {
              this.consecutiveStallCount = Math.max(0, this.consecutiveStallCount - 1);
            }
            if (this.consecutiveStallCount >= 3) {
              Utils.log(`[严重] 连续检测到卡顿且差值增大，判定为卡死状态。`);
              GlobalState.updateWorker(roomId, "SWITCHING", "倒计时卡死, 切换中", { countdown: null });
              clearTimeout(this.healthCheckTimeoutId);
              this.switchRoom();
              return;
            }
            this.stallLevel = 1;
            GlobalState.updateWorker(roomId, "ERROR", `UI卡顿 (${deviation.toFixed(1)}秒)`, {
              countdown: { endTime: this.currentTaskEndTime }
            });
          }
        } else {
          if (deviation > STALL_THRESHOLD) {
            if (this.stallLevel === 0) {
              Utils.log(`[哨兵] 检测到UI节流。脚本精确倒计时: ${currentFormattedTime} | UI显示: ${pageFormattedTime}`);
            }
            this.stallLevel = 1;
            GlobalState.updateWorker(roomId, "STALLED", `UI节流中...`, {
              countdown: { endTime: this.currentTaskEndTime }
            });
          } else {
            if (this.stallLevel > 0) {
              Utils.log("[哨兵] UI已从节流中恢复。");
              this.stallLevel = 0;
            }
            GlobalState.updateWorker(roomId, "WAITING", `倒计时 ${currentFormattedTime}`, {
              countdown: { endTime: this.currentTaskEndTime }
            });
          }
        }
        if (scriptRemainingSeconds > CHECK_INTERVAL / 1e3 + 1) {
          this.healthCheckTimeoutId = setTimeout(check, CHECK_INTERVAL);
        }
      };
      this.healthCheckTimeoutId = setTimeout(check, CHECK_INTERVAL);
    },
    async claimAndRecheck(roomId) {
      if (this.healthCheckTimeoutId) {
        clearTimeout(this.healthCheckTimeoutId);
        this.healthCheckTimeoutId = null;
      }

      const redEnvelopeDiv = document.querySelector(SETTINGS.SELECTORS.redEnvelopeContainer);
      if (!redEnvelopeDiv) {
          Utils.log("找不到红包元素，无法领取，重新寻找任务。");
          this.findAndExecuteNextTask(roomId);
          return;
      }

      // [优化] 阶段1：快速状态确认 (回归简单粗暴，不做API请求，只看DOM)
      const waitStartTime = Date.now();
      
      // 循环检查状态，直到变为可领取或超时
      // 原版是直接点，这里我们加一个极短的自旋锁，确保 DOM 状态对了再下手，或者时间到了强行下手
      while (Date.now() - waitStartTime < 10000) { 
          const statusSpan = redEnvelopeDiv.querySelector(SETTINGS.SELECTORS.countdownTimer);
          const statusText = statusSpan ? statusSpan.textContent.trim() : "";

          // 1. 状态明确：开抢
          if (statusText.includes("抢") || statusText.includes("领")) {
              break; 
          }

          // 2. 倒计时极短：开抢
          if (statusText.includes(":")) {
              const [minutes, seconds] = statusText.split(":").map(Number);
              const remainingMs = (minutes * 60 + seconds) * 1000;
              if (remainingMs <= 200) break; // 剩 0.2秒就动手
          } 
          // 3. 非倒计时文本（可能是文字提示）：开抢
          else if (statusText) {
              break;
          }
          
          // 4. 本地时间到了：开抢 (兜底)
          if (this.currentTaskEndTime && Date.now() >= this.currentTaskEndTime) {
              break;
          }

          await Utils.sleep(20); // 极短间隔检查
      }

      Utils.log("状态确认完毕，执行领取流程...");
      GlobalState.updateWorker(roomId, "CLAIMING", "尝试打开红包...", { countdown: null });

      // [优化] 阶段2：连点器模式 (替代原版的单次点击)
      let popup = null;
      const maxClickAttempts = 20; 
      
      for (let i = 0; i < maxClickAttempts; i++) {
          try {
             redEnvelopeDiv.click(); // 直接触发 click 事件
          } catch(e) {}
          
          // 快速检查弹窗
          popup = document.querySelector(SETTINGS.SELECTORS.popupModal);
          if (popup && window.getComputedStyle(popup).display !== "none") {
              break;
          }

          // 检查是否已结束
          const currentStatus = redEnvelopeDiv.querySelector(SETTINGS.SELECTORS.countdownTimer)?.textContent.trim() || "";
          if (currentStatus.includes("结束") || currentStatus.includes("晚") || currentStatus.includes("空")) {
              Utils.log(`停止点击：检测到活动结束状态 (${currentStatus})`);
              break;
          }

          // 4. 每次点击间隔 (模拟真人手速：150ms - 300ms 随机波动)
          // 过于固定的高频点击容易被风控，增加随机性以模拟人类狂点鼠标的行为
          await Utils.sleep(Utils.getRandomDelay(150, 300));
      }

      if (!popup || window.getComputedStyle(popup).display === "none") {
        // 如果连点都失败，尝试用 DOM 方法兜底找一次（可能连点太快弹窗刚出来）
        popup = await DOM.findElement(SETTINGS.SELECTORS.popupModal, 1000, document);
      }

      if (!popup) {
        Utils.log("多次点击后仍未检测到红包弹窗，判定为失败。重新寻找任务。");
        await Utils.sleep(1000);
        this.findAndExecuteNextTask(roomId);
        return;
      }

      const openBtn = popup.querySelector(SETTINGS.SELECTORS.openButton);
      if (await DOM.safeClick(openBtn, "红包弹窗的打开按钮")) {
        if (await DOM.checkForLimitPopup()) {
          GlobalState.setDailyLimit(true);
          Utils.log("检测到每日上限！");
          if (SETTINGS.DAILY_LIMIT_ACTION === "CONTINUE_DORMANT") {
            await this.enterDormantMode();
          } else {
            await this.selfClose(roomId);
          }
          return;
        }
        await Utils.sleep(1500);
        const successIndicator = await DOM.findElement(SETTINGS.SELECTORS.rewardSuccessIndicator, 3e3, popup);
        const reward = successIndicator ? "领取成功 " : "空包或失败";
        Utils.log(`领取操作完成，结果: ${reward}`);
        GlobalState.updateWorker(roomId, "WAITING", `领取到: ${reward}`, { countdown: null });
        const closeBtn = document.querySelector(SETTINGS.SELECTORS.closeButton);
        await DOM.safeClick(closeBtn, "领取结果弹窗的关闭按钮");
      } else {
        Utils.log("点击打开按钮失败。");
      }
      STATE.lastActionTime = Date.now();
      Utils.log("操作完成，2秒后在本房间内寻找下一个任务...");
      await Utils.sleep(2e3);
      this.findAndExecuteNextTask(roomId);
    },
async autoPauseVideo() {
      if (STATE.isSwitchingRoom || Date.now() - STATE.lastActionTime < SETTINGS.AUTO_PAUSE_DELAY_AFTER_ACTION) {
        return;
      }
      Utils.log("正在寻找暂停按钮...");
      const pauseBtn = await DOM.findElement(SETTINGS.SELECTORS.pauseButton, 5e3);
      if (pauseBtn) {
        if (await DOM.safeClick(pauseBtn, "暂停按钮")) {
          Utils.log("视频已通过脚本暂停。");
        }
      }
    },
async switchRoom() {
      if (this.healthCheckTimeoutId) {
        clearTimeout(this.healthCheckTimeoutId);
        this.healthCheckTimeoutId = null;
      }
      if (STATE.isSwitchingRoom) return;
      STATE.isSwitchingRoom = true;
      Utils.log("开始执行切换房间流程...");
      const currentRoomId = Utils.getCurrentRoomId();
      GlobalState.updateWorker(currentRoomId, "SWITCHING", "查找新房间...");
      try {
        const apiRoomUrls = await DouyuAPI.getRooms(SETTINGS.API_ROOM_FETCH_COUNT, currentRoomId);
        const currentState = GlobalState.get();
        const openedRoomIds = new Set(Object.keys(currentState.tabs));
        const nextUrl = apiRoomUrls.find((url) => {
          const rid = url.match(/\/(\d+)/)?.[1];
          return rid && !openedRoomIds.has(rid);
        });
        if (nextUrl) {
          Utils.log(`确定下一个房间链接: ${nextUrl}`);
          const nextRoomId = nextUrl.match(/\/(\d+)/)[1];
          const pendingWorkers = GM_getValue("qmx_pending_workers", []);
          pendingWorkers.push(nextRoomId);
          GM_setValue("qmx_pending_workers", pendingWorkers);
          Utils.log(`已将房间 ${nextRoomId} 加入待处理列表。`);
          if (window.location.href.includes("/beta") || localStorage.getItem("newWebLive") !== "A") {
            localStorage.setItem("newWebLive", "A");
          }
          GM_openInTab(nextUrl, { active: false, setParent: true });
          await Utils.sleep(SETTINGS.CLOSE_TAB_DELAY);
          await this.selfClose(currentRoomId);
        } else {
          Utils.log("API未能返回任何新的、未打开的房间，将关闭当前页。");
          await this.selfClose(currentRoomId);
        }
      } catch (error) {
        Utils.log(`切换房间时发生严重错误: ${error.message}`);
        await this.selfClose(currentRoomId);
      }
    },
async enterDormantMode() {
      const roomId = Utils.getCurrentRoomId();
      Utils.log(`[上限处理] 房间 ${roomId} 进入休眠模式。`);
      GlobalState.updateWorker(roomId, "DORMANT", "休眠中 (等待北京时间0点)", { countdown: null });
      const now = Utils.getBeijingTime();
      const tomorrow = new Date(now.getTime());
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 30, 0);
      const msUntilMidnight = tomorrow.getTime() - now.getTime();
      Utils.log(`将在 ${Math.round(msUntilMidnight / 1e3 / 60)} 分钟后自动刷新页面 (基于北京时间)。`);
      setTimeout(() => window.location.reload(), msUntilMidnight);
    },
async selfClose(roomId, fromCloseAll = false) {
      Utils.log(`本单元任务结束 (房间: ${roomId})，尝试更新状态并关闭。`);
      if (this.pauseSentinelInterval) {
        clearInterval(this.pauseSentinelInterval);
      }
      if (fromCloseAll) {
        Utils.log(`[关闭所有] 跳过状态更新，直接关闭标签页 (房间: ${roomId})`);
        GlobalState.removeWorker(roomId);
        await Utils.sleep(100);
        this.closeTab();
        return;
      }
      GlobalState.updateWorker(roomId, "SWITCHING", "任务结束，关闭中...");
      await Utils.sleep(100);
      GlobalState.removeWorker(roomId);
      await Utils.sleep(300);
      this.closeTab();
    },
closeTab() {
      try {
        window.close();
      } catch (e) {
        window.location.replace("about:blank");
        Utils.log(`关闭失败，故障为: ${e.message}`);
      }
    },

startCommandListener(roomId) {
      this.commandChannel = new BroadcastChannel("douyu_qmx_commands");
      Utils.log(`工作页 ${roomId} 已连接到指令广播频道。`);
      this.commandChannel.onmessage = (event) => {
        const { action, target } = event.data;
        if (target === roomId || target === "*") {
          Utils.log(`接收到广播指令: ${action} for target ${target}`);
          if (action === "CLOSE") {
            this.selfClose(roomId, false);
          } else if (action === "CLOSE_ALL") {
            this.selfClose(roomId, true);
          }
        }
      };
      window.addEventListener("beforeunload", () => {
        if (this.commandChannel) {
          this.commandChannel.close();
        }
      });
    }
  };
  (function() {
    function main() {
      initHackTimer("HackTimerWorker.js");
      const currentUrl = window.location.href;
      const isControlRoom = currentUrl.includes(`/${SETTINGS.CONTROL_ROOM_ID}`) || currentUrl.includes(`/topic/`) && currentUrl.includes(`rid=${SETTINGS.TEMP_CONTROL_ROOM_RID}`);
      if (isControlRoom) {
        ControlPage.init();
        return;
      }
      const roomId = Utils.getCurrentRoomId();
      if (roomId && (currentUrl.match(/douyu\.com\/(?:beta\/)?(\d+)/) || currentUrl.match(/douyu\.com\/(?:beta\/)?topic\/.*rid=(\d+)/))) {
        const globalTabs = GlobalState.get().tabs;
        const pendingWorkers = GM_getValue("qmx_pending_workers", []);
        if (globalTabs.hasOwnProperty(roomId) || pendingWorkers.includes(roomId)) {
          Utils.log(`[身份验证] 房间 ${roomId} 身份合法，授权初始化。`);
          const pendingIndex = pendingWorkers.indexOf(roomId);
          if (globalTabs.hasOwnProperty(roomId) && pendingIndex > -1) {
            pendingWorkers.splice(pendingIndex, 1);
            GM_setValue("qmx_pending_workers", pendingWorkers);
            Utils.log(`[身份清理] 房间 ${roomId} 已是激活状态，清理残留的待处理标记。`);
          }
          WorkerPage.init();
        } else {
          Utils.log(`[身份验证] 房间 ${roomId} 未在全局状态或待处理列表中，脚本不活动。`);
        }
      } else {
        Utils.log("当前页面非控制页或工作页，脚本不活动。");
      }
    }
    Utils.log(`脚本将在 ${SETTINGS.INITIAL_SCRIPT_DELAY / 1e3} 秒后开始初始化...`);
    setTimeout(main, SETTINGS.INITIAL_SCRIPT_DELAY);
  })();

})();