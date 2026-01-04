// ==UserScript==
// @name         XET H5 PC 样式优化
// @namespace    https://tampermonkey.net/
// @version      1.0.0
// @description  为 *.h5.xet.citv.cn 页面提供电脑端样式优化
// @author       Eddie7x
// @license      MIT
// @match        *://*.h5.xet.citv.cn/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560386/XET%20H5%20PC%20%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/560386/XET%20H5%20PC%20%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** 等待元素出现 */
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const timer = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(timer);
          resolve(el);
        }
        if (Date.now() - start > timeout) {
          clearInterval(timer);
          reject(`Timeout waiting for ${selector}`);
        }
      }, 200);
    });
  }

  /** 注入样式 */
  function injectStyle(cssText) {
    const style = document.createElement('style');
    style.innerHTML = cssText;
    document.head.appendChild(style);
  }

  async function main() {
    try {
      const app = await waitForElement(
        '#common_template_mounted_el_container #app'
      );

      injectStyle(`
        /* ===== PC 端整体布局 ===== */
        body {
          background: #f5f6f7 !important;
        }

        #common_template_mounted_el_container {
          display: flex;
          justify-content: center;
        }

        #common_template_mounted_el_container #app {
          max-width: 1200px;
          min-width: 960px;
          margin: 24px auto;
          background: #fff;
          box-shadow: 0 8px 24px rgba(0,0,0,.08);
          border-radius: 12px;
          overflow: hidden;
        }

        .course-video-container__content {
            height: 540px !important;
        }

        /* ===== 提升可读性 ===== */
        #app {
          font-size: 16px !important;
          line-height: 1.75;
        }

        /* ===== 禁掉 H5 奇怪的最大宽度 ===== */
        #app * {
          max-width: unset !important;
        }
      `);

      console.log('[XET-PC] 样式已注入');
    } catch (e) {
      console.warn('[XET-PC] 注入失败', e);
    }
  }

  main();
})();
