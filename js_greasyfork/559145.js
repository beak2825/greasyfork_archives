// ==UserScript==
// @name         Claude Usage Reticle
// @namespace    https://github.com/KatsuJinCode
// @version      2.0.1
// @description  Visual usage tracker showing time delta and percentage - see if you're OVER or UNDER budget
// @author       KatsuJinCode
// @match        https://claude.ai/*
// @icon         https://claude.ai/favicon.ico
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/KatsuJinCode/claude-usage-reticle
// @supportURL   https://github.com/KatsuJinCode/claude-usage-reticle/issues
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559145/Claude%20Usage%20Reticle.user.js
// @updateURL https://update.greasyfork.org/scripts/559145/Claude%20Usage%20Reticle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.textContent = '.usage-reticle{position:absolute;width:2px;height:100%;background:#3b82f6;box-shadow:0 0 2px rgba(0,0,0,.5);pointer-events:none;z-index:10;top:0}.usage-reticle::after{content:"";position:absolute;left:-3px;bottom:-5px;width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:5px solid #3b82f6}.usage-reticle-label{position:absolute;bottom:-22px;left:50%;transform:translateX(-50%);background:#3b82f6;color:#fff;padding:1px 4px;border-radius:2px;font-size:9px;font-weight:600;white-space:nowrap}.delta-reticle{position:absolute;width:2px;height:100%;box-shadow:0 0 2px rgba(0,0,0,.5);pointer-events:none;z-index:10;top:0}.delta-reticle::before{content:"";position:absolute;left:-3px;top:-5px;width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent}.delta-reticle-label{position:absolute;top:-22px;left:50%;transform:translateX(-50%);padding:1px 4px;border-radius:2px;font-size:9px;font-weight:600;white-space:nowrap;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.9),0 0 4px rgba(0,0,0,0.7),0 0 8px rgba(0,0,0,0.4);border:1px solid #000}.reticle-overlay{position:absolute;height:100%;top:0;pointer-events:none;z-index:4;border-radius:4px}.reticle-glow{position:absolute;height:100%;top:0;pointer-events:none;z-index:3;border-radius:4px}';
    document.head.appendChild(style);

    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    function fmtTime(d, short) {
        var day = days[d.getDay()];
        var h = d.getHours();
        var m = d.getMinutes();
        var ap = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        if (h === 0) h = 12;
        var ts = h + ':' + (m < 10 ? '0' : '') + m + ' ' + ap;
        return short ? ts : day + ' ' + ts;
    }

    function fmtDelta(hrs, pct) {
        var over = hrs >= 0;
        hrs = Math.abs(hrs);
        var d = Math.floor(hrs / 24);
        var h = Math.floor(hrs % 24);
        var m = Math.round((hrs - Math.floor(hrs)) * 60);
        var t = '';
        if (d > 0) t = d + 'd ' + h + 'h';
        else if (h > 0) t = h + 'h' + (m > 0 ? ' ' + m + 'm' : '');
        else t = m + 'm';
        return t + ' ' + (over ? 'OVER' : 'UNDER') + ' (' + Math.abs(Math.round(pct)) + '%)';
    }

    function getColor(pct) {
        var raw = Math.min(Math.abs(pct) / 100 * 2, 1);
        var p = 0.35 + (1 - 0.35) * raw;
        if (pct < 0) {
            var sat = 5 + p * 70;
            var lit = 95 - p * 55;
            return 'hsl(142,' + sat + '%,' + lit + '%)';
        } else {
            var sat = 5 + p * 75;
            var lit = 95 - p * 55;
            return 'hsl(0,' + sat + '%,' + lit + '%)';
        }
    }

    function addReticles() {
        var containers = document.querySelectorAll('div.flex.flex-row.gap-x-8.justify-between.items-center');
        var added = 0;

        containers.forEach(function(c) {
            var p = c.querySelector('p.text-text-400.whitespace-nowrap');
            if (!p) return;
            var t = p.textContent;

            var titleEl = c.querySelector('p.text-text-100');
            var isSession = titleEl && titleEl.textContent.toLowerCase().includes('current session');
            var windowHrs = isSession ? 5 : 168;
            var hrsUntil, reset;

            var m1 = t.match(/in\s+(?:(\d+)\s*hr?)?\s*(?:(\d+)\s*min)?/i);
            if (m1 && (m1[1] || m1[2])) {
                hrsUntil = parseInt(m1[1] || 0) + (parseInt(m1[2] || 0) / 60);
                reset = new Date(Date.now() + hrsUntil * 3600000);
            } else {
                var m2 = t.match(/(sun|mon|tue|wed|thu|fri|sat)\w*\s+(\d+):(\d+)\s*(am|pm)/i);
                if (!m2) return;
                var h = parseInt(m2[2]);
                if (m2[4].toLowerCase() === 'pm' && h !== 12) h += 12;
                if (m2[4].toLowerCase() === 'am' && h === 12) h = 0;
                var di = {sun:0, mon:1, tue:2, wed:3, thu:4, fri:5, sat:6};
                var rd = di[m2[1].toLowerCase().slice(0, 3)];
                var now = new Date();
                reset = new Date();
                reset.setHours(h, parseInt(m2[3]), 0, 0);
                var d = rd - now.getDay();
                if (d < 0) d += 7;
                if (d === 0 && reset <= now) d = 7;
                reset.setDate(now.getDate() + d);
                hrsUntil = (reset - now) / 3600000;
            }

            var nowPos = Math.max(0, Math.min(100, ((windowHrs - hrsUntil) / windowHrs) * 100));

            var bar = c.querySelector('div.bg-bg-000.rounded.border.h-4');
            if (!bar) return;

            var fill = bar.querySelector('div');
            var usagePos = 0;
            if (fill) {
                var w = fill.style.width;
                if (w) usagePos = parseFloat(w);
            }

            var windowStart = new Date(reset.getTime() - windowHrs * 3600000);
            var usageHrs = (usagePos / 100) * windowHrs;
            var usageTime = new Date(windowStart.getTime() + usageHrs * 3600000);
            var usageLbl = fmtTime(usageTime, isSession);

            var diffPct = usagePos - nowPos;
            var diffHrs = (diffPct / 100) * windowHrs;
            var deltaLbl = fmtDelta(diffHrs, diffPct);
            var color = getColor(diffPct);

            var raw = Math.min(Math.abs(diffPct) / 100 * 2, 1);
            var intensity = 0.35 + (1 - 0.35) * raw;

            bar.style.position = 'relative';
            bar.style.overflow = 'visible';

            // Remove old elements
            bar.querySelectorAll('.delta-reticle,.usage-reticle,.reticle-overlay,.reticle-glow').forEach(function(el) {
                el.remove();
            });

            // Add overlay/glow
            if (diffPct > 0) {
                // Over budget - red glow + overlay
                var glow = document.createElement('div');
                glow.className = 'reticle-glow';
                glow.style.left = nowPos + '%';
                glow.style.width = Math.abs(diffPct) + '%';
                glow.style.boxShadow = '0 0 ' + (8 + intensity * 15) + 'px ' + (2 + intensity * 5) + 'px hsla(0,' + (50 + intensity * 30) + '%,' + (50 - intensity * 10) + '%,' + (0.4 + intensity * 0.4) + ')';
                bar.appendChild(glow);

                var ov = document.createElement('div');
                ov.className = 'reticle-overlay';
                ov.style.left = nowPos + '%';
                ov.style.width = Math.abs(diffPct) + '%';
                ov.style.background = 'hsla(0,' + (60 + intensity * 20) + '%,' + (40 - intensity * 10) + '%,' + (0.55 + intensity * 0.25) + ')';
                bar.appendChild(ov);
            } else if (diffPct < 0) {
                // Under budget - green overlay
                var ov = document.createElement('div');
                ov.className = 'reticle-overlay';
                ov.style.left = usagePos + '%';
                ov.style.width = Math.abs(diffPct) + '%';
                ov.style.background = 'hsla(142,' + (40 + intensity * 30) + '%,' + (50 - intensity * 10) + '%,' + (0.4 + intensity * 0.35) + ')';
                bar.appendChild(ov);
            }

            // Delta reticle (at NOW position)
            var dr = document.createElement('div');
            dr.className = 'delta-reticle';
            dr.style.left = nowPos + '%';
            dr.style.background = color;

            var arrowStyle = document.createElement('style');
            arrowStyle.textContent = '.delta-reticle::before{border-top:5px solid ' + color + '}';
            dr.appendChild(arrowStyle);

            var dlbl = document.createElement('div');
            dlbl.className = 'delta-reticle-label';
            dlbl.style.background = color;
            dlbl.textContent = deltaLbl;
            dr.appendChild(dlbl);
            bar.appendChild(dr);

            // Usage reticle (at usage position)
            var ur = document.createElement('div');
            ur.className = 'usage-reticle';
            ur.style.left = usagePos + '%';

            var ulbl = document.createElement('div');
            ulbl.className = 'usage-reticle-label';
            ulbl.textContent = usageLbl;
            ur.appendChild(ulbl);
            bar.appendChild(ur);

            added++;
        });

        return added;
    }

    // Initial attempt
    var count = addReticles();

    // Retry if nothing found (page still loading)
    if (count === 0) {
        var attempts = 0;
        var interval = setInterval(function() {
            attempts++;
            if (addReticles() > 0 || attempts >= 10) {
                clearInterval(interval);
            }
        }, 1000);
    }

    // Auto-refresh every minute to keep positions current
    setInterval(addReticles, 60000);

    // Watch for SPA navigation
    var lastUrl = location.href;
    new MutationObserver(function() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(addReticles, 1000);
        }
    }).observe(document.body, {childList: true, subtree: true});

})();