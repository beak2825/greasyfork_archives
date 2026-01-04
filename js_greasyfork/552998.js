// ==UserScript==
// @name          7Placer+
// @namespace     https://i.imgur.com/n084VLd.png
// @version       1.5.1b
// @description   Pixel place.io bot - an advanced bot that includes image botting, painting, and account management features. (Border drawing feature added)
// @author        Azti & SamaelWired
// @match         https://pixelplace.io/*
// @require       https://update.greasyfork.org/scripts/552983/1679786/HACKTIMER%20v1.js
// @require       https://pixelplace.io/js/jquery.min.js?v2=1
// @require       https://pixelplace.io/js/jquery-ui.min.js?v2=1
// @grant         none
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/552998/1679779/7Placer%2B%20USER.js
// @updateURL https://update.greasyfork.org/scripts/552988/1679787/7Placer%2B%20META.js
// ==/UserScript==

(function() {
  "use strict";

  /* =======================================================================
     Canvas Worker - Marks ocean areas (approx #CCCCCC) as -1 when scanning canvas
  ========================================================================== */
  const cloadercode = `
    const canvasworkerTimet = performance.now();
    const colors = [
      0xFFFFFF, 0xC4C4C4, 0x888888, 0x555555, 0x222222, 0x000000, 0x006600, 0x22B14C,
      0x02BE01, 0x51E119, 0x94E044, 0xFBFF5B, 0xE5D900, 0xE6BE0C, 0xE59500, 0xA06A42,s
      0x99530D, 0x633C1F, 0x6B0000, 0x9F0000, 0xE50000, 0xFF3904, 0xBB4F00, 0xFF755F,
      0xFFC49F, 0xFFDFCC, 0xFFA7D1, 0xCF6EE4, 0xEC08EC, 0x820080, 0x5100FF, 0x020763,
      0x0000EA, 0x044BFF, 0x6583CF, 0x36BAFF, 0x0083C7, 0x00D3DD, 0x45FFC8, 0x003638,
      0x477050, 0x98FB98, 0xFF7000, 0xCE2939, 0xFF416A, 0x7D26CD, 0x330077, 0x005BA1,
      0xB5E8EE, 0x1B7400, 0x75CEA9, 0x34EB6B, 0xFFCC00, 0xBB276C, 0xFF7EBB, 0x440414,
      0x591C91, 0xC1A162, 0xCAFF70, 0x013182, 0xA6A6A6, 0x6F6F6F, 0x3A3A3A, 0x4D082C
    ];
    const oceanHex = 0xCCCCCC;
    function isOceanColor(colornum) {
      const r1 = (colornum >> 16) & 0xFF,
            g1 = (colornum >> 8) & 0xFF,
            b1 = colornum & 0xFF;
      const r2 = (oceanHex >> 16) & 0xFF,
            g2 = (oceanHex >> 8) & 0xFF,
            b2 = oceanHex & 0xFF;
      const dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
      // Consider it ocean if the sum of squares of differences is less than 100
      return (dr*dr + dg*dg + db*db) < 100;
    }
    self.addEventListener('message', async (event) => {
      const imageResponse = await fetch('https://pixelplace.io/canvas/' + event.data + '.png?t200000=' + Date.now());
      const imageBlob = await imageResponse.blob();
      const imageBitmap = await createImageBitmap(imageBlob);
      const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelData = imageData.data;
      const CanvasArray = Array.from({ length: canvas.width }, () => Array.from({ length: canvas.height }, () => 50));
      for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
              const pixelIndex = (y * canvas.width + x) * 4;
              const a = pixelData[pixelIndex + 3];
              if (a < 1) { continue; }
              const r = pixelData[pixelIndex];
              const g = pixelData[pixelIndex + 1];
              const b = pixelData[pixelIndex + 2];
              const colornum = (r << 16) | (g << 8) | b;
              if (isOceanColor(colornum)) {
                  CanvasArray[x][y] = -1;
                  continue;
              }
              const colorIndex = colors.indexOf(colornum);
              CanvasArray[x][y] = colorIndex;
          }
      }
      self.postMessage(CanvasArray);
      const canvasworkerendTime = performance.now();
      var processingTime = canvasworkerendTime - canvasworkerTimet;
      self.postMessage(processingTime);
    });
  `;
  const cloaderblob = new Blob([cloadercode], { type: 'application/javascript' });
  const canvasworker = new Worker(URL.createObjectURL(cloaderblob));

  function loadcanvas(canvas) {
    canvasworker.onmessage = function(event) {
      if (Array.isArray(event.data)) {
          canvas.CanvasArray = event.data;
      } else {
          console.log("[7placer] Processing took: " + Math.round(event.data) + "ms");
      }
    };
    canvasworker.postMessage(canvas_Canvas.ID);
  }

  /* =======================================================================
     Style Settings - Tracker, Drop Area and Canvas Preview
  ========================================================================== */
  const trackercss = {
      top: '0px',
      left: '0px',
      borderColor: 'rgb(138,43,226)',
      color: 'rgb(138,43,226)',
      backgroundColor: 'black',
      opacity: '60%',
      display: 'none',
      transition: 'all 0.06s ease-in-out',
      pointerEvents: 'none'
  };

  const drop = {
      width: 'calc(100% - 2em)',
      height: 'calc(100% - 2em)',
      position: 'fixed',
      left: '0px',
      top: '0px',
      backgroundColor: 'rgba(0, 0, 0, 0.533)',
      zIndex: '9999',
      display: 'flex',
      color: 'white',
      fontSize: '48pt',
      justifyContent: 'center',
      alignItems: 'center',
      border: '3px white dashed',
      borderRadius: '18px',
      margin: '1em'
  };

  const canvascss = {
      position: 'absolute',
      pointerEvents: 'none',
      left: '0px',
      top: '0px',
      imageRendering: 'pixelated',
      opacity: '50%',
      animation: 'blink 3s ease-out infinite'
  };

  const blink = document.createElement("style");
  blink.type = "text/css";
  blink.innerText = `
    @keyframes blink {
      0% { opacity: .30; }
      50% { opacity: .10; }
      100% { opacity: .30; }
    }
  `;
  document.head.appendChild(blink);

  /* =======================================================================
     Canvas Class
  ========================================================================== */
  class Canvas {
      constructor() {
          Canvas.ID = this.ParseID();
          Canvas.isProcessed = false;
          loadcanvas(this);
          Canvas.customCanvas = this.createPreviewCanvas();
      }
      ParseID() {
          return parseInt(window.location.href.split("/").slice(-1)[0].split("-")[0]);
      }
      static get instance() {
          if (!Canvas._instance)
              Canvas._instance = new Canvas();
          return Canvas._instance;
      }
      set CanvasArray(array) {
          this._CanvasArray = array;
          Canvas.isProcessed = true;
      }
      get CanvasArray() {
          return this._CanvasArray;
      }
      getColor(x, y) {
          try {
              return this._CanvasArray[x][y];
          } catch(e) {
              return 99;
          }
      }
      updatePixel(x, y, color) {
          if (!Canvas.isProcessed)
              return;
          this.CanvasArray[x][y] = color;
      }
      createPreviewCanvas() {
          const canvas = $(`<canvas width="3000" height="3000">`).css(canvascss);
          $('#canvas').ready(function () {
              $('#painting-move').append(canvas);
          });
          const ctx = canvas[0].getContext("2d");
          return ctx;
      }
  }
  const canvas_Canvas = Canvas;

  /* =======================================================================
     Palive and Time Functions
  ========================================================================== */
  function randomString(charList, num) {
      return Array.from({ length: num }, () => charList.charAt(Math.floor(Math.random() * charList.length))).join('');
  }
  function randomString1(num) {
      const charList = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return randomString(charList, num);
  }
  function randomString2(num) {
      const charList = 'gmbonjklezcfxta1234567890GMBONJKLEZCFXTA';
      return randomString(charList, num);
  }
  function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const paliveCharmap = {
      "0": "g",
      "1": "n",
      "2": "b",
      "3": "r",
      "4": "z",
      "5": "s",
      "6": "l",
      "7": "x",
      "8": "i",
      "9": "o"
  };
  function getPalive(serverTime, userId) {
      const tDelay = getTDelay(serverTime);
      const sequenceLengths = [6, 5, 9, 4, 5, 3, 6, 6, 3];
      const currentTimestamp = Math.floor(Date.now() / 1000) + tDelay - 5400;
      const timestampString = currentTimestamp.toString();
      const timestampCharacters = timestampString.split('');
      let result = '';
      for (let i = 0; i < sequenceLengths.length; i++) {
          const sequenceNumber = sequenceLengths[i];
          result += randInt(0, 1) == 1 ? randomString2(sequenceNumber) : randomString1(sequenceNumber);
          const letter = paliveCharmap[parseInt(timestampCharacters[i])];
          result += randInt(0, 1) == 0 ? letter.toUpperCase() : letter;
      }
      result += userId.toString().substring(0, 1) + (randInt(0, 1) == 1 ? randomString2(randInt(4, 20)) : randomString1(randInt(4, 25)));
      return result + "0=";
  }
  function getTDelay(serverTime) {
      const currentTime = new Date().getTime() / 1e3;
      return Math.floor(serverTime - currentTime);
  }

  /* =======================================================================
     Auth and API Functions
  ========================================================================== */
  class Auth {
      constructor(authObj) {
          this.authKey = authObj.authKey;
          this.authId = authObj.authId;
          this.authToken = authObj.authToken;
      }
  }
  function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2)
          return parts.pop().split(';').shift();
  }
  async function getPainting(authId, authKey, authToken) {
      const originalAuthId = getCookie('authId');
      const originalAuthKey = getCookie('authKey');
      const originalAuthToken = getCookie('authToken');
      document.cookie = `authId=${authId}; path=/`;
      document.cookie = `authKey=${authKey}; path=/`;
      document.cookie = `authToken=${authToken}; path=/`;
      try {
          const response = await fetch(`https://pixelplace.io/api/get-painting.php?id=${canvas_Canvas.ID}&connected=1`, {
              headers: { 'Accept': 'application/json, text/javascript, */*; q=0.01' },
              credentials: 'include'
          });
          const json = response.json();
          return json;
      } finally {
          document.cookie = `authId=${originalAuthId}; path=/`;
          document.cookie = `authKey=${originalAuthKey}; path=/`;
          document.cookie = `authToken=${originalAuthToken}; path=/`;
      }
  }

  /* =======================================================================
     Account Management and Command Functions
  ========================================================================== */
  const window2 = window;
  var LocalAccounts = new Map();
  function storagePush() {
      const obj = Object.fromEntries(LocalAccounts);
      localStorage.setItem('LocalAccounts', JSON.stringify(obj));
  }
  function storageGet() {
      const storedAccounts = localStorage.getItem('LocalAccounts');
      if (storedAccounts) {
          const parsedAccounts = JSON.parse(storedAccounts);
          LocalAccounts = new Map(Object.entries(parsedAccounts));
      } else {
          LocalAccounts = new Map();
      }
  }
  async function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
  function saveAuth(username, authId, authKey, authToken, print = true) {
      if (!authId || !authKey || !authToken) {
          console.log('[7p] saveAuth usage: saveAuth(username, authId, authKey, authToken)');
          return;
      }
      const account = { authId, authKey, authToken };
      LocalAccounts.set(username, account);
      storagePush();
      if (print)
          console.log('Auth saved. Saved list: ', LocalAccounts);
  }
  async function getAuth(print = true) {
      const cookieStore = window2.cookieStore;
      const authToken = await cookieStore.get("authToken");
      const authKey = await cookieStore.get("authKey");
      const authId = await cookieStore.get("authId");
      if (authToken == null || authKey == null || authId == null) {
          console.log('[7p] Please login first!');
          return;
      }
      if (print)
          console.log(`authId = "${authId.value}", authKey = "${authKey.value}", authToken = "${authToken.value}"`);
      return { authToken: authToken.value, authKey: authKey.value, authId: authId.value };
  }
  async function saveAccount() {
      storageGet();
      const AuthObj = await getAuth(false);
      const userinfo = await getPainting(AuthObj.authId, AuthObj.authKey, AuthObj.authToken);
      saveAuth(userinfo.user.name, AuthObj.authId, AuthObj.authKey, AuthObj.authToken, false);
      console.log('Auth saved. Saved list: ', LocalAccounts);
  }
  function getAccounts() {
      storageGet();
      if (!LocalAccounts || LocalAccounts.size == 0) {
          console.log('No accounts found');
          return;
      }
      console.log(`Found ${LocalAccounts.size} accounts`);
      console.log(LocalAccounts);
  }
  function deleteAccount(identifier) {
      if (identifier == null) {
          console.log('deleteAccount usage: deleteAccount(user or index)');
          return;
      }
      storageGet();
      if (typeof identifier == 'string') {
          if (identifier == 'all') {
              LocalAccounts.forEach((value, key) => {
                  LocalAccounts.delete(key);
              });
              return;
          }
          if (!LocalAccounts.has(identifier)) {
              console.log(`[7p] Error deleting: No account with name ${identifier}`);
              return;
          }
          LocalAccounts.delete(identifier);
          console.log(`[7p] Deleted account ${identifier}.`);
          console.log(LocalAccounts);
      }
      if (typeof identifier == 'number') {
          const keys = Array.from(LocalAccounts.keys());
          if (identifier > keys.length) {
              console.log(`[7p] Error deleting: No account with index ${identifier}`);
              return;
          }
          LocalAccounts.delete(keys[identifier]);
          console.log(`Deleted account ${identifier}`);
          console.log(LocalAccounts);
      }
      storagePush();
  }
  async function connect(username) {
      storageGet();
      const account = LocalAccounts.get(username);
      const connectedbot = window2.seven.bots.find((bot) =>
          bot.generalinfo && bot.generalinfo.user && bot.generalinfo.user.name == username
      );
      if (!username) {
          console.log('[7p] Missing bot username, connect("username")');
          return;
      }
      if (username == 'all') {
          for (const [username, account] of LocalAccounts) {
              const connectedbot = window2.seven.bots.find((bot) =>
                  bot.generalinfo && bot.generalinfo.user && bot.generalinfo.user.name == username
              );
              const auth = new Auth(account);
              if (connectedbot) {
                  console.log(`[7p] Account ${username} is already connected.`);
                  continue;
              }
              new WSBot(auth, username);
              await delay(500);
          }
          return;
      }
      if (!account) {
          console.log(`[7p] No account found with username ${username}`);
          return;
      }
      if (connectedbot) {
          console.log(`[7p] Account ${username} is already connected.`);
          return;
      }
      const auth = new Auth(account);
      new WSBot(auth, username);
  }
  function disconnect(username) {
      const bot = window2.seven.bots.find((bot) =>
          bot.generalinfo && bot.generalinfo.user && bot.generalinfo.user.name == username
      );
      if (!username) {
          console.log('[7p] disconnect requires a username, disconnect("username")');
          return;
      }
      if (username == 'all') {
          if (window2.seven.bots.length == 1) {
              console.log('[7p] No bots connected.');
              return;
          }
          for (const bot of window2.seven.bots) {
              closeBot(bot);
          }
          return;
      }
      if (!bot) {
          console.log(`[7p] No bot connected with username ${username}`);
          return;
      }
      closeBot(bot);
  }

  /* =======================================================================
     Global Variables
  ========================================================================== */
  const variables = window.seven = {
      bots: [],
      pixelspeed: 19,
      queue: [],
      inprogress: false,
      protect: false,
      tickspeed: 15,
      order: 'fromCenter',
      saveAuth: saveAuth,
      getAuth: getAuth,
      saveAccount: saveAccount,
      getAccounts: getAccounts,
      deleteAccount: deleteAccount,
      connect: connect,
      disconnect: disconnect
  };

  /* =======================================================================
     WebSocket and Message Handling
  ========================================================================== */
  function onClientMessage(event) {
      const msg = event.data;
      const bot = Client.instance;
      if (msg.startsWith("42")) {
          const msgData = JSON.parse(event.data.substr(2));
          const type = msgData[0];
          switch (type) {
              case "p":
                  for (const pixel of msgData[1]) {
                      const canvas = canvas_Canvas.instance;
                      const x = pixel[0];
                      const y = pixel[1];
                      const color = pixel[2];
                      canvas.updatePixel(x, y, color);
                  }
                  break;
              case "canvas":
                  for (const pixel of msgData[1]) {
                      const canvas = canvas_Canvas.instance;
                      const x = pixel[0];
                      const y = pixel[1];
                      const color = pixel[2];
                      canvas.updatePixel(x, y, color);
                  }
                  break;
          }
      }
  }
  async function onBotMessage(event, bot) {
      const message = event.data;
      if (message.startsWith("42")) {
          const msgData = JSON.parse(event.data.substr(2));
          const type = msgData[0];
          const botid = bot.generalinfo.user.id;
          const botname = bot.username;
          switch (type) {
              case "server_time":
                  bot.paliveServerTime = msgData[1];
                  break;
              case "ping.alive":
                  const hash = getPalive(bot.paliveServerTime, botid);
                  console.log('[7p]', botname, ': pong =', hash, botid);
                  bot.emit('pong.alive', `"` + hash + `"`);
                  break;
              case "throw.error":
                  if (msgData[1] == 49) {
                      console.log(`[7p] [Bot ${botname}] Error (${msgData[1]}): This auth is not valid! Deleting account from saved accounts...`);
                      deleteAccount(botname);
                      closeBot(bot);
                      return;
                  }
                  console.log(`[7p] [Bot ${botname}] Pixelplace WS error: ${msgData[1]}`);
                  break;
              case "canvas":
                  console.log(`[7p] Successfully connected to bot ${bot.username}`);
                  variables.bots.push(bot);
                  break;
          }
      }
      if (message.startsWith("0"))
          bot.ws.send('40');
      if (message.startsWith("40"))
          bot.ws.send(`42["init",{"authKey":"${bot.auth.authKey}","authToken":"${bot.auth.authToken}","authId":"${bot.auth.authId}","boardId":${canvas_Canvas.ID}}]`);
      if (message.startsWith("2"))
          bot.ws.send('3');
  }
  const customWS = window.WebSocket;
  window.WebSocket = function(url, protocols) {
      const client = new Client();
      const socket = new customWS(url, protocols);
      socket.addEventListener("message", (event) => { onClientMessage(event); });
      client.ws = socket;
      return socket;
  };
  async function hookBot(bot) {
      console.log(`[7p] Attempting to connect account ${bot.username}`);
      const socket = new customWS("wss://pixelplace.io/socket.io/?EIO=4&transport=websocket");
      socket.addEventListener("message", (event) => { onBotMessage(event, bot); });
      socket.addEventListener("close", () => { Bot.botIndex -= 1; });
      return socket;
  }
  function closeBot(bot) {
      if (bot instanceof Client)
          return;
      if (!bot) {
          console.log('[7placer] Cannot close bot that doesn\'t exist.');
          return;
      }
      bot.ws.close();
      const result = variables.bots.filter((checkedBot) => checkedBot.botid != bot.botid);
      variables.bots = result;
      console.log('[7placer] Ended bot ', bot.botid);
  }

  /* =======================================================================
     Bot Classes – Bot, WSBot and Client
  ========================================================================== */
  class Bot {
      constructor() {
          this.trackeriters = 0;
          this.lastplace = Date.now();
          this.botid = Bot.botIndex;
          Bot.botIndex += 1;
      }
      emit(event, params) {
          this.ws.send(`42["${event}",${params}]`);
      }
      async placePixel(x, y, color, client = false, tracker = true) {
          var tick = 0;
          while (true) {
              const canvas = canvas_Canvas.instance;
              const canvascolor = canvas.getColor(x, y);
              if (canvascolor == color || canvascolor == -1)
                  return true;
              if (Date.now() - this.lastplace >= variables.pixelspeed) {
                  this.emit('p', `[${x},${y},${color},1]`);
                  this.lastplace = Date.now();
                  canvas.updatePixel(x, y, color);
                  if (tracker && this.trackeriters >= 6) {
                      $(this.tracker).css({ top: y, left: x, display: 'block' });
                      this.trackeriters = 0;
                  }
                  this.trackeriters += 1;
                  return true;
              }
              tick += 1;
              if (tick == variables.tickspeed) {
                  tick = 0;
                  await new Promise(resolve => setTimeout(resolve, 0));
              }
          }
      }
      static async findAvailableBot() {
          const bots = variables.bots;
          var tick = 0;
          while (true) {
              for (var i = 0; i < bots.length; i++) {
                  const bot = bots[i];
                  if (Date.now() - bot.lastplace >= variables.pixelspeed) {
                      return bot;
                  }
              }
              tick += 1;
              if (tick == variables.tickspeed) {
                  tick = 0;
                  await new Promise(resolve => setTimeout(resolve, 0));
              }
          }
      }
      createTracker() {
          const tracker = $('<div class="track" id="bottracker">').text(`[7P] ${this.username}`).css(trackercss);
          $('#canvas').ready(function () {
              $('#painting-move').append(tracker);
          });
          return tracker;
      }
      set ws(wss) {
          this._ws = wss;
      }
      get ws() {
          return this._ws;
      }
  }
  Bot.botIndex = 0;
  class WSBot extends Bot {
      constructor(auth, username) {
          super();
          if (!username || !auth) {
              console.error("[7p ERROR]: 'auth' and 'username' should both be provided.");
              return;
          }
          this._auth = auth;
          this.username = username;
          this.startBot();
      }
      async startBot() {
          this.generalinfo = await getPainting(this.auth.authId, this.auth.authKey, this.auth.authToken);
          this.tracker = this.createTracker();
          this.ws = await hookBot(this);
      }
      get auth() {
          return this._auth;
      }
  }
  class Client extends Bot {
      constructor() {
          super();
          this.username = 'Client';
          Client.instance = this;
          this.tracker = this.createTracker();
          variables.bots.push(this);
      }
      static get Client() {
          return Client.instance;
      }
  }

  /* =======================================================================
     Queue Functions (Processing queued pixels and checking canvas state)
  ========================================================================== */
  class Queue {
      constructor() { }
      static add(x, y, color) {
          variables.queue.push({ x: x, y: y, color: color });
      }
      static clear() {
          variables.queue = [];
      }
      static restart() {
          variables.inprogress = false;
          console.log('[7p] Queue restarted - will re-process all pixels from beginning');
          setTimeout(() => {
              if (variables.queue.length > 0) {
                  variables.inprogress = true;
                  SevenQueue.start();
              }
          }, 100);
      }
      static async start() {
          if (!canvas_Canvas.isProcessed) {
              console.log('[7p] Error starting queue: Canvas has not been processed yet.');
              Queue.stop();
              return;
          }
          await Queue.sort();
          var pos = 0;
          var tick = 0;
          variables.inprogress = true;
          while (variables.inprogress == true && variables.queue.length > 0) {
              const pixel = variables.queue[pos];
              const currentColor = canvas_Canvas.instance.getColor(pixel.x, pixel.y);
              if (currentColor === pixel.color || currentColor === -1) {
                  pos++;
                  if (pos >= variables.queue.length) {
                      if (variables.protect)
                          pos = 0;
                      else {
                          Queue.stop();
                          break;
                      }
                  }
                  continue;
              }
              const bot = await Bot.findAvailableBot();
              await bot.placePixel(pixel.x, pixel.y, pixel.color);
              pos++;
              if (!variables.protect && pos == variables.queue.length) {
                  Queue.stop();
                  break;
              } else if (variables.protect && pos == variables.queue.length) {
                  pos = 0;
              }
              await new Promise(resolve => setTimeout(resolve, 0));
              if (tick >= variables.tickspeed) {
                  tick = 0;
                  await new Promise(resolve => setTimeout(resolve, 0));
              }
              tick += 1;
          }
      }
      static async sort() {
          const array = variables.queue;
          switch (variables.order) {
              case 'rand':
                  array.sort(() => Math.random() - 0.5);
                  break;
              case 'colors':
                  array.sort((a, b) => a.color - b.color);
                  break;
              case 'vertical':
                  array.sort((a, b) => a.x - b.x);
                  break;
              case 'horizontal':
                  array.sort((a, b) => a.y - b.y);
                  break;
              default:
              case 'circle':
                  const CX = Math.floor((array[0].x + array[array.length - 1].x) / 2);
                  const CY = Math.floor((array[0].y + array[array.length - 1].y) / 2);
                  array.sort((a, b) => {
                      const distanceA = Math.sqrt((a.x - CX) ** 2 + (a.y - CY) ** 2);
                      const distanceB = Math.sqrt((b.x - CX) ** 2 + (b.y - CY) ** 2);
                      return distanceA - distanceB;
                  });
                  break;
          }
      }
      static stop() {
          variables.inprogress = false;
          canvas_Canvas.customCanvas.clearRect(0, 0, 3000, 3000);
          Queue.clear();
      }
  }
  const SevenQueue = Queue;

  /* =======================================================================
     Image Processing Tools
  ========================================================================== */
  const colors = [
      0xFFFFFF, 0xC4C4C4, 0x888888, 0x555555, 0x222222, 0x000000, 0x006600, 0x22B14C,
      0x02BE01, 0x51E119, 0x94E044, 0xFBFF5B, 0xE5D900, 0xE6BE0C, 0xE59500, 0xA06A42,
      0x99530D, 0x633C1F, 0x6B0000, 0x9F0000, 0xE50000, 0xFF3904, 0xBB4F00, 0xFF755F,
      0xFFC49F, 0xFFDFCC, 0xFFA7D1, 0xCF6EE4, 0xEC08EC, 0x820080, 0x5100FF, 0x020763,
      0x0000EA, 0x044BFF, 0x6583CF, 0x36BAFF, 0x0083C7, 0x00D3DD, 0x45FFC8, 0x003638,
      0x477050, 0x98FB98, 0xFF7000, 0xCE2939, 0xFF416A, 0x7D26CD, 0x330077, 0x005BA1,
      0xB5E8EE, 0x1B7400, 0x75CEA9, 0x34EB6B, 0xFFCC00, 0xBB276C, 0xFF7EBB, 0x440414,
      0x591C91, 0xC1A162, 0xCAFF70, 0x013182, 0xA6A6A6, 0x6F6F6F, 0x3A3A3A, 0x4D082C
    ];
  function getColorDistance(c1, c2) {
      const r1 = (c1 >> 16) & 0xFF;
      const g1 = (c1 >> 8) & 0xFF;
      const b1 = c1 & 0xFF;
      const r2 = (c2 >> 16) & 0xFF;
      const g2 = (c2 >> 8) & 0xFF;
      const b2 = c2 & 0xFF;
      return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
  }
  function findClosestColor(color) {
      let minDistance = Infinity;
      let colorNumber;
      let index = 0;
      for (const pxpColor of colors) {
          const distance = getColorDistance(color, pxpColor);
          if (distance < minDistance) {
              minDistance = distance;
              colorNumber = index;
          }
          index += 1;
      }
      return colorNumber;
  }
  function previewCanvasImage(x, y, image) {
      const ctx = canvas_Canvas.customCanvas;
      const img = new Image();
      img.onload = function () {
          ctx.drawImage(img, x, y);
      };
      img.src = URL.createObjectURL(image);
  }
  async function ImageToPixels(image) {
      const result = [];
      const canvas = new OffscreenCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, image.width, image.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelData = imageData.data;
      for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
              const pixelIndex = (y * canvas.width + x) * 4;
              const r = pixelData[pixelIndex];
              const g = pixelData[pixelIndex + 1];
              const b = pixelData[pixelIndex + 2];
              const a = pixelData[pixelIndex + 3];
              const colornum = (r << 16) | (g << 8) | b;
              if (a < 1) { continue; }
              const color = findClosestColor(colornum);
              result.push({ x, y, color });
          }
      }
      return result;
  }
  async function botImage(x, y, image) {
      const bitmap = await createImageBitmap(image);
      const processed = await ImageToPixels(bitmap);
      previewCanvasImage(x, y, image);
      processed.forEach((pixel) => SevenQueue.add(pixel.x + x, pixel.y + y, pixel.color));
      SevenQueue.start();
  }

  /* =======================================================================
     Square Creation Function
  ========================================================================== */
  function BotSquare(x1, y1, x2, y2, color) {
      if (x2 < x1) [x1, x2] = [x2, x1];
      if (y2 < y1) [y1, y2] = [y2, y1];
      for (let x = x1; x <= x2; x++) {
          for (let y = y1; y <= y2; y++) {
              SevenQueue.add(x, y, color);
          }
      }
      SevenQueue.start();
  }

  /* =======================================================================
     Cursor and Selected Color Information
  ========================================================================== */
  function getClientMouse() {
      const coordinates = $('#coordinates').text();
      const [x, y] = coordinates.split(',').map(coord => parseInt(coord.trim()));
      const selectedcolor = $('#palette-buttons a.selected').data('id');
      return [x, y, selectedcolor];
  }

  /* =======================================================================
     Image Botting – Drop Area
  ========================================================================== */
  function createDropArea() {
      const dropobject = $('<div>').text('Drop Image').css(drop);
      const [x, y] = getClientMouse();
      $('body').append(dropobject);
      dropobject.on("click", function () {
          dropobject.remove();
      });
      dropobject.on("drop", async function (event) {
          event.preventDefault();
          event.stopPropagation();
          const image = event.originalEvent.dataTransfer.files[0];
          dropobject.remove();
          await botImage(x, y, image);
      }).on('dragover', false);
  }

  /* =======================================================================
     Keyboard Shortcuts
     Alt+W: Stop queue
     Alt+B: Create drop area
     Alt+X: Draw square from two points
     Alt+Y: Draw border (1 pixel) around area with ocean and canvas boundaries
     Alt+C: Restart queue (re-process all pixels from beginning)
  ========================================================================== */
  var coord1 = null;
  var borderCoord1 = null;
  $(document).on('keyup', function (event) {
      if ($(':input[type="text"]').is(':focus'))
          return;
      switch (event.which) {
          case 87: // Alt+W
              if (!event.altKey) return;
              SevenQueue.stop();
              break;
          case 66: // Alt+B
              if (!event.altKey) return;
              createDropArea();
              break;
          case 67: // Alt+C - Restart queue
              if (!event.altKey) return;
              SevenQueue.restart();
              break;
          case 88: // Alt+X: Draw square
              {
                  const [x, y, color] = getClientMouse();
                  if (coord1 == null) {
                      coord1 = { x: x, y: y };
                      return;
                  }
                  BotSquare(coord1.x, coord1.y, x, y, color);
                  coord1 = null;
              }
              break;
          case 89: // Alt+Y: Draw border
              if (!event.altKey) return;
              {
                  const [xB, yB, selectedColor] = getClientMouse();
                  if (borderCoord1 == null) {
                      borderCoord1 = { x: xB, y: yB };
                      return;
                  }
                  // Second point selected, define rectangle area
                  let xMin = Math.min(borderCoord1.x, xB);
                  let xMax = Math.max(borderCoord1.x, xB);
                  let yMin = Math.min(borderCoord1.y, yB);
                  let yMax = Math.max(borderCoord1.y, yB);

                  const canvasInstance = canvas_Canvas.instance;
                  // Check each pixel in the selected area:
                  for (let i = xMin; i <= xMax; i++) {
                      for (let j = yMin; j <= yMax; j++) {
                          // If pixel is not ocean (paintable canvas area)
                          if (canvasInstance.getColor(i, j) !== -1) {
                              let isBorder = false;
                              // Check 4 directional neighbors:
                              if (i - 1 >= 0 && canvasInstance.getColor(i - 1, j) === -1) isBorder = true;
                              if (i + 1 < canvasInstance._CanvasArray.length && canvasInstance.getColor(i + 1, j) === -1) isBorder = true;
                              if (j - 1 >= 0 && canvasInstance.getColor(i, j - 1) === -1) isBorder = true;
                              if (j + 1 < canvasInstance._CanvasArray[0].length && canvasInstance.getColor(i, j + 1) === -1) isBorder = true;

                              // If border pixel, add to queue (1 pixel border)
                              if (isBorder) {
                                  SevenQueue.add(i, j, selectedColor);
                              }
                          }
                      }
                  }
                  SevenQueue.start();
                  borderCoord1 = null;
              }
              break;
      }
  });

  console.log('7Placer Loaded! Version: 1.5.1b - Fixed Alt+C restart');
})();