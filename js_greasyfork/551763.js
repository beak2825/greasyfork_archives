// ==UserScript==
// @name         Essowe Grzyby Margonem
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Send notifications about event npcs
// @icon         https://cdn-icons-png.flaticon.com/512/3656/3656824.png
// @connect      discordapp.com
// @match        https://arkantes.margonem.pl/
// @exclude      https://www.margonem.pl/*
// @exclude      https://forum.margonem.pl/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551763/Essowe%20Grzyby%20Margonem.user.js
// @updateURL https://update.greasyfork.org/scripts/551763/Essowe%20Grzyby%20Margonem.meta.js
// ==/UserScript==

(async function() {
    "use strict";

    function wait(resolve) {
        if (Engine?.allInit) {
            resolve();
        } else {
            setTimeout(() => wait(resolve), 100);
        }
    }

    async function sendDiscordMessage({ npc, map, hero }) {
        const npcIcon = await fetch(`https://micc.garmory-cdn.cloud/obrazki/npc/${npc.icon}`);
        const file = new File([await npcIcon.blob()], "npc.gif");

        const data = new FormData();
        data.append("files[0]", file);
        data.append("payload_json", JSON.stringify({
            username: npc.nick,
            avatar_url: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5e56605d-fd1b-4ef1-8cc2-e222421d4538/dedbyyw-ff7564ae-08d4-4b5e-be06-91852714ba4b.png/v1/fill/w_1280,h_1411/mushroom_icon_by_eudai_dedbyyw-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTQxMSIsInBhdGgiOiJcL2ZcLzVlNTY2MDVkLWZkMWItNGVmMS04Y2MyLWUyMjI0MjFkNDUzOFwvZGVkYnl5dy1mZjc1NjRhZS0wOGQ0LTRiNWUtYmUwNi05MTg1MjcxNGJhNGIucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.XY6FpCeTnDY0oLFL6ffqhufH6ifS7AzFYiEYp6JK0-c",
            content: `<@&1424685832467513376>`,
            embeds: [{
                color: 8388736,
                title: `${hero.nick} (${hero.lvl} lvl) znalazł GRZIBUNA!`,
                description: `${npc.nick} (${npc.lvl})\n${map.name} (${npc.x}, ${npc.y})

                Aktualny czas: <t:${unix_time()}:T>
                Czas zamknięcia: <t:${unix_time() + (npc.killSeconds ?? 15 * 61)}:T>
                **Koniec:  <t:${unix_time() + (npc.killSeconds ?? 15 * 61)}:R>**`,
                thumbnail: {
                    url: `attachment://npc.gif`
                },
            }],
        }));

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://discordapp.com/api/webhooks/1424789062832885840/Fty9Gc3eU4QSAqxLy0BvkHCaK-XUHzJxBrjZWYEEsafDrtn4tohddovKgP8-6DbEjim1",
            data,
        });
    }


    function notify({ map, hero, npc }) {
        sendDiscordMessage({ map, hero, npc });
    }

    await new Promise(wait);

    API.addCallbackToEvent(Engine.apiData.NEW_NPC, (npc) => {
        const allowedNpcs = ["Ogromna płomiennica tląca", "Ogromna dzwonkówka tarczowata", "Ogromny szpicak ponury", "Ogromny bulwiak pospolity", "Ogromny mroźlarz"];
        if (allowedNpcs.includes(npc.d.nick)) {
            const messages = Array.from(document.querySelectorAll(".LOCAL-message-wrapper > .chat-LOCAL-message"), (message) => message.innerText);
            const lastMessageIndex = messages.findLastIndex((message) => message.includes(`${npc.d.nick} (${npc.d.lvl} lvl), ${Engine.map.d.name} (${npc.d.x}, ${npc.d. y})`));
            if (lastMessageIndex !== -1) {
                const lastMessageTime = Object.values(Engine.chatController.getMessageList()["LOCAL"]).map(message => message.getTs())[lastMessageIndex];
                const timeSinceLastMessage = Date.now() / 1000 - lastMessageTime;
                if (timeSinceLastMessage < 15 * 60) {
                    return;
                }
            }

            notify({ map: Engine.map.d, hero: Engine.hero.d, npc: npc.d });
        }
    });
})();