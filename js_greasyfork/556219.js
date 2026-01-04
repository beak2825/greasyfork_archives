// ==UserScript==
// @namespace   Circlejerk Scripts
// @name        Better bateworld.com
// @version     1.3.4
// @author      Thick Bro
// @match       https://bateworld.com//html5-chat/chat2/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_getValues
// @grant       GM_setValue
// @grant       GM_setValues
// @grant       GM_listValues
// @grant       GM_addElement
// @require     https://unpkg.com/preact@10.28.0/dist/preact.min.js#sha512-iMvQ2nmrBGovAh+dbYrh8gttIQ4Xa/aYwXhrgYdlhNHDXdyQA4tM0JyI81xJEm+laaTWnIhWGgawYgpEihg7AQ==
// @require     https://unpkg.com/preact@10.28.0/hooks/dist/hooks.umd.js#sha512-lLsbsdkj5qskElcWFvsifiWNJH4y8GeUtEdI3a1KZoVF+TCDvk/UGCyf/2mKpJtwI1XKJh89hVCVI2J3rEytQQ==
// @require     https://unpkg.com/preact@10.28.0/jsx-runtime/dist/jsxRuntime.umd.js#sha512-IRTpXYSw0jUJELE+zE319bPSVme0v6QV3LVh/SD5jljvKW4hb+LL6TRpMfkTEQvccsC5N7+6YusE6ol3yFuhLw==
// @description 21/10/2025, 20:41:33
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/556219/Better%20bateworldcom.user.js
// @updateURL https://update.greasyfork.org/scripts/556219/Better%20bateworldcom.meta.js
// ==/UserScript==

