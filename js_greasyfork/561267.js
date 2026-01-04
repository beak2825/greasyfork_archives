// ==UserScript==
// @name         Youtube light themes (auto-disable on dark mode)
// @namespace    http://tampermonkey.net/
// @version      2026-01-03-1
// @description  Light themes for YouTube Music that auto-disable on dark mode
// @license      MIT
// @author       Sreinumder
// @match        https://music.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561267/Youtube%20light%20themes%20%28auto-disable%20on%20dark%20mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561267/Youtube%20light%20themes%20%28auto-disable%20on%20dark%20mode%29.meta.js
// ==/UserScript==
// This script git link
// https://gist.github.com/Sreinumder/c834ba41cc77f9a1e0255be9691c620d
// Orginal script git link
// https://github.com/ysmnikhil/youtube-music-light-themes

(function () {
    "use strict";

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const uLight = {
        count: 0,
        limit: 10,
        currentTheme: 1,
        initStatus: false,
        textBlack: [],
        enabled: false,

        themes: [
            "#fff",
            "#f1f1f1",
            "#d8b4fe",
            "#a78bfa",
            "#0e7490",
            "#86198f",
            "#94a3b8",
            "#44403c",
            "#f43f5e",
            "#7c3aed",
            "#164e63",
            "#713f12",
            "#c2410c",
            "rgb(111 82 110 / 81%)",
            "rgb(108 165 163 / 82%)",
            "rgb(114 111 64 / 82%)",
            "rgb(151 132 132 / 82%)",
            "rgb(0 0 0)",
        ],

        /* ===============================
           INIT / DESTROY
        ================================ */

        init() {
            if (mediaQuery.matches || this.enabled) return;

            this.enabled = true;
            this.currentTheme = this.localStorage();
            this.textBlack = this.themes.slice(0, 8);

            this.addCss();
            this.createThemes();
            this.pluginInit();
        },

        disable() {
            if (!this.enabled) return;

            this.enabled = false;
            this.initStatus = false;

            // Remove injected styles
            document.querySelectorAll("style[id^='uLight'], style:not([data-youtube])")
                .forEach(s => s.remove());

            // Remove UI
            document.querySelector(".uLight-theme-container")?.remove();

            // Reset modified CSS variables
            const html = document.documentElement;
            const body = document.body;

            html.style.removeProperty("--ytmusic-color-black1");
            html.style.removeProperty("--ytmusic-color-black4");
            body.style.removeProperty("background");
        },

        /* ===============================
           SYSTEM SCHEME HANDLER
        ================================ */

        handleSchemeChange(e) {
            if (e.matches) {
                // Dark mode → disable plugin
                uLight.disable();
            } else {
                // Light mode → re-enable plugin
                uLight.init();
            }
        },

        /* ===============================
           CORE LOGIC (mostly unchanged)
        ================================ */

        pluginInit() {
            if (this.initStatus) return;
            this.initStatus = true;

            setTimeout(() => {
                document
                    .querySelector("yt-page-navigation-progress")
                    ?.addEventListener("DOMSubtreeModified", () => {
                        this.checkProgress();
                    });
            }, 1000);

            this.fixBackground();
            this.setTheme(this.currentTheme);
        },

        localStorage(theme = null) {
            if (theme !== null) {
                this.currentTheme = theme;
                localStorage.setItem("uLight-theme", theme);
            }
            return localStorage.getItem("uLight-theme") || this.currentTheme;
        },

        fixBackground() {
            this.setProperty(
                document.querySelector(
                    "ytmusic-browse-response[has-background]:not([disable-gradient]) .background-gradient"
                ),
                "background",
                "var(--ytmusic-background)"
            );
        },

        checkProgress() {
            if (++this.count >= this.limit) {
                this.fixBackground();
                this.count = 0;
            }
        },

        createStyle(css, id) {
            const s = document.createElement("style");
            if (id) s.id = id;
            s.innerText = css;
            document.head.appendChild(s);
        },

        addCss() {
            let themeDots = "";
            this.themes.forEach((c, i) => {
                themeDots += `
                .uLight-theme-container p:nth-child(${i + 1}) {
                    background: ${c};
                }`;
            });

            this.createStyle(`
                .uLight-theme-container {
                    position: absolute;
                    right: 20px;
                    top: 20px;
                    display: flex;
                    flex-direction: column;
                }
                .uLight-theme-container p {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    cursor: pointer;
                    margin-top: 6px;
                    border: 1px solid;
                }
                ${themeDots}
            `, "uLight-style");
        },

        createThemes() {
            const el = document.createElement("div");
            el.className = "uLight-theme-container";
            el.innerHTML = this.themes.map(() => "<p></p>").join("");
            document.querySelector("ytmusic-nav-bar")?.appendChild(el);

            el.querySelectorAll("p").forEach((p, i) =>
                p.addEventListener("click", () => this.setTheme(i))
            );
        },

        setTheme(theme) {
            if (!this.enabled) return;

            const color = this.themes[theme];
            const clean = color.includes("/")
                ? color.split("/")[0].replace(")", "") + ")"
                : color;

            document.documentElement.style.setProperty("--ytmusic-color-black4", clean);
            document.documentElement.style.setProperty(
                "--ytmusic-color-black1",
                "var(--ytmusic-color-black4)"
            );
            document.body.style.background = color;

            if (this.textBlack.includes(color)) {
                this.createStyle("*{color:#000!important}", "uLight-text-black");
            } else {
                document.getElementById("uLight-text-black")?.remove();
            }

            this.localStorage(theme);
        },

        setProperty(el, key, val) {
            el?.style.setProperty(key, val);
        },
    };

    /* ===============================
       LISTEN FOR SCHEME CHANGES
    ================================ */

    mediaQuery.addEventListener("change", uLight.handleSchemeChange);

    // Initial state
    mediaQuery.matches ? uLight.disable() : uLight.init();
})();
