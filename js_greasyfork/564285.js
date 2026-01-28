// ==UserScript==
// @name         parkrun Countries Visited
// @description  Shows country flag emojis next to parkrunner name for all countries they have completed parkruns in
// @author       Pete Johns (@johnsyweb)
// @grant        none
// @homepage     https://www.johnsy.com/tampermonkey-parkrun//
// @icon         https://www.google.com/s2/favicons?sz=64&domain=parkrun.com.au
// @license      MIT
// @match        *://www.parkrun.ca/parkrunner/*/all*
// @match        *://www.parkrun.co.at/parkrunner/*/all*
// @match        *://www.parkrun.co.nl/parkrunner/*/all*
// @match        *://www.parkrun.co.nz/parkrunner/*/all*
// @match        *://www.parkrun.co.za/parkrunner/*/all*
// @match        *://www.parkrun.com.au/parkrunner/*/all*
// @match        *://www.parkrun.com.de/parkrunner/*/all*
// @match        *://www.parkrun.dk/parkrunner/*/all*
// @match        *://www.parkrun.fi/parkrunner/*/all*
// @match        *://www.parkrun.fr/parkrunner/*/all*
// @match        *://www.parkrun.ie/parkrunner/*/all*
// @match        *://www.parkrun.it/parkrunner/*/all*
// @match        *://www.parkrun.jp/parkrunner/*/all*
// @match        *://www.parkrun.lt/parkrunner/*/all*
// @match        *://www.parkrun.my/parkrunner/*/all*
// @match        *://www.parkrun.no/parkrunner/*/all*
// @match        *://www.parkrun.org.uk/parkrunner/*/all*
// @match        *://www.parkrun.pl/parkrunner/*/all*
// @match        *://www.parkrun.se/parkrunner/*/all*
// @match        *://www.parkrun.sg/parkrunner/*/all*
// @match        *://www.parkrun.us/parkrunner/*/all*
// @namespace    http://tampermonkey.net/
// @run-at       document-end
// @supportURL   https://github.com/johnsyweb/tampermonkey-parkrun/issues/
// @tag          parkrun
// @version      1.0.68
// @downloadURL https://update.greasyfork.org/scripts/564285/parkrun%20Countries%20Visited.user.js
// @updateURL https://update.greasyfork.org/scripts/564285/parkrun%20Countries%20Visited.meta.js
// ==/UserScript==
// DO NOT EDIT - generated from src/ by scripts/build-scripts.js
// Built: 2026-01-27T23:51:00.906Z

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }


