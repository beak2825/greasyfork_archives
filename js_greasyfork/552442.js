// ==UserScript==
// @name         场馆预约
// @namespace    xdu-gym-auto-click
// @version      1.4.3
// @description  一键启动→后台循环扫描直到成功或停止；面板可拖拽/可缩小。
// @author       ZXT,Leafson
// @license Copyright (c) 2025 ZXT,Leafson. All Rights Reserved.
// @match        https://tybsouthgym.xidian.edu.cn/Views/Field/FieldOrder.html*
// @icon         https://tybsouthgym.xidian.edu.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552442/%E5%9C%BA%E9%A6%86%E9%A2%84%E7%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/552442/%E5%9C%BA%E9%A6%86%E9%A2%84%E7%BA%A6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /****************** 配置项（可在面板中改） ******************/
  const DEFAULTS = {
    times: '19:00',      // 逗号分隔，完全匹配（会归一化到 HH:MM）
    fields: '',                // 逗号分隔，包含匹配，留空不限
    dateOffsets: '2',          // 逗号分隔：0=今天，1=明天…
    periods: '2',              // 逗号分隔：0=上午 1=下午 2=晚上
    stepDelay: 120,            // 基础延时
    pickTimeout: 1000,         // 等待“已选中(myd)”最大时长
    clickRetry: 2,             // 单格点击失败重试次数
    autoSubmit: true,          // 命中后立即 submit()
    stopAfterFirstSuccess: true,   // 成功一次后是否结束本轮扫描（配合循环模式）
    repeatUntilSuccess: true,      // 循环后台模式：直到成功或停止
    repeatIntervalMs: 1000,        // 两轮扫描之间的等待间隔
  };

  /****************** 小工具 ******************/
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const parseCSV = (s) => (s || '').split(',').map(x => x.trim()).filter(Boolean);

  function getAttrCI(el, name) { // 不区分大小写读属性
    if (!el || !el.attributes) return '';
    const target = name.toLowerCase();
    for (const a of el.attributes) if (a.name.toLowerCase() === target) return String(a.value || '');
    return '';
  }
  const getBeginTime = (li) => (getAttrCI(li,'BeginTime') || getAttrCI(li,'begintime')).trim();
  const getFieldName = (li) => (getAttrCI(li,'FieldName') || getAttrCI(li,'fieldname')).trim();

  // "18:00" / "18:00:00" 统一到 "HH:MM"
  function normHHMM(s){
    const m = String(s||'').match(/^(\d{1,2}):(\d{2})/);
    if (!m) return '';
    const h  = String(m[1]).padStart(2,'0');
    const mm = String(m[2]).padStart(2,'0');
    return `${h}:${mm}`;
  }

  const getAllCells = () => Array.from(document.querySelectorAll('.resbox-table-rows li.col'));
  const isAvailable = (li) => !!li.querySelector('div.kyd'); // 可预约
  const isSelected  = (li) => !!li.querySelector('div.myd'); // 已选中

  function getClickable(li) { // 真正绑定事件的目标
    return li.querySelector('div.kyd,.kyd') || li.querySelector('div') || li;
  }

  function refindCell(bt, fn) { // DOM 可能被重建：按“时间+场地”重找
    bt = normHHMM(bt);
    const all = getAllCells();
    for (const n of all) {
      const bt2 = normHHMM(getBeginTime(n));
      const fn2 = getFieldName(n);
      if (bt2 === bt && fn2 === fn) return n;
    }
    return null;
  }

  async function waitForFns() { // 页面函数可用性
    const t0 = Date.now();
    while (Date.now() - t0 < 5000) {
      if (typeof window.getDateData === 'function' && typeof window.getDataTime === 'function') return;
      await sleep(80);
    }
  }

  /****************** 智能点击引擎（多重兜底） ******************/
  function dispatchMouse(el, type, x, y) {
    try {
      el.dispatchEvent(new MouseEvent(type, {
        bubbles: true, cancelable: true, view: window,
        clientX: x, clientY: y, screenX: x, screenY: y,
        button: 0, buttons: 1, detail: 1
      }));
    } catch {}
  }
  function dispatchPointer(el, type, x, y) {
    try {
      if (typeof PointerEvent === 'function') {
        el.dispatchEvent(new PointerEvent(type, {
          bubbles: true, cancelable: true, pointerId: 1, pointerType: 'mouse',
          isPrimary: true, clientX: x, clientY: y
        }));
      }
    } catch {}
  }
  function dispatchTouch(el, type, x, y) {
    try {
      const touchObj = new Touch({ identifier: Date.now(), target: el, clientX: x, clientY: y, radiusX: 2, radiusY: 2, rotationAngle: 0, force: 0.5 });
      const ev = new TouchEvent(type, { bubbles: true, cancelable: true, touches: type==='touchend'?[]:[touchObj], targetTouches: [], changedTouches: [touchObj] });
      el.dispatchEvent(ev);
    } catch {}
  }
  function jqTrigger(el) {
    try {
      if (window.jQuery) {
        window.jQuery(el).trigger('click');
        window.jQuery(el).trigger('tap');
      }
    } catch {}
  }
  function callChose(el) {
    try {
      if (typeof window.chose === 'function') { window.chose(el); return true; }
    } catch {}
    try { // inline onclick="chose(this)"
      const code = el.getAttribute && el.getAttribute('onclick');
      if (code && /chose\s*\(/.test(code)) {
        (new Function('el', `with(this){ ${code.replace('this','el')} }`)).call(window, el);
        return true;
      }
    } catch {}
    return false;
  }

  async function smartClick(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = Math.floor(rect.left + rect.width/2);
    const cy = Math.floor(rect.top  + rect.height/2);

    if (callChose(el)) return; // 1) 站点 API

    try { el.scrollIntoView({block:'center', inline:'center'}); } catch {}

    // 2) Pointer/Mouse 序列
    dispatchPointer(el, 'pointerover', cx, cy);
    dispatchMouse  (el, 'mouseover',   cx, cy);
    dispatchPointer(el, 'pointerenter',cx, cy);
    dispatchMouse  (el, 'mouseenter',  cx, cy);
    dispatchPointer(el, 'pointerdown', cx, cy);
    dispatchMouse  (el, 'mousedown',   cx, cy);
    dispatchPointer(el, 'pointerup',   cx, cy);
    dispatchMouse  (el, 'mouseup',     cx, cy);
    dispatchMouse  (el, 'click',       cx, cy);

    // 3) Touch/jQuery
    dispatchTouch  (el, 'touchstart',  cx, cy);
    dispatchTouch  (el, 'touchend',    cx, cy);
    jqTrigger(el);
  }

  /****************** 悬浮面板（可拖拽 + 可缩小） ******************/
  const logBox = (() => {
    const box = document.createElement('div');
    box.style.cssText = `
      position: fixed; right: 20px; top: 20px; z-index: 2147483647;
      width: 380px; background: #0f172a; color: #fff;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
      border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,.35); overflow: hidden; user-select: none;
    `;
    box.innerHTML = `
      <div id="xdu_header" style="padding:10px 12px; font-weight:700; font-size:14px; display:flex; align-items:center; gap:8px; border-bottom:1px solid rgba(255,255,255,.08); cursor: move;">
        <span style="flex:1">预约自动点击（可拖拽/可缩小）</span>
        <button id="xdu_min" title="缩小/展开" style="cursor:pointer; padding:2px 8px; border-radius:8px; border:1px solid #334155; background:#111827; color:#fff;">—</button>
        <button id="xdu_resetpos" title="复位到右上角" style="cursor:pointer; padding:2px 8px; border-radius:8px; border:1px solid #334155; background:#111827; color:#fff;">复位</button>
      </div>
      <div id="xdu_body" style="padding:12px 12px 8px; display:grid; gap:8px">
        <label>
          <div style="font-size:12px;opacity:.8;margin-bottom:4px">时间点（逗号分隔，完全匹配）</div>
          <input id="xdu_times" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid #334155;background:#111827;color:#fff" placeholder="如：18:00,19:00">
        </label>
        <label>
          <div style="font-size:12px;opacity:.8;margin-bottom:4px">场地关键字（可选，逗号分隔，包含匹配）</div>
          <input id="xdu_fields" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid #334155;background:#111827;color:#fff" placeholder="如：羽毛球1,羽毛球3；留空=不限">
        </label>
        <div style="display:flex; gap:8px">
          <label style="flex:1">
            <div style="font-size:12px;opacity:.8;margin-bottom:4px">日期 offset（支持逗号多值）</div>
            <input id="xdu_dates" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid #334155;background:#111827;color:#fff" placeholder="如：0 或 0,1,2">
          </label>
          <label style="flex:1">
            <div style="font-size:12px;opacity:.8;margin-bottom:4px">时段（支持逗号多值）</div>
            <input id="xdu_periods" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid #334155;background:#111827;color:#fff" placeholder="0=上/1=下/2=晚，如：2 或 0,1,2">
          </label>
        </div>
        <div style="display:flex; gap:8px">
          <label style="flex:1">
            <div style="font-size:12px;opacity:.8;margin-bottom:4px">循环间隔（秒）</div>
            <input id="xdu_interval" type="number" min="1" value="3" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid #334155;background:#111827;color:#fff">
          </label>
          <label style="flex:1; display:flex; align-items:flex-end; gap:6px">
            <input id="xdu_repeat" type="checkbox" checked style="transform:scale(1.2)">
            <span style="font-size:12px">循环直到成功</span>
          </label>
        </div>
        <div style="display:flex; gap:10px; margin-top:6px">
          <button id="xdu_start" style="flex:1;padding:10px;border-radius:10px;background:#2563eb;border:none;color:#fff;font-weight:700">开始</button>
          <button id="xdu_stop"  style="flex:1;padding:10px;border-radius:10px;background:#4b5563;border:none;color:#fff;font-weight:700">停止</button>
        </div>
        <div style="font-size:11px;opacity:.8">支持后台循环；面板缩小后仍在后台运行。</div>
      </div>
      <div id="xdu_logs" style="max-height:260px;overflow:auto;padding:10px 12px 12px;font-size:12px;line-height:1.45;background:#0b1220;border-top:1px solid rgba(255,255,255,.08)"></div>
    `;
    document.body.appendChild(box);

    // 拖拽（不持久化）
    (function enableDrag() {
      const header = box.querySelector('#xdu_header');
      const resetBtn = box.querySelector('#xdu_resetpos');
      const minBtn   = box.querySelector('#xdu_min');
      const body     = box.querySelector('#xdu_body');
      const logs     = box.querySelector('#xdu_logs');

      let dragging = false, sx=0, sy=0, bx=0, by=0;
      let minimized = false;

      const onDown = (e) => {
        dragging = true;
        const rect = box.getBoundingClientRect();
        sx = (e.touches ? e.touches[0].clientX : e.clientX);
        sy = (e.touches ? e.touches[0].clientY : e.clientY);
        bx = rect.left; by = rect.top;
        box.style.left = rect.left + 'px';
        box.style.top  = rect.top  + 'px';
        box.style.right = 'auto';
        e.preventDefault();
      };
      const onMove = (e) => {
        if (!dragging) return;
        const cx = (e.touches ? e.touches[0].clientX : e.clientX);
        const cy = (e.touches ? e.touches[0].clientY : e.clientY);
        const nx = bx + (cx - sx);
        const ny = by + (cy - sy);
        const maxX = window.innerWidth  - box.offsetWidth;
        const maxY = window.innerHeight - box.offsetHeight;
        box.style.left = Math.max(0, Math.min(maxX, nx)) + 'px';
        box.style.top  = Math.max(0, Math.min(maxY, ny)) + 'px';
      };
      const onUp = () => { dragging = false; };
      header.addEventListener('mousedown', onDown);
      header.addEventListener('touchstart', onDown, {passive:false});
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onMove, {passive:false});
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchend', onUp);

      resetBtn.onclick = () => { // 复位右上角
        box.style.right = '20px';
        box.style.top = '20px';
        box.style.left = 'auto';
      };

      minBtn.onclick = () => { // 缩小/展开
        minimized = !minimized;
        if (minimized) {
          body.style.display = 'none';
          logs.style.display = 'none';
          minBtn.textContent = '＋';
          box.style.width = '260px';
        } else {
          body.style.display = '';
          logs.style.display = '';
          minBtn.textContent = '—';
          box.style.width = '380px';
        }
      };
    })();

    const logs = box.querySelector('#xdu_logs');
    const add = (t) => {
      const time = new Date().toTimeString().slice(0,8);
      logs.insertAdjacentHTML('beforeend', `<div>[${time}] ${t}</div>`);
      logs.scrollTop = logs.scrollHeight;
    };
    return {box, add};
  })();

  const $id = (s) => document.getElementById(s);
  const setDefaults = () => {
    $id('xdu_times').value   = DEFAULTS.times;
    $id('xdu_fields').value  = DEFAULTS.fields;
    $id('xdu_dates').value   = DEFAULTS.dateOffsets;
    $id('xdu_periods').value = DEFAULTS.periods;
    $id('xdu_interval').value= Math.max(1, Math.round(DEFAULTS.repeatIntervalMs/1000));
    $id('xdu_repeat').checked= DEFAULTS.repeatUntilSuccess;
  };
  setDefaults();

  let running = false;

  // 循环后台：外层 runLoop，单轮 runOnce
  $id('xdu_start').onclick = () => {
    if (running) return;
    running = true;
    runLoop().catch(err => logBox.add('❌ 错误：' + (err?.message || err))).finally(()=>{ running=false; });
  };
  $id('xdu_stop').onclick = () => { running = false; logBox.add('⏹️ 已停止'); };

  async function runLoop() {
    const repeat = !!$id('xdu_repeat').checked;
    const intervalMs = Math.max(1000, Number($id('xdu_interval').value || 3) * 1000);

    let round = 0;
    while (running) {
      round++;
      logBox.add(`🔁 第 ${round} 轮扫描开始…`);
      const success = await runOnce();
      if (!running) break;

      if (success) {
        logBox.add('🎉 已命中并提交；循环结束。');
        break;
      }
      if (!repeat) {
        logBox.add('ℹ️ 循环未开启，本轮结束。');
        break;
      }
      logBox.add(`⏳ 本轮未命中，${Math.round(intervalMs/1000)} 秒后重试…`);
      await sleep(intervalMs);
    }
  }

  /****************** 单轮扫描：返回是否命中成功 ******************/
  async function runOnce() {
    await waitForFns();

    const times  = parseCSV($id('xdu_times').value).map(normHHMM);
    const fields = parseCSV($id('xdu_fields').value);
    const dates  = parseCSV($id('xdu_dates').value || '0');
    const periods= parseCSV($id('xdu_periods').value || '2');

    if (!times.length)  { logBox.add('⚠️ 请先输入“时间点”。'); return false; }
    if (!dates.length || !periods.length) { logBox.add('⚠️ 日期或时段未设置。'); return false; }

    logBox.add(`▶️ 配置：时间=${times.join('，')}；场地关键词=${fields.length?fields.join('，'):'不限'}；日期偏移=${dates.join(',')}；时段=${periods.join(',')}`);

    let booked = false;

    outer:
    for (const dateOffset of dates) {
      if (!running) break;

      try { window.getDateData(String(Number(dateOffset))); logBox.add(`… 已切换日期 offset=${dateOffset}`); await sleep(350); } catch {}

      for (const period of periods) {
        if (!running) break;
        try { window.getDataTime(String(period)); logBox.add(`… 已切换时段 period=${period}`); await sleep(450); } catch {}

        await waitForCells();

        for (const t of times) {
          if (!running) break;

          logBox.add(`⏱ 扫描时间 ${t}`);

          const candidate = getAllCells().filter(li => {
            const bt = normHHMM(getBeginTime(li));
            const fn = getFieldName(li);
            if (bt !== t) return false;
            if (fields.length && !fields.some(k => fn.includes(k))) return false;
            return isAvailable(li);
          });

          if (!candidate.length) { logBox.add(`✖ 未找到可预约：${t}`); continue; }

          for (const li of candidate) {
            if (!running) break;

            const bt0 = normHHMM(getBeginTime(li));
            const fn0 = getFieldName(li);
            let ok = false;

            // ★★★ 你要求的“点击选中的核心代码（强制标记 myd）”开始 ★★★
            for (let attempt = 0; attempt <= DEFAULTS.clickRetry; attempt++) {
              try {
                const target = getClickable(li);

                // 如果目标元素没有class或者class不包含"myd"，可以设置它的class为"myd"
                if (!target?.classList.contains('myd')) {
                  target.classList.add('myd');
                }

                logBox.add(`… 尝试点击（第 ${attempt+1} 次）：${bt0} @ ${fn0}，class=${target?.className || '(no-class)'}`);
                await smartClick(target);

                // 等待“已选中”（允许 DOM 重建）
                const deadline = Date.now() + DEFAULTS.pickTimeout;
                while (Date.now() < deadline) {
                  const cur = refindCell(bt0, fn0) || li;
                  if (isSelected(cur) || document.querySelectorAll('.resbox-table-rows .myd').length > 0) {
                    ok = true;
                    break;
                  }
                  await sleep(100);
                }
                if (ok) break;
                await sleep(120 + Math.floor(Math.random() * 120)); // 抖动间隔
              } catch (err) {
                logBox.add(`❌ 点击异常 @ ${fn0}：${err?.message || err}`);
              }
            }

            if (!ok) {
              logBox.add(`… 点击后未进入“已选”，尝试下一个 @ ${fn0}`);
              continue;
            }
            // ★★★ 核心代码结束 ★★★

            logBox.add(`✔️ 已选中：${t} @ ${fn0}`);

            if (DEFAULTS.autoSubmit) {
              await submitNow();
              booked = true;
              if (DEFAULTS.stopAfterFirstSuccess) {
                logBox.add('🏁 命中已提交，结束本轮扫描。');
                break outer;
              }
            }
            break;
          }
        }
      }
    }

    logBox.add('✅ 本轮扫描完成');
    return booked;
  }

  async function waitForCells(timeout = 6000) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeout) {
      if (getAllCells().length) return;
      await sleep(120);
    }
  }

  async function submitNow() {
    const btn = document.querySelector('#atj');
    if (btn) { btn.click(); logBox.add('… 已点击底部“确认预订”'); await sleep(DEFAULTS.stepDelay); }
    else { logBox.add('ℹ️ 未找到 #atj，直接尝试 submit()'); }

    if (typeof window.submit === 'function') {
      try { window.submit(); logBox.add('📤 已调用 submit() 发起订单提交'); }
      catch (e) {
        logBox.add('❌ submit() 出错：' + (e?.message || e));
        const ok = document.querySelector('.weui-dialog__btn_primary, .weui-btn_dialog.primary, .weui-dialog__btn.default.primary');
        if (ok) { ok.click(); logBox.add('📤 兜底：已点击弹窗“确定”'); }
      }
    } else {
      const ok = document.querySelector('.weui-dialog__btn_primary, .weui-btn_dialog.primary, .weui-dialog__btn.default.primary');
      if (ok) { ok.click(); logBox.add('📤 已点击弹窗“确定”'); }
      else { logBox.add('⚠️ 未找到 submit() 或弹窗按钮；站点脚本可能尚未加载。'); }
    }
    await sleep(DEFAULTS.stepDelay + 200);
  }
})();
