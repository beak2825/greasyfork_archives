// ==UserScript==
// @name         Autowołajka na discord
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Auto wołajka na discorda na herosów i tytanów + widget
// @include      http://*.margonem.pl/*
// @include      https://*.margonem.pl/*
// @grant        none
// @author       NSP
// @icon         https://micc.garmory-cdn.cloud/obrazki/itemy/pie/pierscien1284.gif
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556321/Autowo%C5%82ajka%20na%20discord.user.js
// @updateURL https://update.greasyfork.org/scripts/556321/Autowo%C5%82ajka%20na%20discord.meta.js
// ==/UserScript==

function run(Engine) {
    let alreadyCalled = [];

    //----ADDING WIDGET credit to https://github.com/nerthus-margonem/nerthusaddon
    const defaultPosition = [6, 'bottom-right-additional'];

    const addWidgetToDefaultWidgetSet = function() {
        Engine.widgetManager.addKeyToDefaultWidgetSet(
            'heroski',
            defaultPosition[0],
            defaultPosition[1],
            'Wołacz',
            'green',
            changeheroskiState
        );
    };

    // 🔧 użycie bez jQuery (bo na Androidzie czasem $ nie działa w tym momencie)
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .main-buttons-container .widget-button .icon.heroski {
                background-image: url("https://micc.garmory-cdn.cloud/obrazki/itemy/pie/pierscien1284.gif");
                background-position: 0;
            }
        </style>
    `);

    const addWidgetButtons = Engine.widgetManager.addWidgetButtons;
    Engine.widgetManager.addWidgetButtons = function(additionalBarHide) {
        addWidgetButtons.call(Engine.widgetManager, additionalBarHide);
        addWidgetToDefaultWidgetSet();
        createButtonNI();
        Engine.widgetManager.addWidgetButtons = addWidgetButtons;
    };

    if (Engine.interfaceStart) {
        addWidgetToDefaultWidgetSet();
        createButtonNI();
    }

    function createButtonNI() {
        if (Engine.interfaceStart && Object.keys(Engine.widgetManager.getDefaultWidgetSet()).includes('heroski')) {
            let heroskiPos = defaultPosition;
            const serverStoragePos = Engine.serverStorage.get(Engine.widgetManager.getPathToHotWidgetVersion());
            if (serverStoragePos && serverStoragePos.heroski) heroskiPos = serverStoragePos.heroski;

            Engine.widgetManager.createOneWidget('heroski', { heroski: heroskiPos }, true, []);
            Engine.widgetManager.setEnableDraggingButtonsWidget(false);
        } else setTimeout(createButtonNI, 500);
    }

    // ---- Tworzenie okna ustawień ----
    var heroski = document.createElement("div");
    heroski.id = "heroski";
    heroski.style.cssText = "position:absolute;top:200px;left:200px;width:220px;height:400px;background-color:white;z-index:999;display:none;border-radius:10px;padding:5px;";
    document.querySelector(".game-window-positioner").appendChild(heroski);

    const changeheroskiState = function() {
        heroski.style.display = heroski.style.display === "block" ? "none" : "block";
    };

    // ---- Ustawienia lokalne ----
    if (localStorage.getItem('webhook_heroski') == null) localStorage.setItem('webhook_heroski', '');
    var webhook = localStorage.getItem('webhook_heroski');
    if (localStorage.getItem('ping_here') == null) localStorage.setItem('ping_here', false);
    var ping_here = localStorage.getItem('ping_here') == "true";
    if (localStorage.getItem('ping_everyone') == null) localStorage.setItem('ping_everyone', false);
    var ping_everyone = localStorage.getItem('ping_everyone') == "true";
    if (localStorage.getItem('special_heros') == null) localStorage.setItem('special_heros', '');
    var special_heros = localStorage.getItem('special_heros');
    if (localStorage.getItem('special_tytan') == null) localStorage.setItem('special_tytan', '');
    var special_tytan = localStorage.getItem('special_tytan');
    if (localStorage.getItem('tytan_webhook') == null) localStorage.setItem('tytan_webhook', '');
    var tytan_webhook = localStorage.getItem('tytan_webhook');

    // ---- HTML panelu ustawień ----
    heroski.innerHTML = `
        <center><b>Ustawienia Wołacza</b></center><br>
        <label>Webhook:</label><br><input id="webhook_heroski" style="width:90%" value="${webhook}">
        <br><br><input type="checkbox" id="ping_here_checkbox"><label for="ping_here_checkbox"> @here</label>
        <br><input type="checkbox" id="ping_everyone_checkbox"><label for="ping_everyone_checkbox"> @everyone</label>
        <br><br><label>Specjalny ping (herosy):</label><br><input id="special_heros_input" style="width:90%" value="${special_heros}">
        <br><br><label>Specjalny ping (tytany):</label><br><input id="special_tytan_input" style="width:90%" value="${special_tytan}">
        <br><br><label>Webhook tytanów:</label><br><input id="tytan_webhook_input" style="width:90%" value="${tytan_webhook}">
        <br><br><center><button id="zapisz_heroski">Zapisz</button></center>
    `;

    document.getElementById("ping_here_checkbox").checked = ping_here;
    document.getElementById("ping_everyone_checkbox").checked = ping_everyone;

    function saveWebhook() {
        localStorage.setItem('webhook_heroski', document.getElementById("webhook_heroski").value);
        localStorage.setItem('ping_here', document.getElementById("ping_here_checkbox").checked);
        localStorage.setItem('ping_everyone', document.getElementById("ping_everyone_checkbox").checked);
        localStorage.setItem('special_heros', document.getElementById("special_heros_input").value);
        localStorage.setItem('special_tytan', document.getElementById("special_tytan_input").value);
        localStorage.setItem('tytan_webhook', document.getElementById("tytan_webhook_input").value);
        message("✅ Zapisano ustawienia wołacza!");
    }

    document.getElementById("zapisz_heroski").addEventListener("click", saveWebhook);

    // ---- Wysyłanie do Discorda ----
    function sendDiscordAlert(nick, lvl, map, x, y, icon, istitan) {
        let webhook = localStorage.getItem('webhook_heroski');
        let tytan_webhook = localStorage.getItem('tytan_webhook');
        let ping_here = localStorage.getItem('ping_here') == "true";
        let ping_everyone = localStorage.getItem('ping_everyone') == "true";
        let special_heros = localStorage.getItem('special_heros');
        let special_tytan = localStorage.getItem('special_tytan');

        let content_start = "";
        if (special_heros && !istitan) content_start = special_heros;
        else if (special_tytan && istitan) content_start = special_tytan;
        else if (ping_here) content_start = "@here";
        else if (ping_everyone) content_start = "@everyone";

        const request = new XMLHttpRequest();
        request.open('POST', (tytan_webhook && istitan) ? tytan_webhook : webhook, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({
            content: `${content_start} ${nick} (${lvl}) - ${map} (${x},${y})!`,
            username: Engine.hero.d.nick, 
            avatar_url: `https://micc.garmory-cdn.cloud/obrazki/postacie/${Engine.hero.d.icon}`,
        }));
    }

    // ---- Wykrywanie NPC ----
    if (Engine && Engine.npcs && Engine.npcs.check) {
        window.API.addCallbackToEvent("newNpc", function(npc) {
            if (npc.d.wt > 79 && !alreadyCalled.includes(npc.d.nick)) {
                var tip = npc.tip[0];
                if (tip.indexOf("tytan") != -1) {
                    message("🛡️ Wołam na " + npc.d.nick);
                    sendDiscordAlert(npc.d.nick, npc.d.lvl, Engine.map.d.name, npc.d.x, npc.d.y, npc.d.icon, true);
                    alreadyCalled.push(npc.d.nick);
                }
            }
            if (((npc.d.wt > 79 && npc.d.wt <= 99) || npc.d.nick.includes("Tropiciel Herosów")) && !alreadyCalled.includes(npc.d.nick)) {
                message("⚔️ Wołam na " + npc.d.nick);
                sendDiscordAlert(npc.d.nick, npc.d.lvl, Engine.map.d.name, npc.d.x, npc.d.y, npc.d.icon, false);
                alreadyCalled.push(npc.d.nick);
            }
        });
    } else {
        setTimeout(function() { run(window.Engine); }, 100);
    }
}

// ✅ Czekaj aż Engine się załaduje (Android fix)
(function waitForEngine() {
    if (typeof window.Engine !== "undefined" && window.Engine.widgetManager) {
        console.log("✅ Engine wykryty, uruchamiam skrypt.");
        run(window.Engine);
    } else {
        console.log("⏳ Czekam na Engine...");
        setTimeout(waitForEngine, 500);
    }
})();
