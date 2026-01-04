// ==UserScript==
// @name         Huawei Router Readable Status
// @namespace    Huawei HG6145D2 WKE2.094.443A01
// @version      5.0
// @description  Formatting traffic numbers into measurable units, adding thousands separators to packets, and click-to-copy IP/MAC features on the Huawei router interface.
// @author       MochAdiMR
// @match        *://192.168.1.1/html/*
// @exclude      *://192.168.1.1/html/login_inter.html
// @icon         https://i.imgur.com/OsLkmXp.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557149/Huawei%20Router%20Readable%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/557149/Huawei%20Router%20Readable%20Status.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const style = document.createElement("style");

    style.innerHTML = `
        .script-clickable {
            cursor: pointer !important;
            transition: color 0.2s;
            position: relative;
        }
        .script-clickable:hover {
            color: #007bff !important;
            text-decoration: underline;
        }
        .script-clickable:active {
            color: #0056b3 !important;
        }
        .script-tooltip {
            position: absolute;
            background: #333;
            color: #fff;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .script-tooltip.show {
            opacity: 1;
        }
    `;

    document.head.appendChild(style);

    const CONFIG = {
        scanInterval: 1000,

        singleElements: [
            { id: "Connection_Uptime", type: "wan_uptime" },
            { id: "receive_byte", type: "byte" },
            { id: "send_byte", type: "byte" },
            { id: "receive_packet", type: "packet" },
            { id: "send_packet", type: "packet" },
            { id: "receive_wrong_packet", type: "packet" },
            { id: "receive_drop_packet", type: "packet" },
            { id: "send_wrong_packet", type: "packet" },
            { id: "send_drop_packet", type: "packet" },
        ],

        tables: [
            {
                id: "user_list",
                isValid: (doc) => doc.getElementById("td_hiredTime") !== null,
                columns: {
                    2: { type: "mac", clickable: true },
                    3: { type: "ip", clickable: true },
                    4: { type: "dhcp_time", bold: true },
                },
            },

            {
                id: "user_list",
                isValid: (doc) => doc.getElementById("wifi_2G_inter") !== null,
                columns: {
                    3: { type: "mac", clickable: true },
                    4: { type: "ip", clickable: true, bold: false },
                },
            },

            {
                id: "user_5glist",
                isValid: (doc) => true,
                columns: {
                    3: { type: "mac", clickable: true },
                    4: { type: "ip", clickable: true },
                },
            },

            {
                id: "lanInfo_list",
                isValid: (doc) => true,
                columns: {
                    4: { type: "byte", bold: true },
                    5: { type: "packet", bold: false },
                    6: { type: "byte", bold: true },
                    7: { type: "packet", bold: false },
                },
            },
        ],
    };

    const TimeConst = { DAY: 86400, HOUR: 3600, MINUTE: 60 };

    const Parsers = {
        routerTimeToSeconds: (str) => {
            if (!str) return 0;
            let total = 0;
            const regex = { d: /(\d+)\s*d/i, h: /(\d+)\s*h/i, m: /(\d+)\s*m/i, s: /(\d+)\s*s/i };

            for (const [unit, reg] of Object.entries(regex)) {
                const match = str.match(reg);

                if (match) {
                    const val = parseInt(match[1], 10);
                    if (unit === "d") total += val * TimeConst.DAY;
                    if (unit === "h") total += val * TimeConst.HOUR;
                    if (unit === "m") total += val * TimeConst.MINUTE;
                    if (unit === "s") total += val;
                }
            }
            return total;
        },
        secondsToComponents: (seconds) => {
            seconds = parseInt(seconds, 10);
            if (isNaN(seconds)) return { d: 0, h: 0, m: 0, s: 0 };
            return {
                d: Math.floor(seconds / TimeConst.DAY),
                h: Math.floor((seconds % TimeConst.DAY) / TimeConst.HOUR),
                m: Math.floor((seconds % TimeConst.HOUR) / TimeConst.MINUTE),
                s: Math.floor(seconds % TimeConst.MINUTE),
            };
        },

        removeDots: (str) => str.toString().replace(/\./g, ""),
    };

    const Utils = {
        copyText: (text, element) => {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(() => Utils.showTooltip(element));
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    document.execCommand("copy");
                    Utils.showTooltip(element);
                } catch (err) {
                    console.error("Copy failed", err);
                }

                document.body.removeChild(textArea);
            }
        },

        showTooltip: (element) => {
            let tooltip = element.querySelector(".script-tooltip");

            if (!tooltip) {
                tooltip = document.createElement("span");
                tooltip.className = "script-tooltip";
                tooltip.innerText = "Copied!";
                element.appendChild(tooltip);
            }

            requestAnimationFrame(() => tooltip.classList.add("show"));

            setTimeout(() => {
                tooltip.classList.remove("show");
                setTimeout(() => {
                    if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
                }, 300);
            }, 1000);
        },
    };

    const Formatters = {
        byte: (val) => {
            const bytes = parseFloat(val);
            if (bytes === 0) return "0 Bytes";
            if (!bytes || isNaN(bytes)) return "-";
            const k = 1024;
            const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
        },
        packet: (val) => {
            const num = Parsers.removeDots(val);
            if (isNaN(num)) return val;
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        timeFull: (seconds) => {
            const t = Parsers.secondsToComponents(seconds);
            return `${t.d} d ${t.h} h ${t.m} m ${t.s} s`;
        },
        timeCompact: (seconds) => {
            const t = Parsers.secondsToComponents(seconds);
            return t.d > 0 ? `${t.d} d ${t.h} h ${t.m} m ${t.s} s` : `${t.h} h ${t.m} m ${t.s} s`;
        },
    };

    const DOMProcessor = {
        isAttached: (el) => el.getAttribute("data-obs-attached") === "true",
        markAttached: (el) => el.setAttribute("data-obs-attached", "true"),

        applyFormat: (element, type) => {
            const text = element.innerText;
            let formatted = null;
            let shouldApply = false;

            try {
                if (type === "byte" && /^\d+$/.test(text)) {
                    element.title = `${text} (Raw)`;
                    formatted = Formatters.byte(text);
                    element.style.fontWeight = "bold";
                    shouldApply = true;
                } else if (type === "packet" && /^\d+$/.test(text)) {
                    element.title = `${text} (Raw)`;
                    formatted = Formatters.packet(text);
                    shouldApply = true;
                } else if (type === "wan_uptime" && !/^\d+\sd\s\d+\sh/.test(text)) {
                    const seconds = Parsers.routerTimeToSeconds(text);
                    if (seconds === 0 && !text.includes("0") && !text.toLowerCase().includes("s")) return;
                    const newTime = Formatters.timeFull(seconds);
                    if (newTime !== text) {
                        element.title = text;
                        formatted = newTime;
                        element.style.color = "black";
                        element.style.fontWeight = "bold";
                        shouldApply = true;
                    }
                } else if (type === "dhcp_time" && /^\d+$/.test(text)) {
                    element.title = `${text} seconds`;
                    formatted = Formatters.timeCompact(text);
                    shouldApply = true;
                }

                if (shouldApply && formatted) element.innerText = formatted;
            } catch (e) {}
        },

        setupClickable: (cell) => {
            if (cell.getAttribute("data-click-setup") === "true") return;
            cell.setAttribute("data-click-setup", "true");
            cell.classList.add("script-clickable");
            cell.title = "Click to copy";

            cell.addEventListener("click", (e) => {
                e.stopPropagation();

                Utils.copyText(cell.innerText, cell);
            });
        },

        processRow: (row, columnConfig) => {
            const cells = row.getElementsByTagName("td");

            for (const [colIndex, config] of Object.entries(columnConfig)) {
                if (cells.length > colIndex) {
                    const cell = cells[colIndex];

                    if (config.clickable) {
                        DOMProcessor.setupClickable(cell);
                    }

                    if (config.type && config.type !== "mac" && config.type !== "ip") {
                        DOMProcessor.applyFormat(cell, config.type);
                    }

                    if (config.bold === true) {
                        cell.style.fontWeight = "bold";
                    } else if (config.bold === false) {
                        cell.style.fontWeight = "normal";
                    }
                }
            }
        },
    };

    const ObserverManager = {
        observeElement: (element, type) => {
            if (DOMProcessor.isAttached(element)) return;
            DOMProcessor.markAttached(element);
            DOMProcessor.applyFormat(element, type);

            const observer = new MutationObserver(() => {
                observer.disconnect();
                DOMProcessor.applyFormat(element, type);
                observer.observe(element, { childList: true, characterData: true, subtree: true });
            });

            observer.observe(element, { childList: true, characterData: true, subtree: true });
        },

        observeTable: (tbody, columnConfig) => {
            if (DOMProcessor.isAttached(tbody)) return;
            DOMProcessor.markAttached(tbody);
            const rows = tbody.getElementsByTagName("tr");
            Array.from(rows).forEach((row) => DOMProcessor.processRow(row, columnConfig));

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeName === "TR") DOMProcessor.processRow(node, columnConfig);
                        });
                    }
                });
            });

            observer.observe(tbody, { childList: true });
        },
    };

    function scanDocument(doc) {
        if (!doc) return;

        CONFIG.singleElements.forEach((item) => {
            const el = doc.getElementById(item.id);
            if (el) ObserverManager.observeElement(el, item.type);
        });

        CONFIG.tables.forEach((table) => {
            const tbody = doc.getElementById(table.id);

            if (tbody) {
                if (table.isValid(doc)) {
                    ObserverManager.observeTable(tbody, table.columns);
                }
            }
        });
    }

    function init() {
        setInterval(() => {
            scanDocument(document);
            const iframe = document.querySelector("iframe.main_iframe");

            if (iframe) {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    scanDocument(iframeDoc);
                } catch (e) {}
            }
        }, CONFIG.scanInterval);
    }

    init();
})();