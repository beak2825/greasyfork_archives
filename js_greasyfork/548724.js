// ==UserScript==
// @name                YouTube Music / Spotify 网易云歌词显示
// @name:zh-TW          YouTube Music / Spotify 歌詞外掛
// @version             0.28
// @description         为 YTM 和 Spotify 添加网易云歌词 (带有翻译或者罗马音显示）
// @description:zh-TW   為 YTM 和 Spotify 新增網易雲歌詞，並支援翻譯或羅馬拼音顯示
// @author              Hyun
// @license             MIT
// @match               *://music.youtube.com/*
// @match               *://open.spotify.com/*
// @icon                https://music.163.com/favicon.ico
// @connect             interface.music.163.com
// @grant               GM.xmlHttpRequest
// @grant               GM.getValue
// @grant               GM.setValue
// @grant               GM.addElement
// @grant               unsafeWindow
// @require             https://fastly.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js
// @require             https://fastly.jsdelivr.net/npm/wanakana@5.3.1/wanakana.min.js
// @run-at              document-end
// @inject-into         content
// @namespace           https://greasyfork.org/users/718868
// @downloadURL https://update.greasyfork.org/scripts/548724/YouTube%20Music%20%20Spotify%20%E7%BD%91%E6%98%93%E4%BA%91%E6%AD%8C%E8%AF%8D%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/548724/YouTube%20Music%20%20Spotify%20%E7%BD%91%E6%98%93%E4%BA%91%E6%AD%8C%E8%AF%8D%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

const EAPI_AES_KEY = 'e82ckenh8dichen8';
const EAPI_ENCODE_KEY = '3go8&$8*3*3h0k(2)2';
const EAPI_CHECK_TOKEN = '9ca17ae2e6ffcda170e2e6ee8ad85dba908ca4d74da9ac8ea2d44e938f9eadc66da5a8979af572a5a9b68ac12af0feaec3b92aa69af9b1d372f6b8adccb35e968b9bb6c14f908d0099fb6ff48efdacd361f5b6ee9e';
const EAPI_BASE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) NeteaseMusicDesktop/3.0.14.2534',
};
const EAPI_BASE_COOKIES = {
  "os": "osx",
  "appver": "3.0.14",
  "requestId": 0,
  "osver": "15.6.1",
};

// Setup Trusted Types policy
window.trustedTypes && window.trustedTypes.createPolicy('default', {
  createScriptURL: s => s,
  createScript: s => s,
  createHTML: s => s
});

// A simple cookie jar using GM storage
class CookieJar {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }

  async get(url) {
    const allCookies = await GM.getValue(this.storageKey, {});
    const now = Date.now();
    const { hostname, pathname } = new URL(url);
    const matchingCookies = [];
    let needsSave = false;

    for (const domain in allCookies) {
      if (!hostname.endsWith(domain)) continue;
      const domainJar = allCookies[domain];
      for (const path in domainJar) {
        if (!pathname.startsWith(path)) continue;
        const pathJar = domainJar[path];
        for (const name in pathJar) {
          const cookie = pathJar[name];
          if (cookie.expires && cookie.expires < now) {
            delete pathJar[name];
            needsSave = true;
          } else {
            matchingCookies.push(`${name}=${cookie.value}`);
          }
        }
        if (Object.keys(pathJar).length === 0) delete domainJar[path];
      }
      if (Object.keys(domainJar).length === 0) delete allCookies[domain];
    }

    if (needsSave) await GM.setValue(this.storageKey, allCookies);
    return matchingCookies.join('; ');
  }

  async set(url, setCookieHeader) {
    if (!setCookieHeader) return;
    const allCookies = await GM.getValue(this.storageKey, {});
    const { hostname } = new URL(url);

    const parts = setCookieHeader.split(';').map(p => p.trim());
    const [name, value] = parts[0].split('=').map(s => s.trim());
    if (!name) return;

    const cookie = { value };
    let domain = hostname;
    let path = '/';

    parts.slice(1).forEach(part => {
      let [key, val] = part.split('=').map(s => s.trim());
      switch (key.toLowerCase()) {
        case 'expires': cookie.expires = new Date(val).getTime(); break;
        case 'max-age': cookie.expires = Date.now() + (parseInt(val, 10) * 1000); break;
        case 'path': path = val; break;
        case 'domain': domain = val.startsWith('.') ? val.substring(1) : val; break;
      }
    });

    allCookies[domain] = allCookies[domain] || {};
    allCookies[domain][path] = allCookies[domain][path] || {};
    allCookies[domain][path][name] = cookie;

    await GM.setValue(this.storageKey, allCookies);
  }
}
const cookieJar = new CookieJar('lyrics.eapi.cookies');

// Netease Cloud Music API (EAPI)
const eapi = (path, options={}) => new Promise(async (resolve, reject) => {
  const { data = {}, headers = {}, header = {}, cookies = {}, params = {} } = options;
  Object.assign(header,  EAPI_BASE_COOKIES);
  Object.assign(headers, EAPI_BASE_HEADERS);
  Object.assign(cookies, EAPI_BASE_COOKIES);

  const queryStr = new URLSearchParams(params).toString();
  const url = `https://interface.music.163.com/eapi${path}${queryStr ? `?${queryStr}` : ''}`;
  const storedCookies = await cookieJar.get(url);
  if (storedCookies) {
    storedCookies.split('; ').forEach(c => {
      const [k, v] = c.split('=', 2);
      if (k) cookies[k] = v;
    });
  }

  data.header = JSON.stringify(header);
  const body = JSON.stringify(data);
  const sign = CryptoJS.MD5(`nobody/api${path}use${body}md5forencrypt`).toString();

  GM.xmlHttpRequest({
    url,
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ')
    },
    data: `params=${encodeURIComponent(
      CryptoJS.AES.encrypt(
        `/api${path}-36cd479b6b5-${body}-36cd479b6b5-${sign}`,
        CryptoJS.enc.Utf8.parse(EAPI_AES_KEY),
        { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
      ).toString(CryptoJS.format.Hex).toUpperCase())
    }`,
    responseType: 'json',
    anonymous: true,
    onerror: reject,
    ontimeout: reject,
    onload: async (response) => {
      if (response.responseHeaders) {
        const setCookieHeaders = response.responseHeaders.split('\r\n')
          .filter(h => h.toLowerCase().startsWith('set-cookie:'))
          .map(h => h.substring(h.indexOf(':') + 1).trim());

        for (const header of setCookieHeaders) {
          const cookieStrings = header.split(/,(?=\s*[^=;\s]+=)/);
          for (const cookieStr of cookieStrings) {
            if (cookieStr) await cookieJar.set(url, cookieStr.trim());
          }
        }
      }

      if (response.status >= 200 && response.status < 300) {
        const res = response.response;
        if (res.code !== 200) {
          reject(new Error(res.message));
          return;
        }
        resolve(res);
      } else {
        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
      }
    }
  })
});

