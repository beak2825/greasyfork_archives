// ==UserScript==
// @name         Picture-in-Picture
// @namespace    https://git.sr.ht/~anhkhoakz/UserScripts/tree/main/item/src/pip.ts
// @version      1.0.0
// @description  Watch video using Picture-in-Picture
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0yMTYsNDhINDBBMTYsMTYsMCwwLDAsMjQsNjRWMTkyYTE2LDE2LDAsMCwwLDE2LDE2SDIxNmExNiwxNiwwLDAsMCwxNi0xNlY2NEExNiwxNiwwLDAsMCwyMTYsNDhaTTQwLDY0SDIxNnY1NkgxMzZhOCw4LDAsMCwwLTgsOHY2NEg0MFpNMjE2LDE5MkgxNDRWMTM2aDcydjU2WiI+PC9wYXRoPjwvc3ZnPg==
// @author       anhkhoakz
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license     AGPL-3.0; https://www.gnu.org/licenses/agpl-3.0.html#license-text
// @downloadURL https://update.greasyfork.org/scripts/556357/Picture-in-Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/556357/Picture-in-Picture.meta.js
// ==/UserScript==

// node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1;e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t)
        ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

// node_modules/@violentmonkey/shortcut/dist/index.mjs
/*! @violentmonkey/shortcut v1.4.4 | ISC License */
var isMacintosh = navigator.userAgent.includes("Macintosh"), modifierList = ["m", "c", "s", "a"], modifiers = {
  ctrl: "c",
  control: "c",
  shift: "s",
  alt: "a",
  meta: "m",
  cmd: "m"
}, modifierAliases = _extends({}, modifiers, {
  c: "c",
  s: "s",
  a: "a",
  m: "m",
  cm: isMacintosh ? "m" : "c",
  ctrlcmd: isMacintosh ? "m" : "c"
});
var aliases = {
  arrowup: "up",
  arrowdown: "down",
  arrowleft: "left",
  arrowright: "right",
  cr: "enter",
  escape: "esc",
  " ": "space"
};
function createKeyNode() {
  return {
    children: /* @__PURE__ */ new Map,
    shortcuts: /* @__PURE__ */ new Set
  };
}
function addKeyNode(root, sequence, shortcut) {
  let node = root;
  for (let key of sequence) {
    let child = node.children.get(key);
    if (!child)
      child = createKeyNode(), node.children.set(key, child);
    node = child;
  }
  node.shortcuts.add(shortcut);
}
function getKeyNode(root, sequence) {
  let node = root;
  for (let key of sequence)
    if (node = node.children.get(key), !node)
      break;
  return node;
}
function removeKeyNode(root, sequence, shortcut) {
  let node = root, ancestors = [node];
  for (let key of sequence) {
    if (node = node.children.get(key), !node)
      return;
    ancestors.push(node);
  }
  if (shortcut)
    node.shortcuts.delete(shortcut);
  else
    node.shortcuts.clear();
  let i = ancestors.length - 1;
  while (i > 0) {
    if (node = ancestors[i], node.shortcuts.size || node.children.size)
      break;
    ancestors[i - 1].children.delete(sequence[i - 1]), i -= 1;
  }
}
function reprNodeTree(root) {
  let result = [], reprChildren = (node, level = 0) => {
    for (let [key, child] of node.children.entries())
      result.push(["  ".repeat(level), key, child.shortcuts.size ? ` (${child.shortcuts.size})` : ""].join("")), reprChildren(child, level + 1);
  };
  return reprChildren(root), result.join(`
`);
}

