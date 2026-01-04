// ==UserScript==
// @name         Soop Recap 대시보드
// @namespace    https://www.sooplive.co.kr/
// @version      0.1.4
// @description  Soop  통계 페이지의 대시보드 UI를 개선하고 차트 시각화를 향상시킵니다
// @match        *://broadstatistic.sooplive.co.kr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.sooplive.co.kr
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.js
// @connect      www.sooplive.co.kr
// @connect      sch.sooplive.co.kr
// @connect      afevent2.sooplive.co.kr
// @connect      profile.img.sooplive.co.kr
// @connect      profile.sooplive.co.kr
// @connect      admin.img.sooplive.co.kr
// @connect      stimg.sooplive.co.kr
// @connect      noti.sooplive.co.kr
// @connect      broadstatistic.sooplive.co.kr
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555718/Soop%20Recap%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/555718/Soop%20Recap%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    (function () {
      "use strict";

    const DEBUG = false;

    const CHART_CONFIG = {
        BAR_HEIGHT_BASE: 180,
        BAR_HEIGHT_PER_ITEM_LARGE: 72,
        BAR_HEIGHT_PER_ITEM_MEDIUM: 62,
        BAR_HEIGHT_PER_ITEM_SMALL: 54,
        CATEGORY_THRESHOLD_LARGE: 6,
        CATEGORY_THRESHOLD_MEDIUM: 8,
        MIN_HEIGHT: 360,
        LABEL_SIZE_LARGE: "13px",
        LABEL_SIZE_MEDIUM: "12px",
        LABEL_SIZE_SMALL: "11px",
    };

    const TIMING = {
        DEBOUNCE_HIDE: 150};

    const streamerGradientThemes = [
        {
            id: "sunset-flare",
            gradient: "linear-gradient(135deg,#f86a9b,#7366ff)",
            main: "#7366ff",
        },
        {
            id: "luminous-sky",
            gradient: "linear-gradient(135deg,#6a5af9,#5ec4ff)",
            main: "#6a5af9",
        },
        {
            id: "candy-tide",
            gradient: "linear-gradient(135deg,#ff996a,#f76aeb)",
            main: "#ff996a",
        },
        {
            id: "aqua-drift",
            gradient: "linear-gradient(135deg,#4cc3ff,#7ae6c3)",
            main: "#4cc3ff",
        },
        {
            id: "ember-hue",
            gradient: "linear-gradient(135deg,#f5b15d,#ec6f91)",
            main: "#f5b15d",
        },
        {
            id: "wild-apple", // Light Purple -> Pale Yellow
            gradient: "linear-gradient(to top, #d299c2 0%, #fef9d7 100%)",
            main: "#d299c2",
        },
        {
            id: "amy-crisp", // Purple -> Pink
            gradient: "linear-gradient(120deg, #a18cd1 0%, #fbc2eb 100%)",
            main: "#a18cd1",
        },
        {
            id: "happy-fisher", // Cyan -> Blue
            gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
            main: "#66a6ff",
        },
        {
            id: "angel-care", // Pink -> Pale Yellow
            gradient: "linear-gradient(to top, #ffe29f 0%, #ffa99f 48%, #ff719a 100%)",
            main: "#ff719a",
        },
    ];

    const gradientPalette = streamerGradientThemes.map(
        (theme) => theme.gradient,
    );

    const barColorPalette = [
        "#ff8b6a",
        "#7da4ff",
        "#5de1c0",
        "#ffba6c",
        "#a481ff",
        "#6fd4ff",
        "#ff9ac6",
        "#66e4a9",
        "#ffc866",
        "#88b9ff",
        "#69d2e7",
        "#a7dbd8",
        "#e0e4cc",
        "#f38630",
        "#fa6900",
    ];

    const fallbackBarColor = "#7882a8";
    const MAX_STREAMER_BARS = 15;

    /**
     * Math utility functions
     *
     * Extract from index.js lines 53-54:
     * - sum
     * - fmt (Intl.NumberFormat)
     */

    // TODO: Extract from index.js

    const sum = (arr) => arr.reduce((a, b) => a + b, 0);
    const fmt = new Intl.NumberFormat();

    /**
     * Time formatting and conversion utilities
     *
     * Extract from index.js:
     * - minutesToText (lines 55-60)
     * - hmsToMinutes (lines 61-68)
     * - normalizeToMinutes (line 70)
     */

    // TODO: Extract from index.js

    const minutesToText = (m) => {
      const mm = Math.max(0, Math.floor(m));
      const h = Math.floor(mm / 60);
      const min = mm % 60;
      return `${h}시간 ${min}분`;
    };

    const hmsToMinutes = (hms) => {
      const m = String(hms || "")
        .trim()
        .match(/^(\d+):(\d{2}):(\d{2})$/);
      if (!m) return 0;
      const [, hh, mm, ss] = m;
      return +hh * 60 + +mm + Math.floor(+ss / 60);
    };

    const normalizeToMinutes = (v) => (v > 1000 ? v / 60 : v);

    /**
     * DOM utility functions
     *
     * Extract from index.js lines 51-52:
     * - $ (querySelector wrapper)
     * - $$ (querySelectorAll wrapper)
     */

    // TODO: Extract from index.js

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    const DATE_INPUT_SELECTOR =
      'input[name*="start"], input[id*="start"], input[id="sDate"], input[name="startDate"], input[name="srchDtFrom"]';
    const DATE_END_SELECTOR$1 =
      'input[name*="end"], input[id*="end"], input[id="eDate"], input[name="endDate"], input[name="srchDtTo"]';

    const cache = {
      dateRange: null,
      pcMobileData: null,
      bodyText: "",
      dateInputValues: null,
      urlParams: "",
      timestamp: 0,
    };

    function toISO(y, m, d) {
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }

    function extractRangeFromBody(text) {
      if (!text) return null;
      const match = text.match(
        /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*~\s*(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/,
      );
      if (!match) return null;
      return {
        start: toISO(match[1], match[2], match[3]),
        end: toISO(match[4], match[5], match[6]),
      };
    }

    function readDateInputs() {
      const startInput = $(DATE_INPUT_SELECTOR);
      const endInput = $(DATE_END_SELECTOR$1);
      const startValue = startInput && startInput.value ? startInput.value.trim() : "";
      const endValue = endInput && endInput.value ? endInput.value.trim() : "";
      return {
        inputs: { start: startValue, end: endValue },
        range: startValue && endValue ? { start: startValue, end: endValue } : null,
      };
    }

    function populateDateCache() {
      try {
        const { inputs, range } = readDateInputs();
        const bodyText = document.body ? document.body.innerText || "" : "";
        const fallbackRange = range || extractRangeFromBody(bodyText) || {
          start: "-",
          end: "-",
        };

        cache.dateRange = fallbackRange;
        cache.bodyText = bodyText;
        cache.dateInputValues = inputs;
        cache.urlParams = window.location.search || "";
        cache.timestamp = Date.now();
      } catch (err) {
      }
    }

    function parseTables() {
      let pcMin = 0;
      let moMin = 0;
      const daily = [];
      const tables = $$("table");

      tables.forEach((tbl) => {
        const headers = $$("th", tbl).map((th) => th.textContent.trim());
        const idxDate = headers.findIndex((h) => /날짜/i.test(h));
        const idxTotal = headers.findIndex((h) =>
          /전체\s*(참여|재생)\s*시간/i.test(h),
        );
        const idxPC = headers.findIndex((h) =>
          /PC\s*(참여|재생)\s*시간/i.test(h),
        );
        const idxMO = headers.findIndex((h) =>
          /모바일\s*(참여|재생)\s*시간/i.test(h),
        );
        if (idxTotal === -1) return;

        $$("tbody tr", tbl).forEach((tr) => {
          const tds = $$("td", tr);
          if (idxPC !== -1 && idxMO !== -1) {
            const pcValue = hmsToMinutes(tds[idxPC]?.textContent);
            const moValue = hmsToMinutes(tds[idxMO]?.textContent);
            pcMin += pcValue;
            moMin += moValue;
          }
          if (idxTotal !== -1 && idxDate !== -1) {
            const totalText = tds[idxTotal]?.textContent;
            const dateText = (tds[idxDate]?.textContent || "").trim();
            const minutes = hmsToMinutes(totalText);
            if (minutes && /\d{4}-\d{2}-\d{2}/.test(dateText)) {
              daily.push({ date: dateText, minutes });
            }
          }
        });
      });

      return { pcMin, moMin, daily };
    }

    function populateTableCache() {
      try {
        cache.pcMobileData = parseTables();
        cache.timestamp = Date.now();
      } catch (err) {
      }
    }

    function getCachedDateRange() {
      return cache.dateRange;
    }

    function getCachedTableData() {
      return cache.pcMobileData;
    }

    function readCurrentInputSnapshot() {
      const { inputs } = readDateInputs();
      return inputs;
    }

    function isCacheStale() {
      if (!cache.timestamp) return true;
      const currentParams = window.location.search || "";
      if (cache.urlParams && cache.urlParams !== currentParams) return true;
      if (cache.dateInputValues) {
        const snapshot = readCurrentInputSnapshot();
        if (
          snapshot.start !== cache.dateInputValues.start ||
          snapshot.end !== cache.dateInputValues.end
        ) {
          return true;
        }
      }
      return false;
    }

    function invalidateCache() {
      cache.dateRange = null;
      cache.pcMobileData = null;
      cache.bodyText = "";
      cache.dateInputValues = null;
      cache.urlParams = "";
      cache.timestamp = 0;
    }

    function getDateRange() {
      const cached = getCachedDateRange();
      if (cached) return cached;
      const sEl = $(
        'input[name*="start"], input[id*="start"], input[id="sDate"], input[name="startDate"], input[name="srchDtFrom"]',
      );
      const eEl = $(
        'input[name*="end"],   input[id*="end"],   input[id="eDate"], input[name="endDate"],   input[name="srchDtTo"]',
      );
      const s = sEl && sEl.value && sEl.value.trim();
      const e = eEl && eEl.value && eEl.value.trim();
      if (s && e) return { start: s, end: e };

      const heading = document.body.innerText || "";
      const m = heading.match(
        /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*~\s*(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/,
      );
      if (m) {
        const toISO = (Y, M, D) =>
          `${Y}-${String(M).padStart(2, "0")}-${String(D).padStart(2, "0")}`;
        return { start: toISO(m[1], m[2], m[3]), end: toISO(m[4], m[5], m[6]) };
      }
      return { start: "-", end: "-" };
    }

    function computeRangeDays(range) {
      if (
        !range ||
        !range.start ||
        !range.end ||
        range.start === "-" ||
        range.end === "-"
      )
        return null;
      const start = new Date(range.start);
      const end = new Date(range.end);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
      const diff = Math.abs(end - start);
      return Math.max(1, Math.round(diff / (24 * 60 * 60 * 1000)) + 1);
    }

    function formatRangeText(range) {
      if (
        !range ||
        !range.start ||
        !range.end ||
        range.start === "-" ||
        range.end === "-"
      )
        return "-";
      const parse = (iso) => {
        const parts = String(iso).split("-");
        if (parts.length !== 3) return iso;
        const [y, m, d] = parts;
        return `${y}년 ${parseInt(m, 10)}월 ${parseInt(d, 10)}일`;
      };
      if (range.start === range.end) {
        return parse(range.start);
      }
      return `${parse(range.start)} ~ ${parse(range.end)}`;
    }

    function normalizeDateString(value) {
      if (value == null) return null;
      const str = String(value).trim();
      if (!str) return null;
      let match = str.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (match) {
        const [, y, m, d] = match;
        return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      }
      match = str.match(/(\d{4})\s*\.?\s*(\d{1,2})\s*\.?\s*(\d{1,2})/);
      if (match) {
        const [, y, m, d] = match;
        return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      }
      match = str.match(/(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
      if (match) {
        const [, y, m, d] = match;
        return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      }
      match = str.match(/(\d{4})(\d{2})(\d{2})/);
      if (match && str.length === 8) {
        const [, y, m, d] = match;
        return `${y}-${m}-${d}`;
      }
      return null;
    }

    function extractDateCandidate(value, depth = 0) {
      if (depth > 4 || value == null) return null;
      if (typeof value === "string" || typeof value === "number") {
        return normalizeDateString(value);
      }
      if (Array.isArray(value)) {
        for (const item of value) {
          const found = extractDateCandidate(item, depth + 1);
          if (found) return found;
        }
        return null;
      }
      if (typeof value === "object") {
        const preferredKeys = [
          "day",
          "date",
          "DATE",
          "Day",
          "날짜",
          "day_key",
          "date_key",
          "reg_date",
        ];
        for (const key of preferredKeys) {
          if (key in value) {
            const found = extractDateCandidate(value[key], depth + 1);
            if (found) return found;
          }
        }
        for (const val of Object.values(value)) {
          const found = extractDateCandidate(val, depth + 1);
          if (found) return found;
        }
      }
      return null;
    }

    function deriveRangeFromArray(arr) {
      if (!Array.isArray(arr) || !arr.length) return null;
      const dates = [];
      for (const item of arr) {
        const found = extractDateCandidate(item);
        if (found) dates.push(found);
      }
      if (!dates.length) return null;
      dates.sort();
      return { start: dates[0], end: dates[dates.length - 1] };
    }

    function deriveRangeFromDailyList(list) {
      if (!Array.isArray(list) || !list.length) return null;
      const dates = list
        .map((item) => extractDateCandidate(item?.date || item?.day || item))
        .filter(Boolean)
        .sort();
      if (!dates.length) return null;
      return { start: dates[0], end: dates[dates.length - 1] };
    }

    function deriveRangeFromPayload(payload) {
      if (!payload || typeof payload !== "object") return null;
      const candidateArrays = [];
      const table1 = payload.table1 || (payload.data && payload.data.table1);
      const tableAlt = payload.table || (payload.data && payload.data.table);
      const table1Data =
        table1 && Array.isArray(table1.data) ? table1.data : null;
      const tableAltData =
        tableAlt && Array.isArray(tableAlt.data) ? tableAlt.data : null;
      if (Array.isArray(payload.table1)) candidateArrays.push(payload.table1);
      if (Array.isArray(payload.table_1)) candidateArrays.push(payload.table_1);
      if (table1Data) candidateArrays.push(table1Data);
      if (Array.isArray(payload.table)) candidateArrays.push(payload.table);
      if (tableAltData) candidateArrays.push(tableAltData);
      if (Array.isArray(payload.data)) candidateArrays.push(payload.data);
      if (payload.date && typeof payload.date === "object") {
        const values = Object.values(payload.date)
          .map((v) => extractDateCandidate(v))
          .filter(Boolean);
        if (values.length) candidateArrays.push(values);
      }
      let result = null;
      for (const arr of candidateArrays) {
        const range = deriveRangeFromArray(arr);
        if (!range) continue;
        if (!result) {
          result = range;
        } else {
          if (range.start && (!result.start || range.start < result.start))
            result.start = range.start;
          if (range.end && (!result.end || range.end > result.end))
            result.end = range.end;
        }
      }
      if (
        (!result || !result.start || !result.end) &&
        payload.data &&
        payload.data !== payload &&
        typeof payload.data === "object" &&
        !Array.isArray(payload.data)
      ) {
        const nested = deriveRangeFromPayload(payload.data);
        if (nested) {
          if (!result) {
            result = nested;
          } else {
            if (nested.start && (!result.start || nested.start < result.start))
              result.start = nested.start;
            if (nested.end && (!result.end || nested.end > result.end))
              result.end = nested.end;
          }
        }
      }
      return result && result.start && result.end ? result : null;
    }

    function detectViewerMeta(range, loginInfo) {
      const meta = {
        viewerName: "시청자",
        avatarUrl: null,
        range: range && range.start && range.end ? { ...range } : null,
        rangeText: formatRangeText(range),
        rangeDays: computeRangeDays(range),
        viewerNick: null,
        viewerId: null,
        stationNo: null,
        loginFetched: !!loginInfo,
      };
      if (loginInfo) {
        if (loginInfo.nick) {
          meta.viewerName = loginInfo.nick;
          meta.viewerNick = loginInfo.nick;
        }
        if (loginInfo.id) meta.viewerId = loginInfo.id;
        if (loginInfo.stationNo) meta.stationNo = loginInfo.stationNo;
      }
      const nameSelectors = [
        ".mypage_profile .name",
        ".profile_info .name",
        ".user_info strong",
        ".member_wrap .name",
        ".user-name",
        ".user_nick",
        ".top_profile strong",
      ];
      for (const sel of nameSelectors) {
        const node = document.querySelector(sel);
        const text = node && node.textContent && node.textContent.trim();
        if (text) {
          const cleaned = text.replace(/님$/, "").trim();
          meta.viewerName = cleaned || meta.viewerName;
          if (!meta.viewerNick) meta.viewerNick = cleaned;
          break;
        }
      }
      if (!meta.viewerName || meta.viewerName === "시청자") {
        const heading = document.body.innerText || "";
        const match = heading.match(/([가-힣A-Za-z0-9_]+)\s*님/);
        if (match) {
          meta.viewerName = match[1];
          if (!meta.viewerNick) meta.viewerNick = match[1];
        }
      }
      const imgSelectors = [
        ".profileWrap .thumb img",
        "#logArea .thumb img",
        ".userInfo .thumb img",
      ];
      for (const sel of imgSelectors) {
        const node = document.querySelector(sel);
        if (node && node.src) {
          meta.avatarUrl = node.src;
          break;
        }
      }
      return meta;
    }

    function parsePcMobileFromTables() {
      const cached = getCachedTableData();
      if (cached) return cached;
      let pcMin = 0;
      let moMin = 0;
      const daily = [];
      const tables = $$("table");

      tables.forEach((tbl, tableIdx) => {
        const headers = $$("th", tbl).map((th) => th.textContent.trim());

        const idxDate = headers.findIndex((h) => /날짜/i.test(h));
        const idxTotal = headers.findIndex((h) =>
          /전체\s*(참여|재생)\s*시간/i.test(h),
        );
        const idxPC = headers.findIndex((h) =>
          /PC\s*(참여|재생)\s*시간/i.test(h),
        );
        const idxMO = headers.findIndex((h) =>
          /모바일\s*(참여|재생)\s*시간/i.test(h),
        );

        if (idxTotal !== -1) {
          const rows = $$("tbody tr", tbl);

          rows.forEach((tr) => {
            const tds = $$("td", tr);
            if (idxPC !== -1 && idxMO !== -1) {
              const pcText = tds[idxPC]?.textContent;
              const moText = tds[idxMO]?.textContent;
              const pcValue = hmsToMinutes(pcText);
              const moValue = hmsToMinutes(moText);

              pcMin += pcValue;
              moMin += moValue;
            }
            if (idxTotal !== -1 && idxDate !== -1) {
              const totalText = tds[idxTotal]?.textContent;
              const dateText = (tds[idxDate]?.textContent || "").trim();
              const minutes = hmsToMinutes(totalText);
              const dateMatch = /\d{4}-\d{2}-\d{2}/.test(dateText);

              if (minutes && dateMatch) {
                daily.push({ date: dateText, minutes });
              }
            }
          });
        }
      });

      return { pcMin, moMin, daily };
    }

    const stationAvatarCache = new Map();
    const searchAvatarCache = new Map();
    const apiAvatarCache = new Map();
    const avatarDataCache = new Map();
    const categoryImageCache = new Map();
    const categoryPreferenceCache = new Map();

    let categoryListCache = null;
    let loginInfoPromise = null;
    let html2canvasLoader = null;

    function setCategoryListCache(value) {
      categoryListCache = value;
    }

    function setLoginInfoPromise(value) {
      loginInfoPromise = value;
    }

    function setHtml2canvasLoader(value) {
      html2canvasLoader = value;
    }

    function fetchLoginInfo() {
      if (loginInfoPromise) return loginInfoPromise;
      const url = `https://afevent2.sooplive.co.kr/api/get_private_info.php?_=${Date.now()}`;
      const promise = fetch(url, { credentials: "include" })
        .then((resp) => (resp.ok ? resp.json() : null))
        .then((json) => {
          const channel = json && (json.CHANNEL || json.channel);
          if (!channel || !channel.IS_LOGIN) return null;
          return {
            id: channel.LOGIN_ID || null,
            nick: channel.LOGIN_NICK || null,
            hasStation: !!channel.STATION_NO,
            stationNo: channel.STATION_NO || null,
          };
        })
        .catch((err) => {
          return null;
        });
      setLoginInfoPromise(promise);
      return promise;
    }

    function fetchImageAsDataUrl(url) {
      if (!url || typeof GM_xmlhttpRequest !== "function")
        return Promise.resolve(null);
      if (avatarDataCache.has(url)) return avatarDataCache.get(url);

      const promise = new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: "GET",
          url,
          responseType: "arraybuffer",
          timeout: 10000,
          onload: (resp) => {
            if (
              !resp ||
              resp.status < 200 ||
              resp.status >= 300 ||
              !resp.response
            )
              return resolve(null);
            try {
              const bytes = new Uint8Array(resp.response);
              let binary = "";
              for (let i = 0; i < bytes.byteLength; i++)
                binary += String.fromCharCode(bytes[i]);
              const base64 = btoa(binary);
              const mime =
                resp.responseHeaders &&
                /content-type:\s*([^\n]+)/i.exec(resp.responseHeaders);
              const type = mime ? mime[1].trim() : "image/jpeg";
              resolve(`data:${type};base64,${base64}`);
            } catch (err) {
              resolve(null);
            }
          },
          onerror: () => resolve(null),
          ontimeout: () => resolve(null),
        });
      });

      avatarDataCache.set(url, promise);
      return promise;
    }

    const DATE_START_SELECTOR =
      'input[name*="start"], input[id*="start"], input[id="sDate"], input[name="startDate"], input[name="srchDtFrom"]';
    const DATE_END_SELECTOR =
      'input[name*="end"], input[id*="end"], input[id="eDate"], input[name="endDate"], input[name="srchDtTo"]';

    function readLiveDateRange() {
      const startInput = document.querySelector(DATE_START_SELECTOR);
      const endInput = document.querySelector(DATE_END_SELECTOR);
      const start =
        startInput && startInput.value ? startInput.value.trim() : null;
      const end = endInput && endInput.value ? endInput.value.trim() : null;
      if (start && end) return { start, end };
      return null;
    }

    function fetchCategoryList() {
      if (categoryListCache) return categoryListCache;

      const url =
        "https://sch.sooplive.co.kr/api.php?m=categoryList&szKeyword=&szOrder=view_cnt&nPageNo=1&nListCnt=491&nOffset=0&szPlatform=pc";

      const promise = new Promise((resolve) => {
        if (typeof GM_xmlhttpRequest !== "function") {
          return resolve([]);
        }

        GM_xmlhttpRequest({
          method: "GET",
          url,
          timeout: 10000,
          onload: (resp) => {
            try {
              if (!resp || resp.status < 200 || resp.status >= 300) {
                return resolve([]);
              }
              const json = JSON.parse(resp.responseText);
              if (!json || !json.data || !Array.isArray(json.data.list)) {
                return resolve([]);
              }
              resolve(json.data.list);
            } catch (err) {
              resolve([]);
            }
          },
          onerror: (err) => {
            resolve([]);
          },
          ontimeout: () => {
            resolve([]);
          },
        });
      });

      setCategoryListCache(promise);
      return promise;
    }

    async function fetchCategoryImageAsDataUrl(categoryName) {
      const key = String(categoryName || "").trim();
      if (!key) {
        return null;
      }
      if (categoryImageCache.has(key)) {
        return categoryImageCache.get(key);
      }

      const categoryList = await fetchCategoryList();
      if (!categoryList || !categoryList.length) {
        categoryImageCache.set(key, null);
        return null;
      }

      const category = categoryList.find((cat) => cat.category_name === key);
      if (!category) {
        categoryImageCache.set(key, null);
        return null;
      }

      if (!category.cate_img) {
        categoryImageCache.set(key, null);
        return null;
      }

      const dataUrl = await fetchImageAsDataUrl(category.cate_img);

      categoryImageCache.set(key, dataUrl);
      return dataUrl;
    }

    function resolveActiveModule(params) {
      if (params.get("szModule")) return params.get("szModule");
      const activeTab = document.querySelector("#search-type li.on a");
      if (activeTab && activeTab.id) return activeTab.id;
      return "UserLiveWatchTimeData";
    }

    async function fetchCategoryPreferenceTable(rangeOverride = null) {
      const params = new URLSearchParams(window.location.search);
      let szStartDate = params.get("szStartDate") || params.get("startDate") || "";
      let szEndDate = params.get("szEndDate") || params.get("endDate") || "";
      const liveRange = rangeOverride || readLiveDateRange();
      if (liveRange) {
        szStartDate = liveRange.start;
        szEndDate = liveRange.end;
      }

      if (!szStartDate || !szEndDate) {
        const range = getDateRange();
        if (range && range.start && range.end) {
          szStartDate = range.start;
          szEndDate = range.end;
        }
      }

      const moduleKey = resolveActiveModule(params);
      const cacheKey = `${moduleKey}|${szStartDate || "start"}|${
    szEndDate || "end"
  }`;

      if (categoryPreferenceCache.has(cacheKey)) {
        return categoryPreferenceCache.get(cacheKey);
      }

      const request = (async () => {
        if (typeof GM_xmlhttpRequest !== "function") {
          return [];
        }

        let szId = params.get("szId") || params.get("id") || "";
        if (!szId && loginInfoPromise) {
          try {
            const loginInfo = await loginInfoPromise;
            if (loginInfo && loginInfo.id) {
              szId = loginInfo.id;
            }
          } catch (err) {
          }
        }

        const formData = new URLSearchParams();
        formData.append("szModule", "UserLiveSearchKeywordData");
        formData.append("szMethod", "watch");
        if (szStartDate) formData.append("szStartDate", szStartDate);
        if (szEndDate) formData.append("szEndDate", szEndDate);
        formData.append("nPage", "1");
        if (szId) formData.append("szId", szId);

        const apiUrl =
          "https://broadstatistic.sooplive.co.kr/api/watch_statistic.php";

        return new Promise((resolve) => {
          GM_xmlhttpRequest({
            method: "POST",
            url: apiUrl,
            timeout: 10000,
            data: formData.toString(),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              "X-Requested-With": "XMLHttpRequest",
            },
            onload: (resp) => {
              try {
                if (!resp || resp.status < 200 || resp.status >= 300) {
                  return resolve([]);
                }

                if (
                  resp.responseText.trim().startsWith("<!DOCTYPE") ||
                  resp.responseText.trim().startsWith("<html")
                ) {
                  return resolve([]);
                }

                const json = JSON.parse(resp.responseText);

                const table2 = json && json.data && json.data.table2;
                const result =
                  (table2 && Array.isArray(table2.data) && table2.data) || [];
                resolve(result);
              } catch (err) {
                resolve([]);
              }
            },
            onerror: (err) => {
              resolve([]);
            },
            ontimeout: () => {
              resolve([]);
            },
          });
        });
      })();

      categoryPreferenceCache.set(cacheKey, request);
      return request;
    }

    async function prepareTop4CategoriesData(table2Data) {
      if (!table2Data || !Array.isArray(table2Data) || !table2Data.length) {
        return [];
      }

      const top4 = table2Data.slice(0, 4);
      const imageUrls = await Promise.all(
        top4.map((item) => fetchCategoryImageAsDataUrl(item.skey)),
      );

      return top4.map((item, idx) => ({
        name: item.skey,
        count: parseInt(item.cnt, 10) || 0,
        rank: item.rank,
        imageUrl: imageUrls[idx],
      }));
    }

    let uiRefs = null;

    function ensureRefs() {
      if (uiRefs && (!uiRefs.root || !uiRefs.root.isConnected)) {
        uiRefs = null;
      }
      return uiRefs;
    }

    function setUiRefs(refs) {
      uiRefs = refs;
    }

    function getUiRefs() {
      return ensureRefs();
    }

    function showLoadingState() {
      const refs = ensureRefs();
      if (!refs) return;
      const loadingHTML = '<div class="skeleton-loader"></div>';

      if (refs.totalValue) refs.totalValue.innerHTML = loadingHTML;
      if (refs.daysValue) refs.daysValue.innerHTML = loadingHTML;
      if (refs.avgValue) refs.avgValue.innerHTML = loadingHTML;
      if (refs.quickUnique) refs.quickUnique.innerHTML = loadingHTML;
      if (refs.quickPeakLabel) refs.quickPeakLabel.innerHTML = loadingHTML;
      if (refs.quickShareValue) refs.quickShareValue.innerHTML = loadingHTML;
    }

    function clearLoadingState() {
      const refs = ensureRefs();
      if (!refs) return;
      [
        refs.totalValue,
        refs.daysValue,
        refs.avgValue,
        refs.quickUnique,
        refs.quickPeakLabel,
        refs.quickShareValue,
      ].forEach((el) => {
        if (el && el.innerHTML.includes("skeleton-loader")) {
          el.textContent = "-";
        }
      });
    }

    function showCategoryLoadingState() {
      const refs = ensureRefs();
      if (!refs || !refs.categoryThumbnails) return;
      const container = refs.categoryThumbnails;
      container.innerHTML = "";
      for (let i = 0; i < 4; i++) {
        const card = document.createElement("div");
        card.className = "category-card category-card--loading";

        const image = document.createElement("div");
        image.className = "category-card__image skeleton-loader";

        const body = document.createElement("div");
        body.className = "category-card__body";
        body.innerHTML = `
        <div class="skeleton-loader" style="height:16px;width:70%;border-radius:6px;"></div>
        <div class="skeleton-loader" style="height:12px;width:50%;border-radius:6px;"></div>
      `;

        card.appendChild(image);
        card.appendChild(body);
        container.appendChild(card);
      }
    }

    let chartRoot = null;
    let baseStyleInjected = false;
    const deferredLegacyNodes = new Set();
    let loadingMaskApplied = false;

    function attachBaseStyles() {
      if (baseStyleInjected) return;
      const baseStyle = document.createElement("style");
      baseStyle.textContent = `html:not([data-soopplus-ready="1"]) #containchart{opacity:0;}
  html[data-soopplus-mask="1"] body{opacity:0!important;}
  html[data-soopplus-mask="1"] #containchart{display:none!important;}
  section.graph{display:none!important;}
  #containchart .grid-box{display:none!important;}
  #containchart > div:not(.soop-recap-root){display:none!important;}`;
      document.head.appendChild(baseStyle);
      baseStyleInjected = true;
    }

    function initChartRoot() {
      attachBaseStyles();
      const current = document.getElementById("containchart");
      if (!current) return null;
      if (chartRoot !== current) {
        chartRoot = current;
        chartRoot.style.opacity = "0";
        chartRoot.style.transition = "opacity .35s ease";
      }
      attachBaseStyles();
      return chartRoot;
    }

    function getChartRoot() {
      if (chartRoot && chartRoot.isConnected) return chartRoot;
      return initChartRoot();
    }

    function scheduleLegacyRemoval(node, options = {}) {
      if (!node || node.closest(".soop-recap-root")) return;
      const { defer = false } = options;
      if (defer) {
        node.style.setProperty("display", "none", "important");
        deferredLegacyNodes.add(node);
      } else if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }

    function purgeDeferredLegacyNodes() {
      deferredLegacyNodes.forEach((node) => {
        if (node && node.parentNode) {
          node.parentNode.removeChild(node);
        }
      });
      deferredLegacyNodes.clear();
    }

    function applyLoadingMask() {
      loadingMaskApplied = true;
      document.documentElement.setAttribute("data-soopplus-mask", "1");
    }

    function clearLoadingMask() {
      if (!loadingMaskApplied) return;
      document.documentElement.removeAttribute("data-soopplus-mask");
      loadingMaskApplied = false;
    }

    function hideGridBoxes() {
      const root = getChartRoot();
      if (!root) return;
      root.querySelectorAll("div.grid-box").forEach((node) => {
        if (node.closest(".soop-recap-root")) return;
        scheduleLegacyRemoval(node, { defer: true });
      });
    }

    function hideTopAndOthers() {
      const root = getChartRoot();
      if (!root) return;

      let p = root.parentElement;
      while (p && p.previousElementSibling) {
        p = p.previousElementSibling;
        if (!p) break;
        const txt = (p.innerText || "").replace(/\s+/g, " ");
        if (
          /참여\s*시간\s*통계/.test(txt) ||
          /누적\s*참여\s*시간/.test(txt) ||
          /최고\s*참여\s*시간/.test(txt) ||
          /평균\s*참여\s*시간/.test(txt)
        ) {
          scheduleLegacyRemoval(p, { defer: true });
        }
      }

      [...root.children].forEach((el) => {
        if (!el.classList?.contains("soop-recap-root")) {
          scheduleLegacyRemoval(el, { defer: true });
        }
      });

      const tableScope =
        root.closest("section, .cont") || root.parentElement || root;
      tableScope.querySelectorAll("table").forEach((tbl) => {
        if (tbl.closest(".soop-recap-root")) return;
        const headers = Array.from(tbl.querySelectorAll("th")).map((th) =>
          th.textContent.trim(),
        );
        const hasDate = headers.some((h) => /날짜/i.test(h));
        const hasTotal = headers.some((h) => /전체\s*참여\s*시간/i.test(h));
        if (hasDate && hasTotal) {
          const wrap = tbl.closest(".tbl_list, .table, .cont, section, div");
          scheduleLegacyRemoval(wrap || tbl, { defer: true });
        }
      });

      const headingScope = tableScope || root;
      headingScope.querySelectorAll("h2, h3, .tit, .title").forEach((node) => {
        if (node.closest(".soop-recap-root")) return;
        if (/참여\s*방송\s*통계/i.test(node.textContent)) {
          const box = node.closest("section, .cont, div");
          if (box) scheduleLegacyRemoval(box, { defer: false });
        }
      });

      const bottomChart = Array.from(root.children).find((node) => {
        if (!(node instanceof HTMLElement)) return false;
        if (node.classList?.contains("soop-recap-root")) return false;
        const text = (node.textContent || "").replace(/\s+/g, " ");
        const hasDeviceLabel = /PC\s*\/\s*모바일\s*방송/i.test(text);
        const hasTierLabel = /일반\s*\/\s*베스트\s*\/\s*파트너/i.test(text);
        return hasDeviceLabel && hasTierLabel;
      });
      if (bottomChart) scheduleLegacyRemoval(bottomChart, { defer: true });

      root.querySelectorAll(".highcharts-background").forEach((bg) => {
        if (bg.closest(".soop-recap-root")) return;
        bg.setAttribute("fill", "transparent");
        bg.setAttribute("stroke", "none");
      });
      root.querySelectorAll(".highcharts-container").forEach((container) => {
        if (container.closest(".soop-recap-root")) return;
        scheduleLegacyRemoval(container, { defer: true });
      });
      hideGridBoxes();

      const specificIds = [
        "sub-title-1",
        "sub-title-2",
        "broadcast-type",
        "highcharts-0",
        "board1",
        "containchart2",
        "range-date",
      ];
      const hideSpecificElements = () => {
        specificIds.forEach((id) => {
          const target = document.getElementById(id);
          if (target && !target.closest(".soop-recap-root")) {
            scheduleLegacyRemoval(target, { defer: true });
          }
        });
      };
      hideSpecificElements();
      const raf =
        (typeof unsafeWindow !== "undefined" &&
          unsafeWindow.requestAnimationFrame) ||
        (typeof window !== "undefined" && window.requestAnimationFrame) ||
        ((cb) => setTimeout(cb, 16));
      raf(() => setTimeout(hideSpecificElements, 0));
      purgeDeferredLegacyNodes();
    }

    function promoteCustomGraphSection() {
      const root = getChartRoot();
      if (!root) return;
      const host = root.closest("section");
      if (!host) return;
      if (host.classList.contains("custom-graph")) return;
      if (host.classList.contains("graph")) {
        host.classList.remove("graph");
      }
      host.classList.add("custom-graph");
      if (host.style.display === "none") {
        host.style.removeProperty("display");
      }
    }

    const dashboardStyles = `
        .soop-recap-root{max-width:1280px;margin:32px auto;padding:42px 24px 44px;border-radius:34px;
          background:radial-gradient(140% 140% at 50% 0%,#242c45 0%,#0b0d15 65%,#07080d 100%);color:#f6f8ff;
          box-shadow:0 42px 120px rgba(8,11,23,.55);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans KR",sans-serif;
          position:relative;overflow:hidden;}
        .soop-recap-root::before{content:"";position:absolute;top:-160px;right:-120px;width:340px;height:340px;
          background:radial-gradient(70% 70% at 50% 50%,rgba(120,149,255,.5) 0%,rgba(120,149,255,0) 70%);opacity:.55;pointer-events:none;}
        .soop-recap{display:flex;flex-direction:column;gap:36px;position:relative;z-index:1;}
        .viewer-summary{display:flex;align-items:center;gap:22px;padding:26px 32px;border-radius:28px;
          background:linear-gradient(140deg,rgba(124,140,255,.32),rgba(49,60,108,.28));border:1px solid rgba(158,173,255,.42);
          box-shadow:0 26px 52px rgba(12,16,28,.42);}
        .viewer-summary__info{display:flex;align-items:center;gap:18px;min-width:0;}
        .viewer-summary__avatar{width:76px;height:76px;border-radius:22px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;
          font-size:28px;font-weight:700;color:#f6f7ff;box-shadow:0 18px 36px rgba(10,14,28,.32);}
        .viewer-summary__avatar.has-image{background-size:cover;background-position:center;background-repeat:no-repeat;border:3px solid rgba(255,255,255,.6);}
        .viewer-summary__text{display:flex;flex-direction:column;gap:6px;}
        .viewer-summary__name{font-size:clamp(22px,2.1vw,30px);font-weight:800;letter-spacing:-.01em;color:#ffffff;line-height:1.1;}
        .viewer-summary__range{font-size:clamp(12px,1.05vw,15px);color:rgba(214,220,255,.78);font-weight:600;}
        .recap__hero{display:flex;gap:20px;align-items:stretch;}
        .stat-card{flex:1;background:linear-gradient(135deg,rgba(127,149,255,.32),rgba(78,97,235,.18));
          border:1px solid rgba(159,177,255,.45);border-radius:26px;padding:28px 30px;box-shadow:0 24px 56px rgba(24,32,76,.45);
          backdrop-filter:blur(18px);display:flex;flex-direction:column;justify-content:center;gap:8px;}
        .stat-card__label{font-size:clamp(13px,1.2vw,15px);font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(224,228,255,.75);}
        .stat-card__value{font-size:clamp(20px,2.0vw,30px);font-weight:800;letter-spacing:-.02em;color:#ffffff;line-height:1.08;}
        .stat-card__sub{font-size:clamp(10px,1.0vw,12px);color:rgba(214,220,255,.78);}
        .recap__section{display:flex;flex-direction:column;gap:20px;}
        .recap__section-header{display:flex;justify-content:space-between;align-items:flex-end;gap:14px;}
        .recap__section-header h2{margin:0;font-size:22px;font-weight:700;color:#ffffff;}
        .recap__section-sub{font-size:14px;color:rgba(208,214,247,.66);}
        .streamer-grid{--streamer-card-base-height:320px;display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1.3fr) minmax(0,1fr);
          grid-auto-rows:var(--streamer-card-base-height);gap:12px;align-items:stretch;padding:0;}
        .streamer-grid__slot{display:flex;flex-direction:column;height:100%;min-height:0;}
        .streamer-grid__slot--first{grid-column:1;}
        .streamer-grid__slot--second{grid-column:2;}
        .streamer-grid__slot--stack{grid-column:3;display:flex;flex-direction:column;gap:10px;}
        .streamer-grid__slot--stack .streamer-card{width:100%;aspect-ratio:1/1;height:auto;min-height:0;}
        .streamer-card{position:relative;background:var(--tile-gradient,linear-gradient(135deg,#5661f6,#8a6dfd));
          border-radius:24px;padding:26px 24px 30px;display:flex;flex-direction:column;align-items:center;gap:16px;
          color:#fff;box-shadow:0 26px 52px rgba(14,16,34,.42);overflow:hidden;height:100%;min-height:0;}
        .streamer-card::before{content:"";position:absolute;inset:0;background:linear-gradient(150deg,rgba(255,255,255,.18),rgba(0,0,0,.38));opacity:.4;}
        .streamer-card>*{position:relative;z-index:1;}
        .streamer-card--rank-1{padding:38px 32px 36px;align-items:center;}
        .streamer-card--rank-2{padding:52px 26px 32px;align-items:center;}
        .streamer-card--rank-3,
        .streamer-card--rank-4{padding:22px 20px;justify-content:center;align-items:center;}
        .streamer-card__avatar{width:96px;height:96px;border-radius:50%;background:rgba(255,255,255,.24);display:flex;align-items:center;justify-content:center;
          flex-shrink:0;font-size:32px;font-weight:700;color:#f6f7ff;box-shadow:0 18px 34px rgba(10,14,30,.32);}
        .streamer-card__avatar.has-image{background-size:cover;background-position:center;background-repeat:no-repeat;border:3px solid rgba(255,255,255,.72);}
        .streamer-card__body{display:flex;flex-direction:column;gap:8px;align-items:center;text-align:center;}
        .streamer-card__name{font-size:clamp(20px,1.9vw,28px);font-weight:800;letter-spacing:-.01em;line-height:1.15;}
        .streamer-card__minutes{font-size:clamp(17px,1.6vw,22px);font-weight:700;}
        .streamer-card__minutes-sub{font-size:clamp(12px,1vw,14px);color:rgba(236,238,255,.75);}
        .streamer-card--rank-1 .streamer-card__avatar{width:130px;height:130px;font-size:44px;}
        .streamer-card--rank-2 .streamer-card__avatar{width:112px;height:112px;font-size:36px;}
        .streamer-card--rank-3 .streamer-card__avatar,
        .streamer-card--rank-4 .streamer-card__avatar{width:75px;height:75px;font-size:32px;}
        .streamer-card--rank-1 .streamer-card__body{align-items:center;text-align:center;}
        .streamer-card--rank-1 .streamer-card__name{font-size:clamp(24px,2.1vw,30px);}
        .streamer-card--rank-1 .streamer-card__minutes{font-size:clamp(20px,1.8vw,22px);}
        .streamer-card--rank-2 .streamer-card__name{font-size:clamp(20px,1.6vw,26px);}
        .streamer-card--rank-2 .streamer-card__minutes{font-size:clamp(18px,1.8vw,20px);}
        .streamer-card--rank-2 .streamer-card__body,
        .streamer-card--rank-3 .streamer-card__body,
        .streamer-card--rank-4 .streamer-card__body{gap:6px;align-items:center;text-align:center;}
        .streamer-card--rank-3 .streamer-card__name,
        .streamer-card--rank-4 .streamer-card__name{font-size:clamp(18px,1.6vw,20px);}
        .streamer-card--rank-3 .streamer-card__minutes,
        .streamer-card--rank-4 .streamer-card__minutes{font-size:14px;}
        .streamer-card--rank-3 .streamer-card__minutes-sub,
        .streamer-card--rank-4 .streamer-card__minutes-sub{display:none;}
        .streamer-card--empty{background:rgba(255,255,255,.07);color:#c7cad6;align-items:center;justify-content:center;text-align:center;min-height:150px;}
        .streamer-card--empty::before{display:none;}
        .recap__section--categories{padding-bottom:12px;}
        .category-grid{--category-grid-gap:26px;display:flex;gap:var(--category-grid-gap);align-items:stretch;justify-content:space-between;flex-wrap:nowrap;}
        .category-card{position:relative;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(105,121,255,.06));
          border:1px solid rgba(167,182,255,.35);border-radius:26px;padding:0;display:flex;flex-direction:column;overflow:hidden;
          transition:all .2s ease;box-shadow:0 20px 52px rgba(16,22,33,.38);min-height:var(--category-card-min-height,280px);
          flex:1 1 calc((100% - (var(--category-grid-gap) * 3)) / 4);max-width:320px;}
        .category-card:hover{transform:translateY(-4px);box-shadow:0 26px 58px rgba(16,22,33,.5);border-color:rgba(167,182,255,.65);}
        .category-card__image{position:relative;width:100%;padding-top:var(--category-card-image-ratio,133.67%);flex-shrink:0;overflow:hidden;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);}
        .category-card__image-inner{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:center;display:block;}
        .category-card__image-fallback{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:700;color:#505366;background:rgba(224,224,224,.8);}
        .category-card__body{padding:18px 20px;display:flex;flex-direction:column;gap:10px;background:rgba(10,12,18,.4);}
        .category-card__name{font-size:15px;font-weight:700;color:#ffffff;line-height:1.3;}
        .category-card__count{font-size:13px;font-weight:600;color:rgba(214,220,255,.78);}
        .category-card--empty{background:rgba(255,255,255,.05);color:#c7cad6;align-items:center;justify-content:center;text-align:center;min-height:100px;padding:20px;}
        .category-card--loading{opacity:.7;pointer-events:none;}
        .recap__quick{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;}
        .quick-card{background:linear-gradient(145deg,rgba(255,255,255,.16),rgba(105,121,255,.08));border:1px solid rgba(167,182,255,.4);
          border-radius:26px;padding:22px 24px;display:flex;flex-direction:column;gap:10px;min-height:140px;box-shadow:0 18px 48px rgba(16,22,33,.32);
          backdrop-filter:blur(14px);}
        .quick-card__label{font-size:14px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(224,228,255,.7);}
        .quick-card__value{font-size:28px;font-weight:800;color:#ffffff;}
        .quick-card__sub{font-size:14px;color:rgba(211,216,242,.78);}
        .recap__charts{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:36px;}
        .chart-card{background:linear-gradient(160deg,rgba(19,23,33,.92),rgba(10,12,18,.86));border:1px solid rgba(120,138,207,.24);
          border-radius:28px;padding:28px 30px;display:flex;flex-direction:column;gap:20px;box-shadow:0 30px 60px rgba(7,9,19,.5);}
        .chart-card--wide{grid-column:1 / -1;}
        .chart-card__title{margin:0;font-size:18px;font-weight:700;color:#f2f4ff;}
        .chart{width:100%;height:360px;}
        .chart--compact{height:300px;}
        .chart--tall{height:420px;}
        .chart-legend{display:flex;gap:18px;align-items:center;margin-top:6px;font-size:13px;color:rgba(226,232,255,.8);}
        .chart-legend__item{display:flex;align-items:center;gap:6px;}
        .chart-legend__swatch{width:12px;height:12px;border-radius:50%;}
        .skeleton-loader{background:linear-gradient(90deg,rgba(255,255,255,.08) 25%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.08) 75%);
          background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:8px;min-height:1em;}
        @keyframes shimmer{0%{background-position:200% 0;}100%{background-position:-200% 0;}}
        .loading-spinner{display:inline-block;width:20px;height:20px;border:3px solid rgba(255,255,255,.2);
          border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .export-button{position:fixed;bottom:32px;right:32px;padding:16px 28px;background:linear-gradient(135deg,#6a77ff,#7d8dff);border:none;
          border-radius:24px;color:#fff;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:10px;
          box-shadow:0 12px 36px rgba(106,119,255,.45);transition:all .25s ease;z-index:10000;backdrop-filter:blur(12px);}
        .export-button:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(106,119,255,.6);background:linear-gradient(135deg,#7d8dff,#8a9dff);}
        .export-button:active{transform:translateY(-1px);box-shadow:0 8px 24px rgba(106,119,255,.4);}
        .export-button svg{width:20px;height:20px;fill:currentColor;}
        .export-button--hide-for-capture{display:none!important;}
        .soop-capture-notification{position:fixed;top:24px;right:24px;padding:16px 24px;background:linear-gradient(135deg,rgba(20,24,38,.98),rgba(14,18,28,.98));
          border:1px solid rgba(120,138,255,.4);border-radius:16px;color:#f7f9ff;font-size:14px;font-weight:600;box-shadow:0 12px 42px rgba(8,12,24,.65);
          z-index:99999;animation:slideIn .3s ease-out;backdrop-filter:blur(12px);}
        .soop-capture-notification.success{border-color:rgba(84,222,195,.6);background:linear-gradient(135deg,rgba(20,42,38,.98),rgba(14,32,28,.98));}
        .soop-capture-notification.error{border-color:rgba(255,107,106,.6);background:linear-gradient(135deg,rgba(42,20,20,.98),rgba(32,14,14,.98));}
        @keyframes slideIn{from{transform:translateX(400px);opacity:0;}to{transform:translateX(0);opacity:1;}}
        @media(max-width:1080px){
          .viewer-summary{flex-direction:column;align-items:flex-start;padding:24px 24px;gap:18px;}
          .viewer-summary__avatar{width:72px;height:72px;}
          .recap__hero{flex-direction:column;}
          .streamer-grid{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:var(--streamer-card-base-height);}
          .streamer-grid__slot--first{grid-column:1 / -1;}
          .streamer-grid__slot--second{grid-column:1;}
          .streamer-grid__slot--stack{grid-column:2;}
          .category-grid{justify-content:center;flex-wrap:wrap;gap:22px;}
          .category-card{flex:1 1 320px;max-width:360px;}
          .recap__charts{grid-template-columns:1fr;}
          .chart-card--wide{grid-column:auto;}
        }
        @media(max-width:720px){
          .soop-recap-root{padding:28px 22px;border-radius:26px;}
          .viewer-summary{padding:22px 20px;}
          .viewer-summary__avatar{width:64px;height:64px;}
          .streamer-grid{grid-template-columns:1fr;grid-auto-rows:auto;}
          .streamer-grid__slot{grid-column:auto;height:auto;}
          .streamer-grid__slot--stack{flex-direction:row;flex-wrap:wrap;gap:8px;}
          .streamer-grid__slot--stack .streamer-card{aspect-ratio:auto;width:calc(50% - 4px);}
          .category-grid{justify-content:flex-start;}
          .category-card{flex:1 1 100%;max-width:none;}
          .recap__charts{gap:18px;}
          .chart{height:280px;}
        }
`;

    const chartStyles = `
        .soop-recap-root .highcharts-background{fill:transparent!important;stroke:none!important;}
`;

    const dashboardTemplate = `

      <div class="soop-recap" role="main" aria-label="SOOP 시청 통계 대시보드">
        <section class="viewer-summary" aria-label="시청자 정보">
          <div class="viewer-summary__info">
            <div class="viewer-summary__avatar" data-ref="avatar" role="img" aria-label="시청자 프로필">시청</div>
            <div class="viewer-summary__text">
              <span class="viewer-summary__name" data-ref="viewer-name" aria-label="시청자 이름">시청자님</span>
              <span class="viewer-summary__range" data-ref="range-text" aria-label="조회 기간">-</span>
            </div>
          </div>
        </section>
        <section class="recap__hero" aria-label="주요 통계">
          <div class="stat-card" role="region" aria-label="총 시청 시간">
            <span class="stat-card__label">총 시청 시간</span>
            <span class="stat-card__value" data-ref="stat-total-value" aria-live="polite">-</span>
            <span class="stat-card__sub" data-ref="stat-total-sub">-</span>
          </div>
          <div class="stat-card" role="region" aria-label="출석일">
            <span class="stat-card__label">출석일</span>
            <span class="stat-card__value" data-ref="stat-days-value" aria-live="polite">-</span>
            <span class="stat-card__sub" data-ref="stat-days-sub">-</span>
          </div>
          <div class="stat-card" role="region" aria-label="평균 시청시간">
            <span class="stat-card__label">평균 시청시간</span>
            <span class="stat-card__value" data-ref="stat-avg-value" aria-live="polite">-</span>
<!--            <span class="stat-card__sub" data-ref="stat-avg-sub">-</span>-->
          </div>
        </section>

        <section class="recap__section" aria-labelledby="top-streamers-heading">
          <div class="recap__section-header">
            <h2 id="top-streamers-heading">많이 본 방송</h2>
          </div>
          <div class="streamer-grid" data-ref="top-streamers" role="list"></div>
        </section>

        <section class="recap__quick">
          <div class="quick-card">
            <span class="quick-card__label">시청 스트리머 수</span>
            <span class="quick-card__value" data-ref="quick-unique">-</span>
            <span class="quick-card__sub">이번 기간</span>
          </div>
          <div class="quick-card">
            <span class="quick-card__label">최다 시청일</span>
            <span class="quick-card__value" data-ref="quick-peak-label">-</span>
            <span class="quick-card__sub" data-ref="quick-peak-value">-</span>
          </div>
          <div class="quick-card">
            <span class="quick-card__label">최고 시청 점유율</span>
            <span class="quick-card__value" data-ref="quick-share-value">-</span>
            <span class="quick-card__sub" data-ref="quick-share-sub">-</span>
          </div>
        </section>

        <section class="recap__section recap__charts">
          <div class="chart-card chart-card--wide">
            <h3 class="chart-card__title">스트리머별 시청 시간</h3>
            <div id="soop-plus-chart-bar" class="chart chart--tall"></div>
          </div>
          <div class="chart-card">
            <h3 class="chart-card__title">일자별 총 시청 시간</h3>
            <div id="soop-plus-chart-daily" class="chart"></div>
          </div>
          <div class="chart-card">
            <h3 class="chart-card__title">시청 환경 (PC vs 모바일)</h3>
            <div id="soop-plus-chart-donut" class="chart chart--compact"></div>
            <div class="chart-legend">
              <div class="chart-legend__item"><span class="chart-legend__swatch" style="background:#89A7FF;"></span>데스크톱</div>
              <div class="chart-legend__item"><span class="chart-legend__swatch" style="background:#54DEC3;"></span>모바일</div>
            </div>
          </div>
        </section>

        <section class="recap__section recap__section--categories">
          <div class="recap__section-header">
            <h2 id="categories-heading">선호 카테고리</h2>
          </div>
          <div class="category-grid" data-ref="category-thumbnails" role="list"></div>
        </section>
      </div>
`;

    function getInitials(name) {
      const cleaned = String(name || "").trim();
      if (!cleaned) return "-";
      const korean = cleaned.match(/[\uac00-\ud7af]/g);
      if (korean && korean.length) return korean.slice(0, 2).join("");
      const alpha = cleaned.replace(/\s+/g, "");
      return alpha.slice(0, 2).toUpperCase();
    }

    function normalizeUrl(url) {
      if (typeof url !== "string") return null;
      const trimmed = url.trim();
      if (!trimmed) return null;
      if (/^https?:/i.test(trimmed)) return trimmed;
      if (trimmed.startsWith("//")) return `${location.protocol}${trimmed}`;
      if (trimmed.startsWith("/")) return `${location.origin}${trimmed}`;
      return trimmed;
    }

    function resolveProfileImage(entry) {
      if (!entry || typeof entry !== "object") return null;
      const candidates = [
        entry.profile_image,
        entry.profileImage,
        entry.profile_img,
        entry.bj_profile_image,
        entry.bj_profile_img,
        entry.bj_image,
        entry.image_url,
        entry.img_url,
      ];
      for (const candidate of candidates) {
        const normalized = normalizeUrl(candidate);
        if (normalized) return normalized;
      }
      const id = entry.bj_id || entry.user_id || entry.id || entry.uid;
      if (id) {
        return `https://profile.sooplive.co.kr/${id}.png`;
      }
      return null;
    }

    function resolveStationId(entry) {
      if (!entry || typeof entry !== "object") return null;
      const sources = [
        entry.id,
        entry.stationId,
        entry.station_id,
        entry.bj_id,
        entry.bjId,
        entry.bj_user_id,
        entry.user_id,
        entry.uid,
        entry.raw && entry.raw.bj_id,
        entry.raw && entry.raw.bjId,
        entry.raw && entry.raw.bj_user_id,
        entry.raw && entry.raw.bj_userid,
        entry.raw && entry.raw.userid,
        entry.raw && entry.raw.user_id,
        entry.raw && entry.raw.id,
        entry.raw && entry.raw.uid,
        entry.raw && entry.raw.station_id,
        entry.raw && entry.raw.stationId,
      ];
      for (const candidate of sources) {
        if (candidate) return String(candidate).trim();
      }
      return null;
    }

    function fetchStationAvatar(id) {
      const key = String(id || "").trim();
      if (!key) return Promise.resolve(null);
      if (stationAvatarCache.has(key)) {
        return stationAvatarCache.get(key);
      }
      const req = fetch(
        `https://www.sooplive.co.kr/station/${encodeURIComponent(key)}`,
        { credentials: "include" },
      )
        .then((resp) => (resp.ok ? resp.text() : ""))
        .then((html) => {
          if (!html) return null;
          const meta =
            html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
            html.match(/name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
          const resolved = meta ? normalizeUrl(meta[1]) : null;
          return resolved;
        })
        .catch((err) => {
          return null;
        });
      stationAvatarCache.set(key, req);
      return req;
    }

    function applyAvatarImage(node, url, fallbackText) {
      if (!node) return;
      if (!url) {
        node.classList.remove("has-image");
        node.style.backgroundImage = "";
        node.textContent = fallbackText || getInitials(node.dataset.name || "?");
        return;
      }
      node.dataset.avatarSource = url;
      node.classList.remove("has-image");
      node.style.backgroundImage = "";
      node.textContent = fallbackText || getInitials(node.dataset.name || "?");
      const img = new Image();
      img.onload = () => {
        node.style.backgroundImage = `url("${url}")`;
        node.classList.add("has-image");
        node.textContent = "";
      };
      img.onerror = () => {
        node.classList.remove("has-image");
        node.style.backgroundImage = "";
        node.textContent = fallbackText || getInitials(node.dataset.name || "?");
      };
      img.src = url;
    }

    async function hydrateAvatarParallel(
      node,
      fallbackText,
      stationId,
      nickname,
    ) {
      if (!node || node.classList.contains("has-image")) return;

      const promises = [];
      if (stationId) promises.push(fetchStationAvatar(stationId));
      if (nickname) {
        promises.push(fetchSearchAvatar(nickname));
        promises.push(fetchSearchApiAvatar(nickname));
      }
      if (!promises.length) return;

      try {
        const results = await Promise.allSettled(promises);
        const firstSuccess = results.find(
          (r) => r.status === "fulfilled" && r.value,
        );

        if (firstSuccess && !node.classList.contains("has-image")) {
          applyAvatarImage(node, firstSuccess.value, fallbackText);
        }
      } catch (err) {
      }
    }

    function promiseAnyCompat(promises) {
      if (typeof Promise.any === "function") {
        return Promise.any(promises);
      }
      return new Promise((resolve, reject) => {
        let rejected = 0;
        const errors = [];
        const total = promises.length;
        promises.forEach((p, idx) => {
          Promise.resolve(p)
            .then(resolve)
            .catch((err) => {
              errors[idx] = err;
              rejected++;
              if (rejected === total) {
                const aggregate = new Error("All promises were rejected");
                aggregate.errors = errors;
                reject(aggregate);
              }
            });
        });
      });
    }

    async function hydrateAvatarAny(
      node,
      fallbackText,
      stationId,
      nickname,
    ) {
      if (!node || node.classList.contains("has-image")) return;

      const sources = [];
      const wrap = (promise, source) =>
        promise.then((url) => {
          if (!url) throw new Error(`No ${source} avatar`);
          return { source, url };
        });

      if (stationId) {
        sources.push(wrap(fetchStationAvatar(stationId), "station"));
      }
      if (nickname) {
        sources.push(wrap(fetchSearchAvatar(nickname), "search"));
        sources.push(wrap(fetchSearchApiAvatar(nickname), "api"));
      }
      if (!sources.length) return;

      try {
        const result = await promiseAnyCompat(sources);
        if (result && result.url && !node.classList.contains("has-image")) {
          applyAvatarImage(node, result.url, fallbackText);
        }
      } catch (err) {
        if (node && !node.dataset.viewerAvatarWarned) {
          console.warn("[SOOP+] Viewer avatar lookup failed; retrying sequentially.");
          node.dataset.viewerAvatarWarned = "1";
        }
        await hydrateAvatarParallel(node, fallbackText, stationId, nickname);
      }
    }

    function fetchSearchAvatar(nickname) {
      const key = String(nickname || "").trim();
      if (!key) return Promise.resolve(null);
      if (searchAvatarCache.has(key)) return searchAvatarCache.get(key);
      const url = `https://www.sooplive.co.kr/search?szSearchType=streamer&szKeyword=${encodeURIComponent(
    key,
  )}&szStype=di&szActype=input_field&rs=1&szVideoFileType=ALL&has_hint=&pk_cnt=&location=total_search`;
      const req = fetch(url, { credentials: "include" })
        .then((resp) => (resp.ok ? resp.text() : ""))
        .then((html) => {
          if (!html) return null;
          let doc = null;
          try {
            doc = new DOMParser().parseFromString(html, "text/html");
          } catch {
            return null;
          }
          const normalizedTarget = key.replace(/\s+/g, "").toLowerCase();
          const candidates = Array.from(
            doc.querySelectorAll("a[href*='/station/']"),
          );
          for (const anchor of candidates) {
            const text = (anchor.textContent || "")
              .replace(/\s+/g, "")
              .toLowerCase();
            if (!text) continue;
            if (
              text.includes(normalizedTarget) ||
              normalizedTarget.includes(text)
            ) {
              const img = anchor.querySelector("img");
              if (img) {
                const src = normalizeUrl(
                  img.getAttribute("src") || img.dataset?.src || "",
                );
                if (src) return src;
              }
            }
          }
          return null;
        })
        .catch((err) => {
          return null;
        });
      searchAvatarCache.set(key, req);
      return req;
    }

    function fetchSearchApiAvatar(nickname) {
      const key = String(nickname || "").trim();
      if (!key) return Promise.resolve(null);
      if (apiAvatarCache.has(key)) return apiAvatarCache.get(key);
      const url = `https://sch.sooplive.co.kr/api.php?l=DF&m=bjSearch&v=3.0&szOrder=score&szKeyword=${encodeURIComponent(
    key,
  )}`;
      const req = fetch(url, { credentials: "include" })
        .then((resp) => (resp.ok ? resp.json() : null))
        .then((json) => {
          if (!json) return null;
          const list = Array.isArray(json.data)
            ? json.data
            : Array.isArray(json.DATA)
              ? json.DATA
              : [];
          if (!list.length) return null;
          const normalizedTarget = key.replace(/\s+/g, "").toLowerCase();
          for (const item of list) {
            const stationName = String(item.station_name || "").trim();
            const bjNick = String(item.bj_nick || item.user_nick || "").trim();
            const stationLogo = normalizeUrl(
              item.station_logo || item.logo || item.profile_img_file || "",
            );
            const normalizedStation = stationName.replace(/\s+/g, "").toLowerCase();
            const normalizedNick = bjNick.replace(/\s+/g, "").toLowerCase();
            if (!stationLogo) continue;
            if (
              normalizedStation === normalizedTarget ||
              normalizedNick === normalizedTarget ||
              normalizedTarget.includes(normalizedStation) ||
              normalizedStation.includes(normalizedTarget)
            ) {
              return stationLogo;
            }
          }
          return null;
        })
        .catch((err) => {
          return null;
        });
      apiAvatarCache.set(key, req);
      return req;
    }

    const MODULE_URLS = {
      core:
        "https://static.sooplive.co.kr/asset/library/highcharts/js/highcharts.js",
      exporting:
        "https://static.sooplive.co.kr/asset/library/highcharts/js/modules/exporting.js",
      "offline-exporting":
        "https://static.sooplive.co.kr/asset/library/highcharts/js/modules/offline-exporting.js",
      treemap:
        "https://static.sooplive.co.kr/asset/library/highcharts/js/modules/treemap.js",
    };

    const MODULE_READY = {
      core: () => typeof unsafeWindow.Highcharts !== "undefined",
      exporting: () => {
        const H = unsafeWindow.Highcharts;
        return !!(H && H.Chart && typeof H.Chart.prototype.exportChart === "function");
      },
      "offline-exporting": () => {
        const H = unsafeWindow.Highcharts;
        return !!(
          H &&
          H.Chart &&
          typeof H.Chart.prototype.exportChartLocal === "function"
        );
      },
      treemap: () => {
        const H = unsafeWindow.Highcharts;
        return !!(H && H.seriesTypes && H.seriesTypes.treemap);
      },
    };

    const pendingLoads = new Map();
    const POLL_INTERVAL_MS = 50;
    const INJECT_DELAY_MS = 250;

    function ensureModule(name) {
      if (pendingLoads.has(name)) return pendingLoads.get(name);

      const readyCheck = MODULE_READY[name] || (() => true);
      const url = MODULE_URLS[name];

      const promise = new Promise((resolve, reject) => {
        if (readyCheck()) {
          resolve();
          return;
        }

        let injected = false;
        const start = Date.now();
        const poll = () => {
          if (readyCheck()) {
            resolve();
            return;
          }
          if (!injected && url && Date.now() - start >= INJECT_DELAY_MS) {
            injected = true;
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
            return;
          }
          setTimeout(poll, POLL_INTERVAL_MS);
        };
        poll();
      });

      pendingLoads.set(name, promise);
      return promise;
    }

    const loadModule = (name) => ensureModule(name);

    function applyReadyAttributes() {
      if (document.body) {
        document.body.setAttribute("data-soopplus-ready", "1");
      }
      document.documentElement.setAttribute("data-soopplus-ready", "1");
    }

    function notifyLoaded() {
      if (document.body) {
        applyReadyAttributes();
      } else {
        document.addEventListener(
          "DOMContentLoaded",
          () => {
            applyReadyAttributes();
          },
          { once: true },
        );
      }
    }

    function ensureHtml2Canvas() {
      if (html2canvasLoader) return html2canvasLoader;
      const loader = new Promise((resolve, reject) => {
        // html2canvas is loaded via @require in userscript metadata
        if (typeof html2canvas !== "undefined") {
          return resolve(html2canvas);
        }
        // Fallback: check window/unsafeWindow
        const lib = window.html2canvas || unsafeWindow.html2canvas;
        if (lib) {
          return resolve(lib);
        }
        reject(new Error("html2canvas not available"));
      });
      setHtml2canvasLoader(loader);
      return loader;
    }

    async function prepareAvatarsForCapture(root) {
      if (!root) return;
      const avatars = root.querySelectorAll("[data-avatar-source]");

      const jobs = Array.from(avatars).map(async (avatar, idx) => {
        if (!avatar || avatar.dataset.capturePrepared === "1") return;
        const source = avatar.dataset.avatarSource;
        if (!source) {
          return;
        }

        try {
          const dataUrl = await fetchImageAsDataUrl(source);
          if (dataUrl) {
            avatar.style.backgroundImage = `url("${dataUrl}")`;
            avatar.dataset.capturePrepared = "1";
          } else {
            avatar.dataset.capturePrepared = "0";
          }
        } catch (err) {
          avatar.dataset.capturePrepared = "0";
        }
      });
      await Promise.all(jobs);
    }

    async function captureDashboard(root) {
      if (!root) return;

      const notification = document.createElement("div");
      notification.className = "soop-capture-notification";
      notification.textContent = "대시보드 캡처 중...";
      document.body.appendChild(notification);

      const exportBtn = document.getElementById("soop-export-btn");
      if (exportBtn) {
        exportBtn.classList.add("export-button--hide-for-capture");
      }

      try {
        await prepareAvatarsForCapture(root);

        const html2canvas = await ensureHtml2Canvas();
        if (!html2canvas) {
          throw new Error("html2canvas 라이브러리를 로드할 수 없습니다.");
        }

        const canvas = await html2canvas(root, {
          backgroundColor: "#0b0d15",
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: DEBUG,
          removeContainer: true,
          imageTimeout: 15000,
          onclone: (clonedDoc) => {
            const clonedAvatars =
              clonedDoc.querySelectorAll("[data-avatar-source]");
            clonedAvatars.forEach((avatar) => {
              if (avatar.dataset.capturePrepared !== "1") {
                avatar.style.backgroundImage = "";
                avatar.classList.remove("has-image");
              }
            });
          },
        });

        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        const stamp = new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[T:]/g, "-");
        link.href = dataUrl;
        link.download = `Recap-${stamp}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        notification.textContent = "PNG 다운로드 완료!";
        notification.classList.add("success");
        setTimeout(() => notification.remove(), 2000);
      } catch (err) {
        notification.textContent =
          "캡처 실패: " + (err && err.message ? err.message : "알 수 없는 오류");
        notification.classList.add("error");
        setTimeout(() => notification.remove(), 3000);
      } finally {
        if (exportBtn) {
          exportBtn.classList.remove("export-button--hide-for-capture");
        }
      }
    }

    /**
     * Animation utilities
     *
     * Extract from index.js lines 73-119:
     * - animateCountUp
     */


    function animateCountUp(
      element,
      targetValue,
      duration = 800,
      formatter = null,
    ) {
      if (!element) return;

      const startValue = 0;
      const startTime = performance.now();
      const isMinutes = typeof targetValue === "number" && targetValue > 0;

      function easeOutQuad(t) {
        return t * (2 - t);
      }

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuad(progress);

        if (isMinutes) {
          const currentValue = Math.floor(
            startValue + (targetValue - startValue) * easedProgress,
          );
          element.textContent = formatter
            ? formatter(currentValue)
            : minutesToText(currentValue);
        } else {
          element.textContent = formatter ? formatter(targetValue) : targetValue;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.textContent = formatter
            ? formatter(targetValue)
            : isMinutes
              ? minutesToText(targetValue)
              : targetValue;
        }
      }

      requestAnimationFrame(update);
    }

    const streamerCardBodyTemplate = (
      name,
      minutesLabel,
      minutesSubText,
    ) => `
      <span class="streamer-card__name">${name}</span>
      <span class="streamer-card__minutes">${minutesLabel}</span>
      <span class="streamer-card__minutes-sub">${minutesSubText}</span>
    `;

    async function renderTopStreamers(container, totals) {
      if (!container) return;
      container.innerHTML = "";
      const renderToken = Symbol("streamersRender");
      container.__soopStreamersRenderToken = renderToken;
      if (Array.isArray(totals)) {
        totals.forEach((entry) => {
          if (entry && entry.theme) delete entry.theme;
        });
      }
      const featured = (totals || [])
        .filter((t) => t && t.name && t.name !== "기타")
        .slice(0, 4);
      if (!featured.length) {
        const empty = document.createElement("div");
        empty.className = "streamer-card streamer-card--empty";
        empty.textContent = "시청 데이터가 부족합니다.";
        container.appendChild(empty);
        return;
      }

      const themeSelections = selectRandomThemes(featured.length);
      featured.forEach((entry, idx) => {
        if (!entry) return;
        const theme = themeSelections[idx] || null;
        entry.theme = theme ? { ...theme } : null;
      });

      const cards = await Promise.all(
        featured.map((entry, idx) => createStreamerCardAsync(entry, idx)),
      );
      if (container.__soopStreamersRenderToken !== renderToken) {
        return;
      }
      const fragment = document.createDocumentFragment();
      const slots = buildStreamerSlots(cards);
      slots.forEach((slot) => fragment.appendChild(slot));
      container.appendChild(fragment);
    }

    async function createStreamerCardAsync(entry, idx) {
      const { card, avatar, fallback, stationId } = buildStreamerCardSkeleton(
        entry,
        idx,
      );
      const imageUrl = resolveProfileImage(entry.raw || entry);
      if (imageUrl) {
        applyAvatarImage(avatar, imageUrl, fallback);
      } else {
        await hydrateAvatarParallel(avatar, fallback, stationId, entry.name);
      }
      return card;
    }

    function buildStreamerCardSkeleton(entry, idx) {
      const card = document.createElement("div");
      card.className = "streamer-card";
      card.style.setProperty(
        "--tile-gradient",
        (entry && entry.theme && entry.theme.gradient) ||
          gradientPalette[idx % gradientPalette.length],
      );
      const rank = idx + 1;
      card.dataset.rank = String(rank);
      if (rank <= 4) {
        card.classList.add(`streamer-card--rank-${rank}`);
      }

      const stationId = resolveStationId(entry);
      if (stationId) card.dataset.stationId = stationId;

      card.setAttribute("role", "listitem");
      card.setAttribute("tabindex", "0");
      card.setAttribute(
        "aria-label",
        `${idx + 1}위: ${entry.name}, ${minutesToText(entry.minutes)} 시청`,
      );

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const sid = card.dataset.stationId;
          if (sid) {
            window.open(`https://www.sooplive.co.kr/station/${sid}`, "_blank");
          }
        }
      });

      card.style.cursor = stationId ? "pointer" : "default";
      if (stationId) {
        card.addEventListener("click", () => {
          window.open(`https://www.sooplive.co.kr/station/${stationId}`, "_blank");
        });
      }

      const avatar = document.createElement("div");
      avatar.className = "streamer-card__avatar";
      avatar.dataset.name = entry.name;
      const fallback = getInitials(entry.name);
      avatar.textContent = fallback;

      const body = document.createElement("div");
      body.className = "streamer-card__body";
      const minutesLabel = minutesToText(entry.minutes);
      const minutesSub = `${fmt.format(Math.floor(entry.minutes))}분 누적`;
      body.innerHTML = streamerCardBodyTemplate(
        entry.name,
        minutesLabel,
        minutesSub,
      );

      card.appendChild(avatar);
      card.appendChild(body);

      return { card, avatar, fallback, stationId };
    }

    function buildStreamerSlots(cards) {
      const slots = [];

      const createSlot = (slotClass) => {
        const slot = document.createElement("div");
        slot.className = `streamer-grid__slot ${slotClass}`;
        return slot;
      };

      if (cards[0]) {
        const firstSlot = createSlot("streamer-grid__slot--first");
        firstSlot.appendChild(cards[0]);
        slots.push(firstSlot);
      }

      if (cards[1]) {
        const secondSlot = createSlot("streamer-grid__slot--second");
        secondSlot.appendChild(cards[1]);
        slots.push(secondSlot);
      }

      if (cards[2] || cards[3]) {
        const stackSlot = createSlot("streamer-grid__slot--stack");
        if (cards[2]) stackSlot.appendChild(cards[2]);
        if (cards[3]) stackSlot.appendChild(cards[3]);
        slots.push(stackSlot);
      }

      return slots;
    }

    function selectRandomThemes(count) {
      if (!count) return [];
      if (
        !Array.isArray(streamerGradientThemes) ||
        !streamerGradientThemes.length
      ) {
        return new Array(count).fill(null);
      }
      // Clone the pool to avoid mutating the original constant
      const pool = [...streamerGradientThemes];

      // Fisher-Yates Shuffle
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }

      // Return the first 'count' items.
      // If count > pool.length, we might need to cycle, but currently pool is large enough (24 items).
      return pool.slice(0, count);
    }

    function updateQuickStats(ctx, meta) {
      const uiRefs = getUiRefs();
      if (!uiRefs) return;
      const totals = ctx.totalsByBj || [];
      const totalMinutes = ctx.totalAllMinutes || 0;

      const dailySource =
        (ctx.dailyByDate && ctx.dailyByDate.length
          ? ctx.dailyByDate
          : ctx.syntheticDaily) || [];
      const meaningfulDays = dailySource.filter((d) => d && d.minutes);
      if (meaningfulDays.length) {
        const peak = meaningfulDays.reduce(
          (best, cur) => (cur.minutes > best.minutes ? cur : best),
          meaningfulDays[0],
        );
        if (uiRefs.quickPeakLabel)
          uiRefs.quickPeakLabel.textContent = peak.date || "-";
        if (uiRefs.quickPeakValue)
          animateCountUp(uiRefs.quickPeakValue, peak.minutes || 0, 750);
      } else {
        if (uiRefs.quickPeakLabel) uiRefs.quickPeakLabel.textContent = "-";
        if (uiRefs.quickPeakValue)
          uiRefs.quickPeakValue.textContent = "데이터 없음";
      }

      const topEntry = totals.find((t) => t.name && t.name !== "기타");
      const share =
        topEntry && totalMinutes ? (topEntry.minutes / totalMinutes) * 100 : 0;
      if (uiRefs.quickShareValue) {
        const startTime = performance.now();
        function animatePercent(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / 650, 1);
          const easedProgress = progress * (2 - progress);
          const currentShare = share * easedProgress;
          uiRefs.quickShareValue.textContent = `${currentShare.toFixed(1)}%`;
          if (progress < 1) {
            requestAnimationFrame(animatePercent);
          }
        }
        requestAnimationFrame(animatePercent);
      }
      if (uiRefs.quickShareSub) {
        uiRefs.quickShareSub.textContent = topEntry
          ? `${topEntry.name}`
          : "데이터 없음";
      }

      if (uiRefs.quickAvgSession) {
        const avgMinutes = ctx.activeDays
          ? ctx.totalAllMinutes / ctx.activeDays
          : ctx.totalAllMinutes;
        if (ctx.totalAllMinutes > 0) {
          animateCountUp(uiRefs.quickAvgSession, avgMinutes, 700);
        } else {
          uiRefs.quickAvgSession.textContent = "-";
        }
      }
    }

    function buildDashboardSkeleton(meta) {
      const rootHost = initChartRoot();
      if (!rootHost) return null;
      promoteCustomGraphSection();
      hideTopAndOthers();

      const existing = getUiRefs();
      if (existing) {
        applyViewerMeta(meta);
        return existing;
      }

      const root = document.createElement("div");
      root.className = "soop-recap-root";

      const styleEl = document.createElement("style");
      styleEl.textContent = `${dashboardStyles}\n${chartStyles}`;
      root.appendChild(styleEl);
      root.insertAdjacentHTML("beforeend", dashboardTemplate);

      rootHost.appendChild(root);

      const refs = {
        root,
        viewerName: root.querySelector('[data-ref="viewer-name"]'),
        rangeText: root.querySelector('[data-ref="range-text"]'),
        avatar: root.querySelector('[data-ref="avatar"]'),
        heroHighlight: root.querySelector('[data-ref="hero-highlight"]'),
        totalValue: root.querySelector('[data-ref="stat-total-value"]'),
        totalSub: root.querySelector('[data-ref="stat-total-sub"]'),
        daysValue: root.querySelector('[data-ref="stat-days-value"]'),
        daysSub: root.querySelector('[data-ref="stat-days-sub"]'),
        avgValue: root.querySelector('[data-ref="stat-avg-value"]'),
        avgSub: root.querySelector('[data-ref="stat-avg-sub"]'),
        topStreamers: root.querySelector('[data-ref="top-streamers"]'),
        categoryThumbnails: root.querySelector('[data-ref="category-thumbnails"]'),
        quickUnique: root.querySelector('[data-ref="quick-unique"]'),
        quickPeakLabel: root.querySelector('[data-ref="quick-peak-label"]'),
        quickPeakValue: root.querySelector('[data-ref="quick-peak-value"]'),
        quickShareValue: root.querySelector('[data-ref="quick-share-value"]'),
        quickShareSub: root.querySelector('[data-ref="quick-share-sub"]'),
        quickAvgSession: root.querySelector('[data-ref="quick-avg-session"]'),
      };

      setUiRefs(refs);

      let exportBtn = document.getElementById("soop-export-btn");
      const attachHandler = () => {
        exportBtn.onclick = () => {
          const latest = getUiRefs();
          if (latest?.root) {
            captureDashboard(latest.root);
          }
        };
      };

      if (!exportBtn) {
        exportBtn = document.createElement("button");
        exportBtn.id = "soop-export-btn";
        exportBtn.className = "export-button";
        exportBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>
        </svg>
        PNG 저장
      `;
        attachHandler();
        document.body.appendChild(exportBtn);
      } else {
        attachHandler();
      }
      refs.exportBtn = exportBtn;

      applyViewerMeta(meta);
      clearLoadingMask();
      return refs;
    }

    function applyViewerMeta(meta) {
      const uiRefs = getUiRefs();
      if (!uiRefs || !meta) return;

      const displayName = meta.viewerName || "시청자";
      if (uiRefs.viewerName) uiRefs.viewerName.textContent = displayName;
      if (uiRefs.rangeText) {
        const rangeText =
          meta.rangeText || formatRangeText(meta.range) || "조회 기간 정보 없음";
        uiRefs.rangeText.textContent = rangeText;
      }
      if (uiRefs.avatar) {
        uiRefs.avatar.classList.remove("has-image");
        uiRefs.avatar.style.backgroundImage = "";
        const fallback = getInitials(displayName);
        uiRefs.avatar.textContent = fallback;
        if (meta.avatarUrl) {
          applyAvatarImage(uiRefs.avatar, meta.avatarUrl, fallback);
        } else {
          hydrateAvatarAny(
            uiRefs.avatar,
            fallback,
            meta.viewerId,
            meta.viewerNick || meta.viewerName,
          );
        }
      }
    }

    async function updateDashboardUI(ctx, meta) {
      const ui = buildDashboardSkeleton(meta);
      if (!ui) return;

      clearLoadingState();
      applyViewerMeta(meta);

      if (ui.totalValue) {
        animateCountUp(ui.totalValue, ctx.totalAllMinutes, 1000);
      }
      if (ui.totalSub)
        ui.totalSub.textContent = `${fmt.format(Math.floor(ctx.totalAllMinutes || 0))}분 누적`;

      if (ui.daysValue) {
        animateCountUp(ui.daysValue, ctx.activeDays, 600, (val) => `${val}일`);
      }
      if (ui.daysSub) {
        ui.daysSub.textContent =
          meta && meta.rangeDays
            ? `기간 ${fmt.format(meta.rangeDays)}일 중`
            : "";
      }

      const avgMinutes = ctx.activeDays
        ? ctx.totalAllMinutes / ctx.activeDays
        : ctx.totalAllMinutes;
      if (ui.avgValue) {
        animateCountUp(ui.avgValue, avgMinutes, 800);
      }
      if (ui.avgSub) ui.avgSub.textContent = "평균 시청시간";

      const dataRange = deriveRangeFromDailyList(ctx.dailyByDate);
      if (dataRange) {
        if (ui.rangeText) ui.rangeText.textContent = formatRangeText(dataRange);
        meta.range = dataRange;
        meta.rangeText = formatRangeText(dataRange);
      }

      const topEntry = (ctx.totalsByBj || []).find(
        (t) => t.name && t.name !== "기타",
      );
      if (ui.heroHighlight) {
        ui.heroHighlight.textContent = topEntry
          ? `${topEntry.name} (${minutesToText(topEntry.minutes)})`
          : "가장 많이 본 방송 데이터를 찾을 수 없습니다.";
      }

      if (ui.quickUnique) {
        const uniqueCount = (ctx.totalsByBj || []).filter(
          (t) => t.name && t.name !== "기타",
        ).length;
        animateCountUp(ui.quickUnique, uniqueCount, 700, (val) => fmt.format(val));
      }

      await renderTopStreamers(ui.topStreamers, ctx.totalsByBj);
      updateQuickStats(ctx);
    }

    const categoryCardBodyTemplate = (name, countLabel) => `
      <span class="category-card__name">${name}</span>
      <span class="category-card__count">${countLabel}</span>
    `;

    function renderCategoryThumbnails(container, categoriesData) {
      if (!container) return;
      container.innerHTML = "";

      if (!categoriesData || !categoriesData.length) {
        const empty = document.createElement("div");
        empty.className = "category-card category-card--empty";
        empty.textContent = "선호 카테고리 데이터가 없습니다.";
        container.appendChild(empty);
        return;
      }

      categoriesData.slice(0, 4).forEach((category) => {
        const card = createCategoryCard(category);
        container.appendChild(card);
      });
    }

    function createCategoryCard(category) {
      const card = document.createElement("div");
      card.className = "category-card";

      card.setAttribute("role", "listitem");
      card.setAttribute(
        "aria-label",
        `카테고리: ${category.name}, ${category.count}회 시청`,
      );

      const imageContainer = document.createElement("div");
      imageContainer.className = "category-card__image";

      if (category.imageUrl) {
        const img = document.createElement("img");
        img.src = category.imageUrl;
        img.alt = category.name;
        img.className = "category-card__image-inner";
        imageContainer.appendChild(img);
      } else {
        const fallback = document.createElement("div");
        fallback.className = "category-card__image-fallback";
        fallback.textContent = category.name.charAt(0) || "?";
        imageContainer.appendChild(fallback);
      }

      const body = document.createElement("div");
      body.className = "category-card__body";
      body.innerHTML = categoryCardBodyTemplate(
        category.name,
        `${fmt.format(category.count)}회`,
      );

      card.appendChild(imageContainer);
      card.appendChild(body);
      return card;
    }

    async function refreshCategoryThumbnails(rangeOverride = null) {
      const uiRefs = getUiRefs();
      if (!uiRefs || !uiRefs.categoryThumbnails) return;
      showCategoryLoadingState();
      try {
        const table2Data = await fetchCategoryPreferenceTable(rangeOverride);
        const prepared = await prepareTop4CategoriesData(table2Data);
        renderCategoryThumbnails(uiRefs.categoryThumbnails, prepared);
      } catch (err) {
        renderCategoryThumbnails(uiRefs.categoryThumbnails, []);
      }
    }

    function computeBarAxisConfig(maxMinutes) {
      if (!Number.isFinite(maxMinutes) || maxMinutes <= 0) return null;
      const desiredTickCount = 5;
      const maxHours = maxMinutes / 60;
      // 변경 1: 여백을 7% → 20%로 증가, 최소 1.5시간 보장
      const paddedHours = maxHours + Math.max(maxHours * 0.20, 1.5);
      const rawInterval = paddedHours / (desiredTickCount - 1);
      const stepCandidates = [
        0.5, 1, 2, 3, 4, 6, 8, 12, 16, 18, 20, 24, 30, 36, 42, 48, 54, 60, 72, 84,
        96, 108, 120, 144, 168, 192, 216, 240, 288, 336, 384, 432, 480, 576, 672,
        720, 768, 840, 960, 1080, 1200, 1440,
      ];
      const intervalHours =
        stepCandidates.find((step) => step >= rawInterval) ||
        stepCandidates[stepCandidates.length - 1];
      let axisHours = intervalHours * (desiredTickCount - 1);

      // 변경 2: 최소 확장 계수 적용 (데이터보다 30% 더 넓게)
      const minAxisHours = maxHours * 1.3;
      axisHours = Math.max(axisHours, minAxisHours);

      // 변경 3: 최종 축 범위 기준으로 눈금 위치 재계산
      const actualInterval = axisHours / (desiredTickCount - 1);
      const axisMaxMinutes = axisHours * 60;
      const tickPositions = [];
      for (let i = 0; i < desiredTickCount; i++) {
        tickPositions.push(Math.round(i * actualInterval * 60));
      }
      return { axisMaxMinutes, tickPositions };
    }

    /*export function prepareStreamerChartTotals(totals, limit = MAX_STREAMER_BARS) {
      const list = Array.isArray(totals) ? totals : [];
      const nonEtc = list.filter(
        (item) => item && item.name && item.name !== "기타",
      );
      const etcEntry = list.find((item) => item && item.name === "기타");
      const top = nonEtc.slice(0, limit).map((item) => ({ ...item }));
      const overflow = nonEtc.slice(limit);
      let etcMinutes = overflow.reduce(
        (acc, cur) => acc + (cur && cur.minutes ? cur.minutes : 0),
        0,
      );
      if (etcEntry && typeof etcEntry.minutes === "number") {
        etcMinutes += etcEntry.minutes;
      }
      if (etcMinutes > 0) {
        const base = etcEntry ? { ...etcEntry } : { name: "기타" };
        base.minutes = etcMinutes;
        top.push(base);
      }
      return top;
    }*/

    function prepareStreamerChartTotals(totals, limit = MAX_STREAMER_BARS) {
      const list = Array.isArray(totals) ? totals : [];
      const nonEtc = list.filter(
        (item) => item && item.name && item.name !== "기타",
      );
      const etcEntry = list.find((item) => item && item.name === "기타");
      const top = nonEtc.slice(0, limit).map((item) => ({ ...item }));

      if (etcEntry && typeof etcEntry.minutes === "number") {
        const base = { ...etcEntry };
        top.push(base);
      }

      return top;
    }

    const chartInstances = {
      bar: null,
      donut: null,
      daily: null,
    };
    let pendingIdleHandle = null;
    let pendingTimeout = null;

    function cancelPendingSecondaryRender() {
      if (
        pendingIdleHandle !== null &&
        typeof window !== "undefined" &&
        typeof window.cancelIdleCallback === "function"
      ) {
        window.cancelIdleCallback(pendingIdleHandle);
      }
      if (pendingTimeout !== null) {
        clearTimeout(pendingTimeout);
      }
      pendingIdleHandle = null;
      pendingTimeout = null;
    }

    function destroyCharts() {
      cancelPendingSecondaryRender();

      const Highcharts = unsafeWindow.Highcharts;

      // Destroy tracked instances
      Object.keys(chartInstances).forEach((key) => {
        const chart = chartInstances[key];
        if (chart && typeof chart.destroy === "function") {
          try {
            chart.destroy();
          } catch (err) {
          }
        }
        chartInstances[key] = null;
      });

      // Destroy any orphaned charts in Highcharts global registry
      if (Highcharts && Highcharts.charts) {
        const chartContainerIds = [
          "soop-plus-chart-bar",
          "soop-plus-chart-donut",
          "soop-plus-chart-daily",
        ];
        chartContainerIds.forEach((containerId) => {
          const container = document.getElementById(containerId);
          if (container) {
            const orphanedChart = Highcharts.charts.find(
              (c) => c && c.renderTo === container,
            );
            if (orphanedChart) {
              try {
                orphanedChart.destroy();
              } catch (err) {
              }
            }
          }
        });
      }
    }

    function renderCharts(ctx) {
      const Highcharts = unsafeWindow.Highcharts;
      if (!Highcharts) return;

      destroyCharts();

      const totals = ctx.totalsByBj || [];
      const chartTotals = prepareStreamerChartTotals(totals, MAX_STREAMER_BARS);
      const hasChartData = chartTotals.length > 0;

      const categories = hasChartData ? chartTotals.map((t) => t.name) : ["데이터 없음"];
      const points = hasChartData
        ? chartTotals.map((t, idx) => {
            const totalMinutes = Math.round(t.minutes || 0);
            const isOther = t && t.name === "기타";
            const themedColor = t && t.theme && t.theme.main;
            return {
              y: totalMinutes,
              color: isOther
                ? fallbackBarColor
                : themedColor || barColorPalette[idx] || fallbackBarColor,
            };
          })
        : [{ y: 0, color: fallbackBarColor }];

      const categoryCount = Math.max(1, points.length);
      const maxMinutesValue = Math.max(...points.map((p) => p.y || 0), 0);
      const axisConfig = computeBarAxisConfig(maxMinutesValue);

      const perBarHeight =
        categoryCount <= CHART_CONFIG.CATEGORY_THRESHOLD_LARGE
          ? CHART_CONFIG.BAR_HEIGHT_PER_ITEM_LARGE
          : categoryCount <= CHART_CONFIG.CATEGORY_THRESHOLD_MEDIUM
            ? CHART_CONFIG.BAR_HEIGHT_PER_ITEM_MEDIUM
            : CHART_CONFIG.BAR_HEIGHT_PER_ITEM_SMALL;
      const barHeight = Math.max(
        CHART_CONFIG.MIN_HEIGHT,
        CHART_CONFIG.BAR_HEIGHT_BASE + categoryCount * perBarHeight,
      );
      const labelSize =
        categoryCount > 10
          ? CHART_CONFIG.LABEL_SIZE_SMALL
          : categoryCount > 7
            ? CHART_CONFIG.LABEL_SIZE_MEDIUM
            : CHART_CONFIG.LABEL_SIZE_LARGE;
      const barPointPadding =
        categoryCount <= CHART_CONFIG.CATEGORY_THRESHOLD_LARGE
          ? 0.36
          : categoryCount <= CHART_CONFIG.CATEGORY_THRESHOLD_MEDIUM
            ? 0.28
            : 0.22;
      const barGroupPadding =
        categoryCount <= CHART_CONFIG.CATEGORY_THRESHOLD_LARGE ? 0.28 : 0.2;

      const barContainer = document.getElementById("soop-plus-chart-bar");
      if (barContainer) {
        barContainer.style.height = `${barHeight}px`;
      }

      const renderBarChart = () => {
        const container = document.getElementById("soop-plus-chart-bar");
        if (!container) {
          return null;
        }
        const chart = Highcharts.chart("soop-plus-chart-bar", {
          chart: {
            type: "bar",
            backgroundColor: "transparent",
            height: barHeight,
            spacing: [36, 30, 42, 44],
          },
          title: { text: null },
          credits: { enabled: false },
          legend: { enabled: false },
          colors: barColorPalette,
          xAxis: {
            categories,
            labels: {
              style: { color: "#ecf0ff", fontSize: labelSize, fontWeight: "600" },
              useHTML: true,
              reserveSpace: true,
            },
            lineColor: "rgba(255,255,255,.14)",
            tickWidth: 0,
          },
          yAxis: {
            title: { text: null },
            max: axisConfig ? axisConfig.axisMaxMinutes : undefined,
            tickPositions: axisConfig ? axisConfig.tickPositions : undefined,
            labels: {
              formatter() {
                return minutesToText(this.value);
              },
              style: { color: "#dfe2ff", fontSize: "13px" },
            },
            gridLineColor: "rgba(255,255,255,.12)",
          },
          tooltip: {
            useHTML: true,
            backgroundColor: "rgba(14,18,30,.98)",
            borderColor: "#6f8bff",
            borderRadius: 12,
            shadow: true,
            style: { color: "#f7f9ff", fontSize: "14px", fontWeight: "600" },
            formatter() {
              return `<div style="display:flex;flex-direction:column;gap:4px;"><div style="font-size:15px;font-weight:700;color:#ffffff">${this.x}</div><div style="color:#aee0ff">${minutesToText(this.y)}</div><div style="color:#d3d8ff;opacity:.9">${fmt.format(Math.floor(this.y))}분</div></div>`;
            },
          },
          exporting: { enabled: false },
          plotOptions: {
            series: {
              pointPadding: barPointPadding,
              groupPadding: barGroupPadding,
              borderWidth: 0,
              colorByPoint: true,
              dataLabels: {
                enabled: true,
                align: "left",
                inside: false,
                crop: false,
                overflow: "none",
                x: 8,
                style: {
                  color: "#f7f9ff",
                  textOutline: "none",
                  fontSize: "12px",
                  fontWeight: "600",
                },
                formatter() {
                  return this.y ? minutesToText(this.y) : "";
                },
              },
            },
          },
          series: [
            {
              name: "시청 시간",
              data: points,
            },
          ],
        });
        chartInstances.bar = chart;
        return chart;
      };

      const donutWrap = document.querySelector("#soop-plus-chart-donut")?.parentElement || null;
      const donutEl = document.getElementById("soop-plus-chart-donut");

      const renderDonutChart = () => {
        if (donutWrap) {
          if (!ctx.pcMin && !ctx.moMin) {
            donutWrap.style.display = "none";
          } else {
            donutWrap.style.display = "";
          }
        }

        if (donutEl && ctx.pcMin + ctx.moMin > 0) {
          const totalEnv = Math.max(1, ctx.pcMin + ctx.moMin);
          const segments = [
            { name: "데스크톱", y: Math.floor(ctx.pcMin), color: "#89A7FF" },
            { name: "모바일", y: Math.floor(ctx.moMin), color: "#54DEC3" },
          ];

          const chart = Highcharts.chart("soop-plus-chart-donut", {
            chart: {
              type: "pie",
              backgroundColor: "transparent",
              spacing: [0, 0, 0, 0],
            },
            title: { text: null },
            credits: { enabled: false },
            legend: { enabled: false },
            tooltip: {
              useHTML: true,
              backgroundColor: "rgba(12,14,24,.92)",
              borderColor: "rgba(255,255,255,.12)",
              style: { color: "#f7f9ff", fontSize: "13px" },
              formatter() {
                return (
                  `<div style="display:flex;flex-direction:column;gap:4px;">` +
                  `<span style="font-weight:700;color:${this.color}">${this.key}</span>` +
                  `<span>${minutesToText(this.y)} (${fmt.format(Math.floor(this.y))}분)</span>` +
                  `<span style="opacity:.8">${(this.percentage || 0).toFixed(1)}%</span>` +
                  `</div>`
                );
              },
            },
            exporting: { enabled: false },
            plotOptions: {
              pie: {
                innerSize: "72%",
                borderWidth: 0,
                startAngle: -120,
                endAngle: 120,
                center: ["50%", "60%"],
                dataLabels: {
                  enabled: true,
                  distance: 18,
                  formatter() {
                    return `${(this.percentage || 0).toFixed(1)}%`;
                  },
                  style: {
                    color: "#fefefe",
                    textOutline: "none",
                    fontWeight: "600",
                    fontSize: "12px",
                  },
                },
              },
            },
            series: [
              {
                name: "환경",
                data: segments,
              },
            ],
            annotations: [
              {
                labels: [
                  {
                    point: { x: 0, y: 0, plotX: 0, plotY: 0 },
                    text:
                      `<div style="text-align:center;color:#eef2ff;font-size:15px;font-weight:600;">총 시청</div>` +
                      `<div style="text-align:center;color:#fff;font-size:22px;font-weight:800;margin-top:2px;">${(totalEnv / 60).toFixed(1)}h</div>`,
                    useHTML: true,
                  },
                ],
                labelOptions: { verticalAlign: "middle", x: 0, y: 0 },
              },
            ],
          });
          chartInstances.donut = chart;
          return chart;
        }

        chartInstances.donut = null;
        return null;
      };

      const renderDailyChart = () => {
        const container = document.getElementById("soop-plus-chart-daily");
        if (!container) {
          return null;
        }
        const daily = ctx.dailyByDate.length ? ctx.dailyByDate : ctx.syntheticDaily;
        const chart = Highcharts.chart("soop-plus-chart-daily", {
          chart: { type: "column", backgroundColor: "transparent" },
          title: { text: null },
          credits: { enabled: false },
          legend: { enabled: false },
          colors: ["#7d8dff"],
          xAxis: {
            categories: daily.map((d) => d.date),
            labels: {
              style: { color: "#ecf0ff", fontSize: "12px", rotation: -35 },
            },
            lineColor: "rgba(255,255,255,.14)",
            tickWidth: 0,
          },
          yAxis: {
            title: { text: null },
            labels: {
              formatter() {
                return minutesToText(this.value);
              },
              style: { color: "#dfe2ff", fontSize: "13px" },
            },
            gridLineColor: "rgba(255,255,255,.12)",
            tickAmount: 5,
          },
          tooltip: {
            useHTML: true,
            backgroundColor: "rgba(16,20,29,.9)",
            borderColor: "rgba(120,138,207,.4)",
            style: { color: "#f7f9ff" },
            formatter() {
              return `<strong>${this.key}</strong><br/>${minutesToText(this.y)} (${fmt.format(Math.floor(this.y))}분)`;
            },
          },
          exporting: { enabled: false },
          plotOptions: {
            column: { borderWidth: 0, borderRadius: 4, pointPadding: 0.08 },
          },
          series: [
            { name: "총 시청(분)", data: daily.map((d) => Math.floor(d.minutes)) },
          ],
        });
        chartInstances.daily = chart;
        return chart;
      };

      const barChart = renderBarChart();

      const renderSecondaryCharts = () => {
        const donutChart = renderDonutChart();
        const dailyChart = renderDailyChart();
        const chartRoot = getChartRoot();
        if (chartRoot) {
          chartRoot.style.opacity = "1";
        }
        return { donutChart, dailyChart };
      };

      const canIdleCallback =
        typeof window !== "undefined" &&
        typeof window.requestIdleCallback === "function";

      if (canIdleCallback) {
        pendingIdleHandle = window.requestIdleCallback(() => {
          pendingIdleHandle = null;
          renderSecondaryCharts();
        }, { timeout: 100 });
      } else {
        pendingTimeout = setTimeout(() => {
          pendingTimeout = null;
          renderSecondaryCharts();
        }, 0);
      }

      return { barChart };
    }

    function patchHighchartsFactory(Highcharts) {
      if (!Highcharts || Highcharts.__soopRecapPatched) return;
      const ORIGINAL_CHART = Highcharts.Chart;
      const ORIGINAL_FACTORY = Highcharts.chart;
      const shouldBlock = (opts) => {
        if (!opts) return false;
        try {
          const chartOpts = opts.chart || {};
          const titleText = (opts.title && opts.title.text) || "";
          const renderTo = chartOpts.renderTo || "";
          const xAxis = Array.isArray(opts.xAxis)
            ? opts.xAxis
            : [opts.xAxis || {}];
          const xAxisText = JSON.stringify(xAxis);
          const series = opts.series || [];
          const seriesText = JSON.stringify(series);
          const combined = `${titleText} ${renderTo} ${xAxisText} ${seriesText}`;
          if (
            /PC\s*\/\s*모바일\s*방송/.test(combined) &&
            /일반\s*\/\s*베스트\s*\/\s*파트너/.test(combined)
          ) {
            return true;
          }
          if (typeof renderTo === "string" && /ratio|compare/i.test(renderTo))
            return true;
        } catch {}
        return false;
      };
      const noopChart = (opts) => {
        const containerTarget =
          (opts &&
            opts.chart &&
            typeof opts.chart.renderTo === "string" &&
            document.getElementById(opts.chart.renderTo)) ||
          (opts &&
            opts.chart &&
            opts.chart.renderTo &&
            opts.chart.renderTo.nodeType === 1 &&
            opts.chart.renderTo) ||
          null;
        if (containerTarget) {
          containerTarget.style.setProperty("display", "none", "important");
          containerTarget.innerHTML = "";
        }
        return {
          destroy() {},
          update() {},
          addSeries() {},
          redraw() {},
          series: [],
          container: containerTarget,
        };
      };
      Highcharts.Chart = function patchedChart(options, callback) {
        if (shouldBlock(options)) {
          return noopChart(options);
        }
        return new ORIGINAL_CHART(options, callback);
      };
      Highcharts.chart = function patchedFactory() {
        let options;
        let renderTo;
        if (typeof arguments[0] === "string" || arguments[0]?.nodeType === 1) {
          renderTo = arguments[0];
          options = arguments[1] || {};
        } else {
          options = arguments[0] || {};
        }
        if (renderTo && !options.chart) {
          options.chart = { renderTo };
        } else if (renderTo && options.chart && !options.chart.renderTo) {
          options.chart.renderTo = renderTo;
        }
        if (shouldBlock(options)) {
          return noopChart(options);
        }
        return ORIGINAL_FACTORY.apply(this, arguments);
      };
      Highcharts.__soopRecapPatched = true;
    }

    function configureHighcharts(Highcharts) {
      if (!Highcharts) return;
      Object.assign(Highcharts.getOptions().lang, {
        contextButtonTitle: "차트 메뉴",
        printChart: "인쇄",
        downloadPNG: ".png 다운로드",
        downloadJPEG: ".jpeg 다운로드",
        downloadSVG: ".svg 다운로드",
      });
      Highcharts.setOptions({
        chart: {
          style: {
            fontFamily:
              '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans KR",sans-serif',
            color: "#f4f6ff",
          },
        },
        title: { style: { color: "#f4f6ff" } },
        legend: { itemStyle: { color: "#e1e4f5" } },
      });
      patchHighchartsFactory(Highcharts);
    }

    /**
     * Remove PNG export button from DOM
     * @param {string} debugMsg - Optional debug message
     */
    function removeExportButton(debugMsg) {
      const exportBtn = document.getElementById("soop-export-btn");
      if (exportBtn) {
        exportBtn.remove();
      }
    }

    const searchParams = new URLSearchParams(window.location.search);
    const supportedWatchModules = new Set([
      "UserLiveWatchTimeData",
      "UserVodWatchTimeData",
    ]);
    const currentModule = searchParams.get("szModule");
    const currentMethod = searchParams.get("szMethod");
    const shouldEnableDashboard =
      supportedWatchModules.has(currentModule) && currentMethod === "watch";

    let activeLegacyObserver = null;
    let legacyCleanupTimer = null;
    let cleanupBeforeUnload = null;
    let pendingTableRefreshTimer = null;
    const TABLE_REFRESH_INTERVAL_MS = 200;
    const TABLE_REFRESH_MAX_ATTEMPTS = 5;

    if (!shouldEnableDashboard) ; else {
      fetchCategoryList().catch(() => {});
      fetchLoginInfo().catch(() => {});
      applyLoadingMask();
      initChartRoot();

      const onReady = Promise.resolve()
        .then(() => loadModule("core"))
        .then(() => loadModule("exporting"))
        .then(() => loadModule("offline-exporting"))
        .then(() => loadModule("treemap"))
        .then(() => {
          try {
            const Highcharts = unsafeWindow.Highcharts;
            configureHighcharts(Highcharts);
            notifyLoaded();
          } catch {
            notifyLoaded();
          }
        })
        .catch(() => notifyLoaded());

      function teardownLegacyObserver() {
        if (activeLegacyObserver) {
          activeLegacyObserver.disconnect();
          activeLegacyObserver = null;
        }
        if (legacyCleanupTimer) {
          clearTimeout(legacyCleanupTimer);
          legacyCleanupTimer = null;
        }
        if (cleanupBeforeUnload) {
          window.removeEventListener("beforeunload", cleanupBeforeUnload);
          cleanupBeforeUnload = null;
        }
        if (pendingTableRefreshTimer) {
          clearTimeout(pendingTableRefreshTimer);
          pendingTableRefreshTimer = null;
        }
      }

      function installOPageHook(retry = 0) {
        const oPage = unsafeWindow.oPage;
        if (!oPage || !oPage.setMultipleChart) {
          if (retry > 200) {
            clearLoadingMask();
            return;
          }
          setTimeout(() => installOPageHook(retry + 1), 50);
          return;
        }
        if (oPage.__soopRecapPlusHooked) return;
        oPage.__soopRecapPlusHooked = true;

        oPage.setMultipleChart = async function (data) {
          // original(data); intentionally not calling underlying renderer

          teardownLegacyObserver();
          if (pendingTableRefreshTimer) {
            clearTimeout(pendingTableRefreshTimer);
            pendingTableRefreshTimer = null;
          }

          await onReady;
          populateDateCache();
          populateTableCache();
          const derivedRange = deriveRangeFromPayload(data);
          const fallbackRange = derivedRange || getDateRange();
          const loginInfo = await fetchLoginInfo();
          const meta = detectViewerMeta(fallbackRange, loginInfo);
          buildDashboardSkeleton(meta);

          showLoadingState();

        const stacks = (data && data.data_stack) || [];
        if (!stacks.length) {
          const emptyCtx = {
            totalsByBj: [],
            totalAllMinutes: 0,
            activeDays: 0,
            pcMin: 0,
            moMin: 0,
            dailyByDate: [],
            syntheticDaily: [],
          };
          await updateDashboardUI(emptyCtx, meta);
          destroyCharts();
          renderCharts(emptyCtx);
          return;
        }

          const totalsByBj = stacks
            .map((t) => ({
              name: t.bj_nick || t.nick || t.name || "이름 없음",
              id:
                t.bj_id ||
                t.user_id ||
                t.id ||
                t.uid ||
                t.station_id ||
                t.stationId,
              profile_image:
                t.profile_image ||
                t.profileImage ||
                t.profile_img ||
                t.bj_image ||
                t.img ||
                t.image,
              minutes: sum((t.data || []).map((v) => normalizeToMinutes(+v || 0))),
              raw: t,
            }))
            .sort((a, b) => {
              if (a.name === "기타") return 1;
              if (b.name === "기타") return -1;
              return b.minutes - a.minutes;
            });
          const totalAllMinutes = sum(totalsByBj.map((t) => t.minutes));

          const numDays = Math.max(
            ...stacks.map((s) => (s.data ? s.data.length : 0)),
          );
          let activeDays = 0;
          const syntheticDaily = [];
          for (let i = 0; i < numDays; i++) {
            const daySumMin = sum(
              stacks.map((s) => normalizeToMinutes(+((s.data && s.data[i]) || 0))),
            );
            if (daySumMin > 0) activeDays++;
            syntheticDaily.push({ date: `D${i + 1}`, minutes: daySumMin });
          }

          const firstParse = parsePcMobileFromTables();
          const ctx = {
            totalsByBj,
            totalAllMinutes,
            activeDays,
            pcMin: firstParse.pcMin,
            moMin: firstParse.moMin,
            dailyByDate: firstParse.daily,
            syntheticDaily,
          };
          await updateDashboardUI(ctx, meta);
          renderCharts(ctx);
        const rangeForCategories = meta.range || fallbackRange;
        await refreshCategoryThumbnails(rangeForCategories);

          const startTableRefreshWatch = () => {
            let attempts = 0;
            const tryRefresh = () => {
              pendingTableRefreshTimer = setTimeout(async () => {
                pendingTableRefreshTimer = null;
                attempts++;
                try {
                  const again = parsePcMobileFromTables();
                  if (
                    again.pcMin + again.moMin >
                      firstParse.pcMin + firstParse.moMin ||
                    again.daily.length > firstParse.daily.length
                  ) {
                    const refreshed = {
                      totalsByBj,
                      totalAllMinutes,
                      activeDays,
                      pcMin: again.pcMin,
                      moMin: again.moMin,
                      dailyByDate: again.daily,
                      syntheticDaily,
                    };
                    await updateDashboardUI(refreshed, meta);
                    renderCharts(refreshed);
                    return;
                  }
                } catch (err) {
                }
                if (attempts < TABLE_REFRESH_MAX_ATTEMPTS) {
                  tryRefresh();
                }
              }, TABLE_REFRESH_INTERVAL_MS);
            };
            tryRefresh();
          };

          startTableRefreshWatch();
          purgeDeferredLegacyNodes();

          const runLegacyCleanup = () => {
            try {
              if (isCacheStale()) {
                invalidateCache();
                populateDateCache();
                populateTableCache();
              }
              hideTopAndOthers();
              hideGridBoxes();
            } catch (err) {
            }
          };

          runLegacyCleanup();

          const chartRoot = document.getElementById("containchart");
          if (!chartRoot) return;

          activeLegacyObserver = new MutationObserver(() => {
            if (legacyCleanupTimer) clearTimeout(legacyCleanupTimer);
            legacyCleanupTimer = setTimeout(() => {
              runLegacyCleanup();
            }, TIMING.DEBOUNCE_HIDE);
          });
          activeLegacyObserver.observe(chartRoot, {
            childList: true,
            subtree: false,
          });
          cleanupBeforeUnload = teardownLegacyObserver;
          window.addEventListener("beforeunload", cleanupBeforeUnload);
        };
      }

      installOPageHook();
    }

    let tabSwitchListenerAttached = false;

    function attachTabSwitchListener(nav) {
      if (!nav || tabSwitchListenerAttached) return;
      nav.addEventListener("click", (e) => {
        const target = e.target.closest("a");
        if (!target) return;

        const szModule = target.getAttribute("id");

        if (szModule === "UserLiveSearchKeywordData") {
          setTimeout(() => {
            removeExportButton();
          }, 100);
        }
      });
      tabSwitchListenerAttached = true;
    }

    function installTabSwitchListener() {
      const tryAttach = () => {
        const nav = document.getElementById("search-type");
        if (nav) {
          attachTabSwitchListener(nav);
          return true;
        }
        return false;
      };

      if (tryAttach()) return;

      const observer = new MutationObserver(() => {
        if (tryAttach()) observer.disconnect();
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", installTabSwitchListener, {
        once: true,
      });
    } else {
      installTabSwitchListener();
    }

    })();

})();
//# sourceMappingURL=index.js.map
