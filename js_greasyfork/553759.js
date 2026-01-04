// ==UserScript==
// @name         Bilibili Playback Sync (stable anti-oscillation)
// @namespace    https://github.com/yqylh/SyncBilibiliVedio
// @version      0.2.0
// @description  Synchronize Bilibili video playback between friends via a shared WebSocket server. Includes anti-oscillation tweaks.
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553759/Bilibili%20Playback%20Sync%20%28stable%20anti-oscillation%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553759/Bilibili%20Playback%20Sync%20%28stable%20anti-oscillation%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.__biliPlaybackSyncLoaded) return;
  window.__biliPlaybackSyncLoaded = true;

  const CONFIG_KEY = 'bili-sync-config';
  const ID_KEY = 'bili-sync-client-id';

  // 调整：降低心跳频率并延长抑制期，先“稳住”
  const HEARTBEAT_MS = 4000;
  const SUPPRESS_MS = 900;

  // 纠偏策略参数：更大的死区 + 冷却窗 + 心跳默认只“向前追”
  const RESYNC = {
    playPause: 0.70,    // play/pause 偏差超过 0.70s 才 seek
    seek:      0.40,    // 对用户主动拖动更敏感一些
    heartbeat: 0.90,    // 心跳追随更克制
    cooldownMs: 1500,   // 每次纠偏后，至少 1.5s 内不再纠偏
    rewindOnHeartbeat: true, // 心跳只“向前追”（不回退），防止来回拉扯
    maxLatencyMs: 300,  // 没有 serverTime 时，延迟补偿最多只加 300ms
  };

  const state = {
    config: loadConfig(),
    clientId: ensureClientId(),
    ws: null,
    player: null,
    video: null,
    suppressCount: 0,
    heartbeatTimer: null,
    lastSeekSentAt: 0,
    lastHeartbeatSentAt: 0,
    lastCorrectionAt: 0, // 最近一次真正 seek 的时间
    ui: {},
    pendingMessages: [],
  };

  const videoHandlers = {
    play: () => handleVideoEvent('play'),
    pause: () => handleVideoEvent('pause'),
    seeked: () => handleVideoEvent('seek'),
    ratechange: () => handleVideoEvent('ratechange'),
    timeupdate: () => handleVideoEvent('timeupdate'),
  };

  init();

  function init() {
    injectStyles();
    buildUI();
    setupMutationObserver();
    attachVideo(findVideo());
    locatePlayer();
  }

  function loadConfig() {
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      if (!raw) return { server: '', room: '', nickname: '' };
      const parsed = JSON.parse(raw);
      return {
        server: String(parsed.server || ''),
        room: String(parsed.room || ''),
        nickname: String(parsed.nickname || ''),
      };
    } catch (err) {
      console.warn('bili-sync: failed to load config', err);
      return { server: '', room: '', nickname: '' };
    }
  }

  function ensureClientId() {
    let id = localStorage.getItem(ID_KEY);
    if (!id) {
      id = `client-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
      localStorage.setItem(ID_KEY, id);
    }
    return id;
  }

  function saveConfig(nextConfig) {
    state.config = nextConfig;
    localStorage.setItem(CONFIG_KEY, JSON.stringify(nextConfig));
  }

  function injectStyles() {
    if (document.getElementById('bili-sync-style')) return;
    const style = document.createElement('style');
    style.id = 'bili-sync-style';
    style.textContent = `
      #bili-sync-panel {
        position: fixed;
        top: 100px;
        right: 24px;
        width: 240px;
        padding: 12px;
        z-index: 99999;
        background: rgba(17, 28, 35, 0.92);
        color: #f1f1f1;
        font-size: 12px;
        line-height: 1.4;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(6px);
        font-family: "Helvetica Neue", Arial, sans-serif;
      }
      #bili-sync-panel * { box-sizing: border-box; }
      #bili-sync-panel h1 {
        margin: 0 0 8px 0;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      #bili-sync-panel label { display: block; margin-bottom: 8px; }
      #bili-sync-panel input {
        width: 100%;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 4px;
        padding: 4px 6px;
        font-size: 12px;
        background: rgba(255, 255, 255, 0.08);
        color: #f5f5f5;
      }
      #bili-sync-panel button {
        width: 48%;
        border: none;
        border-radius: 4px;
        padding: 6px 0;
        font-size: 12px;
        cursor: pointer;
        background: rgba(0, 153, 255, 0.9);
        color: #fff;
      }
      #bili-sync-panel button:disabled { cursor: default; opacity: 0.5; }
      #bili-sync-status { font-size: 11px; color: #9feaf9; }
      #bili-sync-log {
        margin-top: 10px;
        max-height: 80px;
        overflow-y: auto;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        padding: 4px 6px;
      }
      #bili-sync-log p { margin: 0; font-size: 11px; }
      #bili-sync-clients { margin-top: 6px; font-size: 11px; }
    `;
    document.head.appendChild(style);
  }

  function buildUI() {
    if (document.getElementById('bili-sync-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'bili-sync-panel';
    panel.innerHTML = `
      <h1>Bili Sync <span id="bili-sync-status">Idle</span></h1>
      <label>
        Server URL
        <input id="bili-sync-server" type="text" placeholder="ws://localhost:3000" />
      </label>
      <label>
        Room ID
        <input id="bili-sync-room" type="text" placeholder="shared-room" />
      </label>
      <label>
        Nickname
        <input id="bili-sync-nickname" type="text" placeholder="your name" />
      </label>
      <div style="display:flex;justify-content:space-between;gap:4px;">
        <button id="bili-sync-connect">Connect</button>
        <button id="bili-sync-disconnect" disabled>Disconnect</button>
      </div>
      <div id="bili-sync-clients"></div>
      <div id="bili-sync-log"></div>
    `;
    document.body.appendChild(panel);

    state.ui.panel = panel;
    state.ui.status = panel.querySelector('#bili-sync-status');
    state.ui.server = panel.querySelector('#bili-sync-server');
    state.ui.room = panel.querySelector('#bili-sync-room');
    state.ui.nickname = panel.querySelector('#bili-sync-nickname');
    state.ui.connect = panel.querySelector('#bili-sync-connect');
    state.ui.disconnect = panel.querySelector('#bili-sync-disconnect');
    state.ui.clients = panel.querySelector('#bili-sync-clients');
    state.ui.log = panel.querySelector('#bili-sync-log');

    state.ui.server.value = state.config.server;
    state.ui.room.value = state.config.room;
    state.ui.nickname.value = state.config.nickname;

    state.ui.connect.addEventListener('click', () => {
      const nextConfig = {
        server: state.ui.server.value.trim(),
        room: state.ui.room.value.trim(),
        nickname: state.ui.nickname.value.trim(),
      };
      saveConfig(nextConfig);
      connect();
    });

    state.ui.disconnect.addEventListener('click', () => {
      disconnect();
    });
  }

  function setStatus(text) {
    if (state.ui.status) state.ui.status.textContent = text;
  }

  function appendLog(text) {
    if (!state.ui.log) return;
    const entry = document.createElement('p');
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
    state.ui.log.appendChild(entry);
    state.ui.log.scrollTop = state.ui.log.scrollHeight;
  }

  function updateClients(list) {
    if (!state.ui.clients) return;
    if (!Array.isArray(list) || !list.length) {
      state.ui.clients.textContent = 'Participants: (none)';
      return;
    }
    const names = list.map((item) => {
      if (item.clientId === state.clientId) {
        return `${item.nickname || 'anonymous'} (you)`;
      }
      return item.nickname || 'anonymous';
    });
    state.ui.clients.textContent = `Participants: ${names.join(', ')}`;
  }

  function connect() {
    if (state.ws && state.ws.readyState === WebSocket.OPEN) return;
    if (!state.config.server || !state.config.room) {
      appendLog('Set server and room first.');
      return;
    }

    let url = state.config.server;
    if (!/^wss?:\/\//i.test(url)) {
      url = `ws://${url}`;
    }

    try {
      state.ws = new WebSocket(url);
    } catch (err) {
      appendLog(`Failed to open WebSocket: ${err.message}`);
      return;
    }

    setStatus('Connecting…');
    state.ui.connect.disabled = true;
    state.ui.disconnect.disabled = false;

    state.ws.addEventListener('open', handleSocketOpen);
    state.ws.addEventListener('message', handleSocketMessage);
    state.ws.addEventListener('close', handleSocketClose);
    state.ws.addEventListener('error', () => {
      appendLog('Socket error.');
      setStatus('Error');
    });
  }

  function disconnect() {
    if (state.ws) {
      try {
        state.ws.close();
      } catch (err) {
        appendLog(`Error closing socket: ${err.message}`);
      }
    }
    state.ws = null;
    disableHeartbeat();
    state.ui.connect.disabled = false;
    state.ui.disconnect.disabled = true;
    setStatus('Idle');
    updateClients([]);
  }

  function handleSocketOpen() {
    appendLog('Connected. Joining room…');
    setStatus('Authorizing…');
    sendRaw({
      type: 'join',
      room: state.config.room,
      clientId: state.clientId,
      nickname: state.config.nickname,
    });
  }

  function handleSocketMessage(event) {
    let message;
    try {
      message = JSON.parse(event.data);
    } catch (err) {
      appendLog('Received invalid JSON.');
      return;
    }

    switch (message.type) {
      case 'ack':
        setStatus('Connected');
        updateClients(message.clients || []);
        appendLog(`Joined room ${message.room}.`);
        sendEvent('heartbeat');
        break;
      case 'presence':
        updateClients(message.clients || []);
        if (message.action === 'join') {
          appendLog(`${message.nickname || 'anonymous'} joined.`);
        } else if (message.action === 'leave') {
          appendLog(`${message.nickname || 'anonymous'} left.`);
        }
        break;
      case 'event':
      case 'heartbeat':
        if (message.clientId === state.clientId) return;
        if (state.video) {
          applyRemoteAction(message);
        } else {
          state.pendingMessages.push(message);
        }
        break;
      case 'error':
        appendLog(`Server error: ${message.error?.message || 'unknown'}`);
        break;
      case 'pong':
        break;
      default:
        appendLog(`Unhandled message: ${message.type}`);
    }
  }

  function handleSocketClose() {
    appendLog('Disconnected.');
    disconnect();
  }

  function isConnected() {
    return state.ws && state.ws.readyState === WebSocket.OPEN;
  }

  function sendRaw(payload) {
    if (!isConnected()) return;
    try {
      state.ws.send(JSON.stringify(payload));
    } catch (err) {
      appendLog(`Failed to send: ${err.message}`);
    }
  }

  function sendEvent(action) {
    if (!isConnected() || !state.video) return;
    const now = Date.now();
    if (action === 'seek' && now - state.lastSeekSentAt < 100) return;
    if (action === 'heartbeat' && now - state.lastHeartbeatSentAt < HEARTBEAT_MS / 2) return;

    const payload = {
      type: action === 'heartbeat' ? 'heartbeat' : 'event',
      action,
      state: collectState(),
      sentAt: now,
    };

    if (action === 'seek') state.lastSeekSentAt = now;
    if (action === 'heartbeat') state.lastHeartbeatSentAt = now;

    sendRaw(payload);
  }

  function collectState() {
    const video = state.video;
    if (!video) {
      return {
        videoId: getVideoId(),
        url: location.href,
        currentTime: 0,
        paused: true,
        playbackRate: 1,
        duration: 0,
        title: document.title,
      };
    }
    return {
      videoId: getVideoId(),
      url: location.href,
      currentTime: Number(video.currentTime || 0),
      paused: video.paused,
      playbackRate: Number(video.playbackRate || 1),
      duration: Number(video.duration || 0),
      title: document.title,
    };
  }

  function getVideoId() {
    const path = location.pathname;
    const videoMatch = path.match(/\/video\/([^/]+)/);
    if (videoMatch) return videoMatch[1];
    const bangumiMatch = path.match(/\/bangumi\/play\/([^/]+)/);
    if (bangumiMatch) return bangumiMatch[1];
    return path;
  }

  function handleVideoEvent(action) {
    if (!isConnected()) return;
    if (!state.video) return;
    if (state.suppressCount > 0) {
      if (action === 'play') enableHeartbeat();
      if (action === 'pause') disableHeartbeat();
      return;
    }

    switch (action) {
      case 'play':
        enableHeartbeat();
        sendEvent('play');
        break;
      case 'pause':
        disableHeartbeat();
        sendEvent('pause');
        break;
      case 'seek':
        sendEvent('seek');
        break;
      case 'ratechange':
        sendEvent('ratechange');
        break;
      case 'timeupdate':
        if (!state.video.paused) {
          sendEvent('heartbeat');
        }
        break;
      default:
        break;
    }
  }

  function withSuppression(fn) {
    state.suppressCount += 1;
    try {
      fn();
    } finally {
      setTimeout(() => {
        state.suppressCount = Math.max(0, state.suppressCount - 1);
      }, SUPPRESS_MS);
    }
  }

  // 只在冷却窗外，且超出对应阈值时才允许纠偏
  function shouldResync(kind, diff) {
    const now = Date.now();
    if (now - state.lastCorrectionAt < RESYNC.cooldownMs) return false;
    const limit = RESYNC[kind] ?? RESYNC.heartbeat;
    if (diff <= limit) return false;
    state.lastCorrectionAt = now;
    return true;
  }

  // 延迟补偿：优先使用 serverTime；否则 sentAt 仅限幅补偿，避免时钟差导致过度估计
  function resolveTargetTime(remoteState, message) {
    let target = Number(remoteState.currentTime || 0);
    const serverTime = Number(message.serverTime || 0);
    const sentAt = Number(message.sentAt || 0);
    let latency = 0;
    if (serverTime > 0) {
      latency = Math.max(0, Date.now() - serverTime);
    } else if (sentAt > 0) {
      latency = Math.max(0, Math.min(Date.now() - sentAt, RESYNC.maxLatencyMs));
    }
    target += latency / 1000;
    return Number.isFinite(target) ? Math.max(0, target) : 0;
  }

  function applyRemoteAction(message) {
    const remoteState = message.state || {};
    if (!remoteState.videoId || remoteState.videoId === getVideoId()) {
      const targetTime = resolveTargetTime(remoteState, message);
      const video = state.video;
      if (!video) return;
      const current = Number(video.currentTime || 0);
      const diff = Math.abs(current - targetTime);

      withSuppression(() => {
        if (remoteState.playbackRate && Math.abs(video.playbackRate - remoteState.playbackRate) > 0.001) {
          setPlaybackRate(remoteState.playbackRate);
        }
        switch (message.action) {
          case 'play': {
            if (shouldResync('playPause', diff)) seekTo(targetTime);
            playVideo();
            enableHeartbeat();
            break;
          }
          case 'pause': {
            if (shouldResync('playPause', diff)) seekTo(remoteState.currentTime ?? targetTime);
            pauseVideo();
            disableHeartbeat();
            break;
          }
          case 'seek': {
            if (shouldResync('seek', diff)) seekTo(targetTime);
            break;
          }
          case 'ratechange': {
            setPlaybackRate(remoteState.playbackRate || 1);
            break;
          }
          case 'heartbeat': {
            if (!remoteState.paused) {
              if (RESYNC.rewindOnHeartbeat) {
                if (shouldResync('heartbeat', diff)) seekTo(targetTime);
              } else {
                // 只“向前追”，不回退，避免来回拉扯
                const ahead = targetTime - current; // 远端比本地“领先”的秒数
                if (ahead > 0 && shouldResync('heartbeat', ahead)) seekTo(targetTime);
              }
              enableHeartbeat();
              playVideo().catch(() => {});
            } else if (!video.paused) {
              pauseVideo();
            }
            break;
          }
          default:
            break;
        }
      });
    }
  }

  function playVideo() {
    if (state.player && typeof state.player.play === 'function') {
      try {
        const result = state.player.play();
        if (result && typeof result.catch === 'function') {
          result.catch(() => {});
        }
      } catch (err) {
        console.warn('bili-sync: player.play failed', err);
      }
    }
    if (state.video) {
      const result = state.video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(() => {});
      }
    }
    return Promise.resolve();
  }

  function pauseVideo() {
    if (state.player && typeof state.player.pause === 'function') {
      try {
        state.player.pause();
      } catch (err) {
        console.warn('bili-sync: player.pause failed', err);
      }
    }
    if (state.video && !state.video.paused) {
      try {
        state.video.pause();
      } catch (err) {
        console.warn('bili-sync: video.pause failed', err);
      }
    }
  }

  function seekTo(time) {
    if (!Number.isFinite(time)) return;
    if (state.player && typeof state.player.seek === 'function') {
      try {
        state.player.seek(time);
        return;
      } catch (err) {
        console.warn('bili-sync: player.seek failed', err);
      }
    }
    if (state.video) {
      try {
        state.video.currentTime = time;
      } catch (err) {
        console.warn('bili-sync: video.currentTime assignment failed', err);
      }
    }
  }

  function setPlaybackRate(rate) {
    if (!Number.isFinite(rate) || rate <= 0) return;
    if (state.video) {
      state.video.playbackRate = rate;
    }
  }

  function enableHeartbeat() {
    if (state.heartbeatTimer) return;
    state.heartbeatTimer = setInterval(() => {
      if (!isConnected()) return;
      if (!state.video || state.video.paused) return;
      sendEvent('heartbeat');
    }, HEARTBEAT_MS);
  }

  function disableHeartbeat() {
    if (state.heartbeatTimer) {
      clearInterval(state.heartbeatTimer);
      state.heartbeatTimer = null;
    }
  }

  function findVideo() {
    const videos = document.querySelectorAll('video');
    if (!videos.length) return null;
    for (const el of videos) {
      if (!el.parentElement) continue;
      return el;
    }
    return null;
  }

  function attachVideo(video) {
    if (!video || video === state.video) return;
    detachVideo();
    state.video = video;
    for (const [eventName, handler] of Object.entries(videoHandlers)) {
      video.addEventListener(eventName, handler, true);
    }
    appendLog('Video ready.');
    flushPendingMessages();
  }

  function detachVideo() {
    if (!state.video) return;
    for (const [eventName, handler] of Object.entries(videoHandlers)) {
      state.video.removeEventListener(eventName, handler, true);
    }
    state.video = null;
  }

  function flushPendingMessages() {
    if (!state.video || !state.pendingMessages.length) return;
    const queue = state.pendingMessages.splice(0);
    queue.forEach((msg) => applyRemoteAction(msg));
  }

  function setupMutationObserver() {
    const observer = new MutationObserver(() => {
      const candidate = findVideo();
      if (candidate && candidate !== state.video) {
        attachVideo(candidate);
      }
    });
    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
    });
  }

  function locatePlayer() {
    if (state.player && typeof state.player.play === 'function') return;
    const timer = setInterval(() => {
      if (window.player && typeof window.player.play === 'function') {
        state.player = window.player;
        clearInterval(timer);
        appendLog('Player API detected.');
      }
    }, 500);
  }
})();
