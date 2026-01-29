// ==UserScript==
// @name         parkrun Launch Returnees
// @description  Identifies and displays participants who attended both the launch event and the latest event
// @author       Pete Johns (@johnsyweb)
// @grant        none
// @homepage     https://www.johnsy.com/tampermonkey-parkrun/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=parkrun.com.au
// @license      MIT
// @match        *://www.parkrun.ca/*/results/latestresults/
// @match        *://www.parkrun.co.at/*/results/latestresults/
// @match        *://www.parkrun.co.nl/*/results/latestresults/
// @match        *://www.parkrun.co.nz/*/results/latestresults/
// @match        *://www.parkrun.co.za/*/results/latestresults/
// @match        *://www.parkrun.com.au/*/results/latestresults/
// @match        *://www.parkrun.com.de/*/results/latestresults/
// @match        *://www.parkrun.dk/*/results/latestresults/
// @match        *://www.parkrun.fi/*/results/latestresults/
// @match        *://www.parkrun.fr/*/results/latestresults/
// @match        *://www.parkrun.ie/*/results/latestresults/
// @match        *://www.parkrun.it/*/results/latestresults/
// @match        *://www.parkrun.jp/*/results/latestresults/
// @match        *://www.parkrun.lt/*/results/latestresults/
// @match        *://www.parkrun.my/*/results/latestresults/
// @match        *://www.parkrun.no/*/results/latestresults/
// @match        *://www.parkrun.org.uk/*/results/latestresults/
// @match        *://www.parkrun.pl/*/results/latestresults/
// @match        *://www.parkrun.se/*/results/latestresults/
// @match        *://www.parkrun.sg/*/results/latestresults/
// @match        *://www.parkrun.us/*/results/latestresults/
// @namespace    http://tampermonkey.net/
// @run-at       document-end
// @supportURL   https://github.com/johnsyweb/tampermonkey-parkrun/issues/
// @tag          parkrun
// @version      1.0.68
// @downloadURL https://update.greasyfork.org/scripts/564282/parkrun%20Launch%20Returnees.user.js
// @updateURL https://update.greasyfork.org/scripts/564282/parkrun%20Launch%20Returnees.meta.js
// ==/UserScript==
// DO NOT EDIT - generated from src/ by scripts/build-scripts.js

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }


_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
  'use strict';

  var STYLES, CACHE_TTL_MS, extractCurrentPageParticipants, fetchEventParticipants, _fetchEventParticipants, insertAfterTitle, createHeader, createNoReturneesMessage, createReturneeListItem, createReturneesList, createContainer, displayReturnees, init, _init;
  return _regenerator().w(function (_context3) {
    while (1) switch (_context3.n) {
      case 0:
        _init = function _init3() {
          _init = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
            var pathname, locationMatch, location, origin, launchEventUrl, currentParticipants, launchParticipants, returnees;
            return _regenerator().w(function (_context2) {
              while (1) switch (_context2.n) {
                case 0:
                  pathname = window.location.pathname;
                  locationMatch = pathname.match(/\/([^/]+)\/results\/latestresults/);
                  location = locationMatch[1];
                  origin = window.location.origin;
                  launchEventUrl = "".concat(origin, "/").concat(location, "/results/1/");
                  currentParticipants = extractCurrentPageParticipants();
                  _context2.n = 1;
                  return fetchEventParticipants(launchEventUrl);
                case 1:
                  launchParticipants = _context2.v;
                  returnees = _toConsumableArray(currentParticipants.keys()).filter(function (id) {
                    return launchParticipants.has(id);
                  });
                  displayReturnees(returnees, currentParticipants, launchParticipants, origin);
                case 2:
                  return _context2.a(2);
              }
            }, _callee2);
          }));
          return _init.apply(this, arguments);
        };
        init = function _init2() {
          return _init.apply(this, arguments);
        };
        displayReturnees = function _displayReturnees(returnees, currentParticipants, launchParticipants, origin) {
          var container = createContainer();
          var heading = createHeader('Participants Who Attended the Launch Event');
          container.appendChild(heading);
          if (returnees.length === 0) {
            var message = createNoReturneesMessage('No attendees from the launch event were present at the latest event.');
            container.appendChild(message);
          } else {
            var list = createReturneesList(returnees, currentParticipants, launchParticipants, origin);
            container.appendChild(list);
          }
          insertAfterTitle(container);
        };
        createContainer = function _createContainer() {
          var container = document.createElement('div');
          container.id = 'parkrun-launch-returnees';
          container.style.width = '100%';
          container.style.maxWidth = '800px';
          container.style.margin = '20px auto';
          container.style.padding = '15px';
          container.style.backgroundColor = STYLES.backgroundColor;
          container.style.borderRadius = '8px';
          container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          container.style.color = STYLES.textColor;
          return container;
        };
        createReturneesList = function _createReturneesList(returnees, currentParticipants, launchParticipants, origin) {
          var listContainer = document.createElement('div');
          listContainer.style.maxHeight = '400px';
          listContainer.style.overflow = 'auto';
          var list = document.createElement('ul');
          list.style.listStyleType = 'none';
          list.style.padding = '0';
          list.style.margin = '0';
          list.style.textAlign = 'center';
          returnees.forEach(function (id) {
            var listItem = createReturneeListItem(id, currentParticipants, launchParticipants, origin);
            list.appendChild(listItem);
          });
          listContainer.appendChild(list);
          return listContainer;
        };
        createReturneeListItem = function _createReturneeListIt(id, currentParticipants, launchParticipants, origin) {
          var li = document.createElement('li');
          var link = document.createElement('a');
          link.href = "".concat(origin, "/parkrunner/").concat(id, "/");
          link.target = '_blank';
          var name = currentParticipants.get(id) || launchParticipants.get(id) || "Unknown parkrunner";
          link.textContent = "".concat(name, " (A").concat(id, ")");
          link.style.color = STYLES.linkColor;
          link.style.textDecoration = 'none';
          li.appendChild(link);
          return li;
        };
        createNoReturneesMessage = function _createNoReturneesMes(message) {
          var messageElement = document.createElement('p');
          messageElement.textContent = message;
          messageElement.style.textAlign = 'center';
          messageElement.style.fontWeight = 'bold';
          return messageElement;
        };
        createHeader = function _createHeader(text) {
          var heading = document.createElement('h3');
          heading.textContent = text;
          heading.style.textAlign = 'center';
          heading.style.marginBottom = '15px';
          heading.style.color = STYLES.headerColor;
          return heading;
        };
        insertAfterTitle = function _insertAfterTitle(element) {
          var pageTitle = document.querySelector('h1');
          if (pageTitle && pageTitle.parentNode) {
            if (pageTitle.nextSibling) {
              pageTitle.parentNode.insertBefore(element, pageTitle.nextSibling);
            } else {
              pageTitle.parentNode.appendChild(element);
            }
          } else {
            document.body.insertBefore(element, document.body.firstChild);
          }
        };
        _fetchEventParticipants = function _fetchEventParticipan2() {
          _fetchEventParticipants = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(url) {
            var cacheKey, cachedData, _JSON$parse, data, timestamp, isFresh, response, html, parser, doc, links, participants, i, match, cacheData, _t;
            return _regenerator().w(function (_context) {
              while (1) switch (_context.p = _context.n) {
                case 0:
                  cacheKey = "parkrun-launch-returnees-".concat(url);
                  _context.p = 1;
                  // Check if we have cached data
                  cachedData = localStorage.getItem(cacheKey);
                  if (!cachedData) {
                    _context.n = 2;
                    break;
                  }
                  _JSON$parse = JSON.parse(cachedData), data = _JSON$parse.data, timestamp = _JSON$parse.timestamp;
                  isFresh = Date.now() - timestamp < CACHE_TTL_MS;
                  if (!isFresh) {
                    _context.n = 2;
                    break;
                  }
                  return _context.a(2, new Map(data));
                case 2:
                  _context.n = 3;
                  return fetch(url);
                case 3:
                  response = _context.v;
                  _context.n = 4;
                  return response.text();
                case 4:
                  html = _context.v;
                  parser = new DOMParser();
                  doc = parser.parseFromString(html, 'text/html');
                  links = doc.querySelectorAll('a[href*="/parkrunner/"]');
                  participants = new Map();
                  for (i = 0; i < links.length; i++) {
                    match = links[i].href.match(/\/parkrunner\/(\d+)/);
                    if (match) {
                      participants.set(match[1], links[i].textContent.trim());
                    }
                  }

                  // Cache the data
                  cacheData = {
                    data: Array.from(participants.entries()),
                    // Convert Map to array for serialization
                    timestamp: Date.now()
                  };
                  localStorage.setItem(cacheKey, JSON.stringify(cacheData));
                  return _context.a(2, participants);
                case 5:
                  _context.p = 5;
                  _t = _context.v;
                  console.error('Error fetching or parsing:', url, _t);
                  return _context.a(2, new Map());
              }
            }, _callee, null, [[1, 5]]);
          }));
          return _fetchEventParticipants.apply(this, arguments);
        };
        fetchEventParticipants = function _fetchEventParticipan(_x) {
          return _fetchEventParticipants.apply(this, arguments);
        };
        extractCurrentPageParticipants = function _extractCurrentPagePa() {
          var links = document.querySelectorAll('a[href*="/parkrunner/"]');
          var participants = new Map();
          for (var i = 0; i < links.length; i++) {
            var match = links[i].href.match(/\/parkrunner\/(\d+)/);
            if (match) {
              participants.set(match[1], links[i].textContent.trim());
            }
          }
          return participants;
        };
        if (!document.getElementById('parkrun-launch-returnees')) {
          _context3.n = 1;
          break;
        }
        return _context3.a(2);
      case 1:
        STYLES = {
          backgroundColor: '#2b223d',
          headerColor: '#FFA300',
          textColor: '#EEE',
          linkColor: '#53BA9D'
        };
        CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        /**
         * Extracts parkrunner IDs and names from the current page
         * @returns {Map} A map of parkrunner IDs to names
         */
        /**
         * Fetches and parses participants from a specific event with caching
         * @param {string} url - The URL of the event to fetch
         * @returns {Promise<Map>} A promise that resolves to a map of parkrunner IDs to names
         */
        /**
         * Inserts an element after the first h1 tag on the page
         * @param {HTMLElement} element - The element to insert
         */
        /**
         * Creates a header element with styled text
         * @param {string} text - The text for the header
         * @returns {HTMLElement} The created header element
         */
        /**
         * Creates a message element for when no returnees are found
         * @param {string} message - The message to display
         * @returns {HTMLElement} The created message element
         */
        /**
         * Creates a list item for a returnee
         * @param {string} id - The parkrunner ID
         * @param {Map} currentParticipants - Map of current participants
         * @param {Map} launchParticipants - Map of launch participants
         * @param {string} origin - The site origin URL
         * @returns {HTMLLIElement} The created list item
         */
        /**
         * Creates a list of returnees
         * @param {Array} returnees - Array of returnee IDs
         * @param {Map} currentParticipants - Map of current participants
         * @param {Map} launchParticipants - Map of launch participants
         * @param {string} origin - The site origin URL
         * @returns {HTMLUListElement} The created list
         */
        /**
         * Creates a container for the returnees display
         * @returns {HTMLElement} The created container
         */
        /**
         * Creates and displays UI showing launch returnees
         * @param {Array} returnees - Array of parkrunner IDs who attended both events
         * @param {Map} currentParticipants - Map of current event participants
         * @param {Map} launchParticipants - Map of launch event participants
         * @param {string} origin - The site origin URL
         */
        /**
         * Main function to initialize the userscript
         */
        init();
      case 2:
        return _context3.a(2);
    }
  }, _callee3);
}))();