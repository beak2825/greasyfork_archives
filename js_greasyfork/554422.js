if (typeof window.LecteurMedia === 'undefined') {
    (function() {
        'use strict';
    
    const IS_DEV_MODE = false; // Mettre à false en production
    const baseUrl = IS_DEV_MODE 
        ? 'https://jvc-preview-proxy-test.lecteurmedia.workers.dev' 
        : 'https://jvc-preview-proxy.lecteurmedia.workers.dev';

    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function sanitizeUrl(url) {
        if (!url) return '';
        if (/^\s*(javascript|data|vbscript):/i.test(url)) return '#';
        return escapeHTML(url);
    }

    function safeHTML(htmlContent) {
        if (typeof window.DOMPurify !== 'undefined') {
            window.DOMPurify.addHook('afterSanitizeAttributes', function (node) {
                if ('target' in node) {
                    node.setAttribute('target', '_blank');
                    node.setAttribute('rel', 'noopener noreferrer');
                }
                if (node.tagName === 'IFRAME') {
                    node.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-presentation');
                }
            });

            return window.DOMPurify.sanitize(htmlContent, {
                ADD_TAGS: ['iframe', 'video', 'audio', 'source', 'track'],
                ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target', 'autoplay', 'loop', 'controls', 'playsinline', 'muted', 'poster', 'loading', 'src', 'href', 'sandbox', 'referrerpolicy', 'data-src', 'crossorigin'] // Sandbox ajouté aux autorisés
            });
        }
        console.log("[LecteurMedia] DOMPurify non détecté.");

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            const body = doc.body;

            const allowedTags = ['DIV', 'SPAN', 'P', 'BR', 'A', 'IMG', 'VIDEO', 'IFRAME', 'AUDIO', 'SOURCE', 'BLOCKQUOTE', 'BUTTON', 'SVG', 'PATH', 'LINE', 'RECT', 'CIRCLE', 'STRONG', 'B', 'I', 'EM'];
            const allowedAttrs = ['src', 'href', 'class', 'style', 'width', 'height', 'target', 'rel', 'controls', 'autoplay', 'loop', 'muted', 'poster', 'frameborder', 'scrolling', 'allow', 'allowfullscreen', 'title', 'alt', 'loading', 'sandbox', 'viewbox', 'd', 'fill', 'stroke', 'stroke-width', 'data-count', 'data-index', 'referrerpolicy', 'data-src', 'crossorigin'];

            function sanitizeNode(node) {
                if (node.nodeType === 8 || node.tagName === 'SCRIPT' || node.tagName === 'STYLE') { 
                    node.remove(); return; 
                }

                if (node.nodeType === 3) return;

                if (node.nodeType === 1) {
                    const tagName = node.tagName.toUpperCase();

                    if (!allowedTags.includes(tagName)) {
                        node.remove();
                        return;
                    }

                    const attrs = Array.from(node.attributes);
                    for (const attr of attrs) {
                        const name = attr.name.toLowerCase();
                        const val = attr.value.toLowerCase();
                        
                        if (name.startsWith('on') || val.includes('javascript:') || val.includes('data:') || !allowedAttrs.includes(name)) {
                            node.removeAttribute(name);
                        }
                    }

                    if (tagName === 'A') {
                        node.setAttribute('target', '_blank');
                        node.setAttribute('rel', 'noopener noreferrer');
                    }
                    if (tagName === 'IFRAME') {
                        node.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-presentation');
                    }

                    Array.from(node.childNodes).forEach(child => sanitizeNode(child));
                }
            }

            Array.from(body.childNodes).forEach(child => sanitizeNode(child));
            return body.innerHTML;
        } catch (e) {
            return "";
        }
    }

    
    function createSafeEmbed(htmlContent, className = 'bloc-embed') {
        const container = createSafeDiv();
        container.className = className;
        container.innerHTML = safeHTML(htmlContent);
        return container;
    }

    function createSafeDiv() {
        const div = document.createElement('div');
        Object.defineProperty(div, 'innerHTML', {
            configurable: true, 
            enumerable: true,
            get() {
                return Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').get.call(this);
            },
            set(html) {
                const clean = safeHTML(html);
                Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set.call(this, clean);
            }
        });
        return div;
    }

    class JVCodeManager {
        constructor() {
            this.initialLangs = [
                { name: 'Texte', piston: null, hljs: 'text' },
                { name: 'Python', piston: 'python', hljs: 'python' },
                { name: 'JavaScript', piston: 'javascript', hljs: 'javascript' },
                { name: 'TypeScript', piston: 'typescript', hljs: 'typescript' },
                { name: 'Java', piston: 'java', hljs: 'java' },
                { name: 'C', piston: 'c', hljs: 'c' },
                { name: 'C++', piston: 'cpp', hljs: 'cpp' },
                { name: 'C#', piston: 'csharp', hljs: 'csharp' },
                { name: 'Go', piston: 'go', hljs: 'go' },
                { name: 'Rust', piston: 'rust', hljs: 'rust' },
                { name: 'PHP', piston: 'php', hljs: 'php' },
                { name: 'Lua', piston: 'lua', hljs: 'lua' },
                { name: 'Bash', piston: 'bash', hljs: 'bash' },
                { name: 'SQL', piston: 'sqlite3', hljs: 'sql' }
            ];
            
            this.fallbackRuntimes = [
                { language: 'swift', version: 'Offline fallback', aliases: [] },
                { language: 'ruby', version: 'Offline fallback', aliases: [] },
                { language: 'kotlin', version: 'Offline fallback', aliases: [] },
                { language: 'scala', version: 'Offline fallback', aliases: [] },
                { language: 'perl', version: 'Offline fallback', aliases: [] },
                { language: 'haskell', version: 'Offline fallback', aliases: [] },
                { language: 'clojure', version: 'Offline fallback', aliases: [] },
                { language: 'elixir', version: 'Offline fallback', aliases: [] },
                { language: 'dart', version: 'Offline fallback', aliases: [] }
            ];

            this.cachedRuntimes = null;
            this.currentSelectElement = null;
            this.modalOverlay = null;
            this.previewState = {};
            this.observer = null;
            this.isEnabled = false;
            this.cssInitialized = false;
            
        }

        init() {
            if (this.cssInitialized) return;
            this.cssInitialized = true;

            try {
                const hljsCss = GM_getResourceText("HLJS_CSS");
                if(hljsCss) GM_addStyle(hljsCss);
                
                GM_addStyle(`
                    /* SVG Data URIs */
                    :root {
                        --jv-icon-play: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='14' height='14' stroke='%23abb2bf' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='5 3 19 12 5 21 5 3'%3E%3C/polygon%3E%3C/svg%3E");
                        --jv-icon-stop: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='14' height='14' stroke='%23e06c75' stroke-width='2' fill='%23e06c75' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='6' y='6' width='12' height='12'%3E%3C/rect%3E%3C/svg%3E");
                        --jv-icon-loader: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='14' height='14' stroke='%23e06c75' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12a9 9 0 1 1-6.219-8.56'%3E%3C/path%3E%3C/svg%3E");
                        --jv-icon-copy: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='16' height='16' stroke='%23abb2bf' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='9' width='13' height='13' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'%3E%3C/path%3E%3C/svg%3E");
                        --jv-icon-check: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='16' height='16' stroke='%2398c379' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
                        --jv-icon-close: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20' stroke='%23abb2bf' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E");
                    }

                    .jv-enhanced-code {
                        background-color: #282c34; border-radius: 8px; margin: 10px 0; overflow: hidden;
                        font-family: 'Fira Code', 'Consolas', monospace; font-size: 13px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 1px solid #3e4451;
                        display: flex; flex-direction: column; max-width: 100%;
                    }
                    .jv-code-header {
                        display: flex; justify-content: space-between; align-items: center;
                        background-color: #21252b; padding: 5px 10px 5px 15px;
                        border-bottom: 1px solid #181a1f; height: 32px;
                    }
                    .jv-lang-select {
                        background-color: #2c313a; color: #61afef; border: 1px solid #3e4451;
                        border-radius: 4px; padding: 2px 5px; font-size: 11px; font-weight: bold;
                        cursor: pointer; outline: none;
                        max-width: 150px;
                        text-overflow: ellipsis; white-space: nowrap; overflow: hidden;
                    }
                    .jv-code-actions { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }

                    .jv-icon-btn {
                        background: transparent; border: 1px solid transparent; color: #abb2bf;
                        cursor: pointer; padding: 4px; border-radius: 4px; display: flex;
                        align-items: center; justify-content: center; height: 26px; min-width: 26px;
                    }
                    .jv-icon-btn:hover { background-color: #3e4451; color: white; }

                    .jv-run-btn { border: 1px solid #3e4451; padding: 0 8px; gap: 5px; font-size: 11px; font-weight: bold; transition: all 0.2s;}
                    .jv-run-btn:hover { border-color: #98c379; color: #98c379; }

                    .jv-icon {
                        display: inline-block; width: 16px; height: 16px;
                        background-position: center; background-repeat: no-repeat; background-size: contain;
                        vertical-align: middle;
                    }
                    .jv-icon-play { background-image: var(--jv-icon-play); }
                    .jv-icon-stop { background-image: var(--jv-icon-stop); }
                    .jv-icon-loader { background-image: var(--jv-icon-loader); }
                    .jv-icon-copy { background-image: var(--jv-icon-copy); }
                    .jv-icon-check { background-image: var(--jv-icon-check); }
                    .jv-icon-close { background-image: var(--jv-icon-close); width: 20px; height: 20px;}

                    .jv-run-btn.is-running { border-color: #e06c75; color: #e06c75; }
                    .jv-run-btn.is-running:hover { background-color: rgba(224, 108, 117, 0.1); }

                    @keyframes jv-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    .jv-spin-anim { animation: jv-spin 1s linear infinite; }

                    .jv-code-body { display: flex; width: 100%; min-width: 0; }
                    .jv-line-numbers {
                        text-align: right; padding: 10px 10px 10px 15px; background-color: #282c34;
                        color: #495162; border-right: 1px solid #3e4451; user-select: none; flex-shrink: 0;
                    }
                    .jv-code-content {
                        padding: 10px 15px; background-color: #282c34; color: #abb2bf; line-height: 1.5;
                        tab-size: 4; flex-grow: 1; overflow-x: auto; min-width: 0;
                    }
                    .jv-code-content pre { margin: 0 !important; padding: 0 !important; border: none !important; background: none !important; }
                    .jv-code-content code.hljs {padding: 0 0 20px 0;  background: transparent; white-space: pre; overflow-x: visible; }
                    .jv-code-output {
                        background-color: #1e2127; border-top: 1px solid #3e4451; padding: 10px;
                        color: #e5c07b; font-family: 'Consolas', monospace; font-size: 12px;
                        white-space: pre-wrap; display: none; max-height: 300px; overflow-y: auto;
                    }
                    .jv-code-output.error { color: #e06c75; }
                    .jv-code-output.warning { color: #d19a66; }
                    .jv-code-output.loading { color: #abb2bf; font-style: italic; }
                    .jv-code-content::-webkit-scrollbar, .jv-code-output::-webkit-scrollbar { height: 8px; width: 8px; background-color: #282c34; }
                    .jv-code-content::-webkit-scrollbar-thumb, .jv-code-output::-webkit-scrollbar-thumb { background-color: #4b5363; border-radius: 4px; }

                    .jv-modal-overlay {
                        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                        background: rgba(0, 0, 0, 0.7);
                        z-index: 9999999;
                        display: flex; justify-content: center; align-items: center;
                        opacity: 0; visibility: hidden; transition: all 0.2s;
                    }
                    .jv-modal-overlay.active { opacity: 1; visibility: visible; }
                    .jv-modal {
                        background: #21252b; border: 1px solid #3e4451; border-radius: 8px;
                        width: 400px; max-width: 90%; max-height: 80vh; display: flex; flex-direction: column;
                        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                    }
                    .jv-modal-header { padding: 15px; border-bottom: 1px solid #3e4451; display: flex; justify-content: space-between; align-items: center; color: #abb2bf; font-weight: bold; }
                    .jv-modal-close { cursor: pointer; color: #abb2bf; background: none; border: none; font-size: 16px;}
                    .jv-modal-search { padding: 10px; border-bottom: 1px solid #3e4451; }
                    .jv-modal-search input { width: 100%; background: #282c34; border: 1px solid #3e4451; color: white; padding: 8px; border-radius: 4px; outline: none; }
                    .jv-modal-list { overflow-y: auto; flex-grow: 1; padding: 5px; }
                    .jv-modal-item { padding: 8px 10px; cursor: pointer; color: #abb2bf; border-radius: 4px; display: flex; justify-content: space-between; }
                    .jv-modal-item:hover { background-color: #3e4451; color: white; }
                    .jv-loader { text-align: center; padding: 20px; color: #61afef; }

                    @media (max-width: 600px) {
                        .jv-lang-select { max-width: 100px; font-size: 10px; }
                        .jv-code-header { padding: 5px; }
                        .jv-run-btn span:not(.jv-icon) { display: none; }
                        .jv-run-btn { padding: 0 5px; }
                    }
                `);
            } catch(e) { console.warn("[LecteurMedia] JVCode CSS Init Error", e); }
        }

        toggle(enable) {
            if (enable) {
                this.start();
            } else {
                this.destroy();
            }
        }

        start() {
            if (this.isEnabled) return;
            this.isEnabled = true;

            this.enhanceCodeBlocks();

            if (!this.observer) {
                this.observer = new MutationObserver((mutations) => {
                    if (!this.isEnabled) return;
                    
                    let shouldEnhanceGlobal = false;
                    let previewUpdateDetected = false;
                    for (const mutation of mutations) {
                        if (mutation.addedNodes.length > 0) {
                            const targetNode = mutation.target;
                            const isPreview = targetNode.closest && targetNode.closest('.messageEditor__containerPreview');
                            if (isPreview) {
                                previewUpdateDetected = true;
                            } else {
                                mutation.addedNodes.forEach(node => {
                                    if (node.nodeType === 1) {
                                        if (node.querySelector && node.querySelector('.code-jv, .pre-jv')) shouldEnhanceGlobal = true;
                                        if (node.matches && node.matches('.code-jv, .pre-jv')) shouldEnhanceGlobal = true;
                                    }
                                });
                            }
                        }
                    }
                    if (previewUpdateDetected) {
                        const previewContainer = document.querySelector('.messageEditor__containerPreview');
                        if (previewContainer) this.enhanceCodeBlocks(previewContainer);
                    } else if (shouldEnhanceGlobal) {
                        this.enhanceCodeBlocks(document.body);
                    }
                });
            }

            const targetNode = document.getElementById('page-messages-forum') || document.body;
            this.observer.observe(targetNode, { childList: true, subtree: true });
        }

        destroy() {
            this.isEnabled = false;
            if (this.observer) {
                this.observer.disconnect();
            }

            const enhancedBlocks = document.querySelectorAll('.jv-enhanced-code');
            enhancedBlocks.forEach(wrapper => {
                if (wrapper._originalElement) {
                    wrapper._originalElement.style.display = '';
                    wrapper._originalElement.removeAttribute('data-processed');
                }
                
                if (wrapper._triggerCodeElement) {
                    wrapper._triggerCodeElement.removeAttribute('data-processed');
                }

                wrapper.remove();
            });
        }

        async fetchAllRuntimes(callback) {
            if (this.cachedRuntimes && this.cachedRuntimes.length > 0) { callback(this.cachedRuntimes); return; }
            try {
                const response = await LecteurMedia.compatibleHttpRequest({
                    method: "GET",
                    url: "https://emkc.org/api/v2/piston/runtimes",
                });
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    this.cachedRuntimes = data.sort((a, b) => a.language.localeCompare(b.language));
                    callback(this.cachedRuntimes);
                } else { callback(this.fallbackRuntimes); }
            } catch(e) { callback(this.fallbackRuntimes); }
        }

        createModal() {
            if (document.querySelector('.jv-modal-overlay')) return;
            this.modalOverlay = document.createElement('div');
            this.modalOverlay.className = 'jv-modal-overlay';
            this.modalOverlay.innerHTML = `<div class="jv-modal"> <div class="jv-modal-header"><span>Sélectionner un langage</span><button class="jv-modal-close" type="button"><span class="jv-icon jv-icon-close"></span></button></div> <div class="jv-modal-search"><input type="text" placeholder="Rechercher..." id="jv-lang-search"></div> <div class="jv-modal-list" id="jv-lang-list"><div class="jv-loader">Chargement...</div></div> </div>`;
            document.body.appendChild(this.modalOverlay);

            const closeBtn = this.modalOverlay.querySelector('.jv-modal-close');
            const searchInput = this.modalOverlay.querySelector('#jv-lang-search');
            const close = () => {
                this.modalOverlay.classList.remove('active');
                if(this.currentSelectElement && this.currentSelectElement.value === 'LOAD_MORE') {
                    this.currentSelectElement.value = this.currentSelectElement.getAttribute('data-prev-val') || 'text';
                }
                this.currentSelectElement = null;
            };
            closeBtn.addEventListener('click', close);
            this.modalOverlay.addEventListener('click', (e) => { if (e.target === this.modalOverlay) close(); });
            searchInput.addEventListener('input', (e) => { this.renderModalList(e.target.value); });
        }

        renderModalList(filter = '') {
            const listContainer = document.getElementById('jv-lang-list');
            listContainer.innerHTML = '';
            const data = this.cachedRuntimes || this.fallbackRuntimes;
            const lowerFilter = filter.toLowerCase();
            let count = 0;
            data.forEach(rt => {
                if (rt.language.toLowerCase().includes(lowerFilter) || (rt.aliases && rt.aliases.some(a => a.toLowerCase().includes(lowerFilter)))) {
                    const item = document.createElement('div');
                    item.className = 'jv-modal-item';
                    item.innerHTML = `<span>${rt.language}</span><span class="jv-modal-item-ver">${rt.version}</span>`;
                    item.addEventListener('click', () => { this.selectLanguageFromModal(rt); });
                    listContainer.appendChild(item);
                    count++;
                }
            });
            if (count === 0) {
                const noRes = document.createElement('div');
                noRes.style.padding = "10px"; noRes.style.color = "#aaa"; noRes.textContent = "Aucun résultat.";
                listContainer.appendChild(noRes);
            }
        }

        openLangModal(targetSelect) {
            if (!this.modalOverlay) this.createModal();
            this.currentSelectElement = targetSelect;
            this.modalOverlay.classList.add('active');
            document.getElementById('jv-lang-search').value = '';
            document.getElementById('jv-lang-search').focus();
            if (!this.cachedRuntimes) { this.fetchAllRuntimes(() => this.renderModalList()); } else { this.renderModalList(); }
        }

        selectLanguageFromModal(runtime) {
            if (!this.currentSelectElement) return;
            let exists = false;
            for (let i = 0; i < this.currentSelectElement.options.length; i++) {
                if (this.currentSelectElement.options[i].value === runtime.language) { exists = true; break; }
            }
            if (!exists) {
                const option = document.createElement('option');
                option.value = runtime.language;
                option.textContent = runtime.language.charAt(0).toUpperCase() + runtime.language.slice(1);
                option.setAttribute('data-hljs', runtime.language);
                this.currentSelectElement.add(option, this.currentSelectElement.options.length - 1);
            }
            this.currentSelectElement.value = runtime.language;
            this.currentSelectElement.dispatchEvent(new Event('change'));
            this.modalOverlay.classList.remove('active');
            this.currentSelectElement = null;
        }

        resetRunButton(btn) {
            if (!btn) return;
            const icon = btn.querySelector('.jv-icon');
            const text = btn.querySelector('span:not(.jv-icon)');
            icon.className = 'jv-icon jv-icon-play';
            icon.classList.remove('jv-spin-anim');
            text.textContent = 'Run';
            btn.classList.remove('is-running');
            btn.removeAttribute('data-running');
        }

        runCode(code, pistonLang, outputElement, runBtn) {
            if (!pistonLang || pistonLang === 'null') {
                outputElement.style.display = 'block'; outputElement.textContent = "Langage non exécutable.";
                outputElement.className = 'jv-code-output error'; return null;
            }

            outputElement.style.display = 'block';
            outputElement.textContent = "Exécution en cours...";
            outputElement.className = 'jv-code-output loading';

            const icon = runBtn.querySelector('.jv-icon');
            const text = runBtn.querySelector('span:not(.jv-icon)');
            icon.className = 'jv-icon jv-icon-loader jv-spin-anim';
            text.textContent = 'Stop';
            runBtn.classList.add('is-running');
            runBtn.setAttribute('data-running', 'true');

            const slowResponseTimer = setTimeout(() => {
                if (runBtn.getAttribute('data-running') === 'true') {
                    outputElement.className = 'jv-code-output warning';
                    outputElement.innerHTML = "⏳ <b>Attente prolongée...</b><br>L'API Piston met du temps à répondre...";
                }
            }, 3000);

            const xhrFn = (typeof GM !== 'undefined' && GM.xmlHttpRequest) ? GM.xmlHttpRequest : (typeof GM_xmlhttpRequest !== 'undefined' ? GM_xmlhttpRequest : null);

            if (!xhrFn) {
                 clearTimeout(slowResponseTimer);
                 this.resetRunButton(runBtn);
                 outputElement.className = 'jv-code-output error'; 
                 outputElement.textContent = "Erreur: GM_xmlhttpRequest non disponible.";
                 return null;
            }

            return xhrFn({
                method: "POST",
                url: "https://emkc.org/api/v2/piston/execute",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ language: pistonLang, version: "*", files: [{ content: code }] }),
                onload: (response) => {
                    clearTimeout(slowResponseTimer);
                    if (runBtn.getAttribute('data-running') !== 'true') return;
                    this.resetRunButton(runBtn);
                    if (response.status !== 200) {
                        outputElement.className = 'jv-code-output error';
                        outputElement.textContent = `Erreur API HTTP ${response.status}.`;
                        return;
                    }
                    try {
                        const res = JSON.parse(response.responseText);
                        let output = (res.run ? (res.run.stdout + res.run.stderr) : (res.message ? `Error: ${res.message}` : "Erreur inconnue"));
                        if (!output.trim()) output = "<Aucune sortie>";
                        outputElement.className = res.run && res.run.stderr ? 'jv-code-output error' : 'jv-code-output';
                        outputElement.textContent = output;
                    } catch (e) {
                        outputElement.className = 'jv-code-output error'; outputElement.textContent = "Erreur parsing API.";
                    }
                },
                    onerror: () => {
                        clearTimeout(slowResponseTimer);
                        if (runBtn.getAttribute('data-running') !== 'true') return;
                        this.resetRunButton(runBtn);
                        outputElement.className = 'jv-code-output error'; outputElement.textContent = "Erreur réseau.";
                    },
                    onabort: () => {
                        clearTimeout(slowResponseTimer);
                        this.resetRunButton(runBtn);
                    },
                    ontimeout: () => {
                        clearTimeout(slowResponseTimer);
                        if (runBtn.getAttribute('data-running') !== 'true') return;
                        this.resetRunButton(runBtn);
                        outputElement.className = 'jv-code-output error'; outputElement.textContent = "Délai dépassé.";
                    }
                });

        }

        enhanceCodeBlocks(container = document) {
            if (typeof hljs === 'undefined') return;

            const selectors = 'code.code-jv:not([data-processed="true"]), code.message__code:not([data-processed="true"])';
            const codeElements = container.querySelectorAll(selectors);

            codeElements.forEach(codeElement => {
                codeElement.setAttribute('data-processed', 'true');
                let targetToReplace = codeElement;
                const parent = codeElement.parentElement;
                if (parent && parent.tagName === 'PRE' && (parent.classList.contains('pre-jv') || parent.classList.contains('message__pre'))) {
                    targetToReplace = parent;
                    parent.setAttribute('data-processed', 'true');
                }

                let rawCode = codeElement.textContent.replace(/^\s*\n/g, '').replace(/\n\s*$/g, '');
                const isPreview = codeElement.closest('.messageEditor__containerPreview');
                let detectedHljsLang = null;
                let forcedPistonLang = null;

                if (isPreview) {
                    const allRawCodesInPreview = Array.from(document.querySelectorAll('.messageEditor__containerPreview code.message__code, .messageEditor__containerPreview .code-jv'));
                    const previewIndex = allRawCodesInPreview.indexOf(codeElement);
                    if (previewIndex !== -1 && this.previewState[previewIndex]) {
                        forcedPistonLang = this.previewState[previewIndex].piston;
                        detectedHljsLang = this.previewState[previewIndex].hljs;
                    }
                }

                if (!detectedHljsLang) {
                    const highlightResult = hljs.highlightAuto(rawCode);
                    detectedHljsLang = highlightResult.language || 'text';
                }

                let safeHighlightedCode;
                try { safeHighlightedCode = hljs.highlight(rawCode, { language: detectedHljsLang }).value; }
                catch (e) { safeHighlightedCode = hljs.highlightAuto(rawCode).value; }

                const lineCount = rawCode.split(/\r\n|\r|\n/).length;
                let lineNumbersHtml = '';
                for (let i = 1; i <= lineCount; i++) { lineNumbersHtml += `${i}\n`; }

                let optionsHtml = '';
                let isDetectedLangInList = false;
                this.initialLangs.forEach(lang => {
                    let isSelected = false;
                    if (forcedPistonLang) { 
                        if (lang.piston === forcedPistonLang) {
                            isSelected = true; 
                            isDetectedLangInList = true;
                        }
                    }
                    else if (!forcedPistonLang && lang.hljs === detectedHljsLang) { 
                        isSelected = true; 
                        isDetectedLangInList = true;
                    }
                    optionsHtml += `<option value="${lang.piston || ''}" data-hljs="${lang.hljs}" ${isSelected ? 'selected' : ''}>${lang.name}</option>`;
                });
                
                if (!isDetectedLangInList && !forcedPistonLang && detectedHljsLang && detectedHljsLang !== 'text') {
                    const displayName = detectedHljsLang.charAt(0).toUpperCase() + detectedHljsLang.slice(1);
                    optionsHtml += `<option value="null" data-hljs="${detectedHljsLang}" selected>${displayName}</option>`;
                }

                if (forcedPistonLang && !this.initialLangs.some(l => l.piston === forcedPistonLang)) {
                    optionsHtml += `<option value="${forcedPistonLang}" data-hljs="${detectedHljsLang}" selected>${forcedPistonLang}</option>`;
                }

                optionsHtml += `<option value="LOAD_MORE" style="font-weight:bold; color:#61afef;">➕ Charger plus...</option>`;

                const wrapper = document.createElement('div');
                wrapper.className = 'jv-enhanced-code';
                
                wrapper._originalElement = targetToReplace;
                wrapper._triggerCodeElement = codeElement; 

                wrapper.innerHTML = `
                    <div class="jv-code-header">
                        <select class="jv-lang-select" title="Changer le langage">${optionsHtml}</select>
                        <div class="jv-code-actions">
                            <button type="button" class="jv-icon-btn jv-run-btn" title="Exécuter (Piston API)"><span class="jv-icon jv-icon-play"></span> <span>Run</span></button>
                            <button type="button" class="jv-icon-btn jv-copy-btn" title="Copier le code"><span class="jv-icon jv-icon-copy"></span></button>
                        </div>
                    </div>
                    <div class="jv-code-body">
                        <div class="jv-line-numbers"><pre>${lineNumbersHtml}</pre></div>
                        <div class="jv-code-content"><pre><code class="hljs ${detectedHljsLang}">${safeHighlightedCode}</code></pre></div>
                    </div>
                    <div class="jv-code-output"></div>
                `;

                const selectInfo = wrapper.querySelector('.jv-lang-select');
                const codeContentBlock = wrapper.querySelector('.jv-code-content code');
                const lineNumbersBlock = wrapper.querySelector('.jv-line-numbers pre');
                selectInfo.setAttribute('data-prev-val', selectInfo.value);

                selectInfo.addEventListener('change', (e) => {
                    const val = e.target.value;
                    if (val === 'LOAD_MORE') { this.openLangModal(selectInfo); return; }
                    selectInfo.setAttribute('data-prev-val', val);
                    const selectedOption = e.target.options[e.target.selectedIndex];
                    const newHljsClass = selectedOption.getAttribute('data-hljs') || val;

                    if (isPreview) {
                        const allRawCodesInPreview = Array.from(document.querySelectorAll('.messageEditor__containerPreview code.message__code, .messageEditor__containerPreview .code-jv'));
                        const currentIndex = allRawCodesInPreview.indexOf(codeElement);
                        if (currentIndex !== -1) this.previewState[currentIndex] = { piston: val, hljs: newHljsClass };
                    }
                    codeContentBlock.className = `hljs ${newHljsClass}`;
                    try { codeContentBlock.innerHTML = hljs.highlight(rawCode, { language: newHljsClass }).value; }
                    catch(e) { codeContentBlock.innerHTML = hljs.highlightAuto(rawCode).value; }
                });

                const copyBtn = wrapper.querySelector('.jv-copy-btn');
                const copyIcon = copyBtn.querySelector('.jv-icon');
                copyBtn.addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    if(typeof GM_setClipboard !== 'undefined') {
                         GM_setClipboard(rawCode);
                         copyIcon.className = 'jv-icon jv-icon-check';
                         copyBtn.style.color = "#98c379";
                         setTimeout(() => { copyIcon.className = 'jv-icon jv-icon-copy'; copyBtn.style.color = ""; }, 2000);
                    } else {
                        navigator.clipboard.writeText(rawCode).then(() => {
                            copyIcon.className = 'jv-icon jv-icon-check';
                            copyBtn.style.color = "#98c379";
                            setTimeout(() => { copyIcon.className = 'jv-icon jv-icon-copy'; copyBtn.style.color = ""; }, 2000);
                        });
                    }
                });

                const runBtn = wrapper.querySelector('.jv-run-btn');
                const outputDiv = wrapper.querySelector('.jv-code-output');
                runBtn.addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    if (runBtn.getAttribute('data-running') === 'true') {
                        if (runBtn._currentRequest && typeof runBtn._currentRequest.abort === 'function') runBtn._currentRequest.abort();
                        this.resetRunButton(runBtn);
                        outputDiv.className = 'jv-code-output warning'; outputDiv.textContent = "Arrêt forcé.";
                        return;
                    }
                    runBtn._currentRequest = this.runCode(rawCode, selectInfo.value, outputDiv, runBtn);
                });

                if (targetToReplace.parentNode) {
                    const removalObserver = new MutationObserver((mutations) => {
                        for (const mutation of mutations) {
                            if (mutation.removedNodes) {
                                mutation.removedNodes.forEach((removedNode) => {
                                    if (removedNode === targetToReplace) { wrapper.remove(); removalObserver.disconnect(); }
                                });
                            }
                        }
                    });
                    removalObserver.observe(targetToReplace.parentNode, { childList: true });
                }

                if (isPreview) {
                    const observerConfig = { characterData: true, childList: true, subtree: true };
                    const liveObserver = new MutationObserver((mutations) => {
                        if (!document.body.contains(wrapper)) { liveObserver.disconnect(); return; }
                        const newText = codeElement.textContent.replace(/^\s*\n/g, '').replace(/\n\s*$/g, '');
                        if (newText === rawCode) return;
                        rawCode = newText;
                        const newLineCount = rawCode.split(/\r\n|\r|\n/).length;
                        let newLineHtml = '';
                        for (let i = 1; i <= newLineCount; i++) newLineHtml += `${i}\n`;
                        lineNumbersBlock.textContent = newLineHtml;
                        const currentHljsClass = selectInfo.options[selectInfo.selectedIndex]?.getAttribute('data-hljs') || 'text';
                        let newHighlightedHtml;
                        try { newHighlightedHtml = hljs.highlight(rawCode, { language: currentHljsClass }).value; }
                        catch (e) { newHighlightedHtml = hljs.highlightAuto(rawCode).value; }
                        codeContentBlock.innerHTML = newHighlightedHtml;
                    });
                    liveObserver.observe(codeElement, observerConfig);
                }

                targetToReplace.style.display = 'none';
                targetToReplace.parentNode.insertBefore(wrapper, targetToReplace);
            });
        }
    }

    // =========================================================================
    // == HELPERS POUR LE LECTEUR TWITTER PERSONNALISÉ
    // =========================================================================

    function setupStatCarousel(statsGroupNode) {
        setTimeout(() => {
            const isOverflowing = statsGroupNode.scrollWidth > statsGroupNode.clientWidth;

            if (!isOverflowing) {
                return;
            }

            statsGroupNode.classList.add('is-rotating');
            const stats = statsGroupNode.querySelectorAll('.vxtwitter-stat');
            if (stats.length <= 1) return;

            let currentIndex = 0;
            const animationInterval = 3000;

            stats[currentIndex].classList.add('is-active');

            setInterval(() => {
                stats[currentIndex].classList.remove('is-active');
                currentIndex = (currentIndex + 1) % stats.length;
                stats[currentIndex].classList.add('is-active');
            }, animationInterval);

        }, 100);
    }

    /**
     * Gère le rendu des embeds Twitter personnalisés.
     */
    const VxTwitterRenderer = {
        TWEET_TRUNCATE_LENGTH: 350,

        _formatNumber(num) {
            if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
            return num;
        },

        _formatDate(epoch) {
            const date = new Date(epoch * 1000);
            return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) + ' à ' +
                   date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        },

        render(tweet, isQuoted = false) {
            if (!tweet || !tweet.user_screen_name) return '';
            const isLongTweet = tweet.text.length > this.TWEET_TRUNCATE_LENGTH && !isQuoted;

            let safeText = escapeHTML(tweet.text);
            safeText = safeText.replace(/(https?:\/\/[^\s]+)/g, (url) => {
                return `<a href="${sanitizeUrl(url)}" target="_blank" rel="noopener noreferrer">${url}</a>`;
            });
            const formattedText = safeText.replace(/\n/g, '<br>');

            let pollHtml = '';
            if (tweet.pollData && tweet.pollData.options && tweet.pollData.options.length > 0) {
                const totalVotes = tweet.pollData.options.reduce((sum, option) => sum + option.votes, 0);
                const maxPercent = Math.max(...tweet.pollData.options.map(o => o.percent));
                pollHtml = `
                    <div class="vxtwitter-poll">
                        ${tweet.pollData.options.map(option => `
                            <div class="vxtwitter-poll-option ${option.percent === maxPercent ? 'winner' : ''}">
                                <div class="vxtwitter-poll-bar" style="width: ${option.percent}%;"></div>
                                <div class="vxtwitter-poll-text">
                                    <span class="vxtwitter-poll-option-name">${escapeHTML(option.name)}</span>
                                    <span class="vxtwitter-poll-option-percent">${option.percent.toFixed(1).replace('.', ',')}%</span>
                                </div>
                            </div>
                        `).join('')}
                        <div class="vxtwitter-poll-footer">
                            <span>${totalVotes.toLocaleString('fr-FR')} votes</span>
                        </div>
                    </div>
                `;
            }

         let communityNoteHtml = '';
            if (tweet.communityNote) {
                let safeNote = escapeHTML(tweet.communityNote);

                const formattedNote = safeNote
                    .replace(/x\.com\//g, 'https://x.com/')
                    .replace(/\n/g, '<br>')
                    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

                communityNoteHtml = `
                    <div class="vxtwitter-community-note">
                        <div class="cn-header">
                            <span class="cn-icon"></span>
                            <span class="cn-title">Les lecteurs ont ajouté du contexte</span>
                        </div>
                        <div class="cn-body">
                            <div class="cn-text">${formattedNote}</div>
                        </div>
                    </div>
                `;
            }

            let mediaHtml = '';
            if (tweet.media_extended && tweet.media_extended.length > 0) {
                mediaHtml = `<div class="vxtwitter-media-grid" data-count="${tweet.media_extended.length}">`;
                tweet.media_extended.forEach(media => {
                    mediaHtml += `<div class="vxtwitter-media-item">`;
                    if (media.type === 'video') {
                        mediaHtml += `
                        <div class="vxtwitter-video-wrapper" style="position:relative; width:100%; border-radius:12px; overflow:hidden; background:#000;">
                            <video 
                                class="vxtwitter-video" 
                                src="${sanitizeUrl(media.url)}" 
                                poster="${sanitizeUrl(media.thumbnail_url)}" 
                                controls loop playsinline 
                                referrerpolicy="no-referrer" 
                                style="width:100%; height:auto; display:block;">
                            </video>

                            <!-- Loader caché par défaut, ne s'affiche qu'en cas d'erreur de lecture -->
                            <div class="video-loader-fallback" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); flex-direction:column; justify-content:center; align-items:center; z-index:2;">
                                <div class="lm-spinner"></div>
                                <div style="color:white; font-size:12px; margin-top:10px; font-weight:bold; text-align:center;">
                                    Problème de lecture détecté.<br>
                                    Récupération via le script... <span class="dl-progress">0%</span>
                                </div>
                            </div>
                        </div>`;
                    } else if (media.type === 'image') {
                        mediaHtml += `<a href="${sanitizeUrl(media.url)}" target="_blank" rel="noopener noreferrer"><img src="${sanitizeUrl(media.url)}" alt="Média intégré" loading="lazy"></a>`;
                    }
                    mediaHtml += `</div>`;
                });
                mediaHtml += `</div>`;
            }

            let qrtHtml = '';
            if (tweet.qrt) {
                qrtHtml = `<div class="vxtwitter-quoted-tweet">${this.render(tweet.qrt, true)}</div>`;
            }

            return `
                <div class="vxtwitter-header">
                    <img class="vxtwitter-avatar" src="${sanitizeUrl(tweet.user_profile_image_url)}" alt="Avatar de ${escapeHTML(tweet.user_name)}">
                    <div class="vxtwitter-author-info">
                        <div class="vxtwitter-author">
                            <span class="vxtwitter-author-name">${escapeHTML(tweet.user_name)}</span>
                            <span class="vxtwitter-author-handle">@${escapeHTML(tweet.user_screen_name)}</span>
                        </div>
                        ${!isQuoted ? `<div class="vxtwitter-header-date">${this._formatDate(tweet.date_epoch)}</div>` : ''}
                    </div>
                </div>
                ${tweet.replyingTo ? `<div class="vxtwitter-replying-to">En réponse à @${tweet.replyingTo}</div>` : ''}
                <div class="vxtwitter-text ${isLongTweet ? 'vxtwitter-text-collapsible' : ''}">${formattedText}</div>
                ${isLongTweet ? '<a href="#" class="vxtwitter-show-more">Afficher plus</a>' : ''}
                ${pollHtml}
                ${mediaHtml}
                ${qrtHtml}
                ${communityNoteHtml}
                ${!isQuoted ? `
                <div class="vxtwitter-footer">
                  <div class="vxtwitter-stats-group">

                      <span class="vxtwitter-stat">
                          <span class="vxtwitter-icon vx-icon-retweet"></span>
                          <span class="vxtwitter-stat-value">${this._formatNumber(tweet.retweets)}</span>
                      </span>
                      <span class="vxtwitter-stat">
                          <span class="vxtwitter-icon vx-icon-like"></span>
                          <span class="vxtwitter-stat-value">${this._formatNumber(tweet.likes)}</span>
                      </span>
                  </div>
                  <a href="#" class="vxtwitter-nitter-link">
                      Voir réponses (${this._formatNumber(tweet.replies)})
                  </a>
              </div>
                ` : ''}
            `;
        }
    };

    /**
     * Gère le rendu des embeds Instagram personnalisés.
     */
    const InstagramRenderer = {
        icons: {
            verified: `<svg class="insta-verified" width="14" height="14" viewBox="0 0 40 40" fill="rgb(0, 149, 246)"><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fill-rule="evenodd"></path></svg>`,
            genericAvatar: `<div class="insta-avatar-generic">📷</div>`,
            likes: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right:4px;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
        },

        renderPost(d) {
            const avatarBlock = d.avatar ? `<img src="${sanitizeUrl(d.avatar)}" class="insta-avatar-img" alt="${escapeHTML(d.username)}">` : this.icons.genericAvatar;
            const verifiedBlock = d.isVerified ? this.icons.verified : '';
            
            let slidesHtml = '';
            const medias = (d.mediaList && d.mediaList.length > 0) ? d.mediaList : [{ html: d.mediaHtml }];

            medias.forEach((media, index) => {
                const isActive = index === 0 ? 'active' : '';
                let content = '';

                const hideSkeletonJS = "this.classList.add('loaded'); this.parentElement.querySelector('.insta-skeleton-overlay').style.display='none';";

                if (media.html) {
                    content = safeHTML(media.html);
                } 
                else if (media.type === 'video') {
                    content = `
                    <div class="insta-media-wrapper">
                        <div class="insta-skeleton-overlay"></div>
                        <video 
                            src="${sanitizeUrl(media.src)}" 
                            class="video-embed insta-media-element" 
                            controls 
                            preload="metadata" 
                            loop 
                            playsinline 
                            poster="${sanitizeUrl(media.poster || '')}" 
                            onloadeddata="${hideSkeletonJS}"
                            onerror="this.parentElement.querySelector('.insta-skeleton-overlay').style.display='none'; this.classList.add('loaded');"
                        ></video>
                    </div>`;
                } 
                else {
                    content = `
                    <div class="insta-media-wrapper">
                        <div class="insta-skeleton-overlay"></div>
                        <img 
                            src="${sanitizeUrl(media.src)}" 
                            class="image-embed insta-media-element" 
                            onload="${hideSkeletonJS}"
                            onerror="this.parentElement.querySelector('.insta-skeleton-overlay').style.display='none'; this.classList.add('loaded');"
                        >
                    </div>`;
                }
                
                slidesHtml += `<div class="insta-slide ${isActive}" data-index="${index}">${content}</div>`;
            });

            const showNav = medias.length > 1;
            const navHtml = showNav ? `
                <button class="insta-nav-btn insta-nav-prev hidden">&#10094;</button>
                <button class="insta-nav-btn insta-nav-next">&#10095;</button>
                <div class="insta-counter">1 / ${medias.length}</div>
            ` : '';

            let captionHtml = '';
            if (d.caption && typeof d.caption === 'string') {
                const cleanCaption = d.caption.trim();
                if (cleanCaption.length > 0) {
                    const safeCaption = escapeHTML(cleanCaption);
                    const formattedCaption = safeCaption.replace(/\n/g, '<br>');
                    const isLong = cleanCaption.length > 120 || (cleanCaption.match(/\n/g) || []).length > 2;
                    captionHtml = `
                        <div class="insta-caption ${isLong ? 'collapsible' : ''}"><strong>${escapeHTML(d.username)}</strong>&nbsp;${formattedCaption}</div>
                        ${isLong ? `<span class="insta-show-more">Afficher plus</span>` : ''}
                    `;
                }
            }

            return `
                <div class="insta-profile-card">
                    <div class="insta-header">
                        <a href="https://www.instagram.com/${escapeHTML(d.username)}/" target="_blank">${avatarBlock}</a>
                        <div class="insta-details">
                            <div class="insta-name-row">
                                <a href="https://www.instagram.com/${escapeHTML(d.username)}/" target="_blank" class="insta-fullname">${escapeHTML(d.fullname)}</a>
                                ${verifiedBlock}
                            </div>
                            <a href="https://www.instagram.com/${escapeHTML(d.username)}/" target="_blank" class="insta-username">@${escapeHTML(d.username)}</a>
                        </div>
                    </div>
                    
                    <div class="insta-carousel-container" data-total="${medias.length}">
                        ${slidesHtml}
                        ${navHtml}
                    </div>

                    <div class="insta-meta">
                        ${d.likes ? `<div class="insta-likes-row">${this.icons.likes} <span>${d.likes}</span></div>` : ''}
                        ${captionHtml}
                    </div>
                    <a href="${sanitizeUrl(d.link)}" target="_blank" class="insta-footer">Voir sur Instagram</a>
                </div>
            `;
        },

        renderProfile(d) {
            const avatarBlock = d.avatar ? `<img src="${d.avatar}" class="insta-avatar-img" alt="${escapeHTML(d.username)}">` : this.icons.genericAvatar;
            const verifiedBlock = d.isVerified ? this.icons.verified : '';
            const userLink = `https://www.instagram.com/${escapeHTML(d.username)}/`;
            let gridHtml = '';
            if (d.mediaList && d.mediaList.length > 0) {
                gridHtml = '<div class="insta-preview-grid">';
                d.mediaList.slice(0, 3).forEach(item => {
                    gridHtml += `<a href="${item.link}" target="_blank" class="insta-preview-item" style="background-image: url('${item.src}');"></a>`;
                });
                gridHtml += '</div>';
            } else {
                gridHtml = `<div class="insta-private-msg">Aucune publication récente disponible.</div>`;
            }
            return `
                <div class="insta-profile-card">
                    <div class="insta-header">
                        <a href="${userLink}" target="_blank">${avatarBlock}</a>
                        <div class="insta-details">
                            <div class="insta-name-row">
                                <a href="${userLink}" target="_blank" class="insta-fullname">${escapeHTML(d.fullname)}</a>
                                ${verifiedBlock}
                            </div>
                            <a href="${userLink}" target="_blank" class="insta-username">@${escapeHTML(d.username)}</a>
                        </div>
                    </div>
                    ${gridHtml}
                    <a href="${userLink}" target="_blank" class="insta-footer">Voir le profil sur Instagram</a>
                </div>
            `;
        }
    };

    const TopicUtils = {
        getCurrentInfo() {
            const match = window.location.pathname.match(/forums\/(?:\d+-){2}(\d+)-/);
            
            if (!match || !match[1]) return null;

            let title = document.title;
            title = title.replace(/ - jeuxvideo\.com.*/, '').replace(/ - JVArchive.*/, '').trim();

            return {
                id: match[1],
                title: title,
                url: window.location.href
            };
        }
    };

    // =========================================================================
    // == FOURNISSEURS DE SERVICES
    // =========================================================================

    /**
     * Structure d'un objet Provider pour le Lecteur Media.
     * @typedef {Object} LecteurMediaProvider
     * @property {string} name - Le nom unique du provider.
     * @property {string} selector - Le sélecteur CSS pour les liens.
     * @property {'base'|'connect'|'wildcard'} category - La catégorie de permissions requises.
     * @property {string|string[]} [connect] - Le(s) domaine(s) requis pour @connect si category est 'connect'.
     * @property {function(HTMLAnchorElement, boolean): (HTMLElement|Promise<HTMLElement>|null)} createEmbedElement - Crée l'élément à intégrer.
     * @property {function(HTMLElement): void} [postProcess] - (Optionnel) Fonction post-intégration.
     */
    const allProviders  = [
        {
            name: 'Instagram',
            selector: 'a[href*="instagram.com/"]',
            category: 'connect',
            connect: ['instagram.com', 'vxinstagram.com', 'ddinstagram.com', 'wsrv.nl', 'api.cobalt.tools', 'cobalt.tools'],

            createEmbedElement(link) {
                const container = createSafeDiv();
                container.className = 'bloc-embed';
                
                container.innerHTML = `
                <div class="insta-profile-card skeleton-card" style="border:none; pointer-events:none; max-width:500px; width:100%;">
                    <div class="insta-header" style="border:none;">
                        <div class="skeleton-image" style="width:40px; height:40px; border-radius:50%; background-color:#333;"></div>
                        <div style="flex:1; margin-left:10px; display:flex; flex-direction:column; gap:6px;">
                            <div class="skeleton-line" style="width:100px; height:12px; background-color:#333; border-radius:4px;"></div>
                            <div class="skeleton-line" style="width:60px; height:10px; background-color:#333; border-radius:4px;"></div>
                        </div>
                    </div>
                    
                    <!-- Zone Média Squelette (Le carré qui brille) -->
                    <div class="insta-media-wrapper" style="height:350px; position:relative; overflow:hidden; background-color:#1c1c1c;">
                        <div class="insta-skeleton-overlay"></div>
                    </div>

                    <div style="padding:12px; display:flex; flex-direction:column; gap:8px;">
                        <div class="skeleton-line" style="width:40px; height:10px; background-color:#333; border-radius:4px;"></div>
                        <div class="skeleton-line" style="width:80%; height:10px; background-color:#333; border-radius:4px;"></div>
                        <div class="skeleton-line" style="width:60%; height:10px; background-color:#333; border-radius:4px;"></div>
                    </div>
                </div>`;

                const proxify = (url) => url ? `https://wsrv.nl/?url=${encodeURIComponent(url.replace(/\\u0026/g, '&'))}&w=400&output=jpg` : null;
                const decodeHTML = (html) => { const txt = document.createElement("textarea"); txt.innerHTML = html; return txt.value; };

                (async () => {
                    const getTarget = () => container.querySelector('.media-content > div') || container;

                    try {
                        const url = new URL(link.href);
                        const pathParts = url.pathname.replace(/\/$/, '').split('/').filter(p => p);

                        const isMedia = pathParts.some(p => ['p', 'reel', 'reels', 'tv', 'stories', 'share'].includes(p));
                        const isStory = pathParts.includes('stories');

                        const shortcode = pathParts[pathParts.length - 1];

                        // CAS 1 : MÉDIA (POST, REEL, STORY)
                        if (isMedia) {
                            const d = {
                                username: "Instagram", fullname: "Instagram User", avatar: null,
                                likes: "", caption: "", mediaList: [], isVerified: false, link: link.href
                            };

                            let customSuccess = false;
 
                            try {
                                const vxUrl = `https://d.vxinstagram.com${url.pathname}`;   

                                const response = await LecteurMedia.compatibleHttpRequest({
                                    method: 'GET', url: vxUrl,
                                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)' }
                                });

                                const isValidResponse = response.status === 200 && 
                                                        !response.responseText.includes('An error occurred') &&
                                                        !response.responseText.includes('Development Mode');

                                if (isValidResponse) {
                                    const html = response.responseText;
                                    const doc = new DOMParser().parseFromString(html, "text/html");

                                    const ogTitle = doc.querySelector('meta[property="og:title"]')?.content;
                                    if(ogTitle) {
                                        const userMatch = ogTitle.match(/^(.*?) \(@(.*?)\)/);
                                        if(userMatch) { d.fullname = decodeHTML(userMatch[1]); d.username = userMatch[2]; }
                                    }
                                    
                                    const allSiteNames = doc.querySelectorAll('meta[property="og:site_name"]');
                                    for (const meta of allSiteNames) {
                                        if (meta.content && meta.content.includes('vxInstagram')) {
                                            const numbers = meta.content.match(/(\d+)/g);
                                            if(numbers && numbers.length > 0) d.likes = parseInt(numbers[0], 10).toLocaleString('fr-FR') + " J'aime";
                                            break;
                                        }
                                    }

                                    let desc = doc.querySelector('meta[property="og:description"]')?.content;
                                    if (desc) d.caption = decodeHTML(desc);

                                    const cards = doc.querySelectorAll('.card-body');
                                    
                                    if (cards.length > 0) {
                                        cards.forEach(card => {
                                            const videoTag = card.querySelector('video');
                                            const imgTag = card.querySelector('img');
                                            const sourceTag = videoTag ? videoTag.querySelector('source') : null;

                                            const downloadBtn = Array.from(card.querySelectorAll('button')).find(b => b.textContent.includes('Download'));
                                            const downloadUrl = downloadBtn ? downloadBtn.getAttribute('onclick')?.match(/href='(.*?)'/)?.[1] : null;

                                            let item = null;

                                            const videoSrc = (videoTag ? videoTag.getAttribute('src') : null) || 
                                                             (sourceTag ? sourceTag.getAttribute('src') : null);

                                            if (videoSrc) {
                                                item = { type: 'video', src: videoSrc, poster: videoTag?.poster || (imgTag ? imgTag.src : null) };
                                            } 
                                            else if (downloadUrl && (downloadUrl.includes('.mp4') || downloadUrl.includes('/v/'))) {
                                                item = { type: 'video', src: downloadUrl, poster: imgTag ? imgTag.src : null };
                                            } 
                                            else if (imgTag && imgTag.src) {
                                                item = { type: 'image', src: imgTag.src };
                                            }

                                            if (item && item.src && item.src.trim() !== "") {
                                                d.mediaList.push(item);
                                            }
                                        });
                                    } 
                                    
                                    d.mediaList = d.mediaList.filter(m => m.src && m.src !== "");

                                    // FALLBACK (Post unique / Reel unique)
                                    if (d.mediaList.length === 0) {
                                        const videoSrc = doc.querySelector('meta[property="og:video"]')?.content ||
                                                         doc.querySelector('meta[property="og:video:secure_url"]')?.content;
                                        const imageSrc = doc.querySelector('meta[property="og:image"]')?.content;
                                        const poster = imageSrc ? proxify(imageSrc) : null;

                                        if (videoSrc) {
                                            d.mediaList.push({ type: 'video', src: videoSrc.replace(/&amp;/g, '&'), poster: poster });
                                        } else if (imageSrc) {
                                            d.mediaList.push({ type: 'image', src: poster });
                                        }
                                    }
                                    if (d.mediaList.length > 0) {
                                        customSuccess = true;
                                    }
                                }
                            } catch(e) { console.warn("[Insta] VX Exception:", e); }

                            // INJECTION DU HTML
                            const target = getTarget();
                            if (customSuccess && d.mediaList.length > 0) {
                                target.innerHTML = InstagramRenderer.renderPost(d);

                                const mediaElements = target.querySelectorAll('.insta-media-element');
                                mediaElements.forEach(el => {
                                    const wrapper = el.closest('.insta-media-wrapper');
                                    const overlay = wrapper ? wrapper.querySelector('.insta-skeleton-overlay') : null;

                                    const onMediaLoaded = () => {
                                        el.classList.add('loaded');
                                        if (overlay) overlay.style.display = 'none';
                                    };

                                    if (el.tagName === 'VIDEO') {
                                        if (el.readyState >= 1) {
                                            onMediaLoaded();
                                        } else {
                                            el.addEventListener('loadeddata', onMediaLoaded);
                                            el.addEventListener('canplay', onMediaLoaded);
                                            el.addEventListener('error', () => { if(overlay) overlay.style.display='none'; el.classList.add('loaded'); });
                                        }
                                    } else if (el.tagName === 'IMG') {
                                        if (el.complete) {
                                            onMediaLoaded();
                                        } else {
                                            el.addEventListener('load', onMediaLoaded);
                                            el.addEventListener('error', () => { if(overlay) overlay.style.display='none'; el.classList.add('loaded'); });
                                        }
                                    }
                                });

                                const showMoreBtn = target.querySelector('.insta-show-more');
                                if(showMoreBtn) {
                                    showMoreBtn.addEventListener('click', (e) => {
                                        e.preventDefault(); e.stopPropagation();
                                        const captionDiv = target.querySelector('.insta-caption');
                                        if(captionDiv) captionDiv.classList.add('expanded');
                                        showMoreBtn.style.display = 'none';
                                    });
                                }

                                // Carousel
                                if (d.mediaList.length > 1) {
                                    const carousel = target.querySelector('.insta-carousel-container');
                                    const prevBtn = carousel.querySelector('.insta-nav-prev');
                                    const nextBtn = carousel.querySelector('.insta-nav-next');
                                    const slides = carousel.querySelectorAll('.insta-slide');
                                    const counter = carousel.querySelector('.insta-counter');
                                    let currentIndex = 0;
                                    const total = d.mediaList.length;

                                    const updateSlide = (index) => {
                                        slides.forEach(s => s.classList.remove('active'));
                                        slides[index].classList.add('active');
                                        
                                        if(prevBtn) prevBtn.classList.toggle('hidden', index === 0);
                                        if(nextBtn) nextBtn.classList.toggle('hidden', index === total - 1);
                                        
                                        if(counter) counter.textContent = `${index + 1} / ${total}`;

                                        slides.forEach((s, i) => {
                                            if (i !== index) {
                                                const vid = s.querySelector('video');
                                                if (vid) vid.pause();
                                            }
                                        });
                                    };

                                    if(prevBtn) prevBtn.addEventListener('click', (e) => {
                                        e.preventDefault(); e.stopPropagation();
                                        if (currentIndex > 0) { currentIndex--; updateSlide(currentIndex); }
                                    });

                                    if(nextBtn) nextBtn.addEventListener('click', (e) => {
                                        e.preventDefault(); e.stopPropagation();
                                        if (currentIndex < total - 1) { currentIndex++; updateSlide(currentIndex); }
                                    });
                                }

                            } else {
                                // FALLBACK IFRAME (Si VX échoue ou lien mort)
                                if (isStory) {
                                    target.innerHTML = `<div class="placeholder-embed"><a href="${link.href}" target="_blank">Story Instagram (Non récupérable ou expirée)</a></div>`;
                                } else {
                                    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
                                    target.innerHTML = `<iframe src="${embedUrl}" class="iframe-embed" style="width: 100%; max-width: 550px; height: 600px; background: white; border: 1px solid #dbdbdb; border-radius: 4px;" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen="true"></iframe>`;
                                }
                            }

                        } 
                        
                        // CAS 2 : PROFIL
                        else {
                            const username = pathParts[0];
                            const target = getTarget();
                            let profileSuccess = false;
                            if (username && !['explore', 'direct', 'accounts', 'api'].includes(username)) {
                                try {
                                    const response = await LecteurMedia.compatibleHttpRequest({
                                        method: 'GET', url: `https://www.instagram.com/${username}/embed/`,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
                                    });

                                    if (response.status === 200) {
                                        const jsonMatch = response.responseText.match(/contextJSON":"((?:[^\\"]|\\.)*)"/);
                                        if (jsonMatch && jsonMatch[1]) {
                                            const json = JSON.parse(JSON.parse(`"${jsonMatch[1]}"`));
                                            const user = json.context;
                                            
                                            if (user) {
                                                const mediaListRaw = user.graphql_media || (user.edge_owner_to_timeline_media ? user.edge_owner_to_timeline_media.edges : []) || [];
                                                const mediaList = mediaListRaw.map(item => {
                                                    const media = item.shortcode_media || item.node || item;
                                                    let src = media.display_url || media.thumbnail_src;
                                                    if (!src && media.thumbnail_resources?.length) src = media.thumbnail_resources[2]?.src || media.thumbnail_resources[0].src;
                                                    return {
                                                        src: proxify(src),
                                                        link: media.shortcode ? `https://www.instagram.com/p/${media.shortcode}/` : '#'
                                                    };
                                                }).filter(m => m.src);

                                                const profileData = {
                                                    username: username,
                                                    fullname: user.full_name || username,
                                                    avatar: proxify(user.profile_pic_url),
                                                    isVerified: user.is_verified,
                                                    mediaList: mediaList
                                                };
                                                
                                                target.innerHTML = InstagramRenderer.renderProfile(profileData);
                                                profileSuccess = true;
                                            }
                                        }
                                    }
                                } catch(e) { console.warn("[Insta] Profile Scraping Fail", e); }
                            }

                            if (!profileSuccess) {
                                const embedUrl = `https://www.instagram.com/${username}/embed/`;
                                target.innerHTML = `<iframe src="${embedUrl}" class="iframe-embed" style="width: 100%; max-width: 550px; height: 450px; background: white; border: 1px solid #dbdbdb; border-radius: 4px;" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen="true"></iframe>`;
                            }
                        }

                    } catch (e) {
                        console.error("[Instagram] Global Error:", e);
                        const target = getTarget();
                        target.innerHTML = `<div class="placeholder-embed"><a href="${link.href}" target="_blank">Instagram (Erreur)</a></div>`;
                    }
                })();

                return container;
            }
        },
        {
            name: 'Twitter',
            selector: 'a[href*="twitter.com/"], a[href*="x.com/"], a[href*="xcancel.com/"]',
            category: 'connect',
            connect: ['api.vxtwitter.com', 'api.fixupx.com', 'publish.twitter.com', 'platform.twitter.com', 'video.twimg.com'],
            createEmbedElement(link, isDarkTheme) {
                if (typeof IframeResizeManager !== 'undefined') IframeResizeManager.init();

                const parts = link.href.split('/');
                const statusIndex = parts.findIndex(p => p === 'status' || p === 'statuses');
                if (statusIndex === -1 || !parts[statusIndex + 1]) return null;

                const tweetId = escapeHTML(parts[statusIndex + 1].split(/[?#]/)[0]);
                const screenName = parts[statusIndex - 1];
                const uniqueId = `tweet-${tweetId}-${Math.random().toString(36).substring(2, 9)}`;

                const placeholderContainer = createSafeDiv();
                placeholderContainer.className = 'bloc-embed';
                
                const skeletonElement = createSafeDiv();
                skeletonElement.id = `skeleton-${uniqueId}`;
                skeletonElement.className = 'tweet-skeleton';
                skeletonElement.innerHTML = `
                        <div class="sk-header">
                            <div class="sk-avatar"></div>
                            <div class="sk-meta">
                                <div class="sk-line short"></div>
                                <div class="sk-line medium"></div>
                            </div>
                        </div>
                        <div class="sk-line long"></div>`;
                
                placeholderContainer.appendChild(skeletonElement);

                // --- ETAPE 4 : FALLBACK OFFICIEL ---
                const enableFallback = () => {
                    const sk = document.getElementById(`skeleton-${uniqueId}`);
                    const targetContainer = sk ? sk.parentNode : (placeholderContainer.querySelector('.media-content > div') || placeholderContainer);

                    if (targetContainer !== placeholderContainer && sk) {
                         sk.innerHTML = '<div class="twitter-loading-placeholder">Chargement Twitter officiel...</div>';
                    } else {
                         targetContainer.innerHTML = '<div class="twitter-loading-placeholder">Chargement Twitter officiel...</div>';
                    }

                    const handleOfficialResponse = (status, finalUrl) => {
                        const containerToUpdate = document.getElementById(`skeleton-${uniqueId}`)?.parentNode || targetContainer;
                        if (status === 200) {
                            const theme = isDarkTheme ? 'dark' : 'light';
                            const iframeUrl = `https://platform.twitter.com/embed/Tweet.html?id=${encodeURIComponent(tweetId)}&theme=${theme}&dnt=true&lang=fr`;
                            const iframeId = `twitter-iframe-${uniqueId}`;

                            containerToUpdate.innerHTML = `
                                <iframe id="${iframeId}" 
                                    src="${sanitizeUrl(iframeUrl)}" 
                                    class="iframe-embed iframe-twitter" 
                                    title="Twitter Tweet" 
                                    sandbox="allow-scripts allow-same-origin allow-popups" 
                                    allowtransparency="true" 
                                    allowfullscreen 
                                    scrolling="yes"
                                    style="border:none; width:100%; height:65vh; min-height:250px; display:block;">
                                </iframe>`;
                        } else {
                            containerToUpdate.className = 'placeholder-embed tweet-unavailable-placeholder';
                            containerToUpdate.innerHTML = `
                                <div class="icon-container">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path></svg>
                                </div>
                                <div class="text-container">
                                    <strong>Tweet indisponible</strong>
                                    <span class="description">Le tweet a été supprimé ou est inaccessible.</span>
                                    <a href="${link.href}" target="_blank">Ouvrir le lien original</a>
                                </div>`;
                        }
                    };

                    GM.xmlHttpRequest({
                        method: "GET",
                        url: `https://publish.twitter.com/oembed?url=${encodeURIComponent(link.href)}`,
                        onload: function(response) { handleOfficialResponse(response.status, response.finalUrl); },
                        onerror: function(response) { handleOfficialResponse(0, null); }
                    });
                };

                // --- LOGIQUE PRINCIPALE ---
                (async () => {
                    try {
                        const settings = await SettingsManager.getSettings();
                        const cacheKey = `twitter_v2_${tweetId}`;
                        let tweetData = await CacheManager.get(cacheKey);

                        if (!tweetData) {
                            try {
                                const response = await LecteurMedia.raceRequests([
                                    `https://api.vxtwitter.com/${screenName}/status/${tweetId}`,
                                    `https://api.fixupx.com/${screenName}/status/${tweetId}`  
                                ]);

                                if (response.status === 200) {
                                    tweetData = JSON.parse(response.responseText);
                                    if (!tweetData || !tweetData.user_screen_name) throw new Error("Données invalides");
                                    await CacheManager.set(cacheKey, tweetData);
                                } else {
                                    throw new Error("Status " + response.status);
                                }
                            } catch (e) {
                                console.warn("[Twitter] Echec des API Custom, passage au fallback...", e);
                                enableFallback();
                                return; 
                            }
                        }

                        if (tweetData) {
                            let parentTweetHtml = '';
                            if (tweetData.replyingToStatus) {
                                try {
                                    const parentResponse = await LecteurMedia.compatibleHttpRequest({
                                        method: 'GET',
                                        url: `https://api.vxtwitter.com/${tweetData.replyingTo}/status/${tweetData.replyingToStatus}`
                                    });
                                    if (parentResponse.status === 200) {
                                        const parentTweet = JSON.parse(parentResponse.responseText);
                                        parentTweetHtml = `<div class="parent-tweet-container">${VxTwitterRenderer.render(parentTweet, true)}</div>`;
                                    }
                                } catch (e) { }
                            }

                            const mainTweetHtml = VxTwitterRenderer.render(tweetData, false);
                            const tweetEmbed = createSafeDiv();
                            tweetEmbed.className = 'vxtwitter-embed';
                            if (settings.twitterFullHeight) tweetEmbed.classList.add('vxtwitter-full-height');
                            tweetEmbed.innerHTML = parentTweetHtml + mainTweetHtml;

                            // --- GESTION DES VIDÉOS (CASCADE DE SAUVETAGE) ---
                            const videos = tweetEmbed.querySelectorAll('.vxtwitter-video');
                            
                            videos.forEach(videoElement => {
                                const wrapper = videoElement.closest('.vxtwitter-video-wrapper');
                                const originalUrl = videoElement.getAttribute('src');
                                const posterUrl = videoElement.getAttribute('poster');
                                
                                let w = 0, h = 0;
                                let aspectRatioStyle = "";
                                const resolutionMatch = originalUrl.match(/\/(\d+)x(\d+)\//);
                                
                                if (resolutionMatch) {
                                    w = parseInt(resolutionMatch[1]);
                                    h = parseInt(resolutionMatch[2]);
                                    const ratio = w / h;
                                    
                                    // Initial : On contraint pour éviter le saut de layout avant chargement
                                    const maxWidth = Math.floor(550 * ratio);
                                    aspectRatioStyle = `aspect-ratio: ${w}/${h}; max-height: 550px; max-width: ${maxWidth}px; margin: 0 auto;`; 
                                    wrapper.style.cssText += aspectRatioStyle;

                                    videoElement.style.width = '100%';
                                    videoElement.style.height = '100%';
                                    videoElement.style.objectFit = 'cover';

                                    // 1. FIX LAYOUT : Si natif OK, on relâche tout pour s'adapter au contenu
                                    videoElement.addEventListener('loadeddata', () => {
                                        if (!videoElement.src.startsWith('blob:')) {
                                            console.log("[Twitter] Lecture native réussie.");
                                            wrapper.style.aspectRatio = '';
                                            wrapper.style.height = 'auto';
                                            wrapper.style.maxWidth = '100%'; 
                                            wrapper.style.background = 'transparent';
                                            wrapper.style.display = 'block';

                                            videoElement.style.width = '100%';
                                            videoElement.style.height = 'auto';
                                            videoElement.style.maxHeight = '550px';
                                            videoElement.style.display = 'block';
                                            videoElement.style.margin = '0 auto';
                                            videoElement.style.objectFit = '';
                                        }
                                    }, { once: true });
                                }

                                // Style pour l'IFRAME SEULEMENT (Boite noire large)
                                const applyIframeWrapperStyle = () => {
                                    if (w && h) {
                                        wrapper.style.aspectRatio = `${w}/${h}`;
                                        wrapper.style.width = '100%';
                                        wrapper.style.maxWidth = '100%'; 
                                        wrapper.style.height = 'auto';
                                        wrapper.style.maxHeight = '550px';
                                        wrapper.style.margin = '0';
                                        wrapper.style.backgroundColor = '#000';
                                    } else {
                                        wrapper.style.height = '400px';
                                        wrapper.style.width = '100%';
                                    }
                                };

                                // --- ÉTAPE 3 : BLOB GM ---
                                const triggerStep3_Blob = () => {
                                    try {
                                        console.log("[Twitter] Tentative 3 : Blob GM...");
                                        
                                        wrapper.innerHTML = `
                                            <div class="video-loader-fallback" style="display:flex; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); flex-direction:column; justify-content:center; align-items:center; z-index:2;">
                                                <div class="lm-spinner"></div>
                                                <div style="color:white; font-size:12px; margin-top:10px; font-weight:bold; text-align:center;">
                                                    Téléchargement... <span class="dl-progress">0%</span>
                                                </div>
                                            </div>`;
                                        
                                        // Pendant le chargement, on garde le ratio initial (propre)
                                        if (aspectRatioStyle) wrapper.style.cssText += aspectRatioStyle;

                                        const progressSpan = wrapper.querySelector('.dl-progress');

                                        GM.xmlHttpRequest({
                                            method: "GET", url: originalUrl, responseType: "blob",
                                            headers: { "Referer": "https://twitter.com/", "Origin": "https://twitter.com" },
                                            onprogress: (evt) => {
                                                if (evt.lengthComputable && progressSpan) {
                                                    const percent = Math.floor((evt.loaded / evt.total) * 100);
                                                    progressSpan.textContent = percent + '%';
                                                }
                                            },
                                            onload: (response) => {
                                                try {
                                                    if (response.status === 200) {
                                                        const blobUrl = URL.createObjectURL(response.response);
                                                        wrapper.innerHTML = '';
                                                        
                                                        // IMPORTANT : On passe en mode "Fluide" (comme le natif)
                                                        // Plus de boite noire fixe, le wrapper s'adapte à la hauteur réelle
                                                        wrapper.style.cssText = "width:100%; height:auto; display:block; background:transparent; aspect-ratio:unset;";
                                                        
                                                        const newVideo = document.createElement('video');
                                                        newVideo.className = 'vxtwitter-video';
                                                        newVideo.src = blobUrl;
                                                        newVideo.poster = posterUrl;
                                                        newVideo.controls = true;
                                                        newVideo.loop = true;
                                                        newVideo.playsInline = true;
                                                        
                                                        // La vidéo reprend ses dimensions naturelles avec limite de hauteur
                                                        // Les contrôles feront la largeur de la vidéo (comme natif)
                                                        newVideo.style.cssText = "width:100%; height:auto; max-height:550px; display:block; margin:0 auto;";
                                                        
                                                        wrapper.appendChild(newVideo);
                                                        newVideo.play().catch(() => {});
                                                    } else {
                                                        console.warn("[Twitter] Echec Blob HTTP " + response.status);
                                                        enableFallback();
                                                    }
                                                } catch (e) { enableFallback(); }
                                            },
                                            onerror: () => { enableFallback(); }
                                        });
                                    } catch (e) { enableFallback(); }
                                };

                                // --- ÉTAPE 2 : IFRAME SANDBOX ---
                                const triggerStep2_Iframe = () => {
                                    try {
                                        console.log("[Twitter] Tentative 2 : Iframe...");
                                        
                                        wrapper.innerHTML = '';
                                        
                                        // Pour l'iframe, on force la boite large noire pour avoir de grands contrôles
                                        applyIframeWrapperStyle();
                                        
                                        const iframe = document.createElement('iframe');
                                        iframe.style.cssText = "width:100%; height:100%; border:none; display:block; background:#000; overflow:hidden; border-radius:12px;";
                                        iframe.setAttribute('scrolling', 'no');
                                        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
                                        
                                        const uniqueMsgId = "tw_frame_" + Math.random().toString(36).substr(2, 9);
                                        
                                        const htmlContent = `
                                            <html>
                                            <head>
                                                <meta name="referrer" content="no-referrer">
                                                <style>
                                                    html, body { 
                                                        margin: 0; padding: 0; 
                                                        width: 100%; height: 100%; 
                                                        background: black; 
                                                        overflow: hidden; 
                                                        display: flex; 
                                                        align-items: center; 
                                                        justify-content: center; 
                                                    }
                                                    video { 
                                                        width: 100%; 
                                                        height: 100%; 
                                                        object-fit: contain; 
                                                        outline: none;
                                                    }
                                                </style>
                                            </head>
                                            <body>
                                                <video controls autoplay playsinline loop poster="${sanitizeUrl(posterUrl)}">
                                                    <source src="${sanitizeUrl(originalUrl)}" type="video/mp4">
                                                </video>
                                                <script>
                                                    const v = document.querySelector('video');
                                                    v.addEventListener('error', () => {
                                                        window.parent.postMessage({ type: 'TW_VIDEO_ERROR', id: '${uniqueMsgId}' }, '*');
                                                    });
                                                    v.focus();
                                                </script>
                                            </body>
                                            </html>
                                        `;

                                        const messageHandler = (e) => {
                                            if (e.data && e.data.type === 'TW_VIDEO_ERROR' && e.data.id === uniqueMsgId) {
                                                window.removeEventListener('message', messageHandler);
                                                try { triggerStep3_Blob(); } catch(e) { enableFallback(); }
                                            }
                                        };
                                        window.addEventListener('message', messageHandler);

                                        iframe.srcdoc = htmlContent;
                                        wrapper.appendChild(iframe);
                                    } catch (e) {
                                        try { triggerStep3_Blob(); } catch(e) { enableFallback(); }
                                    }
                                };

                                videoElement.addEventListener('error', function(e) {
                                    if (this.src.startsWith('blob:')) return;
                                    try { triggerStep2_Iframe(); } 
                                    catch (err) { triggerStep3_Blob(); }
                                }, { once: true });
                            });

                            const currentSkeleton = document.getElementById(`skeleton-${uniqueId}`);
                            if (currentSkeleton && currentSkeleton.parentNode) {
                                currentSkeleton.replaceWith(tweetEmbed);
                            } else {
                                const contentWrapper = placeholderContainer.querySelector('.media-content > div') || placeholderContainer.querySelector('.media-content');
                                if (contentWrapper) { contentWrapper.innerHTML = ''; contentWrapper.appendChild(tweetEmbed); } 
                                else { placeholderContainer.innerHTML = ''; placeholderContainer.appendChild(tweetEmbed); }
                            }

                            const showMoreButton = tweetEmbed.querySelector('.vxtwitter-show-more');
                            if (showMoreButton) {
                                showMoreButton.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    const textElement = tweetEmbed.querySelector('.vxtwitter-text-collapsible');
                                    if (textElement) textElement.classList.add('vxtwitter-text-expanded');
                                    showMoreButton.style.display = 'none';
                                });
                            }
                            const nitterButton = tweetEmbed.querySelector('.vxtwitter-nitter-link');
                            if (nitterButton) {
                                nitterButton.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    const iframe = document.createElement('iframe');
                                    iframe.src = link.href.replace(/x\.com|twitter\.com/, 'nitter.net');
                                    iframe.className = "iframe-embed iframe-twitter";
                                    iframe.style.height = '80vh';
                                    tweetEmbed.replaceWith(iframe);
                                });
                            }
                            const statsGroup = tweetEmbed.querySelector('.vxtwitter-stats-group');
                            if (statsGroup) setupStatCarousel(statsGroup);

                        } else { enableFallback(); }
                    } catch (error) { enableFallback(); }
                })();

                return placeholderContainer;
            }
        },
        {
            name: 'TikTok',
            selector: 'a[href*="tiktok.com/"]',
            category: 'connect',
            connect: ['vm.tiktok.com', 'vt.tiktok.com', 'v.tiktok.com', 't.tiktok.com', 'www.tiktok.com'],
            async createEmbedElement(link) {
                try {
                    let finalUrl = link.href;
                    const hostname = new URL(link.href).hostname;

                    const shortenerDomains = ['vm.tiktok.com', 'vt.tiktok.com', 'v.tiktok.com', 't.tiktok.com'];
                    if (shortenerDomains.includes(hostname)) {
                        const response = await LecteurMedia.compatibleHttpRequest({ method: 'HEAD', url: finalUrl });
                        finalUrl = response.finalUrl || finalUrl;
                    }

                    const container = createSafeDiv();
                    container.className = 'bloc-embed';

                    // VIDÉO
                    const videoMatch = finalUrl.match(/\/video\/(\d+)/) || finalUrl.match(/\/photo\/(\d+)/);
                    if (videoMatch && videoMatch[1]) {
                        const postId = videoMatch[1];
                        container.innerHTML = `<iframe src="https://www.tiktok.com/embed/v2/${postId}?lang=fr-FR" class="iframe-embed iframe-tiktok iframe-vertical-content" style="border:none;"></iframe>`;
                        return container;
                    }

                    // PROFIL
                    const profileMatch = finalUrl.match(/@([a-zA-Z0-9_.]+)/);
                    if (profileMatch) {
                        const cleanProfileUrl = finalUrl.split('?')[0];
                        const oembedApiUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanProfileUrl)}`;

                        try {
                            const response = await LecteurMedia.compatibleHttpRequest({ method: 'GET', url: oembedApiUrl });

                            if (response.status === 200) {
                                const data = JSON.parse(response.responseText);
                                
                                container.innerHTML = data.html;
                                if (!document.querySelector('script[src*="tiktok.com/embed.js"]')) {
                                    console.log("[TikTok Test] Tentative d'injection du script embed.js dans la page...");
                                    const script = document.createElement('script');
                                    script.src = "https://www.tiktok.com/embed.js";
                                    script.async = true;
                                    document.body.appendChild(script);
                                }

                                return container;
                            }
                        } catch (e) {
                            console.warn('[TikTok] Erreur API', e);
                        }
                    }

                    return null;

                } catch (error) {
                    console.error('[TikTok] Erreur:', error);
                    return null;
                }
            },
        },
        {
          name: 'Streamable',
          selector: 'a[href*="streamable.com/"]',
          category: 'connect',
          connect: 'api.streamable.com',
          createEmbedElement(link) {
              const cleanUrl = link.href.replace('/e/', '/');
              const httpsUrl = cleanUrl.replace('http://', 'https://');
              const iframeUrl = httpsUrl.replace('.com/', '.com/e/');

              const container = createSafeDiv();
              container.className = 'bloc-embed';

              const iframe = document.createElement('iframe');
              iframe.src = iframeUrl;
              iframe.className = 'iframe-embed iframe-streamable';
              iframe.title = "Streamable Video";
              iframe.setAttribute('allowfullscreen', '');
              iframe.style.aspectRatio = '16 / 9';
              container.appendChild(iframe);

              (async () => {
                  try {
                      const response = await LecteurMedia.compatibleHttpRequest({
                          method: 'GET',
                          url: `https://api.streamable.com/oembed.json?url=${encodeURIComponent(cleanUrl)}`
                      });

                      if (response.status >= 200 && response.status < 300) {
                          const data = JSON.parse(response.responseText);
                          if (data.width && data.height) {
                              if (data.height > data.width) {
                                  iframe.classList.add('iframe-vertical-content');
                              }
                              iframe.style.aspectRatio = `${data.width} / ${data.height}`;
                          }
                      }
                  } catch (error) {
                      console.error('[Streamable API] Erreur lors de la récupération des métadonnées :', error);
                  }
              })();

              return container;
          }
        },
        {
            name: 'Webmshare',
            selector: 'a[href*="webmshare.com/"]',
            category: 'base',
            createEmbedElement(link) {
                if (!/webmshare\.com\/(play\/)?[\w]+$/.test(link.href)) return null;
                const videoId = link.pathname.split('/').pop();
                if (!videoId) return null;
                const videoUrl = `https://s1.webmshare.com/${videoId}.webm`;
                const container = createSafeDiv();
                container.className = 'bloc-embed';
                container.innerHTML = `<video src="${videoUrl}" class="video-embed" controls autoplay muted loop playsinline></video>`;
                return container;
            }
        },
        {
            name: 'YouTube',
            selector: 'a[href*="youtube.com/watch"], a[href*="youtu.be/"], a[href*="youtube.com/shorts/"], a[href*="youtube.com/live/"], a[href*="youtube.com/post/"], a[href*="youtube.com/community"], a[href*="youtube.com/playlist"], a[href*="youtube.com/clip/"], a[href*="youtube.com/@"], a[href*="youtube.com/channel/"], a[href*="youtube.com/c/"], a[href*="youtube.com/user/"]',
            category: 'connect',
            connect: ['www.youtube.com', 'youtube.com', 'img.youtube.com', 'yt3.ggpht.com'],
            
            parseYoutubeTime(url) {
                try {
                    const urlObj = new URL(url);
                    const timeParamString = urlObj.searchParams.get('t') || urlObj.searchParams.get('start') || (urlObj.hash.includes('t=') ? urlObj.hash.split('t=')[1] : null);
                    if (!timeParamString) return null;
                    let totalSeconds = 0;
                    const timeMatches = timeParamString.matchAll(/(\d+)([hms])/g);
                    let foundMatch = false;
                    for (const match of timeMatches) {
                        foundMatch = true;
                        const value = parseInt(match[1], 10);
                        const unit = match[2];
                        if (unit === 'h') totalSeconds += value * 3600;
                        if (unit === 'm') totalSeconds += value * 60;
                        if (unit === 's') totalSeconds += value;
                    }
                    if (!foundMatch && /^\d+$/.test(timeParamString)) {
                        totalSeconds = parseInt(timeParamString, 10);
                    }
                    return totalSeconds > 0 ? totalSeconds : null;
                } catch(e) { return null; }
            },

            createEmbedElement(link) {
                const url = link.href;
                const urlObj = new URL(url);
                
                const isPost = url.includes('/post/') || url.includes('/community');
                const isPlaylist = url.includes('/playlist') && urlObj.searchParams.has('list');
                const isClip = url.includes('/clip/');
                const isChannel = !isPost && !isPlaylist && !isClip && (
                    url.includes('/@') || url.includes('/channel/') || url.includes('/c/') || url.includes('/user/')
                );

                // CAS 1 : CHAÎNES & POSTS
                if (isChannel || isPost) {
                    const container = createSafeDiv();
                    container.className = 'bloc-embed';
                    
                    const targetDiv = createSafeDiv();
                    targetDiv.style.width = "100%";
                    
                    targetDiv.innerHTML = `
                    <div class="insta-profile-card skeleton-card" style="border:none; pointer-events:none; max-width:500px; width:100%;">
                        <div class="insta-header" style="border:none;">
                            <div class="skeleton-image" style="width:50px; height:50px; border-radius:50%; background-color:#333;"></div>
                            <div style="flex:1; margin-left:10px; display:flex; flex-direction:column; gap:6px;">
                                <div class="skeleton-line" style="width:120px; height:14px; background-color:#333; border-radius:4px;"></div>
                                <div class="skeleton-line" style="width:80px; height:10px; background-color:#333; border-radius:4px;"></div>
                            </div>
                        </div>
                        <div style="padding:12px; display:flex; flex-direction:column; gap:8px;">
                            <div class="skeleton-line" style="width:90%; height:10px; background-color:#333; border-radius:4px;"></div>
                            <div class="skeleton-line" style="width:60%; height:10px; background-color:#333; border-radius:4px;"></div>
                        </div>
                    </div>`;
                    
                    container.appendChild(targetDiv);

                    (async () => {
                        try {
                            const response = await LecteurMedia.compatibleHttpRequest({
                                method: 'GET',
                                url: url,
                                headers: { 
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                                    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
                                }
                            });

                            if (response.status === 200) {
                                const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                                
                                const ogDesc = escapeHTML(doc.querySelector('meta[property="og:description"]')?.content || "");
                                const ogImage = sanitizeUrl(doc.querySelector('meta[property="og:image"]')?.content);
                                const rawTitle = doc.querySelector('meta[property="og:title"]')?.content || "";
                                const cleanTitle = escapeHTML(rawTitle.replace(' - YouTube', ''));
                                
                                let avatarUrl = isChannel ? ogImage : null;
                                let mainImage = isPost ? ogImage : null;
                                
                                const typeLabel = isChannel ? "Chaîne YouTube" : "Post Communauté";
                                const buttonLabel = isChannel ? "S'abonner (Voir la chaîne)" : "Voir le post sur YouTube";
                                const safeLink = sanitizeUrl(url);

                                const html = `
                                <div class="insta-profile-card" style="max-width:550px;">
                                    <div class="insta-header">
                                        ${avatarUrl 
                                            ? `<img src="${avatarUrl}" class="insta-avatar-img" style="width:50px; height:50px;">`
                                            : `<div class="insta-avatar-generic" style="background:#f00; color:white; width:50px; height:50px; font-size:18px;">YT</div>`
                                        }
                                        <div class="insta-details">
                                            <div class="insta-name-row">
                                                <a href="${safeLink}" target="_blank" class="insta-fullname" style="font-size:16px;">${cleanTitle}</a>
                                                <svg class="insta-verified" width="14" height="14" viewBox="0 0 24 24" fill="#aaa" style="margin-left:4px;" title="Vérifié"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                                            </div>
                                            <span class="insta-username">${typeLabel}</span>
                                        </div>
                                    </div>
                                    ${mainImage ? `
                                    <div class="insta-media-container" style="background:transparent; min-height:auto;">
                                        <img src="${mainImage}" class="image-embed" style="max-height:500px; width:100%; object-fit:contain;">
                                    </div>` : ''}
                                    <div class="insta-meta">
                                        <div class="insta-caption expanded" style="white-space: pre-wrap; max-height: 150px; overflow-y: auto;">${ogDesc}</div>
                                    </div>
                                    <a href="${safeLink}" target="_blank" class="insta-footer" style="color:#f00; background:rgba(255,0,0,0.05); font-weight:700;">${buttonLabel}</a>
                                </div>`;

                                targetDiv.innerHTML = html;
                            } else { throw new Error("Erreur HTTP"); }
                        } catch (e) {
                            targetDiv.innerHTML = `<div class="placeholder-embed"><a href="${url}" target="_blank">Contenu YouTube (Aperçu indisponible)</a></div>`;
                        }
                    })();
                    return container;
                }

                // CAS 2 : CLIPS
                if (isClip) {
                    const pathParts = new URL(url).pathname.split('/');
                    const clipIndex = pathParts.indexOf('clip');
                    if (clipIndex !== -1 && pathParts[clipIndex + 1]) {
                        const clipId = pathParts[clipIndex + 1];
                        const container = createSafeDiv();
                        container.className = 'bloc-embed';
                        container.innerHTML = `<iframe src="https://www.youtube.com/embed/clip/${clipId}" class="iframe-embed iframe-youtube" title="YouTube Clip" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
                        return container;
                    }
                }

                // CAS 3 : PLAYLISTS
                if (isPlaylist) {
                    const listId = new URL(url).searchParams.get('list');
                    if (listId) {
                        const container = createSafeDiv();
                        container.className = 'bloc-embed';
                        container.innerHTML = `<iframe src="https://www.youtube.com/embed/videoseries?list=${listId}" class="iframe-embed iframe-youtube" title="YouTube Playlist" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
                        return container;
                    }
                }

                // CAS 4 : VIDÉOS CLASSIQUES / SHORTS / LIVE
                const youtubeRegex = /(?:[?&]v=|\/shorts\/|\/live\/|youtu\.be\/)([^?&/\s]{11})/;
                const match = link.href.match(youtubeRegex);

                if (!match || !match[1]) return null;
                const videoId = match[1];

                const isShort = link.href.includes('/shorts/');
                if (isShort) {
                    const container = createSafeDiv();
                    container.className = 'bloc-embed';
                    container.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" class="iframe-embed iframe-youtube-short iframe-vertical-content" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
                    return container;
                }

                const startTime = this.parseYoutubeTime(link.href);
                const params = new URLSearchParams();
                if (startTime) params.append('start', startTime);
                params.append('enablejsapi', '1');
                params.append('rel', '0');

                const container = createSafeDiv();
                container.className = 'youtube-facade-container';
                const iframe = document.createElement('iframe');
                iframe.className = 'iframe-embed iframe-youtube';
                iframe.title = "YouTube video player";
                iframe.src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                iframe.setAttribute('allowfullscreen', '');

                const facade = createSafeDiv();
                facade.className = 'youtube-facade-overlay';
                container.appendChild(iframe);
                container.appendChild(facade);

                facade.addEventListener('click', () => {
                    try { iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', 'https://www.youtube.com'); } catch (e) { }
                    facade.remove();
                }, { once: true });

                const finalContainer = createSafeDiv();
                finalContainer.className = 'bloc-embed';
                finalContainer.appendChild(container);

                return finalContainer;
            }
        },
        {
            name: 'Facebook',
            selector: `
                a[href*="facebook.com/posts/"],
                a[href*="facebook.com/videos/"],
                a[href*="facebook.com/photos/"],
                a[href*="facebook.com/photo/"],
                a[href*="facebook.com/reel/"],
                a[href*="facebook.com/share/"],
                a[href*="facebook.com/photo.php"],
                a[href*="facebook.com/"]
            `,
            category: 'connect',
            connect: 'facebook.com',
            scriptPromise: null,
            loadScript() {
                if (!this.scriptPromise) {
                    this.scriptPromise = new Promise((resolve) => {
                        if (typeof unsafeWindow !== 'undefined' && unsafeWindow.FB) return resolve();
                        unsafeWindow.fbAsyncInit = function() {
                            unsafeWindow.FB.init({ xfbml: true, version: 'v18.0' });
                            resolve();
                        };
                        const script = document.createElement('script');
                        script.async = true; script.defer = true; script.crossOrigin = 'anonymous';
                        script.src = 'https://connect.facebook.net/fr_FR/sdk.js';
                        document.head.appendChild(script);
                    });
                }
                return this.scriptPromise;
            },
            async createEmbedElement(link) {
                this.loadScript();

                let embedUrl = link.href;

                if (link.href.includes('/share/')) {
                    try {
                        const response = await LecteurMedia.compatibleHttpRequest({
                            method: 'HEAD',
                            url: link.href
                        });
                        embedUrl = response.finalUrl || link.href;

                    } catch (error) {
                        console.error('[Facebook] Erreur de résolution du lien de partage:', error);
                    }
                }

                const container = createSafeDiv();
                container.className = 'bloc-embed';

                const isVideo = embedUrl.includes('/videos/') || embedUrl.includes('/reel/');
                const playerType = isVideo ? 'fb-video' : 'fb-post';
                const showText = isVideo ? 'false' : 'true';
                container.innerHTML = `<div class="${playerType}" data-href="${sanitizeUrl(embedUrl)}" data-width="550" data-show-text="${showText}"></div>`;
                return container;
            },
            postProcess(element) {
                this.loadScript().then(() => {
                    if (typeof unsafeWindow !== 'undefined' && unsafeWindow.FB) {
                        unsafeWindow.FB.XFBML.parse(element);
                    }
                });
            }
        },
        {
            name: 'Twitch',
            selector: 'a[href*="twitch.tv/"]',
            category: 'base',
            createEmbedElement(link) {
                const parentHostname = window.location.hostname;

                try {
                    const url = new URL(link.href);
                    const pathParts = url.pathname.split('/').filter(p => p);
                    let iframeSrc = null;

                    if (url.hostname === 'clips.twitch.tv' || pathParts.includes('clip')) {
                        const clipId = pathParts[pathParts.length - 1];
                        if (clipId) {
                            iframeSrc = `https://clips.twitch.tv/embed?clip=${clipId}&parent=${parentHostname}`;
                        }
                    }
                    else if (pathParts[0] === 'videos' && pathParts[1]) {
                        const videoId = pathParts[1];
                        iframeSrc = `https://player.twitch.tv/?video=${videoId}&parent=${parentHostname}`;
                    }
                    // Gère les directs : twitch.tv/CHANNEL_NAME
                    else if (pathParts.length === 1 && pathParts[0]) {
                        const channelName = pathParts[0];
                        iframeSrc = `https://player.twitch.tv/?channel=${channelName}&parent=${parentHostname}`;
                    }

                    if (!iframeSrc) return null;

                    const container = createSafeDiv();
                    container.className = 'bloc-embed';
                    container.innerHTML = `<iframe
                        src="${iframeSrc}"
                        class="iframe-embed iframe-twitch"
                        title="Lecteur vidéo Twitch"
                        allowfullscreen="true"
                        frameborder="0">
                    </iframe>`;
                    return container;

                } catch (e) {
                    console.error('[Twitch] Erreur lors de la création de l\'embed :', e);
                    return null;
                }
            }
        },
        {
            name: 'Vocaroo',
            selector: 'a[href*="vocaroo.com/"], a[href*="voca.ro/"]',
            category: 'base',
            createEmbedElement(link) {
                try {
                    let audioId = link.pathname.split('/').pop();
                    
                    if (!audioId || link.pathname === '/') return null;

                    if (/^s\d/.test(audioId)) {
                        audioId = audioId.substring(2); 
                    }

                    const iframeSrc = `https://vocaroo.com/embed/${audioId}?autoplay=0`;

                    const container = createSafeDiv();
                    container.className = 'bloc-embed';
                    container.innerHTML = `<iframe
                        src="${iframeSrc}"
                        class="iframe-embed iframe-vocaroo"
                        title="Lecteur audio Vocaroo"
                        frameborder="0"
                        allow="autoplay">
                    </iframe>`;

                    return container;

                } catch (e) {
                    console.error('[Vocaroo] Erreur lors de la création de l\'embed :', e);
                    return null;
                }
            }
        },
        {
          name: 'Reddit',
          selector: 'a[href*="reddit.com/"], a[href*="redd.it/"]',
          category: 'connect',
          connect: 'www.reddit.com',
          async createEmbedElement(link, isDarkTheme) {
              
              const url = new URL(link.href);
              const hostname = url.hostname;

              if (hostname.includes('redd.it')) {
                  const container = createSafeDiv();
                  container.className = 'bloc-embed';

                  if (hostname.includes('packaged-media') || hostname.includes('v.redd.it') || /\.(mp4|mov|webm)$/i.test(url.pathname)) {
                      container.innerHTML = `<video src="${link.href}" class="video-embed" controls autoplay muted loop playsinline></video>`;
                      return container;
                  }
                  
                  if (hostname.includes('i.redd.it') || /\.(jpg|jpeg|png|gif|webp)$/i.test(url.pathname)) {
                      container.innerHTML = `<img src="${link.href}" class="image-embed" alt="Média Reddit" loading="lazy">`;
                      return container;
                  }

                  return null;
              }

              IframeResizeManager.init();

              try {
                  let finalUrl;
                  if (link.pathname.includes('/s/')) {
                      const response = await LecteurMedia.compatibleHttpRequest({
                          method: 'HEAD',
                          url: link.href
                      });

                      finalUrl = response.finalUrl || link.href;
                  } else {
                      finalUrl = link.href;
                  }

                  const urlObject = new URL(finalUrl);

                  if (!urlObject.pathname.includes('/comments/')) {
                      return null;
                  }

                  urlObject.hostname = 'embed.reddit.com';
                  urlObject.searchParams.set('embed', 'true');
                  urlObject.searchParams.set('theme', isDarkTheme ? 'dark' : 'light');
                  urlObject.searchParams.set('showmedia', 'true');
                  urlObject.searchParams.set('showmore', 'false');

                  const container = createSafeDiv();
                  container.className = 'bloc-embed';
                  container.innerHTML = `<iframe
                      src="${urlObject.toString()}"
                      class="iframe-embed iframe-reddit"
                      title="Contenu Reddit intégré"
                      sandbox="allow-scripts allow-same-origin allow-popups"
                      height="600"
                      allowfullscreen>
                  </iframe>`;

                  return container;

              } catch (e) {
                  console.error('[Reddit] Erreur lors de la création de l\'embed :', e);
                  return null;
              }
          }
        },
        {
          name: 'StrawPoll',
          selector: 'a[href*="strawpoll.com/"]',
          category: 'base',
          createEmbedElement(link) {
              const url = new URL(link.href);
              const pathParts = url.pathname.split('/').filter(p => p);

              let pollId = null;
              if (pathParts[0] === 'polls' && pathParts[1]) {
                  pollId = pathParts[1];
              } else if (pathParts.length === 1 && pathParts[0]) {
                  pollId = pathParts[0];
              }

              if (!pollId) return null;

              const iframeUrl = `https://strawpoll.com/embed/${pollId}`;

              const container = createSafeDiv();
              container.className = 'bloc-embed';
              container.innerHTML = `<iframe
                  src="${iframeUrl}"
                  class="iframe-embed"
                  style="width: 100%; height: 450px; border: 0;"
                  title="Sondage StrawPoll">
              </iframe>`;
              return container;
          }
        },
        {
          name: 'Imgur',
          selector: 'a[href*="imgur.com/"]',
          category: 'base',
          createEmbedElement(link) {
              try {
                  const url = new URL(link.href);
                   const container = createSafeDiv();
                  container.className = 'bloc-embed';

                  const isDirectMedia = url.hostname === 'i.imgur.com' || /\.(mp4|gifv|webm|jpg|jpeg|png|gif)$/i.test(url.pathname);

                  if (isDirectMedia) {
                      if (/\.(mp4|gifv|webm)$/i.test(url.pathname)) {
                          let videoUrl = url.href.replace('.gifv', '.mp4');
                          container.innerHTML = `<video src="${videoUrl}" class="video-embed" controls autoplay muted loop playsinline></video>`;
                      }
                      else {
                          container.innerHTML = `<img src="${url.href}" class="image-embed" alt="Image depuis Imgur" loading="lazy">`;
                      }
                      return container;
                  }

                 const pathParts = url.pathname.split('/').filter(p => p);
                  if (pathParts.length === 0 || ['upload', 'search'].includes(pathParts[0])) {
                      return null;
                  }

                  const embedId = pathParts.join('/').replace(/\.[^/.]+$/, "");
                  container.classList.add('imgur-embed');

                  const blockquote = document.createElement('blockquote');
                  blockquote.className = 'imgur-embed-pub';
                  blockquote.lang = 'en';
                  blockquote.setAttribute('data-id', embedId);
                  blockquote.innerHTML = `<a href="//imgur.com/${embedId}">${escapeHTML(link.textContent) || 'Voir sur Imgur'}</a>`;

                  const script = document.createElement('script');
                  script.async = true;
                  script.src = 'https://s.imgur.com/min/embed.js';
                  script.charset = 'utf-8';

                  container.appendChild(blockquote);
                  container.appendChild(script);

                  return container;


              } catch (e) {
                  console.error(`[Imgur] Échec final pour trouver une image valide pour ${link.href}:`, e);
                  const stickerUrl = 'https://risibank.fr/cache/medias/0/5/512/51206/thumb.png';
                  const deadLinkContainer = createSafeDiv();
                  deadLinkContainer.className = 'bloc-embed';
                  deadLinkContainer.innerHTML = `<div class="dead-link-sticker"><img src="${stickerUrl}" alt="[Média supprimé]"><span>[Média supprimé]</span></div>`;
                  return deadLinkContainer;
              }
              return null;
          }
        },
        {
          name: 'Flickr',
          selector: 'a[href*="flickr.com/photos/"], a[href*="flic.kr/p/"]',
          category: 'connect',
          connect: 'www.flickr.com',
          async createEmbedElement(link) {
              try {
                  const apiUrl = `https://www.flickr.com/services/oembed/?url=${encodeURIComponent(link.href)}&format=json&maxwidth=550`;
                  const response = await LecteurMedia.compatibleHttpRequest({
                      method: 'GET',
                      url: apiUrl
                  });

                  if (response.status < 200 || response.status >= 300) {
                      throw new Error(`L'API Flickr a retourné le statut ${response.status}`);
                  }

                  const data = JSON.parse(response.responseText);
                  if (!data || !data.html) {
                      console.warn('[Flickr] Pas de HTML d\'intégration dans la réponse API pour', link.href);
                      return null;
                  }

                  const container = createSafeDiv();
                  container.className = 'bloc-embed';
                  container.innerHTML = safeHTML(data.html);

                  return container;

              } catch (error) {
                  console.error('[Flickr] Erreur lors de la récupération de l\'embed :', error);
                  return null;
              }
          }
        },
        {
            name: 'Deezer',
            selector: 'a[href*="deezer.com/"]',
            category: 'base',
            createEmbedElement(link) {
                const match = link.href.match(/(track|album|playlist|artist)\/(\d+)/);
                if (!match) return null;

                const type = match[1];
                const id = match[2];
                const embedUrl = `https://widget.deezer.com/widget/dark/${type}/${id}`;

                const container = createSafeDiv();
                container.className = 'bloc-embed';
                container.innerHTML = `<iframe 
                    src="${embedUrl}" 
                    class="iframe-embed" 
                    style="height: 300px; width: 100%; max-width: 550px;" 
                    frameborder="0" 
                    allowtransparency="true" 
                    allow="encrypted-media; clipboard-write">
                </iframe>`;
                return container;
            }
        },
        {
          name: 'Zupimages',
          selector: 'a[href*="zupimages.net/"]',
          category: 'base',
          createEmbedElement(link) {
              try {
                  const url = new URL(link.href);
                  let imageUrl = null;

                  if (url.pathname.includes('viewer.php')) {
                      const imageId = url.searchParams.get('id');
                      if (imageId) {
                          imageUrl = `https://zupimages.net/up/${imageId}`;
                      }
                  }
                  else if (url.pathname.startsWith('/up/') && /\.(jpe?g|png|gif|webp)$/i.test(url.pathname)) {
                      imageUrl = link.href;
                  }

                  if (!imageUrl) {
                      return null;
                  }

                  const container = createSafeDiv();
                  container.className = 'bloc-embed';
                  container.innerHTML = `<img src="${imageUrl}" class="image-embed" alt="Image depuis Zupimages" loading="lazy">`;
                  return container;

              } catch (e) {
                  console.error('[Zupimages] Erreur lors de la création de l\'embed :', e);
                  return null;
              }
          }
        },
        {
          name: 'Giphy',
          selector: 'a[href*="_giphy.com/"], a[href*="_gph.is/"]',
          category: 'connect',
          connect: 'gph.is',
          async createEmbedElement(link) {
              try {
                  let finalUrl = link.href;

                 if (link.hostname === 'gph.is') {
                      const response = await LecteurMedia.compatibleHttpRequest({
                          method: 'HEAD',
                          url: link.href
                      });

                      finalUrl = response.finalUrl || link.href;
                  }

                  const url = new URL(finalUrl);
                  let gifId = null;

                  if (url.hostname === 'media.giphy.com' && url.pathname.includes('/media/')) {
                      const pathParts = url.pathname.split('/');
                      if (pathParts.length > 2 && pathParts[1] === 'media') {
                          gifId = pathParts[2];
                      }
                  } else if (url.hostname === 'giphy.com' && url.pathname.includes('/gifs/')) {
                      const lastPart = url.pathname.split('/').filter(p => p).pop();
                      if (lastPart) {
                          gifId = lastPart.split('-').pop();
                      }
                  }

                  if (!gifId) {
                      return null;
                  }

                  const iframeUrl = `https://giphy.com/embed/${gifId}`;

                  const container = createSafeDiv();
                  container.className = 'bloc-embed';
                  container.innerHTML = `<iframe
                      src="${iframeUrl}"
                      class="iframe-embed iframe-youtube"
                      title="Giphy embed"
                      frameborder="0"
                      allowfullscreen>
                  </iframe>`;
                  return container;

              } catch (e) {
                  console.error('[Giphy] Erreur lors de la création de l\'embed :', e);
                  return null;
              }
          }
        },
        {
          name: 'Telegram',
          selector: 'a[href*="t.me/"]',
          category: 'base',
          createEmbedElement(link, isDarkTheme) {
              try {
                  const url = new URL(link.href);
                  const pathParts = url.pathname.split('/').filter(p => p);

                  if (pathParts.length < 2 || !/^\d+$/.test(pathParts[1])) {
                      return null;
                  }

                  const postData = `${pathParts[0]}/${pathParts[1]}`;

                  const container = createSafeDiv();
                  container.className = 'bloc-embed';

                  const script = document.createElement('script');
                  script.async = true;
                  script.src = 'https://telegram.org/js/telegram-widget.js?22';
                  script.setAttribute('data-telegram-post', postData);
                  script.setAttribute('data-width', '100%');
                  script.setAttribute('data-userpic', 'true');

                  if (isDarkTheme) {
                      script.setAttribute('data-dark', '1');
                  }

                  container.appendChild(script);

                  return container;

              } catch (e) {
                  console.error('[Telegram] Erreur lors de la création de l\'embed :', e);
                  return null;
              }
          }
        },
        {
          name: 'GoogleDrive',
          selector: 'a[href*="drive.google.com/"], a[href*="docs.google.com/"]',
          category: 'base',
          createEmbedElement(link) {
              try {
                  const url = new URL(link.href);
                  let embedUrl = null;
                  let iframeClass = 'iframe-embed iframe-google-drive';

                  const docMatch = url.pathname.match(/\/(document|spreadsheets|presentation|drawings)\/d\/([^/]+)/);
                  if (docMatch) {
                      const docType = docMatch[1];
                      const docId = docMatch[2];
                      const embedType = (docType === 'presentation' || docType === 'drawings') ? 'embed' : 'preview';
                      embedUrl = `https://docs.google.com/${docType}/d/${docId}/${embedType}`;

                      if (docType === 'presentation') {
                          iframeClass = 'iframe-embed iframe-google-slides';
                      }
                  }

                  const formMatch = url.pathname.match(/\/forms\/d\/e\/([^/]+)/);
                  if (formMatch) {
                      const formId = formMatch[1];
                      embedUrl = `https://docs.google.com/forms/d/e/${formId}/viewform?embedded=true`;
                  }

                  const fileMatch = url.pathname.match(/\/file\/d\/([^/]+)/);
                  if (fileMatch) {
                      const fileId = fileMatch[1];
                      embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                  }

                  const folderMatch = url.pathname.match(/\/drive\/folders\/([^/]+)/);
                  if (folderMatch) {
                      const folderId = folderMatch[1];
                      embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
                  }

                  if (!embedUrl) {
                      return null;
                  }

                  const container = createSafeDiv();
                  container.className = 'bloc-embed';
                  container.innerHTML = `<iframe src="${embedUrl}" class="${iframeClass}" frameborder="0" allowfullscreen></iframe>`;

                  return container;

              } catch (e) {
                  console.error('[GoogleDrive] Erreur lors de la création de l\'embed :', e);
                  return null;
              }
          }
        },
        {
            name: 'IssouTV',
            // On cible les deux formats d'URL possibles
            selector: 'a[href*="issoutv.com/videos/"], a[href*="issoutv.com/view.php"]',
            category: 'connect',
            // On doit se connecter au site pour trouver le vrai lien du fichier vidéo
            connect: ['issoutv.com', 'www.issoutv.com'],
            async createEmbedElement(link) {
                try {
                    // On charge la page IssouTV en arrière-plan
                    const response = await LecteurMedia.compatibleHttpRequest({
                        method: 'GET',
                        url: link.href
                    });

                    if (response.status === 200) {
                        const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                        
                        const videoTag = doc.querySelector('video');
                        const sourceTag = doc.querySelector('source[src*=".webm"], source[src*=".mp4"]');
                        
                        let videoSrc = videoTag ? videoTag.getAttribute('src') : null;
                        if (!videoSrc && sourceTag) videoSrc = sourceTag.getAttribute('src');

                        if (videoSrc) {
                            if (videoSrc.startsWith('/')) {
                                videoSrc = 'https://issoutv.com' + videoSrc;
                            }

                            const container = createSafeDiv();
                            container.className = 'bloc-embed';
                            container.innerHTML = `<video
                                src="${sanitizeUrl(videoSrc)}"
                                class="video-embed"
                                controls
                                autoplay
                                muted
                                loop
                                playsinline>
                            </video>`;
                            return container;
                        }
                    }
                } catch (e) {
                    console.error('[IssouTV] Erreur:', e);
                }
                return null;
            }
        },
        {
          name: 'Bilibili',
          selector: 'a[href*="bilibili.com/video/"]',
          category: 'base',
          createEmbedElement(link) {
              try {
                  const match = link.href.match(/\/video\/(BV[a-zA-Z0-9]+)/);
                  if (!match || !match[1]) {
                      return null;
                  }

                  const videoId = match[1];
                  const iframeUrl = `https://player.bilibili.com/player.html?bvid=${videoId}&page=1&high_quality=1`;

                  const container = createSafeDiv();
                  container.className = 'bloc-embed';
                  container.innerHTML = `<iframe
                      src="${iframeUrl}"
                      class="iframe-embed iframe-youtube"
                      title="Lecteur vidéo Bilibili"
                      scrolling="no"
                      border="0"
                      frameborder="0"
                      framespacing="0"
                      allowfullscreen="true">
                  </iframe>`;

                  return container;

              } catch (e) {
                  console.error('[Bilibili] Erreur lors de la création de l\'embed :', e);
                  return null;
              }
          }
        },
        {
          name: 'Koreus',
          selector: 'a[href*="koreus.com/video/"]',
          category: 'base',
          createEmbedElement(link) {
              try {
                  const match = link.href.match(/\/video\/(.+?)\.html/);
                  if (!match || !match[1]) {
                      return null;
                  }

                  const videoId = match[1];
                  const iframeUrl = `https://www.koreus.com/embed/${videoId}`;

                  const container = createSafeDiv();
                  container.className = 'bloc-embed';

                  container.innerHTML = `<iframe
                      src="${iframeUrl}"
                      class="iframe-embed iframe-youtube"
                      title="Lecteur vidéo Koreus"
                      frameborder="0"
                      allowfullscreen>
                  </iframe>`;

                  return container;

              } catch (e) {
                  console.error('[Koreus] Erreur lors de la création de l\'embed :', e);
                  return null;
              }
          }
        },
        {
          name: 'GoogleMaps',
          selector: 'a[href*="google."][href*="/maps/"], a[href*="maps.app.goo.gl/"]',
          category: 'connect',
          connect: 'maps.app.goo.gl',
          async createEmbedElement(link) {
              try {
                  let finalUrl = link.href;
                  
                  if (link.hostname === 'maps.app.goo.gl') {
                      const response = await LecteurMedia.compatibleHttpRequest({
                          method: 'GET',
                          url: link.href
                      });
                      finalUrl = response.finalUrl || link.href;
                  }

                  const url = new URL(finalUrl);
                  const container = createSafeDiv();
                  container.className = 'bloc-embed';
                  const pathData = url.pathname;

                  // MODE STREET VIEW ---
                  const panoIdMatch = finalUrl.match(/!1s([^!/]+)/);
                  const coords = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                  
                  // Street View ? (Présence de ,3a, ou layer=c ou panoId)
                  const isStreetViewMode = finalUrl.includes(',3a,') || panoIdMatch || finalUrl.includes('layer=c');
                  
                  // Extraction de l'orientation
                  const headingMatch = finalUrl.match(/,(\d+(?:\.\d+)?)h/);
                  let heading = headingMatch ? headingMatch[1] : '0';

                  // Extraction de l'inclinaison (Pitch)
                  let pitch = '0';

                  if (isStreetViewMode) {
                      let embedUrl;
                      
                      if (panoIdMatch && panoIdMatch[1]) {
                          const panoId = panoIdMatch[1];
                          let coordsParam = '';
                          if (coords) {
                              coordsParam = `&cbll=${coords[1]},${coords[2]}`;
                          }
                          
                          embedUrl = `https://maps.google.com/maps?layer=c&panoid=${panoId}${coordsParam}&cbp=12,${heading},,0,${pitch}&output=svembed`;
                      } 
                      else if (coords) {
                          embedUrl = `https://maps.google.com/maps?layer=c&cbll=${coords[1]},${coords[2]}&cbp=12,${heading},,0,${pitch}&output=svembed`;
                      }

                      if (embedUrl) {
                          container.innerHTML = `<iframe class="iframe-embed iframe-google-maps" src="${embedUrl}" frameborder="0" allowfullscreen loading="lazy" title="Google Maps Street View"></iframe>`;
                          return container;
                      }
                  }

                  // CARTE CLASSIQUE
                  const isSatellite = finalUrl.includes('!1e3') || finalUrl.includes('/data=!3m1!1e3');
                  const mapType = isSatellite ? 'k' : 'm';
                  let query = null;
                  
                  const placeMatch = pathData.match(/\/place\/([^/]+)/);
                  if (placeMatch && placeMatch[1]) {
                      query = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
                  }
                  
                  if (!query) {
                      const searchMatch = pathData.match(/\/search\/([^/?]+)/);
                      if (searchMatch && searchMatch[1]) {
                          let rawSearch = decodeURIComponent(searchMatch[1].replace(/\+/g, ' '));
                          const coordMatch = rawSearch.match(/(-?\d+\.\d+)[,\s\+]+(-?\d+\.\d+)/);
                          query = coordMatch ? `${coordMatch[1]},${coordMatch[2]}` : rawSearch;
                      }
                  }

                  if (!query && coords) {
                      query = `${coords[1]},${coords[2]}`;
                  }

                  if (!query && url.searchParams.has('q')) {
                      query = url.searchParams.get('q');
                  }

                  if (!query) {
                      //console.warn('[GoogleMaps] Impossible d\'extraire la localisation');
                      return null;
                  }

                  const classicEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=${mapType}&z=15&output=embed`;
                  
                  container.innerHTML = `<iframe class="iframe-embed iframe-google-maps" src="${classicEmbedUrl}" frameborder="0" allowfullscreen loading="lazy" title="Carte Google Maps intégrée"></iframe>`;

                  return container;

              } catch (e) {
                  console.error('[GoogleMaps] Erreur:', e);
                  return null;
              }
          }
        },
        {
          name: 'AppleMusic',
          selector: 'a[href*="music.apple.com/"]',
          category: 'base',
          createEmbedElement(link) {
              try {
                  const url = new URL(link.href);
                  if (!/\/(album|playlist|station|artist)\//.test(url.pathname)) {
                      return null;
                  }

                  const embedUrl = url.href.replace(
                      'music.apple.com',
                      'embed.music.apple.com'
                  );

                  const isSong = url.searchParams.has('i');
                  const height = isSong ? '175' : '450';

                  const container = createSafeDiv();
                  container.className = 'bloc-embed';
                  container.innerHTML = `<iframe
                      class="iframe-embed"
                      src="${embedUrl}"
                      style="height: ${height}px;"
                      frameborder="0"
                      allowfullscreen
                      sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                      allow="autoplay *; encrypted-media *; fullscreen *"
                      loading="lazy"
                      title="Lecteur Apple Music intégré">
                  </iframe>`;

                  return container;

              } catch (e) {
                  console.error('[AppleMusic] Erreur lors de la création de l\'embed :', e);
                  return null;
              }
          }
        },
        {
          name: 'DeviantArt',
          selector: 'a[href*="deviantart.com/"][href*="/art/"]',
          category: 'connect',
          connect: ['backend.deviantart.com', 'www.deviantart.com'],
          async createEmbedElement(link) {
              try {
                  let normalizedUrl = link.href;
                  const originalUrl = new URL(link.href);
                  if (originalUrl.hostname !== 'www.deviantart.com') {
                      try {
                          const response = await LecteurMedia.compatibleHttpRequest({
                              method: 'HEAD',
                              url: link.href
                          });
                          normalizedUrl = response.finalUrl || link.href;
                      } catch (e) {
                          console.warn('[DeviantArt] La résolution du lien a échoué. On continue avec l\'URL originale.', e);
                          normalizedUrl = link.href;
                      }
                  }

                  const apiUrl = `https://backend.deviantart.com/oembed?url=${encodeURIComponent(normalizedUrl)}`;
                  const response = await LecteurMedia.compatibleHttpRequest({
                      method: 'GET',
                      url: apiUrl
                  });

                  if (response.status < 200 || response.status >= 300) {
                      throw new Error(`L'API DeviantArt a retourné le statut ${response.status}`);
                  }

                  const data = JSON.parse(response.responseText);
                  const imageUrl = data.url || data.thumbnail_url;

                  if (imageUrl) {
                      const container = createSafeDiv();
                      container.className = 'bloc-embed';
                      container.innerHTML = `<img src="${sanitizeUrl(imageUrl)}" class="image-embed" alt="${escapeHTML(data.title) || 'Art depuis DeviantArt'}" loading="lazy">`;
                      return container;
                  } else {
                      console.warn('[DeviantArt] Aucune URL d\'image trouvée dans la réponse de l\'API pour :', normalizedUrl);
                      return null;
                  }

              } catch (error) {
                  console.error('[DeviantArt] Erreur lors de la création de l\'embed :', error);
                  return null;
              }
          }
        },
        {
            name: 'Pinterest',
            selector: 'a[href*="pinterest."][href*="/pin/"]',
            scriptPromise: null,
            category: 'base',
            loadScript() {
                if (!this.scriptPromise) {
                    this.scriptPromise = new Promise((resolve, reject) => {
                        if (window.PinUtils) return resolve();
                        const script = document.createElement('script');
                        script.async = true;
                        script.defer = true;
                        script.src = 'https://assets.pinterest.com/js/pinit.js';
                        script.onload = resolve;
                        script.onerror = () => reject(new Error('Failed to load Pinterest script'));
                        document.head.appendChild(script);
                    });
                }
                return this.scriptPromise;
            },
            createEmbedElement(link) {
                const match = link.href.match(/\/pin\/(\d+)\/?/);
                if (!match || !match[1]) {
                    console.warn('[Pinterest] Impossible d\'extraire l\'ID du Pin depuis :', link.href);
                    return null;
                }
                const pinId = match[1];
                const canonicalUrl = `https://www.pinterest.com/pin/${pinId}/`;

                const container = createSafeDiv();
                container.className = 'bloc-embed';

                const pinEmbed = document.createElement('a');
                pinEmbed.href = canonicalUrl;
                pinEmbed.setAttribute('data-pin-do', 'embedPin');
                pinEmbed.setAttribute('data-pin-width', 'large');
                pinEmbed.setAttribute('data-pin-terse', 'true');

                container.appendChild(pinEmbed);
                return container;
            },
            postProcess() {
                this.loadScript().then(() => {
                    if (window.PinUtils && typeof window.PinUtils.build === 'function') {
                        window.PinUtils.build();
                    }
                }).catch(error => {
                    console.error('[Pinterest] Erreur lors du chargement ou de l\'exécution du script :', error);
                });
            }
        },
        {
          name: 'ImageShack',
          selector: 'a[href*="imageshack.com/i/"]',
          category: 'base',
          createEmbedElement(link) {
              try {
                  const url = new URL(link.href);
                  const pathParts = url.pathname.split('/').filter(p => p);

                  if (pathParts.length !== 2 || pathParts[0] !== 'i' || !pathParts[1]) {
                      return null;
                  }
                  const imageId = pathParts[1];

                  if (imageId.length < 3) {
                      throw new Error("ID d'image ImageShack invalide.");
                  }

                  const base36Part = imageId.substring(0, 2);
                  let filePart = imageId.substring(2);

                  //  Convertir la première partie de base 36 en base 10
                  const serverFolder = parseInt(base36Part, 36);

                  if (isNaN(serverFolder)) {
                      throw new Error(`Échec de la conversion de '${base36Part}' depuis la base 36.`);
                  }

                  if (/[a-zA-Z]$/.test(filePart)) {
                       filePart = filePart.slice(0, -1);
                  }

                  // Le format est : https://imagizer.imageshack.com/v2/{transfo}/{dossier}/{fichier}.jpg
                  const transformationParam = 'xq70';
                  const imageUrl = `https://imagizer.imageshack.com/v2/${transformationParam}/${serverFolder}/${filePart}.jpg`;

                  const container = createSafeDiv();
                  container.className = 'bloc-embed';
                  container.innerHTML = `<img src="${imageUrl}" class="image-embed" alt="Image depuis ImageShack" loading="lazy">`;
                  return container;

              } catch (error) {
                  console.error(`[ImageShack] Erreur lors de la transformation de l'URL ${link.href}:`, error.message);
                  return null;
              }
          }
        },
        {
            name: 'Gofundme',
            selector: 'a[href*="gofundme.com/f/"]',
            category: 'base',
            createEmbedElement(link) {
                try {
                    const url = new URL(link.href);
                    if (!url.pathname.startsWith('/f/')) {
                        return null;
                    }
                    const cleanUrlPath = url.pathname;
                    const embedUrl = `https://www.gofundme.com${cleanUrlPath}/widget/large`;

                    const container = createSafeDiv();
                    container.className = 'bloc-embed';
                    container.innerHTML = `<iframe
                        src="${embedUrl}"
                        class="iframe-embed"
                        style="height: 620px; border-radius: 8px;"
                        title="Campagne Gofundme intégrée"
                        frameborder="0"
                        scrolling="no">
                    </iframe>`;

                    return container;

                } catch (e) {
                    console.error('[Gofundme] Erreur lors de la création de l\'embed :', e);
                    return null;
                }
        }
        },
        {
            name: 'Coub',
            selector: 'a[href*="coub.com/view/"]',
            category: 'base',
            createEmbedElement(link) {
                try {
                    const match = link.href.match(/view\/([a-zA-Z0-9]+)/);
                    if (!match || !match[1]) return null;

                    const videoId = match[1];
                    const iframeUrl = `https://coub.com/embed/${videoId}?muted=true&autostart=true&originalSize=false&startWithHD=true`;

                    const container = createSafeDiv();
                    container.className = 'bloc-embed';
                    container.innerHTML = `<iframe
                        src="${iframeUrl}"
                        class="iframe-embed iframe-youtube"
                        title="Coub Video"
                        allow="autoplay"
                        frameborder="0"
                        width="550"
                        height="310">
                    </iframe>`;
                    return container;

                } catch (e) {
                    console.error('[Coub] Erreur lors de la création de l\'embed :', e);
                    return null;
                }
            }
        },
        {
          name: 'Gyazo',
          selector: 'a[href^="https://_gyazo.com/"]',
          category: 'connect',
          connect: 'api.gyazo.com',
          async createEmbedElement(link) {
              if (link.hostname === 'i.gyazo.com' && /\.(jpe?g|png|gif|webp)$/i.test(link.pathname)) {
                  const container = createSafeDiv();
                  container.className = 'bloc-embed';
                  container.innerHTML = `<img src="${link.href}" class="image-embed" alt="Image depuis Gyazo" loading="lazy">`;
                  return container;
              }

              if (link.hostname === 'gyazo.com' && link.pathname.length > 1) {
                  try {
                      const response = await LecteurMedia.compatibleHttpRequest({
                          method: 'GET',
                          url: `https://api.gyazo.com/api/oembed?url=${encodeURIComponent(link.href)}`
                      });

                      if (response.status !== 200) {
                          throw new Error(`L'API Gyazo a retourné le statut ${response.status}`);
                      }

                      const data = JSON.parse(response.responseText);

                      if (data && data.url) {
                          const container = createSafeDiv();
                          container.className = 'bloc-embed';
                          container.innerHTML = `<img src="${sanitizeUrl(data.url)}" class="image-embed" alt="Image depuis Gyazo" loading="lazy">`;
                          return container;
                      }
                  } catch (error) {
                      console.error('[Gyazo] Erreur lors de la récupération de l\'embed :', error);
                      return null;
                  }
              }
              return null;
          }
        },
        {
          name: 'Codepen',
          selector: 'a[href*="codepen.io/"]',
          category: 'base',
          createEmbedElement(link) {
              if (!link.pathname.includes('/pen/')) return null;

              try {
                  const url = new URL(link.href);
                  url.pathname = url.pathname.replace('/pen/', '/embed/');
                  url.searchParams.set('default-tab', 'result');
                  url.searchParams.set('theme-id', 'dark');

                  const container = createSafeDiv();
                  container.className = 'bloc-embed';
                  container.innerHTML = `<iframe
                      src="${url.toString()}"
                      class="iframe-embed"
                      style="height: 450px; border: 1px solid #444;"
                      title="Codepen Embed"
                      scrolling="no"
                      frameborder="0"
                      loading="lazy"
                      allowtransparency="true"
                      allowfullscreen="true">
                  </iframe>`;
                  return container;

              } catch (e) {
                  console.error('[Codepen] Erreur lors de la création de l\'embed :', e);
                  return null;
              }
          }
        },
        {
            name: 'Pastebin',
            selector: 'a[href*="pastebin.com/"]',
            category: 'base',
            createEmbedElement(link) {
                try {
                    const url = new URL(link.href);
                    const pathParts = url.pathname.split('/').filter(p => p);
                    if (pathParts.length !== 1 || !/^[a-zA-Z0-9]{8}$/.test(pathParts[0])) {
                        return null;
                    }

                    const pasteId = pathParts[0];
                    const iframeUrl = `https://pastebin.com/embed_iframe/${pasteId}`;

                    const container = createSafeDiv();
                    container.className = 'bloc-embed';
                    container.innerHTML = `<iframe
                        src="${iframeUrl}"
                        class="iframe-embed"
                        style="height: 400px;"
                        title="Pastebin Embed"
                        sandbox="allow-scripts allow-same-origin"
                        frameborder="0">
                    </iframe>`;
                    return container;

                } catch (e) {
                    console.error('[Pastebin] Erreur lors de la création de l\'embed :', e);
                    return null;
                }
            }
        },
        {
          name: 'Postimages',
          selector: 'a[href*="postimg.cc/"]',
          category: 'connect',
          connect: 'postimg.cc',
          async createEmbedElement(link) {
              try {
                  const url = new URL(link.href);
                  if (url.hostname === 'postimg.cc' && url.pathname.startsWith('/image/')) {
                      const response = await LecteurMedia.compatibleHttpRequest({
                          method: 'GET',
                          url: link.href
                      });

                      if (response.status < 200 || response.status >= 300) {
                          throw new Error(`Le serveur de Postimages a retourné le statut ${response.status}`);
                      }

                      const pageHtml = response.responseText;

                      const doc = new DOMParser().parseFromString(pageHtml, 'text/html');
                      const imageUrl = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');

                      if (imageUrl) {
                          const container = createSafeDiv();
                          container.className = 'bloc-embed';
                          container.innerHTML = `<img src="${sanitizeUrl(imageUrl)}" class="image-embed" alt="Image depuis Postimages" loading="lazy">`;
                          return container;
                      }
                  }

                  return null;

              } catch (e) {
                  console.error('[Postimages] Erreur lors de la création de l\'embed :', e);
                  return null;
              }
          }
        },
        {
          name: 'ImgBB',
          selector: 'a[href*="ibb.co/"]',
          category: 'connect',
          connect: 'ibb.co',
          async createEmbedElement(link) {
              if (link.pathname.split('/').filter(p => p).length !== 1) {
                  return null;
              }

              try {
                  const response = await LecteurMedia.compatibleHttpRequest({
                      method: 'GET',
                      url: link.href
                  });

                  if (response.status < 200 || response.status >= 300) {
                      throw new Error(`Le serveur d'ImgBB a retourné le statut ${response.status}`);
                  }

                  const pageHtml = response.responseText;

                  const match = pageHtml.match(/<meta\s+property="og:image"\s+content="([^"]+)"/);
                  const imageUrl = match ? match[1] : null;

                  if (imageUrl) {
                      const container = createSafeDiv();
                      container.className = 'bloc-embed';
                      container.innerHTML = `<img src="${sanitizeUrl(imageUrl)}" class="image-embed" alt="Image depuis ImgBB" loading="lazy">`;
                      return container;
                  } else {
                      console.warn('[ImgBB] Impossible de trouver l\'URL de l\'image pour :', link.href);
                      return null;
                  }

              } catch (e) {
                  console.error('[ImgBB] Erreur lors de la création de l\'embed :', e);
                  return null;
              }
          }
        },
        {
          name: 'Sketchfab',
          selector: 'a[href*="sketchfab.com/3d-models/"], a[href*="sketchfab.com/models/"]',
          category: 'base',
          createEmbedElement(link) {
              try {
                  const url = new URL(link.href);
                  const modelMatch = url.href.match(/([a-f0-9]{32})/i);

                  if (modelMatch && modelMatch[1]) {
                      const modelId = modelMatch[1];
                      const iframeUrl = `https://sketchfab.com/models/${modelId}/embed`;

                      const container = createSafeDiv();
                      container.className = 'bloc-embed';
                      container.innerHTML = `<iframe
                          title="Modèle 3D Sketchfab"
                          class="iframe-embed iframe-youtube"
                          src="${sanitizeUrl(iframeUrl)}"
                          frameborder="0"
                          allow="autoplay; fullscreen; xr-spatial-tracking"
                          xr-spatial-tracking
                          execution-while-out-of-viewport
                          execution-while-not-rendered
                          web-share
                          allowfullscreen>
                      </iframe>`;
                      return container;
                  }

                  return null;

              } catch (e) {
                  console.error('[Sketchfab] Erreur lors de la création de l\'embed :', e);
                  return null;
              }
          }
        },
        {
          name: 'Steam',
          selector: 'a[href*="store.steampowered.com/app/"]',
          category: 'base',
          createEmbedElement(link) {
              try {
                  const match = link.href.match(/\/app\/(\d+)/);
                  if (!match || !match[1]) return null;

                  const appId = match[1];
                  const iframeUrl = `https://store.steampowered.com/widget/${appId}/`;

                  const container = createSafeDiv();
                  container.className = 'bloc-embed';
                  container.innerHTML = `<iframe
                      src="${iframeUrl}"
                      class="iframe-embed"
                      style="height: 190px; border-radius: 8px;"
                      title="Widget Steam"
                      frameborder="0">
                  </iframe>`;
                  return container;

              } catch (e) {
                  console.error('[Steam] Erreur lors de la création de l\'embed :', e);
                  return null;
              }
          }
        },
        {
          name: 'Bandcamp',
          selector: 'a[href*=".bandcamp.com/"]',
          category: 'connect',
          connect: '*.bandcamp.com',
          async createEmbedElement(link) {
              if (!link.pathname.includes('/track/') && !link.pathname.includes('/album/')) {
                  return null;
              }

              try {
                  const response = await LecteurMedia.compatibleHttpRequest({
                      method: 'GET',
                      url: link.href
                  });

                  if (response.status < 200 || response.status >= 300) {
                      throw new Error(`Le serveur de Bandcamp a retourné le statut ${response.status}`);
                  }

                  const pageHtml = response.responseText;

                  const doc = new DOMParser().parseFromString(pageHtml, "text/html");
                  const embedUrlMeta = doc.querySelector('meta[property="og:video"]');

                  if (!embedUrlMeta) {
                      console.warn('[Bandcamp] Meta tag "og:video" introuvable pour :', link.href);
                      return null;
                  }

                  let iframeUrl = embedUrlMeta.getAttribute('content');
                  if (!iframeUrl) return null;
                  if (!iframeUrl.endsWith('/')) iframeUrl += '/';
                  iframeUrl += 'transparent=true/';

                  const container = createSafeDiv();
                  container.className = 'bloc-embed';
                  container.innerHTML = `<iframe
                      style="border: 0; width: 100%; max-width: 550px; height: 120px;"
                      src="${sanitizeUrl(iframeUrl)}"
                      title="Lecteur Bandcamp"
                      seamless>
                  </iframe>`;

                  return container;

              } catch (error) {
                  console.error('[Bandcamp] Erreur lors de la création de l\'embed :', error);
                  return null;
              }
          }
        },
        {
            name: 'Flourish',
            selector: 'a[href*="public.flourish.studio/visualisation/"], a[href*="public.flourish.studio/story/"]',
            category: 'base',
            async createEmbedElement(link) {
                const match = link.href.match(/(visualisation|story)\/\d+/);

                if (!match || !match[0]) {
                    console.warn('[Flourish] Impossible d\'extraire l\'ID de la visualisation:', link.href);
                    return null;
                }

                const embedPath = match[0];
                const iframeUrl = `https://flo.uri.sh/${embedPath}/embed`;

                const container = createSafeDiv();
                container.className = 'bloc-embed';
                container.innerHTML = `<iframe
                    src="${iframeUrl}"
                    class="iframe-embed iframe-flourish"
                    title="Flourish Visualisation"
                    sandbox="allow-scripts allow-same-origin"
                    scrolling="no"
                ></iframe>`;

                return container;
            }
        },
        {
          name: 'DistroKid',
          selector: 'a[href*="distrokid.com/hyperfollow/"]',
          category: 'connect',
          connect: 'distrokid.com',
          async createEmbedElement(link) {
              const defaultAlbumArt = 'https://risibank.fr/cache/medias/0/5/532/53280/full.png';
              const hyperfollowUrl = link.href.split('?')[0];

              try {
                  const response = await LecteurMedia.compatibleHttpRequest({
                      method: 'GET',
                      url: hyperfollowUrl,
                      headers: {
                          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/5.37.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
                      }
                  });

                  if (response.status < 200 || response.status >= 300) {
                      throw new Error(`Le serveur de DistroKid a retourné le statut ${response.status}`);
                  }

                  const responseText = response.responseText;

                  let audioUrl = null;
                  const audioTagMatch = responseText.match(/<audio[^>]+src="([^"]+)"/);
                  if (audioTagMatch && audioTagMatch[1]) {
                      audioUrl = audioTagMatch[1];
                  } else {
                      const jsonDataMatch = responseText.match(/previewData\.tracks\s*=\s*JSON\.parse\(\s*"(.+?)"\s*\);/);
                      if (jsonDataMatch && jsonDataMatch[1]) {
                          const rawJson = jsonDataMatch[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\'); 
                          const tracks = JSON.parse(rawJson);
                          if (tracks && tracks.length > 0) audioUrl = tracks[0].preview;
                      }
                  }

                  if (!audioUrl) {
                      console.warn('[DistroKid] Impossible de trouver un lien audio pour :', hyperfollowUrl);
                      return null;
                  }

                  const titleMatch = responseText.match(/<title[^>]*>([^<]+) by ([^<]+) - DistroKid<\/title>/);
                  const trackTitle = titleMatch ? titleMatch[1] : 'Titre inconnu';
                  const artistName = titleMatch ? titleMatch[2] : 'Artiste inconnu';

                  let albumArtUrl = defaultAlbumArt;
                  const bodyArtMatch = responseText.match(/<img[^>]+class="artCover[^"]+"[^>]+src="([^"]+)"/);
                  if (bodyArtMatch && bodyArtMatch[1]) {
                      albumArtUrl = bodyArtMatch[1];
                  }

                  const container = createSafeDiv();
                  container.className = 'bloc-embed';

                  container.innerHTML = `
                    <a href="${hyperfollowUrl}" target="_blank" rel="noopener noreferrer" class="distrokid-embed-card">
                        <div class="distrokid-album-art" style="background-image: url('${albumArtUrl}');"></div>
                        <div class="distrokid-content">
                            <div>
                                <div class="distrokid-title">${escapeHTML(trackTitle)}</div>
                                <div class="distrokid-artist">${escapeHTML(artistName)}</div>
                            </div>
                            <audio src="${audioUrl}" controls preload="metadata"></audio>
                        </div>
                    </a>
                  `;

                  return container;

              } catch (error) {
                  console.error('[DistroKid] Erreur lors de la création de l\'embed :', error);
                  return null;
              }
          }
        },
        {
          name: 'Discord',
          selector: 'a[href*="discord.gg/"], a[href*="discord.com/invite/"]',
          category: 'connect',
          connect: 'discord.com',
          async createEmbedElement(link) {
              const inviteCodeMatch = link.href.match(/(?:discord\.gg|discord\.com\/invite)\/([a-zA-Z0-9]+)/);
              if (!inviteCodeMatch || !inviteCodeMatch[1]) return null;

              const inviteCode = inviteCodeMatch[1];
              const uniqueId = `discord-invite-${inviteCode}-${Math.random().toString(36).substring(2, 9)}`;
              const placeholderContainer = createSafeDiv();
              placeholderContainer.className = 'bloc-embed';
              placeholderContainer.innerHTML = `<div id="${uniqueId}" class="iframe-embed discord-loading-placeholder">Chargement de l'invitation Discord...</div>`;

              setTimeout(async () => {
                  try {
                      const response = await LecteurMedia.compatibleHttpRequest({
                          method: "GET",
                          url: `https://discord.com/api/v9/invites/${inviteCode}?with_counts=true`
                      });

                      if (response.status !== 200) {
                          throw new Error(`L'API Discord a retourné le statut ${response.status}`);
                      }

                      const placeholder = document.getElementById(uniqueId);
                      if (!placeholder) return;

                      if (response.status !== 200) {
                          placeholder.outerHTML = `<div class="placeholder-embed discord-error-placeholder">Invitation invalide ou expirée.</div>`;
                          return;
                      }

                      const data = JSON.parse(response.responseText);
                      const guild = data.guild;

                      if (!guild || !guild.name) {
                          placeholder.outerHTML = `<div class="placeholder-embed discord-error-placeholder">Invitation invalide ou expirée.</div>`;
                          return;
                      }

                      const iconUrl = guild.icon
                          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128`
                          : 'https://cdn.discordapp.com/embed/avatars/0.png';

                      const isVerified = guild.features.includes('VERIFIED');
                      const isPartnered = guild.features.includes('PARTNERED');

                      let badgeHtml = '';
                      if (isVerified) {
                          badgeHtml = '<span class="discord-badge discord-verified-badge" title="Serveur vérifié"><svg width="16" height="16" viewBox="0 0 16 15.2"><path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" fill="currentColor"></path></svg></span>';
                      } else if (isPartnered) {
                          badgeHtml = '<span class="discord-badge discord-partnered-badge" title="Serveur partenaire de Discord"><svg width="16" height="16" viewBox="0 0 1000 1000"><path d="M833 361.3c0-9.8-3.1-19.5-9.4-27.6L600.2 65.1c-14-18.4-36.8-29.2-61-29.2H215.8c-24.2 0-47 10.8-61 29.2L31.3 333.7c-6.2 8.1-9.4 17.8-9.4 27.6v523.2c0 24.2 19.6 43.8 43.8 43.8h754.6c24.2 0 43.8-19.6 43.8-43.8V361.3zm-106.6 96.8l-96.8 96.8c-12.2 12.2-32 12.2-44.2 0l-96.8-96.8c-12.2-12.2-12.2-32 0-44.2l96.8-96.8c12.2-12.2 32-12.2 44.2 0l96.8 96.8c12.2 12.2 12.2 32 0 44.2zM379.8 458.1l-96.8 96.8c-12.2 12.2-32 12.2-44.2 0l-96.8-96.8c-12.2-12.2-12.2-32 0-44.2l96.8-96.8c12.2-12.2 32-12.2 44.2 0l96.8 96.8c12.2 12.2 12.2 32 0 44.2z" fill="currentColor"></path></svg></span>';
                      }

                      const cardHtml = `
                        <div class="discord-invite-card">
                            <div class="discord-header">
                                <img src="${iconUrl}" alt="Icône du serveur" class="discord-server-icon">
                                <div class="discord-server-info">
                                    <div class="discord-server-name">
                                        <span>${escapeHTML(guild.name)}</span>
                                        ${badgeHtml}
                                    </div>
                                    <div class="discord-member-counts">
                                        <span class="discord-status-dot discord-online"></span>
                                        <span class="discord-count">${data.approximate_presence_count.toLocaleString('fr-FR')} en ligne</span>
                                        <span class="discord-status-dot discord-offline"></span>
                                        <span class="discord-count">${data.approximate_member_count.toLocaleString('fr-FR')} membres</span>
                                    </div>
                                </div>
                            </div>
                            <a href="${link.href}" target="_blank" rel="noopener noreferrer" class="discord-join-button">Rejoindre</a>
                        </div>
                      `;
                      placeholder.outerHTML = cardHtml;

                  } catch (error) {
                      console.error('[Discord] Erreur lors de la création de l\'embed :', error);
                      const placeholder = document.getElementById(uniqueId);
                      if (placeholder) {
                          placeholder.outerHTML = `<div class="placeholder-embed discord-error-placeholder">Impossible de charger l'invitation.</div>`;
                      }
                  }
              }, 0);

              return placeholderContainer;
          }
        },
        {
          name: 'StackOverflow',
          selector: 'a[href*="stackoverflow.com/questions/"]',
          category: 'connect',
          connect: 'api.stackexchange.com',
          async createEmbedElement(link) {
              const questionIdMatch = link.href.match(/\/questions\/(\d+)/);
              if (!questionIdMatch || !questionIdMatch[1]) return null;

              const questionId = questionIdMatch[1];
              const uniqueId = `so-embed-${questionId}-${Math.random().toString(36).substring(2, 9)}`;

              const placeholder = createSafeDiv();
              placeholder.className = 'bloc-embed';
              placeholder.innerHTML = `<div id="${uniqueId}" class="so-embed-wrapper" style="padding: 20px; text-align: center;">Chargement de la réponse Stack Overflow...</div>`;

              (async () => {
                  try {
                      const apiUrl = `https://api.stackexchange.com/2.3/questions/${questionId}/answers?order=desc&sort=votes&site=stackoverflow&filter=withbody`;

                      const answersResponse = await LecteurMedia.compatibleHttpRequest({
                          method: 'GET',
                          url: apiUrl
                      });

                      if (answersResponse.status !== 200) {
                          throw new Error(`L'API Stack Exchange (réponses) a retourné le statut ${answersResponse.status}`);
                      }
                      const data = JSON.parse(answersResponse.responseText);

                      if (!data.items || data.items.length === 0) {
                          throw new Error("Aucune réponse trouvée pour cette question.");
                      }

                      // On cherche la réponse acceptée, sinon on prend la plus votée (la première de la liste)
                      const answer = data.items.find(item => item.is_accepted) || data.items[0];

                      const questionApiUrl = `https://api.stackexchange.com/2.3/questions/${questionId}?site=stackoverflow`;
                      const questionResponse = await LecteurMedia.compatibleHttpRequest({
                          method: 'GET',
                          url: questionApiUrl
                      });

                      if (questionResponse.status !== 200) {
                          throw new Error(`L'API Stack Exchange (question) a retourné le statut ${questionResponse.status}`);
                      }

                      const questionData = JSON.parse(questionResponse.responseText);
                      const questionTitle = questionData.items[0]?.title || "Question Stack Overflow";
                      const safeTitle = escapeHTML(questionTitle);

                      const scoreClass = answer.score < 0 ? 'so-score-negative' : '';

                      const embedHTML = `
                          <div class="so-embed-wrapper">
                              <div class="so-question-header">
                                  <a href="${link.href}" target="_blank" rel="noopener noreferrer">${safeTitle}</a>
                              </div>
                              <div class="so-answer-body">${safeHTML(answer.body)}</div>
                              <div class="so-footer">
                                  <div class="so-score ${scoreClass}">
                                      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18"><path d="M1 12h16L9 4l-8 8Z" fill="currentColor"></path></svg>
                                      <span>${answer.score.toLocaleString('fr-FR')}</span>
                                  </div>
                                  <div class="so-author">
                                      Réponse par ${escapeHTML(answer.owner.display_name)}
                                  </div>
                              </div>
                          </div>
                      `;

                      const targetElement = document.getElementById(uniqueId);
                      if (targetElement) {
                          targetElement.parentElement.innerHTML = embedHTML;
                      }

                  } catch (error) {
                      console.error('[StackOverflow] Erreur:', error);
                      const targetElement = document.getElementById(uniqueId);
                      if (targetElement) {
                          targetElement.textContent = "Impossible de charger la réponse.";
                      }
                  }
              })();

              return placeholder;
          }
        },
        {
            name: 'GoogleSupport',
            selector: 'a[href*="support.google.com/"]',
            category: 'connect',
            connect: 'support.google.com',
            async createEmbedElement(link) {
                // Squelette de chargement
                const container = createSafeDiv();
                container.className = 'bloc-embed';
                container.innerHTML = `
                    <div class="google-support-card skeleton-card">
                        <div class="skeleton-content">
                            <div class="skeleton-line title" style="width: 40px; height: 40px; border-radius:50%; margin-bottom:10px;"></div>
                            <div class="skeleton-line title" style="width: 70%;"></div>
                            <div class="skeleton-line text"></div>
                        </div>
                    </div>`;

                try {
                    const response = await LecteurMedia.compatibleHttpRequest({
                        method: 'GET',
                        url: link.href
                    });

                    if (response.status >= 200 && response.status < 300) {
                        const doc = new DOMParser().parseFromString(response.responseText, 'text/html');

                        const rawTitle = doc.querySelector('meta[property="og:title"]')?.content || doc.title || "Support Google";
                        let description = doc.querySelector('meta[name="description"]')?.content || "";
                        
                        let title = rawTitle;
                        let productName = "Aide Google";
                        
                        const separator = " - "; 
                        if (rawTitle.includes(separator)) {
                            const parts = rawTitle.split(separator);
                            const potentialProduct = parts[parts.length - 1];
                            
                            if (potentialProduct.includes('Aide') || potentialProduct.includes('Help') || potentialProduct.includes('Support')) {
                                productName = parts.pop();
                                title = parts.join(separator);
                            }
                        }
                        
                        title = escapeHTML(title);
                        description = escapeHTML(description);
                        productName = escapeHTML(productName);

                        const googleIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="32px" height="32px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>`;

                        container.innerHTML = `
                            <a href="${link.href}" target="_blank" class="google-support-card" style="text-decoration:none;">
                                <div class="gs-header">
                                    <div class="gs-icon-wrapper">${googleIcon}</div>
                                    <div class="gs-product-name">${productName}</div>
                                </div>
                                <div class="gs-body">
                                    <div class="gs-title">${title}</div>
                                    <div class="gs-desc">${description}</div>
                                </div>
                                <div class="gs-footer">
                                    <span>Consulter l'article officiel</span>
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                                </div>
                            </a>
                        `;
                        return container;
                    }
                } catch (e) {
                    console.error("[GoogleSupport] Erreur:", e);
                }
                return null;
            }
        },
        {
            name: 'GoogleTrends',
            selector: 'a[href*="trends.google."][href*="/explore"]',
            category: 'base',
            connect: ['trends.google.com', 'ssl.gstatic.com'], 
            createEmbedElement(link) {
                try {
                    const url = new URL(link.href);
                    const params = new URLSearchParams(url.search);
                    
                    const q = params.get('q');
                    if (!q) return null;

                    const geo = params.get('geo') || '';
                    const dateRaw = params.get('date') || 'today 12-m';

                    const keywords = decodeURIComponent(q).split(',').map(k => k.trim()).filter(k => k);
                    if (keywords.length === 0) return null;

                    // Configuration des données
                    const comparisonItems = keywords.map(kw => ({
                        keyword: kw,
                        geo: geo,
                        time: dateRaw
                    }));

                    const reqConfig = {
                        comparisonItem: comparisonItems,
                        category: 0,
                        property: ""
                    };

                    const options = {
                        "exploreQuery": `date=${encodeURIComponent(dateRaw)}&geo=${geo}&q=${encodeURIComponent(q)}`,
                        "guestPath": "https://trends.google.com:443/trends/embed/"
                    };

                    // Création du conteneur
                    const container = createSafeDiv();
                    container.className = 'bloc-embed';
                    container.style.backgroundColor = 'white'; 
                    container.style.borderRadius = '12px';
                    container.style.padding = '5px';
                    const uniqueId = 'trends-widget-' + Math.random().toString(36).substr(2, 9);
                    container.id = uniqueId;

                    const renderWidget = () => {
                        const w = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
                        
                        if (w.trends && w.trends.embed && w.trends.embed.renderExploreWidgetTo) {
                            w.trends.embed.renderExploreWidgetTo(
                                container, 
                                "TIMESERIES", 
                                reqConfig, 
                                options
                            );
                        }
                    };

                    const scriptUrl = 'https://ssl.gstatic.com/trends_nrtr/3728_RC01/embed_loader.js';
                    
                    if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
                        const script = document.createElement('script');
                        script.src = scriptUrl;
                        script.async = true;
                        script.onload = renderWidget;
                        document.head.appendChild(script);
                    } else {
                        const checkInterval = setInterval(() => {
                            const w = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
                            if (w.trends) {
                                clearInterval(checkInterval);
                                renderWidget();
                            }
                        }, 100);
                        
                        setTimeout(() => clearInterval(checkInterval), 5000);
                    }

                    return container;

                } catch (e) {
                    console.error('[GoogleTrends] Erreur:', e);
                    return null;
                }
            }
        },
        {
            name: 'OpenStreetMap',
            selector: 'a[href*="openstreetmap.org"]',
            category: 'base',
            createEmbedElement(link) {
                try {
                    const url = new URL(link.href);
                    let lat, lon, zoom;
                    
                    const hashMatch = url.hash.match(/map=(\d+)\/(-?\d+\.?\d*)\/(-?\d+\.?\d*)/);
                    if (hashMatch) {
                        zoom = parseInt(hashMatch[1], 10);
                        lat = parseFloat(hashMatch[2]);
                        lon = parseFloat(hashMatch[3]);
                    } 
                    else {
                        if (url.searchParams.has('lat') && url.searchParams.has('lon')) {
                            lat = parseFloat(url.searchParams.get('lat'));
                            lon = parseFloat(url.searchParams.get('lon'));
                            zoom = parseInt(url.searchParams.get('zoom')) || 15; 
                        }
                    }

                    if (!lat || !lon) return null;

                    const mLat = url.searchParams.get('mlat');
                    const mLon = url.searchParams.get('mlon');
                    const hasMarker = mLat && mLon;

                    // L'export Embed d'OSM ne prend pas "centre + zoom", il veut "minLon,minLat,maxLon,maxLat".
                    const zoomFactor = 360 / Math.pow(2, zoom);
                    
                    const latOffset = zoomFactor * 0.2; // Hauteur
                    const lonOffset = zoomFactor * 0.5; // Largeur

                    const bbox = [
                        lon - lonOffset, // Ouest
                        lat - latOffset, // Sud
                        lon + lonOffset, // Est
                        lat + latOffset  // Nord
                    ].join(',');

                    let embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;

                    if (hasMarker) {
                        embedUrl += `&marker=${mLat},${mLon}`;
                    }

                    const container = createSafeDiv();
                    container.className = 'bloc-embed';
                    
                    container.innerHTML = `<iframe
                        class="iframe-embed iframe-google-maps"
                        src="${embedUrl}"
                        frameborder="0"
                        scrolling="no"
                        marginheight="0"
                        marginwidth="0"
                        title="OpenStreetMap">
                    </iframe>`;

                    return container;

                } catch (e) {
                    console.error('[OpenStreetMap] Erreur:', e);
                    return null;
                }
            }
        },
        {
            name: 'Bluesky',
            selector: 'a[href*="_bsky.app/profile/"][href*="/post/"]',
            category: 'connect',
            connect: ['_bsky.app', '_embed.bsky.app'],
            async createEmbedElement(link) {
                try {
                    const url = new URL(link.href);
                    if (!url.pathname.includes('/post/')) return null;

                    const oembedApiUrl = `https://embed.bsky.app/oembed?url=${encodeURIComponent(link.href)}&maxwidth=550`;

                    const response = await LecteurMedia.compatibleHttpRequest({
                        method: 'GET',
                        url: oembedApiUrl
                    });

                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        
                        if (!data.html) return null;

                        const container = createSafeDiv();
                        container.className = 'bloc-embed';
                        
                        container.innerHTML = data.html;
                        const scriptUrl = 'https://embed.bsky.app/static/embed.js';
                        if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
                            const script = document.createElement('script');
                            script.src = scriptUrl;
                            script.async = true;
                            script.charset = 'utf-8';
                            document.body.appendChild(script);
                        } else {
                            if (window.bluesky && window.bluesky.scan) {
                                window.bluesky.scan();
                            }
                        }
                        
                        return container;
                    }
                } catch (e) {
                    console.error('[Bluesky] Erreur:', e);
                }
                return null;
            }
        },
        {
            name: 'Odysee',
            selector: 'a[href*="odysee.com/"]',
            category: 'base',
            createEmbedElement(link) {
                try {
                    const url = new URL(link.href);
                    const path = url.pathname; 
                    if(path.length < 2) return null;

                    const cleanPath = path.replace(/^\//, '');
                    const embedUrl = `https://odysee.com/$/embed/${cleanPath}`; 
                    
                    const container = createSafeDiv();
                    container.className = 'bloc-embed';
                    container.innerHTML = `<iframe 
                        src="${embedUrl}" 
                        class="iframe-embed iframe-youtube" 
                        allowfullscreen>
                    </iframe>`;
                    return container;
                } catch(e) { return null; }
            }
        },
        {
            name: 'TwitterDirectVideo',
            selector: 'a[href*="video.twimg.com"]',
            category: 'connect',
            connect: ['video.twimg.com', 'twitter.com'], 
            createEmbedElement(link) {
                const targetUrl = link.href;
                const safeSrc = sanitizeUrl(targetUrl);
                
                const container = createSafeDiv();
                container.className = 'bloc-embed';
                
                const wrapper = createSafeDiv();
                wrapper.className = 'twimg-direct-wrapper';

                wrapper.style.width = '100%';
                wrapper.style.margin = '0 auto';
                wrapper.style.display = 'block';
                
                container.appendChild(wrapper);

                let vidW = 0, vidH = 0;
                const resolutionMatch = targetUrl.match(/\/(\d+)x(\d+)\//);
                if (resolutionMatch) {
                    vidW = parseInt(resolutionMatch[1]);
                    vidH = parseInt(resolutionMatch[2]);
                }

                const triggerStep3_Blob = () => {
                    console.log("[TwitterDirect] Passage au Blob...");
                    
                    // Loader
                    wrapper.innerHTML = `
                        <div style="background:#000; color: white; font-family: sans-serif; font-size: 13px; display: flex; flex-direction: column; align-items: center; justify-content:center; gap: 10px; height:200px; border-radius:8px;">
                            <div class="lm-spinner" style="border-top-color: #1d9bf0;"></div>
                            <span>Récupération fichier... <span class="percent">0%</span></span>
                        </div>
                    `;

                    if (vidW && vidH) {
                         const ratio = vidW / vidH;
                         const maxWidth = Math.floor(550 * ratio);
                         wrapper.style.cssText = `aspect-ratio: ${vidW}/${vidH}; max-height: 550px; max-width: ${maxWidth}px; width: 100%; margin: 0 auto; display: block;`;
                    }

                    GM.xmlHttpRequest({
                        method: "GET",
                        url: targetUrl,
                        responseType: "blob",
                        headers: { "Referer": "https://twitter.com/", "Origin": "https://twitter.com" },
                        onprogress: (evt) => {
                            if (evt.lengthComputable) {
                                const percent = Math.floor((evt.loaded / evt.total) * 100);
                                const pSpan = wrapper.querySelector('.percent');
                                if (pSpan) pSpan.textContent = percent + '%';
                            }
                        },
                        onload: (response) => {
                            if (response.status === 200) {
                                const blobUrl = URL.createObjectURL(response.response);
                                wrapper.innerHTML = '';
                                
                                wrapper.style.cssText = 'width:100%; height:auto; background:transparent; display:block; aspect-ratio:unset;';
                                
                                const video = document.createElement('video');
                                video.src = blobUrl;
                                video.className = 'video-embed';
                                video.controls = true;
                                video.loop = true;
                                video.playsInline = true;
                                
                                video.style.cssText = 'width:100%; height:auto; max-height:550px; display:block; margin: 0 auto;';
                                
                                wrapper.appendChild(video);
                            } else {
                                container.innerHTML = '<div class="dead-link-sticker"><span>[Erreur téléchargement Twitter]</span></div>';
                            }
                        },
                        onerror: () => {
                            container.innerHTML = '<div class="dead-link-sticker"><span>[Erreur réseau Twitter]</span></div>';
                        }
                    });
                };

                const triggerStep2_Iframe = () => {
                    console.log("[TwitterDirect] Passage à l'Iframe...");
                    wrapper.innerHTML = '';
                    
                    if (vidW && vidH) {
                        const ratio = vidW / vidH;
                        const maxWidth = Math.floor(550 * ratio);
                        
                        wrapper.style.cssText = `
                            width: 100%;
                            max-width: ${maxWidth}px;
                            aspect-ratio: ${vidW}/${vidH};
                            max-height: 550px;
                            margin: 0 auto;
                            display: block;
                            background-color: #000;
                            border-radius: 8px;
                            overflow: hidden;
                        `;
                    } else {
                        wrapper.style.height = '400px'; 
                        wrapper.style.backgroundColor = '#000';
                        wrapper.style.borderRadius = '8px';
                        wrapper.style.overflow = 'hidden';
                    }

                    const iframe = document.createElement('iframe');
                    iframe.style.cssText = "width:100%; height:100%; border:none;";
                    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
                    
                    const uniqueMsgId = "tw_direct_" + Math.random().toString(36).substr(2, 9);
                    
                    const htmlContent = `
                        <html>
                        <head>
                            <meta name="referrer" content="no-referrer">
                            <style>
                                body { margin:0; background:black; display:flex; align-items:center; justify-content:center; height:100%; overflow:hidden; }
                                video { width:100%; height:100%; object-fit:contain; outline:none; }
                            </style>
                        </head>
                        <body>
                            <video controls autoplay playsinline loop>
                                <source src="${safeSrc}" type="video/mp4">
                            </video>
                            <script>
                                const v = document.querySelector('video');
                                v.addEventListener('error', () => {
                                    window.parent.postMessage({ type: 'TW_DIRECT_ERROR', id: '${uniqueMsgId}' }, '*');
                                });
                                v.focus();
                            </script>
                        </body>
                        </html>
                    `;

                    const messageHandler = (e) => {
                        if (e.data && e.data.type === 'TW_DIRECT_ERROR' && e.data.id === uniqueMsgId) {
                            window.removeEventListener('message', messageHandler);
                            wrapper.style.aspectRatio = '';
                            wrapper.style.backgroundColor = 'transparent';
                            triggerStep3_Blob();
                        }
                    };
                    window.addEventListener('message', messageHandler);
                    
                    iframe.srcdoc = htmlContent;
                    wrapper.appendChild(iframe);
                };

                const video = document.createElement('video');
                video.src = safeSrc;
                video.className = 'video-embed';
                video.controls = true;
                video.muted = false; 
                video.loop = true;
                video.playsInline = true;
                
                video.style.width = '100%';
                video.style.height = 'auto';
                video.style.maxHeight = '550px';
                video.referrerPolicy = "no-referrer"; 

                video.onerror = (e) => {
                    console.log("[TwitterDirect] Erreur Native. -> Iframe");
                    triggerStep2_Iframe();
                };

                wrapper.appendChild(video);

                return container;
            }
        },
        {
            name: 'RadioFM',
            selector: `
                a[href*=".fm/"], a[href$=".fm"], 
                a[href$="skyrock.com"], a[href$="skyrock.com/"], a[href*="skyrock.com"][href*="live"],
                a[href$="nrj.fr"], a[href$="nrj.fr/"], a[href*="nrj.fr"][href*="direct"], a[href*="nrj.fr"][href*="player"],
                a[href$="funradio.fr"], a[href$="funradio.fr/"], a[href*="funradio.fr"][href*="direct"],
                a[href$="rtl.fr"], a[href$="rtl.fr/"], a[href*="rtl.fr"][href*="direct"],
                a[href$="rtl2.fr"], a[href$="rtl2.fr/"], a[href*="rtl2.fr"][href*="direct"],
                a[href$="europe1.fr"], a[href$="europe1.fr/"], a[href*="europe1.fr"][href*="direct"], a[href*="europe1.fr"][href*="ecouter"],
                a[href$="europe2.fr"], a[href$="europe2.fr/"], a[href*="europe2.fr"][href*="direct"],
                a[href$="rfm.fr"], a[href$="rfm.fr/"], a[href*="rfm.fr"][href*="direct"],
                a[href*="rmc.bfmtv.com"],
                a[href$="nostalgie.fr"], a[href$="nostalgie.fr/"], a[href*="nostalgie.fr"][href*="direct"],
                a[href$="rireetchansons.fr"], a[href$="rireetchansons.fr/"], a[href*="rireetchansons.fr"][href*="direct"],
                a[href$="cheriefm.fr"], a[href$="cheriefm.fr/"], a[href*="cheriefm.fr"][href*="direct"],
                a[href$="mouv.fr"], a[href$="mouv.fr/"], a[href*="mouv.fr"][href*="direct"],
                a[href$="franceinter.fr"], a[href$="franceinter.fr/"], a[href*="franceinter.fr"][href*="direct"],
                a[href$="fip.fr"], a[href$="fip.fr/"], a[href*="fip.fr"][href*="direct"]
            `,
            category: 'base',
            createEmbedElement(link) {
                const url = new URL(link.href);
                let hostname = url.hostname.replace(/^www\./, '');
                const pathname = url.pathname;

                if (/\.(jpg|jpeg|png|gif|webp|mp4|webm)$/i.test(pathname)) {
                    return null;
                }

               const pathSegments = url.pathname.split('/').filter(p => p);
                const isDeepLink = pathSegments.length > 2; 

                const isPlayerUrl = /live|direct|player|ecouter|audio/i.test(url.href);

                if (isDeepLink && !isPlayerUrl) {
                    return null;
                }

                const streamMap = {
                    'skyrock.fm': 'https://icecast.skyrock.net/s/natio_mp3_128k',
                    'skyrock.com': 'https://icecast.skyrock.net/s/natio_mp3_128k',
                    'nrj.fr': 'https://streaming.nrjaudio.fm/oumvmk8fnozc?origine=fluxradios',
                    'nrj.fm': 'https://streaming.nrjaudio.fm/oumvmk8fnozc?origine=fluxradios',
                    'nostalgie.fr': 'https://streaming.nrjaudio.fm/oug7girb92oc?origine=fluxradios',
                    'rireetchansons.fr': 'https://streaming.nrjaudio.fm/ou8viwgk7oiu?origine=fluxradios',
                    'cheriefm.fr': 'https://streaming.nrjaudio.fm/ouq58vyoeo8p?origine=fluxradios&aw_0_1st.station=CHERIE-Francais-2000',
                    'funradio.fr': 'http://icecast.funradio.fr/fun-1-44-128?listen=webCwsBCggNCQgLDQUGBAcGBg',
                    'rtl.fr': 'https://icecast.rtl.fr/rtl-1-44-128?listen=webCdn',
                    'rtl2.fr': 'https://icecast.rtl2.fr/rtl2-1-44-128?listen=webCdn',
                    'europe1.fr': 'https://stream.europe1.fr/europe1.mp3',
                    'europe2.fr': 'http://europe2.lmn.fm/europe2.mp3',
                    'rfm.fr': 'https://stream.rfm.fr/rfm.mp3',
                    'rmc.bfmtv.com': 'https://audio.bfmtv.com/rmcradio_128.mp3', 
                    'mouv.fr': 'https://icecast.radiofrance.fr/mouv-midfi.mp3',
                    'franceinter.fr': 'https://icecast.radiofrance.fr/franceinter-midfi.mp3',
                    'fip.fr': 'https://icecast.radiofrance.fr/fip-midfi.mp3'
                };
                
                let streamUrl = null;
                let matchedDomain = hostname;

                for (const [domain, stream] of Object.entries(streamMap)) {
                    if (hostname.includes(domain)) {
                        streamUrl = stream;
                        matchedDomain = domain; 
                        break;
                    }
                }

                const container = createSafeDiv();
                container.className = 'bloc-embed';

                if (streamUrl) {
                    const title = matchedDomain.split('.')[0].charAt(0).toUpperCase() + matchedDomain.split('.')[0].slice(1);
                    const separator = streamUrl.includes('?') ? '&' : '?';
                    const liveStreamUrl = `${streamUrl}${separator}t=${Date.now()}`;

                    container.innerHTML = `
                    <div class="radio-embed-card">
                        <div class="radio-cover" style="cursor: pointer;" title="Lire / Pause">
                            <div class="radio-overlay-icon">▶</div>
                        </div>
                        <div class="radio-content">
                            <div class="radio-header">
                                <span class="radio-title">${title}</span>
                                <span class="radio-live-badge">LIVE</span>
                            </div>
                            <audio src="${liveStreamUrl}" controls preload="none"></audio>
                        </div>
                    </div>`;
                    
                    const audio = container.querySelector('audio');
                    const cover = container.querySelector('.radio-cover');
                    const icon = container.querySelector('.radio-overlay-icon');

                    if (audio && cover && icon) {
                        cover.addEventListener('click', (e) => {
                            e.preventDefault();
                            if (audio.paused) {
                                audio.play();
                            } else {
                                audio.pause();
                            }
                        });

                        audio.addEventListener('play', () => {
                            icon.textContent = '⏸'; 
                        });
                        
                        audio.addEventListener('pause', () => {
                            icon.textContent = '▶'; 
                        });
                        
                        audio.addEventListener('ended', () => {
                            icon.textContent = '▶'; 
                        });
                    }

                    return container;
                }

                container.innerHTML = `<iframe 
                    src="${link.href}" 
                    class="iframe-embed" 
                    style="height: 450px; width: 100%; border:none; background-color: #fff;" 
                    title="Radio Player"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    allow="autoplay; encrypted-media">
                </iframe>`;
                
                return container;
            }
        },
        {
            name: 'UrlShortener',
            selector: 'a[href*="bit.ly/"], a[href*="tinyurl.com/"], a[href*="goo.gl/"], a[href*="amzn.to/"]',
            category: 'wildcard',
            async createEmbedElement(link) {
                try {
                    const response = await LecteurMedia.compatibleHttpRequest({ 
                        method: 'HEAD', 
                        url: link.href 
                    });
                    
                    if (response.status >= 400 && response.status !== 405) return null;

                    const finalUrl = response.finalUrl || link.href;

                    if (finalUrl === link.href) return null;

                    console.log(`[Shortener] ${link.href} redirige vers -> ${finalUrl}`);

                    const fakeLink = document.createElement('a');
                    fakeLink.href = finalUrl;
                    Object.assign(fakeLink.dataset, link.dataset);
                    
                    const providers = window.LecteurMedia?.AllProviders || [];
                    
                    for (const provider of providers) {
                        if (['UrlShortener', 'ArticlePreview', 'GenericMedia'].includes(provider.name)) continue;

                        if (fakeLink.matches(provider.selector)) {
                            const isDark = !document.documentElement.classList.contains('theme-light');
                            return provider.createEmbedElement(fakeLink, isDark);
                        }
                    }

                    const previewProvider = providers.find(p => p.name === 'ArticlePreview');
                    if (previewProvider) {
                         return previewProvider.createEmbedElement(fakeLink);
                    }

                } catch (e) {
                    console.warn("[Shortener] Erreur de résolution:", e);
                }
                return null;
            }
        },
        {
          name: 'PDF',
          selector: 'a[href$=".pdf" i]',
          category: 'wildcard',
          async createEmbedElement(link) {
                const pdfUrl = sanitizeUrl(link.href);

                try {
                    const response = await LecteurMedia.compatibleHttpRequest({
                        method: 'HEAD',
                        url: pdfUrl
                    });

                    if (response.status < 200 || response.status >= 300) {
                        throw new Error(`Le serveur a retourné le statut ${response.status} pour le fichier PDF.`);
                    }
                    const headers = response.responseHeaders;

                    const lowerCaseHeaders = headers.toLowerCase();
                    const xFrameOptions = lowerCaseHeaders.match(/x-frame-options:\s*(deny|sameorigin)/);
                    const csp = lowerCaseHeaders.match(/content-security-policy:.*frame-ancestors\s+('none'|'self')/);

                    if (xFrameOptions || csp) {
                        console.log(`[PDF Embed] Intégration bloquée pour ${pdfUrl} par les en-têtes du serveur.`);
                        return null;
                    }

                } catch (error) {
                    console.error(`[PDF Embed] Erreur réseau en vérifiant les en-têtes pour ${pdfUrl}:`, error);
                    return null;
                }

                const container = createSafeDiv();
                container.className = 'bloc-embed';
                container.innerHTML = `<iframe
                    src="${pdfUrl}"
                    class="iframe-embed iframe-pdf"
                    title="Lecteur PDF"
                    frameborder="0"
                    sandbox="allow-scripts allow-same-origin">
                </iframe>`;
                return container;
            }
        },
        {
          name: 'GenericMedia',
          selector: `
              a[href*=".jpg" i]:not([href*="noelshack.com"]), a[href*=".jpeg" i]:not([href*="noelshack.com"]),
              a[href*=".png" i]:not([href*="noelshack.com"]), a[href*=".gif" i]:not([href*="noelshack.com"]),
              a[href*=".webp" i]:not([href*="noelshack.com"]), a[href*=".bmp" i]:not([href*="noelshack.com"]),
              a[href*=".mp4" i]:not([href*="noelshack.com"]), a[href*=".webm" i]:not([href*="noelshack.com"]),
              a[href*=".mov" i]:not([href*="noelshack.com"]), a[href*=".ogg" i]:not([href*="noelshack.com"]),
              a[href*="format=png" i], a[href*="format=jpg" i], a[href*="format=jpeg" i],
              a[href*="pbs.twimg.com/media/"]
          `,
          category: 'base',
          createEmbedElement(link) {
              let targetUrl = link.href;
              
              try {
                  const u = new URL(targetUrl);
                  if (u.hostname === 'pbs.twimg.com' && u.searchParams.has('format')) {
                      const format = u.searchParams.get('format');
                      u.search = '';
                      u.pathname += `.${format}`;
                      targetUrl = u.toString();
                  }
              } catch (e) {}

              const safeSrc = sanitizeUrl(targetUrl);
              const container = createSafeDiv();
              container.className = 'bloc-embed';

              const urlObj = new URL(targetUrl);
              const hasVideoExtension = /\.(mp4|webm|mov|ogg)$/i.test(urlObj.pathname);
              
              const handleError = () => {
                  const stickerUrl = 'https://risibank.fr/cache/medias/0/5/512/51206/thumb.png';
                  container.innerHTML = `
                      <div class="dead-link-sticker">
                          <img src="${stickerUrl}" alt="[Média supprimé]">
                          <span>[Média supprimé / Inaccessible]</span>
                      </div>
                  `;
              };

              const handleResize = (element) => {
                  const isVid = element.tagName === 'VIDEO';
                  const w = isVid ? element.videoWidth : element.naturalWidth;
                  const h = isVid ? element.videoHeight : element.naturalHeight;
                  if (h > w) element.classList.add('iframe-vertical-content');
              };

              if (hasVideoExtension) {
                  // VIDÉO STANDARD (MP4/WEBM/etc)
                  const video = document.createElement('video');
                  video.src = safeSrc;
                  video.className = 'video-embed';
                  video.controls = true;
                  video.muted = true;
                  video.loop = true;
                  video.playsinline = true;
                  video.setAttribute('referrerpolicy', 'no-referrer');
                  video.onloadedmetadata = () => handleResize(video);
                  video.onerror = handleError;
                  container.appendChild(video);
              } else {
                  // IMAGE STANDARD
                  const img = document.createElement('img');
                  img.src = safeSrc;
                  img.className = 'image-embed';
                  img.loading = 'lazy';
                  img.setAttribute('referrerpolicy', 'no-referrer');
                  img.onload = () => handleResize(img);
                  img.onerror = handleError;
                  container.appendChild(img);
              }

              return container;
          }
        },
        {
            name: 'ArticlePreview',
            selector: 'a[href^="http"]:not([data-miniatweet-processed])',
            category: 'wildcard',

            async createEmbedElement(link) {
                const href = link.href;
                const urlObj = new URL(href);
                const urlToCheck = urlObj.hostname + urlObj.pathname;

                const isHandledByOther = window.LecteurMedia?.AllProviders?.some(p => {
                    if (p.name === 'ArticlePreview' || p.name === 'GenericMedia' || p.name === 'GenericOEmbed') return false;
                    return link.matches(p.selector);
                });

                const excludedDomains = [
                    'youtube.com', 'youtu.be', 'twitter.com', 'x.com', 'instagram.com',
                    'tiktok.com', 'vm.tiktok.com', 'streamable.com', 'webmshare.com',
                    'facebook.com', 'twitch.tv', 'vocaroo.com', 'voca.ro', 'reddit.com',
                    'flourish.studio', 'jeuxvideo.com', 'jvarchive.com', 'jvarchive.st', 'jvarchive.net',
                    'noelshack.com', 'drive.google.com', 'docs.google.com', 'google.com/maps', 'maps.app.goo.gl',
                    'risibank.fr', 'imgur.com',
                    'google.com/search', 'bing.com/search', 'yahoo.com/search', 'qwant.com', 'duckduckgo.com',
                    'image.noelshack.com'
                ];

                if (isHandledByOther || excludedDomains.some(d => urlToCheck.includes(d)) || /\.(jpg|jpeg|png|gif|webp|bmp|mp4|webm|mov|ogg|pdf)$/i.test(href)) {
                    return null;
                }

                // HELPER UI : CRÉATION DE LA CARTE
                const createCard = (title, description, image, hostname, isDead = false, isDirectImage = false) => {
                    const safeTitle = escapeHTML(title);
                    const safeDesc = description ? escapeHTML(description) : '';
                    const safeUrl = sanitizeUrl(href);
                    const safeHost = escapeHTML(hostname.replace(/^www\./, ''));

                    if (isDirectImage && image) {
                         const imgDiv = document.createElement('div');
                         imgDiv.className = 'bloc-embed';
                         imgDiv.innerHTML = `<img src="${sanitizeUrl(image)}" class="image-embed" loading="lazy" alt="Image ${safeHost}">`;
                         return imgDiv;
                    }

                    let imageHtml = '';
                    let cardClass = isDead ? 'article-preview-card animate-in dead-link' : 'article-preview-card animate-in';

                    if (image && !isDead) {
                        const safeImage = sanitizeUrl(image);
                        imageHtml = `
                        <div class="article-preview-image">
                            <div class="article-preview-skeleton-overlay"></div>
                            <img src="${safeImage}" class="article-preview-img-element" loading="lazy" referrerpolicy="no-referrer">
                        </div>`;
                    } else {
                        cardClass += ' no-image';
                    }

                    const cardLink = document.createElement('a');
                    cardLink.href = safeUrl;
                    cardLink.className = cardClass;
                    cardLink.target = "_blank";
                    cardLink.rel = "noopener noreferrer";
                    cardLink.dataset.miniatweetProcessed = "true";

                    const iconHtml = isDead
                        ? `<div style="margin-bottom:4px; color:#e06c75;"><svg style="width:20px;vertical-align:bottom;color:inherit;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></div>`
                        : '';

                    cardLink.innerHTML = `
                        ${imageHtml}
                        <div class="article-preview-content">
                            ${iconHtml}
                            <div class="article-preview-title">${safeTitle}</div>
                            ${safeDesc ? `<div class="article-preview-description">${safeDesc}</div>` : ''}
                        </div>
                        <div class="article-preview-footer">
                            <span class="article-preview-sitename">${safeHost}</span>
                        </div>
                    `;

                    if (image && !isDead) {
                        const img = cardLink.querySelector('img');
                        const overlay = cardLink.querySelector('.article-preview-skeleton-overlay');
                        const imgWrapper = cardLink.querySelector('.article-preview-image');

                        if (img && overlay) {
                            const onImageLoaded = () => { img.classList.add('loaded'); overlay.style.display = 'none'; };
                            if (img.complete) onImageLoaded();
                            else {
                                img.addEventListener('load', onImageLoaded);
                                img.addEventListener('error', () => { if (imgWrapper) imgWrapper.style.display = 'none'; cardLink.classList.add('no-image'); });
                            }
                        }
                    }
                    return cardLink;
                };

                // GESTION DU CACHE
                try {
                    const cachedData = await CacheManager.get(href);
                    if (cachedData) {
                        if (cachedData.type === 'rich_oembed') {
                            const container = createSafeDiv();
                            container.className = 'bloc-embed oembed-rich';
                            container.innerHTML = safeHTML(cachedData.html);
                            const iframe = container.querySelector('iframe');
                            if(iframe) {
                                iframe.style.width = '100%'; 
                                if (cachedData.width && cachedData.height && cachedData.width !== '100%') {
                                     iframe.style.aspectRatio = `${cachedData.width}/${cachedData.height}`;
                                     iframe.style.height = 'auto';
                                } else { 
                                     iframe.style.height = cachedData.height ? (cachedData.height.toString().includes('px') ? cachedData.height : cachedData.height + 'px') : '450px'; 
                                }
                            }
                            return container;
                        }

                        const isDirect = cachedData.type === 'direct_image';
                        const finalCard = createCard(cachedData.title, cachedData.description, cachedData.image, urlObj.hostname, cachedData.isDead, isDirect);
                        
                        if(finalCard.tagName === 'DIV' && finalCard.classList.contains('bloc-embed')) return finalCard;

                        const c = createSafeDiv(); c.className = 'bloc-embed'; c.appendChild(finalCard);
                        return c;
                    }
                } catch (e) {}

                // SQUELETTE DE CHARGEMENT
                const skeletonContainer = createSafeDiv();
                skeletonContainer.className = 'bloc-embed lm-skeleton-wrapper';
                skeletonContainer.innerHTML = `
                <div class="article-preview-card skeleton-card">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-content">
                        <div class="skeleton-line title"></div>
                        <div class="skeleton-line text"></div>
                    </div>
                </div>`;

                // LOGIQUE ASYNCHRONE
                (async () => {
                    try {
                        const settings = await SettingsManager.getSettings();
                        const mode = settings.previewMode || 'proxy_fallback';

                        let dataFound = null;

                        const fetchViaProxy = async () => {
                            const workerUrl = `${baseUrl}/?url=${encodeURIComponent(href)}`;
                            const timeoutVal = (mode === 'proxy_only') ? 4000 : 2000;
                            const response = await LecteurMedia.compatibleHttpRequest({ method: 'GET', url: workerUrl, timeout: timeoutVal });
                            if (response.status === 200) {
                                const data = JSON.parse(response.responseText);
                                if (!data.error && data.title) return data;
                            }
                            throw new Error("Worker failed");
                        };

                        const fetchDirect = async () => {
                            const UA_STD = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';
                            const UA_BOT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

                            const performRequest = async (userAgent) => {
                                const response = await LecteurMedia.compatibleHttpRequest({
                                    method: 'GET', url: href, timeout: 6000,
                                    headers: {
                                        'User-Agent': userAgent,
                                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                                        'Range': 'bytes=0-150000' 
                                    }
                                });
                                if (response.status === 404 || response.status === 410) throw new Error("HTTP_DEAD_LINK");
                                if (response.status >= 400) throw new Error("NETWORK_ERROR");

                                //  DETECTION FICHIER DIRECT (IMAGE/VIDEO) VIA HEADER
                                const ct = (response.responseHeaders || '').match(/content-type:\s*([^;\r\n]*)/i);
                                const contentType = ct ? ct[1].toLowerCase() : '';

                                if (contentType.startsWith('image/')) {
                                    return { type: 'direct_image', image: href };
                                }
                                if (contentType.startsWith('video/')) {
                                    const videoHtml = `<video src="${sanitizeUrl(href)}" controls style="width:100%; max-height:500px; border-radius:8px;"></video>`;
                                    return { type: 'rich_oembed', html: videoHtml };
                                }

                                const parser = new DOMParser();
                                const doc = parser.parseFromString(response.responseText, 'text/html');

                                // RECHERCHE OEMBED
                                const oembedLink = doc.querySelector('link[type="application/json+oembed"], link[type="text/json+oembed"]');
                                if (oembedLink) {
                                    let oembedUrl = oembedLink.getAttribute('href');
                                    if (oembedUrl) {
                                        if (oembedUrl.startsWith('/')) oembedUrl = new URL(oembedUrl, href).href;
                                        try {
                                            const jsonResp = await LecteurMedia.compatibleHttpRequest({ method: 'GET', url: oembedUrl });
                                            if (jsonResp.status === 200) {
                                                const data = JSON.parse(jsonResp.responseText);
                                                if ((data.type === 'rich' || data.type === 'video') && data.html) {
                                                    let cleanHtml = safeHTML(data.html).replace(/src="http:\/\//g, 'src="https://');
                                                    return { 
                                                        type: 'rich_oembed', 
                                                        html: cleanHtml, 
                                                        width: data.width, 
                                                        height: data.height 
                                                    };
                                                }
                                            }
                                        } catch (e) { }
                                    }
                                }

                                // RECHERCHE TWITTER PLAYER
                                const twPlayer = doc.querySelector('meta[name="twitter:player"]');
                                if (twPlayer) {
                                    const playerUrl = twPlayer.getAttribute('content');
                                    if (playerUrl) {
                                        const twWidth = doc.querySelector('meta[name="twitter:player:width"]')?.getAttribute('content');
                                        const twHeight = doc.querySelector('meta[name="twitter:player:height"]')?.getAttribute('content');
                                        const iframeHtml = `<iframe src="${sanitizeUrl(playerUrl)}" width="${twWidth||'100%'}" height="${twHeight||'400'}" frameborder="0" scrolling="no" allowfullscreen sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"></iframe>`;
                                        return { type: 'rich_oembed', html: iframeHtml, width: twWidth, height: twHeight };
                                    }
                                }

                                // RECHERCHE DOUYIN / LARK (ByteDance)
                                const larkPlayer = doc.querySelector('meta[name="lark:url:video_iframe_url"]');
                                if (larkPlayer) {
                                    const playerUrl = larkPlayer.getAttribute('content');
                                    if (playerUrl) {
                                        const iframeHtml = `<iframe src="${sanitizeUrl(playerUrl)}" width="100%" height="500" frameborder="0" scrolling="no" allowfullscreen sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"></iframe>`;
                                        return { type: 'rich_oembed', html: iframeHtml, width: '100%', height: '500' };
                                    }
                                }

                                // FALLBACK CARTE
                                const getMeta = (prop) => doc.querySelector(`meta[property="${prop}"], meta[name="${prop}"]`)?.getAttribute('content')?.trim();
                                let title = getMeta('og:title') || getMeta('twitter:title');
                                if (!title) {
                                    const titleTag = doc.querySelector('title');
                                    if (titleTag) title = titleTag.textContent.trim();
                                }
                                if (title) title = title.replace(/\s*[|\-].*$/, '');
                                if (title && (/^loading\.{3}$/i.test(title) || title.toLowerCase() === 'loading')) title = null;

                                const description = getMeta('og:description') || getMeta('twitter:description') || getMeta('description');
                                let imageUrl = getMeta('og:image') || getMeta('twitter:image') || doc.querySelector('link[rel="image_src"]')?.href;
                                if (imageUrl && !imageUrl.startsWith('http')) {
                                    try { imageUrl = new URL(imageUrl, href).href; } catch (e) { }
                                }

                                if (title) return { title, description, image: imageUrl || null };
                                throw new Error("Request failed or no title");
                            };

                            let standardData = null;
                            try {
                                standardData = await performRequest(UA_STD);
                                if (standardData.type === 'rich_oembed' || standardData.type === 'direct_image' || standardData.image || standardData.description) return standardData;
                            } catch (stdError) {
                                if (stdError.message === "HTTP_DEAD_LINK") return { title: "Page introuvable (404)", description: "Le lien semble mort.", image: null, isDead: true };
                            }

                            try {
                                const botData = await performRequest(UA_BOT);
                                return botData;
                            } catch (botError) {
                                if (botError.message === "HTTP_DEAD_LINK") return { title: "Page introuvable (404)", description: "Le lien semble mort.", image: null, isDead: true };
                                if (standardData) return standardData;
                                throw botError;
                            }
                        };

                        if (mode === 'direct') dataFound = await fetchDirect();
                        else if (mode === 'proxy_only') dataFound = await fetchViaProxy();
                        else {
                            try { dataFound = await fetchViaProxy(); } catch (e) { dataFound = await fetchDirect(); }
                        }

                        if (dataFound) {
                            await CacheManager.set(href, dataFound);
                            let finalContent;

                            if (dataFound.type === 'rich_oembed') {
                                const container = createSafeDiv();
                                container.className = 'bloc-embed oembed-rich';
                                container.innerHTML = dataFound.html;
                                const iframe = container.querySelector('iframe');
                                if(iframe) {
                                    iframe.style.width = '100%'; iframe.style.maxWidth = '100%';
                                    if(dataFound.width && dataFound.height && dataFound.width !== '100%') {
                                        iframe.style.aspectRatio = `${dataFound.width} / ${dataFound.height}`;
                                        iframe.style.height = 'auto';
                                    } else { 
                                        iframe.style.height = dataFound.height ? (dataFound.height.toString().includes('px') ? dataFound.height : dataFound.height + 'px') : '450px'; 
                                    }
                                }
                                finalContent = container;
                            } 
                            // Cas Image directe
                            else if (dataFound.type === 'direct_image') {
                                finalContent = createCard(null, null, dataFound.image, urlObj.hostname, false, true);
                            }
                            // Cas Carte Article
                            else {
                                finalContent = createCard(dataFound.title, dataFound.description, dataFound.image, urlObj.hostname, dataFound.isDead);
                            }

                            const startHeight = skeletonContainer.offsetHeight;
                            skeletonContainer.style.height = `${startHeight}px`;
                            skeletonContainer.innerHTML = '';

                            if (finalContent.classList.contains('bloc-embed')) {
                                skeletonContainer.innerHTML = finalContent.innerHTML;
                                skeletonContainer.className = finalContent.className;
                            } else {
                                skeletonContainer.appendChild(finalContent);
                            }

                            if (LecteurMedia.instance && LecteurMedia.instance.embedManager) {
                                LecteurMedia.instance.embedManager._makeEmbedCollapsible(skeletonContainer, link);
                            }

                            requestAnimationFrame(() => {
                                const headerHeight = skeletonContainer.querySelector('.embed-header')?.offsetHeight || 0;
                                const contentHeight = skeletonContainer.querySelector('.media-content')?.offsetHeight || finalContent.offsetHeight || 150;
                                skeletonContainer.style.height = `${headerHeight + contentHeight}px`;
                                setTimeout(() => {
                                    skeletonContainer.style.height = 'auto';
                                    skeletonContainer.style.overflow = 'visible';
                                    const card = skeletonContainer.querySelector('.article-preview-card');
                                    if (card) card.classList.remove('animate-in');
                                }, 350);
                            });

                        } else {
                            skeletonContainer.style.height = `${skeletonContainer.offsetHeight}px`;
                            requestAnimationFrame(() => { skeletonContainer.style.height = '0px'; });
                            setTimeout(() => skeletonContainer.remove(), 350);
                        }

                    } catch (globalError) {
                        skeletonContainer.style.height = `${skeletonContainer.offsetHeight}px`;
                        requestAnimationFrame(() => { 
                            skeletonContainer.style.height = '0px'; 
                            skeletonContainer.style.opacity = '0';
                        });
                        setTimeout(() => skeletonContainer.remove(), 350);
                    }
                })();

                return skeletonContainer;
            }
        },
    ];


    // =========================================================================
    // == HELPERS
    // =========================================================================

    // Gère le redimensionnement dynamique des iframes en écoutant les événements `postMessage`
    const IframeResizeManager = {
        isInitialized: false,
        handlers: {},

        register: function(origin, handler) {
            this.handlers[origin] = handler;
        },

        init: function() {
            if (this.isInitialized) {
                return;
            }
            window.addEventListener('message', this._handleMessage.bind(this));
            this.isInitialized = true;
        },

        _handleMessage: function(event) {
            const handler = this.handlers[event.origin];
            if (handler) {
                handler.process(event);
            }
        }
    };

    // --- Définition des Handlers  ---
    const redditResizeHandler = {
        process: function(event) {
            let data;
            if (typeof event.data === 'string') {
                try { data = JSON.parse(event.data); } catch (e) { return; }
            } else if (typeof event.data === 'object' && event.data !== null) {
                data = event.data;
            } else {
                return;
            }

            if (data && data.type === 'resize.embed' && typeof data.data === 'number') {
                const height = data.data;
                this._resizeIframe(height, event.source);
            }
        },

        _resizeIframe: function(height, sourceWindow) {
            if (height <= 0 || !sourceWindow) return;
            const iframes = document.querySelectorAll('iframe.iframe-reddit');

            for (const iframe of iframes) {
                if (iframe.contentWindow === sourceWindow) {
                    iframe.style.height = `${height}px`;
                    break;
                }
            }
        }
    };

    IframeResizeManager.register('https://embed.reddit.com', redditResizeHandler);


    // =========================================================================
    // == GESTIONNAIRE DE PARAMÈTRES
    // =========================================================================

    const SettingsManager = {
        defaults: {
            startCollapsed: false,
            collapsibleEmbeds: true,
            enableJVCode: true,
            disabledProviders: [],
            twitterFullHeight: false,
            embedPosition: 'below_line', // Options: 'after', 'before', 'replace', 'bottom', 'below_line'
            previewMode: 'direct', // Options: 'proxy_fallback', 'proxy_only', 'direct'
            topicRules: {}
        },

         async _safeGetValue(key, defaultValue) {
            if (typeof GM_getValue === 'function') {
                return await GM_getValue(key, defaultValue);
            }
            return defaultValue;
        },

        async _safeSetValue(key, value) {
            if (typeof GM_setValue === 'function') {
                await GM_setValue(key, value);
            }
        },

        async getSettings(developerDefaults = {}) {
            const settings = {};

            settings.collapsibleEmbeds = await this._safeGetValue(
                'collapsibleEmbeds', 
                developerDefaults.collapsible ?? this.defaults.collapsibleEmbeds
            );

            settings.startCollapsed = await  this._safeGetValue('startCollapsed', this.defaults.startCollapsed);
            settings.disabledProviders = await  this._safeGetValue('disabledProviders', this.defaults.disabledProviders);
            settings.twitterFullHeight = await this._safeGetValue('twitterFullHeight', this.defaults.twitterFullHeight);
            settings.embedPosition = await this._safeGetValue('embedPosition', this.defaults.embedPosition);
            settings.previewMode = await this._safeGetValue('previewMode', this.defaults.previewMode);
            settings.topicRules = await this._safeGetValue('topicRules', this.defaults.topicRules);
            settings.enableJVCode = await this._safeGetValue('enableJVCode', this.defaults.enableJVCode); 

            return settings;
        },

        async saveSettings(settings) {
            for (const key in settings) {
                await this._safeSetValue(key, settings[key]);
            }
        },

        registerSettingsMenu(providersList) {
            if (typeof GM_registerMenuCommand === 'function' && typeof GM_getValue === 'function' && typeof GM_setValue === 'function') {
                GM_registerMenuCommand('Configurer le Lecteur Média', () => openSettingsPanel(providersList));
            } else {
                console.warn('[Lecteur Media] Panneau de configuration désactivé (permissions GM_* manquantes).');
            }
        }
    };


    // =========================================================================
    // == PANNEAU DE CONFIGURATION (UI)
    // =========================================================================
    function openSettingsPanel(providersList) {
        if (document.getElementById('lm-settings-panel')) return;

        const overlay = createSafeDiv();
        overlay.id = 'lm-settings-overlay';

        const panel = createSafeDiv();
        panel.id = 'lm-settings-panel';

        const styleElement = document.createElement('style');
        styleElement.id = 'lm-settings-style';
        styleElement.textContent = `
            :root {
                --lm-bg: #2a2d31;
                --lm-bg-secondary: #202225;
                --lm-text: #dcddde;
                --lm-text-muted: #8e9297;
                --lm-border: #36393f;
                --lm-accent: #006bd7; /* Bleu JVC */
                --lm-radius: 8px;
                --lm-shadow: 0 10px 30px rgba(0,0,0,0.5);
                --lm-danger: #d32f2f;
            }

            html.theme-light {
                --lm-bg: #f2f3f5;
                --lm-bg-secondary: #ffffff;
                --lm-text: #2e3338;
                --lm-text-muted: #5c626b;
                --lm-border: #e3e5e8;
                --lm-shadow: 0 10px 30px rgba(0,0,0,0.15);
            }

            #lm-settings-overlay {
                position: fixed; inset: 0; z-index: 2147483646;
                background-color: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(2px);
                opacity: 0; transition: opacity 0.2s;
            }

            #lm-settings-panel {
                position: fixed;
                top: 50%; left: 50%;
                transform: translate(-50%, -48%) scale(0.95);
                width: 90vw; max-width: 600px;
                max-height: 85vh; /* Limite la hauteur globale */
                background-color: var(--lm-bg); color: var(--lm-text);
                border-radius: var(--lm-radius); box-shadow: var(--lm-shadow);
                display: flex; flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                opacity: 0; transition: all 0.2s;
                z-index: 2147483647;
            }

            #lm-settings-panel .panel-header {
                padding: 14px 20px; border-bottom: 1px solid var(--lm-border);
                display: flex; justify-content: space-between; align-items: center;
                flex-shrink: 0;
            }
            #lm-settings-panel .panel-header h2 { margin: 0; font-size: 16px; font-weight: 600; }

            #lm-settings-panel .panel-close-btn {
                background: transparent; border: none; cursor: pointer; padding: 6px;
                border-radius: 50%; display: flex; align-items: center; justify-content: center;
            }
            #lm-settings-panel .panel-close-btn:hover { background-color: rgba(127,127,127,0.15); }

            .panel-close-icon {
                display: block; width: 24px; height: 24px; background-size: contain; background-repeat: no-repeat; background-position: center;
            }
            html:not(.theme-light) .panel-close-icon { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dcddde' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E"); }
            html.theme-light .panel-close-icon { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235c626b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E"); }

            #lm-settings-panel .panel-body {
                padding: 10px; 
                overflow-y: auto; /* C'est ici que ça scroll */
                flex: 1; /* Prend toute la place restante */
                min-height: 0; /* Important pour Firefox */
            }
            #lm-settings-panel .panel-body::-webkit-scrollbar { width: 6px; }
            #lm-settings-panel .panel-body::-webkit-scrollbar-track { background: transparent; }
            #lm-settings-panel .panel-body::-webkit-scrollbar-thumb { background-color: var(--lm-border); border-radius: 4px; }

            #lm-settings-panel .setting-group {
                background-color: var(--lm-bg-secondary);
                border: 1px solid var(--lm-border);
                border-radius: var(--lm-radius);
                overflow: hidden;
                margin-bottom: 20px;
            }
            #lm-settings-panel .setting-group:last-child { margin-bottom: 0; }
            
            #lm-settings-panel .setting-group-header {
                padding: 10px 14px;
                background-color: rgba(127,127,127,0.05);
                border-bottom: 1px solid var(--lm-border);
                display: flex; align-items: center; gap: 8px;
            }
            #lm-settings-panel .setting-group-header svg { width: 18px; height: 18px; color: var(--lm-text-muted); }
            #lm-settings-panel .setting-group-header h3 { margin: 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--lm-text-muted); }
            
            #lm-settings-panel .setting-group-content { padding: 14px; display: flex; flex-direction: column; gap: 14px; }

            #lm-settings-panel .setting-item {
                display: flex; justify-content: space-between; align-items: center; gap: 15px;
            }
            #lm-settings-panel .setting-item-label { display: flex; flex-direction: column; gap: 2px; flex: 1; }
            #lm-settings-panel .setting-item-label strong { font-size: 14px; font-weight: 500; color: var(--lm-text); }
            #lm-settings-panel .setting-item-label span { font-size: 12px; color: var(--lm-text-muted); }

            /* Switch */
            #lm-settings-panel .toggle-switch {
                position: relative; display: inline-block; width: 40px; height: 22px; flex-shrink: 0;
            }
            #lm-settings-panel .toggle-switch input { opacity: 0; width: 0; height: 0; }
            #lm-settings-panel .slider {
                position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                background-color: var(--lm-border); border-radius: 22px; transition: .2s;
            }
            #lm-settings-panel .slider:before {
                position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px;
                background-color: white; border-radius: 50%; transition: .2s;
            }
            #lm-settings-panel input:checked + .slider { background-color: var(--lm-accent); }
            #lm-settings-panel input:checked + .slider:before { transform: translateX(18px); }
            
            /* Providers Grid */
            #lm-settings-panel .providers-list {
                display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px;
            }
            #lm-settings-panel .provider-item {
                display: flex; align-items: center; background-color: var(--lm-bg);
                border: 1px solid var(--lm-border); border-radius: 6px; padding: 6px 10px;
                cursor: pointer; transition: 0.2s;
            }
            #lm-settings-panel .provider-item input { display: none; } /* Cache la checkbox */
            #lm-settings-panel .provider-item:hover { border-color: var(--lm-text-muted); }
            #lm-settings-panel .provider-item.checked { border-color: var(--lm-accent); background-color: rgba(0, 107, 215, 0.08); }
            #lm-settings-panel .provider-item-icon { width: 16px; height: 16px; margin-right: 8px; border-radius: 3px; }
            #lm-settings-panel .provider-item label { font-size: 12px; font-weight: 500; cursor: pointer; user-select: none; }

            /* Topic Box */
            .lm-topic-box {
                background-color: rgba(0, 107, 215, 0.05);
                border: 1px solid rgba(0, 107, 215, 0.3);
                padding: 10px; border-radius: 6px; margin-bottom: 12px;
            }
            .lm-topic-title { 
                font-size: 13px; margin-bottom: 8px; display: block; color: var(--lm-text); white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis; }
            .lm-topic-actions { display: flex; gap: 8px; }
            
            .lm-input-select {
                background: var(--lm-bg); color: var(--lm-text); border: 1px solid var(--lm-border);
                padding: 6px; border-radius: 4px; outline: none; flex: 1; font-size: 13px; cursor: pointer;
            }
            .lm-btn-primary {
                background: var(--lm-accent); color: white; border: none; border-radius: 4px;
                padding: 6px 12px; cursor: pointer; font-size: 13px; font-weight: 600; white-space: nowrap;
            }
            
            .topic-rule-item {
                display: flex; justify-content: space-between; align-items: center;
                background: var(--lm-bg); padding: 8px; border-radius: 4px;
                margin-bottom: 6px; border: 1px solid var(--lm-border);
            }
            .topic-rule-info { overflow: hidden; margin-right: 10px; }
            .topic-rule-title { font-weight: 600; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .topic-rule-meta { font-size: 10px; color: var(--lm-text-muted); }
            .lm-btn-delete {
                background: transparent; color: var(--lm-danger); border: 1px solid var(--lm-border);
                border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 11px;
            }

            /* Responsive */
            @media (max-width: 600px) {
                #lm-settings-panel { 
                    width: 95vw; 
                    max-height: 90vh; /* Plus grand sur mobile */
                }
                #lm-settings-panel .setting-item { flex-direction: column; align-items: flex-start; gap: 8px; }
                #lm-settings-panel .toggle-switch { align-self: flex-end; margin-top: -28px; }
                
                .lm-topic-actions { flex-direction: column; }
                .lm-topic-actions .lm-input-select, .lm-topic-actions .lm-btn-primary { width: 100%; }
                
                #lm-settings-panel .providers-list { grid-template-columns: 1fr 1fr; } /* 2 colonnes sur mobile */
            }

            .toast-indicator {
                position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%) translateY(20px);
                padding: 8px 16px; background-color: var(--lm-accent); color: white; border-radius: 20px;
                font-size: 13px; font-weight: 500; opacity: 0; pointer-events: none; transition: 0.3s; z-index: 10;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            .toast-indicator.show { opacity: 1; transform: translateX(-50%) translateY(0); }
        `;

        document.head.appendChild(styleElement);

        const providerIcons = {
            'AppleMusic': 'https://www.google.com/s2/favicons?domain=music.apple.com&sz=64',
            'ArticlePreview': 'https://www.google.com/s2/favicons?domain=news.google.fr&sz=64',
            'Bandcamp': 'https://www.google.com/s2/favicons?domain=bandcamp.com&sz=64',
            'Bilibili': 'https://www.google.com/s2/favicons?domain=bilibili.com&sz=64',
            'Bluesky': 'https://www.google.com/s2/favicons?domain=bsky.app&sz=64',
            'Codepen': 'https://www.google.com/s2/favicons?domain=codepen.io&sz=64',
            'Coub': 'https://www.google.com/s2/favicons?domain=coub.com&sz=64',
            'Dailymotion': 'https://www.google.com/s2/favicons?domain=dailymotion.com&sz=64',
            'Deezer': 'https://www.google.com/s2/favicons?domain=deezer.com&sz=64',
            'DeviantArt': 'https://www.google.com/s2/favicons?domain=deviantart.com&sz=64',
            'Discord': 'https://www.google.com/s2/favicons?domain=discord.com&sz=64',
            'DistroKid': 'https://www.google.com/s2/favicons?domain=distrokid.com&sz=64',
            'Facebook': 'https://www.google.com/s2/favicons?domain=facebook.com&sz=64',
            'Flickr': 'https://www.google.com/s2/favicons?domain=flickr.com&sz=64',
            'Flourish': 'https://www.google.com/s2/favicons?domain=flourish.studio&sz=64',
            'GenericMedia': 'https://www.google.com/s2/favicons?domain=images.videolan.org&sz=64',
            'Giphy': 'https://www.google.com/s2/favicons?domain=giphy.com&sz=64',
            'Gofundme': 'https://www.google.com/s2/favicons?domain=gofundme.com&sz=64',
            'GoogleDrive': 'https://www.google.com/s2/favicons?domain=drive.google.com&sz=64',
            'GoogleMaps': 'https://www.google.com/s2/favicons?domain=maps.google.com&sz=64',
            'GoogleSupport': 'https://www.google.com/s2/favicons?domain=support.google.com&sz=64',
            'GoogleTrends': 'https://www.google.com/s2/favicons?domain=trends.google.com&sz=64',
            'Gyazo': 'https://www.google.com/s2/favicons?domain=gyazo.com&sz=64',
            'ImageShack': 'https://www.google.com/s2/favicons?domain=imageshack.com&sz=64',
            'ImgBB': 'https://www.google.com/s2/favicons?domain=ibb.co&sz=64',
            'Imgur': 'https://www.google.com/s2/favicons?domain=imgur.com&sz=64',
            'Instagram': 'https://www.google.com/s2/favicons?domain=instagram.com&sz=64',
            'IssouTV': 'https://www.google.com/s2/favicons?domain=issoutv.com&sz=64',
            'Koreus': 'https://www.google.com/s2/favicons?domain=koreus.com&sz=64',
            'Odysee': 'https://www.google.com/s2/favicons?domain=odysee.com&sz=64',
            'OpenStreetMap': 'https://www.google.com/s2/favicons?domain=openstreetmap.fr&sz=64',
            'Pastebin': 'https://www.google.com/s2/favicons?domain=pastebin.com&sz=64',
            'PDF': 'https://www.google.com/s2/favicons?domain=adobe.com&sz=64',
            'Pinterest': 'https://www.google.com/s2/favicons?domain=pinterest.com&sz=64',
            'Postimages': 'https://www.google.com/s2/favicons?domain=postimg.cc&sz=64',
            'RadioFM': 'https://www.google.com/s2/favicons?domain=music.apple.com&sz=64',
            'Reddit': 'https://www.google.com/s2/favicons?domain=reddit.com&sz=64',
            'Sketchfab': 'https://www.google.com/s2/favicons?domain=sketchfab.com&sz=64',
            'SoundCloud': 'https://www.google.com/s2/favicons?domain=soundcloud.com&sz=64',
            'Spotify': 'https://www.google.com/s2/favicons?domain=spotify.com&sz=64',
            'StackOverflow': 'https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=64',
            'Steam': 'https://www.google.com/s2/favicons?domain=steampowered.com&sz=64',
            'StrawPoll': 'https://www.google.com/s2/favicons?domain=strawpoll.com&sz=64',
            'Streamable': 'https://www.google.com/s2/favicons?domain=streamable.com&sz=64',
            'Telegram': 'https://www.google.com/s2/favicons?domain=telegram.org&sz=64',
            'Tenor': 'https://www.google.com/s2/favicons?domain=tenor.com&sz=64',
            'Threads': 'https://www.google.com/s2/favicons?domain=threads.net&sz=64',
            'TikTok': 'https://www.google.com/s2/favicons?domain=tiktok.com&sz=64',
            'Twitch': 'https://www.google.com/s2/favicons?domain=twitch.tv&sz=64',
            'Twitter': 'https://www.google.com/s2/favicons?domain=x.com&sz=64',
            'Vimeo': 'https://www.google.com/s2/favicons?domain=vimeo.com&sz=64',
            'Vocaroo': 'https://www.google.com/s2/favicons?domain=vocaroo.com&sz=64',
            'Webmshare': 'https://www.google.com/s2/favicons?domain=webmshare.com&sz=64',
            'YouTube': 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64',
            'Zupimages': 'https://www.google.com/s2/favicons?domain=zupimages.net&sz=64'
        };
        const defaultIcon = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpath d=%22M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72%22/%3E%3Cpath d=%22M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72%22/%3E%3C/svg%3E';

         SettingsManager.getSettings().then(settings => {

            // créer un élément de règle de topic
            const createRuleItemHtml = (id, rule) => {
                let modeLabel = 'Inconnu';
                if (rule.mode === 'disabled') modeLabel = 'Entête désactivé';
                else if (rule.mode === 'force_collapsed') modeLabel = 'Toujours réduit';
                else if (rule.mode === 'force_expanded') modeLabel = 'Jamais réduit';

                return `
                    <div class="topic-rule-item">
                        <div class="topic-rule-info">
                            <div class="topic-rule-title" title="${rule.title}">${rule.title}</div>
                            <div class="topic-rule-meta">${modeLabel} (ID: ${id})</div>
                        </div>
                        <button class="lm-btn-delete" data-topic-id="${id}">Suppr.</button>
                    </div>
                `;
            };

            const currentTopic = TopicUtils.getCurrentInfo();
            const rulesListHtml = Object.entries(settings.topicRules || {})
                .map(([id, rule]) => createRuleItemHtml(id, rule))
                .join('') || '<div id="lm-no-rules-msg" style="font-size:12px; color:var(--lm-text-muted); font-style:italic; padding:8px;">Aucune exception configurée.</div>';

            let currentTopicHtml = '';
            if (currentTopic) {
                currentTopicHtml = `
                    <div class="lm-topic-box">
                        <span class="lm-topic-title" title="${currentTopic.title}"><strong>Topic :</strong> ${currentTopic.title}</span>
                        <div class="lm-topic-actions">
                            <select id="lm-topic-mode" class="lm-input-select">
                                <option value="force_collapsed">Toujours réduire</option>
                                <option value="force_expanded">Jamais réduire</option>
                                <option value="disabled">Désactiver entête</option>
                            </select>
                            <button id="lm-add-topic-btn" class="lm-btn-primary">Ajouter</button>
                        </div>
                    </div>
                `;
            } else {
                currentTopicHtml = `<div style="padding:10px; font-size:12px; color:var(--lm-text-muted); border: 1px dashed var(--lm-border); border-radius:6px; text-align:center;">Vous n'êtes pas sur un topic compatible.</div>`;
            }

            panel.innerHTML = `
        <div class="panel-header">
            <h2>Paramètres Lecteur</h2>
            <button class="panel-close-btn" title="Fermer"><span class="panel-close-icon"></span></button>
        </div>
        <div class="panel-body">
            
            <!-- GÉNÉRAL -->
            <div class="setting-group">
                <div class="setting-group-header">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></svg>
                    <h3>Général</h3>
                </div>
                <div class="setting-group-content">
                    <div class="setting-item" data-setting-key="collapsibleEmbeds">
                        <div class="setting-item-label">
                            <strong>En-têtes réductibles</strong>
                            <span>Barre pour masquer/afficher les médias.</span>
                        </div>
                        <label class="toggle-switch"><input type="checkbox" ${settings.collapsibleEmbeds ? 'checked' : ''}><span class="slider"></span></label>
                    </div>
                    <div class="setting-item" data-setting-key="startCollapsed">
                        <div class="setting-item-label">
                            <strong>Réduire par défaut</strong>
                            <span>Masquer le contenu au chargement.</span>
                        </div>
                        <label class="toggle-switch"><input type="checkbox" ${settings.startCollapsed ? 'checked' : ''}><span class="slider"></span></label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-item-label">
                            <strong>Position du lecteur</strong>
                        </div>
                        <select id="lm-position-select" class="lm-input-select">
                            <option value="after">Après le lien</option>
                            <option value="before">Avant le lien</option>
                            <option value="below_line">Sous la ligne</option>
                            <option value="replace">Remplacer le lien</option>
                            <option value="bottom">Fin du message</option>
                        </select>
                    </div> 
                    <div class="setting-item">
                        <div class="setting-item-label">
                            <strong>Prévisualisation</strong>
                            <span>Mode de chargement des aperçus.</span>
                        </div>
                        <select id="lm-preview-mode-select" class="lm-input-select">
                            <option value="proxy_fallback">Auto (Recommandé)</option>
                            <option value="proxy_only">Proxy (Pas de popup)</option>
                            <option value="direct">Direct (Rapide)</option>
                        </select>
                    </div>
                    <div class="setting-item" data-setting-key="enableJVCode">
                        <div class="setting-item-label">
                            <strong>Amélioration Code</strong>
                            <span>Coloration syntaxique, numéros de ligne.</span>
                        </div>
                        <label class="toggle-switch"><input type="checkbox" ${settings.enableJVCode ? 'checked' : ''}><span class="slider"></span></label>
                    </div>  
                </div>
            </div>

            <!-- TWITTER / X -->
            <div class="setting-group">
                <div class="setting-group-header">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.602.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/></svg>
                    <h3>Twitter / X</h3>
                </div>
                <div class="setting-group-content">
                    <div class="setting-item" data-setting-key="twitterFullHeight">
                        <div class="setting-item-label">
                            <strong>Tweets entiers</strong>
                            <span>Afficher tout le tweet sans barre de défilement.</span>
                        </div>
                        <label class="toggle-switch"><input type="checkbox" ${settings.twitterFullHeight ? 'checked' : ''}><span class="slider"></span></label>
                    </div>
                </div>
            </div>

            <!-- TOPIC EXCEPTIONS -->
             <div class="setting-group">
                <div class="setting-group-header">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    <h3>Exceptions par Topic</h3>
                </div>
                <div class="setting-group-content">
                    ${currentTopicHtml}
                    <div>
                        <div id="lm-topic-rules-list">
                            ${rulesListHtml}
                        </div>
                    </div>
                </div>
            </div>

            <!-- PROVIDERS -->
            <div class="setting-group">
                <div class="setting-group-header">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"></path></svg>
                    <h3>Sites supportés</h3>
                </div>
                <div class="setting-group-content providers-list">
                    ${providersList.map(p => {
                        const isChecked = !settings.disabledProviders.includes(p.name);
                        return `<div class="provider-item ${isChecked ? 'checked' : ''}" data-provider-name="${p.name}">
                                    <input type="checkbox" ${isChecked ? 'checked' : ''}>
                                    <img src="${providerIcons[p.name] || defaultIcon}" class="provider-item-icon" alt=""/>
                                    <label>${p.name}</label>
                                </div>`;
                    }).join('')}
                </div>
            </div>
        </div>
        <div class="toast-indicator">Paramètres enregistrés !</div>
    `;

            document.body.append(overlay, panel);

            // Ouverture/Fermeture
            setTimeout(() => { overlay.style.opacity = '1'; panel.style.opacity = '1'; panel.style.transform = 'translate(-50%, -50%) scale(1)'; }, 10);
            const closePanel = () => {
                overlay.style.opacity = '0'; panel.style.opacity = '0'; panel.style.transform = 'translate(-50%, -48%) scale(0.95)';
                setTimeout(() => { overlay.remove(); panel.remove(); styleElement.remove(); }, 200);
            };
            panel.querySelector('.panel-close-btn').onclick = closePanel;
            overlay.addEventListener('click', (e) => { if (e.target === overlay) closePanel(); });

            // Toast
            const toast = panel.querySelector('.toast-indicator');
            let toastTimeout;
            const showToast = () => {
                clearTimeout(toastTimeout); toast.classList.add('show');
                toastTimeout = setTimeout(() => toast.classList.remove('show'), 1500);
            };

            // Events: Toggle Switches (General + Twitter)
            panel.querySelectorAll('.setting-item').forEach(item => {
                const checkbox = item.querySelector('input[type="checkbox"]');
                if (!checkbox) return;
                item.addEventListener('click', (e) => {
                    if(e.target.closest('a')) return;
                    
                    const isChecked = !checkbox.checked;
                    checkbox.checked = isChecked;
                    
                    const key = item.dataset.settingKey;

                    if (key === 'enableJVCode') {
                        if (LecteurMedia.instance && LecteurMedia.instance.jvCodeManager) {
                            LecteurMedia.instance.jvCodeManager.toggle(isChecked);
                        }
                    }

                    SettingsManager.saveSettings({ [key]: checkbox.checked }).then(() => {
                        showToast();
                        if (LecteurMedia.instance && LecteurMedia.instance.embedManager) {
                            LecteurMedia.instance.embedManager.refreshActiveEmbeds();
                        }
                    });
                });
            });

            const bindSelect = (id, key) => {
                const el = panel.querySelector(id);
                if(el) {
                    el.value = settings[key];
                   el.addEventListener('change', (e) => {
                        SettingsManager.saveSettings({ [key]: e.target.value }).then(() => {
                            showToast();
                            if (LecteurMedia.instance && LecteurMedia.instance.embedManager) {
                                LecteurMedia.instance.embedManager.refreshActiveEmbeds();
                            }
                        });
                    });
                }
            };
            bindSelect('#lm-position-select', 'embedPosition');
            bindSelect('#lm-preview-mode-select', 'previewMode');

            const collapsibleItem = panel.querySelector('.setting-item[data-setting-key="collapsibleEmbeds"]');
            const startCollapsedItem = panel.querySelector('.setting-item[data-setting-key="startCollapsed"]');

            if (collapsibleItem && startCollapsedItem) {
                const collapsibleCheckbox = collapsibleItem.querySelector('input');

                const updateDependency = () => {
                    if (collapsibleCheckbox.checked) {
                        startCollapsedItem.classList.remove('is-disabled');
                    } else {
                        startCollapsedItem.classList.add('is-disabled');
                    }
                };

                updateDependency();

                collapsibleItem.addEventListener('click', () => {
                    setTimeout(updateDependency, 0);
                });
            }

            const addTopicBtn = panel.querySelector('#lm-add-topic-btn');
            const rulesListContainer = panel.querySelector('#lm-topic-rules-list');

            if (addTopicBtn && currentTopic) {
                addTopicBtn.addEventListener('click', () => {
                    const mode = panel.querySelector('#lm-topic-mode').value;
                    const ruleData = { title: currentTopic.title, mode: mode, addedAt: Date.now() };
                    
                    const newRules = { ...settings.topicRules, [currentTopic.id]: ruleData };
                    settings.topicRules = newRules;

                    SettingsManager.saveSettings({ topicRules: newRules }).then(() => {
                        showToast();

                        if (LecteurMedia.instance && LecteurMedia.instance.embedManager) {
                            LecteurMedia.instance.embedManager.refreshActiveEmbeds();
                        }
                        
                        const noMsg = panel.querySelector('#lm-no-rules-msg');
                        if (noMsg) noMsg.remove();
                        if (rulesListContainer.innerHTML.includes('Aucune exception')) rulesListContainer.innerHTML = '';

                        const newItemHtml = createRuleItemHtml(currentTopic.id, ruleData);
                        const existingBtn = rulesListContainer.querySelector(`button[data-topic-id="${currentTopic.id}"]`);
                        if (existingBtn) {
                            existingBtn.closest('.topic-rule-item').outerHTML = newItemHtml;
                        } else {
                            rulesListContainer.insertAdjacentHTML('beforeend', newItemHtml);
                        }

                        addTopicBtn.textContent = "Fait !";
                        setTimeout(() => addTopicBtn.textContent = "Ajouter", 1500);
                    });
                });
            }


            if (rulesListContainer) {
                rulesListContainer.addEventListener('click', (e) => {
                    if (e.target.classList.contains('lm-btn-delete')) {
                        const id = e.target.dataset.topicId;
                        
                        const newRules = { ...settings.topicRules };
                        delete newRules[id];
                        settings.topicRules = newRules;
                        
                        SettingsManager.saveSettings({ topicRules: newRules }).then(() => {
                            e.target.closest('.topic-rule-item').remove();
                            showToast();

                            if (LecteurMedia.instance && LecteurMedia.instance.embedManager) {
                                LecteurMedia.instance.embedManager.refreshActiveEmbeds();
                            }

                            if (rulesListContainer.children.length === 0) {
                                rulesListContainer.innerHTML = '<div id="lm-no-rules-msg" style="font-size:12px; color:var(--lm-text-muted); font-style:italic; padding:8px;">Aucune exception configurée.</div>';
                            }

                            if (typeof applyTopicRulesLive === 'function') {
                                applyTopicRulesLive(id, null);
                            }
                        });
                    }
                });
            }

            // Events: Providers Toggle
            panel.querySelectorAll('.provider-item').forEach(item => {
                item.addEventListener('click', () => {
                    const checkbox = item.querySelector('input');
                    const name = item.dataset.providerName;
                    checkbox.checked = !checkbox.checked;
                    item.classList.toggle('checked');
                    
                    let disabled = settings.disabledProviders || [];
                    if (checkbox.checked) disabled = disabled.filter(n => n !== name);
                    else if (!disabled.includes(name)) disabled.push(name);
                    
                    settings.disabledProviders = disabled;
                    SettingsManager.saveSettings({ disabledProviders: disabled }).then(showToast);
                });
            });
        });
    }

    // =========================================================================
    // == GESTIONNAIRE DE CACHE
    // =========================================================================
    const CacheManager = {
        EXPIRATION_MS: 24 * 60 * 60 * 1000, 

        _hash(str) {
            let hash = 5381;
            for (let i = 0; i < str.length; i++) {
                hash = ((hash << 5) + hash) + str.charCodeAt(i); 
            }
            return (hash >>> 0).toString(36) + str.length.toString(36);
        },

        async get(url) {
            const key = 'lm_cache_v3_' + this._hash(url); 
            const data = await GM_getValue(key, null);
            
            if (!data) return null;

            if (Date.now() > data.expires) {
                GM_deleteValue(key);
                return null;
            }
            return data.payload;
        },

        async set(url, payload) {
            const key = 'lm_cache_v3_' + this._hash(url);
            await GM_setValue(key, {
                payload: payload,
                expires: Date.now() + this.EXPIRATION_MS
            });
        }
    };

    //GM_registerMenuCommand('Configurer le Lecteur Média', () => openSettingsPanel(providers));

    // =========================================================================
    // == STYLES GLOBAUX
    // =========================================================================
    GM_addStyle(`
        .bloc-embed {
            margin: 1em 0;
            margin-top: 0;
            display: flex;
            justify-content: left;
        }
        .iframe-embed, .video-embed, .image-embed, .thumbnail-embed, .facebook-embed-placeholder {
            max-width: 550px;
            width: 100%;
            border-radius: 9px;
            border: none;
            display: block;
            background-color: #1c1c1c;
        }

        html:not(.theme-light) .facebook-embed-placeholder {
            border: 1px solid #444;
        }
        html.theme-light .facebook-embed-placeholder {
            background-color: #f0f2f5;
            border: 1px solid #ddd;
        }
        .iframe-twitter {
            height: 500px;
            background-color: transparent;
            transition: height 0.4s ease-in-out;
        }

        .iframe-giphy {
            aspect-ratio: 16 / 9;
            height: auto;
        }

        .iframe-streamable {
            height: auto;
        }

        .iframe-youtube, .iframe-streamable, .iframe-tiktok, .iframe-twitch, .iframe-vocaroo, .iframe-reddit, .iframe-giphy {
          max-height: 80vh;
        }
        .iframe-vertical-content {
            max-width: 320px;
            max-height: 65vh;
        }
        .iframe-youtube-short {
            aspect-ratio: 9 / 16;
            height: auto;
        }
        .iframe-youtube {
            aspect-ratio: 16 / 9;
            height: auto;
        }
        .youtube-facade-container {
            position: relative;
            display: block;
            aspect-ratio: 16 / 9;
            max-width: 550px;
            width: 100%;
        }
        .youtube-facade-overlay {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            cursor: pointer;
            background: transparent;
            z-index: 1;
        }
        .youtube-facade-container .iframe-youtube {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
        }
        @media (max-width: 768px) {
            .iframe-youtube,
            .youtube-facade-container {
                aspect-ratio: 5 / 4;
            }
        }

        .iframe-tiktok {
            height: auto;
            aspect-ratio: 9 / 16.5;
            max-height: 75vh;
            background-color: #000;
        }
        .iframe-twitch {
                aspect-ratio: 16 / 9;
                height: auto;
        }
        .iframe-vocaroo {
            max-width: 300px;
            width: 100%;
            height: 60px;
        }
        .iframe-reddit {
            height: 500px;
            background-color: transparent;
            transition: height 0.3s ease-in-out;
        }
        .video-embed, .image-embed, .thumbnail-embed {
             height: auto;
             max-height: 80vh;
             object-fit: contain;
        }
        .placeholder-embed {
            padding: 20px;
            text-align: center;
            border-radius: 12px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 1.4;
        }

        .placeholder-embed a {
            text-decoration: none;
            font-weight: 500;
        }

        html:not(.theme-light) .placeholder-embed {
            background-color: #2a2a2e;
            border: 1px solid #444;
        }
        html:not(.theme-light) .placeholder-embed a {
            color: #b9bbbe;
        }

        html.theme-light .placeholder-embed {
            background-color: #f0f2f5;
            border: 1px solid #ddd;
        }
        html.theme-light .placeholder-embed a {
            color: #555;
        }
        .twitter-loading-placeholder {
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            min-height: 120px;
        }

        html:not(.theme-light) .twitter-loading-placeholder {
            background-color: #1c1c1c;
            color: #b9bbbe;
        }

        html.theme-light .twitter-loading-placeholder {
            background-color: #f0f2f5;
            color: #555;
        }
        .tweet-unavailable-placeholder {
            display: flex;
            align-items: center;
            gap: 15px;
            text-align: left;
            padding: 15px 20px;
        }

        .tweet-unavailable-placeholder .icon-container {
            flex-shrink: 0;
        }

        .tweet-unavailable-placeholder .icon-container svg {
            width: 40px;
            height: 40px;
            opacity: 0.6;
        }

        .tweet-unavailable-placeholder .text-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .tweet-unavailable-placeholder strong {
            font-weight: 600;
            font-size: 15px;
        }
        html:not(.theme-light) .tweet-unavailable-placeholder strong {
            color: #e4e6eb;
        }
        html.theme-light .tweet-unavailable-placeholder strong {
            color: #050505;
        }

        .tweet-unavailable-placeholder .description {
            font-size: 13px;
        }
        html:not(.theme-light) .tweet-unavailable-placeholder .description {
            color: #b9bbbe;
        }
        html.theme-light .tweet-unavailable-placeholder .description {
            color: #65676b;
        }

        .tweet-unavailable-placeholder a {
            font-size: 13px;
            text-decoration: underline;
            opacity: 0.9;
        }
        .snapchat-embed-placeholder {
            max-width: 416px;
            min-height: 650px;
            background-color: #333;
            border-radius: 12px;
        }
        html.theme-light .snapchat-embed-placeholder {
            background-color: #e0e0e0;
        }
        .iframe-google-drive {
            height: 600px;
            max-height: 80vh;
            aspect-ratio: 4 / 3;
        }

        .iframe-google-slides {
            height: auto;
            aspect-ratio: 16 / 9;
        }
        .iframe-google-maps {
            aspect-ratio: 16 / 9;
            height: 450px;
            max-height: 75vh;
        }
        .dead-link-sticker {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-family: Arial, sans-serif;
            color: #8c8c8c;
            background-color: #f0f2f5;
            border: 1px solid transparent;
            padding: 5px 10px;
            border-radius: 8px;
        }
        html:not(.theme-light) .dead-link-sticker {
            color: #b9bbbe;
            background-color: transparent;
            border: transparent;
        }
        .dead-link-sticker img {
            width: 50px;
            height: auto;
        }
        .iframe-flourish {
            height: 450px;
            max-height: 85vh;
            background-color: #ffffff;
        }
        .thumbnail-embed img { width: 100%; height: 100%; object-fit: cover; }
        .thumbnail-embed { position: relative; cursor: pointer; overflow: hidden; }
        .jvchat-content .bloc-embed { justify-content: flex-start; }
        .instagram-placeholder { min-height: 450px; max-width: 500px; width: calc(100% - 20px); margin: 1em auto; border-radius: 8px; }
        .article-preview-card {
            max-width: 550px;
            width: 100%;
            border-radius: 12px;
            border: 1px solid #444;
            display: flex;
            flex-direction: column;
            text-decoration: none;
            overflow: hidden;
            transition: background-color 0.2s ease;
        }
        html:not(.theme-light) .article-preview-card {
            background-color: #2a2a2e;
        }
        html:not(.theme-light) .article-preview-card:hover {
            background-color: #333338;
        }
        html.theme-light .article-preview-card {
            border: 1px solid #ddd;
            background-color: #f0f2f5;
        }
        html.theme-light .article-preview-card:hover {
            background-color: #e8eaf0;
        }
       .article-preview-image {
            position: relative;
            width: 100%;
            aspect-ratio: 1.91 / 1;
            background-color: #2a2a2e;
            overflow: hidden;
            border-bottom: 1px solid #444;
        }
        html.theme-light .article-preview-image {
            background-color: #f0f2f5;
            border-bottom: 1px solid #ddd;
        }
        
        .article-preview-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            opacity: 0;
            transition: opacity 0.3s ease-in;
            color: transparent;
        }

        .article-preview-image img.loaded {
            opacity: 1;
        }

        .article-preview-content {
            padding: 12px 15px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .article-preview-title {
            font-size: 16px;
            font-weight: bold;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .article-preview-description {
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            max-height: 5.4em; /* Limite la hauteur visible à ~3 lignes */
            overflow-y: auto;
            padding-right: 5px;
        }
        .article-preview-footer {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 15px 12px;
        }
        .article-preview-favicon {
            width: 16px;
            height: 16px;
            border-radius: 3px;
        }
        .article-preview-footer .article-preview-sitename {
            font-size: 12px;
            font-family: Arial, sans-serif;
            text-transform: uppercase;
            line-height: 1;
        }
        html:not(.theme-light) .article-preview-footer .article-preview-sitename { color: #8c8c8c; }
        html.theme-light .article-preview-footer .article-preview-sitename { color: #65676b; }
        html:not(.theme-light) .article-preview-title { color: #e4e6eb; }
        html:not(.theme-light) .article-preview-description { color: #b9bbbe; }
        html.theme-light .article-preview-sitename { color: #65676b; }
        html.theme-light .article-preview-title { color: #050505; }
        html.theme-light .article-preview-description { color: #65676b; }
        .article-preview-card {
            line-height: normal;
        }
        .article-preview-description::-webkit-scrollbar {
            width: 8px;
        }
        html:not(.theme-light) .article-preview-description::-webkit-scrollbar-track {
            background: transparent;
        }
        html:not(.theme-light) .article-preview-description::-webkit-scrollbar-thumb {
            background-color: #4A4A4A;
            border-radius: 10px;
            border: 2px solid #2a2a2e;
        }
        html.theme-light .article-preview-description::-webkit-scrollbar-track {
            background: transparent;
        }
        html.theme-light .article-preview-description::-webkit-scrollbar-thumb {
            background-color: #C0C0C0;
            border-radius: 10px;
            border: 2px solid #f0f2f5;
        }

        .distrokid-embed-card {
            display: flex;
            align-items: center;
            max-width: 550px;
            width: 100%;
            border-radius: 12px;
            overflow: hidden;
            text-decoration: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            transition: background-color 0.2s ease;
        }
        html:not(.theme-light) .distrokid-embed-card {
            background-color: #2a2a2e;
            border: 1px solid #444;
        }
        html.theme-light .distrokid-embed-card {
            background-color: #f0f2f5;
            border: 1px solid #ddd;
        }
        html:not(.theme-light) .distrokid-embed-card:hover {
             background-color: #333338;
        }
        html.theme-light .distrokid-embed-card:hover {
            background-color: #e8eaf0;
        }

        .distrokid-album-art {
            width: 90px;
            height: 90px;
            flex-shrink: 0;
            background-size: cover;
            background-position: center;
        }

        .distrokid-content {
            flex-grow: 1;
            padding: 10px 15px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 90px;
            box-sizing: border-box;
        }

        .distrokid-title {
            font-size: 16px;
            font-weight: 600;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        html:not(.theme-light) .distrokid-title { color: #e4e6eb; }
        html.theme-light .distrokid-title { color: #050505; }

        .distrokid-artist {
            font-size: 14px;
        }
        html:not(.theme-light) .distrokid-artist { color: #b9bbbe; }
        html.theme-light .distrokid-artist { color: #65676b; }

        .distrokid-content audio {
            width: 100%;
            height: 30px;
        }

      .tweet-loading-overlay {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 15px;
          font-weight: 500;
          z-index: 10;
          border-radius: 9px;
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
      }
      html.theme-light .tweet-loading-overlay {
          background: rgba(255, 255, 255, 0.7);
          color: #0f1419;
      }
      .tweet-embed-wrapper {
          position: relative;
          display: block;
          line-height: 0;
      }

      .overlay-replies-button {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(20, 23, 26, 0.85);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          text-align: center;
          padding: 12px 0;
          cursor: pointer;
          border-bottom-left-radius: 9px;
          border-bottom-right-radius: 9px;
          transition: background-color 0.2s ease;
          display: block; /* Visible par défaut */
      }

      .tweet-embed-wrapper.showing-replies .overlay-replies-button {
          display: none;
      }
      .overlay-replies-button a {
          color: white;
          text-decoration: none;
          font-weight: 600;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 14px;
      }

      html.theme-light .overlay-replies-button {
          background: rgba(255, 255, 255, 0.8);
      }
      html.theme-light .overlay-replies-button a {
          color: #0f1419;
      }
      .iframe-pdf {
          height: 600px;
          max-height: 80vh;
          aspect-ratio: 4 / 3;
      }

      .bloc-embed {
          display: flex;
          justify-content: left;
      }

      .embed-collapsible {
          display: flex;
          flex-direction: column;
          max-width: 550px;
          width: 100%;
      }

      .embed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border: 1px solid transparent;
          border-radius: 9px;
          order: -1;
          width: 100%;
          box-sizing: border-box;
          cursor: pointer;
          /* On ajoute 'margin' et 'border-radius' à la transition */
          transition: margin 0.3s ease-in-out, border-color 0.2s ease, border-radius 0.3s ease-in-out;
      }

      .embed-collapsible:not(.collapsed) .embed-header {
          margin-top: -9px;
          margin-bottom: -5px;
          border-radius: 0;
      }

      .embed-info {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 12px;
          font-weight: 500;
          opacity: 0.5;
      }
      html:not(.theme-light) .embed-info { color: #b9bbbe; }
      html.theme-light .embed-info { color: #555; }


      @media (hover: hover) {

        }

      .toggle-embed-button {
            color: #b9bbbe;
        }
        .toggle-embed-button svg {
            width: 100%; height: 100%;
        }
        html.theme-light .toggle-embed-button {
            color: #555;
        }

      .media-content {
            display: grid;
            grid-template-rows: 1fr;
            transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
            opacity: 1;
        }

        .media-content > div {
            overflow: hidden;
        }

        .embed-collapsible.collapsed .media-content {
            grid-template-rows: 0fr;
            opacity: 0.5;
        }

      .media-content > * {
          border-radius: 9px;
        }

      .embed-collapsible.collapsed .embed-header {
          border-radius: 9px;
          background-color: transparent;
          border-color: #505050;
      }
      html.theme-light .embed-collapsible.collapsed .embed-header {
          border-color: #e0e0e0;
      }

      .embed-collapsible.collapsed .embed-info {
          opacity: 0.7;
      }
      .embed-collapsible.collapsed .toggle-embed-button {
          opacity: 0.8;
      }
      .embed-collapsible.collapsed .embed-header:hover .toggle-embed-button,
      .embed-collapsible.collapsed .embed-header:hover .embed-info {
          opacity: 1;
      }

    .toggle-embed-button {
        background-color: transparent;
        border: none;
        border-radius: 5px;
        width: 22px;
        height: 22px;
        padding: 2px;
        opacity: 0.6;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
    }

    .icon-collapse, .icon-expand {
        display: block;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    }

    html:not(.theme-light) .icon-collapse { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath d='M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z' fill='%23b9bbbe'/%3e%3c/svg%3e"); }
    html:not(.theme-light) .icon-expand { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z' fill='%23b9bbbe'/%3e%3c/svg%3e"); }

    html.theme-light .icon-collapse { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath d='M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z' fill='%23555'/%3e%3c/svg%3e"); }
    html.theme-light .icon-expand { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z' fill='%23555'/%3e%3c/svg%3e"); }

    .icon-collapse { display: block; }
    .icon-expand { display: none; }
    .embed-collapsible.collapsed .icon-collapse { display: none; }
    .embed-collapsible.collapsed .icon-expand { display: block; }

    .vxtwitter-embed {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: var(--text-bloc-principal, #d7d7d7);
        background-color: #16181C;
        border: 1px solid #38444d;
        border-radius: 12px;
        padding: 1rem;
        max-width: 550px;
        width: 100%;
        text-decoration: none;
        display: block;
        line-height: 1.4;
        overflow: hidden;
        max-height: min(85vh, 500px);
        overflow-y: auto;
        box-sizing: border-box;
    }
    .vxtwitter-embed.vxtwitter-full-height {
        max-height: none;
        overflow-y: visible;
    }
    .vxtwitter-embed::-webkit-scrollbar { width: 8px; }
    .vxtwitter-embed::-webkit-scrollbar-track { background: transparent; }
    .vxtwitter-embed::-webkit-scrollbar-thumb {
        background-color: #4A4A4A;
        border-radius: 10px;
        border: 2px solid #16181C;
    }
    html.theme-light .vxtwitter-embed {
        border-color: #cfd9de;
        color: #0f1419;
        background-color: #F7F9F9;
    }
    html.theme-light .vxtwitter-embed::-webkit-scrollbar-thumb {
        background-color: #C0C0C0;
        border: 2px solid #F7F9F9;
    }
    .vxtwitter-quoted-tweet, .parent-tweet-container {
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 12px;
    }
    html.theme-light .vxtwitter-quoted-tweet,
    html.theme-light .parent-tweet-container {
        background-color: rgba(0, 0, 0, 0.03);
    }
    .vxtwitter-header {
        display: flex;
        align-items: flex-start; /* Aligne l'avatar en haut du bloc d'infos */
        gap: 0.75rem;
        margin-bottom: 0.5rem;
    }
    .vxtwitter-header-left { display: flex; align-items: center; gap: 0.75rem; }
    .vxtwitter-header-date {
        color: #8899a6;
        font-size: 0.9em;
    }
    html.theme-light .vxtwitter-header-date { color: #536471; }
    .vxtwitter-avatar { width: 48px; height: 48px; border-radius: 9999px; }
    .vxtwitter-author {
        display: flex;
        align-items: baseline;
        gap: 0.3rem;
    }
    .vxtwitter-author-name {
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .vxtwitter-author-handle {
        color: #8899a6;
        font-size: 0.9em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex-shrink: 0;
    }
     html.theme-light .vxtwitter-author-handle { color: #536471; }
    .vxtwitter-replying-to { color: #8899a6; font-size: 0.9em; margin-bottom: 0.5rem; }
    .vxtwitter-text { white-space: pre-wrap; word-wrap: break-word; font-size: 1.1em; }
    .vxtwitter-text a { color: #1d9bf0; text-decoration: none; }
    .vxtwitter-text a:hover { text-decoration: underline; }
    .vxtwitter-media-grid {
        display: grid;
        gap: 2px;
        margin-top: 0.75rem;
        border-radius: 12px;
        overflow: hidden;
    }
    .vxtwitter-media-grid[data-count="1"] { grid-template-columns: 1fr; }
    .vxtwitter-media-grid[data-count="2"] { grid-template-columns: 1fr 1fr; }
    .vxtwitter-media-grid[data-count="3"] { grid-template-columns: 1fr 1fr; }
    .vxtwitter-media-grid[data-count="4"] { grid-template-columns: 1fr 1fr; }
    .vxtwitter-media-grid[data-count="3"] .media-item:first-child { grid-row: span 2; }
    .vxtwitter-media-item {
        background-color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .vxtwitter-media-item a { display: block; }
    .vxtwitter-media-item img, .vxtwitter-media-item video {
        display: block;
        max-width: 100%;
        width: 100%;
        height: auto;
        object-fit: contain;
        max-height: 50vh;
    }
    .vxtwitter-quoted-tweet {
        margin-top: 0.75rem;
        border: 1px solid #38444d;
        padding: 0.75rem;
    }
    html.theme-light .vxtwitter-quoted-tweet { border-color: #cfd9de; }
    .vxtwitter-quoted-tweet .vxtwitter-header { margin-bottom: 0.25rem; }
    .vxtwitter-quoted-tweet .vxtwitter-avatar { width: 24px; height: 24px; }
    .vxtwitter-quoted-tweet .vxtwitter-author-name { font-size: 0.9em; }
    .vxtwitter-quoted-tweet .vxtwitter-author-handle { font-size: 0.8em; }
    .vxtwitter-quoted-tweet .vxtwitter-text { font-size: 0.9em; }

    .vxtwitter-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #8899a6;
        margin-top: 0.75rem;
        padding-top: 0.5rem;
        gap: 1rem;
    }
    html.theme-light .vxtwitter-footer { color: #536471; }

    .vxtwitter-stats-group {
      display: flex;
      gap: 1rem;
      flex-shrink: 1;
      min-width: 0;
    }

    .vxtwitter-stats-group.is-overflowing::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 20px;
        pointer-events: none;
        background: linear-gradient(to right, transparent, #16181C 90%);
    }
    html.theme-light .vxtwitter-stats-group.is-overflowing::after {
        background: linear-gradient(to right, transparent, #F7F9F9 90%);
    }

    .vxtwitter-stat {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.85em;
        white-space: nowrap;
    }

    .vxtwitter-poll {
        margin-top: 0.75rem;
        border: 1px solid #38444d;
        border-radius: 12px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    html.theme-light .vxtwitter-poll {
        border-color: #cfd9de;
    }

    .vxtwitter-poll-option {
        position: relative;
        border-radius: 6px;
        overflow: hidden;
    }
    html:not(.theme-light) .vxtwitter-poll-option {
        color: #e4e6eb;
    }
    html.theme-light .vxtwitter-poll-option {
        color: #0f1419;
    }
    .vxtwitter-poll-text {
        position: relative;
        z-index: 2;
        padding: 8px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.95em;
        font-weight: 500;
    }
    .vxtwitter-poll-option.winner .vxtwitter-poll-option-name {
        font-weight: bold;
    }

    .vxtwitter-poll-bar {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        z-index: 1;
        background-color: rgba(29, 155, 240, 0.4);
        transition: width 0.5s ease-out;
    }

    .vxtwitter-poll-option.winner .vxtwitter-poll-bar {
        background-color: rgb(29, 155, 240);
    }

    html.theme-light .vxtwitter-poll-bar {
        background-color: rgba(29, 155, 240, 0.2);
    }
    html.theme-light .vxtwitter-poll-option.winner .vxtwitter-poll-bar {
        background-color: rgba(29, 155, 240, 0.4);
    }

    .vxtwitter-poll-footer {
        font-size: 0.85em;
        padding: 4px 4px 0;
    }
    html:not(.theme-light) .vxtwitter-poll-footer {
        color: #8899a6;
    }
    html.theme-light .vxtwitter-poll-footer {
        color: #536471;
    }
   .vxtwitter-community-note {
        margin-top: 0.75rem;
        border-radius: 12px;
        overflow: hidden;
        font-size: 0.9em;
    }
    html:not(.theme-light) .vxtwitter-community-note {
        border: 1px solid #454A4D;
        color: #E4E6EB;
    }
    html.theme-light .vxtwitter-community-note {
        border: 1px solid #CFD9DE;
        color: #0F1419;
    }

    .cn-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
    }
    html:not(.theme-light) .cn-header {
        background-color: #272B2D;
    }
    html.theme-light .cn-header {
        background-color: #EFF3F4;
    }

    .cn-title {
        font-weight: bold;
    }

    .cn-icon {
        display: inline-block;
        width: 1.25em;
        height: 1.25em;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        flex-shrink: 0;
    }
    html:not(.theme-light) .cn-icon {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23B1B8BE'%3e%3cpath d='M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'%3e%3c/path%3e%3c/svg%3e");
    }
    html.theme-light .cn-icon {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23536471'%3e%3cpath d='M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'%3e%3c/path%3e%3c/svg%3e");
    }
    .cn-body {
        padding: 0.75rem;
    }

    .cn-text {
        line-height: 1.4;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
    .cn-text a {
        color: #1d9bf0;
        text-decoration: none;
    }
    .cn-text a:hover {
        text-decoration: underline;
    }

    .cn-footer-link {
        display: block;
        margin-top: 0.75rem;
        font-size: 0.9em;
        text-decoration: none;
    }
    html:not(.theme-light) .cn-footer-link {
        color: #8899a6;
    }
    html.theme-light .cn-footer-link {
        color: #536471;
    }
    .cn-footer-link:hover {
        text-decoration: underline;
    }
    .vxtwitter-nitter-link {
        flex-shrink: 0;
        font-size: 0.85em;
        color: #8899a6;
        text-decoration: none;
        white-space: nowrap;
    }
    .vxtwitter-nitter-link:hover { text-decoration: underline; }
    html.theme-light .vxtwitter-nitter-link { color: #536471; }

    .vxtwitter-icon {
    display: block;
    width: 1.2em;
    height: 1.2em;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    position: relative; /* Permet de déplacer l'élément */
    top: 1px;           /* Pousse l'icône de 1px vers le bas */
}
    /* -- Icônes Thème Sombre -- */
    html:not(.theme-light) .vx-icon-reply { background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='%238899a6' d='M19 4H5a2 2 0 0 0-2 2v15l3.467-2.6a2 2 0 0 1 1.2-.4H19a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z'/%3e%3c/svg%3e"); }
    html:not(.theme-light) .vx-icon-retweet { background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3e%3cg%3e%3cpath fill='%238899a6' d='M51.6 28.8l-2.1-2.1c-.6-.6-1.5-.6-2.1 0l-2.7 2.7C44 30.1 43 29.6 43 28.7V14v-2c0-2.2-1.8-4-4-4h-.6H24.5c-.8 0-1.5.7-1.5 1.5v3c0 .8.7 1.5 1.5 1.5h11c.8 0 1.5.7 1.5 1.5v13.2c0 .9-1.1 1.3-1.8.7l-2.6-2.6c-.6-.6-1.6-.6-2.1 0L28.4 29c-.6.6-.6 1.5 0 2.1l10.5 10.5c.6.6 1.5.6 2.1 0L51.6 31c.5-.6.5-1.6 0-2.2z'/%3e%3cpath fill='%238899a6' d='M27.5 38h-11c-.8 0-1.5-.7-1.5-1.5V23.3c0-.9 1.1-1.3 1.8-.7l2.6 2.6c.6.6 1.6.6 2.1 0l2.1-2.1c.6-.6.6-1.5 0-2.1L13.2 10.4c-.6-.6-1.5-.6-2.1 0L.4 21c-.6.6-.6 1.5 0 2.1l2.1 2.1c.6.6 1.5.6 2.1 0l2.7-2.7C7.9 21.9 9 22.3 9 23.2V38v2c0 2.2 1.9 4 4.1 4h.6h13.9c.8 0 1.5-.7 1.5-1.5v-3c0-.8-.7-1.5-1.5-1.5z'/%3e%3c/g%3e%3c/svg%3e"); }
    html:not(.theme-light) .vx-icon-like { background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='%238899a6' d='M31 11c0 11-14 18-15 18S1 22 1 11c0-4.4 3.6-8 8-8c3 0 5.6 1.7 7 4.1C17.4 4.7 20 3 23 3c4.4 0 8 3.6 8 8z'/%3e%3c/svg%3e"); }
    /* -- Icônes Thème Clair -- */
    html.theme-light .vx-icon-reply { background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='%23536471' d='M19 4H5a2 2 0 0 0-2 2v15l3.467-2.6a2 2 0 0 1 1.2-.4H19a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z'/%3e%3c/svg%3e"); }
    html.theme-light .vx-icon-retweet { background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3e%3cg%3e%3cpath fill='%23536471' d='M51.6 28.8l-2.1-2.1c-.6-.6-1.5-.6-2.1 0l-2.7 2.7C44 30.1 43 29.6 43 28.7V14v-2c0-2.2-1.8-4-4-4h-.6H24.5c-.8 0-1.5.7-1.5 1.5v3c0 .8.7 1.5 1.5 1.5h11c.8 0 1.5.7 1.5 1.5v13.2c0 .9-1.1 1.3-1.8.7l-2.6-2.6c-.6-.6-1.6-.6-2.1 0L28.4 29c-.6.6-.6 1.5 0 2.1l10.5 10.5c.6.6 1.5.6 2.1 0L51.6 31c.5-.6.5-1.6 0-2.2z'/%3e%3cpath fill='%23536471' d='M27.5 38h-11c-.8 0-1.5-.7-1.5-1.5V23.3c0-.9 1.1-1.3 1.8-.7l2.6 2.6c.6.6 1.6.6 2.1 0l2.1-2.1c.6-.6.6-1.5 0-2.1L13.2 10.4c-.6-.6-1.5-.6-2.1 0L.4 21c-.6.6-.6 1.5 0 2.1l2.1 2.1c.6.6 1.5.6 2.1 0l2.7-2.7C7.9 21.9 9 22.3 9 23.2V38v2c0 2.2 1.9 4 4.1 4h.6h13.9c.8 0 1.5-.7 1.5-1.5v-3c0-.8-.7-1.5-1.5-1.5z'/%3e%3c/g%3e%3c/svg%3e"); }
    html.theme-light .vx-icon-like { background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='%23536471' d='M31 11c0 11-14 18-15 18S1 22 1 11c0-4.4 3.6-8 8-8c3 0 5.6 1.7 7 4.1C17.4 4.7 20 3 23 3c4.4 0 8 3.6 8 8z'/%3e%3c/svg%3e"); }

    .parent-tweet-container {
        padding-left: 24px;
        border-left: 2px solid #38444d;
        margin-left: 24px;
        margin-bottom: 0.5rem;
        padding-bottom: 0.5rem;
        padding-right: 12px;
    }
    html.theme-light .parent-tweet-container {
        border-left-color: #cfd9de;
    }
    .vxtwitter-author-info {
        display: flex;
        flex-direction: column;
        line-height: 1.3;
        min-width: 0;
    }
    @media (max-width: 768px) {
        .vxtwitter-text {
            font-size: 1em;
        }
    }

    .vxtwitter-text-collapsible {
        max-height: 12em;
        overflow: hidden;
        position: relative;
        transition: max-height 0.3s ease-out;
    }
    .vxtwitter-text-collapsible:not(.vxtwitter-text-expanded)::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3em;
        background: linear-gradient(to bottom, transparent, #16181C);
        pointer-events: none;
    }
    html.theme-light .vxtwitter-text-collapsible:not(.vxtwitter-text-expanded)::after {
        background: linear-gradient(to bottom, transparent, #F7F9F9);
    }
    .vxtwitter-text-expanded {
        max-height: 1500px;
    }

    .vxtwitter-show-more {
        display: inline-block;
        margin-top: 8px;
        padding: 6px 12px;
        font-size: 0.85em;
        font-weight: 500;
        border-radius: 15px;
        text-decoration: none;
        transition: background-color 0.2s ease;
        cursor: pointer;
    }
    html:not(.theme-light) .vxtwitter-show-more {
        background-color: #2a2a2e;
        color: #e4e6eb;
        border: 1px solid #38444d;
    }
    html:not(.theme-light) .vxtwitter-show-more:hover {
        background-color: #333338;
    }
    html.theme-light .vxtwitter-show-more {
        background-color: #e8eaf0;
        color: #0f1419;
        border: 1px solid #cfd9de;
    }
    html.theme-light .vxtwitter-show-more:hover {
        background-color: #dde0e4;
    }
    .vxtwitter-stats-group.is-rotating {
        position: relative;
        min-height: 1.2em;
    }
    .vxtwitter-stats-group.is-rotating > .vxtwitter-stat {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
        pointer-events: none;
    }

    .vxtwitter-stats-group.is-rotating > .vxtwitter-stat.is-active {
        position: relative;
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
}

    @keyframes lm-spin {
        to { transform: rotate(360deg); }
    }

    .lm-loader-container {
        position: absolute;
        top: 0; left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 12px;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10;
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        transition: opacity 0.3s ease;
    }
    html.theme-light .lm-loader-container {
        background: rgba(255, 255, 255, 0.7);
    }

    .lm-spinner {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border-width: 4px;
        border-style: solid;
        animation: lm-spin 0.8s linear infinite;
    }
    html:not(.theme-light) .lm-spinner {
        border-color: rgba(255, 255, 255, 0.2);
        border-top-color: #fff;
    }
    html.theme-light .lm-spinner {
        border-color: rgba(0, 0, 0, 0.1);
        border-top-color: #333;
    }

    .lm-loader-text {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 14px;
        font-weight: 500;
    }
    html:not(.theme-light) .lm-loader-text {
        color: #e4e6eb;
    }
    html.theme-light .lm-loader-text {
        color: #0f1419;
    }

      .discord-invite-card {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          max-width: 550px;
          width: 100%;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          line-height: 1.4;
      }
      .discord-header {
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
          flex-grow: 1;
          min-width: 0;
      }
      .discord-server-icon {
          width: 50px;
          height: 50px;
          border-radius: 15px;
          flex-shrink: 0;
          object-fit: cover;
      }
      .discord-server-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow: hidden;
          flex-grow: 1;
          min-width: 0;
      }
      .discord-server-name {
          font-size: 16px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          align-items: center;
          gap: 6px;
      }
      .discord-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
      }
      .discord-verified-badge { color: #23a55a; }
      .discord-partnered-badge { color: #5865f2; }

      .discord-member-counts {
          display: flex;
          align-items: center;
          font-size: 13px;
      }
      .discord-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 4px;
      }
      .discord-count {
          margin-right: 12px;
      }
      .discord-join-button {
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          flex-shrink: 0;
          transition: background-color 0.2s ease, transform 0.1s ease;
          margin-left: 12px;
      }
      .discord-join-button:active {
          transform: scale(0.97);
      }

      .discord-loading-placeholder, .discord-error-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 14px;
          height: 82px;
          box-sizing: border-box;
          border-radius: 12px;
      }

      /* -- Thème Sombre -- */
      html:not(.theme-light) .discord-invite-card {
          background-color: #2a2a2e;
          border: 1px solid #444;
      }
      html:not(.theme-light) .discord-server-name {
          color: #e4e6eb;
      }
      html:not(.theme-light) .discord-member-counts {
          color: #b9bbbe;
      }
      html:not(.theme-light) .discord-status-dot.discord-online {
          background-color: #23a55a;
      }
      html:not(.theme-light) .discord-status-dot.discord-offline {
          background-color: #80848e;
      }
      html:not(.theme-light) .discord-join-button {
          background-color: #404eed;
          color: #fff;
      }
      html:not(.theme-light) .discord-join-button:hover {
          background-color: #3642d3;
      }
      html:not(.theme-light) .discord-loading-placeholder,
      html:not(.theme-light) .discord-error-placeholder {
          background-color: #1c1c1c;
          color: #b9bbbe;
      }

      /* -- Thème Clair -- */
      html.theme-light .discord-invite-card {
          background-color: #f0f2f5;
          border: 1px solid #ddd;
      }
      html.theme-light .discord-server-name {
          color: #050505;
      }
      html.theme-light .discord-member-counts {
          color: #65676b;
      }
      html.theme-light .discord-status-dot.discord-online {
          background-color: #2dc770;
      }
      html.theme-light .discord-status-dot.discord-offline {
          background-color: #96989e;
      }
      html.theme-light .discord-join-button {
          background-color: #5865f2;
          color: #fff;
      }
      html.theme-light .discord-join-button:hover {
          background-color: #4a54d4;
      }
      html.theme-light .discord-loading-placeholder,
      html.theme-light .discord-error-placeholder {
          background-color: #f0f2f5;
          color: #555;
      }

      .embed-info-container {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
      }
      .embed-favicon {
          width: 16px;
          height: 16px;
          border-radius: 3px;
          flex-shrink: 0;
      }
      .embed-info {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
      }
      /* -- Styles pour l'embed Stack Overflow -- */
      .so-embed-wrapper {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          border: 1px solid var(--border-bloc-principal, #4a4a4a);
          border-radius: 9px;
          max-width: 550px;
          width: 100%;
          background-color: var(--bg-bloc-content, #252525);
          line-height: 1.5;
          overflow: hidden;
      }
      html.theme-light .so-embed-wrapper {
          background-color: #f9f9f9;
      }

      .so-question-header {
          padding: 12px 15px;
          border-bottom: 1px solid var(--border-bloc-principal, #4a4a4a);
      }

      .so-question-header a {
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          color: #3ca4ff;
      }
      .so-question-header a:hover {
          color: #69bfff;
      }
      html.theme-light .so-question-header a {
          color: #0077cc;
      }
      html.theme-light .so-question-header a:hover {
          color: #005999;
      }


      .so-answer-body {
          padding: 0 15px 15px 15px;
          font-size: 14px;
          max-height: 400px;
          overflow-y: auto;
          color: var(--text-bloc-principal, #d7d7d7);
      }
      html.theme-light .so-answer-body {
          color: #242729;
      }

      /* Styles pour les barres de défilement */
      .so-answer-body::-webkit-scrollbar { width: 8px; }
      .so-answer-body::-webkit-scrollbar-track { background: transparent; }
      .so-answer-body::-webkit-scrollbar-thumb {
          background-color: #4A4A4A;
          border-radius: 10px;
          border: 2px solid var(--bg-bloc-content, #252525);
      }
      html.theme-light .so-answer-body::-webkit-scrollbar-thumb {
          background-color: #C0C0C0;
          border: 2px solid #f9f9f9;
      }

      /* Styles pour le code */
      .so-answer-body pre {
          background-color: var(--bg-bloc-code, #1c1c1c);
          border: 1px solid var(--border-bloc-principal, #3a3a3a);
          border-radius: 6px;
          padding: 12px;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: "Consolas", "Menlo", "Monaco", "Courier New", monospace;
          font-size: 13px;
      }
      html.theme-light .so-answer-body pre {
          background-color: #f0f2f5;
          border-color: #e0e0e0;
      }

      .so-answer-body code {
          background-color: rgba(135,131,120,0.15);
          color: #eb5757;
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 0.9em;
      }
      html.theme-light .so-answer-body code {
          background-color: rgba(30,30,30,0.07);
          color: #c7254e;
      }
      .so-answer-body pre code {
          background: none;
          color: inherit;
          padding: 0;
      }


      .so-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 15px;
          background-color: rgba(0,0,0,0.15);
          border-top: 1px solid var(--border-bloc-principal, #4a4a4a);
          font-size: 13px;
      }
      html.theme-light .so-footer {
          background-color: rgba(0,0,0,0.03);
      }

      .so-score {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: bold;
          color: #2f9a4c;
      }
      .so-score.so-score-negative {
          color: #d13c3c;
      }

      .so-author {
          color: var(--text-color-meta, #888);
          opacity: 0.8;
      }
      html.theme-light .so-author {
          color: #525960;
      }

      .lm-settings-button-modern {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          padding: 10px 15px;
          margin: 12px 1rem 4px 1rem; 
          border-radius: 8px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.1s ease;
      }
      .lm-settings-button-modern:active {
          transform: scale(0.98);
      }
      .lm-settings-button-modern svg {
          width: 18px;
          height: 18px;
      }

      html:not(.theme-light) .lm-settings-button-modern {
          background-color: #3a3f44;
          color: #e4e6eb;
          border: 1px solid #4a4a4f;
      }
      html:not(.theme-light) .lm-settings-button-modern:hover {
          background-color: #4b5157;
      }

      html.theme-light .lm-settings-button-modern {
          background-color: #e4e6eb;
          color: #050505;
          border: 1px solid #dcdfe2;
      }
      html.theme-light .lm-settings-button-modern:hover {
          background-color: #d8dbdf;
      }
      .lm-settings-menu-item {
          display: flex !important;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s ease;
      }
      .lm-settings-menu-item .lm-settings-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
      }
      html:not(.theme-light) .lm-settings-menu-item {
          color: #dcddde;
      }
      html:not(.theme-light) .lm-settings-menu-item:hover {
          background-color: #3a3f44;
      }
      html.theme-light .lm-settings-menu-item {
          color: #050505;
      }
      html.theme-light .lm-settings-menu-item:hover {
          background-color: #f0f2f5;
      }

        @keyframes skeleton-pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }

        .skeleton-card {
            height: 300px;
            background-color: #2a2a2e;
            border-color: #444;
        }
        html.theme-light .skeleton-card {
            background-color: #f0f2f5;
            border-color: #ddd;
        }

        .skeleton-image {
            width: 100%;
            height: 180px;
            background-color: #3a3a3a;
            animation: skeleton-pulse 1.5s infinite ease-in-out;
        }
        html.theme-light .skeleton-image { background-color: #dce0e6; }

        .skeleton-content { padding: 15px; display: flex; flex-direction: column; gap: 10px; }

        .skeleton-line {
            height: 14px;
            background-color: #3a3a3a;
            border-radius: 4px;
            animation: skeleton-pulse 1.5s infinite ease-in-out;
        }
        html.theme-light .skeleton-line { background-color: #dce0e6; }

        .skeleton-line.title { width: 70%; height: 20px; margin-bottom: 5px; }
        .skeleton-line.text { width: 90%; }

        /* Animation de pulsation */
        @keyframes skeleton-loading {
            0% { background-position: 100% 50%; }
            100% { background-position: 0 50%; }
        }

        .tweet-skeleton {
            padding: 1rem;
            border: 1px solid #38444d;
            border-radius: 12px;
            background: #16181C;
            max-width: 550px;
            width: 100%;
            box-sizing: border-box;
        }
        html.theme-light .tweet-skeleton {
            background: #F7F9F9;
            border-color: #cfd9de;
        }

        .sk-header { display: flex; gap: 10px; margin-bottom: 10px; }
        .sk-avatar { width: 48px; height: 48px; border-radius: 50%; background: #333; }
        .sk-meta { display: flex; flex-direction: column; gap: 6px; justify-content: center; }
        .sk-line { height: 10px; border-radius: 4px; background: linear-gradient(90deg, #333 25%, #444 37%, #333 63%); background-size: 400% 100%; animation: skeleton-loading 1.4s ease infinite; }
        .sk-line.short { width: 100px; }
        .sk-line.medium { width: 180px; }
        .sk-line.long { width: 100%; height: 60px; margin-top: 10px; }

        html.theme-light .sk-avatar, html.theme-light .sk-line {
            background: #e1e8ed;
            background: linear-gradient(90deg, #e1e8ed 25%, #f5f8fa 37%, #e1e8ed 63%);
            background-size: 400% 100%;
        }

        .instagram-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 150px;
            background: #1c1c1c;
            color: #888;
            border-radius: 8px;
            font-family: sans-serif;
            font-size: 14px;
            gap: 10px;
        }
        html.theme-light .instagram-loading { background: #f0f2f5; color: #555; }

   
    .insta-profile-card {
        display: flex; flex-direction: column;
        width: 100%; max-width: 500px;
        background-color: #000000;
        border: 1px solid #363636;
        border-radius: 12px;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        margin-top: 5px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    html.theme-light .insta-profile-card { background-color: #ffffff; border: 1px solid #dbdbdb; }
    .insta-profile-card a { text-decoration: none; color: inherit; }

    /* --- EN-TÊTE --- */
    .insta-header {
        display: flex; align-items: center; padding: 12px 16px;
        border-bottom: 1px solid #262626;
    }
    html.theme-light .insta-header { border-bottom: 1px solid #efefef; }

    .insta-avatar-img {
        width: 40px; height: 40px; border-radius: 50%;
        object-fit: cover; border: 1px solid #333; flex-shrink: 0; display: block;
    }
    /* Avatar générique quand VX ne donne pas l'image */
    .insta-avatar-generic {
        width: 40px; height: 40px; border-radius: 50%;
        background-color: #262626; color: #8e8e8e; 
        display: flex; align-items: center; justify-content: center; font-size: 20px;
    }
    html.theme-light .insta-avatar-generic { background-color: #efefef; }

    .insta-details {
        display: flex; flex-direction: column; justify-content: center;
        margin-left: 12px; overflow: hidden; flex: 1; min-width: 0;
    }

    .insta-name-row { display: flex; align-items: center; gap: 4px; min-width: 0; }

    .insta-fullname {
        font-size: 14px; font-weight: 600; color: #f5f5f5;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        display: block;
    }
    html.theme-light .insta-fullname { color: #262626; }

    .insta-verified { width: 14px; height: 14px; color: #0095f6; flex-shrink: 0; display: block; }

    .insta-username { 
        font-size: 12px; color: #a8a8a8; margin-top: 1px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;
    }
    html.theme-light .insta-username { color: #8e8e8e; }

    /* --- ZONE MÉDIA --- */
    .insta-media-container {
        width: 100%; background: #000;
        display: flex; justify-content: center; align-items: center;
        min-height: 200px;
    }
    .insta-media-container video, 
    .insta-media-container img {
        max-height: 600px; width: 100%; object-fit: contain; display: block;
    }

    /* --- PIED DE PAGE (Description) --- */
    .insta-meta {
        padding: 12px 16px;
        border-top: 1px solid #262626;
        font-size: 14px;
    }
    html.theme-light .insta-meta { border-top: 1px solid #efefef; }

    .insta-likes { font-weight: 600; margin-bottom: 6px; color: #f5f5f5; display: block; }
    html.theme-light .insta-likes { color: #262626; }

    html.theme-light .insta-caption { color: #262626; }

    /* Classe ajoutée par JS pour afficher tout le texte */
    .insta-caption.expanded {
        display: block;
        -webkit-line-clamp: unset;
    }

    .insta-show-more {
        color: #a8a8a8; cursor: pointer; font-size: 12px; margin-top: 4px; display: inline-block;
    }
    .insta-show-more:hover { text-decoration: underline; }

    /* --- GRILLE PROFIL --- */
    .insta-preview-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
        background-color: #262626;
    }
    html.theme-light .insta-preview-grid { background-color: #efefef; }
    
    .insta-preview-item {
        display: block; aspect-ratio: 1/1;
        background-size: cover; background-position: center; 
        background-color: #1c1c1c; transition: opacity 0.2s;
    }
    .insta-preview-item:hover { opacity: 0.8; }

    /* --- FOOTER LIEN --- */
    .insta-footer {
        display: block; padding: 10px; text-align: center; font-size: 13px; 
        color: #0095f6; font-weight: 600; 
        background: rgba(0, 149, 246, 0.1); border-top: 1px solid #262626;
    }
    html.theme-light .insta-footer { border-top: 1px solid #efefef; }
    .insta-footer:hover { background: rgba(0, 149, 246, 0.15); }

    .insta-private-msg {
        padding: 20px; text-align: center; font-size: 13px; color: #a8a8a8;
        background: #121212; border-top: 1px solid #333;
    }
    html.theme-light .insta-private-msg { background: #fafafa; border-top: 1px solid #efefef; }

     .insta-likes-row {
        display: flex;
        align-items: center;
        font-weight: 600;
        margin-bottom: 2px; /* Réduit de 4px à 2px pour coller à la caption */
        color: #f5f5f5;
        padding-bottom: 0; /* Sécurité */
    }
    html.theme-light .insta-likes-row { color: #262626; }

    .insta-caption {
        color: #f5f5f5; 
        font-size: 13px; 
        line-height: 1.4; /* Interligne standard Instagram */
        overflow: hidden;
        display: -webkit-box; 
        -webkit-line-clamp: 2; 
        -webkit-box-orient: vertical;
        white-space: normal; /* CORRECTION IMPORTANTE : Empêche le rendu de l'indentation du code */
        margin-top: 0; /* Colle aux likes */
    }

    .insta-caption.collapsible {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .insta-caption.expanded {
        display: block;
        -webkit-line-clamp: unset;
    }
    /* --- CAROUSEL INSTAGRAM (Stories & Albums) --- */
    .insta-carousel-container {
        position: relative;
        background: #000;
        min-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-radius: 4px;
    }
    .insta-slide {
        display: none;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
    }
    .insta-slide.active {
        display: flex;
    }
    .insta-nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.6);
        color: white;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        z-index: 10;
        transition: background 0.2s, opacity 0.2s;
        user-select: none;
    }
    .insta-nav-btn:hover { background: rgba(0, 0, 0, 0.9); }
    .insta-nav-btn.hidden { display: none; }
    .insta-nav-prev { left: 10px; }
    .insta-nav-next { right: 10px; }
    .insta-counter {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        pointer-events: none;
        z-index: 10;
    }
    @keyframes insta-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }

    .insta-media-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 250px; /* Hauteur min pour voir le skeleton */
        background-color: #1c1c1c; /* Fond sombre par défaut */
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    /* Le squelette qui se superpose au média */
    .insta-skeleton-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: linear-gradient(90deg, #1c1c1c 25%, #2a2a2e 50%, #1c1c1c 75%);
        background-size: 200% 100%;
        animation: insta-shimmer 1.5s infinite;
        z-index: 5;
        pointer-events: none; /* Permet de cliquer à travers si besoin */
        transition: opacity 0.3s ease-out;
    }

    /* Le média (Vidéo/Image) est caché (opacité 0) au début */
    .insta-media-element {
        opacity: 0;
        transition: opacity 0.5s ease-in;
        width: 100%;
        max-height: 600px; 
        object-fit: contain;
        display: block;
    }

    /* Une fois chargé, on affiche le média */
    .insta-media-element.loaded {
        opacity: 1;
    }

    /* Thème clair pour le skeleton */
    html.theme-light .insta-media-wrapper { background-color: #f0f2f5; }
    html.theme-light .insta-skeleton-overlay {
        background: linear-gradient(90deg, #f0f2f5 25%, #e4e6eb 50%, #f0f2f5 75%);
        background-size: 200% 100%;
    }

    /* === GOOGLE SUPPORT CARD === */
        .google-support-card {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 550px;
            border-radius: 12px;
            overflow: hidden;
            background-color: #202124; /* Fond Dark Google */
            border: 1px solid #3c4043;
            font-family: 'Google Sans', Roboto, Arial, sans-serif;
            transition: box-shadow 0.2s, background-color 0.2s;
        }
        .google-support-card:hover {
            background-color: #303134;
        }
        
        /* Version Light */
        html.theme-light .google-support-card {
            background-color: #ffffff;
            border: 1px solid #dadce0;
            box-shadow: 0 1px 3px rgba(60,64,67,0.3);
        }
        html.theme-light .google-support-card:hover {
            background-color: #f8f9fa;
            box-shadow: 0 4px 6px rgba(60,64,67,0.15);
        }

        .gs-header {
            padding: 16px 16px 0;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .gs-icon-wrapper {
            background: #fff;
            border-radius: 50%;
            padding: 4px;
            width: 32px; height: 32px;
            display: flex; align-items: center; justify-content: center;
        }
        .gs-product-name {
            font-size: 14px;
            color: #9aa0a6;
            font-weight: 500;
        }
        html.theme-light .gs-product-name { color: #5f6368; }

        .gs-body {
            padding: 12px 16px 16px;
        }
        .gs-title {
            font-size: 18px;
            color: #e8eaed;
            font-weight: 400;
            margin-bottom: 8px;
            line-height: 1.4;
        }
        html.theme-light .gs-title { color: #202124; }

        .gs-desc {
            font-size: 14px;
            color: #bdc1c6;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        html.theme-light .gs-desc { color: #5f6368; }

        .gs-footer {
            border-top: 1px solid #3c4043;
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #8ab4f8;
            font-size: 14px;
            font-weight: 500;
        }
        html.theme-light .gs-footer {
            border-top: 1px solid #dadce0;
            color: #1a73e8;
        }
        .setting-item.is-disabled {
            opacity: 0.5;
            pointer-events: none;
            filter: grayscale(100%);
            cursor: not-allowed;
        }

        .radio-embed-card {
            display: flex;
            align-items: center;
            max-width: 550px;
            width: 100%;
            border-radius: 12px;
            overflow: hidden;
            background-color: #1a1a1a;
            border: 1px solid #333;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        
        html.theme-light .radio-embed-card {
            background-color: #f0f2f5;
            border-color: #ddd;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .radio-cover {
            width: 100px;
            height: 100px;
            background-size: cover;
            background-position: center;
            background-color: #000;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .radio-overlay-icon {
            font-size: 24px;
            color: rgba(255,255,255,0.8);
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            opacity: 0.8;
        }

        .radio-content {
            flex-grow: 1;
            padding: 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 8px;
            min-width: 0;
        }

        .radio-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .radio-title {
            font-size: 18px;
            font-weight: 700;
            color: #fff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        html.theme-light .radio-title { color: #333; }

        .radio-live-badge {
            background-color: #e91e63;
            color: white;
            font-size: 10px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 4px;
            letter-spacing: 0.5px;
            animation: radio-pulse 2s infinite;
        }

        @keyframes radio-pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
        }

        .radio-content audio {
            width: 100%;
            height: 30px;
            border-radius: 4px;
            outline: none;
        }
        .radio-content audio::-webkit-media-controls-panel {
            background-color: #f2f2f2;
        }
        html:not(.theme-light) .radio-content audio {
            filter: invert(0.9);
        }

        .lm-skeleton-wrapper {
            transition: height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            display: block;
            will-change: height;
        }

        .article-preview-card.animate-in {
            animation: lm-fade-slide-in 0.4s ease-out forwards;
            opacity: 0;
        }
        @keyframes lm-fade-slide-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .article-preview-image.img-loading {
            background-color: #3a3a3a;
            animation: skeleton-pulse 1.5s infinite ease-in-out;
        }
        html.theme-light .article-preview-image.img-loading {
            background-color: #dce0e6;
        }

        .article-preview-skeleton-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 2;
            background: linear-gradient(90deg, #2a2a2e 0%, #3a3a3a 50%, #2a2a2e 100%);
            background-size: 200% 100%;
            animation: lm-shimmer 1.5s infinite;
            pointer-events: none;
        }
        html.theme-light .article-preview-skeleton-overlay {
            background: linear-gradient(90deg, #f0f2f5 0%, #ffffff 50%, #f0f2f5 100%);
            background-size: 200% 100%;
        }
        .article-preview-img-element {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            opacity: 0;
            transition: opacity 0.5s ease-in;
            position: relative;
            z-index: 1;
        }
        .article-preview-img-element.loaded {
            opacity: 1;
        }
        @keyframes lm-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        .article-preview-card.dead-link {
            background-color: #2a2a2e;
            opacity: 0.8;
        }
        html.theme-light .article-preview-card.dead-link {
            background-color: #fff5f5;
            border-color: #ffebe9; 
        }
        .article-preview-card.dead-link .article-preview-title {
            color: #e06c75;
        }
        html.theme-light .article-preview-card.dead-link .article-preview-title {
            color: #d32f2f;
        }
    `);


    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const foundElement = document.querySelector(selector);
            if (foundElement) {
                obs.disconnect();
                callback(foundElement);
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // =========================================================================
    // == AJOUT DU BOUTON DE CONFIGURATION À L'INTERFACE JVC
    // =========================================================================
    function addSettingsButtonToHeader() {
        const menuSelector = '.headerAccount__dropdownContainer';
        const buttonId = 'lm-config-button';

        const injectButton = () => {
            const dropdownContainer = document.querySelector(menuSelector);
            if (!dropdownContainer || document.getElementById(buttonId)) {
                return false;
            }

            const contentSection = dropdownContainer.querySelector('.headerAccount__dropdownContainerContent');
            if (!contentSection) {
                return false;
            }

            const separator = document.createElement('hr');
            separator.className = 'headerAccount__dropdownSeparator';
            separator.style.margin = '0.5rem 0';

            const settingsLink = document.createElement('a');
            settingsLink.id = buttonId;
            settingsLink.href = '#';
            settingsLink.className = 'lm-settings-menu-item';

            settingsLink.innerHTML = `
                <svg class="lm-settings-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61-.25-1.17-.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19-.15-.24-.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18-.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22-.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path>
                </svg>
                <span>Configurer le Lecteur Média</span>
            `;

            settingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openSettingsPanel(allProviders);
            });

            contentSection.appendChild(separator);
            contentSection.appendChild(settingsLink);

            return true;
        };

        if (injectButton()) return;
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector('.headerAccount__dropdownContainerContent')) {
                if (injectButton()) obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    class EmbedManager {
        constructor(initialProviders = [], config = {}) {
            this.providers = initialProviders;
            this.isDarkTheme = !document.documentElement.classList.contains('theme-light');
            this.config = config;

            this.embedCreatorObserver = new IntersectionObserver(async (entries, observer) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const link = entry.target;
                        observer.unobserve(link);

                        const providerName = link.dataset.providerName;
                        if (!providerName) continue;

                        const provider = this.providers.find(p => p.name === providerName);
                        if (!provider) continue;

                        try {
                            const embedElement = await provider.createEmbedElement(link, this.isDarkTheme);
                            if (embedElement) {
                                await this._makeEmbedCollapsible(embedElement, link);

                                const settings = await SettingsManager.getSettings(this.config);
                                this._insertEmbed(embedElement, link, settings.embedPosition);

                                if (provider.postProcess) {
                                    setTimeout(() => provider.postProcess(embedElement), 50);
                                }
                            }
                        } catch (e) {
                            console.error(`[${provider.name}] Erreur lors de la création différée:`, e);
                        }
                    }
                }
            }, { rootMargin: '400px 0px' });
        }

        /**
         * Gère l'insertion du lecteur dans le DOM selon la position choisie
         */
        _insertEmbed(embedElement, link, position = 'below_line') {
            switch (position) {
                case 'before':
                    link.before(embedElement);
                    break;

                case 'replace':
                    link.replaceWith(embedElement);
                    break;

                case 'bottom':
                    const container = link.closest('.txt-msg, .message-content, .jvchat-bloc-message');
                    if (container) {
                        container.appendChild(embedElement);
                    } else {
                        link.after(embedElement);
                    }
                    break;

                case 'below_line':
                    let currentNode = link;
                    let insertionPointFound = false;

                    while (currentNode && currentNode.nextSibling) {
                        currentNode = currentNode.nextSibling;

                        if (currentNode.nodeName === 'BR') {
                            currentNode.after(embedElement);
                            insertionPointFound = true;
                            break;
                        }

                        if (currentNode.nodeType === 1 && /^(DIV|P|BLOCKQUOTE|UL|OL|HR)$/.test(currentNode.nodeName)) {
                            const br = document.createElement('br');
                            currentNode.before(br);
                            br.after(embedElement);
                            insertionPointFound = true;
                            break;
                        }
                    }

                    if (!insertionPointFound) {
                        const br = document.createElement('br');
                        link.parentNode.appendChild(br);
                        link.parentNode.appendChild(embedElement);
                    }
                    break;

                case 'after':
                default:
                    link.after(embedElement);
                    break;
            }
        }

        processMessageElement(messageNode, enabledProviders) {
            enabledProviders.forEach(provider => {
                const links = messageNode.querySelectorAll(provider.selector);
                
                links.forEach(link => {
                    if (link.dataset.miniatweetProcessed) return;

                    link.dataset.miniatweetProcessed = 'true';
                    link.dataset.providerName = provider.name;
                    this.embedCreatorObserver.observe(link);
                });
            });
        }

        async _makeEmbedCollapsible(blocEmbedElement, originalLink) {
            const settings = await SettingsManager.getSettings(this.config);
            
            if (blocEmbedElement.querySelector('.iframe-vocaroo, .dead-link-sticker, .distrokid-embed-card')) {
                return;
            }

            const currentTopic = TopicUtils.getCurrentInfo();
            let effectiveCollapsible = settings.collapsibleEmbeds;
            let effectiveStartCollapsed = settings.startCollapsed;

            if (currentTopic && settings.topicRules && settings.topicRules[currentTopic.id]) {
                const rule = settings.topicRules[currentTopic.id].mode;
                
                if (rule === 'disabled') {
                    effectiveCollapsible = false;
                } else if (rule === 'force_collapsed') {
                    effectiveCollapsible = true;
                    effectiveStartCollapsed = true;
                }
                else if (rule === 'force_expanded') {
                    effectiveCollapsible = true;
                    effectiveStartCollapsed = false;
                }
            }

            function getDisplayNameFromHostname(hostname) {
                const parts = hostname.replace(/^(www\.|m\.|music\.|open\.)/, '').split('.');
                if (parts.length < 2) return hostname.charAt(0).toUpperCase() + hostname.slice(1);
                const genericTldsToHide = ['com', 'fr', 'org', 'net', 'io', 'gg', 'tv', 'app'];
                let registrableDomainParts = (parts.length > 2 && parts[parts.length - 2].length <= 3 && ['co', 'com', 'org', 'gov'].includes(parts[parts.length - 2])) 
                    ? parts.slice(-3) : parts.slice(-2);
                const registrableDomain = registrableDomainParts.join('.');
                const tld = registrableDomainParts[registrableDomainParts.length - 1];
                let brandName = registrableDomainParts[0];
                if (!genericTldsToHide.includes(tld)) brandName = registrableDomain;
                return brandName.charAt(0).toUpperCase() + brandName.slice(1);
            }

            let domain = 'Média';
            let faviconUrl = '';
            try {
                const url = new URL(originalLink.href);
                const cleanHostname = url.hostname.replace(/^www\./, '');
                const faviconDomainMap = {
                    'vm.tiktok.com': 'tiktok.com', 'youtu.be': 'youtube.com', 'voca.ro': 'vocaroo.com',
                    'gph.is': 'giphy.com', 'dai.ly': 'dailymotion.com', 'flic.kr': 'flickr.com', 'maps.app.goo.gl': 'google.com'
                };
                const faviconDomain = faviconDomainMap[cleanHostname] || cleanHostname;
                faviconUrl = `https://www.google.com/s2/favicons?domain=${faviconDomain}&sz=32`;
                domain = getDisplayNameFromHostname(url.hostname);
            } catch (e) { }

            const header = createSafeDiv();
            header.className = 'embed-header';
            header.innerHTML = `
                <div class="embed-info-container">
                    ${faviconUrl ? `<img src="${faviconUrl}" class="embed-favicon" alt="Favicon">` : ''}
                    <span class="embed-info">${escapeHTML(domain)}</span>
                </div>
                <button class="toggle-embed-button" title="Masquer/Afficher le média">
                    <span class="icon-collapse"></span>
                    <span class="icon-expand"></span>
                </button>
            `;

            const mediaContent = createSafeDiv();
            mediaContent.className = 'media-content';

            const innerWrapper = createSafeDiv();
            innerWrapper.append(...blocEmbedElement.childNodes);
            mediaContent.appendChild(innerWrapper);
            
            blocEmbedElement.classList.add('embed-collapsible');
            
            if (!effectiveCollapsible) {
                header.style.display = 'none';
                blocEmbedElement.classList.add('collapse-disabled');
            } else {
                if (effectiveStartCollapsed) {
                    blocEmbedElement.classList.add('collapsed');
                }
            }

            blocEmbedElement.append(header, mediaContent);
            
            const infoText = header.querySelector('.embed-info');
            if (effectiveCollapsible && effectiveStartCollapsed) {
                infoText.textContent = `${domain} (cliquer pour afficher)`;
            }

            header.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') return;
                e.preventDefault(); e.stopPropagation();
                const isCollapsed = blocEmbedElement.classList.toggle('collapsed');
                infoText.textContent = isCollapsed ? `${domain} (cliquer pour afficher)` : domain;
            });
        }

        init() {
            const hostname = window.location.hostname;
            if (hostname === 'www.jeuxvideo.com') {
                waitForElement('.conteneur-messages-pagi', () => this.startObserving('.conteneur-messages-pagi', '[Lecteur Media] Actif sur JVC.'));
                waitForElement('#jvchat-main', () => this.startObserving('#jvchat-main', '[Lecteur Media] Actif sur JVChat.'));
            } else if (hostname === 'jvarchive.com' || hostname === 'jvarchive.st'|| hostname === 'jvarchive.net') {
                waitForElement('body', () => this.startObserving('body', '[Lecteur Media] Actif sur JVArchive.'));
            }
        }

        async startObserving(containerSelector, startMessage) {
            const containerNode = document.querySelector(containerSelector);
            if (!containerNode) return;

            console.log(startMessage);

            const settings = await SettingsManager.getSettings();
            const enabledProviders = this.providers.filter(p => !settings.disabledProviders.includes(p.name));
            
            // Les classes CSS qui identifient un message sur JVC / JVArchive
            const messageSelectors = '.txt-msg, .jvchat-bloc-message, .message-content';

            const initialMessages = containerNode.querySelectorAll(messageSelectors);
            initialMessages.forEach(msg => this.processMessageElement(msg, enabledProviders));

            const mutationObserver = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches && node.matches(messageSelectors)) {
                                this.processMessageElement(node, enabledProviders);
                            } 
                            else if (node.querySelectorAll) {
                                const internalMessages = node.querySelectorAll(messageSelectors);
                                internalMessages.forEach(msg => this.processMessageElement(msg, enabledProviders));
                            }
                        }
                    });
                }
            });

            mutationObserver.observe(containerNode, {
                childList: true,
                subtree: true, 
            });
        }

        async refreshActiveEmbeds() {
            const settings = await SettingsManager.getSettings(this.config);
            const currentTopic = TopicUtils.getCurrentInfo();

            // 1. Mise à jour Twitter (Hauteur)
            document.querySelectorAll('.vxtwitter-embed').forEach(el => {
                if (settings.twitterFullHeight) el.classList.add('vxtwitter-full-height');
                else el.classList.remove('vxtwitter-full-height');
            });

            // 2. Mise à jour globale (Header + État ouvert/fermé)
            document.querySelectorAll('.embed-collapsible').forEach(el => {
                const header = el.querySelector('.embed-header');
                if (!header) return;

                const infoText = header.querySelector('.embed-info');
                
                // On récupère le nom du domaine propre (sans le texte "(cliquer pour afficher)")
                // pour pouvoir reconstruire le label proprement après.
                let domainLabel = infoText.textContent;
                if (domainLabel.includes(' (cliquer pour afficher)')) {
                    domainLabel = domainLabel.replace(' (cliquer pour afficher)', '');
                }

                // --- Détermination des règles actives ---
                let shouldShowHeader = settings.collapsibleEmbeds;
                let shouldBeCollapsed = settings.startCollapsed;

                // Vérification des règles spécifiques au Topic
                if (currentTopic && settings.topicRules && settings.topicRules[currentTopic.id]) {
                    const rule = settings.topicRules[currentTopic.id].mode;
                    
                    if (rule === 'disabled') {
                        shouldShowHeader = false;
                        shouldBeCollapsed = false; // Si pas de header, forcément ouvert
                    } 
                    else if (rule === 'force_collapsed') {
                        shouldShowHeader = true;
                        shouldBeCollapsed = true;
                    }
                    else if (rule === 'force_expanded') {
                        shouldShowHeader = true;
                        shouldBeCollapsed = false;
                    }
                }

                // --- Application : Visibilité du Header ---
                if (shouldShowHeader) {
                    header.style.display = ''; 
                    el.classList.remove('collapse-disabled');
                } else {
                    header.style.display = 'none';
                    el.classList.add('collapse-disabled');
                    // Si le header est désactivé, on force l'ouverture pour ne pas cacher le contenu à jamais
                    shouldBeCollapsed = false; 
                }

                // --- Application : État Ouvert / Fermé (Le fix est ici) ---
                if (shouldBeCollapsed) {
                    if (!el.classList.contains('collapsed')) {
                        el.classList.add('collapsed');
                    }
                    // Met à jour le texte
                    if (shouldShowHeader) {
                        infoText.textContent = `${domainLabel} (cliquer pour afficher)`;
                    }
                } else {
                    if (el.classList.contains('collapsed')) {
                        el.classList.remove('collapsed');
                    }
                    // Met à jour le texte
                    infoText.textContent = domainLabel;
                }
            });
        }
    }

    // =========================================================================
    // == API LECTEUR MEDIA
    // =========================================================================

    class LecteurMedia {
        static instance = null;

        /**
         * @param {Object} [options] Options de configuration pour l'instance.
         * @param {string|string[]} [options.providers='all'] Quels providers activer.
         *      Peut être 'all', 'base', 'connect', ou un tableau de noms de providers ['YouTube', 'Twitter'].
         */
        constructor(options = {}) {
            this.config = { logLevel: 'error' };
            let selectedProviders = [];
            const providerSelection = options.providers || 'all';

            if (providerSelection === 'all') {
                selectedProviders = allProviders;
            } else if (Array.isArray(providerSelection)) {
                selectedProviders = allProviders.filter(p => providerSelection.includes(p.name));
            } else {
                const categories = Array.isArray(providerSelection) ? providerSelection : [providerSelection];
                selectedProviders = allProviders.filter(p => categories.includes(p.category));
            }

            this.activeProviders = selectedProviders;
            this.embedManager = new EmbedManager(this.activeProviders, {
                collapsible: options.collapsible ?? true
            });
            
            this.jvCodeManager = new JVCodeManager();

            if (!LecteurMedia.instance) {
                LecteurMedia.instance = this;
            }
        }

        // --- Méthodes de logging internes ---
        _logError(...args) {
            if (['error', 'info', 'debug'].includes(this.config.logLevel)) {
                console.error('[Lecteur Media]', ...args);
            }
        }
        _logInfo(...args) {
            if (['info', 'debug'].includes(this.config.logLevel)) {
                console.log('[Lecteur Media]', ...args);
            }
        }
        _logDebug(...args) {
            if (this.config.logLevel === 'debug') {
                console.log('[Lecteur Media DEBUG]', ...args);
            }
        }

        /**
         * Méthode statique pour les requêtes réseau compatibles.
         */
        static compatibleHttpRequest(options) {
            return new Promise((resolve, reject) => {
                const requestOptions = {
                    ...options,
                    onload: (response) => {
                        // Parfois GM renvoie le status 0 ou null en cas d'erreur interne
                        if (response.status === 0) {
                            reject(new Error("NETWORK_ERROR"));
                        } else {
                            resolve(response);
                        }
                    },
                    onerror: (err) => {
                        // On log l'erreur pour le debug console
                        console.warn(`[LecteurMedia] Erreur réseau (DNS/Connexion) pour ${options.url}`, err);
                        reject(new Error("NETWORK_ERROR"));
                    },
                    ontimeout: () => {
                        console.warn(`[LecteurMedia] Timeout pour ${options.url}`);
                        reject(new Error("TIMEOUT"));
                    }
                };

                if (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function') {
                    GM.xmlHttpRequest(requestOptions);
                } else if (typeof GM_xmlhttpRequest === 'function') {
                    GM_xmlhttpRequest(requestOptions);
                } else {
                    reject(new Error('Aucune fonction GM.xmlHttpRequest ou GM_xmlhttpRequest n\'est disponible.'));
                }
            });
        }

        // Lance plusieurs requêtes GM et annule les perdantes dès qu'une réussit
        static raceRequests(urls) {
            return new Promise((resolve, reject) => {
                const xhrFn = (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function')
                    ? GM.xmlHttpRequest
                    : (typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : null);

                if (!xhrFn) {
                    console.log("[Lecteur Media] raceRequests: Aucune fonction GM de requête détectée.");
                    return reject(new Error("Aucune fonction de requête GM détectée (GM.xmlHttpRequest ou GM_xmlhttpRequest)."));
                }

                const requests = [];
                let settled = false;
                let errorCount = 0;
                
                urls.forEach(url => {
                    const req = xhrFn({
                        method: "GET",
                        url: url,
                        onload: (response) => {
                            if (settled) return;
                            if (response.status === 200) {
                                settled = true;
                                // On annule toutes les autres requêtes en cours !
                                requests.forEach(r => r !== req && r.abort && r.abort());
                                resolve(response);
                            } else {
                                errorCount++;
                                if (errorCount === urls.length) reject(new Error("Toutes les API ont échoué"));
                            }
                        },
                        onerror: () => {
                            if (settled) return;
                            errorCount++;
                            if (errorCount === urls.length) reject(new Error("Erreur réseau sur toutes les API"));
                        },
                        ontimeout: () => {
                            if (settled) return;
                            errorCount++;
                            if (errorCount === urls.length) reject(new Error("Timeout sur toutes les API"));
                        }
                    });
                    requests.push(req);
                });
            });
        }

        /**
         * Méthode publique principale de l'API pour traiter un noeud.
         * @param {HTMLElement|jQuery} node L'élément à analyser.
         */
        async _processNodeAsync(node) {
            this._logDebug('Logique asynchrone de processNode démarrée pour le noeud :', node);

            let elementNode = node;
            if (elementNode && typeof elementNode.get === 'function' && elementNode.length > 0) {
                elementNode = elementNode.get(0);
            }

            if (!elementNode || !(elementNode instanceof Element)) {
                this._logError('processNode a été appelé sans un élément valide.');
                throw new Error('processNode a reçu un noeud invalide.'); 
            }

            if (!this.settings) {
                this.settings = await SettingsManager.getSettings();
            }

            const enabledProviders = this.activeProviders.filter(p => !this.settings.disabledProviders.includes(p.name));
            this.embedManager.processMessageElement(elementNode, enabledProviders);
            
            this._logDebug(`Traitement manuel terminé pour le noeud.`);
        }

        /**
         * Méthode publique principale de l'API pour traiter un noeud.
         * @param {HTMLElement|jQuery} node L'élément à analyser.
         * @returns {boolean} `true` si le traitement a été lancé avec succès, `false` si l'entrée était invalide.
         */
        processNode(node) {
            let elementNode = node;
            if (elementNode && typeof elementNode.get === 'function' && elementNode.length > 0) {
                elementNode = elementNode.get(0);
            }

            if (!elementNode || !(elementNode instanceof Element)) {
                this._logError('processNode a été appelé sans un élément valide.');
                return false;
            }
-
            this._processNodeAsync(elementNode).catch(err => {
                this._logError('Une erreur inattendue est survenue en arrière-plan dans processNode :', err);
            });

            return true;
        }

        /**
         * Méthode pour lancer le script en mode autonome.
         */
        async initStandalone() {
            this._logInfo('Script initialisé en mode autonome.');
            SettingsManager.registerSettingsMenu(this.activeProviders);
            const settings = await SettingsManager.getSettings(); 

            const initializeFeatures = () => {
                addSettingsButtonToHeader();
                this.embedManager.init();

                this.jvCodeManager.init(); 

                if (settings.enableJVCode) {
                    this.jvCodeManager.toggle(true);
                }
            };

            if (document.readyState === 'loading') {
                window.addEventListener('DOMContentLoaded', initializeFeatures);
            } else {
                initializeFeatures();
            }
        }

        /**
         * Valide la structure d'un objet provider.
         * @param {Object} provider L'objet provider à valider.
         * @returns {string[]} Un tableau de messages d'erreur. Le tableau est vide si le provider est valide.
         * @private
         */
        _validateProvider(provider) {
            const errors = [];
            if (!provider || typeof provider !== 'object') {
                return ['Le provider doit être un objet.'];
            }
            if (typeof provider.name !== 'string' || !provider.name.trim()) {
                errors.push('doit avoir une propriété "name" (string non vide).');
            }
            if (typeof provider.selector !== 'string' || !provider.selector.trim()) {
                errors.push('doit avoir une propriété "selector" (string non vide).');
            }
            if (typeof provider.createEmbedElement !== 'function') {
                errors.push('doit avoir une méthode "createEmbedElement".');
            }
            if (provider.hasOwnProperty('postProcess') && typeof provider.postProcess !== 'function') {
                errors.push('la propriété "postProcess" doit être une fonction si elle est définie.');
            }
            return errors;
        }

        /**
         * Permet d'ajouter un ou plusieurs providers à l'instance du lecteur
         * @param {LecteurMediaProvider|Array<LecteurMediaProvider>} newProviders
         */
        addProvider(newProviders) {
            const providersToAdd = Array.isArray(newProviders) ? newProviders : [newProviders];

            const validAndUniqueProviders = providersToAdd.filter(provider => {
                const validationErrors = this._validateProvider(provider);
                if (validationErrors.length > 0) {
                    console.warn(`[Lecteur Media] Tentative d'ajout d'un provider invalide. Ignoré. Erreurs : ${validationErrors.join('; ')}`, provider);
                    return false;
                }

                const alreadyExists = this.embedManager.providers.some(
                    existingProvider => existingProvider.name === provider.name
                );
                if (alreadyExists) {
                    console.warn(`[Lecteur Media] Le provider "${provider.name}" existe déjà. Ignoré.`);
                    return false;
                }

                return true;
            });

            if (validAndUniqueProviders.length > 0) {
                this.embedManager.providers.push(...validAndUniqueProviders);
                console.log(`[Lecteur Media] ${validAndUniqueProviders.length} provider(s) ajouté(s) : ${validAndUniqueProviders.map(p => p.name).join(', ')}.`);
            }
        }

        /**
         * Génère les directives @connect nécessaires pour une configuration de providers donnée.
         * C'est un outil pour les développeurs utilisant l'API.
         * @param {Object} [options] - Les mêmes options que le constructeur.
         * @param {string|string[]} [options.providers='all'] - La sélection de providers.
         * @returns {string[]} Un tableau de chaînes de caractères, chacune étant une ligne @connect prête à être copiée.
         */
        static getRequiredConnects(options = {}) {
            const providerSelection = options.providers || 'all';
            let selectedProviders = [];

            if (providerSelection === 'all') {
                selectedProviders = allProviders;
            } else if (Array.isArray(providerSelection) && providerSelection.every(item => typeof item === 'string' && !['base', 'connect', 'wildcard'].includes(item))) {
                // Si c'est un tableau de noms de providers
                selectedProviders = allProviders.filter(p => providerSelection.includes(p.name));
            } else {
                const categories = Array.isArray(providerSelection) ? providerSelection : [providerSelection];
                selectedProviders = allProviders.filter(p => categories.includes(p.category));
            }

            const connectDomains = new Set();

            selectedProviders.forEach(provider => {
                if (provider.category === 'wildcard') {
                    connectDomains.add('*');
                } else if (provider.category === 'connect' && provider.connect) {
                    if (Array.isArray(provider.connect)) {
                        provider.connect.forEach(domain => connectDomains.add(domain));
                    } else {
                        connectDomains.add(provider.connect);
                    }
                }
            });

            if (connectDomains.has('*')) {
                return ['// @connect      *'];
            }

            return Array.from(connectDomains).map(domain => `// @connect      ${domain}`);
        }
    }

    // =========================================================================
    // == EXPOSITION DE L'API
    // =========================================================================
    window.LecteurMedia = LecteurMedia;
    window.LecteurMedia.compatibleHttpRequest = LecteurMedia.compatibleHttpRequest;
    window.LecteurMedia.AllProviders = allProviders ;
    window.LecteurMedia.getRequiredConnects = LecteurMedia.getRequiredConnects;

    const lecteurMediaInstance = new LecteurMedia();
    window.lecteurMediaJVC = {
        version: '1.5.4',
        setLogLevel: (level) => {
            if (['none', 'error', 'info', 'debug'].includes(level)) {
                lecteurMediaInstance.config.logLevel = level;
            }
        },
        processNode: lecteurMediaInstance.processNode.bind(lecteurMediaInstance)
    };
    
    })();
}