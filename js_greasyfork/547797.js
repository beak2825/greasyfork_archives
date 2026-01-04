// ==UserScript==
// @name         Mobile Video Controller (Media Card & Persistent Menu)
// @namespace    https://your.namespace
// @version      21.0.0-media-card
// @description  User-friendly "Card" UI, persistent skip menu, and battery optimized.
// @match        *://*.youtube.com/*
// @match        *://*.facebook.com/*
// @match        *://*.bongobd.com/*
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547797/Mobile%20Video%20Controller%20%28Media%20Card%20%20Persistent%20Menu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547797/Mobile%20Video%20Controller%20%28Media%20Card%20%20Persistent%20Menu%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class MobileVideoController {
        static CONFIG = {
            MIN_VIDEO_AREA: 150 * 150,
            EDGE: 10, // More space from edge for easier access
            DEFAULT_RIGHT_OFFSET: 50,
            UI_FADE_TIMEOUT: 3500, // Slightly longer for better usability
            UI_FADE_OPACITY: 0.15,
            LONG_PRESS_DURATION_MS: 300,
            DRAG_THRESHOLD: 10,
            SLIDER_SENSITIVITY: 0.003,
            SLIDER_POWER: 1.2,
            DEFAULT_SPEEDS: [0, 1, 1.25, 1.5, 1.75, 2],
            DEFAULT_SKIP_DURATIONS: [5, 10, 15, 30, 60],
            DEFAULT_SNAP_POINTS: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25],
            SNAP_THRESHOLD: 0.05,
            SNAP_STRENGTH: 1,
            LONG_PRESS_VIBRATE_MS: 15,
            INITIAL_EVAL_DELAY: 500,
            BACKDROP_POINTER_EVENTS_DELAY: 150,
            SPEED_TOAST_FADE_DELAY: 750,
            // ECO SETTINGS
            MUTATION_DEBOUNCE_MS: 800,
            INTERSECTION_THROTTLE_MS: 300,
            TIMEUPDATE_THROTTLE_MS: 2000,
            SCROLL_END_TIMEOUT: 150,
            STORAGE_DEBOUNCE_MS: 2000
        };

        static SITE_CONFIGS = {
            'm.youtube.com': { useDefaultPositioning: false, parentSelector: '#player', observerRootSelector: '#page-manager' },
            'www.youtube.com': { useDefaultPositioning: false, parentSelector: '#movie_player', observerRootSelector: 'ytd-page-manager' },
            'bongobd.com': { attachToParent: true },
            'www.bongobd.com': { attachToParent: true }
        };

        constructor() {
            this.activeVideo = null;
            this.visibleVideos = new Map();
            this.audioContexts = new WeakMap();

            // State
            this.isManuallyPositioned = false;
            this.wasDragging = false;
            this.isTicking = false;
            this.isTickingDrag = false;
            this.isTickingSlider = false;
            this.isSpeedSliding = false;
            this.isScrolling = false;
            this.boosterEnabled = false;
            this.lastRealUserEvent = 0;

            this.ui = {
                wrap: null, panel: null, backdrop: null, toast: null, speedToast: null,
                rewindBtn: null, speedBtn: null, forwardBtn: null, settingsBtn: null,
                speedMenu: null, skipMenu: null, settingsMenu: null, muteBtn: null
            };

            this.timers = {};
            this.dragData = { isDragging: false };
            this.sliderData = { isSliding: false };
            this.abLoop = { a: null, b: null, active: false };
            this.lastVolume = 100;

            this.timeUpdateHandler = this.handleTimeUpdate.bind(this);
            this.boundScrollHandler = this.onViewportChange.bind(this);
            this.debouncedEvaluate = this.debounce(this.evaluateActive.bind(this), MobileVideoController.CONFIG.MUTATION_DEBOUNCE_MS);

            this.loadSettings();

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.safeInit(), { once: true });
            } else {
                this.safeInit();
            }
        }

        debounce(func, wait) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }

        safeInit() {
            if (!document.body) {
                setTimeout(() => this.safeInit(), 50);
                return;
            }
            this.init();
        }

        init() {
            this.injectStyles();
            this.createMainUI();
            this.attachEventListeners();
            this.setupObservers();
            this.setupVideoPositionObserver();
            setTimeout(() => this.evaluateActive(), MobileVideoController.CONFIG.INITIAL_EVAL_DELAY);
        }

        loadSettings() {
            const getStored = (k, d) => {
                try {
                    const v = localStorage.getItem(k);
                    return v === null ? d : JSON.parse(v);
                } catch (e) { return d; }
            };
            this.settings = {
                skipSeconds: getStored('mvc_skip_seconds', 10),
                selfCorrect: getStored('mvc_self_correct', false),
                autoplayMode: getStored('mvc_autoplayMode', 'off'),
                defaultSpeed: getStored('mvc_default_speed', 1.0),
                volume: getStored('mvc_volume', 100),
                transform: getStored('mvc_transform', { ratio: 'fit', zoom: 1, rotation: 0 }),
                filters: getStored('mvc_filters', {}),
            };
            this.lastVolume = this.settings.volume > 0 ? this.settings.volume : 100;
        }

        saveSetting(key, val) {
            this.settings[key] = val;
            clearTimeout(this.timers[`save_${key}`]);
            this.timers[`save_${key}`] = setTimeout(() => {
                try { localStorage.setItem(`mvc_${key}`, JSON.stringify(val)); } catch (e) {}
            }, MobileVideoController.CONFIG.STORAGE_DEBOUNCE_MS);
        }

        createEl(tag, className, props = {}) {
            const el = document.createElement(tag);
            if (className) el.className = className;
            Object.assign(el, props);
            if (props.style) Object.assign(el.style, props.style);
            return el;
        }

        createSvgIcon(pathData) {
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.setAttribute("width", "20"); // Slightly larger icons
            svg.setAttribute("height", "20");
            svg.setAttribute("fill", "currentColor");
            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("d", pathData);
            svg.appendChild(path);
            return svg;
        }

        getIcon(name) {
            const paths = {
                rewind: "M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z",
                forward: "M4 18l8.5-6L4 6v12zm9-12v12l8.5-6-8.5-6z",
                settings: "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61-.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12-.64l2 3.46c.12.22.39.3.61.22l2.49 1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59-1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"
            };
            return this.createSvgIcon(paths[name] || "");
        }

        createMainUI() {
            this.ui.wrap = this.createEl('div', 'mvc-ui-wrap');
            this.ui.panel = this.createEl('div', 'mvc-panel');
            this.ui.backdrop = this.createEl('div', 'mvc-backdrop');
            this.ui.toast = this.createEl('div', 'mvc-toast');
            this.ui.speedToast = this.createEl('div', 'mvc-speed-toast');

            this.ui.wrap.style.zIndex = '2147483647';
            document.body.append(this.ui.backdrop, this.ui.toast, this.ui.speedToast);

            const makeBtn = (content, title, extraClass) => {
                const btn = this.createEl('button', `mvc-btn ${extraClass}`);
                if (content instanceof Element) btn.appendChild(content);
                else btn.textContent = content;
                btn.title = title;
                ['touchstart', 'touchend'].forEach(ev => btn.addEventListener(ev, e => e.stopPropagation(), { passive: true }));
                btn.addEventListener('click', e => e.stopPropagation());
                btn.addEventListener('pointerdown', () => this.showUI(true));
                return btn;
            };

            // New UI: Buttons have backgrounds, so they look like distinct "keys"
            this.ui.rewindBtn = makeBtn(this.getIcon('rewind'), 'Rewind', 'mvc-btn-rewind');
            this.ui.speedBtn = makeBtn('1.0', 'Playback speed', 'mvc-btn-speed');
            this.ui.forwardBtn = makeBtn(this.getIcon('forward'), 'Forward', 'mvc-btn-forward');
            this.ui.settingsBtn = makeBtn(this.getIcon('settings'), 'Settings', 'mvc-btn-settings');

            this.ui.panel.append(this.ui.rewindBtn, this.ui.speedBtn, this.ui.forwardBtn, this.ui.settingsBtn);
            this.ui.wrap.append(this.ui.panel);

            document.body.appendChild(this.ui.wrap);
            this.ui.wrap.style.visibility = 'hidden';
            this.ui.wrap.style.display = 'block';
            const r = this.ui.wrap.getBoundingClientRect();
            this.ui.width = r.width;
            this.ui.height = r.height;
            this.ui.wrap.style.visibility = '';
            this.ui.wrap.style.display = 'none';
            document.body.removeChild(this.ui.wrap);
        }

        // [PERSISTENT MENU LOGIC]
        ensureSkipMenu() {
            if (this.ui.skipMenu) return;

            this.ui.skipMenu = this.createEl('div', 'mvc-menu');
            // Allow menu to wrap if needed, though horizontal is default
            // Fix: Use 'nowrap' and remove 'maxWidth' to force a single line
Object.assign(this.ui.skipMenu.style, { flexDirection: 'row', gap: '1px', padding: '1px', flexWrap: 'nowrap', maxWidth: 'none', justifyContent: 'center' });

            MobileVideoController.CONFIG.DEFAULT_SKIP_DURATIONS.forEach(duration => {
                const opt = this.createEl('button', 'mvc-skip-btn', { textContent: `${duration}s` });

                // IMPORTANT: Interaction logic changed here
                opt.onclick = (e) => {
                    e.stopPropagation(); // Stop bubbling
                    if (this.activeVideo && this.longPressDirection) {
                        this.activeVideo.currentTime = this.clampTime(this.activeVideo.currentTime + this.longPressDirection * duration);
                        // [CHANGE] We do NOT call hideAllMenus() here.
                        // The menu stays open for repeated clicks.
                        this.showUI(true); // Keep the UI awake

                        // Visual feedback
                        opt.style.transform = "scale(0.9)";
                        setTimeout(()=> opt.style.transform = "scale(1)", 100);
                        this.showToast(`Skipped ${duration}s`);
                    }
                };
                this.ui.skipMenu.appendChild(opt);
            });
            document.body.appendChild(this.ui.skipMenu);
        }

        // ... [Standard Lazy Loaders] ...
        ensureSpeedMenu() {
            if (this.ui.speedMenu) return;

            this.ui.speedMenu = this.createEl('div', 'mvc-menu mvc-speed-list');
            const makeOpt = (sp) => {
                const opt = this.createEl('div', 'mvc-menu-opt');
                opt.textContent = sp === 0 ? 'Pause' : `${sp.toFixed(2)}x`;
                opt.dataset.sp = String(sp);
                opt.style.color = sp === 0 ? '#89cff0' : 'white';
                opt.style.fontWeight = sp === 0 ? '600' : 'normal';
                opt.onclick = () => {
                    if (!this.activeVideo) return this.hideAllMenus();
                    const spv = Number(opt.dataset.sp);
                    if (spv === 0) this.handlePlayPauseClick();
                    else {
                        this.activeVideo.playbackRate = spv;
                        this.saveSetting('last_rate', String(spv));
                        if (this.activeVideo.paused) this.activeVideo.play();
                    }
                    this.updateSpeedDisplay();
                    this.hideAllMenus();
                };
                return opt;
            };
            MobileVideoController.CONFIG.DEFAULT_SPEEDS.forEach(sp => this.ui.speedMenu.appendChild(makeOpt(sp)));

            const customOpt = this.createEl('div', 'mvc-menu-opt', { textContent: '✎', style: { color: '#c5a5ff', fontWeight: '600' } });
            customOpt.onclick = () => {
                if (!this.activeVideo) return this.hideAllMenus();
                const choice = prompt("Enter custom playback speed:", this.activeVideo.playbackRate.toFixed(2));
                this.hideAllMenus();
                if (choice === null) return;
                const newRate = parseFloat(choice);
                if (!isNaN(newRate) && newRate > 0 && newRate <= 16) {
                    this.activeVideo.playbackRate = newRate;
                    this.saveSetting('last_rate', String(newRate));
                    if (this.activeVideo.paused) this.activeVideo.play();
                    this.updateSpeedDisplay();
                } else this.showToast("Invalid speed entered.");
            };
            this.ui.speedMenu.appendChild(customOpt);
            document.body.appendChild(this.ui.speedMenu);
        }

        ensureSettingsMenu() {
            if (this.ui.settingsMenu) return;

            this.ui.settingsMenu = this.createEl('div', 'mvc-menu', { style: { minWidth: '280px' } });
           // [NEW] Close Controller Button
            const closeRow = this.createEl('div', 'mvc-menu-opt mvc-settings-row', {
                style: { justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '8px', paddingTop: '8px' }
            });
            const closeBtn = this.createEl('button', 'mvc-settings-btn', {
                textContent: 'Close Controller',
                style: { background: 'rgba(255, 59, 48, 0.2)', color: '#ff3b30', width: '100%' }
            });
            closeBtn.onclick = () => {
                this.hideAllMenus();
                this.ui.wrap.style.display = 'none'; // Instantly hide the controller
            };
            closeRow.appendChild(closeBtn);
            this.ui.settingsMenu.appendChild(closeRow);
            const addSection = (t) => {
                const el = this.createEl('div', 'mvc-settings-section-title', { textContent: t });
                this.ui.settingsMenu.appendChild(el);
            };
            const createSliderRow = (label, props, fmt) => {
                const row = this.createEl('div', 'mvc-menu-opt mvc-settings-row');
                const labelEl = this.createEl('label', 'mvc-settings-label', { textContent: label });
                const slider = this.createEl('input', 'mvc-settings-slider', Object.assign({ type: 'range' }, props));
                const valueEl = this.createEl('span', 'mvc-settings-value', { textContent: fmt(props.value) });
                slider.oninput = (e) => {
                    valueEl.textContent = fmt(e.target.value);
                    if (props.oninput) props.oninput(e.target.value);
                };
                slider.onchange = (e) => { if (props.onchange) props.onchange(e.target.value); };
                row.append(labelEl, slider, valueEl);
                return { row, slider, valueEl };
            };

            addSection('A-B Loop');
            const abContainer = this.createEl('div', 'mvc-menu-opt mvc-settings-row');
            const setA = this.createEl('button', 'mvc-settings-btn', { textContent: 'Set A' });
            const setB = this.createEl('button', 'mvc-settings-btn', { textContent: 'Set B' });
            const toggleLoop = this.createEl('button', 'mvc-settings-btn', { textContent: 'Loop: Off' });
            setA.onclick = () => { if (this.activeVideo) { this.abLoop.a = this.activeVideo.currentTime; setA.textContent = `A: ${this.formatTime(this.abLoop.a)}`; } };
            setB.onclick = () => { if (this.activeVideo) { this.abLoop.b = this.activeVideo.currentTime; setB.textContent = `B: ${this.formatTime(this.abLoop.b)}`; } };
            toggleLoop.onclick = () => {
                this.abLoop.active = !this.abLoop.active;
                toggleLoop.textContent = `Loop: ${this.abLoop.active ? 'On' : 'Off'}`;
                toggleLoop.style.backgroundColor = this.abLoop.active ? 'rgba(50,180,100,0.7)' : '';
                this.toggleTimeUpdateListener(this.settings.selfCorrect);
            };
            abContainer.append(setA, setB, toggleLoop);
            this.ui.settingsMenu.appendChild(abContainer);

            addSection('Transform');
            const transformRow = this.createEl('div', 'mvc-menu-opt mvc-settings-row');
            const ratioSelect = this.createEl('select', 'mvc-settings-select');
            ['Fit', 'Fill', 'Stretch'].forEach(r => ratioSelect.add(new Option(r, r.toLowerCase())));
            ratioSelect.value = this.settings.transform.ratio;
            ratioSelect.onchange = () => { this.settings.transform.ratio = ratioSelect.value; this.saveSetting('transform', this.settings.transform); this.applyVideoTransform(); };
            const rotateBtn = this.createEl('button', 'mvc-settings-btn', { textContent: 'Rotate ↻' });
            rotateBtn.onclick = () => { this.settings.transform.rotation = (this.settings.transform.rotation + 90) % 360; this.saveSetting('transform', this.settings.transform); this.applyVideoTransform(); };
            const transformResetBtn = this.createEl('button', 'mvc-settings-btn', { textContent: 'Reset' });
            const zoomControl = createSliderRow('Zoom:', {
                min: 0.5, max: 3, step: 0.05, value: this.settings.transform.zoom,
                oninput: (v) => { this.settings.transform.zoom = parseFloat(v); this.applyVideoTransform(); },
                onchange: () => this.saveSetting('transform', this.settings.transform)
            }, v => `${Math.round(v * 100)}%`);
            transformResetBtn.onclick = () => {
                this.saveSetting('transform', { ratio: 'fit', zoom: 1, rotation: 0 });
                ratioSelect.value = 'fit'; zoomControl.slider.value = 1; zoomControl.valueEl.textContent = '100%';
                this.applyVideoTransform();
            };
            transformRow.append(ratioSelect, rotateBtn, transformResetBtn);
            this.ui.settingsMenu.appendChild(transformRow);
            this.ui.settingsMenu.appendChild(zoomControl.row);

            addSection('Filters');
            const filterRow1 = this.createEl('div', 'mvc-menu-opt mvc-settings-row');
            const filterSelect = this.createEl('select', 'mvc-settings-select');
            const filterConfig = {
                brightness: [0, 2, 1, v => parseFloat(v).toFixed(2)],
                contrast: [0, 2, 1, v => parseFloat(v).toFixed(2)],
                saturate: [0, 3, 1, v => parseFloat(v).toFixed(2)],
                grayscale: [0, 1, 0, v => parseFloat(v).toFixed(2)],
                sepia: [0, 1, 0, v => parseFloat(v).toFixed(2)],
                invert: [0, 1, 0, v => parseFloat(v).toFixed(2)],
                'hue-rotate': [0, 360, 0, v => `${Math.round(v)}°`]
            };
            Object.keys(filterConfig).forEach(f => filterSelect.add(new Option(f.charAt(0).toUpperCase() + f.slice(1), f)));
            const onFilterInput = (v) => { this.settings.filters[filterSelect.value] = v; this.applyVideoFilters(); };
            const onFilterChange = () => this.saveSetting('filters', this.settings.filters);
            const filterControl = createSliderRow('Value:', { value: 1, oninput: onFilterInput, onchange: onFilterChange }, v => v);
            const updateFilterSlider = () => {
                const filter = filterSelect.value;
                const [min, max, def, formatter] = filterConfig[filter];
                filterControl.slider.min = min; filterControl.slider.max = max;
                filterControl.slider.step = (max - min) / 100;
                const currentValue = this.settings.filters[filter] ?? def;
                filterControl.slider.value = currentValue;
                const safeValue = isNaN(parseFloat(currentValue)) ? def : currentValue;
                filterControl.valueEl.textContent = formatter(safeValue);
                filterControl.row.querySelector('.mvc-settings-label').textContent = `${filter.charAt(0).toUpperCase() + filter.slice(1)}:`;
            };
            filterSelect.onchange = updateFilterSlider;
            const filterResetBtn = this.createEl('button', 'mvc-settings-btn', { textContent: 'Reset' });
            filterResetBtn.onclick = () => { this.saveSetting('filters', {}); this.applyVideoFilters(); updateFilterSlider(); };
            filterRow1.append(filterSelect, filterResetBtn);
            this.ui.settingsMenu.appendChild(filterRow1);
            this.ui.settingsMenu.appendChild(filterControl.row);
            updateFilterSlider();

            addSection('Playback & Audio');
            const settingsRow1 = this.createEl('div', 'mvc-menu-opt mvc-settings-row');
            const selfCorrectBtn = this.createEl('button', 'mvc-settings-btn', {});
            const updateSelfCorrectText = () => { selfCorrectBtn.textContent = `Self-Correct: ${this.settings.selfCorrect ? 'On' : 'Off'}`; };
            selfCorrectBtn.onclick = () => {
                this.saveSetting('selfCorrect', !this.settings.selfCorrect);
                updateSelfCorrectText();
                this.toggleTimeUpdateListener(this.settings.selfCorrect);
            };
            updateSelfCorrectText();
            const autoplayBtn = this.createEl('button', 'mvc-settings-btn', {});
            const autoplayModes = ['off', 'next', 'loop'];
            const updateAutoplayText = () => { autoplayBtn.textContent = `Autoplay: ${this.settings.autoplayMode.charAt(0).toUpperCase() + this.settings.autoplayMode.slice(1)}`; };
            autoplayBtn.onclick = () => {
                const idx = autoplayModes.indexOf(this.settings.autoplayMode);
                this.saveSetting('autoplayMode', autoplayModes[(idx + 1) % autoplayModes.length]);
                updateAutoplayText();
            };
            updateAutoplayText();
            settingsRow1.append(selfCorrectBtn, autoplayBtn);
            this.ui.settingsMenu.appendChild(settingsRow1);

            const settingsRow2 = this.createEl('div', 'mvc-menu-opt mvc-settings-row');
            const speedLabel = this.createEl('label', 'mvc-settings-label', { textContent: 'Default Speed:' });
            const speedInput = this.createEl('input', 'mvc-settings-input', { type: 'number', step: 0.05, value: this.settings.defaultSpeed });
            speedInput.onchange = () => {
                const val = parseFloat(speedInput.value);
                if (!isNaN(val) && val > 0 && val <= 16) this.saveSetting('defaultSpeed', val);
                else speedInput.value = this.settings.defaultSpeed;
            };
            const skipLabel = this.createEl('label', 'mvc-settings-label', { textContent: 'Skip Time:' });
            const skipInput = this.createEl('input', 'mvc-settings-input', { type: 'number', value: this.settings.skipSeconds });
            skipInput.onchange = () => {
                const val = parseInt(skipInput.value, 10);
                if (!isNaN(val) && val > 0) {
                    this.saveSetting('skipSeconds', val);
                    this.updateSkipButtonText();
                } else skipInput.value = this.settings.skipSeconds;
            };
            settingsRow2.append(speedLabel, speedInput, skipLabel, skipInput);
            this.ui.settingsMenu.appendChild(settingsRow2);

            const volumeControl = createSliderRow('Volume:', {
                min: 0, max: 100, step: 1, value: this.settings.volume,
                oninput: v => this.updateVolume(v),
                onchange: v => { this.updateVolume(v); this.saveSetting('volume', v); }
            }, v => `${Math.round(v)}%`);
            this.ui.muteBtn = this.createEl('button', 'mvc-settings-btn mvc-mute-btn');
            this.updateMuteButtonIcon();
            this.ui.muteBtn.onclick = () => this.toggleMute(volumeControl);
            const volRow = volumeControl.row;
            volRow.insertBefore(this.ui.muteBtn, volRow.querySelector('.mvc-settings-label'));
            this.ui.settingsMenu.appendChild(volRow);

            const boosterRow = this.createEl('div', 'mvc-menu-opt mvc-settings-row', { style: { justifyContent: 'center', borderTop: 'none', paddingTop: 0 } });
            const boosterBtn = this.createEl('button', 'mvc-settings-btn', { textContent: 'Enable Booster' });
            boosterBtn.onclick = () => {
                this.boosterEnabled = true;
                boosterBtn.disabled = true;
                boosterBtn.textContent = 'Booster: On';
                volumeControl.slider.max = 200;
                this.setupAudioBooster(this.activeVideo);
                this.showToast('Booster enabled. Reload to disable.');
            };
            boosterRow.appendChild(boosterBtn);
            this.ui.settingsMenu.appendChild(boosterRow);
            
           document.body.appendChild(this.ui.settingsMenu);
        }

        updateSkipButtonText() {
            this.ui.rewindBtn.title = `Rewind ${this.settings.skipSeconds}s`;
            this.ui.forwardBtn.title = `Forward ${this.settings.skipSeconds}s`;
        }

        attachEventListeners() {
            window.addEventListener('resize', () => this.onViewportChange(), { passive: true });
            window.addEventListener('scroll', () => {
                this.isScrolling = true;
                clearTimeout(this.timers.scrollEnd);
                this.timers.scrollEnd = setTimeout(() => { this.isScrolling = false; }, MobileVideoController.CONFIG.SCROLL_END_TIMEOUT);
                this.onViewportChange();
            }, { passive: true });
            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', () => this.onViewportChange(), { passive: true });
                window.visualViewport.addEventListener('scroll', () => this.onViewportChange(), { passive: true });
            }

            ['fullscreenchange', 'webkitfullscreenchange'].forEach(ev =>
                document.addEventListener(ev, () => {
                    this.onFullScreenChange();
                    setTimeout(() => this.guardianCheck(), 500);
                }, { passive: true })
            );
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    setTimeout(() => this.guardianCheck(), MobileVideoController.CONFIG.VISIBILITY_GUARDIAN_DELAY);
                }
            }, { passive: true });

            ['pointerdown', 'keydown', 'touchstart'].forEach(ev => window.addEventListener(ev, e => {
                if (e.isTrusted) {
                    this.lastRealUserEvent = Date.now();
                    this.showUI(true);
                }
            }, { passive: true }));
            this.ui.backdrop.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); this.hideAllMenus(); });

            document.body.addEventListener('play', e => {
                if (e.target.tagName === 'VIDEO' && e.target !== this.activeVideo) {
                    setTimeout(() => this.debouncedEvaluate(), 50);
                }
            }, true);
            this.toggleTimeUpdateListener(this.settings.selfCorrect);
            this.attachSpeedButtonListeners();
            this.attachPanelDragListeners();

            this.ui.rewindBtn.onclick = () => { this.showUI(true); if (!this.wasDragging) this.doSkip(-1); this.wasDragging = false; };
            this.ui.forwardBtn.onclick = () => { this.showUI(true); if (!this.wasDragging) this.doSkip(1); this.wasDragging = false; };
            // [NEW] Long press Settings for 2x Speed
            let settingsTimer;
            let isSettingsLongPress = false;
            let preLongPressRate = 1;

            this.ui.settingsBtn.onpointerdown = (e) => {
                // REMOVED e.stopPropagation() -> This fixes the dragging issue!

                isSettingsLongPress = false;
                settingsTimer = setTimeout(() => {
                    // Check if dragging started. If so, cancel 2x logic.
                    if (this.dragData.isDragging) return;

                    if (this.activeVideo) {
                        isSettingsLongPress = true;
                        preLongPressRate = this.activeVideo.playbackRate;
                        this.activeVideo.playbackRate = 2.0;
                        this.showToast('2x Speed');
                        this.vibrate(15);
                        this.ui.settingsBtn.style.transform = "scale(0.9)";
                    }
                }, 400);
            };

            const endSettingsPress = (e) => {
                clearTimeout(settingsTimer);
                // If we were effectively long-pressing (and not dragging), restore speed
                if (isSettingsLongPress && this.activeVideo) {
                    e.preventDefault();

                    this.activeVideo.playbackRate = preLongPressRate;
                    this.showToast('Speed Restored');
                    this.ui.settingsBtn.style.transform = "scale(1)";
                    isSettingsLongPress = false;
                }
            };

            this.ui.settingsBtn.onpointerup = endSettingsPress;
            this.ui.settingsBtn.onpointerleave = endSettingsPress;

            this.ui.settingsBtn.onclick = (e) => {
                // Block menu if we just finished a long press
                if (isSettingsLongPress) {
                    e.stopPropagation();
                    return;
                }
                // Block menu if we just finished dragging (standard check)
                if (this.wasDragging) {
                    e.stopPropagation();
                    this.wasDragging = false;
                    return;
                }

                this.ensureSettingsMenu();
                this.toggleMenu(this.ui.settingsMenu, this.ui.settingsBtn);
            };
            this.setupLongPress(this.ui.rewindBtn, -1);
            this.setupLongPress(this.ui.forwardBtn, 1);
        }

        attachSpeedButtonListeners() {
            let longPressActioned = false;
            this.ui.speedBtn.addEventListener("touchstart", e => e.stopPropagation(), { passive: true });

            this.ui.speedBtn.addEventListener("pointerdown", e => {
                e.stopPropagation(); e.preventDefault();
                let toastPos = { top: '50%', left: '50%' };
                if (this.activeVideo?.isConnected) {
                    const vr = this.activeVideo.getBoundingClientRect();
                    toastPos = { top: `${vr.top + vr.height / 2}px`, left: `${vr.left + vr.width / 2}px` };
                }

                this.sliderData = {
                    startY: e.clientY,
                    currentY: e.clientY,
                    startRate: this.activeVideo ? this.activeVideo.playbackRate : 1.0,
                    isSliding: false,
                    toastPosition: toastPos
                };
                longPressActioned = false;
                try { this.ui.speedBtn.setPointerCapture(e.pointerId); } catch (e) { }

                this.timers.longPress = setTimeout(() => {
                    if (this.activeVideo) {
                        this.activeVideo.playbackRate = 1.0;
                        this.showToast("Speed reset to 1.00x");
                        this.vibrate(MobileVideoController.CONFIG.LONG_PRESS_VIBRATE_MS);
                    }
                    longPressActioned = true;
                    this.sliderData.isSliding = false;
                }, MobileVideoController.CONFIG.LONG_PRESS_DURATION_MS);
            });

            this.ui.speedBtn.addEventListener("pointermove", e => {
                if (this.sliderData.startY == null || !this.activeVideo || longPressActioned) return;
                e.stopPropagation(); e.preventDefault();

                if (!this.sliderData.isSliding && Math.abs(e.clientY - this.sliderData.startY) > MobileVideoController.CONFIG.DRAG_THRESHOLD) {
                    clearTimeout(this.timers.longPress);
                    this.sliderData.isSliding = true;
                    this.isSpeedSliding = true;
                    this.showUI(true);
                    if (this.activeVideo.paused) this.activeVideo.play();
                    this.ui.speedBtn.style.transform = 'scale(1.1)';
                    Object.assign(this.ui.speedToast.style, this.sliderData.toastPosition);
                    this.vibrate();
                }
                if (this.sliderData.isSliding) {
                    this.sliderData.currentY = e.clientY;
                    if (!this.isTickingSlider) {
                        requestAnimationFrame(() => this.updateSpeedSlider());
                        this.isTickingSlider = true;
                    }
                }
            });
            this.ui.speedBtn.addEventListener("pointerup", e => {
                e.stopPropagation();
                clearTimeout(this.timers.longPress);
                if (this.sliderData.isSliding && this.activeVideo) {
                    this.saveSetting('last_rate', this.activeVideo.playbackRate.toString());
                    this.updateSpeedDisplay();
                } else if (!longPressActioned) {
                    if (this.ui.speedBtn.textContent === '▶︎' || this.ui.speedBtn.textContent === 'Replay') this.handlePlayPauseClick();
                    else {
                        this.ensureSpeedMenu();
                        this.toggleMenu(this.ui.speedMenu, this.ui.speedBtn);
                    }
                }
                this.isSpeedSliding = false;
                this.isTickingSlider = false;
                this.sliderData = { isSliding: false };
                this.ui.speedBtn.style.transform = 'scale(1)';
                this.ui.speedBtn.classList.remove('snapped');
                this.ui.speedToast.classList.remove('snapped');
                this.hideSpeedToast();
                clearTimeout(this.timers.hide);
                this.timers.hide = setTimeout(() => this.hideUI(), MobileVideoController.CONFIG.UI_FADE_TIMEOUT);
            });
        }

        updateSpeedSlider() {
            if (!this.sliderData.isSliding || !this.activeVideo) { this.isTickingSlider = false; return; }
            this.showUI(true);
            const dy = this.sliderData.startY - this.sliderData.currentY;
            const delta = Math.sign(dy) * Math.pow(Math.abs(dy), MobileVideoController.CONFIG.SLIDER_POWER) * MobileVideoController.CONFIG.SLIDER_SENSITIVITY;
            let newRate = this.clamp(this.sliderData.startRate + delta, 0.1, 16);
            let isSnapped = false;
            for (const point of MobileVideoController.CONFIG.DEFAULT_SNAP_POINTS) {
                const dist = Math.abs(newRate - point);
                if (dist < MobileVideoController.CONFIG.SNAP_THRESHOLD) {
                    const gravity = 1 - (dist / MobileVideoController.CONFIG.SNAP_THRESHOLD);
                    newRate = newRate * (1 - gravity * MobileVideoController.CONFIG.SNAP_STRENGTH) + point * (gravity * MobileVideoController.CONFIG.SNAP_STRENGTH);
                    isSnapped = true;
                    break;
                }
            }
            this.activeVideo.playbackRate = newRate;
            this.showSpeedToast(`${newRate.toFixed(2)}x`, false);
            this.ui.speedBtn.classList.toggle('snapped', isSnapped);
            this.ui.speedToast.classList.toggle('snapped', isSnapped);
            this.isTickingSlider = false;
        }

        attachPanelDragListeners() {
            this.ui.panel.addEventListener("touchstart", e => e.stopPropagation(), { passive: true });
            this.ui.panel.addEventListener("touchmove", e => { e.preventDefault(); e.stopImmediatePropagation(); }, { passive: false });
            this.ui.panel.onpointerdown = e => {
                e.stopPropagation();
                this.wasDragging = false;
                this.showUI(true);
                this.ui.wrap.style.transform = '';

                const rect = this.ui.wrap.getBoundingClientRect();
                this.dragData = {
                    startPageX: rect.left + window.scrollX,
                    startPageY: rect.top + window.scrollY,
                    startX: e.clientX,
                    startY: e.clientY,
                    isDragging: false
                };
                const onDragMove = moveEvent => {
                    moveEvent.stopPropagation();
                    moveEvent.stopImmediatePropagation();
                    if (moveEvent.cancelable) moveEvent.preventDefault();

                    this.dragData.dx = moveEvent.clientX - this.dragData.startX;
                    this.dragData.dy = moveEvent.clientY - this.dragData.startY;
                    if (!this.dragData.isDragging && Math.sqrt(this.dragData.dx ** 2 + this.dragData.dy ** 2) > MobileVideoController.CONFIG.DRAG_THRESHOLD) {
                        this.dragData.isDragging = true;
                        this.ui.panel.style.cursor = 'grabbing';
                        this.showUI(true);
                        clearTimeout(this.timers.longPressSkip);
                    }
                    if (this.dragData.isDragging && !this.isTickingDrag) {
                        requestAnimationFrame(() => this.updateDragPosition());
                        this.isTickingDrag = true;
                    }
                };
                const onDragEnd = () => {
                    window.removeEventListener('pointermove', onDragMove);
                    window.removeEventListener('pointerup', onDragEnd);
                    this.ui.panel.style.cursor = 'grab';
                    if (this.dragData.isDragging) {
                        this.isManuallyPositioned = true;
                        this.wasDragging = true;
                    }
                    this.dragData.isDragging = false;
                    clearTimeout(this.timers.hide);
                    this.timers.hide = setTimeout(() => this.hideUI(), MobileVideoController.CONFIG.UI_FADE_TIMEOUT);
                };

                window.addEventListener('pointermove', onDragMove);
                window.addEventListener('pointerup', onDragEnd, { once: true });
            };
        }

        evaluateActive() {
            if (this.activeVideo &&
                this.isPlaying(this.activeVideo) &&
                this.activeVideo.isConnected &&
                this.visibleVideos.has(this.activeVideo)) {
                const r = this.activeVideo.getBoundingClientRect();
                if (r.height > 50 && r.bottom > 0 && r.top < window.innerHeight) {
                    return;
                }
            }

            let best = null, bestScore = -1;
            const viewArea = window.innerWidth * window.innerHeight;

            for (const v of this.visibleVideos.keys()) {
                if (!v.isConnected) { this.visibleVideos.delete(v); continue; }
                if (getComputedStyle(v).visibility === 'hidden') continue;
                const r = v.getBoundingClientRect();
                const area = r.width * r.height;
                if (area < MobileVideoController.CONFIG.MIN_VIDEO_AREA) continue;
                const score = area + (this.isPlaying(v) ? viewArea * 2 : 0);
                if (score > bestScore) {
                    best = v;
                    bestScore = score;
                }
            }
            this.setActiveVideo(best);
        }

        setActiveVideo(v, options = {}) {
            if (this.activeVideo === v) return;
            clearTimeout(this.timers.hideGrace);

            if (this.activeVideo) {
                ['ended', 'play', 'pause', 'ratechange'].forEach(ev => this.activeVideo.removeEventListener(ev, this));
                this.videoResizeObserver.unobserve(this.activeVideo);
                this.videoMutationObserver.disconnect();
                if (this.currentScrollParent) {
                    this.currentScrollParent.removeEventListener('scroll', this.boundScrollHandler);
                    this.currentScrollParent = null;
                }
                const audioData = this.audioContexts.get(this.activeVideo);
                if (audioData?.cleanupListeners) audioData.cleanupListeners();
            }

            this.activeVideo = v;
            this.dragData = { isDragging: false };

            if (v) {
                this.attachUIToVideo(v);
                const scrollParent = this.findScrollableParent(v);
                if (scrollParent) {
                    this.currentScrollParent = scrollParent;
                    this.currentScrollParent.addEventListener('scroll', this.boundScrollHandler, { passive: true });
                }
                this.videoResizeObserver.observe(v);
                this.videoMutationObserver.observe(v.parentElement || v, { attributes: true, subtree: true });
                this.applyDefaultSpeed(v);
                this.applyVideoTransform();
                this.applyVideoFilters();
                this.updateVolume(this.settings.volume);

                if (this.boosterEnabled) this.setupAudioBooster(v);
            } else {
                const gracePeriod = options.immediateHide ? 0 : 250;
                this.timers.hideGrace = setTimeout(() => {
                    if (!this.activeVideo && this.ui.wrap) this.ui.wrap.style.display = 'none';
                }, gracePeriod);
            }
        }

        attachUIToVideo(video) {
            this.ui.wrap.style.visibility = 'hidden';
            const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
            const siteConfig = MobileVideoController.SITE_CONFIGS[window.location.hostname.replace(/^www\./, '')];

            let parent = fsEl;
            if (!parent && siteConfig?.parentSelector) parent = video.closest(siteConfig.parentSelector);
            if (siteConfig?.attachToParent) parent = video.parentElement;
            if (parent && parent.isConnected) {
                if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
                parent.appendChild(this.ui.wrap);
                this.ui.wrap.style.position = 'absolute';
            } else {
                document.body.appendChild(this.ui.wrap);
                this.ui.wrap.style.position = 'absolute';
            }

            this.ui.wrap.style.display = 'block';
            this.isManuallyPositioned = false;
            this.throttledPositionOnVideo();

            setTimeout(() => {
                this.ui.wrap.style.visibility = 'visible';
                this.showUI(true);
                this.updateSpeedDisplay();
            }, 50);
            ['ended', 'play', 'pause', 'ratechange'].forEach(ev => video.addEventListener(ev, this));
        }

        positionOnVideo() {
            if (!this.activeVideo || !this.ui.wrap || this.isManuallyPositioned || this.dragData?.isDragging) return;
            

            this.ui.wrap.style.transform = '';

            const vr = this.activeVideo.getBoundingClientRect();
            const layoutWidth = this.activeVideo.clientWidth;
            const layoutHeight = this.activeVideo.clientHeight;
            const zoom = this.settings.transform.zoom;
            const offsetX = (layoutWidth * (zoom - 1)) / 2;
            const offsetY = (layoutHeight * (zoom - 1)) / 2;
            const untransformedLeft = vr.left + offsetX;
            const untransformedTop = vr.top + offsetY;
            const desiredLeftPage = untransformedLeft + window.scrollX + layoutWidth - this.ui.width - MobileVideoController.CONFIG.DEFAULT_RIGHT_OFFSET;
            let desiredTopPage = untransformedTop + window.scrollY + layoutHeight - this.ui.height - 10;
            if (layoutHeight > window.innerHeight * 0.7 && vr.bottom > window.innerHeight - 150) desiredTopPage -= 82;

            const v = this.getViewportPageBounds();
            const minPageX = v.leftPage + MobileVideoController.CONFIG.EDGE;
            const maxPageX = v.leftPage + v.width - this.ui.width - MobileVideoController.CONFIG.EDGE;
            const minPageY = v.topPage + MobileVideoController.CONFIG.EDGE;
            const maxPageY = v.topPage + v.height - this.ui.height - MobileVideoController.CONFIG.EDGE;
            const clampedLeftPage = this.clamp(desiredLeftPage, minPageX, maxPageX);
            const clampedTopPage = this.isScrolling ? desiredTopPage : this.clamp(desiredTopPage, minPageY, maxPageY);
            const parent = this.ui.wrap.parentElement || document.body;
            const parentRect = parent.getBoundingClientRect();
            const parentLeftPage = parentRect.left + window.scrollX;
            const parentTopPage = parentRect.top + window.scrollY;

            this.ui.wrap.style.left = `${Math.round(clampedLeftPage - parentLeftPage)}px`;
            this.ui.wrap.style.top = `${Math.round(clampedTopPage - parentTopPage)}px`;
            this.ui.wrap.style.right = "auto";
            this.ui.wrap.style.bottom = "auto";
        }

        handleEvent(event) {
            switch (event.type) {
                case 'ended':
                    if (this.settings.autoplayMode === 'loop') this.activeVideo?.play();
                    else if (this.settings.autoplayMode === 'next' && window.location.hostname.includes('youtube.com')) document.querySelector('.ytp-next-button')?.click();
                    this.onVideoEnded();
                    break;
                case 'play':
                case 'pause':
                    this.updateSpeedDisplay();
                    this.showUI();
                    break;
                case 'ratechange':
                    this.updateSpeedDisplay();
                    if (!this.isSpeedSliding) this.showUI();
                    break;
            }
        }

        handleTimeUpdate(e) {
            if (!this.activeVideo) return;
            if (this.abLoop.active && this.abLoop.a != null && this.abLoop.b != null) {
                if (this.activeVideo.currentTime >= this.abLoop.b || this.activeVideo.currentTime < this.abLoop.a) {
                    this.activeVideo.currentTime = this.abLoop.a;
                }
            }
        }

        toggleTimeUpdateListener(enable) {
            document.body.removeEventListener('timeupdate', this.timeUpdateHandler, true);
            if (enable || this.abLoop.active) document.body.addEventListener('timeupdate', this.timeUpdateHandler, true);
        }

        findScrollableParent(element) {
            let parent = element.parentElement;
            while (parent) {
                const { overflowY } = window.getComputedStyle(parent);
                if ((overflowY === 'scroll' || overflowY === 'auto') && parent.scrollHeight > parent.clientHeight) {
                    return parent;
                }
                parent = parent.parentElement;
            }
            return window;
        }

        setupObservers() {
            this.intersectionObserver = new IntersectionObserver(e => this.handleIntersection(e), { threshold: 0.05 });
            document.querySelectorAll('video').forEach(v => this.intersectionObserver.observe(v));

            const config = MobileVideoController.SITE_CONFIGS[window.location.hostname];
            const observerRoot = config?.observerRootSelector ? document.querySelector(config.observerRootSelector) : document.body;
            this.mutationObserver = new MutationObserver(m => this.handleMutation(m));
            if (observerRoot) this.mutationObserver.observe(observerRoot, { childList: true, subtree: true });
            else this.mutationObserver.observe(document.body || document.documentElement, { childList: true, subtree: true });
        }

        handleIntersection(entries) {
            let needsReevaluation = false;
            entries.forEach(entry => {
                const target = entry.target;
                if (entry.isIntersecting) {
                    if (!this.visibleVideos.has(target)) {
                        this.visibleVideos.set(target, true);
                        needsReevaluation = true;
                    }
                } else {
                    if (this.visibleVideos.has(target)) {
                        this.visibleVideos.delete(target);
                        if (target === this.activeVideo) {
                            const scrolledOffTop = entry.boundingClientRect.bottom < 10;
                            this.setActiveVideo(null, { immediateHide: scrolledOffTop });
                        }
                        needsReevaluation = true;
                    }
                }
            });
            if (needsReevaluation) this.debouncedEvaluate();
        }

        handleMutation(mutations) {
            let videoAdded = false, activeVideoRemoved = false;
            let relevantMutation = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                   mutation.addedNodes.forEach(node => {
                       if (node.nodeType === 1 && (node.tagName === 'VIDEO' || (node.querySelector && node.querySelector('video')))) {
                           relevantMutation = true;
                           const videos = node.tagName === 'VIDEO' ? [node] : node.querySelectorAll('video');
                           videos.forEach(v => { this.intersectionObserver.observe(v); videoAdded = true; });
                       }
                   });
                }
                if (mutation.removedNodes.length) {
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                             if (node.tagName === 'VIDEO' || (node.querySelector && node.querySelector('video'))) {
                                relevantMutation = true;
                                const videos = node.tagName === 'VIDEO' ? [node] : node.querySelectorAll('video');
                                videos.forEach(v => {
                                    this.intersectionObserver.unobserve(v);
                                    this.visibleVideos.delete(v);
                                    if (v === this.activeVideo) activeVideoRemoved = true;
                                });
                             }
                        }
                    });
                }
            });
            if (!relevantMutation) return;

            if (activeVideoRemoved) this.setActiveVideo(null);
            if (videoAdded || activeVideoRemoved || (this.activeVideo && !this.activeVideo.isConnected)) {
                this.debouncedEvaluate();
            }
        }

        setupVideoPositionObserver() {
            this.videoResizeObserver = new ResizeObserver(() => this.throttledPositionOnVideo());
            this.videoMutationObserver = new MutationObserver(() => this.throttledPositionOnVideo());
        }

        throttledPositionOnVideo() {
            if (this.isTicking) return;
            this.isTicking = true;
            requestAnimationFrame(() => {
                if (!this.dragData?.isDragging && !this.isManuallyPositioned) {
                    this.positionOnVideo();
                }
                this.isTicking = false;
            });
        }

        onViewportChange() {
            if (this.isManuallyPositioned) return;
            this.ensureUIInViewport();
            if (this.activeVideo) this.throttledPositionOnVideo();
        }

        ensureUIInViewport() {
            if (!this.ui.wrap || !this.ui.width || !this.ui.height) return;
            const EDGE = MobileVideoController.CONFIG.EDGE;
            const v = this.getViewportPageBounds();
            const uiRect = this.ui.wrap.getBoundingClientRect();

            const currentPageLeft = uiRect.left + window.scrollX;
            const currentPageTop = uiRect.top + window.scrollY;

            const minPageX = v.leftPage + EDGE;
            const maxPageX = v.leftPage + v.width - this.ui.width - EDGE;
            const minPageY = v.topPage + EDGE;
            const maxPageY = v.topPage + v.height - this.ui.height - EDGE;

            const clampedLeftPage = this.clamp(currentPageLeft, Math.min(minPageX, maxPageX), Math.max(minPageX, maxPageX));
            const clampedTopPage = this.clamp(currentPageTop, Math.min(minPageY, maxPageY), Math.max(minPageY, maxPageY));

            const parent = this.ui.wrap.parentElement || document.body;
            const parentRect = parent.getBoundingClientRect();
            const parentLeftPage = parentRect.left + window.scrollX;
            const parentTopPage = parentRect.top + window.scrollY;

            this.ui.wrap.style.left = `${Math.round(clampedLeftPage - parentLeftPage)}px`;
            this.ui.wrap.style.top = `${Math.round(clampedTopPage - parentTopPage)}px`;
        }

        updateDragPosition() {
            if (!this.dragData.isDragging) { this.isTickingDrag = false; return; }

            const parent = this.ui.wrap.parentElement || document.body;
            const parentRect = parent.getBoundingClientRect();
            const parentLeftPage = parentRect.left + window.scrollX;
            const parentTopPage = parentRect.top + window.scrollY;
            let newPageX = this.dragData.startPageX + this.dragData.dx;
            let newPageY = this.dragData.startPageY + this.dragData.dy;

            const v = this.getViewportPageBounds();
            const minPageX = v.leftPage + MobileVideoController.CONFIG.EDGE;
            const maxPageX = v.leftPage + v.width - this.ui.width - MobileVideoController.CONFIG.EDGE;
            const minPageY = v.topPage + MobileVideoController.CONFIG.EDGE;
            const maxPageY = v.topPage + v.height - this.ui.height - MobileVideoController.CONFIG.EDGE;
            newPageX = this.clamp(newPageX, minPageX, maxPageX);
            newPageY = this.clamp(newPageY, minPageY, maxPageY);

            this.ui.wrap.style.left = `${Math.round(newPageX - parentLeftPage)}px`;
            this.ui.wrap.style.top = `${Math.round(newPageY - parentTopPage)}px`;
            this.isTickingDrag = false;
        }

        setupLongPress(btn, dir) {
            const clear = () => clearTimeout(this.timers.longPressSkip);
            btn.addEventListener("pointerdown", () => {
                clear();
                this.timers.longPressSkip = setTimeout(() => {
                    this.longPressDirection = dir;
                    this.ensureSkipMenu();
                    this.placeMenu(this.ui.skipMenu, this.ui.wrap);
                    this.ui.skipMenu.style.display = 'flex';
                    this.showBackdrop();
                }, MobileVideoController.CONFIG.LONG_PRESS_DURATION_MS);
            });
            ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, clear));
        }

        getViewportPageBounds() {
            const v = window.visualViewport;
            const leftPage = window.scrollX + (v ? v.offsetLeft : 0);
            const topPage = window.scrollY + (v ? v.offsetTop : 0);
            const width = v ? v.width : window.innerWidth;
            const height = v ? v.height : window.innerHeight;
            return { leftPage, topPage, width, height };
        }

        showUI(force = false) {
            if (!this.ui.wrap || !this.activeVideo) return;
            if (!this.ui.wrap.isConnected) this.attachUIToVideo(this.activeVideo);
            if (!force && (Date.now() - this.lastRealUserEvent >= 4500)) return;

            this.ui.wrap.style.opacity = '1';
            this.ui.wrap.style.pointerEvents = 'auto';
            clearTimeout(this.timers.hide);

            // [INTELLIGENCE] Fade logic
            const isInteracting = this.dragData.isDragging || this.sliderData.isSliding || this.isSpeedSliding;

            if (!isInteracting && !this.activeVideo.paused) {
                this.timers.hide = setTimeout(() => this.hideUI(), MobileVideoController.CONFIG.UI_FADE_TIMEOUT);
            }
        }

        hideUI() {
            // [INTELLIGENCE] Double check before hiding
            const isInteracting = this.dragData.isDragging || this.sliderData.isSliding || this.isSpeedSliding;
            if (this.activeVideo?.paused || isInteracting) return;

            const anyMenuOpen = Object.values(this.ui).some(el => el?.classList?.contains && el.classList.contains('mvc-menu') && getComputedStyle(el).display !== 'none');
            if (this.ui.wrap && !anyMenuOpen) {
                this.ui.wrap.style.opacity = String(MobileVideoController.CONFIG.UI_FADE_OPACITY);
                this.ui.wrap.style.pointerEvents = 'none';
            }
        }

        showBackdrop() {
            this.ui.backdrop.style.display = 'block';
            this.ui.backdrop.style.pointerEvents = 'none';
            setTimeout(() => { if (this.ui.backdrop) this.ui.backdrop.style.pointerEvents = 'auto'; }, MobileVideoController.CONFIG.BACKDROP_POINTER_EVENTS_DELAY);
        }

        hideAllMenus() {
            Object.values(this.ui).forEach(el => {
                if (el?.classList?.contains && el.classList.contains('mvc-menu')) el.style.display = 'none';
            });
            this.ui.backdrop.style.display = 'none';
            this.showUI(true);
        }

        toggleMenu(menuEl, anchorEl) {
            if (getComputedStyle(menuEl).display !== 'none') {
                this.hideAllMenus();
            } else {
                this.hideAllMenus();
                this.placeMenu(menuEl, anchorEl);
                menuEl.style.display = 'flex';
                this.showBackdrop();
                clearTimeout(this.timers.hide);
            }
        }

        placeMenu(menuEl, anchorEl) {
            const { w, h } = this.showAndMeasure(menuEl);
            const rect = anchorEl.getBoundingClientRect();
            let left = rect.left + rect.width / 2 - w / 2;
            const openAbove = rect.top - h - 8 >= MobileVideoController.CONFIG.EDGE;
            let top = openAbove ? rect.top - h - 8 : rect.bottom + 8;

            if (menuEl === this.ui.speedMenu || menuEl === this.ui.settingsMenu) {
                menuEl.style.flexDirection = openAbove ? 'column-reverse' : 'column';
            }

            const v = window.visualViewport;
            const viewportWidth = v ? v.width : window.innerWidth;
            const viewportHeight = v ? v.height : window.innerHeight;
            left = this.clamp(left, MobileVideoController.CONFIG.EDGE, viewportWidth - w - MobileVideoController.CONFIG.EDGE);
            top = this.clamp(top, MobileVideoController.CONFIG.EDGE, viewportHeight - h - MobileVideoController.CONFIG.EDGE);
            menuEl.style.left = `${Math.round(left)}px`;
            menuEl.style.top = `${Math.round(top)}px`;
        }

        updateSpeedDisplay() {
            if (!this.activeVideo || !this.ui.speedBtn) return;
            if (this.activeVideo.ended) this.ui.speedBtn.textContent = 'Replay';
            else if (this.activeVideo.paused) this.ui.speedBtn.textContent = '▶︎';
            else this.ui.speedBtn.textContent = `${this.activeVideo.playbackRate.toFixed(2)}`;
            this.saveSetting('last_rate', String(this.activeVideo.playbackRate));
        }

        onVideoEnded() {
            if (this.activeVideo) {
                this.activeVideo.playbackRate = this.settings.defaultSpeed;
                this.saveSetting('last_rate', String(this.settings.defaultSpeed));
                this.updateSpeedDisplay();
            }
        }

        handlePlayPauseClick() {
            if (!this.activeVideo) return;
            if (this.activeVideo.paused || this.activeVideo.ended) {
                this.activeVideo.playbackRate = parseFloat(localStorage.getItem('mvc_last_rate')) || this.settings.defaultSpeed;
                this.activeVideo.play().catch(() => {});
            } else {
                this.saveSetting('last_rate', this.activeVideo.playbackRate.toString());
                this.activeVideo.pause();
            }
        }

        doSkip(dir) {
            if (this.activeVideo) this.activeVideo.currentTime = this.clampTime(this.activeVideo.currentTime + dir * this.settings.skipSeconds);
        }

        onFullScreenChange() {
            const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
            const container = fsEl || document.body;
            [this.ui.backdrop, this.ui.toast, this.ui.speedToast, this.ui.speedMenu, this.ui.skipMenu, this.ui.settingsMenu].forEach(el => {
                if (el) container.appendChild(el);
            });
            if (this.activeVideo) this.attachUIToVideo(this.activeVideo);
            this.guardianCheck();
        }

        guardianCheck() {
            if (!this.activeVideo || !this.ui.wrap) return;
            const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
            const isSimpleSite = MobileVideoController.SITE_CONFIGS[window.location.hostname] && !MobileVideoController.SITE_CONFIGS[window.location.hostname].useDefaultPositioning;
            const expectedParent = fsEl ? fsEl : (isSimpleSite ? this.findParentForVideo(this.activeVideo) : document.body);

            if (expectedParent && (!this.ui.wrap.isConnected || this.ui.wrap.parentElement !== expectedParent)) {
                this.attachUIToVideo(this.activeVideo);
            }
        }

        findParentForVideo(video) {
            const config = MobileVideoController.SITE_CONFIGS[window.location.hostname];
            if (config?.parentSelector) return video.closest(config.parentSelector) || video.parentElement;
            return video.parentElement;
        }

        applyDefaultSpeed(v) {
            if (v && this.settings.defaultSpeed !== 1.0 && Math.abs(v.playbackRate - 1.0) < 0.1) {
                v.playbackRate = this.settings.defaultSpeed;
            }
        }

        applyVideoTransform() {
            if (!this.activeVideo) return;
            const { ratio, zoom, rotation } = this.settings.transform;
            this.activeVideo.style.objectFit = ratio === 'fit' ? 'contain' : ratio === 'fill' ? 'cover' : 'fill';
            this.activeVideo.style.transform = `scale(${zoom}) rotate(${rotation}deg)`;
        }

        applyVideoFilters() {
            if (!this.activeVideo) return;
            const filterString = Object.entries(this.settings.filters).map(([k, v]) => k === 'hue-rotate' ? `hue-rotate(${v}deg)` : `${k}(${v})`).join(' ');
            this.activeVideo.style.filter = filterString;
        }

        setupAudioBooster(video) {
            if (!video || video.dataset.mvcAudioReady) return;
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                const audioCtx = new AudioCtx();
                const source = audioCtx.createMediaElementSource(video);
                const gainNode = audioCtx.createGain();
                gainNode.connect(audioCtx.destination);
                source.connect(gainNode);

                const suspend = () => { if (audioCtx.state === 'running') audioCtx.suspend(); };
                const resume = () => { if (audioCtx.state === 'suspended') audioCtx.resume(); };

                video.addEventListener('pause', suspend);
                video.addEventListener('play', resume);
                video.addEventListener('seeking', suspend);
                video.addEventListener('seeked', resume);

                if (video.paused) suspend();

                this.audioContexts.set(video, {
                    audioCtx,
                    gainNode,
                    cleanupListeners: () => {
                        video.removeEventListener('pause', suspend);
                        video.removeEventListener('play', resume);
                        video.removeEventListener('seeking', suspend);
                        video.removeEventListener('seeked', resume);
                        audioCtx.close();
                    }
                });
                video.dataset.mvcAudioReady = "true";
            } catch (e) { console.error("MVC: Could not set up audio booster.", e); }
        }

        updateVolume(value) {
            if (!this.activeVideo) return;
            const volumeValue = parseFloat(value);
            if (this.boosterEnabled) {
                this.setupAudioBooster(this.activeVideo);
                const audio = this.audioContexts.get(this.activeVideo);
                if (volumeValue <= 100) {
                    this.activeVideo.volume = volumeValue / 100;
                    if (audio) audio.gainNode.gain.value = 1;
                } else {
                    this.activeVideo.volume = 1;
                    if (audio) audio.gainNode.gain.value = volumeValue / 100;
                }
            } else {
                const safeVolume = this.clamp(volumeValue, 0, 100);
                this.activeVideo.volume = safeVolume / 100;
            }
            this.settings.volume = volumeValue;
            this.updateMuteButtonIcon();
        }

        toggleMute(volumeControl) {
            if (this.settings.volume > 0) {
                this.lastVolume = this.settings.volume;
                this.updateVolume(0);
            } else {
                this.updateVolume(this.lastVolume || 100);
            }
            volumeControl.slider.value = this.settings.volume;
            volumeControl.valueEl.textContent = `${Math.round(this.settings.volume)}%`;
            this.saveSetting('volume', this.settings.volume);
        }

        updateMuteButtonIcon() {
            if (!this.ui.muteBtn) return;
            while (this.ui.muteBtn.firstChild) this.ui.muteBtn.removeChild(this.ui.muteBtn.firstChild);
            const muted = this.settings.volume <= 0;
            const pathD = muted
                ? "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                : "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z";
            this.ui.muteBtn.appendChild(this.createSvgIcon(pathD));
        }

        formatTime(sec) {
            return new Date(sec * 1000).toISOString().slice(14, -5);
        }

        vibrate(ms = 10) {
            if (navigator.vibrate) try { navigator.vibrate(ms); } catch (e) {}
        }

        showToast(message) {
            if (!this.ui.toast) return;
            this.ui.toast.textContent = message;
            this.ui.toast.style.opacity = '1';
            clearTimeout(this.timers.toast);
            this.timers.toast = setTimeout(() => { this.ui.toast.style.opacity = '0'; }, 1500);
        }

        showSpeedToast(message, updatePosition = true) {
            if (!this.ui.speedToast) return;
            if (updatePosition) {
                if (this.activeVideo?.isConnected) {
                    const rr = this.activeVideo.getBoundingClientRect();
                    this.ui.speedToast.style.top = `${rr.top + rr.height / 2}px`;
                    this.ui.speedToast.style.left = `${rr.left + rr.width / 2}px`;
                } else {
                    this.ui.speedToast.style.top = '50%';
                    this.ui.speedToast.style.left = '50%';
                }
            }
            this.ui.speedToast.textContent = message;
            this.ui.speedToast.style.opacity = '1';
        }

        hideSpeedToast() {
            clearTimeout(this.timers.speedToast);
            this.timers.speedToast = setTimeout(() => { if (this.ui.speedToast) this.ui.speedToast.style.opacity = '0'; }, MobileVideoController.CONFIG.SPEED_TOAST_FADE_DELAY);
        }

        clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
        clampTime(t) { return this.clamp(t, 0, this.activeVideo?.duration ?? Infinity); }
        isPlaying(v) { return v && !v.paused && !v.ended && v.readyState > 2; }

        showAndMeasure(el) {
            const prev = { display: el.style.display, visibility: el.style.visibility };
            Object.assign(el.style, { display: 'flex', visibility: 'hidden' });
            const r = el.getBoundingClientRect();
            Object.assign(el.style, prev);
            return { w: r.width, h: r.height };
        }

        injectStyles() {
            if (document.getElementById('mvc-styles')) return;
            if (!document.head) return;
            const style = document.createElement('style');
            style.id = 'mvc-styles';
            // [UPDATED] CSS for OVAL/PILL buttons
            style.textContent = `
                .mvc-ui-wrap { position:absolute; left:0; top:0; z-index:2147483647; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; display:none; opacity:0; pointer-events:none; transition:opacity .5s ease; will-change:opacity, transform; transform:translate3d(0,0,0); contain:layout paint; }

                /* [NEW CARD STYLE] */
                .mvc-panel { display:flex; align-items:center; gap:2px; background:rgba(20, 20, 20, 0.65); color:#fff; padding:1px 2px; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.08); box-shadow:0 8px 24px rgba(0,0,0,0); border-radius:12px; touch-action:none!important; user-select:none; -webkit-user-select:none; pointer-events:auto; cursor:grab; width:fit-content; transform:translate3d(0,0,0); will-change:transform; }

                /* [NEW BUTTON STYLE] - Backgrounds added for "Key" feel */
                .mvc-btn { appearance:none; border:0; border-radius:12px; width:40px; height:30px; padding:0; font-size:14px; font-weight:600; text-align:center; line-height:34px; pointer-events:auto; transition:transform .15s ease, background-color .2s; user-select:none; display:flex; align-items:center; justify-content:center; touch-action:none!important; background:rgba(255,255,255,0.08); }
                .mvc-btn:active { transform:scale(0.9); background:rgba(255,255,255,0.2); }

                /* [OVAL SPEED BUTTON] Pill shape + Thin Border */
                .mvc-btn-speed {
                    width: auto;
                    padding: 0 10px;
                    border-radius: 12px;
                    min-width: 40px;
                    color: #40c4ff;
                    font-size:12px;
                    font-weight:700;
                    border: 1px solid rgba(64, 196, 255, 0.4);
                    background: rgba(64, 196, 255, 0.1);
                }
                /* [NEW] Speed Menu List Style with Separators */
.mvc-speed-list {
    padding: 0 !important; /* Flush items to edges */
    overflow: hidden;      /* Clip corners */
}
.mvc-speed-list .mvc-menu-opt {
    margin: 0 !important;
    border-radius: 0 !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15); /* The Separator Line */
    padding: 8px 12px;     /* Comfortable touch target */
}
.mvc-speed-list .mvc-menu-opt:last-child {
    border-bottom: none;   /* No line on last item */
}

                /* [COLOR ACCENTS] */
                .mvc-btn-rewind { color: #ff5252; }
                .mvc-btn-forward { color: #69f0ae; }
                .mvc-btn-settings { color: #e0e0e0; opacity: 0.9; }

                .mvc-btn.snapped { color:#ffea00!important; text-shadow:0 0 5px rgba(255,234,0,0.5); border-color:#ffea00; }

                .mvc-skip-btn { appearance:none; border:0; border-radius:12px; padding:10px 18px; font-size:15px; font-weight:600; color:#fff; background:rgba(255,255,255,0.1); line-height:1.2; user-select:none; transition:background 0.2s; }
                .mvc-skip-btn:active { background:rgba(255,255,255,0.2); }
                .mvc-backdrop { display:none; position:fixed; inset:0; z-index:2147483646; background:rgba(0,0,0,.01); touch-action:none; }
                .mvc-toast { position:fixed; left:50%; bottom:60px; transform:translateX(-50%) translate3d(0,0,0); background:rgba(20,20,20,.85); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.1); color:#fff; padding:10px 20px; border-radius:20px; z-index:2147483647; opacity:0; transition:opacity .35s ease; pointer-events:none; font-size:14px; font-weight:500; }
                .mvc-speed-toast { position:fixed; transform:translate(-50%,-50%) translate3d(0,0,0); background:rgba(20,20,20,.85); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.1); color:#fff; padding:12px 24px; border-radius:16px; z-index:2147483647; font-size:24px; font-weight:600; opacity:0; transition:opacity .35s ease,color .2s linear; pointer-events:none; will-change:opacity,color; }
                .mvc-speed-toast.snapped { color:#69f0ae!important; }
                .mvc-menu { display:none; flex-direction:column; position:fixed; background:rgba(28,28,30,0.95); border-radius:18px; backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.1); box-shadow:0 12px 48px rgba(0,0,0,0.6); z-index:2147483647; min-width:60px; max-height:80vh; overflow-y:auto; pointer-events:auto; touch-action:manipulation; -webkit-tap-highlight-color:transparent; transform:translate3d(0,0,0); padding:4px; }
                .mvc-menu-opt { padding:6px 6px; font-size:15px; text-align:center; border-radius:8px; margin:2px 4px; user-select:none; cursor:pointer; transition:background .2s; }
                .mvc-menu-opt:active { background:rgba(255,255,255,0.15); }
                .mvc-settings-row { display:flex; justify-content:space-between; align-items:center; gap:12px; cursor:default; background:transparent; padding:8px 16px; margin:0; }
                .mvc-settings-label { color:rgba(255,255,255,0.9); white-space:nowrap; font-size:14px; }
                .mvc-settings-value { color:rgba(255,255,255,0.7); font-variant-numeric:tabular-nums; min-width:45px; text-align:right; font-size:14px; }
                .mvc-settings-input { width:60px; background:rgba(255,255,255,.12); border:none; color:white; border-radius:8px; text-align:center; font-size:14px; padding:6px; }
                .mvc-settings-select { background:rgba(255,255,255,.12); border:none; color:white; border-radius:8px; font-size:14px; padding:6px; flex-grow:1; outline:none; }
                .mvc-settings-slider { width:100%; flex-grow:1; accent-color:#34c759; height:4px; border-radius:2px; }
                .mvc-settings-btn { font-size:13px; padding:8px 14px; background:rgba(255,255,255,0.12); color:white; border:none; border-radius:8px; cursor:pointer; white-space:nowrap; transition:background .2s; }
                .mvc-settings-btn:active { background:rgba(255,255,255,0.25); }
                .mvc-mute-btn { padding:6px; background:rgba(255,255,255,0.12); flex-shrink:0; }
                .mvc-settings-section-title { font-size:11px; font-weight:700; color:rgba(235, 235, 245, 0.6); text-transform:uppercase; letter-spacing:0.5px; margin-top:16px; margin-bottom:4px; padding:0 16px; text-align:left; border-top:none; cursor:default; }
            `;
            document.head.appendChild(style);
        }
    }

    new MobileVideoController();

})();