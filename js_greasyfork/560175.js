// ==UserScript==
// @name         教学评价自动填写工具
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  辅助填写教学评价问卷，请在遵守平台规则前提下使用
// @match        https://yjsxju.mycospxk.com/*
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/560175/%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/560175/%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


(function () {
  'use strict';

  /******************** 配置区（你可改） ********************/
  const AUTO_SUBMIT = true;                 // true=自动点提交；false=只填不提交
  const SUBMIT_AFTER_EACH_TEACHER = true;   // 每个老师填完就提交（推荐）
  const TEACHER_SWITCH_DELAY_MS = 2600;     // 切换老师后等待渲染（你页面建议>=2500）
  const AFTER_FILL_DELAY_MS = 700;          // 填完后等待
  const COMMENT_TEXT = '暂无补充意见。';     // 别用“无。”，很多系统会判无效
  const DEBUG = true;

  // 提交按钮选择器（你提供的）
  const SUBMIT_BTN_SELECTOR = 'div.index__submitContext--xZR4w button.ant-btn.index__submit--jiKIA';

  // Antd 确认弹窗常见文字
  const CONFIRM_TEXT = ['确定', '确认', 'OK', 'Yes', '提交', '保存'];
  /*********************************************************/

  function log(...args) { if (DEBUG) console.log('[AutoEval]', ...args); }
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function normalizeText(s) {
    return (s || '').replace(/\s+/g, '').trim(); // "提 交" -> "提交"
  }

  async function waitForAny(selector, timeout = 15000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const els = document.querySelectorAll(selector);
      if (els && els.length) return Array.from(els);
      await sleep(300);
    }
    return [];
  }

  async function waitForOne(selector, timeout = 15000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = document.querySelector(selector);
      if (el) return el;
      await sleep(300);
    }
    return null;
  }

  /******************** 1) 单选：选 value=5 ********************/
  function clickRadioInput(input) {
    if (!input) return false;
    const label = input.closest('label.ant-radio-wrapper') || input.closest('label');
    if (label) { label.click(); return true; }
    input.click();
    return true;
  }

  function fillRadiosValue5() {
    const inputs = Array.from(document.querySelectorAll('input.ant-radio-input[value="5"]'));
    let clicked = 0;

    for (const input of inputs) {
      const name = input.getAttribute('name');
      if (name) {
        const checked = document.querySelector(`input.ant-radio-input[name="${CSS.escape(name)}"]:checked`);
        if (checked) continue;
      } else {
        if (input.checked) continue;
      }
      if (clickRadioInput(input)) clicked++;
    }
    return { found: inputs.length, clicked };
  }

  /******************** 2) 文本：textarea（React受控） ********************/
  function setNativeValue(el, value) {
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, 'value');
    desc.set.call(el, value);
  }

  function fillTextareasReact() {
    const areas = Array.from(document.querySelectorAll('textarea.ant-input.index__UEditoTextarea--yga85'));
    let filled = 0;

    for (const ta of areas) {
      const cur = (ta.value || '').trim();
      if (cur) continue;

      ta.focus();
      setNativeValue(ta, COMMENT_TEXT);
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
      ta.blur();

      filled++;
    }
    return { found: areas.length, filled };
  }

  function anyTextareaEmptyReact() {
    return Array.from(document.querySelectorAll('textarea.ant-input.index__UEditoTextarea--yga85'))
      .some(ta => !(ta.value || '').trim());
  }

  /******************** 3) 富文本：wangEditor / contenteditable ********************/
  function fillWangEditor() {
    // 常见：.w-e-text 或任意 contenteditable=true 的编辑区
    // 注意：页面上可能还有其他 contenteditable（比如搜索框），所以加些过滤
    const candidates = Array.from(document.querySelectorAll('.w-e-text, [contenteditable="true"]'))
      .filter(el => {
        const cls = el.className || '';
        const t = (el.innerText || '').trim();
        const visible = el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0;
        // 过滤明显不是编辑区的（非常小/不可见/导航等）
        return visible && (cls.includes('w-e-text') || el.getAttribute('contenteditable') === 'true') && el.tagName !== 'BODY';
      });

    let filled = 0;
    for (const ed of candidates) {
      const cur = (ed.innerText || '').trim();
      if (cur) continue;

      ed.focus();

      // 用 execCommand + input 事件，兼容性更好
      try {
        document.execCommand('selectAll', false, null);
        document.execCommand('insertText', false, COMMENT_TEXT);
      } catch (e) {
        ed.innerHTML = '';
        ed.innerText = COMMENT_TEXT;
      }

      ed.dispatchEvent(new Event('input', { bubbles: true }));
      ed.dispatchEvent(new Event('change', { bubbles: true }));
      ed.blur();

      filled++;
    }
    return { found: candidates.length, filled };
  }

  /******************** 4) 提交：等待按钮出现 + 滚动 + 跳过已提交 ********************/
  function findSubmitBtn() {
    // 精准
    const btn = document.querySelector(SUBMIT_BTN_SELECTOR);
    if (btn) return btn;

    // 兜底：容器里 primary 按钮
    const btn2 = document.querySelector('div.index__submitContext--xZR4w button.ant-btn.ant-btn-primary');
    if (btn2) return btn2;

    // 再兜底：按文字（去空格）
    const all = Array.from(document.querySelectorAll('button.ant-btn'));
    return all.find(b => normalizeText(b.innerText) === '提交') || null;
  }

  async function waitForSubmitBtn(timeout = 15000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const btn = findSubmitBtn();
      if (btn) return btn;
      await sleep(300);
    }
    return null;
  }

  function isAlreadySubmitted(btn) {
    const t = normalizeText(btn?.innerText);
    return t.includes('已提交') || btn?.disabled || btn?.getAttribute('aria-disabled') === 'true';
  }

  async function clickConfirmIfAny() {
    await sleep(450);

    const modal = document.querySelector('.ant-modal-root, .ant-modal-wrap, .ant-modal');
    if (modal) {
      const ok = Array.from(modal.querySelectorAll('button'))
        .find(b => CONFIRM_TEXT.some(k => (b.innerText || '').includes(k)));
      if (ok) {
        log('confirm modal:', (ok.innerText || '').trim());
        ok.click();
        await sleep(800);
        return true;
      }
    }

    // 兜底：全页面找确认按钮（避免漏点）
    const ok2 = Array.from(document.querySelectorAll('button'))
      .find(b => CONFIRM_TEXT.some(k => (b.innerText || '').includes(k)));
    if (ok2 && /确定|确认|OK|Yes/.test((ok2.innerText || '').trim())) {
      log('confirm page:', (ok2.innerText || '').trim());
      ok2.click();
      await sleep(800);
      return true;
    }

    return false;
  }

  async function submitCurrentTeacher() {
    // 很多页面提交按钮在底部或滚动后才渲染/可点
    window.scrollTo(0, document.body.scrollHeight);
    await sleep(600);

    const btn = await waitForSubmitBtn(15000);
    if (!btn) {
      log('❌ submit button not found (after wait)');
      return false;
    }

    if (isAlreadySubmitted(btn)) {
      log('⏭️ already submitted, skip. btnText=', normalizeText(btn.innerText));
      return true;
    }

    // 提交前：如果是 React textarea 仍为空，补填一次；富文本也补填一次
    if (anyTextareaEmptyReact()) fillTextareasReact();
    fillWangEditor();
    await sleep(350);

    log('✅ click submit. btnText=', normalizeText(btn.innerText));
    btn.scrollIntoView({ block: 'center' });
    btn.click();

    await clickConfirmIfAny();
    await sleep(1000);

    return true;
  }

  /******************** 5) Tab 循环 ********************/
  function getTeacherTabs() {
    return Array.from(document.querySelectorAll('div[role="tab"].ant-tabs-tab'));
  }

  function getTabName(tab) {
    return (tab.innerText || '').trim().replace(/\s+/g, ' ');
  }

  function isTabActive(tab) {
    return tab.classList.contains('ant-tabs-tab-active') || tab.getAttribute('aria-selected') === 'true';
  }

  async function fillCurrentTeacherOnce() {
    const r = fillRadiosValue5();
    const t1 = fillTextareasReact();
    const t2 = fillWangEditor();

    log('radios:', r, '| textarea:', t1, '| wangeditor/contenteditable:', t2);

    await sleep(AFTER_FILL_DELAY_MS);

    // 二次检查：如果 textarea 仍空，重填
    if (anyTextareaEmptyReact()) {
      log('textarea still empty, retry...');
      fillTextareasReact();
      await sleep(400);
    }

    return { radios: r, textarea: t1, richtext: t2 };
  }

  async function runAllTeachers() {
    // 等 tab 出现
    const tabs0 = await waitForAny('div[role="tab"].ant-tabs-tab', 20000);
    if (!tabs0.length) {
      log('❌ 未找到老师tab：div[role="tab"].ant-tabs-tab');
      return;
    }

    log('teachers:', tabs0.map(getTabName));

    for (let i = 0; i < tabs0.length; i++) {
      // 每轮重新抓一次 tab，避免 React 重渲染后旧节点失效
      const tabs = getTeacherTabs();
      const tab = tabs[i];
      if (!tab) continue;

      const name = getTabName(tab);

      if (!isTabActive(tab)) {
        tab.scrollIntoView({ block: 'center' });
        tab.click();
        log(`switched to teacher [${i + 1}/${tabs0.length}]:`, name);
        await sleep(TEACHER_SWITCH_DELAY_MS);
      } else {
        log(`current teacher [${i + 1}/${tabs0.length}] active:`, name);
        await sleep(800);
      }

      // 等题目渲染：至少等一个 radio 或一个文本框或提交按钮
      await sleep(800);
      await Promise.race([
        waitForOne('input.ant-radio-input', 6000),
        waitForOne('textarea.ant-input.index__UEditoTextarea--yga85', 6000),
        waitForOne(SUBMIT_BTN_SELECTOR, 6000),
      ]);

      await fillCurrentTeacherOnce();

      if (AUTO_SUBMIT && SUBMIT_AFTER_EACH_TEACHER) {
        await submitCurrentTeacher();
      }
    }

    // 如果你想“全部老师填完再统一点一次提交”
    if (AUTO_SUBMIT && !SUBMIT_AFTER_EACH_TEACHER) {
      await submitCurrentTeacher();
    }

    log('✅ 全部处理完成。AUTO_SUBMIT=', AUTO_SUBMIT);
  }

  /******************** 入口（SPA 路由变化也会重新跑） ********************/
  async function main() {
    log('script injected, url=', location.href);
    await sleep(1800);
    await runAllTeachers();
  }

  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      log('route changed:', lastUrl);
      setTimeout(main, 1200);
    }
  }, 800);

  setTimeout(main, 1500);
})();
