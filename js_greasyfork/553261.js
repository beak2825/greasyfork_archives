// ==UserScript==
// @name         阿里云 ACK 日志增强
// @namespace    https://flipos.local/tampermonkey
// @version      0.5.0
// @description  阿里云 ACK 日志增强：纯日志全屏视图，支持语法高亮、搜索、导航、自动刷新等功能。
// @match        https://cs.console.aliyun.com/*
// @author       You
// @run-at       document-idle
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553261/%E9%98%BF%E9%87%8C%E4%BA%91%20ACK%20%E6%97%A5%E5%BF%97%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/553261/%E9%98%BF%E9%87%8C%E4%BA%91%20ACK%20%E6%97%A5%E5%BF%97%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const log = (...args) => console.debug('[ACK-Booster]', ...args);
    const css = `
/* 外部按钮 - XShell风格 */
.tm-ack-panel {
position:fixed; z-index: 99999; top: 12px; right: 12px;
background:rgba(0,0,0,0.9); color: #ffffff; padding: 8px 16px;
border-radius:4px; box-shadow: 0 2px 8px rgba(0,0,0,0.8);
font:14px/1.4 'monospace', Consolas, 'Liberation Mono', Menlo, monospace;
cursor:pointer; transition: all 0.2s ease;
user-select:none; border: 1px solid #808080;
}
.tm-ack-panel:hover {
background:rgba(30,30,30,0.95);
transform:translateY(-1px);
box-shadow:0 4px 12px rgba(0,0,0,0.9);
border-color:#c0c0c0;
}
/* 全屏纯日志视图 - XShell风格 */
.tm-modal {
position:fixed; z-index: 100000; inset: 0;
display:flex; flex-direction: column;
background:#404040;
font-family:'monospace', Consolas, 'Liberation Mono', Menlo, monospace;
}
.tm-modal-header {
display:flex; gap: 8px; align-items: center; padding: 8px 12px;
background:#1e1e1e;
color:#ffffff; border-bottom: 1px solid #808080;
box-shadow:0 1px 3px rgba(0,0,0,0.5);
flex-wrap:wrap;
}
.tm-modal-header strong {
font-size:14px; color: #00ff00; margin-right: 8px;
}
.tm-modal-sep {
width:1px; height: 16px; background: #808080; margin: 0 4px;
}
.tm-modal-header input[type="text"] {
width:280px; padding: 4px 8px; border-radius: 2px;
border:1px solid #808080; background: #404040; color: #ffffff;
font-size:12px; transition: border-color 0.2s;
font-family:'monospace', Consolas, monospace;
}
.tm-modal-header input[type="text"]:focus {
border-color:#00ff00; outline: none;
box-shadow:0 0 0 1px #00ff00;
}
.tm-modal-header input[type="number"] {
width:60px; padding: 4px 6px; border-radius: 2px;
border:1px solid #808080; background: #404040; color: #ffffff; font-size: 11px;
font-family:'monospace', Consolas, monospace;
}
.tm-modal-header input[type="checkbox"] {
margin-right:4px; accent-color: #00ff00;
}
.tm-modal-header label {
display:flex; align-items: center; font-size: 11px; color: #c0c0c0;
white-space:nowrap;
}
.tm-modal-header label.tm-modal-small {
font-size:10px;
}
.tm-modal-btn {
padding:4px 8px; border-radius: 2px; border: 1px solid #808080;
background:#1e1e1e; color: #ffffff; font-size: 11px; cursor: pointer;
transition:all 0.2s ease;
font-family:'monospace', Consolas, monospace;
}
.tm-modal-btn:hover {
background:#3e3e3e; border-color: #c0c0c0;
transform:translateY(-1px);
}
.tm-modal-btn:active { transform: translateY(0); }
.tm-modal-count {
font-size:11px; color: #00ff00; font-weight: bold;
min-width:30px; text-align: center;
}
.tm-modal-content {
flex:1; overflow: auto; padding: 12px;
background:#4040400; color: #ffffff;
font-size:13px; line-height: 2.2;
white-space:pre-wrap; word-wrap: break-word;
border:none; outline: none;
}
/* 日志语法高亮 - XShell风格 */
.tm-log-level { font-weight: bold; }
.tm-log-error { color: #ff0000; }
.tm-log-warn { color: #ffff00; }
.tm-log-info { color: #ffffffe1; }
.tm-log-debug { color: #808080; }
.tm-log-url { color: #87ceeb; text-decoration: underline; }
.tm-log-classname { color: #009999; }
.tm-log-timestamp { color: #808080; }
.tm-log-thread { color: #808080; }
.tm-log-profile { color: #00ff00; font-weight: bold; font-size: 1.2em; }
.tm-log-port { color: #00ff00; font-weight: bold; font-size: 1.2em; }
/* 搜索高亮 - XShell风格 */
.tm-highlight {
background:#333333;
color:#ffff00;
border-radius:0px;
padding:0px;
}
.tm-current {
background:#666666;
color:#ffffff;
box-shadow:none;
}
`;
    GM_addStyle(css);

    function injectStyle(doc) {
        if (doc.querySelector('#tm-ack-style')) return;
        const style = doc.createElement('style');
        style.id = 'tm-ack-style';
        style.textContent = css;
        (doc.head || doc.documentElement).appendChild(style);
    }

    injectStyle(document);
