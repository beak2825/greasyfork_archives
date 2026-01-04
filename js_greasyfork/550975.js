// ==UserScript==
// @name         Кастомизация lolz.live
// @namespace    https://lolz.live/
// @version      0.2
// @description  дескриптион
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550975/%D0%9A%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20lolzlive.user.js
// @updateURL https://update.greasyfork.org/scripts/550975/%D0%9A%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20lolzlive.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.__LL_SCRIPT_INIT__) return;
  window.__LL_SCRIPT_INIT__ = true;

  const LS = {
    toggles: 'll_custom_enable_block_toggles',
    bgEnable: 'll_custom_enable_bg',
    bgData: 'll_custom_bg_data',
    collapse: 'll_custom_enable_alerts_collapse',
    menu: 'll_custom_enable_menu_editor',
    reply: 'll_custom_enable_alert_inline_reply',
    timeFull: 'll_custom_enable_full_time',
    copy: 'll_custom_enable_copy_tools',
    soundAlerts: 'll_custom_enable_sound_alerts',
    soundAlertsData: 'll_custom_sound_alerts_data',
    soundMsgs: 'll_custom_enable_sound_msgs',
    soundMsgsData: 'll_custom_sound_msgs_data',
    alertsSort: 'll_enable_alerts_sort',
    hideHot: 'll_custom_hide_hot_threads',
    cat: id => `ll_cat_collapse_${id}`,
  };

  const on = k => localStorage.getItem(k) === '1';
  const set = (k, v) => localStorage.setItem(k, v ? '1' : '0');
  const isPrefs = () => location.pathname.startsWith('/account/preferences');
  const safe = fn => { try { fn(); } catch (e) { console.error('[ll]', e); } };

  const wantNames = new Set([
    'Основная категория','Тематическая категория','Игровая категория','Общая категория','Пользовательские разделы',
  ]);

  (function () {
    const s = document.createElement('style');
    s.textContent = `
      html.ll-bg-on{background:var(--ll-bg-url) center/cover no-repeat fixed!important;background-color:#000!important}
      html.ll-bg-on body{background:transparent!important}

      .tm-cat-toggle{cursor:pointer;display:inline-block;width:16px;height:16px;margin-right:6px;vertical-align:middle;transition:transform .2s}
      .tm-cat-toggle::before{content:"▾";font-size:16px;line-height:16px;display:inline-block}
      .tm-cat-collapsed > .categoryNodeInfo .tm-cat-toggle{transform:rotate(-90deg)}

      .ll-reply-bar{display:flex;gap:10px;align-items:center;margin-left:auto}
      .ll-reply-btn{cursor:pointer;font-size:12px;padding:2px 6px;border:1px solid #444;border-radius:4px;background:#2a2a2a;color:#ddd}
      .ll-reply-wrap{margin-top:8px;background:#222;border:1px solid #3a3a3a;border-radius:6px;padding:8px}
      .ll-reply-wrap textarea{width:100%;min-height:52px;resize:vertical;box-sizing:border-box;background:#111;color:#ddd;border:1px solid #444;border-radius:4px;padding:6px 8px}
      .ll-reply-actions{margin-top:6px;display:flex;gap:8px;align-items:center}
      .ll-reply-send,.ll-reply-cancel{padding:4px 10px;border-radius:4px;border:1px solid #3a3a3a;background:#2a2a2a;color:#ddd;cursor:pointer}
      .ll-reply-send[disabled]{opacity:.6;cursor:default}
      .ll-reply-msg{font-size:12px;color:#8ad}
      .ll-sound-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
      .ll-sound-row .ll-inline-btn{padding:4px 8px;font-size:12px;border-radius:6px;border:1px solid #444;background:#303030;color:#ddd;cursor:pointer;margin-left:6px}
      .ll-sound-row .ll-inline-btn:hover{background:#383838}
      .ll-hide-hot .hotThreadsContainer{display:none!important}



      .manageItems.editMode .manageItem{position:relative}
      .itemCloser{position:absolute;top:2px;right:6px;font-size:18px;color:#e00;cursor:pointer;line-height:1}
      #addCustomItemBtn.manageItem{display:none;align-items:center;padding:8px 12px;gap:12px;height:52px;box-sizing:border-box;border-radius:8px;background-color:#2d2d2d;color:#aaa;text-decoration:none;transition:background-color .2s,color .2s}
      #addCustomItemBtn.manageItem:hover{background-color:#303030}
      #addCustomItemBtn.manageItem:hover span{color:#37D38D}
      #addCustomItemBtn.manageItem .SvgIcon svg{fill:#888;transition:fill .2s}
      #addCustomItemBtn.manageItem:hover .SvgIcon svg{fill:#37D38D}
      #customItemOverlay{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#2d2d2d;color:#ccc;padding:20px;border-radius:8px;z-index:9999;min-width:460px;box-shadow:0 0 15px rgba(0,0,0,.6)}
      #customItemOverlay fieldset{border:none;margin:0;padding:0}
      #customItemOverlay .ctrlUnit{display:flex;align-items:center;margin-bottom:12px}
      #customItemOverlay .ctrlUnit dt{width:120px;margin:0;font-weight:500;color:#aaa}
      #customItemOverlay .ctrlUnit dd{flex:1;margin:0}
      #customItemOverlay .textCtrl{width:100%;padding:6px 8px;border:1px solid #444;border-radius:4px;background:#1f1f1f;color:#ddd}
      #customItemOverlay .textCtrl:focus{border-color:#37D38D;outline:none}
      #customItemOverlay .sectionFooter{margin-top:15px;text-align:right}
      #customItemOverlay .button{margin-left:8px}
      #ll-prefs-customization ul > li.ll-sound-li{ margin:0; }
      #ll-prefs-customization ul > li.ll-sound-li .ll-inline-btn{ margin-left:6px; }

    `;
    document.head.appendChild(s);
  })();

  async function copyText(text){
    if(!text) return false;
    try{
      await navigator.clipboard.writeText(text);
      return true;
    }catch{
      const ta=document.createElement('textarea');
      ta.value=text; ta.style.cssText='position:fixed;left:-9999px;top:0';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      let ok=false; try{ ok=document.execCommand('copy'); } finally { ta.remove(); }
      return ok;
    }
  }

  async function getFirstPostIdFromThread(threadId) {
    const res = await fetch(`/threads/${threadId}/`, { credentials: 'include' });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const li = doc.querySelector('li[id^="post-"]');
    if (!li) throw new Error('postId не найден (thread)');
    return (li.id.match(/post-(\d+)/) || [])[1];
  }

  async function getPostIdFromAlert(li) {
    const hrefA = li.querySelector('a[href^="posts/"]');
    if (hrefA) {
      const m = hrefA.getAttribute('href').match(/posts\/(\d+)\//);
      if (m) return m[1];
    }
    const previewA = li.querySelector('.PreviewTooltip[data-previewurl]');
    if (previewA) {
      const pv = String(previewA.getAttribute('data-previewurl') || '');
      let m = pv.match(/posts\/(\d+)\/preview/);
      if (m) return m[1];
      m = pv.match(/threads\/(\d+)\/preview/);
      if (m) return await getFirstPostIdFromThread(m[1]);
    }
    const liPost = li.closest('li[id^="post-"]');
    if (liPost) {
      const m = liPost.id.match(/post-(\d+)/);
      if (m) return m[1];
    }
    throw new Error('postId не найден');
  }

  function getCsrfLikeFields(formOpt) {
    const root = formOpt || document;
    const q = s => root.querySelector(s) || document.querySelector(s);
    return {
      _xfToken: q('input[name="_xfToken"]')?.value || '',
      last_date: q('input[name="last_date"]')?.value || '',
      last_known_date: q('input[name="last_known_date"]')?.value || '',
    };
  }

  (function observeAlerts() {
    const targets = ['#AlertsDestinationWrapper', '#AccountMenu'];
    const mo = new MutationObserver(() => { try { injectReplyButtonsForAlerts(); } catch {} });
    targets.forEach(sel => {
      const n = document.querySelector(sel);
      if (n) mo.observe(n, { childList: true, subtree: true });
    });
  })();


  function getPostPlainText(node) {
    const box = node.querySelector('blockquote.messageText');
    if (box) {
      return box.textContent.replace(/\u00A0/g, ' ').trim();
    }
    return '';
  }

  function applyBg(dataUrl){
    if(!dataUrl) return;
    document.documentElement.style.setProperty('--ll-bg-url', `url("${dataUrl}")`);
    document.documentElement.classList.add('ll-bg-on');
  }
  function clearBg(){
    document.documentElement.classList.remove('ll-bg-on');
    document.documentElement.style.removeProperty('--ll-bg-url');
  }
  function pickBg(){
    const i=document.createElement('input'); i.type='file'; i.accept='image/*';
    i.onchange=()=>{ const f=i.files&&i.files[0]; if(!f) return;
      const r=new FileReader();
      r.onload=()=>{ const d=r.result; localStorage.setItem(LS.bgData,d); applyBg(d); set(LS.bgEnable,true); };
      r.readAsDataURL(f);
    };
    i.click();
  }

  function injectPrefs(){
    const form=document.querySelector('form[action*="preferences-save"]'); if(!form) return false;
    const submitDl=form.querySelector('dl.ctrlUnit.submitUnit'); if(!submitDl) return false;

    if (form.querySelector('#ll-prefs-customization')) return true;

    const dl=document.createElement('dl'); dl.className='ctrlUnit'; dl.id='ll-prefs-customization';
    const dt=document.createElement('dt'); const dd=document.createElement('dd');
    const h3=document.createElement('h3'); h3.textContent='Кастомизация'; h3.style.fontWeight='700';
    const ul=document.createElement('ul');

    const mkLi=(id,text,key)=>{
      const li=document.createElement('li');
      const input=document.createElement('input'); input.type='checkbox'; input.id=id; input.name=id; input.value='1'; input.checked=on(key);
      const label=document.createElement('label'); label.htmlFor=id; label.textContent=text;
      li.appendChild(input); li.appendChild(label);
      if(key===LS.bgEnable){
        input.addEventListener('change',()=>{
          if(input.checked){
            set(LS.bgEnable,true);
            const s=localStorage.getItem(LS.bgData); if(s) applyBg(s); else pickBg();
          } else {
            set(LS.bgEnable,false); clearBg();
          }
        });
        const reset=document.createElement('button'); reset.type='button'; reset.className='ll-inline-btn'; reset.textContent='Сбросить фон';
        reset.onclick=()=>{ localStorage.removeItem(LS.bgData); clearBg();};
        const change=document.createElement('button'); change.type='button'; change.className='ll-inline-btn'; change.textContent='Выбрать файл';
        change.onclick=()=>pickBg();
        li.appendChild(reset); li.appendChild(change);
      } else {
        input.addEventListener('change',()=>set(key,input.checked));
      }
      return li;
    };

    function pickAudio(dataKey, enableKey){
      const i=document.createElement('input'); i.type='file'; i.accept='audio/*';
      i.onchange=()=>{ const f=i.files&&i.files[0]; if(!f) return;
        if (f.size > 3*1024*1024) { alert('Файл > 3 МБ'); return; }
        const r=new FileReader();
        r.onload=()=>{ localStorage.setItem(dataKey, r.result); set(enableKey, true); enableSoundSystem(); };
        r.readAsDataURL(f);
      };
      i.click();
    }
    function mkSoundLi(id, label, enableKey, dataKey){
      const li=document.createElement('li'); li.className='ll-sound-li';

      const input=document.createElement('input'); input.type='checkbox'; input.id=id; input.checked=on(enableKey);
      const lab=document.createElement('label'); lab.htmlFor=id; lab.textContent=label;

      const pick=document.createElement('button'); pick.type='button'; pick.className='ll-inline-btn'; pick.textContent='Выбрать звук';
      pick.onclick=()=>pickAudio(dataKey, enableKey);

      const del=document.createElement('button'); del.type='button'; del.className='ll-inline-btn'; del.textContent='Удалить звук';
      del.onclick=()=>{ localStorage.removeItem(dataKey); set(enableKey,false); disableSoundSystemIfNone(); };

      li.append(input, lab, pick, del);

      input.addEventListener('change',()=>{
        set(enableKey, input.checked);
        if (input.checked) enableSoundSystem(); else disableSoundSystemIfNone();
      });
      return li;
    }

    ul.appendChild(mkSoundLi('ctrl_ll_enable_sound_alerts','Включить звук для уведомлений',LS.soundAlerts,LS.soundAlertsData));
    ul.appendChild(mkSoundLi('ctrl_ll_enable_sound_msgs','Включить звук для сообщений',LS.soundMsgs,LS.soundMsgsData));
    ul.appendChild(mkLi('ctrl_ll_enable_block_toggles','Включить сворачивание блоков с разделами',LS.toggles));
    ul.appendChild(mkLi('ctrl_ll_enable_bg','Добавить кастомный фон',LS.bgEnable));
    ul.appendChild(mkLi('ctrl_ll_enable_alerts_collapse','Схлопывать дубли уведомлений',LS.collapse));
    ul.appendChild(mkLi('ctrl_ll_enable_menu_editor','Включить редактор пунктов меню',LS.menu));
    ul.appendChild(mkLi('ctrl_ll_enable_alert_inline_reply','Включить ответ на сообщение через меню уведомлений',LS.reply));
    ul.appendChild(mkLi('ctrl_ll_enable_full_time','Показывать полное время сообщений',LS.timeFull));
    ul.appendChild(mkLi('ctrl_ll_enable_copy','Включить кнопки копирования в меню сообщений',LS.copy));
    ul.appendChild(mkLi('ctrl_ll_enable_alerts_sort','Сортировка уведомлений',LS.alertsSort));
    ul.appendChild(mkLi('ctrl_ll_hide_hot','Скрывать горячие темы',LS.hideHot));

    dd.addEventListener('change', (e) => {
      if (e.target && e.target.id === 'ctrl_ll_enable_copy') {
        if (e.target.checked) { set(LS.copy,true); enableCopyLinkInMenu(); }
        else { set(LS.copy,false); disableCopyLinkInMenu(); }
      }
      if (e.target && e.target.id === 'ctrl_ll_enable_alert_inline_reply') {
        if (e.target.checked) { set(LS.reply, true);  enableAlertInlineReply(); }
        else { set(LS.reply, false); disableAlertInlineReply(); }
      }
      if (e.target && e.target.id === 'ctrl_ll_enable_alerts_sort') {
        if (e.target.checked) { set(LS.alertsSort,true); enableAlertsSorting(); }
        else { set(LS.alertsSort,false); disableAlertsSorting(); }
      }
      if (e.target && e.target.id === 'ctrl_ll_hide_hot') {
        set(LS.hideHot, e.target.checked);
        enableHideHotThreads();
      }
    });

    dd.appendChild(h3); dd.appendChild(ul); dl.appendChild(dt); dl.appendChild(dd); form.insertBefore(dl, submitDl);
    return true;
  }

  function enableHideHotThreads(){
    document.documentElement.classList.toggle('ll-hide-hot', on(LS.hideHot));
  }

  function disableAlertInlineReply(){
    window.__LL_ALERTS_DISABLED__ = true;

    document.querySelectorAll('.ll-reply-wrap').forEach(n=>n.remove());
    document.querySelectorAll('.ll-reply-bar').forEach(n=>n.remove());
    document.querySelectorAll('li.Alert[data-ll-reply-btn]')
      .forEach(li=>li.removeAttribute('data-ll-reply-btn'));
    window.__LL_ALERTS_WIRED__ = false;
  }

  function disableCopyLinkInMenu(){
    window.__LL_COPY_MENU_DISABLED__ = true;
    const mo = window.__LL_COPY_MENU_OBS__;
    if (mo && mo.disconnect) mo.disconnect();
    document.querySelectorAll('.ll-copy-link,.ll-copy-text').forEach(el=>el.remove());
    document.querySelectorAll('.blockLinksList.have-icon[data-ll-copy-wired]').forEach(el=>el.removeAttribute('data-ll-copy-wired'));
    window.__LL_COPY_MENU_WIRED__ = false;
  }

  function addCategoryToggles(){
    if(!on(LS.toggles)) return;

    document.querySelectorAll('li.node.category.level_1').forEach(cat=>{
      if (cat.dataset.llToggleInit === '1') return;
      const title=cat.querySelector('.categoryNodeInfo .categoryText h3.nodeTitle'); if(!title) return;
      const name=title.textContent.trim(); if(!wantNames.has(name)) { cat.dataset.llToggleInit='1'; return; }
      const list=cat.querySelector('ol.nodeList'); if(!list) { cat.dataset.llToggleInit='1'; return; }

      if (!title.querySelector('.tm-cat-toggle')) {
        const btn=document.createElement('span'); btn.className='tm-cat-toggle'; title.prepend(btn);
        const id=cat.getAttribute('id')||name;
        const collapsed=localStorage.getItem(LS.cat(id))==='1';
        if(collapsed){ list.style.display='none'; cat.classList.add('tm-cat-collapsed'); }
        btn.addEventListener('click',e=>{
          e.preventDefault();
          const hidden=list.style.display==='none';
          list.style.display=hidden?'':'none';
          cat.classList.toggle('tm-cat-collapsed',!hidden);
          localStorage.setItem(LS.cat(id),hidden?'0':'1');
        });
      }
      cat.dataset.llToggleInit='1';
    });
  }

  function enableAlertsCollapse(){
    if(!on(LS.collapse)) return;
    if (window.__LL_COLLAPSE_WIRED__) return;
    window.__LL_COLLAPSE_WIRED__ = true;

    const debounce=(fn,d=200)=>{ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),d); }; };
    const run=debounce(()=>{
      const list=document.querySelector('#AlertsDestinationWrapper ol'); if(!list) return;
      const buckets=new Map();
      [...list.querySelectorAll('li.Alert')].forEach(li=>{
        const isLike=li.querySelector('.alertAction.like2') || /нравится/i.test(li.textContent);
        const type=isLike?'like':'reply';
        let key; if(isLike) key=li.querySelector('h3 a[href*="posts/"]')?.href?.match(/posts\/(\d+)/)?.[1];
        else key=li.querySelector('h3 a[data-previewurl]')?.dataset.previewurl?.match(/threads\/(\d+)/)?.[1];
        if(!key) return; const k=`${type}_${key}`; (buckets.get(k)||buckets.set(k,[]).get(k)).push(li);
      });
      buckets.forEach(group=>{
        if(group.length<2) return;
        const [first,...rest]=group; const others=rest.length; rest.forEach(li=>li.remove());
        const h3=first.querySelector('h3'); const nick=h3?.querySelector('a.username'); if(!h3||!nick) return;
        if(h3.querySelector('.tm-counter')) return;
        const c=document.createElement('span'); c.className='tm-counter'; c.textContent=` (и ещё ${others})`; c.style.color='#fff'; c.style.marginLeft='4px'; nick.after(c);
      });
    });
    run();

    const panel=document.getElementById('AlertPanels');
    if(panel) new MutationObserver(run).observe(panel,{childList:true,subtree:true});
  }

  function composeFull(el){
    const ds = el.getAttribute('data-datestring') || '';
    const ts = el.getAttribute('data-timestring') || '';
    const t  = el.getAttribute('title') || '';
    if (ds && ts) return `${ds} в ${ts}`;
    if (t) return t;
    const sec = Number(el.getAttribute('data-time'));
    if (!Number.isNaN(sec)) {
      const d = new Date(sec*1000);
      const dd = d.toLocaleDateString('ru-RU', { day:'2-digit', month:'short', year:'numeric' }).replace('.', '');
      const tt = d.toLocaleTimeString('ru-RU', { hour:'2-digit', minute:'2-digit' });
      return `${dd} в ${tt}`;
    }
    return el.textContent || '';
  }

  function applyFullTimeOnNode(root=document){
    root.querySelectorAll('.DateTime:not([data-ll-full])').forEach(el=>{
      el.dataset.llOrigTxt = el.textContent || '';
      el.textContent = composeFull(el);
      el.dataset.llFull = '1';
    });
  }

  function revertFullTime(root=document){
    root.querySelectorAll('.DateTime[data-ll-full]').forEach(el=>{
      if (el.dataset.llOrigTxt) el.textContent = el.dataset.llOrigTxt;
      el.removeAttribute('data-ll-full');
      el.removeAttribute('data-ll-orig-txt');
    });
  }

  function enableFullTimeDates(){
    if (on(LS.timeFull)) applyFullTimeOnNode(document);

    if (window.__LL_FULLTIME_OBS__) return;
    const mo = new MutationObserver(muts=>{
      if (!on(LS.timeFull)) return;
      for (const m of muts){
        for (const n of m.addedNodes){
          if (n.nodeType === 1) applyFullTimeOnNode(n);
        }
      }
    });
    const body = document.body || document.documentElement;
    if (body) { mo.observe(body, {childList:true, subtree:true}); window.__LL_FULLTIME_OBS__ = mo; }
  }

  function enableAlertInlineReply() {
    if (!on(LS.reply)) return;
    window.__LL_ALERTS_DISABLED__ = false;
    if (window.__LL_ALERTS_WIRED__) return;
    window.__LL_ALERTS_WIRED__ = true;

    ensureInlineReplyStyles();
    injectReplyButtonsForAlerts();

    if (!window.__LL_REPLY_CLICK_FN__) {
      const handler = (e) => {
        const btn = e.target.closest?.('.ll-reply-btn');
        if (!btn) return;
        e.preventDefault();
        e.stopImmediatePropagation?.();
        e.stopPropagation();
        const li = btn.closest('li.Alert');
        if (li) showInlineReply(li);
      };
      ['click','mousedown','pointerdown','touchstart'].forEach(ev=>{
        document.addEventListener(ev, handler, true);
      });
      window.__LL_REPLY_CLICK_FN__ = handler;
    }

    if (!window.__LL_ALERTS_OBS__) {
      const run = () => injectReplyButtonsForAlerts();
      const panel = document.getElementById('AlertPanels');
      if (panel) new MutationObserver(run).observe(panel, { childList: true, subtree: true });
      new MutationObserver((m, ob) => {
        if (document.getElementById('AlertPanels')) { run(); ob.disconnect(); }
      }).observe(document.body, { childList: true, subtree: true });
      document.addEventListener('click', e => {
        if (e.target.closest?.('#ConversationsMenu, #AlertsMenu, .navLink.alerts')) run();
      }, true);
      window.__LL_ALERTS_OBS__ = 1;
    }

    function normalizeFromBB(bb){
      if(!bb) return '';
      return bb
        .replace(/\[quote[^\]]*\][\s\S]*?\[\/quote\]/gi,'')
        .replace(/^\s*\[user[^\]]*\][^\[]+\[\/user\][,\s\u00A0]*/i,'')
        .replace(/\[\/?[\w\-]+(?:=[^\]]*)?\]/g,'')
        .replace(/<[^>]*>/g,'')
        .replace(/&quot;/g,'"').replace(/&amp;/g,'&')
        .replace(/&lt;/g,'<').replace(/&gt;/g,'>')
        .replace(/\s+/g,' ').trim();
    }
  }

  function ensureInlineReplyStyles(){
    if (document.getElementById('ll-inline-reply-css')) return;
    const st=document.createElement('style');
    st.id='ll-inline-reply-css';
    st.textContent = `
      .ll-reply-wrap{ margin-top:8px; }
      .ll-reply-TA{ width:100%; min-height:64px; }
      .ll-reply-actions{ margin-top:6px; display:flex; gap:8px; align-items:center; }
      .ll-reply-btn{ padding:4px 8px; font-size:12px; border-radius:6px; border:1px solid #444; background:#303030; color:#ddd; cursor:pointer;}
      .ll-reply-btn:hover{ background:#383838; }
      .ll-inline-btn {padding:4px 8px; font-size:12px; border-radius:6px; border:1px solid #444; background:#303030; color:#ddd; cursor:pointer; margin-left:6px;}
      .ll-inline-btn:hover {background:#383838;}
    `;
    document.head.appendChild(st);
  }

  function injectReplyButtonsForAlerts() {
    if (!on(LS.reply) || window.__LL_ALERTS_DISABLED__) return;
    const items = document.querySelectorAll(
      '#AlertsDestinationWrapper li.Alert:not([data-ll-reply-btn]), ' +
      '#AccountMenu li.Alert:not([data-ll-reply-btn]), ' +
      'li.Alert:not([data-ll-reply-btn])'
    );
    items.forEach(li => {
      li.setAttribute('data-ll-reply-btn', '1');

      let bar = li.querySelector('.ll-reply-bar');
      if (!bar) {
        bar = document.createElement('div');
        bar.className = 'll-reply-bar';
        const bottom = li.querySelector('.bottom') || li.querySelector('.listItemText') || li;
        bottom.appendChild(bar);
      }

      if (!li.querySelector('.ll-reply-btn')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'll-reply-btn';
        btn.textContent = 'Ответить';
        bar.appendChild(btn);
      }
    });
  }

  function showInlineReply(li) {
    if (li.querySelector('.ll-reply-wrap')) return;

    const bar = li.querySelector('.ll-reply-bar') || li;
    const wrap = document.createElement('div');
    wrap.className = 'll-reply-wrap';
    wrap.innerHTML = `
      <div class="ll-reply-box">
        <textarea class="ll-reply-TA" placeholder="Ваш ответ…" rows="3"></textarea>
        <div class="ll-reply-actions">
          <button class="ll-reply-send" type="button">Отправить</button>
          <button class="ll-reply-cancel" type="button">Отмена</button>
          <span class="ll-reply-msg" style="font-size:12px;opacity:.8"></span>
        </div>
      </div>
    `;

    ['click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart', 'touchend'].forEach(ev => {
      wrap.addEventListener(ev, ev2 => ev2.stopPropagation(), true);
    });

    if (bar.after) bar.after(wrap); else bar.appendChild(wrap);

    const ta = wrap.querySelector('.ll-reply-TA');
    const send = wrap.querySelector('.ll-reply-send');
    const cancel = wrap.querySelector('.ll-reply-cancel');
    const msg = wrap.querySelector('.ll-reply-msg');
    ta.focus();

    cancel.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      wrap.remove();
    });

    send.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      doSend(ta, send, msg, li, wrap);
    });

    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); e.stopPropagation();
        doSend(ta, send, msg, li, wrap);
      } else if (e.key === 'Escape') {
        e.preventDefault(); e.stopPropagation();
        wrap.remove();
      }
    });
  }

  function getAuthorFromAlert(li) {
    const name = (li.getAttribute('data-author') || li.querySelector('.username')?.textContent || '').trim();
    let id = '';
    const a = li.querySelector('a[href^="members/"]');
    if (a) {
      const m = a.getAttribute('href').match(/members\/(\d+)\//);
      if (m) id = m[1];
    }
    return { id, name };
  }

  function buildUserPrefix(li) {
    const { id, name } = getAuthorFromAlert(li);
    if (id && name) return `[USER=${id}]${name}[/USER], `;
    if (name) return `${name}, `;
    return '';
  }

  function getAlertKind(li){
    const t = (li.querySelector('h3')?.textContent || '').toLowerCase();
    if (t.includes('создал') && t.includes('тему')) return 'thread_created';
    if (t.includes('ответил') && t.includes('в теме')) return 'replied_in_thread';
    return 'other';
  }

  async function pickAction(li) {
    const kind = getAlertKind(li);

    const previewA = li.querySelector('.PreviewTooltip[data-previewurl]');
    const pv = String(previewA?.getAttribute('data-previewurl') || '');

    if (kind === 'thread_created') {
      const mt = pv.match(/threads\/(\d+)\/preview/);
      if (mt) return { type: 'thread', action: `/threads/${mt[1]}/add-reply` };
      const hrefA = li.querySelector('a[href^="posts/"]');
      if (hrefA) {
        const m = hrefA.getAttribute('href').match(/posts\/(\d+)\//);
        if (m) return { type: 'comment', action: `/posts/${m[1]}/comment` };
      }
    }

    const hrefA = li.querySelector('a[href^="posts/"]');
    if (hrefA) {
      const m = hrefA.getAttribute('href').match(/posts\/(\d+)\//);
      if (m) return { type: 'comment', action: `/posts/${m[1]}/comment` };
    }

    const mt = pv.match(/threads\/(\d+)\/preview/);
    if (mt) {
      const pid = await getFirstPostIdFromThread(mt[1]);
      return { type: 'comment', action: `/posts/${pid}/comment` };
    }

    const postId = await getPostIdFromAlert(li);
    return { type: 'comment', action: `/posts/${postId}/comment` };
  }

  async function doSend(ta, send, msg, li, wrap) {
    const text = ta.value.trim();
    if (!text) { msg.textContent = 'Введите текст'; return; }
    msg.textContent = 'Отправка…';
    send.disabled = true;

    try {
      const form = document.querySelector('#QuickReply');
      const { _xfToken, last_date, last_known_date } = getCsrfLikeFields(form);

      const { action, type } = await pickAction(li);
      const prefix = (type === 'comment') ? buildUserPrefix(li) : '';
      const html = prefix ? `<p>${prefix}${text}</p>` : `<p>${text}</p>`;

      const fd = new FormData();
      fd.append('message_html', html);
      fd.append('_xfToken', _xfToken);
      fd.append('last_date', last_date);
      fd.append('last_known_date', last_known_date);
      fd.append('_xfRequestUri', location.pathname + location.search);
      fd.append('_xfWithData', '1');
      fd.append('_xfResponseType', 'json');

      const res = await fetch(action, {
        method: 'POST',
        body: fd,
        credentials: 'include',
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json, text/javascript, */*; q=0.01' }
      });

      const ct = res.headers.get('content-type') || '';
      const raw = await res.text();
      if (!ct.includes('application/json')) throw new Error(`Не JSON (${res.status}). ${raw.slice(0,200)}…`);
      const j = JSON.parse(raw);

      if (j._redirectStatus || j.status === 'ok' || j.success) {
        msg.textContent = 'Отправлено';
        setTimeout(() => wrap.remove(), 400);
        return;
      }
      const err = (j.errors && (Array.isArray(j.errors) ? j.errors.join('; ') : String(j.errors))) || 'Ошибка ответа';
      throw new Error(err);
    } catch (e) {
      msg.textContent = e.message || String(e);
      send.disabled = false;
    }
  }

  function enableMenuEditor(){
    if(!on(LS.menu)) return;
    const KEY='manageItemsData_vFinal';
    const qs=(s,c=document)=>c.querySelector(s); const qsa=(s,c=document)=>[...c.querySelectorAll(s)];
    const norm=h=>{ try{const u=new URL(h,location.origin); u.searchParams.delete('_xfToken'); return u.href;}catch{return h;} };
    const load=()=>{ try{return JSON.parse(localStorage.getItem(KEY))||{order:[],hidden:[],custom:[]};}catch{return{order:[],hidden:[],custom:[]}} };
    const save=d=>localStorage.setItem(KEY,JSON.stringify(d));
    function initDnd(container){
      const items=qsa('.manageItem',container); items.forEach(i=>{i.draggable=true; i.style.cursor='grab';});
      let drag=null;
      function start(e){ drag=this; e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain',norm(this.href)); this.classList.add('dragging'); }
      function end(){ this.classList.remove('dragging'); }
      function after(cont,y){ const els=qsa('.manageItem',cont).filter(i=>!i.classList.contains('dragging'));
        return els.reduce((c,ch)=>{ const b=ch.getBoundingClientRect(); const off=y-b.top-b.height/2; return (off<0&&off>c.offset)?{offset:off,element:ch}:c; },{offset:-Infinity}).element; }
      function over(e){ e.preventDefault(); const a=after(container,e.clientY); if(!a) container.appendChild(drag); else container.insertBefore(drag,a); }
      function drop(e){ e.preventDefault(); const d=load(); d.order=qsa('.manageItem').map(el=>norm(el.href)); save(d); }
      items.forEach(i=>{ i.addEventListener('dragstart',start); i.addEventListener('dragend',end); i.addEventListener('dragover',over); i.addEventListener('drop',drop); });
    }
    function rebuild(){
      const cont=qs('.manageItems'); if(!cont) return;
      const d=load();
      const native=qsa('.manageItem',cont).filter(el=>!el.dataset.custom).map(el=>({el,href:norm(el.href)})).filter(it=>!d.hidden.includes(it.href));
      const customs=d.custom.map(c=>{ const a=document.createElement('a'); a.className='manageItem'; a.href=c.href; a.dataset.custom='1';
        a.innerHTML=`<div class="SvgIcon duotone"><svg width="20" height="20" fill="currentColor"><path d="${c.icon}"/></svg></div><span>${c.text}</span>`; return {el:a,href:c.href};});
      const all=[...native,...customs]; const order={}; d.order.forEach((h,i)=>order[h]=i);
      all.sort((a,b)=>(order[a.href]??999)-(order[b.href]??999));
      cont.innerHTML=''; all.forEach(it=>cont.appendChild(it.el)); initDnd(cont);
    }
    function removeHref(h){ const k=norm(h); const d=load(); if(!d.hidden.includes(k)) d.hidden.push(k); save(d); rebuild(); }
    function removeCustom(h){ const k=norm(h); const d=load(); d.custom=d.custom.filter(c=>c.href!==k); save(d); rebuild(); }
    function toggleEdit(){
      const cont=document.querySelector('.manageItems'); if(!cont) return;
      const onEdit=cont.classList.toggle('editMode');
      if(onEdit){
        qsa('.manageItem',cont).forEach(a=>{ const x=document.createElement('span'); x.innerHTML='×'; x.className='itemCloser';
          x.onclick=e=>{ e.preventDefault(); (a.dataset.custom?removeCustom:removeHref)(a.href); }; a.style.position='relative'; a.appendChild(x); });
        const plus=document.getElementById('addCustomItemBtn'); if(plus) plus.style.display='flex';
      } else {
        document.querySelectorAll('.itemCloser').forEach(x=>x.remove());
        const plus=document.getElementById('addCustomItemBtn'); if(plus) plus.style.display='none';
      }
    }
    function showAdd(){
      if(document.getElementById('customItemOverlay')) return;
      const ov=document.createElement('div'); ov.id='customItemOverlay'; ov.className='xenOverlay formOverlay'; ov.style.display='block';
      const form=document.createElement('form'); form.className='xenForm'; form.id='customItemForm';
      const fs=document.createElement('fieldset');
      const row=(l,id,ph='')=>{ const dl=document.createElement('dl'); dl.className='ctrlUnit';
        const dt=document.createElement('dt'); const lab=document.createElement('label'); lab.setAttribute('for',id); lab.textContent=l; dt.appendChild(lab);
        const dd=document.createElement('dd'); const inp=document.createElement('input'); inp.type='text'; inp.id=id; inp.className='textCtrl OptOut'; inp.placeholder=ph; dd.appendChild(inp);
        dl.appendChild(dt); dl.appendChild(dd); return dl; };
      fs.appendChild(row('Адрес:','ctrl_custom_url','forums/585/'));
      fs.appendChild(row('Название:','ctrl_custom_text','Мой пункт'));
      fs.appendChild(row('SVG-иконка (path):','ctrl_custom_icon','M4 6h16M4 12h16M4 18h16'));
      form.appendChild(fs);
      const footer=document.createElement('div'); footer.className='sectionFooter';
      const saveBtn=document.createElement('input'); saveBtn.type='submit'; saveBtn.value='Сохранить'; saveBtn.className='button primary';
      const cancelBtn=document.createElement('input'); cancelBtn.type='button'; cancelBtn.value='Отмена'; cancelBtn.className='button';
      footer.appendChild(saveBtn); footer.appendChild(cancelBtn); form.appendChild(footer); ov.appendChild(form); document.body.appendChild(ov);
      const close=()=>ov.remove(); cancelBtn.onclick=close;
      form.onsubmit=e=>{ e.preventDefault();
        const url=document.getElementById('ctrl_custom_url').value.trim();
        const text=document.getElementById('ctrl_custom_text').value.trim();
        const icon=document.getElementById('ctrl_custom_icon').value.trim();
        if(!url||!text){ alert('Заполни адрес и название!'); return; }
        const abs = (()=>{ try{ return new URL(url,location.origin).href; }catch{ return location.origin+'/'+url.replace(/^\/+/,''); }})();
        const d=load(); const i=d.custom.findIndex(c=>c.href===abs); if(i!==-1) d.custom[i]={href:abs,text,icon}; else d.custom.push({href:abs,text,icon});
        save(d); rebuild(); close();
      };
    }
    function init(){
      const cont=document.querySelector('.manageItems'); if(!cont) return;
      rebuild();
      const bar=document.createElement('div'); bar.className='editTriggerBar';
      bar.innerHTML=`<svg width="24" height="24" fill="#888"><path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.65-.07-.97l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0 -.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.32-.07.65-.07.97 0 .33.03.65.07.97L2.46 14.6c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.31.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18 .49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23-.09 .49 0 .61-.22l2-3.46c.12-.22 .07-.49-.12-.64l-2.11-1.66Z"/></svg>`;
      bar.style.cssText='text-align:center;padding:6px 0;cursor:pointer;opacity:.6;transition:opacity .2s'; bar.title='Редактировать пункты';
      bar.onmouseenter=()=>bar.style.opacity=1; bar.onmouseleave=()=>bar.style.opacity=.6; bar.onclick=()=>toggleEdit();
      cont.parentElement.insertBefore(bar,cont.nextSibling);
      const plus=document.createElement('a'); plus.className='manageItem addCustomItem'; plus.id='addCustomItemBtn'; plus.href='javascript:;';
      plus.innerHTML=`<div class="SvgIcon duotone"><svg width="24" height="24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z"/></svg></div><span>Добавить свой пункт</span>`;
      plus.style.display='none'; cont.parentElement.insertBefore(plus,cont.nextSibling); plus.addEventListener('click',showAdd);
    }
    new MutationObserver((_,ob)=>{ if(document.querySelector('.manageItems')){ init(); ob.disconnect(); } }).observe(document,{childList:true,subtree:true});
  }


  function enableCopyLinkInMenu(){
    if (!on(LS.copy)) return;
    if (window.__LL_COPY_MENU_WIRED__) return;
    window.__LL_COPY_MENU_WIRED__ = true;

    const ICON = `
      <span class="Svg-Icon ico">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 3h8a3 3 0 0 1 3 3v8h-2V6a1 1 0 0 0-1-1H9V3Zm-4 4h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3Zm0 2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H5Z"/></svg>
      </span>`;

    const mo = new MutationObserver(muts=>{
      let need=false;
      for(const m of muts){
        if(m.type==='attributes' && m.target.classList && m.target.classList.contains('Menu')) need=true;
        if(m.addedNodes && m.addedNodes.length) need=true;
      }
      if(need) augmentMenus();
    });
    mo.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    window.__LL_COPY_MENU_OBS__ = mo;
    augmentMenus();

    document.addEventListener('mousedown', (e)=>{
      if (e.target && !(e.target.closest && e.target.closest('.Menu'))) window.__LL_LAST_CLICK = e.target;
    }, true);
    document.addEventListener('touchstart', (e)=>{
      const t = e.targetTouches && e.targetTouches[0] && e.targetTouches[0].target;
      if (t && !(t.closest && t.closest('.Menu'))) window.__LL_LAST_CLICK = t;
    }, true);

    document.addEventListener('click', async (e)=>{
      const a = e.target.closest('a.ll-copy-link, a.ll-copy-text');
      if(!a) return;
      e.preventDefault(); e.stopPropagation();
      const menu = a.closest('.Menu');

      if (a.classList.contains('ll-copy-link')) {
        const url = getPostUrlFromNode(menu) || getPostUrlFromNode(document);
        a.title = (url && await copyText(url)) ? 'Ссылка скопирована' : 'Не удалось скопировать ссылку';
        return;
      }

      const ids = getIdsFromMenu(menu);
      let text = '';

      if (ids) {
        const url = ids.type==='comment'
          ? `/posts/comments/${ids.id}/get-copy-text`
          : `/posts/${ids.id}/get-copy-text`;
        try{
          const res = await fetch(url, {credentials:'include', headers:{'X-Requested-With':'XMLHttpRequest'}});
          let raw = await res.text();
          const ct = (res.headers.get('content-type')||'').toLowerCase();
          const looksHtml = /<!doctype|<html|<body|<form|<div/i.test(raw);
          if (!ct.includes('text/plain') && looksHtml) {
            raw = '';
          }
          if (raw) text = normalizeFromBB(raw);
        }catch{}
      }

      if (!text) {
        const origin = window.__LL_LAST_CLICK && !window.__LL_LAST_CLICK.closest?.('.Menu') ? window.__LL_LAST_CLICK : null;
        const fromOrigin = origin ? findMessageContainer(origin) : null;
        const target = fromOrigin || resolveMenuTarget(menu);
        text = target ? getPostPlainText(target) : '';
      }

      a.title = (text && await copyText(text)) ? 'Текст скопирован' : 'Не удалось скопировать текст';
    }, true);

    function augmentMenus(){
      document.querySelectorAll('.Menu.MenuOpened .blockLinksList.have-icon:not([data-ll-copy-wired])').forEach(list=>{
        list.dataset.llCopyWired='1';

        if (!list.querySelector('.ll-copy-text')) {
          const a2=document.createElement('a');
          a2.href='javascript:;'; a2.className='item control ll-copy-text';
          a2.innerHTML = `${ICON}Скопировать сообщение`;
          list.insertBefore(a2, list.firstChild);
        }
        if (!list.querySelector('.ll-copy-link')) {
          const a1=document.createElement('a');
          a1.href='javascript:;'; a1.className='item control ll-copy-link';
          a1.innerHTML = `${ICON}Скопировать ссылку`;
          list.insertBefore(a1, list.firstChild);
        }
      });
    }

    function findMessageContainer(node){
      return node.closest('li.message, article.message, .message, li.Comment, li.comment, .comment, [id^="comment-"], [data-commentid], [data-comment-id]');
    }

    function getIdsFromMenu(menu){
      const bag=[...menu.querySelectorAll('a[href], .CopyToClipboard[data-source-href]')]
        .map(el=>el.getAttribute('href')||el.getAttribute('data-source-href')||'');
      for(const s of bag){
        let m = s.match(/posts\/comments\/(\d+)\b/); if (m) return { type: 'comment', id: m[1] };
        m = s.match(/posts\/(\d+)\b/);               if (m) return { type: 'post',    id: m[1] };
      }
      return null;
    }

    function resolveMenuTarget(menu){
      const clip = menu.querySelector('.CopyToClipboard[data-source-href]');
      if (clip){
        const src = clip.getAttribute('data-source-href') || '';
        let m = src.match(/posts\/(\d+)\b/);
        if (m) return document.getElementById(`post-${m[1]}`) || document.querySelector(`#post-${m[1]}`);
        m = src.match(/posts\/comments\/(\d+)\b/);
        if (m) {
          const id=m[1];
          return document.getElementById(`post-comment-${id}`) ||
                 document.getElementById(`comment-${id}`) ||
                 document.querySelector(`#post-comment-${id}, #comment-${id}, li[id^="comment-"][id$="${id}"], li.Comment[data-commentid="${id}"], li.comment[data-comment-id="${id}"]`);
        }
      }
      let any = menu.querySelector('a[href*="posts/comments/"]');
      if (any){
        const m = any.getAttribute('href').match(/posts\/comments\/(\d+)\b/);
        if (m){
          const id=m[1];
          return document.getElementById(`post-comment-${id}`) ||
                 document.querySelector(`#post-comment-${id}, li.comment[id="post-comment-${id}"], li.comment[id="comment-${id}"]`);
        }
      }
      any = menu.querySelector('a[href*="posts/"]');
      if (any){
        const m = any.getAttribute('href').match(/posts\/(\d+)\b/);
        if (m){
          const id=m[1];
          return document.getElementById(`post-${id}`) || document.querySelector(`#post-${id}`);
        }
      }
      return null;
    }

    function normalizeFromBB(bb){
      if(!bb) return '';
      return bb
        .replace(/\[quote[^\]]*\][\s\S]*?\[\/quote\]/gi,'')
        .replace(/^\s*\[user[^\]]*\][^\[]+\[\/user\][,\s\u00A0]*/i,'')
        .replace(/\[\/?[\w\-]+(?:=[^\]]*)?\]/g,'')
        .replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
        .replace(/\s+/g,' ').trim();
    }
  }

  let __LL_SND_INIT__ = false;
  let __LL_SND_LAST__ = { alerts: null, msgs: null };
  let __LL_SND_TMO__ = null;
  let __LL_SND_THROTTLE__ = 0;

  function getBadgeCount(sel){
    const el = document.querySelector(sel);
    if (!el) return 0;
    const n = Number(el.textContent.replace(/\D+/g,''));
    return Number.isFinite(n) ? n : 0;
  }
  function makeAudio(dataKey){
    const data = localStorage.getItem(dataKey);
    if (!data) return null;
    try{
      const a = new Audio(data);
      a.preload = 'auto';
      return a;
    }catch{ return null; }
  }
  function playOnce(a){
    const now = Date.now();
    if (now - __LL_SND_THROTTLE__ < 2000) return;
    __LL_SND_THROTTLE__ = now;
    a && a.play?.().catch(()=>{});
  }

  function enableSoundSystem(){
    if (__LL_SND_INIT__) return;
    __LL_SND_INIT__ = true;

    if (__LL_SND_TMO__) { clearInterval(__LL_SND_TMO__); __LL_SND_TMO__ = null; }

    __LL_SND_LAST__.alerts = getBadgeCount('.navLink.alerts .itemCount, #AlertsMenu_Counter .itemCount, #AlertsMenu_Counter');
    __LL_SND_LAST__.msgs   = getBadgeCount('.navLink.conversations .itemCount, #ConversationsMenu_Counter .itemCount, #ConversationsMenu_Counter');

    __LL_SND_TMO__ = setInterval(()=>{
      if (on(LS.soundAlerts)) {
        const cur = getBadgeCount('.navLink.alerts .itemCount, #AlertsMenu_Counter .itemCount, #AlertsMenu_Counter');
        if (__LL_SND_LAST__.alerts != null && cur > __LL_SND_LAST__.alerts) {
          const a = makeAudio(LS.soundAlertsData); if (a) playOnce(a);
        }
        __LL_SND_LAST__.alerts = cur;
      }

      if (on(LS.soundMsgs)) {
        const cur = getBadgeCount('.navLink.conversations .itemCount, #ConversationsMenu_Counter .itemCount, #ConversationsMenu_Counter');
        if (__LL_SND_LAST__.msgs != null && cur > __LL_SND_LAST__.msgs) {
          const a = makeAudio(LS.soundMsgsData); if (a) playOnce(a);
        }
        __LL_SND_LAST__.msgs = cur;
      }

      if (!on(LS.soundAlerts) && !on(LS.soundMsgs)) {
        disableSoundSystemIfNone();
      }
    }, 1500);
  }

  function disableSoundSystemIfNone(){
    if (on(LS.soundAlerts) || on(LS.soundMsgs)) return;
    __LL_SND_INIT__ = false;
    if (__LL_SND_TMO__) { clearInterval(__LL_SND_TMO__); __LL_SND_TMO__ = null; }
  }

  LS.alertsSort = LS.alertsSort || 'll_enable_alerts_sort';



  function llClearAlertsSubfilter(){
    localStorage.setItem('ll_alerts_sort_mode', '');
    document.querySelectorAll('.alertsTabsWrapper ul.alertsTabs')
      .forEach(ul=> setSubtabState(ul, ''));
    applyAlertsFilter();
  }

  function disableAlertsSorting(){
    document.querySelectorAll('.alertsTabsWrapper ul.alertsTabs li[data-ll-sub="1"]').forEach(li=>li.remove());
    document.querySelectorAll('#AlertPanels li.Alert[style]').forEach(li=>li.style.display='');
    const mo = window.__LL_ALERTS_SORT_OBS__;
    if (mo && mo.disconnect) mo.disconnect();
    window.__LL_ALERTS_SORT_OBS__ = null;
  }

  function setSubtabState(ul, mode){
    ul.querySelectorAll('li[data-ll-sub="1"]').forEach(li=>li.classList.remove('ll-on'));
    const base = ul.querySelectorAll('li:not([data-ll-sub])');
    if (mode==='likes' || mode==='replies'){
      const txt = mode==='likes' ? 'Симпатии/лайки' : 'Ответы';
      const li = Array.from(ul.querySelectorAll('li[data-ll-sub="1"]')).find(n=>n.textContent.trim()===txt);
      if (li) li.classList.add('ll-on');
      base.forEach(li=>li.classList.add('ll-dim'));
    } else {
      base.forEach(li=>li.classList.remove('ll-dim'));
    }
  }

  function applyAlertsFilter(){
    const mode = localStorage.getItem('ll_alerts_sort_mode') || '';
    document.querySelectorAll('#AlertPanels li.Alert').forEach(li=>{
      const act = li.querySelector('.alertAction');
      const c = act ? act.classList : null;
      const isLike = !!(c && (c.contains('like') || c.contains('like2')));
      const isReply = !!(c && (c.contains('insert') || c.contains('your_post') || c.contains('tag')));
      let show = true;
      if (mode==='likes') show = isLike;
      else if (mode==='replies') show = isReply;
      li.style.display = show ? '' : 'none';
    });
  }

  function ensureAlertSortStyles(){
    if (document.getElementById('ll-alerts-sort-css')) return;
    const st = document.createElement('style');
    st.id = 'll-alerts-sort-css';
    st.textContent = `
      .alertsTabsWrapper{ position:relative; margin:0 -16px; padding:0; }

      .navPopup .alertsTabs {
        width: calc(100% - 15px) !important;
      }

      .alertsTabsWrapper ul.alertsTabs{
        display:flex; flex-wrap:nowrap; gap:10px;
        overflow-x:hidden; overflow-y:hidden;
        white-space:nowrap; scroll-behavior:smooth;
        margin:0; padding:0 16px;
        justify-content:flex-start;
      }
      .alertsTabsWrapper ul.alertsTabs::-webkit-scrollbar{ display:none; }

      .alertsTabsWrapper .tabs li,
      .alertsTabsWrapper .tabs li > a{
        max-width:none !important;
        min-width:max-content !important;
        width:auto !important;
        flex:0 0 auto !important;
        white-space:nowrap !important;
        overflow:visible !important;
        text-overflow:clip !important;
      }

      .ll-tabs-scroll{
        position:absolute; top:50%; transform:translateY(-50%);
        width:26px; height:26px; border:1px solid #444; border-radius:50%;
        background:#2d2d2d; color:#ddd; display:flex; align-items:center; justify-content:center;
        cursor:pointer; z-index:2; opacity:.85;
      }
      .ll-tabs-scroll:hover{ background:#333; }
      .ll-tabs-left{ left:20px; }
      .ll-tabs-right{ right:20px; }
    `;
    document.head.appendChild(st);

    const wrapper = document.querySelector('.alertsTabsWrapper');
    if (!wrapper) return;
    const ul = wrapper.querySelector('ul.alertsTabs');
    const btnLeft = wrapper.querySelector('.ll-tabs-left');
    const btnRight = wrapper.querySelector('.ll-tabs-right');
    if (!ul) return;

    ul.querySelectorAll('li').forEach(li => li.removeAttribute('style'));

    const step = () => Math.floor(ul.offsetWidth * 0.7);
    if (btnLeft) btnLeft.onclick = () => ul.scrollBy({ left: -step(), behavior: 'smooth' });
    if (btnRight) btnRight.onclick = () => ul.scrollBy({ left: step(), behavior: 'smooth' });
  }


  function wireTabsScroller(ul){
    if (!ul || ul.dataset.llScrollInit === '1') return;
    const wrap = ul.closest('.alertsTabsWrapper') || ul.parentElement;
    if (!wrap) return;

    const makeBtn = (cls, svgPath) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = `ll-tabs-scroll ${cls}`;
      b.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="${svgPath}"/></svg>`;
      wrap.appendChild(b);
      return b;
    };
    const left = makeBtn('ll-tabs-left', 'M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z');
    const right = makeBtn('ll-tabs-right','M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z');

    const step = () => Math.max(160, Math.round(ul.clientWidth * 0.6));
    left.onclick  = () => ul.scrollBy({ left: -step(), behavior: 'smooth' });
    right.onclick = () => ul.scrollBy({ left:  step(), behavior: 'smooth' });

    const update = () => {
      const max = Math.max(0, ul.scrollWidth - ul.clientWidth);
      const x = Math.round(ul.scrollLeft);
      if (max <= 0) {
        left.style.display = 'none';
        right.style.display = 'none';
        return;
      }
      left.style.display  = x > 0 ? 'flex' : 'none';
      right.style.display = x < max - 1 ? 'flex' : 'none';
    };

    ul.addEventListener('scroll', update, { passive:true });
    window.addEventListener('resize', update);
    ul.scrollLeft = 0;
    setTimeout(update, 0);

    ul.dataset.llScrollInit = '1';
  }

  function unclipAlertTabs(ul){
    if (!ul) return;
    const setImp = (el, prop, val) => el && el.style.setProperty(prop, val, 'important');
    ul.querySelectorAll('li').forEach(li=>{
      setImp(li, 'max-width', 'none');
      setImp(li, 'min-width', 'max-content');
      setImp(li, 'width', 'auto');
      setImp(li, 'flex', '0 0 auto');
      setImp(li, 'overflow', 'visible');
      setImp(li, 'text-overflow', 'clip');
      setImp(li, 'white-space', 'nowrap');
      const a = li.firstElementChild;
      if (a && a.tagName === 'A'){
        setImp(a, 'max-width', 'none');
        setImp(a, 'min-width', 'max-content');
        setImp(a, 'width', 'auto');
        setImp(a, 'overflow', 'visible');
        setImp(a, 'text-overflow', 'clip');
        setImp(a, 'white-space', 'nowrap');
        setImp(a, 'display', 'inline-block');
      }
    });
  }



  function enableAlertsSorting(){
    if (!on(LS.alertsSort)) return;
    ensureAlertSortStyles();

    document.querySelectorAll('.alertsTabsWrapper ul.alertsTabs').forEach(ul=>{
      if (ul.dataset.llSortInit === '1') return;
      ul.dataset.llSortInit = '1';

      const liLikes = document.createElement('li');
      liLikes.textContent = 'Симпатии/лайки';
      liLikes.dataset.llSub = '1';

      const liReplies = document.createElement('li');
      liReplies.textContent = 'Ответы';
      liReplies.dataset.llSub = '1';

      const onClick = (mode) => (e) => {
        e.preventDefault(); e.stopPropagation();
        localStorage.setItem('ll_alerts_sort_mode', mode);
        setSubtabState(ul, mode);
        unclipAlertTabs(ul);
        wireTabsScroller(ul);
        applyAlertsFilter();
      };
      liLikes.addEventListener('click', onClick('likes'));
      liReplies.addEventListener('click', onClick('replies'));

      ul.appendChild(liLikes);
      ul.appendChild(liReplies);
      ul.querySelectorAll('li:not([data-ll-sub])').forEach(li => li.dataset.llBase = '1');

      setSubtabState(ul, localStorage.getItem('ll_alerts_sort_mode') || '');

      unclipAlertTabs(ul);
      setTimeout(()=>unclipAlertTabs(ul), 0);

      wireTabsScroller(ul);
    });

    applyAlertsFilter();

    if (!window.__LL_ALERTS_SORT_OBS__){
      const run = () => {
        applyAlertsFilter();
        document.querySelectorAll('.alertsTabsWrapper ul.alertsTabs').forEach(ul=>{
          unclipAlertTabs(ul);
          wireTabsScroller(ul);
        });
      };
      const panel = document.getElementById('AlertPanels');
      if (panel){
        const mo = new MutationObserver(run);
        mo.observe(panel, { childList:true, subtree:true });
        window.__LL_ALERTS_SORT_OBS__ = mo;
      }
      document.addEventListener('click', e=>{
        const baseTab = e.target.closest?.('.alertsTabsWrapper .alertsTabs li:not([data-ll-sub])');
        if (baseTab) llClearAlertsSubfilter();
        if (baseTab || e.target.closest?.('#AlertsMenu, .navLink.alerts')) run();
      }, true);
    }
  };

  (function(){ if(on(LS.bgEnable)){ const d=localStorage.getItem(LS.bgData); if(d) applyBg(d); } })();

  let tries=0;
  const t=setInterval(()=>{
    const ok=isPrefs()?injectPrefs():true;
    if(ok){
      safe(addCategoryToggles);
      safe(enableAlertsCollapse);
      safe(enableMenuEditor);
      if (on(LS.alertsSort)) safe(enableAlertsSorting); else safe(disableAlertsSorting);
      if (on(LS.reply)) safe(enableAlertInlineReply);
      else disableAlertInlineReply && disableAlertInlineReply();
      if (on(LS.soundAlerts) || on(LS.soundMsgs)) safe(enableSoundSystem);
      safe(enableFullTimeDates);
      safe(enableHideHotThreads);
      safe(enableCopyLinkInMenu);

      clearInterval(t);
    }
    if(++tries>40) clearInterval(t);
  },250);
})();
