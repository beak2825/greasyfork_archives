// ==UserScript==
// @name         Scrolller.com Premium
// @version      1.0.0
// @description  Enables Premium features on Scrolller.com
// @author       gorelics (https://github.com/gorelics)
// @match        https://scrolller.com/*
// @match        https://www.scrolller.com/*
// @run-at       document-start
// @icon         https://scrolller.com/assets/favicon-16x16.png
// @grant        none
// @namespace https://greasyfork.org/users/1554340
// @downloadURL https://update.greasyfork.org/scripts/560821/Scrolllercom%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/560821/Scrolllercom%20Premium.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const TARGET_URL = 'https://api.scrolller.com/admin';

  function isTargetRequest(url, method) {
    return method === 'POST' && url === TARGET_URL;
  }

  function tryParseJsonBody(body) {
    if (typeof body === 'string') {
      try { return JSON.parse(body); } catch { return null; }
    }
    // Якщо body не string (рідше) — не чіпаємо
    return null;
  }

  function isGetLoggedInUserQuery(payload) {
    if (!payload || typeof payload !== 'object') return false;
    const q = payload.query;
    if (typeof q !== 'string') return false;

    // Мінімальні перевірки — щоб не ламати інші GraphQL операції
    // Підійде і при зайвих пробілах/переносах
    return /GetLoggedInUserQuery/.test(q) || /getLoggedInUser\s*\{/.test(q);
  }

  function addOneYearToTodayIsoZ() {
    // Рік від сьогодні, в ISO, як у відповіді: YYYY-MM-DDTHH:mm:ss.sssZ
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);

    // Якщо хочеш як "кінець дня", можна так:
    // d.setUTCHours(23, 59, 59, 0);

    return d.toISOString();
  }

  function patchUser(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    // Клонуємо мінімально, щоб не зламати посилання у коді
    const out = { ...obj };
    out.isPremium = true;
    out.premium_ends = addOneYearToTodayIsoZ();
    return out;
  }

  const origFetch = window.fetch;

  window.fetch = async function(input, init) {
    const req = new Request(input, init);
    const url = req.url;
    const method = (req.method || 'GET').toUpperCase();

    if (!isTargetRequest(url, method)) {
      return origFetch.apply(this, arguments);
    }

    // Дістаємо body як текст, але НЕ "споживаємо" req для реального fetch:
    // request.clone() дозволяє прочитати body без втрати.
    let payload = null;
    try {
      const cloned = req.clone();
      const text = await cloned.text();
      payload = tryParseJsonBody(text);
    } catch {
      // якщо щось не так — не чіпаємо
      return origFetch.apply(this, arguments);
    }

    if (!isGetLoggedInUserQuery(payload)) {
      return origFetch.apply(this, arguments);
    }

    // Виконуємо реальний запит
    const res = await origFetch(req);

    // Читаємо JSON з клона, щоб не знищити body
    let data;
    try {
      data = await res.clone().json();
    } catch {
      return res;
    }

    // Патчимо тільки потрібне місце
    if (data && data.data && data.data.getLoggedInUser) {
      data = {
        ...data,
        data: {
          ...data.data,
          getLoggedInUser: patchUser(data.data.getLoggedInUser),
        },
      };

      const headers = new Headers(res.headers);
      headers.set('content-type', 'application/json; charset=utf-8');

      return new Response(JSON.stringify(data), {
        status: res.status,
        statusText: res.statusText,
        headers,
      });
    }

    return res;
  };
})();