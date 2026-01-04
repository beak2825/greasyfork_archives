// ==UserScript==
// @name         XenForo – Bewerbungsmarkierungen (No API / Android Compatible) + IP Redirect
// @namespace    https://tampermonkey .net/
// @version      1.18
// @description  Markiert Bewerbungen ohne API – Female, Too Short, ALT + Filter + Auto Select + Redirect IP links to whatismyipaddress.com (API-free, Android compatible)
// @author       You
// @match        https://looksmax.org/approval-queue/*
// @icon         https://www.google.com/s2/favicons?domain=looksmax.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558363/XenForo%20%E2%80%93%20Bewerbungsmarkierungen%20%28No%20API%20%20Android%20Compatible%29%20%2B%20IP%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/558363/XenForo%20%E2%80%93%20Bewerbungsmarkierungen%20%28No%20API%20%20Android%20Compatible%29%20%2B%20IP%20Redirect.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const filters = ["NORMAL", "FEMALE", "TOO SHORT", "ALT ACCOUNT", "VPN"];
    const activeFilters = new Set();
    const messagesMap = new Map();
    window.__highlightMessageMap = messagesMap;

    // -------------------------------
    // FILTER MENU (NO API)
    // -------------------------------
    (function insertDirectFilterMenu() {
        const filterBar = document.querySelector('.block-filterBar');
        if (!filterBar) return;

        const apiStatus = document.createElement('div');
        apiStatus.style.margin = "5px 0";
        apiStatus.style.fontWeight = "bold";
        apiStatus.style.color = "red";
        apiStatus.textContent = "API DISABLED (offline mode)";
        filterBar.parentNode.insertBefore(apiStatus, filterBar);

        const xfFilter = document.createElement('div');
        xfFilter.className = "block-filterBar block-filterBar--standalone";
        xfFilter.innerHTML = `
            <div class="filterBar">
                <ul class="filterBar-filters">
                    <li><span style="font-weight:bold; margin-right:6px;">Custom Filters:</span></li>
                </ul>
            </div>
        `;
        filterBar.parentNode.insertBefore(xfFilter, filterBar);

        const menuBody = xfFilter.querySelector('.filterBar-filters');

        filters.forEach(f => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = "#";
            a.dataset.tag = f;
            a.textContent = `${f} (0)`;
            a.className = "filterBar-filterToggle";

            a.onclick = e => {
                e.preventDefault();
                activeFilters.has(f) ? activeFilters.delete(f) : activeFilters.add(f);
                a.style.fontWeight = activeFilters.has(f) ? "bold" : "normal";
                updateFilterDisplay();
            };

            li.appendChild(a);
            menuBody.appendChild(li);
        });

        const liAuto = document.createElement('li');
        const aAuto = document.createElement('a');
        aAuto.href = "#";
        aAuto.textContent = "Auto Select";
        aAuto.onclick = e => {
            e.preventDefault();
            messagesMap.forEach((labels, message) => {
                if (labels.includes("FEMALE") || labels.includes("TOO SHORT")) {
                    const reject = message.querySelector('input[type="radio"][value="reject"]');
                    if (reject) {
                        reject.checked = true;
                        reject.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            });
        };
        liAuto.appendChild(aAuto);
        menuBody.appendChild(liAuto);

        function updateFilterCounts() {
            filters.forEach(f => {
                const count = [...messagesMap.values()].filter(l => l.includes(f)).length;
                const btn = menuBody.querySelector(`a[data-tag="${f}"]`);
                if (btn) btn.textContent = `${f} (${count})`;
            });
        }

        function updateFilterDisplay() {
            messagesMap.forEach((labels, msg) => {
                if (activeFilters.size === 0) {
                    msg.style.display = "";
                    return;
                }
                let show = labels.some(l => activeFilters.has(l));
                if (activeFilters.has("NORMAL") && labels.includes("NORMAL")) show = true;
                msg.style.display = show ? "" : "none";
            });
            updateFilterCounts();
        }
    })();


    // -------------------------------
    // VPN CHECK — DISABLED
    // -------------------------------
    function checkVPN() {
        return false;
    }

    // -------------------------------
    // HIGHLIGHT + LABELING + IP REDIRECT
    // -------------------------------
    async function highlightApplications() {
        const messages = document.querySelectorAll('.message');

        for (const message of messages) {
            let labels = [];
            let highlightColor = null;
            let boxShadowColor = null;

            const genderField = message.querySelector('dl[data-field="male_female"] dd');
            const reasonField = message.querySelector('dl[data-field="why_join"] dd');
            const dataCells = message.querySelectorAll('.dataList-cell');

            let isFemale = false;
            let isTooShort = false;
            let isAlt = false;

            // FEMALE
            if (genderField && genderField.textContent.trim().toLowerCase() === "female") {
                isFemale = true;
                labels.push("FEMALE");
            }

            // TOO SHORT
            if (reasonField) {
                const wc = reasonField.textContent.trim().split(/\s+/).filter(Boolean).length;
                if (wc < 5) {
                    isTooShort = true;
                    labels.push("TOO SHORT");
                }
            }

            // ALT ACCOUNT
            dataCells.forEach(c => {
                if (/Moderating|Multiple account|Rejected user/i.test(c.textContent)) {
                    isAlt = true;
                    labels.push("ALT ACCOUNT");
                }
            });

            // -------------------------------
            // NEW: Redirect IP to whatismyipaddress.com
            // -------------------------------
            const listPlain = message.querySelector('ul.listPlain');
            if (listPlain) {
                const firstLink = listPlain.querySelector('li a[href]');
                if (firstLink) {
                    const ipText = firstLink.textContent.trim();
                    const match = ipText.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$|^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/);
                    if (match) {
                        firstLink.href = `https://whatismyipaddress.com/ip/${ipText}`;
                        firstLink.target = "_blank";
                    }
                }
            }

            if (labels.length === 0) labels.push("NORMAL");
            messagesMap.set(message, labels);

            if (isFemale) {
                highlightColor = "rgba(255,182,193,0.2)";
                boxShadowColor = "rgba(255,105,180,0.25)";
            } else if (isTooShort) {
                highlightColor = "rgba(255,99,71,0.15)";
                boxShadowColor = "rgba(255,69,0,0.2)";
            } else if (isAlt) {
                highlightColor = "rgba(255,255,102,0.15)";
                boxShadowColor = "rgba(255,255,0,0.2)";
            }

            const cells = message.querySelectorAll('.message-cell');
            cells.forEach(cell => {
                cell.style.backgroundColor = highlightColor || "";
                cell.style.boxShadow = highlightColor ? `0 0 8px 2px ${boxShadowColor}` : "";
                cell.style.borderRadius = highlightColor ? "6px" : "";
            });

            message.style.margin = highlightColor ? "8px 0" : "";
            message.style.borderRadius = highlightColor ? "8px" : "";
        }
    }

    document.addEventListener('DOMContentLoaded', highlightApplications);
    new MutationObserver(highlightApplications).observe(document.body, { childList: true, subtree: true });

})();