(function () {
  'use strict';

  var COUNTRY_INFO = {
    at: {
      flag: '🇦🇹',
      name: 'Austria'
    },
    ru: {
      flag: '🇷🇺',
      name: 'Russia'
    },
    au: {
      flag: '🇦🇺',
      name: 'Australia'
    },
    ca: {
      flag: '🇨🇦',
      name: 'Canada'
    },
    com: {
      flag: '🇺🇸',
      name: 'United States'
    },
    de: {
      flag: '🇩🇪',
      name: 'Germany'
    },
    dk: {
      flag: '🇩🇰',
      name: 'Denmark'
    },
    fi: {
      flag: '🇫🇮',
      name: 'Finland'
    },
    fr: {
      flag: '🇫🇷',
      name: 'France'
    },
    ie: {
      flag: '🇮🇪',
      name: 'Ireland'
    },
    is: {
      flag: '🇮🇸',
      name: 'Iceland'
    },
    it: {
      flag: '🇮🇹',
      name: 'Italy'
    },
    jp: {
      flag: '🇯🇵',
      name: 'Japan'
    },
    lt: {
      flag: '🇱🇹',
      name: 'Lithuania'
    },
    my: {
      flag: '🇲🇾',
      name: 'Malaysia'
    },
    nl: {
      flag: '🇳🇱',
      name: 'Netherlands'
    },
    no: {
      flag: '🇳🇴',
      name: 'Norway'
    },
    nz: {
      flag: '🇳🇿',
      name: 'New Zealand'
    },
    pl: {
      flag: '🇵🇱',
      name: 'Poland'
    },
    se: {
      flag: '🇸🇪',
      name: 'Sweden'
    },
    sg: {
      flag: '🇸🇬',
      name: 'Singapore'
    },
    uk: {
      flag: '🇬🇧',
      name: 'United Kingdom'
    },
    us: {
      flag: '🇺🇸',
      name: 'United States '
    },
    za: {
      flag: '🇿🇦',
      name: 'South Africa'
    }
  };
  function findResultsTable() {
    var tables = document.querySelectorAll('#results');
    return tables[tables.length - 1];
  }
  function getCountryCodeFromUrl(url) {
    var parts = url.hostname.split('.');
    var countryCode = parts[parts.length - 1];
    if (countryCode === 'com' && parts[0].length === 2) {
      countryCode = parts[0];
    }
    return countryCode;
  }
  function addFlagsToEventNames(table) {
    var rows = table.querySelectorAll('tr');
    rows.forEach(function (row) {
      var eventCell = row.querySelector('td a[href*="parkrun"]');
      if (!eventCell) return;
      var url = new URL(eventCell.href);
      var countryCode = getCountryCodeFromUrl(url);
      var info = COUNTRY_INFO[countryCode];
      if (info) {
        var flagSpan = document.createElement('span');
        flagSpan.textContent = " ".concat(info.flag);
        flagSpan.title = info.name;
        flagSpan.style.cursor = 'help';
        eventCell.appendChild(flagSpan);
      }
    });
  }
  function countCountriesVisited(table) {
    var countryCounts = new Map();
    var rows = table.querySelectorAll('tr');
    rows.forEach(function (row) {
      var eventCell = row.querySelector('td a[href*="parkrun"]');
      if (!eventCell) return;
      var url = new URL(eventCell.href);
      var countryCode = getCountryCodeFromUrl(url);
      countryCounts.set(countryCode, (countryCounts.get(countryCode) || 0) + 1);
    });
    return Array.from(countryCounts.entries()).sort(function (a, b) {
      var _COUNTRY_INFO$a$, _COUNTRY_INFO$b$;
      var nameA = ((_COUNTRY_INFO$a$ = COUNTRY_INFO[a[0]]) === null || _COUNTRY_INFO$a$ === void 0 ? void 0 : _COUNTRY_INFO$a$.name) || a[0];
      var nameB = ((_COUNTRY_INFO$b$ = COUNTRY_INFO[b[0]]) === null || _COUNTRY_INFO$b$ === void 0 ? void 0 : _COUNTRY_INFO$b$.name) || b[0];
      return nameA.localeCompare(nameB);
    }).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        code = _ref2[0],
        count = _ref2[1];
      var info = COUNTRY_INFO[code];
      var symbol = info ? info.flag : code;
      var name = info ? info.name : code.toUpperCase();
      return {
        symbol: symbol,
        name: name,
        count: count
      };
    });
  }
  function updateParkrunnerTitle(countryData) {
    if (!countryData.length) {
      console.log('No countries visited');
      return;
    }
    var title = document.querySelector('h2');
    if (!title) {
      console.log('No title');
      return;
    }
    var flagsContainer = document.createElement('div');
    flagsContainer.id = 'countries-visited';
    flagsContainer.style.marginLeft = '10px';
    flagsContainer.style.fontSize = '1.8em';
    flagsContainer.style.marginTop = '5px';
    flagsContainer.title = "".concat(countryData.length, " Countries visited, according to parkrun's domains. Political boundaries may not be accurate.");
    var symbols = document.createElement('span');
    symbols.style.lineHeight = '1.5';
    symbols.style.display = 'inline-block';
    countryData.forEach(function (_ref3) {
      var symbol = _ref3.symbol,
        name = _ref3.name,
        count = _ref3.count;
      var flagSpan = document.createElement('span');
      flagSpan.textContent = symbol;
      flagSpan.title = "".concat(name, " (").concat(count, ")");
      flagSpan.style.cursor = 'help';
      symbols.appendChild(flagSpan);
      symbols.appendChild(document.createTextNode(' '));
    });
    flagsContainer.appendChild(symbols);
    title.appendChild(flagsContainer);
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      getCountryCodeFromUrl: getCountryCodeFromUrl
    };
  } else {
    var resultsTable = findResultsTable();
    if (!resultsTable) {
      console.log('Results table not found');
      return;
    }
    addFlagsToEventNames(resultsTable);
    var countryCounts = countCountriesVisited(resultsTable);
    updateParkrunnerTitle(countryCounts);
  }
})();