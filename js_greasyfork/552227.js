// ==UserScript==
  // @name         Google AI Studio 图片去水印
  // @namespace    https://aistudio.google.com/
  // @version      1.0.3
  // @description  自动阻止 Google AI Studio 加载 watermark_v4.png，让生成图片无水印
  // @match        https://aistudio.google.com/*
  // @run-at       document-start
  // @grant        none
  // @auther       hepingfly（公众号：和平本记）
  // @noframes
  // @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/552227/Google%20AI%20Studio%20%E5%9B%BE%E7%89%87%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/552227/Google%20AI%20Studio%20%E5%9B%BE%E7%89%87%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
  // ==/UserScript==

  (function () {
    'use strict';

    const pattern = /watermark_v4\.png/i;
    const logPrefix = '[AI Studio Watermark Blocker]';
    const log = (...args) => console.log(logPrefix, ...args);

    const shouldBlock = (candidate) => {
      if (!candidate) return false;
      const value = String(candidate);
      if (pattern.test(value)) return true;
      try {
        const absolute = new URL(value, location.href).href;
        return pattern.test(absolute);
      } catch {
        return false;
      }
    };

    // fetch()
    if (window.fetch) {
      const originalFetch = window.fetch;
      window.fetch = function (...args) {
        const input = args[0];
        const url = typeof input === 'string' ? input : input?.url;
        if (shouldBlock(url)) {
          log('Blocked fetch:', url);
          return Promise.reject(
            new DOMException('Blocked watermark request', 'AbortError'),
          );
        }
        return originalFetch.apply(this, args);
      };
    }

    // XMLHttpRequest
    const xhrProto = XMLHttpRequest.prototype;
    const originalOpen = xhrProto.open;
    const originalSend = xhrProto.send;

    xhrProto.open = function (method, url, ...rest) {
      this.__watermarkBlocked = shouldBlock(url);
      if (this.__watermarkBlocked) {
        log('Blocked XHR:', url);
      }
      return originalOpen.call(this, method, url, ...rest);
    };

    xhrProto.send = function (...args) {
      if (this.__watermarkBlocked) {
        this.abort();
        return;
      }
      return originalSend.apply(this, args);
    };

    // <img src="...">
    const imageProto = HTMLImageElement.prototype;
    const srcDescriptor = Object.getOwnPropertyDescriptor(imageProto, 'src');
    if (srcDescriptor?.set && srcDescriptor?.get) {
      Object.defineProperty(imageProto, 'src', {
        configurable: true,
        enumerable: srcDescriptor.enumerable,
        get() {
          return srcDescriptor.get.call(this);
        },
        set(value) {
          if (shouldBlock(value)) {
            log('Blocked <img> src:', value);
            return;
          }
          return srcDescriptor.set.call(this, value);
        },
      });
    }

    // setAttribute（覆盖 src/style 时防止回退路径触发）
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
      const lower = String(name).toLowerCase();
      const strValue = String(value);

      if (lower === 'src' && shouldBlock(strValue)) {
        log('Blocked setAttribute src:', strValue);
        return;
      }

      if (lower === 'style' && shouldBlock(strValue)) {
        log('Sanitized inline style:', strValue);
        const sanitized = strValue.replace(pattern, 'none');
        return originalSetAttribute.call(this, name, sanitized);
      }

      return originalSetAttribute.call(this, name, value);
    };

    // style.setProperty / style.backgroundImage
    const styleProto = CSSStyleDeclaration.prototype;
    const originalSetProperty = styleProto.setProperty;
    styleProto.setProperty = function (property, value, priority) {
      if (/background-image/i.test(property) && shouldBlock(value)) {
        log('Blocked background-image via setProperty:', value);
        return;
      }
      return originalSetProperty.call(this, property, value, priority);
    };

    const bgDescriptor = Object.getOwnPropertyDescriptor(
      styleProto,
      'backgroundImage',
    );
    if (bgDescriptor?.set && bgDescriptor?.get) {
      Object.defineProperty(styleProto, 'backgroundImage', {
        configurable: true,
        enumerable: bgDescriptor.enumerable,
        get() {
          return bgDescriptor.get.call(this);
        },
        set(value) {
          if (shouldBlock(value)) {
            log('Blocked backgroundImage setter:', value);
            return;
          }
          return bgDescriptor.set.call(this, value);
        },
      });
    }

    log('Initialized');
  })();