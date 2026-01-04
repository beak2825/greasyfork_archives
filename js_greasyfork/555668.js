// ==UserScript==
// @name         OLM Helper
// @license      GNU
// @namespace    http://tampermonkey.net/
// @version      0.805
// @description  Panel đáp án/solution hiển thị tốt trên PC & điện thoại.
// @author       Đòn Hư Lém, cavoixanh1806
// @match        https://olm.vn/chu-de/*
// @grant        unsafeWindow
// @run-at       document-start
// @icon         https://play-lh.googleusercontent.com/PMA5MRr5DUJBUbDgdUn6arbGXteDjRBIZVO3P3z9154Kud2slXPjy-iiPwwKfvZhc4o=w240-h480-rw
// @downloadURL https://update.greasyfork.org/scripts/555668/OLM%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/555668/OLM%20Helper.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // Link trang web cho chữ "cavoixanh1806" và "Đòn Hư Lém" (có thể thay đổi dễ dàng)
    const CAVOIXANH_LINK = "https://example.org";
    const AUTHOR_LINK = "https://vandoaq.github.io/";
    // Xóa nhãn "Trả lời:" dư thừa xuất hiện trong phần câu hỏi (short-answer)
    const TL_EXACT_RE = /^\s*trả\s*lời\s*:?\s*$/i;
    const TL_INLINE_RE = /\s*trả\s*lời\s*:?\s*$/i;
    function scrubTraLoiIn(el){
      if (!el) return;
      // Xóa các phần tử chỉ chứa đúng "Trả lời:"
      el.querySelectorAll('p,div,span,strong,b,em').forEach(node => {
        const txt = (node.textContent||'').trim();
        if (TL_EXACT_RE.test(txt)) node.remove();
      });
      // Sửa text node kết thúc bằng "Trả lời:"
      const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      let tn;
      while ((tn = tw.nextNode())) {
        const t = tn.nodeValue || '';
        if (TL_INLINE_RE.test(t)) tn.nodeValue = t.replace(TL_INLINE_RE, '').trimEnd();
      }
    }
    function scrubAllTraLoi(){
      document.querySelectorAll('#olm-answers-container .question-content').forEach(s => scrubTraLoiIn(s));
    }
    // Quan sát thay đổi để tự động làm sạch khi panel cập nhật
    const mo = new MutationObserver(() => scrubAllTraLoi());
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        scrubAllTraLoi();
        mo.observe(document.body, { childList: true, subtree: true });
      }, { once: true });
    } else {
      scrubAllTraLoi();
      mo.observe(document.body, { childList: true, subtree: true });
    }
  
    const TOGGLE_ICON_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMdM9MEQ0ExL1PmInT3U5I8v63YXBEdoIT0Q&s";
  
    const UW = (typeof unsafeWindow !== "undefined" && unsafeWindow) ? unsafeWindow : window;
    const TARGET_URL_KEYWORD = "get-question-of-ids";
    const LS_SIZE = "olm_size";
    const LS_POS  = "olm_pos";
    const LS_DARK = "olm_dark";
    const LS_TOGGLE_POS = "olm_toggle_pos";
    const HIGHLIGHT_CLASS = "olm-hl";
  
    const ready = (fn) => {
      if (document.readyState === "complete" || document.readyState === "interactive") fn();
      else document.addEventListener("DOMContentLoaded", fn, { once: true });
    };
    const ensureHead = (node) => {
      if (document.head) document.head.appendChild(node);
      else ready(() => (document.head || document.documentElement).appendChild(node));
    };
    const ensureBody = (node) => {
      if (document.body) document.body.appendChild(node);
      else ready(() => document.body.appendChild(node));
    };
    const debounce = (fn, ms) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); }; };
  
    function decodeBase64Utf8(base64) {
      try {
        const bin = atob(base64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new TextDecoder("utf-8").decode(bytes);
      } catch (e) { console.error("Lỗi giải mã Base64:", e); return "Lỗi giải mã nội dung!"; }
    }
  
    function mildLatexFix(html) {
      return html
        .replace(/\$\$([^$]+)\$(?!\$)/g, "$$$$${1}$$")
        .replace(/\$(?!\$)([^$]+)\$\$/g, "$$${1}$$");
        
    }
    // Loại bỏ mọi dấu # ở đầu chuỗi (phục vụ Đúng/Sai và các đáp án có đánh dấu #)
    function stripLeadingHashes(s){
      return (s || "").replace(/^\s*#+\s*/,'').trim();
    }
    // Loại bỏ nhãn "Trả lời:" ở đầu đáp án ngắn/LI nếu có
    function stripAnswerLabels(s){
      return (s || '').replace(/^\s*(trả\s*lời|tra\s*loi)\s*:\s*/i, '').trim();
    }
    const TF_RE = /^\s*#+\s*(đúng|sai|true|false)\s*$/i;
    function cleanTF(s){ return s.replace(/^\s*#+\s*/,'').trim(); }
    function maybeStripHashForTFText(s){
      const t = (s || "").trim();
      return TF_RE.test(t) ? cleanTF(t) : t;
    }
    function maybeStripHashInLI(li){
      if (!li) return;
      // lấy text node đầu tiên
      const tw = document.createTreeWalker(li, NodeFilter.SHOW_TEXT, null);
      const tn = tw.nextNode();
      if (!tn) return;
      const t = tn.nodeValue || "";
      if (TF_RE.test(t)) tn.nodeValue = cleanTF(t);
    }
    // ===== JSON helpers: gom nhóm theo từng prompt + danh sách đáp án =====
    function extractTextFromJson(node){
      if (!node) return "";
      let out = '';
      if (typeof node.text === 'string') out += node.text;
      if (Array.isArray(node.children)) for (const ch of node.children) out += extractTextFromJson(ch);
      return out;
    }
    function collectGroupsFromJSON(jsonData){
      const root = jsonData && (jsonData.root || jsonData);
      const groups = [];
      let currentPrompt = null;
      function walk(n){
        if (!n || typeof n !== 'object') return;
        const t = (n.type||'');
        if (/paragraph/i.test(t)){
          const tx = extractTextFromJson(n).trim();
          if (/[\?؟]$/.test(tx) && tx.length>1) currentPrompt = tx;
        }
        if (/list$/i.test(t) || /list\b/i.test(t)){
          const items = [];
          (n.children||[]).forEach(ch => {
            const ct = ch && (ch.type||'');
            if (ct === 'olm-list-item' || /list-item/i.test(ct)){
              const raw = extractTextFromJson(ch).trim();
              items.push({ text: stripAnswerLabels(stripLeadingHashes(raw)), correct: ch.correct === true });
            }
          });
          if (items.length) groups.push({ prompt: currentPrompt, items });
        }
        (n.children||[]).forEach(walk);
      }
      walk(root);
      return groups;
    }
    // ===== HTML helpers: tách danh sách đáp án theo từng list + prompt gần nhất =====
    function parseHtmlGroups(decodedContent){
      const container = document.createElement('div');
      container.innerHTML = decodedContent;
      // Lấy tất cả danh sách đáp án (giữ ưu tiên .quiz-list nếu có)
      let lists = [...container.querySelectorAll('ol.quiz-list, ul.quiz-list')];
      if (!lists.length) lists = [...container.querySelectorAll('ol.quiz, ul.quiz')];
      if (!lists.length) lists = [...container.querySelectorAll('ol, ul')];
      const groups = [];
      let firstList = null;
      lists.forEach(list => {
        if (!firstList) firstList = list;
        // Xác định prompt gần nhất trước list
        let pEl = list.previousElementSibling;
        let promptText = '';
        while (pEl){
          const t = (pEl.textContent||'').trim();
          if (/[\?؟]$/.test(t)) { promptText = t; break; }
          pEl = pEl.previousElementSibling;
        }
        const items = [];
        [...list.children].forEach(li => {
          const liClone = li.cloneNode(true);
          // đánh dấu đúng sai từ class/child .correctAnswer
          const isCorrect = (
            li.classList?.contains('correctAnswer') ||
            liClone.querySelector('.correctAnswer') != null
          );
          // bỏ wrapper .correctAnswer nếu có
          liClone.querySelectorAll('.correctAnswer').forEach(n => {
            const p = n.parentNode; while(n.firstChild) p.insertBefore(n.firstChild, n); p.removeChild(n);
          });
          // remove leading '#'
          const txt = stripAnswerLabels(stripLeadingHashes(liClone.textContent || '')).trim();
          const outLi = { text: txt, correct: isCorrect };
          items.push(outLi);
        });
        if (items.length) groups.push({ prompt: promptText, items });
      });
      // Tạo phần dẫn (prelude) là các node trước list đầu tiên
      let preludeHTML = '';
      if (firstList){
        const wrap = document.createElement('div');
        let n = firstList.previousSibling;
        const nodes = [];
        while(n){ nodes.unshift(n); n = n.previousSibling; }
        nodes.forEach(x => wrap.appendChild(x.cloneNode(true)));
        preludeHTML = wrap.innerHTML;
      }
      return { preludeHTML, groups };
    }
    
    function highlightInElement(el, keyword) {
      el.querySelectorAll("." + HIGHLIGHT_CLASS).forEach(n => {
        const p = n.parentNode; while (n.firstChild) p.insertBefore(n.firstChild, n); p.removeChild(n); p.normalize?.();
      });
      if (!keyword) return;
      const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      let node;
      while ((node = walk.nextNode())) {
        const t = node.nodeValue; if (!t || !t.trim()) continue;
        let m, last = 0, pieces = [];
        while ((m = regex.exec(t))) {
          pieces.push(document.createTextNode(t.slice(last, m.index)));
          const mark = document.createElement("mark"); mark.className = HIGHLIGHT_CLASS;
          mark.textContent = t.slice(m.index, m.index + m[0].length);
          pieces.push(mark); last = m.index + m[0].length;
        }
        if (pieces.length) {
          pieces.push(document.createTextNode(t.slice(last)));
          const frag = document.createDocumentFragment(); pieces.forEach(p => frag.appendChild(p));
          node.parentNode.replaceChild(frag, node);
        }
      }
    }
  
    // MathJax
    function ensureMathJax() {
      if (UW.MathJax) return;
      const cfg = document.createElement("script");
      cfg.type = "text/javascript";
      cfg.text = `
        window.MathJax = {
          tex: { inlineMath: [['$', '$'], ['\\\\(', '\\\\)']], displayMath: [['$$','$$'], ['\\\\[','\\\\]']], processEscapes: true, processEnvironments: true },
          options: { skipHtmlTags: ['noscript','style','textarea','pre','code'], ignoreHtmlClass: 'no-mathjax', renderActions: { addMenu: [] } },
          startup: { typeset: false }
        };
      `;
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js";
      ensureHead(cfg);
      ensureHead(s);
    }
    ensureMathJax();
  
    // html2pdf
    let html2pdfReadyPromise = null;
    function ensureHtml2Pdf() {
      if (UW.html2pdf) return Promise.resolve();
      if (html2pdfReadyPromise) return html2pdfReadyPromise;
      html2pdfReadyPromise = new Promise((res, rej) => {
        const sc = document.createElement("script");
        sc.src = "https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js";
        sc.async = true;
        sc.onload = () => res();
        sc.onerror = () => rej(new Error("Không tải được html2pdf.js"));
        ensureHead(sc);
      });
      return html2pdfReadyPromise;
    }
    //WORD DOWLOAD//////////////////////////
    async function downloadWordFile(event) {
      const button = event.target;
      if (!button || button.disabled) return; // tránh gọi lặp khi đang xử lý
      const defaultLabel = (button.dataset && button.dataset.defaultLabel) || 'WORD';
      const originalText = button.textContent;
      button.textContent = 'Đang xử lý...';
      button.disabled = true;
      try {
          const match = window.location.pathname.match(/(\d+)$/);
          if (!match || !match[0]) {
              alert('Lỗi: Không tìm thấy ID chủ đề (dãy số ở cuối link) trong URL.');
              throw new Error('Không tìm thấy ID chủ đề trong pathname.');
          }
          const id_cate = match[0];
          button.textContent = 'Đang lấy link...';
          const apiUrl = `https://olm.vn/download-word-for-user?id_cate=${id_cate}&showAns=1&questionNotApproved=0`;
          const response = await fetch(apiUrl);
          if (!response.ok) {
              throw new Error(`Lỗi server OLM: ${response.statusText}`);
          }
          const data = await response.json();
          if (!data || !data.file) {
              throw new Error('Response JSON không hợp lệ hoặc không có link file.');
          }
          const fileUrl = data.file;
          button.textContent = 'Đang tải về...';
          const link = document.createElement('a');
          link.href = fileUrl;
          link.target = '_blank';
          let filename = fileUrl.split('/').pop();
          if (!filename || !filename.includes('.')) {
              filename = `olm-answers-${id_cate}.docx`;
          }
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } catch (error) {
          console.error('Lỗi khi tải file Word:', error);
          alert(`Đã xảy ra lỗi: ${error.message}`);
      } finally {
          // luôn trả về nhãn mặc định để tránh kẹt ở trạng thái trung gian
          button.textContent = defaultLabel;
          button.disabled = false;
      }
  }
  
    class AnswerDisplay {
      constructor() {
        this.isVisible = true;
  
        this.dragState = { dragging: false, startX: 0, startY: 0, initX: 0, initY: 0 };
        this.resizeState = null;
  
        const defaultH = Math.max(340, Math.round(window.innerHeight * 0.66));
        this.size = { w: Math.min(520, Math.max(340, Math.round(window.innerWidth * 0.9))), h: defaultH };
        this.pos = null;
  
        this.toggleDrag = { dragging: false, startX: 0, startY: 0, initL: 0, initT: 0 };
        this.togglePos = (() => {
          try { const p = JSON.parse(localStorage.getItem(LS_TOGGLE_POS) || "null"); if (Number.isFinite(p?.left) && Number.isFinite(p?.top)) return p; } catch {}
          return null;
        })();
  
        this.dark = (() => {
          const saved = localStorage.getItem(LS_DARK);
          if (saved !== null) return saved === "1";
          return window.matchMedia?.("(prefers-color-scheme: dark)").matches || false;
        })();
  
        try { const saved = JSON.parse(localStorage.getItem(LS_SIZE) || "null"); if (saved?.w && saved?.h) this.size = saved; } catch {}
        try { const p = JSON.parse(localStorage.getItem(LS_POS)  || "null"); if (Number.isFinite(p?.left) && Number.isFinite(p?.top)) this.pos = p; } catch {}
  
        this.filterDebounced = debounce(this.filterQuestions.bind(this), 140);
  
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onPointerDownDrag = this.onPointerDownDrag.bind(this);
        this.onPointerMoveDrag = this.onPointerMoveDrag.bind(this);
        this.onPointerUpDrag   = this.onPointerUpDrag.bind(this);
        this.onPointerDownResize = this.onPointerDownResize.bind(this);
        this.onPointerMoveResize = this.onPointerMoveResize.bind(this);
        this.onPointerUpResize   = this.onPointerUpResize.bind(this);
  
        // Drag nút toggle
        this.onPointerDownToggle = this.onPointerDownToggle.bind(this);
        this.onPointerMoveToggle = this.onPointerMoveToggle.bind(this);
        this.onPointerUpToggle   = this.onPointerUpToggle.bind(this);
      }
  
      init() {
        this.injectCSS();
        this.createUI();
        this.addEventListeners();
        if (this.dark) this.container.classList.add("olm-dark");
        this.applyPosOnly();
        this.applyTogglePos();  // đặt vị trí nút nổi nếu có
      }
  
      injectCSS() {
        const css = `
          :root{
            --panel-w: 520px;
            --panel-h: 70vh;
            --glass-border: rgba(0,0,0,0.12);
            --bg-glass: #ffffffcc;
            --bg-top: #ffffffaa;
            --bg-sub: #ffffff88;
            --shadow: 0 10px 24px rgba(17,24,39,0.18);
            --text-main: #0f172a;
            --text-sub: #334155;
            --muted: #6b7280;
            --btn-bg: #f3f4f6;
            --btn-fg: #111827;
            --btn-border: #d1d5db;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          }
          #olm-answers-container{
            position: fixed;
            top: max(12px, env(safe-area-inset-top));
            width: var(--panel-w); height: var(--panel-h);
            z-index: 2147483647; display:flex; flex-direction:column;
            border-radius: 14px; overflow: hidden;
            -webkit-backdrop-filter: blur(10px) saturate(120%);
            backdrop-filter: blur(10px) saturate(120%);
            background: var(--bg-glass);
            border: 1px solid var(--glass-border);
            box-shadow: var(--shadow);
            transition: transform .18s ease, opacity .18s ease, left .12s, right .12s;
            color: var(--text-main); user-select: none; min-width: 320px;
            max-width: calc(100vw - 24px);
            max-height: calc(100vh - 24px);
          }
          #olm-answers-container.hidden{ opacity:.0; transform: translateY(-6px) scale(.98); pointer-events:none; }
  
          #olm-answers-container.olm-dark{
            --glass-border: rgba(255,255,255,0.12);
            --bg-glass: rgba(27,31,40,0.75);
            --bg-top: rgba(255,255,255,0.06);
            --bg-sub: rgba(255,255,255,0.08);
            --shadow: 0 10px 30px rgba(0,0,0,0.55);
            --text-main: #e5e7eb; --text-sub: #cbd5e1;
            --btn-bg: #1f2937;
            --btn-fg: #e5e7eb;
            --btn-border: #4b5563;
          }
  
          .olm-topbar{
            display:flex; flex-direction:column; gap:6px;
            padding:10px 12px; background: var(--bg-top);
            border-bottom: 1px solid rgba(0,0,0,0.06); touch-action: none;
          }
          #olm-answers-container.olm-dark .olm-topbar{ border-bottom-color: rgba(255,255,255,0.06); }
  
          .olm-header{ display:flex; align-items:center; gap:10px; }
          .olm-brand{ display:flex; align-items:center; gap:10px; }
          .olm-logo{
            width:28px; height:28px; border-radius:6px; overflow:hidden; flex:0 0 auto;
            background:#eee;
          }
          .olm-logo img{ width:100%; height:100%; object-fit:cover; display:block; }
          .olm-title-line{ display:flex; align-items:baseline; gap:6px; flex-wrap:wrap; }
          .olm-title-line .tt-strong{ font-size:14px; font-weight:800; }
          .olm-title-line .tt-sub{ font-size:12px; color: var(--muted); }
          .olm-title-line .tt-sub a{ color: inherit; text-decoration: underline; }
  
          .olm-controls-row{
            display:flex; gap:8px; align-items:center;
            overflow-x:auto; -webkit-overflow-scrolling: touch; padding-top:2px;
          }
  
          /* Nút riêng namespace #olm-answers-container để không ảnh hưởng web */
          #olm-answers-container .olm-btn{
            appearance: button;
            border: 1px solid var(--btn-border);
            border-radius: 8px;
            padding: 6px 10px;
            font-size: 12px;
            font-weight: 700;
            line-height: 1;
            display:inline-flex; align-items:center; gap:6px;
            cursor:pointer;
            background: var(--btn-bg);
            color: var(--btn-fg);
            white-space: nowrap;
            user-select:none;
          }
          #olm-answers-container .olm-btn svg{ fill: currentColor; }
          #olm-answers-container .olm-btn:active{ transform: translateY(1px); }
          #olm-answers-container .olm-btn.is-ghost{
            background: transparent;
            color: var(--text-main);
            border-color: var(--btn-border);
          }
          #olm-answers-container.olm-dark .olm-btn.is-ghost{ color: var(--text-main); }
  
          .search-wrap{ display:flex; gap:8px; align-items:center; padding:8px 12px; border-bottom:1px solid rgba(0,0,0,0.06); background: var(--bg-sub); }
          #olm-answers-container.olm-dark .search-wrap{ border-bottom-color: rgba(255,255,255,0.06); }
          .search-input{ flex:1; padding:8px 10px; border-radius:10px; border:1px solid rgba(0,0,0,0.06); outline:none; background: rgba(255,255,255,0.85); font-size:13px; color:#111827; }
          #olm-answers-container.olm-dark .search-input{ background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.12); color: var(--text-main); }
          .meta{ font-size:12px; color: var(--muted); min-width:74px; text-align:right; }
  
          #olm-answers-content{ padding:10px; overflow-y:auto; -webkit-overflow-scrolling: touch; flex:1; display:flex; flex-direction:column; gap:10px; }
          .qa-block{ display:flex; flex-direction:column; gap:8px; padding:12px; border-radius:10px; background: #ffffffdd; border:1px solid rgba(15,23,42,0.05); page-break-inside: avoid; break-inside: avoid; }
          #olm-answers-container.olm-dark .qa-block{ background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.08); }
  
          .qa-top{ display:flex; align-items:flex-start; gap:10px; }
          .question-content{ font-weight:700; color:var(--text-main); font-size:14px; flex:1; }
          .q-index{ margin-right:6px; color: var(--text-sub); }
          .content-container{ padding-left:6px; color:#0b3c49; font-size:13px; }
          #olm-answers-container.olm-dark .content-container{ color: var(--text-main); }
          .content-container[data-type="answer"]{ font-weight:600; }
          .content-container[data-type="answer"] .correct-answer{ color: #10b981 !important; }
  
          .footer-bar{ padding:8px 10px; display:flex; align-items:center; gap:8px; border-top:1px solid rgba(0,0,0,0.06); background: var(--bg-sub); }
          #olm-answers-container.olm-dark .footer-bar{ border-top-color: rgba(255,255,255,0.08); }
          #count-badge{ font-weight:700; color:var(--muted); margin-left:auto; font-size:13px; }
  
          .resize-handle{ position:absolute; right:8px; bottom:8px; width:18px; height:18px; cursor: nwse-resize;
            border-right:2px solid rgba(0,0,0,0.25); border-bottom:2px solid rgba(0,0,0,0.25); opacity:.7; touch-action: none; }
          #olm-answers-container.olm-dark .resize-handle{ border-right-color: rgba(255,255,255,0.35); border-bottom-color: rgba(255,255,255,0.35); }
          #olm-answers-container.resizing{ user-select:none; }
  
          mark.${HIGHLIGHT_CLASS}{ background: rgba(250, 204, 21, 0.35); padding: 0 2px; border-radius: 3px; }
  
          @media (max-width: 520px){
            #olm-answers-container{ left: 12px !important; right: 12px !important; width: auto !important; height: 66vh !important; }
            .question-content{ font-size:13px; }
            .olm-controls-row{ gap:6px; }
            #olm-answers-container .olm-btn{ padding:6px 8px; font-size:12px; }
          }
  
          /* Floating toggle - draggable + img icon */
          #olm-toggle-btn{
            position: fixed;
            top: max(12px, env(safe-area-inset-top));
            right: 12px;
            width: 46px; height: 46px;
            border-radius: 999px;
            display:none; align-items:center; justify-content:center;
            z-index: 2147483647;
            border: 1px solid rgba(0,0,0,0.12);
            -webkit-backdrop-filter: blur(10px) saturate(120%);
            backdrop-filter: blur(10px) saturate(120%);
            background: #ffffffee;
            box-shadow: 0 10px 24px rgba(17,24,39,0.18);
            cursor: grab; user-select: none;
            touch-action: none; /* để kéo mượt trên mobile */
          }
          #olm-toggle-btn:active{ cursor: grabbing; transform: scale(.98); }
          #olm-toggle-btn.show{ display:flex; }
          #olm-toggle-btn img{ width: 70%; height: 70%; object-fit: cover; border-radius: 999px; pointer-events: none; }
          /* Dark follow */
          #olm-answers-container.olm-dark ~ #olm-toggle-btn{
            border-color: rgba(255,255,255,0.12);
            background: rgba(40,44,52,0.92);
          }
  
          /* PDF helpers */
          .pdf-root{ width: 900px; max-width: 100%; margin: 0 auto; }
          .pdf-spacer{ height: 32px; }
          mjx-container{ page-break-inside: avoid; break-inside: avoid; }
            /* ======= QA CARD STYLE (giống ảnh mẫu) ======= */
            #olm-answers-container .qa-block{
            background:#f7f8fa;
            border:1px solid #e5e7eb;
            border-left:4px solid #3b82f6;           /* viền xanh bên trái */
            border-radius:12px;
            padding:14px 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,.04);
            }
  
            #olm-answers-container .qa-top{
            padding-bottom:8px;
            border-bottom:1px dashed #d1d5db;
            margin-bottom:10px;
            }
  
            #olm-answers-container .q-index{
            display:block;
            font-weight:700;
            color:#64748b;                           /* xám nhạt cho “Câu 17” */
            margin:0 0 6px 0;
            }
  
            #olm-answers-container .question-content{
            color:#0f172a;                           /* đậm hơn, dễ đọc */
            line-height:1.5;
            }
            #olm-answers-container .question-content p{ margin:6px 0; }
  
            /* Khu đáp án */
            #olm-answers-container .content-container{
            margin-top:4px;
            color:#0b3c49;
            line-height:1.55;
            }
            #olm-answers-container .content-container ul{
            list-style:none; padding:0; margin:0;
            }
            #olm-answers-container .content-container li{
            margin:6px 0; padding-left:0;
            color:#334155;
            }
  
            /* Đáp án đúng: xanh, in đậm, có dấu ✓ */
            #olm-answers-container .content-container li.correct-answer{
            color:#16a34a !important;
            font-weight:800;
            }
            #olm-answers-container .content-container li.correct-answer::before{
            content:"✓ ";
            font-weight:900;
            }
  
            /* Dark mode khớp tông */
            #olm-answers-container.olm-dark .qa-block{
            background:rgba(255,255,255,0.06);
            border-color:rgba(255,255,255,0.08);
            border-left-color:#60a5fa;
            box-shadow: 0 4px 16px rgba(0,0,0,.35);
            }
            #olm-answers-container.olm-dark .qa-top{
            border-bottom-color:rgba(255,255,255,0.12);
            }
            #olm-answers-container.olm-dark .q-index{ color:#94a3b8; }
            #olm-answers-container.olm-dark .question-content{ color:#e5e7eb; }
            #olm-answers-container.olm-dark .content-container{ color:#e5e7eb; }
            #olm-answers-container.olm-dark .content-container li{ color:#cbd5e1; }
            #olm-answers-container.olm-dark .content-container li.correct-answer{ color:#34d399 !important; }
        /* Khoảng cách giữa các câu */
            #olm-answers-content{ gap:16px; }
            #olm-answers-container .qa-block{ margin-bottom:16px; }
  
            /* Danh sách đáp án: thụt vào + vạch dẫn trái */
            #olm-answers-container .answer-list{
            list-style:none; margin:8px 0 0 0;
            padding-left:14px; border-left:3px solid #e5e7eb;
            }
            #olm-answers-container .answer-list li{
            margin:6px 0; color:#334155;
            }
  
            /* Đúng/Sai: block rõ ràng hơn, thụt vào thêm một nhịp */
            #olm-answers-container .answer-list.tf{
            padding-left:18px; border-left:4px solid #93c5fd; /* xanh nhạt */
            }
            #olm-answers-container .answer-list.tf li{
            padding:6px 8px; border-radius:8px; background:#f8fafc;
            }
            #olm-answers-container .answer-list.tf li.correct-answer{
            background:#ecfdf5; color:#16a34a !important; font-weight:800;
            }
            #olm-answers-container .answer-list.tf li.correct-answer::before{
            content:"✓ "; font-weight:900;
            }
  
            /* Dark mode */
            #olm-answers-container.olm-dark .answer-list{ border-left-color:rgba(255,255,255,0.15); }
            #olm-answers-container.olm-dark .answer-list li{ color:#cbd5e1; }
            #olm-answers-container.olm-dark .answer-list.tf{ border-left-color:#60a5fa; }
            #olm-answers-container.olm-dark .answer-list.tf li{ background:rgba(255,255,255,0.06); }
            #olm-answers-container.olm-dark .answer-list.tf li.correct-answer{ background:rgba(16,163,74,0.15); color:#34d399 !important; }
        `;
        const style = document.createElement("style");
        style.textContent = css;
        ensureHead(style);
      }
  
      createUI() {
        this.container = document.createElement("div");
        this.container.id = "olm-answers-container";
        this.container.style.width = this.size.w + "px";
        this.container.style.height = this.size.h + "px";
  
        // Topbar
        const topbar = document.createElement("div");
        topbar.className = "olm-topbar";
        topbar.addEventListener("pointerdown", this.onPointerDownDrag);
  
        // Header
        const header = document.createElement("div");
        header.className = "olm-header";
  
        const brand = document.createElement("div");
        brand.className = "olm-brand";
  
        const logo = document.createElement("div");
        logo.className = "olm-logo";
        const logoImg = document.createElement("img");
        logoImg.src = "https://play-lh.googleusercontent.com/PMA5MRr5DUJBUbDgdUn6arbGXteDjRBIZVO3P3z9154Kud2slXPjy-iiPwwKfvZhc4o=w240-h480-rw";
        logoImg.alt = "OLM logo";
        logo.appendChild(logoImg);
  
        const titleLine = document.createElement("div");
        titleLine.className = "olm-title-line";
        const ttStrong = document.createElement("span");
        ttStrong.className = "tt-strong";
        ttStrong.textContent = "OLM Helper";
        const ttSub = document.createElement("span");
        ttSub.className = "tt-sub";
        ttSub.append(document.createTextNode("by "));
        const authorLink = document.createElement("a");
        authorLink.href = AUTHOR_LINK || "#";
        authorLink.target = "_blank";
        authorLink.rel = "noopener noreferrer";
        authorLink.textContent = "Đòn Hư Lém";
        ttSub.appendChild(authorLink);
        ttSub.append(document.createTextNode(", "));
        const ttSubLink = document.createElement("a");
        ttSubLink.href = CAVOIXANH_LINK || "#";
        ttSubLink.target = "_blank";
        ttSubLink.rel = "noopener noreferrer";
        ttSubLink.textContent = "cavoixanh1806";
        ttSub.appendChild(ttSubLink);
        titleLine.append(ttStrong, ttSub);
  
        brand.append(logo, titleLine);
        header.append(brand);
  
        // Controls
        const controlsRow = document.createElement("div");
        controlsRow.className = "olm-controls-row";
  
        const darkBtn = document.createElement("button");
        darkBtn.className = "olm-btn is-ghost"; darkBtn.title = "Dark mode (Alt D)"; darkBtn.setAttribute("aria-label","Toggle dark mode");
        darkBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;
        darkBtn.addEventListener("click", () => this.toggleDarkMode());
  
        const collapseBtn = document.createElement("button");
        collapseBtn.className = "olm-btn is-ghost"; collapseBtn.title = "Ẩn/Hiện (Shift phải)";
        collapseBtn.textContent = "Hide";
        collapseBtn.addEventListener("click", () => this.toggleVisibility());
  
        const exportTxtBtn = document.createElement("button");
        exportTxtBtn.id = "export-btn"; exportTxtBtn.className = "olm-btn";
        exportTxtBtn.textContent = "TXT";
        exportTxtBtn.addEventListener("click", () => this.exportToTxt());
  
        const exportPdfBtn = document.createElement("button");
        exportPdfBtn.id = "export-pdf-btn"; exportPdfBtn.className = "olm-btn";
        exportPdfBtn.textContent = "PDF";
        exportPdfBtn.addEventListener("click", () => this.exportToPDF());
        
        controlsRow.append(darkBtn, collapseBtn, exportTxtBtn, exportPdfBtn);
        topbar.append(header, controlsRow);
        const exportDocBtn = document.createElement("button");
        exportDocBtn.id = "export-docx-btn";
        exportDocBtn.className = "olm-btn";
        exportDocBtn.textContent = "WORD";
        exportDocBtn.dataset.defaultLabel = "WORD(BETA)";
        exportDocBtn.addEventListener("click", (e) => downloadWordFile(e));
  
        const exportDocV2Btn = document.createElement("button");
        exportDocV2Btn.id = "export-docx-v2-btn";
        exportDocV2Btn.className = "olm-btn";
        exportDocV2Btn.textContent = "WORD V2(BETA)";
        exportDocV2Btn.addEventListener("click", () => this.exportToWordV2());
  
        controlsRow.append(darkBtn, collapseBtn, exportTxtBtn, exportPdfBtn, exportDocBtn, exportDocV2Btn);
  
        this.exportDocBtn = exportDocBtn; // lưu tham chiếu để dùng cho Alt+W
  
        // Search
        const searchWrap = document.createElement("div"); searchWrap.className = "search-wrap";
        const searchInput = document.createElement("input");
        searchInput.className = "search-input";
        searchInput.placeholder = "Tìm theo từ khóa (Alt T để focus)";
        searchInput.addEventListener("input", (e) => this.filterDebounced(e.target.value));
        const meta = document.createElement("div"); meta.className = "meta"; meta.id = "meta-info"; meta.textContent = "0 câu";
        searchWrap.append(searchInput, meta);
  
        // Content
        this.contentArea = document.createElement("div"); this.contentArea.id = "olm-answers-content";
  
        // Footer
        const footer = document.createElement("div"); footer.className = "footer-bar";
        const hint = document.createElement("div"); hint.style.fontSize = "12px"; hint.style.color = "var(--muted)";
        hint.textContent = "Shift phải: ẩn/hiện • Alt T: tìm • Alt A: copy đáp án hiển thị • Alt W: tải Word";
        const countBadge = document.createElement("div"); countBadge.id = "count-badge"; countBadge.textContent = "0 câu";
        footer.append(hint, countBadge);
  
        // Resize handle
        const handle = document.createElement("div");
        handle.className = "resize-handle"; handle.title = "Kéo để đổi kích thước";
        handle.addEventListener("pointerdown", this.onPointerDownResize);
        this.resizeHandle = handle;
  
        this.container.append(topbar, searchWrap, this.contentArea, footer, handle);
        ensureBody(this.container);
  
        this.topbar = topbar;
        this.searchInput = searchInput;
        this.countBadge = countBadge;
        this.metaInfo = meta;
        this.darkBtn = darkBtn;
  
        // Floating toggle (draggable + icon img)
        const tbtn = document.createElement("div");
        tbtn.id = "olm-toggle-btn"; tbtn.title = "Hiện OLM Helper";
        const timg = document.createElement("img");
        timg.alt = "Toggle OLM Helper";
        timg.src = TOGGLE_ICON_URL;
        tbtn.appendChild(timg);
  
        // Click để hiện panel
        tbtn.addEventListener("click", (e) => {
          // Nếu vừa kéo thì bỏ click (để không bị bật panel khi thả tay)
          if (tbtn.__dragging) return;
          this.isVisible = true; this.container.classList.remove("hidden"); this.hideToggleBtn();
        });
  
        // Kéo nút (pointer events)
        tbtn.addEventListener("pointerdown", this.onPointerDownToggle);
        ensureBody(tbtn);
        this.toggleBtn = tbtn;
      }
  
      addEventListeners() {
        window.addEventListener("keydown", this.onKeyDown, true);
        document.addEventListener("keydown", this.onKeyDown, true);
        // Không tự reposition nút theo container nữa. Nút có vị trí độc lập do người dùng kéo.
        window.addEventListener("resize", () => this.boundToggleInside());
        window.addEventListener("scroll", () => {}, { passive: true });
      }
  
      /* ===== Drag & resize panel ===== */
      onPointerDownDrag(e) {
        if (e.button !== 0 && e.pointerType === "mouse") return;
        const rect = this.container.getBoundingClientRect();
        this.container.style.right = "auto";
        this.container.style.left  = `${rect.left}px`;
        this.container.style.top   = `${rect.top}px`;
        this.container.style.width  = rect.width + "px";
        this.container.style.height = rect.height + "px";
  
        this.dragState = { dragging: true, startX: e.clientX, startY: e.clientY, initX: rect.left, initY: rect.top };
        this.container.style.transition = "none";
        window.addEventListener("pointermove", this.onPointerMoveDrag);
        window.addEventListener("pointerup", this.onPointerUpDrag);
      }
      onPointerMoveDrag(e) {
        if (!this.dragState.dragging) return;
        e.preventDefault();
        const dx = e.clientX - this.dragState.startX;
        const dy = e.clientY - this.dragState.startY;
        let left = this.dragState.initX + dx;
        let top  = this.dragState.initY + dy;
        const rect = this.container.getBoundingClientRect();
        const maxL = window.innerWidth - rect.width - 6;
        const maxT = window.innerHeight - rect.height - 6;
        left = Math.max(6, Math.min(maxL, left));
        top  = Math.max(6, Math.min(maxT,  top));
        this.container.style.left = `${left}px`;
        this.container.style.top  = `${top}px`;
      }
      onPointerUpDrag() {
        this.dragState.dragging = false;
        window.removeEventListener("pointermove", this.onPointerMoveDrag);
        window.removeEventListener("pointerup", this.onPointerUpDrag);
        this.container.style.transition = "";
        const rect = this.container.getBoundingClientRect();
        this.size = { w: Math.round(rect.width), h: Math.round(rect.height) };
        try { localStorage.setItem(LS_SIZE, JSON.stringify(this.size)); } catch {}
        try { localStorage.setItem(LS_POS,  JSON.stringify({ left: Math.round(rect.left), top: Math.round(rect.top) })); } catch {}
        this.pos = { left: Math.round(rect.left), top: Math.round(rect.top) };
      }
  
      onPointerDownResize(e){
        if (e.button !== 0 && e.pointerType === "mouse") return;
        e.preventDefault();
        this.container.classList.add('resizing');
        const r = this.container.getBoundingClientRect();
        this.resizeState = { startX: e.clientX, startY: e.clientY, startW: r.width, startH: r.height };
        window.addEventListener('pointermove', this.onPointerMoveResize);
        window.addEventListener('pointerup', this.onPointerUpResize);
      }
      onPointerMoveResize(e){
        if (!this.resizeState) return;
        const minW = 320, minH = 240;
        const maxW = Math.min(window.innerWidth - 16, 1200);
        const maxH = Math.min(window.innerHeight - 16, 1000);
        let newW = this.resizeState.startW + (e.clientX - this.resizeState.startX);
        let newH = this.resizeState.startH + (e.clientY - this.resizeState.startY);
        newW = Math.max(minW, Math.min(maxW, newW));
        newH = Math.max(minH, Math.min(maxH, newH));
        this.container.style.width  = newW + 'px';
        this.container.style.height = newH + 'px';
      }
      onPointerUpResize(){
        if (!this.resizeState) return;
        this.container.classList.remove('resizing');
        window.removeEventListener('pointermove', this.onPointerMoveResize);
        window.removeEventListener('pointerup', this.onPointerUpResize);
        const rect = this.container.getBoundingClientRect();
        this.size = { w: Math.round(rect.width), h: Math.round(rect.height) };
        try { localStorage.setItem(LS_SIZE, JSON.stringify(this.size)); } catch {}
        this.resizeState = null;
      }
  
      /* ===== DRAG NÚT TOGGLE ===== */
      onPointerDownToggle(e) {
        // Cho phép kéo với mọi pointer
        e.preventDefault();
        const rect = this.toggleBtn.getBoundingClientRect();
        this.toggleDrag.dragging = true;
        this.toggleBtn.__dragging = false; // cờ để phân biệt kéo vs click
        this.toggleDrag.startX = e.clientX;
        this.toggleDrag.startY = e.clientY;
        this.toggleDrag.initL = rect.left;
        this.toggleDrag.initT = rect.top;
        this.toggleBtn.setPointerCapture?.(e.pointerId);
        window.addEventListener("pointermove", this.onPointerMoveToggle, { passive: false });
        window.addEventListener("pointerup", this.onPointerUpToggle);
      }
      onPointerMoveToggle(e) {
        if (!this.toggleDrag.dragging) return;
        e.preventDefault();
        const dx = e.clientX - this.toggleDrag.startX;
        const dy = e.clientY - this.toggleDrag.startY;
        const w = this.toggleBtn.offsetWidth;
        const h = this.toggleBtn.offsetHeight;
        const maxL = window.innerWidth - w - 6;
        const maxT = window.innerHeight - h - 6;
        let left = this.toggleDrag.initL + dx;
        let top  = this.toggleDrag.initT + dy;
        left = Math.max(6, Math.min(maxL, left));
        top  = Math.max(6, Math.min(maxT, top));
        // áp vị trí
        this.toggleBtn.style.left = left + "px";
        this.toggleBtn.style.top  = top + "px";
        this.toggleBtn.style.right = "auto";
        // đánh dấu là đang kéo để không trigger click
        if (Math.abs(dx) + Math.abs(dy) > 3) this.toggleBtn.__dragging = true;
      }
      onPointerUpToggle(e) {
        if (!this.toggleDrag.dragging) return;
        this.toggleDrag.dragging = false;
        this.toggleBtn.releasePointerCapture?.(e.pointerId);
        window.removeEventListener("pointermove", this.onPointerMoveToggle);
        window.removeEventListener("pointerup", this.onPointerUpToggle);
        // lưu vị trí
        const rect = this.toggleBtn.getBoundingClientRect();
        const pos = { left: Math.round(rect.left), top: Math.round(rect.top) };
        this.togglePos = pos;
        try { localStorage.setItem(LS_TOGGLE_POS, JSON.stringify(pos)); } catch {}
        // nhỏ delay để click không ăn sau khi kéo
        setTimeout(() => { this.toggleBtn.__dragging = false; }, 30);
      }
      applyTogglePos() {
        if (!this.toggleBtn) return;
        if (this.togglePos) {
          this.toggleBtn.style.left = this.togglePos.left + "px";
          this.toggleBtn.style.top  = this.togglePos.top  + "px";
          this.toggleBtn.style.right = "auto";
        } else {
          // mặc định ở góc trên phải
          this.toggleBtn.style.top = Math.max(12, (this.pos?.top ?? 12)) + "px";
          this.toggleBtn.style.right = "12px";
          this.toggleBtn.style.left = "auto";
        }
      }
      boundToggleInside() {
        if (!this.toggleBtn || !this.toggleBtn.classList.contains("show")) return;
        const rect = this.toggleBtn.getBoundingClientRect();
        let left = rect.left, top = rect.top;
        const w = rect.width, h = rect.height;
        const maxL = window.innerWidth - w - 6;
        const maxT = window.innerHeight - h - 6;
        left = Math.max(6, Math.min(maxL, left));
        top  = Math.max(6, Math.min(maxT, top));
        this.toggleBtn.style.left = left + "px";
        this.toggleBtn.style.top  = top + "px";
        this.toggleBtn.style.right = "auto";
        // cập nhật lưu
        const pos = { left: Math.round(left), top: Math.round(top) };
        this.togglePos = pos;
        try { localStorage.setItem(LS_TOGGLE_POS, JSON.stringify(pos)); } catch {}
      }
      
      /* ===== Exporters ===== */
      exportToTxt() {
        let fullText = "";
        const blocks = [...this.contentArea.querySelectorAll(".qa-block")]
          .filter(b => b.style.display !== "none");
  
        blocks.forEach((block) => {
          const q = block.querySelector(".question-content");
          const content = block.querySelector(".content-container");
          if (!q || !content) return;
          const textQ = q.textContent.trim().replace(/\s\s+/g, " ");
          const textA = content.textContent.trim().replace(/\s\s+/g, " ");
          fullText += `${textQ}\n--> ${textA}\n\n`;
        });
  
        const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `dap-an-olm-${Date.now()}.txt`;
        ensureBody(link);
        link.click();
        link.remove();
      }
      
      // WORD V2: tạo file .doc (HTML) trực tiếp từ nội dung hiển thị
      exportToWordV2() {
        try {
          const blocks = [...this.contentArea.querySelectorAll('.qa-block')].filter(b => b.style.display !== 'none');
          if (!blocks.length) { alert('Không có nội dung để xuất.'); return; }
  
          const wrapper = document.createElement('div');
          const header = document.createElement('h1');
          header.textContent = 'Đòn Hư Lém, cavoixanh1806 - WORD V2';
          header.style.cssText = 'font-size:18px;text-align:center;margin:0 0 6px;';
          const time = document.createElement('div');
          time.textContent = new Date().toLocaleString('vi-VN');
          time.style.cssText = 'font:12px/1 monospace;color:#64748b;text-align:center;margin-bottom:12px;';
          wrapper.appendChild(header); wrapper.appendChild(time);
  
          blocks.forEach(b => {
            const clone = b.cloneNode(true);
            // bỏ highlight và các thuộc tính không cần thiết
            clone.querySelectorAll('mark.olm-hl').forEach(m => { const p=m.parentNode; while(m.firstChild) p.insertBefore(m.firstChild, m); p.removeChild(m); });
            // MathJax container giữ nguyên HTML kết xuất, Word sẽ hiển thị như hình/HTML
            // Chuẩn hoá ảnh sang absolute URL
            clone.querySelectorAll('img').forEach(img => {
              try { img.src = new URL(img.getAttribute('src'), location.href).href; } catch {}
              img.style.maxWidth = '100%'; img.style.height = 'auto';
            });
            wrapper.appendChild(clone);
          });
  
          const css = `
            body{ font-family: Arial, Helvetica, sans-serif; color:#0f172a; }
            .qa-block{ background:#f7f8fa; border:1px solid #e5e7eb; border-left:4px solid #3b82f6; border-radius:12px; padding:14px 16px; margin: 0 0 12px 0; }
            .qa-top{ padding-bottom:8px; border-bottom:1px dashed #d1d5db; margin-bottom:10px; }
            .q-index{ display:block; font-weight:700; color:#64748b; margin:0 0 6px 0; }
            .question-content{ color:#0f172a; line-height:1.5; font-weight:700; }
            .question-content p{ margin:6px 0; }
            .content-container{ margin-top:4px; color:#0b3c49; line-height:1.55; }
            .answer-list{ list-style: none; margin:8px 0 0 0; padding-left:14px; border-left:3px solid #e5e7eb; }
            .answer-list li{ margin:6px 0; color:#334155; }
            .answer-list.tf{ padding-left:18px; border-left:4px solid #93c5fd; }
            .answer-list.tf li{ padding:6px 8px; border-radius:8px; background:#f8fafc; }
            .correct-answer{ color:#16a34a !important; font-weight:800; }
            .correct-answer::before{ content: "✓ "; font-weight:900; }
            mjx-container{ page-break-inside: avoid; break-inside: avoid; }
          `;
  
          const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>OLM WORD V2</title>
          <style>${css}</style>
          </head><body>${wrapper.innerHTML}</body></html>`;
  
          const blob = new Blob([html], { type: 'application/msword' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = `olm-word-v2-${Date.now()}.doc`;
          ensureBody(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 2000);
        } catch (err) {
          console.error('Xuất WORD V2 lỗi:', err);
          alert('Xuất WORD V2 thất bại.');
        }
      }
      
      // GIỮ NGUYÊN HÀM XUẤT PDF
      async exportToPDF() {
        try {
          const visibleBlocks = [...this.contentArea.querySelectorAll(".qa-block")]
            .filter(b => b.style.display !== "none");
          if (!visibleBlocks.length) { alert("Không có nội dung để xuất."); return; }
  
          const root = document.createElement("div");
          root.className = "pdf-root";
  
          const header = document.createElement("div");
          header.style.cssText = "font-weight:700;font-size:18px;margin-bottom:6px;text-align:center";
          header.textContent = "Đòn Hư Lém, cavoixanh1806 - PDF";
          const time = document.createElement("div");
          time.style.cssText = "font-family:monospace;font-size:12px;color:#64748b;text-align:center;margin-bottom:12px";
          time.textContent = new Date().toLocaleString("vi-VN");
          root.append(header, time);
  
          visibleBlocks.forEach(b => {
            const clone = b.cloneNode(true);
            clone.querySelectorAll("mjx-container").forEach(m => {
              m.style.pageBreakInside = "avoid"; m.style.breakInside = "avoid";
            });
            clone.querySelectorAll("img").forEach(img => {
              try { img.src = new URL(img.getAttribute("src"), location.href).href; } catch {}
              img.style.maxWidth = "100%"; img.style.height = "auto";
            });
            root.appendChild(clone);
          });
  
          const spacer = document.createElement("div");
          spacer.className = "pdf-spacer";
          root.appendChild(spacer);
  
          await this.typesetForExport(root);
          await this.waitImages(root);
          await ensureHtml2Pdf();
  
          const opt = {
            margin: [10, 10, 12, 10],
            filename: `olm-${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              letterRendering: true,
              windowWidth: Math.max(document.documentElement.clientWidth, root.scrollWidth),
              windowHeight: root.scrollHeight + 200,
              scrollY: 0
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
          };
  
          const stash = document.createElement("div");
          stash.style.cssText = "position:fixed;left:-99999px;top:-99999px;width:900px;opacity:0;pointer-events:none";
          stash.appendChild(root);
          ensureBody(stash);
  
          await new Promise(r => setTimeout(r, 60));
  
          await UW.html2pdf().set(opt).from(root).save();
  
          stash.remove();
        } catch (err) {
          console.error("Xuất PDF lỗi:", err);
          try {
            const w = window.open("", "_blank");
            if (!w) throw new Error("Popup bị chặn");
            w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Đòn Hư Lém - PDF</title>
              <style>
                body{ font-family: Arial, Helvetica, sans-serif; padding: 16px; }
                .qa-block{ page-break-inside: avoid; break-inside: avoid; border:1px solid #ddd; border-radius:10px; padding:12px; margin-bottom:10px; }
                mjx-container{ page-break-inside: avoid; break-inside: avoid; }
                img{ max-width:100%; height:auto; }
                .pdf-spacer{ height: 24px; }
                h1{ font-size:18px; text-align:center; margin:0 0 6px; }
                .time{ font: 12px/1 monospace; color:#64748b; text-align:center; margin-bottom:12px; }
              </style>
            </head><body>
              <h1>Đòn Hư Lém, cavoixanh1806 - PDF</h1>
              <div class="time">${new Date().toLocaleString("vi-VN")}</div>
            </body></html>`);
            const body = w.document.body;
            const blocks = [...this.contentArea.querySelectorAll(".qa-block")].filter(b => b.style.display !== "none");
            blocks.forEach(b => body.appendChild(b.cloneNode(true)));
            body.appendChild(Object.assign(document.createElement("div"), { className: "pdf-spacer" }));
            const cfg = w.document.createElement("script");
            cfg.type = "text/javascript";
            cfg.text = `window.MathJax = { tex: { inlineMath: [['$', '$'], ['\\\\(', '\\\\)']], displayMath: [['$$','$$'], ['\\\\[','\\\\]']] }, startup: { typeset: true } };`;
            const mj = w.document.createElement("script");
            mj.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js";
            body.appendChild(cfg); body.appendChild(mj);
            mj.onload = () => setTimeout(() => { w.print(); }, 600);
          } catch {
            alert("Xuất PDF thất bại. Thử lại lần nữa giúp mình nhé!");
          }
        }
      }
  
      async typesetForExport(root) {
        if (UW.MathJax?.typesetPromise) {
          const box = document.createElement("div");
          box.style.cssText = "position:fixed;left:-99999px;top:-99999px;width:900px;opacity:0;pointer-events:none";
          box.appendChild(root);
          ensureBody(box);
          try { await UW.MathJax.typesetPromise([box]); } catch {}
          document.body.appendChild(root);
          box.remove();
          await new Promise(r => setTimeout(r, 30));
        }
      }
  
      waitImages(root) {
        const imgs = [...root.querySelectorAll("img")];
        if (!imgs.length) return Promise.resolve();
        return Promise.allSettled(imgs.map(img => new Promise(res => {
          if (img.complete && img.naturalWidth) return res();
          img.addEventListener("load", () => res(), { once: true });
          img.addEventListener("error", () => res(), { once: true });
        })));
      }
  
      copyAllVisibleAnswers() {
        const blocks = [...this.contentArea.querySelectorAll(".qa-block")].filter(b => b.style.display !== "none");
        if (!blocks.length) return;
        let out = "";
        blocks.forEach((b) => {
          const q = b.querySelector(".question-content")?.innerText ?? "";
          const a = b.querySelector(".content-container")?.innerText ?? "";
          out += `${q}\n--> ${a}\n\n`;
        });
        const doCopy = (txt) => navigator.clipboard?.writeText(txt).catch(() => {
          const ta = document.createElement("textarea"); ta.value = txt; ensureBody(ta); ta.select(); document.execCommand("copy"); ta.remove();
        });
        doCopy(out);
      }
  
      onKeyDown(event) {
        const isRightShift = event.code === 'ShiftRight' || (event.key === 'Shift' && event.location === 2);
        if (isRightShift) { event.preventDefault(); event.stopPropagation(); this.toggleVisibility(); return; }
        if (event.code === "ShiftRight") this.toggleVisibility();
        if (event.altKey && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
          const k = event.key.toLowerCase();
          if (k === "t") { event.preventDefault(); this.searchInput.focus(); this.searchInput.select(); }
          else if (k === "a") { event.preventDefault(); this.copyAllVisibleAnswers(); }
          else if (k === "d") { event.preventDefault(); this.toggleDarkMode(); }
          else if (k === "w") {
            event.preventDefault(); event.stopPropagation();
            // tránh gọi lặp khi người dùng giữ phím (event.repeat)
            if (this.exportDocBtn && !this.exportDocBtn.disabled && !event.repeat) {
              downloadWordFile({ target: this.exportDocBtn });
            }
          }
        }
      }
  
      toggleVisibility() {
        this.isVisible = !this.isVisible;
        this.container.classList.toggle("hidden", !this.isVisible);
        if (this.isVisible) this.hideToggleBtn(); else this.showToggleBtn();
      }
  
      toggleDarkMode() {
        this.dark = !this.dark;
        this.container.classList.toggle("olm-dark", this.dark);
        try { localStorage.setItem(LS_DARK, this.dark ? "1" : "0"); } catch {}
      }
  
      applyPosOnly() {
        const c = this.container; c.style.left = ""; c.style.right = ""; c.style.top = "";
        if (this.pos) {
          c.style.left = this.pos.left + "px";
          c.style.top  = this.pos.top  + "px";
        } else {
          c.style.right = "12px"; c.style.left = "auto"; c.style.top = "12px";
        }
      }
  
      showToggleBtn(){ this.toggleBtn?.classList.add("show"); this.applyTogglePos(); this.boundToggleInside(); }
      hideToggleBtn(){ this.toggleBtn?.classList.remove("show"); }
  
      renderContentWithMath(element) {
        const tryRender = () => {
          try {
            if (UW.MathJax?.typesetPromise) UW.MathJax.typesetPromise([element]).catch(() => {});
            else if (UW.MathJax?.Hub) UW.MathJax.Hub.Queue(["Typeset", UW.MathJax.Hub, element]);
          } catch (e) { console.error("Math render error:", e); }
        };
        setTimeout(tryRender, 50);
        setTimeout(tryRender, 250);
        setTimeout(tryRender, 600);
      }
  
      getAnswersAsDOM(question) {
        // Trả về toàn bộ đáp án, bôi xanh đáp án đúng (fallback 1 câu)
        const listElement = document.createElement("ul");
        listElement.className = 'answer-list';
        if (question.json_content) {
          try {
            const jsonData = JSON.parse(question.json_content);
            const groups = collectGroupsFromJSON(jsonData);
            if (groups.length){
              const items = groups[0].items;
              const isTF = items.length && items.every(it => TF_RE.test((it.text||'').trim()));
              if (isTF) listElement.classList.add('tf');
              items.forEach(it => {
                const li = document.createElement('li');
                if (it.correct) li.classList.add('correct-answer');
                li.textContent = isTF ? maybeStripHashForTFText(it.text) : stripAnswerLabels(stripLeadingHashes(it.text));
                listElement.appendChild(li);
              });
              return listElement;
            }
          } catch (e) { console.error("Lỗi phân tích JSON:", e); }
        }
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = decodeBase64Utf8(question.content || "");
        const firstList = tempDiv.querySelector("ol.quiz-list, ul.quiz-list, ol, ul");
        if (firstList) {
          const lis = [...firstList.children];
          const items = lis.map(li => ({
            correct: li.classList?.contains('correctAnswer') || !!li.querySelector?.('.correctAnswer'),
            text: stripAnswerLabels(stripLeadingHashes(li.textContent || ''))
          }));
          const isTF = items.length && items.every(it => TF_RE.test((it.text||'').trim()));
          if (isTF) listElement.classList.add('tf');
          items.forEach(it => {
            const li = document.createElement('li');
            if (it.correct) li.classList.add('correct-answer');
            li.textContent = isTF ? maybeStripHashForTFText(it.text) : stripAnswerLabels(stripLeadingHashes(it.text));
            listElement.appendChild(li);
          });
          return listElement;
        }
        const fillInInput = tempDiv.querySelector("input[data-accept]");
        if (fillInInput) {
          const ans = (fillInInput.getAttribute("data-accept")||'').split("|").map(s=>s.trim()).filter(Boolean);
          const li = document.createElement('li');
          li.className = 'correct-answer';
          li.textContent = `Kết quả: ${ans.join(' / ')}`;
          listElement.appendChild(li);
          return listElement;
        }
        return null;
      }
  
      getSolutionAsDOM(decodedContent) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = decodedContent;
        const solutionNode = tempDiv.querySelector(".loigiai, .huong-dan-giai, .explain, .solution, #solution, .guide, .exp, .exp-in");
        return solutionNode ? solutionNode.cloneNode(true) : null;
      }
  
      renderData(data) {
        if (!Array.isArray(data)) return;
  
        const responseContainer = document.createElement("div");
        const timestamp = new Date().toLocaleTimeString();
        responseContainer.innerHTML = `<p style="font-family:monospace;font-size:12px;background:rgba(0,0,0,0.06);padding:6px;border-radius:6px;"><b>Time:</b> ${timestamp}</p>`;
  
        data.forEach((question) => {
          let decodedContent = decodeBase64Utf8(question.content || "");
          decodedContent = mildLatexFix(decodedContent);
  
          // Ưu tiên tách theo HTML (đa prompt), fallback JSON/đơn lẻ
          const htmlGrouped = parseHtmlGroups(decodedContent);
          let groups = htmlGrouped.groups || [];
          if ((!groups || !groups.length) && question.json_content){
            try { groups = collectGroupsFromJSON(JSON.parse(question.json_content)); } catch {}
          }
  
          if (groups && groups.length){
            // dựng nhiều QA block theo từng nhóm
            groups.forEach((g, idx) => {
              const questionDiv = document.createElement('div'); questionDiv.className = 'qa-block';
              const qaTop = document.createElement('div'); qaTop.className = 'qa-top';
              const questionDisplayContainer = document.createElement('div'); questionDisplayContainer.className = 'question-content';
              const indexSpan = document.createElement('span'); indexSpan.className = 'q-index'; indexSpan.textContent = 'Câu ?. ';
              questionDisplayContainer.appendChild(indexSpan);
  
              if (idx === 0){
                // chèn phần dẫn + prompt 1
                const leadWrap = document.createElement('div'); leadWrap.innerHTML = htmlGrouped.preludeHTML || '';
                while (leadWrap.firstChild) questionDisplayContainer.appendChild(leadWrap.firstChild);
              }
              // Tránh lặp prompt ở block đầu (prompt đã có trong prelude)
              if (g.prompt && idx > 0){
                const p = document.createElement('p'); p.textContent = g.prompt; questionDisplayContainer.appendChild(p);
              }
              qaTop.appendChild(questionDisplayContainer);
  
              const contentContainer = document.createElement('div'); contentContainer.className = 'content-container'; contentContainer.dataset.type = 'answer';
              const ul = document.createElement('ul'); ul.className = 'answer-list';
              const isTF = g.items.length && g.items.every(it => TF_RE.test((it.text||'').trim()));
              if (isTF) ul.classList.add('tf');
              g.items.forEach(it => {
                const li = document.createElement('li'); if (it.correct) li.classList.add('correct-answer');
                li.textContent = isTF ? maybeStripHashForTFText(it.text) : stripAnswerLabels(stripLeadingHashes(it.text));
                // loại bỏ # nếu li dùng node text
                maybeStripHashInLI(li);
                ul.appendChild(li);
              });
              contentContainer.appendChild(ul);
              questionDiv.append(qaTop, contentContainer);
              responseContainer.appendChild(questionDiv);
            });
          } else {
            // fallback: 1 block như cũ, nhưng hiển thị toàn bộ đáp án + short-answer theo "Kết quả:"
            const answersElement = this.getAnswersAsDOM(question);
            const solutionElement = this.getSolutionAsDOM(decodedContent);
  
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = decodedContent;
            tempDiv.querySelectorAll('ol.quiz-list, ul.quiz-list, .interaction, .form-group, .loigiai, .huong-dan-giai, .explain, .solution, #solution, .guide, .exp, .exp-in').forEach(el => el.remove());
  
            const questionDiv = document.createElement('div'); questionDiv.className = 'qa-block';
            const qaTop = document.createElement('div'); qaTop.className = 'qa-top';
            const questionDisplayContainer = document.createElement('div'); questionDisplayContainer.className = 'question-content';
            const indexSpan = document.createElement('span'); indexSpan.className = 'q-index'; indexSpan.textContent = 'Câu ?. ';
            questionDisplayContainer.appendChild(indexSpan);
            while (tempDiv.firstChild) questionDisplayContainer.appendChild(tempDiv.firstChild);
            if (!questionDisplayContainer.hasChildNodes() && question.title) {
              questionDisplayContainer.innerHTML = `<span class="q-index">Câu ?. </span>${question.title}`;
            }
            qaTop.append(questionDisplayContainer);
            const contentContainer = document.createElement('div'); contentContainer.className = 'content-container';
            if (answersElement) { contentContainer.dataset.type = 'answer'; contentContainer.appendChild(answersElement); }
            else if (solutionElement) { contentContainer.dataset.type = 'solution'; contentContainer.appendChild(solutionElement); }
            else { contentContainer.dataset.type = 'not-found'; const nf = document.createElement('div'); nf.style.cssText='color:#6b7280;font-style:italic'; nf.textContent = 'Không tìm thấy đáp án hay lời giải.'; contentContainer.appendChild(nf); }
            questionDiv.append(qaTop, contentContainer);
            responseContainer.appendChild(questionDiv);
          }
        });
  
        this.contentArea.prepend(responseContainer);
        this.renumber(); this.updateCounts(); this.renderContentWithMath(this.contentArea);
        const kw = this.searchInput?.value?.trim(); if (kw) highlightInElement(this.contentArea, kw);
      }
  
      renumber() {
        const blocks = this.contentArea.querySelectorAll(".qa-block");
        let idx = 1;
        blocks.forEach((b) => {
          if (b.style.display === "none") return;
          const sp = b.querySelector(".q-index"); if (sp) sp.textContent = `Câu ${idx}. `;
          idx++;
        });
      }
      updateCounts() {
        const cnt = this.contentArea.querySelectorAll(".qa-block").length;
        const shown = [...this.contentArea.querySelectorAll(".qa-block")].filter(b => b.style.display !== "none").length;
        this.countBadge.textContent = `${shown} / ${cnt} hiển thị`;
        this.metaInfo.textContent = `${cnt} câu`;
      }
      filterQuestions(keyword) {
        const q = (keyword || "").trim().toLowerCase();
        const blocks = this.contentArea.querySelectorAll(".qa-block");
        let shown = 0;
        blocks.forEach((b) => {
          highlightInElement(b, "");
          const text = b.innerText.toLowerCase();
          const match = !q || text.includes(q);
          b.style.display = match ? "" : "none";
          if (match) { shown++; if (q) highlightInElement(b, q); }
        });
        this.countBadge.textContent = `${shown} / ${blocks.length} hiển thị`;
        this.renumber(); this.renderContentWithMath(this.contentArea);
      }
    }
  
    const answerUI = new AnswerDisplay();
    answerUI.init();
  
    // Network hooks
    const originalFetch = UW.fetch?.bind(UW) || fetch.bind(window);
    UW.fetch = function (...args) {
      const requestUrl = args[0] instanceof Request ? args[0].url : args[0];
      const p = originalFetch(...args);
      try {
        if (typeof requestUrl === "string" && requestUrl.includes(TARGET_URL_KEYWORD)) {
          p.then((response) => {
            if (response && response.ok) {
              response.clone().json().then((data) => answerUI.renderData(data)).catch((err) => console.error(err));
            }
          }).catch(() => {});
        }
      } catch (e) { console.error(e); }
      return p;
    };
  
    if (UW.XMLHttpRequest) {
      const origOpen = UW.XMLHttpRequest.prototype.open;
      const origSend = UW.XMLHttpRequest.prototype.send;
      UW.XMLHttpRequest.prototype.open = function (...args) {
        this._olm_url = args[1] || ""; return origOpen.apply(this, args);
      };
      UW.XMLHttpRequest.prototype.send = function (...args) {
        this.addEventListener("load", () => {
          try {
            if ((this._olm_url || this.responseURL || "").includes(TARGET_URL_KEYWORD) && this.status === 200) {
              try { const data = JSON.parse(this.responseText); answerUI.renderData(data); } catch (e) { console.error(e); }
            }
          } catch (e) {}
        });
        return origSend.apply(this, args);
      };
    }
  })();
  
  
