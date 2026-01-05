// ==UserScript==
// @name         RAP
// @name:ru      RAP
// @namespace    https://greasyfork.org/en/users/1548792-lgkuodsjksgnskgsnvkl
// @version      22
// @description  Resource Access Protection
// @description:ru  Защита доступа к ресурсам
// @author       lgkuodsjksgnskgsnvkl
// @license      MIT
// @match        *://*/*
// @match        file:///*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559282/RAP.user.js
// @updateURL https://update.greasyfork.org/scripts/559282/RAP.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const _0x1a = ['blur', 'focus', 'focusin', 'focusout', 'visibilitychange', 'webkitvisibilitychange', 'pagehide', 'pageshow', 'freeze', 'resume'];
    const _0x1b = new Set(_0x1a);
    const _0x1c = _0x1d => { _0x1d.stopImmediatePropagation(); _0x1d.stopPropagation(); _0x1d.preventDefault(); return false; };
    const _0x1e = _0x1f => _0x1f === window || _0x1f === document || _0x1f === document.body || _0x1f === document.documentElement;
    _0x1a.forEach(_0x20 => { window.addEventListener(_0x20, _0x1c, true); document.addEventListener(_0x20, _0x1c, true); });
    const _0x21 = EventTarget.prototype.addEventListener;
    const _0x22 = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.addEventListener = function (_0x23, _0x24, _0x25) { if (_0x1b.has(_0x23) && _0x1e(this)) return; return _0x21.call(this, _0x23, _0x24, _0x25); };
    EventTarget.prototype.removeEventListener = function (_0x23, _0x24, _0x25) { if (_0x1b.has(_0x23) && _0x1e(this)) return; return _0x22.call(this, _0x23, _0x24, _0x25); };
    const _0x26 = { get: () => null, set: () => true, configurable: true };
    ['onblur', 'onfocus', 'onvisibilitychange', 'onpagehide', 'onpageshow'].forEach(_0x27 => { try { Object.defineProperty(window, _0x27, _0x26); } catch (_0x28) { } try { Object.defineProperty(document, _0x27, _0x26); } catch (_0x28) { } });
    try { Object.defineProperty(document, 'hidden', { get: () => false, configurable: true }); } catch (_0x29) { }
    try { Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true }); } catch (_0x29) { }
    try { Object.defineProperty(document, 'webkitHidden', { get: () => false, configurable: true }); } catch (_0x29) { }
    Document.prototype.hasFocus = function () { return true; };
    const _0x2a = _0x2b => function toString() { return 'function ' + _0x2b + '() { [native code] }'; };
    EventTarget.prototype.addEventListener.toString = _0x2a('addEventListener');
    EventTarget.prototype.removeEventListener.toString = _0x2a('removeEventListener');
    Document.prototype.hasFocus.toString = _0x2a('hasFocus');
    const _0x2c = ['Control', 'Alt', 'Meta', 'Escape', 'Tab', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PrintScreen', 'ScrollLock', 'Pause', 'Insert', 'ContextMenu', 'OS'];
    const _0x2d = _0x2e => { if (_0x2c.includes(_0x2e.key) || _0x2e.altKey || _0x2e.metaKey || _0x2e.ctrlKey) { _0x2e.stopImmediatePropagation(); _0x2e.stopPropagation(); } };
    ['keydown', 'keyup', 'keypress'].forEach(_0x2f => { window.addEventListener(_0x2f, _0x2d, true); document.addEventListener(_0x2f, _0x2d, true); });
    const _0x30 = window.fetch;
    window.fetch = function (_0x31, _0x32) { const _0x33 = typeof _0x31 === 'string' ? _0x31 : _0x31?.url || ''; const _0x34 = _0x32?.body || ''; const _0x35 = typeof _0x34 === 'string' ? _0x34 : ''; if (_0x33.toLowerCase().includes('violation') || _0x33.toLowerCase().includes('proctoring')) { return Promise.resolve(new Response('{"success":true}', { status: 200 })); } if (_0x35.includes('LEAVE_PAGE')) { return Promise.resolve(new Response('{"success":true}', { status: 200 })); } return _0x30.apply(this, arguments); };
    window.fetch.toString = _0x2a('fetch');
    const _0x36 = XMLHttpRequest.prototype.open;
    const _0x37 = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (_0x38, _0x39) { this._0x3a = _0x39; return _0x36.apply(this, arguments); };
    XMLHttpRequest.prototype.send = function (_0x3b) { const _0x3c = this._0x3a || ''; const _0x3d = typeof _0x3b === 'string' ? _0x3b : ''; if (_0x3c.toLowerCase().includes('violation') || _0x3c.toLowerCase().includes('proctoring') || _0x3d.includes('LEAVE_PAGE')) { Object.defineProperty(this, 'status', { value: 200, writable: false }); Object.defineProperty(this, 'responseText', { value: '{}', writable: false }); Object.defineProperty(this, 'readyState', { value: 4, writable: false }); setTimeout(() => { if (this.onreadystatechange) this.onreadystatechange(); if (this.onload) this.onload(); }, 0); return; } return _0x37.apply(this, arguments); };
    try { Object.defineProperty(navigator, 'onLine', { get: () => true, configurable: false }); } catch (_0x3e) { }
    document.addEventListener('DOMContentLoaded', () => { if (document.body) _0x1a.forEach(_0x3f => document.body.addEventListener(_0x3f, _0x1c, true)); if (document.documentElement) _0x1a.forEach(_0x3f => document.documentElement.addEventListener(_0x3f, _0x1c, true)); });
})();