// 创建外部按钮
    (function () {
        'use strict';
// 创建悬浮按钮
        const panel = document.createElement('button');
        panel.className = 'tm-ack-panel';
        panel.setAttribute('aria-label', '纯日志视图');
        panel.innerHTML = '📋'; // 圆形icon
        document.body.appendChild(panel);
// 样式：贴边圆形按钮，hover 伸出点
        const style = document.createElement('style');
        style.textContent = `
.tm-ack-panel{
position:fixed;
top:50%;
right:0;
transform:translateY(-50%);
width:32px;
height:32px;
border-radius:50%;
border:0;
padding:0;
margin:0;
display:flex;
align-items:center;
justify-content:center;
background:#0b84ff;
color:#fff;
box-shadow:0 6px 16px rgba(0,0,0,0.25);
cursor:grab;
user-select:none;
-webkit-user-select:none;
z-index:2147483647;
transition:right .15s ease, left .15s ease, background .12s ease, transform .12s ease;
will-change:left, right, top;
}
.tm-ack-panel:active{ cursor: grabbing; }
/* 开启状态样式 */
.tm-ack-panel.active {
background:#00ff00;
box-shadow:0 6px 16px rgba(0,255,0,0.4);
animation: pulse 2s infinite;
}
@keyframes pulse {
0% { box-shadow:0 6px 16px rgba(0,255,0,0.4); }
50% { box-shadow:0 6px 20px rgba(0,255,0,0.6); }
100% { box-shadow:0 6px 16px rgba(0,255,0,0.4); }
}
/* 贴边时鼠标靠近伸出一点效果 */
.tm-ack-panel.edge-right:hover{ right: 8px; transform: translateY(-50%) scale(1.04); }
.tm-ack-panel.edge-left{ left: 0; right: auto; }
.tm-ack-panel.edge-left:hover{ left: 8px; transform: translateY(-50%) scale(1.04); }
/* 防止在页面上显示外链样式影响位置 */
button.tm-ack-panel { outline: none; }
`;
        document.head.appendChild(style);
// 初始状态：右侧贴边
        panel.classList.add('edge-right');
// 拖拽控制变量
        let isPointerDown = false;
        let isDragging = false;
        let startX = 0, startY = 0;            // 指针开始位置（client）
        let offsetX = 0, offsetY = 0;          // 指针相对于元素左上角的偏移
        const DRAG_THRESHOLD = 5;              // 判定为拖拽的移动阈值
        let initialRect = null;
// 阻止 click 在拖拽时触发
        panel.addEventListener('click', (e) => {
            if (isDragging) {
                e.stopImmediatePropagation();
                e.preventDefault();
// reset flag (下一次点击有效)
                isDragging = false;
                return;
            }
// 非拖拽点击行为（打开/关闭面板）
            if (modal) {
                closeModal();
                panel.classList.remove('active');
            } else {
                openModal();
                panel.classList.add('active');
            }
        }, true);
// Pointer down
        panel.addEventListener('pointerdown', (e) => {
// 只响应主键/触摸
            if (e.button && e.button !== 0) return;
            isPointerDown = true;
            isDragging = false;
            panel.setPointerCapture(e.pointerId);
            initialRect = panel.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            offsetX = startX - initialRect.left;
            offsetY = startY - initialRect.top;
// 临时禁用页面选择/拖动
            document.body.style.userSelect = 'none';
            document.body.style.touchAction = 'none';
        });
// Pointer move
        panel.addEventListener('pointermove', (e) => {
            if (!isPointerDown) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (!isDragging) {
                if (Math.hypot(dx, dy) >= DRAG_THRESHOLD) {
                    isDragging = true;
                } else {
                    return; // 未达到拖拽阈值，不改位置
                }
            }
// 计算新的 left/top（使用 fixed 定位）
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
// 限制上下边界（留 8px 间距）
            const padding = 8;
            const elW = initialRect.width;
            const elH = initialRect.height;
            newTop = Math.max(padding, Math.min(newTop, window.innerHeight - elH - padding));
// 应用位置：清除左右类，使用 left
            panel.classList.remove('edge-right', 'edge-left');
            panel.style.right = 'auto';
            panel.style.left = `${Math.round(newLeft)}px`;
            panel.style.top = `${Math.round(newTop)}px`;
        });

// Pointer up / cancel
        function onPointerUp(e) {
            if (!isPointerDown) return;
            isPointerDown = false;
            try {
                panel.releasePointerCapture(e.pointerId);
            } catch (err) { /* ignore */
            }
// 恢复页面选择
            document.body.style.userSelect = '';
            document.body.style.touchAction = '';
            if (isDragging) {
// 吸附到左右边缘
                const rect = panel.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const windowMid = window.innerWidth / 2;
// 纵向保持当前 top（但要限制边界）
                let top = rect.top;
                const padding = 8;
                const elH = rect.height;
                top = Math.max(padding, Math.min(top, window.innerHeight - elH - padding));
                panel.style.top = `${Math.round(top)}px`;
                if (centerX < windowMid) {
// 吸附左边
                    panel.style.left = '0px';
                    panel.style.right = 'auto';
                    panel.classList.add('edge-left');
                } else {
// 吸附右边
                    panel.style.left = 'auto';
                    panel.style.right = '0px';
                    panel.classList.add('edge-right');
                }
// 标记下次点击不触发
// isDragging 会在 click 处理里被清除
            } else {
// 非拖拽（短按）——保持原先的吸附类（不修改）
// 若元素在 absolute 左右未知情况，确保有 edge class
                if (!panel.classList.contains('edge-left') && !panel.classList.contains('edge-right')) {
// 根据 left/right 是否存在决定
                    const rect = panel.getBoundingClientRect();
                    if (rect.left + rect.width / 2 < window.innerWidth / 2) {
                        panel.classList.add('edge-left');
                        panel.style.left = '0px';
                        panel.style.right = 'auto';
                    } else {
                        panel.classList.add('edge-right');
                        panel.style.right = '0px';
                        panel.style.left = 'auto';
                    }
                }
            }
        }

        panel.addEventListener('pointerup', onPointerUp);
        panel.addEventListener('pointercancel', onPointerUp);
// 窗口变化时修正位置（防止错位）
        window.addEventListener('resize', () => {
            const rect = panel.getBoundingClientRect();
            const padding = 8;
            const elH = rect.height;
            let top = rect.top;
            top = Math.max(padding, Math.min(top, window.innerHeight - elH - padding));
            panel.style.top = `${Math.round(top)}px`;
// 如果当前是 edge-right/left 保持吸附
            if (panel.classList.contains('edge-right')) {
                panel.style.right = '0px';
                panel.style.left = 'auto';
            } else if (panel.classList.contains('edge-left')) {
                panel.style.left = '0px';
                panel.style.right = 'auto';
            }
        });
// 示例打开面板函数（把真实逻辑放这里）
    })();
