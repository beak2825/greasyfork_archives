// ==UserScript==
// @name ASMR.one Ultimate (Radio + Learner)
// @name:zh-CN ASMR.one 终极增强 (电台 + 学习模式)
// @namespace http://tampermonkey.net/
// @version 119
// @description The ultimate enhancement suite for ASMR.one. Features: Radio Mode (Continuous random playback, smart navigation, shuffling) and Learner Mode (Bilingual subtitles, auto-translation, study mode).
// @description:zh-CN ASMR.one 的终极增强套件。功能：电台模式（连续随机播放、智能导航、混洗）和学习模式（双语字幕、自动翻译、学习/模糊模式）。
// @author Henry
// @match https://asmr.one/*
// @match https://www.asmr.one/*
// @match https://asmr-100.com/*
// @match https://asmr-200.com/*
// @match https://asmr-300.com/*
// @connect translate.googleapis.com
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant unsafeWindow
// @run-at document-idle
// @license MIT
// @icon https://images2.imgbox.com/c8/21/h1DhlGPW_o.png
// @downloadURL https://update.greasyfork.org/scripts/563283/ASMRone%20Ultimate%20%28Radio%20%2B%20Learner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563283/ASMRone%20Ultimate%20%28Radio%20%2B%20Learner%29.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const I18n = {
        lang: navigator.language.startsWith('zh') ? 'zh' : 'en',
        data: {
            en: {
                radioMode: 'Radio Mode',
                off: 'OFF',
                on: 'ON',
                radioSettings: 'Radio settings',
                playAll: 'Play All Tracks',
                playAllSub: 'Don\'t skip work until folder finishes',
                shuffle: 'Shuffle',
                shuffleSub: 'Randomize playback order',
                prefFormat: 'Preferred Format',
                prefFormatSub: 'e.g. wav, mp3',
                sePref: 'SE Preference',
                sePrefSub: 'Prefer folders with sound effects',
                targetLang: 'Target Language',
                targetLangSub: 'Language code for secondary subtitles (e.g. en, es, fr)',
                liveCaptionTitle: 'Pro Tip: Live Caption',
                liveCaptionMsg: 'If CN→JP translation is inaccurate, try enabling system Live Caption!',
                prevLine: 'Previous Line',
                nextLine: 'Next Line',
                toggleJP: 'Toggle Japanese'
            },
            zh: {
                radioMode: '电台模式',
                off: '关闭',
                on: '开启',
                radioSettings: '电台设置',
                playAll: '播放文件夹内所有曲目',
                playAllSub: '直到播放完所有曲目才跳转',
                shuffle: '随机播放',
                shuffleSub: '打乱播放顺序',
                prefFormat: '偏好格式',
                prefFormatSub: '例如 wav, mp3',
                sePref: 'SE 偏好',
                sePrefSub: '优先进入包含音效 (SE) 的目录',
                targetLang: '目标语言',
                targetLangSub: '副字幕的语言代码 (如 en, es)',
                liveCaptionTitle: '小贴士: 实时字幕',
                liveCaptionMsg: '如果中转日翻译不准确，建议使用系统实时字幕功能！',
                prevLine: '上一句',
                nextLine: '下一句',
                toggleJP: '切换日语显示'
            }
        },
        t(key) {
            return this.data[this.lang][key] || this.data['en'][key] || key;
        }
    };
    const CSS = `
        #lyric { opacity: 0 !important; pointer-events: none !important; }
        #draggable, #lyricsBar { display: none !important; }
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
            transition: opacity 0.2s;
        }
        .learner-subs-expanded.hidden { display: none !important; }
        .learner-subs-collapsed {
            position: fixed;
            bottom: 60px;
            left: 0;
            right: 0;
            width: 100%;
            background: rgba(250, 250, 250, 0.95);
            backdrop-filter: blur(20px);
            border-top: 1px solid rgba(0, 0, 0, 0.08);
            padding: 13px 21px;
            z-index: 9990;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: opacity 0.25s, transform 0.25s;
        }
        .q-dark .learner-subs-collapsed, .body--dark .learner-subs-collapsed {
            background: rgba(22, 22, 22, 0.95);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .learner-subs-collapsed.hidden {
            opacity: 0 !important;
            pointer-events: none !important;
            transform: translateY(8px) !important;
        }
        .learner-jp {
            font-size: 1.5rem;
            line-height: 1.55;
            font-weight: 600;
            color: #111;
            text-align: center;
            transition: opacity 0.2s;
        }
        .q-dark .learner-jp, .body--dark .learner-jp { color: #fff; }
        .learner-subs-collapsed .learner-jp { font-size: 1.15rem; }
        .hide-jp .learner-jp { opacity: 0; height: 0; overflow: hidden; margin: 0; }
        .learner-en {
            font-size: 0.8125rem;
            color: rgba(33, 33, 33, 0.6);
            cursor: pointer;
            text-align: center;
            user-select: none;
            transition: filter 0.2s, opacity 0.2s;
        }
        .q-dark .learner-en, .body--dark .learner-en { color: rgba(245, 245, 245, 0.55); }
        .learner-en.blurred { filter: blur(5px); opacity: 0.3; }
        .learner-controls, .learner-collapsed-controls {
            display: inline-flex !important;
            align-items: center !important;
            gap: 2px;
        }
        .learner-btn-active { color: #7c4dff !important; }
        .learner-btn-normal { color: rgba(128, 128, 128, 0.7) !important; }
        .learner-btn-normal:hover { color: inherit !important; }
    `;
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(CSS);
    } else {
        const style = document.createElement('style');
        style.textContent = CSS;
        document.head.append(style);
    }
    const Config = {
        defaults: {
            playAllInFolder: false,
            shuffle: false,
            autoFilterFolders: true,
            preferredFormat: 'wav > mp3 > flac > opus > m4a > aac',
            sePreference: true,
            showJP: true,
            subtitleLang: 'en',
        },
        get(key) { return GM_getValue(key, this.defaults[key]); },
        set(key, val) { GM_setValue(key, val); },
        getAll() {
            const res = {};
            for (const key in this.defaults) res[key] = this.get(key);
            return res;
        }
    };
    const Logger = {
        prefix: '[ASMR Ultimate]',
        log: (...args) => console.log(Logger.prefix, ...args),
        error: (...args) => console.error(Logger.prefix, ...args)
    };
    const SafeUtils = {
        waitFor(predicate, timeoutMs = 10000, intervalMs = 200) {
            return new Promise(resolve => {
                if (predicate()) {
                    resolve(true);
                    return;
                }
                const start = Date.now();
                const timer = setInterval(() => {
                    if (predicate()) {
                        clearInterval(timer);
                        resolve(true);
                    } else if (Date.now() - start > timeoutMs) {
                        clearInterval(timer);
                        resolve(false);
                    }
                }, intervalMs);
            });
        },
        async waitForElement(selector, timeoutMs = 10000) {
            const found = await this.waitFor(() => document.querySelector(selector), timeoutMs);
            return found ? document.querySelector(selector) : null;
        },
        async getVue() {
            await this.waitFor(() => {
                const app = document.querySelector('#q-app');
                return app && app.__vue__ && app.__vue__.$store && app.__vue__.$router;
            });
            return document.querySelector('#q-app').__vue__;
        }
    };
    const VueUtils = {
        getApp: () => document.querySelector('#q-app')?.__vue__ || null,
        findComponent(root, predicate) {
            if (!root) return null;
            const queue = [root];
            const visited = new Set();
            while (queue.length) {
                const vm = queue.shift();
                if (visited.has(vm)) continue;
                visited.add(vm);
                if (predicate(vm)) return vm;
                if (vm.$children) queue.push(...vm.$children);
            }
            return null;
        }
    };
    const TranslationService = {
        cache: new Map(),
        queue: new Map(),
        async translate(text, targetLang = 'en') {
            if (!text) return '';
            const key = `${text}|${targetLang}`;
            if (this.cache.has(key)) return this.cache.get(key);
            if (this.queue.has(key)) return this.queue.get(key);
            const promise = new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`,
                    onload: (res) => {
                        try {
                            const result = JSON.parse(res.responseText)?.[0]?.map(x => x?.[0] || '').join('') || text;
                            this.cache.set(key, result);
                            resolve(result);
                        } catch { resolve(text); }
                    },
                    onerror: () => resolve(text)
                });
            });
            this.queue.set(key, promise);
            const result = await promise;
            this.queue.delete(key);
            return result;
        }
    };
    const SubtitleManager = {
        lyrics: [],
        currentText: '',
        async updateDisplay(text) {
            if (text === this.currentText) return;
            this.currentText = text;
            const lyricsBar = document.getElementById('lyricsBar');
            const isAppSubsOn = lyricsBar || (document.querySelector('.q-footer') && text);
            if (!isAppSubsOn) return;
            const config = Config.getAll();
            const hasKana = /[\u3040-\u309f\u30a0-\u30ff]/.test(text);
            const hasCJK = /[\u4e00-\u9fff]/.test(text);
            const isSourceCN = hasCJK && !hasKana;
            let primary = text;
            if (isSourceCN) primary = await TranslationService.translate(text, 'ja');
            const targetLang = config.subtitleLang.toLowerCase();
            let secondary = "";
            if (isSourceCN && targetLang.startsWith('zh')) secondary = text;
            else if (!isSourceCN && targetLang === 'ja') secondary = text;
            else secondary = await TranslationService.translate(text, targetLang);
            LearnerUI.renderSubtitle(primary, secondary);
        },
        pollForLyrics() {
            const find = (sel) => {
                const el = document.querySelector(sel);
                if (!el?.__vue__) return null;
                const vm = el.__vue__;
                return vm.lyrics || vm.lrcLines || vm.$store?.state?.AudioPlayer?.lrcLines || null;
            };
            const data = find('#lyric') || find('.audio-player') || find('.q-footer');
            if (data?.length) {
                this.lyrics = data.map(l => ({
                    time: typeof l.time === 'number' ? l.time / 1000 : parseFloat(l.time || l.start || 0),
                    text: l.text || l.content || ''
                }));
            } else {
                this.lyrics = [];
            }
            LearnerUI.updateVisibility(this.lyrics.length > 0);
        },
        seek(offset) {
            const audio = document.querySelector('audio');
            if (!audio || !this.lyrics.length) return;
            const now = audio.currentTime;
            let idx = this.lyrics.findIndex(l => l.time > now) - 1;
            if (idx === -2) idx = this.lyrics.length - 1;
            const targetIdx = Math.max(0, Math.min(this.lyrics.length - 1, idx + offset));
            const target = this.lyrics[targetIdx];
            if (target) {
                audio.currentTime = target.time + 0.01;
                audio.play();
            }
        }
    };
    const LearnerUI = {
        expanded: null,
        collapsed: null,
        hasSubs: false,
        init() {
            setInterval(() => {
                const player = document.querySelector('.audio-player');
                if (player && !this.expanded) this.injectExpanded(player);
                const bar = document.querySelector('.player-bar-container');
                if (bar && !this.collapsed) this.injectCollapsed(bar);
            }, 1000);
            setInterval(() => {
                SubtitleManager.pollForLyrics();
                const lyricEl = document.getElementById('lyric');
                if (lyricEl && lyricEl.textContent) {
                    SubtitleManager.updateDisplay(lyricEl.textContent.trim());
                }
            }, 500);
        },
        updateVisibility(hasSubs) {
            this.hasSubs = hasSubs;
            const display = hasSubs ? '' : 'none';
            if (this.expanded) this.expanded.style.display = display;
            if (this.collapsed) this.collapsed.style.display = display;
            if (hasSubs) this.updateStyle();
        },
        injectExpanded(player) {
            const container = document.createElement('div');
            container.className = 'learner-subs-expanded';
            container.innerHTML = `<div class="learner-jp">...</div><div class="learner-en"></div>`;
            container.querySelector('.learner-en').onclick = function () { this.classList.toggle('blurred'); };
            const albumArt = player.querySelector('.albumart');
            if (albumArt) albumArt.after(container); else player.prepend(container);
            this.expanded = container;
            const controlsRow = player.querySelector('.row.self-center:not(.q-py-md)');
            if (controlsRow) {
                const myControls = this.createControls();
                controlsRow.insertBefore(myControls, controlsRow.firstChild);
            }
        },
        injectCollapsed(bar) {
            const container = document.createElement('div');
            container.className = 'learner-subs-collapsed hidden';
            container.innerHTML = `<div class="learner-jp">...</div><div class="learner-en"></div>`;
            container.querySelector('.learner-en').onclick = function () { this.classList.toggle('blurred'); };
            bar.parentElement.insertBefore(container, bar);
            this.collapsed = container;
            const barControls = document.createElement('div');
            barControls.className = 'learner-collapsed-controls';
            barControls.style.marginLeft = 'auto';
            barControls.appendChild(this.createControls(true));
            const existingBar = bar.querySelector('.player-bar');
            if (existingBar) existingBar.appendChild(barControls);
        },
        createControls(isSmall = false) {
            const div = document.createElement('div');
            div.className = 'learner-controls';
            const btn = (icon, title, fn, isActive = false) => {
                const b = document.createElement('button');
                b.className = `q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle learner-btn-normal ${isActive ? 'learner-btn-active' : ''}`;
                b.style.padding = isSmall ? '2px' : '4px';
                b.style.minWidth = '30px';
                b.innerHTML = `<i class="q-icon material-icons" style="font-size: ${isSmall ? '16px' : '20px'}">${icon}</i>`;
                b.title = title;
                b.onclick = (e) => { e.stopPropagation(); fn(b); };
                return b;
            };
            div.append(
                btn('chevron_left', I18n.t('prevLine'), () => SubtitleManager.seek(-1)),
                btn('chevron_right', I18n.t('nextLine'), () => SubtitleManager.seek(1)),
                btn('psychology', I18n.t('toggleJP'), (b) => {
                    const current = Config.get('showJP');
                    Config.set('showJP', !current);
                    this.updateStyle();
                }, Config.get('showJP'))
            );
            return div;
        },
        renderSubtitle(jp, en) {
            document.querySelectorAll('.learner-jp').forEach(e => e.textContent = jp);
            document.querySelectorAll('.learner-en').forEach(e => {
                e.textContent = en;
                e.classList.remove('blurred');
            });
            this.updateStyle();
        },
        updateStyle() {
            if (!this.hasSubs) return;
            const showJP = Config.get('showJP');
            [this.expanded, this.collapsed].filter(Boolean).forEach(c => {
                if (showJP) c.classList.remove('hide-jp'); else c.classList.add('hide-jp');
            });
            const expandedPlayer = document.querySelector('.audio-player');
            const isExpanded = expandedPlayer && window.getComputedStyle(expandedPlayer).display !== 'none';
            if (this.collapsed) {
                if (!isExpanded) this.collapsed.classList.remove('hidden'); else this.collapsed.classList.add('hidden');
            }
            document.querySelectorAll('.learner-controls button i').forEach(i => {
                if (i.textContent === 'psychology') i.parentElement.parentElement.classList.toggle('learner-btn-active', showJP);
            });
        }
    };
    const DurationParser = {
        parse(caption) {
            if (!caption) return 0;
            const str = caption.toLowerCase();
            let seconds = 0;
            const mult = { 'hr': 3600, 'min': 60, 's': 1 };
            for (const [u, m] of Object.entries(mult)) {
                if (str.includes(u)) {
                    const match = str.match(new RegExp(`([\\d\\.]+)\\s*${u}`));
                    if (match) seconds += parseFloat(match[1]) * m;
                }
            }
            return seconds;
        }
    };
    const SmartSelector = {
        regexSample: /サンプル|Sample|Trial|Preview|体验版/i,
        formatPriority: ['wav', 'mp3', 'flac', 'opus', 'm4a', 'aac'],
        calcScore(name, count, caption, isSample) {
            let score = 0;
            const lowerName = (name || "").toLowerCase();
            // 1. Durations & Counts (Preference to density)
            const duration = DurationParser.parse(caption);
            if (duration > 0) score += (duration / 60) * 10;
            score += (count || 0) * 5;
            // 2. Penalize Samples & Metadata
            if (isSample || this.regexSample.test(name)) score -= 1000000;
            if (lowerName.includes('封面') || lowerName.includes('cover') || lowerName.includes('illust')) score -= 500000;
            if (lowerName.includes('script') || lowerName.includes('台本') || lowerName.includes('剧本')) score -= 300000;
            // 3. SE Preference
            const isSE = /SE|Sound Effect|音效/i.test(name);
            if (isSE) {
                if (Config.get('sePreference')) score += 2000000;
                else score += 1000;
            }
            // 4. Tiered Format Priority
            const userPrefStr = (Config.get('preferredFormat') || '').toLowerCase();
            const prefs = userPrefStr.split(/>|,/).map(s => s.trim()).filter(Boolean);
            const priorities = [...prefs, ...this.formatPriority];
            const uniquePriorities = [...new Set(priorities)];
            for (let i = 0; i < uniquePriorities.length; i++) {
                if (lowerName.includes(uniquePriorities[i])) {
                    score += (uniquePriorities.length - i) * 100000;
                    break;
                }
            }
            return score;
        },
        selectBestFolder(dirs) {
            if (!dirs?.length) return null;
            const candidates = dirs.map(dir => {
                const name = dir.name || dir.title || "";
                const count = dir.children_count || dir.tracks?.length || 0;
                const caption = dir.caption || dir.duration_text || "";
                return { original: dir, _score: this.calcScore(name, count, caption, false) };
            });
            candidates.sort((a, b) => b._score - a._score);
            return candidates[0]?._score > -400000 ? candidates[0]?.original?.name : null;
        }
    };
    const WorkFlattener = {
        collectTracks(folder) {
            const tracks = [];
            const queue = [folder];
            while (queue.length) {
                const curr = queue.shift();
                if (curr.tracks) tracks.push(...curr.tracks);
                if (curr.dirs) queue.push(...curr.dirs);
                if (curr.children) queue.push(...curr.children);
            }
            return tracks;
        },
        tryFlatten(vm) {
            const root = vm.work || vm;
            if (!root) return false;
            const allTracks = this.collectTracks(root);
            if (allTracks.length === 0) return false;
            if (!vm.tracks || vm.tracks.length === 0) {
                Logger.log(`[Flatten] Surfacing ${allTracks.length} tracks from depth.`);
                vm.tracks = allTracks;
                vm.dirs = [];
                return true;
            }
            return false;
        }
    };
    const RadioManager = {
        state: {
            isActive: false,
            isSkipping: false,
            idleCounter: 0,
            lastWorkId: null,
            lastTrackSrc: null
        },
        app: null,
        intervalId: null,
        playbackTimer: null,
        async init() {
            this.app = await SafeUtils.getVue();
            FolderDiver.init(this.app);
            UIManager.init(this.app);
            LearnerUI.init();
        },
        toggle() {
            this.state.isActive = !this.state.isActive;
            this.state.isActive ? this.start() : this.stop();
        },
        start() {
            UIManager.updateRadioStatus(true);
            this.state.idleCounter = 0;
            this.state.lastWorkId = null;
            this.state.lastTrackSrc = null;
            const player = this.app.$store.state.AudioPlayer;
            const isFinished = (player.duration > 0 && (player.duration - player.currentTime < 1.0));
            this.intervalId = setInterval(() => this.tick(), 1000);
            if (!player.playing || isFinished) {
                Logger.log("Radio started: Initial jump triggered immediately.");
                this.skipToNextWork();
            } else {
                this.tick();
            }
        },
        stop() {
            UIManager.updateRadioStatus(false);
            if (this.intervalId) clearInterval(this.intervalId);
            if (this.playbackTimer) clearInterval(this.playbackTimer);
            this.state.isActive = false;
        },
        async tick() {
            if (!this.state.isActive || this.state.isSkipping) return;
            const player = this.app.$store.state.AudioPlayer;
            if (this.hasDrifted(player)) {
                Logger.log('Drift detected: Track changed within same work. Forcing skip.');
                await this.skipToNextWork();
                return;
            }
            this.updateTracking(player);
            if (player.playing) {
                this.state.idleCounter = 0;
                if (this.shouldSkipNow(player)) {
                    Logger.log('Track nearing end. Skipping to next work.');
                    await this.skipToNextWork();
                }
            } else {
                this.handleIdle(player);
            }
        },
        hasDrifted(player) {
            if (Config.get('playAllInFolder')) return false;
            const currentWorkId = this.app.$route.params.id;
            const currentSrc = player.src || player.currentSrc;
            if (this.state.lastWorkId &&
                this.state.lastWorkId === currentWorkId &&
                this.state.lastTrackSrc &&
                this.state.lastTrackSrc !== currentSrc) {
                return true;
            }
            return false;
        },
        updateTracking(player) {
            this.state.lastWorkId = this.app.$route.params.id;
            this.state.lastTrackSrc = player.src || player.currentSrc;
        },
        shouldSkipNow(player) {
            if (Config.get('playAllInFolder')) return false;
            const remaining = player.duration - player.currentTime;
            return (player.duration > 0 && remaining < 1.5);
        },
        async handleIdle(player) {
            const remaining = player.duration - player.currentTime;
            const isPausedInMiddle = (player.currentTime > 1.0 && remaining > 1.0);
            if (isPausedInMiddle) {
                this.state.idleCounter = 0;
                return;
            }
            this.state.idleCounter++;
            const threshold = (player.currentTime < 0.5) ? 15 : 3;
            if (this.state.idleCounter > threshold) {
                Logger.log(`Idle timeout (${this.state.idleCounter}s). Skipping...`);
                await this.skipToNextWork();
            }
        },
        async skipToNextWork() {
            if (this.state.isSkipping) return;
            this.state.isSkipping = true;
            try {
                const res = await this.app.$axios.get('/api/works', { params: { order: 'betterRandom' } });
                const work = res.data.works[0];
                if (work) {
                    Logger.log(`Navigating to: ${work.title} (ID: ${work.id})`);
                    this.state.lastWorkId = null;
                    this.state.lastTrackSrc = null;
                    await this.app.$router.push(`/work/${work.id}`);
                    this.state.idleCounter = 0;
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    this.ensurePlayback(work.id);
                } else {
                    Logger.error("API returned no works.");
                    this.state.isSkipping = false;
                }
            } catch (e) {
                Logger.error("Skip error:", e);
                this.state.isSkipping = false;
            }
        },
        ensurePlayback(targetWorkId) {
            let attempts = 0;
            const maxAttempts = 15;
            if (this.playbackTimer) clearInterval(this.playbackTimer);
            this.playbackTimer = setInterval(async () => {
                attempts++;
                const playerState = this.app.$store.state.AudioPlayer;
                const currentWorkId = playerState.work ? playerState.work.id : null;
                const isMatchingWork = targetWorkId && currentWorkId == targetWorkId;
                const isPlaying = playerState.playing;
                const container = await SafeUtils.waitForElement('.q-page-container', 1000);
                const hasPauseButton = container && Array.from(container.querySelectorAll('button'))
                    .some(b => b.textContent.includes('pause'));
                const fileItems = document.querySelectorAll('.file-list-item, .q-item');
                Logger.log(`[Playback Check ${attempts}] MatchingID: ${isMatchingWork}, Playing: ${isPlaying}, HasPause: ${hasPauseButton}, Items: ${fileItems.length}`);
                if (fileItems.length === 0 && attempts < 5) {
                    Logger.log("Waiting for file list...");
                    return;
                }
                if ((isPlaying && isMatchingWork) || hasPauseButton) {
                    Logger.log("Playback success.");
                    clearInterval(this.playbackTimer);
                    this.state.isSkipping = false;
                    return;
                }
                if (attempts > maxAttempts) {
                    Logger.log("Playback timeout. Skipping work (Dud detected?).");
                    clearInterval(this.playbackTimer);
                    this.state.isSkipping = false;
                    this.skipToNextWork();
                    return;
                }
                if (isMatchingWork && !isPlaying) {
                    if (this.app.$store._actions['AudioPlayer/play']) {
                        Logger.log("Attempting store play dispatch...");
                        this.app.$store.dispatch('AudioPlayer/play');
                    } else if (this.app.$store._actions['AudioPlayer/playTrack']) {
                        Logger.log("Attempting store playTrack dispatch...");
                        const vm = VueUtils.findComponent(this.app, v => Array.isArray(v.tracks) && v.tracks.length > 0);
                        if (vm && vm.tracks[0]) {
                            this.app.$store.dispatch('AudioPlayer/playTrack', vm.tracks[0]);
                        } else {
                            const audio = document.querySelector('audio');
                            if (audio && audio.paused) {
                                Logger.log("Attempting direct play...");
                                audio.play().catch(e => Logger.error("Direct play fail", e));
                            } else if (!audio) {
                                this.clickPlayButton();
                            }
                        }
                    } else {
                        const audio = document.querySelector('audio');
                        if (audio && audio.paused) {
                            Logger.log("Attempting direct play...");
                            audio.play().catch(e => Logger.error("Direct play fail", e));
                        } else if (!audio) {
                            this.clickPlayButton();
                        }
                    }
                } else if (!isMatchingWork) {
                    if (attempts % 2 !== 0) {
                        Logger.log("Work ID mismatch. Clicking play button...");
                        this.clickPlayButton();
                    }
                }
            }, 1000);
        },
        clickPlayButton() {
            const container = document.querySelector('.q-page-container');
            if (container) {
                const buttons = Array.from(container.querySelectorAll('button'));
                const playButtons = buttons.filter(b => b.textContent.includes('play_arrow'));
                if (playButtons.length > 0) {
                    let btn = playButtons[0];
                    if (Config.get('shuffle')) {
                        btn = playButtons[Math.floor(Math.random() * playButtons.length)];
                    }
                    btn.click();
                } else {
                    const firstItem = container.querySelector('.file-list-item, .q-item');
                    if (firstItem) {
                        Logger.log("No play button. Clicking first item as fallback.");
                        firstItem.click();
                    }
                }
            }
        }
    };
    const FolderDiver = {
        app: null,
        lastDive: 0,
        currentWorkId: null,
        hasDived: false,
        init(app) {
            this.app = app;
            setInterval(() => this.tick(), 500);
        },
        tick() {
            if (!Config.get('autoFilterFolders')) return;
            // Check for Work ID change to reset dive state
            const route = this.app.$route;
            const currentId = route.params.id;
            if (currentId !== this.currentWorkId) {
                Logger.log(`[FolderDiver] New Work ID: ${currentId}. Resetting dive state.`);
                this.currentWorkId = currentId;
                this.hasDived = false;
                this.lastPathLength = 0;
                this.manualWaitUntil = 0;
                this.diveDepth = 0;
            }
            if (this.hasDived) return;
            // Navigation Freedom: If audio is playing, do not auto-dive.
            const player = this.app.$store.state.AudioPlayer;
            if (player && player.playing) return;
            if (Date.now() < this.manualWaitUntil) return;
            if (Date.now() - this.lastDive < 800) return;
            const pathLen = JSON.parse(route.query.path || '[]').length;
            if (pathLen < this.lastPathLength) {
                Logger.log("[FolderDiver] User navigated UP. Pausing auto-dive for 10s.");
                this.manualWaitUntil = Date.now() + 10000;
                this.lastPathLength = pathLen;
                return;
            }
            this.lastPathLength = pathLen;
            if (!route.path.includes('/work/')) return;
            let vm = VueUtils.findComponent(this.app, v => {
                if (v.tracks || v.dirs) return true;
                if (v.work && (v.work.id === currentId || v.work.id == currentId)) return true;
                return false;
            });
            if (Math.random() < 0.05) Logger.log(`[FolderDiver] Tick. VM Found: ${!!vm} (ID: ${currentId})`);
            if (vm) {
                const tracks = vm.tracks || (vm.work ? vm.work.tracks : []) || [];
                const dirs = vm.dirs || (vm.work ? vm.work.dirs : []) || [];
                // Audio Detection: If tracks are already surfaced, we might not need to dive?
                // Actually, logic is: if tracks > 0, we are good.
                if (tracks.length > 0) {
                    Logger.log(`[FolderDiver] Tracks found (${tracks.length}). Stopping dive.`);
                    this.hasDived = true;
                    if (RadioManager.state.isActive) this.tryAutoPlay();
                    return;
                }
                if (tracks.length === 0 && dirs.length > 0) {
                    const enriched = dirs.map(d => ({ ...d, caption: d.duration_text || "" }));
                    const best = SmartSelector.selectBestFolder(enriched);
                    if (best) {
                        Logger.log(`[FolderDiver] Intermediate folder detected. Diving into: ${best}`);
                        this.dive(best);
                    }
                }
                else if (tracks.length === 0 && WorkFlattener.tryFlatten(vm)) {
                    Logger.log("[FolderDiver] Flattened structure.");
                    this.hasDived = true;
                } else {
                    this.domFallback();
                }
            } else {
                this.domFallback();
            }
        },
        domFallback() {
            // Navigation Freedom: If audio is playing, do not auto-dive.
            const player = this.app?.$store?.state?.AudioPlayer;
            if (player && player.playing) return;
            if (this.hasDived) return;
            // Filter to only ACTUAL folders based on amber color (ASMROne standard for folders)
            const folderItems = Array.from(document.querySelectorAll('.q-tree__node, #work-tree .q-item'))
                .filter(el => el.querySelector('.text-amber'));
            // Audio Detection: Look for track-specific markers
            const workContainer = document.querySelector('#work-tree') || document.querySelector('.q-page-container');
            if (workContainer) {
                const playIcons = Array.from(workContainer.querySelectorAll('.q-btn i.material-icons, i.material-icons'))
                    .filter(i => i.textContent.trim() === 'play_arrow');
                const hasAudioMarks = workContainer.querySelector('.q-icon[name="audio_file"], .q-icon.text-primary, i.material-icons.text-primary') || playIcons.length > 0;
                if (hasAudioMarks) {
                    Logger.log(`[FolderDiver] Audio tracks found (DOM). Stopping dive.`);
                    this.hasDived = true;
                    if (RadioManager.state.isActive) this.tryAutoPlay();
                    return;
                }
            }
            if (folderItems.length > 0 && this.diveDepth < 10) {
                const folderCandidates = [];
                folderItems.forEach(el => {
                    const labelEl = el.querySelector('.q-tree__node-header-content .ellipsis, .q-item__label, .ellipsis');
                    const captionEl = el.querySelector('.q-tree__node-header-content .text-caption, .q-item__label--caption, .text-caption');
                    if (labelEl) {
                        const name = labelEl.textContent.trim();
                        const caption = captionEl ? captionEl.textContent.trim() : "";
                        const score = SmartSelector.calcScore(name, 0, caption, false);
                        folderCandidates.push({ element: el, name, _score: score });
                    }
                });
                folderCandidates.sort((a, b) => b._score - a._score);
                const best = folderCandidates[0];
                if (best && best._score > -400000) {
                    Logger.log(`[FolderDiver] DOM Fallback (Multi-Dive). Diving into: ${best.name}`);
                    this.dive(best.name);
                }
            }
        },
        dive(name) {
            const q = this.app.$route.query;
            const currentPath = JSON.parse(q.path || '[]');
            if (currentPath.includes(name)) return;
            const newPath = [...currentPath, name];
            this.app.$router.replace({
                query: { ...q, path: JSON.stringify(newPath) }
            }).catch(err => { });
            Logger.log(`[FolderDiver] Diving executed: ${name}`);
            this.lastDive = Date.now();
            this.diveDepth++;
        },
        tryAutoPlay() {
            if (!RadioManager.state.isActive) return;
            if (this.app?.$store?.state?.AudioPlayer?.playing) return;
            // Try to find the "Play All" button first
            const playAll = Array.from(document.querySelectorAll('.q-btn'))
                .find(b => b.textContent.includes('全部播放') || b.textContent.includes('Play All'));
            if (playAll) {
                Logger.log("[FolderDiver] Auto-playing: Clicking Play All");
                playAll.click();
                return;
            }
            // Fallback: Click the first track play button
            const firstPlay = Array.from(document.querySelectorAll('#work-tree .q-btn i, #work-tree .material-icons'))
                .find(i => i.textContent.trim() === 'play_arrow');
            if (firstPlay) {
                Logger.log("[FolderDiver] Auto-playing: Clicking first track");
                firstPlay.closest('button')?.click() || firstPlay.parentElement?.click();
            }
        }
    };
    const UIManager = {
        init(app) {
            this.injectSidebar();
            this.injectSettingsHook(app);
        },
        async injectSidebar() {
            await SafeUtils.waitForElement('.q-drawer--left .q-list');
            setInterval(() => {
                const sidebar = document.querySelector('.q-drawer--left .q-list');
                if (sidebar && !document.getElementById('asmr-radio-toggle')) {
                    const el = document.createElement('div');
                    el.id = 'asmr-radio-toggle';
                    el.className = 'q-item q-item-type row no-wrap q-item--clickable q-link cursor-pointer';
                    el.innerHTML = `
                        <div class="q-item__section column q-item__section--avatar q-item__section--side justify-center"><i class="q-icon notranslate material-icons">radio</i></div>
                        <div class="q-item__section column q-item__section--main justify-center">
                            <div class="q-item__label text-subtitle1">${I18n.t('radioMode')}</div>
                            <div class="q-item__label text-caption" id="asmr-radio-status">${I18n.t('off')}</div>
                        </div>`;
                    el.onclick = () => RadioManager.toggle();
                    sidebar.appendChild(el);
                }
            }, 1000);
        },
        updateRadioStatus(on) {
            const el = document.getElementById('asmr-radio-status');
            const bg = document.getElementById('asmr-radio-toggle');
            if (el) {
                el.textContent = on ? I18n.t('on') : I18n.t('off');
                el.style.color = on ? '#e91e63' : '';
                if (bg) bg.style.backgroundColor = on ? 'rgba(233, 30, 99, 0.1)' : '';
            }
        },
        injectSettingsHook(app) {
            app.$watch('$route', to => {
                if (to.path === '/settings') setTimeout(() => this.renderSettings(), 800);
            });
            if (app.$route.path === '/settings') setTimeout(() => this.renderSettings(), 800);
        },
        renderSettings() {
            if (document.getElementById('asmr-radio-settings-section')) return;
            const headers = Array.from(document.querySelectorAll('.q-item-label.header, .text-weight-medium.text-center.flex'));
            const subSettingsHeader = headers.find(h => h.textContent.includes('Subtitle') || h.textContent.includes('字幕'));
            if (subSettingsHeader) {
                const subList = subSettingsHeader.nextElementSibling;
                if (subList && subList.classList.contains('q-list')) {
                    this.injectSubtitleSettings(subList);
                }
            }
            const playerSettingsHeader = headers.find(h => h.textContent.includes('Player') || h.textContent.includes('播放'));
            if (playerSettingsHeader) {
                const playerList = playerSettingsHeader.nextElementSibling;
                if (playerList) {
                    this.injectRadioSettings(playerList);
                }
            }
        },
        injectSubtitleSettings(listEl) {
            const wrap = document.createElement('div');
            const divider = '<hr aria-orientation="horizontal" class="q-separator q-separator q-separator--horizontal q-separator--dark">';
            wrap.innerHTML = `
                ${divider}
                ${this.inputHTML('subtitleLang', I18n.t('targetLang'), I18n.t('targetLangSub'), 'en')}
                ${divider}
                <div class="q-ma-md q-pa-sm bg-grey-9 rounded-borders text-caption text-grey-5" style="border: 1px solid #444">
                    <div class="row items-center q-mb-xs"><i class="material-icons q-mr-sm text-warning">lightbulb</i><strong>${I18n.t('liveCaptionTitle')}</strong></div>
                    ${I18n.t('liveCaptionMsg')}
                </div>
            `;
            while (wrap.firstChild) listEl.appendChild(wrap.firstChild);
        },
        injectRadioSettings(refNode) {
            const header = document.createElement('span');
            header.className = 'text-weight-medium text-center flex q-mt-md';
            header.textContent = I18n.t('radioSettings');
            const list = document.createElement('div');
            list.id = 'asmr-radio-settings-section';
            list.className = 'rounded-borders q-list q-list--bordered q-list--dark bg-black';
            const divider = '<hr aria-orientation="horizontal" class="q-separator q-separator q-separator--horizontal q-separator--dark">';
            list.innerHTML = `
                ${this.toggleHTML('playAllInFolder', I18n.t('playAll'), I18n.t('playAllSub'))}
                ${divider}
                ${this.toggleHTML('shuffle', I18n.t('shuffle'), I18n.t('shuffleSub'))}
                ${divider}
                ${this.toggleHTML('sePreference', I18n.t('sePref'), I18n.t('sePrefSub'))}
                ${divider}
                ${this.inputHTML('preferredFormat', I18n.t('prefFormat'), I18n.t('prefFormatSub'), 'wav')}
            `;
            refNode.parentNode.insertBefore(header, refNode.nextSibling);
            header.parentNode.insertBefore(list, header.nextSibling);
        },
        toggleHTML(key, label, sub) {
            const val = Config.get(key);
            return `
                <div role="listitem" class="q-py-sm q-item q-item-type row no-wrap q-item--dark clickable" onclick="window.ASMRUlt.toggle('${key}', this)">
                    <div class="q-item__section column q-item__section--avatar q-item__section--side justify-center"><i class="q-icon notranslate material-icons">tune</i></div>
                    <div class="q-item__section column q-item__section--main justify-center">
                        <div class="q-item__label"><span class="text-weight-medium">${label}</span></div>
                        <div class="q-item__label q-item__label--caption text-caption"><span class="text-weight-medium">${sub}</span></div>
                    </div>
                    <div class="q-item__section column q-item__section--side justify-center">
                        <div class="q-toggle cursor-pointer no-outline row inline no-wrap items-center q-toggle--dark q-toggle--dense" role="switch" aria-checked="${val}">
                            <div class="q-toggle__inner relative-position non-selectable ${val ? 'q-toggle__inner--truthy text-green' : 'q-toggle__inner--falsy text-grey'}">
                                <input type="checkbox" class="hidden q-toggle__native absolute q-ma-none q-pa-none">
                                <div class="q-toggle__track"></div>
                                <div class="q-toggle__thumb absolute flex flex-center no-wrap"></div>
                            </div>
                        </div>
                    </div>
                </div>`;
        },
        inputHTML(key, label, sub, def) {
            const val = Config.get(key) || '';
            return `
                <div role="listitem" class="q-py-sm q-item q-item-type row no-wrap q-item--dark">
                    <div class="q-item__section column q-item__section--avatar q-item__section--side justify-center"><i class="q-icon notranslate material-icons">language</i></div>
                    <div class="q-item__section column q-item__section--main justify-center">
                        <div class="q-item__label"><span class="text-weight-medium">${label}</span></div>
                         <div class="q-item__label q-item__label--caption text-caption"><span class="text-weight-medium">${sub}</span></div>
                    </div>
                    <div class="q-item__section column q-item__section--side justify-center">
                        <input class="q-input bg-grey-9 text-white q-pa-xs rounded-borders" style="border:1px solid #555; width: 100px; text-align: center"
                        value="${val}" placeholder="${def}" onchange="window.ASMRUlt.set('${key}', this.value)"/>
                    </div>
                </div>`;
        }
    };
    const API = {
        toggle(key, el) {
            const n = !Config.get(key);
            Config.set(key, n);
            const toggle = el.querySelector('.q-toggle__inner');
            if (toggle) {
                if (n) {
                    toggle.className = 'q-toggle__inner relative-position non-selectable q-toggle__inner--truthy text-green';
                    toggle.parentElement.setAttribute('aria-checked', 'true');
                } else {
                    toggle.className = 'q-toggle__inner relative-position non-selectable q-toggle__inner--falsy text-grey';
                    toggle.parentElement.setAttribute('aria-checked', 'false');
                }
            }
            if (key === 'showJP') LearnerUI.updateStyle();
        },
        set(key, val) { Config.set(key, val); }
    };
    window.ASMRUlt = API;
    try {
        if (typeof unsafeWindow !== 'undefined') {
            unsafeWindow.ASMRUlt = API;
        }
    } catch (e) {
        console.warn('ASMR Ultimate: unsafeWindow not available', e);
    }
    RadioManager.init();
})();