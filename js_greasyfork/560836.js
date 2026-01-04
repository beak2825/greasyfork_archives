// ==UserScript==
// @name         TORN: BasicK Suite
// @namespace    dekleinekobini.private.basick-suite
// @version      1.4.2
// @author       DeKleineKobini [2114440]
// @description  Multiple features for BasicK.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/*
// @grant        GM_notification
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560836/TORN%3A%20BasicK%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/560836/TORN%3A%20BasicK%20Suite.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ALERT_THRESHOLD = 4e6;
  function findByPartialClass(node, className, subSelector = "") {
    return node.querySelector(`[class*='${className}'] ${subSelector}`.trim());
  }
  function findAll(node, selector) {
    return Array.from(node.querySelectorAll(selector));
  }
  function findAllByPartialClass(node, className, subSelector = "") {
    return findAll(node, `[class*='${className}'] ${subSelector}`.trim());
  }
  async function findDelayed(node, findElement, timeout) {
    return new Promise((resolve, reject) => {
      const initialElement = findElement();
      if (initialElement) {
        resolve(initialElement);
        return;
      }
      const observer2 = new MutationObserver(() => {
        const element = findElement();
        element && (clearTimeout(timeoutId), observer2.disconnect(), resolve(element));
      }), timeoutId = setTimeout(() => {
        observer2.disconnect(), reject("Failed to find the element within the acceptable timeout.");
      }, timeout);
      observer2.observe(node, { childList: true, subtree: true });
    });
  }
  async function waitOnConditionWithMO(node, condition, timeout = 5e3) {
    return new Promise((resolve, reject) => {
      if (condition()) {
        resolve();
        return;
      }
      const observer2 = new MutationObserver(() => {
        condition() && (clearTimeout(timeoutId), observer2.disconnect(), resolve());
      }), timeoutId = setTimeout(() => {
        observer2.disconnect(), reject("Failed to meet the condition within the acceptable timeout.");
      }, timeout);
      observer2.observe(node, { childList: true, subtree: true });
    });
  }
  async function findByPartialClassDelayed(node, className, subSelector = "", timeout = 5e3) {
    return findDelayed(node, () => findByPartialClass(node, className, subSelector), timeout);
  }
  async function findBySelectorDelayed(node, selector, timeout = 5e3) {
    return findDelayed(node, () => node.querySelector(selector), timeout);
  }
  function formatNumber(original, decimals = 2) {
    const pattern = `\\d(?=(\\d{3})+${decimals > 0 ? "\\." : "$"})`;
    return original.toFixed(Math.max(0, ~~decimals)).replace(new RegExp(pattern, "g"), "$&,");
  }
  function getHashParameters(hash) {
    return hash || (hash = location.hash), hash.startsWith("#/") ? hash = hash.substring(2) : (hash.startsWith("#") || hash.startsWith("/")) && (hash = hash.substring(1)), hash.startsWith("!") || (hash = "?" + hash), new URLSearchParams(hash);
  }
  function isHospitalized() {
    return document.body.dataset.layout === "hospital";
  }
  function isMobileView() {
    return window.innerWidth < 784;
  }
  function includeStyle(styleRules) {
    findBySelectorDelayed(document, "head").then(() => {
      const styleElement = document.createElement("style");
      styleElement.setAttribute("type", "text/css");
      styleElement.innerHTML = styleRules;
      document.head.appendChild(styleElement);
    });
  }
  let notificationChannel;
  let isLeader = false;
  const identifier = crypto.randomUUID();
  const HEARTBEAT_INTERVAL = 800;
  const LEADER_TIMEOUT = 1500;
  let lastLeaderSeen = 0;
  let currentLeader = null;
  function initializeChannel() {
    try {
      notificationChannel = new BroadcastChannel("basick-money-notification");
    } catch (e) {
      console.warn("BroadcastChannel not supported, assuming leadership");
      isLeader = true;
      return;
    }
    notificationChannel.addEventListener("message", handleMessage);
    electLeader();
    setInterval(() => {
      if (isLeader) {
        notificationChannel.postMessage({
          type: "heartbeat",
          tabId: identifier,
          timestamp: Date.now()
        });
      }
    }, HEARTBEAT_INTERVAL);
    setInterval(checkLeaderTimeout, 500);
  }
  function handleMessage(event) {
    const { type, tabId } = event.data;
    if (type === "heartbeat" && tabId < identifier) {
      isLeader = false;
      currentLeader = tabId;
      lastLeaderSeen = Date.now();
    } else if (type === "leadership-claim" && tabId !== identifier) {
      isLeader = false;
      currentLeader = tabId;
      lastLeaderSeen = Date.now();
    }
  }
  function electLeader() {
    isLeader = false;
    currentLeader = null;
    notificationChannel.postMessage({
      type: "election-request",
      tabId: identifier,
      timestamp: Date.now()
    });
    setTimeout(() => {
      if (currentLeader === null) {
        isLeader = true;
        currentLeader = identifier;
        lastLeaderSeen = Date.now();
        notificationChannel.postMessage({
          type: "leadership-claim",
          tabId: identifier,
          timestamp: Date.now()
        });
      }
    }, 100);
  }
  function checkLeaderTimeout() {
    if (!(currentLeader && currentLeader !== identifier)) return;
    if (Date.now() - lastLeaderSeen > LEADER_TIMEOUT) {
      electLeader();
    }
  }
  const _ALERT_THRESHOLD = ALERT_THRESHOLD;
  const stylesString$1 = ".moneyAlertWrapper {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    z-index: 1000000;\r\n    background-color: #00000059;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n.moneyAlert {\r\n    background-color: #ccc;\r\n    padding: 10px;\r\n    border-radius: 5px;\r\n}";
  let onHand;
  async function enableMoneyNotification() {
    initializeChannel();
    includeStyle(stylesString$1);
    const moneyElement = await findBySelectorDelayed(document, "#user-money");
    if (!moneyElement) return;
    onHand = parseInt(moneyElement.dataset.money);
    if (isNaN(onHand)) return;
    let updateTimeout;
    new MutationObserver(() => {
      if (updateTimeout) return;
      updateTimeout = setTimeout(() => {
        updateTimeout = void 0;
        const newOnHand = parseInt(moneyElement.dataset.money);
        if (onHand >= newOnHand) return;
        const difference = newOnHand - onHand;
        onHand = newOnHand;
        if (Math.abs(difference) >= _ALERT_THRESHOLD) {
          triggerAlert();
        }
      }, 250);
    }).observe(moneyElement, { attributes: true });
  }
  function triggerAlert() {
    if (isHospitalized()) {
      return;
    }
    if (isMobileView()) {
      triggerMobileAlert();
      return;
    }
    if (isLeader) {
      GM_notification({
        text: "Your money on hand increased.",
        title: "Money Monitor",
        url: "https://www.torn.com/properties.php#/p=options&tab=vault",
        timeout: 5e3
      });
    }
  }
  const MOBILE_ALERT = new Audio("https://audio.jukehost.co.uk/gxd2HB9RibSHhr13OiW6ROCaaRbD8103");
  function triggerMobileAlert() {
    if (document.visibilityState === "hidden") return;
    void MOBILE_ALERT.play();
  }
  const stylesString = '[class*="price___"][data-basick-initialised] {\r\n    flex-direction: column;\r\n    align-items: end;\r\n    justify-content: center;\r\n}\r\n\r\n.basick-market-price {\r\n    color: #2fe44a;\r\n}';
  function enableMarketPrice() {
    includeStyle(stylesString);
    handleViewChange();
    window.addEventListener("hashchange", handleViewChange);
  }
  function handleViewChange() {
    const params = getHashParameters();
    const view = params.get("market/view");
    if (view === "category" || view === "search") {
      destroy();
      handleItemView().catch(console.error);
    } else {
      destroy();
    }
  }
  let observer;
  async function handleItemView() {
    const listClass = isMobileView() ? "categoriesWrapper___" : "itemList___";
    await findByPartialClassDelayed(document, listClass);
    await waitOnConditionWithMO(document, () => !document.querySelector("[class*='skeletonContainerImage___'], .react-loading-skeleton"));
    const itemList = await findByPartialClassDelayed(document, listClass);
    if (!itemList) return;
    observer = new MutationObserver(() => {
      const sellerList = findByPartialClass(itemList, "sellerList___");
      if (!sellerList) return;
      handleSellerList(sellerList);
    });
    observer.observe(itemList, { childList: true, subtree: true });
    const initialSellerList = findByPartialClass(itemList, "sellerList___");
    if (initialSellerList) {
      handleSellerList(initialSellerList);
    }
  }
  const REGEX_NUMBER_WITH_COMMAS = /\d+(?:,\d+)*/;
  const MARKET_FEE = 5;
  function handleSellerList(sellerList) {
    const allPrices = findAllByPartialClass(sellerList, "price___").filter((e) => !e.dataset.basickInitialised);
    allPrices.forEach((priceElement) => {
      const result = REGEX_NUMBER_WITH_COMMAS.exec(priceElement.textContent);
      if (!result) return;
      const originalValue = parseInt(result[0].replaceAll(",", ""));
      const value = originalValue * ((100 - MARKET_FEE) / 100);
      priceElement.dataset.basickInitialised = "true";
      const customPriceElement = document.createElement("div");
      customPriceElement.textContent = `($${formatNumber(value, 0)})`;
      customPriceElement.classList.add("basick-market-price");
      priceElement.appendChild(customPriceElement);
    });
  }
  function destroy() {
    observer?.disconnect();
    observer = void 0;
  }
  (function() {
    enableMoneyNotification().catch(console.error);
    const sid = new URL(location.href).searchParams.get("sid");
    if (sid === "ItemMarket") enableMarketPrice();
  })();

})();