// ==UserScript==
// @name         TORN: Attack Assist Requesting DEV
// @namespace    dekleinekobini.private.attack-assist-requesting--dev
// @version      1.0.9
// @author       DeKleineKobini [2114440]
// @description  Request assists for your attacks.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/loader.php?sid=attack*
// @connect      api.no1irishstig.co.uk
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561296/TORN%3A%20Attack%20Assist%20Requesting%20DEV.user.js
// @updateURL https://update.greasyfork.org/scripts/561296/TORN%3A%20Attack%20Assist%20Requesting%20DEV.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MAX_ASSISTS = 5;
  const ERROR_MESSAGES = {
    NOT_IN_ACTIVE_ATTACK: "You need to be in an active attack!",
    INVALID_LOCATION_PROVIDED: "The request location is invalid. Please check your settings."
  };
  const BUTTON_COLOR_PENDING = "#AA8800";
  const BUTTON_COLOR_SUCCESS = "#00AA00";
  const BUTTON_COLOR_FAILURE = "#AA0000";
  class FetchError extends Error {
    status;
    statusText;
    responseText;
    code;
    constructor(message, status, statusText, responseText, code) {
      super(message), this.name = "FetchError", this.status = status, this.statusText = statusText, this.responseText = responseText, this.code = code;
    }
  }
  function fetchGM(url, options) {
    const method = options?.method || "GET";
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url,
        headers: options?.headers,
        data: options?.body,
        onload: (response) => {
          if (response.status === 200)
            try {
              resolve(JSON.parse(response.responseText));
            } catch {
              reject(
                new FetchError(
                  "Response isn't in a supported format!",
                  response.status,
                  response.statusText,
                  response.responseText,
                  "INVALID_RESPONSE_FORMAT"
                )
              );
            }
          else
            reject(
              new FetchError(
                `Failed with status ${response.status}.`,
                response.status,
                response.statusText,
                response.responseText,
                `HTTP_STATUS_${response.status}`
              )
            );
        },
        onerror: (response) => {
          reject(
            new FetchError(
              `Unexpected error ${response.status}.`,
              response.status,
              response.statusText,
              response.responseText,
              `HTTP_STATUS_${response.status}`
            )
          );
        },
        ontimeout: () => reject(new FetchError("Request timed out.", null, null, null, "REQUEST_TIMED_OUT")),
        onabort: () => reject(new FetchError("Request timed out.", null, null, null, "REQUEST_ABORTED"))
      });
    });
  }
  const API_BASE = "https://api.no1irishstig.co.uk";
  const SOURCE = "Attack Assist Script";
  async function fetchButtons(location2) {
    const response = await fetchGM(`${API_BASE}/abtns?locID=${encodeURIComponent(location2)}`);
    return Object.entries(response).map(([name, label]) => ({ name, label }));
  }
  function requestAssist(userId, userName, targetId, targetName, button, quantity, location2) {
    const payload = {
      tornid: userId,
      username: userName,
      targetid: targetId,
      targetname: targetName,
      vendor: `${SOURCE} ${GM_info.script.version}`,
      source: SOURCE,
      type: "Assist",
      mode: button,
      quantity,
      locid: location2,
      token: "DKK_bMN5XhEo0qF4ztV7"
};
    console.log("Sending Payload:", payload);
    return fetchGM(`${API_BASE}/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
  const CHAT_SELECTORS = Object.freeze({
CHAT_ROOT_ID: "chatRoot",
    AVATAR_WRAPPER_CLASS: "avatar__avatar-status-wrapper___",
GROUP_MENU_DESKTOP_CLASS: "minimized-menus__desktop___",
    GROUP_MENU_MOBILE_CLASS: "minimized-menus__mobile___",
    GROUP_MENU_MOBILE_BUTTON_CLASS: "minimized-menus__mobile-button___",
    CHAT_LIST_CLASS: "chat-app__chat-list-chat-box-wrapper___",
    CHAT_LIST_GROUP_CHAT_CLASS: "minimized-menu-item___",
    CHAT_LIST_NOTEPAD_CLASS: "chat-note-button___",
    CHAT_LIST_SETTINGS_CLASS: "chat-setting-button___",
    CHAT_LIST_PEOPLE_CLASS: "chat-list-button___",
    CHAT_MESSAGE_COUNT_CLASS: "message-count___",
    CHAT_WRAPPER_WRAPPER_CLASS: "group-chat-box___",
    CHAT_WRAPPER_CLASS: "group-chat-box__chat-box-wrapper___",
    CHAT_HEADER_CLASS: "chat-box-header___",
    CHAT_HEADER_INFO_BUTTON_CLASS: "chat-box-header__info-btn___",
    CHAT_HEADER_INFO_CLASS: "chat-box-header__info___",
    CHAT_HEADER_AVATAR_CLASS: "chat-box-header__avatar___",
    CHAT_HEADER_MINIMIZE_ICON_CLASS: "minimize-icon",
    CHAT_HEADER_CLOSE_ICON_CLASS: "close-icon",
    CHAT_BODY_CLASS: "chat-box-body___",
COLOR_ERROR_CLASS: "color-chatError",
    MESSAGE_BODY_WRAPPER_CLASS: "chat-box-message___",
    MESSAGE_BODY_WRAPPER_SELF_CLASS: "chat-box-message--self___",
    MESSAGE_BODY_CLASS: "chat-box-message__box___",
    MESSAGE_BODY_SELF_CLASS: "chat-box-message__box--self___",
    MESSAGE_SENDER_CLASS: "chat-box-message__sender___",
    MESSAGE_MINIMIZED_BOX_AVATAR_CLASS: "minimized-chat-box__avatar___",
    MESSAGE_AVATAR_CLASS: "chat-box-message__avatar___",
    MESSAGE_CONTENT_WRAPPER_CLASS: "chat-box-message__message___",
    MESSAGE_SEND_BUTTON_CLASS: "chat-box-footer__send-icon-wrapper___",
    LAST_MESSAGE_TIMESTAMP_CLASS: "chat-box-body__lastmessage-timestamp___",
PANEL_WRAPPER_CLASS: "chat-app__panel___",
PEOPLE_PANEL_LOADING: "chat-tab__loader___",
    PEOPLE_PANEL_CLASS: "chat-tab___",
    PEOPLE_PANEL_CLOSE_BUTTON_ID: "_close_default_dark",
    PEOPLE_PANEL_SETTINGS_BUTTON_ID: "setting_default",
    PEOPLE_PANEL_HEADER_BUTTON: "chat-list-header__button___",
    PEOPLE_PANEL_TABS_WRAPPER_CLASS: "chat-list-header__tabs___",
    PEOPLE_PANEL_TAB_ACTIVE_CLASS: "chat-list-header__tab--active___",
    PEOPLE_PANEL_TAB_CONTENT_CLASS: "chat-tab-content___",
    PEOPLE_PANEL_MEMBER_CARD_CLASS: "member-card___",
    PEOPLE_PANEL_STATUS_ONLINE_CLASS: "online-status--online___",
    PEOPLE_PANEL_STATUS_IDLE_CLASS: "online-status--idle___",
    PEOPLE_PANEL_STATUS_OFFLINE_CLASS: "online-status--offline___",
SETTINGS_PANEL_CLASS: "settings-panel___",
    SETTINGS_PANEL_HEADER_CLASS: "settings-header___",
    SETTINGS_PANEL_HEADER_TITLE_CLASS: "settings-header__text-container___",
    SETTINGS_PANEL_CLOSE_BUTTON_CLASS: "settings-header__close-button___"
  });
  function findByPartialClass(node, className, subSelector = "") {
    return node.querySelector(`[class*='${className}'] ${subSelector}`.trim());
  }
  function isJSON(data) {
    try {
      return JSON.parse(data), true;
    } catch {
      return false;
    }
  }
  let currentPlayerName, currentPlayerId;
  function getCurrentPlayerName() {
    if (currentPlayerName)
      return currentPlayerName;
    const websocketElement = document.getElementById("websocketConnectionData");
    if (websocketElement) {
      const data = JSON.parse(websocketElement.textContent);
      return currentPlayerName = data.playername, data.playername;
    }
    const sidebarElement = findByPartialClass(document, "menu-value___");
    if (sidebarElement)
      return currentPlayerName = sidebarElement.textContent, sidebarElement.textContent;
    const attackerElement = document.querySelector(".user-name.left");
    if (attackerElement)
      return currentPlayerName = attackerElement.textContent, attackerElement.textContent;
    const chatSenderElement = document.querySelector(
      `[class*='${CHAT_SELECTORS.MESSAGE_BODY_WRAPPER_SELF_CLASS}'] [class*='${CHAT_SELECTORS.MESSAGE_SENDER_CLASS}']`
    );
    if (chatSenderElement) {
      let name = chatSenderElement.textContent;
      return name = name.substring(0, name.length - 1), currentPlayerName = name, name;
    }
    return null;
  }
  function getCurrentPlayerId() {
    if (currentPlayerId)
      return currentPlayerId;
    const websocketElement = document.getElementById("websocketConnectionData");
    if (websocketElement) {
      const data = JSON.parse(websocketElement.textContent);
      return currentPlayerId = parseInt(data.userID, 10), parseInt(data.userID, 10);
    }
    const userInputElement = document.getElementById("torn-user");
    if (userInputElement) {
      const data = JSON.parse(userInputElement.getAttribute("value"));
      return currentPlayerId = data.id, data.id;
    }
    return null;
  }
  function getAttackLoaderPlayerName() {
    const nameElement = document.querySelector("[class*='headerWrapper__'][class*='rose__'] .user-name");
    return nameElement ? nameElement.textContent : null;
  }
  function getAttackLoaderPlayerId() {
    const searchParams = new URL(location.href).searchParams;
    if (searchParams.has("user2ID")) {
      const value = searchParams.get("user2ID");
      if (value !== null)
        return parseInt(value);
    }
    return null;
  }
  function isInActiveAttack() {
    return !document.evaluate('//span[text()="Back to profile"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
  const _MAX_ASSISTS = MAX_ASSISTS;
  const _ERROR_MESSAGES = ERROR_MESSAGES;
  const _BUTTON_COLOR_PENDING = BUTTON_COLOR_PENDING;
  const _BUTTON_COLOR_SUCCESS = BUTTON_COLOR_SUCCESS;
  const _BUTTON_COLOR_FAILURE = BUTTON_COLOR_FAILURE;
  const stylesString = "#attack-assist-panel {\n    position: absolute;\n    width: 140px;\n    background-color: rgba(0, 0, 0, 0.8);\n    color: #fff;\n    padding: 10px;\n    border-radius: 8px;\n    z-index: 899999;\n    display: flex;\n    flex-direction: column;\n    gap: 8px;\n    user-select: none;\n}\n\n@media (max-width: 599px) {\n    #attack-assist-panel {\n        top: 196px;\n        left: calc(((100% - 386px) / 2) + (386px - 160px - 5px));\n        right: auto;\n    }\n}\n\n@media (min-width: 600px) and (max-width: 784px) {\n    #attack-assist-panel {\n        top: 196px;\n        left: calc(((100% - 578px) / 2) + (578px - 160px - 5px));\n        right: auto;\n    }\n}\n\n@media (min-width: 785px) and (max-width: 1319px) {\n    #attack-assist-panel {\n        top: 90px;\n        left: calc(((100% - 976px) / 2) + 130px);\n        right: auto;\n    }\n}\n\n@media (min-width: 1320px) {\n    #attack-assist-panel {\n        top: 132px;\n        left: calc(50% + 976px / 2 + 10px);\n        right: auto;\n    }\n\n    :has(.tt-ff-scouter-attack) #attack-assist-panel {\n        top: 144px;\n    }\n}\n\n#attack-assist-panel.collapsed > :not(.assist-request-title-container) {\n    display: none;\n}\n\n.assist-request-title-container {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 5px;\n    margin-bottom: 5px;\n    cursor: move;\n}\n\n#attack-assist-panel.collapsed .assist-request-title-container {\n    margin-bottom: 0;\n}\n\n.assist-request-title {\n    font-weight: bold;\n    text-align: center;\n    flex-grow: 1;\n}\n\n.assist-request-icon {\n    width: 12px;\n    height: 12px;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n    opacity: 0.7;\n}\n\n.assist-request-icon:hover {\n    opacity: 1;\n}\n\n.assist-error-message {\n    display: block;\n    padding: 8px;\n    margin-bottom: 4px;\n    background-color: rgba(170, 0, 0, 0.2);\n    border: 1px solid #aa0000;\n    border-radius: 4px;\n    color: #ff6666;\n    font-size: 12px;\n    text-align: center;\n}\n\n.quantity-container {\n    display: flex;\n    align-items: center;\n    gap: 5px;\n}\n\n.quantity-input {\n    width: 100%;\n    padding: 2px;\n    border-radius: 4px;\n    border: 1px solid #555;\n    background-color: #222;\n    color: #fff;\n}\n\n.assist-button {\n    padding: 8px;\n    cursor: pointer;\n    background-color: #444;\n    color: white;\n    border: 1px solid #666;\n    border-radius: 4px;\n    text-align: center;\n    font-weight: bold;\n}\n\n.assist-button:hover:not(:disabled) {\n    background-color: #555;\n}\n\n.assist-button:disabled {\n    cursor: not-allowed;\n    opacity: 0.7;\n}\n";
  async function main() {
    if (new URL(window.location.href).searchParams.get("sid") !== "attack") return;
    if (typeof GM_registerMenuCommand === "function") {
      GM_registerMenuCommand("Reset Request Location", resetLocation);
    }
    let location2 = GM_getValue("request_location") ?? await promptAndValidateLocation();
    if (!location2) {
      console.warn("Location not set. Attack Assist buttons will not be loaded.");
      return;
    }
    injectStyles();
    try {
      const buttons = await fetchButtons(location2);
      createPanel(buttons, location2);
    } catch (error) {
      console.error("Failed to fetch buttons:", error);
      createPanelWithError(formatApiError(error));
    }
  }
  async function promptAndValidateLocation() {
    const input = prompt("Please set your 'Request Location':");
    if (!input) return null;
    try {
      await fetchButtons(input);
      GM_setValue("request_location", input);
      return input;
    } catch (error) {
      alert(`Invalid location: ${formatApiError(error)}

Please check the location and try again.`);
      return null;
    }
  }
  function injectStyles() {
    const styleElement = document.createElement("style");
    styleElement.setAttribute("type", "text/css");
    styleElement.innerHTML = stylesString;
    document.head.appendChild(styleElement);
  }
  function formatApiError(error) {
    if (error instanceof FetchError) {
      let code;
      if (error.responseText !== null) {
        if (isJSON(error.responseText)) {
          const data = JSON.parse(error.responseText);
          if ("error" in data) code = data.error;
          else code = error.responseText;
        } else {
          code = error.responseText;
        }
        code = code.toUpperCase().replaceAll(" ", "_");
      } else {
        code = error.code;
      }
      console.log("DKK error", code);
      if (code in _ERROR_MESSAGES) {
        return _ERROR_MESSAGES[code];
      }
    }
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
  const PANEL_STATE_KEY = "attack_assist_panel_state";
  function createBasicPanel() {
    if (document.getElementById("attack-assist-panel")) return null;
    const container = document.createElement("div");
    container.id = "attack-assist-panel";
    const savedState = GM_getValue(PANEL_STATE_KEY, { top: "150px", left: "", collapsed: false });
    if (savedState.top) container.style.top = savedState.top;
    if (savedState.left) {
      container.style.left = savedState.left;
      container.style.right = "auto";
    }
    if (savedState.collapsed) container.classList.add("collapsed");
    const titleContainer = document.createElement("div");
    titleContainer.classList.add("assist-request-title-container");
    container.appendChild(titleContainer);
    const collapseIcon = document.createElement("div");
    collapseIcon.innerHTML = savedState.collapsed ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" height="12"><path fill="#fff" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" height="12"><path fill="#fff" d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>`;
    collapseIcon.classList.add("assist-request-icon");
    collapseIcon.title = "Minimize/Expand";
    collapseIcon.addEventListener("click", (event) => {
      event.stopPropagation();
      container.classList.toggle("collapsed");
      const isCollapsed = container.classList.contains("collapsed");
      collapseIcon.innerHTML = isCollapsed ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" height="12"><path fill="#fff" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" height="12"><path fill="#fff" d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>`;
      saveState(container);
    });
    titleContainer.appendChild(collapseIcon);
    const title = document.createElement("div");
    title.textContent = "Request Assist";
    title.classList.add("assist-request-title");
    titleContainer.appendChild(title);
    const resetIcon = document.createElement("div");
    resetIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14"><path fill="#fff" d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6 4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2 5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.4 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8 8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>`;
    resetIcon.classList.add("assist-request-icon");
    resetIcon.title = "Reset Request Location";
    resetIcon.addEventListener("click", (event) => {
      event.stopPropagation();
      void resetLocation();
    });
    titleContainer.appendChild(resetIcon);
    setupDragging(container, titleContainer, title);
    document.body.appendChild(container);
    ensureInPageDimensions(container);
    window.addEventListener("resize", () => ensureInPageDimensions(container));
    return container;
  }
  function createPanel(buttons, location2) {
    const container = createBasicPanel();
    if (!container) return;
    const errorElement = document.createElement("span");
    errorElement.classList.add("assist-error-message");
    errorElement.style.display = "none";
    container.appendChild(errorElement);
    const quantityContainer = document.createElement("div");
    quantityContainer.classList.add("quantity-container");
    const quantityLabel = document.createElement("label");
    quantityLabel.textContent = "Quantity:";
    quantityContainer.appendChild(quantityLabel);
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.value = "1";
    quantityInput.min = "1";
    quantityInput.max = _MAX_ASSISTS.toString();
    quantityInput.classList.add("quantity-input");
    quantityContainer.appendChild(quantityInput);
    container.appendChild(quantityContainer);
    buttons.forEach((data) => {
      const button = document.createElement("button");
      button.textContent = data.label;
      button.classList.add("assist-button");
      button.addEventListener("click", () => handleRequest(button, data, parseInt(quantityInput.value), location2, container, errorElement));
      container.appendChild(button);
    });
  }
  function createPanelWithError(errorMessage) {
    const container = createBasicPanel();
    if (!container) return;
    const errorElement = document.createElement("div");
    errorElement.classList.add("assist-error-message");
    errorElement.textContent = errorMessage;
    container.appendChild(errorElement);
  }
  function setupDragging(container, titleContainer, title) {
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    titleContainer.addEventListener("mousedown", (event) => {
      if (event.target !== titleContainer && event.target !== title) return;
      isDragging = true;
      dragOffsetX = event.clientX - container.offsetLeft;
      dragOffsetY = event.clientY - container.offsetTop;
      document.body.style.userSelect = "none";
    });
    titleContainer.addEventListener(
      "touchstart",
      (event) => {
        if (event.target !== titleContainer && event.target !== title) return;
        isDragging = true;
        const touch = event.touches[0];
        dragOffsetX = touch.clientX - container.offsetLeft;
        dragOffsetY = touch.clientY - container.offsetTop;
      },
      { passive: true }
    );
    window.addEventListener("mousemove", (event) => {
      if (!isDragging) return;
      event.preventDefault();
      const newLeft = event.clientX - dragOffsetX;
      const newTop = event.clientY - dragOffsetY;
      container.style.left = `${newLeft}px`;
      container.style.top = `${newTop}px`;
      container.style.right = "auto";
    });
    window.addEventListener(
      "touchmove",
      (event) => {
        if (!isDragging) return;
        event.preventDefault();
        const touch = event.touches[0];
        const newLeft = touch.clientX - dragOffsetX;
        const newTop = touch.clientY - dragOffsetY;
        container.style.left = `${newLeft}px`;
        container.style.top = `${newTop}px`;
        container.style.right = "auto";
      },
      { passive: false }
    );
    window.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.userSelect = "";
        saveState(container);
      }
    });
    window.addEventListener("touchend", () => {
      if (isDragging) {
        isDragging = false;
        saveState(container);
      }
    });
  }
  function saveState(container) {
    const state = {
      top: container.style.top,
      left: container.style.left,
      collapsed: container.classList.contains("collapsed")
    };
    GM_setValue(PANEL_STATE_KEY, state);
  }
  function ensureInPageDimensions(container) {
    const rect = container.getBoundingClientRect();
    const containerWidth = document.querySelector("#mainContainer").clientWidth;
    if (rect.left >= containerWidth - 50) {
      container.style.left = "";
      container.style.right = "";
      saveState(container);
    }
  }
  function handleRequest(clickedButton, data, quantity, location2, container, errorElement) {
    const allButtons = Array.from(container.querySelectorAll("button"));
    allButtons.forEach((button) => {
      button.disabled = true;
      button.style.backgroundColor = "";
    });
    clickedButton.style.backgroundColor = _BUTTON_COLOR_PENDING;
    if (!isInActiveAttack()) {
      handleError(errorElement, "NOT_IN_ACTIVE_ATTACK", allButtons, clickedButton);
      return;
    }
    const targetName = getAttackLoaderPlayerName();
    if (targetName === null) throw new Error("Can't detect your target name.");
    const targetId = getAttackLoaderPlayerId();
    if (targetId === null) throw new Error("Can't detect your target id.");
    const userName = getCurrentPlayerName();
    if (userName === null) throw new Error("Can't detect your player name.");
    const userId = getCurrentPlayerId();
    if (userId === null) throw new Error("Can't detect your player id.");
    requestAssist(userId, userName, targetId, targetName, data.name, quantity, location2).then(() => {
      clickedButton.style.backgroundColor = _BUTTON_COLOR_SUCCESS;
      clickedButton.textContent = "Sent!";
      showErrorMessage(errorElement, null);
    }).catch((err) => {
      clickedButton.style.backgroundColor = _BUTTON_COLOR_FAILURE;
      alert(`Request Failed: ${err}`);
      allButtons.forEach((button) => {
        button.disabled = false;
        button.style.backgroundColor = "";
      });
    });
  }
  function handleError(errorElement, code, allButtons, clickedButton) {
    allButtons.forEach((button) => {
      button.disabled = false;
      if (button !== clickedButton) button.style.backgroundColor = "";
    });
    clickedButton.style.backgroundColor = _BUTTON_COLOR_FAILURE;
    showErrorMessage(errorElement, _ERROR_MESSAGES[code]);
  }
  async function resetLocation() {
    const newLocation = prompt("Enter new Request Location:", GM_getValue("request_location") || "");
    if (!newLocation) return;
    try {
      await fetchButtons(newLocation);
      GM_setValue("request_location", newLocation);
      alert("Location updated. Reloading...");
      location.reload();
    } catch (error) {
      alert(`Invalid location: ${formatApiError(error)}`);
    }
  }
  main().catch(console.error);
  function showErrorMessage(errorElement, message) {
    if (message) {
      errorElement.textContent = message;
      errorElement.style.display = "";
    } else {
      errorElement.textContent = "";
      errorElement.style.display = "none";
    }
  }

})();