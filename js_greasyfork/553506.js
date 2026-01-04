// ==UserScript==
// @name         首页填写
// @namespace http://192.168.23.124:8765
// @version      1.9.0
// @description  UI：刷新当前值、保存默认、执行填充、显示/隐藏提醒；自动歧义改用storage；更快的稳定即早停；仅对指定项目显示提醒（红框+浮签）
// @match        http://192.168.23.124:8765/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553506/%E9%A6%96%E9%A1%B5%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/553506/%E9%A6%96%E9%A1%B5%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** ============== 标识/存储 ============== */
  const PANEL_ID  = 'tm-fill-ui-panel';
  const ICON_ID   = 'tm-fill-ui-fab';
  const LS_KEY    = 'tm_fill_defaults_v190';

  /** ============== 速度/等待参数（稳定即早停） ============== */
  const FAST_MODE = true;
  const DELAY_UNIT      = FAST_MODE ? 20 : 80;   // 小等待（ms）
  const DELAY_STEP      = FAST_MODE ? 40 : 120;  // 每 N 项插入节流（ms）
  const PANEL_WAIT_MAX  = 1500;                  // 等下拉面板最大时长（ms）
  const PANEL_WAIT_STEP = 70;                    // 面板轮询步长（ms）
  const WATCHDOG_DELAYS = FAST_MODE ? [80, 220] : [140, 360]; // 写入后复核（越小越快）

  /** ============ 待填字段清单 ============
   * by: 'contentname' | 'storage'
   * text: 下拉显示文本（默认值）
   * code: 可选，存在则优先按 code 精配（更稳）
   * fixByStorage: true -> 强制按 storage 匹配（解决 contentname 重名）
   */
  const FIELDS = [
    // 就诊信息
    { key: '入院途径',            by: 'contentname', text: '急诊', code: null },
    { key: '入院情况',            by: 'contentname', text: '急',   code: null },

    // 西医诊断符合情况
    { key: 'diag_coin_outp_inp',   by:'storage', text:'符合', code:'a23ba0c0-a78f-4a28-a70f-5b93ac89d0ff' },
    { key: 'diag_coin_outp_adtd',  by:'storage', text:'符合', code:'9fb754b5-59d4-4af9-bdf0-2aae8a7773e4' },
    { key: 'diag_coin_adta_adtd',  by:'storage', text:'符合', code:'7d7eb2d1-2742-4239-8975-f3a088ff96ab' },
    { key: 'diag_coin_clinic_polg',by:'storage', text:'未做', code:'231709ff-2a9a-491c-a74a-3da51e27c2c0' },
    { key: 'diag_coin_radia_polg', by:'storage', text:'未做', code:'f2fdb563-3bb9-4d33-9f92-a27adad2f0b1' },

    // 中医诊断符合情况 —— 强制 storage 防重名
    { key: 'diagzy_coin_outp_inp', by:'storage', text:'1-符合', code:'9dee398e-5757-4ca9-a46e-64a1128a58d0', fixByStorage:true },
    { key: 'diagzy_coin_adta_adtd',by:'storage', text:'1-符合', code:'750c526b-92cd-4db6-9585-89cd17e8647d', fixByStorage:true },

    { key: 'dialectical_nursing',  by:'storage', text:'是',   code:'51da1f8c-314e-4429-b3b3-a7adec76ae1d' },
    { key: 'dialectical',          by:'storage', text:'准确', code:'5eaef444-d459-4d22-8c57-43b69e72aea5' },
    { key: 'treatment_1',          by:'storage', text:'准确', code:'e8699fec-fc47-4ba5-833c-3998d6038d60' },
    { key: 'prescription',         by:'storage', text:'未做', code:'3b934e0d-f11d-46bb-9dfc-9a103e0e4b9f' },
    { key: 'daigzy_tr_cty',        by:'storage', text:'中西', code:'e739cd95-6c00-4ea2-b5fd-fa36ef917f73' },
    { key: 'zy_medicament',        by:'storage', text:'无',   code:'5023f696-b887-4a5a-a297-21f241bfe293' },
    { key: 'equipment',            by:'storage', text:'否',   code:'4f1d2b46-73e4-438d-9f0b-bf1ed569bdb9' },
    { key: 'technology',           by:'storage', text:'是',   code:'95cb9b87-d959-4ef8-a75c-b2770946ed09' },

    // 输血信息
    { key: 'abo_name',             by:'storage', text:'6-未查' },
    { key: 'rh_name',              by:'storage', text:'未查' },
    { key: 'liquid_reaction',      by:'storage', text:'2-无' },
    { key: 'blood_reaction',       by:'storage', text:'3-未输' },
    { key: 'hbsag',                by:'storage', text:'0-未做' },
    { key: 'hcv_ab',               by:'storage', text:'0-未做' },
    { key: 'hiv_ab',               by:'storage', text:'0-未做' },
    { key: 'blood_check',          by:'storage', text:'2-否' },

    // 临床路径新增
    { key: 'clinical_pathway_ss',  by:'storage', text:'3-否' },

    // 签名信息
    { key: 'dept_chfpscn_sig',     by:'storage', text:'刘波廷' },
    { key: 'accpscn_sig',          by:'storage', text:'刘波廷' },
    { key: 'atdpscn_sig',          by:'storage', text:'樊佳思' },
    { key: 'rsdpscn_sig',          by:'storage', text:'孙俊'   },
    { key: 'pnurs_sig',            by:'storage', text:'王巧'   },
    { key: 'mr_quality_name',      by:'storage', text:'1-甲'   },
    { key: 'qctrldr_sig',          by:'storage', text:'樊佳思' },
    { key: 'qctrlnurs_sig',        by:'storage', text:'王巧'   },
  ];

  /** ============ 提醒（仅你指定的项目） ============ */
  const REMINDERS = [
    { key: 'diag_name',           by:'storage', text:'中毒损伤请填写' },
    { key: 'diagzy_syndrome',     by:'storage', text:'注意：需有编码' },
    { key: 'prescription',        by:'storage', text:'查医嘱是否有中药' },
    { key: 'algc_hist_sign',      by:'storage', text:'查病历是否有过敏史' },
    { key: 'blood_reaction',      by:'storage', text:'查病历是否有输血' },
    { key: 'qltctrl_date',        by:'storage', text:'填写出院当天' },
    { key: 'no_operation_record', by:'storage', text:'查手术记录/中医操作' },
    { key: 'reproductive_status', by:'storage', text:'请核对生育史' },
    { key: 'breath_mach_hours',   by:'storage', text:'查医嘱' },
    { key: 'addr_desc',           by:'storage', text:'地址需精确到门牌号' },
    { key: 'rh_name',           by:'storage', text:'查检验结果' },
    { key: 'hbsag',           by:'storage', text:'查检验结果' },
  ];

  /** ============== 工具函数 ============== */
  const norm  = s => String(s||'').replace(/\s+/g,' ').trim();
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const $     = (sel, root=document)=> root.querySelector(sel);
  const $$    = (sel, root=document)=> Array.from(root.querySelectorAll(sel));

  function getAllDocs(root=document){
    const docs=[root], q=[root];
    while(q.length){
      const d=q.shift();
      d.querySelectorAll('iframe').forEach(f=>{
        try{
          const id=f.contentDocument||f.contentWindow?.document;
          if(id && id.documentElement && !docs.includes(id)){ docs.push(id); q.push(id); }
        }catch{/* 跨域忽略 */}
      });
    }
    return docs;
  }

  function readNow(el){
    const display = el.getAttribute('data-oldshowvalue') || el.value || '';
    const dval    = el.getAttribute('data-value') || el.getAttribute('data-oldvalue') || '';
    return { display: norm(display), dval: String(dval||'') };
  }

  async function openDropdown(el){
    const click = target => ['pointerdown','mousedown','pointerup','mouseup','click']
      .forEach(type => { try{ target.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,view:target.ownerDocument?.defaultView||window})) }catch{} });
    try{ el.focus?.(); }catch{}
    try{ (typeof el.select==='function' ? el.select : window.select)?.(); }catch{}
    click(el);
    [el.nextElementSibling, el.parentElement?.querySelector?.('.zlSelectBtn,.dropdown-toggle,.el-select__caret,.ant-select-selector')]
      .forEach(n=> n && n!==el && click(n));
    await sleep(DELAY_UNIT*3);
  }

  function getPanels(el){
    const out = [];
    const byId = el.getAttribute('zlselectid');
    if (byId){
      const n1 = document.getElementById(byId);
      const n2 = $('#'+CSS.escape(byId));
      if (n1 && !out.includes(n1)) out.push(n1);
      if (n2 && !out.includes(n2)) out.push(n2);
    }
    const sel = '.zl-select-panel, .zlSelectPanel, .dropdown-menu.show, .dropdown-menu, .select-dropdown, .el-select-dropdown, .ant-select-dropdown, [role="listbox"]';
    document.querySelectorAll(sel).forEach(n=>out.push(n));
    getAllDocs().slice(1).forEach(d=>{
      try{ d.querySelectorAll(sel).forEach(n=> out.push(n)); }catch{}
    });
    return Array.from(new Set(out)).filter(n=>n && n.isConnected);
  }
  async function waitPanel(el, timeout=PANEL_WAIT_MAX, step=PANEL_WAIT_STEP){
    const t0 = performance.now();
    let p = getPanels(el);
    while(!p.length && performance.now()-t0 < timeout){
      await sleep(step);
      p = getPanels(el);
    }
    return p;
  }

  function pickInPanel(panel, wantText, wantCode){
    const all = panel.querySelectorAll('[data-id],[data-value],[role="option"],li,.option,.el-select-dropdown__item,.ant-select-item');
    if (wantCode){
      for(const n of all){
        const did = n.getAttribute('data-id') || n.getAttribute('data-value') || '';
        if(String(did) === String(wantCode)) return n;
      }
    }
    const t = norm(wantText||'');
    for(const n of all){ const txt = norm(n.innerText||n.textContent||''); if(txt === t) return n; }
    for(const n of all){ const txt = norm(n.innerText||n.textContent||''); if(t && txt.includes(t)) return n; }
    return null;
  }

  function dispatchChain(el){
    try{ el.dispatchEvent(new InputEvent('input',{bubbles:true,composed:true})) }
    catch{ el.dispatchEvent(new Event('input',{bubbles:true})) }
    el.dispatchEvent(new Event('change',{bubbles:true}));
    try{ el.blur?.(); }catch{}
  }

  function forceWrite(el, shown, code){
    if (!el.value) el.value = shown;
    el.setAttribute('data-value', code||'');
    el.setAttribute('data-oldvalue', code||'');
    el.setAttribute('data-oldshowvalue', shown||'');
    const storage = el.getAttribute('data-storage') || '';
    if (storage){
      const root = el.closest('.form,.content,.modal,body') || document.body;
      root.querySelectorAll('input[type="hidden"],textarea[type="hidden"]').forEach(h=>{
        const hs = h.getAttribute('data-storage') || '';
        const hn = h.getAttribute('name') || '';
        if (hs===storage || hn===storage){
          h.value = code || shown || '';
          h.setAttribute('data-value', code||'');
          h.setAttribute('data-oldvalue', code||'');
          h.setAttribute('data-oldshowvalue', shown||'');
          dispatchChain(h);
        }
      });
    }
    dispatchChain(el);
  }

  async function watchdog(el, shown, code){
    for (const d of WATCHDOG_DELAYS){
      await sleep(d);
      const ok = (el.value||'') && (el.getAttribute('data-value')||'');
      if (ok) break;
      forceWrite(el, shown, code);
    }
  }

  function findElement(item, doc=document){
    const { by, key, fixByStorage } = item;
    if (fixByStorage || by === 'storage'){
      return doc.querySelector(`[data-storage="${CSS.escape(key)}"]`);
    }
    let el = doc.querySelector(`[data-contentname="${CSS.escape(key)}"]`);
    if (el) return el;
    el = Array.from(doc.querySelectorAll('[data-contentname]')).find(n => {
      const cn = n.getAttribute('data-contentname') || '';
      return cn.includes(key);
    });
    if (el) return el;
    return doc.querySelector('.zlSelectItem.enterable,[data-contentname],[data-storage]');
  }

  // 自动歧义修正：若发现“门诊与出院/入院与出院”重名，强制改用 storage
  function resolveAmbiguity(){
    const suspects = ['门诊与出院','入院与出院'];
    let changed = false;
    suspects.forEach(name=>{
      const nodes = $$(`[data-contentname="${CSS.escape(name)}"]`);
      if (nodes.length > 1) changed = true;
    });
    if (changed){
      FIELDS.forEach(it=>{
        if (it.key==='diagzy_coin_outp_inp' || it.key==='diagzy_coin_adta_adtd'){
          it.fixByStorage = true; it.by = 'storage';
        }
      });
      console.warn('[tm] contentname 有重名，已切换中医诊断两项到 storage 匹配。');
    }
  }

  async function fillOne(item){
    const docs = getAllDocs();
    for (const d of docs){
      const el = findElement(item, d);
      if (!el) continue;

      const desiredText = item.text||'';
      const desiredCode = item.code||'';
      const now = readNow(el);
      if (now.display === norm(desiredText) || (desiredCode && now.dval === String(desiredCode))){
        return { status:'skip', el, now };
      }

      await openDropdown(el);
      let panels = await waitPanel(el);
      if (!panels.length){ await openDropdown(el); panels = await waitPanel(el, 600, PANEL_WAIT_STEP); }

      let picked=null;
      for (const p of panels){
        picked = pickInPanel(p, desiredText, desiredCode);
        if (picked){
          ['pointerdown','mousedown','pointerup','mouseup','click'].forEach(type=>{
            try{ picked.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,view:p.ownerDocument?.defaultView||window})) }catch{}
          });
          await sleep(DELAY_UNIT*2);
          break;
        }
      }

      const shown = el.value || (picked ? norm(picked.innerText||picked.textContent||'') : desiredText);
      const code  = el.getAttribute('data-value')
                   || picked?.getAttribute('data-id')
                   || picked?.getAttribute('data-value')
                   || desiredCode || '';

      forceWrite(el, shown, code);
      await watchdog(el, shown, code);

      return { status:'filled', el, now: readNow(el) };
    }
    return { status:'notfound' };
  }

  /** ============== 提醒（红框+浮签） ============== */
  const HL_ATTR='data-tm-hl';
  let REMINDER_ON = false;

  function toggleAllReminders(forceState=null){
    const want = (forceState==null) ? !REMINDER_ON : !!forceState;
    const docs=getAllDocs();

    REMINDERS.forEach(rem=>{
      for (const d of docs){
        const el = (rem.by==='storage') ? d.querySelector(`[data-storage="${CSS.escape(rem.key)}"]`)
                                         : d.querySelector(`[data-contentname="${CSS.escape(rem.key)}"]`);
        if (!el) continue;
        const wrap = getHighlightTarget(el);
        if (want){
          addHighlight(wrap);
          addTip(wrap, rem.key, rem.text);
        } else {
          removeHighlight(wrap);
          const tip = wrap.parentElement?.querySelector?.(`.tm-tip[data-k="${CSS.escape(rem.key)}"]`);
          tip && tip.remove();
        }
        break;
      }
    });

    REMINDER_ON = want;
    toast(want ? '已显示提醒' : '已隐藏提醒');
    const btn = $('#tm-btn-remind'); if (btn) btn.textContent = want ? '隐藏提醒' : '显示提醒';
  }

  function getHighlightTarget(inp){
    const label = inp.closest?.('label'); if (label) return label;
    const sib = inp.nextElementSibling; if (sib && /^(SPAN|I|EM|B|STRONG|FONT|P|DIV)$/.test(sib.tagName)) return sib;
    return inp;
  }
  function addHighlight(el){
    if (el.getAttribute(HL_ATTR)) return;
    el.setAttribute(HL_ATTR,'1');
    el.dataset.prevOutline = el.style.outline||'';
    el.dataset.prevOffset  = el.style.outlineOffset||'';
    el.style.outline='2px solid #ef4444';
    el.style.outlineOffset='2px';
  }
  function removeHighlight(el){
    if (!el.getAttribute(HL_ATTR)) return;
    el.style.outline = el.dataset.prevOutline||'';
    el.style.outlineOffset = el.dataset.prevOffset||'';
    el.removeAttribute(HL_ATTR);
    delete el.dataset.prevOutline; delete el.dataset.prevOffset;
  }
  function addTip(el, key, text){
    const tip=document.createElement('div');
    tip.className='tm-tip'; tip.setAttribute('data-k', key);
    tip.textContent = text || '';
    Object.assign(tip.style,{
      position:'absolute', transform:'translateY(-100%)', background:'#fde68a', color:'#111',
      padding:'4px 6px', border:'1px solid #eab308', borderRadius:'6px', fontSize:'12px', zIndex:2147483647
    });
    const host = el.parentElement || document.body;
    if (getComputedStyle(host).position==='static') host.style.position='relative';
    host.appendChild(tip);
    const r = el.getBoundingClientRect();
    const hr = host.getBoundingClientRect();
    tip.style.left = (r.left - hr.left) + 'px';
    tip.style.top  = (r.top  - hr.top - 6) + 'px';
  }

  /** ============== UI：FAB + 面板 ============== */
  function createIcon(){
    if ($( '#'+ICON_ID )) return;
    const fab = document.createElement('div');
    fab.id = ICON_ID;
    fab.textContent = '🧩';
    Object.assign(fab.style,{
      position:'fixed', right:'18px', bottom:'18px', width:'44px', height:'44px',
      background:'#2563eb', color:'#fff', borderRadius:'50%', display:'flex',
      alignItems:'center', justifyContent:'center', cursor:'pointer',
      boxShadow:'0 6px 16px rgba(0,0,0,.25)', zIndex: 2147483646, userSelect:'none',
      fontSize:'22px'
    });
    // 可拖拽
    let drag=false, sx=0, sy=0, sr=18, sb=18;
    fab.addEventListener('mousedown',e=>{
      drag=true; sx=e.clientX; sy=e.clientY;
      sr=parseInt(fab.style.right,10); sb=parseInt(fab.style.bottom,10); e.preventDefault();
    });
    window.addEventListener('mousemove',e=>{
      if(!drag) return;
      const dx=e.clientX-sx, dy=e.clientY-sy;
      fab.style.right = (sr - dx) + 'px';
      fab.style.bottom= (sb - dy) + 'px';
    });
    window.addEventListener('mouseup',()=>drag=false);

    fab.addEventListener('click',()=>{ const p = $('#'+PANEL_ID); if(p) p.style.display = (p.style.display==='none'?'block':'none'); });
    document.documentElement.appendChild(fab);
  }

  function loadDefaults(){
    try{ const raw=localStorage.getItem(LS_KEY); if(raw){ const parsed=JSON.parse(raw); return parsed; } }catch{}
    const map={}; FIELDS.forEach(it=> map[it.key]=it.text||''); return map;
  }
  function saveDefaults(map){ try{ localStorage.setItem(LS_KEY, JSON.stringify(map)); }catch{} }

  function readCurrentValue(item){
    const docs=getAllDocs();
    for (const d of docs){
      const el = findElement(item, d);
      if (el) return readNow(el).display;
    }
    return '';
  }

  function createPanel(){
    if ($('#'+PANEL_ID)) return $('#'+PANEL_ID);
    const wrap = document.createElement('div');
    wrap.id = PANEL_ID;
    Object.assign(wrap.style,{
      position:'fixed', right:'18px', bottom:'78px', width:'680px', maxHeight:'70vh', overflow:'auto',
      background:'#ffffff', border:'1px solid #ddd', borderRadius:'10px',
      boxShadow:'0 12px 28px rgba(0,0,0,.22)', zIndex: 2147483647, fontFamily:'-apple-system,Segoe UI,Roboto,PingFang SC,Microsoft Yahei,Arial,sans-serif',
      display:'none'
    });

    const header = document.createElement('div');
    header.textContent='表单自动填充';
    Object.assign(header.style,{padding:'10px 12px',fontWeight:'600',borderBottom:'1px solid #eee'});

    const toolbar = document.createElement('div');
    Object.assign(toolbar.style,{display:'flex',gap:'8px',padding:'8px 10px',borderBottom:'1px solid #f2f2f2',alignItems:'center'});
    const btnRefresh = mkBtn('刷新当前值', refreshTableBody);
    const btnSave    = mkBtn('保存默认', ()=> { saveDefaults(readDefaultsFromUI()); toast('已保存默认值'); });
    const btnExec    = mkBtn('执行填充', async ()=>{ await runAll(); refreshTableBody(); });
    const btnRemind  = mkBtn('显示提醒', ()=> toggleAllReminders());
    btnRemind.id = 'tm-btn-remind';
    toolbar.append(btnRefresh, btnSave, btnExec, btnRemind);

    const tbl = document.createElement('table');
    Object.assign(tbl.style,{width:'100%',borderCollapse:'collapse',fontSize:'12px'});
    tbl.innerHTML = `
      <thead>
        <tr style="background:#fafafa">
          <th style="text-align:left;padding:8px;border-bottom:1px solid #eee;width:220px;">Key</th>
          <th style="text-align:left;padding:8px;border-bottom:1px solid #eee;">默认值（可改）</th>
          <th style="text-align:left;padding:8px;border-bottom:1px solid #eee;">当前值</th>
        </tr>
      </thead>
      <tbody id="tm-body"></tbody>
    `;

    wrap.append(header, toolbar, tbl);
    document.documentElement.appendChild(wrap);
    refreshTableBody();
    return wrap;

    function mkBtn(t,fn){ const b=document.createElement('button'); b.textContent=t; Object.assign(b.style,{padding:'6px 10px',cursor:'pointer'}); b.addEventListener('click',fn); return b; }
  }

  function refreshTableBody(){
    const body = $('#tm-body'); if(!body) return;
    body.innerHTML='';
    const defaults = loadDefaults();

    FIELDS.forEach(item=>{
      const tr=document.createElement('tr');
      tr.innerHTML = `
        <td style="padding:6px 8px;border-bottom:1px solid #f2f2f2;">
          <div>${item.key}</div>
          <div style="color:#888;font-size:11px;">by: ${(item.fixByStorage||item.by==='storage')?'storage':'contentname'}${item.code?` · code:${item.code}`:''}</div>
        </td>
        <td style="padding:6px 8px;border-bottom:1px solid #f2f2f2;">
          <input data-k="${item.key}" class="tm-def" value="${defaults[item.key] ?? (item.text||'')}" style="width:100%;box-sizing:border-box;">
        </td>
        <td style="padding:6px 8px;border-bottom:1px solid #f2f2f2;">
          <span class="tm-current">${norm(readCurrentValue(item))}</span>
        </td>
      `;
      body.appendChild(tr);
    });
  }

  function readDefaultsFromUI(){
    const map = loadDefaults();
    $$('.tm-def').forEach(inp=> map[inp.getAttribute('data-k')] = inp.value);
    return map;
  }

  function toast(msg, dur=1500){
    const div=document.createElement('div');
    div.textContent=msg;
    Object.assign(div.style,{
      position:'fixed',left:'50%',top:'12%',transform:'translateX(-50%)',
      background:'rgba(0,0,0,.75)',color:'#fff',padding:'8px 12px',borderRadius:'6px',
      zIndex:2147483647,fontSize:'12px'
    });
    document.documentElement.appendChild(div);
    setTimeout(()=>div.remove(), dur);
  }

  /** ============== 执行器 ============== */
  async function runAll(){
    resolveAmbiguity();

    const defaults = loadDefaults();
    let i=0;
    for (const item of FIELDS){
      item.text = defaults[item.key] ?? item.text ?? '';
      const res = await fillOne(item);
      i++;
      if (i % 6 === 0) await sleep(DELAY_STEP);
      console.log('[tm] fill', item.key, res.status, res.now||'');
    }
    toast('执行完成');
  }

  /** ============== 启动 ============== */
  createIcon();   // 右下🧩（可拖动、点击显示/隐藏面板）
  createPanel();  // 面板默认隐藏

  console.log('[tm] UI/刷新/提醒开关/执行 已就绪。点击右下🧩打开。');
})();