const cloudmusic = {
  register: (deviceId) => {
    const encode = (some_id) => {
      let xoredString = '';
      for (let i = 0; i < some_id.length; i++) {
        const charCode = some_id.charCodeAt(i) ^ EAPI_ENCODE_KEY.charCodeAt(i % EAPI_ENCODE_KEY.length);
        xoredString += String.fromCharCode(charCode);
      }
      const wordArray = CryptoJS.enc.Utf8.parse(xoredString);
      return btoa(`${some_id} ${CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Base64)}`);
    }

    return eapi('/register/anonimous', {
      data: {
        username: encode(deviceId),
      },
      params: {
        '_nmclfl': '1'
      }
    });
  },
  search: (keyword, limit = 10) => eapi('/search/song/list/page', {
    data: {
      offset: '0',
      scene: 'NORMAL',
      needCorrect: 'true',
      checkToken: EAPI_CHECK_TOKEN,
      keyword,
      limit: limit.toString(),
      verifyId: 1
    },
    headers: {
      'X-Anticheattoken': EAPI_CHECK_TOKEN
    },
    params: {
      '_nmclfl': '1'
    }
  }),
  lyric: (id) => eapi('/song/lyric/v1', {
    data: {
      id, tv: "-1", yv: "-1", rv: "-1", lv: "-1",
      verifyId: 1
    },
    params: {
      '_nmclfl': '1'
    }
  })
}

// Floating Lyrics UI
const lyricsUI = {
  update(lyricsData) {},
  show() {},
  hide() {},
  tick(currentTimeMs) {},
  updateSources(sources) {},
  updateFeatures(features) {},
  onSourceSelect(id) {},
  onOffsetChange(newOffsetMs) {},
};

