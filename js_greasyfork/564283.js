// ==UserScript==
// @name         parkrun Annual Summary
// @description  Adds an annual participation summary (totals, averages, min/max) to parkrun event history pages
// @author       Pete Johns (@johnsyweb)
// @grant        GM_xmlhttpRequest
// @homepage     https://www.johnsy.com/tampermonkey-parkrun/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=parkrun.com.au
// @license      MIT
// @match        *://www.parkrun.ca/*/results/eventhistory/*
// @match        *://www.parkrun.co.at/*/results/eventhistory/*
// @match        *://www.parkrun.co.nl/*/results/eventhistory/*
// @match        *://www.parkrun.co.nz/*/results/eventhistory/*
// @match        *://www.parkrun.co.za/*/results/eventhistory/*
// @match        *://www.parkrun.com.au/*/results/eventhistory/*
// @match        *://www.parkrun.com.de/*/results/eventhistory/*
// @match        *://www.parkrun.dk/*/results/eventhistory/*
// @match        *://www.parkrun.fi/*/results/eventhistory/*
// @match        *://www.parkrun.fr/*/results/eventhistory/*
// @match        *://www.parkrun.ie/*/results/eventhistory/*
// @match        *://www.parkrun.it/*/results/eventhistory/*
// @match        *://www.parkrun.jp/*/results/eventhistory/*
// @match        *://www.parkrun.lt/*/results/eventhistory/*
// @match        *://www.parkrun.my/*/results/eventhistory/*
// @match        *://www.parkrun.no/*/results/eventhistory/*
// @match        *://www.parkrun.org.uk/*/results/eventhistory/*
// @match        *://www.parkrun.pl/*/results/eventhistory/*
// @match        *://www.parkrun.se/*/results/eventhistory/*
// @match        *://www.parkrun.sg/*/results/eventhistory/*
// @match        *://www.parkrun.us/*/results/eventhistory/*
// @namespace    http://tampermonkey.net/
// @run-at       document-end
// @supportURL   https://github.com/johnsyweb/tampermonkey-parkrun/issues/
// @tag          parkrun
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js
// @version      0.2.11
// @downloadURL https://update.greasyfork.org/scripts/564283/parkrun%20Annual%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/564283/parkrun%20Annual%20Summary.meta.js
// ==/UserScript==
// DO NOT EDIT - generated from src/ by scripts/build-scripts.js

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }


(function () {
  'use strict';

  var STYLES = {
    backgroundColor: '#1c1b2a',
    barColor: '#f59e0b',
    // amber 500
    lineColor: '#22d3ee',
    // cyan 400
    textColor: '#f3f4f6',
    subtleTextColor: '#d1d5db',
    gridColor: 'rgba(243, 244, 246, 0.18)'
  };
  var COMPARISON_COLORS = ['#f59e0b',
  // amber
  '#22d3ee',
  // cyan
  '#f97316',
  // orange
  '#10b981',
  // emerald
  '#a855f7',
  // purple
  '#ef4444',
  // red
  '#3b82f6',
  // blue
  '#84cc16' // lime
  ];

  // Global state for comparison
  var state = {
    currentEvent: null,
    comparisonEvents: [],
    allParkruns: null
  };
  function insertAfterFirst(selector, element) {
    var pageTitle = document.querySelector(selector);
    if (pageTitle && pageTitle.parentNode) {
      if (pageTitle.nextSibling) {
        pageTitle.parentNode.insertBefore(element, pageTitle.nextSibling);
      } else {
        pageTitle.parentNode.appendChild(element);
      }
    }
  }
  function fetchAllParkruns() {
    return _fetchAllParkruns.apply(this, arguments);
  }
  function _fetchAllParkruns() {
    _fetchAllParkruns = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      var CACHE_KEY, CACHE_DURATION_MS, _data$events, cached, _JSON$parse, _data, timestamp, age, response, data, features, _t3, _t4;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            CACHE_KEY = 'parkrun_events_cache';
            CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
            _context4.p = 1;
            // Check for cached data
            cached = localStorage.getItem(CACHE_KEY);
            if (!cached) {
              _context4.n = 5;
              break;
            }
            _context4.p = 2;
            _JSON$parse = JSON.parse(cached), _data = _JSON$parse.data, timestamp = _JSON$parse.timestamp;
            age = Date.now() - timestamp;
            if (!(age < CACHE_DURATION_MS)) {
              _context4.n = 3;
              break;
            }
            console.log("Using cached parkrun events (".concat(Math.round(age / 1000 / 60), " minutes old)"));
            return _context4.a(2, _data);
          case 3:
            _context4.n = 5;
            break;
          case 4:
            _context4.p = 4;
            _t3 = _context4.v;
            console.log('Cache parse error, fetching fresh data', _t3);
          case 5:
            console.log('Fetching parkrun events from https://images.parkrun.com/events.json');
            _context4.n = 6;
            return fetch('https://images.parkrun.com/events.json');
          case 6:
            response = _context4.v;
            console.log('Fetch response status:', response.status, response.statusText);
            if (response.ok) {
              _context4.n = 7;
              break;
            }
            console.error('Fetch failed with status:', response.status);
            return _context4.a(2, []);
          case 7:
            _context4.n = 8;
            return response.json();
          case 8:
            data = _context4.v;
            // The events.json structure has events under data.events.features
            features = ((_data$events = data.events) === null || _data$events === void 0 ? void 0 : _data$events.features) || data.features || [];
            console.log('Features array length:', features.length);
            if (!(!features || features.length === 0)) {
              _context4.n = 9;
              break;
            }
            console.error('No features found in response data');
            return _context4.a(2, []);
          case 9:
            // Cache the features with timestamp
            try {
              localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: features,
                timestamp: Date.now()
              }));
              console.log('Cached', features.length, 'parkrun events for 24 hours');
            } catch (cacheError) {
              console.warn('Failed to cache parkrun events:', cacheError);
            }
            console.log('Successfully loaded', features.length, 'parkrun events');
            return _context4.a(2, features);
          case 10:
            _context4.p = 10;
            _t4 = _context4.v;
            console.error('Failed to fetch parkruns:', _t4);
            console.error('Error details:', _t4.message, _t4.stack);
            return _context4.a(2, []);
        }
      }, _callee4, null, [[2, 4], [1, 10]]);
    }));
    return _fetchAllParkruns.apply(this, arguments);
  }
  function getCurrentEventInfo() {
    var pathParts = window.location.pathname.split('/');
    var eventName = pathParts[1];
    var domain = window.location.hostname;
    return {
      eventName: eventName,
      domain: domain,
      url: window.location.origin
    };
  }
  function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Earth's radius in km
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  function findNearbyParkruns(currentEvent, allParkruns) {
    var maxDistanceKm = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 50;
    var current = allParkruns.find(function (p) {
      return p.properties.eventname === currentEvent.eventName;
    });
    if (!current) return [];
    var _current$geometry$coo = _slicedToArray(current.geometry.coordinates, 2),
      currentLon = _current$geometry$coo[0],
      currentLat = _current$geometry$coo[1];
    var currentCountry = current.properties.countrycode;
    var currentSeries = current.properties.seriesid;
    return allParkruns.filter(function (parkrun) {
      if (parkrun.properties.eventname === currentEvent.eventName) return false;
      if (parkrun.properties.countrycode !== currentCountry) return false;
      if (parkrun.properties.seriesid !== currentSeries) return false;
      var _parkrun$geometry$coo = _slicedToArray(parkrun.geometry.coordinates, 2),
        lon = _parkrun$geometry$coo[0],
        lat = _parkrun$geometry$coo[1];
      var latDiff = Math.abs(lat - currentLat);
      var lonDiff = Math.abs(lon - currentLon);

      // Quick bounding box filter (~0.5 degrees ≈ 55km)
      if (latDiff > 0.5 || lonDiff > 0.5) return false;
      var distance = calculateDistance(currentLat, currentLon, lat, lon);
      return distance <= maxDistanceKm;
    }).map(function (parkrun) {
      var _parkrun$geometry$coo2 = _slicedToArray(parkrun.geometry.coordinates, 2),
        lon = _parkrun$geometry$coo2[0],
        lat = _parkrun$geometry$coo2[1];
      var distance = calculateDistance(currentLat, currentLon, lat, lon);
      return _objectSpread(_objectSpread({}, parkrun), {}, {
        distance: distance
      });
    }).sort(function (a, b) {
      return a.distance - b.distance;
    });
  }
  function buildHtmlReport(_x, _x2) {
    return _buildHtmlReport.apply(this, arguments);
  }
  function _buildHtmlReport() {
    _buildHtmlReport = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(mainContainer, meta) {
      var clone, originalCanvases, clonedCanvases, stylesheet, header;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            clone = mainContainer.cloneNode(true);
            originalCanvases = mainContainer.querySelectorAll('canvas');
            clonedCanvases = clone.querySelectorAll('canvas');
            originalCanvases.forEach(function (canvas, idx) {
              try {
                var dataUrl = canvas.toDataURL('image/png');
                var img = document.createElement('img');
                img.src = dataUrl;
                img.alt = 'Chart snapshot';
                img.style.maxWidth = '100%';
                img.style.display = 'block';
                img.style.backgroundColor = '#2b223d';
                if (clonedCanvases[idx]) {
                  clonedCanvases[idx].replaceWith(img);
                }
              } catch (error) {
                console.error('Failed to serialize chart canvas:', error);
              }
            });
            stylesheet = "\n      :root { color-scheme: dark; }\n      body { margin: 0; padding: 20px; background: ".concat(STYLES.backgroundColor, "; color: ").concat(STYLES.textColor, "; font-family: \"Segoe UI\", \"Helvetica Neue\", Arial, sans-serif; line-height: 1.5; }\n      a { color: ").concat(STYLES.lineColor, "; }\n      h1, h2, h3, h4 { color: ").concat(STYLES.barColor, "; margin: 0 0 10px 0; }\n      table { width: 100%; border-collapse: collapse; }\n      th, td { border: 1px solid ").concat(STYLES.gridColor, "; padding: 10px; text-align: left; }\n      th { background: #2b223d; color: ").concat(STYLES.barColor, "; }\n      tr:nth-child(even) td { background: #241c35; }\n      tr:nth-child(odd) td { background: #1f182e; }\n      .parkrun-annual-summary { background: ").concat(STYLES.backgroundColor, "; padding: 16px; border-radius: 6px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25); }\n      .chart-img { max-width: 100%; display: block; }\n      .meta { margin-bottom: 16px; color: ").concat(STYLES.subtleTextColor, "; font-size: 13px; }\n      .meta strong { color: ").concat(STYLES.textColor, "; }\n    ");
            header = "\n      <header>\n        <h1>parkrun Annual Summary</h1>\n        <div class=\"meta\">\n          <div><strong>Event:</strong> ".concat(meta.eventShortName, "</div>\n          <div><strong>Generated:</strong> ").concat(meta.generatedAt, "</div>\n        </div>\n      </header>\n    ");
            return _context5.a(2, "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>parkrun Annual Summary - ".concat(meta.eventShortName, "</title><style>").concat(stylesheet, "</style></head><body>").concat(header).concat(clone.outerHTML, "</body></html>"));
        }
      }, _callee5);
    }));
    return _buildHtmlReport.apply(this, arguments);
  }
  function generateReportBlob(_x3, _x4) {
    return _generateReportBlob.apply(this, arguments);
  }
  function _generateReportBlob() {
    _generateReportBlob = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(mainContainer, meta) {
      var html, filename;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            _context6.n = 1;
            return buildHtmlReport(mainContainer, meta);
          case 1:
            html = _context6.v;
            filename = "parkrun-annual-summary-".concat(meta.eventShortName, "-").concat(meta.generatedAtISO, ".html");
            return _context6.a(2, {
              blob: new Blob([html], {
                type: 'text/html'
              }),
              filename: filename
            });
        }
      }, _callee6);
    }));
    return _generateReportBlob.apply(this, arguments);
  }
  function fetchEventHistory(_x5, _x6) {
    return _fetchEventHistory.apply(this, arguments);
  }
  function _fetchEventHistory() {
    _fetchEventHistory = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(eventName, domain) {
      var _doc$querySelector$te, _doc$querySelector, url, response, html, parser, doc, title, eventNumbers, dates, finishers, volunteers, rows, _t5;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            _context7.p = 0;
            url = "".concat(domain, "/").concat(eventName, "/results/eventhistory/");
            _context7.n = 1;
            return fetch(url);
          case 1:
            response = _context7.v;
            _context7.n = 2;
            return response.text();
          case 2:
            html = _context7.v;
            parser = new DOMParser();
            doc = parser.parseFromString(html, 'text/html');
            title = (_doc$querySelector$te = (_doc$querySelector = doc.querySelector('h1')) === null || _doc$querySelector === void 0 ? void 0 : _doc$querySelector.textContent.trim()) !== null && _doc$querySelector$te !== void 0 ? _doc$querySelector$te : "".concat(eventName, " Event History");
            eventNumbers = [];
            dates = [];
            finishers = [];
            volunteers = [];
            rows = doc.querySelectorAll('tr.Results-table-row');
            Array.from(rows).reverse().forEach(function (row) {
              var eventNumber = row.getAttribute('data-parkrun');
              if (eventNumber) {
                eventNumbers.push(eventNumber);
              }
              var date = row.getAttribute('data-date');
              if (date) {
                var dateObj = new Date(date);
                var formattedDate = dateObj.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });
                dates.push(formattedDate);
              }
              var finishersCount = row.getAttribute('data-finishers');
              if (finishersCount) {
                finishers.push(parseInt(finishersCount, 10));
              }
              var volunteersCount = row.getAttribute('data-volunteers');
              if (volunteersCount) {
                volunteers.push(parseInt(volunteersCount, 10));
              }
            });
            return _context7.a(2, {
              eventName: eventName,
              title: title,
              eventNumbers: eventNumbers,
              dates: dates,
              finishers: finishers,
              volunteers: volunteers
            });
          case 3:
            _context7.p = 3;
            _t5 = _context7.v;
            console.error("Failed to fetch event history for ".concat(eventName, ":"), _t5);
            return _context7.a(2, null);
        }
      }, _callee7, null, [[0, 3]]);
    }));
    return _fetchEventHistory.apply(this, arguments);
  }
  function extractEventHistoryData() {
    var _document$querySelect, _document$querySelect2;
    var title = (_document$querySelect = (_document$querySelect2 = document.querySelector('h1')) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.textContent.trim()) !== null && _document$querySelect !== void 0 ? _document$querySelect : 'Event History';
    var eventNumbers = [];
    var dates = [];
    var finishers = [];
    var volunteers = [];
    var rows = document.querySelectorAll('tr.Results-table-row');
    Array.from(rows).reverse().forEach(function (row) {
      var eventNumber = row.getAttribute('data-parkrun');
      if (eventNumber) {
        eventNumbers.push(eventNumber);
      }
      var date = row.getAttribute('data-date');
      if (date) {
        var dateObj = new Date(date);
        var formattedDate = dateObj.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        dates.push(formattedDate);
      }
      var finishersCount = row.getAttribute('data-finishers');
      if (finishersCount) {
        finishers.push(parseInt(finishersCount, 10));
      }
      var volunteersCount = row.getAttribute('data-volunteers');
      if (volunteersCount) {
        volunteers.push(parseInt(volunteersCount, 10));
      }
    });
    return {
      title: title,
      eventNumbers: eventNumbers,
      dates: dates,
      finishers: finishers,
      volunteers: volunteers
    };
  }
  function aggregateByYear(historyData) {
    var yearly = {};
    historyData.dates.forEach(function (dateStr, index) {
      var _historyData$finisher, _historyData$voluntee;
      var date = new Date(dateStr);
      var year = date.getFullYear();
      var finishers = (_historyData$finisher = historyData.finishers[index]) !== null && _historyData$finisher !== void 0 ? _historyData$finisher : 0;
      var volunteers = (_historyData$voluntee = historyData.volunteers[index]) !== null && _historyData$voluntee !== void 0 ? _historyData$voluntee : 0;
      var eventNumber = historyData.eventNumbers[index];
      if (!yearly[year]) {
        yearly[year] = {
          year: year,
          eventCount: 0,
          totalFinishers: 0,
          totalVolunteers: 0,
          minFinishers: null,
          maxFinishers: null,
          minVolunteers: null,
          maxVolunteers: null
        };
      }
      var current = yearly[year];
      current.eventCount++;
      current.totalFinishers += finishers;
      current.totalVolunteers += volunteers;
      if (current.minFinishers === null || finishers < current.minFinishers.value) {
        current.minFinishers = {
          value: finishers,
          date: historyData.dates[index],
          eventNumber: eventNumber
        };
      }
      if (current.maxFinishers === null || finishers > current.maxFinishers.value) {
        current.maxFinishers = {
          value: finishers,
          date: historyData.dates[index],
          eventNumber: eventNumber
        };
      }
      if (current.minVolunteers === null || volunteers < current.minVolunteers.value) {
        current.minVolunteers = {
          value: volunteers,
          date: historyData.dates[index],
          eventNumber: eventNumber
        };
      }
      if (current.maxVolunteers === null || volunteers > current.maxVolunteers.value) {
        current.maxVolunteers = {
          value: volunteers,
          date: historyData.dates[index],
          eventNumber: eventNumber
        };
      }
    });
    return Object.keys(yearly).map(Number).sort(function (a, b) {
      return a - b;
    }).map(function (year) {
      var data = yearly[year];
      return {
        year: year,
        eventCount: data.eventCount,
        totalFinishers: data.totalFinishers,
        totalVolunteers: data.totalVolunteers,
        avgFinishers: Math.round(data.totalFinishers / data.eventCount),
        avgVolunteers: Math.round(data.totalVolunteers / data.eventCount),
        minFinishers: data.minFinishers,
        maxFinishers: data.maxFinishers,
        minVolunteers: data.minVolunteers,
        maxVolunteers: data.maxVolunteers,
        finishersGrowth: null,
        volunteersGrowth: null
      };
    }).map(function (row, index, arr) {
      if (index === 0) {
        return row;
      }
      var prev = arr[index - 1];
      var finishersGrowth = prev.avgFinishers ? (row.avgFinishers - prev.avgFinishers) / prev.avgFinishers * 100 : null;
      var volunteersGrowth = prev.avgVolunteers ? (row.avgVolunteers - prev.avgVolunteers) / prev.avgVolunteers * 100 : null;
      return _objectSpread(_objectSpread({}, row), {}, {
        finishersGrowth: finishersGrowth,
        volunteersGrowth: volunteersGrowth
      });
    });
  }
  function formatExtrema(record) {
    if (!record) return '-';
    return record.value.toLocaleString();
  }
  function formatGrowth(growth) {
    if (growth === null || Number.isNaN(growth)) return '-';
    var sign = growth > 0 ? '+' : '';
    var color = growth > 0 ? '#53BA9D' : growth < 0 ? '#ff6b6b' : STYLES.subtleTextColor;
    return "<span style=\"color: ".concat(color, ";\">").concat(sign).concat(growth.toFixed(1), "%</span>");
  }
  function createComparisonSelector(nearbyParkruns) {
    var selectorContainer = document.createElement('div');
    selectorContainer.style.marginBottom = '15px';
    selectorContainer.style.padding = '10px';
    selectorContainer.style.backgroundColor = STYLES.backgroundColor;
    selectorContainer.style.borderRadius = '6px';
    selectorContainer.style.display = 'flex';
    selectorContainer.style.alignItems = 'center';
    selectorContainer.style.gap = '10px';
    selectorContainer.style.flexWrap = 'wrap';
    var label = document.createElement('span');
    label.textContent = 'Compare with:';
    label.style.color = STYLES.textColor;
    label.style.fontWeight = 'bold';
    selectorContainer.appendChild(label);
    var select = document.createElement('select');
    select.style.padding = '6px 12px';
    select.style.backgroundColor = '#3a3250';
    select.style.color = STYLES.textColor;
    select.style.border = "1px solid ".concat(STYLES.gridColor);
    select.style.borderRadius = '4px';
    select.style.cursor = 'pointer';
    var defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select parkrun --';
    select.appendChild(defaultOption);
    nearbyParkruns.forEach(function (parkrun) {
      var option = document.createElement('option');
      option.value = parkrun.properties.eventname;
      option.textContent = "".concat(parkrun.properties.EventShortName, " (").concat(parkrun.distance.toFixed(1), "km)");
      select.appendChild(option);
    });
    var addButton = document.createElement('button');
    addButton.textContent = '+ Add';
    addButton.style.padding = '6px 12px';
    addButton.style.backgroundColor = STYLES.lineColor;
    addButton.style.color = '#2b223d';
    addButton.style.border = 'none';
    addButton.style.borderRadius = '4px';
    addButton.style.cursor = 'pointer';
    addButton.style.fontWeight = 'bold';
    addButton.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var selectedEventName, eventInfo, historyData, parkrunInfo;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            selectedEventName = select.value;
            if (selectedEventName) {
              _context.n = 1;
              break;
            }
            return _context.a(2);
          case 1:
            if (!state.comparisonEvents.some(function (event) {
              return event.eventName === selectedEventName;
            })) {
              _context.n = 2;
              break;
            }
            alert('This parkrun is already selected for comparison');
            return _context.a(2);
          case 2:
            addButton.disabled = true;
            addButton.textContent = 'Loading...';
            eventInfo = getCurrentEventInfo();
            _context.n = 3;
            return fetchEventHistory(selectedEventName, eventInfo.url);
          case 3:
            historyData = _context.v;
            if (historyData) {
              parkrunInfo = nearbyParkruns.find(function (p) {
                return p.properties.eventname === selectedEventName;
              });
              state.comparisonEvents.push(_objectSpread(_objectSpread({}, historyData), {}, {
                distance: parkrunInfo === null || parkrunInfo === void 0 ? void 0 : parkrunInfo.distance
              }));
              renderAllSummaries();
            } else {
              alert('Failed to fetch event history');
            }
            addButton.disabled = false;
            addButton.textContent = '+ Add';
            select.value = '';
          case 4:
            return _context.a(2);
        }
      }, _callee);
    })));
    selectorContainer.appendChild(select);
    selectorContainer.appendChild(addButton);
    return selectorContainer;
  }
  function createSelectedEventsDisplay() {
    var container = document.createElement('div');
    container.id = 'selectedEventsDisplay';
    container.style.display = 'flex';
    container.style.gap = '8px';
    container.style.flexWrap = 'wrap';
    container.style.marginTop = '10px';
    var updateDisplay = function updateDisplay() {
      container.innerHTML = '';
      [state.currentEvent].concat(_toConsumableArray(state.comparisonEvents)).forEach(function (event, index) {
        var chip = document.createElement('div');
        chip.style.display = 'inline-flex';
        chip.style.alignItems = 'center';
        chip.style.gap = '6px';
        chip.style.padding = '4px 10px';
        chip.style.backgroundColor = COMPARISON_COLORS[index % COMPARISON_COLORS.length];
        chip.style.color = '#2b223d';
        chip.style.borderRadius = '12px';
        chip.style.fontSize = '12px';
        chip.style.fontWeight = 'bold';
        var label = document.createElement('span');
        label.textContent = event.title || event.eventName;
        chip.appendChild(label);
        if (index > 0) {
          var removeBtn = document.createElement('span');
          removeBtn.textContent = '×';
          removeBtn.style.cursor = 'pointer';
          removeBtn.style.marginLeft = '4px';
          removeBtn.style.fontSize = '16px';
          removeBtn.addEventListener('click', function () {
            state.comparisonEvents.splice(index - 1, 1);
            renderAllSummaries();
          });
          chip.appendChild(removeBtn);
        }
        container.appendChild(chip);
      });
    };
    updateDisplay();
    return {
      container: container,
      updateDisplay: updateDisplay
    };
  }
  function createTabsForEvents(events) {
    var tabsContainer = document.createElement('div');
    tabsContainer.id = 'eventTabs';
    tabsContainer.style.marginTop = '15px';
    var tabButtons = document.createElement('div');
    tabButtons.style.display = 'flex';
    tabButtons.style.gap = '5px';
    tabButtons.style.borderBottom = "2px solid ".concat(STYLES.gridColor);
    tabButtons.style.marginBottom = '15px';
    var tabContents = document.createElement('div');
    tabContents.id = 'tabContents';
    events.forEach(function (event, index) {
      var button = document.createElement('button');
      button.textContent = event.title || event.eventName;
      button.style.padding = '10px 20px';
      button.style.backgroundColor = index === 0 ? COMPARISON_COLORS[index % COMPARISON_COLORS.length] : '#3a3250';
      button.style.color = index === 0 ? '#2b223d' : STYLES.textColor;
      button.style.border = 'none';
      button.style.borderRadius = '6px 6px 0 0';
      button.style.cursor = 'pointer';
      button.style.fontWeight = 'bold';
      button.dataset.index = index;
      button.addEventListener('click', function () {
        // Update button styles
        tabButtons.querySelectorAll('button').forEach(function (btn, btnIndex) {
          btn.style.backgroundColor = btnIndex === index ? COMPARISON_COLORS[btnIndex % COMPARISON_COLORS.length] : '#3a3250';
          btn.style.color = btnIndex === index ? '#2b223d' : STYLES.textColor;
        });

        // Show corresponding tab content
        tabContents.querySelectorAll('.tab-content').forEach(function (content, contentIndex) {
          content.style.display = contentIndex === index ? 'block' : 'none';
        });
      });
      tabButtons.appendChild(button);
    });
    tabsContainer.appendChild(tabButtons);
    tabsContainer.appendChild(tabContents);
    return {
      tabsContainer: tabsContainer,
      tabContents: tabContents
    };
  }
  function renderEventTab(historyData, eventIndex) {
    var yearly = aggregateByYear(historyData);
    if (yearly.length === 0) {
      return null;
    }
    var tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    tabContent.style.display = eventIndex === 0 ? 'block' : 'none';
    tabContent.style.backgroundColor = STYLES.backgroundColor;
    tabContent.style.padding = '15px';
    tabContent.style.borderRadius = '6px';
    var tableWrap = document.createElement('div');
    tableWrap.style.overflowX = 'auto';
    var table = document.createElement('table');
    table.className = 'annualSummaryTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontSize = '14px';
    table.style.color = STYLES.textColor;
    table.style.backgroundColor = STYLES.backgroundColor;
    var sortState = {
      key: 'year',
      dir: 'asc'
    };
    var columns = [{
      key: 'year',
      label: 'Year',
      align: 'left'
    }, {
      key: 'eventCount',
      label: 'Events',
      align: 'center'
    }, {
      key: 'totalFinishers',
      label: 'Finishers Total',
      align: 'right',
      color: STYLES.barColor
    }, {
      key: 'minFinishers',
      label: 'Finishers Min',
      align: 'right',
      color: STYLES.barColor
    }, {
      key: 'maxFinishers',
      label: 'Finishers Max',
      align: 'right',
      color: STYLES.barColor
    }, {
      key: 'avgFinishers',
      label: 'Finishers Avg',
      align: 'right',
      color: STYLES.barColor
    }, {
      key: 'finishersGrowth',
      label: 'Finishers YoY',
      align: 'right'
    }, {
      key: 'totalVolunteers',
      label: 'Volunteers Total',
      align: 'right',
      color: STYLES.lineColor
    }, {
      key: 'minVolunteers',
      label: 'Volunteers Min',
      align: 'right',
      color: STYLES.lineColor
    }, {
      key: 'maxVolunteers',
      label: 'Volunteers Max',
      align: 'right',
      color: STYLES.lineColor
    }, {
      key: 'avgVolunteers',
      label: 'Volunteers Avg',
      align: 'right',
      color: STYLES.lineColor
    }, {
      key: 'volunteersGrowth',
      label: 'Volunteers YoY',
      align: 'right'
    }];
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    headerRow.style.borderBottom = "2px solid ".concat(STYLES.gridColor);
    columns.forEach(function (col) {
      var th = document.createElement('th');
      th.textContent = col.label;
      th.style.padding = '10px';
      th.style.textAlign = col.align;
      th.style.cursor = 'pointer';
      if (col.color) th.style.color = col.color;
      th.addEventListener('click', function () {
        if (sortState.key === col.key) {
          sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
        } else {
          sortState.key = col.key;
          sortState.dir = 'desc';
        }
        renderBody();
      });
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    tabContent.appendChild(tableWrap);
    function renderBody() {
      tbody.innerHTML = '';
      var sorted = _toConsumableArray(yearly).sort(function (a, b) {
        var key = sortState.key;
        var dir = sortState.dir === 'asc' ? 1 : -1;
        var getVal = function getVal(row) {
          var val = row[key];
          if (val === null || val === undefined) return -Infinity;
          if (_typeof(val) === 'object' && val.value !== undefined) return val.value;
          return val;
        };
        var av = getVal(a);
        var bv = getVal(b);
        if (av === bv) return 0;
        return av > bv ? dir : -dir;
      });
      sorted.forEach(function (rowData) {
        var row = document.createElement('tr');
        row.style.borderBottom = "1px solid ".concat(STYLES.gridColor);
        row.innerHTML = "\n          <td style=\"padding: 10px; text-align: left; font-weight: bold;\">".concat(rowData.year, "</td>\n          <td style=\"padding: 10px; text-align: center;\">").concat(rowData.eventCount, "</td>\n          <td style=\"padding: 10px; text-align: right; color: ").concat(STYLES.barColor, ";\">").concat(rowData.totalFinishers.toLocaleString(), "</td>\n          <td style=\"padding: 10px; text-align: right; color: ").concat(STYLES.barColor, ";\">").concat(formatExtrema(rowData.minFinishers), "</td>\n          <td style=\"padding: 10px; text-align: right; color: ").concat(STYLES.barColor, ";\">").concat(formatExtrema(rowData.maxFinishers), "</td>\n          <td style=\"padding: 10px; text-align: right; color: ").concat(STYLES.barColor, ";\">").concat(rowData.avgFinishers, "</td>\n          <td style=\"padding: 10px; text-align: right;\">").concat(formatGrowth(rowData.finishersGrowth), "</td>\n          <td style=\"padding: 10px; text-align: right; color: ").concat(STYLES.lineColor, ";\">").concat(rowData.totalVolunteers.toLocaleString(), "</td>\n          <td style=\"padding: 10px; text-align: right; color: ").concat(STYLES.lineColor, ";\">").concat(formatExtrema(rowData.minVolunteers), "</td>\n          <td style=\"padding: 10px; text-align: right; color: ").concat(STYLES.lineColor, ";\">").concat(formatExtrema(rowData.maxVolunteers), "</td>\n          <td style=\"padding: 10px; text-align: right; color: ").concat(STYLES.lineColor, ";\">").concat(rowData.avgVolunteers, "</td>\n          <td style=\"padding: 10px; text-align: right;\">").concat(formatGrowth(rowData.volunteersGrowth), "</td>\n        ");
        tbody.appendChild(row);
      });
    }
    renderBody();

    // Add charts
    var chartsRow = document.createElement('div');
    chartsRow.style.display = 'grid';
    chartsRow.style.gridTemplateColumns = '1fr 1fr';
    chartsRow.style.gap = '20px';
    chartsRow.style.marginTop = '20px';
    var totalsChartContainer = document.createElement('div');
    totalsChartContainer.style.minWidth = '0';
    var totalsCanvas = document.createElement('canvas');
    totalsCanvas.className = "annualTotalsChart-".concat(eventIndex);
    totalsChartContainer.appendChild(totalsCanvas);
    var growthChartContainer = document.createElement('div');
    growthChartContainer.style.minWidth = '0';
    var growthCanvas = document.createElement('canvas');
    growthCanvas.className = "annualGrowthChart-".concat(eventIndex);
    growthChartContainer.appendChild(growthCanvas);
    chartsRow.appendChild(totalsChartContainer);
    chartsRow.appendChild(growthChartContainer);
    tabContent.appendChild(chartsRow);

    // Render charts
    if (typeof Chart !== 'undefined') {
      var totalsCtx = totalsCanvas.getContext('2d');
      var growthCtx = growthCanvas.getContext('2d');
      var labels = yearly.map(function (d) {
        return d.year.toString();
      });

      // eslint-disable-next-line no-undef
      new Chart(totalsCtx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Finishers',
            data: yearly.map(function (d) {
              return d.totalFinishers;
            }),
            backgroundColor: STYLES.barColor,
            borderColor: STYLES.barColor,
            borderWidth: 1
          }, {
            label: 'Total Volunteers',
            data: yearly.map(function (d) {
              return d.totalVolunteers;
            }),
            backgroundColor: STYLES.lineColor,
            borderColor: STYLES.lineColor,
            borderWidth: 1
          }]
        },
        options: {
          animation: false,
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.3,
          plugins: {
            legend: {
              labels: {
                color: STYLES.textColor
              }
            },
            title: {
              display: true,
              text: 'Annual Totals',
              color: STYLES.textColor
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Year',
                color: STYLES.textColor
              },
              ticks: {
                color: STYLES.subtleTextColor
              },
              grid: {
                color: STYLES.gridColor
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Participants',
                color: STYLES.textColor
              },
              ticks: {
                precision: 0,
                color: STYLES.subtleTextColor
              },
              grid: {
                color: STYLES.gridColor
              }
            }
          }
        }
      });
      var growthData = yearly.filter(function (d) {
        return d.finishersGrowth !== null;
      });

      // eslint-disable-next-line no-undef
      new Chart(growthCtx, {
        type: 'line',
        data: {
          labels: growthData.map(function (d) {
            return d.year.toString();
          }),
          datasets: [{
            label: 'Finishers Growth',
            data: growthData.map(function (d) {
              return d.finishersGrowth;
            }),
            borderColor: STYLES.barColor,
            backgroundColor: STYLES.barColor,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: STYLES.barColor,
            fill: false,
            tension: 0.2
          }, {
            label: 'Volunteers Growth',
            data: growthData.map(function (d) {
              return d.volunteersGrowth;
            }),
            borderColor: STYLES.lineColor,
            backgroundColor: STYLES.lineColor,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: STYLES.lineColor,
            fill: false,
            tension: 0.2
          }]
        },
        options: {
          animation: false,
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.3,
          plugins: {
            legend: {
              labels: {
                color: STYLES.textColor
              }
            },
            title: {
              display: true,
              text: 'Year-over-Year Growth (%)',
              color: STYLES.textColor
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Year',
                color: STYLES.textColor
              },
              ticks: {
                color: STYLES.subtleTextColor
              },
              grid: {
                color: STYLES.gridColor
              }
            },
            y: {
              title: {
                display: true,
                text: 'Growth (%)',
                color: STYLES.textColor
              },
              ticks: {
                color: STYLES.subtleTextColor,
                callback: function callback(value) {
                  return value + '%';
                }
              },
              grid: {
                color: STYLES.gridColor
              }
            }
          }
        }
      });
    }
    return tabContent;
  }
  function renderComparisonCharts(events) {
    if (events.length < 2) return null;
    var comparisonSection = document.createElement('div');
    comparisonSection.id = 'comparisonSection';
    comparisonSection.style.marginTop = '30px';
    comparisonSection.style.padding = '15px';
    comparisonSection.style.backgroundColor = STYLES.backgroundColor;
    comparisonSection.style.borderRadius = '8px';
    var heading = document.createElement('h3');
    heading.textContent = 'Comparison Charts';
    heading.style.textAlign = 'center';
    heading.style.color = STYLES.barColor;
    heading.style.marginBottom = '20px';
    comparisonSection.appendChild(heading);

    // Prepare data for all events
    var allYearlyData = events.map(function (event) {
      return {
        event: event,
        yearly: aggregateByYear(event)
      };
    });

    // Get all unique years across all events
    var allYears = new Set();
    allYearlyData.forEach(function (_ref2) {
      var yearly = _ref2.yearly;
      yearly.forEach(function (y) {
        return allYears.add(y.year);
      });
    });
    var sortedYears = Array.from(allYears).sort(function (a, b) {
      return a - b;
    });

    // Create 4 comparison charts
    var chartsGrid = document.createElement('div');
    chartsGrid.style.display = 'grid';
    chartsGrid.style.gridTemplateColumns = '1fr 1fr';
    chartsGrid.style.gap = '20px';

    // Chart 1: Annual Totals - Finishers
    var finishersTotalsCanvas = document.createElement('canvas');
    chartsGrid.appendChild(createChartContainer(finishersTotalsCanvas));

    // Chart 2: Annual Totals - Volunteers
    var volunteersTotalsCanvas = document.createElement('canvas');
    chartsGrid.appendChild(createChartContainer(volunteersTotalsCanvas));

    // Chart 3: YoY Growth - Finishers
    var finishersGrowthCanvas = document.createElement('canvas');
    chartsGrid.appendChild(createChartContainer(finishersGrowthCanvas));

    // Chart 4: YoY Growth - Volunteers
    var volunteersGrowthCanvas = document.createElement('canvas');
    chartsGrid.appendChild(createChartContainer(volunteersGrowthCanvas));
    comparisonSection.appendChild(chartsGrid);

    // Export/share full report buttons
    var downloadContainer = document.createElement('div');
    downloadContainer.style.display = 'flex';
    downloadContainer.style.justifyContent = 'center';
    downloadContainer.style.marginTop = '20px';
    downloadContainer.style.gap = '10px';
    downloadContainer.style.flexWrap = 'wrap';
    var exportHtmlBtn = document.createElement('button');
    exportHtmlBtn.textContent = '📄 Export HTML';
    exportHtmlBtn.style.padding = '8px 16px';
    exportHtmlBtn.style.backgroundColor = STYLES.barColor;
    exportHtmlBtn.style.color = '#1c1b2a';
    exportHtmlBtn.style.border = 'none';
    exportHtmlBtn.style.borderRadius = '4px';
    exportHtmlBtn.style.cursor = 'pointer';
    exportHtmlBtn.style.fontWeight = 'bold';
    exportHtmlBtn.style.fontSize = '14px';
    var shareBtn = document.createElement('button');
    shareBtn.textContent = '📤 Share Report';
    shareBtn.style.padding = '8px 16px';
    shareBtn.style.backgroundColor = STYLES.lineColor;
    shareBtn.style.color = '#2b223d';
    shareBtn.style.border = 'none';
    shareBtn.style.borderRadius = '4px';
    shareBtn.style.cursor = 'pointer';
    shareBtn.style.fontWeight = 'bold';
    shareBtn.style.fontSize = '14px';
    var getReportMeta = function getReportMeta() {
      var _state$allParkruns, _currentParkrun$prope;
      var eventInfo = getCurrentEventInfo();
      var currentParkrun = (_state$allParkruns = state.allParkruns) === null || _state$allParkruns === void 0 ? void 0 : _state$allParkruns.find(function (p) {
        return p.properties.eventname === eventInfo.eventName;
      });
      var eventShortName = (currentParkrun === null || currentParkrun === void 0 || (_currentParkrun$prope = currentParkrun.properties) === null || _currentParkrun$prope === void 0 ? void 0 : _currentParkrun$prope.EventShortName) || eventInfo.eventName;
      var generatedAt = new Date();
      var generatedAtISO = generatedAt.toISOString().split('T')[0];
      return {
        eventShortName: eventShortName,
        generatedAt: generatedAt.toLocaleString(),
        generatedAtISO: generatedAtISO
      };
    };
    exportHtmlBtn.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var originalLabel, originalDisplay, mainContainer, meta, _yield$generateReport, blob, filename, url, link, _t;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            originalLabel = exportHtmlBtn.textContent;
            originalDisplay = exportHtmlBtn.style.display;
            exportHtmlBtn.textContent = 'Exporting...';
            exportHtmlBtn.disabled = true;
            exportHtmlBtn.style.display = 'none';
            _context2.p = 1;
            mainContainer = document.querySelector('.parkrun-annual-summary');
            if (mainContainer) {
              _context2.n = 2;
              break;
            }
            throw new Error('Report container not found');
          case 2:
            meta = getReportMeta();
            _context2.n = 3;
            return generateReportBlob(mainContainer, meta);
          case 3:
            _yield$generateReport = _context2.v;
            blob = _yield$generateReport.blob;
            filename = _yield$generateReport.filename;
            url = URL.createObjectURL(blob);
            link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            setTimeout(function () {
              return URL.revokeObjectURL(url);
            }, 1000);
            console.log('Annual summary HTML export complete');
            _context2.n = 5;
            break;
          case 4:
            _context2.p = 4;
            _t = _context2.v;
            console.error('Annual summary export failed:', _t);
            alert('Error exporting HTML: ' + _t.message);
          case 5:
            _context2.p = 5;
            exportHtmlBtn.disabled = false;
            exportHtmlBtn.textContent = originalLabel;
            exportHtmlBtn.style.display = originalDisplay;
            return _context2.f(5);
          case 6:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 4, 5, 6]]);
    })));
    shareBtn.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var originalLabel, originalDisplay, mainContainer, meta, _yield$generateReport2, blob, filename, file, url, link, _t2;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            originalLabel = shareBtn.textContent;
            originalDisplay = shareBtn.style.display;
            shareBtn.textContent = 'Sharing...';
            shareBtn.disabled = true;
            shareBtn.style.display = 'none';
            _context3.p = 1;
            mainContainer = document.querySelector('.parkrun-annual-summary');
            if (mainContainer) {
              _context3.n = 2;
              break;
            }
            throw new Error('Report container not found');
          case 2:
            meta = getReportMeta();
            _context3.n = 3;
            return generateReportBlob(mainContainer, meta);
          case 3:
            _yield$generateReport2 = _context3.v;
            blob = _yield$generateReport2.blob;
            filename = _yield$generateReport2.filename;
            file = new File([blob], filename, {
              type: 'text/html'
            });
            if (!(navigator.canShare && navigator.canShare({
              files: [file]
            }))) {
              _context3.n = 5;
              break;
            }
            _context3.n = 4;
            return navigator.share({
              title: "parkrun Annual Summary - ".concat(meta.eventShortName),
              text: 'Annual participation summary report',
              files: [file]
            });
          case 4:
            console.log('Annual summary shared via Web Share API');
            _context3.n = 6;
            break;
          case 5:
            url = URL.createObjectURL(blob);
            link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            setTimeout(function () {
              return URL.revokeObjectURL(url);
            }, 1000);
            alert('Sharing is not supported in this browser, so the HTML report was downloaded instead.');
          case 6:
            _context3.n = 8;
            break;
          case 7:
            _context3.p = 7;
            _t2 = _context3.v;
            console.error('Annual summary share failed:', _t2);
            alert('Error sharing report: ' + _t2.message);
          case 8:
            _context3.p = 8;
            shareBtn.disabled = false;
            shareBtn.textContent = originalLabel;
            shareBtn.style.display = originalDisplay;
            return _context3.f(8);
          case 9:
            return _context3.a(2);
        }
      }, _callee3, null, [[1, 7, 8, 9]]);
    })));
    downloadContainer.appendChild(exportHtmlBtn);
    downloadContainer.appendChild(shareBtn);
    comparisonSection.appendChild(downloadContainer);

    // Render charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
      renderComparisonChart(finishersTotalsCanvas, 'Annual Totals - Finishers', sortedYears, allYearlyData, function (y) {
        return y.totalFinishers;
      }, 'Finishers');
      renderComparisonChart(volunteersTotalsCanvas, 'Annual Totals - Volunteers', sortedYears, allYearlyData, function (y) {
        return y.totalVolunteers;
      }, 'Volunteers');
      renderComparisonChart(finishersGrowthCanvas, 'YoY Growth - Finishers (%)', sortedYears, allYearlyData, function (y) {
        return y.finishersGrowth;
      }, 'Growth (%)', true);
      renderComparisonChart(volunteersGrowthCanvas, 'YoY Growth - Volunteers (%)', sortedYears, allYearlyData, function (y) {
        return y.volunteersGrowth;
      }, 'Growth (%)', true);
    }
    return comparisonSection;
  }
  function createChartContainer(canvas) {
    var container = document.createElement('div');
    container.style.minWidth = '0';
    container.appendChild(canvas);
    return container;
  }
  function renderComparisonChart(canvas, title, years, allYearlyData, valueGetter, yAxisLabel) {
    var isGrowth = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
    var datasets = allYearlyData.map(function (_ref5, index) {
      var event = _ref5.event,
        yearly = _ref5.yearly;
      var color = COMPARISON_COLORS[index % COMPARISON_COLORS.length];
      var data = years.map(function (year) {
        var yearData = yearly.find(function (y) {
          return y.year === year;
        });
        if (!yearData) return null;
        var value = valueGetter(yearData);
        return value !== null && value !== undefined ? value : null;
      });
      return {
        label: event.title || event.eventName,
        data: data,
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: color,
        fill: false,
        tension: 0.2,
        spanGaps: true
      };
    });
    var ctx = canvas.getContext('2d');

    // eslint-disable-next-line no-undef
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: years.map(function (y) {
          return y.toString();
        }),
        datasets: datasets
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.3,
        plugins: {
          legend: {
            labels: {
              color: STYLES.textColor
            }
          },
          title: {
            display: true,
            text: title,
            color: STYLES.textColor
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Year',
              color: STYLES.textColor
            },
            ticks: {
              color: STYLES.subtleTextColor
            },
            grid: {
              color: STYLES.gridColor
            }
          },
          y: {
            beginAtZero: !isGrowth,
            title: {
              display: true,
              text: yAxisLabel,
              color: STYLES.textColor
            },
            ticks: {
              precision: 0,
              color: STYLES.subtleTextColor,
              callback: isGrowth ? function (value) {
                return value + '%';
              } : undefined
            },
            grid: {
              color: STYLES.gridColor
            }
          }
        }
      }
    });
  }
  function renderAllSummaries() {
    // Remove existing summary
    var existing = document.querySelector('.parkrun-annual-summary');
    if (existing) {
      existing.remove();
    }
    var historyData = extractEventHistoryData();
    if (historyData.eventNumbers.length === 0) {
      console.log('No event history data found');
      return;
    }

    // Store current event
    state.currentEvent = _objectSpread(_objectSpread({}, historyData), {}, {
      eventName: getCurrentEventInfo().eventName
    });
    var allEvents = [state.currentEvent].concat(_toConsumableArray(state.comparisonEvents));
    var container = document.createElement('div');
    container.className = 'parkrun-annual-summary';
    container.style.width = '100%';
    container.style.maxWidth = '1200px';
    container.style.margin = '20px auto';
    container.style.padding = '15px';
    container.style.backgroundColor = STYLES.backgroundColor;
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    var heading = document.createElement('h3');
    heading.textContent = 'Annual Participation Summary';
    heading.style.textAlign = 'center';
    heading.style.marginBottom = '15px';
    heading.style.color = STYLES.barColor;
    container.appendChild(heading);

    // Add comparison selector if we have nearby parkruns
    if (state.allParkruns === null) {
      // Still loading (shouldn't happen as init() awaits the fetch)
      var message = document.createElement('div');
      message.style.padding = '10px';
      message.style.color = STYLES.subtleTextColor;
      message.style.textAlign = 'center';
      message.style.fontSize = '13px';
      message.textContent = 'Loading parkrun events for comparison...';
      container.appendChild(message);
    } else if (state.allParkruns.length === 0) {
      // Fetch failed or returned no data
      var _message = document.createElement('div');
      _message.style.padding = '10px';
      _message.style.color = '#ff6b6b';
      _message.style.textAlign = 'center';
      _message.style.fontSize = '13px';
      _message.textContent = 'Failed to load parkrun events data. Check console for details.';
      container.appendChild(_message);
      console.error('No parkrun events loaded. Expected data from https://images.parkrun.com/events.json');
    } else {
      var nearbyParkruns = findNearbyParkruns(getCurrentEventInfo(), state.allParkruns);
      if (nearbyParkruns.length > 0) {
        var selector = createComparisonSelector(nearbyParkruns);
        selector.className = 'parkrun-comparison-selector-controls';
        container.appendChild(selector);
      } else {
        // Show message if no nearby parkruns found
        var _message2 = document.createElement('div');
        _message2.style.padding = '10px';
        _message2.style.color = STYLES.subtleTextColor;
        _message2.style.textAlign = 'center';
        _message2.style.fontSize = '13px';
        var eventInfo = getCurrentEventInfo();
        _message2.textContent = "No nearby parkruns found for comparison (within 50km of ".concat(eventInfo.eventName, ")");
        container.appendChild(_message2);
        console.log('Current event:', eventInfo.eventName, 'Total parkruns loaded:', state.allParkruns.length);
      }
    }

    // Add selected events display
    if (state.comparisonEvents.length > 0) {
      var _createSelectedEvents = createSelectedEventsDisplay(),
        eventsDisplay = _createSelectedEvents.container;
      container.appendChild(eventsDisplay);
    }

    // Create tabs
    var _createTabsForEvents = createTabsForEvents(allEvents),
      tabsContainer = _createTabsForEvents.tabsContainer,
      tabContents = _createTabsForEvents.tabContents;
    container.appendChild(tabsContainer);

    // Render each event's tab
    allEvents.forEach(function (event, index) {
      var tabContent = renderEventTab(event, index);
      if (tabContent) {
        tabContents.appendChild(tabContent);
      }
    });

    // Add comparison charts if multiple events
    if (allEvents.length > 1) {
      var comparisonCharts = renderComparisonCharts(allEvents);
      if (comparisonCharts) {
        container.appendChild(comparisonCharts);
      }
    }

    // Insert into page
    var eventHistoryChart = document.getElementById('eventHistoryChart');
    if (eventHistoryChart && eventHistoryChart.parentElement) {
      eventHistoryChart.parentElement.parentNode.insertBefore(container, eventHistoryChart.parentElement.nextSibling);
    } else {
      insertAfterFirst('h1', container);
    }
  }
  function renderAnnualSummary() {
    if (document.getElementById('annualSummaryTable') || document.getElementById('eventTabs')) {
      console.log('Annual summary already exists, skipping render');
      return;
    }
    renderAllSummaries();
  }
  function init() {
    return _init.apply(this, arguments);
  }
  function _init() {
    _init = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
      var resultsTable, pageUrl, isEventHistoryPage;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            resultsTable = document.querySelector('.Results-table');
            pageUrl = window.location.href;
            isEventHistoryPage = pageUrl.includes('/eventhistory/');
            if (!(!resultsTable || !isEventHistoryPage)) {
              _context8.n = 1;
              break;
            }
            return _context8.a(2);
          case 1:
            _context8.n = 2;
            return fetchAllParkruns();
          case 2:
            state.allParkruns = _context8.v;
            renderAnnualSummary();
          case 3:
            return _context8.a(2);
        }
      }, _callee8);
    }));
    return _init.apply(this, arguments);
  }
  init();
})();