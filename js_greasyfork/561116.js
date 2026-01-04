// ==UserScript==
// @name         Torn $1 Rainbow Glow - Multi-Theme Edition
// @namespace    http://torn.com/
// @version      2.0
// @description  Spot $1 items with customizable themes! Rainbow, Gold, Silver, Celebrate, and more.
// @author       srsbsns
// @match        *://www.torn.com/bazaar.php*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561116/Torn%20%241%20Rainbow%20Glow%20-%20Multi-Theme%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/561116/Torn%20%241%20Rainbow%20Glow%20-%20Multi-Theme%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const THEME_KEY = 'torn_dollar_theme';
    let currentTheme = GM_getValue(THEME_KEY, 'rainbow');

    // Define all available themes
    const themes = {
        rainbow: {
            name: '🌈 Rainbow',
            icon: '⭐',
            background: `linear-gradient(90deg,
                rgba(255, 0, 0, 0.3),
                rgba(255, 165, 0, 0.3),
                rgba(255, 255, 0, 0.3),
                rgba(0, 255, 0, 0.3),
                rgba(0, 0, 255, 0.3),
                rgba(75, 0, 130, 0.3),
                rgba(238, 130, 238, 0.3),
                rgba(255, 0, 0, 0.3))`,
            animation: 'rainbow-flow 6s linear infinite',
            textColor: '#fff',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
            iconAnimation: 'star-sparkle 1.5s infinite ease-in-out'
        },
        gold: {
            name: '💰 Gold Rush',
            icon: '💎',
            background: `linear-gradient(135deg,
                rgba(255, 215, 0, 0.4),
                rgba(255, 193, 37, 0.4),
                rgba(218, 165, 32, 0.4),
                rgba(255, 215, 0, 0.4))`,
            animation: 'gold-shine 3s ease-in-out infinite',
            textColor: '#000',
            textShadow: '1px 1px 3px rgba(255, 215, 0, 0.8)',
            iconAnimation: 'gem-spin 2s linear infinite'
        },
        silver: {
            name: '🥈 Silver Streak',
            icon: '💫',
            background: `linear-gradient(135deg,
                rgba(192, 192, 192, 0.4),
                rgba(211, 211, 211, 0.4),
                rgba(169, 169, 169, 0.4),
                rgba(192, 192, 192, 0.4))`,
            animation: 'silver-gleam 4s ease-in-out infinite',
            textColor: '#000',
            textShadow: '1px 1px 2px rgba(192, 192, 192, 0.8)',
            iconAnimation: 'star-twinkle 1.2s infinite ease-in-out'
        },
        celebrate: {
            name: '🎉 Celebrate',
            icon: '🎊',
            background: `linear-gradient(45deg,
                rgba(255, 20, 147, 0.4),
                rgba(255, 105, 180, 0.4),
                rgba(255, 0, 255, 0.4),
                rgba(148, 0, 211, 0.4),
                rgba(255, 20, 147, 0.4))`,
            animation: 'party-pulse 2s ease-in-out infinite',
            textColor: '#fff',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            iconAnimation: 'party-bounce 0.8s infinite ease-in-out'
        },
        neon: {
            name: '⚡ Neon Nights',
            icon: '✨',
            background: `linear-gradient(90deg,
                rgba(0, 255, 255, 0.3),
                rgba(255, 0, 255, 0.3),
                rgba(255, 255, 0, 0.3),
                rgba(0, 255, 255, 0.3))`,
            animation: 'neon-pulse 2.5s ease-in-out infinite',
            textColor: '#fff',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
            iconAnimation: 'neon-flicker 1s infinite ease-in-out'
        },
        fire: {
            name: '🔥 Fire Storm',
            icon: '🔥',
            background: `linear-gradient(0deg,
                rgba(255, 0, 0, 0.4),
                rgba(255, 69, 0, 0.4),
                rgba(255, 140, 0, 0.4),
                rgba(255, 215, 0, 0.4))`,
            animation: 'fire-flicker 1.5s ease-in-out infinite',
            textColor: '#fff',
            textShadow: '0 0 8px rgba(255, 69, 0, 0.8)',
            iconAnimation: 'fire-dance 0.6s infinite ease-in-out'
        },
        ice: {
            name: '❄️ Ice Crystal',
            icon: '❄️',
            background: `linear-gradient(135deg,
                rgba(173, 216, 230, 0.4),
                rgba(176, 224, 230, 0.4),
                rgba(135, 206, 250, 0.4),
                rgba(173, 216, 230, 0.4))`,
            animation: 'ice-shimmer 3s ease-in-out infinite',
            textColor: '#000',
            textShadow: '1px 1px 3px rgba(173, 216, 230, 0.8)',
            iconAnimation: 'ice-rotate 4s linear infinite'
        },
        stealth: {
            name: '🌑 Stealth Mode',
            icon: '👁️',
            background: `linear-gradient(135deg,
                rgba(40, 40, 40, 0.6),
                rgba(60, 60, 60, 0.6),
                rgba(30, 30, 30, 0.6),
                rgba(40, 40, 40, 0.6))`,
            animation: 'stealth-fade 3s ease-in-out infinite',
            textColor: '#0f0',
            textShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
            iconAnimation: 'eye-blink 3s infinite ease-in-out'
        }
    };

    GM_addStyle(`
        /* Base Animations */
        @keyframes rainbow-flow {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }

        @keyframes gold-shine {
            0%, 100% { background-position: 0% 50%; filter: brightness(1); }
            50% { background-position: 100% 50%; filter: brightness(1.3); }
        }

        @keyframes silver-gleam {
            0%, 100% { background-position: 0% 50%; opacity: 0.9; }
            50% { background-position: 100% 50%; opacity: 1; }
        }

        @keyframes party-pulse {
            0%, 100% { background-position: 0% 50%; transform: scale(1); }
            50% { background-position: 100% 50%; transform: scale(1.02); }
        }

        @keyframes neon-pulse {
            0%, 100% { background-position: 0% 50%; box-shadow: inset 0 0 20px rgba(0, 255, 255, 0.3); }
            50% { background-position: 100% 50%; box-shadow: inset 0 0 30px rgba(255, 0, 255, 0.5); }
        }

        @keyframes fire-flicker {
            0%, 100% { background-position: 0% 0%; filter: brightness(1); }
            25% { background-position: 100% 100%; filter: brightness(1.2); }
            50% { background-position: 0% 100%; filter: brightness(0.9); }
            75% { background-position: 100% 0%; filter: brightness(1.1); }
        }

        @keyframes ice-shimmer {
            0%, 100% { background-position: 0% 50%; filter: brightness(1); }
            50% { background-position: 100% 50%; filter: brightness(1.2); }
        }

        @keyframes stealth-fade {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 0.9; }
        }

        /* Icon Animations */
        @keyframes star-sparkle {
            0%, 100% { opacity: 0.3; transform: scale(0.7) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.1) rotate(20deg); }
        }

        @keyframes gem-spin {
            0% { transform: scale(1) rotate(0deg); filter: brightness(1); }
            50% { transform: scale(1.2) rotate(180deg); filter: brightness(1.5); }
            100% { transform: scale(1) rotate(360deg); filter: brightness(1); }
        }

        @keyframes star-twinkle {
            0%, 100% { opacity: 0.4; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes party-bounce {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-5px) rotate(-10deg); }
            75% { transform: translateY(-5px) rotate(10deg); }
        }

        @keyframes neon-flicker {
            0%, 100% { opacity: 1; filter: brightness(1); }
            50% { opacity: 0.8; filter: brightness(1.3); }
        }

        @keyframes fire-dance {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-3px) scale(1.1); }
        }

        @keyframes ice-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes eye-blink {
            0%, 90%, 100% { opacity: 1; }
            95% { opacity: 0.3; }
        }

        /* Item Styling */
        .dollar-highlight {
            position: relative;
            overflow: hidden !important;
            border-radius: 4px;
            border: none !important;
            background-size: 200% 100% !important;
            box-shadow: inset 0 0 25px rgba(0,0,0,0.5) !important;
            z-index: 10 !important;
        }

        .dollar-icon {
            position: absolute !important;
            right: 10px !important;
            top: 10px !important;
            font-size: 20px !important;
            pointer-events: none !important;
            z-index: 15 !important;
        }

        .dollar-highlight span, .dollar-highlight p, .dollar-highlight div {
            background: transparent !important;
            font-weight: bold !important;
        }

        /* Theme Selector Menu */
        #theme-selector {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #444;
            border-radius: 8px;
            padding: 15px;
            z-index: 99999;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            min-width: 200px;
        }

        #theme-selector h3 {
            margin: 0 0 10px 0;
            color: #fff;
            font-size: 14px;
            text-align: center;
            border-bottom: 1px solid #444;
            padding-bottom: 8px;
        }

        .theme-option {
            display: block;
            width: 100%;
            padding: 8px 12px;
            margin: 5px 0;
            background: #333;
            color: #fff;
            border: 2px solid #555;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 13px;
            text-align: left;
        }

        .theme-option:hover {
            background: #444;
            border-color: #777;
            transform: translateX(3px);
        }

        .theme-option.active {
            background: #0a0;
            border-color: #0f0;
            font-weight: bold;
        }

        #toggle-menu {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4a4a4a, #5a5a5a, #4a4a4a);
            color: #8B7500;
            border: 2px solid #666;
            border-radius: 50%;
            width: 55px;
            height: 55px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            z-index: 99998;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        #toggle-menu:hover {
            background: linear-gradient(135deg, #5a5a5a, #6a6a6a, #5a5a5a);
            transform: scale(1.15) rotate(5deg);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.5);
        }
    `);

    function applyTheme(theme) {
        const themeData = themes[theme];
        if (!themeData) return;

        // Use requestAnimationFrame to prevent blocking
        requestAnimationFrame(() => {
            const items = document.querySelectorAll('li, [class*="bazaar-card"], [class*="item_"], [class*="item___"]');

            items.forEach(item => {
                const textElements = item.querySelectorAll('span, p, div');
                const hasOneDollar = Array.from(textElements).some(el => el.textContent.trim() === '$1');
                const isLocked = item.querySelector('svg[class*="lock"], img[src*="lock"], [class*="locked"]');

                if (hasOneDollar && !isLocked) {
                    if (!item.classList.contains('dollar-highlight')) {
                        item.classList.add('dollar-highlight');
                    }

                    // Apply theme styles
                    item.style.background = themeData.background;
                    item.style.animation = themeData.animation;

                    // Update text colors
                    const textElems = item.querySelectorAll('span, p, div');
                    textElems.forEach(el => {
                        el.style.color = themeData.textColor;
                        el.style.textShadow = themeData.textShadow;
                    });

                    // Add or update icon
                    let icon = item.querySelector('.dollar-icon');
                    if (!icon) {
                        icon = document.createElement('span');
                        icon.className = 'dollar-icon';
                        item.appendChild(icon);
                    }
                    icon.innerText = themeData.icon;
                    icon.style.animation = themeData.iconAnimation;
                } else {
                    item.classList.remove('dollar-highlight');
                    const icon = item.querySelector('.dollar-icon');
                    if (icon) icon.remove();
                    item.style.background = '';
                    item.style.animation = '';
                }
            });
        });
    }

    function createThemeSelector() {
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'toggle-menu';
        toggleBtn.innerHTML = '$1';
        toggleBtn.title = 'Change $1 Item Theme';
        document.body.appendChild(toggleBtn);

        // Create theme menu
        const menu = document.createElement('div');
        menu.id = 'theme-selector';
        menu.style.display = 'none';

        const title = document.createElement('h3');
        title.innerText = '$1 Item Themes';
        menu.appendChild(title);

        Object.keys(themes).forEach(themeKey => {
            const btn = document.createElement('button');
            btn.className = 'theme-option';
            if (themeKey === currentTheme) btn.classList.add('active');
            btn.innerText = themes[themeKey].name;
            btn.onclick = () => {
                currentTheme = themeKey;
                GM_setValue(THEME_KEY, themeKey);
                document.querySelectorAll('.theme-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyTheme(currentTheme);
            };
            menu.appendChild(btn);
        });

        document.body.appendChild(menu);

        // Toggle menu visibility
        toggleBtn.onclick = () => {
            if (menu.style.display === 'none') {
                menu.style.display = 'block';
                toggleBtn.style.display = 'none';
            } else {
                menu.style.display = 'none';
                toggleBtn.style.display = 'flex';
            }
        };

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && e.target !== toggleBtn) {
                menu.style.display = 'none';
                toggleBtn.style.display = 'flex';
            }
        });
    }

    function init() {
        applyTheme(currentTheme);
    }

    // Throttle function to prevent excessive calls
    let throttleTimer = null;
    function throttledApplyTheme() {
        if (throttleTimer) return;
        throttleTimer = setTimeout(() => {
            applyTheme(currentTheme);
            throttleTimer = null;
        }, 300); // Only update every 300ms max
    }

    const observer = new MutationObserver(throttledApplyTheme);
    observer.observe(document.body, { childList: true, subtree: true });

    // Wait for page to load then create menu
    setTimeout(() => {
        createThemeSelector();
        init();
    }, 1000);
})();