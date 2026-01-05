// ==UserScript==
// @name         猫猫放置-备忘录
// @namespace    https://moyu-idle.com/notepad
// @version      1.0.0
// @description  好记性不如烂笔头，记一下发展目标和TODO
// @match        https://moyu-idle.com
// @match        https://www.moyu-idle.com
// @match        https://*moyu-idle.com
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558806/%E7%8C%AB%E7%8C%AB%E6%94%BE%E7%BD%AE-%E5%A4%87%E5%BF%98%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/558806/%E7%8C%AB%E7%8C%AB%E6%94%BE%E7%BD%AE-%E5%A4%87%E5%BF%98%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /******************** 配置 ********************/
    const OPEN_DELAY_SECONDS = 3;
    const STORAGE_KEY = 'floating_memo_state';

    const DEFAULT_STATE = {
        state: 'editing', // 'editing' | 'minimized'
        position: { top: 120, left: 120 },
        size: { width: 260, height: 180 },
        content: ''
    };

    /******************** 工具函数 ********************/
    function loadState() {
        try {
            const raw = GM_getValue(STORAGE_KEY, null);
            return raw ? JSON.parse(raw) : { ...DEFAULT_STATE };
        } catch {
            return { ...DEFAULT_STATE };
        }
    }

    function saveState(state) {
        GM_setValue(STORAGE_KEY, JSON.stringify(state));
    }

    /******************** 主类 ********************/
    class FloatingMemo {
        constructor() {
            this.state = loadState();
            this.dragging = false;
            this.dragOffset = { x: 0, y: 0 };

            this.createDOM();
            this.applyState();
            this.bindEvents();
        }

        createDOM() {
            // 容器
            this.container = document.createElement('div');
            this.container.className = 'fm-container';

            // Header
            this.header = document.createElement('div');
            this.header.className = 'fm-header';
            this.header.innerHTML = `
        <span class="fm-title">记事本</span>
        <button class="fm-toggle">—</button>
      `;

            // Body
            this.textarea = document.createElement('textarea');
            this.textarea.className = 'fm-body';
            this.textarea.placeholder = '记点东西……';

            this.container.appendChild(this.header);
            this.container.appendChild(this.textarea);
            document.body.appendChild(this.container);

            this.injectStyle();
        }

        injectStyle() {
            const style = document.createElement('style');
            style.textContent = `
        .fm-container {
          position: fixed;
          background: #0b1220;
          border: 1px solid #1f2a44;
          border-radius: 8px;
          color: #e6e9f0;
          z-index: 999999;
          resize: both;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0,0,0,0.35);
        }

        .fm-header {
          height: 32px;
          background: #0e1628;
          cursor: move;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 8px;
          font-size: 13px;
          user-select: none;
        }

        .fm-title {
          opacity: 0.85;
        }

        .fm-toggle {
          background: transparent;
          border: none;
          color: #6f8cff;
          font-size: 16px;
          cursor: pointer;
        }

        .fm-toggle:hover {
          color: #9db1ff;
        }

        .fm-body {
          width: 100%;
          height: calc(100% - 32px);
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          color: inherit;
          padding: 8px;
          font-size: 13px;
          line-height: 1.4;
          overflow: auto;
          box-sizing: border-box;
        }

        .fm-minimized .fm-body {
          display: none;
        }

        .fm-minimized {
          resize: none;
          height: 32px !important;
        }
      `;
            document.head.appendChild(style);
        }

        applyState() {
            const { position, size, content, state } = this.state;

            this.container.style.top = position.top + 'px';
            this.container.style.left = position.left + 'px';
            this.container.style.width = size.width + 'px';
            this.container.style.height = size.height + 'px';

            this.textarea.value = content;

            if (state === 'minimized') {
                this.minimize(false);
            } else {
                this.expand(false);
            }
        }

        bindEvents() {
            // 拖拽
            this.header.addEventListener('mousedown', (e) => {
                this.dragging = true;
                this.dragOffset.x = e.clientX - this.container.offsetLeft;
                this.dragOffset.y = e.clientY - this.container.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (!this.dragging) return;
                const left = e.clientX - this.dragOffset.x;
                const top = e.clientY - this.dragOffset.y;
                this.container.style.left = left + 'px';
                this.container.style.top = top + 'px';
            });

            document.addEventListener('mouseup', () => {
                if (!this.dragging) return;
                this.dragging = false;
                this.persistPosition();
            });

            // 切换最小化
            this.header.querySelector('.fm-toggle')
                .addEventListener('click', () => this.toggle());

            // 内容保存
            this.textarea.addEventListener('input', () => {
                this.state.content = this.textarea.value;
                saveState(this.state);
            });

            // 尺寸变化保存
            let resizeTimer = null;
            this.container.addEventListener('mouseup', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => this.persistSize(), 100);
            });
        }

        toggle() {
            if (this.state.state === 'minimized') {
                this.expand();
            } else {
                this.minimize();
            }
        }

        minimize(save = true) {
            this.container.classList.add('fm-minimized');
            this.state.state = 'minimized';
            if (save) saveState(this.state);
        }

        expand(save = true) {
            this.container.classList.remove('fm-minimized');
            this.state.state = 'editing';
            if (save) saveState(this.state);
        }

        persistPosition() {
            this.state.position = {
                top: this.container.offsetTop,
                left: this.container.offsetLeft
            };
            saveState(this.state);
        }

        persistSize() {
            if (this.state.state === 'minimized') return;
            this.state.size = {
                width: this.container.offsetWidth,
                height: this.container.offsetHeight
            };
            saveState(this.state);
        }
    }

    /******************** 启动 ********************/
    setTimeout(() => {
        new FloatingMemo();
    }, OPEN_DELAY_SECONDS * 1000);

})();
