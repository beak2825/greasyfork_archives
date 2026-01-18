// ==UserScript==
// @name         OpenFront.io - Audio Notifications
// @namespace    https://github.com/antigrid/openfront-audio-notifications
// @version      0.0.1
// @description  Plays audio notifications for game events: incoming threats (MIRV, Nuke, Hydrogen Bomb, Naval Invasion), chat/emoji messages, troop capacity warnings (64%/82%), alliance expiry & endings, betrayals, and boat arrivals
// @author       antigrid (Discord: webdev.js)
// @match        https://*.openfront.io/*
// @match        https://*.openfront.dev/*
// @icon         https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f50a.svg
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @homepageURL  https://github.com/antigrid/openfront-audio-notifications
// @supportURL   https://github.com/antigrid/openfront-audio-notifications/issues
// @downloadURL https://update.greasyfork.org/scripts/563151/OpenFrontio%20-%20Audio%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/563151/OpenFrontio%20-%20Audio%20Notifications.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const CONFIG = {
    STORAGE_KEY: "ofio-audio-notifications-settings",
    POSITION_STORAGE_KEY: "ofio-audio-notifications-position",
    VISIBILITY_STORAGE_KEY: "ofio-audio-notifications-visibility",
    DEFAULT_VOLUME: 100,
    DEFAULT_ENABLED: true,
    DEFAULT_PANEL_VISIBLE: true,
  };

  const SOUND_CATEGORIES = [
    {
      name: "Incoming Threats",
      sounds: [
        { key: "mirv", label: "MIRV" },
        { key: "nuke", label: "Nuke" },
        { key: "hydrogenBomb", label: "Hydrogen Bomb" },
        { key: "navalInvasion", label: "Naval Invasion" },
      ],
    },
    {
      name: "Communication",
      sounds: [{ key: "chat", label: "Chat & Emoji" }],
    },
    {
      name: "Troop Management",
      sounds: [
        { key: "troopCapacityWarning", label: "Capacity Warning (64%)" },
        { key: "troopCapacityCritical", label: "Capacity Critical (82%)" },
      ],
    },
    {
      name: "Alliance Events",
      sounds: [
        { key: "allianceRequest", label: "Alliance Request" },
        { key: "allianceRequestAccepted", label: "Request Accepted" },
        { key: "allianceRequestRejected", label: "Request Rejected" },
        { key: "allianceExpiringSoon", label: "Expiring Soon" },
        { key: "allianceEnded", label: "Alliance Ended" },
        { key: "betrayed", label: "Betrayed" },
        { key: "allyDisconnected", label: "Ally Disconnected" },
      ],
    },
    {
      name: "Game Events",
      sounds: [
        { key: "boatArrival", label: "Boat Arrival" },
        { key: "tradeShipCaptured", label: "Trade Ship Captured" },
        { key: "warshipCombat", label: "Warship Combat" },
      ],
    },
  ];

  let panelState = {
    enabled: CONFIG.DEFAULT_ENABLED,
    volume: CONFIG.DEFAULT_VOLUME,
    minimized: false,
    settingsOpen: false,
    panelVisible: true,
    sounds: {
      mirv: true,
      nuke: true,
      hydrogenBomb: true,
      navalInvasion: true,
      chat: true,
      troopCapacityWarning: false,
      troopCapacityCritical: true,
      allianceRequest: true,
      allianceRequestAccepted: true,
      allianceRequestRejected: true,
      allianceExpiringSoon: true,
      allianceEnded: true,
      betrayed: true,
      allyDisconnected: true,
      boatArrival: true,
      tradeShipCaptured: true,
      warshipCombat: true,
    },
  };

  function loadSettings() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        panelState.enabled = parsed.enabled ?? CONFIG.DEFAULT_ENABLED;
        panelState.volume = Math.max(0, Math.min(100, parsed.volume ?? CONFIG.DEFAULT_VOLUME));
        panelState.minimized = parsed.minimized ?? false;
        panelState.settingsOpen = parsed.settingsOpen ?? false;
        if (parsed.sounds) {
          Object.keys(panelState.sounds).forEach((key) => {
            if (typeof parsed.sounds[key] === "boolean") {
              panelState.sounds[key] = parsed.sounds[key];
            }
          });
        }
      }
      panelState.panelVisible = loadPanelVisibility();
    } catch (_) {}
  }

  function saveSettings() {
    try {
      localStorage.setItem(
        CONFIG.STORAGE_KEY,
        JSON.stringify({
          enabled: panelState.enabled,
          volume: panelState.volume,
          minimized: panelState.minimized,
          settingsOpen: panelState.settingsOpen,
          sounds: panelState.sounds,
        }),
      );
    } catch (_) {}
  }

  function loadPanelPosition() {
    try {
      const saved = localStorage.getItem(CONFIG.POSITION_STORAGE_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (typeof parsed?.x !== "number" || typeof parsed?.y !== "number") return null;
      return { x: parsed.x, y: parsed.y };
    } catch (_) {
      return null;
    }
  }

  function savePanelPosition(x, y) {
    try {
      localStorage.setItem(CONFIG.POSITION_STORAGE_KEY, JSON.stringify({ x, y }));
    } catch (_) {}
  }

  function loadPanelVisibility() {
    try {
      const saved = localStorage.getItem(CONFIG.VISIBILITY_STORAGE_KEY);
      if (saved !== null) {
        return saved === "true";
      }
      return CONFIG.DEFAULT_PANEL_VISIBLE;
    } catch (_) {
      return CONFIG.DEFAULT_PANEL_VISIBLE;
    }
  }

  function savePanelVisibility(visible) {
    try {
      localStorage.setItem(CONFIG.VISIBILITY_STORAGE_KEY, String(visible));
    } catch (_) {}
  }

  let menuCommandId = null;

  function registerMenuCommand() {
    if (menuCommandId !== null) {
      try {
        GM_unregisterMenuCommand(menuCommandId);
      } catch (_) {}
    }

    const menuLabel = panelState.panelVisible ? "Hide Audio Panel" : "Show Audio Panel";
    menuCommandId = GM_registerMenuCommand(menuLabel, togglePanelVisibility);
  }

  function togglePanelVisibility() {
    panelState.panelVisible = !panelState.panelVisible;
    savePanelVisibility(panelState.panelVisible);
    applyPanelVisibility();
    registerMenuCommand();
  }

  function applyPanelVisibility() {
    const panel = document.getElementById("ofio-audio-panel");
    if (panel) {
      panel.style.display = panelState.panelVisible ? "" : "none";
    }
  }

  function clampPanelPosition(panel, x, y) {
    const rect = panel.getBoundingClientRect();
    const maxX = Math.max(0, window.innerWidth - rect.width);
    const maxY = Math.max(0, window.innerHeight - rect.height);
    return {
      x: Math.min(Math.max(0, x), maxX),
      y: Math.min(Math.max(0, y), maxY),
    };
  }

  function isSoundEnabled(soundKey) {
    return panelState.enabled && panelState.sounds[soundKey];
  }

  const HOOK_FLAG = "__ofioAudioHooked";

  const GameUpdateType = {
    Unit: 1,
    Player: 2,
    DisplayChatEvent: 4,
    AllianceRequest: 5,
    AllianceRequestReply: 6,
    BrokeAlliance: 7,
    AllianceExpired: 8,
    Emoji: 11,
    UnitIncoming: 14,
  };

  const UnitType = {
    TransportShip: "Transport",
    TradeShip: "Trade Ship",
    Warship: "Warship",
  };

  const MessageType = {
    MIRV_INBOUND: 4,
    NUKE_INBOUND: 5,
    HYDROGEN_BOMB_INBOUND: 6,
    NAVAL_INVASION_INBOUND: 7,
  };

  const TROOP_CAPACITY_WARNING_THRESHOLD = 0.64;
  const TROOP_CAPACITY_CRITICAL_THRESHOLD = 0.82;

  // Alliance expiring prompt offset in ticks (30 seconds = 300 ticks at 10 ticks/sec)
  const ALLIANCE_EXTENSION_PROMPT_OFFSET = 300;

  let audioContext = null;

  function getAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
  }

  function playTone({
    type = "sine",
    startFreq,
    endFreq,
    volume = 0.12,
    duration = 0.1,
    delay = 0,
    attack = 0.004,
    release = 0.04,
    ignoreSettings = false,
  }) {
    try {
      if (!ignoreSettings) {
        volume = volume * (panelState.volume / 100);
      }

      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.connect(gain);
      gain.connect(ctx.destination);

      const startTime = ctx.currentTime + delay;
      const endTime = startTime + Math.max(0.001, duration);

      osc.frequency.setValueAtTime(Math.max(1, startFreq || 440), startTime);
      const targetEnd = endFreq ?? startFreq;
      if (targetEnd && targetEnd !== startFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, targetEnd), endTime);
      }

      const a = Math.min(attack, duration * 0.4);
      const r = Math.min(release, duration * 0.7);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), startTime + a);
      gain.gain.setValueAtTime(Math.max(0.0002, volume), Math.max(startTime + a, endTime - r));
      gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

      osc.start(startTime);
      osc.stop(endTime + 0.01);
    } catch (_) {}
  }

  function playClick({ freq = 900, volume = 0.1, duration = 0.045, delay = 0 }) {
    playTone({
      type: "square",
      startFreq: freq,
      endFreq: freq * 0.985,
      volume,
      duration,
      delay,
      attack: 0.002,
      release: 0.02,
    });
  }

  function arpeggio({ notes, type = "sine", volume = 0.1, noteDur = 0.08, gap = 0.03, delay = 0 }) {
    notes.forEach((f, i) => {
      playTone({
        type,
        startFreq: f,
        endFreq: f * 1.01,
        volume: volume * (1 - i * 0.06),
        duration: noteDur,
        delay: delay + i * (noteDur + gap),
        attack: 0.004,
        release: 0.04,
      });
    });
  }

  function burst({ count = 3, interval = 0.06, fn }) {
    for (let i = 0; i < count; i++) fn(i, i * interval);
  }

  const SOUNDS = {
    mirv() {
      for (let i = 0; i < 5; i++) {
        playTone({
          type: "sawtooth",
          startFreq: 2000 - i * 200,
          endFreq: 300 - i * 20,
          volume: 0.15,
          duration: 0.4,
          delay: i * 0.12,
        });
      }
    },
    nuke() {
      playTone({ type: "triangle", startFreq: 1800, endFreq: 120, volume: 0.25, duration: 1 });
    },
    hydrogenBomb() {
      playTone({ type: "sine", startFreq: 1500, endFreq: 100, volume: 0.3, duration: 0.8 });
      playTone({ type: "sawtooth", startFreq: 100, endFreq: 50, volume: 0.2, duration: 0.8 });
    },
    navalInvasion() {
      playTone({ type: "triangle", startFreq: 260, volume: 0.3, duration: 0.5 });
    },
    chat() {
      playTone({ type: "sine", startFreq: 740, volume: 0.12, duration: 0.05 });
      playTone({ type: "sine", startFreq: 988, volume: 0.1, duration: 0.06, delay: 0.06 });
    },
    troopCapacityWarning() {
      playClick({ freq: 900, volume: 0.15, duration: 0.06, delay: 0.0 });
      playClick({ freq: 1050, volume: 0.16, duration: 0.06, delay: 0.1 });
      playClick({ freq: 1200, volume: 0.17, duration: 0.06, delay: 0.2 });
    },
    troopCapacityCritical() {
      playClick({ freq: 900, volume: 0.16, duration: 0.06, delay: 0.0 });
      playClick({ freq: 1050, volume: 0.17, duration: 0.06, delay: 0.1 });
      playClick({ freq: 1350, volume: 0.18, duration: 0.06, delay: 0.2 });
    },
    allianceRequest() {
      playTone({
        type: "sine",
        startFreq: 520,
        endFreq: 520,
        volume: 0.075,
        duration: 0.12,
        attack: 0.004,
        release: 0.11,
      });
      playTone({
        type: "sine",
        startFreq: 1040,
        endFreq: 1040,
        volume: 0.045,
        duration: 0.18,
        delay: 0.02,
        attack: 0.004,
        release: 0.16,
      });
    },
    allianceExpiringSoon() {
      playTone({
        type: "sine",
        startFreq: 520,
        endFreq: 520,
        volume: 0.075,
        duration: 0.12,
        attack: 0.004,
        release: 0.11,
      });
      playTone({
        type: "sine",
        startFreq: 1040,
        endFreq: 1040,
        volume: 0.045,
        duration: 0.18,
        delay: 0.02,
        attack: 0.004,
        release: 0.16,
      });
    },
    allianceRequestAccepted() {
      burst({
        count: 5,
        interval: 0.055,
        fn: (i, d) =>
          playTone({
            type: "triangle",
            startFreq: 260 + i * 140,
            endFreq: 260 + i * 140 * 1.06,
            volume: 0.09,
            duration: 0.05,
            delay: d,
            attack: 0.002,
            release: 0.03,
          }),
      });
    },
    allianceRequestRejected() {
      burst({
        count: 5,
        interval: 0.07,
        fn: (i, d) => {
          const base = 980 - i * 150;
          const wobble = i % 2 === 0 ? 1 : 0.97;

          playTone({
            type: "triangle",
            startFreq: base * wobble,
            endFreq: base * 0.9,
            volume: 0.085,
            duration: 0.055,
            delay: d,
            attack: 0.002,
            release: 0.035,
          });
        },
      });
    },
    allianceEnded() {
      for (let i = 0; i < 3; i++) {
        playClick({ freq: 600 - i * 50, volume: 0.13, duration: 0.05, delay: i * 0.35 });
      }
    },
    betrayed() {
      playTone({
        type: "sine",
        startFreq: 80,
        volume: 0.3,
        duration: 0.08,
      });
      playTone({
        type: "sine",
        startFreq: 80,
        volume: 0.3,
        duration: 0.08,
        delay: 0.12,
      });
    },
    allyDisconnected() {
      playTone({
        type: "sine",
        startFreq: 660,
        endFreq: 620,
        volume: 0.1,
        duration: 0.12,
        attack: 0.003,
        release: 0.08,
      });
      playTone({
        type: "sine",
        startFreq: 520,
        endFreq: 480,
        volume: 0.09,
        duration: 0.12,
        delay: 0.14,
        attack: 0.003,
        release: 0.08,
      });
      playTone({
        type: "sine",
        startFreq: 390,
        endFreq: 350,
        volume: 0.08,
        duration: 0.15,
        delay: 0.28,
        attack: 0.003,
        release: 0.1,
      });
    },
    boatArrival() {
      playTone({
        type: "sine",
        startFreq: 1568,
        endFreq: 1660,
        volume: 0.09,
        duration: 0.06,
        attack: 0.002,
        release: 0.05,
      });
      playTone({
        type: "sine",
        startFreq: 2093,
        endFreq: 1976,
        volume: 0.07,
        duration: 0.07,
        delay: 0.03,
        attack: 0.002,
        release: 0.06,
      });
    },
    tradeShipCaptured() {
      burst({
        count: 1,
        interval: 0.08,
        fn: (i, d) =>
          playTone({
            type: "sawtooth",
            startFreq: 200 + i * 30,
            endFreq: 180 + i * 30,
            volume: 0.08,
            duration: 0.05,
            delay: d,
            attack: 0.002,
            release: 0.03,
          }),
      });
    },
    warshipCombat() {
      burst({
        count: 3,
        interval: 0.08,
        fn: (i, d) =>
          playTone({
            type: "sawtooth",
            startFreq: 200 + i * 30,
            endFreq: 180 + i * 30,
            volume: 0.08,
            duration: 0.05,
            delay: d,
            attack: 0.002,
            release: 0.03,
          }),
      });
    },
    infoPing() {
      arpeggio({ notes: [880, 1175], type: "sine", volume: 0.09, noteDur: 0.06, gap: 0.04 });
    },
    select() {
      playClick({ freq: 1100, volume: 0.1, duration: 0.04 });
      playClick({ freq: 1320, volume: 0.08, duration: 0.03, delay: 0.04 });
    },
    deselect() {
      playClick({ freq: 1100, volume: 0.08, duration: 0.04 });
      playClick({ freq: 880, volume: 0.06, duration: 0.03, delay: 0.04 });
    },
    dialogOpen() {
      playTone({ type: "sine", startFreq: 523, volume: 0.12, duration: 0.15 });
      playTone({ type: "sine", startFreq: 659, volume: 0.1, duration: 0.12, delay: 0.06 });
    },

    dialogClose() {
      playTone({ type: "sine", startFreq: 659, volume: 0.09, duration: 0.1 });
      playTone({ type: "sine", startFreq: 523, volume: 0.08, duration: 0.12, delay: 0.04 });
    },
  };

  const threatState = {
    processedUnitIds: new Set(),
    lastSoundTime: 0,
    soundCooldown: 500,
  };

  function handleIncomingThreats(game, updates) {
    if (!updates) return;

    const myPlayer = game?.myPlayer?.();
    if (!myPlayer?.isAlive?.()) return;

    const mySmallID = myPlayer.smallID?.();
    if (mySmallID === undefined) return;

    const incomingUnits = updates[GameUpdateType.UnitIncoming];
    if (!incomingUnits?.length) return;

    const now = Date.now();

    for (const event of incomingUnits) {
      if (event.playerID !== mySmallID) continue;
      if (threatState.processedUnitIds.has(event.unitID)) continue;

      threatState.processedUnitIds.add(event.unitID);

      if (now - threatState.lastSoundTime >= threatState.soundCooldown) {
        let soundPlayed = false;
        switch (event.messageType) {
          case MessageType.MIRV_INBOUND:
            if (isSoundEnabled("mirv")) {
              SOUNDS.mirv();
              soundPlayed = true;
            }
            break;
          case MessageType.NUKE_INBOUND:
            if (isSoundEnabled("nuke")) {
              SOUNDS.nuke();
              soundPlayed = true;
            }
            break;
          case MessageType.HYDROGEN_BOMB_INBOUND:
            if (isSoundEnabled("hydrogenBomb")) {
              SOUNDS.hydrogenBomb();
              soundPlayed = true;
            }
            break;
          case MessageType.NAVAL_INVASION_INBOUND:
            if (isSoundEnabled("navalInvasion")) {
              SOUNDS.navalInvasion();
              soundPlayed = true;
            }
            break;
        }
        if (soundPlayed) threatState.lastSoundTime = now;
      }
    }

    if (threatState.processedUnitIds.size > 100) {
      const ids = Array.from(threatState.processedUnitIds);
      threatState.processedUnitIds = new Set(ids.slice(-50));
    }
  }

  const chatState = {
    lastSoundTime: 0,
    soundCooldown: 300,
  };

  function handleChatNotifications(game, updates) {
    if (!updates) return;

    const myPlayer = game?.myPlayer?.();
    if (!myPlayer?.isAlive?.()) return;

    const mySmallID = myPlayer.smallID?.();
    if (mySmallID === undefined) return;

    const now = Date.now();
    if (now - chatState.lastSoundTime < chatState.soundCooldown) return;

    // Chat: playerID is who sees the message, isFrom=true means it's FROM another player (incoming)
    const chatEvents = updates[GameUpdateType.DisplayChatEvent] ?? [];
    for (const event of chatEvents) {
      if (event.playerID === mySmallID && event.isFrom) {
        if (isSoundEnabled("chat")) {
          SOUNDS.chat();
          chatState.lastSoundTime = now;
        }
        return;
      }
    }

    const emojiEvents = updates[GameUpdateType.Emoji] ?? [];
    for (const event of emojiEvents) {
      const recipientID = event.emoji?.recipientID;
      const senderID = event.emoji?.senderID;
      if (recipientID === mySmallID && senderID !== mySmallID) {
        if (isSoundEnabled("chat")) {
          SOUNDS.chat();
          chatState.lastSoundTime = now;
        }
        return;
      }
    }
  }

  const allianceRequestState = {
    lastSoundTime: 0,
    soundCooldown: 300,
  };

  function handleAllianceRequestNotifications(game, updates) {
    if (!updates) return;

    const myPlayer = game?.myPlayer?.();
    if (!myPlayer?.isAlive?.()) return;

    const mySmallID = myPlayer.smallID?.();
    if (mySmallID === undefined) return;

    const now = Date.now();

    const allianceRequests = updates[GameUpdateType.AllianceRequest] ?? [];
    for (const event of allianceRequests) {
      if (event.recipientID === mySmallID && event.requestorID !== mySmallID) {
        try {
          const requestor = game.playerBySmallID?.(event.requestorID);
          if (!requestor?.isAlive?.()) {
            continue;
          }
        } catch (_) {
          continue;
        }

        if (now - allianceRequestState.lastSoundTime >= allianceRequestState.soundCooldown) {
          if (isSoundEnabled("allianceRequest")) {
            SOUNDS.allianceRequest();
            allianceRequestState.lastSoundTime = now;
          }
        }
        return;
      }
    }

    const allianceReplies = updates[GameUpdateType.AllianceRequestReply] ?? [];
    for (const event of allianceReplies) {
      if (event.request?.requestorID === mySmallID && event.request?.recipientID !== mySmallID) {
        if (now - allianceRequestState.lastSoundTime >= allianceRequestState.soundCooldown) {
          if (event.accepted) {
            if (isSoundEnabled("allianceRequestAccepted")) {
              SOUNDS.allianceRequestAccepted();
              allianceRequestState.lastSoundTime = now;
            }
          } else {
            if (isSoundEnabled("allianceRequestRejected")) {
              SOUNDS.allianceRequestRejected();
              allianceRequestState.lastSoundTime = now;
            }
          }
        }
        return;
      }
    }
  }

  const troopCapacityState = {
    lastLevel: null, // null = unknown, 'normal', 'warning', 'critical'
    lastSoundTime: 0,
    soundCooldown: 5000,
  };

  function handleTroopCapacityNotifications(game) {
    const myPlayer = game?.myPlayer?.();
    if (!myPlayer?.isAlive?.()) {
      troopCapacityState.lastLevel = null;
      return;
    }

    const troops = myPlayer.troops?.();
    const config = game?.config?.();
    if (troops === undefined || !config) return;

    const maxTroops = config.maxTroops?.(myPlayer);
    if (!maxTroops || maxTroops <= 0) return;

    const ratio = troops / maxTroops;
    const now = Date.now();

    let currentLevel = "normal";
    if (ratio >= TROOP_CAPACITY_CRITICAL_THRESHOLD) {
      currentLevel = "critical";
    } else if (ratio >= TROOP_CAPACITY_WARNING_THRESHOLD) {
      currentLevel = "warning";
    }

    // Only play sound when transitioning to a higher level
    const levelPriority = { normal: 0, warning: 1, critical: 2 };
    const lastPriority = levelPriority[troopCapacityState.lastLevel] ?? -1;
    const currentPriority = levelPriority[currentLevel];

    if (currentPriority > lastPriority && now - troopCapacityState.lastSoundTime >= troopCapacityState.soundCooldown) {
      if (currentLevel === "critical" && isSoundEnabled("troopCapacityCritical")) {
        SOUNDS.troopCapacityCritical();
        troopCapacityState.lastSoundTime = now;
      } else if (currentLevel === "warning" && isSoundEnabled("troopCapacityWarning")) {
        SOUNDS.troopCapacityWarning();
        troopCapacityState.lastSoundTime = now;
      }
    }

    troopCapacityState.lastLevel = currentLevel;
  }

  const allianceExpiringState = {
    notifiedAllianceIds: new Set(),
    lastSoundTime: 0,
    soundCooldown: 1000,
  };

  function handleAllianceExpiringNotifications(game) {
    const myPlayer = game?.myPlayer?.();
    if (!myPlayer?.isAlive?.()) {
      allianceExpiringState.notifiedAllianceIds.clear();
      return;
    }

    const alliances = myPlayer.alliances?.();
    if (!alliances?.length) return;

    const currentTicks = game?.ticks?.();
    if (currentTicks === undefined) return;

    const now = Date.now();

    for (const alliance of alliances) {
      try {
        const otherPlayer = game.playerBySmallID?.(alliance.other);
        if (!otherPlayer?.isAlive?.()) {
          continue;
        }
      } catch (_) {
        continue;
      }

      if (alliance.expiresAt > currentTicks + ALLIANCE_EXTENSION_PROMPT_OFFSET) {
        allianceExpiringState.notifiedAllianceIds.delete(alliance.id);
        continue;
      }

      if (allianceExpiringState.notifiedAllianceIds.has(alliance.id)) {
        continue;
      }

      allianceExpiringState.notifiedAllianceIds.add(alliance.id);

      if (now - allianceExpiringState.lastSoundTime >= allianceExpiringState.soundCooldown) {
        if (isSoundEnabled("allianceExpiringSoon")) {
          SOUNDS.allianceRequest();
          allianceExpiringState.lastSoundTime = now;
        }
      }
    }

    const activeAllianceIds = new Set(alliances.map((a) => a.id));
    for (const id of allianceExpiringState.notifiedAllianceIds) {
      if (!activeAllianceIds.has(id)) {
        allianceExpiringState.notifiedAllianceIds.delete(id);
      }
    }
  }

  const allianceEndedState = {
    lastSoundTime: 0,
    soundCooldown: 500,
  };

  function handleAllianceEndedNotifications(game, updates) {
    if (!updates) return;

    const myPlayer = game?.myPlayer?.();
    if (!myPlayer?.isAlive?.()) return;

    const mySmallID = myPlayer.smallID?.();
    if (mySmallID === undefined) return;

    const allianceExpiredEvents = updates[GameUpdateType.AllianceExpired] ?? [];
    if (!allianceExpiredEvents.length) return;

    const now = Date.now();

    for (const event of allianceExpiredEvents) {
      if (event.player1ID !== mySmallID && event.player2ID !== mySmallID) {
        continue;
      }

      const otherPlayerID = event.player1ID === mySmallID ? event.player2ID : event.player1ID;
      try {
        const otherPlayer = game.playerBySmallID?.(otherPlayerID);
        if (!otherPlayer?.isAlive?.()) {
          continue;
        }
      } catch (_) {
        continue;
      }

      if (now - allianceEndedState.lastSoundTime >= allianceEndedState.soundCooldown) {
        if (isSoundEnabled("allianceEnded")) {
          SOUNDS.allianceEnded();
          allianceEndedState.lastSoundTime = now;
        }
        return;
      }
    }
  }

  const betrayalState = {
    lastSoundTime: 0,
    soundCooldown: 300,
  };

  function handleBetrayalNotifications(game, updates) {
    if (!updates) return;

    const myPlayer = game?.myPlayer?.();
    if (!myPlayer?.isAlive?.()) return;

    const mySmallID = myPlayer.smallID?.();
    if (mySmallID === undefined) return;

    const brokeAllianceEvents = updates[GameUpdateType.BrokeAlliance] ?? [];
    if (!brokeAllianceEvents.length) return;

    const now = Date.now();

    for (const event of brokeAllianceEvents) {
      const traitorID = event.traitorID;
      const betrayedID = event.betrayedID;

      if (traitorID === mySmallID) {
        continue;
      }

      try {
        const traitor = game.playerBySmallID?.(traitorID);
        if (traitor && myPlayer.isOnSameTeam(traitor)) {
          continue;
        }

        const betrayed = game.playerBySmallID?.(betrayedID);
        if (betrayed?.isDisconnected?.() || betrayed?.isTraitor?.()) {
          continue;
        }
      } catch (_) {
        // If we can't lookup players, still play the sound
      }

      if (now - betrayalState.lastSoundTime >= betrayalState.soundCooldown) {
        if (isSoundEnabled("betrayed")) {
          SOUNDS.betrayed();
          betrayalState.lastSoundTime = now;
        }
        return;
      }
    }
  }

  const boatArrivalState = {
    trackedBoats: new Set(),
    lastSoundTime: 0,
    soundCooldown: 300,
  };

  function handleBoatArrivalNotifications(game, updates) {
    const myPlayer = game?.myPlayer?.();
    if (!myPlayer?.isAlive?.()) return;

    const mySmallID = myPlayer.smallID?.();
    if (mySmallID === undefined) return;

    const now = Date.now();

    const unitUpdates = updates?.[GameUpdateType.Unit];
    if (unitUpdates?.length) {
      for (const unitUpdate of unitUpdates) {
        if (unitUpdate.unitType !== UnitType.TransportShip) continue;
        if (unitUpdate.ownerID !== mySmallID) continue;

        if (unitUpdate.isActive) {
          boatArrivalState.trackedBoats.add(unitUpdate.id);
        }
      }
    }

    for (const unitId of boatArrivalState.trackedBoats) {
      try {
        const unit = game.unit?.(unitId);

        if (!unit || !unit.data?.isActive) {
          boatArrivalState.trackedBoats.delete(unitId);
          if (now - boatArrivalState.lastSoundTime >= boatArrivalState.soundCooldown) {
            if (isSoundEnabled("boatArrival")) {
              SOUNDS.boatArrival();
              boatArrivalState.lastSoundTime = now;
            }
          }
        }
      } catch (_) {
        boatArrivalState.trackedBoats.delete(unitId);
      }
    }
  }

  const allyDisconnectedState = {
    notifiedDisconnected: new Map(),
    lastSoundTime: 0,
    soundCooldown: 500,
  };

  function handleAllyDisconnectedNotifications(game) {
    const myPlayer = game?.myPlayer?.();
    if (!myPlayer?.isAlive?.()) {
      allyDisconnectedState.notifiedDisconnected.clear();
      return;
    }

    const mySmallID = myPlayer.smallID?.();
    if (mySmallID === undefined) return;

    const now = Date.now();

    try {
      const players = game.players?.();
      if (!players) return;

      const currentFriendlyIds = new Set();

      for (const player of players) {
        const playerId = player.smallID?.();
        if (playerId === undefined || playerId === mySmallID) continue;

        if (!myPlayer.isFriendly?.(player, true)) continue;

        currentFriendlyIds.add(playerId);

        if (!player.isAlive?.()) {
          allyDisconnectedState.notifiedDisconnected.delete(playerId);
          continue;
        }

        const isDisconnected = player.isDisconnected?.();
        const wasNotified = allyDisconnectedState.notifiedDisconnected.get(playerId);

        if (isDisconnected && !wasNotified) {
          allyDisconnectedState.notifiedDisconnected.set(playerId, true);

          if (now - allyDisconnectedState.lastSoundTime >= allyDisconnectedState.soundCooldown) {
            if (isSoundEnabled("allyDisconnected")) {
              SOUNDS.allyDisconnected();
              allyDisconnectedState.lastSoundTime = now;
            }
          }
        } else if (!isDisconnected && wasNotified) {
          allyDisconnectedState.notifiedDisconnected.set(playerId, false);
        }
      }

      for (const trackedId of allyDisconnectedState.notifiedDisconnected.keys()) {
        if (!currentFriendlyIds.has(trackedId)) {
          allyDisconnectedState.notifiedDisconnected.delete(trackedId);
        }
      }
    } catch (_) {
    }
  }

  const tradeShipCapturedState = {
    trackedTradeShips: new Set(),
    notifiedCapturedShips: new Set(),
    lastSoundTime: 0,
    soundCooldown: 500,
  };

  function handleTradeShipCapturedNotifications(game, updates) {
    const myPlayer = game?.myPlayer?.();
    if (!myPlayer?.isAlive?.()) {
      tradeShipCapturedState.trackedTradeShips.clear();
      tradeShipCapturedState.notifiedCapturedShips.clear();
      return;
    }

    const mySmallID = myPlayer.smallID?.();
    if (mySmallID === undefined) return;

    const now = Date.now();

    const unitUpdates = updates?.[GameUpdateType.Unit];
    if (!unitUpdates?.length) return;

    for (const unitUpdate of unitUpdates) {
      if (unitUpdate.unitType !== UnitType.TradeShip) continue;

      if (!unitUpdate.isActive) {
        tradeShipCapturedState.trackedTradeShips.delete(unitUpdate.id);
        tradeShipCapturedState.notifiedCapturedShips.delete(unitUpdate.id);
        continue;
      }

      if (
        unitUpdate.lastOwnerID === mySmallID &&
        unitUpdate.ownerID !== mySmallID &&
        !tradeShipCapturedState.notifiedCapturedShips.has(unitUpdate.id)
      ) {
        tradeShipCapturedState.notifiedCapturedShips.add(unitUpdate.id);

        if (now - tradeShipCapturedState.lastSoundTime >= tradeShipCapturedState.soundCooldown) {
          if (isSoundEnabled("tradeShipCaptured")) {
            SOUNDS.tradeShipCaptured();
            tradeShipCapturedState.lastSoundTime = now;
          }
        }
      }

      if (unitUpdate.ownerID === mySmallID) {
        tradeShipCapturedState.trackedTradeShips.add(unitUpdate.id);
        tradeShipCapturedState.notifiedCapturedShips.delete(unitUpdate.id);
      } else {
        tradeShipCapturedState.trackedTradeShips.delete(unitUpdate.id);
      }
    }
  }

  const warshipCombatState = {
    notifiedWarships: new Set(),
    lastSoundTime: 0,
    soundCooldown: 1000,
  };

  function handleWarshipCombatNotifications(game, updates) {
    const myPlayer = game?.myPlayer?.();
    if (!myPlayer?.isAlive?.()) {
      warshipCombatState.notifiedWarships.clear();
      return;
    }

    const mySmallID = myPlayer.smallID?.();
    if (mySmallID === undefined) return;

    const now = Date.now();

    const unitUpdates = updates?.[GameUpdateType.Unit];
    if (!unitUpdates?.length) return;

    for (const unitUpdate of unitUpdates) {
      if (unitUpdate.unitType !== UnitType.Warship) continue;
      if (unitUpdate.ownerID !== mySmallID) continue;
      if (!unitUpdate.isActive) {
        warshipCombatState.notifiedWarships.delete(unitUpdate.id);
        continue;
      }

      // Only trigger for actual warship-vs-warship combat.
      // `targetUnitId` can point at any unit type; verify the target is an active Warship.
      const targetUnitId = unitUpdate.targetUnitId;
      let isTargetWarship = false;
      if (targetUnitId !== undefined) {
        try {
          const targetUnit = game?.unit?.(targetUnitId);
          const targetActive =
            (typeof targetUnit?.isActive === "function" ? targetUnit.isActive() : targetUnit?.data?.isActive) ?? true;
          const targetType =
            (typeof targetUnit?.type === "function" ? targetUnit.type() : targetUnit?.data?.unitType) ?? undefined;

          isTargetWarship = targetActive && targetType === UnitType.Warship;
        } catch (_) {
          isTargetWarship = false;
        }
      }

      const isInWarshipCombat = targetUnitId !== undefined && isTargetWarship;
      const wasNotified = warshipCombatState.notifiedWarships.has(unitUpdate.id);

      if (isInWarshipCombat && !wasNotified) {
        warshipCombatState.notifiedWarships.add(unitUpdate.id);

        if (now - warshipCombatState.lastSoundTime >= warshipCombatState.soundCooldown) {
          if (isSoundEnabled("warshipCombat")) {
            SOUNDS.warshipCombat();
            warshipCombatState.lastSoundTime = now;
          }
        }
      } else if (!isInWarshipCombat && wasNotified) {
        warshipCombatState.notifiedWarships.delete(unitUpdate.id);
      }
    }
  }

  function waitForElement(selector) {
    return new Promise((resolve) => {
      const el = document.querySelector(selector);
      if (el) {
        resolve(el);
        return;
      }

      const observer = new MutationObserver((_, obs) => {
        const found = document.querySelector(selector);
        if (found) {
          obs.disconnect();
          resolve(found);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  function waitForGame(controlPanel) {
    return new Promise((resolve) => {
      if (controlPanel.game) {
        resolve(controlPanel.game);
        return;
      }

      const check = setInterval(() => {
        if (controlPanel.game) {
          clearInterval(check);
          resolve(controlPanel.game);
        }
      }, 50);
    });
  }

  function hookGameUpdates(game) {
    const proto = Object.getPrototypeOf(game);
    if (!proto?.update || proto[HOOK_FLAG]) return;

    const originalUpdate = proto.update;
    proto.update = function (viewData, ...rest) {
      const result = originalUpdate.call(this, viewData, ...rest);
      try {
        const updates = viewData?.updates;
        handleIncomingThreats(this, updates);
        handleChatNotifications(this, updates);
        handleAllianceRequestNotifications(this, updates);
        handleTroopCapacityNotifications(this);
        handleAllianceExpiringNotifications(this);
        handleAllianceEndedNotifications(this, updates);
        handleBetrayalNotifications(this, updates);
        handleBoatArrivalNotifications(this, updates);
        handleAllyDisconnectedNotifications(this);
        handleTradeShipCapturedNotifications(this, updates);
        handleWarshipCombatNotifications(this, updates);
      } catch (_) {}
      return result;
    };

    Object.defineProperty(proto, HOOK_FLAG, { value: true, configurable: true });
  }

  function createPanel() {
    if (document.getElementById("ofio-audio-panel")) return;

    const panel = document.createElement("div");
    panel.id = "ofio-audio-panel";

    const generateSoundToggles = () => {
      const tooltipBySoundKey = {
        troopCapacityWarning:
          "Notifies when troop capacity reaches 64%. At this threshold, your troop income rate begins to decrease, making it an optimal time to expand territory or launch attacks.",
        troopCapacityCritical:
          "Notifies when troop capacity reaches 82%. At this threshold, your troop income rate is severely reduced, indicating you should expand territory or attack to avoid wasting potential troop growth.",
      };

      return SOUND_CATEGORIES.map(
        (category) => `
        <div class="ofio-audio-category">
          <div class="ofio-audio-category-title">${category.name}</div>
          ${category.sounds
            .map((sound) => {
              const tooltip = tooltipBySoundKey[sound.key];
              const tooltipAttr = tooltip ? ` title="${tooltip}"` : "";
              return `
            <div class="ofio-audio-sound-row">
              <label class="ofio-audio-toggle-label"${tooltipAttr}>
                <input type="checkbox" class="ofio-audio-sound-toggle" data-sound="${sound.key}" ${panelState.sounds[sound.key] ? "checked" : ""} />
                <span>${sound.label}</span>
              </label>
              <button type="button" class="ofio-audio-preview-btn" data-sound="${sound.key}" title="Preview">▶</button>
            </div>
          `;
            })
            .join("")}
        </div>
      `,
      ).join("");
    };

    panel.innerHTML = `
      <style>
        #ofio-audio-panel {
          position: fixed;
          top: 64px;
          right: 16px;
          background: rgba(31, 41, 55, 0.8);
          border-radius: 8px;
          padding: 8px 12px 8px 18px;
          z-index: 10000;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 13px;
          color: #e5e7eb;
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-sizing: border-box;
          min-width: 180px;
        }
        #ofio-audio-panel.ofio-dragging {
          user-select: none;
          cursor: grabbing;
        }
        #ofio-audio-panel.ofio-minimized {
          min-width: auto;
          padding: 8px 12px 8px 18px;
        }
        #ofio-audio-panel.ofio-minimized .ofio-audio-header,
        #ofio-audio-panel.ofio-minimized .ofio-audio-settings {
          display: none !important;
        }
        #ofio-audio-panel .ofio-audio-minimized-view {
          display: none;
        }
        #ofio-audio-panel.ofio-minimized .ofio-audio-minimized-view {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #ofio-audio-panel .ofio-audio-restore-btn {
          background: transparent;
          border: none;
          font-size: 13px;
          cursor: pointer;
          padding: 2px 4px;
          opacity: 0.9;
          transition: opacity 0.15s, transform 0.15s;
        }
        #ofio-audio-panel .ofio-audio-restore-btn:hover {
          opacity: 1;
          transform: scale(1.1);
        }
        #ofio-audio-panel .ofio-audio-restore-btn.is-muted {
          opacity: 0.5;
        }
        #ofio-audio-panel .ofio-drag-handle {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 12px;
          cursor: grab;
          border-right: 1px solid rgba(75, 85, 99, 0.6);
        }
        #ofio-audio-panel .ofio-drag-handle::after {
          content: "";
          position: absolute;
          left: 3px;
          top: 50%;
          width: 4px;
          height: 16px;
          transform: translateY(-50%);
          border-radius: 999px;
          background: rgba(229, 231, 235, 0.6);
          box-shadow: 0 -6px 0 rgba(229, 231, 235, 0.6), 0 6px 0 rgba(229, 231, 235, 0.6);
        }
        #ofio-audio-panel .ofio-audio-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        #ofio-audio-panel .ofio-audio-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
        }
        #ofio-audio-panel .ofio-audio-title input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }
        #ofio-audio-panel .ofio-audio-controls {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        #ofio-audio-panel .ofio-audio-btn {
          padding: 4px;
          border: 1px solid #4b5563;
          border-radius: 4px;
          background: #374151;
          color: #e5e7eb;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }
        #ofio-audio-panel .ofio-audio-btn:hover {
          background: #4b5563;
        }
        #ofio-audio-panel .ofio-audio-btn.is-active {
          border-color: #7dd3fc;
          box-shadow: 0 0 0 1px rgba(125, 211, 252, 0.6);
        }
        #ofio-audio-panel .ofio-audio-volume {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        #ofio-audio-panel .ofio-audio-volume input[type="range"] {
          flex: 1;
          accent-color: #7dd3fc;
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          background: transparent;
        }
        #ofio-audio-panel .ofio-audio-volume input[type="range"]::-webkit-slider-runnable-track {
          height: 4px;
          background: #4b5563;
          border-radius: 999px;
        }
        #ofio-audio-panel .ofio-audio-volume input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          margin-top: -5px;
          border-radius: 50%;
          background: #e5e7eb;
          border: 1px solid #9ca3af;
        }
        #ofio-audio-panel .ofio-audio-volume input[type="range"]::-moz-range-track {
          height: 4px;
          background: #4b5563;
          border-radius: 999px;
        }
        #ofio-audio-panel .ofio-audio-volume input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #e5e7eb;
          border: 1px solid #9ca3af;
        }
        #ofio-audio-panel .ofio-audio-volume-value {
          min-width: 36px;
          text-align: right;
          font-variant-numeric: tabular-nums;
          font-size: 12px;
        }
        #ofio-audio-panel .ofio-audio-settings {
          display: none;
          flex-direction: column;
          gap: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(75, 85, 99, 0.6);
          max-height: 300px;
          overflow-y: auto;
        }
        #ofio-audio-panel .ofio-audio-settings.is-open {
          display: flex;
        }
        #ofio-audio-panel .ofio-audio-category {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        #ofio-audio-panel .ofio-audio-category-title {
          font-size: 11px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        #ofio-audio-panel .ofio-audio-sound-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 2px 0;
        }
        #ofio-audio-panel .ofio-audio-toggle-label {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          flex: 1;
        }
        #ofio-audio-panel .ofio-audio-toggle-label input[type="checkbox"] {
          width: 14px;
          height: 14px;
          cursor: pointer;
        }
        #ofio-audio-panel .ofio-audio-toggle-label span {
          font-size: 12px;
        }
        #ofio-audio-panel .ofio-audio-preview-btn {
          padding: 2px 6px;
          border: 1px solid #4b5563;
          border-radius: 4px;
          background: #374151;
          color: #e5e7eb;
          font-size: 10px;
          cursor: pointer;
        }
        #ofio-audio-panel .ofio-audio-preview-btn:hover {
          background: #4b5563;
        }
      </style>
      <div class="ofio-drag-handle" title="Drag panel"></div>
      <div class="ofio-audio-minimized-view">
        <button type="button" class="ofio-audio-restore-btn" id="ofio-audio-restore" title="Expand Audio Panel">${panelState.enabled ? "🔊" : "🔇"}</button>
      </div>
      <div class="ofio-audio-header">
        <div class="ofio-audio-title">
          <input type="checkbox" id="ofio-audio-master-toggle" ${panelState.enabled ? "checked" : ""} title="Enable/Disable all sounds" />
          <span>🔊 Audio</span>
        </div>
        <div class="ofio-audio-controls">
          <button type="button" class="ofio-audio-btn" id="ofio-audio-minimize" title="Minimize">−</button>
          <button type="button" class="ofio-audio-btn" id="ofio-audio-settings-toggle" title="Settings">⚙</button>
        </div>
      </div>
      <div class="ofio-audio-settings" id="ofio-audio-settings">
        <div class="ofio-audio-volume">
          <span>🔉</span>
          <input type="range" id="ofio-audio-volume" min="0" max="100" value="${panelState.volume}" />
          <span class="ofio-audio-volume-value" id="ofio-audio-volume-value">${panelState.volume}%</span>
        </div>
        ${generateSoundToggles()}
      </div>
    `;

    const appendPanel = () => {
      document.body.appendChild(panel);
      restorePanelPosition(panel);
      attachDragHandlers(panel);
      attachPanelEventListeners(panel);

      if (panelState.minimized) {
        panel.classList.add("ofio-minimized");
      }

      if (panelState.settingsOpen) {
        document.getElementById("ofio-audio-settings")?.classList.add("is-open");
        document.getElementById("ofio-audio-settings-toggle")?.classList.add("is-active");
      }
    };

    if (document.body) {
      appendPanel();
    } else {
      document.addEventListener("DOMContentLoaded", appendPanel, { once: true });
    }
  }

  function restorePanelPosition(panel) {
    const saved = loadPanelPosition();
    if (!saved) return;
    const clamped = clampPanelPosition(panel, saved.x, saved.y);
    panel.style.left = `${clamped.x}px`;
    panel.style.top = `${clamped.y}px`;
    panel.style.right = "auto";
  }

  function attachDragHandlers(panel) {
    const handle = panel.querySelector(".ofio-drag-handle");
    if (!handle) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const onMouseMove = (event) => {
      if (!isDragging) return;
      const nextX = event.clientX - offsetX;
      const nextY = event.clientY - offsetY;
      const clamped = clampPanelPosition(panel, nextX, nextY);
      panel.style.left = `${clamped.x}px`;
      panel.style.top = `${clamped.y}px`;
      panel.style.right = "auto";
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      panel.classList.remove("ofio-dragging");
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      const rect = panel.getBoundingClientRect();
      savePanelPosition(rect.left, rect.top);
    };

    handle.addEventListener("mousedown", (event) => {
      if (event.button !== 0) return;
      const rect = panel.getBoundingClientRect();
      offsetX = event.clientX - rect.left;
      offsetY = event.clientY - rect.top;
      panel.style.left = `${rect.left}px`;
      panel.style.top = `${rect.top}px`;
      panel.style.right = "auto";
      isDragging = true;
      panel.classList.add("ofio-dragging");
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      event.preventDefault();
    });

    window.addEventListener("resize", () => {
      const rect = panel.getBoundingClientRect();
      const clamped = clampPanelPosition(panel, rect.left, rect.top);
      panel.style.left = `${clamped.x}px`;
      panel.style.top = `${clamped.y}px`;
      panel.style.right = "auto";
    });
  }

  function attachPanelEventListeners(panel) {
    const masterToggle = document.getElementById("ofio-audio-master-toggle");
    const volumeSlider = document.getElementById("ofio-audio-volume");
    const volumeValue = document.getElementById("ofio-audio-volume-value");
    const minimizeBtn = document.getElementById("ofio-audio-minimize");
    const settingsToggle = document.getElementById("ofio-audio-settings-toggle");
    const settingsSection = document.getElementById("ofio-audio-settings");

    const restoreBtn = document.getElementById("ofio-audio-restore");

    masterToggle?.addEventListener("change", (e) => {
      panelState.enabled = e.target.checked;
      if (restoreBtn) {
        restoreBtn.textContent = panelState.enabled ? "🔊" : "🔇";
        restoreBtn.classList.toggle("is-muted", !panelState.enabled);
      }
      saveSettings();
    });

    restoreBtn?.addEventListener("click", () => {
      panelState.minimized = false;
      panel.classList.remove("ofio-minimized");
      saveSettings();
    });

    volumeSlider?.addEventListener("input", (e) => {
      panelState.volume = parseInt(e.target.value, 10);
      if (volumeValue) volumeValue.textContent = `${panelState.volume}%`;
      saveSettings();
    });

    minimizeBtn?.addEventListener("click", () => {
      panelState.minimized = !panelState.minimized;
      panel.classList.toggle("ofio-minimized", panelState.minimized);
      saveSettings();
    });

    settingsToggle?.addEventListener("click", () => {
      panelState.settingsOpen = !panelState.settingsOpen;
      settingsSection?.classList.toggle("is-open", panelState.settingsOpen);
      settingsToggle.classList.toggle("is-active", panelState.settingsOpen);
      saveSettings();
    });

    panel.querySelectorAll(".ofio-audio-sound-toggle").forEach((toggle) => {
      toggle.addEventListener("change", (e) => {
        const soundKey = e.target.dataset.sound;
        if (soundKey && panelState.sounds.hasOwnProperty(soundKey)) {
          panelState.sounds[soundKey] = e.target.checked;
          saveSettings();
        }
      });
    });

    panel.querySelectorAll(".ofio-audio-preview-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const soundKey = e.target.dataset.sound;
        if (soundKey && SOUNDS[soundKey]) {
          SOUNDS[soundKey]();
        }
      });
    });
  }

  async function init() {
    try {
      loadSettings();
      registerMenuCommand();
      const controlPanel = await waitForElement("control-panel");
      const game = await waitForGame(controlPanel);
      hookGameUpdates(game);
      createPanel();
      applyPanelVisibility();
    } catch (_) {}
  }

  init();
})();