async function injectUI() {
  const panelHTML = `
    <div id="lyric-float" aria-label="Floating lyrics panel" style="display: none;">
      <div class="drag-handle" id="lyric-dragHandle" title="Drag to move • Right-click or long-press for options">
        <svg class="handle-dots-svg" width="14" height="4" viewBox="0 0 14 4" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="2" cy="2" r="2" fill="white"/>
          <circle cx="7" cy="2" r="2" fill="white"/>
          <circle cx="12" cy="2" r="2" fill="white"/>
        </svg>
        <span class="brand">Floating Lyrics</span>
        <button id="lyric-closeBtn" class="close-btn" aria-label="Close lyrics panel" title="Close"></button>
      </div>
      <div class="lyrics-scroll">
        <div class="fade-top"></div>
        <div class="list" id="lyric-list"></div>
        <div class="fade-bottom"></div>
      </div>
      <div class="line-menu" id="lyric-lineMenu" role="menu" aria-hidden="true">
        <button type="button" class="line-menu-item" data-action="copy" aria-label="Copy line">
          <span>Copy line</span>
        </button>
        <button type="button" class="line-menu-item" data-action="jump" aria-label="Jump to line">
          <span>Jump to line</span>
        </button>
      </div>
      <div class="resize-handle" id="lyric-resizeHandle"></div>
    </div>
  `;

  const menuHTML = `
    <div class="ctx-menu" id="lyric-menu" role="menu" aria-hidden="true">
      <div class="menu-title">Settings</div>
      <div class="menu-group">
        <div class="menu-row">
          <div class="menu-label">Display</div>
          <div class="mode-wrap" id="lyric-modeWrap">
            <label class="radio"><input type="radio" name="mode" value="orig">Original only</label>
            <label class="radio"><input type="radio" name="mode" value="orig+trans">Original + Translation</label>
            <label class="radio"><input type="radio" name="mode" value="orig+roma">Original + Romanized</label>
          </div>
        </div>
      </div>
      <div class="menu-group">
        <div class="menu-row">
          <div class="menu-label">Source</div>
          <select id="lyric-sourceSelect"></select>
        </div>
      </div>
      <div class="menu-group">
        <div class="menu-row">
          <div class="menu-label">Font size</div>
          <button class="btn small" id="lyric-fontMinus">–</button>
          <input class="slider" id="lyric-fontSlider" type="range" min="16" max="64" step="1">
          <button class="btn small" id="lyric-fontPlus">+</button>
          <div class="value" id="lyric-fontValue">28px</div>
        </div>
      </div>
      <div class="menu-group">
        <div class="menu-row">
          <div class="menu-label">Offset</div>
          <div class="offset-buttons" id="lyric-offsetButtons">
            <button class="btn" data-delta="-500">−0.50s</button>
            <button class="btn" data-delta="-100">−0.10s</button>
            <button class="btn" data-reset="1">Reset</button>
            <button class="btn" data-delta="100">+0.10s</button>
            <button class="btn" data-delta="500">+0.50s</button>
          </div>
          <div class="value" id="lyric-offsetValue">+0.00s</div>
        </div>
        <div class="hint">Tip: Offsets shift when each line appears.</div>
      </div>
    </div>
  `;

  const styles = `
    :host {
      --font-size: 28px; --accent-1: #8be9fd; --accent-2: #ff79c6;
      --panel-bg: rgba(0, 0, 0, 0.8); --panel-br: rgba(255, 255, 255, 0.18);
      --shadow-1: rgba(0, 0, 0, 0.45); --shadow-2: rgba(0, 0, 0, 0.65);
      --handle-h: 22px;
    }
    #lyric-float {
      position: fixed; z-index: 99999; left: calc(50% - 300px); top: 18%;
      width: 600px; height: 280px; min-width: 260px; min-height: 140px;
      max-width: calc(100vw - 12px); max-height: calc(100vh - 12px);
      /* resize: both; */ overflow: hidden; border-radius: 16px; background: var(--panel-bg);
      border: 1px solid var(--panel-br); backdrop-filter: blur(14px) saturate(140%);
      -webkit-backdrop-filter: blur(14px) saturate(140%);
      box-shadow: 0 10px 30px var(--shadow-1), 0 30px 60px var(--shadow-2), inset 0 1px 0 rgba(255,255,255,0.08);
      user-select: none; transition: box-shadow 160ms ease;
    }
    #lyric-float.dragging {
      box-shadow: 0 6px 16px rgba(0,0,0,0.55), 0 20px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06);
    }
    .drag-handle {
      position: absolute; inset: 0 0 auto 0; height: var(--handle-h); display: flex;
      align-items: center; gap: 6px; padding: 0 10px; cursor: move; color: rgba(255,255,255,0.7);
      font-size: 11px; letter-spacing: .3px;
      background: linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0));
      border-bottom: 1px solid rgba(255,255,255,0.06); touch-action: none;
    }
    .handle-dots-svg {
      width: 14px; height: 4px;
      filter: drop-shadow(0 1px 1px rgba(0,0,0,0.4));
    }
    .handle-dots-svg circle {
      animation: dot-opacity 1.8s infinite;
    }
    .handle-dots-svg circle:nth-child(1) { animation-delay: 0s; }
    .handle-dots-svg circle:nth-child(2) { animation-delay: 0.2s; }
    .handle-dots-svg circle:nth-child(3) { animation-delay: 0.4s; }
    .brand { display: none; }
    .close-btn {
      position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
      width: 18px; height: 18px; border-radius: 50%; border: none;
      background: transparent; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background-color 120ms ease;
    }
    .close-btn:hover {
      background: rgba(255,255,255,0.2);
    }
    .close-btn::before {
      content: '×'; color: rgba(255,255,255,0.5); font-size: 18px; line-height: 1;
      font-weight: bold; text-align: center;
    }
    .lyrics-scroll { position: absolute; inset: var(--handle-h) 0 0 0; overflow: hidden; }
    .resize-handle {
      position: absolute; right: 0; bottom: 0;
      width: 24px; height: 24px; cursor: se-resize;
      z-index: 10; touch-action: none;
    }
    .resize-handle::after {
      content: ''; position: absolute; right: 4px; bottom: 4px;
      width: 8px; height: 8px; border-right: 2px solid rgba(255,255,255,0.4);
      border-bottom: 2px solid rgba(255,255,255,0.4);
      border-bottom-right-radius: 3px; pointer-events: none;
    }
    .fade-top, .fade-bottom { position: absolute; left: 0; right: 0; pointer-events: none; }
    .fade-top { top: 0; height: 46px; background: linear-gradient(to bottom, rgba(5,7,15,0.9), rgba(5,7,15,0)); }
    .fade-bottom { bottom: 0; height: 46px; background: linear-gradient(to top, rgba(5,7,15,0.9), rgba(5,7,15,0)); }
    .list {
      position: absolute; inset: 0; overflow: auto; scroll-behavior: smooth; padding: 10px 20px 16px;
      transition: filter 160ms ease;
    }
    .list.masking .group:not(.ctx-active) {
      filter: blur(4px);
      opacity: 0.35;
      transform: scale(0.98);
      pointer-events: none;
    }
    .list.masking .group.ctx-active { z-index: 2; }
    .group {
      padding: 4px 6px;
      border-radius: 12px;
      position: relative;
      transition: box-shadow 160ms ease, transform 160ms ease;
    }
    .empty-message {
      color: rgba(255,255,255,0.4);
      font-size: var(--font-size);
      text-align: center;
    }
    .line {
      font-size: var(--font-size); line-height: 1.35; color: rgba(255,255,255,0.55);
      text-align: center; padding: 2px 8px; transition: color 140ms ease, transform 200ms ease, opacity 200ms ease;
      text-shadow: 0 1px 0 rgba(0,0,0,0.5); white-space: pre-wrap; word-break: break-word;
      cursor: pointer;
    }
    .sub { font-size: calc(var(--font-size) * .72); opacity: .9; color: rgba(255,255,255,0.65); }
    .line.active {
      color: #fff; transform: scale(1.02);
      text-shadow: 0 2px 10px rgba(0,0,0,0.5), 0 0 22px rgba(139,233,253,0.25);
      background: linear-gradient(90deg, var(--accent-1), var(--accent-2));
      -webkit-background-clip: text; background-clip: text; color: transparent;
      filter: drop-shadow(0 0 10px rgba(139,233,253,0.08));
    }
    .group.ctx-active {
      background: linear-gradient(120deg, rgba(139,233,253,0.22), rgba(255,121,198,0.16));
      box-shadow: 0 16px 38px rgba(9,15,32,0.55);
      transform: translateY(-1px);
    }
    .group.ctx-active::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 12px;
      border: 1px solid rgba(139,233,253,0.32);
      opacity: 0.7;
      pointer-events: none;
    }
    .group.ctx-active .line.orig {
      text-shadow: 0 3px 16px rgba(139,233,253,0.4);
    }
    .group.ctx-active .line.orig:not(.active) {
      color: rgba(255,255,255,0.96);
    }
    .group.ctx-active .line:not(.active) {
      color: rgba(255,255,255,0.88);
    }
    @media (hover: hover) and (pointer: fine) {
      .list:not(.masking) .group:hover {
        background: linear-gradient(120deg, rgba(139,233,253,0.14), rgba(255,121,198,0.08));
        transform: translateY(-1px);
      }
    }
    .line-menu {
      position: absolute;
      z-index: 100001;
      min-width: 160px;
      padding: 6px;
      border-radius: 12px;
      background: rgba(19, 23, 36, 0.95);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 20px 40px rgba(0,0,0,0.55);
      color: #f4f6ff;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: none;
      transition: opacity 140ms ease, transform 140ms ease;
      transform: translateY(4px);
      opacity: 0;
      pointer-events: none;
    }
    .line-menu.open {
      display: flex;
      flex-direction: column;
      gap: 4px;
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
    .line-menu button {
      appearance: none;
      border: none;
      background: rgba(255,255,255,0.04);
      color: inherit;
      font-size: 13px;
      padding: 8px 12px;
      border-radius: 8px;
      text-align: left;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: background 120ms ease, color 120ms ease;
    }
    .line-menu button:hover,
    .line-menu button:focus-visible {
      background: rgba(139,233,253,0.18);
      color: #ffffff;
      outline: none;
    }
    .line-menu button:active {
      background: rgba(139,233,253,0.28);
    }
    .ctx-menu {
      position: fixed; z-index: 100000; min-width: 180px; padding: 8px 6px; border-radius: 10px;
      background: rgba(20, 24, 35, 0.96); border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 16px 40px rgba(0,0,0,0.55); color: #eaeef7;
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); display: none;
      max-width: 92vw; max-height: calc(100vh - 16px); overflow: auto; box-sizing: border-box;
    }
    @keyframes dot-opacity {
      0%, 100% { fill-opacity: 0.2; }
      40% { fill-opacity: 0.5; }
    }
    @media (pointer: coarse) {
      .ctx-menu.open {
        left: 0 !important; right: 0 !important; top: auto !important;
        bottom: calc(env(safe-area-inset-bottom) + 8px) !important;
        width: 100vw !important; max-width: 100vw !important; max-height: 60vh !important;
        border-radius: 14px 14px 0 0 !important;
      }
    }
    .ctx-menu.open { display: block; }
    .menu-title { margin: 2px 8px 6px; font-size: 12px; opacity: .7; letter-spacing: .3px; }
    .menu-group { padding: 4px 6px; }
    .menu-row { display: flex; align-items: center; gap: 8px; padding: 4px 6px; flex-wrap: wrap; }
    .menu-row + .menu-row { border-top: 1px dashed rgba(255,255,255,0.08); }
    .menu-label { width: 56px; font-size: 13px; opacity: .7; }
    .mode-wrap, .offset-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn {
      appearance: none; border: 1px solid rgba(255,255,255,0.15);
      background: linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
      color: #eaf1ff; padding: 4px 7px; border-radius: 7px; font-size: 12px; cursor: pointer;
      transition: transform 80ms ease, border-color 120ms ease;
    }
    .btn:hover { transform: translateY(-1px); border-color: rgba(255,255,255,0.25); }
    .btn:active { transform: translateY(0); }
    .btn.small { padding: 3px 6px; }
    .radio {
      display: inline-flex; align-items: center; gap: 8px; padding: 4px 8px;
      border-radius: 8px; border: 1px solid transparent; cursor: pointer; font-size: 12px;
    }
    .radio input { accent-color: #6ee7ff; }
    .radio.active { border-color: rgba(255,255,255,0.16); background: rgba(255,255,255,0.04); }
    .slider { flex: 1; min-width: 0; }
    .value { font-variant-numeric: tabular-nums; opacity: .8; min-width: 40px; text-align: right; }
    .menu-row select, .menu-row input[type="range"] { flex: 1; min-width: 0; }
    .hint { opacity: .55; font-size: 12px; margin: 6px 8px 0; text-align: right; }
    .no-select, .no-select * { user-select: none !important; }
  `;

  const shadowHost = document.createElement('div');
  shadowHost.id = 'lyrics-shadow-host';
  const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
  document.body.appendChild(shadowHost);

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  shadowRoot.appendChild(styleEl);

  shadowRoot.appendChild((new DOMParser().parseFromString(panelHTML, 'text/html')).body.firstChild);
  shadowRoot.appendChild((new DOMParser().parseFromString(menuHTML, 'text/html')).body.firstChild);

  await initUIController(shadowRoot, shadowHost);
}

