// ==UserScript==
// @name              YouTube Live Time Display
// @name:zh-TW        YouTube Live Time Display
// @name:zh-TW        YouTube Live Time Display
// @name:zh-TW        YouTube Live Time Display
// @namespace         https://docs.scriptcat.org/
// @version           0.0.3
// @description       Display elapsed time / real-world timestamp for live streams and live archives on YouTube
// @description:zh-TW 在 YouTube 直播與直播存檔中顯示已播放時間 / 對應的現實世界時間戳
// @description:zh-CN 在 YouTube 直播和直播存档中显示已播放时间 / 对应的现实世界时间戳
// @description:ja    YouTube のライブ配信およびライブアーカイブで、経過時間／実世界のタイムスタンプを表示
// @author            CY Fung
// @match             *://www.youtube.com/*
// @run-at            document-start
// @inject-into       page
// @allFrames         true
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/560682/YouTube%20Live%20Time%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/560682/YouTube%20Live%20Time%20Display.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // ===== Reference =====
  // https://greasyfork.org/en/scripts/453367-youtube-live-clock
  // credit to its author DerekHuang (https://greasyfork.org/en/users/972801-derekhuang)

  // =========================
  // Config
  // =========================
  // Choose your ideal date format by changing FORMAT value below:
  // 1: 2024/10/17 08:53:14 (default)
  // 2: 10/17/2024 08:53:14
  // 3: 17/10/2024 08:53:14
  // 4: Thu 17/10/2024 08:53:14
  // 5: Thursday 17/10/2024 08:53:14
  // 6: Thursday 17 October 2024 08:53:14
  const FORMAT = 1;

  const CSS = `
    .ytp-chrome-bottom .ytp-time-display,
    .ytp-chrome-bottom .ytp-right-controls {
      display: flex !important;
    }
    #present-time {
      margin: 0 10px 0 5px !important;
      background: var(--yt-spec-overlay-background-medium-light, rgba(0, 0, 0, .3));
      border-radius: 30px;
      padding: 0px 16px;
    }
  `;

  const rootContainerSelector = "#ytd-player, #player, #container, #movie_player";
  const timeDisplaySelector = ".ytp-chrome-bottom .ytp-time-display";
  const progressBarSelector = ".ytp-chrome-bottom .ytp-progress-bar";

  const liveBadgeSelector = ".ytp-chrome-bottom .ytp-live-badge";
  const liveBadgeNowSelector = ".ytp-chrome-bottom .ytp-live-badge.ytp-live-badge-is-livehead";

  // =========================
  // Utilities
  // =========================
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  function addStyleSheet(cssText) {
    // adoptedStyleSheets requires re-assignment since it's a FrozenArray.
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText);
    document.adoptedStyleSheets = document.adoptedStyleSheets.concat(sheet);
    return sheet;
  }

  const pad2 = (n) => `00${+n}`.slice(-2);

  function secondsToClock(seconds) {
    const s = seconds % 60;
    const m = Math.floor((seconds / 60) % 60);
    const h = Math.floor(seconds / 3600);
    return h > 0 ? `${h}:${pad2(m)}:${pad2(s)}` : `${m}:${pad2(s)}`;
  }

  function clockToSeconds(clock) {
    if (typeof clock !== "string") return NaN;
    const parts = clock.trim().split(":").map(Number);
    if (parts.some(Number.isNaN)) return NaN;
    if (parts.length === 2) {
      // M:SS
      const [m, s] = parts;
      return m * 60 + s;
    }
    if (parts.length === 3) {
      // H:MM:SS
      const [h, m, s] = parts;
      return h * 3600 + m * 60 + s;
    }
    return NaN;
  }

  const ABBR = {
    week: { Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday" },
    monthFull: { Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June", Jul: "July", Aug: "August", Sep: "September", Oct: "October", Nov: "November", Dec: "December" },
    month2: { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" }
  };

  function formatDateForDisplay(date, format = FORMAT) {
    // Keep original behavior (day not zero-padded)
    const weekShort = date.toLocaleString("en-US", { weekday: "short" }); // Sun, Mon...
    const monthShort = date.toLocaleString("en-US", { month: "short" }); // Jan, Feb...
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-US", { hour12: false });

    const mm = ABBR.month2[monthShort];
    const weekFull = ABBR.week[weekShort];
    const monthFull = ABBR.monthFull[monthShort];

    switch (format) {
      case 1: return `${year}/${mm}/${day} ${time}`;
      case 2: return `${mm}/${day}/${year} ${time}`;
      case 3: return `${day}/${mm}/${year} ${time}`;
      case 4: return `${weekShort} ${day}/${mm}/${year} ${time}`;
      case 5: return `${weekFull} ${day}/${mm}/${year} ${time}`;
      case 6: return `${weekFull} ${day} ${monthFull} ${year} ${time}`;
      default: return `${year}/${mm}/${day} ${time}`;
    }
  }

  function safeUrlToVideoId(url) {
    if (!url || typeof url !== "string") return "";
    try {
      const u = new URL(url, "https://www.youtube.com");
      const x = `${u.pathname}${u.search}`;
      if (x.startsWith("/watch?v=") || x.startsWith("/live/")) {
        return (x.match(/[\w-]{11}/) || [])[0] || "";
      }
    } catch (_e) {
      // ignore
    }
    return "";
  }

  function removeAll(selector, root = document) {
    for (const el of qsa(selector, root)) el.remove();
  }

  function isVisibleLiveBadge(rootContainer, selector) {
    const el = qs(selector, rootContainer);
    return !!(el && !el.closest("[hidden]"));
  }

  // =========================
  // Core logic
  // =========================
  addStyleSheet(CSS);

  let navObserver = null;
  let progressObserver = null;

  function disconnectObservers() {
    if (navObserver) navObserver.disconnect();
    navObserver = null;
    if (progressObserver) progressObserver.disconnect();
    progressObserver = null;
  }

  let searchKeyEventHandler;
  let searchKeyEventHandlerWrapper = (evt) => {
    if (searchKeyEventHandler) searchKeyEventHandler(evt);
  }

  function ensureClockEl({ timeDisplay, rootContainer }) {
    let el = qs("#present-time", rootContainer);
    if (!el) {
      el = timeDisplay.ownerDocument.createElement("span");
      el.id = "present-time";
      // Insert after the first child
      timeDisplay.insertBefore(el, timeDisplay.childNodes[1] || null);
      const setTime = (res, t0) => {
        if (!res) return;
        let sec = -1;
        if (res.indexOf("/") > 0) {
          const m = res.match(/\d+\/\d+\/\d+\s+\d+:[\d:.]+/);
          if (m) {
            const dt = new Date(m[0]);
            if (dt >= t0) {
              sec = (dt - t0) / 1000;
            }
          }
        } else {
          const m = res.match(/\d+:[\d:.]+/);
          if (m) {
            sec = clockToSeconds(m[0]);
          }
        }
        if (Number.isFinite(sec) && sec > -1e-8) {
          for (const s of rootContainer.querySelectorAll("video, audio")) {
            if (s.readyState > 1 && s.duration > 8 && Number.isFinite(s.currentTime)) {
              s.currentTime = sec;
              break;
            }
          }
        }
      }
      el.addEventListener("click", (evt) => {
        evt.preventDefault();
        evt.stopImmediatePropagation();
        evt.stopPropagation();
        const target = evt.target;
        const timestamp = +target.getAttribute("clock-timestamp");
        const t0 = +target.getAttribute("clock-t0");
        if (timestamp > 1000 && t0 > 1000) {
          const input = document.querySelector('yt-searchbox input[type="text"][placeholder]');
          if (!input) return;
          if (!input.hasAttribute("clock-hook")) {
            input.setAttribute("clock-hook", "");
            input.addEventListener("keydown", searchKeyEventHandlerWrapper, true);
            input.addEventListener("keyup", searchKeyEventHandlerWrapper, true);
            input.addEventListener("keypress", searchKeyEventHandlerWrapper, true);
          }
          searchKeyEventHandler = (evt) => {
            if (!evt || evt.key !== 'Enter' || evt.code !== 'Enter') return;
            const input = evt.target;
            if (!input) return;
            const val = input.value;
            if (!val || typeof val !== "string") return;
            if (!val.startsWith("!Set_Time:")) return;
            evt.preventDefault();
            evt.stopImmediatePropagation();
            evt.stopPropagation();
            setTime(val, t0);
          };
          input.value = "!Set_Time: " + target.getAttribute("clock-duration") + " OR " + formatDateForDisplay(new Date(timestamp), 1);
          setTimeout(() => input.focus(), 1);
          return;
        }
      })
    }
    return el;
  }

  function updateClock({ rootContainer, publication }) {
    const timeDisplay = qs(timeDisplaySelector, rootContainer);
    const progressBar = qs(progressBarSelector, rootContainer);
    if (!timeDisplay || !progressBar) return;

    const clockEl = ensureClockEl({ timeDisplay, rootContainer });

    const t = +progressBar.getAttribute("aria-valuenow");
    if (!Number.isFinite(t) || !publication || !publication.startDate) return;

    const t0 = new Date(publication.startDate).getTime();
    if (!(t0 > 1000) || !(t>-1e-8)) return;

    const t1 = t0 + t * 1000;
    const dateText = formatDateForDisplay(new Date(t1));

    // Determine "live head" / "live" states
    let isLiveHead = isVisibleLiveBadge(rootContainer, liveBadgeNowSelector);
    let isLive = isLiveHead || isVisibleLiveBadge(rootContainer, liveBadgeSelector);

    // If the computed present-time is close to now, treat as live
    if (!isLiveHead && Math.abs(t1 - Date.now()) < 8000) {
      isLiveHead = true;
      isLive = true;
    }
    const durationText = `${secondsToClock(t)}`;
    clockEl.setAttribute("clock-duration", durationText.trim());
    clockEl.setAttribute("clock-timestamp", `${t1}`);
    clockEl.setAttribute("clock-t0", `${t0}`);

    if (isLiveHead) {
      clockEl.textContent = `${durationText}`;
    } else if (isLive) {
      clockEl.textContent = `${durationText} (${dateText})`;
    } else {
      clockEl.textContent = `${dateText}`;
    }
  }

  function getMatchedMicroformatJsonForVid(vid) {
    // Original logic: iterate scripts under #microformat and parse JSON.
    const scripts = qsa("#microformat script");
    for (const script of scripts) {
      const text = script.textContent;
      if (!text || text.length < 9) continue;

      let obj;
      try {
        obj = JSON.parse(text);
      } catch {
        continue;
      }
      if (!obj || typeof obj !== "object") continue;

      for (const value of Object.values(obj)) {
        const jsonVid = safeUrlToVideoId(value);
        if (jsonVid && jsonVid === vid) return obj;
      }
    }
    return null;
  }

  function waitForPlayerAndMicroformat(vid) {
    return new Promise((resolve) => {
      navObserver = new MutationObserver((mutations, observer) => {
        const timeDisplay = qs(timeDisplaySelector);
        const progressBar = qs(progressBarSelector);
        if (!timeDisplay || !progressBar) return;

        const jsonObject = getMatchedMicroformatJsonForVid(vid);
        if (!jsonObject) return;

        // done
        disconnectObservers();
        observer.disconnect();

        resolve({ jsonObject, progressBar });
      });

      navObserver.observe(document.body, { attributes: true, childList: true, subtree: true });
    });
  }

  function pickPublication(jsonObject) {
    const pubs = (jsonObject || 0).publication;
    if (!pubs) return null;
    const arr = Array.isArray(pubs) ? pubs : [...pubs];
    return arr.filter((p) => (p || 0).startDate || (p || 0).endDate)[0] || null;
  }

  async function main(vid) {
    const { jsonObject, progressBar } = await waitForPlayerAndMicroformat(vid);

    const publication = pickPublication(jsonObject);
    if (!publication) {
      removeAll("#present-time");
      return;
    }

    progressObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        const target = (m || 0).target;
        if (!target || target.isConnected !== true || typeof target.closest !== "function") continue;
        if (target.closest("[hidden]")) continue;

        const rootContainer = target.closest(rootContainerSelector);
        if (!rootContainer) continue;

        updateClock({ rootContainer, publication });
        break;
      }
    });

    progressObserver.observe(progressBar, {
      characterData: true,
      attributeFilter: ["aria-valuenow", "mut-dummy"]
    });

    // Force at least one mutation so the observer runs once
    const rid = Math.floor(Math.random() * 2251799813685248) + 2251799813685248;
    progressBar.setAttribute("mut-dummy", `${Date.now()}_${rid}`);
  }

  // =========================
  // Navigation hook
  // =========================
  document.addEventListener("yt-navigate-finish", (event) => {
    try {
      const url = event.detail.endpoint.commandMetadata.webCommandMetadata.url;
      const vid = safeUrlToVideoId(url);
      if (vid) main(vid);
    } catch (_e) {
      // ignored
    }
  });
})();
