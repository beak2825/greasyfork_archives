// ==UserScript==
// @name         Gemini Business to Notion Exporter
// @namespace    http://tampermonkey.net/
// @version      1.4
// @license      MIT
// @description  business.gemini.google 导出到 Notion：智能图片归位 (支持 PicList/PicGo)+隐私开关+单个对话导出
// @author       Wyih
// @match        https://business.gemini.google/*
// @connect      api.notion.com
// @connect      127.0.0.1
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/560435/Gemini%20Business%20to%20Notion%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/560435/Gemini%20Business%20to%20Notion%20Exporter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PICLIST_URL = "http://127.0.0.1:36677/upload";
  const ASSET_PLACEHOLDER_PREFIX = "PICLIST_WAITING::";
  const MAX_TEXT_LENGTH = 2000;

  // ------------------- PicList Heartbeat -------------------
  function checkPicListConnection() {
    GM_xmlhttpRequest({
      method: "GET", url: "http://127.0.0.1:36677/heartbeat", timeout: 2000,
      onload: (res) => { if (res.status === 200) console.log("✅ PicList 连接正常"); },
      onerror: () => console.error("❌ 无法连接到 PicList")
    });
  }
  setTimeout(checkPicListConnection, 3000);

  // ------------------- Notion Config -------------------
  function getConfig() { return { token: GM_getValue('notion_token', ''), dbId: GM_getValue('notion_db_id', '') }; }
  function promptConfig() {
    const token = prompt('请输入 Notion Integration Secret:', GM_getValue('notion_token', ''));
    if (token) {
      const dbId = prompt('请输入 Notion Database ID:', GM_getValue('notion_db_id', ''));
      if (dbId) { GM_setValue('notion_token', token); GM_setValue('notion_db_id', dbId); alert('配置已保存'); }
    }
  }
  GM_registerMenuCommand("⚙️ 设置 Notion Token", promptConfig);

  // ------------------- Shadow DOM deep query -------------------
  function deepQueryAll(root, selector) {
    const out = [];
    const visited = new Set();
    const walk = (node) => {
      if (!node || visited.has(node)) return;
      visited.add(node);

      if (node.querySelectorAll) {
        try { out.push(...node.querySelectorAll(selector)); } catch (_) {}
      }
      const children = node.children || [];
      for (const el of children) {
        if (el.shadowRoot) walk(el.shadowRoot);
        walk(el);
      }
    };
    walk(root);
    return Array.from(new Set(out));
  }
  function deepQueryOne(root, selector) { return deepQueryAll(root, selector)[0] || null; }

  // ------------------- Turns / Docs -------------------
  function getTurns() { return deepQueryAll(document, 'div.turn'); }

  function getUserMarkdownDocFromTurn(turnEl) {
    const userFast = turnEl.querySelector?.('.question-wrapper ucs-fast-markdown') || null;
    const sr = userFast?.shadowRoot;
    return sr ? sr.querySelector('.markdown-document') : null;
  }

  function getModelMarkdownDocFromTurn(turnEl) {
    const summary = deepQueryOne(turnEl, 'ucs-summary');
    if (summary?.shadowRoot) {
      const doc = deepQueryOne(summary.shadowRoot, '.markdown-document');
      if (doc) return doc;
    }
    const allDocs = deepQueryAll(turnEl, '.markdown-document');
    if (!allDocs.length) return null;
    const userBlock = turnEl.querySelector?.('.question-block') || null;
    for (const d of allDocs) {
      if (userBlock && userBlock.contains(d)) continue;
      return d;
    }
    return null;
  }

  function collectAttachmentImagesFromTurn(turnEl) {
    const summary = deepQueryOne(turnEl, 'ucs-summary');
    const root = summary?.shadowRoot || turnEl;
    const imgs = deepQueryAll(root, 'img[src]');
    return imgs.filter(img => {
      const s = img.getAttribute('src') || '';
      return s.startsWith('blob:') || s.includes('business.gemini.google');
    });
  }

  // ------------------- UI helpers (OG hover + always show when skipped) -------------------
  function makeToolGroup() {
    const group = document.createElement('div');
    group.style.cssText = [
      'z-index:9500',
      'display:flex',
      'gap:6px',
      'opacity:0',
      'transition:opacity 0.2s ease-in-out',
      'background:white',
      'padding:4px 6px',
      'border-radius:20px',
      'box-shadow:0 2px 5px rgba(0,0,0,0.15)',
      'border:1px solid #e0e0e0',
      'position:absolute',
      'top:10px',
      'right:10px'
    ].join(';');
    return group;
  }

  function showGroup(group, force = false) {
    if (!group) return;
    if (force) { group.style.opacity = '1'; return; }
    group.style.opacity = '1';
  }
  function hideGroup(group) {
    if (!group) return;
    // 若该组存在 skip=true，保持显示（模拟你原来的 :has(skip)）
    const hasSkip = group.querySelector('[data-skip="true"]');
    if (hasSkip) { group.style.opacity = '1'; return; }
    group.style.opacity = '0';
  }

  function makeIconBtn(text, title) {
    const btn = document.createElement('div');
    btn.style.cssText = [
      'cursor:pointer',
      'font-size:16px',
      'line-height:24px',
      'user-select:none',
      'width:26px',
      'height:26px',
      'border-radius:50%',
      'transition:background 0.2s',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'color:#555'
    ].join(';');
    btn.textContent = text;
    btn.title = title;
    btn.onmouseenter = () => { if (btn.getAttribute('data-state') !== 'busy') { btn.style.background = 'rgba(0,0,0,0.08)'; btn.style.color = '#000'; } };
    btn.onmouseleave = () => { if (btn.getAttribute('data-state') !== 'busy') { btn.style.background = 'transparent'; btn.style.color = (btn.getAttribute('data-skip') === 'true') ? '#d93025' : '#555'; } };
    return btn;
  }

  function setMiniStatus(btn, state) {
    // state: busy | ok | err | reset
    if (!btn) return;
    if (state === 'busy') {
      btn.setAttribute('data-state', 'busy');
      btn.textContent = '⏳';
      btn.style.cursor = 'wait';
      btn.style.color = '#1a73e8';
      btn.style.background = '#e8f0fe';
      return;
    }
    if (state === 'ok') {
      btn.setAttribute('data-state', 'idle');
      btn.textContent = '✅';
      btn.style.cursor = 'pointer';
      btn.style.color = '#188038';
      btn.style.background = '#e6f4ea';
      setTimeout(() => {
        btn.textContent = '📤';
        btn.style.color = '#555';
        btn.style.background = 'transparent';
      }, 2500);
      return;
    }
    if (state === 'err') {
      btn.setAttribute('data-state', 'idle');
      btn.textContent = '❌';
      btn.style.cursor = 'pointer';
      btn.style.color = '#d93025';
      btn.style.background = '#fce8e6';
      setTimeout(() => {
        btn.textContent = '📤';
        btn.style.color = '#555';
        btn.style.background = 'transparent';
      }, 2500);
      return;
    }
  }

  // ------------------- Global button (keeps your animation behavior) -------------------
  function ensureGlobalButton() {
    if (document.getElementById('gemini-saver-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'gemini-saver-btn';
    btn.textContent = '📥 Save to Notion';
    btn.style.cssText = [
      'position:fixed', 'bottom:20px', 'right:20px', 'z-index:999999',
      'background-color:#0066CC', 'color:white', 'border:none', 'border-radius:6px',
      'padding:10px 16px', 'cursor:pointer',
      'box-shadow:0 4px 12px rgba(0,0,0,0.15)',
      'font-family:sans-serif', 'font-weight:600', 'font-size:14px',
      'transition:all 0.2s'
    ].join(';');
    btn.onmouseenter = () => { btn.style.backgroundColor = '#0052a3'; btn.style.transform = 'translateY(-2px)'; };
    btn.onmouseleave = () => { btn.style.backgroundColor = '#0066CC'; btn.style.transform = 'none'; };
    btn.onclick = handleFullExport;
    document.body.appendChild(btn);
  }

  function setGlobalBtnStatus(btn, msg) {
    if (!btn) return;
    if (msg === null) { btn.textContent = '📥 Save to Notion'; return; }
    btn.textContent = msg;
  }

  // ------------------- Inject per-bubble tools (OG style) -------------------
  function injectPerBubbleControls() {
    const turns = getTurns();

    turns.forEach(turn => {
      // --- USER bubble anchor = question-block (light DOM, best place) ---
      const qb = turn.querySelector?.('.question-block') || null;
      const hasUserDoc = !!getUserMarkdownDocFromTurn(turn);
      if (qb && hasUserDoc && !qb.querySelector('[data-user-tools="1"]')) {
        qb.style.position = qb.style.position === 'static' ? 'relative' : (qb.style.position || 'relative');

        const group = makeToolGroup();
        group.setAttribute('data-user-tools', '1');

        const eye = makeIconBtn('👁️', '切换：是否导出此问题（影响全量导出 & User📤）');
        eye.setAttribute('data-skip', turn.getAttribute('data-skip-user') === 'true' ? 'true' : 'false');
        if (eye.getAttribute('data-skip') === 'true') { eye.textContent = '🚫'; eye.style.color = '#d93025'; eye.style.background = '#fce8e6'; }

        eye.onclick = (e) => {
          e.stopPropagation();
          const skipping = eye.getAttribute('data-skip') === 'true';
          if (skipping) {
            eye.setAttribute('data-skip', 'false');
            eye.textContent = '👁️';
            eye.style.color = '#555';
            eye.style.background = 'transparent';
            turn.setAttribute('data-skip-user', 'false');
          } else {
            eye.setAttribute('data-skip', 'true');
            eye.textContent = '🚫';
            eye.style.color = '#d93025';
            eye.style.background = '#fce8e6';
            turn.setAttribute('data-skip-user', 'true');
          }
          // OG: 被标记隐私时工具栏保持显示
          showGroup(group, true);
        };

        const exp = makeIconBtn('📤', '导出：此问题 + 对应回复（两侧都受各自👁️影响）');
        exp.onclick = (e) => {
          e.stopPropagation();
          handleSingleExport(turn, 'pair', exp);
        };

        group.appendChild(eye);
        group.appendChild(exp);
        qb.appendChild(group);

        qb.addEventListener('mouseenter', () => showGroup(group));
        qb.addEventListener('mouseleave', () => hideGroup(group));
      }

      // --- MODEL bubble anchor: turn itself (response区域在 shadow，不稳定；用 turn 复刻 hover) ---
      const hasModelDoc = !!getModelMarkdownDocFromTurn(turn);
      if (hasModelDoc && !turn.querySelector('[data-model-tools="1"]')) {
        turn.style.position = turn.style.position === 'static' ? 'relative' : (turn.style.position || 'relative');

        const group = makeToolGroup();
        group.setAttribute('data-model-tools', '1');
        // 放右上，但再往下偏一点避免和 user 的重叠
        group.style.top = '44px';

        const eye = makeIconBtn('👁️', '切换：是否导出此回复（影响全量导出 & Gemini📤 & User📤里回复部分）');
        eye.setAttribute('data-skip', turn.getAttribute('data-skip-model') === 'true' ? 'true' : 'false');
        if (eye.getAttribute('data-skip') === 'true') { eye.textContent = '🚫'; eye.style.color = '#d93025'; eye.style.background = '#fce8e6'; }

        eye.onclick = (e) => {
          e.stopPropagation();
          const skipping = eye.getAttribute('data-skip') === 'true';
          if (skipping) {
            eye.setAttribute('data-skip', 'false');
            eye.textContent = '👁️';
            eye.style.color = '#555';
            eye.style.background = 'transparent';
            turn.setAttribute('data-skip-model', 'false');
          } else {
            eye.setAttribute('data-skip', 'true');
            eye.textContent = '🚫';
            eye.style.color = '#d93025';
            eye.style.background = '#fce8e6';
            turn.setAttribute('data-skip-model', 'true');
          }
          showGroup(group, true);
        };

        const exp = makeIconBtn('📤', '仅导出：此回复（受 Gemini👁️影响）');
        exp.onclick = (e) => {
          e.stopPropagation();
          handleSingleExport(turn, 'modelOnly', exp);
        };

        group.appendChild(eye);
        group.appendChild(exp);
        turn.appendChild(group);

        turn.addEventListener('mouseenter', () => showGroup(group));
        turn.addEventListener('mouseleave', () => hideGroup(group));
      }
    });
  }

  // ------------------- Assets: blob -> buffer -------------------
  async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  async function convertBlobImageToBuffer(blobUrl) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const img = deepQueryAll(document, `img[src="${CSS.escape(blobUrl)}"]`)[0] || document.querySelector(`img[src="${blobUrl}"]`);
      if (img && img.complete && img.naturalWidth > 0) {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        canvas.getContext('2d').drawImage(img, 0, 0);
        const b = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (!b) throw new Error("Canvas失败");
        const buf = await b.arrayBuffer();
        return { buffer: buf, type: b.type };
      }
      await sleep(300);
    }
    throw new Error("图片未加载完成（可能需要先滚动触发懒加载）");
  }

  function fetchAssetAsArrayBuffer(url) {
    return new Promise((resolve, reject) => {
      if (url.startsWith('blob:')) {
        convertBlobImageToBuffer(url).then(resolve).catch(() => {
          GM_xmlhttpRequest({
            method: "GET", url, responseType: 'arraybuffer',
            onload: r => r.status === 200 ? resolve({ buffer: r.response, type: 'application/octet-stream' }) : reject(new Error("blob 拉取失败"))
          });
        });
      } else {
        GM_xmlhttpRequest({
          method: "GET", url, responseType: 'arraybuffer',
          onload: r => {
            if (r.status === 200) {
              const m = r.responseHeaders.match(/content-type:\s*(.*)/i);
              resolve({ buffer: r.response, type: m ? m[1] : undefined });
            } else reject(new Error("拉取失败"));
          }
        });
      }
    });
  }

  function uploadToPicList(arrayBufferObj, filename) {
    return new Promise((resolve, reject) => {
      if (!arrayBufferObj.buffer) return reject(new Error("空文件"));
      let finalFilename = (filename || "file").split('?')[0];
      const mime = (arrayBufferObj.type || '').split(';')[0].trim().toLowerCase();
      if (!finalFilename.includes('.') || finalFilename.length - finalFilename.lastIndexOf('.') > 6) {
        const mimeMap = {
          'application/pdf': '.pdf',
          'application/msword': '.doc',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
          'image/png': '.png',
          'image/jpeg': '.jpg',
          'image/webp': '.webp'
        };
        if (mimeMap[mime]) finalFilename += mimeMap[mime];
      }
      const boundary = "----GeminiSaverBoundary" + Math.random().toString(36).substring(2);
      const preData =
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="file"; filename="${finalFilename.replace(/"/g, '')}"\r\n` +
        `Content-Type: ${mime || 'application/octet-stream'}\r\n\r\n`;
      const combinedBlob = new Blob([preData, arrayBufferObj.buffer, `\r\n--${boundary}--\r\n`]);

      GM_xmlhttpRequest({
        method: "POST", url: PICLIST_URL,
        headers: { "Content-Type": `multipart/form-data; boundary=${boundary}` },
        data: combinedBlob,
        onload: (res) => {
          try {
            const r = JSON.parse(res.responseText);
            r.success ? resolve(r.result[0]) : reject(new Error(r.message || "上传失败"));
          } catch (e) { reject(e); }
        },
        onerror: () => reject(new Error("网络错误"))
      });
    });
  }

  async function processAssets(blocks, statusCallback) {
    const tasks = []; const map = new Map();

    blocks.forEach((b, i) => {
      let urlObj = null;
      if (b.type === 'image' && b.image?.external?.url?.startsWith(ASSET_PLACEHOLDER_PREFIX)) urlObj = b.image.external;
      else if (b.type === 'file' && b.file?.external?.url?.startsWith(ASSET_PLACEHOLDER_PREFIX)) urlObj = b.file.external;

      if (urlObj) {
        const parts = urlObj.url.split('::');
        const name = parts[1] || 'asset';
        const realUrl = parts.slice(2).join('::') || '';

        const task = fetchAssetAsArrayBuffer(realUrl)
          .then(buf => uploadToPicList(buf, name))
          .then(u => ({ i, url: u, name, ok: true }))
          .catch(e => ({ i, err: e, name, ok: false }));

        tasks.push(task); map.set(i, b);
      }
    });

    if (tasks.length) {
      statusCallback(`⏳ Uploading ${tasks.length}...`);
      const res = await Promise.all(tasks);
      res.forEach(r => {
        const blk = map.get(r.i);
        if (r.ok) {
          if (blk.type === 'image') blk.image.external.url = r.url;
          else { blk.file.external.url = r.url; blk.file.name = r.name || "File"; }
        } else {
          console.error(`Upload Fail: ${r.name}`, r.err);
          blk.type = "paragraph";
          blk.paragraph = { rich_text: [{ type: "text", text: { content: `⚠️ Upload Failed: ${r.name}` }, annotations: { color: "red" } }] };
          delete blk.file; delete blk.image;
        }
      });
    }
    return blocks;
  }

  // ------------------- HTML -> Notion blocks -------------------
  const NOTION_LANGUAGES = new Set(["bash","c","c++","css","go","html","java","javascript","json","kotlin","markdown","php","python","ruby","rust","shell","sql","swift","typescript","yaml","r","plain text"]);
  function mapLanguageToNotion(lang) {
    if (!lang) return "plain text";
    lang = lang.toLowerCase().trim();
    if (lang === "js") return "javascript";
    if (lang === "py") return "python";
    if (NOTION_LANGUAGES.has(lang)) return lang;
    return "plain text";
  }
  function splitCodeSafe(code) {
    const chunks = [];
    let remaining = code || "";
    while (remaining.length > 0) {
      if (remaining.length <= MAX_TEXT_LENGTH) { chunks.push(remaining); break; }
      let splitIndex = remaining.lastIndexOf('\n', MAX_TEXT_LENGTH - 1);
      if (splitIndex === -1) splitIndex = MAX_TEXT_LENGTH;
      else splitIndex += 1;
      chunks.push(remaining.slice(0, splitIndex));
      remaining = remaining.slice(splitIndex);
    }
    return chunks;
  }
  function parseInlineNodes(nodes) {
    const rt = [];
    function tr(n, s = {}) {
      if (n.nodeType === 3) {
        const fullText = n.textContent;
        if (!fullText) return;
        for (let i = 0; i < fullText.length; i += MAX_TEXT_LENGTH) {
          rt.push({
            type: "text",
            text: { content: fullText.slice(i, i + MAX_TEXT_LENGTH), link: s.link },
            annotations: { bold: !!s.bold, italic: !!s.italic, code: !!s.code, color: "default" }
          });
        }
      } else if (n.nodeType === 1) {
        const latex = n.getAttribute('data-latex-source') || n.getAttribute('data-math');
        if (latex) { rt.push({ type: "equation", equation: { expression: latex.trim() } }); return; }
        const ns = { ...s };
        if (['B','STRONG'].includes(n.tagName)) ns.bold = true;
        if (['I','EM'].includes(n.tagName)) ns.italic = true;
        if (n.tagName === 'CODE') ns.code = true;
        if (n.tagName === 'A') ns.link = { url: n.href };
        n.childNodes.forEach(c => tr(c, ns));
      }
    }
    nodes.forEach(n => tr(n));
    return rt;
  }

  function processNodesToBlocks(nodes) {
    const blocks = [], buf = [];
    const flush = () => {
      if (buf.length) {
        const rt = parseInlineNodes(buf);
        if (rt.length) blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: rt } });
        buf.length = 0;
      }
    };

    Array.from(nodes).forEach(n => {
      if (['SCRIPT','STYLE','SVG'].includes(n.nodeName)) return;
      const isElement = n.nodeType === 1;

      if (n.nodeType === 3 || ['B','I','CODE','SPAN','A','STRONG','EM','MAT-ICON'].includes(n.nodeName)) {
        buf.push(n); return;
      }

      if (isElement) {
        flush();
        const t = n.tagName;

        if (t === 'P') blocks.push(...processNodesToBlocks(n.childNodes));
        else if (t === 'IMG') {
          const src = n.getAttribute('src') || '';
          blocks.push({ object: "block", type: "image", image: { type: "external", external: { url: `${ASSET_PLACEHOLDER_PREFIX}image.png::${src}` } } });
        }
        else if (t === 'PRE') {
          const rawChunks = splitCodeSafe(n.textContent || '');
          blocks.push({ object: "block", type: "code", code: { rich_text: rawChunks.map(c => ({ type:"text", text:{ content:c } })), language: "plain text" } });
        }
        else if (t === 'UCS-CODE-BLOCK') {
          const fullCode = n.getAttribute('code') || n.textContent || '';
          const lang = mapLanguageToNotion(n.getAttribute('language'));
          const rawChunks = splitCodeSafe(fullCode);
          blocks.push({ object:"block", type:"code", code:{ rich_text: rawChunks.map(c => ({ type:"text", text:{content:c}})), language: lang } });
        }
        else if (/^H[1-6]$/.test(t)) {
          const level = t[1] < 4 ? t[1] : 3;
          blocks.push({ object:"block", type:`heading_${level}`, [`heading_${level}`]: { rich_text: parseInlineNodes(n.childNodes) }});
        }
        else if (t === 'BLOCKQUOTE') blocks.push({ object:"block", type:"quote", quote:{ rich_text: parseInlineNodes(n.childNodes) }});
        else blocks.push(...processNodesToBlocks(n.childNodes));
      }
    });

    flush();
    return blocks;
  }

  // ------------------- Image dedup (avoid double upload) -------------------
  function appendImgsToCloneDedup(cloneContainer, imgs) {
    if (!imgs?.length) return;
    const existing = new Set();
    cloneContainer.querySelectorAll('img[src]').forEach(img => {
      const s = img.getAttribute('src') || '';
      if (s) existing.add(s);
    });
    const wrap = document.createElement('div');
    let added = 0;
    imgs.forEach(img => {
      const s = img.getAttribute('src') || '';
      if (!s) return;
      if (existing.has(s)) return;
      existing.add(s);
      wrap.appendChild(img.cloneNode(true));
      added++;
    });
    if (added) cloneContainer.appendChild(wrap);
  }

  // ------------------- Callout (same as your OG) -------------------
  function makePrivacyCallout(role) {
    return {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [{
          type: "text",
          text: { content: `🚫 此 ${role} 内容已标记为隐私，未导出。` },
          annotations: { color: "gray", italic: true }
        }],
        icon: { emoji: "🔒" },
        color: "gray_background"
      }
    };
  }

  function getChatTitle() {
    const turns = getTurns();
    if (!turns.length) return "Gemini Business Chat";
    const t = (getUserMarkdownDocFromTurn(turns[0])?.innerText || document.title || "Gemini Business Chat").replace(/\n/g,' ').trim();
    return t.slice(0, 60) || "Gemini Business Chat";
  }

  // mode: full | pair | modelOnly
  function getChatBlocksBusiness(targetTurns = null, mode = 'full') {
    const turns = targetTurns || getTurns();
    const children = [];

    turns.forEach(turn => {
      const skipUser = (turn.getAttribute('data-skip-user') === 'true');
      const skipModel = (turn.getAttribute('data-skip-model') === 'true');

      const wantUser = (mode === 'full' || mode === 'pair');
      const wantModel = (mode === 'full' || mode === 'pair' || mode === 'modelOnly');

      // USER
      if (wantUser) {
        if (skipUser) {
          children.push(makePrivacyCallout("User"));
        } else {
          const userDoc = getUserMarkdownDocFromTurn(turn);
          if (userDoc) {
            children.push({ object:"block", type:"heading_3", heading_3:{ rich_text:[{type:"text", text:{content:"User"}}], color:"default" }});
            const clone = userDoc.cloneNode(true);
            children.push(...processNodesToBlocks(clone.childNodes));
            children.push({ object:"block", type:"divider", divider:{} });
          }
        }
      }

      // MODEL
      if (wantModel) {
        if (skipModel) {
          // 只有在 full 或 pair 或 modelOnly 中需要导出“回答位”的时候才插 callout
          children.push(makePrivacyCallout("Gemini"));
        } else {
          const modelDoc = getModelMarkdownDocFromTurn(turn);
          if (modelDoc) {
            children.push({ object:"block", type:"heading_3", heading_3:{ rich_text:[{type:"text", text:{content:"Gemini"}}], color:"blue_background" }});
            const clone = modelDoc.cloneNode(true);
            const attachImgs = collectAttachmentImagesFromTurn(turn);
            appendImgsToCloneDedup(clone, attachImgs);
            children.push(...processNodesToBlocks(clone.childNodes));
            children.push({ object:"block", type:"divider", divider:{} });
          }
        }
      }
    });

    return children;
  }

  // ------------------- Notion upload -------------------
  function appendBlocksBatch(pageId, blocks, token, statusCallback) {
    if (!blocks.length) { statusCallback('✅ Saved!'); setTimeout(() => statusCallback(null), 2500); return; }
    GM_xmlhttpRequest({
      method: "PATCH",
      url: `https://api.notion.com/v1/blocks/${pageId}/children`,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
      },
      data: JSON.stringify({ children: blocks.slice(0, 90) }),
      onload: (res) => {
        if (res.status === 200) appendBlocksBatch(pageId, blocks.slice(90), token, statusCallback);
        else { console.error(res.responseText); statusCallback('❌ Fail'); }
      },
      onerror: () => statusCallback('❌ Net Error')
    });
  }

  function createPageAndUpload(title, blocks, token, dbId, statusCallback) {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://api.notion.com/v1/pages",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
      },
      data: JSON.stringify({
        parent: { database_id: dbId },
        properties: {
          "Name": { title: [{ text: { content: title } }] },
          "Date": { date: { start: new Date().toISOString() } },
          "URL": { url: location.href }
        },
        children: blocks.slice(0, 90)
      }),
      onload: (res) => {
        if (res.status === 200) {
          const pageId = JSON.parse(res.responseText).id;
          appendBlocksBatch(pageId, blocks.slice(90), token, statusCallback);
        } else { statusCallback('❌ Fail'); alert(res.responseText); }
      },
      onerror: () => statusCallback('❌ Net Error')
    });
  }

  async function executeExport(blocks, title, globalBtn, miniBtn) {
    const { token, dbId } = getConfig();
    if (!token) return promptConfig();

    if (!blocks.length) {
      if (miniBtn) setMiniStatus(miniBtn, 'err');
      alert('⚠️ 没有抓到任何内容（可能都被👁️关掉了，或页面未渲染完成）');
      return;
    }

    const status = (msg) => {
      if (globalBtn) setGlobalBtnStatus(globalBtn, msg);
      if (msg && msg.includes('Saved')) { if (miniBtn) setMiniStatus(miniBtn, 'ok'); }
      if (msg && (msg.includes('Fail') || msg.includes('Error') || msg.includes('Net'))) { if (miniBtn) setMiniStatus(miniBtn, 'err'); }
    };

    try {
      if (miniBtn) setMiniStatus(miniBtn, 'busy');
      status('🕵️ Processing...');
      blocks = await processAssets(blocks, status);
      status('💾 Saving...');
      createPageAndUpload(title, blocks, token, dbId, status);
    } catch (e) {
      console.error(e);
      status('❌ Error');
      if (miniBtn) setMiniStatus(miniBtn, 'err');
      alert(e.message);
    }
  }

  // ------------------- Export entrypoints -------------------
  function handleFullExport() {
    const btn = document.getElementById('gemini-saver-btn');
    const blocks = getChatBlocksBusiness(null, 'full');
    executeExport(blocks, getChatTitle(), btn, null);
  }

  function handleSingleExport(turnEl, mode, miniExportBtn) {
    const globalBtn = document.getElementById('gemini-saver-btn');
    const blocks = getChatBlocksBusiness([turnEl], mode);
    const title = getChatTitle() + (mode === 'pair' ? ' (Q+A)' : ' (A)');
    executeExport(blocks, title, globalBtn, miniExportBtn);
  }

  // ------------------- main loop -------------------
  function tick() {
    ensureGlobalButton();
    injectPerBubbleControls();
  }
  setInterval(tick, 1200);

})();