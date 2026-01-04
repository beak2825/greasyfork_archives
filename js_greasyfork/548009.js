// ==UserScript==
// @name         Chzzk 선명한 화면 업그레이드
// @description  선명도 필터 제공
// @namespace    http://tampermonkey.net/
// @icon         https://chzzk.naver.com/favicon.ico
// @version      2.8
// @match        https://chzzk.naver.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548009/Chzzk%20%EC%84%A0%EB%AA%85%ED%95%9C%20%ED%99%94%EB%A9%B4%20%EC%97%85%EA%B7%B8%EB%A0%88%EC%9D%B4%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/548009/Chzzk%20%EC%84%A0%EB%AA%85%ED%95%9C%20%ED%99%94%EB%A9%B4%20%EC%97%85%EA%B7%B8%EB%A0%88%EC%9D%B4%EB%93%9C.meta.js
// ==/UserScript==
; (async () => {
    'use strict';
    const STORAGE_KEY_ENABLED = 'chzzkSharpnessEnabled';
    const STORAGE_KEY_INTENSITY = 'chzzkSharpnessIntensity';
    const STORAGE_KEY_MODE = 'chzzkSharpnessMode';
    const FILTER_ID_DEFAULT = 'sharp_default';
    const FILTER_ID_NATURAL = 'sharp_natural';
    const SVG_ID = 'sharpnessSVGContainer';
    const STYLE_ID = 'sharpnessStyle';
    const MENU_SELECTOR = '.pzp-pc__settings';
    const FILTER_ITEM_SELECTOR = '.pzp-pc-setting-intro-filter';
    const hasGM = typeof GM !== 'undefined' && typeof GM.getValue === 'function';
    const getValue = hasGM
        ? GM.getValue.bind(GM)
        : async (k, d) => {
            const v = localStorage.getItem(k);
            return v == null ? d : JSON.parse(v);
        };
    const setValue = hasGM
        ? GM.setValue.bind(GM)
        : async (k, v) => localStorage.setItem(k, JSON.stringify(v));
    function isLivePage() {
        return /^\/live\/[^/]+/.test(location.pathname);
    }
    function clearSharpness() {
        document.getElementById(SVG_ID)?.remove();
        document.getElementById(STYLE_ID)?.remove();
    }
    class SharpnessFilter extends EventTarget {
        #enabled = false;
        #intensity = 1;
        #mode = 'default';
        #svg;
        #style;
        controls = null;
        constructor() {
            super();
            this.#svg = this.#createSVG();
            this.#style = this.#createStyle();
            this.#style.media = 'none';
        }
        get enabled() { return this.#enabled; }
        get intensity() { return this.#intensity; }
        get mode() { return this.#mode; }
        #createSVG() {
            const div = document.createElement('div');
            div.id = SVG_ID;
            div.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;">
                  <defs>
                    <filter id="${FILTER_ID_DEFAULT}">
                      <feConvolveMatrix order="3" divisor="1" kernelMatrix="" />
                    </filter>
                    <filter id="${FILTER_ID_NATURAL}">
                      <feConvolveMatrix order="3" divisor="1" kernelMatrix="" />
                      <feColorMatrix type="saturate" values="1.2" />
                    </filter>
                  </defs>
                </svg>`;
            return div;
        }
        #createStyle() {
            const style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = `
                .pzp-pc .webplayer-internal-video {
                    filter: url(#${FILTER_ID_DEFAULT}) !important;
                }
                .sharp-slider {
                    accent-color: var(--sharp-accent, #00f889);
                }
                #sharp-filter-select {
                    border: 1px solid #00f889;
                    border-radius: 4px;
                    padding: 4px 8px;
                    font-size: 13px;
                }
                #sharp-filter-select:focus {
                outline: 2px solid #00f889;
                }
            `;
            return style;
        }
        #updateFilterMatrix() {
            const k = this.#intensity;
            const off = -((k - 1) / 4);
            const matrix = `0 ${off} 0 ${off} ${k} ${off} 0 ${off} 0`;
            const matElems = this.#svg.querySelectorAll('feConvolveMatrix');
            matElems.forEach(elem => {
                elem.setAttribute('kernelMatrix', matrix);
            });
        }
        #applyModeToStyle() {
            const filterId = this.#mode === 'natural' ? FILTER_ID_NATURAL : FILTER_ID_DEFAULT;
            this.#style.textContent = `
                .pzp-pc .webplayer-internal-video {
                    filter: url(#${filterId}) !important;
                }
                .sharp-slider {
                    accent-color: var(--sharp-accent, #00f889);
                }
                #sharp-filter-select {
                    border: 1px solid #00f889;
                    border-radius: 4px;
                    padding: 4px 8px;
                    font-size: 13px;
                }
                #sharp-filter-select:focus {
                outline: 2px solid #00f889;
                }
            `;
            this.#style.media = this.#enabled ? 'all' : 'none';
        }
        async init() {
            if (isLivePage()) {
                clearSharpness();
                document.body.append(this.#svg);
                document.head.append(this.#style);
            }
            this.#intensity = await getValue(STORAGE_KEY_INTENSITY, 1);
            this.#enabled = await getValue(STORAGE_KEY_ENABLED, false);
            this.#mode = await getValue(STORAGE_KEY_MODE, 'default');
            this.#updateFilterMatrix();
            this.#applyModeToStyle();
            const menu = document.querySelector(MENU_SELECTOR);
            if (menu) {
                delete menu.dataset.sharpEnhanceDone;
                this.addMenuControls(menu);
            }
            if (this.controls) this.refreshControls();
            this.dispatchEvent(new Event('initialized'));
        }
        enable(persist = true) {
            this.#enabled = true;
            if (persist) setValue(STORAGE_KEY_ENABLED, true);
            this.#applyModeToStyle();
            this.refreshControls();
        }
        disable(persist = true) {
            this.#enabled = false;
            if (persist) setValue(STORAGE_KEY_ENABLED, false);
            this.#applyModeToStyle();
            this.refreshControls();
        }
        toggle() {
            this.enabled ? this.disable() : this.enable();
        }
        setIntensity(v) {
            this.#intensity = v;
            this.#updateFilterMatrix();
            setValue(STORAGE_KEY_INTENSITY, v);
            this.refreshControls();
        }
        setMode(m) {
            if (m !== 'default' && m !== 'natural') return;
            this.#mode = m;
            this.#applyModeToStyle();
            setValue(STORAGE_KEY_MODE, m);
        }
        registerControls({ wrapper, checkbox, slider, label, select }) {
            this.controls = { wrapper, checkbox, slider, label, select };
            ['enabled', 'disabled', 'intensitychange', 'modechange'].forEach(evt =>
                this.addEventListener(evt, () => this.refreshControls())
            );
            this.refreshControls();
        }
        refreshControls() {
            if (!this.controls) return;
            const { wrapper, checkbox, slider, label, select } = this.controls;
            checkbox.checked = this.enabled;
            wrapper.setAttribute('aria-checked', String(this.enabled));
            slider.style.accentColor = this.enabled ? '#00f889' : 'gray';
            slider.value = this.intensity;
            slider.setAttribute('aria-valuenow', this.intensity.toFixed(1));
            slider.setAttribute('aria-valuetext', `강도 ${this.intensity.toFixed(1)} 배`);
            label.textContent = `(${this.intensity.toFixed(1)}x 배)`;
            select.value = this.mode;
        }
        drawTestPattern() {
            const c = document.getElementById('sharp-test-canvas');
            if (!c) return;
            const ctx = c.getContext('2d');
            const { width: w, height: h } = c;
            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 1;
            for (let x = 0; x <= w; x += 10) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y <= h; y += 10) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
            ctx.strokeStyle = '#444';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(w, h);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(w, 0);
            ctx.lineTo(0, h);
            ctx.stroke();
        }
        addMenuControls(menu) {
            if (menu.dataset.sharpEnhanceDone) return;
            menu.dataset.sharpEnhanceDone = 'true';
            let container = menu.querySelector(FILTER_ITEM_SELECTOR);
            if (!container) {
                container = document.createElement('div');
                container.className = 'pzp-ui-setting-home-item';
                container.setAttribute('role', 'menuitem');
                container.tabIndex = 0;
                menu.append(container);
            }
            container.innerHTML = `
                <div class="pzp-ui-setting-home-item__top">
                  <div class="pzp-ui-setting-home-item__left">
                    <span class="pzp-ui-setting-home-item__label">선명한 화면</span>
                  </div>
                  <div class="pzp-ui-setting-home-item__right">
                    <div role="switch" class="pzp-ui-toggle sharp-toggle-wrapper"
                         aria-label="샤프닝 필터 토글"
                         aria-checked="${this.enabled}" tabindex="0">
                      <input type="checkbox" class="pzp-ui-toggle__checkbox sharp-toggle" tabindex="-1">
                      <div class="pzp-ui-toggle__handle"></div>
                    </div>
                  </div>
                </div>
                <div class="pzp-ui-setting-home-item__bottom" style="padding:8px;display:flex;flex-direction:column;gap:8px;">
                  <!-- 드롭다운 메뉴 -->
                  <div style="display:flex;align-items:center;gap:8px;">
                    <label for="sharp-filter-select" class="visually-hidden">필터 선택</label>
                    <select id="sharp-filter-select">
                      <option value="default">현재 필터 (기본 값)</option>
                      <option value="natural">색상 보정 필터</option>
                    </select>
                  </div>
                  <!-- 강도 조절 슬라이더 -->
                  <div style="display:flex;align-items:center;gap:8px;">
                    <label for="sharp-slider" class="visually-hidden">강도 조절</label>
                    <input id="sharp-slider" type="range" min="1" max="3" step="0.1" class="sharp-slider"
                           aria-valuemin="1" aria-valuemax="3">
                    <span id="sharp-intensity-label"></span>
                  </div>
                  <!-- 테스트 캔버스 및 예시 이미지 -->
                  <div style="display:flex;gap:8px;">
                    <canvas id="sharp-test-canvas" width="100" height="100"
                      style="border:1px solid #ccc;filter:url(#${this.mode === 'natural' ? FILTER_ID_NATURAL : FILTER_ID_DEFAULT});"></canvas>
                    <img id="sharp-example-image"
                         src="https://images.unsplash.com/photo-1596854372745-0906a0593bca?q=80&w=2080"
                         alt="예시 이미지" width="100" height="100"
                         style="border:1px solid #ccc;filter:url(#${this.mode === 'natural' ? FILTER_ID_NATURAL : FILTER_ID_DEFAULT});display:block;vertical-align:top;">
                  </div>
                </div>`;
            const wrapper = container.querySelector('.sharp-toggle-wrapper');
            const checkbox = container.querySelector('.sharp-toggle');
            const slider = container.querySelector('#sharp-slider');
            const label = container.querySelector('#sharp-intensity-label');
            const select = container.querySelector('#sharp-filter-select');
            checkbox.checked = this.enabled;
            wrapper.setAttribute('aria-checked', String(this.enabled));
            slider.value = this.intensity;
            label.textContent = `(${this.intensity.toFixed(1)}x 배)`;
            select.value = this.mode;
            container.addEventListener('click', e => {
                if (
                    e.target.closest('.sharp-toggle-wrapper') ||
                    e.target.closest('.pzp-ui-toggle__handle')
                ) {
                    return;
                }
                if (
                    e.target.closest('#sharp-slider') ||
                    e.target.closest('#sharp-filter-select') ||
                    e.target.closest('option')
                ) {
                    e.stopPropagation();
                    return;
                }
                e.stopPropagation();
            }, { capture: true });
            wrapper.addEventListener('click', e => {
                e.stopPropagation();
                this.toggle();
            }, { capture: true });
            wrapper.addEventListener('keydown', e => {
                if (['Enter', ' '].includes(e.key)) {
                    e.preventDefault();
                    this.toggle();
                }
            });
            ['mousedown', 'pointerdown', 'touchstart'].forEach(evt => {
                slider.addEventListener(evt, e => e.stopPropagation(), { capture: true });
            });
            slider.addEventListener('input', e => {
                const v = parseFloat(e.target.value);
                this.setIntensity(v);
                this.drawTestPattern();
            });
            slider.addEventListener('keydown', e => {
                if (!this.enabled) return;
                let v = this.intensity;
                if (['ArrowRight', 'ArrowUp'].includes(e.key)) {
                    v = Math.min(v + 0.1, 3);
                } else if (['ArrowLeft', 'ArrowDown'].includes(e.key)) {
                    v = Math.max(v - 0.1, 1);
                } else {
                    return;
                }
                e.preventDefault();
                this.setIntensity(v);
                slider.value = v;
                this.drawTestPattern();
            });
            ['mousedown', 'pointerdown', 'mouseup'].forEach(evt => {
                select.addEventListener(evt, e => e.stopPropagation(), { capture: true });
            });
            select.addEventListener('change', e => {
                const newMode = e.target.value;
                this.setMode(newMode);
                this.drawTestPattern();
                const canvas = document.getElementById('sharp-test-canvas');
                const img = document.getElementById('sharp-example-image');
                const flip = this.mode === 'natural' ? FILTER_ID_NATURAL : FILTER_ID_DEFAULT;
                if (canvas) canvas.style.filter = `url(#${flip})`;
                if (img) img.style.filter = `url(#${flip})`;
            });
            this.registerControls({ wrapper, checkbox, slider, label, select });
            this.drawTestPattern();
        }
        observeMenus() {
            const root = document.querySelector('.pzp-pc') || document.body;
            const initMenu = document.querySelector(MENU_SELECTOR);
            if (initMenu) this.addMenuControls(initMenu);
            new MutationObserver(ms => {
                for (const m of ms) {
                    for (const n of m.addedNodes) {
                        if (!(n instanceof HTMLElement)) continue;
                        const menu = n.matches(MENU_SELECTOR) ? n : n.querySelector(MENU_SELECTOR);
                        if (menu) this.addMenuControls(menu);
                    }
                }
            }).observe(root, { childList: true, subtree: true });
        }
    }
    const sharpness = new SharpnessFilter();
    await sharpness.init();
    sharpness.observeMenus();
    (() => {
        let last = location.href;
        const onChange = async () => {
            if (location.href === last) return;
            last = location.href;
            if (isLivePage()) {
                await sharpness.init();
            }
        };
        ['pushState', 'replaceState'].forEach(m => {
            const orig = history[m];
            history[m] = function (...a) {
                const r = orig.apply(this, a);
                window.dispatchEvent(new Event('locationchange'));
                return r;
            };
        });
        window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
        window.addEventListener('locationchange', onChange);
    })();
})();