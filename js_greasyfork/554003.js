// ==UserScript==
// @name         Udvash Unmesh Auto-Login
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Autofills Registration Number and Password on Udvash Unmesh Login Page.
// @author       LazyDevUserX
// @match        https://online.udvash-unmesh.com/Account/Login*
// @match        https://online.udvash-unmesh.com/Account/Password*
// @grant        none
// @icon         https://raw.githubusercontent.com/LazyDevUserX/LazyUserScripts/refs/heads/main/Udvash/assets/UV.png
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554003/Udvash%20Unmesh%20Auto-Login.user.js
// @updateURL https://update.greasyfork.org/scripts/554003/Udvash%20Unmesh%20Auto-Login.meta.js
// ==/UserScript==
(function() {
  'use strict';

  const REGISTRATION_NUMBER = 'Your Registration Number';
  const PASSWORD = 'Your Password';

  const originalWrite = Document.prototype.write;
  Document.prototype.write = function(...args) {
    try {
      let html = args.join('');
      if (html.includes('RegistrationNumber') || html.includes('Password')) {
        html = html
          .replace(/(id=["']RegistrationNumber["'][^>]*value=["'])([^"']*)/i, `$1${REGISTRATION_NUMBER}`)
          .replace(/(<input[^>]+id=["']RegistrationNumber["'][^>]*)(?<!value=["'][^"']*)>/i, `$1 value="${REGISTRATION_NUMBER}">`)
          .replace(/(id=["']Password["'][^>]*value=["'])([^"']*)/i, `$1${PASSWORD}`)
          .replace(/(<input[^>]+id=["']Password["'][^>]*)(?<!value=["'][^"']*)>/i, `$1 value="${PASSWORD}">`);
        args = [html];
      }
    } catch {}
    return originalWrite.apply(this, args);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const regField = document.getElementById('RegistrationNumber');
    const regBtn = document.getElementById('btnSubmit');
    if (regField && regBtn) {
      regField.value = REGISTRATION_NUMBER;
      regBtn.click();
      return;
    }
    const passField = document.getElementById('Password');
    const loginBtn = document.querySelector('form button[type="submit"], form input[type="submit"], #btnSubmit');
    if (passField && loginBtn) {
      passField.value = PASSWORD;
      loginBtn.click();
    }
  }, { once: true });

  window.addEventListener('load', () => {
    Document.prototype.write = originalWrite;
  });
})();