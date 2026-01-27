// ==UserScript==
// @name         ChatGPT notify on response
// @namespace    local
// @version      1.0.3
// @description  Notifies you when ChatGPT finishes generating a response (only when the tab/window is inactive). Uses the browser’s native Notifications API and shows the chat title plus a short preview of the reply with the ChatGPT favicon. Notifications are de-duplicated per chat (new ones replace previous using the notification tag).
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564055/ChatGPT%20notify%20on%20response.user.js
// @updateURL https://update.greasyfork.org/scripts/564055/ChatGPT%20notify%20on%20response.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var ICON_URL = "https://chatgpt.com/favicon.ico";
  var KEY_LAST_SIG = "cgpt_native_notify_last_sig";
  var KEY_LAST_TS = "cgpt_native_notify_last_ts";

  function tabInactive() {
    try {
      return document.hidden || !document.hasFocus();
    } catch (e) {
      return document.hidden;
    }
  }

  function collapseWs(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  function getChatTitle() {
    var t = (document.title || "").trim();
    if (!t) return "ChatGPT";

    var cleaned = t
      .replace(/\s*[-–|]\s*ChatGPT\s*$/i, "")
      .replace(/^ChatGPT\s*[-–|]\s*/i, "")
      .trim();

    return cleaned || "ChatGPT";
  }

  function getLastAssistantNode() {
    var nodes = document.querySelectorAll('[data-message-author-role="assistant"]');
    if (!nodes || nodes.length === 0) return null;
    return nodes[nodes.length - 1];
  }

  function extractAssistantText(node) {
    if (!node) return "";

    var preferred =
      node.querySelector(".markdown") ||
      node.querySelector('[data-testid="message-content"]') ||
      node.querySelector("article") ||
      node;

    var text = "";
    try {
      text = preferred.innerText || preferred.textContent || "";
    } catch (e) {
      text = preferred.textContent || "";
    }
    return collapseWs(text);
  }

  function getReplyPreview(maxLen) {
    if (typeof maxLen !== "number") maxLen = 200;

    var node = getLastAssistantNode();
    var text = extractAssistantText(node);
    if (!text) return "";

    if (text.length > maxLen) return text.slice(0, maxLen - 1) + "…";
    return text;
  }

  function signatureForLastAssistantMessage(previewForSig) {
    var node = getLastAssistantNode();
    var id = "";
    if (node) {
      id = node.getAttribute("data-message-id") || node.id || node.getAttribute("data-testid") || "";
    }
    var p = previewForSig || getReplyPreview(120) || "";
    return location.pathname + "::" + id + "::" + p;
  }

  // IMPORTANT: On Windows Chrome/Edge, requestPermission must be called directly
  // from a short-lived user gesture handler (click/pointerdown/keydown).
  function requestPermissionFromUserGesture() {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "default") return;

    try {
      var p = Notification.requestPermission();
      if (p && typeof p.then === "function") {
        p.catch(function () {});
      }
    } catch (e) {}
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  async function getStablePreview() {
    // Wait and re-sample to avoid partial reads like "O" instead of "OK."
    var best = "";
    var delays = [250, 350, 500];

    await sleep(250);

    for (var i = 0; i < delays.length; i++) {
      var p = getReplyPreview(240);
      if (p.length > best.length) best = p;

      if (p.length >= 2 || /[.!?…]$/.test(p)) return p;
      await sleep(delays[i]);
    }
    return best;
  }

  async function notifyCompletion() {
    if (!tabInactive()) return;
    if (!("Notification" in window)) return;

    // Do NOT request permission here (may be blocked on Windows).
    if (Notification.permission !== "granted") return;

    var title = getChatTitle();
    var body = await getStablePreview();
    if (!body) body = "ChatGPT finished generating the response.";

    // De-dupe
    var sig = signatureForLastAssistantMessage(body.slice(0, 120));
    var now = Date.now();
    var lastSig = GM_getValue(KEY_LAST_SIG, "");
    var lastTs = GM_getValue(KEY_LAST_TS, 0);

    if (sig && lastSig === sig && typeof lastTs === "number" && now - lastTs < 3000) return;

    GM_setValue(KEY_LAST_SIG, sig);
    GM_setValue(KEY_LAST_TS, now);

    new Notification(title, { body: body, icon: ICON_URL, tag: location.pathname });
  }

  function findStopButton() {
    return (
      document.querySelector('button[data-testid="stop-button"]:not([disabled])') ||
      document.querySelector('button[aria-label*="Stop"]:not([disabled])') ||
      document.querySelector('button[aria-label*="stop"]:not([disabled])') ||
      null
    );
  }

  function isGenerating() {
    if (findStopButton()) return true;
    if (document.querySelector("svg.animate-spin")) return true;
    if (document.querySelector(".result-streaming")) return true;
    return false;
  }

  var wasGenerating = false;
  var pending = false;
  var lastRun = 0;
  var MIN_INTERVAL_MS = 300;

  function scheduleCheck() {
    if (pending) return;
    pending = true;

    var now = Date.now();
    var delay = Math.max(0, MIN_INTERVAL_MS - (now - lastRun));

    setTimeout(function () {
      pending = false;
      lastRun = Date.now();
      checkTransition();
    }, delay);
  }

  function checkTransition() {
    var nowGenerating = isGenerating();

    if (!wasGenerating && nowGenerating) {
      wasGenerating = true;
      return;
    }

    if (wasGenerating && !nowGenerating) {
      wasGenerating = false;
      notifyCompletion();
    }
  }

  var observer = new MutationObserver(function () {
    scheduleCheck();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["disabled", "hidden", "aria-label", "class"]
  });

  document.addEventListener("visibilitychange", scheduleCheck);
  window.addEventListener("focus", scheduleCheck);
  window.addEventListener("blur", scheduleCheck);

  // One-time permission request, triggered only by real user gesture
  document.addEventListener("pointerdown", requestPermissionFromUserGesture, { once: true, capture: true });
  document.addEventListener("keydown", requestPermissionFromUserGesture, { once: true, capture: true });

  function cleanup() {
    observer.disconnect();
    document.removeEventListener("visibilitychange", scheduleCheck);
    window.removeEventListener("focus", scheduleCheck);
    window.removeEventListener("blur", scheduleCheck);
  }

  window.addEventListener("unload", cleanup);

  // Do NOT call requestPermission on load.
  scheduleCheck();
})();
