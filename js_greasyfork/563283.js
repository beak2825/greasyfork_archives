// ==UserScript==
// @name         ASMR.one Japanese Subtitles - Bilingual Translation & Study Mode
// @namespace    asmr-learner
// @version      31.0.0
// @description  Japanese language learning for ASMR.one with bilingual subtitles, auto-translation, study mode (blur English), and Yomichan support
// @author       anon
// @license      MIT
// @match        https://asmr.one/*
// @match        https://www.asmr.one/*
// @match        https://asmr-100.com/*
// @match        https://asmr-200.com/*
// @match        https://asmr-300.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      translate.googleapis.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563283/ASMRone%20Japanese%20Subtitles%20-%20Bilingual%20Translation%20%20Study%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/563283/ASMRone%20Japanese%20Subtitles%20-%20Bilingual%20Translation%20%20Study%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const Config = {
        lang: { source: 'auto', primary: 'ja', secondary: 'en' },
    };

    const State = {
        cache: new Map(),
        current: '',
        currentId: '',
        study: GM_getValue('study_v31', true),
        visible: GM_getValue('visible_v31', true),
        audio: null,
        subtitleStart: 0,
        injectedExpanded: false,
        injectedCollapsed: false,
        lyrics: [],
        lyricsAccumulated: [],
    };

    GM_addStyle(`
                        #lyric { opacity: 0 !important; pointer-events: none !important; }
                        #draggable { display: none !important; }
                        
                        .learner-player-wrapper {
                            display: flex;
                            flex-direction: column;
                            flex: 1 1 auto;
                            width: 100%;
                            min-height: 0;
                        }

                        .fixed-bottom-right.audio-player {
                            width: 420px;
                            max-width: 100vw;
                        }
                        
                        .audio-player.q-pa-sm {
                            padding: 16px 20px !important;
                        }
                        

                        
                        .audio-player .text-center.q-mb-sm.column {
                            margin-bottom: 16px !important;
                            padding: 0 8px !important;
                        }
                        
                        .audio-player .row.items-center.q-mx-lg {
                            margin-left: 12px !important;
                            margin-right: 12px !important;
                        }
                        
                        .audio-player .row.flex-center {
                            margin: 12px 0 !important;
                            gap: 4px !important;
                            flex-wrap: nowrap !important;
                            justify-content: center !important;
                        }
                        
                        .audio-player .row.items-center.q-mx-lg.q-pt-sm {
                            margin: 12px !important;
                            padding-top: 8px !important;
                        }
                        
                        @media (max-width: 600px) {
                            .fixed-bottom-right.audio-player {
                                width: 100vw !important;
                                max-width: 100vw !important;
                                right: 0 !important;
                                left: 0 !important;
                                bottom: 0 !important;
                                border-radius: 20px 20px 0 0 !important;
                                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3) !important;
                            }
                            
                            .audio-player.q-pa-sm {
                                padding: 0 12px 10px !important;
                            }
                            

                            
                            .audio-player .text-center.q-mb-sm.column {
                                margin-bottom: 4px !important;
                                padding: 0 12px !important;
                            }
                            
                            .audio-player .row.items-center.q-mx-lg {
                                margin-left: 12px !important;
                                margin-right: 12px !important;
                            }
                            
                            .audio-player .row.flex-center {
                                margin: 4px 0 !important;
                                gap: 4px;
                            }
                            
                            .audio-player .row.items-center.q-mx-lg.q-pt-sm {
                                margin: 4px !important;
                                padding-top: 2px !important;
                            }
                            
                            .learner-subs-expanded {
                                min-height: 80px !important;
                                padding: 8px 16px !important;
                                margin-bottom: 4px !important;
                                margin-top: 0 !important;
                                justify-content: center !important;
                            }
                            
                            .learner-jp {
                                font-size: 1.15rem !important;
                                line-height: 1.4 !important;
                                margin-bottom: 8px !important;
                            }
                            
                            .learner-en {
                                font-size: 0.75rem !important;
                                margin-top: 4px !important;
                                opacity: 0.85;
                            }
                        }
                        
                        @media (min-width: 601px) and (max-width: 900px) {
                            .audio-player.q-pa-sm {
                                padding: 14px 18px !important;
                            }
                            
                            .learner-subs-expanded {
                                min-height: 160px !important;
                            }
                        }
                        
                        @media (min-width: 901px) {
                            .fixed-bottom-right.audio-player {
                                width: 450px !important;
                            }
                            
                            .learner-subs-expanded {
                                min-height: 180px !important;
                            }
                        }
                        
                        .audio-player .row.flex-center,
                        .audio-player .row.q-py-md.self-center {
                            margin: clamp(2px, 0.5vw, 8px) 0 !important;
                            padding: 0 !important;
                            gap: clamp(1px, 0.5vw, 6px) !important;
                            flex-wrap: nowrap !important;
                            justify-content: center !important;
                            width: 100% !important;
                            overflow: visible !important;
                        }

                        .audio-player .row.flex-center .q-btn,
                        .audio-player .row.q-py-md.self-center .q-btn {
                            width: clamp(38px, 11vw, 54px) !important;
                            min-width: 38px !important;
                            height: clamp(44px, 13vw, 56px) !important;
                            min-height: 0 !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            flex: 0 0 auto !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            font-size: 32px !important; /* Normalize Quasar button sizing */
                        }

                        .audio-player .row.flex-center .q-btn[style*="font-size: 30px"],
                        .audio-player .row.q-py-md.self-center .q-btn[style*="font-size: 30px"],
                        .audio-player .row.flex-center .q-btn[style*="font-size: 40px"],
                        .audio-player .row.q-py-md.self-center .q-btn[style*="font-size: 40px"] {
                            width: clamp(52px, 16vw, 72px) !important;
                            min-width: 52px !important;
                            font-size: 32px !important; /* Keep container size uniform */
                        }

                        .audio-player .row.flex-center .q-btn .q-btn__wrapper,
                        .audio-player .row.q-py-md.self-center .q-btn .q-btn__wrapper,
                        .audio-player .row.flex-center .q-btn .q-btn__content,
                        .audio-player .row.q-py-md.self-center .q-btn .q-btn__content {
                            min-height: 0 !important;
                            height: 100% !important;
                            width: 100% !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                        }

                        .audio-player .row.flex-center i,
                        .audio-player .row.q-py-md.self-center i {
                            font-size: clamp(20px, 6vw, 24px) !important;
                            line-height: 1 !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                        }

                        .audio-player .row.flex-center .q-btn[style*="font-size: 30px"] i,
                        .audio-player .row.q-py-md.self-center .q-btn[style*="font-size: 30px"] i,
                        .audio-player .row.flex-center .q-btn[style*="font-size: 40px"] i,
                        .audio-player .row.q-py-md.self-center .q-btn[style*="font-size: 40px"] i {
                            font-size: clamp(30px, 9vw, 38px) !important;
                        }
                        
                        .audio-player .row.self-center {
                margin-top: 2px !important;
                padding: 4px 8px !important;
                display: flex !important;
                flex-wrap: wrap !important;
                justify-content: center !important;
                align-items: center !important;
                gap: 4px 8px !important;
                border-top: 1px solid rgba(128, 128, 128, 0.1);
            }

            /* Override inline button styles on very small screens */
            @media (max-width: 360px) {
                .audio-player .row.self-center .q-btn {
                    font-size: 12px !important;
                    padding: 2px 4px !important;
                    min-width: 24px !important;
                    height: 28px !important;
                }
                .audio-player .row.self-center .q-btn i {
                    font-size: 16px !important;
                }
            }            }
                        
                        .audio-player .learner-controls,
                        .audio-player .native-controls {
                            display: contents !important;
                        }
                        
                        .q-dark .audio-player .learner-controls,
                        .q-dark .audio-player .native-controls,
                        .body--dark .audio-player .learner-controls,
                        .body--dark .audio-player .native-controls {
                            background: none;
                        }
                        
                        .audio-player .learner-divider {
                            width: 1px;
                            height: 18px;
                            background: rgba(128, 128, 128, 0.25);
                            margin: 0 4px;
                        }

                        .audio-player .native-controls > button {
                            margin: 0 !important;
                        }

                        @media (max-width: 380px) {
                            .audio-player .row.self-center:not(.q-py-md) {
                                gap: 8px !important;
                            }
                        }

                        @media (min-width: 500px) {
                            .audio-player .learner-controls,
                            .audio-player .native-controls {
                                flex-shrink: 0;
                            }
                        }
                        
                        .learner-subs-expanded {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            box-sizing: border-box;
                            width: 100%;
                            min-height: 80px;
                            padding: 12px 16px;
                            margin: 4px 0 8px 0;
                            gap: 8px;
                            text-align: center;
                            border-bottom: 1px solid rgba(128, 128, 128, 0.1);
                            opacity: 1;
                            visibility: visible;
                            transition: opacity 0.2s ease-out, visibility 0.2s ease-out;
                        }
                        
                        .learner-subs-expanded.hidden { 
                            display: none !important;
                        }

                        .learner-subs-collapsed {
                            position: fixed;
                            bottom: 60px;
                            left: 0;
                            right: 0;
                            width: 100%;
                            background: rgba(250, 250, 250, 0.95);
                            backdrop-filter: blur(20px);
                            -webkit-backdrop-filter: blur(20px);
                            border-top: 1px solid rgba(0, 0, 0, 0.08);
                            padding: 13px 21px;
                            z-index: 9990;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            box-sizing: border-box;
                            opacity: 1;
                            visibility: visible;
                            transform: translateY(0);
                            transition: opacity 0.25s ease-out, 
                                        visibility 0.25s ease-out,
                                        transform 0.25s ease-out;
                        }

                        .q-dark .learner-subs-collapsed,
                        .body--dark .learner-subs-collapsed {
                            background: rgba(22, 22, 22, 0.95);
                            border-top: 1px solid rgba(255, 255, 255, 0.08);
                        }

                        .learner-subs-collapsed.hidden { 
                            opacity: 0 !important;
                            visibility: hidden !important;
                            transform: translateY(8px) !important;
                            pointer-events: none !important;
                        }

                        .learner-collapsed-inner {
                            width: 100%;
                            max-width: 720px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 8px;
                        }

                        .learner-jp {
                            font-size: 1.5rem;
                            line-height: 1.55;
                            font-weight: 600;
                            color: #111111;
                            user-select: text !important;
                            cursor: text !important;
                            -webkit-user-select: text !important;
                            text-align: center;
                            max-width: 100%;
                            letter-spacing: 0.02em;
                        }
                        
                        .q-dark .learner-jp,
                        .body--dark .learner-jp {
                            color: #ffffff;
                        }

                        .learner-subs-collapsed .learner-jp {
                            font-size: 1.15rem;
                        }

                        .learner-en {
                            font-size: 0.8125rem;
                            line-height: 1.5;
                            color: rgba(33, 33, 33, 0.6);
                            cursor: pointer;
                            text-align: center;
                            max-width: 100%;
                            transition: opacity 0.2s ease;
                        }

                        .q-dark .learner-en,
                        .body--dark .learner-en {
                            color: rgba(245, 245, 245, 0.55);
                        }

                        .learner-study {
                            isolation: isolate;
                        }
                        
                        .learner-study .learner-jp {
                            position: relative;
                            z-index: 2;
                            pointer-events: auto !important;
                            user-select: text !important;
                            -webkit-user-select: text !important;
                        }
                        
                        .learner-study .learner-en {
                            filter: blur(4px);
                            opacity: 0.15;
                            position: relative;
                            z-index: 1;
                        }
                        
                        .learner-study .learner-en:hover,
                        .learner-study.revealed .learner-en {
                            filter: blur(0);
                            opacity: 1;
                        }

                        .learner-controls, .learner-collapsed-controls {
                            display: inline-flex !important;
                            align-items: center !important;
                            gap: 2px;
                        }
                        
                        .learner-btn-active { 
                            color: #7c4dff !important;
                        }
                        
                        .learner-btn-normal { 
                            color: rgba(33, 33, 33, 0.7) !important;
                            transition: color 0.15s ease;
                        }
                        
                        .learner-btn-normal:hover {
                            color: rgba(33, 33, 33, 1) !important;
                        }
                        
                        .q-dark .learner-btn-normal, 
                        .body--dark .learner-btn-normal { 
                            color: rgba(245, 245, 245, 0.7) !important;
                        }
                        
                        .q-dark .learner-btn-normal:hover,
                        .body--dark .learner-btn-normal:hover {
                            color: rgba(245, 245, 245, 1) !important;
                        }

                        .learner-divider {
                            width: 1px;
                            height: 16px;
                            background: rgba(33, 33, 33, 0.12);
                            margin: 0 8px;
                        }
                        
                        .q-dark .learner-divider, 
                        .body--dark .learner-divider {
                            background: rgba(245, 245, 245, 0.15);
                        }

                        .learner-collapsed-controls {
                            margin-top: 8px;
                        }
                    `);

    const translate = (text, lang) => new Promise(resolve => {
        if (!text) return resolve('');
        const key = `${text}→${lang}`;
        if (State.cache.has(key)) return resolve(State.cache.get(key));

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${Config.lang.source}&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`,
            onload: r => {
                try {
                    const res = JSON.parse(r.responseText)?.[0]?.map(x => x?.[0] || '').join('') || text;
                    State.cache.set(key, res);
                    resolve(res);
                } catch { resolve(text); }
            },
            onerror: () => resolve(text)
        });
    });

    const createBtn = (icon, title, onClick, isActive = false, size = 'normal') => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.title = title;
        btn.className = `q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--wrap q-btn--dense ${isActive ? 'learner-btn-active' : 'learner-btn-normal'}`;

        const fontSize = size === 'small' ? '12px' : '14px';
        btn.style.cssText = `font-size: ${fontSize}; padding: 4px 8px; min-width: 32px;`;

        btn.innerHTML = `
                            <span class="q-focus-helper"></span>
                            <span class="q-btn__wrapper col row q-anchor--skip">
                                <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                                    <i aria-hidden="true" role="img" class="q-icon notranslate material-icons">${icon}</i>
                                </span>
                            </span>
                        `;
        btn.onclick = (e) => {
            onClick(e);
            btn.blur();
        };
        return btn;
    };

    const createDivider = () => {
        const div = document.createElement('span');
        div.className = 'learner-divider';
        return div;
    };

    const UI = {
        expandedContainer: null,
        collapsedContainer: null,
        jpElements: [],
        enElements: [],
        toggleBtns: [],
        studyBtns: [],

        bindKeys() {
            window.addEventListener('keydown', (e) => {
                if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

                const key = e.key.toLowerCase();
                if (key === 'a') {
                    e.preventDefault();
                    this.seekToLine(-1);
                } else if (key === 'd') {
                    e.preventDefault();
                    this.seekToLine(1);
                }
            });
        },

        detectTrackChange() {
            const track = document.querySelector('.audio-player .ellipsis-2-lines.text-bold, .player-bar .q-item__label');
            const trackId = track?.textContent?.trim() || '';

            if (trackId && trackId !== State.currentId) {
                State.currentId = trackId;
                State.lyrics = [];
                State.lyricsAccumulated = [];
                this.fetchLyrics();
            }
        },

        injectExpanded(player) {
            if (State.injectedExpanded) return;
            State.injectedExpanded = true;

            const wrapper = document.createElement('div');
            wrapper.className = 'learner-player-wrapper';

            // Move everything into wrapper, keeping pull-handler at root if it exists
            const children = Array.from(player.childNodes);
            children.forEach(child => {
                if (child.classList && child.classList.contains('pull-handler')) return;
                wrapper.appendChild(child);
            });
            player.appendChild(wrapper);

            const container = document.createElement('div');
            container.className = `learner-subs-expanded ${State.study ? 'learner-study' : ''} ${State.visible ? '' : 'hidden'}`;

            const jp = document.createElement('div');
            jp.className = 'learner-jp';
            jp.textContent = '...';

            const en = document.createElement('div');
            en.className = 'learner-en';
            en.textContent = '';
            en.onclick = () => container.classList.toggle('revealed');

            container.append(jp, en);
            this.expandedContainer = container;
            this.jpElements.push(jp);
            this.enElements.push(en);

            const albumArt = wrapper.querySelector('.albumart');
            if (albumArt) albumArt.after(container);
            else wrapper.prepend(container);

            const utilityRow = wrapper.querySelector('.row.self-center:not(.q-py-md)');
            if (utilityRow) {
                const nativeControls = document.createElement('div');
                nativeControls.className = 'native-controls';

                while (utilityRow.firstChild) {
                    nativeControls.appendChild(utilityRow.firstChild);
                }

                const learnerControls = this.createControlButtons();
                utilityRow.append(learnerControls, nativeControls);
            }
        },

        injectCollapsed(barContainer) {
            if (State.injectedCollapsed) return;
            State.injectedCollapsed = true;

            const container = document.createElement('div');
            container.className = `learner-subs-collapsed ${State.study ? 'learner-study' : ''} ${State.visible ? '' : 'hidden'}`;

            const inner = document.createElement('div');
            inner.className = 'learner-collapsed-inner';

            const jp = document.createElement('div');
            jp.className = 'learner-jp';
            jp.textContent = '...';

            const en = document.createElement('div');
            en.className = 'learner-en';
            en.textContent = '';
            en.onclick = () => container.classList.toggle('revealed');

            inner.append(jp, en);
            container.append(inner);

            this.collapsedContainer = container;
            this.jpElements.push(jp);
            this.enElements.push(en);

            barContainer.parentNode.insertBefore(container, barContainer);

            const playerBar = barContainer.querySelector('.player-bar');
            if (playerBar) {
                const controlsRow = document.createElement('div');
                controlsRow.className = 'learner-collapsed-controls';
                controlsRow.style.marginLeft = 'auto';

                const prevBtn = createBtn('chevron_left', 'Previous (A)', () => this.seekToLine(-1), false, 'small');
                const nextBtn = createBtn('chevron_right', 'Next (D)', () => this.seekToLine(1), false, 'small');

                const toggleBtn = createBtn('translate', 'Toggle', () => {
                    State.visible = !State.visible;
                    GM_setValue('visible_v31', State.visible);
                    this.updateVisibility();
                }, State.visible, 'small');
                this.toggleBtns.push(toggleBtn);

                const studyBtn = createBtn('psychology', 'Study', () => {
                    State.study = !State.study;
                    GM_setValue('study_v31', State.study);
                    this.updateStudyMode();
                }, State.study, 'small');
                this.studyBtns.push(studyBtn);

                controlsRow.append(prevBtn, nextBtn, createDivider(), toggleBtn, studyBtn);
                playerBar.appendChild(controlsRow);
            }
        },

        createControlButtons() {
            const controls = document.createElement('div');
            controls.className = 'learner-controls';

            const prevBtn = createBtn('chevron_left', 'Previous Line (A)', () => this.seekToLine(-1));
            const nextBtn = createBtn('chevron_right', 'Next Line (D)', () => this.seekToLine(1));

            const toggleBtn = createBtn('translate', 'Toggle Subs', () => {
                State.visible = !State.visible;
                GM_setValue('visible_v31', State.visible);
                this.updateVisibility();
            }, State.visible);
            this.toggleBtns.push(toggleBtn);

            const studyBtn = createBtn('psychology', 'Study Mode', () => {
                State.study = !State.study;
                GM_setValue('study_v31', State.study);
                this.updateStudyMode();
            }, State.study);
            this.studyBtns.push(studyBtn);

            controls.append(prevBtn, nextBtn, createDivider(), toggleBtn, studyBtn);
            return controls;
        },

        seekToLine(offset) {
            if (!State.audio) return;

            if (State.lyrics.length === 0) {
                this.fetchLyrics();
                if (offset === 0 && State.subtitleStart > 0) {
                    State.audio.currentTime = Math.max(0, State.subtitleStart - 0.1);
                    State.audio.play();
                }
                return;
            }

            const now = State.audio.currentTime;
            const lyrics = State.lyrics;

            let currentIdx = -1;
            for (let i = 0; i < lyrics.length; i++) {
                const start = lyrics[i].start;
                const nextStart = lyrics[i + 1]?.start ?? Infinity;
                if (now >= start && now < nextStart) {
                    currentIdx = i;
                    break;
                }
            }

            if (currentIdx === -1 && lyrics.length > 0) {
                currentIdx = now < lyrics[0].start ? -1 : lyrics.length - 1;
            }

            if (offset === 0) {
                const target = lyrics[Math.max(0, currentIdx)];
                if (target) {
                    State.audio.currentTime = Math.max(0, target.start - 0.05);
                    State.audio.play();
                }
            } else {
                const targetIdx = currentIdx + offset;
                if (targetIdx >= 0 && targetIdx < lyrics.length) {
                    State.audio.currentTime = Math.max(0, lyrics[targetIdx].start + 0.01);
                    State.audio.play();
                } else if (targetIdx < 0) {
                    State.audio.currentTime = 0;
                    State.audio.play();
                }
            }
        },

        fetchLyrics() {
            const findInVue = (el) => {
                if (!el?.__vue__) return null;
                const v = el.__vue__;
                if (v.lyrics?.length) return v.lyrics;
                if (v.lrcLines?.length) return v.lrcLines;
                const store = v.$store?.state?.AudioPlayer;
                if (store?.lrcLines?.length) return store.lrcLines;
                return store?.queue?.[store.currentIndex]?.lyrics || null;
            };

            for (const sel of ['#lyric', '.audio-player', '.player-bar-container', '.q-footer']) {
                const l = findInVue(document.querySelector(sel));
                if (l?.length) {
                    State.lyrics = l.map(line => ({
                        start: typeof line.time === 'number' ? line.time / 1000 : parseFloat(line.time || line.start || 0),
                        text: line.text || line.content || ''
                    }));
                    return true;
                }
            }

            if (State.lyricsAccumulated.length > 0) {
                State.lyrics = [...State.lyricsAccumulated];
                return true;
            }
            return false;
        },

        accumulateLyric(text, time) {
            if (!text || text === '...') return;
            if (!State.lyricsAccumulated.some(l => Math.abs(l.start - time) < 0.5 || l.text === text)) {
                State.lyricsAccumulated.push({ start: time, text });
                State.lyricsAccumulated.sort((a, b) => a.start - b.start);
            }
        },

        updateVisibility() {
            this.toggleBtns.forEach(btn => {
                btn.classList.toggle('learner-btn-active', State.visible);
                btn.classList.toggle('learner-btn-normal', !State.visible);
            });
            this.refreshDisplayStates();
        },

        updateStudyMode() {
            this.studyBtns.forEach(btn => {
                btn.classList.toggle('learner-btn-active', State.study);
                btn.classList.toggle('learner-btn-normal', !State.study);
            });
            this.expandedContainer?.classList.toggle('learner-study', State.study);
            this.collapsedContainer?.classList.toggle('learner-study', State.study);
        },

        refreshDisplayStates() {
            const expandedPlayer = document.querySelector('.audio-player');
            const playerBarContainer = document.querySelector('.player-bar-container');

            const playerBarVisible = playerBarContainer &&
                window.getComputedStyle(playerBarContainer).display !== 'none';

            const hasPullHandler = expandedPlayer?.querySelector('.pull-handler');
            const playerHeight = expandedPlayer?.getBoundingClientRect().height || 0;
            const playerVisible = expandedPlayer &&
                window.getComputedStyle(expandedPlayer).display !== 'none' &&
                window.getComputedStyle(expandedPlayer).visibility !== 'hidden';
            const expandedActive = expandedPlayer &&
                hasPullHandler &&
                playerVisible &&
                playerHeight > 200;

            if (this.expandedContainer) {
                this.expandedContainer.classList.toggle('hidden', !State.visible || !expandedActive);
            }

            if (this.collapsedContainer) {
                this.collapsedContainer.classList.toggle('hidden', !State.visible || !playerBarVisible || expandedActive);
            }
        },

        async update(text) {
            this.refreshDisplayStates();
            this.detectTrackChange();

            if (!text) {
                this.jpElements.forEach(el => el.textContent = '...');
                this.enElements.forEach(el => el.textContent = '');
                return;
            }

            if (text === State.current) return;
            State.current = text;

            const now = State.audio?.currentTime || 0;
            State.subtitleStart = now;
            this.accumulateLyric(text, now);

            this.expandedContainer?.classList.remove('revealed');
            this.collapsedContainer?.classList.remove('revealed');

            const [jp, en] = await Promise.all([
                translate(text, Config.lang.primary),
                translate(text, Config.lang.secondary)
            ]);

            if (text === State.current) {
                this.jpElements.forEach(el => el.textContent = jp);
                this.enElements.forEach(el => el.textContent = en);
            }
        }
    };

    const init = () => {
        UI.bindKeys();

        setInterval(() => {
            const expanded = document.querySelector('.audio-player');
            if (expanded && !State.injectedExpanded) UI.injectExpanded(expanded);

            const collapsed = document.querySelector('.player-bar-container');
            if (collapsed && !State.injectedCollapsed) UI.injectCollapsed(collapsed);

            const audio = document.querySelector('audio');
            if (audio) State.audio = audio;

            const lyric = document.querySelector('#lyric');
            if (lyric && !lyric.dataset.monitored) {
                lyric.dataset.monitored = "true";
                UI.update(lyric.textContent?.trim());
                new MutationObserver(() => UI.update(lyric.textContent?.trim()))
                    .observe(lyric, { childList: true, characterData: true, subtree: true });
            }

            UI.refreshDisplayStates();
        }, 800);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
