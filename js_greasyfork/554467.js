// ==UserScript==
// @name         Websim Theme
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Theme menu with custom ui.
// @author       You
// @match        https://websim.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554467/Websim%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/554467/Websim%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define themes
    const themes = {
        "Vibrant Neon": { "--bg":"#1a1a2e","--panel":"#2e2e3f","--button":"linear-gradient(135deg,#ff416c,#ff4b2b)","--button-hover":"brightness(1.2)","--text":"#fff","--scroll":"#ff4b2b" },
        "Cyberpunk": { "--bg":"#0f0c29","--panel":"#1c1c2e","--button":"linear-gradient(90deg,#00ffff,#ff00ff)","--button-hover":"brightness(1.3)","--text":"#00ffff","--scroll":"#ff00ff" },
        "Solarized Dark": { "--bg":"#002b36","--panel":"#073642","--button":"#268bd2","--button-hover":"brightness(1.2)","--text":"#839496","--scroll":"#b58900" },
        "Retro Arcade": { "--bg":"#111111","--panel":"#222222","--button":"#ff00ff","--button-hover":"brightness(1.3)","--text":"#00ff00","--scroll":"#ff0000" },
        "Sunset Glow": { "--bg":"#ff7e5f","--panel":"#feb47b","--button":"#ff4b2b","--button-hover":"brightness(1.2)","--text":"#222","--scroll":"#ff416c" },
        "Ice Blue": { "--bg":"#0f2027","--panel":"#203a43","--button":"#00c6ff","--button-hover":"brightness(1.3)","--text":"#e0f7fa","--scroll":"#00bcd4" },
        "Matrix Green": { "--bg":"#000000","--panel":"#003300","--button":"#00ff00","--button-hover":"brightness(1.3)","--text":"#00ff00","--scroll":"#00ff00" },
        "Purple Haze": { "--bg":"#2c003e","--panel":"#5b2c6f","--button":"#9b59b6","--button-hover":"brightness(1.2)","--text":"#fff","--scroll":"#9b59b6" },
        "Ocean Deep": { "--bg":"#001f3f","--panel":"#003366","--button":"#0074D9","--button-hover":"brightness(1.2)","--text":"#e6f7ff","--scroll":"#0074D9" },
        "Hot Pink Fun": { "--bg":"#ff69b4","--panel":"#ff85c1","--button":"#ff1493","--button-hover":"brightness(1.3)","--text":"#fff","--scroll":"#ff1493" }
    };

    // Inject style
    const style = document.createElement('style');
    style.id = "websim-theme-style";
    document.head.appendChild(style);

    function applyTheme(name) {
        const t = themes[name];
        if (!t) return;

        style.innerHTML = `
            /* Solid background for whole page */
            html, body { background: ${t["--bg"]} !important; color: ${t["--text"]} !important; }

            /* Panels */
            .ui-container, .game-panel, .sidebar, .menu, .header, .footer, .panel, .chat-box, .leaderboard {
                background: ${t["--panel"]} !important;
                color: ${t["--text"]} !important;
                border-radius: 10px;
                transition: 0.3s;
            }

            /* Buttons */
            button, .btn, input[type="button"], .tab, .menu-item {
                background: ${t["--button"]} !important;
                color: ${t["--text"]} !important;
                border-radius: 8px;
                transition: all 0.2s;
            }
            button:hover, .btn:hover, input[type="button"]:hover, .tab:hover, .menu-item:hover {
                filter: ${t["--button-hover"]} !important;
                transform: scale(1.05);
            }

            /* Inputs and selects */
            input, textarea, select {
                background: ${t["--panel"]} !important;
                color: ${t["--text"]} !important;
                border: 1px solid ${t["--text"]};
                border-radius: 8px;
                padding: 8px 12px;
                transition: 0.2s;
            }
            input:focus, textarea:focus, select:focus {
                box-shadow: 0 0 8px ${t["--scroll"]};
            }

            /* Scrollbars */
            ::-webkit-scrollbar { width: 10px; }
            ::-webkit-scrollbar-track { background: ${t["--panel"]}; }
            ::-webkit-scrollbar-thumb { background: ${t["--scroll"]}; border-radius: 10px; }
        `;
        localStorage.setItem("websim-theme", name);
    }

    // Load saved theme
    const saved = localStorage.getItem("websim-theme");
    if (saved) applyTheme(saved);

    // Create floating theme menu
    function createMenu() {
        if (document.getElementById("websim-theme-menu")) return;

        const btn = document.createElement('button');
        btn.textContent = "Theme Settings";
        Object.assign(btn.style, {
            position: "fixed", top: "10px", right: "10px", zIndex: 9999,
            padding: "10px 15px", borderRadius: "8px", background: "#ff416c",
            color: "#fff", cursor: "pointer", fontWeight: "bold", boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
        });
        document.body.appendChild(btn);

        const menu = document.createElement('div');
        menu.id = "websim-theme-menu";
        Object.assign(menu.style, {
            position: "fixed", top: "50px", right: "10px", background: "#222",
            color: "#fff", padding: "15px", borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)", display: "none", zIndex: 9999,
            maxHeight: "70vh", overflowY: "auto"
        });

        Object.keys(themes).forEach(name => {
            const tBtn = document.createElement('button');
            tBtn.textContent = name;
            Object.assign(tBtn.style, { display:"block", margin:"5px 0", width:"100%" });
            tBtn.onclick = () => applyTheme(name);
            menu.appendChild(tBtn);
        });

        document.body.appendChild(menu);

        btn.onclick = () => {
            menu.style.display = menu.style.display === "none" ? "block" : "none";
        };
    }

    const observer = new MutationObserver(() => {
        if (document.body) {
            createMenu();
            observer.disconnect();
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
