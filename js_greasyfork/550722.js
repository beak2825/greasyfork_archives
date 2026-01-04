// ==UserScript==
// @name         Google搜索结果将吴语维基改为简中
// @namespace    ZFLEO
// @version      1.5.3
// @description  改写链接与可见域名；摘要保留高亮
// @match        *://google.com/*
// @match        *://*.google.com/*
// @match        *://*.google.com.*/*
// @match        *://*.google.co.*/*
// @match        *://*.google.*/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      zh.wikipedia.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550722/Google%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B0%86%E5%90%B4%E8%AF%AD%E7%BB%B4%E5%9F%BA%E6%94%B9%E4%B8%BA%E7%AE%80%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/550722/Google%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B0%86%E5%90%B4%E8%AF%AD%E7%BB%B4%E5%9F%BA%E6%94%B9%E4%B8%BA%E7%AE%80%E4%B8%AD.meta.js
// ==/UserScript==

(function () {
  const WUU = ['wuu.wikipedia.org','wuu.m.wikipedia.org','m.wuu.wikipedia.org'];
  const MAP = new Map([
    ['wuu.wikipedia.org','zh.wikipedia.org'],
    ['wuu.m.wikipedia.org','zh.m.wikipedia.org'],
    ['m.wuu.wikipedia.org','m.zh.wikipedia.org'],
  ]);
  const USE_API_SUMMARY = true;

  // 徽标样式，防止被容器 RTL/transform 影响
  const style = document.createElement('style');
  style.textContent = `.wuu2zh-badge{margin-left:6px;padding:1px 4px;border:1px solid #ccc;border-radius:3px;font-size:12px;color:#555;display:inline-block;direction:ltr;unicode-bidi:isolate;transform:none;writing-mode:horizontal-tb}`;
  document.documentElement.appendChild(style);

  const isGoogle = u => /\.google\./.test(u.hostname);

  function getQuery(){
    try { return decodeURIComponent(new URL(location.href).searchParams.get('q') || '').trim(); }
    catch { return ''; }
  }
  function escapeHTML(s){ return s.replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
  function escapeReg(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
  // 依据当前查询词恢复 Google 的 <em> 高亮
  function highlightHTML(text){
    const q = getQuery();
    if (!q) return escapeHTML(text);
    const keys = q.includes(' ') ? q.split(/\s+/).filter(t=>t.length>1) : [q];
    let html = escapeHTML(text);
    for (const k of keys){
      const re = new RegExp(escapeReg(k), 'gi');
      html = html.replace(re, m=>`<em>${m}</em>`);
    }
    return html;
  }

  function unwrapGoogle(href){
    try{
      const u = new URL(href);
      if (isGoogle(u) && (u.pathname==='/url' || u.pathname.startsWith('/imgres'))) {
        return u.searchParams.get('q') || u.searchParams.get('url') || u.searchParams.get('imgurl') || href;
      }
      return href;
    }catch{return href}
  }

  function rewriteURL(target){
    try{
      const t = new URL(target);
      if (!WUU.includes(t.hostname)) return null;
      t.hostname = MAP.get(t.hostname) || t.hostname;
      if (!t.searchParams.has('variant')) t.searchParams.set('variant','zh-hans');
      return t.toString();
    }catch{return null}
  }

  function findResultCard(a){
    return a.closest('div[data-hveid], div.g, div.MjjYud') || a.closest('div');
  }

  function patchVisible(card, oldHost, newHost){
    if (!card) return;
    const cite = card.querySelector('cite');
    if (cite && cite.textContent.includes(oldHost)){
      cite.textContent = cite.textContent.replaceAll(oldHost, newHost);
    }
  }

  function fetchZhSummary(title, cb){
    const url = `https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}?redirect=true`;
    GM_xmlhttpRequest({
      method: 'GET', url,
      onload: r=>{ try{ cb(JSON.parse(r.responseText).extract || ''); }catch{ cb('') } },
      onerror: ()=>cb('')
    });
  }

  function replaceSnippet(card, title){
    if (!USE_API_SUMMARY) return;
    const node = card.querySelector('div.VwiC3b, div[data-sncf], span.aCOpRe, div.Uroaid');
    if (!node) return;
    fetchZhSummary(title, txt=>{
      if (!txt) return;
      node.innerHTML = highlightHTML(txt);   // 关键：用 innerHTML 写回并恢复 <em>
    });
  }

  function handleLink(a){
    const real = unwrapGoogle(a.href);
    const rew = rewriteURL(real);
    if (!rew) return;
    a.href = rew;
    a.removeAttribute('ping');
    a.removeAttribute('onmousedown');

    const uOld = new URL(real);
    const uNew = new URL(rew);
    const card = findResultCard(a);
    patchVisible(card, uOld.hostname, uNew.hostname);

    const m = uNew.pathname.match(/\/wiki\/(.+)$/);
    if (m) replaceSnippet(card, decodeURIComponent(m[1]));
  }

  function sweep(root){ (root || document).querySelectorAll('a[href]').forEach(handleLink); }

  function enable(){ sweep(document); }
  const mo = new MutationObserver(ms=>{
    for (const m of ms) for (const n of m.addedNodes) if (n.nodeType===1) sweep(n);
  });

  function hookHistory(){
    ['pushState','replaceState'].forEach(k=>{
      const orig = history[k];
      history[k] = function(){ const r = orig.apply(this, arguments); queueMicrotask(enable); return r; };
    });
    addEventListener('popstate', enable, true);
  }

  function intercept(e){
    const a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const real = unwrapGoogle(a.href);
    const rew = rewriteURL(real);
    if (rew){
      e.preventDefault();
      e.stopPropagation();
      open(rew, (e.type==='auxclick' && e.button===1) ? '_blank' : '_self');
    }
  }

  hookHistory();
  if (document.readyState==='loading') {
    document.addEventListener('DOMContentLoaded', ()=>{ enable(); mo.observe(document, {childList:true, subtree:true}); }, {once:true});
  } else {
    enable(); mo.observe(document, {childList:true, subtree:true});
  }
  document.addEventListener('click', intercept, true);
  document.addEventListener('auxclick', intercept, true);
})();