async function initUIController(shadowRoot, shadowHost) {
  const $ = (sel, root = shadowRoot) => root.querySelector(sel);
  const $$ = (sel, root = shadowRoot) => Array.from(root.querySelectorAll(sel));

  let timeline = [];
  let mode = await GM.getValue('lyrics.mode', 'orig');
  let offsetMs = 0; // Will be set per-song
  let fontSize = +(await GM.getValue('lyrics.fontSize', 28));
  shadowHost.style.setProperty('--font-size', fontSize + 'px');

  const panel = $('#lyric-float');

  const saveBounds = async () => {
    const r = panel.getBoundingClientRect();
    await GM.setValue('lyrics.bounds', JSON.stringify({
      x: r.left, y: r.top, w: r.width, h: r.height
    }));
  };

  const clampPanelToViewport = () => {
    const r = panel.getBoundingClientRect();
    const L = Math.max(0, Math.min(r.left, innerWidth - r.width));
    const T = Math.max(0, Math.min(r.top, innerHeight - r.height));
    if (r.left !== L) panel.style.left = L + 'px';
    if (r.top !== T) panel.style.top = T + 'px';
  };

  try {
    const savedBoundsStr = await GM.getValue('lyrics.bounds');
    const savedBounds = savedBoundsStr ? JSON.parse(savedBoundsStr) : null;
    if (savedBounds && savedBounds.w > 50 && savedBounds.h > 50) {
      panel.style.width = `${savedBounds.w}px`;
      panel.style.height = `${savedBounds.h}px`;
      panel.style.left = `${savedBounds.x}px`;
      panel.style.top = `${savedBounds.y}px`;
      requestAnimationFrame(clampPanelToViewport);
    }
  } catch (e) { console.error('[Lyrics] Error loading bounds', e); }

  const list = $('#lyric-list');
  const menu = $('#lyric-menu');
  const lineMenu = $('#lyric-lineMenu');
  const handle = $('#lyric-dragHandle');
  const closeBtn = $('#lyric-closeBtn');

  closeBtn?.addEventListener('click', () => lyricsUI.hide());

  const renderList = () => {
    list.innerHTML = '';
    if (!timeline.length) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'empty-message';
      emptyMsg.textContent = '(No lyrics available)';
      list.appendChild(emptyMsg);
      return;
    }
    timeline.forEach((row, i) => {
      const g = document.createElement('div'); g.className = 'group'; g.dataset.idx = i;
      const main = document.createElement('div'); main.className = 'line orig'; main.textContent = row.orig;
      g.appendChild(main);
      if (mode === 'orig+trans' && row.trans) {
        const sub = document.createElement('div'); sub.className = 'line sub'; sub.textContent = row.trans; g.appendChild(sub);
      } else if (mode === 'orig+roma' && row.roma) {
        const sub = document.createElement('div'); sub.className = 'line sub'; sub.textContent = row.roma; g.appendChild(sub);
      }
      list.appendChild(g);
    });
  };

  let lastActive = -1;
  const setActiveIndex = (idx) => {
    if (idx === lastActive) return;
    const prev = $(`.group[data-idx="${lastActive}"] .orig`, list);
    const next = $(`.group[data-idx="${idx}"] .orig`, list);
    prev?.classList.remove('active');
    next?.classList.add('active');
    lastActive = idx;
    if (next && !list.classList.contains('masking')) {
      const listRect = list.getBoundingClientRect();
      const nextRect = next.parentElement.getBoundingClientRect();
      const isInView = nextRect.top >= listRect.top && nextRect.bottom <= listRect.bottom;
      if (!isInView) {
        list.scrollTo({ top: next.parentElement.offsetTop - list.clientHeight / 2 + next.clientHeight, behavior: 'smooth' });
      }
    }
  };

  const idxFor = (tEff) => {
    if (!timeline.length) return 0;
    let lo = 0, hi = timeline.length - 1, ans = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (timeline[mid].t <= tEff) { ans = mid; lo = mid + 1; } else hi = mid - 1;
    }
    return ans;
  };

  const tick = (currentTimeMs) => {
    const eff = currentTimeMs + offsetMs;
    let i = idxFor(eff);
    setActiveIndex(i);
  };

  // --- Menu & Dragging Logic ---
  let highlightedCtxGroup = null;

  const setCtxHighlight = (groupEl) => {
    if (highlightedCtxGroup && highlightedCtxGroup !== groupEl) {
      highlightedCtxGroup.classList.remove('ctx-active');
    }
    highlightedCtxGroup = groupEl || null;
    highlightedCtxGroup?.classList.add('ctx-active');
  };

  const closeLineMenu = () => {
    if (!lineMenu || !lineMenu.classList.contains('open')) return;
    lineMenu.classList.remove('open');
    lineMenu.setAttribute('aria-hidden', 'true');
    lineMenu.style.left = '';
    lineMenu.style.top = '';
    setCtxHighlight(null);
    list?.classList.remove('masking');
  };

  const openLineMenuFor = (lineEl, text, idx) => {
    if (!lineMenu || !text) return;

    closeMenu();
    closeLineMenu();

    const group = lineEl.closest('.group');
    if (!group) return;

    setCtxHighlight(group);

    const groupRect = group.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();

    // First position the menu to measure its size
    lineMenu.style.left = '0px';
    lineMenu.style.top = '0px';
    lineMenu.classList.add('open');
    lineMenu.setAttribute('aria-hidden', 'false');

    const menuRect = lineMenu.getBoundingClientRect();
    const menuWidth = menuRect.width;
    const menuHeight = menuRect.height;
    const padding = 6;

    // Calculate available space
    const spaceBelow = panelRect.bottom - groupRect.bottom;
    const spaceAbove = groupRect.top - panelRect.top;

    let left, top;

    // Vertical position (prefer below, use above if not enough space)
    if (spaceBelow >= menuHeight + padding) {
      top = groupRect.bottom - panelRect.top + padding;
    } else if (spaceAbove >= menuHeight + padding) {
      top = groupRect.top - panelRect.top - menuHeight - padding;
    } else {
      top = groupRect.bottom - panelRect.top + padding;
    }

    // Align horizontally with the group
    left = groupRect.left - panelRect.left;

    // Clamp to panel bounds
    const minLeft = padding;
    const maxLeft = panelRect.width - menuWidth - padding;
    const minTop = padding;
    const maxTop = panelRect.height - menuHeight - padding;

    left = Math.max(minLeft, Math.min(maxLeft, left));
    top = Math.max(minTop, Math.min(maxTop, top));

    lineMenu.style.left = `${left}px`;
    lineMenu.style.top = `${top}px`;

    lineMenu.dataset.lineIdx = idx;
    lineMenu.dataset.lineText = text;

    list?.classList.add('masking');
  };

  function openMenu(x, y, opts = {}) {
    closeLineMenu();
    const isCoarse = opts.pointerType ? (opts.pointerType === 'touch' || opts.pointerType === 'pen') : window.matchMedia('(pointer: coarse)').matches;
    menu.style.width = ''; menu.style.left = ''; menu.style.top = '';
    if (!isCoarse) { menu.style.left = x + 'px'; menu.style.top = y + 'px'; }
    refreshMenuUI();
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      if (!isCoarse) {
        const r = menu.getBoundingClientRect(); const vw = innerWidth, vh = innerHeight;
        const L = Math.min(r.left, vw - r.width - 8), T = Math.min(r.top, vh - r.height - 8);
        menu.style.left = Math.max(8, L) + 'px'; menu.style.top = Math.max(8, T) + 'px';
      }
    });
  }
  function closeMenu() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
  }

  // --- Line Menu Event Handlers ---
  list?.addEventListener('click', (e) => {
    const lineEl = e.target.closest('.line');
    if (!lineEl) {
      closeLineMenu();
      return;
    }

    if (e.button !== undefined && e.button !== 0) return;

    const group = lineEl.closest('.group');
    if (!group) return;

    const idx = Number(group.dataset.idx || '-1');
    const text = (lineEl.textContent || '').trim();
    if (!text) return;

    e.preventDefault();
    e.stopPropagation();

    // If clicking the same line again while menu is open, close it
    const currentIdx = lineMenu?.dataset.lineIdx;
    if (currentIdx && Number(currentIdx) === idx && lineMenu?.classList.contains('open')) {
      closeLineMenu();
      return;
    }

    openLineMenuFor(lineEl, text, idx);
  });

  list?.addEventListener('scroll', () => closeLineMenu(), { passive: true });

  lineMenu?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const action = btn.dataset.action;
    const text = lineMenu.dataset.lineText;
    const idx = Number(lineMenu.dataset.lineIdx || '-1');

    if (!text || idx < 0) {
      closeLineMenu();
      return;
    }

    if (action === 'copy') {
      navigator.clipboard?.writeText(text).then(() => {
        console.log('[Lyrics] Copied to clipboard:', text);
      }).catch(err => {
        console.error('[Lyrics] Failed to copy:', err);
      });
    } else if (action === 'jump') {
      if (idx >= 0 && idx < timeline.length) {
        const targetTime = timeline[idx].t - offsetMs;
        console.log('[Lyrics] Jumping to line:', idx, 'time:', targetTime);
        window.dispatchEvent(new CustomEvent('lyrics-control', {
          detail: { action: 'seek', value: targetTime / 1000 }
        }));
      }
    }

    closeLineMenu();
  });

  ;(() => { // Dragging
    let dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0, pointerId = null;
    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      let L = startLeft + dx, T = startTop + dy;
      const maxL = window.innerWidth - panel.offsetWidth, maxT = window.innerHeight - panel.offsetHeight;
      L = Math.max(0, Math.min(maxL, L)); T = Math.max(0, Math.min(maxT, T));
      panel.style.left = L + 'px'; panel.style.top = T + 'px';
    };
    const onPointerUp = async () => {
      if (!dragging) return;
      dragging = false;
      panel.classList.remove('dragging', 'no-select');
      if (pointerId !== null) { try { handle.releasePointerCapture(pointerId); } catch {} pointerId = null; }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      await saveBounds();
    };
    handle.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('.close-btn')) return;
      e.preventDefault(); closeMenu(); dragging = true;
      panel.classList.add('dragging', 'no-select');
      startX = e.clientX; startY = e.clientY;
      const rect = panel.getBoundingClientRect();
      startLeft = rect.left; startTop = rect.top;
      pointerId = e.pointerId;
      try { handle.setPointerCapture(pointerId); } catch {}
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    });
  })();

  ;(() => { // Resize logic
    const resizeHandle = $('#lyric-resizeHandle');
    if (!resizeHandle) return;

    let resizing = false, startX = 0, startY = 0, startW = 0, startH = 0, pointerId = null;
    const onPointerMove = (e) => {
      if (!resizing) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      panel.style.width = startW + dx + 'px';
      panel.style.height = startH + dy + 'px';
    };
    const onPointerUp = () => {
      if (!resizing) return;
      resizing = false;
      panel.classList.remove('no-select');
      if (pointerId !== null) { try { resizeHandle.releasePointerCapture(pointerId); } catch {} pointerId = null; }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
    resizeHandle.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault(); e.stopPropagation();
      closeMenu();
      closeLineMenu();
      resizing = true;
      panel.classList.add('no-select');
      startX = e.clientX; startY = e.clientY;
      const rect = panel.getBoundingClientRect();
      startW = rect.width; startH = rect.height;
      pointerId = e.pointerId;
      try { resizeHandle.setPointerCapture(pointerId); } catch {}
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    });
  })();

  panel.addEventListener('contextmenu', (e) => { e.preventDefault(); openMenu(e.clientX, e.clientY, { pointerType: 'mouse' }); });
  ;(() => { // Long-press
    let pressTimer = 0, startX = 0, startY = 0, lastPointerType = 'mouse';
    const clearTimer = () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = 0; } };
    const onDown = (e) => {
      if (e.button === 2 || (e.target && e.target.closest && e.target.closest('#lyric-dragHandle'))) return;
      lastPointerType = e.pointerType || (e.touches ? 'touch' : 'mouse');
      startX = e.clientX; startY = e.clientY;
      clearTimer();
      pressTimer = setTimeout(() => { openMenu(startX, startY, { pointerType: lastPointerType }); pressTimer = 0; }, 500);
    };
    const onMove = (e) => { if (pressTimer && Math.hypot(e.clientX - startX, e.clientY - startY) > 8) clearTimer(); };
    panel.addEventListener('pointerdown', onDown);
    panel.addEventListener('pointermove', onMove);
    ['pointerup', 'pointercancel', 'wheel'].forEach(evt => panel.addEventListener(evt, clearTimer, { passive: true }));
  })();

  window.addEventListener('click', (e) => {
    if (!menu.classList.contains('open') && !lineMenu?.classList.contains('open')) return;
    const path = e.composedPath && e.composedPath() || [];
    if (!path.includes(menu) && menu.classList.contains('open')) closeMenu();
    if (!path.includes(lineMenu) && lineMenu?.classList.contains('open')) closeLineMenu();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeLineMenu();
    }
  });

  let resizeDebounceTimer;
  const onPanelResize = () => {
    clampPanelToViewport();
    closeLineMenu();
    clearTimeout(resizeDebounceTimer);
    resizeDebounceTimer = setTimeout(saveBounds, 200);
  };
  new ResizeObserver(onPanelResize).observe(panel);

  window.addEventListener('resize', () => {
    clampPanelToViewport();
    closeLineMenu();
  });

  // --- Settings Wiring ---
  const modeWrap = $('#lyric-modeWrap'), modeRadios = $$('input[name="mode"]', modeWrap);
  const sourceSelect = $('#lyric-sourceSelect'), fontMinus = $('#lyric-fontMinus'), fontPlus = $('#lyric-fontPlus');
  const fontSlider = $('#lyric-fontSlider'), fontValue = $('#lyric-fontValue');
  const offsetButtons = $('#lyric-offsetButtons'), offsetValue = $('#lyric-offsetValue');

  sourceSelect.addEventListener('change', () => {
    const selectedId = sourceSelect.value;
    if (selectedId) {
      lyricsUI.onSourceSelect(selectedId);
    }
  });

  const fmtOff = (ms) => (ms >= 0 ? '+' : '') + (ms / 1000).toFixed(2) + 's';
  const refreshOff = () => { if (offsetValue) offsetValue.textContent = fmtOff(offsetMs); };
  const setOffset = (ms) => {
    offsetMs = ms;
    refreshOff();
    lastActive = -1;
  };
  const refreshModeRadios = () => {
    $$('.radio', modeWrap).forEach(lab => {
      const inp = lab.querySelector('input');
      lab.classList.toggle('active', inp && inp.value === mode);
      if (inp) inp.checked = inp.value === mode;
    });
  };
  const applySize = async (v) => {
    fontSize = Math.max(12, Math.min(96, v | 0));
    shadowHost.style.setProperty('--font-size', fontSize + 'px');
    await GM.setValue('lyrics.fontSize', String(fontSize));
    if (fontSlider) fontSlider.value = String(fontSize);
    if (fontValue) fontValue.textContent = fontSize + 'px';
  };
  const refreshMenuUI = () => { refreshModeRadios(); refreshOff(); applySize(fontSize); };

  modeRadios.forEach(inp => inp.addEventListener('change', async () => {
    mode = inp.value; await GM.setValue('lyrics.mode', mode);
    refreshModeRadios();
    closeLineMenu();
    renderList();
    lastActive = -1;
  }));
  fontMinus?.addEventListener('click', () => applySize(fontSize - 2));
  fontPlus?.addEventListener('click', () => applySize(fontSize + 2));
  fontSlider?.addEventListener('input', () => applySize(+fontSlider.value));
  offsetButtons?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    let newOffset = offsetMs;
    if (btn.dataset.reset) newOffset = 0;
    else if (btn.dataset.delta) newOffset = newOffset + (+btn.dataset.delta);

    setOffset(newOffset);
    lyricsUI.onOffsetChange(newOffset);
  });

  refreshMenuUI();

  // --- Public API ---
  const parseLrc = (txt = '') => txt.split(/\r?\n/).flatMap(line => {
    line = line.trim(); if (!line) return [];
    const m = line.match(/^\[(\d{2}):(\d{2})(?:[.:](\d{2,3}))?]\s*(.*)$/);
    if (m) {
      const [, mm, ss, ff = '0', text] = m;
      const sub = ff.length === 3 ? +ff : +ff * 10;
      const t = (+mm) * 60000 + (+ss) * 1000 + sub;
      return [{ t, text }];
    }
    try {
      const o = JSON.parse(line);
      if (Number.isFinite(o?.t) && Array.isArray(o?.c)) {
        return [{ t: +o.t, text: o.c.map(x => x?.tx || '').join('') }];
      }
    } catch {}
    return [];
  }).sort((a, b) => a.t - b.t);

  lyricsUI.updateFeatures = (features) => {
    const jumpBtn = lineMenu?.querySelector('[data-action="jump"]');
    if (jumpBtn) {
      jumpBtn.style.display = features.includes('seek') ? '' : 'none';
    }
  };

  lyricsUI.updateSources = (sources) => {
    sourceSelect.innerHTML = '';
    if (!sources || sources.length === 0) {
      const opt = document.createElement('option');
      opt.textContent = 'No results';
      opt.disabled = true;
      sourceSelect.appendChild(opt);
      return;
    }
    sources.forEach((song) => {
      const opt = document.createElement('option');
      opt.value = song.resourceId;
      const artists = song.baseInfo.simpleSongData.ar?.map(a => a.name).join('/') || '';
      opt.textContent = `${song.baseInfo.simpleSongData.name}${artists ? ` - ${artists}` : ''}`;
      sourceSelect.appendChild(opt);
    });
  };

  lyricsUI.update = (lyricsData) => {
    const O = parseLrc(lyricsData.lrc?.lyric);
    const T = parseLrc(lyricsData.tlyric?.lyric);
    const R = parseLrc(lyricsData.romalrc?.lyric);
    const findNear = (arr, t, tol = 500) => {
      let lo = 0, hi = arr.length - 1, best = null;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const dt = arr[mid].t - t;
        if (!best || Math.abs(dt) < Math.abs(best.t - t)) best = arr[mid];
        dt < 0 ? (lo = mid + 1) : (hi = mid - 1);
      }
      return best && Math.abs(best.t - t) <= tol ? best.text : '';
    };
    timeline = O.map(o => ({ t: o.t, orig: o.text, trans: findNear(T, o.t), roma: findNear(R, o.t) }));
    renderList();
    lastActive = -1;
    console.log('[Lyrics] Lyrics updated,', timeline.length, 'lines loaded');
  };

  lyricsUI.show = () => { panel.style.display = ''; };
  lyricsUI.hide = () => { panel.style.display = 'none'; };
  lyricsUI.tick = tick;
  lyricsUI.setOffset = setOffset;
}

