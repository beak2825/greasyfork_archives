// ==UserScript==
// @name         Loginify - Discord Token Login
// @description  🚀 Login Flawlessly With Tokens - Ultimate Discord account manager with insane features
// @match        https://discord.com/login*
// @match        https://discord.com/channels/*
// @version      3.0.0
// @author       Loginify Team
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1360608
// @downloadURL https://update.greasyfork.org/scripts/550118/Loginify%20-%20Discord%20Token%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/550118/Loginify%20-%20Discord%20Token%20Login.meta.js
// ==/UserScript==

/*
🔥 LOGINIFY - The Ultimate Discord Token Manager 🔥
• Ultra-modern UI with backdrop blur effects and smooth animations
• Smart drag interface with buttery smooth performance
• Advanced account management with auto-detection
• Full import/export with complete account data
• Real-time Discord API integration for user info
• Multiple login modes (current tab / new tab)
• Stealth mode with emergency hotkeys (Ctrl+Alt+S)
• Advanced theming system with gradient customization
• Current account detection with visual indicators
• Auto token extraction and paste functionality
• Professional settings panel with tons of options
• Login Flawlessly With Tokens™
*/

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        version: '3.0.0',
        name: 'Loginify',
        tagline: 'Login Flawlessly With Tokens',
        storageKeys: {
            accounts: 'loginify_accounts_v3',
            settings: 'loginify_settings_v3',
            position: 'loginify_position_v3',
            currentUser: 'loginify_current_user'
        },
        animations: {
            duration: 400,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        },
        discord: {
            api: 'https://discord.com/api/v10',
            cdn: 'https://cdn.discordapp.com'
        },
        colorPresets: {
            custom: {
                primaryColor: '#667eea',
                secondaryColor: '#764ba2',
                accentColor: '#ff6b6b'
            },
            discord: {
                primaryColor: '#5865f2',
                secondaryColor: '#3c45a5',
                accentColor: '#eb459e'
            },
            cyberpunk: {
                primaryColor: '#ff0080',
                secondaryColor: '#00ffff',
                accentColor: '#ffff00'
            },
            sunset: {
                primaryColor: '#ff7b7b',
                secondaryColor: '#ff9a56',
                accentColor: '#ffad56'
            },
            ocean: {
                primaryColor: '#0077be',
                secondaryColor: '#00a8cc',
                accentColor: '#4dd0e1'
            },
            forest: {
                primaryColor: '#2e7d32',
                secondaryColor: '#388e3c',
                accentColor: '#66bb6a'
            }
        }
    };

    // Default settings
    const DEFAULT_SETTINGS = {
        theme: 'dark',
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        accentColor: '#ff6b6b',
        lastTokenValidation: 0,
        autoValidationEnabled: true,
        validationInterval: 7, // days
        backgroundOpacity: 85,
        borderRadius: 16,
        shadowIntensity: 60,
        glowEffect: true,
        particleEffects: false,
        animationStyle: 'smooth', // 'minimal', 'smooth', 'bouncy', 'dramatic'
        autoHide: true,
        snapToEdges: true,
        showNotifications: true,
        loginMode: 'current', // 'current' or 'newTab'
        compactMode: false,
        animationSpeed: 'normal', // 'slow', 'normal', 'fast'
        autoDetectCurrent: true,
        extractUserData: true,
        customFont: 'Inter',
        fontSize: 14,
        iconStyle: 'rounded', // 'rounded', 'sharp', 'minimal'
        colorScheme: 'custom', // 'custom', 'discord', 'cyberpunk', 'sunset', 'ocean', 'forest'
        headerStyle: 'glass', // 'glass', 'solid', 'gradient', 'minimal'
        buttonStyle: 'modern', // 'modern', 'classic', 'rounded', 'sharp'
    };

    // State management
    let state = {
        accounts: GM_getValue(CONFIG.storageKeys.accounts, []),
        settings: { ...DEFAULT_SETTINGS, ...GM_getValue(CONFIG.storageKeys.settings, {}) },
        position: GM_getValue(CONFIG.storageKeys.position, { x: window.innerWidth - 80, y: window.innerHeight - 80 }),
        currentUser: GM_getValue(CONFIG.storageKeys.currentUser, null),
        isVisible: false,
        isDragging: false,
        searchQuery: '',
        selectedGroup: 'all',
        stealthMode: false,
        lastToggle: 0,
        currentToken: null,
        settingsOpen: false,
        dragStart: { x: 0, y: 0 },
        countdownInterval: null
    };

    // Add comprehensive styles
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        :root {
            --loginify-primary-color: #667eea;
            --loginify-secondary-color: #764ba2;
            --loginify-accent-color: #ff6b6b;
            --loginify-bg-opacity: 0.85;
            --loginify-border-radius: 16px;
            --loginify-shadow-intensity: 0.6;
            --loginify-font-size: 14px;
            --loginify-custom-font: 'Inter';

            --loginify-primary: linear-gradient(135deg, var(--loginify-primary-color) 0%, var(--loginify-secondary-color) 100%);
            --loginify-primary-solid: var(--loginify-primary-color);
            --loginify-primary-hover: #5a6fd8;
            --loginify-secondary: #4f545c;
            --loginify-accent: var(--loginify-accent-color);
            --loginify-success: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            --loginify-danger: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            --loginify-warning: linear-gradient(135deg, #feca57 0%, #ff9ff3 100%);
            --loginify-info: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
            --loginify-bg-primary: rgba(20, 22, 25, var(--loginify-bg-opacity));
            --loginify-bg-secondary: rgba(28, 30, 34, calc(var(--loginify-bg-opacity) + 0.05));
            --loginify-bg-tertiary: rgba(35, 38, 42, calc(var(--loginify-bg-opacity) - 0.05));
            --loginify-bg-glass: rgba(255, 255, 255, 0.08);
            --loginify-text-primary: #ffffff;
            --loginify-text-secondary: #d1d5db;
            --loginify-text-muted: #9ca3af;
            --loginify-border: rgba(255, 255, 255, 0.12);
            --loginify-border-hover: rgba(255, 255, 255, 0.2);
            --loginify-shadow: 0 25px 50px -12px rgba(0, 0, 0, var(--loginify-shadow-intensity));
            --loginify-shadow-lg: 0 35px 60px -12px rgba(0, 0, 0, calc(var(--loginify-shadow-intensity) + 0.2));
            --loginify-shadow-xl: 0 50px 100px -20px rgba(0, 0, 0, calc(var(--loginify-shadow-intensity) + 0.3));
            --loginify-radius: var(--loginify-border-radius);
            --loginify-radius-sm: calc(var(--loginify-border-radius) * 0.5);
            --loginify-radius-lg: calc(var(--loginify-border-radius) * 1.25);
            --loginify-transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            --loginify-spring: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .loginify-container {
            position: fixed;
            top: 20px;
            left: 20px;
            width: 580px;
            min-width: 480px;
            max-width: 900px;
            height: 720px;
            min-height: 500px;
            max-height: 90vh;
            background: var(--loginify-bg-primary);
            backdrop-filter: blur(20px) saturate(1.2);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius);
            box-shadow: var(--loginify-shadow);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: var(--loginify-text-primary);
            z-index: 999999;
            opacity: 0;
            transform: translateY(-40px) scale(0.9) rotateX(15deg);
            transition: var(--loginify-spring);
            user-select: none;
            overflow: hidden;
            will-change: transform, opacity;
            resize: both;
            display: flex;
            flex-direction: column;
            pointer-events: none;
        }

        .loginify-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }

        .loginify-container.visible {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg);
            pointer-events: auto;
        }

        .loginify-container.hidden {
            opacity: 0;
            transform: translateY(-40px) scale(0.85);
            pointer-events: none;
        }

        /* Resize handles for desktop app feel */
        .loginify-container::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            background: linear-gradient(-45deg, transparent 40%, var(--loginify-border) 40%, var(--loginify-border) 50%, transparent 50%, transparent 60%, var(--loginify-border) 60%, var(--loginify-border) 70%, transparent 70%);
            cursor: nw-resize;
            z-index: 10;
            border-radius: 0 0 var(--loginify-radius) 0;
        }

        .loginify-container .loginify-content {
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }

        /* Compact Mode Styles */
        .loginify-container.compact {
            width: 420px;
            min-width: 400px;
            height: auto;
            max-height: 600px;
        }

        .loginify-container.compact .loginify-header {
            padding: 16px 20px;
        }

        .loginify-container.compact .loginify-header h2 {
            font-size: 16px;
        }

        .loginify-container.compact .loginify-search-container {
            padding: 12px 16px;
        }

        .loginify-container.compact .loginify-search {
            height: 36px;
            font-size: 13px;
        }

        .loginify-container.compact .loginify-account {
            padding: 10px 16px;
            gap: 10px;
        }

        .loginify-container.compact .loginify-avatar {
            width: 32px;
            height: 32px;
            font-size: 14px;
        }

        .loginify-container.compact .loginify-account-info h4 {
            font-size: 13px;
            margin-bottom: 2px;
        }

        .loginify-container.compact .loginify-account-group {
            font-size: 10px;
        }

        .loginify-container.compact .loginify-content {
            max-height: 400px;
        }

        .loginify-container.compact .loginify-footer {
            padding: 12px 16px;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }

        .loginify-container.compact .loginify-btn-primary,
        .loginify-container.compact .loginify-btn-secondary {
            padding: 8px 12px;
            font-size: 12px;
        }

        .loginify-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 22px 26px;
            border-bottom: 1px solid var(--loginify-border);
            cursor: move;
            background: var(--loginify-primary);
            border-radius: var(--loginify-radius) var(--loginify-radius) 0 0;
            position: relative;
            overflow: hidden;
            user-select: none;
        }

        .loginify-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
            transition: left 0.7s ease;
        }

        .loginify-header:hover::before {
            left: 100%;
        }

        .loginify-tagline {
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 400;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .loginify-title {
            display: flex;
            align-items: center;
            gap: 14px;
            font-weight: 800;
            font-size: 20px;
            letter-spacing: -0.03em;
            position: relative;
            z-index: 1;
        }

        .loginify-logo {
            width: 36px;
            height: 36px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: white;
            transition: var(--loginify-transition);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
            cursor: pointer;
        }

        .loginify-logo:hover {
            transform: scale(1.15) rotate(8deg);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
            background: rgba(255, 255, 255, 0.25);
        }

        .loginify-account-counter {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 4px 12px;
            display: flex;
            align-items: center;
            gap: 4px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-left: auto;
        }

        .loginify-counter-number {
            font-size: 14px;
            font-weight: 700;
            color: white;
        }

        .loginify-counter-label {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            font-weight: 500;
        }

        .dtl-controls {
            display: flex;
            gap: 8px;
        }

        .dtl-btn {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: var(--dtl-radius-sm);
            color: white;
            cursor: pointer;
            padding: 8px 12px;
            font-size: 13px;
            font-weight: 500;
            transition: var(--dtl-transition);
            display: flex;
            align-items: center;
            gap: 6px;
            position: relative;
            z-index: 1;
            overflow: hidden;
        }

        .dtl-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s ease;
        }

        .dtl-btn:hover::before {
            left: 100%;
        }

        .dtl-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .dtl-btn:active {
            transform: translateY(0);
        }

        .dtl-search {
            padding: 16px 24px;
            border-bottom: 1px solid var(--dtl-border);
            background: var(--dtl-bg-glass);
        }

        .dtl-search-input {
            width: 100%;
            background: var(--dtl-bg-tertiary);
            backdrop-filter: blur(10px);
            border: 1px solid var(--dtl-border);
            border-radius: var(--dtl-radius-sm);
            padding: 14px 16px;
            color: var(--dtl-text-primary);
            font-size: 14px;
            font-weight: 400;
            transition: var(--dtl-transition);
            box-sizing: border-box;
        }

        .dtl-search-input::placeholder {
            color: var(--dtl-text-muted);
            opacity: 0.8;
        }

        .dtl-search-input:focus {
            outline: none;
            border-color: var(--dtl-primary-solid);
            background: var(--dtl-bg-secondary);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
            transform: translateY(-1px);
        }

        .dtl-accounts {
            max-height: 320px;
            overflow-y: auto;
            padding: 16px 24px;
            background: var(--dtl-bg-glass);
        }

        .dtl-accounts::-webkit-scrollbar {
            width: 8px;
        }

        .dtl-accounts::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 4px;
        }

        .dtl-accounts::-webkit-scrollbar-thumb {
            background: var(--dtl-border);
            border-radius: 4px;
            border: 2px solid transparent;
            background-clip: content-box;
        }

        .dtl-accounts::-webkit-scrollbar-thumb:hover {
            background: var(--dtl-border-hover);
            background-clip: content-box;
        }

        .dtl-account {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 18px;
            background: var(--dtl-bg-secondary);
            backdrop-filter: blur(10px);
            border: 1px solid var(--dtl-border);
            border-radius: var(--dtl-radius-sm);
            margin-bottom: 12px;
            cursor: pointer;
            transition: var(--dtl-spring);
            position: relative;
            overflow: hidden;
        }

        .dtl-account::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
            transition: left 0.6s ease;
        }

        .dtl-account:hover::before {
            left: 100%;
        }

        .dtl-account:hover {
            border-color: var(--dtl-primary-solid);
            background: var(--dtl-bg-tertiary);
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
        }

        .dtl-account:active {
            transform: translateY(-1px) scale(1.01);
        }

        .dtl-account.favorite {
            border-color: #feca57;
            box-shadow: 0 4px 20px rgba(254, 202, 87, 0.15);
        }

        .dtl-account.favorite:hover {
            border-color: #ff9ff3;
            box-shadow: 0 12px 40px rgba(255, 159, 243, 0.25);
        }

        .dtl-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--dtl-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 18px;
            color: white;
            overflow: hidden;
            border: 2px solid rgba(255, 255, 255, 0.15);
            transition: var(--dtl-transition);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .dtl-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .dtl-account:hover .dtl-avatar {
            transform: scale(1.1);
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }

        .dtl-account-info {
            flex: 1;
            min-width: 0;
        }

        .dtl-account-name {
            font-weight: 600;
            font-size: 15px;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--dtl-text-primary);
            letter-spacing: -0.01em;
        }

        .dtl-account-status {
            font-size: 13px;
            color: var(--dtl-text-muted);
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: 400;
        }

        .dtl-status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #4facfe;
            box-shadow: 0 0 8px rgba(79, 172, 254, 0.4);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
        }

        /* Enhanced styles for new features */

        .loginify-controls {
            display: flex;
            gap: 8px;
            position: relative;
            z-index: 1;
        }

        .loginify-btn {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: var(--loginify-radius-sm);
            color: white;
            cursor: pointer;
            padding: 8px 12px;
            font-size: 13px;
            font-weight: 500;
            transition: var(--loginify-transition);
            display: flex;
            align-items: center;
            gap: 6px;
            position: relative;
            z-index: 1;
            overflow: hidden;
        }

        .loginify-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s ease;
        }

        .loginify-btn:hover::before {
            left: 100%;
        }

        .loginify-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .loginify-btn:active {
            transform: translateY(0);
        }

        .loginify-search {
            padding: 16px 24px;
            border-bottom: 1px solid var(--loginify-border);
            background: var(--loginify-bg-glass);
        }

        .loginify-search-input {
            width: 100%;
            background: var(--loginify-bg-tertiary);
            backdrop-filter: blur(10px);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            padding: 14px 16px;
            color: var(--loginify-text-primary);
            font-size: 14px;
            font-weight: 400;
            transition: var(--loginify-transition);
            box-sizing: border-box;
        }

        .loginify-search-input::placeholder {
            color: var(--loginify-text-muted);
            opacity: 0.8;
        }

        .loginify-search-input:focus {
            outline: none;
            border-color: var(--loginify-primary-solid);
            background: var(--loginify-bg-secondary);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
            transform: translateY(-1px);
        }

        .loginify-search-hint {
            font-size: 11px;
            color: var(--loginify-text-muted);
            margin-top: 6px;
            text-align: center;
            opacity: 0.8;
            font-weight: 400;
        }

        .loginify-accounts {
            flex: 1;
            overflow-y: auto;
            padding: 16px 24px;
            background: var(--loginify-bg-glass);
        }

        .loginify-accounts::-webkit-scrollbar {
            width: 8px;
        }

        .loginify-accounts::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 4px;
        }

        .loginify-accounts::-webkit-scrollbar-thumb {
            background: var(--loginify-border);
            border-radius: 4px;
            border: 2px solid transparent;
            background-clip: content-box;
        }

        .loginify-accounts::-webkit-scrollbar-thumb:hover {
            background: var(--loginify-border-hover);
            background-clip: content-box;
        }

        .loginify-account {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 18px;
            background: var(--loginify-bg-secondary);
            backdrop-filter: blur(10px);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            margin-bottom: 12px;
            cursor: pointer;
            transition: var(--loginify-spring);
            position: relative;
            overflow: hidden;
        }

        .loginify-account::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
            transition: left 0.6s ease;
        }

        .loginify-account:hover::before {
            left: 100%;
        }

        .loginify-account:hover {
            border-color: var(--loginify-primary-solid);
            background: var(--loginify-bg-tertiary);
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
        }

        .loginify-account:active {
            transform: translateY(-1px) scale(1.01);
        }

        .loginify-account.favorite {
            border-color: #feca57;
            box-shadow: 0 4px 20px rgba(254, 202, 87, 0.15);
        }

        .loginify-account.favorite:hover {
            border-color: #ff9ff3;
            box-shadow: 0 12px 40px rgba(255, 159, 243, 0.25);
        }

        .loginify-account.current {
            border-color: #4facfe;
            background: var(--loginify-bg-tertiary);
            box-shadow: 0 6px 25px rgba(79, 172, 254, 0.3);
        }

        .loginify-account.nitro {
            border-left: 1px solid rgba(255, 115, 250, 0.3) !important;
            position: relative;
        }









        .loginify-account.nitro:hover {
            border-left-color: rgba(255, 115, 250, 0.5) !important;
        }



        .loginify-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--loginify-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 18px;
            color: white;
            overflow: hidden;
            border: 2px solid rgba(255, 255, 255, 0.15);
            transition: var(--loginify-transition);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            position: relative;
            z-index: 2;
        }

        .loginify-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .loginify-current-indicator {
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 18px;
            height: 18px;
            background: #4facfe;
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: white;
            font-weight: bold;
            z-index: 3;
        }

        .loginify-nitro-indicator {
            position: absolute;
            top: -2px;
            left: -2px;
            width: 22px;
            height: 22px;
            background: linear-gradient(135deg, #FF73FA, #5865F2);
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            z-index: 3;
            animation: loginify-nitro-indicator-pulse 2s infinite;
            box-shadow: 0 2px 10px rgba(255, 115, 250, 0.6);
        }

        @keyframes loginify-nitro-indicator-pulse {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 2px 10px rgba(255, 115, 250, 0.6);
            }
            50% {
                transform: scale(1.1);
                box-shadow: 0 2px 15px rgba(255, 115, 250, 0.9);
            }
        }

        .loginify-account:hover .loginify-avatar {
            transform: scale(1.1);
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }

        .loginify-account-info {
            flex: 1;
            min-width: 0;
            position: relative;
            z-index: 2;
        }

        .loginify-account-name {
            font-weight: 600;
            font-size: 15px;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--loginify-text-primary);
            letter-spacing: -0.01em;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .loginify-discord-username {
            font-size: 12px;
            color: var(--loginify-text-muted);
            font-weight: 500;
            margin-bottom: 2px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .loginify-account-email {
            font-size: 11px;
            color: var(--loginify-text-muted);
            margin-bottom: 4px;
            opacity: 0.8;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .loginify-current-badge {
            background: var(--loginify-success);
            color: white;
            font-size: 10px;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .loginify-nitro-badge {
            background: rgba(255, 115, 250, 0.08);
            color: rgba(255, 115, 250, 0.6);
            font-size: 9px;
            font-weight: 400;
            padding: 1px 4px;
            border-radius: 6px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin-left: 4px;
            border: 1px solid rgba(255, 115, 250, 0.1);
        }

        .loginify-account-status {
            font-size: 13px;
            color: var(--loginify-text-muted);
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: 400;
        }

        .loginify-status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #4facfe;
            box-shadow: 0 0 8px rgba(79, 172, 254, 0.4);
            animation: pulse 2s infinite;
        }

        .loginify-status-dot.current {
            background: #00f2fe;
            box-shadow: 0 0 12px rgba(0, 242, 254, 0.6);
        }

        .loginify-status-dot.nitro {
            background: rgba(255, 115, 250, 0.3);
        }

        .loginify-nitro-status {
            color: rgba(255, 115, 250, 0.5);
            font-weight: 400;
            font-size: 11px;
        }

        .loginify-account-actions {
            display: flex;
            gap: 6px;
            opacity: 0;
            transition: var(--loginify-spring);
            transform: translateX(10px);
            position: relative;
            z-index: 2;
        }

        .loginify-account:hover .loginify-account-actions {
            opacity: 1;
            transform: translateX(0);
        }

        .loginify-action-btn {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: var(--loginify-text-muted);
            cursor: pointer;
            padding: 6px 8px;
            border-radius: 6px;
            transition: var(--loginify-transition);
            font-size: 14px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .loginify-action-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.25);
            color: var(--loginify-text-primary);
            transform: scale(1.1);
        }

        .loginify-action-btn:active {
            transform: scale(0.95);
        }

        .loginify-footer {
            padding: 16px 24px;
            border-top: 1px solid var(--loginify-border);
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 12px;
            background: var(--loginify-bg-glass);
            border-radius: 0 0 var(--loginify-radius) var(--loginify-radius);
        }

        @media (max-width: 700px) {
            .loginify-container {
                width: 95vw;
                height: 85vh;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
            }

            .loginify-title {
                flex-wrap: wrap;
                gap: 8px;
            }

            .loginify-account-counter {
                margin-left: 8px;
                font-size: 12px;
            }

            .loginify-footer {
                grid-template-columns: 1fr;
                gap: 8px;
            }
        }

        .loginify-btn-primary {
            background: var(--loginify-primary);
            color: white;
            border: 2px solid transparent;
            border-radius: var(--loginify-radius-sm);
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--loginify-spring);
            position: relative;
            overflow: hidden;
        }

        .loginify-btn-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s ease;
        }

        .loginify-btn-primary:hover::before {
            left: 100%;
        }

        .loginify-btn-primary:hover {
            background: var(--loginify-primary-hover);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .loginify-btn-primary:active {
            transform: translateY(0) scale(1);
        }

        .loginify-btn-secondary {
            background: var(--loginify-bg-tertiary);
            backdrop-filter: blur(10px);
            color: var(--loginify-text-secondary);
            border: 2px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--loginify-spring);
            position: relative;
            overflow: hidden;
        }

        .loginify-btn-secondary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s ease;
        }

        .loginify-btn-secondary:hover::before {
            left: 100%;
        }

        .loginify-btn-secondary:hover {
            background: var(--loginify-secondary);
            border-color: var(--loginify-border-hover);
            color: white;
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .loginify-btn-secondary:active {
            transform: translateY(0) scale(1);
        }

        .loginify-btn-danger {
            background: #ff4757;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: var(--loginify-radius-sm);
            font-weight: 600;
            cursor: pointer;
            transition: var(--loginify-transition);
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .loginify-btn-danger:hover {
            background: #ff3838;
            box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3);
            transform: translateY(-1px);
        }

        .loginify-danger-zone {
            background: rgba(255, 71, 87, 0.1);
            border: 1px solid rgba(255, 71, 87, 0.3);
            border-radius: var(--loginify-radius-sm);
            padding: 20px;
            margin-top: 20px;
        }

        .loginify-danger-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
        }

        .loginify-danger-text {
            margin: 0;
            color: #ff4757;
            font-size: 13px;
            font-weight: 500;
            line-height: 1.4;
            max-width: 400px;
        }

        .loginify-about {
            padding: 8px 24px 16px;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .loginify-about-text {
            font-size: 11px;
            color: var(--loginify-text-muted);
            opacity: 0.7;
        }

        .loginify-empty {
            text-align: center;
            padding: 40px 20px;
            color: var(--loginify-text-muted);
        }

        .loginify-empty-icon {
            font-size: 48px;
            margin-bottom: 12px;
            opacity: 0.5;
        }

        /* Modal styles */
        .loginify-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000000;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: var(--loginify-transition);
        }

        .loginify-modal.show {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        .loginify-modal-content {
            background: var(--loginify-bg-primary);
            border-radius: var(--loginify-radius);
            border: 1px solid var(--loginify-border);
            box-shadow: var(--loginify-shadow-lg);
            padding: 28px;
            width: 95%;
            max-width: 900px;
            max-height: 90%;
            overflow-y: auto;
            transform: scale(0.9) translateY(20px);
            transition: var(--loginify-spring);
        }

        .loginify-modal.show .loginify-modal-content {
            transform: scale(1) translateY(0);
        }

        .loginify-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px solid var(--loginify-border);
        }

        .loginify-modal-header h3 {
            margin: 0;
            color: var(--loginify-text-primary);
            font-size: 20px;
            font-weight: 700;
        }

        .loginify-close-btn {
            background: var(--loginify-bg-tertiary);
            border: 2px solid var(--loginify-border);
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--loginify-text-muted);
            font-size: 16px;
            font-weight: 700;
            transition: var(--loginify-transition);
        }

        .loginify-close-btn:hover {
            background: var(--loginify-danger);
            border-color: var(--loginify-danger);
            color: white;
            transform: rotate(90deg) scale(1.1);
        }

        .loginify-modal-body {
            /* Container for modal content */
        }

        /* Clean About Modal Styles */
        .loginify-about-clean {
            max-width: 100%;
        }

        .loginify-about-hero {
            text-align: center;
            padding: 40px 0;
            background: linear-gradient(135deg, var(--loginify-primary), var(--loginify-primary-hover));
            border-radius: var(--loginify-radius);
            margin-bottom: 32px;
            position: relative;
            overflow: hidden;
        }

        .loginify-about-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            animation: loginify-hero-shine 3s infinite;
        }

        @keyframes loginify-hero-shine {
            0% { left: -100%; }
            50% { left: 100%; }
            100% { left: 100%; }
        }

        .loginify-hero-icon {
            font-size: 64px;
            margin-bottom: 16px;
            display: inline-block;
            animation: loginify-hero-float 3s ease-in-out infinite;
        }

        @keyframes loginify-hero-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        .loginify-about-hero h1 {
            margin: 0 0 8px 0;
            color: white;
            font-size: 42px;
            font-weight: 800;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            position: relative;
            z-index: 1;
        }

        .loginify-hero-subtitle {
            margin: 0 0 20px 0;
            color: rgba(255, 255, 255, 0.9);
            font-size: 18px;
            font-weight: 500;
            position: relative;
            z-index: 1;
        }

        .loginify-version-tag {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            position: relative;
            z-index: 1;
        }

        .loginify-about-main {
            display: flex;
            flex-direction: column;
            gap: 32px;
        }

        .loginify-description {
            text-align: center;
            padding: 32px;
            background: var(--loginify-bg-glass);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius);
        }

        .loginify-description h2 {
            margin: 0 0 16px 0;
            color: var(--loginify-text-primary);
            font-size: 28px;
            font-weight: 700;
        }

        .loginify-description p {
            margin: 0;
            color: var(--loginify-text-secondary);
            font-size: 16px;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
        }

        .loginify-creator-section {
            padding: 32px;
            background: var(--loginify-bg-glass);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius);
        }

        .loginify-creator-card {
            display: flex;
            align-items: center;
            gap: 24px;
            max-width: 600px;
            margin: 0 auto;
        }

        .loginify-creator-avatar {
            width: 80px;
            height: 80px;
            background: var(--loginify-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 700;
            color: white;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            flex-shrink: 0;
            border: 3px solid var(--loginify-primary-color);
            transition: var(--loginify-transition);
            position: relative;
            overflow: hidden;
        }

        .loginify-creator-avatar.loaded {
            background: var(--loginify-primary);
        }

        .loginify-creator-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            position: relative;
            z-index: 2;
        }

        .loginify-creator-avatar .fallback-text {
            position: relative;
            z-index: 1;
        }

        .loginify-creator-avatar::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, transparent 40%, rgba(102, 126, 234, 0.1) 100%);
            border-radius: 50%;
            z-index: 1;
        }

        .loginify-creator-avatar:hover {
            transform: scale(1.05);
            box-shadow: 0 12px 30px rgba(102, 126, 234, 0.3);
        }

        .loginify-creator-details h3 {
            margin: 0 0 8px 0;
            color: var(--loginify-text-primary);
            font-size: 24px;
            font-weight: 700;
        }

        .loginify-creator-details p {
            margin: 0 0 20px 0;
            color: var(--loginify-text-secondary);
            line-height: 1.5;
        }

        .loginify-website-btn {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 12px 24px;
            background: var(--loginify-primary);
            color: white;
            text-decoration: none;
            border-radius: var(--loginify-radius-sm);
            font-weight: 600;
            font-size: 16px;
            transition: var(--loginify-transition);
            position: relative;
            overflow: hidden;
        }

        .loginify-website-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: var(--loginify-transition);
        }

        .loginify-website-btn:hover::before {
            left: 100%;
        }

        .loginify-website-btn:hover {
            background: var(--loginify-primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .loginify-btn-icon {
            font-size: 18px;
        }

        .loginify-btn-arrow {
            font-size: 18px;
            transition: var(--loginify-transition);
        }

        .loginify-website-btn:hover .loginify-btn-arrow {
            transform: translateX(4px);
        }

        .loginify-features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            padding: 32px;
            background: var(--loginify-bg-glass);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius);
        }

        .loginify-feature-card {
            padding: 24px;
            background: var(--loginify-bg-tertiary);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius);
            transition: var(--loginify-transition);
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .loginify-feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--loginify-primary);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }

        .loginify-feature-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            border-color: var(--loginify-primary-color);
        }

        .loginify-feature-card:hover::before {
            transform: scaleX(1);
        }

        .loginify-feature-icon {
            font-size: 32px;
            margin-bottom: 16px;
            display: block;
        }

        .loginify-feature-card h4 {
            margin: 0 0 12px 0;
            color: var(--loginify-text-primary);
            font-size: 18px;
            font-weight: 600;
        }

        .loginify-feature-card p {
            margin: 0;
            color: var(--loginify-text-secondary);
            line-height: 1.5;
            font-size: 14px;
        }

        .loginify-about-footer-clean {
            text-align: center;
            padding: 24px 0;
            color: var(--loginify-text-muted);
            font-size: 14px;
            margin-top: 32px;
            border-top: 1px solid var(--loginify-border);
        }

        /* Responsive */
        @media (max-width: 600px) {
            .loginify-creator-card {
                flex-direction: column;
                text-align: center;
            }

            .loginify-about-hero h1 {
                font-size: 32px;
            }

            .loginify-hero-icon {
                font-size: 48px;
            }

            .loginify-features-grid {
                grid-template-columns: 1fr;
                gap: 16px;
                padding: 20px;
            }
        }

        /* Enhanced Settings Styles */
        .loginify-settings-header {
            text-align: center;
            margin-bottom: 32px;
            padding: 24px;
            background: var(--loginify-bg-glass);
            border-radius: var(--loginify-radius);
            border: 1px solid var(--loginify-border);
        }

        .loginify-settings-header h3 {
            margin: 0 0 8px 0;
            background: var(--loginify-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 24px;
            font-weight: 700;
        }

        .loginify-settings-header p {
            margin: 0;
            color: var(--loginify-text-secondary);
            font-size: 14px;
        }

        .loginify-preset-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 12px;
            margin-top: 12px;
        }

        .loginify-preset-card {
            padding: 16px 12px;
            background: var(--loginify-bg-tertiary);
            border: 2px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            cursor: pointer;
            transition: var(--loginify-transition);
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .loginify-preset-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s ease;
        }

        .loginify-preset-card:hover::before {
            left: 100%;
        }

        .loginify-preset-card:hover {
            transform: translateY(-2px);
            border-color: var(--loginify-primary-color);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .loginify-preset-card.active {
            border-color: var(--loginify-primary-color);
            background: var(--loginify-bg-glass);
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
        }

        .loginify-preset-colors {
            display: flex;
            gap: 4px;
            justify-content: center;
            margin-bottom: 8px;
        }

        .loginify-preset-colors span {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .loginify-preset-card span:last-child {
            font-size: 12px;
            font-weight: 600;
            color: var(--loginify-text-primary);
        }

        .loginify-color-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
            margin-top: 12px;
        }

        .loginify-visual-controls {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            margin-top: 12px;
        }

        .loginify-slider-control {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .loginify-slider-control label {
            min-width: 140px;
            font-weight: 600;
            color: var(--loginify-text-primary);
            font-size: 14px;
        }

        .loginify-slider-control input[type="range"] {
            flex: 1;
            height: 6px;
            background: var(--loginify-bg-tertiary);
            border-radius: 3px;
            outline: none;
            cursor: pointer;
        }

        .loginify-slider-control input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            background: var(--loginify-primary);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .loginify-slider-control span {
            min-width: 50px;
            text-align: right;
            font-weight: 600;
            color: var(--loginify-text-secondary);
            font-size: 13px;
        }

        .loginify-style-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-top: 12px;
        }

        .loginify-style-option label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--loginify-text-primary);
            font-size: 14px;
        }

        .loginify-effects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
            margin-top: 12px;
        }

        .loginify-toggle-card {
            display: block;
            padding: 20px;
            background: var(--loginify-bg-tertiary);
            border: 2px solid var(--loginify-border);
            border-radius: var(--loginify-radius);
            cursor: pointer;
            transition: var(--loginify-transition);
            position: relative;
        }

        .loginify-toggle-card:hover {
            border-color: var(--loginify-primary-color);
            transform: translateY(-2px);
        }

        .loginify-toggle-card input {
            position: absolute;
            opacity: 0;
        }

        .loginify-toggle-card input:checked + .loginify-toggle-content {
            color: var(--loginify-primary-color);
        }

        .loginify-toggle-content {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .loginify-toggle-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }

        .loginify-toggle-label {
            font-weight: 600;
            font-size: 16px;
        }

        .loginify-toggle-desc {
            font-size: 12px;
            color: var(--loginify-text-muted);
        }

        .loginify-behavior-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 20px;
        }

        .loginify-behavior-option label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--loginify-text-primary);
            font-size: 14px;
        }

        .loginify-modern-checkbox {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: var(--loginify-bg-tertiary);
            border-radius: var(--loginify-radius-sm);
            cursor: pointer;
            transition: var(--loginify-transition);
            margin-bottom: 8px;
        }

        .loginify-modern-checkbox:hover {
            background: var(--loginify-bg-glass);
        }

        .loginify-modern-checkbox input {
            display: none;
        }

        .loginify-checkbox-custom {
            width: 20px;
            height: 20px;
            border: 2px solid var(--loginify-border);
            border-radius: 4px;
            position: relative;
            transition: var(--loginify-transition);
        }

        .loginify-modern-checkbox input:checked + .loginify-checkbox-custom {
            background: var(--loginify-primary);
            border-color: var(--loginify-primary-color);
        }

        .loginify-modern-checkbox input:checked + .loginify-checkbox-custom::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: bold;
            font-size: 12px;
        }

        .loginify-btn-accent {
            background: var(--loginify-accent);
            color: white;
            border: 2px solid transparent;
            padding: 12px 24px;
            border-radius: var(--loginify-radius-sm);
            font-weight: 600;
            cursor: pointer;
            transition: var(--loginify-transition);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .loginify-btn-accent:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
        }

        .loginify-theme-actions {
            display: flex;
            gap: 8px;
            justify-content: center;
        }

        /* Validation Modal Styles */
        .loginify-validation-modal {
            max-width: 600px;
            width: 100%;
        }

        .loginify-validation-header {
            text-align: center;
            margin-bottom: 24px;
        }

        .loginify-validation-header h3 {
            margin: 0 0 8px 0;
            background: var(--loginify-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 20px;
        }

        .loginify-validation-progress {
            margin-bottom: 24px;
        }

        .loginify-progress-bar {
            width: 100%;
            height: 8px;
            background: var(--loginify-bg-tertiary);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 8px;
        }

        .loginify-progress-fill {
            height: 100%;
            background: var(--loginify-primary);
            width: 0%;
            transition: width 0.3s ease;
        }

        .loginify-progress-text {
            text-align: center;
            font-weight: 600;
            color: var(--loginify-text-secondary);
        }

        .loginify-validation-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 20px;
        }

        .loginify-stat {
            text-align: center;
            padding: 16px;
            background: var(--loginify-bg-tertiary);
            border-radius: var(--loginify-radius-sm);
            border: 2px solid var(--loginify-border);
        }

        .loginify-stat.valid {
            border-color: #4facfe;
        }

        .loginify-stat.invalid {
            border-color: #ff6b6b;
        }

        .loginify-stat.updated {
            border-color: #feca57;
        }

        .loginify-stat-number {
            display: block;
            font-size: 24px;
            font-weight: 700;
            color: var(--loginify-text-primary);
        }

        .loginify-stat-label {
            font-size: 12px;
            color: var(--loginify-text-secondary);
            margin-top: 4px;
        }

        .loginify-validation-log {
            height: 200px;
            overflow-y: auto;
            background: var(--loginify-bg-tertiary);
            border-radius: var(--loginify-radius-sm);
            padding: 16px;
            margin-bottom: 20px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            border: 1px solid var(--loginify-border);
        }

        .loginify-log-entry {
            margin-bottom: 4px;
            padding: 2px 0;
        }

        .loginify-log-entry.success {
            color: #4facfe;
        }

        .loginify-log-entry.error {
            color: #ff6b6b;
        }

        .loginify-log-entry.warning {
            color: #feca57;
        }

        .loginify-log-entry.info {
            color: var(--loginify-text-secondary);
        }

        .loginify-validation-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        /* Countdown Timer Styles */
        .loginify-validation-countdown {
            padding: 12px 20px;
            background: var(--loginify-bg-glass);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            margin: 16px 20px 8px 20px;
            backdrop-filter: blur(10px);
            position: relative;
            overflow: hidden;
        }

        .loginify-validation-countdown::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
            animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        .loginify-countdown-text {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            position: relative;
            z-index: 1;
            margin-bottom: 4px;
        }

        .loginify-countdown-info {
            display: flex;
            justify-content: center;
            position: relative;
            z-index: 1;
        }

        .loginify-countdown-description {
            font-size: 10px;
            color: var(--loginify-text-muted);
            text-align: center;
            opacity: 0.8;
            font-style: italic;
        }

        .loginify-countdown-label {
            font-size: 12px;
            font-weight: 600;
            color: var(--loginify-text-secondary);
        }

        .loginify-countdown-timer {
            font-size: 12px;
            font-weight: 700;
            color: var(--loginify-primary-color);
            background: var(--loginify-bg-tertiary);
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid var(--loginify-border);
            min-width: 80px;
            text-align: center;
            font-family: 'Courier New', monospace;
        }

        .loginify-countdown-timer.urgent {
            color: #ff6b6b;
            border-color: #ff6b6b;
            animation: pulse 2s infinite;
        }

        .loginify-countdown-timer.completed {
            color: #4facfe;
            border-color: #4facfe;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        /* Form styles */
        .loginify-form-group {
            margin-bottom: 20px;
        }

        .loginify-form-hint {
            margin-top: 8px;
            font-size: 12px;
            color: var(--loginify-text-muted);
            line-height: 1.4;
            padding: 8px 12px;
            background: var(--loginify-bg-tertiary);
            border-radius: var(--loginify-radius-sm);
            border-left: 3px solid var(--loginify-warning);
        }

        .loginify-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--loginify-text-primary);
            font-size: 14px;
        }

        .loginify-input, .loginify-select {
            width: 100%;
            background: var(--loginify-bg-tertiary);
            border: 2px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            padding: 12px 16px;
            color: var(--loginify-text-primary);
            font-size: 14px;
            transition: var(--loginify-transition);
            box-sizing: border-box;
        }

        .loginify-input:focus, .loginify-select:focus {
            outline: none;
            border-color: var(--loginify-primary-solid);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
            background: var(--loginify-bg-secondary);
        }

        .loginify-token-input-wrapper {
            position: relative;
        }

        .loginify-token-actions {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            gap: 4px;
        }

        .loginify-token-btn {
            background: var(--loginify-primary-solid);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            transition: var(--loginify-transition);
        }

        .loginify-token-btn:hover {
            background: var(--loginify-primary-hover);
            transform: scale(1.05);
        }

        .loginify-form-hint {
            font-size: 12px;
            color: var(--loginify-text-muted);
            margin-top: 6px;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .loginify-form-hint code {
            background: var(--loginify-bg-tertiary);
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 11px;
        }

        .loginify-checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        /* Save Options Styles */
        .loginify-save-options {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .loginify-save-mode {
            background: var(--loginify-bg-tertiary);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            padding: 16px;
        }

        .loginify-custom-save {
            background: var(--loginify-bg-glass);
            border: 2px solid var(--loginify-primary-solid);
            border-radius: var(--loginify-radius-sm);
            padding: 16px;
            margin-top: 12px;
        }

        .loginify-custom-criteria {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .loginify-save-settings {
            background: var(--loginify-bg-tertiary);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .loginify-checkbox {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 14px;
            color: var(--loginify-text-secondary);
        }

        .loginify-checkbox input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: var(--loginify-primary-solid);
            cursor: pointer;
        }

        .loginify-form-actions {
            display: flex;
            gap: 12px;
            margin-top: 24px;
        }

        /* Settings styles */
        .loginify-settings h3 {
            margin: 0 0 24px 0;
            color: var(--loginify-text-primary);
            font-size: 20px;
            font-weight: 700;
        }

        .loginify-setting-group {
            margin-bottom: 24px;
        }

        .loginify-setting-label {
            display: block;
            margin-bottom: 12px;
            font-weight: 600;
            color: var(--loginify-text-primary);
            font-size: 15px;
        }

        .loginify-color-inputs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .loginify-color-input {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .loginify-color-input label {
            font-size: 13px;
            color: var(--loginify-text-secondary);
            font-weight: 500;
        }

        .loginify-color-input input[type="color"] {
            width: 100%;
            height: 40px;
            border: 2px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            background: none;
            cursor: pointer;
        }

        .loginify-setting-actions {
            display: flex;
            gap: 12px;
            margin-top: 32px;
        }

        /* Import styles */
        .loginify-import h3 {
            margin: 0 0 16px 0;
            color: var(--loginify-text-primary);
        }

        .loginify-import p {
            margin: 0 0 24px 0;
            color: var(--loginify-text-secondary);
            line-height: 1.5;
        }

        .loginify-file-drop {
            border: 2px dashed var(--loginify-border);
            border-radius: var(--loginify-radius);
            padding: 40px 20px;
            text-align: center;
            cursor: pointer;
            transition: var(--loginify-transition);
            margin-bottom: 24px;
        }

        .loginify-file-drop:hover, .loginify-file-drop.drag-over {
            border-color: var(--loginify-primary-solid);
            background: var(--loginify-bg-glass);
        }

        .loginify-file-drop-icon {
            font-size: 48px;
            margin-bottom: 12px;
            opacity: 0.7;
        }

        .loginify-file-drop-text {
            color: var(--loginify-text-secondary);
            font-size: 14px;
            line-height: 1.5;
        }

        .loginify-import-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        /* Notification styles */
        .loginify-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--loginify-bg-primary);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            padding: 16px 20px;
            color: var(--loginify-text-primary);
            font-size: 14px;
            z-index: 1000001;
            transform: translateX(400px);
            transition: var(--loginify-spring);
            backdrop-filter: blur(20px);
            box-shadow: var(--loginify-shadow);
            max-width: 350px;
        }

        .loginify-notification.show {
            transform: translateX(0);
        }

        .loginify-notification.success {
            border-left: 4px solid #4facfe;
            background: linear-gradient(135deg, var(--loginify-bg-primary), rgba(79, 172, 254, 0.1));
        }

        .loginify-notification.error {
            border-left: 4px solid #ff6b6b;
            background: linear-gradient(135deg, var(--loginify-bg-primary), rgba(255, 107, 107, 0.1));
        }

        .loginify-notification.warning {
            border-left: 4px solid #feca57;
            background: linear-gradient(135deg, var(--loginify-bg-primary), rgba(254, 202, 87, 0.1));
        }

        .loginify-notification.info {
            border-left: 4px solid #a8edea;
            background: linear-gradient(135deg, var(--loginify-bg-primary), rgba(168, 237, 234, 0.1));
        }

        .loginify-notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .loginify-notification-icon {
            font-size: 18px;
            flex-shrink: 0;
        }

        .loginify-notification-text {
            flex: 1;
            font-weight: 500;
        }

        /* Responsive design */
        @media (max-width: 520px) {
            .loginify-container {
                width: calc(100vw - 20px);
                max-width: none;
                left: 10px !important;
                right: 10px;
            }

            .loginify-toggle {
                bottom: 10px;
                right: 10px;
                width: 56px;
                height: 56px;
                font-size: 24px;
            }

            .loginify-header {
                padding: 18px 20px;
            }

            .loginify-search, .loginify-accounts, .loginify-footer {
                padding-left: 20px;
                padding-right: 20px;
            }

            .loginify-account {
                padding: 14px 16px;
                gap: 12px;
            }

            .loginify-avatar {
                width: 40px;
                height: 40px;
                font-size: 16px;
            }

            .loginify-color-inputs {
                grid-template-columns: 1fr;
            }

            .loginify-form-actions, .loginify-setting-actions, .loginify-import-actions {
                flex-direction: column;
            }
        }

        /* Animation classes */
        @keyframes loginify-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        .loginify-pulse {
            animation: loginify-pulse 0.6s ease-in-out;
        }

        @keyframes loginify-bounce {
            0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
            40%, 43% { transform: translate3d(0, -8px, 0); }
            70% { transform: translate3d(0, -4px, 0); }
            90% { transform: translate3d(0, -2px, 0); }
        }

        .loginify-bounce {
            animation: loginify-bounce 1s ease-in-out;
        }

        /* Token Checker Styles */
        .loginify-token-checker {
            width: 100%;
            max-width: 800px;
        }

        .loginify-checker-header h3 {
            margin: 0 0 8px 0;
            color: var(--loginify-text-primary);
            font-size: 24px;
            font-weight: 700;
        }

        .loginify-checker-header p {
            margin: 0 0 24px 0;
            color: var(--loginify-text-secondary);
            font-size: 14px;
        }

        .loginify-checker-tabs {
            display: flex;
            gap: 4px;
            margin-bottom: 24px;
            border-bottom: 2px solid var(--loginify-border);
        }

        .loginify-tab-btn {
            background: transparent;
            border: none;
            color: var(--loginify-text-muted);
            cursor: pointer;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            border-radius: var(--loginify-radius-sm) var(--loginify-radius-sm) 0 0;
            transition: var(--loginify-transition);
            position: relative;
        }

        .loginify-tab-btn:hover {
            background: var(--loginify-bg-glass);
            color: var(--loginify-text-secondary);
        }

        .loginify-tab-btn.active {
            background: var(--loginify-primary);
            color: white;
            transform: translateY(-2px);
        }

        .loginify-tab-btn.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--loginify-primary-solid);
        }

        .loginify-tab-content {
            min-height: 400px;
        }

        .loginify-tab-panel {
            display: none;
        }

        .loginify-tab-panel.active {
            display: block;
        }

        /* Input Tab Styles */
        .loginify-input-methods {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .loginify-input-method {
            background: var(--loginify-bg-glass);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            padding: 20px;
        }

        .loginify-input-divider {
            text-align: center;
            color: var(--loginify-text-muted);
            font-weight: 600;
            font-size: 14px;
            position: relative;
            margin: 16px 0;
        }

        .loginify-input-divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: var(--loginify-border);
            z-index: 1;
        }

        .loginify-input-divider::after {
            content: 'OR';
            background: var(--loginify-bg-primary);
            padding: 0 16px;
            position: relative;
            z-index: 2;
        }

        .loginify-file-upload {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: 8px;
        }

        .loginify-upload-btn {
            background: var(--loginify-primary);
            color: white;
            border: none;
            border-radius: var(--loginify-radius-sm);
            padding: 10px 16px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--loginify-transition);
        }

        .loginify-upload-btn:hover {
            background: var(--loginify-primary-hover);
            transform: translateY(-1px);
        }

        .loginify-file-info {
            color: var(--loginify-text-muted);
            font-size: 13px;
        }

        .loginify-token-textarea, .loginify-proxy-textarea {
            width: 100%;
            height: 120px;
            background: var(--loginify-bg-tertiary);
            border: 2px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            padding: 12px;
            color: var(--loginify-text-primary);
            font-size: 13px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            resize: vertical;
            transition: var(--loginify-transition);
            box-sizing: border-box;
        }

        .loginify-token-textarea:focus, .loginify-proxy-textarea:focus {
            outline: none;
            border-color: var(--loginify-primary-solid);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
        }

        .loginify-token-count, .loginify-proxy-count {
            margin-top: 8px;
            color: var(--loginify-text-secondary);
            font-size: 13px;
            font-weight: 600;
        }

        /* Proxy Tab Styles */
        .loginify-proxy-config {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .loginify-proxy-settings {
            background: var(--loginify-bg-glass);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            padding: 20px;
            margin-top: 16px;
        }

        /* Settings Tab Styles */
        .loginify-checker-settings {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .loginify-rate-controls {
            background: var(--loginify-bg-glass);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .loginify-rate-setting {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .loginify-rate-setting label {
            color: var(--loginify-text-secondary);
            font-size: 14px;
            min-width: 200px;
        }

        .loginify-rate-setting input[type="range"] {
            flex: 1;
            height: 6px;
            background: var(--loginify-bg-tertiary);
            border-radius: 3px;
            outline: none;
            -webkit-appearance: none;
        }

        .loginify-rate-setting input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            background: var(--loginify-primary-solid);
            border-radius: 50%;
            cursor: pointer;
        }

        .loginify-rate-setting span {
            color: var(--loginify-primary-solid);
            font-weight: 600;
            min-width: 60px;
            text-align: right;
        }

        /* Results Tab Styles */
        .loginify-results-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .loginify-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 16px;
        }

        .loginify-stat-card {
            background: var(--loginify-bg-glass);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            padding: 16px;
            text-align: center;
            transition: var(--loginify-transition);
        }

        .loginify-stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .loginify-stat-card.valid {
            border-color: #4facfe;
            background: linear-gradient(135deg, var(--loginify-bg-glass), rgba(79, 172, 254, 0.1));
        }

        .loginify-stat-card.invalid {
            border-color: #ff6b6b;
            background: linear-gradient(135deg, var(--loginify-bg-glass), rgba(255, 107, 107, 0.1));
        }

        .loginify-stat-card.nitro {
            border-color: #feca57;
            background: linear-gradient(135deg, var(--loginify-bg-glass), rgba(254, 202, 87, 0.1));
        }

        .loginify-stat-card.verified {
            border-color: #48cae4;
            background: linear-gradient(135deg, var(--loginify-bg-glass), rgba(72, 202, 228, 0.1));
        }

        .loginify-stat-card.premium {
            border-color: #ff6b6b;
            background: linear-gradient(135deg, var(--loginify-bg-glass), rgba(255, 107, 107, 0.1));
        }

        .loginify-stat-card.saved {
            border-color: #51cf66;
            background: linear-gradient(135deg, var(--loginify-bg-glass), rgba(81, 207, 102, 0.1));
        }

        .loginify-detailed-stats {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid var(--loginify-border);
        }

        .loginify-stat-number {
            font-size: 28px;
            font-weight: 700;
            color: var(--loginify-text-primary);
            margin-bottom: 4px;
        }

        .loginify-stat-label {
            font-size: 12px;
            color: var(--loginify-text-muted);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .loginify-progress-section {
            background: var(--loginify-bg-glass);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            padding: 20px;
        }

        .loginify-progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            color: var(--loginify-text-secondary);
            font-weight: 600;
        }

        .loginify-progress-bar {
            width: 100%;
            height: 8px;
            background: var(--loginify-bg-tertiary);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 12px;
        }

        .loginify-progress-fill {
            height: 100%;
            background: var(--loginify-primary);
            border-radius: 4px;
            transition: width 0.3s ease;
            width: 0%;
        }

        .loginify-time-stats {
            display: flex;
            justify-content: space-between;
            color: var(--loginify-text-muted);
            font-size: 13px;
        }

        .loginify-results-log {
            background: var(--loginify-bg-tertiary);
            border: 1px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            height: 200px;
            overflow-y: auto;
            padding: 16px;
        }

        .loginify-results-log::-webkit-scrollbar {
            width: 8px;
        }

        .loginify-results-log::-webkit-scrollbar-track {
            background: transparent;
        }

        .loginify-results-log::-webkit-scrollbar-thumb {
            background: var(--loginify-border);
            border-radius: 4px;
        }

        .loginify-log-placeholder {
            color: var(--loginify-text-muted);
            text-align: center;
            padding: 40px;
            font-style: italic;
        }

        .loginify-log-header {
            color: var(--loginify-primary-solid);
            font-weight: 600;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--loginify-border);
        }

        .loginify-log-entry {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 12px;
            padding: 8px;
            border-radius: var(--loginify-radius-sm);
            font-size: 13px;
        }

        .loginify-log-entry.valid {
            background: rgba(79, 172, 254, 0.1);
            border-left: 3px solid #4facfe;
        }

        .loginify-log-entry.invalid {
            background: rgba(255, 107, 107, 0.1);
            border-left: 3px solid #ff6b6b;
        }

        .loginify-log-entry.error {
            background: rgba(254, 202, 87, 0.1);
            border-left: 3px solid #feca57;
        }

        .loginify-log-icon {
            font-size: 16px;
            margin-top: 1px;
        }

        .loginify-log-content {
            flex: 1;
        }

        .loginify-log-token {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            color: var(--loginify-text-primary);
            font-weight: 600;
            margin-bottom: 2px;
        }

        .loginify-log-details {
            color: var(--loginify-text-muted);
            font-size: 12px;
        }

        .loginify-export-buttons {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;
        }

        .loginify-export-btn {
            background: var(--loginify-bg-tertiary);
            color: var(--loginify-text-secondary);
            border: 2px solid var(--loginify-border);
            border-radius: var(--loginify-radius-sm);
            padding: 12px 16px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--loginify-transition);
        }

        .loginify-export-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .loginify-export-btn:not(:disabled):hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .loginify-export-btn.valid:not(:disabled) {
            border-color: #4facfe;
            color: #4facfe;
        }

        .loginify-export-btn.valid:not(:disabled):hover {
            background: #4facfe;
            color: white;
        }

        .loginify-export-btn.invalid:not(:disabled) {
            border-color: #ff6b6b;
            color: #ff6b6b;
        }

        .loginify-export-btn.invalid:not(:disabled):hover {
            background: #ff6b6b;
            color: white;
        }

        .loginify-export-btn.nitro:not(:disabled) {
            border-color: #feca57;
            color: #feca57;
        }

        .loginify-export-btn.nitro:not(:disabled):hover {
            background: #feca57;
            color: white;
        }

        .loginify-export-btn.all:not(:disabled) {
            border-color: var(--loginify-primary-solid);
            color: var(--loginify-primary-solid);
        }

        .loginify-export-btn.all:not(:disabled):hover {
            background: var(--loginify-primary-solid);
            color: white;
        }

        .loginify-checker-actions {
            display: flex;
            gap: 12px;
            margin-top: 24px;
            justify-content: center;
        }

        /* Responsive Token Checker */
        @media (max-width: 768px) {
            .loginify-checker-tabs {
                flex-wrap: wrap;
            }

            .loginify-tab-btn {
                flex: 1;
                min-width: 120px;
            }

            .loginify-stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .loginify-export-buttons {
                grid-template-columns: 1fr;
            }

            .loginify-rate-setting {
                flex-direction: column;
                align-items: stretch;
                gap: 8px;
            }

            .loginify-rate-setting label {
                min-width: auto;
            }

            .loginify-checker-actions {
                flex-direction: column;
            }
        }

        .dtl-account-actions {
            display: flex;
            gap: 6px;
            opacity: 0;
            transition: var(--dtl-spring);
            transform: translateX(10px);
        }

        .dtl-account:hover .dtl-account-actions {
            opacity: 1;
            transform: translateX(0);
        }

        .dtl-action-btn {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: var(--dtl-text-muted);
            cursor: pointer;
            padding: 6px 8px;
            border-radius: 6px;
            transition: var(--dtl-transition);
            font-size: 14px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .dtl-action-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.25);
            color: var(--dtl-text-primary);
            transform: scale(1.1);
        }

        .dtl-action-btn:active {
            transform: scale(0.95);
        }

        .dtl-footer {
            padding: 16px 24px;
            border-top: 1px solid var(--dtl-border);
            display: flex;
            gap: 12px;
            background: var(--dtl-bg-glass);
            border-radius: 0 0 var(--dtl-radius) var(--dtl-radius);
        }

        .dtl-btn-primary {
            background: var(--dtl-primary);
            color: white;
            border: 2px solid transparent;
            border-radius: var(--dtl-radius-sm);
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--dtl-spring);
            flex: 1;
            position: relative;
            overflow: hidden;
        }

        .dtl-btn-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s ease;
        }

        .dtl-btn-primary:hover::before {
            left: 100%;
        }

        .dtl-btn-primary:hover {
            background: var(--dtl-primary-hover);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .dtl-btn-primary:active {
            transform: translateY(0) scale(1);
        }

        .dtl-btn-secondary {
            background: var(--dtl-bg-tertiary);
            backdrop-filter: blur(10px);
            color: var(--dtl-text-secondary);
            border: 2px solid var(--dtl-border);
            border-radius: var(--dtl-radius-sm);
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--dtl-spring);
            flex: 1;
            position: relative;
            overflow: hidden;
        }

        .dtl-btn-secondary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s ease;
        }

        .dtl-btn-secondary:hover::before {
            left: 100%;
        }

        .dtl-btn-secondary:hover {
            background: var(--dtl-secondary);
            border-color: var(--dtl-border-hover);
            color: white;
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .dtl-btn-secondary:active {
            transform: translateY(0) scale(1);
        }

        .dtl-empty {
            text-align: center;
            padding: 40px 20px;
            color: var(--dtl-text-muted);
        }

        .dtl-empty-icon {
            font-size: 48px;
            margin-bottom: 12px;
            opacity: 0.5;
        }

        .dtl-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000000;
            opacity: 0;
            visibility: hidden;
            transition: var(--dtl-transition);
        }

        .dtl-modal.show {
            opacity: 1;
            visibility: visible;
        }

        .dtl-modal-content {
            background: var(--dtl-bg-primary);
            border-radius: var(--dtl-radius);
            border: 1px solid var(--dtl-border);
            box-shadow: var(--dtl-shadow);
            padding: 24px;
            width: 90%;
            max-width: 500px;
            max-height: 80%;
            overflow-y: auto;
            transform: scale(0.9);
            transition: var(--dtl-transition);
        }

        .dtl-modal.show .dtl-modal-content {
            transform: scale(1);
        }

        .dtl-form-group {
            margin-bottom: 16px;
        }

        .dtl-label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: var(--dtl-text-primary);
        }

        .dtl-input {
            width: 100%;
            background: var(--dtl-bg-tertiary);
            border: 1px solid var(--dtl-border);
            border-radius: 6px;
            padding: 10px 12px;
            color: var(--dtl-text-primary);
            font-size: 14px;
            transition: var(--dtl-transition);
            box-sizing: border-box;
        }

        .dtl-input:focus {
            outline: none;
            border-color: var(--dtl-primary);
            box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.3);
        }

        .loginify-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 64px;
            height: 64px;
            background: var(--loginify-primary);
            backdrop-filter: blur(25px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            color: white;
            font-size: 28px;
            cursor: pointer;
            z-index: 999998;
            transition: var(--loginify-spring);
            box-shadow: var(--loginify-shadow-lg);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            will-change: transform;
        }

        .loginify-toggle::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
            transition: left 0.7s ease;
        }

        .loginify-toggle:hover::before {
            left: 100%;
        }

        .loginify-toggle:hover {
            background: var(--loginify-primary);
            border-color: rgba(255, 255, 255, 0.4);
            transform: scale(1.2) rotate(8deg);
            box-shadow: var(--loginify-shadow-xl);
        }

        .loginify-toggle:active {
            transform: scale(1.1) rotate(4deg);
        }

        .loginify-toggle.hidden {
            opacity: 0;
            transform: scale(0.7) rotate(-15deg);
            pointer-events: none;
        }

        .dtl-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--dtl-bg-primary);
            border: 1px solid var(--dtl-border);
            border-radius: 8px;
            padding: 12px 16px;
            color: var(--dtl-text-primary);
            font-size: 14px;
            z-index: 1000001;
            transform: translateX(400px);
            transition: var(--dtl-transition);
            backdrop-filter: blur(20px);
        }

        .dtl-notification.show {
            transform: translateX(0);
        }

        .dtl-notification.success {
            border-left: 4px solid var(--dtl-success);
        }

        .dtl-notification.error {
            border-left: 4px solid var(--dtl-danger);
        }

        .dtl-notification.warning {
            border-left: 4px solid var(--dtl-warning);
        }

        @media (max-width: 480px) {
            .dtl-container {
                width: calc(100vw - 40px);
                max-width: none;
            }
        }

        @keyframes dtl-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        .dtl-pulse {
            animation: dtl-pulse 0.6s ease-in-out;
        }
    `);

    // Utility functions
    const utils = {
        generateId: () => Math.random().toString(36).substr(2, 9),

        escapeHtml: (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        validateToken: (token) => {
            // Updated token validation for modern Discord tokens
            const cleanToken = token.trim();
            const patterns = [
                // Modern user tokens (more flexible lengths)
                /^[A-Za-z0-9_-]{24,32}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27,39}$/,
                // Bot tokens
                /^Bot [A-Za-z0-9_-]{24,32}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27,39}$/,
                // Legacy format fallback
                /^[A-Za-z0-9_-]{59,70}$/
            ];
            return patterns.some(pattern => pattern.test(cleanToken)) && cleanToken.length > 50;
        },

        getCurrentToken: () => {
            try {
                // Try to get token from localStorage
                const token = localStorage.getItem('token');
                if (token) {
                    return token.replace(/"/g, '');
                }
                return null;
            } catch (error) {
                console.error('Failed to get current token:', error);
                return null;
            }
        },

        fetchUserData: async (token) => {
            try {
                const response = await fetch(`${CONFIG.discord.api}/users/@me`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    return {
                        id: userData.id,
                        username: userData.username,
                        discriminator: userData.discriminator,
                        avatar: userData.avatar,
                        banner: userData.banner,
                        email: userData.email,
                        verified: userData.verified,
                        globalName: userData.global_name,
                        premium_type: userData.premium_type || 0
                    };
                }
                return null;
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                return null;
            }
        },

        getAvatarUrl: (userId, avatarHash, size = 128) => {
            if (!avatarHash) return `${CONFIG.discord.cdn}/embed/avatars/${userId % 5}.png`;
            const extension = avatarHash.startsWith('a_') ? 'gif' : 'png';
            return `${CONFIG.discord.cdn}/avatars/${userId}/${avatarHash}.${extension}?size=${size}`;
        },

        updateTheme: (primaryColor, secondaryColor, accentColor = '#ff6b6b') => {
            // Update the main CSS variables used by components with !important
            document.documentElement.style.setProperty('--loginify-primary-color', primaryColor, 'important');
            document.documentElement.style.setProperty('--loginify-secondary-color', secondaryColor, 'important');
            document.documentElement.style.setProperty('--loginify-accent-color', accentColor, 'important');

            // Update derived variables that depend on the main ones
            document.documentElement.style.setProperty('--loginify-primary', `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`, 'important');
            document.documentElement.style.setProperty('--loginify-primary-solid', primaryColor, 'important');
            document.documentElement.style.setProperty('--loginify-accent', accentColor, 'important');

            // Also set on body as backup
            document.body.style.setProperty('--loginify-primary-color', primaryColor, 'important');
            document.body.style.setProperty('--loginify-secondary-color', secondaryColor, 'important');
            document.body.style.setProperty('--loginify-accent-color', accentColor, 'important');

            // Force a repaint to apply changes immediately
            document.body.offsetHeight;

            console.log('🎨 Theme applied with !important:', { primaryColor, secondaryColor, accentColor });
        },

        showNotification: (message, type = 'success', duration = 3000) => {
            if (!state.settings.showNotifications) return;

            const notification = document.createElement('div');
            notification.className = `loginify-notification ${type}`;
            notification.innerHTML = `
                <div class="loginify-notification-content">
                    <span class="loginify-notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                    <span class="loginify-notification-text">${message}</span>
                </div>
            `;
            document.body.appendChild(notification);

            setTimeout(() => notification.classList.add('show'), 100);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, duration);
        },

        saveData: () => {
            GM_setValue(CONFIG.storageKeys.accounts, state.accounts);
            GM_setValue(CONFIG.storageKeys.settings, state.settings);
            GM_setValue(CONFIG.storageKeys.position, state.position);
            GM_setValue(CONFIG.storageKeys.currentUser, state.currentUser);
        },

        // Token validation system
        validateToken: async (token) => {
            try {
                const response = await fetch('https://discord.com/api/v10/users/@me', {
                    headers: {
                        'Authorization': token
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    return {
                        valid: true,
                        user: userData
                    };
                } else {
                    return { valid: false, error: response.status };
                }
            } catch (error) {
                return { valid: false, error: error.message };
            }
        },

        validateAllTokens: async () => {
            const validationModal = `
                <div class="loginify-validation-modal">
                    <div class="loginify-validation-header">
                        <h3>🔄 Validating All Tokens</h3>
                        <p>Checking ${state.accounts.length} accounts for validity...</p>
                    </div>
                    <div class="loginify-validation-progress">
                        <div class="loginify-progress-bar">
                            <div class="loginify-progress-fill" id="validationProgress"></div>
                        </div>
                        <div class="loginify-progress-text">
                            <span id="validationCount">0</span> / ${state.accounts.length} checked
                        </div>
                    </div>
                    <div class="loginify-validation-results">
                        <div class="loginify-validation-stats">
                            <div class="loginify-stat valid">
                                <span class="loginify-stat-number" id="validCount">0</span>
                                <span class="loginify-stat-label">✅ Valid</span>
                            </div>
                            <div class="loginify-stat invalid">
                                <span class="loginify-stat-number" id="invalidCount">0</span>
                                <span class="loginify-stat-label">❌ Invalid</span>
                            </div>
                            <div class="loginify-stat updated">
                                <span class="loginify-stat-number" id="updatedCount">0</span>
                                <span class="loginify-stat-label">🔄 Updated</span>
                            </div>
                        </div>
                        <div class="loginify-validation-log" id="validationLog">
                            Starting validation...
                        </div>
                    </div>
                    <div class="loginify-validation-actions">
                        <button class="loginify-btn-danger" id="removeInvalid" disabled>🗑️ Remove Invalid Tokens</button>
                        <button class="loginify-btn-secondary" id="cancelValidation">❌ Cancel</button>
                    </div>
                </div>
            `;

            ui.showModal('🔄 Token Validation', validationModal);

            let validCount = 0;
            let invalidCount = 0;
            let updatedCount = 0;
            let checkedCount = 0;
            const invalidTokens = [];

            const progressBar = document.getElementById('validationProgress');
            const progressText = document.getElementById('validationCount');
            const validCountEl = document.getElementById('validCount');
            const invalidCountEl = document.getElementById('invalidCount');
            const updatedCountEl = document.getElementById('updatedCount');
            const validationLog = document.getElementById('validationLog');

            const logMessage = (message, type = 'info') => {
                const logEntry = document.createElement('div');
                logEntry.className = `loginify-log-entry ${type}`;
                logEntry.textContent = message;
                validationLog.appendChild(logEntry);
                validationLog.scrollTop = validationLog.scrollHeight;
            };

            logMessage('🚀 Starting token validation process...', 'info');

            for (let i = 0; i < state.accounts.length; i++) {
                const account = state.accounts[i];
                checkedCount++;

                logMessage(`🔍 Checking ${account.name}...`, 'info');

                const result = await utils.validateToken(account.token);

                if (result.valid) {
                    validCount++;
                    logMessage(`✅ ${account.name} - Valid`, 'success');

                    // Update user data if it changed
                    if (result.user) {
                        const oldUsername = account.userData?.username;
                        account.userData = {
                            ...account.userData,
                            id: result.user.id,
                            username: result.user.username,
                            discriminator: result.user.discriminator,
                            avatar: result.user.avatar,
                            email: result.user.email || account.userData?.email,
                            verified: result.user.verified,
                            mfa_enabled: result.user.mfa_enabled
                        };

                        if (oldUsername !== result.user.username) {
                            updatedCount++;
                            logMessage(`🔄 ${account.name} - Username updated: ${oldUsername} → ${result.user.username}`, 'warning');
                        }
                    }
                } else {
                    invalidCount++;
                    invalidTokens.push(i);
                    logMessage(`❌ ${account.name} - Invalid (${result.error})`, 'error');
                }

                // Update progress
                const progress = (checkedCount / state.accounts.length) * 100;
                progressBar.style.width = progress + '%';
                progressText.textContent = checkedCount;
                validCountEl.textContent = validCount;
                invalidCountEl.textContent = invalidCount;
                updatedCountEl.textContent = updatedCount;

                // Small delay to prevent rate limiting
                await new Promise(resolve => setTimeout(resolve, 250));
            }

            logMessage(`🎉 Validation complete! ${validCount} valid, ${invalidCount} invalid`, 'success');

            // Update last validation timestamp
            state.settings.lastTokenValidation = Date.now();
            utils.saveData();

            // Restart countdown timer with new timestamp
            utils.startCountdownTimer();

            // Enable remove button if there are invalid tokens
            if (invalidTokens.length > 0) {
                document.getElementById('removeInvalid').disabled = false;
                document.getElementById('removeInvalid').onclick = () => {
                    // Remove invalid tokens (in reverse order to maintain indices)
                    for (let i = invalidTokens.length - 1; i >= 0; i--) {
                        const accountName = state.accounts[invalidTokens[i]].name;
                        state.accounts.splice(invalidTokens[i], 1);
                        logMessage(`🗑️ Removed invalid token: ${accountName}`, 'warning');
                    }

                    utils.saveData();
                    ui.renderAccounts();
                    utils.showNotification(`🗑️ Removed ${invalidTokens.length} invalid tokens`, 'success');
                    ui.closeModal();
                };
            }

            // Update accounts display
            ui.renderAccounts();
        },

        // Check if auto-validation is due
        checkAutoValidation: () => {
            if (!state.settings.autoValidationEnabled) return;

            const daysSinceLastValidation = (Date.now() - state.settings.lastTokenValidation) / (1000 * 60 * 60 * 24);

            if (daysSinceLastValidation >= state.settings.validationInterval) {
                utils.showNotification('🔄 Auto-validation starting...', 'info', 3000);
                setTimeout(() => {
                    utils.validateAllTokens();
                }, 2000);
            }
        },

        // Calculate time until next validation
        getTimeUntilNextValidation: () => {
            if (!state.settings.autoValidationEnabled) {
                return { disabled: true };
            }

            const lastValidation = state.settings.lastTokenValidation || 0;
            const intervalMs = state.settings.validationInterval * 24 * 60 * 60 * 1000; // Convert days to ms
            const nextValidation = lastValidation + intervalMs;
            const timeUntil = nextValidation - Date.now();

            if (timeUntil <= 0) {
                return { overdue: true, timeUntil: 0 };
            }

            const days = Math.floor(timeUntil / (24 * 60 * 60 * 1000));
            const hours = Math.floor((timeUntil % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            const minutes = Math.floor((timeUntil % (60 * 60 * 1000)) / (60 * 1000));
            const seconds = Math.floor((timeUntil % (60 * 1000)) / 1000);

            return { days, hours, minutes, seconds, timeUntil };
        },

        // Format countdown display
        formatCountdown: (timeData) => {
            if (timeData.disabled) {
                return 'Auto-validation disabled';
            }

            if (timeData.overdue) {
                return 'Ready to validate tokens!';
            }

            const { days, hours, minutes, seconds } = timeData;

            if (days > 0) {
                return `${days}d ${hours}h ${minutes}m`;
            } else if (hours > 0) {
                return `${hours}h ${minutes}m ${seconds}s`;
            } else if (minutes > 0) {
                return `${minutes}m ${seconds}s`;
            } else {
                return `${seconds}s`;
            }
        },

        // Start countdown timer
        startCountdownTimer: () => {
            const countdownElement = document.getElementById('countdownTimer');
            const countdownContainer = document.getElementById('validationCountdown');

            if (!countdownElement || !countdownContainer) return;

            const updateCountdown = () => {
                const timeData = utils.getTimeUntilNextValidation();
                const formattedTime = utils.formatCountdown(timeData);

                countdownElement.textContent = formattedTime;

                // Remove all status classes
                countdownElement.classList.remove('urgent', 'completed');

                if (timeData.disabled) {
                    countdownContainer.style.display = 'none';
                } else {
                    countdownContainer.style.display = 'block';

                    if (timeData.overdue) {
                        countdownElement.classList.add('completed');
                        countdownElement.textContent = 'Validation starting soon!';
                        // Update description for overdue state
                        const description = document.querySelector('.loginify-countdown-description');
                        if (description) {
                            description.textContent = 'Will check all tokens and clean up invalid ones automatically';
                        }
                    } else if (timeData.timeUntil < 60 * 60 * 1000) { // Less than 1 hour
                        countdownElement.classList.add('urgent');
                        // Update description for urgent state
                        const description = document.querySelector('.loginify-countdown-description');
                        if (description) {
                            description.textContent = 'Token validation will start soon - checks validity and removes invalid tokens';
                        }
                    } else {
                        // Normal state description
                        const description = document.querySelector('.loginify-countdown-description');
                        if (description) {
                            description.textContent = 'Automatically checks all tokens for validity and removes invalid ones';
                        }
                    }
                }
            };

            // Update immediately
            updateCountdown();

            // Update every second
            if (state.countdownInterval) {
                clearInterval(state.countdownInterval);
            }

            state.countdownInterval = setInterval(updateCountdown, 1000);
        },

        // Stop countdown timer
        stopCountdownTimer: () => {
            if (state.countdownInterval) {
                clearInterval(state.countdownInterval);
                state.countdownInterval = null;
            }
        }
    };

    // Core functionality
    const core = {
        login: async (token, accountId = null, mode = null) => {
            try {
                const loginMode = mode || state.settings.loginMode;
                utils.showNotification('🚀 Logging in...', 'warning', 1500);

                if (loginMode === 'newTab') {
                    // Open in new tab
                    const newTab = window.open(window.location.href, '_blank');
                    if (newTab) {
                        // Set token in new tab after it loads
                        setTimeout(() => {
                            try {
                                const iframe = newTab.document.createElement('iframe');
                                iframe.style.display = 'none';
                                newTab.document.body.appendChild(iframe);
                                iframe.contentWindow.localStorage.setItem('token', `"${token}"`);
                                newTab.document.body.removeChild(iframe);
                                newTab.location.reload();
                            } catch (error) {
                                console.error('New tab login failed:', error);
                            }
                        }, 1000);
                        utils.showNotification('↗️ Opening in new tab...', 'success');
                    }
                } else {
                    // Current tab login
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);

                    iframe.contentWindow.localStorage.setItem('token', `"${token}"`);
                    document.body.removeChild(iframe);

                    // Update current user, last used, and refresh user data (including Nitro status)
                    if (accountId) {
                        const account = state.accounts.find(a => a.id === accountId);
                        if (account) {
                            account.lastUsed = new Date().toISOString();

                            // Refresh user data to update Nitro status and other info
                            if (state.settings.extractUserData) {
                                try {
                                    const userData = await utils.fetchUserData(account.token);
                                    if (userData) {
                                        account.userData = userData;
                                        account.avatar = utils.getAvatarUrl(userData.id, userData.avatar);
                                        storage.saveData();
                                        ui.renderAccounts();
                                    }
                                } catch (error) {
                                    console.error('Failed to refresh user data:', error);
                                }
                            }
                        }
                    }

                    setTimeout(() => location.reload(), 100);
                }
            } catch (error) {
                console.error('Login failed:', error);
                utils.showNotification('❌ Login failed', 'error');
            }
        },

        addAccount: async (accountData) => {
            try {
                let userData = null;

                // Try to fetch user data if extraction is enabled
                if (state.settings.extractUserData && accountData.token) {
                    utils.showNotification('🔄 Fetching user data...', 'warning', 2000);
                    userData = await utils.fetchUserData(accountData.token);
                }

                const account = {
                    id: utils.generateId(),
                    name: accountData.name || (userData ? `${userData.username}#${userData.discriminator}` : 'Unnamed Account'),
                    token: accountData.token,
                    avatar: accountData.avatar || (userData ? utils.getAvatarUrl(userData.id, userData.avatar) : ''),
                    group: accountData.group || 'default',
                    favorite: accountData.favorite || false,
                    addedDate: new Date().toISOString(),
                    lastUsed: null,
                    userData: userData || null
                };

                state.accounts.push(account);
                utils.saveData();
                ui.renderAccounts();
                utils.showNotification(`✅ Account "${account.name}" added with ${userData ? 'full data' : 'basic info'}`);
            } catch (error) {
                console.error('Failed to add account:', error);
                utils.showNotification('❌ Failed to add account', 'error');
            }
        },

        deleteAccount: (accountId) => {
            const account = state.accounts.find(a => a.id === accountId);
            if (!account) return;

            state.accounts = state.accounts.filter(a => a.id !== accountId);
            utils.saveData();
            ui.renderAccounts();
            utils.showNotification(`🗑️ Account "${account.name}" deleted`);
        },

        toggleFavorite: (accountId) => {
            const account = state.accounts.find(a => a.id === accountId);
            if (!account) return;

            account.favorite = !account.favorite;
            utils.saveData();
            ui.renderAccounts();
            utils.showNotification(`${account.favorite ? '⭐' : '☆'} ${account.name} ${account.favorite ? 'favorited' : 'unfavorited'}`);
        },

        exportAccounts: () => {
            const data = {
                version: CONFIG.version,
                name: CONFIG.name,
                accounts: state.accounts.map(acc => ({
                    ...acc,
                    token: acc.token // Keep tokens in export for functionality
                })),
                settings: state.settings,
                exportDate: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `loginify-accounts-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);

            utils.showNotification(`📁 ${state.accounts.length} accounts exported with complete data!`);
        },

        importAccounts: (fileContent) => {
            try {
                const data = JSON.parse(fileContent);

                if (!data.accounts || !Array.isArray(data.accounts)) {
                    throw new Error('Invalid file format');
                }

                let importedCount = 0;
                data.accounts.forEach(account => {
                    // Check if account already exists
                    const exists = state.accounts.find(a => a.token === account.token);
                    if (!exists) {
                        state.accounts.push({
                            ...account,
                            id: utils.generateId(),
                            addedDate: new Date().toISOString()
                        });
                        importedCount++;
                    }
                });

                // Import settings if available
                if (data.settings) {
                    state.settings = { ...state.settings, ...data.settings };
                }

                utils.saveData();
                ui.renderAccounts();
                utils.showNotification(`🎉 Imported ${importedCount} new accounts!`);
            } catch (error) {
                console.error('Import failed:', error);
                utils.showNotification('❌ Import failed - invalid file format', 'error');
            }
        },

        detectCurrentUser: async () => {
            try {
                const token = utils.getCurrentToken();
                if (token) {
                    state.currentToken = token;
                    if (state.settings.autoDetectCurrent) {
                        const userData = await utils.fetchUserData(token);
                        if (userData) {
                            state.currentUser = userData;
                            utils.saveData();
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to detect current user:', error);
            }
        },

        // Token Checker System
        tokenChecker: {
            isRunning: false,
            shouldStop: false,
            results: {
                valid: [],
                invalid: [],
                nitro: [],
                checked: 0,
                total: 0
            },
            startTime: null,
            currentProxy: 0,
            proxies: []
        },

        startTokenChecking: async () => {
            const tokens = document.getElementById('tokenTextarea').value.trim().split('\n').filter(t => t.trim().length > 0);
            if (tokens.length === 0) {
                utils.showNotification('❌ No tokens to check!', 'error');
                return;
            }

            // Initialize checker state
            core.tokenChecker.isRunning = true;
            core.tokenChecker.shouldStop = false;
            core.tokenChecker.results = { valid: [], invalid: [], nitro: [], checked: 0, total: tokens.length };
            core.tokenChecker.startTime = Date.now();

            // Get settings
            const useProxy = document.getElementById('useProxy').checked;
            const delay = parseInt(document.getElementById('requestDelay').value);
            const concurrent = parseInt(document.getElementById('concurrentRequests').value);
            const saveMode = document.getElementById('saveMode').value;
            const fetchUserData = document.getElementById('fetchUserData').checked;
            const checkNitro = document.getElementById('checkNitro').checked;

            // Get save criteria for custom mode
            const saveCriteria = {
                mode: saveMode,
                nitroOnly: document.getElementById('saveNitroOnly').checked,
                emailVerified: document.getElementById('saveEmailVerified').checked,
                phoneVerified: document.getElementById('savePhoneVerified').checked,
                highValue: document.getElementById('saveHighValue').checked,
                overwriteDuplicates: document.getElementById('overwriteDuplicates').checked,
                autoFavoriteNitro: document.getElementById('autoFavoriteNitro').checked
            };

            // Parse proxies if enabled
            if (useProxy) {
                const proxyText = document.getElementById('proxyTextarea').value.trim();
                if (proxyText) {
                    core.tokenChecker.proxies = proxyText.split('\n').filter(p => p.trim().length > 0);
                    core.tokenChecker.currentProxy = 0;
                } else {
                    utils.showNotification('⚠️ Proxy enabled but no proxies provided!', 'warning');
                }
            }

            // Update UI
            document.getElementById('startChecking').disabled = true;
            document.getElementById('stopChecking').disabled = false;

            // Switch to results tab
            document.querySelector('[data-tab="results"]').click();

            // Clear previous results
            document.getElementById('resultsLog').innerHTML = '<div class="loginify-log-header">🔍 Starting token validation...</div>';

            utils.showNotification('🚀 Token checking started!', 'success');

            // Start checking with concurrency control
            const chunks = [];
            for (let i = 0; i < tokens.length; i += concurrent) {
                chunks.push(tokens.slice(i, i + concurrent));
            }

            for (const chunk of chunks) {
                if (core.tokenChecker.shouldStop) break;

                const promises = chunk.map(token => core.checkSingleToken(token, {
                    useProxy,
                    fetchUserData,
                    checkNitro
                }));

                await Promise.allSettled(promises);

                if (delay > 0) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }

            core.finishTokenChecking(saveCriteria);
        },

        checkSingleToken: async (token, options) => {
            try {
                const cleanToken = token.trim();
                if (!cleanToken) return;

                // Get proxy if enabled
                let proxy = null;
                if (options.useProxy && core.tokenChecker.proxies.length > 0) {
                    proxy = core.tokenChecker.proxies[core.tokenChecker.currentProxy % core.tokenChecker.proxies.length];
                    core.tokenChecker.currentProxy++;
                }

                // Make Discord API request
                const headers = {
                    'Authorization': cleanToken,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                };

                // Note: Browser fetch doesn't support proxy configuration directly
                // This would need to be handled at the network level or through browser extensions
                const response = await fetch(`${CONFIG.discord.api}/users/@me`, {
                    method: 'GET',
                    headers: headers
                });

                const data = await response.json();

                if (data.id) {
                    // Valid token
                    const tokenInfo = {
                        token: cleanToken,
                        id: data.id,
                        username: data.username,
                        discriminator: data.discriminator,
                        email: data.email,
                        verified: data.verified,
                        phone: data.phone,
                        premium_type: data.premium_type,
                        avatar: data.avatar,
                        isNitro: data.premium_type > 0
                    };

                    core.tokenChecker.results.valid.push(tokenInfo);

                    if (tokenInfo.isNitro) {
                        core.tokenChecker.results.nitro.push(tokenInfo);
                    }

                    core.logTokenResult(tokenInfo, 'valid');
                } else {
                    // Invalid token
                    core.tokenChecker.results.invalid.push(cleanToken);
                    core.logTokenResult({ token: cleanToken }, 'invalid');
                }
            } catch (error) {
                // Failed to check (likely invalid)
                core.tokenChecker.results.invalid.push(token);
                core.logTokenResult({ token: token, error: error.message }, 'error');
            }

            core.tokenChecker.results.checked++;
            core.updateCheckingProgress();
        },

        logTokenResult: (tokenInfo, type) => {
            const log = document.getElementById('resultsLog');
            const logEntry = document.createElement('div');
            logEntry.className = `loginify-log-entry ${type}`;

            if (type === 'valid') {
                logEntry.innerHTML = `
                    <div class="loginify-log-icon">✅</div>
                    <div class="loginify-log-content">
                        <div class="loginify-log-token">${tokenInfo.token.substring(0, 24)}...</div>
                        <div class="loginify-log-details">
                            👤 ${tokenInfo.username}#${tokenInfo.discriminator} |
                            📧 ${tokenInfo.email ? 'Verified' : 'Not verified'} |
                            📱 ${tokenInfo.phone ? 'Verified' : 'Not verified'} |
                            💎 ${tokenInfo.isNitro ? 'Nitro' : 'No Nitro'}
                        </div>
                    </div>
                `;
            } else if (type === 'invalid') {
                logEntry.innerHTML = `
                    <div class="loginify-log-icon">❌</div>
                    <div class="loginify-log-content">
                        <div class="loginify-log-token">${tokenInfo.token.substring(0, 24)}...</div>
                        <div class="loginify-log-details">Invalid token</div>
                    </div>
                `;
            } else {
                logEntry.innerHTML = `
                    <div class="loginify-log-icon">⚠️</div>
                    <div class="loginify-log-content">
                        <div class="loginify-log-token">${tokenInfo.token.substring(0, 24)}...</div>
                        <div class="loginify-log-details">Error: ${tokenInfo.error}</div>
                    </div>
                `;
            }

            log.appendChild(logEntry);
            log.scrollTop = log.scrollHeight;
        },

        updateCheckingProgress: () => {
            const results = core.tokenChecker.results;
            const percentage = Math.round((results.checked / results.total) * 100);

            // Update basic stats
            document.getElementById('totalChecked').textContent = results.checked;
            document.getElementById('validTokens').textContent = results.valid.length;
            document.getElementById('invalidTokens').textContent = results.invalid.length;
            document.getElementById('nitroTokens').textContent = results.nitro.length;

            // Update detailed stats if enabled
            const showDetailed = document.getElementById('showDetailedStats')?.checked;
            const detailedStats = document.getElementById('detailedStats');

            if (showDetailed && detailedStats) {
                detailedStats.style.display = 'block';

                const emailVerified = results.valid.filter(t => t.email).length;
                const phoneVerified = results.valid.filter(t => t.phone).length;
                const highValue = results.valid.filter(t => t.isNitro && t.email && t.phone).length;

                document.getElementById('emailVerifiedTokens').textContent = emailVerified;
                document.getElementById('phoneVerifiedTokens').textContent = phoneVerified;
                document.getElementById('highValueTokens').textContent = highValue;
                // savedTokens will be updated in finishTokenChecking
            } else if (detailedStats) {
                detailedStats.style.display = 'none';
            }

            // Update progress bar
            document.getElementById('progressFill').style.width = percentage + '%';
            document.getElementById('progressText').textContent = percentage + '%';

            // Update time stats
            const elapsed = Date.now() - core.tokenChecker.startTime;
            const elapsedSeconds = Math.floor(elapsed / 1000);
            const elapsedMinutes = Math.floor(elapsedSeconds / 60);
            const elapsedDisplay = `${elapsedMinutes.toString().padStart(2, '0')}:${(elapsedSeconds % 60).toString().padStart(2, '0')}`;
            document.getElementById('elapsedTime').textContent = elapsedDisplay;

            // Calculate ETA
            if (results.checked > 0) {
                const avgTimePerToken = elapsed / results.checked;
                const remaining = results.total - results.checked;
                const eta = remaining * avgTimePerToken;
                const etaSeconds = Math.floor(eta / 1000);
                const etaMinutes = Math.floor(etaSeconds / 60);
                const etaDisplay = `${etaMinutes.toString().padStart(2, '0')}:${(etaSeconds % 60).toString().padStart(2, '0')}`;
                document.getElementById('estimatedTime').textContent = etaDisplay;
            }

            // Update export buttons
            document.getElementById('exportValid').textContent = `📥 Export Valid (${results.valid.length})`;
            document.getElementById('exportInvalid').textContent = `📥 Export Invalid (${results.invalid.length})`;
            document.getElementById('exportNitro').textContent = `📥 Export Nitro (${results.nitro.length})`;

            const hasResults = results.valid.length > 0 || results.invalid.length > 0;
            document.getElementById('exportValid').disabled = results.valid.length === 0;
            document.getElementById('exportInvalid').disabled = results.invalid.length === 0;
            document.getElementById('exportNitro').disabled = results.nitro.length === 0;
            document.getElementById('exportAll').disabled = !hasResults;
        },

        stopTokenChecking: () => {
            core.tokenChecker.shouldStop = true;
            core.finishTokenChecking({ mode: 'none' });
        },

        finishTokenChecking: async (saveCriteria = { mode: 'none' }) => {
            core.tokenChecker.isRunning = false;

            // Update UI
            document.getElementById('startChecking').disabled = false;
            document.getElementById('stopChecking').disabled = true;

            const results = core.tokenChecker.results;

            // Save tokens based on criteria
            if (saveCriteria.mode !== 'none' && results.valid.length > 0) {
                const tokensToSave = core.filterTokensForSaving(results.valid, saveCriteria);
                let savedCount = 0;

                for (const tokenInfo of tokensToSave) {
                    const existsAlready = state.accounts.find(a => a.token === tokenInfo.token);

                    if (!existsAlready || saveCriteria.overwriteDuplicates) {
                        if (existsAlready && saveCriteria.overwriteDuplicates) {
                            // Remove existing account
                            state.accounts = state.accounts.filter(a => a.token !== tokenInfo.token);
                        }

                        await core.addAccount({
                            name: `${tokenInfo.username}#${tokenInfo.discriminator}`,
                            token: tokenInfo.token,
                            avatar: tokenInfo.avatar ? utils.getAvatarUrl(tokenInfo.id, tokenInfo.avatar) : '',
                            group: 'token-checker',
                            favorite: saveCriteria.autoFavoriteNitro && tokenInfo.isNitro
                        });
                        savedCount++;
                    }
                }

                if (savedCount > 0) {
                    const modeText = core.getSaveModeText(saveCriteria.mode);
                    utils.showNotification(`💾 Saved ${savedCount} ${modeText} to account list!`, 'success');
                    ui.renderAccounts(); // Refresh account list

                    // Update saved tokens count in detailed stats
                    const savedElement = document.getElementById('savedTokens');
                    if (savedElement) {
                        savedElement.textContent = savedCount;
                    }
                }
            } else if (saveCriteria.mode !== 'none') {
                // Update saved tokens count to 0 if no tokens were saved
                const savedElement = document.getElementById('savedTokens');
                if (savedElement) {
                    savedElement.textContent = '0';
                }
            }

            // Auto-export if enabled
            if (document.getElementById('exportResults').checked) {
                core.exportResults('all');
            }

            // Final notification with enhanced info
            let message;
            if (core.tokenChecker.shouldStop) {
                message = `⏹️ Token checking stopped! Checked: ${results.checked}/${results.total}`;
            } else {
                const emailVerified = results.valid.filter(t => t.email).length;
                const phoneVerified = results.valid.filter(t => t.phone).length;
                const highValue = results.valid.filter(t => t.isNitro && t.email && t.phone).length;

                message = `✅ Token checking complete! Valid: ${results.valid.length}, Invalid: ${results.invalid.length}, Nitro: ${results.nitro.length}`;

                if (document.getElementById('showDetailedStats')?.checked) {
                    message += `, Email: ${emailVerified}, Phone: ${phoneVerified}, High-Value: ${highValue}`;
                }
            }

            utils.showNotification(message, 'success', 5000);
        },

        exportResults: (type) => {
            const results = core.tokenChecker.results;
            let data = '';
            let filename = '';

            switch (type) {
                case 'valid':
                    data = results.valid.map(t => `${t.token} | ${t.username}#${t.discriminator} | Email: ${t.email ? 'Verified' : 'Not verified'} | Phone: ${t.phone ? 'Verified' : 'Not verified'} | Nitro: ${t.isNitro ? 'True' : 'False'}`).join('\n');
                    filename = `loginify-valid-tokens-${new Date().toISOString().split('T')[0]}.txt`;
                    break;
                case 'invalid':
                    data = results.invalid.join('\n');
                    filename = `loginify-invalid-tokens-${new Date().toISOString().split('T')[0]}.txt`;
                    break;
                case 'nitro':
                    data = results.nitro.map(t => `${t.token} | ${t.username}#${t.discriminator} | Premium Type: ${t.premium_type}`).join('\n');
                    filename = `loginify-nitro-tokens-${new Date().toISOString().split('T')[0]}.txt`;
                    break;
                case 'all':
                    const summary = `Loginify Token Checker Results
Generated: ${new Date().toISOString()}
Total Checked: ${results.checked}
Valid Tokens: ${results.valid.length}
Invalid Tokens: ${results.invalid.length}
Nitro Accounts: ${results.nitro.length}

=== VALID TOKENS ===
${results.valid.map(t => `${t.token} | ${t.username}#${t.discriminator} | Email: ${t.email ? 'Verified' : 'Not verified'} | Phone: ${t.phone ? 'Verified' : 'Not verified'} | Nitro: ${t.isNitro ? 'True' : 'False'}`).join('\n')}

=== INVALID TOKENS ===
${results.invalid.join('\n')}

=== NITRO ACCOUNTS ===
${results.nitro.map(t => `${t.token} | ${t.username}#${t.discriminator} | Premium Type: ${t.premium_type}`).join('\n')}`;
                    data = summary;
                    filename = `loginify-all-results-${new Date().toISOString().split('T')[0]}.txt`;
                    break;
            }

            if (data) {
                const blob = new Blob([data], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);

                utils.showNotification(`📁 ${type} results exported!`, 'success');
            }
        },

        filterTokensForSaving: (validTokens, criteria) => {
            return validTokens.filter(tokenInfo => {
                switch (criteria.mode) {
                    case 'all':
                        return true;
                    case 'nitro':
                        return tokenInfo.isNitro;
                    case 'verified':
                        return tokenInfo.email && tokenInfo.phone;
                    case 'custom':
                        let matches = true;
                        if (criteria.nitroOnly && !tokenInfo.isNitro) matches = false;
                        if (criteria.emailVerified && !tokenInfo.email) matches = false;
                        if (criteria.phoneVerified && !tokenInfo.phone) matches = false;
                        if (criteria.highValue && (!tokenInfo.isNitro || !tokenInfo.email || !tokenInfo.phone)) matches = false;
                        return matches;
                    default:
                        return false;
                }
            });
        },

        getSaveModeText: (mode) => {
            switch (mode) {
                case 'all': return 'valid accounts';
                case 'nitro': return 'Nitro accounts';
                case 'verified': return 'verified accounts';
                case 'custom': return 'custom criteria accounts';
                default: return 'accounts';
            }
        }
    };

    // UI Management
    const ui = {
        container: null,
        modal: null,

        init: () => {
            ui.createContainer();
            ui.createToggleButton();
            ui.attachEventListeners();
            ui.renderAccounts();
            ui.applyCompactMode();
        },

        createContainer: () => {
            ui.container = document.createElement('div');
            ui.container.className = 'loginify-container';
            ui.container.style.left = state.position.x + 'px';
            ui.container.style.top = state.position.y + 'px';

            ui.container.innerHTML = `
                <div class="loginify-header">
                    <div class="loginify-title">
                        <div class="loginify-logo">🚀</div>
                        <span>${CONFIG.name}</span>
                        <div class="loginify-account-counter" id="accountCounter">
                            <span class="loginify-counter-number">${state.accounts.length}</span>
                            <span class="loginify-counter-label">${state.accounts.length === 1 ? 'account' : 'accounts'}</span>
                        </div>
                    </div>
                    <div class="loginify-controls">
                        <button class="loginify-btn" data-action="about" title="About Loginify">ℹ️</button>
                        <button class="loginify-btn" data-action="stealth" title="Stealth Mode (Ctrl+Alt+S)">👻</button>
                        <button class="loginify-btn" data-action="settings" title="Settings">⚙️</button>
                        <button class="loginify-btn" data-action="close" title="Close">✕</button>
                    </div>
                    <div class="loginify-tagline">${CONFIG.tagline}</div>
                </div>

                <div class="loginify-search">
                    <input type="text" class="loginify-search-input" placeholder="🔍 Search your accounts..." />
                    <div class="loginify-search-hint">💡 Double-click accounts to login instantly</div>
                </div>

                <div class="loginify-content">
                    <div class="loginify-accounts" id="loginify-accounts"></div>
                </div>

                <div class="loginify-footer">
                    <button class="loginify-btn-primary" data-action="add-account">➕ Add Account</button>
                    <button class="loginify-btn-secondary" data-action="token-checker">🔍 Token Checker</button>
                    <button class="loginify-btn-secondary" data-action="validate-all">🔄 Validate All</button>
                    <button class="loginify-btn-secondary" data-action="import">📥 Import</button>
                    <button class="loginify-btn-secondary" data-action="export">📁 Export</button>
                </div>

                <div class="loginify-validation-countdown" id="validationCountdown">
                    <div class="loginify-countdown-text">
                        <span class="loginify-countdown-label">🔄 Auto token validation:</span>
                        <span class="loginify-countdown-timer" id="countdownTimer">Calculating...</span>
                    </div>
                    <div class="loginify-countdown-info">
                        <span class="loginify-countdown-description">Automatically checks all tokens for validity and removes invalid ones</span>
                    </div>
                </div>

                <div class="loginify-about">
                    <div class="loginify-about-text">
                        Made with 💜 by the Loginify Team | v${CONFIG.version}
                    </div>
                </div>
            `;

            document.body.appendChild(ui.container);

            // FORCE reapply theme immediately after UI creation
            setTimeout(() => {
                utils.updateTheme(state.settings.primaryColor, state.settings.secondaryColor, state.settings.accentColor);
                console.log('🎨 Loginify: Reapplied theme after UI creation');
            }, 10);

            // Start countdown timer after UI is created
            setTimeout(() => {
                utils.startCountdownTimer();
            }, 500);
        },

        createToggleButton: () => {
            const toggle = document.createElement('button');
            toggle.className = 'loginify-toggle';
            toggle.innerHTML = '🚀';
            toggle.title = `${CONFIG.name} - Click to toggle`;
            toggle.onclick = ui.toggle;
            document.body.appendChild(toggle);
        },

        toggle: () => {
            if (state.stealthMode) return; // Don't toggle if in stealth mode
            state.isVisible = !state.isVisible;
            ui.container.classList.toggle('visible', state.isVisible);
        },

        toggleStealth: () => {
            state.stealthMode = !state.stealthMode;
            if (state.stealthMode) {
                ui.enableStealth();
            } else {
                ui.disableStealth();
            }
        },

        enableStealth: () => {
            state.stealthMode = true;
            state.isVisible = false;
            ui.container.classList.add('hidden');
            ui.container.classList.remove('visible');
            document.querySelector('.loginify-toggle').classList.add('hidden');

            // Add stealth indicator to page title
            if (!document.title.includes('👻')) {
                document.title = '👻 ' + document.title;
            }

            utils.showNotification('👻 Stealth mode enabled - Press Ctrl+Alt+S or double-click page to toggle back', 'warning', 3000);
        },

        disableStealth: () => {
            state.stealthMode = false;
            state.isVisible = true;
            ui.container.classList.remove('hidden');
            ui.container.classList.add('visible');
            document.querySelector('.loginify-toggle').classList.remove('hidden');

            // Remove stealth indicator from page title
            if (document.title.includes('👻 ')) {
                document.title = document.title.replace('👻 ', '');
            }

            utils.showNotification('👁️ Stealth mode disabled', 'success', 2000);
        },

        showAbout: () => {
            const content = `
                <div class="loginify-about-clean">
                    <div class="loginify-about-hero">
                        <div class="loginify-hero-icon">🚀</div>
                        <h1>Loginify</h1>
                        <p class="loginify-hero-subtitle">Advanced Discord Account Management</p>
                        <div class="loginify-version-tag">v${CONFIG.version}</div>
                    </div>

                    <div class="loginify-about-main">
                        <div class="loginify-description">
                            <h2>The Ultimate Discord Token Manager</h2>
                            <p>Professional-grade account management with enterprise features, beautiful design, and powerful automation tools. Built for power users who demand the best.</p>
                        </div>

                        <div class="loginify-creator-section">
                            <div class="loginify-creator-card">
                                <div class="loginify-creator-avatar" id="creatorAvatar">
                                    <span class="fallback-text">SpEc</span>
                                </div>
                                <div class="loginify-creator-details">
                                    <h3>Created by SpEc</h3>
                                    <p>Passionate developer crafting next-generation tools for the Discord community</p>
                                    <a href="https://specisme.xyz" target="_blank" class="loginify-website-btn">
                                        <span class="loginify-btn-icon">🌐</span>
                                        <span>Visit specisme.xyz</span>
                                        <span class="loginify-btn-arrow">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div class="loginify-features-grid">
                            <div class="loginify-feature-card">
                                <div class="loginify-feature-icon">💎</div>
                                <h4>Premium Account Detection</h4>
                                <p>Automatically identifies Nitro subscriptions and verified accounts</p>
                            </div>
                            <div class="loginify-feature-card">
                                <div class="loginify-feature-icon">🔍</div>
                                <h4>Advanced Token Validation</h4>
                                <p>Professional-grade token checking with proxy support & bulk validation</p>
                            </div>
                            <div class="loginify-feature-card">
                                <div class="loginify-feature-icon">⚡</div>
                                <h4>Lightning Fast Performance</h4>
                                <p>Optimized for speed with smooth animations and responsive UI</p>
                            </div>
                            <div class="loginify-feature-card">
                                <div class="loginify-feature-icon">🎨</div>
                                <h4>Beautiful Modern Interface</h4>
                                <p>Modern design with backdrop blur effects, customizable themes and gradients</p>
                            </div>
                        </div>
                    </div>

                    <div class="loginify-about-footer-clean">
                        <p>Made with 💜 • Use responsibly</p>
                    </div>
                </div>
            `;

            ui.showModal('ℹ️ About Loginify', content);

            // Load creator avatar image after modal is shown
            ui.loadCreatorAvatar();
        },

        loadCreatorAvatar: () => {
            const avatar = document.getElementById('creatorAvatar');
            if (!avatar) return;

            console.log('Loading creator avatar...');

            // URLs to try (using imgur which is CSP-approved by Discord)
            const imageUrls = [
                'https://i.imgur.com/tiLzkNF.png'
            ];

            // Simple and effective approach - just set background image directly
            const setBackgroundImage = (url) => {
                avatar.style.backgroundImage = `url('${url}')`;
                avatar.style.backgroundSize = 'cover';
                avatar.style.backgroundPosition = 'center';
                avatar.style.backgroundRepeat = 'no-repeat';

                // Reduce fallback text opacity
                const fallbackText = avatar.querySelector('.fallback-text');
                if (fallbackText) {
                    fallbackText.style.opacity = '0.15';
                    fallbackText.style.fontSize = '14px';
                    fallbackText.style.fontWeight = '300';
                }

                console.log(`Set background image: ${url}`);
            };

            // Try creating an image element method
            const tryImageElement = (url) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();

                    img.onload = function() {
                        console.log(`Image loaded successfully: ${url}`);

                        // Hide fallback text completely
                        const fallbackText = avatar.querySelector('.fallback-text');
                        if (fallbackText) {
                            fallbackText.style.display = 'none';
                        }

                        // Remove any existing image
                        const existingImg = avatar.querySelector('img');
                        if (existingImg) {
                            existingImg.remove();
                        }

                        // Create new image element
                        const imgElement = document.createElement('img');
                        imgElement.src = this.src;
                        imgElement.alt = 'SpEc Avatar';
                        imgElement.style.width = '100%';
                        imgElement.style.height = '100%';
                        imgElement.style.objectFit = 'cover';
                        imgElement.style.borderRadius = '50%';
                        avatar.appendChild(imgElement);
                        avatar.classList.add('loaded');

                        resolve(true);
                    };

                    img.onerror = function() {
                        console.log(`Image failed to load: ${url}`);
                        reject(new Error('Image load failed'));
                    };

                    // Try with and without CORS
                    try {
                        img.crossOrigin = 'anonymous';
                        img.src = url;
                    } catch (e) {
                        console.log('CORS failed, trying without...');
                        img.crossOrigin = null;
                        img.src = url;
                    }
                });
            };

            // Try each URL with image element first, then fallback to background
            (async () => {
                let imageLoaded = false;

                for (const url of imageUrls) {
                    if (imageLoaded) break;

                    try {
                        await tryImageElement(url);
                        imageLoaded = true;
                        console.log('Successfully loaded avatar with image element');
                        return;
                    } catch (error) {
                        console.log(`Image element failed for ${url}, trying background method...`);
                        setBackgroundImage(url);
                    }

                    // Small delay between attempts
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                if (!imageLoaded) {
                    console.log('All image loading methods attempted');
                }
            })();
        },

        showSettings: () => {
            state.settingsOpen = true;
            const content = `
                <div class="loginify-settings">
                    <div class="loginify-settings-header">
                        <h3>🎨 Advanced Customization</h3>
                        <p>Transform your Loginify experience with powerful theming options</p>
                    </div>

                    <!-- Color Scheme Presets -->
                    <div class="loginify-setting-group">
                        <label class="loginify-setting-label">🌈 Color Scheme Presets</label>
                        <div class="loginify-preset-grid">
                            <div class="loginify-preset-card active" data-preset="custom">
                                <div class="loginify-preset-colors">
                                    <span style="background: #667eea"></span>
                                    <span style="background: #764ba2"></span>
                                    <span style="background: #ff6b6b"></span>
                                </div>
                                <span>Custom</span>
                            </div>
                            <div class="loginify-preset-card" data-preset="discord">
                                <div class="loginify-preset-colors">
                                    <span style="background: #5865f2"></span>
                                    <span style="background: #3c45a5"></span>
                                    <span style="background: #eb459e"></span>
                                </div>
                                <span>Discord</span>
                            </div>
                            <div class="loginify-preset-card" data-preset="cyberpunk">
                                <div class="loginify-preset-colors">
                                    <span style="background: #ff0080"></span>
                                    <span style="background: #00ffff"></span>
                                    <span style="background: #ffff00"></span>
                                </div>
                                <span>Cyberpunk</span>
                            </div>
                            <div class="loginify-preset-card" data-preset="sunset">
                                <div class="loginify-preset-colors">
                                    <span style="background: #ff7b7b"></span>
                                    <span style="background: #ff9a56"></span>
                                    <span style="background: #ffad56"></span>
                                </div>
                                <span>Sunset</span>
                            </div>
                            <div class="loginify-preset-card" data-preset="ocean">
                                <div class="loginify-preset-colors">
                                    <span style="background: #0077be"></span>
                                    <span style="background: #00a8cc"></span>
                                    <span style="background: #4dd0e1"></span>
                                </div>
                                <span>Ocean</span>
                            </div>
                            <div class="loginify-preset-card" data-preset="forest">
                                <div class="loginify-preset-colors">
                                    <span style="background: #2e7d32"></span>
                                    <span style="background: #388e3c"></span>
                                    <span style="background: #66bb6a"></span>
                                </div>
                                <span>Forest</span>
                            </div>
                        </div>
                    </div>

                    <div class="loginify-setting-group">
                        <label class="loginify-setting-label">🎨 Custom Colors</label>
                        <div class="loginify-color-grid">
                            <div class="loginify-color-input">
                                <label>Primary Color</label>
                                <input type="color" id="primaryColor" value="${state.settings.primaryColor}" />
                            </div>
                            <div class="loginify-color-input">
                                <label>Secondary Color</label>
                                <input type="color" id="secondaryColor" value="${state.settings.secondaryColor}" />
                            </div>
                            <div class="loginify-color-input">
                                <label>Accent Color</label>
                                <input type="color" id="accentColor" value="${state.settings.accentColor || '#ff6b6b'}" />
                        </div>
                    </div>
                    </div>


                    <div class="loginify-setting-group">
                        <label class="loginify-setting-label">Login Mode</label>
                        <select id="loginMode" class="loginify-select">
                            <option value="current" ${state.settings.loginMode === 'current' ? 'selected' : ''}>Current Tab</option>
                            <option value="newTab" ${state.settings.loginMode === 'newTab' ? 'selected' : ''}>New Tab</option>
                        </select>
                    </div>

                    <div class="loginify-setting-group">
                        <label class="loginify-setting-label">Animation Speed</label>
                        <select id="animationSpeed" class="loginify-select">
                            <option value="slow" ${state.settings.animationSpeed === 'slow' ? 'selected' : ''}>Slow</option>
                            <option value="normal" ${state.settings.animationSpeed === 'normal' ? 'selected' : ''}>Normal</option>
                            <option value="fast" ${state.settings.animationSpeed === 'fast' ? 'selected' : ''}>Fast</option>
                        </select>
                    </div>

                    <div class="loginify-setting-group">
                        <div class="loginify-checkbox-group">
                            <label class="loginify-checkbox">
                                <input type="checkbox" id="showNotifications" ${state.settings.showNotifications ? 'checked' : ''} />
                                <span>Show Notifications</span>
                            </label>
                            <label class="loginify-checkbox">
                                <input type="checkbox" id="autoDetectCurrent" ${state.settings.autoDetectCurrent ? 'checked' : ''} />
                                <span>Auto-detect Current User</span>
                            </label>
                            <label class="loginify-checkbox">
                                <input type="checkbox" id="extractUserData" ${state.settings.extractUserData ? 'checked' : ''} />
                                <span>Extract User Data on Add</span>
                            </label>
                            <label class="loginify-checkbox">
                                <input type="checkbox" id="compactMode" ${state.settings.compactMode ? 'checked' : ''} />
                                <span>Compact Mode</span>
                            </label>
                        </div>
                    </div>

                    <div class="loginify-setting-group loginify-danger-zone">
                        <label class="loginify-setting-label">🚨 Danger Zone</label>
                        <div class="loginify-danger-actions">
                            <button class="loginify-btn-danger" id="resetAllData">🗑️ Clear All Loginify Data</button>
                            <p class="loginify-danger-text">This will permanently delete all saved accounts, settings, and data. This action cannot be undone!</p>
                        </div>
                    </div>

                    <div class="loginify-setting-actions">
                        <button class="loginify-btn-primary" id="saveSettings">💾 Save All Settings</button>
                        <button class="loginify-btn-secondary" id="resetSettings">🔄 Reset to Default</button>
                        <div class="loginify-theme-actions">
                            <button class="loginify-btn-accent" id="importTheme">📥 Import Theme</button>
                            <button class="loginify-btn-accent" id="exportTheme">📤 Export Theme</button>
                            <input type="file" id="themeFileInput" accept=".json" style="display: none;" />
                        </div>
                        <button class="loginify-btn-secondary" id="settingsCancelBtn">Cancel</button>
                    </div>
                </div>
            `;

            ui.showModal('⚙️ Loginify Settings', content);

            // Get all input elements
            const primaryInput = document.getElementById('primaryColor');
            const secondaryInput = document.getElementById('secondaryColor');
            const accentInput = document.getElementById('accentColor');

            // FORCE set input values from saved settings (backup in case template fails)
            primaryInput.value = state.settings.primaryColor;
            secondaryInput.value = state.settings.secondaryColor;
            accentInput.value = state.settings.accentColor;

            // Set other form values from saved settings
            document.getElementById('loginMode').value = state.settings.loginMode;
            document.getElementById('animationSpeed').value = state.settings.animationSpeed;
            document.getElementById('showNotifications').checked = state.settings.showNotifications;
            document.getElementById('autoDetectCurrent').checked = state.settings.autoDetectCurrent;
            document.getElementById('extractUserData').checked = state.settings.extractUserData;
            document.getElementById('compactMode').checked = state.settings.compactMode;

            // Preset functionality
            const presetCards = document.querySelectorAll('.loginify-preset-card');

            const applyPreset = (presetName) => {
                const preset = CONFIG.colorPresets[presetName];
                if (preset) {
                    primaryInput.value = preset.primaryColor;
                    secondaryInput.value = preset.secondaryColor;
                    accentInput.value = preset.accentColor;

                    // Save the selected color scheme
                    state.settings.colorScheme = presetName;

                    // Update active preset card
                    presetCards.forEach(card => card.classList.remove('active'));
                    document.querySelector(`[data-preset="${presetName}"]`)?.classList.add('active');

                    // Apply theme immediately
                    utils.updateTheme(preset.primaryColor, preset.secondaryColor, preset.accentColor);

                    utils.showNotification(`🎨 Applied ${presetName} theme!`, 'success', 2000);
                }
            };

            // Add click handlers for preset cards
            presetCards.forEach(card => {
                card.addEventListener('click', () => {
                    const preset = card.dataset.preset;
                    applyPreset(preset);
                });
            });

            // Initialize the correct active preset based on saved settings
            const currentColorScheme = state.settings.colorScheme || 'custom';
            presetCards.forEach(card => card.classList.remove('active'));
            document.querySelector(`[data-preset="${currentColorScheme}"]`)?.classList.add('active');

            // Live preview function
            const updatePreview = () => {
                utils.updateTheme(primaryInput.value, secondaryInput.value, accentInput.value);

                // Update preset card colors in real-time
                const customCard = document.querySelector('[data-preset="custom"] .loginify-preset-colors');
                if (customCard) {
                    const spans = customCard.querySelectorAll('span');
                    spans[0].style.background = primaryInput.value;
                    spans[1].style.background = secondaryInput.value;
                    spans[2].style.background = accentInput.value;
                }
            };

            // Color input handlers
            primaryInput.oninput = () => {
                updatePreview();
                // Set custom as active when manually changing colors
                state.settings.colorScheme = 'custom';
                presetCards.forEach(card => card.classList.remove('active'));
                document.querySelector('[data-preset="custom"]')?.classList.add('active');
            };
            secondaryInput.oninput = () => {
                updatePreview();
                state.settings.colorScheme = 'custom';
                presetCards.forEach(card => card.classList.remove('active'));
                document.querySelector('[data-preset="custom"]')?.classList.add('active');
            };
            accentInput.oninput = () => {
                updatePreview();
                state.settings.colorScheme = 'custom';
                presetCards.forEach(card => card.classList.remove('active'));
                document.querySelector('[data-preset="custom"]')?.classList.add('active');
            };

            // Save settings
            document.getElementById('saveSettings').onclick = () => {
                // Save all color settings
                state.settings.primaryColor = primaryInput.value;
                state.settings.secondaryColor = secondaryInput.value;
                state.settings.accentColor = accentInput.value;
                // Color scheme is already saved when preset is selected or when manually editing

                // Save behavior settings
                state.settings.loginMode = document.getElementById('loginMode').value;
                state.settings.animationSpeed = document.getElementById('animationSpeed').value;
                state.settings.showNotifications = document.getElementById('showNotifications').checked;
                state.settings.autoDetectCurrent = document.getElementById('autoDetectCurrent').checked;
                state.settings.extractUserData = document.getElementById('extractUserData').checked;
                state.settings.compactMode = document.getElementById('compactMode').checked;

                // FORCE save to storage first
                utils.saveData();

                // Apply theme immediately after saving
                utils.updateTheme(state.settings.primaryColor, state.settings.secondaryColor, state.settings.accentColor);

                // Apply compact mode
                ui.applyCompactMode();

                // Update CSS variables directly as backup
                document.documentElement.style.setProperty('--loginify-primary-color', state.settings.primaryColor);
                document.documentElement.style.setProperty('--loginify-secondary-color', state.settings.secondaryColor);
                document.documentElement.style.setProperty('--loginify-accent-color', state.settings.accentColor);

                utils.showNotification('⚙️ Settings saved and applied successfully!', 'success', 3000);
                ui.closeSettings();
            };

            // Reset settings
            document.getElementById('resetSettings').onclick = () => {
                if (confirm('Are you sure you want to reset all settings to default?')) {
                    state.settings = { ...DEFAULT_SETTINGS };
                    utils.saveData();
                    utils.showNotification('🔄 Settings reset to default');
                    ui.closeSettings();
                    setTimeout(() => location.reload(), 1000);
                }
            };

            // Export theme
            document.getElementById('exportTheme').onclick = () => {
                const themeData = {
                    name: 'Custom Loginify Theme',
                    version: CONFIG.version,
                    colors: {
                        primary: primaryInput.value,
                        secondary: secondaryInput.value,
                        accent: accentInput.value
                    },
                    timestamp: new Date().toISOString()
                };

                const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `loginify-theme-${Date.now()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                utils.showNotification('📤 Theme exported successfully!', 'success');
            };

            // Import theme
            document.getElementById('importTheme').onclick = () => {
                document.getElementById('themeFileInput').click();
            };

            document.getElementById('themeFileInput').onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const themeData = JSON.parse(event.target.result);

                        if (themeData.colors) {
                            // Apply imported theme
                            primaryInput.value = themeData.colors.primary || '#667eea';
                            secondaryInput.value = themeData.colors.secondary || '#764ba2';
                            accentInput.value = themeData.colors.accent || '#ff6b6b';

                            // Update preview immediately
                            updatePreview();

                            utils.showNotification(`📥 Theme "${themeData.name || 'Imported Theme'}" loaded successfully!`, 'success', 3000);
                        } else {
                            utils.showNotification('❌ Invalid theme file format', 'error');
                        }
                    } catch (error) {
                        utils.showNotification('❌ Failed to parse theme file', 'error');
                        console.error('Theme import error:', error);
                    }
                };
                reader.readAsText(file);

                // Reset file input
                e.target.value = '';
            };

            // Reset all data
            document.getElementById('resetAllData').onclick = () => {
                const confirmText = 'This will permanently delete ALL your saved accounts, settings, and data!\n\nType "DELETE" to confirm:';
                const userInput = prompt(confirmText);

                if (userInput === 'DELETE') {
                    // Clear all GM storage data
                    GM_deleteValue(CONFIG.storageKeys.accounts);
                    GM_deleteValue(CONFIG.storageKeys.settings);
                    GM_deleteValue(CONFIG.storageKeys.position);
                    GM_deleteValue(CONFIG.storageKeys.currentUser);

                    // Also clear any localStorage data for safety
                    localStorage.removeItem('loginify_accounts');
                    localStorage.removeItem('loginify_settings');
                    localStorage.removeItem('loginify_currentToken');
                    localStorage.removeItem('loginify_accounts_v3');
                    localStorage.removeItem('loginify_settings_v3');
                    localStorage.removeItem('loginify_position_v3');
                    localStorage.removeItem('loginify_current_user');
                    localStorage.removeItem('token'); // Clear Discord token as well

                    // Reset state
                    state.accounts = [];
                    state.settings = { ...DEFAULT_SETTINGS };
                    state.currentUser = null;
                    state.position = { x: window.innerWidth - 80, y: window.innerHeight - 80 };

                    // Update UI to reflect cleared state
                    ui.renderAccounts();

                    utils.showNotification('🗑️ All Loginify data successfully cleared! Reloading...', 'success', 2000);
                    ui.closeSettings();

                    // Reload after a delay
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else if (userInput !== null) {
                    utils.showNotification('❌ Data reset cancelled - incorrect confirmation', 'error');
                }
            };
        },

        closeSettings: () => {
            state.settingsOpen = false;
            ui.closeModal();
        },

        applyCompactMode: () => {
            if (!ui.container) return;

            if (state.settings.compactMode) {
                ui.container.classList.add('compact');
            } else {
                ui.container.classList.remove('compact');
            }
        },

        updateAccountCounter: () => {
            const counter = document.getElementById('accountCounter');
            if (counter) {
                const numberEl = counter.querySelector('.loginify-counter-number');
                const labelEl = counter.querySelector('.loginify-counter-label');
                if (numberEl && labelEl) {
                    numberEl.textContent = state.accounts.length;
                    labelEl.textContent = state.accounts.length === 1 ? 'account' : 'accounts';
                }
            }
        },

        renderAccounts: () => {
            // Update account counter
            ui.updateAccountCounter();

            const container = document.getElementById('loginify-accounts');
            const filteredAccounts = state.accounts.filter(account => {
                const matchesSearch = account.name.toLowerCase().includes(state.searchQuery.toLowerCase());
                const matchesGroup = state.selectedGroup === 'all' || account.group === state.selectedGroup;
                return matchesSearch && matchesGroup;
            });

            if (filteredAccounts.length === 0) {
                container.innerHTML = `
                    <div class="loginify-empty">
                        <div class="loginify-empty-icon">🎮</div>
                        <div>No accounts found</div>
                        <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">Click "Add Account" to get started!</div>
                        <div style="font-size: 11px; margin-top: 6px; opacity: 0.6; color: var(--loginify-primary-solid);">💡 Double-click accounts to login instantly</div>
                    </div>
                `;
                return;
            }

            // Sort accounts: favorites first, then Nitro accounts, then regular accounts
            const sortedAccounts = filteredAccounts.sort((a, b) => {
                // Favorites first (user-marked)
                if (a.favorite && !b.favorite) return -1;
                if (!a.favorite && b.favorite) return 1;

                // If both are favorites or both are not favorites, check Nitro
                if (a.favorite === b.favorite) {
                    const aNitro = a.userData?.premium_type > 0;
                    const bNitro = b.userData?.premium_type > 0;

                    // Nitro accounts come after favorites but before regular
                    if (aNitro && !bNitro) return -1;
                    if (!aNitro && bNitro) return 1;
                }

                // Then by last used (most recent first)
                if (a.lastUsed && b.lastUsed) return new Date(b.lastUsed) - new Date(a.lastUsed);
                if (a.lastUsed && !b.lastUsed) return -1;
                if (!a.lastUsed && b.lastUsed) return 1;
                return 0;
            });

            container.innerHTML = sortedAccounts.map(account => {
                const isCurrentUser = state.currentToken && state.currentToken === account.token;
                const hasNitro = account.userData?.premium_type > 0;

                // Status text - show Nitro status for Nitro accounts
                let statusText;
                if (isCurrentUser) {
                    statusText = 'Currently logged in';
                } else if (hasNitro) {
                    statusText = account.lastUsed ?
                        `Last used ${new Date(account.lastUsed).toLocaleDateString()}` :
                        'Nitro Active';
                } else {
                    statusText = account.lastUsed ?
                        `Last used ${new Date(account.lastUsed).toLocaleDateString()}` :
                        'Never used';
                }

                return `
                    <div class="loginify-account ${account.favorite ? 'favorite' : ''} ${isCurrentUser ? 'current' : ''} ${hasNitro ? 'nitro' : ''}"
                         data-id="${account.id}" title="Double-click to login">
                        <div class="loginify-avatar">
                            ${account.avatar ?
                                `<img src="${account.avatar}" alt="${utils.escapeHtml(account.name)}" />` :
                                account.name.charAt(0).toUpperCase()
                            }
                            ${isCurrentUser ? '<div class="loginify-current-indicator">✓</div>' : ''}
                            ${hasNitro ? '<div class="loginify-nitro-indicator">💎</div>' : ''}
                        </div>
                        <div class="loginify-account-info">
                            <div class="loginify-account-name">
                                ${utils.escapeHtml(account.name)}
                                ${isCurrentUser ? '<span class="loginify-current-badge">Current</span>' : ''}
                                ${hasNitro ? '<span class="loginify-nitro-badge">Nitro</span>' : ''}
                            </div>
                            ${account.userData?.username ? `<div class="loginify-discord-username">@${account.userData.username}${account.userData.discriminator ? '#' + account.userData.discriminator : ''}</div>` : ''}
                            ${account.userData?.email ? `<div class="loginify-account-email">${account.userData.email}</div>` : ''}
                            <div class="loginify-account-status">
                                <div class="loginify-status-dot ${isCurrentUser ? 'current' : ''} ${hasNitro ? 'nitro' : ''}"></div>
                                ${statusText}
                                ${hasNitro ? ' <span class="loginify-nitro-status">• Premium</span>' : ''}
                            </div>
                        </div>
                        <div class="loginify-account-actions">
                            <button class="loginify-action-btn" data-action="login-new-tab" data-id="${account.id}" title="Login in new tab">
                                ↗️
                            </button>
                            <button class="loginify-action-btn" data-action="favorite" data-id="${account.id}" title="Toggle favorite">
                                ${account.favorite ? '⭐' : '☆'}
                            </button>
                            <button class="loginify-action-btn" data-action="delete" data-id="${account.id}" title="Delete account">🗑️</button>
                        </div>
                    </div>
                `;
            }).join('');
        },

        showModal: (title, content) => {
            if (ui.modal) ui.modal.remove();

            ui.modal = document.createElement('div');
            ui.modal.className = 'loginify-modal';
            ui.modal.innerHTML = `
                <div class="loginify-modal-content" id="modalContent">
                    <div class="loginify-modal-header">
                        <h3>${title}</h3>
                        <button class="loginify-close-btn" id="modalCloseBtn">✕</button>
                    </div>
                    <div class="loginify-modal-body">
                        ${content}
                    </div>
                </div>
            `;

            document.body.appendChild(ui.modal);
            setTimeout(() => ui.modal.classList.add('show'), 100);

            // Attach all close/cancel button handlers
            const closeButtons = [
                'modalCloseBtn',      // X button
                'cancelBtn',          // Add Account cancel
                'importCancelBtn',    // Import cancel
                'checkerCloseBtn'     // Token Checker close
            ];

            closeButtons.forEach(btnId => {
                const btn = document.getElementById(btnId);
                if (btn) {
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        ui.closeModal();
                    };
                    // Close handler attached successfully
                } else {
                    // Button not found (normal for some modals)
                }
            });

            // Special handler for settings cancel button
            const settingsCancelBtn = document.getElementById('settingsCancelBtn');
            if (settingsCancelBtn) {
                settingsCancelBtn.onclick = (e) => {
                    e.stopPropagation();
                    ui.closeSettings();
                };
                // Settings cancel handler attached
            } else {
                // Settings cancel button not found (normal for non-settings modals)
            }

            // Prevent clicks inside modal content from closing modal
            const modalContent = document.getElementById('modalContent');
            if (modalContent) {
                modalContent.onclick = (e) => {
                    e.stopPropagation();
                };
            }

            // Allow click outside to close (on modal background)
            ui.modal.onclick = (e) => {
                // Only close if clicking directly on the modal background
                if (e.target === ui.modal) {
                    ui.closeModal();
                }
            };

            // Add escape key to close
            const handleEscape = (e) => {
                if (e.key === 'Escape' && ui.modal) {
                    // ESC key pressed - close modal
                    if (state.settingsOpen) {
                        ui.closeSettings();
                    } else {
                        ui.closeModal();
                    }
                }
            };
            document.addEventListener('keydown', handleEscape);

            // Store the escape handler for cleanup
            ui.modal._escapeHandler = handleEscape;

            // Modal fully initialized with all close handlers
        },

        closeModal: () => {
            if (!ui.modal) {
                return;
            }

            // Remove escape key handler if it exists
            if (ui.modal._escapeHandler) {
                document.removeEventListener('keydown', ui.modal._escapeHandler);
            }

            ui.modal.classList.remove('show');
            setTimeout(() => {
                if (ui.modal) {
                    ui.modal.remove();
                    ui.modal = null;
                }
            }, 300);
        },

        showAddAccountModal: () => {
            const currentToken = utils.getCurrentToken();
            const content = `
                <form id="loginify-add-form">
                    <div class="loginify-form-group">
                        <label class="loginify-label">Account Name *</label>
                        <input type="text" class="loginify-input" name="name" placeholder="My Discord Account" required />
                    </div>

                    <div class="loginify-form-group">
                        <label class="loginify-label">Discord Token *</label>
                        <div class="loginify-token-input-wrapper">
                            <input type="password" class="loginify-input" name="token" placeholder="Enter your Discord token" required />
                            <div class="loginify-token-actions">
                                ${currentToken ? `<button type="button" class="loginify-token-btn" id="useCurrentToken" title="Use current session token">📋 Use Current</button>` : ''}
                                <button type="button" class="loginify-token-btn" id="pasteToken" title="Paste from clipboard">📥 Paste</button>
                            </div>
                        </div>
                        <div class="loginify-form-hint">
                            💡 Get your token: Press F12 → Console → Type <code>localStorage.token</code>
                        </div>
                    </div>

                    <div class="loginify-form-group">
                        <label class="loginify-label">Avatar URL (optional)</label>
                        <input type="url" class="loginify-input" name="avatar" placeholder="Will be auto-fetched if user data extraction is enabled" />
                    </div>

                    <div class="loginify-form-group">
                        <label class="loginify-label">Group</label>
                        <input type="text" class="loginify-input" name="group" placeholder="default" value="default" />
                    </div>

                    <div class="loginify-form-group">
                        <div class="loginify-checkbox-group">
                            <label class="loginify-checkbox">
                                <input type="checkbox" name="favorite" />
                                <span>⭐ Mark as favorite</span>
                            </label>
                        </div>
                    </div>

                    <div class="loginify-form-actions">
                        <button type="submit" class="loginify-btn-primary">➕ Add Account</button>
                        <button type="button" class="loginify-btn-secondary" id="cancelBtn">Cancel</button>
                    </div>
                </form>
            `;

            ui.showModal('➕ Add New Account', content);

            // Auto-fill current token if available
            if (currentToken) {
                document.getElementById('useCurrentToken').onclick = () => {
                    document.querySelector('input[name="token"]').value = currentToken;
                    utils.showNotification('📋 Current token inserted!', 'success', 1500);
                };
            }

            // Paste from clipboard
            document.getElementById('pasteToken').onclick = async () => {
                try {
                    const text = await navigator.clipboard.readText();
                    if (utils.validateToken(text)) {
                        document.querySelector('input[name="token"]').value = text;
                        utils.showNotification('📥 Token pasted from clipboard!', 'success', 1500);
                    } else {
                        utils.showNotification('❌ Invalid token in clipboard', 'error');
                    }
                } catch (error) {
                    utils.showNotification('❌ Could not access clipboard', 'error');
                }
            };

            document.getElementById('loginify-add-form').onsubmit = async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const token = formData.get('token').trim();

                if (!utils.validateToken(token)) {
                    utils.showNotification('❌ Invalid token format', 'error');
                    return;
                }

                await core.addAccount({
                    name: formData.get('name').trim(),
                    token: token,
                    avatar: formData.get('avatar').trim(),
                    group: formData.get('group').trim() || 'default',
                    favorite: formData.get('favorite') === 'on'
                });

                ui.closeModal();
            };
        },

        showImportModal: () => {
            const content = `
                <div class="loginify-import">
                    <h3>📥 Import Accounts</h3>
                    <p>Select a Loginify export file to import accounts and settings.</p>

                    <div class="loginify-file-drop" id="fileDropZone">
                        <div class="loginify-file-drop-content">
                            <div class="loginify-file-drop-icon">📁</div>
                            <div class="loginify-file-drop-text">
                                <strong>Drop your export file here</strong><br>
                                or click to browse
                            </div>
                        </div>
                        <input type="file" id="fileInput" accept=".json" style="display: none;" />
                    </div>

                    <div class="loginify-import-actions">
                        <button class="loginify-btn-primary" onclick="document.getElementById('fileInput').click()">
                            📂 Browse Files
                        </button>
                        <button class="loginify-btn-secondary" id="importCancelBtn">Cancel</button>
                    </div>
                </div>
            `;

            ui.showModal('📥 Import Accounts', content);

            const fileInput = document.getElementById('fileInput');
            const dropZone = document.getElementById('fileDropZone');

            // File drop handling
            dropZone.ondragover = (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            };

            dropZone.ondragleave = () => {
                dropZone.classList.remove('drag-over');
            };

            dropZone.ondrop = (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    handleFileImport(files[0]);
                }
            };

            dropZone.onclick = () => fileInput.click();

            fileInput.onchange = (e) => {
                if (e.target.files.length > 0) {
                    handleFileImport(e.target.files[0]);
                }
            };

            const handleFileImport = (file) => {
                if (!file.name.endsWith('.json')) {
                    utils.showNotification('❌ Please select a JSON file', 'error');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    core.importAccounts(e.target.result);
                    ui.closeModal();
                };
                reader.readAsText(file);
            };
        },

        showTokenCheckerModal: () => {
            const content = `
                <div class="loginify-token-checker">
                    <div class="loginify-checker-header">
                        <h3>🔍 Professional Token Checker</h3>
                        <p>Validate Discord tokens with advanced proxy support and comprehensive analytics</p>
                    </div>

                    <div class="loginify-checker-tabs">
                        <button class="loginify-tab-btn active" data-tab="input">📝 Input Tokens</button>
                        <button class="loginify-tab-btn" data-tab="proxy">🌐 Proxy Config</button>
                        <button class="loginify-tab-btn" data-tab="settings">⚙️ Settings</button>
                        <button class="loginify-tab-btn" data-tab="results">📊 Results</button>
                    </div>

                    <div class="loginify-tab-content">
                        <!-- Input Tab -->
                        <div class="loginify-tab-panel active" data-panel="input">
                            <div class="loginify-input-methods">
                                <div class="loginify-input-method">
                                    <label class="loginify-label">📁 Upload Token File (.txt)</label>
                                    <div class="loginify-file-upload">
                                        <input type="file" id="tokenFile" accept=".txt" style="display: none;" />
                                        <button class="loginify-upload-btn" id="tokenFileBrowse">
                                            📂 Browse Files
                                        </button>
                                        <span class="loginify-file-info" id="fileInfo">No file selected</span>
                                    </div>
                                </div>

                                <div class="loginify-input-divider"></div>

                                <div class="loginify-input-method">
                                    <label class="loginify-label">📝 Paste Tokens (One per line)</label>
                                    <textarea class="loginify-token-textarea" id="tokenTextarea"
                                        placeholder="Paste your tokens here (one per line)...
Example:
NjM1NTA3NDk5MTc2NDI3NTMx.GN82hw.lWjaAj9r5rtdAC3MMgWFPaknsOBK0jsjnD0WeI
ODM1NTA3NDk5MTc2NDI3NTMx.BN82hw.mWjaAj9r5rtdAC3MMgWFPaknsOBK0jsjnD0WeZ"></textarea>
                                    <div class="loginify-token-count">Tokens: <span id="tokenCount">0</span></div>
                                </div>
                            </div>
                        </div>

                        <!-- Proxy Tab -->
                        <div class="loginify-tab-panel" data-panel="proxy">
                            <div class="loginify-proxy-config">
                                <div class="loginify-form-group">
                                    <label class="loginify-checkbox">
                                        <input type="checkbox" id="useProxy" />
                                        <span>🌐 Enable Proxy Support</span>
                                    </label>
                                    <div class="loginify-form-hint">
                                        ⚠️ Note: Browser userscripts have limited proxy support. For full proxy functionality, consider using browser proxy extensions or network-level configuration.
                                    </div>
                                </div>

                                <div class="loginify-proxy-settings" id="proxySettings" style="display: none;">
                                    <div class="loginify-form-group">
                                        <label class="loginify-label">Proxy Format</label>
                                        <select class="loginify-select" id="proxyFormat">
                                            <option value="hostname:port:username:password">hostname:port:username:password</option>
                                            <option value="username:password@hostname:port">username:password@hostname:port</option>
                                        </select>
                                    </div>

                                    <div class="loginify-form-group">
                                        <label class="loginify-label">📁 Upload Proxy List (.txt)</label>
                                        <div class="loginify-file-upload">
                                            <input type="file" id="proxyFile" accept=".txt" style="display: none;" />
                                            <button class="loginify-upload-btn" id="proxyFileBrowse">
                                                📂 Browse Proxies
                                            </button>
                                            <span class="loginify-file-info" id="proxyFileInfo">No file selected</span>
                                        </div>
                                    </div>

                                    <div class="loginify-form-group">
                                        <label class="loginify-label">📝 Paste Proxies (One per line)</label>
                                        <textarea class="loginify-proxy-textarea" id="proxyTextarea"
                                            placeholder="Paste your proxies here...
Example (hostname:port:username:password):
192.168.1.100:8080:user123:pass456
proxy.example.com:3128:myuser:mypass

Example (username:password@hostname:port):
user123:pass456@192.168.1.100:8080
myuser:mypass@proxy.example.com:3128"></textarea>
                                        <div class="loginify-proxy-count">Proxies: <span id="proxyCount">0</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Settings Tab -->
                        <div class="loginify-tab-panel" data-panel="settings">
                            <div class="loginify-checker-settings">
                                <div class="loginify-setting-group">
                                    <label class="loginify-setting-label">⚡ Rate Limiting</label>
                                    <div class="loginify-rate-controls">
                                        <div class="loginify-rate-setting">
                                            <label>Delay between requests (ms):</label>
                                            <input type="range" id="requestDelay" min="50" max="2000" value="100" />
                                            <span id="delayValue">100ms</span>
                                        </div>
                                        <div class="loginify-rate-setting">
                                            <label>Concurrent requests:</label>
                                            <input type="range" id="concurrentRequests" min="1" max="10" value="3" />
                                            <span id="concurrentValue">3</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="loginify-setting-group">
                                    <label class="loginify-setting-label">💾 Smart Save Options</label>
                                    <div class="loginify-save-options">
                                        <div class="loginify-save-mode">
                                            <label class="loginify-label">Save Mode</label>
                                            <select class="loginify-select" id="saveMode">
                                                <option value="none">🚫 Don't save any accounts</option>
                                                <option value="all" selected>💾 Save all valid accounts</option>
                                                <option value="nitro">💎 Save only Nitro accounts</option>
                                                <option value="verified">✅ Save only verified accounts (email + phone)</option>
                                                <option value="custom">🎛️ Custom save criteria</option>
                                            </select>
                                        </div>

                                        <div class="loginify-custom-save" id="customSaveOptions" style="display: none;">
                                            <div class="loginify-custom-criteria">
                                                <label class="loginify-checkbox">
                                                    <input type="checkbox" id="saveNitroOnly" />
                                                    <span>💎 Must have Nitro subscription</span>
                                                </label>
                                                <label class="loginify-checkbox">
                                                    <input type="checkbox" id="saveEmailVerified" />
                                                    <span>📧 Must have verified email</span>
                                                </label>
                                                <label class="loginify-checkbox">
                                                    <input type="checkbox" id="savePhoneVerified" />
                                                    <span>📱 Must have verified phone</span>
                                                </label>
                                                <label class="loginify-checkbox">
                                                    <input type="checkbox" id="saveHighValue" />
                                                    <span>⭐ High-value accounts only (Nitro + Email + Phone)</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div class="loginify-save-settings">
                                            <label class="loginify-checkbox">
                                                <input type="checkbox" id="overwriteDuplicates" />
                                                <span>🔄 Overwrite existing accounts with same token</span>
                                            </label>
                                            <label class="loginify-checkbox">
                                                <input type="checkbox" id="autoFavoriteNitro" checked />
                                                <span>⭐ Auto-favorite Nitro accounts</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="loginify-setting-group">
                                    <label class="loginify-setting-label">🔧 Advanced Options</label>
                                    <div class="loginify-checkbox-group">
                                        <label class="loginify-checkbox">
                                            <input type="checkbox" id="fetchUserData" checked />
                                            <span>👤 Fetch detailed user information</span>
                                        </label>
                                        <label class="loginify-checkbox">
                                            <input type="checkbox" id="checkNitro" checked />
                                            <span>💎 Check Nitro subscription status</span>
                                        </label>
                                        <label class="loginify-checkbox">
                                            <input type="checkbox" id="exportResults" checked />
                                            <span>📁 Auto-export results when complete</span>
                                        </label>
                                        <label class="loginify-checkbox">
                                            <input type="checkbox" id="showDetailedStats" checked />
                                            <span>📊 Show detailed account statistics</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Results Tab -->
                        <div class="loginify-tab-panel" data-panel="results">
                            <div class="loginify-results-container">
                                <div class="loginify-stats-grid">
                                    <div class="loginify-stat-card">
                                        <div class="loginify-stat-number" id="totalChecked">0</div>
                                        <div class="loginify-stat-label">📊 Total Checked</div>
                                    </div>
                                    <div class="loginify-stat-card valid">
                                        <div class="loginify-stat-number" id="validTokens">0</div>
                                        <div class="loginify-stat-label">✅ Valid Tokens</div>
                                    </div>
                                    <div class="loginify-stat-card invalid">
                                        <div class="loginify-stat-number" id="invalidTokens">0</div>
                                        <div class="loginify-stat-label">❌ Invalid Tokens</div>
                                    </div>
                                    <div class="loginify-stat-card nitro">
                                        <div class="loginify-stat-number" id="nitroTokens">0</div>
                                        <div class="loginify-stat-label">🚀 Nitro Accounts</div>
                                    </div>
                                </div>

                                <div class="loginify-detailed-stats" id="detailedStats" style="display: none;">
                                    <div class="loginify-stats-grid">
                                        <div class="loginify-stat-card verified">
                                            <div class="loginify-stat-number" id="emailVerifiedTokens">0</div>
                                            <div class="loginify-stat-label">📧 Email Verified</div>
                                        </div>
                                        <div class="loginify-stat-card verified">
                                            <div class="loginify-stat-number" id="phoneVerifiedTokens">0</div>
                                            <div class="loginify-stat-label">📱 Phone Verified</div>
                                        </div>
                                        <div class="loginify-stat-card premium">
                                            <div class="loginify-stat-number" id="highValueTokens">0</div>
                                            <div class="loginify-stat-label">💎 High Value</div>
                                        </div>
                                        <div class="loginify-stat-card saved">
                                            <div class="loginify-stat-number" id="savedTokens">0</div>
                                            <div class="loginify-stat-label">💾 Saved to List</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="loginify-progress-section">
                                    <div class="loginify-progress-header">
                                        <span>Progress</span>
                                        <span id="progressText">0%</span>
                                    </div>
                                    <div class="loginify-progress-bar">
                                        <div class="loginify-progress-fill" id="progressFill"></div>
                                    </div>
                                    <div class="loginify-time-stats">
                                        <span>Elapsed: <span id="elapsedTime">00:00</span></span>
                                        <span>ETA: <span id="estimatedTime">--:--</span></span>
                                    </div>
                                </div>

                                <div class="loginify-results-log" id="resultsLog">
                                    <div class="loginify-log-placeholder">
                                        🔍 Results will appear here during checking...
                                    </div>
                                </div>

                                <div class="loginify-export-buttons">
                                    <button class="loginify-export-btn valid" id="exportValid" disabled>📥 Export Valid (0)</button>
                                    <button class="loginify-export-btn invalid" id="exportInvalid" disabled>📥 Export Invalid (0)</button>
                                    <button class="loginify-export-btn nitro" id="exportNitro" disabled>📥 Export Nitro (0)</button>
                                    <button class="loginify-export-btn all" id="exportAll" disabled>📥 Export All Results</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="loginify-checker-actions">
                        <button class="loginify-btn-primary" id="startChecking" disabled>🚀 Start Token Checking</button>
                        <button class="loginify-btn-secondary" id="stopChecking" disabled>⏹️ Stop Checking</button>
                        <button class="loginify-btn-secondary" id="checkerCloseBtn">❌ Close</button>
                    </div>
                </div>
            `;

            ui.showModal('🔍 Token Checker', content);
            ui.initTokenChecker();
        },

        initTokenChecker: () => {
            // Initialize token checker functionality
            const tabs = document.querySelectorAll('.loginify-tab-btn');
            const panels = document.querySelectorAll('.loginify-tab-panel');

            // Tab switching
            tabs.forEach(tab => {
                tab.onclick = () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    panels.forEach(p => p.classList.remove('active'));

                    tab.classList.add('active');
                    const targetPanel = document.querySelector(`[data-panel="${tab.dataset.tab}"]`);
                    if (targetPanel) targetPanel.classList.add('active');
                };
            });

            // File browse button handlers
            document.getElementById('tokenFileBrowse').onclick = () => {
                document.getElementById('tokenFile').click();
            };

            document.getElementById('proxyFileBrowse').onclick = () => {
                document.getElementById('proxyFile').click();
            };

            // File upload handlers
            document.getElementById('tokenFile').onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (!file.name.toLowerCase().endsWith('.txt')) {
                        utils.showNotification('⚠️ Please select a .txt file!', 'warning');
                        return;
                    }
                    document.getElementById('fileInfo').textContent = `📁 ${file.name}`;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const content = e.target.result;
                        document.getElementById('tokenTextarea').value = content;
                        ui.updateTokenCount();
                        utils.showNotification(`📂 Loaded ${content.split('\n').filter(l => l.trim()).length} tokens!`, 'success');
                    };
                    reader.onerror = () => {
                        utils.showNotification('❌ Failed to read file!', 'error');
                    };
                    reader.readAsText(file);
                } else {
                    document.getElementById('fileInfo').textContent = 'No file selected';
                }
            };

            document.getElementById('proxyFile').onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (!file.name.toLowerCase().endsWith('.txt')) {
                        utils.showNotification('⚠️ Please select a .txt file!', 'warning');
                        return;
                    }
                    document.getElementById('proxyFileInfo').textContent = `📁 ${file.name}`;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const content = e.target.result;
                        document.getElementById('proxyTextarea').value = content;
                        ui.updateProxyCount();
                        utils.showNotification(`📂 Loaded ${content.split('\n').filter(l => l.trim()).length} proxies!`, 'success');
                    };
                    reader.onerror = () => {
                        utils.showNotification('❌ Failed to read file!', 'error');
                    };
                    reader.readAsText(file);
                } else {
                    document.getElementById('proxyFileInfo').textContent = 'No file selected';
                }
            };

            // Proxy toggle
            document.getElementById('useProxy').onchange = (e) => {
                const proxySettings = document.getElementById('proxySettings');
                proxySettings.style.display = e.target.checked ? 'block' : 'none';
            };

            // Live updates
            document.getElementById('tokenTextarea').oninput = ui.updateTokenCount;
            document.getElementById('proxyTextarea').oninput = ui.updateProxyCount;

            // Rate limiting sliders
            const delaySlider = document.getElementById('requestDelay');
            const delayValue = document.getElementById('delayValue');
            delaySlider.oninput = () => delayValue.textContent = delaySlider.value + 'ms';

            const concurrentSlider = document.getElementById('concurrentRequests');
            const concurrentValue = document.getElementById('concurrentValue');
            concurrentSlider.oninput = () => concurrentValue.textContent = concurrentSlider.value;

            // Save mode dropdown handler
            document.getElementById('saveMode').onchange = (e) => {
                const customOptions = document.getElementById('customSaveOptions');
                if (e.target.value === 'custom') {
                    customOptions.style.display = 'block';
                } else {
                    customOptions.style.display = 'none';
                }
            };

            // Start checking button
            document.getElementById('startChecking').onclick = () => core.startTokenChecking();
            document.getElementById('stopChecking').onclick = () => core.stopTokenChecking();

            // Export buttons
            document.getElementById('exportValid').onclick = () => core.exportResults('valid');
            document.getElementById('exportInvalid').onclick = () => core.exportResults('invalid');
            document.getElementById('exportNitro').onclick = () => core.exportResults('nitro');
            document.getElementById('exportAll').onclick = () => core.exportResults('all');

            // Show detailed stats toggle
            const showDetailedStatsEl = document.getElementById('showDetailedStats');
            if (showDetailedStatsEl) {
                showDetailedStatsEl.onchange = () => {
                    const detailedStats = document.getElementById('detailedStats');
                    if (detailedStats) {
                        detailedStats.style.display = showDetailedStatsEl.checked ? 'block' : 'none';
                        if (showDetailedStatsEl.checked) {
                            core.updateCheckingProgress(); // Refresh detailed stats
                        }
                    }
                };
            }
        },

        updateTokenCount: () => {
            const textarea = document.getElementById('tokenTextarea');
            const tokens = textarea.value.trim().split('\n').filter(t => t.trim().length > 0);
            document.getElementById('tokenCount').textContent = tokens.length;
            document.getElementById('startChecking').disabled = tokens.length === 0;
        },

        updateProxyCount: () => {
            const textarea = document.getElementById('proxyTextarea');
            const proxies = textarea.value.trim().split('\n').filter(p => p.trim().length > 0);
            document.getElementById('proxyCount').textContent = proxies.length;
        },

        attachEventListeners: () => {
            // Enhanced header drag functionality with smooth performance
            let isDragging = false;
            let dragOffset = { x: 0, y: 0 };

            ui.container.querySelector('.loginify-header').onmousedown = (e) => {
                if (e.target.tagName === 'BUTTON') return;
                isDragging = true;
                state.dragStart = { x: e.clientX, y: e.clientY };
                dragOffset.x = e.clientX - state.position.x;
                dragOffset.y = e.clientY - state.position.y;
                ui.container.style.cursor = 'grabbing';
                ui.container.style.willChange = 'transform';
                ui.container.style.userSelect = 'none';
            };

            document.onmousemove = (e) => {
                if (!isDragging) return;

                // Use requestAnimationFrame for smooth 60fps movement
                requestAnimationFrame(() => {
                    state.position.x = e.clientX - dragOffset.x;
                    state.position.y = e.clientY - dragOffset.y;

                    // Smooth boundaries
                    state.position.x = Math.max(0, Math.min(window.innerWidth - ui.container.offsetWidth, state.position.x));
                    state.position.y = Math.max(0, Math.min(window.innerHeight - ui.container.offsetHeight, state.position.y));

                    ui.container.style.left = state.position.x + 'px';
                    ui.container.style.top = state.position.y + 'px';
                });
            };

            document.onmouseup = () => {
                if (isDragging) {
                    isDragging = false;
                    ui.container.style.cursor = '';
                    ui.container.style.willChange = 'auto';
                    ui.container.style.userSelect = '';
                    utils.saveData();
                }
            };

            // Search functionality
            const searchInput = ui.container.querySelector('.loginify-search-input');
            searchInput.oninput = utils.debounce((e) => {
                state.searchQuery = e.target.value;
                ui.renderAccounts();
            }, 200);

            // Button click handlers
            ui.container.onclick = (e) => {
                const action = e.target.dataset.action;
                const id = e.target.dataset.id;

                switch (action) {
                    case 'close':
                        ui.toggle();
                        break;
                    case 'stealth':
                        ui.toggleStealth();
                        break;
                    case 'about':
                        ui.showAbout();
                        break;
                    case 'settings':
                        ui.showSettings();
                        break;
                    case 'add-account':
                        ui.showAddAccountModal();
                        break;
                    case 'token-checker':
                        ui.showTokenCheckerModal();
                        break;
                    case 'validate-all':
                        if (state.accounts.length === 0) {
                            utils.showNotification('❌ No accounts to validate', 'error');
                        } else {
                            utils.validateAllTokens();
                        }
                        break;
                    case 'import':
                        ui.showImportModal();
                        break;
                    case 'export':
                        core.exportAccounts();
                        break;
                    case 'login-new-tab':
                        const account = state.accounts.find(a => a.id === id);
                        if (account) {
                            core.login(account.token, id, 'newTab');
                        }
                        break;
                    case 'favorite':
                        core.toggleFavorite(id);
                        break;
                    case 'delete':
                        if (confirm('Are you sure you want to delete this account?')) {
                            core.deleteAccount(id);
                        }
                        break;
                }
            };

            // Account double-click for login
            ui.container.addEventListener('dblclick', (e) => {
                const accountElement = e.target.closest('.loginify-account');
                if (accountElement && !e.target.closest('.loginify-account-actions')) {
                    const accountId = accountElement.dataset.id;
                    const account = state.accounts.find(a => a.id === accountId);
                    if (account) {
                        accountElement.classList.add('loginify-pulse');
                        core.login(account.token, accountId);
                    }
                }
            });

            // Single click for account selection/info
            ui.container.addEventListener('click', (e) => {
                const accountElement = e.target.closest('.loginify-account');
                if (accountElement && !e.target.closest('.loginify-account-actions')) {
                    // Add visual feedback for single click
                    accountElement.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        accountElement.style.transform = '';
                    }, 150);
                }
            });

            // Keyboard shortcuts
            document.onkeydown = (e) => {
                // Toggle UI: Ctrl+Shift+D
                if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                    e.preventDefault();
                    ui.toggle();
                }

                // Stealth mode: Ctrl+Alt+S (case insensitive)
                if (e.ctrlKey && e.altKey && (e.key === 'S' || e.key === 's')) {
                    e.preventDefault();
                    ui.toggleStealth();
                }

                // Quick triple-press Alt for emergency hide
                if (e.key === 'Alt') {
                    const now = Date.now();
                    if (now - state.lastToggle < 1000) {
                        ui.enableStealth();
                    }
                    state.lastToggle = now;
                }

                // Escape to close
                if (e.key === 'Escape') {
                    if (state.settingsOpen) {
                        ui.closeSettings();
                    } else if (state.isVisible) {
                        ui.toggle();
                    }
                }
            };
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            await core.detectCurrentUser();
            ui.init();
        });
    } else {
        (async () => {
            await core.detectCurrentUser();
            ui.init();
        })();
    }

    // Emergency stealth toggle: Double-click page background when stealth is active
    let lastBackgroundClick = 0;
    document.addEventListener('click', (e) => {
        if (state.stealthMode && (e.target === document.body || e.target === document.documentElement)) {
            const now = Date.now();
            if (now - lastBackgroundClick < 500) {
                ui.toggleStealth();
            }
            lastBackgroundClick = now;
        }
    });

    // Show welcome message for new users
    if (state.accounts.length === 0) {
        setTimeout(() => {
            utils.showNotification(`🚀 Welcome to ${CONFIG.name}! ${CONFIG.tagline}`, 'success', 5000);
            setTimeout(() => {
                utils.showNotification('💡 Pro tip: Use Ctrl+Shift+D to toggle, Ctrl+Alt+S for stealth mode!', 'warning', 4000);
            }, 3000);
            setTimeout(() => {
                utils.showNotification('🔍 NEW: Professional Token Checker with bulk validation, proxy support & export!', 'info', 6000);
            }, 8000);
        }, 1000);
    }

    // FORCE apply saved theme settings IMMEDIATELY and PERSISTENTLY on startup
    const applySavedTheme = () => {
        // Apply theme via utils function
        utils.updateTheme(state.settings.primaryColor, state.settings.secondaryColor, state.settings.accentColor);

        // FORCE CSS variables directly as backup
        document.documentElement.style.setProperty('--loginify-primary-color', state.settings.primaryColor);
        document.documentElement.style.setProperty('--loginify-secondary-color', state.settings.secondaryColor);
        document.documentElement.style.setProperty('--loginify-accent-color', state.settings.accentColor);

        // EXTRA AGGRESSIVE: Set on both html and body elements
        document.body.style.setProperty('--loginify-primary-color', state.settings.primaryColor);
        document.body.style.setProperty('--loginify-secondary-color', state.settings.secondaryColor);
        document.body.style.setProperty('--loginify-accent-color', state.settings.accentColor);

        console.log('🎨 Loginify: Applied saved theme on startup', {
            primary: state.settings.primaryColor,
            secondary: state.settings.secondaryColor,
            accent: state.settings.accentColor,
            scheme: state.settings.colorScheme
        });
    };

    // Apply theme IMMEDIATELY (before DOM is even ready)
    applySavedTheme();

    // Apply theme when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applySavedTheme);
    }

    // Apply theme again after short delays to ensure it sticks
    setTimeout(applySavedTheme, 10);
    setTimeout(applySavedTheme, 50);
    setTimeout(applySavedTheme, 200);
    setTimeout(applySavedTheme, 500);

    // Apply other saved settings on startup
    setTimeout(() => {
        // Apply compact mode if enabled
        if (state.settings.compactMode) {
            document.documentElement.classList.add('loginify-compact');
        }

        // Apply animation speed
        document.documentElement.style.setProperty('--loginify-animation-speed',
            state.settings.animationSpeed === 'slow' ? '0.8s' :
            state.settings.animationSpeed === 'fast' ? '0.3s' : '0.5s'
        );

                 console.log('⚙️ Loginify: Applied all saved settings on startup', state.settings);

         // Debug: Show what's actually stored
         console.log('💾 Loginify: Storage debug', {
             storedSettings: GM_getValue(CONFIG.storageKeys.settings, {}),
             currentState: state.settings,
             defaultSettings: DEFAULT_SETTINGS
         });

         // Set up theme persistence watcher to reapply if overridden
         const themeWatcher = new MutationObserver(() => {
             const currentPrimary = getComputedStyle(document.documentElement).getPropertyValue('--loginify-primary-color').trim();
             if (!currentPrimary || currentPrimary !== state.settings.primaryColor) {
                 console.log('🔧 Loginify: Theme was overridden, reapplying...');
                 applySavedTheme();
             }
         });

         // Watch for style changes that might override our theme
         themeWatcher.observe(document.head, { childList: true, subtree: true });
         themeWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
    }, 100);

    // Check if auto-validation is due (after 3 seconds to not interfere with startup)
    setTimeout(() => {
        utils.checkAutoValidation();
    }, 3000);



})();