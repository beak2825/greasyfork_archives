// ==UserScript==
// @name         XenForo – Bewerbungsmarkierungen (Mobile Compatible)
// @namespace    https://tampermonkey.net/
// @version      1.2-mobile
// @description  Funktioniert auf Android & Desktop. Markiert Bewerbungen, prüft optional VPNs (auf Android deaktiviert).
// @author       You
// @match        https://looksmax.org/approval-queue/*
// @icon         https://www.google.com/s2/favicons?domain=looksmax.org
// @grant        GM_xmlhttpRequest
// @connect      proxycheck.io
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554886/XenForo%20%E2%80%93%20Bewerbungsmarkierungen%20%28Mobile%20Compatible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554886/XenForo%20%E2%80%93%20Bewerbungsmarkierungen%20%28Mobile%20Compatible%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const API_KEY = "3b83156665597b29c26db4cd95529724466fd2947299b7573b9db7982bc7a9b0";
    const ipCache = {};
    const filters = ["NORMAL","FEMALE","TOO SHORT","ALT ACCOUNT","VPN"];
    const activeFilters = new Set();
    const messagesMap = new Map();

    // --- Hilfsfunktion: Erkennung ob auf Android ---
    function isMobile() {
        return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    // --- Filter-Menü & API-Check ---
    (function insertDirectFilterMenu() {
        const filterBar = document.querySelector('.block-filterBar');
        if (!filterBar) return;

        const apiStatus = document.createElement('div');
        apiStatus.style.margin = "5px 0";
        apiStatus.style.fontWeight = "bold";
        apiStatus.style.color = "#666";
        apiStatus.textContent = isMobile() ? "Mobile Mode (VPN-Check disabled)" : "Checking API...";
        filterBar.parentNode.insertBefore(apiStatus, filterBar);

        if (!isMobile()) {
            const firstIPLink = document.querySelector('ul.listPlain li a[href]');
            if (!firstIPLink) {
                apiStatus.textContent = "No IP found yet…";
                apiStatus.style.color = "orange";
                return;
            }
            const ipText = firstIPLink.textContent.trim();
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://proxycheck.io/v2/${ipText}?key=${API_KEY}&vpn=1&risk=1`,
                onload(res) {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data[ipText] && typeof data[ipText].proxy !== "undefined") {
                            apiStatus.textContent = "API VALID";
                            apiStatus.style.color = "green";
                        } else {
                            apiStatus.textContent = "API FAILED";
                            apiStatus.style.color = "red";
                        }
                    } catch {
                        apiStatus.textContent = "API FAILED";
                        apiStatus.style.color = "red";
                    }
                },
                onerror() {
                    apiStatus.textContent = "API FAILED";
                    apiStatus.style.color = "red";
                }
            });
        }

        // Filter Buttons
        const menuContainer = document.createElement('div');
        menuContainer.style.display = "flex";
        menuContainer.style.flexWrap = "wrap";
        menuContainer.style.margin = "5px 0";

        filters.forEach(f => {
            const btn = document.createElement('button');
            btn.textContent = `${f} (0)`;
            btn.style.margin = "2px 5px";
            btn.dataset.tag = f;
            btn.addEventListener('click', () => {
                if(activeFilters.has(f)) activeFilters.delete(f);
                else activeFilters.add(f);
                updateFilterDisplay();
                btn.style.fontWeight = activeFilters.has(f) ? "bold" : "normal";
            });
            menuContainer.appendChild(btn);
        });

        filterBar.parentNode.insertBefore(menuContainer, filterBar);

        function updateFilterCounts() {
            filters.forEach(f => {
                const count = [...messagesMap.values()].filter(labels => labels.includes(f)).length;
                const btn = [...menuContainer.querySelectorAll('button')].find(b => b.dataset.tag === f);
                if(btn) btn.textContent = `${f} (${count})`;
            });
        }

        function updateFilterDisplay() {
            messagesMap.forEach((labels, message) => {
                if(activeFilters.size === 0) {
                    message.style.display = "";
                } else {
                    const show = labels.some(l => activeFilters.has(l));
                    message.style.display = show ? "" : "none";
                }
            });
            updateFilterCounts();
        }
    })();

    // --- VPN/Proxy Check (deaktiviert auf Mobile) ---
    function checkVPN(ip) {
        return new Promise(resolve => {
            if (isMobile()) return resolve(false); // skip on Android
            if (ipCache[ip] !== undefined) return resolve(ipCache[ip]);
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://proxycheck.io/v2/${ip}?key=${API_KEY}&vpn=1&risk=1`,
                onload(res) {
                    try {
                        const data = JSON.parse(res.responseText);
                        const isVPN = data[ip] ? (data[ip].proxy === "yes" || data[ip].vpn === "yes") : false;
                        ipCache[ip] = isVPN;
                        resolve(isVPN);
                    } catch {
                        ipCache[ip] = false;
                        resolve(false);
                    }
                },
                onerror() {
                    ipCache[ip] = false;
                    resolve(false);
                }
            });
        });
    }

    // --- Hauptfunktion: Highlight Bewerbungen ---
    async function highlightApplications() {
        const messages = document.querySelectorAll('.message');
        for (const message of messages) {
            let highlightColor = null;
            let boxShadowColor = null;
            const labels = [];

            const genderField = message.querySelector('dl[data-field="male_female"] dd');
            const reasonField = message.querySelector('dl[data-field="why_join"] dd');
            const dataCells = message.querySelectorAll('.dataList-cell');

            let isFemale = false;
            let isTooShort = false;
            let isAlt = false;
            let isVpnProxy = false;

            // FEMALE
            if (genderField && genderField.textContent.trim().toLowerCase() === "female") {
                isFemale = true;
                labels.push("FEMALE");
            }

            // TOO SHORT
            if (reasonField) {
                const wc = reasonField.textContent.trim().split(/\s+/).filter(w => w.length > 0).length;
                if (wc < 5) {
                    isTooShort = true;
                    labels.push("TOO SHORT");
                }
            }

            // ALT ACCOUNT
            dataCells.forEach(cell => {
                if (/(Moderating|Multiple account|Rejected user)/i.test(cell.textContent)) {
                    isAlt = true;
                    labels.push("ALT ACCOUNT");
                }
            });

            // IP-Check & Link-Änderung
            let ip = null;
            const listPlain = message.querySelector('ul.listPlain');
            if (listPlain) {
                const firstLink = listPlain.querySelector('li a[href]');
                if (firstLink) {
                    const ipText = firstLink.textContent.trim();
                    const match = ipText.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/);
                    if (match) {
                        ip = ipText;
                        firstLink.href = `https://whatismyipaddress.com/ip/${ip}`;
                        firstLink.target = "_blank";
                    }
                }
            }

            // VPN (nur Desktop)
            if (ip && !isMobile()) {
                isVpnProxy = await checkVPN(ip);
                if (isVpnProxy) labels.push("VPN");
            }

            if (labels.length === 0) labels.push("NORMAL");

            // 🎨 Farb-Logik: FEMALE > VPN > TOO SHORT > ALT > NORMAL
            if (isFemale) {
                highlightColor = "rgba(255,182,193,0.35)";
                boxShadowColor = "rgba(255,105,180,0.6)";
            } else if (isVpnProxy) {
                highlightColor = "rgba(135,206,250,0.35)";
                boxShadowColor = "rgba(30,144,255,0.6)";
            } else if (isTooShort) {
                highlightColor = "rgba(255,99,71,0.3)";
                boxShadowColor = "rgba(255,69,0,0.6)";
            } else if (isAlt) {
                highlightColor = "rgba(255,255,102,0.3)";
                boxShadowColor = "rgba(255,255,0,0.6)";
            }

            messagesMap.set(message, labels);

            // Anwenden
            const cells = message.querySelectorAll('.message-cell');
            cells.forEach(cell => {
                if (highlightColor) {
                    cell.style.backgroundColor = highlightColor;
                    cell.style.boxShadow = `0 0 15px 3px ${boxShadowColor}`;
                    cell.style.borderRadius = "6px";
                    cell.style.transition = "all 0.3s ease";
                } else {
                    cell.style.backgroundColor = "";
                    cell.style.boxShadow = "";
                    cell.style.borderRadius = "";
                }
            });
        }
    }

    document.addEventListener('DOMContentLoaded', highlightApplications);
    const observer = new MutationObserver(highlightApplications);
    observer.observe(document.body, { childList: true, subtree: true });
})();
