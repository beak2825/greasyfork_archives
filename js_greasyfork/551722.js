// ==UserScript==
// @name         Bloomberg Trading Game Bot
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  AutoTrader for bloomberg
// @match        *://www.bloomberg.com/features/2015-stock-chart-trading-game/*
// @grant        none
// @run-at       document-start
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/551722/Bloomberg%20Trading%20Game%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/551722/Bloomberg%20Trading%20Game%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const origAddEvent = EventTarget.prototype.addEventListener;
    let handlers = {
        mousedown: [],
        mouseup: [],
        touchstart: [],
        touchend: []
    };

    EventTarget.prototype.addEventListener = function(type, handler, opts) {
        if (['mousedown', 'mouseup', 'touchstart', 'touchend'].includes(type)) {
            handlers[type].push({ el: this, handler, opts });
        }
        return origAddEvent.call(this, type, handler, opts);
    };

    setTimeout(() => {
        let lvl = null;
        let trading = false;
        let holding = false;
        let bPrice = null;
        let bTime = null;
        let prices = [];
        let trends = [];
        let learning = true;
        let learnStart = null;
        let pattern = null;

        function chkLevel() {
            const t = document.querySelector('.ticker');
            if (t && t.textContent) {
                const nLvl = t.textContent.trim();
                if (nLvl !== lvl && nLvl !== '') {
                    lvl = nLvl;
                    holding = false;
                    bPrice = null;
                    bTime = null;
                    prices = [];
                    trends = [];
                    learning = true;
                    learnStart = Date.now();
                    pattern = null;
                    if (!trading) trading = true;
                }
            }
        }

        setInterval(chkLevel, 500);

        function getCash() {
            const c = document.querySelector('.cash .net.liquid');
            if (c) {
                const txt = c.textContent.replace(/[^0-9.]/g, '');
                return parseFloat(txt) || 500;
            }
            return 500;
        }

        function getPrice() {
            const y = document.querySelector('.y-mark');
            if (y) {
                const t = y.getAttribute('transform');
                const m = t.match(/translate\(([\d.]+),([\d.]+)\)/);
                if (m) return parseFloat(m[2]);
            }
            return getCash();
        }

        function fire(evt) {
            const h = handlers[evt];
            if (h.length === 0) return;

            h.forEach(({ el, handler }) => {
                try {
                    let x = 500, y = 500;
                    if (el && el.getBoundingClientRect) {
                        const r = el.getBoundingClientRect();
                        x = r.left + r.width / 2;
                        y = r.top + r.height / 2;
                    }

                    const fake = {
                        type: evt,
                        target: el,
                        currentTarget: el,
                        clientX: x,
                        clientY: y,
                        button: 0,
                        buttons: 1,
                        preventDefault: () => {},
                        stopPropagation: () => {},
                        isTrusted: true
                    };
                    handler.call(el, fake);
                } catch (e) {}
            });
        }

        function analyze() {
            if (trends.length < 40) return null;

            const f30 = trends.slice(0, 30);
            const n20 = trends.slice(30, 50);

            const e = f30.slice(0, 15).reduce((a, b) => a + b, 0) / 15;
            const m = f30.slice(15, 30).reduce((a, b) => a + b, 0) / 15;
            const l = n20.reduce((a, b) => a + b, 0) / 20;

            let vol = 0;
            for (let i = 1; i < f30.length; i++) {
                vol += Math.abs(f30[i] - f30[i-1]);
            }
            vol = vol / f30.length;

            const et = e - m;
            const mt = m - l;

            let p = {
                type: 'unknown',
                drop: false,
                rise: false,
                vol: vol > 3,
                em: et,
                mm: mt
            };

            if (et < -5 && mt > 3) {
                p.type = 'dip-first';
                p.drop = true;
                p.rise = true;
            } else if (et > 5) {
                p.type = 'rise-first';
                p.drop = false;
                p.rise = true;
            } else if (p.vol) {
                p.type = 'volatile';
            } else {
                p.type = 'steady';
            }
            return p;
        }

        function holdTime() {
            if (!pattern) return 15000;
            switch(pattern.type) {
                case 'dip-first': return 20000;
                case 'rise-first': return 18000;
                case 'volatile': return 12000;
                case 'steady': return 18000;
                default: return 15000;
            }
        }

        function target() {
            if (!pattern) return 50;
            switch(pattern.type) {
                case 'dip-first': return 80;
                case 'rise-first': return 60;
                case 'volatile': return 40;
                case 'steady': return 50;
                default: return 50;
            }
        }

        function trend() {
            if (trends.length < 25) return 'unknown';
            const rec = trends.slice(-25);
            const o = rec.slice(0, 15).reduce((a, b) => a + b, 0) / 15;
            const n = rec.slice(-10).reduce((a, b) => a + b, 0) / 10;
            const d = o - n;
            if (d < -4) return 'downward';
            else if (d > 4) return 'upward';
            return 'sideways';
        }

        function reversal() {
            if (prices.length < 6 || trends.length < 25) return false;
            const rec = prices.slice(-6);
            const t = trend();
            if (t !== 'downward') return false;
            const vr = rec.slice(-3);
            return vr[2] < vr[1] && vr[1] < vr[0];
        }

        function shouldBuy() {
            if (learning) return false;
            if (prices.length < 5 || trends.length < 25) return false;

            const t = trend();
            const rev = reversal();

            if (pattern) {
                if (pattern.type === 'dip-first') {
                    if (rev) return true;
                    return false;
                }
                if (pattern.type === 'rise-first') {
                    if (t === 'upward' || rev) return true;
                }
                if (pattern.type === 'volatile') {
                    const r3 = prices.slice(-3);
                    if (r3[2] < r3[1] && r3[1] < r3[0]) return true;
                }
                if (pattern.type === 'steady') {
                    if (t === 'upward') return true;
                }
            }

            if (t === 'downward' && !rev) return false;

            const r5 = prices.slice(-5);
            let up = 0;
            let tot = 0;
            for (let i = 1; i < r5.length; i++) {
                const mv = r5[i-1] - r5[i];
                tot += mv;
                if (mv > 0) up++;
            }
            return up >= 3 && tot > 2;
        }

        function buy() {
            if (holding) return;
            fire('mousedown');
            fire('touchstart');
            holding = true;
            bPrice = getPrice();
            bTime = Date.now();
        }

        function sell() {
            if (!holding) return;
            fire('mousedown');
            fire('touchstart');
            setTimeout(() => {
                fire('mouseup');
                fire('touchend');
            }, 50);
            holding = false;
            bPrice = null;
            bTime = null;
        }

        function tick() {
            const p = getPrice();
            prices.push(p);
            trends.push(p);
            if (prices.length > 10) prices.shift();
            if (trends.length > 100) trends.shift();

            if (learning && learnStart) {
                const lt = Date.now() - learnStart;
                if (lt >= 4000 && trends.length >= 40) {
                    pattern = analyze();
                    learning = false;
                }
                return;
            }

            const maxHold = holdTime();

            if (holding && bTime && (Date.now() - bTime) >= maxHold) {
                sell();
                return;
            }

            if (holding) {
                const curr = getPrice();
                const chg = bPrice - curr;
                const ht = Date.now() - bTime;
                const profit = curr < bPrice;
                const tgt = target();
                const minHold = maxHold * 0.7;

                if (ht < minHold) {
                    if (!profit && Math.abs(chg) > 100) sell();
                    return;
                }

                if (profit && chg > tgt) {
                    sell();
                } else if (profit && chg > tgt * 0.6 && ht > maxHold * 0.9) {
                    sell();
                } else if (profit && chg > 20 && ht > maxHold * 0.85) {
                    sell();
                } else if (!profit && Math.abs(chg) > 100) {
                    sell();
                }
            } else {
                if (shouldBuy()) buy();
            }
        }

        setTimeout(() => {
            chkLevel();
            learnStart = Date.now();
        }, 2000);
        setInterval(tick, 100);
    }, 3000);
})();