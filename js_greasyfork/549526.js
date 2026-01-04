// ==UserScript==
// @name         XJTU PPT Helper (multi-site)
// @namespace    https://XJTUPPTHelper.com/
// @version      1.0
// @description  在学习空间/课堂平台上列出 PPT 直链与预览，并一键复制 CSV/文本；
// @author       Monika & Noan Cliffe（在此作者基础上修改而来）
// @match        https://lms.xjtu.edu.cn/*
// @match        http://lms.xjtu.edu.cn/*
// @match        https://ispace.xjtu.edu.cn/*
// @match        http://ispace.xjtu.edu.cn/*
// @match        https://v-ispace.xjtu.edu.cn:*/*
// @match        http://v-ispace.xjtu.edu.cn:*/*
// @match        https://class.xjtu.edu.cn/*
// @match        http://class.xjtu.edu.cn/*
// @match        https://v-class.xjtu.edu.cn:*/*
// @match        http://v-class.xjtu.edu.cn:*/*
// @run-at       document-end
// @license      GPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549526/XJTU%20PPT%20Helper%20%28multi-site%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549526/XJTU%20PPT%20Helper%20%28multi-site%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- utils ----------
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const qs = (s, r = document) => r.querySelector(s);
    const json = (x) => { try { return JSON.parse(x); } catch { return null; } };
    const csvEscape = (s='') => `"${String(s).replace(/"/g,'""')}"`;
    const now = () => new Date().toLocaleTimeString();

    // ---------- style ----------
    const css = `
  #xjtu-ppt-helper{
    position:fixed; top:30px; right:30px; z-index:2147483647 !important; pointer-events:auto !important;
    background:rgba(28,28,28,.92); color:#eee; border:1px solid #444; border-radius:12px;
    box-shadow:0 10px 30px rgba(0,0,0,.35);
    width:520px; max-width:70vw; max-height:62vh; min-width:280px; min-height:140px;
    overflow:auto; resize:both; font:12px/1.4 system-ui,Segoe UI,Arial;
  }
  #xjtu-ppt-helper .hd{
    display:flex; align-items:center; justify-content:space-between;
    padding:10px 12px; border-bottom:1px solid #3a3a3a; cursor:move;
    user-select:none; -webkit-user-select:none;
  }
  #xjtu-ppt-helper .title{font-size:13px; font-weight:700}
  #xjtu-ppt-helper .actions a{color:#bbb; text-decoration:none; margin-left:12px}
  #xjtu-ppt-helper .actions a:hover{color:#fff}
  #xjtu-ppt-helper .toolbar{padding:8px 12px; border-bottom:1px dashed #3a3a3a}
  #xjtu-ppt-helper .toolbar .btn{display:inline-block; margin-right:10px}
  #xjtu-ppt-helper .bd{padding:8px 12px}
  #xjtu-ppt-helper .row{border-top:1px dashed #444; padding:10px 0}
  #xjtu-ppt-helper .row:first-child{margin-top:6px} /* 首行下移，避免头部遮挡错觉 */
  #xjtu-ppt-helper .name{font-weight:600}
  #xjtu-ppt-helper a{color:#9bd; text-decoration:none}
  #xjtu-ppt-helper a:hover{text-decoration:underline}
  #xjtu-ppt-helper .muted{opacity:.8}
  `;
    const style = document.createElement('style'); style.textContent = css; document.documentElement.append(style);

    // ---------- state ----------
    let currentActivityId = null;
    /** @type {{name:string, uploadId:number|null, refId:number|null, urlDirect:string|null, urlRef:string|null, urlAliyun:string|null}[]} */
    let items = [];

    // ---------- panel ----------
    function ensurePanel() {
        let p = qs('#xjtu-ppt-helper');
        if (p) return p;
        p = document.createElement('div');
        p.id = 'xjtu-ppt-helper';
        p.innerHTML = `
      <div class="hd" id="xjtu-ppt-handle">
        <div class="title">📄 PPT 列表</div>
        <div class="actions">
          <a href="javascript:void 0" id="xjtu-ppt-collapse" title="折叠/展开">—</a>
          <a href="javascript:void 0" id="xjtu-ppt-close" title="关闭">✕</a>
        </div>
      </div>
      <div class="toolbar">
        <a class="btn" href="javascript:void 0" id="xjtu-copy-csv">📋 复制全部（CSV）</a>
        <a class="btn" href="javascript:void 0" id="xjtu-copy-text">📋 复制全部（文本）</a>
        <span class="muted" id="xjtu-status"></span>
      </div>
      <div class="bd">
        <div id="xjtu-ppt-body">正在加载...</div>
      </div>
    `;
      document.body.appendChild(p);

      // 关闭 / 折叠
      p.querySelector('#xjtu-ppt-close').onclick = () => p.remove();
      p.querySelector('#xjtu-ppt-collapse').onclick = () => {
          const bd = p.querySelector('.bd'), tb = p.querySelector('.toolbar');
          const disp = (bd.style.display === 'none');
          bd.style.display = disp ? '' : 'none';
          tb.style.display = disp ? '' : 'none';
      };

      // 拖拽（用 left/top 定位）
      makeDraggable(p, p.querySelector('#xjtu-ppt-handle'));

      // 复制按钮
      p.querySelector('#xjtu-copy-csv').onclick = () => copyAll('csv');
      p.querySelector('#xjtu-copy-text').onclick = () => copyAll('text');

      return p;
  }

    function makeDraggable(el, handle) {
        let startX=0, startY=0, startLeft=0, startTop=0, dragging=false;

        const pt = (e) => e.touches?.[0] ? {x:e.touches[0].clientX, y:e.touches[0].clientY} : {x:e.clientX, y:e.clientY};

        const onDown = (e) => {
            e.preventDefault();
            const p = pt(e);
            startX = p.x; startY = p.y;
            startLeft = el.offsetLeft; startTop = el.offsetTop;
            dragging = true;
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
            document.addEventListener('touchmove', onMove, {passive:false});
            document.addEventListener('touchend', onUp);
            // 改用 left/top 自由拖动
            el.style.right = 'auto'; el.style.bottom = 'auto';
        };
        const onMove = (e) => {
            if (!dragging) return;
            e.preventDefault();
            const p = pt(e);
            const dx = p.x - startX, dy = p.y - startY;
            el.style.left = Math.max(0, startLeft + dx) + 'px';
            el.style.top  = Math.max(0, startTop  + dy) + 'px';
        };
        const onUp = () => {
            dragging = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onUp);
        };

        handle.addEventListener('mousedown', onDown);
        handle.addEventListener('touchstart', onDown, {passive:false});
    }

    function setStatus(msg) {
        const el = qs('#xjtu-status');
        if (el) el.textContent = `[${now()}] ${msg}`;
    }

    function renderList() {
        const panel = ensurePanel();
        const body = panel.querySelector('#xjtu-ppt-body');
        if (!items.length) {
            body.textContent = '未找到附件。';
            return;
        }
        body.innerHTML = '';
        for (const it of items) {
            const row = document.createElement('div');
            row.className = 'row';
            row.innerHTML = `
        <div class="name">${it.name} ${it.urlDirect ? '' : '<span class="muted">（缺少 upload_id）</span>'}</div>
        <div class="links">
          ${it.urlDirect ? `<a class="btn" href="${it.urlDirect}" target="_blank" title="同域直链下载">⬇️ 直下</a>` : ''}
          ${it.urlRef ? `<a class="btn" href="${it.urlRef}" target="_blank" title="引用下载（备用）">🧩 引用</a>` : ''}
          ${it.urlAliyun ? `<a class="btn" href="${it.urlAliyun}" target="_blank" title="阿里云 WebOffice 预览">🖥 预览</a>` : ''}
        </div>
        <div class="muted">upload_id: ${it.uploadId ?? 'N/A'} · ref_id: ${it.refId ?? 'N/A'}</div>
      `;
        body.appendChild(row);
    }
      setStatus(`共 ${items.length} 个附件`);
  }

    async function copyAll(kind) {
        if (!items.length) { setStatus('无可复制内容'); return; }

        let text = '';
        if (kind === 'csv') {
            const header = ['name','upload_id','ref_id','direct_url','ref_url','aliyun_preview'];
            text += header.map(csvEscape).join(',') + '\n';
            for (const it of items) {
                text += [
                    csvEscape(it.name),
                    csvEscape(it.uploadId ?? ''),
                    csvEscape(it.refId ?? ''),
                    csvEscape(it.urlDirect ?? ''),
                    csvEscape(it.urlRef ?? ''),
                    csvEscape(it.urlAliyun ?? '')
                ].join(',') + '\n';
            }
        } else {
            // 文本：每行 "name  TAB  direct_url"
            text = items.map(it => `${it.name}\t${it.urlDirect || it.urlRef || ''}`).join('\n');
        }

        // Clipboard API（需安全上下文，用户手势触发更稳妥）:contentReference[oaicite:2]{index=2}
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                // 退化方案：临时 textarea 选中复制
                const ta = document.createElement('textarea');
                ta.value = text; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta);
                ta.focus(); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
            }
            setStatus(kind === 'csv' ? '已复制 CSV' : '已复制文本');
        } catch (e) {
            setStatus('复制失败：' + e.message);
        }
    }

    // ---------- data adapters ----------
    function upsertFromUploadReferences(activityId, refs=[]) {
        const map = new Map(items.map(it => [String(it.uploadId||'r:'+it.refId), it]));
        for (const ref of refs) {
            const name = ref.name || ref.upload?.name || '未命名';
            const uploadId = ref.upload_id || ref.upload?.id || null;
            const refId = ref.id ?? null;
            const itKey = String(uploadId ?? `r:${refId ?? Math.random()}`);
            const urlDirect = uploadId ? `/api/uploads/${uploadId}/blob` : null;
            const urlRef = refId ? `/api/uploads/reference/${refId}/blob` : null;
            const urlAliyun = uploadId ? `/api/uploads/${uploadId}/preview/aliyun?preview=true&refer_id=${activityId}&refer_type=learning_activity` : null;

            const base = map.get(itKey) || {};
            map.set(itKey, { ...base, name, uploadId, refId, urlDirect, urlRef, urlAliyun });
        }
        items = Array.from(map.values());
        renderList();
    }

    function upsertFromUploads(activityId, uploads=[]) {
        const map = new Map(items.map(it => [String(it.uploadId||'r:'+it.refId), it]));
        for (const u of uploads) {
            const name = u.name || '未命名';
            const uploadId = u.id || null;
            const refId = u.reference_id || null;
            const itKey = String(uploadId ?? `r:${refId ?? Math.random()}`);
            const urlDirect = uploadId ? `/api/uploads/${uploadId}/blob` : null;
            const urlRef = refId ? `/api/uploads/reference/${refId}/blob` : null;
            const urlAliyun = uploadId ? `/api/uploads/${uploadId}/preview/aliyun?preview=true&refer_id=${activityId}&refer_type=learning_activity` : null;
            const base = map.get(itKey) || {};
            map.set(itKey, { ...base, name, uploadId, refId, urlDirect, urlRef, urlAliyun });
        }
        items = Array.from(map.values());
        renderList();
    }

    // ---------- proactive fetch for common patterns ----------
    function getActivityIdHeuristics() {
        // LMS: /course/21625/learning-activity#/95143  -> hash 里的数字
        const h = location.hash || '';
        const m = h.match(/#\/(\d+)/);
        if (m) return m[1];

        // 兜底：路径末尾数字
        const p = location.pathname.match(/(\d+)(?:\/?$)/);
        return p ? p[1] : null;
    }

    async function tryFetchCommonEndpoints() {
        currentActivityId = getActivityIdHeuristics();
        if (!currentActivityId) return;

        // 最常见：/api/activities/{id}/upload_references
        try {
            const r1 = await fetch(`/api/activities/${currentActivityId}/upload_references`, { credentials: 'same-origin' });
            if (r1.ok) {
                const d = await r1.json().catch(()=>null);
                if (d?.references?.length) {
                    upsertFromUploadReferences(currentActivityId, d.references);
                    setStatus(`主动拉取 /upload_references 成功`);
                    return;
                }
            }
        } catch {}

        // 次常见：/api/activities/{id}（含 uploads 列表）
        try {
            const r2 = await fetch(`/api/activities/${currentActivityId}`, { credentials: 'same-origin' });
            if (r2.ok) {
                const d = await r2.json().catch(()=>null);
                if (d?.uploads?.length) {
                    upsertFromUploads(currentActivityId, d.uploads);
                    setStatus(`主动拉取 /activities 含 uploads 成功`);
                    return;
                }
            }
        } catch {}
    }

    // ---------- passive sniffing (read-only) ----------
    function hookNetwork() {
        // fetch
        const _fetch = window.fetch;
        window.fetch = async (...args) => {
            const res = await _fetch(...args);
            try {
                const url = String(args[0]?.url || args[0] || '');
                if (/\/api\/activities\/\d+\/upload_references/.test(url)) {
                    const cloned = res.clone();
                    const d = await cloned.json().catch(()=>null);
                    if (d?.references) {
                        const aid = (url.match(/\/api\/activities\/(\d+)\/upload_references/)||[])[1] || getActivityIdHeuristics();
                        upsertFromUploadReferences(aid, d.references);
                        setStatus('被动捕获 upload_references');
                    }
                } else if (/\/api\/activities\/\d+(\?|$)/.test(url)) {
                    const cloned = res.clone();
                    const d = await cloned.json().catch(()=>null);
                    if (d?.uploads) {
                        const aid = (url.match(/\/api\/activities\/(\d+)/)||[])[1] || getActivityIdHeuristics();
                        upsertFromUploads(aid, d.uploads);
                        setStatus('被动捕获 activities.uploads');
                    }
                }
            } catch {}
            return res;
        };

        // XHR
        const _open = XMLHttpRequest.prototype.open;
        const _send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(m, u, ...rest){
            this._xjtu_url = String(u || '');
            return _open.call(this, m, u, ...rest);
        };
        XMLHttpRequest.prototype.send = function(...rest){
            this.addEventListener('load', function(){
                try {
                    const url = this._xjtu_url || this.responseURL || '';
                    if (this.status >= 200 && this.status < 300 && this.responseType === '' || this.responseType === 'text') {
                        if (/\/api\/activities\/\d+\/upload_references/.test(url)) {
                            const d = json(this.responseText);
                            if (d?.references) {
                                const aid = (url.match(/\/api\/activities\/(\d+)\/upload_references/)||[])[1] || getActivityIdHeuristics();
                                upsertFromUploadReferences(aid, d.references);
                                setStatus('被动捕获 upload_references (XHR)');
                            }
                        } else if (/\/api\/activities\/\d+(\?|$)/.test(url)) {
                            const d = json(this.responseText);
                            if (d?.uploads) {
                                const aid = (url.match(/\/api\/activities\/(\d+)/)||[])[1] || getActivityIdHeuristics();
                                upsertFromUploads(aid, d.uploads);
                                setStatus('被动捕获 activities.uploads (XHR)');
                            }
                        }
                    }
                } catch {}
            });
            return _send.apply(this, rest);
        };
    }

    // ---------- boot ----------
    async function boot() {
        ensurePanel();
        hookNetwork();
        // 初次尝试拉取常见接口
        await tryFetchCommonEndpoints();

        // SPA 路由切换（hashchange）时再试一次（LMS 场景常见）:contentReference[oaicite:3]{index=3}
        window.addEventListener('hashchange', () => setTimeout(tryFetchCommonEndpoints, 200));
    }

    boot();
})();
