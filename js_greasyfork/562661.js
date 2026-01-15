// ==UserScript==
  // @name         修复 Bugutv Magnet 链接空格
  // @namespace    http://tampermonkey.net/
  // @version      1.0
  // @description  移除 bugutv.vip 上 magnet 链接中 "magnet:?" 后的多余空格
  // @author       You
  // @match        https://bugutv.vip/*
  // @grant        none
  // @run-at       document-idle
  // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562661/%E4%BF%AE%E5%A4%8D%20Bugutv%20Magnet%20%E9%93%BE%E6%8E%A5%E7%A9%BA%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/562661/%E4%BF%AE%E5%A4%8D%20Bugutv%20Magnet%20%E9%93%BE%E6%8E%A5%E7%A9%BA%E6%A0%BC.meta.js
  // ==/UserScript==

  (function() {
      'use strict';

      function fixMagnetLinks() {
          const links = document.querySelectorAll('a[href^="magnet:?"]');
          links.forEach(link => {
              const original = link.href;
              const fixed = original.replace('magnet:? xt=', 'magnet:?xt=');
              if (original !== fixed) {
                  link.href = fixed;
                  console.log('已修复:', original, '->', fixed);
              }
          });
      }

      // 初始运行
      fixMagnetLinks();

      // 监听动态加载的内容
      const observer = new MutationObserver(() => {
          fixMagnetLinks();
      });

      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  })();