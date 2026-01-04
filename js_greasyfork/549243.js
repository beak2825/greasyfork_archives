// ==UserScript==
// @name         研发云代码量统计 (v4.2: 修复弹窗闪退 + 月份卡死 + 稳健渲染)
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  快捷月份、跨页统计、趋势图(多数据集)、导出Excel(.xlsx)、后缀折算系数可编辑并保存；中文UI与工具条美化；去掉进度条与100%显示；分页兼容AJAX/整页跳转，防“闪退”。
// @author       aspire
// @match        https://devcloud.aspirecn.com/index.php?m=my&f=mycommitlog*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=10.1.6.39
// @downloadURL https://update.greasyfork.org/scripts/549243/%E7%A0%94%E5%8F%91%E4%BA%91%E4%BB%A3%E7%A0%81%E9%87%8F%E7%BB%9F%E8%AE%A1%20%28v42%3A%20%E4%BF%AE%E5%A4%8D%E5%BC%B9%E7%AA%97%E9%97%AA%E9%80%80%20%2B%20%E6%9C%88%E4%BB%BD%E5%8D%A1%E6%AD%BB%20%2B%20%E7%A8%B3%E5%81%A5%E6%B8%B2%E6%9F%93%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549243/%E7%A0%94%E5%8F%91%E4%BA%91%E4%BB%A3%E7%A0%81%E9%87%8F%E7%BB%9F%E8%AE%A1%20%28v42%3A%20%E4%BF%AE%E5%A4%8D%E5%BC%B9%E7%AA%97%E9%97%AA%E9%80%80%20%2B%20%E6%9C%88%E4%BB%BD%E5%8D%A1%E6%AD%BB%20%2B%20%E7%A8%B3%E5%81%A5%E6%B8%B2%E6%9F%93%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- ⚙️ 配置区域 ---
  const QUERY_BUTTON_SELECTOR = 'button#submit';
  const TABLE_SELECTOR = 'table.table-list';
  const PAGER_CONTAINER_SELECTOR = 'div.table-footer .pager';

  // 默认列位（仍保留；但解析更宽容）
  const DATE_COLUMN_INDEX = 2,
        SUFFIX_COLUMN_INDEX = 4,
        ADDED_COLUMN_INDEX = 6,
        DELETED_COLUMN_INDEX = 7,
        IS_VALID_COLUMN_INDEX = 8;

  const DEFAULT_CONVERSION_RATES = {
    java:1, h:1.3, m:1, mm:1, xib:1, htm:0.1, html:0.1, tpl:1, shtml:0.1, css:0.1,
    js:0.7, less:1, php:1, jsp:0.1, c:1.3, cpp:1.3, xml:0.5, sql:1, other:0.1,
    bshrc:0.3, jmx:0.5, vue:0.7, sh:1, sol:1.3, yml:1, yaml:1, go:1.2, py:1, json:0.1,
    dart:1, swift:1.3, kt:1, ts:0.7, sass:0.4, scala:1, lua:1, wpy:1, cs:1, ftl:1,
    properties:1, rb:1, scss:0.1, vm:1, nvue:0.8
  };
  const RATES_STORE_KEY = 'codeStatsRates';
  // --- 配置结束 ---

  const LOG_PREFIX = '[代码统计脚本 v4.2]:';
  const SESSION_STORAGE_KEY_DATA = 'codeStatsDataV40';
  const SESSION_STORAGE_KEY_FLAG = 'isCollectingCodeStats';
  let isProcessing = false;

  let runtime = {
    byDate: {},              // { 'YYYY-MM-DD': { commitCount, rawAdded, rawDeleted } }
    byDateSuffix: {},        // { date: { suffix: { rawAdded, rawDeleted } } }
  };

  // 折算系数
  function loadRates(){
    try{ const saved=JSON.parse(localStorage.getItem(RATES_STORE_KEY)||'{}'); return {...DEFAULT_CONVERSION_RATES, ...saved}; }
    catch{ return {...DEFAULT_CONVERSION_RATES}; }
  }
  function saveRates(newPart){
    const saved=JSON.parse(localStorage.getItem(RATES_STORE_KEY)||'{}');
    localStorage.setItem(RATES_STORE_KEY, JSON.stringify({...saved, ...newPart}));
  }
  function getRateForSuffix(suffix, rates){
    if (['shtml','html','htm','jsp'].includes(suffix)) return 0.1;
    return rates[suffix] ?? rates['other'] ?? 0.1;
  }

  // 外部库
  function loadChartJs(){
    return new Promise((res,rej)=>{ if(window.Chart) return res(); const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/chart.js'; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
  }
  function loadSheetJS(){
    return new Promise((res,rej)=>{ if(window.XLSX) return res(); const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
  }
  let chartInstance=null;

  // 小工具
  const sleep = (ms)=> new Promise(r=>setTimeout(r, ms));

  // 等待当前页面表格/分页器渲染完成（解决“本月”卡住 1/1）
  function waitForContentReady(timeout=12000){
    return new Promise(resolve=>{
      const start = Date.now();

      // 已就绪则直接返回
      const readyNow = ()=>{
        const pager=document.querySelector(PAGER_CONTAINER_SELECTOR);
        const table=document.querySelector(TABLE_SELECTOR);
        const rows = table ? table.querySelectorAll('tbody > tr').length : 0;
        const pagerOk = !!(pager && (pager.dataset.page || pager.dataset.recTotal));
        // 只要出现行 或 分页器带数据 即视为就绪
        return rows>0 || pagerOk;
      };
      if(readyNow()) return resolve();

      const obs = new MutationObserver(()=>{
        if(readyNow()){
          obs.disconnect();
          resolve();
        }else if(Date.now()-start>timeout){
          obs.disconnect();
          resolve(); // 超时也继续，避免永远卡住
        }
      });
      obs.observe(document.body, {subtree:true, childList:true, attributes:true});
    });
  }

  // 创建UI
  function createUI(){
    createModal();
    // 小样式（工具条/按钮/加载动画）
    const style = document.createElement('style');
    style.textContent = `
      .cs-toolbar{background:#fafbfc;border:1px solid #eaecef;border-radius:12px;padding:10px 12px;box-shadow:0 1px 2px rgba(0,0,0,.03);display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:12px}
      .cs-btn{border:1px solid #e0e0e0;background:#fff;border-radius:10px;padding:6px 12px;cursor:pointer;line-height:1.2}
      .cs-btn:hover{background:#f4f6f8}
      .cs-btn-primary{background:#1976d2;color:#fff;border-color:#1976d2}
      .cs-btn-primary:hover{filter:brightness(1.05)}
      .cs-chip{display:inline-block;padding:2px 8px;border-radius:999px;background:#eef2ff;color:#3f51b5;font-size:12px}
      .cs-section{border:1px solid #eee;border-radius:12px;padding:10px;margin-bottom:12px}
      .cs-flex{display:flex;align-items:center;gap:12px}
      .cs-inline{display:inline-flex;align-items:center;gap:8px}
      .cs-divider{width:1px;height:18px;background:#ddd;display:inline-block}
      .cs-spinner{width:16px;height:16px;border:2px solid #e0e0e0;border-top-color:#1976d2;border-radius:50%;animation:cs-spin 1s linear infinite}
      @keyframes cs-spin{to{transform:rotate(360deg)}}
    `;
    document.head.appendChild(style);

    const queryButton=document.querySelector(QUERY_BUTTON_SELECTOR);
    if(!queryButton) return;
    const queryButtonContainer=queryButton.closest('.row');
    if(!queryButtonContainer) return;

    // 统计按钮
    const wrapper=document.createElement('div');
    wrapper.className='col-sm-4';
    const btn=document.createElement('button');
    btn.id='start-stats-button';
    btn.className='btn';
    btn.title='统计当前手动选择日期范围内的代码量';
    btn.textContent='📊 统计（当前范围）';
    btn.style.cssText='background:#6c757d;color:#fff;border:none;padding:5px 12px;border-radius:10px;box-shadow:0 2px 4px rgba(0,0,0,.08);';
    btn.onclick=startFullStats;
    wrapper.appendChild(btn);
    queryButtonContainer.appendChild(wrapper);

    // 快捷月份
    const conditionsDiv=document.getElementById('conditions');
    if(conditionsDiv){
      const now=new Date(); let monthOptions='';
      for(let i=0;i<12;i++){ const d=new Date(now.getFullYear(), now.getMonth()-i,1); const y=d.getFullYear(); const m=d.getMonth()+1; monthOptions+=`<option value="${y}-${m}">${y}年${m}月</option>`; }
      const quick=document.createElement('div');
      quick.className='pull-right'; quick.style.display='flex'; quick.style.alignItems='center';
      quick.innerHTML=`
        <span style="font-weight:bold;margin-right:10px;">快捷月份:</span>
        <button type="button" id="stat-this-month" class="cs-btn">本月</button>
        <button type="button" id="stat-last-month" class="cs-btn">上月</button>
        <select id="stat-select-month" class="form-control" style="display:inline-block;width:120px;margin-left:10px;height:30px;padding:4px 8px;"></select>
        <button type="button" id="stat-by-selected-month" class="cs-btn cs-btn-primary">按月份统计</button>
      `;
      conditionsDiv.appendChild(quick);
      document.getElementById('stat-select-month').innerHTML=monthOptions;
      document.getElementById('stat-this-month').onclick=()=>{ const t=new Date(); startMonthlyStats(t.getFullYear(), t.getMonth()+1); };
      document.getElementById('stat-last-month').onclick=()=>{ const t=new Date(); const lm=new Date(t.getFullYear(), t.getMonth()-1,1); startMonthlyStats(lm.getFullYear(), lm.getMonth()+1); };
      document.getElementById('stat-by-selected-month').onclick=()=>{ const [y,m]=document.getElementById('stat-select-month').value.split('-').map(Number); startMonthlyStats(y,m); };
    }
  }

  // Excel导出
  async function exportExcel(sheets, fileName='CodeStats.xlsx'){
    try{ await loadSheetJS(); }catch(e){ alert('Excel 库加载失败'); return; }
    const wb=XLSX.utils.book_new();
    sheets.forEach(sh=>{ const ws=XLSX.utils.aoa_to_sheet(sh.rows); XLSX.utils.book_append_sheet(wb, ws, sh.name); });
    XLSX.writeFile(wb, fileName); // 文件名保持 ASCII，避免下载异常
  }

  // 主流程
  function startMonthlyStats(year, month){
    const s=new Date(year, month-1, 1), e=new Date(year, month, 0);
    const fmt=d=>`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    sessionStorage.setItem(SESSION_STORAGE_KEY_DATA, JSON.stringify({byDate:{}, byDateSuffix:{}}));
    sessionStorage.setItem(SESSION_STORAGE_KEY_FLAG, 'true');
    window.location.href = createLink('my','mycommitlog', `startDate=${fmt(s)}&endDate=${fmt(e)}`);
  }

  async function startFullStats(){
    if(isProcessing){ alert('正在统计，请稍候…'); return; }
    sessionStorage.setItem(SESSION_STORAGE_KEY_DATA, JSON.stringify({byDate:{}, byDateSuffix:{}}));
    sessionStorage.setItem(SESSION_STORAGE_KEY_FLAG, 'true');

    const { currentPage }=getPagerInfo();
    const statsButton=document.getElementById('start-stats-button');
    const modal=document.getElementById('stats-modal-container');

    if(currentPage===1){
      isProcessing=true;
      modal.style.display='flex';
      if(statsButton){ statsButton.textContent='统计中…'; statsButton.disabled=true; }
      await processCurrentPage();
    }else{
      modal.style.display='flex';
      updateStatus('正在前往第一页…');
      if(statsButton){ statsButton.textContent='导航中…'; statsButton.disabled=true; }
      const first=findFirstPageButton();
      if(first){
        const href = first.getAttribute('href') || first.href;
        if (href) {
          window.location.assign(href);
        } else {
          navigateWithObserver(first, () => processCurrentPage());
        }
      } else {
        alert('无法找到“首页”按钮，请手动返回第一页后重试。');
        cleanupAfterFinish();
      }
    }
  }

  function findFirstPageButton(){ const links=document.querySelectorAll(`${PAGER_CONTAINER_SELECTOR} a`); for(const a of links){ if(a.querySelector('i.icon-first-page')) return a; } return null; }
  function findNextPageButton(){ const links=document.querySelectorAll(`${PAGER_CONTAINER_SELECTOR} a`); for(const a of links){ if(a.querySelector('i.icon-angle-right')) return a; } return null; }

  // 监听 DOM 变化，兼容 AJAX/PJAX 分页
  function waitForAjaxPageTurn(oldPage, cb, timeout=8000){
    const start = Date.now();
    const pagerSel = PAGER_CONTAINER_SELECTOR;
    const tableSel = TABLE_SELECTOR;

    const obs = new MutationObserver(() => {
      const pager = document.querySelector(pagerSel);
      const table = document.querySelector(tableSel);
      const newPage = pager ? pager.dataset.page : null;
      if ((newPage && newPage !== oldPage) ||
          (table && table.querySelectorAll('tbody > tr').length)) {
        obs.disconnect();
        setTimeout(cb, 0);
      }
      if (Date.now() - start > timeout) {
        obs.disconnect();
        cb(true);
      }
    });

    obs.observe(document.body, { subtree: true, childList: true, attributes: true });
  }

  function navigateWithObserver(linkEl, afterChange){
    const pager = document.querySelector(PAGER_CONTAINER_SELECTOR);
    const oldPage = pager ? pager.dataset.page : null;

    waitForAjaxPageTurn(oldPage, (timedOut) => {
      if (timedOut) {
        const href = linkEl.getAttribute('href') || linkEl.href;
        if (href) {
          window.location.assign(href);
        } else {
          setTimeout(() => processCurrentPage(), 0);
        }
      } else {
        afterChange();
      }
    });

    linkEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  }

  function cleanupAfterFinish(){
    sessionStorage.removeItem(SESSION_STORAGE_KEY_FLAG);
    isProcessing=false;
    const statsButton=document.getElementById('start-stats-button');
    if(statsButton){ statsButton.textContent='📊 统计（当前范围）'; statsButton.disabled=false; }
  }

  // 更宽容的“有效”判断与列解析
  function rowIsValid(tds){
    const cell = tds[IS_VALID_COLUMN_INDEX];
    if(!cell) return true; // 找不到这列时默认有效（避免误过滤）
    const txt = (cell.textContent||'').trim();
    if(!txt) return true;
    if(/无效|invalid/i.test(txt)) return false;
    if(/有效|valid/i.test(txt)) return true;
    return true; // 未知内容时按有效处理
  }

  function parseIntSafe(str){
    const n=parseInt(String(str).replace(/[^\d-]/g,''),10);
    return Number.isFinite(n) ? n : 0;
  }

  function parseTableData(currentPage, byDate, byDateSuffix){
    const table=document.querySelector(TABLE_SELECTOR);
    if(!table){ console.error(LOG_PREFIX, `第 ${currentPage} 页未找到表格`); return; }
    table.querySelectorAll('tbody > tr').forEach(tr=>{
      const tds=tr.querySelectorAll('td');
      if(tds.length===0) return;
      if(!rowIsValid(tds)) return;

      // 日期：优先用默认列，否则在前几列里找 YYYY-MM-DD
      let dateStr = (tds[DATE_COLUMN_INDEX] && tds[DATE_COLUMN_INDEX].textContent.trim().split(' ')[0]) || '';
      if(!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)){
        for(let i=0;i<Math.min(5,tds.length);i++){
          const m=(tds[i].textContent||'').match(/\d{4}-\d{2}-\d{2}/);
          if(m){ dateStr=m[0]; break; }
        }
      }
      if(!dateStr) return;

      // 后缀
      let suffix = (tds[SUFFIX_COLUMN_INDEX] && tds[SUFFIX_COLUMN_INDEX].textContent.trim().toLowerCase()) || 'unknown';
      suffix = suffix || 'unknown';

      // 新增/删除
      let add = tds[ADDED_COLUMN_INDEX] ? parseIntSafe(tds[ADDED_COLUMN_INDEX].textContent) : 0;
      let del = tds[DELETED_COLUMN_INDEX] ? parseIntSafe(tds[DELETED_COLUMN_INDEX].textContent) : 0;

      if(!byDate[dateStr]) byDate[dateStr]={commitCount:0, rawAdded:0, rawDeleted:0};
      byDate[dateStr].commitCount++; byDate[dateStr].rawAdded+=add; byDate[dateStr].rawDeleted+=del;

      if(!byDateSuffix[dateStr]) byDateSuffix[dateStr]={};
      if(!byDateSuffix[dateStr][suffix]) byDateSuffix[dateStr][suffix]={rawAdded:0, rawDeleted:0};
      byDateSuffix[dateStr][suffix].rawAdded+=add; byDateSuffix[dateStr][suffix].rawDeleted+=del;
    });
  }

  // 聚合/计算
  function computeFinal(byDate, byDateSuffix, rates){
    const byDateComputed={}, bySuffixComputed={};
    for(const date of Object.keys(byDate)){
      const base=byDate[date]; let finalSum=0;
      const mp=byDateSuffix[date]||{};
      for(const [suf,vals] of Object.entries(mp)){
        const rate=getRateForSuffix(suf, rates);
        const fin=vals.rawAdded*rate + vals.rawDeleted*0.1;
        finalSum+=fin;
        if(!bySuffixComputed[suf]) bySuffixComputed[suf]={rawAdded:0, rawDeleted:0, finalLines:0};
        bySuffixComputed[suf].rawAdded+=vals.rawAdded;
        bySuffixComputed[suf].rawDeleted+=vals.rawDeleted;
        bySuffixComputed[suf].finalLines+=fin;
      }
      byDateComputed[date]={commitCount:base.commitCount, rawAdded:base.rawAdded, rawDeleted:base.rawDeleted, finalLines:finalSum};
    }
    return {byDateComputed, bySuffixComputed};
  }

  function aggregateDaySeries(byDateComputed){
    const arr=Object.entries(byDateComputed).sort((a,b)=> new Date(a[0]) - new Date(b[0]));
    return {
      labels: arr.map(e=>e[0]),
      final: arr.map(e=>Number(e[1].finalLines.toFixed(2))),
      added: arr.map(e=>e[1].rawAdded),
      deleted: arr.map(e=>e[1].rawDeleted)
    };
  }
  function aggregateMonthSeries(byDateComputed){
    const bucket={};
    for(const [date,v] of Object.entries(byDateComputed)){
      const d=new Date(date); if(isNaN(d)) continue;
      const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      bucket[key]=bucket[key]||{final:0, added:0, deleted:0};
      bucket[key].final+=v.finalLines; bucket[key].added+=v.rawAdded; bucket[key].deleted+=v.rawDeleted;
    }
    const arr=Object.entries(bucket).sort((a,b)=> a[0].localeCompare(b[0]));
    return { labels:arr.map(e=>e[0]), final:arr.map(e=>Number(e[1].final.toFixed(2))), added:arr.map(e=>e[1].added), deleted:arr.map(e=>e[1].deleted) };
  }

  // 展示
  async function displayFinalResults(){
    const modal=document.getElementById('stats-modal-container');
    if(modal) modal.style.display='flex'; // 确保可见
    const modalBody=document.getElementById('stats-modal-body'); if(!modalBody) return;

    const stored=JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY_DATA)||'{}');
    runtime.byDate=stored.byDate||{}; runtime.byDateSuffix=stored.byDateSuffix||{};

    try{ await loadChartJs(); }catch(e){ console.warn(LOG_PREFIX,'Chart.js 加载失败',e); }
    try{ await loadSheetJS(); }catch(e){ console.warn(LOG_PREFIX,'SheetJS 加载失败',e); }

    const rates=loadRates();
    const { byDateComputed, bySuffixComputed }=computeFinal(runtime.byDate, runtime.byDateSuffix, rates);
    const dates=Object.keys(byDateComputed).sort((a,b)=> new Date(b)-new Date(a));

    if(dates.length===0){
      modalBody.innerHTML='<p>未找到有效提交记录。</p>';
      return;
    }

    let totalAdded=0,totalDeleted=0,totalCommits=0,totalFinal=0;
    dates.forEach(d=>{ const v=byDateComputed[d]; totalAdded+=v.rawAdded; totalDeleted+=v.rawDeleted; totalCommits+=v.commitCount; totalFinal+=v.finalLines; });

    // 工具条
    const toolsHTML = `
      <div class="cs-toolbar">
        <span class="cs-chip">统计完成</span>
        <span style="color:#888;">可导出或调整折算系数</span>
        <span class="cs-divider"></span>
        <div class="cs-inline" style="margin-left:auto;">
          <button id="btn-export-day" class="cs-btn cs-btn-primary">导出Excel（按日）</button>
          <button id="btn-export-suffix" class="cs-btn cs-btn-primary">导出Excel（按后缀）</button>
          <button id="btn-export-trend-day" class="cs-btn">导出Excel（趋势-日）</button>
          <button id="btn-export-trend-month" class="cs-btn">导出Excel（趋势-月）</button>
          <button id="btn-toggle-rates" class="cs-btn">折算系数</button>
        </div>
      </div>

      <div class="cs-flex" style="margin:6px 0;">
        <strong>趋势视图：</strong>
        <label class="radio-inline"><input type="radio" name="trend-mode" value="day" checked> 按天</label>
        <label class="radio-inline"><input type="radio" name="trend-mode" value="month"> 按月</label>
        <span class="cs-divider"></span>
        <label class="checkbox-inline"><input type="checkbox" name="series" value="final" checked> 最终(折算)</label>
        <label class="checkbox-inline"><input type="checkbox" name="series" value="added" checked> 原始新增</label>
        <label class="checkbox-inline"><input type="checkbox" name="series" value="deleted" checked> 原始删除</label>
      </div>

      <div class="cs-section" style="height:320px;">
        <canvas id="stats-trend-canvas"></canvas>
      </div>

      <div id="rates-panel" class="cs-section" style="display:none;">
        <div class="cs-flex" style="justify-content:space-between;">
          <strong>文件后缀折算系数（保存后即时重算）</strong>
          <div class="cs-inline">
            <button id="btn-rates-save" class="cs-btn cs-btn-primary">保存</button>
            <button id="btn-rates-reset" class="cs-btn">恢复默认</button>
          </div>
        </div>
        <div id="rates-table-wrapper" style="max-height:260px;overflow:auto;margin-top:8px;"></div>
      </div>
    `;

    // 按日表
    let daily = `<table class="table table-bordered table-striped" style="margin-top:6px;width:100%;">
      <thead><tr><th>日期</th><th>提交次数</th><th>原始新增</th><th>原始删除</th><th style="background-color:#e8f5e9;">最终代码行</th></tr></thead><tbody>`;
    dates.forEach(d=>{ const v=byDateComputed[d];
      daily += `<tr><td>${d}</td><td>${v.commitCount}</td><td style="color:green;">+${v.rawAdded}</td><td style="color:red;">-${v.rawDeleted}</td><td style="font-weight:bold;background-color:#f1f8e9;">${v.finalLines.toFixed(2)}</td></tr>`;
    });
    daily += `<tr style="font-weight:bold;border-top:2px solid #1976d2;">
      <td>总计</td><td>${totalCommits}</td><td style="color:green;">+${totalAdded}</td><td style="color:red;">-${totalDeleted}</td><td style="background-color:#dcedc8;">${totalFinal.toFixed(2)}</td></tr></tbody></table>`;

    // 按后缀表
    const suffixes=Object.keys(bySuffixComputed).sort();
    let bySuffix = `<h4 style="margin-top:16px;border-bottom:1px solid #eee;padding-bottom:6px;">按文件类型汇总</h4>
      <table class="table table-bordered table-striped" style="margin-top:6px;width:100%;">
      <thead><tr><th>文件后缀</th><th>原始新增</th><th>原始删除</th><th style="background-color:#e8f5e9;">最终代码行</th></tr></thead><tbody>`;
    suffixes.forEach(s=>{ const d=bySuffixComputed[s];
      bySuffix += `<tr><td>${s}</td><td style="color:green;">+${d.rawAdded}</td><td style="color:red;">-${d.rawDeleted}</td><td style="font-weight:bold;background-color:#f1f8e9;">${d.finalLines.toFixed(2)}</td></tr>`;
    });
    bySuffix += `</tbody></table>`;

    const modalBodyHTML = toolsHTML + daily + bySuffix;
    modalBody.innerHTML = modalBodyHTML;

    // 系数面板
    renderRatesTable(rates);
    document.getElementById('btn-toggle-rates').onclick=()=>{
      const p=document.getElementById('rates-panel'); p.style.display=(p.style.display==='none'?'block':'none');
    };
    document.getElementById('btn-rates-save').onclick=()=>{
      const inputs=document.querySelectorAll('.rate-input[data-suffix]'); const update={};
      inputs.forEach(inp=>{ const suf=inp.dataset.suffix; const val=parseFloat(inp.value); if(!isNaN(val)) update[suf]=val; });
      saveRates(update);
      displayFinalResults(); // 直接重算并重绘
    };
    document.getElementById('btn-rates-reset').onclick=()=>{
      localStorage.removeItem(RATES_STORE_KEY); renderRatesTable(loadRates()); displayFinalResults();
    };

    // 趋势图
    const radios=modalBody.querySelectorAll('input[name="trend-mode"]');
    const checks=modalBody.querySelectorAll('input[name="series"]');
    const draw=(mode, show)=>{
      const { byDateComputed }=computeFinal(runtime.byDate, runtime.byDateSuffix, loadRates());
      const day=aggregateDaySeries(byDateComputed), month=aggregateMonthSeries(byDateComputed);
      renderTrendChart(mode, mode==='month'?month:day, show);
    };
    radios.forEach(r=>r.addEventListener('change',()=>{ draw(getMode(), getVisible()); }));
    checks.forEach(c=>c.addEventListener('change',()=>{ draw(getMode(), getVisible()); }));
    const getMode=()=>document.querySelector('input[name="trend-mode"]:checked').value;
    const getVisible=()=>{ const vis={final:false,added:false,deleted:false}; document.querySelectorAll('input[name="series"]').forEach(x=>vis[x.value]=x.checked); return vis; };
    draw('day',{final:true,added:true,deleted:true});

    // 导出
    document.getElementById('btn-export-day').onclick=()=>{
      const sorted=[...dates].sort((a,b)=> new Date(a)-new Date(b));
      const rows=[['Date','Commits','RawAdded','RawDeleted','FinalLines']];
      sorted.forEach(d=>{ const v=byDateComputed[d]; rows.push([d, v.commitCount, v.rawAdded, v.rawDeleted, Number(v.finalLines.toFixed(2))]); });
      rows.push(['Total', totalCommits, totalAdded, totalDeleted, Number(totalFinal.toFixed(2))]);
      exportExcel([{name:'Daily', rows}], 'CodeStats_Daily.xlsx');
    };
    document.getElementById('btn-export-suffix').onclick=()=>{
      const rows=[['Suffix','RawAdded','RawDeleted','FinalLines']];
      suffixes.forEach(s=>{ const d=bySuffixComputed[s]; rows.push([s, d.rawAdded, d.rawDeleted, Number(d.finalLines.toFixed(2))]); });
      exportExcel([{name:'BySuffix', rows}], 'CodeStats_BySuffix.xlsx');
    };
    document.getElementById('btn-export-trend-day').onclick=()=>{
      const { byDateComputed }=computeFinal(runtime.byDate, runtime.byDateSuffix, loadRates());
      const series=aggregateDaySeries(byDateComputed);
      const rows=[['Date','Final(Adjusted)','RawAdded','RawDeleted']];
      series.labels.forEach((lbl,i)=> rows.push([lbl, series.final[i], series.added[i], series.deleted[i]]));
      exportExcel([{name:'Trend_Day', rows}], 'CodeStats_TrendDay.xlsx');
    };
    document.getElementById('btn-export-trend-month').onclick=()=>{
      const { byDateComputed }=computeFinal(runtime.byDate, runtime.byDateSuffix, loadRates());
      const series=aggregateMonthSeries(byDateComputed);
      const rows=[['Month','Final(Adjusted)','RawAdded','RawDeleted']];
      series.labels.forEach((lbl,i)=> rows.push([lbl, series.final[i], series.added[i], series.deleted[i]]));
      exportExcel([{name:'Trend_Month', rows}], 'CodeStats_TrendMonth.xlsx');
    };
  }

  // 简洁的加载提示
  function updateStatus(message){
    const modalBody=document.getElementById('stats-modal-body');
    if(!modalBody) return;
    modalBody.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px 0;">
        <div class="cs-spinner"></div>
        <div style="color:#1976d2;font-weight:600;">${message}</div>
        <div style="color:#999;">请保持页面不最小化，统计完成后会自动显示结果</div>
      </div>
    `;
  }

  // 趋势图渲染
  function renderTrendChart(mode, pack, visible){
    const canvas=document.getElementById('stats-trend-canvas'); if(!canvas || !window.Chart) return;
    const ctx=canvas.getContext('2d');
    const ds=[];
    if(visible.final)   ds.push({label: mode==='month'?'每月最终(折算)':'每天最终(折算)', data:pack.final,   borderWidth:2, tension:.25, pointRadius:2});
    if(visible.added)   ds.push({label: mode==='month'?'每月原始新增'  :'每天原始新增',   data:pack.added,   borderWidth:2, tension:.25, pointRadius:2});
    if(visible.deleted) ds.push({label: mode==='month'?'每月原始删除'  :'每天原始删除',   data:pack.deleted, borderWidth:2, tension:.25, pointRadius:2});
    if(chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
      type:'line',
      data:{ labels:pack.labels, datasets:ds },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ display:true } },
        interaction:{ mode:'index', intersect:false },
        scales:{ x:{ title:{ display:true, text: mode==='month'?'月份':'日期' } }, y:{ title:{ display:true, text:'代码行数' }, beginAtZero:true } }
      }
    });
  }

  // 系数面板
  function renderRatesTable(rates){
    const wrap=document.getElementById('rates-table-wrapper'); if(!wrap) return;
    const keys=Object.keys(rates).sort();
    let html=`<table class="table table-bordered table-striped" style="width:100%;">
      <thead><tr><th>后缀</th><th>折算系数</th></tr></thead><tbody>`;
    keys.forEach(k=>{
      html += `<tr><td>${k}</td><td><input type="number" step="0.1" class="form-control rate-input" data-suffix="${k}" value="${rates[k]}"></td></tr>`;
    });
    html += `</tbody></table>
      <small style="color:#888;">提示：html/jsp/htm/shtml 始终按 0.1 计算（固定规则）。</small>`;
    wrap.innerHTML=html;
  }

  // 弹窗
  function createModal(){
    const modal=document.createElement('div');
    modal.id='stats-modal-container';
    modal.style.cssText='display:none;position:fixed;z-index:9999;left:0;top:0;width:100%;height:100%;overflow:auto;background:rgba(0,0,0,.6);align-items:center;justify-content:center;';
    modal.innerHTML=`
      <div id="stats-modal-content" style="background:#fff;margin:auto;padding:18px;border:1px solid #eaecef;border-radius:14px;width:86%;max-width:1000px;box-shadow:0 6px 18px rgba(0,0,0,.08);animation:fadeIn .25s;">
        <div id="stats-modal-header" style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #f0f0f0;padding-bottom:8px;margin-bottom:10px;">
          <h2 style="margin:0;font-size:18px;">代码量统计结果</h2>
          <span id="stats-modal-close" style="color:#999;font-size:26px;font-weight:bold;cursor:pointer;">&times;</span>
        </div>
        <div id="stats-modal-body" style="max-height:66vh;overflow-y:auto;"></div>
      </div>
    `;
    document.body.appendChild(modal);
    const styleSheet=document.createElement('style');
    styleSheet.type='text/css';
    styleSheet.innerText=`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`;
    document.head.appendChild(styleSheet);

    // 只允许点击右上角关闭；统计期间禁用关闭（防“闪退”）
    document.getElementById('stats-modal-close').onclick=()=>{ if(!isProcessing) modal.style.display='none'; };
    // 取消遮罩层点击关闭，避免因事件冒泡被瞬间关闭
    modal.onclick=(e)=>{ /* no-op：遮罩点击不再关闭 */ };
  }

  // 工具
  function getPagerInfo(){
    const pager=document.querySelector(PAGER_CONTAINER_SELECTOR);
    if(!pager) return {currentPage:1,totalPages:1};
    const total=parseInt(pager.dataset.recTotal||'0',10);
    const per=parseInt(pager.dataset.recPerPage||'100',10);
    const page=parseInt(pager.dataset.page||'1',10);
    const pages=Math.ceil(total/per);
    return { currentPage: Number.isFinite(page)?page:1, totalPages: (pages>0 && Number.isFinite(pages))?pages:1 };
  }
  function createLink(module, method, params){
    const url=new URL(window.location.href);
    url.searchParams.set('m', module); url.searchParams.set('f', method);
    if(params){ params.split('&').forEach(p=>{ const [k,v]=p.split('='); url.searchParams.set(k,v); }); }
    return url.toString();
  }

  // 分页处理
  async function processCurrentPage(){
    try{
      await waitForContentReady(); // ★ 等待页面就绪（修复卡 1/1）
      const { currentPage, totalPages }=getPagerInfo();
      updateStatus(`正在处理第 ${currentPage} / ${totalPages} 页…`);

      // 再次等待极短时间，确保 tbody 行都稳定
      await sleep(50);

      const stored=JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY_DATA)||'{}');
      const byDate=stored.byDate||{}, byDateSuffix=stored.byDateSuffix||{};
      parseTableData(currentPage, byDate, byDateSuffix);
      sessionStorage.setItem(SESSION_STORAGE_KEY_DATA, JSON.stringify({byDate, byDateSuffix}));

      const next = findNextPageButton();
      if (currentPage < totalPages && next) {
        const href = next.getAttribute('href') || next.href;
        if (href) {
          window.location.assign(href);
        } else {
          navigateWithObserver(next, () => processCurrentPage());
        }
      } else {
        displayFinalResults();
        cleanupAfterFinish();
      }
    }catch(err){
      console.error(LOG_PREFIX, err);
      updateStatus('出错了，请刷新页面后重试');
      cleanupAfterFinish();
    }
  }

  // 入口
  (function(){
    const onReady=async ()=>{
      createUI();
      if(sessionStorage.getItem(SESSION_STORAGE_KEY_FLAG)==='true'){
        document.getElementById('stats-modal-container').style.display='flex';
        isProcessing=true;
        const statsButton=document.getElementById('start-stats-button');
        if(statsButton){ statsButton.textContent='统计中…'; statsButton.disabled=true; }
        await processCurrentPage();
      }
    };
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', onReady); } else { onReady(); }
  })();

})();
