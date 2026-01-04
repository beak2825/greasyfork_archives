// ==UserScript==
// @name         Niconico Allegation Autofill
// @namespace    https://greasyfork.org/users/prozent55
// @version      1.0.0
// @description  動画/タグ通報フォームの自動入力＋通報完了時にXポスト
// @match        https://garage.nicovideo.jp/allegation/*
// @match        https://www.nicovideo.jp/comment_allegation/*
// @run-at       document-idle
// @noframes
// @connect      ext.nicovideo.jp
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550985/Niconico%20Allegation%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/550985/Niconico%20Allegation%20Autofill.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // =========================================================
  // 共通ユーティリティ
  // =========================================================
  const qs  = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));
  const fire = (el) => { if (!el) return; el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); };
  const setVal = (el, val) => {
    const proto = el?.constructor?.prototype || HTMLTextAreaElement.prototype;
    const d = proto && Object.getOwnPropertyDescriptor(proto,'value');
    if (d?.set) d.set.call(el, val); else el.value = val;
    fire(el);
  };

  // =========================================================
  // タイトル/IDのキャッシュ（初期画面で保存 → 完了画面で使用）
  // =========================================================
  function cacheVideoInfoIfPresent(){
    let title='', videoId='';
    if (location.host.includes('garage.nicovideo.jp')) {
      const box = qs('.text_frm');
      if (box) {
        title   = box.querySelector('h2')?.textContent?.trim() || '';
        videoId = box.querySelector('p.TXT12')?.textContent?.trim() || '';
      }
    } else {
      const box = qs('.video_info');
      if (box) {
        title   = box.querySelector('h2')?.textContent?.trim() || '';
        videoId = box.querySelector('p.video_id')?.textContent?.trim() || '';
      }
    }
    if (title && videoId) {
      localStorage.setItem('nico_report_title', title);
      localStorage.setItem('nico_report_id',   videoId);
    }
  }

  function isReportComplete(){
    // garage: <p class="TXT12">…通報を受け付けました。</p>
    const p1 = qs('p.TXT12');
    if (p1 && /通報を受け付けました。/.test(p1.textContent)) return true;
    // www: <div class="status"><p>コメント／タグの通報を受け付けました。…</p></div>
    const p2 = qs('div.status > p');
    if (p2 && /通報を受け付けました。/.test(p2.textContent)) return true;
    return false;
  }

  // =========================================================
  // 通報完了時のXポスト（小ウィンドウ・最小UI）
  // =========================================================
