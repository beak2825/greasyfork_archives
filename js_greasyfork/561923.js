// ==UserScript==
// @name         Fix github ipynb render failed
// @namespace    https://tampermonkey.net/
// @version      0.1.0
// @description  Patch addEventListener to drop window message events except {type:'render'}
// @author       plusls
// @include      *://github.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561923/Fix%20github%20ipynb%20render%20failed.user.js
// @updateURL https://update.greasyfork.org/scripts/561923/Fix%20github%20ipynb%20render%20failed.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const origAdd = EventTarget.prototype.addEventListener;
  const origRemove = EventTarget.prototype.removeEventListener;

  // 关键：缓存包装后的函数，避免重复包装 & 保证 removeEventListener 能移除
  const wrappedMap = new WeakMap();

  function shouldDropMessageEvent(message_event) {
    const data = message_event && message_event.data;
    // drop no render event
    return data.type && data.type !== 'render';
  }

  EventTarget.prototype.addEventListener = function (...args) {
    const [type, listener] = args;

    if (type === 'message' && typeof listener === 'function') {
      // 同一个 listener 只包装一次
      let wrapped = wrappedMap.get(listener);
      if (!wrapped) {
        wrapped = function (message_event) {
          if (shouldDropMessageEvent(message_event)) {
            // console.log('drop event');
            // console.log(message_event);
            return;
          }
          return listener.call(this, message_event);
        };
        wrappedMap.set(listener, wrapped);
      }

      args[1] = wrapped;
    }

    return origAdd.apply(this, args);
  };

  // 可选但强烈建议：同步修补 removeEventListener，确保能正常移除
  EventTarget.prototype.removeEventListener = function (...args) {
    const [type, listener] = args;

    if (type === 'message' && typeof listener === 'function') {
      const wrapped = wrappedMap.get(listener);
      if (wrapped) args[1] = wrapped;
    }

    return origRemove.apply(this, args);
  };
})();
