// ==UserScript==
// @name         财务系统金额粘贴去空格
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在 cai.bistu.edu.cn 财务系统中，所有金额输入框（含新增行）粘贴时自动删除空格
// @author       LoneSpectator
// @license      GPL-3.0
// @match        https://cai.bistu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559937/%E8%B4%A2%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%87%91%E9%A2%9D%E7%B2%98%E8%B4%B4%E5%8E%BB%E7%A9%BA%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/559937/%E8%B4%A2%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%87%91%E9%A2%9D%E7%B2%98%E8%B4%B4%E5%8E%BB%E7%A9%BA%E6%A0%BC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 统一判断函数：是否为金额输入框
  function isAmountInput(el) {
    if (!el || (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA')) return false;
    // 前缀匹配所有索引行：_0/_1/_2...
    return el.matches('[id^="formWF_YBX_456_t-gwk_amt_"], [id^="formWF_YBX_456_t-amount_"]');
  }

  // 粘贴去空格（事件代理，覆盖动态新增的行）
  document.addEventListener('paste', function (event) {
    const target = event.target;
    if (!isAmountInput(target)) return;

    const paste = (event.clipboardData || window.clipboardData).getData('text');
    // 去掉所有空白字符（含空格、制表符、换行、全角空格等）
    const modified = paste.replace(/\s+/g, '');

    event.preventDefault(); // 阻止默认粘贴
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;

    target.value = target.value.slice(0, start) + modified + target.value.slice(end);

    // 复位光标
    const pos = start + modified.length;
    if (typeof target.setSelectionRange === 'function') {
      target.setSelectionRange(pos, pos);
    }

    // 触发框架联动（Vue/React/原生 onchange 计算等）
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));
  });

  console.log('金额粘贴去空格脚本已启用（多行通用）');
})();
