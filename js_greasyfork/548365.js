// ==UserScript==
// @name         DeepQuery Secure Client (GF-safe, no hardcoded key)
// @namespace    dq.secure.v2.client
// @version      3.0.1
// @description  沙箱内 DeepQuery API；密钥仅存本机 GM 存储，公开代码不含密钥；与 Secure Core 协作完成签名校验
// @author       you
// @match        http://*/*
// @match        https://*/*
// @include      about:blank
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==
(function () {
  'use strict';

  const CHANNEL = '__DQ_SECURE_V2__';
  const KEY_NAME = 'dq_key_b64';       // 本机密钥保存的键名
  const EXPOSE_TOP_PROXY = false;      // 设为 true 可零改动继续用 top.DeepQuery（仅对本沙箱可见）

  // ==== 基础工具 ====
  const te = new TextEncoder();

  function b64ToU8(b64) {
    if (!b64 || typeof b64 !== 'string') return new Uint8Array();
    const pad = b64.length % 4 ? (4 - b64.length % 4) : 0;
    const s = b64 + '='.repeat(pad);
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return u8;
  }
  function u8ToB64(u8) {
    let s = '';
    for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
    return btoa(s).replace(/\=+$/,'');
  }
  async function sha256U8(u8) {
    const buf = await crypto.subtle.digest('SHA-256', u8);
    return new Uint8Array(buf);
  }
  async function hmacSignRaw(key, u8) {
    const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', k, u8);
    return new Uint8Array(sig);
  }

  // ==== GM 存储封装 ====
  const hasGMGet = typeof GM_getValue === 'function';
  const hasGMSet = typeof GM_setValue === 'function';
  let KEY_CACHE_B64 = '';               // 会话内缓存（当 GM_* 不可用时使用）
  let WARNED_GET_UNAVAILABLE = false;   // GM_getValue 不可用的提示只弹一次

  async function gmGet(key, def = '') {
    if (hasGMGet) {
      try { return await GM_getValue(key, def); } catch (e) {}
    }
    if (!WARNED_GET_UNAVAILABLE) {
      WARNED_GET_UNAVAILABLE = true;
      try { alert('[DeepQuery] GM_getValue 不可用，将使用临时内存，密钥不会持久化。'); } catch {}
    }
    return KEY_CACHE_B64 || def;
  }

  async function gmSet(key, val, { notifyOnUnavailable = false } = {}) {
    if (hasGMSet) {
      try {
        await GM_setValue(key, val);
        KEY_CACHE_B64 = val; // 保持会话缓存同步
        return;
      } catch (e) {}
    }
    // 回退到会话级缓存
    KEY_CACHE_B64 = val;
    if (notifyOnUnavailable) {
      try { alert('[DeepQuery] GM_setValue 不可用，密钥仅在本次会话内有效。'); } catch {}
    }
  }

  // ==== 密钥管理（仅本机） ====
  async function ensureKeyInteractive() {
    // 如果没有密钥：询问用户是“自动生成”还是“粘贴已有（与 Core 一致）”
    const has = await gmGet(KEY_NAME, '');
    if (has) return has;

    const gen = confirm('[DeepQuery] 未检测到本机密钥。\n确定后将自动生成一个强随机密钥（推荐）。\n取消则提示你手动粘贴已有密钥。');
    let b64;
    if (gen) {
      const u8 = crypto.getRandomValues(new Uint8Array(32));
      b64 = u8ToB64(u8);
      alert('[DeepQuery] 已生成新密钥（base64）。\n请在“Core”脚本里配置相同密钥后使用。\n可在菜单中重新生成并复制。');
    } else {
      b64 = prompt('[DeepQuery] 请输入与你的 Core 相同的密钥（base64，建议≥32字节）：', '');
      if (!b64) throw new Error('NO_KEY_PROVIDED');
    }
    await gmSet(KEY_NAME, b64); // 此处不提示 GM_setValue 是否可用（按你的要求）
    return b64;
  }

  async function getKeyU8() {
    let b64 = await gmGet(KEY_NAME, '');
    if (!b64) b64 = await ensureKeyInteractive();
    return b64ToU8(b64);
  }

  // ==== 菜单：仅保留“重新生成随机密钥并复制” ====
  try {
    GM_registerMenuCommand('DeepQuery：重新生成随机密钥并复制', async () => {
      const u8 = crypto.getRandomValues(new Uint8Array(32));
      const b64 = u8ToB64(u8);

      // 保存：仅在菜单操作时，若 GM_setValue 不可用才提示
      await gmSet(KEY_NAME, b64, { notifyOnUnavailable: true });

      // 复制：成功则静默；失败则给出一次手动复制提示
      try {
        await navigator.clipboard.writeText(b64);
      } catch {
        try { prompt('已生成新密钥，复制失败，请手动复制：', b64); } catch {}
      }
    });
  } catch {} // RegisterCommand 失败直接无视

  // ==== 与 Core 的签名通信 ====
  const pending = new Map();
  function rid() {
    return (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).toUpperCase();
  }
  function send(payload) {
    window.top.postMessage({ [CHANNEL]: payload }, '*');
  }
  window.addEventListener('message', (e) => {
    const msg = e.data && e.data[CHANNEL];
    if (!msg || msg.cmd !== 'RESP' || !msg.id) return;
    const hit = pending.get(msg.id);
    if (!hit) return;
    pending.delete(msg.id);
    hit.resolve(msg.res);
  }, false);

  async function request(spec) {
    const id = rid();
    const ts = Date.now();
    const nonce = rid() + Math.random().toString(36).slice(2);
    const payload = te.encode(id + '\n' + ts + '\n' + nonce + '\n');
    const bodyHash = await sha256U8(te.encode(JSON.stringify(spec || {})));
    const toSign = new Uint8Array(payload.length + bodyHash.length);
    toSign.set(payload, 0); toSign.set(bodyHash, payload.length);

    const KEY_U8 = await getKeyU8();
    const sigU8 = await hmacSignRaw(KEY_U8, toSign);
    const sigB64 = u8ToB64(sigU8);

    return new Promise((resolve) => {
      pending.set(id, { resolve });
      send({ cmd: 'REQ', id, ts, nonce, sigB64, spec });
      const timeout = typeof spec.timeout === 'number' ? Math.max(200, spec.timeout + 500) : 6000;
      setTimeout(() => {
        if (pending.has(id)) {
          pending.delete(id);
          resolve({ ok: false, error: 'TIMEOUT' });
        }
      }, timeout);
    });
  }

  const DeepQuery = {
    async get(spec = {}) { return request(spec); },
    async attr({ framePath, chain, name, timeout }) { return request({ framePath, chain, timeout, pick: { attr: name } }); },
    async prop({ framePath, chain, name, timeout }) { return request({ framePath, chain, timeout, pick: { prop: name } }); },
    async text({ framePath, chain, timeout }) { return request({ framePath, chain, timeout, pick: { text: true } }); },
    async html({ framePath, chain, timeout }) { return request({ framePath, chain, timeout, pick: { html: true } }); },
    async rect({ framePath, chain, timeout }) { return request({ framePath, chain, timeout, pick: { rect: true } }); },
    version: '2.1.1-client'
  };

  // 推荐：在本沙箱全局暴露 DeepQuery
  try { window.DeepQuery = DeepQuery; } catch {}

  // 可选：零改动代理（仅当前沙箱可见，不暴露给页面）
  if (EXPOSE_TOP_PROXY) {
    try {
      Object.defineProperty(window.top, 'DeepQuery', {
        configurable: true,
        get() { return DeepQuery; }
      });
    } catch {}
  }
})();