window.onunhandledrejection = console.error; // for debugging
if (window.unsafeWindow) { // for debugging
  unsafeWindow._cloudmusic = cloudmusic;
  unsafeWindow._lyricsUI = lyricsUI;
}

(async () => {
  'use strict';

  // Register anonymous device every 7 days
  const registerTime = await GM.getValue('lyrics.register.time', 0);
  const now = Date.now();
  if (now - registerTime > 7 * 24 * 60 * 60 * 1000) {
    try {
      const deviceId = '7B79802670C7A45DB9091976D71E0AE829E28926C6C34A1B8644'; // TODO: device ID generation
      console.log('[Lyrics] Registering new device ID:', deviceId);
      console.log('[Lyrics] Registration successful.', await cloudmusic.register(deviceId));
      await GM.setValue('lyrics.register.time', now);
    } catch (error) {
      console.error('[Lyrics] Registration failed:', error);
    }
  }

  // This script is injected into the page context to communicate with the userscript.
  const inlineScriptYTM = () => {
    window.addEventListener('lyrics-control', (e) => {
      const { action, value } = e.detail;
      const playerApi = document.querySelector('ytmusic-app')?.playerApi;
      if (!playerApi) return;

      switch (action) {
        case 'play':
          playerApi.playVideo?.();
          break;
        case 'pause':
          playerApi.pauseVideo?.();
          break;
        case 'seek':
          if (typeof value === 'number') {
            playerApi.seekTo?.(value);
          }
          break;
      }
    });

    setInterval(() => {
      const playerApi = document.querySelector('ytmusic-app')?.playerApi;
      const playerBar = document.querySelector('ytmusic-player-bar');

      if (!playerApi || !playerApi.getVideoData || !playerApi.getProgressState) return;

      const meta = playerApi.getVideoData();
      const progress = playerApi.getProgressState();
      const state = playerApi.getPlayerState();

      if (state !== 1 && state !== 2) return;

      window.dispatchEvent(new CustomEvent('lyrics-player-update', {
        detail: {
          videoId: meta.video_id,
          title: playerBar?.currentItem?.title?.runs?.[0]?.text || meta.title,
          author: meta.author,
          currentTime: progress.current
        }
      }));
    }, 500);

    return {
      features: [ 'play', 'pause', 'seek' ]
    };
  };

  const inlineScriptSpotify = () => {
    const parseTimeToSeconds = (timeStr) => {
      if (!timeStr) return 0;
      return timeStr.split(':').map(Number).reduce((acc, time) => (acc * 60) + time, 0);
    };

    setInterval(() => {
      const titleEl = document.querySelector('div[data-testid="context-item-info-title"]');
      const authorEl = document.querySelector('div[data-testid="context-item-info-subtitles"]');
      const timeEl = document.querySelector('div[data-testid="playback-position"]');
      const durationEl = document.querySelector('div[data-testid="playback-duration"]');

      if (!titleEl || !authorEl || !timeEl || !durationEl) return;

      const title = titleEl.textContent;
      const author = authorEl.textContent;
      const currentTime = parseTimeToSeconds(timeEl.textContent) + 1.5;
      const duration = parseTimeToSeconds(durationEl.textContent);

      if (!title || !author || duration === 0) return;

      window.dispatchEvent(new CustomEvent('lyrics-player-update', {
        detail: { videoId: `${title} - ${author}`, title, author, currentTime }
      }));
    }, 500);

    return { features: [] };
  };

  // Inject the page script
  const injectPageScript = async (scriptFunc) => {
    let scriptData = null;
    window.addEventListener('lyrics-player-inject', (e) => { scriptData = e.detail; }, { once: true });
    const textContent = `window.dispatchEvent(new CustomEvent('lyrics-player-inject',{detail:(${scriptFunc})()}));`;
    if (typeof GM !== 'undefined' && typeof GM.addElement === 'function') {
      GM.addElement('script', { textContent })
    } else {
      try {
        const script = document.createElement("script");
        script.textContent = textContent;
        (document.body ?? document.head ?? document.documentElement).append(script);
      } catch (error) {
        console.warn("[Lyrics] Failed to inject page script:", error);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
    if (scriptData !== null) {
      console.log('[Lyrics] Page script injected:', scriptData);
      return scriptData;
    }

    console.warn("[Lyrics] Page script injection failed, falling back to eval");
    eval(textContent);
    return scriptData || {};
  };

  await injectUI();

  let scriptData = [];

  if (window.location.hostname.indexOf('youtube') >= 0) {
    scriptData = await injectPageScript(inlineScriptYTM);
  } else if (window.location.hostname.indexOf('spotify') >= 0) {
    scriptData = await injectPageScript(inlineScriptSpotify);
  }

  lyricsUI.updateFeatures(scriptData.features || []);

  const fetchLyricsForId = async (id) => {
    if (!id) return false;
    try {
      console.log(`[Lyrics] Fetching lyrics for ID: ${id}`);
      const lyricData = await cloudmusic.lyric(id);
      if (!lyricData.lrc?.lyric) throw new Error('No lyrics found for this ID');
      lyricsUI.update(lyricData);
      lyricsUI.show();
      return true;
    } catch (error) {
      console.error('[Lyrics] Error fetching selected lyrics:', error);
      lyricsUI.update({});
      return false;
    }
  };

  lyricsUI.onSourceSelect = async (selectedId) => {
    if (await fetchLyricsForId(selectedId) && lastVideoId && selectedId) {
      const selections = await GM.getValue('lyrics.selections', {});
      selections[lastVideoId] = selectedId;
      await GM.setValue('lyrics.selections', selections);
      console.log(`[Lyrics] Saved selection for ${lastVideoId}: ${selectedId}`);
    }
  };

  const splitTitle = (title) => {
    const masterPattern = /(?:[「『](?<content>.+?)[」』])|(?:【.*?】|〖.*?〗|\(.*?\))|(?<delimiter>\s+-\s+|\s*[\/|:|│]\s*)/i;
    const noiseWords = /\b(MV|PV)\b|\b(?:covered by|feat?|ft?)\b.+/gi;

    const parse = (str) => {
      if (!str?.trim()) return [];

      const match = str.match(masterPattern);
      if (!match) return [str];

      const before = str.substring(0, match.index);
      const after = str.substring(match.index + match[0].length);
      const { delimiter, content } = match.groups;

      if (delimiter && (before.trim().length < 2 || after.trim().length < 2)) {
        const remaining = parse(after);
        return [before + match[0] + (remaining[0] || ''), ...remaining.slice(1)];
      }

      return [...parse(before), ...(content ? [content] : []), ...parse(after)];
    };
    return [...new Set(parse(title)
      .map(p => p.replace(noiseWords, '').trim())
      .filter(p => p.length > 0)
    )];
  };

  const levenshtein = (a, b) => {
    const an = a ? a.length : 0;
    const bn = b ? b.length : 0;
    if (an === 0) return bn;
    if (bn === 0) return an;
    const matrix = Array(bn + 1).fill(null).map(() => Array(an + 1).fill(null));
    for (let i = 0; i <= an; i += 1) {
      matrix[0][i] = i;
    }
    for (let j = 0; j <= bn; j += 1) {
      matrix[j][0] = j;
    }
    for (let j = 1; j <= bn; j += 1) {
      for (let i = 1; i <= an; i += 1) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost,
        );
      }
    }
    return matrix[bn][an];
  };

  const nLevenshtein = (a, b) => {
    const dist = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    return maxLen === 0 ? 0 : (1 - (dist / maxLen));
  };

  const bonusCompare = (fullTitle, searchTitle) => {
    let weight = 0.5;
    const [lowerFull, lowerSearch] = [fullTitle.toLowerCase(), searchTitle.toLowerCase()];
    const [engFull, engSearch] = [wanakana.toRomaji(fullTitle), wanakana.toRomaji(searchTitle)];
    if (lowerFull.startsWith(lowerSearch)) weight *= 2; // Bonus for prefix match
    else if (lowerFull.includes(lowerSearch)) weight *= 1.5; // Bonus for substring match
    return weight * nLevenshtein(engFull, engSearch);
  };

  // Main logic driven by events from the page script
  let lastVideoId = null;

  lyricsUI.onOffsetChange = async (newOffset) => {
    if (!lastVideoId) return;
    const offsets = await GM.getValue('lyrics.offsets', {});
    offsets[lastVideoId] = newOffset;
    await GM.setValue('lyrics.offsets', offsets);
    console.log(`[Lyrics] Saved offset for ${lastVideoId}: ${newOffset}ms`);
  };

  window.addEventListener('lyrics-player-update', async (event) => {
    let { videoId, title, author, currentTime } = event.detail;
    [author, title] = [author, title].map(s => s.normalize('NFKC'));

    // Update lyrics if song has changed
    if (videoId && videoId !== lastVideoId) {
      lastVideoId = videoId;
      console.log('[Lyrics] Now playing:', title, 'by', author);
      try {
        const offsets = await GM.getValue('lyrics.offsets', {});
        lyricsUI.setOffset(offsets[lastVideoId] || 0);

        const parts = splitTitle(title);
        if (parts.length === 0) throw new Error('Failed to parse title for search');

        const keywords = [...parts];
        if (parts[0] !== author) keywords.push(`${parts[0]} ${author}`);
        console.log(`[Lyrics] Searching for keywords: ${keywords.join(', ')}`);

        const results = await Promise.all(keywords.map(kw => cloudmusic.search(kw)));
        const seenIds = new Set();

        const calcScore = (searchTitle, searchAuthors) => {
          const cleanedTitle = splitTitle(searchTitle).join('');
          let avgScore = 0;
          parts.forEach((part, idx) => {
            const weight = 1 / (idx * 2 + 1); // Earlier parts have higher weight
            avgScore += bonusCompare(cleanedTitle, part) * weight / parts.length;
          });
          const scoreSong = Math.max(bonusCompare(searchTitle, title) + 0.01, avgScore);
          const scoreAuthor = Math.max(...searchAuthors.map(sa => bonusCompare(sa, author)));
          const score = scoreSong * 10 + scoreAuthor;
          console.debug(`[Lyrics] Score for "${searchTitle}" by "${searchAuthors.join(', ')}": ${score.toFixed(3)} (song: ${scoreSong.toFixed(3)}, author: ${scoreAuthor.toFixed(3)})`);
          return score;
        };

        let searchResults = results
          .flatMap(r => r?.data?.resources || []) // Flatten results
          .filter(song => { // Remove duplicates and invalid entries
            if (!song?.resourceId || seenIds.has(song.resourceId)) {
              return false;
            }
            seenIds.add(song.resourceId);
            return true;
          }).map(song => ({ // Calculate score for sorting
            ...song,
            _score: calcScore(
              song.baseInfo.simpleSongData.name.normalize('NFKC'),
              (song.baseInfo.simpleSongData.ar?.map(ar => ar.name) || []).map(n => n.normalize('NFKC'))
            )
          }))
          .sort((a, b) => b._score - a._score); // Sort by score

        if (searchResults.length > 0) {
          console.log(`[Lyrics] Found ${searchResults.length} unique results:`, searchResults);

          const selections = await GM.getValue('lyrics.selections', {});
          const savedLyricId = selections[videoId];

          if (savedLyricId) {
            const savedResult = searchResults.find(r => String(r.resourceId) === String(savedLyricId));
            if (savedResult) {
              console.log(`[Lyrics] Applying saved lyric ID: ${savedLyricId}`);
              const savedIndex = searchResults.indexOf(savedResult);
              if (savedIndex > 0) {
                searchResults.splice(savedIndex, 1);
                searchResults.unshift(savedResult);
              }
            }
          }
          lyricsUI.updateSources(searchResults);
          for (const song of searchResults) {
            if (await fetchLyricsForId(song.resourceId))
              break;
          }
        } else {
          console.log('[Lyrics] No results found');
          lyricsUI.updateSources([]);
          lyricsUI.hide();
        }
      } catch (error) {
        console.error('[Lyrics] Error fetching lyrics:', error);
        lyricsUI.updateSources([]);
        lyricsUI.hide();
      }
    }

    lyricsUI.tick(currentTime * 1000);
  });

  console.log('[Lyrics] initialized');
})();
