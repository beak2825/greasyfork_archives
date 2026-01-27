// ==UserScript==
// @name         AI Chat Navigation Sidebar (Export Plus)
// @name:en      AI Chat Navigation Sidebar (Export Plus)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a floating navigation sidebar to ChatGPT and Gemini. Features include drag-and-drop, bookmarking, theme switching, precise export, and search filtering. Optimized with MutationObserver for performance and supports dark mode.
// @description:en Adds a floating navigation sidebar to ChatGPT and Gemini. Features include drag-and-drop, bookmarking, theme switching, precise export, and search filtering. Optimized with MutationObserver for performance and supports dark mode.
// @author       RenZhe0228
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/564214/AI%20Chat%20Navigation%20Sidebar%20%28Export%20Plus%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564214/AI%20Chat%20Navigation%20Sidebar%20%28Export%20Plus%29.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
(function() {
    'use strict';

    // --- Utility Class ---
    const Utils = {
        debounce: (fn, delay) => {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => fn.apply(this, args), delay);
            };
        },
        storage: {
            get: (key, def) => (typeof GM_getValue !== 'undefined' ? GM_getValue(key, def) : JSON.parse(localStorage.getItem('ai-toc-' + key) || JSON.stringify(def))),
            set: (key, val) => (typeof GM_setValue !== 'undefined' ? GM_setValue(key, val) : localStorage.setItem('ai-toc-' + key, JSON.stringify(val)))
        },
        toast: (msg) => {
            const div = document.createElement('div');
            div.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.75);color:#fff;padding:8px 16px;border-radius:20px;z-index:10001;font-size:13px;backdrop-filter:blur(4px);pointer-events:none;`;
            div.textContent = msg;
            document.body.appendChild(div);
            setTimeout(() => { div.style.opacity = 0; setTimeout(() => div.remove(), 400); }, 2000);
        }
    };

    // --- Navigation Class ---
    class AIChatSideNav {
        constructor() {
            this.config = { symbol: '⌬', minW: 200, maxW: 300, len: 18 };
            this.state = {
                marks: new Set(Utils.storage.get('bookmarks', [])),
                isCollapsed: Utils.storage.get('collapsed', false),
                isWide: Utils.storage.get('wide', false),
                pos: Utils.storage.get('pos', { x: -1, y: 100 }),
                keyword: '',
                isDragging: false,
                offset: { x: 0, y: 0 },
                lastCount: 0
            };
            this.dom = {};
        }

        init() {
            this.injectCSS();
            this.render();
            this.bindEvents();
            this.setupObserver();
            this.scan(true);
        }

        injectCSS() {
            const css = `
                :root {
                    --at-bg: rgba(255, 255, 255, 0.9); --at-bd: #e2e8f0; --at-txt: #334155;
                    --at-h-bg: #f8fafc; --at-h-txt: #3b82f6; --at-act: #3b82f6; --at-shd: 0 4px 20px rgba(0,0,0,0.08);
                    --at-s-off: #cbd5e1; --at-s-on: #f59e0b;
                }
                @media (prefers-color-scheme: dark) {
                    :root {
                        --at-bg: rgba(28, 25, 23, 0.95); --at-bd: #f59e0b; --at-txt: #fef3c7;
                        --at-h-bg: #1c1917; --at-h-txt: #f59e0b; --at-act: #d97706; --at-shd: 0 4px 20px rgba(0,0,0,0.4);
                        --at-s-off: #57534e; --at-s-on: #f59e0b;
                    }
                }
                #ai-toc {
                    position: fixed; z-index: 9999; display: flex; flex-direction: column;
                    background: var(--at-bg); border: 1px solid var(--at-bd); color: var(--at-txt);
                    backdrop-filter: blur(12px); border-radius: 12px; box-shadow: var(--at-shd);
                    font-family: system-ui, sans-serif; transition: width 0.3s, opacity 0.3s;
                    max-height: 80vh;
                }
                /* Header & Footer: Fixed height, draggable cursor */
                #ai-head, #ai-foot { 
                    padding: 10px 12px; cursor: move; display: flex; justify-content: space-between; align-items: center; 
                    flex-shrink: 0; user-select: none;
                }
                #ai-head { border-bottom: 1px solid var(--at-bd); background: var(--at-h-bg); border-radius: 12px 12px 0 0; }
                #ai-foot { border-top: 1px solid var(--at-bd); border-radius: 0 0 12px 12px; font-size: 12px; }

                .ai-title { font-weight: 700; font-size: 16px; color: var(--at-h-txt); }
                .ai-ctrls { display: flex; gap: 8px; }
                .ai-btn { cursor: pointer; opacity: 0.6; transition: 0.2s; font-size: 14px; }
                .ai-btn:hover { opacity: 1; transform: scale(1.1); color: var(--at-act); }
                
                #ai-search { 
                    margin: 8px; padding: 4px 8px; border: 1px solid var(--at-bd); border-radius: 6px; 
                    background: transparent; color: var(--at-txt); font-size: 12px; outline: none; 
                    flex-shrink: 0;
                }
                #ai-search:focus { border-color: var(--at-act); }
                
                /* Body: Scrollable area */
                #ai-body { flex: 1; overflow-y: auto; padding: 4px 0; scrollbar-width: thin; min-height: 0; }
                #ai-body::-webkit-scrollbar { width: 3px; }
                #ai-body::-webkit-scrollbar-thumb { background: var(--at-bd); }
                
                .ai-item { padding: 6px 10px 6px 2px; cursor: pointer; display: flex; align-items: center; border-left: 3px solid transparent; transition: 0.15s; }
                .ai-item:hover { background: rgba(0,0,0,0.05); border-left-color: var(--at-act); padding-left: 8px; }
                .ai-item.mark { background: rgba(245, 158, 11, 0.05); border-left-color: var(--at-s-on); font-weight: 600; }
                .ai-star { width: 22px; text-align: center; color: var(--at-s-off); font-size: 12px; }
                .ai-item.mark .ai-star { color: var(--at-s-on); text-shadow: 0 0 4px var(--at-s-on); }
                .ai-txt { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; pointer-events: none; font-size: 12px; }
                
                .ai-wide { width: ${this.config.maxW}px !important; }
                .ai-norm { width: ${this.config.minW}px !important; }
                .ai-hide #ai-body, .ai-hide #ai-search, .ai-hide #ai-foot { display: none; }
                .ai-hide { width: auto !important; height: auto !important; }
            `;
            const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
        }

        render() {
            const mk = (tag, cls, attr = {}) => {
                const el = document.createElement(tag); if (cls) el.className = cls;
                for (const [k, v] of Object.entries(attr)) el[k] = v; return el;
            };

            this.dom.root = mk('div', this.state.isWide ? 'ai-wide' : 'ai-norm', { id: 'ai-toc' });
            if (this.state.isCollapsed) this.dom.root.classList.add('ai-hide');
            
            // Head
            const head = mk('div', '', { id: 'ai-head' });
            const title = mk('div', 'ai-title', { textContent: this.config.symbol });
            const ctrls = mk('div', 'ai-ctrls');
            const btnWide = mk('span', 'ai-btn', { textContent: '↔', title: 'Toggle Width' });
            this.dom.btnFold = mk('span', 'ai-btn', { textContent: this.state.isCollapsed ? '◀' : '▼', title: 'Collapse' });
            ctrls.append(btnWide, this.dom.btnFold); head.append(title, ctrls);

            // Body & Search
            this.dom.search = mk('input', '', { id: 'ai-search', placeholder: 'Search...', type: 'text' });
            this.dom.body = mk('div', '', { id: 'ai-body' });
            
            // Foot
            const foot = mk('div', '', { id: 'ai-foot' });
            const jumpCtrls = mk('div', 'ai-ctrls');
            const btnTop = mk('span', 'ai-btn', { textContent: '⬆', title: 'Top' });
            const btnBot = mk('span', 'ai-btn', { textContent: '⬇', title: 'Bottom' });
            jumpCtrls.append(btnTop, btnBot);
            
            const exportBtn = mk('span', 'ai-btn', { textContent: '📋', title: 'Click: Copy TOC\nShift+Click: Export Chat' });
            foot.append(jumpCtrls, exportBtn);

            this.dom.root.append(head, this.dom.search, this.dom.body, foot);
            document.body.appendChild(this.dom.root);

            // Initial Position
            if (this.state.pos.x !== -1) {
                this.dom.root.style.left = this.state.pos.x + 'px';
                this.dom.root.style.top = this.state.pos.y + 'px';
                this.dom.root.style.right = 'auto';
            } else {
                this.dom.root.style.top = '100px'; this.dom.root.style.right = '20px';
            }

            // Bind Actions
            btnWide.onclick = () => this.toggleWidth();
            this.dom.btnFold.onclick = () => this.toggleCollapse();
            btnTop.onclick = () => this.dom.body.scrollTo({ top: 0, behavior: 'smooth' });
            btnBot.onclick = () => this.dom.body.scrollTo({ top: this.dom.body.scrollHeight, behavior: 'smooth' });
            exportBtn.onclick = (e) => this.handleExport(e);
        }

        bindEvents() {
            // Search
            this.dom.search.oninput = (e) => { this.state.keyword = e.target.value.toLowerCase(); this.scan(true); };

            // Drag Handlers (Head & Foot)
            const startDrag = (e) => {
                // Ignore button clicks
                if (e.target.closest('.ai-btn') || e.target.closest('#ai-search')) return;
                
                this.state.isDragging = true;
                this.state.offset.x = e.clientX - this.dom.root.offsetLeft;
                this.state.offset.y = e.clientY - this.dom.root.offsetTop;
                e.currentTarget.style.cursor = 'grabbing';
            };

            const head = this.dom.root.querySelector('#ai-head');
            const foot = this.dom.root.querySelector('#ai-foot');
            
            head.onmousedown = startDrag;
            foot.onmousedown = startDrag; // Enable dragging on footer

            document.onmousemove = (e) => {
                if (!this.state.isDragging) return;
                this.dom.root.style.left = (e.clientX - this.state.offset.x) + 'px';
                this.dom.root.style.top = (e.clientY - this.state.offset.y) + 'px';
                this.dom.root.style.right = 'auto';
            };

            document.onmouseup = () => {
                if (this.state.isDragging) {
                    this.state.isDragging = false;
                    head.style.cursor = 'move';
                    foot.style.cursor = 'move';
                    Utils.storage.set('pos', { x: this.dom.root.offsetLeft, y: this.dom.root.offsetTop });
                }
            };
        }

        setupObserver() {
            const debouncedScan = Utils.debounce(() => this.scan(), 500);
            this.observer = new MutationObserver(() => debouncedScan());
            this.observer.observe(document.body, { childList: true, subtree: true });
        }

        scan(force = false) {
            const sels = ['div[data-message-author-role="user"]', 'user-query', '.user-query-text'];
            const nodes = Array.from(document.querySelectorAll(sels.join(','))).filter(el => el.innerText.trim());
            if (!force && nodes.length === this.state.lastCount && !this.state.keyword) return;
            this.state.lastCount = nodes.length;

            this.dom.body.textContent = '';
            const frag = document.createDocumentFragment();
            nodes.forEach((node) => {
                const txt = node.innerText.replace(/\n/g, ' ').trim();
                if (this.state.keyword && !txt.toLowerCase().includes(this.state.keyword)) return;
                const item = document.createElement('div');
                item.className = 'ai-item' + (this.state.marks.has(txt) ? ' mark' : '');
                item.title = txt;
                const star = document.createElement('span'); star.className = 'ai-star'; star.textContent = '★';
                star.onclick = (e) => {
                    e.stopPropagation();
                    this.state.marks.has(txt) ? this.state.marks.delete(txt) : this.state.marks.add(txt);
                    Utils.storage.set('bookmarks', Array.from(this.state.marks)); this.scan(true);
                };
                const label = document.createElement('span'); label.className = 'ai-txt';
                label.textContent = txt.length > this.config.len ? txt.slice(0, this.config.len) + '..' : txt;
                item.oncontextmenu = (e) => { e.preventDefault(); navigator.clipboard.writeText(txt); Utils.toast('Copied to clipboard'); };
                item.onclick = () => node.scrollIntoView({ behavior: 'smooth', block: 'center' });
                item.append(star, label); frag.append(item);
            });
            this.dom.body.append(frag.childElementCount ? frag : Object.assign(document.createElement('div'), { className: 'ai-txt', style: 'padding:10px;text-align:center', textContent: 'Waiting...' }));
        }

        toggleCollapse() {
            this.state.isCollapsed = !this.state.isCollapsed;
            this.dom.root.classList.toggle('ai-hide');
            this.dom.btnFold.textContent = this.state.isCollapsed ? '+' : '−';
            Utils.storage.set('collapsed', this.state.isCollapsed);
        }

        toggleWidth() {
            this.state.isWide = !this.state.isWide;
            this.state.isWide ? this.dom.root.classList.replace('ai-norm', 'ai-wide') : this.dom.root.classList.replace('ai-wide', 'ai-norm');
            Utils.storage.set('wide', this.state.isWide);
        }

        handleExport(e) {
            e.stopPropagation();
            if (e.shiftKey) {
                const log = this.getChatLog();
                if (!log) return Utils.toast("No conversation found");
                navigator.clipboard.writeText(log).then(() => Utils.toast("✅ Full Chat Copied"));
            } else {
                const list = Array.from(this.dom.body.querySelectorAll('.ai-item')).map(n => n.title).join('\n');
                navigator.clipboard.writeText(list).then(() => Utils.toast("✅ TOC Copied"));
            }
        }

        getChatLog() {
            let log = [`=== Exported Chat (${new Date().toLocaleString()}) ===\n`];
            const isGPT = location.host.includes('chatgpt.com');
            const blocks = isGPT ? document.querySelectorAll('div[data-message-author-role]') : document.querySelectorAll('user-query, model-response');
            if (!blocks.length) return null;
            blocks.forEach(b => {
                const isUser = isGPT ? b.getAttribute('data-message-author-role') === 'user' : b.tagName.toLowerCase() === 'user-query';
                log.push(`${isUser ? '[User]' : '[AI]'}\n${b.innerText.trim()}\n-------------------`);
            });
            return log.join('\n\n');
        }
    }

    const app = new AIChatSideNav();
    window.addEventListener('load', () => app.init());
    let lastUrl = location.href;
    setInterval(() => { if (location.href !== lastUrl) { lastUrl = location.href; if (!document.getElementById('ai-toc')) app.init(); else app.scan(true); } }, 2000);

})();