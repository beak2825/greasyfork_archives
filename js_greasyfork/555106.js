// ==UserScript==
// @name         Autodraw Script
// @namespace    http://tampermonkey.net/
// @version      2025.12.18.1
// @description  Big Update
// @author       Toluwerr
// @license      MIT
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555106/Autodraw%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/555106/Autodraw%20Script.meta.js
// ==/UserScript==

(async () => {
  const previous = window.__drawariaOmniDraw;
  if (previous && typeof previous.destroy === 'function') {
    try {
      previous.destroy();
    } catch (err) {
      console.warn('Previous Drawaria automation teardown error', err);
    }
  }

  const state = {
    canvas: null,
    root: null,
    panel: null,
    style: null,
    drag: null,
    tabs: new Map(),
    activeTab: 'image',
    preview: {
      canvas: null,
      ctx: null,
      playing: false,
      raf: null,
      drawnSegments: 0,
    },
    config: {
      resolution: 650,
      strokeDensity: 1,
      scanMode: 'smart',
      serpentine: true,
      lighten: 0,
      colorTolerance: 18,
      maxColors: 200,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      align: 'center',
      strokeDelay: 3,
      colorDelay: 110,
      pointerStep: 6,
      previewDuration: 8,
    },
    image: null,
    commands: null,
    progress: { segments: 0, total: 0 },
    drawing: false,
    abort: false,
    palettePointerId: Math.floor(Math.random() * 1e6) + 1,
    palette: [],
    colorCache: new Map(),
    initialColorHex: null,
    currentSwatch: null,
    fleet: [],
    ui: {
      progressText: null,
      progressBar: null,
      startBtn: null,
      stopBtn: null,
      previewSlider: null,
      previewPlay: null,
      previewPause: null,
      previewReset: null,
      connectionStatus: null,
      botStatus: null,
      fleetList: null,
    },
    rebuildTimer: null,
    keyHandler: null,
    network: null,
    bot: null,
    seaUi: {
      motion: 1,
      glow: 0.55,
      glass: 0.75,
      wave: 0.55,
    },
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const globalNetwork = (window.__drawariaOmniNetwork = window.__drawariaOmniNetwork || {
    sockets: new Set(),
    meta: new Map(),
  });
  state.network = globalNetwork;

  function setupSocketTracking() {
    if (window.__drawariaOmniSocketPatched) {
      return;
    }
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function patchedSend(...args) {
      trackSocket(this);
      return originalSend.apply(this, args);
    };
    window.__drawariaOmniSocketPatched = true;
    if (!window.__drawariaOmniOriginalWSSend) {
      window.__drawariaOmniOriginalWSSend = originalSend;
    }
  }

  function trackSocket(ws) {
    if (!ws || typeof ws.addEventListener !== 'function') {
      return;
    }
    try {
      if (!ws.url || !/drawaria\.online/.test(ws.url)) {
        return;
      }
    } catch (err) {
      return;
    }
    if (globalNetwork.meta.has(ws)) {
      return;
    }

    const info = { roomId: null, players: 0 };
    globalNetwork.sockets.add(ws);
    globalNetwork.meta.set(ws, info);

    const handleMessage = (event) => {
      if (!event || typeof event.data !== 'string') {
        return;
      }
      const message = event.data;
      try {
        if (message.startsWith('42')) {
          const payload = JSON.parse(message.slice(2));
          const tag = payload?.[0];
          if (tag === 'bc_uc_freedrawsession_changedroom') {
            info.players = Array.isArray(payload?.[3]) ? payload[3].length : info.players;
            info.roomId = payload?.[4] || info.roomId;
          } else if (tag === 'mc_roomplayerschange') {
            info.players = Array.isArray(payload?.[3]) ? payload[3].length : info.players;
          }
        } else if (message.startsWith('430')) {
          const configs = JSON.parse(message.slice(3))[0];
          if (configs) {
            info.roomId = configs.roomid ?? info.roomId;
            info.players = Array.isArray(configs.players) ? configs.players.length : info.players;
          }
        }
      } catch (err) {
        console.debug('OmniDraw socket parse issue', err);
      }
      updateConnectionStatus();
    };

    const handleOpen = () => {
      updateConnectionStatus();
    };

    const handleClose = () => {
      ws.removeEventListener('message', handleMessage);
      ws.removeEventListener('close', handleClose);
      ws.removeEventListener('open', handleOpen);
      globalNetwork.meta.delete(ws);
      globalNetwork.sockets.delete(ws);
      updateConnectionStatus();
    };

    ws.addEventListener('message', handleMessage);
    ws.addEventListener('close', handleClose);
    ws.addEventListener('open', handleOpen);
    if (ws.readyState === WebSocket.OPEN) {
      updateConnectionStatus();
    }
  }

  function getActiveSocket() {
    const botSocket = state.bot?.player?.conn?.socket;
    if (botSocket && (botSocket.readyState === WebSocket.OPEN || botSocket.readyState === WebSocket.CONNECTING)) {
      return botSocket;
    }
    for (const ws of globalNetwork.sockets) {
      if (ws.readyState === WebSocket.OPEN) {
        return ws;
      }
    }
    for (const ws of globalNetwork.sockets) {
      if (ws.readyState === WebSocket.CONNECTING) {
        return ws;
      }
    }
    return null;
  }

  async function waitForSocketReady(socket, timeout = 4000) {
    if (!socket) return false;
    if (socket.readyState === WebSocket.OPEN) {
      return true;
    }
    if (socket.readyState !== WebSocket.CONNECTING) {
      return false;
    }
    const waitPromise = new Promise((resolve) => {
      const handle = () => {
        socket.removeEventListener('open', handle);
        resolve(true);
      };
      socket.addEventListener('open', handle, { once: true });
    });
    const timeoutPromise = delay(timeout).then(() => false);
    const result = await Promise.race([waitPromise, timeoutPromise]);
    return result && socket.readyState === WebSocket.OPEN;
  }

  function getSocketInfo(socket) {
    if (!socket) return null;
    return globalNetwork.meta.get(socket) || null;
  }

  function sendDrawCommand(socket, stroke, color, thickness) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      throw new Error('Socket not ready');
    }
    const startX = stroke.start.x.toFixed(4);
    const startY = stroke.start.y.toFixed(4);
    const endX = stroke.end.x.toFixed(4);
    const endY = stroke.end.y.toFixed(4);
    const weight = -Math.max(0.1, thickness);
    const safeColor = color || '#000000';
    const payloadBase = `42["drawcmd",0,[${startX},${startY},${endX},${endY},`;
    const suffix = `,"${safeColor}",0,0,{"2":0,"3":0.5,"4":0.5}]]`;
    socket.send(`${payloadBase}true,${weight}${suffix}`);
    socket.send(`${payloadBase}false,${weight}${suffix}`);
  }

  function normalizeSegmentForBoard(segment, placement, rect) {
    const toPoint = (x, y) => {
      const canvasX = placement.originX + (x + 0.5) * placement.scale;
      const canvasY = placement.originY + (y + 0.5) * placement.scale;
      const normX = clamp((canvasX - rect.left) / rect.width, 0, 1);
      const normY = clamp((canvasY - rect.top) / rect.height, 0, 1);
      if (!Number.isFinite(normX) || !Number.isFinite(normY)) {
        return null;
      }
      return { x: normX, y: normY };
    };
    const start = toPoint(segment.x1, segment.y1);
    const end = toPoint(segment.x2, segment.y2);
    if (!start || !end) {
      return null;
    }
    let adjustedStart = start;
    let adjustedEnd = end;
    if (Math.abs(start.x - end.x) < 1e-6 && Math.abs(start.y - end.y) < 1e-6) {
      const epsilon = 1 / Math.max(1024, rect.width + rect.height);
      adjustedEnd = {
        x: clamp(start.x + epsilon, 0, 1),
        y: clamp(start.y + epsilon, 0, 1),
      };
    }
    return { start: adjustedStart, end: adjustedEnd };
  }

  function updateConnectionStatus() {
    const indicator = state.ui.connectionStatus;
    if (!indicator) return;
    const bot = state.bot;
    const socket = getActiveSocket();
    const info = getSocketInfo(socket);
    if (bot && socket && socket.readyState === WebSocket.OPEN && bot.status === 'connected') {
      const roomLabel = bot.room?.id ? `room ${String(bot.room.id).slice(0, 6)}…` : (info?.roomId ? `room ${String(info.roomId).slice(0, 6)}…` : 'active room');
      indicator.innerHTML = `<span class="seas-dot online"></span>Bot linked to ${roomLabel}`;
    } else if (bot && bot.status === 'connecting') {
      indicator.innerHTML = '<span class="seas-dot pending"></span>Bot connecting…';
    } else if (bot && bot.status === 'error') {
      indicator.innerHTML = `<span class="seas-dot offline"></span>${bot.lastError || 'Bot error. See Bot tab.'}`;
    } else if (socket && socket.readyState === WebSocket.CONNECTING) {
      indicator.innerHTML = '<span class="seas-dot pending"></span>Connecting to room…';
    } else if (socket && socket.readyState === WebSocket.OPEN) {
      const roomLabel = info?.roomId ? `room ${String(info.roomId).slice(0, 6)}…` : 'active room';
      indicator.innerHTML = `<span class="seas-dot online"></span>Linked to ${roomLabel}`;
    } else {
      indicator.innerHTML = '<span class="seas-dot offline"></span>Join a game room with the bot tab.';
    }
    updateBotDisplay();
    updateActionButtons();
  }

  function updateBotDisplay() {
    const statusEl = state.ui.botStatus;
    if (!statusEl) return;
    const bot = state.bot;
    if (!bot) {
      statusEl.innerHTML = '<div><strong>Status:</strong> Not initialised.</div>';
      return;
    }
    const players = Array.isArray(bot.room?.players) ? bot.room.players.length : (bot.room?.players || 0);
    const roomId = bot.room?.id ? String(bot.room.id) : '—';
    let summary = '';
    switch (bot.status) {
      case 'connected':
        summary = `<div><strong>Status:</strong> Connected</div><div><strong>Room:</strong> ${roomId}</div><div><strong>Players seen:</strong> ${players}</div>`;
        break;
      case 'connecting':
        summary = `<div><strong>Status:</strong> Connecting…</div><div><strong>Invite:</strong> ${bot.invite || 'public lobby'}</div>`;
        break;
      case 'error':
        summary = `<div><strong>Status:</strong> Error</div><div><strong>Details:</strong> ${bot.lastError || 'Unknown error'}</div>`;
        break;
      default:
        summary = `<div><strong>Status:</strong> Idle</div><div><strong>Invite:</strong> ${bot.invite || 'public lobby'}</div>`;
        break;
    }
    statusEl.innerHTML = summary;
  }

  function updateFleetDisplay() {
    const list = state.ui.fleetList;
    if (!list) return;
    if (!state.fleet.length) {
      list.innerHTML = '<div class="seas-note">No scout bots are active. Add invites below to launch them.</div>';
      return;
    }
    list.innerHTML = '';
    state.fleet.forEach((scout, index) => {
      const item = document.createElement('div');
      item.className = 'seas-fleet-item';
      const title = document.createElement('strong');
      title.textContent = `${scout.name} • ${scout.status}`;
      const roomLine = document.createElement('div');
      const roomId = scout.room?.id ? String(scout.room.id) : (scout.invite ? scout.invite : 'public lobby');
      roomLine.textContent = `Room: ${roomId}`;
      const playersLine = document.createElement('div');
      const players = Array.isArray(scout.room?.players) ? scout.room.players.length : (scout.room?.players || 0);
      playersLine.textContent = `Players seen: ${players}`;
      const statusLine = document.createElement('div');
      statusLine.textContent = scout.lastError ? `Last message: ${scout.lastError}` : '';
      const actions = document.createElement('div');
      actions.className = 'seas-fleet-actions';
      const reconnectBtn = document.createElement('button');
      reconnectBtn.type = 'button';
      reconnectBtn.textContent = 'Reconnect';
      reconnectBtn.className = 'seas-pill';
      reconnectBtn.addEventListener('click', () => {
        scout.room.join(scout.invite || '', { allowRandom: true });
      });
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = 'Remove';
      removeBtn.className = 'seas-pill';
      removeBtn.addEventListener('click', () => {
        removeScoutBot(scout);
      });
      actions.append(reconnectBtn, removeBtn);
      item.append(title, roomLine, playersLine);
      if (statusLine.textContent) {
        item.append(statusLine);
      }
      item.append(actions);
      list.appendChild(item);
    });
  }

  function createScoutBot(invite, name) {
    const label = name || `Scout ${state.fleet.length + 1}`;
    const scout = createBotLogic({
      name: label,
      invite: invite || '',
      primary: false,
      allowRandom: true,
      onStatusChange: () => updateFleetDisplay(),
    });
    scout.isScout = true;
    scout.invite = invite || '';
    state.fleet.push(scout);
    updateFleetDisplay();
    scout.room.join(scout.invite, { allowRandom: true });
    return scout;
  }

  function removeScoutBot(scout) {
    const idx = state.fleet.indexOf(scout);
    if (idx >= 0) {
      try {
        scout.room.leave();
      } catch (err) {
        console.debug('Scout bot leave error', err);
      }
      state.fleet.splice(idx, 1);
      updateFleetDisplay();
    }
  }

  function clearScoutBots() {
    state.fleet.slice().forEach((scout) => removeScoutBot(scout));
  }

  setupSocketTracking();

  state.bot = createBotLogic();

  function createBotLogic(options = {}) {
    const settings = {
      name: 'OmniDraw Bot',
      invite: '',
      primary: true,
      allowRandom: false,
      onStatusChange: null,
      ...options,
    };

    const bot = {
      name: settings.name || 'OmniDraw Bot',
      invite: settings.invite || '',
      status: 'idle',
      lastError: null,
      player: null,
      room: null,
      actions: null,
      primary: Boolean(settings.primary),
      allowRandom: Boolean(settings.allowRandom),
    };

    const notify = () => {
      if (bot.primary) {
        updateBotDisplay();
        updateConnectionStatus();
      }
      if (typeof settings.onStatusChange === 'function') {
        try {
          settings.onStatusChange(bot);
        } catch (err) {
          console.debug('Bot status hook error', err);
        }
      }
    };

    const nullify = (value = null) => {
      return value == null ? null : `"${value}"`;
    };

    const Connection = function (player) {
      this.player = player;
      this.socket = null;
      this.pendingConnect = null;
      this._hbTimer = null;
    };

    Connection.prototype.onopen = function () {
      this.Heartbeat(25000);
      bot.status = 'connected';
      bot.lastError = null;
      notify();
    };

    Connection.prototype.onclose = function (event) {
      clearTimeout(this._hbTimer);
      this.socket = null;
      if (bot.status !== 'error') {
        bot.status = 'idle';
      }
      if (event && event.code && event.code !== 1000) {
        bot.lastError = `Socket closed (${event.code})`;
      }
      notify();
    };

    Connection.prototype.onerror = function (event) {
      bot.status = 'error';
      bot.lastError = event?.message || 'Connection error';
      notify();
    };

    Connection.prototype.onmessage = function (event) {
      const message = String(event.data);
      if (message.startsWith('42')) {
        this.onbroadcast(message.slice(2));
      } else if (message.startsWith('40')) {
        this.onrequest();
      } else if (message.startsWith('430')) {
        try {
          const configs = JSON.parse(message.slice(3))[0];
          if (configs) {
            this.player.room.id = configs.roomid ?? this.player.room.id;
            this.player.room.players = configs.players ?? this.player.room.players;
          }
        } catch (err) {
          console.debug('OmniDraw bot config parse failed', err);
        }
        notify();
      }
    };

    Connection.prototype.onbroadcast = function (payload) {
      try {
        const data = JSON.parse(payload);
        if (data[0] === 'bc_uc_freedrawsession_changedroom') {
          this.player.room.players = data[3] ?? this.player.room.players;
          this.player.room.id = data[4] ?? this.player.room.id;
        } else if (data[0] === 'mc_roomplayerschange') {
          this.player.room.players = data[3] ?? this.player.room.players;
        }
        notify();
      } catch (err) {
        console.debug('OmniDraw bot broadcast parse failed', err);
      }
    };

    Connection.prototype.onrequest = function () {};

    Connection.prototype.open = function (url) {
      if (this.socket) {
        try {
          this.socket.close(1000, 'reconnect');
        } catch (err) {
          console.debug('OmniDraw bot close issue', err);
        }
      }
      bot.status = 'connecting';
      bot.lastError = null;
      notify();
      clearTimeout(this._hbTimer);
      try {
        this.socket = new WebSocket(url);
      } catch (err) {
        bot.status = 'error';
        bot.lastError = err?.message || 'Failed to open socket';
        notify();
        return;
      }
      trackSocket(this.socket);
      this.socket.onopen = this.onopen.bind(this);
      this.socket.onclose = this.onclose.bind(this);
      this.socket.onerror = this.onerror.bind(this);
      this.socket.onmessage = this.onmessage.bind(this);
    };

    Connection.prototype.close = function (code, reason) {
      if (this.socket) {
        try {
          this.socket.close(code, reason);
        } catch (err) {
          console.debug('OmniDraw bot close error', err);
        }
      }
      clearTimeout(this._hbTimer);
      this.socket = null;
    };

    Connection.prototype.Heartbeat = function (interval) {
      if (!interval) return;
      clearTimeout(this._hbTimer);
      this._hbTimer = setTimeout(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          try {
            this.socket.send(2);
            this.Heartbeat(interval);
          } catch (err) {
            console.debug('OmniDraw bot heartbeat error', err);
          }
        }
      }, interval);
    };

    Connection.prototype.serverconnect = function (server, roomPacket) {
      this.pendingConnect = roomPacket;
      bot.status = 'connecting';
      bot.lastError = null;
      notify();
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(41);
        this.socket.send(40);
      } else {
        this.open(server);
      }
      this.onrequest = () => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN && this.pendingConnect) {
          this.socket.send(this.pendingConnect);
        }
      };
    };

    const Room = function (conn) {
      this.conn = conn;
      this.id = null;
      this.players = [];
    };

    Room.prototype.join = function (invite, joinOptions = {}) {
      const joinSettings = {
        allowRandom: bot.allowRandom,
        ...joinOptions,
      };
      const rawInvite = typeof invite === 'string' ? invite : '';
      const clean = rawInvite.trim();
      bot.invite = clean;
      let server = '';
      let gamemode = 1;

      if (!clean && !joinSettings.allowRandom) {
        bot.status = 'error';
        bot.lastError = 'Provide a room invite before connecting the bot.';
        notify();
        return;
      }

      if (clean) {
        const code = clean.startsWith('http') ? clean.split('/').pop() : clean;
        this.id = code;
        if (clean.endsWith('.3')) {
          server = 'sv3.';
          gamemode = 2;
        } else if (clean.endsWith('.2')) {
          server = 'sv2.';
          gamemode = 2;
        } else {
          server = '';
          gamemode = 1;
        }
      } else {
        this.id = null;
        server = 'sv3.';
        gamemode = 2;
      }

      const serverUrl = `wss://${server}drawaria.online/socket.io/?sid1=undefined&hostname=drawaria.online&EIO=3&transport=websocket`;
      const player = this.conn.player;
      player.annonymize(bot.name);
      this.players = [];
      const payload = `420["startplay","${player.name}",${gamemode},"en",${nullify(this.id)},null,[null,"https://drawaria.online/",1000,1000,[${nullify(player.sid1)},${nullify(player.uid)},${nullify(player.wt)}],null]]`;
      this.conn.serverconnect(serverUrl, payload);
      notify();
    };

    Room.prototype.leave = function () {
      bot.status = 'idle';
      bot.lastError = null;
      this.players = [];
      this.id = null;
      this.conn.close(1000, 'bot leave');
      notify();
    };

    Room.prototype.next = function () {
      if (!bot.allowRandom) {
        bot.lastError = 'Random hopping is available for scout bots only.';
        notify();
        return;
      }
      if (this.conn.socket && this.conn.socket.readyState === WebSocket.OPEN) {
        bot.status = 'connecting';
        notify();
        this.conn.socket.send('42["pgswtichroom"]');
      }
    };

    const Actions = function (conn) {
      this.conn = conn;
    };

    Actions.prototype.DrawLine = function (bx = 50, by = 50, ex = 50, ey = 50, thickness = 50, color = '#FFFFFF', algo = 0) {
      if (!this.conn.socket || this.conn.socket.readyState !== WebSocket.OPEN) return;
      const startX = (bx / 100).toFixed(4);
      const startY = (by / 100).toFixed(4);
      const endX = (ex / 100).toFixed(4);
      const endY = (ey / 100).toFixed(4);
      const payload = `42["drawcmd",0,[${startX},${startY},${endX},${endY},true,${-thickness},"${color}",0,0,{"2":${algo},"3":0.5,"4":0.5}]]`;
      const payload2 = `42["drawcmd",0,[${startX},${startY},${endX},${endY},false,${-thickness},"${color}",0,0,{"2":${algo},"3":0.5,"4":0.5}]]`;
      this.conn.socket.send(payload);
      this.conn.socket.send(payload2);
    };

    const Player = function (name = undefined) {
      this.name = name;
      this.sid1 = null;
      this.uid = '';
      this.wt = '';
      this.conn = new Connection(this);
      this.room = new Room(this.conn);
      this.action = new Actions(this.conn);
    };

    Player.prototype.annonymize = function (name) {
      this.name = name;
      this.uid = undefined;
      this.wt = undefined;
    };

    bot.player = new Player(bot.name);
    bot.room = bot.player.room;
    bot.actions = bot.player.action;

    if (bot.primary) {
      window.__drawariaOmniBot = bot;
    }

    notify();

    return bot;
  }

  function hslToRgb(h, s, l) {
    const hue = ((h % 360) + 360) % 360;
    const sat = clamp(s, 0, 1);
    const lig = clamp(l, 0, 1);
    if (sat === 0) {
      const v = Math.round(lig * 255);
      return { r: v, g: v, b: v, a: 1 };
    }
    const c = (1 - Math.abs(2 * lig - 1)) * sat;
    const hp = hue / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let r1 = 0;
    let g1 = 0;
    let b1 = 0;
    if (hp >= 0 && hp < 1) {
      r1 = c;
      g1 = x;
    } else if (hp >= 1 && hp < 2) {
      r1 = x;
      g1 = c;
    } else if (hp >= 2 && hp < 3) {
      g1 = c;
      b1 = x;
    } else if (hp >= 3 && hp < 4) {
      g1 = x;
      b1 = c;
    } else if (hp >= 4 && hp < 5) {
      r1 = x;
      b1 = c;
    } else {
      r1 = c;
      b1 = x;
    }
    const m = lig - c / 2;
    return {
      r: Math.round((r1 + m) * 255),
      g: Math.round((g1 + m) * 255),
      b: Math.round((b1 + m) * 255),
      a: 1,
    };
  }

  function parseCssColor(value) {
    if (!value) return null;
    const str = value.trim().toLowerCase();
    if (!str) return null;
    if (str.startsWith('#')) {
      const hex = str.slice(1);
      if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        return { r, g, b, a: 1 };
      }
      if (hex.length === 6 || hex.length === 8) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
        return { r, g, b, a };
      }
      return null;
    }
    if (str.startsWith('rgb')) {
      const nums = str
        .replace(/rgba?\(/, '')
        .replace(')', '')
        .split(',')
        .map((part) => part.trim());
      if (nums.length < 3) return null;
      const r = parseFloat(nums[0]);
      const g = parseFloat(nums[1]);
      const b = parseFloat(nums[2]);
      const a = nums[3] !== undefined ? parseFloat(nums[3]) : 1;
      if ([r, g, b, a].some((num) => Number.isNaN(num))) return null;
      return { r, g, b, a };
    }
    if (str.startsWith('hsl')) {
      const nums = str
        .replace(/hsla?\(/, '')
        .replace(')', '')
        .split(',')
        .map((part) => part.trim());
      if (nums.length < 3) return null;
      const h = parseFloat(nums[0]);
      const s = parseFloat(nums[1].replace('%', '')) / 100;
      const l = parseFloat(nums[2].replace('%', '')) / 100;
      const a = nums[3] !== undefined ? parseFloat(nums[3]) : 1;
      if ([h, s, l, a].some((num) => Number.isNaN(num))) return null;
      const rgb = hslToRgb(h, s, l);
      rgb.a = a;
      return rgb;
    }
    return null;
  }

  function componentToHex(component) {
    const clamped = Math.max(0, Math.min(255, Math.round(component)));
    return clamped.toString(16).padStart(2, '0');
  }

  function rgbToHex(rgb) {
    if (!rgb) return null;
    return `#${componentToHex(rgb.r)}${componentToHex(rgb.g)}${componentToHex(rgb.b)}`;
  }

  function normalizeHex(value) {
    const rgb = parseCssColor(value);
    return rgb ? rgbToHex(rgb) : null;
  }

  function colorDistance(a, b) {
    if (!a || !b) return Number.POSITIVE_INFINITY;
    const dr = a.r - b.r;
    const dg = a.g - b.g;
    const db = a.b - b.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  function adjustLightness(rgb, amount) {
    if (!rgb) return rgb;
    if (!amount) return { ...rgb };
    const factor = clamp(amount / 100, -1, 1);
    if (factor === 0) return { ...rgb };
    if (factor > 0) {
      return {
        r: Math.round(rgb.r + (255 - rgb.r) * factor),
        g: Math.round(rgb.g + (255 - rgb.g) * factor),
        b: Math.round(rgb.b + (255 - rgb.b) * factor),
        a: rgb.a,
      };
    }
    return {
      r: Math.round(rgb.r * (1 + factor)),
      g: Math.round(rgb.g * (1 + factor)),
      b: Math.round(rgb.b * (1 + factor)),
      a: rgb.a,
    };
  }

  function isElementVisible(el) {
    if (!(el instanceof HTMLElement)) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function extractPaletteColor(el) {
    if (!el || !(el instanceof HTMLElement)) return null;
    const datasetColor = el.dataset ? (el.dataset.color || el.dataset.value) : null;
    const attrColor = datasetColor || el.getAttribute('data-color') || el.getAttribute('value');
    if (attrColor) {
      const parsed = parseCssColor(attrColor);
      if (parsed) {
        return { rgb: parsed, hex: rgbToHex(parsed) };
      }
    }

    const style = window.getComputedStyle(el);
    const candidates = [style.backgroundColor, style.borderTopColor, style.borderLeftColor, style.color];
    for (const candidate of candidates) {
      const parsed = parseCssColor(candidate);
      if (parsed && parsed.a > 0.6) {
        return { rgb: parsed, hex: rgbToHex(parsed) };
      }
    }
    return null;
  }

  function scanPalette() {
    const seen = new Set();
    const results = [];
    const selectors = [
      '[data-color]',
      '[aria-label*="color" i]',
      'button[style*="background"]',
      'div[style*="background"]',
      'span[style*="background"]',
      'button',
      '[role="button"]',
      '[role="radio"]',
    ];
    const elements = new Set();
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        if (el instanceof HTMLElement) {
          elements.add(el);
        }
      });
    });

    elements.forEach((el) => {
      if (el === state.panel || !el.isConnected) return;
      if (state.panel && (el.contains(state.panel) || state.panel.contains(el))) return;
      if (!isElementVisible(el)) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < 14 || rect.width > 72 || rect.height < 14 || rect.height > 72) return;
      if (el.closest('canvas')) return;
      const colorInfo = extractPaletteColor(el);
      if (!colorInfo) return;
      const key = `${colorInfo.hex}|${Math.round(rect.left)}|${Math.round(rect.top)}`;
      if (seen.has(key)) return;
      seen.add(key);
      results.push({
        el,
        hex: colorInfo.hex,
        rgb: colorInfo.rgb,
      });
    });

    return results;
  }

  function detectActiveSwatch(palette) {
    const activeAttributes = ['aria-pressed', 'aria-selected', 'data-selected', 'data-active'];
    for (const entry of palette) {
      const el = entry.el;
      if (!el || !el.isConnected) continue;
      for (const attr of activeAttributes) {
        if (el.getAttribute && el.getAttribute(attr) === 'true') {
          return entry;
        }
      }
      const className = typeof el.className === 'string' ? el.className : '';
      if (/(active|selected|current|checked)/i.test(className)) {
        return entry;
      }
    }
    return null;
  }

  function findPaletteMatch(targetHex, palette) {
    const targetRgb = parseCssColor(targetHex);
    if (!targetRgb) return null;
    let best = null;
    for (const entry of palette) {
      const diff = colorDistance(targetRgb, entry.rgb);
      if (!best || diff < best.diff) {
        best = { ...entry, diff };
      }
    }
    return best;
  }

  async function activateSwatch(entry) {
    if (!entry || !entry.el || !entry.el.isConnected) {
      return false;
    }
    const el = entry.el;
    const rect = el.getBoundingClientRect();
    const point = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    try {
      const pointerDown = new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        pointerId: state.palettePointerId,
        pointerType: 'mouse',
        clientX: point.x,
        clientY: point.y,
        button: 0,
        buttons: 1,
        pressure: 0.5,
      });
      const pointerUp = new PointerEvent('pointerup', {
        bubbles: true,
        cancelable: true,
        pointerId: state.palettePointerId,
        pointerType: 'mouse',
        clientX: point.x,
        clientY: point.y,
        button: 0,
        buttons: 0,
        pressure: 0,
      });
      const mouseClick = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: point.x,
        clientY: point.y,
        button: 0,
      });
      el.dispatchEvent(pointerDown);
      el.dispatchEvent(pointerUp);
      el.dispatchEvent(mouseClick);
      await delay(32);
      return true;
    } catch (err) {
      console.warn('Drawaria OmniDraw: failed to activate color swatch', err);
      return false;
    }
  }

  async function ensureColor(hex, attempt = 0) {
    if (!hex) return true;
    const normalized = normalizeHex(hex);
    if (!normalized) return false;

    if (!state.palette || !state.palette.length || attempt > 0) {
      state.palette = scanPalette();
      if (!state.palette.length) {
        return false;
      }
      if (!state.initialColorHex) {
        const active = detectActiveSwatch(state.palette);
        if (active) {
          state.initialColorHex = active.hex;
          state.currentSwatch = active.el;
        }
      }
      state.colorCache.clear();
    }

    if (!state.colorCache.has(normalized)) {
      const match = findPaletteMatch(normalized, state.palette);
      state.colorCache.set(normalized, match || null);
    }

    const entry = state.colorCache.get(normalized);
    if (!entry) {
      if (attempt === 0) {
        return ensureColor(hex, attempt + 1);
      }
      return false;
    }

    if (!entry.el.isConnected) {
      if (attempt === 0) {
        state.colorCache.delete(normalized);
        return ensureColor(hex, attempt + 1);
      }
      return false;
    }

    if (state.currentSwatch === entry.el) {
      return true;
    }

    const ok = await activateSwatch(entry);
    if (ok) {
      state.currentSwatch = entry.el;
    }
    return ok;
  }


  async function restoreInitialColor() {
    if (!state.initialColorHex) {
      return;
    }
    await ensureColor(state.initialColorHex, 1);
  }

  function findDrawingCanvas() {
    const candidates = Array.from(document.querySelectorAll('canvas'))
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          el,
          rect,
          area: Math.round(rect.width * rect.height),
          visible: rect.width > 0 && rect.height > 0,
          style: window.getComputedStyle(el),
        };
      })
      .filter((entry) => entry.visible && entry.area > 160000 && entry.style.pointerEvents !== 'none');

    if (!candidates.length) {
      return null;
    }

    candidates.sort((a, b) => b.area - a.area);
    return candidates[0].el;
  }

    const canvas = findDrawingCanvas();
  if (!canvas) {
    alert('Drawaria OmniDraw: join a drawing room before running this helper.');
    return;
  }

  alert('If you get bad quality, your device is probably ass.');

  state.canvas = canvas;


  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* =========================
         Sea's UI — OmniDraw Integration
         ========================= */

      :root{
        /* Theme */
        --ink:#1f2a44;
        --muted:#7b8aa6;
        --line:rgba(231,238,248,.95);

        --panelA:rgba(255,255,255,.90);
        --panelB:rgba(247,252,255,.88);
        --card:rgba(255,255,255,.84);

        --sea:#2f80ed;
        --sea2:#6aaeff;
        --sea3:#9ad0ff;

        /* Motion / effects controls (live-updated) */
        --motion:1;              /* 0.6..1.4 */
        --glow:0.55;             /* 0..1 */
        --glass:0.75;            /* 0..1 */
        --wave:0.55;             /* 0..1 */
        --radiusXL:56px;
        --radiusL:22px;
        --radiusM:18px;
        --radiusS:14px;

        --shadow: 0 22px 60px rgba(27, 60, 120, .18);
        --shadowSoft: 0 14px 34px rgba(27, 60, 120, .12);
        --shadowTight: 0 10px 22px rgba(27, 60, 120, .10);

        --easeOut: cubic-bezier(.16, 1, .3, 1);
        --easeInOut: cubic-bezier(.65, 0, .35, 1);

        /* Derived */
        --accentGlow: rgba(47,128,237, calc(.18 * var(--glow)));
        --accentGlow2: rgba(106,174,255, calc(.18 * var(--glow)));
        --blur: calc(16px * var(--glass));
      }

      .seas-omni-root {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 999999;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      }

      /* Animated ambient gradients (subtle, elegant) */
      .seas-ambient{
        position:fixed;
        inset:-20%;
        pointer-events:none;
        z-index:0;
        opacity:1;
        background:
          radial-gradient(900px 540px at 18% 28%, rgba(47,128,237,.18) 0%, rgba(47,128,237,0) 58%),
          radial-gradient(720px 520px at 72% 38%, rgba(106,174,255,.18) 0%, rgba(106,174,255,0) 60%),
          radial-gradient(820px 620px at 55% 78%, rgba(255,255,255,.45) 0%, rgba(255,255,255,0) 58%),
          linear-gradient(25deg, rgba(255,255,255,0) 35%, rgba(255,255,255,.22) 47%, rgba(255,255,255,0) 62%);
        filter: blur(1px);
        animation: ambientDrift calc(18s / var(--motion)) var(--easeInOut) infinite alternate;
        transform: rotate(-8deg);
      }
      @keyframes ambientDrift{
        from{ transform: rotate(-8deg) translate3d(-10px, -10px, 0) scale(1); }
        to  { transform: rotate(-8deg) translate3d(12px, 14px, 0) scale(1.01); }
      }

      /* Elegant wave sheen overlay */
      .seas-sheen{
        position:fixed;
        inset:-10%;
        pointer-events:none;
        z-index:0;
        opacity: calc(.55 * var(--wave));
        background:
          repeating-linear-gradient(
            135deg,
            rgba(255,255,255,0) 0px,
            rgba(255,255,255,.16) 26px,
            rgba(255,255,255,0) 56px
          );
        filter: blur(0.5px);
        transform: translate3d(0,0,0);
        animation: sheenMove calc(14s / var(--motion)) linear infinite;
        mix-blend-mode: soft-light;
      }
      @keyframes sheenMove{
        from{ transform: translate3d(-6%, -4%, 0) rotate(-8deg); }
        to  { transform: translate3d( 6%,  5%, 0) rotate(-8deg); }
      }

      .seas-panel{
        position: absolute;
        top: 28px;
        left: 28px;
        width: min(480px, calc(100vw - 56px));
        max-height: min(82vh, 720px);
        height: clamp(520px, 70vh, 680px);
        border-radius: var(--radiusXL);
        background: linear-gradient(180deg, var(--panelA) 0%, var(--panelB) 60%, rgba(246,251,255,.90) 100%);
        box-shadow: var(--shadow);
        border: 1px solid rgba(255,255,255,.7);
        overflow:hidden;
        position:relative;
        isolation:isolate;
        pointer-events: auto;
      }

      /* Top tint */
      .seas-panel-top-tint{
        position:absolute;
        inset:0 0 auto 0;
        height:150px;
        background:
          linear-gradient(180deg, rgba(47,128,237,.12) 0%, rgba(47,128,237,0) 100%);
        pointer-events:none;
        z-index:0;
      }

      /* "Glass" inner highlight */
      .seas-panel:before{
        content:"";
        position:absolute;
        inset:0;
        pointer-events:none;
        z-index:0;
        background:
          radial-gradient(900px 220px at 18% 0%, rgba(255,255,255,.60), rgba(255,255,255,0) 60%),
          radial-gradient(900px 240px at 75% 0%, rgba(255,255,255,.44), rgba(255,255,255,0) 58%);
        opacity: calc(.72 * var(--glass));
      }

      .seas-panel-inner{
        position:relative;
        z-index:1;
        padding:34px 44px 44px;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      /* Header */
      .seas-header{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:18px;
        padding-bottom:18px;
      }

      .seas-brand{
        display:flex;
        align-items:center;
        gap:14px;
        min-width:260px;
      }
      .seas-brand-mark{
        width:34px; height:34px;
        border-radius:12px;
        display:grid; place-items:center;
        background: linear-gradient(135deg, rgba(47,128,237,.14), rgba(47,128,237,.04));
        border:1px solid rgba(47,128,237,.18);
        box-shadow: 0 12px 26px rgba(47,128,237,.12);
        position:relative;
        overflow:hidden;
      }
      .seas-brand-mark:after{
        content:"";
        position:absolute; inset:-40%;
        background: conic-gradient(from 90deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0));
        opacity: calc(.55 * var(--glow));
        animation: markShine calc(3.6s / var(--motion)) linear infinite;
      }
      @keyframes markShine{
        from{ transform: rotate(0deg); }
        to{ transform: rotate(360deg); }
      }
      .seas-brand-mark svg{ width:18px; height:18px; position:relative; z-index:1; }

      .seas-brand h1{
        font-size:28px;
        margin:0;
        letter-spacing:.2px;
        color: var(--ink);
      }

      .seas-top-actions{
        display:flex;
        align-items:center;
        gap:14px;
      }

      .seas-icon-btn{
        width:40px; height:40px;
        border-radius:14px;
        background: rgba(255,255,255,.70);
        border:1px solid rgba(231,238,248,.95);
        box-shadow: var(--shadowTight);
        display:grid;
        place-items:center;
        cursor:pointer;
        transition:
          transform calc(.18s / var(--motion)) var(--easeOut),
          box-shadow calc(.22s / var(--motion)) var(--easeOut),
          background calc(.22s / var(--motion)) var(--easeOut);
        position:relative;
        overflow:hidden;
        pointer-events: auto;
      }
      .seas-icon-btn:hover{
        transform: translateY(-2px);
        box-shadow: 0 18px 34px rgba(27,60,120,.14);
        background: rgba(255,255,255,.85);
      }
      .seas-icon-btn:active{
        transform: translateY(0px) scale(.98);
      }
      .seas-icon-btn svg{ width:18px; height:18px; opacity:.78; }

      /* Button ripple */
      .seas-icon-btn:before{
        content:"";
        position:absolute;
        inset:auto;
        width:8px; height:8px;
        border-radius:999px;
        background: radial-gradient(circle, rgba(47,128,237,.55), rgba(47,128,237,0) 70%);
        transform: translate(-999px,-999px);
        opacity:0;
        pointer-events:none;
      }
      .seas-icon-btn.seas-rippling:before{
        animation: seasRipple calc(.55s / var(--motion)) var(--easeOut) forwards;
      }
      @keyframes seasRipple{
        from{ opacity:.0; transform: translate(var(--rx), var(--ry)) scale(0); }
        20%{ opacity:.35; }
        to{ opacity:0; transform: translate(var(--rx), var(--ry)) scale(14); }
      }

      .seas-avatar{
        width:40px; height:40px;
        border-radius:999px;
        border:2px solid rgba(255,255,255,.92);
        box-shadow: 0 16px 28px rgba(27, 60, 120, .14);
        background:
          radial-gradient(circle at 30% 30%, #ffe8d6 0 24%, transparent 25%),
          radial-gradient(circle at 55% 42%, #1f2a44 0 18%, transparent 19%),
          radial-gradient(circle at 58% 47%, #1f2a44 0 18%, transparent 19%),
          radial-gradient(circle at 54% 68%, #ffcfb1 0 22%, transparent 23%),
          linear-gradient(180deg, #bcdcff 0%, #d7efff 100%);
      }

      /* Tabs row */
      .seas-tabs{
        display:flex;
        align-items:center;
        gap:12px;
        padding: 8px 0 18px;
        border-bottom:1px solid rgba(231,238,248,.95);
        margin: 0 -44px;
        padding-left:44px;
        padding-right:44px;
        background: linear-gradient(180deg, rgba(255,255,255,.60) 0%, rgba(255,255,255,0) 100%);
        position:relative;
      }

      .seas-tab-btn{
        appearance:none;
        border:0;
        background: transparent;
        padding:12px 16px;
        font-size:15px;
        color: var(--muted);
        border-radius:14px;
        cursor:pointer;
        user-select:none;
        position:relative;
        transition:
          transform calc(.18s / var(--motion)) var(--easeOut),
          background calc(.22s / var(--motion)) var(--easeOut),
          color calc(.22s / var(--motion)) var(--easeOut),
          box-shadow calc(.22s / var(--motion)) var(--easeOut);
        outline:none;
        pointer-events: auto;
      }
      .seas-tab-btn:hover{
        background: rgba(47,128,237,.06);
        transform: translateY(-1px);
      }
      .seas-tab-btn[aria-selected="true"]{
        color: var(--sea);
        background: rgba(47,128,237,.10);
        box-shadow: 0 16px 26px rgba(47,128,237,.10);
      }

      /* Animated underline "ink" that slides between tabs */
      .seas-tab-ink{
        position:absolute;
        height:3px;
        bottom:-2px;
        left:44px;
        width:88px;
        border-radius:999px;
        background: linear-gradient(90deg, var(--sea), rgba(47,128,237,.20));
        box-shadow: 0 14px 22px rgba(47,128,237,.22);
        transform: translate3d(0,0,0);
        transition: transform calc(.50s / var(--motion)) var(--easeOut), width calc(.50s / var(--motion)) var(--easeOut);
      }

      /* Content area */
      .seas-content{
        flex: 1;
        overflow-y: auto;
        padding-right: 10px;
        margin-right: -4px;
        position: relative;
      }

      .seas-tab-panel{
        display:none;
        transform-origin: top center;
      }
      .seas-tab-panel.active{
        display:block;
        animation: seasPanelIn calc(.42s / var(--motion)) var(--easeOut) both;
      }
      @keyframes seasPanelIn{
        from{ opacity:0; transform: translateY(10px) scale(.995); filter: blur(6px); }
        to  { opacity:1; transform: translateY(0) scale(1); filter: blur(0); }
      }

      /* Grids and cards */
      .seas-grid{ display:grid; gap:22px; padding-top:22px; }
      .seas-stats{ grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .seas-two-col{ grid-template-columns: 1.35fr 1fr; align-items:stretch; }
      .seas-bottom{ grid-template-columns: 1.35fr 1fr; align-items:stretch; }

      .seas-card{
        background: var(--card);
        border: 1px solid rgba(231,238,248,.95);
        border-radius: var(--radiusL);
        padding:18px 20px;
        position:relative;
        overflow:hidden;
        box-shadow: var(--shadowSoft);
        transform: translate3d(0,0,0);
        backdrop-filter: blur(var(--blur));
        -webkit-backdrop-filter: blur(var(--blur));
        transition:
          transform calc(.20s / var(--motion)) var(--easeOut),
          box-shadow calc(.26s / var(--motion)) var(--easeOut),
          border-color calc(.26s / var(--motion)) var(--easeOut);
      }
      .seas-card:hover{
        transform: translateY(-3px);
        box-shadow: 0 26px 60px rgba(27,60,120,.16);
        border-color: rgba(47,128,237,.20);
      }

      /* Artful, subtle animated "light caustics" inside cards */
      .seas-card:after{
        content:"";
        position:absolute; inset:-30%;
        background:
          radial-gradient(420px 220px at 20% 30%, rgba(47,128,237,.10), rgba(47,128,237,0) 60%),
          radial-gradient(360px 220px at 70% 40%, rgba(106,174,255,.10), rgba(106,174,255,0) 60%),
          linear-gradient(20deg, rgba(255,255,255,0) 40%, rgba(255,255,255,.14) 52%, rgba(255,255,255,0) 64%);
        opacity: calc(.70 * var(--glow));
        filter: blur(1px);
        transform: translate3d(0,0,0);
        animation: caustics calc(10s / var(--motion)) var(--easeInOut) infinite alternate;
        pointer-events:none;
      }
      @keyframes caustics{
        from{ transform: translate3d(-12px,-10px,0) rotate(-2deg); }
        to{ transform: translate3d(14px,12px,0) rotate(2deg); }
      }

      /* Blob accents */
      .seas-blob{
        position:absolute;
        top:-46px; right:-62px;
        width:180px; height:180px;
        border-radius:999px;
        background: radial-gradient(circle at 30% 30%, rgba(47,128,237,.24), rgba(47,128,237,0) 65%);
        opacity:.95;
        pointer-events:none;
        filter: blur(.2px);
        animation: blobFloat calc(6.8s / var(--motion)) var(--easeInOut) infinite alternate;
      }
      .seas-blob.green{ background: radial-gradient(circle at 30% 30%, rgba(46,204,113,.20), rgba(46,204,113,0) 65%); }
      .seas-blob.orange{ background: radial-gradient(circle at 30% 30%, rgba(255,140,66,.22), rgba(255,140,66,0) 65%); }
      @keyframes blobFloat{
        from{ transform: translate3d(-2px, 0, 0) scale(1); }
        to  { transform: translate3d( 6px, 8px, 0) scale(1.02); }
      }

      .seas-stat-title{ font-size:14px; color:var(--muted); margin:0 0 8px 0; }
      .seas-stat-value{ font-size:34px; font-weight:850; margin:0 0 8px 0; letter-spacing:.2px; }
      .seas-stat-sub{ font-size:13px; color:#95a4bf; margin:0; }

      .seas-stat-meta{
        position:absolute;
        top:16px; right:16px;
        font-size:13px;
        font-weight:800;
        color: rgba(47,128,237,.88);
        background: rgba(47,128,237,.10);
        border:1px solid rgba(47,128,237,.18);
        padding:6px 10px;
        border-radius:999px;
        box-shadow: 0 16px 22px rgba(47,128,237,.10);
      }
      .seas-stat-meta.orange{ color: rgba(255,140,66,.92); background: rgba(255,140,66,.12); border-color: rgba(255,140,66,.22); }
      .seas-stat-meta.green{ color: rgba(46,204,113,.92); background: rgba(46,204,113,.12); border-color: rgba(46,204,113,.22); }

      /* Form controls */
      .seas-field {
        display: grid;
        gap: 10px;
        margin-bottom: 16px;
      }

      .seas-field label {
        font-size: 14px;
        font-weight: 700;
        color: var(--ink);
      }

      .seas-field input[type="number"],
      .seas-field input[type="text"],
      .seas-field input[type="range"],
      .seas-field select,
      .seas-field textarea {
        width: 100%;
        padding: 12px 16px;
        border-radius: 14px;
        border: 1.5px solid rgba(148, 163, 184, 0.45);
        font-size: 14px;
        background: rgba(255, 255, 255, 0.97);
        box-shadow: inset 0 2px 4px rgba(15, 23, 42, 0.08);
        color: var(--ink);
        line-height: 1.4;
        transition: all 0.2s var(--easeOut);
      }

      .seas-field input[type="range"] {
        padding: 0;
        height: 6px;
        accent-color: var(--sea);
      }

      .seas-field small {
        font-size: 12px;
        color: var(--muted);
        line-height: 1.5;
      }

      .seas-upload {
        display: grid;
        gap: 12px;
        padding: 16px;
        border-radius: 16px;
        background: rgba(59, 130, 246, 0.1);
        border: 2px dashed rgba(59, 130, 246, 0.4);
        margin-bottom: 20px;
      }

      .seas-upload strong {
        font-size: 14px;
        font-weight: 600;
        color: var(--sea);
      }

      /* Preview box */
      .seas-preview-box {
        position: relative;
        border-radius: 18px;
        overflow: hidden;
        background: rgba(15, 23, 42, 0.08);
        border: 1.5px solid rgba(148, 163, 184, 0.22);
        min-height: 280px;
        display: grid;
        place-items: center;
        margin-bottom: 20px;
      }

      .seas-preview-box canvas {
        max-width: 100%;
        height: auto;
        border-radius: 12px;
      }

      .seas-preview-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        margin-top: 14px;
        width: 100%;
      }

      /* Buttons */
      .seas-button {
        border: none;
        padding: 12px 24px;
        border-radius: 14px;
        background: linear-gradient(135deg, var(--sea), var(--sea2));
        color: #ffffff;
        font-weight: 700;
        font-size: 14px;
        letter-spacing: 0.3px;
        cursor: pointer;
        box-shadow: 0 14px 24px rgba(47, 128, 237, 0.32);
        transition: transform calc(.12s / var(--motion)) var(--easeOut), 
                    box-shadow calc(.15s / var(--motion)) var(--easeOut), 
                    filter calc(.15s / var(--motion)) var(--easeOut);
        pointer-events: auto;
      }

      .seas-button.secondary {
        background: rgba(15, 23, 42, 0.12);
        color: var(--ink);
        box-shadow: none;
      }

      .seas-button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
        box-shadow: none;
      }

      .seas-button:not(:disabled):hover {
        transform: translateY(-2px);
        box-shadow: 0 18px 32px rgba(37, 99, 235, 0.35);
      }

      .seas-button:not(:disabled):active {
        transform: translateY(1px) scale(0.97);
      }

      .seas-pill {
        height: 36px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 14px;
        border-radius: 999px;
        border: 1px solid rgba(231, 238, 248, .95);
        background: rgba(255, 255, 255, .70);
        color: var(--muted);
        font-weight: 700;
        font-size: 13px;
        box-shadow: 0 14px 24px rgba(27, 60, 120, .07);
        cursor: pointer;
        position: relative;
        user-select: none;
        transition: transform calc(.18s / var(--motion)) var(--easeOut), box-shadow calc(.22s / var(--motion)) var(--easeOut);
        pointer-events: auto;
      }

      .seas-pill:hover {
        transform: translateY(-1px);
        box-shadow: 0 18px 28px rgba(27, 60, 120, .10);
      }

      .seas-pill:active {
        transform: translateY(0px) scale(.99);
      }

      /* Progress */
      .seas-progress {
        display: grid;
        gap: 8px;
        margin-top: 20px;
      }

      .seas-progress span {
        font-size: 13px;
        color: rgba(15, 23, 42, 0.8);
        letter-spacing: 0.3px;
        font-weight: 600;
      }

      .seas-progress-bar {
        position: relative;
        width: 100%;
        height: 12px;
        border-radius: 999px;
        background: rgba(148, 163, 184, 0.22);
        overflow: hidden;
      }

      .seas-progress-bar::after {
        content: '';
        position: absolute;
        inset: 0;
        width: var(--progress, 0%);
        background: linear-gradient(90deg, rgba(37, 99, 235, 0.9), rgba(192, 132, 252, 0.9));
        transition: width 200ms ease;
      }

      /* Connection status */
      .seas-conn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: rgba(15, 23, 42, 0.75);
        letter-spacing: 0.25px;
        font-weight: 600;
      }

      .seas-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(148, 163, 184, 0.8);
        box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.2);
      }

      .seas-dot.online {
        background: rgba(34, 197, 94, 0.9);
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
      }

      .seas-dot.pending {
        background: rgba(251, 191, 36, 0.9);
        box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
      }

      .seas-dot.offline {
        background: rgba(148, 163, 184, 0.9);
        box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.25);
      }

      /* Actions row */
      .seas-actions {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
        margin-top: 20px;
      }

      .seas-actions .seas-button {
        flex: 1 1 140px;
      }

      /* Stats */
      .seas-stats-grid {
        display: grid;
        gap: 12px;
        font-size: 14px;
        line-height: 1.5;
        color: rgba(15, 23, 42, 0.82);
      }

      .seas-note {
        font-size: 14px;
        color: rgba(30, 41, 59, 0.78);
        line-height: 1.5;
      }

      /* Fleet */
      .seas-fleet {
        padding: 16px;
        border-radius: 16px;
        background: rgba(59, 130, 246, 0.1);
        border: 1.5px solid rgba(96, 165, 250, 0.3);
      }

      .seas-fleet-item {
        display: grid;
        gap: 8px;
        padding: 14px 16px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.94);
        border: 1.5px solid rgba(148, 163, 184, 0.25);
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
        margin-bottom: 12px;
      }

      .seas-fleet-item strong {
        font-size: 14px;
        color: var(--sea);
      }

      .seas-fleet-actions {
        display: flex;
        gap: 12px;
        margin-top: 8px;
      }

      .seas-fleet-actions button {
        flex: 1 1 auto;
      }

      /* Settings controls */
      .seas-settings-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 22px;
        padding-top: 22px;
      }

      .seas-control {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 14px 14px;
        border-radius: 18px;
        background: rgba(255, 255, 255, .58);
        border: 1px solid rgba(231, 238, 248, .85);
        position: relative;
        z-index: 1;
      }

      .seas-control label {
        font-weight: 900;
        color: #2b3a56;
        font-size: 13px;
      }

      .seas-control small {
        color: #93a3bf;
        font-weight: 750;
        line-height: 1.35;
      }

      .seas-toggle-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 2px;
      }

      .seas-switch {
        position: relative;
        width: 52px;
        height: 30px;
        border-radius: 999px;
        border: 1px solid rgba(231, 238, 248, .95);
        background: rgba(231, 238, 248, .65);
        cursor: pointer;
        box-shadow: 0 14px 24px rgba(27, 60, 120, .07);
        transition: background calc(.22s / var(--motion)) var(--easeOut);
        flex: 0 0 auto;
      }

      .seas-switch.on {
        background: rgba(47, 128, 237, .18);
        border-color: rgba(47, 128, 237, .22);
      }

      .seas-knob {
        position: absolute;
        top: 4px;
        left: 4px;
        width: 22px;
        height: 22px;
        border-radius: 999px;
        background: rgba(255, 255, 255, .92);
        box-shadow: 0 12px 20px rgba(27, 60, 120, .14);
        transition: transform calc(.22s / var(--motion)) var(--easeOut);
      }

      .seas-switch.on .seas-knob {
        transform: translateX(22px);
      }

      /* Toast */
      .seas-toast {
        position: fixed;
        left: 50%;
        bottom: 18px;
        transform: translateX(-50%) translateY(20px);
        opacity: 0;
        pointer-events: none;
        z-index: 1000000;
        background: rgba(255, 255, 255, .82);
        border: 1px solid rgba(231, 238, 248, .95);
        border-radius: 16px;
        padding: 10px 12px;
        box-shadow: 0 26px 60px rgba(27, 60, 120, .16);
        backdrop-filter: blur(var(--blur));
        -webkit-backdrop-filter: blur(var(--blur));
        font-weight: 850;
        color: #2b3a56;
        transition: opacity calc(.22s / var(--motion)) var(--easeOut), transform calc(.22s / var(--motion)) var(--easeOut);
      }

      .seas-toast.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0px);
      }

      /* Scrollbar */
      .seas-content::-webkit-scrollbar {
        width: 8px;
      }

      .seas-content::-webkit-scrollbar-thumb {
        background: rgba(148, 163, 184, 0.5);
        border-radius: 999px;
      }

      .seas-content::-webkit-scrollbar-track {
        background: rgba(148, 163, 184, 0.1);
        border-radius: 999px;
      }

      /* Responsive */
      @media (max-width: 720px) {
        .seas-panel {
          width: calc(100vw - 32px);
          left: 16px;
          top: 16px;
        }
        
        .seas-panel-inner {
          padding: 24px 24px 34px;
        }
        
        .seas-tabs {
          margin: 0 -24px;
          padding-left: 24px;
          padding-right: 24px;
        }
        
        .seas-tab-ink {
          left: 24px;
        }
        
        .seas-stats {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        
        .seas-two-col, .seas-bottom {
          grid-template-columns: 1fr;
        }
        
        .seas-settings-grid {
          grid-template-columns: 1fr;
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        :root {
          --motion: 0.7;
        }
        
        .seas-ambient, .seas-sheen, .seas-card:after, .seas-blob, .seas-brand-mark:after {
          animation: none !important;
        }
        
        .seas-tab-panel.active {
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
    state.style = style;
  }

  function createRoot() {
    const root = document.createElement('div');
    root.className = 'seas-omni-root';
    
    // Add ambient backgrounds
    const ambient = document.createElement('div');
    ambient.className = 'seas-ambient';
    ambient.setAttribute('aria-hidden', 'true');
    
    const sheen = document.createElement('div');
    sheen.className = 'seas-sheen';
    sheen.setAttribute('aria-hidden', 'true');
    
    root.appendChild(ambient);
    root.appendChild(sheen);
    
    document.body.appendChild(root);
    state.root = root;
  }

  function createHeader() {
    const header = document.createElement('div');
    header.className = 'seas-header';

    const brand = document.createElement('div');
    brand.className = 'seas-brand';
    
    const brandMark = document.createElement('div');
    brandMark.className = 'seas-brand-mark';
    brandMark.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 3.5 3.5 10.2V20a1.2 1.2 0 0 0 1.2 1.2h4.6v-6.2a1.2 1.2 0 0 1 1.2-1.2h3a1.2 1.2 0 0 1 1.2 1.2v6.2h4.6A1.2 1.2 0 0 0 20.5 20v-9.8L12 3.5Z"
              stroke="rgba(47,128,237,.95)" stroke-width="1.9" stroke-linejoin="round"/>
      </svg>
    `;
    
    const title = document.createElement('h1');
    title.textContent = 'OmniDraw Studio';
    
    brand.appendChild(brandMark);
    brand.appendChild(title);

    const topActions = document.createElement('div');
    topActions.className = 'seas-top-actions';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'seas-icon-btn';
    closeBtn.setAttribute('data-ripple', '');
    closeBtn.setAttribute('aria-label', 'Close helper');
    closeBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M6 6l12 12M18 6L6 18" stroke="rgba(31,42,68,.9)" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
    closeBtn.addEventListener('click', () => destroy());
    
    const minimizeBtn = document.createElement('button');
    minimizeBtn.className = 'seas-icon-btn';
    minimizeBtn.setAttribute('data-ripple', '');
    minimizeBtn.setAttribute('aria-label', 'Minimize');
    minimizeBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14" stroke="rgba(31,42,68,.9)" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
    minimizeBtn.addEventListener('click', () => {
      state.panel.classList.toggle('minimized');
    });
    
    topActions.appendChild(minimizeBtn);
    topActions.appendChild(closeBtn);

    header.appendChild(brand);
    header.appendChild(topActions);

    // Add drag functionality
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    const startDrag = (e) => {
      if (e.target.closest('.seas-icon-btn')) return;
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = state.panel.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDrag);
      e.preventDefault();
    };

    const drag = (e) => {
      if (!isDragging) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      const left = clamp(startLeft + dx, 8, window.innerWidth - state.panel.offsetWidth - 8);
      const top = clamp(startTop + dy, 8, window.innerHeight - state.panel.offsetHeight - 8);
      
      state.panel.style.left = `${left}px`;
      state.panel.style.top = `${top}px`;
    };

    const stopDrag = () => {
      isDragging = false;
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDrag);
    };

    header.addEventListener('mousedown', startDrag);

    return header;
  }

  function createTabs() {
    const tabs = [
      { id: 'image', label: 'Image' },
      { id: 'path', label: 'Path' },
      { id: 'bot', label: 'Bot' },
      { id: 'placement', label: 'Placement' },
      { id: 'preview', label: 'Preview' },
      { id: 'guide', label: 'Guide' },
      { id: 'settings', label: 'UI Settings' },
    ];

    const tabBar = document.createElement('nav');
    tabBar.className = 'seas-tabs';
    tabBar.setAttribute('aria-label', 'Primary navigation');

    const ink = document.createElement('div');
    ink.className = 'seas-tab-ink';
    ink.id = 'seasTabInk';
    ink.setAttribute('aria-hidden', 'true');

    tabs.forEach((tab) => {
      const btn = document.createElement('button');
      btn.className = 'seas-tab-btn';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', tab.id === state.activeTab ? 'true' : 'false');
      btn.setAttribute('aria-controls', `tab-${tab.id}`);
      btn.id = `t-${tab.id}`;
      btn.textContent = tab.label;
      btn.addEventListener('click', () => setActiveTab(tab.id));
      tabBar.appendChild(btn);
    });

    tabBar.appendChild(ink);

    return tabBar;
  }

  function setActiveTab(id) {
    if (state.activeTab === id) return;
    
    const oldTab = state.tabs.get(state.activeTab);
    const newTab = state.tabs.get(id);
    
    if (oldTab) {
      oldTab.classList.remove('active');
    }
    
    if (newTab) {
      newTab.classList.add('active');
    }
    
    // Update tab buttons
    document.querySelectorAll('.seas-tab-btn').forEach(btn => {
      const isSelected = btn.id === `t-${id}`;
      btn.setAttribute('aria-selected', isSelected.toString());
    });
    
    // Update ink position
    const activeBtn = document.querySelector(`#t-${id}`);
    const ink = document.getElementById('seasTabInk');
    if (activeBtn && ink) {
      const tabs = activeBtn.closest('.seas-tabs');
      const br = activeBtn.getBoundingClientRect();
      const tr = tabs.getBoundingClientRect();
      const left = br.left - tr.left + tabs.scrollLeft;
      ink.style.width = `${Math.max(56, br.width - 18)}px`;
      ink.style.transform = `translate3d(${left + 9}px,0,0)`;
    }
    
    state.activeTab = id;
  }

  async function handleFileSelection(files) {
    if (!files || !files.length) return;
    const file = files[0];
    try {
      const bitmap = await createImageBitmap(file);
      await loadImageBitmap(bitmap, file.name || 'uploaded image');
    } catch (err) {
      console.error('OmniDraw failed to read image', err);
      showToast('Could not read that file. Try a standard image such as PNG or JPEG.');
    }
  }

  async function handleImageUrl(url) {
    if (!url) return;
    try {
      const response = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);
      await loadImageBitmap(bitmap, url);
    } catch (err) {
      console.error('OmniDraw failed to fetch image', err);
      showToast('Could not load that link. Make sure it is an image URL that allows cross-origin access.');
    }
  }

  function fitBitmapToResolution(bitmap) {
    const target = state.config.resolution;
    const aspect = bitmap.width / bitmap.height;
    let width = target;
    let height = Math.round(target / aspect);
    if (height > target) {
      height = target;
      width = Math.round(target * aspect);
    }
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const ctx = offscreen.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, width, height);
    const baseData = ctx.getImageData(0, 0, width, height);
    return {
      width,
      height,
      baseData,
    };
  }

  function cloneImageData(imageData) {
    return new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
  }

  function lightenImageData(baseData, amount) {
    const copy = cloneImageData(baseData);
    if (!amount) {
      return copy;
    }
    const data = copy.data;
    for (let i = 0; i < data.length; i += 4) {
      const rgb = { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] / 255 };
      const adjusted = adjustLightness(rgb, amount);
      data[i] = adjusted.r;
      data[i + 1] = adjusted.g;
      data[i + 2] = adjusted.b;
    }
    return copy;
  }

  async function loadImageBitmap(bitmap, label = 'image') {
    const fitted = fitBitmapToResolution(bitmap);
    const adjusted = lightenImageData(fitted.baseData, state.config.lighten);
    state.image = {
      label,
      width: fitted.width,
      height: fitted.height,
      baseData: cloneImageData(fitted.baseData),
      data: adjusted,
    };
    updateImageInfo();
    await buildCommands();
    renderPreview(state.preview.drawnSegments);
    showToast(`Loaded: ${label}`);
  }

  function createFieldNumber({ label, min, max, step, get, set, description, onChange }) {
    const handler = onChange === undefined ? handleSettingsChange : onChange;
    const wrapper = document.createElement('div');
    wrapper.className = 'seas-field';
    
    const title = document.createElement('label');
    title.textContent = label;
    
    const input = document.createElement('input');
    input.type = 'number';
    if (min !== undefined) input.min = String(min);
    if (max !== undefined) input.max = String(max);
    if (step !== undefined) input.step = String(step);
    input.value = String(get());
    
    input.addEventListener('change', () => {
      const value = parseFloat(input.value);
      if (Number.isFinite(value)) {
        set(clamp(value, min ?? value, max ?? value));
        input.value = String(get());
        if (handler) handler(get());
      } else {
        input.value = String(get());
      }
    });
    
    wrapper.append(title, input);
    
    if (description) {
      const note = document.createElement('small');
      note.textContent = description;
      wrapper.appendChild(note);
    }
    
    return wrapper;
  }

  function createFieldRange({ label, min, max, step, unit = '', get, set, description, onChange, formatValue }) {
    const handler = onChange === undefined ? handleSettingsChange : onChange;
    const format = formatValue || ((value) => {
      if (Number.isInteger(value)) return String(value);
      return value.toFixed(2).replace(/\.00$/, '');
    });
    
    const wrapper = document.createElement('div');
    wrapper.className = 'seas-field';
    
    const title = document.createElement('label');
    const updateLabel = () => {
      title.textContent = `${label} (${format(get())}${unit})`;
    };
    updateLabel();
    
    const input = document.createElement('input');
    input.type = 'range';
    input.min = String(min);
    input.max = String(max);
    input.step = step ? String(step) : '1';
    input.value = String(get());
    
    input.addEventListener('input', () => {
      const value = parseFloat(input.value);
      if (Number.isFinite(value)) {
        set(value);
        updateLabel();
        if (handler) handler(get());
      }
    });
    
    wrapper.append(title, input);
    
    if (description) {
      const note = document.createElement('small');
      note.textContent = description;
      wrapper.appendChild(note);
    }
    
    return wrapper;
  }

  function createFieldSelect({ label, options, get, set, description, onChange }) {
    const handler = onChange === undefined ? handleSettingsChange : onChange;
    const wrapper = document.createElement('div');
    wrapper.className = 'seas-field';
    
    const title = document.createElement('label');
    title.textContent = label;
    
    const select = document.createElement('select');
    options.forEach((opt) => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      if (opt.value === get()) {
        option.selected = true;
      }
      select.appendChild(option);
    });
    
    select.addEventListener('change', () => {
      set(select.value);
      if (handler) handler(get());
    });
    
    wrapper.append(title, select);
    
    if (description) {
      const note = document.createElement('small');
      note.textContent = description;
      wrapper.appendChild(note);
    }
    
    return wrapper;
  }

  function updateLightnessAndRebuild(value) {
    state.config.lighten = clamp(value, -40, 60);
    if (!state.image || state.drawing) {
      return;
    }
    state.image.data = lightenImageData(state.image.baseData, state.config.lighten);
    handleSettingsChange();
  }

  function buildImageTab(tab) {
    tab.innerHTML = '';
    
    const section = document.createElement('div');
    section.className = 'seas-card';
    
    const title = document.createElement('h2');
    title.className = 'seas-card-title';
    title.textContent = 'Add your picture';
    section.appendChild(title);
    
    const uploadBox = document.createElement('div');
    uploadBox.className = 'seas-upload';
    
    const uploadLabel = document.createElement('strong');
    uploadLabel.textContent = 'Drop or choose an image (PNG, JPG, WebP).';
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', () => handleFileSelection(fileInput.files));
    
    uploadBox.append(uploadLabel, fileInput);
    section.appendChild(uploadBox);
    
    const urlField = document.createElement('div');
    urlField.className = 'seas-field';
    
    const urlLabel = document.createElement('label');
    urlLabel.textContent = 'Image link';
    
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'https://example.com/art.png';
    
    const urlButton = document.createElement('button');
    urlButton.className = 'seas-button secondary';
    urlButton.type = 'button';
    urlButton.textContent = 'Load link';
    urlButton.addEventListener('click', () => {
      const value = urlInput.value.trim();
      if (value) {
        handleImageUrl(value);
      }
    });
    
    const urlRow = document.createElement('div');
    urlRow.style.display = 'grid';
    urlRow.style.gridTemplateColumns = '1fr auto';
    urlRow.style.gap = '10px';
    urlRow.append(urlInput, urlButton);
    
    const urlHint = document.createElement('small');
    urlHint.textContent = 'Images are scaled to 650px for crisp 1px strokes.';
    
    urlField.append(urlLabel, urlRow, urlHint);
    section.appendChild(urlField);
    
    const adjustSection = document.createElement('div');
    adjustSection.className = 'seas-field';
    
    const lightenLabel = document.createElement('label');
    lightenLabel.textContent = `Light boost (${state.config.lighten})`;
    
    const lightenRange = document.createElement('input');
    lightenRange.type = 'range';
    lightenRange.min = '-40';
    lightenRange.max = '60';
    lightenRange.step = '1';
    lightenRange.value = String(state.config.lighten);
    
    lightenRange.addEventListener('input', () => {
      const value = parseFloat(lightenRange.value);
      lightenLabel.textContent = `Light boost (${value})`;
      updateLightnessAndRebuild(value);
    });
    
    const lightenHint = document.createElement('small');
    lightenHint.textContent = 'Gently brighten or darken before tracing. 0 keeps the original light balance.';
    
    adjustSection.append(lightenLabel, lightenRange, lightenHint);
    section.appendChild(adjustSection);
    
    const infoSection = document.createElement('div');
    infoSection.className = 'seas-card';
    infoSection.style.marginTop = '20px';
    
    const infoTitle = document.createElement('h2');
    infoTitle.className = 'seas-card-title';
    infoTitle.textContent = 'Image info';
    
    const infoList = document.createElement('div');
    infoList.className = 'seas-stats-grid';
    infoList.dataset.role = 'image-info';
    infoList.textContent = 'Load an image to see stats.';
    
    infoSection.append(infoTitle, infoList);
    
    tab.append(section, infoSection);
  }

  function updateImageInfo() {
    const infoEl = state.tabs.get('image')?.querySelector('[data-role="image-info"]');
    if (!infoEl) return;
    
    if (!state.image) {
      infoEl.textContent = 'Load an image to see stats.';
      return;
    }
    
    const { width, height, label } = state.image;
    infoEl.innerHTML = `
      <div><strong>Source:</strong> ${label}</div>
      <div><strong>Preview size:</strong> ${width} × ${height} px</div>
      <div><strong>Pixels sampled:</strong> ${(width * height).toLocaleString()}</div>
      <div><strong>Stroke density:</strong> ${state.config.strokeDensity.toFixed(1)} px</div>
    `;
  }

  function buildPathTab(tab) {
    tab.innerHTML = '';
    
    const section = document.createElement('div');
    section.className = 'seas-card';
    
    const title = document.createElement('h2');
    title.className = 'seas-card-title';
    title.textContent = 'Path settings';
    section.appendChild(title);
    
    const densityField = createFieldNumber({
      label: 'Stroke density (px)',
      min: 1,
      max: 4,
      step: 0.1,
      get: () => state.config.strokeDensity,
      set: (value) => {
        state.config.strokeDensity = clamp(value, 1, 4);
      },
      description: '1px keeps maximum detail. Higher values speed up drawing at the cost of detail.',
    });
    
    section.appendChild(densityField);
    
    const toleranceField = createFieldRange({
      label: 'Color blend',
      min: 0,
      max: 64,
      step: 1,
      get: () => state.config.colorTolerance,
      set: (value) => {
        state.config.colorTolerance = Math.round(clamp(value, 0, 64));
      },
      description: 'Merge nearby colors to use fewer swatches. 0 keeps every distinct color.',
    });
    
    section.appendChild(toleranceField);
    
    const scanField = createFieldSelect({
      label: 'Scan style',
      options: [
        { value: 'smart', label: 'Auto balance' },
        { value: 'horizontal', label: 'Horizontal lines' },
        { value: 'vertical', label: 'Vertical lines' },
      ],
      get: () => state.config.scanMode,
      set: (value) => {
        state.config.scanMode = value;
      },
      description: 'Choose how the bot travels across your image.',
    });
    
    section.appendChild(scanField);
    
    const serpentineField = createFieldSelect({
      label: 'Line order',
      options: [
        { value: 'serpentine', label: 'Serpentine (faster)' },
        { value: 'restart', label: 'Reset every row' },
      ],
      get: () => (state.config.serpentine ? 'serpentine' : 'restart'),
      set: (value) => {
        state.config.serpentine = value === 'serpentine';
      },
      description: 'Serpentine lets lines continue back and forth to reduce travel time.',
    });
    
    section.appendChild(serpentineField);
    
    const statsSection = document.createElement('div');
    statsSection.className = 'seas-card';
    statsSection.style.marginTop = '20px';
    
    const statsTitle = document.createElement('h2');
    statsTitle.className = 'seas-card-title';
    statsTitle.textContent = 'Path summary';
    
    const statsList = document.createElement('div');
    statsList.className = 'seas-stats-grid';
    statsList.dataset.role = 'path-info';
    statsList.textContent = 'Build a preview to see commands.';
    
    statsSection.append(statsTitle, statsList);
    
    tab.append(section, statsSection);
  }

  function buildBotTab(tab) {
    tab.innerHTML = '';
    const bot = state.bot;
    
    const identitySection = document.createElement('div');
    identitySection.className = 'seas-card';
    
    const identityTitle = document.createElement('h2');
    identityTitle.className = 'seas-card-title';
    identityTitle.textContent = 'Bot identity & room';
    identitySection.appendChild(identityTitle);
    
    const nameField = document.createElement('div');
    nameField.className = 'seas-field';
    
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Bot nickname';
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'OmniDraw Bot';
    nameInput.value = bot?.name || 'OmniDraw Bot';
    
    nameInput.addEventListener('input', () => {
      if (!bot) return;
      bot.name = nameInput.value.trim() || 'OmniDraw Bot';
    });
    
    const nameHint = document.createElement('small');
    nameHint.textContent = 'Choose how the helper appears when it joins a room.';
    
    nameField.append(nameLabel, nameInput, nameHint);
    identitySection.appendChild(nameField);
    
    const inviteField = document.createElement('div');
    inviteField.className = 'seas-field';
    
    const inviteLabel = document.createElement('label');
    inviteLabel.textContent = 'Invite / room code';
    
    const inviteInput = document.createElement('input');
    inviteInput.type = 'text';
    inviteInput.placeholder = 'Leave blank for quick play';
    inviteInput.value = bot?.invite || '';
    
    inviteInput.addEventListener('input', () => {
      if (!bot) return;
      bot.invite = inviteInput.value.trim();
    });
    
    const inviteHint = document.createElement('small');
    inviteHint.textContent = 'Paste the Drawaria invite link or room id for your room. This bot will stay with you until you disconnect it.';
    
    inviteField.append(inviteLabel, inviteInput, inviteHint);
    identitySection.appendChild(inviteField);
    
    const buttonRow = document.createElement('div');
    buttonRow.className = 'seas-actions';
    
    const joinBtn = document.createElement('button');
    joinBtn.type = 'button';
    joinBtn.className = 'seas-button';
    joinBtn.textContent = 'Join room';
    joinBtn.addEventListener('click', () => {
      if (!bot) return;
      bot.name = nameInput.value.trim() || 'OmniDraw Bot';
      bot.invite = inviteInput.value.trim();
      bot.player.annonymize(bot.name);
      bot.room.join(bot.invite);
      updateBotDisplay();
      showToast('Bot joining room...');
    });
    
    const leaveBtn = document.createElement('button');
    leaveBtn.type = 'button';
    leaveBtn.className = 'seas-button secondary';
    leaveBtn.textContent = 'Disconnect';
    leaveBtn.addEventListener('click', () => {
      if (!bot) return;
      bot.room.leave();
      updateBotDisplay();
      showToast('Bot disconnected');
    });
    
    buttonRow.append(joinBtn, leaveBtn);
    identitySection.appendChild(buttonRow);
    
    const statusSection = document.createElement('div');
    statusSection.className = 'seas-card';
    statusSection.style.marginTop = '20px';
    
    const statusTitle = document.createElement('h2');
    statusTitle.className = 'seas-card-title';
    statusTitle.textContent = 'Bot status';
    
    const statusList = document.createElement('div');
    statusList.className = 'seas-stats-grid';
    state.ui.botStatus = statusList;
    
    statusSection.append(statusTitle, statusList);
    
    const scoutSection = document.createElement('div');
    scoutSection.className = 'seas-card';
    scoutSection.style.marginTop = '20px';
    
    const scoutTitle = document.createElement('h2');
    scoutTitle.className = 'seas-card-title';
    scoutTitle.textContent = 'Scout bots (optional)';
    
    const scoutNote = document.createElement('div');
    scoutNote.className = 'seas-note';
    scoutNote.textContent = 'Launch auxiliary bots that explore other rooms without moving your main bot. They can join private invites or empty public lobbies.';
    
    const scoutField = document.createElement('div');
    scoutField.className = 'seas-field';
    
    const scoutLabel = document.createElement('label');
    scoutLabel.textContent = 'Invites or room links';
    
    const scoutInput = document.createElement('textarea');
    scoutInput.placeholder = 'One invite per line. Leave a blank line to send a scout to a public lobby.';
    scoutInput.rows = 3;
    
    const scoutHint = document.createElement('small');
    scoutHint.textContent = 'Up to six scouts can run at once.';
    
    scoutField.append(scoutLabel, scoutInput, scoutHint);
    
    const scoutButtons = document.createElement('div');
    scoutButtons.className = 'seas-actions';
    
    const launchScouts = document.createElement('button');
    launchScouts.type = 'button';
    launchScouts.className = 'seas-button';
    launchScouts.textContent = 'Launch scouts';
    launchScouts.addEventListener('click', () => {
      if (state.fleet.length >= 6) {
        showToast('The scout fleet is full. Remove an existing scout before adding another.');
        return;
      }
      const lines = scoutInput.value.split(/\n+/);
      if (!lines.length) {
        lines.push('');
      }
      for (const raw of lines) {
        if (state.fleet.length >= 6) {
          break;
        }
        const invite = raw.trim();
        createScoutBot(invite, `Scout ${state.fleet.length + 1}`);
      }
      updateFleetDisplay();
      showToast(`Launched ${lines.length} scout(s)`);
    });
    
    const clearScoutsBtn = document.createElement('button');
    clearScoutsBtn.type = 'button';
    clearScoutsBtn.className = 'seas-button secondary';
    clearScoutsBtn.textContent = 'Clear scouts';
    clearScoutsBtn.addEventListener('click', () => {
      clearScoutBots();
      updateFleetDisplay();
      showToast('All scouts cleared');
    });
    
    scoutButtons.append(launchScouts, clearScoutsBtn);
    
    const scoutList = document.createElement('div');
    scoutList.className = 'seas-fleet';
    state.ui.fleetList = scoutList;
    
    scoutSection.append(scoutTitle, scoutNote, scoutField, scoutButtons, scoutList);
    
    tab.append(identitySection, statusSection, scoutSection);
    updateBotDisplay();
    updateFleetDisplay();
  }

  function updatePathInfo() {
    const infoEl = state.tabs.get('path')?.querySelector('[data-role="path-info"]');
    if (!infoEl) return;
    
    if (!state.commands) {
      infoEl.textContent = 'Build a preview to see commands.';
      return;
    }
    
    const uniqueColors = state.commands.groups.length;
    const totalSegments = state.commands.totalSegments;
    const microPause = Math.max(0, state.config.pointerStep);
    const perStrokeDelay = Math.max(0, state.config.strokeDelay) + microPause;
    const estimatedTime = ((totalSegments * perStrokeDelay + uniqueColors * state.config.colorDelay) / 1000).toFixed(1);
    
    infoEl.innerHTML = `
      <div><strong>Segments:</strong> ${totalSegments.toLocaleString()}</div>
      <div><strong>Colors detected:</strong> ${uniqueColors} / ${state.config.maxColors}</div>
      <div><strong>Estimated runtime:</strong> ~${estimatedTime}s</div>
      <div><strong>Preview mode:</strong> ${state.config.scanMode === 'smart' ? 'auto' : state.config.scanMode}</div>
    `;
  }

  function buildPlacementTab(tab) {
    tab.innerHTML = '';
    
    const section = document.createElement('div');
    section.className = 'seas-card';
    
    const title = document.createElement('h2');
    title.className = 'seas-card-title';
    title.textContent = 'Canvas placement';
    section.appendChild(title);
    
    const scaleField = createFieldRange({
      label: 'Scale',
      min: 0.25,
      max: 1.6,
      step: 0.05,
      unit: '×',
      get: () => state.config.scale,
      set: (value) => {
        state.config.scale = parseFloat(value.toFixed(2));
      },
      description: '1× uses the 650px resolution. Adjust to shrink or enlarge.',
      onChange: () => updatePlacementInfo(),
      formatValue: (value) => value.toFixed(2).replace(/\.00$/, ''),
    });
    
    section.appendChild(scaleField);
    
    const offsetXField = createFieldRange({
      label: 'Offset X',
      min: -400,
      max: 400,
      step: 1,
      unit: 'px',
      get: () => state.config.offsetX,
      set: (value) => {
        state.config.offsetX = Math.round(clamp(value, -400, 400));
      },
      description: 'Move left or right relative to the anchor point.',
      onChange: () => updatePlacementInfo(),
      formatValue: (value) => Math.round(value),
    });
    
    section.appendChild(offsetXField);
    
    const offsetYField = createFieldRange({
      label: 'Offset Y',
      min: -400,
      max: 400,
      step: 1,
      unit: 'px',
      get: () => state.config.offsetY,
      set: (value) => {
        state.config.offsetY = Math.round(clamp(value, -400, 400));
      },
      description: 'Move up or down relative to the anchor point.',
      onChange: () => updatePlacementInfo(),
      formatValue: (value) => Math.round(value),
    });
    
    section.appendChild(offsetYField);
    
    const alignField = createFieldSelect({
      label: 'Anchor',
      options: [
        { value: 'center', label: 'Center' },
        { value: 'top-left', label: 'Top left' },
        { value: 'top-right', label: 'Top right' },
        { value: 'bottom-left', label: 'Bottom left' },
        { value: 'bottom-right', label: 'Bottom right' },
      ],
      get: () => state.config.align,
      set: (value) => {
        state.config.align = value;
      },
      description: 'Choose which corner stays fixed while offsetting.',
      onChange: () => updatePlacementInfo(),
    });
    
    section.appendChild(alignField);
    
    const infoSection = document.createElement('div');
    infoSection.className = 'seas-card';
    infoSection.style.marginTop = '20px';
    
    const infoTitle = document.createElement('h2');
    infoTitle.className = 'seas-card-title';
    infoTitle.textContent = 'Placement summary';
    
    const infoList = document.createElement('div');
    infoList.className = 'seas-stats-grid';
    infoList.dataset.role = 'placement-info';
    infoList.textContent = 'Load an image to calculate placement.';
    
    infoSection.append(infoTitle, infoList);
    
    tab.append(section, infoSection);
  }

  function updatePlacementInfo() {
    const infoEl = state.tabs.get('placement')?.querySelector('[data-role="placement-info"]');
    if (!infoEl) return;
    
    if (!state.image) {
      infoEl.textContent = 'Load an image to calculate placement.';
      return;
    }
    
    const rect = state.canvas.getBoundingClientRect();
    const drawWidth = Math.round(state.image.width * state.config.scale);
    const drawHeight = Math.round(state.image.height * state.config.scale);
    const placement = computePlacement(rect);
    
    infoEl.innerHTML = `
      <div><strong>Board:</strong> ${Math.round(rect.width)} × ${Math.round(rect.height)} px</div>
      <div><strong>Drawing size:</strong> ${drawWidth} × ${drawHeight} px</div>
      <div><strong>Top-left:</strong> ${Math.round(placement.originX - rect.left)} px, ${Math.round(placement.originY - rect.top)} px</div>
      <div><strong>Anchor:</strong> ${state.config.align.replace('-', ' ')}</div>
    `;
  }

  function buildPreviewTab(tab) {
    tab.innerHTML = '';
    
    const previewSection = document.createElement('div');
    previewSection.className = 'seas-card';
    
    const previewTitle = document.createElement('h2');
    previewTitle.className = 'seas-card-title';
    previewTitle.textContent = 'Preview generator';
    previewSection.appendChild(previewTitle);
    
    const previewBox = document.createElement('div');
    previewBox.className = 'seas-preview-box';
    
    const canvasEl = document.createElement('canvas');
    canvasEl.width = 520;
    canvasEl.height = 520;
    const ctx = canvasEl.getContext('2d');
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    previewBox.appendChild(canvasEl);
    
    state.preview.canvas = canvasEl;
    state.preview.ctx = ctx;
    
    const controls = document.createElement('div');
    controls.className = 'seas-preview-controls';
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '0';
    slider.value = '0';
    slider.disabled = true;
    slider.style.width = '100%';
    
    slider.addEventListener('input', () => {
      const value = parseInt(slider.value, 10) || 0;
      state.preview.drawnSegments = value;
      stopPreviewPlayback(false);
      renderPreview(value);
      updatePreviewControls();
    });
    
    const buttonsRow = document.createElement('div');
    buttonsRow.style.display = 'flex';
    buttonsRow.style.gap = '10px';
    buttonsRow.style.width = '100%';
    
    const playBtn = document.createElement('button');
    playBtn.className = 'seas-button';
    playBtn.type = 'button';
    playBtn.textContent = 'Play preview';
    playBtn.addEventListener('click', () => startPreviewPlayback());
    
    const pauseBtn = document.createElement('button');
    pauseBtn.className = 'seas-button secondary';
    pauseBtn.type = 'button';
    pauseBtn.textContent = 'Pause';
    pauseBtn.addEventListener('click', () => {
      stopPreviewPlayback(false);
      updatePreviewControls();
    });
    
    const resetBtn = document.createElement('button');
    resetBtn.className = 'seas-button secondary';
    resetBtn.type = 'button';
    resetBtn.textContent = 'Reset';
    resetBtn.addEventListener('click', () => {
      stopPreviewPlayback(true);
      renderPreview(0);
      updatePreviewControls();
    });
    
    buttonsRow.append(playBtn, pauseBtn, resetBtn);
    controls.append(slider, buttonsRow);
    
    previewSection.append(previewBox, controls);
    
    state.ui.previewSlider = slider;
    state.ui.previewPlay = playBtn;
    state.ui.previewPause = pauseBtn;
    state.ui.previewReset = resetBtn;
    
    const timingSection = document.createElement('div');
    timingSection.className = 'seas-card';
    timingSection.style.marginTop = '20px';
    
    const timingTitle = document.createElement('h2');
    timingTitle.className = 'seas-card-title';
    timingTitle.textContent = 'Drawing rhythm';
    
    timingSection.appendChild(timingTitle);
    
    const strokeField = createFieldRange({
      label: 'Stroke pause',
      min: 0,
      max: 40,
      step: 1,
      unit: ' ms',
      get: () => state.config.strokeDelay,
      set: (value) => {
        state.config.strokeDelay = Math.round(clamp(value, 0, 40));
      },
      description: 'Pause after each line. 0 is fastest.',
      onChange: null,
      formatValue: (value) => Math.round(value),
    });
    
    timingSection.appendChild(strokeField);
    
    const colorField = createFieldNumber({
      label: 'Pause between colors (ms)',
      min: 0,
      max: 600,
      step: 10,
      get: () => state.config.colorDelay,
      set: (value) => {
        state.config.colorDelay = Math.round(clamp(value, 0, 600));
      },
      description: 'Wait after switching palettes to stay in sync.',
      onChange: null,
    });
    
    timingSection.appendChild(colorField);
    
    const pointerField = createFieldRange({
      label: 'Micro delay',
      min: 0,
      max: 20,
      step: 1,
      unit: ' ms',
      get: () => state.config.pointerStep,
      set: (value) => {
        state.config.pointerStep = Math.round(clamp(value, 0, 20));
      },
      description: 'Add a tiny pause after each stroke to keep the websocket stream silky smooth.',
      onChange: null,
      formatValue: (value) => Math.round(value),
    });
    
    timingSection.appendChild(pointerField);
    
    const durationField = createFieldRange({
      label: 'Preview length',
      min: 3,
      max: 20,
      step: 1,
      unit: ' s',
      get: () => state.config.previewDuration,
      set: (value) => {
        state.config.previewDuration = Math.round(clamp(value, 3, 20));
      },
      description: 'Time for the animation to reach 100%.',
      onChange: () => {
        if (state.preview.playing) {
          stopPreviewPlayback(false);
          startPreviewPlayback();
        }
      },
      formatValue: (value) => Math.round(value),
    });
    
    timingSection.appendChild(durationField);
    
    tab.append(previewSection, timingSection);
  }

  function updatePreviewControls() {
    const total = state.commands ? state.commands.totalSegments : 0;
    const slider = state.ui.previewSlider;
    
    if (slider) {
      slider.max = String(total || 0);
      slider.value = String(Math.min(state.preview.drawnSegments, total || 0));
      slider.disabled = !total;
    }
    
    if (state.ui.previewPlay) {
      state.ui.previewPlay.disabled = !total || state.preview.playing;
    }
    
    if (state.ui.previewPause) {
      state.ui.previewPause.disabled = !state.preview.playing;
    }
    
    if (state.ui.previewReset) {
      state.ui.previewReset.disabled = !total;
    }
  }

  function renderPreview(segmentCount) {
    const canvasEl = state.preview.canvas;
    const ctx = state.preview.ctx;
    
    if (!canvasEl || !ctx) return;
    
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    
    if (!state.commands || !state.image) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px ui-sans-serif, system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Load an image to preview the path.', canvasEl.width / 2, canvasEl.height / 2);
      state.preview.drawnSegments = 0;
      updatePreviewControls();
      return;
    }
    
    const total = state.commands.totalSegments;
    const limit = segmentCount === undefined || segmentCount === null ? total : Math.max(0, Math.min(total, segmentCount));
    state.preview.drawnSegments = limit;
    
    const scale = Math.min(canvasEl.width / state.image.width, canvasEl.height / state.image.height);
    const offsetX = (canvasEl.width - state.image.width * scale) / 2;
    const offsetY = (canvasEl.height - state.image.height * scale) / 2;
    
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    let drawn = 0;
    outer: for (const group of state.commands.groups) {
      ctx.strokeStyle = group.hex;
      for (const segment of group.segments) {
        if (drawn >= limit) break outer;
        ctx.beginPath();
        const startX = offsetX + (segment.x1 + 0.5) * scale;
        const startY = offsetY + (segment.y1 + 0.5) * scale;
        const endX = offsetX + (segment.x2 + 0.5) * scale;
        const endY = offsetY + (segment.y2 + 0.5) * scale;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        drawn += 1;
      }
    }
    
    updatePreviewControls();
  }

  function startPreviewPlayback() {
    if (!state.commands || state.preview.playing) {
      return;
    }
    
    const total = state.commands.totalSegments;
    if (!total) {
      return;
    }
    
    stopPreviewPlayback(true);
    state.preview.playing = true;
    updatePreviewControls();
    
    const duration = Math.max(1000, state.config.previewDuration * 1000);
    const start = performance.now();
    
    const step = (time) => {
      if (!state.preview.playing) {
        return;
      }
      
      const elapsed = time - start;
      const progress = Math.min(1, elapsed / duration);
      const target = Math.floor(total * progress);
      
      renderPreview(target);
      
      if (progress < 1) {
        state.preview.raf = requestAnimationFrame(step);
      } else {
        state.preview.playing = false;
        state.preview.raf = null;
        updatePreviewControls();
      }
    };
    
    state.preview.raf = requestAnimationFrame(step);
  }

  function stopPreviewPlayback(reset = false) {
    if (state.preview.raf) {
      cancelAnimationFrame(state.preview.raf);
      state.preview.raf = null;
    }
    
    if (state.preview.playing) {
      state.preview.playing = false;
    }
    
    if (reset) {
      state.preview.drawnSegments = 0;
    }
    
    updatePreviewControls();
  }

  function buildGuideTab(tab) {
    tab.innerHTML = '';
    
    const section = document.createElement('div');
    section.className = 'seas-card';
    
    const title = document.createElement('h2');
    title.className = 'seas-card-title';
    title.textContent = 'Quick guide';
    
    const list = document.createElement('div');
    list.className = 'seas-stats-grid';
    list.innerHTML = `
      <div>1. Load an image from your device or paste a direct link.</div>
      <div>2. Tweak path settings to balance speed and detail.</div>
      <div>3. Use the preview tab to watch the stroke order.</div>
      <div>4. Position the drawing with placement controls.</div>
      <div>5. Connect a bot from the Bot tab.</div>
      <div>6. Press "Start drawing" and let OmniDraw paint for you.</div>
    `;
    
    section.append(title, list);
    tab.append(section);
    
    const tipsSection = document.createElement('div');
    tipsSection.className = 'seas-card';
    tipsSection.style.marginTop = '20px';
    
    const tipsTitle = document.createElement('h2');
    tipsTitle.className = 'seas-card-title';
    tipsTitle.textContent = 'Tips & Tricks';
    
    const tipsList = document.createElement('div');
    tipsList.className = 'seas-stats-grid';
    tipsList.innerHTML = `
      <div><strong>Optimal images:</strong> Clear contrast works best. Simplify complex images.</div>
      <div><strong>Color reduction:</strong> Use "Color blend" to merge similar colors.</div>
      <div><strong>Scout bots:</strong> Monitor multiple rooms without moving your main bot.</div>
      <div><strong>Speed vs quality:</strong> Lower stroke density = faster but less detail.</div>
      <div><strong>Hotkey:</strong> Press ESC to stop drawing at any time.</div>
    `;
    
    tipsSection.append(tipsTitle, tipsList);
    tab.append(tipsSection);
  }

  function buildSettingsTab(tab) {
    tab.innerHTML = '';
    
    const section = document.createElement('div');
    section.className = 'seas-card';
    
    const title = document.createElement('h2');
    title.className = 'seas-card-title';
    title.textContent = 'UI Visual Tuning';
    
    section.appendChild(title);
    
    const motionControl = document.createElement('div');
    motionControl.className = 'seas-control';
    
    const motionLabel = document.createElement('label');
    motionLabel.htmlFor = 'seaMotion';
    motionLabel.textContent = 'Motion intensity';
    
    const motionInput = document.createElement('input');
    motionInput.type = 'range';
    motionInput.id = 'seaMotion';
    motionInput.min = '0.6';
    motionInput.max = '1.4';
    motionInput.step = '0.05';
    motionInput.value = state.seaUi.motion;
    
    const motionDesc = document.createElement('small');
    motionDesc.textContent = 'Adjust overall animation pacing and transitions.';
    
    motionControl.append(motionLabel, motionInput, motionDesc);
    section.appendChild(motionControl);
    
    motionInput.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      state.seaUi.motion = value;
      document.documentElement.style.setProperty('--motion', value);
    });
    
    const glowControl = document.createElement('div');
    glowControl.className = 'seas-control';
    
    const glowLabel = document.createElement('label');
    glowLabel.htmlFor = 'seaGlow';
    glowLabel.textContent = 'Glow richness';
    
    const glowInput = document.createElement('input');
    glowInput.type = 'range';
    glowInput.id = 'seaGlow';
    glowInput.min = '0';
    glowInput.max = '1';
    glowInput.step = '0.05';
    glowInput.value = state.seaUi.glow;
    
    const glowDesc = document.createElement('small');
    glowDesc.textContent = 'Increase highlights and elegant bloom without harsh neon.';
    
    glowControl.append(glowLabel, glowInput, glowDesc);
    section.appendChild(glowControl);
    
    glowInput.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      state.seaUi.glow = value;
      document.documentElement.style.setProperty('--glow', value);
    });
    
    const glassControl = document.createElement('div');
    glassControl.className = 'seas-control';
    
    const glassLabel = document.createElement('label');
    glassLabel.htmlFor = 'seaGlass';
    glassLabel.textContent = 'Glass depth';
    
    const glassInput = document.createElement('input');
    glassInput.type = 'range';
    glassInput.id = 'seaGlass';
    glassInput.min = '0';
    glassInput.max = '1';
    glassInput.step = '0.05';
    glassInput.value = state.seaUi.glass;
    
    const glassDesc = document.createElement('small');
    glassDesc.textContent = 'Controls blur depth for the frosted-glass look.';
    
    glassControl.append(glassLabel, glassInput, glassDesc);
    section.appendChild(glassControl);
    
    glassInput.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      state.seaUi.glass = value;
      document.documentElement.style.setProperty('--glass', value);
    });
    
    const waveControl = document.createElement('div');
    waveControl.className = 'seas-control';
    
    const waveLabel = document.createElement('label');
    waveLabel.htmlFor = 'seaWave';
    waveLabel.textContent = 'Background wave sheen';
    
    const waveInput = document.createElement('input');
    waveInput.type = 'range';
    waveInput.id = 'seaWave';
    waveInput.min = '0';
    waveInput.max = '1';
    waveInput.step = '0.05';
    waveInput.value = state.seaUi.wave;
    
    const waveDesc = document.createElement('small');
    waveDesc.textContent = 'Controls the ambient wave shimmer behind the panel.';
    
    waveControl.append(waveLabel, waveInput, waveDesc);
    section.appendChild(waveControl);
    
    waveInput.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      state.seaUi.wave = value;
      document.documentElement.style.setProperty('--wave', value);
    });
    
    const actionsSection = document.createElement('div');
    actionsSection.className = 'seas-card';
    actionsSection.style.marginTop = '20px';
    
    const actionsTitle = document.createElement('h2');
    actionsTitle.className = 'seas-card-title';
    actionsTitle.textContent = 'Quick Actions';
    
    const actionsDesc = document.createElement('div');
    actionsDesc.className = 'seas-note';
    actionsDesc.textContent = 'These are wired to real UI behavior.';
    actionsDesc.style.marginBottom = '16px';
    
    const actionsRow = document.createElement('div');
    actionsRow.style.display = 'flex';
    actionsRow.style.gap = '10px';
    actionsRow.style.flexWrap = 'wrap';
    
    const toastBtn = document.createElement('button');
    toastBtn.className = 'seas-pill';
    toastBtn.textContent = 'Show toast';
    toastBtn.addEventListener('click', () => showToast('Sea\'s UI ready!'));
    
    const jumpOverview = document.createElement('button');
    jumpOverview.className = 'seas-pill';
    jumpOverview.textContent = 'Go to Image tab';
    jumpOverview.addEventListener('click', () => setActiveTab('image'));
    
    const resetBtn = document.createElement('button');
    resetBtn.className = 'seas-pill';
    resetBtn.textContent = 'Reset UI settings';
    resetBtn.addEventListener('click', () => {
      state.seaUi = { motion: 1, glow: 0.55, glass: 0.75, wave: 0.55 };
      document.documentElement.style.setProperty('--motion', '1');
      document.documentElement.style.setProperty('--glow', '0.55');
      document.documentElement.style.setProperty('--glass', '0.75');
      document.documentElement.style.setProperty('--wave', '0.55');
      
      motionInput.value = '1';
      glowInput.value = '0.55';
      glassInput.value = '0.75';
      waveInput.value = '0.55';
      
      showToast('UI settings reset');
    });
    
    actionsRow.append(toastBtn, jumpOverview, resetBtn);
    actionsSection.append(actionsTitle, actionsDesc, actionsRow);
    
    tab.append(section, actionsSection);
  }

  function buildFooter() {
    const footer = document.createElement('div');
    footer.className = 'seas-card';
    footer.style.marginTop = '20px';
    
    const progressWrap = document.createElement('div');
    progressWrap.className = 'seas-progress';
    
    const progressText = document.createElement('span');
    progressText.textContent = 'Load an image to get started.';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'seas-progress-bar';
    
    const connectionStatus = document.createElement('small');
    connectionStatus.className = 'seas-conn';
    connectionStatus.textContent = 'Join a game room to enable the bot.';
    
    progressWrap.append(progressText, progressBar, connectionStatus);
    
    const actions = document.createElement('div');
    actions.className = 'seas-actions';
    
    const startBtn = document.createElement('button');
    startBtn.className = 'seas-button';
    startBtn.type = 'button';
    startBtn.textContent = 'Start drawing';
    startBtn.addEventListener('click', () => startDrawing());
    
    const stopBtn = document.createElement('button');
    stopBtn.className = 'seas-button secondary';
    stopBtn.type = 'button';
    stopBtn.textContent = 'Stop';
    stopBtn.disabled = true;
    stopBtn.addEventListener('click', () => stopDrawing());
    
    actions.append(startBtn, stopBtn);
    
    footer.append(progressWrap, actions);
    
    state.ui.progressText = progressText;
    state.ui.progressBar = progressBar;
    state.ui.startBtn = startBtn;
    state.ui.stopBtn = stopBtn;
    state.ui.connectionStatus = connectionStatus;
    
    return footer;
  }

  function updateProgressDisplay(message, ratio = null) {
    if (state.ui.progressText) {
      state.ui.progressText.textContent = message;
    }
    
    if (state.ui.progressBar) {
      const value = ratio === null ? 0 : Math.max(0, Math.min(1, ratio));
      state.ui.progressBar.style.setProperty('--progress', `${Math.round(value * 100)}%`);
    }
  }

  function updateActionButtons() {
    if (state.ui.startBtn) {
      const botReady = state.bot && state.bot.status === 'connected';
      state.ui.startBtn.disabled = state.drawing || !state.commands || !state.commands.totalSegments || !botReady;
    }
    
    if (state.ui.stopBtn) {
      state.ui.stopBtn.disabled = !state.drawing;
    }
  }

  function handleSettingsChange() {
    if (!state.image || state.drawing) {
      return;
    }
    
    if (state.rebuildTimer) {
      clearTimeout(state.rebuildTimer);
    }
    
    state.rebuildTimer = setTimeout(() => {
      state.rebuildTimer = null;
      buildCommands();
    }, 180);
  }

  function buildCommands() {
    if (!state.image || state.drawing) {
      return;
    }
    
    const { width, height } = state.image;
    const imageData = state.image.data;
    
    if (!imageData) {
      state.commands = null;
      updatePathInfo();
      updatePlacementInfo();
      updatePreviewControls();
      updateActionButtons();
      updateProgressDisplay('Load an image to get started.', 0);
      return;
    }
    
    const raw = imageData.data;
    const step = Math.max(1, Math.round(state.config.strokeDensity));
    const alphaThreshold = 24;
    const orientation = state.config.scanMode === 'smart'
      ? (width >= height ? 'horizontal' : 'vertical')
      : state.config.scanMode;
    
    const groups = new Map();
    const palette = [];
    const visited = new Uint8Array(width * height);
    
    const obtainGroup = (rgb) => {
      let closest = null;
      let closestDistance = Number.POSITIVE_INFINITY;
      
      for (const entry of palette) {
        const dist = colorDistance(rgb, entry.rgb);
        if (dist < closestDistance) {
          closestDistance = dist;
          closest = entry;
        }
        if (dist <= state.config.colorTolerance) {
          return groups.get(entry.key);
        }
      }
      
      if (palette.length >= state.config.maxColors && closest) {
        const existing = groups.get(closest.key);
        if (existing) {
          const samples = (existing.samples || 1) + 1;
          existing.samples = samples;
          existing.rgb = {
            r: Math.round(((existing.rgb?.r ?? rgb.r) * (samples - 1) + rgb.r) / samples),
            g: Math.round(((existing.rgb?.g ?? rgb.g) * (samples - 1) + rgb.g) / samples),
            b: Math.round(((existing.rgb?.b ?? rgb.b) * (samples - 1) + rgb.b) / samples),
          };
          existing.hex = rgbToHex(existing.rgb);
          closest.rgb = { ...existing.rgb };
          return existing;
        }
      }
      
      const key = `c${palette.length}`;
      const clone = { r: rgb.r, g: rgb.g, b: rgb.b };
      const group = {
        key,
        rgb: clone,
        hex: rgbToHex(clone),
        segments: [],
        pixelCount: 0,
        samples: 1,
      };
      
      palette.push({ key, rgb: clone });
      groups.set(key, group);
      return group;
    };
    
    const markSegment = (x1, y1, x2, y2) => {
      const clampPoint = (x, y) => {
        if (x < 0 || y < 0 || x >= width || y >= height) {
          return null;
        }
        return y * width + x;
      };
      
      if (x1 === x2) {
        const start = Math.min(y1, y2);
        const end = Math.max(y1, y2);
        for (let yy = start; yy <= end; yy++) {
          const idx = clampPoint(x1, yy);
          if (idx != null) {
            visited[idx] = 1;
          }
        }
        return;
      }
      
      if (y1 === y2) {
        const start = Math.min(x1, x2);
        const end = Math.max(x1, x2);
        for (let xx = start; xx <= end; xx++) {
          const idx = clampPoint(xx, y1);
          if (idx != null) {
            visited[idx] = 1;
          }
        }
        return;
      }
      
      const dx = x2 - x1;
      const dy = y2 - y1;
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      
      for (let i = 0; i <= steps; i++) {
        const t = steps === 0 ? 0 : i / steps;
        const xx = Math.round(x1 + dx * t);
        const yy = Math.round(y1 + dy * t);
        const idx = clampPoint(xx, yy);
        if (idx != null) {
          visited[idx] = 1;
        }
      }
    };
    
    const pushSegment = (group, x1, y1, x2, y2) => {
      if (!group) return;
      const length = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1)));
      group.segments.push({ x1, y1, x2, y2 });
      group.pixelCount += length;
      group.samples = (group.samples || 0) + length;
      markSegment(Math.round(x1), Math.round(y1), Math.round(x2), Math.round(y2));
    };
    
    if (orientation === 'vertical') {
      for (let col = 0; col < width; col += step) {
        const x = Math.min(width - 1, col);
        const serp = state.config.serpentine && ((Math.floor(col / step) % 2) === 1);
        let runGroup = null;
        let startY = null;
        let endY = null;
        
        if (!serp) {
          for (let y = 0; y < height; y++) {
            const idx = (y * width + x) * 4;
            if (idx >= raw.length) break;
            const alpha = raw[idx + 3];
            if (alpha < alphaThreshold) {
              if (runGroup) {
                pushSegment(runGroup, x, startY, x, endY);
                runGroup = null;
              }
              continue;
            }
            const rgb = { r: raw[idx], g: raw[idx + 1], b: raw[idx + 2] };
            const group = obtainGroup(rgb);
            if (runGroup !== group) {
              if (runGroup) {
                pushSegment(runGroup, x, startY, x, endY);
              }
              runGroup = group;
              startY = y;
              endY = y;
            } else {
              endY = y;
            }
          }
        } else {
          for (let y = height - 1; y >= 0; y--) {
            const idx = (y * width + x) * 4;
            if (idx >= raw.length) break;
            const alpha = raw[idx + 3];
            if (alpha < alphaThreshold) {
              if (runGroup) {
                pushSegment(runGroup, x, startY, x, endY);
                runGroup = null;
              }
              continue;
            }
            const rgb = { r: raw[idx], g: raw[idx + 1], b: raw[idx + 2] };
            const group = obtainGroup(rgb);
            if (runGroup !== group) {
              if (runGroup) {
                pushSegment(runGroup, x, startY, x, endY);
              }
              runGroup = group;
              startY = y;
              endY = y;
            } else {
              startY = y;
            }
          }
        }
        
        if (runGroup) {
          pushSegment(runGroup, x, startY, x, endY);
        }
      }
    } else {
      for (let row = 0; row < height; row += step) {
        const y = Math.min(height - 1, row);
        const serp = state.config.serpentine && ((Math.floor(row / step) % 2) === 1);
        let runGroup = null;
        let startX = null;
        let endX = null;
        
        if (!serp) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            if (idx >= raw.length) break;
            const alpha = raw[idx + 3];
            if (alpha < alphaThreshold) {
              if (runGroup) {
                pushSegment(runGroup, startX, y, endX, y);
                runGroup = null;
              }
              continue;
            }
            const rgb = { r: raw[idx], g: raw[idx + 1], b: raw[idx + 2] };
            const group = obtainGroup(rgb);
            if (runGroup !== group) {
              if (runGroup) {
                pushSegment(runGroup, startX, y, endX, y);
              }
              runGroup = group;
              startX = x;
              endX = x;
            } else {
              endX = x;
            }
          }
        } else {
          for (let x = width - 1; x >= 0; x--) {
            const idx = (y * width + x) * 4;
            if (idx >= raw.length) break;
            const alpha = raw[idx + 3];
            if (alpha < alphaThreshold) {
              if (runGroup) {
                pushSegment(runGroup, startX, y, endX, y);
                runGroup = null;
              }
              continue;
            }
            const rgb = { r: raw[idx], g: raw[idx + 1], b: raw[idx + 2] };
            const group = obtainGroup(rgb);
            if (runGroup !== group) {
              if (runGroup) {
                pushSegment(runGroup, startX, y, endX, y);
              }
              runGroup = group;
              startX = x;
              endX = x;
            } else {
              startX = x;
            }
          }
        }
        
        if (runGroup) {
          pushSegment(runGroup, startX, y, endX, y);
        }
      }
    }
    
    const fillTolerance = Math.max(4, state.config.colorTolerance * 1.5);
    
    const fillHorizontalGaps = () => {
      for (let y = 0; y < height; y++) {
        let x = 0;
        while (x < width) {
          const idx = (y * width + x) * 4;
          if (idx >= raw.length) break;
          if (raw[idx + 3] < alphaThreshold || visited[y * width + x]) {
            x++;
            continue;
          }
          const baseRgb = { r: raw[idx], g: raw[idx + 1], b: raw[idx + 2] };
          const group = obtainGroup(baseRgb);
          let startX = x;
          let endX = x;
          let avgR = baseRgb.r;
          let avgG = baseRgb.g;
          let avgB = baseRgb.b;
          let count = 1;
          
          while (endX + 1 < width) {
            const nextIdx = (y * width + (endX + 1)) * 4;
            if (nextIdx >= raw.length) break;
            if (raw[nextIdx + 3] < alphaThreshold) break;
            if (visited[y * width + endX + 1]) break;
            const nextRgb = { r: raw[nextIdx], g: raw[nextIdx + 1], b: raw[nextIdx + 2] };
            const diff = colorDistance(nextRgb, { r: avgR, g: avgG, b: avgB });
            if (diff > fillTolerance) {
              break;
            }
            endX += 1;
            count += 1;
            avgR = (avgR * (count - 1) + nextRgb.r) / count;
            avgG = (avgG * (count - 1) + nextRgb.g) / count;
            avgB = (avgB * (count - 1) + nextRgb.b) / count;
          }
          
          if (endX === startX) {
            if (startX + 1 < width && raw[(y * width + startX + 1) * 4 + 3] >= alphaThreshold) {
              endX = startX + 1;
            } else if (startX > 0 && raw[(y * width + startX - 1) * 4 + 3] >= alphaThreshold) {
              startX = startX - 1;
            }
          }
          
          pushSegment(group, startX, y, endX, y);
          x = endX + 1;
        }
      }
    };
    
    const fillVerticalGaps = () => {
      for (let x = 0; x < width; x++) {
        let y = 0;
        while (y < height) {
          const idx = (y * width + x) * 4;
          if (idx >= raw.length) break;
          if (raw[idx + 3] < alphaThreshold || visited[y * width + x]) {
            y++;
            continue;
          }
          const baseRgb = { r: raw[idx], g: raw[idx + 1], b: raw[idx + 2] };
          const group = obtainGroup(baseRgb);
          let startY = y;
          let endY = y;
          let avgR = baseRgb.r;
          let avgG = baseRgb.g;
          let avgB = baseRgb.b;
          let count = 1;
          
          while (endY + 1 < height) {
            const nextIdx = ((endY + 1) * width + x) * 4;
            if (nextIdx >= raw.length) break;
            if (raw[nextIdx + 3] < alphaThreshold) break;
            if (visited[(endY + 1) * width + x]) break;
            const nextRgb = { r: raw[nextIdx], g: raw[nextIdx + 1], b: raw[nextIdx + 2] };
            const diff = colorDistance(nextRgb, { r: avgR, g: avgG, b: avgB });
            if (diff > fillTolerance) {
              break;
            }
            endY += 1;
            count += 1;
            avgR = (avgR * (count - 1) + nextRgb.r) / count;
            avgG = (avgG * (count - 1) + nextRgb.g) / count;
            avgB = (avgB * (count - 1) + nextRgb.b) / count;
          }
          
          if (endY === startY) {
            if (startY + 1 < height && raw[((startY + 1) * width + x) * 4 + 3] >= alphaThreshold) {
              endY = startY + 1;
            } else if (startY > 0 && raw[((startY - 1) * width + x) * 4 + 3] >= alphaThreshold) {
              startY = startY - 1;
            }
          }
          
          pushSegment(group, x, startY, x, endY);
          y = endY + 1;
        }
      }
    };
    
    fillHorizontalGaps();
    fillVerticalGaps();
    
    const groupsArray = Array.from(groups.values()).filter((group) => group.segments.length > 0);
    groupsArray.sort((a, b) => b.pixelCount - a.pixelCount);
    const totalSegments = groupsArray.reduce((sum, group) => sum + group.segments.length, 0);
    
    state.commands = {
      groups: groupsArray,
      totalSegments,
      width,
      height,
    };
    
    state.progress = { segments: 0, total: totalSegments };
    state.preview.drawnSegments = Math.min(state.preview.drawnSegments, totalSegments);
    
    updatePathInfo();
    updatePlacementInfo();
    updatePreviewControls();
    updateActionButtons();
    updateProgressDisplay(totalSegments ? `Ready. ${totalSegments.toLocaleString()} strokes queued.` : 'Image ready but nothing to draw.', 0);
    renderPreview(state.preview.drawnSegments);
  }

  function computePlacement(rect) {
    if (!state.image) {
      return { originX: rect.left, originY: rect.top, scale: state.config.scale };
    }
    
    const scale = state.config.scale;
    const drawWidth = state.image.width * scale;
    const drawHeight = state.image.height * scale;
    
    let originX = rect.left;
    let originY = rect.top;
    
    switch (state.config.align) {
      case 'top-left':
        originX = rect.left;
        originY = rect.top;
        break;
      case 'top-right':
        originX = rect.right - drawWidth;
        originY = rect.top;
        break;
      case 'bottom-left':
        originX = rect.left;
        originY = rect.bottom - drawHeight;
        break;
      case 'bottom-right':
        originX = rect.right - drawWidth;
        originY = rect.bottom - drawHeight;
        break;
      default:
        originX = rect.left + (rect.width - drawWidth) / 2;
        originY = rect.top + (rect.height - drawHeight) / 2;
        break;
    }
    
    originX += state.config.offsetX;
    originY += state.config.offsetY;
    return { originX, originY, scale };
  }

  async function startDrawing() {
    if (state.drawing) return;
    
    if (!state.commands || !state.commands.totalSegments) {
      showToast('Load an image and build the preview before drawing.');
      return;
    }
    
    if (!state.bot || state.bot.status !== 'connected') {
      showToast('Connect the OmniDraw bot from the Bot tab before drawing.');
      return;
    }
    
    const socket = getActiveSocket();
    if (!socket) {
      updateConnectionStatus();
      showToast('Join a drawing room first so OmniDraw can stream commands through the bot connection.');
      return;
    }
    
    const ready = await waitForSocketReady(socket);
    if (!ready) {
      updateConnectionStatus();
      showToast('The Drawaria connection is still starting. Try again in a moment.');
      return;
    }
    
    stopPreviewPlayback(false);
    state.abort = false;
    state.drawing = true;
    updateActionButtons();
    
    const total = state.commands.totalSegments;
    state.progress = { segments: 0, total };
    updateProgressDisplay('Streaming strokes to the bot…', 0);
    
    const rect = state.canvas.getBoundingClientRect();
    const placement = computePlacement(rect);
    const thickness = Math.max(0.5, state.config.strokeDensity);
    
    try {
      for (const group of state.commands.groups) {
        if (state.abort) break;
        
        const ok = await ensureColor(group.hex);
        if (!ok) {
          console.warn('OmniDraw: unable to activate palette color', group.hex);
        }
        
        await delay(Math.max(0, state.config.colorDelay));
        
        for (const segment of group.segments) {
          if (state.abort) break;
          
          if (socket.readyState !== WebSocket.OPEN) {
            throw new Error('Connection closed while drawing.');
          }
          
          const normalized = normalizeSegmentForBoard(segment, placement, rect);
          if (!normalized) {
            continue;
          }
          
          sendDrawCommand(socket, normalized, group.hex, thickness);
          state.progress.segments += 1;
          
          const ratio = total ? state.progress.segments / total : 0;
          updateProgressDisplay(`Drawing... ${state.progress.segments}/${total} strokes`, ratio);
          renderPreview(state.progress.segments);
          
          const microPause = Math.max(0, state.config.pointerStep);
          const totalDelay = Math.max(0, state.config.strokeDelay) + microPause;
          
          if (totalDelay > 0) {
            await delay(totalDelay);
          }
        }
      }
      
      if (state.abort) {
        const ratio = total ? state.progress.segments / total : 0;
        updateProgressDisplay(`Stopped at ${state.progress.segments}/${total} strokes`, ratio);
        showToast('Drawing stopped');
      } else {
        updateProgressDisplay('Completed! Ready for another run.', 1);
        showToast('Drawing completed successfully!');
      }
    } catch (err) {
      console.error('OmniDraw drawing error', err);
      const ratio = total ? state.progress.segments / total : 0;
      updateProgressDisplay('Error: ' + err.message, ratio);
      showToast('Drawing failed: ' + err.message);
    } finally {
      await restoreInitialColor();
      state.drawing = false;
      state.abort = false;
      updateActionButtons();
      updateConnectionStatus();
    }
  }

  function stopDrawing() {
    if (!state.drawing) {
      return;
    }
    
    state.abort = true;
    const ratio = state.progress.total ? state.progress.segments / state.progress.total : 0;
    updateProgressDisplay('Stopping...', ratio);
    showToast('Stopping drawing...');
  }

  function showToast(message) {
    let toast = document.querySelector('.seas-toast');
    
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'seas-toast';
      document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  function setupRippleEffects() {
    function ripple(e) {
      const b = e.currentTarget;
      const r = b.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      
      b.style.setProperty('--rx', `${x}px`);
      b.style.setProperty('--ry', `${y}px`);
      b.classList.remove('seas-rippling');
      
      b.offsetHeight; // reflow
      b.classList.add('seas-rippling');
    }
    
    document.addEventListener('pointerdown', (e) => {
      if (e.target.closest('[data-ripple]')) {
        ripple(e);
      }
    });
  }

  async function destroy() {
    try {
      stopPreviewPlayback(false);
      state.abort = true;
      
      if (state.keyHandler) {
        window.removeEventListener('keydown', state.keyHandler);
        state.keyHandler = null;
      }
      
      if (state.bot?.room) {
        try {
          state.bot.room.leave();
        } catch (err) {
          console.debug('OmniDraw bot leave error', err);
        }
      }
      
      clearScoutBots();
      await restoreInitialColor();
      
      if (state.style && state.style.parentNode) {
        state.style.parentNode.removeChild(state.style);
      }
      
      if (state.root && state.root.parentNode) {
        state.root.parentNode.removeChild(state.root);
      }
      
      state.ui.connectionStatus = null;
      state.ui.botStatus = null;
      state.ui.fleetList = null;
    } finally {
      window.__drawariaOmniDraw = undefined;
      window.__drawariaOmniBot = undefined;
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      stopDrawing();
    }
  }

  function createPanel() {
    const panel = document.createElement('div');
    panel.className = 'seas-panel';
    
    const topTint = document.createElement('div');
    topTint.className = 'seas-panel-top-tint';
    panel.appendChild(topTint);
    
    const panelInner = document.createElement('div');
    panelInner.className = 'seas-panel-inner';
    
    const header = createHeader();
    panelInner.appendChild(header);
    
    const tabs = createTabs();
    panelInner.appendChild(tabs);
    
    const content = document.createElement('div');
    content.className = 'seas-content';
    
    // Create tab panels
    const tabIds = ['image', 'path', 'bot', 'placement', 'preview', 'guide', 'settings'];
    
    tabIds.forEach((id) => {
      const tabPanel = document.createElement('div');
      tabPanel.className = 'seas-tab-panel';
      tabPanel.id = `tab-${id}`;
      tabPanel.setAttribute('role', 'tabpanel');
      tabPanel.setAttribute('aria-labelledby', `t-${id}`);
      
      if (id === state.activeTab) {
        tabPanel.classList.add('active');
      }
      
      content.appendChild(tabPanel);
      state.tabs.set(id, tabPanel);
    });
    
    panelInner.appendChild(content);
    
    const footer = buildFooter();
    panelInner.appendChild(footer);
    
    panel.appendChild(panelInner);
    
    // Build tab content
    buildImageTab(state.tabs.get('image'));
    buildPathTab(state.tabs.get('path'));
    buildBotTab(state.tabs.get('bot'));
    buildPlacementTab(state.tabs.get('placement'));
    buildPreviewTab(state.tabs.get('preview'));
    buildGuideTab(state.tabs.get('guide'));
    buildSettingsTab(state.tabs.get('settings'));
    
    return panel;
  }

  // Initialize Sea's UI
injectStyles();
createRoot();

showToast('If you get bad quality, your device is probably ass.');

state.panel = createPanel();
state.root.appendChild(state.panel);

  
  // Setup ripple effects
  setupRippleEffects();
  
  // Initialize UI
  updateConnectionStatus();
  updateImageInfo();
  updatePathInfo();
  updatePlacementInfo();
  updatePreviewControls();
  updateActionButtons();
  updateProgressDisplay('Load an image to get started.', 0);
  renderPreview(0);
  
  // Set initial ink position
  setTimeout(() => {
    const activeBtn = document.querySelector(`#t-${state.activeTab}`);
    const ink = document.getElementById('seasTabInk');
    if (activeBtn && ink) {
      const tabs = activeBtn.closest('.seas-tabs');
      const br = activeBtn.getBoundingClientRect();
      const tr = tabs.getBoundingClientRect();
      const left = br.left - tr.left + tabs.scrollLeft;
      ink.style.width = `${Math.max(56, br.width - 18)}px`;
      ink.style.transform = `translate3d(${left + 9}px,0,0)`;
    }
  }, 100);
  
  state.keyHandler = handleKeydown;
  window.addEventListener('keydown', state.keyHandler);
  
  window.__drawariaOmniDraw = {
    destroy,
    start: startDrawing,
    stop: stopDrawing,
    preview: startPreviewPlayback,
    showToast,
  };
  
  console.info('%cOmniDraw Studio with Sea\'s UI ready', 'color:#2563eb;font-weight:bold;', 'Load an image to begin.');
})();