// ==UserScript==
// @name         H3C知了社区自动答题签到
// @namespace    H3C知了社区自动答题签到
// @version      0.0.6
// @license    GPL-3.0-only
// @description  H3C知了社区自动答题签到(签到测试中）
// @author       Hiro88
// @note    2025.01.12-V0.0.6 初始版本
// @match        https://zhiliao.h3c.com/*
// @icon         https://zhiliao.h3c.com/style/home/images/new/search.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561784/H3C%E7%9F%A5%E4%BA%86%E7%A4%BE%E5%8C%BA%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/561784/H3C%E7%9F%A5%E4%BA%86%E7%A4%BE%E5%8C%BA%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- 工具 ---------- */
  const $ = window.jQuery;

  /* ---------- 主逻辑 ---------- */
  async function autoFillAnswers(btn) {
    // 防重复点
    btn.disabled = true;
    btn.value = '正在自动答题…';

    try {
      const rid = $('.questinon_a1').attr('rid');
      if (!rid) return;
      const txt = await $.get(`https://zhiliao.h3c.com/questions/randQuestAnswer?randnum=${rid}`);
      const res = JSON.parse(txt);
      const answer = res.answer;
      if (!answer) { console.warn('接口未返回答案'); return; }
      const opts = answer.split('.');
      const $options = $('.question_a2 .question_lab');
      opts.forEach(n => {
        const idx = parseInt(n, 10) - 1;
        $options.eq(idx).find('label,input,div').first().click();
      });

      await $.Deferred(d => setTimeout(d.resolve, 800));
      $('.checkin .checkBtn').click();
      await $.Deferred(d => setTimeout(d.resolve, 800));
      $('.question_c input[type=button], .question_c .new_button_class').click();
      btn.value = '已完成答题';
    } catch (e) {
      console.error('自动答题失败:', e);
      btn.disabled = false;
      btn.value = '点击自动签到答题';
    }
  }

  /* ---------- 入口 ---------- */
  (async function init() {
    while (typeof window.jQuery === 'undefined' || !$('.questinon_a1').length) {
      await new Promise(r => setTimeout(r, 300));
    }

    const isAnswer = await $.post('/user/IsAnswer');
    if (String(isAnswer) === '1') {
      console.log('今日已答题，脚本退出');
      return;
    }
    const origBtn = document.querySelector('.question_c input[type=button]');
    if (!origBtn) return;

    origBtn.style.display = 'none';
    const newBtn = document.createElement('input');
    newBtn.type = 'button';
    newBtn.className = 'new_button_class';
    newBtn.value = '点击自动签到答题';
    newBtn.style.cssText = `
      padding: 6px 15px; font-size: 15px; background-color: #6092e8;
      border: 1px solid #6092e8; border-radius: 3px;
      color: #fff; margin: 10px; cursor: pointer;
    `;
    newBtn.addEventListener('click', () => autoFillAnswers(newBtn));
    origBtn.parentElement.appendChild(newBtn);
  })();
})();