// ==UserScript==
// @name         Autowołajka Discord
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto wołajka na discorda na herosów i tytanów.
// @include      http://*.margonem.pl/*
// @include      https://*.margonem.pl/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560532/Autowo%C5%82ajka%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/560532/Autowo%C5%82ajka%20Discord.meta.js
// ==/UserScript==

(function () {

    function run(Engine) {

        /* ================== ANTY-SPAM ================== */
        const npcCooldown = new Map();
        let lastDiscordSend = 0;

        const NPC_COOLDOWN_MS = 3000;
        const GLOBAL_COOLDOWN_MS = 1200;

        setInterval(() => {
            const now = Date.now();
            for (const [id, time] of npcCooldown) {
                if (now - time > 60000) npcCooldown.delete(id);
            }
        }, 60000);

        /* ================== CACHE ================== */
        const discordCache = {
            webhook: localStorage.getItem("webhook_heroski") || "",
            tytan: localStorage.getItem("tytan_webhook") || "",
            ping_here: localStorage.getItem("ping_here") === "true",
            ping_everyone: localStorage.getItem("ping_everyone") === "true",
            special_heros: localStorage.getItem("special_heros") || "",
            special_tytan: localStorage.getItem("special_tytan") || ""
        };

        /* ================== DISCORD ================== */
        function sendDiscordAlert(npc, isTitan) {
            const now = Date.now();

            if (npcCooldown.has(npc.id) && now - npcCooldown.get(npc.id) < NPC_COOLDOWN_MS) return;
            if (now - lastDiscordSend < GLOBAL_COOLDOWN_MS) return;

            npcCooldown.set(npc.id, now);
            lastDiscordSend = now;

            let content = "";
            if (isTitan && discordCache.special_tytan) content = discordCache.special_tytan;
            else if (!isTitan && discordCache.special_heros) content = discordCache.special_heros;
            else if (discordCache.ping_here) content = "@here";
            else if (discordCache.ping_everyone) content = "@everyone";

            fetch((isTitan && discordCache.tytan) ? discordCache.tytan : discordCache.webhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: `${content} ${npc.d.nick} (${npc.d.lvl}) - ${Engine.map.d.name} (${npc.d.x},${npc.d.y})!`,
                    username: Engine.hero.d.nick,
                    avatar_url: `https://micc.garmory-cdn.cloud/obrazki/postacie/${Engine.hero.d.icon}`
                }),
                keepalive: true
            });
        }

        /* ================== NPC DETECT ================== */
        if (Engine?.npcs?.check) {
            window.API.addCallbackToEvent("newNpc", npc => {

                // TYTAN
                if (npc.d.wt >= 100) {
                    sendDiscordAlert(npc, true);
                    return;
                }

                // HEROS / TROPICIEL
                if ((npc.d.wt > 79 && npc.d.wt < 100) || npc.d.nick.includes("Tropiciel Herosów")) {
                    sendDiscordAlert(npc, false);
                }
            });
        }

        /* ================== MOBILE SETTINGS BUTTON ================== */
        const btn = document.createElement("div");
        btn.textContent = "⚙️";
        btn.style.cssText = `
            position:fixed;
            bottom:90px;
            right:15px;
            width:48px;
            height:48px;
            background:#1e1e1e;
            color:#fff;
            font-size:26px;
            display:flex;
            align-items:center;
            justify-content:center;
            border-radius:50%;
            z-index:99999;
            box-shadow:0 0 8px rgba(0,0,0,.6);
            user-select:none;
        `;
        document.body.appendChild(btn);

        const panel = document.createElement("div");
        panel.style.cssText = `
            position:fixed;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%);
            width:280px;
            background:#111;
            color:#fff;
            z-index:100000;
            padding:12px;
            border-radius:10px;
            display:none;
            font-size:14px;
        `;

        panel.innerHTML = `
            <b>Wołacz Discord</b><br><br>

            Webhook herosy:<br>
            <input id="wh1" style="width:100%"><br><br>

            Webhook tytany:<br>
            <input id="wh2" style="width:100%"><br><br>

            Specjalny ping herosy:<br>
            <input id="sp1" style="width:100%"><br><br>

            Specjalny ping tytany:<br>
            <input id="sp2" style="width:100%"><br><br>

            <label><input type="checkbox" id="ph"> @here</label><br>
            <label><input type="checkbox" id="pe"> @everyone</label><br><br>

            <button id="save">Zapisz</button>
        `;
        document.body.appendChild(panel);

        function loadSettings() {
            wh1.value = localStorage.getItem("webhook_heroski") || "";
            wh2.value = localStorage.getItem("tytan_webhook") || "";
            sp1.value = localStorage.getItem("special_heros") || "";
            sp2.value = localStorage.getItem("special_tytan") || "";
            ph.checked = localStorage.getItem("ping_here") === "true";
            pe.checked = localStorage.getItem("ping_everyone") === "true";
        }

        btn.onclick = () => {
            loadSettings();
            panel.style.display = panel.style.display === "none" ? "block" : "none";
        };

        save.onclick = () => {
            localStorage.setItem("webhook_heroski", wh1.value);
            localStorage.setItem("tytan_webhook", wh2.value);
            localStorage.setItem("special_heros", sp1.value);
            localStorage.setItem("special_tytan", sp2.value);
            localStorage.setItem("ping_here", ph.checked);
            localStorage.setItem("ping_everyone", pe.checked);
            panel.style.display = "none";
            location.reload();
        };
    }

    /* ================== ENGINE WAIT ================== */
    (function waitForEngine() {
        if (window.Engine && Engine.npcs && Engine.map) {
            run(Engine);
        } else {
            setTimeout(waitForEngine, 300);
        }
    })();

})();
