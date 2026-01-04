// ==UserScript==
// @name        WhatsApp Web - Cyberpunk (CP77) Theme
// @namespace   http://tampermonkey.net/
// @version     1.2
// @description Changes the WhatsApp Web UI to a "Cyberpunk" high-tech theme.
// @author      N.C -Engineering
// @match       https://web.whatsapp.com/*
// @grant       GM_addStyle
// @run-at      document-start
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/555381/WhatsApp%20Web%20-%20Cyberpunk%20%28CP77%29%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/555381/WhatsApp%20Web%20-%20Cyberpunk%20%28CP77%29%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // We use GM_addStyle to inject all our CSS rules.
    // Using !important is necessary to override WhatsApp's default styles.
    const newStyles = `
        /*
         * === Global & Background ===
         * Dark, high-tech "netrunner" feel
         * Font: 'Consolas' is a good fallback. For a true CP77 feel,
         * you could change this to a font like 'Aldrich' or 'Share Tech Mono'
         * if you have it installed locally.
         */
        body, [data-testid="app-wrapper"] {
            background-color: #0a1a1f !important; /* Dark desaturated teal */
            background-image: linear-gradient(rgba(255, 220, 0, 0.05) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255, 220, 0, 0.05) 1px, transparent 1px) !important;
            background-size: 25px 25px !important;
            color: #00e0e0 !important; /* Cyber-cyan text */
            font-family: 'Consolas', 'Courier New', monospace !important;
            overflow: hidden !important; /* Prevent ugly scrollbars from our layout */

            /* NEW: Add a "scanlines" overlay for hacker vibe */
            position: relative;
        }

        /* NEW: Scanline overlay */
        body::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(rgba(0, 224, 224, 0.05) 1px, transparent 2px);
            background-size: 100% 3px;
            opacity: 0.3;
            z-index: 1000;
            pointer-events: none; /* Allows clicks to pass through */
            animation: scanline 10s linear infinite;
        }
        @keyframes scanline {
            0% { background-position-y: 0; }
            100% { background-position-y: 100px; }
        }


        /* Override WA's default rounded app container */
        [data-testid="app"] {
            border-radius: 0 !important;
        }

        /* Remove the default "chat wallpaper" */
        [data-testid="conversation-panel-body"] > div[style*="background-image"] {
            background-image: none !important;
        }

        /*
         * === Layout ===
         * We are reverting to the default 2-column layout for stability.
         * The experimental layout code has been removed.
         */
        [data-testid="app-wrapper"] > div:first-child {
             /* Revert to a simple layout */
             display: flex !important;
             flex-direction: row !important;
             position: relative !important;
             width: 100% !important;
             height: 100% !important;
             padding: 10px !important; /* Add a small padding around the app */
             box-sizing: border-box; /* Include padding in width/height */
        }

        /* NEW: Flicker Animation */
        @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.98; }
            52% { opacity: 1; }
            55% { opacity: 0.95; }
            56% { opacity: 1; }
        }

        /*
         * === EXPERIMENTAL "HACKER" LAYOUT (Top/Bottom Quadrants) ===
         *
         * ALL EXPERIMENTAL QUADRANT CODE HAS BEEN REMOVED FOR STABILITY.
         * We now apply hacker styling directly to the default panels.
         */

        /*
         * Apply hacker styling to the two main panels
         */
        [data-testid="app-wrapper"] > div:first-child > div:has([data-testid="chat-list"]),
        [data-testid="app-wrapper"] > div:first-child > div:has([data-testid="conversation-panel-header"]) {
            /* Hacker styling */
            border: 1px solid rgba(0, 224, 224, 0.3) !important;
            background-color: rgba(10, 25, 31, 0.9) !important;
            backdrop-filter: blur(5px) !important;
            border-radius: 0 !important;
            overflow: hidden !important;
            animation: flicker 15s infinite;

            /* CRITICAL: Make panels behave as default */
            display: flex !important;
            flex-direction: column !important;
            position: relative !important; /* Not fixed or absolute */
        }

        /*
         * === Main Panels (Chat List & Conversation) ===
         * Make the main panels dark, translucent, and sharp
         */
        [data-testid="chat-list"],
        [data-testid="conversation-panel-body"],
        [data-testid="conversation-panel-header"],
        [data-testid="panel-header-search"],
        [data-testid="compose-box"] {
            background-color: transparent !important; /* Let the panel bg show */
            backdrop-filter: none !important; /* Blur is on the parent */
            border-bottom: none !important; /* REMOVED: No more universal border */
            border-radius: 0 !important; /* Sharp corners */
            position: relative !important; /* NEW: Ensure they stack correctly */
        }

        /* NEW: Add specific borders back *inside* the panels */
        /* Update headers (profile/settings is in here) to be more prominent "up" */
        [data-testid="conversation-panel-header"],
        [data-testid="panel-header-search"] {
             border-bottom: 2px solid #ffdc00 !important; /* Cyber-yellow accent */
             min-height: 60px; /* Give headers more presence */
             background-color: rgba(10, 25, 31, 0.95) !important; /* Make headers more solid */
        }
        [data-testid="compose-box"] {
             border-top: 2px solid rgba(0, 224, 224, 0.3) !important; /* Thinner border for compose */
        }


        [data-testid="chat-list"] {
             /* Restore the default border, but with our style */
             border-right: 1px solid rgba(0, 224, 224, 0.3) !important;
             border-left: none !important;
             height: auto !important; /* Revert to default */
             background-color: transparent !important; /* NEW: Make chat-list transparent so parent bg shows */
        }

        /* NEW: Force conversation body to grow and fill empty space */
        [data-testid="conversation-panel-body"] {
            flex-grow: 1 !important;
            height: auto !important; /* Revert to default */
            min-height: 100px !important; /* Give it some min-height */
        }

        /*
         * === Text & Icons ===
         */
        span, div, [role="button"] {
            color: #00e0e0 !important; /* All text cyber-cyan */
            font-family: 'Consolas', 'Courier New', monospace !important;
            text-shadow: 0 0 3px rgba(0, 224, 224, 0.5); /* NEW: Glow effect */
        }

        /* All icons cyber-cyan */
        svg, svg path {
            fill: #00e0e0 !important;
            color: #00e0e0 !important;
        }

        /* Input fields */
        [data-testid="chat-list-search-input-box-input"],
        [data-testid="compose-box-input"] div[contenteditable="true"] {
            background-color: transparent !important;
            color: #fff !important; /* Make typing text pure white for contrast */
        }

        /*
         * === Message Bubbles ===
         */
        [data-testid="message-out"] {
            background-color: #102a33 !important; /* Dark teal */
            border: 1px solid rgba(255, 220, 0, 0.5) !important; /* Cyber-yellow border */
            border-radius: 0 !important; /* Sharp corners */
        }

        [data-testid="message-in"] {
            background-color: #1a1a1a !important; /* Dark gray */
            border: 1px solid rgba(0, 224, 224, 0.3) !important; /* Cyber-cyan border */
            border-radius: 0 !important; /* Sharp corners */
        }

        /*
         * === Chat List & Selection ===
         */

        /* Unread message count bubble */
        [data-testid="icon-unread-count"] {
            background-color: #ffdc00 !important; /* Cyber-yellow accent */
            border-radius: 0 !important;
        }
        [data-testid="icon-unread-count"] span {
            color: #000 !important; /* Black text on yellow bubble */
        }

        /* Selected chat in the list */
        [data-testid="chat-list"] > div > div[aria-selected="true"] {
             background-color: #ffdc00 !important; /* Cyber-yellow accent for selection */
        }

        /* Make text in selected chat black for readability */
        [data-testid="chat-list"] > div > div[aria-selected="true"] span {
            color: #000 !important;
            text-shadow: none !important; /* NEW: Remove glow on selected */
        }

        /* Make icons in selected chat black */
        [data-testid="chat-list"] > div > div[aria-selected="true"] svg,
        [data-testid="chat-list"] > div > div[aria-selected="true"] svg path {
            fill: #000 !important;
            color: #000 !important;
        }
    `;

    GM_addStyle(newStyles);
})();