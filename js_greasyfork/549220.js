// ==UserScript==
// @name         Torn HiLo Helper (PDA)
// @namespace    https://torn.com/
// @version      1.4
// @description  Manual Hi/Lo card tracker for Torn City.
// @author       iiZod
// @match        https://www.torn.com/page.php?sid=highlow*
// @match        https://www.torn.com/page.php?sid=highLow*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549220/Torn%20HiLo%20Helper%20%28PDA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549220/Torn%20HiLo%20Helper%20%28PDA%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Wait until body exists (important for PDA) ---
    function waitForBody(fn) {
        if (document.body) fn();
        else new MutationObserver(() => {
            if (document.body) {
                fn();
                this.disconnect();
            }
        }).observe(document.documentElement, {childList: true});
    }

    // --- Deck + counters ---
    let deck = buildDeck();
    function buildDeck() {
        let d = {};
        ["2","3","4","5","6","7","8","9","10","J","Q","K","A"].forEach(r => d[r]=4);
        return d;
    }
    function resetDeck() {
        deck = buildDeck();
        localStorage.setItem("hiloDeck", JSON.stringify(deck));
        updateCounts();
    }
    function loadDeck() {
        let saved = localStorage.getItem("hiloDeck");
        if (saved) deck = JSON.parse(saved);
    }

    // --- Overlay UI ---
    function createOverlay() {
        // 🔥 Prevent duplicate overlays
        let old = document.getElementById("hilo-overlay");
        if (old) old.remove();

        loadDeck();

        let box = document.createElement("div");
        box.id = "hilo-overlay";
        Object.assign(box.style, {
            position:"fixed", top:"10px", right:"10px",
            background:"rgba(0,0,0,0.85)", color:"white",
            padding:"8px", borderRadius:"6px",
            fontSize:"12px", zIndex:9999,
            maxWidth:"90vw", maxHeight:"70vh",
            overflowY:"auto"
        });

        let header = document.createElement("div");
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";
        header.style.marginBottom = "6px";

        let title = document.createElement("span");
        title.textContent = "Hi/Lo Tracker";
        title.style.fontWeight = "bold";

        let toggle = document.createElement("button");
        toggle.textContent = "–";
        Object.assign(toggle.style, {
            background:"transparent", color:"white",
            border:"none", fontSize:"14px", cursor:"pointer"
        });
        toggle.onclick = () => {
            let body = box.querySelector(".hilo-body");
            body.style.display = body.style.display==="none" ? "block" : "none";
        };

        header.appendChild(title);
        header.appendChild(toggle);
        box.appendChild(header);

        let body = document.createElement("div");
        body.className = "hilo-body";

        // Grid of buttons
        let grid = document.createElement("div");
        Object.assign(grid.style, {
            display:"grid",
            gridTemplateColumns:"repeat(4, 1fr)",
            gap:"4px",
            marginBottom:"6px"
        });

        ["2","3","4","5","6","7","8","9","10","J","Q","K","A"].forEach(r => {
            let btn = document.createElement("button");
            btn.textContent = r;
            Object.assign(btn.style, {
                padding:"4px", fontSize:"12px", cursor:"pointer"
            });
            btn.onclick = () => {
                if (deck[r] > 0) {
                    deck[r]--;
                    localStorage.setItem("hiloDeck", JSON.stringify(deck));
                    setLastCard(r);
                    updateCounts();
                }
            };
            grid.appendChild(btn);
        });
        body.appendChild(grid);

        // Shuffle
        let shuffleBtn = document.createElement("button");
        shuffleBtn.textContent = "Shuffle";
        Object.assign(shuffleBtn.style, {
            width:"100%", marginBottom:"6px", padding:"4px"
        });
        shuffleBtn.onclick = resetDeck;
        body.appendChild(shuffleBtn);

        // Counters
        let counterDiv = document.createElement("div");
        counterDiv.id = "hilo-counts";
        body.appendChild(counterDiv);

        box.appendChild(body);
        document.body.appendChild(box);
        updateCounts();
    }

    // --- Update counts & suggestion ---
    function updateCounts() {
        let c = document.getElementById("hilo-counts");
        if (!c) return;

        let total = Object.values(deck).reduce((a,b)=>a+b,0);
        let counts = Object.entries(deck).map(([r,n])=>`${r}:${n}`).join(" ");
        c.innerHTML = `
            <div>Total left: ${total}</div>
            <div>${counts}</div>
        `;

        // Suggestion if last card known
        let last = getLastCard();
        if (last) {
            let rankOrder = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
            let idx = rankOrder.indexOf(last);
            let lower = 0, higher = 0;
            rankOrder.forEach((r,i)=>{
                if (i<idx) lower+=deck[r];
                if (i>idx) higher+=deck[r];
            });
            c.innerHTML += `
                <div>Last: ${last}</div>
                <div>Higher: ${higher}, Lower: ${lower}</div>
                <div>Best: <b>${higher>=lower?"HIGHER":"LOWER"}</b></div>
            `;
        }
    }

    // Store last clicked card
    function getLastCard() {
        return localStorage.getItem("hiloLastCard");
    }
    function setLastCard(r) {
        localStorage.setItem("hiloLastCard", r);
    }

    // --- Init ---
    waitForBody(()=>{
        createOverlay();
    });
})();