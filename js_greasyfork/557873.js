// ==UserScript==
// @name         GitHub Freshness fix
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description  通过颜色高亮的方式，帮助你快速判断一个 GitHub 仓库是否在更新。
// @author       向前 https://docs.rational-stars.top/ https://github.com/rational-stars/GitHub-Freshness https://home.rational-stars.top/
// @license      MIT
// @icon         https://raw.githubusercontent.com/rational-stars/picgo/refs/heads/main/avatar.jpg
// @match        https://github.com/*/*
// @match        https://github.com/search?*
// @match        https://github.com/*/*/tree/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://cdn.jsdelivr.net/npm/@simonwep/pickr@1.9.1/dist/pickr.min.js
// @require      https://cdn.jsdelivr.net/npm/luxon@3.4.3/build/global/luxon.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557873/GitHub%20Freshness%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/557873/GitHub%20Freshness%20fix.meta.js
// ==/UserScript==

/* global luxon, Pickr, Swal, $ */

(function () {
  'use strict';

  // --- Constants & Imports ---
  const DateTime = luxon.DateTime;

  // --- Styles ---
  GM_addStyle(`@import url('https://cdn.jsdelivr.net/npm/@simonwep/pickr@1.9.1/dist/themes/classic.min.css');`);
  GM_addStyle(`
      .swal2-popup.swal2-modal.swal2-show {
          color: #FFF;
          border-radius: 20px;
          background: #31b96c;
          box-shadow: 8px 8px 16px #217e49, -8px -8px 16px relentlessly-41f48f;
      }
      #swal2-title a {
          display: inline-block;
          height: 40px;
          margin-right: 10px;
          border-radius: 10px;
          overflow: hidden;
          color: #fff;
      }
      #swal2-title {
          display: flex !important;
          justify-content: center;
          align-items: center;
      }
      .row-box select {
          border: unset;
          border-radius: .15em;
      }
      .row-box {
          display: flex;
          margin: 25px;
          align-items: center;
          justify-content: space-between;
      }
      .row-box .swal2-input {
          height: 40px;
      }
      .row-box label {
          margin-right: 10px;
      }
      .row-box main input {
          background: rgba(15, 172, 83, 1);
          width: 70px;
          border: unset;
          box-shadow: unset;
          text-align: right;
          margin: 0;
      }
      .row-box main {
          display: flex;
          align-items: center;
      }
      /* Custom Badge Styles */
      .freshness-stars { padding: 8px; }
      .freshness-updated { margin-left: 5px; }
      /* Ensure colors are visible against GitHub's default styling */
      .freshness-force-color { color: inherit !important; }
  `);

  const PanelDom = `
      <div class="row-box">
          <label for="THEME-select">主题设置:</label>
          <main>
              <select tabindex="-1" id="THEME-select" class="swal2-input">
                  <option value="light">light</option>
                  <option value="dark">dark</option>
              </select>
          </main>
      </div>
      <div class="row-box">
          <label id="TIME_BOUNDARY-label">时间阈值:</label>
          <main>
              <input id="TIME_BOUNDARY-number" type="number" class="swal2-input" value="" maxlength="3" pattern="\d{1,3}">
              <select tabindex="-1" id="TIME_BOUNDARY-select" class="swal2-input">
                  <option value="day">日</option>
                  <option value="week">周</option>
                  <option value="month">月</option>
                  <option value="year">年</option>
              </select>
          </main>
      </div>
      <div class="row-box">
          <div><label id="BGC-label">背景颜色:</label><input type="checkbox" id="BGC-enabled"></div>
          <main>
              <span id="BGC-highlight-color-value"><div id="BGC-highlight-color-pickr"></div></span>
              <span id="BGC-grey-color-value"><div id="BGC-grey-color-pickr"></div></span>
          </main>
      </div>
      <div class="row-box">
          <div><label id="FONT-label">字体颜色:</label><input type="checkbox" id="FONT-enabled"></div>
          <main>
              <span id="FONT-highlight-color-value"><div id="FONT-highlight-color-pickr"></div></span>
              <span id="FONT-grey-color-value"><div id="FONT-grey-color-pickr"></div></span>
          </main>
      </div>
      <div class="row-box">
          <div><label id="DIR-label">文件夹颜色:</label><input type="checkbox" id="DIR-enabled"></div>
          <main>
              <span id="DIR-highlight-color-value"><div id="DIR-highlight-color-pickr"></div></span>
              <span id="DIR-grey-color-value"><div id="DIR-grey-color-pickr"></div></span>
          </main>
      </div>
      <div class="row-box">
          <div><label id="TIME_FORMAT-label">时间格式化:</label><input type="checkbox" id="TIME_FORMAT-enabled"></div>
      </div>
      <div class="row-box">
           <div><label id="SORT-label">文件排序:</label><input type="checkbox" id="SORT-enabled"></div>
          <main>
              <select tabindex="-1" id="SORT-select" class="swal2-input">
                  <option value="asc">时间正序</option>
                  <option value="desc">时间倒序</option>
              </select>
          </main>
      </div>
      <div class="row-box">
          <label for="CURRENT_THEME-select">当前主题:</label>
          <main>
              <select tabindex="-1" id="CURRENT_THEME-select" class="swal2-input">
                  <option value="auto">auto</option>
                  <option value="light">light</option>
                  <option value="dark">dark</option>
              </select>
          </main>
      </div>
      <div class="row-box">
          <div>
              <label id="AWESOME-label"><a target="_blank" href="https://github.com/settings/tokens">AWESOME token: </a></label>
              <input type="checkbox" id="AWESOME-enabled">
          </div>
          <main>
              <input id="AWESOME_TOKEN" type="password" class="swal2-input" value="">
          </main>
      </div>
      <p style="font-size: 0.9em; opacity: 0.8;">复选框切换需刷新页面生效。</p>
  `;

  // --- Configuration ---
  const default_THEME = {
      BGC: { highlightColor: 'rgba(15, 172, 83, 1)', greyColor: 'rgba(245, 245, 245, 0.24)', isEnabled: true },
      TIME_BOUNDARY: { number: 30, select: 'day' },
      FONT: { highlightColor: 'rgba(252, 252, 252, 1)', greyColor: 'rgba(0, 0, 0, 1)', isEnabled: true },
      DIR: { highlightColor: 'rgba(15, 172, 83, 1)', greyColor: 'rgba(154, 154, 154, 1)', isEnabled: true },
      SORT: { select: 'desc', isEnabled: true },
      AWESOME: { isEnabled: false },
      TIME_FORMAT: { isEnabled: true },
  };

  let CURRENT_THEME = GM_getValue('CURRENT_THEME', 'light');
  let AWESOME_TOKEN = GM_getValue('AWESOME_TOKEN', '');
  let THEME_TYPE = getThemeType();
  const config_JSON = JSON.parse(GM_getValue('config_JSON', JSON.stringify({ light: default_THEME })));
  let THEME = config_JSON[THEME_TYPE] || default_THEME;

  const configPickr = {
      theme: 'monolith',
      components: {
          preview: true, opacity: true, hue: true,
          interaction: { rgba: true, input: true, clear: true, save: true },
      },
  };

  // --- Helper Functions ---

  function getThemeType() {
      let themeType = CURRENT_THEME;
      if (CURRENT_THEME === 'auto') {
          themeType = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return themeType;
  }

  function initPickr(el_default) {
      const pickr = Pickr.create({ ...configPickr, ...el_default });
      pickr.on('save', (color, instance) => {
          pickr.hide();
      });
  }

  function getUpdatedThemeConfig() {
      let updatedTheme = {};
      for (const [themeKey, themeVal] of Object.entries(default_THEME)) {
          updatedTheme[themeKey] = {};
          for (let [key, val] of Object.entries(themeVal)) {
              if (key === 'highlightColor' || key === 'greyColor') {
                  const type = key === 'highlightColor' ? 'highlight' : 'grey';
                  val = $(`#${themeKey}-${type}-color-value .pcr-button`).css('--pcr-color');
              } else if (key === 'isEnabled') {
                  val = $(`#${themeKey}-enabled`).prop('checked');
              } else if (key === 'number' || key === 'select') {
                  val = $(`#${themeKey}-${key}`).val();
              }
              updatedTheme[themeKey][key] = val;
          }
      }
      return updatedTheme;
  }

  function handelData(theme) {
      if (!theme) return;
      for (const [themeKey, themeVal] of Object.entries(theme)) {
          for (const [key, val] of Object.entries(themeVal)) {
              if (key === 'highlightColor' || key === 'greyColor') {
                  const type = key === 'highlightColor' ? 'highlight' : 'grey';
                  $(`#${themeKey}-${type}-color-value .pcr-button`).css('--pcr-color', val);
              } else if (key === 'isEnabled') {
                  $(`#${themeKey}-enabled`).prop('checked', val);
              } else if (key === 'number' || key === 'select') {
                  $(`#${themeKey}-${key}`).val(val);
              }
          }
      }
  }

  // --- UI Construction ---

  function createSettingsPanel() {
      Swal.fire({
          title: `GitHub Freshness Settings`,
          html: PanelDom,
          focusConfirm: false,
          preConfirm: () => {
              const updated_THEME = getUpdatedThemeConfig();
              CURRENT_THEME = $('#CURRENT_THEME-select').val();
              AWESOME_TOKEN = $('#AWESOME_TOKEN').val();

              GM_setValue('config_JSON', JSON.stringify({
                  ...config_JSON,
                  [$('#THEME-select').val()]: updated_THEME,
              }));
              GM_setValue('CURRENT_THEME', CURRENT_THEME);
              GM_setValue('AWESOME_TOKEN', AWESOME_TOKEN);

              THEME = updated_THEME;
              GitHub_Freshness(updated_THEME);

              Swal.fire({ position: 'top-center', background: '#4ab96f', icon: 'success', title: 'Saved!', showConfirmButton: false, timer: 800 });
          },
          heightAuto: false,
          showCancelButton: true,
          confirmButtonText: 'Save',
          didOpen: () => {
             initSettings(THEME);
             $('#THEME-select').on('change', function () {
                  let selectedTheme = $(this).val();
                  let theme = config_JSON[selectedTheme] || default_THEME;
                  handelData(theme);
              });
          }
      });
  }

  function initSettings(theme) {
      if (!theme) theme = default_THEME;
      const setupPickr = (id, color) => initPickr({ el: id, default: color });

      setupPickr('#BGC-highlight-color-pickr', theme.BGC.highlightColor);
      setupPickr('#BGC-grey-color-pickr', theme.BGC.greyColor);
      setupPickr('#FONT-highlight-color-pickr', theme.FONT.highlightColor);
      setupPickr('#FONT-grey-color-pickr', theme.FONT.greyColor);
      setupPickr('#DIR-highlight-color-pickr', theme.DIR.highlightColor);
      setupPickr('#DIR-grey-color-pickr', theme.DIR.greyColor);

      $('#THEME-select').val(getThemeType());
      $('#CURRENT_THEME-select').val(CURRENT_THEME);
      $('#AWESOME_TOKEN').val(AWESOME_TOKEN);
      handelData(theme);
  }

  // --- DOM Manipulation Helpers ---

  function setElementBGC(el, BGC, timeResult) {
      if (el.length && BGC.isEnabled) {
          // Use setProperty with 'important' to guarantee override
          el[0].style.setProperty('background-color', timeResult ? BGC.highlightColor : BGC.greyColor, 'important');
      }
  }

  function setElementDIR(el, DIR, timeResult) {
      if (el.length && DIR.isEnabled) {
          const color = timeResult ? DIR.highlightColor : DIR.greyColor;
          // CRITICAL FIX: Use setProperty with 'important' to force color on SVG
          if (el[0]) {
              el[0].style.setProperty('fill', color, 'important');
              el[0].style.setProperty('stroke', color, 'important');
          }
          // Also set attr for maximal compatibility
          el.attr('fill', color);
          el.attr('stroke', color);
      }
  }

  function setElementFONT(el, FONT, timeResult) {
      if (FONT.isEnabled) {
          // CRITICAL FIX: Use setProperty with 'important' to force font color
          el[0].style.setProperty('color', timeResult ? FONT.highlightColor : FONT.greyColor, 'important');
      }
  }

  function setElementTIME_FORMAT(el, TIME_FORMAT, datetime) {
      if (TIME_FORMAT.isEnabled && el.css('display') !== 'none') {
          el.css('display', 'none');
          const formattedDate = formatDate(datetime);
          if (el.parent().find('.formatted-date-span').length === 0) {
              el.before(`<span class="formatted-date-span">${formattedDate}</span>`);
          }
      } else if (!TIME_FORMAT.isEnabled) {
          el.parent().find('.formatted-date-span').remove();
          el.css('display', 'block');
      }
  }

  function formatDate(isoDateString) {
      return DateTime.fromISO(isoDateString).toFormat('yyyy-MM-dd');
  }

  function handelTime(time, time_boundary, type = 'ISO8601') {
      const { number, select } = time_boundary;
      let days = 0;
      switch (select) {
          case 'day': days = number; break;
          case 'week': days = number * 7; break;
          case 'month': days = number * 30; break;
          case 'year': days = number * 365; break;
          default: days = 30;
      }

      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() - days);

      let inputDate;
      if (type === 'UTC') {
          try {
             const dt = DateTime.fromFormat(time, "yyyy年M月d日 'GMT'Z HH:mm", { zone: 'UTC' }).setZone('Asia/Shanghai');
             inputDate = dt.toJSDate();
          } catch(e) {
             console.error("Error parsing search result date:", e);
             inputDate = new Date(); // Fallback
          }
      } else {
          inputDate = new Date(time);
      }

      return inputDate >= thresholdDate;
  }

  // --- Core Logic ---

  function toAPIUrl(href) {
      const match = href.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)/);
      return match ? `https://api.github.com/repos/${match[1]}/${match[2]}` : null;
  }

  function GitHub_FreshnessAwesome(theme) {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(el => {
              if (el.isIntersecting && el.target.getAttribute('request') !== 'true') {
                  const href = $(el.target).attr('href');
                  const apiHref = toAPIUrl(href);
                  if(!apiHref) return;

                  el.target.setAttribute('request', 'true'); // Prevent double fetch

                  $.ajax({
                      url: apiHref,
                      method: 'GET',
                      headers: AWESOME_TOKEN ? { 'Authorization': `token ${AWESOME_TOKEN}` } : {},
                      success: function (data) {
                          const timeResult = handelTime(data.updated_at, theme.TIME_BOUNDARY);
                          if (theme.AWESOME.isEnabled) {
                              $(el.target).after(
                                  `<span class="freshness-stars">★${data.stargazers_count}</span>` +
                                  `<span class="freshness-updated">📅${formatDate(data.updated_at)}</span>`
                              );
                              $(el.target).css('padding', '0 12px');
                          }
                          setElementBGC($(el.target), theme.BGC, timeResult);
                          setElementFONT($(el.target), theme.FONT, timeResult);
                      },
                      error: function (err) {
                          if (err.status === 403) console.warn("GitHub API Rate Limit Exceeded");
                      }
                  });
              }
          });
      }, { threshold: 0.5 });

      // FIX: Use highly generic containers for Awesome lists
      $('.Box-row a, .markdown-body a').each(function () {
          if (/^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/.test($(this).attr('href'))) {
              observer.observe(this);
          }
      });
  }

  function GitHub_FreshnessSearchPage(theme) {
      // Stable entry point
      const elements = $('relative-time[datetime]');

      if (elements.length === 0) return;

      elements.each(function () {
          const title = $(this).attr('title') || $(this).attr('datetime');
          if (title) {
              const timeResult = handelTime(title, theme.TIME_BOUNDARY, $(this).is('[datetime]') ? 'ISO8601' : 'UTC');

              // FIX: Use most stable search result row container (targeting the card/list item)
              const BGC_element = $(this).closest('div[data-testid*="results-card"], li, article, .Box-row');

              setElementBGC(BGC_element, theme.BGC, timeResult);
              setElementFONT($(this), theme.FONT, timeResult);

              if (theme.TIME_FORMAT.isEnabled) {
                   try {
                       let dt;
                       if($(this).is('[datetime]')) {
                           dt = DateTime.fromISO($(this).attr('datetime'));
                       } else {
                           dt = DateTime.fromFormat(title, "yyyy年M月d日 'GMT'Z HH:mm", { zone: 'UTC' }).setZone('Asia/Shanghai');
                       }
                       if (dt.isValid) $(this).text(dt.toFormat('yyyy-MM-dd'));
                   } catch(e) {}
              }
          }
      });
  }

  function GitHub_Freshness(theme) {
      if (!theme) theme = THEME;
      const matchUrl = isMatchedUrl();
      if (!matchUrl) return;

      if (matchUrl === 'matchSearchPage') {
          return GitHub_FreshnessSearchPage(theme);
      }

      // NEW FIX: Apply background color to the table header row (if found)
      if (theme.BGC.isEnabled) {
          // Look for the header row container which has role="row" and typically contains text like "Latest commit"
          const headerRow = $('div[role="row"]:has(span:contains("Latest commit"))').first();
          if (headerRow.length) {
              // Apply a neutral/grey background color to the entire header row
              headerRow[0].style.setProperty('background-color', theme.BGC.greyColor, 'important');
          }
      }

      // Repo File List Logic (Tree View)
      const timeElements = $('relative-time[datetime]');
      if (timeElements.length === 0) return;

      let trRows = [];

      timeElements.each(function (index) {
          const datetime = $(this).attr('datetime');
          if (datetime) {
              const timeResult = handelTime(datetime, theme.TIME_BOUNDARY);

              // Row Container (Verified working)
              const trElement = $(this).closest('tr, li, div[role="row"], [data-testid*="row"], .Box-row');

              if (trElement.length) {
                  trRows.push(trElement[0]);

                  // BGC FIX (Height Match): Target the last child of the row container (which is the date column)
                  const BGC_element = $(trElement).children().last();

                  // ICON Element
                  const ICON_element = trElement.find('svg').first();

                  setElementBGC(BGC_element, theme.BGC, timeResult); // Applies BGC to the last column
                  setElementDIR(ICON_element, theme.DIR, timeResult); // Applies color to SVG
                  setElementFONT($(this).parent(), theme.FONT, timeResult); // Applies color to date text container

                  setElementTIME_FORMAT($(this), theme.TIME_FORMAT, datetime);
              }
          }
      });

      // Sorting (Verified working)
      if (theme.SORT.isEnabled && trRows.length > 0) {
          trRows.sort((a, b) => {
              const tA = new Date($(a).find('relative-time').attr('datetime'));
              const tB = new Date($(b).find('relative-time').attr('datetime'));
              return theme.SORT.select === 'asc' ? tA - tB : tB - tA;
          });

          const parentContainer = $(trRows[0]).parent();
          if (parentContainer.length) {
              parentContainer.append(trRows);
          }
      }
  }

  function isMatchedUrl() {
      const href = window.location.href;
      if (/^https:\/\/github\.com\/search\?.*$/.test(href)) return 'matchSearchPage';
      if (/^https:\/\/github\.com\/[^/]+\/[^/]+(?:\?.*)?$|^https:\/\/github\.com\/[^/]+\/[^/]+\/tree\/.+$/.test(href)) return 'matchRepoPage';
      return null;
  }

  // --- Initialization & Event Listeners ---

  function debounce(func, wait) {
      let timeout;
      return function (...args) {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(this, args), wait);
      };
  }

  const runScript = debounce(() => {
      GitHub_Freshness();
  }, 350);

  // Initial Load
  $(function() {
      console.log('GitHub Freshness Loaded');
      runScript();
  });

  // Navigation Handling (PJAX, PopState, PushState)
  document.addEventListener('pjax:end', runScript);
  window.addEventListener('popstate', () => setTimeout(runScript, 350));

  // Hook into History API for SPA navigation
  const originalPush = history.pushState;
  const originalReplace = history.replaceState;

  history.pushState = function () {
      originalPush.apply(this, arguments);
      setTimeout(runScript, 350);
  };

  history.replaceState = function () {
      originalReplace.apply(this, arguments);
      setTimeout(runScript, 350);
  };

  // Register Menu
  GM_registerMenuCommand('⚙️ Settings', createSettingsPanel);

  // System Theme Listener
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (CURRENT_THEME === 'auto') {
          THEME = config_JSON[e.matches ? 'dark' : 'light'] || default_THEME;
          GitHub_Freshness(THEME);
      }
  });

})();