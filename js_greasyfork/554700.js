// ==UserScript==
// @name         ITF Randevu Helper
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  ITF Randevu profil kaydetme ve otomatik doldurma kullanıcı betiği
// @author       menacetosociety
// @match        https://itfrandevu.istanbul.edu.tr/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554700/ITF%20Randevu%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/554700/ITF%20Randevu%20Helper.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/getPage.js":
/*!************************!*\
  !*** ./src/getPage.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getPage)
/* harmony export */ });
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function getPage() {
  return _getPage.apply(this, arguments);
}
function _getPage() {
  _getPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var timeout, waitForElement, loginPromise, appointmentsPromise, timeoutPromise, result;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          timeout = 20000; // 20 seconds
          // Helper function to wait for an element
          waitForElement = function waitForElement(selector, checkFunction) {
            return new Promise(function (resolve) {
              // Check if element already exists
              var checkElement = function checkElement() {
                var elements = document.querySelectorAll(selector);
                var found = Array.from(elements).find(checkFunction);
                if (found) {
                  resolve(true);
                  return true;
                }
                return false;
              };
              if (checkElement()) return;

              // Set up mutation observer to watch for DOM changes
              var observer = new MutationObserver(function () {
                if (checkElement()) {
                  observer.disconnect();
                }
              });
              observer.observe(document.body, {
                childList: true,
                subtree: true
              });
            });
          }; // Create promises for each page type
          loginPromise = waitForElement("h2", function (e) {
            return e.innerText === "Kimlik Sorgulama";
          }).then(function () {
            return "login";
          });
          appointmentsPromise = waitForElement("a.ProButton", function (e) {
            return e.innerText === "Randevularım";
          }).then(function () {
            return "appointments";
          });
          timeoutPromise = new Promise(function (resolve) {
            return setTimeout(function () {
              return resolve("unknown");
            }, timeout);
          }); // Race between the two element checks and timeout
          _context.n = 1;
          return Promise.race([loginPromise, appointmentsPromise, timeoutPromise]);
        case 1:
          result = _context.v;
          return _context.a(2, result);
      }
    }, _callee);
  }));
  return _getPage.apply(this, arguments);
}

/***/ }),

/***/ "./src/global.css":
/*!************************!*\
  !*** ./src/global.css ***!
  \************************/
/***/ ((module) => {

module.exports = "body {\r\n    display: flex;\r\n    flex-direction: column;\r\n}\r\n\r\ndiv.LoginInfo {\r\n    background: transparent;\r\n    pointer-events: none;\r\n    width: auto;\r\n    height: auto;\r\n    position: sticky;\r\n    top: 0px !important;\r\n\r\n    div.LoginInfoMessage {\r\n        left: 15% !important;\r\n        top: 0px !important;\r\n        position: relative;\r\n        max-height: 20vh;\r\n        overflow-y: auto;\r\n        pointer-events: all;\r\n\r\n        div.LoginInfoClose {\r\n            position: sticky !important;\r\n            top: 0px !important;\r\n\r\n            button {\r\n                width: 30px;\r\n                height: 30px;\r\n                border-radius: 50%;\r\n                right: 0px;\r\n                position: absolute;\r\n                margin: 0px;\r\n                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);\r\n            }\r\n        }\r\n    }\r\n\r\n    div.message {\r\n        height: max-content !important;\r\n        max-height: none !important;\r\n        overflow: hidden !important;\r\n    }\r\n}\r\n}\r\n\r\ndiv.overlayLoading {\r\n    background: transparent !important;\r\n    pointer-events: none !important;\r\n}";

/***/ }),

/***/ "./src/inject.js":
/*!***********************!*\
  !*** ./src/inject.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ inject)
/* harmony export */ });
/* harmony import */ var _getPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getPage */ "./src/getPage.js");
/* harmony import */ var _pages_login__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pages/login */ "./src/pages/login.js");
/* harmony import */ var _pages_appointments__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/appointments */ "./src/pages/appointments.js");
/* harmony import */ var _pages_helperSettings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/helperSettings */ "./src/pages/helperSettings.js");
/* harmony import */ var _global_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./global.css */ "./src/global.css");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }





function inject() {
  return _inject.apply(this, arguments);
}
function _inject() {
  _inject = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var page, style, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          // Initialize and cleanup profiles on startup
          _pages_helperSettings__WEBPACK_IMPORTED_MODULE_3__.initializeProfiles();
          _context.n = 1;
          return (0,_getPage__WEBPACK_IMPORTED_MODULE_0__["default"])();
        case 1:
          page = _context.v;
          console.log("Current page:", page);
          //inject global.css
          style = document.createElement('style');
          style.textContent = _global_css__WEBPACK_IMPORTED_MODULE_4__;
          document.head.appendChild(style);
          _t = page;
          _context.n = _t === "login" ? 2 : _t === "appointments" ? 3 : 4;
          break;
        case 2:
          console.log("Login page detected");
          _pages_login__WEBPACK_IMPORTED_MODULE_1__.inject();
          return _context.a(3, 5);
        case 3:
          console.log("Appointments page detected");
          _pages_appointments__WEBPACK_IMPORTED_MODULE_2__.inject();
          return _context.a(3, 5);
        case 4:
          console.log("Unknown page detected");
          return _context.a(3, 5);
        case 5:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _inject.apply(this, arguments);
}

/***/ }),

