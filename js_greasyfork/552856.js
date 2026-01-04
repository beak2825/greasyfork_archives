// ==UserScript==
// @name         自考笔果题库
// @namespace    http://tampermonkey.net/
// @version      2.3.6
// @description  体验优化
// @author       Kiki
// @license      MIT
// @match        https://www.biguotk.com/web/topic/answer_page*
// @match        https://www.biguotk.com/learning_center-2-real_paper-1.html
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/552856/%E8%87%AA%E8%80%83%E7%AC%94%E6%9E%9C%E9%A2%98%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/552856/%E8%87%AA%E8%80%83%E7%AC%94%E6%9E%9C%E9%A2%98%E5%BA%93.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DATA_VERSION = 1;
  const STORAGE_KEY = 'biguo_paper_data';
  const SIDEBAR_STATE_KEY = 'sidebarVisibleState';
  const LAST_QUESTION_KEY = 'biguoLastQuestionNumber';

  const isAnswerPage = location.href.includes('/web/topic/answer_page');
  const isListPage   = location.href.includes('learning_center-2-real_paper-1.html');

  /* 仅在答题页注入样式 */
  if (isAnswerPage) {
    GM_addStyle(`
      :root{
        --primary-color:#14b8a6;  /* 主色 */
        --primary-600:#0d9488;    /* hover 深一档 */
        --primary-color-light:#f0fdfa;
        --text-color-dark:#1f2937;
        --text-color-light:#4b5563;
        --border-color:#e5e7eb;
        --background-color:#f8fafc;
        --shadow-primary:0 2px 8px rgba(20,184,166,.28);
      }
      html,body{overflow-x:hidden!important;background:var(--background-color)!important;background-color:var(--background-color)!important;}
      nav,footer,.float-nav,.sidebar,.head,.popup-overlay,.qrcode-popup{display:none!important;}
      .menu_setting{display:none!important;}
      div[style*="min-width: 1400px"]>div{padding:0!important;}
      #page{display:flex;justify-content:center;align-items:flex-start;padding:40px;min-height:95vh;width:100%!important;margin:0 auto;height: initial;}
      .question{
        background:#fff;border-radius:16px;border:1px solid var(--border-color);
        box-shadow:0 4px 12px rgba(0,0,0,.05);padding:30px;
        width: 960px; /* 默认宽度 */
        margin:0 auto;position:relative;
        overflow: visible !important;
        overflow-y: visible !important;
        transition: width 0.2s ease-in-out; /* 添加宽度变化的过渡效果 */
      }
      .topic_title{font-size:1.2em!important;font-weight:600;color:var(--text-color-dark);margin-bottom:25px;line-height:1.6;padding-right:220px;}
      #exam-info-display{font-size:12px;color:var(--text-color-light);background:#f8fafc;padding:5px 10px;border-radius:6px;user-select:none;margin-bottom:20px;display:inline-flex;align-items:center;gap:8px;}
      .pg-type-tag{
        display:inline-block;padding:2px 10px;background:#ef4444;color:#fff;
        border-radius:8px;font-size:12px;line-height:1.6;font-weight:600;vertical-align:middle;
      }
      .question_menu{
        display:flex;justify-content: space-between;align-items:center;
        border-top:none;margin-top:35px;padding-top:5px;box-shadow:none!important;
      }
      .question_menu>button{margin:0!important;}
      .menu_switchover{display:inline-flex;align-items:center;gap:12px;}
      .menu_switchover>button{margin:0!important;}
      .question_menu button{
        padding:10px 22px!important;border-radius:8px;font-size:.95em;font-weight:500;height:42px;
        display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;cursor:pointer;
        transition:transform .12s ease,background-color .2s ease,border-color .2s ease,color .2s ease,box-shadow .2s ease;outline:none;
      }
      .menu_collect,.switchover_up,.switchover_lookover{
        background:#fff;color:var(--text-color-dark);border:1px solid var(--border-color)!important;
      }
      .menu_collect:hover,.switchover_up:hover,.switchover_lookover:hover{
        background:var(--primary-color-light);border-color:var(--primary-color)!important;color:var(--primary-color);
        box-shadow:var(--shadow-primary);transform:translateY(-1px);
      }
      .menu_collect:active,.switchover_up:active,.switchover_lookover:active{ transform:translateY(0);box-shadow:none; }
      .menu_collect:focus-visible,.switchover_up:focus-visible,.switchover_lookover:focus-visible{ box-shadow:0 0 0 3px var(--primary-color-light);border-color:var(--primary-color)!important; }
      .switchover_down{background:var(--primary-color);color:#fff;border:none;}
      .switchover_down:hover{background:var(--primary-600);box-shadow:var(--shadow-primary);transform:translateY(-1px);}
      .switchover_down:active{transform:translateY(0);box-shadow:none;}
      .switchover_down:focus-visible{box-shadow:0 0 0 3px var(--primary-color-light);}
      .topicListCard—new,#answer-card-sidebar{
        position:fixed!important;top:0;right:0;width:360px!important;height:100vh;background:#fff;
        border-left:1px solid var(--border-color);box-shadow:-4px 0 15px rgba(0,0,0,.08);
        padding:30px;padding-top:70px;transform:translateX(100%);transition:transform .4s ease-in-out;
        z-index:1000;display:flex;flex-direction:column;margin:0;border-radius:0;border-right:none;
      }
      .topicListCard—new.sidebar-visible,#answer-card-sidebar.sidebar-visible{transform:translateX(0);}
      .topicListCard_list{flex-grow:1;overflow-y:auto;}
      .topic_type_item{display:grid;grid-template-columns:repeat(auto-fill,minmax(42px,1fr));gap:15px;}
      .topic_lable{width:42px!important;height:42px!important;border-radius:50%!important;border:1px solid var(--border-color);
                   box-sizing:border-box;font-size:.9em;text-align:center!important;line-height:42px!important;display:block!important;margin:0!important;}
      .topic_lable.active{background:var(--primary-color)!important;color:#fff!important;border-color:var(--primary-color)!important;}
      .submit_clone_button{
        background:var(--primary-color);color:#fff;border:none;width:100%;padding:12px 0;font-size:1em;font-weight:500;border-radius:8px;cursor:pointer;margin-top:20px;
        transition:background .2s ease,box-shadow .2s ease,transform .12s ease;
      }
      .submit_clone_button:hover{background:var(--primary-600);box-shadow:var(--shadow-primary);transform:translateY(-1px);}
      .submit_clone_button:active{transform:translateY(0);box-shadow:none;}
      .topicList_submit{display:none!important;}
      #sidebar-toggle-btn{
        position:fixed;top:20px;right:20px;width:48px;height:48px;background:#fff;
        color:var(--primary-color);border:1px solid var(--border-color);border-radius:50%;
        cursor:pointer;z-index:1001;display:flex;align-items:center;justify-content:center;
        font-size:24px;box-shadow:0 4px 12px rgba(0,0,0,.1);transition:transform .12s ease,box-shadow .2s ease,border-color .2s ease,color .2s ease;
      }
      #sidebar-toggle-btn:hover{border-color:var(--primary-color);color:var(--primary-600);box-shadow:var(--shadow-primary);transform:translateY(-1px);}
      #sidebar-toggle-btn:active{transform:translateY(0);box-shadow:none;}
      .corner-icon-btn{
        position:absolute;top:15px;width:40px;height:40px;background:#f8fafc;border:1px solid var(--border-color);border-radius:50%;
        cursor:pointer;display:flex;justify-content:center;align-items:center;transition:transform .12s ease,background .2s ease,border-color .2s ease;z-index:10;
      }
      .corner-icon-btn:hover{background:var(--primary-color-light);border-color:var(--primary-color);transform:scale(1.06);}
      .corner-icon-btn svg{width:20px;height:20px;color:var(--text-color-light);transition:color .2s ease;}
      .corner-icon-btn:hover svg{color:var(--primary-color);}
      #copy-partial-btn{right:15px;}
      #copy-full-btn{right:65px;}
      #settings-corner-btn{right:115px;}
      #papers-corner-btn{right:165px;}
      #exit-corner-btn{right:215px;}
      .pg-modal__overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:none;align-items:center;justify-content:center;}
      .pg-modal__overlay.show{display:flex;}
      .pg-modal{background:#fff;width:min(720px,92vw);max-height:80vh;overflow:hidden;border-radius:12px;padding:16px;box-shadow:0 10px 30px rgba(0,0,0,.2);display:flex;flex-direction:column;}
      .pg-modal__header{display:flex;gap:8px;align-items:center;justify-content:space-between;margin-bottom:10px;}
      .pg-modal__title{margin:0;font-size:16px;font-weight:600;color:var(--text-color-dark);flex:1;}
      .pg-modal__close{border:none;background:#f5f5f5;width:30px;height:30px;border-radius:50%;font-size:18px;cursor:pointer;}
      .pg-modal__list{flex:1;overflow:auto;display:grid;gap:8px;padding-right:4px;}
      .pg-modal__item{
        padding:10px;text-align:left;border:1px solid #eee;border-radius:6px;background:#fff;cursor:pointer;
        transition:transform .12s ease,background .2s ease,border-color .2s ease,color .2s ease,box-shadow .2s ease;
      }
      .pg-modal__item:hover{background:var(--primary-color-light);border-color:var(--primary-color);color:var(--text-color-dark);box-shadow:var(--shadow-primary);transform:translateY(-1px);}
      .pg-modal__item:active{transform:translateY(0);box-shadow:none;}
      .question,.question_conter{
        height: auto !important;min-height: 0 !important;max-height: none !important;
        overflow: visible !important;overflow-y: visible !important;
      }
      .question{ max-height: 90vh !important; }
      .topic_question_bank img {
        height: auto;
        display: block;
      }
    `);
  }

  // —— 工具 —— //
  const $  = (s, r=document)=> r.querySelector(s);
  const $$ = (s, r=document)=> Array.from(r.querySelectorAll(s));
  const debounce = (fn, wait)=>{ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; };
  function getUrlParam(key){ try{ return new URL(location.href).searchParams.get(key) || ''; } catch { return ''; } }
  function setUrlParamAndGo(key, value){ try{ const u=new URL(location.href); u.searchParams.set(key,value); location.href=u.toString(); } catch{} }

  // —— 数据索引 —— //
  function getExaminationPaperData(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      const parsed=raw?JSON.parse(raw):null;
      if(!parsed || parsed.version!==DATA_VERSION || !parsed.index || !parsed.bySubject) throw 0;
      return parsed;
    }catch{
      localStorage.removeItem(STORAGE_KEY);
      return { version:DATA_VERSION, lastUpdated:0, index:{}, bySubject:{} };
    }
  }
  function saveExaminationPaperData(index, bySubject){
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version:DATA_VERSION, lastUpdated:Date.now(), index, bySubject }));
  }

  // —— 列表页抓取索引 —— //
  function extractPaperData(){
    const box=$('#accordionExample'); if(!box) return;
    const qList=$$('.question', box); if(qList.length===0) return;
    const idx={}, bySub={};
    qList.forEach(q=>{
      const subject=q.querySelector('.question_item > div')?.textContent.trim()||'';
      const collapse=q.querySelector('.collapse'); if(!subject||!collapse) return;
      if(!bySub[subject]) bySub[subject]=[];
      collapse.querySelectorAll('.question_child_item').forEach(item=>{
        const name=item.querySelector('div > div:last-child')?.textContent.trim()||'';
        const topicId=item.querySelector('.open.real_question_bank_answer')?.getAttribute('data-topic-id')||'';
        if(name && topicId){
          idx[topicId]={ subject, examination_paper:name };
          bySub[subject].push({ topic_id:topicId, examination_paper:name, subject });
        }
      });
    });
    saveExaminationPaperData(idx, bySub);
  }

  // —— 历年真题数据&排序 —— //
  const SORT_CACHE=new Map();
  function getRelevantPapersByCurrentCode(){
    const all=getExaminationPaperData();
    const code=String(getUrlParam('code')||'');
    const subject=all.index[code]?.subject;
    return { subject, list: subject ? (all.bySubject[subject] || []) : [] };
  }
  function getSortedPapers(subject, papers){
    if(!subject) return papers||[];
    if(SORT_CACHE.has(subject)) return SORT_CACHE.get(subject);
    const arr=(papers||[]).slice().sort((a,b)=>{
      const A=a.examination_paper.match(/(\d{4})年(\d{1,2})月/);
      const B=b.examination_paper.match(/(\d{4})年(\d{1,2})月/);
      if(!A) return 1; if(!B) return -1;
      const ay=+A[1], am=+A[2], by=+B[1], bm=+B[2];
      return ay!==by ? by - ay : bm - am; // 年/月倒序
    });
    SORT_CACHE.set(subject, arr);
    return arr;
  }

  // —— 单例弹窗 —— //
  class PapersModal{
    constructor(){
      this.overlay=document.createElement('div'); this.overlay.className='pg-modal__overlay';
      this.overlay.innerHTML=`<div class="pg-modal" role="dialog" aria-modal="true"><div class="pg-modal__header"><h3 class="pg-modal__title">相关历年真题</h3><button class="pg-modal__close" aria-label="关闭">×</button></div><div class="pg-modal__list"></div></div>`;
      document.body.appendChild(this.overlay);
      this.title=$('.pg-modal__title', this.overlay);
      this.closeBtn=$('.pg-modal__close', this.overlay);
      this.list=$('.pg-modal__list', this.overlay);
      this.closeBtn.addEventListener('click',()=>this.hide());
      this.overlay.addEventListener('click',(e)=>{ if(e.target===this.overlay) this.hide(); });
      this._token=0; this._chunk=120; this._sorted=[];
    }
    show(){ this.overlay.classList.add('show'); }
    hide(){ this.overlay.classList.remove('show'); }
    open(subject, list){
      this.title.textContent=subject||'相关历年真题';
      this._sorted=getSortedPapers(subject, list);
      this.render();
      this.show();
    }
    render(){
      this._token++; const token=this._token; this.list.innerHTML=''; let i=0;
      const step=()=>{
        if(token!==this._token) return;
        const end=Math.min(i+this._chunk, this._sorted.length);
        const frag=document.createDocumentFragment();
        for(; i<end; i++){
          const it=this._sorted[i];
          const btn=document.createElement('button');
          btn.className='pg-modal__item'; btn.setAttribute('data-topic-id', it.topic_id);
          btn.textContent=it.examination_paper; btn.onclick=()=> setUrlParamAndGo('code', it.topic_id);
          frag.appendChild(btn);
        }
        this.list.appendChild(frag);
        if(i<this._sorted.length) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }
  let modalInst=null;
  function ensureModal(){ if(!modalInst) modalInst=new PapersModal(); return modalInst; }
  function openPapersModalForCurrent(){
    const {subject, list}=getRelevantPapersByCurrentCode();
    ensureModal().open(subject||'相关历年真题', list);
  }

  // —— 截图相关 —— //
  function convertImagesToDataURLs(el){
    const imgs=el.querySelectorAll('img'); const jobs=[];
    imgs.forEach(img=>{
      if(img.src.startsWith('data:')) return;
      jobs.push(new Promise((resolve,reject)=>{
        GM_xmlhttpRequest({
          method:'GET', url:img.src, responseType:'blob',
          onload:res=>{
            const reader=new FileReader();
            reader.onloadend=async ()=>{ try{ img.dataset.originalSrc=img.src; img.src=reader.result; if(img.decode) await img.decode(); resolve(); } catch(e){ reject(e); } };
            reader.readAsDataURL(res.response);
          },
          onerror:reject
        });
      }));
    });
    return Promise.all(jobs);
  }
  function restoreOriginalImageSrcs(el){
    el.querySelectorAll('img').forEach(img=>{ if(img.dataset.originalSrc){ img.src=img.dataset.originalSrc; delete img.dataset.originalSrc; } });
  }
  function buildPartialCaptureContainer() {
    const q = $('.question'); if (!q) return null;
    const title = q.querySelector('.topic_title'), options = q.querySelector('.topic_options'), answered = q.querySelector('.answered');
    const parts = [title, options, answered].filter(Boolean); if (parts.length === 0) return null;
    const rect = q.getBoundingClientRect(); const root = document.createElement('div');
    root.className = 'question pg-capture-root';
    root.style.cssText = `position: fixed; left: -99999px; top: 0; width: ${Math.ceil(rect.width)}px; max-width: ${Math.ceil(rect.width)}px; background: #fff; border: none; box-shadow: none; overflow: visible; padding: 30px; box-sizing: border-box;`;
    root.style.setProperty('max-height', 'none', 'important');
    parts.forEach(node => root.appendChild(node.cloneNode(true))); document.body.appendChild(root);
    return root;
  }
  function addPartialCopyToClipboardButton(){
    const qa=$('.question'); if(!qa || $('#copy-partial-btn')) return;
    const btn=document.createElement('button');
    btn.id='copy-partial-btn'; btn.className='corner-icon-btn'; btn.title='复制题目截图(局部)';
    btn.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 002.175 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>`;
    btn.addEventListener('click', async ()=>{
      const corners=$$('.corner-icon-btn'); corners.forEach(b=>b.style.display='none');
      btn.title='正在处理...';
      const captureRoot = buildPartialCaptureContainer(); const isTemp = captureRoot !== qa;
      try{
        if(!captureRoot) throw new Error("无法创建截图容器");
        await convertImagesToDataURLs(captureRoot);
        const canvas=await html2canvas(captureRoot,{ useCORS:true, scale:2 });
        const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        btn.title='局部截图成功!'; setTimeout(()=>{ btn.title='复制题目截图(局部)'; },2000);
      }catch(e){
        console.error('局部截图或复制失败:', e); btn.title='复制失败!'; setTimeout(()=>{ btn.title='复制题目截图(局部)'; },2000);
      }finally{
        if(captureRoot) restoreOriginalImageSrcs(captureRoot);
        if (isTemp && captureRoot && captureRoot.parentNode) captureRoot.parentNode.removeChild(captureRoot);
        corners.forEach(b=>b.style.display='flex');
      }
    });
    qa.appendChild(btn);
  }
  function addFullCopyToClipboardButton(){
    const qa=$('.question'); if(!qa || $('#copy-full-btn')) return;
    const btn=document.createElement('button');
    btn.id='copy-full-btn'; btn.className='corner-icon-btn'; btn.title='复制题目截图(完整)';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 .75L15 15" /></svg>`;
    btn.addEventListener('click', async ()=>{
      const corners=$$('.corner-icon-btn'); corners.forEach(b=>b.style.display='none');
      btn.title='正在处理...';
      try{
        await convertImagesToDataURLs(qa);
        const canvas=await html2canvas(qa,{ useCORS:true, scale:2 });
        const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        btn.title='完整截图成功!'; setTimeout(()=>{ btn.title='复制题目截图(完整)'; },2000);
      }catch(e){
        console.error('完整截图或复制失败:', e); btn.title='复制失败!'; setTimeout(()=>{ btn.title='复制题目截图(完整)'; },2000);
      }finally{
        restoreOriginalImageSrcs(qa);
        corners.forEach(b=>b.style.display='flex');
      }
    });
    qa.appendChild(btn);
  }
  function addSettingsButton(){
    const area=$('.question'), origin=$('.menu_setting'); if(!area || !origin || $('#settings-corner-btn')) return;
    const btn=document.createElement('button');
    btn.id='settings-corner-btn'; btn.className='corner-icon-btn'; btn.title='答题设置';
    btn.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293 .24-.438.613-.438 .995s.145 .755 .438 .995l1.003 .827c.48 .398 .668 1.03 .26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37 .49l-1.217 -.456c-.355 -.133 -.75 -.072 -1.076 .124a6.57 6.57 0 01-.22 .128c-.333 .183 -.582 .495 -.645 .87l-.213 1.28c-.09 .543 -.56 .94 -1.11 .94h-2.594c-.55 0 -1.02 -.398 -1.11 -.94l-.213 -1.281c-.063 -.374 -.313 -.686 -.645 -.87a6.52 6.52 0 01-.22 -.127c-.325 -.196 -.72 -.257 -1.076 -.124l-1.217 .456a1.125 1.125 0 01-1.37 -.49l-1.296 -2.247a1.125 1.125 0 01.26 -1.431l1.004 -.827c.292 -.24 .437 -.613 .437 -.995s-.145 -.755 -.437 -.995l-1.004 -.827a1.125 1.125 0 01-.26 -1.431l1.296 -2.247a1.125 1.125 0 011.37 -.49l1.217 .456c.355 .133 .75 .072 1.076 -.124.072 -.044 .146 -.087 .22 -.128.332 -.183 .582 -.495 .645 -.87l.213 -1.28z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`;
    btn.addEventListener('click',()=> origin.click());
    area.appendChild(btn);
  }
  function moveTopicTypeTag(){
    const info = $('#exam-info-display'), titleBox = $('.question .topic_title'); if(!info || !titleBox) return;
    const old = info.querySelector('.pg-type-tag'); if(old) old.remove();
    const TYPE_WORDS = /(单选题|多选题|判断题|综合题|填空题|名词解释|简答题|论述题|应用题|计算题|材料题|选择题)/;
    let tagEl = null;
    for(const el of Array.from(titleBox.querySelectorAll('*'))){ const t = (el.textContent || '').trim(); if(TYPE_WORDS.test(t) && t.length <= 6){ tagEl = el; break; } }
    if(!tagEl){ const m = (titleBox.textContent || '').trim().match(TYPE_WORDS); if(m) { const chip = document.createElement('span'); chip.className = 'pg-type-tag'; chip.textContent = m[1]; info.appendChild(chip); }
    } else {
      tagEl.style.display = 'none'; const chip = document.createElement('span'); chip.className = 'pg-type-tag';
      chip.textContent = (tagEl.textContent || '').trim(); info.appendChild(chip);
    }
  }

  // —— 【最终方案】智能调整答题区和图片尺寸的函数 —— //
  function handleImageSizing() {
    const questionContainer = $('.question');
    if (!questionContainer) return;

    // 1. 切换题目时，总是先将容器宽度重置为默认值
    questionContainer.style.width = '960px';

    const image = $('.topic_question_bank img', questionContainer);
    if (!image) return; // 如果此题没有图片，则结束

    // 2. 清理可能由上一题留下的内联样式
    image.style.height = '';
    image.style.width = '';

    const adjust = () => {
      // 3. 图片加载后，获取它在960px容器内按比例缩放后的实际渲染高度
      const renderedHeight = image.offsetHeight;

      // 4. 判断渲染高度是否小于我们的目标（86px）
      if (renderedHeight > 0 && renderedHeight < 86) {
        // 5. 如果是，则计算要达到86px高度所需的新宽度
        const naturalWidth = image.naturalWidth;
        const naturalHeight = image.naturalHeight;
        if (naturalHeight === 0) return; // 避免除以0
        const requiredWidth = (naturalWidth / naturalHeight) * 86;

        // 6. 将图片的高度强制设为86px
        image.style.height = '86px';

        // 7. 检查新宽度是否会超出默认内容区，如果会，则撑开父容器
        const contentAreaWidth = 960 - 60; // 容器宽度 - 左右padding
        if (requiredWidth > contentAreaWidth) {
          questionContainer.style.width = `${Math.ceil(requiredWidth) + 60}px`;
        }
      }
    };

    // 8. 根据图片加载状态执行调整函数
    if (image.complete && image.naturalHeight > 0) {
      adjust();
    } else {
      image.onload = adjust;
      image.onerror = () => { questionContainer.style.width = '960px'; }; // 图片加载失败则恢复默认
    }
  }

  // —— 其它功能 —— //
  function addPapersButton(){
    const qa=$('.question'); if(!qa || $('#papers-corner-btn')) return;
    const papersBtn=document.createElement('button');
    papersBtn.id='papers-corner-btn'; papersBtn.className='corner-icon-btn'; papersBtn.title='历年真题';
    papersBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C6.095 4.01 5.25 4.973 5.25 6.108V18.75c0 1.243.872 2.25 1.966 2.25H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08" /></svg>`;
    papersBtn.onclick=openPapersModalForCurrent;
    qa.appendChild(papersBtn);
  }
  function buildQuestionMap(){
    const labels=$$('.topic_lable'); const data=[];
    labels.forEach(l=>{ const n=parseInt(l.textContent,10); if(!isNaN(n)) data.push({ number:n, element:l }); });
    return data.sort((a,b)=>a.number-b.number);
  }
  function updateToggleBtnIcon(v){ const t=$('#sidebar-toggle-btn'); if(t) t.innerHTML = v ? '&times;' : '&#9776;'; }
  function cloneSubmitButton(){
    const card=$('.topicListCard—new'), origin=$('.topicList_submit');
    if(card && origin && !card.querySelector('.submit_clone_button')){
      const btn=document.createElement('button'); btn.textContent='交卷'; btn.className='submit_clone_button';
      btn.addEventListener('click',()=>{ try{ origin.click(); } catch{ origin.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window})); } });
      card.appendChild(btn);
    }
  }
  function addExitButton(){
    const qa=$('.question'); if(!qa || $('#exit-corner-btn')) return;
    const btn=document.createElement('button');
    btn.id = 'exit-corner-btn'; btn.className='corner-icon-btn'; btn.title = '退出答题';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>`;
    btn.addEventListener('click',()=>history.back());
    qa.appendChild(btn);
  }
  function restructureBottomMenu(){
    const menu = $('.question_menu'), clearBtn = $('.switchover_lookover');
    if (menu && clearBtn && clearBtn.parentElement.classList.contains('menu_switchover')) {
        menu.appendChild(clearBtn);
    }
  }
  function widenLayout(){
    const page=$('#page');
    if(page?.parentElement && page.parentElement.style.width!==''){
      page.parentElement.style.width='';
      if(page.parentElement.parentElement) page.parentElement.parentElement.style.minWidth='';
    }
  }
  function updateExamInfo(){
    const info=$('#exam-info-display'); if(!info) return;
    let examDate='未知年份';
    const old=$('.breadcrumb li:nth-child(4)'), neu=$('.question .topic_title span:first-child, .question-card .header-info');
    if(old) examDate=old.textContent.trim();
    else if(neu){ const m=neu.textContent.trim().match(/(\d{4}年\d{1,2}月)/); if(m) examDate=m[1]; }
    const cur=$('.topic_lable.active'); const no=cur?cur.textContent.trim():'-';
    if(no!=='-') localStorage.setItem(LAST_QUESTION_KEY, no);
    info.textContent=`${examDate} | 第 ${no} 题`;
    moveTopicTypeTag();
  }
  function handleKeyDown(e){
    if(['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
    const all=buildQuestionMap(); if(all.length===0) return;
    const cur=$('.topic_lable.active'); if(!cur) return;
    const i=all.findIndex(q=>q.element===cur);
    if(e.key==='ArrowLeft' && i>0){ e.preventDefault(); all[i-1].element.click(); }
    else if(e.key==='ArrowRight' && i>-1 && i<all.length-1){ e.preventDefault(); all[i+1].element.click(); }
    else if(e.key==='Escape'){ $('#sidebar-toggle-btn')?.click(); }
  }
  function setupCommentObserver(){
    const container=$('.question'); if(!container) return;
    const expand=(node)=>{
      const btns=$$('button, a', node).filter(x=>x.textContent.trim()==='展示点评' && !x.dataset._clicked);
      if(btns.length){ btns[0].dataset._clicked='1'; btns[0].click(); }
    };
    expand(container);
    const obs=new MutationObserver((ml)=>{ for(const m of ml) if(m.type==='childList' && m.addedNodes.length>0) m.addedNodes.forEach(n=>{ if(n.nodeType===1) expand(n); }); });
    obs.observe(container,{ childList:true, subtree:true });
  }

  function setupEnhancedUI(){
    const q=$('.question');
    if(q && !$('#exam-info-display')){
      const info=document.createElement('div'); info.id='exam-info-display';
      q.insertBefore(info, q.firstChild); setTimeout(updateExamInfo,100);
    }
    const answerCard=$('.topicListCard—new');
    if(!$('#sidebar-toggle-btn')){
      const t=document.createElement('button'); t.id='sidebar-toggle-btn'; t.title='显示/隐藏答题卡 (可按 Esc 键)';
      document.body.appendChild(t);
      t.addEventListener('click',()=>{
        const card=$('.topicListCard—new');
        if(card){ const v=card.classList.toggle('sidebar-visible'); localStorage.setItem(SIDEBAR_STATE_KEY, v); updateToggleBtnIcon(v); }
      });
      const saved=localStorage.getItem(SIDEBAR_STATE_KEY)==='true';
      if(saved && answerCard) answerCard.classList.add('sidebar-visible');
      updateToggleBtnIcon(saved);
    }
    if(!window._evtAdded){
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', (e)=>{
        if(e.target.closest('.topic_lable')) {
          setTimeout(updateExamInfo, 80);
          setTimeout(handleImageSizing, 80); // 切换题目后检查图片
        }
      });
      window._evtAdded=true;
    }
    cloneSubmitButton();
    addExitButton();
    widenLayout();
    addPartialCopyToClipboardButton();
    addFullCopyToClipboardButton();
    addSettingsButton();
    setupCommentObserver();
    addPapersButton();
    restructureBottomMenu();
    handleImageSizing(); // 初次加载时调用
  }

  function restoreWithRetry(maxAttempts=5, delay=300){
    let attempts=0; const last=localStorage.getItem(LAST_QUESTION_KEY); if(!last || last==='1') return;
    const tryGo=()=>{
      attempts++; const all=buildQuestionMap(), target=all.find(q=>q.number.toString()===last);
      if(target && target.element){
        const cur=$('.topic_lable.active'); if(!cur || cur.textContent.trim()!==last) target.element.click();
        setTimeout(()=>{ const fin=$('.topic_lable.active'); if(!(fin && fin.textContent.trim()===last) && attempts<maxAttempts) setTimeout(tryGo, delay); },50);
      } else if(attempts<maxAttempts){ setTimeout(tryGo, delay); }
    };
    tryGo();
  }

  // —— 入口 —— //
  function runOnPage(){
    if(isListPage){
      const container=$('#accordionExample');
      if(container){
        const debounced=debounce(extractPaperData, 800);
        const obs=new MutationObserver(()=> debounced());
        obs.observe(container,{ childList:true, subtree:true });
        debounced();
      }
    } else if(isAnswerPage){
      const obs=new MutationObserver((m,o)=>{ if($('.topic_lable')){ setupEnhancedUI(); restoreWithRetry(); o.disconnect(); } });
      obs.observe(document.documentElement,{ childList:true, subtree:true });
    }
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', runOnPage); }
  else { runOnPage(); }
})();