// ==UserScript==
// @name                YouTube CPU-Tamer Upgrade (Firefox Optimized)
// @version             0.4.2
// @description         Optimize CPU and GPU usage while watching YouTube videos on Firefox
// @author              AstralRift
// @namespace           https://greasyfork.org/users/1300060
// @match               *://*.youtube.com/*
// @match               *://*.youtube-nocookie.com/embed/*
// @match               *://music.youtube.com/*
// @exclude             *://*.youtube.com/*/*.{txt,png,jpg,jpeg,gif,xml,svg,manifest,log,ini}
// @run-at              document-start
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/559844/YouTube%20CPU-Tamer%20Upgrade%20%28Firefox%20Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559844/YouTube%20CPU-Tamer%20Upgrade%20%28Firefox%20Optimized%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const win = typeof window !== 'undefined' ? window : this;

  const scriptKey = 'YTB_CPUTamer_AstralRift';
  if (win[scriptKey]) return;
  win[scriptKey] = true;

  const PromiseConstructor = Promise;

  const ExternalPromise = (function () {
    return function (cb) {
      let res, rej;
      const promise = new PromiseConstructor((resolve, reject) => {
        res = resolve;
        rej = reject;
      });
      if (!cb) {
        promise.resolve = res;
        promise.reject = rej;
      } else {
        cb(res, rej);
      }
      return promise;
    };
  })();

  const checkGPUAcceleration = (function () {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  })();

  if (!checkGPUAcceleration) return;

  const getTimeUpdate = (function () {
    // FIX: 统一用 win，避免 iframe/非顶层环境写错对象
    win.lastTimeUpdate = 1;

    document.addEventListener('timeupdate', () => {
      win.lastTimeUpdate = Date.now();
    }, { capture: true, passive: true });

    return function () {
      try {
        if (win.top && win.top !== win && win.top.lastTimeUpdate >= 1) {
          return win.top.lastTimeUpdate;
        }
      } catch (e) { }
      return win.lastTimeUpdate;
    };
  })();

  const initializeContext = function (win) {
    return new PromiseConstructor((resolve) => {
      const waitForFrame = requestAnimationFrame;
      let maxRetries = 20;
      const frameId = 'vanillajs-iframe-v1';

      let container = null;
      let frame = document.getElementById(frameId);

      const tryInject = () => {
        if (!document.documentElement) return false;
        if (!frame) {
          frame = document.createElement('iframe');
          frame.id = frameId;
          frame.sandbox = 'allow-same-origin';
          frame.style.display = 'none';

          container = document.createElement('noscript');
          container.appendChild(frame);
          document.documentElement.appendChild(container);
        }
        return true;
      };

      const cleanup = (later) => {
        const c = container;
        container = null;
        if (!c) return;
        const rm = () => { try { c.remove(); } catch (e) { } };
        if (later) setTimeout(rm, 200);
        else rm();
      };

      (function pollContext() {
        if (!tryInject()) {
          if (maxRetries-- > 0) return waitForFrame(pollContext);
          return resolve(null);
        }

        if (!frame.contentWindow && maxRetries-- > 0) {
          return waitForFrame(pollContext);
        }

        const ctx = frame.contentWindow;
        if (!ctx) {
          cleanup(false);
          return resolve(null);
        }

        try {
          const { requestAnimationFrame, setInterval, setTimeout, clearInterval, clearTimeout } = ctx;
          const bound = {
            requestAnimationFrame: requestAnimationFrame.bind(win),
            setInterval: setInterval.bind(win),
            setTimeout: setTimeout.bind(win),
            clearInterval: clearInterval.bind(win),
            clearTimeout: clearTimeout.bind(win)
          };
          cleanup(true);
          resolve(bound);
        } catch (e) {
          cleanup(false);
          resolve(null);
        }
      })();
    });
  };

  initializeContext(win).then((context) => {
    if (!context) return;

    const { requestAnimationFrame, setTimeout, setInterval, clearTimeout, clearInterval } = context;
    let animationFrameInterrupter = null;

    const createRAFHelper = function () {
      const afEl = document.createElement('a-f');
      afEl.id = 'a-f';

      if (!('onanimationiteration' in afEl)) {
        return (res) => {
          animationFrameInterrupter = res;
          requestAnimationFrame(res);
        };
      }

      let queue = null;
      afEl.onanimationiteration = () => {
        const fn = queue;
        if (fn) {
          queue = null;
          fn();
        }
      };

      if (!document.getElementById('af-style')) {
        const style = document.createElement('style');
        style.id = 'af-style';
        style.textContent = `
          @keyframes aF1 { from { opacity: 0; } to { opacity: 1; } }
          #a-f {
            position: fixed; top: -1px; left: -1px; width: 1px; height: 1px;
            pointer-events: none; visibility: hidden;
            animation: 1ms linear infinite alternate aF1;
          }
        `;
        (document.head || document.documentElement).appendChild(style);
      }

      if (document.documentElement) {
        document.documentElement.insertBefore(afEl, document.documentElement.firstChild);
      }

      return (res) => {
        queue = res;
        animationFrameInterrupter = res;
      };
    };

    const rafHelper = createRAFHelper();

    (function () {
      let afP1 = { resolved: true };
      let afP2 = { resolved: true };
      let afIdx = 0;

      const resolveRAF = (p) => {
        return new PromiseConstructor((res) => {
          rafHelper(res);
        }).then(() => {
          p.resolved = true;
          // FIX: 回绕逻辑与原脚本一致（9e9量级，回到9）
          let t = ++afIdx;
          if (t > 9000000000) afIdx = t = 9;
          p.resolve(t);
          return t;
        });
      };

      const executeRAF = () => {
        const p1 = !afP1.resolved ? afP1 : null;
        const p2 = !afP2.resolved ? afP2 : null;

        // FIX: 与原脚本一致：同时 pending 时取更合理的时间戳（含溢出区间判断）
        if (p1 && p2) {
          return PromiseConstructor.all([p1, p2]).then(v => {
            const t1 = v[0], t2 = v[1];
            return (t1 > t2 && (t1 - t2) < 8000000000) ? t1 : t2;
          });
        }

        const n1 = !p1 ? (afP1 = new ExternalPromise()) : null;
        const n2 = !p2 ? (afP2 = new ExternalPromise()) : null;

        return new PromiseConstructor((res) => {
          const run = () => {
            if (n1) {
              resolveRAF(n1).then(t => {
                if (n2) resolveRAF(n2).then(res);
                else res(t);
              });
            } else if (n2) {
              resolveRAF(n2).then(res);
            } else {
              res(0);
            }
          };
          if (p2) p2.then(run);
          else if (p1) p1.then(run);
          else run();
        });
      };

      const tasks = new Set();

      const wrap = (fn, store) => {
        return function () {
          const now = Date.now();
          if (now - getTimeUpdate() < 800 && now - store.last < 800) {
            const tid = store.id;
            tasks.add(tid);
            executeRAF().then((t) => {
              // FIX: 先删除，避免 tid 因为 t==store.exec 等原因长期滞留
              const ok = tasks.delete(tid);
              if (!ok || t === store.exec) return;
              store.exec = t;
              store.last = now;
              fn();
            });
          } else {
            store.last = now;
            fn();
          }
        };
      };

      const makeWrapper = (orig) => {
        return function (f, ms = 0) {
          if (typeof f === 'function') {
            // micro-opt: 预置字段，稳定对象形状
            const store = { last: Date.now(), exec: 0, id: 0 };
            const w = wrap(f, store);
            store.id = orig(w, ms);
            return store.id;
          }
          return orig(f, ms);
        };
      };

      win.setTimeout = makeWrapper(setTimeout);
      win.setInterval = makeWrapper(setInterval);

      const makeClear = (orig) => {
        return (id) => {
          if (id) {
            tasks.delete(id);
            orig(id);
          }
        };
      };

      win.clearTimeout = makeClear(clearTimeout);
      win.clearInterval = makeClear(clearInterval);

      try {
        const s = Function.prototype.toString;
        win.setTimeout.toString = s.bind(setTimeout);
        win.setInterval.toString = s.bind(setInterval);
        win.clearTimeout.toString = s.bind(clearTimeout);
        win.clearInterval.toString = s.bind(clearInterval);
      } catch (e) { }
    })();

    let interrupter = null;
    setInterval(() => {
      if (interrupter === animationFrameInterrupter && interrupter !== null) {
        animationFrameInterrupter();
        interrupter = null;
      } else {
        interrupter = animationFrameInterrupter;
      }
    }, 125);
  });
})();
