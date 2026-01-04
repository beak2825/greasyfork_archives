// ==UserScript==
// @name         DeepQuery (cross-frame & shadow DOM inspector)
// @namespace    dq.v1
// @version      1.1.0
// @description  在所有页面/所有iframe/所有shadowRoot中深度定位元素，并在top窗口暴露统一查询接口供其他脚本使用
// @author       akira0245
// @match        http://*/*
// @match        https://*/*
// @include      about:blank
// @run-at       document-start
// @grant        none
// @license      AGPLv3
// @inject-into  page
// @downloadURL https://update.greasyfork.org/scripts/548361/DeepQuery%20%28cross-frame%20%20shadow%20DOM%20inspector%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548361/DeepQuery%20%28cross-frame%20%20shadow%20DOM%20inspector%29.meta.js
// ==/UserScript==
(function () {
  'use strict';

  /***********************
   * constants & utils
   ***********************/
  const VERSION = '1.1.0';
  const CHANNEL = '__DEEP_QUERY_V1__';
  const SHADOW_KEY = Symbol.for('__dq_shadow__');
  const isTop = window === window.top;

  const now = () => Date.now();
  const rid = () => (now().toString(36) + Math.random().toString(36).slice(2, 8)).toUpperCase();

  const toPlainRect = (r) => r ? ({
    x: r.x, y: r.y, width: r.width, height: r.height,
    top: r.top, left: r.left, right: r.right, bottom: r.bottom
  }) : null;

  const asArray = (v) => Array.isArray(v) ? v : (v == null ? [] : [v]);

  function safeQueryAll(root, selector) {
    try { return Array.from(root.querySelectorAll(selector)); }
    catch (e) { return []; }
  }

  function firstByIndex(list, index) {
    if (!list || !list.length) return null;
    if (typeof index === 'number') return list[index] || null;
    return list[0] || null;
  }

  /********************************************
   * 1) Shadow DOM hook (open + closed capture)
   ********************************************/
  (function hookAttachShadowEarly() {
    try {
      const orig = Element.prototype.attachShadow;
      if (!orig || orig.__dq_hooked__) return;
      Object.defineProperty(Element.prototype, 'attachShadow', {
        configurable: true,
        enumerable: false,
        writable: true,
        value: function (init) {
          const root = orig.call(this, init);
          // 记录 open/closed 的 shadowRoot 引用到一个 symbol 上
          try {
            Object.defineProperty(this, SHADOW_KEY, {
              configurable: true, enumerable: false, writable: false, value: root
            });
          } catch {}
          return root;
        }
      });
      Element.prototype.attachShadow.__dq_hooked__ = true;
    } catch {}
  })();

  // 对后续异步定义的 custom elements 也能捕获 closed SR；对已存在的 open SR 直接登记
  function ensureOpenShadowReference(host) {
    try {
      if (!host) return;
      if (host[SHADOW_KEY]) return; // 已有
      if (host.shadowRoot) {
        Object.defineProperty(host, SHADOW_KEY, {
          configurable: true, enumerable: false, writable: false, value: host.shadowRoot
        });
      }
    } catch {}
  }

  /********************************************
   * 2) Deep query across Shadow DOM
   ********************************************/
  /**
   * 支持两种写法的 chain：
   *  - 字符串：'app-root >>> my-widget >>> button.primary'
   *    规则：每个 '>>>' 表示“进入上一个匹配元素的 shadowRoot”
   *    等价于：[{find:'app-root'},{shadow:true},{find:'my-widget'},{shadow:true},{find:'button.primary'}]
   *  - 数组：[{find:'selector', index?}, {shadow:true}, ...]
   */
  function parseChain(chain) {
    if (typeof chain === 'string') {
      const parts = chain.split('>>>').map(s => s.trim()).filter(Boolean);
      const steps = [];
      parts.forEach((seg, i) => {
        if (i === 0) {
          steps.push({ find: seg });
        } else {
          steps.push({ shadow: true }, { find: seg });
        }
      });
      return steps;
    }
    return (Array.isArray(chain) ? chain : []);
  }

  function deepQueryOnce(rootLike, chainSteps) {
    let root = rootLike instanceof ShadowRoot || rootLike instanceof Document ? rootLike : document;
    let current = root;
    let lastEl = null;

    for (const step of chainSteps) {
      if (step.shadow) {
        if (!lastEl) return null;
        ensureOpenShadowReference(lastEl);
        const sr = lastEl.shadowRoot || lastEl[SHADOW_KEY];
        if (!sr) return null;
        current = sr;
        continue;
      }
      if (step.find) {
        const index = typeof step.index === 'number' ? step.index : null;
        const list = safeQueryAll(current, step.find);
        lastEl = firstByIndex(list, index);
        if (!lastEl) return null;
        continue;
      }
      // 其他 step 类型可扩展
      return null;
    }
    return lastEl;
  }

  async function waitForDeepQuery(rootLike, chainSteps, timeout = 0) {
    const start = now();
    const tryOnce = () => deepQueryOnce(rootLike, chainSteps);

    let el = tryOnce();
    if (el || !timeout) return el;

    return new Promise((resolve) => {
      const limit = start + timeout;
      const observer = new MutationObserver(() => {
        el = tryOnce();
        if (el) {
          observer.disconnect();
          resolve(el);
        } else if (now() > limit) {
          observer.disconnect();
          resolve(null);
        }
      });
      observer.observe(document, { childList: true, subtree: true, attributes: true });
      const t = setTimeout(() => { try { observer.disconnect(); } catch {} resolve(null); }, timeout);
      // 再来一次快照
      const tick = () => {
        el = tryOnce();
        if (el) {
          clearTimeout(t);
          try { observer.disconnect(); } catch {}
          resolve(el);
        } else if (now() <= limit) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    });
  }

  function pickInfo(el, pick = {}) {
    if (!el) return { ok: false, error: 'ELEMENT_NOT_FOUND' };

    const res = { ok: true, tag: el.tagName, exists: true };

    if (pick.attr) res.attr = el.getAttribute(pick.attr);
    if (pick.prop) try { res.prop = el[pick.prop]; } catch { res.prop = undefined; }
    if (pick.text) res.text = el.textContent;
    if (pick.html) res.html = el.innerHTML;
    if (pick.outerHTML) res.outerHTML = el.outerHTML;
    if (pick.value) res.value = (el.value !== undefined ? el.value : undefined);
    if (pick.rect) res.rect = toPlainRect(el.getBoundingClientRect ? el.getBoundingClientRect() : null);
    if (pick.styles && Array.isArray(pick.styles) && pick.styles.length) {
      const cs = getComputedStyle(el);
      const map = {};
      pick.styles.forEach(k => { map[k] = cs.getPropertyValue(k); });
      res.styles = map;
    }
    if (pick.dataset) {
      const dst = {};
      asArray(pick.dataset).forEach(k => { dst[k] = el.dataset ? el.dataset[k] : undefined; });
      res.dataset = dst;
    }

    return res;
  }

  /********************************************
   * 3) frame 路由（跨域通过 postMessage 逐级转发）
   ********************************************/
  // 选择子 frame：step 既可为字符串选择器，也可为 {selector, index}
  function findTargetFrames(step) {
    const cfg = (typeof step === 'string') ? { selector: step } : (step || {});
    const sel = cfg.selector || 'iframe';
    const all = safeQueryAll(document, sel).filter(n => n && n.tagName === 'IFRAME');
    if (!all.length) return [];
    if (typeof cfg.index === 'number') {
      const one = all[cfg.index];
      return one && one.contentWindow ? [one.contentWindow] : [];
    }
    return all.map(el => el.contentWindow).filter(Boolean);
  }

  const pending = new Map();

  function sendMessage(targetWin, payload) {
    try { targetWin.postMessage({ [CHANNEL]: payload }, '*'); } catch {}
  }

  window.addEventListener('message', async (e) => {
    const msg = e.data && e.data[CHANNEL];
    if (!msg) return;

    // 1) 内部 RPC 响应
    if (msg.cmd === 'RESP' && msg.id && pending.has(msg.id)) {
      const { resolve } = pending.get(msg.id);
      pending.delete(msg.id);
      resolve(msg.res);
      return;
    }

    // 2) 外部/子帧发来的查询请求：要么继续路由，要么在本帧执行
    if (msg.cmd === 'REQ') {
      const { id, route = {}, spec = {} } = msg;

      const framesLeft = Array.isArray(route.framePath) ? route.framePath : [];
      if (framesLeft.length > 0) {
        // 继续向下路由
        const [nextStep, ...rest] = framesLeft;
        const targets = findTargetFrames(nextStep);
        if (!targets.length) {
          sendMessage(e.source || window.parent, { cmd: 'RESP', id, res: { ok: false, error: 'FRAME_NOT_FOUND' } });
          return;
        }
        // fan-out：向匹配的目标逐个发请求，取第一个成功的
        const subResults = await Promise.all(targets.map(t => new Promise((resolve) => {
          const subId = rid();
          pending.set(subId, { resolve });
          sendMessage(t, { cmd: 'REQ', id: subId, route: { framePath: rest }, spec });
          // 子请求超时保护
          setTimeout(() => {
            if (pending.has(subId)) {
              pending.delete(subId);
              resolve({ ok: false, error: 'TIMEOUT_FORWARD' });
            }
          }, typeof spec.timeout === 'number' ? Math.max(200, spec.timeout) : 5000);
        })));

        const ok = subResults.find(r => r && r.ok);
        const res = ok || subResults[0] || { ok: false, error: 'NO_RESULT' };
        sendMessage(e.source || window.parent, { cmd: 'RESP', id, res });
        return;
      }

      // 在当前 frame 执行
      try {
        const chain = parseChain(spec.chain);
        let timeout = 0;
        if (typeof spec.timeout === 'number' && spec.timeout >= 0) timeout = spec.timeout;
        const el = await waitForDeepQuery(document, chain, timeout);
        const res = pickInfo(el, spec.pick || {});
        sendMessage(e.source || window.parent, { cmd: 'RESP', id, res });
      } catch (err) {
        sendMessage(e.source || window.parent, {
          cmd: 'RESP', id,
          res: { ok: false, error: 'EXEC_ERROR', message: String(err && err.message || err) }
        });
      }
    }

    // 3) 公共总线调用（给拿不到 window.DeepQuery 的脚本用）
    if (msg.cmd === 'PUBLIC_CALL') {
      const callId = msg.id || rid();
      DeepQuery.get(msg.spec || {}).then(res => {
        sendMessage(e.source || window, { cmd: 'PUBLIC_RETURN', id: callId, res });
      }).catch(err => {
        sendMessage(e.source || window, { cmd: 'PUBLIC_RETURN', id: callId, res: { ok: false, error: String(err) } });
      });
    }
  }, false);

  /********************************************
   * 4) 在本帧执行一次查询（也被 top 用到）
   ********************************************/
  async function execHere(spec = {}) {
    const chain = parseChain(spec.chain);
    const el = await waitForDeepQuery(document, chain, typeof spec.timeout === 'number' ? spec.timeout : 0);
    return pickInfo(el, spec.pick || {});
  }

  /********************************************
   * 5) 暴露统一 API：window.DeepQuery（建议从 top 调用）
   ********************************************/
  const DeepQuery = {
    version: VERSION,

    /**
     * 主入口：
     *   spec = {
     *     framePath?: (string | {selector:string,index?:number})[], // 从 top 开始逐级定位 iframe
     *     chain: string | {find?:string,index?:number}|{shadow:true}[], // 当前 frame 内部的深度定位链
     *     pick?: { attr?, prop?, text?, html?, outerHTML?, value?, rect?, styles?: string[], dataset?: string[] },
     *     timeout?: number   // 等待元素出现的超时时间 (ms)
     *   }
     */
    async get(spec = {}) {
      // 如果没有 framePath，且我们本身就在目标 frame，则直接本地执行
      const framePath = Array.isArray(spec.framePath) ? spec.framePath : [];
      if (!framePath.length) {
        return execHere(spec);
      }

      // 从当前帧向下转发：如果在顶层最好
      const firstTargets = findTargetFrames(framePath[0]);
      if (!firstTargets.length) {
        return { ok: false, error: 'FRAME_NOT_FOUND_TOP' };
      }

      // fan-out
      const results = await Promise.all(firstTargets.map(t => new Promise((resolve) => {
        const id = rid();
        pending.set(id, { resolve });
        sendMessage(t, { cmd: 'REQ', id, route: { framePath: framePath.slice(1) }, spec });
        setTimeout(() => {
          if (pending.has(id)) {
            pending.delete(id);
            resolve({ ok: false, error: 'TIMEOUT_FORWARD' });
          }
        }, typeof spec.timeout === 'number' ? Math.max(200, spec.timeout) : 5000);
      })));

      return results.find(r => r && r.ok) || results[0] || { ok: false, error: 'NO_RESULT' };
    },

    // 语法糖
    async attr({ framePath, chain, name, timeout }) {
      return this.get({ framePath, chain, timeout, pick: { attr: name } });
    },
    async prop({ framePath, chain, name, timeout }) {
      return this.get({ framePath, chain, timeout, pick: { prop: name } });
    },
    async text({ framePath, chain, timeout }) {
      return this.get({ framePath, chain, timeout, pick: { text: true } });
    },
    async html({ framePath, chain, timeout }) {
      return this.get({ framePath, chain, timeout, pick: { html: true } });
    },
    async rect({ framePath, chain, timeout }) {
      return this.get({ framePath, chain, timeout, pick: { rect: true } });
    },

    /**
     * 给拿不到 page 上 window.DeepQuery 的脚本使用：
     * 通过 window.postMessage 调用，协议见下。
     */
    publicCall(spec) {
      return new Promise((resolve) => {
        const id = rid();
        function onMsg(e) {
          const m = e.data && e.data[CHANNEL];
          if (!m || m.cmd !== 'PUBLIC_RETURN' || m.id !== id) return;
          window.removeEventListener('message', onMsg);
          resolve(m.res);
        }
        window.addEventListener('message', onMsg);
        window.postMessage({ [CHANNEL]: { cmd: 'PUBLIC_CALL', id, spec } }, '*');
      });
    }
  };

  // 在每个 frame/window 都挂一个（方便调试与链式转发），推荐从 top 调用
  try { window.DeepQuery = DeepQuery; } catch {}
  // 为了方便其他脚本（沙箱）访问，顶层也挂到 top（若同源可见）
  try { if (isTop) window.top.DeepQuery = DeepQuery; } catch {}

  // 控制台提示（可删）
  if (isTop) {
    try {
      console.debug(`[DeepQuery] v${VERSION} ready. API: top.DeepQuery.get({ framePath, chain, pick, timeout })`);
    } catch {}
  }
})();
