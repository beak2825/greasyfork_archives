// ==UserScript==
// @name         请求头注入 (Storage2Header)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  可配置的注入器：从 localStorage 或 cookie 读 key 并注入到请求 header（支持 fetch & XHR）
// @match        *://localhost.proxyman.io/*
// @match        *://test.proxyman.io/*
// @match        *://*.mfosunhani.com/*
// @match        *://*.fotechwealth.com/*
// @match        *://*.fosunhanihk.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554728/%E8%AF%B7%E6%B1%82%E5%A4%B4%E6%B3%A8%E5%85%A5%20%28Storage2Header%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554728/%E8%AF%B7%E6%B1%82%E5%A4%B4%E6%B3%A8%E5%85%A5%20%28Storage2Header%29.meta.js
// ==/UserScript==

/*
  使用说明：
  - 点击油猴图标，在当前脚本下拉菜单里选择"设置 localStorage Key"、"设置 Header 名称"或"切换日志开关"进行配置。
  - 修改保存后会自动刷新页面以应用新配置。
  - 读取优先级：优先从 localStorage 读取，如果取不到则从 cookie 读取（使用相同的 key 名称）。
  - 日志开关：默认开启，可通过菜单命令切换。关闭后将不会输出任何 console.log 日志。
*/

(function() {
  'use strict';

  // 默认配置
  const DEFAULT_KEY = 'rndKey';
  const DEFAULT_HEADER = 'X-RndKey';

  // 从 Tampermonkey 存储里读取（若无则使用默认）
  const storedKey = GM_getValue('rndKey', DEFAULT_KEY);
  const storedHeader = GM_getValue('headerName', DEFAULT_HEADER);
  const enableLog = GM_getValue('enableLog', true); // 日志开关，默认开启

  // 注册菜单命令：设置 localStorage key
  GM_registerMenuCommand('设置 localStorage Key (当前: ' + storedKey + ')', () => {
    const v = prompt('请输入 key 名称（优先从 localStorage 读取，取不到则从 cookie 读取）:', storedKey);
    if (v !== null) {
      GM_setValue('rndKey', v || DEFAULT_KEY);
      alert('localStorage key 已保存为：' + (v || DEFAULT_KEY) + '\n页面将会刷新以使其生效。');
      location.reload();
    }
  });

  // 注册菜单命令：设置 header 名称
  GM_registerMenuCommand('设置 Header 名称 (当前: ' + storedHeader + ')', () => {
    const v = prompt('请输入要注入的请求 header 名称（例如 X-RndKey）:', storedHeader);
    if (v !== null) {
      GM_setValue('headerName', v || DEFAULT_HEADER);
      alert('Header 名称已保存为：' + (v || DEFAULT_HEADER) + '\n页面将会刷新以使其生效。');
      location.reload();
    }
  });

  // 注册菜单命令：切换日志开关
  GM_registerMenuCommand('切换日志开关 (当前: ' + (enableLog ? '开启' : '关闭') + ')', () => {
    const newValue = !enableLog;
    GM_setValue('enableLog', newValue);
    alert('日志已' + (newValue ? '开启' : '关闭') + '，页面将会刷新以使其生效。');
    location.reload();
  });

  // 注册菜单命令：重置为默认
  GM_registerMenuCommand('重置为默认配置', () => {
    if (confirm('确认重置为默认配置？（' + DEFAULT_KEY + ' / ' + DEFAULT_HEADER + '）')) {
      GM_setValue('rndKey', DEFAULT_KEY);
      GM_setValue('headerName', DEFAULT_HEADER);
      GM_setValue('enableLog', true);
      alert('已重置为默认值，页面将刷新。');
      location.reload();
    }
  });

  // 构建要注入到页面上下文的脚本：把配置值以字面量传进去
  const injectedCode = '(' + (function(key, headerName, enableLog) {
    // 注入到页面上下文后执行的代码（接收 key、headerName 和 enableLog）
    (function() {
      try {
        // 暴露到 window 便于调试
        window.__rnd_key = key || 'rndKey';
        window.__rnd_header_name = headerName || 'X-RndKey';
        window.__rnd_enable_log = enableLog !== false; // 默认开启
      } catch (e) {}

      const W = window;
      const logEnabled = window.__rnd_enable_log !== false;

      // 日志辅助（中文），根据配置决定是否输出
      function safeLog(...args) {
        if (!logEnabled) return;
        try { console.log.apply(console, args); } catch (e) {}
      }

      if (W.__rnd_injector_installed) {
        safeLog('[header-injector] 已经安装，跳过重复安装');
        return;
      }
      W.__rnd_injector_installed = true;

      // 从 cookie 读取值
      function getCookie(name) {
        try {
          const value = '; ' + document.cookie;
          const parts = value.split('; ' + name + '=');
          if (parts.length === 2) {
            return parts.pop().split(';').shift();
          }
        } catch (e) {}
        return null;
      }

      // 读取值：优先从 localStorage，取不到则从 cookie
      function getRnd() {
        const keyName = window.__rnd_key || key;
        try {
          // 先尝试 localStorage
          const value = localStorage.getItem(keyName);
          if (value != null && value !== '') {
            return value;
          }
          // localStorage 取不到，尝试从 cookie 读取
          const cookieValue = getCookie(keyName);
          if (cookieValue != null && cookieValue !== '') {
            safeLog('[header-injector] localStorage 未找到，从 cookie 读取：', cookieValue);
            return cookieValue;
          }
          return null;
        } catch (e) {
          // 如果 localStorage 失败，尝试 cookie
          try {
            const cookieValue = getCookie(keyName);
            if (cookieValue != null && cookieValue !== '') {
              safeLog('[header-injector] localStorage 读取失败，从 cookie 读取：', cookieValue);
              return cookieValue;
            }
          } catch (e2) {}
          return null;
        }
      }

      // fetch wrapper
      function fetchWrapper(input, init) {
        try {
          const rnd = getRnd();
          safeLog('[header-injector] fetch 被调用，值：', rnd, '，input：', input);
          const headerNameLocal = window.__rnd_header_name || headerName;
          if (input instanceof Request) {
            const req = input.clone();
            const hdrs = new Headers(req.headers);
            hdrs.set(headerNameLocal, rnd == null ? '' : rnd);
            const newReq = new Request(req, { headers: hdrs });
            return (W.__rnd_original_fetch || W.fetch).call(this, newReq, init);
          } else {
            init = init ? Object.assign({}, init) : {};
            init.headers = new Headers(init.headers || {});
            init.headers.set(headerNameLocal, rnd == null ? '' : rnd);
            return (W.__rnd_original_fetch || W.fetch).call(this, input, init);
          }
        } catch (e) {
          safeLog('[header-injector] fetch 包装器出错：', e);
          return (W.__rnd_original_fetch || W.fetch).apply(this, arguments);
        }
      }

      // patch logic 封装，便于恢复
      function patchOnce() {
        try {
          // patch fetch
          try {
            if (!W.__rnd_original_fetch) W.__rnd_original_fetch = W.fetch;
            if (W.fetch !== fetchWrapper) {
              W.fetch = fetchWrapper;
              safeLog('[header-injector] fetch 已打补丁');
            }
          } catch (e) {
            safeLog('[header-injector] fetch 打补丁出错：', e);
          }

          // patch XHR
          try {
            const Xp = XMLHttpRequest.prototype;
            if (!Xp.__rnd_instrumented) {
              Xp.__rnd_orig_open = Xp.open;
              Xp.__rnd_orig_send = Xp.send;
              Xp.__rnd_orig_setReqHeader = Xp.setRequestHeader;

              Xp.open = function(method, url) {
                try { this.__rnd_method = method; this.__rnd_url = url; } catch (_) {}
                return Xp.__rnd_orig_open.apply(this, arguments);
              };

              Xp.setRequestHeader = function(name, value) {
                try {
                  this.__rnd_headers = this.__rnd_headers || {};
                  this.__rnd_headers[name] = value;
                } catch (_) {}
                return Xp.__rnd_orig_setReqHeader.apply(this, arguments);
              };

              Xp.send = function(body) {
                try {
                  const rnd = getRnd();
                  const headerNameLocal = window.__rnd_header_name || headerName;
                  safeLog('[header-injector] XHR.send 被调用 ->', this.__rnd_method, this.__rnd_url, '，值：', rnd, '，已有 headers：', this.__rnd_headers);
                  try {
                    if (typeof this.setRequestHeader === 'function') {
                      this.setRequestHeader(headerNameLocal, rnd == null ? '' : rnd);
                      safeLog('[header-injector] 已为 XHR 设置 ' + headerNameLocal + ' =', rnd);
                    }
                  } catch (e) {
                    safeLog('[header-injector] setRequestHeader 失败：', e);
                  }
                } catch (e) {
                  safeLog('[header-injector] XHR.send 包装器出错：', e);
                }
                return Xp.__rnd_orig_send.apply(this, arguments);
              };

              Xp.__rnd_instrumented = true;
              safeLog('[header-injector] XHR 已打补丁');
            } else {
              safeLog('[header-injector] XHR 已经 instrumented');
            }
          } catch (e) {
            safeLog('[header-injector] XHR 打补丁出错：', e);
          }
        } catch (e) {
          safeLog('[header-injector] patchOnce 顶层错误：', e);
        }
      }

      // 执行初始 patch
      safeLog('[header-injector] 尝试初始打补丁');
      patchOnce();

      // 自动恢复：若页面随后覆盖 fetch/XHR，则在短时间内重试
      let tries = 0;
      const MAX_TRIES = 40; // 20s
      const timer = setInterval(() => {
        tries++;
        try {
          if (W.fetch !== fetchWrapper) {
            safeLog('[header-injector] 发现 fetch 被替换，重新打补丁');
            patchOnce();
          }
          const Xp = XMLHttpRequest.prototype;
          if (!Xp.__rnd_instrumented && tries < MAX_TRIES) {
            safeLog('[header-injector] 发现 XHR instrument 丢失，重新打补丁');
            patchOnce();
          }
        } catch (e) {
          safeLog('[header-injector] 恢复检查错误：', e);
        }
        if (tries >= MAX_TRIES) {
          clearInterval(timer);
          safeLog('[header-injector] 恢复定时器结束，共尝试：', tries, '次');
        }
      }, 500);

      safeLog('[header-injector] 注入完成。localStorage key:', window.__rnd_key, ' header 名称:', window.__rnd_header_name);
    })();
  }).toString() + ')(' + JSON.stringify(storedKey) + ', ' + JSON.stringify(storedHeader) + ', ' + JSON.stringify(enableLog) + ');';

  // 注入到页面上下文（优先用 Blob 绕过 CSP）
  try {
    const blob = new Blob([injectedCode], { type: 'text/javascript' });
    const s = document.createElement('script');
    s.src = URL.createObjectURL(blob);
    s.onload = function() { URL.revokeObjectURL(this.src); this.remove(); };
    (document.head || document.documentElement).appendChild(s);
    if (enableLog) {
      console.log('[header-injector] blob 脚本已注入（Tampermonkey 上下文）');
    }
  } catch (e) {
    // 回退 inline 注入
    const s2 = document.createElement('script');
    s2.textContent = injectedCode;
    (document.head || document.documentElement).appendChild(s2);
    setTimeout(() => s2.remove(), 0);
    if (enableLog) {
      console.log('[header-injector] inline 脚本回退注入已完成（Tampermonkey 上下文）');
    }
  }
})();
