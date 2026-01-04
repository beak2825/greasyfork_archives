// ==UserScript==
// @name         Twitch - Unlock Staff/Moderator Features
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-09-17
// @description  Unlock certain Staff/Moderator features
// @author       ぐらんぴ
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549868/Twitch%20-%20Unlock%20StaffModerator%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/549868/Twitch%20-%20Unlock%20StaffModerator%20Features.meta.js
// ==/UserScript==


['isModerator','track','isStaff', '[var u = [‮[‮['].forEach(k=>Object.defineProperty(Object.prototype,k,{set(v){this[`_${k}`]=v;this._isStaff=true;this._isModerator=true;this.staff=true;},get(){return this[`_${k}`]},configurable:true,enumerable:false}));
