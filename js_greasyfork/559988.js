// ==UserScript==
// @name         Bonk.io AI Auto-Reply
// @namespace    https://greasyfork.org/en/users/1551631-greninja9257
// @version      11.0
// @description  AI replies uh do /key (key) to set openrouter api key do /ai to toggle on/off its saved in localStorage
// @author       Greninja9257
// @match        https://bonk.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559988/Bonkio%20AI%20Auto-Reply.user.js
// @updateURL https://update.greasyfork.org/scripts/559988/Bonkio%20AI%20Auto-Reply.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* =========================
     DOM
  ========================= */

  const lobbyInput   = document.getElementById("newbonklobby_chat_input");
  const lobbyContent = document.getElementById("newbonklobby_chat_content");

  const gameInput    = document.getElementById("ingamechatinputtext");
  const gameContent  = document.getElementById("ingamechatcontent");

  /* =========================
     OPENROUTER CONFIG
  ========================= */

  const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
  const MODEL = "qwen/qwen3-next-80b-a3b-instruct:free";

  /* =========================
     STATE
  ========================= */

  let apiKey  = localStorage.getItem("openrouterApiKey");
  let enabled = localStorage.getItem("aiEnabled") === "true";

  let inFlight = false;
  let lastReplyTime = 0;
  let ignoreUntil = 0;
  let swallowNextKeyUp = false;

  /* =========================
     LIMITS
  ========================= */

  const COOLDOWN_MS    = 3000;
  const SELF_IGNORE_MS = 1600;

  /* =========================
     IGNORE FILTER
  ========================= */

  const IGNORE = [
    "system:",
    "you are doing that too much",
    "rate limit",
    "slow down"
  ];

  /* =========================
     KEYUP SWALLOW (CORRECT)
  ========================= */

  document.addEventListener("keyup", (e) => {
    if (swallowNextKeyUp && e.keyCode === 13) {
      swallowNextKeyUp = false;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }, true);

  /* =========================
     COMMAND HANDLER
  ========================= */

  function attachCommands(input) {
    if (!input) return;

    input.addEventListener("keydown", e => {
      if (e.keyCode !== 13) return;

      const msg = input.value.trim();
      if (!msg.startsWith("/")) return;

      if (msg === "/ai") {
        enabled = !enabled;
        localStorage.setItem("aiEnabled", enabled ? "true" : "false");
        system(`AI ${enabled ? "ENABLED" : "DISABLED"}`);
        clear(input);
        e.preventDefault();
        return;
      }

      if (msg.startsWith("/key ")) {
        apiKey = msg.slice(5).trim();
        localStorage.setItem("openrouterApiKey", apiKey);
        system("OpenRouter API key saved.");
        clear(input);
        e.preventDefault();
        return;
      }

      if (msg === "/cmds") {
        system("Commands: /ai, /key YOUR_OPENROUTER_KEY, /cmds");
        clear(input);
        e.preventDefault();
        return;
      }
    });
  }

  attachCommands(lobbyInput);
  attachCommands(gameInput);

  /* =========================
     CHAT OBSERVER
  ========================= */

  function observe(container, input) {
    if (!container || !input) return;

    new MutationObserver(mutations => {
      const now = Date.now();

      if (
        !enabled ||
        !apiKey ||
        inFlight ||
        now < ignoreUntil ||
        now - lastReplyTime < COOLDOWN_MS
      ) return;

      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;

          const text = node.textContent?.trim();
          if (!text) continue;

          const lower = text.toLowerCase();
          if (IGNORE.some(s => lower.includes(s))) continue;

          sendToAI(text, input);
          return;
        }
      }
    }).observe(container, { childList: true });
  }

  observe(lobbyContent, lobbyInput);
  observe(gameContent, gameInput);

  /* =========================
     OPENROUTER REQUEST
  ========================= */

  function sendToAI(message, input) {
    inFlight = true;
    lastReplyTime = Date.now();

    const payload = {
      model: MODEL,
      messages: [
        { role: "system", content: "Reply to the user's prompt in short, minimal answers. Make it sound like a real person, with short terse (sometimes misspelled) answers." },
        { role: "user", content: message }
      ],
      temperature: 0.8,
      max_tokens: 120
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", ENDPOINT);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    xhr.setRequestHeader("HTTP-Referer", location.origin);
    xhr.setRequestHeader("X-Title", "Bonk.io AI Bot");

    xhr.onload = () => {
      inFlight = false;
      if (xhr.status !== 200) return;

      try {
        const res = JSON.parse(xhr.responseText);
        const reply = res.choices?.[0]?.message?.content?.trim();
        if (!reply) return;

        sendChat(reply, input);
      } catch {}
    };

    xhr.onerror = () => {
      inFlight = false;
    };

    xhr.send(JSON.stringify(payload));
  }

  /* =========================
     SEND CHAT (PERFECT)
  ========================= */

  function sendChat(text, input) {
    ignoreUntil = Date.now() + SELF_IGNORE_MS;

    input.value = text;

    // 1️⃣ Send message
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        keyCode: 13,
        bubbles: true,
        cancelable: true
      })
    );

    // 2️⃣ Normalize Bonk chat state (clear / close)
    setTimeout(() => {
      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          keyCode: 13,
          bubbles: true,
          cancelable: true
        })
      );
    }, 0);
  }

  /* =========================
     UTILITIES
  ========================= */

  function clear(input) {
    input.value = "";
  }

  function system(text) {
    const div = document.createElement("div");
    div.className = "chat-content-message";
    div.style.color = "#808080";
    div.textContent = "System: " + text;

    lobbyContent?.appendChild(div);
    gameContent?.appendChild(div.cloneNode(true));
  }

})();
