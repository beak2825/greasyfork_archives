// ==UserScript==
// @name         Grupowanie z całej mapy (Android)
// @version      1.0
// @description  Dodaje klanowiczów i przyjaciół z całej mapy do grupy. Wersja bez komunikatów.
// @author       NSP
// @match        https://*.margonem.pl/*
// @match        http://*.margonem.pl/*
// @match        https://*.margonem.com/*
// @match        http://*.margonem.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1539516
// @downloadURL https://update.greasyfork.org/scripts/556322/Grupowanie%20z%20ca%C5%82ej%20mapy%20%28Android%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556322/Grupowanie%20z%20ca%C5%82ej%20mapy%20%28Android%29.meta.js
// ==/UserScript==
 
(function() {
 
    // ---------- FILTR WIADOMOŚCI (DOPASOWANIA) ----------
    const FILTER_PATTERNS = [
        /wysłano zaproszenie(?: do grupy)?/i,
        /zaproszenie(?: do grupy)? wysłane/i,
        /wysłano zaproszenie .* grup(?:y|ę|ie)/i,
        /wysłano zaproszenie na grup[ęy]/i,
        /wysłano zaproszenie do drużyny/i,
        /\b(zaprosz(?:enie|ono|ano|ono))\b/i,
        /invitation sent(?: to group)?/i,
        /invite(?:\s).*sent/i,
        /\b(invite(?:d|n|tion)?)\b/i,
        /\b(jest\s+zaj[eę]ty)\b/i,
        /\b(gracz\s+jest\s+zaj[eę]ty)\b/i,
        /\bzaj[eę]ty\b/i,
        /\bobsług[aą]?\b.*\bzaj[eę]ty\b/i,
        /\bizaj[eę]ty\b/i,
        /\bis\s+busy\b/i,
        /\bplayer\s+is\s+busy\b/i,
        /\bis\s+currently\s+busy\b/i,
        /\bbusy\s+right\s+now\b/i,
        /\bbusy\b/i,
        /\bten\s+gracz\s+jest\s+ju[żz]\s+członkiem(?:\s+(twojej|waszej))?\s+(?:drużyny|grupy|party)\b/i,
        /\b(gracz|ta\s+postać)\s+ju[żz]\s+jest\s+(członkiem|w)\s+(twojej|waszej)?\s*(?:drużyny|grupy|party)\b/i,
        /\bju[żz]\s+jest\s+w\s+(?:twojej|waszej)?\s*(?:drużynie|grupie|party)\b/i,
        /\bthis\s+player\s+is\s+already\s+(?:a\s+)?member\s+(?:of\s+)?(?:your\s+)?(?:party|group)\b/i,
        /\balready\s+in\s+(?:your\s+)?(?:party|group)\b/i,
        /\balready\s+a\s+member\s+of\s+(?:your\s+)?(?:party|group)\b/i
    ];
 
    function matchesFilter(text) {
        if (!text) return false;
        try {
            text = String(text).trim();
        } catch(e) {
            return false;
        }
        return FILTER_PATTERNS.some(re => re.test(text));
    }
 
    // ---------- PRZYCISK ----------
    const BTN_ID = "dod_btn_plus";
    const SAVE_KEY = "dod_btn_pos";
 
    function createButton() {
        if (document.getElementById(BTN_ID)) return;
 
        const btn = document.createElement("div");
        btn.id = BTN_ID;
        btn.textContent = "+";
        btn.style.cssText = `
            position: fixed;
            z-index: 999999;
            width: 42px;
            height: 42px;
            background: #00c94a;
            color: white;
            font-size: 32px;
            font-weight: bold;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            user-select: none;
            cursor: pointer;
        `;
 
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
            try {
                const p = JSON.parse(saved);
                btn.style.left = p.x + "px";
                btn.style.top = p.y + "px";
            } catch(e) {
                btn.style.right = "20px";
                btn.style.bottom = "100px";
            }
        } else {
            btn.style.right = "20px";
            btn.style.bottom = "100px";
        }
 
        document.body.appendChild(btn);
        btn.addEventListener("click", () => tryAddToGroup());
        enableDrag(btn);
    }
 
    // ---------- DRAG ----------
    function enableDrag(el) {
        let offsetX = 0, offsetY = 0;
        let dragging = false;
 
        const start = e => {
            dragging = true;
            const rect = el.getBoundingClientRect();
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            const cy = e.touches ? e.touches[0].clientY : e.clientY;
            offsetX = cx - rect.left;
            offsetY = cy - rect.top;
 
            el.style.right = "auto";
            el.style.bottom = "auto";
        };
 
        const move = e => {
            if (!dragging) return;
            e.preventDefault();
            const cx = e.touches ? e.touches[0].clientX : e.clientX;
            const cy = e.touches ? e.touches[0].clientY : e.clientY;
            el.style.left = (cx - offsetX) + "px";
            el.style.top = (cy - offsetY) + "px";
        };
 
        const stop = () => {
            if (!dragging) return;
            dragging = false;
            const rect = el.getBoundingClientRect();
            localStorage.setItem(SAVE_KEY, JSON.stringify({ x: rect.left, y: rect.top }));
        };
 
        el.addEventListener("mousedown", start);
        el.addEventListener("touchstart", start);
 
        window.addEventListener("mousemove", move);
        window.addEventListener("touchmove", move, { passive: false });
 
        window.addEventListener("mouseup", stop);
        window.addEventListener("touchend", stop);
    }
 
    // ---------- LOGIKA DODAWANIA (przyspieszona) ----------
    function tryAddToGroup() {
        if (!window.Engine || !Engine.others) return;
 
        const list = Engine.others.getDrawableList();
        const idsToInvite = [];
 
        for (const o of list) {
            if (!o.isPlayer) continue;
 
            const rel = o.d.relation;
            const isFriend = [2,4,5].includes(rel);
            const isClanMate = rel === 3;
 
            if ((isFriend || isClanMate) && !isInParty(o.d.id)) {
                idsToInvite.push(o.d.id);
            }
        }
 
        // Wysyłamy wszystkie zaproszenia równolegle
        if (idsToInvite.length > 0) {
            idsToInvite.forEach(id => _g(`party&a=inv&id=${id}`));
        }
    }
 
    function isInParty(id) {
        if (!Engine.party) return false;
        return Object.keys(Engine.party.getMembers()).includes(String(id));
    }
 
    // ---------- FILTR WIADOMOŚCI: TYLKO DOM OBSERVER ----------
    function setupDOMObserver() {
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (!node) continue;
 
                    let text = "";
                    try {
                        if (node.nodeType === Node.TEXT_NODE)
                            text = node.textContent;
                        else if (node.nodeType === Node.ELEMENT_NODE)
                            text = node.innerText || node.textContent || "";
                    } catch(e) {}
 
                    if (matchesFilter(text)) {
                        try { node.remove(); } catch(e) {}
                        continue;
                    }
 
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        try {
                            const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
                            let t;
                            while ((t = walker.nextNode())) {
                                if (matchesFilter(t.textContent)) {
                                    if (t.parentElement) t.parentElement.remove();
                                    break;
                                }
                            }
                        } catch(e) {}
                    }
                }
            }
        });
 
        observer.observe(document.body, { childList: true, subtree: true });
        console.log("[Userscript] DOM Observer aktywny — filtruje powiadomienia.");
    }
 
    // ---------- AUTOSTART ----------
    const interval = setInterval(() => {
        if (document.body) {
            clearInterval(interval);
            createButton();
            setupDOMObserver();
        }
    }, 400);
 
})();