// 状态
    let modal = null;
    let modalContent = null;
    let modalObserver = null;
    let modalFont = 14;
    let matchEls = [];
    let currentIdx = -1;
    let autoRefreshTimer = null;
    let logRoot = null;
// 工具函数
    const isVisible = (el) => !!el && (el.offsetParent !== null || getComputedStyle(el).position === 'fixed') && getComputedStyle(el).visibility !== 'hidden';
    const isNearBottom = (el) => {
        if (!el) return false;
        const diff = el.scrollHeight - el.scrollTop - el.clientHeight;
        return diff < 40;
    };
    const scrollToBottom = (el) => el && (el.scrollTop = el.scrollHeight);
    const ownerDoc = (el) => (el && el.ownerDocument) || document;

// 日志容器识别（跨文档/iframe）
    function searchDocForLogs(doc) {
        const selectors = [
            '.monaco-editor .view-lines',
            '.monaco-editor .lines-content',
            '.ace_scroller', '.ace_content',
            'pre', 'code',
            'div[class*="log"]', 'div[class*="console"]', 'div[class*="log-content"]',
            'div[role="textbox"]', 'div[role="log"]',
            'div[aria-label*="log" i]'
        ];
        let best = null;
        let score = -1;
        for (const sel of selectors) {
            const list = doc.querySelectorAll(sel);
            list.forEach(el => {
                if (!isVisible(el)) return;
                const text = (el.innerText || '').trim();
                const s = (text.split('\n').length) + el.clientHeight / 100;
                if (text.length > 0 && s > score) {
                    best = el;
                    score = s;
                }
            });
            if (best) break;
        }
        if (!best) {
            const blocks = Array.from(doc.querySelectorAll('div,pre,code'))
                .filter(el => isVisible(el) && el.clientHeight > 120 && (el.innerText || '').trim().length > 0)
                .sort((a, b) => (b.innerText.length - a.innerText.length));
            best = blocks[0] || null;
        }
        return best;
    }

    function findLogContainer() {
        let res = searchDocForLogs(document);
        if (res) return res;
        const iframes = Array.from(document.querySelectorAll('iframe')).filter(isVisible);
        for (const frame of iframes) {
            try {
                const doc = frame.contentDocument || frame.contentWindow.document;
                res = searchDocForLogs(doc);
                if (res) return res;
            } catch (e) {
                log('iframe not accessible', frame.src);
            }
        }
        return null;
    }

    function findRefreshButton(doc) {
        doc = doc || document;
        const list = Array.from(doc.querySelectorAll('button, a, span, div[role="button"]'));
        const candidates = list.filter(el => isVisible(el) && (
            /刷新|Refresh|重载|reload/i.test(el.textContent || '') ||
            /刷新|Refresh|reload/i.test(el.getAttribute('title') || '') ||
            /refresh/i.test(el.getAttribute('aria-label') || '') ||
            /refresh|reload/i.test(el.className || '')
        ));
        return candidates[0] || null;
    }

    function clickEl(el) {
        if (!el) return;
        ['mouseover', 'mousedown', 'mouseup', 'click'].forEach(t => {
            el.dispatchEvent(new MouseEvent(t, {bubbles: true, cancelable: true, view: ownerDoc(el).defaultView}));
        });
    }

