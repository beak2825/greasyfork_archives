// ==UserScript==
// @name         雀渣 CHAGA 牌谱分析
// @version      1.5.1
// @description  适用于雀渣平台的 CHAGA 牌谱分析工具
// @author       Choimoe
// @match        https://tziakcha.net/record/*
// @icon         https://tziakcha.net/favicon.ico
// @grant        unsafeWindow
// @inject-into  page
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1543716
// @downloadURL https://update.greasyfork.org/scripts/560977/%E9%9B%80%E6%B8%A3%20CHAGA%20%E7%89%8C%E8%B0%B1%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/560977/%E9%9B%80%E6%B8%A3%20CHAGA%20%E7%89%8C%E8%B0%B1%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    let tzInstance = null;
    let setReviewError = (msg) => {
        w.__review_error = msg;
        const reviewEl = document.getElementById('review');
        if (reviewEl) {
            reviewEl.innerText = msg;
        }
    };
    const clearReviewError = () => setReviewError('');
    w.setReviewError = setReviewError;
    if (typeof unsafeWindow === 'undefined') {
        console.warn('[Reviewer] unsafeWindow unavailable; running in sandbox may fail to capture');
        setReviewError('未能进入页面上下文，可能脚本被沙箱隔离');
    }
    const originalDefineProperty = Object.defineProperty;
    const originalReflectDefineProperty = Reflect.defineProperty;
    
    const wrapTZ = (OriginalTZ) => {
        const WrappedTZ = function(...args) {
            const instance = new OriginalTZ(...args);
            tzInstance = instance;
            clearReviewError();
            console.log('[Reviewer] Captured TZ instance:', instance);
            console.log('[Reviewer] Current step:', instance.stp);
            return instance;
        };
        WrappedTZ.prototype = OriginalTZ.prototype;
        Object.setPrototypeOf(WrappedTZ, OriginalTZ);
        for (let key in OriginalTZ) {
            if (OriginalTZ.hasOwnProperty(key)) {
                WrappedTZ[key] = OriginalTZ[key];
            }
        }
        return WrappedTZ;
    };

    const installDefinePropertyHook = () => {
        if (Object.defineProperty._tz_hooked) return;

        const hook = function(target, prop, descriptor) {
            if (target === w && prop === 'TZ' && descriptor && typeof descriptor.value === 'function' && !descriptor._tz_wrapped) {
                descriptor = { ...descriptor, value: wrapTZ(descriptor.value), _tz_wrapped: true };
                console.log('[Reviewer] Wrapped TZ via defineProperty hook');
            }
            return originalDefineProperty(target, prop, descriptor);
        };

        hook._tz_hooked = true;
        Object.defineProperty = hook;

        if (typeof originalReflectDefineProperty === 'function') {
            const reflectHook = function(target, prop, descriptor) {
                if (target === w && prop === 'TZ' && descriptor && typeof descriptor.value === 'function' && !descriptor._tz_wrapped) {
                    descriptor = { ...descriptor, value: wrapTZ(descriptor.value), _tz_wrapped: true };
                    console.log('[Reviewer] Wrapped TZ via Reflect.defineProperty hook');
                }
                return originalReflectDefineProperty(target, prop, descriptor);
            };
            reflectHook._tz_hooked = true;
            Reflect.defineProperty = reflectHook;
        }
    };

    const interceptTZ = () => {
        installDefinePropertyHook();
        const existing = Object.getOwnPropertyDescriptor(w, 'TZ');

        const forceCreateTZ = () => {
            try {
                if (tzInstance || typeof w.TZ !== 'function') return false;
                const sp = new URLSearchParams(w.location.search);
                const id = sp.get('id');
                const v = sp.get('v');
                const cy = sp.get('cy');
                const tz = new w.TZ();
                tzInstance = tz;
                clearReviewError();
                console.log('[Reviewer] Force-created TZ instance');
                if (typeof tz.adapt === 'function') tz.adapt();
                if (id && typeof tz.fetch === 'function') {
                    tz.fetch(id, 0, v, cy);
                }
                return true;
            } catch (e) {
                console.error('[Reviewer] Force-create TZ failed:', e);
                return false;
            }
        };

        if (!existing || existing.configurable) {
            const descriptor = {
                configurable: true,
                enumerable: true,
                get: function() {
                    return this._TZ;
                },
                set: function(value) {
                    if (typeof value === 'function' && !this._TZ_intercepted) {
                        console.log('[Reviewer] Intercepting TZ constructor');
                        this._TZ_intercepted = true;
                        this._TZ = wrapTZ(value);
                    } else {
                        this._TZ = value;
                    }
                }
            };
            try {
                originalDefineProperty(w, 'TZ', descriptor);
                console.log('[Reviewer] TZ interceptor installed (configurable path)');
                return;
            } catch (e) {
                console.error('[Reviewer] Failed to install TZ interceptor via defineProperty:', e);
            }
        }

        if (existing && existing.writable === false) {
            console.warn('[Reviewer] TZ is non-configurable and non-writable; cannot intercept');
            if (w.setReviewError) {
                w.setReviewError('TZ 属性不可拦截，无法捕获牌局');
            }
            return;
        }

        const tryPatch = () => {
            if (typeof w.TZ === 'function' && !w._TZ_intercepted_direct) {
                w._TZ_intercepted_direct = true;
                w.TZ = wrapTZ(w.TZ);
                console.log('[Reviewer] TZ interceptor installed (fallback patch)');
                return true;
            }
            return false;
        };

        if (tryPatch()) return;

        let attempts = 0;
        const timer = setInterval(() => {
            attempts += 1;
            if (tryPatch() || attempts > 200) {
                if (attempts > 200) {
                    console.warn('[Reviewer] Gave up waiting for TZ to patch');
                    if (w.setReviewError) {
                        w.setReviewError('未捕获牌局核心对象，尝试补建实例');
                    }
                    forceCreateTZ();
                }
                clearInterval(timer);
            }
        }, 50);
    };
    
    interceptTZ();
    
    const initReviewer = () => {
        if (typeof w.WIND === 'undefined' || typeof w.TILE === 'undefined') {
            console.log('[Reviewer] Waiting for game constants...');
            setTimeout(initReviewer, 100);
            return;
        }
        
        const WIND = w.WIND;
        const TILE = w.TILE;

        const style = document.createElement('style');
        style.textContent = `
            .highlight-first-tile {
                box-shadow: 0 0 0 3px red, inset 0 0 0 3px red !important;
            }
            .tile-weight-bar {
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                width: 10px;
                height: 0;
                max-height: 50px;
                background: #ff4444;
                transition: height 0.3s ease;
                z-index: 10;
                pointer-events: none;
            }
            .review-container {
                position: relative;
                min-height: 128px;
            }
            .review-bg-image {
                position: absolute;
                top: 0;
                right: 0;
                width: 128px;
                height: 128px;
                opacity: 0.50;
                z-index: 0;
                pointer-events: none;
            }
            #review {
                position: relative;
                z-index: 1;
                padding-right: 10px;
            }
        `;
        document.head.appendChild(style);
        
        console.log('[Reviewer] Initializing reviewer...');
        
        const bz2tc = (s) => {
            const type = s[0];
            const num = parseInt(s.slice(1)) - 1;
            if (type === "W") return num + 0;
            else if (type === "T") return num + 9;
            else if (type === "B") return num + 18;
            else if (type === "F") return num + 27;
            else if (type === "J") return num + 31;
            else if (type === "H") return num + 34;
            else {
                console.log("Unknown tile:", s);
                return -1;
            }
        };
 
        const act2str = (act) => {
            act = act.trim();
            if (act.startsWith("Chi")) {
                const components = act.split(/\s+/);
                const tile = tc2tile(bz2tc(components.at(-1)));
                const chi = `${+tile[0] - 1}${tile[0]}${+tile[0] + 1}${tile[1]}`;
                return [...components.slice(0, -1), chi].join(" ");
            } else if ("1" <= act.at(-1) && act.at(-1) <= "9") {
                const components = act.split(/\s+/);
                return [
                    ...components.slice(0, -1),
                    tc2tile(bz2tc(components.at(-1))),
                ].join(" ");
            } else return act;
        };
 
        const tc2tile = (i) => TILE[i * 4];
        
        const fmtLoad = (i) => {
            switch (i) {
                case 0: return "✗";
                case 1: return "·";
                case 2: return "✓";
                default: return "_";
            }
        };
 
        const parseRound = (roundStr) => {
            roundStr = roundStr.trim();
            
            if (/^\d/.test(roundStr)) {
                const num = parseInt(roundStr);
                return num - 1;
            }
            
            if (WIND.some(w => roundStr.startsWith(w + " "))) {
                const wind = WIND.find(w => roundStr.startsWith(w + " "));
                const num = parseInt(roundStr.slice(wind.length).trim()) - 1;
                return WIND.findIndex((x) => x === wind) * 4 + num;
            }
            
            if (roundStr.length === 3 && roundStr[1] === "风") {
                return WIND.findIndex((x) => x === roundStr[0]) * 4 +
                       WIND.findIndex((x) => x === roundStr[2]);
            }
            
            console.warn("Unknown round format:", roundStr);
            return WIND.findIndex((x) => x === roundStr[0]) * 4 +
                   WIND.findIndex((x) => x === roundStr[2]);
        };
 
        w.__reviews = {};
        w.__reviews_filled = {};
        w.__reviews_seats = [undefined, undefined, undefined, undefined];
        w.__review_error = '';
        let highlightFirstTile = true;
        let showWeightBars = true;
        let hideUserInfo = false;
        
        const getPlayerStep = () => {
            if (tzInstance && typeof tzInstance.stp === 'number') {
                return tzInstance.stp - 18;
            }
            return -18;
        };
 
        const softmax = (weights) => {
            const maxWeight = Math.max(...weights);
            const expWeights = weights.map(w => Math.exp(w - maxWeight));
            const sumExp = expWeights.reduce((a, b) => a + b, 0);
            return expWeights.map(w => w / sumExp);
        };

        const toggleUserInfo = (hide) => {
            const nameElements = document.querySelectorAll('.name');
            const eloElements = document.querySelectorAll('.elo');
            
            if (hide) {
                nameElements.forEach((el, index) => {
                    const currentText = el.textContent.trim();
                    if (!currentText.match(/^用户\d+$/)) {
                        el.dataset.originalName = currentText;
                    }
                    el.textContent = `用户${index + 1}`;
                });
                
                eloElements.forEach((el) => {
                    const eloValSpan = el.querySelector('.elo-val');
                    if (eloValSpan) {
                        el.dataset.originalElo = eloValSpan.textContent;
                    }
                    el.style.display = 'none';
                });
            } else {
                nameElements.forEach((el) => {
                    const currentText = el.textContent.trim();
                    if (currentText.match(/^用户\d+$/) && el.dataset.originalName) {
                        el.textContent = el.dataset.originalName;
                    }
                    delete el.dataset.originalName;
                });
                
                eloElements.forEach((el) => {
                    el.style.display = '';
                    const eloValSpan = el.querySelector('.elo-val');
                    if (eloValSpan && el.dataset.originalElo) {
                        eloValSpan.textContent = el.dataset.originalElo;
                    }
                    delete el.dataset.originalElo;
                });
            }
        };
 
        const clearWeightBars = () => {
            document.querySelectorAll('.tile-weight-bar').forEach(el => el.remove());
        };
 
        const showWeightVisualization = (candidates, playerIndex) => {
            if (playerIndex !== 0 || !showWeightBars) return;
            const handContainers = document.querySelectorAll('.hand');
            if (handContainers.length === 0) return;
            const currentHand = handContainers[0];
            const tiles = Array.from(currentHand.querySelectorAll('.tl'));
            const tileWeightMap = new Map();
            const weights = candidates.map(([w, _]) => w);
            const probs = softmax(weights);
            candidates.forEach(([weight, act], idx) => {
                const actStr = act.trim();
                if (!actStr.startsWith('Play ')) return;
                const tileCode = actStr.slice(5);
                const tileIndex = bz2tc(tileCode);
                if (tileIndex >= 0 && tileIndex < 136) {
                    if (!tileWeightMap.has(tileIndex)) {
                        tileWeightMap.set(tileIndex, probs[idx]);
                    }
                }
            });
            tiles.forEach(tileEl => {
                const tileVal = parseInt(tileEl.dataset.val);
                const tileIndex = Math.floor(tileVal / 4);
                const prob = tileWeightMap.get(tileIndex);
                if (prob !== undefined) {
                    const computedStyle = window.getComputedStyle(tileEl);
                    const currentPosition = computedStyle.position;
                    if (currentPosition === 'static') {
                        tileEl.style.position = 'relative';
                    }
                    const bar = document.createElement('div');
                    bar.className = 'tile-weight-bar';
                    bar.style.height = `${prob * 50}px`;
                    tileEl.appendChild(bar);
                }
            });
        };
 
        let lastStp = null;

        const show_cands = () => {
            const roundEl = document.getElementById("round");
            const reviewLogEl = document.getElementById("review-log");
            const reviewEl = document.getElementById("review");
            
            if (!roundEl || !reviewLogEl || !reviewEl) return;
            
            const roundStr = roundEl.innerHTML;
            const round = parseRound(roundStr);
            const ri = getPlayerStep();
            lastStp = tzInstance?.stp ?? lastStp;
            
            reviewLogEl.innerHTML = `CHAGA Reviewer [Step ${ri}] [Load ${w.__reviews_seats.map(fmtLoad).join(" ")}]`;
            if (w.__review_error) {
                reviewEl.innerText = w.__review_error;
                clearWeightBars();
                document.querySelectorAll('.tl.highlight-first-tile').forEach(el => {
                    el.classList.remove('highlight-first-tile');
                });
                return;
            }

            if (tzInstance && w.__review_error) {
                clearReviewError();
            }
            
            const key = `${round}-${ri}`;
            const resp = w.__reviews_filled[key] || w.__reviews[key];
            document.querySelectorAll('.tl.highlight-first-tile').forEach(el => {
                el.classList.remove('highlight-first-tile');
            });
            clearWeightBars();
            if (resp?.extra?.candidates?.length) {
                reviewEl.innerHTML = resp.extra.candidates
                    .map(([weight, act]) =>
                        `${act2str(act)}&nbsp;&nbsp;-&nbsp;&nbsp;${weight.toFixed(2)}`
                    )
                    .join("<br>");
                const hasPlay = resp.extra.candidates.some(([_, act]) => 
                    act.trim().startsWith("Play ")
                );
                if (hasPlay && tzInstance) {
                    const currentStat = tzInstance.stat?.[tzInstance.stp];
                    const playerIndex = currentStat?.k ?? 0;
                    showWeightVisualization(resp.extra.candidates, playerIndex);
                }
                if (hasPlay && highlightFirstTile && tzInstance) {
                    const firstCand = resp.extra.candidates[0];
                    if (firstCand && firstCand[1]) {
                        const act = firstCand[1].trim();
                        const tileCode = act.slice(5);
                        const tileIndex = bz2tc(tileCode);
                        if (tileIndex >= 0 && tileIndex < 136 && tzInstance.stat && tzInstance.stat[tzInstance.stp]) {
                            const currentStat = tzInstance.stat[tzInstance.stp];
                            let playerIndex = currentStat.k;
                            if (typeof playerIndex === 'undefined') {
                                playerIndex = 0;
                            }
                            const handContainers = document.querySelectorAll('.hand');
                            if (handContainers.length > playerIndex) {
                                const targetHand = handContainers[playerIndex];
                                const tiles = targetHand.querySelectorAll('.tl');
                                let highlighted = false;
                                tiles.forEach(tileEl => {
                                    if (!highlighted) {
                                        const tileVal = parseInt(tileEl.dataset.val);
                                        if (Math.floor(tileVal / 4) === tileIndex) {
                                            tileEl.classList.add('highlight-first-tile');
                                            console.log(`[Reviewer] Highlighted tile DOM for player ${playerIndex}: ${tileCode}`);
                                            highlighted = true;
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
            else {
                reviewEl.innerText = '';
            }
        };

        const startStepWatcher = () => {
            const poll = () => {
                const stp = tzInstance?.stp;
                if (typeof stp === 'number' && stp !== lastStp) {
                    lastStp = stp;
                    show_cands();
                }
            };
            setInterval(poll, 200);
        };
 
        const createUI = () => {
            const ctrl = document.getElementById("ctrl");
            if (!ctrl) {
                setTimeout(createUI, 100);
                return;
            }
            const ctrlRtDiv = document.createElement("div");
            ctrlRtDiv.classList.add("ctrl-rt", "fs-sm");
            const checkboxDiv = document.createElement("div");
            checkboxDiv.classList.add("ctrl-e", "no-sel");
            const checkboxLabel = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = "cb-highlight-first-tile";
            checkbox.checked = highlightFirstTile;
            checkbox.onchange = function(e) {
                highlightFirstTile = e.target.checked;
                show_cands();
            };
            const labelText = document.createElement("span");
            labelText.classList.add("ml-02em");
            labelText.innerText = "高亮首选牌";
            checkboxLabel.appendChild(checkbox);
            checkboxLabel.appendChild(labelText);
            checkboxDiv.appendChild(checkboxLabel);
            ctrlRtDiv.appendChild(checkboxDiv);
            const weightCheckboxDiv = document.createElement("div");
            weightCheckboxDiv.classList.add("ctrl-e", "no-sel");
            const weightCheckboxLabel = document.createElement("label");
            const weightCheckbox = document.createElement("input");
            weightCheckbox.type = "checkbox";
            weightCheckbox.id = "cb-show-weight-bars";
            weightCheckbox.checked = showWeightBars;
            weightCheckbox.onchange = function(e) {
                showWeightBars = e.target.checked;
                show_cands();
            };
            const weightLabelText = document.createElement("span");
            weightLabelText.classList.add("ml-02em");
            weightLabelText.innerText = "显示权重条";
            weightCheckboxLabel.appendChild(weightCheckbox);
            weightCheckboxLabel.appendChild(weightLabelText);
            weightCheckboxDiv.appendChild(weightCheckboxLabel);
            ctrlRtDiv.appendChild(weightCheckboxDiv);
            
            const hideInfoCheckboxDiv = document.createElement("div");
            hideInfoCheckboxDiv.classList.add("ctrl-e", "no-sel");
            const hideInfoCheckboxLabel = document.createElement("label");
            const hideInfoCheckbox = document.createElement("input");
            hideInfoCheckbox.type = "checkbox";
            hideInfoCheckbox.id = "cb-hide-user-info";
            hideInfoCheckbox.checked = hideUserInfo;
            hideInfoCheckbox.onchange = function(e) {
                hideUserInfo = e.target.checked;
                toggleUserInfo(hideUserInfo);
            };
            const hideInfoLabelText = document.createElement("span");
            hideInfoLabelText.classList.add("ml-02em");
            hideInfoLabelText.innerText = "隐藏用户信息";
            hideInfoCheckboxLabel.appendChild(hideInfoCheckbox);
            hideInfoCheckboxLabel.appendChild(hideInfoLabelText);
            hideInfoCheckboxDiv.appendChild(hideInfoCheckboxLabel);
            ctrlRtDiv.appendChild(hideInfoCheckboxDiv);
            
            const logDiv = document.createElement("div");
            logDiv.classList.add("fs-sm");
            const logSpan = document.createElement("span");
            logSpan.id = "review-log";
            logDiv.appendChild(logSpan);
            ctrlRtDiv.appendChild(logDiv);
            const reviewDiv = document.createElement("div");
            reviewDiv.classList.add("fs-sm", "review-container");
            
            const bgImage = document.createElement("img");
            bgImage.className = "review-bg-image";
            bgImage.src = "https://cdn.jsdelivr.net/gh/Choimoe/chaga-reviewer-script/doc/img/icon.png";
            bgImage.onerror = function() {
                console.log('[Reviewer] Failed to load image from jsdelivr, fallback to loli.net');
                this.onerror = null;
                this.src = "https://s2.loli.net/2026/01/12/JV3yI89rnRzO1E4.png";
            };
            reviewDiv.appendChild(bgImage);
            
            const reviewSpan = document.createElement("span");
            reviewSpan.id = "review";
            reviewDiv.appendChild(reviewSpan);
            ctrlRtDiv.appendChild(reviewDiv);
            ctrl.appendChild(ctrlRtDiv);
            
            console.log('[Reviewer] UI elements created');
            
            const hookViewChange = () => {
                const viewSelect = document.getElementById('view');
                if (viewSelect) {
                    const originalOnChange = viewSelect.onchange;
                    viewSelect.onchange = function(e) {
                        if (hideUserInfo) {
                            const hideInfoCheckbox = document.getElementById('cb-hide-user-info');
                            hideInfoCheckbox.checked = false;
                            hideUserInfo = false;
                            toggleUserInfo(false);
                            
                            const nameElements = document.querySelectorAll('.name');
                            nameElements.forEach(el => {
                                delete el.dataset.originalName;
                            });
                        }
                        if (originalOnChange) {
                            return originalOnChange.call(this, e);
                        }
                    };
                    console.log('[Reviewer] View change hook installed');
                }
            };
            
            const hookButtons = () => {
                const buttons = ['nextstp', 'prevstp', 'ffstp', 'frstp', 'next', 'prev'];
                buttons.forEach(id => {
                    const btn = document.getElementById(id);
                    if (!btn) return;
                    if (btn.onclick) {
                        const original = btn.onclick;
                        btn.onclick = function(e) {
                            if ((id === 'next' || id === 'prev') && hideUserInfo) {
                                const hideInfoCheckbox = document.getElementById('cb-hide-user-info');
                                hideInfoCheckbox.checked = false;
                                hideUserInfo = false;
                                toggleUserInfo(false);
                                
                                const nameElements = document.querySelectorAll('.name');
                                nameElements.forEach(el => {
                                    delete el.dataset.originalName;
                                });
                            }
                            const result = original.call(this, e);
                            setTimeout(show_cands, 50);
                            return result;
                        };
                    }
                    btn.addEventListener('click', () => {
                        if ((id === 'next' || id === 'prev') && hideUserInfo) {
                            const hideInfoCheckbox = document.getElementById('cb-hide-user-info');
                            hideInfoCheckbox.checked = false;
                            hideUserInfo = false;
                            toggleUserInfo(false);
                            
                            const nameElements = document.querySelectorAll('.name');
                            nameElements.forEach(el => {
                                delete el.dataset.originalName;
                            });
                        }
                        setTimeout(show_cands, 50);
                    }, { passive: true });
                });
                
                console.log('[Reviewer] Button hooks installed');
            };
            
            setTimeout(hookViewChange, 500);
            setTimeout(hookButtons, 500);
            startStepWatcher();
        };
 
        const loadReviewData = () => {
            const tiEl = document.getElementById("ti");
            if (!tiEl || !tiEl.children[0]) {
                setTimeout(loadReviewData, 100);
                return;
            }
            setReviewError('');
            const gameId = tiEl.children[0].href.split("=").at(-1);
            const roundEl = document.getElementById("round");
            if (!roundEl) {
                setTimeout(loadReviewData, 100);
                return;
            }
            const roundStr = roundEl.innerHTML;
            const round = parseRound(roundStr);
            console.log('[Reviewer] Loading review data for game:', gameId, 'round:', round);
            let loadedCount = 0;
            
            for (let is = 0; is <= 3; is++) {
                if (w.__reviews_seats[is]) continue;
                w.__reviews_seats[is] = 1;
                
                fetch(`https://tc-api.pesiu.org/review/?id=${gameId}&seat=${is}`)
                    .then((r) => r.json())
                    .then((r) => {
                        if (r.code) {
                            w.__reviews_seats[is] = 0;
                            console.error(`[Reviewer] Error fetching review data for seat ${is}:`, r.message);
                            setReviewError(`评测接口错误：seat ${is} - ${r.message || '未知错误'}`);
                            return;
                        }
                        (Array.isArray(r) ? r : r.data).forEach((d) => {
                            if (d.ri) w.__reviews[`${d.rr}-${d.ri}`] = d;
                        });
                        w.__reviews_seats[is] = 2;
                        console.log(`[Reviewer] Download finish for seat ${is}`);
                        loadedCount++;
                        if (loadedCount === 4) {
                            fillEmptyValues();
                            show_cands();
                        } else {
                            show_cands();
                        }
                    })
                    .catch((e) => {
                        w.__reviews_seats[is] = 0;
                        console.error(`[Reviewer] Download failed for seat ${is}:`, e);
                        setReviewError(`评测接口连接失败：seat ${is}`);
                    });
            }
            
            show_cands();
        };
        
        const fillEmptyValues = () => {
            for (const key in w.__reviews) {
                w.__reviews_filled[key] = w.__reviews[key];
            }
            const byRound = {};
            for (const key in w.__reviews) {
                const [rr, ri] = key.split('-').map(Number);
                if (!byRound[rr]) {
                    byRound[rr] = {};
                }
                byRound[rr][ri] = w.__reviews[key];
            }
            for (const round in byRound) {
                const steps = byRound[round];
                const riValues = Object.keys(steps).map(Number).sort((a, b) => a - b);
                const maxRi = Math.max(...riValues);
                let lastValue = null;
                for (let ri = Math.min(...riValues); ri <= maxRi; ri++) {
                    if (steps[ri]) {
                        lastValue = steps[ri];
                    } else if (lastValue) {
                        w.__reviews_filled[`${round}-${ri}`] = lastValue;
                        lastValue = null;
                    }
                }
            }
            
            console.log('[Reviewer] Empty values filled');
        };
 
        createUI();
        loadReviewData();

        setTimeout(() => {
            if (!tzInstance) {
                setReviewError('未捕获牌局实例，尝试补建实例');
                if (!tzInstance) {
                    const ok = (typeof w.TZ === 'function') && (() => {
                        try {
                            const sp = new URLSearchParams(w.location.search);
                            const id = sp.get('id');
                            const v = sp.get('v');
                            const cy = sp.get('cy');
                            const tz = new w.TZ();
                            tzInstance = tz;
                            clearReviewError();
                            console.log('[Reviewer] Late force-created TZ instance');
                            if (typeof tz.adapt === 'function') tz.adapt();
                            if (id && typeof tz.fetch === 'function') {
                                tz.fetch(id, 0, v, cy);
                            }
                            return true;
                        } catch (e) {
                            console.error('[Reviewer] Late force-create TZ failed:', e);
                            return false;
                        }
                    })();
                    if (!ok) {
                        setReviewError('未捕获牌局实例，可能浏览器或脚本管理器限制了注入');
                    }
                }
            }
        }, 1000);
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initReviewer, 500);
        });
    } else {
        setTimeout(initReviewer, 500);
    }
})();