class Subject {
  constructor(value) {
    this.listeners = [], this.value = value;
  }
  get() {
    return this.value;
  }
  set(value) {
    this.value = value, this.listeners.forEach((listener) => listener(value));
  }
  subscribe(callback) {
    return this.listeners.push(callback), callback(this.value), () => this.unsubscribe(callback);
  }
  unsubscribe(callback) {
    let i = this.listeners.indexOf(callback);
    if (i >= 0)
      this.listeners.splice(i, 1);
  }
}
function buildKey(key) {
  let {
    caseSensitive,
    modifierState
  } = key, {
    base
  } = key;
  if (!caseSensitive || base.length > 1)
    base = base.toLowerCase();
  base = aliases[base] || base;
  let keyExp = [...modifierList.filter((m) => modifierState[m]), base].filter(Boolean).join("-");
  return `${caseSensitive ? "" : "i:"}${keyExp}`;
}
function breakKey(shortcut) {
  let pieces = shortcut.split(/-(.)/), parts = [pieces[0]];
  for (let i = 1;i < pieces.length; i += 2)
    parts.push(pieces[i] + pieces[i + 1]);
  return parts;
}
function parseKey(shortcut, caseSensitive) {
  let parts = breakKey(shortcut), base = parts.pop(), modifierState = {};
  for (let part of parts) {
    let key = modifierAliases[part.toLowerCase()];
    if (!key)
      throw Error(`Unknown modifier key: ${part}`);
    modifierState[key] = !0;
  }
  return caseSensitive && (caseSensitive = !(modifierState.a || modifierState.s)), {
    base,
    modifierState,
    caseSensitive
  };
}
function getSequence(input) {
  return Array.isArray(input) ? input : input.split(/\s+/);
}
function normalizeSequence(input, caseSensitive) {
  return getSequence(input).map((key) => parseKey(key, caseSensitive));
}
function parseCondition(condition) {
  return condition.split("&&").map((key) => {
    if (key = key.trim(), !key)
      return;
    if (key[0] === "!")
      return {
        not: !0,
        field: key.slice(1).trim()
      };
    return {
      not: !1,
      field: key
    };
  }).filter(Boolean);
}
class KeyboardService {
  constructor(options) {
    this._context = {}, this._conditionData = {}, this._data = [], this._root = createKeyNode(), this.sequence = new Subject([]), this._timer = 0, this._reset = () => {
      this._cur = void 0, this.sequence.set([]), this._resetTimer();
    }, this.handleKey = (e) => {
      if (!e.key || modifiers[e.key.toLowerCase()])
        return;
      this._resetTimer();
      let keyExps = [
        buildKey({
          base: e.key,
          modifierState: {
            c: e.ctrlKey,
            m: e.metaKey
          },
          caseSensitive: !0
        }),
        buildKey({
          base: e.code,
          modifierState: {
            c: e.ctrlKey,
            s: e.shiftKey,
            a: e.altKey,
            m: e.metaKey
          },
          caseSensitive: !1
        }),
        buildKey({
          base: e.key,
          modifierState: {
            c: e.ctrlKey,
            s: e.shiftKey,
            a: e.altKey,
            m: e.metaKey
          },
          caseSensitive: !1
        })
      ], state = this._handleKeyOnce(keyExps, !1);
      if (state) {
        if (e.preventDefault(), state === 2)
          this._reset();
      }
      this._timer = window.setTimeout(this._reset, this.options.sequenceTimeout);
    }, this.options = _extends({}, KeyboardService.defaultOptions, options);
  }
  _resetTimer() {
    if (this._timer)
      window.clearTimeout(this._timer), this._timer = 0;
  }
  _addCondition(condition) {
    let cache = this._conditionData[condition];
    if (!cache) {
      let value = parseCondition(condition);
      cache = {
        count: 0,
        value,
        result: this._evalCondition(value)
      }, this._conditionData[condition] = cache;
    }
    cache.count += 1;
  }
  _removeCondition(condition) {
    let cache = this._conditionData[condition];
    if (cache) {
      if (cache.count -= 1, !cache.count)
        delete this._conditionData[condition];
    }
  }
  _evalCondition(conditions) {
    return conditions.every((cond) => {
      let value = this._context[cond.field];
      if (cond.not)
        value = !value;
      return value;
    });
  }
  _checkShortcut(item) {
    let cache = item.condition && this._conditionData[item.condition], enabled = !cache || cache.result;
    if (item.enabled !== enabled)
      item.enabled = enabled, this._enableShortcut(item);
  }
  _enableShortcut(item) {
    (item.enabled ? addKeyNode : removeKeyNode)(this._root, item.sequence, item);
  }
  enable() {
    this.disable(), document.addEventListener("keydown", this.handleKey);
  }
  disable() {
    document.removeEventListener("keydown", this.handleKey);
  }
  register(key, callback, options) {
    let {
      caseSensitive,
      condition
    } = _extends({
      caseSensitive: !1
    }, options), item = {
      sequence: normalizeSequence(key, caseSensitive).map((key2) => buildKey(key2)),
      condition,
      callback,
      enabled: !1,
      caseSensitive
    };
    if (condition)
      this._addCondition(condition);
    return this._checkShortcut(item), this._data.push(item), () => {
      let index = this._data.indexOf(item);
      if (index >= 0) {
        if (this._data.splice(index, 1), condition)
          this._removeCondition(condition);
        item.enabled = !1, this._enableShortcut(item);
      }
    };
  }
  setContext(key, value) {
    this._context[key] = value;
    for (let cache of Object.values(this._conditionData))
      cache.result = this._evalCondition(cache.value);
    for (let item of this._data)
      this._checkShortcut(item);
  }
  _handleKeyOnce(keyExps, fromRoot) {
    var _cur, _cur2;
    let cur = this._cur;
    if (fromRoot || !cur)
      fromRoot = !0, cur = this._root;
    if (cur) {
      let next;
      for (let key of keyExps)
        if (next = getKeyNode(cur, [key]), next) {
          this.sequence.set([...this.sequence.get(), key]);
          break;
        }
      cur = next;
    }
    this._cur = cur;
    let [shortcut] = [...((_cur = cur) == null ? void 0 : _cur.shortcuts) || []];
    if (!fromRoot && !shortcut && !((_cur2 = cur) != null && _cur2.children.size))
      return this._reset(), this._handleKeyOnce(keyExps, !0);
    if (shortcut) {
      try {
        shortcut.callback();
      } catch (_unused) {}
      return 2;
    }
    return this._cur ? 1 : 0;
  }
  repr() {
    return reprNodeTree(this._root);
  }
}
KeyboardService.defaultOptions = {
  sequenceTimeout: 500
};
var service;
function getService() {
  if (!service)
    service = new KeyboardService, service.enable();
  return service;
}
var register = (...args) => getService().register(...args);

