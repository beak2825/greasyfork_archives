// ==UserScript==
// @name         HWM Telegram Notifier
// @name:ru      HWM Telegram Уведомления
// @version      1.2
// @description  Delayed Telegram notifications for work, smith repair, enchantment, premium, and faction potions in HeroeswM/LordsWM
// @description:ru  Отложенные Telegram-уведомления о работе, ремонте, улучшениях, премиуме и зельях фракций в HeroeswM/LordsWM
// @author       Vladislav Dobromyslov
// @license      MIT
// @homepageURL  https://greasyfork.org/ru/scripts/563223-hwm-telegram-notifier
// @supportURL   https://greasyfork.org/ru/scripts/563223-hwm-telegram-notifier/feedback
// @match        *://heroeswm.ru/*
// @match        *://www.heroeswm.ru/*
// @match        *://lordswm.com/*
// @match        *://www.lordswm.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      207.180.209.174
// @namespace https://greasyfork.org/users/1487391
// @downloadURL https://update.greasyfork.org/scripts/563223/HWM%20Telegram%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/563223/HWM%20Telegram%20Notifier.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ============================================
  // GLOBAL CONFIGURATION
  // ============================================

  // Language detection
  const isEn = location.hostname.includes("lordswm.com");
  const LANG = isEn ? "en" : "ru";

  // ============================================
  // INTERNATIONALIZATION (i18n)
  // ============================================

  const I18N = {
    en: {
      // Detection patterns
      underRepair: "Under repair",
      successfullyEnrolled: "You have successfully enrolled",
      inProgress: "Complete in",
      yourRental: "Your rental",
      repairPricePattern: /Repair:\s*([\d,]+)/i,
      hoursPattern: /(\d+)\s*h\./i,
      minutesPattern: /(\d+)\s*min\./i,
      // Faction potion pattern: "Skill potion for Knight faction till 2024-02-06 11:07"
      factionPotionPattern:
        /Skill potion for (Knight|Necromancer|Wizard|Elf|Barbarian|Dark elf|Demon|Dwarf|Tribal|Pharaoh) faction till (\d{4}-\d{2}-\d{2} \d{2}:\d{2})/,
      // Faction potion inventory hint pattern
      factionPotionHint: "Potion of skill",

      // UI labels
      telegramNotifications: "Telegram Notifications",
      apiToken: "API Token",
      save: "Save",
      clear: "Clear",

      // Token status
      tokenConfigured: "Token configured",
      noTokenConfigured: "No token configured",

      // Token input
      enterNewToken: "Enter new token...",

      // Alerts and confirmations
      tokenSaved: "Token saved!",
      clearTokenConfirm: "Clear current token?",
      tokenCleared: "Token cleared. Refresh the page to set a new token.",
      invalidTokenFormat:
        "Invalid token format. Token must be at least 16 characters (letters, numbers, underscore, hyphen).",

      // Notification types
      notificationTypes: {
        work: "Work enrollment",
        smith: "Smith repair",
        enchantment: "Enchantment/Craft",
        premium: "Abu Bekr's blessing",
        faction_potion: "Faction potions",
      },
    },
    ru: {
      // Detection patterns
      underRepair: "В ремонте",
      successfullyEnrolled: "Вы устроены на работу",
      inProgress: "В работе",
      yourRental: "Ваша аренда",
      repairPricePattern: /Ремонт:\s*([\d,]+)/i,
      hoursPattern: /(\d+)\s*ч\./i,
      minutesPattern: /(\d+)\s*мин\./i,
      // Faction potion pattern: "Зелье фракции Гном до 06-02-24 11:07"
      factionPotionPattern:
        /Зелье фракции (Рыцарь|Некромант|Маг|Эльф|Варвар|Темный эльф|Демон|Гном|Степной варвар|Фараон) до (\d{2}-\d{2}-\d{2} \d{2}:\d{2})/,
      // Faction potion inventory hint pattern
      factionPotionHint: "Зелье фракции",

      // UI labels
      telegramNotifications: "Telegram уведомления",
      apiToken: "API токен",
      save: "Сохранить",
      clear: "Очистить",

      // Token status
      tokenConfigured: "Токен настроен",
      noTokenConfigured: "Токен не настроен",

      // Token input
      enterNewToken: "Введите новый токен...",

      // Alerts and confirmations
      tokenSaved: "Токен сохранён!",
      clearTokenConfirm: "Очистить текущий токен?",
      tokenCleared: "Токен очищён. Обновите страницу для ввода нового.",
      invalidTokenFormat:
        "Неверный формат токена. Токен должен быть не менее 16 символов (буквы, цифры, подчёркивание, дефис).",

      // Notification types
      notificationTypes: {
        work: "Устройство на работу",
        smith: "Ремонт в кузнице",
        enchantment: "Улучшение/крафт",
        premium: "Благословение Абу-Бекра",
        faction_potion: "Зелья фракций",
      },
    },
  };

  // Shorthand for current language strings
  const T = I18N[LANG];

  // ============================================
  // STORAGE HELPERS
  // ============================================

  function isNotificationEnabled(type) {
    return GM_getValue(`notify_${type}`, true);
  }

  function setNotificationEnabled(type, enabled) {
    GM_setValue(`notify_${type}`, enabled);
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  function isValidToken(token) {
    return /^[a-zA-Z0-9_-]{16,}$/.test(token);
  }

  const TOKEN_STATUS_COLORS = {
    configured: "#5a7a3a",
    notConfigured: "#a05a5a",
  };

  function updateTokenStatus(statusElement) {
    const hasToken = GM_getValue("api_token", null) !== null;

    statusElement.textContent = hasToken
      ? T.tokenConfigured
      : T.noTokenConfigured;
    statusElement.style.color = hasToken
      ? TOKEN_STATUS_COLORS.configured
      : TOKEN_STATUS_COLORS.notConfigured;

    return hasToken;
  }

  // Parse repair time from text, returns total seconds or null
  function parseRepairTime(text) {
    let hours = 0;
    let minutes = 0;

    // Match hours: "2h." or "2ч."
    const hoursMatch = T.hoursPattern.exec(text);
    if (hoursMatch) {
      hours = parseInt(hoursMatch[1], 10);
    }

    // Match minutes: "45min." or "45 мин."
    const minutesMatch = T.minutesPattern.exec(text);
    if (minutesMatch) {
      minutes = parseInt(minutesMatch[1], 10);
    }

    if (hours === 0 && minutes === 0) {
      return null;
    }

    return hours * 3600 + minutes * 60 + 60;
  }

  // Extract artifact ID from art_info.php link
  function extractArtifactId(artLink) {
    if (!artLink) {
      return null;
    }
    const match = /id=([a-zA-Z0-9_]+)/.exec(artLink.href);
    return match ? match[1] : null;
  }

  // Parse Moscow time date string to UTC Date object
  // EN format: "2024-02-06 11:07" (YYYY-MM-DD HH:MM)
  // RU format: "06-02-24 11:07" (DD-MM-YY HH:MM)
  // Game always displays dates in Moscow time (UTC+3)
  function parseMoscowDate(dateText) {
    const pattern = isEn
      ? /(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2})/
      : /(\d{2})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2})/;
    const match = pattern.exec(dateText);
    if (!match) {
      return null;
    }

    let year, month, day, hours, minutes;

    if (isEn) {
      year = parseInt(match[1], 10);
      month = parseInt(match[2], 10);
      day = parseInt(match[3], 10);
      hours = parseInt(match[4], 10);
      minutes = parseInt(match[5], 10);
    } else {
      day = parseInt(match[1], 10);
      month = parseInt(match[2], 10);
      year = 2000 + parseInt(match[3], 10);
      hours = parseInt(match[4], 10);
      minutes = parseInt(match[5], 10);
    }

    return new Date(Date.UTC(year, month - 1, day, hours - 3, minutes, 0));
  }

  // Buffer added to timeout to ensure notification arrives after the event expires
  const EXPIRATION_BUFFER_SECS = 60;

  function formatTimeout(timeoutSecs) {
    const hours = Math.floor(timeoutSecs / 3600);
    const minutes = Math.floor((timeoutSecs % 3600) / 60);
    return `${hours}h ${minutes}m (${timeoutSecs}s)`;
  }

  function logTimeout(label, timeoutSecs) {
    console.log(`HWM Notifier: ${label}, ${formatTimeout(timeoutSecs)}`);
  }

  // Calculate timeout in seconds from an expiration date
  // Returns null if already expired, otherwise timeout with buffer
  function calculateTimeoutFromExpiration(expirationDate) {
    const timeoutMs = expirationDate.getTime() - Date.now();
    if (timeoutMs <= 0) {
      return null;
    }
    return Math.ceil(timeoutMs / 1000) + EXPIRATION_BUFFER_SECS;
  }

  // ============================================
  // UI COMPONENTS
  // ============================================

  function createSettingsMenu() {
    const NOTIFICATION_TYPES = [
      { id: "premium" },
      { id: "faction_potion" },
      { id: "work" },
      { id: "smith" },
      { id: "enchantment" },
    ];

    const hourglassIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>`;

    // Remove any old elements (from previous versions)
    document
      .querySelectorAll(
        ".hwm-notifier-btn, .hwm-notifier-wrapper, .hwm-notifier-item, .hwm-notifier-service-btn, .hwm-notifier-overlay",
      )
      .forEach((el) => {
        // Clean up Escape key listener from old overlays to prevent memory leak
        if (el._escapeHandler) {
          document.removeEventListener("keydown", el._escapeHandler);
        }
        el.remove();
      });

    // Find "Персональные настройки" link in services table
    const settingsLinks = document.querySelectorAll(
      'a[href="pers_settings.php"]',
    );
    let targetLink = null;

    for (const link of settingsLinks) {
      // Check if this is in the services table (home_button3_parent)
      if (link.closest(".home_button3_parent")) {
        targetLink = link;
        break;
      }
    }

    if (!targetLink) {
      console.warn("[HWM Notifier] Services table settings link not found");
      return;
    }

    // Add CSS styles
    const style = document.createElement("style");
    style.textContent = `
      .hwm-notifier-service-btn { cursor: pointer; }
      .hwm-notifier-icon { stroke: #5d4e37; }
      .hwm-notifier-overlay {
        display: none;
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
        justify-content: center;
        align-items: center;
      }
      .hwm-notifier-overlay.show { display: flex; }
      .hwm-notifier-popup {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: optimizeQuality;
        font-size: 90%;
        width: 500px;
        margin: 0 auto;
        padding: 1em 0;
        display: flex;
        flex-direction: column;
        position: relative;
        background-color: #f5f3ea;
        background: url(https://dcdn.heroeswm.ru/i/homeico/corner_lt2.png) no-repeat top left,
                    url(https://dcdn.heroeswm.ru/i/homeico/corner_rt2.png) no-repeat top right,
                    url(https://dcdn.heroeswm.ru/i/homeico/corner_lb2.png) no-repeat bottom left,
                    url(https://dcdn.heroeswm.ru/i/homeico/corner_rb2.png) no-repeat bottom right #f5f3ea;
        background-size: 14px;
        box-shadow: inset 0 0 0 1px #b19673, 0 2px 5px rgba(0,0,0,0.25);
        border-radius: 3px;
        text-align: left;
      }
      .hwm-notifier-popup-header {
        padding: 0.5em 1em;
        font-weight: bold;
        font-size: 16px;
        color: #5d4e37;
        border-bottom: 1px solid #b19673;
        margin-bottom: 0.5em;
        text-align: center;
      }
      .hwm-notifier-close { cursor: pointer; float: right; }
      .hwm-notifier-popup-content {
        padding: 0 1em;
      }
      .hwm-notifier-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid rgba(177,150,115,0.3);
      }
      .hwm-notifier-row:last-child { border-bottom: none; }
      .hwm-notifier-row label {
        font-size: 13px;
        color: #3e2723;
        cursor: pointer;
      }
      .hwm-notifier-toggle {
        appearance: none;
        -webkit-appearance: none;
        width: 36px; height: 18px;
        background: #c9b896;
        border: 1px solid #85734f;
        border-radius: 9px;
        cursor: pointer;
        position: relative;
      }
      .hwm-notifier-toggle::after {
        content: "";
        position: absolute;
        top: 2px; left: 2px;
        width: 12px; height: 12px;
        background: #f5f3ea;
        border-radius: 50%;
        transition: left .15s;
      }
      .hwm-notifier-toggle:checked { background: #7a9a5a; border-color: #5a7a3a; }
      .hwm-notifier-toggle:checked::after { left: 20px; }
      .hwm-notifier-token-row {
        display: flex;
        flex-direction: column;
        padding: 8px 0;
        border-bottom: 1px solid rgba(177,150,115,0.3);
      }
      .hwm-notifier-token-row:last-child { border-bottom: none; }
      .hwm-notifier-token-label {
        font-size: 13px;
        color: #3e2723;
        margin-bottom: 4px;
      }
      .hwm-notifier-token-input-wrapper {
        display: flex;
        gap: 8px;
      }
      .hwm-notifier-token-input {
        flex: 1;
        padding: 4px 8px;
        font-size: 12px;
        border: 1px solid #85734f;
        border-radius: 3px;
        background: #fff;
        font-family: monospace;
      }
      .hwm-notifier-token-btn {
        padding: 4px 12px;
        font-size: 12px;
        background: #7a9a5a;
        color: #fff;
        border: 1px solid #5a7a3a;
        border-radius: 3px;
        cursor: pointer;
      }
      .hwm-notifier-token-btn:hover { background: #6a8a4a; }
      .hwm-notifier-token-btn.danger { background: #a05a5a; border-color: #7a3a3a; }
      .hwm-notifier-token-btn.danger:hover { background: #904a4a; }
    `;
    document.head.appendChild(style);

    // Create service button (same style as other items in table)
    const serviceBtn = document.createElement("div");
    serviceBtn.className =
      "home_button3 home_button_text_left3 hwm-notifier-service-btn";
    serviceBtn.style.fontWeight = "normal";
    serviceBtn.innerHTML = `
      <span>${T.telegramNotifications}</span>
      <div class="home_scroll_content_expand_left">
        ${hourglassIcon.replace('stroke="currentColor"', 'class="hwm-notifier-icon home_scroll_content_expand_sign home_scroll_content_expand_sign_left3"')}
      </div>
    `;

    // Create popup overlay
    const overlay = document.createElement("div");
    overlay.className = "hwm-notifier-overlay";

    // Create popup
    const popup = document.createElement("div");
    popup.className = "hwm-notifier-popup";

    // Popup header
    const popupHeader = document.createElement("div");
    popupHeader.className = "hwm-notifier-popup-header";
    popupHeader.innerHTML = `
      ${T.telegramNotifications}
      <span class="hwm-notifier-close">&times;</span>
    `;

    // Popup content
    const popupContent = document.createElement("div");
    popupContent.className = "hwm-notifier-popup-content";

    NOTIFICATION_TYPES.forEach((type) => {
      const row = document.createElement("div");
      row.className = "hwm-notifier-row";

      const typeLabel = T.notificationTypes[type.id];

      const label = document.createElement("label");
      label.textContent = typeLabel;
      label.htmlFor = `hwm-toggle-${type.id}`;

      const toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggle.id = `hwm-toggle-${type.id}`;
      toggle.name = `hwm-toggle-${type.id}`;
      toggle.className = "hwm-notifier-toggle";
      toggle.checked = isNotificationEnabled(type.id);
      toggle.setAttribute("role", "switch");
      toggle.setAttribute("aria-checked", toggle.checked);
      toggle.setAttribute("aria-label", typeLabel);
      toggle.onchange = () => {
        setNotificationEnabled(type.id, toggle.checked);
        toggle.setAttribute("aria-checked", toggle.checked);
      };

      row.appendChild(label);
      row.appendChild(toggle);
      popupContent.appendChild(row);
    });

    // Token management section (last item)
    const tokenRow = document.createElement("div");
    tokenRow.className = "hwm-notifier-token-row";

    const tokenLabel = document.createElement("label");
    tokenLabel.className = "hwm-notifier-token-label";
    tokenLabel.textContent = T.apiToken;

    const tokenInputWrapper = document.createElement("div");
    tokenInputWrapper.className = "hwm-notifier-token-input-wrapper";

    const tokenInput = document.createElement("input");
    tokenInput.type = "password";
    tokenInput.className = "hwm-notifier-token-input";
    tokenInput.placeholder = T.enterNewToken;

    const saveTokenBtn = document.createElement("button");
    saveTokenBtn.className = "hwm-notifier-token-btn";
    saveTokenBtn.textContent = T.save;

    const clearTokenBtn = document.createElement("button");
    clearTokenBtn.className = "hwm-notifier-token-btn danger";
    clearTokenBtn.textContent = T.clear;

    tokenInputWrapper.appendChild(tokenInput);
    tokenInputWrapper.appendChild(saveTokenBtn);
    tokenInputWrapper.appendChild(clearTokenBtn);

    tokenRow.appendChild(tokenLabel);
    tokenRow.appendChild(tokenInputWrapper);
    popupContent.appendChild(tokenRow);

    // Current token indicator
    const currentTokenRow = document.createElement("div");
    currentTokenRow.className = "hwm-notifier-token-row";
    currentTokenRow.style.paddingTop = "4px";

    const tokenStatus = document.createElement("span");
    tokenStatus.style.fontSize = "11px";
    updateTokenStatus(tokenStatus);
    currentTokenRow.appendChild(tokenStatus);
    popupContent.appendChild(currentTokenRow);

    // Token management handlers (defined before DOM append)
    saveTokenBtn.onclick = () => {
      const newToken = tokenInput.value.trim();
      if (!newToken) return;

      if (!isValidToken(newToken)) {
        alert(T.invalidTokenFormat);
        return;
      }

      GM_setValue("api_token", newToken);
      tokenInput.value = "";
      updateTokenStatus(tokenStatus);
      alert(T.tokenSaved);
    };

    clearTokenBtn.onclick = () => {
      if (confirm(T.clearTokenConfirm)) {
        GM_setValue("api_token", null);
        updateTokenStatus(tokenStatus);
        alert(T.tokenCleared);
      }
    };

    popup.appendChild(popupHeader);
    popup.appendChild(popupContent);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Open popup on button click
    serviceBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      overlay.classList.add("show");
    };

    // Close popup on overlay click
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("show");
      }
    };

    // Close popup on X click
    popupHeader.querySelector(".hwm-notifier-close").onclick = () => {
      overlay.classList.remove("show");
    };

    // Close popup on Escape key (store reference for cleanup)
    overlay._escapeHandler = (e) => {
      if (e.key === "Escape" && overlay.classList.contains("show")) {
        overlay.classList.remove("show");
      }
    };
    document.addEventListener("keydown", overlay._escapeHandler);

    // Insert button after "Персональные настройки"
    targetLink.insertAdjacentElement("afterend", serviceBtn);
  }

  // ============================================
  // TOKEN MANAGEMENT
  // ============================================

  function getToken() {
    let token = GM_getValue("api_token", null);

    if (!token) {
      token = prompt(
        "HWM Notifier: Enter your API Token\n\n" +
          "To get your token:\n" +
          "1. Message @hwm_telegram_notifier_bot on Telegram\n" +
          "2. Send /start command\n" +
          "3. Copy the token it sends you",
      );

      if (!token || !(token = token.trim())) {
        return null;
      }
      GM_setValue("api_token", token);
    }

    return token;
  }

  // ============================================
  // NOTIFICATION CORE
  // ============================================

  function sendNotification(apiToken, messageType, timeoutSecs) {
    const SERVER_URL = "http://207.180.209.174:5000";

    const payload = {
      token: apiToken,
      message_type: messageType,
      timeout_secs: timeoutSecs,
      lang: LANG,
    };

    GM_xmlhttpRequest({
      method: "POST",
      url: `${SERVER_URL}/notify`,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(payload),
      onload: function (response) {
        if (response.status === 200) {
          console.log("Notification queued:", response.responseText);
        } else if (response.status === 409) {
          console.log("Notification already scheduled:", response.responseText);
        } else {
          console.error(
            "Server error:",
            response.status,
            response.responseText,
          );
        }
      },
      onerror: function (error) {
        console.error("Request failed:", error);
      },
    });
  }

  // ============================================
  // PAGE DETECTION FUNCTIONS
  // ============================================

  function checkWorkEnrollment(apiToken) {
    const WORK_TIMEOUT_SECS = 3600;
    const WORK_PATHS = ["/object_do.php", "/object-info.php"];

    if (
      !WORK_PATHS.includes(location.pathname) ||
      !document.body.innerHTML.includes(T.successfullyEnrolled) ||
      !isNotificationEnabled("work")
    ) {
      return;
    }

    sendNotification(apiToken, "work", WORK_TIMEOUT_SECS);
  }

  function checkSmithRepair(apiToken) {
    if (location.pathname !== "/mod_workbench.php") {
      return;
    }

    if (!isNotificationEnabled("smith")) {
      return;
    }

    const tables = document.querySelectorAll("table.wbwhite");
    let timeoutSecs = null;

    for (const table of tables) {
      const tableText = table.innerText;
      if (tableText.includes(T.underRepair)) {
        timeoutSecs = parseRepairTime(tableText);
        break;
      }
    }

    if (timeoutSecs) {
      sendNotification(apiToken, "smith", timeoutSecs);
      logTimeout("Smith repair", timeoutSecs);
    }
  }

  function checkEnchantment(apiToken) {
    if (location.pathname !== "/mod_workbench.php") {
      return;
    }

    if (!isNotificationEnabled("enchantment")) {
      return;
    }

    const tables = document.querySelectorAll("table.wbwhite");

    for (const table of tables) {
      const tableText = table.innerText;
      if (
        !tableText.includes(T.inProgress) ||
        tableText.includes(T.underRepair)
      ) {
        continue;
      }

      const timeoutSecs = parseRepairTime(tableText);
      if (timeoutSecs) {
        sendNotification(apiToken, "enchantment", timeoutSecs);
        logTimeout("Enchantment", timeoutSecs);
      }
    }
  }

  function checkClanRepair(apiToken) {
    if (
      location.pathname !== "/sklad_info.php" ||
      !isNotificationEnabled("smith")
    ) {
      return;
    }

    checkConfirmedClanRepairs(apiToken);
    attachClanRepairHandlers();
  }

  function checkConfirmedClanRepairs(apiToken) {
    // Game formula: 4000 gold = 1 hour of repair time
    const REPAIR_RATE_GOLD_PER_HOUR = 4000;
    const PENDING_TTL_MS = 5 * 60 * 1000; // 5 minutes

    // Find "Ваша аренда" / "Your rental" section
    const allTds = document.querySelectorAll("td.wblight");
    let rentalSection = null;

    for (const td of allTds) {
      if (td.innerText.includes(T.yourRental)) {
        rentalSection = td.closest("tr")?.nextElementSibling;
        break;
      }
    }

    if (!rentalSection) {
      return;
    }

    const itemCells = rentalSection.querySelectorAll("td");

    for (const cell of itemCells) {
      if (!cell.innerText.includes(T.underRepair)) {
        continue;
      }

      // Extract artifact ID from art_info.php link
      let artLink = cell.querySelector('a[href*="art_info.php"]');
      if (!artLink) {
        const parentContainer = cell.closest("td[bgcolor]");
        if (parentContainer) {
          artLink = parentContainer.querySelector('a[href*="art_info.php"]');
        }
      }
      const artifactId = extractArtifactId(artLink);
      if (!artifactId) {
        continue;
      }

      const pendingData = GM_getValue(
        `pending_clan_repair_${artifactId}`,
        null,
      );
      if (!pendingData) {
        continue;
      }

      // Verify it's recent (within last 5 minutes to avoid stale data)
      if (Date.now() - pendingData.timestamp > PENDING_TTL_MS) {
        GM_deleteValue(`pending_clan_repair_${artifactId}`);
        continue;
      }

      const timeoutSecs =
        Math.ceil((pendingData.price / REPAIR_RATE_GOLD_PER_HOUR) * 3600) + 60;

      sendNotification(apiToken, "smith", timeoutSecs);
      console.log(
        `HWM Notifier: Clan repair confirmed for ${artifactId}, price ${pendingData.price}, ${formatTimeout(timeoutSecs)}`,
      );

      GM_deleteValue(`pending_clan_repair_${artifactId}`);
    }
  }

  function attachClanRepairHandlers() {
    const repairLinks = document.querySelectorAll('a[href*="action=repair"]');

    for (const link of repairLinks) {
      const container = link.closest("td");
      if (!container) {
        continue;
      }

      const containerText = container.innerText;
      const priceMatch = T.repairPricePattern.exec(containerText);

      if (!priceMatch) {
        continue;
      }

      const price = parseInt(priceMatch[1].replace(/,/g, ""), 10);
      if (isNaN(price) || price <= 0) {
        continue;
      }

      let artLink = container.querySelector('a[href*="art_info.php"]');
      if (!artLink) {
        const parentContainer = container.closest("td[bgcolor]");
        if (parentContainer && parentContainer !== container) {
          artLink = parentContainer.querySelector('a[href*="art_info.php"]');
        }
      }
      const artifactId = extractArtifactId(artLink);
      if (
        !artifactId ||
        GM_getValue(`pending_clan_repair_${artifactId}`, null) ||
        link.dataset.hwmNotifierHandler === "true"
      ) {
        continue;
      }
      link.dataset.hwmNotifierHandler = "true";

      link.addEventListener("click", function () {
        GM_setValue(`pending_clan_repair_${artifactId}`, {
          price: price,
          timestamp: Date.now(),
        });
        console.log(
          `HWM Notifier: Stored pending clan repair for ${artifactId}, price ${price}`,
        );
      });
    }
  }

  function checkPremiumExpiration(apiToken) {
    if (
      location.pathname !== "/home.php" ||
      !isNotificationEnabled("premium")
    ) {
      return;
    }

    const starImage =
      document.querySelector("img[src$='i/star_extend.png']") ||
      document.querySelector("img[src$='i/star.png']");

    if (!starImage) {
      return;
    }

    const expirationInfo = starImage.title || starImage.getAttribute("hint");
    if (!expirationInfo) {
      return;
    }

    const expirationDate = parseMoscowDate(expirationInfo);
    if (!expirationDate) {
      return;
    }

    const timeoutSecs = calculateTimeoutFromExpiration(expirationDate);
    if (!timeoutSecs) {
      return;
    }

    const storageKey = "premium_expiration_notified";
    const storedExpiration = GM_getValue(storageKey, 0);
    if (storedExpiration === expirationDate.getTime()) {
      return;
    }

    GM_setValue(storageKey, expirationDate.getTime());

    sendNotification(apiToken, "premium", timeoutSecs);
    logTimeout("Premium expiration detected", timeoutSecs);
  }

  // Map localized faction names to API faction identifiers
  const FACTION_NAME_MAP = isEn
    ? {
        Knight: "knight",
        Necromancer: "necromancer",
        Wizard: "wizard",
        Elf: "elf",
        Barbarian: "barbarian",
        "Dark elf": "dark_elf",
        Demon: "demon",
        Dwarf: "dwarf",
        Tribal: "tribal",
        Pharaoh: "pharaoh",
      }
    : {
        Рыцарь: "knight",
        Некромант: "necromancer",
        Маг: "wizard",
        Эльф: "elf",
        Варвар: "barbarian",
        "Темный эльф": "dark_elf",
        Демон: "demon",
        Гном: "dwarf",
        "Степной варвар": "tribal",
        Фараон: "pharaoh",
      };

  // Parse faction potions from HTML content, returns array of {factionId, expirationDate}
  function parseFactionPotionsFromHtml(htmlContent) {
    const results = [];
    const pattern = new RegExp(T.factionPotionPattern.source, "g");
    let match;

    while ((match = pattern.exec(htmlContent)) !== null) {
      const localizedFaction = match[1];
      const dateText = match[2];

      const factionId = FACTION_NAME_MAP[localizedFaction];
      if (!factionId) {
        console.warn(
          `HWM Notifier: Unknown faction "${localizedFaction}", skipping`,
        );
        continue;
      }

      const expirationDate = parseMoscowDate(dateText);
      if (!expirationDate) {
        continue;
      }

      results.push({ factionId, expirationDate });
    }

    return results;
  }

  function checkFactionPotions(apiToken) {
    if (
      location.pathname !== "/pl_info.php" ||
      !isNotificationEnabled("faction_potion")
    ) {
      return;
    }

    // Get player ID from cookie and verify viewing own profile
    const playerIdMatch = document.cookie.match(/pl_id=(\d+)/);
    if (!playerIdMatch) {
      return;
    }

    const urlParams = new URLSearchParams(location.search);
    const profileId = urlParams.get("id");
    if (profileId && profileId !== playerIdMatch[1]) {
      return;
    }

    const potions = parseFactionPotionsFromHtml(document.body.innerHTML);
    for (const { factionId, expirationDate } of potions) {
      scheduleFactionPotionNotification(apiToken, factionId, expirationDate);
    }
  }

  function scheduleFactionPotionNotification(
    apiToken,
    factionId,
    expirationDate,
  ) {
    const timeoutSecs = calculateTimeoutFromExpiration(expirationDate);
    if (!timeoutSecs) {
      return;
    }

    const storageKey = `faction_potion_${factionId}_notified`;
    const storedExpiration = GM_getValue(storageKey, 0);
    if (storedExpiration === expirationDate.getTime()) {
      return;
    }

    GM_setValue(storageKey, expirationDate.getTime());

    const messageType = `faction_potion_${factionId}`;
    sendNotification(apiToken, messageType, timeoutSecs);

    console.log(
      `HWM Notifier: Faction potion (${factionId}) expiration detected, ${formatTimeout(timeoutSecs)}`,
    );
  }

  function checkInventoryFactionPotion(apiToken) {
    if (
      location.pathname !== "/inventory.php" ||
      !isNotificationEnabled("faction_potion")
    ) {
      return;
    }

    const useButton = document.querySelector("#inv_menu_use_a");
    if (!useButton || useButton.dataset.hwmNotifierHandler === "true") {
      return;
    }
    useButton.dataset.hwmNotifierHandler = "true";

    useButton.addEventListener("click", function () {
      const selectedItem = document.querySelector(".art_is_selected");
      if (!selectedItem) {
        return;
      }

      const itemImage = selectedItem.querySelector("img.cre_mon_image2");
      const hint = itemImage?.getAttribute("hint") || "";

      if (!hint.includes(T.factionPotionHint)) {
        return;
      }

      console.log("HWM Notifier: Faction potion use detected");

      setTimeout(function () {
        fetchProfileAndScheduleFactionPotion(apiToken);
      }, 1500);
    });
  }

  function fetchProfileAndScheduleFactionPotion(apiToken) {
    GM_xmlhttpRequest({
      method: "GET",
      url: `${location.origin}/pl_info.php`,
      onload: function (response) {
        if (response.status !== 200) {
          console.error(
            "HWM Notifier: Failed to fetch profile for faction potion info",
            response.status,
          );
          return;
        }

        const potions = parseFactionPotionsFromHtml(response.responseText);

        if (potions.length === 0) {
          console.log("HWM Notifier: No faction potions found in profile");
          return;
        }

        for (const { factionId, expirationDate } of potions) {
          scheduleFactionPotionNotification(
            apiToken,
            factionId,
            expirationDate,
          );
        }

        console.log(
          `HWM Notifier: Scheduled ${potions.length} faction potion notification(s) from inventory use`,
        );
      },
      onerror: function (error) {
        console.error(
          "HWM Notifier: Failed to fetch profile for faction potion info",
          error,
        );
      },
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  // Create settings menu only on home.php page
  function initSettingsMenu() {
    if (location.pathname === "/home.php") {
      createSettingsMenu();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSettingsMenu);
  } else {
    initSettingsMenu();
  }

  const API_TOKEN = getToken();

  if (!API_TOKEN) {
    console.log(
      "HWM Notifier: No API token configured, notifications disabled",
    );
    return;
  }

  // Run checks on page load
  checkWorkEnrollment(API_TOKEN);
  checkSmithRepair(API_TOKEN);
  checkEnchantment(API_TOKEN);
  checkClanRepair(API_TOKEN);
  checkPremiumExpiration(API_TOKEN);
  checkFactionPotions(API_TOKEN);
  checkInventoryFactionPotion(API_TOKEN);
})();
