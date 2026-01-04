// ==UserScript==
// @name         ZTE Router Readable Status
// @namespace    ZTE F672Y V9.1.10P4N3
// @version      5.0
// @description  The complete dashboard makeover: WAN/LAN Stats, Speedometer, Colors, Formatting, & Copy-Paste.
// @author       MochAdiMR
// @match        *://192.168.1.1/html/*
// @icon         https://1000logos.net/wp-content/uploads/2018/09/ZTE-Logo-1985.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557141/ZTE%20Router%20Readable%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/557141/ZTE%20Router%20Readable%20Status.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const THEME = {
        colors: {
            primary: '#2980b9',
            success: '#27ae60',
            warning: '#f39c12',
            danger:  '#e74c3c',
            neutral: '#95a5a6',
            accent:  '#8e44ad',
            speed:   '#e67e22'
        }
    };

    const CONFIG = {
        pages: [
            {
                id: 'wan_status',
                check: (url) => url.includes('ethWanStatus') || url.includes('Internet-Status-WAN.php'),

                rules: [
                    { selectorPrefix: 'cUpTime:', formatter: 'duration', style: 'primary' },
                    { selectorPrefix: 'cWorkIFMac', action: 'copy' }
                ]
            },
            {
                id: 'lan_status',
                check: (url) => url.includes('localNetStatus') || url.includes('Local-Network-Status.php'),

                rules: [
                    { selectorPrefix: 'InBytes', formatter: 'bytes', calcSpeed: true, layout: 'lan' },
                    { selectorPrefix: 'TotalBytesCount', formatter: 'bytes', calcSpeed: true, layout: 'wlan' },
                    { selectorPrefix: 'InPkts', formatter: 'packets' },
                    { selectorPrefix: 'TotalPacketsCount', formatter: 'packets' },
                    { selectorPrefix: 'InUnicast', formatter: 'packets' },
                    { selectorPrefix: 'InMulticast', formatter: 'packets' },
                    { selectorPrefix: 'RSSI', formatter: 'rssi' },
                    { selectorPrefix: 'NOISE', formatter: 'rssi' },
                    { selectorPrefix: 'TxRate', formatter: 'rate' },
                    { selectorPrefix: 'RxRate', formatter: 'rate' },
                    { selectorPrefix: 'IPAddress', action: 'copy' },
                    { selectorPrefix: 'MACAddress', action: 'copy' },
                    { selectorPrefix: 'Bssid', action: 'copy' },
                    { selectorPrefix: 'Gua1', action: 'copy' },
                    { selectorPrefix: 'cIPAddress', action: 'copy' },
                    { selectorPrefix: 'IPV6Address', action: 'copy' }
                ]
            }
        ]
    };

    const Utils = {
        toTime: (text) => {
            const match = text.match(/(\d+)\s*h\s*(\d+)\s*min\s*(\d+)\s*s/i);
            if (!match) return text;
            const h = parseInt(match[1]), m = match[2], s = match[3];
            if (h < 24) return text;
            return `${Math.floor(h / 24)}d ${h % 24}h ${m}m ${s}s`;
        },
        toBytes: (bytes) => {
            if (bytes === 0) return '0 B';
            const k = 1024, sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        toPackets: (packets) => {
            if (packets >= 1e9) return (packets / 1e9).toFixed(2) + ' B';
            if (packets >= 1e6) return (packets / 1e6).toFixed(2) + ' M';
            if (packets >= 1e3) return (packets / 1e3).toFixed(2) + ' k';
            return packets.toString();
        },
        toRate: (kbps) => {
            const val = parseInt(kbps);
            return isNaN(val) ? kbps : (val / 1000).toFixed(0) + ' Mbps';
        },
        toRSSI: (rssi) => {
            const val = parseInt(rssi);
            if (isNaN(val)) return rssi;
            let cls = 'signal-bad', label = 'Poor';
            if (val > -60) { cls = 'signal-excellent'; label = 'Excellent'; }
            else if (val > -75) { cls = 'signal-good'; label = 'Good'; }
            else if (val > -85) { cls = 'signal-weak'; label = 'Weak'; }
            return `<span class="${cls}">${val} dBm <small>(${label})</small></span>`;
        }
    };

    const SpeedometerState = {};

    function getSpeed(id, currentRx, currentTx) {
        const now = Date.now();
        const prev = SpeedometerState[id];

        if (prev) {
            const diff = (now - prev.time) / 1000;
            if (diff > 0.5) {
                const rx = Math.max(0, currentRx - prev.rx) / diff;
                const tx = Math.max(0, currentTx - prev.tx) / diff;
                const result = { rxStr: Utils.toBytes(rx) + '/s', txStr: Utils.toBytes(tx) + '/s' };
                SpeedometerState[id] = { rx: currentRx, tx: currentTx, time: now, cache: result };
                return result;
            }

            return prev.cache;
        }

        SpeedometerState[id] = { rx: currentRx, tx: currentTx, time: now, cache: { rxStr: '...', txStr: '...' } };
        return SpeedometerState[id].cache;
    }

    function injectStyles() {
        const css = `
            .zte-mod-primary { color: ${THEME.colors.primary} !important; font-weight: bold; }
            .zte-mod-rate { color: ${THEME.colors.accent} !important; }
            .zte-mod-copy { cursor: copy; }
            .zte-mod-copy:active { color: ${THEME.colors.success} !important; }
            .status-good { color: ${THEME.colors.success} !important; font-weight: bold; }
            .status-warn { color: ${THEME.colors.warning} !important; font-weight: bold; }
            .status-bad { color: ${THEME.colors.neutral} !important; font-weight: bold; }
            .status-error { color: ${THEME.colors.danger} !important; font-weight: bold; }
            .signal-excellent { color: ${THEME.colors.success}; font-weight: bold; }
            .signal-good { color: ${THEME.colors.warning}; font-weight: bold; }
            .signal-weak { color: ${THEME.colors.speed}; font-weight: bold; }
            .signal-bad { color: ${THEME.colors.danger}; font-weight: bold; }
            .speed-val { font-weight: bold; color: ${THEME.colors.speed}; }
            .speed-spacer-1 { display: inline-block; width: 130px; }
            .speed-spacer-2 { display: inline-block; width: 180px; }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function fixZebraStriping(container) {
        if (!container) return;
        Array.from(container.children)
             .filter(el => el.classList.contains('colorTblRow'))
             .forEach((row, idx) => {
                 row.classList.toggle('colorRow', idx % 2 === 0);
             });
    }

    function updateSpeedRow(targetEl, rx, tx, layout) {
        const bytesRow = targetEl.parentNode;
        const container = bytesRow.parentNode;
        const suffix = targetEl.id.split(':')[1];
        const rowId = `SpeedRow_${layout}_${suffix}`;
        const valId = `SpeedVal_${layout}_${suffix}`;
        let speedRow = document.getElementById(rowId);

        if (!speedRow) {
            speedRow = document.createElement('div');
            speedRow.id = rowId;
            speedRow.className = 'colorTblRow';

            if (layout === 'lan') {
                speedRow.innerHTML = `
                    <span class="w330 emFont" title="Speed">Speed</span>
                    <span class="w250 speed-val" id="${valId}" title="Download / Upload">... / ...</span>
                `;
            }

            else if (layout === 'wlan') {
                speedRow.innerHTML = `
                    <span class="w130"></span>
                    <span class="w180"></span>
                    <span class="w200 emFont" title="Speed">Speed</span>
                    <span class="w150 speed-val" id="${valId}" title="Download / Upload">... / ...</span>
                `;
            }

            if (bytesRow.nextSibling) container.insertBefore(speedRow, bytesRow.nextSibling);
            else container.appendChild(speedRow);
            fixZebraStriping(container);
        }

        const valSpan = document.getElementById(valId);
        if (valSpan) valSpan.innerText = `${rx} / ${tx}`;
    }

    function applyStatusColor() {
        const keywords = {
            good: ['connected', 'up', 'on', 'full duplex'],
            warn: ['connecting'],
            bad: ['nolink', 'disconnected', 'off', 'down', 'none', 'error_none']
        };

        const selectors = ['span[id^="Status"]', 'span[id^="cConnStatus"]', 'span[id^="RealRF"]', 'span[id^="Enable"]', 'span[id^="cIsNAT"]', 'span[id^="cConnError"]'];

        document.querySelectorAll(selectors.join(',')).forEach(el => {
            const text = el.innerText.toLowerCase().trim();
            el.classList.remove('status-good', 'status-warn', 'status-bad', 'status-error');
            if (keywords.good.some(k => text.includes(k))) el.classList.add('status-good');
            else if (keywords.warn.some(k => text.includes(k))) el.classList.add('status-warn');
            else if (keywords.bad.some(k => text.includes(k))) el.classList.add('status-bad');
        });

        ['InError', 'InDiscard', 'TxErrors', 'RxErrors'].forEach(prefix => {
            document.querySelectorAll(`span[id^="${prefix}"]`).forEach(el => {
                el.classList.remove('status-error');
                if (/[1-9]/.test(el.innerText)) el.classList.add('status-error');
            });
        });
    }

    function processPage() {
        const url = window.location.href;
        const pageConfig = CONFIG.pages.find(p => p.check(url));
        applyStatusColor();
        if (!pageConfig) return;

        pageConfig.rules.forEach(rule => {
            const elements = document.querySelectorAll(`span[id^="${rule.selectorPrefix}"]`);
            elements.forEach(el => {
                if (rule.action === 'copy') {
                    if (!el.dataset.copier) {
                        el.dataset.copier = "true";
                        el.classList.add('zte-mod-copy');
                        el.title = "Click to Copy";
                        el.addEventListener('click', () => navigator.clipboard.writeText(el.innerText));
                    }

                    return;
                }

                let rawText = el.innerText;
                if (rawText.includes('/')) {
                    const isFormatted = /[a-zA-Z]/.test(rawText);
                    if (!isFormatted) {
                        const parts = rawText.split('/');
                        const val1 = parseFloat(parts[0].replace(/,/g, ''));
                        const val2 = parseFloat(parts[1].replace(/,/g, ''));

                        if (!isNaN(val1) && !isNaN(val2)) {
                            let fmt1 = val1, fmt2 = val2;
                            if (rule.formatter === 'bytes') {
                                fmt1 = Utils.toBytes(val1);
                                fmt2 = Utils.toBytes(val2);
                            } else if (rule.formatter === 'packets') {
                                fmt1 = Utils.toPackets(val1);
                                fmt2 = Utils.toPackets(val2);
                            }

                            el.innerText = `${fmt1} / ${fmt2}`;
                            el.setAttribute('title', `Raw: ${rawText}`);
                            el.dataset.original = rawText;
                            el.classList.add('zte-mod-primary');

                            if (rule.calcSpeed) {
                                const speed = getSpeed(el.id, val1, val2);
                                updateSpeedRow(el, speed.rxStr, speed.txStr, rule.layout);
                            }
                        }
                    }
                } else {
                    if (rule.formatter === 'duration' && !rawText.includes('d')) {
                        const fmt = Utils.toTime(rawText);

                        if (fmt !== rawText) {
                            el.innerText = fmt;
                            el.title = `Raw: ${rawText}`;
                            if (rule.style) el.classList.add(`zte-mod-${rule.style}`);
                        }
                    } else if (rule.formatter === 'rate' && !rawText.includes('Mbps')) {
                        el.innerText = Utils.toRate(rawText);
                        el.classList.add('zte-mod-rate');
                    } else if (rule.formatter === 'rssi' && !rawText.includes('dBm')) {
                        el.innerHTML = Utils.toRSSI(rawText);
                    }
                }
            });
        });
    }

    injectStyles();

    let timeout;
    const observer = new MutationObserver(() => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(processPage, 100);
    });

    const targetNode = document.getElementById('page_content') || document.body;
    observer.observe(targetNode, { childList: true, subtree: true, characterData: true });

    processPage();

})();