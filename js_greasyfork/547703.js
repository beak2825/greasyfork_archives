// ==UserScript==
// @name         CF Practice Visualizer - Pure SVG, Auto, Shadow Scoped
// @namespace    cfviz-auto-svg
// @version      1.0.0
// @description  在 Codeforces 个人页自动内嵌练习可视化面板（零依赖：纯原生 SVG 渲染；Shadow DOM 隔离；无需点击）
// @match        https://codeforces.com/profile/*
// @match        https://*.codeforces.com/profile/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @author       paqi
// @downloadURL https://update.greasyfork.org/scripts/547703/CF%20Practice%20Visualizer%20-%20Pure%20SVG%2C%20Auto%2C%20Shadow%20Scoped.user.js
// @updateURL https://update.greasyfork.org/scripts/547703/CF%20Practice%20Visualizer%20-%20Pure%20SVG%2C%20Auto%2C%20Shadow%20Scoped.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /*** -------------------- 基础工具 -------------------- ***/
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const qs = (sel, root = document) => root.querySelector(sel);

  const onceId = 'cfviz-host';

  function detectHandle () {
    // 1) URL
    const m1 = location.pathname.match(/\/profile\/([^/?#]+)/);
    if (m1?.[1]) return decodeURIComponent(m1[1]);
    // 2) DOM 标注
    const a = qs('.main-info a.rated-user, a.rated-user');
    if (a?.textContent) return a.textContent.trim();
    // 3) OG
    const og = qs('meta[property="og:url"]')?.content;
    const m2 = og && og.match(/\/profile\/([^/?#]+)/);
    if (m2?.[1]) return decodeURIComponent(m2[1]);
    return null;
  }

  async function cfFetch (url, params = {}, retries = 8) {
    const q = new URLSearchParams(params).toString();
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(`${url}?${q}`, { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.status === 'OK') return json.result;
        throw new Error(json.comment || 'CF API failed');
      } catch (e) {
        if (i === retries - 1) throw e;
        await sleep(250 * Math.pow(1.6, i));
      }
    }
  }

  /*** -------------------- 插入容器（Shadow DOM） -------------------- ***/
  function ensureHost () {
    if (document.getElementById(onceId)) return document.getElementById(onceId);
    const anchor = qs('#ratingChart') ||
                   qs('#pageContent .userActivityRoundBox') ||
                   qs('#pageContent') || document.body;

    const host = document.createElement('div');
    host.id = onceId;
    host.className = 'roundbox userActivityRoundBox borderTopRound borderBottomRound';
    host.style.marginTop = '1em';
    (anchor.parentElement || anchor).insertAdjacentElement('afterend', host);
    return host;
  }

  function mountShadow (host) {
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display:block; }
        #cfviz-wrap { padding: 16px; font: 14px/1.45 system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans SC", sans-serif; }
        #cfviz-title { font-size: 18px; font-weight: 800; margin: 0 0 8px; }
        #cfviz-sub { color:#64748b; margin: 0 0 12px; }
        #cfviz-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        @media (max-width: 960px) { #cfviz-grid { grid-template-columns: 1fr; } }
        .cfviz-card { background: rgba(255,255,255,.9); border-radius: 12px; padding: 12px; box-shadow: 0 4px 16px rgba(0,0,0,.06); }
        .cfviz-card h3 { margin: 0 0 8px; font-size: 14px; }
        .cfviz-svg { width: 100%; height: 260px; display: block; }
        /* 热格 */
        #cfviz-heat { display: grid; grid-template-columns: repeat(6,1fr); gap: 6px; }
        .cfviz-cell { padding: 14px 4px; border-radius: 10px; text-align: center; font-weight: 800; font-size: 12px; line-height: 1.2; user-select: none; }
        /* 9 桶 */
        #cfviz-buckets { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .cfviz-bcell { padding: 18px 10px; border-radius: 12px; color: #fff; text-align: center; font-weight: 900; font-size: 18px; }
        .cfviz-bcell small { display:block; margin-top:6px; font-size: 11px; opacity:.9; }
        /* 微提示 */
        #cfviz-tip { color:#6b7280; margin-top:6px; }
      </style>
      <div id="cfviz-wrap">
        <div id="cfviz-title">练习可视化面板</div>
        <div id="cfviz-sub"></div>
        <div id="cfviz-grid">
          <div class="cfviz-card">
            <h3>预测 vs 实际 Rating</h3>
            <svg id="cfviz-line" class="cfviz-svg"></svg>
          </div>
          <div class="cfviz-card">
            <h3>30 天 ΔRating 热力图</h3>
            <div id="cfviz-heat"></div>
          </div>
          <div class="cfviz-card">
            <h3>30 天每日刷题分段（堆叠）</h3>
            <svg id="cfviz-bar" class="cfviz-svg"></svg>
          </div>
          <div class="cfviz-card">
            <h3>历史刷题颜色图</h3>
            <div id="cfviz-buckets"></div>
          </div>
        </div>
        <div id="cfviz-tip"></div>
      </div>
    `;
    return { shadow, $: (s) => shadow.querySelector(s) };
  }

  /*** -------------------- 数据处理（同你原模型） -------------------- ***/
  const K_FIXED = 255, L_FIXED = 600, ALPHA = 0.4625;

  const DIFFS = [
    ["3000+", r=>r>=3000, "#800000"],
    ["2400-2999", r=>r<3000 && r>=2400, "#ff0000"],
    ["2100-2399", r=>r>=2100, "#ff8c00"],
    ["1900-2099", r=>r>=1900, "#b000b0"],
    ["1600-1899", r=>r>=1600, "#3250ff"],
    ["1400-1599", r=>r>=1400, "#00b4c8"],
    ["1200-1399", r=>r>=1200, "#00c000"],
    ["800-1199", r=>r>=800, "#808080"],
    ["unrated", r=>!r, "#000"]
  ];

  const BUCKET9 = [
    ["(无评级)", r=>r==null, "#191919"],
    ["(0-1199)", r=>r!=null && r<1200, "#808080"],
    ["(1200-1399)", r=>r>=1200 && r<=1399, "#00c000"],
    ["(1400-1599)", r=>r>=1400 && r<=1599, "#00b4c8"],
    ["(1600-1899)", r=>r>=1600 && r<=1899, "#3250ff"],
    ["(1900-2099)", r=>r>=1900 && r<=2099, "#b000b0"],
    ["(2100-2399)", r=>r>=2100 && r<=2399, "#ff8c00"],
    ["(2400-2999)", r=>r>=2400 && r<=2999, "#ff0000"],
    ["(3000+)", r=>r>=3000, "#800000"]
  ];

  const ts2d = ts => new Date(ts * 1000);
  const dKey = d => {
    const x = new Date(d.getTime() - d.getTimezoneOffset()*60000);
    return x.toISOString().slice(0,10);
  };

  function simulate (tasks, k=0.65, p=3.5) {
    const N = tasks.length;
    let R = 800;
    const series = [];
    let i = 0;
    for (const t of tasks) {
      i++;
      const phi = 1 + k * Math.pow(i/N, p);
      const mapped = 800 + (t.rating - 800) * phi;
      const base_w = Math.pow(i, ALPHA) - Math.pow(i-1, ALPHA);
      const delta = mapped - R;
      const scale = 1 / (1 + Math.exp(-delta / L_FIXED));
      const expected = 1 / (1 + Math.pow(10, delta/400));
      R += K_FIXED * (1 - expected) * base_w * scale;
      series.push({ ts: t.ts, R });
    }
    return series;
  }

  function dedupEarliestAC (subs) {
    const earliest = new Map();
    for (const s of subs) {
      if (s.verdict !== 'OK') continue;
      const cid = s.contestId || s.problem?.contestId;
      const pid = `${cid}-${s.problem.index}`;
      if (!earliest.has(pid) || s.creationTimeSeconds < earliest.get(pid).creationTimeSeconds) {
        earliest.set(pid, s);
      }
    }
    return [...earliest.values()];
  }

  function dailyDifficulty (subs) {
    const map = new Map();
    for (const s of subs) {
      if (s.verdict !== 'OK') continue;
      const rating = s.problem?.rating ?? null;
      const k = dKey(ts2d(s.creationTimeSeconds));
      if (!map.has(k)) {
        const obj = {}; DIFFS.forEach(([name]) => obj[name] = 0); map.set(k, obj);
      }
      for (const [name, cond] of DIFFS) {
        if (cond(rating)) { map.get(k)[name]++; break; }
      }
    }
    return map;
  }

  /*** -------------------- 纯 SVG 渲染 -------------------- ***/
  function clearSVG(svg) { while (svg.firstChild) svg.removeChild(svg.firstChild); }

  function lineChart (svg, dates, pred, actual) {
    // 尺寸与内边距
    const W = svg.clientWidth || 600, H = svg.clientHeight || 260;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); clearSVG(svg);
    const m = { l:40, r:10, t:14, b:26 };

    // 若没有数据，给个提示
    if (!dates.length || (!pred.length && !actual.length)) {
      const t = document.createElementNS('http://www.w3.org/2000/svg','text');
      t.setAttribute('x', 10); t.setAttribute('y', 22);
      t.setAttribute('fill', '#6b7280'); t.textContent = '无数据';
      svg.appendChild(t); return;
    }

    const minT = +dates[0], maxT = +dates[dates.length-1] || (+dates[0]+1);
    const allY = [...pred, ...actual].filter(v=>v!=null&&isFinite(v));
    const minY = Math.min(...allY) - 20, maxY = Math.max(...allY) + 20;

    const x = t => m.l + ( (t - minT) / Math.max(1, maxT - minT) ) * (W - m.l - m.r);
    const y = v => m.t + ( (maxY - v) / Math.max(1, maxY - minY) ) * (H - m.t - m.b);

    // 网格线
    const grid = document.createElementNS('http://www.w3.org/2000/svg','g');
    const yTicks = 5, xTicks = Math.min(6, dates.length);
    for (let i=0;i<=yTicks;i++){
      const yy = m.t + i*(H-m.t-m.b)/yTicks;
      const ln = document.createElementNS('http://www.w3.org/2000/svg','line');
      ln.setAttribute('x1', m.l); ln.setAttribute('x2', W-m.r);
      ln.setAttribute('y1', yy); ln.setAttribute('y2', yy);
      ln.setAttribute('stroke', '#e5e7eb'); ln.setAttribute('stroke-width','1');
      grid.appendChild(ln);
    }
    for (let i=0;i<=xTicks;i++){
      const tt = minT + i*(maxT-minT)/xTicks;
      const xx = x(tt);
      const ln = document.createElementNS('http://www.w3.org/2000/svg','line');
      ln.setAttribute('y1', m.t); ln.setAttribute('y2', H-m.b);
      ln.setAttribute('x1', xx); ln.setAttribute('x2', xx);
      ln.setAttribute('stroke', '#f1f5f9'); ln.setAttribute('stroke-width','1');
      grid.appendChild(ln);
    }
    svg.appendChild(grid);

    // 折线
    const makePath = (arr, col) => {
      if (!arr.length) return;
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      let d = `M ${x(+dates[0])} ${y(arr[0])}`;
      for (let i=1;i<dates.length;i++) {
        if (arr[i]==null) continue;
        d += ` L ${x(+dates[i])} ${y(arr[i])}`;
      }
      path.setAttribute('d', d);
      path.setAttribute('fill','none');
      path.setAttribute('stroke', col);
      path.setAttribute('stroke-width','2');
      svg.appendChild(path);
    };

    makePath(pred, '#ec4899');  // 粉
    makePath(actual, '#6366f1'); // 靛

    // y 轴刻度
    for (let i=0;i<=yTicks;i++){
      const val = Math.round(minY + i*(maxY - minY)/yTicks);
      const ty = m.t + (yTicks-i)*(H-m.t-m.b)/yTicks + 4;
      const t = document.createElementNS('http://www.w3.org/2000/svg','text');
      t.setAttribute('x', 4); t.setAttribute('y', ty);
      t.setAttribute('fill', '#94a3b8'); t.setAttribute('font-size','11');
      t.textContent = val;
      svg.appendChild(t);
    }
    // x 轴刻度（显示 MM-DD）
    for (let i=0;i<=xTicks;i++){
      const tt = new Date(minT + i*(maxT-minT)/xTicks);
      const xx = x(+tt);
      const t = document.createElementNS('http://www.w3.org/2000/svg','text');
      t.setAttribute('x', xx); t.setAttribute('y', H-6);
      t.setAttribute('text-anchor','middle');
      t.setAttribute('fill', '#94a3b8'); t.setAttribute('font-size','11');
      t.textContent = `${(tt.getMonth()+1).toString().padStart(2,'0')}-${tt.getDate().toString().padStart(2,'0')}`;
      svg.appendChild(t);
    }
  }

  function stackedBar (svg, labels, datasets) {
    const W = svg.clientWidth || 600, H = svg.clientHeight || 260;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); clearSVG(svg);
    const m = { l:40, r:10, t:10, b:28 };

    const totals = labels.map((_,i)=>datasets.reduce((s,ds)=>s+(ds.data[i]||0),0));
    const maxY = Math.max(1, ...totals);
    const bw = (W - m.l - m.r) / labels.length;
    const y = v => m.t + (1 - v/maxY)*(H - m.t - m.b);

    // y 轴网格
    const grid = document.createElementNS('http://www.w3.org/2000/svg','g');
    for (let i=0;i<=4;i++){
      const yy = m.t + i*(H-m.t-m.b)/4;
      const ln = document.createElementNS('http://www.w3.org/2000/svg','line');
      ln.setAttribute('x1', m.l); ln.setAttribute('x2', W-m.r);
      ln.setAttribute('y1', yy); ln.setAttribute('y2', yy);
      ln.setAttribute('stroke', '#e5e7eb'); ln.setAttribute('stroke-width','1');
      grid.appendChild(ln);
    }
    svg.appendChild(grid);

    for (let i=0;i<labels.length;i++){
      let cum = 0;
      for (const ds of datasets){
        const v = ds.data[i] || 0;
        if (v === 0) continue;
        const x0 = m.l + i*bw + 1;
        const x1 = x0 + Math.max(1, bw - 2);
        const y1 = y(cum);
        const y2 = y(cum + v);
        const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
        rect.setAttribute('x', x0);
        rect.setAttribute('y', y2);
        rect.setAttribute('width', x1 - x0);
        rect.setAttribute('height', Math.max(1, y1 - y2));
        rect.setAttribute('fill', ds.color || '#999');
        rect.setAttribute('opacity', '0.95');
        svg.appendChild(rect);
        cum += v;
      }
    }

    // 轴刻度
    for (let i=0;i<labels.length;i+=Math.ceil(labels.length/6)){
      const t = document.createElementNS('http://www.w3.org/2000/svg','text');
      const x0 = m.l + (i+0.5)*bw;
      t.setAttribute('x', x0); t.setAttribute('y', H-6);
      t.setAttribute('text-anchor','middle'); t.setAttribute('fill','#94a3b8');
      t.setAttribute('font-size','11'); t.textContent = labels[i].slice(5);
      svg.appendChild(t);
    }
    for (let i=0;i<=4;i++){
      const v = Math.round(i*maxY/4);
      const ty = m.t + (4-i)*(H-m.t-m.b)/4 + 4;
      const t = document.createElementNS('http://www.w3.org/2000/svg','text');
      t.setAttribute('x', 4); t.setAttribute('y', ty);
      t.setAttribute('fill','#94a3b8'); t.setAttribute('font-size','11'); t.textContent = v;
      svg.appendChild(t);
    }
  }

  /*** -------------------- 热格和桶渲染（纯 DOM） -------------------- ***/
  function renderHeat (gridEl, series) {
    const dailyD = {}, dailyEnd = {};
    const toMid = ts => { const d = new Date(ts*1000); d.setHours(0,0,0,0); return d; };
    const kOf = d => d.toISOString().slice(0,10);
    let prev = 800;
    for (const p of series){
      const k = kOf(toMid(p.ts));
      dailyD[k] = (dailyD[k]||0) + (p.R - prev);
      dailyEnd[k] = p.R;
      prev = p.R;
    }
    const today = new Date(); today.setHours(0,0,0,0);
    const cells = [];
    for (let i=29;i>=0;i--){
      const d = new Date(today); d.setDate(today.getDate()-i);
      const k = kOf(d);
      cells.push({ delta: dailyD[k]||0, endR: dailyEnd[k] ?? null, date: k });
    }
    const vmax = Math.max(...cells.map(c=>Math.abs(c.delta))) || 1;
    const bg = v => {
      const t = Math.min(1, Math.abs(v)/vmax), a = 0.25 + t*0.65;
      return v>=0 ? `rgba(59,130,246,${a})` : `rgba(244,63,94,${a})`;
    };

    gridEl.innerHTML = '';
    for (const {delta, endR, date} of cells) {
      const div = document.createElement('div');
      div.className = 'cfviz-cell';
      div.style.background = bg(delta);
      if (Math.abs(delta) > 0.6*vmax) div.style.color = '#fff';
      const deltaTxt = Math.abs(delta)>=0.01 ? ((delta>=0?'+':'') + delta.toFixed(1)) : '';
      div.innerHTML = `${deltaTxt}<br>${endR!=null?Math.round(endR):''}`;
      div.title = `${date}\nΔRating: ${delta.toFixed(1)}${endR!=null?`\nEnd-R: ${Math.round(endR)}`:''}`;
      gridEl.appendChild(div);
    }
  }

  function renderBuckets (container, subs) {
    const counts = Array(9).fill(0);
    for (const s of subs){
      const rating = s.problem?.rating ?? null;
      for (let i=0;i<BUCKET9.length;i++){
        if (BUCKET9[i][1](rating)){ counts[i]++; break; }
      }
    }
    container.innerHTML = '';
    BUCKET9.forEach(([lbl,,color],i)=>{
      const d = document.createElement('div');
      d.className = 'cfviz-bcell';
      d.style.background = color;
      d.innerHTML = `${counts[i]}<small>${lbl}</small>`;
      container.appendChild(d);
    });
  }

  /*** -------------------- 主流程 -------------------- ***/
  async function renderAll () {
    if (document.getElementById(onceId)) return; // 防重复
    const host = ensureHost();
    const { $, shadow } = mountShadow(host);
    const sub = $('#cfviz-sub'); const tip = $('#cfviz-tip');

    const handle = detectHandle();
    if (!handle) { sub.textContent = '未识别到用户名'; return; }
    sub.textContent = `已加载：@${handle}`;

    try {
      const [st, rt, info] = await Promise.all([
        cfFetch('https://codeforces.com/api/user.status', { handle, count: 15000 }),
        cfFetch('https://codeforces.com/api/user.rating', { handle }),
        cfFetch('https://codeforces.com/api/user.info', { handles: handle })
      ]);

      const subs = st;
      const contests = rt;
      const user = info?.[0];

      // 构造任务（首次 AC）
      const earliest = new Map();
      for (const subm of subs.slice().reverse()){
        if (subm.verdict !== 'OK') continue;
        const cid = subm.contestId || subm.problem?.contestId;
        const pid = `${cid}-${subm.problem.index}`;
        if (!earliest.has(pid)){
          const rating = (typeof subm.problem?.rating === 'number') ? subm.problem.rating : 1500;
          earliest.set(pid, { ts: subm.creationTimeSeconds, rating });
        }
      }
      const tasks = [...earliest.values()].sort((a,b)=>a.ts-b.ts);
      const series = simulate(tasks);

      // 映射预测到比赛时间点
      const dates = contests.map(c => ts2d(c.ratingUpdateTimeSeconds));
      const actual = contests.map(c => c.newRating);
      const predAt = [];
      let idx = 0;
      for (const c of contests){
        while (idx+1 < series.length && series[idx].ts < c.ratingUpdateTimeSeconds) idx++;
        predAt.push( (series[Math.min(idx, series.length-1)]?.R) ?? 800 );
      }

      // 折线
      const lineSVG = $('#cfviz-line');
      const ro1 = new ResizeObserver(()=> lineChart(lineSVG, dates, predAt, actual));
      ro1.observe(lineSVG); lineChart(lineSVG, dates, predAt, actual);

      // 热格
      renderHeat($('#cfviz-heat'), series);

      // 30 天分段
      const today = new Date(); today.setHours(0,0,0,0);
      const keys = [];
      for (let i=29;i>=0;i--){ const d = new Date(today); d.setDate(today.getDate()-i); keys.push(dKey(d)); }

      const uniq = dedupEarliestAC(subs);
      const map = dailyDifficulty(uniq);
      const dsets = DIFFS.map(([name,,color]) => ({ label:name, data: keys.map(k=>map.get(k)?.[name]||0), color }));

      const barSVG = $('#cfviz-bar');
      const ro2 = new ResizeObserver(()=> stackedBar(barSVG, keys, dsets));
      ro2.observe(barSVG); stackedBar(barSVG, keys, dsets);

      // 9 桶
      renderBuckets($('#cfviz-buckets'), uniq);

      tip.textContent = user?.handle ? `完成渲染：@${user.handle}` : '完成渲染';
    } catch (e) {
      console.error('[cfviz] load failed:', e);
      tip.textContent = '加载失败：' + (e?.message || e);
    }
  }

  // 首次与前进/后退
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(renderAll, 0));
  } else {
    setTimeout(renderAll, 0);
  }
  window.addEventListener('popstate', () => {
    const old = document.getElementById(onceId);
    if (old) old.remove();
    renderAll();
  });
})();
