// ==UserScript==
// @name         Torn Quick Deposit
// @namespace    http://tampermonkey.net/
// @version      1.2.6
// @description  Quick Deposit cash to Ghost Trade / Company Vault / Faction Vault
// @author       e7cf09 [3441977]
// @icon         https://editor.torn.com/cd385b6f-7625-47bf-88d4-911ee9661b52-3441977.png
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562265/Torn%20Quick%20Deposit.user.js
// @updateURL https://update.greasyfork.org/scripts/562265/Torn%20Quick%20Deposit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CONFIG & STATE
    // USAGE: Set PANIC_THRESHOLD for auto-triggers. Map physical keys in KEYS object.
    // EXAMPLES: Empty: [], Single: ["KeyA"], Multiple: ["ControlLeft", "KeyA"]
    const CONFIG = {
        PANIC_THRESHOLD: 20000000, // Panic Threshold: Only triggers if balance exceeds this
        STRICT_GHOST_MODE: true, // Relaxed matching for Ghost trades (if false, any trade found is used)
        KEYS: {
            FACTION: [],
            GHOST: [],
            COMPANY: [],
            RESET: [],
            PANIC: ["KeyP"],
            EXECUTE: [] // Auto-deposit / Panic Execute
        },
        DEAD_SIGNALS: ["no trade was found", "trade has been accepted", "declined", "cancelled", "locked"]
    };

    const STATE = {
        balance: 0,
        panic: localStorage.getItem('torn_tactical_panic_enabled') !== 'false',
        ghostID: localStorage.getItem('torn_tactical_ghost_id'),
        locks: { panic: false, sending: false, jumping: false, dead: false },
        els: { overlay: null, btn: null }
    };

    // UTILS
    const qs = (s, p=document) => p.querySelector(s);
    const qsa = (s, p=document) => p.querySelectorAll(s);
    const fmt = (n) => "$" + parseInt(n).toLocaleString('en-US');
    const setStyle = (el, css) => Object.assign(el.style, css);

    // NETWORK INTERCEPT
    const intercept = (proto, method, handler) => {
        const orig = proto[method];
        proto[method] = function(...args) {
            handler(this, args);
            return orig.apply(this, args);
        };
    };

    intercept(XMLHttpRequest.prototype, 'open', (xhr, args) => xhr._url = args[1]);
    intercept(XMLHttpRequest.prototype, 'send', (xhr) => {
        xhr.addEventListener('load', () => {
            if (xhr._url?.includes('trade.php')) checkDeadTrade(xhr.responseText, xhr._url);
        });
    });

    const origFetch = window.fetch;
    window.fetch = async (...args) => {
        const res = await origFetch(...args);
        const url = args[0]?.toString() || '';
        if (url.match(/sidebar|user/)) {
            res.clone().json().then(d => updateBalance(d?.user?.money || d?.sidebarData?.user?.money)).catch(()=>{});
        }
        return res;
    };

    // WEBSOCKET INTERCEPT
    const OrigWS = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        const ws = new OrigWS(url, protocols);
        ws.addEventListener('message', e => {
            if (typeof e.data !== 'string') return;
            if (e.data.includes('attack-effects')) triggerPanic();
            const m = e.data.match(/"money"\s*:\s*(\d+)/);
            if (m) updateBalance(m[1]);
        });
        return ws;
    };
    window.WebSocket.prototype = OrigWS.prototype;

    // LOGIC
    function checkDeadTrade(text, url) {
        if (!text || text.length < 20) return;
        if (CONFIG.DEAD_SIGNALS.some(s => text.toLowerCase().includes(s))) {
            let id = null;
            if (url && url.includes('ID=')) {
                const match = url.match(/ID=(\d+)/);
                if (match) id = match[1];
            } else {
                const params = new URLSearchParams(window.location.hash.substring(1) || window.location.search);
                id = params.get('ID');
            }

            if (STATE.ghostID && id === STATE.ghostID) {
                localStorage.removeItem('torn_tactical_ghost_id');
                STATE.ghostID = null;
                injectBtn();
            }
        }
    }

    function getStatus() {
        const icons = qsa('ul[class*="status-icons"] > li');
        if (!icons.length) return { faction: true, ghost: true, company: false, reason: "LOADING" }; // Aggressive default

        let s = { faction: true, ghost: true, company: false, reason: "" };
        let isHosp = false, isTravel = false;

        icons.forEach(li => {
            if (li.className.match(/icon1[56]/)) isHosp = true;
            if (li.className.includes('icon71')) isTravel = true;
            if (li.className.includes('icon73')) s.company = true;
        });

        if (isHosp) { s.faction = s.company = false; s.reason = "HOSP/JAIL"; }
        else if (isTravel) { s.faction = s.ghost = s.company = false; s.reason = "TRAVEL"; }

        // Special check for Faction: Ensure we are in a faction
        const sidebarFaction = qs('a[href^="/factions.php"]');
        if (!sidebarFaction) s.faction = false;

        return s;
    }

    function updateBalance(val) {
        if (!val) return;
        const num = parseInt(typeof val === 'object' ? val.value : val);
        if (isNaN(num)) return;

        STATE.balance = num;
        if (STATE.balance <= 0) {
            STATE.locks.sending = false;
            dismissPanic();
        } else if (STATE.balance >= CONFIG.PANIC_THRESHOLD && STATE.panic) {
            const s = getStatus();
            if (STATE.ghostID ? s.ghost : s.faction) triggerPanic();
        } else if (STATE.locks.panic) {
            dismissPanic();
        }
        if (STATE.locks.panic) updateOverlay();
    }

    function triggerPanic() {
        if (!STATE.panic || STATE.balance < CONFIG.PANIC_THRESHOLD) return;
        const s = getStatus();
        if (s.reason === 'LOADING') return; // Wait for icons to load
        if (!(STATE.ghostID && s.ghost) && !s.company && !s.faction) return;

        STATE.locks.panic = true;
        updateOverlay();
    }

    function dismissPanic() {
        STATE.locks.panic = false;
        STATE.locks.sending = false;
        if (STATE.els.overlay) STATE.els.overlay.style.display = 'none';
    }

    async function executeDeposit(mode = 'auto') {
        // 1. Handle Confirmation Boxes immediately
        const box = Array.from(qsa('.cash-confirm')).find(b => b.offsetParent && b.style.display !== 'none');
        if (box) {
            if (box.querySelector('.yes')) {
                if (STATE.els.overlay) STATE.els.overlay.innerHTML = "DEPOSITING...";
                box.querySelector('.yes').click();
                STATE.locks.sending = false;
                return;
            }
        }

        // Reset sending lock if confirmation box is gone (User clicked No/Cancel)
        if (!box && STATE.locks.sending) {
            // Check if we are stuck in sending state without a box
            // This happens if user clicked No, or closed the modal
            STATE.locks.sending = false;
        }

        if (STATE.locks.sending) return;
        const status = getStatus();

        // Determine Target Mode
        let target = mode;
        if (mode === 'auto') {
            if (STATE.ghostID && status.ghost) target = 'ghost';
            else if (status.company) target = 'company';
            else if (status.faction) target = 'faction';
            else return;
        }

        // Validate Target with strict mode checks
        if (target === 'ghost') {
            // Strict check: Must have Ghost ID AND allow ghost status
            if (!STATE.ghostID || !status.ghost) {
                 if (mode === 'ghost') return; // Explicit request fails
                 // Fallback for auto: Try Company -> Faction
                 target = status.company ? 'company' : (status.faction ? 'faction' : null);
            }
        }
        if (target === 'company' && !status.company) {
            if (mode !== 'auto') return; // Strict fail for manual mode
            target = 'faction';
        }
        if (!target || (target === 'faction' && !status.faction)) return;

        // EXECUTION
        const setVal = (input, val) => {
            input.value = val;
            ['input', 'change', 'blur'].forEach(e => input.dispatchEvent(new Event(e, { bubbles: true })));
        };

        const jump = (url, msg) => {
            if (STATE.locks.jumping) return;
            STATE.locks.jumping = true;
            if (STATE.els.overlay) STATE.els.overlay.innerHTML = msg;
            setTimeout(() => STATE.locks.jumping = false, 1500);
            window.location.href = url;
        };

        if (target === 'ghost') {
            const url = window.location.href;
            // Relaxed check: Just need to be on trade.php and have the correct ID
            // We'll let the element check determine if we are on the "add money" view
            const onPageWithID = url.includes('trade.php') && url.includes(STATE.ghostID);

            // Check if the specific "Add Money" input exists
            const input = qs('.input-money[type="text"]');

            if (!onPageWithID || !input) {
                return jump(`https://www.torn.com/trade.php#step=addmoney&ID=${STATE.ghostID}`, "JUMPING<br>TO GHOST");
            }

            STATE.locks.sending = true;
            if (STATE.els.overlay) STATE.els.overlay.innerHTML = "DEPOSITING<br>TO GHOST";
            setVal(input, input.getAttribute('data-money') || STATE.balance);

            const btn = input.form?.querySelector('input[type="submit"], button[type="submit"]') || qs('input[type="submit"][value="Change"], button[type="submit"][value="Change"]');
            if (btn) {
                btn.disabled = false;
                btn.classList.remove('disabled');
                btn.click();
                STATE.locks.jumping = false;
            } else STATE.locks.sending = false;

        } else if (target === 'company') {
            const url = window.location.href;
            const onPage = url.includes('companies.php') && url.includes('option=funds');

            // Precise selector for Deposit Input (vs Withdraw)
            const input = qs('input[aria-labelledby="deposit-label"][type="text"]');

            if (!input) {
                if (!onPage) return jump(`https://www.torn.com/companies.php?step=your&type=1#/option=funds`, "JUMPING<br>TO COMPANY");
                return;
            }

            STATE.locks.sending = true;
            if (STATE.els.overlay) STATE.els.overlay.innerHTML = "DEPOSITING<br>TO COMPANY";
            setVal(input, input.getAttribute('data-money') || STATE.balance);

            const container = input.closest('.funds-cont');
            const btn = container ? container.querySelector('.deposit.btn-wrap button') : null;

            if (btn) {
                btn.disabled = false;
                btn.click();
            } else STATE.locks.sending = false;

        } else { // Faction
            const form = qs('.give-money-form') || qs('.input-money')?.closest('form');
            const onPage = window.location.href.includes('factions.php') && window.location.href.includes('tab=armoury');

            if (!form) {
                if (!onPage) return jump(`https://www.torn.com/factions.php?step=your&type=1#/tab=armoury`, "JUMPING<br>TO FACTION");
                qs('a[href*="tab=armoury"]')?.click();
                return;
            }

            const input = form.querySelector('.input-money');
            if (!input) return;

            STATE.locks.sending = true;
            if (STATE.els.overlay) STATE.els.overlay.innerHTML = "DEPOSITING<br>TO FACTION";

            let amt = input.getAttribute('data-money');
            if (!amt) {
                const txt = form.querySelector('.i-have')?.innerText.replace(/[$,]/g, '');
                if (txt && !isNaN(txt)) amt = txt;
            }
            setVal(input, amt || STATE.balance);

            const btn = form.querySelector('button.torn-btn');
            if (btn) {
                btn.disabled = false;
                btn.click();
            } else STATE.locks.sending = false;
        }
    }

    // UI COMPONENTS
    function showToast(html) {
        const t = document.createElement('div');
        t.innerHTML = `<div style="font-size:11px;color:#aaa;margin-bottom:4px;text-transform:uppercase;">Quick Deposit</div>${html}`;
        setStyle(t, {
            position: 'fixed', top: '15%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: 2147483647, background: 'rgba(0,0,0,0.85)', color: 'white',
            padding: '12px 24px', borderRadius: '8px', pointerEvents: 'none',
            opacity: 0, transition: 'opacity 0.3s', textAlign: 'center', border: '1px solid #ffffff33'
        });
        document.body.appendChild(t);
        requestAnimationFrame(() => t.style.opacity = '1');
        setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2000);
    }

    function updateOverlay() {
        if (!STATE.locks.panic || STATE.balance <= 0) return dismissPanic();

        if (!STATE.els.overlay) {
            const d = document.createElement('div');
            d.id = 'torn-panic-overlay';
            let css = `position: fixed; z-index: 2147483647; background: rgba(255, 0, 0, 0.9); color: white;
                font-family: 'Arial Black', sans-serif; font-size: 14px; text-align: center;
                padding: 10px 20px; border-radius: 30px; border: 3px solid white;
                box-shadow: 0 0 20px red; cursor: pointer; white-space: nowrap; user-select: none;`;

            // Default to off-screen, will be moved by mousemove
            css += `top: -999px; left: -999px; transform: translate(-50%, -50%);`;

            d.style.cssText = css;
            d.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); executeDeposit('auto'); });
            document.addEventListener('mousemove', e => {
                if (STATE.locks.panic) {
                    d.style.left = e.clientX + 'px';
                    d.style.top = e.clientY + 'px';
                }
            });
            document.body.appendChild(d);
            STATE.els.overlay = d;
        }

        STATE.els.overlay.style.display = 'block';
        if (STATE.locks.sending || STATE.locks.jumping) return;

        // Determine Text
        let txt = "JUMP TO<br>FACTION";
        if (qs('.cash-confirm')) {
            txt = "CONFIRM<br>DEPOSIT";
        } else {
            const s = getStatus();

            if (STATE.ghostID && s.ghost) {
                // Ghost Logic
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const searchParams = new URLSearchParams(window.location.search);
                const currentStep = hashParams.get('step') || searchParams.get('step');
                const currentID = hashParams.get('ID') || searchParams.get('ID');

                const onGhostPage = window.location.href.includes('trade.php') &&
                                    currentStep === 'addmoney' &&
                                    currentID === STATE.ghostID;

                txt = onGhostPage ? `DEPOSIT<br>${fmt(STATE.balance)}<br><span style='font-size:10px'>GHOST</span>` : "JUMP TO<br>GHOST";

            } else if (s.company) {
                // Company Logic
                const onCompanyPage = window.location.href.includes('companies.php') && window.location.href.includes('option=funds');
                const container = qs('.funds-cont');
                // We are "on page" if URL matches AND the funds container is present (meaning loaded)
                // OR if URL matches and we are just waiting for load (to prevent flickering JUMP TO)
                const ready = onCompanyPage && (container || document.readyState === 'loading');

                txt = ready ? `DEPOSIT<br>${fmt(STATE.balance)}<br><span style='font-size:10px'>COMPANY</span>` : "JUMP TO<br>COMPANY";

            } else {
                // Faction Logic
                const current = window.location.href;
                const onFactionPage = current.includes('factions.php') && current.includes('step=your') && current.includes('type=1') && current.includes('tab=armoury');
                const form = qs('.give-money-form');

                // Show DEPOSIT if form exists OR if we are on the correct URL (even if form hasn't loaded yet)
                const ready = form || onFactionPage;

                txt = ready ? `DEPOSIT<br>${fmt(STATE.balance)}` : "JUMP TO<br>FACTION";
            }
        }

        if (STATE.els.overlay.innerHTML !== txt) STATE.els.overlay.innerHTML = txt;
    }

    function injectBtn() {
        const moneyEl = document.getElementById('user-money');
        if (!moneyEl) return;

        if (!STATE.els.btn) {
            const b = document.createElement('a');
            b.id = 'torn-tactical-deposit';
            b.href = '#';
            b.style.marginLeft = '10px';
            b.style.cursor = 'pointer';

            // Hardcoded style to match [use] button in sidebar
            // Based on user feedback: class="use___wM1PI"
            b.className = 'use___wM1PI';

            // Fallback inline styles only if class fails to apply styles
            // We set marginLeft because original element might have margin defined in CSS
            b.style.marginLeft = '10px';

            b.addEventListener('click', (e) => { e.preventDefault(); executeDeposit('auto'); });
            STATE.els.btn = b;
        }

        if (moneyEl.parentNode && moneyEl.nextSibling !== STATE.els.btn) {
            moneyEl.parentNode.insertBefore(STATE.els.btn, moneyEl.nextSibling);
        }

        const s = getStatus();
        let txt, title;
        if (STATE.ghostID) {
            txt = '[ghost]';
            title = `Ghost ID: ${STATE.ghostID}`;
        } else {
            txt = '[deposit]';
            title = s.company ? "Company Vault" : "Faction Vault";
        }

        if (STATE.els.btn.innerText !== txt) STATE.els.btn.innerText = txt;
        if (STATE.els.btn.title !== title) STATE.els.btn.title = title;
    }

    // EVENT LISTENERS
    window.addEventListener('keydown', e => {
        if (!e.isTrusted || e.target.matches('input, textarea') || e.target.isContentEditable) return;
        const k = e.code;

        // Helper to check if key matches any in the list
        const isKey = (type) => CONFIG.KEYS[type] && CONFIG.KEYS[type].includes(k);

        // Prevent default if it's any of our keys
        if (Object.values(CONFIG.KEYS).flat().includes(k)) e.preventDefault();

        if (isKey('FACTION')) executeDeposit('faction');
        if (isKey('GHOST') && STATE.ghostID) executeDeposit('ghost');
        if (isKey('COMPANY')) executeDeposit('company');
        if (isKey('EXECUTE')) executeDeposit('auto');
        if (isKey('RESET')) {
            localStorage.removeItem('torn_tactical_ghost_id');
            STATE.ghostID = null;
            injectBtn();
            showToast("GHOST ID CLEARED");
        }
        if (isKey('PANIC')) {
            STATE.panic = !STATE.panic;
            localStorage.setItem('torn_tactical_panic_enabled', STATE.panic);
            showToast(`PANIC MODE <span style="color:${STATE.panic?'#4dff4d':'#ff4d4d'}">${STATE.panic?'ON':'OFF'}</span>`);
            if (STATE.panic) updateBalance(STATE.balance); // Trigger check
            else dismissPanic();
        }
    });

    window.addEventListener('hashchange', () => {
        if (STATE.locks.jumping && STATE.ghostID && window.location.href.includes(STATE.ghostID)) STATE.locks.jumping = false;
        if (STATE.locks.panic) updateOverlay();
    });

    // INIT
    const scanTrades = () => {
        if (!window.location.href.includes('trade.php')) return;

        // Handle both Hash (Vue/React router) and Search (Legacy) params
        const params = new URLSearchParams(window.location.hash.substring(1) || window.location.search);
        const currentID = params.get('ID');

        // Check for dead signals on page load
        if (qs('.info-msg, .error-msg')?.innerText.match(new RegExp(CONFIG.DEAD_SIGNALS.join('|'), 'i'))) {
            if (STATE.ghostID && currentID === STATE.ghostID) {
                STATE.ghostID = null; localStorage.removeItem('torn_tactical_ghost_id'); injectBtn(); return;
            }
        }

        // Capture from Log (Priority: Check chat logs on Trade View page)
        if (currentID) {
            const logs = qsa('ul.log .msg');
            let isGhost = false;
            
            if (!CONFIG.STRICT_GHOST_MODE) {
                // If not strict, ANY trade we visit is considered valid
                isGhost = true;
            } else {
                isGhost = Array.from(logs).some(msg => {
                    const clone = msg.cloneNode(true);
                    clone.querySelector('a')?.remove(); // Remove username
                    return clone.innerText.toLowerCase().includes('ghost');
                });
            }

            if (isGhost && !STATE.ghostID) {
                STATE.ghostID = currentID;
                localStorage.setItem('torn_tactical_ghost_id', currentID);
                injectBtn();
            }
        }

        // Capture from List (Only if not locked, and only if we are not on a specific trade page)
        if (!currentID && !STATE.ghostID) {
            qsa('ul.trade-list-container > li').forEach(li => {
                // Check content excluding username
                const clone = li.cloneNode(true);
                clone.querySelector('.user.name')?.remove();

                if (!CONFIG.STRICT_GHOST_MODE || clone.innerText.toLowerCase().includes('ghost')) {
                    const mid = li.querySelector('a.btn-wrap')?.href.match(/ID=(\d+)/);
                    if (mid) { STATE.ghostID = mid[1]; localStorage.setItem('torn_tactical_ghost_id', mid[1]); injectBtn(); }
                }
            });
        }
    };

    let init = false;
    const start = () => {
        if (init) return;
        init = true;

        // Initial Balance Check from DOM
        const moneyEl = document.getElementById('user-money');
        if (moneyEl) {
            const val = moneyEl.getAttribute('data-money') || moneyEl.innerText.replace(/[^\d]/g, '');
            if (val) updateBalance(val);
        }

        // Observers
        new MutationObserver((mutations) => {
            let ignore = true;
            for (const m of mutations) {
                if (!m.target.id?.includes('torn-') &&
                    !m.target.closest?.('#torn-tactical-deposit') &&
                    !m.target.closest?.('#torn-panic-overlay')) {
                    ignore = false;
                    break;
                }
            }
            if (ignore) return;

            injectBtn();
            scanTrades();
            // Removed updateBalance(STATE.balance) to prevent loop
        }).observe(document, { childList: true, subtree: true });

        // Early Init
        if (moneyEl) injectBtn();
    };

    if (document.readyState === 'loading') {
        // Fast track
        const early = new MutationObserver(() => {
            if (qs('#user-money')) { injectBtn(); }
            if (document.body) { start(); early.disconnect(); }
        });
        early.observe(document.documentElement, { childList: true, subtree: true });
        document.addEventListener('DOMContentLoaded', start);
    } else start();

})();