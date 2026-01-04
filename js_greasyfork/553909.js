// ==UserScript==
// @name Chzzk 올인원 스크립트 수정
// @namespace http://tampermonkey.net/
// @version NoGrid
// @description Chzzk 방송에서 자동 화질 설정, 광고 팝업 차단, 음소거 자동 해제, 360p 복구
// @match https://chzzk.naver.com/*
// @match https://mul.live/*
// @icon  https://chzzk.naver.com/favicon.ico
// @icon  https://mul.live/favicon.ico
// @grant GM.info
// @grant GM.getValue
// @grant GM.setValue
// @grant unsafeWindow
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553909/Chzzk%20%EC%98%AC%EC%9D%B8%EC%9B%90%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%20%EC%88%98%EC%A0%95.user.js
// @updateURL https://update.greasyfork.org/scripts/553909/Chzzk%20%EC%98%AC%EC%9D%B8%EC%9B%90%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%20%EC%88%98%EC%A0%95.meta.js
// ==/UserScript==
(async () => {
    "use strict";
    /**
     * @typedef {object} RegexConfig
     * @property {RegExp} adBlockDetect - 광고 차단 팝업을 감지하는 정규식
     * @property {RegExp} chzzkId - URL에서 방송 ID를 추출하는 정규식
     * @property {RegExp} version - 메타 정보에서 스크립트 버전을 추출하는 정규식.
     * @class Config
     * @description 스크립트의 모든 설정, 선택자, 유틸리티 함수를 중앙에서 관리하는 클래스.
     */
    class Config {
        #applyCooldown = 1000;
        #minTimeout = 1500;
        #defaultTimeout = 2000;
        #storageKeys = {
            quality: "chzzkPreferredQuality",
            autoUnmute: "chzzkAutoUnmute",
            debugLog: "chzzkDebugLog",
            screenSharpness: "chzzkScreenSharp",
            ignoredUpdate: "chzzkIgnoredUpdateDate",
        };
        #selectors = {
            popup: 'div[class^="popup_container"]',
            qualityBtn: 'button[command="SettingCommands.Toggle"]',
            qualityMenu: 'div[class*="pzp-pc-setting-intro-quality"]',
            qualityItems: 'li.pzp-ui-setting-quality-item[role="menuitem"]',
            headerMenu: ".header_service__DyG7M",
        };
        #styles = {
            success: "font-weight:bold; color:green",
            error: "font-weight:bold; color:red",
            info: "font-weight:bold; color:skyblue",
            warn: "font-weight:bold; color:orange",
        };
        #regex = {
            adBlockDetect: /광고\s*차단\s*프로그램.*사용\s*중/i,
            chzzkId: /(?:live|video)\/(?<id>[^/]+)/,
            version: /^\s*\/\/\s*@version\s+([\d.]+)/m,
        };
        #debug = true;

        /** @returns {number} 자동 적용 기능의 최소 실행 간격 (ms) */
        get applyCooldown() { return this.#applyCooldown; }
        /** @returns {number} 비동기 작업의 최소 타임아웃 (ms) */
        get minTimeout() { return this.#minTimeout; }
        /** @returns {number} 비동기 작업의 기본 타임아웃 (ms) */
        get defaultTimeout() { return this.#defaultTimeout; }
        /** @returns {object} Tampermonkey 저장소 키 목록 */
        get storageKeys() { return this.#storageKeys; }
        /** @returns {object} DOM 요소 선택자 목록 */
        get selectors() { return this.#selectors; }
        /** @returns {object} 콘솔 로그 스타일 목록 */
        get styles() { return this.#styles; }
        /** @returns {RegexConfig} 정규 표현식 목록 */
        get regex() { return this.#regex; }
        /** @returns {boolean} 디버그 로그 활성화 여부 */
        get debug() { return this.#debug; }
        /** @param {boolean} value - 디버그 로그 활성화 상태 */
        set debug(value) { this.#debug = !!value; }
        /**
         * 지정된 시간(ms)만큼 실행을 지연시킵니다.
         * @param {number} ms - 지연시킬 시간 (ms).
         * @returns {Promise<void>}
         */
        sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        /**
         * 특정 CSS 선택자에 해당하는 요소가 나타날 때까지 기다립니다.
         * @param {string} selector - 기다릴 요소의 CSS 선택자.
         * @param {number} [timeout=this.#defaultTimeout] - 대기할 최대 시간 (ms).
         * @returns {Promise<Element>} 발견된 요소를 resolve하는 프로미스.
         */
        waitFor = (selector, timeout = this.#defaultTimeout) => {
            const effective = Math.max(timeout, this.#minTimeout);
            return new Promise((resolve, reject) => {
                const el = document.querySelector(selector);
                if (el) return resolve(el);
                const mo = new MutationObserver(() => {
                    const found = document.querySelector(selector);
                    if (found) {
                        mo.disconnect();
                        resolve(found);
                    }
                });
                mo.observe(document.body, { childList: true, subtree: true });
                setTimeout(() => {
                    mo.disconnect();
                    reject(new Error("Timeout waiting for " + selector));
                }, effective);
            });
        };
        /**
         * 텍스트에서 불필요한 공백을 정리합니다.
         * @param {string} txt - 정리할 원본 텍스트.
         * @returns {string} 정리된 텍스트.
         */
        cleanText = (txt) => txt.trim().split(/\s+/).filter(Boolean).join(", ");
        /**
         * 텍스트에서 해상도 값을 숫자로 추출합니다. (예: "1080p" -> 1080)
         * @param {string} txt - 해상도 정보가 포함된 텍스트.
         * @returns {number|null} 추출된 해상도 숫자 또는 null.
         */
        extractResolution = (txt) => {
            const m = txt.match(/(\d{3,4})p/);
            return m ? parseInt(m[1], 10) : null;
        };
        /**
         * DOM 요소를 제거합니다.
         * @param {Element} el - 제거할 요소.
         */
        removeElement = (el) => el?.remove();
        /**
         * DOM 요소의 인라인 스타일을 모두 제거합니다.
         * @param {Element} el - 스타일을 제거할 요소.
         */
        clearStyle = (el) => el?.removeAttribute("style");
        // --- Logger Methods ---
        info = (...args) => this.#debug && console.log(...args);
        success = (...args) => this.#debug && console.log(...args);
        warn = (...args) => this.#debug && console.warn(...args);
        error = (...args) => this.#debug && console.error(...args);
        groupCollapsed = (...args) => this.#debug && console.groupCollapsed(...args);
        table = (...args) => this.#debug && console.table(...args);
        groupEnd = (...args) => this.#debug && console.groupEnd(...args);
        /**
         * 특정 요소가 나타나면 콜백 함수를 실행하는 MutationObserver를 등록합니다.
         * @param {string} selector - 감시할 요소의 CSS 선택자.
         * @param {function(Element): void} callback - 요소가 발견됐을 때 실행할 콜백 함수.
         * @param {boolean} [once=true] - 한 번만 실행할지 여부.
         */
        observeElement = (selector, callback, once = true) => {
            const mo = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    callback(el);
                    if (once) mo.disconnect();
                }
            });
            mo.observe(document.body, { childList: true, subtree: true });
            const initial = document.querySelector(selector);
            if (initial) {
                callback(initial);
                if (once) mo.disconnect();
            }
        };
    }
    /** @type {Config} 스크립트 전역 설정 및 유틸리티 인스턴스 */

    const C = new Config();
    /**
     * @async
     * @function addHeaderMenu
     * @description 치지직 헤더에 스크립트 설정 메뉴 UI를 추가합니다.
     * @returns {Promise<void>}
     */
    async function addHeaderMenu() {
        if (!document.getElementById('chzzk-allinone-styles')) {
            const customStyles = document.createElement('style');
            customStyles.id = 'chzzk-allinone-styles';
            customStyles.textContent = `
                .allinone-settings-button:hover {
                    background-color: var(--Surface-Interaction-Lighten-Hovered);
                    border-radius: 6px;
                }
                .button_label__fyHZ6 {
                    align-items: center;
                    background-color: var(--Surface-Neutral-Base);
                    border-radius: 6px;
                    box-shadow: 0 2px 2px var(--Shadow-Strong),0 2px 6px 2px var(--Shadow-Base);
                    color: var(--Content-Neutral-Cool-Stronger);
                    display: inline-flex;
                    font-family: -apple-system,BlinkMacSystemFont,Apple SD Gothic Neo,Helvetica,Arial,NanumGothic,나눔고딕,Malgun Gothic,맑은 고딕,Dotum,굴림,gulim,새굴림,noto sans,돋움,sans-serif;
                    font-size: 12px;
                    font-weight: 400;
                    height: 27px;
                    justify-content: center;
                    letter-spacing: -.3px;
                    line-height: 17px;
                    padding: 0 9px;
                    position: absolute;
                    white-space: nowrap;
                    z-index: 15000;
                }
                .allinone-tooltip-position {
                    top: calc(100% + 2px);
                    right: -10px;
                }
            `;
            document.head.appendChild(customStyles);
        }

        const toolbar = await C.waitFor('.toolbar_section__maAwZ');
        if (!toolbar || toolbar.querySelector('.allinone-settings-wrapper')) return;

        const boxWrapper = document.createElement('div');
        boxWrapper.className = 'toolbar_box__2DzCd';

        const itemWrapper = document.createElement('div');
        itemWrapper.className = 'toolbar_item__w9Z7l allinone-settings-wrapper';
        itemWrapper.style.position = 'relative';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'button_container__ppWwB button_only_icon__kahz5 button_larger__4NrSP allinone-settings-button';
        btn.innerHTML = `
        <svg width="28" height="28" color="currentColor" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: scale(1.4);">
            <g transform="translate(8,8)">
                <path d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"></path>
            </g>
        </svg>
        <span class="blind">올인원 환경설정</span>
    `;

        btn.addEventListener('mouseenter', () => {
            if (itemWrapper.querySelector('.button_label__fyHZ6')) return;
            const tooltip = document.createElement('span');
            tooltip.className = 'button_label__fyHZ6 allinone-tooltip-position';
            tooltip.textContent = '올인원 환경설정';
            itemWrapper.appendChild(tooltip);
        });

        btn.addEventListener('mouseleave', () => {
            const tooltip = itemWrapper.querySelector('.button_label__fyHZ6');
            if (tooltip) tooltip.remove();
        });

        itemWrapper.appendChild(btn);
        boxWrapper.appendChild(itemWrapper);

        const profileBox = toolbar.querySelector('.toolbar_profile_button__tZxIO')?.closest('.toolbar_box__2DzCd');
        if (profileBox) {
            toolbar.insertBefore(boxWrapper, profileBox);
        } else {
            toolbar.appendChild(boxWrapper);
        }

        const menu = document.createElement('div');
        menu.className = 'allinone-settings-menu';
        Object.assign(menu.style, {
            position: 'absolute',
            background: 'var(--color-bg-layer-02)',
            borderRadius: '10px',
            boxShadow: '0 8px 20px var(--color-shadow-layer01-02), 0 0 1px var(--color-shadow-layer01-01)',
            color: 'var(--color-content-03)',
            overflow: 'auto',
            padding: '18px',
            right: '0px',
            top: 'calc(100% + 7px)',
            width: '240px',
            zIndex: 13000,
            display: 'none'
        });

        itemWrapper.appendChild(menu);

        const helpContent = document.createElement('div');
        helpContent.className = 'allinone-help-content';

        Object.assign(helpContent.style, {
            display: 'none',
            margin: '4px 0',
            padding: '4px 8px 4px 34px',
            fontFamily: 'Sandoll Nemony2, Apple SD Gothic NEO, Helvetica Neue, Helvetica, NanumGothic, Malgun Gothic, gulim, noto sans, Dotum, sans-serif',
            fontSize: '14px',
            color: 'var(--color-content-03)',
            whiteSpace: 'pre-wrap',
        });
        helpContent.innerHTML =
            '<h2 style="color: var(--color-content-chzzk-02); margin-bottom:6px;">메뉴 사용법</h2>' +
            '<div style="white-space:pre-wrap; line-height:1.4; font-size:14px; color:inherit;">' +
            '<strong style="display:block; font-weight:600; margin:6px 0 2px;">1. 자동 언뮤트</strong>' +
            '방송이 시작되면 자동으로 음소거를 해제합니다. 간헐적으로 음소거 상태로 전환되는 문제를 보완하기 위해 추가된 기능입니다.\n\n' +
            '<strong style="display:block; font-weight:600; margin:6px 0 2px;">2. 선명한 화면</strong>' +
            '“선명한 화면 2.0” 옵션을 활성화하면 개발자가 제작한 외부 스크립트를 적용하여, 기본 제공되는 선명도 기능을 대체합니다.' +
            '</div>';

        const helpBtn = document.createElement('button');
        helpBtn.className = 'allinone-settings-item';
        helpBtn.style.display = 'flex';
        helpBtn.style.alignItems = 'center';
        helpBtn.style.margin = '8px 0';
        helpBtn.style.padding = '4px 8px';
        helpBtn.style.fontFamily = 'Sandoll Nemony2, Apple SD Gothic NEO, Helvetica Neue, Helvetica, NanumGothic, Malgun Gothic, gulim, noto sans, Dotum, sans-serif';
        helpBtn.style.fontSize = '14px';
        helpBtn.style.color = 'inherit';
        helpBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:10px;" color="inherit">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 1 1 5.82 1c-.5 1.3-2.91 2-2.91 2"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span style="margin-left:8px">도움말</span>
    `;
        helpBtn.addEventListener('click', () => {
            helpContent.style.display = helpContent.style.display === 'none' ? 'block' : 'none';
        });

        menu.appendChild(helpBtn);
        menu.appendChild(helpContent);

        const unmuteSvgOff = `<svg class="profile_layer_icon__7g3e-" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"/></svg>`;
        const unmuteSvgOn = `<svg class="profile_layer_icon__7g3e-" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"/></svg>`;
        const sharpSvg = `<svg class="profile_layer_icon__7g3e-" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z"/></svg>`;

        const items = [
            { key: C.storageKeys.autoUnmute, svg: unmuteSvgOff, onSvg: unmuteSvgOn, label: '자동 언뮤트' },
            { key: C.storageKeys.screenSharpness, svg: sharpSvg, onSvg: sharpSvg, label: '선명한 화면 2.0' },
        ];

        items.forEach(item => {
            const itemBtn = document.createElement('button');
            itemBtn.className = 'allinone-settings-item';
            itemBtn.style.display = 'flex';
            itemBtn.style.alignItems = 'center';
            itemBtn.style.margin = '8px 0';
            itemBtn.style.padding = '4px 8px';
            itemBtn.style.fontFamily = 'Sandoll Nemony2, Apple SD Gothic NEO, Helvetica Neue, Helvetica, NanumGothic, Malgun Gothic, gulim, noto sans, Dotum, sans-serif';
            itemBtn.style.fontSize = '14px';
            itemBtn.style.color = 'inherit';
            itemBtn.innerHTML = `
            ${item.svg}
            <span style="margin-left:8px">${item.label}${item.key ? ' <span class="state-text">OFF</span>' : ''}</span>
        `;

            if (!item.key) {
                itemBtn.style.opacity = '1';
                itemBtn.addEventListener('click', item.onClick);
            } else {
                GM.getValue(item.key, false).then(active => {
                    itemBtn.style.opacity = active ? '1' : '0.4';
                    if (active) itemBtn.querySelector('svg').outerHTML = item.onSvg;
                    const stateSpan = itemBtn.querySelector('.state-text');
                    stateSpan.textContent = active ? 'ON' : 'OFF';
                });
                itemBtn.addEventListener('click', async () => {
                    const active = await GM.getValue(item.key, false);
                    const newActive = !active;
                    await GM.setValue(item.key, newActive);
                    setTimeout(() => {
                        location.reload();
                    }, 100);
                });
            }
            menu.appendChild(itemBtn);
        });

        btn.addEventListener('click', e => {
            e.stopPropagation();
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', e => {
            if (!menu.contains(e.target) && e.target !== btn) {
                menu.style.display = 'none';
            }
        });
    }

    window.addHeaderMenu = addHeaderMenu;

    unsafeWindow.toggleDebugLogs = async () => {
        const key = C.storageKeys.debugLog;
        const current = await GM.getValue(key, false);
        const next = !current;
        await GM.setValue(key, next);
        C.debug = next;
        console.log(`🛠️ Debug logs ${next ? 'ENABLED' : 'DISABLED'}`);
    };
    /**
     * @namespace quality
     * @description 비디오 화질 설정과 관련된 기능을 관리합니다.
     */
    const quality = {
        observeManualSelect() {
            document.body.addEventListener("click", async (e) => {
                const li = e.target.closest('li[class*="quality"]');
                if (!li) return;
                const raw = li.textContent;
                const res = C.extractResolution(raw);
                if (res) {
                    await GM.setValue(C.storageKeys.quality, res);
                    C.groupCollapsed("%c💾 [Quality] 수동 화질 저장됨", C.styles.success);
                    C.table([{ "선택 해상도": res, 원본: C.cleanText(raw) }]);
                    C.groupEnd();
                }
            }, { capture: true });
        },
        /**
         * 저장된 선호 화질 값을 불러옵니다.
         * @returns {Promise<number>} 선호 화질.
         */
        async getPreferred() {
            const stored = await GM.getValue(C.storageKeys.quality, 1080);
            return parseInt(stored, 10);
        },
        /**
         * 저장된 선호 화질을 비디오 플레이어에 자동으로 적용합니다.
         * 변경사항: 내부 로직을 tick 기반 자동화질 적용 방식으로 대체했습니다.
         * (최소한으로 수정된 버전 — 나머지 코드는 원본 유지)
         * @returns {Promise<void>}
         */
        async applyPreferred() {
            // 기존의 보호(재진입/쿨다운) 로직 유지
            const now = Date.now();
            if (this._applying || (this._lastApply && now - this._lastApply < C.applyCooldown)) return;
            this._applying = true;
            this._lastApply = now;

            const VIDEO_SELECTOR = "video.webplayer-internal-video";
            const QUALITY_ITEM_SELECTOR = "li.pzp-ui-setting-quality-item";
            let intervalId = null;
            let processed = false;

            function pressEnterOnElement(el) {
                if (!el) return;
                el.focus?.({ preventScroll: true });
                el.click();
                el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter", code: "Enter" }));
                el.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, key: "Enter", code: "Enter" }));
            }

            async function tick() {
                // 두 번의 requestAnimationFrame으로 UI 렌더 안정화
                await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
                const hasLive = location.pathname.includes("/live/");
                const videoEl = document.querySelector(VIDEO_SELECTOR);
                const items = [...new Set([...document.querySelectorAll(QUALITY_ITEM_SELECTOR)])];
                const preferred = await quality.getPreferred();
                const target = items.find((li) => new RegExp(`${preferred}p`).test(li.innerText)) ||
                               items.find((li) => /1080p|720p/.test(li.innerText));

                if (!target) return false;

                const isNowHighQuality = target?.classList.contains("pzp-ui-setting-pane-item--checked") ?? false;

                if (hasLive && !isNowHighQuality && !processed) {
                    pressEnterOnElement(target);
                    videoEl?.play?.().catch(() => {});
                    processed = true;
                    C.success(`[Quality] 자동 ${preferred}p 적용 시도`);
                    return;
                }

                if (isNowHighQuality && videoEl && !videoEl.paused) {
                    stopInterval();
                }
            }

            function startInterval() {
                if (intervalId !== null) return;
                intervalId = setInterval(tick, 100);
            }

            function stopInterval() {
                if (intervalId === null) return;
                clearInterval(intervalId);
                intervalId = null;
            }

            function restartInterval() {
                processed = false;
                stopInterval();
                startInterval();
                setTimeout(stopInterval, 3000);
            }

            function tryMount() {
                const videoElement = document.querySelector(VIDEO_SELECTOR);
                videoElement?.addEventListener("loadedmetadata", () => {
                    tick();
                    restartInterval();
                });
            }

            // history API에 의한 위치 변경 감지 (방송 전환 시 재시도)
            (function () {
                const fireLoc = () => setTimeout(restartInterval, 0);
                const _ps = history.pushState, _rs = history.replaceState;
                history.pushState = function () {
                    const r = _ps.apply(this, arguments);
                    fireLoc();
                    return r;
                };
                history.replaceState = function () {
                    const r = _rs.apply(this, arguments);
                    fireLoc();
                    return r;
                };
                window.addEventListener("popstate", fireLoc);
            })();

            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", tryMount, { once: true });
            } else {
                tryMount();
            }

            new MutationObserver((list) => {
                for (const m of list) {
                    for (const n of m.addedNodes) {
                        if (n.nodeType !== 1) continue;
                        if (
                            n.matches?.(VIDEO_SELECTOR) ||
                            n.querySelector?.(VIDEO_SELECTOR)
                        ) tryMount();
                    }
                }
            }).observe(document.documentElement, { childList: true, subtree: true });

            // 완료 상태 해제
            this._applying = false;
        },
    };
    /**
     * @namespace handler
     * @description 페이지의 네이티브 동작(XHR, URL 변경)을 가로채거나 감시하는 기능을 관리합니다.
     */
    const handler = {
        trackURLChange() {
            let lastUrl = location.href;
            let lastId = null;

            const getId = (url) => (typeof url === 'string' ? (url.match(C.regex.chzzkId)?.groups?.id || null) : null);
            const onUrlChange = () => {
                const currentUrl = location.href;
                if (currentUrl === lastUrl) return;

                lastUrl = currentUrl;

                const id = getId(currentUrl);
                if (!id) {
                    C.info("[URLChange] 방송 ID 없음");
                } else if (id !== lastId) {
                    lastId = id;
                    setTimeout(() => {
                        quality.applyPreferred();
                        injectSharpnessScript();
                    }, C.minTimeout);
                } else {
                    C.warn(`[URLChange] 같은 방송(${id}), 스킵`);
                }
                const svg = document.getElementById("sharpnessSVGContainer");
                const style = document.getElementById("sharpnessStyle");
                if (svg) svg.remove();
                if (style) style.remove();
                if (window.sharpness) {
                    window.sharpness.init();
                    window.sharpness.observeMenus();
                }
            };
            ["pushState", "replaceState"].forEach((method) => {
                const original = history[method];
                history[method] = function (...args) {
                    const result = original.apply(this, args);
                    window.dispatchEvent(new Event("locationchange"));
                    return result;
                };
            });
            window.addEventListener("popstate", () =>
                window.dispatchEvent(new Event("locationchange"))
            );
            window.addEventListener("locationchange", onUrlChange);
        },
    };
    /**
     * @namespace observer
     * @description MutationObserver를 사용하여 DOM 변경을 감시하고 대응하는 기능을 관리합니다.
     */
    const observer = {
        start() {
            const mo = new MutationObserver((muts) => {
                for (const mut of muts) {
                    for (const node of mut.addedNodes) {
                        if (node.nodeType !== 1) continue;
                        this.tryRemoveAdPopup();
                        let vid = null;
                        if (node.tagName === "VIDEO") {
                            vid = node;
                        } else if (node.querySelector) {
                            vid = node.querySelector("video");
                        }
                        if (/^\/live\/[^/]+/.test(location.pathname) && vid) {
                            this.unmuteAll(vid);
                            checkAndFixLowQuality(vid);
                            (async () => {
                                await new Promise((resolve) => {
                                    const waitForReady = () => {
                                        if (vid.readyState >= 4) return resolve();
                                        setTimeout(waitForReady, 100);
                                    };
                                    waitForReady();
                                });
                                try {
                                    await vid.play();
                                    C.success("%c▶️ [AutoPlay] 재생 성공", C.styles.info);
                                } catch (e) {
                                    C.error(`⚠️ [AutoPlay] 재생 실패: ${e.message}`);
                                }
                            })();
                        }
                    }
                }
            });
            mo.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ["style"],
            });
            C.info("[Observer] 통합 감시 시작");
        },
        /**
         * 비디오 플레이어의 음소거를 해제합니다.
         * @param {HTMLVideoElement} video - 음소거를 해제할 비디오 요소.
         * @returns {Promise<void>}
         */
        async unmuteAll(video) {
            const autoUnmute = await GM.getValue(C.storageKeys.autoUnmute, true);
            if (!autoUnmute) return C.info("[Unmute] 설정에 따라 스킵");
            if (video.muted) {
                video.muted = false;
                C.success("[Unmute] video.muted 해제");
            }
            const btn = document.querySelector('button.pzp-pc-volume-button[aria-label*="음소거 해제"]');
            if (btn) {
                btn.click();
                C.success("[Unmute] 버튼 클릭");
            }
        },
        /**
         * 광고 차단 안내 팝업을 감지하고 제거합니다.
         * @returns {Promise<void>}
         */
        async tryRemoveAdPopup() {
            try {
                const popups = document.querySelectorAll(`${C.selectors.popup}:not([data-popup-handled])`);

                for (const popup of popups) {
                    if (C.regex.adBlockDetect.test(popup.textContent)) {
                        popup.dataset.popupHandled = 'true';
                        popup.style.display = 'none';

                        const btn = popup.querySelector('button');

                        C.groupCollapsed("✅ 광고 차단 팝업 발견! (자세한 정보는 클릭)");
                        C.info("발견된 전체 팝업 구조", popup);

                        if (!btn) {
                            C.warn("팝업 내 버튼 요소를 찾지 못했습니다.");
                            C.groupEnd();
                            return;
                        }
                        C.info("내부에서 찾은 버튼 요소", btn);

                        const fiberKey = Object.keys(btn).find(k =>
                            k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$')
                        );

                        if (!fiberKey) {
                            C.warn("React Fiber 키를 찾지 못했습니다.");
                            C.groupEnd();
                            return;
                        }

                        C.info("사용한 React Fiber 키:", fiberKey.split('$')[1]);

                        const props = btn[fiberKey]?.memoizedProps || btn[fiberKey]?.return?.memoizedProps;
                        C.info("버튼의 React Props", props);

                        C.groupEnd();

                        let handlerName = null;
                        let handlerFunc = null;

                        if (typeof props.confirmHandler === 'function') {
                            handlerName = 'confirmHandler';
                            handlerFunc = props.confirmHandler;
                        } else if (typeof props.onClick === 'function') {
                            handlerName = 'onClick';
                            handlerFunc = props.onClick;
                        } else if (typeof props.onClickHandler === 'function') {
                            handlerName = 'onClickHandler';
                            handlerFunc = props.onClickHandler;
                        }

                        if (handlerFunc) {
                            handlerFunc({ isTrusted: true });
                            C.success(`[AdPopup] 성공: '${handlerName}' 핸들러를 사용하여 팝업을 닫았습니다.`);
                        }
                        return;
                    }
                }
            } catch (e) {
                C.error(`[AdPopup] 자동 닫기 실패: ${e.message}`);
            }
        },
    };
    /** @type {boolean} 저화질 복구 기능이 현재 동작 중인지 여부를 나타내는 플래그 */
    let isRecoveringQuality = false;
    /**
     * @async
     * @function checkAndFixLowQuality
     * @description 비디오 화질이 낮아졌을 경우 선호 화질로 복구를 시도합니다.
     * @param {HTMLVideoElement} video - 화질을 검사할 비디오 요소.
     * @returns {Promise<void>}
     */
    async function checkAndFixLowQuality(video) {
        if (!video || video.__qualityMonitorAttached) return;
        video.__qualityMonitorAttached = true;
        C.info("[QualityCheck] 화질 모니터링 시작");
        const performCheck = async () => {
            if (video.paused || isRecoveringQuality) return;
            const currentHeight = video.videoHeight;
            if (currentHeight === 0) return;
            const preferred = await quality.getPreferred();
            if (currentHeight < preferred) {
                C.warn(`[QualityCheck] 저화질(${currentHeight}p) 감지. 선호 화질(${preferred}p)로 복구 시도.`);
                isRecoveringQuality = true;
                await quality.applyPreferred();
                setTimeout(() => {
                    isRecoveringQuality = false;
                    C.info("[QualityCheck] 화질 복구 쿨다운 종료.");
                }, 120000);
            }
        };
        video.addEventListener('loadedmetadata', performCheck);
        setInterval(performCheck, 30000);
    }
    /**
     * @async
     * @function setDebugLogging
     * @description 저장된 설정에 따라 디버그 로그 출력 여부를 설정합니다.
     * @returns {Promise<void>}
     */
    async function setDebugLogging() {
        C.debug = await GM.getValue(C.storageKeys.debugLog, false);
    }
    /**
     * @async
     * @function injectSharpnessScript
     * @description '선명한 화면' 기능이 활성화된 경우, 관련 외부 스크립트를 주입합니다.
     * @returns {Promise<void>}
     */
    async function injectSharpnessScript() {
        const enabled = await GM.getValue(C.storageKeys.screenSharpness, false);
        if (!enabled) return;
        const script = document.createElement("script");
        script.src = "https://update.greasyfork.org/scripts/548009/Chzzk%20%EC%84%A0%EB%AA%85%ED%95%9C%20%ED%99%94%EB%A9%B4%20%EC%97%85%EA%B7%B8%EB%A0%88%EC%9D%B4%EB%93%9C.user.js";
        script.async = true;
        document.head.appendChild(script);
        C.success("%c[Sharpness] 외부 스크립트 삽입 완료", C.styles.info);
    }
    /**
     * @async
     * @function init
     * @description 스크립트의 주요 기능들을 초기화합니다.
     * @returns {Promise<void>}
     */
    async function init() {
        await setDebugLogging();

        if ((await GM.getValue(C.storageKeys.quality)) === undefined) {
            await GM.setValue(C.storageKeys.quality, 1080);
            C.success("[Init] 기본 화질 1080 저장");
        }
        if ((await GM.getValue(C.storageKeys.autoUnmute)) === undefined) {
            await GM.setValue(C.storageKeys.autoUnmute, true);
            C.success("[Init] 기본 언뮤트 ON 저장");
        }
        await addHeaderMenu();
        C.observeElement(C.selectors.headerMenu, () => {
            addHeaderMenu().catch(console.error);
        }, false);

        await quality.applyPreferred();
        await injectSharpnessScript();
    }
    /**
     * @function onDomReady
     * @description DOM 콘텐츠가 로드된 후 스크립트의 실행을 시작하는 진입점 함수.
     */
    function onDomReady() {
        console.log("%c🔔 [ChzzkHelper] 스크립트 시작", C.styles.info);
        quality.observeManualSelect();
        observer.start();
        init().catch(console.error);
    }

    handler.trackURLChange();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", onDomReady);
    } else {
        onDomReady();
    }

})();
