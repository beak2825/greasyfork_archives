// ==UserScript==
// @name         parkrun Cancellation Impact
// @description  Analyzes the impact of cancelled parkrun events on nearby alternatives
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
// @version      0.1.7
// @downloadURL https://update.greasyfork.org/scripts/564284/parkrun%20Cancellation%20Impact.user.js
// @updateURL https://update.greasyfork.org/scripts/564284/parkrun%20Cancellation%20Impact.meta.js
// ==/UserScript==
// DO NOT EDIT - generated from src/ by scripts/build-scripts.js

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
    alertColor: '#ef4444',
    // red 500
    lineColor: '#22d3ee',
    // cyan 400
    textColor: '#f3f4f6',
    subtleTextColor: '#d1d5db',
    gridColor: 'rgba(243, 244, 246, 0.18)',
    successColor: '#10b981' // emerald 500
  };
  var GAP_THRESHOLD_DAYS = 7;
  var BASELINE_EVENTS = 12;
  var CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

  var state = {
    currentEvent: null,
    allParkruns: null,
    gapInfo: null,
    nearbyParkruns: [],
    fetchController: null,
    analysisComplete: false,
    impactData: null,
    currentCancellationIndex: -1,
    cancellationDates: [],
    sortColumn: 'distance',
    sortDirection: 'asc'
  };

  // Parse a YYYY-MM-DD date string as midnight UTC to avoid timezone drift in calculations
  function parseDateUTC(dateStr) {
    return new Date("".concat(dateStr, "T00:00:00Z"));
  }
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
    _fetchAllParkruns = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var CACHE_KEY, _data$events, cached, _JSON$parse, _data, timestamp, age, response, data, features, _t3, _t4;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            CACHE_KEY = 'parkrun_events_cache';
            _context3.p = 1;
            cached = localStorage.getItem(CACHE_KEY);
            if (!cached) {
              _context3.n = 5;
              break;
            }
            _context3.p = 2;
            _JSON$parse = JSON.parse(cached), _data = _JSON$parse.data, timestamp = _JSON$parse.timestamp;
            age = Date.now() - timestamp;
            if (!(age < CACHE_DURATION_MS)) {
              _context3.n = 3;
              break;
            }
            console.log("Using cached parkrun events (".concat(Math.round(age / 1000 / 60), " minutes old)"));
            return _context3.a(2, _data);
          case 3:
            _context3.n = 5;
            break;
          case 4:
            _context3.p = 4;
            _t3 = _context3.v;
            console.log('Cache parse error, fetching fresh data', _t3);
          case 5:
            console.log('Fetching parkrun events from https://images.parkrun.com/events.json');
            _context3.n = 6;
            return fetch('https://images.parkrun.com/events.json');
          case 6:
            response = _context3.v;
            if (response.ok) {
              _context3.n = 7;
              break;
            }
            console.error('Fetch failed with status:', response.status);
            return _context3.a(2, []);
          case 7:
            _context3.n = 8;
            return response.json();
          case 8:
            data = _context3.v;
            features = ((_data$events = data.events) === null || _data$events === void 0 ? void 0 : _data$events.features) || data.features || [];
            if (!(!features || features.length === 0)) {
              _context3.n = 9;
              break;
            }
            console.error('No features found in response data');
            return _context3.a(2, []);
          case 9:
            try {
              localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: features,
                timestamp: Date.now()
              }));
            } catch (cacheError) {
              console.warn('Failed to cache parkrun events:', cacheError);
            }
            console.log('Successfully loaded', features.length, 'parkrun events');
            return _context3.a(2, features);
          case 10:
            _context3.p = 10;
            _t4 = _context3.v;
            console.error('Failed to fetch parkruns:', _t4);
            return _context3.a(2, []);
        }
      }, _callee3, null, [[2, 4], [1, 10]]);
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
    var R = 6371;
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
  function extractEventHistoryData() {
    var _document$querySelect, _document$querySelect2;
    var title = (_document$querySelect = (_document$querySelect2 = document.querySelector('h1')) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.textContent.trim()) !== null && _document$querySelect !== void 0 ? _document$querySelect : 'Event History';
    var eventNumbers = [];
    var dates = [];
    var rawDates = [];
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
        rawDates.push(date);
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
      rawDates: rawDates,
      finishers: finishers,
      volunteers: volunteers
    };
  }
  function detectEventGap(historyData, referenceDate) {
    var dates = historyData.rawDates.map(function (d) {
      return parseDateUTC(d);
    });
    if (dates.length < 1) {
      return null;
    }
    var gaps = [];
    for (var i = 1; i < dates.length; i++) {
      var prevDate = dates[i - 1];
      var currDate = dates[i];
      var daysDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
      if (daysDiff > GAP_THRESHOLD_DAYS) {
        gaps.push({
          gapStartDate: prevDate,
          gapEndDate: currDate,
          daysDiff: daysDiff,
          eventsBefore: i,
          eventsAfter: dates.length - i
        });
      }
    }
    if (gaps.length > 0) {
      var latestGap = gaps[gaps.length - 1];
      console.log("Detected ".concat(gaps.length, " gap(s); using latest: ").concat(latestGap.daysDiff.toFixed(1), " days"));
      console.log('All gaps detected:', gaps);
      return latestGap;
    }

    // No inter-event gap > 7 days: check ongoing cancellation (last event to reference/today)
    if (referenceDate && dates.length >= 1) {
      var lastUTC = dates[dates.length - 1];
      var refStr = referenceDate.toISOString().split('T')[0];
      var refUTC = parseDateUTC(refStr);
      var _daysDiff = (refUTC - lastUTC) / (1000 * 60 * 60 * 24);
      if (_daysDiff > GAP_THRESHOLD_DAYS) {
        console.log("Detected ongoing gap: ".concat(_daysDiff.toFixed(1), " days from last event to ").concat(refStr));
        return {
          gapStartDate: lastUTC,
          gapEndDate: refUTC,
          daysDiff: _daysDiff,
          eventsBefore: dates.length,
          eventsAfter: 0
        };
      }
    }
    return null;
  }
  function detectAllEventGaps(historyData, referenceDate) {
    var dates = historyData.rawDates.map(function (d) {
      return parseDateUTC(d);
    });
    if (dates.length < 1) {
      return [];
    }
    var gaps = [];
    for (var i = 1; i < dates.length; i++) {
      var prevDate = dates[i - 1];
      var currDate = dates[i];
      var daysDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
      if (daysDiff > GAP_THRESHOLD_DAYS) {
        gaps.push({
          gapStartDate: prevDate,
          gapEndDate: currDate,
          daysDiff: daysDiff,
          eventsBefore: i,
          eventsAfter: dates.length - i
        });
      }
    }

    // Include ongoing gap (last event to reference/today) when > 7 days
    if (referenceDate && dates.length >= 1) {
      var lastUTC = dates[dates.length - 1];
      var refStr = referenceDate.toISOString().split('T')[0];
      var refUTC = parseDateUTC(refStr);
      var _daysDiff2 = (refUTC - lastUTC) / (1000 * 60 * 60 * 24);
      if (_daysDiff2 > GAP_THRESHOLD_DAYS) {
        gaps.push({
          gapStartDate: lastUTC,
          gapEndDate: refUTC,
          daysDiff: _daysDiff2,
          eventsBefore: dates.length,
          eventsAfter: 0
        });
      }
    }
    console.log("Detected ".concat(gaps.length, " total gap(s)"));
    return gaps;
  }
  function getBaselineEventsBefore(historyData, targetDate) {
    var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : BASELINE_EVENTS;
    var targetStr = targetDate.toISOString().split('T')[0];
    var targetUTC = parseDateUTC(targetStr);
    var indices = [];
    for (var i = historyData.rawDates.length - 1; i >= 0; i--) {
      var eventUTC = parseDateUTC(historyData.rawDates[i]);
      if (eventUTC < targetUTC) {
        indices.push(i);
        if (indices.length >= n) break;
      }
    }
    indices.reverse();
    var filtered = {
      dates: indices.map(function (i) {
        return historyData.dates[i];
      }),
      finishers: indices.map(function (i) {
        return historyData.finishers[i];
      }),
      volunteers: indices.map(function (i) {
        return historyData.volunteers[i];
      })
    };
    var baseline = calculateBaseline(filtered);
    var window = indices.length > 0 ? {
      start: parseDateUTC(historyData.rawDates[indices[0]]),
      end: parseDateUTC(historyData.rawDates[indices[indices.length - 1]])
    } : {
      start: new Date(targetUTC),
      end: new Date(targetUTC)
    };
    return {
      filtered: filtered,
      window: window,
      baseline: baseline
    };
  }
  function getCancellationSaturdays(gapStartDate, gapEndDate) {
    var saturdays = [];

    // Normalize start date to UTC midnight to avoid timezone drift
    var startStr = gapStartDate.toISOString().split('T')[0];
    var startDate = parseDateUTC(startStr);
    var startDay = startDate.getUTCDay();
    var daysUntilSaturday = (6 - startDay) % 7;
    if (daysUntilSaturday === 0) {
      daysUntilSaturday = 7; // if already Saturday, move to next Saturday
    }
    var current = new Date(startDate);
    current.setUTCDate(current.getUTCDate() + daysUntilSaturday);
    while (current < gapEndDate) {
      saturdays.push(new Date(current));
      current.setUTCDate(current.getUTCDate() + 7);
    }
    return saturdays;
  }
  function findEventOnDate(historyData, targetDate) {
    var targetStr = targetDate.toISOString().split('T')[0];
    for (var i = 0; i < historyData.rawDates.length; i++) {
      if (historyData.rawDates[i] === targetStr) {
        return {
          date: historyData.dates[i],
          eventNumber: historyData.eventNumbers[i],
          finishers: historyData.finishers[i],
          volunteers: historyData.volunteers[i]
        };
      }
    }
    return null;
  }
  function fetchEventHistory(_x, _x2) {
    return _fetchEventHistory.apply(this, arguments);
  }
  function _fetchEventHistory() {
    _fetchEventHistory = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(eventName, domain) {
      var CACHE_KEY, _doc$querySelector$te, _doc$querySelector, cached, _JSON$parse2, data, timestamp, age, url, response, html, parser, doc, title, eventNumbers, dates, rawDates, finishers, volunteers, rows, historyData, _t5, _t6;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            CACHE_KEY = "parkrun_history_".concat(eventName);
            _context4.p = 1;
            // Check cache first
            cached = localStorage.getItem(CACHE_KEY);
            if (!cached) {
              _context4.n = 5;
              break;
            }
            _context4.p = 2;
            _JSON$parse2 = JSON.parse(cached), data = _JSON$parse2.data, timestamp = _JSON$parse2.timestamp;
            age = Date.now() - timestamp;
            if (!(age < CACHE_DURATION_MS)) {
              _context4.n = 3;
              break;
            }
            console.log("Using cached history for ".concat(eventName, " (").concat(Math.round(age / 1000 / 60), " minutes old)"));
            return _context4.a(2, data);
          case 3:
            _context4.n = 5;
            break;
          case 4:
            _context4.p = 4;
            _t5 = _context4.v;
            console.log("Cache parse error for ".concat(eventName, ", fetching fresh data"), _t5);
          case 5:
            // Fetch from network
            url = "".concat(domain, "/").concat(eventName, "/results/eventhistory/");
            _context4.n = 6;
            return fetch(url);
          case 6:
            response = _context4.v;
            _context4.n = 7;
            return response.text();
          case 7:
            html = _context4.v;
            parser = new DOMParser();
            doc = parser.parseFromString(html, 'text/html');
            title = (_doc$querySelector$te = (_doc$querySelector = doc.querySelector('h1')) === null || _doc$querySelector === void 0 ? void 0 : _doc$querySelector.textContent.trim()) !== null && _doc$querySelector$te !== void 0 ? _doc$querySelector$te : eventName;
            eventNumbers = [];
            dates = [];
            rawDates = [];
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
                rawDates.push(date);
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
            historyData = {
              eventName: eventName,
              title: title,
              eventNumbers: eventNumbers,
              dates: dates,
              rawDates: rawDates,
              finishers: finishers,
              volunteers: volunteers
            }; // Cache the result
            try {
              localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: historyData,
                timestamp: Date.now()
              }));
            } catch (cacheError) {
              console.warn("Failed to cache history for ".concat(eventName, ":"), cacheError);
            }
            return _context4.a(2, historyData);
          case 8:
            _context4.p = 8;
            _t6 = _context4.v;
            console.error("Failed to fetch event history for ".concat(eventName, ":"), _t6);
            return _context4.a(2, null);
        }
      }, _callee4, null, [[2, 4], [1, 8]]);
    }));
    return _fetchEventHistory.apply(this, arguments);
  }
  function calculateBaseline(data) {
    if (data.dates.length === 0) {
      return {
        avgFinishers: 0,
        avgVolunteers: 0,
        totalEvents: 0,
        minFinishers: 0,
        maxFinishers: 0,
        minVolunteers: 0,
        maxVolunteers: 0
      };
    }
    var avgFinishers = Math.round(data.finishers.reduce(function (a, b) {
      return a + b;
    }, 0) / data.dates.length);
    var avgVolunteers = Math.round(data.volunteers.reduce(function (a, b) {
      return a + b;
    }, 0) / data.dates.length);
    return {
      avgFinishers: avgFinishers,
      avgVolunteers: avgVolunteers,
      totalEvents: data.dates.length,
      minFinishers: Math.min.apply(Math, _toConsumableArray(data.finishers)),
      maxFinishers: Math.max.apply(Math, _toConsumableArray(data.finishers)),
      minVolunteers: Math.min.apply(Math, _toConsumableArray(data.volunteers)),
      maxVolunteers: Math.max.apply(Math, _toConsumableArray(data.volunteers))
    };
  }
  function createProgressUI() {
    var progressSection = document.createElement('div');
    progressSection.className = 'parkrun-cancellation-progress';
    progressSection.style.padding = '15px';
    progressSection.style.backgroundColor = STYLES.backgroundColor;
    progressSection.style.borderRadius = '6px';
    progressSection.style.marginBottom = '15px';
    progressSection.style.border = "1px solid ".concat(STYLES.gridColor);
    var heading = document.createElement('h4');
    heading.textContent = 'Analyzing Nearby parkrun Impact';
    heading.style.margin = '0 0 12px 0';
    heading.style.color = STYLES.barColor;
    progressSection.appendChild(heading);
    var progressBar = document.createElement('div');
    progressBar.style.width = '100%';
    progressBar.style.height = '20px';
    progressBar.style.backgroundColor = '#3a3250';
    progressBar.style.borderRadius = '4px';
    progressBar.style.marginBottom = '10px';
    progressBar.style.overflow = 'hidden';
    var progressFill = document.createElement('div');
    progressFill.style.width = '0%';
    progressFill.style.height = '100%';
    progressFill.style.backgroundColor = STYLES.lineColor;
    progressFill.style.transition = 'width 0.3s ease';
    progressBar.appendChild(progressFill);
    progressSection.appendChild(progressBar);
    var progressText = document.createElement('div');
    progressText.style.fontSize = '13px';
    progressText.style.color = STYLES.subtleTextColor;
    progressText.style.marginBottom = '12px';
    progressSection.appendChild(progressText);
    var statusText = document.createElement('div');
    statusText.style.fontSize = '12px';
    statusText.style.color = STYLES.lineColor;
    statusText.style.fontWeight = 'bold';
    statusText.style.marginBottom = '10px';
    progressSection.appendChild(statusText);
    var stopButton = document.createElement('button');
    stopButton.textContent = 'Stop Analysis';
    stopButton.style.padding = '6px 12px';
    stopButton.style.backgroundColor = STYLES.alertColor;
    stopButton.style.color = STYLES.textColor;
    stopButton.style.border = 'none';
    stopButton.style.borderRadius = '4px';
    stopButton.style.cursor = 'pointer';
    stopButton.style.fontWeight = 'bold';
    stopButton.style.fontSize = '12px';
    progressSection.appendChild(stopButton);
    return {
      progressSection: progressSection,
      updateProgress: function updateProgress(current, total) {
        var percent = Math.round(current / total * 100);
        progressFill.style.width = percent + '%';
        progressText.textContent = "".concat(current, "/").concat(total, " parkruns analyzed");
      },
      updateStatus: function updateStatus(message) {
        statusText.textContent = message;
      },
      stop: stopButton,
      hide: function hide() {
        progressSection.style.display = 'none';
      }
    };
  }
  function renderCancellationSummary(eventShortName) {
    var section = document.createElement('div');
    section.style.padding = '20px';
    section.style.backgroundColor = '#2b223d';
    section.style.borderRadius = '8px';
    section.style.marginBottom = '20px';
    section.style.border = "1px solid ".concat(STYLES.gridColor);
    var heading = document.createElement('h3');
    heading.textContent = 'Cancellation Impact Analysis';
    heading.style.color = STYLES.barColor;
    heading.style.margin = '0 0 15px 0';
    heading.style.fontSize = '20px';
    section.appendChild(heading);
    var eventNameDiv = document.createElement('div');
    eventNameDiv.style.fontSize = '16px';
    eventNameDiv.style.color = STYLES.textColor;
    eventNameDiv.style.marginBottom = '15px';
    eventNameDiv.innerHTML = "<strong style=\"color: ".concat(STYLES.lineColor, ";\">").concat(eventShortName, "</strong>");
    section.appendChild(eventNameDiv);
    var details = document.createElement('div');
    details.style.fontSize = '14px';
    details.style.lineHeight = '1.8';
    details.style.color = STYLES.subtleTextColor;
    details.style.marginBottom = '18px';
    details.innerHTML = "\uD83D\uDCCD Analyzing impact on nearby parkruns within 50km";
    section.appendChild(details);
    var startButton = document.createElement('button');
    startButton.textContent = '▶ Start Analysis';
    startButton.className = 'start-analysis-btn';
    startButton.style.padding = '12px 24px';
    startButton.style.backgroundColor = STYLES.lineColor;
    startButton.style.color = '#1c1b2a';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '6px';
    startButton.style.cursor = 'pointer';
    startButton.style.fontWeight = 'bold';
    startButton.style.fontSize = '14px';
    startButton.style.transition = 'all 0.2s';
    startButton.addEventListener('mouseenter', function () {
      startButton.style.backgroundColor = '#0ea5e9'; // brighter cyan
      startButton.style.transform = 'translateY(-1px)';
    });
    startButton.addEventListener('mouseleave', function () {
      startButton.style.backgroundColor = STYLES.lineColor;
      startButton.style.transform = 'translateY(0)';
    });
    section.appendChild(startButton);
    return {
      section: section,
      startButton: startButton
    };
  }
  function renderCancellationAnalysis() {
    return _renderCancellationAnalysis.apply(this, arguments);
  }
  function _renderCancellationAnalysis() {
    _renderCancellationAnalysis = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      var _currentParkrun$prope2;
      var existing, historyData, gapInfo, eventInfo, container, msg, _msg, currentParkrun, eventShortName, _renderCancellationSu, summarySection, startButton;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            existing = document.querySelector('.parkrun-cancellation-impact');
            if (existing) {
              existing.remove();
            }
            historyData = extractEventHistoryData();
            if (!(historyData.eventNumbers.length === 0)) {
              _context5.n = 1;
              break;
            }
            console.log('No event history data found');
            return _context5.a(2);
          case 1:
            gapInfo = detectEventGap(historyData, new Date());
            if (gapInfo) {
              _context5.n = 2;
              break;
            }
            console.log('No cancellation gap detected');
            return _context5.a(2);
          case 2:
            state.currentEvent = _objectSpread(_objectSpread({}, historyData), {}, {
              eventName: getCurrentEventInfo().eventName
            });
            state.gapInfo = gapInfo;
            eventInfo = getCurrentEventInfo();
            container = document.createElement('div');
            container.className = 'parkrun-cancellation-impact';
            container.style.width = '100%';
            container.style.maxWidth = '1200px';
            container.style.margin = '20px auto';
            container.style.padding = '15px';
            container.style.backgroundColor = STYLES.backgroundColor;
            container.style.borderRadius = '8px';
            container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

            // Check for nearby parkruns
            if (!(!state.allParkruns || state.allParkruns.length === 0)) {
              _context5.n = 3;
              break;
            }
            msg = document.createElement('div');
            msg.style.padding = '10px';
            msg.style.color = STYLES.subtleTextColor;
            msg.style.textAlign = 'center';
            msg.textContent = 'Loading nearby parkruns...';
            container.appendChild(msg);
            insertAfterFirst('h1', container);
            return _context5.a(2);
          case 3:
            state.nearbyParkruns = findNearbyParkruns(eventInfo, state.allParkruns);
            if (!(state.nearbyParkruns.length === 0)) {
              _context5.n = 4;
              break;
            }
            _msg = document.createElement('div');
            _msg.style.padding = '10px';
            _msg.style.color = STYLES.subtleTextColor;
            _msg.style.textAlign = 'center';
            _msg.textContent = 'No nearby parkruns found within 50km.';
            container.appendChild(_msg);
            insertAfterFirst('h1', container);
            return _context5.a(2);
          case 4:
            // Get EventShortName for the current event
            currentParkrun = state.allParkruns.find(function (p) {
              return p.properties.eventname === eventInfo.eventName;
            });
            eventShortName = (currentParkrun === null || currentParkrun === void 0 || (_currentParkrun$prope2 = currentParkrun.properties) === null || _currentParkrun$prope2 === void 0 ? void 0 : _currentParkrun$prope2.EventShortName) || null; // Cancellation summary with start button
            _renderCancellationSu = renderCancellationSummary(eventShortName), summarySection = _renderCancellationSu.section, startButton = _renderCancellationSu.startButton;
            container.appendChild(summarySection);
            insertAfterFirst('h1', container);

            // Setup analysis trigger
            startButton.addEventListener('click', function () {
              startButton.disabled = true;
              startButton.textContent = 'Starting...';
              startButton.style.opacity = '0.6';
              startButton.style.cursor = 'not-allowed';

              // Create and show progress UI
              var progressUI = createProgressUI();
              summarySection.insertAdjacentElement('afterend', progressUI.progressSection);

              // Background fetch
              state.fetchController = new AbortController();
              startBackgroundAnalysis(progressUI, container, summarySection);
            });
          case 5:
            return _context5.a(2);
        }
      }, _callee5);
    }));
    return _renderCancellationAnalysis.apply(this, arguments);
  }
  function startBackgroundAnalysis(_x3, _x4, _x5) {
    return _startBackgroundAnalysis.apply(this, arguments);
  }
  function _startBackgroundAnalysis() {
    _startBackgroundAnalysis = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(progressUI, container, summarySection) {
      var eventInfo, nearbyParkruns, allGaps, cancellationSaturdays, nearbyHistories, i, parkrun, eventName, shortName, distance, historyData, resultsByDate, validCancellationDates, finalCancellationDates, noDataMsg, startBtn, navSection, _t7;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            eventInfo = getCurrentEventInfo();
            nearbyParkruns = state.nearbyParkruns; // Find all cancellation Saturdays from all gaps
            allGaps = detectAllEventGaps(state.currentEvent, new Date());
            cancellationSaturdays = [];
            allGaps.forEach(function (gap) {
              var saturdays = getCancellationSaturdays(gap.gapStartDate, gap.gapEndDate);
              cancellationSaturdays.push.apply(cancellationSaturdays, _toConsumableArray(saturdays));
            });

            // Sort by date descending (newest first)
            cancellationSaturdays.sort(function (a, b) {
              return b - a;
            });
            state.cancellationDates = cancellationSaturdays;
            console.log('All Cancellation Saturdays:', cancellationSaturdays);

            // Fetch all nearby parkrun histories once
            nearbyHistories = [];
            i = 0;
          case 1:
            if (!(i < nearbyParkruns.length)) {
              _context6.n = 8;
              break;
            }
            if (!state.fetchController.signal.aborted) {
              _context6.n = 2;
              break;
            }
            console.log('Analysis stopped by user');
            return _context6.a(3, 8);
          case 2:
            parkrun = nearbyParkruns[i];
            eventName = parkrun.properties.eventname;
            shortName = parkrun.properties.EventShortName || eventName;
            distance = parkrun.distance.toFixed(1);
            progressUI.updateStatus("Fetching: ".concat(shortName, " (").concat(distance, "km)"));
            progressUI.updateProgress(i, nearbyParkruns.length);
            _context6.p = 3;
            _context6.n = 4;
            return fetchEventHistory(eventName, eventInfo.url);
          case 4:
            historyData = _context6.v;
            if (historyData) {
              nearbyHistories.push({
                parkrun: parkrun,
                historyData: historyData,
                shortName: shortName,
                distance: distance
              });
            }
            _context6.n = 6;
            break;
          case 5:
            _context6.p = 5;
            _t7 = _context6.v;
            console.error("Failed to fetch ".concat(eventName, ":"), _t7);
          case 6:
            _context6.n = 7;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 100);
            });
          case 7:
            i++;
            _context6.n = 1;
            break;
          case 8:
            // Compute results for all cancellation dates
            resultsByDate = {};
            validCancellationDates = [];
            cancellationSaturdays.forEach(function (targetDate) {
              var dateKey = targetDate.toISOString().split('T')[0];
              var results = [];
              nearbyHistories.forEach(function (_ref3) {
                var parkrun = _ref3.parkrun,
                  historyData = _ref3.historyData,
                  shortName = _ref3.shortName,
                  distance = _ref3.distance;
                var base = getBaselineEventsBefore(historyData, targetDate);

                // Find event on this cancellation date
                var eventOnDate = findEventOnDate(historyData, targetDate);
                results.push({
                  eventName: parkrun.properties.eventname,
                  title: historyData.title,
                  displayName: shortName,
                  distance: distance,
                  baseline: base.baseline,
                  eventOnDate: eventOnDate,
                  seasonalTrend: base,
                  change: eventOnDate ? {
                    finishersChange: eventOnDate.finishers - base.baseline.avgFinishers,
                    volunteersChange: eventOnDate.volunteers - base.baseline.avgVolunteers,
                    finishersPct: base.baseline.avgFinishers > 0 ? (eventOnDate.finishers - base.baseline.avgFinishers) / base.baseline.avgFinishers * 100 : 0,
                    volunteersPct: base.baseline.avgVolunteers > 0 ? (eventOnDate.volunteers - base.baseline.avgVolunteers) / base.baseline.avgVolunteers * 100 : 0
                  } : null
                });
              });

              // Check if this was a global cancellation (no parkruns ran)
              var eventsHeld = results.filter(function (r) {
                return r.eventOnDate;
              }).length;
              if (eventsHeld >= 1) {
                resultsByDate[dateKey] = results;
                validCancellationDates.push(targetDate);
              } else {
                console.log("Skipping ".concat(dateKey, ": 0/").concat(results.length, " parkruns ran (global cancellation)"));
              }
            });

            // Use filtered valid dates
            finalCancellationDates = validCancellationDates.length > 0 ? validCancellationDates : cancellationSaturdays;
            progressUI.updateProgress(nearbyParkruns.length, nearbyParkruns.length);
            if (!(validCancellationDates.length === 0)) {
              _context6.n = 9;
              break;
            }
            progressUI.updateStatus('No valid cancellation dates found - all detected dates had global cancellations');
            progressUI.stop.textContent = 'Close';
            progressUI.stop.style.backgroundColor = STYLES.alertColor;
            noDataMsg = document.createElement('div');
            noDataMsg.style.padding = '15px';
            noDataMsg.style.backgroundColor = '#3a3250';
            noDataMsg.style.borderRadius = '6px';
            noDataMsg.style.marginTop = '15px';
            noDataMsg.style.color = STYLES.textColor;
            noDataMsg.style.textAlign = 'center';
            noDataMsg.innerHTML = "\n        <h3 style=\"color: ".concat(STYLES.alertColor, "; margin: 0 0 10px 0;\">\u26A0 No Valid Analysis Dates</h3>\n        <p style=\"margin: 0 0 8px 0;\">All detected cancellation dates appear to be part of global cancellation periods (e.g., COVID-19).</p>\n        <p style=\"margin: 0; color: ").concat(STYLES.subtleTextColor, "; font-size: 13px;\">\n          No nearby parkruns held events on these dates, indicating system-wide cancellations rather than single-event cancellations.\n        </p>\n      ");
            container.appendChild(noDataMsg);
            progressUI.stop.addEventListener('click', function () {
              progressUI.hide();
            });
            return _context6.a(2);
          case 9:
            progressUI.updateStatus("Analysis complete! Found ".concat(validCancellationDates.length, " valid cancellation date(s)"));
            startBtn = document.querySelector('.start-analysis-btn');
            if (startBtn) {
              startBtn.style.display = 'none';
            }
            progressUI.stop.textContent = 'Close';
            progressUI.stop.style.backgroundColor = STYLES.successColor;
            state.resultsByDate = resultsByDate;
            state.cancellationDates = finalCancellationDates;
            state.analysisComplete = true;

            // Set initial index and render
            if (state.currentCancellationIndex === -1 && finalCancellationDates.length > 0) {
              state.currentCancellationIndex = 0; // Start with first (newest) date
            }

            // Create navigation controls at the top
            navSection = createNavigationControls(container, resultsByDate, finalCancellationDates, state.currentCancellationIndex);
            summarySection.insertAdjacentElement('afterend', navSection);
            renderImpactResults(container, resultsByDate, finalCancellationDates, state.currentCancellationIndex);

            // Auto-hide progress UI after results are shown
            setTimeout(function () {
              progressUI.hide();
            }, 500);

            // Close progress UI on click (if user wants to close it manually before auto-hide)
            progressUI.stop.addEventListener('click', function () {
              progressUI.hide();
            });
          case 10:
            return _context6.a(2);
        }
      }, _callee6, null, [[3, 5]]);
    }));
    return _startBackgroundAnalysis.apply(this, arguments);
  }
  function createNavigationControls(container, resultsByDate, cancellationDates, currentDateIndex) {
    var navSection = document.createElement('div');
    navSection.className = 'parkrun-cancellation-nav';
    navSection.style.padding = '15px';
    navSection.style.backgroundColor = '#2b223d';
    navSection.style.borderRadius = '8px';
    navSection.style.marginBottom = '20px';
    navSection.style.border = "1px solid ".concat(STYLES.gridColor);
    var navInfo = document.createElement('div');
    navInfo.style.color = STYLES.textColor;
    navInfo.style.fontSize = '14px';
    navInfo.style.marginBottom = '12px';
    navInfo.innerHTML = "\n      <strong>".concat(cancellationDates.length, " Cancellation Date").concat(cancellationDates.length !== 1 ? 's' : '', " Available</strong>\n      <div style=\"color: ").concat(STYLES.subtleTextColor, "; font-size: 12px; margin-top: 4px;\">\n        Use dropdown or buttons to navigate \u2022 Keyboard: <kbd style=\"background: #3a3250; padding: 2px 6px; border-radius: 3px; font-family: monospace; border: 1px solid ").concat(STYLES.gridColor, ";\">\u2190</kbd> <kbd style=\"background: #3a3250; padding: 2px 6px; border-radius: 3px; font-family: monospace; border: 1px solid ").concat(STYLES.gridColor, ";\">\u2192</kbd>\n      </div>\n    ");
    navSection.appendChild(navInfo);
    var navControlsWrapper = document.createElement('div');
    navControlsWrapper.style.display = 'flex';
    navControlsWrapper.style.alignItems = 'center';
    navControlsWrapper.style.gap = '8px';
    navControlsWrapper.style.flexWrap = 'wrap';
    var prevBtn = document.createElement('button');
    prevBtn.textContent = '←';
    prevBtn.style.padding = '6px 10px';
    var prevEnabled = currentDateIndex < cancellationDates.length - 1;
    prevBtn.style.backgroundColor = prevEnabled ? STYLES.lineColor : '#3a3250';
    prevBtn.style.color = prevEnabled ? '#2b223d' : STYLES.subtleTextColor;
    prevBtn.style.border = "1px solid ".concat(STYLES.gridColor);
    prevBtn.style.borderRadius = '4px';
    prevBtn.style.cursor = prevEnabled ? 'pointer' : 'not-allowed';
    prevBtn.style.fontWeight = 'bold';
    prevBtn.style.fontSize = '14px';
    prevBtn.style.transition = 'all 0.2s ease';
    prevBtn.disabled = !prevEnabled;
    if (prevEnabled) {
      prevBtn.addEventListener('mouseenter', function () {
        prevBtn.style.transform = 'translateY(-1px)';
        prevBtn.style.boxShadow = '0 2px 4px rgba(34, 211, 238, 0.3)';
      });
      prevBtn.addEventListener('mouseleave', function () {
        prevBtn.style.transform = 'translateY(0)';
        prevBtn.style.boxShadow = 'none';
      });
    }
    var dateDropdown = document.createElement('select');
    dateDropdown.style.padding = '6px 8px';
    dateDropdown.style.backgroundColor = '#3a3250';
    dateDropdown.style.color = STYLES.textColor;
    dateDropdown.style.border = "1px solid ".concat(STYLES.gridColor);
    dateDropdown.style.borderRadius = '4px';
    dateDropdown.style.cursor = 'pointer';
    dateDropdown.style.fontWeight = 'bold';
    dateDropdown.style.fontSize = '12px';
    dateDropdown.style.minWidth = '220px';
    dateDropdown.style.flex = '1';
    cancellationDates.forEach(function (date, index) {
      var option = document.createElement('option');
      var optionDateStr = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short'
      });
      option.value = index;
      option.textContent = optionDateStr;
      option.selected = index === currentDateIndex;
      dateDropdown.appendChild(option);
    });
    var nextBtn = document.createElement('button');
    nextBtn.textContent = '→';
    nextBtn.style.padding = '6px 10px';
    var nextEnabled = currentDateIndex > 0;
    nextBtn.style.backgroundColor = nextEnabled ? STYLES.lineColor : '#3a3250';
    nextBtn.style.color = nextEnabled ? '#2b223d' : STYLES.subtleTextColor;
    nextBtn.style.border = "1px solid ".concat(STYLES.gridColor);
    nextBtn.style.borderRadius = '4px';
    nextBtn.style.cursor = nextEnabled ? 'pointer' : 'not-allowed';
    nextBtn.style.fontWeight = 'bold';
    nextBtn.style.fontSize = '14px';
    nextBtn.style.transition = 'all 0.2s ease';
    nextBtn.disabled = !nextEnabled;
    if (nextEnabled) {
      nextBtn.addEventListener('mouseenter', function () {
        nextBtn.style.transform = 'translateY(-1px)';
        nextBtn.style.boxShadow = '0 2px 4px rgba(34, 211, 238, 0.3)';
      });
      nextBtn.addEventListener('mouseleave', function () {
        nextBtn.style.transform = 'translateY(0)';
        nextBtn.style.boxShadow = 'none';
      });
    }
    navControlsWrapper.appendChild(prevBtn);
    navControlsWrapper.appendChild(dateDropdown);
    navControlsWrapper.appendChild(nextBtn);
    navSection.appendChild(navControlsWrapper);
    var updateResults = function updateResults() {
      var resultsDiv = container.querySelector('.parkrun-cancellation-results');
      if (resultsDiv) {
        resultsDiv.remove();
      }
      renderImpactResults(container, resultsByDate, cancellationDates, state.currentCancellationIndex);

      // Refresh nav UI state (buttons/dropdown) to reflect new index
      var latestNav = container.querySelector('.parkrun-cancellation-nav');
      if (latestNav) {
        var selects = latestNav.querySelectorAll('select');
        if (selects[0]) selects[0].value = state.currentCancellationIndex;
        var buttons = latestNav.querySelectorAll('button');
        var prev = buttons[0];
        var next = buttons[1];
        if (prev) {
          var enabled = state.currentCancellationIndex < cancellationDates.length - 1;
          prev.disabled = !enabled;
          prev.style.backgroundColor = enabled ? STYLES.lineColor : '#3a3250';
          prev.style.color = enabled ? '#2b223d' : STYLES.subtleTextColor;
          prev.style.cursor = enabled ? 'pointer' : 'not-allowed';
        }
        if (next) {
          var _enabled = state.currentCancellationIndex > 0;
          next.disabled = !_enabled;
          next.style.backgroundColor = _enabled ? STYLES.lineColor : '#3a3250';
          next.style.color = _enabled ? '#2b223d' : STYLES.subtleTextColor;
          next.style.cursor = _enabled ? 'pointer' : 'not-allowed';
        }
      }
    };
    var handlePrev = function handlePrev() {
      if (state.currentCancellationIndex < cancellationDates.length - 1) {
        state.currentCancellationIndex += 1; // move to older date
        updateResults();
      }
    };
    var handleNext = function handleNext() {
      if (state.currentCancellationIndex > 0) {
        state.currentCancellationIndex -= 1; // move to newer date
        updateResults();
      }
    };
    var handleDropdownChange = function handleDropdownChange(e) {
      state.currentCancellationIndex = parseInt(e.target.value, 10);
      updateResults();
    };
    prevBtn.addEventListener('click', handlePrev);
    nextBtn.addEventListener('click', handleNext);
    dateDropdown.addEventListener('change', handleDropdownChange);

    // Keyboard navigation (one handler at a time)
    if (state.keyboardHandler) {
      document.removeEventListener('keydown', state.keyboardHandler);
    }
    state.keyboardHandler = function (e) {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    document.addEventListener('keydown', state.keyboardHandler);
    return navSection;
  }
  function sortResults(results, column, direction) {
    var sorted = _toConsumableArray(results);
    var getValue = function getValue(result) {
      switch (column) {
        case 'name':
          return result.displayName || result.eventName;
        case 'distance':
          return parseFloat(result.distance);
        case 'eventNumber':
          return result.eventOnDate ? parseInt(result.eventOnDate.eventNumber, 10) : -1;
        case 'baseline':
          return result.baseline.avgFinishers;
        case 'onDate':
          return result.eventOnDate ? result.eventOnDate.finishers : -1;
        case 'change':
          return result.change ? result.change.finishersChange : -999999;
        case 'changePct':
          return result.change ? result.change.finishersPct : -999999;
        default:
          return 0;
      }
    };
    sorted.sort(function (a, b) {
      var aVal = getValue(a);
      var bVal = getValue(b);
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return sorted;
  }
  function buildHtmlReport(_x6, _x7) {
    return _buildHtmlReport.apply(this, arguments);
  }
  function _buildHtmlReport() {
    _buildHtmlReport = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(resultsSection, meta) {
      var clone, originalCanvases, clonedCanvases, stylesheet, header;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            clone = resultsSection.cloneNode(true);
            originalCanvases = resultsSection.querySelectorAll('canvas');
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
            stylesheet = "\n      :root { color-scheme: dark; }\n      body { margin: 0; padding: 20px; background: ".concat(STYLES.backgroundColor, "; color: ").concat(STYLES.textColor, "; font-family: \"Segoe UI\", \"Helvetica Neue\", Arial, sans-serif; line-height: 1.5; }\n      a { color: ").concat(STYLES.lineColor, "; }\n      h1, h2, h3, h4 { color: ").concat(STYLES.barColor, "; margin: 0 0 10px 0; }\n      table { width: 100%; border-collapse: collapse; }\n      th, td { border: 1px solid ").concat(STYLES.gridColor, "; padding: 10px; text-align: left; }\n      th { background: #2b223d; color: ").concat(STYLES.barColor, "; }\n      tr:nth-child(even) td { background: #241c35; }\n      tr:nth-child(odd) td { background: #1f182e; }\n      .parkrun-cancellation-results { background: ").concat(STYLES.backgroundColor, "; padding: 16px; border-radius: 6px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25); }\n      .chart-img { max-width: 100%; display: block; }\n      .meta { margin-bottom: 16px; color: ").concat(STYLES.subtleTextColor, "; font-size: 13px; }\n      .meta strong { color: ").concat(STYLES.textColor, "; }\n    ");
            header = "\n      <header>\n        <h1>parkrun Cancellation Impact</h1>\n        <div class=\"meta\">\n          <div><strong>Event:</strong> ".concat(meta.eventShortName, "</div>\n          <div><strong>Cancelled date:</strong> ").concat(meta.cancellationDateStr, "</div>\n          <div><strong>Generated:</strong> ").concat(meta.generatedAt, "</div>\n        </div>\n      </header>\n    ");
            return _context7.a(2, "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>parkrun Cancellation Impact - ".concat(meta.eventShortName, " - ").concat(meta.cancellationDateStr, "</title><style>").concat(stylesheet, "</style></head><body>").concat(header).concat(clone.outerHTML, "</body></html>"));
        }
      }, _callee7);
    }));
    return _buildHtmlReport.apply(this, arguments);
  }
  function generateReportBlob(_x8, _x9) {
    return _generateReportBlob.apply(this, arguments);
  }
  function _generateReportBlob() {
    _generateReportBlob = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(resultsSection, meta) {
      var html, filename;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            _context8.n = 1;
            return buildHtmlReport(resultsSection, meta);
          case 1:
            html = _context8.v;
            filename = "parkrun-cancellation-impact-".concat(meta.eventShortName, "-").concat(meta.cancellationDateStr, ".html");
            return _context8.a(2, {
              blob: new Blob([html], {
                type: 'text/html'
              }),
              filename: filename
            });
        }
      }, _callee8);
    }));
    return _generateReportBlob.apply(this, arguments);
  }
  function buildSeasonalTrend(historyData, targetDate) {
    return getBaselineEventsBefore(historyData, targetDate);
  }
  function renderImpactResults(resultsContainer, resultsByDate, cancellationDates, currentDateIndex) {
    // Get results for current date
    var currentDate = cancellationDates[currentDateIndex];
    var dateKey = currentDate.toISOString().split('T')[0];
    var results = resultsByDate[dateKey] || [];
    var dateStr = currentDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    // Results section
    var resultsSection = document.createElement('div');
    resultsSection.className = 'parkrun-cancellation-results';
    resultsSection.style.marginTop = '20px';

    // Impact heading with date
    var tableHeading = document.createElement('h3');
    tableHeading.textContent = "Nearby parkrun Impact on ".concat(dateStr);
    tableHeading.style.color = STYLES.barColor;
    tableHeading.style.marginTop = '20px';
    tableHeading.style.marginBottom = '12px';
    resultsSection.appendChild(tableHeading);
    var tableWrap = document.createElement('div');
    tableWrap.style.overflowX = 'auto';
    var table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontSize = '13px';
    table.style.color = STYLES.textColor;
    var thead = document.createElement('thead');
    thead.style.position = 'sticky';
    thead.style.top = '0';
    thead.style.backgroundColor = '#2b223d';
    thead.style.zIndex = '10';
    var headerRow = document.createElement('tr');
    headerRow.style.borderBottom = "2px solid ".concat(STYLES.gridColor);
    var headers = [{
      label: 'parkrun',
      key: 'name',
      align: 'left',
      info: 'Click column headers to sort. Default ordering is by distance.'
    }, {
      label: 'Distance',
      key: 'distance',
      align: 'right',
      info: 'Distance from cancelled event in kilometers.'
    }, {
      label: 'Event #',
      key: 'eventNumber',
      align: 'right',
      info: "Event number on ".concat(dateStr, ". Lower numbers indicate newer parkruns.")
    }, {
      label: 'Baseline (Avg)',
      key: 'baseline',
      align: 'right',
      info: "12-event baseline average (finishers/volunteers) for events before ".concat(dateStr, ".")
    }, {
      label: 'On Date',
      key: 'onDate',
      align: 'right',
      info: "Actual attendance (finishers/volunteers) on ".concat(dateStr, ".")
    }, {
      label: 'Change',
      key: 'change',
      align: 'right',
      info: 'Difference between actual and baseline (finishers/volunteers).'
    }, {
      label: 'Change %',
      key: 'changePct',
      align: 'right',
      info: 'Percentage change in finishers compared to baseline.'
    }, {
      label: 'Trend',
      key: 'trend',
      align: 'right',
      info: 'Gain (+5 or more finishers), Loss (-5 or fewer), Stable (within ±5), or No Event.'
    }];
    var renderTable = function renderTable(sortedResults) {
      // Clear existing tbody if present
      var existingTbody = table.querySelector('tbody');
      if (existingTbody) {
        existingTbody.remove();
      }
      var tbody = document.createElement('tbody');
      sortedResults.forEach(function (result) {
        var row = document.createElement('tr');
        row.style.borderBottom = "1px solid ".concat(STYLES.gridColor);
        row.style.transition = 'background-color 0.15s ease';

        // Special styling for No Event rows
        var hasEvent = result.eventOnDate !== null;
        if (!hasEvent) {
          row.style.opacity = '0.6';
        }

        // Add hover effect
        row.addEventListener('mouseenter', function () {
          row.style.backgroundColor = hasEvent ? 'rgba(34, 211, 238, 0.08)' : 'rgba(243, 244, 246, 0.03)';
        });
        row.addEventListener('mouseleave', function () {
          row.style.backgroundColor = 'transparent';
        });

        // parkrun name with link
        var nameCell = document.createElement('td');
        nameCell.style.padding = '10px';
        nameCell.style.textAlign = 'left';
        nameCell.style.fontWeight = 'bold';
        var link = document.createElement('a');
        link.href = "".concat(getCurrentEventInfo().url, "/").concat(result.eventName, "/results/eventhistory/");
        link.textContent = result.displayName || result.eventName;
        link.style.color = STYLES.lineColor;
        link.style.textDecoration = 'none';
        link.target = '_blank';
        link.addEventListener('mouseenter', function () {
          link.style.textDecoration = 'underline';
        });
        link.addEventListener('mouseleave', function () {
          link.style.textDecoration = 'none';
        });
        nameCell.appendChild(link);
        row.appendChild(nameCell);
        var distanceCell = document.createElement('td');
        distanceCell.style.padding = '10px';
        distanceCell.style.textAlign = 'right';
        distanceCell.style.color = STYLES.subtleTextColor;
        distanceCell.textContent = "".concat(result.distance, "km");
        row.appendChild(distanceCell);
        var eventNumberCell = document.createElement('td');
        eventNumberCell.style.padding = '10px';
        eventNumberCell.style.textAlign = 'right';
        if (result.eventOnDate && result.eventOnDate.eventNumber) {
          eventNumberCell.textContent = result.eventOnDate.eventNumber;
          eventNumberCell.style.color = STYLES.textColor;
        } else {
          eventNumberCell.textContent = '—';
          eventNumberCell.style.color = STYLES.subtleTextColor;
        }
        row.appendChild(eventNumberCell);
        var baselineCell = document.createElement('td');
        baselineCell.style.padding = '10px';
        baselineCell.style.textAlign = 'right';
        baselineCell.innerHTML = "<strong>".concat(result.baseline.avgFinishers, "</strong> / ").concat(result.baseline.avgVolunteers);
        row.appendChild(baselineCell);
        var onDateCell = document.createElement('td');
        onDateCell.style.padding = '10px';
        onDateCell.style.textAlign = 'right';
        if (result.eventOnDate) {
          onDateCell.innerHTML = "<strong>".concat(result.eventOnDate.finishers, "</strong> / ").concat(result.eventOnDate.volunteers);
        } else {
          onDateCell.textContent = '—';
          onDateCell.style.color = STYLES.subtleTextColor;
        }
        row.appendChild(onDateCell);
        var changeCell = document.createElement('td');
        changeCell.style.padding = '10px';
        changeCell.style.textAlign = 'right';
        if (result.change) {
          var finishersSign = result.change.finishersChange > 0 ? '+' : '';
          var volunteersSign = result.change.volunteersChange > 0 ? '+' : '';
          var finishersColor = result.change.finishersChange > 0 ? STYLES.successColor : STYLES.alertColor;
          var volunteersColor = result.change.volunteersChange > 0 ? STYLES.successColor : STYLES.alertColor;
          changeCell.innerHTML = "\n          <span style=\"color: ".concat(finishersColor, ";\">").concat(finishersSign).concat(result.change.finishersChange, "</span> /\n          <span style=\"color: ").concat(volunteersColor, ";\">").concat(volunteersSign).concat(result.change.volunteersChange, "</span>\n        ");
        } else {
          changeCell.textContent = '—';
          changeCell.style.color = STYLES.subtleTextColor;
        }
        row.appendChild(changeCell);
        var changePctCell = document.createElement('td');
        changePctCell.style.padding = '10px';
        changePctCell.style.textAlign = 'right';
        if (result.change) {
          var pctColor = result.change.finishersPct > 0 ? STYLES.successColor : STYLES.alertColor;
          var sign = result.change.finishersPct > 0 ? '+' : '';
          changePctCell.innerHTML = "<span style=\"color: ".concat(pctColor, ";\">").concat(sign).concat(result.change.finishersPct.toFixed(1), "%</span>");
        } else {
          changePctCell.textContent = '—';
          changePctCell.style.color = STYLES.subtleTextColor;
        }
        row.appendChild(changePctCell);
        var trendCell = document.createElement('td');
        trendCell.style.padding = '10px';
        trendCell.style.textAlign = 'right';
        if (!result.eventOnDate) {
          trendCell.textContent = 'No Event';
          trendCell.style.color = STYLES.subtleTextColor;
        } else if (result.change.finishersChange < -5) {
          trendCell.textContent = '↓ Loss';
          trendCell.style.color = STYLES.alertColor;
        } else if (result.change.finishersChange > 5) {
          trendCell.textContent = '↑ Gain';
          trendCell.style.color = STYLES.successColor;
        } else {
          trendCell.textContent = '→ Stable';
          trendCell.style.color = STYLES.subtleTextColor;
        }
        row.appendChild(trendCell);
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
    };
    headers.forEach(function (header) {
      var th = document.createElement('th');
      th.style.padding = '10px';
      th.style.textAlign = header.align;
      th.style.color = STYLES.barColor;
      th.style.fontWeight = 'bold';
      th.style.cursor = 'pointer';
      th.style.userSelect = 'none';
      th.style.position = 'relative';
      th.style.transition = 'background-color 0.15s ease';
      th.addEventListener('mouseenter', function () {
        th.style.backgroundColor = 'rgba(34, 211, 238, 0.1)';
      });
      th.addEventListener('mouseleave', function () {
        th.style.backgroundColor = 'transparent';
      });
      var headerText = document.createElement('span');
      headerText.textContent = header.label;
      headerText.style.marginRight = '4px';
      th.appendChild(headerText);

      // Sort indicator
      var sortIndicator = document.createElement('span');
      sortIndicator.style.fontSize = '10px';
      sortIndicator.style.opacity = state.sortColumn === header.key ? '1' : '0.3';
      sortIndicator.textContent = state.sortColumn === header.key ? state.sortDirection === 'asc' ? '▲' : '▼' : '▲';
      th.appendChild(sortIndicator);

      // Info icon with tooltip
      var infoIcon = document.createElement('span');
      infoIcon.textContent = ' ℹ';
      infoIcon.style.fontSize = '12px';
      infoIcon.style.opacity = '0.6';
      infoIcon.style.cursor = 'help';
      infoIcon.style.transition = 'opacity 0.2s ease';
      infoIcon.title = header.info;
      infoIcon.addEventListener('mouseenter', function () {
        infoIcon.style.opacity = '1';
      });
      infoIcon.addEventListener('mouseleave', function () {
        infoIcon.style.opacity = '0.6';
      });
      th.appendChild(infoIcon);
      th.addEventListener('click', function () {
        if (state.sortColumn === header.key) {
          state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          state.sortColumn = header.key;
          state.sortDirection = 'asc';
        }
        var sortedResults = sortResults(results, state.sortColumn, state.sortDirection);
        renderTable(sortedResults);

        // Update all header indicators
        headers.forEach(function (h, idx) {
          var headerCell = headerRow.children[idx];
          var indicator = headerCell.children[1];
          if (h.key === state.sortColumn) {
            indicator.style.opacity = '1';
            indicator.textContent = state.sortDirection === 'asc' ? '▲' : '▼';
          } else {
            indicator.style.opacity = '0.3';
            indicator.textContent = '▲';
          }
        });
      });
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Initial render with default sorting (distance, asc)
    var sortedResults = sortResults(results, state.sortColumn, state.sortDirection);
    renderTable(sortedResults);
    tableWrap.appendChild(table);
    resultsSection.appendChild(tableWrap);

    // Seasonal trend for cancelled event
    var seasonalTrend = buildSeasonalTrend(state.currentEvent, currentDate);
    var trendSection = document.createElement('div');
    trendSection.style.marginTop = '16px';
    trendSection.style.padding = '12px';
    trendSection.style.backgroundColor = '#3a3250';
    trendSection.style.borderRadius = '4px';
    var trendHeading = document.createElement('h3');
    trendHeading.textContent = 'Cancelled Event Seasonal Trend';
    trendHeading.style.color = STYLES.barColor;
    trendHeading.style.margin = '0 0 8px 0';
    trendSection.appendChild(trendHeading);
    var windowText = document.createElement('div');
    var startStr = seasonalTrend.window.start.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    var endStr = seasonalTrend.window.end.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    windowText.style.color = STYLES.textColor;
    windowText.style.fontSize = '13px';
    windowText.style.marginBottom = '6px';
    windowText.innerHTML = "Window: ".concat(startStr, " \u2192 ").concat(endStr, " (12-event baseline)");
    trendSection.appendChild(windowText);
    var trendStats = document.createElement('div');
    trendStats.style.color = STYLES.textColor;
    trendStats.style.fontSize = '13px';
    trendStats.style.display = 'grid';
    trendStats.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
    trendStats.style.gap = '8px';
    trendStats.innerHTML = "\n      <div>Average finishers: <strong>".concat(seasonalTrend.baseline.avgFinishers, "</strong></div>\n      <div>Min finishers: <strong>").concat(seasonalTrend.baseline.minFinishers, "</strong></div>\n      <div>Max finishers: <strong>").concat(seasonalTrend.baseline.maxFinishers, "</strong></div>\n      <div>Average volunteers: <strong>").concat(seasonalTrend.baseline.avgVolunteers, "</strong></div>\n      <div>Min volunteers: <strong>").concat(seasonalTrend.baseline.minVolunteers, "</strong></div>\n      <div>Max volunteers: <strong>").concat(seasonalTrend.baseline.maxVolunteers, "</strong></div>\n      <div>Total events: <strong>").concat(seasonalTrend.baseline.totalEvents, "</strong></div>\n    ");
    trendSection.appendChild(trendStats);
    if (typeof Chart !== 'undefined' && seasonalTrend.filtered.finishers && seasonalTrend.filtered.finishers.length > 0) {
      var trendCanvas = document.createElement('canvas');
      trendCanvas.style.marginTop = '12px';
      trendSection.appendChild(trendCanvas);

      // eslint-disable-next-line no-undef
      new Chart(trendCanvas.getContext('2d'), {
        type: 'line',
        data: {
          labels: seasonalTrend.filtered.dates,
          datasets: [{
            label: 'Finishers',
            data: seasonalTrend.filtered.finishers,
            borderColor: STYLES.lineColor,
            backgroundColor: 'rgba(34, 211, 238, 0.25)',
            tension: 0.2,
            fill: true
          }, {
            label: 'Volunteers',
            data: seasonalTrend.filtered.volunteers,
            borderColor: STYLES.successColor,
            backgroundColor: 'rgba(16, 185, 129, 0.18)',
            tension: 0.2,
            fill: true
          }, {
            label: 'Finishers baseline avg',
            data: seasonalTrend.filtered.dates.map(function () {
              return seasonalTrend.baseline.avgFinishers;
            }),
            borderColor: STYLES.barColor,
            borderDash: [6, 4],
            pointRadius: 0
          }, {
            label: 'Volunteers baseline avg',
            data: seasonalTrend.filtered.dates.map(function () {
              return seasonalTrend.baseline.avgVolunteers;
            }),
            borderColor: STYLES.gridColor,
            borderDash: [6, 4],
            pointRadius: 0
          }]
        },
        options: {
          animation: false,
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.6,
          plugins: {
            legend: {
              labels: {
                color: STYLES.textColor
              }
            },
            title: {
              display: true,
              text: 'Finishers & volunteers over baseline window',
              color: STYLES.textColor
            }
          },
          scales: {
            x: {
              ticks: {
                color: STYLES.subtleTextColor
              },
              grid: {
                color: STYLES.gridColor
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                color: STYLES.subtleTextColor
              },
              grid: {
                color: STYLES.gridColor
              },
              title: {
                display: true,
                text: 'Finishers',
                color: STYLES.textColor
              }
            }
          }
        }
      });
    } else {
      var emptyMsg = document.createElement('div');
      emptyMsg.style.color = STYLES.subtleTextColor;
      emptyMsg.style.fontSize = '12px';
      emptyMsg.style.marginTop = '8px';
      emptyMsg.textContent = 'No historical data available for the baseline window.';
      trendSection.appendChild(emptyMsg);
    }
    resultsSection.appendChild(trendSection);

    // Navigation handled by top-level controls injected after summary

    // Most impacted events seasonal trends
    var positiveChanges = results.filter(function (r) {
      return r.change && r.change.finishersChange > 0 && r.change.finishersPct !== undefined;
    });
    var topAbsolute = _toConsumableArray(positiveChanges).sort(function (a, b) {
      return b.change.finishersChange - a.change.finishersChange;
    }).slice(0, 1);
    var topRelative = _toConsumableArray(positiveChanges).filter(function (r) {
      return r.change.finishersPct > 0;
    }).sort(function (a, b) {
      return b.change.finishersPct - a.change.finishersPct;
    }).slice(0, 1);
    var impactedSection = document.createElement('div');
    impactedSection.style.marginTop = '18px';
    impactedSection.style.padding = '12px';
    impactedSection.style.backgroundColor = '#2b223d';
    impactedSection.style.borderRadius = '4px';
    var impactedHeading = document.createElement('h3');
    impactedHeading.textContent = 'Most Impacted parkruns';
    impactedHeading.style.color = STYLES.barColor;
    impactedHeading.style.margin = '0 0 10px 0';
    impactedSection.appendChild(impactedHeading);
    var impactedSummary = document.createElement('div');
    impactedSummary.style.color = STYLES.textColor;
    impactedSummary.style.fontSize = '13px';
    if (topAbsolute.length === 0) {
      impactedSummary.textContent = 'No nearby parkruns saw an attendance increase on this date.';
      impactedSection.appendChild(impactedSummary);
    } else {
      var summaries = [];
      if (topAbsolute[0]) {
        var r = topAbsolute[0];
        summaries.push("Largest absolute gain: <strong>".concat(r.displayName || r.eventName, "</strong> (+").concat(r.change.finishersChange, " finishers, ").concat(r.change.finishersPct.toFixed(1), "%)"));
      }
      if (topRelative[0]) {
        var _r = topRelative[0];
        summaries.push("Largest relative gain: <strong>".concat(_r.displayName || _r.eventName, "</strong> (+").concat(_r.change.finishersPct.toFixed(1), "%, +").concat(_r.change.finishersChange, " finishers)"));
      }
      impactedSummary.innerHTML = summaries.join('<br>');
      impactedSection.appendChild(impactedSummary);
      var impactedList = [topAbsolute[0], topRelative[0]].filter(Boolean);
      var seen = new Set();
      impactedList.forEach(function (r) {
        if (!r || !r.seasonalTrend || !r.seasonalTrend.filtered) return;
        if (seen.has(r.eventName)) return;
        seen.add(r.eventName);
        var card = document.createElement('div');
        card.style.marginTop = '12px';
        card.style.padding = '10px';
        card.style.backgroundColor = '#3a3250';
        card.style.borderRadius = '4px';
        var title = document.createElement('div');
        title.style.color = STYLES.textColor;
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '6px';
        title.textContent = r.displayName || r.eventName;
        card.appendChild(title);
        var stats = document.createElement('div');
        stats.style.color = STYLES.textColor;
        stats.style.fontSize = '12px';
        stats.style.display = 'grid';
        stats.style.gridTemplateColumns = 'repeat(auto-fit, minmax(160px, 1fr))';
        stats.style.gap = '6px';
        stats.innerHTML = "\n          <div>Avg finishers: <strong>".concat(r.seasonalTrend.baseline.avgFinishers, "</strong></div>\n          <div>Min finishers: <strong>").concat(r.seasonalTrend.baseline.minFinishers, "</strong></div>\n          <div>Max finishers: <strong>").concat(r.seasonalTrend.baseline.maxFinishers, "</strong></div>\n          <div>Avg volunteers: <strong>").concat(r.seasonalTrend.baseline.avgVolunteers, "</strong></div>\n          <div>Min volunteers: <strong>").concat(r.seasonalTrend.baseline.minVolunteers, "</strong></div>\n          <div>Max volunteers: <strong>").concat(r.seasonalTrend.baseline.maxVolunteers, "</strong></div>\n        ");
        card.appendChild(stats);
        if (typeof Chart !== 'undefined' && r.seasonalTrend.filtered.finishers && r.seasonalTrend.filtered.finishers.length > 0) {
          var canvas = document.createElement('canvas');
          canvas.style.marginTop = '10px';
          card.appendChild(canvas);

          // Build chart data including cancellation date
          var chartLabels = _toConsumableArray(r.seasonalTrend.filtered.dates);
          var chartFinishers = _toConsumableArray(r.seasonalTrend.filtered.finishers);
          var chartVolunteers = _toConsumableArray(r.seasonalTrend.filtered.volunteers);
          var cancelDateStr = dateStr;

          // Add cancellation date point
          if (r.eventOnDate) {
            chartLabels.push(cancelDateStr);
            chartFinishers.push(r.eventOnDate.finishers);
            chartVolunteers.push(r.eventOnDate.volunteers);
          }

          // eslint-disable-next-line no-undef
          new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
              labels: chartLabels,
              datasets: [{
                label: 'Finishers',
                data: chartFinishers,
                borderColor: STYLES.lineColor,
                backgroundColor: 'rgba(34, 211, 238, 0.25)',
                tension: 0.2,
                fill: true
              }, {
                label: 'Volunteers',
                data: chartVolunteers,
                borderColor: STYLES.successColor,
                backgroundColor: 'rgba(16, 185, 129, 0.18)',
                tension: 0.2,
                fill: true
              }, {
                label: 'Finishers baseline avg',
                data: chartLabels.map(function () {
                  return r.seasonalTrend.baseline.avgFinishers;
                }),
                borderColor: STYLES.barColor,
                borderDash: [6, 4],
                pointRadius: 0
              }, {
                label: 'Volunteers baseline avg',
                data: chartLabels.map(function () {
                  return r.seasonalTrend.baseline.avgVolunteers;
                }),
                borderColor: STYLES.gridColor,
                borderDash: [6, 4],
                pointRadius: 0
              }]
            },
            options: {
              animation: false,
              responsive: true,
              maintainAspectRatio: true,
              aspectRatio: 1.6,
              plugins: {
                legend: {
                  labels: {
                    color: STYLES.textColor
                  }
                },
                title: {
                  display: true,
                  text: 'Seasonal trend',
                  color: STYLES.textColor
                }
              },
              scales: {
                x: {
                  ticks: {
                    color: STYLES.subtleTextColor
                  },
                  grid: {
                    color: STYLES.gridColor
                  }
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                    color: STYLES.subtleTextColor
                  },
                  grid: {
                    color: STYLES.gridColor
                  },
                  title: {
                    display: true,
                    text: 'Count',
                    color: STYLES.textColor
                  }
                }
              }
            }
          });
        }
        impactedSection.appendChild(card);
      });
    }
    resultsSection.appendChild(impactedSection);

    // Charts section
    if (typeof Chart !== 'undefined') {
      var chartsContainer = document.createElement('div');
      chartsContainer.style.marginTop = '30px';
      var chartsHeading = document.createElement('h3');
      chartsHeading.textContent = 'Visual Impact Analysis';
      chartsHeading.style.color = STYLES.barColor;
      chartsHeading.style.marginBottom = '15px';
      chartsContainer.appendChild(chartsHeading);
      var chartsGrid = document.createElement('div');
      chartsGrid.style.display = 'grid';
      chartsGrid.style.gridTemplateColumns = '1fr 1fr';
      chartsGrid.style.gap = '20px';

      // Chart 1: Finishers - Baseline vs Actual
      var finishersCanvas = document.createElement('canvas');
      var finishersContainer = document.createElement('div');
      finishersContainer.style.minWidth = '0';
      finishersContainer.appendChild(finishersCanvas);
      chartsGrid.appendChild(finishersContainer);

      // Chart 2: Volunteers - Baseline vs Actual
      var volunteersCanvas = document.createElement('canvas');
      var volunteersContainer = document.createElement('div');
      volunteersContainer.style.minWidth = '0';
      volunteersContainer.appendChild(volunteersCanvas);
      chartsGrid.appendChild(volunteersContainer);
      chartsContainer.appendChild(chartsGrid);
      resultsSection.appendChild(chartsContainer);

      // Render finishers chart
      var finishersLabels = results.filter(function (r) {
        return r.eventOnDate;
      }).map(function (r) {
        return r.title || r.eventName;
      });
      var finishersBaseline = results.filter(function (r) {
        return r.eventOnDate;
      }).map(function (r) {
        return r.baseline.avgFinishers;
      });
      var finishersActual = results.filter(function (r) {
        return r.eventOnDate;
      }).map(function (r) {
        return r.eventOnDate.finishers;
      });

      // eslint-disable-next-line no-undef
      new Chart(finishersCanvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: finishersLabels,
          datasets: [{
            label: 'Baseline (12-event avg)',
            data: finishersBaseline,
            backgroundColor: STYLES.barColor,
            borderColor: STYLES.barColor,
            borderWidth: 1
          }, {
            label: "Actual on ".concat(dateStr),
            data: finishersActual,
            backgroundColor: STYLES.lineColor,
            borderColor: STYLES.lineColor,
            borderWidth: 1
          }]
        },
        options: {
          animation: false,
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.5,
          plugins: {
            legend: {
              labels: {
                color: STYLES.textColor
              }
            },
            title: {
              display: true,
              text: 'Finishers: Baseline vs Actual',
              color: STYLES.textColor
            }
          },
          scales: {
            x: {
              ticks: {
                color: STYLES.subtleTextColor,
                display: false
              },
              grid: {
                color: STYLES.gridColor
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Finishers',
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

      // Render volunteers chart
      var volunteersBaseline = results.filter(function (r) {
        return r.eventOnDate;
      }).map(function (r) {
        return r.baseline.avgVolunteers;
      });
      var volunteersActual = results.filter(function (r) {
        return r.eventOnDate;
      }).map(function (r) {
        return r.eventOnDate.volunteers;
      });

      // eslint-disable-next-line no-undef
      new Chart(volunteersCanvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: finishersLabels,
          datasets: [{
            label: 'Baseline (12-event avg)',
            data: volunteersBaseline,
            backgroundColor: STYLES.barColor,
            borderColor: STYLES.barColor,
            borderWidth: 1
          }, {
            label: "Actual on ".concat(dateStr),
            data: volunteersActual,
            backgroundColor: STYLES.lineColor,
            borderColor: STYLES.lineColor,
            borderWidth: 1
          }]
        },
        options: {
          animation: false,
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.5,
          plugins: {
            legend: {
              labels: {
                color: STYLES.textColor
              }
            },
            title: {
              display: true,
              text: 'Volunteers: Baseline vs Actual',
              color: STYLES.textColor
            }
          },
          scales: {
            x: {
              ticks: {
                color: STYLES.subtleTextColor,
                display: false
              },
              grid: {
                color: STYLES.gridColor
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Volunteers',
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
    }

    // Summary statistics
    var summary = document.createElement('div');
    summary.style.marginTop = '20px';
    summary.style.padding = '12px';
    summary.style.backgroundColor = '#3a3250';
    summary.style.borderRadius = '4px';
    var summaryHeading = document.createElement('h4');
    summaryHeading.textContent = 'Summary';
    summaryHeading.style.margin = '0 0 8px 0';
    summaryHeading.style.color = STYLES.lineColor;
    summary.appendChild(summaryHeading);
    var eventsWithData = results.filter(function (r) {
      return r.eventOnDate && r.change;
    });
    var totalGain = eventsWithData.reduce(function (sum, r) {
      return sum + r.change.finishersChange;
    }, 0);
    var totalVolunteerGain = eventsWithData.reduce(function (sum, r) {
      return sum + r.change.volunteersChange;
    }, 0);
    var avgChangeFinishers = eventsWithData.length > 0 ? Math.round(totalGain / eventsWithData.length) : 0;
    var avgChangeVolunteers = eventsWithData.length > 0 ? Math.round(eventsWithData.reduce(function (sum, r) {
      return sum + r.change.volunteersChange;
    }, 0) / eventsWithData.length) : 0;
    var summaryText = document.createElement('div');
    summaryText.style.fontSize = '13px';
    summaryText.style.color = STYLES.textColor;
    summaryText.innerHTML = "\n      <p style=\"margin: 4px 0;\">\n        <strong>".concat(results.length, "</strong> nearby parkruns analyzed\n        <span style=\"color: ").concat(STYLES.subtleTextColor, "; font-size: 11px; margin-left: 8px;\" title=\"parkruns within 50km of the cancelled event in the same country and series\">\u2139</span>\n      </p>\n      <p style=\"margin: 4px 0;\">\n        <strong>").concat(eventsWithData.length, "</strong> held events on ").concat(dateStr, "\n        <span style=\"color: ").concat(STYLES.subtleTextColor, "; font-size: 11px; margin-left: 8px;\" title=\"Number of nearby parkruns that ran on this date\">\u2139</span>\n      </p>\n      <p style=\"margin: 4px 0;\">\n        Average change in finishers: <span style=\"color: ").concat(avgChangeFinishers < 0 ? STYLES.alertColor : STYLES.successColor, "; font-weight: bold;\">").concat(avgChangeFinishers > 0 ? '+' : '').concat(avgChangeFinishers, "</span>\n        <span style=\"color: ").concat(STYLES.subtleTextColor, "; font-size: 11px; margin-left: 8px;\" title=\"Mean difference between actual finishers and 12-event baseline average across events that ran\">\u2139</span>\n      </p>\n      <p style=\"margin: 4px 0;\">\n        Average change in volunteers: <span style=\"color: ").concat(avgChangeVolunteers < 0 ? STYLES.alertColor : STYLES.successColor, "; font-weight: bold;\">").concat(avgChangeVolunteers > 0 ? '+' : '').concat(avgChangeVolunteers, "</span>\n        <span style=\"color: ").concat(STYLES.subtleTextColor, "; font-size: 11px; margin-left: 8px;\" title=\"Mean difference between actual volunteers and 12-event baseline average across events that ran\">\u2139</span>\n      </p>\n      <p style=\"margin: 4px 0;\">\n        Estimated total additional finishers: <span style=\"color: ").concat(totalGain < 0 ? STYLES.alertColor : STYLES.successColor, "; font-weight: bold;\">").concat(totalGain > 0 ? '+' : '').concat(totalGain, "</span>\n        <span style=\"color: ").concat(STYLES.subtleTextColor, "; font-size: 11px; margin-left: 8px;\" title=\"Sum of all finisher changes across nearby parkruns - positive indicates runners redistributed from the cancelled event\">\u2139</span>\n      </p>\n      <p style=\"margin: 4px 0;\">\n        Estimated total additional volunteers: <span style=\"color: ").concat(totalVolunteerGain < 0 ? STYLES.alertColor : STYLES.successColor, "; font-weight: bold;\">").concat(totalVolunteerGain > 0 ? '+' : '').concat(totalVolunteerGain, "</span>\n        <span style=\"color: ").concat(STYLES.subtleTextColor, "; font-size: 11px; margin-left: 8px;\" title=\"Sum of all volunteer changes across nearby parkruns - indicates how many extra volunteers were needed on the day\">\u2139</span>\n      </p>\n    ");
    summary.appendChild(summaryText);
    resultsSection.appendChild(summary);

    // Download button
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
    var getReportMeta = function getReportMeta() {
      var _currentParkrun$prope;
      var eventInfo = getCurrentEventInfo();
      var currentParkrun = state.allParkruns.find(function (p) {
        return p.properties.eventname === eventInfo.eventName;
      });
      var eventShortName = (currentParkrun === null || currentParkrun === void 0 || (_currentParkrun$prope = currentParkrun.properties) === null || _currentParkrun$prope === void 0 ? void 0 : _currentParkrun$prope.EventShortName) || eventInfo.eventName;
      var cancellationDateStr = currentDate.toISOString().split('T')[0];
      return {
        eventShortName: eventShortName,
        cancellationDateStr: cancellationDateStr
      };
    };
    exportHtmlBtn.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var originalLabel, originalDisplay, _getReportMeta, eventShortName, cancellationDateStr, _yield$generateReport, blob, filename, url, link, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            originalLabel = exportHtmlBtn.textContent;
            originalDisplay = exportHtmlBtn.style.display;
            exportHtmlBtn.textContent = 'Exporting...';
            exportHtmlBtn.disabled = true;
            exportHtmlBtn.style.display = 'none';
            _context.p = 1;
            _getReportMeta = getReportMeta(), eventShortName = _getReportMeta.eventShortName, cancellationDateStr = _getReportMeta.cancellationDateStr;
            _context.n = 2;
            return generateReportBlob(resultsSection, {
              eventShortName: eventShortName,
              cancellationDateStr: cancellationDateStr,
              generatedAt: new Date().toLocaleString()
            });
          case 2:
            _yield$generateReport = _context.v;
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
            console.log('HTML export complete');
            _context.n = 4;
            break;
          case 3:
            _context.p = 3;
            _t = _context.v;
            console.error('HTML export failed:', _t);
            alert('Error exporting HTML: ' + _t.message);
          case 4:
            _context.p = 4;
            exportHtmlBtn.disabled = false;
            exportHtmlBtn.textContent = originalLabel;
            exportHtmlBtn.style.display = originalDisplay;
            return _context.f(4);
          case 5:
            return _context.a(2);
        }
      }, _callee, null, [[1, 3, 4, 5]]);
    })));
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
    shareBtn.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var originalLabel, originalDisplay, _getReportMeta2, eventShortName, cancellationDateStr, _yield$generateReport2, blob, filename, file, url, link, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            originalLabel = shareBtn.textContent;
            originalDisplay = shareBtn.style.display;
            shareBtn.textContent = 'Sharing...';
            shareBtn.disabled = true;
            shareBtn.style.display = 'none';
            _context2.p = 1;
            _getReportMeta2 = getReportMeta(), eventShortName = _getReportMeta2.eventShortName, cancellationDateStr = _getReportMeta2.cancellationDateStr;
            _context2.n = 2;
            return generateReportBlob(resultsSection, {
              eventShortName: eventShortName,
              cancellationDateStr: cancellationDateStr,
              generatedAt: new Date().toLocaleString()
            });
          case 2:
            _yield$generateReport2 = _context2.v;
            blob = _yield$generateReport2.blob;
            filename = _yield$generateReport2.filename;
            file = new File([blob], filename, {
              type: 'text/html'
            });
            if (!(navigator.canShare && navigator.canShare({
              files: [file]
            }))) {
              _context2.n = 4;
              break;
            }
            _context2.n = 3;
            return navigator.share({
              title: "parkrun Cancellation Impact - ".concat(eventShortName),
              text: "Cancellation date: ".concat(cancellationDateStr),
              files: [file]
            });
          case 3:
            console.log('Report shared via Web Share API');
            _context2.n = 5;
            break;
          case 4:
            url = URL.createObjectURL(blob);
            link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            setTimeout(function () {
              return URL.revokeObjectURL(url);
            }, 1000);
            alert('Sharing is not supported in this browser, so the HTML report was downloaded instead.');
          case 5:
            _context2.n = 7;
            break;
          case 6:
            _context2.p = 6;
            _t2 = _context2.v;
            console.error('Share failed:', _t2);
            alert('Error sharing report: ' + _t2.message);
          case 7:
            _context2.p = 7;
            shareBtn.disabled = false;
            shareBtn.textContent = originalLabel;
            shareBtn.style.display = originalDisplay;
            return _context2.f(7);
          case 8:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 6, 7, 8]]);
    })));
    downloadContainer.appendChild(exportHtmlBtn);
    downloadContainer.appendChild(shareBtn);
    resultsSection.appendChild(downloadContainer);
    resultsContainer.appendChild(resultsSection);
  }
  function init() {
    return _init.apply(this, arguments);
  }
  function _init() {
    _init = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
      var resultsTable, pageUrl, isEventHistoryPage;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            resultsTable = document.querySelector('.Results-table');
            pageUrl = window.location.href;
            isEventHistoryPage = pageUrl.includes('/eventhistory/');
            if (!(!resultsTable || !isEventHistoryPage)) {
              _context9.n = 1;
              break;
            }
            return _context9.a(2);
          case 1:
            _context9.n = 2;
            return fetchAllParkruns();
          case 2:
            state.allParkruns = _context9.v;
            renderCancellationAnalysis();
          case 3:
            return _context9.a(2);
        }
      }, _callee9);
    }));
    return _init.apply(this, arguments);
  }
  init();
})();