/***/ "./src/keyPress.js":
/*!*************************!*\
  !*** ./src/keyPress.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ keyPressOnInput)
/* harmony export */ });
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function keyPressOnInput(_x, _x2) {
  return _keyPressOnInput.apply(this, arguments);
}
function _keyPressOnInput() {
  _keyPressOnInput = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(inputElement, value) {
    var slow,
      i,
      _char,
      _i,
      _char2,
      _args = arguments;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          slow = _args.length > 2 && _args[2] !== undefined ? _args[2] : true;
          console.log("Starting to type into input: ".concat(inputElement.id || inputElement.name || 'unknown'));
          if (slow) {
            _context.n = 1;
            break;
          }
          // Dispatch events without delay
          for (i = 0; i < value.length; i++) {
            _char = value[i];
            inputElement.dispatchEvent(new KeyboardEvent('keydown', {
              key: _char,
              bubbles: true
            }));
            inputElement.dispatchEvent(new KeyboardEvent('keypress', {
              key: _char,
              bubbles: true
            }));
            inputElement.value += _char;
            inputElement.dispatchEvent(new Event('input', {
              bubbles: true
            }));
            inputElement.dispatchEvent(new KeyboardEvent('keyup', {
              key: _char,
              bubbles: true
            }));
          }
          console.log("Finished sudden typing into input: ".concat(inputElement.id || inputElement.name || 'unknown'));
          return _context.a(2);
        case 1:
          _i = 0;
        case 2:
          if (!(_i < value.length)) {
            _context.n = 5;
            break;
          }
          _char2 = value[_i]; // Random delay between 30-100ms to mimic human typing
          _context.n = 3;
          return new Promise(function (resolve) {
            return setTimeout(resolve, 30 + Math.random() * 70);
          });
        case 3:
          // Dispatch keyboard events
          inputElement.dispatchEvent(new KeyboardEvent('keydown', {
            key: _char2,
            bubbles: true
          }));
          inputElement.dispatchEvent(new KeyboardEvent('keypress', {
            key: _char2,
            bubbles: true
          }));

          // Update input value
          inputElement.value += _char2;

          // Trigger input event for frameworks that listen to it
          inputElement.dispatchEvent(new Event('input', {
            bubbles: true
          }));
          inputElement.dispatchEvent(new KeyboardEvent('keyup', {
            key: _char2,
            bubbles: true
          }));
        case 4:
          _i++;
          _context.n = 2;
          break;
        case 5:
          // Small delay after last character
          console.log("Finished typing into input: ".concat(inputElement.id || inputElement.name || 'unknown'));
          _context.n = 6;
          return new Promise(function (resolve) {
            return setTimeout(resolve, 50);
          });
        case 6:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _keyPressOnInput.apply(this, arguments);
}

/***/ }),

/***/ "./src/pages/appointments.css":
/*!************************************!*\
  !*** ./src/pages/appointments.css ***!
  \************************************/
/***/ ((module) => {

module.exports = "";

/***/ }),

/***/ "./src/pages/appointments.js":
/*!***********************************!*\
  !*** ./src/pages/appointments.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   inject: () => (/* binding */ inject),
/* harmony export */   injectCSS: () => (/* binding */ injectCSS),
/* harmony export */   injectJS: () => (/* binding */ injectJS)
/* harmony export */ });
/* harmony import */ var _appointments_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./appointments.css */ "./src/pages/appointments.css");
/* harmony import */ var _pages_helperSettings_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../pages/helperSettings.js */ "./src/pages/helperSettings.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



// Local Storage Keys
var STORAGE_KEYS = {
  PROFILES: 'itf_profiles',
  PENDING_PROFILE: 'itf_pending_profile'
};

// Get profiles from localStorage
function getProfiles() {
  var profilesJson = localStorage.getItem(STORAGE_KEYS.PROFILES);
  return profilesJson ? JSON.parse(profilesJson) : [];
}

// Save profiles to localStorage
function saveProfiles(profiles) {
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
}

// Complete pending profile with full name
function completePendingProfile() {
  var pendingJson = localStorage.getItem(STORAGE_KEYS.PENDING_PROFILE);
  if (!pendingJson) {
    return; // No pending profile
  }
  var pending = JSON.parse(pendingJson);
  var now = Date.now();
  var timeDiff = now - pending.createdAt;

  // Check if pending profile is within 10 seconds
  if (timeDiff > 10000) {
    // Older than 10 seconds, delete pending
    localStorage.removeItem(STORAGE_KEYS.PENDING_PROFILE);
    console.log('Pending profil zaman aşımına uğradı, silindi.');
    return;
  }

  // Try to get full name from page
  try {
    var identityElement = document.querySelector("#identity > span");
    if (!identityElement) {
      throw new Error('Identity element not found');
    }
    var metin = identityElement.innerText;
    var regex = /Sn\. (.*?),/;
    var eslesme = metin.match(regex);
    if (!eslesme || !eslesme[1]) {
      throw new Error('Name pattern not matched');
    }
    var isimSoyisim = eslesme[1];

    // Add full name to pending profile
    pending.fullName = isimSoyisim;

    // Get existing profiles
    var profiles = getProfiles();

    // Check if profile with same TC already exists
    var existingIndex = profiles.findIndex(function (p) {
      return p.tcNo === pending.tcNo;
    });
    if (existingIndex !== -1) {
      // Update existing profile
      profiles[existingIndex] = _objectSpread(_objectSpread(_objectSpread({}, profiles[existingIndex]), pending), {}, {
        // Keep the original name if it was custom named
        name: profiles[existingIndex].name
      });
      console.log('Profil güncellendi:', isimSoyisim);
    } else {
      // Add new profile
      profiles.push(pending);
      console.log('Yeni profil eklendi:', isimSoyisim);
    }
    saveProfiles(profiles);

    // Remove pending profile
    localStorage.removeItem(STORAGE_KEYS.PENDING_PROFILE);
  } catch (error) {
    // Could not complete profile
    localStorage.removeItem(STORAGE_KEYS.PENDING_PROFILE);
    alert('Profil otomatik olarak eklenemedi. İsim bulunamadı.');
    console.error('Profil tamamlama hatası:', error);
  }
}
function injectCSS() {
  // Add custom CSS styles for appointments page
  var style = document.createElement('style');
  style.textContent = _appointments_css__WEBPACK_IMPORTED_MODULE_0__;
  document.head.appendChild(style);
}
function injectJS() {
  // Complete pending profile if exists
  completePendingProfile();
  var appointmentsBtn = Array.from(document.querySelectorAll("a.ProButton")).filter(function (e) {
    return e.innerText == "Randevularım";
  })[0];
  if (!appointmentsBtn) {
    console.log("Appointments button not found");
    return;
  }
  ;
  var helperSettingsBtn = document.createElement("a");
  helperSettingsBtn.innerText = "Helper Ayarları";
  helperSettingsBtn.href = "#";
  helperSettingsBtn.classList.add("ProButton");
  appointmentsBtn.parentElement.appendChild(helperSettingsBtn);
  helperSettingsBtn.addEventListener("click", function (e) {
    e.preventDefault();
    _pages_helperSettings_js__WEBPACK_IMPORTED_MODULE_1__.click();
  });
}
function inject() {
  injectCSS();
  injectJS();
}

/***/ }),

/***/ "./src/pages/helperSettings.css":
/*!**************************************!*\
  !*** ./src/pages/helperSettings.css ***!
  \**************************************/