// src/pip.ts
var PIP_ATTRIBUTE = "__pip__", PIP_ATTRIBUTE_VALUE = "true", VIDEO_SELECTOR = "video", KEYBOARD_SHORTCUT = "c-p", RESIZE_THROTTLE_MS = 300, VIDEO_READY_STATE_HAVE_NOTHING = 0, INITIAL_LARGEST_SIZE = 0, LEAVE_PIP_EVENT = "leavepictureinpicture", MENU_COMMAND_TEXT = "Toggle Picture-in-Picture", ERROR_MESSAGE_PIP_FAILED = "Failed to enter Picture-in-Picture:", currentPipVideo = null, resizeObserver = null, resizeThrottleTimer = null, getVideoSize = (video) => {
  let rect = video.getBoundingClientRect();
  return rect.width * rect.height;
}, findLargestPlayingVideo = () => {
  let videos = Array.from(document.querySelectorAll(VIDEO_SELECTOR)), largestVideo, largestSize = INITIAL_LARGEST_SIZE;
  for (let video of videos) {
    if (video.readyState === VIDEO_READY_STATE_HAVE_NOTHING || video.disablePictureInPicture)
      continue;
    let size = getVideoSize(video);
    if (size > largestSize)
      largestSize = size, largestVideo = video;
  }
  return largestVideo;
}, requestPictureInPicture = async (video) => {
  try {
    await video.requestPictureInPicture(), video.setAttribute(PIP_ATTRIBUTE, PIP_ATTRIBUTE_VALUE), currentPipVideo = video;
    let handleLeave = () => {
      if (video.removeAttribute(PIP_ATTRIBUTE), currentPipVideo = null, resizeObserver !== null)
        resizeObserver.disconnect(), resizeObserver = null;
    };
    if (video.addEventListener(LEAVE_PIP_EVENT, handleLeave, { once: !0 }), resizeObserver === null)
      resizeObserver = new ResizeObserver(maybeUpdatePictureInPictureVideo);
    resizeObserver.observe(video);
  } catch (error) {
    console.error(ERROR_MESSAGE_PIP_FAILED, error);
  }
}, maybeUpdatePictureInPictureVideo = (entries, observer) => {
  if (resizeThrottleTimer !== null)
    return;
  resizeThrottleTimer = window.setTimeout(() => {
    resizeThrottleTimer = null;
    let observedVideo = entries[0]?.target;
    if (observedVideo === void 0)
      return;
    if (currentPipVideo === null)
      return;
    let video = findLargestPlayingVideo();
    if (video !== void 0 && video !== currentPipVideo && !video.hasAttribute(PIP_ATTRIBUTE)) {
      let currentSize = getVideoSize(currentPipVideo);
      if (getVideoSize(video) > currentSize)
        observer.unobserve(observedVideo), requestPictureInPicture(video);
    }
  }, RESIZE_THROTTLE_MS);
}, togglePictureInPicture = async () => {
  if (currentPipVideo !== null) {
    await document.exitPictureInPicture();
    return;
  }
  let video = findLargestPlayingVideo();
  if (video === void 0)
    return;
  await requestPictureInPicture(video);
}, registerKeyboardShortcuts = () => {
  register(KEYBOARD_SHORTCUT, () => {
    togglePictureInPicture();
  });
}, registerMenuCommands = () => {
  GM_registerMenuCommand(MENU_COMMAND_TEXT, () => {
    togglePictureInPicture();
  });
};
registerKeyboardShortcuts();
registerMenuCommands();