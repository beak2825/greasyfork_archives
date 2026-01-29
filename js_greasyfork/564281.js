// ==UserScript==
// @name         junior parkrun Group Sunday Link
// @description  Adds a link to the consolidated club report for the most recent Sunday on junior parkrun group pages
// @author       Pete Johns (@johnsyweb)
// @grant        none
// @homepage     https://www.johnsy.com/tampermonkey-parkrun/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=parkrun.com.au
// @license      MIT
// @match        *://www.parkrun.ca/*/groups/*/
// @match        *://www.parkrun.co.at/*/groups/*/
// @match        *://www.parkrun.co.nl/*/groups/*/
// @match        *://www.parkrun.co.nz/*/groups/*/
// @match        *://www.parkrun.co.za/*/groups/*/
// @match        *://www.parkrun.com.au/*/groups/*/
// @match        *://www.parkrun.com.de/*/groups/*/
// @match        *://www.parkrun.dk/*/groups/*/
// @match        *://www.parkrun.fi/*/groups/*/
// @match        *://www.parkrun.fr/*/groups/*/
// @match        *://www.parkrun.ie/*/groups/*/
// @match        *://www.parkrun.it/*/groups/*/
// @match        *://www.parkrun.jp/*/groups/*/
// @match        *://www.parkrun.lt/*/groups/*/
// @match        *://www.parkrun.my/*/groups/*/
// @match        *://www.parkrun.no/*/groups/*/
// @match        *://www.parkrun.org.uk/*/groups/*/
// @match        *://www.parkrun.pl/*/groups/*/
// @match        *://www.parkrun.se/*/groups/*/
// @match        *://www.parkrun.sg/*/groups/*/
// @match        *://www.parkrun.us/*/groups/*/
// @namespace    http://tampermonkey.net/
// @run-at       document-end
// @supportURL   https://github.com/johnsyweb/tampermonkey-parkrun/issues/
// @tag          parkrun
// @version      0.1.3
// @downloadURL https://update.greasyfork.org/scripts/564281/junior%20parkrun%20Group%20Sunday%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/564281/junior%20parkrun%20Group%20Sunday%20Link.meta.js
// ==/UserScript==
// DO NOT EDIT - generated from src/ by scripts/build-scripts.js

function findConsolidatedClubLink() {
  var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  return Array.from(doc.querySelectorAll('a')).find(function (a) {
    return a.href.includes('/consolidatedclub/?');
  }) || null;
}
function extractClubNumFromLink(link) {
  try {
    var url = new URL(link.href);
    return url.searchParams.get('clubNum');
  } catch (_unused) {
    return null;
  }
}
function getMostRecentSunday() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  var sunday = new Date(date);
  sunday.setDate(date.getDate() - date.getDay());
  return sunday;
}
function formatDateYYYYMMDD(date) {
  var yyyy = date.getFullYear();
  var mm = String(date.getMonth() + 1).padStart(2, '0');
  var dd = String(date.getDate()).padStart(2, '0');
  return "".concat(yyyy, "-").concat(mm, "-").concat(dd);
}
function buildSundayLink(clubLink, clubNum, sundayStr) {
  var sundayUrl = "https://www.parkrun.com/results/consolidatedclub/?clubNum=".concat(clubNum, "&eventdate=").concat(sundayStr);
  var newLink = clubLink.cloneNode(true);
  newLink.href = sundayUrl;
  newLink.textContent = "View the consolidated club report for member participation at last Sunday's junior parkruns";
  return newLink;
}
function insertAfter(original, newNode) {
  original.parentNode.insertBefore(document.createElement('br'), original.nextSibling);
  original.parentNode.insertBefore(newNode, original.nextSibling.nextSibling);
}

// Main script logic
(function () {
  'use strict';

  var clubLink = findConsolidatedClubLink();
  if (!clubLink) return;
  var clubNum = extractClubNumFromLink(clubLink);
  if (!clubNum) return;
  var sunday = getMostRecentSunday();
  var sundayStr = formatDateYYYYMMDD(sunday);
  var newLink = buildSundayLink(clubLink, clubNum, sundayStr);
  insertAfter(clubLink, newLink);
})();

// Export functions for testing
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {
    findConsolidatedClubLink: findConsolidatedClubLink,
    extractClubNumFromLink: extractClubNumFromLink,
    getMostRecentSunday: getMostRecentSunday,
    formatDateYYYYMMDD: formatDateYYYYMMDD,
    buildSundayLink: buildSundayLink,
    insertAfter: insertAfter
  };
}