// 日志语法高亮
    function applySyntaxHighlight(text) {
        return text
            // URL高亮
            .replace(/(https?:\/\/[^\s<>"']+)/gi, '<span class="tm-log-url">$1</span>')
            // 时间戳高亮 (YYYY-MM-DD HH:mm:ss,SSS格式)
            .replace(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}[,\.]\d{3})/g, '<span class="tm-log-timestamp">$1</span>')
            // 线程ID高亮 [数字]格式
            .replace(/(\[\d+\])/g, '<span class="tm-log-thread">$1</span>')
            // Spring Boot启动信息高亮
            .replace(/(The following profiles are active:\s*)([^\r\n]+)/gi, '$1<span class="tm-log-profile">$2</span>')
            .replace(/(started on port\(s\):\s*)([^\s\r\n]+)/gi, '$1<span class="tm-log-port">$2</span>')
            // Java类名高亮 (包名.类名格式)
            .replace(/\b([a-z][a-z0-9]*(?:\.[a-z][a-z0-9]*)*\.[A-Z][a-zA-Z0-9]*)\b/g, '<span class="tm-log-classname">$1</span>')
            // 日志级别
            .replace(/\b(ERROR|FATAL|CRITICAL|CRIT)\b/gi, '<span class="tm-log-error tm-log-level">$1</span>')
            .replace(/\b(WARN|WARNING|ALERT)\b/gi, '<span class="tm-log-warn tm-log-level">$1</span>')
            .replace(/\b(INFO|INFORMATION|NOTICE)\b/gi, '<span class="tm-log-info tm-log-level">$1</span>')
            .replace(/\b(DEBUG|TRACE|VERBOSE)\b/gi, '<span class="tm-log-debug tm-log-level">$1</span>');
    }

// 搜索高亮功能
    function buildRegex(q, {caseSensitive, regex, wholeWord}) {
        if (!q) return null;
        try {
            let source = q;
            if (!regex) source = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            if (wholeWord) source = `\\b${source}\\b`;
            return new RegExp(source, caseSensitive ? 'g' : 'gi');
        } catch (e) {
            alert('正则表达式不合法');
            return null;
        }
    }

    function clearHighlight(root) {
        if (!root) return;
        const marks = root.querySelectorAll('.tm-highlight, .tm-current');
        marks.forEach(mark => {
            const text = ownerDoc(mark).createTextNode(mark.textContent || '');
            mark.replaceWith(text);
        });
        matchEls = [];
        currentIdx = -1;
    }

    function wrapMatchesInTextNode(node, regex) {
        const text = node.nodeValue;
        if (!text) return;
        const frag = ownerDoc(node).createDocumentFragment();
        let lastIdx = 0;
        let m;
        regex.lastIndex = 0;
        while ((m = regex.exec(text)) !== null) {
            const start = m.index;
            const end = regex.lastIndex;
            if (start > lastIdx) frag.appendChild(ownerDoc(node).createTextNode(text.slice(lastIdx, start)));
            const mark = ownerDoc(node).createElement('mark');
            mark.className = 'tm-highlight';
            mark.textContent = text.slice(start, end);
            frag.appendChild(mark);
            matchEls.push(mark);
            lastIdx = end;
            if (m[0].length === 0) {
                regex.lastIndex++;
            }
        }
        if (lastIdx < text.length) frag.appendChild(ownerDoc(node).createTextNode(text.slice(lastIdx)));
        node.replaceWith(frag);
    }

    function highlight(root, regex) {
        if (!root || !regex) return;
        clearHighlight(root);
        const walker = ownerDoc(root).createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                if (!node.parentElement) return NodeFilter.FILTER_REJECT;
                const p = node.parentElement;
                if (p.closest('.tm-modal-header')) return NodeFilter.FILTER_REJECT;
                const style = ownerDoc(p).defaultView.getComputedStyle(p);
                if (style.display === 'none' || style.visibility === 'hidden') return NodeFilter.FILTER_REJECT;
                const t = node.nodeValue || '';
                if (!t.trim()) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(n => wrapMatchesInTextNode(n, regex));
    }

    function goTo(idx) {
        if (!matchEls.length) return;
        currentIdx = (idx + matchEls.length) % matchEls.length;
        matchEls.forEach(m => m.classList.remove('tm-current'));
        const cur = matchEls[currentIdx];
        cur.classList.add('tm-current');
        cur.scrollIntoView({behavior: 'smooth', block: 'center'});
    }

    function ensureRoot() {
        logRoot = findLogContainer();
        if (logRoot) {
            log('log container =>', logRoot);
            injectStyle(ownerDoc(logRoot));
        }
    }

// 全屏纯日志视图
    function updateModalText() {
        if (!modalContent || !logRoot) return;
        const rawText = logRoot.innerText || '';
        modalContent.innerHTML = applySyntaxHighlight(rawText);
    }

    function closeModal() {
        if (modalObserver) {
            modalObserver.disconnect();
            modalObserver = null;
        }
        if (modal) {
            modal.remove();
            modal = null;
            modalContent = null;
        }
        if (autoRefreshTimer) {
            clearInterval(autoRefreshTimer);
            autoRefreshTimer = null;
        }
        // 移除按钮的激活状态
        const panel = document.querySelector('.tm-ack-panel');
        if (panel) {
            panel.classList.remove('active');
        }
    }

    function openModal() {
        ensureRoot();
        if (!logRoot) return alert('未找到日志容器');
        if (modal) return;
        modal = document.createElement('div');
        modal.className = 'tm-modal';
        modal.innerHTML = `
<div class="tm-modal-header">
<strong>📋 纯日志视图</strong>
<span class="tm-modal-sep"></span>
<input id="tm-modal-q" type="text" placeholder="搜索（支持正则/大小写/整词）" />
<label><input id="tm-modal-case" type="checkbox" /> 大小写</label>
<label><input id="tm-modal-reg" type="checkbox" /> 正则</label>
<label><input id="tm-modal-word" type="checkbox" /> 整词</label>
<button id="tm-modal-search" class="tm-modal-btn">高亮</button>
<button id="tm-modal-clear" class="tm-modal-btn">清除</button>
<span class="tm-modal-count">0</span>
<button id="tm-modal-prev" class="tm-modal-btn">上一个</button>
<button id="tm-modal-next" class="tm-modal-btn">下一个</button>
<span class="tm-modal-sep"></span>
<button id="tm-modal-manual-refresh" class="tm-modal-btn">手动刷新</button>
<label><input id="tm-modal-lock" type="checkbox" checked /> 锁定底部</label>
<button id="tm-modal-refresh-toggle" class="tm-modal-btn">自动刷新: 开</button>
<span class="tm-modal-sep"></span>
<button id="tm-modal-copy" class="tm-modal-btn">复制全部</button>
<button id="tm-modal-plus" class="tm-modal-btn">字体+</button>
<button id="tm-modal-minus" class="tm-modal-btn">字体-</button>
<button id="tm-modal-close" class="tm-modal-btn">关闭</button>
</div>
<div id="tm-modal-content" class="tm-modal-content"></div>
`;
        document.body.appendChild(modal);
        modalContent = modal.querySelector('#tm-modal-content');
        modalFont = 12;
        modalContent.style.fontSize = modalFont + 'px';
        updateModalText();
// 绑定事件
        const $mQ = modal.querySelector('#tm-modal-q');
        const $mCase = modal.querySelector('#tm-modal-case');
        const $mReg = modal.querySelector('#tm-modal-reg');
        const $mWord = modal.querySelector('#tm-modal-word');
        const $mSearch = modal.querySelector('#tm-modal-search');
        const $mClear = modal.querySelector('#tm-modal-clear');
        const $mPrev = modal.querySelector('#tm-modal-prev');
        const $mNext = modal.querySelector('#tm-modal-next');
        const $mCount = modal.querySelector('.tm-modal-count');
        const $mLock = modal.querySelector('#tm-modal-lock');
        const $mRefreshToggle = modal.querySelector('#tm-modal-refresh-toggle');
        const $mManualRefresh = modal.querySelector('#tm-modal-manual-refresh');
        const $mClose = modal.querySelector('#tm-modal-close');
        const $mCopy = modal.querySelector('#tm-modal-copy');
        const $mPlus = modal.querySelector('#tm-modal-plus');
        const $mMinus = modal.querySelector('#tm-modal-minus');
// 搜索功能
        const updateCount = () => {
            $mCount.textContent = `${matchEls.length}`;
        };
        $mSearch.addEventListener('click', () => {
            const regex = buildRegex($mQ.value, {
                caseSensitive: $mCase.checked,
                regex: $mReg.checked,
                wholeWord: $mWord.checked
            });
            if (!regex) return;
            highlight(modalContent, regex);
            updateCount();
            if (matchEls.length) goTo(0);
        });
        $mClear.addEventListener('click', () => {
            clearHighlight(modalContent);
            updateCount();
        });
        $mPrev.addEventListener('click', () => {
            if (matchEls.length) goTo(currentIdx - 1);
        });
        $mNext.addEventListener('click', () => {
            if (matchEls.length) goTo(currentIdx + 1);
        });
// 自动刷新功能
        const setAutoRefresh = (on) => {
            const doc = logRoot ? ownerDoc(logRoot) : document;
            if (on) {
                const btn = findRefreshButton(doc);
                if (!btn) {
                    alert('未找到"刷新"按钮，请确认在日志页');
                    return;
                }
                if (autoRefreshTimer) clearInterval(autoRefreshTimer);
                autoRefreshTimer = setInterval(() => {
                    const b = findRefreshButton(doc);
                    if (b) {
                        clickEl(b);
                        log('auto refresh clicked');
                        // 延迟更新模态框内容，确保页面刷新后内容已更新
                        setTimeout(() => {
                            updateModalText();
                            if ($mLock.checked) modalContent.scrollTop = modalContent.scrollHeight;
                        }, 1000);
                    }
                }, 2000); // 固定2秒间隔
                $mRefreshToggle.textContent = '自动刷新: 开';
            } else {
                if (autoRefreshTimer) clearInterval(autoRefreshTimer);
                autoRefreshTimer = null;
                $mRefreshToggle.textContent = '自动刷新: 关';
            }
        };

        // 手动刷新功能
        const manualRefresh = () => {
            const doc = logRoot ? ownerDoc(logRoot) : document;
            const btn = findRefreshButton(doc);
            if (btn) {
                clickEl(btn);
                log('manual refresh clicked');
                // 延迟更新模态框内容，确保页面刷新后内容已更新
                setTimeout(() => {
                    updateModalText();
                    if ($mLock.checked) modalContent.scrollTop = modalContent.scrollHeight;
                }, 1000);
            } else {
                alert('未找到"刷新"按钮，请确认在日志页');
            }
        };

        // 默认开启自动刷新
        setAutoRefresh(true);

        $mRefreshToggle.addEventListener('click', () => setAutoRefresh(!autoRefreshTimer));
        $mManualRefresh.addEventListener('click', manualRefresh);
// 其他功能
        $mClose.addEventListener('click', closeModal);
        $mCopy.addEventListener('click', () => {
            try {
                navigator.clipboard && navigator.clipboard.writeText(modalContent.textContent || '');
            } catch (e) {
            }
        });
        $mPlus.addEventListener('click', () => {
            modalFont += 2;
            modalContent.style.fontSize = modalFont + 'px';
        });
        $mMinus.addEventListener('click', () => {
            modalFont = Math.max(10, modalFont - 2);
            modalContent.style.fontSize = modalFont + 'px';
        });
// 快捷键
        const handleKeydown = (e) => {
            const isMac = navigator.platform.toUpperCase().includes('MAC');
            if ((isMac ? e.metaKey : e.ctrlKey) && e.key === 'f') {
                e.preventDefault();
                $mQ.focus();
            } else if (e.key === 'Enter' && !e.shiftKey && matchEls.length) {
                e.preventDefault();
                goTo(currentIdx + 1);
            } else if (e.key === 'Enter' && e.shiftKey && matchEls.length) {
                e.preventDefault();
                goTo(currentIdx - 1);
            } else if (e.key === 'Escape') {
                closeModal();
            }
        };
        document.addEventListener('keydown', handleKeydown);
        modal.addEventListener('remove', () => {
            document.removeEventListener('keydown', handleKeydown);
        });
// 监听日志内容变化
        modalObserver = new MutationObserver(() => {
            updateModalText();
            if ($mLock.checked) modalContent.scrollTop = modalContent.scrollHeight;
            const regex = buildRegex($mQ.value, {
                caseSensitive: $mCase.checked,
                regex: $mReg.checked,
                wholeWord: $mWord.checked
            });
            if (regex && ($mQ.value || '').length) {
                highlight(modalContent, regex);
                updateCount();
            }
        });
        modalObserver.observe(logRoot, {childList: true, subtree: true, characterData: true});
    }

// 点击外部按钮打开全屏视图
// 定时重试识别容器（应对控制台路由变化）
    setInterval(() => {
        if (!logRoot || !document.body.contains(logRoot)) {
            ensureRoot();
        }
    }, 3000);
})();