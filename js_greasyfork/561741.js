// ==UserScript==
// @name         Ваш ход в телеграме
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      sussy baka license
// @description  Ввести в коде токен своего бота и айди чата. Открыть второй девайс с боем и скриптом и нажать слева сверху на кнопку "Ваш ход"
// @author       Something begins
// @match        https://www.heroeswm.ru/war*
// @match        https://my.lordswm.com/war*
// @match        https://www.lordswm.com/war*
// @grant        GM_xmlhttpRequest
// @connect      api.telegram.org
// @downloadURL https://update.greasyfork.org/scripts/561741/%D0%92%D0%B0%D1%88%20%D1%85%D0%BE%D0%B4%20%D0%B2%20%D1%82%D0%B5%D0%BB%D0%B5%D0%B3%D1%80%D0%B0%D0%BC%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/561741/%D0%92%D0%B0%D1%88%20%D1%85%D0%BE%D0%B4%20%D0%B2%20%D1%82%D0%B5%D0%BB%D0%B5%D0%B3%D1%80%D0%B0%D0%BC%D0%B5.meta.js
// ==/UserScript==

const BOT_TOKEN = 'телеграм токен';
const CHAT_ID = 'айди аккаунта пользователя'; // свой айди можно получить написав /start боту @RawDataBot: айди в message -> from -> id
// нужно обязательно одноразово активировать своего бота командой /start, иначе оповещения проходить не будут
const NICKNAME = "свой ник в гвд"

/* =======================
   CORE LOGIC
   ======================= */

function setBattleSpeed(value) {
    if (value === 0) return value;
    else if (value < 1) {
        unsafeWindow.timer_interval = Math.abs(value) * 20;
        return value;
    }
    unsafeWindow.animspeed_def = unsafeWindow.animspeed = value;
    unsafeWindow.animspeed_init = unsafeWindow.animspeed > 4 ? 0.5 : 2;
    unsafeWindow.timer_interval = Math.abs(value - 20);
    !unsafeWindow.timer_interval && unsafeWindow.timer_interval++;
    return value;
}

function isAuto(){
    for (let i = log_lines.length - 1; i > 0; i--){
        if (!log_lines[i].includes(NICKNAME)) continue;
        if (log_lines[i].includes("переходит под автоматическое управление")) return true;
        if (log_lines[i].includes("возвращается под контроль персонажа")) return false;
    }
    return false;
}

function isTargetTurn(curTurn = 0){
    return stage.pole.obj[heroes[stage.pole.obj[atb[curTurn]].owner]]?.nametxt === NICKNAME;
}

function countNextTargets(i = 0){
    while (true) {
        if (isTargetTurn(i+1)) i++;
        else return i;
    }
}

let lastATB, lastActive = false;

function isNotifyCreature() {
    if (atb[0] === lastATB) return false;
    lastATB = atb[0];

    if (isTargetTurn()){
        if (!lastActive && lastActive !== undefined) {
            lastActive = true;
            return stage.pole.obj[atb[0]].nametxt + `[${stage.pole.obj[atb[0]].nownumber}]`;
        }
    } else {
        lastActive = false;
    }

    return false;
}

/* =======================
   TELEGRAM SENDER (ANDROID SAFE)
   ======================= */

function sendTelegram(text) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const payload = JSON.stringify({
        chat_id: CHAT_ID,
        text: text
    });

    console.log("TG send:", text);

    if (typeof GM !== 'undefined' && GM.xmlHttpRequest) {
        GM.xmlHttpRequest({
            method: "POST",
            url: url,
            headers: { "Content-Type": "application/json" },
            data: payload,
            onload: res => console.log("TG OK:", res.responseText),
            onerror: err => console.error("TG ERROR:", JSON.stringify(err))
        });
    } else if (typeof GM_xmlhttpRequest !== 'undefined') {
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: { "Content-Type": "application/json" },
            data: payload,
            onload: res => console.log("TG OK:", res.responseText),
            onerror: err => console.error("TG ERROR:", JSON.stringify(err))
        });
    } else {
        console.error("No GM request API available");
    }
}

/* =======================
   INIT BUTTON + MONITOR
   ======================= */

let settings_interval = setInterval(() => {
    try {
        if (Object.keys(unsafeWindow.stage.pole.obj).length !== 0) {
            clearInterval(settings_interval);

            if (battle_ended) throw new Error("Battle already finished");

            document.querySelector(".toolbar_TopLeft")
                .insertAdjacentHTML('beforeend',
                    "<button id='your_turn'>Ваш ход</button><button id='your_turn_remove' style='color:red'>X</button>"
                );

            const button = document.querySelector("#your_turn");
            const removeButton = document.querySelector("#your_turn_remove");

            removeButton.addEventListener("click", e => {
                e.preventDefault();
                button.remove();
                removeButton.remove();
                console.log("Buttons removed");
            });

            button.addEventListener("click", e => {
                e.preventDefault();
                setBattleSpeed(4);

                sendTelegram("TEST: кнопка нажата, оповещения для " + NICKNAME + " включены");

                button.remove();
                removeButton.remove();

                console.log("Monitoring started");

                const monitoringInterval = setInterval(() => {
                    try {
                        if (battle_ended) {
                            clearInterval(monitoringInterval);
                            console.log("Battle ended, monitoring stopped");
                        }

                        if (isAuto()) return;

                        const msg = isNotifyCreature();
                        const targetCount = countNextTargets();

                        if (msg) {
                            const tgMessage = "Ход " + msg + (targetCount ? ", " + targetCount + " своих дальше" : "");
                            sendTelegram(tgMessage);
                        }
                    } catch (e) {
                        console.error("Loop error:", e.stack || e);
                    }
                }, 200);
            });
        }
    } catch (e) {
        console.error("Init error:", e.stack || e);
    }
}, 300);
