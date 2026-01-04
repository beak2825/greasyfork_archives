// ==UserScript==
// @name         Font Rendering Lite (Core + Stroke/Shadow + Site Policy)
// @namespace    https://www.bianwenbo.com
// @version      0.8.1
// @description  字体美化：中文优先字体栈；字体平滑；根字号可选缩放；描边(含粗体修正)+多向阴影；站点三态策略；默认排除清单；轻量面板；不改外链CSS。
// @author       bianwenbo
// @match        *://*/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548979/Font%20Rendering%20Lite%20%28Core%20%2B%20StrokeShadow%20%2B%20Site%20Policy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548979/Font%20Rendering%20Lite%20%28Core%20%2B%20StrokeShadow%20%2B%20Site%20Policy%29.meta.js
// ==/UserScript==




(function () {
  'use strict';

  const HOST = location.host;
  const KEY_GLOBAL = 'frLite:global';
  const KEY_SITE_PREFIX = 'frLite:site:';

  // 默认配置：已按你的习惯开启描边/阴影等
  const DEFAULTS = {
    enabled: true,
    fontFamily: `"Microsoft YaHei", "Microsoft Yahei UI", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", system-ui, -apple-system, Arial, Helvetica, sans-serif`,
    monoFamily: `ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
    smoothing: true,
    scale: 1.0,           // 仅影响 rem

    strokeEnabled: true,
    strokeWidthEm: 0.015,
    strokeColor: 'rgba(0,0,0,0.22)',
    boldAdjustEnabled: true,
    boldFactor: 0.6,

    shadowEnabled: true,
    shadowSizeEm: 0.075,
    shadowColor: '#7C7CDDCC',

    site: {
      enabled: null,
      fontFamily: null,
      monoFamily: null,
      smoothing: null,
      scale: null,
      strokeEnabled: null,
      strokeWidthEm: null,
      strokeColor: null,
      boldAdjustEnabled: null,
      boldFactor: null,
      shadowEnabled: null,
      shadowSizeEm: null,
      shadowColor: null
    }
  };

  function deepClone(o){ return JSON.parse(JSON.stringify(o)); }
  function loadConfig() {
    const g = Object.assign(deepClone(DEFAULTS), GM_getValue(KEY_GLOBAL) || {});
    const s = Object.assign(deepClone(DEFAULTS.site), GM_getValue(KEY_SITE_PREFIX + HOST) || {});
    g.site = s; return g;
  }
  function saveGlobal(partial){ GM_setValue(KEY_GLOBAL, Object.assign({}, GM_getValue(KEY_GLOBAL) || {}, partial)); }
  function saveSite(partial){ GM_setValue(KEY_SITE_PREFIX + HOST, Object.assign({}, GM_getValue(KEY_SITE_PREFIX + HOST) || {}, partial)); }
  let CFG = loadConfig();

  function eff(k){ const v = CFG.site[k]; return (v === null || v === undefined) ? CFG[k] : v; }
  function isEnabled(){
    const s = CFG.site.enabled;
    if (s === true)  return true;
    if (s === false) return false;
    return !!CFG.enabled;
  }

  const STYLE_ID = 'fr-lite-style';
  const CLASS_ENABLED = 'fr-lite-enabled';
  const CLASS_STROKE  = 'fr-lite-stroke';
  const CLASS_SHADOW  = 'fr-lite-shadow';
  const CLASS_BOLDADJ = 'fr-lite-boldadj';
  const VAR = (name) => `--frl-${name}`;
  const cssString = (v)=> (v !== null && v !== undefined) ? String(v) : '';

  function buildStyle(){
    const font = eff('fontFamily');
    const mono = eff('monoFamily');
    const smoothing = !!eff('smoothing');
    const scale = Number(eff('scale')) || 1;

    const strokeEnabled = !!eff('strokeEnabled');
    const strokeW = Number(eff('strokeWidthEm')) || 0;
    const strokeColor = cssString(eff('strokeColor')) || 'rgba(0,0,0,0.2)';
    const boldAdj = !!eff('boldAdjustEnabled');
    const boldFactor = Number(eff('boldFactor')) || 0.6;

    const shadowEnabled = !!eff('shadowEnabled');
    const shadowSize = Number(eff('shadowSizeEm')) || 0;
    const shadowColor = cssString(eff('shadowColor')) || 'rgba(0,0,0,0.2)';

    // 生成 8 向阴影字符串（附中心轻微模糊），单位使用 em
    const makeShadow = (sz, color) => {
      const s = Number(sz) || 0;
      if (s <= 0) return 'none';
      const blur = Math.max(s * 0.2, 0.01).toFixed(3);
      return `
        -${s}em -${s}em 0 ${color},
         0     -${s}em 0 ${color},
         ${s}em -${s}em 0 ${color},
         ${s}em  0     0 ${color},
         ${s}em  ${s}em 0 ${color},
         0      ${s}em 0 ${color},
        -${s}em  ${s}em 0 ${color},
        -${s}em  0     0 ${color},
         0 0 ${blur}em ${color}
      `.replace(/\s+/g,' ').trim();
    };

    return `
:root{
  ${VAR('font')}:${cssString(font)};
  ${VAR('mono')}:${cssString(mono)};
  ${VAR('scale')}:${scale};
  ${VAR('strokeW')}:${strokeW}em;
  ${VAR('strokeColor')}:${strokeColor};
  ${VAR('boldFactor')}:${boldFactor};
  ${VAR('shadowSize')}:${shadowSize}em;
  ${VAR('shadowColor')}:${shadowColor};
}

html.${CLASS_ENABLED}{
  ${smoothing?'-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;'
             :'-webkit-font-smoothing:auto;text-rendering:auto;'}
  font-size: calc(100% * var(${VAR('scale')})); /* 仅影响 rem */
}

/* 正文元素（带排除清单） */
html.${CLASS_ENABLED} body :where(
  body, main, article, section, aside, nav,
  h1,h2,h3,h4,h5,h6, p, span, a, li, dt, dd, blockquote, q,
  div, label, input, textarea, button, select, summary, details,
  table, thead, tbody, tfoot, tr, th, td, caption,
  small, strong, b, i, u, s, em, sub, sup, mark, time, code, kbd, samp
):not(
  [class*="icon" i], [class^="icon" i],
  [class*="fa-" i], .fa, .fab, .fas, .far,
  .material-icons, .iconfont,
  [class*="glyph" i], [class*="symbols" i],
  mjx-container *, .katex *,
  [class*="vjs-" i],
  .textLayer *, [class*="watermark" i],
  i[class], svg, [aria-hidden="true"]
){
  font-family:var(${VAR('font')}) !important;
}

/* 代码等宽区 */
html.${CLASS_ENABLED} pre,
html.${CLASS_ENABLED} code,
html.${CLASS_ENABLED} kbd,
html.${CLASS_ENABLED} samp{
  font-family:var(${VAR('mono')}) !important;
}

/* 表单控件 */
html.${CLASS_ENABLED} input,
html.${CLASS_ENABLED} textarea,
html.${CLASS_ENABLED} select,
html.${CLASS_ENABLED} button{
  font-family:var(${VAR('font')}) !important;
}

/* 描边 */
html.${CLASS_ENABLED}.${CLASS_STROKE} body :where(
  body, main, article, section, aside, nav,
  h1,h2,h3,h4,h5,h6, p, span, a, li, dt, dd, blockquote, q,
  div, label, input, textarea, button, select, summary, details,
  small, strong, b, i, u, s, em, sub, sup, mark, time
):not(
  [class*="icon" i], [class^="icon" i],
  [class*="fa-" i], .fa, .fab, .fas, .far,
  .material-icons, .iconfont,
  [class*="glyph" i], [class*="symbols" i],
  mjx-container *, .katex *, [class*="vjs-" i],
  .textLayer *, [class*="watermark" i],
  i[class], svg, [aria-hidden="true"],
  code, kbd, samp, pre
){
  -webkit-text-stroke: var(${VAR('strokeW')}) var(${VAR('strokeColor')});
}

/* 粗体描边修正 */
html.${CLASS_ENABLED}.${CLASS_STROKE}.${CLASS_BOLDADJ} body :where(
  strong, b, [style*="font-weight:6"], [style*="font-weight:7"], [style*="font-weight:8"], [style*="font-weight:9"]
){
  -webkit-text-stroke-width: calc(var(${VAR('strokeW')}) * var(${VAR('boldFactor')}));
}

/* 阴影 */
html.${CLASS_ENABLED}.${CLASS_SHADOW} body :where(
  body, main, article, section, aside, nav,
  h1,h2,h3,h4,h5,h6, p, span, a, li, dt, dd, blockquote, q,
  div, label, input, textarea, button, select, summary, details,
  small, i, u, s, em, sub, sup, mark, time
):not(
  [class*="icon" i], [class^="icon" i],
  [class*="fa-" i], .fa, .fab, .fas, .far,
  .material-icons, .iconfont,
  [class*="glyph" i], [class*="symbols" i],
  mjx-container *, .katex *, [class*="vjs-" i],
  .textLayer *, [class*="watermark" i],
  i[class], svg, [aria-hidden="true"],
  code, kbd, samp, pre
){
  text-shadow: ${makeShadow(eff('shadowSizeEm') || 0.075, shadowColor)};
}

/* 面板字体 */
#fr-lite-panel-root, #fr-lite-panel-root *{
  font-family:var(${VAR('font')}), system-ui, sans-serif;
}
`.trim();
  }

  function applyStyle(){
    let node = document.getElementById(STYLE_ID);
    if (!node){ node = document.createElement('style'); node.id = STYLE_ID; document.documentElement.prepend(node); }
    node.textContent = buildStyle();

    const html = document.documentElement;
    html.classList.toggle(CLASS_ENABLED, isEnabled());
    html.classList.toggle(CLASS_STROKE, !!eff('strokeEnabled'));
    html.classList.toggle(CLASS_SHADOW, !!eff('shadowEnabled'));
    html.classList.toggle(CLASS_BOLDADJ, !!eff('boldAdjustEnabled'));
  }

  /* ===== 面板（与之前一致，略有字段增补） ===== */
  const UI_ID = 'fr-lite-panel-root';
  let panelOpen = false;

  function openPanel(){
    if (panelOpen) return;
    panelOpen = true;

    const host = document.createElement('div');
    host.id = UI_ID;
    Object.assign(host.style, { position:'fixed', zIndex:2147483647, inset:'auto 16px 16px auto', width:'360px', borderRadius:'12px', overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,.18)' });
    const root = host.attachShadow({ mode:'open' });
    root.innerHTML = `
      <style>
        :host{ all:initial }
        .card{ background:#fff; color:#111; border:1px solid #e5e7eb }
        .hd{ padding:10px 12px; font-weight:600; background:#f8fafc; border-bottom:1px solid #e5e7eb; display:flex; align-items:center; justify-content:space-between }
        .bd{ padding:12px; display:grid; gap:10px }
        label{ display:grid; gap:6px; font-size:12px }
        input[type="text"], input[type="number"], select{ padding:8px; border:1px solid #e5e7eb; border-radius:8px; outline:none; font-size:13px }
        .row{ display:flex; gap:8px; align-items:center; }
        .muted{ color:#666; font-size:12px }
        .btns{ display:flex; gap:8px; justify-content:flex-end; padding:10px 12px; border-top:1px solid #e5e7eb; background:#f8fafc }
        button{ padding:8px 12px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; cursor:pointer }
        button.primary{ background:#111; color:#fff; border-color:#111 }
        .grid2{ display:grid; grid-template-columns: 1fr 1fr; gap:8px }
        .sep{ height:1px; background:#e5e7eb; margin:4px 0 }
      </style>
      <div class="card">
        <div class="hd">
          <div>Font Rendering Lite</div>
          <button id="closeBtn" title="关闭">✕</button>
        </div>
        <div class="bd">
          <label>本域策略
            <select id="sitePolicy">
              <option value="inherit">跟随全局</option>
              <option value="enable">仅本域启用</option>
              <option value="disable">本域禁用（排除此站点）</option>
            </select>
          </label>

          <div class="row" title="当本域策略=跟随全局时生效">
            <input id="globalEnabled" type="checkbox"><span>全局启用</span>
          </div>

          <label>正文字体栈
            <input id="fontFamily" type="text" placeholder='"Microsoft YaHei", "PingFang SC", system-ui, ...'>
          </label>

          <label>等宽字体栈
            <input id="monoFamily" type="text" placeholder='ui-monospace, Menlo, Consolas, ...'>
          </label>

          <div class="row"><input id="smoothing" type="checkbox"><span>启用字体平滑</span></div>

          <label>根字号缩放（0.8–1.5，仅影响 rem）
            <input id="scale" type="number" min="0.5" max="2" step="0.05">
          </label>

          <div class="sep"></div>
          <div class="row"><input id="strokeEnabled" type="checkbox"><span>启用字体描边</span></div>
          <div class="grid2">
            <label>描边宽度(em)<input id="strokeWidthEm" type="number" min="0" step="0.005"></label>
            <label>描边颜色<input id="strokeColor" type="text" placeholder="#RRGGBB / rgba()"></label>
          </div>
          <div class="row"><input id="boldAdjustEnabled" type="checkbox"><span>粗体修正</span></div>
          <label>粗体修正系数(0.4–0.8)<input id="boldFactor" type="number" min="0.3" max="1.0" step="0.05"></label>

          <div class="sep"></div>
          <div class="row"><input id="shadowEnabled" type="checkbox"><span>启用阴影</span></div>
          <div class="grid2">
            <label>阴影强度(em)<input id="shadowSizeEm" type="number" min="0" step="0.01"></label>
            <label>阴影颜色<input id="shadowColor" type="text" placeholder="#RRGGBBAA / rgba()"></label>
          </div>

          <div class="sep"></div>
          <div class="muted">提示：站点字段留空则继承全局；“本域策略”可直接设置排除此站点。</div>
        </div>
        <div class="btns">
          <button id="resetSite">重置本域</button>
          <button id="resetGlobal">重置全局</button>
          <button id="saveBtn" class="primary">保存并应用</button>
        </div>
      </div>
    `;

    const $ = (id) => root.getElementById(id);
    const ui = {
      sitePolicy: $('sitePolicy'),
      globalEnabled: $('globalEnabled'),
      fontFamily: $('fontFamily'),
      monoFamily: $('monoFamily'),
      smoothing: $('smoothing'),
      scale: $('scale'),
      strokeEnabled: $('strokeEnabled'),
      strokeWidthEm: $('strokeWidthEm'),
      strokeColor: $('strokeColor'),
      boldAdjustEnabled: $('boldAdjustEnabled'),
      boldFactor: $('boldFactor'),
      shadowEnabled: $('shadowEnabled'),
      shadowSizeEm: $('shadowSizeEm'),
      shadowColor: $('shadowColor'),
      closeBtn: $('closeBtn'),
      resetSite: $('resetSite'),
      resetGlobal: $('resetGlobal'),
      saveBtn: $('saveBtn')
    };

    // 初始化
    ui.globalEnabled.checked = !!CFG.enabled;
    ui.sitePolicy.value = (CFG.site.enabled === true) ? 'enable' : (CFG.site.enabled === false ? 'disable' : 'inherit');
    const INH = (k) => (CFG.site[k] ?? CFG[k]);
    ui.fontFamily.value  = (CFG.site.fontFamily ?? '') || '';
    ui.monoFamily.value  = (CFG.site.monoFamily ?? '') || '';
    ui.smoothing.checked = INH('smoothing') === true;
    ui.scale.value       = String(INH('scale'));
    ui.strokeEnabled.checked   = INH('strokeEnabled') === true;
    ui.strokeWidthEm.value     = String(INH('strokeWidthEm'));
    ui.strokeColor.value       = String(INH('strokeColor'));
    ui.boldAdjustEnabled.checked = INH('boldAdjustEnabled') === true;
    ui.boldFactor.value        = String(INH('boldFactor'));
    ui.shadowEnabled.checked   = INH('shadowEnabled') === true;
    ui.shadowSizeEm.value      = String(INH('shadowSizeEm'));
    ui.shadowColor.value       = String(INH('shadowColor'));

    // 事件
    ui.closeBtn.onclick = () => closePanel();
    ui.resetSite.onclick = () => {
      saveSite({
        enabled:null, fontFamily:null, monoFamily:null, smoothing:null, scale:null,
        strokeEnabled:null, strokeWidthEm:null, strokeColor:null,
        boldAdjustEnabled:null, boldFactor:null,
        shadowEnabled:null, shadowSizeEm:null, shadowColor:null
      });
      CFG = loadConfig(); applyStyle(); closePanel();
    };
    ui.resetGlobal.onclick = () => { saveGlobal(DEFAULTS); CFG = loadConfig(); applyStyle(); closePanel(); };
    ui.saveBtn.onclick = () => {
      const normalize = (v) => (typeof v === 'string' && v.trim() === '') ? null : v;
      const toNum = (v) => { const n = Number(v); return isFinite(n) ? n : null; };
      saveGlobal({ enabled: !!ui.globalEnabled.checked });
      const sitePolicy = ui.sitePolicy.value;
      saveSite({
        enabled: sitePolicy === 'enable' ? true : (sitePolicy === 'disable' ? false : null),
        fontFamily: normalize(ui.fontFamily.value),
        monoFamily: normalize(ui.monoFamily.value),
        smoothing: ui.smoothing.checked,
        scale: toNum(ui.scale.value),
        strokeEnabled: ui.strokeEnabled.checked,
        strokeWidthEm: toNum(ui.strokeWidthEm.value),
        strokeColor: normalize(ui.strokeColor.value),
        boldAdjustEnabled: ui.boldAdjustEnabled.checked,
        boldFactor: toNum(ui.boldFactor.value),
        shadowEnabled: ui.shadowEnabled.checked,
        shadowSizeEm: toNum(ui.shadowSizeEm.value),
        shadowColor: normalize(ui.shadowColor.value)
      });
      CFG = loadConfig(); applyStyle(); closePanel();
    };

    document.body.appendChild(host);
    window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closePanel(); }, { once:true });
  }

  function closePanel(){ const host = document.getElementById(UI_ID); if (host) host.remove(); panelOpen = false; }

  /* 菜单 & 快捷键 */
  GM_registerMenuCommand('切换全局启用', () => {
    saveGlobal({ enabled: !CFG.enabled }); CFG = loadConfig(); applyStyle();
    toast(`全局启用：${isEnabled() ? 'ON' : 'OFF'}`);
  });
  GM_registerMenuCommand('仅本域启用/跟随', () => {
    const cur = CFG.site.enabled; const next = (cur === true) ? null : true;
    saveSite({ enabled: next }); CFG = loadConfig(); applyStyle();
    toast(`本域策略：${siteLabel(CFG.site.enabled)}`);
  });
  GM_registerMenuCommand('本域禁用/跟随（排除此站点）', () => {
    const cur = CFG.site.enabled; const next = (cur === false) ? null : false;
    saveSite({ enabled: next }); CFG = loadConfig(); applyStyle();
    toast(`本域策略：${siteLabel(CFG.site.enabled)}`);
  });
  GM_registerMenuCommand('打开设置面板', () => { waitBody(openPanel); });
  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key.toLowerCase() === 'x')) { e.preventDefault(); if (panelOpen) closePanel(); else waitBody(openPanel); }
  });

  function siteLabel(v){ return (v === true) ? '仅本域启用' : (v === false ? '本域禁用' : '跟随全局'); }

  function waitBody(fn){
    if (document.body) return fn();
    const obs = new MutationObserver(() => { if (document.body){ obs.disconnect(); fn(); } });
    obs.observe(document.documentElement, { childList:true, subtree:true });
  }
  function toast(msg){
    const n = document.createElement('div');
    n.textContent = msg;
    Object.assign(n.style, { position:'fixed', right:'16px', bottom:'16px', zIndex:2147483647, background:'#111', color:'#fff', padding:'10px 12px', borderRadius:'10px', fontSize:'13px', boxShadow:'0 8px 24px rgba(0,0,0,.18)' });
    document.documentElement.appendChild(n); setTimeout(()=>n.remove(), 1500);
  }

  /* 启动与 class guard */
  applyStyle();
  new MutationObserver(()=>{
    const html = document.documentElement;
    html.classList.toggle(CLASS_ENABLED, isEnabled());
    html.classList.toggle(CLASS_STROKE, !!eff('strokeEnabled'));
    html.classList.toggle(CLASS_SHADOW, !!eff('shadowEnabled'));
    html.classList.toggle(CLASS_BOLDADJ, !!eff('boldAdjustEnabled'));
  }).observe(document.documentElement, { attributes:true, attributeFilter:['class'] });
})();

