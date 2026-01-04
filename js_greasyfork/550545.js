// ==UserScript==
// @name         通用自动登录（只填域名，登录时保存账号密码）
// @version      1.1.3
// @description  仅配置域名列表；首次在该域名登录时弹窗输入账号密码并保存（按域名分别保存），后续自动填充并提交。热键：Ctrl+Shift+D 添加/移除当前域名；Ctrl+Shift+U 打开管理面板。
// @author       Chill
// @match        *://*/*
// @run-at       document-idle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @icon         https://raw.githubusercontent.com/Chill-lucky/icons/main/loginn.png
// @license      MIT
// @namespace https://chill.dev
// @downloadURL https://update.greasyfork.org/scripts/550545/%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E5%8F%AA%E5%A1%AB%E5%9F%9F%E5%90%8D%EF%BC%8C%E7%99%BB%E5%BD%95%E6%97%B6%E4%BF%9D%E5%AD%98%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550545/%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E5%8F%AA%E5%A1%AB%E5%9F%9F%E5%90%8D%EF%BC%8C%E7%99%BB%E5%BD%95%E6%97%B6%E4%BF%9D%E5%AD%98%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const CONFIG = {
    DOMAINS: [
      // 在这里写你的域名，比如：
       "qb.xxx.xxx:666",
       "mp.xxx.xxx:666",
    ],
    MAX_ATTEMPTS: 5,         // 自动填充/提交最大尝试次数
    REQUIRE_PASSWORD_INPUT: true, // 仅在页面看到密码框才触发
    SUBMIT_DELAY_MS: 120,    // 提交前小延迟（有些前端需要）
  };

  /** 默认选择器（已覆盖大多数前端） */
  const SELECTORS = {
    user: [
      'input[name="username"]',
      'input#username',
      'input[autocomplete="username"]',
      'input[type="text"]'
    ],
    pass: [
      'input[name="password"]',
      'input#password',
      'input[autocomplete="current-password"]',
      'input[type="password"]'
    ],
    submit: [
      'button[type="submit"]',
      'input[type="submit"]',
      'button.login',
      'button#login',
      'button[name="Login"]'
    ],
    form: [
      'form[action*="login"]',
      'form[action*="auth"]',
      'form'
    ]
  };

  /** 存储键 */
  const KEY = {
    ENABLED_HOSTS: 'AL_enabled_hosts', // string[] 已启用的域名（不含协议）
    CREDS_MAP:     'AL_creds_map',     // { [host]: {u:string, p:string} }
  };

  /** GM 存取封装 */
  const Store = {
    async get(key, fallback) {
      try {
        const v = await GM.getValue(key);
        return v ?? fallback;
      } catch {
        return fallback;
      }
    },
    async set(key, value) {
      return GM.setValue(key, value);
    },
    async del(key) {
      return GM.deleteValue(key);
    }
  };

  /** 工具函数 */
  const host = location.host; // 含端口
  function pickFirst(list) {
    for (const sel of list) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
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
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(el, value);
    } catch { el.value = value; }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function looksLikeLoginPage() {
    const hasPwd = !!document.querySelector('input[type="password"]');
    const pathLooks = /(login|auth|signin)/i.test(location.pathname + location.hash);
    return CONFIG.REQUIRE_PASSWORD_INPUT ? hasPwd : (hasPwd || pathLooks);
  }

  /** UI：简单管理面板（当前域名） */
  function ensureStyle() {
    if (document.getElementById('AL_style')) return;
    const style = document.createElement('style');
    style.id = 'AL_style';
    style.textContent = `
      #AL_backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483647;display:flex;align-items:center;justify-content:center}
      #AL_modal{width:420px;background:#fff;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.25);padding:18px;font-family:system-ui,-apple-system,Segoe UI,Roboto}
      #AL_modal h3{margin:0 0 10px;font-size:16px;text-align:center}
      #AL_modal p{margin:6px 0 10px;color:#444;font-size:13px}
      #AL_modal code{background:#f3f4f6;padding:2px 6px;border-radius:4px}
      #AL_modal input{width:100%;padding:10px;margin:8px 0;border:1px solid #ddd;border-radius:8px;box-sizing:border-box}
      #AL_modal .row{display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between}
      #AL_modal button{padding:9px 12px;border-radius:8px;border:none;cursor:pointer;font-weight:600}
      #AL_modal .primary{background:#2563eb;color:#fff}
      #AL_modal .muted{background:#eef2f7;color:#111}
      #AL_modal .danger{background:#ef4444;color:#fff}
      #AL_tip{font-size:12px;color:#666;text-align:center;margin-top:6px}
    `;
    document.head.appendChild(style);
  }

  async function openPanel(initMsg) {
    ensureStyle();
    const wrap = document.createElement('div');
    wrap.id = 'AL_wrap';
    wrap.innerHTML = `
      <div id="AL_backdrop" role="dialog" aria-modal="true">
        <div id="AL_modal">
          <h3>自动登录管理（当前域名）</h3>
          <p>${initMsg || ''}域名：<code>${host}</code></p>
          <input id="AL_user" placeholder="用户名" autocomplete="username"/>
          <input id="AL_pass" type="password" placeholder="密码" autocomplete="current-password"/>
          <div class="row">
            <button id="AL_save" class="primary">保存凭据</button>
            <button id="AL_enable" class="muted">加入/移出自动登录名单</button>
            <button id="AL_clear" class="danger">清除凭据</button>
            <button id="AL_close" class="muted">关闭</button>
          </div>
          <div id="AL_tip">热键：<b>Ctrl+Shift+D</b> 加入/移出自动登录；<b>Ctrl+Shift+U</b> 打开此面板。</div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    // 预填当前域名的凭据
    const map = await Store.get(KEY.CREDS_MAP, {});
    const cur = map && typeof map === 'object' ? map[host] : null;
    if (cur) {
      document.getElementById('AL_user').value = cur.u || '';
      document.getElementById('AL_pass').value = cur.p || '';
    }

    // 加入/移出名单按钮文案
    const list = await getEnabledHosts();
    const enabled = list.includes(host);
    document.getElementById('AL_enable').textContent = enabled ? '移出自动登录名单' : '加入自动登录名单';

    // 事件
    document.getElementById('AL_save').onclick = async () => {
      const u = document.getElementById('AL_user').value.trim();
      const p = document.getElementById('AL_pass').value;
      if (!u || !p) return alert('请填写用户名和密码');
      const m = await Store.get(KEY.CREDS_MAP, {}) || {};
      m[host] = { u, p };
      await Store.set(KEY.CREDS_MAP, m);
      alert('已保存该域名的凭据。');
    };
    document.getElementById('AL_enable').onclick = async () => {
      let l = await getEnabledHosts();
      const i = l.indexOf(host);
      if (i >= 0) l.splice(i, 1); else l.push(host);
      await Store.set(KEY.ENABLED_HOSTS, l);
      alert(i >= 0 ? '已移出自动登录名单。' : '已加入自动登录名单。');
      document.getElementById('AL_enable').textContent = i >= 0 ? '加入自动登录名单' : '移出自动登录名单';
    };
    document.getElementById('AL_clear').onclick = async () => {
      if (!confirm('确认清除该域名保存的用户名与密码？')) return;
      const m = await Store.get(KEY.CREDS_MAP, {}) || {};
      delete m[host];
      await Store.set(KEY.CREDS_MAP, m);
      alert('已清除。');
      document.getElementById('AL_user').value = '';
      document.getElementById('AL_pass').value = '';
    };
    document.getElementById('AL_close').onclick = () => wrap.remove();
  }

  /** 启用名单（域名列表，和 CONFIG.DOMAINS 合并去重） */
  async function getEnabledHosts() {
    const saved = await Store.get(KEY.ENABLED_HOSTS, []);
    const preset = Array.isArray(CONFIG.DOMAINS) ? CONFIG.DOMAINS : [];
    const merged = Array.from(new Set([...(Array.isArray(saved) ? saved : []), ...preset]));
    // 自动回写合并结果，保证下次读取一致
    await Store.set(KEY.ENABLED_HOSTS, merged);
    return merged;
  }

  /** 首次遇到启用域名但无凭据 → 弹窗让你填一次保存 */
  async function ensureCredsFor(host) {
    const m = await Store.get(KEY.CREDS_MAP, {}) || {};
    if (m[host] && m[host].u && m[host].p) return m[host];
    await openPanel('首次使用，请为该域名保存账号密码。');
    return null;
  }

  /** 自动填充与提交 */
  let attempts = 0;
  async function autoLoginOnce() {
    attempts++;
    if (attempts > CONFIG.MAX_ATTEMPTS) return;

    // 仅在看到密码框才触发（默认）
    if (!looksLikeLoginPage()) return;

    const credsMap = await Store.get(KEY.CREDS_MAP, {}) || {};
    const creds = credsMap[host];
    if (!creds || !creds.u || !creds.p) return; // 没凭据就不动

    // 找元素
    let userEl = pickFirst(SELECTORS.user);
    if (!userEl) {
      try { userEl = await waitForSelector(SELECTORS.user.join(','), 6000); } catch {}
    }
    let passEl = pickFirst(SELECTORS.pass);
    if (!passEl) {
      try { passEl = await waitForSelector(SELECTORS.pass.join(','), 6000); } catch {}
    }
    if (!userEl || !passEl) {
      setTimeout(autoLoginOnce, 1200);
      return;
    }

    // 填写
    setNativeInputValue(userEl, creds.u);
    setNativeInputValue(passEl, creds.p);

    const doSubmit = () => {
      const btn = pickFirst(SELECTORS.submit);
      if (btn) {
        btn.click();
      } else {
        // 回车 & 兜底 form.submit()
        passEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
        passEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true }));
        const form = pickFirst(SELECTORS.form);
        if (form && typeof form.submit === 'function') form.submit();
      }

      // 2s 后还在登录页，再试一次（最多 MAX_ATTEMPTS 次）
      setTimeout(() => {
        if (document.querySelector('input[type="password"]')) {
          if (attempts < CONFIG.MAX_ATTEMPTS) setTimeout(autoLoginOnce, 1200);
        }
      }, 2000);
    };

    const delay = Number(CONFIG.SUBMIT_DELAY_MS || 0);
    if (delay > 0) setTimeout(doSubmit, delay); else doSubmit();
  }

  /** 启动逻辑 */
  window.addEventListener('load', async () => {
    const enabledHosts = await getEnabledHosts();
    if (!enabledHosts.includes(host)) return; // 当前域名不在启用清单

    // 若没有保存过凭据，先引导保存一次
    const creds = await ensureCredsFor(host);
    if (!creds) return; // 等你在面板保存后手动刷新或热键触发

    // 稍等页面初始化，再尝试自动登录
    setTimeout(autoLoginOnce, 350);
  });

  /** 热键：
   *  Ctrl+Shift+D → 将当前域名加入/移出启用清单
   *  Ctrl+Shift+U → 打开面板（设置当前域名账号/密码）
   */
  window.addEventListener('keydown', async (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
      e.preventDefault();
      const list = await getEnabledHosts();
      const i = list.indexOf(host);
      if (i >= 0) list.splice(i, 1); else list.push(host);
      await Store.set(KEY.ENABLED_HOSTS, list);
      alert(i >= 0 ? `已将 ${host} 移出自动登录名单` : `已将 ${host} 加入自动登录名单`);
    }
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyU') {
      e.preventDefault();
      openPanel();
    }
  });

  console.log('[通用自动登录（域名版）] 已加载。编辑 CONFIG.DOMAINS 或用 Ctrl+Shift+D/ U 管理。');
})();
