// ==UserScript==
// @name         好医生考试脚本 (记忆对错 & 循环重考直至全对) v1.6
// @namespace    https://tampermonkey.net/
// @version      1.6
// @description  仅适配好医生CME考试 看视频脚本
// @match        https://www.cmechina.net/cme/exam.jsp?course_id*
// @match        https://www.cmechina.net/cme/examQuizFail.jsp?eId*
// @match        https://www.cmechina.net/cme/examQuizPass.jsp?rightRate*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      learn.tejiade.cn
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555474/%E5%A5%BD%E5%8C%BB%E7%94%9F%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC%20%28%E8%AE%B0%E5%BF%86%E5%AF%B9%E9%94%99%20%20%E5%BE%AA%E7%8E%AF%E9%87%8D%E8%80%83%E7%9B%B4%E8%87%B3%E5%85%A8%E5%AF%B9%29%20v16.user.js
// @updateURL https://update.greasyfork.org/scripts/555474/%E5%A5%BD%E5%8C%BB%E7%94%9F%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC%20%28%E8%AE%B0%E5%BF%86%E5%AF%B9%E9%94%99%20%20%E5%BE%AA%E7%8E%AF%E9%87%8D%E8%80%83%E7%9B%B4%E8%87%B3%E5%85%A8%E5%AF%B9%29%20v16.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------------- 选择器 ----------------
  const SEL = {
    // 考试页
    examForm: 'form[name="form1"], form[action*="examDo.jsp"]',
    examListLis: 'ul.exam_list > li',
    qTitleInExam: 'h3.name',
    qOptionRadio: 'input[type="radio"][name^="ques_"]',
    optionP: 'p',
    submitLink: '#tjkj',
    submitBtn1: '.btn1[onClick*="doSubmit"]',

    // 失败结果页
    resultFlag: '.show_page_tit h3',
    resultListLis: 'ul.answer_box > li.answer_list',
    resultItemHead: 'h3',
    reExamBtnId: '#cxdt',

    // 通过页
    passClick: 'body > div.show_exam > div > div.show_exam_btns > a'
  };

  // ---------------- 工具 ----------------
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const text = (el) => (el ? el.textContent.trim() : '');
  const getUrlParam = (name) => new URL(location.href).searchParams.get(name) || '';

  const onExamPage  = () => /\/cme\/exam\.jsp\?course_id/i.test(location.href);
  const onFailPage  = () => /\/cme\/examQuizFail\.jsp\?eId/i.test(location.href) || isLegacyResultDom();
  const onPassPage  = () => /\/cme\/examQuizPass\.jsp\?rightRate/i.test(location.href);

  function isLegacyResultDom() {
    const flag = qs(SEL.resultFlag);
    return flag && text(flag) === '考试结果';
  }

  // Key（按课程+试卷隔离）
  const courseId = getUrlParam('course_id') || guessHidden('course_id');
  const paperId  = getUrlParam('paper_id')  || guessHidden('paper_id');
  const MEM_KEY = `cme_exam_memory_${courseId || 'X'}_${paperId || 'X'}`;

  function guessHidden(name) {
    const el = qs(`input[name="${name}"]`);
    return el ? el.value : '';
  }

  function loadMem() {
    try { return JSON.parse(localStorage.getItem(MEM_KEY) || '{}'); } catch { return {}; }
  }
  function saveMem(obj) {
    localStorage.setItem(MEM_KEY, JSON.stringify(obj));
  }
  function clearMem() {
    localStorage.removeItem(MEM_KEY);
  }

  function normalizeStem(raw) {
    let s = (raw || '').replace(/\s+/g, ' ').trim();
    const idx = s.indexOf('】');
    if (idx !== -1 && idx < 10) s = s.slice(idx + 1).trim();
    s = s.replace(/^\d+[、.．]/, '').trim();
    return s;
  }

  function collectOptionsFromLi(li) {
    const map = {};
    const ps = qsa(SEL.optionP, li);
    ps.forEach(p => {
      const radio = p.querySelector('input[type="radio"][name^="ques_"]');
      if (!radio) return;
      const letter = (radio.value || '').toUpperCase();
      let raw = text(p);
      raw = raw.replace(/^[A-E]\s*[:：.．、]/, '').trim();
      map[letter] = raw || '';
    });
    return map;
  }

  function clickRadio(input) {
    if (!input) return;
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input.click();
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function submitPrefAnchor() {
    const a = qs(SEL.submitLink);
    if (a) { a.click(); return true; }
    return false;
  }

  // ---------------- 作答（考试页） ----------------
  async function answerOnExamPage({ delay = 120, autoSubmit = true }) {
    const form = qs(SEL.examForm);
    if (!form) return;

    const mem = loadMem();
    mem.questions = mem.questions || {};

    const lis = qsa(SEL.examListLis);
    for (const li of lis) {
      const titleEl = qs(SEL.qTitleInExam, li);
      const stemKey = normalizeStem(text(titleEl));
      const options = collectOptionsFromLi(li);
      const radios = qsa(SEL.qOptionRadio, li);

      const radiosByName = {};
      radios.forEach(r => {
        radiosByName[r.name] = radiosByName[r.name] || [];
        radiosByName[r.name].push(r);
      });
      const group = Object.values(radiosByName)[0] || [];
      if (!group.length) continue;

      const qMem = mem.questions[stemKey] || { options: {}, lastChosen: null, correctChoice: null, wrongChoices: [], stats: { attempts: 0, corrects: 0 } };
      qMem.options = { ...qMem.options, ...options };

      let toPick = null;
      if (qMem.correctChoice) {
        toPick = group.find(r => (r.value || '').toUpperCase() === qMem.correctChoice);
      }
      if (!toPick && qMem.wrongChoices && qMem.wrongChoices.length) {
        const candidates = group.filter(r => !qMem.wrongChoices.includes((r.value || '').toUpperCase()));
        toPick = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null;
      }
      if (!toPick) {
        toPick = group[Math.floor(Math.random() * group.length)];
      }

      if (toPick) {
        clickRadio(toPick);
        qMem.lastChosen = (toPick.value || '').toUpperCase();
      }

      mem.questions[stemKey] = qMem;
      saveMem(mem);
      await sleep(delay);
    }

    saveMem(mem);

    if (autoSubmit) {
      const ok = submitPrefAnchor();
      if (!ok) {
        const btn1 = qs(SEL.submitBtn1);
        if (btn1) btn1.click();
        else form.submit();
      }
    }
  }

  // ---------------- 失败结果页解析 ----------------
  async function parseFailAndDecide() {
    await waitFor(() => qsa('ul.answer_box > li.answer_list').length > 0, 3000);

    const mem = loadMem();
    mem.questions = mem.questions || {};
    let anyWrong = false;

    const items = qsa('ul.answer_box > li.answer_list');
    if (!items.length) return;

    items.forEach(li => {
      const h = li.querySelector('h3');
      const cls = h ? h.classList : null;
      const isRight = cls && cls.contains('dui');
      const isWrong = cls && cls.contains('cuo');

      const headTxt = text(h);
      const stemLine = headTxt.split('\n')[0] || headTxt;
      const stemKey = normalizeStem(stemLine);

      const mAns = headTxt.match(/您的答案：\s*([A-E])/i);
      const chosen = mAns ? mAns[1].toUpperCase() : null;

      const qMem = mem.questions[stemKey] || { options: {}, lastChosen: null, correctChoice: null, wrongChoices: [], stats: { attempts: 0, corrects: 0 } };
      qMem.stats.attempts = (qMem.stats.attempts || 0) + 1;
      if (chosen) qMem.lastChosen = chosen;

      if (isRight && chosen) {
        qMem.correctChoice = chosen;
        qMem.stats.corrects = (qMem.stats.corrects || 0) + 1;
      } else if (isWrong && chosen) {
        anyWrong = true;
        qMem.wrongChoices = Array.from(new Set([...(qMem.wrongChoices || []), chosen]));
      }

      mem.questions[stemKey] = qMem;
    });

    saveMem(mem);

    if (anyWrong) {
      const re = qs(SEL.reExamBtnId) || findReexamFallback();
      if (re) {
        await sleep(600);
        re.click();
      } else {
        console.warn('[CME-AutoLoop] 未找到“重新答题”按钮，请手动点击。');
      }
    } else {
      console.log('[CME-AutoLoop] 判定全部正确。');
    }
  }

  function findReexamFallback() {
    const aList = qsa('a, button');
    return aList.find(a => /重新答题/.test(text(a)));
  }

  async function waitFor(condFn, timeout = 5000, interval = 100) {
    const start = Date.now();
    if (condFn()) return true;
    return new Promise(resolve => {
      const t = setInterval(() => {
        if (condFn()) { clearInterval(t); resolve(true); }
        else if (Date.now() - start > timeout) { clearInterval(t); resolve(false); }
      }, interval);
    });
  }

  // ---------------- 通过页处理 ----------------
  async function handlePassPage() {
    await sleep(400);
    const a = qs(SEL.passClick);
    if (a) {
      a.click();
      console.log('[CME-AutoLoop] ✅ 已在通过页自动点击按钮。');
    } else {
      console.warn('[CME-AutoLoop] 未找到通过页按钮，请检查选择器。');
    }
  }

  // ---------------- UI 样式 ----------------
  GM_addStyle(`
    .cme-mem-ui {
      position: fixed; top: 80px; right: 20px; z-index: 99999;
      background: #111827; color: #fff; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial;
      border-radius: 12px; padding: 12px; box-shadow: 0 10px 25px rgba(0,0,0,.25); width: 300px;
    }
    .cme-mem-ui h3 { margin: 0 0 8px; font-size: 14px; font-weight: 700; }
    .cme-mem-ui .row { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
    .cme-mem-ui button, .cme-mem-ui input[type="number"] {
      all: unset; background:#2563eb; padding:8px 10px; border-radius:10px; cursor:pointer; font-size:12px; text-align:center;
    }
    .cme-mem-ui button:hover { filter: brightness(1.05); }
    .cme-mem-ui .secondary { background:#374151; }
    .cme-mem-ui .ok { background:#16a34a; }
    .cme-mem-ui .danger { background:#dc2626; }
    .cme-mem-ui .field { display:flex; align-items:center; gap:6px; margin-top:8px; }
    .cme-mem-ui input[type="number"]{ background:#111827; border:1px solid #374151; width:100px; text-align:right; }
    .cme-mem-ui .muted { color:#d1d5db; font-size:12px; margin-top:6px; line-height:1.3; }

    .cme-manual {
      margin-top:10px; background:#0b1220; border:1px solid #2b3446; border-radius:10px; padding:8px; display:none; max-height:220px; overflow:auto;
    }
    .cme-manual h4 { margin:0 0 6px; font-size:13px; font-weight:700; color:#e5e7eb; }
    .cme-manual .item { background:#111827; border:1px solid #2b3446; border-radius:8px; padding:8px; margin-top:6px; }
    .cme-manual .fn { font-weight:700; }
    .cme-manual .desc { color:#d1d5db; margin-top:4px; line-height:1.35; white-space:pre-wrap; }
    .cme-badge { background:#374151; border-radius:999px; padding:2px 8px; font-size:11px; }
  `);

  // 手册获取（GM_xmlhttpRequest 以绕 CORS）
  function fetchManualJSON() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://learn.tejiade.cn/logs/haoyishengkaoshi.json',
        timeout: 8000,
        onload: (resp) => {
          try {
            const data = JSON.parse(resp.responseText);
            resolve(data);
          } catch (e) {
            reject(new Error('手册 JSON 解析失败'));
          }
        },
        onerror: () => reject(new Error('手册请求失败')),
        ontimeout: () => reject(new Error('手册请求超时'))
      });
    });
  }

  function renderManual(container, arr) {
    if (!Array.isArray(arr)) {
      container.innerHTML = `<div class="item"><div class="desc">手册格式错误。</div></div>`;
      return;
    }
    container.innerHTML = `<h4>使用手册</h4>`;
    arr.forEach((it, idx) => {
      const fn = (it.功能 ?? it.func ?? '').toString();
      const desc = (it.描述 ?? it.desc ?? '').toString();
      const wrap = document.createElement('div');
      wrap.className = 'item';
      wrap.innerHTML = `
        <div class="fn">${idx + 1}. 功能：${escapeHtml(fn)}</div>
        <div class="desc">${escapeHtml(desc)}</div>
      `;
      container.appendChild(wrap);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // ---------------- UI ----------------
  function buildUI() {
    const ui = document.createElement('div');
    ui.className = 'cme-mem-ui';
    const mem = loadMem();
    const count = mem.questions ? Object.keys(mem.questions).length : 0;

    ui.innerHTML = `
      <h3>考试助手 · 记忆&循环</h3>
      <div class="field">
        <span>Delay(ms)</span>
        <input type="number" id="cme_delay" value="150" min="0" step="10">
      </div>
      <div class="row">
        <button id="cme_loop" class="ok">开始循环直至全对</button>
        <button id="cme_manual_btn" class="secondary">使用手册</button>
      </div>
      <div class="row">
        <button id="cme_reset" class="danger">清空记忆</button>
        <button id="cme_count" class="secondary">记忆数：${count}</button>
      </div>
      <div class="cme-manual" id="cme_manual_panel">
        <h4>使用手册</h4>
        <div class="item"><div class="desc">点击“使用手册”加载在线内容…</div></div>
      </div>
      <div class="muted">适配 exam.jsp / examQuizFail.jsp / examQuizPass.jsp</div>
    `;
    document.body.appendChild(ui);

    const delayEl = ui.querySelector('#cme_delay');
    const manualBtn = ui.querySelector('#cme_manual_btn');
    const manualPanel = ui.querySelector('#cme_manual_panel');

    ui.querySelector('#cme_reset').addEventListener('click', () => {
      if (confirm('清空记忆？此课程与试卷的所有记录将被删除。')) {
        clearMem();
        alert('已清空。刷新页面生效。');
      }
    });

    ui.querySelector('#cme_loop').addEventListener('click', async () => {
      await answerOnExamPage({ delay: +delayEl.value || 0, autoSubmit: true });
      // 不弹窗，避免打断；继续由失败/通过页逻辑接管
      console.log('[CME-AutoLoop] 已提交本轮；后续将自动处理。');
    });

    let manualLoaded = false;
    manualBtn.addEventListener('click', async () => {
      // 展开/收起
      const willShow = manualPanel.style.display !== 'block';
      manualPanel.style.display = willShow ? 'block' : 'none';
      if (willShow && !manualLoaded) {
        // 首次展开时加载
        manualPanel.innerHTML = `<h4>使用手册</h4><div class="item"><div class="desc">加载中…</div></div>`;
        try {
          const data = await fetchManualJSON();
          manualPanel.innerHTML = '';
          renderManual(manualPanel, data);
          manualLoaded = true;
        } catch (e) {
          manualPanel.innerHTML = `<h4>使用手册</h4><div class="item"><div class="desc">读取失败：${escapeHtml(e.message || String(e))}</div></div>`;
        }
      }
    });
  }

  // ---------------- 入口 ----------------
  async function main() {
    if (onExamPage()) {
      buildUI();
    } else if (onFailPage()) {
      let parsed = false;
      const tryParse = async () => {
        if (parsed) return;
        const hasList = qsa('ul.answer_box > li.answer_list').length > 0;
        if (hasList) {
          parsed = true;
          await parseFailAndDecide();
        }
      };
      await tryParse();
      const obs = new MutationObserver(tryParse);
      obs.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => obs.disconnect(), 6000);
    } else if (onPassPage()) {
      await handlePassPage();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
