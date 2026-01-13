// ==UserScript==
// @name         Angular Route Switcher
// @namespace    https://github.com/junyou1998/angular-route-switcher
// @version      1.4.1
// @description      Automatically detects Angular routes and provides a floating UI to switch between them. Works only in Dev Mode (requires window.ng).
// @description:zh-TW 自動偵測 Angular 路由並提供浮動介面進行切換。僅適用於開發模式 (需要 window.ng)。
// @author       junyou
// @match        http://localhost:*/*
// @match        http://127.0.0.1:*/*
// @grant        none
// @icon         https://cdn.jsdelivr.net/gh/junyou1998/angular-route-switcher@main/icon.webp
// @license      MIT
// @homepageURL  https://github.com/junyou1998/angular-route-switcher
// @supportURL   https://github.com/junyou1998/angular-route-switcher/issues
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/562323/Angular%20Route%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/562323/Angular%20Route%20Switcher.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Configuration
    const CONFIG = {
        pollInterval: 1000,
        maxPollAttempts: 60,
        uiZIndex: 99999,
        colors: {
            primary: "#006D50",
            primaryHover: "#004D38",
            primaryLight: "rgba(0, 109, 80, 0.08)",
            background: "#ffffff",
            text: "#333333",
            border: "#e0e0e0",
            scrollThumb: "#cccccc",
            scrollThumbHover: "#aaaaaa",
            scrollTrack: "#f5f5f5",
        },
    };

    // Localization
    const I18N = {
        en: {
            title: "Available Routes",
            refresh: "↻ Refresh",
            searchPlaceholder: "Search routes...",
            noRoutes: "No routes found",
            dynamicTitle: "(Dynamic Title)",
            paramPrompt: "Route contains parameters. Please edit:",
            tooltip: "Angular Routes",
        },
        "zh-TW": {
            title: "可用路由",
            refresh: "↻ 重新整理",
            searchPlaceholder: "搜尋路由...",
            noRoutes: "未找到路由",
            dynamicTitle: "(動態標題)",
            paramPrompt: "此路由包含參數，請編輯路徑:",
            tooltip: "Angular 路由切換",
        },
    };

    // Detect Language
    let currentLang = "en";
    const languages = navigator.languages || [
        navigator.language || navigator.userLanguage,
    ];

    for (const l of languages) {
        if (!l) continue;
        const lower = l.toLowerCase();

        if (lower.startsWith("zh")) {
            if (
                lower.includes("tw") ||
                lower.includes("hk") ||
                lower === "zh"
            ) {
                currentLang = "zh-TW";
                break;
            }
        } else if (lower.startsWith("en")) {
            currentLang = "en";
            break;
        }
    }

    const TEXT = I18N[currentLang] || I18N["en"];

    let pollAttempts = 0;
    let routes = [];
    let router = null;

    // --- Core Logic ---

    function extractRoutes(config, parentPath = "") {
        let extracted = [];
        for (const route of config) {
            if (route.redirectTo) continue;

            let currentPath = parentPath;
            if (route.path && route.path !== "") {
                currentPath = parentPath
                    ? `${parentPath}/${route.path}`
                    : route.path;
            }

            if (route.path !== "**" && !currentPath.includes("**")) {
                if (
                    route.component ||
                    route.loadComponent ||
                    (route.children && route.children.length > 0)
                ) {
                    let title = route.title;
                    if (!title && route.data && route.data.title) {
                        title = route.data.title;
                    }

                    if (typeof title === "function") {
                        title = TEXT.dynamicTitle;
                    }

                    extracted.push({
                        path: currentPath,
                        title: title || "",
                    });
                }
            }

            if (route.children) {
                extracted = extracted.concat(
                    extractRoutes(route.children, currentPath)
                );
            }
        }

        const unique = new Map();
        extracted.forEach((item) => {
            if (!unique.has(item.path)) {
                unique.set(item.path, item);
            }
        });

        return Array.from(unique.values());
    }

    function initAngularContext() {
        const rootElement = document.querySelector("[ng-version]");
        if (!rootElement) return false;

        const ng = window.ng;
        if (!ng || !ng.getComponent) return false;

        try {
            let rootComp = ng.getComponent(rootElement);

            if (!rootComp) {
                const allElements = document.querySelectorAll("*");
                for (let i = 0; i < Math.min(allElements.length, 100); i++) {
                    const comp = ng.getComponent(allElements[i]);
                    if (comp) {
                        rootComp = comp;
                        break;
                    }
                }
            }

            if (rootComp) {
                for (const key in rootComp) {
                    if (
                        rootComp[key] &&
                        rootComp[key].config &&
                        typeof rootComp[key].navigateByUrl === "function"
                    ) {
                        router = rootComp[key];
                        break;
                    }
                }
            }

            if (!router) {
                const allElements = document.querySelectorAll("*");
                for (let i = 0; i < Math.min(allElements.length, 500); i++) {
                    const el = allElements[i];
                    const comp = ng.getComponent(el);
                    if (comp) {
                        for (const key in comp) {
                            if (
                                comp[key] &&
                                comp[key].config &&
                                typeof comp[key].navigateByUrl === "function"
                            ) {
                                router = comp[key];
                                break;
                            }
                        }
                    }
                    if (router) break;
                }
            }

            if (router) {
                routes = extractRoutes(router.config);
                createUI();
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    // --- UI Implementation ---

    function createUI() {
        if (document.getElementById("ng-route-switcher-root")) return;

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0";
        document.head.appendChild(link);

        const container = document.createElement("div");
        container.id = "ng-route-switcher-root";

        const shadow = container.attachShadow({ mode: "open" });

        const style = document.createElement("style");
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
            
            .backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: ${CONFIG.uiZIndex - 2};
                display: none;
            }

            .fab {
                position: fixed;
                width: 50px;
                height: 50px;
                background-color: ${CONFIG.colors.primary};
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                cursor: grab;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: ${CONFIG.uiZIndex};
                transition: background-color 0.2s, transform 0.1s, width 0.3s, height 0.3s, border-radius 0.3s;
                color: white;
                user-select: none;
                touch-action: none;
            }
            .fab.snapping {
                transition: transform 0.1s, top 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28), left 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28), background-color 0.2s;
            }
            .fab:active {
                cursor: grabbing;
                transform: scale(0.95);
            }
            .fab:hover {
                background-color: ${CONFIG.colors.primaryHover};
            }
            .fab:hover .minimize-btn {
                opacity: 1;
            }

            /* Minimized (Pill) State */
            .fab.minimized {
                width: 12px;
                height: 48px;
                border-radius: 6px;
                cursor: pointer;
                background-color: ${
                    CONFIG.colors.primary
                }CC; /* Slight transparency */
                overflow: hidden; /* Hide internal elements when small */
            }
            .fab.minimized:hover {
                width: 16px;
                background-color: ${CONFIG.colors.primary};
            }
            .fab.minimized .material-symbols-outlined, 
            .fab.minimized .minimize-btn {
                display: none;
            }

            .minimize-btn {
                position: absolute;
                top: -8px;
                right: -8px;
                width: 24px;
                height: 24px;
                background: rgba(0, 0, 0, 0.4);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s, transform 0.2s, background-color 0.2s;
                z-index: 1;
                font-size: 14px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .minimize-btn:hover {
                transform: scale(1.1);
                background: rgba(0, 0, 0, 0.7);
            }
            .minimize-btn .material-symbols-outlined {
                font-size: 16px;
                font-weight: bold;
            }

            .material-symbols-outlined {
                font-family: 'Material Symbols Outlined';
                font-weight: normal;
                font-style: normal;
                font-size: 24px;
                line-height: 1;
                letter-spacing: normal;
                text-transform: none;
                display: inline-block;
                white-space: nowrap;
                word-wrap: normal;
                direction: ltr;
            }
            
            /* ... (Rest of existing styles) ... */
            .menu {
                position: fixed;
                background: ${CONFIG.colors.background};
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                width: 300px;
                max-height: 400px; 
                z-index: ${CONFIG.uiZIndex - 1};
                display: none;
                flex-direction: column;
                font-family: sans-serif;
                font-size: 14px;
                border: 1px solid ${CONFIG.colors.border};
                overflow: hidden; 
            }
            .menu.open {
                display: flex;
            }
            .menu-header {
                padding: 12px;
                background: #f5f5f5;
                font-weight: bold;
                border-bottom: 1px solid ${CONFIG.colors.border};
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: ${CONFIG.colors.text};
                flex-shrink: 0;
            }
            .search-box {
                padding: 8px;
                border-bottom: 1px solid ${CONFIG.colors.border};
                flex-shrink: 0;
            }
            .search-box input {
                width: 100%;
                padding: 6px;
                box-sizing: border-box;
                border: 1px solid #ddd;
                border-radius: 4px;
                outline: none;
            }
            .search-box input:focus {
                border-color: ${CONFIG.colors.primary};
                box-shadow: 0 0 0 1px ${CONFIG.colors.primary};
            }
            .route-list {
                list-style: none;
                padding: 0;
                margin: 0;
                overflow-y: auto; 
                flex: 1; 
            }
            .route-list::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            .route-list::-webkit-scrollbar-track {
                background: ${CONFIG.colors.scrollTrack};
            }
            .route-list::-webkit-scrollbar-thumb {
                background: ${CONFIG.colors.scrollThumb};
                border-radius: 3px;
            }
            .route-list::-webkit-scrollbar-thumb:hover {
                background: ${CONFIG.colors.scrollThumbHover};
            }

            .route-item {
                padding: 10px 12px;
                cursor: pointer;
                color: ${CONFIG.colors.text};
                border-bottom: 1px solid #f0f0f0;
                transition: background 0.1s;
            }
            .route-item:hover {
                background-color: ${CONFIG.colors.primaryLight};
                color: ${CONFIG.colors.primary};
            }
            .route-item:last-child {
                border-bottom: none;
            }
            .route-path {
                font-weight: 500;
            }
            .route-title {
                font-size: 0.85em;
                color: #666;
                margin-top: 2px;
            }
            .refresh-btn {
                font-size: 12px;
                color: ${CONFIG.colors.primary};
                cursor: pointer;
                background: none;
                border: none;
                padding: 0;
            }
        `;

        const backdrop = document.createElement("div");
        backdrop.className = "backdrop";
        backdrop.onclick = () => {
            if (isOpen) toggleMenu();
        };

        const fab = document.createElement("div");
        fab.className = "fab";
        fab.innerHTML =
            '<span class="material-symbols-outlined">explore</span>';
        fab.title = TEXT.tooltip;

        // Minimize Button
        const minimizeBtn = document.createElement("div");
        minimizeBtn.className = "minimize-btn";
        minimizeBtn.innerHTML =
            '<span class="material-symbols-outlined">close</span>';
        minimizeBtn.title = "Minimize";
        fab.appendChild(minimizeBtn);

        let storedState = null;
        try {
            storedState = JSON.parse(localStorage.getItem("ARS_STATE"));
        } catch (e) {}

        let initialTop = window.innerHeight - 80;
        let initialLeft = window.innerWidth - 80;
        let isMinimized = false;
        let dockedSide = "right";

        if (storedState) {
            initialTop =
                storedState.top !== undefined ? storedState.top : initialTop;
            initialLeft =
                storedState.left !== undefined ? storedState.left : initialLeft;
            isMinimized = !!storedState.isMinimized;
            dockedSide = storedState.dockedSide || "right";
        }

        // Validate bounds
        if (initialTop < 20) initialTop = 20;
        if (initialTop > window.innerHeight - 70)
            initialTop = window.innerHeight - 70;
        if (initialLeft < 0) initialLeft = 0;
        if (initialLeft > window.innerWidth - 12)
            initialLeft = window.innerWidth - 50;

        fab.style.top = `${initialTop}px`;
        fab.style.left = `${initialLeft}px`;

        if (isMinimized) {
            fab.classList.add("minimized");
            // small offset check for minimized
            if (dockedSide === "right") {
                fab.style.left = `${window.innerWidth - 12}px`;
            } else {
                fab.style.left = "0px";
            }
        }

        const menu = document.createElement("div");
        menu.className = "menu";

        const header = document.createElement("div");
        header.className = "menu-header";

        const titleSpan = document.createElement("span");
        titleSpan.textContent = TEXT.title;

        const refreshBtn = document.createElement("button");
        refreshBtn.className = "refresh-btn";
        refreshBtn.textContent = TEXT.refresh;
        refreshBtn.onclick = (e) => {
            e.stopPropagation();
            refreshRoutes();
        };

        header.appendChild(titleSpan);
        header.appendChild(refreshBtn);

        const searchBox = document.createElement("div");
        searchBox.className = "search-box";
        const searchInput = document.createElement("input");
        searchInput.placeholder = TEXT.searchPlaceholder;
        searchBox.appendChild(searchInput);

        const ul = document.createElement("ul");
        ul.className = "route-list";

        menu.appendChild(header);
        menu.appendChild(searchBox);
        menu.appendChild(ul);

        shadow.appendChild(style);
        shadow.appendChild(backdrop);
        shadow.appendChild(fab);
        shadow.appendChild(menu);
        document.body.appendChild(container);

        let isOpen = false;
        // isMinimized is already defined above

        // --- Persistence Helper ---
        function saveState() {
            const state = {
                top: parseFloat(fab.style.top),
                left: parseFloat(fab.style.left),
                isMinimized: isMinimized,
                dockedSide: dockedSide,
            };
            localStorage.setItem("ARS_STATE", JSON.stringify(state));
        }

        // --- Drag & Drop Logic ---
        let isDragging = false;
        let startX, startY, initialFabLeft, initialFabTop;
        let dragThreshold = 5;
        let hasMoved = false;

        // Track which side the FAB is docked to ('left' or 'right')
        fab.addEventListener("mousedown", dragStart);
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", dragEnd);

        fab.addEventListener("touchstart", dragStart, { passive: false });
        document.addEventListener("touchmove", drag, { passive: false });
        document.addEventListener("touchend", dragEnd);

        // --- Minimize Logic ---
        minimizeBtn.addEventListener("mousedown", (e) => {
            e.stopPropagation(); // Prevent drag start
            toggleMinimize();
        });

        // Prevent click propogation on minimize btn for touch
        minimizeBtn.addEventListener("touchstart", (e) => {
            e.stopPropagation();
        });

        minimizeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        // Remove mousedown/touchstart listeners above and use simple click
        minimizeBtn.onclick = (e) => {
            e.stopPropagation();
            toggleMinimize();
        };

        function toggleMinimize() {
            if (isOpen) toggleMenu(); // Close menu if open

            isMinimized = !isMinimized;
            saveState(); // Save state

            if (isMinimized) {
                fab.classList.add("minimized");
                // Snap to very edge
                snapToEdge(true);
            } else {
                fab.classList.remove("minimized");
                snapToEdge();
            }
        }

        // --- Resize Logic ---
        window.addEventListener("resize", () => {
            repositionOnResize();
        });

        function repositionOnResize() {
            if (isDragging) return;

            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;
            const rect = fab.getBoundingClientRect();

            let newLeft;
            // Sticky logic
            if (dockedSide === "left") {
                newLeft = isMinimized ? 0 : 20;
            } else {
                newLeft =
                    winWidth - (isMinimized ? 12 : 50) - (isMinimized ? 0 : 20);
            }

            let newTop = rect.top;
            if (newTop < 20) newTop = 20;
            if (newTop > winHeight - 50 - 20) newTop = winHeight - 50 - 20;

            fab.style.left = `${newLeft}px`;
            fab.style.top = `${newTop}px`;

            if (isOpen) {
                adjustMenuPosition(newLeft, newTop);
            }
        }

        function dragStart(e) {
            if (e.type === "touchstart") e.preventDefault();

            fab.classList.remove("snapping");

            isDragging = true;
            hasMoved = false;

            const clientX = e.type.includes("touch")
                ? e.touches[0].clientX
                : e.clientX;
            const clientY = e.type.includes("touch")
                ? e.touches[0].clientY
                : e.clientY;

            startX = clientX;
            startY = clientY;

            const rect = fab.getBoundingClientRect();
            initialFabLeft = rect.left;
            initialFabTop = rect.top;
        }

        function drag(e) {
            if (!isDragging) return;

            const clientX = e.type.includes("touch")
                ? e.touches[0].clientX
                : e.clientX;
            const clientY = e.type.includes("touch")
                ? e.touches[0].clientY
                : e.clientY;

            const dx = clientX - startX;
            const dy = clientY - startY;

            if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
                hasMoved = true;
            }

            let newLeft = initialFabLeft + dx;
            let newTop = initialFabTop + dy;

            fab.style.left = `${newLeft}px`;
            fab.style.top = `${newTop}px`;
        }

        function dragEnd(e) {
            if (!isDragging) return;
            isDragging = false;

            fab.classList.add("snapping");

            if (hasMoved) {
                snapToEdge(isMinimized);
            } else {
                if (isMinimized) {
                    toggleMinimize(); // Restore on click
                } else {
                    toggleMenu();
                }
            }
            saveState(); // Save position after drag/snap
        }

        function snapToEdge(isMin = false) {
            const rect = fab.getBoundingClientRect();
            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;

            const distToLeft = rect.left;
            const distToRight = winWidth - rect.right;

            let finalLeft;
            if (distToLeft < distToRight) {
                finalLeft = isMin ? 0 : 20;
                dockedSide = "left";
            } else {
                finalLeft = winWidth - (isMin ? 12 : 50) - (isMin ? 0 : 20);
                dockedSide = "right";
            }

            let finalTop = rect.top;
            if (finalTop < 20) finalTop = 20;
            if (finalTop > winHeight - 50 - 20) finalTop = winHeight - 50 - 20;

            fab.style.left = `${finalLeft}px`;
            fab.style.top = `${finalTop}px`;

            if (isOpen) {
                adjustMenuPosition(finalLeft, finalTop);
            }
        }

        // --- Menu Logic ---

        function toggleMenu() {
            if (isMinimized) return; // Should not happen but safety check

            isOpen = !isOpen;
            menu.className = isOpen ? "menu open" : "menu";
            backdrop.style.display = isOpen ? "block" : "none";

            if (isOpen) {
                const rect = fab.getBoundingClientRect();
                adjustMenuPosition(rect.left, rect.top);
                searchInput.focus();
                renderList(routes);
            }
        }

        function adjustMenuPosition(fabLeft, fabTop) {
            const menuWidth = 300;
            const winHeight = window.innerHeight;
            const menuHeight = Math.min(400, winHeight - 40);
            const winWidth = window.innerWidth;

            let menuLeft = fabLeft - menuWidth - 10;
            let menuTop = fabTop - menuHeight + 50;

            if (fabLeft < winWidth / 2) {
                menuLeft = fabLeft + 60;
            }

            if (menuTop + menuHeight > winHeight - 20) {
                menuTop = winHeight - menuHeight - 20;
            }
            if (menuTop < 20) {
                menuTop = 20;
            }

            menu.style.left = `${menuLeft}px`;
            menu.style.top = `${menuTop}px`;
        }

        searchInput.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = routes.filter(
                (r) =>
                    r.path.toLowerCase().includes(term) ||
                    (r.title && String(r.title).toLowerCase().includes(term))
            );
            renderList(filtered);
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && isOpen) {
                toggleMenu();
            }
        });

        function renderList(items) {
            ul.innerHTML = "";
            if (items.length === 0) {
                const li = document.createElement("li");
                li.className = "route-item";
                li.style.color = "#999";
                li.style.cursor = "default";
                li.textContent = TEXT.noRoutes;
                ul.appendChild(li);
                return;
            }

            items.forEach((item) => {
                const li = document.createElement("li");
                li.className = "route-item";

                let content = `<div class="route-path">/${item.path}</div>`;
                if (item.title) {
                    content += `<div class="route-title">${item.title}</div>`;
                }

                li.innerHTML = content;

                li.onclick = () => {
                    const routePath = item.path;
                    if (routePath.includes(":")) {
                        const newPath = prompt(TEXT.paramPrompt, routePath);
                        if (newPath !== null) {
                            router.navigateByUrl(newPath);
                        }
                    } else {
                        router.navigateByUrl(routePath);
                    }
                };
                ul.appendChild(li);
            });
        }

        renderList(routes);

        function refreshRoutes() {
            if (router) {
                routes = extractRoutes(router.config);
                renderList(routes);
            }
        }
    }

    const poller = setInterval(() => {
        pollAttempts++;
        if (initAngularContext()) {
            clearInterval(poller);
        } else if (pollAttempts >= CONFIG.maxPollAttempts) {
            clearInterval(poller);
        }
    }, CONFIG.pollInterval);
})();
