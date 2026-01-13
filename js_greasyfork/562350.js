// ==UserScript==
// @name         Twitter/X Catppuccin
// @namespace    github.com/catppuccin/userstyles/styles/twitter
// @version      2025.09.07.1
// @description  Soothing pastel theme for Twitter (Catppuccin, configurable flavor)
// @author       Catppuccin / hiyun1137 (assisted by Gemini)
// @license      MIT
// @icon         https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/macchiato_squircle.png
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://api.twitter.com/*
// @match        https://api.x.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562350/TwitterX%20Catppuccin.user.js
// @updateURL https://update.greasyfork.org/scripts/562350/TwitterX%20Catppuccin.meta.js
// ==/UserScript==

/* 
 * --- CONFIGURATION ---
 * 
 * Update these constants to customize the theme flavors and accent color.
 * Available Flavors: 'latte', 'frappe', 'macchiato', 'mocha'
 * Available Accent Colors: 'rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon', 
 *                          'peach', 'yellow', 'green', 'teal', 'blue', 'sapphire', 'sky', 'lavender', 'subtext0'
 */
const CONFIG = {
    // @var select lightFlavor ["latte:Latte*", "frappe:Frappé", "macchiato:Macchiato", "mocha:Mocha"]
    LIGHT_FLAVOR: 'latte', 

    // @var select darkFlavor ["latte:Latte", "frappe:Frappé", "macchiato:Macchiato", "mocha:Mocha*"]
    DARK_FLAVOR: 'macchiato', 

    // @var select accentColor (Default: mauve)
    ACCENT_COLOR_NAME: 'mauve', 

    // @var checkbox colorizeLogo (Default: 0/false)
    COLORIZE_LOGO: true,

    // @var checkbox darkenShadows (Default: 1/true)
    DARKEN_SHADOWS: true, 
};

// --- CATPPUCCIN PALETTES (Essential subset) ---
const CATPPUCCIN_PALETTES = {
    latte: { base: '#eff1f5', mantle: '#e6e9ef', crust: '#dce0e8', text: '#4c4f69', subtext1: '#5c5f77', subtext0: '#6c6f85', overlay2: '#7c7f93', overlay1: '#8c8fa1', overlay0: '#9ca0b0', surface2: '#acb0be', surface1: '#bcc0cc', surface0: '#ccd0da', rosewater: '#dc8a78', flamingo: '#ea9085', pink: '#ffb8d1', mauve: '#8839ad', red: '#d20f39', maroon: '#e64553', peach: '#fe640b', yellow: '#df8e1d', green: '#40a02b', teal: '#179299', sky: '#04a5e5', sapphire: '#209fb5', blue: '#1e66f5', lavender: '#7287fd' },
    frappe: { base: '#303446', mantle: '#292c3c', crust: '#232634', text: '#c6d0f5', subtext1: '#b0b6bc', subtext0: '#98979a', overlay2: '#838ba7', overlay1: '#838ba7', overlay0: '#626880', surface2: '#51576d', surface1: '#414559', surface0: '#414559', rosewater: '#f2d5cf', flamingo: '#eebebe', pink: '#f4b8e4', mauve: '#ca9ee6', red: '#e78284', maroon: '#ea999c', peach: '#ef9f76', yellow: '#e5c387', green: '#a9b665', teal: '#81c0c0', sky: '#99d1db', sapphire: '#86a8e5', blue: '#89b4fa', lavender: '#babbf1' },
    macchiato: { base: '#24273a', mantle: '#1e2030', crust: '#181926', text: '#cad3f5', subtext1: '#b8c0e0', subtext0: '#a5adcb', overlay2: '#939ab7', overlay1: '#8087a2', overlay0: '#6e738d', surface2: '#5b6078', surface1: '#494d64', surface0: '#363a4f', rosewater: '#f4dbd6', flamingo: '#f0c6c6', pink: '#f5bde6', mauve: '#c6a0f6', red: '#ed8796', maroon: '#ee99a0', peach: '#f5a97f', yellow: '#eed49f', green: '#a6da95', teal: '#8bd5ca', sky: '#91d7e3', sapphire: '#7dc4e4', blue: '#8aadf4', lavender: '#babbf1' },
    mocha: { base: '#1e1e2e', mantle: '#181825', crust: '#11111b', text: '#cdd6f4', subtext1: '#bac2de', subtext0: '#a6adbb', overlay2: '#9399b2', overlay1: '#7f849c', overlay0: '#6c7086', surface2: '#585b70', surface1: '#45475a', surface0: '#313244', rosewater: '#f5e0dc', flamingo: '#f2cdcd', pink: '#f5c2e7', mauve: '#cba6f7', red: '#f38ba8', maroon: '#eba0ac', peach: '#fab387', yellow: '#f9e2af', green: '#a6e3a1', teal: '#94e2d5', sky: '#89dceb', sapphire: '#74c7ec', blue: '#89b4fa', lavender: '#babbf1' },
};

