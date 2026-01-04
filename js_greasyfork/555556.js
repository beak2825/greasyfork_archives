// ==UserScript==
// @name WTR-Lab Novel Reviewer
// @description Analyzes novels on wtr-lab.com using Gemini AI to provide comprehensive assessments including character development, plot structure, world-building, themes & messages, and writing style.
// @version 1.8.7
// @author MasuRii
// @supportURL https://github.com/MasuRii/wtr-lab-novel-reviewer/issues
// @match https://wtr-lab.com/en/for-you
// @match https://wtr-lab.com/en/for-you?*
// @match https://wtr-lab.com/en/novel-finder*
// @connect generativelanguage.googleapis.com
// @connect fonts.googleapis.com
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @grant GM_xmlhttpRequest
// @grant GM_getResourceText
// @icon https://www.google.com/s2/favicons?sz=64&domain=wtr-lab.com
// @license MIT
// @namespace http://tampermonkey.net/
// @run-at document-idle
// @website https://github.com/MasuRii/wtr-lab-novel-reviewer
// @downloadURL https://update.greasyfork.org/scripts/555556/WTR-Lab%20Novel%20Reviewer.user.js
// @updateURL https://update.greasyfork.org/scripts/555556/WTR-Lab%20Novel%20Reviewer.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 41:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Mobile considerations */
.mobile-close-btn {
	display: none; /* Hidden by default on desktop */
}

@media (width <= 768px) {
	.mobile-close-btn {
		display: block;
		position: absolute;
		top: 10px;
		right: 10px;
		width: 30px;
		height: 30px;
		background: rgb(255 255 255 / 10%);
		border-radius: 50%;
		text-align: center;
		line-height: 30px;
		font-size: 20px;
		cursor: pointer;
		z-index: 101; /* Above content */
	}

	.gemini-summary-card {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 90%;
		max-width: 400px;
		max-height: 80vh;
		z-index: 1000;
	}

	#gemini-api-key-modal {
		width: 95%;
		padding: 15px;
	}

	#gemini-api-key-modal .buttons {
		flex-direction: column;
		gap: 10px;
	}

	#gemini-api-key-modal button {
		width: 100%;
		margin: 0;
	}

	/* Settings Panel responsive design */
	#gemini-settings-panel {
		width: 95%;
		max-width: none;
		padding: 15px;
	}

	#gemini-settings-panel .buttons {
		flex-direction: column;
		align-items: stretch;
		gap: 10px;
	}

	#gemini-settings-panel .clear-cache-btn {
		margin-right: 0;
		order: 2;
		width: 100%;
	}

	#gemini-settings-panel .buttons button:not(.clear-cache-btn) {
		width: 100%;
		margin-left: 0;
	}

	#gemini-mapping-failure-notification {
		width: calc(100% - 40px);
		right: 20px;
		left: 20px;
	}
}

/* Extra small screens */
@media (width <= 600px) {
	#gemini-settings-panel {
		width: 98%;
		padding: 12px;
	}

	#gemini-settings-panel .buttons {
		gap: 8px;
	}

	#gemini-settings-panel button {
		padding: 10px 12px;
		font-size: 14px;
	}

	#gemini-api-key-modal {
		width: 98%;
		padding: 12px;
	}

	#gemini-api-key-modal .buttons {
		gap: 8px;
	}

	#gemini-api-key-modal button {
		padding: 10px 12px;
		font-size: 14px;
	}
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 56:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 72:
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 113:
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ 193:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Color coding for assessment ratings */
.assessment-rating {
	font-weight: bold;
	padding: 2px 6px;
	border-radius: 3px;
}

.assessment-rating.good {
	color: #4caf50;
	background-color: rgb(76 175 80 / 10%);
}

.assessment-rating.mixed {
	color: #ff9800;
	background-color: rgb(255 152 0 / 10%);
}

.assessment-rating.bad {
	color: #f44336;
	background-color: rgb(244 67 54 / 10%);
}

.assessment-rating.unknown {
	color: #9e9e9e;
	background-color: rgb(158 158 158 / 10%);
	border: 1px solid rgb(158 158 158 / 30%);
	font-style: italic;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 229:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Base stylesheet for WTR-Lab Novel Reviewer */

/* Keyframe animations */
@keyframes slide-in-right {
	from {
		transform: translateX(100%);
		opacity: 0;
	}

	to {
		transform: translateX(0);
		opacity: 1;
	}
}

/* Utility classes */
.material-icons {
	/* Inherit from vendor/_material-icons.css */
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 279:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Mapping Failure Notification */
#gemini-mapping-failure-notification {
	position: fixed;
	top: 80px;
	right: 20px;
	width: 400px;
	background-color: #dc3545;
	color: white;
	border-radius: 8px;
	box-shadow: 0 6px 16px rgb(0 0 0 / 40%);
	z-index: 10000;
	animation: slide-in-right 0.3s ease-out;
}

#gemini-mapping-failure-notification .notification-content {
	display: flex;
	align-items: flex-start;
	padding: 16px;
	gap: 12px;
}

#gemini-mapping-failure-notification .notification-icon {
	font-size: 28px;
	flex-shrink: 0;
}

#gemini-mapping-failure-notification .notification-text {
	flex: 1;
}

#gemini-mapping-failure-notification .notification-text strong {
	display: block;
	font-size: 1.1em;
	margin-bottom: 4px;
}

#gemini-mapping-failure-notification .notification-text p {
	margin: 0;
	font-size: 0.95em;
	line-height: 1.4;
}

#gemini-mapping-failure-notification .notification-close {
	background: none;
	border: none;
	color: white;
	font-size: 24px;
	cursor: pointer;
	padding: 0;
	width: 24px;
	height: 24px;
	line-height: 1;
	flex-shrink: 0;
}

#gemini-mapping-failure-notification .notification-close:hover {
	opacity: 0.8;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 314:
/***/ ((module) => {



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

/***/ }),

/***/ 355:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Title area styling to accommodate the summary trigger */
.title-wrap {
	position: relative;
	padding-right: 45px; /* Space for the summary trigger button */
}

/* Summary Icon and Tooltip */
.gemini-summary-container {
	/* This container is now a direct child of the .card element */
}

.gemini-summary-trigger {
	position: absolute;
	top: 50%;
	right: 8px; /* Position within the title-wrap padding area */
	transform: translateY(-50%);
	cursor: pointer;
	z-index: 5;
	background-color: rgb(0 0 0 / 60%);
	border-radius: 50%;
	width: 28px;
	height: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
}

.gemini-summary-trigger .material-icons {
	font-size: 16px;
}

.gemini-summary-card {
	display: none;
	position: absolute;
	top: 50%;
	right: calc(100% + 15px);
	transform: translateY(-50%);
	width: 400px;
	max-height: 600px;
	background-color: #212529;
	border: 1px solid #495057;
	border-radius: 8px;
	padding: 15px;
	z-index: 100;
	color: #f8f9fa;
	font-size: 0.9em;
	box-shadow: 0 6px 12px rgb(0 0 0 / 40%);
	overflow-y: auto;
}

.gemini-summary-card h4 {
	margin: 0 0 8px;
	color: #fff;
	font-size: 1.1em;
	font-weight: 600;
}

.gemini-summary-card h5 {
	margin: 10px 0 5px;
	color: #adb5bd;
	font-size: 1em;
	font-weight: 500;
}

.gemini-summary-card p {
	margin: 0 0 10px;
	line-height: 1.4;
}

.gemini-summary-card .assessment-section {
	margin-bottom: 12px;
}

.gemini-summary-card .assessment-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	gap: 8px;
	margin-top: 8px;
}

.gemini-summary-card .assessment-item {
	font-size: 0.85em;
}

.gemini-summary-card .summary-toggle {
	cursor: pointer;
	user-select: none;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: rgb(255 255 255 / 5%);
	padding: 8px 12px;
	border-radius: 4px;
	margin-bottom: 8px;
	transition: background-color 0.2s ease;
}

.gemini-summary-card .summary-toggle:hover {
	background-color: rgb(255 255 255 / 10%);
}

.gemini-summary-card .summary-toggle .toggle-icon {
	font-size: 1.2em;
	transition: transform 0.2s ease;
}

.gemini-summary-card .summary-toggle.collapsed .toggle-icon {
	transform: rotate(-90deg);
}

.gemini-summary-card .summary-content {
	max-height: 0;
	overflow: hidden;
	transition: max-height 0.3s ease;
	margin-bottom: 10px;
}

.gemini-summary-card .summary-content.expanded {
	max-height: 200px; /* Scrolling enabled for long content */
	overflow-y: auto;
}

.gemini-summary-card .summary-content p {
	margin: 10px 0;
	line-height: 1.4;
	padding: 0 12px;
}

.gemini-summary-card.locked {
	display: block;
}

.gemini-summary-card:hover:not(.locked),
.gemini-summary-trigger:hover + .gemini-summary-card:not(.locked) {
	display: block;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 483:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Material Icons font declarations */
@font-face {
	font-family: "Material Icons";
	font-style: normal;
	font-weight: 400;
	src: url("https://fonts.gstatic.com/s/materialicons/v145/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2") format("woff2");
}

@font-face {
	font-family: "Material Icons Outlined";
	font-style: normal;
	font-weight: 400;
	src: url("https://fonts.gstatic.com/s/materialiconsoutlined/v110/gok-H7zzDkdnRel8-DQ6KAXJ69wP1tGnf4ZGhUcd.otf")
		format("opentype");
}

@font-face {
	font-family: "Material Icons Round";
	font-style: normal;
	font-weight: 400;
	src: url("https://fonts.gstatic.com/s/materialiconsround/v109/LDItaoyNOAY6Uewc665JcIzCKsKc_M9flwmM.otf")
		format("opentype");
}

@font-face {
	font-family: "Material Icons Sharp";
	font-style: normal;
	font-weight: 400;
	src: url("https://fonts.gstatic.com/s/materialiconssharp/v110/oPWQ_lt5nv4pWNJpghLP75WiFR4kLh3kvmvS.otf")
		format("opentype");
}

@font-face {
	font-family: "Material Icons Two Tone";
	font-style: normal;
	font-weight: 400;
	src: url("https://fonts.gstatic.com/s/materialiconstwotone/v113/hESh6WRmNCxEqUmNyh3JDeGxjVVyMg4tHGctNCu3.otf")
		format("opentype");
}

/* Material Icons font declaration */
.material-icons {
	font-family: "Material Icons", sans-serif;
	font-weight: normal;
	font-style: normal;
	font-size: 24px;
	line-height: 1;
	letter-spacing: normal;
	text-transform: none;
	display: inline-block;
	white-space: nowrap;
	overflow-wrap: normal;
	direction: ltr;
	font-feature-settings: "liga";
	-webkit-font-smoothing: antialiased;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 532:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Button Components */

.gemini-summary-trigger.disabled {
	background-color: rgb(128 128 128 / 60%); /* Greyed out */
	cursor: not-allowed;
	opacity: 0.7;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 538:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Settings Panel */
#gemini-settings-panel {
	display: none;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: #2c3034;
	color: white;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 5px 15px rgb(0 0 0 / 50%);
	z-index: 9999;
	max-width: 500px;
	width: 100%;
}

#gemini-settings-panel h3 {
	margin-top: 0;
}

#gemini-settings-panel label {
	display: block;
	margin: 10px 0 5px;
}

