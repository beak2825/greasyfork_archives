// ==UserScript==
// @name           Alternative to TikTok
// @name:es        TikTok Alternativo
// @author         tivp
// @description    Redirect TikTok to TikNot (both videos and photos).
// @match          https://www.tiktok.com/*
// @match          https://m.tiktok.com/*
// @match          https://vm.tiktok.com/*
// @match          https://vt.tiktok.com/*
// @match          https://tiknot.netlify.app/*
// @run-at         document-start
// @version        2026-02-14
// @grant          none
// @namespace https://greasyfork.org/users/1228259
// @downloadURL https://update.greasyfork.org/scripts/562182/Alternative%20to%20TikTok.user.js
// @updateURL https://update.greasyfork.org/scripts/562182/Alternative%20to%20TikTok.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG = {
    TIKTOK_BASE: 'https://www.tiktok.com',
    TIKNOT_BASE: 'https://tiknot.netlify.app',

    COOKIE_ACTIVE: 'tiktok_alt_redirect_active',
    COOKIE_ORIGIN: 'tiktok_alt_origin_url',
    COOKIE_ORIGIN_KEY: 'tiktok_alt_origin_key',

    PARAM_ORIGIN: 'tt_origin',
    PARAM_KEY: 'tt_key',
    PARAM_ACTIVE: 'tt_active',

    RE_TIKTOK_CONTENT: /^\/@([^/]+)\/(video|photo)\/([a-zA-Z0-9]+)/,
    RE_TIKNOT_VIDEO: /^\/video\/([a-zA-Z0-9]+)/,

    ORIGIN_TTL_DAYS: 1,
    WATCHDOG_MS: 900,

    UI: {
      label: 'Sitio Alternativo',
      modalTitle: 'Sin Registro de Origen',
      modalText:
        'No existe un registro válido del enlace de TikTok para este contenido.\n\nEntraste directamente aquí, por lo que no es posible volver al TikTok correcto.',
      modalBtn: 'Entendido'
    }
  };

  const Utils = {
    setCookie(name, value, days = 365) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${encodeURIComponent(String(value))};expires=${date.toUTCString()};path=/;SameSite=Lax`;
    },

    getCookie(name) {
      const safe = name.replace(/[.$?*|{}()[\$\\/+^]/g, '\\$&');
      const m = document.cookie.match(new RegExp('(?:^|; )' + safe + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : null;
    },

    delCookie(name) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
    },

    isRedirectActive() {
      const v = Utils.getCookie(CONFIG.COOKIE_ACTIVE);
      return v !== 'false';
    },

    waitForBody(cb) {
      if (document.body) return cb();
      const id = setInterval(() => {
        if (document.body) {
          clearInterval(id);
          cb();
        }
      }, 50);
    },

    readActiveHandoff() {
      try {
        const u = new URL(window.location.href);
        let v = u.searchParams.get(CONFIG.PARAM_ACTIVE);

        if (u.hash && u.hash.length > 1) {
          const h = u.hash.slice(1);
          if (h.includes('=')) {
            const hp = new URLSearchParams(h);
            const hv = hp.get(CONFIG.PARAM_ACTIVE);
            if (hv !== null) v = hv;
          }
        }
        return v;
      } catch (_) {
        return null;
      }
    },

    stripQueryParam(paramName) {
      try {
        const u = new URL(window.location.href);
        if (!u.searchParams.has(paramName)) return false;
        u.searchParams.delete(paramName);
        const clean =
          u.pathname +
          (u.searchParams.toString() ? '?' + u.searchParams.toString() : '') +
          (u.hash || '');
        history.replaceState({}, '', clean);
        return true;
      } catch (_) {
        return false;
      }
    },

    stripActiveFromHashIfPresent() {
      try {
        const u = new URL(window.location.href);
        if (!u.hash || u.hash.length <= 1) return false;
        const h = u.hash.slice(1);
        if (!h.includes('=')) return false;
        const hp = new URLSearchParams(h);
        if (!hp.has(CONFIG.PARAM_ACTIVE)) return false;
        hp.delete(CONFIG.PARAM_ACTIVE);
        const newHash = hp.toString();
        const clean = u.pathname + (u.search || '') + (newHash ? '#' + newHash : '');
        history.replaceState({}, '', clean);
        return true;
      } catch (_) {
        return false;
      }
    },

    appendActiveToUrlAsHash(urlStr, activeValue) {
      try {
        const u = new URL(urlStr);
        const hash = u.hash && u.hash.length > 1 ? u.hash.slice(1) : '';
        const hp = new URLSearchParams(hash.includes('=') ? hash : '');
        hp.set(CONFIG.PARAM_ACTIVE, String(activeValue));
        u.hash = hp.toString();
        return u.toString();
      } catch (_) {
        return urlStr;
      }
    },

    setUrlParam(urlStr, key, value) {
      const u = new URL(urlStr);
      u.searchParams.set(key, value);
      return u.toString();
    }
  };

  const Key = {
    fromTikTokLocation() {
      try {
        const u = new URL(window.location.href);
        if (u.host.startsWith('vm.') || u.host.startsWith('vt.')) return null;
        const m = u.pathname.match(CONFIG.RE_TIKTOK_CONTENT);
        if (!m) return null;
        const type = m[2];
        const id = m[3];

        if (type === 'video' || type === 'photo') return `video:${id}`;

        return null;
      } catch (_) {
        return null;
      }
    },

    fromAltLocation() {
      const host = window.location.host;
      const path = window.location.pathname;

      if (host.includes('tiknot.netlify.app')) {
        const m = path.match(CONFIG.RE_TIKNOT_VIDEO);
        if (!m) return null;
        return `video:${m[1]}`;
      }

      return null;
    }
  };

  const Router = {
    getSiteType() {
      const h = window.location.host;
      if (h.includes('tiknot.netlify.app')) return 'TIKNOT';
      if (h.includes('tiktok.com')) return 'TIKTOK';
      return 'UNKNOWN';
    },

    isEligibleAltPage() {
      const site = Router.getSiteType();
      const path = window.location.pathname;

      if (site === 'TIKNOT') return CONFIG.RE_TIKNOT_VIDEO.test(path);
      return false;
    },

    handleIncomingOnTikTok() {
      const v = Utils.readActiveHandoff();
      if (v === null) return;

      const normalized = String(v).toLowerCase();
      if (normalized === 'false' || normalized === '0' || normalized === 'off') {
        Utils.setCookie(CONFIG.COOKIE_ACTIVE, 'false', 365);
      } else if (normalized === 'true' || normalized === '1' || normalized === 'on') {
        Utils.setCookie(CONFIG.COOKIE_ACTIVE, 'true', 365);
      }

      Utils.stripQueryParam(CONFIG.PARAM_ACTIVE);
      Utils.stripActiveFromHashIfPresent();
    },

    handleIncomingOnAlt() {
      if (!Router.isEligibleAltPage()) return;

      try {
        const u = new URL(window.location.href);
        const origin = u.searchParams.get(CONFIG.PARAM_ORIGIN);
        const key = u.searchParams.get(CONFIG.PARAM_KEY);

        let wrote = false;

        if (origin) {
          Utils.setCookie(CONFIG.COOKIE_ORIGIN, origin, CONFIG.ORIGIN_TTL_DAYS);
          wrote = true;
        }
        if (key) {
          Utils.setCookie(CONFIG.COOKIE_ORIGIN_KEY, key, CONFIG.ORIGIN_TTL_DAYS);
          wrote = true;
        }

        if (origin && !key) {
          const curKey = Key.fromAltLocation();
          if (curKey) Utils.setCookie(CONFIG.COOKIE_ORIGIN_KEY, curKey, CONFIG.ORIGIN_TTL_DAYS);
        }

        if (wrote) history.replaceState({}, '', u.pathname + (u.hash || ''));
      } catch (_) {}
    },

    toAlternativeFromTikTok() {
      const key = Key.fromTikTokLocation();
      if (!key) return null;

      try {
        const u = new URL(window.location.href);
        const m = u.pathname.match(CONFIG.RE_TIKTOK_CONTENT);
        if (!m) return null;

        const type = m[2];
        const id = m[3];

        let target = null;
        if (type === 'video' || type === 'photo') {
            target = `${CONFIG.TIKNOT_BASE}/video/${id}`;
        }

        if (!target) return null;

        let out = target;
        out = Utils.setUrlParam(out, CONFIG.PARAM_ORIGIN, window.location.href);
        out = Utils.setUrlParam(out, CONFIG.PARAM_KEY, key);
        return out;
      } catch (_) {
        return null;
      }
    },

    currentAltHasValidOrigin() {
      if (!Router.isEligibleAltPage()) return false;

      const origin = Utils.getCookie(CONFIG.COOKIE_ORIGIN);
      const storedKey = Utils.getCookie(CONFIG.COOKIE_ORIGIN_KEY);
      const currentKey = Key.fromAltLocation();

      if (!origin || !storedKey || !currentKey) return false;
      return storedKey === currentKey;
    },

    toTikTokFromOriginCookie() {
      if (!Router.currentAltHasValidOrigin()) return null;
      return Utils.getCookie(CONFIG.COOKIE_ORIGIN);
    },

    clearAltOriginCookies() {
      Utils.delCookie(CONFIG.COOKIE_ORIGIN);
      Utils.delCookie(CONFIG.COOKIE_ORIGIN_KEY);
    }
  };

  const UI = {
    box: null,
    checkbox: null,
    modal: null,

    injectStyles() {
      if (document.getElementById('tt-alt-styles')) return;
      const s = document.createElement('style');
      s.id = 'tt-alt-styles';
      s.textContent = `
        .tt-alt-box{position:fixed;bottom:20px;left:20px;z-index:2147483647;display:flex;align-items:center;gap:12px;background:#121212;padding:10px 16px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.6);border:1px solid #333;font-family:system-ui,-apple-system,sans-serif;user-select:none}
        .tt-alt-label{font-size:13px;font-weight:600;color:#fff}
        .tt-ios-switch{position:relative;display:inline-block;width:44px;height:24px}
        .tt-ios-switch input{opacity:0;width:0;height:0}
        .tt-slider{position:absolute;cursor:pointer;inset:0;background-color:#3a3a3a;transition:.3s;border-radius:24px}
        .tt-slider:before{position:absolute;content:"";height:18px;width:18px;left:3px;bottom:3px;background-color:#fff;transition:.3s;border-radius:50%}
        input:checked + .tt-slider{background-color:#FE2C55}
        input:checked + .tt-slider:before{transform:translateX(20px)}
        .tt-locked{opacity:.72}
        .tt-locked .tt-slider{cursor:not-allowed}
        .tt-locked .tt-alt-label{color:#d6d6d6}
        .tt-modal-overlay{position:fixed;inset:0;z-index:2147483648;background:rgba(0,0,0,.62);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .25s ease}
        .tt-modal-card{width:min(420px,92vw);background:rgba(25,25,25,.9);border:1px solid rgba(255,255,255,.08);border-radius:24px;box-shadow:0 25px 60px rgba(0,0,0,.6);padding:28px 26px;color:#fff;font-family:system-ui,-apple-system,sans-serif;transform:scale(.96);transition:transform .25s ease}
        .tt-modal-head{display:flex;align-items:center;justify-content:center;margin-bottom:14px}
        .tt-modal-icon{width:48px;height:48px;color:#FE2C55}
        .tt-modal-title{font-size:18px;font-weight:750;margin:0 0 10px 0;text-align:center}
        .tt-modal-text{white-space:pre-line;font-size:14px;line-height:1.5;color:#bdbdbd;margin:0 0 18px 0;text-align:center}
        .tt-modal-btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 22px;border-radius:999px;border:none;background:#fff;color:#000;font-weight:700;font-size:14px;cursor:pointer;width:100%}
        .tt-show{opacity:1}
        .tt-show .tt-modal-card{transform:scale(1)}
      `;
      document.head.appendChild(s);
    },

    ensureModal() {
      if (UI.modal) return;

      const overlay = document.createElement('div');
      overlay.id = 'tt-no-origin-modal';
      overlay.className = 'tt-modal-overlay';
      overlay.innerHTML = `
        <div class="tt-modal-card" role="dialog" aria-modal="true">
          <div class="tt-modal-head">
            <div class="tt-modal-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
          </div>
          <h3 class="tt-modal-title">${CONFIG.UI.modalTitle}</h3>
          <p class="tt-modal-text">${CONFIG.UI.modalText}</p>
          <button class="tt-modal-btn" type="button">${CONFIG.UI.modalBtn}</button>
        </div>
      `;

      UI.modal = overlay;

      const close = () => {
        overlay.classList.remove('tt-show');
        setTimeout(() => overlay.remove(), 220);
        UI.modal = null;
      };

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
      });
      overlay.querySelector('.tt-modal-btn').addEventListener('click', close);
    },

    showNoOriginModal() {
      UI.ensureModal();
      document.body.appendChild(UI.modal);
      requestAnimationFrame(() => UI.modal && UI.modal.classList.add('tt-show'));
    },

    destroy() {
      const el = document.getElementById('tt-alt-ui');
      if (el) el.remove();
      UI.box = null;
      UI.checkbox = null;
    },

    create() {
      if (document.getElementById('tt-alt-ui')) return;
      UI.injectStyles();

      const box = document.createElement('div');
      box.id = 'tt-alt-ui';
      box.className = 'tt-alt-box';
      box.innerHTML = `
        <span class="tt-alt-label">${CONFIG.UI.label}</span>
        <label class="tt-ios-switch">
          <input type="checkbox" autocomplete="off">
          <span class="tt-slider"></span>
        </label>
      `;

      UI.box = box;
      UI.checkbox = box.querySelector('input');

      UI.checkbox.addEventListener('click', (e) => {
        const site = Router.getSiteType();
        if (site !== 'TIKTOK') {
          if (!Router.isEligibleAltPage() || !Router.currentAltHasValidOrigin()) {
            e.preventDefault();
            e.stopPropagation();
            Router.clearAltOriginCookies();
            UI.showNoOriginModal();
          }
        }
      });

      UI.checkbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        const site = Router.getSiteType();

        if (site === 'TIKTOK') {
          Utils.setCookie(CONFIG.COOKIE_ACTIVE, String(isChecked), 365);
          if (isChecked) {
            const target = Router.toAlternativeFromTikTok();
            if (target) window.location.replace(target);
            else window.location.reload();
          }
          return;
        }

        if (!isChecked) {
          const origin = Router.toTikTokFromOriginCookie();
          if (!origin) {
            e.target.checked = true;
            UI.showNoOriginModal();
            return;
          }
          const backUrl = Utils.appendActiveToUrlAsHash(origin, 'false');
          window.location.href = backUrl;
        }
      });

      document.body.appendChild(box);
      UI.updateState();
    },

    updateState() {
      if (!UI.checkbox || !UI.box) return;

      const site = Router.getSiteType();

      if (site === 'TIKTOK') {
        UI.box.classList.remove('tt-locked');
        UI.checkbox.checked = Utils.isRedirectActive();
        return;
      }

      if (!Router.isEligibleAltPage()) {
        UI.destroy();
        return;
      }

      UI.checkbox.checked = true;

      if (!Router.currentAltHasValidOrigin()) UI.box.classList.add('tt-locked');
      else UI.box.classList.remove('tt-locked');
    }
  };

  const App = {
    run() {
      const site = Router.getSiteType();

      if (site === 'TIKTOK') Router.handleIncomingOnTikTok();
      else Router.handleIncomingOnAlt();

      const active = Utils.isRedirectActive();

      if (site === 'TIKTOK') {
        const target = Router.toAlternativeFromTikTok();
        if (active && target) {
          window.location.replace(target);
          return;
        }
        Utils.waitForBody(() => {
          UI.create();
          UI.updateState();
        });
        return;
      }

      if (site === 'TIKNOT') {
        if (!Router.isEligibleAltPage()) {
          Utils.waitForBody(() => UI.destroy());
          return;
        }

        Utils.waitForBody(() => {
          UI.create();
          UI.updateState();
        });
      }
    },

    init() {
      const _pushState = history.pushState;
      history.pushState = function () {
        const r = _pushState.apply(this, arguments);
        App.run();
        return r;
      };

      const _replaceState = history.replaceState;
      history.replaceState = function () {
        const r = _replaceState.apply(this, arguments);
        App.run();
        return r;
      };

      window.addEventListener('popstate', App.run, true);
      window.addEventListener('hashchange', App.run, true);

      let lastHref = '';
      setInterval(() => {
        if (!document.body) return;

        const href = window.location.href;
        if (href !== lastHref) {
          lastHref = href;
          App.run();
          return;
        }

        const site = Router.getSiteType();

        if (site === 'TIKTOK') {
          if (!document.getElementById('tt-alt-ui')) App.run();
          else UI.updateState();
          return;
        }

        if (site === 'TIKNOT') {
          if (!Router.isEligibleAltPage()) {
            if (document.getElementById('tt-alt-ui')) UI.destroy();
            return;
          }
          if (!document.getElementById('tt-alt-ui')) App.run();
          else UI.updateState();
        }
      }, CONFIG.WATCHDOG_MS);

      App.run();
    }
  };

  App.init();

})();