var __webpack_modules__ = ({
"./src/betterbw/styles/openPanels.css?inline": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0 = __webpack_require__("./node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0);
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1 = __webpack_require__("./node_modules/@rsbuild/core/compiled/css-loader/api.js");
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1_default()((_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0_default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `[data-username="I_am_watching"] {
  #userList &.userItem .webcamBtn {
    background: #50ce85 !important;
  }

  #tabs &.userItem:before, #tabs & .watchCam:before {
    content: "";
    border: 1px solid #b2b2b2;
    border-top-width: 3px;
    border-radius: 2px;
    width: 12px;
    height: 11px;
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%)translateX(-130%);
  }
}

.watchingMe, .user_watching_me {
  --gridGap: 4px;
  transition: box-shadow .2s ease-out;
  box-shadow: gold 0px 0px 1px var(--gridGap) !important;

  & .jsPanel-headerbar {
    background: linear-gradient(gold 0%, #0000 30% 70%, gold 85%);
  }

  & .jsPanel-title:before {
    content: "👁️";
    content: "";
    color: gold;
    z-index: 1;
    text-shadow: 1px 1px #daa520;
    font-family: "Font Awesome 5 Free";
    font-size: 14px;
    font-weight: 400;
    position: absolute;
    top: -5px;
    left: -2px;
  }
}
`, ""]);
// Exports
/* export default */ const __rspack_default_export = (___CSS_LOADER_EXPORT___.toString());

}),
"./src/betterbw/styles/static.css?inline": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0 = __webpack_require__("./node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0);
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1 = __webpack_require__("./node_modules/@rsbuild/core/compiled/css-loader/api.js");
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1_default()((_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0_default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `body > div:first-child {
  height: calc(100% - 4px);
}

body:not([data-algo]) button[data-sort-order=""], body[data-algo=""] button[data-sort-order=""], body[data-algo="new"] button[data-sort-order="new"], body[data-algo="top"] button[data-sort-order="top"] {
  color: #fff;
  background-color: #50c180;
}

input.numberOfCams {
  width: 4em;
}

.panel-action {
  position: absolute;
  left: 3px;
}

.panel-action-btn {
  cursor: pointer;
  color: inherit;
  float: right;
  opacity: 1;
  background: #fffc;
  border: 1px solid #ddd;
  height: 15px;
  margin-left: 8px;
  font-size: 14px;
  line-height: 0;
  transition: opacity .2s ease-out;
  position: relative;
  top: 2px;
}

.panel-action-btn:where([data-status-value="--"], [data-status-value="-"], [data-status-value="+"], [data-status-value="++"]) {
  margin-left: 0;
}

.jsPanel[data-grid-index][data-actions-attached]:not(.ui-draggable-dragging) {
  transition: top .15s linear, right .15s linear, bottom .15s linear, left .15s linear, box-shadow .2s ease-out;
}

.jsPanel:not(:hover) .panel-action-btn {
  opacity: 0;
}

.jsPanel .speaks {
  width: 3px;
  top: 0;
  bottom: 0;
  left: 0;
  rotate: 180deg;

  & .volume {
    background: #ff0;
    box-shadow: 1px 1px 1px #000, 2px 2px 1px #fff;
  }
}

.jsPanel .jsPanel-content {
  background: #111;
}

:where(#userMenu, .jsPanel)[data-status="--"] [data-status-value="--"] {
  color: #fff;
  background: #cd0000;
}

:where(#userMenu, .jsPanel)[data-status="-"] [data-status-value="-"] {
  color: #fff;
  background: #ed9200;
}

:where(#userMenu, .jsPanel)[data-status="+"] [data-status-value="+"] {
  color: #fff;
  background: #00a7e4;
}

:where(#userMenu, .jsPanel)[data-status="++"] [data-status-value="++"] {
  color: #fff;
  background: #9532ff;
}

:where(#userMenu, .jsPanel)[data-is-cooldown="true"] [data-status-value="⏱"] {
  color: #fff;
  background: #323232;
}

#userMenu .menuUserItem[data-action="whisper"] {
  display: block !important;
}

#userMenu[data-private-cam="true"] [data-action="viewWebcam"] {
  color: red;

  & .fa.fa-video-camera:after {
    color: red;
    content: " ";
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
  }
}

#tabs .addPrivateMessage {
  & .mention, & .userLabelBBW.receiver {
    pointer-events: none;
  }

  & .name-time {
    flex-wrap: wrap;

    & .content {
      flex-basis: 100%;
    }
  }

  & .whisper:after {
    width: initial;
    opacity: .75;
    background: linear-gradient(90deg, #0000 0%, red 25% 75%, #0000 100%);
    height: 10px;
    padding-inline: 25px;
    font-size: 8px;
    left: 0;
    right: auto;
  }
}

#tabs .serverMessage[data-private-cam="true"]:after, #userMenu[data-private-cam="true"] [data-action="viewWebcam"].fa:after {
  content: " ";
  color: red;
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
}

#tabs .serverMessage[data-private-cam="true"]:after {
  margin-left: 20px;
}

#tabs .webcamOpened .watchCam {
  position: relative;
}

.jsPanel .userAvatar {
  cursor: pointer;
}

.jsPanel[data-status="undefined"] .jsPanel-title {
  text-decoration: underline 2px orange;
}

.jsPanel[data-status="undefined"] button:where([data-status-value="++"]), .jsPanel[data-status="--"] button:where([data-status-value="++"]), .jsPanel[data-status="-"] button:where([data-status-value="++"]), .jsPanel[data-status="+"] button:where([data-status-value="--"]), .jsPanel[data-status="++"] button:where([data-status-value="--"]) {
  display: none;
}

.jsPanel:where([data-rotation=""], [data-rotation="0"]) video {
  rotate: none;
}

.jsPanel[data-rotation="90"] video {
  rotate: 90deg;
}

.jsPanel[data-rotation="180"] video {
  rotate: 180deg;
}

.jsPanel[data-rotation="270"] video {
  rotate: 270deg;
}

.jsPanel[data-rotation="90"] video, .jsPanel[data-rotation="270"] video {
  margin-left: 7.5%;
  width: 85% !important;
}

.slide_block {
  width: 14px;
}

#usersContainer {
  width: 240px;

  &.leftLayout #slide_block {
    z-index: 101;
    height: 37px;
    top: 50px;
    left: 31px;
  }
}

#myWebcamContainer .btn {
  text-wrap: inherit;
  line-height: 1 !important;
}

#userList .userItem {
  border-bottom: none;
  margin-left: 1px;
}

#userList .userLabel {
  border-top-left-radius: 9px;
  border-bottom-left-radius: 9px;
  margin-left: 2px;
  padding-left: 8px;
  top: 0;

  & .userSince {
    left: unset;
  }
}

.webcamBtn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  margin: 0;
  padding-inline: 1rem;
}

.webcamBtn i.lock {
  &.fa-unlock {
    display: none;
  }

  &.fa-lock {
    text-shadow: -2px 2px #fff;
    top: 1px;
    right: -25px;
  }

  font-size: 16px;
  position: absolute;
  top: 5px;
  left: -11px;
}

.webcamBtn i.fa-volume-down {
  padding-inline: 4px;
}

.eye-icon .fa-eye.isWatching {
  text-shadow: -1px -1px 1px #daa520;
  position: absolute;
  bottom: 5px;
  right: 42px;
  color: gold !important;
}

#userList .userItem:has(.webcamBtn.visible i.lock.fa-lock) {
  --lock-color: #cd000054;
  --v-padding: 0px;

  & .userLabel {
    box-shadow: inset 3px 0 1px 2px var(--lock-color);
  }

  & .webcamBtn.visible {
    box-shadow: inset -3px 0 1px 2px var(--lock-color);
    border: none;
  }
}

.jsPanel {
  box-shadow: none;
  border-color: #888 !important;
}

#roomsBtn {
  line-height: 1 !important;
}

#header {
  height: 30px !important;
}

#tabsAndFooter, #footer {
  width: min(50%, 100% - 1107px);
}

#tabsAndFooter {
  resize: horizontal;
  overflow: hidden;
}

#footer {
  width: 100%;
  position: relative;
}

video.mobile.mobile {
  max-width: 100% !important;
  max-height: 100% !important;
}

.jsPanel-headerbar {
  min-height: 18px;
}

.jsPanel-titlebar {
  min-height: 16px;
}

.jsPanel-titlebar h3 {
  margin-block: 1px;
}
`, ""]);
// Exports
/* export default */ const __rspack_default_export = (___CSS_LOADER_EXPORT___.toString());

}),
"./src/betterbw/styles/tiers.css?inline": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  A: () => (__rspack_default_export)
});
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0 = __webpack_require__("./node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js");
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0_default = /*#__PURE__*/__webpack_require__.n(_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0);
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1 = __webpack_require__("./node_modules/@rsbuild/core/compiled/css-loader/api.js");
/* import */ var _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1_default = /*#__PURE__*/__webpack_require__.n(_node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_rsbuild_core_compiled_css_loader_api_js__rspack_import_1_default()((_node_modules_rsbuild_core_compiled_css_loader_noSourceMaps_js__rspack_import_0_default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `#userList .userItem:where(.group_minus_minus) {
  opacity: .3 !important;
}

#tabs .userLabelBBW:where(.group_minus_minus) {
  text-decoration: line-through 1.8rem #cd000026;
}

#tabs .userLabelBBW:where(.group_minus) {
  text-decoration: line-through 1.8rem #ed920033;
}

#userList .userItem:where(.group_minus) .userLabel {
  background: #ed920033;
}

#tabs .userLabelBBW:where(.group_plus) {
  text-decoration: line-through 1.8rem #0064ff33;
}

#userList .userItem:where(.group_plus) .userLabel {
  background: #0064ff33;
}

#tabs .userLabelBBW:where(.group_plus_plus) {
  text-decoration: line-through 1.8rem #9532ff33;
}

#userList .userItem:where(.group_plus_plus) .userLabel {
  background: #9532ff33;
}
`, ""]);
// Exports
/* export default */ const __rspack_default_export = (___CSS_LOADER_EXPORT___.toString());

}),
"./node_modules/@rsbuild/core/compiled/css-loader/api.js": (function (module) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

}),
"./node_modules/@rsbuild/core/compiled/css-loader/noSourceMaps.js": (function (module) {

module.exports = function (i) {
  return i[1];
};

}),

});
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {

// Check if module is in cache
var cachedModule = __webpack_module_cache__[moduleId];
if (cachedModule !== undefined) {
return cachedModule.exports;
}
// Create a new module (and put it into the cache)
var module = (__webpack_module_cache__[moduleId] = {
id: moduleId,
exports: {}
});
// Execute the module function
__webpack_modules__[moduleId](module, module.exports, __webpack_require__);

// Return the exports of the module
return module.exports;

}

