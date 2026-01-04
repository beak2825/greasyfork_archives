// ==UserScript==
// @name         Unraid 自动登录（通用/隐私版）
// @namespace    https://www.muooy.com/
// @version      1.1.0
// @description  自动为 Unraid 登录页填写账号与密码并提交。首访时询问是否对当前域名启用，避免暴露真实域名。支持 GM 安全存储与本地存储回退，热键 Ctrl+Shift+U 打开配置。
// @author       ChatGPT
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/xushier/HD-Icons/main/border-radius/Unraid_D.png
// @run-at       document-idle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550538/Unraid%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E9%80%9A%E7%94%A8%E9%9A%90%E7%A7%81%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550538/Unraid%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E9%80%9A%E7%94%A8%E9%9A%90%E7%A7%81%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** ===== 可调参数（通用版默认即可） ===== */
  const USE_GM = typeof GM !== 'undefined' && typeof GM.getValue === 'function'; // GM 安全存储优先
  const KEYS = {
    allow: 'UA_allowlist',  // JSON: string[] 允许的 origin 列表
    enabled: 'UA_enabled',  // 'true' | 'false'
    user: 'UA_user',        // 用户名
    pass: 'UA_pass'         // 密码
  };

  /** ===== 存储封装 ===== */
  const Store = {
    async get(k) { return USE_GM ? GM.getValue(k) : localStorage.getItem(k); },
    async set(k, v) { return USE_GM ? GM.setValue(k, v) : localStorage.setItem(k, v); },
    async del(k) { return USE_GM ? GM.deleteValue(k) : localStorage.removeItem(k); }
  };

  /** ===== 实用函数 ===== */
  const origin = location.origin;

  function looksLikeUnraidLogin() {
    // 兼容多版本/主题：标题或页面包含 “Unraid”，且当前页面有密码输入框
    const hasUnraidWord =
      /unraid/i.test(document.title) ||
      /unraid/i.test(document.body?.innerText || '');

    const hasPassword = !!document.querySelector('input[type="password"]');
    // 常见登录路径也加一点权重（非强制）
    const pathLooksLikeLogin = /login|auth/i.test(location.pathname + location.hash);

    return (hasPassword && (hasUnraidWord || pathLooksLikeLogin));
  }

  function waitForSelector(selector, timeout = 8000) {
    return new Promise((resolve, reject) => {
      const found = document.querySelector(selector);
      if (found) return resolve(found);

      const obs = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) { obs.disconnect(); resolve(el); }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => { obs.disconnect(); reject(new Error('timeout: ' + selector)); }, timeout);
    });
  }

  function setNativeInputValue(el, value) {
    if (!el) return;
    try {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, value);
    } catch { el.value = value; }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /** ===== 允许清单 ===== */
  async function getAllowlist() {
    try {
      const raw = await Store.get(KEYS.allow);
      if (!raw) return [];
      if (typeof raw === 'string') return JSON.parse(raw);
      return raw; // GM 可能直接存数组
    } catch { return []; }
  }

  async function setAllowlist(list) {
    return Store.set(KEYS.allow, JSON.stringify(Array.from(new Set(list))));
  }

  /** ===== 配置弹窗（域名授权 + 凭据设置） ===== */
  function ensureModalStyle() {
    if (document.getElementById('UA_modal_style')) return;
    const style = document.createElement('style');
    style.id = 'UA_modal_style';
    style.textContent = `
      #UA_modal_backdrop { position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:2147483647;
        display:flex; align-items:center; justify-content:center; }
      #UA_modal { width:460px; background:#fff; border-radius:10px; box-shadow:0 10px 30px rgba(0,0,0,.25);
        padding:18px; font-family:system-ui, -apple-system, "Segoe UI", Roboto; }
      #UA_modal h3 { margin:0 0 10px; font-size:16px; text-align:center; }
      #UA_modal p { margin:6px 0 10px; color:#444; font-size:13px; }
      #UA_modal code { background:#f3f4f6; padding:2px 6px; border-radius:4px; }
      #UA_modal input { width:100%; padding:10px; margin:8px 0; border:1px solid #ddd; border-radius:8px; box-sizing:border-box; }
      #UA_modal .row { display:flex; gap:8px; justify-content:space-between; flex-wrap:wrap; }
      #UA_modal button { padding:9px 12px; border-radius:8px; border:none; cursor:pointer; font-weight:600; }
      #UA_modal .primary { background:#2563eb; color:#fff; }
      #UA_modal .muted { background:#eef2f7; color:#111; }
      #UA_modal .danger { background:#ef4444; color:#fff; }
      #UA_tip { font-size:12px; color:#666; text-align:center; margin-top:6px; }
    `;
    document.head.appendChild(style);
  }

  function openModal({ askAllow = false, onClose } = {}) {
    ensureModalStyle();

    const wrap = document.createElement('div');
    wrap.id = 'UA_modal_wrap';
    wrap.innerHTML = `
      <div id="UA_modal_backdrop" role="dialog" aria-modal="true">
        <div id="UA_modal">
          <h3>Unraid 自动登录设置</h3>
          <p>${askAllow ? `检测到疑似 Unraid 登录页，是否对当前域名 <code>${origin}</code> 启用自动登录？` : '修改登录凭据或管理授权域名。'}</p>
          <input id="UA_user" placeholder="Unraid 用户名" autocomplete="username"/>
          <input id="UA_pass" type="password" placeholder="Unraid 密码" autocomplete="current-password"/>
          <div class="row">
            <button id="UA_save" class="primary">保存凭据并启用</button>
            <button id="UA_toggle" class="muted">启用/停用</button>
            <button id="UA_auth" class="muted">${askAllow ? '授权当前域名' : '管理授权域名'}</button>
            <button id="UA_clear" class="danger">清除凭据</button>
            <button id="UA_close" class="muted">关闭</button>
          </div>
          <div id="UA_tip">随时按 <b>Ctrl+Shift+U</b> 打开该窗口。</div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    (async () => {
      // 预填
      const u = (await Store.get(KEYS.user)) || '';
      const p = (await Store.get(KEYS.pass)) || '';
      document.getElementById('UA_user').value = typeof u === 'string' ? u : '';
      document.getElementById('UA_pass').value = typeof p === 'string' ? p : '';
    })();

    const close = () => { wrap.remove(); onClose && onClose(); };

    document.getElementById('UA_save').onclick = async () => {
      const u = document.getElementById('UA_user').value.trim();
      const p = document.getElementById('UA_pass').value;
      if (!u || !p) return alert('请填写用户名和密码');
      await Store.set(KEYS.user, u);
      await Store.set(KEYS.pass, p);
      await Store.set(KEYS.enabled, 'true');
      // 把当前域名加入 allowlist
      const list = await getAllowlist();
      if (!list.includes(origin)) {
        list.push(origin);
        await setAllowlist(list);
      }
      alert('已保存并启用。');
      close();
      tryAutoLogin(); // 立即尝试
    };

    document.getElementById('UA_toggle').onclick = async () => {
      const cur = await Store.get(KEYS.enabled);
      const next = cur === 'true' ? 'false' : 'true';
      await Store.set(KEYS.enabled, next);
      alert(`自动登录已${next === 'true' ? '启用' : '停用'}`);
    };

    document.getElementById('UA_auth').onclick = async () => {
      const list = await getAllowlist();
      const exists = list.includes(origin);
      if (askAllow || !exists) {
        if (!exists) { list.push(origin); await setAllowlist(list); alert('已授权当前域名。'); }
        else alert('当前域名已在授权列表中。');
      } else {
        const txt = prompt(`已授权的域名（每行一个，可编辑）：\n（当前：${origin}）`, list.join('\n'));
        if (txt != null) {
          const next = txt.split('\n').map(s => s.trim()).filter(Boolean);
          await setAllowlist(next);
          alert('已更新授权列表。');
        }
      }
    };

    document.getElementById('UA_clear').onclick = async () => {
      if (!confirm('确认清除保存的用户名与密码？')) return;
      await Store.del(KEYS.user);
      await Store.del(KEYS.pass);
      await Store.set(KEYS.enabled, 'false');
      alert('已清除。');
    };

    document.getElementById('UA_close').onclick = close;
  }

  /** ===== 自动登录主流程 ===== */
  let attempts = 0;
  async function tryAutoLogin() {
    attempts++;
    if (attempts > 6) return;

    const enabled = await Store.get(KEYS.enabled);
    if (enabled !== 'true') return;

    const allow = await getAllowlist();
    if (!allow.includes(origin)) return;

    const uname = await Store.get(KEYS.user);
    const upass = await Store.get(KEYS.pass);
    if (!uname || !upass) return;

    // 若无密码框，认为不是登录页（或已登录）
    if (!document.querySelector('input[type="password"]')) return;

    // 选择器兜底
    const userSelectors = [
      'input[name="username"]', 'input[name="login"]', 'input[name="user"]',
      'input#login_username', 'input[autocomplete="username"]', 'input[type="text"]'
    ];
    const passSelectors = [
      'input[name="password"]', 'input[name="pass"]',
      'input[type="password"]', 'input[autocomplete="current-password"]'
    ];
    const btnSelectors = [
      'button[type="submit"]', 'input[type="submit"]', 'button.login',
      'button#login_button', 'button[name="Login"]'
    ];

    function queryMulti(selectors) {
      for (const s of selectors) {
        const el = document.querySelector(s);
        if (el) return el;
      }
      return null;
    }

    try {
      // 等待出现输入框
      let userEl = queryMulti(userSelectors) || await waitForSelector(userSelectors.join(','), 6000);
      let passEl = queryMulti(passSelectors) || await waitForSelector(passSelectors.join(','), 6000);
      setNativeInputValue(userEl, typeof uname === 'string' ? uname : '');
      setNativeInputValue(passEl, typeof upass === 'string' ? upass : '');

      let btnEl = queryMulti(btnSelectors);
      if (btnEl) {
        btnEl.click();
      } else {
        passEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
        passEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true }));
      }

      // 简单检查是否仍在登录页，失败时给出一次机会打开设置
      setTimeout(async () => {
        if (document.querySelector('input[type="password"]')) {
          if (attempts >= 3) {
            await Store.set(KEYS.enabled, 'false');
            alert('自动登录可能失败，请检查账号密码或页面元素；已临时停用并打开设置窗口。');
            openModal({ askAllow: false });
          } else {
            setTimeout(tryAutoLogin, 1200);
          }
        }
      }, 1500);
    } catch (e) {
      // 忽略异常，避免干扰登录页
      // console.warn('AutoLogin error:', e);
    }
  }

  /** ===== 入口：仅在疑似 Unraid 登录页时提示授权 ===== */
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyU') {
      e.preventDefault();
      openModal({ askAllow: false });
    }
  });

  window.addEventListener('load', async () => {
    // 只在疑似 Unraid 登录页才打扰用户
    const allow = await getAllowlist();
    const enabled = await Store.get(KEYS.enabled);
    if (allow.includes(origin)) {
      if (enabled === 'true') setTimeout(tryAutoLogin, 300);
      return;
    }
    if (looksLikeUnraidLogin()) {
      // 首次发现疑似 Unraid：询问是否授权当前域名并设置凭据
      openModal({ askAllow: true });
    }
  });

  console.log('[Unraid 自动登录（通用/隐私版）] 已加载：不会暴露你的域名，需授权当前域名后才生效。');
})();