/***/ ((module) => {

module.exports = "/* Helper Settings Modal */\r\n.itf-helper-overlay {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: rgba(0, 0, 0, 0.5);\r\n    z-index: 9998;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n\r\n.itf-helper-modal {\r\n    position: relative;\r\n    background: white;\r\n    border-radius: 8px;\r\n    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\r\n    width: 90%;\r\n    max-width: 600px;\r\n    max-height: 80vh;\r\n    overflow: hidden;\r\n    z-index: 9999;\r\n}\r\n\r\n.itf-helper-modal-header {\r\n    padding: 20px;\r\n    border-bottom: 1px solid #dee2e6;\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n}\r\n\r\n.itf-helper-modal-header h5 {\r\n    margin: 0;\r\n    font-size: 1.25rem;\r\n}\r\n\r\n.itf-helper-close {\r\n    background: none;\r\n    border: none;\r\n    font-size: 1.5rem;\r\n    cursor: pointer;\r\n    color: #6c757d;\r\n    padding: 0;\r\n    width: 30px;\r\n    height: 30px;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    border-radius: 4px;\r\n    transition: all 0.2s;\r\n}\r\n\r\n.itf-helper-close:hover {\r\n    background-color: #f8f9fa;\r\n    color: #000;\r\n}\r\n\r\n.itf-helper-modal-body {\r\n    padding: 0;\r\n    overflow-y: auto;\r\n    max-height: calc(80vh - 140px);\r\n}\r\n\r\n.itf-helper-modal-footer {\r\n    padding: 15px 20px;\r\n    border-top: 1px solid #dee2e6;\r\n    display: flex;\r\n    justify-content: flex-end;\r\n}\r\n\r\n/* Tabs */\r\n.itf-helper-tabs {\r\n    display: flex;\r\n    border-bottom: 2px solid #dee2e6;\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style: none;\r\n    background-color: #f8f9fa;\r\n}\r\n\r\n.itf-helper-tab {\r\n    flex: 1;\r\n}\r\n\r\n.itf-helper-tab-button {\r\n    width: 100%;\r\n    padding: 15px 20px;\r\n    background: none;\r\n    border: none;\r\n    border-bottom: 3px solid transparent;\r\n    cursor: pointer;\r\n    font-size: 1rem;\r\n    font-weight: 500;\r\n    color: #6c757d;\r\n    transition: all 0.2s;\r\n    position: relative;\r\n    top: 2px;\r\n}\r\n\r\n.itf-helper-tab-button:hover {\r\n    background-color: #e9ecef;\r\n    color: #495057;\r\n}\r\n\r\n.itf-helper-tab-button.active {\r\n    color: #ff8108;\r\n    border-bottom-color: #ff8108;\r\n    background-color: white;\r\n}\r\n\r\n.itf-helper-tab-content {\r\n    display: none;\r\n    padding: 20px;\r\n}\r\n\r\n.itf-helper-tab-content.active {\r\n    display: block;\r\n}\r\n\r\n/* Form Elements */\r\n.itf-helper-form-group {\r\n    margin-bottom: 20px;\r\n}\r\n\r\n.itf-helper-checkbox {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 10px;\r\n    cursor: pointer;\r\n}\r\n\r\n.itf-helper-checkbox input[type=\"checkbox\"] {\r\n    width: 18px;\r\n    height: 18px;\r\n    cursor: pointer;\r\n    accent-color: #ff8108;\r\n}\r\n\r\n.itf-helper-checkbox label {\r\n    cursor: pointer;\r\n    font-size: 0.95rem;\r\n    margin: 0;\r\n    user-select: none;\r\n}\r\n\r\n.itf-helper-select-group {\r\n    margin-left: 28px;\r\n    margin-top: 10px;\r\n}\r\n\r\n.itf-helper-select {\r\n    box-sizing: border-box;\r\n    width: 100%;\r\n    padding: 8px 12px;\r\n    border: 1px solid #ced4da;\r\n    border-radius: 4px;\r\n    font-size: 0.9rem;\r\n    background-color: white;\r\n    cursor: pointer;\r\n    transition: border-color 0.2s;\r\n}\r\n\r\n.itf-helper-select:focus {\r\n    outline: none;\r\n    border-color: #ff8108;\r\n    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);\r\n}\r\n\r\n.itf-helper-select:disabled {\r\n    background-color: #e9ecef;\r\n    cursor: not-allowed;\r\n    opacity: 0.6;\r\n}\r\n\r\n.itf-helper-button {\r\n    padding: 8px 16px;\r\n    border: none;\r\n    border-radius: 4px;\r\n    font-size: 0.9rem;\r\n    cursor: pointer;\r\n    transition: all 0.2s;\r\n    font-weight: 500;\r\n}\r\n\r\n.itf-helper-button-danger {\r\n    background-color: #dc3545;\r\n    color: white;\r\n}\r\n\r\n.itf-helper-button-danger:hover {\r\n    background-color: #bb2d3b;\r\n}\r\n\r\n.itf-helper-divider {\r\n    margin: 20px 0;\r\n    border-top: 1px solid #dee2e6;\r\n}\r\n\r\n/* Profile List */\r\n.itf-profile-item {\r\n    padding: 10px 15px;\r\n    border: 1px solid #dee2e6;\r\n    border-radius: 4px;\r\n    margin-bottom: 10px;\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    transition: background-color 0.2s;\r\n}\r\n\r\n.itf-profile-item:hover {\r\n    background-color: #f8f9fa;\r\n}\r\n\r\n.itf-profile-actions {\r\n    display: flex;\r\n    gap: 10px;\r\n    opacity: 0;\r\n    transition: opacity 0.2s;\r\n}\r\n\r\n.itf-profile-item:hover .itf-profile-actions {\r\n    opacity: 1;\r\n}\r\n\r\n.itf-profile-actions button {\r\n    background: none;\r\n    border: none;\r\n    cursor: pointer;\r\n    padding: 5px;\r\n    border-radius: 4px;\r\n    transition: background-color 0.2s;\r\n}\r\n\r\n.itf-profile-actions button:hover {\r\n    background-color: #e9ecef;\r\n}\r\n\r\n.itf-profile-actions .edit-icon {\r\n    color: #ff8108;\r\n}\r\n\r\n.itf-profile-actions .delete-icon {\r\n    color: #dc3545;\r\n}\r\n\r\n.form-check-input:disabled ~ .form-check-label {\r\n    opacity: 0.5;\r\n}\r\n";

/***/ }),

/***/ "./src/pages/helperSettings.js":
/*!*************************************!*\
  !*** ./src/pages/helperSettings.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   click: () => (/* binding */ click),
/* harmony export */   initializeProfiles: () => (/* binding */ initializeProfiles)
/* harmony export */ });
/* harmony import */ var _helperSettings_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helperSettings.css */ "./src/pages/helperSettings.css");


// Local Storage Keys
var STORAGE_KEYS = {
  AUTO_FILL: 'itf_auto_fill',
  AUTO_SAVE: 'itf_auto_save',
  AUTO_LOGIN: 'itf_auto_login',
  SELECTED_PROFILE_FILL: 'itf_selected_profile_fill',
  SELECTED_PROFILE_LOGIN: 'itf_selected_profile_login',
  PROFILES: 'itf_profiles',
  PENDING_PROFILE: 'itf_pending_profile'
};