// webpack/runtime/compat_get_default_export
(() => {
// getDefaultExport function for compatibility with non-ESM modules
__webpack_require__.n = (module) => {
	var getter = module && module.__esModule ?
		() => (module['default']) :
		() => (module);
	__webpack_require__.d(getter, { a: getter });
	return getter;
};

})();
// webpack/runtime/define_property_getters
(() => {
__webpack_require__.d = (exports, definition) => {
	for(var key in definition) {
        if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
    }
};
})();
// webpack/runtime/has_own_property
(() => {
__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
})();
var __webpack_exports__ = {};

;// file://./src/betterbw/utils/sortFunctions.ts
const topRandom = (a, b) => b.bias - a.bias || Math.random() - 0.5;

// EXTERNAL MODULE: ./src/betterbw/styles/static.css?inline
var staticinline = __webpack_require__("./src/betterbw/styles/static.css?inline");
;// file://./src/betterbw/features/cooldown.ts
function cooldownIt({ username, minutes = 15, panel }) {
  if (!username) return;
  const expiry = Date.now() + 60000 * minutes;
  setCooldown(username, expiry);
  console.log(
    `User ${username} put on cooldown until`,
    new Date(expiry).toISOString(),
  );
  if (panel) jsPanel.activePanels.getPanel(panel.id)?.close();
}
function setCooldown(id, expiryMs) {
  GM_setValue(`${id}_cooldown`, expiryMs);
}
function getCooldownExpiry(id) {
  const val = GM_getValue(`${id}_cooldown`);
  return val ? Number(val) : null;
}
function isOnCooldown(id) {
  const expiry = getCooldownExpiry(id);
  return expiry && Date.now() < expiry;
}

;// file://./src/betterbw/utils/organizePanels.ts

const base = { my: "right-top", at: "right-top" };
const panelRatio = 318 / 365;
const gridconf = {
  MARGIN_TOP: 30,
  MARGIN_RIGHT: 5,
  GAP_X: 4,
  GAP_Y: 4,
  WIDTH: GM_getValue("config.webcamWidth", 365),
  HEIGHT: (318 * GM_getValue("config.webcamWidth", 365)) / 365,
};
const gridPlace = (c, r, offset = 0) => ({
  ...base,
  offsetX: -(gridconf.MARGIN_RIGHT + c * (gridconf.WIDTH + gridconf.GAP_X)),
  offsetY:
    gridconf.MARGIN_TOP + r * (gridconf.HEIGHT + gridconf.GAP_Y) + offset,
});
const organizePanels_offset = 65 - gridconf.MARGIN_TOP;
const positions3x3plus1 = () => [
  gridPlace(0, 0),
  gridPlace(0, 1),
  gridPlace(1, 0),
  gridPlace(1, 1),
  gridPlace(2, 0),
  gridPlace(2, 1),
  gridPlace(0, 2),
  gridPlace(1, 2),
  gridPlace(2, 2),
  gridPlace(3, 0, organizePanels_offset),
  gridPlace(3, 1, organizePanels_offset),
  gridPlace(3, 2, organizePanels_offset),
  gridPlace(4, 0, organizePanels_offset),
  gridPlace(4, 1, organizePanels_offset),
  gridPlace(4, 2, organizePanels_offset),
];
function organizePanels(getPositions = positions3x3plus1) {
  const opened = queryPanels();
  if (!opened.length) return;
  let lastIndex = 0;
  const groups = { prePositioned: [], newlyCreated: [] };
  for (const panel of opened) {
    const gridIndex = panel.dataset.gridIndex;
    if (gridIndex) {
      groups.prePositioned.push(panel);
      const gridIndexNumber = +gridIndex;
      if (gridIndexNumber > lastIndex) lastIndex = gridIndexNumber;
    } else groups.newlyCreated.push(panel);
  }
  const grid = Array(
    Math.max(+chatHTML5.roles.user.webcamMax, opened.length, lastIndex),
  ).fill(null);
  for (const panel of groups.prePositioned)
    if (null != panel.dataset.gridIndex && "" !== panel.dataset.gridIndex)
      if (grid[+panel.dataset.gridIndex]) {
        panel.dataset.gridIndex = "";
        groups.newlyCreated.unshift(panel);
      } else grid[+panel.dataset.gridIndex] = panel;
  for (let i = grid.length - 1; i >= 9; i--) {
    if (!grid[i]) continue;
    const nextAvailableSlot = grid.indexOf(null);
    if (!(nextAvailableSlot < 0) && !(nextAvailableSlot >= i)) {
      grid[i].dataset.gridIndex = nextAvailableSlot.toString();
      grid[nextAvailableSlot] = grid[i];
      grid[i] = null;
    }
  }
  for (const panel of groups.newlyCreated) {
    const nextAvailableSlot = grid.indexOf(null);
    if (nextAvailableSlot < 0) {
      panel.dataset.gridIndex = grid.length.toString();
      grid.push(panel);
    } else {
      panel.dataset.gridIndex = nextAvailableSlot.toString();
      grid[nextAvailableSlot] = panel;
    }
  }
  const positions = getPositions();
  let idx = -1;
  for (const place of grid) {
    idx++;
    const position = positions[idx];
    if (!place || !position) continue;
    const panel = jsPanel.activePanels.getPanel(place.id);
    if (panel)
      panel
        .resize({ width: gridconf.WIDTH, height: gridconf.HEIGHT })
        .reposition(position);
  }
}