#gemini-settings-panel input,
#gemini-settings-panel select {
	width: 100%;
	padding: 8px;
	border-radius: 4px;
	border: 1px solid #495057;
	background-color: #212529;
	color: white;
	box-sizing: border-box;
}

/* Debug logging label with flexbox for checkbox alignment */
#gemini-settings-panel .debug-logging-label {
	display: flex;
	align-items: center;
	gap: 10px;
}

#gemini-settings-panel .debug-logging-label input[type="checkbox"] {
	width: auto;
	margin: 0;
}

#gemini-settings-panel .buttons {
	margin-top: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 10px;
}

/* Clear cache button pushed to the left */
#gemini-settings-panel .clear-cache-btn {
	background-color: #dc3545;
	color: white;
	margin-right: auto;
}

/* General button styling */
#gemini-settings-panel button {
	padding: 8px 15px;
	border-radius: 4px;
	border: none;
	cursor: pointer;
}

#gemini-settings-save {
	background-color: #0d6efd;
	color: white;
}

#gemini-settings-close {
	background-color: #6c757d;
	color: white;
}

/* API Key Modal */
#gemini-api-key-modal {
	display: none;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: #2c3034;
	color: white;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 5px 15px rgb(0 0 0 / 50%);
	z-index: 9999;
	width: 100%;
	max-width: 500px;
	max-height: 80vh;
	overflow-y: auto;
}

#gemini-api-key-modal h3 {
	margin-top: 0;
	color: #fff;
	text-align: center;
}

#gemini-api-key-modal .instructions {
	margin-bottom: 20px;
}

#gemini-api-key-modal .instructions ol {
	text-align: left;
	padding-left: 20px;
}

#gemini-api-key-modal .instructions li {
	margin-bottom: 8px;
}

#gemini-api-key-modal label {
	display: block;
	margin: 10px 0 5px;
	font-weight: bold;
}

#gemini-api-key-modal input {
	width: 100%;
	padding: 8px;
	border-radius: 4px;
	border: 1px solid #495057;
	background-color: #212529;
	color: white;
	box-sizing: border-box;
}

#gemini-api-key-modal .buttons {
	margin-top: 20px;
	display: flex;
	justify-content: flex-end;
}

#gemini-api-key-modal button {
	margin: 0 0 0 10px;
	padding: 8px 15px;
	border-radius: 4px;
	border: none;
	cursor: pointer;
	background-color: #0d6efd;
	color: white;
}

#gemini-api-key-modal-close {
	background-color: #6c757d;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 540:
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ 601:
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 659:
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ 731:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Color-coded Username Styling */
.username-color-coded {
	background-color: rgb(255 255 255 / 10%);
	padding: 1px 3px;
	border-radius: 2px;
	font-weight: 600;
	transition: all 0.2s ease;
	border: 1px solid transparent;
}

.username-color-coded:hover {
	background-color: rgb(255 255 255 / 20%);
	border-color: rgb(255 255 255 / 30%);
	transform: translateY(-1px);
}