// Get settings from localStorage
function getSettings() {
  // Get auto save setting, default to true if not set
  var autoSaveValue = localStorage.getItem(STORAGE_KEYS.AUTO_SAVE);
  var autoSave = autoSaveValue === null ? true : autoSaveValue === 'true';
  return {
    autoFill: localStorage.getItem(STORAGE_KEYS.AUTO_FILL) === 'true',
    autoSave: autoSave,
    autoLogin: localStorage.getItem(STORAGE_KEYS.AUTO_LOGIN) === 'true',
    selectedProfileFill: localStorage.getItem(STORAGE_KEYS.SELECTED_PROFILE_FILL) || '',
    selectedProfileLogin: localStorage.getItem(STORAGE_KEYS.SELECTED_PROFILE_LOGIN) || ''
  };
}

// Save settings to localStorage
function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.AUTO_FILL, settings.autoFill);
  localStorage.setItem(STORAGE_KEYS.AUTO_SAVE, settings.autoSave);
  localStorage.setItem(STORAGE_KEYS.AUTO_LOGIN, settings.autoLogin);
  if (settings.selectedProfileFill) {
    localStorage.setItem(STORAGE_KEYS.SELECTED_PROFILE_FILL, settings.selectedProfileFill);
  }
  if (settings.selectedProfileLogin) {
    localStorage.setItem(STORAGE_KEYS.SELECTED_PROFILE_LOGIN, settings.selectedProfileLogin);
  }
}

// Get profiles from localStorage
function getProfiles() {
  var profilesJson = localStorage.getItem(STORAGE_KEYS.PROFILES);
  return profilesJson ? JSON.parse(profilesJson) : [];
}

// Save profiles to localStorage
function saveProfiles(profiles) {
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
}

// Clean duplicate profiles (keep the latest one for each TC)
function cleanDuplicateProfiles() {
  var profiles = getProfiles();
  if (profiles.length === 0) {
    // Still check selected profiles even if no profiles exist
    cleanupSelectedProfiles([]);
    return profiles;
  }

  // Group profiles by TC number
  var profileMap = new Map();
  profiles.forEach(function (profile) {
    if (!profile.tcNo) {
      // Keep profiles without TC as is
      var uniqueKey = "no-tc-".concat(profile.name, "-").concat(profile.createdAt);
      profileMap.set(uniqueKey, profile);
      return;
    }
    var existing = profileMap.get(profile.tcNo);
    if (!existing) {
      // First profile with this TC
      profileMap.set(profile.tcNo, profile);
    } else {
      // Compare dates and keep the newer one
      var existingDate = new Date(existing.createdAt || 0).getTime();
      var currentDate = new Date(profile.createdAt || 0).getTime();
      if (currentDate > existingDate) {
        // Current profile is newer, replace
        profileMap.set(profile.tcNo, profile);
      }
      // Otherwise keep the existing one
    }
  });

  // Convert map back to array
  var cleanedProfiles = Array.from(profileMap.values());

  // If we removed duplicates, save the cleaned list
  if (cleanedProfiles.length < profiles.length) {
    console.log("".concat(profiles.length - cleanedProfiles.length, " duplicate profil silindi."));
    saveProfiles(cleanedProfiles);
  }

  // Always check if selected profiles still exist (after cleanup)
  cleanupSelectedProfiles(cleanedProfiles);
  return cleanedProfiles;
}

// Cleanup selected profiles if they no longer exist
function cleanupSelectedProfiles(profiles) {
  var settings = getSettings();
  var profileTCs = profiles.map(function (p) {
    return p.tcNo;
  }).filter(function (tc) {
    return tc;
  });
  var needsUpdate = false;

  // Check if selected fill profile still exists
  if (settings.selectedProfileFill && !profileTCs.includes(settings.selectedProfileFill)) {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_PROFILE_FILL);
    settings.autoFill = false;
    needsUpdate = true;
    console.log('Seçili doldurma profili bulunamadı, kaldırıldı.');
  }

  // Check if selected login profile still exists
  if (settings.selectedProfileLogin && !profileTCs.includes(settings.selectedProfileLogin)) {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_PROFILE_LOGIN);
    settings.autoLogin = false;
    needsUpdate = true;
    console.log('Seçili giriş profili bulunamadı, kaldırıldı.');
  }
  if (needsUpdate) {
    saveSettings(settings);
  }
}

// Initialize and cleanup profiles on load
function initializeProfiles() {
  cleanDuplicateProfiles();
}

// Reset all helper data
function resetHelper() {
  if (confirm('Tüm ayarlar ve profiller silinecek. Devam etmek istiyor musunuz?')) {
    Object.values(STORAGE_KEYS).forEach(function (key) {
      return localStorage.removeItem(key);
    });
    closeModal();
    alert('Helper sıfırlandı!');
    location.reload();
  }
}

// Close modal
function closeModal() {
  var overlay = document.getElementById('itf-helper-overlay');
  if (overlay) {
    overlay.remove();
    // Dispatch event to notify other modules that settings changed
    window.dispatchEvent(new CustomEvent('itf-settings-changed'));
  }
}

// Render profiles list
function renderProfiles() {
  var profiles = getProfiles();
  var container = document.getElementById('itf-profiles-list');
  if (profiles.length === 0) {
    container.innerHTML = '<p class="text-muted">Henüz kayıtlı profil yok.</p>';
    return;
  }
  container.innerHTML = profiles.map(function (profile, index) {
    return "\n        <div class=\"itf-profile-item\">\n            <div>\n                <div style=\"font-weight: 500;\">".concat(profile.fullName || profile.name, "</div>\n            </div>\n            <div class=\"itf-profile-actions\">\n                <button class=\"edit-icon\" data-index=\"").concat(index, "\" title=\"D\xFCzenle\">\n                    <svg width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\">\n                        <path d=\"M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z\"/>\n                    </svg>\n                </button>\n                <button class=\"delete-icon\" data-index=\"").concat(index, "\" title=\"Sil\">\n                    <svg width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\">\n                        <path d=\"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z\"/>\n                        <path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\"/>\n                    </svg>\n                </button>\n            </div>\n        </div>\n    ");
  }).join('');

  // Add event listeners for edit and delete
  container.querySelectorAll('.edit-icon').forEach(function (btn) {
    btn.addEventListener('click', function () {
      return editProfile(parseInt(btn.dataset.index));
    });
  });
  container.querySelectorAll('.delete-icon').forEach(function (btn) {
    btn.addEventListener('click', function () {
      return deleteProfile(parseInt(btn.dataset.index));
    });
  });
}

