// ==UserScript==
// @name         Torn - IM Popup + Repeating Sound (Settings Panel Options)
// @namespace    https://www.torn.com/
// @version      01.05.2026.20.35
// @description  Full-screen popup when Torn IM unread count increases. Optional repeating sound every 30 seconds until popup is closed. Settings live in Torn Chat Settings panel.
// @author       KillerCleat [2842410]
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561582/Torn%20-%20IM%20Popup%20%2B%20Repeating%20Sound%20%28Settings%20Panel%20Options%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561582/Torn%20-%20IM%20Popup%20%2B%20Repeating%20Sound%20%28Settings%20Panel%20Options%29.meta.js
// ==/UserScript==

/*
NOTES & REQUIREMENTS
- Author: KillerCleat [2842410]
- Version format: MM.DD.YYYY.HH.MM
- Watches the IM/chat unread badge count on the chat list button.
- When unread count increases, shows a full-screen popup overlay.
- Optional repeating sound every 30 seconds while popup is open.
- Settings injected into Torn Chat Settings panel:
  1) Alert Mode: Disabled / Popup only / Popup + sound
  2) Sound choice (your links) + TTS options
  3) TEST button shows popup and plays sound
- IMPORTANT: Browsers may require a click before allowing audio. TEST button counts as that click.
*/