;// file://./src/betterbw/utils/scrappers.ts
function scrappers_getUsername(panel) {
  const id = panel.id.split("_")[2] || $("[data-id]", panel)[0]?.dataset.id;
  return id && getUserById(id)?.username;
}
function getUserObjectById(userId) {
  return chatHTML5.users[userId];
}
function getUserById(userId) {
  const user = getUserObjectById(userId);
  if (!user) return;
  return { obj: user, username: user.username.split("_")[0] };
}

;// file://./src/betterbw/utils/openPanel.ts

const PANEL_SELECTOR = ".jsPanel.jsPanel-theme-default";
const queryPanels = () => document.querySelectorAll(PANEL_SELECTOR);
const queryPanel = target => target.querySelector(PANEL_SELECTOR);
function tryToOpenPanel(candidate) {
  $(".webcamBtn", candidate.item).trigger("click");
}
const getCandidates = (compareFn = topRandom, _biases = {}) => {
  const biases = { "-": 1, undefined: 2, "+": 3, "++": 4, ..._biases };
  const userItems = document.querySelectorAll(
    '#userList [data-status="online"][data-webcam="true"]:not(:has(:is(.fa.fa-lock, .fa.fa-eye-slash)))',
  );
  const entries = [];
  for (const item of userItems.values()) {
    const id = item.dataset.username?.split("_")[0];
    if (!id) continue;
    const status = GM_getValue(`${id}_status`);
    if ("--" !== status) {
      if (!isOnCooldown(id))
        entries.push({
          item,
          id,
          status,
          bias: biases[status],
          onlineSince: parseInt(
            item.querySelector(".userLabel [data-date]")?.dataset.date || "0",
          ),
        });
    }
  }
  entries.sort(compareFn);
  return entries;
};
function openCandidates(candidates) {
  const opened = document.querySelectorAll(PANEL_SELECTOR);
  let openedLength = opened.length || 0;
  const maxToOpen = +chatHTML5.roles.user.webcamMax;
  if (openedLength >= maxToOpen) {
    organizePanels();
    return console.log(`Max number of panels (${maxToOpen}) already open`);
  }
  const openedIds = new Set(
    Array.from(opened).map(panel => scrappers_getUsername(panel)),
  );
  while (openedLength < maxToOpen && candidates.length > 0) {
    const candidate = candidates.shift();
    if (openedIds.has(candidate.id)) continue;
    tryToOpenPanel(candidate);
    openedLength++;
  }
  organizePanels();
}

;// file://./src/betterbw/utils/waitToBe.ts
function waitToBe(
  selector,
  attributeFilter = ["aria-hidden"],
  predicate = el => "false" !== el.getAttribute("aria-hidden"),
) {
  return new Promise(resolve => {
    let attrObserver = null;
    let domObserver = null;
    function cleanup() {
      if (attrObserver) {
        attrObserver.disconnect();
        attrObserver = null;
      }
      if (domObserver) {
        domObserver.disconnect();
        domObserver = null;
      }
    }
    function attachAttrObserver(el) {
      if (!el) return false;
      if (predicate(el)) {
        cleanup();
        resolve(el);
        return true;
      }
      (attrObserver = new MutationObserver(muts => {
        for (const m of muts)
          if (
            "attributes" === m.type
            && m.attributeName
            && attributeFilter.includes(m.attributeName)
          ) {
            if (predicate(el)) {
              cleanup();
              resolve(el);
              return;
            }
          }
      })).observe(el, { attributes: true, attributeFilter });
      return false;
    }
    const existing = document.querySelector(selector);
    if (attachAttrObserver(existing)) return;
    (domObserver = new MutationObserver(muts => {
      for (const m of muts)
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          const found = node.matches(selector)
            ? node
            : node.querySelector(selector);
          if (found) {
            if (attachAttrObserver(found)) {
              if (domObserver) {
                domObserver.disconnect();
                domObserver = null;
              }
              return;
            }
          }
        }
    })).observe(document.body, { childList: true, subtree: true });
  });
}

;// CONCATENATED MODULE: external "jsxRuntime"
const external_jsxRuntime_namespaceObject = window.jsxRuntime;
;// CONCATENATED MODULE: external "preact"
const external_preact_namespaceObject = window.preact;
;// file://./src/betterbw/utils/formatters.ts
const dataUsername = id =>
  `[data-username="${id}"],[data-username^="${id}_"]`;

// EXTERNAL MODULE: ./src/betterbw/styles/tiers.css?inline
var tiersinline = __webpack_require__("./src/betterbw/styles/tiers.css?inline");
;// file://./src/betterbw/dynamicStyle.ts