// Update profile dropdowns
function updateProfileDropdowns() {
  var profiles = getProfiles();
  var settings = getSettings();
  var fillSelect = document.getElementById('itf-profile-fill');
  var loginSelect = document.getElementById('itf-profile-login');
  var options = profiles.map(function (profile) {
    return "<option value=\"".concat(profile.tcNo, "\">").concat(profile.fullName || profile.name, "</option>");
  }).join('');
  fillSelect.innerHTML = '<option value="">Profil Seçin</option>' + options;
  loginSelect.innerHTML = '<option value="">Profil Seçin</option>' + options;
  if (settings.selectedProfileFill) {
    fillSelect.value = settings.selectedProfileFill;
  }
  if (settings.selectedProfileLogin) {
    loginSelect.value = settings.selectedProfileLogin;
  }
}

// Edit profile
function editProfile(index) {
  var profiles = getProfiles();
  var profile = profiles[index];

  // Create edit modal
  var editModalHTML = "\n        <div id=\"itf-edit-modal-overlay\" class=\"itf-helper-overlay\">\n            <div class=\"itf-helper-modal\" style=\"max-width: 500px;\">\n                <div class=\"itf-helper-modal-header\">\n                    <h5>Profil D\xFCzenle</h5>\n                    <button type=\"button\" class=\"itf-helper-close\" id=\"itf-close-edit-modal\">\n                        <span>&times;</span>\n                    </button>\n                </div>\n                <div class=\"itf-helper-modal-body\" style=\"padding: 20px;\">\n                    <div class=\"itf-helper-form-group\">\n                        <label style=\"display: block; margin-bottom: 5px; font-weight: 500;\">\u0130sim Soyisim</label>\n                        <input type=\"text\" id=\"edit-fullname\" class=\"itf-helper-select\" value=\"".concat(profile.fullName || '', "\" placeholder=\"\u0130sim Soyisim\" readonly style=\"background-color: #e9ecef; cursor: not-allowed;\" title=\"Hem ITF Randevu hem de bu helper kullan\u0131c\u0131 beti\u011Fini kullan\u0131rken resmi bir isim de\u011Fi\u015Fikli\u011Fine gidecek kadar ni\u015F bir duruma kar\u0131\u015Ft\u0131ysan merak etme buras\u0131 otomatik olarak g\xFCncellenecek senin de\u011Fi\u015Ftirmene gerek yok xd\">\n                    </div>\n                    <div class=\"itf-helper-form-group\">\n                        <label style=\"display: block; margin-bottom: 5px; font-weight: 500;\">TC No</label>\n                        <input type=\"text\" id=\"edit-tcno\" class=\"itf-helper-select\" value=\"").concat(profile.tcNo || '', "\" placeholder=\"TC No\">\n                    </div>\n                    <div class=\"itf-helper-form-group\">\n                        <label style=\"display: block; margin-bottom: 5px; font-weight: 500;\">Telefon</label>\n                        <input type=\"text\" id=\"edit-phone\" class=\"itf-helper-select\" value=\"").concat(profile.phone || '', "\" placeholder=\"Telefon\">\n                    </div>\n                    <div class=\"itf-helper-form-group\">\n                        <label style=\"display: block; margin-bottom: 5px; font-weight: 500;\">Baba Ad\u0131</label>\n                        <input type=\"text\" id=\"edit-father\" class=\"itf-helper-select\" value=\"").concat(profile.fatherName || '', "\" placeholder=\"Baba Ad\u0131\">\n                    </div>\n                    <div class=\"itf-helper-form-group\">\n                        <label style=\"display: block; margin-bottom: 5px; font-weight: 500;\">Do\u011Fum Y\u0131l\u0131</label>\n                        <input type=\"text\" id=\"edit-birth\" class=\"itf-helper-select\" value=\"").concat(profile.birthDate || '', "\" placeholder=\"Do\u011Fum Y\u0131l\u0131\">\n                    </div>\n                    <div style=\"display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;\">\n                        <button class=\"ProButton itf-helper-button\" id=\"cancel-edit\" style=\"background-color: #6c757d; color: white;\">\n                            \u0130ptal\n                        </button>\n                        <button class=\"ProButton itf-helper-button\" id=\"save-edit\" style=\"background-color: #0d6efd; color: white;\">\n                            Kaydet\n                        </button>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ");
  document.body.insertAdjacentHTML('beforeend', editModalHTML);

  // Close modal handlers
  var closeEditModal = function closeEditModal() {
    var modal = document.getElementById('itf-edit-modal-overlay');
    if (modal) modal.remove();
  };
  document.getElementById('itf-close-edit-modal').addEventListener('click', closeEditModal);
  document.getElementById('cancel-edit').addEventListener('click', closeEditModal);
  document.getElementById('itf-edit-modal-overlay').addEventListener('click', function (e) {
    if (e.target.id === 'itf-edit-modal-overlay') {
      closeEditModal();
    }
  });

  // Save edit handler
  document.getElementById('save-edit').addEventListener('click', function () {
    var tcNo = document.getElementById('edit-tcno').value.trim();
    var phone = document.getElementById('edit-phone').value.trim();
    var fatherName = document.getElementById('edit-father').value.trim();
    var birthDate = document.getElementById('edit-birth').value.trim();
    if (!tcNo || !phone || !fatherName || !birthDate) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    // Update profile (fullName is readonly, keep it as is)
    profiles[index].tcNo = tcNo;
    profiles[index].phone = phone;
    profiles[index].fatherName = fatherName;
    profiles[index].birthDate = birthDate;
    saveProfiles(profiles);
    renderProfiles();
    updateProfileDropdowns();
    closeEditModal();
  });
}

// Delete profile
function deleteProfile(index) {
  var profiles = getProfiles();
  var profile = profiles[index];
  if (confirm("\"".concat(profile.fullName, "\" profilini silmek istedi\u011Finizden emin misiniz?"))) {
    profiles.splice(index, 1);
    saveProfiles(profiles);
    renderProfiles();
    updateProfileDropdowns();
  }
}

