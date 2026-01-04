// ==UserScript==
// @name               RSSHub 订阅助手
// @name:en            RSSHub Subscription Helper
// @name:zh-CN         RSSHub 订阅助手
// @namespace          github.com/chlorinec/rsshub-monkey-helper
// @version            1.0.0
// @author             chlorinec
// @description        快速生成并复制RSSHub订阅链接，支持Bilibili、YouTube、X等主流平台
// @description:en     Quickly generate and copy RSSHub subscription links for Bilibili, YouTube, X, and more.
// @description:zh-CN  快速生成并复制RSSHub订阅链接，支持Bilibili、YouTube、X等主流平台
// @license            MIT
// @icon               https://docs.rsshub.app/logo.png
// @homepage           https://github.com/chlorinec/rsshub-monkey-helper
// @homepageURL        https://github.com/chlorinec/rsshub-monkey-helper
// @source             https://github.com/chlorinec/rsshub-monkey-helper.git
// @supportURL         https://github.com/chlorinec/rsshub-monkey-helper/issues
// @match              https://www.bilibili.com/*
// @match              https://space.bilibili.com/*
// @match              https://www.youtube.com/*
// @match              https://youtube.com/*
// @match              https://x.com/*
// @match              https://twitter.com/*
// @grant              GM_addElement
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_xmlhttpRequest
// @run-at             document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/551696/RSSHub%20%E8%AE%A2%E9%98%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/551696/RSSHub%20%E8%AE%A2%E9%98%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  importCSS(" ._fab_1ykjg_4{position:fixed;right:32px;bottom:32px;z-index:10000;width:56px;height:56px;background:var(--fab-bg, #fff);border-radius:50%;box-shadow:0 2px 12px #0000002e;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:box-shadow .2s;pointer-events:auto!important}._fab_1ykjg_4:hover{box-shadow:0 4px 24px #00000047}._panelBg_1ykjg_27{position:fixed;inset:0;background:#0000002e;z-index:2147483646;transition:background .2s}._dialog_1ykjg_38._panel_1ykjg_27{position:fixed;left:50%;top:50%;width:380px;min-height:220px;max-height:80vh;background:var(--panel-bg, #fff);box-shadow:0 8px 40px #00000038;z-index:2147483647;display:flex;flex-direction:column;border-radius:18px;overflow:hidden;animation:_dialogIn_1ykjg_1 .25s cubic-bezier(.4,2,.6,1);transition:box-shadow .2s,transform .25s cubic-bezier(.4,2,.6,1);-webkit-user-select:none;user-select:none;pointer-events:auto!important}@keyframes _dialogIn_1ykjg_1{0%{opacity:0;transform:scale(.85) translate(-50%,-50%)}to{opacity:1;transform:scale(1) translate(-50%,-50%)}}@keyframes _slideIn_1ykjg_1{0%{right:-340px}to{right:0}}._panelHeader_1ykjg_67{display:flex;align-items:center;gap:12px;padding:20px 24px 12px;border-bottom:1px solid var(--panel-border, #eee);font-size:20px;font-weight:600;color:var(--panel-header-color, #222)}._expandIcon_1ykjg_78{display:inline-flex;align-items:center;justify-content:center;font-size:15px;margin-top:2px;margin-left:2px;color:#888;transform:rotate(0);transition:transform .2s}@media (prefers-color-scheme: dark){:root{--fab-bg: #23272e;--panel-bg: #181a20;--panel-border: #23242a;--tab-color: #eee;--rule-bg: #23242a;--rule-title: #fff;--rule-desc: #bbb;--rule-link-bg: #23272e;--rule-link: #eee;--close-color: #aaa;--panel-header-color: #fff}}._closeBtn_1ykjg_104{margin-left:auto;background:none;border:none;font-size:24px;cursor:pointer;color:var(--close-color, #888);padding:0 2px}._closeBtn_1ykjg_104:hover{color:#f44336}._tabs_1ykjg_117{display:flex;gap:16px;padding:16px 24px 0}._tabs_1ykjg_117 button{background:none;border:none;padding:10px 10px 6px;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:64px;max-width:110px;gap:4px;font-size:15px;cursor:pointer;color:var(--tab-color, #333);transition:background .15s,color .15s;overflow:visible}._tabActive_1ykjg_140{background:#f9a82522;color:#f9a825;font-weight:600}._tabIcon_1ykjg_145{width:32px;height:32px;display:flex;align-items:center;justify-content:center;margin-bottom:2px}._tabName_1ykjg_153{width:100%;max-width:90px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px;font-weight:500;line-height:1.2;cursor:pointer;position:relative}._tabName_1ykjg_153:hover:after{content:attr(data-fullname);position:absolute;left:50%;top:120%;transform:translate(-50%);background:#222;color:#fff;padding:3px 10px;border-radius:6px;font-size:13px;white-space:pre;z-index:9999;box-shadow:0 2px 8px #0000002e;pointer-events:none}._rules_1ykjg_184{flex:1;overflow-y:auto;padding:20px 24px 32px}._toast_1ykjg_190{position:fixed;bottom:100px;right:40px;background:#222;color:#fff;padding:10px 22px;border-radius:8px;font-size:15px;z-index:2147483647;box-shadow:0 2px 12px #0000002e;animation:_fadeIn_1ykjg_1 .2s}@keyframes _fadeIn_1ykjg_1{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@media (prefers-color-scheme: dark){:root{--fab-bg: #23272e;--panel-bg: #181a20;--panel-border: #23242a;--tab-color: #eee;--rule-bg: #23242a;--rule-title: #fff;--rule-desc: #bbb;--rule-link-bg: #23272e;--rule-link: #eee;--close-color: #aaa}}._panelBg_1ay11_1{position:fixed;inset:0;background:#0000002e;z-index:2147483646;transition:background .2s}._dialog_1ay11_8._panel_1ay11_1{position:fixed;left:50%;top:50%;width:380px;min-height:220px;max-height:80vh;background:var(--panel-bg, #fff);box-shadow:0 8px 40px #00000038;z-index:2147483647;display:flex;flex-direction:column;border-radius:18px;overflow:hidden;animation:_dialogIn_1ay11_1 .25s cubic-bezier(.4,2,.6,1);transition:box-shadow .2s,transform .25s cubic-bezier(.4,2,.6,1);-webkit-user-select:none;user-select:none;pointer-events:auto!important}@keyframes _dialogIn_1ay11_1{0%{opacity:0;transform:scale(.85) translate(-50%,-50%)}to{opacity:1;transform:scale(1) translate(-50%,-50%)}}._panelHeader_1ay11_31{display:flex;align-items:center;gap:12px;padding:20px 24px 12px;border-bottom:1px solid var(--panel-border, #eee);font-size:20px;font-weight:600;color:var(--panel-header-color, #222)}._closeBtn_1ay11_41{margin-left:auto;background:none;border:none;font-size:24px;cursor:pointer;color:var(--close-color, #888);padding:0 2px}._closeBtn_1ay11_41:hover{color:#f44336}._tabs_1ay11_53{display:flex;gap:16px;padding:16px 24px 0}._tabs_1ay11_53 button{background:none;border:none;padding:10px 10px 6px;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:64px;max-width:110px;gap:4px;font-size:15px;cursor:pointer;color:var(--tab-color, #333);transition:background .15s,color .15s;overflow:visible}._tabActive_1ay11_76{background:#f9a82522;color:#f9a825;font-weight:600}._tabIcon_1ay11_81{width:32px;height:32px;display:flex;align-items:center;justify-content:center;margin-bottom:2px}._tabName_1ay11_89{width:100%;max-width:90px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px;font-weight:500;line-height:1.2;cursor:pointer;position:relative}._tabName_1ay11_89:hover:after{content:attr(data-fullname);position:absolute;left:50%;top:120%;transform:translate(-50%);background:#222;color:#fff;padding:3px 10px;border-radius:6px;font-size:13px;white-space:pre;z-index:9999;box-shadow:0 2px 8px #0000002e;pointer-events:none}._expandIcon_1ay11_118{display:inline-flex;align-items:center;justify-content:center;font-size:15px;margin-top:2px;margin-left:2px;color:#888;transform:rotate(0);transition:transform .2s}._rules_1ay11_129{flex:1;overflow-y:auto;padding:20px 24px 32px}._ruleItem_17zs6_1{background:var(--rule-bg, #fafbfc);border-radius:10px;margin-bottom:20px;padding:16px 16px 12px;box-shadow:0 1px 6px #0000000d;display:flex;flex-direction:column;gap:6px}._ruleTitle_17zs6_11{font-size:17px;font-weight:600;margin-bottom:2px;line-height:1.3}._ruleTitle_17zs6_11 a{color:var(--rule-title, #1f2328);text-decoration:none;transition:color .15s}._ruleTitle_17zs6_11 a:hover{color:#f9a825}._ruleDesc_17zs6_25{font-size:14px;color:var(--rule-desc, #666);margin-bottom:4px}._ruleCopyBox_17zs6_30{display:flex;align-items:center;gap:8px;width:100%;background:var(--rule-link-bg, #f3f3f3);border:none;border-radius:6px;padding:4px 12px 4px 10px;margin-top:6px;cursor:pointer;font-family:monospace;font-size:14px;color:var(--rule-link, #333);transition:background .15s,box-shadow .15s;-webkit-user-select:all;user-select:all;position:relative;outline:none}._ruleCopyBox_17zs6_30:hover,._ruleCopyBox_17zs6_30:focus{background:#ffe082;box-shadow:0 2px 8px #f9a82514}._ruleLink_17zs6_53{flex:1;text-align:left;background:none;padding:0;border:none;color:inherit;font-family:inherit;font-size:inherit;-webkit-user-select:all;user-select:all;overflow-x:auto}._copyIcon_17zs6_65{width:18px;height:18px;display:flex;align-items:center;justify-content:center;color:#f9a825;margin-left:6px} ");

  const IS_DEV = false;
  const equalFn = (a, b) => a === b;
  const $TRACK = Symbol("solid-track");
  const signalOptions = {
    equals: equalFn
  };
  let runEffects = runQueue;
  const STALE = 1;
  const PENDING = 2;
  const UNOWNED = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var Owner = null;
  let Transition = null;
  let ExternalSourceConfig = null;
  let Listener = null;
  let Updates = null;
  let Effects = null;
  let ExecCount = 0;
  function createRoot(fn, detachedOwner) {
    const listener = Listener, owner = Owner, unowned = fn.length === 0, current = detachedOwner === void 0 ? owner : detachedOwner, root = unowned ? UNOWNED : {
      owned: null,
      cleanups: null,
      context: current ? current.context : null,
      owner: current
    }, updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root)));
    Owner = root;
    Listener = null;
    try {
      return runUpdates(updateFn, true);
    } finally {
      Listener = listener;
      Owner = owner;
    }
  }
  function createSignal(value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const s = {
      value,
      observers: null,
      observerSlots: null,
      comparator: options.equals || void 0
    };
    const setter = (value2) => {
      if (typeof value2 === "function") {
        value2 = value2(s.value);
      }
      return writeSignal(s, value2);
    };
    return [readSignal.bind(s), setter];
  }
  function createRenderEffect(fn, value, options) {
    const c = createComputation(fn, value, false, STALE);
    updateComputation(c);
  }
  function createEffect(fn, value, options) {
    runEffects = runUserEffects;
    const c = createComputation(fn, value, false, STALE);
    c.user = true;
    Effects ? Effects.push(c) : updateComputation(c);
  }
  function createMemo(fn, value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const c = createComputation(fn, value, true, 0);
    c.observers = null;
    c.observerSlots = null;
    c.comparator = options.equals || void 0;
    updateComputation(c);
    return readSignal.bind(c);
  }
  function untrack(fn) {
    if (Listener === null) return fn();
    const listener = Listener;
    Listener = null;
    try {
      if (ExternalSourceConfig) ;
      return fn();
    } finally {
      Listener = listener;
    }
  }
  function onMount(fn) {
    createEffect(() => untrack(fn));
  }
  function onCleanup(fn) {
    if (Owner === null) ;
    else if (Owner.cleanups === null) Owner.cleanups = [fn];
    else Owner.cleanups.push(fn);
    return fn;
  }
  function readSignal() {
    if (this.sources && this.state) {
      if (this.state === STALE) updateComputation(this);
      else {
        const updates = Updates;
        Updates = null;
        runUpdates(() => lookUpstream(this), false);
        Updates = updates;
      }
    }
    if (Listener) {
      const sSlot = this.observers ? this.observers.length : 0;
      if (!Listener.sources) {
        Listener.sources = [this];
        Listener.sourceSlots = [sSlot];
      } else {
        Listener.sources.push(this);
        Listener.sourceSlots.push(sSlot);
      }
      if (!this.observers) {
        this.observers = [Listener];
        this.observerSlots = [Listener.sources.length - 1];
      } else {
        this.observers.push(Listener);
        this.observerSlots.push(Listener.sources.length - 1);
      }
    }
    return this.value;
  }
  function writeSignal(node, value, isComp) {
    let current = node.value;
    if (!node.comparator || !node.comparator(current, value)) {
      node.value = value;
      if (node.observers && node.observers.length) {
        runUpdates(() => {
          for (let i = 0; i < node.observers.length; i += 1) {
            const o = node.observers[i];
            const TransitionRunning = Transition && Transition.running;
            if (TransitionRunning && Transition.disposed.has(o)) ;
            if (TransitionRunning ? !o.tState : !o.state) {
              if (o.pure) Updates.push(o);
              else Effects.push(o);
              if (o.observers) markDownstream(o);
            }
            if (!TransitionRunning) o.state = STALE;
          }
          if (Updates.length > 1e6) {
            Updates = [];
            if (IS_DEV) ;
            throw new Error();
          }
        }, false);
      }
    }
    return value;
  }
  function updateComputation(node) {
    if (!node.fn) return;
    cleanNode(node);
    const time = ExecCount;
    runComputation(node, node.value, time);
  }
  function runComputation(node, value, time) {
    let nextValue;
    const owner = Owner, listener = Listener;
    Listener = Owner = node;
    try {
      nextValue = node.fn(value);
    } catch (err) {
      if (node.pure) {
        {
          node.state = STALE;
          node.owned && node.owned.forEach(cleanNode);
          node.owned = null;
        }
      }
      node.updatedAt = time + 1;
      return handleError(err);
    } finally {
      Listener = listener;
      Owner = owner;
    }
    if (!node.updatedAt || node.updatedAt <= time) {
      if (node.updatedAt != null && "observers" in node) {
        writeSignal(node, nextValue);
      } else node.value = nextValue;
      node.updatedAt = time;
    }
  }
  function createComputation(fn, init, pure, state = STALE, options) {
    const c = {
      fn,
      state,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: init,
      owner: Owner,
      context: Owner ? Owner.context : null,
      pure
    };
    if (Owner === null) ;
    else if (Owner !== UNOWNED) {
      {
        if (!Owner.owned) Owner.owned = [c];
        else Owner.owned.push(c);
      }
    }
    return c;
  }
  function runTop(node) {
    if (node.state === 0) return;
    if (node.state === PENDING) return lookUpstream(node);
    if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
    const ancestors = [node];
    while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
      if (node.state) ancestors.push(node);
    }
    for (let i = ancestors.length - 1; i >= 0; i--) {
      node = ancestors[i];
      if (node.state === STALE) {
        updateComputation(node);
      } else if (node.state === PENDING) {
        const updates = Updates;
        Updates = null;
        runUpdates(() => lookUpstream(node, ancestors[0]), false);
        Updates = updates;
      }
    }
  }
  function runUpdates(fn, init) {
    if (Updates) return fn();
    let wait = false;
    if (!init) Updates = [];
    if (Effects) wait = true;
    else Effects = [];
    ExecCount++;
    try {
      const res = fn();
      completeUpdates(wait);
      return res;
    } catch (err) {
      if (!wait) Effects = null;
      Updates = null;
      handleError(err);
    }
  }
  function completeUpdates(wait) {
    if (Updates) {
      runQueue(Updates);
      Updates = null;
    }
    if (wait) return;
    const e = Effects;
    Effects = null;
    if (e.length) runUpdates(() => runEffects(e), false);
  }
  function runQueue(queue) {
    for (let i = 0; i < queue.length; i++) runTop(queue[i]);
  }
  function runUserEffects(queue) {
    let i, userLength = 0;
    for (i = 0; i < queue.length; i++) {
      const e = queue[i];
      if (!e.user) runTop(e);
      else queue[userLength++] = e;
    }
    for (i = 0; i < userLength; i++) runTop(queue[i]);
  }
  function lookUpstream(node, ignore) {
    node.state = 0;
    for (let i = 0; i < node.sources.length; i += 1) {
      const source = node.sources[i];
      if (source.sources) {
        const state = source.state;
        if (state === STALE) {
          if (source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount)) runTop(source);
        } else if (state === PENDING) lookUpstream(source, ignore);
      }
    }
  }
  function markDownstream(node) {
    for (let i = 0; i < node.observers.length; i += 1) {
      const o = node.observers[i];
      if (!o.state) {
        o.state = PENDING;
        if (o.pure) Updates.push(o);
        else Effects.push(o);
        o.observers && markDownstream(o);
      }
    }
  }
  function cleanNode(node) {
    let i;
    if (node.sources) {
      while (node.sources.length) {
        const source = node.sources.pop(), index = node.sourceSlots.pop(), obs = source.observers;
        if (obs && obs.length) {
          const n = obs.pop(), s = source.observerSlots.pop();
          if (index < obs.length) {
            n.sourceSlots[s] = index;
            obs[index] = n;
            source.observerSlots[index] = s;
          }
        }
      }
    }
    if (node.tOwned) {
      for (i = node.tOwned.length - 1; i >= 0; i--) cleanNode(node.tOwned[i]);
      delete node.tOwned;
    }
    if (node.owned) {
      for (i = node.owned.length - 1; i >= 0; i--) cleanNode(node.owned[i]);
      node.owned = null;
    }
    if (node.cleanups) {
      for (i = node.cleanups.length - 1; i >= 0; i--) node.cleanups[i]();
      node.cleanups = null;
    }
    node.state = 0;
  }
  function castError(err) {
    if (err instanceof Error) return err;
    return new Error(typeof err === "string" ? err : "Unknown error", {
      cause: err
    });
  }
  function handleError(err, owner = Owner) {
    const error = castError(err);
    throw error;
  }
  const FALLBACK = Symbol("fallback");
  function dispose(d) {
    for (let i = 0; i < d.length; i++) d[i]();
  }
  function mapArray(list, mapFn, options = {}) {
    let items = [], mapped = [], disposers = [], len = 0, indexes = mapFn.length > 1 ? [] : null;
    onCleanup(() => dispose(disposers));
    return () => {
      let newItems = list() || [], newLen = newItems.length, i, j;
      newItems[$TRACK];
      return untrack(() => {
        let newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start, end, newEnd, item;
        if (newLen === 0) {
          if (len !== 0) {
            dispose(disposers);
            disposers = [];
            items = [];
            mapped = [];
            len = 0;
            indexes && (indexes = []);
          }
          if (options.fallback) {
            items = [FALLBACK];
            mapped[0] = createRoot((disposer) => {
              disposers[0] = disposer;
              return options.fallback();
            });
            len = 1;
          }
        } else if (len === 0) {
          mapped = new Array(newLen);
          for (j = 0; j < newLen; j++) {
            items[j] = newItems[j];
            mapped[j] = createRoot(mapper);
          }
          len = newLen;
        } else {
          temp = new Array(newLen);
          tempdisposers = new Array(newLen);
          indexes && (tempIndexes = new Array(newLen));
          for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++) ;
          for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
            temp[newEnd] = mapped[end];
            tempdisposers[newEnd] = disposers[end];
            indexes && (tempIndexes[newEnd] = indexes[end]);
          }
          newIndices = new Map();
          newIndicesNext = new Array(newEnd + 1);
          for (j = newEnd; j >= start; j--) {
            item = newItems[j];
            i = newIndices.get(item);
            newIndicesNext[j] = i === void 0 ? -1 : i;
            newIndices.set(item, j);
          }
          for (i = start; i <= end; i++) {
            item = items[i];
            j = newIndices.get(item);
            if (j !== void 0 && j !== -1) {
              temp[j] = mapped[i];
              tempdisposers[j] = disposers[i];
              indexes && (tempIndexes[j] = indexes[i]);
              j = newIndicesNext[j];
              newIndices.set(item, j);
            } else disposers[i]();
          }
          for (j = start; j < newLen; j++) {
            if (j in temp) {
              mapped[j] = temp[j];
              disposers[j] = tempdisposers[j];
              if (indexes) {
                indexes[j] = tempIndexes[j];
                indexes[j](j);
              }
            } else mapped[j] = createRoot(mapper);
          }
          mapped = mapped.slice(0, len = newLen);
          items = newItems.slice(0);
        }
        return mapped;
      });
      function mapper(disposer) {
        disposers[j] = disposer;
        if (indexes) {
          const [s, set] = createSignal(j);
          indexes[j] = set;
          return mapFn(newItems[j], s);
        }
        return mapFn(newItems[j]);
      }
    };
  }
  function createComponent(Comp, props) {
    return untrack(() => Comp(props || {}));
  }
  const narrowedError = (name) => `Stale read from <${name}>.`;
  function For(props) {
    const fallback = "fallback" in props && {
      fallback: () => props.fallback
    };
    return createMemo(mapArray(() => props.each, props.children, fallback || void 0));
  }
  function Show(props) {
    const keyed = props.keyed;
    const conditionValue = createMemo(() => props.when, void 0, void 0);
    const condition = keyed ? conditionValue : createMemo(conditionValue, void 0, {
      equals: (a, b) => !a === !b
    });
    return createMemo(() => {
      const c = condition();
      if (c) {
        const child = props.children;
        const fn = typeof child === "function" && child.length > 0;
        return fn ? untrack(() => child(keyed ? c : () => {
          if (!untrack(condition)) throw narrowedError("Show");
          return conditionValue();
        })) : child;
      }
      return props.fallback;
    }, void 0, void 0);
  }
  const memo = (fn) => createMemo(() => fn());
  function reconcileArrays(parentNode, a, b) {
    let bLength = b.length, aEnd = a.length, bEnd = bLength, aStart = 0, bStart = 0, after = a[aEnd - 1].nextSibling, map = null;
    while (aStart < aEnd || bStart < bEnd) {
      if (a[aStart] === b[bStart]) {
        aStart++;
        bStart++;
        continue;
      }
      while (a[aEnd - 1] === b[bEnd - 1]) {
        aEnd--;
        bEnd--;
      }
      if (aEnd === aStart) {
        const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
        while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
      } else if (bEnd === bStart) {
        while (aStart < aEnd) {
          if (!map || !map.has(a[aStart])) a[aStart].remove();
          aStart++;
        }
      } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
        const node = a[--aEnd].nextSibling;
        parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
        parentNode.insertBefore(b[--bEnd], node);
        a[aEnd] = b[bEnd];
      } else {
        if (!map) {
          map = new Map();
          let i = bStart;
          while (i < bEnd) map.set(b[i], i++);
        }
        const index = map.get(a[aStart]);
        if (index != null) {
          if (bStart < index && index < bEnd) {
            let i = aStart, sequence = 1, t;
            while (++i < aEnd && i < bEnd) {
              if ((t = map.get(a[i])) == null || t !== index + sequence) break;
              sequence++;
            }
            if (sequence > index - bStart) {
              const node = a[aStart];
              while (bStart < index) parentNode.insertBefore(b[bStart++], node);
            } else parentNode.replaceChild(b[bStart++], a[aStart++]);
          } else aStart++;
        } else a[aStart++].remove();
      }
    }
  }
  const $$EVENTS = "_$DX_DELEGATE";
  function render(code, element, init, options = {}) {
    let disposer;
    createRoot((dispose2) => {
      disposer = dispose2;
      element === document ? code() : insert(element, code(), element.firstChild ? null : void 0, init);
    }, options.owner);
    return () => {
      disposer();
      element.textContent = "";
    };
  }
  function template(html, isImportNode, isSVG, isMathML) {
    let node;
    const create = () => {
      const t = document.createElement("template");
      t.innerHTML = html;
      return t.content.firstChild;
    };
    const fn = () => (node || (node = create())).cloneNode(true);
    fn.cloneNode = fn;
    return fn;
  }
  function delegateEvents(eventNames, document2 = window.document) {
    const e = document2[$$EVENTS] || (document2[$$EVENTS] = new Set());
    for (let i = 0, l = eventNames.length; i < l; i++) {
      const name = eventNames[i];
      if (!e.has(name)) {
        e.add(name);
        document2.addEventListener(name, eventHandler);
      }
    }
  }
  function setAttribute(node, name, value) {
    if (value == null) node.removeAttribute(name);
    else node.setAttribute(name, value);
  }
  function className(node, value) {
    if (value == null) node.removeAttribute("class");
    else node.className = value;
  }
  function addEventListener(node, name, handler, delegate) {
    {
      if (Array.isArray(handler)) {
        node[`$$${name}`] = handler[0];
        node[`$$${name}Data`] = handler[1];
      } else node[`$$${name}`] = handler;
    }
  }
  function setStyleProperty(node, name, value) {
    value != null ? node.style.setProperty(name, value) : node.style.removeProperty(name);
  }
  function insert(parent, accessor, marker, initial) {
    if (marker !== void 0 && !initial) initial = [];
    if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
    createRenderEffect((current) => insertExpression(parent, accessor(), current, marker), initial);
  }
  function eventHandler(e) {
    let node = e.target;
    const key = `$$${e.type}`;
    const oriTarget = e.target;
    const oriCurrentTarget = e.currentTarget;
    const retarget = (value) => Object.defineProperty(e, "target", {
      configurable: true,
      value
    });
    const handleNode = () => {
      const handler = node[key];
      if (handler && !node.disabled) {
        const data = node[`${key}Data`];
        data !== void 0 ? handler.call(node, data, e) : handler.call(node, e);
        if (e.cancelBubble) return;
      }
      node.host && typeof node.host !== "string" && !node.host._$host && node.contains(e.target) && retarget(node.host);
      return true;
    };
    const walkUpTree = () => {
      while (handleNode() && (node = node._$host || node.parentNode || node.host)) ;
    };
    Object.defineProperty(e, "currentTarget", {
      configurable: true,
      get() {
        return node || document;
      }
    });
    if (e.composedPath) {
      const path = e.composedPath();
      retarget(path[0]);
      for (let i = 0; i < path.length - 2; i++) {
        node = path[i];
        if (!handleNode()) break;
        if (node._$host) {
          node = node._$host;
          walkUpTree();
          break;
        }
        if (node.parentNode === oriCurrentTarget) {
          break;
        }
      }
    } else walkUpTree();
    retarget(oriTarget);
  }
  function insertExpression(parent, value, current, marker, unwrapArray) {
    while (typeof current === "function") current = current();
    if (value === current) return current;
    const t = typeof value, multi = marker !== void 0;
    parent = multi && current[0] && current[0].parentNode || parent;
    if (t === "string" || t === "number") {
      if (t === "number") {
        value = value.toString();
        if (value === current) return current;
      }
      if (multi) {
        let node = current[0];
        if (node && node.nodeType === 3) {
          node.data !== value && (node.data = value);
        } else node = document.createTextNode(value);
        current = cleanChildren(parent, current, marker, node);
      } else {
        if (current !== "" && typeof current === "string") {
          current = parent.firstChild.data = value;
        } else current = parent.textContent = value;
      }
    } else if (value == null || t === "boolean") {
      current = cleanChildren(parent, current, marker);
    } else if (t === "function") {
      createRenderEffect(() => {
        let v = value();
        while (typeof v === "function") v = v();
        current = insertExpression(parent, v, current, marker);
      });
      return () => current;
    } else if (Array.isArray(value)) {
      const array = [];
      const currentArray = current && Array.isArray(current);
      if (normalizeIncomingArray(array, value, current, unwrapArray)) {
        createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
        return () => current;
      }
      if (array.length === 0) {
        current = cleanChildren(parent, current, marker);
        if (multi) return current;
      } else if (currentArray) {
        if (current.length === 0) {
          appendNodes(parent, array, marker);
        } else reconcileArrays(parent, current, array);
      } else {
        current && cleanChildren(parent);
        appendNodes(parent, array);
      }
      current = array;
    } else if (value.nodeType) {
      if (Array.isArray(current)) {
        if (multi) return current = cleanChildren(parent, current, marker, value);
        cleanChildren(parent, current, null, value);
      } else if (current == null || current === "" || !parent.firstChild) {
        parent.appendChild(value);
      } else parent.replaceChild(value, parent.firstChild);
      current = value;
    } else ;
    return current;
  }
  function normalizeIncomingArray(normalized, array, current, unwrap) {
    let dynamic = false;
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i], prev = current && current[normalized.length], t;
      if (item == null || item === true || item === false) ;
      else if ((t = typeof item) === "object" && item.nodeType) {
        normalized.push(item);
      } else if (Array.isArray(item)) {
        dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
      } else if (t === "function") {
        if (unwrap) {
          while (typeof item === "function") item = item();
          dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
        } else {
          normalized.push(item);
          dynamic = true;
        }
      } else {
        const value = String(item);
        if (prev && prev.nodeType === 3 && prev.data === value) normalized.push(prev);
        else normalized.push(document.createTextNode(value));
      }
    }
    return dynamic;
  }
  function appendNodes(parent, array, marker = null) {
    for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
  }
  function cleanChildren(parent, current, marker, replacement) {
    if (marker === void 0) return parent.textContent = "";
    const node = replacement || document.createTextNode("");
    if (current.length) {
      let inserted = false;
      for (let i = current.length - 1; i >= 0; i--) {
        const el = current[i];
        if (node !== el) {
          const isParent = el.parentNode === parent;
          if (!inserted && !i) isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);
          else isParent && el.remove();
        } else inserted = true;
      }
    } else parent.insertBefore(node, marker);
    return [node];
  }
  const indexCss = "body{margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;display:flex}code{font-family:source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace}";
  importCSS(indexCss);
  const fab = "_fab_1ykjg_4";
  const toast$1 = "_toast_1ykjg_190";
  const styles$2 = {
    fab,
    toast: toast$1
  };
  const bilibiliIcon = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#00A1D6"/><path d="M13 12l-2-3m16 3l2-3M8 16h24v13a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V16zm6 5v4m8-4v4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const youtubeIcon = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#FF0000"/><path d="M16 14l10 6-10 6V14z" fill="#fff"/></svg>`;
  const xIcon = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#000"/><path d="M13 13h3.5l4.5 5.8L25.5 13H29l-6.5 8.2L29 27h-3.5l-4.5-5.8L14.5 27H11l6.5-8.2L11 13z" fill="#fff"/></svg>`;
  const platforms = [
    {
      id: "bilibili",
      name: "Bilibili",
      icon: bilibiliIcon,
      rules: [
        {
          id: "user-video",
          name: "UP主投稿",
          desc: "获取UP主最新投稿",
          doc: "https://docs.rsshub.app/routes/social-media#bilibili",
          genLink: ({ uid }) => `/bilibili/user/video/${uid}`,
          preview: "/bilibili/user/video/2267573"
        },
        {
          id: "user-video-all",
          name: "UP主所有视频",
          desc: "获取UP主所有视频",
          doc: "https://docs.rsshub.app/routes/social-media#bilibili",
          genLink: ({ uid }) => `/bilibili/user/video-all/${uid}`,
          preview: "/bilibili/user/video-all/2267573"
        },
        {
          id: "ranking",
          name: "排行榜",
          desc: "B站分区排行榜",
          doc: "https://docs.rsshub.app/routes/social-media#bilibili",
          genLink: ({ rid_index }) => `/bilibili/ranking/${rid_index || ""}`,
          preview: "/bilibili/ranking/0"
        },
        {
          id: "weekly",
          name: "周推",
          desc: "B站每周热门推荐",
          doc: "https://docs.rsshub.app/routes/social-media#bilibili",
          genLink: () => "/bilibili/weekly",
          preview: "/bilibili/weekly"
        }
      ]
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: youtubeIcon,
      rules: [
        {
          id: "user",
          name: "频道（@handle）",
          desc: "通过@handle订阅频道",
          doc: "https://docs.rsshub.app/routes/social-media#youtube",
          genLink: ({ username }) => `/youtube/user/${username}`,
          preview: "/youtube/user/@JFlaMusic"
        },
        {
          id: "playlist",
          name: "播放列表",
          desc: "订阅YouTube播放列表",
          doc: "https://docs.rsshub.app/routes/social-media#youtube",
          genLink: ({ id }) => `/youtube/playlist/${id}`,
          preview: "/youtube/playlist/PL9tY0BWXOZFv2b4p1p6rQ1QK2vNhbbX6h"
        }
      ]
    },
    {
      id: "x",
      name: "X（Twitter）",
      icon: xIcon,
      rules: [
        {
          id: "user",
          name: "用户推文",
          desc: "订阅指定用户推文",
          doc: "https://docs.rsshub.app/routes/social-media#x",
          genLink: ({ id }) => `/x/user/${id}`,
          preview: "/x/user/jack"
        },
        {
          id: "custom",
          name: "自定义参数",
          desc: "自定义X规则参数",
          doc: "https://docs.rsshub.app/routes/social-media#x",
          genLink: ({ routeParams }) => `/x/${routeParams || ""}`,
          preview: "/x/readable=true&showAuthorInTitle=true"
        }
      ]
    }
  ];
  function detectBilibiliParams() {
    const url = window.location.href;
    const spaceMatch = url.match(/space\.bilibili\.com\/(\d+)/);
    if (spaceMatch) return { uid: spaceMatch[1] };
    const bvMatch = url.match(/bilibili\.com\/video\/(BV[\w]+)/i);
    if (bvMatch) {
      const upLink = document.querySelector("a.up-name, a.username, a.bili-avatar");
      if (upLink && upLink.href) {
        const upUid = upLink.href.match(/space\.bilibili\.com\/(\d+)/);
        if (upUid) return { uid: upUid[1] };
      }
    }
    return {};
  }
  function detectYouTubeParams() {
    const url = window.location.href;
    const handleMatch = url.match(/youtube\.com\/@([\w\-\.]+)/);
    if (handleMatch) return { username: "@" + handleMatch[1] };
    const channelMatch = url.match(/youtube\.com\/channel\/(UC[\w\-]+)/);
    if (channelMatch) return { username: channelMatch[1] };
    return {};
  }
  function detectXParams() {
    const url = window.location.href;
    const userMatch = url.match(/(?:x|twitter)\.com\/([\w_]+)/);
    if (userMatch && !["home", "explore", "i", "notifications", "messages", "search", "settings"].includes(userMatch[1])) {
      return { id: userMatch[1] };
    }
    return {};
  }
  function detectParams(platform) {
    if (platform === "bilibili") return detectBilibiliParams();
    if (platform === "youtube") return detectYouTubeParams();
    if (platform === "x") return detectXParams();
    return {};
  }
  const rsshubLogo = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#1F2328"/><path d="M11 29a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm2-8a10 10 0 0 1 10 10h3a13 13 0 0 0-13-13v3zm0-8a18 18 0 0 1 18 18h3A21 21 0 0 0 13 7v3z" fill="#F9A825"/></svg>`;
  const panelBg = "_panelBg_1ay11_1";
  const dialog = "_dialog_1ay11_8";
  const panel = "_panel_1ay11_1";
  const panelHeader = "_panelHeader_1ay11_31";
  const closeBtn = "_closeBtn_1ay11_41";
  const tabs = "_tabs_1ay11_53";
  const tabActive = "_tabActive_1ay11_76";
  const tabIcon = "_tabIcon_1ay11_81";
  const tabName = "_tabName_1ay11_89";
  const expandIcon = "_expandIcon_1ay11_118";
  const rules = "_rules_1ay11_129";
  const styles$1 = {
    panelBg,
    dialog,
    panel,
    panelHeader,
    closeBtn,
    tabs,
    tabActive,
    tabIcon,
    tabName,
    expandIcon,
    rules
  };
  const ruleItem = "_ruleItem_17zs6_1";
  const ruleTitle = "_ruleTitle_17zs6_11";
  const ruleDesc = "_ruleDesc_17zs6_25";
  const ruleCopyBox = "_ruleCopyBox_17zs6_30";
  const ruleLink = "_ruleLink_17zs6_53";
  const copyIcon$1 = "_copyIcon_17zs6_65";
  const styles = {
    ruleItem,
    ruleTitle,
    ruleDesc,
    ruleCopyBox,
    ruleLink,
    copyIcon: copyIcon$1
  };
  const copyIcon = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="8" height="8" rx="2" stroke="currentColor" stroke-width="1.5"/><rect x="4" y="4" width="8" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/></svg>`;
  var _tmpl$$2 = template(`<div><div><a target=_blank rel=noopener></a></div><div></div><button title=复制链接 type=button><span></span><span>`);
  const RuleItem = (props) => {
    const link = props.rule.genLink(props.params);
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(link);
        console.log("复制成功，触发 onCopy");
        props.onCopy?.(true);
      } catch {
        console.log("复制失败，触发 onCopy");
        props.onCopy?.(false);
      }
    };
    return (() => {
      var _el$ = _tmpl$$2(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$2.nextSibling, _el$5 = _el$4.nextSibling, _el$6 = _el$5.firstChild, _el$7 = _el$6.nextSibling;
      insert(_el$3, () => props.rule.name);
      insert(_el$4, () => props.rule.desc);
      _el$5.$$click = handleCopy;
      insert(_el$6, link);
      _el$7.innerHTML = copyIcon;
      createRenderEffect((_p$) => {
        var _v$ = styles.ruleItem, _v$2 = styles.ruleTitle, _v$3 = props.rule.doc, _v$4 = styles.ruleDesc, _v$5 = styles.ruleCopyBox, _v$6 = styles.ruleLink, _v$7 = styles.copyIcon;
        _v$ !== _p$.e && className(_el$, _p$.e = _v$);
        _v$2 !== _p$.t && className(_el$2, _p$.t = _v$2);
        _v$3 !== _p$.a && setAttribute(_el$3, "href", _p$.a = _v$3);
        _v$4 !== _p$.o && className(_el$4, _p$.o = _v$4);
        _v$5 !== _p$.i && className(_el$5, _p$.i = _v$5);
        _v$6 !== _p$.n && className(_el$6, _p$.n = _v$6);
        _v$7 !== _p$.s && className(_el$7, _p$.s = _v$7);
        return _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0,
        s: void 0
      });
      return _el$;
    })();
  };
  delegateEvents(["click"]);
  var _tmpl$$1 = template(`<div>`), _tmpl$2$1 = template(`<button style=min-width:80px;max-width:110px><span></span><span></span><span title=展开更多平台>▶️`), _tmpl$3 = template(`<div><header><span></span><span>可订阅源</span><button>×</button></header><nav></nav><main>`), _tmpl$4 = template(`<button><span></span><span>`);
  const Panel = (props) => {
    return [(() => {
      var _el$ = _tmpl$$1();
      addEventListener(_el$, "click", props.onBgClick);
      createRenderEffect(() => className(_el$, styles$1.panelBg));
      return _el$;
    })(), (() => {
      var _el$2 = _tmpl$3(), _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$4.nextSibling, _el$6 = _el$5.nextSibling, _el$7 = _el$3.nextSibling, _el$10 = _el$7.nextSibling;
      setStyleProperty(_el$2, "left", "50%");
      setStyleProperty(_el$2, "top", "50%");
      setStyleProperty(_el$2, "transform", "translate(-50%, -50%)");
      setStyleProperty(_el$2, "transition", "box-shadow 0.2s, transform 0.25s cubic-bezier(.4,2,.6,1)");
      _el$4.innerHTML = rsshubLogo;
      setStyleProperty(_el$4, "width", "32px");
      setStyleProperty(_el$4, "height", "32px");
      setStyleProperty(_el$4, "display", "inline-block");
      addEventListener(_el$6, "click", props.onClose);
      insert(_el$7, createComponent(Show, {
        get when() {
          return !props.showAllPlatforms;
        },
        get children() {
          var _el$8 = _tmpl$2$1(), _el$9 = _el$8.firstChild, _el$0 = _el$9.nextSibling, _el$1 = _el$0.nextSibling;
          _el$8.$$click = () => props.onTabClick(props.activePlatform);
          insert(_el$0, () => props.activePlatform.name);
          createRenderEffect((_p$) => {
            var _v$ = styles$1.tabActive, _v$2 = styles$1.tabIcon, _v$3 = props.activePlatform.icon, _v$4 = styles$1.tabName, _v$5 = props.activePlatform.name, _v$6 = styles$1.expandIcon;
            _v$ !== _p$.e && className(_el$8, _p$.e = _v$);
            _v$2 !== _p$.t && className(_el$9, _p$.t = _v$2);
            _v$3 !== _p$.a && (_el$9.innerHTML = _p$.a = _v$3);
            _v$4 !== _p$.o && className(_el$0, _p$.o = _v$4);
            _v$5 !== _p$.i && setAttribute(_el$0, "data-fullname", _p$.i = _v$5);
            _v$6 !== _p$.n && className(_el$1, _p$.n = _v$6);
            return _p$;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0,
            i: void 0,
            n: void 0
          });
          return _el$8;
        }
      }), null);
      insert(_el$7, createComponent(Show, {
        get when() {
          return props.showAllPlatforms;
        },
        get children() {
          return createComponent(For, {
            get each() {
              return props.platforms;
            },
            children: (p) => (() => {
              var _el$11 = _tmpl$4(), _el$12 = _el$11.firstChild, _el$13 = _el$12.nextSibling;
              _el$11.$$click = () => props.onTabClick(p);
              insert(_el$13, () => p.name);
              createRenderEffect((_p$) => {
                var _v$10 = p.id === props.activePlatform.id ? styles$1.tabActive : "", _v$11 = styles$1.tabIcon, _v$12 = p.icon, _v$13 = styles$1.tabName, _v$14 = p.name;
                _v$10 !== _p$.e && className(_el$11, _p$.e = _v$10);
                _v$11 !== _p$.t && className(_el$12, _p$.t = _v$11);
                _v$12 !== _p$.a && (_el$12.innerHTML = _p$.a = _v$12);
                _v$13 !== _p$.o && className(_el$13, _p$.o = _v$13);
                _v$14 !== _p$.i && setAttribute(_el$13, "data-fullname", _p$.i = _v$14);
                return _p$;
              }, {
                e: void 0,
                t: void 0,
                a: void 0,
                o: void 0,
                i: void 0
              });
              return _el$11;
            })()
          });
        }
      }), null);
      insert(_el$10, createComponent(For, {
        get each() {
          return props.matchedRules;
        },
        children: (rule) => createComponent(RuleItem, {
          rule,
          get params() {
            return props.params;
          },
          get onCopy() {
            return props.onCopy;
          }
        })
      }));
      createRenderEffect((_p$) => {
        var _v$7 = styles$1.dialog + " " + styles$1.panel, _v$8 = styles$1.panelHeader, _v$9 = styles$1.closeBtn, _v$0 = styles$1.tabs, _v$1 = styles$1.rules;
        _v$7 !== _p$.e && className(_el$2, _p$.e = _v$7);
        _v$8 !== _p$.t && className(_el$3, _p$.t = _v$8);
        _v$9 !== _p$.a && className(_el$6, _p$.a = _v$9);
        _v$0 !== _p$.o && className(_el$7, _p$.o = _v$0);
        _v$1 !== _p$.i && className(_el$10, _p$.i = _v$1);
        return _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      });
      return _el$2;
    })()];
  };
  delegateEvents(["click"]);
  var _tmpl$ = template(`<div title=RSSHub订阅><span>`), _tmpl$2 = template(`<div>`);
  const [showPanel, setShowPanel] = createSignal(false);
  const [activePlatform, setActivePlatform] = createSignal(platforms[0]);
  const [toast, setToast] = createSignal("");
  function detectPlatform() {
    const host = window.location.host;
    if (host.includes("bilibili.com")) return platforms.find((p) => p.id === "bilibili");
    if (host.includes("youtube.com")) return platforms.find((p) => p.id === "youtube");
    if (host.includes("twitter.com") || host.includes("x.com")) return platforms.find((p) => p.id === "x");
    return null;
  }
  const App = () => {
    const [params, setParams] = createSignal({});
    const [showAllPlatforms, setShowAllPlatforms] = createSignal(false);
    onMount(() => {
      const detected = detectPlatform();
      if (detected) {
        setActivePlatform(detected);
      }
      setParams(detectParams((detected || platforms[0]).id));
    });
    const handleTabClick = (p) => {
      setActivePlatform(p);
      setParams(detectParams(p.id));
      setShowAllPlatforms(true);
    };
    const matchedRules = () => activePlatform().rules.filter((rule) => {
      const link = rule.genLink(params());
      return !/\{.+?\}/.test(link);
    });
    if (matchedRules().length === 0) return null;
    const handleClose = () => setShowPanel(false);
    const onBgClick = (e) => {
      if (e.target === e.currentTarget) handleClose();
    };
    return [createComponent(Show, {
      get when() {
        return memo(() => matchedRules().length > 0)() && !showPanel();
      },
      get children() {
        var _el$ = _tmpl$(), _el$2 = _el$.firstChild;
        _el$.$$click = () => setShowPanel(true);
        _el$2.innerHTML = rsshubLogo;
        createRenderEffect(() => className(_el$, styles$2.fab));
        return _el$;
      }
    }), createComponent(Show, {
      get when() {
        return showPanel();
      },
      get children() {
        return createComponent(Panel, {
          get showAllPlatforms() {
            return showAllPlatforms();
          },
          platforms,
          get activePlatform() {
            return activePlatform();
          },
          onTabClick: handleTabClick,
          get matchedRules() {
            return matchedRules();
          },
          get params() {
            return params();
          },
          onClose: handleClose,
          onBgClick,
          onCopy: (success) => {
            console.log("App onCopy 回调", success);
            setToast(success ? "已复制" : "复制失败");
            setTimeout(() => setToast(""), 1200);
          }
        });
      }
    }), createComponent(Show, {
      get when() {
        return toast();
      },
      get children() {
        var _el$3 = _tmpl$2();
        insert(_el$3, toast);
        createRenderEffect(() => className(_el$3, styles$2.toast));
        return _el$3;
      }
    })];
  };
  delegateEvents(["click"]);
  render(() => createComponent(App, {}), (() => {
    const app = document.createElement("div");
    app.style.position = "fixed";
    app.style.zIndex = "10000";
    app.style.pointerEvents = "none";
    app.style.width = "0";
    app.style.height = "0";
    app.style.top = "0";
    app.style.left = "0";
    document.body.append(app);
    return app;
  })());

})();