/* Anonymous user styling */
.username-color-coded.anonymous {
	background-color: rgb(149 165 166 / 20%);
	color: #bdc3c7 !important;
	border: 1px solid rgb(189 195 199 / 30%);
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 825:
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ 933:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Card modifications */
.gemini-good-novel .card-body {
	background-color: #2e462e !important;
	border: 1px solid #578857;
} /* Dark Green */

.gemini-mixed-novel .card-body {
	background-color: #46402e !important;
	border: 1px solid #887a57;
} /* Dark Yellow/Orange */

.gemini-bad-novel .card-body {
	background-color: #462e2e !important;
	border: 1px solid #885757;
} /* Dark Red */

.gemini-processing-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgb(0 0 0 / 50%);
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1.2em;
	z-index: 10;
	border-radius: var(--bs-card-inner-border-radius);
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

;// ./src/config/constants.js
/**
 * Application Constants
 * Contains fixed configuration values and constants used throughout the application
 */

const GEMINI_MODELS = [
	"gemini-2.5-pro",
	"gemini-flash-latest",
	"gemini-flash-lite-latest",
	"gemini-2.5-flash",
	"gemini-2.5-flash-lite",
]

// Retry and timeout constants
const MAX_RETRIES = 3
const INITIAL_DELAY_MS = 1000

// Mapping constants
const MAPPING_RETRY_ATTEMPTS = 3
const MAPPING_RETRY_DELAY = 2000

// Username color system constants
const USERNAME_COLORS = [
	"#e74c3c", // Red
	"#3498db", // Blue
	"#2ecc71", // Green
	"#f39c12", // Orange
	"#9b59b6", // Purple
	"#1abc9c", // Teal
	"#e67e22", // Dark Orange
	"#34495e", // Dark Blue-Gray
	"#e91e63", // Pink
	"#ff5722", // Deep Orange
	"#795548", // Brown
	"#607d8b", // Blue Gray
	"#8bc34a", // Light Green
	"#ffc107", // Amber
	"#673ab7", // Deep Purple
	"#00bcd4", // Cyan
	"#ff9800", // Orange
	"#4caf50", // Green
	"#2196f3", // Blue
	"#f44336", // Red
	"#9c27b0", // Purple
]

const ANONYMOUS_USER_COLOR = "#95a5a6" // Gray

// API constants
const MAX_PAGES = 5 // Limit to 5 pages (e.g., 50 reviews) to prevent excessive fetching
const PAGE_DELAY_MS = 100 // Short delay between pages to be polite
const FETCH_DELAY_MS = 300 // Wait 300ms between each fetch to be polite

// Default configuration values
const DEFAULT_BATCH_LIMIT = 1
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash"
const DEFAULT_DEBUG_LOGGING_ENABLED = false

// Supported routes for script execution (Regex patterns)
const SUPPORTED_ROUTES = (/* unused pure expression or super */ null && ([/^https:\/\/wtr-lab\.com\/en\/for-you/, /^https:\/\/wtr-lab\.com\/en\/novel-finder/]))

;// ./src/config/settings.js
/**
 * Runtime Settings Management
 * Handles loading and saving of user settings using GM_* functions
 */



// Runtime settings state
let runtimeSettings = {
	apiKey: "",
	geminiModel: DEFAULT_GEMINI_MODEL,
	debugLoggingEnabled: DEFAULT_DEBUG_LOGGING_ENABLED,
}

/**
 * Load configuration from GM_* storage
 */
function loadConfig() {
	runtimeSettings.apiKey = GM_getValue("geminiApiKey", "")
	// Load and ignore batchLimit from GM storage for backward compatibility
	GM_getValue("batchLimit", "1")
	runtimeSettings.geminiModel = GM_getValue("geminiModel", DEFAULT_GEMINI_MODEL)
	runtimeSettings.debugLoggingEnabled = GM_getValue("debugLoggingEnabled", DEFAULT_DEBUG_LOGGING_ENABLED)
}

/**
 * Save configuration to GM_* storage
 * @param {Object} newSettings - Settings object to save
 */
function saveConfig(newSettings) {
	GM_setValue("geminiApiKey", newSettings.apiKey)
	// Remove batchLimit from persistent storage (batch processing decommissioned)
	// Existing batchLimit values in GM storage will be ignored
	GM_setValue("geminiModel", newSettings.geminiModel)
	GM_setValue("debugLoggingEnabled", newSettings.debugLoggingEnabled)

	// Update runtime settings
	runtimeSettings = { ...newSettings }
}

/**
 * Get current runtime settings
 * @returns {Object} Current runtime settings
 */
function getRuntimeSettings() {
	return { ...runtimeSettings }
}

/**
 * Get API key
 * @returns {string} Current API key
 */
function settings_getApiKey() {
	return runtimeSettings.apiKey
}

/**
 * Set API key
 * @param {string} apiKey - API key to set
 */
function setApiKey(apiKey) {
	runtimeSettings.apiKey = apiKey
	GM_setValue("geminiApiKey", apiKey)
}

/**
 * Get Gemini model
 * @returns {string} Current Gemini model
 */
function getGeminiModel() {
	return runtimeSettings.geminiModel
}

/**
 * Set Gemini model
 * @param {string} geminiModel - Gemini model to set
 */
function setGeminiModel(geminiModel) {
	runtimeSettings.geminiModel = geminiModel
	GM_setValue("geminiModel", geminiModel)
}

/**
 * Get debug logging enabled status
 * @returns {boolean} Debug logging status
 */
function isDebugLoggingEnabled() {
	return runtimeSettings.debugLoggingEnabled
}

/**
 * Set debug logging enabled status
 * @param {boolean} debugLoggingEnabled - Debug logging status
 */
function setDebugLoggingEnabled(debugLoggingEnabled) {
	runtimeSettings.debugLoggingEnabled = debugLoggingEnabled
	GM_setValue("debugLoggingEnabled", debugLoggingEnabled)
}

;// ./src/utils/delay.js
/**
 * Promise-based delay utility
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after the delay
 */
function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

;// ./src/utils/debug.js
/**
 * Debug logging utilities
 */



/**
 * Debug logging function
 * @param {string} message - Debug message
 * @param {*} data - Optional data to log
 */
function debug_debugLog(message, data) {
	if (isDebugLoggingEnabled()) {
		console.log(`[WTR-Lab Novel Reviewer Debug] ${message}`, data || "")
	}
}

;// ./src/core/mapping.js
/**
 * Serie ID Mapping System
 * Handles mapping between raw_id and serie_id for API calls
 */





// Map from raw_id to serie_id for correct review API calls
const serieIdMap = new Map()

// Track if user has been notified about mapping failure
let mappingFailureNotified = false

/**
 * Build serie_id mapping from __NEXT_DATA__
 * @returns {Promise<boolean>} Success status
 */
async function buildSerieIdMap() {
	debug_debugLog("Building serie_id mapping from __NEXT_DATA__")
	const nextDataScript = document.querySelector('script[id="__NEXT_DATA__"]')
	if (!nextDataScript) {
		console.warn("__NEXT_DATA__ script not found. Unable to build serie_id mapping.")
		return false
	}

	try {
		const nextData = JSON.parse(nextDataScript.textContent)
		const pageProps = nextData.props?.pageProps

		extractIdsFromPageProps(pageProps)
		debug_debugLog(`Built serie_id map with ${serieIdMap.size} entries`)

		// Validate mapping was successful
		if (serieIdMap.size === 0) {
			console.error("Serie ID mapping failed: Map is empty after building")
			return false
		}
		return true
	} catch (error) {
		console.error("Error parsing __NEXT_DATA__:", error)
		return false
	}
}

/**
 * Extract serie IDs from page props
 * @param {Object} pageProps - Next.js page props
 */
function extractIdsFromPageProps(pageProps) {
	if (!pageProps) {
		return
	}

	if (pageProps.series && Array.isArray(pageProps.series)) {
		pageProps.series.forEach((item) => {
			if (item.raw_id && item.id) {
				serieIdMap.set(item.raw_id.toString(), item.id.toString())
			}
		})
	}

	if (pageProps.list && Array.isArray(pageProps.list)) {
		pageProps.list.forEach((item) => {
			if (item.raw_id && item.serie_id) {
				serieIdMap.set(item.raw_id.toString(), item.serie_id.toString())
			}
		})
	}
}

/**
 * Update mapping by fetching Next.js data for a URL
 * @param {string} url - The URL to fetch data for
 * @returns {Promise<boolean>} Success status
 */
async function updateMappingFromFetch(url) {
	try {
		// Get buildId from existing DOM since it doesn't change in session
		const nextDataScript = document.querySelector('script[id="__NEXT_DATA__"]')
		if (!nextDataScript) {
			return false
		}

		const initialData = JSON.parse(nextDataScript.textContent)
		const buildId = initialData.buildId
		if (!buildId) {
			return false
		}

		const urlObj = new URL(url)
		let pathname = urlObj.pathname
		// Ensure no trailing slash for data URL construction (Next.js quirks)
		if (pathname.length > 1 && pathname.endsWith("/")) {
			pathname = pathname.slice(0, -1)
		}

		// Construct _next/data URL
		const dataUrl = `/_next/data/${buildId}${pathname}.json${urlObj.search}`

		debug_debugLog(`Fetching data mapping from: ${dataUrl}`)
		const response = await fetch(dataUrl)
		if (!response.ok) {
			return false
		}

		const data = await response.json()
		if (data && data.pageProps) {
			extractIdsFromPageProps(data.pageProps)
			debug_debugLog(`Updated map from fetch. Size: ${serieIdMap.size}`)
			return true
		}
	} catch (error) {
		console.error("Error fetching Next.js data:", error)
	}
	return false
}

/**
 * Validate and build serie_id mapping with retry logic
 * @returns {Promise<boolean>} Success status
 */
async function validateAndBuildSerieIdMap() {
	for (let attempt = 1; attempt <= MAPPING_RETRY_ATTEMPTS; attempt++) {
		debug_debugLog(`Attempting to build serie_id map (Attempt ${attempt}/${MAPPING_RETRY_ATTEMPTS})`)
		const success = await buildSerieIdMap()

		if (success) {
			debug_debugLog("Serie ID mapping validation: SUCCESS")
			return true
		}

		console.warn(`Serie ID mapping failed on attempt ${attempt}/${MAPPING_RETRY_ATTEMPTS}`)

		if (attempt < MAPPING_RETRY_ATTEMPTS) {
			debug_debugLog(`Retrying in ${MAPPING_RETRY_DELAY}ms...`)
			await delay(MAPPING_RETRY_DELAY)
		}
	}

	// All attempts failed
	console.error("Serie ID mapping validation: FAILED after all retry attempts")
	return false
}

/**
 * Validate serie_id mapping
 * @param {string} rawId - The raw ID
 * @param {string} serieId - The serie ID to validate
 * @returns {boolean} Validation result
 */
function mapping_validateSerieIdMapping(rawId, serieId) {
	// Check if serieId is valid
	if (!serieId || serieId === null || serieId === undefined || serieId === "") {
		debug_debugLog(`Mapping validation FAILED: Invalid serie_id for raw_id ${rawId}`)
		return false
	}

	// Check if serieId is a valid format (should be numeric string)
	if (!/^\d+$/.test(serieId.toString())) {
		debug_debugLog(`Mapping validation FAILED: Invalid serie_id format "${serieId}" for raw_id ${rawId}`)
		return false
	}

	debug_debugLog(`Mapping validation SUCCESS: raw_id ${rawId} -> serie_id ${serieId}`)
	return true
}

/**
 * Get serie_id for a raw_id
 * @param {string} rawId - The raw ID
 * @returns {string|null} The mapped serie_id or null if not found
 */
function mapping_getSerieIdForRawId(rawId) {
	return serieIdMap.get(rawId) || null
}

/**
 * Get the entire serieIdMap
 * @returns {Map<string, string>} The serie ID map
 */
function getSerieIdMap() {
	return serieIdMap
}

/**
 * Check if mapping is available for a raw_id
 * @param {string} rawId - The raw ID to check
 * @returns {boolean} Whether mapping exists
 */
function hasMappingForRawId(rawId) {
	return serieIdMap.has(rawId)
}

/**
 * Get the size of the mapping
 * @returns {number} Number of mappings
 */
function mapping_getMappingSize() {
	return serieIdMap.size
}

/**
 * Check if mapping is valid (has entries)
 * @returns {boolean} True if mapping has entries
 */
function isMappingValid() {
	return serieIdMap.size > 0
}

/**
 * Reset mapping failure notification flag
 */
function resetMappingFailureNotification() {
	mappingFailureNotified = false
}

/**
 * Show mapping failure notification to user
 */
function mapping_showMappingFailureNotification() {
	if (mappingFailureNotified) {
		return // Already notified, don't spam
	}

	mappingFailureNotified = true

	// Create notification element with fallback icon
	const iconClass = window.__ICON_REPLACEMENTS__ ? "material-icons-fallback" : "material-icons"
	// Use warning icon instead of error for initialization issues as they might be temporary or partial
	const errorIcon = window.__ICON_REPLACEMENTS__ ? "⚠️" : "warning"

	const notification = document.createElement("div")
	notification.id = "gemini-mapping-failure-notification"
	notification.innerHTML = `
		<div class="notification-content">
			<span class="${iconClass} notification-icon">${errorIcon}</span>
			<div class="notification-text">
				<strong>Serie ID Mapping Failed</strong>
				<p>Unable to map novel IDs correctly. Please refresh the page to retry.</p>
			</div>
			<button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
		</div>
	`

	document.body.appendChild(notification)

	console.error("MAPPING FAILURE: User has been notified to refresh the page")
	debug_debugLog("Mapping failure notification displayed to user")
}

;// ./src/core/cache.js
/**
 * Caching System
 * Handles localStorage-based caching of assessments with backward compatibility
 */

/**
 * Check if localStorage is available
 * @returns {boolean} Whether localStorage is available
 */
function isLocalStorageAvailable() {
	try {
		const testKey = "__localStorage_test__"
		localStorage.setItem(testKey, "test")
		localStorage.removeItem(testKey)
		return true
	} catch (e) {
		return false
	}
}

/**
 * Generate cache key for a serieId
 * @param {string} serieId - The serie ID
 * @returns {string} Cache key
 */
function getCacheKey(serieId) {
	return `geminiAssessment_${serieId}`
}

/**
 * Get cached assessment for a serieId
 * @param {string} serieId - The serie ID
 * @returns {Object|null} Cached assessment or null if not found
 */
function cache_getCachedAssessment(serieId) {
	if (!isLocalStorageAvailable()) {
		return null
	}

	try {
		const key = getCacheKey(serieId)
		const cached = localStorage.getItem(key)
		if (cached) {
			const parsed = JSON.parse(cached)
			// Validate structure (basic check)
			if (parsed && typeof parsed === "object" && parsed.assessment) {
				return parsed
			}
		}
	} catch (e) {
		console.warn("Error retrieving cached assessment for serieId:", serieId, e)
	}
	return null
}

/**
 * Set cached assessment for a serieId
 * @param {string} serieId - The serie ID
 * @param {Object} assessment - The assessment to cache
 */
function setCachedAssessment(serieId, assessment) {
	if (!isLocalStorageAvailable()) {
		return
	}

	try {
		const key = getCacheKey(serieId)
		localStorage.setItem(key, JSON.stringify(assessment))
	} catch (e) {
		if (e.name === "QuotaExceededError") {
			console.warn("Local storage quota exceeded, unable to cache assessment for serieId:", serieId)
		} else {
			console.warn("Error caching assessment for serieId:", serieId, e)
		}
	}
}

/**
 * Clear all cached assessments from localStorage
 * @returns {boolean} True if successful, false otherwise
 */
function clearAllCachedAssessments() {
	if (!isLocalStorageAvailable()) {
		return false
	}

	try {
		const prefix = "geminiAssessment_"
		let clearedCount = 0
		let errorCount = 0

		// Get all localStorage keys
		const keys = []
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i)
			if (key) {
				keys.push(key)
			}
		}

		// Iterate through all keys and remove those with the geminiAssessment_ prefix
		for (const key of keys) {
			if (key.startsWith(prefix)) {
				try {
					localStorage.removeItem(key)
					clearedCount++
				} catch (e) {
					console.warn("Error removing cached assessment key:", key, e)
					errorCount++
				}
			}
		}

		// Log summary
		console.log(`Cleared ${clearedCount} cached assessments from localStorage`)
		if (errorCount > 0) {
			console.warn(`Encountered ${errorCount} errors while clearing cached assessments`)
		}

		return errorCount === 0
	} catch (e) {
		console.warn("Error clearing all cached assessments:", e)
		return false
	}
}

;// ./src/ui/components/panels.js
/**
 * Settings Panel and API Key Modal Components
 * Handles settings and configuration UI components
 */





/**
 * Create the settings panel
 */
function createSettingsPanel() {
	if (document.getElementById("gemini-settings-panel")) {
		return
	}

	const modelOptions = GEMINI_MODELS.map((model) => `<option value="${model}">${model}</option>`).join("")
	const panelHTML = `
	<div id="gemini-settings-panel">
		<h3>Gemini Reviewer Settings</h3>
		<label for="gemini-api-key-input">Gemini API Key:</label>
		<input type="password" id="gemini-api-key-input">
		<label for="gemini-model-select">Gemini Model:</label>
		<select id="gemini-model-select">${modelOptions}</select>
		<label for="gemini-debug-logging-input" class="debug-logging-label">
			<input type="checkbox" id="gemini-debug-logging-input">
			Enable Debug Logging (Logs prompts and responses)
		</label>
		<div class="buttons">
			<button id="clear-cache-button" class="clear-cache-btn">Clear Analyzed Novel Cache</button>
			<button id="gemini-settings-close">Close</button>
			<button id="gemini-settings-save">Save</button>
		</div>
	</div>
`
	document.body.insertAdjacentHTML("beforeend", panelHTML)
}

/**
 * Create the API key modal
 */
function createApiKeyModal() {
	if (document.getElementById("gemini-api-key-modal")) {
		return
	}

	const modalHTML = `
		<div id="gemini-api-key-modal">
			<h3>How to Get Your FREE Gemini API Token</h3>
			<div class="instructions">
				<ol>
					<li>Go to <a href="https://aistudio.google.com/" target="_blank" style="color: #0d6efd;">Google AI Studio</a></li>
					<li>Sign in with your Google account</li>
					<li>Click "Get API key in Google AI Studio"</li>
					<li>Create a new API key or use an existing one</li>
					<li>Copy the API key and paste it below</li>
				</ol>
			</div>
			<label for="gemini-api-key-modal-input">Gemini API Key:</label>
			<input type="password" id="gemini-api-key-modal-input" placeholder="Enter your Gemini API key here">
			<div class="buttons">
				<button id="gemini-api-key-modal-close">Cancel</button>
				<button id="gemini-api-key-modal-save">Save & Continue</button>
			</div>
		</div>
	`
	document.body.insertAdjacentHTML("beforeend", modalHTML)
}

