// ==UserScript==
// @name         IQRPG Enhanced
// @namespace    https://iqrpg.com/
// @version      2.2.8
// @description  Enhanced features for IQRPG including notifications and alerts
// @author       Sanjin
// @license      MIT
// @match        https://iqrpg.com/game.html
// @match        https://www.iqrpg.com/game.html
// @match        http://iqrpg.com/game.html
// @match        http://www.iqrpg.com/game.html
// @grant        none
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/emoji-js@3.6.0/lib/emoji.min.js
// @downloadURL https://update.greasyfork.org/scripts/558058/IQRPG%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/558058/IQRPG%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // Configuration & State Management
    // ============================================
    const DEFAULT_CONFIG = {
        notifications: {
            globalEvents: {
                sound: true,
                desktop: true
            },
            clan: {
                sound: true,
                desktop: true,
                watchtower: true,
                clanChatGlobals: true
            },
            actionBonus: {
                sound: true,
                desktop: true
            },
            bossSpawn: {
                sound: true,
                desktop: true
            },
            tradeAlert: {
                sound: true,
                desktop: true,
                sellingKeywords: [],
                buyingKeywords: []
            },
            gatheringEvents: {
                woodcutting: {
                    sound: true,
                    desktop: true
                },
                quarrying: {
                    sound: true,
                    desktop: true
                },
                mining: {
                    sound: true,
                    desktop: true
                }
            },
            message: {
                sound: true,
                desktop: true
            },
            autos: {
                sound: true,
                desktop: true,
                threshold: 100,  // Alert when autos reach this number
                repeatCount: 1,  // Number of times to repeat alert while under threshold (1 = no repeat)
                repeatInterval: 1  // Seconds between repeat alerts (0 = immediate repeats, no delay)
            },
            potions: {
                sound: true,
                desktop: true,
                threshold: 100,  // Alert when potions reach this number
                repeatCount: 1,  // Number of times to repeat alert while under threshold (1 = no repeat)
                repeatInterval: 1  // Seconds between repeat alerts (0 = immediate repeats, no delay)
            },
            dungeon: {
                sound: true,
                desktop: true,
                onlyWhenAllKeysComplete: false  // Only notify when all dungeon keys are completed
            },
            mastery: {
                sound: true,
                desktop: true
            },
            land: {
                sound: true,
                desktop: true
            },
            skills: {
                sound: true,
                desktop: true
            },
            itemDrop: {
                sound: true,
                desktop: true,
                itemKeywords: []
            },
            abyssBattles: {
                sound: true,
                desktop: true
            },
            marketSale: {
                sound: true,
                desktop: true
            },
            itemReceived: {
                sound: true,
                desktop: true
            },
            itemSent: {
                sound: true,
                desktop: true
            }
        },
        sounds: {
            globalEvent: 'https://audio.jukehost.co.uk/qyoNau6faKvNTt2NVyZ3Mcr8WDw1ueiv',
            actionBonus: 'https://audio.jukehost.co.uk/wHRlgKNZdfDnXfLsoTqDjcluHENngS4b',
            bossSpawn: 'https://audio.jukehost.co.uk/zL9Qk16xdxOKyJfMDUPwliTfsKAVJW6n',
            tradeAlert: 'https://audio.jukehost.co.uk/kbWqZVtOxyOB3Whq0o5Em6LLOGJjP2CY',
            gatheringEvent: 'https://audio.jukehost.co.uk/yuTJytEhB55P1iFzAVwgX7wU4sr1h7cp',
            message: 'https://audio.jukehost.co.uk/s3Nil94O25qt8bKUZp3CrL3z5YzIS1OE',
            autos: 'https://audio.jukehost.co.uk/WKlTn6GvA0e3UGCAvW3IwaJj7vT7VBmL',
            dungeon: 'https://audio.jukehost.co.uk/ccIvfx6WghmSymNDuZEeuGFFpMS84CY5',
            mastery: 'https://audio.jukehost.co.uk/9DW0A6lxLQtstNHZwuiNoGcJciEJ5rdh',
            land: 'https://audio.jukehost.co.uk/ccIvfx6WghmSymNDuZEeuGFFpMS84CY5',
            skills: 'https://audio.jukehost.co.uk/9DW0A6lxLQtstNHZwuiNoGcJciEJ5rdh',
            clanWatchtower: 'https://audio.jukehost.co.uk/wf7tdKTnzx1Kb0wQHqLDab9pfhEHk130',
            clanGlobals: 'https://audio.jukehost.co.uk/qyoNau6faKvNTt2NVyZ3Mcr8WDw1ueiv',
            itemDrop: 'https://audio.jukehost.co.uk/mlm4l3BkKXDT54NaogHDmt9buhGO4Sa3',
            abyssBattles: 'https://audio.jukehost.co.uk/8WLa35FnrtIYNbBVhoiVdHKeFyLjwp0n',
            potions: 'https://audio.jukehost.co.uk/DsgIJBKLrrZHdx7R3XE1kirUcMJKaDjo',
            marketSale: 'https://audio.jukehost.co.uk/kllcpuOyzKQUIMNdwO1YlmGZTcGLeWkM',
            itemReceived: 'https://audio.jukehost.co.uk/mlm4l3BkKXDT54NaogHDmt9buhGO4Sa3',
            itemSent: 'https://audio.jukehost.co.uk/mlm4l3BkKXDT54NaogHDmt9buhGO4Sa3',
            goldReceived: 'https://audio.jukehost.co.uk/AG7SUW9D6RwJfu2XJco92BYalCLYYmO2',
            goldSent: 'https://audio.jukehost.co.uk/AG7SUW9D6RwJfu2XJco92BYalCLYYmO2',
            volume: 1.0  // Volume level (0.0 to 1.0)
        },
        gui: {
            enabled: true
        },
        features: {
            images: {
                enabled: false  // Image linking and modals
            },
            youtube: {
                enabled: false  // YouTube linking and modals
            },
            emojis: {
                enabled: false  // Emoji rendering and autocomplete
            }
        }
    };

    const CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

    // Constants
    const CONSTANTS = {
        DELAYS: {
            BUTTON_CREATION: 100,
            RETRY_SHORT: 500,
            NOTIFICATION_AUTO_CLOSE: 10000,
            SAVE_FEEDBACK: 2000
        },
        STRINGS: {
            PREMIUM_STORE: 'premium store',
            SOUND_GLOBAL: 'globalEvent',
            SOUND_ACTION_BONUS: 'actionBonus',
            SOUND_BOSS_SPAWN: 'bossSpawn',
            SOUND_TRADE_ALERT: 'tradeAlert',
            SOUND_GATHERING_EVENT: 'gatheringEvent',
            SOUND_MESSAGE: 'message',
            SOUND_AUTOS: 'autos',
            SOUND_DUNGEON: 'dungeon',
            SOUND_MASTERY: 'mastery',
            SOUND_LAND: 'land',
            SOUND_SKILLS: 'skills',
            SOUND_CLAN_WATCHTOWER: 'clanWatchtower',
            SOUND_CLAN_GLOBALS: 'clanGlobals',
            SOUND_ITEM_DROP: 'itemDrop',
            SOUND_ABYSS_BATTLES: 'abyssBattles',
            SOUND_POTIONS: 'potions',
            SOUND_MARKET_SALE: 'marketSale',
            SOUND_ITEM_RECEIVED: 'itemReceived',
            SOUND_ITEM_SENT: 'itemSent',
            SOUND_GOLD_RECEIVED: 'goldReceived',
            SOUND_GOLD_SENT: 'goldSent',
            MESSAGE_TYPE_MSG: 'msg',
            MESSAGE_TYPE_ACTION_BONUS: 'actionBonus',
            DATA_TYPE_GLOBAL: 'global',
            DATA_TYPE_EVENT_GLOBAL: 'eventGlobal',
            DATA_TYPE_CLAN_GLOBAL: 'clanGlobal',
            DATA_TYPE_PM_FROM: 'pm-from',
            DATA_TYPE_NOTIFICATION: 'notification',
            CHANNEL_TRADE: 'trade',
            CHANNEL_CLAN_PREFIX: 'clan-',
            CHANNEL_NOTIFICATIONS: 'notifications',
            MESSAGE_TYPE_NOTIFICATION: 'notification'
        },
        // Patterns to detect selling/buying intent in trade messages (case-insensitive)
        TRADE_PATTERNS: {
            SELLING: ['selling', 'wts', 'sell', 's>', '{s}'],
            BUYING: ['buying', 'wtb', 'buy', 'b>', '{b}']
        },
        BOSS_SPAWN_PATTERNS: {
            DEMON_HORN: ['demon horn', 'bosses start appearing']
        },
        // Mapping of item keys to their proper display names
        ITEM_NAME_MAP: {
            // Only dungeon keys need special names - all other items will be auto-converted
            'dungeon_key_1': 'Goblin Cave Key',
            'dungeon_key_2': 'Mountain Pass Key',
            'dungeon_key_3': 'Desolate Tombs Key',
            'dungeon_key_4': 'Dragonkin Lair Key',
            'dungeon_key_5': 'Sunken Ruins Key',
            'dungeon_key_6': 'Abandoned Tower Key',
            'dungeon_key_7': 'Haunted Cells Key',
            'dungeon_key_8': 'Hall of Dragons Key',
            'dungeon_key_9': 'The Vault Key',
            'dungeon_key_10': 'The Treasury Key'
        },
        SELECTORS: {
            FIXED_TOP: '.fixed-top',
            SECTION_3: '.section-3'
        }
    };

    // Helper function to preload all sounds
    function preloadAllSounds() {
        AudioManager.preloadSound(CONFIG.sounds.globalEvent, CONSTANTS.STRINGS.SOUND_GLOBAL);
        AudioManager.preloadSound(CONFIG.sounds.actionBonus, CONSTANTS.STRINGS.SOUND_ACTION_BONUS);
        AudioManager.preloadSound(CONFIG.sounds.bossSpawn, CONSTANTS.STRINGS.SOUND_BOSS_SPAWN);
        AudioManager.preloadSound(CONFIG.sounds.tradeAlert, CONSTANTS.STRINGS.SOUND_TRADE_ALERT);
        AudioManager.preloadSound(CONFIG.sounds.gatheringEvent, CONSTANTS.STRINGS.SOUND_GATHERING_EVENT);
        AudioManager.preloadSound(CONFIG.sounds.message, CONSTANTS.STRINGS.SOUND_MESSAGE);
        AudioManager.preloadSound(CONFIG.sounds.autos, CONSTANTS.STRINGS.SOUND_AUTOS);
        AudioManager.preloadSound(CONFIG.sounds.dungeon, CONSTANTS.STRINGS.SOUND_DUNGEON);
        AudioManager.preloadSound(CONFIG.sounds.mastery, CONSTANTS.STRINGS.SOUND_MASTERY);
        AudioManager.preloadSound(CONFIG.sounds.land, CONSTANTS.STRINGS.SOUND_LAND);
        AudioManager.preloadSound(CONFIG.sounds.skills, CONSTANTS.STRINGS.SOUND_SKILLS);
        AudioManager.preloadSound(CONFIG.sounds.clanWatchtower, CONSTANTS.STRINGS.SOUND_CLAN_WATCHTOWER);
        AudioManager.preloadSound(CONFIG.sounds.clanGlobals, CONSTANTS.STRINGS.SOUND_CLAN_GLOBALS);
        AudioManager.preloadSound(CONFIG.sounds.itemDrop, CONSTANTS.STRINGS.SOUND_ITEM_DROP);
        AudioManager.preloadSound(CONFIG.sounds.abyssBattles, CONSTANTS.STRINGS.SOUND_ABYSS_BATTLES);
        AudioManager.preloadSound(CONFIG.sounds.potions, CONSTANTS.STRINGS.SOUND_POTIONS);
        AudioManager.preloadSound(CONFIG.sounds.marketSale, CONSTANTS.STRINGS.SOUND_MARKET_SALE);
        AudioManager.preloadSound(CONFIG.sounds.itemReceived, CONSTANTS.STRINGS.SOUND_ITEM_RECEIVED);
        AudioManager.preloadSound(CONFIG.sounds.itemSent, CONSTANTS.STRINGS.SOUND_ITEM_SENT);
        AudioManager.preloadSound(CONFIG.sounds.goldReceived, CONSTANTS.STRINGS.SOUND_GOLD_RECEIVED);
        AudioManager.preloadSound(CONFIG.sounds.goldSent, CONSTANTS.STRINGS.SOUND_GOLD_SENT);
    }

    // Load saved configuration
    function loadConfig() {
        let saved = null;
        try {
            const savedStr = localStorage.getItem('iqrpg_enhanced_config');
            if (savedStr) {
                saved = JSON.parse(savedStr);
            }
        } catch (e) {
            // Silently fail - use default config
        }
        if (saved) {
            // Deep merge instead of shallow assign
            CONFIG.notifications.globalEvents = {
                ...CONFIG.notifications.globalEvents,
                ...(saved.notifications?.globalEvents || {})
            };
            CONFIG.notifications.clan = {
                ...CONFIG.notifications.clan,
                ...(saved.notifications?.clan || {})
            };
            CONFIG.notifications.actionBonus = {
                ...CONFIG.notifications.actionBonus,
                ...(saved.notifications?.actionBonus || {})
            };
            CONFIG.notifications.bossSpawn = {
                ...CONFIG.notifications.bossSpawn,
                ...(saved.notifications?.bossSpawn || {})
            };
            CONFIG.notifications.tradeAlert = {
                ...CONFIG.notifications.tradeAlert,
                ...(saved.notifications?.tradeAlert || {})
            };
            // Handle gathering events with backward compatibility
            if (saved.notifications?.gatheringEvents) {
                // Check if old format exists (top-level sound/desktop)
                if (saved.notifications.gatheringEvents.sound !== undefined && 
                    !saved.notifications.gatheringEvents.woodcutting) {
                    // Old format detected - migrate to new structure
                    const oldConfig = saved.notifications.gatheringEvents;
                    CONFIG.notifications.gatheringEvents.woodcutting = {
                        sound: oldConfig.sound,
                        desktop: oldConfig.desktop
                    };
                    CONFIG.notifications.gatheringEvents.quarrying = {
                        sound: oldConfig.sound,
                        desktop: oldConfig.desktop
                    };
                    CONFIG.notifications.gatheringEvents.mining = {
                        sound: oldConfig.sound,
                        desktop: oldConfig.desktop
                    };
                } else {
                    // New format - merge each event type
                    CONFIG.notifications.gatheringEvents.woodcutting = {
                        ...CONFIG.notifications.gatheringEvents.woodcutting,
                        ...(saved.notifications.gatheringEvents.woodcutting || {})
                    };
                    CONFIG.notifications.gatheringEvents.quarrying = {
                        ...CONFIG.notifications.gatheringEvents.quarrying,
                        ...(saved.notifications.gatheringEvents.quarrying || {})
                    };
                    CONFIG.notifications.gatheringEvents.mining = {
                        ...CONFIG.notifications.gatheringEvents.mining,
                        ...(saved.notifications.gatheringEvents.mining || {})
                    };
                }
            }
            CONFIG.notifications.message = {
                ...CONFIG.notifications.message,
                ...(saved.notifications?.message || {})
            };
            CONFIG.notifications.autos = {
                ...CONFIG.notifications.autos,
                ...(saved.notifications?.autos || {})
            };
            CONFIG.notifications.dungeon = {
                ...CONFIG.notifications.dungeon,
                ...(saved.notifications?.dungeon || {})
            };
            CONFIG.notifications.mastery = {
                ...CONFIG.notifications.mastery,
                ...(saved.notifications?.mastery || {})
            };
            CONFIG.notifications.land = {
                ...CONFIG.notifications.land,
                ...(saved.notifications?.land || {})
            };
            CONFIG.notifications.skills = {
                ...CONFIG.notifications.skills,
                ...(saved.notifications?.skills || {})
            };
            CONFIG.notifications.itemDrop = {
                ...CONFIG.notifications.itemDrop,
                ...(saved.notifications?.itemDrop || {})
            };
            CONFIG.notifications.abyssBattles = {
                ...CONFIG.notifications.abyssBattles,
                ...(saved.notifications?.abyssBattles || {})
            };
            CONFIG.notifications.potions = {
                ...CONFIG.notifications.potions,
                ...(saved.notifications?.potions || {})
            };
            CONFIG.notifications.marketSale = {
                ...CONFIG.notifications.marketSale,
                ...(saved.notifications?.marketSale || {})
            };
            CONFIG.notifications.itemReceived = {
                ...CONFIG.notifications.itemReceived,
                ...(saved.notifications?.itemReceived || {})
            };
            CONFIG.notifications.itemSent = {
                ...CONFIG.notifications.itemSent,
                ...(saved.notifications?.itemSent || {})
            };
            CONFIG.sounds = {
                ...CONFIG.sounds,
                ...(saved.sounds || {})
            };
            // Ensure gold sounds exist
            if (!CONFIG.sounds.goldReceived) {
                CONFIG.sounds.goldReceived = DEFAULT_CONFIG.sounds.goldReceived;
            }
            if (!CONFIG.sounds.goldSent) {
                CONFIG.sounds.goldSent = DEFAULT_CONFIG.sounds.goldSent;
            }
            CONFIG.gui = {
                ...CONFIG.gui,
                ...(saved.gui || {})
            };
            CONFIG.features = {
                ...CONFIG.features,
                ...(saved.features || {})
            };
            // Ensure nested properties are merged correctly
            if (saved.features) {
                CONFIG.features.images = {
                    ...CONFIG.features.images,
                    ...(saved.features.images || {})
                };
                CONFIG.features.youtube = {
                    ...CONFIG.features.youtube,
                    ...(saved.features.youtube || {})
                };
                CONFIG.features.emojis = {
                    ...CONFIG.features.emojis,
                    ...(saved.features.emojis || {})
                };
            }
        }
    }

    // Save configuration
    function saveConfig() {
        try {
            localStorage.setItem('iqrpg_enhanced_config', JSON.stringify(CONFIG));
        } catch (e) {
            // Silently fail
        }
    }

    // Initialize config
    loadConfig();

    // ============================================
    // Audio Management
    // ============================================
    const AudioManager = {
        audioCache: new Map(),

        // Preload and cache audio files
        preloadSound(url, name) {
            if (!url || url === 'default') return null;
            
            if (this.audioCache.has(name)) {
                return this.audioCache.get(name);
            }

            try {
                const audio = new Audio(url);
                audio.preload = 'auto';
                this.audioCache.set(name, audio);
                return audio;
            } catch (e) {
                return null;
            }
        },

        // Play a sound
        playSound(name, url = null) {
            const volume = CONFIG.sounds.volume !== undefined ? CONFIG.sounds.volume : 1.0;
            
            if (url) {
                const audio = this.preloadSound(url, name);
                if (audio) {
                    audio.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
                    audio.currentTime = 0;
                    audio.play().catch(() => {
                        // Silently fail
                    });
                }
            } else if (this.audioCache.has(name)) {
                const audio = this.audioCache.get(name);
                audio.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
                audio.currentTime = 0;
                audio.play().catch(() => {
                    // Silently fail
                });
            }
        }
    };

    // Preload default sounds
    preloadAllSounds();

    // ============================================
    // Notification System
    // ============================================
    // Helper function to convert item key to display name
    // e.g., "undead_heart" -> "Undead Heart", "vial_of_orc_blood" -> "Vial Of Orc Blood"
    // Also cleans up gem names: "Gem Diamond" -> "Diamond"
    function formatItemName(itemKey) {
        if (!itemKey) return itemKey;
        
        // Split by underscore, capitalize first letter of each word, join with spaces
        let formatted = itemKey
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        
        // Clean up gem names: remove "Gem " prefix
        // "Gem Diamond" -> "Diamond", "Gem Ruby" -> "Ruby", etc.
        if (formatted.startsWith('Gem ')) {
            formatted = formatted.substring(4); // Remove "Gem " prefix
        }
        
        return formatted;
    }

    // Helper function to clean game messages (remove HTML tags and game item formatting codes)
    function cleanGameMessage(msg) {
        if (!msg) return '';
        
        // Remove HTML tags
        let cleaned = msg.replace(/<[^>]*>/g, '');
        
        // Remove game item formatting codes: [item:name] -> name
        cleaned = cleaned.replace(/\[item:([^\]]+)\]/g, (match, itemKey) => {
            // First check if this item key has a special mapping (only dungeon keys)
            const properName = CONSTANTS.ITEM_NAME_MAP[itemKey];
            if (properName) {
                return properName;
            }
            // Auto-convert the item key to a display name
            // e.g., "undead_heart" -> "Undead Heart", "runic_leather" -> "Runic Leather"
            return formatItemName(itemKey);
        });
        
        // Remove game item formatting codes: [--type: {...}--]
        // Parse JSON to extract item details, especially for trinkets
        cleaned = cleaned.replace(/\[--([^:]+):([\s\S]*?)--\]/g, (match, itemType, jsonData) => {
            // Try to parse the JSON data
            try {
                const data = JSON.parse(jsonData.trim());
                
                // Shared rarity color mapping (used by both trinkets and jewels)
                // rarity: 1 = White, 2 = Green, 3 = Blue, 4 = Yellow, 5 = Orange, 6 = Red, 7 = Light Blue
                const rarityColorMap = {
                    1: 'White',
                    2: 'Green',
                    3: 'Blue',
                    4: 'Yellow',
                    5: 'Orange',
                    6: 'Red',
                    7: 'Cyan'
                };
                
                // Handle trinkets specifically
                if (itemType === 'trinket' && data.type !== undefined && data.tier !== undefined) {
                    // type: 1 = Battling Trinket, 2 = Gathering Trinket
                    const trinketType = data.type === 1 ? 'Battling' : data.type === 2 ? 'Gathering' : 'Trinket';
                    let result = `${trinketType} Trinket (T${data.tier})`;
                    // Add rarity color if available
                    if (data.rarity !== undefined) {
                        const rarityColor = rarityColorMap[data.rarity] || `T${data.rarity}`;
                        result += ` (${rarityColor})`;
                    }
                    return result;
                }
                
                // Handle jewels specifically
                if (itemType === 'jewel' && data.gemType !== undefined && data.rarity !== undefined) {
                    // gemType: 1 = Sapphire, 2 = Ruby, 3 = Emerald, 4 = Diamond
                    const gemTypeMap = {
                        1: 'Sapphire',
                        2: 'Ruby',
                        3: 'Emerald',
                        4: 'Diamond'
                    };
                    const gemName = gemTypeMap[data.gemType] || 'Jewel';
                    const rarityColor = rarityColorMap[data.rarity] || `T${data.rarity}`;
                    return `${gemName} Jewel (${rarityColor})`;
                }
                
                // For other item types, try to extract name from JSON if available
                if (data.name) {
                    return data.name;
                } else if (data.itemName) {
                    return data.itemName;
                } else if (data.title) {
                    return data.title;
                }
            } catch (e) {
                // JSON parsing failed, fall through to default handling
            }
            
            // Fallback: return the item type if we can't parse or construct a name
            return itemType || '';
        });
        
        // Remove game item formatting codes: [name] -> name
        // This catches any remaining bracket patterns that weren't handled above
        cleaned = cleaned.replace(/\[([^\]]+)\]/g, (match, itemKey) => {
            // First check if this is a direct key in the map (dungeon keys)
            let properName = CONSTANTS.ITEM_NAME_MAP[itemKey];
            if (properName) {
                return properName;
            }
            
            // If it looks like an item key (contains underscores), auto-convert it
            if (itemKey.includes('_')) {
                return formatItemName(itemKey);
            }
            
            // If it's already a display name (no underscores), return as-is
            return itemKey;
        });
        
        // Clean up any extra whitespace
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        
        return cleaned;
    }

    // Helper function to convert emoji to data URL icon
    function emojiToIcon(emoji) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const size = 128; // Icon size
            canvas.width = size;
            canvas.height = size;
            
            // Set font size to render emoji large
            ctx.font = `${size * 0.8}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Draw emoji on canvas
            ctx.fillText(emoji, size / 2, size / 2);
            
            // Convert to data URL
            return canvas.toDataURL('image/png');
        } catch (e) {
            return null;
        }
    }

    const NotificationManager = {
        // Request notification permission
        async requestPermission() {
            if ('Notification' in window && Notification.permission === 'default') {
                await Notification.requestPermission();
            }
        },

        // Show desktop notification
        showDesktopNotification(title, message, icon = null) {
            if (!('Notification' in window)) {
                return;
            }

            if (Notification.permission === 'granted') {
                const options = {
                    body: message,
                    icon: icon || null,
                    badge: icon || null,
                    tag: 'iqrpg-enhanced',
                    requireInteraction: false
                };

                const notification = new Notification(title, options);
                
                // Auto-close after delay
                setTimeout(() => {
                    notification.close();
                }, CONSTANTS.DELAYS.NOTIFICATION_AUTO_CLOSE);

                // Handle click to focus window
                notification.onclick = () => {
                    window.focus();
                    notification.close();
                };
            } else if (Notification.permission === 'default') {
                this.requestPermission();
            }
        },

        // Unified notification method
        notify(title, message, options = {}) {
            const { sound = false, desktop = false, soundName = null, soundUrl = null, emoji = null } = options;

            // Play sound if enabled
            if (sound && soundName) {
                AudioManager.playSound(soundName, soundUrl);
            }

            // Show desktop notification if enabled
            if (desktop) {
                // Convert emoji to icon if provided
                const icon = emoji ? emojiToIcon(emoji) : null;
                this.showDesktopNotification(title, message, icon);
            }
        }
    };

    // Request notification permission on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            NotificationManager.requestPermission();
        });
    } else {
        NotificationManager.requestPermission();
    }

    // ============================================
    // WebSocket Interception
    // ============================================
    const WebSocketInterceptor = {
        originalWebSocket: null,
        interceptedSockets: new Set(),

        init() {
            try {
                // Intercept WebSocket constructor
                this.originalWebSocket = window.WebSocket;
                const self = this;

                window.WebSocket = function(url, protocols) {
                    const ws = new self.originalWebSocket(url, protocols);
                    self.interceptSocket(ws);
                    return ws;
                };

                // Copy static properties
                Object.setPrototypeOf(window.WebSocket, self.originalWebSocket);
                Object.defineProperty(window.WebSocket, 'CONNECTING', {
                    value: self.originalWebSocket.CONNECTING,
                    writable: false
                });
                Object.defineProperty(window.WebSocket, 'OPEN', {
                    value: self.originalWebSocket.OPEN,
                    writable: false
                });
                Object.defineProperty(window.WebSocket, 'CLOSING', {
                    value: self.originalWebSocket.CLOSING,
                    writable: false
                });
                Object.defineProperty(window.WebSocket, 'CLOSED', {
                    value: self.originalWebSocket.CLOSED,
                    writable: false
                });
            } catch (e) {
                // Silently fail
            }
        },

        interceptSocket(ws) {
            if (this.interceptedSockets.has(ws)) return;
            this.interceptedSockets.add(ws);

            // Intercept messages
            const originalAddEventListener = ws.addEventListener.bind(ws);
            ws.addEventListener = function(type, listener, options) {
                if (type === 'message') {
                    const wrappedListener = function(event) {
                        // Call original listener first
                        listener(event);

                        // Capture and log message
                        let messageData;
                        try {
                            messageData = JSON.parse(event.data);
                        } catch (e) {
                            messageData = typeof event.data === 'object' && event.data !== null && !Array.isArray(event.data) 
                                ? event.data 
                                : { raw: event.data, _parseError: true };
                        }

                        // Process message for notifications
                        if (messageData && typeof messageData === 'object') {
                            MessageProcessor.process(messageData);
                        }
                    };
                    return originalAddEventListener(type, wrappedListener, options);
                }
                return originalAddEventListener(type, listener, options);
            };

            // Also intercept onmessage property
            Object.defineProperty(ws, 'onmessage', {
                get: function() {
                    return this._onmessage;
                },
                set: function(listener) {
                    this._onmessage = listener;
                    if (listener) {
                        ws.addEventListener('message', listener);
                    }
                },
                configurable: true
            });
        }
    };

    // ============================================
    // Emoji Converter
    // ============================================
    const EmojiConverter = {
        emoji: null,
        observer: null,
        processedMessages: new WeakSet(),
        initialized: false,
        timeout: null,
        emojiPattern: /:[\w+-]+:/, // Compile regex once
        availableShortcodes: [], // Store discovered shortcodes for autocomplete
        
        init() {
            // Prevent multiple initializations
            if (this.initialized) return;
            
            // Check if emojis feature is enabled
            if (!CONFIG.features.emojis.enabled) {
                return;
            }
            
            // Check if EmojiConvertor is available (loaded via @require)
            const EmojiConvertorClass = typeof EmojiConvertor !== 'undefined' 
                ? EmojiConvertor 
                : (typeof window !== 'undefined' && window.EmojiConvertor)
                ? window.EmojiConvertor
                : null;
            
            if (!EmojiConvertorClass) {
                console.error('[IQRPG Enhanced] EmojiConvertor not available - @require may have failed');
                return;
            }
            
            // Initialize emoji converter
            this.emoji = new EmojiConvertorClass();
            this.emoji.replace_mode = 'unified';
            this.emoji.allow_native = true;
            
            this.initialized = true;
            
            // Discover and log supported shortcodes
            this.discoverShortcodes();
            
            this.startObserving();
        },
        
        convert(text) {
            if (!CONFIG.features.emojis.enabled || !this.emoji || !text || typeof text !== 'string') return text;
            return this.emoji.replace_colons(text);
        },
        
        discoverShortcodes() {
            if (!this.emoji) {
                console.error('[IQRPG Enhanced] Emoji converter not initialized');
                return;
            }
            
            let shortcodes = [];
            
            // The emoji map is at this.emoji.map.colons
            // The keys are shortcode names without colons (e.g., "100", "umbrella_with_rain_drops")
            if (this.emoji.map && this.emoji.map.colons) {
                const colonsMap = this.emoji.map.colons;
                // Get all keys and wrap them with colons
                shortcodes = Object.keys(colonsMap).map(key => `:${key}:`);
            }
            
            // Store for autocomplete
            this.availableShortcodes = shortcodes;
            return shortcodes;
        },
        
        startObserving() {
            // Disconnect existing observer if any (prevent duplicates)
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            
            // Clear any pending timeout
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            
            // Use MutationObserver to watch for new chat messages
            this.observer = new MutationObserver((mutations) => {
                // Debounce to avoid processing during rapid DOM changes
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(() => {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // Element node
                                this.processMessageNode(node);
                            }
                        });
                    });
                    this.timeout = null; // Clear reference after execution
                }, 100); // Small delay to let chat finish rendering
            });
            
            // Observe the chat container
            const chatContainer = document.querySelector('.chat-content');
            if (chatContainer) {
                this.observer.observe(chatContainer, {
                    childList: true,
                    subtree: true
                });
                
                // Process existing messages
                this.processExistingMessages(chatContainer);
            } else {
                // Retry if chat container not found yet
                setTimeout(() => this.startObserving(), 1000);
            }
        },
        
        processMessageNode(node) {
            // Skip if already processed
            if (this.processedMessages.has(node)) return;
            
            // Skip if this is an input, form, or interactive element
            if (node.tagName === 'INPUT' || 
                node.tagName === 'TEXTAREA' || 
                node.tagName === 'FORM' ||
                node.tagName === 'BUTTON' ||
                node.isContentEditable ||
                node.contentEditable === 'true') {
                return;
            }
            
            // Skip if inside a form or input
            if (node.closest('form') || 
                node.closest('input') || 
                node.closest('textarea') ||
                node.closest('[contenteditable="true"]')) {
                return;
            }
            
            // Skip if this is the chat container itself
            if (node.classList && node.classList.contains('chat-content')) {
                return;
            }
            
            // Process any node that has text content with emoji shortcodes
            if (node.textContent && node.nodeType === 1) {
                const text = node.textContent;
                // Check if text contains emoji shortcodes (use pre-compiled regex)
                if (this.emojiPattern.test(text)) {
                    // Mark as processed before conversion to avoid infinite loops
                    this.processedMessages.add(node);
                    
                    // Convert emojis in the node's HTML
                    this.convertEmojisInNode(node);
                }
            }
        },
        
        convertEmojisInNode(node) {
            // Check if emojis feature is enabled
            if (!CONFIG.features.emojis.enabled) {
                return;
            }
            
            // Get the innerHTML, convert emojis, then set it back
            const originalHTML = node.innerHTML;
            if (!originalHTML) return;
            
            // Convert emoji shortcodes to Unicode
            const convertedHTML = this.convert(originalHTML);
            
            // Only update if something changed
            if (convertedHTML !== originalHTML) {
                node.innerHTML = convertedHTML;
            }
        },
        
        processExistingMessages(container) {
            // Process all existing messages in the chat
            const walker = document.createTreeWalker(
                container,
                NodeFilter.SHOW_ELEMENT,
                {
                    acceptNode: (node) => {
                        // Skip inputs, forms, etc.
                        if (node.tagName === 'INPUT' || 
                            node.tagName === 'TEXTAREA' || 
                            node.tagName === 'FORM' ||
                            node.tagName === 'BUTTON' ||
                            node.isContentEditable ||
                            node.contentEditable === 'true') {
                            return NodeFilter.FILTER_REJECT;
                        }
                        if (node.closest('form') || 
                            node.closest('input') || 
                            node.closest('textarea') ||
                            node.closest('[contenteditable="true"]')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        // Accept nodes with text that might contain emojis (use pre-compiled regex)
                        if (node.textContent && this.emojiPattern.test(node.textContent)) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        return NodeFilter.FILTER_SKIP;
                    }
                }
            );
            
            let node;
            while (node = walker.nextNode()) {
                if (!this.processedMessages.has(node)) {
                    this.processedMessages.add(node);
                    this.convertEmojisInNode(node);
                }
            }
        },
        
        cleanup() {
            // Clear timeout
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            
            // Disconnect observer
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            
            // Reset state
            this.processedMessages = new WeakSet();
            this.initialized = false;
        }
    };

    // ============================================
    // Emoji Autocomplete (Discord-style)
    // ============================================
    const EmojiAutocomplete = {
        inputField: null,
        suggestionBox: null,
        currentSuggestions: [],
        selectedIndex: -1,
        isActive: false,
        shortcodes: [],
        handleInputHandler: null,
        handleKeyDownHandler: null,
        clickOutsideHandler: null,
        initialized: false,
        
        init() {
            // Check if emojis feature is enabled
            if (!CONFIG.features.emojis.enabled) {
                return;
            }
            
            // Prevent multiple initializations
            if (this.initialized) {
                // If already initialized, just ensure input field is still valid
                if (!this.inputField || !document.body.contains(this.inputField)) {
                    // Input field was removed, re-initialize
                    this.cleanup();
                    this.initialized = false;
                } else {
                    // Already initialized and working, just return
                    return;
                }
            }
            
            // Wait for chat input to be available
            this.findInputField();
            
            // Retry if not found
            if (!this.inputField) {
                setTimeout(() => this.init(), 1000);
                return;
            }
            
            // Create suggestion box (only if it doesn't exist)
            if (!this.suggestionBox || !document.body.contains(this.suggestionBox)) {
                this.createSuggestionBox();
            }
            
            // Attach event listeners (only if not already attached)
            if (!this.handleInputHandler) {
                this.attachListeners();
            }
            
            // Get available shortcodes from EmojiConverter
            if (EmojiConverter.availableShortcodes && EmojiConverter.availableShortcodes.length > 0) {
                this.shortcodes = EmojiConverter.availableShortcodes;
            } else {
                // Wait a bit for EmojiConverter to discover shortcodes
                setTimeout(() => {
                    this.shortcodes = EmojiConverter.availableShortcodes || [];
                }, 500);
            }
            
            this.initialized = true;
        },
        
        findInputField() {
            // Try more specific selectors first, then generic ones
            const selectors = [
                'input[type="text"]',
                'textarea',
                'input.chat',
                'textarea.chat',
                '.chat-input',
                '#chat-input',
                '[contenteditable="true"]',
                'input[placeholder*="chat" i]',
                'input[placeholder*="message" i]',
                'textarea[placeholder*="chat" i]',
                'textarea[placeholder*="message" i]'
            ];
            
            for (const selector of selectors) {
                const fields = document.querySelectorAll(selector);
                for (const field of fields) {
                    // Prefer visible, enabled fields
                    if (field.offsetParent !== null && !field.disabled && 
                        (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA' || field.isContentEditable)) {
                        this.inputField = field;
                        return;
                    }
                }
            }
        },
        
        createSuggestionBox() {
            // Create popup container
            this.suggestionBox = document.createElement('div');
            this.suggestionBox.id = 'iqrpg-emoji-autocomplete';
            this.suggestionBox.style.cssText = `
                position: absolute;
                background: rgb(30, 30, 30);
                border: 1px solid rgb(68, 68, 68);
                border-radius: 4px;
                max-height: 200px;
                overflow-y: auto;
                display: none;
                z-index: 10000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                font-family: Verdana, Arial, sans-serif;
                font-size: 14px;
            `;
            document.body.appendChild(this.suggestionBox);
        },
        
        attachListeners() {
            // Store handler references for cleanup
            this.handleInputHandler = (e) => this.handleInput(e);
            this.handleKeyDownHandler = (e) => this.handleKeyDown(e);
            
            // Listen for input changes and keydown (works for both INPUT/TEXTAREA and contenteditable)
            this.inputField.addEventListener('input', this.handleInputHandler);
            // Use capture phase to intercept before game's handlers
            this.inputField.addEventListener('keydown', this.handleKeyDownHandler, true);
            
            // Hide suggestions when clicking outside
            this.clickOutsideHandler = (e) => {
                if (!this.suggestionBox.contains(e.target) && e.target !== this.inputField) {
                    this.hideSuggestions();
                }
            };
            document.addEventListener('click', this.clickOutsideHandler);
        },
        
        handleInput(e) {
            const text = this.getInputValue();
            const cursorPos = this.getCursorPosition();
            
            // Get text before cursor
            const beforeCursor = text.substring(0, cursorPos);
            
            // Check if user is typing a shortcode
            // Match pattern: :word or :word: (partial or complete shortcode)
            const partialMatch = beforeCursor.match(/:([\w+-]+)$/);
            const completeMatch = beforeCursor.match(/:([\w+-]+):$/);
            
            if (completeMatch) {
                // User typed a complete shortcode (e.g., ":heart:")
                const fullShortcode = `:${completeMatch[1]}:`;
                this.showSuggestionsForCompleteShortcode(fullShortcode, completeMatch.index);
            } else if (partialMatch && partialMatch[1].length > 0) {
                // User is typing a partial shortcode (e.g., ":hear")
                const query = partialMatch[1].toLowerCase();
                this.showSuggestions(query, partialMatch.index);
            } else {
                this.hideSuggestions();
            }
        },
        
        getCursorPosition() {
            if (this.inputField.tagName === 'INPUT' || this.inputField.tagName === 'TEXTAREA') {
                return this.inputField.selectionStart || this.inputField.value.length;
            } else {
                // For contenteditable
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    return range.startOffset;
                }
                return (this.inputField.textContent || '').length;
            }
        },
        
        handleKeyDown(e) {
            if (!this.isActive) return;
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    e.stopPropagation();
                    this.selectedIndex = Math.min(this.selectedIndex + 1, this.currentSuggestions.length - 1);
                    this.updateSelection();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    e.stopPropagation();
                    // Prevent going below 0 - wrap around to last item instead
                    if (this.selectedIndex <= 0) {
                        this.selectedIndex = this.currentSuggestions.length - 1;
                    } else {
                        this.selectedIndex = this.selectedIndex - 1;
                    }
                    this.updateSelection();
                    break;
                case 'Enter':
                case 'Tab':
                    // Always prevent default when autocomplete is active to prevent form submission
                    e.preventDefault();
                    e.stopPropagation();
                    if (this.selectedIndex >= 0 && this.selectedIndex < this.currentSuggestions.length) {
                        this.selectSuggestion(this.selectedIndex);
                    } else {
                        // If no valid selection, just hide suggestions
                        this.hideSuggestions();
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    e.stopPropagation();
                    this.hideSuggestions();
                    break;
            }
        },
        
        getShortcodes() {
            if (!this.shortcodes || this.shortcodes.length === 0) {
                // Try to get shortcodes again
                if (EmojiConverter.availableShortcodes && EmojiConverter.availableShortcodes.length > 0) {
                    this.shortcodes = EmojiConverter.availableShortcodes;
                } else {
                    // Retry discovery
                    EmojiConverter.discoverShortcodes();
                    this.shortcodes = EmojiConverter.availableShortcodes || [];
                }
            }
            return this.shortcodes;
        },
        
        showSuggestionsForCompleteShortcode(fullShortcode, cursorPos) {
            const shortcodes = this.getShortcodes();
            
            if (shortcodes.length === 0) {
                this.hideSuggestions();
                return;
            }
            
            // Check if the complete shortcode is valid and get the actual shortcode from list
            const normalizedShortcode = fullShortcode.toLowerCase();
            const actualShortcode = shortcodes.find(sc => sc.toLowerCase() === normalizedShortcode);
            
            if (actualShortcode) {
                // Show just this one emoji using the actual shortcode from the list
                this.currentSuggestions = [actualShortcode];
                this.selectedIndex = 0;
                this.isActive = true;
                
                // Render suggestions
                this.renderSuggestions([actualShortcode]);
                
                // Position the suggestion box
                this.positionSuggestionBox(cursorPos);
            } else {
                // Invalid shortcode, hide suggestions
                this.hideSuggestions();
            }
        },
        
        showSuggestions(query, cursorPos) {
            // Require at least one character in query
            if (!query || query.length === 0) {
                this.hideSuggestions();
                return;
            }
            
            const shortcodes = this.getShortcodes();
            
            if (shortcodes.length === 0) {
                this.hideSuggestions();
                return;
            }
            
            // Filter shortcodes that match the query
            const matching = shortcodes.filter(sc => {
                if (typeof sc !== 'string' || !sc.startsWith(':') || !sc.endsWith(':')) {
                    return false; // Skip invalid entries
                }
                const shortcodeName = sc.replace(/:/g, '').toLowerCase();
                return shortcodeName.startsWith(query);
            });
            
            // Sort: exact matches first, then prefix matches
            matching.sort((a, b) => {
                const aName = a.replace(/:/g, '').toLowerCase();
                const bName = b.replace(/:/g, '').toLowerCase();
                const aExact = aName === query;
                const bExact = bName === query;
                if (aExact && !bExact) return -1;
                if (!aExact && bExact) return 1;
                return 0;
            });
            
            // Limit to 20 suggestions for performance
            const limitedMatching = matching.slice(0, 20);
            
            if (limitedMatching.length === 0) {
                this.hideSuggestions();
                return;
            }
            
            this.currentSuggestions = limitedMatching;
            this.selectedIndex = 0;
            this.isActive = true;
            
            // Render suggestions
            this.renderSuggestions(limitedMatching);
            
            // Position the suggestion box
            this.positionSuggestionBox(cursorPos);
        },
        
        renderSuggestions(suggestions) {
            this.suggestionBox.innerHTML = '';
            
            suggestions.forEach((shortcode, index) => {
                const item = document.createElement('div');
                item.className = 'iqrpg-emoji-suggestion';
                item.style.cssText = `
                    padding: 8px 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    ${index === this.selectedIndex ? 'background: rgb(34, 136, 34);' : ''}
                `;
                
                // Convert shortcode to emoji for display
                const emojiChar = EmojiConverter.convert(shortcode);
                
                item.innerHTML = `
                    <span style="font-size: 20px;">${emojiChar}</span>
                    <span style="color: rgb(204, 204, 204);">${shortcode}</span>
                `;
                
                item.addEventListener('mouseenter', () => {
                    this.selectedIndex = index;
                    this.updateSelection();
                });
                
                item.addEventListener('click', () => {
                    this.selectSuggestion(index);
                });
                
                this.suggestionBox.appendChild(item);
            });
            
            this.suggestionBox.style.display = 'block';
            this.updateSelection();
        },
        
        updateSelection() {
            const items = this.suggestionBox.querySelectorAll('.iqrpg-emoji-suggestion');
            items.forEach((item, index) => {
                item.style.background = index === this.selectedIndex ? 'rgb(34, 136, 34)' : 'transparent';
            });
            
            // Scroll selected item into view
            if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
                items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
            }
        },
        
        selectSuggestion(index) {
            if (index < 0 || index >= this.currentSuggestions.length) return;
            
            const shortcode = this.currentSuggestions[index];
            const emojiChar = EmojiConverter.convert(shortcode);
            
            // Get current text and cursor position
            const text = this.getInputValue();
            const cursorPos = this.getCursorPosition();
            const beforeCursor = text.substring(0, cursorPos);
            
            // Find the shortcode being typed (match partial or complete)
            const partialMatch = beforeCursor.match(/:([\w+-]+)$/);
            const completeMatch = beforeCursor.match(/:([\w+-]+):$/);
            const match = completeMatch || partialMatch;
            
            if (match) {
                // Replace the shortcode with emoji
                const before = text.substring(0, match.index);
                const after = text.substring(cursorPos);
                const newText = before + emojiChar + after;
                
                this.setInputValue(newText);
                
                // Move cursor after inserted emoji
                const newCursorPos = before.length + emojiChar.length;
                this.setCursorPosition(newCursorPos);
            }
            
            this.hideSuggestions();
        },
        
        getInputValue() {
            if (this.inputField.tagName === 'INPUT' || this.inputField.tagName === 'TEXTAREA') {
                return this.inputField.value;
            } else {
                return this.inputField.textContent || this.inputField.innerText;
            }
        },
        
        setInputValue(value) {
            if (this.inputField.tagName === 'INPUT' || this.inputField.tagName === 'TEXTAREA') {
                this.inputField.value = value;
                this.inputField.dispatchEvent(new Event('input', { bubbles: true }));
            } else {
                this.inputField.textContent = value;
            }
        },
        
        setCursorPosition(pos) {
            if (this.inputField.tagName === 'INPUT' || this.inputField.tagName === 'TEXTAREA') {
                this.inputField.setSelectionRange(pos, pos);
            } else {
                // For contenteditable, set cursor position
                const range = document.createRange();
                const sel = window.getSelection();
                if (this.inputField.childNodes.length > 0) {
                    const textNode = this.inputField.childNodes[0];
                    const maxPos = textNode.textContent ? textNode.textContent.length : 0;
                    range.setStart(textNode, Math.min(pos, maxPos));
                } else {
                    range.setStart(this.inputField, 0);
                }
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        },
        
        positionSuggestionBox(cursorPos) {
            // Get input field position
            const rect = this.inputField.getBoundingClientRect();
            this.suggestionBox.style.top = (rect.bottom + window.scrollY + 5) + 'px';
            this.suggestionBox.style.left = (rect.left + window.scrollX) + 'px';
            this.suggestionBox.style.width = Math.min(300, rect.width) + 'px';
        },
        
        hideSuggestions() {
            this.suggestionBox.style.display = 'none';
            this.isActive = false;
            this.selectedIndex = -1;
            this.currentSuggestions = [];
        },
        
        cleanup() {
            // Remove event listeners
            if (this.inputField) {
                if (this.handleInputHandler) {
                    this.inputField.removeEventListener('input', this.handleInputHandler);
                }
                if (this.handleKeyDownHandler) {
                    this.inputField.removeEventListener('keydown', this.handleKeyDownHandler, true);
                }
            }
            if (this.clickOutsideHandler) {
                document.removeEventListener('click', this.clickOutsideHandler);
                this.clickOutsideHandler = null;
            }
            
            // Remove DOM element
            if (this.suggestionBox && this.suggestionBox.parentNode) {
                this.suggestionBox.parentNode.removeChild(this.suggestionBox);
            }
            
            // Reset state
            this.inputField = null;
            this.suggestionBox = null;
            this.currentSuggestions = [];
            this.selectedIndex = -1;
            this.isActive = false;
            this.handleInputHandler = null;
            this.handleKeyDownHandler = null;
            this.initialized = false;
        }
    };

    // ============================================
    // Message Processing
    // ============================================
    // Track last action bonus to avoid duplicate notifications
    let lastActionBonus = null;

    const MessageProcessor = {
        process(message) {
            if (!message || typeof message !== 'object') return;

            // Handle different message types
            switch (message.type) {
                case CONSTANTS.STRINGS.MESSAGE_TYPE_MSG:
                    this.handleMessageType(message);
                    break;
                case CONSTANTS.STRINGS.MESSAGE_TYPE_ACTION_BONUS:
                    this.handleActionBonus(message);
                    break;
                case CONSTANTS.STRINGS.MESSAGE_TYPE_NOTIFICATION:
                    this.handleNotificationType(message);
                    break;
                default:
                    // Unhandled message types - silently ignore
                    break;
            }
        },

        handleMessageType(message) {
            if (!message.data || !message.data.type) {
                return;
            }

            // Handle global events (crafting notifications)
            if (message.data.type === CONSTANTS.STRINGS.DATA_TYPE_GLOBAL) {
                const config = CONFIG.notifications.globalEvents;
                if (config.sound || config.desktop) {
                    const rawMsg = message.data.msg || 'A global event occurred';
                    const cleanMsg = cleanGameMessage(rawMsg);

                    NotificationManager.notify(
                        'Global',
                        cleanMsg,
                        {
                            sound: config.sound,
                            desktop: config.desktop,
                            soundName: CONSTANTS.STRINGS.SOUND_GLOBAL,
                            soundUrl: CONFIG.sounds.globalEvent,
                            emoji: '🎉'
                        }
                    );
                }
            }

            // Handle eventGlobal messages (gathering events and boss spawns)
            if (message.data.type === CONSTANTS.STRINGS.DATA_TYPE_EVENT_GLOBAL) {
                const rawMsg = message.data.msg || '';
                
                // Clean message (remove HTML tags, game formatting codes, normalize whitespace)
                const cleanMsg = cleanGameMessage(rawMsg);
                const msgLower = cleanMsg.toLowerCase();
                
                // Check if this is a boss spawn message (demon horn indicates multiple bosses spawning)
                const isDemonHorn = CONSTANTS.BOSS_SPAWN_PATTERNS.DEMON_HORN.some(pattern => 
                    msgLower.includes(pattern)
                );
                
                if (isDemonHorn) {
                    // Always use bossSpawn config and sound
                    const config = CONFIG.notifications.bossSpawn;
                    
                    if (config.sound || config.desktop) {
                        NotificationManager.notify(
                            'Boss Event',
                            cleanMsg,
                            {
                                sound: config.sound,
                                desktop: config.desktop,
                                soundName: CONSTANTS.STRINGS.SOUND_BOSS_SPAWN,
                                soundUrl: CONFIG.sounds.bossSpawn,
                                emoji: '👹'
                            }
                        );
                    }
                } else {
                    // Gathering event (woodcutting, quarrying, mining)
                    // Determine specific event type and emoji
                    let eventType;
                    let eventEmoji;
                    let eventConfigKey = null;
                    
                    if (msgLower.includes('spirit tree') || msgLower.includes('forest')) {
                        eventType = 'Woodcutting Event';
                        eventEmoji = '🌲';
                        eventConfigKey = 'woodcutting';
                    } else if (msgLower.includes('sinkhole') || msgLower.includes('ground shakes')) {
                        eventType = 'Quarrying Event';
                        eventEmoji = '🪨';
                        eventConfigKey = 'quarrying';
                    } else if (msgLower.includes('meteorite')) {
                        eventType = 'Mining Event';
                        eventEmoji = '☄️';
                        eventConfigKey = 'mining';
                    }
                    
                    // Only notify if this specific event type is enabled
                    if (eventConfigKey) {
                        const config = CONFIG.notifications.gatheringEvents[eventConfigKey];
                        if (config && (config.sound || config.desktop)) {
                            NotificationManager.notify(
                                eventType,
                                cleanMsg,
                                {
                                    sound: config.sound,
                                    desktop: config.desktop,
                                    soundName: CONSTANTS.STRINGS.SOUND_GATHERING_EVENT,
                                    soundUrl: CONFIG.sounds.gatheringEvent,
                                    emoji: eventEmoji
                                }
                            );
                        }
                    }
                }
            }

            // Handle private messages
            if (message.data.type === CONSTANTS.STRINGS.DATA_TYPE_PM_FROM) {
                const config = CONFIG.notifications.message;
                if (config.sound || config.desktop) {
                    const rawMsg = message.data.msg || '';
                    const cleanMsg = cleanGameMessage(rawMsg);
                    const username = message.data.username || 'Unknown';

                    NotificationManager.notify(
                        `Message from ${username}`,
                        cleanMsg,
                        {
                            sound: config.sound,
                            desktop: config.desktop,
                            soundName: CONSTANTS.STRINGS.SOUND_MESSAGE,
                            soundUrl: CONFIG.sounds.message,
                            emoji: '💬'
                        }
                    );
                }
            }

            // Handle trade channel messages
            if (message.channel === CONSTANTS.STRINGS.CHANNEL_TRADE && message.data.type === CONSTANTS.STRINGS.MESSAGE_TYPE_MSG) {
                this.handleTradeMessage(message);
            }

            // Handle clan chat global messages
            if (message.channel && message.channel.startsWith(CONSTANTS.STRINGS.CHANNEL_CLAN_PREFIX) && 
                message.data.type === CONSTANTS.STRINGS.DATA_TYPE_CLAN_GLOBAL) {
                const config = CONFIG.notifications.clan;
                const rawMsg = message.data.msg || '';
                const cleanMsg = cleanGameMessage(rawMsg);
                
                // Check if this is a watchtower event
                const isWatchtower = rawMsg.toLowerCase().includes('watchtower');
                
                if (isWatchtower) {
                    // Handle watchtower events
                    if (config.watchtower && (config.sound || config.desktop)) {
                        NotificationManager.notify(
                            'Clan Watchtower',
                            cleanMsg,
                            {
                                sound: config.sound,
                                desktop: config.desktop,
                                soundName: CONSTANTS.STRINGS.SOUND_CLAN_WATCHTOWER,
                                soundUrl: CONFIG.sounds.clanWatchtower,
                                emoji: '🐉'
                            }
                        );
                    }
                } else {
                    // Handle other clan global events
                    if (config.clanChatGlobals && (config.sound || config.desktop)) {
                        NotificationManager.notify(
                            'Clan Global',
                            cleanMsg,
                            {
                                sound: config.sound,
                                desktop: config.desktop,
                                soundName: CONSTANTS.STRINGS.SOUND_CLAN_GLOBALS,
                                soundUrl: CONFIG.sounds.clanGlobals,
                                emoji: '🎉'
                            }
                        );
                    }
                }
            }
        },

        handleTradeMessage(message) {
            const config = CONFIG.notifications.tradeAlert;
            if (!config.sound && !config.desktop) return;

            const msgText = (message.data.msg || '').toLowerCase();
            const username = message.data.username || 'Unknown';

            // Normalize patterns to lowercase for case-insensitive matching
            const sellingPatterns = CONSTANTS.TRADE_PATTERNS.SELLING.map(p => p.toLowerCase());
            const buyingPatterns = CONSTANTS.TRADE_PATTERNS.BUYING.map(p => p.toLowerCase());

            // Check if message contains selling indicators (case-insensitive)
            const isSelling = sellingPatterns.some(pattern => msgText.includes(pattern));
            // Check if message contains buying indicators (case-insensitive)
            const isBuying = buyingPatterns.some(pattern => msgText.includes(pattern));

            // Get keywords to check based on message type
            let keywordsToCheck = [];
            let tradeType = '';

            if (isSelling && config.sellingKeywords && config.sellingKeywords.length > 0) {
                keywordsToCheck = config.sellingKeywords;
                tradeType = 'Selling';
            } else if (isBuying && config.buyingKeywords && config.buyingKeywords.length > 0) {
                keywordsToCheck = config.buyingKeywords;
                tradeType = 'Buying';
            }

            if (keywordsToCheck.length === 0) return;

            // Check if any of the keywords match (case-insensitive)
            const matchedKeywords = keywordsToCheck.filter(keyword => {
                // Normalize keyword to lowercase for case-insensitive matching
                const kw = (keyword || '').toLowerCase().trim();
                return kw && msgText.includes(kw);
            });

            if (matchedKeywords.length > 0) {
                const rawMsg = message.data.msg || '';
                const cleanMsg = cleanGameMessage(rawMsg);
                const notificationMsg = `${username}: ${cleanMsg}`;

                NotificationManager.notify(
                    'Trade Alert',
                    notificationMsg,
                    {
                        sound: config.sound,
                        desktop: config.desktop,
                        soundName: CONSTANTS.STRINGS.SOUND_TRADE_ALERT,
                        soundUrl: CONFIG.sounds.tradeAlert,
                        emoji: '💱'
                    }
                );

            }
        },

        handleActionBonus(message) {
            const config = CONFIG.notifications.actionBonus;
            if ((config.sound || config.desktop) && message.data && message.data.actionBonus) {
                const actionBonus = message.data.actionBonus;
                
                // Only notify if the action bonus has actually changed (not on initial load)
                if (lastActionBonus !== null && actionBonus !== lastActionBonus) {
                    const msg = `The action bonus is now active whilst ${actionBonus}`;

                    NotificationManager.notify(
                        'Action Bonus Changed',
                        msg,
                        {
                            sound: config.sound,
                            desktop: config.desktop,
                            soundName: CONSTANTS.STRINGS.SOUND_ACTION_BONUS,
                            soundUrl: CONFIG.sounds.actionBonus,
                            emoji: '✨'
                        }
                    );
                }
                
                // Always update the tracked value
                lastActionBonus = actionBonus;
            }
        },

        handleNotificationType(message) {
            // Check if this is a market sale notification
            if (message.channel === CONSTANTS.STRINGS.CHANNEL_NOTIFICATIONS && 
                message.data && 
                message.data.type === CONSTANTS.STRINGS.DATA_TYPE_NOTIFICATION &&
                message.data.msg) {
                
                const rawMsg = message.data.msg || '';
                const msgLower = rawMsg.toLowerCase();
                
                // Check if message contains "sold" to identify market sales
                if (msgLower.includes('sold') || msgLower.includes('you have sold')) {
                    // Parse and track the sale
                    const saleData = MarketDataTracker.parseSaleMessage(rawMsg);
                    if (saleData) {
                        MarketDataTracker.recordSale(saleData);
                    }
                    
                    const config = CONFIG.notifications.marketSale;
                    if (config.sound || config.desktop) {
                        const cleanMsg = cleanGameMessage(rawMsg);

                        NotificationManager.notify(
                            'Market Sale',
                            cleanMsg,
                            {
                                sound: config.sound,
                                desktop: config.desktop,
                                soundName: CONSTANTS.STRINGS.SOUND_MARKET_SALE,
                                soundUrl: CONFIG.sounds.marketSale,
                                emoji: '🪙'
                            }
                        );
                    }
                }
                // Check if message contains "received" to identify item receipts
                else if (msgLower.includes('received') || msgLower.includes('have received') || msgLower.includes('got')) {
                    // Parse and track the received item
                    const itemData = MarketDataTracker.parseReceivedItem(rawMsg);
                    if (itemData) {
                        MarketDataTracker.recordReceivedItem(itemData);
                        
                        const config = CONFIG.notifications.itemReceived;
                        if (config.sound || config.desktop) {
                            const cleanMsg = cleanGameMessage(rawMsg);
                            
                            // Check if this is Gold
                            const isGold = itemData.itemName === 'Gold';
                            const title = isGold ? 'Gold Received' : 'Item Received';
                            const emoji = isGold ? '🪙' : '📦';
                            const soundName = isGold ? CONSTANTS.STRINGS.SOUND_GOLD_RECEIVED : CONSTANTS.STRINGS.SOUND_ITEM_RECEIVED;
                            const soundUrl = isGold ? CONFIG.sounds.goldReceived : CONFIG.sounds.itemReceived;

                            NotificationManager.notify(
                                title,
                                cleanMsg,
                                {
                                    sound: config.sound,
                                    desktop: config.desktop,
                                    soundName: soundName,
                                    soundUrl: soundUrl,
                                    emoji: emoji
                                }
                            );
                        }
                    }
                }
            }
        }
    };

    // ============================================
    // DOM Observation for UI-Based Events
    // ============================================
    const DOMMonitor = {
        checkInterval: null,
        lastAutosCount: null,
        autosRepeatCount: 0,
        isUnderThreshold: false,
        lastAutosNotificationTime: null,
        lastDungeonText: null,
        pendingDungeonText: null,
        lastMasteryLevel: null,
        lastMasteryName: null,
        lastRaidTimer: null,
        skillLevels: new Map(),
        processedItemDrops: new Set(),
        lastAbyssBattlesCount: null,
        lastPotionCounts: new Map(),
        potionRepeatCounts: new Map(),
        potionUnderThreshold: new Map(),
        lastPotionNotificationTimes: new Map(),
        
        // Cached DOM element references for performance
        cachedElements: {
            autoElement: null,
            gameGrid: null,
            leftSidebar: null,
            logDiv: null,
            raidContainer: null,
            mainGameSection: null,
            effectsPanel: null
        },
        
        // MutationObserver instances for instant notifications
        autosObserver: null,
        potionsObserver: null,
        
        // Debounce timeouts
        autosCheckTimeout: null,
        potionsCheckTimeout: null,
        
        // Retry timeouts for observer setup
        autosSetupRetryTimeout: null,
        potionsSetupRetryTimeout: null,
        
        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.setupObservers();
                    this.startObserving();
                });
            } else {
                this.setupObservers();
                this.startObserving();
            }
        },
        
        setupObservers() {
            // Set up MutationObserver for autos (instant notifications)
            this.setupAutosObserver();
            // Set up MutationObserver for potions (instant notifications)
            this.setupPotionsObserver();
        },
        
        setupAutosObserver() {
            const config = CONFIG.notifications.autos;
            if (!config.sound && !config.desktop) return;
            
            // Try to find the autos element
            // Validate cached element is still in DOM before using it
            let autoElement = this.cachedElements.autoElement;
            if (autoElement && !document.contains(autoElement)) {
                // Cached element is no longer in DOM, clear it
                this.cachedElements.autoElement = null;
                autoElement = null;
            }
            
            // If no valid cached element, query for it
            if (!autoElement) {
                autoElement = document.querySelector('.action-timer__text');
            }
            
            if (!autoElement) {
                // Clear any existing retry timeout to prevent accumulation
                if (this.autosSetupRetryTimeout) {
                    clearTimeout(this.autosSetupRetryTimeout);
                }
                // Retry after a delay if element not found yet
                this.autosSetupRetryTimeout = setTimeout(() => {
                    this.autosSetupRetryTimeout = null;
                    this.setupAutosObserver();
                }, 1000);
                return;
            }
            
            // Clear retry timeout if element was found
            if (this.autosSetupRetryTimeout) {
                clearTimeout(this.autosSetupRetryTimeout);
                this.autosSetupRetryTimeout = null;
            }
            
            // Cache the element
            this.cachedElements.autoElement = autoElement;
            
            // Disconnect existing observer if any
            if (this.autosObserver) {
                this.autosObserver.disconnect();
            }
            
            // Create new observer
            this.autosObserver = new MutationObserver(() => {
                // Debounce to avoid too many checks
                clearTimeout(this.autosCheckTimeout);
                this.autosCheckTimeout = setTimeout(() => {
                    this.checkForAutos();
                }, 100);
            });
            
            // Observe the autos element for changes
            this.autosObserver.observe(autoElement, {
                childList: true,
                subtree: true,
                characterData: true
            });
        },
        
        setupPotionsObserver() {
            const config = CONFIG.notifications.potions;
            if (!config.sound && !config.desktop) return;
            
            // Try to find the Effects panel - look for main-section that contains potions
            // The Effects panel is typically in the right sidebar
            // Validate cached panel is still in DOM before using it
            let effectsPanel = this.cachedElements.effectsPanel;
            if (effectsPanel && !document.contains(effectsPanel)) {
                // Cached panel is no longer in DOM, clear it
                this.cachedElements.effectsPanel = null;
                effectsPanel = null;
            }
            
            if (!effectsPanel) {
                // Look for main-section that contains "Effects" or potion-related content
                const mainSections = document.querySelectorAll('.main-section');
                for (const section of mainSections) {
                    const header = section.querySelector('.main-section__header');
                    if (header && (header.textContent || '').toLowerCase().includes('effect')) {
                        effectsPanel = section.querySelector('.main-section__body');
                        if (effectsPanel) break;
                    }
                }
            }
            
            if (!effectsPanel) {
                // Clear any existing retry timeout to prevent accumulation
                if (this.potionsSetupRetryTimeout) {
                    clearTimeout(this.potionsSetupRetryTimeout);
                }
                // Retry after a delay if panel not found yet
                this.potionsSetupRetryTimeout = setTimeout(() => {
                    this.potionsSetupRetryTimeout = null;
                    this.setupPotionsObserver();
                }, 1000);
                return;
            }
            
            // Clear retry timeout if panel was found
            if (this.potionsSetupRetryTimeout) {
                clearTimeout(this.potionsSetupRetryTimeout);
                this.potionsSetupRetryTimeout = null;
            }
            
            // Cache the element
            this.cachedElements.effectsPanel = effectsPanel;
            
            // Disconnect existing observer if any
            if (this.potionsObserver) {
                this.potionsObserver.disconnect();
            }
            
            // Create new observer
            this.potionsObserver = new MutationObserver(() => {
                // Debounce to avoid too many checks
                clearTimeout(this.potionsCheckTimeout);
                this.potionsCheckTimeout = setTimeout(() => {
                    this.checkForPotionThreshold();
                }, 100);
            });
            
            // Observe the effects panel for changes
            this.potionsObserver.observe(effectsPanel, {
                childList: true,
                subtree: true,
                characterData: true
            });
        },
        
        startObserving() {
            // Initialize processed items immediately before starting the interval
            // This prevents notifications for items that were already in the log before page load
            this.initializeProcessedItemDrops();
            
            // Check periodically for less frequent changes
            // Autos and potions are now handled by MutationObserver for instant notifications
            // But we'll also check them as fallback if observers aren't set up
            this.checkInterval = setInterval(() => {
                // Fallback checks for autos and potions if observers aren't working
                if (!this.autosObserver || !this.cachedElements.autoElement) {
                    this.checkForAutos();
                }
                if (!this.potionsObserver || !this.cachedElements.effectsPanel) {
                    this.checkForPotionThreshold();
                }
                
                // Regular polling checks
                this.checkForDungeonCompletion();
                this.checkForMasteryLevelIncrease();
                this.checkForLandCompletion();
                this.checkForSkillLevelIncrease();
                this.checkForItemDrops();
                this.checkForAbyssBattlesCompletion();
            }, 1000); // Check every second
        },
        
        checkForAutos() {
            const config = CONFIG.notifications.autos;
            if (!config.sound && !config.desktop) return;
            
            // Use cached element or try to find it
            let autoElement = this.cachedElements.autoElement;
            const wasElementCached = !!autoElement;
            const wasElementInDOM = wasElementCached && document.contains(autoElement);
            
            if (!autoElement || !wasElementInDOM) {
                autoElement = document.querySelector('.action-timer__text');
                if (!autoElement) {
                    this.cachedElements.autoElement = null;
                    // Disconnect observer if element disappeared
                    if (this.autosObserver) {
                        this.autosObserver.disconnect();
                        this.autosObserver = null;
                    }
                    // Try to re-setup observer if element disappeared
                    if (!this.autosSetupRetryTimeout) {
                        this.autosSetupRetryTimeout = setTimeout(() => {
                            this.autosSetupRetryTimeout = null;
                            this.setupAutosObserver();
                        }, 1000);
                    }
                    return;
                }
                
                // Element found - update cache
                const elementChanged = this.cachedElements.autoElement !== autoElement;
                this.cachedElements.autoElement = autoElement;
                
                // If element changed or observer doesn't exist, reconnect observer
                if (elementChanged || !this.autosObserver) {
                    // Disconnect existing observer if it exists
                    if (this.autosObserver) {
                        this.autosObserver.disconnect();
                        this.autosObserver = null;
                    }
                    // Reconnect observer to the new element
                    // Create new observer with same callback
                    this.autosObserver = new MutationObserver(() => {
                        // Debounce to avoid too many checks
                        clearTimeout(this.autosCheckTimeout);
                        this.autosCheckTimeout = setTimeout(() => {
                            this.checkForAutos();
                        }, 100);
                    });
                    
                    // Observe the new element
                    this.autosObserver.observe(autoElement, {
                        childList: true,
                        subtree: true,
                        characterData: true
                    });
                }
            }
            
            const text = autoElement.textContent || '';
            const match = text.match(/Autos Remaining:\s*(\d+)/i);
            
            if (match) {
                const currentAutos = parseInt(match[1], 10);
                const threshold = config.threshold || 0;
                const repeatCount = config.repeatCount || 1;
                const wasUnderThreshold = this.isUnderThreshold;
                const isCurrentlyUnder = currentAutos <= threshold;
                
                // Check if we've crossed the threshold (went from above to at/below threshold)
                if (this.lastAutosCount !== null && 
                    this.lastAutosCount > threshold && 
                    currentAutos <= threshold) {
                    
                    // Just crossed threshold - trigger first notification
                    this.autosRepeatCount = 1;
                    this.isUnderThreshold = true;
                    this.lastAutosNotificationTime = Date.now();
                    
                    NotificationManager.notify(
                        'Autos Alert',
                        text.trim(),
                        {
                            sound: config.sound,
                            desktop: config.desktop,
                            soundName: CONSTANTS.STRINGS.SOUND_AUTOS,
                            soundUrl: CONFIG.sounds.autos,
                            emoji: '🪫'
                        }
                    );
                } 
                // Check if we're still under threshold and need to repeat
                else if (isCurrentlyUnder && wasUnderThreshold && this.autosRepeatCount < repeatCount) {
                    const repeatInterval = config.repeatInterval !== undefined ? config.repeatInterval : 0; // Default to 0 (immediate) if not set
                    const now = Date.now();
                    const timeSinceLastNotification = this.lastAutosNotificationTime 
                        ? (now - this.lastAutosNotificationTime) / 1000 
                        : Infinity; // If no previous notification, allow it
                    
                    // Check if enough time has passed (or interval is 0 for immediate repeats)
                    if (repeatInterval === 0 || timeSinceLastNotification >= repeatInterval) {
                        // Still under threshold and haven't reached repeat limit
                        this.autosRepeatCount++;
                        this.lastAutosNotificationTime = now;
                        
                        NotificationManager.notify(
                            'Autos Alert',
                            text.trim(),
                            {
                                sound: config.sound,
                                desktop: config.desktop,
                                soundName: CONSTANTS.STRINGS.SOUND_AUTOS,
                                soundUrl: CONFIG.sounds.autos,
                                emoji: '🪫'
                            }
                        );
                    }
                }
                // Check if we've gone back above threshold
                else if (wasUnderThreshold && !isCurrentlyUnder) {
                    // Reset repeat counter and notification time when we go back above threshold
                    this.autosRepeatCount = 0;
                    this.isUnderThreshold = false;
                    this.lastAutosNotificationTime = null;
                }
                // Update state if we're currently under threshold
                else if (isCurrentlyUnder) {
                    this.isUnderThreshold = true;
                }
                
                this.lastAutosCount = currentAutos;
            }
        },
        
        checkForDungeonCompletion() {
            const config = CONFIG.notifications.dungeon;
            if (!config.sound && !config.desktop) return;
            
            const dungeonChest = document.querySelector('.d_chest');
            
            // If chest exists, track it but don't notify yet if we need to check progress
            if (dungeonChest) {
                // Find the green text paragraph with the completion message
                const greenText = dungeonChest.querySelector('.green-text');
                if (!greenText) return;
                
                const text = greenText.textContent || '';
                
                // Only proceed if this is a new dungeon completion (different text)
                if (text && text !== this.lastDungeonText) {
                    // If we need to check for all keys complete, wait for progress text to update
                    if (config.onlyWhenAllKeysComplete) {
                        // Store the text and check progress when chest disappears
                        this.pendingDungeonText = text;
                        return;
                    }
                    
                    // Otherwise, notify immediately
                    this.sendDungeonNotification(text, config);
                }
            } 
            // When chest disappears, check progress text if we have a pending notification
            else if (this.pendingDungeonText && config.onlyWhenAllKeysComplete) {
                // Query .progress__text directly
                const progressText = document.querySelector('.progress__text');
                if (progressText) {
                    const progressTextContent = (progressText.textContent || '').trim().toLowerCase();
                    // If it contains "dungeoneering", user has more keys - don't notify
                    if (progressTextContent.includes('dungeoneering')) {
                        // Still has keys left, skip notification
                        this.pendingDungeonText = null;
                        return;
                    }
                    // Otherwise, all keys are completed - send notification
                    this.sendDungeonNotification(this.pendingDungeonText, config);
                    this.pendingDungeonText = null;
                } else {
                    // Progress text not found, clear pending
                    this.pendingDungeonText = null;
                }
            } else {
                // Reset tracking when chest disappears and no pending notification
                this.lastDungeonText = null;
                this.pendingDungeonText = null;
            }
        },
        
        sendDungeonNotification(text, config) {
            this.lastDungeonText = text;
            
            NotificationManager.notify(
                'Dungeon Complete',
                text.trim(),
                {
                    sound: config.sound,
                    desktop: config.desktop,
                    soundName: CONSTANTS.STRINGS.SOUND_DUNGEON,
                    soundUrl: CONFIG.sounds.dungeon,
                    emoji: '🗝️'
                }
            );
        },
        
        checkForMasteryLevelIncrease() {
            const config = CONFIG.notifications.mastery;
            if (!config.sound && !config.desktop) return;
            
            try {
                // Use cached elements or find them
                let gameGrid = this.cachedElements.gameGrid;
                if (!gameGrid || !document.contains(gameGrid)) {
                    gameGrid = document.querySelector('.game-grid');
                    if (!gameGrid) {
                        this.cachedElements.gameGrid = null;
                        this.cachedElements.leftSidebar = null;
                        return;
                    }
                    this.cachedElements.gameGrid = gameGrid;
                }
                
                let leftSidebar = this.cachedElements.leftSidebar;
                if (!leftSidebar || !document.contains(leftSidebar)) {
                    leftSidebar = gameGrid.children[0]; // First div (left sidebar)
                    if (!leftSidebar) {
                        this.cachedElements.leftSidebar = null;
                        return;
                    }
                    this.cachedElements.leftSidebar = leftSidebar;
                }
                
                // Find all .main-section divs in left sidebar
                const mainSections = leftSidebar.querySelectorAll('.main-section');
                if (mainSections.length < 2) return; // Need at least 2 sections
                
                const masteriesPanel = mainSections[1]; // Second .main-section (masteries panel)
                if (!masteriesPanel) return;
                
                // Find .main-section__body
                const body = masteriesPanel.querySelector('.main-section__body');
                if (!body) return;
                
                // Find the unnamed div (first child of body)
                const unnamedDiv = body.children[0];
                if (!unnamedDiv) return;
                
                // Find all .relative.clickable divs (all masteries)
                const masteryDivs = unnamedDiv.querySelectorAll('.relative.clickable');
                if (!masteryDivs || masteryDivs.length === 0) return;
                
                // Find the active mastery (the one that's green/selected)
                // The active one should have a .flex.space-between with span.activeText and span.green-text
                let activeMastery = null;
                let masteryName = null;
                let masteryLevel = null;
                
                for (const masteryDiv of masteryDivs) {
                    const flexDiv = masteryDiv.querySelector('.flex.space-between');
                    if (!flexDiv) continue;
                    
                    const activeText = flexDiv.querySelector('span.activeText');
                    const greenText = flexDiv.querySelector('span.green-text');
                    
                    // If both exist, this is likely the active mastery
                    if (activeText && greenText) {
                        activeMastery = masteryDiv;
                        masteryName = (activeText.textContent || '').trim();
                        const levelText = (greenText.textContent || '').trim();
                        
                        // Parse level number directly (green-text is just a number)
                        masteryLevel = parseInt(levelText, 10);
                        
                        // Validate that we got a valid number
                        if (isNaN(masteryLevel)) {
                            continue; // Skip this mastery if level is not a valid number
                        }
                        break;
                    }
                }
                
                // If we found an active mastery with valid data
                if (activeMastery && masteryName && masteryLevel !== null && !isNaN(masteryLevel)) {
                    // Check if this is a new mastery or level increase
                    if (this.lastMasteryName !== masteryName) {
                        // User switched to a different mastery - reset tracking
                        this.lastMasteryName = masteryName;
                        this.lastMasteryLevel = masteryLevel;
                        return;
                    }
                    
                    // Same mastery - check if level increased
                    if (this.lastMasteryLevel !== null && masteryLevel > this.lastMasteryLevel) {
                        // Level increased!
                        NotificationManager.notify(
                            'Mastery Level Up!',
                            `${masteryName} reached level ${masteryLevel}`,
                            {
                                sound: config.sound,
                                desktop: config.desktop,
                                soundName: CONSTANTS.STRINGS.SOUND_MASTERY,
                                soundUrl: CONFIG.sounds.mastery,
                                emoji: '⭐'
                            }
                        );
                    }
                    
                    // Update tracking
                    this.lastMasteryName = masteryName;
                    this.lastMasteryLevel = masteryLevel;
                }
            } catch (error) {
                // Silently fail if DOM structure changes or element not found
            }
        },
        
        checkForLandCompletion() {
            const config = CONFIG.notifications.land;
            if (!config.sound && !config.desktop) return;
            
            try {
                // Use cached raid container if available and still in DOM
                let raidContainer = this.cachedElements.raidContainer;
                
                if (!raidContainer || !document.contains(raidContainer)) {
                    // Try to find it with a more targeted approach
                    // Look for main-section containers that might contain raid info
                    const possibleContainers = document.querySelectorAll('.main-section, .sidebar-section');
                    for (const container of possibleContainers) {
                        if (container.textContent && container.textContent.includes('Raid:')) {
                            raidContainer = container.querySelector('.flex.space-between');
                            if (raidContainer) break;
                        }
                    }
                    
                    // Fallback: query all flex containers if targeted approach didn't work
                    if (!raidContainer) {
                        const flexContainers = document.querySelectorAll('.flex.space-between');
                        for (const container of flexContainers) {
                            const text = container.textContent || '';
                            if (text.includes('Raid:')) {
                                raidContainer = container;
                                break;
                            }
                        }
                    }
                    
                    // Cache the found container
                    this.cachedElements.raidContainer = raidContainer;
                }
                
                if (!raidContainer) return;
                
                // Find the div containing "Raid:" text (first child div)
                const raidTextDiv = Array.from(raidContainer.children).find(child => {
                    return child.tagName === 'DIV' && (child.textContent || '').includes('Raid:');
                });
                
                if (!raidTextDiv) return;
                
                // Extract raid name from the span inside the raid text div
                const raidNameSpan = raidTextDiv.querySelector('span');
                const raidName = raidNameSpan ? (raidNameSpan.textContent || '').trim() : '';
                
                if (!raidName) return;
                
                // Find the status div - it should be the second child div (not the raid text div)
                const statusDiv = Array.from(raidContainer.children).find(child => {
                    return child.tagName === 'DIV' && child !== raidTextDiv && 
                           child.textContent && child.textContent.trim();
                });
                
                if (!statusDiv) return;
                
                // Get the text from the <a> tag inside the status div, or fallback to div text
                const statusLink = statusDiv.querySelector('a');
                const statusText = (statusLink ? statusLink.textContent : statusDiv.textContent || '').trim();
                
                // Check if status changed to "Returned"
                if (statusText.toLowerCase() === 'returned') {
                    // Only notify when transitioning from NOT "returned" to "returned"
                    if (this.lastRaidTimer !== 'returned') {
                        NotificationManager.notify(
                            'Land',
                            `Raid: ${raidName} Returned!`,
                            {
                                sound: config.sound,
                                desktop: config.desktop,
                                soundName: CONSTANTS.STRINGS.SOUND_LAND,
                                soundUrl: CONFIG.sounds.land,
                                emoji: '🏰'
                            }
                        );
                    }
                    
                    // Update tracking
                    this.lastRaidTimer = 'returned';
                } else {
                    // Status is not "Returned" - update tracking
                    this.lastRaidTimer = statusText;
                }
            } catch (error) {
                // Clear cache on error
                this.cachedElements.raidContainer = null;
            }
        },
        
        checkForSkillLevelIncrease() {
            const config = CONFIG.notifications.skills;
            if (!config.sound && !config.desktop) return;
            
            try {
                // Use direct selector approach - find all skill-bar divs
                const skillBars = document.querySelectorAll('.skill-bar');
                
                if (!skillBars || skillBars.length === 0) return;
                
                // Process each skill-bar
                for (const skillBar of skillBars) {
                    // Find the progress__text element (try both variations)
                    const progressText = skillBar.querySelector('.progress__text') || 
                                       skillBar.querySelector('.progress_text');
                    
                    if (!progressText) continue;
                    
                    const text = (progressText.textContent || '').trim();
                    
                    // Parse text like "Battling (120)" to extract skill name and level
                    // Match pattern: "Skill Name (level)"
                    const match = text.match(/^(.+?)\s*\((\d+)\)$/);
                    
                    if (!match || match.length < 3) continue;
                    
                    const skillName = match[1].trim();
                    const currentLevel = parseInt(match[2], 10);
                    
                    if (!skillName || isNaN(currentLevel)) continue;
                    
                    // Check if we've seen this skill before
                    const previousLevel = this.skillLevels.get(skillName);
                    
                    if (previousLevel !== undefined) {
                        // Skill exists in tracking - check if level increased
                        if (currentLevel > previousLevel) {
                            // Level increased!
                            NotificationManager.notify(
                                'Skills',
                                `Skill leveled up! ${skillName} (${currentLevel})`,
                                {
                                    sound: config.sound,
                                    desktop: config.desktop,
                                    soundName: CONSTANTS.STRINGS.SOUND_SKILLS,
                                    soundUrl: CONFIG.sounds.skills,
                                    emoji: '⏫'
                                }
                            );
                        }
                    }
                    
                    // Update tracking (always update to current level)
                    this.skillLevels.set(skillName, currentLevel);
                }
            } catch (error) {
                // Silently fail if DOM structure changes or element not found
            }
        },
        
        initializeProcessedItemDrops() {
            const config = CONFIG.notifications.itemDrop;
            if (!config.itemKeywords || config.itemKeywords.length === 0) return;
            
            const validKeywords = config.itemKeywords.filter(kw => kw && typeof kw === 'string' && kw.trim().length > 0);
            if (validKeywords.length === 0) return;
            
            try {
                const logDiv = document.querySelector('#log-div') || document.querySelector('.log-div');
                if (!logDiv) return;
                
                const itemDivs = logDiv.querySelectorAll('.item.clickable');
                for (const itemDiv of itemDivs) {
                    const itemNamePara = itemDiv.querySelector('p');
                    if (!itemNamePara) continue;
                    
                    let itemName = (itemNamePara.textContent || '').trim();
                    itemName = itemName.replace(/^\[|\]$/g, '').trim();
                    if (!itemName) continue;
                    
                    const itemNameLower = itemName.toLowerCase();
                    const matchedKeyword = validKeywords.find(keyword => {
                        const kw = (keyword || '').toLowerCase().trim();
                        return kw && itemNameLower.includes(kw);
                    });
                    
                    if (!matchedKeyword) continue;
                    
                    // Extract amount and timestamp to create unique ID
                    let amount = '1';
                    let timestamp = '';
                    let container = itemDiv.parentElement;
                    while (container && container !== logDiv) {
                        const spans = container.querySelectorAll('span');
                        for (const span of spans) {
                            const spanText = (span.textContent || '').trim();
                            if (spanText.match(/\+?\d+/)) {
                                const amountMatch = spanText.match(/\+?(\d+)/);
                                if (amountMatch && amountMatch[1]) {
                                    amount = amountMatch[1];
                                }
                            }
                            // Look specifically for timestamp pattern [HH:MM:SS] or HH:MM:SS
                            if (!timestamp) {
                                const timeMatch = spanText.match(/\[?(\d{1,2}:\d{2}:\d{2})\]?/);
                                if (timeMatch) {
                                    timestamp = timeMatch[1]; // Extract just the time part (HH:MM:SS)
                                }
                            }
                        }
                        if (amount !== '1' && timestamp) break;
                        container = container.parentElement;
                    }
                    
                    // Mark current items as processed using unique ID
                    const uniqueId = `${itemNameLower}|${amount}|${timestamp}`;
                    this.processedItemDrops.add(uniqueId);
                }
            } catch (e) {
                // Silently fail if DOM structure changes
            }
        },
        
        checkForItemDrops() {
            const config = CONFIG.notifications.itemDrop;
            if (!config.sound && !config.desktop) return;
            if (!config.itemKeywords || config.itemKeywords.length === 0) return;
            
            // Filter out any empty or whitespace-only keywords
            const validKeywords = config.itemKeywords.filter(kw => kw && typeof kw === 'string' && kw.trim().length > 0);
            if (validKeywords.length === 0) return;
            
            try {
                // Use cached logDiv or find it
                let logDiv = this.cachedElements.logDiv;
                if (!logDiv || !document.contains(logDiv)) {
                    logDiv = document.querySelector('#log-div') || document.querySelector('.log-div');
                    if (!logDiv) {
                        this.cachedElements.logDiv = null;
                        return;
                    }
                    this.cachedElements.logDiv = logDiv;
                }
                
                // Find all item clickable divs within the log
                const itemDivs = logDiv.querySelectorAll('.item.clickable');
                if (!itemDivs || itemDivs.length === 0) return;
                
                // Process each item drop entry
                for (const itemDiv of itemDivs) {
                    // Find the paragraph containing the item name
                    const itemNamePara = itemDiv.querySelector('p');
                    if (!itemNamePara) continue;
                    
                    // Extract item name (remove brackets if present)
                    let itemName = (itemNamePara.textContent || '').trim();
                    itemName = itemName.replace(/^\[|\]$/g, '').trim();
                    
                    if (!itemName) continue;
                    
                    // Check if this item matches any tracked keyword (case-insensitive)
                    const itemNameLower = itemName.toLowerCase();
                    const matchedKeyword = validKeywords.find(keyword => {
                        const kw = (keyword || '').toLowerCase().trim();
                        return kw && itemNameLower.includes(kw);
                    });
                    
                    if (!matchedKeyword) continue;
                    
                    // Find the amount and timestamp - look for it in the log entry container
                    // The structure is: log entry container -> timestamp span -> amount span -> item div
                    let amount = '1'; // Default to 1 if not found
                    let timestamp = ''; // Track timestamp for unique identification
                    
                    // Try to find the log entry container (parent of item div, or parent's parent)
                    let container = itemDiv.parentElement;
                    while (container && container !== logDiv) {
                        // Look for spans that might contain the amount or timestamp
                        const spans = container.querySelectorAll('span');
                        for (const span of spans) {
                            const spanText = (span.textContent || '').trim();
                            
                            // Check if this span contains a number pattern like "+1 " or "+5 "
                            if (spanText.match(/\+?\d+/)) {
                                const amountMatch = spanText.match(/\+?(\d+)/);
                                if (amountMatch && amountMatch[1]) {
                                    amount = amountMatch[1];
                                }
                            }
                            
                            // Look specifically for timestamp pattern [HH:MM:SS] or HH:MM:SS
                            if (!timestamp) {
                                const timeMatch = spanText.match(/\[?(\d{1,2}:\d{2}:\d{2})\]?/);
                                if (timeMatch) {
                                    timestamp = timeMatch[1]; // Extract just the time part (HH:MM:SS)
                                }
                            }
                        }
                        if (amount !== '1' && timestamp) break; // Found both, exit loop
                        
                        // Move up to parent container
                        container = container.parentElement;
                    }
                    
                    // Create unique identifier: item name + amount + timestamp
                    // This prevents duplicate notifications even if DOM elements are recreated
                    const uniqueId = `${itemNameLower}|${amount}|${timestamp}`;
                    
                    // Skip if already processed
                    if (this.processedItemDrops.has(uniqueId)) continue;
                    
                    // Mark as processed
                    this.processedItemDrops.add(uniqueId);
                    
                    // Send notification
                    NotificationManager.notify(
                        'Item Log',
                        `Found ${amount}x ${itemName}`,
                        {
                            sound: config.sound,
                            desktop: config.desktop,
                            soundName: CONSTANTS.STRINGS.SOUND_ITEM_DROP,
                            soundUrl: CONFIG.sounds.itemDrop,
                            emoji: '💰'
                        }
                    );
                }
            } catch (error) {
                // Clear cache on error
                this.cachedElements.logDiv = null;
            }
        },
        
        checkForAbyssBattlesCompletion() {
            const config = CONFIG.notifications.abyssBattles;
            if (!config.sound && !config.desktop) return;
            
            try {
                // Use cached mainGameSection or find it
                let mainGameSection = this.cachedElements.mainGameSection;
                if (!mainGameSection || !document.contains(mainGameSection)) {
                    mainGameSection = document.querySelector('.main-game-section');
                    if (!mainGameSection) {
                        this.cachedElements.mainGameSection = null;
                        return;
                    }
                    this.cachedElements.mainGameSection = mainGameSection;
                }
                
                // Find all divs with the specific classes
                const battleDivs = mainGameSection.querySelectorAll('.margin-top-small.grey-text');
                let battlesDiv = null;
                
                // Find the one containing " Battles Remaining"
                for (const div of battleDivs) {
                    const text = div.textContent || '';
                    if (text.includes('Battles Remaining')) {
                        battlesDiv = div;
                        break;
                    }
                }
                
                // If battlesDiv doesn't exist, we're not in abyss battles section
                // Reset tracking and don't assume completion
                if (!battlesDiv) {
                    this.lastAbyssBattlesCount = null;
                    return;
                }
                
                // Find the span with class "green-text" inside it
                const battlesSpan = battlesDiv.querySelector('span.green-text');
                if (!battlesSpan) {
                    // If span doesn't exist but div does, reset tracking
                    this.lastAbyssBattlesCount = null;
                    return;
                }
                
                const battlesText = (battlesSpan.textContent || '').trim();
                const battlesCount = parseInt(battlesText, 10);
                
                // Check if count is valid
                if (isNaN(battlesCount)) {
                    // If text is not a number, reset tracking
                    this.lastAbyssBattlesCount = null;
                    return;
                }
                
                // Detect when battles reach 0 (completed)
                // Only notify when transitioning from > 0 to 0
                if (battlesCount === 0) {
                    // Only notify if we haven't already notified for this completion
                    // and we were previously tracking a count > 0
                    if (this.lastAbyssBattlesCount !== null && this.lastAbyssBattlesCount > 0) {
                        NotificationManager.notify(
                            'Abyss Battles',
                            'All Abyss Battles Completed!',
                            {
                                sound: config.sound,
                                desktop: config.desktop,
                                soundName: CONSTANTS.STRINGS.SOUND_ABYSS_BATTLES,
                                soundUrl: CONFIG.sounds.abyssBattles,
                                emoji: '🌀'
                            }
                        );
                    }
                }
                
                // Update tracking (always update, even if 0, to prevent duplicate notifications)
                this.lastAbyssBattlesCount = battlesCount;
            } catch (error) {
                // Silently fail if DOM structure changes or element not found
                this.lastAbyssBattlesCount = null;
            }
        },
        
        checkForPotionThreshold() {
            const config = CONFIG.notifications.potions;
            if (!config.sound && !config.desktop) return;
            
            try {
                // Use cached effects panel if available, otherwise query all flex divs
                let allFlexDivs;
                const effectsPanel = this.cachedElements.effectsPanel;
                
                if (effectsPanel && document.contains(effectsPanel)) {
                    // Query only within the effects panel for better performance
                    allFlexDivs = effectsPanel.querySelectorAll('.flex.space-between');
                } else {
                    // Fallback: query all flex divs (less efficient but works)
                    allFlexDivs = document.querySelectorAll('.flex.space-between');
                }
                
                if (!allFlexDivs || allFlexDivs.length === 0) return;
                
                const threshold = config.threshold || 0;
                const repeatCount = config.repeatCount || 1;
                
                // Process each flex div to find potion entries
                for (const flexDiv of allFlexDivs) {
                    // Check if this div contains a potion (has an item clickable with a potion name and a green-text span)
                    const itemDiv = flexDiv.querySelector('.item.clickable');
                    if (!itemDiv) continue;
                    
                    const potionNamePara = itemDiv.querySelector('p');
                    if (!potionNamePara) continue;
                    
                    // Extract potion name (remove brackets if present)
                    let potionName = (potionNamePara.textContent || '').trim();
                    potionName = potionName.replace(/^\[|\]$/g, '').trim();
                    if (!potionName) continue;
                    
                    // Check if this is actually a potion (contains "Potion" in the name)
                    if (!potionName.toLowerCase().includes('potion')) continue;
                    
                    // Find the green-text span with the count
                    const countSpan = flexDiv.querySelector('span.green-text');
                    if (!countSpan) continue;
                    
                    // Parse the count (remove commas)
                    const countText = (countSpan.textContent || '').trim().replace(/,/g, '');
                    const currentCount = parseInt(countText, 10);
                    
                    if (isNaN(currentCount)) continue;
                    
                    // Get previous count for this potion
                    const previousCount = this.lastPotionCounts.get(potionName);
                    const wasUnderThreshold = this.potionUnderThreshold.get(potionName) || false;
                    const isCurrentlyUnder = currentCount <= threshold;
                    
                    // Check if we've crossed the threshold (went from above to at/below threshold)
                    if (previousCount !== undefined && 
                        previousCount > threshold && 
                        currentCount <= threshold) {
                        
                        // Just crossed threshold - trigger first notification
                        this.potionRepeatCounts.set(potionName, 1);
                        this.potionUnderThreshold.set(potionName, true);
                        this.lastPotionNotificationTimes.set(potionName, Date.now());
                        
                        NotificationManager.notify(
                            'Potion Alert',
                            `${potionName}: ${countText.toLocaleString()} remaining`,
                            {
                                sound: config.sound,
                                desktop: config.desktop,
                                soundName: CONSTANTS.STRINGS.SOUND_POTIONS,
                                soundUrl: CONFIG.sounds.potions,
                                emoji: '🧪'
                            }
                        );
                    } 
                    // Check if we're still under threshold and need to repeat
                    else if (isCurrentlyUnder && wasUnderThreshold) {
                        const currentRepeatCount = this.potionRepeatCounts.get(potionName) || 0;
                        if (currentRepeatCount < repeatCount) {
                            const repeatInterval = config.repeatInterval !== undefined ? config.repeatInterval : 0; // Default to 0 (immediate) if not set
                            const now = Date.now();
                            const lastNotificationTime = this.lastPotionNotificationTimes.get(potionName);
                            const timeSinceLastNotification = lastNotificationTime 
                                ? (now - lastNotificationTime) / 1000 
                                : Infinity; // If no previous notification, allow it
                            
                            // Check if enough time has passed (or interval is 0 for immediate repeats)
                            if (repeatInterval === 0 || timeSinceLastNotification >= repeatInterval) {
                                // Still under threshold and haven't reached repeat limit
                                this.potionRepeatCounts.set(potionName, currentRepeatCount + 1);
                                this.lastPotionNotificationTimes.set(potionName, now);
                                
                                NotificationManager.notify(
                                    'Potion Alert',
                                    `${potionName}: ${countText.toLocaleString()} remaining`,
                                    {
                                        sound: config.sound,
                                        desktop: config.desktop,
                                        soundName: CONSTANTS.STRINGS.SOUND_POTIONS,
                                        soundUrl: CONFIG.sounds.potions,
                                        emoji: '🧪'
                                    }
                                );
                            }
                        }
                    }
                    // Check if we've gone back above threshold
                    else if (wasUnderThreshold && !isCurrentlyUnder) {
                        // Reset repeat counter and notification time when we go back above threshold
                        this.potionRepeatCounts.set(potionName, 0);
                        this.potionUnderThreshold.set(potionName, false);
                        this.lastPotionNotificationTimes.delete(potionName);
                    }
                    // Update state if we're currently under threshold
                    else if (isCurrentlyUnder) {
                        this.potionUnderThreshold.set(potionName, true);
                    }
                    
                    // Update tracking
                    this.lastPotionCounts.set(potionName, currentCount);
                }
                
                // Clean up tracking for potions that no longer exist
                const currentPotionNames = new Set();
                for (const flexDiv of allFlexDivs) {
                    const itemDiv = flexDiv.querySelector('.item.clickable');
                    if (!itemDiv) continue;
                    const potionNamePara = itemDiv.querySelector('p');
                    if (!potionNamePara) continue;
                    let potionName = (potionNamePara.textContent || '').trim();
                    potionName = potionName.replace(/^\[|\]$/g, '').trim();
                    if (potionName && potionName.toLowerCase().includes('potion')) {
                        currentPotionNames.add(potionName);
                    }
                }
                
                // Remove tracking for potions that are no longer active
                for (const [potionName] of this.lastPotionCounts) {
                    if (!currentPotionNames.has(potionName)) {
                        this.lastPotionCounts.delete(potionName);
                        this.potionRepeatCounts.delete(potionName);
                        this.potionUnderThreshold.delete(potionName);
                        this.lastPotionNotificationTimes.delete(potionName);
                    }
                }
            } catch (error) {
                // Clear cache on error
                this.cachedElements.effectsPanel = null;
            }
        },
        
        cleanup() {
            // Clear interval
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
                this.checkInterval = null;
            }
            
            // Disconnect observers
            if (this.autosObserver) {
                this.autosObserver.disconnect();
                this.autosObserver = null;
            }
            if (this.potionsObserver) {
                this.potionsObserver.disconnect();
                this.potionsObserver = null;
            }
            
            // Clear timeouts
            if (this.autosCheckTimeout) {
                clearTimeout(this.autosCheckTimeout);
                this.autosCheckTimeout = null;
            }
            if (this.potionsCheckTimeout) {
                clearTimeout(this.potionsCheckTimeout);
                this.potionsCheckTimeout = null;
            }
            
            // Clear retry timeouts
            if (this.autosSetupRetryTimeout) {
                clearTimeout(this.autosSetupRetryTimeout);
                this.autosSetupRetryTimeout = null;
            }
            if (this.potionsSetupRetryTimeout) {
                clearTimeout(this.potionsSetupRetryTimeout);
                this.potionsSetupRetryTimeout = null;
            }
            
            // Clear cached elements
            this.cachedElements = {
                autoElement: null,
                gameGrid: null,
                leftSidebar: null,
                logDiv: null,
                raidContainer: null,
                mainGameSection: null,
                effectsPanel: null
            };
        }
    };

    // ============================================
    // Image Modal Manager
    // ============================================
    const ImageModalManager = {
        modalOverlay: null,
        modal: null,
        image: null,
        videoFrame: null,
        initialized: false,
        escHandler: null,
        observer: null,
        processedNodes: new WeakSet(), // Track processed nodes to avoid reprocessing
        
        init() {
            const wasInitialized = this.initialized;
            
            // Check if images or YouTube features are enabled
            if (!CONFIG.features.images.enabled && !CONFIG.features.youtube.enabled) {
                return;
            }
            
            // If already initialized, just process existing messages
            if (wasInitialized) {
                this.processExistingMessages();
                return;
            }
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.startObserving());
            } else {
                this.startObserving();
            }
            
            this.initialized = true;
        },
        
        startObserving() {
            // Use MutationObserver with debouncing to avoid interfering with chat
            let timeout;
            this.observer = new MutationObserver((mutations) => {
                // Debounce processing to avoid interfering with rapid DOM changes
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // Element node
                                // Process new nodes for plain text image and video URLs
                                this.processNodeForImageUrls(node);
                            }
                        });
                    });
                }, 200); // Small delay to let chat finish its DOM manipulation
            });
            
            // Observe the chat container
            const chatContainer = document.querySelector('.chat-content');
            if (chatContainer) {
                this.observer.observe(chatContainer, {
                    childList: true,
                    subtree: true
                });
                
                // Process existing messages
                this.processNodeForImageUrls(chatContainer);
            } else {
                // Retry if chat container not found yet
                setTimeout(() => this.startObserving(), 1000);
            }
        },
        
        processExistingMessages() {
            const chatContainer = document.querySelector('.chat-content');
            if (chatContainer) {
                // Clear processed nodes to allow re-processing
                this.processedNodes = new WeakSet();
                
                // Process all existing messages
                this.processNodeForImageUrls(chatContainer);
            }
        },
        
        removeLinks() {
            // Remove all image and video links, converting them back to plain text
            const chatContainer = document.querySelector('.chat-content');
            if (!chatContainer) return;
            
            // Find all link spans
            const imageLinks = chatContainer.querySelectorAll('.iqrpg-image-link');
            const videoLinks = chatContainer.querySelectorAll('.iqrpg-video-link');
            
            // Convert image links back to plain text
            imageLinks.forEach(link => {
                const url = link.getAttribute('data-url') || link.textContent;
                const textNode = document.createTextNode(url);
                link.parentNode.replaceChild(textNode, link);
            });
            
            // Convert video links back to plain text
            videoLinks.forEach(link => {
                const url = link.getAttribute('data-url') || link.textContent;
                const textNode = document.createTextNode(url);
                link.parentNode.replaceChild(textNode, link);
            });
            
            // Clear processed nodes to allow re-processing if feature is re-enabled
            this.processedNodes = new WeakSet();
        },
        
        processNodeForImageUrls(node) {
            // Skip if already processed
            if (this.processedNodes.has(node)) return;
            
            // Skip if this is an input, form, or interactive element
            if (node.tagName === 'INPUT' || 
                node.tagName === 'TEXTAREA' || 
                node.tagName === 'FORM' ||
                node.tagName === 'BUTTON' ||
                node.isContentEditable ||
                node.contentEditable === 'true') {
                return;
            }
            
            // Skip if inside a form or input
            if (node.closest('form') || 
                node.closest('input') || 
                node.closest('textarea') ||
                node.closest('[contenteditable="true"]')) {
                return;
            }
            
            // Skip if this is the chat container itself (we want to process its children)
            if (node.classList && node.classList.contains('chat-content')) {
                // Process all child nodes instead
                if (node.children) {
                    Array.from(node.children).forEach(child => {
                        this.processNodeForImageUrls(child);
                    });
                }
                return;
            }
            
            // Process any node that has text content and is likely a message
            // Be more flexible - process any element with text that contains URLs
            if (node.textContent && node.nodeType === 1) {
                const text = node.textContent;
                const urlPattern = /(https?:\/\/[^\s<>"']+)/gi;
                const urlMatches = [...text.matchAll(urlPattern)];
                
                if (urlMatches && urlMatches.length > 0) {
                    // Clean URLs - remove trailing punctuation and whitespace
                    const urls = urlMatches.map(match => {
                        let url = match[0];
                        // Remove trailing punctuation and whitespace (but keep query params and fragments)
                        url = url.replace(/[.,;:!?)\]\}>\s-]+$/, '').trim();
                        return url;
                    });
                    const uniqueUrls = [...new Set(urls)];
                    
                    // Filter for image and video URLs
                    const imageUrls = uniqueUrls.filter(url => {
                        return CONFIG.features.images.enabled && this.isImageUrl(url);
                    });
                    const videoUrls = uniqueUrls.filter(url => {
                        return CONFIG.features.youtube.enabled && this.isVideoUrl(url);
                    });
                    
                    if (imageUrls.length > 0 || videoUrls.length > 0) {
                        // Mark node as processed
                        this.processedNodes.add(node);
                        
                        // Convert text URLs to clickable links
                        this.convertTextUrlsToClickable(node, imageUrls, videoUrls);
                    }
                }
            }
        },
        
        convertTextUrlsToClickable(node, imageUrls, videoUrls = []) {
            // Use TreeWalker to find and replace text nodes containing URLs
            const allMediaUrls = [...imageUrls, ...videoUrls];
            const walker = document.createTreeWalker(
                node,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (textNode) => {
                        // Only process text nodes that contain our image or video URLs
                        const text = textNode.textContent;
                        const hasMediaUrl = allMediaUrls.some(url => text.includes(url));
                        return hasMediaUrl ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                    }
                },
                false
            );
            
            const textNodesToReplace = [];
            let textNode;
            while (textNode = walker.nextNode()) {
                textNodesToReplace.push(textNode);
            }
            
            // Process text nodes in reverse order to maintain indices
            textNodesToReplace.reverse().forEach((textNode) => {
                const text = textNode.textContent;
                const urlPattern = /(https?:\/\/[^\s<>"']+)/gi;
                const parts = [];
                let lastIndex = 0;
                let match;
                
                // Split text by URLs
                while ((match = urlPattern.exec(text)) !== null) {
                    let url = match[0];
                    // Clean URL - remove trailing punctuation and whitespace
                    const cleanedUrl = url.replace(/[.,;:!?)\]\}>\s-]+$/, '').trim();
                    const index = match.index;
                    
                    // Add text before URL
                    if (index > lastIndex) {
                        const beforeText = text.substring(lastIndex, index);
                        if (beforeText) {
                            parts.push({ type: 'text', content: beforeText });
                        }
                    }
                    
                    // Add URL (check if cleaned URL is in our image/video arrays)
                    if (imageUrls.includes(cleanedUrl)) {
                        parts.push({ type: 'imageUrl', content: cleanedUrl });
                    } else if (videoUrls.includes(cleanedUrl)) {
                        parts.push({ type: 'videoUrl', content: cleanedUrl });
                    } else {
                        // Not a media URL, keep original as text
                        parts.push({ type: 'text', content: match[0] });
                    }
                    
                    lastIndex = index + match[0].length;
                }
                
                // Add remaining text
                if (lastIndex < text.length) {
                    const remainingText = text.substring(lastIndex);
                    if (remainingText) {
                        parts.push({ type: 'text', content: remainingText });
                    }
                }
                
                // If we found URLs to replace, create new elements
                if (parts.some(p => p.type === 'imageUrl' || p.type === 'videoUrl')) {
                    const fragment = document.createDocumentFragment();
                    
                    parts.forEach((part) => {
                        if (part.type === 'imageUrl' || part.type === 'videoUrl') {
                            // Create clickable span for image or video URL
                            const linkSpan = document.createElement('span');
                            linkSpan.textContent = part.content;
                            linkSpan.className = part.type === 'imageUrl' ? 'iqrpg-image-link' : 'iqrpg-video-link';
                            linkSpan.style.cssText = `
                                color: #4CAF50;
                                text-decoration: underline;
                                cursor: pointer;
                                user-select: text;
                            `;
                            linkSpan.setAttribute('data-url', part.content);
                            linkSpan.setAttribute('data-type', part.type === 'imageUrl' ? 'image' : 'video');
                            
                            // Add click handler
                            linkSpan.addEventListener('click', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                // Check if this is a direct image link (has file extension)
                                if (part.type === 'imageUrl' && this.isDirectImageUrl(part.content)) {
                                    // Direct image link - open in modal
                                    this.openModal(part.content, 'image');
                                } else if (part.type === 'imageUrl') {
                                    // Non-direct image link - open in new tab
                                    window.open(part.content, '_blank', 'noopener,noreferrer');
                                } else {
                                    // Video link - open in modal (existing behavior)
                                    this.openModal(part.content, 'video');
                                }
                            }, true);
                            
                            // Add hover effect
                            linkSpan.addEventListener('mouseenter', () => {
                                linkSpan.style.color = '#66BB6A';
                            });
                            linkSpan.addEventListener('mouseleave', () => {
                                linkSpan.style.color = '#4CAF50';
                            });
                            
                            fragment.appendChild(linkSpan);
                        } else {
                            // Add plain text
                            fragment.appendChild(document.createTextNode(part.content));
                        }
                    });
                    
                    // Replace the text node with the fragment
                    const parent = textNode.parentNode;
                    if (parent) {
                        parent.replaceChild(fragment, textNode);
                    }
                }
            });
        },
        
        isDirectImageUrl(url) {
            if (!url) return false;
            
            // Clean URL - remove trailing punctuation and whitespace
            const cleanUrl = url.replace(/[.,;:!?)\]\}>\s-]+$/, '').trim();
            
            // Check for common image file extensions
            const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i;
            return imageExtensions.test(cleanUrl);
        },
        
        isImageUrl(url) {
            if (!url) return false;
            
            // Clean URL - remove trailing punctuation and whitespace
            const cleanUrl = url.replace(/[.,;:!?)\]\}>\s-]+$/, '').trim();
            
            // Check for common image file extensions
            const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i;
            if (imageExtensions.test(cleanUrl)) return true;
            
            // Check for common image hosting services
            const imageHosts = [
                /imgur\.com/i,
                /giphy\.com/i,
                /tenor\.com/i,
                /gfycat\.com/i,
                /i\.redd\.it/i,
                /i\.imgur\.com/i,
                /media\.giphy\.com/i,
                /cdn\.discordapp\.com/i,
                /discord\.com\/attachments/i,
                /prnt\.sc/i,  // PrintScreen/ShareX screenshot hosting
                /prntscr\.com/i,  // Alternative PrintScreen domain
                /lightshot\.app/i  // Lightshot screenshot hosting
            ];
            
            return imageHosts.some(pattern => pattern.test(cleanUrl));
        },
        
        isVideoUrl(url) {
            if (!url) return false;
            
            // Clean URL - remove trailing punctuation and whitespace
            const cleanUrl = url.replace(/[.,;:!?)\]\}>\s-]+$/, '').trim();
            
            // Check for YouTube URL patterns (including Shorts)
            const youtubePatterns = [
                /youtube\.com\/watch\?v=([\w-]+)/i,
                /youtu\.be\/([\w-]+)/i,
                /youtube\.com\/embed\/([\w-]+)/i,
                /youtube\.com\/v\/([\w-]+)/i,
                /youtube\.com\/shorts\/([\w-]+)/i  // YouTube Shorts
            ];
            
            return youtubePatterns.some(pattern => pattern.test(cleanUrl));
        },
        
        getYouTubeEmbedUrl(url) {
            if (!url) return null;
            
            // Check if it's a Short
            const isShort = /youtube\.com\/shorts\/([\w-]+)/i.test(url);
            
            // Extract video ID from various YouTube URL formats
            let videoId = null;
            const patterns = [
                { regex: /youtube\.com\/watch\?v=([\w-]+)/i, index: 1 },
                { regex: /youtu\.be\/([\w-]+)/i, index: 1 },
                { regex: /youtube\.com\/embed\/([\w-]+)/i, index: 1 },
                { regex: /youtube\.com\/v\/([\w-]+)/i, index: 1 },
                { regex: /youtube\.com\/shorts\/([\w-]+)/i, index: 1 }  // Shorts pattern
            ];
            
            for (const { regex, index } of patterns) {
                const match = url.match(regex);
                if (match) {
                    videoId = match[index];
                    break;
                }
            }
            
            if (videoId) {
                return {
                    embedUrl: `https://www.youtube.com/embed/${videoId}`,
                    isShort: isShort || /youtube\.com\/shorts\//i.test(url)  // Double-check
                };
            }
            return null;
        },
        
        getDirectImageUrl(url) {
            if (!url) return url;
            
            // Clean URL first
            const cleanUrl = url.replace(/[.,;:!?)\]\}>\s-]+$/, '').trim();
            
            // For imgur gallery/album links, try to convert to direct image
            // https://imgur.com/gallery/[id] -> https://i.imgur.com/[id].jpg
            const imgurGalleryMatch = cleanUrl.match(/https?:\/\/(?:www\.)?imgur\.com\/(?:gallery\/|a\/)?([a-zA-Z0-9]+)/i);
            if (imgurGalleryMatch && !cleanUrl.includes('/i.imgur.com/')) {
                const id = imgurGalleryMatch[1];
                // Try .jpg first (most common), fallback handled by browser
                return `https://i.imgur.com/${id}.jpg`;
            }
            
            // Return original URL if no conversion needed
            // prnt.sc and tenor.com URLs need page extraction, so return as-is
            return cleanUrl;
        },
        
        async extractDirectImageUrlFromPage(pageUrl) {
            // Extract direct image URL from prnt.sc or tenor.com pages
            // Returns a promise that resolves to the direct URL or null
            return new Promise((resolve) => {
                // Create a hidden iframe to load the page
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.style.width = '0';
                iframe.style.height = '0';
                iframe.src = pageUrl;
                
                let resolved = false;
                const timeout = setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        if (iframe.parentNode) {
                            document.body.removeChild(iframe);
                        }
                        resolve(null);
                    }
                }, 3000); // 3 second timeout for faster fallback
                
                iframe.onload = () => {
                    try {
                        // Try to access iframe content (may fail due to same-origin policy)
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        
                        // For prnt.sc: Look for image.prntscr.com URL
                        if (/prnt\.sc|prntscr\.com/i.test(pageUrl)) {
                            // Look for the image element or meta tags
                            const img = iframeDoc.querySelector('img[src*="image.prntscr.com"]');
                            if (img && img.src) {
                                const directUrl = img.src;
                                if (!resolved) {
                                    resolved = true;
                                    clearTimeout(timeout);
                                    if (iframe.parentNode) {
                                        document.body.removeChild(iframe);
                                    }
                                    resolve(directUrl);
                                    return;
                                }
                            }
                            
                            // Try meta tags
                            const ogImage = iframeDoc.querySelector('meta[property="og:image"]');
                            if (ogImage && ogImage.content && ogImage.content.includes('image.prntscr.com')) {
                                if (!resolved) {
                                    resolved = true;
                                    clearTimeout(timeout);
                                    if (iframe.parentNode) {
                                        document.body.removeChild(iframe);
                                    }
                                    resolve(ogImage.content);
                                    return;
                                }
                            }
                            
                            // Try to find in page source - look for image.prntscr.com pattern
                            const pageHtml = iframeDoc.documentElement.outerHTML;
                            const imageUrlMatch = pageHtml.match(/https?:\/\/image\.prntscr\.com\/image\/[a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif)/i);
                            if (imageUrlMatch) {
                                if (!resolved) {
                                    resolved = true;
                                    clearTimeout(timeout);
                                    if (iframe.parentNode) {
                                        document.body.removeChild(iframe);
                                    }
                                    resolve(imageUrlMatch[0]);
                                    return;
                                }
                            }
                        }
                        
                        // For tenor.com: Look for media.tenor.com or media1.tenor.com URL
                        if (/tenor\.com\/view/i.test(pageUrl)) {
                            // Look for meta tags with og:image
                            const ogImage = iframeDoc.querySelector('meta[property="og:image"]');
                            if (ogImage && ogImage.content) {
                                const directUrl = ogImage.content;
                                if (directUrl.includes('media') && directUrl.includes('tenor.com')) {
                                    if (!resolved) {
                                        resolved = true;
                                        clearTimeout(timeout);
                                        if (iframe.parentNode) {
                                            document.body.removeChild(iframe);
                                        }
                                        resolve(directUrl);
                                        return;
                                    }
                                }
                            }
                            
                            // Try JSON-LD structured data
                            const jsonLd = iframeDoc.querySelector('script[type="application/ld+json"]');
                            if (jsonLd) {
                                try {
                                    const data = JSON.parse(jsonLd.textContent);
                                    if (data.contentUrl || (data.image && data.image.contentUrl)) {
                                        const directUrl = data.contentUrl || data.image.contentUrl;
                                        if (directUrl.includes('media') && directUrl.includes('tenor.com')) {
                                            if (!resolved) {
                                                resolved = true;
                                                clearTimeout(timeout);
                                                if (iframe.parentNode) {
                                                    document.body.removeChild(iframe);
                                                }
                                                resolve(directUrl);
                                                return;
                                            }
                                        }
                                    }
                                } catch (e) {
                                    // JSON parse error, continue
                                }
                            }
                            
                            // Try to find in page source - look for media.tenor.com or media1.tenor.com pattern
                            const pageHtml = iframeDoc.documentElement.outerHTML;
                            const mediaUrlMatch = pageHtml.match(/https?:\/\/media\d?\.tenor\.com\/[^"'\s<>]+\.(gif|webp|mp4)/i);
                            if (mediaUrlMatch) {
                                if (!resolved) {
                                    resolved = true;
                                    clearTimeout(timeout);
                                    if (iframe.parentNode) {
                                        document.body.removeChild(iframe);
                                    }
                                    resolve(mediaUrlMatch[0]);
                                    return;
                                }
                            }
                        }
                        
                        // If we get here, extraction failed
                        if (!resolved) {
                            resolved = true;
                            clearTimeout(timeout);
                            if (iframe.parentNode) {
                                document.body.removeChild(iframe);
                            }
                            resolve(null);
                        }
                    } catch (e) {
                        // Cross-origin error or other issue - this is expected for most cases
                        if (!resolved) {
                            resolved = true;
                            clearTimeout(timeout);
                            if (iframe.parentNode) {
                                document.body.removeChild(iframe);
                            }
                            resolve(null);
                        }
                    }
                };
                
                iframe.onerror = () => {
                    if (!resolved) {
                        resolved = true;
                        clearTimeout(timeout);
                        if (iframe.parentNode) {
                            document.body.removeChild(iframe);
                        }
                        resolve(null);
                    }
                };
                
                document.body.appendChild(iframe);
            });
        },
        
        openModal(url, type = 'image') {
            // Create overlay if it doesn't exist
            if (!this.modalOverlay) {
                this.createModal();
            }
            
            if (type === 'video') {
                // Handle video (YouTube)
                const videoInfo = this.getYouTubeEmbedUrl(url);
                if (videoInfo && this.videoFrame) {
                    this.videoFrame.src = videoInfo.embedUrl;
                    
                    // Set aspect ratio based on video type
                    if (videoInfo.isShort) {
                        // YouTube Shorts: 9:16 (portrait)
                        this.videoFrame.style.aspectRatio = '9 / 16';
                        this.videoFrame.style.width = 'min(85vw, 405px)';  // 85% viewport width, capped at 405px
                        this.videoFrame.style.maxWidth = '405px';
                        this.videoFrame.style.maxHeight = '720px';
                    } else {
                        // Regular YouTube videos: 16:9 (landscape)
                        this.videoFrame.style.aspectRatio = '16 / 9';
                        this.videoFrame.style.width = 'min(85vw, 1280px)';  // 85% viewport width, capped at 1280px
                        this.videoFrame.style.maxWidth = '1280px';
                        this.videoFrame.style.maxHeight = '720px';
                    }
                    
                    this.videoFrame.style.display = 'block';
                    if (this.image) this.image.style.display = 'none';
                }
            } else {
                // Handle image - convert to direct image URL if needed
                const isTenorViewUrl = /tenor\.com\/view\//i.test(url);
                const isPrntScUrl = /prnt\.sc\//i.test(url) || /prntscr\.com\//i.test(url);
                const isImgurGallery = /imgur\.com\/(?:gallery|a)\//i.test(url);
                
                if (this.image) {
                    if (isTenorViewUrl || isPrntScUrl) {
                        // For tenor.com/view and prnt.sc URLs, extract direct URL first
                        this.image.style.display = 'block';
                        this.image.alt = 'Loading...';
                        this.image.src = ''; // Clear previous image
                        
                        // Remove any existing error message first
                        const existingError = this.modal.querySelector('.iqrpg-image-error-message');
                        if (existingError) {
                            existingError.remove();
                        }
                        
                        this.extractDirectImageUrlFromPage(url).then((directUrl) => {
                            if (directUrl) {
                                this.image.src = directUrl;
                                this.image.alt = 'Image';
                                this.image.style.display = 'block';
                                if (this.videoFrame) this.videoFrame.style.display = 'none';
                                
                                // Remove any existing error message (in case it was shown from a previous attempt)
                                const existingError = this.modal.querySelector('.iqrpg-image-error-message');
                                if (existingError) {
                                    existingError.remove();
                                }
                            } else {
                                // Extraction failed - show user-friendly error message with link
                                // Don't try iframe as these sites block it with X-Frame-Options
                                this.image.style.display = 'none';
                                if (this.videoFrame) this.videoFrame.style.display = 'none';
                                
                                // Create and show error message with link
                                const errorMsg = document.createElement('div');
                                errorMsg.className = 'iqrpg-image-error-message';
                                errorMsg.style.cssText = `
                                    color: white;
                                    text-align: center;
                                    padding: 40px 20px;
                                    max-width: 500px;
                                    margin: 0 auto;
                                `;
                                
                                const errorText = document.createElement('p');
                                errorText.textContent = 'Unable to extract direct image URL. The image may be available on the source page.';
                                errorText.style.cssText = 'margin: 0 0 20px 0; font-size: 18px; line-height: 1.5;';
                                
                                const linkBtn = document.createElement('a');
                                linkBtn.href = url;
                                linkBtn.target = '_blank';
                                linkBtn.rel = 'noopener noreferrer';
                                linkBtn.textContent = 'Open in new tab';
                                linkBtn.style.cssText = `
                                    display: inline-block;
                                    padding: 12px 24px;
                                    background: rgb(34, 136, 34);
                                    color: white;
                                    text-decoration: none;
                                    border-radius: 6px;
                                    font-size: 16px;
                                    transition: background 0.2s ease;
                                    cursor: pointer;
                                `;
                                linkBtn.onmouseover = () => linkBtn.style.background = 'rgb(34, 102, 34)';
                                linkBtn.onmouseout = () => linkBtn.style.background = 'rgb(34, 136, 34)';
                                
                                errorMsg.appendChild(errorText);
                                errorMsg.appendChild(linkBtn);
                                
                                // Insert error message into modal
                                this.modal.appendChild(errorMsg);
                            }
                        });
                    } else {
                        // For other URLs, use direct conversion
                        let directImageUrl = this.getDirectImageUrl(url);
                        
                        // Set up error handler for URLs that might need extension fallback
                        let extensionAttempts = 0;
                        const errorHandler = () => {
                            if (extensionAttempts < 4 && this.image && isImgurGallery) {
                                const baseUrl = directImageUrl.replace(/\.(png|jpg|jpeg|gif|webp)$/i, '');
                                const extensions = ['.jpg', '.png', '.gif', '.webp'];
                                if (extensionAttempts < extensions.length) {
                                    this.image.src = baseUrl + extensions[extensionAttempts];
                                    extensionAttempts++;
                                }
                            }
                        };
                        
                        this.image.onerror = errorHandler;
                        this.image.src = directImageUrl;
                        this.image.alt = 'Image';
                        this.image.style.display = 'block';
                    }
                }
                if (this.videoFrame && !isTenorViewUrl && !isPrntScUrl) {
                    this.videoFrame.style.display = 'none';
                }
            }
            
            // Show modal
            if (this.modalOverlay) {
                this.modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        },
        
        createModal() {
            // Create overlay
            this.modalOverlay = document.createElement('div');
            this.modalOverlay.className = 'iqrpg-image-modal-overlay';
            this.modalOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                cursor: pointer;
                pointer-events: none;
            `;
            
            // Create modal container
            this.modal = document.createElement('div');
            this.modal.className = 'iqrpg-image-modal';
            this.modal.style.cssText = `
                position: relative;
                max-width: 90%;
                max-height: 90%;
                cursor: default;
                pointer-events: auto;
            `;
            
            // Create close button
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.className = 'iqrpg-image-modal-close';
            closeBtn.style.cssText = `
                position: absolute;
                top: -40px;
                right: 0;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                font-size: 32px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s ease;
                pointer-events: auto;
            `;
            closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
            closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
            
            // Create image element
            this.image = document.createElement('img');
            this.image.style.cssText = `
                max-width: 100%;
                max-height: 90vh;
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                display: block;
            `;
            
            // Create video iframe element
            this.videoFrame = document.createElement('iframe');
            this.videoFrame.style.cssText = `
                aspect-ratio: 16 / 9;  /* Default to regular video ratio */
                border: none;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                display: none;
            `;
            this.videoFrame.setAttribute('allowfullscreen', 'true');
            this.videoFrame.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            
            // Assemble modal
            this.modal.appendChild(closeBtn);
            this.modal.appendChild(this.image);
            this.modal.appendChild(this.videoFrame);
            this.modalOverlay.appendChild(this.modal);
            document.body.appendChild(this.modalOverlay);
            
            // Add CSS for active state
            if (!document.getElementById('iqrpg-image-modal-styles')) {
                const style = document.createElement('style');
                style.id = 'iqrpg-image-modal-styles';
                style.textContent = `
                    .iqrpg-image-modal-overlay.active {
                        opacity: 1 !important;
                        pointer-events: auto !important;
                    }
                    .iqrpg-image-link:hover,
                    .iqrpg-video-link:hover {
                        color: #66BB6A !important;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Event listeners
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeModal();
            });
            
            this.modalOverlay.addEventListener('click', (e) => {
                if (e.target === this.modalOverlay) {
                    this.closeModal();
                }
            });
            
            // ESC key to close
            this.escHandler = (e) => {
                if (e.key === 'Escape' && this.modalOverlay.classList.contains('active')) {
                    this.closeModal();
                }
            };
            document.addEventListener('keydown', this.escHandler);
        },
        
        closeModal() {
            if (this.modalOverlay) {
                this.modalOverlay.classList.remove('active');
                document.body.style.overflow = '';
                
                // Remove image source to free memory
                if (this.image) {
                    this.image.src = '';
                    this.image.style.display = 'block';
                }
                
                // Remove video iframe source to stop playback and free memory
                if (this.videoFrame) {
                    this.videoFrame.src = '';
                    this.videoFrame.style.display = 'none';
                }
                
                // Remove any error messages
                if (this.modal) {
                    const errorMsg = this.modal.querySelector('.iqrpg-image-error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            }
        },
        
        cleanup() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.escHandler) {
                document.removeEventListener('keydown', this.escHandler);
                this.escHandler = null;
            }
            if (this.modalOverlay) {
                this.modalOverlay.remove();
                this.modalOverlay = null;
                this.modal = null;
                this.image = null;
                this.videoFrame = null;
            }
            document.body.style.overflow = '';
        }
    };

    // ============================================
    // Market Data Tracker
    // ============================================
    const MarketDataTracker = {
        storageKey: 'iqrpg_market_data',
        
        // Parse market sale message to extract data
        parseSaleMessage(rawMsg) {
            // Example: "You have sold 3 [item:spider_egg] for 6,986,664 [item:gold]. You paid 349,334 [item:gold] tax."
            // Extract quantity, item name, gold value, and tax
            
            // Match pattern: "sold X [item:item_name] for Y [item:gold]. You paid Z [item:gold] tax."
            const salePattern = /sold\s+(\d+)\s+\[item:([^\]]+)\]\s+for\s+([\d,]+)\s+\[item:gold\]\.\s+You\s+paid\s+([\d,]+)\s+\[item:gold\]\s+tax/i;
            const match = rawMsg.match(salePattern);
            
            if (!match) return null;
            
            const quantity = parseInt(match[1].replace(/,/g, ''), 10);
            const itemKey = match[2];
            const goldValue = parseInt(match[3].replace(/,/g, ''), 10);
            const tax = parseInt(match[4].replace(/,/g, ''), 10);
            
            // Get proper item name using existing formatItemName function
            const itemName = CONSTANTS.ITEM_NAME_MAP[itemKey] || formatItemName(itemKey);
            
            return {
                itemName: itemName,
                itemKey: itemKey,
                quantity: quantity,
                goldValue: goldValue,
                tax: tax,
                netGold: goldValue - tax, // Net gold after tax
                timestamp: Date.now()
            };
        },
        
        // Record a sale
        recordSale(saleData) {
            if (!saleData) return;
            
            const data = this.loadData();
            
            // Initialize item entry if it doesn't exist
            if (!data.items[saleData.itemName]) {
                data.items[saleData.itemName] = {
                    quantity: 0,
                    totalGold: 0,
                    totalTax: 0,
                    totalNetGold: 0
                };
            }
            
            // Update stats (use net gold for totals)
            data.items[saleData.itemName].quantity += saleData.quantity;
            data.items[saleData.itemName].totalGold += saleData.goldValue; // Keep gross for reference
            data.items[saleData.itemName].totalTax += saleData.tax;
            data.items[saleData.itemName].totalNetGold += saleData.netGold; // Net after tax
            data.totalGold += saleData.netGold; // Total net gold earned
            data.totalTax += saleData.tax; // Total taxes paid
            
            // Save to localStorage
            this.saveData(data);
        },
        
        // Load data from localStorage
        loadData() {
            try {
                const stored = localStorage.getItem(this.storageKey);
                if (stored) {
                    const data = JSON.parse(stored);
                    // Migrate old data structure if needed
                    if (data.totalTax === undefined) {
                        data.totalTax = 0;
                        // Recalculate if we have items
                        if (data.items) {
                            Object.values(data.items).forEach(item => {
                                if (item.totalTax === undefined) {
                                    item.totalTax = 0;
                                    item.totalNetGold = item.totalGold || 0;
                                }
                            });
                        }
                    }
                    // Initialize receivedItems if it doesn't exist
                    if (data.receivedItems === undefined) {
                        data.receivedItems = {};
                    } else {
                        // Migrate old receivedItems structure to new one with transactions
                        Object.keys(data.receivedItems).forEach(itemName => {
                            const item = data.receivedItems[itemName];
                            if (item && !item.transactions) {
                                // Old structure: just { quantity: X }
                                // Convert to new structure with empty transactions array
                                data.receivedItems[itemName] = {
                                    quantity: item.quantity || 0,
                                    transactions: []
                                };
                            }
                        });
                    }
                    // Initialize gold tracking if it doesn't exist
                    if (data.totalGoldReceived === undefined) {
                        data.totalGoldReceived = 0;
                    }
                    if (data.totalTaxFromReceived === undefined) {
                        data.totalTaxFromReceived = 0;
                    }
                    // Initialize sentItems if it doesn't exist
                    if (data.sentItems === undefined) {
                        data.sentItems = {};
                    } else {
                        // Migrate old sentItems structure to new one with transactions
                        Object.keys(data.sentItems).forEach(itemName => {
                            const item = data.sentItems[itemName];
                            if (item && !item.transactions) {
                                // Old structure: just { quantity: X }
                                // Convert to new structure with empty transactions array
                                data.sentItems[itemName] = {
                                    quantity: item.quantity || 0,
                                    transactions: []
                                };
                            }
                        });
                    }
                    return data;
                }
            } catch (e) {
                // Silently fail
            }
            
            // Return default structure
            return {
                items: {},
                totalGold: 0,
                totalTax: 0,
                totalGoldReceived: 0,  // Gross gold received (no tax deduction)
                totalTaxFromReceived: 0,  // Taxes paid on received gold
                receivedItems: {},
                sentItems: {}
            };
        },
        
        // Save data to localStorage
        saveData(data) {
            if (!data || typeof data !== 'object') {
                console.warn('[IQRPG Enhanced] Invalid data structure in saveData()');
                return;
            }
            
            // Validate required structure
            const requiredFields = ['items', 'totalGold', 'totalTax', 'totalGoldReceived', 'totalTaxFromReceived', 'receivedItems', 'sentItems'];
            for (const field of requiredFields) {
                if (!(field in data)) {
                    console.warn(`[IQRPG Enhanced] Missing required field '${field}' in saveData()`);
                    return;
                }
            }
            
            // Validate numeric fields
            const numericFields = ['totalGold', 'totalTax', 'totalGoldReceived', 'totalTaxFromReceived'];
            for (const field of numericFields) {
                if (typeof data[field] !== 'number' || isNaN(data[field])) {
                    console.warn(`[IQRPG Enhanced] Invalid numeric value for '${field}' in saveData()`);
                    return;
                }
            }
            
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(data));
            } catch (e) {
                console.error('[IQRPG Enhanced] Failed to save market data:', e);
            }
        },
        
        // Get all stats
        getStats() {
            return this.loadData();
        },
        
        // Helper function to aggregate transactions by item + person
        aggregateTransactions(itemsData, personKey) {
            const aggregated = new Map();
            
            Object.entries(itemsData).forEach(([itemName, stats]) => {
                if (stats.transactions && stats.transactions.length > 0) {
                    stats.transactions.forEach(trans => {
                        const person = trans[personKey] || 'Unknown';
                        const key = `${itemName}|${person}`;
                        
                        if (aggregated.has(key)) {
                            // Sum the amounts
                            aggregated.get(key).amount += trans.quantity;
                        } else {
                            // Create new entry
                            aggregated.set(key, {
                                item: itemName,
                                amount: trans.quantity,
                                person: person
                            });
                        }
                    });
                }
            });
            
            return Array.from(aggregated.values());
        },
        
        // Clear all data
        clearData() {
            try {
                localStorage.removeItem(this.storageKey);
            } catch (e) {
                // Silently fail
            }
        },
        
        // Parse received item message to extract data
        parseReceivedItem(rawMsg) {
            // Example: "You received 5 [item:spider_egg]"
            // Or: "You have received 10 [item:gold] from playerName"
            // Or: "You received 5,000,000 [item:gold] from Blackknight. You paid 250,000 [item:gold] tax."
            
            // First check if this is a gold receipt with tax information
            const goldWithTaxPattern = /received\s+([\d,]+)\s+\[item:gold\]\s+from\s+([^\s.]+)\.\s+You\s+paid\s+([\d,]+)\s+\[item:gold\]\s+tax/i;
            const goldWithTaxMatch = rawMsg.match(goldWithTaxPattern);
            
            if (goldWithTaxMatch) {
                const goldAmount = parseInt(goldWithTaxMatch[1].replace(/,/g, ''), 10);
                const from = goldWithTaxMatch[2].trim();
                const tax = parseInt(goldWithTaxMatch[3].replace(/,/g, ''), 10);
                
                return {
                    itemName: 'Gold',
                    itemKey: 'gold',
                    quantity: goldAmount,
                    from: from,
                    goldValue: goldAmount,  // Gross gold received
                    tax: tax,
                    timestamp: Date.now()
                };
            }
            
            // Regular patterns for other items or gold without tax info
            const patterns = [
                /received\s+(\d+)\s+\[item:([^\]]+)\](?:\s+from\s+([^\s.]+))?/i,
                /have\s+received\s+(\d+)\s+\[item:([^\]]+)\](?:\s+from\s+([^\s.]+))?/i,
                /got\s+(\d+)\s+\[item:([^\]]+)\](?:\s+from\s+([^\s.]+))?/i
            ];
            
            for (const pattern of patterns) {
                const match = rawMsg.match(pattern);
                if (match) {
                    const quantity = parseInt(match[1].replace(/,/g, ''), 10);
                    const itemKey = match[2];
                    const from = match[3] ? match[3].trim() : 'Unknown';
                    
                    // Get proper item name using existing formatItemName function
                    const itemName = CONSTANTS.ITEM_NAME_MAP[itemKey] || formatItemName(itemKey);
                    
                    return {
                        itemName: itemName,
                        itemKey: itemKey,
                        quantity: quantity,
                        from: from,
                        timestamp: Date.now()
                    };
                }
            }
            
            return null;
        },
        
        // Record a received item
        recordReceivedItem(itemData) {
            if (!itemData) return;
            
            const data = this.loadData();
            
            // Initialize receivedItems if it doesn't exist
            if (!data.receivedItems) {
                data.receivedItems = {};
            }
            
            // Initialize item entry if it doesn't exist
            if (!data.receivedItems[itemData.itemName]) {
                data.receivedItems[itemData.itemName] = {
                    quantity: 0,
                    transactions: []  // Store individual transactions
                };
            }
            
            // Add transaction
            const transaction = {
                quantity: itemData.quantity,
                from: itemData.from || 'Unknown',  // Sender name
                timestamp: itemData.timestamp || Date.now()
            };
            
            // If this is gold with tax info, include gold value and tax in transaction
            if (itemData.itemKey === 'gold' && itemData.goldValue !== undefined) {
                transaction.goldValue = itemData.goldValue;
                transaction.tax = itemData.tax || 0;
            }
            
            data.receivedItems[itemData.itemName].transactions.push(transaction);
            
            // Update total quantity
            data.receivedItems[itemData.itemName].quantity += itemData.quantity;
            
            // If this is gold with tax info, track gold totals and tax
            if (itemData.itemKey === 'gold' && itemData.goldValue !== undefined) {
                // Initialize gold tracking if it doesn't exist
                if (data.totalGoldReceived === undefined) {
                    data.totalGoldReceived = 0;
                }
                if (data.totalTaxFromReceived === undefined) {
                    data.totalTaxFromReceived = 0;
                }
                
                // Track gross gold received (no tax deduction)
                data.totalGoldReceived += itemData.goldValue;
                // Track tax paid on received gold
                data.totalTaxFromReceived += (itemData.tax || 0);
            }
            
            // Save to localStorage
            this.saveData(data);
        },
        
        // Get sorted received items by quantity (descending)
        getSortedReceivedItems() {
            const data = this.loadData();
            if (!data.receivedItems) return [];
            
            const items = Object.entries(data.receivedItems).map(([name, stats]) => ({
                name,
                quantity: stats.quantity,
                transactions: stats.transactions || []  // Include transactions
            }));
            
            return items.sort((a, b) => b.quantity - a.quantity);
        },
        
        // Parse sent item from DOM notification element
        parseSentItemFromDOM(notificationElement) {
            // Parse notification HTML structure
            // Example: "You sent 5000000 [Gold] to krm."
            
            const contentDiv = notificationElement.querySelector('.notification__content');
            if (!contentDiv) return null;
            
            const text = contentDiv.textContent || '';
            
            // Check if this is a "sent" notification
            if (!text.toLowerCase().includes('you sent')) return null;
            
            // Extract quantity - pattern: "You sent 5000000"
            const quantityMatch = text.match(/you\s+sent\s+([\d,]+)/i);
            if (!quantityMatch) return null;
            
            const quantity = parseInt(quantityMatch[1].replace(/,/g, ''), 10);
            
            // Extract item name from the <p> tag inside .item.clickable
            // The item is in: <div class="item clickable"><p class="gold-text">[Gold]</p>
            const itemPara = notificationElement.querySelector('.item.clickable p');
            let itemName = null;
            
            if (itemPara) {
                // Get text like "[Gold]" and extract "Gold"
                const itemText = itemPara.textContent || '';
                const bracketMatch = itemText.match(/\[([^\]]+)\]/);
                if (bracketMatch) {
                    itemName = bracketMatch[1].trim();
                }
            }
            
            // Fallback: try to extract from the full text if itemPara not found
            if (!itemName) {
                const bracketMatch = text.match(/\[([^\]]+)\]/);
                if (bracketMatch) {
                    itemName = bracketMatch[1].trim();
                }
            }
            
            if (!itemName) return null;
            
            // Format item name using existing formatItemName function for consistency
            const formattedItemName = CONSTANTS.ITEM_NAME_MAP[itemName.toLowerCase()] || formatItemName(itemName);
            
            // Extract recipient - pattern: "to krm."
            const recipientMatch = text.match(/to\s+([^.]+)\.?/i);
            const recipient = recipientMatch ? recipientMatch[1].trim() : 'Unknown';
            
            return {
                itemName: formattedItemName,
                quantity: quantity,
                recipient: recipient,
                timestamp: Date.now()
            };
        },
        
        // Record a sent item
        recordSentItem(itemData) {
            if (!itemData) return;
            
            const data = this.loadData();
            
            // Initialize sentItems if it doesn't exist
            if (!data.sentItems) {
                data.sentItems = {};
            }
            
            // Initialize item entry if it doesn't exist
            if (!data.sentItems[itemData.itemName]) {
                data.sentItems[itemData.itemName] = {
                    quantity: 0,
                    transactions: []  // Store individual transactions
                };
            }
            
            // Add transaction
            data.sentItems[itemData.itemName].transactions.push({
                quantity: itemData.quantity,
                to: itemData.recipient || 'Unknown',  // Recipient name
                timestamp: itemData.timestamp || Date.now()
            });
            
            // Update total quantity
            data.sentItems[itemData.itemName].quantity += itemData.quantity;
            
            // Save to localStorage
            this.saveData(data);
        },
        
        // Get sorted sent items by quantity (descending)
        getSortedSentItems() {
            const data = this.loadData();
            if (!data.sentItems) return [];
            
            const items = Object.entries(data.sentItems).map(([name, stats]) => ({
                name,
                quantity: stats.quantity,
                transactions: stats.transactions || []  // Include transactions
            }));
            
            return items.sort((a, b) => b.quantity - a.quantity);
        },
        
        // Flatten received items into rows for table display
        getReceivedItemsRows(data = null) {
            const itemsData = data || this.loadData();
            if (!itemsData.receivedItems) return [];
            
            return this.aggregateTransactions(itemsData.receivedItems, 'from');
        },
        
        // Flatten sent items into rows for table display
        getSentItemsRows(data = null) {
            const itemsData = data || this.loadData();
            if (!itemsData.sentItems) return [];
            
            return this.aggregateTransactions(itemsData.sentItems, 'to');
        },
        
        // Calculate total gold sent (optimized to only process Gold transactions)
        getTotalGoldSent(data = null) {
            const itemsData = data || this.loadData();
            if (!itemsData.sentItems || !itemsData.sentItems.Gold) return 0;
            
            const goldStats = itemsData.sentItems.Gold;
            if (!goldStats.transactions || goldStats.transactions.length === 0) return 0;
            
            return goldStats.transactions.reduce((total, trans) => total + trans.quantity, 0);
        },
        
        // Get market sales as rows for table display
        getMarketSalesRows(data = null) {
            const itemsData = data || this.loadData();
            if (!itemsData.items) return [];
            
            const rows = [];
            Object.entries(itemsData.items).forEach(([itemName, stats]) => {
                rows.push({
                    item: itemName,
                    quantity: stats.quantity || 0,
                    gold: stats.totalNetGold || 0,  // Net gold after tax
                    tax: stats.totalTax || 0
                });
            });
            
            return rows;
        }
    };

    // ============================================
    // Item Sent Observer
    // ============================================
    const ItemSentObserver = {
        observer: null,
        processedNotifications: new WeakSet(),
        initialized: false,
        
        init() {
            // Prevent multiple initializations
            if (this.initialized) return;
            
            // Check if item sent notifications are enabled
            if (!CONFIG.notifications.itemSent.sound && !CONFIG.notifications.itemSent.desktop) {
                return;
            }
            
            this.initialized = true;
            this.startObserving();
        },
        
        startObserving() {
            // Disconnect existing observer if any
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            
            // Use MutationObserver to watch for notification divs
            this.observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.classList && node.classList.contains('notification')) {
                            // Check if this is a sent item notification
                            this.processNotification(node);
                        }
                    });
                });
            });
            
            // Observe document body for notification divs (they appear outside .game)
            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },
        
        processNotification(notificationElement) {
            // Skip if already processed
            if (this.processedNotifications.has(notificationElement)) return;
            
            // Check if this is a "sent" notification
            const contentDiv = notificationElement.querySelector('.notification__content');
            if (!contentDiv) return;
            
            const text = (contentDiv.textContent || '').toLowerCase();
            if (!text.includes('you sent')) return;
            
            // Mark as processed
            this.processedNotifications.add(notificationElement);
            
            // Parse and track the sent item
            const itemData = MarketDataTracker.parseSentItemFromDOM(notificationElement);
            if (itemData) {
                MarketDataTracker.recordSentItem(itemData);
                
                const config = CONFIG.notifications.itemSent;
                if (config.sound || config.desktop) {
                    // Get clean message for notification
                    const cleanText = contentDiv.textContent || '';
                    const cleanMsg = cleanGameMessage(cleanText);
                    
                    // Check if this is Gold
                    const isGold = itemData.itemName === 'Gold';
                    const title = isGold ? 'Gold Sent' : 'Item Sent';
                    const emoji = isGold ? '🪙' : '📤';
                    const soundName = isGold ? CONSTANTS.STRINGS.SOUND_GOLD_SENT : CONSTANTS.STRINGS.SOUND_ITEM_SENT;
                    const soundUrl = isGold ? CONFIG.sounds.goldSent : CONFIG.sounds.itemSent;

                    NotificationManager.notify(
                        title,
                        cleanMsg,
                        {
                            sound: config.sound,
                            desktop: config.desktop,
                            soundName: soundName,
                            soundUrl: soundUrl,
                            emoji: emoji
                        }
                    );
                }
            }
        },
        
        cleanup() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            this.processedNotifications = new WeakSet();
            this.initialized = false;
        }
    };

    // ============================================
    // GUI Manager - Settings Button & Modal
    // ============================================
    const GUIManager = {
        initialized: false,
        receivedTableSort: null,  // { column: 'item', direction: 'asc' }
        sentTableSort: null,      // { column: 'item', direction: 'asc' }
        salesTableSort: null,     // { column: 'item', direction: 'asc' }
        
        // Section name mapping for navigation
        sectionNames: {
            volume: 'Volume',
            autos: 'Autos',
            globalEvents: 'Globals',
            bossSpawn: 'Bosses',
            gatheringEvents: 'Gathering',
            actionBonus: 'Action Bonus',
            clan: 'Clan',
            dungeon: 'Dungeon',
            land: 'Raid',
            mastery: 'Mastery',
            skills: 'Skills',
            marketSale: 'Market',
            tradeAlert: 'Trade',
            itemDrop: 'Log',
            message: 'Message',
            abyssBattles: 'Abyss',
            potions: 'Potions',
            images: 'Img',
            youtube: 'YouTube',
            emojis: 'Emojis'
        },
        settingsButton: null,
        modal: null,
        modalOverlay: null,
        escKeyHandler: null,

        init() {
            if (this.initialized || !CONFIG.gui.enabled) return;
            this.initialized = true;

            // Wait for DOM to be ready
            const initGUI = () => {
                this.injectStyles();
                // Delay button creation slightly to ensure header content is loaded
                setTimeout(() => {
                    this.createSettingsButton();
                }, CONSTANTS.DELAYS.BUTTON_CREATION);
                this.createModal();
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initGUI);
            } else {
                initGUI();
            }
        },

        injectStyles() {
            if (document.getElementById('iqrpg-enhanced-styles')) return;

            const style = document.createElement('style');
            style.id = 'iqrpg-enhanced-styles';
            style.textContent = `
                /* Settings Button */
                .iqrpg-settings-btn {
                    width: 32px;
                    height: 32px;
                    background: transparent;
                    border: none;
                    border-radius: 0px;
                    cursor: pointer;
                    box-shadow: none;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    font-size: 16px;
                    color: rgb(10, 10, 10);
                    padding: 0;
                    margin-right: 8px;
                    vertical-align: middle;
                }
                .iqrpg-settings-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                }
                .iqrpg-settings-btn:active {
                    transform: scale(0.98);
                }

                /* Modal Overlay */
                .iqrpg-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 2000;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(2px);
                }
                .iqrpg-modal-overlay.active {
                    display: flex;
                }

                /* Modal */
                .iqrpg-modal {
                    background: rgb(10, 10, 10);
                    border-radius: 0px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    width: 90%;
                    max-width: 600px;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    z-index: 2001;
                    position: relative;
                    border: 1px solid rgb(51, 51, 51);
                }
                /* Modal Header */
                .iqrpg-modal-header {
                    padding: 20px;
                    border-bottom: 2px solid rgb(51, 51, 51);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: linear-gradient(135deg, rgb(34, 102, 34) 0%, rgb(34, 136, 34) 100%);
                    border-radius: 0px;
                    flex-shrink: 0;
                }
                .iqrpg-modal-title {
                    margin: 0;
                    color: white;
                    font-size: 24px;
                    font-weight: bold;
                    font-family: Verdana, Arial, sans-serif;
                }
                .iqrpg-modal-close {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .iqrpg-modal-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg);
                }

                /* Modal Navigation Bar */
                .iqrpg-modal-nav {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    background: rgba(0, 0, 0, 0);
                    border-bottom: 2px solid rgb(68, 68, 68);
                    padding: 6px 8px;
                    min-height: 60px;
                    flex-shrink: 0;
                }
                .iqrpg-nav-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 3px;
                    align-items: center;
                    justify-content: center;
                }
                .iqrpg-nav-btn {
                    padding: 3px 6px;
                    background: rgb(10, 10, 10);
                    border: 1px solid rgb(102, 102, 102);
                    border-radius: 0px;
                    color: rgb(204, 204, 204);
                    cursor: pointer;
                    font-size: 11px;
                    font-weight: 400;
                    font-family: Verdana, Arial, sans-serif;
                    transition: all 0.2s;
                    white-space: nowrap;
                    flex: 0 0 auto;
                    min-height: 26px;
                    display: inline-block;
                }
                .iqrpg-nav-btn:hover {
                    background: rgb(51, 51, 51);
                    border-color: rgb(34, 136, 34);
                    color: rgb(34, 136, 34);
                }
                .iqrpg-nav-btn:active {
                    transform: scale(0.95);
                }

                /* Modal Body */
                .iqrpg-modal-body {
                    overflow-y: auto;
                    flex: 1;
                    min-height: 0;
                    padding: 20px;
                    padding-bottom: 80px; /* Space for sticky footer */
                }
                
                /* Modal Footer */
                .iqrpg-modal-footer {
                    position: sticky;
                    bottom: 0;
                    z-index: 10;
                    background: rgba(0, 0, 0, 0);
                    border-top: 2px solid rgb(51, 51, 51);
                    padding: 15px 20px;
                    border-radius: 0px;
                }

                /* Section */
                .iqrpg-section {
                    margin-bottom: 2px;
                    padding: 0px;
                    background: rgb(10, 10, 10);
                    border-radius: 0px;
                    border: 1px solid rgb(51, 51, 51);
                }
                .iqrpg-section-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                    padding: 20px 20px 0 20px;
                }
                .iqrpg-section-title {
                    margin: 0;
                    color: rgb(204, 204, 204);
                    font-size: 18px;
                    font-weight: 400;
                    font-family: Verdana, Arial, sans-serif;
                }
                .iqrpg-section-content {
                    overflow: hidden;
                    padding: 0 20px 20px 20px;
                }

                /* Toggle Switch */
                .iqrpg-toggle-group {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    padding: 10px;
                    background: rgb(10, 10, 10);
                    border-radius: 0px;
                    border: 1px solid rgb(51, 51, 51);
                }
                .iqrpg-toggle-label {
                    color: rgb(204, 204, 204);
                    font-size: 14px;
                    font-family: Verdana, Arial, sans-serif;
                    flex: 1;
                    margin: 0px 15px 0px 0px;
                }
                .iqrpg-toggle-switch {
                    position: relative;
                    width: 50px;
                    height: 26px;
                    background: rgb(102, 102, 102);
                    border-radius: 13px;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                .iqrpg-toggle-switch.active {
                    background: rgb(34, 136, 34);
                }
                .iqrpg-toggle-switch::after {
                    content: '';
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    top: 3px;
                    left: 3px;
                    transition: left 0.3s;
                }
                .iqrpg-toggle-switch.active::after {
                    left: 27px;
                }

                /* Input Group */
                .iqrpg-input-group {
                    margin-bottom: 15px;
                }
                .iqrpg-input-label {
                    display: block;
                    color: rgb(204, 204, 204);
                    font-size: 14px;
                    font-family: Verdana, Arial, sans-serif;
                    margin: 0px 15px 5px 0px;
                }
                .iqrpg-input {
                    width: 100%;
                    padding: 10px;
                    background: rgb(20, 20, 20);
                    border: 1px solid rgb(51, 51, 51);
                    border-radius: 0px;
                    color: rgb(255, 255, 255);
                    font-size: 14px;
                    font-weight: 400;
                    font-family: Arial;
                    box-sizing: border-box;
                }
                .iqrpg-input:focus {
                    outline: none;
                    border-color: rgb(34, 136, 34);
                }

                /* Volume Slider */
                .iqrpg-volume-group {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    padding: 10px;
                    background: rgb(10, 10, 10);
                    border-radius: 0px;
                    border: 1px solid rgb(51, 51, 51);
                }
                .iqrpg-volume-label {
                    color: rgb(204, 204, 204);
                    font-size: 14px;
                    font-family: Verdana, Arial, sans-serif;
                    flex: 1;
                    margin-right: 15px;
                }
                .iqrpg-volume-slider {
                    flex: 2;
                    height: 6px;
                    background: rgb(51, 51, 51);
                    border-radius: 3px;
                    outline: none;
                    -webkit-appearance: none;
                    appearance: none;
                    margin: 0;
                    padding: 0;
                }
                .iqrpg-volume-slider::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 6px;
                    background: linear-gradient(to right, rgb(34, 136, 34) 0%, rgb(34, 136, 34) var(--volume-percent, 0%), rgb(51, 51, 51) var(--volume-percent, 0%), rgb(51, 51, 51) 100%);
                    border-radius: 3px;
                }
                .iqrpg-volume-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    background: rgb(34, 136, 34);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: background 0.2s;
                    margin-top: -6px;
                    position: relative;
                    z-index: 1;
                }
                .iqrpg-volume-slider::-webkit-slider-thumb:hover {
                    background: rgb(34, 102, 34);
                }
                .iqrpg-volume-slider::-moz-range-track {
                    width: 100%;
                    height: 6px;
                    background: rgb(51, 51, 51);
                    border-radius: 3px;
                    border: none;
                }
                .iqrpg-volume-slider::-moz-range-progress {
                    background: rgb(34, 136, 34);
                    height: 6px;
                    border-radius: 3px 0 0 3px;
                }
                .iqrpg-volume-slider::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    background: rgb(34, 136, 34);
                    border-radius: 50%;
                    cursor: pointer;
                    border: none;
                    transition: background 0.2s;
                }
                .iqrpg-volume-slider::-moz-range-thumb:hover {
                    background: rgb(34, 102, 34);
                }
                .iqrpg-volume-value {
                    color: rgb(34, 136, 34);
                    font-size: 14px;
                    font-weight: bold;
                    font-family: Verdana, Arial, sans-serif;
                    min-width: 45px;
                    text-align: right;
                    margin-left: 15px;
                }

                /* Buttons */
                .iqrpg-button-group {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }
                .iqrpg-button {
                    flex: 1;
                    padding: 3px 6px;
                    border: 1px solid rgb(51, 51, 51);
                    border-radius: 0px;
                    cursor: pointer;
                    font-size: 13.33px;
                    font-weight: 400;
                    font-family: Arial;
                    transition: all 0.3s;
                }
                .iqrpg-button-primary {
                    background: linear-gradient(135deg, rgb(34, 102, 34) 0%, rgb(34, 136, 34) 100%);
                    color: white;
                }
                .iqrpg-button-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(34, 136, 34, 0.4);
                }
                .iqrpg-button-secondary {
                    background: rgb(20, 20, 20);
                    color: rgb(204, 204, 204);
                }
                .iqrpg-button-secondary:hover {
                    background: rgb(51, 51, 51);
                }

                /* Market Data Side Panel */
                .iqrpg-market-data-panel {
                    position: fixed;
                    top: 0;
                    right: -400px;
                    width: 400px;
                    height: 100vh;
                    background: rgb(10, 10, 10);
                    border-left: 2px solid rgb(51, 51, 51);
                    z-index: 2002;
                    transition: right 0.3s ease;
                    overflow-y: auto;
                    box-shadow: -5px 0 20px rgba(0, 0, 0, 0.5);
                }
                .iqrpg-market-data-panel.active {
                    right: 0;
                }
                .iqrpg-market-data-panel-header {
                    padding: 20px;
                    border-bottom: 2px solid rgb(51, 51, 51);
                    background: linear-gradient(135deg, rgb(34, 102, 34) 0%, rgb(34, 136, 34) 100%);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                .iqrpg-market-data-panel-title {
                    margin: 0;
                    color: white;
                    font-size: 20px;
                    font-weight: bold;
                    font-family: Verdana, Arial, sans-serif;
                }
                .iqrpg-market-data-panel-close {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .iqrpg-market-data-panel-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                .iqrpg-market-data-content {
                    padding: 20px;
                }
                .iqrpg-market-data-summary-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .iqrpg-market-data-summary {
                    margin-bottom: 0;
                    padding: 15px;
                    background: rgb(30, 30, 30);
                    border: 1px solid rgb(51, 51, 51);
                    border-radius: 0px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    min-height: 80px;
                }
                .iqrpg-market-data-summary-title {
                    color: rgb(204, 204, 204);
                    font-size: 12px;
                    font-weight: bold;
                    font-family: Verdana, Arial, sans-serif;
                    margin-bottom: 10px;
                    margin-top: 0;
                    line-height: 1.4;
                }
                .iqrpg-market-data-summary-value {
                    color: rgb(34, 136, 34);
                    font-size: 11px;
                    font-weight: bold;
                    font-family: Verdana, Arial, sans-serif;
                    margin: 0;
                    line-height: 1.2;
                    text-align: left;
                }
                .iqrpg-market-data-items {
                    margin-top: 20px;
                }
                .iqrpg-market-data-item {
                    padding: 12px;
                    margin-bottom: 8px;
                    background: rgb(30, 30, 30);
                    border: 1px solid rgb(51, 51, 51);
                    border-radius: 0px;
                }
                .iqrpg-market-data-item-name {
                    color: rgb(204, 204, 204);
                    font-size: 14px;
                    font-weight: bold;
                    font-family: Verdana, Arial, sans-serif;
                    margin-bottom: 8px;
                }
                .iqrpg-market-data-item-stats {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    font-family: Verdana, Arial, sans-serif;
                    color: rgb(136, 136, 136);
                }
                .iqrpg-market-data-item-gold {
                    color: rgb(34, 136, 34);
                    font-weight: bold;
                }
                
                /* Market Data Table Styles */
                .iqrpg-market-data-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 0;
                    font-family: Verdana, Arial, sans-serif;
                    font-size: 12px;
                }
                .iqrpg-market-data-table th {
                    background: rgb(20, 20, 20);
                    color: rgb(204, 204, 204);
                    padding: 10px;
                    text-align: left;
                    border: 1px solid rgb(51, 51, 51);
                    cursor: pointer;
                    user-select: none;
                    position: sticky;
                    top: 0;
                    z-index: 5;
                }
                .iqrpg-market-data-table th:hover {
                    background: rgb(30, 30, 30);
                }
                .iqrpg-market-data-table th.sort-asc::after {
                    content: ' ▲';
                    font-size: 10px;
                    color: rgb(34, 136, 34);
                }
                .iqrpg-market-data-table th.sort-desc::after {
                    content: ' ▼';
                    font-size: 10px;
                    color: rgb(34, 136, 34);
                }
                .iqrpg-market-data-table td {
                    padding: 8px 10px;
                    border: 1px solid rgb(51, 51, 51);
                    color: rgb(204, 204, 204);
                }
                .iqrpg-market-data-table tbody tr:nth-child(even) {
                    background: rgb(15, 15, 15);
                }
                .iqrpg-market-data-table tbody tr:hover {
                    background: rgb(25, 25, 25);
                }
                .iqrpg-market-data-table-container {
                    max-height: 400px;
                    overflow-y: auto;
                    border: 1px solid rgb(51, 51, 51);
                    margin-top: 0;
                }
                .iqrpg-market-data-filter {
                    width: 100%;
                    padding: 8px;
                    background: rgb(20, 20, 20);
                    border: 1px solid rgb(51, 51, 51);
                    border-radius: 0px;
                    color: rgb(255, 255, 255);
                    font-size: 12px;
                    font-family: Verdana, Arial, sans-serif;
                    margin-bottom: 10px;
                    box-sizing: border-box;
                }
                .iqrpg-market-data-filter:focus {
                    outline: none;
                    border-color: rgb(34, 136, 34);
                }
            `;
            document.head.appendChild(style);
        },

        findButtonContainer() {
            // Find .fixed-top first (this is the actual header bar)
            const fixedTop = document.querySelector(CONSTANTS.SELECTORS.FIXED_TOP);
            
            if (!fixedTop) {
                // DOM not ready yet - return null to trigger retry
                return null;
            }

            // Find .section-3 inside .fixed-top (this is where Premium Store is)
            const section3 = fixedTop.querySelector(CONSTANTS.SELECTORS.SECTION_3);
            
            if (!section3) {
                // section-3 not ready yet - return null to trigger retry
                return null;
            }

            // Find the "Premium Store" element - it's in a <p> with an <a> tag
            // We want to insert before the <p> element that contains "Premium Store"
            let premiumStore = null;
            
            // First, try to find the <p> element containing "Premium Store"
            const paragraphs = section3.querySelectorAll('p');
            for (const p of paragraphs) {
                const text = (p.textContent || p.innerText || '').trim().toLowerCase();
                if (text.includes(CONSTANTS.STRINGS.PREMIUM_STORE)) {
                    premiumStore = p;
                    break;
                }
            }
            
            // If not found in <p>, try <a> tags and get their parent <p>
            if (!premiumStore) {
                const links = section3.querySelectorAll('a');
                for (const a of links) {
                    const text = (a.textContent || a.innerText || '').trim().toLowerCase();
                    if (text.includes(CONSTANTS.STRINGS.PREMIUM_STORE)) {
                        // Find the parent <p> element
                        let parent = a.parentElement;
                        while (parent && parent !== section3 && parent.tagName !== 'P') {
                            parent = parent.parentElement;
                        }
                        if (parent && parent.tagName === 'P') {
                            premiumStore = parent;
                        } else {
                            premiumStore = a;
                        }
                        break;
                    }
                }
            }
            
            // If Premium Store not found yet, return null to trigger retry
            if (!premiumStore) {
                return null;
            }

            return { 
                premiumStore: premiumStore, 
                insertParent: section3 
            };
        },

        createSettingsButton() {
            if (this.settingsButton) return;

            const button = document.createElement('button');
            button.className = 'iqrpg-settings-btn';
            button.innerHTML = '⚙️';
            button.title = 'IQRPG Enhanced Settings';
            button.setAttribute('aria-label', 'Open IQRPG Enhanced Settings');

            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openModal();
            });

            // Try to create button with retry logic (DOM might not be fully loaded)
            let retryCount = 0;
            const maxRetries = 10;
            
            const tryCreateButton = () => {
                // Skip if already successfully placed
                if (this.settingsButton) return true;
                
                const container = this.findButtonContainer();
                
                // Container not ready yet - retry
                if (!container) {
                    retryCount++;
                    if (retryCount < maxRetries) {
                        setTimeout(tryCreateButton, CONSTANTS.DELAYS.RETRY_SHORT);
                    }
                    return false;
                }
                
                try {
                    // Insert before Premium Store element in section-3
                    container.insertParent.insertBefore(button, container.premiumStore);
                    this.settingsButton = button;
                    return true;
                } catch (e) {
                    retryCount++;
                    if (retryCount < maxRetries) {
                        setTimeout(tryCreateButton, CONSTANTS.DELAYS.RETRY_SHORT);
                    }
                    return false;
                }
            };

            tryCreateButton();
        },

        createModal() {
            if (this.modal) return;

            // Overlay
            const overlay = document.createElement('div');
            overlay.className = 'iqrpg-modal-overlay';
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeModal();
                }
            });

            // Modal
            const modal = document.createElement('div');
            modal.className = 'iqrpg-modal';

            // Header
            const header = document.createElement('div');
            header.className = 'iqrpg-modal-header';
            header.innerHTML = `
                <h2 class="iqrpg-modal-title">IQRPG Enhanced Settings</h2>
                <button class="iqrpg-modal-close" aria-label="Close">×</button>
            `;
            const closeBtn = header.querySelector('.iqrpg-modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal());
            }

            // Navigation Bar
            const navBar = document.createElement('div');
            navBar.className = 'iqrpg-modal-nav';
            navBar.innerHTML = `
                <div class="iqrpg-nav-buttons">
                    ${Object.entries(this.sectionNames).map(([type, name]) => 
                        `<button class="iqrpg-nav-btn" data-section="${type}" title="${name}">${name}</button>`
                    ).join('')}
                </div>
            `;

            // Add ESC key listener once in createModal
            this.escKeyHandler = (e) => {
                if (e.key === 'Escape' && this.modalOverlay && this.modalOverlay.classList.contains('active')) {
                    this.closeModal();
                }
            };
            document.addEventListener('keydown', this.escKeyHandler);

            // Body
            const body = document.createElement('div');
            body.className = 'iqrpg-modal-body';
            body.innerHTML = this.generateSettingsHTML();

            // Footer (sticky action buttons)
            const footer = document.createElement('div');
            footer.className = 'iqrpg-modal-footer';
            footer.innerHTML = `
                <div class="iqrpg-button-group">
                    <button class="iqrpg-button iqrpg-button-primary" id="iqrpg-save-btn">Save Settings</button>
                    <button class="iqrpg-button iqrpg-button-secondary" id="iqrpg-reset-btn">Reset to Defaults</button>
                    <button class="iqrpg-button iqrpg-button-secondary" id="iqrpg-toggle-sound-btn">Toggle All Sound Alerts</button>
                    <button class="iqrpg-button iqrpg-button-secondary" id="iqrpg-toggle-notifications-btn">Toggle All Notifications</button>
                    <button class="iqrpg-button iqrpg-button-secondary" id="iqrpg-market-data-btn">Market Data</button>
                </div>
            `;

            modal.appendChild(header);
            modal.appendChild(navBar);
            modal.appendChild(body);
            modal.appendChild(footer);
            overlay.appendChild(modal);

            document.body.appendChild(overlay);

            this.modalOverlay = overlay;
            this.modal = modal;

            // Attach event listeners
            this.attachEventListeners();
        },

        generateNotificationSection(type, label) {
            const config = CONFIG.notifications[type];
            // Map notification type to sound key
            const soundKeyMap = {
                'globalEvents': CONSTANTS.STRINGS.SOUND_GLOBAL,
                'actionBonus': CONSTANTS.STRINGS.SOUND_ACTION_BONUS,
                'tradeAlert': CONSTANTS.STRINGS.SOUND_TRADE_ALERT,
                'gatheringEvents': CONSTANTS.STRINGS.SOUND_GATHERING_EVENT,
                'itemDrop': CONSTANTS.STRINGS.SOUND_ITEM_DROP,
                'message': CONSTANTS.STRINGS.SOUND_MESSAGE,
                'abyssBattles': CONSTANTS.STRINGS.SOUND_ABYSS_BATTLES,
                'potions': CONSTANTS.STRINGS.SOUND_POTIONS,
                'marketSale': CONSTANTS.STRINGS.SOUND_MARKET_SALE,
                'itemReceived': CONSTANTS.STRINGS.SOUND_ITEM_RECEIVED,
                'itemSent': CONSTANTS.STRINGS.SOUND_ITEM_SENT,
                'goldReceived': CONSTANTS.STRINGS.SOUND_GOLD_RECEIVED,
                'goldSent': CONSTANTS.STRINGS.SOUND_GOLD_SENT
            };
            const soundKey = soundKeyMap[type] || type;
            
            return `
                <div class="iqrpg-section" id="section-${type}" data-section-type="${type}">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">${label} Notifications</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Sound Alerts</label>
                            <div class="iqrpg-toggle-switch ${config.sound ? 'active' : ''}" 
                                 data-setting="notifications.${type}.sound"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Desktop Notifications</label>
                            <div class="iqrpg-toggle-switch ${config.desktop ? 'active' : ''}" 
                                 data-setting="notifications.${type}.desktop"></div>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${soundKey}" 
                                   value="${CONFIG.sounds[soundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                    </div>
                </div>
            `;
        },

        generateBossSection() {
            const config = CONFIG.notifications.bossSpawn;
            const bossSpawnSoundKey = CONSTANTS.STRINGS.SOUND_BOSS_SPAWN;
            
            return `
                <div class="iqrpg-section" id="section-bossSpawn" data-section-type="bossSpawn">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">Bosses Notifications</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Sound Alerts</label>
                            <div class="iqrpg-toggle-switch ${config.sound ? 'active' : ''}" 
                                 data-setting="notifications.bossSpawn.sound"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Desktop Notifications</label>
                            <div class="iqrpg-toggle-switch ${config.desktop ? 'active' : ''}" 
                                 data-setting="notifications.bossSpawn.desktop"></div>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Boss Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${bossSpawnSoundKey}" 
                                   value="${CONFIG.sounds[bossSpawnSoundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                    </div>
                </div>
            `;
        },

        generateClanSection() {
            const config = CONFIG.notifications.clan;
            const watchtowerSoundKey = CONSTANTS.STRINGS.SOUND_CLAN_WATCHTOWER;
            const globalsSoundKey = CONSTANTS.STRINGS.SOUND_CLAN_GLOBALS;
            
            return `
                <div class="iqrpg-section" id="section-clan" data-section-type="clan">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">Clan</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Sound Alerts</label>
                            <div class="iqrpg-toggle-switch ${config.sound ? 'active' : ''}" 
                                 data-setting="notifications.clan.sound"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Desktop Notifications</label>
                            <div class="iqrpg-toggle-switch ${config.desktop ? 'active' : ''}" 
                                 data-setting="notifications.clan.desktop"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Watchtower</label>
                            <div class="iqrpg-toggle-switch ${config.watchtower ? 'active' : ''}" 
                                 data-setting="notifications.clan.watchtower"></div>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Watchtower Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${watchtowerSoundKey}" 
                                   value="${CONFIG.sounds[watchtowerSoundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Clan Chat Globals</label>
                            <div class="iqrpg-toggle-switch ${config.clanChatGlobals ? 'active' : ''}" 
                                 data-setting="notifications.clan.clanChatGlobals"></div>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Clan Globals Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${globalsSoundKey}" 
                                   value="${CONFIG.sounds[globalsSoundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                    </div>
                </div>
            `;
        },

        generateItemDropSection() {
            const config = CONFIG.notifications.itemDrop;
            const soundKey = CONSTANTS.STRINGS.SOUND_ITEM_DROP;
            const itemKeywords = (config.itemKeywords || []).join(', ');
            
            return `
                <div class="iqrpg-section" id="section-itemDrop" data-section-type="itemDrop">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">Log (Item Drops)</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Sound Alerts</label>
                            <div class="iqrpg-toggle-switch ${config.sound ? 'active' : ''}" 
                                 data-setting="notifications.itemDrop.sound"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Desktop Notifications</label>
                            <div class="iqrpg-toggle-switch ${config.desktop ? 'active' : ''}" 
                                 data-setting="notifications.itemDrop.desktop"></div>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Item Keywords (comma-separated)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="notifications.itemDrop.itemKeywords" 
                                   data-type="array"
                                   value="${itemKeywords}" 
                                   placeholder="e.g. golden egg, diamond, malachite">
                            <small style="color: rgb(136, 136, 136); font-size: 12px; display: block; margin-top: 5px;">
                                Alert when these items are found in the log panel (case-insensitive)
                            </small>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${soundKey}" 
                                   value="${CONFIG.sounds[soundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                    </div>
                </div>
            `;
        },

        generateGatheringEventsSection() {
            const woodcutting = CONFIG.notifications.gatheringEvents.woodcutting;
            const quarrying = CONFIG.notifications.gatheringEvents.quarrying;
            const mining = CONFIG.notifications.gatheringEvents.mining;
            const soundKey = CONSTANTS.STRINGS.SOUND_GATHERING_EVENT;
            
            return `
                <div class="iqrpg-section" id="section-gatheringEvents" data-section-type="gatheringEvents">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">Gathering</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <!-- Woodcutting Event -->
                        <div style="margin-bottom: 20px; padding: 15px; background: rgb(10, 10, 10); border-radius: 0px; border: 1px solid rgb(51, 51, 51);">
                            <h4 style="margin: 0 0 10px 0; color: rgb(204, 204, 204); font-size: 16px;">🌲 Woodcutting Event</h4>
                            <div class="iqrpg-toggle-group">
                                <label class="iqrpg-toggle-label">Sound Alerts</label>
                                <div class="iqrpg-toggle-switch ${woodcutting.sound ? 'active' : ''}" 
                                     data-setting="notifications.gatheringEvents.woodcutting.sound"></div>
                            </div>
                            <div class="iqrpg-toggle-group">
                                <label class="iqrpg-toggle-label">Desktop Notifications</label>
                                <div class="iqrpg-toggle-switch ${woodcutting.desktop ? 'active' : ''}" 
                                     data-setting="notifications.gatheringEvents.woodcutting.desktop"></div>
                            </div>
                        </div>
                        
                        <!-- Quarrying Event -->
                        <div style="margin-bottom: 20px; padding: 15px; background: rgb(10, 10, 10); border-radius: 0px; border: 1px solid rgb(51, 51, 51);">
                            <h4 style="margin: 0 0 10px 0; color: rgb(204, 204, 204); font-size: 16px;">🪨 Quarrying Event</h4>
                            <div class="iqrpg-toggle-group">
                                <label class="iqrpg-toggle-label">Sound Alerts</label>
                                <div class="iqrpg-toggle-switch ${quarrying.sound ? 'active' : ''}" 
                                     data-setting="notifications.gatheringEvents.quarrying.sound"></div>
                            </div>
                            <div class="iqrpg-toggle-group">
                                <label class="iqrpg-toggle-label">Desktop Notifications</label>
                                <div class="iqrpg-toggle-switch ${quarrying.desktop ? 'active' : ''}" 
                                     data-setting="notifications.gatheringEvents.quarrying.desktop"></div>
                            </div>
                        </div>
                        
                        <!-- Mining Event -->
                        <div style="margin-bottom: 20px; padding: 15px; background: rgb(10, 10, 10); border-radius: 0px; border: 1px solid rgb(51, 51, 51);">
                            <h4 style="margin: 0 0 10px 0; color: rgb(204, 204, 204); font-size: 16px;">☄️ Mining Event</h4>
                            <div class="iqrpg-toggle-group">
                                <label class="iqrpg-toggle-label">Sound Alerts</label>
                                <div class="iqrpg-toggle-switch ${mining.sound ? 'active' : ''}" 
                                     data-setting="notifications.gatheringEvents.mining.sound"></div>
                            </div>
                            <div class="iqrpg-toggle-group">
                                <label class="iqrpg-toggle-label">Desktop Notifications</label>
                                <div class="iqrpg-toggle-switch ${mining.desktop ? 'active' : ''}" 
                                     data-setting="notifications.gatheringEvents.mining.desktop"></div>
                            </div>
                        </div>
                        
                        <!-- Sound URL (shared for all gathering events) -->
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${soundKey}" 
                                   value="${CONFIG.sounds[soundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                    </div>
                </div>
            `;
        },

        generateMarketSection() {
            const marketSaleConfig = CONFIG.notifications.marketSale;
            const itemReceivedConfig = CONFIG.notifications.itemReceived;
            const itemSentConfig = CONFIG.notifications.itemSent;
            const marketSaleSoundKey = CONSTANTS.STRINGS.SOUND_MARKET_SALE;
            const itemReceivedSoundKey = CONSTANTS.STRINGS.SOUND_ITEM_RECEIVED;
            const itemSentSoundKey = CONSTANTS.STRINGS.SOUND_ITEM_SENT;
            
            return `
                <div class="iqrpg-section" id="section-marketSale" data-section-type="marketSale">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">Market Notifications</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Market Sale - Sound Alerts</label>
                            <div class="iqrpg-toggle-switch ${marketSaleConfig.sound ? 'active' : ''}" 
                                 data-setting="notifications.marketSale.sound"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Market Sale - Desktop Notifications</label>
                            <div class="iqrpg-toggle-switch ${marketSaleConfig.desktop ? 'active' : ''}" 
                                 data-setting="notifications.marketSale.desktop"></div>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Market Sale Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${marketSaleSoundKey}" 
                                   value="${CONFIG.sounds[marketSaleSoundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Item Received - Sound Alerts</label>
                            <div class="iqrpg-toggle-switch ${itemReceivedConfig.sound ? 'active' : ''}" 
                                 data-setting="notifications.itemReceived.sound"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Item Received - Desktop Notifications</label>
                            <div class="iqrpg-toggle-switch ${itemReceivedConfig.desktop ? 'active' : ''}" 
                                 data-setting="notifications.itemReceived.desktop"></div>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Item Received Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${itemReceivedSoundKey}" 
                                   value="${CONFIG.sounds[itemReceivedSoundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Gold Received Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.goldReceived" 
                                   value="${CONFIG.sounds.goldReceived || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Item Sent - Sound Alerts</label>
                            <div class="iqrpg-toggle-switch ${itemSentConfig.sound ? 'active' : ''}" 
                                 data-setting="notifications.itemSent.sound"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Item Sent - Desktop Notifications</label>
                            <div class="iqrpg-toggle-switch ${itemSentConfig.desktop ? 'active' : ''}" 
                                 data-setting="notifications.itemSent.desktop"></div>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Item Sent Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${itemSentSoundKey}" 
                                   value="${CONFIG.sounds[itemSentSoundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Gold Sent Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.goldSent" 
                                   value="${CONFIG.sounds.goldSent || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                    </div>
                </div>
            `;
        },

        generateTradeAlertSection() {
            const config = CONFIG.notifications.tradeAlert;
            const soundKey = CONSTANTS.STRINGS.SOUND_TRADE_ALERT;
            const sellingKeywords = (config.sellingKeywords || []).join(', ');
            const buyingKeywords = (config.buyingKeywords || []).join(', ');
            
            return `
                <div class="iqrpg-section" id="section-tradeAlert" data-section-type="tradeAlert">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">Trade</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Sound Alerts</label>
                            <div class="iqrpg-toggle-switch ${config.sound ? 'active' : ''}" 
                                 data-setting="notifications.tradeAlert.sound"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Desktop Notifications</label>
                            <div class="iqrpg-toggle-switch ${config.desktop ? 'active' : ''}" 
                                 data-setting="notifications.tradeAlert.desktop"></div>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Selling Keywords (comma-separated)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="notifications.tradeAlert.sellingKeywords" 
                                   data-type="array"
                                   value="${sellingKeywords}" 
                                   placeholder="e.g. iq, mana, qs2">
                            <small style="color: rgb(136, 136, 136); font-size: 12px; display: block; margin-top: 5px;">
                                Alert when someone is selling these items (detects: selling, wts, sell, s>)
                            </small>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Buying Keywords (comma-separated)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="notifications.tradeAlert.buyingKeywords" 
                                   data-type="array"
                                   value="${buyingKeywords}" 
                                   placeholder="e.g. iq, mana, qs2">
                            <small style="color: rgb(136, 136, 136); font-size: 12px; display: block; margin-top: 5px;">
                                Alert when someone is buying these items (detects: buying, wtb, buy, b>)
                            </small>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${soundKey}" 
                                   value="${CONFIG.sounds[soundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                    </div>
                </div>
            `;
        },

        generateAutosSection() {
            const config = CONFIG.notifications.autos;
            const soundKey = CONSTANTS.STRINGS.SOUND_AUTOS;
            const threshold = config.threshold || 100;
            const repeatCount = config.repeatCount || 1;
            
            return `
                <div class="iqrpg-section" id="section-autos" data-section-type="autos">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">Autos Alert</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Sound Alerts</label>
                            <div class="iqrpg-toggle-switch ${config.sound ? 'active' : ''}" 
                                 data-setting="notifications.autos.sound"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Desktop Notifications</label>
                            <div class="iqrpg-toggle-switch ${config.desktop ? 'active' : ''}" 
                                 data-setting="notifications.autos.desktop"></div>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Alert Threshold</label>
                            <input type="number" class="iqrpg-input" 
                                   data-setting="notifications.autos.threshold" 
                                   value="${threshold}" 
                                   min="0"
                                   placeholder="100">
                            <small style="color: rgb(136, 136, 136); font-size: 12px; display: block; margin-top: 5px;">
                                Alert when autos remaining reaches this number or below
                            </small>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Repeat Count</label>
                            <input type="number" class="iqrpg-input" 
                                   data-setting="notifications.autos.repeatCount" 
                                   value="${repeatCount}" 
                                   min="1"
                                   placeholder="1">
                            <small style="color: rgb(136, 136, 136); font-size: 12px; display: block; margin-top: 5px;">
                                Number of times to repeat alert while autos stay under threshold (1 = no repeat)
                            </small>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Repeat Interval (seconds)</label>
                            <input type="number" class="iqrpg-input" 
                                   data-setting="notifications.autos.repeatInterval" 
                                   value="${config.repeatInterval !== undefined ? config.repeatInterval : 1}" 
                                   min="0"
                                   placeholder="1">
                            <small style="color: rgb(136, 136, 136); font-size: 12px; display: block; margin-top: 5px;">
                                Seconds between repeat alerts (0 = immediate repeats, no delay)
                            </small>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${soundKey}" 
                                   value="${CONFIG.sounds[soundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                    </div>
                </div>
            `;
        },

        generatePotionSection() {
            const config = CONFIG.notifications.potions;
            const soundKey = CONSTANTS.STRINGS.SOUND_POTIONS;
            const threshold = config.threshold || 100;
            const repeatCount = config.repeatCount || 1;
            
            return `
                <div class="iqrpg-section" id="section-potions" data-section-type="potions">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">Potion Alert</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Sound Alerts</label>
                            <div class="iqrpg-toggle-switch ${config.sound ? 'active' : ''}" 
                                 data-setting="notifications.potions.sound"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Desktop Notifications</label>
                            <div class="iqrpg-toggle-switch ${config.desktop ? 'active' : ''}" 
                                 data-setting="notifications.potions.desktop"></div>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Alert Threshold</label>
                            <input type="number" class="iqrpg-input" 
                                   data-setting="notifications.potions.threshold" 
                                   value="${threshold}" 
                                   min="0"
                                   placeholder="100">
                            <small style="color: rgb(136, 136, 136); font-size: 12px; display: block; margin-top: 5px;">
                                Alert when potion remaining reaches this number or below
                            </small>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Repeat Count</label>
                            <input type="number" class="iqrpg-input" 
                                   data-setting="notifications.potions.repeatCount" 
                                   value="${repeatCount}" 
                                   min="1"
                                   placeholder="1">
                            <small style="color: rgb(136, 136, 136); font-size: 12px; display: block; margin-top: 5px;">
                                Number of times to repeat alert while potion stays under threshold (1 = no repeat)
                            </small>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Repeat Interval (seconds)</label>
                            <input type="number" class="iqrpg-input" 
                                   data-setting="notifications.potions.repeatInterval" 
                                   value="${config.repeatInterval !== undefined ? config.repeatInterval : 1}" 
                                   min="0"
                                   placeholder="1">
                            <small style="color: rgb(136, 136, 136); font-size: 12px; display: block; margin-top: 5px;">
                                Seconds between repeat alerts (0 = immediate repeats, no delay)
                            </small>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${soundKey}" 
                                   value="${CONFIG.sounds[soundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                    </div>
                </div>
            `;
        },

        generateDungeonSection() {
            const config = CONFIG.notifications.dungeon;
            const soundKey = CONSTANTS.STRINGS.SOUND_DUNGEON;
            
            return `
                <div class="iqrpg-section" id="section-dungeon" data-section-type="dungeon">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">Dungeon Completion</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Sound Alerts</label>
                            <div class="iqrpg-toggle-switch ${config.sound ? 'active' : ''}" 
                                 data-setting="notifications.dungeon.sound"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Desktop Notifications</label>
                            <div class="iqrpg-toggle-switch ${config.desktop ? 'active' : ''}" 
                                 data-setting="notifications.dungeon.desktop"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Only When All Keys Complete</label>
                            <div class="iqrpg-toggle-switch ${config.onlyWhenAllKeysComplete ? 'active' : ''}" 
                                 data-setting="notifications.dungeon.onlyWhenAllKeysComplete"></div>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${soundKey}" 
                                   value="${CONFIG.sounds[soundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                    </div>
                </div>
            `;
        },

        generateMasterySection() {
            const config = CONFIG.notifications.mastery;
            const soundKey = CONSTANTS.STRINGS.SOUND_MASTERY;
            
            return `
                <div class="iqrpg-section" id="section-mastery" data-section-type="mastery">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">Mastery Level Increases</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Sound Alerts</label>
                            <div class="iqrpg-toggle-switch ${config.sound ? 'active' : ''}" 
                                 data-setting="notifications.mastery.sound"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Desktop Notifications</label>
                            <div class="iqrpg-toggle-switch ${config.desktop ? 'active' : ''}" 
                                 data-setting="notifications.mastery.desktop"></div>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${soundKey}" 
                                   value="${CONFIG.sounds[soundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                    </div>
                </div>
            `;
        },

        generateLandSection() {
            const config = CONFIG.notifications.land;
            const soundKey = CONSTANTS.STRINGS.SOUND_LAND;
            
            return `
                <div class="iqrpg-section" id="section-land" data-section-type="land">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">Raid Completion</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Sound Alerts</label>
                            <div class="iqrpg-toggle-switch ${config.sound ? 'active' : ''}" 
                                 data-setting="notifications.land.sound"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Desktop Notifications</label>
                            <div class="iqrpg-toggle-switch ${config.desktop ? 'active' : ''}" 
                                 data-setting="notifications.land.desktop"></div>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${soundKey}" 
                                   value="${CONFIG.sounds[soundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                    </div>
                </div>
            `;
        },

        generateSkillsSection() {
            const config = CONFIG.notifications.skills;
            const soundKey = CONSTANTS.STRINGS.SOUND_SKILLS;
            
            return `
                <div class="iqrpg-section" id="section-skills" data-section-type="skills">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">Skill Level Increases</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Sound Alerts</label>
                            <div class="iqrpg-toggle-switch ${config.sound ? 'active' : ''}" 
                                 data-setting="notifications.skills.sound"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Desktop Notifications</label>
                            <div class="iqrpg-toggle-switch ${config.desktop ? 'active' : ''}" 
                                 data-setting="notifications.skills.desktop"></div>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${soundKey}" 
                                   value="${CONFIG.sounds[soundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                    </div>
                </div>
            `;
        },

        generateAbyssBattlesSection() {
            const config = CONFIG.notifications.abyssBattles;
            const soundKey = CONSTANTS.STRINGS.SOUND_ABYSS_BATTLES;
            
            return `
                <div class="iqrpg-section" id="section-abyssBattles" data-section-type="abyssBattles">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">Abyss Battles Completion</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Sound Alerts</label>
                            <div class="iqrpg-toggle-switch ${config.sound ? 'active' : ''}" 
                                 data-setting="notifications.abyssBattles.sound"></div>
                        </div>
                        
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Desktop Notifications</label>
                            <div class="iqrpg-toggle-switch ${config.desktop ? 'active' : ''}" 
                                 data-setting="notifications.abyssBattles.desktop"></div>
                        </div>
                        
                        <div class="iqrpg-input-group">
                            <label class="iqrpg-input-label">Sound URL (optional)</label>
                            <input type="text" class="iqrpg-input" 
                                   data-setting="sounds.${soundKey}" 
                                   value="${CONFIG.sounds[soundKey] || ''}" 
                                   placeholder="Leave empty for default">
                        </div>
                    </div>
                </div>
            `;
        },

        generateImagesSection() {
            const config = CONFIG.features.images;
            return `
                <div class="iqrpg-section" id="section-images" data-section-type="images">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">Images</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Enable Image Linking & Modals</label>
                            <div class="iqrpg-toggle-switch ${config.enabled ? 'active' : ''}" 
                                 data-setting="features.images.enabled"></div>
                        </div>
                        <p class="iqrpg-section-description" style="color: rgb(136, 136, 136); font-size: 12px; margin-top: 10px;">
                            Automatically converts plain text image URLs in chat to clickable links. Click any link to view in a full-screen modal.
                        </p>
                    </div>
                </div>
            `;
        },

        generateYouTubeSection() {
            const config = CONFIG.features.youtube;
            return `
                <div class="iqrpg-section" id="section-youtube" data-section-type="youtube">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">YouTube</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Enable YouTube Linking & Modals</label>
                            <div class="iqrpg-toggle-switch ${config.enabled ? 'active' : ''}" 
                                 data-setting="features.youtube.enabled"></div>
                        </div>
                        <p class="iqrpg-section-description" style="color: rgb(136, 136, 136); font-size: 12px; margin-top: 10px;">
                            Automatically converts plain text YouTube URLs in chat to clickable links. Videos play directly in-game without leaving the page.
                        </p>
                    </div>
                </div>
            `;
        },

        generateEmojisSection() {
            const config = CONFIG.features.emojis;
            return `
                <div class="iqrpg-section" id="section-emojis" data-section-type="emojis">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">Emojis</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-toggle-group">
                            <label class="iqrpg-toggle-label">Enable Emoji Rendering & Autocomplete</label>
                            <div class="iqrpg-toggle-switch ${config.enabled ? 'active' : ''}" 
                                 data-setting="features.emojis.enabled"></div>
                        </div>
                        <p class="iqrpg-section-description" style="color: rgb(136, 136, 136); font-size: 12px; margin-top: 10px;">
                            Converts emoji shortcodes (e.g., :heart:) to Unicode emojis in chat. Includes Discord-style autocomplete when typing emojis.
                            <br><span style="color: #ffa500; font-weight: bold;">⚠ Requires a page refresh to take effect.</span>
                        </p>
                    </div>
                </div>
            `;
        },

        generateSettingsHTML() {
            const volume = (CONFIG.sounds.volume !== undefined ? CONFIG.sounds.volume : 1.0) * 100;
            return `
                <div class="iqrpg-section" id="section-volume" data-section-type="volume">
                    <div class="iqrpg-section-header">
                        <h3 class="iqrpg-section-title">Volume</h3>
                    </div>
                    <div class="iqrpg-section-content">
                        <div class="iqrpg-volume-group">
                            <label class="iqrpg-volume-label">Sound Volume</label>
                            <input type="range" 
                                   class="iqrpg-volume-slider" 
                                   id="iqrpg-volume-slider"
                                   data-setting="sounds.volume"
                                   min="0" 
                                   max="100" 
                                   value="${volume}" 
                                   step="1">
                            <span class="iqrpg-volume-value" id="iqrpg-volume-value">${Math.round(volume)}%</span>
                        </div>
                    </div>
                </div>
                
                ${this.generateAutosSection()}
                ${this.generateNotificationSection('globalEvents', 'Globals')}
                ${this.generateBossSection()}
                ${this.generateGatheringEventsSection()}
                ${this.generateNotificationSection('actionBonus', 'Action Bonus')}
                ${this.generateClanSection()}
                ${this.generateDungeonSection()}
                ${this.generateLandSection()}
                ${this.generateMasterySection()}
                ${this.generateSkillsSection()}
                ${this.generateMarketSection()}
                ${this.generateTradeAlertSection()}
                ${this.generateItemDropSection()}
                ${this.generateNotificationSection('message', 'Message')}
                ${this.generateAbyssBattlesSection()}
                ${this.generatePotionSection()}
                
                ${this.generateImagesSection()}
                ${this.generateYouTubeSection()}
                ${this.generateEmojisSection()}
            `;
        },

        attachEventListeners() {
            if (!this.modal) return;

            // Use event delegation - attach listeners once to modal container
            // This works with dynamically regenerated HTML and prevents duplicate listeners
            
            // Navigation button click handlers
            this.modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('iqrpg-nav-btn')) {
                    const sectionType = e.target.getAttribute('data-section');
                    const targetSection = this.modal.querySelector(`#section-${sectionType}`);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        e.target.style.background = 'rgb(34, 136, 34)';
                        setTimeout(() => {
                            e.target.style.background = '';
                        }, 300);
                    }
                }
            });

            // Toggle switches
            this.modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('iqrpg-toggle-switch')) {
                    e.target.classList.toggle('active');
                    const setting = e.target.getAttribute('data-setting');
                    this.updateSetting(setting, e.target.classList.contains('active'));
                }
            });

            // Volume slider
            this.modal.addEventListener('input', (e) => {
                if (e.target.id === 'iqrpg-volume-slider') {
                    const volumeValue = this.modal.querySelector('#iqrpg-volume-value');
                    if (volumeValue) {
                        const value = parseFloat(e.target.value);
                        const volumePercent = Math.round(value);
                        volumeValue.textContent = `${volumePercent}%`;
                        const volumeDecimal = value / 100;
                        this.updateSetting('sounds.volume', volumeDecimal);
                        
                        // Update the filled portion of the slider
                        e.target.style.setProperty('--volume-percent', `${value}%`);
                    }
                }
            });

            // Input fields
            this.modal.addEventListener('change', (e) => {
                if (e.target.classList.contains('iqrpg-input')) {
                    const setting = e.target.getAttribute('data-setting');
                    const dataType = e.target.getAttribute('data-type');
                    let value = e.target.value;
                    
                    if (e.target.type === 'number') {
                        value = parseInt(value, 10) || 0;
                    }
                    
                    if (dataType === 'array') {
                        value = value.split(',')
                            .map(v => v.trim())
                            .filter(v => v.length > 0);
                    }
                    
                    this.updateSetting(setting, value);
                }
            });

            // Save button
            this.modal.addEventListener('click', (e) => {
                if (e.target.id === 'iqrpg-save-btn') {
                    this.saveSettings();
                }
            });

            // Reset button
            this.modal.addEventListener('click', (e) => {
                if (e.target.id === 'iqrpg-reset-btn') {
                    if (confirm('Reset all settings to defaults? This cannot be undone.')) {
                        this.resetSettings();
                    }
                }
            });

            // Toggle all sound alerts button
            this.modal.addEventListener('click', (e) => {
                if (e.target.id === 'iqrpg-toggle-sound-btn') {
                    this.toggleAllSoundAlerts();
                }
            });

            // Toggle all notifications button
            this.modal.addEventListener('click', (e) => {
                if (e.target.id === 'iqrpg-toggle-notifications-btn') {
                    this.toggleAllDesktopNotifications();
                }
            });

            // Market Data button
            this.modal.addEventListener('click', (e) => {
                if (e.target.id === 'iqrpg-market-data-btn') {
                    this.openMarketDataPanel();
                }
            });
        },

        updateSetting(path, value) {
            const keys = path.split('.');
            let obj = CONFIG;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!obj[keys[i]]) obj[keys[i]] = {};
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;
            
            // Remove links when features are toggled off
            if (path === 'features.images.enabled' && value === false) {
                ImageModalManager.removeLinks();
            }
            if (path === 'features.youtube.enabled' && value === false) {
                ImageModalManager.removeLinks();
            }
            
            // Handle item sent observer initialization/deactivation
            if (path === 'notifications.itemSent.sound' || path === 'notifications.itemSent.desktop') {
                if (CONFIG.notifications.itemSent.sound || CONFIG.notifications.itemSent.desktop) {
                    ItemSentObserver.init();
                } else {
                    ItemSentObserver.cleanup();
                }
            }
        },

        reloadAudio() {
            AudioManager.audioCache.clear();
            preloadAllSounds();
        },

        saveSettings() {
            saveConfig();
            
            // Handle image/YouTube features
            if (CONFIG.features.images.enabled || CONFIG.features.youtube.enabled) {
                // Re-initialize if enabled (processes existing messages)
                ImageModalManager.init();
            } else {
                // Remove links if disabled
                ImageModalManager.removeLinks();
            }
            
            // Emojis require page refresh (no dynamic initialization)
            // Note: We don't initialize emojis here as they require a page refresh
            
            // If item keywords exist, mark all current items in log as processed
            // This prevents alerts for items that were already in the log before keywords were set
            DOMMonitor.initializeProcessedItemDrops();
            
            this.reloadAudio();
            
            // Show feedback
            const saveBtn = this.modal?.querySelector('#iqrpg-save-btn');
            if (saveBtn) {
                const originalText = saveBtn.textContent;
                saveBtn.textContent = 'Saved!';
                saveBtn.style.background = '#4caf50';
                setTimeout(() => {
                    saveBtn.textContent = originalText;
                    saveBtn.style.background = '';
                }, CONSTANTS.DELAYS.SAVE_FEEDBACK);
            }
        },


        resetSettings() {
            // Reset to defaults
            Object.assign(CONFIG, JSON.parse(JSON.stringify(DEFAULT_CONFIG)));
            saveConfig();
            this.reloadAudio();
            
            // Recreate modal to reflect new settings
            if (this.modalOverlay) {
                this.modalOverlay.remove();
            }
            this.modal = null;
            this.modalOverlay = null;
            this.createModal();
        },

        toggleAllSoundAlerts() {
            // Get current state - check if all are enabled or disabled
            const allNotificationTypes = [
                'globalEvents',
                'actionBonus',
                'bossSpawn',
                'tradeAlert',
                'message',
                'autos',
                'potions',
                'dungeon',
                'mastery',
                'land',
                'skills',
                'itemDrop',
                'abyssBattles',
                'clan',
                'marketSale',
                'itemReceived',
                'itemSent'
            ];
            
            // Check gathering events
            const gatheringTypes = ['woodcutting', 'quarrying', 'mining'];
            
            // Determine if we should enable or disable (if any are enabled, disable all; otherwise enable all)
            let anyEnabled = false;
            for (const type of allNotificationTypes) {
                if (CONFIG.notifications[type]?.sound) {
                    anyEnabled = true;
                    break;
                }
            }
            if (!anyEnabled) {
                for (const type of gatheringTypes) {
                    if (CONFIG.notifications.gatheringEvents[type]?.sound) {
                        anyEnabled = true;
                        break;
                    }
                }
            }
            
            const newValue = !anyEnabled;
            
            // Toggle all notification types
            for (const type of allNotificationTypes) {
                if (CONFIG.notifications[type]) {
                    CONFIG.notifications[type].sound = newValue;
                }
            }
            
            // Toggle gathering events
            for (const type of gatheringTypes) {
                if (CONFIG.notifications.gatheringEvents[type]) {
                    CONFIG.notifications.gatheringEvents[type].sound = newValue;
                }
            }
            
            // Update UI
            this.refreshSettingsUI();
        },
        
        toggleAllDesktopNotifications() {
            // Get current state - check if all are enabled or disabled
            const allNotificationTypes = [
                'globalEvents',
                'actionBonus',
                'bossSpawn',
                'tradeAlert',
                'message',
                'autos',
                'potions',
                'dungeon',
                'mastery',
                'land',
                'skills',
                'itemDrop',
                'abyssBattles',
                'clan',
                'marketSale',
                'itemReceived',
                'itemSent'
            ];
            
            // Check gathering events
            const gatheringTypes = ['woodcutting', 'quarrying', 'mining'];
            
            // Determine if we should enable or disable (if any are enabled, disable all; otherwise enable all)
            let anyEnabled = false;
            for (const type of allNotificationTypes) {
                if (CONFIG.notifications[type]?.desktop) {
                    anyEnabled = true;
                    break;
                }
            }
            if (!anyEnabled) {
                for (const type of gatheringTypes) {
                    if (CONFIG.notifications.gatheringEvents[type]?.desktop) {
                        anyEnabled = true;
                        break;
                    }
                }
            }
            
            const newValue = !anyEnabled;
            
            // Toggle all notification types
            for (const type of allNotificationTypes) {
                if (CONFIG.notifications[type]) {
                    CONFIG.notifications[type].desktop = newValue;
                }
            }
            
            // Toggle gathering events
            for (const type of gatheringTypes) {
                if (CONFIG.notifications.gatheringEvents[type]) {
                    CONFIG.notifications.gatheringEvents[type].desktop = newValue;
                }
            }
            
            // Update UI
            this.refreshSettingsUI();
        },
        
        refreshSettingsUI() {
            // Regenerate settings HTML to reflect current config
            const body = this.modal.querySelector('.iqrpg-modal-body');
            if (body) {
                body.innerHTML = this.generateSettingsHTML();
                
                // Re-initialize volume slider CSS variable
                const volumeSlider = this.modal.querySelector('#iqrpg-volume-slider');
                if (volumeSlider) {
                    const currentVolume = parseFloat(volumeSlider.value);
                    volumeSlider.style.setProperty('--volume-percent', `${currentVolume}%`);
                }
            }
        },

        openModal() {
            if (this.modalOverlay) {
                this.modalOverlay.classList.add('active');
                // Update modal content with current config
                const body = this.modal.querySelector('.iqrpg-modal-body');
                body.innerHTML = this.generateSettingsHTML();
                
                // Initialize volume slider CSS variable
                const volumeSlider = this.modal.querySelector('#iqrpg-volume-slider');
                if (volumeSlider) {
                    const currentVolume = parseFloat(volumeSlider.value);
                    volumeSlider.style.setProperty('--volume-percent', `${currentVolume}%`);
                }
                
                // No need to re-attach listeners - event delegation handles dynamic content
            }
        },

        createMarketDataPanel() {
            // Create panel if it doesn't exist
            if (document.getElementById('iqrpg-market-data-panel')) return;
            
            const panel = document.createElement('div');
            panel.id = 'iqrpg-market-data-panel';
            panel.className = 'iqrpg-market-data-panel';
            
            // Header
            const header = document.createElement('div');
            header.className = 'iqrpg-market-data-panel-header';
            header.innerHTML = `
                <h3 class="iqrpg-market-data-panel-title">Market Data</h3>
                <button class="iqrpg-market-data-panel-close" aria-label="Close">×</button>
            `;
            
            // Content
            const content = document.createElement('div');
            content.className = 'iqrpg-market-data-content';
            
            panel.appendChild(header);
            panel.appendChild(content);
            
            document.body.appendChild(panel);
            
            // Close button handler
            const closeBtn = header.querySelector('.iqrpg-market-data-panel-close');
            closeBtn.addEventListener('click', () => {
                this.closeMarketDataPanel();
            });
            
            // ESC key handler
            const escHandler = (e) => {
                if (e.key === 'Escape' && panel.classList.contains('active')) {
                    this.closeMarketDataPanel();
                }
            };
            document.addEventListener('keydown', escHandler);
            
            // Store handler for cleanup
            panel._escHandler = escHandler;
        },

        openMarketDataPanel() {
            const panel = document.getElementById('iqrpg-market-data-panel');
            if (!panel) {
                this.createMarketDataPanel();
                // Wait for panel to be created, then open
                setTimeout(() => this.openMarketDataPanel(), 50);
                return;
            }
            
            // Update content
            this.updateMarketDataPanel();
            
            // Show panel
            panel.classList.add('active');
            
            // Prevent body scroll when panel is open
            document.body.style.overflow = 'hidden';
        },

        closeMarketDataPanel() {
            const panel = document.getElementById('iqrpg-market-data-panel');
            if (panel) {
                panel.classList.remove('active');
                document.body.style.overflow = '';
            }
        },

        updateMarketDataPanel() {
            const panel = document.getElementById('iqrpg-market-data-panel');
            if (!panel) return;
            
            const content = panel.querySelector('.iqrpg-market-data-content');
            if (!content) return;
            
            // Cache data to avoid multiple loadData() calls
            const stats = MarketDataTracker.getStats();
            
            // Format gold with commas
            const formatGold = (gold) => gold.toLocaleString();
            
            let html = `
                <div class="iqrpg-market-data-summary-grid">
                    <div class="iqrpg-market-data-summary">
                        <div class="iqrpg-market-data-summary-title">Market Sales</div>
                        <div class="iqrpg-market-data-summary-value">${formatGold(stats.totalGold || 0)}</div>
                    </div>
                    
                    <div class="iqrpg-market-data-summary">
                        <div class="iqrpg-market-data-summary-title">Gold Received</div>
                        <div class="iqrpg-market-data-summary-value">${formatGold(stats.totalGoldReceived || 0)}</div>
                    </div>
                    
                    <div class="iqrpg-market-data-summary">
                        <div class="iqrpg-market-data-summary-title">Taxes Paid</div>
                        <div class="iqrpg-market-data-summary-value" style="color: rgb(204, 68, 68);">${formatGold((stats.totalTax || 0) + (stats.totalTaxFromReceived || 0))}</div>
                    </div>
                    
                    <div class="iqrpg-market-data-summary">
                        <div class="iqrpg-market-data-summary-title">Gold Sent</div>
                        <div class="iqrpg-market-data-summary-value">${formatGold(MarketDataTracker.getTotalGoldSent(stats))}</div>
                    </div>
                </div>
                
                <div style="margin-top: 30px; margin-bottom: 15px;">
                    <h4 style="color: rgb(204, 204, 204); font-size: 16px; font-weight: bold; font-family: Verdana, Arial, sans-serif; margin: 0 0 10px 0;">Market Sales</h4>
                    <input type="text" class="iqrpg-market-data-filter" id="iqrpg-filter-sales" placeholder="Filter by item name...">
                </div>
                
                <div class="iqrpg-market-data-table-container">
                    <table class="iqrpg-market-data-table" id="iqrpg-table-sales">
                        <thead>
                            <tr>
                                <th data-sort="item" data-table="sales">Item</th>
                                <th data-sort="quantity" data-table="sales">Quantity</th>
                                <th data-sort="gold" data-table="sales">Gold</th>
                                <th data-sort="tax" data-table="sales">Tax</th>
                            </tr>
                        </thead>
                        <tbody id="iqrpg-table-sales-body">
                        </tbody>
                    </table>
                </div>
                
                <div style="margin-top: 30px; margin-bottom: 15px;">
                    <h4 style="color: rgb(204, 204, 204); font-size: 16px; font-weight: bold; font-family: Verdana, Arial, sans-serif; margin: 0 0 10px 0;">Items Received</h4>
                    <input type="text" class="iqrpg-market-data-filter" id="iqrpg-filter-received" placeholder="Filter by item or person name...">
                </div>
                
                <div class="iqrpg-market-data-table-container">
                    <table class="iqrpg-market-data-table" id="iqrpg-table-received">
                        <thead>
                            <tr>
                                <th data-sort="item" data-table="received">Item</th>
                                <th data-sort="amount" data-table="received">Amount</th>
                                <th data-sort="person" data-table="received">From</th>
                            </tr>
                        </thead>
                        <tbody id="iqrpg-table-received-body">
                        </tbody>
                    </table>
                </div>
                
                <div style="margin-top: 30px; margin-bottom: 15px;">
                    <h4 style="color: rgb(204, 204, 204); font-size: 16px; font-weight: bold; font-family: Verdana, Arial, sans-serif; margin: 0 0 10px 0;">Items Sent</h4>
                    <input type="text" class="iqrpg-market-data-filter" id="iqrpg-filter-sent" placeholder="Filter by item or person name...">
                </div>
                
                <div class="iqrpg-market-data-table-container">
                    <table class="iqrpg-market-data-table" id="iqrpg-table-sent">
                        <thead>
                            <tr>
                                <th data-sort="item" data-table="sent">Item</th>
                                <th data-sort="amount" data-table="sent">Amount</th>
                                <th data-sort="person" data-table="sent">To</th>
                            </tr>
                        </thead>
                        <tbody id="iqrpg-table-sent-body">
                        </tbody>
                    </table>
                </div>
            `;
            
            content.innerHTML = html;
            
            // Populate tables and attach event listeners
            this.populateSalesTable();
            this.populateReceivedTable();
            this.populateSentTable();
            this.attachTableListeners();
        },
        
        populateSalesTable(filterText = '', data = null) {
            const tbody = document.getElementById('iqrpg-table-sales-body');
            if (!tbody) return;
            
            let rows = MarketDataTracker.getMarketSalesRows(data);
            
            // Apply filter
            if (filterText) {
                const filter = filterText.toLowerCase();
                rows = rows.filter(row => 
                    row.item.toLowerCase().includes(filter)
                );
            }
            
            if (rows.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" style="text-align: center; color: rgb(136, 136, 136); padding: 20px;">
                            ${filterText ? 'No matching sales found.' : 'No market sales recorded yet.'}
                        </td>
                    </tr>
                `;
                return;
            }
            
            // Sort by current sort state (default: item name)
            const sortState = this.salesTableSort || { column: 'item', direction: 'asc' };
            rows.sort((a, b) => {
                let aVal = a[sortState.column];
                let bVal = b[sortState.column];
                
                // Handle numeric sorting for quantity, gold, tax
                if (sortState.column === 'quantity' || sortState.column === 'gold' || sortState.column === 'tax') {
                    return sortState.direction === 'asc' ? aVal - bVal : bVal - aVal;
                }
                
                // Handle string sorting
                aVal = String(aVal).toLowerCase();
                bVal = String(bVal).toLowerCase();
                
                if (sortState.direction === 'asc') {
                    return aVal.localeCompare(bVal);
                } else {
                    return bVal.localeCompare(aVal);
                }
            });
            
            // Render rows
            tbody.innerHTML = rows.map(row => `
                <tr>
                    <td>${row.item}</td>
                    <td style="text-align: right;">${row.quantity.toLocaleString()}</td>
                    <td style="text-align: right; color: rgb(34, 136, 34);">${row.gold.toLocaleString()}</td>
                    <td style="text-align: right; color: rgb(204, 68, 68);">${row.tax.toLocaleString()}</td>
                </tr>
            `).join('');
        },
        
        populateReceivedTable(filterText = '', data = null) {
            const tbody = document.getElementById('iqrpg-table-received-body');
            if (!tbody) return;
            
            let rows = MarketDataTracker.getReceivedItemsRows(data);
            
            // Apply filter
            if (filterText) {
                const filter = filterText.toLowerCase();
                rows = rows.filter(row => 
                    row.item.toLowerCase().includes(filter) ||
                    row.person.toLowerCase().includes(filter)
                );
            }
            
            if (rows.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="3" style="text-align: center; color: rgb(136, 136, 136); padding: 20px;">
                            ${filterText ? 'No matching transactions found.' : 'No items received yet.'}
                        </td>
                    </tr>
                `;
                return;
            }
            
            // Sort by current sort state (default: item name)
            const sortState = this.receivedTableSort || { column: 'item', direction: 'asc' };
            rows.sort((a, b) => {
                let aVal = a[sortState.column];
                let bVal = b[sortState.column];
                
                // Handle numeric sorting for amount
                if (sortState.column === 'amount') {
                    return sortState.direction === 'asc' ? aVal - bVal : bVal - aVal;
                }
                
                // Handle string sorting
                aVal = String(aVal).toLowerCase();
                bVal = String(bVal).toLowerCase();
                
                if (sortState.direction === 'asc') {
                    return aVal.localeCompare(bVal);
                } else {
                    return bVal.localeCompare(aVal);
                }
            });
            
            // Render rows
            tbody.innerHTML = rows.map(row => `
                <tr>
                    <td>${row.item}</td>
                    <td style="text-align: right;">${row.amount.toLocaleString()}</td>
                    <td>${row.person}</td>
                </tr>
            `).join('');
        },
        
        populateSentTable(filterText = '', data = null) {
            const tbody = document.getElementById('iqrpg-table-sent-body');
            if (!tbody) return;
            
            let rows = MarketDataTracker.getSentItemsRows(data);
            
            // Apply filter
            if (filterText) {
                const filter = filterText.toLowerCase();
                rows = rows.filter(row => 
                    row.item.toLowerCase().includes(filter) ||
                    row.person.toLowerCase().includes(filter)
                );
            }
            
            if (rows.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="3" style="text-align: center; color: rgb(136, 136, 136); padding: 20px;">
                            ${filterText ? 'No matching transactions found.' : 'No items sent yet.'}
                        </td>
                    </tr>
                `;
                return;
            }
            
            // Sort by current sort state (default: item name)
            const sortState = this.sentTableSort || { column: 'item', direction: 'asc' };
            rows.sort((a, b) => {
                let aVal = a[sortState.column];
                let bVal = b[sortState.column];
                
                // Handle numeric sorting for amount
                if (sortState.column === 'amount') {
                    return sortState.direction === 'asc' ? aVal - bVal : bVal - aVal;
                }
                
                // Handle string sorting
                aVal = String(aVal).toLowerCase();
                bVal = String(bVal).toLowerCase();
                
                if (sortState.direction === 'asc') {
                    return aVal.localeCompare(bVal);
                } else {
                    return bVal.localeCompare(aVal);
                }
            });
            
            // Render rows
            tbody.innerHTML = rows.map(row => `
                <tr>
                    <td>${row.item}</td>
                    <td style="text-align: right;">${row.amount.toLocaleString()}</td>
                    <td>${row.person}</td>
                </tr>
            `).join('');
        },
        
        attachTableListeners() {
            const panel = document.getElementById('iqrpg-market-data-panel');
            if (!panel) return;
            
            // Initialize sort states
            if (!this.receivedTableSort) {
                this.receivedTableSort = { column: 'item', direction: 'asc' };
            }
            if (!this.sentTableSort) {
                this.sentTableSort = { column: 'item', direction: 'asc' };
            }
            if (!this.salesTableSort) {
                this.salesTableSort = { column: 'item', direction: 'asc' };
            }
            
            // Column header click handlers for sorting
            panel.addEventListener('click', (e) => {
                if (e.target.tagName === 'TH' && e.target.hasAttribute('data-sort')) {
                    const column = e.target.getAttribute('data-sort');
                    const tableType = e.target.getAttribute('data-table');
                    
                    if (tableType === 'received') {
                        // Toggle sort direction if same column, otherwise set to asc
                        if (this.receivedTableSort.column === column) {
                            this.receivedTableSort.direction = this.receivedTableSort.direction === 'asc' ? 'desc' : 'asc';
                        } else {
                            this.receivedTableSort = { column, direction: 'asc' };
                        }
                        
                        // Update header classes
                        const headers = panel.querySelectorAll('#iqrpg-table-received th');
                        headers.forEach(th => {
                            th.classList.remove('sort-asc', 'sort-desc');
                            if (th.getAttribute('data-sort') === column) {
                                th.classList.add(this.receivedTableSort.direction === 'asc' ? 'sort-asc' : 'sort-desc');
                            }
                        });
                        
                        this.populateReceivedTable(document.getElementById('iqrpg-filter-received')?.value || '', null);
                    } else if (tableType === 'sent') {
                        // Toggle sort direction if same column, otherwise set to asc
                        if (this.sentTableSort.column === column) {
                            this.sentTableSort.direction = this.sentTableSort.direction === 'asc' ? 'desc' : 'asc';
                        } else {
                            this.sentTableSort = { column, direction: 'asc' };
                        }
                        
                        // Update header classes
                        const headers = panel.querySelectorAll('#iqrpg-table-sent th');
                        headers.forEach(th => {
                            th.classList.remove('sort-asc', 'sort-desc');
                            if (th.getAttribute('data-sort') === column) {
                                th.classList.add(this.sentTableSort.direction === 'asc' ? 'sort-asc' : 'sort-desc');
                            }
                        });
                        
                        this.populateSentTable(document.getElementById('iqrpg-filter-sent')?.value || '', null);
                    } else if (tableType === 'sales') {
                        // Toggle sort direction if same column, otherwise set to asc
                        if (this.salesTableSort.column === column) {
                            this.salesTableSort.direction = this.salesTableSort.direction === 'asc' ? 'desc' : 'asc';
                        } else {
                            this.salesTableSort = { column, direction: 'asc' };
                        }
                        
                        // Update header classes
                        const headers = panel.querySelectorAll('#iqrpg-table-sales th');
                        headers.forEach(th => {
                            th.classList.remove('sort-asc', 'sort-desc');
                            if (th.getAttribute('data-sort') === column) {
                                th.classList.add(this.salesTableSort.direction === 'asc' ? 'sort-asc' : 'sort-desc');
                            }
                        });
                        
                        this.populateSalesTable(document.getElementById('iqrpg-filter-sales')?.value || '');
                    }
                }
            });
            
            // Filter input handlers with debouncing (300ms delay)
            const receivedFilter = panel.querySelector('#iqrpg-filter-received');
            const sentFilter = panel.querySelector('#iqrpg-filter-sent');
            const salesFilter = panel.querySelector('#iqrpg-filter-sales');
            
            // Debounce helper
            const debounce = (func, wait) => {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            };
            
            if (receivedFilter) {
                receivedFilter.addEventListener('input', debounce((e) => {
                    this.populateReceivedTable(e.target.value);
                }, 300));
            }
            
            if (sentFilter) {
                sentFilter.addEventListener('input', debounce((e) => {
                    this.populateSentTable(e.target.value);
                }, 300));
            }
            
            if (salesFilter) {
                salesFilter.addEventListener('input', debounce((e) => {
                    this.populateSalesTable(e.target.value);
                }, 300));
            }
        },

        closeModal() {
            if (this.modalOverlay) {
                this.modalOverlay.classList.remove('active');
            }
            // Also close market data panel if open
            this.closeMarketDataPanel();
        },

        cleanup() {
            if (this.escKeyHandler) {
                document.removeEventListener('keydown', this.escKeyHandler);
                this.escKeyHandler = null;
            }
        }
    };

    // ============================================
    // Initialization
    // ============================================
    function init() {
        // Initialize WebSocket interception
        WebSocketInterceptor.init();

        // Initialize GUI
        GUIManager.init();

        // Initialize DOM monitoring
        DOMMonitor.init();

        // Initialize image modal manager (only if enabled)
        if (CONFIG.features.images.enabled || CONFIG.features.youtube.enabled) {
            ImageModalManager.init();
        }

        // Initialize emoji converter (only if enabled)
        if (CONFIG.features.emojis.enabled) {
            EmojiConverter.init();
            EmojiAutocomplete.init();
        }
        
        // Initialize item sent observer (only if enabled)
        if (CONFIG.notifications.itemSent.sound || CONFIG.notifications.itemSent.desktop) {
            ItemSentObserver.init();
        }
    }

    // Start initialization
    init();

})();