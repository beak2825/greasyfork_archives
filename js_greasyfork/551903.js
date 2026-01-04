// ==UserScript==
// @name         出院病历质控表填写
// @namespace    https://example.com/tm
// @version      1.0.0
// @description  固定坐标点击；在同源 iframe 中按 JSON：name=键 → label/邻近文本=值 批量勾选；支持撤销；仅对指定键值高亮
// @match        *MedDoc/edit*
// @run-at       document-idle
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551903/%E5%87%BA%E9%99%A2%E7%97%85%E5%8E%86%E8%B4%A8%E6%8E%A7%E8%A1%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/551903/%E5%87%BA%E9%99%A2%E7%97%85%E5%8E%86%E8%B4%A8%E6%8E%A7%E8%A1%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (window.top !== window.self) return;

  const PANEL_ID = 'tm-json-checkbox-panel';
  if (document.getElementById(PANEL_ID)) return;

  /** ===== 固定坐标（不可修改） ===== */
  const CLIENT_X = 100;
  const CLIENT_Y = 100;

  /** ===== UEditor/iframe 查找策略 ===== */
  const IFRAME_CANDIDATES = [
    'iframe[id^="ueditor_"]',
    '#edui84_iframeholder iframe',
    'iframe'
  ];

  /** ===== 默认 JSON 数据（按你提供的最新清单） ===== */
  const DEFAULT_DATA = {
    "入院记录是否": "是",
    "手术记录是否无需书写": "无需书写",
    "出院记录是否无需书写": "是",
    "病历首页是否": "是",
    "抢救记录是否没有抢救": "没有抢救",
    "其他记录是否": "是",
    "CT核磁检查是否": "是",
    "是否没有使用": "没有使用",
    "是否没有化疗": "没有化疗",
    "是否没有放疗": "没有放疗",
    "主要手术编码填写是否": "是",
    "是否没有植入物": "没有植入物",
    "是否没有输血": "没有输血",
    "病理检查是否": "没有检查",
    "细菌培养是否没有检查": "没有检查",
    "医师查房记录是否": "是",
    "一致不一致 无中医治疗": "一致",
    "是否无需评估": "是",
    "是否无需预防": "是",
    "是否无法评估": "非肿瘤患者",
    "是无不充分或无法判断": "是",
    "四诊资料是否可得出主病、主证": "是",
    "医生中医操作记录是否有签名": "是",
    "出院病历是否完整归档": "是",
    "是否存在不合理复制病历": "否",
    "知情同意书是否无需签署": "是",
    "主要诊断填写是否正确": "是",
    "主要手术(操作)填写是否正确": "是",
    "出院病历是否2日归档": "是",
    "主要诊断编码填写是否": "是",
    "甲乙丙": "甲"
  };

  /** ===== 仅对这些键进行红框高亮 ===== */
  const HIGHLIGHT_KEYS = new Set([
    "主要手术编码填写是否",
    "抢救记录是否没有抢救",
    "CT核磁检查是否",
    "细菌培养是否没有检查",
    "是否没有使用"
  ]);

  /** ===== 事件与点击 ===== */
  function fireMouseSeq(target, clientX, clientY, win) {
    const opts = { bubbles: true, cancelable: true, view: win, clientX, clientY };
    ['pointerdown','mousedown','pointerup','mouseup','click'].forEach(type => {
      try { target.dispatchEvent(new MouseEvent(type, opts)); }
      catch {
        const evt = win.document.createEvent('MouseEvents');
        evt.initMouseEvent(type, true, true, win, 1, clientX, clientY, clientX, clientY, false,false,false,false, 0, null);
        target.dispatchEvent(evt);
      }
    });
  }
  function clickAtClient(clientX, clientY, win = window) {
    const doc = win.document;
    let el = doc.elementFromPoint(clientX, clientY);
    if (!el) { console.warn('⚠️ 未命中元素', clientX, clientY); return null; }
    if (el.tagName === 'IFRAME') {
      try {
        const rect = el.getBoundingClientRect();
        const innerX = clientX - rect.left;
        const innerY = clientY - rect.top;
        if (el.contentWindow && el.contentDocument) return clickAtClient(innerX, innerY, el.contentWindow);
      } catch {}
    }
    fireMouseSeq(el, clientX, clientY, win);
    return el;
  }

  /** ===== 文本工具 ===== */
  const cssEscape = (s) => (window.CSS && typeof window.CSS.escape === 'function')
    ? window.CSS.escape(s) : String(s).replace(/["\\]/g, '\\$&');
  const toHalfWidth = (s) => String(s || '')
    .replace(/[\uFF01-\uFF5E]/g, ch => String.fromCharCode(ch.charCodeAt(0)-0xFEE0))
    .replace(/\u3000/g, ' ');
  const normalize = (s) => toHalfWidth(s).replace(/[。．·•∙⋅]/g,'.').replace(/\s+/g,' ').trim();

  function getOptionText(doc, inp) {
    const wrap = inp.closest && inp.closest('label');
    if (wrap) return (wrap.innerText || wrap.textContent || '').trim();
    if (inp.id) {
      const byFor = doc.querySelector(`label[for="${cssEscape(inp.id)}"]`);
      if (byFor) return (byFor.innerText || byFor.textContent || '').trim();
    }
    // 紧邻文本节点
    const collectTextNodes = (n, maxChars=80) => {
      let txt = '';
      while (n && n.nodeType === Node.TEXT_NODE) {
        txt += n.nodeValue || '';
        if (txt.length >= maxChars) break;
        n = n.nextSibling;
      }
      return txt.trim();
    };
    const textAfter = collectTextNodes(inp.nextSibling);
    // 下一个元素兄弟
    const sib = inp.nextElementSibling;
    const accept = sib && /^(SPAN|I|EM|B|STRONG|FONT|P|DIV)$/.test(sib.tagName);
    const sibText = accept ? (sib.innerText || sib.textContent || '').trim() : '';
    // 父容器常见 label
    const nearby = inp.parentElement?.querySelector?.('.el-checkbox__label, .ant-checkbox + span, .checkbox-label, .label, .text');
    const nearbyText = nearby ? (nearby.innerText || nearby.textContent || '').trim() : '';
    return textAfter || sibText || nearbyText || '';
  }

  /** ===== 高亮工具 ===== */
  const HIGHLIGHT_ATTR = 'data-tm-hl';
  function getHighlightTarget(doc, inp) {
    const wrap = inp.closest && inp.closest('label');
    if (wrap) return wrap;
    const sib = inp.nextElementSibling;
    const accept = sib && /^(SPAN|I|EM|B|STRONG|FONT|P|DIV)$/.test(sib.tagName);
    if (accept) return sib;
    return inp;
  }
  function addHighlight(doc, inp) {
    const el = getHighlightTarget(doc, inp);
    if (!el || el.getAttribute(HIGHLIGHT_ATTR)) return el;
    const prev = el.style.outline || '';
    const prevOff = el.style.outlineOffset || '';
    el.setAttribute(HIGHLIGHT_ATTR, '1');
    el.setAttribute('data-tm-prev-outline', prev);
    el.setAttribute('data-tm-prev-outline-offset', prevOff);
    el.style.outline = '2px solid red';
    el.style.outlineOffset = '2px';
    return el;
  }
  function removeHighlight(el) {
    if (!el || !el.getAttribute?.(HIGHLIGHT_ATTR)) return;
    const prev = el.getAttribute('data-tm-prev-outline') || '';
    const prevOff = el.getAttribute('data-tm-prev-outline-offset') || '';
    el.style.outline = prev;
    el.style.outlineOffset = prevOff;
    el.removeAttribute('data-tm-prev-outline');
    el.removeAttribute('data-tm-prev-outline-offset');
    el.removeAttribute(HIGHLIGHT_ATTR);
  }

  /** ===== 撤销记录 ===== */
  let lastOps = null; // { doc, items: [ {input, wasChecked, wasDefaultChecked, wasAttrChecked, hlEl|null} ] }

  /** ===== 执行与撤销 ===== */
  async function runOnceWithData(mapData) {
    try {
      const el = clickAtClient(CLIENT_X, CLIENT_Y);
      if (!el) return toast('没有命中元素（检查固定坐标）');

      let iframe = null;
      for (const sel of IFRAME_CANDIDATES) { iframe = el.querySelector(sel); if (iframe) break; }
      if (!iframe) return toast('容器内未找到 iframe');

      await waitIframeReady(iframe);
      const idoc = safeDoc(iframe);
      if (!idoc) return toast('iframe 跨域或不可访问');

      const ops = { doc: idoc, items: [] };
      let matched = 0;
      const entries = Object.entries(mapData || {});
      for (const [key, rawVal] of entries) {
        const want = normalize(String(rawVal ?? ''));
        const q = `input[type="checkbox"][name="${cssEscape(key)}"]`;
        const candidates = Array.from(idoc.querySelectorAll(q));

        const pick = () => candidates.find(inp => normalize(getOptionText(idoc, inp)) === want)
                       || candidates.find(inp => normalize(getOptionText(idoc, inp)).includes(want))
                       || null;

        let target = pick();
        if (!target) {
          target = await new Promise(resolve => {
            const obs = new MutationObserver(() => {
              const hit = pick();
              if (hit) { obs.disconnect(); resolve(hit); }
            });
            obs.observe(idoc.documentElement, { childList:true, subtree:true, characterData:true });
            setTimeout(() => { obs.disconnect(); resolve(null); }, 3000);
          });
        }

        if (target) {
          const wasChecked = !!target.checked;
          const wasDefaultChecked = !!target.defaultChecked;
          const hadAttrChecked = target.hasAttribute('checked');

          target.setAttribute('checked', '');
          target.checked = true;
          target.defaultChecked = true;
          target.dispatchEvent(new Event('input',  { bubbles:true }));
          target.dispatchEvent(new Event('change', { bubbles:true }));

          // 仅在指定键上加高亮
          let hlEl = null;
          if (HIGHLIGHT_KEYS.has(key)) {
            hlEl = addHighlight(idoc, target) || null;
          }

          ops.items.push({ input: target, wasChecked, wasDefaultChecked, wasAttrChecked: hadAttrChecked, hlEl });
          matched++;
        }
      }

      lastOps = ops;
      toast(`执行完成：匹配 ${matched}/${entries.length}`);
    } catch (e) {
      console.error(e);
      toast('执行异常，请查看控制台');
    }
  }

  function undoLast() {
    if (!lastOps || !lastOps.items?.length) {
      toast('没有可撤销的操作');
      return;
    }
    const idoc = lastOps.doc;
    let restored = 0;
    for (const rec of lastOps.items) {
      const inp = rec.input;
      if (!inp || !inp.isConnected) continue;

      if (rec.wasAttrChecked) inp.setAttribute('checked', '');
      else inp.removeAttribute('checked');

      inp.checked = !!rec.wasChecked;
      inp.defaultChecked = !!rec.wasDefaultChecked;

      inp.dispatchEvent(new Event('input',  { bubbles:true }));
      inp.dispatchEvent(new Event('change', { bubbles:true }));

      if (rec.hlEl) removeHighlight(rec.hlEl);

      restored++;
    }
    lastOps = null;
    toast(`已撤销：恢复 ${restored} 项`);
  }

  function waitIframeReady(iframe) {
    return new Promise(res => {
      try { if (iframe.contentDocument) return res(); } catch { return res(); }
      iframe.addEventListener('load', () => res(), { once: true });
      setTimeout(() => res(), 800);
    });
  }
  function safeDoc(iframe) {
    try { return iframe.contentDocument || iframe.contentWindow?.document || null; }
    catch { return null; }
  }

  /** ===== 右下角 JSON 面板（单例） ===== */
  const panel = createJsonPanel();
  const textarea = panel.querySelector('textarea');
  const runBtn = panel.querySelector('button[data-action="run"]');
  const resetBtn = panel.querySelector('button[data-action="reset"]');
  const undoBtn = panel.querySelector('button[data-action="undo"]');

  textarea.value = JSON.stringify(DEFAULT_DATA, null, 2);
  runBtn.addEventListener('click', () => {
    let data;
    try { data = JSON.parse(textarea.value || '{}'); }
    catch { return toast('JSON 解析失败，请检查格式'); }
    runOnceWithData(data);
  });
  resetBtn.addEventListener('click', () => {
    textarea.value = JSON.stringify(DEFAULT_DATA, null, 2);
    toast('已恢复默认 JSON');
  });
  undoBtn.addEventListener('click', () => undoLast());

  function createJsonPanel() {
    const wrap = document.createElement('div');
    wrap.id = PANEL_ID;
    Object.assign(wrap.style, {
      position: 'fixed', right: '16px', bottom: '16px', width: '340px',
      zIndex: 999999, background: 'rgba(255,255,255,0.98)', border: '1px solid #ddd',
      boxShadow: '0 4px 16px rgba(0,0,0,.15)', borderRadius: '8px', padding: '10px',
      fontSize: '13px', fontFamily: 'system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,"Noto Sans","PingFang SC","Microsoft Yahei",sans-serif'
    });

    const title = document.createElement('div');
    title.textContent = '批量勾选(JSON)：name=键；label/邻近文本=值';
    Object.assign(title.style, { marginBottom: '6px', fontWeight: '600', cursor: 'move' });

    const ta = document.createElement('textarea');
    Object.assign(ta.style, {
      width: '100%', height: '220px', resize: 'vertical',
      boxSizing: 'border-box', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none'
    });

    const btns = document.createElement('div');
    Object.assign(btns.style, { marginTop: '8px', display: 'flex', gap: '8px' });

    const run = document.createElement('button'); run.textContent = '执行'; run.setAttribute('data-action', 'run');
    const undo = document.createElement('button'); undo.textContent = '撤销上次'; undo.setAttribute('data-action', 'undo');
    const reset = document.createElement('button'); reset.textContent = '恢复默认'; reset.setAttribute('data-action', 'reset');

    [run, undo, reset].forEach(b => Object.assign(b.style, {
      flex: '1 1 auto', padding: '8px 10px', borderRadius: '6px',
      border: '1px solid #bbb', background: '#fff', cursor: 'pointer'
    }));

    // 拖拽
    let dragging = false, sx = 0, sy = 0, sr = 0, sb = 0;
    title.addEventListener('mousedown', (e) => {
      dragging = true; sx = e.clientX; sy = e.clientY;
      sr = parseInt(wrap.style.right || '16', 10);
      sb = parseInt(wrap.style.bottom || '16', 10);
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      wrap.style.right = (sr - dx) + 'px';
      wrap.style.bottom = (sb - dy) + 'px';
    });
    window.addEventListener('mouseup', () => dragging = false);

    btns.append(run, undo, reset);
    wrap.append(title, ta, btns);
    document.documentElement.appendChild(wrap);
    return wrap;
  }

  function toast(msg, dur = 1600) {
    const div = document.createElement('div');
    div.textContent = msg;
    Object.assign(div.style, {
      position: 'fixed', left: '50%', top: '12%', transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,.75)', color: '#fff', padding: '8px 12px',
      borderRadius: '6px', zIndex: 1000000, fontSize: '14px', maxWidth: '80%', whiteSpace: 'nowrap'
    });
    document.documentElement.appendChild(div);
    setTimeout(() => div.remove(), dur);
  }
})();