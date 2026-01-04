// ==UserScript==
// @name         FlatMMO Desktop Notifications
// @namespace    com.pizza1337.flatmmo.desktopnotifications
// @version      1.0.4
// @description  Adds desktop notifications for things such as: AFK detection, alien spawn and more
// @author       Pizza1337
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550698/FlatMMO%20Desktop%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/550698/FlatMMO%20Desktop%20Notifications.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const SOUND_LIBRARY = Object.freeze({
        alien_ping: {
                label: 'Alien Ping',
                synth: {
                        duration: 0.85,
                        envelope: {
                                attack: 0.02,
                                hold: 0.15,
                                decay: 0.2,
                                sustain: 0.4,
                                release: 0.3
                        },
                        layers: [
                                {
                                        type: 'square',
                                        gain: 0.8,
                                        sequence: [
                                                {
                                                        time: 0,
                                                        freq: 520
                                                },
                                                {
                                                        time: 0.25,
                                                        freq: 680
                                                },
                                                {
                                                        time: 0.5,
                                                        freq: 460
                                                }
                                        ],
                                        vibrato: {
                                                freq: 9,
                                                depth: 12
                                        }
                                },
                                {
                                        type: 'triangle',
                                        gain: 0.5,
                                        sequence: [
                                                {
                                                        time: 0,
                                                        freq: 260
                                                },
                                                {
                                                        time: 0.4,
                                                        freq: 330
                                                }
                                        ]
                                }
                        ]
                }
        },
        glass_tinkle: {
                label: 'Glass Tinkle',
                synth: {
                        duration: 0.6,
                        envelope: {
                                attack: 0.004,
                                hold: 0.08,
                                decay: 0.18,
                                sustain: 0.35,
                                release: 0.22
                        },
                        layers: [
                                {
                                        type: 'sine',
                                        gain: 0.8,
                                        sequence: [
                                                {
                                                        time: 0,
                                                        freq: 1200
                                                },
                                                {
                                                        time: 0.12,
                                                        freq: 1450
                                                },
                                                {
                                                        time: 0.3,
                                                        freq: 1100
                                                }
                                        ]
                                },
                                {
                                        type: 'triangle',
                                        gain: 0.3,
                                        sequence: [
                                                {
                                                        time: 0,
                                                        freq: 600
                                                },
                                                {
                                                        time: 0.2,
                                                        freq: 820
                                                }
                                        ]
                                }
                        ]
                }
        },
        sparkle_drop: {
                label: 'Sparkle Drop',
                synth: {
                        duration: 0.65,
                        envelope: {
                                attack: 0.006,
                                hold: 0.05,
                                decay: 0.18,
                                sustain: 0.3,
                                release: 0.2
                        },
                        layers: [
                                {
                                        type: 'square',
                                        gain: 0.7,
                                        sequence: [
                                                {
                                                        time: 0,
                                                        freq: 980
                                                },
                                                {
                                                        time: 0.14,
                                                        freq: 1280
                                                }
                                        ]
                                },
                                {
                                        type: 'sine',
                                        gain: 0.35,
                                        sequence: [
                                                {
                                                        time: 0,
                                                        freq: 490
                                                },
                                                {
                                                        time: 0.24,
                                                        freq: 640
                                                }
                                        ]
                                }
                        ]
                }
        },
        comet_ping: {
                label: 'Comet Ping',
                synth: {
                        duration: 0.75,
                        envelope: {
                                attack: 0.008,
                                hold: 0.07,
                                decay: 0.22,
                                sustain: 0.32,
                                release: 0.28
                        },
                        layers: [
                                {
                                        type: 'sawtooth',
                                        gain: 0.6,
                                        sequence: [
                                                {
                                                        time: 0,
                                                        freq: 760
                                                },
                                                {
                                                        time: 0.3,
                                                        freq: 910
                                                },
                                                {
                                                        time: 0.5,
                                                        freq: 700
                                                }
                                        ]
                                },
                                {
                                        type: 'sine',
                                        gain: 0.45,
                                        sequence: [
                                                {
                                                        time: 0,
                                                        freq: 380
                                                },
                                                {
                                                        time: 0.4,
                                                        freq: 520
                                                }
                                        ]
                                }
                        ]
                }
        },
        ember_click: {
                label: 'Ember Click',
                synth: {
                        duration: 0.4,
                        envelope: {
                                attack: 0.003,
                                hold: 0.04,
                                decay: 0.12,
                                sustain: 0.25,
                                release: 0.18
                        },
                        layers: [
                                {
                                        type: 'square',
                                        gain: 0.8,
                                        sequence: [
                                                {
                                                        time: 0,
                                                        freq: 840
                                                },
                                                {
                                                        time: 0.1,
                                                        freq: 980
                                                }
                                        ]
                                },
                                {
                                        type: 'triangle',
                                        gain: 0.35,
                                        sequence: [
                                                {
                                                        time: 0,
                                                        freq: 420
                                                },
                                                {
                                                        time: 0.16,
                                                        freq: 620
                                                }
                                        ]
                                }
                        ]
                }
        },
        signal_tick: {
                label: 'Signal Tick',
                synth: {
                        duration: 0.45,
                        envelope: {
                                attack: 0.003,
                                hold: 0.03,
                                decay: 0.1,
                                sustain: 0.2,
                                release: 0.15
                        },
                        layers: [
                                {
                                        type: 'square',
                                        gain: 0.85,
                                        sequence: [
                                                {
                                                        time: 0,
                                                        freq: 920
                                                },
                                                {
                                                        time: 0.08,
                                                        freq: 1260
                                                }
                                        ]
                                },
                                {
                                        type: 'sine',
                                        gain: 0.4,
                                        sequence: [
                                                {
                                                        time: 0,
                                                        freq: 310
                                                },
                                                {
                                                        time: 0.2,
                                                        freq: 520
                                                }
                                        ]
                                }
                        ]
                }
        }
    });
    const DEFAULT_SOUND_KEY = 'alien_ping';
    const DEFAULT_AFK_SOUND_KEY = 'glass_tinkle';
    const ALIEN_SOUND_OPTIONS = Object.freeze(
        Object.entries(SOUND_LIBRARY).map(([value, meta]) => ({ value, label: meta.label }))
    );

    const NPC_TRACKING_NAMES = Object.freeze(['alien']);
    const ALIEN_ICON = 'https://flatmmo.com/images/npcs/alien_stand1.png';
    const AFK_ICON = 'https://flatmmo.com/images/ui/sleep.png';
    const AFK_IDLE_ANIMATION = 'stand';
    const AFK_CHECK_INTERVAL_MS = 1000;
    const AFK_INTERACTION_EVENTS = Object.freeze(['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel']);
    const AFK_INTERACTION_THROTTLE_MS = 250;

    const SKILL_XP_VAR_KEYS = Object.freeze(['archery_xp', 'brewing_xp', 'cooking_xp', 'crafting_xp', 'enchantment_xp', 'farming_xp', 'firemake_xp', 'fishing_xp', 'forging_xp', 'health_xp', 'hunting_xp', 'magic_xp', 'melee_xp', 'mining_xp', 'stealing_xp', 'woodcutting_xp', 'worship_xp']);


    const DEFAULT_CONFIG = {
        alienNotify: true,
        alienSound: true,
        alienSoundChoice: DEFAULT_SOUND_KEY,
        alienSoundVolume: 100,
        afkNotify: true,
        afkSound: true,
        afkSoundChoice: DEFAULT_AFK_SOUND_KEY,
        afkSoundVolume: 100,
        afkDurationValue: '30',
        afkDurationUnits: 'seconds'
    };

    const DESPAWN_GRACE_MS = 600000;

    class DesktopNotificationsPlugin extends FlatMMOPlusPlugin {
        constructor() {
            super('desktop-notifications', {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        type: 'label',
                        label: 'Alien spawn alerts'
                    },
                    {
                        id: 'alienNotify',
                        label: 'Notification',
                        type: 'boolean',
                        default: true
                    },
                    {
                        id: 'alienSound',
                        label: 'Sound',
                        type: 'boolean',
                        default: true
                    },
                    {
                        id: 'alienSoundChoice',
                        label: ' ',
                        type: 'select',
                        options: ALIEN_SOUND_OPTIONS,
                        default: DEFAULT_SOUND_KEY
                    },
                    {
                        id: 'alienSoundVolume',
                        label: 'Volume (%)',
                        type: 'range',
                        min: 0,
                        max: 100,
                        step: 10,
                        default: 100
                    },
                    {
                        type: 'label',
                        label: 'AFK detection alerts'
                    },
                    {
                        id: 'afkNotify',
                        label: 'Notification',
                        type: 'boolean',
                        default: true
                    },
                    {
                        id: 'afkSound',
                        label: 'Sound',
                        type: 'boolean',
                        default: true
                    },
                    {
                        id: 'afkSoundChoice',
                        label: ' ',
                        type: 'select',
                        options: ALIEN_SOUND_OPTIONS,
                        default: DEFAULT_AFK_SOUND_KEY
                    },
                    {
                        id: 'afkSoundVolume',
                        label: 'Volume (%)',
                        type: 'range',
                        min: 0,
                        max: 100,
                        step: 10,
                        default: 100
                    },
                    {
                        id: 'afkDurationValue',
                        label: 'AFK threshold',
                        type: 'select',
                        options: Array.from({ length: 60 }, function (_, i) { return { value: String(i + 1), label: String(i + 1) }; }),
                        default: '30'
                    },
                    {
                        id: 'afkDurationUnits',
                        label: 'AFK threshold units',
                        type: 'select',
                        options: [
                            { value: 'seconds', label: 'Seconds' },
                            { value: 'minutes', label: 'Minutes' }
                        ],
                        default: 'seconds'
                    }
                ]
            });

            this.alienPresent = false;
            this.lastSeenTimestamp = 0;
            this.despawnTimer = null;
            this.audioContext = null;
            this.configCache = this.buildDefaultCache();
            this._permissionPromise = null;
            this.soundTesterObserver = null;
            this.afkMonitorId = null;
            this.afkState = this.createInitialAfkState();
            this.afkAnimationWarningLogged = false;
            this.afkXpWarningLogged = false;
            this.xpVarWarningLogged = false;
            this.lastTotalXpFromVars = NaN;
            this.animationGuardWarningLogged = false;
            this.npcLookupWarningLogged = false;
            this.boundAfkInteractionHandler = null;

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initSoundTester(), { once: true });
            } else {
                this.initSoundTester();
            }

            this.startAfkMonitor();
            this.readTotalXpFromVars();
            this.registerAfkInteractionGuards();
            if (typeof window !== 'undefined' && window.addEventListener) {
                window.addEventListener('beforeunload', () => this.stopAfkMonitor(), { once: true });
            }
        }


        onPaintNpcs() {
            this.scanTrackedNpcPresence();
        }

        onConfigsChanged() {
            this.configCache = this.buildConfigCache();
            if (this.alienPresent) {
                this.refreshPresenceTimer();
            }
            this.ensureSoundTester();
            this.resetAfkState();
            this.afkAnimationWarningLogged = false;
        }

        buildDefaultCache() {
            return this.normalizeConfig(DEFAULT_CONFIG);
        }

        buildConfigCache() {
            const afkDurationValue = (() => {
                const value = this.getConfig('afkDurationValue');
                return value !== undefined ? value : DEFAULT_CONFIG.afkDurationValue;
            })();
            const afkDurationUnits = this.getStringConfig('afkDurationUnits', DEFAULT_CONFIG.afkDurationUnits);
            return this.normalizeConfig({
                alienNotify: this.getBooleanConfig('alienNotify', DEFAULT_CONFIG.alienNotify),
                alienSound: this.getBooleanConfig('alienSound', DEFAULT_CONFIG.alienSound),
                alienSoundChoice: this.getStringConfig('alienSoundChoice', DEFAULT_CONFIG.alienSoundChoice),
                alienSoundVolume: this.getNumberConfig('alienSoundVolume', DEFAULT_CONFIG.alienSoundVolume),
                afkNotify: this.getBooleanConfig('afkNotify', DEFAULT_CONFIG.afkNotify),
                afkSound: this.getBooleanConfig('afkSound', DEFAULT_CONFIG.afkSound),
                afkSoundChoice: this.getStringConfig('afkSoundChoice', DEFAULT_CONFIG.afkSoundChoice),
                afkSoundVolume: this.getNumberConfig('afkSoundVolume', DEFAULT_CONFIG.afkSoundVolume),
                afkDurationValue,
                afkDurationUnits
            });
        }

        normalizeConfig(raw) {
            const alienSoundKey = (typeof raw.alienSoundChoice === 'string' && SOUND_LIBRARY[raw.alienSoundChoice])
                ? raw.alienSoundChoice
                : DEFAULT_SOUND_KEY;
            if (raw.alienSoundChoice !== alienSoundKey) {
                this.ensureConfigValue('alienSoundChoice', alienSoundKey);
            }
            const alienVolumePercent = this.clampPercent(raw.alienSoundVolume);

            const afkSoundKey = (typeof raw.afkSoundChoice === 'string' && SOUND_LIBRARY[raw.afkSoundChoice])
                ? raw.afkSoundChoice
                : DEFAULT_AFK_SOUND_KEY;
            if (raw.afkSoundChoice !== afkSoundKey) {
                this.ensureConfigValue('afkSoundChoice', afkSoundKey);
            }
            const afkVolumePercent = this.clampPercent(raw.afkSoundVolume ?? DEFAULT_CONFIG.afkSoundVolume);

            let durationValue = null;
            if (typeof raw.afkDurationValue === 'number' && Number.isFinite(raw.afkDurationValue)) {
                durationValue = raw.afkDurationValue;
            } else if (typeof raw.afkDurationValue === 'string' && raw.afkDurationValue.trim() !== '') {
                const parsed = Number.parseInt(raw.afkDurationValue, 10);
                if (!Number.isNaN(parsed)) {
                    durationValue = parsed;
                }
            }
            if (!Number.isFinite(durationValue)) {
                const fallback = Number.parseInt(DEFAULT_CONFIG.afkDurationValue, 10);
                durationValue = Number.isNaN(fallback) ? 30 : fallback;
            }
            const clampedDurationValue = Math.min(60, Math.max(1, Math.round(durationValue)));

            let durationUnits = (typeof raw.afkDurationUnits === 'string' && raw.afkDurationUnits.toLowerCase() === 'minutes')
                ? 'minutes'
                : 'seconds';
            const thresholdMs = clampedDurationValue * (durationUnits === 'minutes' ? 60000 : 1000);
            const unitLabel = durationUnits === 'minutes'
                ? (clampedDurationValue === 1 ? 'minute' : 'minutes')
                : (clampedDurationValue === 1 ? 'second' : 'seconds');
            const thresholdLabel = `${clampedDurationValue} ${unitLabel}`;

            return {
                alien: {
                    notify: !!raw.alienNotify,
                    sound: !!raw.alienSound,
                    soundKey: alienSoundKey,
                    volumePercent: alienVolumePercent,
                    volumeLevel: alienVolumePercent / 1000
                },
                afk: {
                    notify: !!raw.afkNotify,
                    sound: !!raw.afkSound,
                    soundKey: afkSoundKey,
                    volumePercent: afkVolumePercent,
                    volumeLevel: afkVolumePercent / 1000,
                    durationValue: clampedDurationValue,
                    durationUnits,
                    thresholdMs,
                    thresholdLabel
                }
            };
        }

        clampPercent(value) {
            const num = Number(value);
            if (!Number.isFinite(num)) {
                return 0;
            }
            return Math.min(100, Math.max(0, Math.round(num)));
        }

        getBooleanConfig(name, fallback) {
            const value = this.getConfig(name);
            if (typeof value === 'boolean') {
                return value;
            }
            return fallback;
        }

        getNumberConfig(name, fallback) {
            const value = this.getConfig(name);
            if (typeof value === 'number' && !Number.isNaN(value)) {
                return value;
            }
            if (typeof value === 'string' && value.trim() !== '') {
                const parsed = Number(value);
                if (!Number.isNaN(parsed)) {
                    return parsed;
                }
            }
            return fallback;
        }

        getStringConfig(name, fallback) {
            const value = this.getConfig(name);
            if (typeof value === 'string' && value.trim() !== '') {
                return value;
            }
            return fallback;
        }

        ensureConfigValue(name, value) {
            try {
                if (typeof this.setConfig === 'function') {
                    this.setConfig(name, value);
                    return true;
                }
                if (typeof FlatMMOPlus !== 'undefined') {
                    if (typeof FlatMMOPlus.updateConfig === 'function') {
                        FlatMMOPlus.updateConfig(this.id, name, value);
                        return true;
                    }
                    if (typeof FlatMMOPlus.setConfig === 'function') {
                        FlatMMOPlus.setConfig(this.id, name, value);
                        return true;
                    }
                }
            } catch (err) {
                // ignore inability to coerce stored config
            }
            return false;
        }

        createInitialAfkState() {
            return {
                standSince: null,
                baselineXp: null,
                lastXpValue: null,
                lastXpTimestamp: 0,
                lastInteraction: 0,
                lastAnimation: null,
                notified: false
            };
        }

        resetAfkState() {
            if (!this.afkState) {
                this.afkState = this.createInitialAfkState();
                return;
            }
            this.afkState.standSince = null;
            this.afkState.baselineXp = null;
            this.afkState.notified = false;
            this.afkState.lastAnimation = null;
        }

        registerAfkInteractionGuards() {
            if (typeof window === 'undefined') {
                return;
            }
            if (this.boundAfkInteractionHandler) {
                return;
            }
            const handler = () => this.handleUserInteraction();
            AFK_INTERACTION_EVENTS.forEach((evt) => {
                try {
                    window.addEventListener(evt, handler, true);
                } catch (err) {
                    // ignore inability to attach interaction guards
                }
            });
            this.boundAfkInteractionHandler = handler;
        }

        handleUserInteraction() {
            const now = Date.now();
            if (!this.afkState) {
                this.afkState = this.createInitialAfkState();
            }
            const last = this.afkState.lastInteraction ?? 0;
            if (now - last < AFK_INTERACTION_THROTTLE_MS) {
                return;
            }
            this.afkState.lastInteraction = now;
            this.afkState.standSince = null;
            this.afkState.baselineXp = null;
            this.afkState.notified = false;
        }

        startAfkMonitor() {
            this.stopAfkMonitor();
            if (typeof window === 'undefined' || typeof window.setInterval !== 'function') {
                return;
            }
            this.afkMonitorId = window.setInterval(() => this.pollAfkState(), AFK_CHECK_INTERVAL_MS);
        }

        stopAfkMonitor() {
            if (this.afkMonitorId !== null) {
                if (typeof window !== 'undefined' && typeof window.clearInterval === 'function') {
                    window.clearInterval(this.afkMonitorId);
                }
                this.afkMonitorId = null;
            }
        }

        pollAfkState() {
            if (!this.afkState) {
                this.afkState = this.createInitialAfkState();
            }
            const cache = this.configCache;
            const afkConfig = cache?.afk;
            if (!afkConfig) {
                this.resetAfkState();
                return;
            }

            const wantsNotification = !!afkConfig.notify;
            const wantsSound = !!afkConfig.sound;
            if (!wantsNotification && !wantsSound) {
                this.resetAfkState();
                return;
            }

            const thresholdMs = afkConfig.thresholdMs;
            if (!Number.isFinite(thresholdMs) || thresholdMs <= 0) {
                this.resetAfkState();
                return;
            }

            if (typeof window === 'undefined') {
                return;
            }

            const normalized = this.readLocalAnimationName();
            if (!normalized) {
                if (!this.afkAnimationWarningLogged) {
                    console.warn('[DesktopNotifications] Unable to determine local animation; AFK detection paused');
                    this.afkAnimationWarningLogged = true;
                }
                this.resetAfkState();
                return;
            }
            this.afkAnimationWarningLogged = false;
            const now = Date.now();
            const totalXp = this.getCurrentTotalXp();
            const hasXp = Number.isFinite(totalXp);
            if (hasXp) {
                this.afkXpWarningLogged = false;
                this.afkState.lastXpValue = totalXp;
                this.afkState.lastXpTimestamp = now;
            }

            const isStanding = normalized === AFK_IDLE_ANIMATION;

            if (isStanding) {
                if (!this.afkState.standSince) {
                    this.afkState.standSince = now;
                }
                if (!hasXp) {
                    this.afkState.baselineXp = null;
                    this.afkState.standSince = now;
                    this.afkState.notified = false;
                } else if (!Number.isFinite(this.afkState.baselineXp)) {
                    this.afkState.baselineXp = totalXp;
                    this.afkState.standSince = now;
                } else if (totalXp !== this.afkState.baselineXp) {
                    this.afkState.baselineXp = totalXp;
                    this.afkState.standSince = now;
                    this.afkState.notified = false;
                }

                const canDetermineAfk = hasXp && Number.isFinite(this.afkState.baselineXp);
                if (canDetermineAfk && !this.afkState.notified && now - this.afkState.standSince >= thresholdMs && totalXp <= this.afkState.baselineXp) {
                    this.afkState.notified = true;
                    this.fireAfkAlert();
                }
            } else {
                this.resetAfkState();
                if (hasXp) {
                    this.afkState.lastXpValue = totalXp;
                    this.afkState.lastXpTimestamp = now;
                }
            }

            if (!hasXp && !this.afkXpWarningLogged) {
                console.warn('[DesktopNotifications] Unable to read total XP; AFK detection requires XP tracking.');
                this.afkXpWarningLogged = true;
            }

            this.afkState.lastAnimation = normalized;
        }

        resolveGameWindow() {
            if (typeof unsafeWindow !== 'undefined' && unsafeWindow) {
                return unsafeWindow;
            }
            return typeof window !== 'undefined' ? window : null;
        }

        readLocalAnimationName() {
            const scope = this.resolveGameWindow();
            if (!scope) {
                return AFK_IDLE_ANIMATION;
            }
            try {
                const globals = scope && scope.Globals ? scope.Globals : null;
                const username = globals && typeof globals.local_username === 'string' ? globals.local_username : '';
                const active = scope.active_animations;
                if (username && active && typeof active === 'object') {
                    let entry = active[username];
                    if (!entry || typeof entry !== 'object') {
                        entry = active[username] = { animation_name: AFK_IDLE_ANIMATION };
                        return AFK_IDLE_ANIMATION;
                    }
                    const name = typeof entry.animation_name === 'string' ? entry.animation_name : '';
                    if (name) {
                        return name.toLowerCase();
                    }

                    entry.animation_name = AFK_IDLE_ANIMATION;
                    return AFK_IDLE_ANIMATION;
                }
            } catch (err) {
                // ignore active animation lookup errors
            }
            const getter = scope.get_current_local_animation;
            if (typeof getter === 'function') {
                try {
                    const value = getter.call(scope);
                    if (typeof value === 'string' && value) {
                        const lower = value.toLowerCase();
                        try {
                            const globals = scope && scope.Globals ? scope.Globals : null;
                            const username = globals && typeof globals.local_username === 'string' ? globals.local_username : '';
                            if (username) {
                                if (!scope.active_animations || typeof scope.active_animations !== 'object') {
                                    scope.active_animations = {};
                                }
                                const entry = scope.active_animations[username] || (scope.active_animations[username] = {});
                                entry.animation_name = lower;
                            }
                        } catch (innerErr) {
                            // ignore hydration errors
                        }
                        return lower;
                    }
                } catch (err) {
                    // ignore errors from get_current_local_animation
                }
            }
            return AFK_IDLE_ANIMATION;
        }



        guardAnimationGetter() {
            if (DesktopNotificationsPlugin._animationGuarded) {
                return;
            }
            const scope = this.resolveGameWindow();
            if (!scope || typeof scope.get_current_local_animation !== 'function') {
                return;
            }
            const original = scope.get_current_local_animation;
            if (original.__desktopNotifyGuarded) {
                DesktopNotificationsPlugin._animationGuarded = true;
                return;
            }
            const plugin = this;
            function guardedAnimationGetter() {
                try {
                    const value = original.apply(this, arguments);
                    if (typeof value === 'string' && value) {
                        return value;
                    }
                } catch (err) {
                    if (!plugin.animationGuardWarningLogged) {
                        console.debug('[DesktopNotifications] Guarded get_current_local_animation()', err);
                        plugin.animationGuardWarningLogged = true;
                    }
                    return plugin.recoverLocalAnimation(scope);
                }
                return plugin.recoverLocalAnimation(scope);
            }
            guardedAnimationGetter.__desktopNotifyGuarded = true;
            scope.get_current_local_animation = guardedAnimationGetter;
            DesktopNotificationsPlugin._animationGuarded = true;
        }

        recoverLocalAnimation(scope) {
            try {
                const globals = scope && scope.Globals ? scope.Globals : null;
                const username = globals && typeof globals.local_username === 'string' ? globals.local_username : '';
                if (!username) {
                    return AFK_IDLE_ANIMATION;
                }
                if (!scope.active_animations || typeof scope.active_animations !== 'object') {
                    scope.active_animations = {};
                }
                let entry = scope.active_animations[username];
                if (!entry || typeof entry !== 'object') {
                    entry = scope.active_animations[username] = { animation_name: AFK_IDLE_ANIMATION };
                } else if (typeof entry.animation_name !== 'string' || !entry.animation_name) {
                    entry.animation_name = AFK_IDLE_ANIMATION;
                }
                return entry.animation_name;
            } catch (err) {
                return AFK_IDLE_ANIMATION;
            }
        }
        readTotalXpFromVars() {
            const scope = this.resolveGameWindow();
            if (!scope) {
                return Number.isFinite(this.lastTotalXpFromVars) ? this.lastTotalXpFromVars : NaN;
            }

            const readVar = (key) => {
                let value = NaN;
                if (typeof scope.get_var === 'function') {
                    try {
                        value = scope.get_var(key);
                    } catch (err) {
                        // ignore get_var errors
                    }
                }
                if (!Number.isFinite(value)) {
                    try {
                        const loose = scope['var_' + key];
                        value = this.parseVarNumber(loose);
                    } catch (err) {
                        // ignore loose var errors
                    }
                }
                if (!Number.isFinite(value)) {
                    try {
                        const fallback = scope[key];
                        value = this.parseVarNumber(fallback);
                    } catch (err) {
                        // ignore fallback errors
                    }
                }
                return Number.isFinite(value) ? value : NaN;
            };

            let total = 0;
            let foundAny = false;

            for (const key of SKILL_XP_VAR_KEYS) {
                const value = readVar(key);
                if (Number.isFinite(value)) {
                    total += value;
                    foundAny = true;
                }
            }

            if (foundAny) {
                this.lastTotalXpFromVars = total;
                this.xpVarWarningLogged = false;
                return total;
            }

            if (typeof scope.get_var === 'function') {
                try {
                    const fallbackGlobal = scope.get_var('global_xp');
                    if (Number.isFinite(fallbackGlobal)) {
                        this.lastTotalXpFromVars = fallbackGlobal;
                        this.xpVarWarningLogged = false;
                        return fallbackGlobal;
                    }
                } catch (err) {
                    // ignore fallback errors
                }
            }

            if (!this.xpVarWarningLogged) {
                console.warn('[DesktopNotifications] Unable to read skill XP vars; relying on DOM totals.');
                this.xpVarWarningLogged = true;
            }
            return Number.isFinite(this.lastTotalXpFromVars) ? this.lastTotalXpFromVars : NaN;
        }

        getCurrentTotalXp() {
            const fromVars = this.readTotalXpFromVars();
            if (Number.isFinite(fromVars)) {
                return fromVars;
            }
            return this.readTotalXpFromDom();
        }
        readTotalXpFromDom() {
            if (typeof document === 'undefined') {
                return NaN;
            }
            try {
                const globalEl = document.getElementById('ui-skill-global-xp');
                if (globalEl) {
                    const value = this.extractFirstNumber(globalEl.textContent || globalEl.innerText || '');
                    if (Number.isFinite(value)) {
                        return value;
                    }
                }

                const xpNodes = document.querySelectorAll("span[id^='ui-skill-'][id$='-xp']");
                let total = 0;
                let found = false;
                xpNodes.forEach((node) => {
                    if (node && typeof node.id === 'string' && node.id.indexOf('ui-skill-global-xp') !== -1) {
                        return;
                    }
                    const value = this.extractFirstNumber((node?.textContent) || (node?.innerText) || '');
                    if (Number.isFinite(value)) {
                        total += value;
                        found = true;
                    }
                });
                return found ? total : NaN;
            } catch (err) {
                return NaN;
            }
        }

        parseVarNumber(raw) {
            if (typeof raw === 'number') {
                return Number.isFinite(raw) ? raw : NaN;
            }
            if (typeof raw === 'string') {
                const digits = raw.replace(/[^0-9-]/g, '');
                if (!digits) {
                    return NaN;
                }
                const parsed = Number.parseInt(digits, 10);
                return Number.isFinite(parsed) ? parsed : NaN;
            }
            return NaN;
        }

        extractFirstNumber(raw) {
            if (typeof raw !== 'string') {
                raw = raw == null ? '' : String(raw);
            }
            const match = raw.match(/(\d[\d,]*)/);
            if (!match) {
                return NaN;
            }
            const digits = match[1].replace(/[^0-9]/g, '');
            if (!digits) {
                return NaN;
            }
            const parsed = Number.parseInt(digits, 10);
            return Number.isFinite(parsed) ? parsed : NaN;
        }

        fireAfkAlert() {
            const cache = this.configCache;
            const afkConfig = cache?.afk;
            if (!afkConfig) {
                return;
            }
            if (afkConfig.notify) {
                const message = `You've been idle for ${afkConfig.thresholdLabel}.`;
                this.showNotification('AFK detected', message, AFK_ICON);
            }
            if (afkConfig.sound) {
                this.playLibrarySound(afkConfig.soundKey, afkConfig.volumeLevel);
            }
        }

        listTrackedNpcNames() {
            return NPC_TRACKING_NAMES.slice();
        }

        scanTrackedNpcPresence() {
            const entries = this.readVisibleNpcEntries();
            if (!entries.length) {
                return;
            }
            if (entries.some((npc) => this.isTrackedAlienNpc(npc))) {
                this.handleAlienSeen();
            }
        }

        listVisibleNpcIdentifiers() {
            return this.readVisibleNpcEntries().map((npc) => ({
                uuid: typeof npc?.uuid === 'string' ? npc.uuid : '',
                name: typeof npc?.name === 'string' ? npc.name : '',
                label: typeof npc?.label === 'string' ? npc.label : ''
            }));
        }

        readVisibleNpcEntries() {
            const source = this.safeNpcTable();
            if (!source) {
                return [];
            }
            const entries = [];
            for (const value of Object.values(source)) {
                if (!value || typeof value !== 'object') {
                    continue;
                }
                if (value.is_hidden) {
                    continue;
                }
                entries.push(value);
            }
            return entries;
        }

        safeNpcTable() {
            if (typeof window === 'undefined') {
                return null;
            }
            try {
                const scope = (typeof unsafeWindow !== 'undefined' && unsafeWindow) ? unsafeWindow : window;
                let table = null;
                if (scope && typeof scope.npcs === 'object' && scope.npcs) {
                    table = scope.npcs;
                } else if (typeof npcs !== 'undefined' && npcs && typeof npcs === 'object') {
                    table = npcs;
                }
                if (!table || typeof table !== 'object') {
                    return null;
                }
                this.npcLookupWarningLogged = false;
                return table;
            } catch (err) {
                if (!this.npcLookupWarningLogged) {
                    console.warn('[DesktopNotifications] Unable to inspect NPC table', err);
                    this.npcLookupWarningLogged = true;
                }
                return null;
            }
        }

        isTrackedAlienNpc(npc) {
            const identifier = this.normalizeNpcIdentifier(npc);
            return identifier ? NPC_TRACKING_NAMES.includes(identifier) : false;
        }

        normalizeNpcIdentifier(npc) {
            if (!npc) {
                return '';
            }
            if (typeof npc.name === 'string' && npc.name.trim() !== '') {
                return npc.name.trim().toLowerCase().replace(/\s+/g, '_');
            }
            if (typeof npc.label === 'string' && npc.label.trim() !== '') {
                return npc.label.trim().toLowerCase().replace(/\s+/g, '_');
            }
            return '';
        }

        handleAlienSeen() {
            const now = Date.now();
            this.lastSeenTimestamp = now;
            if (!this.alienPresent) {
                this.alienPresent = true;
                this.fireAlienAlert();
            }
            this.refreshPresenceTimer();
        }

        refreshPresenceTimer() {
            if (this.despawnTimer) {
                clearTimeout(this.despawnTimer);
                this.despawnTimer = null;
            }
            if (!this.alienPresent) {
                return;
            }
            this.despawnTimer = window.setTimeout(() => this.checkDespawn(), DESPAWN_GRACE_MS + 100);
        }

        checkDespawn() {
            if (!this.alienPresent) {
                return;
            }
            if (Date.now() - this.lastSeenTimestamp >= DESPAWN_GRACE_MS) {
                this.alienPresent = false;
                this.lastSeenTimestamp = 0;
                this.despawnTimer = null;
            } else {
                this.refreshPresenceTimer();
            }
        }

        fireAlienAlert() {
            const alienConfig = this.configCache?.alien;
            if (!alienConfig) {
                return;
            }
            if (alienConfig.notify) {
                this.showNotification('Alien sighted!', 'An alien has appeared on your map.', ALIEN_ICON);
            }
            if (alienConfig.sound) {
                this.playLibrarySound(alienConfig.soundKey, alienConfig.volumeLevel);
            }
        }

        ensureNotificationPermission() {
            if (!('Notification' in window)) {
                return Promise.resolve('denied');
            }
            if (Notification.permission !== 'default') {
                return Promise.resolve(Notification.permission);
            }
            if (this._permissionPromise) {
                return this._permissionPromise;
            }
            this._permissionPromise = new Promise((resolve) => {
                const finish = (permission) => {
                    this._permissionPromise = null;
                    resolve(permission);
                };
                try {
                    const result = Notification.requestPermission((permission) => finish(permission));
                    if (result && typeof result.then === 'function') {
                        result.then(finish).catch(() => finish('denied'));
                    } else if (typeof result === 'string') {
                        finish(result);
                    } else {
                        window.setTimeout(() => finish(Notification.permission), 0);
                    }
                } catch (err) {
                    finish('denied');
                }
            });
            return this._permissionPromise;
        }

        async showNotification(title, body, icon = ALIEN_ICON) {
            try {
                const permission = await this.ensureNotificationPermission();
                if (permission !== 'granted') {
                    return;
                }
                const notification = new Notification(title, {
                    body,
                    icon
                });
                window.setTimeout(() => {
                    try {
                        notification.close();
                    } catch (err) {
                        // ignore inability to close notifications
                    }
                }, 10000);
            } catch (err) {
                console.warn('[DesktopNotifications] Unable to show notification', err);
            }
        }

        playLibrarySound(soundKey, volumeLevel) {
            const sound = SOUND_LIBRARY[soundKey] || SOUND_LIBRARY[DEFAULT_SOUND_KEY];
            if (!sound) {
                return;
            }
            if (sound.synth) {
                this.playSynthSound(sound.synth, volumeLevel);
            } else if (sound.url) {
                this.playAudioElement(sound.url, volumeLevel);
            }
        }

        playAudioElement(url, volumeLevel) {
            try {
                const audio = new Audio(url);
                audio.crossOrigin = 'anonymous';
                audio.volume = Math.max(0, Math.min(1, volumeLevel));
                audio.play().catch(() => {});
            } catch (err) {
                console.warn('[DesktopNotifications] Failed to play audio element', err);
            }
        }

        initSoundTester() {
            if (typeof MutationObserver === 'function' && !this.soundTesterObserver) {
                const target = document.body || document.documentElement;
                if (target) {
                    this.soundTesterObserver = new MutationObserver(() => this.ensureSoundTester());
                    this.soundTesterObserver.observe(target, { childList: true, subtree: true });
                }
            }
            this.ensureSoundTester();
        }

        ensureSoundTester() {
            let attached = false;
            ['alien', 'afk'].forEach((scope) => {
                attached = this.attachSoundTester(scope) || attached;
            });
            return attached;
        }

        attachSoundTester(scope) {
            const selectId = `flatmmoplus-config-${this.id}-${scope}SoundChoice`;
            const select = document.getElementById(selectId);
            if (!select) {
                return false;
            }
            if (select.dataset.desktopNotifyTesterAttached === '1') {
                return true;
            }
            const parent = select.parentElement;
            if (!parent) {
                return false;
            }
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = 'Play';
            button.style.marginLeft = '6px';
            button.className = 'desktop-notify-play-button';
            button.addEventListener('click', () => {
                const selectEl = document.getElementById(selectId);
                const volumeEl = document.getElementById(`flatmmoplus-config-${this.id}-${scope}SoundVolume`);
                const configSegment = this.configCache?.[scope] || {};
                const defaultSoundKey = scope === 'afk' ? DEFAULT_AFK_SOUND_KEY : DEFAULT_SOUND_KEY;
                const selectedKey = (selectEl && selectEl.value) || configSegment.soundKey || defaultSoundKey;
                let volumePercent = configSegment.volumePercent ?? (scope === 'afk' ? DEFAULT_CONFIG.afkSoundVolume : DEFAULT_CONFIG.alienSoundVolume);
                if (volumeEl && volumeEl.value !== '') {
                    const parsed = Number(volumeEl.value);
                    if (!Number.isNaN(parsed)) {
                        volumePercent = this.clampPercent(parsed);
                    }
                }
                this.playLibrarySound(selectedKey, Math.max(0, Math.min(1, volumePercent / 1000)));
            });
            parent.appendChild(button);
            select.dataset.desktopNotifyTesterAttached = '1';
            return true;
        }

        ensureAudioContext() {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) {
                return null;
            }
            if (!this.audioContext || this.audioContext.state === 'closed') {
                this.audioContext = new Ctx();
            }
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().catch(() => {});
            }
            return this.audioContext;
        }

        playSynthSound(descriptor, volumeLevel) {
            const ctx = this.ensureAudioContext();
            if (!ctx) {
                return;
            }
            const now = ctx.currentTime;
            const duration = Math.max(0.1, descriptor?.duration ?? 1);
            const envelope = descriptor?.envelope || {};
            const attack = Math.max(0.005, envelope.attack ?? 0.05);
            const hold = Math.max(0, envelope.hold ?? 0.2);
            const decay = Math.max(0, envelope.decay ?? 0.3);
            const sustainLevel = Math.max(0.05, Math.min(1, envelope.sustain ?? 0.5));
            const release = Math.max(0.05, envelope.release ?? 0.4);
            const peak = Math.max(0.0001, Math.min(1, volumeLevel ?? 0.05));

            const masterGain = ctx.createGain();
            masterGain.gain.setValueAtTime(0.0001, now);
            masterGain.gain.exponentialRampToValueAtTime(peak, now + attack);
            masterGain.gain.setValueAtTime(peak, now + attack + hold);
            const decayTarget = Math.max(0.0001, peak * sustainLevel);
            masterGain.gain.exponentialRampToValueAtTime(decayTarget, now + attack + hold + decay);
            const stopTime = now + duration;
            masterGain.gain.setValueAtTime(decayTarget, stopTime);
            masterGain.gain.exponentialRampToValueAtTime(0.0001, stopTime + release);
            masterGain.connect(ctx.destination);

            const cleanupFns = [];
            const scheduleCleanup = (() => {
                let cleaned = false;
                return () => {
                    if (cleaned) {
                        return;
                    }
                    cleaned = true;
                    cleanupFns.forEach((fn) => {
                        try {
                            fn();
                        } catch (err) {
                            // ignore cleanup errors
                        }
                    });
                };
            })();

            cleanupFns.push(() => {
                try {
                    masterGain.disconnect();
                } catch (err) {
                    // ignore disconnect issues
                }
            });

            const layers = Array.isArray(descriptor?.layers) ? descriptor.layers : [];
            layers.forEach((layer) => {
                try {
                    const osc = ctx.createOscillator();
                    osc.type = layer?.type || 'sine';
                    if (typeof layer?.detune === 'number') {
                        osc.detune.value = layer.detune;
                    }

                    const layerGain = ctx.createGain();
                    const layerScale = Math.max(0, Math.min(2, layer?.gain ?? 1));
                    layerGain.gain.setValueAtTime(layerScale, now);
                    layerGain.connect(masterGain);
                    osc.connect(layerGain);

                    const sequence = Array.isArray(layer?.sequence) && layer.sequence.length > 0
                        ? layer.sequence
                        : [{ time: 0, freq: layer?.freq || 440 }];

                    sequence.forEach((step, index) => {
                        const clampedTime = now + Math.min(Math.max(step?.time ?? 0, 0), duration);
                        const freq = Math.max(20, step?.freq ?? layer?.freq ?? 440);
                        if (index === 0) {
                            osc.frequency.setValueAtTime(freq, clampedTime);
                        } else {
                            const glide = (layer?.glide || 'linear').toLowerCase();
                            if (glide === 'exponential') {
                                osc.frequency.exponentialRampToValueAtTime(freq, clampedTime);
                            } else {
                                osc.frequency.linearRampToValueAtTime(freq, clampedTime);
                            }
                        }
                    });

                    if (layer?.vibrato && typeof layer.vibrato.freq === 'number' && typeof layer.vibrato.depth === 'number') {
                        const lfo = ctx.createOscillator();
                        lfo.type = 'sine';
                        lfo.frequency.value = Math.max(0.1, layer.vibrato.freq);
                        const lfoGain = ctx.createGain();
                        lfoGain.gain.value = layer.vibrato.depth;
                        lfo.connect(lfoGain);
                        lfoGain.connect(osc.frequency);
                        lfo.start(now);
                        const lfoStop = stopTime + release + 0.05;
                        lfo.stop(lfoStop);
                        cleanupFns.push(() => {
                            try {
                                lfo.disconnect();
                                lfoGain.disconnect();
                            } catch (err) {
                                // ignore cleanup issues
                            }
                        });
                    }

                    const oscStop = stopTime + release + 0.05;
                    osc.start(now);
                    osc.stop(oscStop);
                    osc.onended = scheduleCleanup;
                    cleanupFns.push(() => {
                        try {
                            osc.disconnect();
                            layerGain.disconnect();
                        } catch (err) {
                            // ignore disconnect issues
                        }
                    });
                } catch (err) {
                    console.warn('[DesktopNotifications] Failed to create synth layer', err);
                }
            });

            window.setTimeout(scheduleCleanup, Math.ceil((duration + release + 0.2) * 1000));
        }
    }


    DesktopNotificationsPlugin._animationGuarded = false;

    const plugin = new DesktopNotificationsPlugin();
    FlatMMOPlus.registerPlugin(plugin);
})();