/**
 * Setup configuration menu commands
 */
let configSetupDone = false

/**
 * Setup configuration menu commands
 */
function setupConfig() {
	if (configSetupDone) {
		return
	}
	configSetupDone = true

	// Open Settings menu command
	GM_registerMenuCommand("Open Settings", () => {
		const settings = getRuntimeSettings()
		document.getElementById("gemini-api-key-input").value = settings.apiKey
		document.getElementById("gemini-model-select").value = settings.geminiModel
		document.getElementById("gemini-debug-logging-input").checked = settings.debugLoggingEnabled
		document.getElementById("gemini-settings-panel").style.display = "block"
	})

	// Settings save button
	document.getElementById("gemini-settings-save").addEventListener("click", () => {
		const newSettings = {
			apiKey: document.getElementById("gemini-api-key-input").value,
			geminiModel: document.getElementById("gemini-model-select").value,
			debugLoggingEnabled: document.getElementById("gemini-debug-logging-input").checked,
		}

		saveConfig(newSettings)
		alert("Settings saved.")
		document.getElementById("gemini-settings-panel").style.display = "none"
	})

	// Settings close button
	document.getElementById("gemini-settings-close").addEventListener("click", () => {
		document.getElementById("gemini-settings-panel").style.display = "none"
	})

	// Clear cache button
	document.getElementById("clear-cache-button").addEventListener("click", () => {
		const confirmed = confirm(
			"Are you sure you want to clear the cache for all analyzed novels? This action cannot be undone.",
		)
		if (confirmed) {
			const success = clearAllCachedAssessments()
			if (success) {
				alert("Cache cleared successfully. Refreshing page...")
				window.location.reload()
			} else {
				alert("Failed to clear cache. Check console for details.")
			}
		}
	})
}

/**
 * Show API key modal
 * @returns {Promise<boolean>} Promise resolving to true if user saved, false if cancelled
 */
function panels_showApiKeyModal() {
	return new Promise((resolve) => {
		document.getElementById("gemini-api-key-modal-input").value = ""
		document.getElementById("gemini-api-key-modal").style.display = "block"

		const saveButton = document.getElementById("gemini-api-key-modal-save")
		const closeButton = document.getElementById("gemini-api-key-modal-close")

		const handleSave = () => {
			const apiKey = document.getElementById("gemini-api-key-modal-input").value.trim()
			if (apiKey) {
				saveConfig({ ...getRuntimeSettings(), apiKey })
				document.getElementById("gemini-api-key-modal").style.display = "none"
				resolve(true)
			} else {
				alert("Please enter a valid API key.")
			}
		}

		const handleClose = () => {
			document.getElementById("gemini-api-key-modal").style.display = "none"
			resolve(false)
		}

		saveButton.addEventListener("click", handleSave, { once: true })
		closeButton.addEventListener("click", handleClose, { once: true })
	})
}

;// ./src/utils/colors.js
/**
 * Username Color System
 * Provides consistent username colors across sessions using deterministic color generation
 */



// Cache for consistent username colors across sessions
const usernameColorCache = new Map()

/**
 * Generate a consistent color for a username
 * @param {string} username - The username to generate a color for
 * @returns {string} Hex color code
 */
function getUsernameColor(username) {
	// Handle null/undefined/empty usernames
	if (!username || username === "null" || username === "undefined" || username.trim() === "") {
		return ANONYMOUS_USER_COLOR
	}

	// Check cache first
	if (usernameColorCache.has(username)) {
		return usernameColorCache.get(username)
	}

	// Generate deterministic color based on username
	let hash = 0
	for (let i = 0; i < username.length; i++) {
		const char = username.charCodeAt(i)
		hash = (hash << 5) - hash + char
		hash = hash & hash // Convert to 32-bit integer
	}

	// Use absolute value to ensure positive index
	const colorIndex = Math.abs(hash) % USERNAME_COLORS.length
	const color = USERNAME_COLORS[colorIndex]

	// Cache the result
	usernameColorCache.set(username, color)
	return color
}

/**
 * Extract unique usernames from reviews
 * @param {Array} reviews - Array of review objects
 * @returns {Array} Array of unique usernames
 */
function extractUsernamesFromReviews(reviews) {
	const usernames = new Set()
	reviews.forEach((review) => {
		if (review.username) {
			// Handle various username formats
			const username = review.username.trim()
			if (username && username !== "null" && username !== "undefined") {
				usernames.add(username)
			}
		}
	})
	return Array.from(usernames)
}

/**
 * Apply color coding to review summary text
 * @param {string} reviewSummary - The review summary text
 * @param {Array} availableUsernames - Array of usernames to color code
 * @returns {string} HTML string with color-coded usernames
 */
function colorCodeReviewSummary(reviewSummary, availableUsernames) {
	if (!reviewSummary || !availableUsernames || availableUsernames.length === 0) {
		return reviewSummary
	}

	let coloredSummary = reviewSummary

	// Sort usernames by length (longest first) to avoid partial matches
	const sortedUsernames = [...availableUsernames].sort((a, b) => b.length - a.length)

	sortedUsernames.forEach((username) => {
		const color = getUsernameColor(username)
		// Create regex to match username in text (word boundaries, case insensitive)
		const escapedUsername = username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
		const usernameRegex = new RegExp(`\\b${escapedUsername}\\b`, "gi")

		// Check if this is an anonymous/null user
		const isAnonymous = !username || username === "null" || username === "undefined" || username.trim() === ""
		const cssClass = isAnonymous ? "username-color-coded anonymous" : "username-color-coded"

		// Replace with color-coded version
		coloredSummary = coloredSummary.replace(usernameRegex, (match) => {
			return `<span class="${cssClass}" style="color: ${color}; font-weight: 600;">${match}</span>`
		})
	})

	return coloredSummary
}

;// ./src/ui/components/cards.js
/**
 * Novel Card Components
 * Handles card UI updates and modifications for novel assessment display
 */





/**
 * Get CSS class for rating
 * @param {string} rating - The rating value
 * @returns {string} CSS class name
 */
function getRatingClass(rating) {
	if (!rating) {
		return ""
	}
	const ratingLower = rating.toLowerCase()
	if (
		ratingLower.includes("good") ||
		ratingLower.includes("excellent") ||
		ratingLower.includes("outstanding") ||
		ratingLower.includes("very good") ||
		ratingLower.includes("strong")
	) {
		return "good"
	} else if (
		ratingLower.includes("mixed") ||
		ratingLower.includes("average") ||
		ratingLower.includes("decent") ||
		ratingLower.includes("fair") ||
		ratingLower.includes("moderate")
	) {
		return "mixed"
	} else if (
		ratingLower.includes("bad") ||
		ratingLower.includes("poor") ||
		ratingLower.includes("weak") ||
		ratingLower.includes("lacking") ||
		ratingLower.includes("needs improvement")
	) {
		return "bad"
	} else if (
		ratingLower.includes("unknown") ||
		ratingLower.includes("missing") ||
		ratingLower.includes("unspecified") ||
		ratingLower.includes("undetermined") ||
		ratingLower.includes("insufficient")
	) {
		return "unknown"
	}
	return ""
}

/**
 * Populate unknown field for backward compatibility
 * @param {Object} analysis - The analysis object
 * @returns {Object} Analysis with unknown field populated
 */
function populateUnknownField(analysis) {
	// Ensure unknown field exists for backward compatibility with cached data
	if (!analysis.unknown) {
		// Default unknown field to "Mixed" if not present in cached data
		analysis.unknown = "Mixed"
	}
	return analysis
}

/**
 * Update card UI with assessment data
 * @param {Element} card - The DOM card element
 * @param {Object} analysis - The assessment analysis
 */
