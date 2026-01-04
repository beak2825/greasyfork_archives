// ==UserScript==
// @name         Picklet Theme Switcher
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Color Themes for Picklet! (first ever picklet script lets go)
// @match        https://*.picklet.party/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556782/Picklet%20Theme%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/556782/Picklet%20Theme%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const themeCSS = {
        red: `body, html, main {
    background-image: url("https://c00lestkiddever.nekoweb.org/assets/redbackground.png") !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
}
:root { --accent: oklch(63% .27 25); --accent-dark: oklch(47% .19 25); }
.primary-button.svelte-18sv61c { background-color: var(--accent) !important; box-shadow: 0 5px var(--accent-dark) !important; }
.primary-button.svelte-18sv61c:hover { box-shadow: 0 7px var(--accent-dark) !important; }
.primary-button.svelte-18sv61c:active { box-shadow: 0 3px var(--accent-dark) !important; }
.hover\\:text-green-500:hover { color: var(--accent) !important; }
.toast, .svelte-toast, .toast-container *, ._toastItem { background: var(--accent) !important; color: white !important; border-color: var(--accent-dark) !important; }
.toast-bar, .toast-progress { background: var(--accent-dark) !important; }
input:focus, textarea:focus, select:focus { outline: none !important; box-shadow: 0 0 0 3px var(--accent) !important; }`,

        orange: `body, html, main {
    background-image: url("https://c00lestkiddever.nekoweb.org/assets/orangebackground.png") !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
}
:root { --accent: oklch(72% .27 70); --accent-dark: oklch(57% .19 70); }
.primary-button.svelte-18sv61c { background-color: var(--accent) !important; box-shadow: 0 5px var(--accent-dark) !important; }
.primary-button.svelte-18sv61c:hover { box-shadow: 0 7px var(--accent-dark) !important; }
.primary-button.svelte-18sv61c:active { box-shadow: 0 3px var(--accent-dark) !important; }
.hover\\:text-green-500:hover { color: var(--accent) !important; }
.toast, .svelte-toast, .toast-container *, ._toastItem { background: var(--accent) !important; color: white !important; border-color: var(--accent-dark) !important; }
.toast-bar, .toast-progress { background: var(--accent-dark) !important; }
input:focus, textarea:focus, select:focus { outline: none !important; box-shadow: 0 0 0 3px var(--accent) !important; }`,

        yellow: `body, html, main {
    background-image: url("https://c00lestkiddever.nekoweb.org/assets/yellowbackground.png") !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
}
:root { --accent: oklch(90% .15 100); --accent-dark: oklch(70% .12 100); }
.primary-button.svelte-18sv61c { background-color: var(--accent) !important; box-shadow: 0 5px var(--accent-dark) !important; }
.primary-button.svelte-18sv61c:hover { box-shadow: 0 7px var(--accent-dark) !important; }
.primary-button.svelte-18sv61c:active { box-shadow: 0 3px var(--accent-dark) !important; }
.hover\\:text-green-500:hover { color: var(--accent) !important; }
.toast, .svelte-toast, .toast-container *, ._toastItem { background: var(--accent) !important; color: black !important; border-color: var(--accent-dark) !important; }
.toast-bar, .toast-progress { background: var(--accent-dark) !important; }
input:focus, textarea:focus, select:focus { outline: none !important; box-shadow: 0 0 0 3px var(--accent) !important; }`,

        green: "",

        blue: `body, html, main {
    background-image: url("https://c00lestkiddever.nekoweb.org/assets/bluebackground.png") !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
}
:root { --accent: oklch(52% .27 280); --accent-dark: oklch(40% .19 280); }
.primary-button.svelte-18sv61c { background-color: var(--accent) !important; box-shadow: 0 5px var(--accent-dark) !important; }
.primary-button.svelte-18sv61c:hover { box-shadow: 0 7px var(--accent-dark) !important; }
.primary-button.svelte-18sv61c:active { box-shadow: 0 3px var(--accent-dark) !important; }
.hover\\:text-green-500:hover { color: var(--accent) !important; }
.toast, .svelte-toast, .toast-container *, ._toastItem { background: var(--accent) !important; color: white !important; border-color: var(--accent-dark) !important; }
.toast-bar, .toast-progress { background: var(--accent-dark) !important; }
input:focus, textarea:focus, select:focus { outline: none !important; box-shadow: 0 0 0 3px var(--accent) !important; }`,

        purple: `body, html, main {
    background-image: url("https://c00lestkiddever.nekoweb.org/assets/purplebackground.png") !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
}
:root { --accent: oklch(60% .27 320); --accent-dark: oklch(45% .19 320); }
.primary-button.svelte-18sv61c { background-color: var(--accent) !important; box-shadow: 0 5px var(--accent-dark) !important; }
.primary-button.svelte-18sv61c:hover { box-shadow: 0 7px var(--accent-dark) !important; }
.primary-button.svelte-18sv61c:active { box-shadow: 0 3px var(--accent-dark) !important; }
.hover\\:text-green-500:hover { color: var(--accent) !important; }
.toast, .svelte-toast, .toast-container *, ._toastItem { background: var(--accent) !important; color: white !important; border-color: var(--accent-dark) !important; }
.toast-bar, .toast-progress { background: var(--accent-dark) !important; }
input:focus, textarea:focus, select:focus { outline: none !important; box-shadow: 0 0 0 3px var(--accent) !important; }`,

        pink: `body, html, main {
    background-image: url("https://c00lestkiddever.nekoweb.org/assets/pinkbackground.png") !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
}
:root { --accent: oklch(70% .27 340); --accent-dark: oklch(55% .19 340); }
.primary-button.svelte-18sv61c { background-color: var(--accent) !important; box-shadow: 0 5px var(--accent-dark) !important; }
.primary-button.svelte-18sv61c:hover { box-shadow: 0 7px var(--accent-dark) !important; }
.primary-button.svelte-18sv61c:active { box-shadow: 0 3px var(--accent-dark) !important; }
.hover\\:text-green-500:hover { color: var(--accent) !important; }
.toast, .svelte-toast, .toast-container *, ._toastItem { background: var(--accent) !important; color: white !important; border-color: var(--accent-dark) !important; }
.toast-bar, .toast-progress { background: var(--accent-dark) !important; }
input:focus, textarea:focus, select:focus { outline: none !important; box-shadow: 0 0 0 3px var(--accent) !important; }`,

        black: `body, html, main {
    background-image: url("https://c00lestkiddever.nekoweb.org/assets/blackbackground.png") !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
}
:root { --accent: #222; --accent-dark: #000; }
.primary-button.svelte-18sv61c { background-color: var(--accent) !important; box-shadow: 0 5px var(--accent-dark) !important; }
.primary-button.svelte-18sv61c:hover { box-shadow: 0 7px var(--accent-dark) !important; }
.primary-button.svelte-18sv61c:active { box-shadow: 0 3px var(--accent-dark) !important; }
.hover\\:text-green-500:hover { color: var(--accent) !important; }
.toast, .svelte-toast, .toast-container *, ._toastItem { background: var(--accent) !important; color: white !important; border-color: var(--accent-dark) !important; }
.toast-bar, .toast-progress { background: var(--accent-dark) !important; }
input:focus, textarea:focus, select:focus { outline: none !important; box-shadow: 0 0 0 3px var(--accent) !important; }`,

        brown: `body, html, main {
    background-image: url("https://c00lestkiddever.nekoweb.org/assets/brownbackground.png") !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
}
:root { --accent: oklch(50% .25 35); --accent-dark: oklch(35% .18 35); }
.primary-button.svelte-18sv61c { background-color: var(--accent) !important; box-shadow: 0 5px var(--accent-dark) !important; }
.primary-button.svelte-18sv61c:hover { box-shadow: 0 7px var(--accent-dark) !important; }
.primary-button.svelte-18sv61c:active { box-shadow: 0 3px var(--accent-dark) !important; }
.hover\\:text-green-500:hover { color: var(--accent) !important; }
.toast, .svelte-toast, .toast-container *, ._toastItem { background: var(--accent) !important; color: white !important; border-color: var(--accent-dark) !important; }
.toast-bar, .toast-progress { background: var(--accent-dark) !important; }
input:focus, textarea:focus, select:focus { outline: none !important; box-shadow: 0 0 0 3px var(--accent) !important; }`
    };

    const sidebarColors = {
        red: { bg: "#ff4d4d", shadow: "#b30000" },
        orange: { bg: "#ff9a4d", shadow: "#b36b00" },
        yellow: { bg: "#ffea4d", shadow: "#b3a300" },
        green: { bg: "", shadow: "" },
        blue: { bg: "#4da6ff", shadow: "#0066b3" },
        purple: { bg: "#b84dff", shadow: "#6600b3" },
        pink: { bg: "#ff4da6", shadow: "#b30066" },
        black: { bg: "#222", shadow: "#000" },
        brown: { bg: "#8B4513", shadow: "#5C2D00" }
    };

    let style = document.createElement("style");
    style.id = "theme-style";
    document.head.appendChild(style);

    function applyTheme(theme) {
        style.innerText = themeCSS[theme] || "";
        document.querySelectorAll(".sidebar.svelte-129hoe0").forEach(sb => {
            if (theme === "green") {
                sb.style.backgroundColor = "";
                sb.style.boxShadow = "";
            } else {
                sb.style.backgroundColor = sidebarColors[theme].bg;
                sb.style.boxShadow = `8px 0 ${sidebarColors[theme].shadow}`;
            }
        });
        localStorage.setItem("pickletTheme", theme);
    }

    applyTheme(localStorage.getItem("pickletTheme") || "green");

    const observer = new MutationObserver(() => applyTheme(localStorage.getItem("pickletTheme") || "green"));
    observer.observe(document.body, { childList: true, subtree: true });

    function addThemeButton() {
        const logoutBtn = document.querySelector("button.red-button.picklet-button");
        if (!logoutBtn) return setTimeout(addThemeButton, 500);

        const themeBtn = logoutBtn.cloneNode(true);
        themeBtn.innerHTML = `<i class="fas fa-paintbrush" style="margin-right:0.5em;"></i> Change Theme`;

        const dropdown = document.createElement("div");
        dropdown.style.position = "absolute";
        dropdown.style.background = "#222";
        dropdown.style.color = "white";
        dropdown.style.border = "1px solid #555";
        dropdown.style.borderRadius = "8px";
        dropdown.style.padding = "5px";
        dropdown.style.display = "none";
        dropdown.style.flexDirection = "column";
        dropdown.style.zIndex = 9999;

        const order = ["red","orange","yellow","green","blue","purple","pink","black","brown"];
        order.forEach(key => {
            const item = document.createElement("button");
            item.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            item.style.margin = "2px 0";
            item.style.padding = "4px 8px";
            item.style.background = "#333";
            item.style.color = "white";
            item.style.border = "none";
            item.style.cursor = "pointer";
            item.style.borderRadius = "4px";
            item.addEventListener("click", () => {
                applyTheme(key);
                dropdown.style.display = "none";
            });
            item.addEventListener("mouseenter", () => item.style.background = "#555");
            item.addEventListener("mouseleave", () => item.style.background = "#333");
            dropdown.appendChild(item);
        });

        document.body.appendChild(dropdown);

        themeBtn.style.position = "relative";
        themeBtn.addEventListener("click", e => {
            e.stopPropagation();
            const rect = themeBtn.getBoundingClientRect();
            dropdown.style.top = `${rect.bottom + window.scrollY + 5}px`;
            dropdown.style.left = `${rect.left + window.scrollX}px`;
            dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
        });

        document.addEventListener("click", () => dropdown.style.display = "none");
        logoutBtn.parentNode.insertBefore(themeBtn, logoutBtn.nextSibling);
    }

    addThemeButton();
})();
