// ==UserScript==
// @name         NWAFU 研究生评教自动填写（含主观题）
// @namespace    https://newehall.nwafu.edu.cn/
// @version      1.2.0
// @description  仅在研究生评教页面：评分题全10分，师德题选A，文本题自动填写
// @match        https://newehall.nwafu.edu.cn/gsapp/sys/jxpgapp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559152/NWAFU%20%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%EF%BC%88%E5%90%AB%E4%B8%BB%E8%A7%82%E9%A2%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559152/NWAFU%20%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%EF%BC%88%E5%90%AB%E4%B8%BB%E8%A7%82%E9%A2%98%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // —— 只在评教页面运行 ——
  if (!location.hash.includes('/xspj')) return;

  const timer = setInterval(() => {
    const radios = document.querySelectorAll('input[type="radio"]');
    const textarea = document.querySelector('textarea');

    if (radios.length === 0) return;

    clearInterval(timer);
    console.log('📘 自动评教脚本启动（完整版）');

    // ========== 1️⃣ 数值评分题：全部选 10 分 ==========
    const groups = {};
    radios.forEach(radio => {
      if (!groups[radio.name]) groups[radio.name] = [];
      groups[radio.name].push(radio);
    });

    Object.values(groups).forEach(group => {
      // 优先找 value=10
      const ten = group.find(r => r.value === '10');
      if (ten) ten.click();
    });

    console.log('✅ 数值评分题已全部选 10 分');

    // ========== 2️⃣ 第 11 题：师德师风 → 选 A（非常好） ==========
    const moralOption = Array.from(radios).find(r =>
      r.nextSibling && r.nextSibling.textContent.includes('非常好')
    );

    if (moralOption) {
      moralOption.click();
      console.log('✅ 师德师风题已选择：非常好');
    }

    // ========== 3️⃣ 第 12 题：文本评价 ==========
    if (textarea && textarea.value.trim() === '') {
      textarea.value = '课程内容安排合理，讲授清晰，对专业学习具有积极帮助。';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('✅ 已填写课程评价文本');
    }

    // ========== 4️⃣ 延迟提交 ==========
    setTimeout(() => {
      const submitBtn = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.innerText.includes('提交'));

      if (submitBtn) {
        submitBtn.click();
        console.log('🚀 评教已自动提交');
      } else {
        console.warn('⚠️ 未找到提交按钮');
      }
    }, 1200);

  }, 300);

})();