const dataUserItems = group => group.map(dataUsername).join(",");
async function getCSS() {
  const values = GM_getValues(
    GM_listValues().filter(key => key.match(/\.*?_status/)),
  );
  const groups = { "--": [], "-": [], "+": [], "++": [] };
  for (const [key, value] of Object.entries(values)) {
    const id = key.split("_")[0];
    groups[value].push(id);
  }
  const selectors = {
    group_minus_minus: dataUserItems(groups["--"]),
    group_minus: dataUserItems(groups["-"]),
    group_plus: dataUserItems(groups["+"]),
    group_plus_plus: dataUserItems(groups["++"]),
  };
  return tiersinline/* ["default"].replace */.A.replace(
    /\.(group_\w+)/gm,
    (_match, key, openStyle) => selectors[key] + openStyle,
  );
}
const dynamicStyle = GM_addStyle("");
const refreshDynamicStyle = async () =>
  requestAnimationFrame(async () => (dynamicStyle.innerHTML = await getCSS()));
refreshDynamicStyle();

;// file://./src/betterbw/features/rotateCam.tsx
function getRotation(element) {
  if (!element || !element.dataset.rotation) return 0;
  return parseInt(element.dataset.rotation, 10) || 0;
}
function rotateCam({ id, panel }) {
  const newRotation = (getRotation(panel) + 90) % 360;
  panel.dataset.rotation = newRotation;
  GM_setValue(`${id}_rotation`, newRotation);
}

;// file://./src/betterbw/features/panelActions.tsx

const BtnClassify = ({ getUsername, panel, value, title, onClick }) =>
  (0,external_jsxRuntime_namespaceObject.jsx)("button", {
    "data-status-value": value,
    title: title,
    className: "panel-action-btn",
    onClick: e => {
      const username = getUsername();
      if (username) {
        GM_setValue(`${username}_status`, value);
        refreshDynamicStyle();
      }
      if (panel) panel.dataset.status = value;
      onClick?.(e);
    },
    children: value,
  });
const BtnMinus2 = ({ getUsername, panel }) =>
  (0,external_jsxRuntime_namespaceObject.jsx)(BtnClassify, {
    getUsername: getUsername,
    panel: panel,
    value: "--",
    title: "Nope\nDo not suggest this person.",
    onClick: () => {
      if (panel) jsPanel.activePanels.getPanel(panel.id)?.close();
    },
  });
const BtnMinus1 = props =>
  (0,external_jsxRuntime_namespaceObject.jsx)(BtnClassify, {
    value: "-",
    title: "So so\nIt depends on the day, on the mood...",
    ...props,
  });
const BtnPlus1 = props =>
  (0,external_jsxRuntime_namespaceObject.jsx)(BtnClassify, {
    value: "+",
    title: "Yeah\nI liked you, buddy",
    ...props,
  });
const BtnPlus2 = props =>
  (0,external_jsxRuntime_namespaceObject.jsx)(BtnClassify, {
    value: "++",
    title: "Ohhh Yeah!\nI liked you a lot, buddy!",
    ...props,
  });
const BtnRotate = ({ panel, getUsername }) =>
  (0,external_jsxRuntime_namespaceObject.jsx)("button", {
    title: "Rotate",
    className: "panel-action-btn",
    onClick: () => {
      if (panel) rotateCam({ id: getUsername(), panel });
    },
    children: "⟳",
  });
const BtnCooldown = ({ panel, getUsername }) =>
  (0,external_jsxRuntime_namespaceObject.jsx)("button", {
    title: "Cooldown 15m\nDo not suggest this person for the next 15 minutes",
    className: "panel-action-btn",
    onClick: () => cooldownIt({ username: getUsername(), panel }),
    children: "⏱",
  });
const PanelActions = ({ panel, username }) => {
  const props = { panel, getUsername: () => username };
  return (0,external_jsxRuntime_namespaceObject.jsxs)(external_jsxRuntime_namespaceObject.Fragment, {
    children: [
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnCooldown, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnRotate, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnPlus2, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnPlus1, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnMinus1, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnMinus2, { ...props }),
    ],
  });
};
const MenuActions = () => {
  const props = { getUsername: getLatestUser };
  return (0,external_jsxRuntime_namespaceObject.jsxs)("div", {
    children: [
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnCooldown, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnPlus2, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnPlus1, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnMinus1, { ...props }),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnMinus2, { ...props }),
    ],
  });
};
function getLatestUser() {
  try {
    return chatHTML5.myUser.id.split("_")[0];
  } catch (e) {
    console.error("Oooops...");
    const muteItem = $('#userMenu [data-action="mute"]')[0];
    return muteItem?.textContent.split(" ").at(-1)?.split("_").at(0);
  }
}
function resizePanel(panelJS) {
  panelJS.resize({ width: gridconf.WIDTH, height: gridconf.HEIGHT });
}
function monitorVideoReadiness(video, panel, panelJS) {
  let timeoutId;
  const cleanup = () => {
    clearTimeout(timeoutId);
    video.removeEventListener("loadeddata", onVideoReady);
  };
  const onVideoReady = () => {
    cleanup();
  };
  const originalClose = panelJS.close.bind(panelJS);
  panelJS.close = function () {
    cleanup();
    return originalClose();
  };
  timeoutId = setTimeout(() => {
    cooldownIt({ username: scrappers_getUsername(panel), minutes: 5 });
    panelJS.close();
  }, 25000);
  video.addEventListener("loadeddata", onVideoReady);
}
function attachPanelActions(panel) {
  if ("1" === panel.dataset.actionsAttached) return;
  const panelJS = jsPanel.activePanels.getPanel(panel.id);
  if (!panelJS) return console.warn("Panel not found for", panel.id);
  resizePanel(panelJS);
  const header = $(".jsPanel-hdr .jsPanel-title", panel)[0];
  if (!header) return;
  const username = scrappers_getUsername(panel);
  if (!username) return;
  panel.dataset.username = username;
  panel.dataset.status = GM_getValue(`${username}_status`);
  const actions = document.createElement("div");
  actions.className = "panel-action";
  header.appendChild(actions);
  (0,external_preact_namespaceObject.render)((0,external_jsxRuntime_namespaceObject.jsx)(PanelActions, { username: username, panel: panel }), actions);
  panel.dataset.actionsAttached = "1";
  panel.dataset.rotation = GM_getValue(`${username}_rotation`);
  $(".jsPanel-btn.jsPanel-btn-close", panel).on("click", () => {
    cooldownIt({ username: username, minutes: 1 });
  });
  $(".userAvatar", panel).on("click", event => {
    event.stopPropagation();
    if (!("pageX" in event && "pageY" in event)) return;
    if ($("#userMenu").is(":visible")) return void $("#userMenu").hide();
    $(
      `#userList .userItem[data-id=${JSON.stringify(panel.id.split("_")[2])}]`,
    ).trigger(
      new jQuery.Event("click", { pageX: event.pageX + 3, pageY: event.pageY }),
    );
  });
  const video = panel.querySelector("video");
  if (video) {
    video.volume = 0.08;
    monitorVideoReadiness(video, panel, panelJS);
  }
}
function cleanupPanel(panel) {}

