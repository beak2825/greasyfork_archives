// ==UserScript==
// @name         Linux.do 实时最新帖子悬浮窗
// @namespace    https://linux.do/
// @version      0.4
// @description  图片灯箱; L站 打新小助手; 新增AI总结功能; 新增跳转原帖功能; 修复无限加载问题
// @match        https://linux.do/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.siliconflow.cn
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555113/Linuxdo%20%E5%AE%9E%E6%97%B6%E6%9C%80%E6%96%B0%E5%B8%96%E5%AD%90%E6%82%AC%E6%B5%AE%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/555113/Linuxdo%20%E5%AE%9E%E6%97%B6%E6%9C%80%E6%96%B0%E5%B8%96%E5%AD%90%E6%82%AC%E6%B5%AE%E7%AA%97.meta.js
// ==/UserScript==
(function(){
  'use strict';
  if (window.__LDO_APP__) return; window.__LDO_APP__ = true;

  // ------------------------------ AI Settings (在此处编辑您的AI配置) ----------------------------------------
  const AI_SETTINGS = {
    // 硅基流动 API Key (请在此处填入您的Key)
    API_KEY: 'sk-XXXX',
    // 硅基流动 API Endpoint
    API_ENDPOINT: 'https://api.siliconflow.cn/v1/chat/completions',
    MODEL: 'Qwen/Qwen3-VL-32B-Instruct',
    // 总结提示词
    SUMMARY_PROMPT: '你是一个专业的论坛内容总结助手。请根据以下帖子的标题和内容，生成一个简短、精炼、中立的【帖子摘要总结】，尽量超过50个字（如果文章内容较丰富，可以适当超出文字限制）.然后根据帖子内容，生成一个【建议回复】，不超过20个字。使用中文回复。'
  };

  // ---------- Settings (defaults = 10s) ----------
  const LS_SETTINGS='__ldo_settings_v344';
  const DEF={ poll:10000, timeTick:1000, max:30, postRefresh:10000 };
  const S=(()=>{ try{ return {...DEF, ...AI_SETTINGS, ...(JSON.parse(localStorage.getItem(LS_SETTINGS)||'{}')||{})}; } catch { return {...DEF, ...AI_SETTINGS}; } })();

  // ---------- Styles ----------
  GM_addStyle(`
    :root{--ldo-brand:#81D8D0;--ldo-brand-dark:#4bbdb3;--ldo-glass:rgba(255,255,255,.65);--ldo-border:rgba(255,255,255,.55);--ldo-shadow:0 12px 34px rgba(0,0,0,.18);--wReader:800px;}
    #ldo-dock{position:fixed;right:20px;bottom:20px;height:420px;display:flex;align-items:stretch;z-index:2147483600;border:1px solid var(--ldo-border);border-radius:14px;box-shadow:var(--ldo-shadow);overflow:visible;background:var(--ldo-glass);backdrop-filter:blur(12px) saturate(180%);-webkit-backdrop-filter:blur(12px) saturate(180%);}
    #ldo-reader{order:0;width:0;flex:0 0 0;overflow:hidden;display:flex;flex-direction:column;background:var(--ldo-glass);border-right:1px solid var(--ldo-border);transition:width .25s ease;}
    #ldo-reader.open{width:var(--wReader);flex:0 0 var(--wReader);}
    #ldo-reader-header{background:linear-gradient(180deg,var(--ldo-brand),var(--ldo-brand-dark));color:#fff;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;user-select:none;}
    #ldo-content{flex:1;overflow:auto;padding:14px;}
    #ldo-content img{max-width:100%;height:auto}
    #ldo-content img.emoji{width:20px!important;height:20px!important;vertical-align:middle!important;display:inline!important}
    #ldo-content .onebox img { max-width: 64px !important; height: auto !important; }
    #ldo-content pre {
        white-space: pre-wrap !important;
        overflow-wrap: break-word !important;
    }
    #ldo-lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 2147483640;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        backdrop-filter: blur(8px);
    }
    #ldo-lightbox img {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        box-shadow: 0 0 30px rgba(0,0,0,0.5);
        border-radius: 8px;
        cursor: default;
    }
    /* --- ( 总结显示框 ) --- */
    #ldo-summary-box {
        display: none;
        position: relative;
        padding: 12px 14px;
        padding-top: 30px;
        margin: 0 12px 10px 12px;
        border: 1px solid var(--ldo-brand-dark);
        background: #f0fffe;
        border-radius: 10px;
        font-size: 14px;
        color: #083d39;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        max-height: 150px;
        overflow-y: auto;
        transition: all .2s ease-out;
        min-height: auto;
    }
    #ldo-summary-box.loading { color: #777; }
    #ldo-summary-box.error {
        color: #e11d48;
        background: #fff0f0;
        border-color: #e11d48;
    }
    /* --- ( 折叠按钮 ) --- */
    #ldo-summary-collapse {
        position: absolute;
        top: 6px;
        right: 10px;
        cursor: pointer;
        font-size: 14px;
        color: #555;
        padding: 2px 4px;
        border-radius: 4px;
        transition: background .2s ease, top .2s ease-out, color .2s ease-out, font-size .2s ease-out;
        z-index: 5;
        user-select: none;
    }
    #ldo-summary-collapse:hover {
        background: rgba(0,0,0,0.1);
    }
    /* --- ( 折叠后的状态 ) --- */
    #ldo-summary-box.collapsed {
        max-height: 0;
        min-height: 0;
        padding-top: 0;
        padding-bottom: 0;
        margin-bottom: 0;
        border-width: 0;
        overflow: visible;
        color: transparent;
        font-size: 0;
    }
    #ldo-summary-box.collapsed #ldo-summary-collapse {
        top: -22px;
        font-size: 14px;
        color: #555;
    }
    /* ------------------------- */
    #ldo-replybar{border-top:1px solid rgba(0,0,0,.06);padding:10px 12px;display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.75);}
    #ldo-reply-input{flex:1;border-radius:12px;padding:10px 12px;font-size:14px;border:1px solid rgba(0,0,0,.08);background:rgba(255,255,255,.9);resize:none}
    #ldo-reply-send{border:none;border-radius:12px;padding:10px 18px;background:var(--ldo-brand);color:#fff;font-weight:600;cursor:pointer;transition:all .15s ease;}
    #ldo-reply-send:hover{background:var(--ldo-brand-dark);transform:translateY(-1px);box-shadow:0 3px 6px rgba(0,0,0,.1);}
    #ldo-summarize{border:1px solid #6D28D9;background:#fff;color:#6D28D9;border-radius:12px;padding:10px 12px;font-weight:600;cursor:pointer;transition:all .15s ease;}
    #ldo-summarize:hover{background:#6D28D9;color:#fff;transform:translateY(-1px);box-shadow:0 3px 6px rgba(0,0,0,.06);}
    #ldo-summarize:disabled{background:#eee;color:#999;border-color:#ddd;cursor:not-allowed;transform:none;box-shadow:none;}
    #ldo-sep{order:1;width:10px;background:linear-gradient(90deg,rgba(255,255,255,.35),rgba(255,255,255,.15));border-left:1px solid rgba(0,0,0,.06);border-right:1px solid rgba(0,0,0,.06);display:none;cursor:pointer}
    #ldo-panel{order:2;width:260px;min-width:260px;display:flex;flex-direction:column;background:var(--ldo-glass);position:relative;overflow:visible}
    #ldo-header{background:linear-gradient(180deg,var(--ldo-brand),var(--ldo-brand-dark));color:#fff;padding:8px 10px;font-weight:700;display:flex;justify-content:space-between;align-items:center;user-select:none;}
    #ldo-head-actions{display:flex;gap:8px;align-items:center}
    /* 注意这里增加了 #ldo-tool-open */
    #ldo-refresh,#ldo-min,#ldo-close,#ldo-tool-refresh,#ldo-tool-open{cursor:pointer!important;user-select:none!important;}
    #ldo-list{flex:1;overflow:auto;padding:8px;}
    .ldo-card{padding:6px 8px;border:1px solid rgba(0,0,0,.06);border-radius:8px;margin-bottom:6px;background:rgba(255,255,255,.92);cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:border-color .2s ease,box-shadow .2s ease;}
    .ldo-card:hover{border-color:rgba(0,0,0,.1);box-shadow:0 2px 6px rgba(0,0,0,.06);}
    .ldo-title{flex:1;font-size:13px;color:#222;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-right:6px}
    .ldo-timechip{font-size:11px;color:#066;background:#e6fbf9;border:1px solid #c9f4f0;border-radius:6px;padding:2px 6px;line-height:1;}
    .ldo-new{animation:ldo-breathe 1.6s ease-in-out infinite;}
    @keyframes ldo-breathe{0%{box-shadow:0 0 0 0 rgba(255,59,48,.45)}70%{box-shadow:0 0 12px 6px rgba(255,59,48,0)}100%{box-shadow:0 0 0 0 rgba(255,59,48,0)}}
    #ldo-fab{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:50%;background:var(--ldo-glass);border:1px solid var(--ldo-border);box-shadow:var(--ldo-shadow);display:flex;align-items:center;justify-content:center;z-index:2147483601;opacity:0;transition:opacity .2s ease;cursor:pointer}
    #ldo-fab.visible{opacity:1}
  `);

  // ---------- DOM ----------
  const dock=document.createElement('div');
  dock.id='ldo-dock';
  dock.innerHTML=`
    <div id="ldo-reader">
      <div id="ldo-reader-header">
        <div id="ldo-reader-title">加载中…</div>
        <div>
            <span id="ldo-tool-open" title="在新标签页打开原帖" style="margin-right:8px;font-size:16px;">🔗</span>
            <span id="ldo-tool-refresh" title="手动刷新">🔄</span>
            <span id="ldo-close" title="关闭">✕</span>
        </div>
      </div>
      <div id="ldo-content">加载中...</div>
      <div id="ldo-summary-box"></div>
      <div id="ldo-replybar">
        <textarea id="ldo-reply-input" rows="2" placeholder="快速回复…（Enter发送 / Shift+Enter换行）"></textarea>
        <button id="ldo-summarize" title="AI总结帖子内容">📝 总结</button>
        <button id="ldo-reply-send">发送</button>
      </div>
    </div>
    <div id="ldo-sep" title="点击关闭"></div>
    <div id="ldo-panel">
      <div id="ldo-header">
        <div>Linux.do 最新</div>
        <div id="ldo-head-actions"><small id="ldo-time"></small><span id="ldo-refresh">🔄</span><span id="ldo-min">🗕</span></div>
      </div>
      <div id="ldo-list">加载中...</div>
    </div>`;
  document.body.appendChild(dock);

  const fab=document.createElement('div');
  fab.id='ldo-fab';
  fab.innerHTML=`<svg viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#81D8D0"/><stop offset="1" stop-color="#4bbdb3"/></linearGradient></defs><circle cx="50" cy="50" r="46" fill="url(#g)" stroke="#155e57" stroke-width="3"/><text x="50" y="58" font-size="34" text-anchor="middle" fill="#083d39" font-family="Arial,Helvetica,sans-serif">LD</text></svg>`;
  document.body.appendChild(fab);

  // ---------- Refs ----------
  const listDiv=dock.querySelector('#ldo-list'), timeEl=dock.querySelector('#ldo-time');
  const reader=dock.querySelector('#ldo-reader'), rTitle=dock.querySelector('#ldo-reader-title'), rContent=dock.querySelector('#ldo-content');
  const replyInput=dock.querySelector('#ldo-reply-input'), replySend=dock.querySelector('#ldo-reply-send');
  const replySummarize = dock.querySelector('#ldo-summarize');
  const summaryBox = dock.querySelector('#ldo-summary-box');

  const toolRefresh=dock.querySelector('#ldo-tool-refresh'), closeEl=dock.querySelector('#ldo-close'), sep=dock.querySelector('#ldo-sep'), minEl=dock.querySelector('#ldo-min');
  // 获取新按钮的引用
  const toolOpen=dock.querySelector('#ldo-tool-open');
  const refreshEl=dock.querySelector('#ldo-refresh');

  // ---------- Utils ----------
  const fmt = (ts)=>{ const s=Math.floor((Date.now()-new Date(ts).getTime())/1000); if(s<60)return s+'s'; const m=Math.floor(s/60); if(m<60)return m+'m'; const h=Math.floor(m/60); if(h<24)return h+'h'; return Math.floor(h/24)+'d'; };
  const jitter = (n)=> Math.floor(n * (0.9 + Math.random()*0.2));
  const buildAvatar = (tpl, size=48, letter='U') => {
    if (tpl) {
      let url = tpl.replace('{size}', size);
      if (url.startsWith('//')) url = location.protocol + url;
      if (url.startsWith('/'))  url = location.origin + url;
      return url;
    }
    return `${location.origin}/letter_avatar_proxy/v4/letter/${letter.toLowerCase()}/${size}.png`;
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html.replace(/<br\s*\/?>/gi, '\n');
    return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
  };

  function showLightbox(src) {
      const lightbox = document.createElement('div');
      lightbox.id = 'ldo-lightbox';
      lightbox.innerHTML = `<img src="${src}" alt="图片加载中...">`;
      lightbox.addEventListener('click', (e) => {
          if (e.target.id === 'ldo-lightbox') {
              lightbox.remove();
          }
      });
      document.body.appendChild(lightbox);
  }

  // ---------- Incremental feed (panel) ----------
  let feed=[], seen=new Set(), inited=false, maxCreatedAt=0;
  let polling=false, pollDelay=S.poll;

  function renderList(){
    const now=Date.now();
    listDiv.innerHTML = feed.map(t=>{
      const isNew = (now - new Date(t.created_at).getTime()) < 60000;
      return `<div class="ldo-card ${isNew?'ldo-new':''}" data-id="${t.id}">
        <div class="ldo-title">${(t.title||'').replace(/</g,'&lt;')}</div>
        <div class="ldo-timechip">${fmt(t.created_at)}</div>
      </div>`;
    }).join('');
    timeEl.textContent = new Date().toLocaleTimeString();
  }

  // ★★★ 修复重点：添加 Header 和 CSRF Token ★★★
  async function poll(){
    if (polling) return; polling=true;
    try{
      // 获取当前页面的 csrf token
      const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';
      // 添加 Headers
      const r = await fetch('/latest.json?_=' + Date.now(), {
          credentials: 'same-origin',
          headers: {
              'X-CSRF-Token': csrf,
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/json'
          }
      });
      if (r.status===429) throw {rate:true};

      // 检查返回内容类型，防止 HTML 报错
      const contentType = r.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") === -1) {
         throw new Error("Received non-JSON response (possibly WAF or Auth check)");
      }

      const data = await r.json();
      const topics = (data?.topic_list?.topics||[]).map(t=>({
        id:t.id, title:t.title, created_at:t.created_at
      })).sort((a,b)=> new Date(b.created_at)-new Date(a.created_at));

      if (!inited){
        feed = topics.slice(0,10);
        feed.forEach(t=>{ seen.add(t.id); maxCreatedAt = Math.max(maxCreatedAt, new Date(t.created_at).getTime()); });
        inited=true; renderList();
      }else{
        const newcomers = topics.filter(t=> !seen.has(t.id) && new Date(t.created_at).getTime() > maxCreatedAt)
                                .sort((a,b)=> new Date(a.created_at)-new Date(b.created_at));
        if (newcomers.length){
          for (const t of newcomers){ feed.unshift(t); seen.add(t.id); maxCreatedAt = Math.max(maxCreatedAt, new Date(t.created_at).getTime()); }
          if (feed.length > S.max) feed.length = S.max;
          renderList();
        }
      }
      pollDelay = S.poll; // reset
    }catch(e){
      console.error('LD悬浮窗列表刷新错误:', e); // 打印错误
      pollDelay = Math.min(30000, Math.max(pollDelay*2, S.poll*2));
    }finally{
      polling=false;
      setTimeout(poll, jitter(pollDelay));
    }
  }
  poll();
  setInterval(()=>{ if(inited) renderList(); }, S.timeTick);
  refreshEl.addEventListener('click', renderList);

  // ---------- Reader (with avatars) ----------
  let currentTopicId=null, readerTimer=null, typing=false, lastTyped=0, readerDelay=S.postRefresh;
  let currentOPContent = '';

  function openReader(){ reader.classList.add('open'); sep.style.display='block'; }
  function closeReader(){
      reader.classList.remove('open');
      sep.style.display='none';
      currentTopicId=null;
      if(readerTimer) clearTimeout(readerTimer);
      readerTimer=null;
      currentOPContent='';
      summaryBox.style.display = 'none';
      summaryBox.innerHTML = '';
      summaryBox.className = '';
  }

  // ★★★ 修复重点：同样为内容获取添加 Headers ★★★
  async function fetchTopic(id){
    const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';
    const r = await fetch(`/t/${id}.json?include_raw=0&_=${Date.now()}`, {
        credentials:'same-origin',
        headers: {
              'X-CSRF-Token': csrf,
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/json'
        }
    });
    if (r.status===429) throw {rate:true};
    if (!r.ok) throw new Error('HTTP '+r.status);
    return r.json();
  }

  function renderPost(p, owner){
    const ava = buildAvatar(p.avatar_template, 48, (p.username||'U')[0] || 'U');
    const u = p.username || '匿名';
    const ownerTag = (p.user_id === owner) ? '<span style="background:#d1f4f1;color:#0b8f86;border:1px solid #b7efe9;border-radius:999px;padding:0 6px;font-size:11px;margin-left:6px">楼主</span>' : '';
    return `<div style="background:rgba(255,255,255,.95);border:1px solid rgba(0,0,0,.06);border-radius:10px;padding:10px;margin-bottom:10px;display:flex;gap:10px;align-items:flex-start">
      <img src="${ava}" alt="${u}" style="width:32px;height:32px;border-radius:50%;border:2px solid var(--ldo-brand);flex:none;background:#fff">
      <div style="flex:1; min-width: 0;">
        <div style="font-size:12px;color:#555;margin-bottom:6px">${p.post_number}# @${u}${ownerTag}</div>
        ${p.cooked||''}
      </div>
    </div>`;
  }

  function renderTopic(d){
    const ps=d?.post_stream?.posts||[]; if(!ps.length){ rContent.innerHTML='<p>无内容</p>'; return; }
    const owner = ps[0].user_id;
    const main = ps[0];
    const replies = ps.slice(1);
    const hidden = Math.max(0, (d.posts_count||ps.length) - 1 - replies.length);
    let html = renderPost(main, owner) + replies.map(r=>renderPost(r, owner)).join('');
    if (hidden>0) html += `<div style="text-align:center;color:#777;font-size:12px">—— 还有 ${hidden} 条回复未显示 ——</div>`;
    rContent.innerHTML = html;

    const topicTitle = d.title || '无标题';
    const opText = stripHtml(main.cooked || '');
    currentOPContent = `标题：${topicTitle}\n\n内容：\n${opText}`;
  }

  async function refreshReader(){
    if (!currentTopicId) return;
    if (typing && Date.now()-lastTyped < 10000) { readerTimer=setTimeout(refreshReader, S.postRefresh); return; }
    try{
      const d = await fetchTopic(currentTopicId);
      const st = rContent.scrollTop;
      renderTopic(d);
      rContent.scrollTop = st;
      readerDelay = S.postRefresh;
    }catch(e){
      readerDelay = Math.min(30000, Math.max(readerDelay*2, S.postRefresh*2));
    }finally{
      readerTimer = setTimeout(refreshReader, jitter(readerDelay));
    }
  }

  function openTopic(id, title){
    currentTopicId = id;
    currentOPContent = '';
    summaryBox.style.display = 'none';
    summaryBox.innerHTML = '';
    summaryBox.className = '';

    rTitle.textContent = title || '帖子';
    rContent.innerHTML = '加载中…';
    openReader();
    readerDelay = S.postRefresh;
    fetchTopic(id).then(renderTopic).catch(e=>{ rContent.innerHTML = `<p style="color:#e11d48">加载失败：${e.message||e}</p>`; });
    if (readerTimer) clearTimeout(readerTimer);
    readerTimer = setTimeout(refreshReader, readerDelay);
  }

  listDiv.addEventListener('click', (e)=>{
    const card=e.target.closest('.ldo-card'); if(!card) return;
    openTopic(card.getAttribute('data-id'), card.querySelector('.ldo-title')?.textContent||'');
  });

  closeEl.addEventListener('click', (e)=>{ e.stopPropagation(); closeReader(); });
  sep.addEventListener('click', ()=> closeReader() );
  toolRefresh.addEventListener('click', ()=>{ if(currentTopicId) openTopic(currentTopicId, rTitle.textContent); });

  // --- 新增：打开原帖事件 ---
  toolOpen.addEventListener('click', () => {
      if (currentTopicId) {
          window.open(`/t/${currentTopicId}`, '_blank');
      }
  });
  // -----------------------

  rContent.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG' && !e.target.classList.contains('emoji')) {
          e.preventDefault();
          let imgSrc = e.target.src;
          const parentLink = e.target.closest('a');
          if (parentLink && parentLink.href.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
              imgSrc = parentLink.href;
          }
          showLightbox(imgSrc);
      }
  });

  // ---------- AI Summary ----------
  replySummarize.addEventListener('click', () => {
      if (!currentOPContent) {
          alert('帖子内容尚未加载完毕，请稍候…');
          return;
      }
      if (!S.API_KEY || S.API_KEY === 'sk-YOUR_API_KEY_HERE' || S.API_KEY === '') {
          alert('请先在脚本顶部 AI_SETTINGS.API_KEY 处设置您的API Key');
          return;
      }

      replySummarize.disabled = true;
      replySummarize.textContent = '总结中…';

      summaryBox.innerHTML = '<span id="ldo-summary-collapse" title="折叠">🔽</span>' + 'AI 正在生成总结，请稍候...';
      summaryBox.className = 'loading';
      summaryBox.style.display = 'block';

      const userPrompt = `帖子内容如下：\n\n${currentOPContent}\n\n----------\n\n请根据上述内容，帮我生成总结。`;

      GM_xmlhttpRequest({
          method: "POST",
          url: S.API_ENDPOINT,
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${S.API_KEY}`
          },
          data: JSON.stringify({
              model: S.MODEL,
              messages: [
                  { role: "system", content: S.SUMMARY_PROMPT },
                  { role: "user", content: userPrompt }
              ],
              stream: false
          }),
          onload: function(response) {
              try {
                  const data = JSON.parse(response.responseText);
                  const aiResponse = data?.choices?.[0]?.message?.content || '';
                  if (aiResponse) {
                      summaryBox.innerHTML = '<span id="ldo-summary-collapse" title="折叠">🔽</span>' + aiResponse.trim();
                      summaryBox.className = '';
                  } else {
                      throw new Error('AI 未返回有效内容【请检查脚本中 API-Key 等AI配置信息是否正确配置】');
                  }
              } catch (e) {
                  console.error('AI 总结响应解析失败:', e, response.responseText);
                  summaryBox.innerHTML = '<span id="ldo-summary-collapse" title="折叠">🔽</span>' + `AI 总结失败：${e.message || '无法解析响应'}`;
                  summaryBox.className = 'error';
              } finally {
                  replySummarize.disabled = false;
                  replySummarize.textContent = '📝 总结';
              }
          },
          onerror: function(error) {
              console.error('AI 总结请求失败:', error);
              summaryBox.innerHTML = '<span id="ldo-summary-collapse" title="折叠">🔽</span>' + `AI 总结请求失败：${error.statusText || '网络错误'}`;
              summaryBox.className = 'error';
              replySummarize.disabled = false;
              replySummarize.textContent = '📝 总结';
          }
      });
  });

  // --- 总结框折叠事件 ---
  summaryBox.addEventListener('click', (e) => {
      if (e.target.id === 'ldo-summary-collapse') {
          const btn = e.target;

          if (summaryBox.classList.contains('collapsed')) {
              summaryBox.classList.remove('collapsed');
              btn.textContent = '🔽';
              btn.title = '折叠';
          } else {
              summaryBox.classList.add('collapsed');
              btn.textContent = '🔼';
              btn.title = '展开';
          }
      }
  });
  // -----------------------------------------

  // Replies
  replyInput.addEventListener('input', ()=>{ typing=true; lastTyped=Date.now(); });
  replyInput.addEventListener('blur', ()=>{ lastTyped=Date.now(); setTimeout(()=> typing=false, 0); });
  replyInput.addEventListener('keydown', (e)=>{ if (e.key==='Enter' && !e.shiftKey){ e.preventDefault(); replySend.click(); }});
  async function sendReply(){
    if (!currentTopicId) return;
    const txt = replyInput.value.trim(); if (!txt) return;
    replySend.disabled=true;
    const csrf=document.querySelector('meta[name="csrf-token"]')?.content||'';
    const r=await fetch('/posts.json',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf,'X-Requested-With':'XMLHttpRequest'},body:JSON.stringify({raw:txt,topic_id:Number(currentTopicId)})});
    replySend.disabled=false;
    if(!r.ok){ alert('发送失败'); return; }
    replyInput.value='';
    try{ const d=await fetchTopic(currentTopicId); const st=rContent.scrollTop; renderTopic(d); rContent.scrollTop=st; }catch{}
    replyInput.focus();
  }
  replySend.addEventListener('click', sendReply);

  // Minimize
  minEl.addEventListener('click', ()=>{ dock.style.display='none'; fab.classList.add('visible'); });
  fab.addEventListener('click', ()=>{ dock.style.display='flex'; fab.classList.remove('visible'); });
})();