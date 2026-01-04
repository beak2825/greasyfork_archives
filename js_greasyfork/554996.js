// ==UserScript==
// @name         ChatGPT-Exporter
// @namespace    qiusheng
// @version      2.2.0
// @description  导出当前/全部与ChatGPT的聊天记录（JSON 或 Markdown）
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-start
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @icon         https://chatgpt.com/favicon.ico
// @author       qiusheng
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554996/ChatGPT-Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/554996/ChatGPT-Exporter.meta.js
// ==/UserScript==

(() => {
  const U = {
    qs: (s, r=document) => r.querySelector(s),
    ce: (t, props={}, attrs={}) => { const el=document.createElement(t); Object.assign(el, props); for (const k in attrs) el.setAttribute(k, attrs[k]); return el; },
    sleep: (ms)=>new Promise(r=>setTimeout(r,ms)),
    nowStr: ()=>{const d=new Date(); const p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;},
    sanitize: s => (s||'untitled').replace(/[\\/:*?"<>|]+/g,'_').slice(0,80),
    isConvPage: ()=> /^\/c\/[0-9a-f-]+$/i.test(location.pathname) || /^\/g\/[^/]+\/c\/[0-9a-f-]+$/i.test(location.pathname),
    convId: ()=> {
      const m1 = location.pathname.match(/^\/c\/([0-9a-f-]+)$/i);
      if (m1) return m1[1] || '';
      const m2 = location.pathname.match(/^\/g\/[^/]+\/c\/([0-9a-f-]+)$/i);
      return (m2 && m2[1]) || '';
    },
    projectId: ()=> {
      const m = location.pathname.match(/^\/g\/([^/]+)\/c\/[0-9a-f-]+$/i);
      return (m && m[1]) || '';
    },
    isHostOK: ()=> location.host.endsWith('chatgpt.com') || location.host.endsWith('chat.openai.com'),
    on: (t,fn)=>window.addEventListener(t,fn),
    emit:(t,d)=>window.dispatchEvent(new CustomEvent(t,{detail:d})),
    ts: s => { if(!s && s!==0) return ''; const n = typeof s==='number'? s : Number(s); const ms = n>1e12?n:(n*1000); const d=new Date(ms); return isFinite(d)? d.toISOString().replace('T',' ').replace('Z',' UTC') : ''; },
    isoToStamp: (s)=>{ if(!s) return ''; const d=new Date(s); if(!isFinite(d)) return ''; const p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`; }
  };

  const MAX_CONCURRENCY = 5;

  const Cred = (() => {
    let token = null, accountId = null, lastTs = 0, lastErr = '';

    const mask = (s, keepL=8, keepR=6) => {
      if (!s) return '';
      if (s.length <= keepL + keepR) return s;
      return `${s.slice(0, keepL)}…${s.slice(-keepR)}`;
    };

    const ensureViaSession = async (tries=4) => {
      for (let i=0;i<tries;i++){
        try{
          const r = await fetch('/api/auth/session', {credentials:'include'});
          if (r.ok){
            const j = await r.json().catch(()=>({}));
            if (j && j.accessToken){ token = j.accessToken; lastErr=''; lastTs = Date.now(); }
            if (!accountId){
              const m = document.cookie.match(/(?:^|;\s*)_account=([^;]+)/);
              if (m) accountId = decodeURIComponent(m[1]);
            }
            U.emit('cgptx-cred-update', { token, accountId });
            if (token) return true;
          }else{
            lastErr = `session ${r.status}`;
            U.emit('cgptx-cred-update', { token, accountId });
          }
        }catch(e){ lastErr = e && e.message ? e.message : 'session_error'; U.emit('cgptx-cred-update', { token, accountId }); }
        await U.sleep(300 * (i+1));
      }
      return !!token;
    };

    const getAuthHeaders = () => {
      const h = new Headers();
      if (token) h.set('authorization', `Bearer ${token}`);
      if (accountId) h.set('chatgpt-account-id', accountId);
      return h;
    };

    const debugText = () => {
      const ts = lastTs ? new Date(lastTs).toLocaleString() : '—';
      const tok = token ? mask(token) : '未获取';
      const acc = accountId || '未获取';
      const err = lastErr ? `\n错误：${lastErr}` : '';
      return `Token：${tok}\nAccount：${acc}\n更新时间：${ts}${err}`;
    };

    return {
      get token(){return token;},
      get accountId(){return accountId;},
      get last(){return lastTs;},
      get debug(){return debugText();},
      ensureViaSession, getAuthHeaders,
    };
  })();

  const Net = (() => {
    const base = () => location.origin;
    const mergeHeaders = (a,b)=>{const h=new Headers(a||{}); (b||new Headers()).forEach((v,k)=>h.set(k,v)); return h;};
    const backoff = (i)=>U.sleep(Math.min(15000,500*Math.pow(1.8,i)));

    const req = async (url, opt={}, expectJson=true, attempt=0) => {
      if (!Cred.token) await Cred.ensureViaSession(6);
      const h = mergeHeaders(opt.headers, Cred.getAuthHeaders());
      const init = Object.assign({credentials:'include'}, opt, { headers:h });
      const resp = await fetch(url, init).catch(()=>null);
      if (!resp) throw new Error('network_failed');
      if (resp.status === 401 && attempt < 2){ await Cred.ensureViaSession(6); return req(url,opt,expectJson,attempt+1); }
      if ((resp.status===429 || resp.status>=500) && attempt<5){ await backoff(attempt); return req(url,opt,expectJson,attempt+1); }
      if (!resp.ok){ const t = await resp.text().catch(()=> ''); throw new Error(`http_${resp.status}:${t.slice(0,160)}`); }
      return expectJson ? resp.json() : resp.blob();
    };

    const list = (p={})=>{
      const {is_archived, is_starred, offset=0, limit=50, order='updated'} = p;
      const q = new URLSearchParams({
        offset:String(offset), limit:String(limit), order:String(order),
        ...(typeof is_archived==='boolean'?{is_archived:String(is_archived)}:{}),
        ...(typeof is_starred==='boolean'?{is_starred:String(is_starred)}:{}),
      });
      return req(`${base()}/backend-api/conversations?${q.toString()}`, {method:'GET'});
    };

    const getConv = (id, projectId)=>{
      const headers = projectId ? {'chatgpt-project-id': projectId} : undefined;
      return req(`${base()}/backend-api/conversation/${id}`, {method:'GET', headers});
    };

    const listGizmosSidebar = (p={}) => {
      const { conversations_per_gizmo=20, owned_only=true, cursor=null } = p;
      const n = Math.min(typeof conversations_per_gizmo==='number'?conversations_per_gizmo:20, 20);
      const q = new URLSearchParams({
        conversations_per_gizmo:String(n),
        owned_only:String(owned_only)
      });
      if (cursor) q.set('cursor', cursor);
      return req(`${base()}/backend-api/gizmos/snorlax/sidebar?${q.toString()}`, {method:'GET'});
    };

    return { list, getConv, listGizmosSidebar };
  })();

  const MD = (() => {
    const roleZh = r => ({user:'用户',assistant:'助手',system:'系统',tool:'工具'})[r] || r || '未知';
    const joinParts = parts => Array.isArray(parts) ? parts.map(x=>String(x||'')).join('\n\n').trim() : String(parts||'').trim();
    const modelFrom = (msg, conv) => (msg?.metadata?.model_slug || msg?.metadata?.default_model_slug || conv?.default_model_slug || '').trim();

    const nodesToArray = (mapping) => {
      const arr = [];
      if (!mapping || typeof mapping!=='object') return arr;
      for (const k of Object.keys(mapping)) {
        const n = mapping[k];
        if (!n || !n.message) continue;
        const m = n.message;
        arr.push({
          id: n.id || m.id || k,
          role: m.author?.role || '',
          create_time: m.create_time ?? null,
          content: m.content || {},
          metadata: m.metadata || {},
          channel: m.channel || null
        });
      }
      return arr;
    };

    const shouldSkip = (msg) => {
      const ct = msg.content?.content_type;
      if (msg.role==='system') {
        if (ct==='text' && joinParts(msg.content?.parts)==='') return true;
        if (ct==='model_editable_context' && !msg.content?.model_set_context) return true;
      }
      if (ct==='text' && joinParts(msg.content?.parts)==='') return true;
      return false;
    };

    const fmtThoughts = (content) => {
      const t = content?.thoughts;
      if (!Array.isArray(t) || t.length===0) return '';
      const lines = [];
      lines.push('> **思考**');
      t.forEach((it,idx)=>{
        const head = it?.summary ? `**${idx+1}. ${it.summary}**` : `**${idx+1}.**`;
        const body = (it?.content || (Array.isArray(it?.chunks)? it.chunks.join('\n'): '') || '').trim();
        if (body) lines.push(`${head}\n\n${body}`);
        else lines.push(head);
      });
      return lines.join('\n\n');
    };

    const fmtRecap = (c) => {
      const s = (typeof c?.content==='string'? c.content : '').trim();
      return s ? `*思考小结：${s}*` : '';
    };

    const fmtText = (c) => joinParts(c?.parts);

    const fmtContext = (c) => {
      const s = (c?.model_set_context || '').trim();
      return s ? `> 上下文\n\n${s}` : '';
    };

    const renderMsg = (m, conv) => {
      if (shouldSkip(m)) return '';
      const role = roleZh(m.role);
      const model = modelFrom(m, conv);
      const tstr = U.ts(m.create_time);
      const head = `**${role}${model?` (${model})`:''}${tstr?` — ${tstr}`:''}**`;
      const ct = m.content?.content_type;
      let body = '';
      if (ct==='text') body = fmtText(m.content);
      else if (ct==='thoughts') body = fmtThoughts(m.content);
      else if (ct==='reasoning_recap') body = fmtRecap(m.content);
      else if (ct==='model_editable_context') body = fmtContext(m.content);
      else body = '```json\n' + JSON.stringify(m.content, null, 2) + '\n```';
      if (!body) return '';
      return `${head}\n\n${body}`;
    };

    const conversationToMD = (conv) => {
      const title = conv?.title || 'untitled';
      const id = conv?.conversation_id || conv?.id || '';
      const projId = conv?.gizmo_id || conv?.conversation_template_id || conv?.project_id || '';
      let linkLine = null;
      if (id) {
        if (projId) linkLine = `- 链接: https://chatgpt.com/g/${projId}/c/${id}`;
        else linkLine = `- 链接: https://chatgpt.com/c/${id}`;
      }
      const meta = [
        `- 会话ID: ${id}`,
        conv?.workspace_id ? `- 工作区: ${conv.workspace_id}` : null,
        conv?.gizmo_type ? `- Gizmo: ${conv.gizmo_type}` : null,
        conv?.create_time ? `- 创建: ${U.ts(conv.create_time)}` : null,
        conv?.update_time ? `- 更新: ${U.ts(conv.update_time)}` : null,
        conv?.default_model_slug ? `- 默认模型: ${conv.default_model_slug}` : null,
        linkLine
      ].filter(Boolean).join('\n');

      const nodes = nodesToArray(conv?.mapping);
      nodes.sort((a,b)=>{
        const ta = a.create_time ?? 0, tb = b.create_time ?? 0;
        if (ta!==tb) return ta - tb;
        return String(a.id).localeCompare(String(b.id));
      });

      const lines = [];
      lines.push(`# ${title}\n`);
      if (meta) lines.push(meta, '\n---\n');
      for (const m of nodes){
        const s = renderMsg(m, conv);
        if (s) lines.push(s, '\n');
      }
      if (Array.isArray(conv?.safe_urls) && conv.safe_urls.length){
        lines.push('---\n**参考链接**\n');
        conv.safe_urls.forEach(u=> lines.push(`- ${u}`));
        lines.push('');
      }
      return lines.join('\n').trim() + '\n';
    };

    return { conversationToMD };
  })();

  const UI = (() => {
    let panel, btn, btnCur, btnAll, btnCurMD, btnAllMD, barWrap, bar, info, badge, stopBtn;
    let exporting=false, cancel=false, opening=false, isOpen=false, autoHideTimer=null;
    const DIST=100, DELAY=2000;

    const css = `
      .cgptx-fab{position:fixed;right:18px;bottom:18px;z-index:2147483647;}
      .cgptx-btn{width:48px;height:48px;border:none;border-radius:14px;cursor:pointer;background:#111827;color:#fff;
        box-shadow:0 8px 22px rgba(0,0,0,.22);display:flex;align-items:center;justify-content:center;transition:.2s;opacity:.95}
      .cgptx-btn:hover{transform:translateY(-1px);opacity:1}

      .cgptx-panel{position:fixed;right:18px;bottom:74px;width:clamp(260px,30vw,320px);
        background:#fffffff5;border:1px solid #e6e6e7;border-radius:18px;box-shadow:0 16px 36px rgba(17,24,39,.18);
        backdrop-filter:saturate(1.1) blur(6px);padding:14px 14px 12px;z-index:2147483647;
        opacity:0;transform:translateY(10px) scale(.98);transition:opacity .4s ease, transform .4s ease;pointer-events:none}
      .cgptx-panel.cgptx-open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}

      .cgptx-ttl{font-size:15px;color:#0f172a;margin-bottom:10px;font-weight:700;letter-spacing:.2px;text-align:center}

      .cgptx-col{display:flex;flex-direction:column;gap:10px;margin-top:4px}
      .cgptx-a{width:100%;height:42px;border-radius:12px;border:1px solid #e6e6e7;background:#f8fafc;color:#0f172a;cursor:pointer;
        font-size:14px;font-weight:600;letter-spacing:.2px;display:flex;align-items:center;justify-content:center;line-height:1.15;padding:6px 10px;transition:.15s}
      .cgptx-a:hover{background:#f3f5f7;border-color:#dfe3e9;transform:translateY(-0.5px)}
      .cgptx-a:active{transform:translateY(0)}

      .cgptx-progress{margin-top:12px;background:#f2f3f5;border-radius:10px;height:10px;overflow:hidden;display:none}
      .cgptx-bar{height:100%;width:0%;background:#4b8df8;transition:width .25s}
      .cgptx-progtext{margin-top:6px;font-size:12px;color:#4b5563;display:none}

      .cgptx-badges{margin-top:10px}
      .cgptx-badge{width:100%;min-height:42px;border-radius:12px;border:1px solid #e6e6e7;background:#f8fafc;color:#374151;
        display:flex;align-items:center;justify-content:center;gap:8px;font-size:13px;font-weight:600;letter-spacing:.2px;text-align:center;padding:6px 10px;
        user-select:text;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .cgptx-badge:hover{background:#f3f5f7;border-color:#dfe3e9}
      .cgptx-chip{font-weight:800}
      .cgptx-chip.ok{color:#0a7d39}
      .cgptx-chip.bad{color:#c02626}

      .cgptx-stop{margin-top:10px;width:100%;height:36px;border-radius:10px;border:1px solid #ffd9d9;background:#fff5f5;color:#b60000;display:none;cursor:pointer}
    `;

    const mount = () => {
      if (U.qs('#cgptx-style')) return;
      document.head.appendChild(U.ce('style', { id:'cgptx-style', textContent: css }));
      const root = U.ce('div', { className:'cgptx-fab' });
      btn = U.ce('button', { className:'cgptx-btn', innerHTML:'⬇︎' });
      panel = U.ce('div', { className:'cgptx-panel' });
      const ttl = U.ce('div', { className:'cgptx-ttl', textContent:'ChatGPT 对话导出' });

      btnCur = U.ce('button', { className:'cgptx-a', textContent:'导出当前对话（JSON）' });
      btnAll = U.ce('button', { className:'cgptx-a', textContent:'导出全部对话（JSON, ZIP）' });
      btnCurMD = U.ce('button', { className:'cgptx-a', textContent:'导出当前对话（MD）' });
      btnAllMD = U.ce('button', { className:'cgptx-a', textContent:'导出全部对话（MD, ZIP）' });
      const col = U.ce('div', { className:'cgptx-col' }); col.append(btnCur, btnAll, btnCurMD, btnAllMD);

      barWrap = U.ce('div', { className:'cgptx-progress' });
      bar = U.ce('div', { className:'cgptx-bar' }); barWrap.append(bar);
      info = U.ce('div', { className:'cgptx-progtext' });
      const badges = U.ce('div', { className:'cgptx-badges' });
      badge = U.ce('div', { className:'cgptx-badge', textContent:'凭证: 初始化中…' });
      badges.append(badge);
      stopBtn = U.ce('button', { className:'cgptx-stop', textContent:'停止导出' });

      panel.append(ttl, col, barWrap, info, badges, stopBtn);
      root.append(btn);
      document.body.append(root, panel);

      btn.onclick = onFabClick;
      btnCur.onclick = exportCurrentJSON;
      btnAll.onclick = exportAllJSON;
      btnCurMD.onclick = exportCurrentMD;
      btnAllMD.onclick = exportAllMD;
      stopBtn.onclick = ()=>{ cancel=true; };

      U.on('cgptx-cred-update', updateBadge);
      tickBadge();
      refreshButtons();
      document.addEventListener('mousemove', onDocMouseMove, {passive:true});
    };

    const onFabClick = async () => {
      if (opening) return;
      opening = true;
      btn.disabled = true;
      try{
        await Cred.ensureViaSession(6);
        updateBadge();
        if (isOpen) closePanel(); else openPanel();
      } finally {
        btn.disabled = false;
        opening = false;
      }
    };

    const openPanel = () => {
      if (isOpen) return;
      clearAutoHide();
      panel.classList.add('cgptx-open');
      isOpen = true;
      refreshButtons();
    };

    const closePanel = () => {
      if (!isOpen) return;
      clearAutoHide();
      panel.classList.remove('cgptx-open');
      isOpen = false;
    };

    const onDocMouseMove = (e) => {
      if (!isOpen) return;
      const r = panel.getBoundingClientRect();
      const insidePad = (
        e.clientX >= r.left - DIST &&
        e.clientX <= r.right + DIST &&
        e.clientY >= r.top - DIST &&
        e.clientY <= r.bottom + DIST
      );
      if (!insidePad) {
        if (!autoHideTimer) autoHideTimer = setTimeout(()=>{ closePanel(); }, DELAY);
      } else {
        clearAutoHide();
      }
    };

    const clearAutoHide = () => {
      if (autoHideTimer){ clearTimeout(autoHideTimer); autoHideTimer=null; }
    };

    const tickBadge = () => {
      const t = setInterval(()=>{
        updateBadge();
        if (Cred.token && Cred.accountId){ clearInterval(t); }
      }, 800);
    };

    const updateBadge = () => {
      const okT = !!Cred.token;
      const okA = !!Cred.accountId;
      badge.innerHTML = `凭证： <span class="cgptx-chip ${okT?'ok':'bad'}">${okT?'Token✔':'Token✖'}</span> / <span class="cgptx-chip ${okA?'ok':'bad'}">${okA?'Account✔':'Account✖'}</span>`;
      badge.title = Cred.debug;
      badge.style.background = (okT && okA) ? '#e8f7ee' : '#fff5f5';
      badge.style.borderColor = (okT && okA) ? '#b7e3c9' : '#ffd9d9';
    };

    const refreshButtons = () => {
      const showCur = U.isConvPage();
      btnCur.style.display = showCur ? 'block' : 'none';
      btnCurMD.style.display = showCur ? 'block' : 'none';
    };

    const setProg = (p, text)=>{ barWrap.style.display='block'; info.style.display='block'; bar.style.width=Math.max(0,Math.min(100,p))+'%'; info.textContent=text||''; };
    const resetProg = ()=>{ barWrap.style.display='none'; info.style.display='none'; bar.style.width='0%'; info.textContent=''; };

    const saveBlob = (blob, name) => {
      if (typeof saveAs === 'function') saveAs(blob, name);
      else { const a = U.ce('a',{href:URL.createObjectURL(blob),download:name}); document.body.appendChild(a); a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),3000); a.remove(); }
    };

    const fetchConvWithRetry = async (id, projectId, retries=2) => {
      let attempt = 0;
      let lastErr = null;
      while (attempt <= retries){
        if (cancel) throw new Error('已停止');
        try{
          return await Net.getConv(id, projectId);
        }catch(e){
          lastErr = e;
          attempt++;
          if (attempt > retries) break;
          const delay = 500 * Math.pow(2, attempt-1);
          await U.sleep(delay);
        }
      }
      throw lastErr || new Error('fetch_failed');
    };

    const fetchAllConversations = async (tasks, concurrency, progressCb) => {
      const total = tasks.length;
      if (!total) return [];
      const results = new Array(total);
      let done = 0;
      let index = 0;
      let fatalErr = null;

      const worker = async () => {
        while (true){
          if (cancel || fatalErr) return;
          const i = index++;
          if (i >= total) return;
          const t = tasks[i];
          try{
            const data = await fetchConvWithRetry(t.id, t.projectId, 2);
            results[i] = data;
            done++;
            const pct = total ? Math.round(done/total*100) : 5;
            if (progressCb) progressCb(pct, `导出中：${done}/${total}`);
          }catch(e){
            fatalErr = e;
            return;
          }
        }
      };

      const n = Math.max(1, Math.min(concurrency || 1, total));
      const workers = [];
      for (let i=0;i<n;i++) workers.push(worker());
      await Promise.all(workers);
      if (fatalErr) throw fatalErr;
      return results;
    };

    const buildProjectFolderNames = (projects) => {
      const map = new Map();
      const counts = {};
      projects.forEach(p=>{
        const base = U.sanitize(p.projectName || p.projectId || 'project');
        counts[base] = (counts[base] || 0) + 1;
      });
      projects.forEach(p=>{
        let baseName = U.sanitize(p.projectName || p.projectId || 'project');
        if (counts[baseName] > 1) {
          const stamp = p.createdAt ? U.isoToStamp(p.createdAt) : '';
          if (stamp) {
            const raw = p.projectName || baseName;
            baseName = U.sanitize(`${raw}_${stamp}`);
          }
        }
        map.set(p.projectId, baseName || 'project');
      });
      return map;
    };

    const exportCurrentJSON = async () => {
      if (exporting) return; exporting=true; cancel=false; setProg(3,'准备中…');
      try{
        await Cred.ensureViaSession(6); updateBadge();
        const id = U.convId(); if (!id) throw new Error('no_conv_id');
        const pid = U.projectId();
        const j = await Net.getConv(id, pid || undefined);
        const title = U.sanitize(j?.title || '');
        const blob = new Blob([JSON.stringify(j,null,2)], {type:'application/json'});
        saveBlob(blob, `${title}_${id}.json`);
        setProg(100,'完成');
      }catch(e){ setProg(0,`失败：${e.message||e}`); }
      finally{ setTimeout(resetProg,1200); exporting=false; }
    };

    const exportAllJSON = async () => {
      if (exporting) return; exporting=true; cancel=false; stopBtn.style.display='block'; setProg(2,'扫描列表…');
      try{
        await Cred.ensureViaSession(6); updateBadge();
        const all = await collectAllIds(setProg);
        const rootIds = all.rootIds || [];
        const projects = Array.isArray(all.projects) ? all.projects : [];
        const tasks = [];
        rootIds.forEach(id => {
          tasks.push({kind:'root', id, projectId:null});
        });
        projects.forEach(p => {
          const convs = Array.isArray(p.convs)?p.convs:[];
          convs.forEach(c=>{
            tasks.push({kind:'proj', id:c.id, projectId:p.projectId});
          });
        });
        const totalConvs = tasks.length;
        if (!totalConvs && !projects.length) throw new Error('列表为空');

        const zip = new JSZip();
        zip.file('summary.json', JSON.stringify({
          exportedAt:new Date().toISOString(),
          total:totalConvs,
          root:{count:rootIds.length, ids:rootIds},
          projects:projects.map(p=>({
            projectId:p.projectId,
            projectName:p.projectName,
            createdAt:p.createdAt || '',
            conversationIds:(p.convs||[]).map(c=>c.id)
          }))
        }, null, 2));

        const results = await fetchAllConversations(tasks, MAX_CONCURRENCY, (pct,text)=>setProg(pct,text));
        if (cancel) throw new Error('已停止');

        const convDataMap = new Map();
        tasks.forEach((t,i)=>{
          if (results[i]) convDataMap.set(t.id, results[i]);
        });

        const folderNameByProjectId = buildProjectFolderNames(projects);

        let idxRoot=0;
        for (const id of rootIds){
          if (cancel) throw new Error('已停止');
          const data = convDataMap.get(id);
          if (!data) continue;
          const title = U.sanitize(data?.title || 'untitled');
          idxRoot++;
          const seq = String(idxRoot).padStart(3,'0');
          zip.file(`${seq}_${title}_${id}.json`, JSON.stringify(data, null, 2));
        }

        projects.forEach(p=>{
          const folderName = folderNameByProjectId.get(p.projectId) || U.sanitize(p.projectName || p.projectId || 'project');
          const folder = zip.folder(folderName);
          if (!folder) return;
          const convs = Array.isArray(p.convs)?p.convs:[];
          let idx = 0;
          convs.forEach(c=>{
            if (cancel) return;
            const data = convDataMap.get(c.id);
            if (!data) return;
            const title = U.sanitize(data?.title || c.title || 'untitled');
            idx++;
            const seq = String(idx).padStart(3,'0');
            folder.file(`${seq}_${title}_${c.id}.json`, JSON.stringify(data, null, 2));
          });
        });

        setProg(98,'压缩中…');
        const blob = await zip.generateAsync({type:'blob', compression:'DEFLATE', compressionOptions:{level:9}});
        saveBlob(blob, `chatgpt-conversations-json-${U.nowStr()}.zip`);
        setProg(100,'完成');
      }catch(e){ setProg(0,`失败：${e.message||e}`); }
      finally{ setTimeout(()=>{ resetProg(); stopBtn.style.display='none'; },1400); exporting=false; cancel=false; }
    };

    const exportCurrentMD = async () => {
      if (exporting) return; exporting=true; cancel=false; setProg(3,'准备中…');
      try{
        await Cred.ensureViaSession(6); updateBadge();
        const id = U.convId(); if (!id) throw new Error('no_conv_id');
        const pid = U.projectId();
        const j = await Net.getConv(id, pid || undefined);
        const md = MD.conversationToMD({...j, conversation_id: id, gizmo_id: pid || j?.gizmo_id});
        const title = U.sanitize(j?.title || '');
        const blob = new Blob([md], {type:'text/markdown;charset=utf-8'});
        saveBlob(blob, `${title}_${id}.md`);
        setProg(100,'完成');
      }catch(e){ setProg(0,`失败：${e.message||e}`); }
      finally{ setTimeout(resetProg,1200); exporting=false; }
    };

    const exportAllMD = async () => {
      if (exporting) return; exporting=true; cancel=false; stopBtn.style.display='block'; setProg(2,'扫描列表…');
      try{
        await Cred.ensureViaSession(6); updateBadge();
        const all = await collectAllIds(setProg);
        const rootIds = all.rootIds || [];
        const projects = Array.isArray(all.projects) ? all.projects : [];
        const tasks = [];
        rootIds.forEach(id => {
          tasks.push({kind:'root', id, projectId:null});
        });
        projects.forEach(p => {
          const convs = Array.isArray(p.convs)?p.convs:[];
          convs.forEach(c=>{
            tasks.push({kind:'proj', id:c.id, projectId:p.projectId});
          });
        });
        const totalConvs = tasks.length;
        if (!totalConvs && !projects.length) throw new Error('列表为空');

        const zip = new JSZip();
        zip.file('summary.json', JSON.stringify({
          exportedAt:new Date().toISOString(),
          total:totalConvs,
          root:{count:rootIds.length, ids:rootIds},
          projects:projects.map(p=>({
            projectId:p.projectId,
            projectName:p.projectName,
            createdAt:p.createdAt || '',
            conversationIds:(p.convs||[]).map(c=>c.id)
          }))
        }, null, 2));

        const results = await fetchAllConversations(tasks, MAX_CONCURRENCY, (pct,text)=>setProg(pct,text));
        if (cancel) throw new Error('已停止');

        const convDataMap = new Map();
        tasks.forEach((t,i)=>{
          if (results[i]) convDataMap.set(t.id, results[i]);
        });

        const folderNameByProjectId = buildProjectFolderNames(projects);

        let idxRoot=0;
        for (const id of rootIds){
          if (cancel) throw new Error('已停止');
          const data = convDataMap.get(id);
          if (!data) continue;
          const md = MD.conversationToMD({...data, conversation_id: id});
          const title = U.sanitize(data?.title || 'untitled');
          idxRoot++;
          const seq = String(idxRoot).padStart(3,'0');
          zip.file(`${seq}_${title}_${id}.md`, md);
        }

        projects.forEach(p=>{
          const folderName = folderNameByProjectId.get(p.projectId) || U.sanitize(p.projectName || p.projectId || 'project');
          const folder = zip.folder(folderName);
          if (!folder) return;
          const convs = Array.isArray(p.convs)?p.convs:[];
          let idx = 0;
          convs.forEach(c=>{
            if (cancel) return;
            const data = convDataMap.get(c.id);
            if (!data) return;
            const md = MD.conversationToMD({...data, conversation_id: c.id, gizmo_id: p.projectId});
            const title = U.sanitize(data?.title || c.title || 'untitled');
            idx++;
            const seq = String(idx).padStart(3,'0');
            folder.file(`${seq}_${title}_${c.id}.md`, md);
          });
        });

        setProg(98,'压缩中…');
        const blob = await zip.generateAsync({type:'blob', compression:'DEFLATE', compressionOptions:{level:9}});
        saveBlob(blob, `chatgpt-conversations-md-${U.nowStr()}.zip`);
        setProg(100,'完成');
      }catch(e){ setProg(0,`失败：${e.message||e}`); }
      finally{ setTimeout(()=>{ resetProg(); stopBtn.style.display='none'; },1400); exporting=false; cancel=false; }
    };

    const collectAllIds = async (progressCb) => {
      const combos = [
        {is_archived:false,is_starred:false},
        {is_archived:true,is_starred:false},
        {is_archived:false,is_starred:true},
        {is_archived:true,is_starred:true},
      ];
      const rootSet = new Set();
      const projectMap = new Map();

      const addRoot = (id) => {
        if (!id) return;
        rootSet.add(id);
      };

      const addProjectConv = (projectId, id, title) => {
        if (!projectId || !id) return;
        let rec = projectMap.get(projectId);
        if (!rec) {
          rec = { projectId, projectName:'', createdAt:'', convs:[] };
          projectMap.set(projectId, rec);
        }
        if (!rec.convs.some(x=>x.id===id)) {
          rec.convs.push({id, title: title || ''});
        }
        if (rootSet.has(id)) rootSet.delete(id);
      };

      for (const c of combos){
        let offset=0, limit=50;
        while(true){
          const page = await Net.list({...c, offset, limit, order:'updated'});
          const arr = Array.isArray(page?.items)?page.items:[];
          arr.forEach(it=>{
            if (!it || !it.id) return;
            const id = it.id;
            const projId = it.conversation_template_id || it.gizmo_id || null;
            if (projId) addProjectConv(projId, id, it.title || '');
            else addRoot(id);
          });
          const total = Number(page?.total||0); const got = offset + arr.length;
          if (progressCb) progressCb(5,`扫描：${Math.min(got,total)}/${total}（档:${c.is_archived?'Y':'N'}/星:${c.is_starred?'Y':'N'}）`);
          if (!arr.length || got >= total) break;
          offset += limit; await U.sleep(200);
        }
      }

      try{
        let cursor = null;
        let pageIndex = 0;
        do {
          const sidebar = await Net.listGizmosSidebar({ cursor });
          const items = Array.isArray(sidebar?.items)?sidebar.items:[];
          pageIndex++;
          let idx = 0;

          for (const it of items){
            idx++;
            const g = it && it.gizmo && it.gizmo.gizmo;
            if (!g || !g.id) {
              if (progressCb) progressCb(5, `扫描项目第${pageIndex}页：${idx}/${items.length}`);
              continue;
            }
            const pid = g.id;
            const pname = (g.display && g.display.name) || '';
            const createdAt = g.created_at || '';
            let rec = projectMap.get(pid);
            if (!rec) {
              rec = { projectId: pid, projectName: pname || pid, createdAt, convs:[] };
              projectMap.set(pid, rec);
            } else {
              if (!rec.projectName && pname) rec.projectName = pname;
              if (!rec.createdAt && createdAt) rec.createdAt = createdAt;
            }
            const convItems = it && it.conversations && Array.isArray(it.conversations.items) ? it.conversations.items : [];
            convItems.forEach(cv=>{
              if (!cv || !cv.id) return;
              addProjectConv(pid, cv.id, cv.title || '');
            });
            if (progressCb) progressCb(5, `扫描项目第${pageIndex}页：${idx}/${items.length}`);
          }

          cursor = sidebar && sidebar.cursor ? sidebar.cursor : null;
        } while (cursor);
      }catch(e){}

      const rootIds = Array.from(rootSet);
      const projects = Array.from(projectMap.values());
      return { rootIds, projects };
    };

    const hookHistory = () => {
      const ps = history.pushState, rs = history.replaceState;
      history.pushState = function(){ const r=ps.apply(this,arguments); U.emit('cgptx-url'); return r; };
      history.replaceState = function(){ const r=rs.apply(this,arguments); U.emit('cgptx-url'); return r; };
      window.addEventListener('popstate', ()=>U.emit('cgptx-url'));
      window.addEventListener('cgptx-url', ()=>{ refreshButtons(); });
    };

    return { mount, hookHistory };
  })();

  const boot = async () => {
    if (!U.isHostOK()) return;
    UI.hookHistory();
    document.addEventListener('DOMContentLoaded', UI.mount);
  };
  boot();
})();