;// file://./src/betterbw/utils/spyOn.ts
function spyOn(obj, watchers) {
  return Proxy.revocable(obj, {
    set(target, prop, value) {
      if (prop in watchers && target[prop] !== value) watchers[prop](value);
      target[prop] = value;
      return true;
    },
  });
}

// EXTERNAL MODULE: ./src/betterbw/styles/openPanels.css?inline
var openPanelsinline = __webpack_require__("./src/betterbw/styles/openPanels.css?inline");
;// file://./src/betterbw/dynamicOpenedStyle.ts

const dynamicOpenedStyle = GM_addStyle("");
function updateCssForOpenedPanels() {
  const opened = queryPanels();
  if (!opened?.length) return;
  const usernames = Array.from(opened)
    .map(panel => scrappers_getUsername(panel))
    .filter(v => null != v);
  const selectorsIamWatching = usernames.map(dataUsername).join(",");
  const selectorsWatchingMe = usernames
    .map(
      id =>
        `body:has(#userList .userItem:where(${dataUsername(id)}) .eye-icon .isWatching) .jsPanel[data-username="${id}"]`,
    )
    .join(", ");
  dynamicOpenedStyle.innerHTML = openPanelsinline/* ["default"].replace */.A.replace(/\[data-username="I_am_watching"\]/g, selectorsIamWatching)
    .replace(/\.user_watching_me/g, selectorsWatchingMe);
}

;// file://./src/betterbw/features/tabFocus.ts
const tabFocused = () => "visible" === document.visibilityState;
const whenTabFocused = callback => {
  document.addEventListener(
    "visibilitychange",
    () => {
      "visible" === document.visibilityState && callback();
    },
    { once: true, passive: true },
  );
};

;// file://./src/betterbw/utils/observeIt.ts
function iterate(nodes, selector, fn) {
  let found = false;
  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) continue;
    const panels = node.matches(selector)
      ? [node]
      : node.querySelectorAll(selector);
    if (panels.length) {
      if (fn) panels.forEach(fn);
      found = true;
    }
  }
  return found;
}
function observeIt({
  target,
  selector,
  forEachAddedNode,
  forEachRemovedNode,
  cleanup,
}) {
  const observerPanels = new MutationObserver(mutations => {
    let nodesAdded = false;
    let nodesRemoved = false;
    for (const mutation of mutations) {
      if (iterate(mutation.addedNodes, selector, forEachAddedNode))
        nodesAdded = true;
      if (iterate(mutation.removedNodes, selector, forEachRemovedNode))
        nodesRemoved = true;
    }
    cleanup?.({ nodesAdded, nodesRemoved });
  });
  observerPanels.observe(target, { childList: true, subtree: false });
  return {
    teardown: () => {
      observerPanels.disconnect();
    },
  };
}

;// CONCATENATED MODULE: external "preactHooks"
const external_preactHooks_namespaceObject = window.preactHooks;
;// file://./src/betterbw/algo.ts
let algo_algo = "";
const getAlgo = () => algo_algo;
const setAlgo = val => {
  document.body.dataset.algo = algo_algo = val;
};

;// file://./src/betterbw/utils/debounce.ts
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

;// file://./src/betterbw/features/globalActions.tsx

const btnDisableClick = () => {
  organizePanels();
  setAlgo("");
};
const BtnDisable = () =>
  (0,external_jsxRuntime_namespaceObject.jsx)("button", {
    "data-sort-order": "",
    title: "Organize open panels and stop the algorithm",
    onClick: btnDisableClick,
    children: "\xf8",
  });
const btnNewClick = () => {
  setAlgo("new");
  openCandidates(getCandidates(topRandom, { undefined: 9, "+": 8 }));
};
const BtnNew = () =>
  (0,external_jsxRuntime_namespaceObject.jsx)("button", {
    "data-sort-order": "new",
    title: "Prioritize users you haven't liked/disliked before",
    onClick: btnNewClick,
    children: "New",
  });
const btnTopClick = () => {
  setAlgo("top");
  openCandidates(getCandidates(topRandom));
};
const BtnTop = () =>
  (0,external_jsxRuntime_namespaceObject.jsx)("button", {
    "data-sort-order": "top",
    title: "Prioritize users you liked more",
    onClick: btnTopClick,
    children: "Top",
  });
