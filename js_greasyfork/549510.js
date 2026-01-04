// ==UserScript==
// @name         ChatGPT Patcher
// @namespace    ChatGPT Pro Patcher
// @author       zetaloop
// @version      0.1.0
// @description  让你的 ChatGPT 使用尊贵的 Pro 黑色消息气泡权益
// @match        *://chatgpt.com/*
// @run-at       document-start
// @grant        none
// @license      Unlicense  
// @downloadURL https://update.greasyfork.org/scripts/549510/ChatGPT%20Patcher.user.js
// @updateURL https://update.greasyfork.org/scripts/549510/ChatGPT%20Patcher.meta.js
// ==/UserScript==

(() => {
  const RULES = [
    // Example:
    // { path: '$.email', to: 'Welcome' },
    // { keys: ['email'], to: 'Welcome' },
    // { value: 'test@example.com', to: 'Welcome' },

    // Fake Pro
    //{ keys: ['planType', 'plan_type', 'subscriptionLevel'], to: 'pro' },
    //{ keys: ['subscriptionPlan'], to: 'chatgptproplan' },
    { keys: ['planType'], to: 'pro' },
  ];
  const MAX_DEPTH = 100;
  const QUIET = false;
  const PATCHED = Symbol.for('hook.Promise.then.patched');

  function shouldHitPath(sel, path) {
    if (!sel) return true;
    if (Array.isArray(sel)) return sel.some(s => shouldHitPath(s, path));
    if (typeof sel === 'string') return path === sel;
    if (sel instanceof RegExp) return sel.test(path);
    if (typeof sel === 'function') return !!sel(path);
    return false;
  }

  function shouldHitKey(keys, key, path) {
    if (!keys || keys === '*') return true;
    if (Array.isArray(keys)) return keys.includes(key);
    if (keys instanceof RegExp) return keys.test(key);
    if (typeof keys === 'function') return !!keys(key, path);
    return false;
  }

  function matchAndReplace(rule, key, val, path) {
    if (!shouldHitPath(rule.path, path)) return { hit: false };
    if (!shouldHitKey(rule.keys, key, path)) return { hit: false };

    const cond = rule.value;
    const matched = cond instanceof RegExp ? (typeof val === 'string' && cond.test(val))
                   : typeof cond === 'function' ? !!cond(val, key, path)
                   : cond !== undefined ? (val === cond)
                   : true;
    if (!matched) return { hit: false };

    const next = typeof rule.to === 'function' ? rule.to(val, key, path) : rule.to;
    return { hit: true, next };
  }

  const repr = (x) => (typeof x === 'string' ? `"${x}"` : String(x));

  function patchObject(root) {
    const seen = new WeakSet();
    let changed = 0;

    (function walk(obj, path, depth) {
      if (!obj || typeof obj !== 'object' || depth > MAX_DEPTH || seen.has(obj)) return;
      seen.add(obj);

      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          const v = obj[i];
          const here = `${path}[${i}]`;
          if (v && typeof v === 'object') {
            walk(v, here, depth + 1);
          } else {
            for (const r of RULES) {
              const { hit, next } = matchAndReplace(r, String(i), v, here);
              if (hit && next !== v) {
                if (!QUIET) console.info('[Hook] %s: %s -> %s', here, repr(v), repr(next));
                obj[i] = next; changed++; break;
              }
            }
          }
        }
        return;
      }

      for (const k of Object.keys(obj)) {
        try {
          const v = obj[k];
          const here = `${path}.${k}`;
          if (v && typeof v === 'object') {
            walk(v, here, depth + 1);
          } else {
            for (const r of RULES) {
              const { hit, next } = matchAndReplace(r, k, v, here);
              if (hit && next !== v) {
                if (!QUIET) console.info('[Hook] %s: %s -> %s', here, repr(v), repr(next));
                obj[k] = next; changed++; break;
              }
            }
          }
        } catch {}
      }
    })(root, '$', 0);

    return changed;
  }

  const ORIGINAL_THEN = Promise.prototype.then;
  if (!ORIGINAL_THEN[PATCHED]) {
    Object.defineProperty(ORIGINAL_THEN, PATCHED, { value: true });

    Promise.prototype.then = function(onFulfilled, onRejected) {
      const wrap = (fn) => function(v) {
        try {
          if (v && typeof v === 'object') {
            const n = patchObject(v) || (v.user && typeof v.user === 'object' ? patchObject(v.user) : 0);
            if (n > 0) console.info('[Hook] Promise result patched: %d change(s)', n);
          }
        } catch (e) {
          console.warn('[Hook] patch error:', e);
        }
        return typeof fn === 'function' ? fn(v) : v;
      };
      return ORIGINAL_THEN.call(this, wrap(onFulfilled), onRejected);
    };

    if (!QUIET) console.info('[Hook] Promise.then monkeypatched (%d rule%s)', RULES.length, RULES.length === 1 ? '' : 's');
  } else if (!QUIET) {
    console.info('[Hook] Promise.then already patched; skip');
  }
})();