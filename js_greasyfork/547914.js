// ==UserScript==
// @name         Vim Style Navigation (with Settings + Enhanced)
// @name:zh-CN   Vim风格导航（带设置＋增强模块）
// @namespace    https://www.bianwenbo.com/
// @version      2.2.0
// @author       Wenbo Bian
// @license      MIT
// @description  Vim-style scrolling + hint(f/F), find(/ n/N), history(H/L), page ops(r t x*), misc(yy p o ?). UserScript-safe fallbacks.
// @description:zh-CN  在网页中提供 Vim 风格操作：滚动（hjkl / d u / gg G）、链接提示（f/F）、查找（/ n/N）、历史（H/L）、页面操作（r t x*）、杂项（yy p o ?）。已针对 UserScript 权限做安全降级。
// @match        http://*/*
// @match        https://*/*
// @noframes
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/547914/Vim%20Style%20Navigation%20%28with%20Settings%20%2B%20Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547914/Vim%20Style%20Navigation%20%28with%20Settings%20%2B%20Enhanced%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** =======================
   *  默认配置
   *  ======================= */
  const DEFAULTS = {
    baseStep: 100,
    extraPage: 300,
    ggIntervalMs: 600,
    useNativeSmooth: true,
    ignoreWithModifier: true,
    excludeSites: [
      'https://docs.google.com/',
      'https://mail.google.com/',
      /.*\.notion\.site\/.*/,
      'https://www.notion.so/',
      'https://www.figma.com/'
    ],
    hintChars: 'asdfghjklqwertyuiop',
    hintMaxLetters: 3,
    hintMinClickableSize: 10,
    hintZIndex: 2147483646,
    findBarHeight: 32,
    findBarOpacity: 0.96,
    helpWidth: 520,
    helpOpacity: 0.96,
  };

  /** =======================
   *  配置持久化
   *  ======================= */
  function loadConfig() {
    const raw = GM_getValue('vimnav_config_v2', null);
    if (!raw) return structuredClone(DEFAULTS);
    const cfg = JSON.parse(raw);
    cfg.excludeSites = (cfg.excludeSites || []).map(item => {
      if (item && item.__type === 'RegExp') return new RegExp(item.source, item.flags || '');
      return item;
    });
    return { ...structuredClone(DEFAULTS), ...cfg };
  }
  function saveConfig(cfg) {
    const st = structuredClone(cfg);
    st.excludeSites = st.excludeSites.map(p => p instanceof RegExp ? ({ __type:'RegExp', source:p.source, flags:p.flags||''}) : p);
    GM_setValue('vimnav_config_v2', JSON.stringify(st));
  }
  let CONFIG = loadConfig();

  /** =======================
   *  菜单（可视化设置）
   *  ======================= */
  registerMenu();
  function registerMenu() {
    GM_registerMenuCommand(`步长 baseStep（${CONFIG.baseStep}）`, () => editInt('基础步长（>=1）', 'baseStep', 1));
    GM_registerMenuCommand(`d/u 额外翻页 extraPage（${CONFIG.extraPage}）`, () => editInt('额外翻页量（>=0）', 'extraPage', 0));
    GM_registerMenuCommand(`gg 时间窗 ms（${CONFIG.ggIntervalMs}）`, () => editInt('双击 g 时间窗（>=100ms）', 'ggIntervalMs', 100));
    GM_registerMenuCommand(`切换 原生平滑（${CONFIG.useNativeSmooth?'开':'关'}）`, () => toggle('useNativeSmooth'));
    GM_registerMenuCommand(`切换 忽略Ctrl/Alt/Meta（${CONFIG.ignoreWithModifier?'开':'关'}）`, () => toggle('ignoreWithModifier'));
    GM_registerMenuCommand(`排除站点 管理`, manageExcludeSites);
    GM_registerMenuCommand(`Hint 字符集（${CONFIG.hintChars}）`, () => editString('输入 Hint 标签字符集（不重复字符）', 'hintChars'));
    GM_registerMenuCommand(`Hint 标签最大长度（${CONFIG.hintMaxLetters}）`, () => editInt('Hint 标签最大长度（1-4）', 'hintMaxLetters', 1, 4));
    GM_registerMenuCommand(`恢复默认配置`, () => { if (confirm('确认恢复默认？')) { CONFIG = structuredClone(DEFAULTS); saveConfig(CONFIG); alert('OK'); } });
  }
  function editInt(msg, key, min=Number.MIN_SAFE_INTEGER, max=Number.MAX_SAFE_INTEGER) {
    const v = prompt(msg, String(CONFIG[key]));
    if (v===null) return;
    const n = parseInt(v,10);
    if (!Number.isFinite(n) || n<min || n>max) return alert('无效数值');
    CONFIG[key]=n; saveConfig(CONFIG); alert('已保存');
  }
  function editString(msg, key) {
    const v = prompt(msg, String(CONFIG[key]||''));
    if (v===null) return;
    CONFIG[key]=v; saveConfig(CONFIG); alert('已保存');
  }
  function toggle(key) { CONFIG[key]=!CONFIG[key]; saveConfig(CONFIG); alert(`${key} = ${CONFIG[key]}`); }
  function manageExcludeSites() {
    const list = CONFIG.excludeSites.map((p,i)=>`${i}. ${p instanceof RegExp?`/${p.source}/${p.flags||''}`:p}`).join('\n') || '(空)';
    const act = prompt('排除站点：\n'+list+'\n\n指令：add / del <idx> / clear / done', 'add');
    if (act===null) return;
    const [cmd,arg] = act.trim().split(/\s+/);
    if (cmd==='add') {
      const s = prompt('输入前缀或正则（如 /.*\\.notion\\.site\\// ）');
      if (!s) return;
      const pat = parsePattern(s.trim());
      if (!pat) return alert('格式无效');
      CONFIG.excludeSites.push(pat); saveConfig(CONFIG); alert('已添加');
    } else if (cmd==='del') {
      const i = parseInt(arg,10);
      if (!Number.isFinite(i) || i<0 || i>=CONFIG.excludeSites.length) return alert('索引无效');
      CONFIG.excludeSites.splice(i,1); saveConfig(CONFIG); alert('已删除');
    } else if (cmd==='clear') {
      if (!confirm('确认清空？')) return; CONFIG.excludeSites=[]; saveConfig(CONFIG); alert('已清空');
    }
  }
  function parsePattern(s){
    if (s.startsWith('/') && s.lastIndexOf('/')>0){
      const last=s.lastIndexOf('/'); const pattern=s.slice(1,last); const flags=s.slice(last+1);
      try{return new RegExp(pattern,flags);}catch{ return null;}
    }
    return s; // 字符串前缀
  }

  /** =======================
   *  站点排除
   *  ======================= */
  if (isExcluded(location.href, CONFIG.excludeSites)) return;
  function isExcluded(url, patterns){
    try{ return patterns.some(p=> typeof p==='string'? url.startsWith(p) : p instanceof RegExp? p.test(url) : false ); }catch{ return false; }
  }

  /** =======================
   *  工具函数
   *  ======================= */
  const SA = CONFIG.baseStep, EXTRA = CONFIG.extraPage, GG_MS = CONFIG.ggIntervalMs;
  let lastGTime = 0;
  let hintMode = null;  // {active, nodes, labelMap, filter, newTab}
  let findState = { active:false, term:'', bar:null, input:null, countSpan:null };
  let helpOverlay = null;

  function scrollingEl() { return document.scrollingElement || document.documentElement || document.body; }
  function getScrollTop() { return scrollingEl().scrollTop; }
  function getScrollHeight(){ return scrollingEl().scrollHeight; }
  function isEditable(t){ if(!t) return false; const tag=t.tagName; if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT') return true; if(t.isContentEditable) return true; if (document.designMode && document.designMode.toLowerCase()==='on') return true; return false; }

  function smoothScrollTo(position){
    const el=scrollingEl();
    if (CONFIG.useNativeSmooth){
      try{ el.scrollTo({top:position,left:0,behavior:'smooth'}); return; }catch{}
    }
    if (!window.requestAnimationFrame){ window.requestAnimationFrame = cb=>setTimeout(cb,17); }
    let current=el.scrollTop;
    (function step(){
      const d=position-current; current=current+d/5;
      if (Math.abs(d)<1){ el.scrollTo(0,position); }
      else { el.scrollTo(0,current); requestAnimationFrame(step); }
    })();
  }
  function smoothScrollBy(deltaY){ smoothScrollTo(getScrollTop()+deltaY); }
  function toTop(){ smoothScrollTo(0); }
  function toBottom(){ smoothScrollTo(getScrollHeight()); }

  function openInNewTab(url){ try{ GM_openInTab ? GM_openInTab(url, {active:false}) : window.open(url,'_blank'); }catch{ window.open(url,'_blank'); } }
  function copyToClipboard(text){
    try{ if (typeof GM_setClipboard==='function'){ GM_setClipboard(text); return true; } }catch{}
    if (navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).catch(()=>{}); return true; }
    return false;
  }
  async function readFromClipboard(){
    if (navigator.clipboard && navigator.clipboard.readText){
      try{ const t=await navigator.clipboard.readText(); return t||''; }catch{}
    }
    const t=prompt('无法直接读取剪贴板，请粘贴要打开的 URL：','');
    return t||'';
  }
  function isLikelyUrl(s){
    try{ new URL(s); return true; }catch{}
    if (/^[a-z]+:\/\/\S+/i.test(s)) return true;
    if (/^[\w.-]+\.[a-z]{2,}([/:?#].*)?$/i.test(s)) return true;
    return false;
  }

  /** =======================
   *  1) 链接提示（f/F）
   *  ======================= */
  function enterHintMode(newTab){
    if (hintMode && hintMode.active) return;
    hintMode = { active:true, nodes:[], labelMap:new Map(), filter:'', newTab: !!newTab };
    const layer = document.createElement('div');
    layer.id='__vimnav_hint_layer__';
    Object.assign(layer.style, { position:'fixed', inset:'0', zIndex:String(CONFIG.hintZIndex), pointerEvents:'none' });
    document.documentElement.appendChild(layer);

    const clickable = collectClickable();
    const labels = assignLabels(clickable.length, CONFIG.hintChars, CONFIG.hintMaxLetters);
    clickable.forEach((node, i)=>{
      const rect = node.getBoundingClientRect();
      if (rect.width<CONFIG.hintMinClickableSize && rect.height<CONFIG.hintMinClickableSize) return;
      const tag = renderHintTag(labels[i], rect);
      layer.appendChild(tag);
      hintMode.nodes.push({ node, label: labels[i], tag });
      hintMode.labelMap.set(labels[i], node);
    });

    if (hintMode.nodes.length===0){ exitHintMode(); return; }
  }
  function exitHintMode(){
    const layer=document.getElementById('__vimnav_hint_layer__');
    if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
    hintMode = null;
  }
  function collectClickable(){
    const sel = [
      'a[href]',
      'button',
      'summary',
      '[role="button"]',
      '[onclick]',
      'input[type="submit"]',
      'input[type="button"]',
      'input[type="image"]',
      'area[href]'
    ].join(',');
    const nodes = Array.from(document.querySelectorAll(sel)).filter(el=>{
      const r=el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const visible = r.width>0 && r.height>0 && style.visibility!=='hidden' && style.opacity!=='0';
      return visible;
    });
    return Array.from(new Set(nodes));
  }
  function assignLabels(n, chars, maxLen){
    const res=[];
    const base = chars.length;
    let length = 1;
    let capacity = base;
    while (capacity<n && length<maxLen){ length++; capacity *= base; }
    for (let i=0;i<n;i++) res.push(encodeIndex(i, base, length, chars));
    return res;
  }
  function encodeIndex(idx, base, length, chars){
    let s = '';
    for (let i=0;i<length;i++){ s = chars[idx % base] + s; idx = Math.floor(idx / base); }
    return s;
  }
  function renderHintTag(label, rect){
    const el = document.createElement('div');
    el.textContent = label;
    Object.assign(el.style, {
      position:'fixed',
      left: (Math.max(0, rect.left)+window.scrollX)+'px',
      top:  (Math.max(0, rect.top) +window.scrollY)+'px',
      font:'12px/1 monospace',
      padding:'2px 4px',
      borderRadius:'4px',
      background:'rgba(0,0,0,0.85)',
      color:'#fff',
      boxShadow:'0 1px 3px rgba(0,0,0,.3)',
      pointerEvents:'none',
      userSelect:'none'
    });
    return el;
  }
  function handleHintInput(ch){
    if (!hintMode || !hintMode.active) return;
    if (!CONFIG.hintChars.includes(ch)) return;  // 仅接受 hint 字符
    hintMode.filter += ch;
    const candidates = hintMode.nodes.filter(x=> x.label.startsWith(hintMode.filter));
    hintMode.nodes.forEach(x=>{ x.tag.style.opacity = x.label.startsWith(hintMode.filter) ? '1' : '0.15'; });
    if (candidates.length===1 && candidates[0].label===hintMode.filter){
      const target = candidates[0].node;
      const href = target.getAttribute('href');
      const click = ()=> target.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable:true, view:window}));
      if (hintMode.newTab){
        if (href) openInNewTab(new URL(href, location.href).href);
        else openInNewTab(location.href);
      } else {
        click();
      }
      exitHintMode();
    }
  }

  /** =======================
   *  2) 查找（/，n/N）
   *  ======================= */
  function toggleFindBar(show){
    if (show){
      if (findState.active) return;
      findState.active = true;
      const bar = document.createElement('div');
      Object.assign(bar.style, {
        position:'fixed', left:'50%', top:'0',
        transform:'translateX(-50%)',
        height:CONFIG.findBarHeight+'px', lineHeight:CONFIG.findBarHeight+'px',
        background:`rgba(20,20,20,${CONFIG.findBarOpacity})`,
        color:'#fff', padding:'0 8px', borderRadius:'0 0 8px 8px',
        zIndex:String(CONFIG.hintZIndex), display:'flex', gap:'8px', alignItems:'center',
        font:'13px/1 system-ui,Arial,Helvetica,sans-serif'
      });
      const label = document.createElement('span'); label.textContent='/';
      const input = document.createElement('input');
      Object.assign(input.style, { width:'320px', height:'22px', outline:'none', border:'none', borderRadius:'4px', padding:'0 6px' });
      input.placeholder='Type to search...  Enter=next  Shift+Enter=prev  Esc=close';
      const count = document.createElement('span'); count.textContent='…';
      bar.append(label, input, count);
      document.documentElement.appendChild(bar);
      findState.bar=bar; findState.input=input; findState.countSpan=count; findState.term='';
      input.addEventListener('keydown', e=>{
        if (e.key==='Enter'){ e.preventDefault(); performFind(input.value, !e.shiftKey); }
        else if (e.key==='Escape'){ e.preventDefault(); closeFindBar(); }
      });
      setTimeout(()=>input.focus(), 0);
    } else {
      closeFindBar();
    }
  }
  function closeFindBar(){
    if (!findState.active) return;
    findState.active=false;
    if (findState.bar && findState.bar.parentNode) findState.bar.parentNode.removeChild(findState.bar);
    findState={ active:false, term:'', bar:null, input:null, countSpan:null };
  }
  function performFind(term, forward=true){
    if (!term) return;
    findState.term = term;
    const found = window.find(term, false, !forward, true, false, false, false);
    if (findState.countSpan) findState.countSpan.textContent = found ? '√' : '0/0';
  }
  function findNext(){ if (!findState.term) return; window.find(findState.term, false, false, true, false, false, false); }
  function findPrev(){ if (!findState.term) return; window.find(findState.term, false, true,  true, false, false, false); }

  /** =======================
   *  6) 帮助（?）
   *  ======================= */
  function toggleHelp(show){
    if (show){
      if (helpOverlay) return;
      const box = document.createElement('div');
      Object.assign(box.style, {
        position:'fixed', left:'50%', top:'10%',
        transform:'translateX(-50%)',
        width: CONFIG.helpWidth+'px', maxWidth:'90vw',
        background:`rgba(20,20,20,${CONFIG.helpOpacity})`, color:'#fff',
        padding:'12px 16px', borderRadius:'12px', zIndex:String(CONFIG.hintZIndex),
        font:'13px/1.45 system-ui,Arial,Helvetica,sans-serif'
      });
      box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <b>Vim Style Navigation</b>
          <span style="opacity:.7">Press <kbd>?</kbd> to close</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div>
            <b>Scroll</b><br/>
            <code>j/k</code> ↓/↑ &nbsp; <code>h/l</code> ←/→<br/>
            <code>d/u</code> page ↓/↑ (base+extra)<br/>
            <code>gg</code> top &nbsp; <code>G</code> bottom
          </div>
          <div>
            <b>Hint</b><br/>
            <code>f</code> open link &nbsp; <code>F</code> open in new tab
          </div>
          <div>
            <b>Find</b><br/>
            <code>/</code> open find &nbsp; <code>n/N</code> next/prev
          </div>
          <div>
            <b>History</b><br/>
            <code>H</code> back &nbsp; <code>L</code> forward
          </div>
          <div>
            <b>Page</b><br/>
            <code>r</code> reload &nbsp; <code>t</code> new tab<br/>
            <code>x</code> close tab <i>(only if opened by script)</i><br/>
            <code>J/K</code> switch tab — <i>not available in UserScript</i>
          </div>
          <div>
            <b>Misc</b><br/>
            <code>yy</code> copy page URL<br/>
            <code>p</code> open URL from clipboard<br/>
            <code>o</code> open URL or search
          </div>
        </div>
      `;
      document.documentElement.appendChild(box);
      helpOverlay = box;
    } else {
      if (helpOverlay && helpOverlay.parentNode) helpOverlay.parentNode.removeChild(helpOverlay);
      helpOverlay = null;
    }
  }

  /** =======================
   *  键盘处理
   *  ======================= */
  window.addEventListener('keydown', onKeyDown, { capture:false });

  function onKeyDown(e){
    if (e.defaultPrevented) return;

    // Hint 模式优先
    if (hintMode && hintMode.active){
      if (e.key==='Escape'){ exitHintMode(); e.preventDefault(); return; }
      if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key.length===1){
        handleHintInput(e.key.toLowerCase());
        e.preventDefault();
        return;
      }
      return;
    }

    // 查找条激活时，交给输入框
    if (findState.active && findState.input && document.activeElement === findState.input){
      return;
    }

    const inEditable = isEditable(e.target);

    // 若开启“忽略修饰键”，带修饰键则不处理
    if (CONFIG.ignoreWithModifier && (e.ctrlKey || e.altKey || e.metaKey)) return;

    if (inEditable) return;

    const k = e.key;

    // 基础滚动与跳转
    switch (k){
      case 'h': smoothScrollBy(-SA); e.preventDefault(); return;
      case 'j': smoothScrollBy( SA); e.preventDefault(); return;
      case 'k': smoothScrollBy(-SA); e.preventDefault(); return;
      case 'l': smoothScrollBy( SA); e.preventDefault(); return;
      case 'd': smoothScrollBy( SA + EXTRA); e.preventDefault(); return;
      case 'u': smoothScrollBy(-(SA + EXTRA)); e.preventDefault(); return;
      case 'g': { const now=Date.now(); if (now - lastGTime <= GG_MS){ toTop(); lastGTime=0; e.preventDefault(); } else { lastGTime=now; } return; }
      case 'G': toBottom(); e.preventDefault(); return;
    }

    // 增强模块
    switch (k){
      // Hint
      case 'f': enterHintMode(false); e.preventDefault(); return;
      case 'F': enterHintMode(true);  e.preventDefault(); return;

      // Find
      case '/': toggleFindBar(true); e.preventDefault(); return;
      case 'n': findNext(); e.preventDefault(); return;
      case 'N': findPrev(); e.preventDefault(); return;

      // Page ops
      case 'r': location.reload(); e.preventDefault(); return;
      case 't': openInNewTab('about:blank'); e.preventDefault(); return;
      case 'x': window.close(); e.preventDefault(); return; // 仅脚本打开的标签可关

      // History
      case 'H': history.back(); e.preventDefault(); return;
      case 'L': history.forward(); e.preventDefault(); return;

      // Help
      case '?': toggleHelp(!helpOverlay); e.preventDefault(); return;

      // URL/搜索
      case 'o': {
        const s = prompt('输入 URL 或搜索词：','');
        if (s==null || !s.trim()) return;
        const text = s.trim();
        if (isLikelyUrl(text)){
          location.href = text.match(/^https?:\/\//i) ? text : ('https://' + text);
        } else {
          location.href = 'https://www.google.com/search?q=' + encodeURIComponent(text);
        }
        e.preventDefault(); return;
      }
      case 'y': break; // 交给 yy 组合
      case 'p': (async () => {
        const t = await readFromClipboard();
        if (!t) return;
        const text = t.trim();
        if (!text) return;
        if (isLikelyUrl(text)){
          location.href = text.match(/^https?:\/\//i) ? text : ('https://' + text);
        } else {
          location.href = 'https://www.google.com/search?q=' + encodeURIComponent(text);
        }
      })(); e.preventDefault(); return;
    }

    // 组合键序列（yy）
    if (k==='y'){
      if (onKeyDown.__lastY && (Date.now()-onKeyDown.__lastY)<=500){
        onKeyDown.__lastY=0;
        const ok = copyToClipboard(location.href);
        if (!ok) alert(location.href);
        e.preventDefault();
        return;
      }
      onKeyDown.__lastY = Date.now();
    } else {
      onKeyDown.__lastY = 0;
    }

    lastGTime=0;
  }

  // 失焦/点击时的清理
  window.addEventListener('blur', ()=>{ lastGTime=0; onKeyDown.__lastY=0; });
  window.addEventListener('mousedown', ()=>{ if (hintMode && hintMode.active) exitHintMode(); }, {capture:true});
})();
