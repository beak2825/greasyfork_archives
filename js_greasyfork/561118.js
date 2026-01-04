// ==UserScript==
  // @name         Square Face Generator - GitHub Avatar Helper
  // @namespace    http://square-face-generator.com/
  // @version      1.0
  // @description  Add a "Generate Pixel Avatar" button to GitHub profile pages
  // @author       Square Face Generator
  // @match        https://github.com/*
  // @icon         https://square-face-generator.com/favicon.svg
  // @grant        none
  // @homepageURL  https://square-face-generator.com/
// @downloadURL https://update.greasyfork.org/scripts/561118/Square%20Face%20Generator%20-%20GitHub%20Avatar%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/561118/Square%20Face%20Generator%20-%20GitHub%20Avatar%20Helper.meta.js
  // ==/UserScript==

  (function() {
      if (!location.pathname.match(/^\/[^/]+$/)) return;

      const btn = document.createElement('a');
      btn.textContent = '🎮 Generate Avatar';
      btn.href = 'https://square-face-generator.com/?utm_source=github_userscript';
      btn.target = '_blank';
      btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;padding:12px 20px;background:#7C3AED;color:white;border:none;border-radius:8px;text-decoration:none;font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(124,58,237,0.3);';
      document.body.appendChild(btn);
  })();