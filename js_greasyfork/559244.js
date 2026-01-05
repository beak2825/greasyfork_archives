// ==UserScript==
// @name         Gamer520 自动填密+提交+点弹窗立即下载（www域名）
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  屏蔽原生弹窗；自动提取“密码保护：xxxx”填入并提交；当 SweetAlert2 弹窗出现时仅点击弹窗内“立即下载”。
// @match        https://www.gamer520.com/*
// @match        http://www.gamer520.com/*
// @match        https://like.gamer520.com/*
// @match        http://like.gamer520.com/*
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559244/Gamer520%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%AF%86%2B%E6%8F%90%E4%BA%A4%2B%E7%82%B9%E5%BC%B9%E7%AA%97%E7%AB%8B%E5%8D%B3%E4%B8%8B%E8%BD%BD%EF%BC%88www%E5%9F%9F%E5%90%8D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559244/Gamer520%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%AF%86%2B%E6%8F%90%E4%BA%A4%2B%E7%82%B9%E5%BC%B9%E7%AA%97%E7%AB%8B%E5%8D%B3%E4%B8%8B%E8%BD%BD%EF%BC%88www%E5%9F%9F%E5%90%8D%EF%BC%89.meta.js
// ==/UserScript==
// 更新说明：新增 like.gamer520.com 域名匹配

(function () {
  'use strict';

  // 1) 屏蔽原生 alert/confirm/prompt（不影响 SweetAlert2）
  window.alert = () => {};
  window.confirm = () => true;
  window.prompt = () => '';

  function fireInputEvents(el) {
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // 提取“密码保护：A00676”（支持数字/字母混合）
  function extractPwd() {
    const h1 = document.querySelector('h1.entry-title');
    if (!h1) return null;
    const m = h1.textContent.match(/密码保护[：:]\s*([A-Za-z0-9]+)/);
    return m ? m[1] : null;
  }

  // 自动填密+提交（点击提交按钮更像用户行为）
  function tryFillAndSubmit() {
    const pwd = extractPwd();
    if (!pwd) return false;

    const form =
      document.querySelector('form.post-password-form') ||
      document.querySelector('form[action*="wp-login.php"][action*="postpass"]');
    if (!form) return false;

    const input =
      form.querySelector('input[name="post_password"]') ||
      form.querySelector('input[type="password"]');
    if (!input) return false;

    if ((input.value || '').trim() !== pwd) {
      input.value = pwd;
      fireInputEvents(input);
    }

    const submitBtn =
      form.querySelector('input[type="submit"], button[type="submit"]') ||
      form.querySelector('input[value="提交"], button');
    if (submitBtn) submitBtn.click();
    else form.submit();

    return true;
  }

  // ✅ 只点击 SweetAlert2 弹窗内的“立即下载”
  function tryClickSwalDownload() {
    const shown =
      document.body.classList.contains('swal2-shown') ||
      document.querySelector('.swal2-container.swal2-center');

    if (!shown) return false;

    const btn = document.querySelector('.swal2-container button.swal2-confirm.swal2-styled');
    if (!btn) return false;

    const text = (btn.innerText || '').trim();
    if (text && !text.includes('立即下载')) return false;

    btn.click();
    return true;
  }

  let fillTimer = null;
  let swalTimer = null;

  function startLoops() {
    if (!fillTimer) {
      fillTimer = setInterval(() => {
        if (tryFillAndSubmit()) {
          clearInterval(fillTimer);
          fillTimer = null;
        }
      }, 300);
    }

    if (!swalTimer) {
      swalTimer = setInterval(() => {
        if (tryClickSwalDownload()) {
          clearInterval(swalTimer);
          swalTimer = null;
        }
      }, 200);
    }
  }

  document.addEventListener('DOMContentLoaded', startLoops);
  window.addEventListener('load', startLoops);
})();
