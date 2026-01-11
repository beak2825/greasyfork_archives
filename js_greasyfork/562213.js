// ==UserScript==
// @name         Linux.do 更多主题
// @namespace    https://linux.do/
// @version      3.0.0
// @description  为 Linux.do 论坛提供 34 个精心设计的主题样式，支持自定义对比度，自动同步深浅色模式
// @author       kei233
// @match        https://linux.do/*
// @match        https://*.linux.do/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @homepageURL  https://linux.do/t/topic/1361701
// @supportURL   https://linux.do/t/topic/1361701
// @downloadURL https://update.greasyfork.org/scripts/562213/Linuxdo%20%E6%9B%B4%E5%A4%9A%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/562213/Linuxdo%20%E6%9B%B4%E5%A4%9A%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

// ========================================
// 鸣谢 Credits
// ========================================
// - Design Prompts: https://designprompts.dev
// - Kate Tseng's OhMySkills: https://github.com/NakanoSanku/OhMySkills
// - OhMySkills 技能帖: https://linux.do/t/topic/1361701?u=kei233
// ========================================

(function() {
    'use strict';

    // ========================================
    // 20 个精心设计的主题配置
    // ========================================
    const THEMES = {
        // ============ 深色系主题 ============
        'modern-dark': {
            name: 'Modern Dark',
            category: 'dark',
            colors: {
                '--primary': '#EDEDEF',
                '--secondary': '#050506',
                '--tertiary': '#5E6AD2',
                '--quaternary': '#6872D9',
                '--header_background': '#050506',
                '--header_primary': '#EDEDEF',
                '--highlight': '#5E6AD2',
                '--danger': '#e45735',
                '--success': '#1db954',
                '--love': '#fa6c8d',
                'background': 'linear-gradient(135deg, #050506 0%, #0a0a0c 50%, #050506 100%)'
            }
        },
        'cyberpunk': {
            name: 'Cyberpunk',
            category: 'dark',
            colors: {
                '--primary': '#00ff88',
                '--secondary': '#0a0a0f',
                '--tertiary': '#ff00ff',
                '--quaternary': '#00d4ff',
                '--header_background': '#0a0a0f',
                '--header_primary': '#00ff88',
                '--highlight': '#ff00ff',
                '--danger': '#ff3366',
                '--success': '#00ff88',
                '--love': '#ff00ff',
                'background': '#0a0a0f'
            },
            extra: `
                html[data-theme="cyberpunk"] { --font-family: 'JetBrains Mono', monospace; }
                html[data-theme="cyberpunk"] .d-header { border-bottom: 1px solid rgba(0, 255, 136, 0.3); box-shadow: 0 0 20px rgba(0, 255, 136, 0.1); }
            `
        },
        'vaporwave': {
            name: 'Vaporwave',
            category: 'dark',
            colors: {
                '--primary': '#FF00FF',
                '--secondary': '#090014',
                '--tertiary': '#00FFFF',
                '--quaternary': '#FF9900',
                '--header_background': '#090014',
                '--header_primary': '#00FFFF',
                '--highlight': '#FF00FF',
                '--danger': '#FF3366',
                '--success': '#00FF88',
                '--love': '#FF00FF',
                'background': 'linear-gradient(180deg, #090014 0%, #1a0030 100%)'
            },
            extra: `
                html[data-theme="vaporwave"] { --font-family: 'Orbitron', 'Share Tech Mono', monospace; }
            `
        },
        'dracula': {
            name: 'Dracula',
            category: 'dark',
            colors: {
                '--primary': '#f8f8f2',
                '--secondary': '#282a36',
                '--tertiary': '#bd93f9',
                '--quaternary': '#ff79c6',
                '--header_background': '#282a36',
                '--header_primary': '#f8f8f2',
                '--highlight': '#ffb86c',
                '--danger': '#ff5555',
                '--success': '#50fa7b',
                '--love': '#ff79c6',
                'background': '#282a36'
            }
        },
        'nord': {
            name: 'Nord',
            category: 'dark',
            colors: {
                '--primary': '#eceff4',
                '--secondary': '#2e3440',
                '--tertiary': '#88c0d0',
                '--quaternary': '#5e81ac',
                '--header_background': '#2e3440',
                '--header_primary': '#eceff4',
                '--highlight': '#ebcb8b',
                '--danger': '#bf616a',
                '--success': '#a3be8c',
                '--love': '#b48ead',
                'background': '#2e3440'
            }
        },
        'monokai': {
            name: 'Monokai',
            category: 'dark',
            colors: {
                '--primary': '#f8f8f2',
                '--secondary': '#272822',
                '--tertiary': '#a6e22e',
                '--quaternary': '#66d9ef',
                '--header_background': '#272822',
                '--header_primary': '#f8f8f2',
                '--highlight': '#e6db74',
                '--danger': '#f92672',
                '--success': '#a6e22e',
                '--love': '#f92672',
                'background': '#272822'
            }
        },
        'tokyo-night': {
            name: 'Tokyo Night',
            category: 'dark',
            colors: {
                '--primary': '#c0caf5',
                '--secondary': '#1a1b26',
                '--tertiary': '#7aa2f7',
                '--quaternary': '#bb9af7',
                '--header_background': '#1a1b26',
                '--header_primary': '#c0caf5',
                '--highlight': '#e0af68',
                '--danger': '#f7768e',
                '--success': '#9ece6a',
                '--love': '#ff007c',
                'background': '#1a1b26'
            }
        },
        'gruvbox-dark': {
            name: 'Gruvbox Dark',
            category: 'dark',
            colors: {
                '--primary': '#ebdbb2',
                '--secondary': '#282828',
                '--tertiary': '#d79921',
                '--quaternary': '#83a598',
                '--header_background': '#282828',
                '--header_primary': '#ebdbb2',
                '--highlight': '#fabd2f',
                '--danger': '#fb4934',
                '--success': '#b8bb26',
                '--love': '#d3869b',
                'background': '#282828'
            }
        },
        'one-dark': {
            name: 'One Dark',
            category: 'dark',
            colors: {
                '--primary': '#abb2bf',
                '--secondary': '#282c34',
                '--tertiary': '#61afef',
                '--quaternary': '#c678dd',
                '--header_background': '#282c34',
                '--header_primary': '#abb2bf',
                '--highlight': '#e5c07b',
                '--danger': '#e06c75',
                '--success': '#98c379',
                '--love': '#e06c75',
                'background': '#282c34'
            }
        },
        'catppuccin-mocha': {
            name: 'Catppuccin Mocha',
            category: 'dark',
            colors: {
                '--primary': '#cdd6f4',
                '--secondary': '#1e1e2e',
                '--tertiary': '#cba6f7',
                '--quaternary': '#f5c2e7',
                '--header_background': '#1e1e2e',
                '--header_primary': '#cdd6f4',
                '--highlight': '#f9e2af',
                '--danger': '#f38ba8',
                '--success': '#a6e3a1',
                '--love': '#f5c2e7',
                'background': '#1e1e2e'
            }
        },
        'terminal-cli': {
            name: 'Terminal CLI',
            category: 'dark',
            colors: {
                '--primary': '#33ff00',
                '--secondary': '#0a0a0a',
                '--tertiary': '#33ff00',
                '--quaternary': '#ffb000',
                '--header_background': '#0a0a0a',
                '--header_primary': '#33ff00',
                '--highlight': '#ffb000',
                '--danger': '#ff3333',
                '--success': '#33ff00',
                '--love': '#ff3333',
                'background': '#0a0a0a'
            },
            extra: `
                html[data-theme="terminal-cli"] { --font-family: 'JetBrains Mono', 'Fira Code', monospace; }
            `
        },
        'minimal-dark': {
            name: 'Minimal Dark',
            category: 'dark',
            colors: {
                '--primary': '#e2e8f0',
                '--secondary': '#0A0A0F',
                '--tertiary': '#F59E0B',
                '--quaternary': '#FBBF24',
                '--header_background': '#0A0A0F',
                '--header_primary': '#e2e8f0',
                '--highlight': '#F59E0B',
                '--danger': '#ef4444',
                '--success': '#22c55e',
                '--love': '#F59E0B',
                'background': '#0A0A0F'
            }
        },
        'web3': {
            name: 'Web3 Bitcoin',
            category: 'dark',
            colors: {
                '--primary': '#FFFFFF',
                '--secondary': '#030304',
                '--tertiary': '#F7931A',
                '--quaternary': '#FFD600',
                '--header_background': '#030304',
                '--header_primary': '#FFFFFF',
                '--highlight': '#FFD600',
                '--danger': '#ef4444',
                '--success': '#22c55e',
                '--love': '#F7931A',
                'background': '#030304'
            }
        },
        'art-deco': {
            name: 'Art Deco',
            category: 'dark',
            colors: {
                '--primary': '#F5E6D3',
                '--secondary': '#0D0D0D',
                '--tertiary': '#D4AF37',
                '--quaternary': '#C9A227',
                '--header_background': '#0D0D0D',
                '--header_primary': '#D4AF37',
                '--highlight': '#D4AF37',
                '--danger': '#8B0000',
                '--success': '#2E8B57',
                '--love': '#D4AF37',
                'background': '#0D0D0D'
            }
        },

        // ============ 浅色系主题 ============
        'neo-brutalism': {
            name: 'Neo Brutalism',
            category: 'light',
            colors: {
                '--primary': '#000000',
                '--secondary': '#FFFDF5',
                '--tertiary': '#FF6B6B',
                '--quaternary': '#FFD93D',
                '--header_background': '#FFFDF5',
                '--header_primary': '#000000',
                '--highlight': '#FF6B6B',
                '--danger': '#FF6B6B',
                '--success': '#4CAF50',
                '--love': '#FF6B6B',
                'background': '#FFFDF5'
            },
            extra: `
                html[data-theme="neo-brutalism"] .d-header { border-bottom: 4px solid #000 !important; }
                html[data-theme="neo-brutalism"] .btn { border: 2px solid #000 !important; border-radius: 0 !important; }
            `
        },
        'luxury': {
            name: 'Luxury',
            category: 'light',
            colors: {
                '--primary': '#1A1A1A',
                '--secondary': '#F9F8F6',
                '--tertiary': '#D4AF37',
                '--quaternary': '#6C6863',
                '--header_background': '#F9F8F6',
                '--header_primary': '#1A1A1A',
                '--highlight': '#D4AF37',
                '--danger': '#8B0000',
                '--success': '#2E8B57',
                '--love': '#D4AF37',
                'background': '#F9F8F6'
            },
            extra: `
                html[data-theme="luxury"] { --font-family: 'Playfair Display', serif; }
            `
        },
        'solarized-light': {
            name: 'Solarized Light',
            category: 'light',
            colors: {
                '--primary': '#657b83',
                '--secondary': '#fdf6e3',
                '--tertiary': '#268bd2',
                '--quaternary': '#2aa198',
                '--header_background': '#fdf6e3',
                '--header_primary': '#657b83',
                '--highlight': '#b58900',
                '--danger': '#dc322f',
                '--success': '#859900',
                '--love': '#d33682',
                'background': '#fdf6e3'
            }
        },
        'github-light': {
            name: 'GitHub Light',
            category: 'light',
            colors: {
                '--primary': '#1f2328',
                '--secondary': '#ffffff',
                '--tertiary': '#0969da',
                '--quaternary': '#8250df',
                '--header_background': '#ffffff',
                '--header_primary': '#1f2328',
                '--highlight': '#9a6700',
                '--danger': '#d1242f',
                '--success': '#1a7f37',
                '--love': '#bf3989',
                'background': '#ffffff'
            }
        },
        'gruvbox-light': {
            name: 'Gruvbox Light',
            category: 'light',
            colors: {
                '--primary': '#3c3836',
                '--secondary': '#fbf1c7',
                '--tertiary': '#d65d0e',
                '--quaternary': '#98971a',
                '--header_background': '#fbf1c7',
                '--header_primary': '#3c3836',
                '--highlight': '#d79921',
                '--danger': '#cc241d',
                '--success': '#98971a',
                '--love': '#b16286',
                'background': '#fbf1c7'
            }
        },
        'rose-pine-dawn': {
            name: 'Rose Pine Dawn',
            category: 'light',
            colors: {
                '--primary': '#575279',
                '--secondary': '#faf4ed',
                '--tertiary': '#907aa9',
                '--quaternary': '#d7827e',
                '--header_background': '#faf4ed',
                '--header_primary': '#575279',
                '--highlight': '#ea9d34',
                '--danger': '#b4637a',
                '--success': '#56949f',
                '--love': '#d7827e',
                'background': '#faf4ed'
            }
        },
        'monochrome': {
            name: 'Monochrome',
            category: 'light',
            colors: {
                '--primary': '#000000',
                '--secondary': '#FFFFFF',
                '--tertiary': '#000000',
                '--quaternary': '#333333',
                '--header_background': '#FFFFFF',
                '--header_primary': '#000000',
                '--highlight': '#000000',
                '--danger': '#000000',
                '--success': '#000000',
                '--love': '#000000',
                'background': '#FFFFFF'
            }
        },
        'swiss': {
            name: 'Swiss',
            category: 'light',
            colors: {
                '--primary': '#000000',
                '--secondary': '#FFFFFF',
                '--tertiary': '#FF3000',
                '--quaternary': '#000000',
                '--header_background': '#FFFFFF',
                '--header_primary': '#000000',
                '--highlight': '#FF3000',
                '--danger': '#FF3000',
                '--success': '#000000',
                '--love': '#FF3000',
                'background': '#FFFFFF'
            }
        },
        'retro': {
            name: 'Retro 95',
            category: 'light',
            colors: {
                '--primary': '#000000',
                '--secondary': '#C0C0C0',
                '--tertiary': '#0000FF',
                '--quaternary': '#000080',
                '--header_background': '#C0C0C0',
                '--header_primary': '#000000',
                '--highlight': '#FFFF00',
                '--danger': '#FF0000',
                '--success': '#00AA00',
                '--love': '#FF0000',
                'background': '#C0C0C0'
            }
        },
        'neumorphism': {
            name: 'Neumorphism',
            category: 'light',
            colors: {
                '--primary': '#3D4852',
                '--secondary': '#E0E5EC',
                '--tertiary': '#6C63FF',
                '--quaternary': '#8B84FF',
                '--header_background': '#E0E5EC',
                '--header_primary': '#3D4852',
                '--highlight': '#6C63FF',
                '--danger': '#ef4444',
                '--success': '#38B2AC',
                '--love': '#6C63FF',
                'background': '#E0E5EC'
            }
        },
        'claymorphism': {
            name: 'Claymorphism',
            category: 'light',
            colors: {
                '--primary': '#1e1b4b',
                '--secondary': '#F4F1FA',
                '--tertiary': '#8B5CF6',
                '--quaternary': '#A78BFA',
                '--header_background': '#F4F1FA',
                '--header_primary': '#1e1b4b',
                '--highlight': '#8B5CF6',
                '--danger': '#ef4444',
                '--success': '#10b981',
                '--love': '#ec4899',
                'background': '#F4F1FA'
            }
        },
        'saas': {
            name: 'SaaS Modern',
            category: 'light',
            colors: {
                '--primary': '#1a1a1a',
                '--secondary': '#FFFFFF',
                '--tertiary': '#0052FF',
                '--quaternary': '#4D7CFF',
                '--header_background': '#FFFFFF',
                '--header_primary': '#1a1a1a',
                '--highlight': '#0052FF',
                '--danger': '#ef4444',
                '--success': '#22c55e',
                '--love': '#ec4899',
                'background': '#FFFFFF'
            }
        },
        'material': {
            name: 'Material You',
            category: 'light',
            colors: {
                '--primary': '#1C1B1F',
                '--secondary': '#FFFBFE',
                '--tertiary': '#6750A4',
                '--quaternary': '#7D5260',
                '--header_background': '#FFFBFE',
                '--header_primary': '#1C1B1F',
                '--highlight': '#6750A4',
                '--danger': '#B3261E',
                '--success': '#386A20',
                '--love': '#7D5260',
                'background': '#FFFBFE'
            }
        },
        'botanical': {
            name: 'Botanical',
            category: 'light',
            colors: {
                '--primary': '#2D3A31',
                '--secondary': '#F9F8F4',
                '--tertiary': '#8C9A84',
                '--quaternary': '#C27B66',
                '--header_background': '#F9F8F4',
                '--header_primary': '#2D3A31',
                '--highlight': '#C27B66',
                '--danger': '#b91c1c',
                '--success': '#8C9A84',
                '--love': '#C27B66',
                'background': '#F9F8F4'
            }
        },
        'industrial': {
            name: 'Industrial',
            category: 'light',
            colors: {
                '--primary': '#2d3436',
                '--secondary': '#e0e5ec',
                '--tertiary': '#ff4757',
                '--quaternary': '#2d3436',
                '--header_background': '#e0e5ec',
                '--header_primary': '#2d3436',
                '--highlight': '#ff4757',
                '--danger': '#ff4757',
                '--success': '#2ecc71',
                '--love': '#ff4757',
                'background': '#e0e5ec'
            }
        },

        // ============ 特殊主题 ============
        'matrix': {
            name: 'Matrix',
            category: 'special',
            colors: {
                '--primary': '#00ff41',
                '--secondary': '#0d0208',
                '--tertiary': '#008f11',
                '--quaternary': '#003b00',
                '--header_background': '#000000',
                '--header_primary': '#00ff41',
                '--highlight': '#00ff41',
                '--danger': '#ff0000',
                '--success': '#00ff41',
                '--love': '#00ff41',
                'background': '#0d0208'
            },
            extra: `
                html[data-theme="matrix"] { --font-family: 'Courier New', monospace; }
                html[data-theme="matrix"] .d-icon { color: #00ff41 !important; }
            `
        },
        'sunset': {
            name: 'Sunset',
            category: 'special',
            colors: {
                '--primary': '#4a4a4a',
                '--secondary': '#fff5f5',
                '--tertiary': '#ff6b6b',
                '--quaternary': '#feca57',
                '--header_background': '#fff5f5',
                '--header_primary': '#4a4a4a',
                '--highlight': '#feca57',
                '--danger': '#ee5a5a',
                '--success': '#10ac84',
                '--love': '#ff6b6b',
                'background': 'linear-gradient(135deg, #fff5f5 0%, #fffaf0 100%)'
            }
        },
        'ocean': {
            name: 'Ocean',
            category: 'special',
            colors: {
                '--primary': '#caf0f8',
                '--secondary': '#03045e',
                '--tertiary': '#0077b6',
                '--quaternary': '#00b4d8',
                '--header_background': '#03045e',
                '--header_primary': '#caf0f8',
                '--highlight': '#00b4d8',
                '--danger': '#e63946',
                '--success': '#2a9d8f',
                '--love': '#e76f51',
                'background': '#03045e'
            }
        },
        'forest': {
            name: 'Forest',
            category: 'special',
            colors: {
                '--primary': '#d8f3dc',
                '--secondary': '#1b4332',
                '--tertiary': '#2d6a4f',
                '--quaternary': '#40916c',
                '--header_background': '#1b4332',
                '--header_primary': '#d8f3dc',
                '--highlight': '#95d5b2',
                '--danger': '#9b2226',
                '--success': '#40916c',
                '--love': '#bc6c25',
                'background': '#1b4332'
            }
        }
    };

    // ========================================
    // 滤镜效果定义
    // ========================================
    const FILTERS = {
        'none': { name: '无', css: () => '' },
         'scanlines': {
             name: '扫描线',
             css: (intensity, affectImages) => `
                 html::after {
                     content: '';
                     position: fixed;
                     top: 0; left: 0; right: 0; bottom: 0;
                     background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, ${0.1 + intensity * 0.3}) 2px, rgba(0, 0, 0, ${0.1 + intensity * 0.3}) 4px);
                     pointer-events: none;
                     z-index: 9999;
                 }
                 ${affectImages ? '' : `html img, html video { position: relative; z-index: 10000; }`}
             `
         },
        'glow': {
            name: '发光',
            css: (intensity, affectImages) => `
                html h1, html h2, html h3 {
                    text-shadow: 0 0 ${5 + intensity * 15}px currentColor;
                }
                html a {
                    text-shadow: 0 0 ${3 + intensity * 8}px currentColor;
                }
                ${affectImages ? `html img { filter: drop-shadow(0 0 ${3 + intensity * 8}px rgba(255,255,255,0.5)); }` : ''}
            `
        },
         'crt': {
             name: 'CRT',
             css: (intensity, affectImages) => `
                 html::after {
                     content: '';
                     position: fixed;
                     top: 0; left: 0; right: 0; bottom: 0;
                     background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, ${0.15 + intensity * 0.25}) 2px, rgba(0, 0, 0, ${0.15 + intensity * 0.25}) 4px);
                     pointer-events: none;
                     z-index: 9999;
                 }
                 html *:not(img):not(video) {
                     text-shadow: 0 0 ${2 + intensity * 6}px currentColor;
                 }
                 ${affectImages
                    ? `html img, html video { filter: contrast(${1 + intensity * 0.2}) brightness(${1 - intensity * 0.1}) !important; }`
                    : `html img, html video { position: relative; z-index: 10000; }`}
             `
         },
        'chromatic': {
            name: '色差',
            css: (intensity, affectImages) => `
                html h1, html h2 {
                    text-shadow: ${1 + intensity * 2}px 0 #ff00ff, ${-1 - intensity * 2}px 0 #00d4ff;
                }
                ${affectImages ? `html img { filter: drop-shadow(${1 + intensity}px 0 0 rgba(255,0,255,0.3)) drop-shadow(${-1 - intensity}px 0 0 rgba(0,212,255,0.3)); }` : ''}
            `
        },
        'vaporwave': {
            name: '蒸汽波',
            css: (intensity, affectImages) => `
                html h1, html h2, html h3 {
                    text-shadow: 0 0 ${10 + intensity * 20}px rgba(255, 0, 255, ${0.5 + intensity * 0.3}), 0 0 ${20 + intensity * 30}px rgba(255, 0, 255, ${0.3 + intensity * 0.2});
                }
                html a {
                    text-shadow: 0 0 ${5 + intensity * 10}px rgba(0, 255, 255, ${0.4 + intensity * 0.3});
                }
                ${affectImages ? `html img { filter: saturate(${1.2 + intensity * 0.5}) hue-rotate(${intensity * 20}deg); }` : ''}
            `
        }
    };

    // ========================================
    // 颜色处理工具
    // ========================================
    function hexToRgb(hex) {
        if (!hex) return null;
        if (hex.startsWith('rgb')) {
            const match = hex.match(/\d+/g);
            return match ? { r: parseInt(match[0]), g: parseInt(match[1]), b: parseInt(match[2]) } : null;
        }
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function isDark(color) {
        if (!color) return true;
        // 渐变色：提取第一个颜色值来判断
        if (color.includes('gradient')) {
            const match = color.match(/#[a-fA-F0-9]{3,6}/);
            if (match) {
                color = match[0];
            } else {
                return true;
            }
        }
        const rgb = hexToRgb(color);
        if (!rgb) return true;
        const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
        return yiq < 128;
    }

    function mixColors(color1, color2, weight) {
        const c1 = hexToRgb(color1) || {r:0, g:0, b:0};
        const c2 = hexToRgb(color2) || {r:0, g:0, b:0};
        const w1 = weight;
        const w2 = 1 - weight;
        const r = Math.round(c1.r * w1 + c2.r * w2);
        const g = Math.round(c1.g * w1 + c2.g * w2);
        const b = Math.round(c1.b * w1 + c2.b * w2);
        return `${r}, ${g}, ${b}`;
    }

    // 变亮或变暗颜色 (amount: -1.0 到 1.0)
    // 负值变暗，正值变亮
    function adjustBrightness(color, amount) {
        const rgb = hexToRgb(color);
        if (!rgb) return color;

        // 如果 amount > 0，与白色混合；如果 amount < 0，与黑色混合
        const target = amount > 0 ? {r:255, g:255, b:255} : {r:0, g:0, b:0};
        const strength = Math.abs(amount);

        const r = Math.round(rgb.r + (target.r - rgb.r) * strength);
        const g = Math.round(rgb.g + (target.g - rgb.g) * strength);
        const b = Math.round(rgb.b + (target.b - rgb.b) * strength);

        return `rgb(${r}, ${g}, ${b})`;
    }

    // ========================================
    // 主题管理器
    // ========================================
    class ThemeManager {
        constructor() {
            this.currentTheme = GM_getValue('selectedTheme', null);
            this.contrastLevel = GM_getValue('contrastLevel', 0.15);
            this.currentFilter = GM_getValue('selectedFilter', 'none');
            this.filterIntensity = GM_getValue('filterIntensity', 0.5);
            this.filterImages = GM_getValue('filterImages', false);
            this.keepMenuOpen = GM_getValue('keepMenuOpen', false);
            this.menuToggleBtn = null;
            this.init();
        }

        init() {
            this.injectGlobalStyles();
            this.injectThemeStyles();
            this.injectFilterStyles();
            if (this.currentTheme) {
                this.applyTheme(this.currentTheme);
            }
            this.observeSidebar();
        }

        // 注入滤镜样式
        injectFilterStyles() {
            let style = document.getElementById('ldo-filter-styles');
            if (!style) {
                style = document.createElement('style');
                style.id = 'ldo-filter-styles';
                document.head.appendChild(style);
            }

            const filter = FILTERS[this.currentFilter];
            if (filter && filter.css) {
                style.textContent = filter.css(this.filterIntensity, this.filterImages);
            } else {
                style.textContent = '';
            }
        }

        applyFilter(filterId) {
            this.currentFilter = filterId;
            GM_setValue('selectedFilter', filterId);
            this.injectFilterStyles();
        }

        // 注入全局不变的样式
        injectGlobalStyles() {
            GM_addStyle(`
                .discourse-tag {
                    background-color: var(--discourse-tag-bg) !important;
                    color: var(--discourse-tag-color) !important;
                }
                .topic-list .discourse-tag.simple {
                    background-color: transparent !important;
                    color: var(--primary-medium) !important;
                }
                .discourse-tag.box {
                    background-color: var(--discourse-tag-bg) !important;
                    color: var(--discourse-tag-color) !important;
                    border: 1px solid var(--discourse-tag-border) !important;
                }
                 /* 三列布局 */
                   .ldo-layout-wrapper {
                       display: flex;
                       flex-wrap: nowrap;
                       gap: 12px;
                       padding: 10px;
                       border-top: 1px solid var(--primary-low);
                       margin-top: 5px;
                       box-sizing: border-box;
                       width: 100%;
                       max-width: 100%;
                   }
                 .ldo-col {
                     display: flex;
                     flex-direction: column;
                     flex-shrink: 0;
                     min-width: 0;
                 }
                  .ldo-col-system {
                      width: auto;
                      flex: 0 0 140px;
                      min-width: 140px;
                  }
                .ldo-sys-options {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .ldo-script-area {
                    display: flex;
                    flex-direction: column;
                    flex: 1 1 auto;
                    min-width: 0;
                    border-left: 1px solid var(--primary-low);
                    padding-left: 12px;
                }
                .ldo-script-cols {
                    display: flex;
                    flex-wrap: nowrap;
                    gap: 12px;
                    width: 100%;
                    max-width: 100%;
                }
                 /* 系统选项按钮：占满列宽，统一字体大小 */
                 .ldo-col-system .btn,
                 .ldo-col-system button {
                     width: 100%;
                     max-width: 100%;
                     box-sizing: border-box;
                     justify-content: flex-start;
                     font-size: 11px;
                 }
                 .ldo-col-system .btn .d-button-label,
                 .ldo-col-system button .d-button-label {
                     overflow: hidden;
                     text-overflow: ellipsis;
                     white-space: nowrap;
                     font-size: 11px;
                 }
                  .ldo-col-themes {
                      width: auto;
                      flex: 1 1 420px;
                      min-width: 320px;
                  }
                  .ldo-col-filters {
                      width: auto;
                      flex: 0 0 180px;
                      min-width: 160px;
                      border-left: 1px solid var(--primary-low);
                      padding-left: 12px;
                  }
                .ldo-col-label-source {
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--primary);
                    text-align: center;
                    padding-bottom: 4px;
                    margin-bottom: 6px;
                    border-bottom: 1px solid var(--primary-low);
                }
                .ldo-col-header {
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--primary);
                    margin-bottom: 6px;
                    padding-bottom: 4px;
                    border-bottom: 1px solid var(--primary-low);
                }
                 .ldo-theme-group {
                     margin-bottom: 8px;
                 }
                 .ldo-group-label {
                     font-size: 0.7em;
                     font-weight: 600;
                     color: var(--primary-medium);
                     padding: 4px 8px;
                     margin-top: 4px;
                     border-bottom: 1px solid var(--primary-low);
                     box-sizing: border-box;
                     width: 100%;
                 }
                  .ldo-theme-grid {
                      display: grid;
                      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                      gap: 2px 6px;
                      padding: 0;
                      width: 100%;
                      box-sizing: border-box;
                  }
                  .ldo-theme-btn {
                      display: flex;
                      align-items: flex-start;
                      width: 100%;
                      padding: 3px 4px;
                    background: transparent;
                    border: 1px solid transparent;
                    border-left-width: 2px;
                    color: var(--primary);
                    cursor: pointer;
                    text-align: left;
                    font-size: 10px;
                      border-radius: 0 3px 3px 0;
                      transition: all 0.2s;
                      box-sizing: border-box;
                      white-space: normal;
                      overflow: visible;
                      text-overflow: clip;
                  }
 
                 /* 提升菜单面板最大宽度，保留三列且尽量不出现横向滚动条 */
                 .ldo-theme-menu {
                     width: fit-content !important;
                     max-width: calc(100vw - 24px) !important;
                 }
                 /* Discourse/DMenu 常见宽度限制层（不同主题/版本 class 不同） */
                 .ldo-theme-menu.fk-d-menu__content,
                 .ldo-theme-menu .fk-d-menu__content,
                 .ldo-theme-menu.fk-d-menu,
                 .ldo-theme-menu.interface-color-selector-content,
                 .ldo-theme-menu.fk-d-menu.interface-color-selector-content,
                 .ldo-theme-menu.menu-panel,
                 .ldo-theme-menu .menu-panel,
                 .ldo-theme-menu.d-menu,
                 .ldo-theme-menu .d-menu {
                     width: fit-content !important;
                     max-width: calc(100vw - 24px) !important;
                 }
                 .ldo-theme-menu .fk-d-menu__inner-content {
                     width: fit-content !important;
                     max-width: calc(100vw - 24px) !important;
                     overflow-x: visible !important;
                 }
                 .ldo-theme-preview {
                     width: 10px;
                     height: 10px;
                     border-radius: 50%;
                    margin-right: 3px;
                    border: 1px solid var(--primary-low);
                    flex-shrink: 0;
                }
                 .ldo-theme-name {
                     white-space: normal;
                     font-size: 10px;
                     overflow: visible;
                     text-overflow: clip;
                     word-break: break-word;
                 }
                .ldo-theme-btn:hover {
                    background: var(--d-hover);
                }
                .ldo-theme-btn.active {
                    background: var(--tertiary-low); /* 使用主题色半透明背景 */
                    color: var(--primary); /* 保持文字颜色不变 */
                    font-weight: 600;
                    border-left-color: var(--tertiary); /* 左侧高亮条 */
                }
                /* 修复：确保选中状态下文字清晰，如果背景太深/太浅 */
                /* 我们使用 mix-blend-mode 或者是简单的透明度 */

                /* 上次访问提示线 (Last Visit) - 强力覆盖 */
                .topic-list .topic-list-item-separator td,
                .topic-list .topic-list-item-separator td span {
                    border-top-color: var(--tertiary) !important;
                    color: var(--tertiary) !important;
                }
                /* 覆盖可能存在的红色文字类 */
                .topic-list .topic-list-item-separator .topic-list-data {
                    color: var(--tertiary) !important;
                }
                .ldo-controls {
                    padding: 10px 8px 0;
                    margin-top: 5px;
                    border-top: 1px solid var(--primary-low);
                }
                /* 滑块样式 */
                .ldo-range-container {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                    font-size: 12px;
                    color: var(--primary-medium);
                }
                .ldo-range-label {
                    flex-shrink: 0;
                    margin-right: 8px;
                }
                .ldo-range {
                    flex: 1;
                    height: 4px;
                    -webkit-appearance: none;
                    background: var(--primary-low);
                    border-radius: 2px;
                    outline: none;
                }
                .ldo-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: var(--tertiary);
                    cursor: pointer;
                }
                /* 滤镜列表 */
                .ldo-filter-list {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    margin-bottom: 8px;
                }
                .ldo-filter-option {
                    display: flex;
                    align-items: center;
                    padding: 3px 6px;
                    font-size: 11px;
                    cursor: pointer;
                    border-radius: 3px;
                    transition: background 0.2s;
                }
                .ldo-filter-option:hover {
                    background: var(--d-hover);
                }
                .ldo-filter-option.active {
                    background: var(--tertiary-low);
                    font-weight: 600;
                }
                .ldo-filter-option input {
                    display: none;
                }
                /* 滤镜控件 */
                .ldo-filter-controls {
                    margin-top: 8px;
                    padding-top: 8px;
                    border-top: 1px solid var(--primary-low);
                }
                .ldo-range-row {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    margin-bottom: 8px;
                    font-size: 10px;
                    color: var(--primary-medium);
                }
                .ldo-range-row span {
                    flex-shrink: 0;
                }
                .ldo-range-row .ldo-range {
                    width: 100%;
                }
                .ldo-checkbox-row {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 10px;
                    color: var(--primary-medium);
                    cursor: pointer;
                }
                .ldo-checkbox-row input {
                    margin: 0;
                }
                /* 主题控件 */
                .ldo-theme-controls {
                    margin-top: auto;
                    padding-top: 6px;
                    border-top: 1px solid var(--primary-low);
                }
                .ldo-reset-btn {
                    width: 100%;
                    padding: 4px 8px;
                    font-size: 11px;
                    background: var(--primary-low);
                    color: var(--primary);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .ldo-reset-btn:hover {
                    background: var(--primary-medium);
                    color: var(--secondary);
                }
            `);
        }

        // 注入主题变量 (包含动态计算部分)
        injectThemeStyles() {
            // 移除旧的样式标签（如果存在）
            const oldStyle = document.getElementById('ldo-dynamic-styles');
            if (oldStyle) oldStyle.remove();

            const style = document.createElement('style');
            style.id = 'ldo-dynamic-styles';
            let css = '';

            Object.entries(THEMES).forEach(([id, theme]) => {
                css += `html[data-theme="${id}"] {\n`;
                const c = theme.colors;
                const primary = c['--primary'];
                const secondary = c['--secondary'];
                const tertiary = c['--tertiary'];
                const highlight = c['--highlight'] || tertiary;
                const isDarkTheme = isDark(c['background'] || secondary);

                // 基础颜色
                Object.entries(c).forEach(([prop, value]) => {
                    if (prop === 'background') {
                        css += `  background: ${value} !important;\n`;

                        // 修复侧边栏背景：如果是渐变，提取第一个颜色作为纯色背景，防止异常
                        if (value.includes('gradient')) {
                            const match = value.match(/#[a-fA-F0-9]{3,6}|rgba?\(.*?\)/);
                            const fallback = match ? match[0] : secondary;
                            css += `  --d-sidebar-background: ${fallback} !important;\n`;
                        } else {
                            css += `  --d-sidebar-background: ${value} !important;\n`;
                        }

                        css += `  --header_background: ${c['--header_background']} !important;\n`;
                    } else {
                        css += `  ${prop}: ${value} !important;\n`;
                    }
                });

                // RGB
                css += `  --primary-rgb: ${mixColors(primary, primary, 1)} !important;\n`;
                css += `  --secondary-rgb: ${mixColors(secondary, secondary, 1)} !important;\n`;
                css += `  --tertiary-rgb: ${mixColors(tertiary, tertiary, 1)} !important;\n`;

                // 动态对比度变量
                const contrast = this.contrastLevel; // 0.05 - 0.50

                // 分隔线 & 边框 (使用对比度)
                css += `  --primary-low: rgba(${mixColors(primary, secondary, contrast)}, 1) !important;\n`;
                css += `  --primary-low-rgb: ${mixColors(primary, secondary, contrast)} !important;\n`;
                css += `  --d-border-color: var(--primary-low) !important;\n`;

                // 其他衍生色
                css += `  --primary-low-mid: rgba(${mixColors(primary, secondary, contrast + 0.15)}, 1) !important;\n`;
                css += `  --primary-medium: rgba(${mixColors(primary, secondary, 0.6)}, 1) !important;\n`;
                css += `  --primary-high: rgba(${mixColors(primary, secondary, 0.8)}, 1) !important;\n`;

                css += `  --secondary-low: rgba(${mixColors(secondary, primary, 0.3)}, 1) !important;\n`;
                css += `  --secondary-medium: rgba(${mixColors(secondary, primary, 0.6)}, 1) !important;\n`;
                css += `  --secondary-high: rgba(${mixColors(secondary, primary, 0.8)}, 1) !important;\n`;

                css += `  --tertiary-low: rgba(${mixColors(tertiary, secondary, 0.2)}, 1) !important;\n`;
                css += `  --tertiary-medium: rgba(${mixColors(tertiary, secondary, 0.5)}, 1) !important;\n`;
                css += `  --tertiary-hover: rgba(${mixColors(tertiary, isDarkTheme ? '#ffffff' : '#000000', 0.8)}, 1) !important;\n`;

                css += `  --highlight-bg: rgba(${mixColors(highlight, secondary, 0.3)}, 1) !important;\n`;
                css += `  --highlight-low: rgba(${mixColors(highlight, secondary, 0.15)}, 1) !important;\n`;
                css += `  --highlight-medium: rgba(${mixColors(highlight, secondary, 0.5)}, 1) !important;\n`;

                css += `  --d-sidebar-highlight-background: rgba(${mixColors(tertiary, secondary, 0.15)}, 1) !important;\n`;
                css += `  --d-sidebar-highlight-color: ${primary} !important;\n`;
                css += `  --d-nav-item-selected-bg: ${tertiary} !important;\n`;
                css += `  --d-nav-item-selected-text: ${secondary} !important;\n`;

                // 标签 (Tags)
                let tagBg, tagBorder;
                if (isDarkTheme) {
                    tagBg = mixColors('#ffffff', secondary, 0.02);
                    tagBorder = mixColors('#ffffff', secondary, 0.05);
                } else {
                    tagBg = mixColors('#000000', secondary, 0.02);
                    tagBorder = mixColors('#000000', secondary, 0.05);
                }
                css += `  --discourse-tag-bg: rgb(${tagBg}) !important;\n`;
                css += `  --discourse-tag-color: var(--primary) !important;\n`;
                css += `  --discourse-tag-border: rgb(${tagBorder}) !important;\n`;

                css += `  --d-sidebar-text: ${primary} !important;\n`;

                // 修复 blockquote 背景
                // 如果是深色主题，背景变亮10%；如果是浅色主题，背景变暗10%
                let blockquoteBg;
                // 获取背景色，如果是渐变色则取 fallback 或 secondary
                let bgForCalc = c['background'];
                if (bgForCalc && bgForCalc.includes('gradient')) {
                   const match = bgForCalc.match(/#[a-fA-F0-9]{3,6}|rgba?\(.*?\)/);
                   bgForCalc = match ? match[0] : secondary;
                }

                if (isDarkTheme) {
                    blockquoteBg = adjustBrightness(bgForCalc || secondary, 0.1); // 变亮 10%
                } else {
                    blockquoteBg = adjustBrightness(bgForCalc || secondary, -0.05); // 变暗 5% (浅色模式下10%可能太黑，改用5%)
                }

                css += `  blockquote { background-color: ${blockquoteBg} !important; color: var(--primary) !important; }\n`;

                // 修复楼层用户名颜色 (变暗 20% 以适应正文，避免过于抢眼)
                const usernameColor = adjustBrightness(primary, isDarkTheme ? -0.2 : -0.2);
                css += `  .names span.username a { color: ${usernameColor} !important; }\n`;
                // 修复昵称 (full-name) 颜色
                css += `  .names span.first a, .names span.full-name a, .names .first.full-name a { color: ${usernameColor} !important; }\n`;

                // 修复链接预览 (Onebox) 边框和背景颜色，完全覆盖默认浅深色
                css += `  aside.onebox { border: 1px solid var(--primary-low) !important; background-color: ${blockquoteBg} !important; box-shadow: none !important; }\n`;
                css += `  aside.onebox header { color: var(--primary) !important; background-color: transparent !important; }\n`;
                css += `  aside.onebox article { background-color: transparent !important; border: none !important; }\n`;
                css += `  .onebox-body { background-color: transparent !important; color: var(--primary) !important; }\n`;
                css += `  .onebox-body h3 a, .onebox-body h4 a { color: var(--tertiary) !important; }\n`;
                css += `  .onebox-body p { color: var(--primary-medium) !important; }\n`;

                // 禁用暗色主题下对图片的“变暗滤镜”
                // 某些站点/主题会在暗色模式对图片应用 filter 导致图片变暗，这里强制关闭
                if (isDarkTheme) {
                    css += `  img, video { filter: none; }\n`;
                }

                // 修复引用回复的标题背景 (quote title)，不要影响帖子标题等通用 .title
                css += `  .quote-controls, .quote-title { background-color: var(--primary-low) !important; color: var(--primary) !important; }\n`;

                css += `}\n`;

                if (theme.extra) css += theme.extra;
            });

            style.textContent = css;
            document.head.appendChild(style);
        }

        observeSidebar() {
            const observer = new MutationObserver((mutations) => {
                const lightOption = document.querySelector('.interface-color-selector__light-option');
                if (lightOption) {
                    const container = lightOption.closest('.fk-d-menu__content') ||
                                    lightOption.closest('.menu-panel') ||
                                    lightOption.parentElement.parentElement ||
                                    lightOption.parentElement;

                    if (container && !container.querySelector('.ldo-theme-menu')) {
                        this.injectMenu(container, lightOption);
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            // 记录可能的菜单触发按钮（用于 keepMenuOpen 下自动重开）
            document.addEventListener('click', (e) => {
                const btn = e.target && e.target.closest ? e.target.closest('button[aria-expanded]') : null;
                if (!btn) return;
                const aria = btn.getAttribute('aria-label') || '';
                const title = btn.getAttribute('title') || '';
                if (/(颜色模式|color|scheme)/i.test(`${aria} ${title}`)) {
                    this.menuToggleBtn = btn;
                }
            }, true);
        }

        injectMenu(container, lightOption) {
            if (container.querySelector('.ldo-layout-wrapper')) return;
            // 宽度限制经常在更外层的菜单容器上（不同主题/版本 class 不同），尽量往上挂载 class
            const menuRoot =
                container.closest('.fk-d-menu__content') ||
                container.closest('.fk-d-menu') ||
                container.closest('.d-menu') ||
                container.closest('.menu-panel') ||
                container;
            menuRoot.classList.add('ldo-theme-menu');
            // 尝试记录当前焦点作为触发按钮（用户刚打开菜单时通常聚焦在触发按钮上）
            if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
                this.menuToggleBtn = document.activeElement;
            }
 
             // 找到系统选项的完整容器（包含所有深浅色选项）
             const sysOptionsContainer = lightOption.closest('.sidebar-section-link-content-text') ||
                                         lightOption.closest('.interface-color-selector') ||
                                         lightOption.parentElement.parentElement.parentElement ||
                                        lightOption.parentElement.parentElement ||
                                        lightOption.parentElement;

            // 收集所有系统选项按钮
            // 注意：这些按钮通常由论坛前端（如 Ember/React）绑定事件，直接 clone 会丢失交互。
            // 这里使用“代理点击”：克隆一份用于展示，但点击时触发原按钮 click()。
            const allSysCandidates = Array.from(
                container.querySelectorAll(
                    '.interface-color-selector__light-option, .interface-color-selector__dark-option, .interface-color-selector__auto-option, [class*="interface-color-selector__"][class$="-option"]'
                )
            ).filter((el) => {
                if (!el) return false;
                const tag = el.tagName || '';
                if (/^(button|a)$/i.test(tag)) return true;
                return (typeof el.getAttribute === 'function' && el.getAttribute('role') === 'button');
            });

            // 创建三列布局
            const wrapper = document.createElement('div');
            wrapper.className = 'ldo-layout-wrapper';

            // 左列：系统选项
            const leftCol = document.createElement('div');
            leftCol.className = 'ldo-col ldo-col-system';
            leftCol.innerHTML = `<div class="ldo-col-header">论坛默认</div><div class="ldo-sys-options"></div>`;
            const sysOptionsDiv = leftCol.querySelector('.ldo-sys-options');

            // 克隆所有系统选项（点击代理到原始按钮）
            allSysCandidates.forEach((btn) => {
                const clone = btn.cloneNode(true);
                clone.style.display = '';
                clone.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    btn.click();
                });
                sysOptionsDiv.appendChild(clone);
                btn.style.display = 'none';
            });

            // 如果没有找到按钮，尝试把整个容器“挪进来”（保留原始事件绑定）
            if (allSysCandidates.length === 0 && sysOptionsContainer) {
                sysOptionsDiv.appendChild(sysOptionsContainer);
            }

            // 中列：主题选项
            const midCol = document.createElement('div');
            midCol.className = 'ldo-col ldo-col-themes';
             midCol.innerHTML = `
                 <div class="ldo-col-header">主题</div>
                 <div class="ldo-theme-groups"></div>
                 <div class="ldo-theme-controls">
                     <div class="ldo-range-row">
                         <span>对比度</span>
                         <input type="range" class="ldo-range" id="ldo-contrast-range" min="5" max="50" value="${this.contrastLevel * 100}">
                     </div>
                     <label class="ldo-checkbox-row" id="ldo-keep-menu-open-row">
                         <input type="checkbox" id="ldo-keep-menu-open" ${this.keepMenuOpen ? 'checked' : ''}>
                         <span>保持面板打开</span>
                     </label>
                     <button class="ldo-reset-btn" id="ldo-reset-btn">↺ 重置</button>
                 </div>
             `;

            // 右列：滤镜选项
            const rightCol = document.createElement('div');
            rightCol.className = 'ldo-col ldo-col-filters';
            rightCol.innerHTML = `
                <div class="ldo-col-header">滤镜</div>
                <div class="ldo-filter-list">
                    ${Object.entries(FILTERS).map(([id, f]) =>
                        `<label class="ldo-filter-option ${this.currentFilter === id ? 'active' : ''}">
                            <input type="radio" name="ldo-filter" value="${id}" ${this.currentFilter === id ? 'checked' : ''}>
                            <span>${f.name}</span>
                        </label>`
                    ).join('')}
                </div>
                <div class="ldo-filter-controls">
                    <div class="ldo-range-row" id="ldo-filter-intensity-row">
                        <span>滤镜强度</span>
                        <input type="range" class="ldo-range" id="ldo-filter-range" min="0" max="100" value="${this.filterIntensity * 100}">
                    </div>
                    <label class="ldo-checkbox-row" id="ldo-filter-images-row">
                        <input type="checkbox" id="ldo-filter-images" ${this.filterImages ? 'checked' : ''}>
                        <span>滤镜影响图片</span>
                    </label>
                </div>
            `;

            // 主题 + 滤镜：共用标题（便于用户知道卸载哪个脚本）
            const scriptName =
                (typeof GM_info !== 'undefined' && GM_info && GM_info.script && GM_info.script.name)
                    ? GM_info.script.name
                    : 'Linux.do 更多主题';
            const scriptArea = document.createElement('div');
            scriptArea.className = 'ldo-script-area';
            scriptArea.innerHTML = `
                <div class="ldo-col-label-source">来自脚本：${scriptName}</div>
                <div class="ldo-script-cols"></div>
            `;
            const scriptCols = scriptArea.querySelector('.ldo-script-cols');
            scriptCols.appendChild(midCol);
            scriptCols.appendChild(rightCol);

             const groupsContainer = midCol.querySelector('.ldo-theme-groups');
             const contrastRange = midCol.querySelector('#ldo-contrast-range');
             const keepMenuOpenCheckbox = midCol.querySelector('#ldo-keep-menu-open');
             const filterRadios = rightCol.querySelectorAll('input[name="ldo-filter"]');
             const filterRange = rightCol.querySelector('#ldo-filter-range');
             const filterImagesCheckbox = rightCol.querySelector('#ldo-filter-images');

             // 绑定对比度滑块
             contrastRange.oninput = (e) => {
                 this.contrastLevel = parseInt(e.target.value) / 100;
                 GM_setValue('contrastLevel', this.contrastLevel);
                 this.injectThemeStyles();
             };
 
             keepMenuOpenCheckbox.onchange = (e) => {
                 this.keepMenuOpen = e.target.checked;
                 GM_setValue('keepMenuOpen', this.keepMenuOpen);
             };

            // 绑定滤镜单选
            filterRadios.forEach(radio => {
                radio.onchange = (e) => {
                    this.applyFilter(e.target.value);
                    rightCol.querySelectorAll('.ldo-filter-option').forEach(opt => opt.classList.remove('active'));
                    e.target.parentElement.classList.add('active');
                };
            });

            // 绑定滤镜强度滑块
            filterRange.oninput = (e) => {
                this.filterIntensity = parseInt(e.target.value) / 100;
                GM_setValue('filterIntensity', this.filterIntensity);
                this.injectFilterStyles();
            };

            // 绑定影响图片复选框
            filterImagesCheckbox.onchange = (e) => {
                this.filterImages = e.target.checked;
                GM_setValue('filterImages', this.filterImages);
                this.injectFilterStyles();
            };

            // 按类别分组（特殊主题根据实际深浅色归类）
            const categories = {
                dark: { label: '🌙 深色', themes: [] },
                light: { label: '☀️ 浅色', themes: [] }
            };

            Object.entries(THEMES).forEach(([id, theme]) => {
                let cat = theme.category;
                // 特殊主题根据背景色判断深浅
                if (cat === 'special') {
                    cat = isDark(theme.colors['background'] || theme.colors['--secondary']) ? 'dark' : 'light';
                }
                if (categories[cat]) {
                    categories[cat].themes.push({ id, theme });
                }
            });

            // 创建每个分组
            Object.entries(categories).forEach(([catId, catData]) => {
                if (catData.themes.length === 0) return;

                const group = document.createElement('div');
                group.className = 'ldo-theme-group';
                group.innerHTML = `
                    <div class="ldo-group-label">${catData.label} (${catData.themes.length})</div>
                    <div class="ldo-theme-grid" data-category="${catId}"></div>
                `;

                const grid = group.querySelector('.ldo-theme-grid');

                catData.themes.forEach(({ id, theme }) => {
                    const btn = document.createElement('button');
                    btn.className = `ldo-theme-btn ${this.currentTheme === id ? 'active' : ''}`;
                    btn.title = theme.description || theme.name;
                    btn.dataset.themeId = id;

                    let bg = theme.colors['background'];
                    if (bg && bg.includes('gradient')) {
                        bg = theme.colors['--header_background'];
                    }
                    const fg = theme.colors['--primary'];

                    btn.innerHTML = `
                        <span class="ldo-theme-preview" style="background: linear-gradient(135deg, ${bg} 50%, ${fg} 50%)"></span>
                        <span class="ldo-theme-name">${theme.name}</span>
                    `;

                    btn.onclick = (e) => {
                        e.stopPropagation();
                        this.applyTheme(id);
                        midCol.querySelectorAll('.ldo-theme-btn').forEach(el => el.classList.remove('active'));
                        btn.classList.add('active');
                    };

                    grid.appendChild(btn);
                });

                groupsContainer.appendChild(group);
            });

            midCol.querySelector('#ldo-reset-btn').onclick = (e) => {
                e.stopPropagation();
                this.resetTheme();
                this.applyFilter('none');
                rightCol.querySelectorAll('.ldo-filter-option').forEach(opt => opt.classList.remove('active'));
                rightCol.querySelector('input[value="none"]').checked = true;
                rightCol.querySelector('input[value="none"]').parentElement.classList.add('active');
                midCol.querySelectorAll('.ldo-theme-btn').forEach(el => el.classList.remove('active'));
            };

             // 组装三列布局
             wrapper.appendChild(leftCol);
             wrapper.appendChild(scriptArea);
             container.appendChild(wrapper);

             // 可选：保持面板打开（避免点击控件时触发论坛菜单自动关闭）
             // 注意：不要在 capture 阶段 stopPropagation，否则会阻断按钮本身的 onclick（导致无法切换主题）
             wrapper.addEventListener('click', (e) => {
                 if (this.keepMenuOpen) e.stopPropagation();
             });
         }

        applyTheme(themeId) {
            const theme = THEMES[themeId];
            if (!theme) return;
            document.documentElement.setAttribute('data-theme', themeId);
            this.currentTheme = themeId;
            GM_setValue('selectedTheme', themeId);

            // 同步论坛的深浅色设置
            const isThemeDark = this.isThemeDark(theme);
            this.syncColorScheme(isThemeDark);
        }

        // 判断主题是否为深色
        isThemeDark(theme) {
            if (theme.category === 'dark') return true;
            if (theme.category === 'light') return false;
            // special 类别根据背景色判断
            return isDark(theme.colors['background'] || theme.colors['--secondary']);
        }

        // 同步论坛的深浅色模式
        syncColorScheme(preferDark) {
            const scheme = preferDark ? 'dark' : 'light';

            // 方法1: 直接设置 HTML 属性
            document.documentElement.dataset.colorScheme = scheme;

            // 方法2: 模拟点击论坛的深浅色切换按钮
            const selector = preferDark
                ? '.interface-color-selector__dark-option'
                : '.interface-color-selector__light-option';
            const btn = document.querySelector(selector);
            if (btn && !btn.classList.contains('--active')) {
                btn.click();
                if (this.keepMenuOpen) {
                    // 原生切换通常会导致菜单关闭/重绘；这里自动再打开，达到“同步 + 不关闭”的效果
                    this.reopenColorSchemeMenu();
                }
            }
        }
 
        reopenColorSchemeMenu() {
            const tryReopen = (attempt) => {
                window.setTimeout(() => {
                    if (!this.keepMenuOpen) return;
                    if (document.querySelector('.fk-d-menu.interface-color-selector-content.-expanded')) return;

                    const toggleBtn =
                        (this.menuToggleBtn && this.menuToggleBtn.isConnected ? this.menuToggleBtn : null) ||
                        document.querySelector('button[aria-expanded][aria-label*="颜色模式"]') ||
                        document.querySelector('button[aria-expanded][title*="颜色模式"]') ||
                        document.querySelector('button[aria-expanded][aria-label*="color"]') ||
                        document.querySelector('button[aria-expanded][aria-label*="scheme"]') ||
                        document.querySelector('button[aria-expanded][title*="color"]');
                    if (toggleBtn) {
                        toggleBtn.click();
                        return;
                    }

                    if (attempt < 3) tryReopen(attempt + 1);
                }, 120);
            };
            tryReopen(1);
        }

        resetTheme() {
            document.documentElement.removeAttribute('data-theme');
            this.currentTheme = null;
            GM_setValue('selectedTheme', null);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new ThemeManager());
    } else {
        new ThemeManager();
    }
})();
