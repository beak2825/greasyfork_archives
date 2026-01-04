// ==UserScript==
// @name            x2 Glaskugel
// @namespace       leeSalami.lss
// @version         1.0.2
// @license         All Rights Reserved
// @description     Sagt mögliche x2 Credits-Events vorher
// @author          leeSalami
// @match           https://*.leitstellenspiel.de
// @icon            https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/550100/x2%20Glaskugel.user.js
// @updateURL https://update.greasyfork.org/scripts/550100/x2%20Glaskugel.meta.js
// ==/UserScript==

(() => {
  'use strict';

  let events = {}

  checkNextEvent();

  function checkNextEvent() {
    calculateNextEvents();

    const currentTime = new Date().getTime();
    let upcomingEvent = null;
    let closestTimestamp = 0;

    for (const event in events) {
      if (!events.hasOwnProperty(event)) {
        continue;
      }

      if (events[event] - currentTime <= 604800000 && events[event] > currentTime && (closestTimestamp === 0 || events[event] < closestTimestamp)) {
        upcomingEvent = event;
        closestTimestamp = events[event];
      }
    }

    if (upcomingEvent === null) {
      return;
    }

    document.getElementById('next-event-info-block')?.remove();

    const listItem = document.createElement('li');
    listItem.id = 'next-event-info-block';
    listItem.className = 'next-credit-modifier-event navbar-text timer-event';
    listItem.style.paddingLeft = '15px';
    listItem.dataset.placement = 'bottom';
    listItem.dataset.toggle = 'tooltip-navbar';
    listItem.dataset.originalTitle = upcomingEvent;

    const infoBlock = document.createElement('div');
    listItem.append(infoBlock);

    const title = document.createElement('div');
    title.innerText = `x${user_premium ? '2,5' : '2'} Credits-Event in`;
    infoBlock.appendChild(title);

    const timer = document.createElement('div');
    timer.className = 'timer';
    timer.dataset.endTime = events[upcomingEvent];
    listItem.append(timer);

    document.getElementById('navbar-main-collapse').querySelector(':scope > ul').insertAdjacentElement('afterbegin', listItem);

    setupTimer({
      $timer: $('.next-credit-modifier-event .timer'),
      onTimerEnd: () => {
        checkNextEvent();
      },
    });

    $('.next-credit-modifier-event[data-toggle="tooltip-navbar"]').tooltip({
      delay: { show: 750, hide: 100 },
      trigger: 'hover focus click',
    });
  }

  function calculateNextEvents() {
    events = {
      'Tag des Notrufs': getTimestampByDate(2, 11, 10),
      'Valentinstag': getTimestampByDate(2, 14, 10),
      'Internationaler Tag der Feuerwehrleute': getTimestampByDate(4, 30),
      'Muttertag': getDateBasedOnFirstSundayOfMonth(5, 5),
      'Geburtstag Leitstellenspiel': getDateBasedOnFirstSundayOfMonth(7, 5),
      'Internationaler Tag des Ehrenamtes': getTimestampByDate(12, 5, 10),
      'Bevölkerungsschutztag': getDateBasedOnFirstSundayOfMonth(7, 6),
      'Herbstanfang': getFridayBeforeDate(9, 22),
      'Sommeranfang': getFridayBeforeDate(6, 22),
      'Christi Himmelfahrt': getNextAscension()
    }
  }

  function getTimestampByDate(month, day, hours = 9, offset = 0) {
    const currentYear = new Date().getFullYear() + offset;
    const date = new Date(Date.UTC(currentYear, month - 1, day, hours));

    const timestamp = date.getTime();

    if ((timestamp + 86400000) < Date.now()) {
      return getTimestampByDate(month, day, hours, offset + 1);
    }

    return timestamp;
  }

  function getDateBasedOnFirstSundayOfMonth(month, offsetFromFirstSunday, hours = 9, offset = 0) {
    const currentYear = new Date().getFullYear() + offset;

    const date = new Date(Date.UTC(currentYear, month - 1, 7, hours));
    date.setDate(offsetFromFirstSunday + (7 - date.getDay()));

    const timestamp = date.getTime();

    if ((timestamp + 86400000) < Date.now()) {
      return getDateBasedOnFirstSundayOfMonth(month, offsetFromFirstSunday, hours, offset + 1);
    }

    return timestamp;
  }

  function getFridayBeforeDate(month, day, hours = 9, offset = 0) {
    const currentYear = new Date().getFullYear() + offset;

    const date = new Date(Date.UTC(currentYear, month - 1, day, hours));
    while (date.getUTCDay() !== 5) {
      date.setUTCDate(date.getUTCDate() - 1);
    }

    const timestamp = date.getTime();

    if ((timestamp + 86400000) < Date.now()) {
      return getFridayBeforeDate(month, day, hours, offset + 1);
    }

    return timestamp;
  }

  function getEasterDate(year) {
    let f = Math.floor,
      a = year % 19,
      b = f(year / 100),
      c = year % 100,
      d = f(b / 4),
      e = b % 4,
      f1 = f((b + 8) / 25),
      g = f((b - f1 + 1) / 3),
      h = (19 * a + b - d - g + 15) % 30,
      i = f(c / 4),
      k = c % 4,
      l = (32 + 2 * e + 2 * i - h - k) % 7,
      m = f((a + 11 * h + 22 * l) / 451),
      month = f((h + l - 7 * m + 114) / 31),
      day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, month - 1, day);
  }

  function getAscensionDate(year) {
    const easter = getEasterDate(year);
    const ascension = new Date(easter);
    ascension.setDate(easter.getDate() + 39);
    return ascension;
  }

  function getNextAscension() {
    const today = new Date();
    let ascension = getAscensionDate(today.getFullYear());
    if (today > ascension) {
      ascension = getAscensionDate(today.getFullYear() + 1);
    }
    return ascension.getTime();
  }
})();
