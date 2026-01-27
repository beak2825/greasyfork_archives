// ==UserScript==
// @name         Auto-attacker
// @namespace    http://tampermonkey.net/
// @version      1.14.0
// @description  Automatycznie atakuje osoby z listy (wymaga działającego UnMod_varriz na stronie)
// @author       Varriz
// @license      MIT
// @include      *://*.bloodwars.pl/*
// @include      *://*.bloodwars.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556039/Auto-attacker.user.js
// @updateURL https://update.greasyfork.org/scripts/556039/Auto-attacker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---- TOAST (na stronie) ----
    function push(msg, type = "info") {
        try {
            const box = document.createElement("div");
            box.className = "aa_push aa_push_" + type;
            box.textContent = msg;

            document.body.appendChild(box);

            setTimeout(() => {
                box.classList.add("aa_push_show");
            }, 20);

            setTimeout(() => {
                box.classList.remove("aa_push_show");
                setTimeout(() => box.remove(), 300);
            }, 4500);
        } catch (e) {
            console.error("Auto-attacker push error:", e, msg);
        }
    }

    // ---- BROWSER PUSH (system notifications) ----
    function browserPush(message, title = "Auto-attacker", icon = null) {
        try {
            if (!("Notification" in window)) return;

            function send() {
                new Notification(title, {
                    body: message,
                    icon: icon || "https://bloodwars.interia.pl/gfx/logo.png"
                });
            }

            if (Notification.permission === "granted") {
                send();
                return;
            }

            if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        send();
                    }
                });
            }
        } catch (e) {
            console.error("Auto-attacker browserPush error:", e, message);
        }
    }

    // ---- Wspólny helper: toast + browser push ----
    function notify(msg, type = "info") {
        push(msg, type);
        // ograniczamy spam: tylko ważniejsze typy idą jako browser push
        if (type === "error" || type === "warn") {
            browserPush(msg);
        }
    }

    // style notyfikacji
    (function () {
        const css = `
            .aa_push {
                position: fixed;
                top: 20px;
                right: -320px;
                z-index: 999999;
                background: #333;
                color: #fff;
                padding: 10px 18px;
                margin-top: 10px;
                border-radius: 6px;
                font-size: 13px;
                font-family: Arial, sans-serif;
                box-shadow: 0 0 10px rgba(0,0,0,0.4);
                opacity: 0.97;
                transition: right 0.3s ease-in-out;
            }
            .aa_push_show {
                right: 20px;
            }
            .aa_push_error {
                background: #c62828;
            }
            .aa_push_ok {
                background: #2e7d32;
            }
            .aa_push_warn {
                background: #ed6c02;
            }
        `;
        const st = document.createElement("style");
        st.textContent = css;
        document.head.appendChild(st);
    })();

    // --- identyfikator świata (jak w innych modach) ---
    var hostParts = location.host.split('.');
    var id = hostParts[0];
    if (hostParts[2] === 'net') {
        id = id + 'en';
    }

    // --- klucze w GM ---
    var STORAGE = {
        enabled:       id + '_AA_enabled',        // globalny: Auto-attacker włączony
        running:       id + '_AA_running',        // stan przycisku (ON/OFF)
        fromStrongest: id + '_AA_fromStrongest',  // atakuj od najmocniejszego (true = od góry, false = od dołu)
        onlyDefeated:  id + '_AA_onlyDefeated',   // atakuj tylko pokonanych (true = wymagaj "wygrana")
        attackSet:     id + '_AA_attackSet'       // numer zestawu do ataków (tekst)
    };

    function getSetting(key, defVal) {
        return GM_getValue(key, defVal);
    }

    function setSetting(key, value) {
        GM_setValue(key, value);
    }

    function isGlobalEnabled() {
        return !!getSetting(STORAGE.enabled, true);
    }

    function isRunning() {
        return !!getSetting(STORAGE.running, false);
    }

    // --- wykrywanie, czy UnMod_varriz jest aktywny (po elemencie "?" w rogu) ---
    function isUnmodActive() {
        var candidates = document.querySelectorAll('div[onclick]');
        for (var i = 0; i < candidates.length; i++) {
            var el = candidates[i];
            var onclickAttr = el.getAttribute('onclick') || '';

            if (onclickAttr.indexOf("conowego.split('^').join") !== -1 ||
                onclickAttr.indexOf('conowego.split("^").join') !== -1) {

                var txt = (el.textContent || '').trim();
                if (txt === '?') {
                    return true;
                }
            }
        }
        return false;
    }

    // --- helper: "Urządź zasadzkę" z licznikiem (menulink albo activemenulink) ---
    // Wymagania:
    // - musi istnieć span.menuSmallCount
    // - pierwsza liczba w tym tekście musi być > 0
    //   np. "· 26"  -> 26  -> OK
    //       "· 0/1" -> 0   -> NIE OK (0 zasadzek, 1 oblężenie)
    function hasAmbushWithCount() {
        var ambushLink =
            document.querySelector('a.menulink[href*="?a=ambush"]') ||
            document.querySelector('a.activemenulink[href*="?a=ambush"]');
        if (!ambushLink) return false;

        var countSpan = ambushLink.querySelector('.menuSmallCount');
        if (!countSpan) return false;

        var text = countSpan.textContent || '';
        var match = text.match(/(\d+)/); // pierwsza liczba
        if (!match) return false;

        var attacks = parseInt(match[1], 10);
        if (isNaN(attacks) || attacks <= 0) {
            return false;
        }

        return true;
    }

    // --- helper: pobierz numer zestawu przy Zbrojowni (?a=equip) ---
    function getEquipSetNumber() {
        var equipLink =
            document.querySelector('a.menulink[href*="?a=equip"]') ||
            document.querySelector('a.activemenulink[href*="?a=equip"]');
        if (!equipLink) return null;

        var countSpan = equipLink.querySelector('.menuSmallCount');
        if (!countSpan) return null;

        var text = countSpan.textContent || '';
        var match = text.match(/(\d+)/);
        if (!match) return null;

        var num = parseInt(match[1], 10);
        if (isNaN(num)) return null;
        return num;
    }

    function getConfiguredAttackSet() {
        return String(getSetting(STORAGE.attackSet, '0')).trim();
    }

    function isCorrectAttackSet() {
        var configured = getConfiguredAttackSet();
        var equipNum = getEquipSetNumber();
        if (equipNum === null) return false;
        return String(equipNum) === configured;
    }

    // --- helper: czy jesteś zablokowany wyprawą na liście celów ---
    function isAmbushBlockedByExpedition() {
        var errorTd = document.querySelector('div.auBid td.error');
        return !!errorTd;
    }

    // --- ogólne warunki działania w środku loopa ---
    function conditionsOk() {
        if (!isRunning() || !isGlobalEnabled()) return false;
        if (!isUnmodActive()) return false;

        // brak lub 0 zasadzek -> stop
        if (!hasAmbushWithCount()) {
            notify('Brak dostępnych zasadzek lub masz 0 zasadzek. Auto-attacker zostanie wyłączony.', "error");
            stopAutoAttacker();
            return false;
        }

        // w trakcie działania też pilnujemy zgodności zestawu
        if (!isCorrectAttackSet()) {
            notify('Wybierz zestaw do ataków zgodny z ustawieniami Auto-attackera.', "warn");
            stopAutoAttacker();
            return false;
        }

        return true;
    }

    // --- helper: odpal onclick obrazka w kontekście strony (attackController.selectAttackTarget(...)) ---
    function runOnclickInPage(imgElement, doneCallback) {
        var onclickCode = imgElement.getAttribute('onclick');
        if (!onclickCode) {
            if (doneCallback) doneCallback(false);
            return;
        }

        var attempts = 0;
        var maxAttempts = 40; // 40 * 250ms = 10s
        var interval = 250;

        function tryRun() {
            if (!isRunning() || !isGlobalEnabled()) return;

            if (typeof unsafeWindow !== 'undefined' &&
                unsafeWindow.attackController &&
                typeof unsafeWindow.attackController.selectAttackTarget === 'function') {

                try {
                    unsafeWindow.eval(onclickCode);
                    if (doneCallback) doneCallback(true);
                } catch (e) {
                    console.error('Auto-attacker: błąd przy eval(onclick):', e);
                    if (doneCallback) doneCallback(false);
                }
                return;
            }

            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(tryRun, interval);
            } else {
                console.warn('Auto-attacker: attackController się nie zainicjalizował na czas.');
                if (doneCallback) doneCallback(false);
            }
        }

        tryRun();
    }

    // ------------------ USTAWIENIA W /?a=settings ------------------
    (function injectSettingsUI() {
        var qs = location.search || '';
        //if (qs.indexOf('a=settings') === -1) return;
        if (qs != "?a=settings") return;
        // powiększamy min-height w #content-mid o +300px
        var contentMid = document.getElementById('content-mid');
        if (contentMid) {
            var styleAttr = contentMid.getAttribute('style') || '';
            var changed = false;
            var newStyle = styleAttr.replace(/min-height\s*:\s*(\d+)px/i, function (match, numStr) {
                var num = parseInt(numStr, 10);
                if (isNaN(num)) return match;
                var bigger = num + 300;
                changed = true;
                return 'min-height: ' + bigger + 'px';
            });

            if (!changed) {
                if (newStyle && !/;\s*$/.test(newStyle)) {
                    newStyle += ';';
                }
                newStyle += ' min-height: 300px;';
            }

            contentMid.setAttribute('style', newStyle);
        }

        var div = document.getElementsByClassName('hr720')[0];
        if (!div) return;

        // odczyt aktualnych wartości z GM
        var enabledDefault       = getSetting(STORAGE.enabled,       true);
        var fromStrongestDefault = getSetting(STORAGE.fromStrongest, true);
        var onlyDefeatedDefault  = getSetting(STORAGE.onlyDefeated,  true);
        var attackSetDefault     = getSetting(STORAGE.attackSet,     '0');

        var options = '';
        options += '<br /><br /><span ' +
            'style="color: #fff; text-shadow: 0px -1px 4px white,' +
            ' 0px -2px 10px yellow, 0px -10px 20px #ff8000, 0px -18px 40px red;' +
            ' font: 20px \'BlackJackRegular\';">' +
            'Auto-attacker</span><br /><br />';

        options += '<center><table width="90%" style="text-align: left; margin-top: 5px;' +
            ' font-family: \'Lucida Grande\', \'Lucida Sans Unicode\', Helvetica, Arial;">';

        // 1. Auto-attacker włączony
        options += '<tr><td>' +
            '<input type="checkbox" id="AA_enabled" ' +
            (enabledDefault ? 'checked="checked"' : '') +
            '> Auto-attacker włączony' +
            '</td></tr>';

        // 2. Atakuj od najmocniejszego
        options += '<tr><td>' +
            '<input type="checkbox" id="AA_fromStrongest" ' +
            (fromStrongestDefault ? 'checked="checked"' : '') +
            '> Atakuj od najmocniejszego (odznaczenie spowoduje, że będziesz atakował cele od ostatniego na liście)' +
            '</td></tr>';

        // 3. Atakuj tylko pokonanych
        options += '<tr><td>' +
            '<input type="checkbox" id="AA_onlyDefeated" ' +
            (onlyDefeatedDefault ? 'checked="checked"' : '') +
            '> Atakuj tylko pokonanych (odznaczenie spowoduje, że będziesz atakował wszystkich z listy)' +
            '</td></tr>';

        // 4. Zestaw do ataków (tekst)
        options += '<tr><td>' +
            'Zestaw do ataków: ' +
            '<input type="text" id="AA_attackSet" value="' + attackSetDefault + '" style="width:40px;">' +
            '</td></tr>';

        options += '</table></center><br /><br />';
        div.innerHTML += options;

        // **event delegacja** na kontenerze – łapie change z inputów, nawet jeśli DOM się podmieni
        div.addEventListener('change', function (e) {
            var target = e.target;
            if (!target || !target.id) return;

            if (target.id === 'AA_enabled') {
                var checked = !!target.checked;
                setSetting(STORAGE.enabled, checked);
                return;
            }

            if (target.id === 'AA_fromStrongest') {
                var fs = !!target.checked;
                setSetting(STORAGE.fromStrongest, fs);
                return;
            }

            if (target.id === 'AA_onlyDefeated') {
                var od = !!target.checked;
                setSetting(STORAGE.onlyDefeated, od);
                return;
            }

            if (target.id === 'AA_attackSet') {
                var val = String(target.value || '').trim();
                setSetting(STORAGE.attackSet, val);
                return;
            }
        }, false);

        // dodatkowo, żeby tekst aktualizował się też "w locie"
        div.addEventListener('keyup', function (e) {
            var target = e.target;
            if (!target || target.id !== 'AA_attackSet') return;
            var val = String(target.value || '').trim();
            setSetting(STORAGE.attackSet, val);
        }, false);

        // zapisujemy aktualne wartości, żeby były na pewno w GM (inicjalizacja)
        setSetting(STORAGE.enabled,       enabledDefault);
        setSetting(STORAGE.fromStrongest, fromStrongestDefault);
        setSetting(STORAGE.onlyDefeated,  onlyDefeatedDefault);
        setSetting(STORAGE.attackSet,     attackSetDefault);
    })();

    // ------------------ PŁYWAJĄCY BUTTON ------------------
    function updateFloatingButtonVisual(btn, running) {
        if (!btn) return;
        btn.textContent = 'auto-atakuj: ' + (running ? 'ON' : 'OFF');
        btn.style.background = running ? '#4caf50' : '#777';
        btn.style.opacity = running ? '0.9' : '0.6';
    }

    function stopAutoAttacker() {
        setSetting(STORAGE.running, false);
        var btn = document.getElementById('AA_floatingButton');
        if (btn) {
            updateFloatingButtonVisual(btn, false);
        }
    }

    function createFloatingButton() {
        var btn = document.createElement('button');
        btn.id = 'AA_floatingButton';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.left = '110px';
        btn.style.zIndex = '9999';
        btn.style.padding = '4px 8px';
        btn.style.fontSize = '11px';
        btn.style.borderRadius = '4px';
        btn.style.border = '1px solid #000';
        btn.style.cursor = 'pointer';
        btn.style.fontFamily = 'Tahoma, Arial, sans-serif';

        updateFloatingButtonVisual(btn, isRunning());

        btn.addEventListener('click', function () {
            var current = isRunning();
            var newState = !current;

            if (newState) {
                if (!isGlobalEnabled()) {
                    notify('Auto-attacker jest wyłączony w ustawieniach (/a=settings).', "warn");
                    stopAutoAttacker();
                    return;
                }
                if (!isUnmodActive()) {
                    notify('Auto-attacker wymaga aktywnego UnMod_varriz (brak przycisku "?").', "warn");
                    stopAutoAttacker();
                    return;
                }
                if (!hasAmbushWithCount()) {
                    notify('Brak dostępnych zasadzek lub masz 0 zasadzek. Auto-attacker zostanie wyłączony.', "error");
                    stopAutoAttacker();
                    return;
                }
                if (!isCorrectAttackSet()) {
                    notify('Wybierz zestaw do ataków zgodny z ustawieniami Auto-attackera.', "warn");
                    stopAutoAttacker();
                    return;
                }
            }

            setSetting(STORAGE.running, newState);
            updateFloatingButtonVisual(btn, newState);

            if (newState) {
                notify('Auto-attacker: ON', "ok");
                startAutoAttackFlow();
            } else {
                notify('Auto-attacker: OFF', "info");
            }
        }, false);

        document.body.appendChild(btn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingButton, false);
    } else {
        createFloatingButton();
    }

    // ------------------ czekanie na UnMod ------------------
    function waitForUnmodAndRun(callback) {
        var interval = 300;
        var maxAttempts = 100;
        var attempts = 0;

        function loop() {
            if (!isRunning() || !isGlobalEnabled()) return;

            if (!isUnmodActive()) {
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(loop, interval);
                } else {
                    stopAutoAttacker();
                }
                return;
            }

            if (!hasAmbushWithCount()) {
                notify('Brak dostępnych zasadzek lub masz 0 zasadzek. Auto-attacker zostanie wyłączony.', "error");
                stopAutoAttacker();
                return;
            }

            if (!isCorrectAttackSet()) {
                notify('Wybierz zestaw do ataków zgodny z ustawieniami Auto-attackera.', "warn");
                stopAutoAttacker();
                return;
            }

            callback();
        }

        loop();
    }

    // ------------------ FLOW ------------------
    function startAutoAttackFlow() {
        if (!isRunning() || !isGlobalEnabled()) return;

        var search = location.search || '';

        if (search.indexOf('a=ambush&opt=atk') === -1) {
            location.href = '/?a=ambush&opt=atk';
            return;
        }

        waitForUnmodAndRun(processTargetList);
    }

    function handleCurrentPageOnLoad() {
        if (!isRunning() || !isGlobalEnabled()) return;

        var search = location.search || '';

        if (search.indexOf('a=ambush&opt=atk') !== -1) {
            waitForUnmodAndRun(processTargetList);
        } else if (search.indexOf('a=ambush') !== -1) {
            waitForUnmodAndRun(scheduleRestartFromFightPage);
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        handleCurrentPageOnLoad();
    } else {
        window.addEventListener('DOMContentLoaded', handleCurrentPageOnLoad, false);
    }

    // ------------------ helper: znajdź targetImg w tabeli z uwzględnieniem opcji ------------------
    function findTargetImgInTable(table) {
        var rows = table.querySelectorAll('tbody tr');

        var onlyDefeated = !!getSetting(STORAGE.onlyDefeated, true);
        var fromStrongest = !!getSetting(STORAGE.fromStrongest, true);

        if (fromStrongest) {
            // od góry listy
            for (var i = 0; i < rows.length; i++) {
                var t1 = rows[i];
                var img = evaluateRowForTarget(t1, onlyDefeated);
                if (img) return img;
            }
        } else {
            // od dołu listy
            for (var j = rows.length - 1; j >= 0; j--) {
                var t2 = rows[j];
                var img2 = evaluateRowForTarget(t2, onlyDefeated);
                if (img2) return img2;
            }
        }

        return null;
    }

    // helper do oceny pojedynczego wiersza pod kątem celu
    function evaluateRowForTarget(tr, onlyDefeated) {
        if (tr.classList.contains('commentRow')) return null;

        if (onlyDefeated) {
            var winImg = tr.querySelector('td img[alt="wygrana"]');
            if (!winImg) return null;
        }

        var timeImg = tr.querySelector('td.timeBallContainer img');
        if (!timeImg) return null;

        var altVal = timeImg.getAttribute('alt');
        if (altVal === '0') {
            return timeImg;
        }
        return null;
    }

    // ------------------ KROK 1: wybór celu z tabeli (z wieloma próbami) ------------------
    function processTargetList() {
        var attempts = 0;
        var maxAttempts = 40;   // 40 * 500ms = 20s
        var interval = 500;

        function step() {
            if (!conditionsOk()) return;

            if (isAmbushBlockedByExpedition()) {
                notify('Nie możesz rozpocząć ataku (w trakcie wyprawy). Auto-attacker zostanie wyłączony.', "error");
                stopAutoAttacker();
                return;
            }

            var table = document.querySelector('table.attack_targetList');
            if (!table) {
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(step, interval);
                } else {
                    if (!conditionsOk()) return;
                    location.reload();
                }
                return;
            }

            var targetImg = findTargetImgInTable(table);
            if (targetImg) {
                setTimeout(function () {
                    if (!conditionsOk()) return;

                    runOnclickInPage(targetImg, function (ok) {
                        if (!ok) {
                            if (!conditionsOk()) return;
                            location.href = '/?a=ambush&opt=atk';
                            return;
                        }

                        clickAttackSubmitAfterDelay();
                    });
                }, 300);
            } else {
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(step, interval);
                } else {
                    if (!conditionsOk()) return;
                    location.reload();
                }
            }
        }

        step();
    }

    // ------------------ KROK 2: klik "ROZPOCZNIJ ATAK" gdy formularz gotowy ------------------
    function clickAttackSubmitAfterDelay() {
        var attempts = 0;
        var maxAttempts = 40;      // 40 * 250ms = 10 sekund
        var interval = 250;

        function tryClick() {
            if (!conditionsOk()) return;

            var formContainer = document.querySelector('.attack_addressFormContainer');
            var confirmed = document.getElementById('confirmedTarget');
            var confirmedVisible = confirmed && !confirmed.classList.contains('hidden');

            var submitBtn = formContainer
                ? formContainer.querySelector('input#submit2.button.actionButton')
                : document.querySelector('input#submit2.button.actionButton');

            var submitReady = false;
            if (submitBtn) {
                var val = (submitBtn.value || '').trim();
                if (!submitBtn.disabled && val !== 'Wybierz cel wpisując jego imię') {
                    submitReady = true;
                }
            }

            if (confirmedVisible && submitBtn && submitReady) {
                if(unsafeWindow.arkanaSet) {
                    unsafeWindow.arkanaSet();
                }
                submitBtn.click();
                return;
            }

            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(tryClick, interval);
            } else {
                if (!conditionsOk()) return;
                location.href = '/?a=ambush&opt=atk';
            }
        }

        setTimeout(tryClick, interval);
    }

    // ------------------ KROK 3: restart po walce ------------------
    function scheduleRestartFromFightPage() {
        setTimeout(function () {
            if (!conditionsOk()) return;
            location.href = '/?a=ambush&opt=atk';
        }, 11000);
    }

})();
