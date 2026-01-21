// ==UserScript==
// @name         Hack OLM của Lucas
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Hack olm
// @author       Lucas
// @match        *://*.olm.vn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563365/Hack%20OLM%20c%E1%BB%A7a%20Lucas.user.js
// @updateURL https://update.greasyfork.org/scripts/563365/Hack%20OLM%20c%E1%BB%A7a%20Lucas.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const HOOK_CODE = `(() => {
      if (window.__olmHooked) return; window.__olmHooked = true;

      const tryParseJSON = (text) => { try { return JSON.parse(text); } catch { return null; } };
      const looksLikeBase64 = (s) => typeof s === 'string' && s.length > 16 && /^[A-Za-z0-9+/=]+$/.test(s);
      const collectContents = (obj, out) => {
        if (!obj) return;
        if (Array.isArray(obj)) { for (const it of obj) collectContents(it, out); return; }
        if (typeof obj === 'object') {
          for (const [k, v] of Object.entries(obj)) {
            if (k === 'content' && looksLikeBase64(v)) out.push(v);
            collectContents(v, out);
          }
        }
      };

      const postIfHasContents = (meta, text) => {
        const json = tryParseJSON(text); if (!json) return;
        const contents = []; collectContents(json, contents);
        if (contents.length) {
          window.postMessage({ type: 'OLM_SNIF_CONTENTS', meta, contents }, '*');
        }
      };

      // XHR hook
      (() => {
        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;
        const origSetHeader = XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
          this.__olm = { method, url, headers: {}, body: null };
          try { this.addEventListener('load', () => {
            if (this.responseType && this.responseType !== 'text') return;
            postIfHasContents(this.__olm, this.responseText || '');
          }); } catch {}
          return origOpen.call(this, method, url, ...rest);
        };
        XMLHttpRequest.prototype.setRequestHeader = function(h, v) {
          try { if (this.__olm) this.__olm.headers[h] = v; } catch {}
          return origSetHeader.call(this, h, v);
        };
        XMLHttpRequest.prototype.send = function(body) {
          try { if (this.__olm) this.__olm.body = body; } catch {}
          return origSend.call(this, body);
        };
      })();

      // fetch hook
      (() => {
        const origFetch = window.fetch;
        window.fetch = function(input, init) {
            const method = (init && init.method) || (input && input.method) || 'GET';
            const url = typeof input === 'string' ? input : (input && input.url) || '';
            const headers = (init && init.headers) || (input && input.headers) || {};
            const body = (init && init.body) || (input && input.body) || null;
          const meta = { method, url, headers, body };
            const p = origFetch(input, init);
          p.then(r => { try { const c = r.clone(); c.text().then(t => postIfHasContents(meta, t)).catch(()=>{}); } catch {} }).catch(()=>{});
            return p;
        };
      })();
    })();`;

    const inject = () => {
    const s = document.createElement('script');
    s.textContent = HOOK_CODE;
    (document.head || document.documentElement).appendChild(s);
    s.remove();
    };
    inject();
    const state = { isVisible: true, items: [], originals: [], firstMeta: null };

    // Lazy loader for html beautifier
    let beautifierLoading = null;
    function ensureBeautifier() {
        if (window.html_beautify) return Promise.resolve();
        if (beautifierLoading) return beautifierLoading;
        beautifierLoading = new Promise((resolve) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/js-beautify@1.14.11/js/lib/beautify-html.min.js';
            s.async = true;
            s.onload = () => resolve();
            s.onerror = () => resolve();
            document.head.appendChild(s);
        });
        return beautifierLoading;
    }

    // Lazy loader for MathJax
    let mathjaxLoading = null;
    function ensureMathJax() {
        if (window.MathJax && window.MathJax.typesetPromise) return Promise.resolve();
        if (mathjaxLoading) return mathjaxLoading;
        window.MathJax = {
            tex: {
                inlineMath: [["$","$"],["\\(","\\)"]],
                displayMath: [["$$","$$"],["\\[","\\]"]],
                processEscapes: true,
                packages: { '[+]': ['mhchem'] }
            },
            loader: { load: ['[tex]/mhchem'] }
        };
        mathjaxLoading = new Promise((resolve) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
            s.async = true;
            s.onload = () => resolve();
            s.onerror = () => resolve();
            document.head.appendChild(s);
        });
        return mathjaxLoading;
    }

    const utils = {
        safeDecode(base64) {
            try { return decodeURIComponent(escape(atob(base64))); } catch { return null; }
        }
    };

    // Fuzzy matching utilities
    const fuzzyMatch = {
        normalize(text) {
            return text.toLowerCase()
                .replace(/\s+/g, ' ')
                .replace(/[^\w\s]/g, '')
                .trim();
        },
        similarity(s1, s2) {
            const n1 = this.normalize(s1);
            const n2 = this.normalize(s2);
            if (n1 === n2) return 1;
            if (!n1 || !n2) return 0;
            const len1 = n1.length;
            const len2 = n2.length;
            const maxLen = Math.max(len1, len2);
            if (n1.includes(n2) || n2.includes(n1)) {
                return 0.8 + (0.2 * Math.min(len1, len2) / maxLen);
            }
            const chars1 = new Set(n1.split(''));
            const chars2 = new Set(n2.split(''));
            const intersection = new Set([...chars1].filter(x => chars2.has(x)));
            const union = new Set([...chars1, ...chars2]);
            return intersection.size / union.size;
        },
        findBestMatch(searchText) {
            const candidates = [];
            const minLength = 3;
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        const text = node.textContent.trim();
                        if (text.length < minLength) return NodeFilter.FILTER_REJECT;
                        const parent = node.parentElement;
                        if (!parent || parent.closest('#olm-answers-container')) return NodeFilter.FILTER_REJECT;
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );
            let node;
            while (node = walker.nextNode()) {
                const text = node.textContent.trim();
                const parent = node.parentElement;
                if (parent) {
                    candidates.push({ element: parent, text });
                }
            }
            let bestMatch = null;
            let bestScore = 0;
            for (const candidate of candidates) {
                const score = this.similarity(searchText, candidate.text);
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = candidate.element;
                }
            }
            return bestScore > 0.3 ? bestMatch : null;
        }
    };

    // Scroll and highlight element
    function scrollToElement(element) {
        if (!element) return false;
        document.querySelectorAll('.olm-highlight').forEach(el => {
            el.classList.remove('olm-highlight');
        });
        element.classList.add('olm-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            element.classList.remove('olm-highlight');
        }, 3000);
        return true;
    }

    // Process HTML snippets
    async function processAndAppend(htmlSnippets) {
        await ensureBeautifier();
        const beautify = window.html_beautify || ((s)=>s);
        const options = {
            indent_size: 2,
            preserve_newlines: true,
            max_preserve_newlines: 2,
            wrap_line_length: 0,
            content_unformatted: ['pre','code','textarea']
        };
        for (const html of htmlSnippets) {
            const container = document.createElement('div');
            container.innerHTML = html;
            try {
                state.originals.push(beautify(container.innerHTML, options));
            } catch {}
            const segments = [];
            let current = document.createElement('div');
            const pushCurrentIfAny = () => {
                const s = current.innerHTML.trim();
                if (s) segments.push(beautify(s, options));
                current = document.createElement('div');
            };
            Array.from(container.childNodes).forEach((node) => {
                if (node.nodeType === 1 && node.classList && node.classList.contains('exp')) {
                    pushCurrentIfAny();
                    return;
                }
                current.appendChild(node.cloneNode(true));
            });
            pushCurrentIfAny();
            if (segments.length) {
                state.items.push(...segments);
            } else {
                container.querySelectorAll('.exp').forEach(el => el.remove());
                state.items.push(beautify(container.innerHTML, options));
            }
        }
        ui.update();
    }

    window.addEventListener('message', (ev) => {
        const msg = ev.data;
        if (!msg || msg.type !== 'OLM_SNIF_CONTENTS') return;
        if (!state.firstMeta) state.firstMeta = msg.meta || null;
        const decoded = (msg.contents || []).map(utils.safeDecode).filter(Boolean);
        if (!decoded.length) return;
        processAndAppend(decoded);
    }, false);

    async function downloadWordFile(event) {
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Đang xử lý...';
        button.disabled = true;
        try {
            const match = window.location.pathname.match(/(\d+)$/);
            if (!match || !match[0]) {
                alert('Đã làm bài đâu mà thấy.');
                throw new Error('Không tìm thấy ID chủ đề trong pathname.');
            }
            const id_cate = match[0];
            button.textContent = 'Đợi tí.........................................................................................';
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
            button.textContent = originalText;
            button.disabled = false;
        }
    }

    const ui = {
        el: {},
        // THÊM: Quản lý trạng thái kéo
        dragState: { isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 },

        // THÊM: Hàm xử lý kéo
        onMouseDown(event) {
            // Bỏ qua nếu nhấn vào nút resize
            if (event.target.classList.contains('olm-mini-resize')) return;

            this.dragState.isDragging = true;
            const rect = this.el.panel.getBoundingClientRect();

            // Quan trọng: Phải GỠ BỎ 'right' và 'bottom' nếu đang dùng
            // Script này set 'top' và 'right' ban đầu. Ta phải đổi 'right' -> 'left'.
            this.el.panel.style.right = 'auto';
            this.el.panel.style.left = `${rect.left}px`;

            this.dragState.initialX = rect.left;
            this.dragState.initialY = rect.top;
            this.dragState.startX = event.clientX;
            this.dragState.startY = event.clientY;

            // Phải bind 'this' cho các listener này vì chúng được gọi bởi 'window'
            this.boundOnMouseMove = this.onMouseMove.bind(this);
            this.boundOnMouseUp = this.onMouseUp.bind(this);

            window.addEventListener('mousemove', this.boundOnMouseMove);
            window.addEventListener('mouseup', this.boundOnMouseUp);
        },

        // THÊM: Hàm xử lý di chuột
        onMouseMove(event) {
            if (!this.dragState.isDragging) return;
            event.preventDefault();
            const dx = event.clientX - this.dragState.startX;
            const dy = event.clientY - this.dragState.startY;
            this.el.panel.style.left = `${this.dragState.initialX + dx}px`;
            this.el.panel.style.top = `${this.dragState.initialY + dy}px`;
        },

        // THÊM: Hàm xử lý nhả chuột
        onMouseUp() {
            this.dragState.isDragging = false;
            window.removeEventListener('mousemove', this.boundOnMouseMove);
            window.removeEventListener('mouseup', this.boundOnMouseUp);
        },

        init() {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes gradient-animation {
                    0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; }
                }
                #olm-answers-container {
                    position: fixed; top: 10px; right: 10px; width: 450px; max-height: 90vh;
                    border: 1px solid #cccccc; border-radius: 8px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
                    z-index: 10000; display: flex; flex-direction: column;
                    font-size: 16px;
                    /* THAY ĐỔI: Bỏ 'resize: both;' để dùng tay cầm tùy chỉnh */
                    overflow: hidden;
                    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
                    color: #333;
                    background: linear-gradient(45deg, #e0f7fa, #d1c4e9, #fce4ec, #e0f7fa);
                    background-size: 400% 400%; animation: gradient-animation 20s ease infinite;
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);
                }
                #olm-answers-container.hidden {
                    opacity: 0;
                    transform: scale(0.95) translateX(20px);
                    pointer-events: none;
                }
                .olm-answers-header {
                    padding: 10px 15px; background-color: rgba(255, 255, 255, 0.4); border-bottom: 1px solid #cccccc;
                    cursor: move; /* THÊM: Con trỏ di chuyển */
                    user-select: none; font-weight: bold; text-align: center;
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(1px);
                    color: #000;
                }
                #olm-answers-content {
                    padding: 10px; margin: 0; flex-grow: 1; overflow-y: auto; background-color: rgba(255, 255, 255, 0.8);
                }
                #olm-answers-footer {
                    padding: 8px; background-color: rgba(255, 255, 255, 0.4); border-top: 1px solid #cccccc; text-align: center;
                    backdrop-filter: blur(8px);
                }
                #olm-dl-word {
                    padding: 8px 16px; border: none; background-color: #28a745; color: white;
                    border-radius: 6px; cursor: pointer; font-weight: bold; transition: background-color 0.2s, transform 0.1s;
                    font-size: 15px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                #olm-dl-word:hover {
                    background-color: #218838;
                    transform: translateY(-1px);
                }
                #olm-dl-word:disabled {
                    background-color: #9e9e9e;
                    cursor: not-allowed;
                    transform: none;
                }

                #olm-answers-content::-webkit-scrollbar { width: 8px; }
                #olm-answers-content::-webkit-scrollbar-track { background: #f1f1f1; }
                #olm-answers-content::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
                #olm-answers-content::-webkit-scrollbar-thumb:hover { background: #555; }

                /* Style cho highlight từ Click-to-find */
                .olm-highlight {
                    background-color: rgba(255, 255, 0, 0.4) !important;
                    outline: 2px solid #ffd700 !important;
                    outline-offset: 2px;
                    transition: all 0.3s ease;
                }
                .olm-item{
                    background:#f8f8f8;
                    border-left:3px solid #007bff;
                    padding:10px;
                    border-radius:0 6px 6px 0;
                    margin-bottom:12px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .olm-item .question-content {
                    font-weight: bold;
                    color: #0056b3;
                    margin-bottom: 8px;
                }
                .olm-item .content-container {
                    padding: 8px 0 0 15px;
                    border-top: 1px dashed #e0e0e0;
                    margin-top: 8px;
                }
                .olm-item .content-container[data-type="answer"] { color: #dc3545; font-weight: bold; }
                .olm-item .content-container[data-type="solution"] { color: #28a745; }
                .olm-item .content-container[data-type="not-found"] { color: #777; font-style: italic; }
                .olm-item img{max-width:100%;height:auto;}
                .olm-item li.correctAnswer{color:#48bb78;font-weight:600}
                .olm-item .fill-answer{color:#48bb7Ghi}
                .olm-item [dir="ltr"]{cursor:pointer;transition:background 0.2s;padding:2px;border-radius:3px}
                .olm-item [dir="ltr"]:hover{background:#d0eaff}
                .olm-item ol.quiz-list{margin:0 0 6px 20px;padding:0}
                .olm-item ol.quiz-list li{margin:0;padding:0}

                /* THÊM LẠI: CSS cho tay cầm resize đã bị mất */
                .olm-mini-resize {
                    position:absolute; bottom:0; left:0;
                    width:28px; height:28px;
                    cursor:nesw-resize; opacity:.7;
                    touch-action:none; -webkit-user-select:none; user-select:none;
                    background:linear-gradient(135deg,transparent 60%, rgba(255,255,255,.35) 60%, rgba(255,255,255,.35) 65%, transparent 65%)
                }
                .olm-mini-resize:active{opacity:1}
            `;
            document.head.appendChild(style);

            const panel = document.createElement('div');
            panel.id = 'olm-answers-container';
            // THAY ĐỔI: Xóa class 'hidden' để hiện mặc định
            // panel.classList.add('hidden');

            panel.innerHTML = `
              <div class="olm-answers-header">Code của KIM KHOA 6C2 (Đừng mách Cô)</div>
              <div id="olm-answers-content"><div>Ko có phải chịu.</div></div>
              <div id="olm-answers-footer">
                <button id="olm-dl-word">File word đáp án </button>
              </div>
            `;
            document.body.appendChild(panel);

            const resize = document.createElement('div');
            resize.className = 'olm-mini-resize';
            panel.appendChild(resize);

            // Gắn sự kiện lắng nghe phím Shift phải
            window.addEventListener('keydown', (event) => {
                if (event.code === 'ShiftRight') {
                    ui.toggleVisibility();
                }
            });

            this.el = {
                panel,
                header: panel.querySelector('.olm-answers-header'), // THÊM: Chọn header
                body: panel.querySelector('#olm-answers-content'),
                dlWord: panel.querySelector('#olm-dl-word'),
                resize
            };

            // THÊM: Gắn sự kiện kéo-thả cho header
            this.onMouseDown = this.onMouseDown.bind(this); // Bind 'this' một lần
            this.el.header.addEventListener('mousedown', this.onMouseDown);

            // Gắn sự kiện cho nút tải
            this.el.dlWord.onclick = downloadWordFile;

            // "Click-to-find"
            this.el.body.addEventListener('click', (e) => {
                const ltrEl = e.target.closest('[dir="ltr"]');
                if (!ltrEl) return;
                const itemEl = ltrEl.closest('.olm-item');
                if (!itemEl) return;
                e.stopPropagation();
                const searchText = ltrEl.textContent.trim();
                if (!searchText) return;
                const matchEl = fuzzyMatch.findBestMatch(searchText);
                if (matchEl) {
                    scrollToElement(matchEl);
                } else {
                    const origBg = ltrEl.style.backgroundColor;
                    ltrEl.style.backgroundColor = 'rgba(255, 136, 136, 0.3)';
                    setTimeout(() => { ltrEl.style.backgroundColor = origBg; }, 300);
                }
            });

            // Resize handle
            (function setupResize(panelEl, handle){
                let isResizing = false; let startX = 0; let startY = 0; let startW = 0; let startH = 0;
                const minW = 220; const minH = 180; const maxW = Math.round(window.innerWidth * 0.9); const maxH = Math.round(window.innerHeight * 0.9);
                const getSizes = () => {
                    const cs = window.getComputedStyle(panelEl);
                    return { w: parseInt(cs.width, 10) || panelEl.offsetWidth, h: parseInt(cs.height, 10) || panelEl.offsetHeight };
                };
                const onStart = (cx, cy) => { isResizing = true; const s = getSizes(); startW = s.w; startH = s.h; startX = cx; startY = cy; document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onEnd); document.addEventListener('touchmove', onTouchMove, { passive: false }); document.addEventListener('touchend', onEnd); };
                const onMove = (e) => { if (!isResizing) return; e.preventDefault(); const cx = e.clientX; const cy = e.clientY; applyResize(cx, cy); };
                const onTouchMove = (e) => { if (!isResizing) return; e.preventDefault(); const t = e.touches[0]; applyResize(t.clientX, t.clientY); };
                const applyResize = (cx, cy) => {
                    const newW = Math.max(minW, Math.min(maxW, startW + (startX - cx)));
                    const newH = Math.max(minH, Math.min(maxH, startH + (cy - startY)));
                    panelEl.style.width = newW + 'px';
                    panelEl.style.height = newH + 'px';
                };
                const onEnd = () => { isResizing = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onEnd); document.removeEventListener('touchmove', onTouchMove); document.removeEventListener('touchend', onEnd); };
                handle.addEventListener('mousedown', (e) => { onStart(e.clientX, e.clientY); });
                handle.addEventListener('touchstart', (e) => { if (!e.touches || !e.touches[0]) return; e.preventDefault(); const t = e.touches[0]; onStart(t.clientX, t.clientY); }, { passive: false });
            })(panel, resize);
        },

        toggleVisibility() {
            state.isVisible = !state.isVisible;
            this.el.panel.classList.toggle('hidden', !state.isVisible);
            if (state.isVisible) {
                this.update();
            }
        },

        update() {
            if (!this.el.body) return;
            if (!state.items.length) { this.el.body.innerHTML = '<div>Không có dữ liệu. Bắt đầu một bài tập hoặc trắc nghiệm.</div>'; return; }
            const renderSegment = (html) => {
                const tmp = document.createElement('div');
                tmp.innerHTML = html;
                if (!tmp.querySelector('li.correctAnswer')) {
                    tmp.querySelectorAll('input[data-accept]').forEach(inp => {
                        const v = inp.getAttribute('data-accept') || '';
                        const span = document.createElement('span');
                        span.className = 'fill-answer';
                        span.textContent = v;
                        inp.replaceWith(span);
                    });
                }
                return tmp.innerHTML;
            };
            this.el.body.innerHTML = state.items.map((html, i) => `
                <div class="olm-item">
                    <div style="opacity:.7;margin-bottom:4px; font-size: 13px; color: #555;">Câu ${i+1}</div>
                    ${renderSegment(html)}
                </div>
            `).join('');
            ensureMathJax().then(() => {
                try { window.MathJax.typesetPromise && window.MathJax.typesetPromise([this.el.body]); } catch {}
            });
        }
    };
    const onReady = () => ui.init();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
    else onReady();
})();