function updateCardUI(card, analysis) {
	// Check if we have analysis data to display
	const hasAnalysis = analysis && analysis.assessment && analysis.summary

	// Only populate unknown field and add card styling if we have analysis
	if (hasAnalysis) {
		// Populate unknown field if missing (backward compatibility)
		analysis = populateUnknownField(analysis)

		const assessmentLower = analysis.assessment.toLowerCase()
		if (assessmentLower === "good") {
			card.classList.add("gemini-good-novel")
		} else if (assessmentLower === "mixed") {
			card.classList.add("gemini-mixed-novel")
		} else if (assessmentLower === "bad") {
			card.classList.add("gemini-bad-novel")
		}
	}

	// Use fallback icons if Material Icons are not available
	const iconConfig = window.__ICON_REPLACEMENTS__
		? {
				iconClass: "material-icons-fallback",
				expandIcon: "▼",
				autoAwesomeIcon: "⭐",
			}
		: {
				iconClass: "material-icons",
				expandIcon: "expand_more",
				autoAwesomeIcon: "auto_awesome",
			}

	const container = document.createElement("div")
	container.className = "gemini-summary-container"

	let summaryCard = null

	// Only create the summary content if we have analysis data
	if (hasAnalysis) {
		const overallClass = getRatingClass(analysis.assessment)
		const characterClass = getRatingClass(analysis.characterDevelopment)
		const plotClass = getRatingClass(analysis.plotStructure)
		const worldClass = getRatingClass(analysis.worldBuilding)
		const themesClass = getRatingClass(analysis.themesAndMessages)
		const writingClass = getRatingClass(analysis.writingStyle)
		const unknownClass = getRatingClass(analysis.unknown)

		// Extract usernames for color coding (if available in analysis)
		const availableUsernames = analysis.availableUsernames || []

		let detailedAssessment = `<h4>AI Novel Assessment</h4>`
		detailedAssessment += `<div class="mobile-close-btn">×</div>`
		detailedAssessment += `<div class="summary-toggle collapsed" data-target="novel-summary">`
		detailedAssessment += `<span>Novel Summary</span>`
		detailedAssessment += `<span class="${iconConfig.iconClass} toggle-icon">${iconConfig.expandIcon}</span>`
		detailedAssessment += `</div>`
		detailedAssessment += `<div class="summary-content" id="novel-summary">`
		detailedAssessment += `<p>${analysis.novelSummary}</p>`
		detailedAssessment += `</div>`

		// Apply color coding to review summary
		const coloredReviewSummary = colorCodeReviewSummary(analysis.reviewSummary, availableUsernames)

		detailedAssessment += `<div class="summary-toggle collapsed" data-target="review-summary">`
		detailedAssessment += `<span>Review Summary</span>`
		detailedAssessment += `<span class="${iconConfig.iconClass} toggle-icon">${iconConfig.expandIcon}</span>`
		detailedAssessment += `</div>`
		detailedAssessment += `<div class="summary-content" id="review-summary">`
		detailedAssessment += `<p>${coloredReviewSummary}</p>`
		detailedAssessment += `</div>`

		detailedAssessment += `<div class="assessment-section">`
		detailedAssessment += `<strong>Overall Assessment:</strong> <span class="assessment-rating ${overallClass}">${analysis.assessment}</span><br><hr style="margin: 5px 0;">`
		detailedAssessment += `<strong>Analysis Summary:</strong> ${analysis.summary}<br><hr style="margin: 5px 0;">`

		if (analysis.characterDevelopment) {
			const displayValue =
				analysis.characterDevelopment === "Unknown" ? "Insufficient Data" : analysis.characterDevelopment
			detailedAssessment += `<strong>Character Development:</strong> <span class="assessment-rating ${characterClass}">${displayValue}</span><br>`
		}
		if (analysis.plotStructure) {
			const displayValue = analysis.plotStructure === "Unknown" ? "Insufficient Data" : analysis.plotStructure
			detailedAssessment += `<strong>Plot Structure:</strong> <span class="assessment-rating ${plotClass}">${displayValue}</span><br>`
		}
		if (analysis.worldBuilding) {
			const displayValue = analysis.worldBuilding === "Unknown" ? "Insufficient Data" : analysis.worldBuilding
			detailedAssessment += `<strong>World-Building:</strong> <span class="assessment-rating ${worldClass}">${displayValue}</span><br>`
		}
		if (analysis.themesAndMessages) {
			const displayValue =
				analysis.themesAndMessages === "Unknown" ? "Insufficient Data" : analysis.themesAndMessages
			detailedAssessment += `<strong>Themes & Messages:</strong> <span class="assessment-rating ${themesClass}">${displayValue}</span><br>`
		}
		if (analysis.writingStyle) {
			const displayValue = analysis.writingStyle === "Unknown" ? "Insufficient Data" : analysis.writingStyle
			detailedAssessment += `<strong>Writing Style:</strong> <span class="assessment-rating ${writingClass}">${displayValue}</span><br>`
		}

		// Only show the legacy Unknown section for backward compatibility with cached assessments
		// New assessments won't have meaningful unknown data since Unknown is now per-category
		if (analysis.unknown && analysis.unknown !== "Mixed") {
			detailedAssessment += `<strong>Legacy Unknown Data:</strong> <span class="assessment-rating ${unknownClass}">${analysis.unknown}</span><br>`
		}

		detailedAssessment += `</div>`

		container.innerHTML = `
			<div class="gemini-summary-card">
				${detailedAssessment}
			</div>
		`

		summaryCard = container.querySelector(".gemini-summary-card")
	}

	// Find the title-wrap element within the card
	const titleWrap = card.querySelector(".title-wrap")

	// Create the trigger button as a separate element
	const summaryTrigger = document.createElement("div")
	summaryTrigger.className = "gemini-summary-trigger"

	// Check mapping validity
	const mappingValid = isMappingValid()
	if (!mappingValid) {
		summaryTrigger.classList.add("disabled")
		summaryTrigger.title = "Initialization Failed - Refresh Page"
	} else {
		summaryTrigger.title = hasAnalysis ? "Show AI Summary" : "Analyze Novel"
	}

	summaryTrigger.innerHTML = `<span class="${iconConfig.iconClass}">${iconConfig.autoAwesomeIcon}</span>`

	// Add click event for dual-purpose functionality
	let isLocked = false
	summaryTrigger.addEventListener("click", async function (event) {
		event.stopPropagation()

		// Check disabled state
		if (summaryTrigger.classList.contains("disabled")) {
			alert("The reviewer failed to initialize correctly. Please refresh the page to get correct data.")
			return
		}

		// If no analysis (no cache), initiate analysis workflow
		if (!hasAnalysis) {
			try {
				await processSpecificNovel(card)
			} catch (error) {
				console.error("Error processing specific novel:", error)
			}
			return
		}

		// If analysis exists (has cache), execute existing toggle logic
		isLocked = !isLocked
		if (isLocked) {
			summaryCard.classList.add("locked")
		} else {
			summaryCard.classList.remove("locked")
		}
	})

	// Add toggle functionality after DOM insertion only if we have analysis
	if (hasAnalysis) {
		// Add close button listener for mobile
		const closeBtn = summaryCard.querySelector(".mobile-close-btn")
		if (closeBtn) {
			const handleClose = (e) => {
				// Prevent ghost clicks on mobile
				if (e.type === "touchstart") {
					e.preventDefault()
				}
				e.stopPropagation()
				summaryCard.classList.remove("locked")
				isLocked = false
			}

			closeBtn.addEventListener("click", handleClose)
			closeBtn.addEventListener("touchstart", handleClose, { passive: false })
		}
		const toggles = summaryCard.querySelectorAll(".summary-toggle")
		toggles.forEach((toggle) => {
			toggle.addEventListener("click", function () {
				const targetId = this.dataset.target
				const content = summaryCard.querySelector(`#${targetId}`)
				const isCollapsed = this.classList.contains("collapsed")

				if (isCollapsed) {
					this.classList.remove("collapsed")
					content.classList.add("expanded")
				} else {
					this.classList.add("collapsed")
					content.classList.remove("expanded")
				}
			})
		})
	}

	// Move trigger button to title-wrap and container (with summary card) to card
	if (titleWrap) {
		titleWrap.appendChild(summaryTrigger)
	}
	card.appendChild(container)
}

/**
 * Add loading overlay to a card
 * @param {Element} card - The card element
 * @returns {Element} The overlay element
 */
function cards_addLoadingOverlay(card) {
	const overlay = document.createElement("div")
	overlay.className = "gemini-processing-overlay"
	overlay.textContent = "Analyzing..."
	const cardBody = card.querySelector(".card-body")
	if (cardBody) {
		cardBody.style.position = "relative"
		cardBody.appendChild(overlay)
	}
	return overlay
}
/**
 * Parse novel data from a novel-finder card
 * @param {Element} card - The card element
 * @returns {Object|null} The extracted novel data or null if parsing fails
 */
