// ==UserScript==
// @name         智能打字机器人
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  逐字打字 + UI(Shadow DOM) + 元素拾取(选中后高亮短暂显示即消失)
// @author       zskfree
// @match        *://*/*
// @run-at       document-end
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561336/%E6%99%BA%E8%83%BD%E6%89%93%E5%AD%97%E6%9C%BA%E5%99%A8%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/561336/%E6%99%BA%E8%83%BD%E6%89%93%E5%AD%97%E6%9C%BA%E5%99%A8%E4%BA%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isTyping = false, isPaused = false, currentIndex = 0;
    let targetElement = null, typingTimer = null, pickMode = false, hoverBox = null;

    // 仅供页面高亮用样式
    GM_addStyle(`
    .picker-hover{position:fixed;border:2px solid #00c6ff;background:rgba(0,198,255,.15);pointer-events:none;z-index:2147483646;display:none}
  `);

    // UI 句柄（统一从 Shadow 内拿）
    const ui = {
        host: null, shadow: null,
        els: {
            header: null, minBtn: null, contentWrap: null,
            input: null, pick: null, focus: null, importBtn: null, clear: null,
            status: null, barFill: null, slider: null, sv: null,
            start: null, pause: null, stop: null
        }
    };

    function createPanel() {
        if (document.getElementById('typing-robot-host')) return;

        const host = document.createElement('div');
        host.id = 'typing-robot-host';
        host.style.position = 'fixed';
        host.style.top = '20px';
        host.style.right = '20px';
        host.style.zIndex = '2147483647';
        document.body.appendChild(host);

        const shadow = host.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
      #panel{width:380px;background:#5b6ab3;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.3);font-family:'Microsoft YaHei',Arial,sans-serif;color:#fff;overflow:hidden}
      #header{background:rgba(0,0,0,.2);padding:12px;cursor:move;display:flex;justify-content:space-between;align-items:center;user-select:none}
      #title{font-size:15px;font-weight:bold}
      #min{cursor:pointer;font-size:18px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:rgba(255,255,255,.2)}
      #content{padding:16px}
      .btn{width:100%;padding:10px;margin:8px 0;border:none;border-radius:8px;font-size:14px;font-weight:bold;cursor:pointer;transition:.15s;color:#fff}
      .btn:hover{transform:translateY(-1px)}
      #start{background:linear-gradient(135deg,#11998e,#38ef7d)}
      #pause{background:linear-gradient(135deg,#f093fb,#f5576c)}
      #stop{background:linear-gradient(135deg,#fa709a,#fee140)}
      #pick{background:linear-gradient(135deg,#00c6ff,#0072ff)}
      #focus{background:linear-gradient(135deg,#ffd200,#f7971e); color:#333}
      #speed{margin:10px 0}
      #slider{width:100%;margin:8px 0}
      #bar{width:100%;height:8px;background:rgba(255,255,255,.3);border-radius:4px;margin:10px 0;overflow:hidden}
      #fill{height:100%;background:linear-gradient(90deg,#11998e,#38ef7d);width:0%;transition:width .2s}
      #status{font-size:12px;text-align:center;margin:8px 0;opacity:.9}
      #input{width:100%;min-height:140px;border-radius:8px;background:#fff;color:#222;padding:10px;font-size:13px;line-height:1.6;outline:none;white-space:pre-wrap}
      .row{display:flex;gap:8px}
      .half{flex:1}
      .hidden{display:none!important}
      .tag{font-size:12px;opacity:.85;margin-bottom:6px}
    `;
        shadow.appendChild(style);

        const panel = document.createElement('div');
        panel.id = 'panel';
        panel.innerHTML = `
      <div id="header">
        <span id="title">⌨️ 智能打字机器人</span>
        <span id="min">−</span>
      </div>
      <div id="content">
        <div class="tag">待输入文本（可粘贴/拖拽文件/导入）：</div>
        <div id="input" contenteditable="true" spellcheck="false"></div>
        <div class="row">
          <button class="btn half" id="pick">🎯 选择输入框</button>
          <button class="btn half" id="focus">📍 定位并点击目标</button>
        </div>
        <div class="row">
          <button class="btn half" id="import">📥 导入文本</button>
          <button class="btn half" id="clear">🧹 清空</button>
        </div>
        <div id="status">提示：点击“选择输入框”，用鼠标点页面上的输入框。</div>
        <div id="bar"><div id="fill"></div></div>
        <div id="speed">
          <label>打字速度：<span id="sv">普通</span></label>
          <input type="range" id="slider" min="1" max="5" value="3" step="1">
        </div>
        <button class="btn" id="start">🚀 开始打字</button>
        <button class="btn hidden" id="pause">⏸️ 暂停</button>
        <button class="btn hidden" id="stop">⏹️ 停止</button>
      </div>
    `;
        shadow.appendChild(panel);

        // 保存引用
        ui.host = host; ui.shadow = shadow;
        ui.els.header = panel.querySelector('#header');
        ui.els.minBtn = panel.querySelector('#min');
        ui.els.contentWrap = panel.querySelector('#content');
        ui.els.input = panel.querySelector('#input');
        ui.els.pick = panel.querySelector('#pick');
        ui.els.focus = panel.querySelector('#focus');
        ui.els.importBtn = panel.querySelector('#import');
        ui.els.clear = panel.querySelector('#clear');
        ui.els.status = panel.querySelector('#status');
        ui.els.barFill = panel.querySelector('#fill');
        ui.els.slider = panel.querySelector('#slider');
        ui.els.sv = panel.querySelector('#sv');
        ui.els.start = panel.querySelector('#start');
        ui.els.pause = panel.querySelector('#pause');
        ui.els.stop = panel.querySelector('#stop');

        // 最小化
        ui.els.minBtn.addEventListener('click', () => {
            ui.els.contentWrap.classList.toggle('hidden');
            ui.els.minBtn.textContent = ui.els.contentWrap.classList.contains('hidden') ? '+' : '−';
        });

        // 阻断站点脚本，允许在面板中自由粘贴/输入
        const stopAll = (e) => { e.stopPropagation(); e.stopImmediatePropagation(); };
        ['paste', 'copy', 'cut', 'keydown', 'keyup', 'keypress', 'input', 'dragover', 'drop'].forEach(t => {
            ui.els.input.addEventListener(t, stopAll, true);
        });
        ui.els.input.addEventListener('paste', (e) => {
            e.preventDefault(); stopAll(e);
            const text = (e.clipboardData || window.clipboardData)?.getData('text') || '';
            insertTextIntoContentEditable(ui.els.input, text);
        }, true);
        ui.els.input.addEventListener('dragover', e => { e.preventDefault(); }, true);
        ui.els.input.addEventListener('drop', async e => {
            e.preventDefault();
            const file = e.dataTransfer?.files?.[0];
            if (file) insertTextIntoContentEditable(ui.els.input, await file.text());
        }, true);

        // 按钮
        ui.els.pick.addEventListener('click', togglePickMode);
        ui.els.focus.addEventListener('click', focusTargetInput);
        ui.els.importBtn.addEventListener('click', () => {
            const t = prompt('请输入/粘贴要输入的文本：', '');
            if (t) ui.els.input.textContent = t;
        });
        ui.els.clear.addEventListener('click', () => { ui.els.input.textContent = ''; });
        ui.els.start.addEventListener('click', () => startTyping());
        ui.els.pause.addEventListener('click', pauseTyping);
        ui.els.stop.addEventListener('click', stopTyping);

        // 速度
        const names = ['极慢', '慢速', '普通', '快速', '极快'];
        ui.els.slider.addEventListener('input', e => ui.els.sv.textContent = names[e.target.value - 1]);

        // 拖拽（拖宿主，抓 shadow 内 header）
        makeDraggable(ui.host, ui.els.header);

        // 拾取器
        setupPicker();

        updateUI('点击“选择输入框”，鼠标点目标输入框进行记录。', 0);
    }

    // 在 contenteditable 中插入文本
    function insertTextIntoContentEditable(el, text) {
        const sel = el.ownerDocument.getSelection();
        if (!sel || !sel.rangeCount) {
            const r = el.ownerDocument.createRange();
            r.selectNodeContents(el); r.collapse(false);
            sel.removeAllRanges(); sel.addRange(r);
        }
        const range = sel.getRangeAt(0);
        const node = document.createTextNode(text);
        range.insertNode(node);
        range.setStartAfter(node);
        range.setEndAfter(node);
        sel.removeAllRanges(); sel.addRange(range);
    }

    function makeDraggable(hostEl, handleEl) {
        let dx = 0, dy = 0, px = 0, py = 0, dragging = false;
        handleEl.addEventListener('mousedown', (e) => {
            if (pickMode) return;
            dragging = true; px = e.clientX; py = e.clientY; e.preventDefault();
        });
        document.addEventListener('mouseup', () => { dragging = false; });
        document.addEventListener('mousemove', (ev) => {
            if (!dragging) return;
            ev.preventDefault();
            dx = px - ev.clientX; dy = py - ev.clientY;
            px = ev.clientX; py = ev.clientY;
            hostEl.style.top = (hostEl.offsetTop - dy) + 'px';
            hostEl.style.left = (hostEl.offsetLeft - dx) + 'px';
            hostEl.style.right = 'auto';
        });
    }

    function getSpeedConfig() {
        const speed = parseInt(ui.els.slider?.value || '3', 10);
        const cfg = {
            1: { min: 150, max: 300, punctuation: { min: 400, max: 800 }, thinkChance: 0.15 },
            2: { min: 100, max: 200, punctuation: { min: 300, max: 600 }, thinkChance: 0.12 },
            3: { min: 50, max: 150, punctuation: { min: 200, max: 500 }, thinkChance: 0.10 },
            4: { min: 30, max: 100, punctuation: { min: 150, max: 300 }, thinkChance: 0.08 },
            5: { min: 20, max: 60, punctuation: { min: 100, max: 200 }, thinkChance: 0.05 }
        };
        return cfg[speed];
    }

    function updateUI(status, progress) {
        if (ui.els.status) ui.els.status.textContent = status;
        if (ui.els.barFill) ui.els.barFill.style.width = (progress || 0) + '%';
    }

    // 高亮框：短暂闪烁
    function flashHighlight(el, ms = 600) {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        hoverBox.style.left = rect.left + 'px';
        hoverBox.style.top = rect.top + 'px';
        hoverBox.style.width = rect.width + 'px';
        hoverBox.style.height = rect.height + 'px';
        hoverBox.style.display = 'block';
        setTimeout(() => { hoverBox.style.display = 'none'; }, ms);
    }

    // 拾取器
    function setupPicker() {
        hoverBox = document.createElement('div');
        hoverBox.className = 'picker-hover';
        document.body.appendChild(hoverBox);

        document.addEventListener('mousemove', onMouseMovePick, true);
        document.addEventListener('click', onClickPick, true);
    }

    function togglePickMode() {
        pickMode = !pickMode;
        if (pickMode) {
            ui.els.pick.textContent = '✅ 拾取中...（点击目标输入框）';
            hoverBox.style.display = 'none';
            updateUI('拾取中：把鼠标移到目标输入框上，然后点击它。按 Esc 退出。', 0);
        } else {
            ui.els.pick.textContent = '🎯 选择输入框';
            hoverBox.style.display = 'none';
            updateUI('拾取结束。', 0);
        }
    }

    function onMouseMovePick(e) {
        if (!pickMode) return;
        const el = e.target.closest('input, textarea, [contenteditable], [contenteditable="true"], [contenteditable=""]');
        if (!el) { hoverBox.style.display = 'none'; return; }
        const rect = el.getBoundingClientRect();
        hoverBox.style.left = rect.left + 'px';
        hoverBox.style.top = rect.top + 'px';
        hoverBox.style.width = rect.width + 'px';
        hoverBox.style.height = rect.height + 'px';
        hoverBox.style.display = 'block';
    }

    // 点击选择：只闪一下就隐藏，不常驻
    function onClickPick(e) {
        if (!pickMode) return;
        const el = e.target.closest('input, textarea, [contenteditable], [contenteditable="true"], [contenteditable=""]');
        if (!el) {
            updateUI('⚠️ 请选择可输入的元素（input/textarea/contenteditable）。', 0);
            e.preventDefault(); e.stopPropagation();
            return;
        }
        targetElement = el;
        // 退出拾取，但先闪一下
        flashHighlight(targetElement, 600);
        pickMode = false;
        ui.els.pick.textContent = '🎯 选择输入框';
        updateUI('✅ 已记录目标输入框', 0);
        e.preventDefault(); e.stopPropagation();
    }

    // 定位并点击（可选也闪一下）
    function focusTargetInput() {
        if (!targetElement) { updateUI('⚠️ 尚未记录目标输入框', 0); return; }
        try { targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch { }
        setTimeout(() => {
            targetElement.focus();
            const rect = targetElement.getBoundingClientRect();
            targetElement.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 }));
            flashHighlight(targetElement, 400);
            updateUI('📍 已定位并点击目标输入框', 0);
        }, 250);
    }

    // 逐字键入
    function simulateKey(element, char) {
        ['keydown', 'keypress'].forEach(type => {
            element.dispatchEvent(new KeyboardEvent(type, { key: char, bubbles: true, cancelable: true }));
        });

        if (element.isContentEditable || element.getAttribute('contenteditable') === '' || element.getAttribute('contenteditable') === 'true') {
            const sel = window.getSelection();
            if (!sel.rangeCount) {
                const r = document.createRange();
                r.selectNodeContents(element);
                r.collapse(false);
                sel.removeAllRanges(); sel.addRange(r);
            }
            const range = sel.getRangeAt(0);
            const node = document.createTextNode(char);
            range.insertNode(node);
            range.setStartAfter(node);
            range.setEndAfter(node);
            sel.removeAllRanges(); sel.addRange(range);
        } else {
            const start = element.selectionStart ?? element.value.length;
            const end = element.selectionEnd ?? element.value.length;
            const v = element.value ?? '';
            element.value = v.slice(0, start) + char + v.slice(end);
            element.selectionStart = element.selectionEnd = start + 1;
        }

        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true, cancelable: true }));
    }

    function startTyping() {
        if (!targetElement) { updateUI('⚠️ 请先选择目标输入框', 0); return; }
        targetElement.focus();

        const text = (ui.els.input?.textContent || '').toString();
        if (!text) { updateUI('⚠️ 请输入要打字的文本', 0); return; }

        if (isTyping && isPaused) {
            isPaused = false; updateButtonState(); typeNext(text); return;
        }
        isTyping = true; isPaused = false; currentIndex = 0;
        updateButtonState(); typeNext(text);
    }

    function typeNext(text) {
        if (!isTyping || isPaused) return;
        if (currentIndex >= text.length) { stopTyping(); updateUI('✅ 输入完成！', 100); return; }

        const ch = text[currentIndex];
        simulateKey(targetElement, ch);

        const progress = ((currentIndex + 1) / text.length * 100).toFixed(1);
        updateUI(`正在输入... ${currentIndex + 1}/${text.length}`, progress);

        const cfg = getSpeedConfig();
        const punct = '，。、；：！？“”‘’（）【】—…';
        let delay = punct.includes(ch)
            ? Math.random() * (cfg.punctuation.max - cfg.punctuation.min) + cfg.punctuation.min
            : Math.random() * (cfg.max - cfg.min) + cfg.min;

        if (Math.random() < cfg.thinkChance) delay += Math.random() * 700 + 300;

        currentIndex++;
        typingTimer = setTimeout(() => typeNext(text), delay);
    }

    function pauseTyping() {
        isPaused = !isPaused;
        if (ui.els.pause) ui.els.pause.textContent = isPaused ? '▶️ 继续' : '⏸️ 暂停';
        const text = (ui.els.input?.textContent || '').toString();
        if (!isPaused) {
            updateUI(`继续输入... ${currentIndex}/${text.length}`, (currentIndex / text.length * 100).toFixed(1));
            typeNext(text);
        } else {
            updateUI('⏸️ 已暂停', (currentIndex / text.length * 100).toFixed(1));
        }
    }

    function stopTyping() {
        isTyping = false; isPaused = false; currentIndex = 0;
        clearTimeout(typingTimer);
        updateButtonState(); updateUI('已停止', 0);
    }

    function updateButtonState() {
        if (isTyping) {
            ui.els.start?.classList.add('hidden');
            ui.els.pause?.classList.remove('hidden');
            ui.els.stop?.classList.remove('hidden');
        } else {
            ui.els.start?.classList.remove('hidden');
            ui.els.pause?.classList.add('hidden');
            ui.els.stop?.classList.add('hidden');
        }
    }

    function init() { createPanel(); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
    window.addEventListener('load', () => { if (!document.getElementById('typing-robot-host')) init(); });

    // 快捷键：Esc 退出拾取；Ctrl+Shift+T 显示/隐藏面板
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && pickMode) { togglePickMode(); }
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            if (ui.host) ui.host.style.display = ui.host.style.display === 'none' ? 'block' : 'none';
            else init();
        }
    });

})();