// Handle checkbox changes
function handleCheckboxChange() {
  var autoFill = document.getElementById('itf-auto-fill').checked;
  var autoLogin = document.getElementById('itf-auto-login').checked;
  var fillGroup = document.getElementById('itf-fill-group');
  var loginGroup = document.getElementById('itf-login-group');

  // If auto login is enabled, disable auto fill
  if (autoLogin) {
    document.getElementById('itf-auto-fill').disabled = true;
    fillGroup.style.display = 'none';
    loginGroup.style.display = 'block';
  } else {
    document.getElementById('itf-auto-fill').disabled = false;
    fillGroup.style.display = autoFill ? 'block' : 'none';
    loginGroup.style.display = 'none';
  }
}
function click() {
  // Check if modal already exists
  if (document.getElementById('itf-helper-overlay')) {
    return;
  }

  // Inject CSS if not already injected
  if (!document.getElementById('itf-helper-settings-style')) {
    var style = document.createElement('style');
    style.id = 'itf-helper-settings-style';
    style.textContent = _helperSettings_css__WEBPACK_IMPORTED_MODULE_0__;
    document.head.appendChild(style);
  }
  var settings = getSettings();

  // Create modal HTML
  var modalHTML = "\n        <div id=\"itf-helper-overlay\" class=\"itf-helper-overlay\">\n            <div class=\"itf-helper-modal\">\n                <div class=\"itf-helper-modal-header\">\n                    <h5>Randevu Yard\u0131mc\u0131s\u0131 Ayarlar\u0131</h5>\n                    <button type=\"button\" class=\"itf-helper-close\" id=\"itf-close-modal\">\n                        <span>&times;</span>\n                    </button>\n                </div>\n                <div class=\"itf-helper-modal-body\">\n                    <ul class=\"itf-helper-tabs\">\n                        <li class=\"itf-helper-tab\">\n                            <button class=\"itf-helper-tab-button active\" id=\"general-tab\" data-tab=\"general\">\n                                Genel\n                            </button>\n                        </li>\n                        <li class=\"itf-helper-tab\">\n                            <button class=\"itf-helper-tab-button\" id=\"profiles-tab\" data-tab=\"profiles\">\n                                Profiller\n                            </button>\n                        </li>\n                    </ul>\n                    \n                    <div class=\"itf-helper-tab-content active\" id=\"general\">\n                        <div class=\"itf-helper-form-group\">\n                            <div class=\"itf-helper-checkbox\">\n                                <input type=\"checkbox\" id=\"itf-auto-fill\" ".concat(settings.autoFill ? 'checked' : '', ">\n                                <label for=\"itf-auto-fill\">\n                                    Otomatik olarak doldur\n                                </label>\n                            </div>\n                            <div id=\"itf-fill-group\" class=\"itf-helper-select-group\" style=\"display: ").concat(settings.autoFill ? 'block' : 'none', ";\">\n                                <select class=\"itf-helper-select\" id=\"itf-profile-fill\">\n                                    <option value=\"\">Profil Se\xE7in</option>\n                                </select>\n                            </div>\n                        </div>\n                        \n                        <div class=\"itf-helper-form-group\">\n                            <div class=\"itf-helper-checkbox\">\n                                <input type=\"checkbox\" id=\"itf-auto-save\" ").concat(settings.autoSave ? 'checked' : '', ">\n                                <label for=\"itf-auto-save\">\n                                    Otomatik olarak kaydet\n                                </label>\n                            </div>\n                        </div>\n                        \n                        <div class=\"itf-helper-form-group\">\n                            <div class=\"itf-helper-checkbox\">\n                                <input type=\"checkbox\" id=\"itf-auto-login\" ").concat(settings.autoLogin ? 'checked' : '', ">\n                                <label for=\"itf-auto-login\">\n                                    Otomatik olarak giri\u015F yap\n                                </label>\n                            </div>\n                            <div id=\"itf-login-group\" class=\"itf-helper-select-group\" style=\"display: ").concat(settings.autoLogin ? 'block' : 'none', ";\">\n                                <select class=\"itf-helper-select\" id=\"itf-profile-login\">\n                                    <option value=\"\">Profil Se\xE7in</option>\n                                </select>\n                            </div>\n                        </div>\n                        \n                        <div class=\"itf-helper-divider\"></div>\n                        \n                        <div>\n                            <button class=\"ProButton itf-helper-button itf-helper-button-danger\" id=\"itf-reset-helper\">\n                                Helper'\u0131 S\u0131f\u0131rla\n                            </button>\n                        </div>\n                    </div>\n                    \n                    <div class=\"itf-helper-tab-content\" id=\"profiles\">\n                        <div id=\"itf-profiles-list\"></div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ");

  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Initialize profiles and dropdowns
  renderProfiles();
  updateProfileDropdowns();
  handleCheckboxChange();

  // Tab switching functionality
  document.querySelectorAll('.itf-helper-tab-button').forEach(function (button) {
    button.addEventListener('click', function () {
      var targetTab = button.dataset.tab;

      // Remove active class from all tabs and contents
      document.querySelectorAll('.itf-helper-tab-button').forEach(function (btn) {
        return btn.classList.remove('active');
      });
      document.querySelectorAll('.itf-helper-tab-content').forEach(function (content) {
        return content.classList.remove('active');
      });

      // Add active class to clicked tab and corresponding content
      button.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });

  // Event listeners
  document.getElementById('itf-close-modal').addEventListener('click', closeModal);
  document.getElementById('itf-helper-overlay').addEventListener('click', function (e) {
    if (e.target.id === 'itf-helper-overlay') {
      closeModal();
    }
  });
  document.getElementById('itf-reset-helper').addEventListener('click', resetHelper);

  // Checkbox change listeners
  document.getElementById('itf-auto-fill').addEventListener('change', function (e) {
    handleCheckboxChange();
    var settings = getSettings();
    settings.autoFill = e.target.checked;
    saveSettings(settings);
  });
  document.getElementById('itf-auto-save').addEventListener('change', function (e) {
    var settings = getSettings();
    settings.autoSave = e.target.checked;
    saveSettings(settings);
  });
  document.getElementById('itf-auto-login').addEventListener('change', function (e) {
    handleCheckboxChange();
    var settings = getSettings();
    settings.autoLogin = e.target.checked;
    saveSettings(settings);
  });

  // Dropdown change listeners
  document.getElementById('itf-profile-fill').addEventListener('change', function (e) {
    var settings = getSettings();
    settings.selectedProfileFill = e.target.value;
    saveSettings(settings);
  });
  document.getElementById('itf-profile-login').addEventListener('change', function (e) {
    var settings = getSettings();
    settings.selectedProfileLogin = e.target.value;
    saveSettings(settings);
  });
}

/***/ }),

/***/ "./src/pages/login.css":
/*!*****************************!*\
  !*** ./src/pages/login.css ***!
  \*****************************/
/***/ ((module) => {

module.exports = "";

/***/ }),

/***/ "./src/pages/login.js":
/*!****************************!*\
  !*** ./src/pages/login.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   inject: () => (/* binding */ inject),