function buildPostMessage(){
  const title   = localStorage.getItem('nico_report_title') || '不明な動画';
  let videoId   = localStorage.getItem('nico_report_id')   || '';

  if (location.host.includes('garage.nicovideo.jp')) {
    // 動画通報 → 数字だけ抽出
    const numId = (videoId.match(/\d+/) || [''])[0];
    return `「${title}」を動画通報しました。\nhttps://garage.nicovideo.jp/allegation/${numId}\n#ニコニコ通報`;
  } else {
    // タグ通報 → sm付きそのまま
    return `「${title}」をタグ通報しました。\nhttps://www.nicovideo.jp/comment_allegation/${videoId}\n#ニコニコ通報`;
  }
}


  function openPostWindow(text){
    const u = new URL('https://x.com/intent/post');
    u.searchParams.set('text', text);
    const w = 560, h = 420;
    const l = Math.max(0, (window.screenX || 0) + (window.outerWidth - w)/2);
    const t = Math.max(0, (window.screenY || 0) + (window.outerHeight - h)/2);
    window.open(u.toString(), 'x_post_window',
      `width=${w},height=${h},left=${l},top=${t},resizable=1,scrollbars=1,toolbar=0,location=0,menubar=0,status=0`);
  }

  function ensurePostButton(){
    if (document.getElementById('zr-xpost-host')) return;
    const host = document.createElement('div');
    host.id = 'zr-xpost-host';
    Object.assign(host.style,{ position:'fixed', right:'16px', bottom:'16px', zIndex:2147483647 });
    document.body.appendChild(host);
    const root = host.attachShadow({ mode:'open' });
    const css = document.createElement('style');
    css.textContent = `
      .panel{
        background:#fff; color:#222; border:1px solid #dcdcdc;
        border-radius:8px; padding:6px; min-width:120px;
        box-shadow:0 4px 10px rgba(0,0,0,.15);
        font:12px system-ui, sans-serif;
        text-align:center;
      }
      .btn{
        cursor:pointer; background:#1da1f2; color:#fff; border:none;
        padding:4px 8px; border-radius:6px; font-weight:600; font-size:12px;
      }
    `;
    root.appendChild(css);
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `<button class="btn" id="zw-post">ポストする</button>`;
    root.appendChild(panel);
    root.getElementById('zw-post').addEventListener('click', () => openPostWindow(buildPostMessage()));
  }

  // =========================================================
  // 【A】動画通報（garage.nicovideo.jp）— 元スクリプトの機能を維持
  // =========================================================
  async function garageAutofill(){
    const DEFAULT_REASON = '91';
    const DEFAULT_TYPE   = '3';
    const DEFAULT_TEXT   = [
      '無断転載と思われる動画が多数氾濫しており、正規のコンテンツが探しにくくなるなど利用体験を大きく損なっています。',
      '私は権利者ではないため権利侵害の主張は行いませんが、スパム的投稿として規約違反の可能性があると考えています。',
      '調査と対応をご検討いただければ幸いです。'
    ].join('\n');

    const KP='zippy_nico_garage_min2_';
    const K_REASON=KP+'reason', K_TYPE=KP+'ctype', K_TEXT=KP+'comment';

    const storage={
      async get(k,d){ try{ if(typeof GM?.getValue==='function') return await GM.getValue(k,d);}catch{}
                       try{ if(typeof window.GM_getValue==='function') return window.GM_getValue(k,d);}catch{}
                       try{ const v=localStorage.getItem('__'+k); return v==null?d:JSON.parse(v);}catch{}
                       return d; },
      async set(k,v){ try{ if(typeof GM?.setValue==='function') return await GM.setValue(k,v);}catch{}
                       try{ if(typeof window.GM_setValue==='function') return window.GM_setValue(k,v);}catch{}
                       try{ localStorage.setItem('__'+k,JSON.stringify(v)); }catch{} }
    };

    function waitForForm(ms=15000){
      return new Promise(resolve=>{
        const pick=()=>{
          const reason  = qs('select[name="reason_id"]');
          const radios  = qsa('input[type="radio"][name="content_type"]');
          const comment = qs('textarea[name="comment"]');
          return (reason && radios.length && comment) ? {reason,radios,comment} : null;
        };
        const f = pick(); if (f) return resolve(f);
        const timer = setTimeout(()=>{ obs.disconnect(); resolve(null); }, ms);
        const obs = new MutationObserver(()=>{ const found = pick(); if(found){ clearTimeout(timer); obs.disconnect(); resolve(found); }});
        obs.observe(document.documentElement,{childList:true,subtree:true});
      });
    }

    async function apply(nodes){
      const {reason,radios,comment} = nodes;
      const localReason = await storage.get(K_REASON,'');
      const localType   = await storage.get(K_TYPE,'');
      const localText   = await storage.get(K_TEXT,'');

      const chosenReason = localReason || DEFAULT_REASON;
      if ([...reason.options].some(o => o.value == chosenReason)) { reason.value = chosenReason; fire(reason); }

      const chosenType = localType || DEFAULT_TYPE;
      const r = radios.find(x => x.value === String(chosenType));
      if (r) { r.checked = true; fire(r); }

      if (!comment.value) { comment.value = localText || DEFAULT_TEXT; fire(comment); }
    }

    function addStyle(css){
      if (typeof GM_addStyle === 'function') return GM_addStyle(css);
      const s=document.createElement('style'); s.textContent=css; document.head.appendChild(s);
    }

    function toast(text){
      const n=document.createElement('div'); n.textContent=text;
      Object.assign(n.style,{position:'fixed',right:'16px',bottom:'110px',zIndex:1000000,
        background:'#00c853',color:'#fff',padding:'8px 10px',borderRadius:'8px',
        boxShadow:'0 4px 12px rgba(0,0,0,25)',opacity:'0',transition:'opacity .15s'});
      document.body.appendChild(n); requestAnimationFrame(()=>n.style.opacity='1');
      setTimeout(()=>{ n.style.opacity='0'; setTimeout(()=>n.remove(),180); },1200);
    }

    function panel(nodes){
      const {reason,radios,comment} = nodes;
      if (document.getElementById('zr-min2-host')) return;
      const host=document.createElement('div'); host.id='zr-min2-host';
      Object.assign(host.style,{position:'fixed',right:'16px',bottom:'16px',zIndex:999999});
      document.body.appendChild(host);
      const root=host.attachShadow({mode:'open'});

      const wrap=document.createElement('div');
      wrap.className='zr-min2';
      wrap.innerHTML = `
        <div class="row"><b>自動入力（ローカル⇄既定）</b></div>
        <div class="row">
          <button id="zr-save"  type="button">保存</button>
          <button id="zr-reset" type="button">既定に戻す</button>
        </div>`;

      const style=document.createElement('style');
      style.textContent = `
        :host { all: initial; }
        .zr-min2 { all: initial; display:block; font:12px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans JP","Hiragino Kaku Gothic ProN",Meiryo,sans-serif; color:#fff; background:#0b1220cc; backdrop-filter:blur(6px); padding:10px 12px; border-radius:10px; box-shadow:0 8px 20px rgba(0,0,0,35); }
        .row { all: initial; display:block; margin:6px 0; font:inherit; color:inherit; }
        b { all: initial; font:inherit; font-weight:700; color:inherit; }
        button { all: initial; font:inherit; color:#fff; background:#1f6feb; padding:6px 10px; border-radius:6px; cursor:pointer; margin-right:6px; box-shadow:0 1px 2px rgba(0,0,0,25); }
        button:hover { background:#2b7af3; }
        button:active { background:#195bd0; }
        button#zr-reset { background:#d93025; }`;
      root.append(style, wrap);

      root.getElementById('zr-save').addEventListener('click', async () => {
        await storage.set(K_REASON, reason.value || '');
        await storage.set(K_TYPE,   (radios.find(r => r.checked)?.value) || '');
        await storage.set(K_TEXT,   comment.value || '');
        toast('保存しました');
      });
      root.getElementById('zr-reset').addEventListener('click', async () => {
        await storage.set(K_REASON,''); await storage.set(K_TYPE,''); await storage.set(K_TEXT,'');
        reason.value = DEFAULT_REASON; fire(reason);
        radios.forEach(r => r.checked = (r.value === String(DEFAULT_TYPE)));
        const checked = radios.find(x => x.checked); if (checked) fire(checked);
        comment.value = DEFAULT_TEXT; fire(comment);
        toast('既定に戻しました');
      });
    }

    const nodes = await (function(){ // wait + apply + panel
      return new Promise(async (resolve) => {
        const found = await waitForForm();
        if (!found) return resolve(null);
        await apply(found);
        panel(found);
        resolve(found);
      });
    })();
    return !!nodes;
  }

  // =========================================================
  // 【B】タグ通報（www.nicovideo.jp）— 元スクリプトの機能を維持
  // =========================================================
  async function wwwAutofill(){
    const DEFAULT_TARGET = 'tag';
    const DEFAULT_ITEM   = 'search_interference';
    const DEFAULT_REASON_BODY =
      '動画の内容とは無関係なタグがロックされており、削除できません。\n' +
      'タグ検索や関連機能に支障をきたすため、荒らし行為にあたり利用規約違反の可能性があると判断しました。';

    // WL
    const WL_KEY = 'zr_tag_wl_v1';
    const WL_DEFAULT = ['真夏の夜の淫夢','淫夢実況シリーズ','ひとくち淫夢','淫夢本編リンク','本編改造淫夢','BB先輩シリーズ','ホラー淫夢','タクヤさん','BB先輩劇場','バトル淫夢'];
    const loadWL = () => { try { const s=localStorage.getItem(WL_KEY); return s?JSON.parse(s):WL_DEFAULT.slice(); } catch { return WL_DEFAULT.slice(); } };
    const saveWL = (arr) => { try { localStorage.setItem(WL_KEY, JSON.stringify(arr||[])); } catch {} };

    // フォームキャッシュ（読み出しのみ）
    const KP = 'zippy_nico_tag_form_';
    const K_TARGET = KP+'target', K_ITEM = KP+'item', K_TEXT = KP+'text';
    const storage = {
      async get(k,d){ try{ const v=localStorage.getItem('__'+k); return v==null?d:JSON.parse(v);}catch{ return d; } },
      async set(k,v){ try{ localStorage.setItem('__'+k, JSON.stringify(v)); }catch{} }
    };

    const norm = s => (s||'').trim().toLowerCase();

    function waitForForm(ms=8000){
      return new Promise(res=>{
        const pick = () => {
          const radios = qsa('input[type="radio"][name="target"]');
          const select = qs('select[name="select_allegation"]');
          const ta     = qs('textarea[name="inquiry"]#inquiry');
          return (radios.length && select && ta) ? {radios,select,ta} : null;
        };
        const first = pick(); if (first) return res(first);
        const to = setTimeout(()=>{ mo.disconnect(); res(null); }, ms);
        const mo = new MutationObserver(()=>{ const f=pick(); if(f){ clearTimeout(to); mo.disconnect(); res(f); }});
        mo.observe(document.body,{childList:true,subtree:true});
      });
    }

    // getthumbinfo
    function videoIdFromPath(){ const m=location.pathname.match(/\/comment_allegation\/([a-z]{2}\d+)/i); return m?m[1]:null; }
    function httpGet(url){
      return new Promise((resolve,reject)=>{
        const fn = (typeof GM?.xmlHttpRequest==='function') ? GM.xmlHttpRequest
                 : (typeof GM_xmlHttpRequest==='function') ? GM_xmlHttpRequest : null;
        if (!fn) return reject(new Error('GM.xmlHttpRequest not available'));
        fn({ method:'GET', url, onload:r=>resolve(r.responseText), onerror:reject });
      });
    }
    async function fetchTags(videoId){
      if (!videoId) return [];
      const url = `https://ext.nicovideo.jp/api/getthumbinfo/${encodeURIComponent(videoId)}`;
      let xml=''; try{ xml=await httpGet(url); }catch{ return []; }
      let doc; try{ doc=new DOMParser().parseFromString(xml,'text/xml'); }catch{ return []; }
      const nodes = Array.from(doc.querySelectorAll('thumb > tags > tag, tags > tag'));
      return nodes.map(t=>({ name:(t.textContent||'').trim(), locked:(t.getAttribute('lock')==='1'||t.getAttribute('locked')==='1') }))
                  .filter(x=>x.name);
    }
    function filterWLAllLocked(thumbTags, wl){
      const src = thumbTags.filter(t=>t.locked).map(t=>t.name);
      if (!src.length || !wl.length) return [];
      const S = src.map(norm); const out=[];
      for (const w of wl){ const i=S.indexOf(norm(w)); if(i!==-1 && !out.includes(src[i])) out.push(src[i]); }
      return out;
    }

    const TAG_LINE_RE = /^【タグの内容】.*(?:\r?\n)?/m;
    function composeWithTagLine(currentText, tags){
      const body0 = (currentText || '').replace(TAG_LINE_RE, '');
      const tagLineOnly = `【タグの内容】\n${tags.length ? tags.join('、') : '(未特定)'}\n`;
      const body = body0.trim()
        ? body0.replace(/^\r?\n+/, '')
        : `【違反と判断された理由】\n${DEFAULT_REASON_BODY}`;
      return tagLineOnly + body;
    }

    function panel(nodes, reapply){
      if (document.getElementById('zr-min2-host')) return;
      const host=document.createElement('div'); host.id='zr-min2-host';
      Object.assign(host.style,{position:'fixed',right:'16px',bottom:'16px',zIndex:999999});
      document.body.appendChild(host);
      const root=host.attachShadow({ mode:'open' });

      const wrap=document.createElement('div');
      wrap.className='zr-min2';
      wrap.innerHTML = `
        <div class="row"><b>WL編集</b></div>
        <div class="row">
          <button id="zr-edit"  type="button">編集</button>
          <button id="zr-reset" type="button">WL既定に戻す</button>
        </div>`;

      const style=document.createElement('style');
      style.textContent = `
        :host { all: initial; }
        .zr-min2 { all: initial; display:block; font:12px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans JP","Hiragino Kaku Gothic ProN",Meiryo,sans-serif; color:#fff; background:#0b1220cc; backdrop-filter:blur(6px); padding:10px 12px; border-radius:10px; box-shadow:0 8px 20px rgba(0,0,0,35); }
        .row { all: initial; display:block; margin:6px 0; font:inherit; color:inherit; }
        b { all: initial; font:inherit; font-weight:700; color:inherit; }
        button { all: initial; font:inherit; color:#fff; background:#1f6feb; padding:6px 10px; border-radius:6px; cursor:pointer; margin-right:6px; box-shadow:0 1px 2px rgba(0,0,0,25); }
        button:hover { background:#2b7af3; }
        button:active { background:#195bd0; }
        button#zr-reset { background:#d93025; }`;
      root.append(style, wrap);

      root.getElementById('zr-edit').addEventListener('click', () => {
        const cur = JSON.stringify(loadWL(), null, 2);
        const nxt = prompt('ホワイトリスト(JSON配列):', cur);
        if (!nxt) return;
        try { saveWL(JSON.parse(nxt)); reapply({ forceDefaultBody:false }); toast('編集を保存しました'); }
        catch { alert('JSONが不正です'); }
      });
      root.getElementById('zr-reset').addEventListener('click', () => {
        saveWL(WL_DEFAULT.slice());
        reapply({ forceDefaultBody:true });
        toast('既定に戻しました');
      });

      function toast(text){
        const n=document.createElement('div'); n.textContent=text;
        Object.assign(n.style,{position:'fixed',right:'16px',bottom:'110px',zIndex:999999,background:'#00c853',color:'#fff',padding:'8px 10px',borderRadius:'8px',boxShadow:'0 4px 12px rgba(0,0,0,25)',opacity:'0',transition:'opacity .15s'});
        document.body.appendChild(n); requestAnimationFrame(()=>n.style.opacity='1');
        setTimeout(()=>{ n.style.opacity='0'; setTimeout(()=>n.remove(),180); },1200);
      }
    }

    // main: 待機→既定反映→タグ行付与→WLパネル
    const nodes = await waitForForm();
    if (!nodes) return false;
    const { radios, select, ta } = nodes;

    const savedTarget = await storage.get(K_TARGET,'');
    const savedItem   = await storage.get(K_ITEM,'');
    const savedText   = await storage.get(K_TEXT,'');

    const target = savedTarget || DEFAULT_TARGET;
    const item   = savedItem   || DEFAULT_ITEM;

    const r = radios.find(x => x.value === String(target)); if (r){ r.checked = true; fire(r); }
    if ([...select.options].some(o => o.value === item)) { select.value = item; fire(select); }

    const videoId   = videoIdFromPath();
    const thumbTags = await fetchTags(videoId);

    const applyNow = ({ forceDefaultBody=false }={}) => {
      const wl  = loadWL();
      const hit = filterWLAllLocked(thumbTags, wl);
      const cur = forceDefaultBody ? '' : (savedText || ta.value || '');
      const next = composeWithTagLine(cur, hit);
      setVal(ta, next);
      // 必ず「【タグの内容】…」を先頭に維持
      const check = ta.value || '';
      const ensured = check.replace(/^【タグの内容】[^\r\n]*\r?\n?/, (m) => m.endsWith('\n') ? m : (m + '\n'));
      if (ensured !== check) setVal(ta, ensured);
    };
    applyNow();
    panel(nodes, applyNow);
    return true;
  }

  // =========================================================
  // 起動
  // =========================================================
  function boot(){
    cacheVideoInfoIfPresent();

    if (isReportComplete()) {
      ensurePostButton();
      return;
    }

    if (location.host.includes('garage.nicovideo.jp')) {
      garageAutofill();
    } else {
      wwwAutofill();
    }

    // 完了表示が後出しの場合の監視
    const mo = new MutationObserver(() => {
      if (isReportComplete()) {
        mo.disconnect();
        ensurePostButton();
      }
    });
    mo.observe(document.documentElement, { childList:true, subtree:true, characterData:true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
