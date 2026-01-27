// ==UserScript==
// @name         18comic 防抢焦点
// @namespace    anti-focus-jmcomic
// @version      1.0.0
// @description  屏蔽非用户触发的 window.focus 和输入框强制聚焦
// @match        *://18comic.vip/*
// @match        *://*.18comic.vip/*
// @match        *://18comic.ink/*
// @match        *://*.18comic.ink/*
// @match        *://jmcomic-zzz.one/*
// @match        *://*.jmcomic-zzz.one/*
// @match        *://jmcomic-zzz.org/*
// @match        *://*.jmcomic-zzz.org/*
// @match        *://jm18c-jjd.club/*
// @match        *://*.jm18c-jjd.club/*
// @match        *://jm18c-uoi.net/*
// @match        *://*.jm18c-uoi.net/*
// @match        *://jm18c-tdc.cc/*
// @match        *://*.jm18c-tdc.cc/*
// @match        *://jmtt.shop/*
// @match        *://*.jmtt.shop/*
// @match        *://jm222.xyz/*
// @match        *://*.jm222.xyz/*
// @match        *://jm224.xyz/*
// @match        *://*.jm224.xyz/*
// @match        *://jmcomicapp.xyz/*
// @match        *://*.jmcomicapp.xyz/*
// @match        *://jm225.xyz/*
// @match        *://*.jm225.xyz/*
// @match        *://jm223.xyz/*
// @match        *://*.jm223.xyz/*
// @match        *://jmcomic2.shop/*
// @match        *://*.jmcomic2.shop/*
// @match        *://jmcomic22.xyz/*
// @match        *://*.jmcomic22.xyz/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564223/18comic%20%E9%98%B2%E6%8A%A2%E7%84%A6%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/564223/18comic%20%E9%98%B2%E6%8A%A2%E7%84%A6%E7%82%B9.meta.js
// ==/UserScript==
// ==/UserScript==

(function () {
  'use strict';

  let lastUserAction = 0;
  const USER_ACTION_WINDOW_MS = 800;

  function markUserAction() {
    lastUserAction = Date.now();
  }

  window.addEventListener('pointerdown', markUserAction, true);
  window.addEventListener('keydown', markUserAction, true);

  function isUserInitiated() {
    return Date.now() - lastUserAction < USER_ACTION_WINDOW_MS;
  }

  const origWindowFocus =
    typeof window.focus === 'function' ? window.focus.bind(window) : null;
  const origElFocus = HTMLElement.prototype.focus;
  const origInputFocus = HTMLInputElement.prototype.focus;

  window.focus = function (...args) {
    if (!origWindowFocus) return;
    if (isUserInitiated()) {
      return origWindowFocus.apply(this, args);
    }
    return;
  };

  HTMLElement.prototype.focus = function (...args) {
    const tag = this && this.tagName ? this.tagName.toLowerCase() : '';
    if (isUserInitiated()) {
      return origElFocus.apply(this, args);
    }
    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
      return;
    }
    return origElFocus.apply(this, args);
  };

  HTMLInputElement.prototype.focus = function (...args) {
    if (isUserInitiated()) {
      return origInputFocus.apply(this, args);
    }
    return;
  };
})();