/* harmony export */   injectCSS: () => (/* binding */ injectCSS),
/* harmony export */   injectJS: () => (/* binding */ injectJS)
/* harmony export */ });
/* harmony import */ var _keyPress__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../keyPress */ "./src/keyPress.js");
/* harmony import */ var _login_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./login.css */ "./src/pages/login.css");
/* harmony import */ var _pages_helperSettings_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../pages/helperSettings.js */ "./src/pages/helperSettings.js");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }




// Local Storage Keys
var STORAGE_KEYS = {
  AUTO_FILL: 'itf_auto_fill',
  AUTO_SAVE: 'itf_auto_save',
  AUTO_LOGIN: 'itf_auto_login',
  SELECTED_PROFILE_FILL: 'itf_selected_profile_fill',
  SELECTED_PROFILE_LOGIN: 'itf_selected_profile_login',
  PROFILES: 'itf_profiles',
  PENDING_PROFILE: 'itf_pending_profile'
};

// Get settings from localStorage
function getSettings() {
  // Get auto save setting, default to true if not set
  var autoSaveValue = localStorage.getItem(STORAGE_KEYS.AUTO_SAVE);
  var autoSave = autoSaveValue === null ? true : autoSaveValue === 'true';
  return {
    autoFill: localStorage.getItem(STORAGE_KEYS.AUTO_FILL) === 'true',
    autoSave: autoSave,
    autoLogin: localStorage.getItem(STORAGE_KEYS.AUTO_LOGIN) === 'true',
    selectedProfileFill: localStorage.getItem(STORAGE_KEYS.SELECTED_PROFILE_FILL) || '',
    selectedProfileLogin: localStorage.getItem(STORAGE_KEYS.SELECTED_PROFILE_LOGIN) || ''
  };
}

// Get profiles from localStorage
function getProfiles() {
  var profilesJson = localStorage.getItem(STORAGE_KEYS.PROFILES);
  return profilesJson ? JSON.parse(profilesJson) : [];
}

// Save profiles to localStorage
function saveProfiles(profiles) {
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
}

// Save current profile as pending (waiting for full name)
function savePendingProfile(inputs) {
  var now = new Date();
  var profileName = "Profil ".concat(now.toLocaleDateString('tr-TR'), " ").concat(now.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  }));
  var pendingProfile = {
    name: profileName,
    tcNo: inputs.tcNo.value,
    phone: inputs.phone.value,
    fatherName: inputs.fatherName.value,
    birthDate: inputs.birthDate.value,
    createdAt: Date.now()
  };
  localStorage.setItem(STORAGE_KEYS.PENDING_PROFILE, JSON.stringify(pendingProfile));
  console.log('Pending profil kaydedildi:', profileName);
}

