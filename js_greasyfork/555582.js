// ==UserScript==
// @name         Loader
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @author       Nozom.u
// @description  mec-itutorの誤作動防止のためにローディングを表示します
// @match        *://mec-itutor.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555582/Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/555582/Loader.meta.js
// ==/UserScript==

/* global Sys */

(function() {
  'use strict';

  function showOverlay() {
    if (document.getElementById('loadingOverlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.style = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(255,255,255,0.7);
      z-index: 99999;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    // スピナー
    overlay.innerHTML = `
      <div style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #333;
        font-size: 18px;
        font-weight: bold;
      ">
        <div class="loading-spinner" style="
          width: 30px; height: 30px;
          border: 4px solid rgba(0,0,0,0.1);
          border-top: 4px solid #555;
          border-radius: 50%;
          margin-bottom: 12px;
          animation: spin 0.5s linear infinite;
        "></div>
      </div>
      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(overlay);
  }

  function hideOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.remove();
  }

  // ページ読み込み完了時
  window.addEventListener('load', hideOverlay);

  // __doPostBack フック
  const originalPostBack = window.__doPostBack;
  if (typeof originalPostBack === 'function') {
    window.__doPostBack = function(eventTarget, eventArgument) {
      showOverlay();
      return originalPostBack(eventTarget, eventArgument);
    };
  }

  // ASP.NET AJAX UpdatePanel の完了イベントにも対応
  const checkManager = setInterval(() => {
    const mgr = window.Sys && Sys.WebForms && Sys.WebForms.PageRequestManager && Sys.WebForms.PageRequestManager.getInstance();
    if (mgr) {
      clearInterval(checkManager);
      mgr.add_endRequest(() => {
        hideOverlay();
      });
    }
  }, 500);
})();