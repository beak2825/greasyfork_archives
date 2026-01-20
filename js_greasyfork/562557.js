// ==UserScript==
// @name         MegaLadder Stats Overlay
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Overlay for MegaLadder, GAZ. Supports PiP mode for overlaying on game screen.
// @author       21twentyone
// @license      MIT
// @match        https://ladder.megabonk.su/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562557/MegaLadder%20Stats%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/562557/MegaLadder%20Stats%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict'


    let SETTINGS = {
        opacity: parseFloat(localStorage.getItem('ml_pip_opacity')) || 1.0,
        scale: 1.0,
        textScale: parseFloat(localStorage.getItem('ml_pip_text_scale')) || 1.0,
        banScale: parseFloat(localStorage.getItem('ml_pip_ban_scale')) || 1.0,
        buildScale: parseFloat(localStorage.getItem('ml_pip_build_scale')) || 1.0,
        canvasWidth: parseInt(localStorage.getItem('ml_pip_canvas_width')) || 600,
        canvasHeight: parseInt(localStorage.getItem('ml_pip_canvas_height')) || 400,
        showAvatars: JSON.parse(localStorage.getItem('ml_pip_show_avatars') ?? 'true'),
        showNames: JSON.parse(localStorage.getItem('ml_pip_show_names') ?? 'true'),
        showMMR: JSON.parse(localStorage.getItem('ml_pip_show_mmr') ?? 'true'),

        separateTimers: JSON.parse(localStorage.getItem('ml_pip_separate_timers') ?? 'false'),
        showStages: JSON.parse(localStorage.getItem('ml_pip_show_stages') ?? 'true'),
        showEventTimers: JSON.parse(localStorage.getItem('ml_pip_show_event_timers') ?? 'true'),
        showLeftBans: JSON.parse(localStorage.getItem('ml_pip_show_left_bans') ?? 'true'),
        showRightBans: JSON.parse(localStorage.getItem('ml_pip_show_right_bans') ?? 'true'),
        showCommonBans: JSON.parse(localStorage.getItem('ml_pip_show_common_bans') ?? 'true'),
        showStats: JSON.parse(localStorage.getItem('ml_pip_show_stats') ?? 'true'),
        showMainTimer: JSON.parse(localStorage.getItem('ml_pip_show_maintimer') ?? 'true'),
        showBuilds: JSON.parse(localStorage.getItem('ml_pip_show_builds') ?? 'true'),
        focusRival: JSON.parse(localStorage.getItem('ml_pip_focus_rival') ?? 'false'),
        language: localStorage.getItem('ml_pip_language') || 'ru',
        fullFocusMode: JSON.parse(localStorage.getItem('ml_pip_full_focus_mode') ?? 'false'),
        showKills: JSON.parse(localStorage.getItem('ml_pip_show_kills') ?? 'true'),
        showLevel: JSON.parse(localStorage.getItem('ml_pip_show_level') ?? 'true'),
        showDiff: JSON.parse(localStorage.getItem('ml_pip_show_diff') ?? 'true'),
        showOvertimeTimer: JSON.parse(localStorage.getItem('ml_pip_show_overtime') ?? 'true')
    }

    // --- Profile System ---

    const DEFAULT_PROFILES = {
        'Full': { // Default "All On" profile
            fullFocusMode: false,
            focusRival: false,
            textScale: 1.2,
            // Explicitly set commonly used settings to ensure consistency
            showAvatars: true, showNames: true, showMMR: true, separateTimers: true,
            showStages: true, showEventTimers: true, showLeftBans: true, showRightBans: true,
            showCommonBans: true, showStats: true, showMainTimer: true, showBuilds: true,
            showKills: true, showLevel: true, showDiff: true
        },
        'Focus Rival': {
            fullFocusMode: false,
            focusRival: true,
            separateTimers: false,
            showLeftBans: false,
            showRightBans: false,
            showCommonBans: false,
            textScale: 1.2,
            showKills: true, showLevel: true, showDiff: true
        },
        'Full Focus': {
            fullFocusMode: true,
            focusRival: false,
            separateTimers: false,
            textScale: 0.9,
            showKills: true, showLevel: true, showDiff: true
        }
    }

    const ProfileManager = {
        currentProfile: localStorage.getItem('ml_pip_current_profile') || 'Full',
        customProfiles: JSON.parse(localStorage.getItem('ml_pip_custom_profiles') || '{}'),

        getProfiles() {
            return { ...DEFAULT_PROFILES, ...this.customProfiles }
        },

        loadProfile(name) {
            const profiles = this.getProfiles()
            const profile = profiles[name]
            if (!profile) return

            // Apply settings from profile
            Object.keys(profile).forEach(key => {
                if (SETTINGS.hasOwnProperty(key)) {
                    SETTINGS[key] = profile[key]
                    updateSetting(key, profile[key], true) // true = skip state update until end
                }
            })

            this.currentProfile = name
            localStorage.setItem('ml_pip_current_profile', name)
            refreshUIValues() // Sync UI checkboxes
            updateUIState()
        },

        saveProfile(name) {
            if (DEFAULT_PROFILES[name]) return false // Cannot overwrite defaults

            // Save current crucial settings
            const profile = {
                fullFocusMode: SETTINGS.fullFocusMode,
                focusRival: SETTINGS.focusRival,
                separateTimers: SETTINGS.separateTimers,
                showAvatars: SETTINGS.showAvatars,
                showNames: SETTINGS.showNames,
                showMMR: SETTINGS.showMMR,
                showStages: SETTINGS.showStages,
                showEventTimers: SETTINGS.showEventTimers,
                showLeftBans: SETTINGS.showLeftBans,
                showRightBans: SETTINGS.showRightBans,
                showCommonBans: SETTINGS.showCommonBans,
                showStats: SETTINGS.showStats,
                showMainTimer: SETTINGS.showMainTimer,
                showBuilds: SETTINGS.showBuilds
            }

            this.customProfiles[name] = profile
            this.currentProfile = name
            this.saveCustomProfiles()
            return true
        },

        deleteProfile(name) {
            if (DEFAULT_PROFILES[name]) return false
            delete this.customProfiles[name]
            this.saveCustomProfiles()
            // If deleted current, switch to default
            if (this.currentProfile === name) {
                this.loadProfile('Full')
            }
            return true
        },

        saveCustomProfiles() {
            localStorage.setItem('ml_pip_custom_profiles', JSON.stringify(this.customProfiles))
            localStorage.setItem('ml_pip_current_profile', this.currentProfile)
        }
    }

    const TRANSLATIONS = {
        ru: {
            // UI
            vis_btn: '👁 ВИДИМОСТЬ',
            set_btn: '⚙ НАСТРОЙКИ',
            open_btn: 'ОТКРЫТЬ',
            active_btn: 'АКТИВЕН',
            focus_mode: 'Режим Фокуса',
            full_focus: 'Полный фокус',
            sep_timers: 'Раздельные таймеры',
            avatars: 'Аватары',
            names: 'Имена',
            mmr: 'MMR',
            builds: 'Билды',
            main_timer: 'Главный Таймер',
            stages: 'Номера Этапов',
            event_timers: 'Таймеры Событий',
            overtime_timer: '⏱ Овертайм',
            my_bans: 'Мои баны',
            enemy_bans: 'Баны врага',
            common_bans: 'Общие баны',
            stats_table: 'Таблица Статистики',
            text_size: 'РАЗМЕР ТЕКСТА',
            build_size: 'РАЗМЕР ИКОНОК БИЛДА',
            width: 'ШИРИНА',
            height: 'ВЫСОТА',
            ban_size: 'РАЗМЕР ИКОНОК БАНА',
            opacity: 'ПРОЗРАЧНОСТЬ',
            language: 'ЯЗЫК',
            // Overlay
            vs: 'VS',
            win: 'ПОБЕДА',
            loss: 'ПОРАЖЕНИЕ',
            draw: 'НИЧЬЯ',
            stage: 'Этап',
            final: 'ЛАСТ ОРДА',
            swarm: 'Орда',
            miniboss: 'Мини-Босс',
            kills: 'УБИЙСТВА',
            level: 'УРОВЕНЬ',
            diff: 'СЛОЖНОСТЬ',
            you: 'Вы',
            enemy: 'Враг',
            // Warnings
            warn_focus: '⚠ Некоторые настройки отключены в режиме Фокуса',
            // Profiles
            profile: 'ПРОФИЛЬ',
            save: '💾',
            del: '🗑',
            new_profile: 'Имя нового профиля:',
            s_kills: 'Убийства',
            s_level: 'Уровень',
            s_diff: 'Сложность',
            test_mode: '🧪 ТЕСТ',
            test_active: '🧪 ТЕСТ ✅'
        },
        en: {
            // UI
            vis_btn: '👁 VISIBILITY',
            set_btn: '⚙ SETTINGS',
            open_btn: 'OPEN',
            active_btn: 'ACTIVE',
            focus_mode: 'Focus Mode',
            full_focus: 'Full Focus Mode',
            sep_timers: 'Separate Timers',
            avatars: 'Avatars',
            names: 'Names',
            mmr: 'MMR',
            builds: 'Builds',
            main_timer: 'Main Timer',
            stages: 'Stage Numbers',
            event_timers: 'Event Timers',
            overtime_timer: '⏱ Overtime',
            my_bans: 'My Bans',
            enemy_bans: 'Enemy Bans',
            common_bans: 'Common Bans',
            stats_table: 'Stats Table',
            text_size: 'TEXT SIZE',
            build_size: 'BUILD ICON SIZE',
            width: 'WIDTH',
            height: 'HEIGHT',
            ban_size: 'BAN ICON SIZE',
            opacity: 'OPACITY',
            language: 'LANGUAGE',
            // Overlay
            vs: 'VS',
            win: 'VICTORY',
            loss: 'DEFEAT',
            draw: 'DRAW',
            stage: 'Stage',
            final: 'FINAL SWARM',
            swarm: 'Swarm',
            miniboss: 'Mini-Boss',
            kills: 'KILLS',
            level: 'LEVEL',
            diff: 'DIFFICULTY',
            you: 'You',
            you: 'You',
            enemy: 'Enemy',
            // Warnings
            warn_focus: '⚠ Some settings disabled in Focus Mode',
            // Profiles
            profile: 'PROFILE',
            save: '💾',
            del: '🗑',
            new_profile: 'New profile name:',
            s_kills: 'Kills',
            s_level: 'Level',
            s_diff: 'Diff',
            test_mode: '🧪 TEST',
            test_active: '🧪 TEST ✅'
        }
    }

    const t = (key) => TRANSLATIONS[SETTINGS.language][key] || key

    const BASE_HEIGHT = 380

    const C = {
        bg: '#0e0e12',
        green: '#8ac467',
        red: '#ff6b6b',
        blue: '#6badff',
        gold: '#fbc403',
        badgeBg: 'rgba(255, 255, 255, 0.08)',
        badgeBorder: 'rgba(255, 255, 255, 0.15)',
        separator: 'rgba(255, 255, 255, 0.12)',
        vsColor: '#555',
        banBorder: 'rgba(255, 80, 80, 0.4)',
        buildBorder: 'rgba(255, 255, 255, 0.3)'
    }

    const GAME_TOTAL_MINUTES = 45
    const STAGE_DURATIONS = { 1: 10, 2: 9, 3: 8, 4: 8, 5: 8 }
    const EVENTS = [
        { time: 7.0, name: 'Мини-Босс', color: '#f0b27a' },
        { time: 6.0, name: 'Орда', color: '#d2b4de' },
        { time: 3.0, name: 'Орда', color: '#d2b4de' },
        { time: 2.0, name: 'Мини-Босс', color: '#f0b27a' },
        { time: 0.0, name: 'Ласт орда', color: '#ff6b6b' }
    ]

    const imgCache = {
        lAvatar: new Image(), rAvatar: new Image(),
        lSrc: '', rSrc: '',
        bans: new Map()
    }

    // UI Sync Logic
    function refreshUIValues() {
        if (!document.getElementById('ml-control-panel')) return;

        // Sync checkboxes
        const checkboxes = [
            'fullFocusMode', 'focusRival', 'separateTimers',
            'showAvatars', 'showNames', 'showMMR', 'showBuilds',
            'showMainTimer', 'showStages', 'showEventTimers', 'showOvertimeTimer',
            'showLeftBans', 'showRightBans', 'showCommonBans', 'showStats',
            'showKills', 'showLevel', 'showDiff'
        ]
        checkboxes.forEach(id => {
            const chk = document.getElementById(`ml-chk-${id}`)
            if (chk) chk.checked = !!SETTINGS[id]
        })

        // Sync inputs
        const inputs = [
            'textScale', 'buildScale', 'canvasWidth',
            'canvasHeight', 'banScale', 'opacity'
        ]
        inputs.forEach(key => {
            const input = document.getElementById(`ml-val-${key}`)
            if (input) {
                // Formatting logic similar to createSetRow
                let val = SETTINGS[key]
                if (key.includes('Scale') || key === 'opacity') val = val.toFixed(1)
                input.value = val
            }
        })
    }
    imgCache.lAvatar.crossOrigin = "Anonymous"
    imgCache.rAvatar.crossOrigin = "Anonymous"

    const getCachedImage = (src) => {
        if (!src) return null
        if (!imgCache.bans.has(src)) {
            const img = new Image()
            img.crossOrigin = "Anonymous"
            img.src = src
            imgCache.bans.set(src, img)
        }
        return imgCache.bans.get(src)
    }

    let canvas, ctx, videoEl, controlPanel, visibilityPanel, settingsPanel
    let isPipActive = false
    let activePanel = null
    let isTestMode = false

    // Test data for overlay configuration without active game
    const TEST_DATA = {
        lName: 'Player_1', rName: 'Player_2',
        lMMR: '1250', rMMR: '1180',
        lTime: '32:15', rTime: '31:48',
        lStage: 2, rStage: 2,
        lEvent: null, // Will be set dynamically based on language
        rEvent: null, // Will be set dynamically based on language
        lKills: 2450, rKills: 2180,
        lKpm: 183.2, rKpm: 165.8,
        lLvl: 35, rLvl: 32,
        lLpm: 2.6, rLpm: 2.4,
        lDiff: 85, rDiff: 72,
        lBans: [
            'https://cdn.megabonk.su/media/heroes/fox-hero-megabonk_QHFo4Vk.webp',
            'https://cdn.megabonk.su/media/weapons/Scythe.png',
            'https://cdn.megabonk.su/media/tomes/PrecisionTome.webp',
            'https://cdn.megabonk.su/media/items/skuleg-item-megabonk_zQKV8oi.webp',
            'https://cdn.megabonk.su/media/items/creditcardred-item-megabonk_Ml4NfMX.webp',
            'https://cdn.megabonk.su/media/items/kevin-item-megabonk_DhTbcpm.webp',
            'https://cdn.megabonk.su/media/items/sucky-magnet-item-megabonk_Spq0QQ7.webp'
        ],
        rBans: [
            'https://cdn.megabonk.su/media/heroes/bush-hero-megabonk_ZFLkwbt.webp',
            'https://cdn.megabonk.su/media/weapons/dice-weapon-megabonk_azRand7.webp',
            'https://cdn.megabonk.su/media/tomes/ChaosTome.webp',
            'https://cdn.megabonk.su/media/items/wrench-item-megabonk_jUKLczY.webp',
            'https://cdn.megabonk.su/media/items/creditcardred-item-megabonk_Ml4NfMX.webp',
            'https://cdn.megabonk.su/media/items/grandmas-secret-tonic-item-megabonk_UNZAQch.webp',
            'https://cdn.megabonk.su/media/items/soulharvester-item-megabonk_Z2jdkHZ.webp'
        ],
        commonBans: [
            'https://cdn.megabonk.su/media/heroes/ogre_-hero-megabonk_LK1zrwa.webp',
            'https://cdn.megabonk.su/media/weapons/aura-weapon-megabonk_vp8xMya.webp',
            'https://cdn.megabonk.su/media/tomes/SizeTome.webp',
            'https://cdn.megabonk.su/media/items/boss-buster-item-megabonk_4UewS6Z.webp',
            'https://cdn.megabonk.su/media/items/idlejuice-item-megabonk_o8Fzix5.webp',
            'https://cdn.megabonk.su/media/items/beefy-ring-item-megabonk_sPHMc8N.webp',
            'https://cdn.megabonk.su/media/items/joes-dagger-item-megabonk_qUQOVQ6.webp'
        ],
        lStatus: { emoji: null, isWin: false },
        rStatus: { emoji: null, isWin: false },
        lRatingDiff: null, rRatingDiff: null,
        lPaused: false, rPaused: false,
        lOvertime: '3:06', rOvertime: '1:53',
        lBuild: {
            weapons: [
                { src: 'https://cdn.megabonk.su/media/weapons/firestaff-weapon-megabonk_lS70Fxx.webp', lvl: '7' },
                { src: 'https://cdn.megabonk.su/media/weapons/Scythe.png', lvl: '6' },
                { src: 'https://cdn.megabonk.su/media/weapons/bloodmagic-weapon-megabonk_qfxMRBC.webp', lvl: '2' },
                { src: 'https://cdn.megabonk.su/media/weapons/katana-weapon-megabonk_ewx3pUc.webp', lvl: '3' }
            ],
            tomes: [
                { src: 'https://cdn.megabonk.su/media/tomes/LuckTome.webp', lvl: '7' },
                { src: 'https://cdn.megabonk.su/media/tomes/ChaosTome.webp', lvl: '3' },
                { src: 'https://cdn.megabonk.su/media/tomes/DamageTome.webp', lvl: '4' },
                { src: 'https://cdn.megabonk.su/media/tomes/CursedTome.webp', lvl: '11' }
            ]
        },
        rBuild: {
            weapons: [
                { src: 'https://cdn.megabonk.su/media/weapons/corruptsword-weapon-megabonk_vxJtpPE.webp', lvl: '6' },
                { src: 'https://cdn.megabonk.su/media/weapons/axe-weapon-megabonk_bYVopVF.webp', lvl: '39' },
                { src: 'https://cdn.megabonk.su/media/weapons/dragonsbreath-weapon-megabonk_IXSJvu4.webp', lvl: '5' },
                { src: 'https://cdn.megabonk.su/media/weapons/katana-weapon-megabonk_ewx3pUc.webp', lvl: '26' }
            ],
            tomes: [
                { src: 'https://cdn.megabonk.su/media/tomes/PrecisionTome.webp', lvl: '7' },
                { src: 'https://cdn.megabonk.su/media/tomes/CursedTome.webp', lvl: '7' },
                { src: 'https://cdn.megabonk.su/media/tomes/CooldownTome.webp', lvl: '4' },
                { src: 'https://cdn.megabonk.su/media/tomes/DamageTome.webp', lvl: '2' }
            ]
        }
    }


    const css = `
        #ml-control-panel {
            position: fixed; top: 0; left: 50%;
            transform: translateX(-50%) translateY(-85%);
            z-index: 999999;
            background: rgba(14, 14, 18, 0.95);
            border: 1px solid rgba(255,255,255,0.1);
            border-top: none; border-radius: 0 0 12px 12px;
            padding: 8px 16px; display: flex; gap: 12px; align-items: center;
            transition: transform 0.2s ease;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            font-family: 'Segoe UI', sans-serif; font-size: 12px; color: #ccc;
        }
        #ml-control-panel:hover, #ml-control-panel.locked {
            transform: translateX(-50%) translateY(0);
        }
        .ml-main-btn {
            display: flex; align-items: center; gap: 8px; cursor: pointer;
            padding: 6px 10px; border-radius: 6px;
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
            user-select: none; transition: 0.2s;
        }
        .ml-main-btn:hover { background: rgba(255,255,255,0.15); }
        .ml-main-btn.active-btn { background: rgba(138, 196, 103, 0.2); border-color: rgba(138, 196, 103, 0.4); color: #fff; }
        .ml-dot { width: 6px; height: 6px; border-radius: 50%; background: #ff6b6b; box-shadow: 0 0 5px #ff6b6b; transition:0.3s;}
        .ml-dot.active { background: #8ac467; box-shadow: 0 0 5px #8ac467; }

        .ml-popup-panel {
            position: fixed; top: 60px; left: 50%;
            transform: translateX(-50%) scale(0.95);
            opacity: 0; pointer-events: none;
            background: rgba(20, 20, 25, 0.98);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 8px; padding: 12px;
            z-index: 999998;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            color: #eee; font-family: 'Segoe UI', sans-serif; font-size: 13px;
            transition: 0.2s;
            display: none;
        }
        .ml-popup-panel.open { display: grid; opacity: 1; transform: translateX(-50%) scale(1); pointer-events: auto; }

        #ml-vis-panel { grid-template-columns: 1fr 1fr; gap: 8px 16px; }
        .ml-chk-row { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
        .ml-chk-row input { margin: 0; accent-color: #8ac467; cursor: pointer; }

        #ml-set-panel { grid-template-columns: 1fr; gap: 12px; min-width: 260px; }
        .ml-set-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .ml-set-label { color: #aaa; font-size: 12px; text-transform: uppercase; white-space: nowrap; }
        .ml-set-ctrls { display: flex; gap: 4px; align-items: center; }

        .ml-val-input {
            width: 50px; text-align: center; font-weight: bold; color: #fff; font-size: 12px;
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
            border-radius: 4px; padding: 2px 0; outline: none;
        }
        .ml-val-input:focus { border-color: #8ac467; background: rgba(0,0,0,0.3); }
        .ml-val-input::-webkit-outer-spin-button,
        .ml-val-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

        .ml-mini-btn {
            width: 24px; height: 24px;
            background: rgba(255,255,255,0.1); border-radius: 4px;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; user-select: none; font-weight: bold;
        }
        .ml-mini-btn:hover { background: rgba(255,255,255,0.25); }

        .ml-warning-msg {
            color: #ff6b6b; font-size: 13px; font-weight: bold; margin-bottom: 10px; text-align: center;
            display: none; background: rgba(255, 107, 107, 0.15); padding: 8px; border-radius: 6px;
            grid-column: 1 / -1; /* Fix layout shift */
        }
    `


    function parseComplexNumber(str) { return parseFloat((str || '').replace(/,/g, '.').replace(/\s&nbsp;/g, '').replace(/[^0-9.-]/g, '')) || 0 }
    function parseLevel(str) { return parseInt((str || '').replace(/\D/g, ''), 10) || 0 }
    function parseTime(timeStr) {
        if (!timeStr) return GAME_TOTAL_MINUTES
        const parts = timeStr.split(':')
        if (parts.length !== 2) return GAME_TOTAL_MINUTES
        return parseInt(parts[0], 10) + (parseInt(parts[1], 10) / 60)
    }

    function formatSimpleTime(minutes) {
        const abs = Math.abs(minutes)
        const m = Math.floor(abs)
        const s = Math.floor((abs - m) * 60)
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    function padTimer(timeStr) {
        if (!timeStr) return "00:00"
        const parts = timeStr.split(':')
        if (parts.length === 2) {
            return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`
        }
        return timeStr
    }

    function formatNum(num, isFloat = false) {
        return num.toLocaleString(SETTINGS.language === 'ru' ? 'ru-RU' : 'en-US', { minimumFractionDigits: isFloat ? 1 : 0, maximumFractionDigits: isFloat ? 1 : 0 })
    }
    function getStageEndTime(stageNum) {
        let end = GAME_TOTAL_MINUTES
        for (let i = 1; i <= stageNum; i++) end -= (STAGE_DURATIONS[i] || 8)
        return end
    }
    function getNextEvent(stageNum, currentGlobalTime) {
        const end = getStageEndTime(stageNum)
        const rem = currentGlobalTime - end + 0.05
        if (rem <= 0.05) return { text: t('final'), color: '#ff6b6b' }
        const next = EVENTS.find(e => e.time <= rem)
        if (!next) return { text: '', color: '#888' }

        let eventName = next.name
        if (eventName === 'Мини-Босс') eventName = t('miniboss')
        if (eventName === 'Орда') eventName = t('swarm')
        if (eventName === 'Ласт орда') eventName = t('final')

        const diff = rem - next.time
        if (diff <= 0.15) return { text: `⚡ ${eventName}`, color: next.color }
        return { text: `${eventName} (${formatSimpleTime(diff)})`, color: next.color }
    }




    function drawOverlay(data) {
        if (!ctx) return

        if (SETTINGS.fullFocusMode) {

            const hdScale = 4.0
            const sideSize = 60 * SETTINGS.scale * hdScale

            if (canvas.width !== sideSize || canvas.height !== sideSize) {
                canvas.width = sideSize
                canvas.height = sideSize
                videoEl.width = sideSize
                videoEl.height = sideSize
            }

            ctx.globalAlpha = 1.0
            ctx.fillStyle = C.bg
            ctx.fillRect(0, 0, sideSize, sideSize)
            ctx.globalAlpha = SETTINGS.opacity

            const CX = sideSize / 2
            const kDiff = data.lKills - data.rKills
            const lDiff = data.lLvl - data.rLvl
            const dDiff = data.lDiff - data.rDiff

            const activeMetrics = []
            if (SETTINGS.showKills) activeMetrics.push({ label: 'KILL', val: kDiff })
            if (SETTINGS.showLevel) activeMetrics.push({ label: 'LEVEL', val: lDiff })
            if (SETTINGS.showDiff) activeMetrics.push({ label: 'DIFF %', val: dDiff })

            // Recalculate rowHeight based on active count
            const count = activeMetrics.length || 1
            const dynRowHeight = sideSize / count

            activeMetrics.forEach((m, idx) => {
                const diffStr = (m.val > 0 ? '+' : '') + m.val
                const color = m.val > 0 ? C.green : (m.val < 0 ? C.red : '#888')

                const yTop = idx * dynRowHeight
                const yCenter = yTop + (dynRowHeight / 2)

                ctx.textAlign = 'center'
                ctx.fillStyle = '#666'
                ctx.font = `bold ${5 * SETTINGS.scale * hdScale}px Segoe UI`
                ctx.fillText(m.label, CX, yCenter - (4 * SETTINGS.scale * hdScale))
                ctx.fillStyle = color
                ctx.font = `900 ${13 * SETTINGS.scale * (SETTINGS.textScale || 1.0) * hdScale}px Segoe UI`
                ctx.fillText(diffStr, CX, yCenter + (6 * SETTINGS.scale * hdScale))

                if (idx < count - 1) {
                    ctx.fillStyle = 'rgba(255,255,255,0.1)'
                    ctx.fillRect(10 * hdScale, yTop + dynRowHeight - 1, sideSize - (20 * hdScale), 1 * hdScale)
                }
            })

            return
        }



        const PADDING = 15 * SETTINGS.scale
        const banSize = 22 * SETTINGS.scale * SETTINGS.banScale
        const banGap = 4 * SETTINGS.scale
        const banVertGap = 4 * SETTINGS.scale
        const buildIconSize = 20 * SETTINGS.scale * SETTINGS.buildScale
        const avSize = 64 * SETTINGS.scale

        const isDryrunCompact = !(SETTINGS.showAvatars || SETTINGS.showNames || SETTINGS.showMMR || SETTINGS.showBuilds || SETTINGS.showMainTimer || SETTINGS.showStages)
        let calcY = isDryrunCompact ? (5 * SETTINGS.scale) : (15 * SETTINGS.scale);

        let calcBuildStart = calcY;
        if (SETTINGS.focusRival) {
            if (SETTINGS.showAvatars) calcY += avSize + (10 * SETTINGS.scale)
            if (SETTINGS.showNames) calcY += (25 * SETTINGS.scale)
            if (SETTINGS.showMMR) calcY += (20 * SETTINGS.scale)
            calcBuildStart = calcY + (6 * SETTINGS.scale)
        } else {
            if (SETTINGS.showAvatars) calcY += avSize + (6 * SETTINGS.scale)
            if (SETTINGS.showNames) calcY += (20 * SETTINGS.scale)
            if (SETTINGS.showMMR) calcY += (15 * SETTINGS.scale)
            calcBuildStart = calcY
        }

        let calcBuildHeight = 0
        if (SETTINGS.showBuilds) {
            const getBh = (b) => {
                if (!b) return 0
                let h = 0
                const gap = 2 * SETTINGS.scale
                if (b.weapons && b.weapons.length) h += buildIconSize + gap
                if (b.tomes && b.tomes.length) h += buildIconSize + gap
                return h
            }
            const lH = getBh(data.lBuild)
            const rH = getBh(data.rBuild)
            calcBuildHeight = Math.max(lH, rH)
        }

        let calcContentBottom = calcBuildStart
        if (calcBuildHeight > 0) calcContentBottom += calcBuildHeight

        let calcTimerEnd = calcContentBottom + (5 * SETTINGS.scale)
        if (SETTINGS.showMainTimer) {
            calcTimerEnd += (24 * SETTINGS.scale)
        }

        let calcCurrentY = calcTimerEnd

        if (SETTINGS.showStages) {
            calcCurrentY += (30 * SETTINGS.scale)
        }
        if (SETTINGS.showStats) {
            const gridGap = isDryrunCompact ? (2 * SETTINGS.scale) : (15 * SETTINGS.scale)

            calcCurrentY += gridGap
            calcCurrentY += (24 * SETTINGS.scale)
            calcCurrentY += (58 * SETTINGS.scale)
            calcCurrentY += (5 * SETTINGS.scale)
            calcCurrentY += (58 * SETTINGS.scale)
            calcCurrentY += (5 * SETTINGS.scale)

            calcCurrentY += (45 * SETTINGS.scale)
        }
        if (SETTINGS.showCommonBans && data.commonBans && data.commonBans.length > 0) {
            calcCurrentY += (8 * SETTINGS.scale)
            calcCurrentY += banSize
        }

        const bottomPadding = isDryrunCompact ? (5 * SETTINGS.scale) : (15 * SETTINGS.scale);
        const autoHeight = calcCurrentY + bottomPadding
        const currentW = SETTINGS.canvasWidth
        const currentH = Math.max(SETTINGS.canvasHeight, autoHeight)

        if (canvas.width !== currentW || canvas.height !== currentH) {
            canvas.width = currentW
            canvas.height = currentH
            videoEl.width = currentW
            videoEl.height = currentH
        }

        ctx.globalAlpha = 1.0
        ctx.fillStyle = C.bg
        ctx.fillRect(0, 0, currentW, currentH)
        ctx.globalAlpha = SETTINGS.opacity

        const drawText = (text, x, y, size, color, align = 'left', weight = 'bold', maxWidth = null) => {
            const scaledSize = size * SETTINGS.scale * (SETTINGS.textScale || 1.0)
            ctx.font = `${weight} ${scaledSize}px Segoe UI, Consolas, sans-serif`
            ctx.fillStyle = color
            ctx.textAlign = align
            if (maxWidth) ctx.fillText(text, x, y, maxWidth)
            else ctx.fillText(text, x, y)
        }

        const W = currentW
        const CX = W / 2

        const isCompactMode = !(SETTINGS.showAvatars || SETTINGS.showNames || SETTINGS.showMMR || SETTINGS.showBuilds || SETTINGS.showMainTimer || SETTINGS.showStages)
        const topPadding = isCompactMode ? (5 * SETTINGS.scale) : (15 * SETTINGS.scale)

        const GAP_SIDE = 10 * SETTINGS.scale

        let leftBanX, rightBanX
        let lAnchorX, rAnchorX
        let lNameX, rNameX, lAlign, rAlign
        let nameY, mmrY

        let leftContentPad, rightContentPad
        let buildStartY = 0

        const isFocus = SETTINGS.focusRival

        if (isFocus) {
            rAnchorX = CX - (avSize / 2)

            lAnchorX = -9999

            rNameX = CX
            rAlign = 'center'

            let currentFocusY = topPadding

            if (SETTINGS.showAvatars) {
                currentFocusY += avSize + (10 * SETTINGS.scale)
            }

            if (SETTINGS.showNames) {
                nameY = currentFocusY + (14 * SETTINGS.scale)
                currentFocusY += (25 * SETTINGS.scale)
            }

            if (SETTINGS.showMMR) {
                mmrY = currentFocusY + (14 * SETTINGS.scale)
                currentFocusY += (20 * SETTINGS.scale)
            }

            buildStartY = currentFocusY + (6 * SETTINGS.scale)
            leftBanX = topPadding
            rightBanX = W - topPadding - banSize

            if (SETTINGS.showLeftBans) leftContentPad = leftBanX + banSize + GAP_SIDE
            else leftContentPad = 20 * SETTINGS.scale

            if (SETTINGS.showRightBans) rightContentPad = (W - rightBanX) + GAP_SIDE
            else rightContentPad = 20 * SETTINGS.scale

        } else {
            const banW = (22 * SETTINGS.scale * SETTINGS.banScale)
            const banReservedSpace = banW + (12 * SETTINGS.scale)
            lAnchorX = PADDING
            rAnchorX = W - PADDING - avSize

            if (SETTINGS.showAvatars) {
                lNameX = lAnchorX + avSize + GAP_SIDE
                rNameX = rAnchorX - GAP_SIDE
            } else {
                lNameX = lAnchorX
                rNameX = rAnchorX + avSize
            }

            nameY = topPadding + (16 * SETTINGS.scale)
            mmrY = nameY + (19 * SETTINGS.scale)

            lAlign = 'left'
            rAlign = 'right'

            let currentStdY = topPadding;
            if (SETTINGS.showAvatars) currentStdY += avSize + (6 * SETTINGS.scale)
            if (SETTINGS.showNames) currentStdY += (20 * SETTINGS.scale)
            if (SETTINGS.showMMR) currentStdY += (15 * SETTINGS.scale)

            buildStartY = currentStdY

            leftBanX = PADDING
            rightBanX = W - PADDING - banW
            const banSepGap = 10 * SETTINGS.scale

            if (SETTINGS.showLeftBans) {
                leftContentPad = leftBanX + banW + banSepGap
            } else {
                leftContentPad = lAnchorX
            }

            if (SETTINGS.showRightBans) {
                const rightContentEnd = rightBanX - banSepGap
                rightContentPad = W - rightContentEnd
            } else {
                const rightContentEnd = rAnchorX + avSize
                rightContentPad = W - rightContentEnd
            }
            if (SETTINGS.showBuilds) {
                const sepY = buildStartY
                const sepH = (2 * buildIconSize) + (2 * SETTINGS.scale) // approx height of 2 rows
                ctx.strokeStyle = C.separator; ctx.lineWidth = 1

                if (SETTINGS.showLeftBans) {
                    const sepX = leftBanX + banW + (6 * SETTINGS.scale)
                    ctx.beginPath(); ctx.moveTo(sepX, sepY); ctx.lineTo(sepX, sepY + sepH); ctx.stroke()
                }
                if (SETTINGS.showRightBans) {
                    const sepX = rightBanX - (6 * SETTINGS.scale)
                    ctx.beginPath(); ctx.moveTo(sepX, sepY); ctx.lineTo(sepX, sepY + sepH); ctx.stroke()
                }
            }
        }

        const drawVerticalBans = (bans, xPos, yStart) => {
            if (!bans || bans.length === 0) return
            bans.forEach((src, idx) => {
                const img = getCachedImage(src)
                const by = yStart + (idx * (banSize + banVertGap))
                if (img && img.complete && img.naturalWidth > 0) {
                    ctx.drawImage(img, xPos, by, banSize, banSize)
                    ctx.strokeStyle = C.banBorder; ctx.lineWidth = 1; ctx.strokeRect(xPos, by, banSize, banSize)
                }
            })
        }

        if (SETTINGS.showLeftBans) {
            drawVerticalBans(data.lBans, leftBanX, buildStartY)
        }
        if (SETTINGS.showRightBans) {
            drawVerticalBans(data.rBans, rightBanX, buildStartY)
        }

        const drawAvatar = (img, x, y, status) => {
            if (!SETTINGS.showAvatars) return
            const r = 8 * SETTINGS.scale

            ctx.save()
            ctx.beginPath()
            if (ctx.roundRect) ctx.roundRect(x, y, avSize, avSize, r); else ctx.rect(x, y, avSize, avSize)
            ctx.closePath(); ctx.clip()

            if (status.emoji) ctx.filter = 'blur(2px) grayscale(0.4)'

            if (img.complete && img.naturalWidth > 0) ctx.drawImage(img, x, y, avSize, avSize)
            else { ctx.fillStyle = '#1e1e24'; ctx.fillRect(x, y, avSize, avSize); }

            ctx.filter = 'none'

            if (status.emoji) {
                ctx.fillStyle = 'rgba(0,0,0,0.5)'
                ctx.fillRect(x, y, avSize, avSize)

                const emojiSize = 24 * SETTINGS.scale * (SETTINGS.textScale || 1.0)
                ctx.font = `${emojiSize}px Segoe UI, Emoji`
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(status.emoji, x + avSize / 2, y + avSize / 2 + 2)
            }
            ctx.restore()

            ctx.strokeStyle = status.emoji ? (status.isWin ? C.green : C.red) : 'rgba(255,255,255,0.15)'
            ctx.lineWidth = 1; ctx.beginPath()
            if (ctx.roundRect) ctx.roundRect(x, y, avSize, avSize, r); else ctx.rect(x, y, avSize, avSize)
            ctx.stroke()
        }

        if (SETTINGS.showAvatars) {
            if (!isFocus) {
                drawAvatar(imgCache.lAvatar, lAnchorX, topPadding, data.lStatus)
            }
            drawAvatar(imgCache.rAvatar, rAnchorX, topPadding, data.rStatus)
        }

        const maxNameW = (CX - (isFocus ? 0 : lNameX) - (20 * SETTINGS.scale))
        const isAnyTopVisible = SETTINGS.showAvatars || SETTINGS.showNames || SETTINGS.showMMR || SETTINGS.showBuilds || SETTINGS.showMainTimer || SETTINGS.showStages

        if (data.lRatingDiff === null && !isFocus && isAnyTopVisible) {
            drawText(t('vs'), CX, topPadding + avSize / 1.6, 14, C.vsColor, 'center', '900')
        }

        if (SETTINGS.showNames) {
            if (!isFocus) {
                drawText(data.lName, lNameX, nameY, 16, C.green, lAlign, 'bold', maxNameW)
            }
            drawText(data.rName, rNameX, nameY, 16, C.red, rAlign, 'bold', maxNameW)
        }

        if (SETTINGS.showMMR) {
            if (!isFocus) {
                drawText(data.lMMR, lNameX, mmrY, 12, C.gold, lAlign, '600', maxNameW)
            }
            drawText(data.rMMR, rNameX, mmrY, 12, C.gold, rAlign, '600', maxNameW)

            if (data.lRatingDiff !== null) {
                const rDiffColor = data.rRatingDiff > 0 ? C.green : C.red
                const diffStr = (data.rRatingDiff > 0 ? "+" : "") + data.rRatingDiff

                if (isFocus) {
                    const mmrW = ctx.measureText(data.rMMR).width + (5 * SETTINGS.scale)
                    drawText(diffStr, rNameX + mmrW, mmrY, 12, rDiffColor, 'left', 'bold')
                } else {
                    const rMmrW = ctx.measureText(data.rMMR).width + (5 * SETTINGS.scale)
                    drawText(diffStr, rNameX - rMmrW, mmrY, 12, rDiffColor, 'right', 'bold')

                    const lDiffColor = data.lRatingDiff > 0 ? C.green : C.red
                    const lMmrW = ctx.measureText(data.lMMR).width + (5 * SETTINGS.scale)
                    drawText((data.lRatingDiff > 0 ? "+" : "") + data.lRatingDiff, lNameX + lMmrW, mmrY, 12, lDiffColor, 'left', 'bold')
                }
            }
        }

        let buildsBottomY = 0

        if (!isFocus) {
            let currentStdY = topPadding;
            if (SETTINGS.showAvatars) currentStdY += avSize + (6 * SETTINGS.scale)
            if (SETTINGS.showNames) currentStdY += (20 * SETTINGS.scale)
            if (SETTINGS.showMMR) currentStdY += (15 * SETTINGS.scale)

            buildStartY = currentStdY
        }

        if (isFocus) {
        } else if (!SETTINGS.showAvatars) {
            buildStartY = mmrY + (12 * SETTINGS.scale)
        }

        const drawBuilds = (buildData, startX, startY, align) => {
            if (!SETTINGS.showBuilds) return startY
            if (!buildData) return startY

            const gap = 2 * SETTINGS.scale
            const size = buildIconSize
            const lvlSize = Math.max(8, size * 0.45)

            const rows = [buildData.weapons, buildData.tomes]
            let currentY = startY

            rows.forEach(rowItems => {
                if (!rowItems || rowItems.length === 0) {
                    currentY += size + gap
                    return
                }

                const rowCount = rowItems.length
                const totalRowW = rowCount * size + (rowCount - 1) * gap
                let drawX = 0

                if (align === 'center') {
                    drawX = startX - (totalRowW / 2)
                } else if (align === 'left') {
                    drawX = startX
                } else {
                    drawX = (startX + avSize) - totalRowW
                }

                rowItems.forEach((item, idx) => {
                    const bx = drawX + idx * (size + gap)
                    const by = currentY

                    const img = getCachedImage(item.src)
                    if (img && img.complete && img.naturalWidth > 0) {
                        ctx.drawImage(img, bx, by, size, size)
                        ctx.strokeStyle = C.buildBorder; ctx.lineWidth = 1
                        ctx.strokeRect(bx, by, size, size)

                        if (item.lvl) {
                            ctx.fillStyle = 'rgba(0,0,0,0.7)'
                            ctx.fillRect(bx + size - (lvlSize * 1.2), by + size - lvlSize, lvlSize * 1.2, lvlSize)
                            ctx.fillStyle = '#fff'
                            ctx.font = `bold ${lvlSize * (SETTINGS.textScale || 1.0)}px Segoe UI`
                            ctx.textAlign = 'center'
                            ctx.fillText(item.lvl, bx + size - (lvlSize * 0.6), by + size - 1)
                        }
                    }
                })

                if (rows.length > 1 && rowItems === rows[0] && rowItems.length > 0) {
                    const sepY = currentY + size + gap / 2
                    const lEdge = align === 'left' ? startX : (drawX)
                    const w = (4 * size) + (3 * gap)
                    const lineX = drawX
                    const lineW = totalRowW

                    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1
                    ctx.beginPath(); ctx.moveTo(lineX, sepY); ctx.lineTo(lineX + lineW, sepY); ctx.stroke()
                }

                currentY += size + gap
            })

            return currentY
        }

        if (SETTINGS.showBuilds) {
            let lEnd = 0
            if (!isFocus) {
                lEnd = drawBuilds(data.lBuild, leftContentPad, buildStartY, 'left')
            }
            const rStartAnchor = isFocus ? CX : (W - rightContentPad - avSize)
            const rEnd = drawBuilds(data.rBuild, rStartAnchor, buildStartY, isFocus ? 'center' : 'right')
            buildsBottomY = Math.max(lEnd, rEnd)
        }

        let boxY = topPadding + (SETTINGS.showNames ? (38 * SETTINGS.scale) : 0) + (15 * SETTINGS.scale)

        if (isFocus) {
            const contentBottom = buildsBottomY > 0 ? buildsBottomY : buildStartY
            boxY = contentBottom + (5 * SETTINGS.scale)
        } else {
            const contentBottom = buildsBottomY > 0 ? buildsBottomY : buildStartY
            boxY = contentBottom + (5 * SETTINGS.scale)
        }

        const timerFont = `bold ${18 * SETTINGS.scale * (SETTINGS.textScale || 1.0)}px Segoe UI`
        ctx.font = timerFont
        const timeSampleW = ctx.measureText("00:00").width
        const minBoxW = 110 * SETTINGS.scale
        const dynBoxW = (timeSampleW * 2.5) + (20 * SETTINGS.scale)
        const boxW = Math.max(minBoxW, dynBoxW)

        const boxH = 24 * SETTINGS.scale
        const boxX = CX - boxW / 2

        if (SETTINGS.showMainTimer) {
            if (data.lRatingDiff !== null) {
                let resText = t('draw')
                let resColor = '#888'
                if (data.lRatingDiff > 0) { resText = t('win'); resColor = C.green; }
                else if (data.lRatingDiff < 0) { resText = t('loss'); resColor = C.red; }

                ctx.fillStyle = C.badgeBg; ctx.strokeStyle = resColor; ctx.lineWidth = 1
                ctx.beginPath()
                if (ctx.roundRect) ctx.roundRect(boxX, boxY, boxW, boxH, 6); else ctx.rect(boxX, boxY, boxW, boxH)
                ctx.fill(); ctx.stroke()

                const resY = boxY + (17 * SETTINGS.scale)
                drawText(resText, CX, resY, 16, resColor, 'center', '900')

            } else {

                const lColor = data.lPaused ? C.gold : '#ddd'
                const rColor = data.rPaused ? C.gold : '#ddd'

                if (SETTINGS.separateTimers && !isFocus) {
                    const timeY = boxY + (17 * SETTINGS.scale)

                    drawText(padTimer(data.lTime), leftContentPad, timeY, 18, lColor, 'left', 'bold')
                    drawText(padTimer(data.rTime), W - rightContentPad, timeY, 18, rColor, 'right', 'bold')

                } else {
                    ctx.fillStyle = C.badgeBg; ctx.strokeStyle = C.badgeBorder; ctx.lineWidth = 1
                    ctx.beginPath()
                    if (ctx.roundRect) ctx.roundRect(boxX, boxY, boxW, boxH, 6); else ctx.rect(boxX, boxY, boxW, boxH)
                    ctx.fill(); ctx.stroke()

                    const timeY = boxY + (17 * SETTINGS.scale)
                    const halfW = boxW / 2

                    if (isFocus) {
                        drawText(padTimer(data.rTime), CX, timeY, 18, rColor, 'center', 'bold')
                    } else {
                        drawText(padTimer(data.lTime), boxX + (boxW * 0.25), timeY, 18, lColor, 'center', 'bold')
                        drawText(padTimer(data.rTime), boxX + (boxW * 0.75), timeY, 18, rColor, 'center', 'bold')
                        ctx.strokeStyle = '#555'; ctx.lineWidth = 1; ctx.beginPath()
                        ctx.moveTo(CX, boxY + 4); ctx.lineTo(CX, boxY + boxH - 4); ctx.stroke()
                    }
                }
            }
        }

        // Overtime timer - shows pause/overtime time
        let overtimeHeight = 0
        if (SETTINGS.showOvertimeTimer && data.lRatingDiff === null && (data.lOvertime || data.rOvertime)) {
            const overtimeY = (SETTINGS.showMainTimer ? boxY + boxH : (buildsBottomY > 0 ? buildsBottomY : buildStartY)) + (4 * SETTINGS.scale)
            const overtimeFontSize = 12
            const lOvertimeStr = data.lOvertime ? `⏱ ${data.lOvertime}` : ''
            const rOvertimeStr = data.rOvertime ? `⏱ ${data.rOvertime}` : ''
            const overtimeColor = '#999'

            if (SETTINGS.separateTimers && !isFocus) {
                if (lOvertimeStr) drawText(lOvertimeStr, leftContentPad, overtimeY + (10 * SETTINGS.scale), overtimeFontSize, overtimeColor, 'left', '600')
                if (rOvertimeStr) drawText(rOvertimeStr, W - rightContentPad, overtimeY + (10 * SETTINGS.scale), overtimeFontSize, overtimeColor, 'right', '600')
            } else if (isFocus) {
                if (rOvertimeStr) drawText(rOvertimeStr, CX, overtimeY + (10 * SETTINGS.scale), overtimeFontSize, overtimeColor, 'center', '600')
            } else {
                if (lOvertimeStr) drawText(lOvertimeStr, boxX + (boxW * 0.25), overtimeY + (10 * SETTINGS.scale), overtimeFontSize, overtimeColor, 'center', '600')
                if (rOvertimeStr) drawText(rOvertimeStr, boxX + (boxW * 0.75), overtimeY + (10 * SETTINGS.scale), overtimeFontSize, overtimeColor, 'center', '600')
            }
            overtimeHeight = (22 * SETTINGS.scale)
        }

        let currentY;
        if (SETTINGS.showMainTimer || SETTINGS.showOvertimeTimer) {
            currentY = boxY + boxH + overtimeHeight
        } else {
            currentY = (buildsBottomY > 0 ? buildsBottomY : buildStartY) + (5 * SETTINGS.scale)
        }

        if (SETTINGS.showStages || SETTINGS.showEventTimers) {
            const stageY = currentY + (12 * SETTINGS.scale)
            const eventY = stageY + (18 * SETTINGS.scale)

            if (!isFocus) {
                if (SETTINGS.showStages) {
                    drawText(`${t('stage')} ${data.lStage}`, leftContentPad, stageY, 14, '#fff', 'left', 'bold')
                    drawText(`${t('stage')} ${data.rStage}`, W - rightContentPad, stageY, 14, '#fff', 'right', 'bold')
                }
                if (SETTINGS.showEventTimers) {
                    const evY = SETTINGS.showStages ? eventY : (currentY + (12 * SETTINGS.scale))
                    drawText(data.lEvent.text, leftContentPad, evY, 12, data.lEvent.color, 'left', '600')
                    drawText(data.rEvent.text, W - rightContentPad, evY, 12, data.rEvent.color, 'right', '600')
                    currentY = evY
                } else {
                    currentY = stageY
                }
            } else {
                if (SETTINGS.showStages) {
                    drawText(`${t('stage')} ${data.rStage}`, CX, stageY, 14, '#fff', 'center', 'bold')
                }
                if (SETTINGS.showEventTimers) {
                    const evY = SETTINGS.showStages ? eventY : (currentY + (12 * SETTINGS.scale))
                    drawText(data.rEvent.text, CX, evY, 12, data.rEvent.color, 'center', '600')
                    currentY = evY
                } else {
                    currentY = stageY
                }
            }
        }

        if (SETTINGS.showStats) {
            const gridGap = isCompactMode ? (2 * SETTINGS.scale) : (15 * SETTINGS.scale)

            const yGridHeader = currentY + gridGap
            ctx.strokeStyle = `rgba(255,255,255,${0.08 * SETTINGS.opacity})`
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, yGridHeader); ctx.lineTo(W, yGridHeader); ctx.stroke()

            const Y_START = yGridHeader + (24 * SETTINGS.scale)
            const ROW_HEIGHT = 58 * SETTINGS.scale
            const drawSeparator = (y) => {
                ctx.strokeStyle = C.separator; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(W - 30, y); ctx.stroke()
            }

            const drawRow = (label, lMain, lSub, rMain, rSub, diffVal, diffFormatFn, yPos) => {
                drawText(label, CX, yPos - (10 * SETTINGS.scale), 10, '#666', 'center', '800')
                const diffStr = (diffVal > 0 ? '+' : '') + diffFormatFn(diffVal)
                ctx.font = `bold ${13 * SETTINGS.scale * (SETTINGS.textScale || 1.0)}px Segoe UI`; const textM = ctx.measureText(diffStr)
                const badgeW = textM.width + (14 * SETTINGS.scale); const badgeH = 19 * SETTINGS.scale
                const badgeX = CX - badgeW / 2; const badgeY = yPos
                ctx.fillStyle = C.badgeBg; ctx.strokeStyle = C.badgeBorder; ctx.beginPath()
                if (ctx.roundRect) ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4); else ctx.rect(badgeX, badgeY, badgeW, badgeH)
                ctx.fill(); ctx.stroke()
                const dColor = diffVal > 0 ? C.green : (diffVal < 0 ? C.red : '#888')
                drawText(diffStr, CX, badgeY + (14 * SETTINGS.scale), 13, dColor, 'center', 'bold')

                const textY = yPos + (12 * SETTINGS.scale)
                const lColor = lMain > rMain ? C.green : (lMain < rMain ? '#777' : '#fff')
                const centerLimit = (W / 2) - (40 * SETTINGS.scale)
                const lStatX = Math.max(leftContentPad, CX - centerLimit)
                const rStatX = Math.min(W - rightContentPad, CX + centerLimit)

                drawText(formatNum(lMain), lStatX, textY, 20, lColor, 'left', 'bold')
                if (lSub) drawText(lSub, lStatX, textY + (16 * SETTINGS.scale), 12, '#888', 'left', '600')
                const rColor = rMain > lMain ? C.red : (rMain < lMain ? '#777' : '#fff')
                drawText(formatNum(rMain), rStatX, textY, 20, rColor, 'right', 'bold')
                if (rSub) drawText(rSub, rStatX, textY + (16 * SETTINGS.scale), 12, '#888', 'right', '600')
            }

            const rows = []
            if (SETTINGS.showKills) {
                rows.push({
                    type: 'row',
                    label: t('kills'),
                    lMain: data.lKills, lSub: formatNum(data.lKpm, true) + '/м',
                    rMain: data.rKills, rSub: formatNum(data.rKpm, true) + '/м',
                    diff: data.lKills - data.rKills,
                    fmt: (v) => formatNum(v)
                })
            }
            if (SETTINGS.showLevel) {
                rows.push({
                    type: 'row',
                    label: t('level'),
                    lMain: data.lLvl, lSub: formatNum(data.lLpm, true) + '/м',
                    rMain: data.rLvl, rSub: formatNum(data.rLpm, true) + '/м',
                    diff: data.lLvl - data.rLvl,
                    fmt: (v) => v
                })
            }
            if (SETTINGS.showDiff) {
                rows.push({
                    type: 'diff',
                    label: t('diff'),
                    val: data.lDiff - data.rDiff
                })
            }

            let currentYPos = Y_START
            rows.forEach((row, idx) => {
                if (row.type === 'row') {
                    drawRow(row.label, row.lMain, row.lSub, row.rMain, row.rSub, row.diff, row.fmt, currentYPos)

                    if (idx < rows.length - 1) {
                        drawSeparator(currentYPos + (ROW_HEIGHT / 2) + (5 * SETTINGS.scale))
                    }
                    currentYPos += ROW_HEIGHT

                } else if (row.type === 'diff') {
                    // Custom rendering for Diff row to match original style
                    drawText(t('diff'), CX, currentYPos - (10 * SETTINGS.scale), 10, '#666', 'center', '800')
                    const diffVal = row.val
                    const diffStr = (diffVal > 0 ? '+' : '') + formatNum(diffVal) + '%'

                    ctx.font = `bold ${13 * SETTINGS.scale * (SETTINGS.textScale || 1.0)}px Segoe UI`
                    const dW = ctx.measureText(diffStr).width + (14 * SETTINGS.scale)
                    const dH = 19 * SETTINGS.scale
                    const dX = CX - dW / 2
                    const dY = currentYPos

                    ctx.fillStyle = C.badgeBg; ctx.strokeStyle = C.badgeBorder; ctx.lineWidth = 1
                    ctx.beginPath()
                    if (ctx.roundRect) ctx.roundRect(dX, dY, dW, dH, 4); else ctx.rect(dX, dY, dW, dH)
                    ctx.fill(); ctx.stroke()

                    const dColorD = diffVal > 0 ? C.green : (diffVal < 0 ? C.red : '#888')
                    drawText(diffStr, CX, dY + (14 * SETTINGS.scale), 13, dColorD, 'center', 'bold')

                    const diffTextY = currentYPos + (12 * SETTINGS.scale)
                    const centerLimitDiff = (W / 2) - (40 * SETTINGS.scale)
                    const lStatDiffX = Math.max(leftContentPad, CX - centerLimitDiff)
                    const rStatDiffX = Math.min(W - rightContentPad, CX + centerLimitDiff)

                    const ldColor = data.lDiff > data.rDiff ? C.green : (data.rDiff > data.lDiff ? '#777' : '#fff')
                    drawText(data.lDiff + '%', lStatDiffX, diffTextY, 20, ldColor, 'left', 'bold')
                    const rdColor = data.rDiff > data.lDiff ? C.red : (data.lDiff > data.rDiff ? '#777' : '#fff')
                    drawText(data.rDiff + '%', rStatDiffX, diffTextY, 20, rdColor, 'right', 'bold')

                    // Separator handled by previous row usually, or if we add more
                    currentYPos += (45 * SETTINGS.scale)
                }
            })

            currentY = currentYPos
        }

        if (SETTINGS.showCommonBans && data.commonBans && data.commonBans.length > 0) {
            const commonBanSize = banSize
            const gap = banGap

            const totalBanW = data.commonBans.length * commonBanSize + (data.commonBans.length - 1) * gap
            let startX = CX - totalBanW / 2

            let banY = currentY + (8 * SETTINGS.scale)

            data.commonBans.forEach(src => {
                const img = getCachedImage(src)
                if (img && img.complete && img.naturalWidth > 0) {
                    ctx.drawImage(img, startX, banY, commonBanSize, commonBanSize)
                    ctx.strokeStyle = C.banBorder; ctx.lineWidth = 1; ctx.strokeRect(startX, banY, commonBanSize, commonBanSize)
                }
                startX += commonBanSize + gap
            })
        }


    }

    function initSystem() {
        canvas = document.createElement('canvas')
        canvas.width = SETTINGS.canvasWidth
        canvas.height = BASE_HEIGHT
        ctx = canvas.getContext('2d')

        videoEl = document.createElement('video')
        videoEl.muted = true
        videoEl.width = SETTINGS.canvasWidth
        videoEl.height = BASE_HEIGHT
        videoEl.style.position = 'fixed'
        videoEl.style.top = '-9999px'
        document.body.appendChild(videoEl)

        const stream = canvas.captureStream(15)
        videoEl.srcObject = stream
        videoEl.play().catch(e => { })

        const style = document.createElement('style')
        style.textContent = css
        document.head.appendChild(style)

        createControlPanel()
        createPopups()
    }

    function createControlPanel() {
        controlPanel = document.createElement('div')
        controlPanel.id = 'ml-control-panel'

        const createBtn = (id, text, onClick, isDot = false) => {
            const btn = document.createElement('div')
            btn.id = id
            btn.className = 'ml-main-btn'
            if (isDot) btn.innerHTML = `<div class="ml-dot"></div><span>${text}</span>`
            else btn.innerHTML = `<span>${text}</span>`
            btn.onclick = onClick
            return btn
        }

        const visBtn = createBtn('ml-btn-vis', t('vis_btn'), () => togglePanel('vis'))
        const setBtn = createBtn('ml-btn-set', t('set_btn'), () => togglePanel('set'))
        const mainBtn = createBtn('ml-btn-main', t('open_btn'), togglePiP, true)

        const testBtn = createBtn('ml-btn-test', t('test_mode'), () => {
            isTestMode = !isTestMode
            const testBtnEl = document.getElementById('ml-btn-test')
            if (testBtnEl) {
                const dot = testBtnEl.querySelector('.ml-dot')
                const txt = testBtnEl.querySelector('span:last-child')
                if (dot) dot.classList.toggle('active', isTestMode)
                if (txt) txt.textContent = isTestMode ? t('test_active') : t('test_mode')
                testBtnEl.classList.toggle('active-btn', isTestMode)
            }
        }, true)

        controlPanel.appendChild(mainBtn)
        controlPanel.appendChild(document.createElement('div')).style.width = '5px'
        controlPanel.appendChild(visBtn)
        controlPanel.appendChild(setBtn)
        controlPanel.appendChild(testBtn)

        document.body.appendChild(controlPanel)
    }

    function createPopups() {
        visibilityPanel = document.createElement('div')
        visibilityPanel.id = 'ml-vis-panel'
        visibilityPanel.id = 'ml-vis-panel'
        visibilityPanel.className = 'ml-popup-panel'

        // Warning element for Visibility Panel
        const visWarning = document.createElement('div')
        visWarning.id = 'ml-vis-warning'
        visWarning.className = 'ml-warning-msg'
        visWarning.textContent = t('warn_focus')
        visibilityPanel.appendChild(visWarning)

        const toggles = [
            { id: 'fullFocusMode', label: t('full_focus') },
            { id: 'focusRival', label: t('focus_mode') },
            { id: 'separateTimers', label: t('sep_timers') },
            { id: 'showAvatars', label: t('avatars') }, { id: 'showNames', label: t('names') }, { id: 'showMMR', label: t('mmr') },
            { id: 'showBuilds', label: t('builds') },
            { id: 'showMainTimer', label: t('main_timer') },
            { id: 'showStages', label: t('stages') },
            { id: 'showEventTimers', label: t('event_timers') },
            { id: 'showOvertimeTimer', label: t('overtime_timer') },
            { id: 'showLeftBans', label: t('my_bans') },
            { id: 'showRightBans', label: t('enemy_bans') },
            { id: 'showCommonBans', label: t('common_bans') },
            { id: 'showStats', label: t('stats_table') },
            { id: 'showKills', label: t('s_kills') },
            { id: 'showLevel', label: t('s_level') },
            { id: 'showDiff', label: t('s_diff') }
        ]

        toggles.forEach(t => {
            const row = document.createElement('label')
            row.className = 'ml-chk-row'
            row.id = `ml-row-${t.id}` // Add ID for disabling
            row.innerHTML = `<input type="checkbox" id="ml-chk-${t.id}" ${SETTINGS[t.id] ? 'checked' : ''}> <span>${t.label}</span>`
            row.onchange = (e) => updateSetting(t.id, e.target.checked)
            visibilityPanel.appendChild(row)
        })
        document.body.appendChild(visibilityPanel)

        settingsPanel = document.createElement('div')
        settingsPanel.id = 'ml-set-panel'
        settingsPanel.className = 'ml-popup-panel'

        // Warning element for Settings Panel
        const setWarning = document.createElement('div')
        setWarning.id = 'ml-set-warning'
        setWarning.className = 'ml-warning-msg'
        setWarning.textContent = t('warn_focus')
        settingsPanel.appendChild(setWarning)

        // --- Profile UI ---
        const profileRow = document.createElement('div')
        profileRow.className = 'ml-set-row'
        profileRow.style.marginBottom = '12px'
        profileRow.style.paddingBottom = '8px'
        profileRow.style.borderBottom = '1px solid rgba(255,255,255,0.1)'

        const profileLabel = document.createElement('div')
        profileLabel.className = 'ml-set-label'
        profileLabel.textContent = t('profile')

        const profileCtrls = document.createElement('div')
        profileCtrls.className = 'ml-set-ctrls'
        profileCtrls.style.flexGrow = '1'
        profileCtrls.style.justifyContent = 'flex-end'

        const profileSel = document.createElement('select')
        profileSel.style.background = 'rgba(255,255,255,0.05)'
        profileSel.style.color = '#fff'
        profileSel.style.border = '1px solid rgba(255,255,255,0.1)'
        profileSel.style.borderRadius = '4px'
        profileSel.style.padding = '2px 4px'
        profileSel.style.fontSize = '12px'
        profileSel.style.marginRight = '8px'
        profileSel.style.outline = 'none'
        profileSel.style.maxWidth = '100px'
        profileSel.style.cursor = 'pointer'

        const updateOptionsClick = () => {
            // Force dark background on options for Windows
            Array.from(profileSel.options).forEach(opt => {
                opt.style.background = '#1e1e24'
                opt.style.color = '#fff'
            })
        }

        const saveBtn = document.createElement('div')
        saveBtn.className = 'ml-mini-btn'
        saveBtn.textContent = t('save')
        saveBtn.title = 'Save Profile'

        const delBtn = document.createElement('div')
        delBtn.className = 'ml-mini-btn'
        delBtn.textContent = t('del')
        delBtn.title = 'Delete Profile'

        const updateProfileSelector = () => {
            profileSel.innerHTML = ''
            const profiles = ProfileManager.getProfiles()
            Object.keys(profiles).forEach(name => {
                const opt = document.createElement('option')
                opt.value = name
                opt.textContent = name
                opt.style.background = '#141419' // Dark background for options
                opt.style.color = '#fff'
                profileSel.appendChild(opt)
            })
            profileSel.value = ProfileManager.currentProfile

            // Update Delete button state (disable for defaults)
            if (DEFAULT_PROFILES[ProfileManager.currentProfile]) {
                delBtn.style.opacity = '0.3'
                delBtn.style.pointerEvents = 'none'
            } else {
                delBtn.style.opacity = '1'
                delBtn.style.pointerEvents = 'auto'
            }
        }

        // Expose to ProfileManager so it can trigger updates
        ProfileManager.updateUI = updateProfileSelector

        profileSel.onchange = (e) => {
            ProfileManager.loadProfile(e.target.value)
            updateProfileSelector()
        }

        saveBtn.onclick = () => {
            const name = prompt(t('new_profile'), 'Custom 1')
            if (name) {
                if (ProfileManager.saveProfile(name)) {
                    updateProfileSelector()
                } else {
                    alert('Cannot overwrite default profiles!')
                }
            }
        }

        delBtn.onclick = () => {
            const name = ProfileManager.currentProfile
            if (confirm(`Delete profile "${name}"?`)) {
                if (ProfileManager.deleteProfile(name)) {
                    updateProfileSelector()
                }
            }
        }

        updateProfileSelector() // Init

        profileCtrls.appendChild(profileSel)
        profileCtrls.appendChild(saveBtn)
        profileCtrls.appendChild(delBtn)
        profileRow.appendChild(profileLabel)
        profileRow.appendChild(profileCtrls)
        settingsPanel.appendChild(profileRow)


        const createSetRow = (label, key, step, min, max, fmt) => {
            const row = document.createElement('div')
            row.className = 'ml-set-row'
            row.innerHTML = `<span class="ml-set-label">${label}</span>
                <div class="ml-set-ctrls">
                    <div class="ml-mini-btn" id="ml-dec-${key}">-</div>
                    <input class="ml-val-input" id="ml-val-${key}" type="number" step="${step}" value="${fmt(SETTINGS[key])}">
                    <div class="ml-mini-btn" id="ml-inc-${key}">+</div>
                </div>`

            const input = row.querySelector('input')

            const saveVal = (val) => {
                let newVal = parseFloat(val)
                if (isNaN(newVal)) newVal = min
                newVal = Math.max(min, Math.min(max, newVal))
                updateSetting(key, newVal)
                input.value = fmt(newVal)
            }

            input.onchange = (e) => saveVal(e.target.value)

            row.querySelector(`#ml-dec-${key}`).onclick = () => saveVal(SETTINGS[key] - step)
            row.querySelector(`#ml-inc-${key}`).onclick = () => saveVal(SETTINGS[key] + step)

            return row
        }

        // Language Toggle
        const langRow = document.createElement('div')
        langRow.className = 'ml-set-row'
        langRow.innerHTML = `<span class="ml-set-label">${t('language')}</span>
            <div class="ml-set-ctrls" style="cursor:pointer; font-weight:bold; color:#fff; background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:4px;">
                ${SETTINGS.language.toUpperCase()}
            </div>`
        langRow.querySelector('.ml-set-ctrls').onclick = () => {
            const newLang = SETTINGS.language === 'ru' ? 'en' : 'ru'
            updateSetting('language', newLang)
            location.reload()
        }
        settingsPanel.appendChild(langRow)


        settingsPanel.appendChild(createSetRow(t('text_size'), 'textScale', 0.1, 0.5, 2.5, v => v.toFixed(1)))
        settingsPanel.appendChild(createSetRow(t('build_size'), 'buildScale', 0.1, 0.5, 2.0, v => v.toFixed(1)))
        settingsPanel.appendChild(createSetRow(t('width'), 'canvasWidth', 50, 400, 1000, v => v))
        settingsPanel.appendChild(createSetRow(t('height'), 'canvasHeight', 20, 20, 2000, v => v))
        settingsPanel.appendChild(createSetRow(t('ban_size'), 'banScale', 0.1, 0.5, 2.0, v => v.toFixed(1)))
        settingsPanel.appendChild(createSetRow(t('opacity'), 'opacity', 0.1, 0.1, 1.0, v => v.toFixed(1)))

        document.body.appendChild(settingsPanel)
    }

    function togglePanel(name) {
        visibilityPanel.classList.remove('open')
        settingsPanel.classList.remove('open')

        document.querySelectorAll('.ml-main-btn').forEach(b => b.classList.remove('active-btn'))

        if (activePanel === name) {
            activePanel = null
            controlPanel.classList.remove('locked')
        } else {
            activePanel = name
            controlPanel.classList.add('locked')
            if (name === 'vis') {
                visibilityPanel.classList.add('open')
                document.getElementById('ml-btn-vis').classList.add('active-btn')
            }
            if (name === 'set') {
                settingsPanel.classList.add('open')
                document.getElementById('ml-btn-set').classList.add('active-btn')
            }
            updateUIState() // Update UI when opening
        }
    }

    function updateSetting(key, value, skipStateUpdate = false) {
        SETTINGS[key] = value

        // Map settings to localStorage keys
        const keyMap = {
            'opacity': 'opacity',
            'scale': 'font_scale',
            'textScale': 'text_scale',
            'banScale': 'ban_scale',
            'buildScale': 'build_scale',
            'canvasWidth': 'canvas_width',
            'canvasHeight': 'canvas_height',
            'showAvatars': 'show_avatars',
            'showNames': 'show_names',
            'showMMR': 'show_mmr',
            'showKills': 'show_kills',
            'showLevel': 'show_level',
            'showDiff': 'show_diff',
            'separateTimers': 'separate_timers',
            'showStages': 'show_stages',
            'showEventTimers': 'show_event_timers',
            'showLeftBans': 'show_left_bans',
            'showRightBans': 'show_right_bans',
            'showCommonBans': 'show_common_bans',
            'showStats': 'show_stats',
            'showMainTimer': 'show_maintimer',
            'showBuilds': 'show_builds',
            'focusRival': 'focus_rival',
            'language': 'language',
            'fullFocusMode': 'full_focus_mode'
        }

        const suffix = keyMap[key] || key.replace(/^show/, 'show_').toLowerCase()
        localStorage.setItem(`ml_pip_${suffix}`, value)

        if (!skipStateUpdate) {
            updateUIState()
        }
    }

    function updateUIState() {
        // defined elements to help with state management
        const setOpacity = (id, enabled) => {
            const el = document.getElementById(id)
            if (!el) return
            if (enabled) {
                el.style.opacity = '1'
                el.style.pointerEvents = 'auto'
            } else {
                el.style.opacity = '0.3'
                el.style.pointerEvents = 'none'
            }
        }

        // Helper for checkboxes
        const setChk = (id, enabled) => setOpacity(`ml-row-${id}`, enabled)

        // Helper for settings rows with controls
        const setRow = (key, enabled) => {
            // Find row by finding input with that ID and getting parent's parent
            const input = document.getElementById(`ml-val-${key}`)
            if (input) {
                const row = input.closest('.ml-set-row')
                if (row) {
                    if (enabled) {
                        row.style.opacity = '1'
                        row.style.pointerEvents = 'auto'
                    } else {
                        row.style.opacity = '0.3'
                        row.style.pointerEvents = 'none'
                    }
                }
            }
        }

        const visWarn = document.getElementById('ml-vis-warning')
        const setWarn = document.getElementById('ml-set-warning')
        const showWarn = (show) => {
            if (visWarn) visWarn.style.display = show ? 'block' : 'none'
            if (setWarn) setWarn.style.display = show ? 'block' : 'none'
        }

        if (SETTINGS.fullFocusMode) {
            // Full Focus Mode: Disable almost everything
            showWarn(true)
            setChk('focusRival', false)
            setChk('separateTimers', false)

            setChk('showAvatars', false)
            setChk('showNames', false)
            setChk('showMMR', false)
            setChk('showBuilds', false)
            setChk('showMainTimer', false)
            setChk('showStages', false)
            setChk('showEventTimers', false)
            setChk('showLeftBans', false)
            setChk('showRightBans', false)
            setChk('showCommonBans', false)
            setChk('showStats', false)

            setRow('textScale', true) // Keep text scale
            setRow('buildScale', false)
            setRow('canvasWidth', false)
            setRow('canvasHeight', false)
            setRow('banScale', false)

        } else if (SETTINGS.focusRival) {
            // Focus Rival Mode: Disable Separate Timers
            showWarn(true)
            setChk('focusRival', true) // Ensure enabled
            setChk('separateTimers', false)

            // Enable others
            setChk('showAvatars', true)
            setChk('showNames', true)
            setChk('showMMR', true)
            setChk('showBuilds', true)
            setChk('showMainTimer', true)
            setChk('showStages', true)
            setChk('showEventTimers', true)
            setChk('showLeftBans', true)
            setChk('showRightBans', true)
            setChk('showCommonBans', true)
            setChk('showStats', true)

            setRow('textScale', true)
            setRow('buildScale', true)
            setRow('canvasWidth', true)
            setRow('canvasHeight', true)
            setRow('banScale', true)

        } else {
            // Normal Mode: Enable Everything
            showWarn(false)
            setChk('focusRival', true)
            setChk('separateTimers', true)

            setChk('showAvatars', true)
            setChk('showNames', true)
            setChk('showMMR', true)
            setChk('showBuilds', true)
            setChk('showMainTimer', true)
            setChk('showStages', true)
            setChk('showEventTimers', true)
            setChk('showLeftBans', true)
            setChk('showRightBans', true)
            setChk('showCommonBans', true)
            setChk('showStats', true)

            setRow('textScale', true)
            setRow('buildScale', true)
            setRow('canvasWidth', true)
            setRow('canvasHeight', true)
            setRow('banScale', true)
        }
    }

    async function togglePiP() {
        try {
            // Check if PiP API is supported (not available in Firefox)
            if (!document.pictureInPictureEnabled || typeof videoEl.requestPictureInPicture !== 'function') {
                alert(SETTINGS.language === 'ru'
                    ? 'Picture-in-Picture не поддерживается в этом браузере. Используйте Chrome, Edge или другой Chromium-браузер для режима PiP.'
                    : 'Picture-in-Picture is not supported in this browser. Please use Chrome, Edge, or another Chromium-based browser for PiP mode.')
                return
            }

            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture()
                isPipActive = false
            } else {
                await videoEl.play()
                await videoEl.requestPictureInPicture()
                isPipActive = true
            }
            const dot = controlPanel.querySelector('.ml-dot')
            const txt = controlPanel.querySelector('.ml-main-btn span:last-child')
            if (isPipActive) {
                dot.classList.add('active')
                txt.textContent = t('active_btn')
            } else {
                dot.classList.remove('active')
                txt.textContent = t('open_btn')
            }
        } catch (err) { console.error(err) }
    }

    function updateLoop() {
        // If test mode is active, use test data instead of parsing DOM
        if (isTestMode) {
            // Load test avatars
            const lTestAvatar = 'https://cdn.megabonk.su/media/heroes/fox-hero-megabonk_QHFo4Vk.webp'
            const rTestAvatar = 'https://cdn.megabonk.su/media/heroes/sir_chadwell-hero-megabonk_5LHozY7.webp'
            if (imgCache.lSrc !== lTestAvatar) { imgCache.lSrc = lTestAvatar; imgCache.lAvatar.src = lTestAvatar; }
            if (imgCache.rSrc !== rTestAvatar) { imgCache.rSrc = rTestAvatar; imgCache.rAvatar.src = rTestAvatar; }
            // Set localized events based on current language
            const testData = {
                ...TEST_DATA,
                lEvent: { text: `${t('swarm')} (01:30)`, color: '#d2b4de' },
                rEvent: { text: `${t('miniboss')} (00:45)`, color: '#f0b27a' }
            }

            drawOverlay(testData)
            return
        }

        const leftCol = document.querySelector('.lobby-page__player-column--left')
        if (!leftCol) return

        try {
            const rightCol = document.querySelector('.lobby-page__player-column--right')
            if (!rightCol) return

            const lImgSrc = leftCol.querySelector('.run-card__hero-image')?.src || ''
            const rImgSrc = rightCol.querySelector('.run-card__hero-image')?.src || ''
            if (lImgSrc !== imgCache.lSrc) { imgCache.lSrc = lImgSrc; imgCache.lAvatar.src = lImgSrc; }
            if (rImgSrc !== imgCache.rSrc) { imgCache.rSrc = rImgSrc; imgCache.rAvatar.src = rImgSrc; }

            const lName = leftCol.querySelector('.player-row__nickname')?.textContent || 'You'
            const rName = rightCol.querySelector('.player-row__nickname')?.textContent || 'Enemy'
            const lMMR = leftCol.querySelector('.player-row__rating-value')?.textContent || ''
            const rMMR = rightCol.querySelector('.player-row__rating-value')?.textContent || ''
            const lTimer = leftCol.querySelector('.run-card__timer-value')?.textContent || '45:00'
            const rTimer = rightCol.querySelector('.run-card__timer-value')?.textContent || '45:00'

            const lKills = parseComplexNumber(document.querySelectorAll('.kills-comparison__kills')[0]?.textContent || '0')
            const rKills = parseComplexNumber(document.querySelectorAll('.kills-comparison__kills')[1]?.textContent || '0')
            const lDiff = parseComplexNumber(leftCol.querySelector('.run-card__summary-item--difficulty .run-card__summary-value')?.textContent || '0')
            const rDiff = parseComplexNumber(rightCol.querySelector('.run-card__summary-item--difficulty .run-card__summary-value')?.textContent || '0')
            const lLvlText = leftCol.querySelector('.run-card__hero-level')?.textContent
            const rLvlText = rightCol.querySelector('.run-card__hero-level')?.textContent
            const lLvl = lLvlText ? parseLevel(lLvlText) : 0
            const rLvl = rLvlText ? parseLevel(rLvlText) : 0
            const lStage = parseInt((leftCol.querySelector('.run-card__stage')?.textContent || '1').replace(/\D/g, '')) || 1
            const rStage = parseInt((rightCol.querySelector('.run-card__stage')?.textContent || '1').replace(/\D/g, '')) || 1

            const lGT = parseTime(lTimer)
            const rGT = parseTime(rTimer)
            const lPlayed = Math.max(0.1, GAME_TOTAL_MINUTES - lGT)
            const rPlayed = Math.max(0.1, GAME_TOTAL_MINUTES - rGT)

            const lKpm = lKills / lPlayed
            const rKpm = rKills / rPlayed
            const lLpm = lLvl / lPlayed
            const rLpm = rLvl / rPlayed

            const lEvent = getNextEvent(lStage, lGT)
            const rEvent = getNextEvent(rStage, rGT)

            const parseBans = (container) => {
                if (!container) return []
                return Array.from(container.querySelectorAll('.run-card__ban-image')).map(img => img.src)
            }
            const lBans = parseBans(leftCol.querySelector('.run-card__bans-row'))
            const rBans = parseBans(rightCol.querySelector('.run-card__bans-row'))

            const parseBuild = (col) => {
                const getItems = (rowClass) => {
                    const row = col.querySelector(rowClass)
                    if (!row) return []
                    return Array.from(row.querySelectorAll('.pick-cube')).map(el => ({
                        src: el.querySelector('.pick-cube__image')?.src || '',
                        lvl: el.querySelector('.pick-cube__level')?.textContent.trim() || ''
                    }))
                }
                return {
                    weapons: getItems('.run-card__slots-row--weapons'),
                    tomes: getItems('.run-card__slots-row--tomes')
                }
            }
            const lBuild = parseBuild(leftCol)
            const rBuild = parseBuild(rightCol)

            const commonBansContainer = document.querySelector('.lobby-page__common-bans')
            let commonBans = []
            if (commonBansContainer) {
                const imgs = commonBansContainer.querySelectorAll('.ban-selector__image')
                commonBans = Array.from(imgs).map(img => img.src)
            }

            const parseStatus = (col) => {
                const banner = col.querySelector('.run-card__finished-banner')
                if (!banner) return { emoji: null, isWin: false }
                const text = banner.textContent.trim()
                const emoji = text.split(' ')[0]
                const isWin = text.toLowerCase().includes('victory') || text.toLowerCase().includes('finished')
                return { emoji, isWin }
            }
            const lStatus = parseStatus(leftCol)
            const rStatus = parseStatus(rightCol)

            const parseRatingChange = (col) => {
                const el = col.querySelector('.player-row__rating-change')
                if (!el) return null
                return parseInt(el.textContent.replace(/\s/g, ''), 10)
            }
            const lRatingDiff = parseRatingChange(leftCol)
            const rRatingDiff = parseRatingChange(rightCol)

            const parsePaused = (col) => !!col.querySelector('.run-card__pause-badge--active')
            const lPaused = parsePaused(leftCol)
            const rPaused = parsePaused(rightCol)

            const parseOvertime = (col) => {
                const badge = col.querySelector('.run-card__pause-badge')
                return badge ? badge.textContent.trim() : null
            }
            const lOvertime = parseOvertime(leftCol)
            const rOvertime = parseOvertime(rightCol)

            drawOverlay({
                lName, rName, lMMR, rMMR, lTime: lTimer, rTime: rTimer,
                lStage, rStage, lEvent, rEvent,
                lKills, rKills, lKpm, rKpm,
                lLvl, rLvl, lLpm, rLpm,
                lDiff, rDiff,
                lBans, rBans, commonBans,
                lStatus, rStatus,
                lRatingDiff, rRatingDiff,
                lPaused, rPaused,
                lOvertime, rOvertime,
                lBuild, rBuild
            })

        } catch (e) { console.error(e) }
    }

    document.addEventListener('leavepictureinpicture', () => {
        isPipActive = false
        const dot = controlPanel.querySelector('.ml-dot')
        const txt = controlPanel.querySelector('.ml-main-btn span:last-child')
        if (dot) {
            dot.classList.remove('active')
            if (txt) txt.textContent = 'ОТКРЫТЬ'
        }
    })

    setTimeout(() => {
        initSystem()
        setInterval(updateLoop, 1000)
    }, 2000)

})()