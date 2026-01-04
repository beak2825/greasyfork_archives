// ==UserScript==
// @name         Myuui's Minestrator Theme
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  Purple theme and cleaned UI for Minestrator
// @match        https://minestrator.com/my/server/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557419/Myuui%27s%20Minestrator%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/557419/Myuui%27s%20Minestrator%20Theme.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const injectCSS = () => {
        if (document.getElementById("myuui-css")) return;

        const style = document.createElement("style");
        style.id = "myuui-css";

        style.textContent = `
            :root { --ui-primary:#9333ea !important; }

            .text-primary,
            a.text-primary { color:#9333ea !important; }

            .bg-primary   { background-color:#9333ea !important; }
            .border-primary { border-color:#9333ea !important; }
            .ring-primary { --tw-ring-color:#9333ea !important; }

            /* Rainbow status dot */
            @keyframes rb {
                0%{background:red;} 25%{background:yellow;}
                50%{background:lime;} 75%{background:blue;}
                100%{background:red;}
            }
            .myuui-rainbow-dot { animation: rb 3s linear infinite !important; }

            /* Rainbow footer text */
            @keyframes rbtxt {
                0%{color:red;} 25%{color:yellow;}
                50%{color:lime;} 75%{color:blue;}
                100%{color:red;}
            }
            .myuui-rainbow-text { animation: rbtxt 3s linear infinite; font-weight:bold; }
        `;

        document.head.appendChild(style);
    };

    const removePaidUI = () => {
        const removeOnce = (sel) => {
            document.querySelectorAll(sel).forEach(el => el.remove());
        };

        // Original removals
        removeOnce('a[href*="section=livemap"]');
        removeOnce('a[href*="section=saves"]');
        removeOnce('a[href*="section=tasks"]');
        removeOnce('a[href*="/my/box/"]');
        removeOnce('.bg-tertiary');
        removeOnce('.i-lucide\\:circle-fading-arrow-up');
        removeOnce('.i-lucide\\:edit');

        // Remove Plugins and Mods links
        removeOnce('a[href*="section=plugins"]');
        removeOnce('a[href*="section=mods"]');

        // Remove dedicated ports warning box (on access page)
        document.querySelectorAll('div[data-orientation="vertical"][data-slot="root"]')
            .forEach(el => {
                if (el.textContent.includes("Dedicated ports are not available") ||
                    el.textContent.includes("upgrade to a paid plan")) {
                    el.remove();
                }
            });

        // Remove elements with tertiary styling that contain upgrade messages
        document.querySelectorAll('.bg-tertiary\\/10, [class*="bg-tertiary"]')
            .forEach(el => {
                if (el.textContent.includes("not available on free servers") ||
                    el.textContent.includes("upgrade to a paid plan")) {
                    el.remove();
                }
            });

        document.querySelectorAll('[data-v-1af05359]')
            .forEach(el => {
                if (el.textContent.includes("Dedicated ports")) el.remove();
            });
    };

    const applyDecorations = () => {
        const header = document.querySelector("div.flex.items-center.gap-4");
        if (header && !header.querySelector(".myuui-theme-tag")) {
            const span = document.createElement("span");
            span.textContent = "Myuui's Theme";
            span.className = "myuui-theme-tag";
            span.style.color = "#9333ea";
            span.style.fontWeight = "bold";
            span.style.marginLeft = "10px";
            header.appendChild(span);
        }

        document.querySelectorAll('p.text-center.text-sm')
            .forEach(p => {
                if (!p.textContent.includes("MineStrator")) return;
                if (p.querySelector(".myuui-rainbow-text")) return;

                const span = document.createElement("span");
                span.className = "myuui-rainbow-text";
                span.textContent = "Myuui's Theme";

                p.prepend(document.createTextNode(" - "));
                p.prepend(span);
            });
    };

    const rainbowDots = () => {
        document.querySelectorAll("span.rounded-full.bg-primary")
            .forEach(dot => {
                if (!dot.classList.contains("myuui-rainbow-dot")) {
                    dot.classList.add("myuui-rainbow-dot");
                }
            });
    };

    const replaceLogo = () => {
        const logoContainer = document.querySelector(".i-msr\\:minestrator-min-green");
        if (!logoContainer) return;

        logoContainer.innerHTML = "";

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("xmlns", svgNS);
        svg.setAttribute("viewBox", "0 0 36 44");
        svg.setAttribute("width", "36");
        svg.setAttribute("height", "44");

        const g = document.createElementNS(svgNS, "g");
        g.setAttribute("fill", "none");

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", "M24.0984 16.4504L20.627 15.6623C19.9885 15.544 19.3609 15.3733 18.7505 15.1519H18.4991C16.0146 19.1225 14.84 15.9776 11.5937 17.5275L11.2785 17.6814L10.8581 17.9966C10.5204 18.2219 10.2618 18.5474 10.1188 18.9274C8.77526 19.2051 7.62312 18.8973 6.13321 17.5388C6.53102 15.1069 7.12023 14.6415 7.83328 14.5139L8.54634 14.4576H8.57261C9.24438 14.3863 9.99496 14.2099 10.7906 12.9565C11.6462 11.6392 10.7418 12.3485 11.9878 11.2264C13.8717 9.5751 12.7684 4.95527 18.7505 6.29881C19.2271 6.39639 19.1896 6.51648 18.9231 6.5465C17.1593 6.74916 16.1385 6.5465 15.1327 8.79825C17.0092 7.42093 17.1668 9.10599 18.7955 8.11522C22.0456 5.81469 25.1755 8.45298 29.8216 7.53727C30.2307 7.46972 30.0618 7.77371 29.8629 7.85252C27.9189 8.6031 25.8773 9.11725 22.357 8.6031C20.8784 8.49802 20.4431 8.71194 19.9327 9.23359C23.2202 7.83 26.9056 11.0688 29.6902 10.2356C28.7418 10.6835 27.7285 10.9786 26.6879 11.11C27.9414 11.7105 29.2286 12.4611 30.4296 12.8364L33.931 3.7093C29.891 1.2361 25.236 -0.0489468 20.4994 0.00142607C11.286 0.00142607 2.11009 5.63079 2.11009 15.6773C2.11009 22.3087 7.16902 25.8477 13.1812 26.9361L14.8662 27.2401C14.8662 27.2401 22.1281 28.0244 26.0312 24.0951C26.4477 23.6748 26.3164 25.2548 26.3164 25.874V25.904C26.3059 26.5967 26.1552 27.28 25.8733 27.9128C25.5915 28.5455 25.1843 29.1146 24.6763 29.5856C24.3761 29.8671 24.0609 30.1373 23.7381 30.3963C23.5092 30.5764 23.2728 30.749 23.0363 30.9142C23.907 31.3833 24.1172 32.9145 24.1172 32.9145C23.5129 32.2502 21.948 31.616 21.948 31.616C21.4992 31.8744 21.037 32.1087 20.5632 32.3178C21.1036 32.693 21.4376 33.5412 21.599 34.0854C21.6471 34.2157 21.6835 34.3501 21.7078 34.4869C21.7078 34.5282 21.7078 34.5545 21.7078 34.5545C21.4113 33.8827 19.8313 33.2635 19.1708 33.0533C18.6717 33.1471 18.045 33.2372 17.6059 33.3085C18.8256 34.1529 18.9119 36.1082 18.9119 36.1082C18.3827 34.7909 15.9095 33.8114 15.4404 33.635H14.5247C14.8216 34.9085 14.7789 36.2375 14.4009 37.4893C14.3183 36.1382 12.1754 33.4474 12.1754 33.4474C11.5546 33.3506 10.9404 33.2152 10.3365 33.0421C10.6588 33.9264 10.8743 34.8462 10.9782 35.7817C10.9782 35.7817 7.58184 32.5467 4.07286 31.1881L0.657715 39.8498C5.73532 42.3329 11.3011 43.657 16.9529 43.7266C26.1137 43.7266 35.3421 38.7277 35.3421 28.6136C35.3346 21.393 30.6135 17.9103 24.0984 16.4504Z");
        path.setAttribute("fill", "#8000FF");

        g.appendChild(path);
        svg.appendChild(g);
        logoContainer.appendChild(svg);
    };

    const run = () => {
        injectCSS();
        removePaidUI();
        applyDecorations();
        rainbowDots();
        replaceLogo();
    };

    run();

    const observer = new MutationObserver(() => {
        if (window.myuuiTimer) cancelAnimationFrame(window.myuuiTimer);
        window.myuuiTimer = requestAnimationFrame(run);
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();