const clickOnCurrentAlgoButton = debounce(() => {
  const algo = getAlgo();
  if ("new" === algo) btnNewClick();
  else if ("top" === algo) btnTopClick();
  else if ("" === algo) organizePanels();
}, 200);
const NumberOfCams = () => {
  const [value, setValue] = (0,external_preactHooks_namespaceObject.useState)(() => GM_getValue("user.webcamMax", 10));
  (0,external_preactHooks_namespaceObject.useEffect)(() => {
    const maxWebcamreached = chatHTML5.maxWebcamreached;
    chatHTML5.maxWebcamreached = function () {
      if (!maxWebcamreached()) return false;
      chatHTML5.roles.user.webcamMax = +chatHTML5.roles.user.webcamMax + 1;
      return maxWebcamreached();
    };
    const { proxy, revoke } = spyOn(chatHTML5.roles.user, {
      webcamMax: n => {
        setValue(n);
        GM_setValue("user.webcamMax", n);
      },
    });
    chatHTML5.roles.user = proxy;
    return () => {
      chatHTML5.maxWebcamreached = maxWebcamreached;
      revoke();
    };
  }, []);
  (0,external_preactHooks_namespaceObject.useEffect)(() => {
    clickOnCurrentAlgoButton();
  }, [value]);
  return (0,external_jsxRuntime_namespaceObject.jsxs)("label", {
    children: [
      (0,external_jsxRuntime_namespaceObject.jsx)("input", {
        title: "# of open cams",
        type: "number",
        className: "numberOfCams",
        value: value,
        onChange: e => {
          chatHTML5.roles.user.webcamMax = +e.currentTarget.value;
        },
      }),
      " cams",
    ],
  });
};
const globalActions_onChangeEffect = value => {
  gridconf.WIDTH = +value;
  gridconf.HEIGHT = value * panelRatio;
  clickOnCurrentAlgoButton();
};
const PanelSizeInput = () =>
  (0,external_jsxRuntime_namespaceObject.jsx)(MemoInput, {
    storageKey: "config.webcamWidth",
    title: "Size of the panel",
    type: "number",
    className: "numberOfCams",
    suffix: "px",
    min: "150",
    step: "5",
    defaultValue: gridconf.WIDTH,
    onChangeEffect: globalActions_onChangeEffect,
  });
const MemoInput = ({
  storageKey,
  prefix,
  suffix,
  defaultValue,
  onChangeEffect,
  ...props
}) => {
  const [value, setValue] = (0,external_preactHooks_namespaceObject.useState)(() =>
    GM_getValue(storageKey, defaultValue),
  );
  (0,external_preactHooks_namespaceObject.useEffect)(() => {
    onChangeEffect(value);
  }, [value]);
  return (0,external_jsxRuntime_namespaceObject.jsxs)("label", {
    children: [
      prefix,
      (0,external_jsxRuntime_namespaceObject.jsx)("input", {
        ...props,
        value: value,
        onChange: e => {
          const value = e.currentTarget.value;
          setValue(value);
          GM_setValue(storageKey, value);
        },
      }),
      suffix,
    ],
  });
};
const AlgoControls = () =>
  (0,external_jsxRuntime_namespaceObject.jsxs)(external_jsxRuntime_namespaceObject.Fragment, {
    children: [
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnTop, {}),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnNew, {}),
      (0,external_jsxRuntime_namespaceObject.jsx)(BtnDisable, {}),
      (0,external_jsxRuntime_namespaceObject.jsx)(NumberOfCams, {}),
      " @ ",
      (0,external_jsxRuntime_namespaceObject.jsx)(PanelSizeInput, {}),
    ],
  });

;// file://./src/betterbw/features/observeOpenPanels.ts

let observeOpenPanels_nextUser = null;
const setNextCam = val => (observeOpenPanels_nextUser = val);
let clickRequested = false;
function observePanels() {
  return observeIt({
    target: document.body,
    selector: PANEL_SELECTOR,
    forEachAddedNode: attachPanelActions,
    forEachRemovedNode: cleanupPanel,
    cleanup: ({ nodesAdded, nodesRemoved }) => {
      if (!nodesAdded && !nodesRemoved) return;
      organizePanels();
      if (nodesRemoved) {
        if (observeOpenPanels_nextUser) {
          $(".webcamBtn.visible", observeOpenPanels_nextUser).trigger("click");
          observeOpenPanels_nextUser = null;
        } else if (tabFocused()) clickOnCurrentAlgoButton();
        else if (!clickRequested) {
          clickRequested = true;
          whenTabFocused(() => {
            clickRequested = false;
            clickOnCurrentAlgoButton();
          });
        }
      }
      updateCssForOpenedPanels();
    },
  });
}

;// file://./src/betterbw/features/spyOnConfig.ts

function spyOnConfig(watchers = {}) {
  const { proxy, revoke } = spyOn(chatHTML5.config, watchers);
  chatHTML5.config = proxy;
  return { proxy, revoke, watchers };
}

;// file://./src/betterbw/setupTools.tsx