// Fill inputs with profile data (by TC number)
function fillProfile(_x, _x2) {
  return _fillProfile.apply(this, arguments);
}
function _fillProfile() {
  _fillProfile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(profileTC, inputs) {
    var profiles, profile;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          profiles = getProfiles();
          profile = profiles.find(function (p) {
            return p.tcNo === profileTC;
          });
          if (profile) {
            _context.n = 1;
            break;
          }
          console.error('Profil bulunamadı (TC):', profileTC);
          return _context.a(2);
        case 1:
          console.log('Profil dolduruluyor:', profile.fullName || profile.name);

          // Fill inputs with animation
          if (!profile.tcNo) {
            _context.n = 2;
            break;
          }
          _context.n = 2;
          return (0,_keyPress__WEBPACK_IMPORTED_MODULE_0__["default"])(inputs.tcNo, profile.tcNo, false);
        case 2:
          if (!profile.phone) {
            _context.n = 3;
            break;
          }
          _context.n = 3;
          return (0,_keyPress__WEBPACK_IMPORTED_MODULE_0__["default"])(inputs.phone, profile.phone, false);
        case 3:
          if (!profile.fatherName) {
            _context.n = 4;
            break;
          }
          _context.n = 4;
          return (0,_keyPress__WEBPACK_IMPORTED_MODULE_0__["default"])(inputs.fatherName, profile.fatherName, false);
        case 4:
          if (!profile.birthDate) {
            _context.n = 5;
            break;
          }
          _context.n = 5;
          return (0,_keyPress__WEBPACK_IMPORTED_MODULE_0__["default"])(inputs.birthDate, profile.birthDate, false);
        case 5:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _fillProfile.apply(this, arguments);
}
function injectCSS() {
  // Add custom CSS styles for login page
  var style = document.createElement('style');
  style.textContent = _login_css__WEBPACK_IMPORTED_MODULE_1__;
  document.head.appendChild(style);
}
function injectJS() {
  return _injectJS.apply(this, arguments);
}
function _injectJS() {
  _injectJS = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var loginBtn, timeout, startTime, inputs, allLoaded, _inputs, tcNo, phone, fatherName, birthDate, securityCode, securityCodeAnswer, settings, loginElements, profileSelectorHTML, profiles, profileSelect, helperSettingsBtn, updateManualSaveButton, customLoginBtn;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          loginBtn = document.querySelector("a#login");
          if (loginBtn) {
            _context3.n = 1;
            break;
          }
          console.log("Login button not found");
          return _context3.a(2);
        case 1:
          ;
          // Wait for all inputs to load with 60s timeout
          timeout = 60000; // 60 seconds
          startTime = Date.now();
        case 2:
          if (!(Date.now() - startTime < timeout)) {
            _context3.n = 5;
            break;
          }
          inputs = {
            tcNo: document.querySelector("input#idnumber"),
            phone: document.querySelector("input#phonenumber"),
            fatherName: document.querySelector("input#fathername"),
            birthDate: document.querySelector("input#birthyear"),
            securityCode: document.querySelector("input#securitycode"),
            securityCodeAnswer: document.querySelector("img#SecureImage")
          };

          // Check if all inputs are loaded
          allLoaded = Object.values(inputs).every(function (input) {
            return input !== null && input !== undefined;
          });
          if (!allLoaded) {
            _context3.n = 3;
            break;
          }
          return _context3.a(3, 5);
        case 3:
          _context3.n = 4;
          return new Promise(function (resolve) {
            return setTimeout(resolve, 100);
          });
        case 4:
          _context3.n = 2;
          break;
        case 5:
          if (!Object.values(inputs).some(function (input) {
            return input === null || input === undefined;
          })) {
            _context3.n = 6;
            break;
          }
          console.error("Failed to load all inputs within timeout");
          return _context3.a(2);
        case 6:
          _inputs = inputs, tcNo = _inputs.tcNo, phone = _inputs.phone, fatherName = _inputs.fatherName, birthDate = _inputs.birthDate, securityCode = _inputs.securityCode, securityCodeAnswer = _inputs.securityCodeAnswer; // Get settings first
          settings = getSettings(); // Add profile selector dropdown
          loginElements = document.querySelector("div.login-elements");
          profileSelectorHTML = "\n        <div class=\"element profilyukle\">\n            <label class=\"profillabel\">Profil Se\xE7</label>\n            <select id=\"profilsec\">\n                <option value=\"\" selected=\"selected\">-</option>\n            </select>\n        </div>\n    ";
          loginElements.insertAdjacentHTML('afterbegin', profileSelectorHTML);

          // Populate profile selector with profiles
          profiles = getProfiles();
          profileSelect = document.getElementById('profilsec');
          profiles.forEach(function (profile) {
            var option = document.createElement('option');
            option.value = profile.tcNo;
            option.textContent = profile.fullName || profile.name;
            profileSelect.appendChild(option);
          });

          // Handle profile selection change
          profileSelect.addEventListener('change', /*#__PURE__*/function () {
            var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(e) {
              var selectedTC;
              return _regenerator().w(function (_context2) {
                while (1) switch (_context2.n) {
                  case 0:
                    selectedTC = e.target.value;
                    if (!selectedTC) {
                      _context2.n = 1;
                      break;
                    }
                    _context2.n = 1;
                    return fillProfile(selectedTC, inputs);
                  case 1:
                    return _context2.a(2);
                }
              }, _callee2);
            }));
            return function (_x3) {
              return _ref.apply(this, arguments);
            };
          }());

          // Add helper settings button FIRST (before any auto operations)
          helperSettingsBtn = document.createElement("a");
          helperSettingsBtn.innerText = "Helper Ayarları";
          helperSettingsBtn.href = "#";
          helperSettingsBtn.classList.add("ProButton", "ProButtonBig");
          helperSettingsBtn.addEventListener("click", function (e) {
            e.preventDefault();
            _pages_helperSettings_js__WEBPACK_IMPORTED_MODULE_2__.click();
          });
          document.querySelector("div.element.command").prepend(helperSettingsBtn);

          // Function to update manual save button visibility
          updateManualSaveButton = function updateManualSaveButton() {
            var currentSettings = getSettings();
            var existingManualBtn = document.getElementById('manual-save-btn');
            if (!currentSettings.autoSave && !existingManualBtn) {
              // Add manual save button
              var manualSaveBtn = document.createElement("a");
              manualSaveBtn.id = "manual-save-btn";
              manualSaveBtn.innerText = "Kaydet";
              manualSaveBtn.href = "#";
              manualSaveBtn.classList.add("ProButton", "ProButtonBig");
              manualSaveBtn.style.marginLeft = "3px";
              manualSaveBtn.addEventListener("click", function (e) {
                e.preventDefault();
                savePendingProfile(inputs);
                alert('Profil kaydedildi! Giriş yaptığınızda tamamlanacak.');
              });
              helperSettingsBtn.parentElement.insertBefore(manualSaveBtn, helperSettingsBtn.nextSibling);
            } else if (currentSettings.autoSave && existingManualBtn) {
              // Remove manual save button if auto save is now enabled
              existingManualBtn.remove();
            }
          }; // Initial button setup
          updateManualSaveButton();

          // Listen for settings changes
          window.addEventListener('itf-settings-changed', function () {
            updateManualSaveButton();

            // Update profile selector dropdown
            var updatedProfiles = getProfiles();
            var currentSelection = profileSelect.value;

            // Clear existing options except the first one
            profileSelect.innerHTML = '<option value="" selected="selected">-</option>';

            // Re-populate with updated profiles
            updatedProfiles.forEach(function (profile) {
              var option = document.createElement('option');
              option.value = profile.tcNo;
              option.textContent = profile.fullName || profile.name;
              profileSelect.appendChild(option);
            });

            // Restore selection if still valid
            if (currentSelection && updatedProfiles.find(function (p) {
              return p.tcNo === currentSelection;
            })) {
              profileSelect.value = currentSelection;
            }
          });

          // Fill security code
          _context3.n = 7;
          return (0,_keyPress__WEBPACK_IMPORTED_MODULE_0__["default"])(securityCode, securityCodeAnswer.getAttribute("data-val"), true);
        case 7:
          document.querySelector("div.element.securitycode").style.display = "none";

          // If auto save is enabled, intercept login button click
          if (settings.autoSave) {
            // Hide original login button
            loginBtn.style.display = "none";

            // Create custom login button
            customLoginBtn = document.createElement("a");
            customLoginBtn.innerText = "Giriş Yap";
            customLoginBtn.href = "#";
            customLoginBtn.id = "custom-login";
            customLoginBtn.classList.add("ProButton", "ProButtonBig", "ProButtonBlue");

            // Insert after the hidden button
            loginBtn.parentElement.insertBefore(customLoginBtn, loginBtn.nextSibling);

            // Add click handler to save profile then trigger real login
            customLoginBtn.addEventListener("click", function (e) {
              e.preventDefault();

              // Save as pending profile (will be completed in appointments page)
              savePendingProfile(inputs);

              // Click the real hidden login button
              loginBtn.click();
            });
          }

          // Auto login takes priority over auto fill
          if (!(settings.autoLogin && settings.selectedProfileLogin)) {
            _context3.n = 9;
            break;
          }
          _context3.n = 8;
          return fillProfile(settings.selectedProfileLogin, inputs);
        case 8:
          // Wait a bit for inputs to be filled, then click login
          setTimeout(function () {
            if (settings.autoSave) {
              // If auto save is enabled, click the custom button
              document.getElementById('custom-login').click();
            } else {
              // Otherwise click the original button
              loginBtn.click();
            }
          }, 500);
          _context3.n = 10;
          break;
        case 9:
          if (!(settings.autoFill && settings.selectedProfileFill)) {
            _context3.n = 10;
            break;
          }
          _context3.n = 10;
          return fillProfile(settings.selectedProfileFill, inputs);
        case 10:
          return _context3.a(2);
      }
    }, _callee3);
  }));
  return _injectJS.apply(this, arguments);
}
function inject() {
  return _inject.apply(this, arguments);
}
function _inject() {
  _inject = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          injectCSS();
          _context4.n = 1;
          return injectJS();
        case 1:
          return _context4.a(2);
      }
    }, _callee4);
  }));
  return _inject.apply(this, arguments);
}

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
/******/ 			// no module.id needed
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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _inject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inject */ "./src/inject.js");

(0,_inject__WEBPACK_IMPORTED_MODULE_0__["default"])();
})();

/******/ })()
;