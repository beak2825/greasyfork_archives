// ==UserScript==
// @name         Windows Cursor for iPad (iOS)
// @namespace    https://greasyfork.org/en/users/your-name
// @version      1.0
// @description  Force a Windows-style mouse cursor on all sites (where iOS allows custom cursors).
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559421/Windows%20Cursor%20for%20iPad%20%28iOS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559421/Windows%20Cursor%20for%20iPad%20%28iOS%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Simple white arrow with black border, Windows-like
  // SVG is URL-encoded for use directly as a data URL
  const windowsCursor = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2218%22%20height%3D%2228%22%20viewBox%3D%220%200%2018%2028%22%3E%3Cpath%20d%3D%22M1%201L1%2024L6%2018L10%2027L13%2026L9%2017L16%2017Z%22%20fill%3D%22white%22%20stroke%3D%22black%22%20stroke-width%3D%221%22/%3E%3C/svg%3E';

  function injectCursorStyle() {
    const style = document.createElement('style');
    style.id = 'ios-windows-cursor-style';
    style.textContent = `
      * {
        cursor: url("${windowsCursor}") 1 1, default !important;
      }
    `;
    document.documentElement.appendChild(style);
  }

  if (document.documentElement) {
    injectCursorStyle();
  } else {
    document.addEventListener('DOMContentLoaded', injectCursorStyle, { once: true });
  }
})();
