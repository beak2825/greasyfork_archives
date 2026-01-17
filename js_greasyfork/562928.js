// ==UserScript==
// @name         Auto Fill Eval (radios weighted + optional textareas)
// @namespace    local
// @version      0.3
// @description  SPA eval: one-click weighted random radios and preset textarea filling
// @match        https://xkcts.ucas.ac.cn:8443/evaluate/*
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/562928/Auto%20Fill%20Eval%20%28radios%20weighted%20%2B%20optional%20textareas%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562928/Auto%20Fill%20Eval%20%28radios%20weighted%20%2B%20optional%20textareas%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ============ 配置区 ============

  // 选择题：3/4/5 加权概率（3少一点）
  const RADIO_P = { '3': 0.15, '4': 0.35, '5': 0.50 };

  // 主观题：是否启用自动填写
  const ENABLE_TEXTAREA_FILL = true;

  // 主观题：按 name 精确映射（最稳）
  // 你截图里的 1619/后续题目的 name 也类似 item_xxxx，把实际值填进来即可
const TEXTAREA_PRESETS_BY_NAME = {
    'item_1619': '相关知识的讲解和推导非常有助于学习和建立认知。',
    'item_1620': '暂时没有特别需要改进和提高的部分。',
    'item_1621': '约 4 小时左右。',
    'item_1622': '我对该学科较为感兴趣，热衷于在该领域内进行进一步学习',
    'item_1623': '保证了全部出勤，课堂回答问题较少'
};

  // 主观题：没在映射表里时的兜底文案（需满足 minlength）
  const TEXTAREA_FALLBACK = '整体体验良好，内容组织清晰，讲解有助于理解与应用。';

  // ============ 目标页面判定（按需改更严格） ============
  function isTargetPage() {
    return !!document.querySelector('input[type="radio"][name^="item_"], textarea[name^="item_"]');
  }

  // ============ 工具函数 ============
  function weightedPick(pMap) {
    const entries = Object.entries(pMap);
    const sum = entries.reduce((acc, [, p]) => acc + p, 0);
    let r = Math.random() * sum;
    for (const [val, p] of entries) {
      r -= p;
      if (r <= 0) return String(val);
    }
    return String(entries[entries.length - 1][0]);
  }

  function selectRadio(input) {
    if (!input || input.disabled) return false;
    input.click();
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  function setTextareaValue(ta, text) {
    if (!ta || ta.disabled) return false;

    // respect maxlength if present
    const max = ta.getAttribute('maxlength');
    if (max) text = text.slice(0, Number(max));

    ta.focus();
    ta.value = text;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.dispatchEvent(new Event('change', { bubbles: true }));
    ta.blur();
    return true;
  }

  // ============ 执行：选择题 ============
  function fillRadiosRandomOnlyEmpty() {
    const radios = Array.from(document.querySelectorAll('input[type="radio"][name^="item_"]'));
    const groupNames = Array.from(new Set(radios.map(r => r.name)));

    let changed = 0;
    let skippedAlreadyAnswered = 0;

    for (const name of groupNames) {
      const group = Array.from(document.querySelectorAll(`input[type="radio"][name="${CSS.escape(name)}"]`));
      if (!group.length) continue;

      // 已选就跳过（避免重复点）
      if (group.some(r => r.checked)) {
        skippedAlreadyAnswered++;
        continue;
      }

      const desired = weightedPick(RADIO_P);
      const target = group.find(r => String(r.value) === desired);

      // 若该题不是 1~5 或没有 3/4/5，target 可能不存在
      if (target && selectRadio(target)) changed++;
    }

    console.log('[AutoFill] radios changed:', changed, 'skipped:', skippedAlreadyAnswered);
    return { changed, skippedAlreadyAnswered };
  }

  // ============ 执行：主观题 ============
  function fillTextareasOnlyEmpty() {
    const textareas = Array.from(document.querySelectorAll('textarea[name^="item_"]'));
    let changed = 0;
    let skippedAlreadyFilled = 0;

    for (const ta of textareas) {
      const current = (ta.value || '').trim();
      if (current.length > 0) {
        skippedAlreadyFilled++;
        continue;
      }

      const preset = TEXTAREA_PRESETS_BY_NAME[ta.name] || TEXTAREA_FALLBACK;

      // respect minlength if present (ensure pass validation)
      const min = ta.getAttribute('minlength');
      let text = preset;
      if (min && text.trim().length < Number(min)) {
        text = (text + ' ' + TEXTAREA_FALLBACK).trim();
      }

      if (setTextareaValue(ta, text)) changed++;
    }

    console.log('[AutoFill] textareas changed:', changed, 'skipped:', skippedAlreadyFilled);
    return { changed, skippedAlreadyFilled };
  }

  // ============ UI ============
  function ensureButton() {
    if (document.getElementById('__autofill_btn__')) return;

    const btn = document.createElement('button');
    btn.id = '__autofill_btn__';
    btn.textContent = '一键填写';
    btn.style.cssText = `
      position: fixed; right: 20px; bottom: 20px; z-index: 999999;
      padding: 10px 12px; font-size: 14px; cursor: pointer;
      border: 1px solid #999; border-radius: 8px; background: #fff;
      box-shadow: 0 2px 10px rgba(0,0,0,0.12);
    `;

    btn.addEventListener('click', () => {
      const r = fillRadiosRandomOnlyEmpty();

      let msg = `选择题：变更 ${r.changed} 题（已作答跳过 ${r.skippedAlreadyAnswered} 题）`;

      if (ENABLE_TEXTAREA_FILL) {
        const t = fillTextareasOnlyEmpty();
        msg += `\n主观题：填写 ${t.changed} 题（已填写跳过 ${t.skippedAlreadyFilled} 题）`;
      }

      alert(msg);
    });

    document.body.appendChild(btn);
  }

  // ============ SPA 观察 ============
  const observer = new MutationObserver(() => {
    if (isTargetPage()) ensureButton();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (isTargetPage()) ensureButton();
})();