(function () {
  "use strict";

  // -----------------------------
  // Storage
  // -----------------------------
  const LS_KEY_MODE = "KC_IM_ALERT_MODE"; // disabled | popup | popup_sound
  const LS_KEY_SOUND = "KC_IM_ALERT_SOUND_ID";
  const LS_KEY_TTS_TEXT = "KC_IM_ALERT_TTS_TEXT";

  const DEFAULTS = {
    mode: "popup_sound",
    soundId: "tts_new_message",
    ttsText: "New message by KillerCleat"
  };

  function getSetting(key, fallback) {
    const v = localStorage.getItem(key);
    return v === null || v === undefined || v === "" ? fallback : v;
  }
  function setSetting(key, val) {
    localStorage.setItem(key, String(val));
  }

  function getMode() {
    return getSetting(LS_KEY_MODE, DEFAULTS.mode);
  }
  function getSoundId() {
    return getSetting(LS_KEY_SOUND, DEFAULTS.soundId);
  }
  function getTTSText() {
    return getSetting(LS_KEY_TTS_TEXT, DEFAULTS.ttsText);
  }

  // -----------------------------
  // Sound library
  // -----------------------------
  // These mp3 URLs are the "mp3 DOWNLOAD" links on the NotificationSounds pages. :contentReference[oaicite:1]{index=1}
  const SOUND_LIBRARY = [
    // Built-in Text To Speech options (no external download needed)
    { id: "tts_new_message", label: "TTS: New message (spoken)", type: "tts" },
    { id: "tts_incoming", label: "TTS: Incoming message (spoken)", type: "tts_incoming" },

    // Your provided NotificationSounds links (mp3 download endpoints)
    {
      id: "message_girl_voice",
      label: "Message (girl voice)",
      type: "mp3",
      url: "https://proxy.notificationsounds.com/message-tones/message-girl-voice-tone/download/file-sounds-1192-message.mp3"
    },
    {
      id: "its_for_you_man",
      label: "It's for you (man voice)",
      type: "mp3",
      url: "https://proxy.notificationsounds.com/voice-ringtones/ringtone-its-for-you-man/download/file-sounds-1303-man-its-for-you.mp3"
    },
    {
      id: "new_notification_female",
      label: "New notification (female voice)",
      type: "mp3",
      url: "https://proxy.notificationsounds.com/message-tones/new-notification-female-voice/download/file-sounds-1197-new-notification.mp3"
    },
    {
      id: "man_new_message",
      label: "Man: New message",
      type: "mp3",
      url: "https://proxy.notificationsounds.com/voice-ringtones/man-new-message-tone/download/file-sounds-1311-man-new-message.mp3"
    },
    {
      id: "new_message_girl_asmr",
      label: "New message (girl ASMR)",
      type: "mp3",
      url: "https://proxy.notificationsounds.com/asmr-ringtones/new-message-girl-asmr-ringtone/download/file-sounds-1269-asmr-girl-new-message.mp3"
    },
    {
      id: "you_there_asmr_girl",
      label: "You there? (ASMR girl)",
      type: "mp3",
      url: "https://proxy.notificationsounds.com/asmr-ringtones/you-there-asmr-girl-ringtone/download/file-sounds-1280-asmr-girl-you-there.mp3"
    },
    {
      id: "male_you_have_new_message",
      label: "Male: You have a new message",
      type: "mp3",
      url: "https://proxy.notificationsounds.com/voice-ringtones/male-you-have-new-message-tone/download/file-sounds-1323-man-you-have-a-new-message.mp3"
    },
    {
      id: "you_have_a_new_message",
      label: "You have a new message (girl voice)",
      type: "mp3",
      url: "https://proxy.notificationsounds.com/message-tones/you-have-a-new-message/download/file-sounds-1206-you-have-a-new-message.mp3"
    },
    {
      id: "message_second_version_girl",
      label: "Message (second version)",
      type: "mp3",
      url: "https://proxy.notificationsounds.com/message-tones/message-second-version-girl-voice-tone/download/file-sounds-1193-message-2.mp3"
    }
  ];

  function findSoundById(id) {
    return SOUND_LIBRARY.find(s => s.id === id) || SOUND_LIBRARY[0];
  }

  // -----------------------------
  // Audio / TTS playback
  // -----------------------------
  let lastAudio = null;

  function stopSound() {
    try {
      if (lastAudio) {
        lastAudio.pause();
        lastAudio.currentTime = 0;
      }
    } catch (e) {}
    lastAudio = null;

    // Cancel any speaking
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;

    // Cancel any queued speech so it speaks immediately
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = 1.0;

    window.speechSynthesis.speak(u);
  }

  function playAlertSound() {
    const sound = findSoundById(getSoundId());

    if (sound.type === "tts") {
      speak(getTTSText());
      return;
    }
    if (sound.type === "tts_incoming") {
      speak("Incoming message");
      return;
    }

    // mp3
    try {
      stopSound();
      const a = new Audio(sound.url);
      a.preload = "auto";
      a.volume = 1.0; // max allowed for HTMLAudio
      lastAudio = a;
      const p = a.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch (e) {
      console.log("KC IM Alert: play failed:", e);
    }
  }

  // -----------------------------
  // Popup overlay
  // -----------------------------
  const POPUP_ID = "kc-im-alert-popup-overlay";
  let popupOpen = false;
  let repeatTimer = null;
  let lastSeenCount = 0; // current baseline
  let lastTriggeredCount = 0; // last count we alerted on

  function lockScroll(lock) {
    if (lock) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }

  function removePopup() {
    const existing = document.getElementById(POPUP_ID);
    if (existing) existing.remove();
    popupOpen = false;
    lockScroll(false);

    if (repeatTimer) {
      clearInterval(repeatTimer);
      repeatTimer = null;
    }
    stopSound();
  }

  function showPopup(count, isTest) {
    removePopup();

    const overlay = document.createElement("div");
    overlay.id = POPUP_ID;
    overlay.innerHTML = `
      <div class="kc-im-alert-modal">
        <div class="kc-im-alert-title">NEW TORN IM MESSAGE</div>
        <div class="kc-im-alert-body">
          Unread IM count: <span class="kc-im-alert-count">${count}</span>
        </div>
        <div class="kc-im-alert-buttons">
          <button type="button" class="kc-im-alert-btn kc-im-alert-btn-test">TEST SOUND</button>
          <button type="button" class="kc-im-alert-btn kc-im-alert-btn-close">CLOSE</button>
        </div>
        <div class="kc-im-alert-footnote">
          ${isTest ? "THIS IS A TEST POPUP." : "Sound repeats every 30 seconds until you close this popup."}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    popupOpen = true;
    lockScroll(true);

    overlay.querySelector(".kc-im-alert-btn-close").addEventListener("click", () => {
      removePopup();
      // We consider the popup "acknowledged" only when closed
      lastTriggeredCount = count;
    });

    overlay.querySelector(".kc-im-alert-btn-test").addEventListener("click", () => {
      playAlertSound();
    });
  }

  function startRepeatingSound() {
    if (repeatTimer) clearInterval(repeatTimer);

    playAlertSound();
    repeatTimer = setInterval(() => {
      if (!popupOpen) return;
      playAlertSound();
    }, 30000);
  }

  // -----------------------------
  // Styles
  // -----------------------------
  function injectStyles() {
    const css = `
      #${POPUP_ID} {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        background: rgba(0,0,0,0.72);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
      #${POPUP_ID} .kc-im-alert-modal {
        width: min(520px, 100%);
        background: #111;
        border: 2px solid #2b2b2b;
        border-radius: 10px;
        padding: 18px 18px 14px 18px;
        box-shadow: 0 0 0 1px rgba(255,255,255,0.05) inset;
        color: #fff;
        font-family: Arial, Helvetica, sans-serif;
      }
      #${POPUP_ID} .kc-im-alert-title {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 10px;
      }
      #${POPUP_ID} .kc-im-alert-body {
        font-size: 16px;
        margin-bottom: 14px;
        color: #eaeaea;
      }
      #${POPUP_ID} .kc-im-alert-count {
        font-weight: 700;
        font-size: 18px;
      }
      #${POPUP_ID} .kc-im-alert-buttons {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-bottom: 10px;
      }
      #${POPUP_ID} .kc-im-alert-btn {
        border: 1px solid #3a3a3a;
        background: #1c1c1c;
        color: #fff;
        padding: 10px 12px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 700;
        font-size: 13px;
      }
      #${POPUP_ID} .kc-im-alert-btn:hover { background: #252525; }
      #${POPUP_ID} .kc-im-alert-footnote {
        font-size: 12px;
        color: #bdbdbd;
        line-height: 1.3;
      }

      .kc-im-settings-wrap {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgba(0,0,0,0.15);
      }
      .kc-im-settings-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 8px 0;
      }
      .kc-im-settings-label {
        font-size: 12px;
        color: #333333;
        font-weight: 700;
        min-width: 120px;
      }
      .kc-im-settings-control select,
      .kc-im-settings-control input,
      .kc-im-settings-control button {
        font-size: 12px;
        padding: 6px 8px;
      }
      .kc-im-settings-control button { cursor: pointer; }
      .kc-im-settings-tts {
        width: 180px;
      }
    `;
    const style = document.createElement("style");
    style.id = "kc-im-alert-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  // -----------------------------
  // IM count watcher
  // -----------------------------
  function readUnreadCount() {
    const p = document.querySelector(".chat-list-button__message-count___egnZ8 p");
    if (!p) return 0;
    const raw = (p.textContent || "").trim();
    const n = parseInt(raw, 10);
    return isFinite(n) ? n : 0;
  }

  function onNewCount(count) {
    if (count <= 0) return;

    // Trigger only when count increases beyond lastTriggeredCount
    if (count <= lastTriggeredCount) return;

    const mode = getMode();
    if (mode === "disabled") {
      lastTriggeredCount = count;
      return;
    }

    showPopup(count, false);

    if (mode === "popup_sound") {
      startRepeatingSound();
    }

    // Do NOT set lastTriggeredCount here; we set it when popup closes,
    // so you won't miss anything while it's open.
  }

  function startWatcher() {
    lastSeenCount = readUnreadCount();
    lastTriggeredCount = lastSeenCount;

    const obs = new MutationObserver(() => {
      const c = readUnreadCount();

      if (popupOpen) {
        // If more messages arrive while popup open, update displayed number and play once
        if (c > lastSeenCount) {
          lastSeenCount = c;
          const el = document.querySelector(`#${POPUP_ID} .kc-im-alert-count`);
          if (el) el.textContent = String(c);

          if (getMode() === "popup_sound") {
            playAlertSound();
          }
        }
        return;
      }

      if (c > lastSeenCount) {
        lastSeenCount = c;
        onNewCount(c);
      } else {
        lastSeenCount = c;
        // Also keep triggered baseline in sync when user reads messages and count drops
        if (c < lastTriggeredCount) lastTriggeredCount = c;
      }
    });

    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  // -----------------------------
  // Settings panel injection
  // -----------------------------
  function makeOption(label, value) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    return opt;
  }

  function injectSettingsIntoChatPanel() {
    const settingsPanel = document.querySelector(".settings-panel__notifications-wrapper___l9L3e");
    if (!settingsPanel) return false;
    if (document.getElementById("kc-im-settings-root")) return true;

    const root = document.createElement("div");
    root.id = "kc-im-settings-root";
    root.className = "kc-im-settings-wrap";

    const header = document.createElement("div");
    header.style.fontSize = "12px";
    header.style.fontWeight = "700";
    header.style.color = "#333333";
    header.style.marginBottom = "6px";
    header.textContent = "IM Alert (KillerCleat)";

    // Mode
    const rowMode = document.createElement("div");
    rowMode.className = "kc-im-settings-row";
    rowMode.appendChild(Object.assign(document.createElement("div"), { className: "kc-im-settings-label", textContent: "Alert Mode" }));
    const modeSel = document.createElement("select");
    modeSel.appendChild(makeOption("Disabled", "disabled"));
    modeSel.appendChild(makeOption("Popup only", "popup"));
    modeSel.appendChild(makeOption("Popup + sound", "popup_sound"));
    modeSel.value = getMode();
    modeSel.addEventListener("change", () => setSetting(LS_KEY_MODE, modeSel.value));
    const modeCtl = document.createElement("div");
    modeCtl.className = "kc-im-settings-control";
    modeCtl.appendChild(modeSel);
    rowMode.appendChild(modeCtl);

    // Sound select
    const rowSound = document.createElement("div");
    rowSound.className = "kc-im-settings-row";
    rowSound.appendChild(Object.assign(document.createElement("div"), { className: "kc-im-settings-label", textContent: "Alert Sound" }));
    const soundSel = document.createElement("select");
    SOUND_LIBRARY.forEach(s => soundSel.appendChild(makeOption(s.label, s.id)));
    soundSel.value = getSoundId();
    soundSel.addEventListener("change", () => setSetting(LS_KEY_SOUND, soundSel.value));
    const soundCtl = document.createElement("div");
    soundCtl.className = "kc-im-settings-control";
    soundCtl.appendChild(soundSel);
    rowSound.appendChild(soundCtl);

    // TTS text (only applies to TTS mode, but harmless always)
    const rowTTS = document.createElement("div");
    rowTTS.className = "kc-im-settings-row";
    rowTTS.appendChild(Object.assign(document.createElement("div"), { className: "kc-im-settings-label", textContent: "TTS Text" }));
    const ttsInput = document.createElement("input");
    ttsInput.type = "text";
    ttsInput.className = "kc-im-settings-tts";
    ttsInput.value = getTTSText();
    ttsInput.addEventListener("change", () => setSetting(LS_KEY_TTS_TEXT, ttsInput.value));
    const ttsCtl = document.createElement("div");
    ttsCtl.className = "kc-im-settings-control";
    ttsCtl.appendChild(ttsInput);
    rowTTS.appendChild(ttsCtl);

    // Test button: SHOW POPUP + SOUND
    const rowTest = document.createElement("div");
    rowTest.className = "kc-im-settings-row";
    rowTest.appendChild(Object.assign(document.createElement("div"), { className: "kc-im-settings-label", textContent: "Test" }));
    const testBtn = document.createElement("button");
    testBtn.type = "button";
    testBtn.textContent = "TEST POPUP + SOUND";
    testBtn.addEventListener("click", () => {
      const fakeCount = Math.max(1, readUnreadCount() || 1);
      showPopup(fakeCount, true);
      if (getMode() === "popup_sound") {
        startRepeatingSound();
      } else {
        // even if popup-only, still let the test play once so you know sound works
        playAlertSound();
      }
    });
    const testCtl = document.createElement("div");
    testCtl.className = "kc-im-settings-control";
    testCtl.appendChild(testBtn);
    rowTest.appendChild(testCtl);

    root.appendChild(header);
    root.appendChild(rowMode);
    root.appendChild(rowSound);
    root.appendChild(rowTTS);
    root.appendChild(rowTest);

    settingsPanel.insertBefore(root, settingsPanel.firstChild);
    return true;
  }

  function startSettingsInjector() {
    const tryInject = () => injectSettingsIntoChatPanel();
    tryInject();
    const obs = new MutationObserver(() => tryInject());
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // -----------------------------
  // Init
  // -----------------------------
  function init() {
    if (!localStorage.getItem(LS_KEY_MODE)) setSetting(LS_KEY_MODE, DEFAULTS.mode);
    if (!localStorage.getItem(LS_KEY_SOUND)) setSetting(LS_KEY_SOUND, DEFAULTS.soundId);
    if (!localStorage.getItem(LS_KEY_TTS_TEXT)) setSetting(LS_KEY_TTS_TEXT, DEFAULTS.ttsText);

    injectStyles();
    startWatcher();
    startSettingsInjector();
  }

  init();
})();