// --- COLOR UTILITIES (Simplified conversion of LESS functions) ---

function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 0, 0];
}

/** Converts hex to rgba (LESS fade) */
function fade(hex, percentage) {
    const [r, g, b] = hexToRgb(hex);
    const alpha = percentage / 100;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Darkens a hex color by scaling RGB values (LESS darken) */
function darken(hex, percentage) {
    const [r, g, b] = hexToRgb(hex);
    const factor = 1 - percentage / 100;

    const newR = Math.max(0, Math.floor(r * factor));
    const newG = Math.max(0, Math.floor(g * factor));
    const newB = Math.max(0, Math.floor(b * factor));

    const toHex = (c) => c.toString(16).padStart(2, '0');
    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

/** Lightens a hex color by scaling RGB values (LESS lighten) */
function lighten(hex, percentage) {
    const [r, g, b] = hexToRgb(hex);
    const factor = 1 + percentage / 100;

    const newR = Math.min(255, Math.floor(r * factor));
    const newG = Math.min(255, Math.floor(g * factor));
    const newB = Math.min(255, Math.floor(b * factor));

    const toHex = (c) => c.toString(16).padStart(2, '0');
    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

// --- CORE LOGIC ---

function getCurrentColors(domain) {
    const isDarkPreferred = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Check for Twitter/X's specific 'LightsOut' class (extreme dark mode)
    const isLightsOut = document.body.classList.contains('LightsOut');
    
    let flavorName;

    if (domain.includes('twitter.com') || domain.includes('x.com')) {
        // Twitter/X uses LightsOut for its darkest mode, overriding system preference in this case
        if (isLightsOut || isDarkPreferred) {
            flavorName = CONFIG.DARK_FLAVOR;
        } else {
            flavorName = CONFIG.LIGHT_FLAVOR;
        }
    } else { 
        // For API/OAuth pages, rely solely on system preference
        flavorName = isDarkPreferred ? CONFIG.DARK_FLAVOR : CONFIG.LIGHT_FLAVOR;
    }

    const palette = CATPPUCCIN_PALETTES[flavorName];
    if (!palette) {
        console.error(`Catppuccin: Unknown flavor: ${flavorName}`);
        return null;
    }

    const accent = palette[CONFIG.ACCENT_COLOR_NAME] || palette.mauve;
    
    return {
        ...palette,
        accent: accent,
        flavor: flavorName,
        isDark: flavorName !== 'latte',
        isLightsOut: isLightsOut
    };
}


function generateCSS(colors, domain) {
    if (!colors) return '';

    const {
        base, mantle, crust, text, subtext0, subtext1, overlay0, overlay1, overlay2,
        surface0, surface1, surface2, accent, flavor, isLightsOut,
        red, green, blue, sky, sapphire, pink, mauve, peach, yellow, maroon
    } = colors;
    
    const WHITE = '#fff';

    // Determines text color contrast for accent backgrounds
    const getContrastColor = () => flavor === 'latte' ? WHITE : crust;
    
    // --- Dynamic Shadow Definitions (Replicating LESS logic) ---
    
    // Default shadows (used when flavor is latte OR DARKEN_SHADOWS is false)
    const defaultShadow1 = `${fade(text, 20)} 0 0 15px, ${fade(text, 15)} 0 0 3px 1px`;
    const defaultShadow2 = `drop-shadow(${fade(text, 25)} 1px -1px 1px)`;
    const defaultShadow3 = `${fade(text, 20)} 0 0 5px, ${fade(text, 15)} 0 1px 4px 1px`;

    // Black shadows (used when DARKEN_SHADOWS is true AND flavor != latte AND isLightsOut)
    const blackShadow1 = `rgba(0, 0, 0, 0.4) 0 0 15px, rgba(0, 0, 0, 0.35) 0 0 3px 1px`;
    const blackShadow2 = `drop-shadow(rgba(0, 0, 0, 0.5) 1px -1px 1px)`;
    const blackShadow3 = `rgba(0, 0, 0, 0.4) 0 0 5px, rgba(0, 0, 0, 0.35) 0 1px 4px 1px`;

    let shadow1, shadow2, shadow3;
    
    const useBlackShadows = CONFIG.DARKEN_SHADOWS && flavor !== 'latte' && isLightsOut;

    shadow1 = useBlackShadows ? blackShadow1 : defaultShadow1;
    shadow2 = useBlackShadows ? blackShadow2 : defaultShadow2;
    shadow3 = useBlackShadows ? blackShadow3 : defaultShadow3;


    // --- CSS String Construction ---
    let css = '';

    if (domain.includes('twitter.com') || domain.includes('x.com')) {
        css += `
        /* Main Application Styles */
        body,
        .PageContainer,
        #placeholder {
            background-color: ${base} !important;
            color: ${text};
        }
        
        #ScriptLoadFailure span { color: ${text}; }

        /* Scrollbar styling */
        [style*="scrollbar-color: rgb(62, 65, 68) rgb(22, 24, 28)"] {
            scrollbar-color: ${accent} transparent !important;
            scrollbar-width: thin;
        }

        /* LightsOut Themeing (Dark Shadow Logic) */
        ${isLightsOut ? `
            body.LightsOut {
                --border-color: ${surface0};
                --color: ${overlay1};
                --color-emphasis: ${text};
                --hover-bg-color: ${surface0};
            }
            .r-qo02w8, .r-15ce4ve { box-shadow: ${shadow1}; }
            .r-1tbvlxk { filter: ${shadow2}; }
            .r-1uusn97 { box-shadow: ${shadow3}; }
        ` : ''}

        /* Backgrounds and Columns */
        [data-testid="primaryColumn"], .r-kemksi { background-color: ${base}; }
        .r-cqee49 { color: ${base}; } /* account switcher arrow */
        .r-5zmot { background-color: ${fade(base, 75)}; } /* top nav bg */
        .r-g2wdr4 { background-color: ${mantle}; } /* right side content */
        .r-14wv3jr { border-color: ${mantle}; }

        /* Hovers and Interactions */
        .r-1hdo0pc, .r-pjtv4k { background-color: ${fade(text, 10)}; } /* element hover */
        .r-11gmi9o { background-color: ${fade(text, 20)}; } /* element active */
        .r-1cuuowz { background-color: ${fade(text, 3)}; }

        /* Text and Icons */
        .r-1nao33i { color: ${text}; }
        .r-1bwzh9t { color: ${overlay1}; } /* search glass */
        .r-jwli3a { color: ${getContrastColor()}; } /* White/Crust text fallback */
        .r-jwli3a:has(path[d*="M3.693 21.707"]) { color: ${text} !important; } /* cw svg fix */
        .draftjs-styles_0 .public-DraftEditorPlaceholder-root { color: ${overlay0}; }

        /* Borders */
        .r-1kqtdi0, .r-1roi411, .r-1igl3o0, .r-2sztyj { border-color: ${surface0}; }
        .r-1aihyag { border-right-color: ${surface0}; }
        .r-1wyyjkm { border-left-color: ${subtext0}; } /* DM reply border */
        .r-1ccsd61, .r-xzxzvz { border-color: ${surface2}; } /* post relevance */
        .r-1xc7w19 { border-color: ${base}; }
        .r-1pbtemp { border-right-color: ${accent}; } /* DM active border */
        .r-vhj8yc { border-color: ${accent}; }
        .r-1blqq69 { border-color: ${mauve}; } /* spaces */
        .r-b5kvu3 { border-color: ${red}; } /* live border */
        
        /* Containers/Components */
        .r-gu4em3, .r-1bnu78o, .r-z32n2g, .r-1m3jxhj { background-color: ${surface0}; } /* Search, etc. */
        .r-1pr99xn { background-color: ${surface1}; } /* tooltips */
        .r-1fkb3t2 { background-color: ${surface1}; } /* sunglasses commu note */
        .r-qazpri { color: ${overlay1}; } /* DM reactions */
        .r-3gvs5h { background-color: ${overlay1}; } /* lock svg */
        .r-1eltapf { background-color: ${fade(sapphire, 10)}; } /* new notifications */
        .r-s224ru { background-color: ${green}; } /* circles */
        .r-h7o7i8 { background-color: ${fade(green, 10)}; } /* circles hover */
        .r-rgqbpe { background-color: ${fade(blue, 10)}; } /* who can reply? bg */
        .r-11z020y { background-color: rgba(0, 0, 0, 0.12); } /* mask over layer (simplified) */
        
        /* Accent Elements */
        .r-l5o3uw { background-color: ${accent}; }
        .r-1vtznih { background-color: ${darken(accent, 10)}; } /* hover */
        .r-1peqgm7 { background-color: ${fade(accent, 10)}; }
        .r-yuvema { background-color: ${darken(accent, 15)}; } /* active */
        .r-r18ze4 { background-color: ${fade(accent, 20)}; }
        .r-eok2q2 { background-color: ${fade(accent, 60)}; } /* polls */
        .r-9cip40 { box-shadow: ${accent} 0 0 0 1px; }
        .r-eff69c { background-color: ${darken(accent, 5)}; } /* DMs */
        .r-eff69c [style*="color: rgb(255, 255, 255)"] { color: ${crust} !important; }

        /* White/Text Elements */
        .r-jc7xae { background-color: ${darken(text, 4)}; } /* white element hover */
        .r-6wtuen { background-color: ${darken(text, 8)}; } /* white element active */
        .r-n94g0g { background-color: ${fade(text, 30)}; } /* cw button hover */
        .r-z9i421 { background-color: ${fade(text, 27)}; } /* cw button active */
        .r-19130f6 { background-color: ${crust}; } /* cw crust hover */
        .r-l8tqsx { background-color: ${fade(text, 10)}; } /* cw crust active */
        .r-11mg6pl { border-color: ${getContrastColor()}; }

        /* Likes/Red/Live */
        .r-4nw3r4, .r-1dgebii { background-color: ${red}; } /* live indicator */
        .r-qqmkd0 { background-color: ${fade(red, 10)}; } /* red transparent bg */
        .r-12d83nn { background-color: ${darken(red, 10)}; } /* red bg hover */
        .r-oybae9 { background-color: ${darken(red, 15)}; } /* red bg active */
        .r-1kwlb9n { background-color: ${fade(red, 12)}; }
        .r-1krxqcr { background-color: ${fade(red, 10)}; } /* likes hover */
        .r-uuique { background-color: ${fade(red, 20)}; } /* likes active */
        .r-vkub15, .r-9l7dzd { color: ${red}; } /* heart svg notifications */
        .r-1cvl2hr { color: ${accent}; } /* bell svg notifications */
        .r-o6sn0f { color: ${green}; } /* retweet svg notifications */
        .r-15azkrj { background-color: ${fade(green, 10)}; } /* rt hover */
        .r-1x669os { background-color: ${fade(green, 20)}; } /* rt active */
        
        /* Hard-coded style overrides */
        
        [style*="https://abs.twimg.com/responsive-web/client-web/background-premiumplus-web"] {
            background-image: none !important;
            background-color: ${surface0};
        }

        [style*="background-image: linear-gradient(61.63deg, rgb(45, 66, 255) -15.05%, rgb(156, 99, 250) 104.96%);"] {
            background-image: linear-gradient(61.63deg, ${blue} -15.05%, ${mauve} 104.96%) !important;
        }

        /* SVG Colors (Fill/Stroke) */
        [fill="rgb(249,22,127)"], [fill="rgb(222,45,108)"], g[clip-path="url(#__lottie_element_562)"] path, [style="color: rgb(249, 24, 128);"] [viewBox="0 0 24 24"] path { fill: ${red} !important; }
        [d*="M21.04 1.54L17.5 5.09"] { color: ${overlay0}; } /* Image broken SVG */
        [stroke="#2F3336" i] { stroke: ${surface2} !important; }
        [stroke="#1D9BF0" i], [style*="stroke: rgb(29, 155, 240)"] { stroke: ${accent} !important; }
        [stroke="#FFD400" i] { stroke: ${yellow} !important; }
        [fill="#829AAB" i] { fill: ${overlay2} !important; }
        [fill="#1DA1F2" i] { fill: ${flavor === 'latte' ? darken(sky, 15) : darken(sky, 30)} !important; }
        [fill="#78C6EE" i] { fill: ${sky} !important; }
        [stop-color="#f4e72a" i], [stop-color="#cd8105" i], [stop-color="#cb7b00" i], [stop-color="#f4ec26" i], [stop-color="#f9e87f" i], [stop-color="#e2b719" i] { stop-color: ${yellow} !important; }
        [fill="#d18800" i] { fill: ${yellow} !important; }
        
        /* Border Overrides */
        [style*="border-color: rgb(83, 100, 113)"] { border-color: ${surface1} !important; }
        [style*="border-color: rgb(51, 54, 57)"] { border-color: ${surface0} !important; }
        [style*="border-color: rgb(103, 7, 15)"] { border-color: ${fade(red, 50)} !important; }
        [style*="border-color: rgb(29, 155, 240)"] { border-color: ${accent} !important; }

        /* Color Overrides (must use !important due to inline styles) */
        
        /* Main Text */
        [style*="color: rgb(231, 233, 234)"]:not([style*="background-color"]),
        [style*="color: rgb(239, 243, 244)"]:not([style*="background-color"]),
        [style*="color: rgb(255, 255, 255)"]:not([style*="background-color"]) { color: ${text} !important; }
        
        /* Placeholder */
        [style*="color: rgb(231, 233, 234)"]:not([style*="background-color"]) input::placeholder { color: ${subtext1} !important; }

        /* Faded Text */
        [style*="color: rgb(113, 118, 123)"]:not([style*="background-color"]),
        [style*="color: rgb(182, 185, 188)"]:not([style*="background-color"]) { color: ${overlay1} !important; }

        /* Specific Colors */
        [style*="color: rgb(0, 186, 124)"]:not([style*="background-color"]) { color: ${green} !important; }
        [style*="color: rgb(249, 24, 128)"]:not([style*="background-color"]),
        [style*="color: rgb(244, 33, 46)"]:not([style*="background-color"]) { color: ${red} !important; }
        [style*="color: rgb(250, 68, 152)"]:not([style*="background-color"]) { color: ${pink} !important; }
        [style*="color: rgb(255, 212, 0)"]:not([style*="background-color"]) { color: ${yellow} !important; }
        [style*="color: rgb(120, 86, 255)"]:not([style*="background-color"]) { color: ${mauve} !important; }
        [style*="color: rgb(255, 122, 0)"]:not([style*="background-color"]) { color: ${peach} !important; }
        [style*="color: rgb(29, 155, 240)"]:not([style*="background-color"]) { color: ${accent} !important; }

        /* Background Overrides */
        [style*="background-color: rgb(142, 205, 248)"] { background-color: ${lighten(accent, 10)} !important; }
        [style*="background-color: rgb(2, 17, 61)"] { background-color: ${fade(accent, 15)} !important; }
        [style*="background-color: rgba(255, 255, 255, 0.25)"] { background-color: ${fade(text, 25)} !important; }
        [style*="background-color: rgb(147, 147, 147)"] { background-color: ${overlay0} !important; }

        /* Toggle switch circle fix */
        [style*="background-color: rgb(147, 147, 147)"] + [style*="background-color: rgb(250, 250, 250)"] ${flavor !== 'latte' ? `{ background-color: ${text} !important; }` : ''}

        [style*="background-color: rgb(29, 155, 240)"] { background-color: ${accent} !important; }
        [style*="background-color: rgb(239, 243, 244)"] { background-color: ${text} !important; }
        [style*="background-color: rgb(244, 33, 46)"] { background-color: ${red} !important; }
        [style*="background-color: rgb(0, 0, 0)"], [style*="background-color: #000"] { background-color: ${base} !important; }
        [style*="background-color: rgba(15, 20, 25, 0.75)"] { background-color: ${fade(crust, 75)} !important; }

        /* Text color inside buttons/video components */
        .r-l5o3uw, .r-1vtznih, .r-4nw3r4, .r-12d83nn, .r-oybae9, .r-yuvema, .r-3gvs5h, 
        [style*="background-image: linear-gradient(61.63deg, rgb(45, 66, 255)"],
        [data-testid="videoComponent"]:not(.r-4nw3r4), .r-loe9s5, .r-drfeu3:has([style*="backdrop-filter: blur(4px);"]) {
            [style*="color: rgb(255, 255, 255)"], [color="white"], .r-jwli3a {
                color: ${getContrastColor()} !important;
            }
        }
        
        /* Follow button text color */
        [data-testid$="-follow"] [style*="color: rgb(15, 20, 25)"] { color: ${getContrastColor()} !important; }

        /* Colorize Logo option */
        ${CONFIG.COLORIZE_LOGO ? `
            path[d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"] {
                fill: ${accent} !important;
            }
        ` : ''}

        a[aria-label^="Translated from"][aria-label$="by Google"] svg path { fill: ${text} !important; }

        /* Secondary (Report/Settings/Old UI) Styles */
        .ResponsiveLayout--Night .PageContainer { background-color: ${base}; }
        .list-explanation { color: ${subtext0}; }
        .notice, .notice p, h2 { color: ${subtext1}; }
        .notice.error { background: ${fade(red, 20)}; border-color: ${fade(red, 25)}; }

        .submit-btn {
          background-color: ${accent};
          color: ${getContrastColor()};
          border-color: ${darken(accent, 10)};
        }
        .submit-btn:hover, .redirect-btn:hover { background-color: ${darken(accent, 10)}; }
        .block-btn { color: ${maroon}; border-color: ${maroon}; }
        .mute-btn, .unfollow-btn, .email-report-btn { color: ${accent}; border-color: ${accent}; }
        .list-btn { border-color: ${surface1}; }
        .list-btn:first-of-type { border-top-color: ${surface1}; }
        .list-btn:hover { background-color: ${surface0}; }

        .js #session .user-menu { background-color: ${surface0}; }
        .dropdown-caret .caret-outer, .dropdown-caret .caret-inner { border-bottom-color: ${surface0}; }
        #session a, #session input, #session button { background: ${surface0}; color: ${subtext0}; }
        #session .user-menu a:focus, #session .user-menu a:hover, #session .user-menu button:focus, #session .user-menu button:hover, #session .user-menu input:focus, #session .user-menu input:hover {
            color: ${getContrastColor()};
            background-color: ${accent};
        }
        `;
    } 
    
    // --- API/OAuth Domain Styles ---
    else if (domain.includes('api.twitter.com') || domain.includes('api.x.com')) {
        css += `
        html { background: ${mantle}; }
        #header { color: ${subtext0}; background: ${base}; border-bottom-color: ${surface1}; }
        #header .logo a { border-bottom-color: transparent; }
        #header #session a { background: transparent; color: ${subtext0}; }
        #header #session h2 img { border-color: ${surface1}; }
        .footer { background: ${mantle}; border-top-color: ${surface1}; }
        .auth h2 { color: ${subtext1}; }
        .oauth #bd { border-color: ${surface1}; }
        .app-info h3 img { border-color: ${base}; }
        .permissions.allow strong { color: ${green}; }
        
        .button {
          background: ${overlay0};
          color: ${text};
          border-color: ${surface1};
        }
        .button:hover {
          color: ${text};
          border-color: ${surface1};
          background: ${darken(surface2, 10)};
        }
        
        .button.selected, .follow-button .unfollow .button {
          background-color: ${accent};
          color: ${getContrastColor()};
          border-color: ${darken(accent, 10)};
        }
        .button.selected:hover, .follow-button .unfollow .button:hover {
          background-color: ${darken(accent, 10)};
        }
        .button.selected .app-info, .button.selected #bd h3 { color: ${subtext0}; }
        .button.selected #ft { color: ${overlay0}; }
        `;
    }

    return css.replace(/\s+/g, ' ').trim();
}

/**
 * Applies the generated CSS styles using GM_addStyle or a fallback.
 */
function applyTheme() {
    // Remove previous styles if they exist (important for dynamic theme switching)
    document.querySelectorAll('[data-catppuccin-style]').forEach(el => el.remove());

    const url = window.location.hostname;
    const colors = getCurrentColors(url);
    if (colors) {
        const css = generateCSS(colors, url);
        if (css) {
            if (typeof GM_addStyle !== 'undefined') {
                GM_addStyle(css, { id: 'catppuccin-style', append: true, data: { 'catppuccin-style': 'true' } });
            } else {
                const style = document.createElement('style');
                style.textContent = css;
                style.setAttribute('data-catppuccin-style', 'true');
                document.head.appendChild(style);
            }
        }
    }
}

/**
 * Observes changes to the body class (like LightsOut) and reapplies the theme.
 */
function observeThemeChanges() {
    if (!document.body) return;
    let lastLightsOutState = document.body.classList.contains('LightsOut');
    
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const currentLightsOutState = document.body.classList.contains('LightsOut');
                
                if (currentLightsOutState !== lastLightsOutState) {
                    lastLightsOutState = currentLightsOutState;
                    applyTheme();
                }
            }
        }
    });

    observer.observe(document.body, { attributes: true });
}

// Ensure the theme is applied as soon as the body exists, and set up observers
if (document.body) {
    applyTheme();
    observeThemeChanges();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        applyTheme();
        observeThemeChanges();
    });
}