function parseNovelFinderCard(card) {
	const titleElement = card.querySelector(".title-wrap .title")
	const rawTitleElement = card.querySelector(".rawtitle")
	const urlElement = card.querySelector(".title-wrap a")
	const coverElement = card.querySelector("picture source[srcset]")
	const detailLines = card.querySelectorAll(".detail-line")
	const genres = Array.from(card.querySelectorAll(".genres .genre")).map((g) => g.textContent.trim())
	const descriptionElement = card.querySelector(".desc-wrap .description")

	if (!titleElement || !urlElement) {
		return null
	}

	const url = urlElement.href
	const match = url.match(/\/novel\/(\d+)\//)
	if (!match || !match[1]) {
		return null
	}
	const rawId = match[1]
	const serieId = match[1]

	let status = "Unknown"
	let views = "0"
	let chapters = "0"
	let readers = "0"

	if (detailLines.length > 0) {
		const statusLine = detailLines[0].textContent.trim()
		const statusMatch = statusLine.match(/•\s*(\w+)/)
		if (statusMatch && statusMatch[1]) {
			status = statusMatch[1]
		}
		const viewsMatch = statusLine.match(/·\s*([\d,]+)\s*views/i)
		if (viewsMatch && viewsMatch[1]) {
			views = viewsMatch[1].replace(/,/g, "")
		}
	}

	if (detailLines.length > 1) {
		const chapterLine = detailLines[1].textContent.trim()
		const chapterMatch = chapterLine.match(/([\d,]+)\s*Chapters/i)
		if (chapterMatch && chapterMatch[1]) {
			chapters = chapterMatch[1].replace(/,/g, "")
		}
		const readersMatch = chapterLine.match(/·\s*([\d,]+)\s*Readers/i)
		if (readersMatch && readersMatch[1]) {
			readers = readersMatch[1].replace(/,/g, "")
		}
	}

	return {
		serie_id: serieId, // This will be null
		raw_id: rawId,
		title: titleElement.firstChild.textContent.trim(),
		raw_title: rawTitleElement ? rawTitleElement.textContent.trim() : "",
		url: url,
		cover_url: coverElement ? coverElement.srcset.split(" ")[0] : "",
		status: status,
		views: parseInt(views, 10),
		chapters: parseInt(chapters, 10),
		readers: parseInt(readers, 10),
		genres: genres,
		description: descriptionElement ? descriptionElement.textContent.trim() : "",
	}
}

;// ./src/assessment/schema.js
/**
 * Response Schema Validation
 * Handles validation of analysis responses for backward compatibility
 */

/**
 * Populate unknown field for backward compatibility with cached assessments
 * @param {Object} analysis - The analysis object
 * @returns {Object} Analysis with unknown field populated
 */
function schema_populateUnknownField(analysis) {
	// Ensure unknown field exists for backward compatibility with cached data
	if (!analysis.unknown) {
		// Default unknown field to "Mixed" if not present in cached data
		analysis.unknown = "Mixed"
	}
	return analysis
}

;// ./src/api/reviews.js
/**
 * WTR-Lab Reviews API
 * Handles fetching reviews from the WTR-Lab API
 */





/**
 * Fetch reviews for a serieId
 * @param {string} serieId - The serie ID
 * @returns {Promise<Array>} Array of review objects
 */
async function fetchReviews(serieId) {
	let allReviews = []

	// First, fetch page 0 to check if we have sufficient data
	const url = `https://wtr-lab.com/api/review/get?serie_id=${serieId}&page=0&sort=most_liked`
	debug_debugLog(`Fetching reviews for serieId ${serieId}, Page 0 from: ${url}`)

	try {
		const response = await fetch(url)
		if (!response.ok) {
			debug_debugLog(`Review API response not OK for ${serieId}. Status: ${response.status}`)
			return [] // Return empty array if first page fails
		}
		const data = await response.json()
		debug_debugLog(`Review API raw data for ${serieId}, Page 0:`, data)

		if (data.success && data.data && data.data.length > 0) {
			allReviews = allReviews.concat(data.data)
			debug_debugLog(`Page 0 received ${data.data.length} reviews for ${serieId}`)

			// Check if page 0 has sufficient data (>= 3 reviews with comments for good analysis)
			const reviewsWithComments = data.data.filter((r) => r.comment)
			if (reviewsWithComments.length >= 3) {
				debug_debugLog(
					`Page 0 has sufficient data (${reviewsWithComments.length} reviews with comments) for ${serieId} - stopping here`,
				)
				return allReviews
			}
		} else {
			// No data in page 0, return empty
			debug_debugLog(`No reviews found in page 0 for ${serieId}`)
			return []
		}
	} catch (error) {
		console.error(`Error fetching reviews for serie_id ${serieId} on page 0:`, error)
		return [] // Return empty array on error
	}

	// If we get here, page 0 has data but it's insufficient, so fetch remaining pages
	for (let page = 1; page < MAX_PAGES; page++) {
		const pageUrl = `https://wtr-lab.com/api/review/get?serie_id=${serieId}&page=${page}&sort=most_liked`
		debug_debugLog(`Fetching reviews for serieId ${serieId}, Page ${page} from: ${pageUrl}`)

		try {
			const response = await fetch(pageUrl)
			if (!response.ok) {
				debug_debugLog(`Review API response not OK for ${serieId}. Status: ${response.status}`)
				break // Stop fetching if API returns an error status
			}
			const data = await response.json()
			debug_debugLog(`Review API raw data for ${serieId}, Page ${page}:`, data)

			if (data.success && data.data && data.data.length > 0) {
				allReviews = allReviews.concat(data.data)
			} else {
				// Stop fetching if success is false or data array is empty
				break
			}
		} catch (error) {
			console.error(`Error fetching reviews for serie_id ${serieId} on page ${page}:`, error)
			break // Stop fetching on network/parsing error
		}
		await delay(PAGE_DELAY_MS) // Short delay between pages to be polite
	}

	return allReviews
}

;// ./src/api/gemini.js
/**
 * Gemini AI Integration
 * Handles communication with Google's Gemini API for novel analysis
 */





/**
 * Get Gemini analysis for novels
 * @param {Array} novelsData - Array of novel data objects
 * @returns {Promise<Array>} Promise resolving to array of analysis objects
 */
function getGeminiAnalysis(novelsData) {
	const prompt = `
	              Analyze the following list of novels. For each novel, use its title, view count, reader count, rating, genres, description, and user reviews to provide a comprehensive assessment across multiple categories.
	              Return a single JSON array. Each object in the array must correspond to a novel in the input list, maintaining the original order.

	              For each novel, provide:
	              1. A novel summary: A concise 2-3 sentence summary of what the novel is about, based primarily on the title, description, genres, and user reviews.
	              2. A review summary: A balanced summary of user feedback from the reviews, including positive and negative points, with proper attribution to usernames (e.g., "According to [User], ..."). Use EXACT usernames from the availableUsernames list when making attributions.

	              Then provide detailed assessments in the following categories:
	              - Overall assessment (Good/Mixed/Bad)
	              - Character Development (Good/Mixed/Bad/Unknown)
	              - Plot Structure (Good/Mixed/Bad/Unknown)
	              - World-Building (Good/Mixed/Bad/Unknown)
	              - Themes & Messages (Good/Mixed/Bad/Unknown)
	              - Writing Style (Good/Mixed/Bad/Unknown)

	              For each category, include specific criteria:
	              - Character Development: character depth, growth, consistency, dialogue authenticity, relationship dynamics
	              - Plot Structure: pacing, narrative flow, story coherence, conflict resolution, foreshadowing
	              - World-Building: setting details, consistency, immersion, cultural depth, originality
	              - Themes & Messages: clarity, relevance, integration, thought provocation, balance
	              - Writing Style: prose quality, descriptive language, dialogue naturalness, grammar, technical execution

	              CRITICAL: Each category can be rated as "Unknown" when:
	              - Character Development: No character development information found in available data
	              - Plot Structure: No plot structure information found in available data
	              - World-Building: No world-building details found in available data
	              - Themes & Messages: No theme or message information found in available data
	              - Writing Style: No writing style information found in available data

	              Important distinctions:
	              - "Unknown" means: insufficient data to make a reliable assessment for that specific aspect
	              - "Bad" means: poor quality or problematic implementation of that aspect
	              - Use "Unknown" when data is genuinely missing or insufficient, NOT when quality is poor

	              Novels List:
	              ${JSON.stringify(novelsData, null, 2)}
	      `

	const schema = {
		type: "array",
		items: {
			type: "object",
			properties: {
				novelSummary: {
					type: "string",
					description: "A concise 2-3 sentence summary of what the novel is about.",
				},
				reviewSummary: {
					type: "string",
					description: "A balanced summary of user feedback with proper username attribution.",
				},
				assessment: { type: "string", enum: ["Good", "Mixed", "Bad"] },
				summary: {
					type: "string",
					description: "A brief 2-3 sentence summary explaining the overall assessment.",
				},
				characterDevelopment: { type: "string", enum: ["Good", "Mixed", "Bad", "Unknown"] },
				plotStructure: { type: "string", enum: ["Good", "Mixed", "Bad", "Unknown"] },
				worldBuilding: { type: "string", enum: ["Good", "Mixed", "Bad", "Unknown"] },
				themesAndMessages: { type: "string", enum: ["Good", "Mixed", "Bad", "Unknown"] },
				writingStyle: { type: "string", enum: ["Good", "Mixed", "Bad", "Unknown"] },
			},
			required: [
				"novelSummary",
				"reviewSummary",
				"assessment",
				"summary",
				"characterDevelopment",
				"plotStructure",
				"worldBuilding",
				"themesAndMessages",
				"writingStyle",
			],
		},
	}

	const safetySettings = [
		{ category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
		{ category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
		{ category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
		{ category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
	]

	const requestData = JSON.stringify({
		contents: [{ parts: [{ text: prompt }] }],
		generationConfig: { responseMimeType: "application/json", responseJsonSchema: schema, temperature: 0.3 },
		safetySettings: safetySettings,
	})

	debug_debugLog("Gemini Prompt:", prompt)

	return new Promise((resolve, reject) => {
		let retries = 0
		const executeRequest = () => {
			const apiKey = settings_getApiKey()
			const model = getGeminiModel()

			GM_xmlhttpRequest({
				method: "POST",
				url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
				headers: { "Content-Type": "application/json" },
				data: requestData,
				onload: function (response) {
					try {
						const apiResponse = JSON.parse(response.responseText)
						debug_debugLog("Gemini Raw Response:", apiResponse)

						if (apiResponse.candidates && apiResponse.candidates.length > 0) {
							const analyses = JSON.parse(apiResponse.candidates[0].content.parts[0].text)
							resolve(analyses)
						} else {
							const errorMsg = apiResponse.promptFeedback
								? `Gemini block reason: ${JSON.stringify(apiResponse.promptFeedback)}`
								: "Gemini API returned no candidates."
							console.error("Gemini API Response Error:", apiResponse)

							if (retries < MAX_RETRIES) {
								retries++
								const delayMs = INITIAL_DELAY_MS * Math.pow(2, retries - 1)
								console.warn(
									`Retrying Gemini request in ${delayMs}ms (Attempt ${retries}/${MAX_RETRIES}). Error: ${errorMsg}`,
								)
								setTimeout(executeRequest, delayMs)
							} else {
								reject(`Gemini API failed after ${MAX_RETRIES} retries. Last error: ${errorMsg}`)
							}
						}
					} catch (e) {
						if (retries < MAX_RETRIES) {
							retries++
							const delayMs = INITIAL_DELAY_MS * Math.pow(2, retries - 1)
							console.warn(
								`Retrying Gemini request in ${delayMs}ms (Attempt ${retries}/${MAX_RETRIES}). Error: Failed to parse response: ${e}`,
							)
							setTimeout(executeRequest, delayMs)
						} else {
							reject(
								`Failed to parse Gemini response after ${MAX_RETRIES} retries: ${e}\nResponse: ${response.responseText}`,
							)
						}
					}
				},
				onerror: (response) => {
					if (retries < MAX_RETRIES) {
						retries++
						const delayMs = INITIAL_DELAY_MS * Math.pow(2, retries - 1)
						console.warn(
							`Retrying Gemini request in ${delayMs}ms (Attempt ${retries}/${MAX_RETRIES}). Error: API request failed: ${response.statusText}`,
						)
						setTimeout(executeRequest, delayMs)
					} else {
						reject(`Gemini API request failed after ${MAX_RETRIES} retries: ${response.statusText}`)
					}
				},
			})
		}
		executeRequest()
	})
}

;// ./src/processing/batch.js
/**
 * Batch Processing Logic
 * Handles the main batch processing workflow for novel analysis
 */











/**
 * Process a batch of novels
 * @param {Array} batch - Array of card elements to process
 * @param {Array} overlays - Array of overlay elements
 * @returns {Promise<Array>} Promise resolving to batch results
 */
async function batch_processBatch(batch, overlays) {
	const novelsData = []
	const batchResults = [] // Array to hold {card, analysis, overlay, serieId} for each processed novel

	for (let i = 0; i < batch.length; i++) {
		const card = batch[i]
		const overlay = overlays[i]

		const currentUrl = window.location.href
		let novelData
		let serieId
		let rawId

		if (currentUrl.includes("wtr-lab.com/en/novel-finder")) {
			novelData = parseNovelFinderCard(card)
			if (!novelData) {
				console.warn("Skipping card, failed to parse novel-finder card.", card)
				continue
			}
			rawId = novelData.raw_id
			serieId = mapping_getSerieIdForRawId(rawId)
		} else {
			const linkElement = card.querySelector("a.title")
			rawId = linkElement.dataset.novelId
			serieId = mapping_getSerieIdForRawId(rawId)

			if (!serieId) {
				console.error("PROCESSING HALTED: Unable to obtain valid serie_id")
				mapping_showMappingFailureNotification()
				overlays.forEach((o) => o && o.remove())
				throw new Error("No valid serie_id available")
			}

			const titleElement = card.querySelector("a.title")
			let title = titleElement ? titleElement.textContent.trim() : "No title"
			if (titleElement && title.startsWith("#")) {
				title = title.split(" ").slice(1).join(" ")
			}
			const rawTitleSpan = titleElement ? titleElement.querySelector(".rawtitle") : null
			if (rawTitleSpan) {
				title = title.replace(rawTitleSpan.textContent, "").trim()
			}

			const viewsLine = card.querySelector(".detail-buttons .detail-line:nth-of-type(1)")
			let totalViews = 0
			if (viewsLine) {
				const match = viewsLine.textContent.match(/(\d+) views/)
				if (match) {
					totalViews = parseInt(match[1], 10)
				}
			}

			const readersLine = card.querySelector(".detail-buttons .detail-line:nth-of-type(2)")
			let totalReaders = 0
			if (readersLine) {
				const match = readersLine.textContent.match(/(\d+) Readers/)
				if (match) {
					totalReaders = parseInt(match[1], 10)
				}
			}

			const ratingElement = card.querySelector(".rating-text")
			let rating = 0
			if (ratingElement) {
				const match = ratingElement.textContent.match(/(\d+\.\d+)/)
				if (match) {
					rating = parseFloat(match[1])
				}
			}

			const tagElements = card.querySelectorAll(".genres .genre")
			const genres = Array.from(tagElements).map((el) => el.textContent.trim())
			const description = card.querySelector(".description")?.textContent.trim() || "No description."

			novelData = {
				serie_id: serieId,
				raw_id: rawId,
				title,
				totalViews,
				totalReaders,
				rating,
				genres,
				description,
			}
		}

		const reviews = await fetchReviews(serieId)
		const reviewsWithComments = reviews.filter((r) => r.comment)
		const reviewsText = reviewsWithComments
			.map((r) => `- User: ${r.username || "Unknown"}\n- Rating: ${r.rate}/5\n- Comment: ${r.comment}`)
			.join("\n\n")
		const availableUsernames = extractUsernamesFromReviews(reviewsWithComments)

		novelsData.push({
			...novelData,
			reviewsText,
			availableUsernames,
		})
		batchResults.push({ card, overlay, serieId: serieId })

		await delay(FETCH_DELAY_MS) // Wait between each fetch to be polite
	}

	if (novelsData.length === 0) {
		// All novels in batch were cached - return successfully without error
		return { batchResults, novelsData: [] }
	}

	const analyses = await getGeminiAnalysis(novelsData)

	if (analyses.length !== novelsData.length) {
		throw new Error("Mismatch between number of novels sent and analyses received.")
	}

	// Apply analyses and cache them
	batchResults.forEach(({ card, overlay, serieId }, index) => {
		let analysis = analyses[index]
		const novelData = novelsData[index]
		if (analysis) {
			// Ensure analysis has availableUsernames for color coding
			if (!analysis.availableUsernames && novelData && novelData.availableUsernames) {
				analysis.availableUsernames = novelData.availableUsernames
			}
			// Ensure unknown field exists (forward compatibility)
			analysis = schema_populateUnknownField(analysis)
			updateCardUI(card, analysis)
			setCachedAssessment(serieId, analysis)
			// Mark as processed only after successful analysis and caching
			card.dataset.geminiProcessed = "true"
		}
		if (overlay) {
			overlay.remove()
		}
	})

	return { batchResults, novelsData }
}

;// ./src/processing/workflow.js
/**
 * Processing Workflow Management
 * Handles the main processing workflow including API key management and single novel processing
 */











/**
 * Display cached assessments on the page
 */
function displayCachedAssessments() {
	const currentUrl = window.location.href
	const cardSelector = currentUrl.includes("wtr-lab.com/en/novel-finder")
		? ".card:not([data-gemini-processed]):not([data-gemini-cached-checked])"
		: ".series-list > .card:not([data-gemini-processed]):not([data-gemini-cached-checked])"
	const novelCards = Array.from(document.querySelectorAll(cardSelector))
	novelCards.forEach((card) => {
		const linkElement = card.querySelector("a.title")
		let serieId = null
		let rawId = null

		if (linkElement) {
			if (currentUrl.includes("wtr-lab.com/en/novel-finder")) {
				const match = linkElement.href.match(/\/novel\/(\d+)\//)
				if (match && match[1]) {
					rawId = match[1]
					serieId = mapping_getSerieIdForRawId(rawId)
				}
			} else {
				rawId = linkElement.dataset.novelId
				if (rawId) {
					serieId = mapping_getSerieIdForRawId(rawId)
				}
			}
		}

		let cachedAnalysis = null
		if (serieId) {
			cachedAnalysis = cache_getCachedAssessment(serieId)
			if (cachedAnalysis) {
				// Ensure cached analysis has availableUsernames for color coding
				if (!cachedAnalysis.availableUsernames) {
					cachedAnalysis.availableUsernames = []
				}
				// Ensure unknown field exists for backward compatibility
				cachedAnalysis = schema_populateUnknownField(cachedAnalysis)
			}
		}

		// Always call updateCardUI - with cachedAnalysis if available, or null if not
		// This ensures all novels get a trigger button (dual-purpose: analyze or show summary)
		updateCardUI(card, cachedAnalysis)

		// Mark as checked for cached status
		card.dataset.geminiCachedChecked = "true"
	})
}

/**
 * Main function to process novels (batch processing)
 */
async function processAllNovels() {
	if (!getApiKey()) {
		const modalSet = await showApiKeyModal()
		if (!modalSet) {
			return // User cancelled or closed modal
		}
	}

	// Validate serie_id mapping before proceeding
	if (getMappingSize() === 0) {
		console.error("PROCESSING HALTED: Serie ID map is empty. Cannot proceed with invalid mappings.")
		debugLog("Processing aborted: Serie ID map validation failed (empty map)")
		showMappingFailureNotification()
		return
	}

	const currentUrl = window.location.href
	const cardSelector = currentUrl.includes("wtr-lab.com/en/novel-finder") ? ".card" : ".series-list > .card"
	const allNovelCards = Array.from(document.querySelectorAll(cardSelector))
	const uncachedNovelCards = []

	for (const card of allNovelCards) {
		const linkElement = card.querySelector("a.title")
		let serieId = null
		let rawId = null

		if (linkElement) {
			if (currentUrl.includes("wtr-lab.com/en/novel-finder")) {
				const match = linkElement.href.match(/\/novel\/(\d+)\//)
				if (match && match[1]) {
					rawId = match[1]
					serieId = getSerieIdForRawId(rawId)
				}
			} else {
				rawId = linkElement.dataset.novelId
				if (rawId) {
					serieId = getSerieIdForRawId(rawId)
				}
			}
		}

		// Strict validation: verify the mapping is valid
		if (serieId && !validateSerieIdMapping(rawId, serieId)) {
			console.error(`PROCESSING HALTED: Invalid serie_id mapping detected for raw_id ${rawId}`)
			debugLog(`Processing aborted: Mapping validation failed for raw_id ${rawId}`)
			showMappingFailureNotification()
			return
		}

		if (!serieId) {
			console.warn(`No serie_id mapping found for card. Skipping this novel.`)
			debugLog(`Skipping novel: No mapping in serieIdMap`)
			continue
		}

		if (serieId && !getCachedAssessment(serieId)) {
			uncachedNovelCards.push(card)
		}
	}

	if (uncachedNovelCards.length === 0) {
		alert("No new novels to analyze.")
		return
	}

	const batch = uncachedNovelCards.slice(0, 1)
	const overlays = batch.map((card) => addLoadingOverlay(card))

	try {
		const result = await processBatch(batch, overlays)

		// Check if novel was cached
		if (result.novelsData.length === 0) {
			debugLog("Novel was cached - no API call needed")
		}
	} catch (error) {
		console.error("An error occurred during single novel processing:", error)
		overlays.forEach((overlay) => {
			if (overlay) {
				overlay.textContent = "Processing Failed"
				setTimeout(() => overlay.remove(), 4000)
			}
		})
	}
}

/**
 * Process a specific novel card
 * @param {Element} novelCardElement - The DOM element of the novel card to process
 */
async function processSpecificNovel(novelCardElement) {
	if (!settings_getApiKey()) {
		const modalSet = await panels_showApiKeyModal()
		if (!modalSet) {
			return // User cancelled or closed modal
		}
	}

	// Validate serie_id mapping before proceeding
	if (mapping_getMappingSize() === 0) {
		console.error("PROCESSING HALTED: Serie ID map is empty. Cannot proceed with invalid mappings.")
		debug_debugLog("Processing aborted: Serie ID map validation failed (empty map)")
		mapping_showMappingFailureNotification()
		return
	}

	// Extract novel data from the provided card element
	const linkElement = novelCardElement.querySelector("a.title")
	let serieId = null
	let rawId = null
	const currentUrl = window.location.href

	if (linkElement) {
		if (currentUrl.includes("wtr-lab.com/en/novel-finder")) {
			const match = linkElement.href.match(/\/novel\/(\d+)\//)
			if (match && match[1]) {
				rawId = match[1]
				serieId = mapping_getSerieIdForRawId(rawId)
			}
		} else {
			rawId = linkElement.dataset.novelId
			if (rawId) {
				serieId = mapping_getSerieIdForRawId(rawId)
			}
		}
	}

	// Strict validation: verify the mapping is valid
	if (serieId && !mapping_validateSerieIdMapping(rawId, serieId)) {
		console.error(`PROCESSING HALTED: Invalid serie_id mapping detected for raw_id ${rawId}`)
		debug_debugLog(`Processing aborted: Mapping validation failed for raw_id ${rawId}`)
		mapping_showMappingFailureNotification()
		return
	}

	if (!serieId) {
		console.warn(`No serie_id mapping found for card. Cannot process this novel.`)
		debug_debugLog(`Cannot process novel: No mapping in serieIdMap`)
		return
	}

	// Check if novel is already cached
	if (serieId && cache_getCachedAssessment(serieId)) {
		debug_debugLog(`Novel with serie_id ${serieId} is already cached - no processing needed`)
		return
	}

	// Process the single novel as a batch of size 1
	const batch = [novelCardElement]
	const overlays = batch.map((card) => cards_addLoadingOverlay(card))

	try {
		const result = await batch_processBatch(batch, overlays)

		// Check if novel was cached
		if (result.novelsData.length === 0) {
			debug_debugLog("Novel was cached - no API call needed")
		}
	} catch (error) {
		console.error("An error occurred during specific novel processing:", error)
		overlays.forEach((overlay) => {
			if (overlay) {
				overlay.textContent = "Processing Failed"
				setTimeout(() => overlay.remove(), 4000)
			}
		})
	}
}

;// ./src/utils/router.js
/**
 * Router Utility
 * Handles detection of client-side route changes (Single Page Application navigation)
 */



// Store the original history methods
const originalPushState = history.pushState
const originalReplaceState = history.replaceState

/**
 * Setup a listener for route changes
 * Detects History API changes (pushState, replaceState) and popstate events
 * @param {Function} callback - Function to execute when route changes
 */
function setupRouteChangeListener(callback) {
	debug_debugLog("Setting up route change listener")

	let debounceTimer = null

	// Handler for route changes with debounce
	const handleRouteChange = () => {
		const currentUrl = window.location.href
		debug_debugLog(`Route change detected (raw): ${currentUrl}`)

		if (debounceTimer) {
			clearTimeout(debounceTimer)
		}

		debounceTimer = setTimeout(() => {
			debug_debugLog(`Route change processed (debounced): ${currentUrl}`)
			callback(currentUrl)
		}, 500) // 500ms debounce delay
	}

	// 1. Listen for popstate (browser back/forward buttons)
	window.addEventListener("popstate", handleRouteChange)

	// 2. Monkey-patch pushState
	history.pushState = function (...args) {
		const result = originalPushState.apply(this, args)
		handleRouteChange()
		return result
	}

	// 3. Monkey-patch replaceState
	history.replaceState = function (...args) {
		const result = originalReplaceState.apply(this, args)
		handleRouteChange()
		return result
	}

	// 4. Fallback: Check for URL changes periodically in case other methods miss it
	// (Optional, but useful for some frameworks that suppress events)
	let lastUrl = window.location.href
	setInterval(() => {
		const currentUrl = window.location.href
		if (currentUrl !== lastUrl) {
			lastUrl = currentUrl
			handleRouteChange()
		}
	}, 1000)

	debug_debugLog("Route change listener active")
}

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(72);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(56);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/ui/styles/vendor/_material-icons.css
var _material_icons = __webpack_require__(483);
;// ./src/ui/styles/vendor/_material-icons.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(_material_icons/* default */.A, options);




       /* harmony default export */ const vendor_material_icons = (_material_icons/* default */.A && _material_icons/* default */.A.locals ? _material_icons/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/ui/styles/_base.css
var _base = __webpack_require__(229);
;// ./src/ui/styles/_base.css

      
      
      
      
      
      
      
      
      

var _base_options = {};

_base_options.styleTagTransform = (styleTagTransform_default());
_base_options.setAttributes = (setAttributesWithoutAttributes_default());
_base_options.insert = insertBySelector_default().bind(null, "head");
_base_options.domAPI = (styleDomAPI_default());
_base_options.insertStyleElement = (insertStyleElement_default());

var _base_update = injectStylesIntoStyleTag_default()(_base/* default */.A, _base_options);




       /* harmony default export */ const styles_base = (_base/* default */.A && _base/* default */.A.locals ? _base/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/ui/styles/components/_cards.css
var _cards = __webpack_require__(933);
;// ./src/ui/styles/components/_cards.css

      
      
      
      
      
      
      
      
      

var _cards_options = {};

_cards_options.styleTagTransform = (styleTagTransform_default());
_cards_options.setAttributes = (setAttributesWithoutAttributes_default());
_cards_options.insert = insertBySelector_default().bind(null, "head");
_cards_options.domAPI = (styleDomAPI_default());
_cards_options.insertStyleElement = (insertStyleElement_default());

var _cards_update = injectStylesIntoStyleTag_default()(_cards/* default */.A, _cards_options);




       /* harmony default export */ const components_cards = (_cards/* default */.A && _cards/* default */.A.locals ? _cards/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/ui/styles/components/_ratings.css
var _ratings = __webpack_require__(193);
;// ./src/ui/styles/components/_ratings.css

      
      
      
      
      
      
      
      
      

var _ratings_options = {};

_ratings_options.styleTagTransform = (styleTagTransform_default());
_ratings_options.setAttributes = (setAttributesWithoutAttributes_default());
_ratings_options.insert = insertBySelector_default().bind(null, "head");
_ratings_options.domAPI = (styleDomAPI_default());
_ratings_options.insertStyleElement = (insertStyleElement_default());

var _ratings_update = injectStylesIntoStyleTag_default()(_ratings/* default */.A, _ratings_options);




       /* harmony default export */ const components_ratings = (_ratings/* default */.A && _ratings/* default */.A.locals ? _ratings/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/ui/styles/components/_summary.css
var _summary = __webpack_require__(355);
;// ./src/ui/styles/components/_summary.css

      
      
      
      
      
      
      
      
      

var _summary_options = {};

_summary_options.styleTagTransform = (styleTagTransform_default());
_summary_options.setAttributes = (setAttributesWithoutAttributes_default());
_summary_options.insert = insertBySelector_default().bind(null, "head");
_summary_options.domAPI = (styleDomAPI_default());
_summary_options.insertStyleElement = (insertStyleElement_default());

var _summary_update = injectStylesIntoStyleTag_default()(_summary/* default */.A, _summary_options);




       /* harmony default export */ const components_summary = (_summary/* default */.A && _summary/* default */.A.locals ? _summary/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/ui/styles/components/_username.css
var _username = __webpack_require__(731);
;// ./src/ui/styles/components/_username.css

      
      
      
      
      
      
      
      
      

var _username_options = {};

_username_options.styleTagTransform = (styleTagTransform_default());
_username_options.setAttributes = (setAttributesWithoutAttributes_default());
_username_options.insert = insertBySelector_default().bind(null, "head");
_username_options.domAPI = (styleDomAPI_default());
_username_options.insertStyleElement = (insertStyleElement_default());

var _username_update = injectStylesIntoStyleTag_default()(_username/* default */.A, _username_options);




       /* harmony default export */ const components_username = (_username/* default */.A && _username/* default */.A.locals ? _username/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/ui/styles/components/_buttons.css
var _buttons = __webpack_require__(532);
;// ./src/ui/styles/components/_buttons.css

      
      
      
      
      
      
      
      
      

var _buttons_options = {};

_buttons_options.styleTagTransform = (styleTagTransform_default());
_buttons_options.setAttributes = (setAttributesWithoutAttributes_default());
_buttons_options.insert = insertBySelector_default().bind(null, "head");
_buttons_options.domAPI = (styleDomAPI_default());
_buttons_options.insertStyleElement = (insertStyleElement_default());

var _buttons_update = injectStylesIntoStyleTag_default()(_buttons/* default */.A, _buttons_options);




       /* harmony default export */ const components_buttons = (_buttons/* default */.A && _buttons/* default */.A.locals ? _buttons/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/ui/styles/components/_panels.css
var _panels = __webpack_require__(538);
;// ./src/ui/styles/components/_panels.css

      
      
      
      
      
      
      
      
      

var _panels_options = {};

_panels_options.styleTagTransform = (styleTagTransform_default());
_panels_options.setAttributes = (setAttributesWithoutAttributes_default());
_panels_options.insert = insertBySelector_default().bind(null, "head");
_panels_options.domAPI = (styleDomAPI_default());
_panels_options.insertStyleElement = (insertStyleElement_default());

var _panels_update = injectStylesIntoStyleTag_default()(_panels/* default */.A, _panels_options);




       /* harmony default export */ const components_panels = (_panels/* default */.A && _panels/* default */.A.locals ? _panels/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/ui/styles/components/_notifications.css
var _notifications = __webpack_require__(279);
;// ./src/ui/styles/components/_notifications.css

      
      
      
      
      
      
      
      
      

var _notifications_options = {};

_notifications_options.styleTagTransform = (styleTagTransform_default());
_notifications_options.setAttributes = (setAttributesWithoutAttributes_default());
_notifications_options.insert = insertBySelector_default().bind(null, "head");
_notifications_options.domAPI = (styleDomAPI_default());
_notifications_options.insertStyleElement = (insertStyleElement_default());

var _notifications_update = injectStylesIntoStyleTag_default()(_notifications/* default */.A, _notifications_options);




       /* harmony default export */ const components_notifications = (_notifications/* default */.A && _notifications/* default */.A.locals ? _notifications/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/ui/styles/components/_mobile.css
var _mobile = __webpack_require__(41);
;// ./src/ui/styles/components/_mobile.css

      
      
      
      
      
      
      
      
      

var _mobile_options = {};

_mobile_options.styleTagTransform = (styleTagTransform_default());
_mobile_options.setAttributes = (setAttributesWithoutAttributes_default());
_mobile_options.insert = insertBySelector_default().bind(null, "head");
_mobile_options.domAPI = (styleDomAPI_default());
_mobile_options.insertStyleElement = (insertStyleElement_default());

var _mobile_update = injectStylesIntoStyleTag_default()(_mobile/* default */.A, _mobile_options);




       /* harmony default export */ const components_mobile = (_mobile/* default */.A && _mobile/* default */.A.locals ? _mobile/* default */.A.locals : undefined);

;// ./src/ui/styles/index.js
/**
 * UI Styles Module
 * Main entry point for modular CSS stylesheets
 * Imports all component styles in the correct order for proper cascading
 */

// Import vendor styles first


// Import base styles


// Import component styles









;// ./src/main.js
/**
 * Main Initialization Module
 * Handles initialization and setup of the WTR-Lab Novel Reviewer
 */








// Import CSS styles


// Supported routes regex patterns
const main_SUPPORTED_ROUTES = [/^https:\/\/wtr-lab\.com\/en\/for-you/, /^https:\/\/wtr-lab\.com\/en\/novel-finder/]

// Debounce timer
let debounceTimer = null

// Global observer reference
let observer = null

/**
 * Initialize application logic for the current view
 */
async function initView() {
	debug_debugLog("Initializing view context...")
	resetMappingFailureNotification()

	// Validate and build serie_id mapping
	// We use the retry logic here to allow time for DOM/data to settle
	const mappingSuccess = await validateAndBuildSerieIdMap()

	if (!mappingSuccess) {
		console.warn("View initialization: Unable to build/update serie_id mapping")
		// We don't necessarily block everything, as cached data might still work
		// if the map isn't strictly required for display (though it is for processing)
		mapping_showMappingFailureNotification()
	} else {
		// If mapping succeeded, ensure we update the UI
		displayCachedAssessments()
	}
}

/**
 * Check if the current route is supported
 * @param {string} url - The URL to check
 * @returns {boolean} True if supported
 */
function isRouteSupported(url) {
	return main_SUPPORTED_ROUTES.some((regex) => regex.test(url))
}

/**
 * Handle client-side route changes
 * @param {string} url - The new URL
 */
async function handleRouteChange(url) {
	// Clear existing timer
	if (debounceTimer) {
		clearTimeout(debounceTimer)
	}

	// Set new timer for debounce
	debounceTimer = setTimeout(async () => {
		debug_debugLog(`Processing route change for: ${url}`)

		if (!isRouteSupported(url)) {
			debug_debugLog("[WTR-Lab] Unsupported route. Going idle.")
			return
		}

		// Attempt to update mapping from Next.js data
		// This is crucial for SPA navigation where __NEXT_DATA__ is stale
		const success = await updateMappingFromFetch(url)

		if (success) {
			resetMappingFailureNotification()
			displayCachedAssessments()
		} else {
			// Fallback to standard initialization (checks DOM/stale data)
			await initView()
		}
	}, 500)
}

/**
 * Main initialization function
 */
async function main() {
	debug_debugLog("WTR-Lab Novel Reviewer starting...")
	loadConfig()

	// Setup global UI components (one-time setup)
	createSettingsPanel()
	createApiKeyModal()
	setupConfig()

	// Setup route change listener for SPA navigation
	setupRouteChangeListener(handleRouteChange)

	// Run initial view setup
	await initView()

	// Setup MutationObserver to handle dynamic content loading
	// This ensures cards are processed as they appear in the DOM
	if (observer) {
		observer.disconnect()
	}

	observer = new MutationObserver((mutations) => {
		if (!isRouteSupported(window.location.href)) {
			return
		}

		// Check if we should update (basic debounce/check could be added if needed)
		const hasRelevantMutation = mutations.some(
			(m) =>
				m.addedNodes.length > 0 &&
				(m.target.classList?.contains("series-list") ||
					document.querySelector(".series-list") ||
					document.querySelector(".card")),
		)

		if (hasRelevantMutation) {
			displayCachedAssessments()
		}
	})

	observer.observe(document.body, { childList: true, subtree: true })
	debug_debugLog("MutationObserver started")
}

;// ./src/index.js
// ==UserScript==
// @name         WTR-Lab Novel Reviewer
// @namespace    http://tampermonkey.net/
// @version      1.8.1
// @description  Uses Gemini to analyze novels on wtr-lab.com. Adds a floating button to start analysis and displays an AI summary icon on each novel card. Comprehensive modular architecture with enhanced maintainability.
// @author       MasuRii
// @match        https://wtr-lab.com/en/for-you*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wtr-lab.com
// @connect      generativelanguage.googleapis.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      MIT
// ==/UserScript==

(function () {
	"use strict"

	// Wait for DOM to be ready
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", main)
	} else {
		// DOM is already ready
		main()
	}
})()

/******/ })()
;