function setupHeader() {
  const header = $("#header .header-custom-btns")[0];
  if (!header) return;
  const controls = document.createElement("div");
  controls.id = "bbw_controls";
  header.prepend(controls);
  (0,external_preact_namespaceObject.render)((0,external_jsxRuntime_namespaceObject.jsx)(AlgoControls, {}), controls);
}
function setupUserMenu() {
  const userMenu = $("#userMenu")[0];
  if (!userMenu) return;
  const controls = document.createElement("div");
  controls.id = "bbw_controls";
  userMenu.appendChild(controls);
  (0,external_preact_namespaceObject.render)((0,external_jsxRuntime_namespaceObject.jsx)(MenuActions, {}), controls);
  chatHTML5.myUser = spyOn(chatHTML5.myUser, {
    selectedUserid: selectedUserid => {
      const nuser = getUserById(selectedUserid);
      if (!nuser) return;
      userMenu.dataset.username = nuser.username;
      userMenu.dataset.status = GM_getValue(`${nuser.username}_status`);
      userMenu.dataset.isCooldown = Boolean(
        isOnCooldown(nuser.username),
      ).toString();
      userMenu.dataset.privateCam = Boolean(!nuser.obj.webcamPublic).toString();
    },
  }).proxy;
}
function setupSidebar() {
  const userList = document.getElementById("userList");
  if (!userList) return;
  $(userList).on("click", ".webcamBtn", function (event) {
    const opened = queryPanels();
    const webcamMax = +chatHTML5.roles.user.webcamMax;
    if (opened.length < webcamMax) return;
    const nextUser = $(this).closest(".userItem")[0];
    if (nextUser) {
      event.stopPropagation();
      setNextCam(nextUser);
      const panel = $(`[data-grid-index="${webcamMax - 1}"]`)[0];
      if (panel) jsPanel.activePanels.getPanel(panel.id)?.close();
    }
  });
  $(userList).on("click", ".fa-eye.fa-2x", function (e) {
    if (e.shiftKey) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  });
}
const ConfigWatchers = {};
function setupTools() {
  chatHTML5.config.timeBeforeWatchingCamAgain = "1000";
  chatHTML5.config.checkOwnStream = "1";
  chatHTML5.config.showCountryFlag = "1";
  chatHTML5.roles.user.webcamMax = GM_getValue("user.webcamMax", 10);
  const { revoke } = spyOnConfig(ConfigWatchers);
  chatHTML5.amIMuted = () => chatHTML5.myUser.mutedUntil > Date.now();
  setupHeader();
  setupUserMenu();
  setupSidebar();
  $("#sortWebcamtBtn").trigger("click");
  return revoke;
}

;// file://./src/betterbw/features/observeChat.tsx

function handleWebcamOpened(message) {
  const span = $("[data-id]", message)[0];
  if (!span) return;
  const user = getUserById(span.dataset.id);
  if (!user) return;
  message.dataset.username = user.username;
  const privateCam = Boolean(!user.obj.webcamPublic);
  message.dataset.privateCam = privateCam.toString();
  span.innerHTML = span.innerHTML.replace(
    /(User )(.*?)( has opened his webcam)/gi,
    `$1<span class="userLabelBBW" data-username=${JSON.stringify(user.username)}>$2</span>$3`,
  );
  if (!privateCam) clickOnCurrentAlgoButton();
}
function handleRegularMessage(message) {
  const msgHeader = $("[data-ip]", message)[0];
  if (!msgHeader) return;
  msgHeader.classList.add("userLabelBBW", "sender");
}
function handleWhisperOrPrivateMessage(message) {
  const msgHeader = $("[data-ip]", message)[0];
  if (!msgHeader || !msgHeader.childNodes.length) return;
  {
    const firstChild = msgHeader.childNodes[0];
    const span = document.createElement("span");
    span.dataset.username = msgHeader.dataset.username;
    span.classList.add("userLabelBBW", "sender");
    msgHeader.insertBefore(span, firstChild);
    span.appendChild(firstChild);
  }
  {
    const thirdChild = msgHeader.childNodes[2];
    const span = document.createElement("span");
    span.dataset.username = thirdChild.textContent?.trim();
    span.classList.add("userLabelBBW", "receiver");
    msgHeader.insertBefore(span, thirdChild);
    span.appendChild(thirdChild);
  }
}
function handlePrivateRequested(message) {
  const textNode = Array.from(message.childNodes).find(
    n => 3 === n.nodeType && n.textContent?.trim(),
  );
  if (!textNode || !textNode.textContent) return;
  const textContent = textNode.textContent;
  const match = textContent.match(
    /\s*(\S+?)\s+has invited you to watch his cam/,
  );
  if (!match) return;
  const username = match[1];
  if (!username) return;
  const span = document.createElement("span");
  span.className = "userLabelBBW";
  span.dataset.username = username;
  span.textContent = username;
  message.insertBefore(span, textNode);
  textNode.textContent = textContent.replace(/(^\s*\S+?)(\s+.*$)/, "$2");
}
function handleWebcamRequest(message) {}
function handleChatMessage(message) {
  if (message.matches(".serverMessage.webcamOpened"))
    handleWebcamOpened(message);
  else if (message.matches(".message.msg-box:not(.whisper)"))
    handleRegularMessage(message);
  else if (
    message.matches(".message.addPrivateMessage,.message.msg-box.whisper")
  )
    handleWhisperOrPrivateMessage(message);
  else if (message.matches(".serverMessage.privateRequested"))
    handlePrivateRequested(message);
  else if (message.matches(".serverMessage.webcamRequest"))
    handleWebcamRequest(message);
}
function observeChat(room) {
  return observeIt({
    target: room,
    selector: ".message,.serverMessage",
    forEachAddedNode: handleChatMessage,
    forEachRemovedNode: message => {
      console.log("Chat message removed in", room.id, message);
    },
  });
}
function observeChatNav() {
  const tabs = {};
  return observeIt({
    target: $("#tabs .tab-content")[0],
    selector: ".tab-pane",
    forEachAddedNode: room => {
      tabs[room.id] = observeChat(room);
    },
    forEachRemovedNode: room => {
      if (room.id in tabs) {
        tabs[room.id]?.teardown?.();
        delete tabs[room.id];
      }
    },
  });
}

;// file://./src/betterbw/betterbw.user.ts

async function main() {
  GM_addStyle(staticinline/* ["default"] */.A);
  observeChatNav();
  observePanels();
  await waitToBe(
    "#roomsModal",
    ["aria-hidden"],
    el => "false" === el.getAttribute("aria-hidden"),
  );
  await waitToBe(
    "#roomsModal",
    ["aria-hidden"],
    el => "false" !== el.getAttribute("aria-hidden"),
  );
  setupTools();
  openCandidates(getCandidates(topRandom));
}

;// file://./src/betterbw/index.ts

chatHTML5.myUser.mutedUsers = chatHTML5.myUser.mutedUsers || "";
main();

